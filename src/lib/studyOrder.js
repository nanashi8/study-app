import {
  contentQuizKey,
  contentQuizMarks,
  normalizeContentQuizResults,
  quizStatusForSrsEntry,
} from './contentProgress.js'
import { REVIEW_TREND, reviewTrend } from './reviewHistory.js'
import { localDayIndex, vocabularyReviewMetrics } from './vocabScheduler.js'

// 暗記・テストで、どの項目から出すか。単語・熟語・文法・リスニング・書き取り・語源・古典・漢文・英作文・数学の歴史の
// どの教材も、この1つの決まりで並べる。段は、暗記とテストを通した直近の答えの傾向（reviewHistory.js）から決める。
//
//   0段 苦手：何度も「まだ」「不正解」をくり返している項目（最後がまちがいで、直近5回のうち2回以上まちがえた）。
//       今日まちがえた直後でも、次の回の先頭に出す
//   1段 復習：復習日を迎えた・忘れかけの項目（前の日に1回「まだ」「不正解」だった項目、苦手から立て直し中の項目を含む）
//   2段 まだ学習していない項目（暗記）・まだ答えていない項目（テスト）
//   3段 今日1回だけ「まだ」「不正解」になった項目（その日のうちは、今日の候補のあと）
//   4段 定着の確認：何度も・続けて「覚えた」「正解」になった項目（3回以上続けて成功、または直近5回のうち4回以上成功）で、
//       復習日を迎えたもの。定着の見込みが忘れかけの目安（vocabScheduler.js の RETENTION_REVIEW_THRESHOLD）を
//       下回ったら1段へ戻す（後回しは忘れかける前まで）
//   5段 そのほか（次の復習日を待っている項目）
//
// 0〜2段が今日の候補。定着した項目は、もう一方の活動（テストだけで続けて正解した項目の暗記など）でも
// 「未学習・未回答」として先に出さない。
// 同じ段の中は点数の低い順（vocabularyReviewMetrics の score。一覧の「復習のおすすめ順」と同じ点数）。
// 点数も同じ項目どうしは、呼び出すたびにシャッフルした順にする。
export const STUDY_ORDER_STAGE = Object.freeze({
  struggling: 0,
  review: 1,
  fresh: 2,
  missedToday: 3,
  steady: 4,
  rest: 5,
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
  const keyFor = (stage) => ({
    stage,
    score: metrics.score,
    box: Math.max(0, Number(entry?.box) || 0),
  })
  // 何度もまちがえている項目は、暗記でもテストでも、今日でもいちばん先。
  if (metrics.struggling) return keyFor(STUDY_ORDER_STAGE.struggling)
  const quizStatus = quizStatusForSrsEntry(entry)
  const untouched = purpose === 'quiz'
    ? quizStatus === 'unanswered'
    : metrics.learningStatus === 'unlearned'
  // 何度も・続けて覚えた・正解した項目は、もう一方の活動でまだ答えていなくても未学習・未回答として先に出さない。
  const fresh = untouched && !metrics.stable
  // 暗記の「まだ」も、テストの「不正解」も、その結果を今日つけたときだけ3段にする。
  const missedToday = (
    metrics.learningStatus === 'reviewing' && dayOf(entry?.memory?.lastAt) === day
  ) || (
    quizStatus === 'incorrect' && dayOf(entry?.test?.lastAt) === day
  )
  // 定着の確認（metrics.steady）は、復習の1段には入れず、今日の候補のあとに出す。
  const dueNow = metrics.needsReview && !metrics.coolingDown
  return keyFor(
    dueNow && !metrics.steady
      ? STUDY_ORDER_STAGE.review
      : fresh
        ? STUDY_ORDER_STAGE.fresh
        : missedToday
          ? STUDY_ORDER_STAGE.missedToday
          : dueNow
            ? STUDY_ORDER_STAGE.steady
            : STUDY_ORDER_STAGE.rest,
  )
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
 * 1項目に複数の問題がある教材（古典文法・古典常識・数学の歴史のテスト）。未回答・不正解は問題ごとの直近の結果
 * （contentQuizResults）で見て、点数はその問題が扱う項目の記録から出す。
 * 最後に間違えた問題のうち、その問題を何度も間違えている（直近5回のうち2回以上）か、扱う項目が苦手な問題は0段、
 * 前の日に間違えた問題は1段、まだ答えていない問題は2段、今日間違えた問題は3段、正解した問題は最後の段。
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
    const itemKey = studyOrderKey(srs?.[itemIdOf(question)], { purpose: 'quiz', now, day })
    const missed = result?.lastResult === 'wrong'
    const struggling = missed && (
      reviewTrend(contentQuizMarks(result)).kind === REVIEW_TREND.struggling
      || itemKey.stage === STUDY_ORDER_STAGE.struggling
    )
    const stage = !result
      ? STUDY_ORDER_STAGE.fresh
      : struggling
        ? STUDY_ORDER_STAGE.struggling
        : !missed
          ? STUDY_ORDER_STAGE.rest
          : dayOf(result.lastAt) === day
            ? STUDY_ORDER_STAGE.missedToday
            : STUDY_ORDER_STAGE.review
    return { stage, score: itemKey.score, box: itemKey.box }
  }, { rng })
}

/**
 * 出題順に並べた候補（rankForStudy などの結果）から limit 件を選び、出題順で返す。
 * 形式ごとの配分（quotas：形式 → 件数）は、今日の候補（復習の1段と未学習・未回答の2段）・定着の確認（4段）・
 * そのほか（5段）の中で守る。
 * 何度も間違えている項目（0段）と今日「まだ」「不正解」になった項目（3段）は、配分より点数の低い順を優先する。
 * どの段でも、前の段の項目を残したまま後ろの段の項目を出すことはしない。
 */
export function pickInStudyOrder(
  ranked = [],
  limit = ranked.length,
  { groupOf = () => null, quotas = {} } = {},
) {
  const band = (entry) => (
    entry.stage === STUDY_ORDER_STAGE.review ? STUDY_ORDER_STAGE.fresh : entry.stage
  )
  const inOrderOnly = new Set([STUDY_ORDER_STAGE.struggling, STUDY_ORDER_STAGE.missedToday])
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
    if (!inOrderOnly.has(band(ranked[start]))) {
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
