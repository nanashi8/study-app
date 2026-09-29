// 社会・理科の演習の正解が正しいことの確認（依頼台帳 requests/2026-09-29-junior-social-science.json の answers-verified）。
//   数を入れる問題 … 問題文（と図）の数だけから答えを計算し直し、データの答えと一致することを確かめる。
//                    使う数が問題文にそのまま書かれていることも確かめる（問題文の数を変えたら、ここの計算も見直す）。
//   知識の問題     … 1問ずつ読み直した記録（docs/audits/junior-social-science-answers.json）が、今の問題と一致する。
//                    問題を変えたら、読み直して node scripts/checks/junior-social-science-answers.mjs --stamp <問題ID>。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ALL_SUBJECT_QUESTIONS } from '../src/data/subjects/index.js'
import { answersLedgerProblems, readAnswersLedger, reviewedQuestions } from '../scripts/checks/junior-social-science-answers.mjs'

// ドント式で、各党の当選者数を求める。
function dhondt(votes, seats) {
  const quotients = votes.flatMap((vote, party) => Array.from({ length: seats }, (_, index) => ({ party, value: vote / (index + 1) })))
  quotients.sort((a, b) => b.value - a.value)
  const won = votes.map(() => 0)
  for (const { party } of quotients.slice(0, seats)) won[party] += 1
  return won
}

// 2本の折れ線が同じ点を通る所の値（需要曲線と供給曲線の交点の価格）。
function crossingValue(figure) {
  const [first, second] = figure.series
  const hit = first.points.find(([x, y]) => second.points.some(([x2, y2]) => x2 === x && y2 === y))
  return hit?.[1]
}

const RECOMPUTE = {
  'geo-01-q06': { given: ['4万km', '経度1度'], value: () => Math.round(40000 / 360) },
  'geo-02-q04': { given: ['東経135度', '午前10時', '経度0度'], value: () => 10 - 135 / 15 },
  'geo-02-q08': { given: ['東経135度', '西経75度'], value: () => (135 + 75) / 15 },
  'geo-10-q04': { given: ['2万5千分の1', '4cm'], value: () => (4 * 25000) / 100 },
  'geo-10-q05': { given: ['1500m', '2万5千分の1'], value: () => (1500 * 100) / 25000 },
  'geo-10-q08': { given: ['2万5千分の1', '縦2cm', '横3cm'], value: () => ((2 * 25000) / 100000) * ((3 * 25000) / 100000) },
  'geo-11-q09': { given: ['100m', '0.6℃', '20℃', '2000m'], value: () => 20 - (0.6 * 2000) / 100 },
  'his-01-q01': { given: ['1543年'], value: () => Math.floor((1543 - 1) / 100) + 1 },
  'his-01-q04': { given: ['20世紀'], value: () => (20 - 1) * 100 + 1 },
  'his-01-q07': { given: ['紀元前300年', '西暦200年'], value: () => 300 + 200 - 1 },
  'his-10-q08': { given: ['1万石につき米100石', '20万石'], value: () => (200000 / 10000) * 100 },
  'his-13-q06': { given: ['約1.1％', '4000万人'], value: () => 4000 * 0.011 },
  'his-16-q07': { given: ['約307万人', '約1241万人'], value: () => Math.round(1241 / 307) },
  'civ-01-q09': { given: ['20万人', '5万6000人'], value: () => (56000 / 200000) * 100 },
  'civ-03-q09': { given: ['40人', '過半数'], value: () => Math.floor(40 / 2) + 1 },
  'civ-04-q04': { given: ['3分の2以上', '465人'], value: () => Math.ceil((465 * 2) / 3) },
  'civ-07-q04': { given: ['定数5人', '1200票', '900票', '480票'], value: () => dhondt([1200, 900, 480], 5)[0] },
  'civ-07-q06': { given: ['48万人', '24万人'], value: () => 48 / 24 },
  'civ-08-q04': { given: ['3分の2以上', '450人'], value: () => Math.ceil((450 * 2) / 3) },
  // 条例の制定・改廃の請求は有権者の50分の1以上、首長の解職は3分の1以上（有権者40万人以下）の署名。
  'civ-09-q04': { given: ['12万人', '条例の制定'], value: () => 120000 / 50 },
  'civ-09-q05': { given: ['12万人', '解職'], value: () => 120000 / 3 },
  'civ-10-q06': { given: ['8日以内', '5月10日'], value: () => 10 + 8 - 1 },
  'civ-11-q07': { given: ['5億円', '4億2000万円'], value: () => 50000 - 42000 },
  'civ-12-q04': { given: ['需要量と供給量が一致'], value: (question) => crossingValue(question.figure) },
  'civ-12-q07': { given: ['1万円', '1ドル＝100円'], value: () => 10000 / 100 },
  'civ-13-q07': { given: ['195万円以下', '5％', '10％', '300万円'], value: () => 1950000 * 0.05 + (3000000 - 1950000) * 0.1 },
  'civ-14-q07': { given: ['500兆円', '510兆円'], value: () => ((510 - 500) / 500) * 100 },
  'civ-15-q08': { given: ['3分の2以上', '193か国'], value: () => Math.ceil((193 * 2) / 3) },
  'civ-18-q09': { given: ['2万5000人', '1万3500人'], value: () => (13500 / 25000) * 100 },
  'sc1-01-q04': { given: ['10倍', '40倍'], value: () => 10 * 40 },
  'sc1-04-q04': { given: ['54g', '20cm³'], value: () => 54 / 20 },
  'sc1-04-q07': { given: ['7.87g/cm³', '20cm³'], value: () => 7.87 * 20 },
  'sc1-06-q04': { given: ['水80g', '食塩20g'], value: () => (20 / (80 + 20)) * 100 },
  'sc1-06-q06': { given: ['15％', '200g'], value: () => 200 * 0.15 },
  'sc1-06-q07': { given: ['80g', '31.6g'], value: () => 80 - 31.6 },
  'sc1-07-q09': { given: ['質量20g', '20cm³'], value: () => 20 / 20 },
  // レンズの式 1/a + 1/b = 1/f で、像の位置を計算し直す。
  'sc1-08-q07': { given: ['焦点距離が10cm', '20cm'], value: () => 1 / (1 / 10 - 1 / 20) },
  'sc1-09-q04': { given: ['5秒', '秒速340m'], value: () => 340 * 5 },
  'sc1-09-q07': { given: ['0.002秒'], value: () => 1 / 0.002 },
  'sc1-09-q08': { given: ['1020m', '3秒'], value: () => 1020 / 3 },
  'sc1-10-q04': { given: ['20g', '2cm', '50g'], value: () => (2 * 50) / 20 },
  'sc1-10-q07': { given: ['100g', '1N', '600g', '6分の1'], value: () => 600 / 100 / 6 },
  'sc1-10-q08': { given: ['1N', '3cm', '10cm', '2.5N'], value: () => 10 + 3 * 2.5 },
  'sc1-12-q04': { given: ['60km', '5秒', '180km'], value: () => (5 * 180) / 60 },
  'sc1-12-q07': { given: ['秒速7km', '秒速4km', '84km'], value: () => 84 / 4 - 84 / 7 },
  'sc1-12-q08': { given: ['56km', '9時30分18秒', '112km', '9時30分26秒'], value: () => 18 - 56 / ((112 - 56) / (26 - 18)) },
  'sc1-13-q07': { given: ['50m', '10m', '40m', '5m'], value: () => Math.abs((50 - 10) - (40 - 5)) },
  // 水の電気分解でできる水素と酸素の体積の比は2：1。
  'sc2-01-q07': { given: ['8cm³'], value: () => 8 / 2 },
  'sc2-02-q07': { given: ['2H₂O→2H₂＋O₂', '10個'], value: () => (10 * 2) / 2 },
  'sc2-02-q08': { given: ['2Ag₂O→4Ag＋O₂', '6個'], value: () => (6 * 4) / 2 },
  'sc2-04-q04': { given: ['2.0g', '4：1'], value: () => (2.0 * (4 + 1)) / 4 },
  'sc2-04-q06': { given: ['1.2g', '3：2'], value: () => (1.2 * (3 + 2)) / 3 },
  'sc2-04-q07': { given: ['4.0g', '4.6g', '4：1'], value: () => 4.0 - (4.6 - 4.0) * 4 },
  'sc2-04-q08': { given: ['85.6g', '84.5g'], value: () => 85.6 - 84.5 },
  'sc2-05-q06': { given: ['22.0℃', '18.5℃'], value: () => 22.0 - 18.5 },
  'sc2-07-q07': { given: ['12.0mL', '4.0mL'], value: () => 12.0 - 4.0 },
  'sc2-09-q07': { given: ['10人', '2.7秒'], value: () => 2.7 / 10 },
  'sc2-10-q04': { given: ['600g', '0.02m²', '100g', '1N'], value: () => 600 / 100 / 0.02 },
  'sc2-10-q07': { given: ['気温20℃', '10℃', '9.4', '17.3'], value: () => Math.round((9.4 / 17.3) * 100) },
  'sc2-11-q07': { given: ['20℃', '12℃', '100m', '1℃'], value: () => ((20 - 12) / 1) * 100 },
  'sc2-12-q08': { given: ['12時間', '600km', '900km'], value: () => 900 / (600 / 12) },
  'sc2-14-q04': { given: ['20Ω', '6V'], value: () => 6 / 20 },
  'sc2-14-q05': { given: ['10Ω', '20Ω', '6V'], value: () => (20 * 6) / (10 + 20) },
  'sc2-14-q07': { given: ['10Ω', '15Ω', '6V'], value: () => 6 / 10 + 6 / 15 },
  'sc2-14-q08': { given: ['6V', '1.5A', '5分間'], value: () => 6 * 1.5 * 5 * 60 },
  'sc3-01-q07': { given: ['11個', 'Na⁺'], value: () => 11 - 1 },
  'sc3-01-q08': { given: ['300個'], value: () => 300 * 2 },
  'sc3-02-q08': { given: ['10cm³', '8cm³', '25cm³'], value: () => (8 * 25) / 10 },
  'sc3-04-q07': { given: ['46本'], value: () => 46 / 2 },
  'sc3-04-q08': { given: ['24本'], value: () => 24 / 2 + 24 / 2 },
  // 孫の代は AA：Aa：aa＝1：2：1。
  'sc3-05-q07': { given: ['6000個'], value: () => 6000 / 4 },
  'sc3-05-q08': { given: ['3000個'], value: () => (3000 * 2) / 3 },
  'sc3-07-q01': { given: ['100m', '20秒'], value: () => 100 / 20 },
  'sc3-07-q04': { given: ['50回', '5打点', '3.0cm'], value: () => 3.0 / (5 / 50) },
  'sc3-07-q07': { given: ['50回', '5打点', '4本目'], value: (question) => question.figure.items.reduce((sum, [, length]) => sum + length, 0) / (4 * (5 / 50)) },
  'sc3-08-q04': { given: ['7N', '3N', '反対向き'], value: () => 7 - 3 },
  'sc3-08-q05': { given: ['2.0N', '1.4N'], value: () => 2.0 - 1.4 },
  'sc3-08-q07': { given: ['3N', '4N', '垂直'], value: () => Math.hypot(3, 4) },
  'sc3-09-q04': { given: ['20N', '1.5m'], value: () => 20 * 1.5 },
  'sc3-09-q05': { given: ['300J', '5秒'], value: () => 300 / 5 },
  'sc3-09-q07': { given: ['動滑車', '0.5m'], value: () => 0.5 * 2 },
  'sc3-09-q08': { given: ['30N', '3m', '1m'], value: () => (30 * 1) / 3 },
  'sc3-10-q04': { given: ['1時間'], value: () => 360 / 24 },
  'sc3-10-q05': { given: ['午後8時', '1か月後'], value: () => 20 - (360 / 12) / (360 / 24) },
  'sc3-10-q07': { given: ['北緯35°', '23.4°'], value: () => 90 - 35 + 23.4 },
  'sc3-10-q08': { given: ['2.4cm', '9時', '7.2cm'], value: () => 9 - 7.2 / 2.4 },
  'sc3-11-q07': { given: ['約30日'], value: () => 360 / 30 },
  // 見かけの大きさが同じなら、直径の比と距離の比が等しい。
  'sc3-11-q09': { given: ['約400倍'], value: () => 400 / 1 },
  'sc3-12-q06': { given: ['1億5000万km', '秒速約30万km'], value: () => 150000000 / 300000 },
  'sc3-12-q09': { given: ['約139万km', '約1万2700km'], value: () => Math.round(1390000 / 12700) },
  'sc3-15-q07': { given: ['40％', '2500J'], value: () => 2500 * 0.4 },
  'sc3-16-q08': { given: ['60W', '8W', '5時間', '30日間'], value: () => ((60 - 8) * 5 * 30) / 1000 },
}

const numberQuestions = ALL_SUBJECT_QUESTIONS.filter((question) => question.kind === 'number')
const sameNumber = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b))

test('数を入れる問題はすべて、問題文の数から計算し直した答えと一致する', () => {
  const failures = []
  assert.deepEqual(Object.keys(RECOMPUTE).sort(), numberQuestions.map((question) => question.id).sort(), '検算の表と、数を入れる問題の全件が一致する')
  for (const question of numberQuestions) {
    const check = RECOMPUTE[question.id]
    const shown = `${question.text}\n${JSON.stringify(question.figure ?? '')}`
    for (const given of check.given) {
      if (!shown.includes(given)) failures.push(`${question.id}: 問題文に「${given}」がない（問題文が変わったので検算も見直す）`)
    }
    const value = check.value(question)
    if (typeof value !== 'number' || !Number.isFinite(value) || !sameNumber(value, question.answer)) {
      failures.push(`${question.id}: 計算し直すと ${value}、データの答えは ${question.answer}`)
    }
  }
  assert.deepEqual(failures, [])
  assert.equal(numberQuestions.length, 92)
})

test('知識の問題（選ぶ・並べる）はすべて、1問ずつ読み直した記録があり、今の問題と一致する', () => {
  assert.deepEqual(answersLedgerProblems(), [])
  const ledger = readAnswersLedger()
  assert.equal(Object.keys(ledger.questions).length, reviewedQuestions().length)
  assert.equal(reviewedQuestions().length, 826)
})

test('読み直しの記録は、問題が1字でも変わると一致しなくなる', () => {
  const [question] = reviewedQuestions()
  const ledger = readAnswersLedger()
  const changed = { ...ledger, questions: { ...ledger.questions, [question.id]: { ...ledger.questions[question.id], sha256: '0'.repeat(64) } } }
  assert.ok(answersLedgerProblems(changed).some((problem) => problem.startsWith(`${question.id}: 読み直したあとに問題が変わった`)))
})
