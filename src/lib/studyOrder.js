import {
  contentQuizKey,
  normalizeContentQuizResults,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { localDayIndex, vocabularyReviewMetrics } from './vocabScheduler.js'

// 暗記・テストで、どの項目から出すか。単語・熟語・文法・リスニング・書き取り・語源・古典・漢文・英作文の
// どの教材も、この1つの決まりで並べる。
//
//   0段 復習日を迎えた項目（前の日に「まだ」「不正解」だった項目を含む）
//   1段 まだ学習していない項目（暗記）・まだ答えていない項目（テスト）
//   2段 今日「まだ」「不正解」になった項目
//   3段 そのほか（覚えた・正解で、次の復習日を待っている項目）
//
// 0段と1段が今日の候補。今日の候補を出し切ってから、今日「まだ」「不正解」になった項目へ進む。
// 同じ段の中は点数の低い順（vocabularyReviewMetrics の score。一覧の「復習のおすすめ順」と同じ点数）。
// 点数も同じ項目どうしは、呼び出すたびにシャッフルした順にする。
export const STUDY_ORDER_STAGE = Object.freeze({
  review: 0,
  fresh: 1,
  missedToday: 2,
  rest: 3,
})

const dayOf = (timestamp) => (
  Number.isFinite(timestamp) ? localDayIndex(timestamp) : null
)

function shuffled(items, rng) {
  const result = [...items]
  if (typeof rng !== 'function') return result
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

/**
 * 記録1件から、出題の段と点数を決める。記録がなければ entry は undefined でよい。
 * purpose は study（暗記）か quiz（テスト）。未学習と見るか未回答と見るかだけが変わる。
 */
export function studyOrderKey(
  entry,
  { purpose = 'study', now = Date.now(), day = localDayIndex(now) } = {},
) {
  const metrics = vocabularyReviewMetrics(entry, { now, day })
  const quizStatus = quizStatusForSrsEntry(entry)
  const fresh = purpose === 'quiz'
    ? quizStatus === 'unanswered'
    : metrics.learningStatus === 'unlearned'
  // 暗記の「まだ」も、テストの「不正解」も、その結果を今日つけたときだけ2段にする。
  const missedToday = (
    metrics.learningStatus === 'reviewing' && dayOf(entry?.memory?.lastAt) === day
  ) || (
    quizStatus === 'incorrect' && dayOf(entry?.test?.lastAt) === day
  )
  const stage = metrics.needsReview && !metrics.coolingDown
    ? STUDY_ORDER_STAGE.review
    : fresh
      ? STUDY_ORDER_STAGE.fresh
      : missedToday
        ? STUDY_ORDER_STAGE.missedToday
        : STUDY_ORDER_STAGE.rest
  return {
    stage,
    score: metrics.score,
    box: Math.max(0, Number(entry?.box) || 0),
  }
}

/** 段 → 点数（低い順）→ 復習の進み（低い順）で比べる。 */
export function compareStudyOrderKeys(a, b) {
  return a.stage - b.stage || a.score - b.score || a.box - b.box
}

/**
 * items を出題順に並べ、{ item, stage, score, box } の配列で返す（items は変えない）。
 * keyOf(item) は studyOrderKey と同じ形を返す。rng に null を渡すと、段も点数も同じ項目どうしは渡された順のまま。
 */
export function rankForStudy(items = [], keyOf, { rng = Math.random } = {}) {
  return shuffled(Array.isArray(items) ? items : [], rng)
    .map((item, index) => ({ item, index, ...keyOf(item) }))
    .sort((a, b) => compareStudyOrderKeys(a, b) || a.index - b.index)
}

/** 項目ごとの記録（項目ID → 記録）を持つ教材の項目を、出題順の { item, stage, score, box } で返す。 */
export function rankItemsForStudy(
  items = [],
  srs = {},
  {
    purpose = 'study',
    now = Date.now(),
    day = localDayIndex(now),
    rng = Math.random,
    idOf = (item) => item?.id,
  } = {},
) {
  return rankForStudy(
    items,
    (item) => studyOrderKey(srs?.[idOf(item)], { purpose, now, day }),
    { rng },
  )
}

/** 項目ごとの記録を持つ教材の項目を、出題順に並べた新しい配列で返す。 */
export function orderForStudy(items = [], srs = {}, options = {}) {
  return rankItemsForStudy(items, srs, options).map(({ item }) => item)
}

/**
 * 1項目に複数の問題がある教材（古典文法・古典常識のテスト）。未回答・不正解は問題ごとの直近の結果
 * （contentQuizResults）で見て、点数はその問題が扱う項目の記録から出す。
 * 前の日に間違えた問題は0段、まだ答えていない問題は1段、今日間違えた問題は2段、正解した問題は3段。
 */
export function rankQuestionsForStudy(
  questions = [],
  {
    quizResults = {},
    quizDomain,
    srs = {},
    itemIdOf = () => null,
    now = Date.now(),
    day = localDayIndex(now),
    rng = Math.random,
  } = {},
) {
  const results = normalizeContentQuizResults(quizResults)
  return rankForStudy(questions, (question) => {
    const result = results[contentQuizKey(quizDomain, question?.id)]
    const { score, box } = studyOrderKey(srs?.[itemIdOf(question)], { purpose: 'quiz', now, day })
    const stage = !result
      ? STUDY_ORDER_STAGE.fresh
      : result.lastResult !== 'wrong'
        ? STUDY_ORDER_STAGE.rest
        : dayOf(result.lastAt) === day
          ? STUDY_ORDER_STAGE.missedToday
          : STUDY_ORDER_STAGE.review
    return { stage, score, box }
  }, { rng })
}

/**
 * 出題順に並べた候補（rankForStudy などの結果）から limit 件を選び、出題順で返す。
 * 形式ごとの配分（quotas：形式 → 件数）は、今日の候補（0・1段）とそのほか（3段）の中で守る。
 * 今日「まだ」「不正解」になった項目（2段）は、配分より点数の低い順を優先する。
 * どの段でも、前の段の項目を残したまま後ろの段の項目を出すことはしない。
 */
export function pickInStudyOrder(
  ranked = [],
  limit = ranked.length,
  { groupOf = () => null, quotas = {} } = {},
) {
  const band = (entry) => Math.max(STUDY_ORDER_STAGE.fresh, entry.stage)
  const remaining = { ...quotas }
  const picked = new Set()
  const take = (entry) => {
    picked.add(entry)
    const key = groupOf(entry.item)
    if (remaining[key] > 0) remaining[key] -= 1
  }
  let start = 0
  while (start < ranked.length && picked.size < limit) {
    let end = start
    while (end < ranked.length && band(ranked[end]) === band(ranked[start])) end += 1
    const group = ranked.slice(start, end)
    if (band(ranked[start]) !== STUDY_ORDER_STAGE.missedToday) {
      for (const entry of group) {
        if (picked.size >= limit) break
        if (remaining[groupOf(entry.item)] > 0) take(entry)
      }
    }
    for (const entry of group) {
      if (picked.size >= limit) break
      if (!picked.has(entry)) take(entry)
    }
    start = end
  }
  return ranked.filter((entry) => picked.has(entry)).map(({ item }) => item)
}
