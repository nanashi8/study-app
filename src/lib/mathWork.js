// 数学の誘導問題と入試演習を、計算の経過の穴埋めで解く。手で計算はしない。
// 経過を1行ずつ書き、前の行から1つの操作（移項・符号を変える・九九や1〜2けたの足し引き・約分など、暗算でできること）で
// 次の行になるようにする。空所は、その操作で変わる所だけ。空所はタイル（正解とありがちな誤り）をタップして入れる。
// 行ごとの考え方（なぜその操作をするのか）は、はじめは閉じていて、ヒントボタンを押したときだけ開く。
//
// 教材（src/data/math-guided-work/*.js・src/data/math-exam-work/*.js）の形：
//   { [problemId]: [行, …] }
//   行 = '式'                                                … はじめから見えている行（問題の式・図から読む式など）。空所なし
//      | [考え方, '式（□ が空所）', [[正解, 説明], …], [[誤り, 説明], …], { unordered }?]
//        正解は □ の順。誤りのタイルは2枚以上で、どの計算・どんな勘ちがいでその値になるかを書く。
//        unordered … 空所どうしを入れかえてもよい（因数の順など）
import { attemptResult } from './mathExam.js'

export const WORK_BLANK = '□'
// 教材では空所を □ か KaTeX の \square で書ける。画面と検査では □ にそろえる。
const blankMarks = (tex) => (typeof tex === 'string' ? tex.replace(/\\square(?![a-zA-Z])/g, WORK_BLANK) : tex)

/** 教材の1問分を、画面で使う形 [{ given, tex, why?, blanks, tiles: [{ label, note, blank }], unordered }] にする。 */
export function normalizeWork(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map((row) => {
    if (typeof row === 'string') return { given: true, tex: blankMarks(row), why: null, blanks: [], tiles: [], unordered: false }
    const [why, rawTex, rights = [], wrongs = [], options = {}] = row
    const tex = blankMarks(rawTex)
    const blanks = rights.map(([label]) => label)
    const tiles = [
      ...rights.map(([label, note], blank) => ({ label, note, blank })),
      ...wrongs.map(([label, note]) => ({ label, note, blank: null })),
    ]
    return { given: false, tex, why, blanks, tiles, unordered: Boolean(options.unordered) }
  })
}

/** 空所のある行の番号。 */
export const fillLineIndexes = (lines) => lines.flatMap((line, index) => (line.given ? [] : [index]))

function hashSeed(value) {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** タイルを画面に出す並び（教材の番号の並び）。問題と行だけで決まる。 */
export function tileOrder(problemId, lineIndex, count) {
  let seed = hashSeed(`${problemId}:work:${lineIndex}`) || 1
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const order = Array.from({ length: count }, (_, index) => index)
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[order[index], order[swap]] = [order[swap], order[index]]
  }
  return order
}

/** 空所に入れたタイル（教材の番号の並び）の○×。unordered の行は、入れかえた正解も○。 */
export function judgeLine(line, placed = []) {
  const values = placed.map((tileIndex) => line.tiles[tileIndex]?.label)
  if (line.unordered) {
    const pool = [...line.blanks]
    return values.map((value) => {
      const at = pool.indexOf(value)
      if (at < 0) return false
      pool.splice(at, 1)
      return true
    })
  }
  return values.map((value, index) => value === line.blanks[index])
}

/** 式の □ を、値（なければ空の枠に空所の番号 1, 2, …）で置きかえた KaTeX。marks[k] が true/false なら○×の色をつける。 */
export function fillTex(tex, values = [], marks = []) {
  let at = -1
  return String(tex).replace(/□/g, () => {
    at += 1
    const value = values[at]
    if (value === undefined || value === null) return `\\boxed{\\,\\textcolor{#8b5cf6}{\\footnotesize ${at + 1}}\\,}`
    const mark = marks[at]
    if (mark === true) return `\\textcolor{#047857}{\\boxed{${value}}}`
    if (mark === false) return `\\textcolor{#be123c}{\\boxed{${value}}}`
    return `\\boxed{${value}}`
  })
}

/** 正解で埋めた行の KaTeX（解いた行・答え合わせのあと）。 */
export const solvedTex = (line) => (line.given ? line.tex : String(line.tex).replace(/□/g, (() => {
  let at = -1
  return () => { at += 1; return `{${line.blanks[at]}}` }
})()))

/**
 * 行ごとの記録 state[行] = { tries: [[○×…], …], solved, hint } から、終えた空所つきの行の数。
 * 正しく埋めた行までを終えたとみる。
 */
export function workLinesDone(lines, state = {}) {
  let done = 0
  for (const index of fillLineIndexes(lines)) {
    if (!state[index]?.solved) break
    done += 1
  }
  return done
}

/** 1回の結果。どの行もはじめの答え合わせで正解し、ヒントを開かなければ自力で正解。 */
export function workResult(lines, state = {}, { unknown = false } = {}) {
  const indexes = fillLineIndexes(lines)
  const firstTry = indexes.length > 0 && indexes.every((index) => {
    const first = state[index]?.tries?.[0]
    return state[index]?.solved && first && first.every(Boolean)
  })
  const hintsUsed = indexes.filter((index) => state[index]?.hint).length
  return attemptResult({ correct: firstTry, hintsUsed, unknown })
}

/** はじめの答え合わせで正しく埋め、ヒントを開かなかった行の数（誘導問題の正答率）。 */
export function workLineScore(lines, state = {}) {
  const indexes = fillLineIndexes(lines)
  const correct = indexes.filter((index) => {
    const first = state[index]?.tries?.[0]
    return state[index]?.solved && first?.every(Boolean) && !state[index]?.hint
  }).length
  return { correct, total: indexes.length }
}

const blankCount = (tex) => (String(tex).match(/□/g) ?? []).length
// 考え方に空所の答えをそのまま書いていないか。短い値（1けたの数・1文字）は文の中に別の意味で出てよいので、2字以上の値だけを見る。
const plain = (value) => String(value).replace(/\\(?:,|;|quad|\s)|\s|\$/g, '')
const DASH = /[−–]/g
const quietTex = (value) => plain(value).replace(DASH, '-')
// 2つにひとつを選ぶ空所（符号・不等号・真偽）。
const SIGN_ONLY = new Set(['+', '-', '<', '>', '=', '\\le', '\\ge', '\\times', '\\div', '\\text{真}', '\\text{偽}'])

/** 1問分の教材の形の誤り（テストと監査で使う）。 */
export function workIssues(rows) {
  const issues = []
  if (!Array.isArray(rows) || !rows.length) return ['行がない']
  const lines = normalizeWork(rows)
  const fills = fillLineIndexes(lines)
  if (!fills.length) issues.push('空所のある行がない')
  lines.forEach((line, index) => {
    const at = `行${index + 1}`
    if (typeof line.tex !== 'string' || !line.tex.trim()) issues.push(`${at}: 式がない`)
    // 文字列の '\t' '\f' などは TeX の \times \frac がタブ・改ページに化けたもの（\\ の書き忘れ）。
    const texts = [line.tex, line.why, ...line.tiles.flatMap((tile) => [tile.label, tile.note])]
    if (texts.some((text) => typeof text === 'string' && /[\u0000-\u001f]/.test(text))) issues.push(`${at}: 制御文字がある（\\ の書き忘れ）`)
    if (line.given) {
      if (blankCount(line.tex)) issues.push(`${at}: はじめから見える行に空所がある`)
      return
    }
    if (typeof line.why !== 'string' || line.why.trim().length < 10) issues.push(`${at}: 考え方がない（10字以上）`)
    const count = blankCount(line.tex)
    if (!count) issues.push(`${at}: 空所がない`)
    if (count > 3) issues.push(`${at}: 空所が4つ以上（1行は1つの操作に）`)
    if (count !== line.blanks.length) issues.push(`${at}: 空所の数（${count}）と正解の数（${line.blanks.length}）がちがう`)
    const wrongs = line.tiles.filter((tile) => tile.blank === null)
    // 符号（+・−）・不等号・真偽だけを入れる行は、誤りが1枚（反対のもの）でよい。
    const signOnly = line.blanks.every((blank) => SIGN_ONLY.has(quietTex(blank)))
    if (wrongs.length < (signOnly ? 1 : 2)) issues.push(`${at}: 誤りのタイルが${signOnly ? 1 : 2}枚未満`)
    // 同じ値の正解が2つある行（例 □ が2つとも 3）は、同じ正解のタイルが2枚あってよい。誤りどうし・誤りと正解は重ねない。
    const rightLabels = new Set(line.blanks.map(quietTex))
    const wrongLabels = wrongs.map((tile) => quietTex(tile.label))
    wrongs.forEach((tile) => {
      if (rightLabels.has(quietTex(tile.label))) issues.push(`${at}: 誤りのタイル「${tile.label}」が正解と同じ`)
    })
    if (new Set(wrongLabels).size !== wrongLabels.length) issues.push(`${at}: 同じ誤りのタイルがある`)
    line.tiles.forEach((tile, tileIndex) => {
      if (typeof tile.label !== 'string' || !tile.label.trim()) issues.push(`${at}: タイル${tileIndex + 1}がない`)
      if (typeof tile.note !== 'string' || !tile.note.trim()) issues.push(`${at}: タイル「${tile.label}」の説明がない`)
    })
    line.blanks.forEach((blank) => {
      const value = quietTex(blank)
      // 前後が数字・文字につながっていない所に出てくるときだけ（$12\\pi$ の中の $2\\pi$ は答えを書いたことにならない）。
      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      if (value.length >= 2 && new RegExp(`(?<![0-9a-zA-Z.])${escaped}(?![0-9.])`).test(quietTex(line.why ?? ''))) issues.push(`${at}: 考え方に空所の答え「${blank}」が入っている`)
    })
  })
  return issues
}

// 入試演習の経過が解答欄の答えに行き着くか。小問ごとに、解答欄の式へ正解を入れた式が、どれかの行（正解で埋めた形）にそのまま出てくること。
// 選択式の欄（problem.choices）は、正しい選択肢の式がどれかの空所の正解になっていること。
const answerForm = (tex) => String(tex)
  .replace(/\\text\{[^{}]*\}/g, '')
  .replace(/\\(?:left|right)(?![a-zA-Z])/g, '')
  .replace(/\\q?quad(?![a-zA-Z])/g, '|')
  .replace(/\\(?:,|;|:|!)|\\ |~|\s/g, '')
  .replace(/\\frac/g, '\\dfrac')
  .replace(/\\(?:leqq|leq)(?![a-zA-Z])/g, '\\le')
  .replace(/\\(?:geqq|geq)(?![a-zA-Z])/g, '\\ge')
  .replace(/[{}]/g, '')
  .replace(DASH, '-')
// 選択肢の文は \text{…} の中の字もくらべる（単位を落とす answerForm とちがう）。
const choiceForm = (option) => answerForm(String(option).replace(/\$/g, '').replace(/\\text\{([^{}]*)\}/g, '$1'))

export function examAnswerIssues(problem, rows) {
  const lines = normalizeWork(rows)
  // はじめから見える行ではなく、空所のある行（生徒が埋めて行き着く行）に出てくること。
  // 「y=-3×6=-18」のように途中の式をはさんだ行は、はじめの辺と最後の辺を結んだ「y=-18」としても読む。
  // \quad で区切った行（「3-2y=5　y=-1」）は、区切りごとにも読む。
  const solved = lines.filter((line) => !line.given).map((line) => answerForm(solvedTex(line)))
    .flatMap((line) => [line, ...line.split('|')])
    .flatMap((line) => {
      const sides = line.split('=')
      return sides.length > 2 ? [line, `${sides[0]}=${sides.at(-1)}`] : [line]
    })
  const blanks = new Set(lines.flatMap((line) => line.blanks.map(choiceForm)))
  const issues = []
  for (const part of problem.parts ?? []) {
    const choiceBox = (String(part.answer).match(/^\[([゠-ヿ])\]$/) ?? [])[1]
    if (choiceBox && problem.choices?.[choiceBox]) {
      const option = problem.choices[choiceBox].options[problem.boxes[choiceBox]]
      if (!blanks.has(choiceForm(option))) issues.push(`選択式の欄${choiceBox}: 正しい選択肢「${option}」がどの空所の正解にもない`)
      continue
    }
    // 答えが「1年 0.35　2年 0.32」「x=2,\\ 3」のように並んでいるときは、区切りごとに確かめる。
    const filled = String(part.answer).replace(/\[([゠-ヿ])\]/g, (_, label) => String(problem.boxes[label]))
    for (const piece of filled.split(/\\qquad|\\quad|,\\ /).map((text) => answerForm(text).replace(/^[,|(]+|[,|)]+$/g, '')).filter(Boolean)) {
      // 数の途中に出てくるだけ（24π の中の 4π）では行き着いたことにしない。
      const at = new RegExp(`(?<![0-9.])${piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![0-9.])`)
      if (!solved.some((line) => at.test(line))) issues.push(`小問の答え「${piece}」に行き着く行がない`)
    }
  }
  return issues
}

// 行ごとの記録 state を1つ動かす（画面2つで同じ動き）。
export function placeTile(state, line, lineIndex, tileIndex) {
  const lineState = state[lineIndex] ?? {}
  const placed = lineState.placed ?? []
  if (lineState.solved || placed.includes(tileIndex) || placed.length >= line.blanks.length) return state
  return { ...state, [lineIndex]: { ...lineState, placed: [...placed, tileIndex] } }
}
export function removeTile(state, lineIndex, slot) {
  const lineState = state[lineIndex] ?? {}
  if (lineState.solved) return state
  // 外した空所より後ろは詰める（空所は左から順に埋まる）。答え合わせの○×の色は消える。
  return { ...state, [lineIndex]: { ...lineState, placed: (lineState.placed ?? []).filter((_, index) => index !== slot) } }
}
export function clearTiles(state, lineIndex) {
  const lineState = state[lineIndex] ?? {}
  if (lineState.solved) return state
  return { ...state, [lineIndex]: { ...lineState, placed: [] } }
}
export function checkLine(state, line, lineIndex) {
  const lineState = state[lineIndex] ?? {}
  const placed = lineState.placed ?? []
  if (lineState.solved || placed.length !== line.blanks.length) return state
  const marks = judgeLine(line, placed)
  return {
    ...state,
    [lineIndex]: {
      ...lineState,
      tries: [...(lineState.tries ?? []), marks],
      placedHistory: [...(lineState.placedHistory ?? []), placed],
      solved: marks.every(Boolean),
    },
  }
}
export function openWorkHint(state, lineIndex) {
  return { ...state, [lineIndex]: { ...(state[lineIndex] ?? {}), hint: true } }
}
