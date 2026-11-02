import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { HEAVY_CONCURRENCY, LIGHT_CONCURRENCY, testGroups } from '../scripts/run-tests.mjs'
import { RECORD_TTL_MS } from '../scripts/test-cache/store.mjs'

const made = []
after(() => made.forEach((dir) => rmSync(dir, { recursive: true, force: true })))

const TESTS = {
  'reads-file.test.mjs': `import { readFileSync } from 'node:fs'; import { test } from 'node:test'; test('a', () => { readFileSync('data/a.txt') })`,
  'imports-module.test.mjs': `import { b } from '../data/b.mjs'; import { test } from 'node:test'; test('b', () => { if (!b) throw new Error('b') })`,
  'lists-dir.test.mjs': `import { readdirSync } from 'node:fs'; import { test } from 'node:test'; test('c', () => { readdirSync('listed') })`,
  'runs-script.test.mjs': `import { execFileSync } from 'node:child_process'; import { test } from 'node:test'; test('d', () => { execFileSync(process.execPath, ['data/script.mjs']) })`,
  'runs-git.test.mjs': `import { execFileSync } from 'node:child_process'; import { test } from 'node:test'; test('e', () => { execFileSync('git', ['--version']) })`,
  'runs-build.test.mjs': `import { test } from 'node:test'; const build = () => {}; test('h', () => { build({ }) })`,
  'unrelated.test.mjs': `import { test } from 'node:test'; test('f', () => {})`,
  'follows-data.test.mjs': `import { readFileSync } from 'node:fs'; import { test } from 'node:test'; test('g', () => { if (readFileSync('data/flag.txt', 'utf8').trim() !== 'ok') throw new Error('flag') })`,
}

function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-speed-'))
  made.push(dir)
  for (const path of ['tests', 'data', 'listed', 'scripts/test-cache']) mkdirSync(join(dir, path), { recursive: true })
  copyFileSync('scripts/run-tests.mjs', join(dir, 'scripts/run-tests.mjs'))
  for (const name of readdirSync('scripts/test-cache')) copyFileSync(`scripts/test-cache/${name}`, join(dir, 'scripts/test-cache', name))
  for (const [name, body] of Object.entries(TESTS)) writeFileSync(join(dir, 'tests', name), body)
  writeFileSync(join(dir, 'package-lock.json'), '{}')
  writeFileSync(join(dir, 'data/a.txt'), 'a')
  writeFileSync(join(dir, 'data/b.mjs'), 'export const b = 1')
  writeFileSync(join(dir, 'data/flag.txt'), 'ok')
  writeFileSync(join(dir, 'data/script-input.txt'), 'x')
  writeFileSync(join(dir, 'data/script.mjs'), `import { readFileSync } from 'node:fs'; readFileSync('data/script-input.txt')`)
  writeFileSync(join(dir, 'docs.txt'), 'nobody reads this')
  // 書いた直後に流すと「流している間に書き換わった」と区別がつかないので、時刻を過去へ戻す。
  settle(dir)
  return dir
}

function settle(dir) {
  const past = new Date(Date.now() - 60_000)
  const walk = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name)
      if (entry.isDirectory()) walk(full)
      else utimesSync(full, past, past)
    }
  }
  walk(dir)
}

function run(dir, ...args) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(AUDIT_TEST_|NODE_OPTIONS$|NODE_TEST_)/.test(key)))
  env.AUDIT_TEST_CACHE_DIR = join(dir, '.test-cache')
  const result = spawnSync(process.execPath, ['scripts/run-tests.mjs', ...args], { cwd: dir, env, encoding: 'utf8' })
  const summary = result.stdout.match(/(\d+) ファイルのうち (\d+) ファイルを流した/)
  assert.ok(summary, result.stdout + result.stderr)
  return { status: result.status, ran: Number(summary[2]), output: result.stdout }
}

const ALL = Object.keys(TESTS).length
// git を使うテストと vite の build を使うテストは、読んだものが分からないので毎回流す。
const ALWAYS = 2

test('全テストファイルがどちらかの組に入り、並列で流れる', () => {
  const { light, heavy } = testGroups()
  const files = readdirSync('tests').filter((name) => name.endsWith('.test.mjs')).map((name) => `tests/${name}`)
  assert.deepEqual([...light, ...heavy].sort(), files.sort())
  assert.ok(heavy.includes('tests/scroll-back-from-bottom.test.mjs'), 'ブラウザのテストは本数をしぼる組に入る')
  assert.ok(light.includes('tests/deploy-workflow.test.mjs'))
  assert.ok(LIGHT_CONCURRENCY > 1 && HEAVY_CONCURRENCY > 1)
})

test('npm test は全部を流し、全監査は変更に関係するテストだけ、audit:full は全部を流す', () => {
  const { scripts } = JSON.parse(readFileSync('package.json', 'utf8'))
  assert.equal(scripts.test, 'node scripts/run-tests.mjs --full')
  assert.equal(scripts['audit:full'], 'node scripts/record-content-audit.mjs --full')
  const audit = readFileSync('scripts/record-content-audit.mjs', 'utf8')
  assert.match(audit, /scripts\/run-tests\.mjs/)
  assert.match(audit, /'--full'/)
})

test('読むファイルが変わったテストだけ流し直す', () => {
  const dir = makeRepo()
  assert.equal(run(dir).ran, ALL)
  assert.equal(run(dir).ran, ALWAYS, '何も変えなければ毎回流すテストだけ')

  const changes = [
    ['docs.txt', 0, 'どのテストも読まないファイル'],
    ['data/a.txt', 1, 'readFileSync で読むファイル'],
    ['data/b.mjs', 1, 'import するファイル'],
    ['data/script-input.txt', 1, 'テストが動かした node のスクリプトが読むファイル'],
    ['data/script.mjs', 1, 'テストが動かすスクリプト'],
    ['tests/unrelated.test.mjs', 1, 'テスト自身'],
  ]
  for (const [file, expected, why] of changes) {
    const path = join(dir, file)
    writeFileSync(path, `${readFileSync(path, 'utf8')}\n// changed`)
    settle(dir)
    assert.equal(run(dir).ran, ALWAYS + expected, why)
    assert.equal(run(dir).ran, ALWAYS, `${why}：流した後はまた控えが効く`)
  }
})

test('読むフォルダへファイルが増えたら流し直す', () => {
  const dir = makeRepo()
  run(dir)
  writeFileSync(join(dir, 'listed/new.txt'), 'new')
  settle(dir)
  assert.equal(run(dir).ran, ALWAYS + 1)
})

test('落ちたテストは控えず、直して通るまで流し続ける', () => {
  const dir = makeRepo()
  run(dir)
  writeFileSync(join(dir, 'data/flag.txt'), 'broken')
  settle(dir)
  const first = run(dir)
  assert.notEqual(first.status, 0, '壊したら失敗する')
  assert.notEqual(run(dir).status, 0, '同じ中身なら前の合格を使わず、また失敗する')
  writeFileSync(join(dir, 'data/flag.txt'), 'ok')
  settle(dir)
  assert.equal(run(dir).status, 0)
})

test('--full は控えがあっても全部を流す', () => {
  const dir = makeRepo()
  run(dir)
  assert.equal(run(dir, '--full').ran, ALL)
})

test('依存パッケージが変わったら全部を流す', () => {
  const dir = makeRepo()
  run(dir)
  writeFileSync(join(dir, 'package-lock.json'), '{"changed":true}')
  settle(dir)
  assert.equal(run(dir).ran, ALL)
})

test('1日たった控えは使わない', () => {
  const dir = makeRepo()
  run(dir)
  const cache = join(dir, '.test-cache')
  for (const name of readdirSync(cache).filter((file) => file.endsWith('.json'))) {
    const record = JSON.parse(readFileSync(join(cache, name), 'utf8'))
    writeFileSync(join(cache, name), JSON.stringify({ ...record, passedAt: Date.now() - RECORD_TTL_MS - 1000 }))
  }
  assert.equal(run(dir).ran, ALL)
})
