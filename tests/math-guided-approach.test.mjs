// 数学の誘導問題（基本の型）を、手で計算せずに方針を選んで解く（requests/2026-10-22-math-no-hand-calc.json）。
// 全274問の方針の段・考え方と手がかりのヒント・画面・読んだ記録を確かめる。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import katex from 'katex'
import { MATH_PROBLEMS, MATH_UNITS } from '../src/data/math.js'
import { MATH_GUIDED_APPROACH_ROWS, mathGuidedApproach } from '../src/data/math-guided-approach.js'
import { APPROACH_WAYS, approachIssues, normalizeApproach } from '../src/lib/mathExamApproach.js'
import { GUIDED_PROBLEMS, guidedReviewProblems } from '../scripts/checks/math-guided-approach-review.mjs'

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')
const inlineMath = (text) => [...String(text ?? '').matchAll(/\$([^$]+)\$/g)].map((match) => match[1])
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })

// ── guided-approach-all ──
test('誘導問題の全274問に方針の段（2段以上・3択・全選択肢の説明）があり、計算の答えを選ぶ段はない', () => {
  assert.equal(GUIDED_PROBLEMS.length, 274)
  assert.equal(Object.keys(MATH_PROBLEMS).length, MATH_UNITS.length)
  const failures = []
  let steps = 0
  for (const problem of GUIDED_PROBLEMS) {
    const rows = MATH_GUIDED_APPROACH_ROWS[problem.id]
    if (!rows) {
      failures.push(`${problem.id}: 方針の段がない`)
      continue
    }
    for (const issue of approachIssues(rows)) failures.push(`${problem.id}: ${issue}`)
    steps += rows.length
  }
  const ids = new Set(GUIDED_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(MATH_GUIDED_APPROACH_ROWS)) if (!ids.has(id)) failures.push(`${id}: 問題がないのに方針の段がある`)
  assert.deepEqual(failures, [])
  assert.equal(steps, 549)
})

test('誘導問題のデータは、問題・着眼点・つまずきやすい点だけを持ち、タイルの穴埋め・計算の答え・答えの式を持たない', () => {
  const failures = []
  for (const problem of GUIDED_PROBLEMS) {
    if (!problem.text && !problem.prompt) failures.push(`${problem.id}: 問題文がない`)
    if (!problem.recall?.points?.length) failures.push(`${problem.id}: 着眼点がない`)
    if (!problem.pitfall?.trim()) failures.push(`${problem.id}: つまずきやすい点がない`)
    for (const gone of ['steps', 'answer', 'tiles']) if (gone in problem) failures.push(`${problem.id}: ${gone} が残っている`)
    if (problem.recall && 'quiz' in problem.recall) failures.push(`${problem.id}: 着眼点の確認クイズ（答えの選択）が残っている`)
  }
  assert.deepEqual(failures, [])
})

test('誘導問題の方針の段のどの文も KaTeX で描ける', () => {
  const failures = []
  for (const [id, rows] of Object.entries(MATH_GUIDED_APPROACH_ROWS)) {
    normalizeApproach(rows).forEach((step, index) => {
      for (const text of [step.q, step.hint, step.tryHint.text, ...step.options, ...step.notes]) {
        if ((String(text).match(/\$/g) ?? []).length % 2) failures.push(`${id} 段${index + 1}: $ の数が奇数「${text}」`)
        for (const tex of inlineMath(text)) {
          try {
            render(tex)
          } catch (error) {
            failures.push(`${id} 段${index + 1}: ${error.message}`)
          }
        }
      }
    })
  }
  assert.deepEqual(failures, [])
})

// ── guided-hints ──
test('誘導問題の全段に考え方（なぜ）と手がかり（図・表・書き出しなど）があり、正解の選択肢をそのまま書かない', () => {
  const failures = []
  const ways = new Set()
  for (const problem of GUIDED_PROBLEMS) {
    mathGuidedApproach(problem.id).forEach((step, index) => {
      if (!step.hint?.trim()) failures.push(`${problem.id} 段${index + 1}: 考え方がない`)
      if (!APPROACH_WAYS.includes(step.tryHint.way)) failures.push(`${problem.id} 段${index + 1}: 手がかりの方法「${step.tryHint.way}」`)
      if (!step.tryHint.text?.trim()) failures.push(`${problem.id} 段${index + 1}: 手がかりがない`)
      if (step.options[0].length >= 6 && (step.hint.includes(step.options[0]) || step.tryHint.text.includes(step.options[0]))) {
        failures.push(`${problem.id} 段${index + 1}: ヒントに正解がそのまま入っている`)
      }
      ways.add(step.tryHint.way)
    })
  }
  assert.deepEqual(failures, [])
  assert.ok(ways.size >= 6, `使った方法 ${[...ways]}`)
})

// ── guided-screen ──
test('誘導問題の画面は方針の段を選ぶだけで進み、ヒントは押したときだけ開き、着眼点と公式は答え合わせのあとに出す', () => {
  const solve = read('src/screens/MathSolve.jsx')
  for (const gone of ['MathFillIn', 'MathAnswerPad', 'tiles', 'p.answer', 'p.steps', 'recall.quiz', 'InstructorExplanation']) {
    assert.ok(!solve.includes(gone), `${gone} が残っている`)
  }
  assert.match(solve, /const steps = p \? mathGuidedApproach\(p\.id\) : \[\]/)
  assert.match(solve, /<MathExamApproachSteps\s+problem=\{p\}\s+steps=\{steps\}\s+picks=\{picks\}\s+hints=\{hints\}/)
  assert.match(solve, /const openHint = \(stepIndex\) => setHints\(\(current\) => \(\{ \.\.\.current, \[stepIndex\]: Math\.min\(2, \(current\[stepIndex\] \?\? 0\) \+ 1\) \}\)\)/)
  // 着眼点と公式は方針の答えになるので、解き終わり（solved）のあとだけ。
  const review = solve.slice(solve.indexOf('{solved && ('), solve.indexOf('</div>\n        )}', solve.indexOf('{solved && (')))
  assert.match(review, /<MathExamSolutionFlow steps=\{steps\} \/>/)
  assert.match(review, /<RecallCard recall=\{p\.recall\} \/>/)
  assert.match(review, /data-math-pitfall/)
  assert.equal(solve.match(/<RecallCard /g).length, 1)
  assert.match(solve, /\{left > 0 \? `解き方の流れを見る（あと\$\{left\}段）` : '解き方の流れを見る'\}/)
})

test('誘導問題の正答率は、はじめの選択で正しく選べた段（ヒントを開いた段はふくめない）で数え、記録とクリアにつなぐ', () => {
  const solve = read('src/screens/MathSolve.jsx')
  assert.match(solve, /correct: steps\.filter\(\(_, index\) => \(picks\[index\] \?\? \[\]\)\[0\] === 0 && !\(hints\[index\] > 0\)\)\.length/)
  assert.match(solve, /const result = unknown \? \{ correct: 0, total: steps\.length \} : stepScore\(steps, picks, hints\)/)
  assert.match(solve, /markMathDone\(p\.id\)/)
  assert.match(solve, /recordContentQuizResult\('math', p\.id, result\.correct, result\.total\)/)
  assert.match(solve, /if \(params\.unitId && !params\.problemIds\?\.length\) setMathMastery\(params\.unitId, pct\)/)
  // 入口は、数学マップ・学年別の単元一覧・入試演習の単元から開く導入画面と、学習一覧で選んだ問題（problemIds）。
  // どれも同じ画面で方針を選んで解く。
  for (const file of ['src/screens/MathMap.jsx', 'src/screens/MathUnits.jsx', 'src/screens/MathExam.jsx']) {
    assert.match(read(file), /navigate\('mathIntro', \{ unitId: /, `${file} から導入画面へ行けない`)
  }
  assert.match(read('src/screens/MathIntro.jsx'), /navigate\('mathSolve', \{ unitId: unit\.id \}\)/)
  assert.match(read('src/lib/learningContentCatalog.js'), /screen: 'mathSolve'/)
  assert.match(solve, /Array\.isArray\(params\.problemIds\) && params\.problemIds\.length/)
})

// ── guided-approach-read ──
test('誘導問題の全問の方針の段を読んだ記録があり、読んだあとに変わった問題はない', () => {
  assert.deepEqual(guidedReviewProblems(), [])
})
