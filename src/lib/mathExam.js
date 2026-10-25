// 数学の入試演習：問題の形・結果の分け方・時間の表し方。
//
// 学習者は手で計算せず、計算の経過を1行ずつ穴埋めして解く（lib/mathWork.js）。
// 問題は、求めるものを解答欄の式（[ア] のように片仮名1字をかっこで囲む。共通テストの解答欄と同じ呼び方）と
// 正解 boxes で持つ。画面には出さないが、tests/math-exam-verify/ が問題文の条件から正解を計算し直して、
// 問題そのものが正しいこと（経過が行き着く答えがあること）を確かめる。選択式の欄は problem.choices[欄] に選択肢を持つ。
//
//   problem = {
//     id, unit, level: 'basic' | 'standard', pattern,
//     text, math?, figure?,
//     parts: [{ q?, answer }],          // answer は解答欄の並んだ式
//     boxes: { ア: 3, イ: -2, … },
//     choices?: { ウ: { options: [...], notes: [...] } },
//     solution: [{ text, math? }], point, pitfall,
//   }

// 問題ごとのテスト結果（contentQuizResults）の教材ID。
export const MATH_EXAM_QUIZ_DOMAIN = 'math-exam'

export const BOX_LABELS = Object.freeze([...'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ'])
const BOX_LABEL_SET = new Set(BOX_LABELS)
const BOX_PATTERN = /\[([゠-ヿ])\]/g

/** 式の中の解答欄を、出てくる順に返す（同じ欄は1回だけ）。 */
export function templateBoxes(tex = '') {
  const labels = []
  for (const match of String(tex).matchAll(BOX_PATTERN)) {
    if (BOX_LABEL_SET.has(match[1]) && !labels.includes(match[1])) labels.push(match[1])
  }
  return labels
}

/** 問題のすべての解答欄（小問の順）。 */
export function problemBoxes(problem) {
  return (problem?.parts ?? []).flatMap((part) => templateBoxes(part.answer))
}

// 演習1回の結果。自力で正解のときだけ「正解」として記録し、ほかは解き直しに回す。
export const MATH_EXAM_RESULTS = Object.freeze({
  solved: Object.freeze({ label: '自力で正解', short: '正解', color: '#047857' }),
  hinted: Object.freeze({ label: 'ヒントで正解', short: 'ヒントで正解', color: '#b45309' }),
  wrong: Object.freeze({ label: '不正解', short: '不正解', color: '#be123c' }),
  unknown: Object.freeze({ label: 'わからない', short: 'わからない', color: '#5f5b78' }),
})
export const MATH_EXAM_RESULT_IDS = Object.freeze(Object.keys(MATH_EXAM_RESULTS))

/** 答え合わせ（または「わからない」）から、1回の結果を決める。 */
export function attemptResult({ correct = false, hintsUsed = 0, unknown = false } = {}) {
  if (unknown) return 'unknown'
  if (!correct) return 'wrong'
  return hintsUsed > 0 ? 'hinted' : 'solved'
}

/** 秒を「3:05」の形にする。 */
export function formatSeconds(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds) || 0))
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
