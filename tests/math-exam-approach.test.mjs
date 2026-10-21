// 数学の入試演習を、手で計算せずに方針を選んで解く（requests/2026-10-22-math-no-hand-calc.json）。
// 全360問の方針の段・考え方と手がかりのヒント・解き方の流れ・読んだ記録・演習画面を確かめる。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import katex from 'katex'
import { MATH_EXAM_PROBLEMS } from '../src/data/math-exam.js'
import { MATH_EXAM_APPROACH_ROWS, mathExamApproach } from '../src/data/math-exam-approach.js'
import {
  APPROACH_WAYS,
  approachFirstTryCorrect,
  approachIssues,
  approachOrder,
  approachResult,
  approachStepsDone,
  isResultOnlyOption,
  normalizeApproach,
} from '../src/lib/mathExamApproach.js'
import { approachReviewProblems } from '../scripts/checks/math-exam-approach-review.mjs'

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')
const inlineMath = (text) => [...String(text ?? '').matchAll(/\$([^$]+)\$/g)].map((match) => match[1])
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })
const UNIT_COUNTS = { junior1: 56, junior2: 56, junior3: 72, math1: 40, mathA: 24, math2: 56, mathB: 16, mathC: 16, math3: 24 }

// ── exam-approach-all ──
test('入試演習の全360問に方針の段（2段以上・3択・全選択肢の説明）があり、計算の結果だけの選択肢はない', () => {
  assert.equal(MATH_EXAM_PROBLEMS.length, 360)
  assert.equal(Object.values(UNIT_COUNTS).reduce((sum, count) => sum + count, 0), 360)
  const failures = []
  let steps = 0
  for (const problem of MATH_EXAM_PROBLEMS) {
    const rows = MATH_EXAM_APPROACH_ROWS[problem.id]
    if (!rows) {
      failures.push(`${problem.id}: 方針の段がない`)
      continue
    }
    for (const issue of approachIssues(rows)) failures.push(`${problem.id}: ${issue}`)
    steps += rows.length
  }
  const ids = new Set(MATH_EXAM_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(MATH_EXAM_APPROACH_ROWS)) if (!ids.has(id)) failures.push(`${id}: 問題がないのに方針の段がある`)
  assert.deepEqual(failures, [])
  assert.ok(steps >= 720, `段は ${steps}`)
})

test('計算の結果だけの選択肢を見分ける', () => {
  for (const option of ['$-17$', '$x=3$', '$\\dfrac{7}{18}$', '80通り', '$90^\\circ$', '$p=8$', '12']) assert.ok(isResultOnlyOption(option), option)
  for (const option of ['$3a-5$', '直角（$90^\\circ$）', '傾き×$x$ の増加量', '$\\dfrac{1}{3}\\times\\text{底面積}\\times\\text{高さ}$', '$>$']) assert.ok(!isResultOnlyOption(option), option)
})

test('方針の段のどの文も KaTeX で描ける', () => {
  const failures = []
  for (const [id, rows] of Object.entries(MATH_EXAM_APPROACH_ROWS)) {
    normalizeApproach(rows).forEach((step, index) => {
      const texts = [step.q, step.hint, step.tryHint.text, ...step.options, ...step.notes]
      for (const text of texts) {
        if ((String(text).match(/\$/g) ?? []).length % 2) failures.push(`${id} 段${index + 1}: $ の数が奇数「${text}」`)
        for (const tex of inlineMath(text)) {
          try {
            render(tex)
          } catch (error) {
            failures.push(`${id} 段${index + 1}: ${error.message}`)
          }
        }
      }
      if (step.tryHint.math) {
        try {
          render(step.tryHint.math)
        } catch (error) {
          failures.push(`${id} 段${index + 1} 手がかりの式: ${error.message}`)
        }
      }
    })
  }
  assert.deepEqual(failures, [])
})

// ── exam-step-hints ──
test('全段に考え方（なぜ）と手がかり（実際に手を動かす方法）があり、正解の選択肢をそのまま書かない。標準の問題は1段目で手のつけ方を問う', () => {
  const failures = []
  const ways = new Set()
  for (const problem of MATH_EXAM_PROBLEMS) {
    const steps = mathExamApproach(problem.id)
    steps.forEach((step, index) => {
      if (!step.hint?.trim()) failures.push(`${problem.id} 段${index + 1}: 考え方がない`)
      if (!APPROACH_WAYS.includes(step.tryHint.way)) failures.push(`${problem.id} 段${index + 1}: 手がかりの方法「${step.tryHint.way}」`)
      if (!step.tryHint.text?.trim()) failures.push(`${problem.id} 段${index + 1}: 手がかりがない`)
      if (step.hint.includes(step.options[0]) || step.tryHint.text.includes(step.options[0])) failures.push(`${problem.id} 段${index + 1}: ヒントに正解がそのまま入っている`)
      ways.add(step.tryHint.way)
    })
    if (problem.level === 'standard' && !/まず|はじめに|どこから/.test(steps[0]?.q ?? '')) failures.push(`${problem.id}: 標準の1段目が手のつけ方を問うていない`)
  }
  assert.deepEqual(failures, [])
  // 図にする・表にする・書き出すなど、決めた方法がどれも実際に使われている。
  assert.deepEqual([...ways].sort(), [...APPROACH_WAYS].sort())
})

test('ヒントは段ごとに考え方→手がかりの順に押したときだけ開き、開いた段があれば「ヒントで正解」', () => {
  const steps = normalizeApproach([
    ['q1', 'h1', ['図にする', 't1'], ['正', 'n'], ['誤', 'n'], ['誤2', 'n']],
    ['q2', 'h2', ['表にする', 't2'], ['正', 'n'], ['誤', 'n'], ['誤2', 'n']],
  ])
  assert.equal(approachResult(steps, { 0: [0], 1: [0] }), 'solved')
  assert.equal(approachResult(steps, { 0: [0], 1: [0] }, { hintsUsed: 1 }), 'hinted')
  assert.equal(approachResult(steps, { 0: [2, 0], 1: [0] }), 'wrong')
  assert.equal(approachResult(steps, {}, { unknown: true }), 'unknown')
  assert.equal(approachFirstTryCorrect(steps, { 0: [0], 1: [1, 0] }), false)
  assert.equal(approachStepsDone(steps, { 0: [1, 0], 1: [2] }), 1)
  const component = read('src/components/MathExamApproach.jsx')
  assert.match(component, /const opened = reviewed \? 2 : hints\[stepIndex\] \?\? 0/)
  assert.match(component, /\{opened >= 1 && \(/)
  assert.match(component, /\{opened >= 2 && \(/)
  assert.match(component, /`手がかり：\$\{step\.tryHint\.way\}`/)
  assert.match(component, /'ヒント：なぜ・どう考える？' : 'まだ分からない：手がかりを見る'/)
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /hints: \{ \.\.\.base\.hints, \[stepIndex\]: Math\.min\(2, \(base\.hints\?\.\[stepIndex\] \?\? 0\) \+ 1\) \}/)
  assert.match(solve, /const hintsUsed = Object\.values\(draft\?\.hints \?\? \{\}\)\.reduce/)
})

test('選択肢の並びは問題と段で決まり、正解の位置がかたよらない', () => {
  assert.deepEqual(approachOrder('mx-pn-01', 0, 3), approachOrder('mx-pn-01', 0, 3))
  const firstPositions = [0, 0, 0]
  for (const problem of MATH_EXAM_PROBLEMS) {
    mathExamApproach(problem.id).forEach((step, index) => {
      const order = approachOrder(problem.id, index, step.options.length)
      assert.deepEqual([...order].sort(), [0, 1, 2])
      firstPositions[order.indexOf(0)] += 1
    })
  }
  for (const count of firstPositions) assert.ok(count > 150, `正解の位置 ${firstPositions}`)
})

// ── exam-solution-flow ──
test('答え合わせのあとに、1段目から順に決めたこと（正解）となぜ（考え方）を並べた解き方の流れを出す', () => {
  const component = read('src/components/MathExamApproach.jsx')
  assert.match(component, /export function MathExamSolutionFlow\(\{ steps \}\)/)
  assert.match(component, /<MathText>\{step\.options\[0\]\}<\/MathText>/)
  assert.match(component, /<span className="mr-1 text-violet-700">なぜ<\/span>/)
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /<MathExamSolutionFlow steps=\{steps\} \/>/)
  assert.match(solve, /\{record && \(\s*<section className="mt-4 space-y-3 animate-slide-up" data-math-exam-review>/)
})

// ── exam-approach-read ──
test('全問の方針の段を読んだ記録があり、読んだあとに変わった問題はない', () => {
  assert.deepEqual(approachReviewProblems(), [])
})

// ── exam-screen-approach-only ──
test('演習画面は方針を選ぶだけで進み、数字キー・解答欄の入力・手で解く・計算の表示・目安時間・答え方の決まりを出さない', () => {
  const solve = read('src/screens/MathExamSolve.jsx')
  for (const gone of ['MathAnswerKeypad', 'MathAnswerSheet', 'MathAnswerPad', 'data-math-exam-timer', 'answerRules', 'timeVerdict', 'TIME_VERDICTS', '手で解く', 'data-math-exam-solution', 'checkProblemAnswers', 'data-math-exam-worked']) {
    assert.ok(!solve.includes(gone), `${gone} が残っている`)
  }
  assert.match(solve, /<MathExamApproachSteps/)
  assert.match(solve, /const result = approachResult\(steps, picks, \{ hintsUsed, unknown \}\)/)
  assert.match(solve, /recordAttempt\(problem\.id, result, seconds\)/)
  assert.match(solve, /\{left > 0 \? `答え合わせ（あと\$\{left\}段）` : '答え合わせ'\}/)
  // 単元別・総合演習（単元名と型を伏せる）・今日の演習（kind）・解き直し（ids）のどれも同じ画面で解く。
  assert.match(solve, /if \(Array\.isArray\(params\.ids\) && params\.ids\.length\) return params\.ids\.map\(mathExamProblem\)/)
  assert.match(solve, /if \(params\.unitId\) return mathExamProblemsForUnit/)
  assert.match(solve, /if \(params\.scope\) return mathExamProblemsForScope/)
  assert.match(solve, /if \(params\.kind\) return mathExamProblemsForKind/)
  assert.match(solve, /const revealIdentity = !mixed \|\| Boolean\(record\)/)
  const component = read('src/components/MathExamApproach.jsx')
  // まちがえたらその方針だとどうなるかを出し、選び直させる。答え合わせのあとは全段の全選択肢の説明。
  assert.match(component, /\{!open && lastWrong !== undefined && \(/)
  assert.match(component, /disabled=\{open \|\| picked\}/)
  assert.match(component, /title=\{`選択肢解説（\$\{step\.options\.length\}択すべて）`\}/)
  assert.ok(!component.includes('solution'), '計算（解答の筋道）を見せていない')
  // 入口の説明にも、紙に解く・解答欄に入れるといった手で解く案内を残さない。
  for (const file of ['src/screens/MathMap.jsx', 'src/screens/MathExam.jsx', 'src/screens/MathExamUnit.jsx', 'src/screens/MathIntro.jsx']) {
    assert.doesNotMatch(read(file), /解答欄|紙に解|手で解|数字キー|目安時間/, `${file} に手で解く案内が残っている`)
  }
})
