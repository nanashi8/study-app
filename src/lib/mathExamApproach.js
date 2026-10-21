// 数学の入試演習を、手で計算せずに解く。解き方の方針（どこから手をつけるか・何を使うか・式の立て方・
// 条件の置き方・どの解を選ぶか）を3択の段で1段ずつ選ぶ。計算の結果は求めないし、見せない。
// 段ごとのヒントは2つ。押したときだけ1つずつ開き、どちらも答えの選択肢や計算の結果は書かない。
//   考え方 … なぜそうする必要があるのか（何に注目し、どんな理由でその手を選ぶのか）
//   手がかり … それでも分からないときの、実際に解くときの方法（APPROACH_WAYS）。その問題に即した図のかき方・表の最初の数行・書き出しの始めなど
// 答え合わせのあとは、段の順に「決めたこと（正解）となぜ（理由）」を並べた解き方の流れを読む。
//
// 教材（src/data/math-exam-approach/*.js）の形：
//   { [problemId]: [[問い, 考え方, [方法, 手がかりの文, 手がかりの式?], [正解, 理由], [誤り, その方針だとどうなるか], [誤り, …]], …] }
// 教材は正解を先頭に書く。画面の並びは approachOrder（問題と段で決まり、いつ解いても同じ並び）。
import { attemptResult } from './mathExam.js'

// 手がかりの方法。実際の問題で、分からないときに手を動かす方法。
export const APPROACH_WAYS = Object.freeze([
  '図にする',
  '表にする',
  '書き出す',
  '小さい数で試す',
  '言いかえる',
  '逆から考える',
  '特別な場合を考える',
  'まとめて見る',
])
const WAY_SET = new Set(APPROACH_WAYS)

/** 教材の1問分を、画面で使う形 [{ q, hint, tryHint: { way, text, math }, options, notes }]（options[0] が正解）にする。 */
export function normalizeApproach(rows) {
  if (!Array.isArray(rows)) return []
  return rows.map(([q, hint, [way, text, math] = [], ...choices]) => ({
    q,
    hint,
    tryHint: { way, text, math: math ?? null },
    options: choices.map(([option]) => option),
    notes: choices.map(([, note]) => note),
  }))
}

function hashSeed(value) {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** 段の選択肢を画面に出す並び（教材の番号の並び）。問題と段だけで決まる。 */
export function approachOrder(problemId, stepIndex, count) {
  let seed = hashSeed(`${problemId}:${stepIndex}`) || 1
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

/** 段ごとに選んだ番号の並び（picks[段] = [選んだ順の教材の番号]）から、終えた段の数。正解を選んだ段までを終えたとみる。 */
export function approachStepsDone(steps, picks = {}) {
  let done = 0
  for (let index = 0; index < steps.length; index += 1) {
    if (!(picks[index] ?? []).includes(0)) break
    done += 1
  }
  return done
}

/** どの段でも、はじめに正解を選んだか。 */
export const approachFirstTryCorrect = (steps, picks = {}) => (
  steps.length > 0 && steps.every((_, index) => (picks[index] ?? [])[0] === 0)
)

/** 1回の結果。全段をはじめの選択で正解し、ヒントを開かなければ自力で正解。 */
export function approachResult(steps, picks = {}, { hintsUsed = 0, unknown = false } = {}) {
  return attemptResult({ correct: approachFirstTryCorrect(steps, picks), hintsUsed, unknown })
}

// 計算の結果だけの選択肢（例 $-17$、$x=3$、$\dfrac{7}{18}$、80通り）。選ぶのに計算が要るので置かない。
const NUMBER = String.raw`-?(?:\d+(?:\.\d+)?|\\d?frac\{\d+\}\{\d+\}|\\sqrt\{\d+\})(?:\^\{?\\circ\}?)?`
const RESULT_ONLY = new RegExp(String.raw`^\$?(?:[a-zA-Z]\s*=\s*)?${NUMBER}\$?\s*(?:cm|m|g|個|人|本|通り|点|分|回|匹|粒|倍|度)?$`)
export const isResultOnlyOption = (option) => RESULT_ONLY.test(String(option).replace(/\\(?:,|;|quad|\s)/g, '').trim())

/** 1問分の教材の形の誤り（テストと監査で使う）。 */
export function approachIssues(rows) {
  const issues = []
  const steps = normalizeApproach(rows)
  if (steps.length < 2) issues.push('段が2つ未満')
  steps.forEach((step, index) => {
    const at = `段${index + 1}`
    if (typeof step.q !== 'string' || !step.q.trim()) issues.push(`${at}: 問いがない`)
    // 「正」「負」のような短い選択肢は、ヒントの文の中に言葉として出てもよい（6字以上の選択肢だけを見る）。
    if (typeof step.hint !== 'string' || !step.hint.trim()) issues.push(`${at}: ヒントがない`)
    else if (step.options[0]?.length >= 6 && step.hint.includes(step.options[0])) issues.push(`${at}: ヒントに正解の選択肢がそのまま入っている`)
    if (!WAY_SET.has(step.tryHint.way)) issues.push(`${at}: 手がかりの方法「${step.tryHint.way}」が決まった名前でない`)
    if (typeof step.tryHint.text !== 'string' || !step.tryHint.text.trim()) issues.push(`${at}: 手がかりの文がない`)
    else if (step.options[0]?.length >= 6 && step.tryHint.text.includes(step.options[0])) issues.push(`${at}: 手がかりに正解の選択肢がそのまま入っている`)
    if (step.options.length !== 3) issues.push(`${at}: 選択肢が3つでない`)
    if (new Set(step.options).size !== step.options.length) issues.push(`${at}: 同じ選択肢がある`)
    step.options.forEach((option, optionIndex) => {
      if (typeof option !== 'string' || !option.trim()) issues.push(`${at}: 選択肢${optionIndex + 1}がない`)
      else if (isResultOnlyOption(option)) issues.push(`${at}: 選択肢${optionIndex + 1}が計算の結果だけ（${option}）`)
      const note = step.notes[optionIndex]
      if (typeof note !== 'string' || !note.trim()) issues.push(`${at}: 選択肢${optionIndex + 1}の説明がない`)
    })
  })
  return issues
}
