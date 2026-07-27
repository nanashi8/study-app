// 分岐型英作文の純粋な組み立て・集計ロジック。
// UI とテストが同じ規則を使い、保存される英文と画面表示のずれを防ぐ。

const cleanSpace = (text) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/([“‘(])\s+/g, '$1')
    .replace(/\s+([”’)])/g, '$1')
    .trim()

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
