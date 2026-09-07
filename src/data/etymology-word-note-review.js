import {
  ETYMOLOGY_WORD_NOTES,
  ETYMOLOGY_WORD_NOTE_SCHEMA,
} from './etymology-word-notes.js'
import { ETYMOLOGY_NOTE_LEDGER } from './etymology-note-ledger.js'

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

const OVERRIDES = new Map(
  Object.entries(ETYMOLOGY_WORD_NOTES).map(([head, value]) => [head.toLowerCase(), { head, value }]),
)
// 台帳は「見出し語 ハッシュ」の1行ずつ。
const LEDGER = new Map(ETYMOLOGY_NOTE_LEDGER.map((row) => {
  const at = row.lastIndexOf(' ')
  const head = row.slice(0, at)
  return [head.toLowerCase(), { head, value: row.slice(at + 1) }]
}))

/**
 * 学習者へ出す「語の成り立ち」を組み立てる。
 *
 * - 本文を書き起こした語は台帳の本文をそのまま使う。
 * - それ以外は既存メモを使うが、本文のハッシュが台帳と一致する語だけ。
 *   監査後にメモが書き換わると一致しなくなり、その語は自動的に公開から外れる。
 */
export function buildReviewedWordNotes(words, { hash }) {
  const out = []
  for (const word of words) {
    const key = word.word.toLowerCase()
    const override = OVERRIDES.get(key)
    if (override) {
      out.push({
        id: `story:${override.head}`,
        head: override.head,
        wordId: word.id,
        note: override.value.note,
        origin: 'reviewed-text',
        evidence: {
          reviewSchema: ETYMOLOGY_WORD_NOTE_SCHEMA,
          reviewedAt: override.value.reviewedAt,
          reviewedBy: override.value.reviewedBy,
          sources: evidenceSources(override.head),
          fingerprint: override.value.fingerprint,
        },
      })
      continue
    }
    const sealed = LEDGER.get(key)
    const note = (word.etymology?.note ?? '').trim()
    if (!sealed || !note) continue
    if (hash(note).slice(0, sealed.value.length) !== sealed.value) continue
    out.push({
      id: `story:${sealed.head}`,
      head: sealed.head,
      wordId: word.id,
      note,
      origin: 'sealed-note',
      evidence: {
        reviewSchema: ETYMOLOGY_WORD_NOTE_SCHEMA,
        reviewedAt: '2026-09-07',
        reviewedBy: 'manual-etymology-audit',
        sources: evidenceSources(sealed.head),
        fingerprint: sealed.value,
      },
    })
  }
  return out
}
