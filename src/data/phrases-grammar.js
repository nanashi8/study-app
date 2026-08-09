import { GRAMMAR } from './grammar.js'

const normalizeHead = (value = '') => value.trim().toLowerCase()

const grammarFormation = (item) =>
  `文法問題「${item.q}」の空所に「${item.answer}」を置くと完成する${item.topic}の構文。${item.explain}`

const groupedByPattern = (items) => {
  const groups = new Map()
  for (const item of items) {
    const pattern = item.variationGroup ?? item.pattern ?? `${item.level}:${item.topic}`
    if (!groups.has(pattern)) groups.set(pattern, [])
    groups.get(pattern).push(item)
  }
  return [...groups.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'en'))
    .map(([, rows]) => rows)
}

// 同じ文法パターンの第1問だけで埋めず、パターン間を巡回して構文例を選ぶ。
// 元の文法問題IDをカードIDに含めるため、追加後もSRS履歴が安定する。
const roundRobin = (groups, count, usedHeads) => {
  const selected = []
  for (let round = 0; selected.length < count; round++) {
    let foundAtThisRound = false
    for (const group of groups) {
      const item = group[round]
      if (!item?.sentence?.en || !item.sentence?.ja) continue
      foundAtThisRound = true
      const head = normalizeHead(item.sentence.en)
      if (usedHeads.has(head)) continue
      usedHeads.add(head)
      selected.push(item)
      if (selected.length >= count) break
    }
    if (!foundAtThisRound) break
  }
  return selected
}

export function buildGrammarSyntaxPhrases({ needsByLevel, excludedHeads = [] }) {
  const usedHeads = new Set([...excludedHeads].map(normalizeHead))
  const phrases = []

  for (const [level, count] of Object.entries(needsByLevel)) {
    if (count <= 0) continue
    const candidates = GRAMMAR.filter(
      (item) =>
        item.level === level &&
        item.id &&
        item.sentence?.en &&
        item.sentence?.ja &&
        item.explain,
    )
    const selected = roundRobin(groupedByPattern(candidates), count, usedHeads)
    if (selected.length !== count) {
      throw new Error(`構文カード ${level}級: ${selected.length}/${count}件しか抽出できません`)
    }

    phrases.push(
      ...selected.map((item) => ({
        id: `curr_syn_${item.id}`,
        kind: 'syntax',
        level,
        phrase: item.sentence.en,
        meaning: item.sentence.ja,
        meanings: [item.sentence.ja],
        example: { ...item.sentence },
        origin: grammarFormation(item),
        note: item.explain,
        category: 'grammar-example',
        sourcePattern: item.variationGroup ?? item.pattern ?? `${item.level}:${item.topic}`,
        sourceGrammarId: item.id,
        curriculumSupplement: true,
      })),
    )
  }

  return phrases
}
