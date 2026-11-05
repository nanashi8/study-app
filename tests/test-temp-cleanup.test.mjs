// テストが一時フォルダに作ったもの（使い捨てのリポジトリ・台帳など）を、終わったら消しているかを確かめる。
// 2026-09-28、git のフックのテストと依頼台帳のテストが、npm test のたびに一時フォルダへ作ったものを残していた
// （使い捨てのリポジトリ 112個・台帳のフォルダ 169個がたまっていた）。
// 確かめるのは、テストを流す仕組み（scripts/test-cache/preload.mjs）：一時フォルダを使うテストのファイルを空の一時フォルダ（TMPDIR）で流し、
// 終わったときに何か残っていればそのファイルを落とす。前はこのファイルが、一時フォルダを使うテストを子としてもう一度流していた
// （ブラウザや読み取りのテストまで流し直し、約160秒。2026-11-05 に仕組みへ移した）。ここでは、その仕組みが働くことを確かめる。
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { USES_TEMP } from '../scripts/test-cache/store.mjs'

const TESTS = fileURLToPath(new URL('.', import.meta.url))
const ROOT = fileURLToPath(new URL('..', import.meta.url))
const PRELOAD = join(ROOT, 'scripts/test-cache/preload.mjs')

const tempTests = readdirSync(TESTS)
  .filter((name) => name.endsWith('.test.mjs'))
  .filter((name) => USES_TEMP.test(readFileSync(join(TESTS, name), 'utf8')))
  .sort()

const made = []
after(() => made.forEach((dir) => rmSync(dir, { recursive: true, force: true })))

test('一時フォルダを使うテストのファイルを、すべて仕組みが調べる', () => {
  // 2026-09-28 の時点の3つ。一時フォルダを使うテストを足せば、仕組みが自動で調べる。
  for (const name of ['leftover-changes.test.mjs', 'requests-gate.test.mjs', 'requests-ledger.test.mjs']) {
    assert.ok(tempTests.includes(name), name)
  }
  assert.ok(tempTests.includes(basename(fileURLToPath(import.meta.url))), 'このファイルも一時フォルダを使うので調べられる')
  // テストを流す道具（全監査・npm test）と commit・push の前の確認は、どれもこの仕組みを読み込む。
  assert.match(readFileSync(join(ROOT, 'scripts/run-tests.mjs'), 'utf8'), /--import=\$\{pathToFileURL\(PRELOAD\)\.href\}/)
  assert.match(readFileSync(join(ROOT, 'scripts/check-requests.mjs'), 'utf8'), /--import=\$\{pathToFileURL\(TEST_CACHE_PRELOAD\)\.href\}/)
})

// 小さなリポジトリに、後始末をするテスト・しないテスト・一時フォルダを使わないテストを置き、仕組みを読み込んで流す。
function runFixture(name, body) {
  const root = mkdtempSync(join(tmpdir(), 'study-app-temp-cleanup-'))
  made.push(root)
  mkdirSync(join(root, 'tests'))
  writeFileSync(join(root, 'package-lock.json'), '{}')
  writeFileSync(join(root, 'tests', name), body)
  const outerTmp = mkdtempSync(join(tmpdir(), 'study-app-temp-cleanup-outer-'))
  made.push(outerTmp)
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(AUDIT_TEST_|NODE_OPTIONS$|NODE_TEST_)/.test(key)))
  Object.assign(env, {
    TMPDIR: `${outerTmp}/`,
    NODE_OPTIONS: `--import=${pathToFileURL(PRELOAD).href}`,
    AUDIT_TEST_ROOT: root,
    AUDIT_TEST_CACHE_DIR: join(outerTmp, 'cache'),
    AUDIT_TEST_USE_CACHE: '1',
  })
  const result = spawnSync(process.execPath, ['--test', join('tests', name)], { cwd: root, env, encoding: 'utf8' })
  const left = readdirSync(outerTmp).filter((entry) => entry !== 'cache')
  return { status: result.status, output: `${result.stdout}${result.stderr}`, left }
}

const LEAVES = `import { mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { test } from 'node:test'
test('leaves', () => { mkdtempSync(join(tmpdir(), 'left-behind-')) })`
const CLEANS = `import { mkdtempSync, rmSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path'; import { test } from 'node:test'
test('cleans', () => { rmSync(mkdtempSync(join(tmpdir(), 'cleaned-')), { recursive: true }) })`

test('一時フォルダに作ったものを消さないテストのファイルは落ち、残したものの名前を出す', () => {
  const result = runFixture('leaves.test.mjs', LEAVES)
  assert.notEqual(result.status, 0, result.output)
  assert.match(result.output, /tests\/leaves\.test\.mjs が一時フォルダに作ったものを消さずに終わった：left-behind-/)
  assert.deepEqual(result.left, [], '確かめたあと、空の一時フォルダは片付ける（外の一時フォルダに残さない）')
  assert.notEqual(runFixture('leaves.test.mjs', LEAVES).status, 0, '落ちたテストの合格は控えない')
})

test('消したテストのファイルは通り、外の一時フォルダにも何も残さない', () => {
  const result = runFixture('cleans.test.mjs', CLEANS)
  assert.equal(result.status, 0, result.output)
  assert.deepEqual(result.left, [])
})
