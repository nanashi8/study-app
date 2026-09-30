// 画面下部の「出題」（出題バランスの目盛り、settings.vocabMix）を、暗記・テストの全30画面の出題へ当てる共通の決まり。
//
// 出題順そのもの（苦手→復習→未学習・未回答→今日1回まちがえた項目→定着の確認→そのほか）は studyOrder.js が決める。
// 目盛りが「自動」なら、その出題順のまま出す（英単語の級・分野・品詞・全語の回だけは、たまり具合で自動の配分）。
// 手で寄せた段（復習だけ・復習寄り・半々・未修寄り・未修だけ）は、英単語で決めた組み方をどの教材にも使う：
//   在庫を3つに分ける … fresh（未修：暗記もテストも記録がない）・missed（まだ・不正解：直近の答えがまちがい）・
//                        known（覚えた・正解：記録があり、直近の答えが成功）
//   復習の枠 … まだ・不正解 を出題順に出し切ってから、覚えた・正解 を点数の低い順（忘れかけている順）に
//   未修の枠 … 未修 を出題順に出し切ってから、残りの 覚えた・正解 を出題順に
//   途中の段は、それでも足りない枠をもう一方の在庫で補う。「未修だけ」は まだ・不正解 を、「復習だけ」は未修を出さない
//   苦手（何度も「まだ」「不正解」をくり返している項目）は、未修の項目と混ぜる前に先頭へまとめて出す。
import { hasVocabularyReviewEvidence, vocabularyReviewMetrics } from './vocabScheduler.js'
import { STUDY_ORDER_STAGE, studyOrderKey } from './studyOrder.js'

const MISSED_OUTCOMES = new Set(['forgot', 'wrong', 'unknown'])

/** 記録の直近の答え（暗記の「覚えた」「まだ」か、テストの正解・不正解のうち新しいほう）。記録がなければ null。 */
export function latestStudyOutcome(entry) {
  const memoryAt = Number(entry?.memory?.lastAt) || 0
  const testAt = Number(entry?.test?.lastAt) || 0
  if (memoryAt >= testAt && memoryAt > 0) return entry.memory?.lastJudgment ?? null
  if (testAt > 0) return entry.test?.lastResult ?? null
  return null
}

/** 記録1件の在庫（fresh・missed・known）。 */
export function studyMixStockOf(entry) {
  if (!hasVocabularyReviewEvidence(entry)) return 'fresh'
  return MISSED_OUTCOMES.has(latestStudyOutcome(entry)) ? 'missed' : 'known'
}

/**
 * 1項目に複数の問題がある教材（古典文法・古典常識・数学の歴史のテスト）の在庫。
 * 問題ごとの直近の結果で決めた出題の段（rankQuestionsForStudy）から読む。
 */
export function questionMixStockOf(entry) {
  if (entry?.stage === STUDY_ORDER_STAGE.fresh) return 'fresh'
  if (entry?.stage === STUDY_ORDER_STAGE.rest) return 'known'
  return 'missed'
}

// 両端（「復習だけ」「未修だけ」）は、足りなくてももう一方の在庫で数を埋めない。
export function studyMixSides(freshShare) {
  if (!Number.isFinite(freshShare)) return { review: true, fresh: true }
  return { review: freshShare < 1, fresh: freshShare > 0 }
}

// 7:3 や 6:4 でも片方が末尾に固まらないよう、比率を保って分散する。
export function interleaveProportionally(first, second) {
  if (!first.length) return [...second]
  if (!second.length) return [...first]
  const result = []
  let firstIndex = 0
  let secondIndex = 0
  while (firstIndex < first.length || secondIndex < second.length) {
    if (firstIndex >= first.length) {
      result.push(second[secondIndex++])
    } else if (secondIndex >= second.length) {
      result.push(first[firstIndex++])
    } else if (firstIndex / first.length <= secondIndex / second.length) {
      result.push(first[firstIndex++])
    } else {
      result.push(second[secondIndex++])
    }
  }
  return result
}

function unseenFirst(items, cycle, idOf) {
  if (!cycle.size) return items
  return [
    ...items.filter((item) => !cycle.has(idOf(item))),
    ...items.filter((item) => cycle.has(idOf(item))),
  ]
}

/**
 * 出題バランスを手で寄せたときの「復習」と「未修」の枠。ordered は出題順（studyOrder.js）に並べた項目。
 * stockOf(item) は在庫（fresh・missed・known）、scoreOf(item) は点数（一覧の「復習のおすすめ順」と同じ。低いほど忘れかけ）。
 * cycleIds は同じ周回で出し終えた項目（未修・覚えた／正解 からは外し、まだ・不正解 では最後に回す）。
 * size が 0 なら、出せる項目をすべて同じ割合で並べる。
 */
export function studyMixShares(
  ordered,
  { size = 0, freshShare, stockOf, scoreOf, cycleIds = [], idOf = (item) => item?.id } = {},
) {
  const share = Math.min(1, Math.max(0, Number(freshShare) || 0))
  const sides = studyMixSides(share)
  const cycle = new Set(Array.isArray(cycleIds) ? cycleIds : [])
  const groups = { fresh: [], missed: [], known: [] }
  for (const item of ordered ?? []) groups[stockOf(item)]?.push(item)
  const fresh = sides.fresh ? groups.fresh.filter((item) => !cycle.has(idOf(item))) : []
  const missed = sides.review ? unseenFirst(groups.missed, cycle, idOf) : []
  const known = groups.known.filter((item) => !cycle.has(idOf(item)))
  const available = fresh.length + missed.length + known.length
  const target = size > 0 ? Math.min(size, available) : available
  const freshTarget = Math.round(target * share)
  const reviewTarget = target - freshTarget

  const freshPicked = fresh.slice(0, freshTarget)
  const reviewPicked = missed.slice(0, reviewTarget)
  // 復習の枠が先に、点数の低い 覚えた・正解 を取る。同じ点数なら出題順のまま（sort は安定）。
  const scores = new Map(known.map((item) => [item, scoreOf(item)]))
  const byScore = [...known].sort((a, b) => scores.get(a) - scores.get(b))
  const usedKnown = new Set()
  for (const item of byScore) {
    if (reviewPicked.length >= reviewTarget) break
    reviewPicked.push(item)
    usedKnown.add(item)
  }
  for (const item of known) {
    if (freshPicked.length >= freshTarget) break
    if (usedKnown.has(item)) continue
    freshPicked.push(item)
  }
  const spareFresh = fresh.slice(Math.min(fresh.length, freshTarget))
  const spareMissed = missed.slice(Math.min(missed.length, reviewTarget))
  while (freshPicked.length < freshTarget && spareMissed.length) freshPicked.push(spareMissed.shift())
  while (reviewPicked.length < reviewTarget && spareFresh.length) reviewPicked.push(spareFresh.shift())
  return { review: reviewPicked, fresh: freshPicked }
}

/** 2つの枠を1本の出題順にする。苦手の項目を先頭にまとめ、残りは割合を保って混ぜる。 */
export function composeStudyMix({ review = [], fresh = [] } = {}, isStruggling = () => false) {
  return [
    ...review.filter(isStruggling),
    ...fresh.filter(isStruggling),
    ...interleaveProportionally(
      review.filter((item) => !isStruggling(item)),
      fresh.filter((item) => !isStruggling(item)),
    ),
  ]
}

/**
 * 項目ごとの記録（項目ID → 記録）を持つ教材で、出題順に並べた項目に出題バランスを当てる。
 * freshShare が数でなければ（自動）、ordered をそのまま返す。
 */
export function mixItemsForStudy(
  ordered,
  srs = {},
  {
    freshShare = null,
    size = 0,
    now = Date.now(),
    day,
    cycleIds = [],
    idOf = (item) => item?.id,
  } = {},
) {
  if (!Number.isFinite(freshShare)) return ordered
  const at = day === undefined ? { now } : { now, day }
  const entryOf = (item) => srs?.[idOf(item)]
  const shares = studyMixShares(ordered, {
    size,
    freshShare,
    stockOf: (item) => studyMixStockOf(entryOf(item)),
    scoreOf: (item) => vocabularyReviewMetrics(entryOf(item), at).score,
    cycleIds,
    idOf,
  })
  return composeStudyMix(
    shares,
    (item) => studyOrderKey(entryOf(item), at).stage === STUDY_ORDER_STAGE.struggling,
  )
}

/**
 * 出題順に並べた候補（rankForStudy・rankQuestionsForStudy の { item, stage, score, box }）に出題バランスを当て、
 * pickInStudyOrder にそのまま渡せる形で返す。苦手（0段）は先頭のまま、ほかは割合を保って混ぜた順で1つの段にまとめる
 * （形式の配分は、その段の中で守る）。stockOf(entry) は候補の在庫。freshShare が数でなければ ranked をそのまま返す。
 */
export function mixRankedForStudy(ranked, { freshShare = null, stockOf } = {}) {
  if (!Number.isFinite(freshShare)) return ranked
  const shares = studyMixShares(ranked, {
    freshShare,
    stockOf,
    scoreOf: (entry) => entry.score,
    idOf: (entry) => entry.item?.id ?? entry.item,
  })
  return composeStudyMix(shares, (entry) => entry.stage === STUDY_ORDER_STAGE.struggling)
    .map((entry) => (entry.stage === STUDY_ORDER_STAGE.struggling
      ? entry
      : { ...entry, stage: STUDY_ORDER_STAGE.fresh }))
}

/** 項目ごとの記録を持つ教材の候補（rankItemsForStudy の結果）の在庫。 */
export const recordMixStockOf = (srs, idOf = (item) => item?.id) =>
  (entry) => studyMixStockOf(srs?.[idOf(entry.item)])
