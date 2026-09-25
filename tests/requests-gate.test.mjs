import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

// commit・push の前の確認を、本物の git が呼ぶ git のフック（scripts/git-hooks）で確かめる。
// 使い捨てのリポジトリに、このリポジトリのフック・判定スクリプト・.claude/settings.json を入れて試す。

const here = (path) => new URL(`../${path}`, import.meta.url).pathname
const SETTINGS = JSON.parse(readFileSync(here('.claude/settings.json'), 'utf8'))
const IDENTITY = { name: 'nanashi8', email: 'nanashi8@users.noreply.github.com' }
const STRANGER = { name: 'Someone', email: 'someone@laptop.local' }

// 利用者の git の設定と、このテストを動かすセッションの env を読まない（名前の設定もフックもない git から始める）。
const home = mkdtempSync(join(tmpdir(), 'hooks-home-'))
function bareEnv() {
  const env = { ...process.env, HOME: home, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: join(home, 'gitconfig') }
  for (const key of Object.keys(env)) {
    if (/^GIT_(?:AUTHOR|COMMITTER)_|^GIT_CONFIG_(?:COUNT|KEY_|VALUE_|PARAMETERS)|^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|COMMON_DIR)$/.test(key)) delete env[key]
  }
  return env
}
const as = (who) => ({ GIT_AUTHOR_NAME: who.name, GIT_AUTHOR_EMAIL: who.email, GIT_COMMITTER_NAME: who.name, GIT_COMMITTER_EMAIL: who.email })
// Claude Code のセッションが git に渡す env（.claude/settings.json の env そのもの）。
const sessionEnv = () => ({ ...bareEnv(), ...SETTINGS.env })
// フックを通さずに用意するとき（ほかの人が作ったコミットの再現など）。
const noHooks = (who = IDENTITY) => ({ ...bareEnv(), ...as(who), GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.hooksPath', GIT_CONFIG_VALUE_0: '/dev/null' })

function sh(command, cwd, env = sessionEnv()) {
  return spawnSync('sh', ['-c', command], { cwd, env, encoding: 'utf8' })
}
function git(cwd, args, env = sessionEnv()) {
  const result = spawnSync('git', args, { cwd, env, encoding: 'utf8' })
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

/** このリポジトリのフックを入れた使い捨てのリポジトリと、push 先の空のリモート。 */
function project() {
  const dir = mkdtempSync(join(tmpdir(), 'hooks-repo-'))
  for (const path of ['scripts/git-hooks', 'requests', '.claude', 'sub']) mkdirSync(join(dir, path), { recursive: true })
  for (const path of ['scripts/check-requests.mjs', 'scripts/git-hooks/prepare-commit-msg', 'scripts/git-hooks/pre-push', '.claude/settings.json']) {
    copyFileSync(here(path), join(dir, path))
  }
  chmodSync(join(dir, 'scripts/git-hooks/prepare-commit-msg'), 0o755)
  chmodSync(join(dir, 'scripts/git-hooks/pre-push'), 0o755)
  writeFileSync(join(dir, 'scripts/content-audit-ledger.mjs'), LEDGER_CHECK)
  writeFileSync(join(dir, 'content.txt'), 'a')
  writeFileSync(join(dir, 'ledger.txt'), 'a')
  writeFileSync(join(dir, 'sub', 'note.txt'), 'note')
  const remote = mkdtempSync(join(tmpdir(), 'hooks-remote-'))
  git(remote, ['init', '-q', '--bare', '-b', 'main'])
  git(dir, ['init', '-q', '-b', 'main'])
  git(dir, ['add', '-A'])
  git(dir, ['commit', '-q', '-m', 'first'])
  git(dir, ['remote', 'add', 'origin', remote])
  git(dir, ['push', '-q', 'origin', 'main'])
  return { dir, remote }
}

// 中身だけを変えて、台帳を作り直さずにコミットする（fdf2b63 で起きた形）。
function commitStale(dir) {
  writeFileSync(join(dir, 'content.txt'), `changed ${Math.random()}`)
  git(dir, ['commit', '-q', '-am', 'change the content only'])
}
const remoteMain = (remote) => git(remote, ['rev-parse', 'main'])

test('push の前に、main へ push するコミットの中身で全教材監査台帳を確かめる', () => {
  const { dir, remote } = project()
  const before = remoteMain(remote)
  commitStale(dir)
  const blocked = sh('git push -q origin main', dir)
  assert.notEqual(blocked.status, 0)
  assert.match(blocked.stderr, /全教材監査台帳/)
  assert.match(blocked.stderr, /npm run audit:all-content/)
  assert.equal(remoteMain(remote), before)
  // 作業ツリーだけ台帳を書き直しても、push するコミットの台帳が古ければ止める。
  writeFileSync(join(dir, 'ledger.txt'), readFileSync(join(dir, 'content.txt'), 'utf8'))
  assert.notEqual(sh('git push -q origin main', dir).status, 0)
  // 台帳をコミットに入れれば通る。
  git(dir, ['commit', '-q', '-am', 'record the ledger again'])
  assert.equal(sh('git push -q origin main', dir).status, 0)
  assert.equal(remoteMain(remote), git(dir, ['rev-parse', 'HEAD']))
  // 公開の自動処理が見ない枝（main 以外）には、台帳の確認をしない。
  commitStale(dir)
  assert.equal(sh('git push -q origin HEAD:refs/heads/topic', dir).status, 0)
})

test('どんな書き方の push でも、git がフックを呼ぶ（場所・スクリプト・eval・xargs・bash -c・clone）', () => {
  const { dir, remote } = project()
  const before = remoteMain(remote)
  commitStale(dir)
  const script = join(dir, 'push.sh')
  writeFileSync(script, 'git push -q origin main\n')
  const outside = mkdtempSync(join(tmpdir(), 'hooks-elsewhere-'))
  for (const [command, cwd] of [
    ['git push -q origin main', dir],
    [`git -C ${dir} push -q origin main`, outside],
    ['cd sub && git push -q origin main', dir],
    [`sh ${script}`, dir],
    ['eval "git push -q origin main"', dir],
    ['echo main | xargs git push -q origin', dir],
    ["bash -c 'git push -q origin main'", dir],
    [`R=$(printf %s ${dir}); cd "$R" && git push -q origin main`, outside],
  ]) {
    const result = sh(command, cwd)
    assert.notEqual(result.status, 0, command)
    assert.match(result.stderr, /全教材監査台帳/, command)
  }
  assert.equal(remoteMain(remote), before)
  // clone でも、その clone のフックが呼ばれる。
  const clone = mkdtempSync(join(tmpdir(), 'hooks-clone-'))
  git(clone, ['clone', '-q', remote, '.'])
  commitStale(clone)
  const cloned = sh('git push -q origin main', clone)
  assert.notEqual(cloned.status, 0)
  assert.match(cloned.stderr, /全教材監査台帳/)
  assert.equal(remoteMain(remote), before)
})

test('commit の前に、git が使う名前（--author を含む）がこのリポジトリの名前かを確かめる', () => {
  const { dir } = project()
  const head = () => git(dir, ['rev-parse', 'HEAD'])
  const start = head()
  const hooksOnly = { ...bareEnv(), GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.hooksPath', GIT_CONFIG_VALUE_0: 'scripts/git-hooks' }
  // 名前の設定がない git（端末名から名前を作る）では止める。
  assert.notEqual(sh('git commit -q --allow-empty -m x', dir, hooksOnly).status, 0)
  // ほかの名前を設定した場所・--author でほかの名前を付けたときも止める。
  git(dir, ['config', 'user.name', STRANGER.name], hooksOnly)
  git(dir, ['config', 'user.email', STRANGER.email], hooksOnly)
  const configured = sh('git commit -q --allow-empty -m x', dir, hooksOnly)
  assert.notEqual(configured.status, 0)
  assert.match(configured.stderr, /someone@laptop\.local/)
  const author = sh(`git commit -q --allow-empty --author="${STRANGER.name} <${STRANGER.email}>" -m x`, dir)
  assert.notEqual(author.status, 0)
  assert.match(author.stderr, /作者が「Someone <someone@laptop\.local>」/)
  assert.equal(head(), start)
  // セッションの env（.claude/settings.json）が名前を渡していれば通る。
  assert.equal(sh('git commit -q --allow-empty -m x', dir).status, 0)
  assert.notEqual(head(), start)
})

test('push の前に、まだどのリモートにもないコミットの作者・コミッターがこのリポジトリの名前かを確かめる', () => {
  const { dir, remote } = project()
  // フックを通さずに作った、ほかの名前のコミット。
  git(dir, ['commit', '-q', '--allow-empty', '-m', 'by a stranger'], noHooks(STRANGER))
  const blocked = sh('git push -q origin main', dir)
  assert.notEqual(blocked.status, 0)
  assert.match(blocked.stderr, /someone@laptop\.local/)
  assert.match(blocked.stderr, /--reset-author/)
  // 作り直せば通る。
  assert.equal(sh('git commit -q --amend --allow-empty --no-edit --reset-author', dir).status, 0)
  assert.equal(sh('git push -q origin main', dir).status, 0)
  // すでにリモートにあるコミット（ほかの人が push したもの）は数えない。
  const peer = mkdtempSync(join(tmpdir(), 'hooks-peer-'))
  git(peer, ['clone', '-q', remote, '.'], noHooks())
  git(peer, ['commit', '-q', '--allow-empty', '-m', 'by a peer'], noHooks(STRANGER))
  git(peer, ['push', '-q', 'origin', 'main'], noHooks())
  git(dir, ['pull', '-q', '--rebase', 'origin', 'main'])
  assert.equal(sh('git commit -q --allow-empty -m mine && git push -q origin main', dir).status, 0)
})

test('done にした条件の check が通らなければ、commit も push もしない', () => {
  const { dir } = project()
  const write = (check) => writeFileSync(join(dir, 'requests', 'r.json'), JSON.stringify({
    id: 'r', title: '依頼', asked: ['原文'], sessions: ['s'], status: 'open',
    criteria: [{ id: 'c', text: '満たすこと', population: '全件', check, status: 'done' }],
  }))
  write('node -e "process.exit(1)"')
  const commit = sh('git add -A && git commit -q -m ledger', dir)
  assert.notEqual(commit.status, 0)
  assert.match(commit.stderr, /done にしたが確認が通らない/)
  write('node -e "process.exit(0)"')
  assert.equal(sh('git add -A && git commit -q -m ledger', dir).status, 0)
  write('node -e "process.exit(1)"')
  const push = sh('git push -q origin main', dir)
  assert.notEqual(push.status, 0)
  assert.match(push.stderr, /done にしたが確認が通らない/)
})

test('commit の確認は、--no-verify・-n を付けても飛ばない（prepare-commit-msg のフック）', () => {
  const { dir } = project()
  const start = git(dir, ['rev-parse', 'HEAD'])
  writeFileSync(join(dir, 'requests', 'r.json'), JSON.stringify({
    id: 'r', title: '依頼', asked: ['原文'], sessions: ['s'], status: 'open',
    criteria: [{ id: 'c', text: '満たすこと', population: '全件', check: 'node -e "process.exit(1)"', status: 'done' }],
  }))
  for (const flag of ['--no-verify', '-n']) {
    const result = sh(`git add -A && git commit -q ${flag} -m ledger`, dir)
    assert.notEqual(result.status, 0, flag)
    assert.match(result.stderr, /done にしたが確認が通らない/, flag)
  }
  // 名前の確認も飛ばない。
  writeFileSync(join(dir, 'requests', 'r.json'), '{"id":"r","title":"依頼","asked":["原文"],"sessions":["s"],"status":"open","criteria":[{"id":"c","text":"満たすこと","population":"全件","check":"node -e 0","status":"todo"}]}')
  const author = sh(`git add -A && git commit -q --no-verify --author="${STRANGER.name} <${STRANGER.email}>" -m x`, dir)
  assert.notEqual(author.status, 0)
  assert.match(author.stderr, /someone@laptop\.local/)
  assert.equal(git(dir, ['rev-parse', 'HEAD']), start)
})

test('git のフックは実行できる形で追跡し、名前とフックの場所は .claude/settings.json の env で全セッションに渡す', () => {
  const tracked = spawnSync('git', ['ls-files', '-s', 'scripts/git-hooks'], { cwd: here(''), encoding: 'utf8', env: bareEnv() })
  const modes = Object.fromEntries(tracked.stdout.trim().split('\n').filter(Boolean).map((line) => [line.split('\t')[1], line.split(' ')[0]]))
  assert.deepEqual(modes, { 'scripts/git-hooks/pre-push': '100755', 'scripts/git-hooks/prepare-commit-msg': '100755' })
  assert.deepEqual(
    [SETTINGS.env.GIT_AUTHOR_NAME, SETTINGS.env.GIT_AUTHOR_EMAIL, SETTINGS.env.GIT_COMMITTER_NAME, SETTINGS.env.GIT_COMMITTER_EMAIL],
    [IDENTITY.name, IDENTITY.email, IDENTITY.name, IDENTITY.email],
  )
  assert.deepEqual(
    [SETTINGS.env.GIT_CONFIG_COUNT, SETTINGS.env.GIT_CONFIG_KEY_0, SETTINGS.env.GIT_CONFIG_VALUE_0],
    ['1', 'core.hooksPath', 'scripts/git-hooks'],
  )
})
