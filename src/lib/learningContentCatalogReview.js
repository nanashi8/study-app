const REVIEWABLE_CONTENT_CONFIG = Object.freeze({
  vocab: Object.freeze({ action: 'review', skill: 'vocab' }),
  usage: Object.freeze({ action: 'review', skill: 'usage' }),
  etymology: Object.freeze({ action: 'reviewEtymology' }),
  'koten-vocab': Object.freeze({ action: 'reviewKoten' }),
  'koten-grammar': Object.freeze({ action: 'reviewKotenGrammar' }),
  'koten-culture': Object.freeze({ action: 'reviewKotenCulture' }),
  'kanbun-vocab': Object.freeze({ action: 'reviewKanbun', domain: 'vocab' }),
  'kanbun-grammar': Object.freeze({ action: 'reviewKanbun', domain: 'grammar' }),
  'kanbun-culture': Object.freeze({ action: 'reviewKanbun', domain: 'culture' }),
})

const REVIEW_RESULTS = new Set(['remembered', 'forgot', 'correct', 'wrong'])

// 熟語と構文は同じ usage 教材にまとまっているため、画面上の対象は
// 英単語・語源を含む9教材ID、学習者向けの呼び方では英単語＋指定9カテゴリになる。
export const LEARNING_CONTENT_CATALOG_REVIEWABLE_IDS = Object.freeze(
  Object.keys(REVIEWABLE_CONTENT_CONFIG),
)

export function learningContentCatalogSupportsReview(contentId) {
  return Object.hasOwn(REVIEWABLE_CONTENT_CONFIG, contentId)
}

export function learningContentCatalogReviewCommand(contentId, itemId, result) {
  const config = REVIEWABLE_CONTENT_CONFIG[contentId]
  if (!config || typeof itemId !== 'string' || !itemId || !REVIEW_RESULTS.has(result)) {
    return null
  }
  if (config.action === 'review') {
    return { action: config.action, args: [itemId, result, config.skill] }
  }
  if (config.action === 'reviewKanbun') {
    return { action: config.action, args: [config.domain, itemId, result] }
  }
  return { action: config.action, args: [itemId, result] }
}
