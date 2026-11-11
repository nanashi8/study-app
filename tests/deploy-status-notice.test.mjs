// 公開の自動処理（main の Deploy to GitHub Pages）の最新が失敗していたら、利用者の発言ごとのフックが作業者に知らせる
// （requests/2026-11-11-audit-leftovers-fix.json）。2026-11-10 の公開の失敗（run 42768524753）に誰も気づかなかった。
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, test } from 'node:test'
import { REFRESH_MS, STUCK_MS, deployNotice, deployRuns, isPublishedRepository, mainPushWorkflows } from '../scripts/checks/deploy-status.mjs'

const made = []
after(() => made.forEach((dir) => rmSync(dir, { recursive: true, force: true })))
const temp = () => {
  const dir = mkdtempSync(join(tmpdir(), 'study-app-deploy-status-'))
  made.push(dir)
  return dir
}

const run = (overrides) => ({
  databaseId: 42768524753, headSha: '2f45240171d0ab3fa9897cad4b2de87cfdc8db6e', status: 'completed', conclusion: 'failure',
  displayTitle: 'Record the study card details as deployed', createdAt: '2026-11-10T06:34:20Z', workflowName: 'Deploy to GitHub Pages', ...overrides,
})

test('最新の終わった公開が失敗なら、run・コミット・時刻と直し方を知らせ、成功なら黙る', () => {
  const notice = deployNotice([run()])
  assert.match(notice, /^【公開の失敗】main の公開の自動処理（Deploy to GitHub Pages）の最新が failure で終わっている：run 42768524753・コミット 2f45240「Record the study card details as deployed」・11\/10 15:34（日本時間）。/)
  assert.match(notice, /gh run view 42768524753 --log-failed で理由を見て直し、公開し直す/)
  assert.equal(deployNotice([run({ conclusion: 'success' })]), '')
  assert.equal(deployNotice([run({ conclusion: 'success', databaseId: 2, createdAt: '2026-11-11T00:00:00Z' }), run()]), '', '成功のあとの古い失敗は知らせない')
  assert.match(deployNotice([run({ conclusion: 'cancelled' })]), /cancelled で終わっている/)
  assert.equal(deployNotice([]), '')
  assert.equal(deployNotice(null), '')
  // 失敗のあとに新しい公開が進んでいるときは、それを待つように知らせる。
  const running = deployNotice([run({ databaseId: 9, status: 'in_progress', conclusion: '', headSha: 'abcdef0123', createdAt: '2026-11-10T07:00:00Z' }), run()], new Date('2026-11-10T07:05:00Z').getTime())
  assert.match(running, /いま新しい公開（run 9・コミット abcdef0）が進んでいる。終わったら成否を確かめる。/)
})

test('main への push で動く公開の自動処理すべてを、それぞれの最新で見る', () => {
  // .github/workflows/ の全ワークフローのうち、main への push で動くもの（GitHub Pages とデータベースの規則）。
  const all = readdirSync('.github/workflows').filter((name) => /\.ya?ml$/.test(name)).sort()
  const onMainPush = all.filter((name) => /^on:[\s\S]*?^ {2}push:[\s\S]*?branches:[^\n]*\bmain\b/m.test(readFileSync(join('.github/workflows', name), 'utf8')))
  assert.deepEqual(mainPushWorkflows(), onMainPush)
  assert.deepEqual(mainPushWorkflows(), ['deploy.yml', 'firebase-rules.yml'])
  // ワークフローを名指しして1つに絞らない。
  assert.doesNotMatch(readFileSync('scripts/checks/deploy-status.mjs', 'utf8'), /'--workflow', 'deploy\.yml'/)
  const pages = (overrides) => run({ conclusion: 'success', ...overrides })
  const rules = (overrides) => run({ workflowName: 'Deploy Firebase DB rules', databaseId: 7, createdAt: '2026-09-25T00:44:25Z', ...overrides })
  assert.equal(deployNotice([pages(), rules({ conclusion: 'success' })]), '')
  // GitHub Pages が成功でも、データベースの規則の失敗は知らせる（並びの順に左右されない）。
  const notice = deployNotice([pages({ createdAt: '2026-11-11T00:00:00Z' }), rules({ conclusion: 'failure' })])
  assert.match(notice, /^【公開の失敗】main の公開の自動処理（Deploy Firebase DB rules）の最新が failure で終わっている：run 7・/)
  assert.doesNotMatch(notice, /Deploy to GitHub Pages/)
  // 両方の失敗は両方知らせる。
  const both = deployNotice([run(), rules({ conclusion: 'failure' })])
  assert.equal(both.match(/【公開の失敗】/g).length, 2)
  // 古い順に並んでいても、新しい成功があれば古い失敗は知らせない。
  assert.equal(deployNotice([run(), pages({ databaseId: 2, createdAt: '2026-11-11T00:00:00Z' })]), '')
})

test('公開の自動処理が長いあいだ終わらないとき（固まり）も知らせる', () => {
  const started = new Date('2026-11-10T06:34:20Z').getTime()
  const going = run({ databaseId: 11, status: 'in_progress', conclusion: '' })
  assert.equal(deployNotice([going], started + STUCK_MS - 1), '', 'ふだんの長さの間は黙る')
  const notice = deployNotice([going], started + STUCK_MS + 60_000)
  assert.match(notice, /^【公開が終わらない】main の公開の自動処理（Deploy to GitHub Pages）の run 11・コミット 2f45240「[^」]+」が、31分 たっても終わっていない（in_progress・11\/10 15:34 開始・日本時間）。/)
  assert.match(notice, /gh run cancel 11 で止めて公開し直す/)
  // 待ち行列に入ったまま（queued）も同じ。終わった run があっても、いちばん新しい run が終わらなければ知らせる。
  const queued = deployNotice([run({ conclusion: 'success', createdAt: '2026-11-10T05:00:00Z' }), run({ databaseId: 12, status: 'queued', conclusion: '' })], started + 2 * STUCK_MS)
  assert.match(queued, /run 12・[\s\S]*60分 たっても終わっていない（queued/)
  // 古い run が終わっていなくても、新しい run が成功していれば黙る。
  assert.equal(deployNotice([going, run({ databaseId: 13, conclusion: 'success', createdAt: '2026-11-10T07:00:00Z' })], started + 10 * STUCK_MS), '')
  assert.ok(STUCK_MS >= 15 * 60_000 && STUCK_MS <= 60 * 60_000)
})

test('GitHub に聞くのは控えが古いときだけで、聞けなければ前の控え、控えもなければ黙る', () => {
  const cachePath = join(temp(), 'status.json')
  let asked = 0
  const query = (runs) => () => { asked++; return runs }
  assert.deepEqual(deployRuns({ cachePath, now: 1000, query: query([run()]) }), [run()])
  assert.deepEqual(deployRuns({ cachePath, now: 1000 + REFRESH_MS - 1, query: query([]) }), [run()], '控えが新しい間は聞かない')
  assert.equal(asked, 1)
  assert.deepEqual(deployRuns({ cachePath, now: 1000 + REFRESH_MS, query: query(null) }), [run()], '聞けなければ前の控え')
  assert.equal(asked, 2)
  // 聞けなかったあとも、間隔をあけるまで聞き直さない（つながらない間、発言のたびに待たせない）。
  assert.deepEqual(deployRuns({ cachePath, now: 1000 + REFRESH_MS + 1, query: query([]) }), [run()])
  assert.deepEqual(deployRuns({ cachePath, now: 1000 + 2 * REFRESH_MS - 1, query: query([]) }), [run()])
  assert.equal(asked, 2, '聞けなかったあと、間隔の中では聞き直さない')
  assert.deepEqual(deployRuns({ cachePath, now: 1000 + 2 * REFRESH_MS, query: query([run({ conclusion: 'success' })]) }), [run({ conclusion: 'success' })])
  // 控えがなくて聞けないときも、同じように間隔をあける。
  const empty = join(temp(), 'status.json')
  assert.equal(deployRuns({ cachePath: empty, now: 5000, query: query(null) }), null)
  const before = asked
  assert.equal(deployRuns({ cachePath: empty, now: 5001, query: query([run()]) }), null)
  assert.equal(asked, before)
  assert.deepEqual(deployRuns({ cachePath: empty, now: 5000 + REFRESH_MS, query: query([run()]) }), [run()])
  assert.equal(JSON.parse(readFileSync(cachePath, 'utf8')).runs[0].conclusion, 'success')
  assert.ok(REFRESH_MS >= 60_000 && REFRESH_MS <= 15 * 60_000)
})

test('知らせるのは、公開する GitHub のリポジトリが origin のときだけ', () => {
  assert.equal(isPublishedRepository(process.cwd()), true)
  const dir = temp()
  execFileSync('git', ['init', '-q', dir])
  assert.equal(isPublishedRepository(dir), false)
  execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', 'https://github.com/someone/other.git'])
  assert.equal(isPublishedRepository(dir), false)
  execFileSync('git', ['-C', dir, 'remote', 'set-url', 'origin', 'https://github.com/nanashi8/study-app.git'])
  assert.equal(isPublishedRepository(dir), true)
})

test('利用者の発言ごとのフックが、公開の失敗を作業者に見せる', () => {
  const dir = temp()
  execFileSync('git', ['init', '-q', dir])
  execFileSync('git', ['-C', dir, 'remote', 'add', 'origin', 'https://github.com/nanashi8/study-app.git'])
  for (const path of ['scripts/check-requests.mjs', 'scripts/checks/deploy-status.mjs']) {
    mkdirSync(join(dir, path, '..'), { recursive: true })
    copyFileSync(path, join(dir, path))
  }
  mkdirSync(join(dir, 'requests'))
  const cachePath = join(dir, '..', `${dir.split('/').pop()}-status.json`)
  made.push(cachePath)
  // 控えを新しくしておき、GitHub には聞かせない。
  writeFileSync(cachePath, JSON.stringify({ at: Date.now(), runs: [run()] }))
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^(STUDY_APP_|CHECK_REQUESTS_)/.test(key)))
  const prompt = (extra) => spawnSync(process.execPath, ['scripts/check-requests.mjs', '--prompt'], {
    cwd: dir, input: JSON.stringify({ session_id: 's' }), encoding: 'utf8', env: { ...env, STUDY_APP_DEPLOY_STATUS_CACHE: cachePath, ...extra },
  })
  const shown = prompt({})
  assert.equal(shown.status, 0, shown.stderr)
  assert.match(JSON.parse(shown.stdout).hookSpecificOutput.additionalContext, /【公開の失敗】[\s\S]*run 42768524753/)
  writeFileSync(cachePath, JSON.stringify({ at: Date.now(), runs: [run({ conclusion: 'success' })] }))
  assert.doesNotMatch(JSON.parse(prompt({}).stdout).hookSpecificOutput.additionalContext, /公開の失敗/)
  writeFileSync(cachePath, JSON.stringify({ at: Date.now(), runs: [run()] }))
  assert.doesNotMatch(JSON.parse(prompt({ STUDY_APP_DEPLOY_STATUS: 'off' }).stdout).hookSpecificOutput.additionalContext, /公開の失敗/)
})
