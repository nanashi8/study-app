#!/usr/bin/env node
// 全テストを並列で流す。軽いテストを先に流して早く落とし、ブラウザや開発サーバーを使う重いテストは本数をしぼる。
//   node scripts/run-tests.mjs          : 変更に関係するテストだけ流す（前回の合格から読むファイルが変わっていないテストは流さない）
//   node scripts/run-tests.mjs --full   : 全部流す（控えは書き直す）
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { envMs, runWithDeadline, stallWatcher } from './test-cache/deadline.mjs'
import { acquireTestLock } from './test-cache/lock.mjs'
import { missSummary } from './test-cache/store.mjs'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const PRELOAD = join(ROOT, 'scripts/test-cache/preload.mjs')
export const CACHE_DIR = process.env.AUDIT_TEST_CACHE_DIR ?? join(homedir(), '.cache', 'study-app-test-cache')
export const LIGHT_CONCURRENCY = 8
export const HEAVY_CONCURRENCY = 3
const HEAVY = /playwright|createServer\(\{|startCustomCardBrowser|preview\(\{|\bbuild\(\{/

export function testGroups(root = ROOT) {
  const files = readdirSync(join(root, 'tests')).filter((name) => name.endsWith('.test.mjs')).sort().map((name) => `tests/${name}`)
  const heavy = files.filter((file) => HEAVY.test(readFileSync(join(root, file), 'utf8')))
  return { light: files.filter((file) => !heavy.includes(file)), heavy }
}

// 固まったテストを時間切れで失敗にする（scripts/test-cache/deadline.mjs）。
// テストのファイル1つ：CPU が5分動かない、または30分たっても終わらないなら、そのファイルだけ止めて失敗にする。
// 組の全体：軽いテスト20分・重いテスト35分（合わせて、全教材監査のテストの段の60分より短い）を過ぎたら、残りをまとめて止める。
export const FILE_IDLE_MS = 5 * 60 * 1000
export const FILE_MAX_MS = 30 * 60 * 1000
export const GROUP_TIMEOUT_MS = { light: 20 * 60 * 1000, heavy: 35 * 60 * 1000 }
const TEST_FILE = /(?:^|\s)(tests\/[^\s/]+\.test\.mjs)\s*$/

async function run(group, files, concurrency, env) {
  if (!files.length) return 0
  const { status, timedOut, stalled } = await runWithDeadline(process.execPath, ['--test', `--test-concurrency=${concurrency}`, ...files], {
    cwd: ROOT,
    env,
    label: group === 'light' ? '軽いテストの組' : '重いテストの組',
    timeoutMs: envMs('STUDY_APP_TEST_GROUP_TIMEOUT_MS', GROUP_TIMEOUT_MS[group]),
    pollMs: envMs('STUDY_APP_STALL_POLL_MS', undefined),
    watch: stallWatcher({
      // node --test がテストのファイルごとに起こす子（コマンドの最後がテストのファイル）。
      pick: (row) => row.command.match(TEST_FILE)?.[1] ?? null,
      idleMs: envMs('STUDY_APP_STALL_IDLE_MS', FILE_IDLE_MS),
      maxMs: envMs('STUDY_APP_TEST_FILE_MAX_MS', FILE_MAX_MS),
    }),
  })
  // 固まった子を止めても node --test が失敗にしなかったときのために、ここでも失敗にする。
  return (timedOut || stalled.length) && status === 0 ? 1 : status
}

async function main() {
  const full = process.argv.includes('--full')
  const { light, heavy } = testGroups()
  const logDir = mkdtempSync(join(tmpdir(), 'study-app-test-run-'))
  const hitLog = join(logDir, 'hits')
  const missLog = join(logDir, 'misses')
  // ほかのセッションのテストと重ねない（メモリが足りなくなって両方遅れる）。全監査の中から呼ばれたときは待たない。
  // 子に渡す環境を作る前に取る（子のテストが呼ぶ run-tests が、この順番を待たないように）。
  acquireTestLock('テスト')
  const env = {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, `--import=${pathToFileURL(PRELOAD).href}`].filter(Boolean).join(' '),
    AUDIT_TEST_ROOT: ROOT,
    AUDIT_TEST_CACHE_DIR: CACHE_DIR,
    AUDIT_TEST_USE_CACHE: full ? '0' : '1',
    AUDIT_TEST_HIT_LOG: hitLog,
    AUDIT_TEST_MISS_LOG: missLog,
  }
  const startedAt = Date.now()
  let status = await run('light', light, LIGHT_CONCURRENCY, env)
  if (status === 0) status = await run('heavy', heavy, HEAVY_CONCURRENCY, env)
  const hits = existsSync(hitLog) ? readFileSync(hitLog, 'utf8').trim().split('\n').filter(Boolean).length : 0
  const misses = missSummary(missLog)
  rmSync(logDir, { recursive: true, force: true })
  const total = light.length + heavy.length
  console.log(`\nテスト ${total} ファイルのうち ${total - hits} ファイルを流した（${hits} ファイルは前回の合格から読むファイルが変わっていない）・${Math.round((Date.now() - startedAt) / 1000)}秒${status === 0 ? '' : '・失敗あり'}`)
  // 流し直した理由（変わっていないのに流れたテストを見つけるため。2026-11-05）。
  if (misses.length) console.log(`流し直した理由：\n${misses.join('\n')}`)
  // process.exit は呼ばない（Node 25 は終了の途中で固まることがある。2026-11-11）。ふつうに終わらせる。
  process.exitCode = status
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
