import { expandCompact } from './compact.js'

/**
 * 外部語彙一覧との差分を、既存の単語カード形式へ展開する。
 *
 * TSV columns:
 * word, pos, level, meaning, example.en, example.ja, etymology, field, phonetic(optional)
 */
export function parseCurriculumWordRows(source, { sourceId = 'supplement' } = {}) {
  const rows = source.trim().split('\n').map((line) => line.trim()).filter(Boolean)

  return rows.map((line, index) => {
    const [word, pos, level, meaning, en, ja, etymology, field, phonetic = ''] = line.split('\t')
    if (!word || !pos || !level || !meaning || !en || !ja || !etymology || !field) {
      throw new Error(`${sourceId} 単語 ${index + 1}行目: 必須列が不足しています。`)
    }

    const entry = expandCompact([
      word,
      pos,
      level,
      meaning,
      en,
      ja,
      etymology,
      { field },
    ])

    return {
      ...entry,
      ...(phonetic ? { phonetic } : {}),
      curriculumSupplement: sourceId,
    }
  })
}
