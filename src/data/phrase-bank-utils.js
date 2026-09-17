import { splitMeanings } from './compact.js'

// 列：見出し・意味・例文（英）・例文（和）・種類・注意書き・成り立ち。
// 注意書きと成り立ちは行ごとにその表現だけの文を書く（種類ごとの決まり文句で埋めない）。
const CATEGORIES = new Set(['phrasal-verb', 'collocation', 'preposition', 'fixed', 'discourse', 'conversation', 'idiom'])

const slug = (value) =>
  value
    .toLowerCase()
    .replace(/one['’]s/g, 'ones')
    .replace(/someone['’]s/g, 'someones')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')

export function parseIdiomRows(level, source) {
  const rows = source.trim().split('\n').map((line) => line.trim()).filter(Boolean)
  return rows.map((line, index) => {
    const [phrase, meaning, en, ja, category, note, origin] = line.split('\t')
    if (!phrase || !meaning || !en || !ja || !CATEGORIES.has(category) || !note || !origin) {
      throw new Error(`熟語バンク ${level}級 ${index + 1}行目: 必須列（注意書き・成り立ちを含む）またはcategoryが不正`)
    }
    return {
      id: `curr_idm_${level}_${slug(phrase)}`,
      kind: 'idiom',
      level,
      phrase,
      meaning,
      meanings: splitMeanings(meaning),
      example: { en, ja },
      origin,
      note,
      category,
      curriculumSupplement: true,
    }
  })
}

