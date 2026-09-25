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
import { STUDY_ORDER_STAGE, rankForStudy, studyOrderKey } from './studyOrder.js'

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
    return grammarStrandQuestions(strand, source.level ?? null, source.questionType ?? 'mixed')
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

// 既存の選択問題が3,450問あっても、混合テストではその在庫差で
// 並び替え・語法が押し出されないよう、出題順の同じ段の中で形式を巡回する。
// 何度も間違えている問題（0段）と今日間違えた問題（3段）は、形式の巡回より点数の低い順を優先する。
const IN_ORDER_STAGES = new Set([STUDY_ORDER_STAGE.struggling, STUDY_ORDER_STAGE.missedToday])

function balanceQuestionTypes(items, stageOf) {
  const result = []
  for (const stage of Object.values(STUDY_ORDER_STAGE)) {
    const stageItems = items.filter((item) => (
      stageOf.get(item.id) === stage
      && GRAMMAR_QUESTION_TYPES.includes(grammarQuestionType(item))
    ))
    if (IN_ORDER_STAGES.has(stage)) {
      result.push(...stageItems)
      continue
    }
    const groups = Object.fromEntries(GRAMMAR_QUESTION_TYPES.map((type) => [type, []]))
    for (const item of stageItems) groups[grammarQuestionType(item)].push(item)
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
function spreadTopics(items, previous = null) {
  const groups = new Map()
  items.forEach((item, index) => {
    const group = groups.get(item.topic) ?? { topic: item.topic, firstIndex: index, items: [] }
    group.items.push(item)
    groups.set(item.topic, group)
  })

  const ordered = []
  let previousTopic = previous
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

// 点数の低い順に並んだ段は、その順をなるべく崩さない。直前と同じ単元になるときだけ、次の問題を先に出す。
function spreadTopicsKeepingOrder(items, previous = null) {
  const rest = [...items]
  const ordered = []
  let previousTopic = previous
  while (rest.length) {
    const at = Math.max(0, rest.findIndex((item) => item.topic !== previousTopic))
    const [next] = rest.splice(at, 1)
    ordered.push(next)
    previousTopic = next.topic
  }
  return ordered
}

// 出題順の段ごとに単元を散らす。まだ答えていない問題（2段）は単元の偏りだけを見て散らし、
// 何度も間違えている問題（0段）と今日間違えた問題（3段）は点数の低い順のまま、ほかの段は点数の低い順をなるべく保つ。
// 段をまたいで順番を入れ替えない。
function spreadTopicsByStage(items, stageOf) {
  const result = []
  let start = 0
  while (start < items.length) {
    const stage = stageOf.get(items[start].id)
    let end = start
    while (end < items.length && stageOf.get(items[end].id) === stage) end += 1
    const group = items.slice(start, end)
    const previous = result.at(-1)?.topic ?? null
    result.push(...(stage === STUDY_ORDER_STAGE.fresh
      ? spreadTopics(group, previous)
      : IN_ORDER_STAGES.has(stage)
        ? group
        : spreadTopicsKeepingOrder(group, previous)))
    start = end
  }
  return result
}

// 出題順（studyOrder.js）を守りながら、語句差し替えだけの同型は
// 1セッションに1問だけ選ぶ。型の少ない単元では問題数を水増ししない。
export function buildGrammarDeck(
  source,
  {
    srs = {},
    size = GRAMMAR_SESSION_SIZE,
    day = 0,
    now = Date.now(),
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
  // 文法はテストだけの教材なので、まだ答えていない問題を2段（未回答）に数える。
  const ranked = rankForStudy(
    pool,
    (item) => studyOrderKey(srs[item.id], { purpose: 'quiz', now, day }),
    { rng: null },
  )
  const stageOf = new Map(ranked.map(({ item, stage }) => [item.id, stage]))

  const limit = size > 0 ? size : Number.POSITIVE_INFINITY
  const variationKeys = new Set()
  const unique = []
  for (const { item } of ranked) {
    const key = grammarVariationKey(item)
    if (variationKeys.has(key)) continue
    variationKeys.add(key)
    unique.push(item)
  }

  const ordered = source?.questionType === 'mixed'
    ? balanceQuestionTypes(unique, stageOf)
    : unique
  return spreadTopicsByStage(ordered.slice(0, limit), stageOf)
}
