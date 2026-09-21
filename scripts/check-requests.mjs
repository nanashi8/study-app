#!/usr/bin/env node
// 依頼台帳（requests/*.json）で、依頼を途中で止めずに最後までやり切らせる。
// Claude Code のフックから呼ばれ、次の場面で作業を止める（.claude/settings.json）。
//   --prompt : 利用者の依頼が届いたとき。決まりと、終わっていない受け入れ条件を作業者に見せる。
//   --edit   : src/・tests/・scripts/ のファイルを書き換える前。開いている依頼がなければ止める。
//   --gate   : git commit / git push の前。「済」にした条件の確認コマンドを実行し、通らなければ止める。
//   --stop   : 作業者がターンを終えようとしたとき。「未」の条件が残っていれば終わらせない。
//   --report : 開いている依頼と条件の一覧を表示する（人が読む用）。
// 台帳の書き方は CLAUDE.md の「依頼台帳」を参照。
import { execSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// テストでは CHECK_REQUESTS_DIR で別の台帳を読ませる。
const REQUESTS_DIR = process.env.CHECK_REQUESTS_DIR ?? join(ROOT, 'requests')

// 条件の状態。done（確認コマンドが通る）以外で作業者がターンを終えてよいのは、
// 利用者の判断待ち（needs-user：question に聞くことを書く）と、裏で走る処理の待ち（waiting：何を待つかを書く）だけ。
export const CRITERION_STATUSES = ['todo', 'done', 'waiting', 'needs-user']
export const REQUEST_STATUSES = ['open', 'done']

const readStdin = () => {
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

function describe(requests) {
  const lines = []
  for (const request of openRequests(requests)) {
    lines.push(`■ ${request.title}（requests/${request.file}）`)
    for (const criterion of request.criteria) {
      const mark = { done: '済', todo: '未', waiting: '待', 'needs-user': '問' }[criterion.status] ?? '?'
      lines.push(`  [${mark}] ${criterion.id}: ${criterion.text}（対象: ${criterion.population}）`)
    }
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
  '- 条件を done にできるのは check が通るときだけ。未（todo）が残る間はターンを終えられない。利用者の判断が要るときは needs-user と question。',
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

  if (mode('prompt')) {
    const open = describe(requests)
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
    if (!/\bgit\s+(commit|push)\b/.test(command)) process.exit(0)
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
    process.exit(0)
  }

  if (mode('stop')) {
    const blocking = []
    for (const request of openRequests(requests)) {
      for (const criterion of request.criteria.filter((c) => c.status === 'todo')) {
        blocking.push(`- ${request.file} の ${criterion.id}: ${criterion.text}（対象: ${criterion.population}）`)
      }
    }
    if (problems.length) blocking.push(...problems.map((problem) => `- 台帳の誤り: ${problem}`))
    if (blocking.length) {
      const reason = [
        'まだ終わっていない受け入れ条件がある。ターンを終えずに作業を続けること。',
        '利用者の判断が要る条件だけが残っているなら、その条件を needs-user にして question を書き、質問してから終える。',
        ...blocking,
      ].join('\n')
      console.log(JSON.stringify({ decision: 'block', reason }))
    }
    process.exit(0)
  }

  console.log('使い方: node scripts/check-requests.mjs --report | --prompt | --edit | --gate | --stop')
}
