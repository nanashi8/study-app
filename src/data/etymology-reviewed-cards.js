import {
  ETYMOLOGY_CARD_REVIEWS,
  ETYMOLOGY_CARD_REVIEW_SCHEMA,
} from './etymology-card-reviews.js'

const LEVEL_RANK = { '5': 0, '4': 1, '3': 2, pre2: 3, '2': 4, pre1: 5, '1': 6 }

const wordSort = (left, right) =>
  (LEVEL_RANK[left.level] ?? 99) - (LEVEL_RANK[right.level] ?? 99) ||
  left.word.localeCompare(right.word, 'en') ||
  left.id.localeCompare(right.id, 'en')

const explicitRootIdsForWord = (word) => new Set([
  ...(word?.etymology?.parts ?? []).map((part) => part.root).filter(Boolean),
  ...(word?.referenceRoots ?? []),
])

const evidenceSources = (sourceHeads) => sourceHeads.flatMap((head) => [
  {
    source: 'Online Etymology Dictionary',
    head,
    url: `https://www.etymonline.com/word/${encodeURIComponent(head)}`,
  },
  {
    source: 'Wiktionary',
    head,
    url: `https://en.wiktionary.org/wiki/${encodeURIComponent(head)}#English`,
  },
])

export function etymologyCardReviewMaterial(card) {
  return JSON.stringify({
    schema: ETYMOLOGY_CARD_REVIEW_SCHEMA,
    root: {
      id: card.rootId,
      form: card.rootForm,
      meaning: card.rootMeaning,
      origin: card.rootOrigin,
    },
    wordIds: [...card.coverageIds].sort(),
    sourceHeads: [...card.evidence.sourceHeads],
  })
}

/**
 * 公開用の語源カードを、手動監査台帳と明示リンクだけから組み立てる。
 *
 * `word.roots` の自動綴り判定、自由記述の由来、学習量だけの8語バッチは使わない。
 * 台帳・語根説明・紐づけ語の一致はNode側の品質GATEでSHA-256照合する。
 */
export function buildReviewedEtymologyCards(words, roots) {
  const rootsById = new Map(roots.map((root) => [root.id, root]))
  const explicitRootsByWord = new Map(
    words.map((word) => [word.id, explicitRootIdsForWord(word)]),
  )

  return Object.entries(ETYMOLOGY_CARD_REVIEWS).map(([rootId, review]) => {
    const root = rootsById.get(rootId)
    const excluded = new Set(review.excludeHeads ?? [])
    const linkedWords = words
      .filter((word) =>
        !excluded.has(word.word.toLowerCase()) &&
        explicitRootsByWord.get(word.id)?.has(rootId))
      .sort(wordSort)
    const coverageIds = linkedWords.map((word) => word.id)
    const exampleIds = linkedWords.slice(0, 4).map((word) => word.id)

    return {
      id: `root:${rootId}`,
      mode: 'root',
      title: `${root?.form ?? rootId} ＝ ${root?.meaning ?? '意味を確認'}`,
      subtitle: `関連する${coverageIds.length}語で使われる形`,
      description: `${root?.origin ?? ''}にさかのぼる語源カードです。`,
      caution: 'このカードに明記した単語だけを結びます。綴りが似ているだけの語は含めません。',
      emoji: root?.emoji ?? '🌱',
      groupClaim: 'manual-reviewed-root',
      rootId,
      rootForm: root?.form ?? rootId,
      rootMeaning: root?.meaning ?? '',
      rootOrigin: root?.origin ?? '',
      coverageIds,
      studyIds: coverageIds,
      exampleIds,
      evidence: {
        reviewSchema: ETYMOLOGY_CARD_REVIEW_SCHEMA,
        reviewedAt: review.reviewedAt,
        reviewedBy: review.reviewedBy,
        sourceHeads: [...review.sourceHeads],
        sources: evidenceSources(review.sourceHeads),
        fingerprint: review.fingerprint,
      },
    }
  })
}

export function summarizeReviewedEtymologyCards(cards, allWordCount, legacyPackCount) {
  const wordIds = new Set(cards.flatMap((card) => card.coverageIds))
  const links = cards.reduce((sum, card) => sum + card.coverageIds.length, 0)
  return {
    total: wordIds.size,
    covered: wordIds.size,
    cards: cards.length,
    packs: cards.length,
    links,
    allWordCount,
    quarantinedWords: Math.max(0, allWordCount - wordIds.size),
    retiredLegacyPacks: legacyPackCount,
    counts: { formula: 0, root: cards.length, family: 0, origin: 0 },
    packCounts: { formula: 0, root: cards.length, family: 0, origin: 0 },
  }
}
