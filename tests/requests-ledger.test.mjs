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

// セッションが git に渡す名前（.claude/settings.json の env）。コミットの前の確認は、この名前なら通る。
const SESSION_ENV = JSON.parse(read('.claude/settings.json')).env

function run(mode, dir, input = {}, env = {}, args = []) {
  return spawnSync('node', [SCRIPT, `--${mode}`, ...args], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ...SESSION_ENV, CHECK_REQUESTS_DIR: dir, ...env },
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
  // 持ち主は書き込み先で決め、cp の元・名前が出てくるだけでは持ち主にしない。
  assert.match(rules, /書き込み先にした台帳/)
  assert.match(rules, /cp の元にしただけ/)
  // push の前に push するコミットの台帳と名前を確かめ、push は単独で行う。commit の前に名前を確かめる。
  assert.match(rules, /push するコミットの中身だけを取り出して `node scripts\/content-audit-ledger\.mjs`/)
  assert.match(rules, /単独のコマンドで行う/)
  assert.match(rules, /\.claude\/settings\.json` の env（nanashi8 <nanashi8@users\.noreply\.github\.com>）/)
  assert.match(rules, /`git commit` の前に、その場所の git が使う名前が違えば止める/)
  // ほかのセッションの依頼は1行に畳んで見せる。
  assert.match(rules, /ほかのセッションの依頼は1行に畳む/)
})

test('会話ログからは、そのセッションが書いた台帳だけを持ち主として割り出す', () => {
  const writes = {
    'write.json': toolUse('Write', { file_path: '/repo/requests/write.json', content: '{}' }),
    'edit.json': toolUse('Edit', { file_path: 'requests/edit.json', old_string: 'todo', new_string: 'done' }),
    'multi-edit.json': toolUse('MultiEdit', { file_path: '/repo/requests/multi-edit.json', edits: [{ old_string: 'todo', new_string: 'done' }] }),
    'notebook-edit.json': toolUse('NotebookEdit', { notebook_path: '/repo/requests/notebook-edit.json', new_source: '{}' }),
    // Bash の書き込み（node・Python・Perl・シェル・git）。
    'node.json': toolUse('Bash', { command: "node -e \"const p='requests/node.json'; fs.writeFileSync(p, s)\"" }),
    'git-add.json': toolUse('Bash', { command: 'git add requests/git-add.json src/App.jsx && git commit -m x' }),
    'python-path.json': toolUse('Bash', { command: "python3 - <<'EOF'\nimport pathlib\np = pathlib.Path('requests/python-path.json')\np.write_text(s)\nEOF" }),
    'python-open.json': toolUse('Bash', { command: "python3 -c \"import json; json.dump(r, open('requests/python-open.json', 'w'))\"" }),
    'perl.json': toolUse('Bash', { command: "perl -pi -e 's/todo/done/' requests/perl.json" }),
    'redirect.json': toolUse('Bash', { command: "jq '.status = \"done\"' /tmp/r.json > requests/redirect.json" }),
    'appended.json': toolUse('Bash', { command: "echo '' >> requests/appended.json" }),
    'moved.json': toolUse('Bash', { command: 'mv /tmp/r.json requests/moved.json' }),
    'moved-away.json': toolUse('Bash', { command: 'mv requests/moved-away.json /tmp/' }),
    'copied.json': toolUse('Bash', { command: 'cp /tmp/r.json requests/copied.json' }),
    'into-folder.json': toolUse('Bash', { command: 'cd /tmp/clone && cp /repo/requests/into-folder.json requests/' }),
    'removed.json': toolUse('Bash', { command: 'rm -f requests/removed.json && git status --short' }),
    'touched.json': toolUse('Bash', { command: 'touch requests/touched.json' }),
    'teed.json': toolUse('Bash', { command: "echo '{}' | tee requests/teed.json > /dev/null" }),
    'sed.json': toolUse('Bash', { command: "sed -i '' 's/todo/done/' requests/sed.json" }),
    'restored.json': toolUse('Bash', { command: 'git restore --source=HEAD requests/restored.json' }),
    // 変数で渡した台帳（シェルで広げる・スクリプトが名前で読む）、for の並び、bash -c とヒアドキュメントで渡したシェル。
    'shell-variable.json': toolUse('Bash', { command: 'D=requests; rm "$D/shell-variable.json"' }),
    'env-variable.json': toolUse('Bash', { command: 'F=requests/env-variable.json; node -e "fs.writeFileSync(process.env.F, s)"' }),
    'looped.json': toolUse('Bash', { command: "for f in requests/looped.json; do sed -i '' 's/a/b/' \"$f\"; done" }),
    'bash-c.json': toolUse('Bash', { command: "bash -c 'rm requests/bash-c.json'" }),
    'bash-heredoc.json': toolUse('Bash', { command: "bash <<'EOF'\nrm requests/bash-heredoc.json\nEOF" }),
  }
  const reads = [
    // 読むだけのコマンド、ほかのファイルへの書き込み、フックの一覧に出てくる名前は持ち主の印にしない。
    toolUse('Bash', { command: 'cat requests/cat.json && node scripts/check-requests.mjs --report' }),
    toolUse('Bash', { command: "python3 -c \"import json; print(json.load(open('requests/python-read.json')))\"" }),
    toolUse('Bash', { command: "node -e \"process.stdout.write(fs.readFileSync('requests/node-read.json', 'utf8'))\"" }),
    toolUse('Bash', { command: 'cat requests/piped.json | python3 -c "import json,sys; print(json.load(sys.stdin))"' }),
    toolUse('Bash', { command: "python3 - <<'PY'\nimport json\nprint(json.load(open('requests/py-read.json')))\nPY" }),
    // cp の元（控えをとるだけ）、同じコマンドの中の別のファイルへの書き込み。
    toolUse('Bash', { command: 'cp requests/backup-source.json /tmp/backup.json' }),
    toolUse('Bash', { command: 'rm -rf /tmp/work && cat requests/rm-elsewhere.json' }),
    toolUse('Bash', { command: 'git show HEAD:requests/shown.json > /tmp/shown.json' }),
    // コミットの文・メモ・試し用スクリプトの中に書いた名前。
    toolUse('Bash', { command: "git add src/App.jsx && git commit -q -F - <<'EOF'\nClose requests/in-message.json\nEOF" }),
    toolUse('Bash', { command: "cat > memo.md <<'EOF'\n- 依頼: requests/in-memo.json\nEOF" }),
    toolUse('Bash', { command: "cat > /tmp/probe.mjs <<'EOF'\nconst sample = \"fs.writeFileSync('requests/in-probe.json', s)\"\nEOF" }),
    toolUse('Write', { file_path: '/repo/tests/x.test.mjs', content: "read('requests/other-file.json')" }),
    toolUse('Read', { file_path: '/repo/requests/read.json' }),
    hookText('【開いている依頼】\n■ 依頼（requests/hook.json）'),
  ]
  // 1つずつ確かめる（ほかの見本の書き込みの印に引きずられないように）。
  for (const [file, entry] of Object.entries(writes)) assert.deepEqual([...touchedLedgers(jsonl([entry]))], [file], file)
  for (const entry of reads) assert.deepEqual([...touchedLedgers(jsonl([entry]))], [], JSON.stringify(entry))
  const owned = touchedLedgers(jsonl([...Object.values(writes), ...reads]))
  assert.deepEqual([...owned].sort(), Object.keys(writes).sort())
})

test('Stop フックは、そのセッションが作った・書き換えた依頼の未の条件だけで止める', () => {
  const dir = ledger(request([criterion({ id: 'mine' })]), request([criterion({ id: 'theirs' })], { id: 'r2' }))
  const reasonOf = (result) => (result.stdout.trim() ? JSON.parse(result.stdout).reason : '')
  // 自分の依頼（r0.json）の未だけで止める。ほかのセッションの依頼（r1.json）の未は理由に入れない。
  const mine = run('stop', dir, { session_id: 's1', transcript_path: transcript(toolUse('Write', { file_path: '/repo/requests/r0.json', content: '{}' })) })
  assert.equal(JSON.parse(mine.stdout).decision, 'block')
  assert.match(reasonOf(mine), /r0\.json の mine/)
  assert.doesNotMatch(reasonOf(mine), /theirs/)
  // 自分の依頼に未がなければ（済・裏の処理待ちだけなら）止めない。
  const settled = ledger(request([criterion({ status: 'done' }), criterion({ id: 'wait', status: 'waiting', waitingFor: 'デプロイ' })]))
  const writer = transcript(toolUse('Write', { file_path: '/repo/requests/r0.json', content: '{}' }))
  assert.equal(run('stop', settled, { transcript_path: writer }).stdout.trim(), '')
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
  // --all は閉じた依頼も含めた全台帳を見る。
  const closed = request([criterion({ status: 'done', check: 'node --test tests/a.test.mjs' })], { id: 'r3', status: 'done' })
  writeFileSync(join(dir, 'r2.json'), JSON.stringify(closed))
  assert.doesNotMatch(run('owners', dir, {}, { CHECK_REQUESTS_TRANSCRIPTS: sessions }).stdout, /r2\.json/)
  const all = run('owners', dir, {}, { CHECK_REQUESTS_TRANSCRIPTS: sessions }, ['--all'])
  assert.equal(all.status, 1)
  assert.match(all.stdout, /r2\.json: 持ち主のセッションが見つからない/)
  assert.match(all.stdout, /台帳 3件中、持ち主のセッションがある台帳 2件/)
  writeFileSync(join(sessions, 'session-c.jsonl'), jsonl([toolUse('Bash', { command: "python3 -c \"import json; json.dump(r, open('requests/r2.json', 'w'))\"" })]))
  const complete = run('owners', dir, {}, { CHECK_REQUESTS_TRANSCRIPTS: sessions }, ['--all'])
  assert.equal(complete.status, 0)
  assert.match(complete.stdout, /台帳 3件中、持ち主のセッションがある台帳 3件/)
})

test('利用者の発言ごとに見せる一覧は、そのセッションの依頼を全部、ほかのセッションの依頼を1行に畳む', () => {
  const dir = ledger(
    request([criterion({ id: 'mine-a' }), criterion({ id: 'mine-b', status: 'done' })], { title: '自分の依頼' }),
    request([
      criterion({ id: 'theirs-a' }),
      criterion({ id: 'theirs-b', status: 'done' }),
      criterion({ id: 'theirs-c', status: 'waiting', waitingFor: 'デプロイ' }),
    ], { id: 'r2', title: 'ほかの依頼' }),
  )
  const context = (input) => JSON.parse(run('prompt', dir, input).stdout).hookSpecificOutput.additionalContext
  const own = context({ transcript_path: transcript(toolUse('Write', { file_path: '/repo/requests/r0.json', content: '{}' })) })
  assert.match(own, /\[未\] mine-a/)
  assert.match(own, /\[済\] mine-b/)
  assert.doesNotMatch(own, /theirs-a/)
  assert.match(own, /【ほかのセッションの依頼】/)
  assert.match(own, /- ほかの依頼（requests\/r1\.json・未1・待1・済1）/)
  // 持ち主の依頼がないセッションでは、全部が1行ずつになる。
  const none = context({ transcript_path: transcript(toolUse('Bash', { command: 'cat requests/r0.json' })) })
  assert.doesNotMatch(none, /mine-a|theirs-a/)
  assert.match(none, /- 自分の依頼（requests\/r0\.json・未1・済1）/)
  // 会話ログが読めないときは、これまでどおり全部を見せる。
  for (const input of [{}, { transcript_path: join(tmpdir(), 'no-such-transcript.jsonl') }]) {
    const legacy = context(input)
    assert.match(legacy, /\[未\] mine-a/)
    assert.match(legacy, /\[未\] theirs-a/)
    assert.doesNotMatch(legacy, /【ほかのセッションの依頼】/)
  }
})
