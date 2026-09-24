import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import test from 'node:test'

// git commit・git push の前の確認（scripts/check-requests.mjs --gate）を、使い捨ての git リポジトリで確かめる。

const SCRIPT = new URL('../scripts/check-requests.mjs', import.meta.url).pathname
const SETTINGS = JSON.parse(readFileSync(new URL('../.claude/settings.json', import.meta.url), 'utf8'))
const IDENTITY = { name: 'nanashi8', email: 'nanashi8@users.noreply.github.com' }
const STRANGER = { name: 'Someone', email: 'someone@laptop.local' }

// 利用者の git の設定とセッションの env を読まない（CI と同じ、名前の設定のない git にする）。
const home = mkdtempSync(join(tmpdir(), 'gate-home-'))
function cleanEnv() {
  const env = { ...process.env, HOME: home, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: join(home, 'gitconfig') }
  for (const key of Object.keys(env)) if (/^GIT_(AUTHOR|COMMITTER)_/.test(key)) delete env[key]
  return env
}
const as = (who) => ({ GIT_AUTHOR_NAME: who.name, GIT_AUTHOR_EMAIL: who.email, GIT_COMMITTER_NAME: who.name, GIT_COMMITTER_EMAIL: who.email })

function git(cwd, args, who = IDENTITY) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', env: { ...cleanEnv(), ...as(who) } })
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.stderr}`)
  return result.stdout.trim()
}

// 全教材監査台帳の確認の代わり：content.txt と ledger.txt が同じなら通る。
const LEDGER_CHECK = [
  "import { readFileSync } from 'node:fs'",
  "if (readFileSync('content.txt', 'utf8') !== readFileSync('ledger.txt', 'utf8')) {",
  "  console.error('全教材監査台帳が現在のデータより古い')",
  '  process.exit(1)',
  '}',
].join('\n')

function repo({ content = 'a', ledger = content, who = IDENTITY, prefix = 'gate-repo-' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), prefix))
  git(dir, ['init', '-q', '-b', 'main'])
  mkdirSync(join(dir, 'scripts'))
  writeFileSync(join(dir, 'scripts', 'content-audit-ledger.mjs'), LEDGER_CHECK)
  writeFileSync(join(dir, 'content.txt'), content)
  writeFileSync(join(dir, 'ledger.txt'), ledger)
  git(dir, ['add', '-A'])
  git(dir, ['commit', '-q', '-m', 'first'], who)
  return dir
}

// 中身だけを変えて、台帳を作り直さずにコミットしたリポジトリ（b714344 と同じ形）。
function staleRepo(options) {
  const dir = repo(options)
  writeFileSync(join(dir, 'content.txt'), 'b')
  git(dir, ['commit', '-q', '-am', 'change the content only'])
  return dir
}

function gate(command, { cwd, env = {} } = {}) {
  return spawnSync('node', [SCRIPT, '--gate'], {
    input: JSON.stringify({ cwd, tool_input: { command } }),
    encoding: 'utf8',
    env: { ...cleanEnv(), CHECK_REQUESTS_DIR: mkdtempSync(join(tmpdir(), 'requests-')), ...env },
  })
}

test('push の前に、push するコミットの中身で全教材監査台帳を確かめる', () => {
  const fresh = repo()
  assert.equal(gate(`cd ${fresh} && git push origin main`).status, 0)
  const stale = staleRepo()
  const blocked = gate(`cd ${stale} && git push origin main`)
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /全教材監査台帳/)
  assert.match(blocked.stderr, /npm run audit:all-content/)
  // 作業ツリーだけ台帳を書き直しても、push するコミットの台帳が古ければ止める。
  writeFileSync(join(stale, 'ledger.txt'), 'b')
  assert.equal(gate(`cd ${stale} && git push origin main`).status, 2)
  // 台帳をコミットに入れれば通る。
  git(stale, ['commit', '-q', '-am', 'record the ledger again'])
  assert.equal(gate(`cd ${stale} && git push origin main`).status, 0)
  // push する枝を名前で書いても、そのコミットを確かめる。
  const other = staleRepo()
  git(other, ['branch', '-q', 'old', 'HEAD~1'])
  assert.equal(gate(`cd ${other} && git push origin old:main`).status, 0)
  assert.equal(gate(`cd ${other} && git push origin +main:main`).status, 2)
})

test('push する場所は、cd・同じコマンドの変数・git -C・bash -c・フックが渡す場所から読む', () => {
  const stale = staleRepo()
  for (const command of [
    `git -C ${stale} push origin main`,
    `R=${stale}; cd "$R" && git push -q origin main`,
    `cd ${dirname(stale)} && git -C ${basename(stale)} push origin main`,
    `bash -c 'cd ${stale} && timeout 60 git push origin main'`,
    // リポジトリの下のフォルダーからでも、コミット全体を確かめる。値をとるオプションはリモートと取り違えない。
    `cd ${stale}/scripts && git push origin main`,
    `cd ${stale} && git push -o ci.skip --receive-pack git-receive-pack origin main`,
  ]) {
    const result = gate(command)
    assert.equal(result.status, 2, command)
    assert.match(result.stderr, /全教材監査台帳/, command)
  }
  assert.equal(gate('git push origin main', { cwd: stale }).status, 2)
  // 空白のある場所を引用符で書いても読む。
  const spaced = staleRepo({ prefix: 'gate repo with spaces-' })
  for (const command of [`git -C "${spaced}" push origin main`, `cd '${spaced}' && git push origin main`]) {
    const result = gate(command)
    assert.equal(result.status, 2, command)
    assert.match(result.stderr, /全教材監査台帳/, command)
  }
  // 場所を読み取れないときは止めて、書き方を知らせる。
  const unknown = gate('cd "$(mktemp -d)" && git push origin main')
  assert.equal(unknown.status, 2)
  assert.match(unknown.stderr, /読み取れない/)
  // push の文字が出てくるだけのコマンドは止めない。
  assert.equal(gate('echo "git push origin main"', { cwd: stale }).status, 0)
  assert.equal(gate('grep -n "git push" CLAUDE.md', { cwd: stale }).status, 0)
})

test('push は、HEAD を動かすコマンドと分けて単独で行う', () => {
  const fresh = repo()
  for (const command of [
    `cd ${fresh} && git commit -q --allow-empty -m x && git push origin main`,
    `cd ${fresh} && git pull --rebase && git push`,
    `cd ${fresh} && git rebase origin/main; git push origin main`,
  ]) {
    const result = gate(command, { env: as(IDENTITY) })
    assert.equal(result.status, 2, command)
    assert.match(result.stderr, /単独のコマンド/, command)
  }
  // HEAD を動かさないコマンドのあとなら、同じコマンドで push してよい。
  assert.equal(gate(`cd ${fresh} && git fetch -q origin; git status --short && git push origin main`).status, 0)
})

test('commit の前に、その場所の git が使う名前がこのリポジトリの名前（nanashi8）かを確かめる', () => {
  const dir = repo()
  // 名前の設定がない clone（端末名から名前を作る）では止める。
  const unnamed = gate(`cd ${dir} && git commit -q -m x`)
  assert.equal(unnamed.status, 2)
  assert.match(unnamed.stderr, /作者/)
  assert.match(unnamed.stderr, /config user\.email "nanashi8@users\.noreply\.github\.com"/)
  // セッションの env（.claude/settings.json）が名前を渡していれば通る。
  assert.equal(gate(`cd ${dir} && git commit -q -m x`, { env: as(IDENTITY) }).status, 0)
  // その場所に名前を設定しても通る。
  git(dir, ['config', 'user.name', IDENTITY.name])
  git(dir, ['config', 'user.email', IDENTITY.email])
  assert.equal(gate(`cd ${dir} && git commit -q -m x`).status, 0)
  // --author でほかの名前を付けたら止める。
  assert.equal(gate(`cd ${dir} && git commit -q --author="${STRANGER.name} <${STRANGER.email}>" -m x`).status, 2)
  // ほかの名前を設定した場所でも止める。
  git(dir, ['config', 'user.email', STRANGER.email])
  assert.equal(gate(`cd ${dir} && git commit -q -m x`).status, 2)
})

test('push の前に、まだどのリモートにもないコミットの作者・コミッターがこのリポジトリの名前かを確かめる', () => {
  const dir = repo({ who: STRANGER })
  const blocked = gate(`cd ${dir} && git push origin main`)
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /someone@laptop\.local/)
  assert.match(blocked.stderr, /--reset-author/)
  // すでにリモートにあるコミット（ほかのセッションが push したもの）は数えない。
  const remote = mkdtempSync(join(tmpdir(), 'gate-remote-'))
  git(remote, ['init', '-q', '--bare', '-b', 'main'])
  git(dir, ['remote', 'add', 'origin', remote])
  git(dir, ['push', '-q', 'origin', 'main'])
  git(dir, ['commit', '-q', '--allow-empty', '-m', 'second'])
  assert.equal(gate(`cd ${dir} && git push origin main`).status, 0)
  // ほかのセッションがリモートへ先に push した分も、取ってきてから数える。
  const peer = mkdtempSync(join(tmpdir(), 'gate-peer-'))
  git(peer, ['clone', '-q', remote, '.'])
  git(peer, ['commit', '-q', '--allow-empty', '-m', 'by a peer'], STRANGER)
  git(peer, ['push', '-q', 'origin', 'main'])
  git(dir, ['pull', '-q', '--rebase', 'origin', 'main'])
  assert.equal(gate(`cd ${dir} && git push origin main`).status, 0)
})

test('このリポジトリの名前は、.claude/settings.json の env で全セッションの git に渡す', () => {
  assert.deepEqual(
    [SETTINGS.env.GIT_AUTHOR_NAME, SETTINGS.env.GIT_AUTHOR_EMAIL, SETTINGS.env.GIT_COMMITTER_NAME, SETTINGS.env.GIT_COMMITTER_EMAIL],
    [IDENTITY.name, IDENTITY.email, IDENTITY.name, IDENTITY.email],
  )
})
