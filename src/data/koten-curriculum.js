import { KOTEN_WORD_LEVELS, KOTEN_WORDS } from './koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_CATEGORIES, KOTEN_GRAMMAR_ITEM_LEVELS } from './koten-grammar.js'
import { KOTEN_CULTURE } from './koten-culture.js'

// 同じ教材を学年別に重複コピーせず、既存の安定IDを保ったまま段階的に広げる。
// 古典単語・古典文法は項目ごとの重要度（中学→最難関の5段）でその段までを積み上げる。
// 文法は、その段の項目にまだない分野があれば、その分野でいちばん易しい項目を入口に1つ足す。
// 常識はカテゴリを一巡ずつ選ぶため、初級でも偏らない。

// 重要度の段の順番（中学→最難関）。コースの段と同じ id を使う。
const VOCAB_LEVEL_RANK = Object.fromEntries(KOTEN_WORD_LEVELS.map((level, index) => [level.id, index]))
const vocabUpTo = (rank) => KOTEN_WORDS.filter((word) => VOCAB_LEVEL_RANK[word.level] <= rank).length
const GRAMMAR_LEVEL_RANK = Object.fromEntries(KOTEN_GRAMMAR_ITEM_LEVELS.map((level, index) => [level.id, index]))
function grammarUpTo(rank) {
  const picked = KOTEN_GRAMMAR.filter((item) => GRAMMAR_LEVEL_RANK[item.level] <= rank)
  for (const category of KOTEN_GRAMMAR_CATEGORIES) {
    if (picked.some((item) => item.category === category.id)) continue
    const entry = KOTEN_GRAMMAR
      .filter((item) => item.category === category.id)
      .sort((a, b) => GRAMMAR_LEVEL_RANK[a.level] - GRAMMAR_LEVEL_RANK[b.level])[0]
    if (entry) picked.push(entry)
  }
  return new Set(picked.map((item) => item.id))
}
const GRAMMAR_BY_LEVEL = KOTEN_GRAMMAR_ITEM_LEVELS.map((_, rank) => grammarUpTo(rank))
export const KOTEN_CURRICULUM_LEVELS = [
  {
    id: 'middle',
    label: '中学入門',
    shortLabel: '中学',
    description: '現代語との違い、基本語、助動詞の入口、古人の暮らしをつかむ',
    targets: { vocab: vocabUpTo(0), grammar: GRAMMAR_BY_LEVEL[0].size, culture: 14 },
  },
  {
    id: 'basic',
    label: '高校基礎',
    shortLabel: '基礎',
    description: '頻出語義・活用と接続・敬語・古典常識を一通り固める',
    targets: { vocab: vocabUpTo(1), grammar: GRAMMAR_BY_LEVEL[1].size, culture: 28 },
  },
  {
    id: 'standard',
    label: '共通テスト・中堅大',
    shortLabel: '標準',
    description: '多義語と識別、和歌、人物関係を本文の根拠から判断する',
    targets: { vocab: vocabUpTo(2), grammar: GRAMMAR_BY_LEVEL[2].size, culture: 42 },
  },
  {
    id: 'advanced',
    label: '難関大学',
    shortLabel: '難関',
    description: '紛らわしい語義・複合文法・文学史を長文読解へ接続する',
    targets: { vocab: vocabUpTo(3), grammar: GRAMMAR_BY_LEVEL[3].size, culture: 50 },
  },
  {
    id: 'elite',
    label: '最難関大学',
    shortLabel: '最難関',
    description: '全教材を横断し、細部の識別まで説明できる状態を目指す',
    targets: {
      vocab: KOTEN_WORDS.length,
      grammar: KOTEN_GRAMMAR.length,
      culture: KOTEN_CULTURE.length,
    },
  },
]

function balancedOrder(items) {
  const categories = [...new Set(items.map((item) => item.category))]
  const buckets = new Map(
    categories.map((category) => [
      category,
      items.filter((item) => item.category === category),
    ]),
  )
  const ordered = []
  let index = 0
  while (ordered.length < items.length) {
    for (const category of categories) {
      const item = buckets.get(category)[index]
      if (item) ordered.push(item)
    }
    index += 1
  }
  return ordered
}

const ORDERED = {
  vocab: balancedOrder(KOTEN_WORDS),
  grammar: balancedOrder(KOTEN_GRAMMAR),
  culture: balancedOrder(KOTEN_CULTURE),
}

export const KOTEN_CURRICULUM_PATHS = KOTEN_CURRICULUM_LEVELS.map((level, index) => ({
  ...level,
  // その段までの重要度の語を、分野が偏らない順に並べる。
  vocabIds: ORDERED.vocab.filter((item) => VOCAB_LEVEL_RANK[item.level] <= index).map((item) => item.id),
  grammarIds: ORDERED.grammar.filter((item) => GRAMMAR_BY_LEVEL[index].has(item.id)).map((item) => item.id),
  cultureIds: ORDERED.culture.slice(0, level.targets.culture).map((item) => item.id),
}))

export const KOTEN_CURRICULUM_BY_ID = Object.fromEntries(
  KOTEN_CURRICULUM_PATHS.map((level) => [level.id, level]),
)
