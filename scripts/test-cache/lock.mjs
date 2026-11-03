// 機械全体でテストを流すのを1つずつにする順番待ち。
// 2026-11-03、2つのセッションが同時に全監査を流し、ブラウザを使うテストが重なってメモリが足りなくなり（16GB の機械で
// スワップ 2.5GB・書き出し23万回）、どちらの全監査も大きく遅れた。並べて流すより、1つずつ流す方が早く終わる。
// 全監査（record-content-audit.mjs）・テスト（run-tests.mjs）・commit と push の前の確認（check-requests.mjs）がこれを通る。
// 待っている側は、先に流しているもの（何をしているか・いつからか）を表示する。
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

// 順番を持っている処理の子は、同じ順番の中で動く（持っている処理から呼ばれたテストが自分を待たない）。
export const LOCK_HELD_ENV = 'STUDY_APP_TEST_LOCK_HELD'
export const lockDir = () => process.env.STUDY_APP_TEST_LOCK_DIR ?? join(homedir(), '.cache', 'study-app-test-lock')
// 持ち主の処理が消えていたら（強制終了など）、順番を取り上げる。念のため、これより古い順番も取り上げる。
const STALE_MS = 3 * 60 * 60 * 1000
const WAIT_MS = 2000

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
const alive = (pid) => {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error.code === 'EPERM'
  }
}
const readOwner = (dir) => {
  try {
    return JSON.parse(readFileSync(join(dir, 'owner.json'), 'utf8'))
  } catch {
    return null
  }
}

/** 順番を取る（取れるまで待つ）。返り値は手放す関数。持っている処理の子なら、待たずに何もしない関数を返す。 */
export function acquireTestLock(label, { log = (line) => console.error(line) } = {}) {
  if (process.env[LOCK_HELD_ENV]) return () => {}
  const dir = lockDir()
  mkdirSync(join(dir, '..'), { recursive: true })
  const startedAt = Date.now()
  let lastLog = 0
  for (;;) {
    try {
      mkdirSync(dir)
      writeFileSync(join(dir, 'owner.json'), JSON.stringify({ pid: process.pid, label, cwd: process.cwd(), at: Date.now() }))
      break
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      const owner = readOwner(dir)
      // 作ったばかりで持ち主を書く前のときは、少し待てば書かれる。
      const stale = owner ? (!alive(owner.pid) || Date.now() - owner.at > STALE_MS) : Date.now() - startedAt > 10_000
      if (stale) {
        rmSync(dir, { recursive: true, force: true })
        continue
      }
      if (owner && Date.now() - lastLog >= 60_000) {
        lastLog = Date.now()
        log(`⏳ ほかのテストが終わるのを待っています（${owner.label}・${owner.cwd}・${Math.round((Date.now() - owner.at) / 60000)}分前から）。待ち ${Math.round((Date.now() - startedAt) / 1000)}秒`)
      }
      sleep(WAIT_MS)
    }
  }
  const waited = Date.now() - startedAt
  if (waited > WAIT_MS) log(`⏳ 順番待ち ${Math.round(waited / 1000)}秒`)
  process.env[LOCK_HELD_ENV] = '1'
  let released = false
  const release = () => {
    if (released) return
    released = true
    delete process.env[LOCK_HELD_ENV]
    if (readOwner(dir)?.pid === process.pid) rmSync(dir, { recursive: true, force: true })
  }
  process.on('exit', release)
  // 止められたとき（Ctrl+C・kill）も手放す。
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.once(signal, () => process.exit(128 + 2))
  return release
}
