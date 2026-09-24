import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { loadRequests, touchedLedgers, validateRequest } from '../scripts/check-requests.mjs'

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

function run(mode, dir, input = {}, env = {}) {
  return spawnSync('node', [SCRIPT, `--${mode}`], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, CHECK_REQUESTS_DIR: dir, ...env },
  })
}

// 会話ログ（Claude Code の transcript と同じ JSONL）。道具の呼び出しを1行ずつ書く。
const toolUse = (name, input) => ({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'tool_use', name, input }] } })
const hookText = (text) => ({ type: 'user', message: { role: 'user', content: [{ type: 'tool_result', content: text }] } })
const jsonl = (entries) => `${entries.map((entry) => JSON.stringify(entry)).join('\n')}\n`

function transcript(...entries) {
  const path = join(mkdtempSync(join(tmpdir(), 'transcript-')), 'session.jsonl')
  writeFileSync(path, jsonl(entries))
  return path
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
  // Stop フックは、そのセッションが作った・書き換えた依頼だけで止まる（ほかのセッションの依頼では止まらない）。
  assert.match(rules, /そのセッションが作った・書き換えた依頼/)
})

test('会話ログからは、そのセッションが書いた台帳だけを持ち主として割り出す', () => {
  const owned = touchedLedgers(jsonl([
    toolUse('Write', { file_path: '/repo/requests/2026-01-01-a.json', content: '{}' }),
    toolUse('Edit', { file_path: 'requests/2026-01-01-b.json', old_string: 'todo', new_string: 'done' }),
    toolUse('Bash', { command: "node -e \"const p='requests/2026-01-01-c.json'; fs.writeFileSync(p, s)\"" }),
    toolUse('Bash', { command: 'git add requests/2026-01-01-d.json src/App.jsx && git commit -m x' }),
    // 読むだけのコマンド、ほかのファイルへの書き込み、フックの一覧に出てくる名前は持ち主の印にしない。
    toolUse('Bash', { command: 'cat requests/2026-01-01-e.json && node scripts/check-requests.mjs --report' }),
    toolUse('Write', { file_path: '/repo/tests/x.test.mjs', content: "read('requests/2026-01-01-f.json')" }),
    toolUse('Read', { file_path: '/repo/requests/2026-01-01-g.json' }),
    hookText('【開いている依頼】\n■ 依頼（requests/2026-01-01-h.json）'),
  ]))
  assert.deepEqual([...owned].sort(), ['2026-01-01-a.json', '2026-01-01-b.json', '2026-01-01-c.json', '2026-01-01-d.json'])
})

test('Stop フックは、そのセッションが作った・書き換えた依頼の未の条件だけで止める', () => {
  const dir = ledger(request([criterion({ id: 'mine' })]), request([criterion({ id: 'theirs' })], { id: 'r2' }))
  const reasonOf = (result) => (result.stdout.trim() ? JSON.parse(result.stdout).reason : '')
  // 自分の依頼（r0.json）の未だけで止める。ほかのセッションの依頼（r1.json）の未は理由に入れない。
  const mine = run('stop', dir, { session_id: 's1', transcript_path: transcript(toolUse('Write', { file_path: '/repo/requests/r0.json', content: '{}' })) })
  assert.equal(JSON.parse(mine.stdout).decision, 'block')
  assert.match(reasonOf(mine), /r0\.json の mine/)
  assert.doesNotMatch(reasonOf(mine), /theirs/)
  // ほかのセッションの依頼しか残っていなければ止めない（読んだだけ・名前が出てきただけの依頼は持ち主にならない）。
  const other = transcript(
    toolUse('Bash', { command: 'cat requests/r1.json' }),
    hookText('■ 依頼（requests/r0.json）'),
  )
  assert.equal(run('stop', dir, { session_id: 's2', transcript_path: other }).stdout.trim(), '')
  // Bash で台帳に書き込んだセッションは、その依頼の持ち主。
  const bash = transcript(toolUse('Bash', { command: "node -e \"fs.writeFileSync('requests/r1.json', x)\"" }))
  assert.match(reasonOf(run('stop', dir, { transcript_path: bash })), /r1\.json の theirs/)
  // 会話ログが読めないときは、これまでどおり開いている全依頼で止める。
  for (const input of [{}, { transcript_path: join(tmpdir(), 'no-such-transcript.jsonl') }]) {
    const legacy = reasonOf(run('stop', dir, input))
    assert.match(legacy, /mine/)
    assert.match(legacy, /theirs/)
  }
  // 台帳の書き方の誤りは、どのセッションも止める。
  const broken = ledger(request([criterion({ population: '' })]))
  assert.match(reasonOf(run('stop', broken, { transcript_path: other })), /台帳の誤り/)
})

test('開いている依頼ごとに持ち主のセッションを出し、持ち主のいない依頼があれば知らせる', () => {
  const dir = ledger(request([criterion()]), request([criterion()], { id: 'r2' }))
  const sessions = mkdtempSync(join(tmpdir(), 'transcripts-'))
  writeFileSync(join(sessions, 'session-a.jsonl'), jsonl([toolUse('Write', { file_path: '/repo/requests/r0.json', content: '{}' })]))
  writeFileSync(join(sessions, 'session-b.jsonl'), jsonl([toolUse('Bash', { command: 'cat requests/r1.json' })]))
  const orphan = run('owners', dir, {}, { CHECK_REQUESTS_TRANSCRIPTS: sessions })
  assert.equal(orphan.status, 1)
  assert.match(orphan.stdout, /r0\.json: session-a/)
  assert.match(orphan.stdout, /r1\.json: 持ち主のセッションが見つからない/)
  writeFileSync(join(sessions, 'session-b.jsonl'), jsonl([toolUse('Edit', { file_path: 'requests/r1.json', old_string: 'a', new_string: 'b' })]))
  const owned = run('owners', dir, {}, { CHECK_REQUESTS_TRANSCRIPTS: sessions })
  assert.equal(owned.status, 0)
  assert.match(owned.stdout, /r1\.json: session-b/)
})
