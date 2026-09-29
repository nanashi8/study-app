// 数学の入試演習（requests/2026-09-29-math-exam-practice.json）の受け入れ条件を、全単元・全問・全画面で確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import katex from 'katex'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { MATH_UNITS } from '../src/data/math.js'
import {
  MATH_EXAM_KINDS,
  MATH_EXAM_LEVEL_FILTERS,
  MATH_EXAM_PATTERNS,
  MATH_EXAM_PROBLEMS,
  MATH_EXAM_QUIZ_DOMAIN,
  MATH_EXAM_SCOPES,
  mathExamKindOf,
  mathExamProblemsForKind,
  mathExamProblemsForScope,
  mathExamProblemsForUnit,
  scopesForKind,
} from '../src/data/math-exam.js'
import {
  BOX_LABELS,
  answerTexWithValues,
  attemptResult,
  checkProblemAnswers,
  normalizeEntry,
  pressAnswerKey,
  problemBoxes,
  renderAnswerTex,
  templateBoxes,
  timeVerdict,
} from '../src/lib/mathExam.js'
import {
  appendMathExamLog,
  mathExamStatusCounts,
  normalizeMathExamLog,
  retryMathExamIds,
} from '../src/lib/mathExamLog.js'
import { recordContentQuizResult } from '../src/lib/contentProgress.js'
import { STUDY_ORDER_STAGE, rankQuestionsForStudy } from '../src/lib/studyOrder.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { PROGRESS_RESET_GROUPS } from '../src/lib/progressReset.js'
import { LEARNING_CONTENTS, buildLearningContentProgress } from '../src/lib/learningContentProgress.js'
import { LEARNING_CONTENT_CATALOG_ACTIONS, learningContentCatalogLaunch } from '../src/lib/learningContentCatalog.js'

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')
const JUNIOR = new Set(['中1', '中2', '中3'])
const renderTex = (tex, where) => {
  try {
    katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })
  } catch (error) {
    throw new Error(`${where}: KaTeX で描けない（${error.message}）：${tex}`)
  }
}
// 文の中の $…$ を取り出す。
const inlineMath = (text) => [...String(text ?? '').matchAll(/\$([^$]+)\$/g)].map((match) => match[1])

let vite
let MathExamFigure
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
  MathExamFigure = (await vite.ssrLoadModule('/src/components/MathExamFigure.jsx')).MathExamFigure
})
after(async () => {
  await vite?.close()
})

// ── units-both-levels ──
test('全45単元に入試演習があり、中学は高校入試・高校は大学入試の問題として、基礎と標準を各4問以上もつ', () => {
  assert.equal(MATH_UNITS.length, 45)
  const failures = []
  for (const unit of MATH_UNITS) {
    const problems = mathExamProblemsForUnit(unit.id)
    const basic = problems.filter((problem) => problem.level === 'basic').length
    const standard = problems.filter((problem) => problem.level === 'standard').length
    if (basic < 4) failures.push(`${unit.id}: 基礎 ${basic}問`)
    if (standard < 4) failures.push(`${unit.id}: 標準 ${standard}問`)
    if (mathExamKindOf(unit.id) !== (JUNIOR.has(unit.grade) ? 'high' : 'univ')) failures.push(`${unit.id}: 入試の種類`)
  }
  assert.deepEqual(failures, [])
  // どの問題も、どれかの単元の基礎か標準。
  const unitIds = new Set(MATH_UNITS.map((unit) => unit.id))
  for (const problem of MATH_EXAM_PROBLEMS) {
    assert.ok(unitIds.has(problem.unit), `${problem.id}: 単元`)
    assert.ok(['basic', 'standard'].includes(problem.level), `${problem.id}: 難しさ`)
    assert.match(problem.id, new RegExp(`^mx-${problem.unit}-\\d{2}$`), `${problem.id}: ID の形`)
  }
  assert.equal(new Set(MATH_EXAM_PROBLEMS.map((problem) => problem.id)).size, MATH_EXAM_PROBLEMS.length)
  // 入試の種類ごとの問題は、その種類の単元の問題だけで全部。
  assert.equal(mathExamProblemsForKind('high').length + mathExamProblemsForKind('univ').length, MATH_EXAM_PROBLEMS.length)
  assert.ok(mathExamProblemsForKind('high').every((problem) => mathExamKindOf(problem.unit) === 'high'))
})

// ── patterns-covered ──
test('全単元に出題の型の一覧があり、全ての型に問題が1問以上あり、全問がその単元の型のどれかに入る', () => {
  const failures = []
  let patternCount = 0
  for (const unit of MATH_UNITS) {
    const patterns = MATH_EXAM_PATTERNS[unit.id] ?? []
    if (patterns.length < 3) failures.push(`${unit.id}: 型が ${patterns.length} つ`)
    if (new Set(patterns.map((pattern) => pattern.id)).size !== patterns.length) failures.push(`${unit.id}: 型の ID が重複`)
    for (const pattern of patterns) {
      patternCount += 1
      if (!pattern.title?.trim()) failures.push(`${unit.id}/${pattern.id}: 型の名前がない`)
      if (/\$|\\/.test(pattern.title)) failures.push(`${unit.id}/${pattern.id}: 型の名前に数式の記号`)
      if (!mathExamProblemsForUnit(unit.id).some((problem) => problem.pattern === pattern.id)) {
        failures.push(`${unit.id}/${pattern.id}（${pattern.title}）: 問題がない`)
      }
    }
  }
  for (const problem of MATH_EXAM_PROBLEMS) {
    if (!(MATH_EXAM_PATTERNS[problem.unit] ?? []).some((pattern) => pattern.id === problem.pattern)) {
      failures.push(`${problem.id}: 型 ${problem.pattern} が単元の一覧にない`)
    }
  }
  assert.deepEqual(failures, [])
  assert.ok(patternCount >= MATH_UNITS.length * 3)
  // 単元の演習ページは、型ごとに問題と自分の結果を並べる。
  const unitPage = read('src/screens/MathExamUnit.jsx')
  assert.match(unitPage, /mathExamPatternsForUnit\(unit\.id\)\.map\(\(pattern\) =>/)
  assert.match(unitPage, /data-math-exam-pattern-section=\{pattern\.id\}/)
  assert.match(unitPage, /latestMathExamAttempt\(mathExamLog, problem\.id\)/)
  assert.match(unitPage, /bestSolvedSeconds\(mathExamLog, problem\.id\)/)
})

// ── answer-entry ──
test('全問の解答欄は、キーで入れられる整数か選択肢で、式の中の欄と答えが1対1に合い、KaTeX で描ける', () => {
  const failures = []
  let boxCount = 0
  for (const problem of MATH_EXAM_PROBLEMS) {
    const at = problem.id
    if (!Array.isArray(problem.parts) || !problem.parts.length) {
      failures.push(`${at}: 小問（parts）がない`)
      continue
    }
    const labels = problemBoxes(problem)
    const perPart = problem.parts.map((part) => templateBoxes(part.answer))
    if (perPart.some((list) => !list.length)) failures.push(`${at}: 欄のない小問がある`)
    if (new Set(labels).size !== labels.length) failures.push(`${at}: 同じ欄が2つの小問にある`)
    // 欄は ア・イ・ウ…の順に、とばさずに使う。
    if (labels.join('') !== BOX_LABELS.slice(0, labels.length).join('')) failures.push(`${at}: 欄の並び ${labels.join('')}`)
    const keys = Object.keys(problem.boxes ?? {})
    if (keys.sort().join() !== [...labels].sort().join()) failures.push(`${at}: 欄 ${labels.join('')} と答え ${keys.join('')} が合わない`)
    for (const label of labels) {
      boxCount += 1
      const value = problem.boxes[label]
      const choice = problem.choices?.[label]
      if (choice) {
        if (!Array.isArray(choice.options) || choice.options.length < 2) failures.push(`${at} ${label}: 選択肢が2つ未満`)
        if (new Set(choice.options).size !== choice.options.length) failures.push(`${at} ${label}: 選択肢が重複`)
        if (!Number.isInteger(value) || value < 0 || value >= choice.options.length) failures.push(`${at} ${label}: 正解の番号が範囲外`)
      } else {
        if (!Number.isInteger(value)) failures.push(`${at} ${label}: 答えが整数でない（${value}）`)
        if (Math.abs(value) > 99999) failures.push(`${at} ${label}: 5けたをこえる`)
        // 数字キーで入れた文字列が、そのまま正解になる。
        if (normalizeEntry(String(value)) !== String(value)) failures.push(`${at} ${label}: 入力の形にならない`)
      }
    }
    for (const label of Object.keys(problem.choices ?? {})) {
      if (!labels.includes(label)) failures.push(`${at}: 選択肢 ${label} が式にない`)
    }
    for (const [index, part] of problem.parts.entries()) {
      // 負の値の欄の前に + や − を書かない（「+ −3」のような式にしない）。
      for (const match of part.answer.matchAll(/([+\-])\s*\[([゠-ヿ])\]/g)) {
        if (!problem.choices?.[match[2]] && problem.boxes[match[2]] < 0) failures.push(`${at} ${match[2]}: 符号のあとの欄に負の数`)
      }
      try {
        renderTex(renderAnswerTex(problem, part.answer), `${at} 小問${index + 1}（空の欄）`)
        renderTex(renderAnswerTex(problem, part.answer, { values: Object.fromEntries(labels.map((label) => [label, problem.choices?.[label] ? problem.boxes[label] : String(problem.boxes[label])])), perBox: Object.fromEntries(labels.map((label) => [label, true])) }), `${at} 小問${index + 1}（答え合わせ）`)
        renderTex(answerTexWithValues(problem, part.answer), `${at} 小問${index + 1}（正しい答え）`)
      } catch (error) {
        failures.push(error.message)
      }
    }
  }
  assert.deepEqual(failures, [])
  assert.ok(boxCount >= MATH_EXAM_PROBLEMS.length)
})

test('数字キーで入れた値を正しく答え合わせする（符号・0・けた・選択式）', () => {
  assert.equal(pressAnswerKey('', '5'), '5')
  assert.equal(pressAnswerKey('5', 'minus'), '-5')
  assert.equal(pressAnswerKey('-5', 'minus'), '5')
  assert.equal(pressAnswerKey('', 'minus'), '-')
  assert.equal(pressAnswerKey('-', '3'), '-3')
  assert.equal(pressAnswerKey('0', '7'), '7')
  assert.equal(pressAnswerKey('-12', 'back'), '-1')
  assert.equal(pressAnswerKey('-1', 'back'), '-')
  assert.equal(pressAnswerKey('12345', '6'), '12345')
  assert.equal(normalizeEntry('-0'), '0')
  assert.equal(normalizeEntry('007'), '7')
  assert.equal(normalizeEntry('-'), '')
  for (const problem of MATH_EXAM_PROBLEMS) {
    const labels = problemBoxes(problem)
    const right = Object.fromEntries(labels.map((label) => [label, problem.choices?.[label] ? problem.boxes[label] : String(problem.boxes[label])]))
    const result = checkProblemAnswers(problem, right)
    assert.ok(result.correct && result.filled, `${problem.id}: 正解を入れても正解にならない`)
    const [first] = labels
    const wrongValue = problem.choices?.[first]
      ? (problem.boxes[first] + 1) % problem.choices[first].options.length
      : String(problem.boxes[first] + 1)
    const wrong = checkProblemAnswers(problem, { ...right, [first]: wrongValue })
    assert.equal(wrong.correct, false, `${problem.id}: まちがいを正解にしてしまう`)
    assert.equal(wrong.perBox[first], false)
    assert.equal(checkProblemAnswers(problem, {}).filled, false)
  }
  // 画面：解答欄の式・欄のボタン・数字キー・答え方の決まり。
  const solve = read('src/screens/MathExamSolve.jsx')
  const pad = read('src/components/MathAnswerPad.jsx')
  assert.match(pad, /data-math-exam-box=\{label\}/)
  assert.match(pad, /data-math-exam-keypad/)
  assert.match(pad, /\['1', '2', '3', '4', '5', 'minus', 'back'\]/)
  assert.match(pad, /\['6', '7', '8', '9', '0', 'next'\]/)
  assert.match(pad, /data-math-exam-choices=\{active\}/)
  assert.match(solve, /分数は、それ以上約分できない形で。負の符号は分子につける/)
  assert.match(solve, /根号の中は、できるだけ小さい自然数に/)
  assert.match(solve, /比は、もっとも簡単な整数の比に/)
  assert.match(solve, /data-math-exam-answer-rules/)
})

// ── hints-solutions ──
test('全問に段階ヒント（2段以上・答えの値を書かない）・解答の筋道（2段以上）・ポイント・つまずきやすい点があり、数式が描ける', () => {
  const failures = []
  for (const problem of MATH_EXAM_PROBLEMS) {
    const at = problem.id
    if (!problem.text?.trim()) failures.push(`${at}: 問題文がない`)
    if (!Array.isArray(problem.hints) || problem.hints.length < 2) failures.push(`${at}: ヒントが2段未満`)
    if (!Array.isArray(problem.solution) || problem.solution.length < 2) failures.push(`${at}: 解答の筋道が2段未満`)
    if (!problem.point?.trim()) failures.push(`${at}: ポイントがない`)
    if (!problem.pitfall?.trim()) failures.push(`${at}: つまずきやすい点がない`)
    for (const step of problem.solution ?? []) {
      if (!step.text?.trim() && !step.math?.trim()) failures.push(`${at}: 空の筋道`)
    }
    if (new Set(problem.hints).size !== problem.hints.length) failures.push(`${at}: 同じヒントが2つ`)
    // ヒントに、正しい答えを入れた解答欄の式（x=5 など）をそのまま書かない。
    for (const part of problem.parts) {
      const filled = answerTexWithValues(problem, part.answer).replace(/\\[,;: ]|\\quad|\\text\{[^}]*\}|\s/g, '')
      for (const hint of problem.hints) {
        const flat = inlineMath(hint).join('').replace(/\\[,;: ]|\\quad|\s/g, '')
        if (filled.length >= 3 && flat.includes(filled)) failures.push(`${at}: ヒントに答え ${filled} が書いてある`)
      }
    }
    for (const hint of problem.hints) {
      if (/答えは|正解は/.test(hint)) failures.push(`${at}: ヒントが答えを言っている`)
    }
    // 数式として描けるか。
    const texts = [problem.text, ...problem.hints, problem.point, problem.pitfall, ...(problem.parts.map((part) => part.q ?? '')), ...(problem.solution ?? []).map((step) => step.text ?? '')]
    for (const [index, text] of texts.entries()) {
      for (const tex of inlineMath(text)) {
        try {
          renderTex(tex, `${at} 文${index}`)
        } catch (error) {
          failures.push(error.message)
        }
      }
      if ((String(text).match(/\$/g) ?? []).length % 2) failures.push(`${at} 文${index}: $ の数が奇数`)
    }
    for (const tex of [problem.math, ...(problem.solution ?? []).map((step) => step.math)].filter(Boolean)) {
      try {
        renderTex(tex, `${at} 式`)
      } catch (error) {
        failures.push(error.message)
      }
    }
    for (const [label, choice] of Object.entries(problem.choices ?? {})) {
      if (!Array.isArray(choice.notes) || choice.notes.length !== choice.options.length) failures.push(`${at} ${label}: 選択肢の説明が全択分ない`)
      if ((choice.notes ?? []).some((note) => !note?.trim())) failures.push(`${at} ${label}: 空の説明`)
      if (new Set(choice.notes ?? []).size !== (choice.notes ?? []).length) failures.push(`${at} ${label}: 同じ説明が2つ`)
      for (const text of [...choice.options, ...(choice.notes ?? [])]) {
        for (const tex of inlineMath(text)) {
          try {
            renderTex(tex, `${at} ${label} 選択肢`)
          } catch (error) {
            failures.push(error.message)
          }
        }
      }
    }
  }
  assert.deepEqual(failures, [])
})

test('ヒントは押したときだけ1段ずつ開き、正しい答えは答え合わせか「わからない」のあとだけ出る', () => {
  const solve = read('src/screens/MathExamSolve.jsx')
  const pad = read('src/components/MathAnswerPad.jsx')
  // ヒント：開いた数だけ出す。答え合わせのあとは全部。
  assert.match(solve, /const hintsOpened = record \? problem\.hints\.length : draft\?\.hints \?\? 0/)
  assert.match(solve, /problem\.hints\.slice\(0, hintsOpened\)\.map/)
  assert.match(solve, /hints: Math\.min\(problem\.hints\.length, base\.hints \+ 1\)/)
  // 答え：記録（答え合わせ・わからない）があるときだけ reveal し、解答の筋道も記録のあとだけ。
  assert.match(solve, /reveal=\{Boolean\(record\)\}/)
  assert.match(solve, /\{record && \(\s*<section className="mt-4 space-y-3 animate-slide-up" data-math-exam-review>/)
  assert.match(pad, /\{checked && \(\s*<MathBlock\s*tex=\{answerTexWithValues\(problem, part\.answer\)\}/)
  assert.match(pad, /\{perBox && !ok && \(/)
  // 選択式の欄は、答え合わせのあとに全選択肢の説明を出す。
  assert.match(solve, /rows=\{problem\.choices\[label\]\.options\.map\(\(option, optionIndex\) => \(\{/)
  assert.match(solve, /body: problem\.choices\[label\]\.notes\[optionIndex\]/)
})

// ── review-cycle ──
test('結果は4通り（自力で正解・ヒントで正解・不正解・わからない）に分け、自力で正解だけを正解として記録する', () => {
  assert.equal(attemptResult({ correct: true, hintsUsed: 0 }), 'solved')
  assert.equal(attemptResult({ correct: true, hintsUsed: 2 }), 'hinted')
  assert.equal(attemptResult({ correct: false, hintsUsed: 0 }), 'wrong')
  assert.equal(attemptResult({ correct: false, hintsUsed: 1, unknown: true }), 'unknown')

  const [a, b, c, d] = MATH_EXAM_PROBLEMS.slice(0, 4)
  let log = {}
  let results = {}
  const record = (id, result, at) => {
    log = appendMathExamLog(log, id, { result, seconds: 90, day: 20000 })
    results = recordContentQuizResult(results, { domain: MATH_EXAM_QUIZ_DOMAIN, itemId: id, correct: result === 'solved' ? 1 : 0, total: 1, timestamp: at })
  }
  const yesterday = Date.now() - 86400000 * 2
  record(a.id, 'solved', yesterday)
  record(b.id, 'hinted', yesterday)
  record(c.id, 'wrong', yesterday)
  record(d.id, 'unknown', yesterday)
  assert.deepEqual(mathExamStatusCounts(log, [a.id, b.id, c.id, d.id]), { solved: 1, hinted: 1, wrong: 1, unknown: 1, unanswered: 0 })
  assert.deepEqual(retryMathExamIds(log, [a.id, b.id, c.id, d.id]), [b.id, c.id, d.id])
  assert.equal(results[`${MATH_EXAM_QUIZ_DOMAIN}:${a.id}`].lastResult, 'correct')
  for (const id of [b.id, c.id, d.id]) assert.equal(results[`${MATH_EXAM_QUIZ_DOMAIN}:${id}`].lastResult, 'wrong')
  // 保存の形がくずれていても、正しい記録だけを読む。
  assert.deepEqual(normalizeMathExamLog({ [a.id]: [{ day: 1, result: 'solved', seconds: 30 }, { day: -1, result: 'x', seconds: 1 }], bad: [] }), { [a.id]: [{ day: 1, result: 'solved', seconds: 30 }] })

  // 全教材共通の出題順：前の日に解けなかった問題（ヒントで正解・不正解・わからない）→ まだ解いていない問題 → 自力で正解した問題。
  const pool = MATH_EXAM_PROBLEMS.slice(0, 8)
  const ranked = rankQuestionsForStudy(pool, { quizResults: results, quizDomain: MATH_EXAM_QUIZ_DOMAIN, rng: null })
  const order = ranked.map((entry) => entry.item.id)
  const stageOf = (id) => ranked.find((entry) => entry.item.id === id).stage
  for (const id of [b.id, c.id, d.id]) assert.equal(stageOf(id), STUDY_ORDER_STAGE.review, `${id}: 解き直しが復習の段にない`)
  assert.equal(stageOf(a.id), STUDY_ORDER_STAGE.rest)
  assert.ok(order.indexOf(b.id) < order.indexOf(pool[4].id) && order.indexOf(pool[4].id) < order.indexOf(a.id))

  // 画面：答え合わせ・わからないで、問題ごとに記録する。目次に「今日の演習」と「解き直し」。
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /recordAttempt\(problem\.id, result, seconds\)/)
  assert.match(solve, /rankQuestionsForStudy\(pool, \{\s*quizResults: state\.contentQuizResults,\s*quizDomain: MATH_EXAM_QUIZ_DOMAIN,/)
  const store = read('src/store/useStore.js')
  assert.match(store, /recordMathExamAttempt: \(problemId, result, seconds\) =>/)
  assert.match(store, /domain: MATH_EXAM_QUIZ_DOMAIN, itemId: problemId, correct: result === 'solved' \? 1 : 0, total: 1/)
  const toc = read('src/screens/MathExam.jsx')
  assert.match(toc, /data-math-exam-today-practice/)
  assert.match(toc, /data-math-exam-retry/)
  assert.match(toc, /retryMathExamIds\(mathExamLog, kindProblems\.map\(\(problem\) => problem\.id\)\)/)
})

// ── mixed-practice ──
test('入試の範囲4つ×基礎・標準・すべてで、単元を混ぜた総合演習が組め、答え合わせまで単元名と型をふせる', () => {
  assert.deepEqual(MATH_EXAM_SCOPES.map((scope) => scope.id), ['high', 'ia', 'iibc', 'iii'])
  assert.deepEqual(MATH_EXAM_KINDS.map((kind) => kind.id), ['high', 'univ'])
  assert.deepEqual(MATH_EXAM_LEVEL_FILTERS.map((level) => level.id), ['all', 'basic', 'standard'])
  for (const scope of MATH_EXAM_SCOPES) {
    const units = MATH_UNITS.filter((unit) => scope.grades.includes(unit.grade))
    for (const level of MATH_EXAM_LEVEL_FILTERS) {
      const problems = mathExamProblemsForScope(scope.id, level.id)
      assert.ok(problems.length > 0, `${scope.id}/${level.id}: 問題がない`)
      // 範囲の全単元から出る。
      assert.deepEqual(new Set(problems.map((problem) => problem.unit)), new Set(units.map((unit) => unit.id)), `${scope.id}/${level.id}: 単元の抜け`)
      if (level.id !== 'all') assert.ok(problems.every((problem) => problem.level === level.id))
    }
  }
  assert.deepEqual(scopesForKind('univ').map((scope) => scope.id), ['ia', 'iibc', 'iii'])
  const toc = read('src/screens/MathExam.jsx')
  assert.match(toc, /solve\(\{ scope: scope\.id, level, mixed: true, title: /)
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /const revealIdentity = !mixed \|\| Boolean\(record\)/)
  assert.match(solve, /\{revealIdentity && unit && <Chip/)
  assert.match(solve, /\{revealIdentity && pattern && \(/)
  assert.match(solve, /rng: mixed \? Math\.random : null/)
})

// ── time-target ──
test('全問に目安時間があり、演習中はかかった時間を、答え合わせで目安との比べを出す', () => {
  for (const problem of MATH_EXAM_PROBLEMS) {
    assert.ok(Number.isInteger(problem.minutes) && problem.minutes >= 1 && problem.minutes <= 20, `${problem.id}: 目安時間 ${problem.minutes}`)
  }
  assert.equal(timeVerdict(50, 2), 'fast')
  assert.equal(timeVerdict(100, 2), 'ok')
  assert.equal(timeVerdict(130, 2), 'slow')
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /data-math-exam-timer/)
  assert.match(solve, /`\$\{formatSeconds\(elapsed\)\} \/ 目安\$\{problem\.minutes\}分`/)
  assert.match(solve, /setInterval\(\(\) => setNow\(Date\.now\(\)\), 1000\)/)
  assert.match(solve, /`かかった時間 \$\{formatSeconds\(record\.seconds\)\}（目安\$\{problem\.minutes\}分）/)
})

// ── figures ──
test('「図」と書いた問題には図があり、全図が SVG で描け（NaN・undefined なし）、点が描く範囲の中にある', () => {
  const failures = []
  for (const problem of MATH_EXAM_PROBLEMS) {
    // 「箱ひげ図」「樹形図」「展開図」などのことばは除き、問題が図そのものを指しているか（図のように・図の…）を見る。
    const mentions = /図/.test(problem.text.replace(/箱ひげ図|樹形図|展開図|投影図|見取図|見取り図|作図|図形/g, ''))
    if (mentions && !problem.figure) failures.push(`${problem.id}: 図と書いてあるのに図がない`)
    if (!problem.figure) continue
    const figure = problem.figure
    if (!figure.label?.trim()) failures.push(`${problem.id}: 図の説明がない`)
    const [xmin, xmax, ymin, ymax] = figure.view
    for (const [name, [x, y]] of Object.entries(figure.points ?? {})) {
      if (!(x >= xmin && x <= xmax && y >= ymin && y <= ymax)) failures.push(`${problem.id}: 点${name} が範囲の外`)
    }
    const markup = renderToStaticMarkup(React.createElement(MathExamFigure, { figure }))
    if (!/^<svg /.test(markup)) failures.push(`${problem.id}: svg でない`)
    if (/NaN|undefined|Infinity/.test(markup)) failures.push(`${problem.id}: 数が壊れている`)
    if (!/role="img"/.test(markup)) failures.push(`${problem.id}: 読み上げ名がない`)
  }
  assert.deepEqual(failures, [])
})

// ── screens-and-records ──
test('数学マップ・学年別の単元一覧・45単元の導入画面から入試演習へ行け、目次 → 単元の演習ページ → 演習 → 結果とつながる', () => {
  const app = read('src/App.jsx')
  for (const screen of ['MathExam', 'MathExamUnit', 'MathExamSolve']) {
    assert.match(app, new RegExp(`const ${screen}Screen = lazyScreen\\(\\(\\) => import\\('./screens/${screen}.jsx'\\), '${screen}Screen'\\)`))
  }
  assert.match(app, /mathExam: MathExamScreen,\n\s*mathExamUnit: MathExamUnitScreen,\n\s*mathExamSolve: MathExamSolveScreen,/)
  assert.match(read('src/lib/appHome.js'), /'mathExam', 'mathExamUnit', 'mathExamSolve'/)
  assert.match(read('src/lib/contentSettings.js'), /'mathExam', 'mathExamUnit', 'mathExamSolve'/)
  assert.match(read('src/screens/MathMap.jsx'), /onClick=\{\(\) => navigate\('mathExam'\)\}[\s\S]{0,300}data-math-exam-entry/)
  assert.match(read('src/screens/MathUnits.jsx'), /navigate\('mathExamUnit', \{ unitId: u\.id \}\)[\s\S]{0,300}data-math-units-exam=\{u\.id\}/)
  // 導入画面は、どの単元でも入試演習の入口を出す（全45単元に問題がある）。
  assert.match(read('src/screens/MathIntro.jsx'), /navigate\('mathExamUnit', \{ unitId: unit\.id \}\)[\s\S]{0,300}data-math-intro-exam=\{unit\.id\}/)
  for (const unit of MATH_UNITS) assert.ok(mathExamProblemsForUnit(unit.id).length > 0, `${unit.id}: 導入画面から行く先がない`)
  const toc = read('src/screens/MathExam.jsx')
  assert.match(toc, /navigate\('mathExamUnit', \{ unitId: unit\.id, returnTo \}\)/)
  assert.match(toc, /studyLabel="基本の型"[\s\S]*?onStudy=\{\(\) => navigate\('mathIntro', \{ unitId: unit\.id \}\)\}[\s\S]*?quizLabel="入試演習"/)
  const unitPage = read('src/screens/MathExamUnit.jsx')
  assert.match(unitPage, /navigate\('mathExamSolve', \{ unitId: unit\.id, \.\.\.extra, returnTo \}\)/)
  const solve = read('src/screens/MathExamSolve.jsx')
  assert.match(solve, /data-math-exam-result/)
  assert.match(solve, /navigate\('mathIntro', \{ unitId: item\.id \}\)/)
})

test('入試演習の記録は、端末保存・進捗コード・クラウド・記録のリセットに乗り、全教材の一覧・学習の記録にも出る', () => {
  assert.ok(PERSISTED_PROGRESS_FIELDS.includes('mathExamLog'))
  assert.ok(PROGRESS_RESET_GROUPS.find((group) => group.id === 'results').fields.includes('mathExamLog'))
  const store = read('src/store/useStore.js')
  assert.match(store, /mathExamLog: normalizeMathExamLog\(payload\.mathExamLog\)/)
  assert.match(store, /state\.mathExamLog = normalizeMathExamLog\(state\.mathExamLog\)/)
  assert.match(read('src/lib/cloudSync.js'), /mathExamLog: normalizeMathExamLog\(data\.mathExamLog \?\? current\.mathExamLog\)/)
  assert.match(read('src/lib/progressCode.js'), /'mathStoryLog',\n\s*'mathExamLog',\n\s*'contentQuizResults',/)
  // 全教材の一覧・学習の記録：20番目の教材「数学の入試演習」。
  const content = LEARNING_CONTENTS.find((item) => item.id === 'math-exam')
  assert.ok(content)
  assert.equal(content.items.length, MATH_EXAM_PROBLEMS.length)
  assert.equal(content.quizDomain, MATH_EXAM_QUIZ_DOMAIN)
  const [first, second] = MATH_EXAM_PROBLEMS
  const state = {
    mathExamLog: appendMathExamLog(appendMathExamLog({}, first.id, { result: 'solved', seconds: 60, day: 20000 }), second.id, { result: 'hinted', seconds: 60, day: 20000 }),
    contentQuizResults: recordContentQuizResult(recordContentQuizResult({}, { domain: MATH_EXAM_QUIZ_DOMAIN, itemId: first.id, correct: 1, total: 1 }), { domain: MATH_EXAM_QUIZ_DOMAIN, itemId: second.id, correct: 0, total: 1 }),
  }
  const row = buildLearningContentProgress(state).find((item) => item.id === 'math-exam')
  assert.equal(row.progress.learning.learned, 1)
  assert.equal(row.progress.learning.reviewing, 1)
  assert.equal(row.progress.quiz.correct, 1)
  assert.equal(row.progress.quiz.incorrect, 1)
  assert.deepEqual(LEARNING_CONTENT_CATALOG_ACTIONS['math-exam'], { selection: 'many', verb: '解く' })
  const launch = learningContentCatalogLaunch(content, [{ id: first.id }, { id: second.id }])
  assert.equal(launch.screen, 'mathExamSolve')
  assert.deepEqual(launch.params.ids, [first.id, second.id])
  assert.equal(launch.params.returnTo.screen, 'myLearning')
})
