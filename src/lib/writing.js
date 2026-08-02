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

// ガイド練習で次に直す／置く1語を返す。途中に誤りがあれば最初の
// 誤位置を優先し、そこまで正しければ未配置の次位置を案内する。
// 完成英文を一度に見せず、必要な瞬間だけ足場を出すための情報に絞る。
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
