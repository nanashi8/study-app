// 数学の歴史コースのテストを、手で計算せずに考え方で答えられるようにする（requests/2026-10-22-math-no-hand-calc.json の history-no-calc）。
// 全252問を1問ずつ読んだ判定（書き直した／計算しないので残した）と、書き直した問いの考え方のヒント・画面を確かめる。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { MATH_HISTORY_QUESTIONS } from '../src/data/math-history.js'
import { isResultOnlyOption } from '../src/lib/mathExamApproach.js'
import { noCalcProblems, readNoCalc } from '../scripts/checks/math-history-no-calc.mjs'

const require = createRequire(import.meta.url)
const { kanji: JOYO_KANJI } = require('joyo-kanji')
const JOYO = new Set(JOYO_KANJI)
const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')

test('歴史コースの全252問を読んだ判定があり、読んだあとに変わった問いはない', () => {
  assert.equal(MATH_HISTORY_QUESTIONS.length, 252)
  assert.deepEqual(noCalcProblems(), [])
  const decisions = Object.values(readNoCalc().questions)
  assert.equal(decisions.filter((entry) => entry.decision === 'rewritten').length, 104)
})

test('残した問いで選択肢がすべて数の問いは、計算しない理由を1問ずつ書いている', () => {
  const ledger = readNoCalc().questions
  const generic = '史実・用語の意味・決まり・図や並びの読み取りを問い、答えを出すのに計算しない'
  const failures = []
  for (const question of MATH_HISTORY_QUESTIONS) {
    if (question.hint || !question.choices.every(isResultOnlyOption)) continue
    if (ledger[question.id]?.why === generic) failures.push(`${question.id}: 数を選ぶ問いなのに、計算しない理由が決まり文句のまま`)
  }
  assert.deepEqual(failures, [])
})

test('書き直した問いは求め方を選ばせ、考え方のヒントは正解をそのまま書かず、常用漢字の外の字に読みを添える', () => {
  const failures = []
  for (const question of MATH_HISTORY_QUESTIONS.filter((item) => item.hint)) {
    if (question.choices.some(isResultOnlyOption)) failures.push(`${question.id}: 計算の結果だけの選択肢がある`)
    if (!/どう|どんな|何と何|どこから/.test(question.question)) failures.push(`${question.id}: 問いが求め方を問うていない`)
    if (question.hint.includes(question.choices[question.answer])) failures.push(`${question.id}: ヒントに正解がそのまま入っている`)
    for (const match of question.hint.matchAll(/[\p{Script=Han}々]+/gu)) {
      if ([...match[0]].every((char) => char === '々' || JOYO.has(char))) continue
      const after = question.hint.slice(match.index + match[0].length, match.index + match[0].length + 2)
      if (!/^（[ぁ-ゖ]/u.test(after)) failures.push(`${question.id}: ヒントの「${match[0]}」に読みがない`)
    }
  }
  assert.deepEqual(failures, [])
})

test('テスト画面は、ヒントのある問いにだけ「ヒント」のボタンを出し、押したときだけ考え方を開く', () => {
  const quiz = read('src/screens/MathStoryQuiz.jsx')
  assert.match(quiz, /const \[openHints, setOpenHints\] = useState\(\{\}\)/)
  assert.match(quiz, /\{question\.hint && \(openHints\[question\.id\] \? \(/)
  assert.match(quiz, /onClick=\{\(\) => setOpenHints\(\(current\) => \(\{ \.\.\.current, \[question\.id\]: true \}\)\)\}/)
  assert.match(quiz, /<MathText>\{question\.hint\}<\/MathText>/)
  assert.match(quiz, /setOpenHints\(\{\}\)/)
})
