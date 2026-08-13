import { KOTEN_WORDS } from './koten.js'
import { KOTEN_GRAMMAR } from './koten-grammar.js'
import { KOTEN_CULTURE } from './koten-culture.js'

// 同じ教材を学年別に重複コピーせず、既存の安定IDを保ったまま段階的に広げる。
// 各分野はカテゴリを一巡ずつ選ぶため、初級でも語彙・文法・背景知識が偏らない。
export const KOTEN_CURRICULUM_LEVELS = [
  {
    id: 'middle',
    label: '中学入門',
    shortLabel: '中学',
    description: '現代語との違い、基本語、助動詞の入口、古人の暮らしをつかむ',
    targets: { vocab: 64, grammar: 18, culture: 14 },
  },
  {
    id: 'basic',
    label: '高校基礎',
    shortLabel: '基礎',
    description: '頻出語義・活用と接続・敬語・古典常識を一通り固める',
    targets: { vocab: 120, grammar: 34, culture: 28 },
  },
  {
    id: 'standard',
    label: '共通テスト・中堅大',
    shortLabel: '標準',
    description: '多義語と識別、和歌、人物関係を本文の根拠から判断する',
    targets: { vocab: 190, grammar: 50, culture: 42 },
  },
  {
    id: 'advanced',
    label: '難関大学',
    shortLabel: '難関',
    description: '紛らわしい語義・複合文法・文学史を長文読解へ接続する',
    targets: { vocab: 250, grammar: 64, culture: 50 },
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

export const KOTEN_CURRICULUM_PATHS = KOTEN_CURRICULUM_LEVELS.map((level) => ({
  ...level,
  vocabIds: ORDERED.vocab.slice(0, level.targets.vocab).map((item) => item.id),
  grammarIds: ORDERED.grammar.slice(0, level.targets.grammar).map((item) => item.id),
  cultureIds: ORDERED.culture.slice(0, level.targets.culture).map((item) => item.id),
}))

export const KOTEN_CURRICULUM_BY_ID = Object.fromEntries(
  KOTEN_CURRICULUM_PATHS.map((level) => [level.id, level]),
)
