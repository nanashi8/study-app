// 公開の自動処理（main への push で動くワークフローすべて。GitHub Pages の deploy.yml・データベースの規則の firebase-rules.yml）の
// それぞれの最新が失敗していたら知らせる。
// 2026-11-10、公開（run 42768524753）がビルド中の取り寄せの時間切れで落ち、次の push まで誰も気づかなかった。
// 利用者の発言ごとのフック（scripts/check-requests.mjs --prompt）が、この知らせを作業者に見せる。
// GitHub への問い合わせは REFRESH_MS に1回（控えは ~/.cache）。問い合わせられないときは前の控えを使い、控えもなければ黙る。
//   node scripts/checks/deploy-status.mjs   いまの知らせを出す（なければ「最新の公開は成功」）
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const DEPLOY_STATUS_CACHE = process.env.STUDY_APP_DEPLOY_STATUS_CACHE ?? join(homedir(), '.cache', 'study-app-deploy-status.json')
export const REFRESH_MS = 5 * 60 * 1000
export const QUERY_TIMEOUT_MS = 8000
const FIELDS = 'databaseId,headSha,status,conclusion,displayTitle,createdAt,workflowName'

/** main への push で動くワークフローのファイル名（.github/workflows/ の on.push.branches に main があるもの）。 */
export function mainPushWorkflows(root = ROOT) {
  const dir = join(root, '.github', 'workflows')
  let names = []
  try {
    names = readdirSync(dir).filter((name) => /\.ya?ml$/.test(name)).sort()
  } catch {
    return []
  }
  return names.filter((name) => {
    const text = readFileSync(join(dir, name), 'utf8')
    const push = text.match(/^on:[\s\S]*?^ {2}push:\s*\n((?: {4,}.*\n?)*)/m)?.[1] ?? ''
    return /branches:\s*\[[^\]]*\bmain\b[^\]]*\]|branches:\s*\n\s*-\s*main\b/.test(push)
  })
}

/** GitHub に、main の公開の自動処理の新しい順の run を、ワークフローごとに聞く。1つも聞けなければ null。 */
export function queryDeployRuns(root = ROOT) {
  const runs = []
  let answered = 0
  for (const workflow of mainPushWorkflows(root)) {
    const result = spawnSync('gh', ['run', 'list', '--workflow', workflow, '--branch', 'main', '--limit', '3', '--json', FIELDS], {
      cwd: root, encoding: 'utf8', timeout: QUERY_TIMEOUT_MS,
    })
    if (result.status !== 0 || !result.stdout) continue
    try {
      const listed = JSON.parse(result.stdout)
      if (!Array.isArray(listed)) continue
      answered++
      runs.push(...listed.map((run) => ({ ...run, workflowName: run.workflowName ?? workflow })))
    } catch {
      // 読めない答えは、聞けなかったのと同じに扱う。
    }
  }
  return answered ? runs : null
}

const jst = (iso) => new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(5, 16).replace('T', ' ').replace('-', '/')

/** ワークフローごとの新しい順の run から、知らせる文を作る（どのワークフローも最新の終わった run が成功なら空）。 */
export function deployNotice(runs) {
  if (!Array.isArray(runs) || !runs.length) return ''
  const byWorkflow = new Map()
  for (const run of runs) {
    const name = run.workflowName ?? 'deploy.yml'
    if (!byWorkflow.has(name)) byWorkflow.set(name, [])
    byWorkflow.get(name).push(run)
  }
  const notices = []
  for (const [name, list] of byWorkflow) {
    const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    const latest = sorted.find((run) => run.status === 'completed')
    if (!latest || latest.conclusion === 'success') continue
    const running = sorted.find((run) => run.status !== 'completed' && new Date(run.createdAt) > new Date(latest.createdAt))
    notices.push([
      `【公開の失敗】main の公開の自動処理（${name}）の最新が ${latest.conclusion} で終わっている：`
        + `run ${latest.databaseId}・コミット ${String(latest.headSha).slice(0, 7)}「${latest.displayTitle}」・${jst(latest.createdAt)}（日本時間）。`,
      running
        ? `いま新しい公開（run ${running.databaseId}・コミット ${String(running.headSha).slice(0, 7)}）が進んでいる。終わったら成否を確かめる。`
        : `公開されたものは古いまま。gh run view ${latest.databaseId} --log-failed で理由を見て直し、公開し直す（直せないなら利用者に知らせる）。`,
    ].join('\n'))
  }
  return notices.join('\n')
}

/** 控えを使って最新の run の並びを返す（REFRESH_MS より古ければ聞き直す）。聞けなければ前の控え、なければ null。 */
export function deployRuns({ now = Date.now(), cachePath = DEPLOY_STATUS_CACHE, refreshMs = REFRESH_MS, query = () => queryDeployRuns() } = {}) {
  let cached = null
  try {
    cached = JSON.parse(readFileSync(cachePath, 'utf8'))
  } catch {
    cached = null
  }
  if (cached && now - cached.at < refreshMs) return cached.runs
  const runs = query()
  if (!runs) return cached?.runs ?? null
  try {
    mkdirSync(dirname(cachePath), { recursive: true })
    writeFileSync(cachePath, JSON.stringify({ at: now, runs }))
  } catch {
    // 控えを書けなくても、知らせは出す。
  }
  return runs
}

/** このリポジトリ（公開する GitHub のリポジトリが origin）のときだけ知らせる。テストの使い捨てのリポジトリでは黙る。 */
export function isPublishedRepository(root = ROOT) {
  const result = spawnSync('git', ['-C', root, 'remote', 'get-url', 'origin'], { encoding: 'utf8', timeout: 5000 })
  return result.status === 0 && /github\.com[:/]nanashi8\/study-app(?:\.git)?\s*$/.test(result.stdout)
}

/** フックが見せる知らせ（なければ空）。 */
export function deployStatusNotice(options = {}) {
  if (process.env.STUDY_APP_DEPLOY_STATUS === 'off') return ''
  if (!isPublishedRepository(options.root)) return ''
  return deployNotice(deployRuns(options))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const runs = deployRuns({ refreshMs: 0 })
  if (!runs) {
    console.log('公開の自動処理の結果を GitHub に聞けない')
    process.exitCode = 1
  } else {
    const notice = deployNotice(runs)
    const names = [...new Set(runs.map((run) => run.workflowName))]
    console.log(notice || `最新の公開は成功（${names.map((name) => `${name} run ${runs.find((run) => run.workflowName === name && run.status === 'completed')?.databaseId ?? 'なし'}`).join('・')}）`)
    process.exitCode = notice ? 1 : 0
  }
}
