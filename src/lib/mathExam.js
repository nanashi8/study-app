// 数学の入試演習：解答欄の式・答え合わせ・結果の分け方・時間。
//
// 解答欄は、KaTeX の式の中に [ア] のように片仮名1字をかっこで囲んで書く（共通テストの解答欄と同じ呼び方）。
// 欄1つに整数を1つ入れる（数字キーでタップして入れる）。選択式の欄は problem.choices[欄] に選択肢を持ち、
// 選んだ番号（0から）を入れる。正解は problem.boxes[欄]（整数。選択式は番号）。
//
//   problem = {
//     id, unit, level: 'basic' | 'standard', pattern, minutes,
//     text, math?, figure?,
//     parts: [{ q?, answer }],          // answer は解答欄の並んだ式。小問が2つ以上なら (1)(2)… と番号を付けて出す
//     boxes: { ア: 3, イ: -2, … },
//     choices?: { ウ: { options: [...], notes: [...] } },
//     hints: [...], solution: [{ text, math? }], point, pitfall,
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

export const isChoiceBox = (problem, label) => Boolean(problem?.choices?.[label])

// 選択肢の番号の表し方（共通テストと同じ ⓪①②…）。
const CHOICE_MARKS = '⓪①②③④⑤⑥⑦⑧⑨'
export const choiceMark = (index) => CHOICE_MARKS[index] ?? String(index)

/** 数字キーで入れた文字列を、比べられる整数の文字列にそろえる（'-0' → '0'、先頭の 0 を落とす）。入っていなければ ''。 */
export function normalizeEntry(value) {
  const text = String(value ?? '').trim()
  if (!/^-?\d+$/.test(text)) return ''
  const number = Number.parseInt(text, 10)
  return Object.is(number, -0) ? '0' : String(number)
}

/** 数字キーを1つ押したあとの欄の文字列。key は '0'〜'9'・'minus'（符号を入れかえる）・'back'（1字消す）。 */
export function pressAnswerKey(current = '', key) {
  const text = String(current ?? '')
  const negative = text.startsWith('-')
  const digits = negative ? text.slice(1) : text
  if (key === 'minus') return negative ? digits : `-${digits}`
  if (key === 'back') {
    if (digits.length) return `${negative ? '-' : ''}${digits.slice(0, -1)}`
    return ''
  }
  if (!/^\d$/.test(key)) return text
  if (digits.length >= 5) return text
  const nextDigits = digits === '0' ? key : `${digits}${key}`
  return `${negative ? '-' : ''}${nextDigits}`
}

/** 欄ごとの正誤と、全部正しいか・全部入っているか。 */
export function checkProblemAnswers(problem, entries = {}) {
  const labels = problemBoxes(problem)
  const perBox = {}
  let filled = true
  for (const label of labels) {
    const entry = entries[label]
    if (isChoiceBox(problem, label)) {
      if (!Number.isInteger(entry)) filled = false
      perBox[label] = entry === problem.boxes[label]
    } else {
      const normalized = normalizeEntry(entry)
      if (!normalized) filled = false
      perBox[label] = normalized !== '' && normalized === String(problem.boxes[label])
    }
  }
  return {
    perBox,
    filled,
    correct: labels.length > 0 && labels.every((label) => perBox[label]),
  }
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

/** かかった時間を目安と比べる。目安の半分以内なら「速い」、目安以内なら「目安どおり」、それより長ければ「目安より長い」。 */
export function timeVerdict(seconds, minutes) {
  const limit = Math.max(1, Number(minutes) || 1) * 60
  const used = Math.max(0, Number(seconds) || 0)
  if (used <= limit / 2) return 'fast'
  if (used <= limit) return 'ok'
  return 'slow'
}

export const TIME_VERDICTS = Object.freeze({
  fast: Object.freeze({ label: '目安の半分以内', color: '#047857' }),
  ok: Object.freeze({ label: '目安の時間内', color: '#0369a1' }),
  slow: Object.freeze({ label: '目安より長い', color: '#b45309' }),
})

// 解答欄を KaTeX の式にする。
//   values : 入れた値（欄 → 文字列、選択式は番号）
//   active : いま入れている欄（枠を太くする）
//   perBox : 答え合わせのあとの正誤（欄 → true/false）。あれば色を付ける
//   reveal : 正解の値を入れて見せる（答え合わせのあと・「わからない」のあと）
const BOX_COLORS = Object.freeze({
  empty: ['#7c3aed', '#f5f3ff'],
  active: ['#4c1d95', '#ede9fe'],
  filled: ['#6d28d9', '#ffffff'],
  correct: ['#047857', '#ecfdf5'],
  wrong: ['#be123c', '#fff1f2'],
})

const boxTex = (content, [border, background]) => `\\fcolorbox{${border}}{${background}}{${content}}`

export function renderAnswerTex(problem, tex, { values = {}, active = null, perBox = null, reveal = false } = {}) {
  return String(tex ?? '').replace(BOX_PATTERN, (whole, label) => {
    if (!BOX_LABEL_SET.has(label)) return whole
    const choice = isChoiceBox(problem, label)
    const shownValue = reveal ? problem.boxes[label] : values[label]
    const has = choice ? Number.isInteger(shownValue) : normalizeEntry(shownValue) !== ''
    // 選択式の欄は、数式の中では選んだ番号をふつうの数字で出す（丸数字は数式の字体にないため、選択肢の一覧で出す）。
    const content = has
      ? (choice ? `\\,${shownValue}\\,` : `\\,${normalizeEntry(shownValue)}\\,`)
      : `\\text{${label}}`
    if (perBox) return boxTex(content, perBox[label] || reveal ? BOX_COLORS.correct : BOX_COLORS.wrong)
    if (label === active) return boxTex(content, BOX_COLORS.active)
    return boxTex(content, has ? BOX_COLORS.filled : BOX_COLORS.empty)
  })
}

/** 答え合わせのあとの正しい答えの式（欄に正解を入れた形、枠なし）。 */
export function answerTexWithValues(problem, tex) {
  return String(tex ?? '').replace(BOX_PATTERN, (whole, label) => {
    if (!BOX_LABEL_SET.has(label)) return whole
    const value = problem.boxes[label]
    return String(value)
  })
}
