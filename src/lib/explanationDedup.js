const normalizeExplanationText = (value) =>
  String(value ?? '').replace(/\s+/g, ' ').trim()

// 同じ画面内で同一の説明を何度も読ませないため、最初の一件だけを残す。
// 戻り値の位置は入力と一致し、重複箇所は空文字になる。
export function dedupeExplanationTexts(values = [], alreadyShown = []) {
  const seen = new Set(
    alreadyShown.map(normalizeExplanationText).filter(Boolean),
  )

  return values.map((value) => {
    const text = String(value ?? '').trim()
    const normalized = normalizeExplanationText(text)
    if (!normalized || seen.has(normalized)) return ''
    seen.add(normalized)
    return text
  })
}

export function readingPhraseExplanationTexts(analysis) {
  return dedupeExplanationTexts(
    (analysis?.meaningPhraseSequence ?? []).map(
      (phrase) => phrase.grammar ?? phrase.explanation,
    ),
  )
}

export function readingBlockExplanationTexts(analysis, phraseTexts = null) {
  const shownPhraseTexts = phraseTexts ?? readingPhraseExplanationTexts(analysis)
  return dedupeExplanationTexts(
    (analysis?.blocks ?? []).flatMap((block) => [
      block.translationGuide,
      block.note,
    ]),
    shownPhraseTexts,
  )
}

export function longSentenceExplanationTexts(steps = []) {
  return dedupeExplanationTexts(
    steps.flatMap((step) => [step.note, step.roleNote]),
  )
}
