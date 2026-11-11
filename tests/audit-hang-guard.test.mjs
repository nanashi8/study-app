// 全教材監査が固まったまま終わらない不具合の再発を止める（requests/2026-11-11-audit-hang-fix.json）。
// 2026-11-11、検証用の clone の全教材監査が開始3秒で固まり、7時間そのままだった。原因は、テストの控えが当たった子が呼ぶ
// process.exit(0) の中で、Node 25 が裏のコンパイル用スレッドの終了を待ったまま止まること（836回に6回）。
// 道具には時間切れがなく、固まっても失敗にならなかった。
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { AUDIT_STEPS } from '../scripts/record-content-audit.mjs'
import { FILE_IDLE_MS, FILE_MAX_MS, GROUP_TIMEOUT_MS, testGroups } from '../scripts/run-tests.mjs'
import { runWithDeadline, TIMED_OUT_STATUS } from '../scripts/test-cache/deadline.mjs'

const made = []
after(() => made.forEach((dir) => rmSync(dir, { recursive: true, force: true })))

const alive = (pid) => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}
const waitGone = async (pid) => {
  for (let i = 0; i < 50 && alive(pid); i++) await new Promise((done) => setTimeout(done, 100))
  return !alive(pid)
}

// 止まったまま CPU を使わない処理（Node の終了で固まったときと同じ形）。孫（sleep）も起こして、pid を外のファイルへ書く。
const HANG = `import { spawn } from 'node:child_process'; import { writeFileSync } from 'node:fs'
const grandchild = spawn('sleep', ['600'], { stdio: 'ignore' })
writeFileSync(process.env.HANG_PID_FILE, process.pid + ' ' + grandchild.pid)
Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0)`

function makeRepo(tests) {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-hang-'))
  made.push(dir, `${dir}-cache`, `${dir}-lock`, `${dir}-out`)
  mkdirSync(`${dir}-out`)
  for (const path of ['tests', 'scripts/test-cache']) mkdirSync(join(dir, path), { recursive: true })
  for (const name of ['run-tests.mjs', 'record-content-audit.mjs']) copyFileSync(`scripts/${name}`, join(dir, 'scripts', name))
  for (const name of readdirSync('scripts/test-cache')) copyFileSync(`scripts/test-cache/${name}`, join(dir, 'scripts/test-cache', name))
  for (const [name, body] of Object.entries(tests)) writeFileSync(join(dir, 'tests', name), body)
  writeFileSync(join(dir, 'package-lock.json'), '{}')
  // 書いた直後に流すと「流している間に書き換わった」と区別がつかないので、時刻を過去へ戻す。
  const past = new Date(Date.now() - 60_000)
  const walk = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const full = join(path, entry.name)
      if (entry.isDirectory()) walk(full)
      else utimesSync(full, past, past)
    }
  }
  walk(dir)
  return dir
}

function runTool(dir, script, extraEnv = {}) {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(AUDIT_TEST_|NODE_OPTIONS$|NODE_TEST_|STUDY_APP_)/.test(key)))
  env.AUDIT_TEST_CACHE_DIR = `${dir}-cache`
  env.STUDY_APP_TEST_LOCK_DIR = `${dir}-lock`
  env.HANG_PID_FILE = join(`${dir}-out`, 'pids')
  env.RAN_FILE = join(`${dir}-out`, 'ran')
  // 止められたテストは、記録用の一時フォルダを片付けられない。作ったリポジトリ専用の一時フォルダで流して、最後にまとめて消す。
  mkdirSync(join(`${dir}-out`, 'tmp'), { recursive: true })
  env.TMPDIR = `${join(`${dir}-out`, 'tmp')}/`
  Object.assign(env, extraEnv)
  const startedAt = Date.now()
  const result = spawnSync(process.execPath, [script], { cwd: dir, env, encoding: 'utf8', timeout: 120_000 })
  return { status: result.status, output: result.stdout + result.stderr, ms: Date.now() - startedAt, pidFile: env.HANG_PID_FILE, ranFile: env.RAN_FILE }
}

test('前回の合格を使うテストの子は process.exit を呼ばず、本体を流さずにふつうに終わる', () => {
  const preload = readFileSync('scripts/test-cache/preload.mjs', 'utf8')
  assert.doesNotMatch(preload, /process\.(?:exit|reallyExit|abort|kill)\(/, 'テストの控えの前処理は、プロセスを自分で終わらせない')
  assert.match(preload, /appendHit\(HIT_LOG, owner\)[\s\S]{0,400}skipTestBody\(process\.argv\[1\]\)\n\s*return/)

  const body = (name) => `import { appendFileSync } from 'node:fs'; import { test } from 'node:test'; appendFileSync(process.env.RAN_FILE, '${name}\\n'); test('t', () => {})`
  const names = ['a.test.mjs', 'b.test.mjs', 'c.test.mjs']
  const dir = makeRepo(Object.fromEntries(names.map((name) => [name, body(name)])))
  const first = runTool(dir, 'scripts/run-tests.mjs')
  assert.equal(first.status, 0, first.output)
  assert.match(first.output, /3 ファイルのうち 3 ファイルを流した/)
  const second = runTool(dir, 'scripts/run-tests.mjs')
  assert.equal(second.status, 0, second.output)
  assert.match(second.output, /3 ファイルのうち 0 ファイルを流した/)
  // 2回目は本体を読み込んでいない（流した印が増えない）。
  assert.deepEqual(readFileSync(second.ranFile, 'utf8').trim().split('\n').sort(), names)
})

test('テストを流す道具と全教材監査の道具は、ふつうに終わる経路で process.exit を呼ばない', () => {
  for (const file of ['scripts/run-tests.mjs', 'scripts/record-content-audit.mjs', 'scripts/test-cache/deadline.mjs']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /process\.(?:exit|reallyExit)\(/, file)
  }
})

test('固まったテストのファイルは、名前を出して止め、失敗にする。孫のプロセスも残さず、順番を手放す', async () => {
  const dir = makeRepo({
    'hang.test.mjs': HANG,
    'fine.test.mjs': `import { test } from 'node:test'; test('t', () => {})`,
  })
  const result = runTool(dir, 'scripts/run-tests.mjs', { STUDY_APP_STALL_IDLE_MS: '1500', STUDY_APP_STALL_POLL_MS: '300' })
  assert.notEqual(result.status, 0, result.output)
  assert.match(result.output, /❌ tests\/hang\.test\.mjs が固まった（CPU が \d+秒 動かない）ので止めた/)
  // 固まっていないテストは、そのまま合格する。
  assert.match(result.output, /ℹ pass 1\nℹ fail 1/)
  assert.match(result.output, /失敗あり/)
  assert.ok(result.ms < 60_000, `固まったテストを ${result.ms}ms で止めた`)
  const [child, grandchild] = readFileSync(result.pidFile, 'utf8').split(' ').map(Number)
  assert.ok(await waitGone(child), '固まったテストの子が残っている')
  assert.ok(await waitGone(grandchild), '固まったテストの孫が残っている')
  assert.ok(!existsSync(`${dir}-lock`), '順番を持ったまま')
  // 固まったテストは控えない（次も流れる）。
  assert.ok(!JSON.stringify(readdirSync(`${dir}-cache`, { recursive: true })).includes('hang'), '固まったテストを合格として控えた')
})

test('CPU を使い続けて終わらないテストのファイルも、時間で止める。組の全体にも時間切れがある', () => {
  const busy = `for (;;) {}`
  const dir = makeRepo({ 'busy.test.mjs': busy })
  const byFile = runTool(dir, 'scripts/run-tests.mjs', { STUDY_APP_TEST_FILE_MAX_MS: '1500', STUDY_APP_STALL_POLL_MS: '300' })
  assert.notEqual(byFile.status, 0, byFile.output)
  assert.match(byFile.output, /❌ tests\/busy\.test\.mjs が固まった（\d+分 たっても終わらない）ので止めた/)
  const byGroup = runTool(dir, 'scripts/run-tests.mjs', { STUDY_APP_TEST_GROUP_TIMEOUT_MS: '1500', STUDY_APP_STALL_POLL_MS: '300' })
  assert.notEqual(byGroup.status, 0, byGroup.output)
  assert.match(byGroup.output, /❌ 軽いテストの組 が \d+分 たっても終わらない（固まった）ので止めた。残っていたプロセス：[\s\S]*tests\/busy\.test\.mjs/)
  assert.ok(!existsSync(`${dir}-lock`), '順番を持ったまま')
})

test('テストの全ファイルが、時間切れのある組のどちらかで流れる', () => {
  const { light, heavy } = testGroups()
  const all = readdirSync('tests').filter((name) => name.endsWith('.test.mjs')).map((name) => `tests/${name}`).sort()
  assert.deepEqual([...light, ...heavy].sort(), all)
  assert.ok(FILE_IDLE_MS > 0 && FILE_IDLE_MS <= 10 * 60 * 1000)
  assert.ok(FILE_MAX_MS > FILE_IDLE_MS && FILE_MAX_MS <= 60 * 60 * 1000)
  for (const group of ['light', 'heavy']) assert.ok(GROUP_TIMEOUT_MS[group] > 0 && GROUP_TIMEOUT_MS[group] <= 2 * 60 * 60 * 1000, group)
})

test('時間切れになったコマンドは、子・孫ごと止めて 124 を返し、残っていたプロセスを出す', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-audit-hang-'))
  made.push(dir)
  const pidFile = join(dir, 'pids')
  const lines = []
  const startedAt = Date.now()
  const result = await runWithDeadline(process.execPath, ['--input-type=module', '-e', HANG], {
    env: { ...process.env, HANG_PID_FILE: pidFile, NODE_OPTIONS: '' },
    label: '止まる段',
    timeoutMs: 1500,
    pollMs: 300,
    log: (line) => lines.push(line),
  })
  assert.deepEqual({ status: result.status, timedOut: result.timedOut }, { status: TIMED_OUT_STATUS, timedOut: true })
  assert.ok(Date.now() - startedAt < 30_000)
  const [child, grandchild] = readFileSync(pidFile, 'utf8').split(' ').map(Number)
  assert.ok(await waitGone(child) && await waitGone(grandchild), '子か孫が残っている')
  assert.match(lines.join('\n'), /❌ 止まる段 が \d+分 たっても終わらない（固まった）ので止めた。残っていたプロセス：\n\s+pid \d+・CPU [\d.]+秒・sleep 600/)

  const fine = await runWithDeadline(process.execPath, ['-e', 'process.exitCode = 3'], { timeoutMs: 60_000, pollMs: 300, env: { ...process.env, NODE_OPTIONS: '' } })
  assert.deepEqual(fine, { status: 3, timedOut: false, stalled: [] })
})

test('全教材監査の全工程に時間切れがあり、固まった段で中止して順番を手放す', () => {
  // テスト・check:content・ビルド・audit:dist・git diff --check・台帳の書き直し・台帳の検証。
  assert.deepEqual(AUDIT_STEPS.map(({ args }) => args.join(' ').replace(/^.*scripts\//, 'scripts/')), [
    'scripts/run-tests.mjs',
    'run check:content',
    'exec -- vite build',
    'run audit:dist',
    'diff --check',
    'scripts/content-audit-ledger.mjs --write',
    'scripts/content-audit-ledger.mjs',
  ])
  for (const step of AUDIT_STEPS) assert.ok(step.timeoutMs >= 5 * 60 * 1000 && step.timeoutMs <= 60 * 60 * 1000, step.args.join(' '))
  const source = readFileSync('scripts/record-content-audit.mjs', 'utf8')
  assert.doesNotMatch(source, /spawnSync|execSync|execFileSync/, '全教材監査の段は、時間切れのある runWithDeadline だけで流す')

  // 最初の段（テストを流す道具）が固まる全教材監査。
  const dir = makeRepo({})
  writeFileSync(join(dir, 'scripts/run-tests.mjs'), HANG)
  const result = runTool(dir, 'scripts/record-content-audit.mjs', { STUDY_APP_AUDIT_STEP_TIMEOUT_MS: '1500', STUDY_APP_STALL_POLL_MS: '300' })
  assert.equal(result.status, TIMED_OUT_STATUS, result.output)
  assert.match(result.output, /❌ node scripts\/run-tests\.mjs が \d+分 たっても終わらない（固まった）ので止めた/)
  assert.match(result.output, /❌ 全教材監査を中止: node scripts\/run-tests\.mjs \(時間切れ・exit 124\)/)
  assert.doesNotMatch(result.output, /✅ 全教材監査と台帳記録が完了しました/)
  assert.ok(result.ms < 60_000)
  assert.ok(!existsSync(`${dir}-lock`), '順番を持ったまま')

})

test('commit・push の前の確認が流すコマンドにも時間切れがある', () => {
  const source = readFileSync('scripts/check-requests.mjs', 'utf8')
  const calls = [...source.matchAll(/\b(?:execSync|spawnSync)\(/g)].map((match) => source.slice(match.index, source.indexOf('\n', source.indexOf('})', match.index))))
  // tar の取り出し（git が出した中身を標準入力から受けるだけ）のほかは、どれも timeout を持つ。
  const without = calls.filter((call) => !/timeout:/.test(call) && !/spawnSync\('tar'/.test(call))
  assert.deepEqual(without, [])
  assert.ok(calls.length >= 3)
})

test('裏で流した監査の見張り方・固まったときの調べ方が、作業の決まりに書いてある', () => {
  const rules = readFileSync('CLAUDE.md', 'utf8')
  assert.match(rules, /監査が固まったとき/)
  assert.match(rules, /sample/)
  assert.match(rules, /audit exit/)
  assert.match(rules, /10分/)
})
