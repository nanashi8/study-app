import {
  GRAMMAR,
  GRAMMAR_PRACTICE,
  getGrammar,
  grammarByLevel,
  grammarPatternGroup,
  grammarByTopic,
  grammarPracticeByLevel,
  grammarPracticeByTopic,
} from '../data/grammar.js'
import {
  GRAMMAR_QUESTION_TYPES,
  grammarQuestionType,
} from '../data/grammar-format-expansion.js'
import { getGrammarStrand, grammarStrandQuestions } from '../data/grammar-strands.js'
import { shuffle } from '../data/vocab.js'

export const GRAMMAR_SESSION_SIZE = 10

// pattern / variationGroup は、語句だけを差し替えた同一の出題型を表す。
// 型が未指定の手作り問題だけを固有問題として扱い、既存IDとの互換性を保つ。
//
// ただし入試型(gr_exam_*)は1つの型の中で examFocus＝「その問題で問う箇所」が
// 4種類以上あることを check-data が保証しており、語句差し替えではなく別々の
// 文法判断を問う。型ごと1問に潰すと、在庫46問の5級「代名詞」がテストでは
// 1問で終わるなど、単元の在庫が出題数に反映されなくなる。
// そこで examFocus を持つ問題は「型＋問う箇所」までそろって初めて同型とみなす。
// examFocus が同じ問題どうしは従来どおり1問に束ねる。
export function grammarVariationKey(item) {
  if (!item) return ''
  const patternGroup = grammarPatternGroup(item)
  if (!patternGroup) return `item:${item.id}`
  return item.examFocus
    ? `pattern:${patternGroup}#${item.examFocus}`
    : `pattern:${patternGroup}`
}

export function grammarCandidates(source = {}) {
  if (source.type === 'grammarList') {
    return (source.ids ?? []).map(getGrammar).filter(Boolean)
  }
  if (source.type === 'grammarDue') {
    return source.questionType
      ? GRAMMAR_PRACTICE.filter((item) =>
          source.questionType === 'mixed' || grammarQuestionType(item) === source.questionType)
      : GRAMMAR
  }
  // 系統は級をまたぐが、1回の出題は現在地の級だけに絞る。
  // 級を混ぜると「いまどの段にいるか」が学習者から見えなくなるため。
  if (source.type === 'grammarStrand') {
    const strand = getGrammarStrand(source.strandId)
    if (!strand) return []
    return grammarStrandQuestions(strand, source.level ?? null)
  }
  if (source.questionType) {
    if (source.topic) {
      return grammarPracticeByTopic(source.level, source.topic, source.questionType)
    }
    return grammarPracticeByLevel(source.level, source.questionType)
  }
  if (source.topic) return grammarByTopic(source.level, source.topic)
  return grammarByLevel(source.level)
}

function reviewPriority(item, srs, day) {
  const review = srs[item.id]
  if (review?.due <= day) return [0, review.box ?? 0]
  if (!review) return [1, 0]
  return [2, review.box ?? 0]
}

function comparePriority(a, b, srs, day) {
  const [aState, aBox] = reviewPriority(a, srs, day)
  const [bState, bBox] = reviewPriority(b, srs, day)
  return aState - bState || aBox - bBox
}

// 既存の選択問題が3,450問あっても、混合テストではその在庫差で
// 並び替え・語法が押し出されないよう、同じ復習優先度の中で形式を巡回する。
function balanceQuestionTypes(items, srs, day) {
  const result = []
  for (const priorityState of [0, 1, 2]) {
    const groups = Object.fromEntries(GRAMMAR_QUESTION_TYPES.map((type) => [type, []]))
    for (const item of items) {
      if (reviewPriority(item, srs, day)[0] !== priorityState) continue
      groups[grammarQuestionType(item)]?.push(item)
    }
    let remaining = Object.values(groups).reduce((total, group) => total + group.length, 0)
    while (remaining > 0) {
      for (const type of GRAMMAR_QUESTION_TYPES) {
        const next = groups[type].shift()
        if (!next) continue
        result.push(next)
        remaining -= 1
      }
    }
  }
  return result
}

// 選ばれた問題の集合は変えず、可能な限り同じ単元が隣り合わない順へ並べる。
// 同じ級をまとめて解くときも、近い問題が固まらず文法判断を切り替えられる。
function spreadTopics(items) {
  const groups = new Map()
  items.forEach((item, index) => {
    const group = groups.get(item.topic) ?? { topic: item.topic, firstIndex: index, items: [] }
    group.items.push(item)
    groups.set(item.topic, group)
  })

  const ordered = []
  let previousTopic = null
  while (ordered.length < items.length) {
    const available = [...groups.values()]
      .filter((group) => group.items.length)
      .sort((a, b) => b.items.length - a.items.length || a.firstIndex - b.firstIndex)
    const nextGroup = available.find((group) => group.topic !== previousTopic) ?? available[0]
    if (!nextGroup) break
    ordered.push(nextGroup.items.shift())
    previousTopic = nextGroup.topic
  }
  return ordered
}

// 復習日・未着手の優先順位を守りながら、語句差し替えだけの同型は
// 1セッションに1問だけ選ぶ。型の少ない単元では問題数を水増ししない。
export function buildGrammarDeck(
  source,
  {
    srs = {},
    size = GRAMMAR_SESSION_SIZE,
    day = 0,
    rng = Math.random,
  } = {},
) {
  const candidates = grammarCandidates(source)
  if (source?.type === 'grammarList' && source.preserveOrder) {
    return size > 0 ? candidates.slice(0, size) : candidates
  }
  let pool = shuffle(candidates, rng)
  if (source?.type === 'grammarDue') {
    pool = pool.filter((item) => srs[item.id]?.due <= day)
  }
  pool.sort((a, b) => comparePriority(a, b, srs, day))

  const limit = size > 0 ? size : Number.POSITIVE_INFINITY
  const variationKeys = new Set()
  const unique = []
  for (const item of pool) {
    const key = grammarVariationKey(item)
    if (variationKeys.has(key)) continue
    variationKeys.add(key)
    unique.push(item)
  }

  const ordered = source?.questionType === 'mixed'
    ? balanceQuestionTypes(unique, srs, day)
    : unique
  return spreadTopics(ordered.slice(0, limit))
}
