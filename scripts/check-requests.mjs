#!/usr/bin/env node
// 依頼台帳（requests/*.json）で、依頼を途中で止めずに最後までやり切らせる。
// Claude Code のフック（.claude/settings.json）と git のフック（scripts/git-hooks）から呼ばれ、次の場面で作業を止める。
//   --prompt         : 利用者の依頼が届いたとき。決まりと、このセッションの id・依頼の終わっていない条件を見せる
//                      （ほかのセッションの依頼は1行に畳む）。
//   --edit           : src/・tests/・scripts/ のファイルを書き換える前。このセッションの開いている依頼がなければ止める。
//   --stop           : 作業者がターンを終えようとしたとき。このセッションの依頼に「未」の条件が残っていれば終わらせない。
//   --git-commit     : git commit の前（scripts/git-hooks/prepare-commit-msg。--no-verify でも飛ばない）。done にした条件の check とコミットの名前を確かめる。
//   --git-pre-push   : git push の前（scripts/git-hooks/pre-push）。done にした条件の check と、push するコミットの名前、
//                      main へ push するコミットの全教材監査台帳を確かめる。
//   --report         : 開いている依頼と条件の一覧を表示する（人が読む用）。
//   --owners         : 開いている依頼ごとに、持ち主のセッション（台帳の sessions）を表示する。書いていない依頼があれば失敗。
// 依頼の持ち主は、台帳の sessions に書いたセッション。台帳の書き方は CLAUDE.md の「依頼台帳」を参照。
import { execSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// テストでは CHECK_REQUESTS_DIR で別の台帳を読ませる。
const REQUESTS_DIR = process.env.CHECK_REQUESTS_DIR ?? join(ROOT, 'requests')
const SETTINGS_PATH = join(ROOT, '.claude', 'settings.json')
// git のフックの置き場所。.claude/settings.json の env で core.hooksPath に渡す（リポジトリのいちばん上からの相対なので、
// clone でもその clone のフックが呼ばれる）。
export const HOOKS_PATH = 'scripts/git-hooks'

// 条件の状態。done（確認コマンドが通る）以外で作業者がターンを終えてよいのは、
// 利用者の判断待ち（needs-user：question に聞くことを書く）と、裏で走る処理の待ち（waiting：何を待つかを書く）だけ。
export const CRITERION_STATUSES = ['todo', 'done', 'waiting', 'needs-user']
export const REQUEST_STATUSES = ['open', 'done']

const readStdin = () => {
  // 人が端末から直接動かしたときは、入力を待たずに進む。
  if (process.stdin.isTTY) return ''
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}

const readInput = () => {
  try {
    return JSON.parse(readStdin() || '{}')
  } catch {
    return {}
  }
}

/** 台帳を読み、書き方の誤りも返す。 */
export function loadRequests(dir = REQUESTS_DIR) {
  const requests = []
  const problems = []
  if (!existsSync(dir)) return { requests, problems }
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.json')).sort()) {
    const path = join(dir, file)
    let request
    try {
      request = JSON.parse(readFileSync(path, 'utf8'))
    } catch (error) {
      problems.push(`${file}: JSON として読めない（${error.message}）`)
      continue
    }
    request.file = file
    problems.push(...validateRequest(request))
    requests.push(request)
  }
  return { requests, problems }
}

/** 依頼1件の書き方を確かめる。 */
export function validateRequest(request) {
  const at = request.file ?? request.id ?? '(依頼)'
  const problems = []
  if (!request.id) problems.push(`${at}: id がない`)
  if (!request.title) problems.push(`${at}: title がない`)
  if (!Array.isArray(request.asked) || !request.asked.length) problems.push(`${at}: asked（依頼の原文）がない`)
  if (!REQUEST_STATUSES.includes(request.status)) problems.push(`${at}: status は ${REQUEST_STATUSES.join('/')} のどれか`)
  // 開いている依頼は、進めるセッションの id を sessions に書く（Stop・一覧・変更の前の確認は、これで持ち主を決める）。
  if (request.status === 'open') {
    const sessions = request.sessions
    if (!Array.isArray(sessions) || !sessions.length || sessions.some((session) => typeof session !== 'string' || !session.trim())) {
      problems.push(`${at}: sessions（この依頼を進めるセッションの id の並び）がない。利用者の発言ごとに見せる「このセッションの id」を書く`)
    }
  }
  if (!Array.isArray(request.criteria) || !request.criteria.length) {
    problems.push(`${at}: criteria（受け入れ条件）がない`)
    return problems
  }
  const ids = new Set()
  for (const criterion of request.criteria) {
    const where = `${at} の ${criterion.id ?? '(条件)'}`
    if (!criterion.id) problems.push(`${where}: id がない`)
    if (ids.has(criterion.id)) problems.push(`${where}: id が重複`)
    ids.add(criterion.id)
    if (!criterion.text) problems.push(`${where}: text（何を満たすか）がない`)
    if (!criterion.population) problems.push(`${where}: population（対象の母集団。例「品詞のある全見出し語」）がない`)
    if (!criterion.check) problems.push(`${where}: check（満たしたかを確かめるコマンド）がない`)
    if (!CRITERION_STATUSES.includes(criterion.status)) {
      problems.push(`${where}: status は ${CRITERION_STATUSES.join('/')} のどれか`)
    }
    if (criterion.status === 'needs-user' && !criterion.question) problems.push(`${where}: needs-user には question（利用者に聞くこと）が要る`)
    if (criterion.status === 'waiting' && !criterion.waitingFor) problems.push(`${where}: waiting には waitingFor（何を待つか）が要る`)
    // 閉じた依頼の確認は、npm test に入っているテストで今後も守り続ける。
    if (request.status === 'done' && !/tests\/[\w./-]+\.test\.mjs/.test(criterion.check ?? '')) {
      problems.push(`${where}: 閉じた依頼の check は tests/*.test.mjs を実行するもの（npm test で守り続けるため）`)
    }
  }
  if (request.status === 'done') {
    const unfinished = request.criteria.filter((criterion) => criterion.status !== 'done')
    if (unfinished.length) problems.push(`${at}: status が done なのに、済んでいない条件がある（${unfinished.map((c) => c.id).join(', ')}）`)
  }
  return problems
}

const openRequests = (requests) => requests.filter((request) => request.status === 'open')

/** そのセッションの開いている依頼（台帳の sessions に id がある依頼）。session_id が渡らないときは、開いている全依頼。 */
export function ownRequests(requests, sessionId) {
  const open = openRequests(requests)
  return sessionId ? open.filter((request) => (request.sessions ?? []).includes(sessionId)) : open
}

const MARKS = { todo: '未', waiting: '待', 'needs-user': '問', done: '済' }

/**
 * 開いている依頼の一覧。sessionId を渡すと、そのセッションの依頼は条件まで全部、ほかのセッションの依頼は1行に畳む。
 * sessionId がなければ全部を見せる。
 */
function describe(requests, sessionId = null) {
  const lines = []
  const others = []
  const own = new Set(ownRequests(requests, sessionId).map((request) => request.file))
  for (const request of openRequests(requests)) {
    if (!own.has(request.file)) {
      const counts = Object.entries(MARKS)
        .map(([status, mark]) => [mark, request.criteria.filter((criterion) => criterion.status === status).length])
        .filter(([, count]) => count)
        .map(([mark, count]) => `${mark}${count}`)
      others.push(`- ${request.title}（requests/${request.file}・${counts.join('・')}）`)
      continue
    }
    lines.push(`■ ${request.title}（requests/${request.file}）`)
    for (const criterion of request.criteria) {
      lines.push(`  [${MARKS[criterion.status] ?? '?'}] ${criterion.id}: ${criterion.text}（対象: ${criterion.population}）`)
    }
  }
  if (others.length) {
    lines.push('【ほかのセッションの依頼】（このセッションは止めない。引き継ぐときは台帳を読み、sessions にこのセッションの id を足す）', ...others)
  }
  return lines.join('\n')
}

// git のフックの中で動くとき、git はリポジトリの場所（GIT_DIR・GIT_INDEX_FILE など）を環境変数で渡す。
// 確認コマンドがほかのリポジトリ（テストの使い捨てのリポジトリなど）で git を動かしても取り違えないよう、これを外す。
const REPOSITORY_ENV = /^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|COMMON_DIR|NAMESPACE|QUARANTINE_PATH|REFLOG_ACTION|PUSH_OPTION_\w+)$/
const cleanEnv = () => Object.fromEntries(Object.entries(process.env).filter(([key]) => !REPOSITORY_ENV.test(key)))

function runCheck(command) {
  try {
    execSync(command, { cwd: ROOT, env: cleanEnv(), stdio: ['ignore', 'pipe', 'pipe'], timeout: 15 * 60 * 1000 })
    return { ok: true, output: '' }
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim().split('\n').slice(-15).join('\n')
    return { ok: false, output }
  }
}

/** 開いている依頼の done にした条件のうち、確認コマンドが通らないもの。 */
function doneCheckFailures(requests) {
  const failures = []
  for (const request of openRequests(requests)) {
    for (const criterion of request.criteria.filter((c) => c.status === 'done')) {
      const result = runCheck(criterion.check)
      if (!result.ok) failures.push(`${request.file} の ${criterion.id}（done にしたが確認が通らない。todo に戻すか、直す）\n  $ ${criterion.check}\n${result.output}`)
    }
  }
  return failures
}

// ---- コミットの名前と、push するコミットの全教材監査台帳 ----

/** このリポジトリのコミットの名前（.claude/settings.json の env で全セッションの git に渡す）。書いていなければ null。 */
export function projectIdentity(path = SETTINGS_PATH) {
  try {
    const env = JSON.parse(readFileSync(path, 'utf8')).env ?? {}
    if (!env.GIT_AUTHOR_NAME || !env.GIT_AUTHOR_EMAIL) return null
    return { name: env.GIT_AUTHOR_NAME, email: env.GIT_AUTHOR_EMAIL }
  } catch {
    return null
  }
}

/** このセッションの git に、.claude/settings.json の env で git のフック（core.hooksPath）が届いているか。 */
export function hooksActive(env = process.env) {
  const count = Number(env.GIT_CONFIG_COUNT ?? 0)
  for (let index = 0; index < count; index += 1) {
    if (String(env[`GIT_CONFIG_KEY_${index}`]).toLowerCase() === 'core.hookspath' && env[`GIT_CONFIG_VALUE_${index}`] === HOOKS_PATH) return true
  }
  return false
}

const git = (args, options = {}) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30, timeout: 60 * 1000, ...options })
const same = (who, identity) => Boolean(who) && who.name === identity.name && who.email === identity.email
const showIdentity = (who) => (who ? `${who.name} <${who.email}>` : '（名前を決められない）')

/** git commit の前：git が使う作者（--author を含む）・コミッターの名前が、このリポジトリの名前か。 */
export function commitIdentityProblems(identity) {
  const problems = []
  for (const [role, variable] of [['作者', 'GIT_AUTHOR_IDENT'], ['コミッター', 'GIT_COMMITTER_IDENT']]) {
    const result = git(['var', variable])
    const match = result.status === 0 ? result.stdout.trim().match(/^(.*) <([^>]*)>/) : null
    const who = match ? { name: match[1], email: match[2] } : null
    if (same(who, identity)) continue
    problems.push(`コミットの${role}が「${showIdentity(who)}」になる（このリポジトリは「${showIdentity(identity)}」）。`
      + '--author は付けない。.claude/settings.json の env が届いていない場所なら、'
      + `git config user.name "${identity.name}" と git config user.email "${identity.email}" を入れてからコミットする。`)
  }
  return problems
}

/** git push の前：push するコミットのうち、まだどのリモートにもないものの作者・コミッターが、このリポジトリの名前か。 */
export function pushedIdentityProblems(sha, identity) {
  const log = git(['log', '--format=%h%x09%an%x09%ae%x09%cn%x09%ce', sha, '--not', '--remotes'])
  if (log.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の履歴を読めない: ${log.stderr.trim()}`]
  const wrong = log.stdout.split('\n').filter(Boolean).map((line) => line.split('\t')).filter(([, an, ae, cn, ce]) => (
    !same({ name: an, email: ae }, identity) || !same({ name: cn, email: ce }, identity)
  ))
  if (!wrong.length) return []
  return [[
    `push するコミットに、このリポジトリの名前（${showIdentity(identity)}）でないものがある。`,
    ...wrong.map(([hash, an, ae, cn, ce]) => `  ${hash} 作者 ${an} <${ae}>・コミッター ${cn} <${ce}>`),
    'push する前にコミットを作り直す（直前の1つなら git commit --amend --no-edit --reset-author、'
      + 'いくつもあるなら git rebase --exec \'git commit --amend --no-edit --reset-author\' <push 済みのコミット>）。',
  ].join('\n')]
}

/** git push の前：push するコミットの中身だけを取り出し、全教材監査台帳がその中身と合うかを確かめる。 */
export function ledgerProblemsAt(sha) {
  const tree = mkdtempSync(join(tmpdir(), 'push-ledger-'))
  try {
    const archive = git(['archive', '--format=tar', sha], { encoding: 'buffer' })
    if (archive.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の中身を取り出せない: ${String(archive.stderr).trim()}`]
    const extract = spawnSync('tar', ['-x', '-C', tree], { input: archive.stdout, maxBuffer: 1 << 30 })
    if (extract.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の中身を展開できない: ${String(extract.stderr).trim()}`]
    if (!existsSync(join(tree, 'scripts', 'content-audit-ledger.mjs'))) return []
    const modules = join(ROOT, 'node_modules')
    if (existsSync(modules) && !existsSync(join(tree, 'node_modules'))) symlinkSync(modules, join(tree, 'node_modules'))
    const result = spawnSync(process.execPath, ['scripts/content-audit-ledger.mjs'], {
      cwd: tree,
      env: cleanEnv(),
      encoding: 'utf8',
      maxBuffer: 1 << 28,
      timeout: 10 * 60 * 1000,
    })
    if (result.status === 0) return []
    const detail = `${result.stdout ?? ''}${result.stderr ?? ''}`.split('\n')
      .filter((line) => /台帳|sha256|Error/.test(line)).slice(0, 8).join('\n')
    return [[
      `push するコミット ${sha.slice(0, 7)} の全教材監査台帳（docs/audits/content-audit-ledger.json）が、そのコミットの中身と合わない。`,
      'npm run audit:all-content で台帳を作り直し、コミットに入れてから push する（rebase・pull で取り込んだあとは必ず作り直す）。',
      detail,
    ].filter(Boolean).join('\n')]
  } finally {
    rmSync(tree, { recursive: true, force: true })
  }
}

const RULES = [
  '【依頼の完了の決まり（CLAUDE.md・requests/）】',
  '- 利用者の依頼は、作業を始める前に requests/<日付>-<名前>.json へ原文（asked）と受け入れ条件（criteria）を書き、sessions にこのセッションの id を入れる。',
  '- 条件ごとに対象の母集団（population）を書き、全件を確かめるコマンド（check）を持たせる。「規則で拾えた分」「作りやすい分」に母集団を狭めない。',
  '- 条件を done にできるのは check が通るときだけ。自分の依頼に未（todo）が残る間はターンを終えられない。利用者の判断が要るときは needs-user と question。',
  '- 報告では、条件ごとに母集団と達成数を数字で書く。範囲を狭めたこと・やっていないことを必ず書く。',
].join('\n')

function mode(name) {
  return process.argv.includes(`--${name}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { requests, problems } = loadRequests()

  if (mode('report')) {
    console.log(describe(requests) || '開いている依頼はない')
    if (problems.length) console.log(`\n台帳の誤り:\n${problems.join('\n')}`)
    process.exit(problems.length ? 1 : 0)
  }

  if (mode('owners')) {
    const open = openRequests(requests)
    const orphans = open.filter((request) => !(request.sessions ?? []).length)
    for (const request of open) {
      const sessions = request.sessions ?? []
      console.log(`■ requests/${request.file}: ${sessions.length ? sessions.join(' ') : '持ち主のセッション（sessions）が書かれていない'}`)
    }
    if (!open.length) console.log('開いている依頼はない')
    process.exit(orphans.length ? 1 : 0)
  }

  if (mode('prompt')) {
    // このセッションの id を見せ、このセッションの依頼は条件まで全部、ほかのセッションの依頼は1行に畳んで見せる。
    const input = readInput()
    const open = describe(requests, input.session_id ?? null)
    const context = [
      RULES,
      // commit・push の前の確認は git のフックがする。フックの場所が env で届いていなければ、確認が動かない。
      hooksActive() ? '' : `\n【注意】このセッションの git に .claude/settings.json の env（core.hooksPath=${HOOKS_PATH}）が届いていない。`
        + 'commit・push の前の確認が動かないので、commit・push の前にセッションを起動し直す。',
      input.session_id ? `\n【このセッションの id】${input.session_id}（依頼台帳の sessions に書く）` : '',
      open ? `\n【開いている依頼】\n${open}` : '\n【開いている依頼】なし（新しい依頼なら、作業の前に requests/ へ書く）',
      problems.length ? `\n【台帳の誤り】\n${problems.join('\n')}` : '',
    ].filter(Boolean).join('\n')
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context } }))
    process.exit(0)
  }

  if (mode('edit')) {
    const input = readInput()
    const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? ''
    const rel = filePath ? relative(ROOT, resolve(filePath)) : ''
    const guarded = /^(src|tests|scripts)\//.test(rel)
    if (!guarded) process.exit(0)
    if (problems.length) {
      console.error(`依頼台帳に誤りがある。直してから変更すること。\n${problems.join('\n')}`)
      process.exit(2)
    }
    if (!ownRequests(requests, input.session_id).length) {
      const who = input.session_id ? `、sessions にこのセッションの id（${input.session_id}）を入れること` : 'こと'
      console.error(`${rel} を変更する前に、requests/ に依頼の原文と受け入れ条件（母集団・確認コマンドつき）を書き${who}。\n${RULES}`)
      process.exit(2)
    }
    process.exit(0)
  }

  if (mode('git-commit') || mode('git-pre-push')) {
    const failures = problems.map((problem) => `台帳の誤り: ${problem}`)
    failures.push(...doneCheckFailures(requests))
    const identity = projectIdentity()
    if (mode('git-commit')) {
      if (identity) failures.push(...commitIdentityProblems(identity))
    } else {
      // git が push する枝ごとに「ローカルの枝 ローカルのコミット リモートの枝 リモートのコミット」を1行ずつ渡す。
      const pushes = readStdin().split('\n').map((line) => line.trim().split(/\s+/)).filter((parts) => parts.length === 4)
      for (const [, localSha, remoteRef] of pushes) {
        if (/^0+$/.test(localSha)) continue // 枝を消す push
        if (identity) failures.push(...pushedIdentityProblems(localSha, identity))
        // 公開の自動処理（.github/workflows/deploy.yml）が確かめるのは main だけ。
        if (remoteRef === 'refs/heads/main') failures.push(...ledgerProblemsAt(localSha))
      }
    }
    if (failures.length) {
      const where = mode('git-commit') ? 'commit の前の確認（prepare-commit-msg）' : 'push の前の確認（pre-push）'
      console.error(`${where}が通らないので止めた（${HOOKS_PATH}）。\n\n${failures.join('\n\n')}`)
      process.exit(1)
    }
    process.exit(0)
  }

  if (mode('stop')) {
    // このセッションの依頼（sessions に id がある依頼）だけを見る。ほかのセッションの依頼は、そのセッションが終わらせる。
    // session_id が渡らないときは、開いている全依頼で止める。台帳の書き方の誤りは、どのセッションも止める。
    const input = readInput()
    const blocking = []
    for (const request of ownRequests(requests, input.session_id)) {
      for (const criterion of request.criteria.filter((c) => c.status === 'todo')) {
        blocking.push(`- ${request.file} の ${criterion.id}: ${criterion.text}（対象: ${criterion.population}）`)
      }
    }
    if (problems.length) blocking.push(...problems.map((problem) => `- 台帳の誤り: ${problem}`))
    if (blocking.length) {
      const reason = [
        input.session_id
          ? 'このセッションの依頼に、まだ終わっていない受け入れ条件がある。ターンを終えずに作業を続けること。'
          : 'まだ終わっていない受け入れ条件がある。ターンを終えずに作業を続けること。',
        '利用者の判断が要る条件だけが残っているなら、その条件を needs-user にして question を書き、質問してから終える。',
        ...blocking,
      ].join('\n')
      console.log(JSON.stringify({ decision: 'block', reason }))
    }
    process.exit(0)
  }

  console.log('使い方: node scripts/check-requests.mjs --report | --owners | --prompt | --edit | --stop | --git-commit | --git-pre-push')
}
