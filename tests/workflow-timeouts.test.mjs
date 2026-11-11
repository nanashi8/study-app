// .github/workflows/ の全 job に時間切れ（timeout-minutes）があること（requests/2026-11-12-deploy-workflow-timeout.json）。
// 書かないと GitHub の既定は6時間で、固まった公開がそのまま残り、同じ順番（concurrency）の後の公開も待たされる。
// main への push で動くワークフローは、job の時間切れの合計を、公開の知らせ「【公開が終わらない】」の時間より短くする
// （動いている job は知らせの前に必ず終わる。知らせが拾うのは、順番待ちのまま進まない公開）。
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { STUCK_MS, mainPushWorkflows } from '../scripts/checks/deploy-status.mjs'

const DIR = '.github/workflows'
// いちばん長い job（build）のこれまでの最長は328秒。これより長い時間切れは、固まりを長く残すだけ。
const LONGEST_MINUTES = 20

/** ワークフローの文から、job の名前と timeout-minutes（なければ null）を読む。 */
function jobTimeouts(text) {
  const lines = text.split('\n')
  const start = lines.findIndex((line) => /^jobs:\s*(?:#.*)?$/.test(line))
  if (start < 0) return []
  const jobs = []
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line) && !line.startsWith('#')) break
    const name = line.match(/^ {2}([\w-]+):\s*(?:#.*)?$/)?.[1]
    if (name) jobs.push({ name, minutes: null, raw: null })
    const value = line.match(/^ {4}timeout-minutes:\s*(.*?)\s*(?:#.*)?$/)?.[1]
    if (value !== undefined && jobs.length) {
      jobs.at(-1).raw = value
      jobs.at(-1).minutes = /^\d+$/.test(value) ? Number(value) : null
    }
  }
  return jobs
}

const problems = (file, text) => {
  const jobs = jobTimeouts(text)
  if (!jobs.length) return [`${file}: job が読めない`]
  return jobs.flatMap(({ name, minutes, raw }) => {
    if (raw === null) return [`${file} の job ${name} に timeout-minutes がない（既定は6時間）`]
    if (minutes === null || minutes < 1) return [`${file} の job ${name} の timeout-minutes「${raw}」が分の数でない`]
    if (minutes > LONGEST_MINUTES) return [`${file} の job ${name} の timeout-minutes ${minutes} が ${LONGEST_MINUTES} 分より長い`]
    return []
  })
}

const files = readdirSync(DIR).filter((name) => /\.ya?ml$/.test(name)).sort()

test('.github/workflows/ の全ワークフローの全 job に、長すぎない timeout-minutes がある', () => {
  assert.ok(files.length >= 2, `ワークフロー ${files.length}`)
  const jobs = files.flatMap((file) => jobTimeouts(readFileSync(join(DIR, file), 'utf8')).map((job) => `${file}:${job.name}`))
  assert.ok(jobs.length >= 3, `job ${jobs.length}`)
  for (const name of ['deploy.yml:build', 'deploy.yml:deploy', 'firebase-rules.yml:deploy-rules']) assert.ok(jobs.includes(name), `${name} が読めていない`)
  // 読んだ job の数が、文の中の runs-on の数と同じ（読み落とした job がない）。
  const runsOn = files.reduce((sum, file) => sum + (readFileSync(join(DIR, file), 'utf8').match(/^ {4}runs-on:/gm)?.length ?? 0), 0)
  assert.equal(jobs.length, runsOn)
  assert.deepEqual(files.flatMap((file) => problems(file, readFileSync(join(DIR, file), 'utf8'))), [])
})

test('main への push で動くワークフローは、job の時間切れの合計が「公開が終わらない」の知らせより短い', () => {
  const pushed = mainPushWorkflows()
  assert.ok(pushed.includes('deploy.yml'), pushed.join())
  for (const file of pushed) {
    const total = jobTimeouts(readFileSync(join(DIR, file), 'utf8')).reduce((sum, job) => sum + (job.minutes ?? Infinity), 0)
    assert.ok(total * 60_000 < STUCK_MS, `${file}: job の時間切れの合計 ${total}分 が、知らせの ${STUCK_MS / 60_000}分 以上`)
  }
})

test('検査そのものが、時間切れのない job・数でない値・長すぎる値を見つける', () => {
  const deploy = readFileSync(join(DIR, 'deploy.yml'), 'utf8')
  assert.deepEqual(problems('deploy.yml', deploy), [])
  const without = deploy.replace(/^ {4}timeout-minutes: 12\n/m, '')
  assert.notEqual(without, deploy)
  assert.deepEqual(problems('deploy.yml', without), ['deploy.yml の job deploy に timeout-minutes がない（既定は6時間）'])
  // step の timeout-minutes（字下げが深い）は job の時間切れに数えない。
  const stepOnly = 'jobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: npm test\n        timeout-minutes: 5\n'
  assert.equal(problems('a.yml', stepOnly).length, 1)
  assert.equal(problems('a.yml', 'jobs:\n  build:\n    runs-on: ubuntu-latest\n    timeout-minutes: ${{ vars.LIMIT }}\n').length, 1)
  assert.equal(problems('a.yml', 'jobs:\n  build:\n    runs-on: ubuntu-latest\n    timeout-minutes: 360\n').length, 1)
  assert.equal(problems('a.yml', 'jobs:\n  build:\n    timeout-minutes: 10 # 10分\n    runs-on: ubuntu-latest\n').length, 0)
  assert.equal(problems('a.yml', 'name: x\n').length, 1)
})
