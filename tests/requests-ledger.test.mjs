import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { HOOKS_PATH, hooksActive, loadRequests, ownRequests, validateRequest } from '../scripts/check-requests.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const SCRIPT = new URL('../scripts/check-requests.mjs', import.meta.url).pathname

const MINE = 'session-mine'
const THEIRS = 'session-theirs'

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
  sessions: [MINE],
  status: 'open',
  criteria,
  ...overrides,
})

function ledger(...requests) {
  const dir = mkdtempSync(join(tmpdir(), 'requests-'))
  requests.forEach((item, index) => writeFileSync(join(dir, `r${index}.json`), JSON.stringify(item)))
  return dir
}

// セッションに渡る env（.claude/settings.json）。git のフックの場所とコミットの名前を含む。
const SESSION_ENV = JSON.parse(read('.claude/settings.json')).env

function run(mode, dir, input = {}, env = {}) {
  return spawnSync('node', [SCRIPT, `--${mode}`], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, ...SESSION_ENV, CHECK_REQUESTS_DIR: dir, ...env },
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

test('開いている依頼には、進めるセッションの id（sessions）を書く', () => {
  for (const sessions of [undefined, [], [''], ['  '], [42], 'session-mine']) {
    assert.match(validateRequest(request([criterion()], { sessions })).join('\n'), /sessions/, JSON.stringify(sessions))
  }
  assert.deepEqual(validateRequest(request([criterion()], { sessions: [MINE, THEIRS] })), [])
  // 閉じた依頼には要らない（前からの台帳を書き直さない）。
  const closed = request([criterion({ status: 'done', check: 'node --test tests/a.test.mjs' })], { status: 'done', sessions: undefined })
  assert.deepEqual(validateRequest(closed), [])
  // 持ち主は sessions で決まる。session_id が渡らないときは、開いている全依頼。
  const requests = [request([criterion()], { file: 'a.json' }), request([criterion()], { file: 'b.json', sessions: [THEIRS] })]
  assert.deepEqual(ownRequests(requests, MINE).map((item) => item.file), ['a.json'])
  assert.deepEqual(ownRequests(requests, THEIRS).map((item) => item.file), ['b.json'])
  assert.deepEqual(ownRequests(requests, undefined).map((item) => item.file), ['a.json', 'b.json'])
})

test('Stop フックは、sessions にそのセッションの id がある依頼の未の条件だけで止める', () => {
  const dir = ledger(request([criterion({ id: 'mine' })]), request([criterion({ id: 'theirs' })], { id: 'r2', sessions: [THEIRS] }))
  const reasonOf = (result) => (result.stdout.trim() ? JSON.parse(result.stdout).reason : '')
  const mine = run('stop', dir, { session_id: MINE })
  assert.equal(JSON.parse(mine.stdout).decision, 'block')
  assert.match(reasonOf(mine), /r0\.json の mine/)
  assert.doesNotMatch(reasonOf(mine), /theirs/)
  // ほかのセッションの依頼しかなければ止めない。どちらにも入っていないセッションも止めない。
  assert.match(reasonOf(run('stop', dir, { session_id: THEIRS })), /r1\.json の theirs/)
  assert.equal(run('stop', dir, { session_id: 'session-other' }).stdout.trim(), '')
  // 自分の依頼に未がなければ（済・利用者の判断待ち・裏の処理待ちだけなら）止めない。
  const settled = ledger(request([
    criterion({ status: 'done' }),
    criterion({ id: 'c2', status: 'needs-user', question: 'どちらにしますか' }),
    criterion({ id: 'c3', status: 'waiting', waitingFor: 'デプロイ' }),
  ]))
  assert.equal(run('stop', settled, { session_id: MINE }).stdout.trim(), '')
  assert.equal(run('stop', ledger(), { session_id: MINE }).stdout.trim(), '')
  // session_id が渡らないときは、開いている全依頼で止める。
  const legacy = reasonOf(run('stop', dir, {}))
  assert.match(legacy, /mine/)
  assert.match(legacy, /theirs/)
  // 台帳の書き方の誤り（sessions がない開いた依頼を含む）は、どのセッションも止める。
  const broken = ledger(request([criterion()], { sessions: undefined }))
  assert.match(reasonOf(run('stop', broken, { session_id: 'session-other' })), /台帳の誤り.*sessions/)
})

test('そのセッションの開いている依頼がないと、src・tests・scripts を書き換えさせない', () => {
  const closed = ledger(request([criterion({ status: 'done', check: 'node --test tests/a.test.mjs' })], { status: 'done' }))
  const blocked = run('edit', closed, { session_id: MINE, tool_input: { file_path: 'src/lib/wordRelations.js' } })
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /requests\//)
  assert.match(blocked.stderr, new RegExp(`sessions にこのセッションの id（${MINE}）`))
  assert.equal(run('edit', closed, { session_id: MINE, tool_input: { file_path: 'docs/memo.md' } }).status, 0)
  // ほかのセッションの依頼では書き換えさせない。自分の依頼があれば通す。
  const theirs = ledger(request([criterion()], { sessions: [THEIRS] }))
  assert.equal(run('edit', theirs, { session_id: MINE, tool_input: { file_path: 'src/App.jsx' } }).status, 2)
  assert.equal(run('edit', theirs, { session_id: THEIRS, tool_input: { file_path: 'src/App.jsx' } }).status, 0)
  // session_id が渡らないときは、開いている依頼があれば通す。
  assert.equal(run('edit', theirs, { tool_input: { file_path: 'scripts/x.mjs' } }).status, 0)
})

test('利用者の発言ごとに、決まり・このセッションの id・このセッションの依頼を見せ、ほかのセッションの依頼は1行に畳む', () => {
  const dir = ledger(
    request([criterion({ id: 'mine-a' }), criterion({ id: 'mine-b', status: 'done' })], { title: '自分の依頼' }),
    request([
      criterion({ id: 'theirs-a' }),
      criterion({ id: 'theirs-b', status: 'done' }),
      criterion({ id: 'theirs-c', status: 'waiting', waitingFor: 'デプロイ' }),
    ], { id: 'r2', title: 'ほかの依頼', sessions: [THEIRS] }),
  )
  const context = (input) => {
    const output = JSON.parse(run('prompt', dir, input).stdout)
    assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit')
    return output.hookSpecificOutput.additionalContext
  }
  const own = context({ session_id: MINE })
  assert.match(own, /母集団/)
  assert.match(own, new RegExp(`【このセッションの id】${MINE}`))
  assert.match(own, /\[未\] mine-a/)
  assert.match(own, /\[済\] mine-b/)
  assert.doesNotMatch(own, /theirs-a/)
  assert.match(own, /【ほかのセッションの依頼】/)
  assert.match(own, /- ほかの依頼（requests\/r1\.json・未1・待1・済1）/)
  // 依頼を持たないセッションでは、全部が1行ずつになる。
  const none = context({ session_id: 'session-other' })
  assert.doesNotMatch(none, /mine-a|theirs-a/)
  assert.match(none, /- 自分の依頼（requests\/r0\.json・未1・済1）/)
  // session_id が渡らないときは、これまでどおり全部を見せる。
  const legacy = context({})
  assert.match(legacy, /\[未\] mine-a/)
  assert.match(legacy, /\[未\] theirs-a/)
  assert.doesNotMatch(legacy, /【ほかのセッションの依頼】|【このセッションの id】/)
})

test('git のフックの場所がセッションに届いていなければ、利用者の発言ごとに知らせる', () => {
  const dir = ledger(request([criterion()]))
  const context = (env) => JSON.parse(run('prompt', dir, { session_id: MINE }, env).stdout).hookSpecificOutput.additionalContext
  assert.doesNotMatch(context({}), /【注意】/)
  assert.match(context({ GIT_CONFIG_COUNT: '0' }), /【注意】このセッションの git に \.claude\/settings\.json の env（core\.hooksPath=scripts\/git-hooks）が届いていない/)
})

test('--owners は、開いている依頼ごとに sessions を見せ、書いていない依頼があれば失敗する', () => {
  const dir = ledger(request([criterion()]), request([criterion()], { id: 'r2', sessions: [THEIRS, MINE] }))
  const owned = run('owners', dir)
  assert.equal(owned.status, 0)
  assert.match(owned.stdout, new RegExp(`r0\\.json: ${MINE}`))
  assert.match(owned.stdout, new RegExp(`r1\\.json: ${THEIRS} ${MINE}`))
  const orphan = run('owners', ledger(request([criterion()], { sessions: undefined })))
  assert.equal(orphan.status, 1)
  assert.match(orphan.stdout, /sessions）が書かれていない/)
})

test('done にした条件の確認が通らなければ、git のフックが commit・push を止める', () => {
  const lying = ledger(request([criterion({ status: 'done', check: 'node -e "process.exit(1)"' })]))
  for (const hook of ['git-commit', 'git-pre-push']) {
    const blocked = run(hook, lying)
    assert.equal(blocked.status, 1, hook)
    assert.match(blocked.stderr, /確認が通らない/, hook)
  }
  const honest = ledger(request([criterion({ status: 'done' }), criterion({ id: 'c2' })]))
  assert.equal(run('git-commit', honest).status, 0)
  assert.equal(run('git-pre-push', honest).status, 0)
  // 台帳の書き方の誤りでも止める。
  assert.equal(run('git-commit', ledger(request([criterion()], { sessions: undefined }))).status, 1)
})

test('フックは Stop・Edit/Write・利用者の発言と、git の commit・push のすべてにつながっている', () => {
  const settings = JSON.parse(read('.claude/settings.json'))
  const commands = (event) => (settings.hooks[event] ?? []).flatMap((entry) =>
    entry.hooks.map((hook) => ({ matcher: entry.matcher ?? '', command: hook.command })))
  assert.ok(commands('Stop').some((hook) => hook.command.includes('check-requests.mjs" --stop')))
  assert.ok(commands('UserPromptSubmit').some((hook) => hook.command.includes('check-requests.mjs" --prompt')))
  assert.ok(commands('PreToolUse').some((hook) => /Edit/.test(hook.matcher) && /Write/.test(hook.matcher) && hook.command.includes('--edit')))
  // Bash のコマンドの文を読んで止める確認は置かない（commit・push は git のフックが確かめる）。
  assert.ok(!commands('PreToolUse').some((hook) => /Bash/.test(hook.matcher)))
  // git のフックは env（core.hooksPath）で全セッションの git に渡す。
  assert.equal(HOOKS_PATH, 'scripts/git-hooks')
  assert.ok(hooksActive(settings.env))
  for (const [hook, mode] of [['prepare-commit-msg', 'git-commit'], ['pre-push', 'git-pre-push']]) {
    assert.match(read(`${HOOKS_PATH}/${hook}`), new RegExp(`check-requests\\.mjs" --${mode}`))
  }
})

test('完了の決まりは、今回の失敗の原因ごとに対策を書いている', () => {
  const rules = read('CLAUDE.md')
  for (const cause of ['作りやすさで決めた', '自分が作った物差し', '黙って捨てた', '変更した画面しか見なかった']) {
    assert.ok(rules.includes(cause), cause)
  }
  for (const rule of ['母集団', 'check', 'needs-user', '母集団と達成数']) assert.ok(rules.includes(rule), rule)
  // 依頼の持ち主は台帳の sessions に書き、Stop・変更の前の確認はそれで判定する。
  assert.match(rules, /"sessions": \["<このセッションの id>"\]/)
  assert.match(rules, /sessions` にそのセッションの id がある依頼/)
  // commit・push の前の確認は git のフックがし、フックを飛ばす書き方は止める。
  assert.match(rules, /scripts\/git-hooks` の prepare-commit-msg・pre-push/)
  assert.match(rules, /--no-verify/)
  assert.match(rules, /push するコミットの中身だけを取り出して `node scripts\/content-audit-ledger\.mjs`/)
  assert.match(rules, /\.claude\/settings\.json` の env（nanashi8 <nanashi8@users\.noreply\.github\.com>）/)
  assert.match(rules, /ほかのセッションの依頼は1行に畳む/)
  // コマンドの文から推し量る書き方（会話ログの読み取り・コマンドの読み取り）は書かない。
  assert.doesNotMatch(rules, /会話ログ|shell-commands|単独のコマンド/)
})

test('置き換えた前の依頼台帳には、どの条件を何で置き換えたかを書いている', () => {
  for (const file of ['2026-09-24-stop-own-requests.json', '2026-09-25-requests-hooks-improve.json']) {
    const old = JSON.parse(read(`requests/${file}`))
    assert.equal(old.supersededBy, '2026-09-25-history-and-git-hooks', file)
    assert.ok(old.supersededNote?.length > 20, file)
  }
})
