import {
  ETYMOLOGY_WORD_NOTES,
  ETYMOLOGY_WORD_NOTE_SCHEMA,
} from './etymology-word-notes.js'

const evidenceSources = (head) => [
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
]

export function etymologyWordNoteMaterial(story) {
  return JSON.stringify({
    schema: ETYMOLOGY_WORD_NOTE_SCHEMA,
    head: story.head,
    note: story.note,
  })
}

/**
 * 語の成り立ちを、手動監査台帳にある語だけ組み立てる。
 * 単語データの自由記述 etymology.note は使わない。
 */
export function buildReviewedWordNotes(words) {
  const byHead = new Map(words.map((word) => [word.word.toLowerCase(), word]))
  return Object.entries(ETYMOLOGY_WORD_NOTES).flatMap(([head, review]) => {
    const word = byHead.get(head.toLowerCase())
    if (!word) return []
    return [{
      id: `story:${head}`,
      head,
      wordId: word.id,
      note: review.note,
      evidence: {
        reviewSchema: ETYMOLOGY_WORD_NOTE_SCHEMA,
        reviewedAt: review.reviewedAt,
        reviewedBy: review.reviewedBy,
        sources: evidenceSources(head),
        fingerprint: review.fingerprint,
      },
    }]
  })
}
