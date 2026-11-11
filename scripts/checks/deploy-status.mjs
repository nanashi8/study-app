// 公開の自動処理（main の Deploy to GitHub Pages）の最新が失敗していたら知らせる。
// 2026-11-10、公開（run 42768524753）がビルド中の取り寄せの時間切れで落ち、次の push まで誰も気づかなかった。
// 利用者の発言ごとのフック（scripts/check-requests.mjs --prompt）が、この知らせを作業者に見せる。
// GitHub への問い合わせは REFRESH_MS に1回（控えは ~/.cache）。問い合わせられないときは前の控えを使い、控えもなければ黙る。
//   node scripts/checks/deploy-status.mjs   いまの知らせを出す（なければ「最新の公開は成功」）
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const DEPLOY_STATUS_CACHE = process.env.STUDY_APP_DEPLOY_STATUS_CACHE ?? join(homedir(), '.cache', 'study-app-deploy-status.json')
export const REFRESH_MS = 5 * 60 * 1000
export const QUERY_TIMEOUT_MS = 8000
const FIELDS = 'databaseId,headSha,status,conclusion,displayTitle,createdAt,workflowName'

/** GitHub に、main の公開の自動処理の新しい順の run を聞く。聞けなければ null。 */
export function queryDeployRuns(root = ROOT) {
  const result = spawnSync('gh', ['run', 'list', '--workflow', 'deploy.yml', '--branch', 'main', '--limit', '5', '--json', FIELDS], {
    cwd: root, encoding: 'utf8', timeout: QUERY_TIMEOUT_MS,
  })
  if (result.status !== 0 || !result.stdout) return null
  try {
    const runs = JSON.parse(result.stdout)
    return Array.isArray(runs) ? runs : null
  } catch {
    return null
  }
}

const jst = (iso) => new Date(new Date(iso).getTime() + 9 * 3600 * 1000).toISOString().slice(5, 16).replace('T', ' ').replace('-', '/')

/** 新しい順の run の並びから、知らせる文を作る（最新の終わった run が成功なら空）。 */
export function deployNotice(runs) {
  if (!Array.isArray(runs) || !runs.length) return ''
  const latest = runs.find((run) => run.status === 'completed')
  if (!latest || latest.conclusion === 'success') return ''
  const running = runs.find((run) => run.status !== 'completed' && new Date(run.createdAt) > new Date(latest.createdAt))
  return [
    `【公開の失敗】main の公開の自動処理（${latest.workflowName ?? 'deploy.yml'}）の最新が ${latest.conclusion} で終わっている：`
      + `run ${latest.databaseId}・コミット ${String(latest.headSha).slice(0, 7)}「${latest.displayTitle}」・${jst(latest.createdAt)}（日本時間）。`,
    running
      ? `いま新しい公開（run ${running.databaseId}・コミット ${String(running.headSha).slice(0, 7)}）が進んでいる。終わったら成否を確かめる。`
      : `公開版は古いまま。gh run view ${latest.databaseId} --log-failed で理由を見て直し、公開し直す（直せないなら利用者に知らせる）。`,
  ].join('\n')
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
    console.log(notice || `最新の公開は成功（run ${runs.find((run) => run.status === 'completed')?.databaseId ?? 'なし'}）`)
    process.exitCode = notice ? 1 : 0
  }
}
