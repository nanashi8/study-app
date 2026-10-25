// 数学の誘導問題と入試演習を、手計算のいらない計算の経過の穴埋めで解く（requests/2026-10-25-math-work-fill.json）。
// 全634問の経過・入試演習の答えへの行き着き・ヒントボタン・画面・読んだ記録を確かめる。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import katex from 'katex'
import { MATH_PROBLEMS, MATH_UNITS } from '../src/data/math.js'
import { MATH_EXAM_PROBLEMS } from '../src/data/math-exam.js'
import { MATH_GUIDED_WORK_ROWS } from '../src/data/math-guided-work.js'
import { MATH_EXAM_WORK_ROWS } from '../src/data/math-exam-work.js'
import {
  checkLine, clearTiles, openWorkHint, placeTile, removeTile,
  examAnswerIssues, fillLineIndexes, fillTex, judgeLine, normalizeWork, solvedTex, workIssues, workLineScore, workResult,
} from '../src/lib/mathWork.js'
import { GUIDED_PROBLEMS, workReviewProblems } from '../scripts/checks/math-work-review.mjs'

const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')
const inlineMath = (text) => [...String(text ?? '').matchAll(/\$([^$]+)\$/g)].map((match) => match[1])
const render = (tex) => katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })

function texFailures(id, rows) {
  const failures = []
  normalizeWork(rows).forEach((line, index) => {
    const at = `${id} 行${index + 1}`
    const texts = [line.why, ...line.tiles.map((tile) => tile.note)].filter(Boolean)
    for (const text of texts) if ((String(text).match(/\$/g) ?? []).length % 2) failures.push(`${at}: $ の数が奇数「${text}」`)
    const formulas = [line.given ? line.tex : fillTex(line.tex), solvedTex(line), ...line.tiles.map((tile) => tile.label), ...texts.flatMap(inlineMath)]
    for (const tex of formulas) {
      try {
        render(tex)
      } catch (error) {
        failures.push(`${at}: ${error.message}`)
      }
    }
  })
  return failures
}

// ── guided-work-all ──
test('誘導問題の全274問に計算の経過があり、どの行にも考え方・空所・正解と誤りのタイルの説明がある', () => {
  assert.equal(GUIDED_PROBLEMS.length, 274)
  assert.equal(Object.keys(MATH_PROBLEMS).length, MATH_UNITS.length)
  const failures = []
  for (const problem of GUIDED_PROBLEMS) {
    const rows = MATH_GUIDED_WORK_ROWS[problem.id]
    if (!rows) {
      failures.push(`${problem.id}: 計算の経過がない`)
      continue
    }
    for (const issue of workIssues(rows)) failures.push(`${problem.id}: ${issue}`)
    failures.push(...texFailures(problem.id, rows))
  }
  const ids = new Set(GUIDED_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(MATH_GUIDED_WORK_ROWS)) if (!ids.has(id)) failures.push(`${id}: 問題がないのに経過がある`)
  assert.deepEqual(failures, [])
  // '\times' と書くと \t がタブに化ける（\\times の書き忘れ）。検査が止めること。
  const broken = ['x=2', ['左辺と右辺を入れかえずに、そのまま計算する。', 'y=□', [['6', '$3\times2$ で6になる。']], [['5', '$3+2$ とたした値。'], ['9', '$3^2$ と2乗した値。']]]]
  assert.ok(workIssues(broken).some((issue) => issue.includes('制御文字')))
})

// ── exam-work-all ──
test('入試演習の全360問に計算の経過があり、空所のある行が解答欄のすべての正解に行き着く', () => {
  assert.equal(MATH_EXAM_PROBLEMS.length, 360)
  const failures = []
  let boxes = 0
  for (const problem of MATH_EXAM_PROBLEMS) {
    const rows = MATH_EXAM_WORK_ROWS[problem.id]
    if (!rows) {
      failures.push(`${problem.id}: 計算の経過がない`)
      continue
    }
    for (const issue of workIssues(rows)) failures.push(`${problem.id}: ${issue}`)
    for (const issue of examAnswerIssues(problem, rows)) failures.push(`${problem.id}: ${issue}`)
    failures.push(...texFailures(problem.id, rows))
    boxes += Object.keys(problem.boxes).length
  }
  const ids = new Set(MATH_EXAM_PROBLEMS.map((problem) => problem.id))
  for (const id of Object.keys(MATH_EXAM_WORK_ROWS)) if (!ids.has(id)) failures.push(`${id}: 問題がないのに経過がある`)
  assert.deepEqual(failures, [])
  assert.equal(boxes, 740)
})

// ── work-read ──
test('全634問の経過を読んだ記録が、今の問題と経過の指紋と一致する', () => {
  assert.deepEqual(workReviewProblems(), [])
})

// ── hint-button ──
test('考え方ははじめは閉じていて、行ごとのヒントボタンで開く。開いた行があると「ヒントで正解」', () => {
  const lines = normalizeWork([
    'x+4=5',
    ['左辺の $+4$ を右辺へ移すと、符号が変わる。', 'x=5□', [['-4', '移項して符号が変わる。']], [['+4', '符号を変えていない。'], ['4', '符号がない。']]],
    ['右辺を計算する。', 'x=□', [['1', '5-4=1']], [['9', '5+4'], ['-1', '4-5']]],
  ])
  const right = (line) => line.tiles.findIndex((tile) => tile.blank === 0)
  let state = {}
  for (const index of fillLineIndexes(lines)) {
    state = placeTile(state, lines[index], index, right(lines[index]))
    state = checkLine(state, lines[index], index)
  }
  assert.equal(workResult(lines, state), 'solved')
  assert.equal(workResult(lines, openWorkHint(state, 1)), 'hinted')
  assert.deepEqual(workLineScore(lines, openWorkHint(state, 1)), { correct: 1, total: 2 })
  // まちがえた行は、入れ直して正しくしても「不正解」。外す・空にするも動く。
  let wrong = placeTile({}, lines[1], 1, 1)
  wrong = checkLine(wrong, lines[1], 1)
  assert.equal(wrong[1].solved, false)
  wrong = removeTile(wrong, 1, 0)
  assert.deepEqual(wrong[1].placed, [])
  wrong = clearTiles(placeTile(wrong, lines[1], 1, 0), 1)
  assert.deepEqual(wrong[1].placed, [])
  wrong = checkLine(placeTile(wrong, lines[1], 1, 0), lines[1], 1)
  wrong = checkLine(placeTile(wrong, lines[2], 2, right(lines[2])), lines[2], 2)
  assert.equal(workResult(lines, wrong), 'wrong')
  assert.equal(workResult(lines, {}, { unknown: true }), 'unknown')
  // 入れかえてよい行（unordered）は、入れかえた正解も○。
  const swap = normalizeWork([['因数の順は問わない。', '(x+□)(x+□)', [['2', 'a'], ['3', 'b']], [['5', 'c'], ['6', 'd']], { unordered: true }]])[0]
  assert.deepEqual(judgeLine(swap, [1, 0]), [true, true])
  assert.deepEqual(judgeLine({ ...swap, unordered: false }, [1, 0]), [false, false])

  const component = read('src/components/MathWork.jsx')
  assert.match(component, /lineState\.hint \? \(/, '考え方はヒントを開いたときだけ出す')
  assert.match(component, /data-math-work-hint-button/)
})

// ── screens-fill-only ──
test('誘導問題と入試演習の画面は穴埋めだけで進み、方針の3択の部品・教材・ゲートは残っていない', () => {
  for (const file of ['src/screens/MathSolve.jsx', 'src/screens/MathExamSolve.jsx']) {
    const source = read(file)
    assert.match(source, /<MathWorkSteps/, `${file}: 穴埋めの部品を使う`)
    assert.doesNotMatch(source, /Approach|approach/, `${file}: 方針の3択が残っている`)
  }
  for (const gone of [
    'src/components/MathExamApproach.jsx',
    'src/lib/mathExamApproach.js',
    'src/data/math-exam-approach.js',
    'src/data/math-guided-approach.js',
    'scripts/checks/math-exam-approach-review.mjs',
    'scripts/checks/math-guided-approach-review.mjs',
    'docs/audits/math-exam-approach-review.json',
    'docs/audits/math-guided-approach-review.json',
    'tests/math-exam-approach.test.mjs',
    'tests/math-guided-approach.test.mjs',
  ]) assert.equal(existsSync(new URL(`../${gone}`, import.meta.url)), false, `${gone} が残っている`)
  // 入口の説明も穴埋めの解き方にそろえる（公開版で方針の3択の頃の説明が残っていた）。
  for (const file of ['src/screens/MathMap.jsx', 'src/screens/MathExam.jsx', 'src/screens/MathExamUnit.jsx', 'src/lib/learningContentCatalog.js']) {
    assert.doesNotMatch(read(file), /どう解くかを選|方針を選|方針の3択/, `${file}: 方針の3択の頃の説明が残っている`)
  }
  assert.match(read('src/screens/MathMap.jsx'), /計算の経過を1行ずつタイルで埋めて解く/)
  // 入試演習の結果は4通り。解き終わり（または「わからない」）で記録する。
  const exam = read('src/screens/MathExamSolve.jsx')
  assert.match(exam, /workResult\(lines, work, \{ unknown \}\)/)
  assert.match(exam, /data-math-exam-unknown/)
})
