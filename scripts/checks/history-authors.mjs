#!/usr/bin/env node
// コミットの作者・コミッターが、このリポジトリの名前（.claude/settings.json の env）だけかを確かめる。
//   node scripts/checks/history-authors.mjs              … ローカルの全枝とリモートの枝（refs/heads・refs/remotes）の全コミット
//   node scripts/checks/history-authors.mjs --references … コミットの番号を名指しした記載（追跡しているファイル・全枝のコミットの文・記憶）が、
//                                                         今の枝にあるコミットを指しているか（書き換える前の番号が残っていないか）
//   node scripts/checks/history-authors.mjs --branches   … 枝が main だけか（ローカル・リモートの参照・作業ツリーの登録・GitHub）
// 2026-09-25、端末名から作った名前（…@YuichiMac-mini-2.local）のコミットが公開の履歴に入っていたので、履歴を書き換えて作った。
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const git = (...args) => execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', maxBuffer: 1 << 28 })
const MEMORY_DIR = join(homedir(), '.claude', 'projects', ROOT.replace(/[^A-Za-z0-9]/g, '-'), 'memory')

/**
 * 今の枝（ローカルの枝と、いま設定しているリモートの枝）。書き換える前の控え（refs/original・refs/backup）と、
 * 設定から外したリモート（外部のサービスの控え）の参照は含めない。
 */
export function currentRefs() {
  const remotes = git('remote').trim().split('\n').filter(Boolean).map((name) => `refs/remotes/${name}`)
  return git('for-each-ref', '--format=%(refname)', 'refs/heads', ...remotes)
    .trim().split('\n').filter((ref) => ref && !ref.endsWith('/HEAD'))
}

export function projectIdentity() {
  const env = JSON.parse(readFileSync(join(ROOT, '.claude', 'settings.json'), 'utf8')).env ?? {}
  return { name: env.GIT_AUTHOR_NAME, email: env.GIT_AUTHOR_EMAIL }
}

/** 今の枝のコミットのうち、作者かコミッターがこのリポジトリの名前でないもの。 */
export function wrongIdentityCommits(refs = currentRefs(), identity = projectIdentity()) {
  if (!refs.length) return { total: 0, wrong: [] }
  const lines = git('log', '--format=%h%x09%an <%ae>%x09%cn <%ce>', ...refs).trim().split('\n').filter(Boolean)
  const expected = `${identity.name} <${identity.email}>`
  const wrong = lines.map((line) => line.split('\t')).filter(([, author, committer]) => author !== expected || committer !== expected)
  return { total: lines.length, wrong }
}

// コミットの番号らしい語（7〜40桁の16進数。セッションの id のようにハイフンでつながる部分は除く）。
const TOKEN = /(?<![0-9a-zA-Z-])[0-9a-f]{7,40}(?![0-9a-zA-Z-])/g

/**
 * 名指しした番号のうち、書き換える前の main（控え refs/backup/<日付>/main-before-rewrite）にあって、今の枝にないもの。
 * 書き換えで番号が変わったコミットの古い番号に当たる。控えがない clone では数えない。
 */
export function staleReferences(refs = currentRefs()) {
  const reachable = new Set(git('rev-list', ...refs).trim().split('\n'))
  const oldMains = git('for-each-ref', '--format=%(refname)', 'refs/backup').trim().split('\n').filter((ref) => ref.endsWith('/main-before-rewrite'))
  const rewritten = oldMains.length ? git('rev-list', ...oldMains).trim().split('\n').filter((sha) => !reachable.has(sha)) : []
  // 番号の頭7文字から、書き換えで消えた番号を引く表（1語ずつ git に問い合わせない）。
  const byPrefix = new Map()
  for (const sha of rewritten) byPrefix.set(sha.slice(0, 7), [...(byPrefix.get(sha.slice(0, 7)) ?? []), sha])
  const stale = []
  const scan = (where, text) => {
    for (const token of new Set(String(text).match(TOKEN) ?? [])) {
      if ((byPrefix.get(token.slice(0, 7)) ?? []).some((sha) => sha.startsWith(token))) stale.push(`${where}: ${token}`)
    }
  }
  let files = 0
  for (const file of git('ls-files').trim().split('\n')) {
    if (!/\.(?:json|md|mjs|js|jsx|txt|tsv|yml|yaml)$/.test(file) || !existsSync(join(ROOT, file))) continue
    files += 1
    scan(file, readFileSync(join(ROOT, file), 'utf8'))
  }
  let messages = 0
  for (const chunk of git('log', '--format=%H%x00%B%x01', ...refs).split('\x01')) {
    const [sha, body = ''] = chunk.trim().split('\x00')
    if (!sha) continue
    messages += 1
    scan(`コミット ${sha.slice(0, 7)} の文`, body)
  }
  let memories = 0
  if (existsSync(MEMORY_DIR)) {
    for (const file of readdirSync(MEMORY_DIR).filter((name) => name.endsWith('.md'))) {
      memories += 1
      scan(`記憶 ${file}`, readFileSync(join(MEMORY_DIR, file), 'utf8'))
    }
  }
  return { files, messages, memories, stale }
}

/**
 * 一直線の決まりのとおり、枝が main だけか：ローカルの枝・リモートの参照・作業ツリーの登録・GitHub（origin）の枝。
 * 書き換える前の控え（refs/backup・refs/original）は枝ではないので数えない。
 */
export function extraBranches({ remote = true } = {}) {
  const extra = []
  for (const ref of git('for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes').trim().split('\n').filter(Boolean)) {
    if (!['refs/heads/main', 'refs/remotes/origin/main', 'refs/remotes/origin/HEAD'].includes(ref)) extra.push(`参照 ${ref}`)
  }
  const worktrees = git('worktree', 'list', '--porcelain').split('\n').filter((line) => line.startsWith('worktree '))
  for (const line of worktrees.slice(1)) extra.push(`作業ツリーの登録 ${line.slice('worktree '.length)}`)
  if (remote) {
    for (const line of git('ls-remote', '--heads', 'origin').trim().split('\n').filter(Boolean)) {
      const ref = line.split('\t')[1]
      if (ref !== 'refs/heads/main') extra.push(`GitHub の枝 ${ref}`)
    }
  }
  return extra
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--branches')) {
    const extra = extraBranches()
    console.log(`main のほかに残っている枝・参照・作業ツリーの登録: ${extra.length}件`)
    for (const line of extra) console.log(`  ${line}`)
    process.exit(extra.length ? 1 : 0)
  }
  if (process.argv.includes('--references')) {
    const { files, messages, memories, stale } = staleReferences()
    console.log(`コミットの番号の名指し: 追跡しているファイル ${files}件・コミットの文 ${messages}件・記憶 ${memories}件を読み、書き換える前の番号 ${stale.length}か所`)
    for (const line of stale.slice(0, 40)) console.log(`  ${line}`)
    process.exit(stale.length ? 1 : 0)
  }
  const { total, wrong } = wrongIdentityCommits()
  const identity = projectIdentity()
  console.log(`今の枝の全コミット ${total}件のうち、作者・コミッターが ${identity.name} <${identity.email}> でないもの ${wrong.length}件`)
  for (const [hash, author, committer] of wrong.slice(0, 40)) console.log(`  ${hash} 作者 ${author}・コミッター ${committer}`)
  process.exit(wrong.length ? 1 : 0)
}
