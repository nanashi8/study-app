import { splitMeanings } from './compact.js'

const CATEGORY_META = Object.freeze({
  'phrasal-verb': {
    origin: '動詞と副詞・前置詞を一つの意味のまとまりとして捉える句動詞。',
    note: '目的語の位置と、自動詞・他動詞の違いにも注意する。',
  },
  collocation: {
    origin: '英語で自然に結びつく語どうしを、語順を保った一まとまりとして覚える連語。',
    note: '同じ意味の日本語から直訳せず、この語の組み合わせで使う。',
  },
  preposition: {
    origin: '前置詞を含む語のまとまり全体で一つの働きをする定型表現。',
    note: '前置詞まで含めて覚え、後ろに名詞・動名詞のどちらが来るか確認する。',
  },
  fixed: {
    origin: '複数の語を切り離さず、一つの意味として使う定型表現。',
    note: '語順を変えず、まとまりのまま文中で使う。',
  },
  discourse: {
    origin: '文と文の関係や話の流れを明示する談話表現。',
    note: '文頭・文中の位置と、後ろに続く内容の関係を意識する。',
  },
  conversation: {
    origin: '会話で繰り返し使う語順を、そのまま再利用できる定型表現。',
    note: '場面と丁寧さをセットにして覚える。',
  },
  idiom: {
    origin: '単語を直訳しただけでは出にくい意味を、表現全体で捉える慣用句。',
    note: '比喩的な意味と、実際に使う場面を結びつけて覚える。',
  },
})

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
    const [phrase, meaning, en, ja, category = 'fixed', note = ''] = line.split('\t')
    if (!phrase || !meaning || !en || !ja || !CATEGORY_META[category]) {
      throw new Error(`熟語バンク ${level}級 ${index + 1}行目: 必須列またはcategoryが不正`)
    }
    const meta = CATEGORY_META[category]
    return {
      id: `curr_idm_${level}_${slug(phrase)}`,
      kind: 'idiom',
      level,
      phrase,
      meaning,
      meanings: splitMeanings(meaning),
      example: { en, ja },
      origin: meta.origin,
      note: note || meta.note,
      category,
      curriculumSupplement: true,
    }
  })
}

