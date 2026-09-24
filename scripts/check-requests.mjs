#!/usr/bin/env node
// 依頼台帳（requests/*.json）で、依頼を途中で止めずに最後までやり切らせる。
// Claude Code のフックから呼ばれ、次の場面で作業を止める（.claude/settings.json）。
//   --prompt : 利用者の依頼が届いたとき。決まりと、そのセッションの終わっていない受け入れ条件を見せる（ほかのセッションの依頼は1行に畳む）。
//   --edit   : src/・tests/・scripts/ のファイルを書き換える前。開いている依頼がなければ止める。
//   --gate   : git commit / git push の前。「済」にした条件の確認コマンドを実行し、commit の前は使う名前を、
//              push の前は push するコミットの名前と全教材監査台帳を確かめる。どれかが通らなければ止める。
//   --stop   : 作業者がターンを終えようとしたとき。そのセッションの依頼に「未」の条件が残っていれば終わらせない。
//   --report : 開いている依頼と条件の一覧を表示する（人が読む用）。
//   --owners : 開いている依頼ごとに、持ち主のセッション（会話ログから割り出す）を表示する。持ち主のいない依頼があれば失敗。--all で閉じた依頼も含めた全台帳。
// 台帳の書き方は CLAUDE.md の「依頼台帳」を参照。
import { execSync, spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expandWord, gitParts, walkCommand } from './lib/shell-commands.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// テストでは CHECK_REQUESTS_DIR で別の台帳を読ませる。
const REQUESTS_DIR = process.env.CHECK_REQUESTS_DIR ?? join(ROOT, 'requests')
// このリポジトリで動いたセッションの会話ログ（Claude Code はリポジトリの絶対パスの / を - にした名前のフォルダーに置く）。
const TRANSCRIPTS_DIR = process.env.CHECK_REQUESTS_TRANSCRIPTS ?? join(homedir(), '.claude', 'projects', ROOT.replace(/[^A-Za-z0-9]/g, '-'))

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

// 依頼台帳のパス（requests/<名前>.json）。語やスクリプトの中からも拾う。
const LEDGER_PATH = /(?:^|\/)requests\/([^/]+\.json)$/
const LEDGER_IN_TEXT = /(?:^|[/\s'"`(=:,])requests\/([\w.-]+\.json)(?=$|[\s'"`),;:\]}])/g
const ledgersIn = (text) => [...String(text).matchAll(LEDGER_IN_TEXT)].map((match) => match[1])

// スクリプト（node・Python・Perl・Ruby など）がファイルに書き込む印。
const SCRIPT_WRITES = new RegExp([
  /\b(?:writeFileSync|writeFile|appendFileSync|appendFile|createWriteStream|cpSync)\s*\(/.source,
  /\.(?:rename|copyFile|unlink|rm)(?:Sync)?\s*\(/.source,
  /\bwrite_(?:text|bytes)\s*\(|\bjson\.dump\s*\(|\bopen\s*\([^)]*["'](?:[wax]|r\+)b?\+?["']|\.open\s*\(\s*["'][wax]/.source,
  /\bshutil\.(?:copy\w*|move)\s*\(|\bos\.(?:rename|replace|remove|unlink)\s*\(/.source,
  /\b(?:File|IO)\.write\s*\(|\bopen\s*\(?\s*(?:my\s+)?\$\w+\s*,\s*["']\+?>/.source,
].join('|'))
const INTERPRETERS = new Set(['node', 'nodejs', 'python', 'python3', 'perl', 'ruby', 'deno', 'bun'])
// 引数のファイルを書き換える・消す・作るコマンド。
const WRITES_ARGUMENTS = new Set(['rm', 'unlink', 'touch', 'truncate', 'tee', 'sponge', 'shred'])
// 最後の引数へ写すコマンド（前の引数は読むだけ）。mv は元も消すので、元も書き込み先。
const COPIES_TO_LAST = new Set(['cp', 'install', 'rsync', 'ditto', 'ln', 'mv'])
const GIT_WRITES = new Set(['add', 'rm', 'mv', 'checkout', 'restore'])

/**
 * Bash のコマンドが書き込む依頼台帳。単純コマンドごとに書き込み先だけを見る：
 * リダイレクトの行き先、rm・touch・tee・sed -i・perl -i の引数、cp の最後の引数（requests/ へ写すときは元の名前）、
 * mv の元と先、git add/rm/mv/checkout/restore の引数、書き込みのあるスクリプトが名指しした台帳（変数で渡したものを含む）。
 * cp の元（控えをとるだけ）、読むだけのコマンド、コミットの文やメモの中に出てくる名前は持ち主の印にしない。
 */
export function bashLedgerWrites(command) {
  const files = new Set()
  const add = (text) => { for (const file of ledgersIn(text)) files.add(file) }
  walkCommand(command, {
    cwd: ROOT,
    onSegment: ({ segment, program, args, vars }) => {
      for (const { op, target } of segment.redirects) {
        if (['>', '>>', '>|', '<>'].includes(op)) add(expandWord(target, vars).text)
      }
      if (!program) return
      const words = args.map((arg) => expandWord(arg, vars).text)
      const paths = words.filter((word) => !word.startsWith('-'))
      if (INTERPRETERS.has(program)) {
        if (program === 'perl' && words.some((word) => /^-[a-zA-Z]*i/.test(word))) {
          paths.forEach(add)
          return
        }
        const script = [...words, ...segment.heredocs].join('\n')
        if (!SCRIPT_WRITES.test(script)) return
        add(script)
        // 前の代入で台帳を入れた変数を、スクリプトが名前で読むとき（process.env.F・os.environ['F'] など）。
        for (const [name, value] of Object.entries(vars)) {
          if (new RegExp(`\\b${name}\\b`).test(script)) add([value].flat().join(' '))
        }
        return
      }
      if (program === 'git') {
        const { sub, rest } = gitParts(words)
        if (GIT_WRITES.has(sub)) rest.filter((word) => !word.startsWith('-')).forEach(add)
        return
      }
      const inPlaceSed = ['sed', 'gsed'].includes(program) && words.some((word) => /^(?:-[a-zA-Z]*i|--in-place)/.test(word))
      if (WRITES_ARGUMENTS.has(program) || inPlaceSed) {
        paths.forEach(add)
        return
      }
      if (COPIES_TO_LAST.has(program) && paths.length >= 2) {
        const target = paths.at(-1)
        for (const path of program === 'mv' ? paths : [target]) add(path)
        // requests/ のフォルダーへ写すときは、元のファイルの名前の台帳が書き込み先。
        if (/(?:^|\/)requests\/?$/.test(target)) {
          for (const source of paths.slice(0, -1)) {
            const name = source.split('/').pop()
            if (name.endsWith('.json')) files.add(name)
          }
        }
      }
    },
  })
  return files
}

/**
 * 会話ログ（JSONL の本文）から、そのセッションが作った・書き換えた依頼台帳のファイル名を割り出す。
 * 道具の呼び出しだけを見る。フックの一覧や止めた理由の文に台帳の名前が出てくるだけでは持ち主にしない。
 */
export function touchedLedgers(transcript) {
  const files = new Set()
  for (const line of String(transcript ?? '').split('\n')) {
    // 速さのための絞り込み。変数で「requests」と名前を分けて書くこともあるので、/ までは求めない。
    if (!line.includes('tool_use') || !line.includes('requests')) continue
    let entry
    try {
      entry = JSON.parse(line)
    } catch {
      continue
    }
    const content = entry?.message?.content
    if (!Array.isArray(content)) continue
    for (const item of content) {
      if (item?.type !== 'tool_use') continue
      const input = item.input ?? {}
      if (['Write', 'Edit', 'MultiEdit', 'NotebookEdit'].includes(item.name)) {
        const match = String(input.file_path ?? input.notebook_path ?? '').match(LEDGER_PATH)
        if (match) files.add(match[1])
      } else if (item.name === 'Bash') {
        for (const file of bashLedgerWrites(input.command ?? '')) files.add(file)
      }
    }
  }
  return files
}

/** 会話ログのファイルから、そのセッションの依頼台帳を割り出す。読めなければ null。 */
export function ownedLedgers(transcriptPath) {
  if (!transcriptPath || !existsSync(transcriptPath)) return null
  try {
    return touchedLedgers(readFileSync(transcriptPath, 'utf8'))
  } catch {
    return null
  }
}

/** このリポジトリの全会話ログから、台帳ごとの持ち主のセッションを集める。 */
export function ledgerOwners(dir = TRANSCRIPTS_DIR) {
  const owners = new Map()
  if (!existsSync(dir)) return owners
  for (const name of readdirSync(dir).filter((file) => file.endsWith('.jsonl')).sort()) {
    const session = basename(name, '.jsonl')
    for (const file of ownedLedgers(join(dir, name)) ?? []) {
      if (!owners.has(file)) owners.set(file, [])
      owners.get(file).push(session)
    }
  }
  return owners
}

// ---- git commit・git push の前に確かめること ----

const SETTINGS_PATH = join(ROOT, '.claude', 'settings.json')

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

const git = (dir, args, options = {}) => spawnSync('git', ['-C', dir, ...args], {
  encoding: 'utf8',
  maxBuffer: 1 << 30,
  timeout: 60 * 1000,
  ...options,
})

// git push のオプションのうち、次の語を値にとるもの（リモートや push する枝と取り違えない）。
const PUSH_OPTIONS_WITH_VALUE = new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec'])

// HEAD を動かす git のサブコマンド。同じコマンドでこのあとに push すると、push するコミットを前もって確かめられない。
const MOVES_HEAD = new Set(['commit', 'rebase', 'pull', 'merge', 'am', 'cherry-pick', 'revert', 'reset', 'switch'])

/** コマンドの中の git を、書いた順に、動かす場所（cd・git -C の行き先。読み取れなければ null）つきで返す。 */
export function gitInvocations(command, cwd = ROOT) {
  const found = []
  walkCommand(command, {
    cwd,
    onSegment: ({ program, args, vars, dir }) => {
      if (program !== 'git') return
      const { dirs, sub, rest } = gitParts(args.map((arg) => expandWord(arg, vars).text))
      let where = dir
      for (const path of dirs) where = where === null || /[$`]/.test(path) ? null : resolve(where, path)
      const movesHead = MOVES_HEAD.has(sub) || (sub === 'checkout' && !rest.includes('--'))
      found.push({ sub, rest, dir: where, movesHead })
    },
  })
  return found
}

const same = (who, identity) => who && who.name === identity.name && who.email === identity.email
const showIdentity = (who) => (who ? `${who.name} <${who.email}>` : '（名前を決められない）')

/** git commit の前：その場所の git が使う作者・コミッターの名前（--author を含む）が、このリポジトリの名前か。 */
export function commitIdentityProblems(invocation, identity) {
  const problems = []
  const identityOf = (variable) => {
    const result = git(invocation.dir, ['var', variable])
    const match = result.status === 0 ? result.stdout.trim().match(/^(.*) <([^>]*)>/) : null
    return match ? { name: match[1], email: match[2] } : null
  }
  const author = invocation.rest.map((arg, index) => (
    arg.startsWith('--author=') ? arg.slice(9) : (arg === '--author' ? invocation.rest[index + 1] : null)
  )).find(Boolean)
  const authorMatch = author?.match(/^(.*) <([^>]*)>$/)
  const who = {
    作者: authorMatch ? { name: authorMatch[1], email: authorMatch[2] } : identityOf('GIT_AUTHOR_IDENT'),
    コミッター: identityOf('GIT_COMMITTER_IDENT'),
  }
  for (const [role, person] of Object.entries(who)) {
    if (same(person, identity)) continue
    problems.push(`${invocation.dir} でのコミットの${role}が「${showIdentity(person)}」になる（このリポジトリは「${showIdentity(identity)}」）。`
      + `git -C "${invocation.dir}" config user.name "${identity.name}" && git -C "${invocation.dir}" config user.email "${identity.email}" を入れてからコミットする（--author は付けない）。`)
  }
  return problems
}

/** git push の前：push するコミットのうち、まだどのリモートにもないものの作者・コミッターが、このリポジトリの名前か。 */
export function pushedIdentityProblems(dir, sha, identity) {
  const log = git(dir, ['log', '--format=%h%x09%an%x09%ae%x09%cn%x09%ce', sha, '--not', '--remotes'])
  if (log.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の履歴を読めない: ${log.stderr.trim()}`]
  const wrong = log.stdout.split('\n').filter(Boolean).map((line) => line.split('\t')).filter(([, an, ae, cn, ce]) => (
    !same({ name: an, email: ae }, identity) || !same({ name: cn, email: ce }, identity)
  ))
  if (!wrong.length) return []
  return [[
    `push するコミットに、このリポジトリの名前（${showIdentity(identity)}）でないものがある。`,
    ...wrong.map(([hash, an, ae, cn, ce]) => `  ${hash} 作者 ${an} <${ae}>・コミッター ${cn} <${ce}>`),
    `その場所に git config user.name・user.email を入れ、push する前にコミットを作り直す（直前の1つなら git commit --amend --no-edit --reset-author、`
      + `いくつもあるなら git rebase --exec 'git commit --amend --no-edit --reset-author' <push 済みのコミット>）。`,
  ].join('\n')]
}

/** git push の前：push するコミットの中身だけを取り出し、全教材監査台帳がその中身と合うかを確かめる。 */
export function ledgerProblemsAt(dir, sha) {
  const tree = mkdtempSync(join(tmpdir(), 'push-ledger-'))
  try {
    const archive = git(dir, ['archive', '--format=tar', sha], { encoding: 'buffer' })
    if (archive.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の中身を取り出せない: ${String(archive.stderr).trim()}`]
    const extract = spawnSync('tar', ['-x', '-C', tree], { input: archive.stdout, maxBuffer: 1 << 30 })
    if (extract.status !== 0) return [`push するコミット ${sha.slice(0, 7)} の中身を展開できない: ${String(extract.stderr).trim()}`]
    if (!existsSync(join(tree, 'scripts', 'content-audit-ledger.mjs'))) return []
    const modules = [join(dir, 'node_modules'), join(ROOT, 'node_modules')].find((path) => existsSync(path))
    if (modules && !existsSync(join(tree, 'node_modules'))) symlinkSync(modules, join(tree, 'node_modules'))
    const result = spawnSync(process.execPath, ['scripts/content-audit-ledger.mjs'], {
      cwd: tree,
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

/** git commit・git push の前に確かめることを、コマンドの中の git ごとに調べる。 */
export function gitGateProblems(invocations, identity = projectIdentity()) {
  const problems = []
  invocations.forEach((invocation, index) => {
    if (invocation.sub !== 'commit' && invocation.sub !== 'push') return
    if (!invocation.dir) {
      problems.push(`git ${invocation.sub} を動かす場所が、コマンドから読み取れない（cd の行き先に $( ) や、このコマンドの中で決めていない変数がある）。`
        + 'cd の行き先をそのまま書くか、git -C <場所> で書く。')
      return
    }
    if (invocation.sub === 'commit') {
      if (identity) problems.push(...commitIdentityProblems(invocation, identity))
      return
    }
    const earlier = invocations.slice(0, index).find((other) => other.movesHead && (other.dir === null || other.dir === invocation.dir))
    if (earlier) {
      problems.push(`同じコマンドの中で git ${earlier.sub} のあとに git push している。push するコミットを前もって確かめられないので、`
        + `push は git ${earlier.sub} と分けて、単独のコマンドで行う。`)
      return
    }
    // リポジトリのいちばん上で調べる（下のフォルダーで git archive すると、そのフォルダーしか取り出さない）。
    const top = git(invocation.dir, ['rev-parse', '--show-toplevel'])
    if (top.status !== 0) return
    const root = top.stdout.trim()
    const positional = []
    for (let k = 0; k < invocation.rest.length; k += 1) {
      const arg = invocation.rest[k]
      if (PUSH_OPTIONS_WITH_VALUE.has(arg)) k += 1
      else if (!arg.startsWith('-')) positional.push(arg)
    }
    const remote = positional[0] ?? 'origin'
    const specs = positional.slice(1).map((spec) => spec.replace(/^\+/, '').split(':')[0]).filter(Boolean)
    // リモートの最新を取ってから比べる（ほかのセッションが先に push したコミットを、自分の push に数えない）。
    // 認証を求めて止まらないよう、端末で聞かない。
    git(root, ['fetch', '-q', remote], { timeout: 30 * 1000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } })
    for (const source of specs.length ? specs : ['HEAD']) {
      const resolved = git(root, ['rev-parse', '--verify', '--quiet', `${source}^{commit}`])
      if (resolved.status !== 0) continue
      const sha = resolved.stdout.trim()
      if (identity) problems.push(...pushedIdentityProblems(root, sha, identity))
      problems.push(...ledgerProblemsAt(root, sha))
    }
  })
  return problems
}

const MARKS = { todo: '未', waiting: '待', 'needs-user': '問', done: '済' }

/**
 * 開いている依頼の一覧。own（そのセッションの台帳）を渡すと、そのセッションの依頼は条件まで全部、
 * ほかのセッションの依頼は1行に畳む。own が null（会話ログが読めない）なら全部を見せる。
 */
function describe(requests, own = null) {
  const lines = []
  const others = []
  for (const request of openRequests(requests)) {
    if (own && !own.has(request.file)) {
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
    lines.push('【ほかのセッションの依頼】（このセッションは止めない。引き継ぐときは台帳を読む）', ...others)
  }
  return lines.join('\n')
}

function runCheck(command) {
  try {
    execSync(command, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], timeout: 15 * 60 * 1000 })
    return { ok: true, output: '' }
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`.trim().split('\n').slice(-15).join('\n')
    return { ok: false, output }
  }
}

const RULES = [
  '【依頼の完了の決まり（CLAUDE.md・requests/）】',
  '- 利用者の依頼は、作業を始める前に requests/<日付>-<名前>.json へ原文（asked）と受け入れ条件（criteria）を書く。',
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
    // --all では閉じた依頼も含めた全台帳を見る。
    const all = process.argv.includes('--all')
    const targets = all ? requests : openRequests(requests)
    const owners = ledgerOwners()
    const orphans = []
    for (const request of targets) {
      const sessions = owners.get(request.file) ?? []
      console.log(`■ requests/${request.file}: ${sessions.length ? sessions.join(' ') : '持ち主のセッションが見つからない'}`)
      if (!sessions.length) orphans.push(request.file)
    }
    if (!targets.length) console.log(all ? '台帳はない' : '開いている依頼はない')
    if (all) console.log(`台帳 ${targets.length}件中、持ち主のセッションがある台帳 ${targets.length - orphans.length}件`)
    process.exit(orphans.length ? 1 : 0)
  }

  if (mode('prompt')) {
    // そのセッションの依頼は条件まで全部、ほかのセッションの依頼は1行に畳んで見せる。
    let input = {}
    try {
      input = JSON.parse(readStdin() || '{}')
    } catch {
      input = {}
    }
    const open = describe(requests, ownedLedgers(input.transcript_path))
    const context = [
      RULES,
      open ? `\n【開いている依頼】\n${open}` : '\n【開いている依頼】なし（新しい依頼なら、作業の前に requests/ へ書く）',
      problems.length ? `\n【台帳の誤り】\n${problems.join('\n')}` : '',
    ].join('\n')
    console.log(JSON.stringify({ hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: context } }))
    process.exit(0)
  }

  if (mode('edit')) {
    const input = JSON.parse(readStdin() || '{}')
    const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? ''
    const rel = filePath ? relative(ROOT, resolve(filePath)) : ''
    const guarded = /^(src|tests|scripts)\//.test(rel)
    if (!guarded) process.exit(0)
    if (problems.length) {
      console.error(`依頼台帳に誤りがある。直してから変更すること。\n${problems.join('\n')}`)
      process.exit(2)
    }
    if (!openRequests(requests).length) {
      console.error(`${rel} を変更する前に、requests/ に依頼の原文と受け入れ条件（母集団・確認コマンドつき）を書くこと。\n${RULES}`)
      process.exit(2)
    }
    process.exit(0)
  }

  if (mode('gate')) {
    const input = JSON.parse(readStdin() || '{}')
    const command = String(input.tool_input?.command ?? '')
    // git commit・git push を書いたコマンドだけを確かめる（git -C "空白のある場所" push のような書き方も拾う）。
    const option = String.raw`(?:-[Cc]\s+(?:"[^"]*"|'[^']*'|\S+)|--?[\w-]+(?:=\S+)?)`
    if (!new RegExp(String.raw`\bgit(?:\s+${option})*\s+(?:commit|push)\b`).test(command)) process.exit(0)
    if (problems.length) {
      console.error(`依頼台帳に誤りがあるので、コミット・プッシュしない。\n${problems.join('\n')}`)
      process.exit(2)
    }
    const failures = []
    for (const request of openRequests(requests)) {
      for (const criterion of request.criteria.filter((c) => c.status === 'done')) {
        const result = runCheck(criterion.check)
        if (!result.ok) failures.push(`${request.file} の ${criterion.id}（done にしたが確認が通らない）\n  $ ${criterion.check}\n${result.output}`)
      }
    }
    if (failures.length) {
      console.error(`done にした条件の確認が通らないので、コミット・プッシュしない。条件を todo に戻すか、直すこと。\n\n${failures.join('\n\n')}`)
      process.exit(2)
    }
    // commit の前は名前を、push の前は push するコミットの名前と全教材監査台帳を確かめる。
    // 確かめる途中で思わぬ失敗があれば、確かめないまま通さずに止める。
    let gitProblems
    try {
      gitProblems = gitGateProblems(gitInvocations(command, input.cwd || ROOT))
    } catch (error) {
      gitProblems = [`コミット・プッシュの前の確認が途中で失敗した（scripts/check-requests.mjs を直すこと）: ${error?.stack ?? error}`]
    }
    if (gitProblems.length) {
      console.error(`コミット・プッシュの前の確認が通らないので止めた。\n\n${gitProblems.join('\n\n')}`)
      process.exit(2)
    }
    process.exit(0)
  }

  if (mode('stop')) {
    // そのセッションが作った・書き換えた依頼だけを見る。ほかのセッションの依頼は、そのセッションが終わらせる。
    // 会話ログが読めないときは、これまでどおり開いている全依頼で止める。
    let input = {}
    try {
      input = JSON.parse(readStdin() || '{}')
    } catch {
      input = {}
    }
    const own = ownedLedgers(input.transcript_path)
    const blocking = []
    for (const request of openRequests(requests)) {
      if (own && !own.has(request.file)) continue
      for (const criterion of request.criteria.filter((c) => c.status === 'todo')) {
        blocking.push(`- ${request.file} の ${criterion.id}: ${criterion.text}（対象: ${criterion.population}）`)
      }
    }
    if (problems.length) blocking.push(...problems.map((problem) => `- 台帳の誤り: ${problem}`))
    if (blocking.length) {
      const reason = [
        own
          ? 'このセッションの依頼に、まだ終わっていない受け入れ条件がある。ターンを終えずに作業を続けること。'
          : 'まだ終わっていない受け入れ条件がある。ターンを終えずに作業を続けること。',
        '利用者の判断が要る条件だけが残っているなら、その条件を needs-user にして question を書き、質問してから終える。',
        ...blocking,
      ].join('\n')
      console.log(JSON.stringify({ decision: 'block', reason }))
    }
    process.exit(0)
  }

  console.log('使い方: node scripts/check-requests.mjs --report | --owners | --prompt | --edit | --gate | --stop')
}
