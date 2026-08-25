import { splitMeanings } from './compact.js'
import { CURRICULUM_1900_PHRASE_RESOLUTIONS } from './curriculum-1900-resolutions.js'

const CATEGORY_META = Object.freeze({
  'phrasal-verb': {
    origin: '動詞に副詞・前置詞の方向感覚が加わり、表現全体で一つの動作を表す句動詞。',
    note: '目的語を置く位置と、自動詞・他動詞の違いまで例文で確認する。',
  },
  collocation: {
    origin: '英語で自然に結びつく語どうしを、語順ごと一まとまりにした連語。',
    note: '日本語から一語ずつ直訳せず、この語の組み合わせで使う。',
  },
  preposition: {
    origin: '前置詞が持つ位置・方向・関係の感覚を含め、まとまり全体で一つの働きをする表現。',
    note: '前置詞まで含めて覚え、後ろに続く名詞や動名詞を確認する。',
  },
  structure: {
    origin: '語順と空所の位置を固定して、別の語を入れ替えて使える文の型。',
    note: 'A・B・... の役割と、後ろに原形・動名詞・節のどれが来るかを確認する。',
  },
  discourse: {
    origin: '文と文の論理関係や、話の流れを読み手に示す談話表現。',
    note: '逆接・追加・理由・言い換えなど、前後の関係とセットで使う。',
  },
  conversation: {
    origin: '会話の場面と語順を一つのかたまりとして再利用する定型表現。',
    note: '場面、相手との距離、丁寧さを例文と一緒に覚える。',
  },
  idiom: {
    origin: '語を一つずつ直訳した意味から離れ、表現全体で慣用的な意味を作る。',
    note: '直訳のイメージと実際の意味を結び付け、まとまりのまま覚える。',
  },
})

const slug = (value) => value
  .toLowerCase()
  .replace(/one['’]s/g, 'ones')
  .replace(/~|\.\.\./g, 'blank')
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_|_$/g, '')

const sourceAliasesFor = (canonical) => Object.entries(CURRICULUM_1900_PHRASE_RESOLUTIONS)
  .filter(([source, target]) => target === canonical && source !== canonical)
  .map(([source]) => source)

const formationFor = (phrase, category) => {
  const meta = CATEGORY_META[category]
  const words = phrase.replace(/[.?!;,]/g, '').split(/\s+/).filter(Boolean)
  if (category === 'phrasal-verb' && words.length >= 2) {
    return `${meta.origin} この表現では ${words[0]} と ${words.slice(1).join(' ')} を切り離さず捉える。`
  }
  if (category === 'preposition') {
    const lead = words[0]?.toLowerCase()
    return `${meta.origin}${lead ? ` 先頭の ${lead} も意味の一部。` : ''}`
  }
  return meta.origin
}

export function parseCurriculum1900PhraseRows(source) {
  const rows = source.trim().split('\n').map((line) => line.trim()).filter(Boolean)
  return rows.map((line, index) => {
    const [phrase, level, meaning, en, ja, category = 'collocation', note = ''] = line.split('\t')
    const meta = CATEGORY_META[category]
    if (!phrase || !level || !meaning || !en || !ja || !meta) {
      throw new Error(`1900熟語補完 ${index + 1}行目: 必須列またはcategoryが不正`)
    }
    return {
      id: `curr1900_idm_${level}_${slug(phrase)}`,
      kind: 'idiom',
      level,
      phrase,
      meaning,
      meanings: splitMeanings(meaning),
      example: { en, ja },
      origin: formationFor(phrase, category),
      note: note || meta.note,
      category,
      aliases: sourceAliasesFor(phrase),
      curriculumSupplement: true,
      curriculumSource: '1900-coverage',
    }
  })
}
