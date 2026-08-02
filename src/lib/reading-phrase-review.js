// 互換用のレビュー補助。学習者向けフレーズは意味・発音のまとまりを優先し、
// SVOCMはその内部構造として複数保持できる。

const rolesOf = (phrase) => [...new Set(
  phrase.roles ?? (phrase.role ? [phrase.role] : []),
)]

function reviewCategoryFor(phrase) {
  const roles = rolesOf(phrase)
  if (!roles.length) return 'missing-svocm-annotation'
  if (!`${phrase.en ?? ''}`.trim()) return 'missing-source-english'
  if (!`${phrase.ja ?? ''}`.trim()) return 'missing-adjacent-japanese'
  if (!`${phrase.explanation ?? phrase.grammarNote ?? ''}`.trim()) {
    return 'missing-item-explanation'
  }
  if (phrase.prepositionBinding === null) return 'preposition-binding-review'
  if (phrase.infinitiveBinding?.type === 'context-reviewed') {
    return 'infinitive-function-review'
  }
  if (phrase.ingBinding?.type === 'embedded-gerund-or-participle') {
    return 'ing-function-review'
  }
  if (phrase.coordinationBinding?.type === 'unresolved') {
    return 'coordination-scope-review'
  }
  return 'sentence-specific-review'
}

export function reviewGeneratedReadingPhrases(phrases) {
  return Object.freeze(phrases.map((phrase) => {
    if (['reviewed', 'confirmed'].includes(phrase.status)) return phrase
    return Object.freeze({
      ...phrase,
      status: 'review-needed',
      reviewCategory: phrase.reviewCategory ?? reviewCategoryFor(phrase),
    })
  }))
}

export function readingPhraseMethod(reviewedGuide, phrases) {
  if (reviewedGuide?.status === 'confirmed') return 'regression-example-confirmed'
  if (phrases.length && phrases.every((phrase) => phrase.status === 'confirmed')) {
    return 'corpus-meaning-phrase-confirmed'
  }
  if (phrases.length && phrases.every((phrase) =>
    ['reviewed', 'confirmed'].includes(phrase.status))) {
    return 'corpus-meaning-phrase-reviewed'
  }
  return 'corpus-meaning-phrase-review-needed'
}
