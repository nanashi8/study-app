#!/usr/bin/env node
// main に入っていない変更が、この端末に残っていないかを確かめる（「すべての変更をデプロイまで」の依頼で使う）。
//   node scripts/checks/leftover-changes.mjs --clones [--roots <フォルダ>,<フォルダ>…]
//     … この端末にある study-app の複製（clone・worktree。共有の作業ツリーを除く）すべてで、未コミットの変更・stash・
//       ローカルの枝と HEAD の main にないコミットの中身（ファイルの版）が、main の履歴に一度でも入ったかを確かめる。
//       main の履歴には、書き換える前の main の控え（refs/backup/<日付>/main-before-rewrite）も含める。
//       探す場所は、既定でホームのフォルダ・/private/tmp・一時フォルダ（node_modules やライブラリのキャッシュは見ない）。
//   node scripts/checks/leftover-changes.mjs --codex-snapshots
//     … 旧 Codex が作業ツリーを写した参照（refs/codex/。名前の途中に写した時刻をミリ秒で持つ）を時刻の順に並べ、
//       一度もコミットされていないファイルの版が、次の写しで捨てられず（ファイルが消えず、写す前からあるコミットの版へ戻らず）、
//       さらに編集されるか、その後にコミットされた版へ進んだか、いちばん新しい写しにコミットされていない版が残っていないかを確かめる。
// どちらも、main に入っていない変更が見つかれば一覧を出して失敗する。
// 2026-09-28、2度目の「すべての変更をデプロイまで」の依頼で、手で行った洗い出しをこの形にした。
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
// git のフックの中から呼ばれても、ほかの複製を見るときに共有の作業ツリーを取り違えないよう、リポジトリの場所を渡す環境変数は外す。
const REPOSITORY_ENV = /^GIT_(?:DIR|WORK_TREE|INDEX_FILE|PREFIX|OBJECT_DIRECTORY|ALTERNATE_OBJECT_DIRECTORIES|COMMON_DIR|NAMESPACE|QUARANTINE_PATH)$/
const ENV = Object.fromEntries(Object.entries(process.env).filter(([key]) => !REPOSITORY_ENV.test(key)))
const git = (dir, args, input) => execFileSync('git', ['-C', dir, ...args], {
  encoding: 'utf8',
  env: ENV,
  maxBuffer: 1 << 30,
  input,
  stdio: [input === undefined ? 'ignore' : 'pipe', 'pipe', 'ignore'],
})
const lines = (text) => String(text ?? '').split('\n').filter(Boolean)
const succeeds = (dir, args) => spawnSync('git', ['-C', dir, ...args], { env: ENV, stdio: 'ignore' }).status === 0
const EMPTY_BLOB = /^0+$/

/**
 * main の履歴が一度でも持ったオブジェクト（コミット・ツリー・ファイルの版）と、最初のコミット、いまの main のファイル。
 * 履歴を書き換える前の main の控え（refs/backup/<日付>/main-before-rewrite）も含める。
 */
export function mainHistory(dir = ROOT, { main = 'origin/main' } = {}) {
  const olds = lines(git(dir, ['for-each-ref', '--format=%(refname)', 'refs/backup']))
    .filter((ref) => ref.endsWith('/main-before-rewrite'))
  const tips = [main, ...olds]
  return {
    objects: new Set(lines(git(dir, ['rev-list', '--objects', ...tips])).map((line) => line.split(' ')[0])),
    roots: new Set(lines(git(dir, ['rev-list', '--max-parents=0', ...tips]))),
    paths: new Set(lines(git(dir, ['ls-tree', '-r', '--name-only', main]))),
  }
}

const PRUNE_NAMES = ['node_modules', '.Trash']
const PRUNE_PATHS = ['Library/Caches', 'Library/Containers', 'Library/Group Containers', 'Library/Photos', 'Library/Mail', 'Library/Metadata']

/** roots の下の git リポジトリのフォルダ（.git のフォルダを持つ clone と、.git のファイルを持つ worktree）。 */
export function findRepositories(roots) {
  const starts = roots.filter((root) => existsSync(root))
  if (!starts.length) return []
  const prune = [
    ...PRUNE_NAMES.flatMap((name, index) => [...(index ? ['-o'] : []), '-name', name]),
    ...PRUNE_PATHS.flatMap((path) => ['-o', '-path', `*/${path}`]),
  ]
  // 読めないフォルダがあると find は失敗で終わるが、見つけた分は出す。
  const result = spawnSync('find', [...starts, '-xdev', '(', ...prune, ')', '-prune', '-o', '-name', '.git', '-print', '-prune'], {
    encoding: 'utf8',
    maxBuffer: 1 << 28,
  })
  return [...new Set(lines(result.stdout).map((path) => dirname(path)))].sort()
}

/** study-app の複製か（リモートが study-app を指すか、main の最初のコミットを持つ）。 */
export function isStudyAppClone(dir, history) {
  let urls = ''
  try {
    urls = git(dir, ['config', '--get-regexp', '^remote\\..*\\.url$'])
  } catch {
    urls = ''
  }
  if (/(?:^|[/:])nanashi8\/study-app(?:\.git)?$/m.test(urls) || urls.includes(ROOT)) return true
  return [...history.roots].some((sha) => succeeds(dir, ['cat-file', '-e', `${sha}^{commit}`]))
}

/** diff-tree の行（:旧モード 新モード 旧版 新版 状態\tパス）から、変更後のファイルの版とパス。 */
const changedFiles = (text) => lines(text).map((line) => {
  const [meta, path] = line.split('\t')
  return { blob: meta.split(' ')[3], path }
}).filter((item) => item.path)

/**
 * 複製1つの、main の履歴に一度も入っていない変更。作業ツリーの未コミット・未追跡のファイル、stash、
 * ローカルの枝と HEAD から届く main にないコミットが変えたファイルを見る。消したファイルは、いまの main にまだあれば数える。
 * リモートの枝の写し（refs/remotes）は、そのリモートの置き場所の洗い出しで見るので数えない。
 */
export function cloneLeftovers(dir, history) {
  const leftovers = []
  const check = (where, { blob, path }) => {
    if (EMPTY_BLOB.test(blob)) {
      if (history.paths.has(path)) leftovers.push({ where, path, how: '消したファイルが main に残る' })
    } else if (!history.objects.has(blob)) {
      leftovers.push({ where, path, how: 'この版は main に入っていない' })
    }
  }

  // 作業ツリー（未コミット・未追跡）。名前を変えたファイルは、次の項目が元の名前。
  const entries = git(dir, ['status', '--porcelain=v1', '-z', '--untracked-files=all']).split('\0')
  const present = []
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    if (!entry) continue
    const [code, path] = [entry.slice(0, 2), entry.slice(3)]
    if (code[0] === 'R' || code[0] === 'C') index += 1
    if (existsSync(resolve(dir, path))) present.push(path)
    else check('未コミット', { blob: '0', path })
  }
  if (present.length) {
    const blobs = lines(git(dir, ['hash-object', '--stdin-paths'], `${present.join('\n')}\n`))
    present.forEach((path, index) => check('未コミット', { blob: blobs[index], path }))
  }

  // stash（作業ツリーと index の中身。未追跡の分があれば、それも）。
  let stashes = []
  try {
    stashes = lines(git(dir, ['rev-list', '--walk-reflogs', 'refs/stash']))
  } catch {
    stashes = []
  }
  for (const stash of stashes) {
    for (const file of changedFiles(git(dir, ['diff-tree', '-r', '--no-renames', `${stash}^1`, stash]))) check('stash', file)
    if (succeeds(dir, ['rev-parse', '--verify', '--quiet', `${stash}^3`])) {
      for (const file of changedFiles(git(dir, ['diff-tree', '-r', '--no-renames', '--root', `${stash}^3`]))) check('stash', file)
    }
  }

  // ローカルの枝と HEAD から届く、main の履歴にないコミット。
  const tips = new Set(lines(git(dir, ['for-each-ref', '--format=%(objectname)', 'refs/heads'])))
  if (succeeds(dir, ['rev-parse', '--verify', '--quiet', 'HEAD'])) tips.add(git(dir, ['rev-parse', 'HEAD']).trim())
  const commits = tips.size
    ? lines(git(dir, ['rev-list', ...tips])).filter((sha) => !history.objects.has(sha))
    : []
  for (const commit of commits) {
    for (const file of changedFiles(git(dir, ['diff-tree', '-r', '-m', '--root', '--no-renames', '--no-commit-id', commit]))) {
      check(`コミット ${commit.slice(0, 7)}`, file)
    }
  }
  return { commits: commits.length, leftovers }
}

// ---- 旧 Codex の写し ----

const SNAPSHOT_TIME = /^\d{13}$/

/** 旧 Codex が作業ツリーを写した参照（refs/codex/）。名前の途中のミリ秒の時刻で並べる。 */
export function snapshotRefs(dir = ROOT) {
  return lines(git(dir, ['for-each-ref', '--format=%(objectname) %(refname)', 'refs/codex']))
    .map((line) => {
      const [object, ref] = line.split(' ')
      return { ref, time: Number(ref.split('/').find((part) => SNAPSHOT_TIME.test(part))), tree: git(dir, ['rev-parse', `${object}^{tree}`]).trim() }
    })
    .filter((item) => Number.isFinite(item.time))
    .sort((a, b) => a.time - b.time)
}

/** 写し1つのファイル（パス → 版）。 */
export function snapshotFiles(dir, tree) {
  return new Map(lines(git(dir, ['ls-tree', '-r', '--full-tree', tree])).map((line) => {
    const [meta, path] = line.split('\t')
    return [path, meta.split(' ')[2]]
  }))
}

const versionKey = (path, blob) => `${path}\0${blob}`

/** 全参照のコミットで、ファイルの版（パスと版の組）が初めてコミットされた時刻（ミリ秒）とコミット。 */
export function firstCommits(dir = ROOT) {
  const first = new Map()
  let current = null
  for (const line of lines(git(dir, ['log', '--all', '-m', '--no-renames', '--raw', '--no-abbrev', '--format=@@ %ct %H']))) {
    if (line.startsWith('@@ ')) {
      const [, time, commit] = line.split(' ')
      current = { time: Number(time) * 1000, commit }
      continue
    }
    const match = line.match(/^:\d+ \d+ [0-9a-f]+ ([0-9a-f]+) \w+\t(.*)$/)
    if (!match || !current || EMPTY_BLOB.test(match[1])) continue
    const key = versionKey(match[2], match[1])
    if (!first.has(key) || first.get(key).time > current.time) first.set(key, current)
  }
  return first
}

/**
 * 写しを時刻の順に並べ、一度もコミットされていないファイルの版が次の写しでどうなったかを分ける。
 * snapshots は [{ time, files: Map(パス → 版) }]、first はパスと版の組 → { time }（初めてコミットされた時刻）。
 * 捨てられた（dropped）のは、次の写しでファイルが消えたか、写す前からあるコミットの版へ戻ったもの。
 */
export function snapshotTransitions(snapshots, first) {
  const uncommitted = (path, blob) => !first.has(versionKey(path, blob))
  const counts = { same: 0, edited: 0, committedLater: 0 }
  const dropped = []
  for (let index = 0; index + 1 < snapshots.length; index += 1) {
    const [now, next] = [snapshots[index], snapshots[index + 1]]
    for (const [path, blob] of now.files) {
      if (!uncommitted(path, blob)) continue
      const after = next.files.get(path)
      if (after === blob) counts.same += 1
      else if (after === undefined) dropped.push({ time: now.time, path, how: '次の写しでファイルが消えた' })
      else if (uncommitted(path, after)) counts.edited += 1
      else if (first.get(versionKey(path, after)).time > now.time) counts.committedLater += 1
      else dropped.push({ time: now.time, path, how: '写す前からあるコミットの版へ戻った' })
    }
  }
  const last = snapshots.at(-1)
  const leftAtEnd = last ? [...last.files].filter(([path, blob]) => uncommitted(path, blob)).map(([path]) => path) : []
  return { counts, dropped, leftAtEnd }
}

const when = (time) => new Date(time).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })

function runClones(roots) {
  const history = mainHistory()
  const repositories = findRepositories(roots)
  const clones = repositories.filter((dir) => resolve(dir) !== ROOT && isStudyAppClone(dir, history))
  console.log(`探した場所：${roots.join('・')}`)
  console.log(`git リポジトリ ${repositories.length}個のうち、共有の作業ツリーのほかの study-app の複製は ${clones.length}個`)
  let total = 0
  for (const dir of clones) {
    const { commits, leftovers } = cloneLeftovers(dir, history)
    total += leftovers.length
    console.log(`- ${dir}：main の履歴にないコミット ${commits}件、main に入っていない変更 ${leftovers.length}件`)
    for (const item of leftovers.slice(0, 30)) console.log(`    ${item.where}：${item.path}（${item.how}）`)
  }
  return total ? 1 : 0
}

function runSnapshots() {
  const refs = snapshotRefs()
  if (!refs.length) {
    console.log('旧 Codex の写しの参照（refs/codex/）はない')
    return 0
  }
  const snapshots = refs.map((ref) => ({ ...ref, files: snapshotFiles(ROOT, ref.tree) }))
  const first = firstCommits()
  const { counts, dropped, leftAtEnd } = snapshotTransitions(snapshots, first)
  const uncommitted = new Set()
  for (const snapshot of snapshots) {
    for (const [path, blob] of snapshot.files) if (!first.has(versionKey(path, blob))) uncommitted.add(versionKey(path, blob))
  }
  console.log(`写し ${refs.length}本（中身は ${new Set(refs.map((ref) => ref.tree)).size}通り、${when(refs[0].time)}〜${when(refs.at(-1).time)}）`)
  console.log(`一度もコミットされていないファイルの版 ${uncommitted.size}個（${new Set([...uncommitted].map((key) => key.split('\0')[0])).size}ファイル）`)
  console.log(`次の写しで：そのまま ${counts.same}・さらに編集 ${counts.edited}・その後にコミットされた版へ ${counts.committedLater}・捨てられた ${dropped.length}`)
  console.log(`いちばん新しい写し（${when(refs.at(-1).time)}）でコミットされていない版：${leftAtEnd.length}`)
  for (const item of dropped.slice(0, 30)) console.log(`  捨てられた：${when(item.time)} ${item.path}（${item.how}）`)
  for (const path of leftAtEnd.slice(0, 30)) console.log(`  最後の写しに残る：${path}`)

  // 参考：写しの中の、main の履歴には入らず、ほかの参照（控えの枝など）にだけコミットされた版。
  const history = mainHistory()
  const outside = new Map()
  for (const snapshot of snapshots) {
    for (const [path, blob] of snapshot.files) {
      const committed = first.get(versionKey(path, blob))
      if (!committed || history.objects.has(blob)) continue
      outside.set(committed.commit, (outside.get(committed.commit) ?? new Set()).add(versionKey(path, blob)))
    }
  }
  for (const [commit, versions] of outside) {
    const subject = git(ROOT, ['log', '-1', '--format=%s', commit]).trim()
    const holders = lines(git(ROOT, ['for-each-ref', '--contains', commit, '--format=%(refname)'])).filter((ref) => !ref.startsWith('refs/codex/'))
    console.log(`  参考：main には入らず ${holders.join('・') || '(参照なし)'} にだけコミットされた版 ${versions.size}個（${subject}）`)
  }
  return dropped.length || leftAtEnd.length ? 1 : 0
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const rootsAt = args.indexOf('--roots')
  const roots = rootsAt >= 0 ? args[rootsAt + 1].split(',') : [homedir(), '/private/tmp', tmpdir()]
  if (args.includes('--clones')) process.exit(runClones(roots))
  if (args.includes('--codex-snapshots')) process.exit(runSnapshots())
  console.log('使い方: node scripts/checks/leftover-changes.mjs --clones [--roots <フォルダ>,…] | --codex-snapshots')
  process.exit(2)
}
