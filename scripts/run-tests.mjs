#!/usr/bin/env node
// 全テストを並列で流す。軽いテストを先に流して早く落とし、ブラウザや開発サーバーを使う重いテストは本数をしぼる。
//   node scripts/run-tests.mjs          : 変更に関係するテストだけ流す（前回の合格から読むファイルが変わっていないテストは流さない）
//   node scripts/run-tests.mjs --full   : 全部流す（控えは書き直す）
import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { acquireTestLock } from './test-cache/lock.mjs'

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

function run(files, concurrency, env) {
  if (!files.length) return 0
  const result = spawnSync(process.execPath, ['--test', `--test-concurrency=${concurrency}`, ...files], { cwd: ROOT, env, stdio: 'inherit' })
  if (result.error) throw result.error
  return result.status ?? 1
}

function main() {
  const full = process.argv.includes('--full')
  const { light, heavy } = testGroups()
  const logDir = mkdtempSync(join(tmpdir(), 'study-app-test-run-'))
  const hitLog = join(logDir, 'hits')
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
  }
  const startedAt = Date.now()
  let status = run(light, LIGHT_CONCURRENCY, env)
  if (status === 0) status = run(heavy, HEAVY_CONCURRENCY, env)
  const hits = existsSync(hitLog) ? readFileSync(hitLog, 'utf8').trim().split('\n').filter(Boolean).length : 0
  rmSync(logDir, { recursive: true, force: true })
  const total = light.length + heavy.length
  console.log(`\nテスト ${total} ファイルのうち ${total - hits} ファイルを流した（${hits} ファイルは前回の合格から読むファイルが変わっていない）・${Math.round((Date.now() - startedAt) / 1000)}秒${status === 0 ? '' : '・失敗あり'}`)
  process.exit(status)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
