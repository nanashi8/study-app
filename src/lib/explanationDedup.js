const normalizeExplanationText = (value) =>
  String(value ?? '').replace(/\s+/g, ' ').trim()

const explanationBigrams = (value) => {
  const normalized = normalizeExplanationText(value)
    .replace(/[\s、。・「」（）()／→：:=A-Za-z0-9＋+\-]/g, '')
  return new Set(Array.from(
    { length: Math.max(0, normalized.length - 1) },
    (_, index) => normalized.slice(index, index + 2),
  ))
}

export function explanationOverlapRatio(left, right) {
  const a = explanationBigrams(left)
  const b = explanationBigrams(right)
  const shared = [...a].filter((value) => b.has(value)).length
  return shared / Math.max(1, Math.min(a.size, b.size))
}

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

function readingProcessExplanation(block) {
  const lead = block.kind === 'core'
    ? 'まず文の中心を前からつかみます。'
    : '前の内容へ意味を足します。'
  const roles = block.phrasePairs
    .flatMap((pair) => pair.roleParts.map((part) => part.role))
  const route = roles.length
    ? `下線の下の${roles.join('→')}を、この順にたどります。`
    : ''
  const tip = explanationOverlapRatio(block.translationTip, block.note) < 0.5
    ? block.translationTip
    : ''
  return [lead, route, tip].filter(Boolean).join(' ')
}

export function readingBlockExplanationTexts(analysis, phraseTexts = null) {
  const shownPhraseTexts = phraseTexts ?? readingPhraseExplanationTexts(analysis)
  return dedupeExplanationTexts(
    (analysis?.blocks ?? []).flatMap((block) => [
      readingProcessExplanation(block),
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
