import assert from 'node:assert/strict'
import { execFileSync, spawn, spawnSync } from 'node:child_process'
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
  'lists-root.test.mjs': `import { readdirSync } from 'node:fs'; import { test } from 'node:test'; test('i', () => { readdirSync('.') })`,
  'runs-script.test.mjs': `import { execFileSync } from 'node:child_process'; import { test } from 'node:test'; test('d', () => { execFileSync(process.execPath, ['data/script.mjs']) })`,
  'runs-git.test.mjs': `import { execFileSync } from 'node:child_process'; import { test } from 'node:test'; test('e', () => { execFileSync('git', ['--version']) })`,
  'runs-build.test.mjs': `import { test } from 'node:test'; const build = () => {}; test('h', () => { build({ }) })`,
  'unrelated.test.mjs': `import { test } from 'node:test'; test('f', () => {})`,
  'follows-data.test.mjs': `import { readFileSync } from 'node:fs'; import { test } from 'node:test'; test('g', () => { if (readFileSync('data/flag.txt', 'utf8').trim() !== 'ok') throw new Error('flag') })`,
}

function makeRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-speed-'))
  made.push(dir, `${dir}-cache`, `${dir}-lock`)
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
  return runWith(dir, {}, ...args)
}

function runWith(dir, extraEnv, ...args) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(AUDIT_TEST_|NODE_OPTIONS$|NODE_TEST_)/.test(key)))
  // 控えと順番待ちは、作ったリポジトリの外に置く（中に置くと、いちばん上のフォルダの一覧と作業ツリーの指紋が変わる）。
  env.AUDIT_TEST_CACHE_DIR = `${dir}-cache`
  // 機械全体の順番待ちは、このテストの中だけのものにする（ほかのセッションの全監査を待たない）。
  env.STUDY_APP_TEST_LOCK_DIR = `${dir}-lock`
  delete env.STUDY_APP_TEST_LOCK_HELD
  Object.assign(env, extraEnv)
  const result = spawnSync(process.execPath, ['scripts/run-tests.mjs', ...args], { cwd: dir, env, encoding: 'utf8' })
  const summary = result.stdout.match(/(\d+) ファイルのうち (\d+) ファイルを流した/)
  assert.ok(summary, result.stdout + result.stderr)
  return { status: result.status, ran: Number(summary[2]), output: result.stdout }
}

const ALL = Object.keys(TESTS).length
// git を使うテストと vite の build を使うテストは、読んだものが分からない。git のリポジトリでなければ毎回流す。
const ALWAYS = 2

const git = (dir, ...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...args], { cwd: dir, encoding: 'utf8', env: Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_'))) })
function makeGitRepo() {
  const dir = makeRepo()
  git(dir, 'init', '-q')
  git(dir, 'add', '-A')
  git(dir, 'commit', '-q', '-m', 'start')
  return dir
}

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
    const changed = run(dir)
    assert.equal(changed.ran, ALWAYS + expected, why)
    if (file === 'data/a.txt') assert.match(changed.output, /1本 data\/a\.txt が変わった：reads-file/, '流し直した理由を出す')
    assert.equal(run(dir).ran, ALWAYS, `${why}：流した後はまた控えが効く`)
  }
})

// 2026-11-05、全監査で通った本番ビルドや git を読むテストを、commit・push の前の確認で毎回流し直していた。
test('読んだものが分からないテストは、作業ツリーの中身が前回の合格と同じなら流さない', () => {
  const dir = makeGitRepo()
  assert.equal(run(dir).ran, ALL)
  assert.equal(run(dir).ran, 0, '中身も HEAD も同じなら、git やビルドを使うテストも流さない（全監査→commit の前の確認）')

  writeFileSync(join(dir, 'docs.txt'), 'changed')
  settle(dir)
  const changed = run(dir)
  assert.equal(changed.ran, ALWAYS, 'どのテストも読まないファイルでも、読んだものが分からないテストは流し直す')
  assert.match(changed.output, /2本 読んだものが分からないテストで、作業ツリーの中身が前回の合格と違う：runs-build・runs-git|2本 読んだものが分からないテストで、作業ツリーの中身が前回の合格と違う：runs-git・runs-build/)
  assert.equal(run(dir).ran, 0)

  git(dir, 'add', '-A')
  assert.equal(run(dir).ran, 1, 'git add で index が変わったら、git を使うテストだけ流す（ビルドは中身が同じ）')
  git(dir, 'commit', '-q', '-m', 'docs')
  const committed = run(dir)
  assert.equal(committed.ran, 1, 'commit したら、git を使うテストだけ流す（push の前の確認）')
  assert.match(committed.output, /1本 git を読むテストで、HEAD か index が前回の合格と違う：runs-git/)

  // 全監査がテストの後に書き直す全教材監査台帳は、指紋に入れない（commit の前の確認で流し直さない）。
  mkdirSync(join(dir, 'docs/audits'), { recursive: true })
  writeFileSync(join(dir, 'docs/audits/content-audit-ledger.json'), '{"auditedAt":"1"}')
  settle(dir)
  const added = run(dir)
  assert.equal(added.ran, 1, '全教材監査台帳を足しても、git やビルドのテストは流さない（流れるのは、いちばん上に docs/ が増えて一覧が変わったテストだけ）')
  assert.match(added.output, /1本 \. が変わった：lists-root/)
  writeFileSync(join(dir, 'docs/audits/content-audit-ledger.json'), '{"auditedAt":"2"}')
  git(dir, 'add', '-A')
  settle(dir)
  assert.equal(run(dir).ran, 0, '全教材監査台帳を書き直して git add しても流さない')

  writeFileSync(join(dir, 'new-untracked.txt'), 'x')
  settle(dir)
  assert.equal(run(dir).ran, ALWAYS + 1, '新しいファイル（無視していないもの）も中身に入る（いちばん上の一覧を読むテストも流れる）')
})

test('流している間に作業ツリーが変わったら、読んだものが分からないテストは控えない', () => {
  const dir = makeGitRepo()
  writeFileSync(join(dir, 'tests', 'runs-git.test.mjs'), `${TESTS['runs-git.test.mjs']}\nimport { writeFileSync } from 'node:fs'; writeFileSync('docs.txt', String(Math.random()))`)
  git(dir, 'add', '-A')
  git(dir, 'commit', '-q', '-m', 'edit while running')
  settle(dir)
  run(dir)
  // 同時に流れるビルドのテストは、書き換えの前後どちらで始まったかで控えが残ることがあるので、git のテストだけを見る。
  assert.match(run(dir).output, /runs-git/, '自分が中身を変えたテストは、毎回流す')
})

test('ビルドが作る dist/ や node_modules/ ができても、フォルダの一覧を読むテストは流し直さない', () => {
  const dir = makeRepo()
  run(dir)
  for (const path of ['dist/assets', 'node_modules/.vite', 'listed/node_modules']) mkdirSync(join(dir, path), { recursive: true })
  writeFileSync(join(dir, 'dist/index.html'), 'built')
  writeFileSync(join(dir, 'listed/.DS_Store'), 'finder')
  settle(dir)
  const after = run(dir)
  assert.equal(after.ran, ALWAYS, after.output)
  writeFileSync(join(dir, 'new-at-root.txt'), 'x')
  settle(dir)
  const added = run(dir)
  assert.equal(added.ran, ALWAYS + 1, 'いちばん上にふつうのファイルが増えたら流す')
  assert.match(added.output, /1本 \. が変わった：lists-root/)
})

test('中身の違う2つの所（作業ツリーと clone）で交互に流しても、どちらの控えも使える', () => {
  const dir = makeRepo()
  run(dir)
  const path = join(dir, 'data/a.txt')
  writeFileSync(path, 'b')
  settle(dir)
  assert.equal(run(dir).ran, ALWAYS + 1, '中身を変えたら流す')
  writeFileSync(path, 'a')
  settle(dir)
  assert.equal(run(dir).ran, ALWAYS, '前の中身に戻したら、前の控えを使う')
  writeFileSync(path, 'b')
  settle(dir)
  assert.equal(run(dir).ran, ALWAYS, 'もう一度変えても、その中身の控えを使う')
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
  const cache = `${dir}-cache`
  for (const name of readdirSync(cache).filter((file) => file.endsWith('.json'))) {
    const stored = JSON.parse(readFileSync(join(cache, name), 'utf8'))
    const records = stored.records.map((record) => ({ ...record, passedAt: Date.now() - RECORD_TTL_MS - 1000 }))
    writeFileSync(join(cache, name), JSON.stringify({ ...stored, records }))
  }
  assert.equal(run(dir).ran, ALL)
})

// 2つのセッションが同時に全監査を流すと、ブラウザのテストが重なってメモリが足りなくなり、両方遅れた（2026-11-03）。
const LOCK_SCRIPT = (label, holdMs) => `
import { acquireTestLock } from ${JSON.stringify(new URL('../scripts/test-cache/lock.mjs', import.meta.url).href)}
const release = acquireTestLock(${JSON.stringify(label)}, { log: () => {} })
console.log('start ${label}', Date.now())
await new Promise((resolve) => setTimeout(resolve, ${holdMs}))
console.log('end ${label}', Date.now())
release()
`
const runLock = (dir, label, holdMs, extraEnv = {}) => new Promise((resolve) => {
  const env = { ...process.env, STUDY_APP_TEST_LOCK_DIR: join(dir, 'lock'), ...extraEnv }
  delete env.STUDY_APP_TEST_LOCK_HELD
  Object.assign(env, extraEnv)
  const child = spawn(process.execPath, ['--input-type=module', '-e', LOCK_SCRIPT(label, holdMs)], { env })
  let out = ''
  child.stdout.on('data', (chunk) => { out += chunk })
  child.on('close', () => resolve(Object.fromEntries(out.trim().split('\n').map((line) => line.split(' ')).map(([kind, , at]) => [kind, Number(at)]))))
})

test('テストを流すのは機械全体で1つずつ：2つ目は1つ目が終わるまで待つ', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-lock-'))
  made.push(dir)
  const [first, second] = await Promise.all([runLock(dir, 'a', 800), new Promise((resolve) => setTimeout(() => resolve(runLock(dir, 'b', 10)), 200))])
  assert.ok(second.start >= first.end, `2つ目が先に始まった：${JSON.stringify({ first, second })}`)
})

test('順番を持っている処理の子は待たない（全監査の中のテストが全監査を待って止まらない）', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-lock-'))
  made.push(dir)
  const outer = runLock(dir, 'outer', 1500)
  await new Promise((resolve) => setTimeout(resolve, 300))
  const inner = await runLock(dir, 'inner', 10, { STUDY_APP_TEST_LOCK_HELD: '1' })
  assert.ok(inner.end < (await outer).end, '子が親の順番を待った')
})

test('持ち主の処理が消えた順番は取り上げる', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-lock-'))
  made.push(dir)
  mkdirSync(join(dir, 'lock'))
  writeFileSync(join(dir, 'lock', 'owner.json'), JSON.stringify({ pid: 999_999, label: '消えた処理', cwd: dir, at: Date.now() }))
  const started = Date.now()
  await runLock(dir, 'c', 10)
  assert.ok(Date.now() - started < 10_000)
})

test('全監査は段ごとの時間を出し、全監査・テスト・commit と push の前の確認は順番を待つ', () => {
  assert.match(readFileSync('scripts/record-content-audit.mjs', 'utf8'), /acquireTestLock\('全教材監査'\)[\s\S]*⏱ 全教材監査の時間/)
  assert.match(readFileSync('scripts/run-tests.mjs', 'utf8'), /acquireTestLock\('テスト'\)\n  const env = \{/)
  assert.match(readFileSync('scripts/check-requests.mjs', 'utf8'), /acquireTestLock\(mode\('git-commit'\)/)
})

test('CLAUDE.md に工程の決まり（関係するテストを先に・全監査は省かない・流し直した理由を見る）がある', () => {
  const rules = readFileSync('CLAUDE.md', 'utf8')
  assert.match(rules, /全監査の前に、変えたものに関係するテストと台帳の書き直しを先に流す/)
  assert.match(rules, /台帳や文書だけの変更でも全監査を省かない/)
  assert.match(rules, /流し直した理由/)
  assert.match(rules, /作業ツリーの中身が前回の合格と同じなら流さない/)
  assert.doesNotMatch(rules, /git など node 以外のコマンドを使うテストは毎回流す/)
})
