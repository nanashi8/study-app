// scripts/ と tests/ では process.exit を呼ばない（requests/2026-11-11-audit-leftovers-fix.json）。
// 2026-11-11、Node 25 は process.exit の途中で、裏のコンパイル用スレッドの終了を待ったまま止まることがあると分かった
// （全教材監査が開始3秒で固まり、7時間そのままだった）。ふつうに終わる（最後まで流れる）ときは固まらない。
// 最後に終わるところは process.exitCode、途中で止めるところは scripts/stop.mjs の stop()、関数の中なら return。
import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { after, test } from 'node:test'
import { pathToFileURL } from 'node:url'

const made = []
after(() => made.forEach((dir) => rmSync(dir, { recursive: true, force: true })))
const temp = () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-no-exit-'))
  made.push(dir)
  return dir
}

const SCRIPT = /\.(?:mjs|cjs|js|ts|sh)$|^[^.]+$/
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, out)
    else if (SCRIPT.test(name)) out.push(relative(process.cwd(), path))
  }
  return out
}

// このテストと tests/audit-hang-guard.test.mjs は、検査のための正規表現の中に書く。
const CHECKERS = new Set(['tests/no-process-exit.test.mjs', 'tests/audit-hang-guard.test.mjs'])
const EXIT_CALL = /process\s*\.\s*(?:exit|reallyExit)\s*\(|process\s*\[\s*['"`](?:exit|reallyExit)['"`]\s*\]/

test('scripts/ と tests/ のどのファイルも process.exit を呼ばない', () => {
  const files = [...walk('scripts'), ...walk('tests')]
  assert.ok(files.length > 300, `${files.length}ファイル`)
  const found = []
  for (const file of files) {
    if (CHECKERS.has(file)) continue
    readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
      if (EXIT_CALL.test(line)) found.push(`${file}:${index + 1} ${line.trim()}`)
    })
  }
  assert.deepEqual(found, [])
  // 検査のためのファイルも、呼び出しとしては書かない（正規表現の中だけ）。
  for (const file of CHECKERS) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      if (EXIT_CALL.test(line)) assert.match(line, /\/.*process\\?\.\(?:?\(?(?:exit|reallyExit)|doesNotMatch|EXIT_CALL/, `${file}: ${line.trim()}`)
    }
  }
})

const STOP = pathToFileURL(resolve('scripts/stop.mjs')).href
const node = (dir, name, body, args = []) => {
  writeFileSync(join(dir, name), body)
  return spawnSync(process.execPath, [name, ...args], { cwd: dir, encoding: 'utf8', timeout: 30_000 })
}

test('stop() は終了コードを保って止め、止めたことは表示しない。本物の例外は今までどおり表示して 1', () => {
  const dir = temp()
  const body = `import { stop } from '${STOP}'\nconsole.log('前')\nif (process.argv[2]) { console.error('使い方'); stop(Number(process.argv[2])) }\nconsole.log('後')\n`
  for (const [args, code, out] of [[[], 0, '前\n後\n'], [['1'], 1, '前\n'], [['2'], 2, '前\n'], [['0'], 0, '前\n']]) {
    const result = node(dir, 'a.mjs', body, args)
    assert.equal(result.status, code, `${args} ${result.stderr}`)
    assert.equal(result.stdout, out)
    assert.doesNotMatch(result.stderr, /stop\(|Error/)
  }
  // 関数の中・待ったあとからも止められる。
  const later = node(dir, 'b.mjs', `import { stop } from '${STOP}'\nasync function main() { await new Promise((done) => setTimeout(done, 10)); stop(2) }\nawait main()\nconsole.log('ここには来ない')\n`)
  assert.deepEqual([later.status, later.stdout, later.stderr], [2, '', ''])
  // try の中で止めたら、catch は isStop で投げ直す。
  const caught = node(dir, 'c.mjs', `import { isStop, stop } from '${STOP}'\ntry { stop(3) } catch (error) { if (isStop(error)) throw error; console.log('捕まえた') }\n`)
  assert.deepEqual([caught.status, caught.stdout, caught.stderr], [3, '', ''])
  // 本物の例外。
  const real = node(dir, 'd.mjs', `import { stop } from '${STOP}'\nif (process.argv[2]) stop(0)\nthrow new Error('本物の誤り')\n`)
  assert.equal(real.status, 1)
  assert.match(real.stderr, /Error: 本物の誤り/)
  // 止める前の本物の例外も、止めたあとの本物の例外と同じに扱う（読み込むだけでは例外の扱いを変えない）。
  const imported = node(dir, 'e.mjs', `import '${STOP}'\nconsole.log(process.listenerCount('uncaughtException'))\n`)
  assert.equal(imported.stdout, '0\n')
})

test('書き換えた道具の終了コードは今までと同じ（使い方の誤り・通るとき・フックの止める合図）', () => {
  const run = (args, input) => spawnSync(process.execPath, args, { encoding: 'utf8', timeout: 120_000, input, env: { ...process.env, STUDY_APP_DEPLOY_STATUS: 'off' } })
  const usage = run(['scripts/check-level-cap-sheet.mjs'])
  assert.deepEqual([usage.status, usage.stderr.trim()], [2, '使い方: node scripts/check-level-cap-sheet.mjs <Excel のパス>'])
  const leftover = run(['scripts/checks/leftover-changes.mjs'])
  assert.equal(leftover.status, 2)
  assert.match(leftover.stdout, /^使い方: node scripts\/checks\/leftover-changes\.mjs --clones/)
  const words = run(['scripts/import-words.mjs', join(temp(), 'none.csv')])
  assert.equal(words.status, 1)
  assert.match(words.stderr, /❌ CSV が読めません/)
  const etymology = run(['scripts/etymology-report.mjs'])
  assert.equal(etymology.status, 0, etymology.stderr)
  // 依頼台帳のフック：守る場所の外は通す（0）、台帳のないセッションの変更は止める（2）。
  const edit = (file) => run(['scripts/check-requests.mjs', '--edit'], JSON.stringify({ session_id: 'no-such-session', tool_input: { file_path: resolve(file) } }))
  assert.equal(edit('README.md').status, 0)
  const blocked = edit('src/App.jsx')
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /requests\/ に依頼の原文と受け入れ条件/)
  assert.equal(run(['scripts/check-requests.mjs']).status, 0)
})

test('止められた順番待ちは、順番を手放してから同じ合図で止まり直す', async () => {
  const dir = temp()
  const lockDir = join(dir, 'lock')
  const child = spawn(process.execPath, ['--input-type=module', '-e',
    `import { acquireTestLock } from '${pathToFileURL(resolve('scripts/test-cache/lock.mjs')).href}'\nacquireTestLock('試し')\nconsole.log('持った')\nsetInterval(() => {}, 1000)`,
  ], { env: { ...process.env, STUDY_APP_TEST_LOCK_DIR: lockDir, STUDY_APP_TEST_LOCK_HELD: '' }, stdio: ['ignore', 'pipe', 'inherit'] })
  await new Promise((done) => child.stdout.once('data', done))
  assert.ok(existsSync(lockDir))
  for (const signal of ['SIGTERM']) child.kill(signal)
  const [code, signal] = await new Promise((done) => child.on('exit', (...result) => done(result)))
  assert.deepEqual([code, signal], [null, 'SIGTERM'])
  assert.ok(!existsSync(lockDir), '順番を持ったまま')
})
