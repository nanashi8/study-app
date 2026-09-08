// 語順組み立て型英作文の純粋な組み立て・集計ロジック。
// UI とテストが同じ規則を使い、保存される英文と画面表示のずれを防ぐ。

const cleanSpace = (text) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([“‘(])\s+/g, '$1')
    .replace(/\s+([”’)])/g, '$1')
    .trim()

// 語順問題では句読点を直前の単語に付けたまま1枚のカードとして扱う。
// たとえば "Sunday," や "friends." が別カードにならないため、
// スマートフォンでも「単語を並べる」操作に集中できる。
export function writingWordTokens(text = '') {
  const trimmed = text.trim()
  if (!trimmed) return []
  return trimmed.split(/\s+/).map((word, originalIndex) => ({
    id: `word-${originalIndex}`,
    word,
    originalIndex,
  }))
}

const seedToNumber = (seed) => {
  let value = 2166136261
  for (const character of String(seed)) {
    value ^= character.charCodeAt(0)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

export function shuffledWritingTokens(text = '', seed = text) {
  const tokens = writingWordTokens(text)
  let state = seedToNumber(seed)

  for (let index = tokens.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[tokens[index], tokens[swapIndex]] = [tokens[swapIndex], tokens[index]]
  }

  // 乱数の結果が偶然正解順になっても、問題を開いた時点で答えが
  // 完成している状態にはしない。
  if (
    tokens.length > 1 &&
    tokens.every((token, index) => token.originalIndex === index)
  ) {
    ;[tokens[0], tokens[1]] = [tokens[1], tokens[0]]
  }

  return tokens
}

export function buildWritingTokenText(tokens = []) {
  return cleanSpace(tokens.map((token) => token.word).join(' '))
}

// 置いた瞬間に、そのカードが正しい位置かを返す。
// ID ではなく表示語を比べることで、"I ... I ..." のような重複語は
// どちらの同語カードを選んでも正しく判定できる。
export function writingTokenPositionResults(tokens = [], targetText = '') {
  const target = writingWordTokens(targetText)
  return tokens.map(
    (token, index) => Boolean(token) && token.word === target[index]?.word,
  )
}

// ヒントで見せる形。頭文字と記号だけを残し、あとの文字は伏せる。
// 次の1語をそのまま出すとカードを写すだけで一文が終わってしまうため、
// 思い出す手掛かりの分だけを渡す。
export function maskWritingHintWord(word = '') {
  let firstLetterShown = false
  return [...String(word)]
    .map((character) => {
      if (!/[A-Za-z]/.test(character)) return character
      if (firstLetterShown) return '_'
      firstLetterShown = true
      return character
    })
    .join('')
}

export function writingHintLetterCount(word = '') {
  return (String(word).match(/[A-Za-z]/g) ?? []).length
}

// ガイド練習で次に直す／置く1語を返す。途中に誤りがあれば最初の
// 誤位置を優先し、そこまで正しければ未配置の次位置を案内する。
// word は自分から開いたときだけ見せる控えの答えで、ふだん画面に出すのは
// masked（頭文字と文字数）だけにする。
export function writingNextTokenGuide(tokens = [], targetText = '') {
  const target = writingWordTokens(targetText)
  const positionResults = writingTokenPositionResults(tokens, targetText)
  const incorrectIndex = positionResults.findIndex((correct) => !correct)
  const index = incorrectIndex >= 0 ? incorrectIndex : tokens.length
  const expected = target[index]

  if (!expected) return null
  return {
    index,
    position: index + 1,
    word: expected.word,
    masked: maskWritingHintWord(expected.word),
    letters: writingHintLetterCount(expected.word),
    correction: incorrectIndex >= 0,
  }
}

export function isWritingTokenOrderCorrect(tokens = [], targetText = '') {
  const target = writingWordTokens(targetText)
  return (
    tokens.length === target.length &&
    writingTokenPositionResults(tokens, targetText).every(Boolean)
  )
}

export function choiceForStep(step, choiceId) {
  return step?.options?.find((option) => option.id === choiceId)
}

export function resolveWritingTrail(exercise, trail = []) {
  if (!exercise) return []
  return trail
    .map((entry, index) => {
      const step = exercise.steps[index]
      const option = choiceForStep(step, entry?.choiceId)
      return step && option ? { step, option } : null
    })
    .filter(Boolean)
}

export function buildWritingText(exercise, trail = [], previewChoice = null) {
  const parts = resolveWritingTrail(exercise, trail).map(({ option }) => option.text)
  if (previewChoice?.text) parts.push(previewChoice.text)
  return cleanSpace(parts.join(' '))
}

export function writingWordCount(text = '') {
  return (
    text.match(/[A-Za-z]+(?:[’'][A-Za-z]+)*(?:-[A-Za-z]+)*/g)?.length ?? 0
  )
}

export function selectedWritingWordIds(exercise, trail = []) {
  return [
    ...new Set(
      resolveWritingTrail(exercise, trail).flatMap(({ option }) => option.wordIds ?? []),
    ),
  ]
}

export function selectedWritingGrammarIds(exercise, trail = []) {
  return [
    ...new Set(
      resolveWritingTrail(exercise, trail)
        .map(({ option }) => option.grammarId)
        .filter(Boolean),
    ),
  ]
}

export function recommendedWritingTrail(exercise) {
  if (!exercise) return []
  return exercise.steps.map((step) => ({
    stepId: step.id,
    choiceId:
      step.options.find((option) => option.recommended)?.id ?? step.options[0]?.id,
  }))
}

export function writingCompletion(exercise, trail = []) {
  const resolved = resolveWritingTrail(exercise, trail)
  const text = buildWritingText(exercise, trail)
  return {
    complete: Boolean(exercise) && resolved.length === exercise.steps.length,
    completedSteps: resolved.length,
    totalSteps: exercise?.steps?.length ?? 0,
    text,
    wordCount: writingWordCount(text),
    grammarIds: selectedWritingGrammarIds(exercise, trail),
    wordIds: selectedWritingWordIds(exercise, trail),
    checks: (exercise?.rubric ?? []).map((label, index) => ({
      label,
      met: resolved.length >= Math.ceil(((index + 1) / exercise.rubric.length) * exercise.steps.length),
    })),
  }
}

// ── 入試型英作文（級別・文法別）の採点 ──────────────────────────────
// 自分で書いた英文は、大文字小文字・句読点・短縮形の違いで
// バツにしない。同じ意味に読める形はそろえてから比べる。
const WRITING_CONTRACTIONS = new Map([
  ["i'm", 'i am'],
  ["you're", 'you are'],
  ["we're", 'we are'],
  ["they're", 'they are'],
  ["isn't", 'is not'],
  ["aren't", 'are not'],
  ["wasn't", 'was not'],
  ["weren't", 'were not'],
  ["don't", 'do not'],
  ["doesn't", 'does not'],
  ["didn't", 'did not'],
  ["can't", 'cannot'],
  ["won't", 'will not'],
  ["wouldn't", 'would not'],
  ["shouldn't", 'should not'],
  ["couldn't", 'could not'],
  ["mustn't", 'must not'],
  ["needn't", 'need not'],
  ["haven't", 'have not'],
  ["hasn't", 'has not'],
  ["hadn't", 'had not'],
  ["i've", 'i have'],
  ["you've", 'you have'],
  ["we've", 'we have'],
  ["they've", 'they have'],
  ["i'll", 'i will'],
  ["you'll", 'you will'],
  ["he'll", 'he will'],
  ["she'll", 'she will'],
  ["it'll", 'it will'],
  ["we'll", 'we will'],
  ["they'll", 'they will'],
  ["let's", 'let us'],
])

export function normalizeWritingSentence(text = '') {
  const plain = String(text)
    .replace(/[\u2018\u2019\u02bc\u0060\u00b4]/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9'\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!plain) return ''
  return plain
    .split(' ')
    .flatMap((word) => {
      const core = word.replace(/^'+|'+$/g, '')
      if (!core) return []
      const expanded = WRITING_CONTRACTIONS.get(core)
      return expanded ? expanded.split(' ') : [core]
    })
    .join(' ')
    .replace(/\bcan not\b/g, 'cannot')
}

// 書いた英文と模範解答の語を突き合わせ、足りない語と余分な語を返す。
// 答え合わせのあとにだけ使い、書いている途中には見せない。
const tokenDifference = (expected, typed) => {
  const remaining = [...typed]
  const missing = []
  for (const word of expected) {
    const index = remaining.indexOf(word)
    if (index >= 0) remaining.splice(index, 1)
    else missing.push(word)
  }
  return { missing, extra: remaining }
}

export function writingSentenceReview(input = '', question = {}) {
  const answers = [question.answer, ...(question.alt ?? [])].filter(Boolean)
  const typed = normalizeWritingSentence(input)
  const fallback = answers[0] ?? ''

  if (!typed) {
    return { answered: false, correct: false, best: fallback, missing: [], extra: [] }
  }
  const matched = answers.find(
    (answer) => normalizeWritingSentence(answer) === typed,
  )
  if (matched) {
    return { answered: true, correct: true, best: matched, missing: [], extra: [] }
  }

  let best = fallback
  let bestDifference = { missing: [], extra: [] }
  let fewest = Infinity
  for (const answer of answers) {
    const difference = tokenDifference(
      normalizeWritingSentence(answer).split(' ').filter(Boolean),
      typed.split(' ').filter(Boolean),
    )
    const gap = difference.missing.length + difference.extra.length
    if (gap < fewest) {
      fewest = gap
      best = answer
      bestDifference = difference
    }
  }
  return { answered: true, correct: false, best, ...bestDifference }
}

// 一文まるごとの伏せ字ヒント。語数と頭文字だけを渡し、
// 英文そのものは見せない。
export function maskWritingSentence(text = '') {
  return writingWordTokens(text)
    .map((token) => maskWritingHintWord(token.word))
    .join(' ')
}
