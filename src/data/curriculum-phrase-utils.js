import { splitMeanings } from './compact.js'
import { CURRICULUM_1900_PHRASE_RESOLUTIONS } from './curriculum-1900-resolutions.js'

// 列：見出し・級・意味・例文（英）・例文（和）・種類・注意書き・成り立ち。
// 注意書きと成り立ちは行ごとにその表現だけの文を書く（種類ごとの決まり文句で埋めない）。
const CATEGORIES = new Set(['phrasal-verb', 'collocation', 'preposition', 'structure', 'discourse', 'conversation', 'idiom'])

const slug = (value) => value
  .toLowerCase()
  .replace(/one['’]s/g, 'ones')
  .replace(/~|\.\.\./g, 'blank')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_|_$/g, '')

const sourceAliasesFor = (canonical) => Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)
  .filter(([source, target]) => target === canonical && source !== canonical)
  .map(([source]) => source)

export function parseCurriculum1900PhraseRows(source) {
  const rows = source.trim().split('\n').map((line) => line.trim()).filter(Boolean)
  return rows.map((line, index) => {
    const [phrase, level, meaning, en, ja, category, note, origin] = line.split('\t')
    if (!phrase || !level || !meaning || !en || !ja || !CATEGORIES.has(category) || !note || !origin) {
      throw new Error(`1900熟語補完 ${index + 1}行目: 必須列（注意書き・成り立ちを含む）またはcategoryが不正`)
    }
    return {
      id: `curr1900_idm_${level}_${slug(phrase)}`,
      kind: 'idiom',
      level,
      phrase,
      meaning,
      meanings: splitMeanings(meaning),
      example: { en, ja },
      origin,
      note,
      category,
      aliases: sourceAliasesFor(phrase),
      curriculumSupplement: true,
      curriculumSource: '1900-coverage',
    }
  })
}
