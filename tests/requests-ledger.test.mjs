import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadRequests, validateRequest } from '../scripts/check-requests.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const SCRIPT = new URL('../scripts/check-requests.mjs', import.meta.url).pathname

const criterion = (overrides = {}) => ({
  id: 'c1',
  text: '満たすこと',
  population: '全件',
  check: 'node -e "process.exit(0)"',
  status: 'todo',
  ...overrides,
})
const request = (criteria, overrides = {}) => ({
  id: 'r1',
  title: '依頼',
  asked: ['原文'],
  status: 'open',
  criteria,
  ...overrides,
})

function ledger(...requests) {
  const dir = mkdtempSync(join(tmpdir(), 'requests-'))
  requests.forEach((item, index) => writeFileSync(join(dir, `r${index}.json`), JSON.stringify(item)))
  return dir
}

function run(mode, dir, input = {}) {
  return spawnSync('node', [SCRIPT, `--${mode}`], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, CHECK_REQUESTS_DIR: dir },
  })
}

test('リポジトリの依頼台帳は、決まりどおりに書かれている', () => {
  const { requests, problems } = loadRequests()
  assert.deepEqual(problems, [])
  assert.ok(requests.length >= 1)
})

test('受け入れ条件には母集団と確認コマンドが要り、閉じた依頼は npm test で守り続ける', () => {
  assert.match(validateRequest(request([criterion({ population: '' })])).join('\n'), /population/)
  assert.match(validateRequest(request([criterion({ check: '' })])).join('\n'), /check/)
  assert.match(validateRequest(request([criterion({ status: 'needs-user' })])).join('\n'), /question/)
  assert.match(validateRequest(request([criterion({ status: 'waiting' })])).join('\n'), /waitingFor/)
  // 済んでいない条件を残したまま依頼を閉じられない。
  assert.match(validateRequest(request([criterion()], { status: 'done' })).join('\n'), /済んでいない条件/)
  // 閉じた依頼の確認は tests/*.test.mjs でなければならない。
  assert.match(validateRequest(request([criterion({ status: 'done' })], { status: 'done' })).join('\n'), /tests\/\*\.test\.mjs/)
  assert.deepEqual(validateRequest(request([criterion({ status: 'done', check: 'node --test tests/a.test.mjs' })], { status: 'done' })), [])
})

test('未の条件が残る間は、ターンを終えさせない', () => {
  const blocked = run('stop', ledger(request([criterion({ status: 'done' }), criterion({ id: 'c2' })])))
  const output = JSON.parse(blocked.stdout)
  assert.equal(output.decision, 'block')
  assert.match(output.reason, /c2/)
  // 利用者の判断待ち・裏の処理待ちだけなら終えてよい。
  const waiting = run('stop', ledger(request([
    criterion({ status: 'done' }),
    criterion({ id: 'c2', status: 'needs-user', question: 'どちらにしますか' }),
    criterion({ id: 'c3', status: 'waiting', waitingFor: 'デプロイ' }),
  ])))
  assert.equal(waiting.stdout.trim(), '')
  // 開いている依頼がなければ止めない。
  assert.equal(run('stop', ledger()).stdout.trim(), '')
})

test('開いている依頼がないと、src・tests・scripts を書き換えさせない', () => {
  const empty = ledger(request([criterion({ status: 'done', check: 'node --test tests/a.test.mjs' })], { status: 'done' }))
  const blocked = run('edit', empty, { tool_input: { file_path: 'src/lib/wordRelations.js' } })
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /requests\//)
  assert.equal(run('edit', empty, { tool_input: { file_path: 'docs/memo.md' } }).status, 0)
  assert.equal(run('edit', ledger(request([criterion()])), { tool_input: { file_path: 'src/App.jsx' } }).status, 0)
})

test('done にした条件の確認が通らなければ、コミット・プッシュさせない', () => {
  const lying = ledger(request([criterion({ status: 'done', check: 'node -e "process.exit(1)"' })]))
  const blocked = run('gate', lying, { tool_input: { command: 'git add -A && git commit -m x' } })
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /確認が通らない/)
  assert.equal(run('gate', lying, { tool_input: { command: 'git push origin main' } }).status, 2)
  // git 以外のコマンドは止めない。
  assert.equal(run('gate', lying, { tool_input: { command: 'npm test' } }).status, 0)
  const honest = ledger(request([criterion({ status: 'done' }), criterion({ id: 'c2' })]))
  assert.equal(run('gate', honest, { tool_input: { command: 'git commit -m x' } }).status, 0)
})

test('利用者の発言ごとに、決まりと未完了の条件を作業者に見せる', () => {
  const output = JSON.parse(run('prompt', ledger(request([criterion()]))).stdout)
  assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit')
  assert.match(output.hookSpecificOutput.additionalContext, /母集団/)
  assert.match(output.hookSpecificOutput.additionalContext, /\[未\] c1/)
})

test('フックは Stop・Edit/Write・Bash・利用者の発言のすべてにつながっている', () => {
  const settings = JSON.parse(read('.claude/settings.json'))
  const commands = (event) => (settings.hooks[event] ?? []).flatMap((entry) =>
    entry.hooks.map((hook) => ({ matcher: entry.matcher ?? '', command: hook.command })))
  assert.ok(commands('Stop').some((hook) => hook.command.includes('check-requests.mjs" --stop')))
  assert.ok(commands('UserPromptSubmit').some((hook) => hook.command.includes('check-requests.mjs" --prompt')))
  assert.ok(commands('PreToolUse').some((hook) => /Edit/.test(hook.matcher) && /Write/.test(hook.matcher) && hook.command.includes('--edit')))
  assert.ok(commands('PreToolUse').some((hook) => hook.matcher === 'Bash' && hook.command.includes('--gate')))
})

test('完了の決まりは、今回の失敗の原因ごとに対策を書いている', () => {
  const rules = read('CLAUDE.md')
  for (const cause of ['作りやすさで決めた', '自分が作った物差し', '黙って捨てた', '変更した画面しか見なかった']) {
    assert.ok(rules.includes(cause), cause)
  }
  for (const rule of ['母集団', 'check', 'needs-user', '母集団と達成数']) assert.ok(rules.includes(rule), rule)
})
