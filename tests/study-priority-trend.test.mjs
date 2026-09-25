import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ETYMOLOGY_PACKS, wordsByLevel, wordsByRoot } from '../src/data/vocab.js'
import { phrasesByLevel } from '../src/data/phrases.js'
import { grammarByLevel } from '../src/data/grammar.js'
import { buildListeningDeck, listeningByLevel } from '../src/data/listening.js'
import { buildDictationDeck, dictationByLevel } from '../src/data/dictation.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'
import {
  KOTEN_GRAMMAR_QUESTIONS,
  pickKotenGrammarQuestions,
} from '../src/data/koten-grammar-questions.js'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_BY_ID,
  KOTEN_CULTURE_QUESTIONS,
  pickKotenCultureQuestions,
} from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../src/data/kanbun-culture.js'
import { pickKanbunQuestions } from '../src/data/kanbun-content.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  pickKanbunKundokuExercises,
} from '../src/data/kanbun-kundoku.js'
import { WRITING_GRAMMAR } from '../src/data/writing.js'
import {
  MATH_HISTORY_CHAPTERS,
  MATH_HISTORY_QUIZ_DOMAIN,
  questionsForChapters,
} from '../src/data/math-history.js'
import { contentQuizMarks, normalizeContentQuizResults, recordContentQuizResult } from '../src/lib/contentProgress.js'
import { buildGrammarDeck, grammarVariationKey } from '../src/lib/grammarDeck.js'
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import { learningContentCatalogRows } from '../src/lib/learningContentCatalog.js'
import { buildStudyCompletionReport } from '../src/lib/learningAnalyticsReport.js'
import { etymologyCardPriorityRank, nextWordsForRoot } from '../src/lib/etymologyProgress.js'
import {
  REVIEW_MARK_LIMIT,
  recentMarksForEntry,
  reviewTrend,
} from '../src/lib/reviewHistory.js'
import { LONG_TERM_SRS_BOX, SRS_INTERVAL_DAYS } from '../src/lib/srs.js'
import {
  automaticVocabSessionPlan,
  buildDeck,
  buildPhraseDeck,
} from '../src/lib/session.js'
import {
  STUDY_ORDER_STAGE,
  orderForStudy,
  pickInStudyOrder,
  rankQuestionsForStudy,
  studyOrderKey,
} from '../src/lib/studyOrder.js'
import { vocabularyCatalogRows } from '../src/lib/vocabCatalog.js'
import { vocabMixFreshShare } from '../src/lib/vocabMix.js'
import {
  RETENTION_REVIEW_THRESHOLD,
  localDayIndex,
  vocabularyReviewMetrics,
} from '../src/lib/vocabScheduler.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { isDue, todayIndex, useStore } from '../src/store/useStore.js'

// 利用者の依頼（requests/2026-09-25-study-priority-trend.json）を守るテスト。
//   何度も「まだ」「不正解」をくり返す項目は最上位でしつこく、続けて覚えた・正解した項目は後回し、
//   答えの傾向が変われば出す間隔も変える。
// 記録はすべて実際の書き込み口（ストアの review 系の操作）で作る。

const DAY_MS = 86_400_000
const NOW = new Date(2026, 8, 20, 12, 0, 0, 0).getTime()
const DAY = todayIndex(NOW)
const idsOf = (items) => items.map((item) => item.id)
const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

// 学習記録の全10種類と、それぞれへ書くストアの操作。
const WRITERS = Object.freeze({
  srs: (id, result) => useStore.getState().review(id, result, 'vocab'),
  etymologySrs: (id, result) => useStore.getState().reviewEtymology(id, result),
  kotenSrs: (id, result) => useStore.getState().reviewKoten(id, result),
  kotenGrammarSrs: (id, result) => useStore.getState().reviewKotenGrammar(id, result),
  kotenCultureSrs: (id, result) => useStore.getState().reviewKotenCulture(id, result),
  kotenInterpretationSrs: (id, result) => useStore.getState().reviewKotenInterpretation(id, result),
  kanbunVocabSrs: (id, result) => useStore.getState().reviewKanbun('vocab', id, result),
  kanbunGrammarSrs: (id, result) => useStore.getState().reviewKanbun('grammar', id, result),
  kanbunCultureSrs: (id, result) => useStore.getState().reviewKanbun('culture', id, result),
  kanbunKundokuSrs: (id, result) => useStore.getState().reviewKanbunKundoku(id, result),
})
const FIELDS = Object.keys(WRITERS)

// ストアを使う間だけ時計を止める。
function withStore(run) {
  const original = useStore.getState()
  const realNow = Date.now
  try {
    return run((timestamp) => { Date.now = () => timestamp })
  } finally {
    Date.now = realNow
    useStore.setState(original, true)
  }
}

// events: [何日前, 結果, 何分前] を古い順に。実際の書き込み口で記録した1件を返す。
function recordedEntry(field, events, { id = 'fixture' } = {}) {
  return withStore((setNow) => {
    useStore.setState({ [field]: {} })
    for (const [daysAgo, result, minutesAgo = 0] of events) {
      setNow(NOW - daysAgo * DAY_MS - minutesAgo * 60_000)
      WRITERS[field](id, result)
    }
    return useStore.getState()[field][id]
  })
}

// 1つの教材で使う記録の役（暗記は「覚えた／まだ」、テストは「正解／不正解」で答える）。
function roleEntries(field, purpose) {
  const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
  const hit = purpose === 'quiz' ? 'correct' : 'remembered'
  return {
    // 何度もまちがえている（今日2回）。
    strugglingToday: recordedEntry(field, [[0, miss, 90], [0, miss, 30]]),
    // 何度もまちがえている（前の日から続けて）。
    strugglingBefore: recordedEntry(field, [[2, miss], [1, miss]]),
    // 点数がとても低い、以前の保存の復習（段だけで苦手より後ろになることを確かめる）。
    lowScoreReview: { box: 0, correct: 0, wrong: 12, due: DAY - 20, last: DAY - 20, lastAt: NOW - 20 * DAY_MS },
    // 前の日に1回だけまちがえた。
    missedYesterday: recordedEntry(field, [[1, miss]]),
    // 今日1回だけまちがえた。
    missedToday: recordedEntry(field, [[0, miss, 30]]),
    // 続けて覚えた・正解した（定着。きのう3回、まだ忘れかけていない）。
    stable: recordedEntry(field, [[1, hit, 90], [1, 'correct', 60], [1, hit, 30]]),
  }
}

// 教材の項目 ids へ役を割り当てる。役のない項目は、まだ学んでいない（答えていない）項目。
function assignRoles(ids, field, purpose) {
  const entries = roleEntries(field, purpose)
  const names = Object.keys(entries)
  assert.ok(ids.length >= names.length + 3, `${field}: 素材の項目数`)
  const srs = {}
  const role = {}
  names.forEach((name, index) => {
    srs[ids[index]] = entries[name]
    role[name] = ids[index]
  })
  const fresh = ids.slice(names.length)
  return { srs, role, fresh }
}

function assertStrugglingFirst(orderedIds, strugglingIds, label) {
  assert.deepEqual(
    new Set(orderedIds.slice(0, strugglingIds.length)),
    new Set(strugglingIds),
    `${label}: 何度もまちがえている項目がいちばん先`,
  )
}

function assertStableDeferred(orderedIds, { role, fresh }, label) {
  const at = (id) => orderedIds.indexOf(id)
  assert.ok(at(role.stable) >= 0, `${label}: 定着の項目も並びに残る`)
  const presentFresh = fresh.filter((id) => at(id) >= 0)
  assert.ok(presentFresh.length > 0, `${label}: 未学習・未回答の項目`)
  assert.ok(presentFresh.every((id) => at(id) < at(role.stable)), `${label}: 定着は未学習・未回答より後ろ`)
  assert.ok(at(role.missedToday) < at(role.stable), `${label}: 定着は今日1回まちがえた項目より後ろ`)
  assert.ok(at(role.lowScoreReview) < at(fresh[0]), `${label}: 復習は未学習・未回答より先`)
}

// 文法は同型を1問に束ねるので、型の違う問題を選ぶ。
function distinctGrammarIds(items, count) {
  const keys = new Set()
  const ids = []
  for (const item of items) {
    const key = grammarVariationKey(item)
    if (keys.has(key)) continue
    keys.add(key)
    ids.push(item.id)
    if (ids.length === count) break
  }
  return ids
}

// 暗記・テストの全21画面の出題口（tests/study-order.test.mjs の21画面と同じ呼び方）。
// order は並べた全項目の id、purpose は暗記（study）かテスト（quiz）。
const ITEM_SCREENS = [
  {
    label: '英単語の暗記（VocabStudy・級）',
    purpose: 'study',
    field: 'srs',
    ids: idsOf(wordsByLevel('3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildDeck({ type: 'mylist', ids }, { srs, size: 0, purpose: 'study', now: NOW, day: DAY })),
  },
  {
    label: '英単語のテスト（VocabQuiz）',
    purpose: 'quiz',
    field: 'srs',
    ids: idsOf(wordsByLevel('3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildDeck({ type: 'mylist', ids }, { srs, size: 0, purpose: 'quiz', now: NOW, day: DAY })),
  },
  {
    label: '熟語・構文の暗記（PhraseStudy）',
    purpose: 'study',
    field: 'srs',
    ids: idsOf(phrasesByLevel('idiom', '3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildPhraseDeck({ type: 'phraseList', ids }, { srs, size: 0, purpose: 'study', now: NOW })),
  },
  {
    label: '熟語・構文のテスト（PhraseQuiz）',
    purpose: 'quiz',
    field: 'srs',
    ids: idsOf(phrasesByLevel('idiom', '3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildPhraseDeck({ type: 'phraseList', ids }, { srs, size: 0, purpose: 'quiz', now: NOW })),
  },
  {
    label: '英文法のテスト（GrammarQuiz）',
    purpose: 'quiz',
    field: 'srs',
    ids: distinctGrammarIds(grammarByLevel('3'), 14),
    order: (srs, ids) => idsOf(buildGrammarDeck({ type: 'grammarList', ids }, { srs, size: 0, day: DAY, now: NOW })),
  },
  {
    label: 'リスニング（ListeningQuiz）',
    purpose: 'quiz',
    field: 'srs',
    ids: idsOf(listeningByLevel('3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildListeningDeck({ type: 'listeningList', ids }, { srs, size: 0, now: NOW })),
  },
  {
    label: '書き取り（DictationPlay）',
    purpose: 'quiz',
    field: 'srs',
    ids: idsOf(dictationByLevel('3')).slice(0, 14),
    order: (srs, ids) => idsOf(buildDictationDeck({ type: 'dictationList', ids }, { srs, size: 0, now: NOW })),
  },
  {
    label: '語源カードの暗記（EtymologyStudy）',
    purpose: 'study',
    field: 'etymologySrs',
    ids: idsOf(ETYMOLOGY_PACKS).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'study', now: NOW }).map((item) => item.id),
  },
  {
    label: '語源カードのテスト（EtymologyQuiz）',
    purpose: 'quiz',
    field: 'etymologySrs',
    ids: idsOf(ETYMOLOGY_PACKS).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'quiz', now: NOW }).map((item) => item.id),
  },
  {
    label: '古典単語の暗記（KotenStudy）',
    purpose: 'study',
    field: 'kotenSrs',
    ids: idsOf(KOTEN_WORDS).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'study', now: NOW }).map((item) => item.id),
  },
  {
    label: '古典単語のテスト（KotenQuiz）',
    purpose: 'quiz',
    field: 'kotenSrs',
    ids: idsOf(KOTEN_WORDS).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'quiz', now: NOW }).map((item) => item.id),
  },
  {
    label: '古典文法の暗記（KotenGrammarStudy）',
    purpose: 'study',
    field: 'kotenGrammarSrs',
    ids: idsOf(KOTEN_GRAMMAR).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'study', now: NOW }).map((item) => item.id),
  },
  {
    label: '古典常識の暗記（KotenCultureStudy）',
    purpose: 'study',
    field: 'kotenCultureSrs',
    ids: idsOf(KOTEN_CULTURE).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'study', now: NOW }).map((item) => item.id),
  },
  {
    label: '古文の短文解釈（KotenInterpretationQuiz）',
    purpose: 'quiz',
    field: 'kotenInterpretationSrs',
    ids: idsOf(KOTEN_INTERPRETATIONS).slice(0, 14),
    order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'quiz', now: NOW }).map((item) => item.id),
  },
  ...[
    ['vocab', 'kanbunVocabSrs', KANBUN_VOCAB, '漢語'],
    ['grammar', 'kanbunGrammarSrs', KANBUN_GRAMMAR, '漢文法'],
    ['culture', 'kanbunCultureSrs', KANBUN_CULTURE, '漢文常識'],
  ].flatMap(([domain, field, items, name]) => [
    {
      label: `${name}の暗記（KanbunStudy）`,
      purpose: 'study',
      field,
      ids: idsOf(items).slice(0, 14),
      order: (srs, ids) => orderForStudy(ids.map((id) => ({ id })), srs, { purpose: 'study', now: NOW }).map((item) => item.id),
    },
    {
      label: `${name}のテスト（KanbunQuiz）`,
      purpose: 'quiz',
      field,
      ids: idsOf(items).slice(0, 14),
      order: (srs, ids) => pickKanbunQuestions(domain, ids, { srs, size: ids.length, now: NOW })
        .map((question) => question.itemId),
    },
  ]),
  {
    label: '返り点（KanbunKundokuQuiz）',
    purpose: 'quiz',
    field: 'kanbunKundokuSrs',
    ids: idsOf(KANBUN_KUNDOKU_EXERCISES).slice(0, 14),
    order: (srs, ids) => idsOf(pickKanbunKundokuExercises(ids, { srs, size: ids.length, now: NOW })),
  },
  {
    label: '英作文の文法の復習（WritingGrammarReview）',
    purpose: 'study',
    field: 'srs',
    ids: idsOf(WRITING_GRAMMAR).slice(0, 14),
    order: (srs, ids) => {
      const items = ids.map((id) => ({ id }))
      const due = items.filter((item) => isDue(srs[item.id], DAY))
      return orderForStudy(due.length ? due : items, srs, { purpose: 'study', rng: null, now: NOW })
        .map((item) => item.id)
    },
  },
]

// 1項目に複数の問題がある3画面（古典文法・古典常識・数学の歴史のテスト）。
const QUESTION_SCREENS = [
  {
    label: '古典文法のテスト（KotenGrammarQuiz）',
    domain: 'koten-grammar',
    field: 'kotenGrammarSrs',
    questions: KOTEN_GRAMMAR_QUESTIONS,
    itemOf: (question) => question.grammarIds.find((id) => KOTEN_GRAMMAR_BY_ID[id]),
    pick: (itemIds, { srs, quizResults }) => pickKotenGrammarQuestions(itemIds, { size: 12, srs, quizResults, now: NOW }),
  },
  {
    label: '古典常識のテスト（KotenCultureQuiz）',
    domain: 'koten-culture',
    field: 'kotenCultureSrs',
    questions: KOTEN_CULTURE_QUESTIONS,
    itemOf: (question) => question.cultureIds.find((id) => KOTEN_CULTURE_BY_ID[id]),
    pick: (itemIds, { srs, quizResults }) => pickKotenCultureQuestions(itemIds, { size: 12, srs, quizResults, now: NOW }),
  },
  {
    label: '数学の歴史のテスト（MathStoryQuiz）',
    domain: MATH_HISTORY_QUIZ_DOMAIN,
    field: null,
    questions: questionsForChapters(MATH_HISTORY_CHAPTERS.map((chapter) => chapter.id)),
    itemOf: () => null,
    pick: (_itemIds, { quizResults }) => pickInStudyOrder(
      rankQuestionsForStudy(questionsForChapters(MATH_HISTORY_CHAPTERS.map((chapter) => chapter.id)), {
        quizResults,
        quizDomain: MATH_HISTORY_QUIZ_DOMAIN,
        now: NOW,
      }),
      12,
    ),
  },
]

test('全21画面の出題口を数える（最上位・後回しの確かめの母集団）', () => {
  const screens = new Set([
    ...ITEM_SCREENS.map((screen) => /（(\w+)/.exec(screen.label)[1]),
    ...QUESTION_SCREENS.map((screen) => /（(\w+)/.exec(screen.label)[1]),
  ])
  assert.equal(screens.size, 21)
})

// ── 直近の答え ─────────────────────────────────────────

test('直近の答え：暗記とテストを通して答えた順に5回まで残し、全10種類の記録で同じ', () => {
  assert.equal(REVIEW_MARK_LIMIT, 5)
  for (const field of FIELDS) {
    const entry = recordedEntry(field, [
      [3, 'remembered'], [3, 'wrong'], [2, 'correct'], [2, 'forgot'], [1, 'correct'], [0, 'remembered'],
    ])
    assert.deepEqual(entry.recent, [0, 1, 0, 1, 1], `${field}: 暗記とテストを通した直近5回`)
    assert.deepEqual(entry.memory.marks, [1, 0, 1], `${field}: 暗記の○×はそのまま`)
    assert.deepEqual(entry.test.marks, [0, 1, 1], `${field}: テストの○×はそのまま`)
    assert.deepEqual(recentMarksForEntry(entry), [0, 1, 0, 1, 1])
  }
})

test('直近の答え：recent のない以前の記録は、暗記・テストの○×を最後に答えた側が後ろになるようにつないで読む', () => {
  const legacy = {
    box: 2,
    due: DAY,
    lastAt: NOW - DAY_MS,
    memory: { lastAt: NOW - 3 * DAY_MS, lastJudgment: 'forgot', marks: [1, 0] },
    test: { lastAt: NOW - DAY_MS, lastResult: 'correct', marks: [1, 1, 0, 1] },
  }
  assert.deepEqual(recentMarksForEntry(legacy), [0, 1, 1, 0, 1])
  assert.deepEqual(recentMarksForEntry({ memory: { lastJudgment: 'forgot' } }), [0])
  assert.deepEqual(recentMarksForEntry(undefined), [])
  // 次に答えると、組み立てた並びの後ろへ足して recent に残す。
  const next = withStore((setNow) => {
    useStore.setState({ srs: { word: legacy } })
    setNow(NOW)
    useStore.getState().review('word', 'wrong', 'vocab')
    return useStore.getState().srs.word
  })
  assert.deepEqual(next.recent, [1, 1, 0, 1, 0])
})

test('直近の答え：選び直し・進捗コード・クラウド同期で保たれる', () => {
  withStore((setNow) => {
    useStore.setState({ srs: {} })
    setNow(NOW - 60 * 60_000)
    useStore.getState().review('word', 'forgot', 'vocab')
    setNow(NOW)
    const receipt = useStore.getState().review('word', 'wrong', 'vocab')
    assert.deepEqual(useStore.getState().srs.word.recent, [0, 0])
    // 選び直すと、その1回だけを入れかえる（二重に足さない）。
    useStore.getState().reviseReview(receipt, 'correct')
    assert.deepEqual(useStore.getState().srs.word.recent, [0, 1])

    const decoded = decodeProgress(encodeProgress(useStore.getState()))
    assert.deepEqual(decoded.srs.word.recent, [0, 1])
    const cloud = progressStateFromCloud({ srs: decoded.srs }, useStore.getState())
    assert.deepEqual(cloud.srs.word.recent, [0, 1])
  })
})

test('直近の答え：問題ごとの結果にも直近5回の○×を残し、以前の保存は最後の結果から読む', () => {
  let results = {}
  for (const correct of [1, 0, 0, 1, 0, 1]) {
    results = recordContentQuizResult(results, {
      domain: MATH_HISTORY_QUIZ_DOMAIN, itemId: 'question', correct, total: 1, timestamp: NOW,
    })
  }
  const key = `${MATH_HISTORY_QUIZ_DOMAIN}:question`
  assert.deepEqual(results[key].marks, [0, 0, 1, 0, 1])
  assert.deepEqual(normalizeContentQuizResults(results)[key].marks, [0, 0, 1, 0, 1])
  assert.deepEqual(contentQuizMarks({ correct: 0, total: 1, lastResult: 'wrong' }), [0])
  assert.deepEqual(contentQuizMarks({ correct: 1, total: 1, lastResult: 'correct' }), [1])

  withStore((setNow) => {
    useStore.setState({ contentQuizResults: {} })
    setNow(NOW)
    useStore.getState().recordContentQuizResult('koten-grammar', 'q', 0, 1)
    useStore.getState().recordContentQuizResult('koten-grammar', 'q', 0, 1)
    assert.deepEqual(useStore.getState().contentQuizResults['koten-grammar:q'].marks, [0, 0])
    const decoded = decodeProgress(encodeProgress(useStore.getState()))
    assert.deepEqual(decoded.contentQuizResults['koten-grammar:q'].marks, [0, 0])
  })
})

// ── 苦手（何度もまちがえている）を最上位に ─────────────────────

test('答えの傾向：苦手・立て直し中・定着の決まり', () => {
  const kind = (marks) => reviewTrend(marks).kind
  assert.equal(kind([0, 0]), 'struggling')
  assert.equal(kind([0, 1, 0]), 'struggling')
  assert.equal(kind([1, 1, 1, 1, 0]), null, '続けて覚えていた項目の1回のまちがいは苦手ではない')
  assert.equal(kind([0]), null)
  assert.equal(kind([0, 0, 1]), 'recovering')
  assert.equal(kind([0, 0, 1, 1]), 'recovering')
  assert.equal(kind([0, 0, 1, 1, 1]), 'stable', '3回続けて成功')
  assert.equal(kind([1, 1, 0, 1, 1]), 'stable', '直近5回のうち4回成功')
  assert.equal(kind([1, 1]), null)
  assert.equal(kind([]), null)
})

test('最上位：何度もまちがえている項目は、暗記・テストの全画面でいちばん先（点数の低い復習より先、今日まちがえた直後も）', () => {
  for (const screen of ITEM_SCREENS) {
    const assigned = assignRoles(screen.ids, screen.field, screen.purpose)
    // 点数だけなら、以前の保存の復習のほうが先になる。段で苦手を先にしていることを確かめる。
    const scoreOf = (id) => vocabularyReviewMetrics(assigned.srs[id], { now: NOW, day: DAY }).score
    assert.ok(scoreOf(assigned.role.lowScoreReview) < scoreOf(assigned.role.strugglingToday), `${screen.label}: 素材の点数`)
    const ordered = screen.order(assigned.srs, screen.ids)
    assertStrugglingFirst(
      ordered,
      [assigned.role.strugglingToday, assigned.role.strugglingBefore],
      screen.label,
    )
  }
})

test('最上位：1項目に複数の問題がある3画面も、何度も間違えている問題・苦手な項目の問題をいちばん先に出す', () => {
  for (const screen of QUESTION_SCREENS) {
    const byItem = new Map()
    for (const question of screen.questions) {
      const item = screen.itemOf(question) ?? question.id
      if (!byItem.has(item)) byItem.set(item, question)
    }
    const picked = [...byItem.values()].slice(0, 6)
    const [repeated, itemStruggling, yesterday] = picked
    let quizResults = {}
    const answer = (question, correct, timestamp) => {
      quizResults = recordContentQuizResult(quizResults, {
        domain: screen.domain, itemId: question.id, correct, total: 1, timestamp,
      })
    }
    // 同じ問題を2回続けて間違えた（今日）。
    answer(repeated, 0, NOW - 90 * 60_000)
    answer(repeated, 0, NOW - 30 * 60_000)
    // 前の日に1回だけ間違えた。
    answer(yesterday, 0, NOW - DAY_MS)
    const srs = {}
    const expected = [repeated.id]
    if (screen.field) {
      // 問題は1回だけ間違えたが、扱う項目を暗記で何度もまちがえている。
      answer(itemStruggling, 0, NOW - 60 * 60_000)
      srs[screen.itemOf(itemStruggling)] = recordedEntry(screen.field, [[1, 'forgot'], [0, 'forgot', 120]])
      expected.push(itemStruggling.id)
    }
    const itemIds = picked.map((question) => screen.itemOf(question)).filter(Boolean)
    const deck = screen.pick(itemIds, { srs, quizResults })
    assertStrugglingFirst(idsOf(deck), expected, screen.label)
    // 前の日に1回だけ間違えた問題は、苦手のすぐあと（未回答より先）。
    if (idsOf(deck).includes(yesterday.id)) {
      assert.equal(idsOf(deck).indexOf(yesterday.id), expected.length, `${screen.label}: 前の日に間違えた問題`)
    }
  }
})

test('最上位：英単語は級・分野の自動の回、出題バランスの目盛り、今日の復習、先取り復習、語根、単語帳のどれでも苦手をいちばん先に出す', () => {
  const words = wordsByLevel('3')
  for (const purpose of ['study', 'quiz']) {
    const assigned = assignRoles(idsOf(words), 'srs', purpose)
    const struggling = [assigned.role.strugglingToday, assigned.role.strugglingBefore]
    const options = { srs: assigned.srs, size: 10, purpose, now: NOW, day: DAY }
    assertStrugglingFirst(idsOf(buildDeck({ type: 'level', levelId: '3' }, options)), struggling, `${purpose}・級`)
    assertStrugglingFirst(idsOf(buildDeck({ type: 'all' }, options)), struggling, `${purpose}・全語`)
    for (const mix of ['review-only', 'review-heavy', 'even', 'fresh-heavy']) {
      assertStrugglingFirst(
        idsOf(buildDeck({ type: 'level', levelId: '3' }, { ...options, freshShareOverride: vocabMixFreshShare(mix) })),
        struggling,
        `${purpose}・出題バランス ${mix}`,
      )
    }
    assertStrugglingFirst(idsOf(buildDeck({ type: 'due' }, options)), struggling, `${purpose}・今日の復習`)
    assertStrugglingFirst(idsOf(buildDeck({ type: 'review' }, options)), struggling, `${purpose}・先取り復習`)
    assertStrugglingFirst(
      idsOf(buildDeck({ type: 'mylist', ids: [...idsOf(words)].reverse().slice(-20) }, options)),
      struggling,
      `${purpose}・単語帳`,
    )
  }
  // 語根：同じ語根（port）の語で確かめる。
  const rootWords = wordsByRoot('port')
  assert.ok(rootWords.length >= 3, '語根 port の語')
  for (const purpose of ['study', 'quiz']) {
    const srs = { [rootWords[2].id]: recordedEntry('srs', [[0, purpose === 'quiz' ? 'wrong' : 'forgot', 90], [0, 'wrong', 30]]) }
    const deck = buildDeck({ type: 'root', rootId: 'port' }, { srs, size: 10, purpose, now: NOW, day: DAY })
    assert.equal(deck[0].id, rootWords[2].id, `${purpose}・語根`)
  }
})

test('最上位：級別の混合テスト（文法の形式の巡回）・リスニングの形式の配分より先に苦手を出す', () => {
  const grammarItems = grammarByLevel('3')
  const grammarIds = distinctGrammarIds(grammarItems, 14)
  const grammar = assignRoles(grammarIds, 'srs', 'quiz')
  const grammarDeck = buildGrammarDeck({ type: 'grammar', level: '3' }, { srs: grammar.srs, size: 10, day: DAY, now: NOW })
  assertStrugglingFirst(idsOf(grammarDeck), [grammar.role.strugglingToday, grammar.role.strugglingBefore], '文法・級')

  const practice = buildGrammarDeck({ type: 'grammar', level: '3', questionType: 'mixed' }, { srs: {}, size: 0, day: DAY, now: NOW })
  const mixedIds = distinctGrammarIds(practice, 14)
  const mixed = assignRoles(mixedIds, 'srs', 'quiz')
  const mixedDeck = buildGrammarDeck({ type: 'grammar', level: '3', questionType: 'mixed' }, { srs: mixed.srs, size: 10, day: DAY, now: NOW })
  assertStrugglingFirst(idsOf(mixedDeck), [mixed.role.strugglingToday, mixed.role.strugglingBefore], '文法・混合')

  const listening = assignRoles(idsOf(listeningByLevel('3')), 'srs', 'quiz')
  const listeningDeck = buildListeningDeck({ type: 'level', levelId: '3' }, { srs: listening.srs, size: 10, now: NOW })
  assertStrugglingFirst(idsOf(listeningDeck), [listening.role.strugglingToday, listening.role.strugglingBefore], 'リスニング・級')

  const phrase = assignRoles(idsOf(phrasesByLevel('idiom', '3')), 'srs', 'study')
  const phraseDeck = buildPhraseDeck({ type: 'phrase', kind: 'idiom', levelId: '3' }, { srs: phrase.srs, size: 10, purpose: 'study', now: NOW })
  assertStrugglingFirst(idsOf(phraseDeck), [phrase.role.strugglingToday, phrase.role.strugglingBefore], '熟語・級')
  const phraseDue = buildPhraseDeck({ type: 'phraseDue', kind: 'idiom' }, { srs: phrase.srs, size: 10, purpose: 'study', now: NOW })
  assertStrugglingFirst(idsOf(phraseDue), [phrase.role.strugglingToday, phrase.role.strugglingBefore], '熟語・今日の復習')
})

// ── しつこく出す ─────────────────────────────────────────

test('しつこく：何度もまちがえたら段階0・復習日を今日にし、正解しても3回続けて成功するまで毎日出す（全10種類）', () => {
  for (const field of FIELDS) {
    withStore((setNow) => {
      useStore.setState({ [field]: {} })
      const answer = (daysAgo, result, minutesAgo = 0) => {
        setNow(NOW - daysAgo * DAY_MS - minutesAgo * 60_000)
        WRITERS[field]('item', result)
        return useStore.getState()[field].item
      }
      answer(0, 'correct', 300)
      answer(0, 'correct', 240)
      let entry = answer(0, 'wrong', 120)
      assert.equal(vocabularyReviewMetrics(entry, { now: NOW, day: DAY }).struggling, false, `${field}: 1回目のまちがいは苦手ではない`)
      entry = answer(0, 'forgot', 60)
      const metrics = vocabularyReviewMetrics(entry, { now: NOW, day: DAY })
      assert.equal(entry.box, 0, `${field}: 段階0`)
      assert.equal(entry.due, DAY, `${field}: 復習日は今日`)
      assert.equal(metrics.struggling, true, `${field}: 苦手`)
      assert.equal(metrics.coolingDown, false, `${field}: 同じ日でも待たせない`)
      assert.equal(metrics.shouldAutoAppear, true, `${field}: 今日の候補`)
      // 同じ日の次の回でも、未学習・未回答の項目より先に出す。
      for (const purpose of ['study', 'quiz']) {
        const srs = useStore.getState()[field]
        const order = orderForStudy(['a', 'b', 'item', 'c'].map((id) => ({ id })), srs, { purpose, now: NOW, day: DAY })
        assert.equal(order[0].id, 'item', `${field}・${purpose}: 次の回の先頭`)
      }

      // 立て直し中：正解しても、3回続けて成功するまでは翌日にまた出す。
      entry = answer(0, 'correct', 30)
      assert.equal(entry.box <= 1, true, `${field}: 立て直し中は段階1まで`)
      assert.equal(entry.due, DAY + 1, `${field}: 立て直し中は翌日`)
      setNow(NOW + DAY_MS)
      WRITERS[field]('item', 'remembered')
      entry = useStore.getState()[field].item
      assert.equal(entry.due, DAY + 2, `${field}: 2回続けて成功しても翌日`)
      setNow(NOW + 2 * DAY_MS)
      WRITERS[field]('item', 'correct')
      entry = useStore.getState()[field].item
      assert.ok(entry.due > DAY + 3, `${field}: 3回続けて成功したら間隔をのばす（${entry.due - DAY - 2}日後）`)
      assert.equal(vocabularyReviewMetrics(entry, { now: NOW + 2 * DAY_MS, day: DAY + 2 }).stable, true)
    })
  }
})

test('しつこく：英単語の自動の回では、苦手の語を今日の次の回の先頭にまとめて出し、新しい語より先にする', () => {
  const words = wordsByLevel('pre2')
  const struggling = words.slice(0, 4)
  const srs = Object.fromEntries(struggling.map((word) => [
    word.id,
    recordedEntry('srs', [[0, 'forgot', 90], [0, 'forgot', 30]]),
  ]))
  for (const purpose of ['study', 'quiz']) {
    const deck = buildDeck({ type: 'level', levelId: 'pre2' }, { srs, size: 10, purpose, now: NOW, day: DAY })
    assert.deepEqual(new Set(idsOf(deck.slice(0, 4))), new Set(idsOf(struggling)), `${purpose}: 苦手の語を先頭にまとめる`)
    assert.equal(deck.length, 10)
    assert.ok(deck.slice(4).some((word) => !srs[word.id]), `${purpose}: 新しい語も混ぜる`)
  }
})

// ── 定着は後回し ─────────────────────────────────────────

test('後回し：続けて覚えた・正解した項目は、暗記・テストの全画面で未学習・未回答と今日1回まちがえた項目より後ろ', () => {
  for (const screen of ITEM_SCREENS) {
    const assigned = assignRoles(screen.ids, screen.field, screen.purpose)
    assert.equal(
      vocabularyReviewMetrics(assigned.srs[assigned.role.stable], { now: NOW, day: DAY }).steady,
      true,
      `${screen.label}: 素材は定着の確認`,
    )
    assertStableDeferred(screen.order(assigned.srs, screen.ids), assigned, screen.label)
  }
})

test('後回し：1項目に複数の問題がある3画面も、続けて正解した問題は未回答・間違えた問題より後ろ', () => {
  for (const screen of QUESTION_SCREENS) {
    const [steady, missed, ...rest] = screen.questions
    let quizResults = {}
    for (const minutesAgo of [300, 200, 100]) {
      quizResults = recordContentQuizResult(quizResults, {
        domain: screen.domain, itemId: steady.id, correct: 1, total: 1, timestamp: NOW - DAY_MS - minutesAgo * 60_000,
      })
    }
    quizResults = recordContentQuizResult(quizResults, {
      domain: screen.domain, itemId: missed.id, correct: 0, total: 1, timestamp: NOW - DAY_MS,
    })
    const ranked = rankQuestionsForStudy(screen.questions, {
      quizResults,
      quizDomain: screen.domain,
      itemIdOf: screen.itemOf,
      now: NOW,
    })
    const order = ranked.map(({ item }) => item.id)
    const at = (id) => order.indexOf(id)
    assert.ok(rest.length > 0)
    assert.ok(at(missed.id) < at(steady.id), `${screen.label}: 間違えた問題より後ろ`)
    assert.ok(rest.every((question) => at(question.id) < at(steady.id)), `${screen.label}: 未回答より後ろ`)
  }
})

test('後回し：テストだけで続けて正解した項目は暗記で「未学習」として、暗記だけで続けて覚えた項目はテストで「未回答」として先に出さない', () => {
  const testOnly = recordedEntry('srs', [[5, 'correct'], [4, 'correct'], [2, 'correct']])
  const memoryOnly = recordedEntry('srs', [[5, 'remembered'], [4, 'remembered'], [2, 'remembered']])
  assert.notEqual(studyOrderKey(testOnly, { purpose: 'study', now: NOW, day: DAY }).stage, STUDY_ORDER_STAGE.fresh)
  assert.notEqual(studyOrderKey(memoryOnly, { purpose: 'quiz', now: NOW, day: DAY }).stage, STUDY_ORDER_STAGE.fresh)
  // 1回だけ覚えた項目は、テストではこれまでどおり未回答として出す。
  const once = recordedEntry('srs', [[0, 'remembered', 30]])
  assert.equal(studyOrderKey(once, { purpose: 'quiz', now: NOW, day: DAY }).stage, STUDY_ORDER_STAGE.fresh)

  // 英単語の自動の回：未学習の語が残るうちは、テストだけで続けて正解した語を暗記に出さない。
  const words = wordsByLevel('3')
  const srs = { [words[0].id]: testOnly, [words[1].id]: memoryOnly }
  const study = idsOf(buildDeck({ type: 'level', levelId: '3' }, { srs, size: 10, purpose: 'study', now: NOW, day: DAY }))
  const quiz = idsOf(buildDeck({ type: 'level', levelId: '3' }, { srs, size: 10, purpose: 'quiz', now: NOW, day: DAY }))
  assert.equal(study.includes(words[0].id), false, '暗記：テストで続けて正解した語は後回し')
  assert.equal(quiz.includes(words[1].id), false, 'テスト：暗記で続けて覚えた語は後回し')
})

test('後回し：同じ日に続けて覚えた・正解した語も、翌日の自動の回で新しい語より後ろ', () => {
  const words = wordsByLevel('3')
  const streak = recordedEntry('srs', [[1, 'remembered', 90], [1, 'correct', 60], [1, 'correct', 30]])
  const srs = { [words[0].id]: streak }
  for (const purpose of ['study', 'quiz']) {
    const deck = idsOf(buildDeck({ type: 'level', levelId: '3' }, { srs, size: 10, purpose, now: NOW, day: DAY }))
    assert.equal(deck.includes(words[0].id), false, `${purpose}: 翌日すぐには出さない`)
  }
})

// ── 後回しは忘れかける前まで ─────────────────────────────────

test('忘れかける前：定着の項目も、定着の見込みが忘れかけの目安を下回ったら復習の段に戻り、未学習・未回答より先に出る', () => {
  assert.equal(RETENTION_REVIEW_THRESHOLD, 0.56)
  const stable = recordedEntry('srs', [[1, 'remembered', 90], [1, 'correct', 60], [1, 'remembered', 30]])
  for (const purpose of ['study', 'quiz']) {
    const today = vocabularyReviewMetrics(stable, { now: NOW, day: DAY })
    assert.ok(today.retention >= RETENTION_REVIEW_THRESHOLD)
    assert.equal(studyOrderKey(stable, { purpose, now: NOW, day: DAY }).stage, STUDY_ORDER_STAGE.steady)
    const later = NOW + 2 * DAY_MS
    const laterMetrics = vocabularyReviewMetrics(stable, { now: later, day: DAY + 2 })
    assert.ok(laterMetrics.retention < RETENTION_REVIEW_THRESHOLD)
    assert.equal(laterMetrics.steady, false)
    assert.equal(studyOrderKey(stable, { purpose, now: later, day: DAY + 2 }).stage, STUDY_ORDER_STAGE.review)
  }
  // 自動の回の「復習のたまり具合」にも数える。
  const words = wordsByLevel('4')
  const srs = Object.fromEntries(words.slice(0, 20).map((word) => [word.id, stable]))
  const plan = automaticVocabSessionPlan(words, { srs, size: 10, purpose: 'study', day: DAY + 2, now: NOW + 2 * DAY_MS })
  assert.equal(plan.dueCount, 20)
  assert.equal(plan.profile, 'support')
})

test('忘れかける前：180日の試算（準2級・毎日 暗記10枚→テスト10問・全部成功）で、長期に入った語も通常の回に出る', () => {
  const realRandom = Math.random
  let seed = 12345
  Math.random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648
    return seed / 2147483648
  }
  try {
    withStore((setNow) => {
      useStore.setState({ srs: {} })
      const base = new Date(2026, 0, 5, 10, 0, 0, 0).getTime()
      const source = { type: 'level', levelId: 'pre2' }
      let longTermShown = 0
      let lapsedSteady = 0
      for (let dayOffset = 0; dayOffset < 180; dayOffset += 1) {
        let at = base + dayOffset * DAY_MS
        const day = localDayIndex(at)
        for (const purpose of ['study', 'quiz']) {
          const srs = useStore.getState().srs
          for (const word of buildDeck(source, { srs, size: 10, purpose, now: at, day })) {
            if ((useStore.getState().srs[word.id]?.box ?? 0) >= LONG_TERM_SRS_BOX) longTermShown += 1
            setNow(at)
            useStore.getState().review(word.id, purpose === 'quiz' ? 'correct' : 'remembered', 'vocab')
            at += 30_000
          }
          at += 60 * 60_000
        }
        // 定着の確認に残る語は、どれも忘れかけの目安より上。
        const end = base + dayOffset * DAY_MS + 12 * 60 * 60_000
        for (const entry of Object.values(useStore.getState().srs)) {
          const metrics = vocabularyReviewMetrics(entry, { now: end, day })
          if (metrics.steady && metrics.retention < RETENTION_REVIEW_THRESHOLD) lapsedSteady += 1
        }
      }
      // これまでの決まりでは、長期に入った語は未学習の語が残るかぎり0回だった。
      assert.ok(longTermShown >= 500, `長期に入った語の出題 ${longTermShown}回`)
      assert.equal(lapsedSteady, 0)
    })
  } finally {
    Math.random = realRandom
  }
})

// ── 傾向で間隔を変える ────────────────────────────────────

test('間隔：全10種類の記録で、同じ日のくり返しでは段階を上げず、間をあけた成功でのばす', () => {
  for (const field of FIELDS) {
    const sameDay = recordedEntry(field, [[0, 'remembered', 240], [0, 'correct', 180], [0, 'remembered', 120], [0, 'correct', 60]])
    assert.equal(sameDay.box, 1, `${field}: 同じ日に4回成功しても段階1`)
    assert.equal(sameDay.due, DAY + 1, `${field}: 次は翌日`)

    const spaced = withStore((setNow) => {
      useStore.setState({ [field]: {} })
      const dues = []
      let at = NOW - 10 * DAY_MS
      for (let turn = 0; turn < 4; turn += 1) {
        setNow(at)
        WRITERS[field]('item', turn % 2 ? 'correct' : 'remembered')
        const entry = useStore.getState()[field].item
        dues.push(entry.due - localDayIndex(at))
        at = NOW - 10 * DAY_MS + (entry.due - localDayIndex(NOW - 10 * DAY_MS)) * DAY_MS
      }
      return dues
    })
    assert.ok(spaced.every((days, index) => index === 0 || days > spaced[index - 1]), `${field}: 間隔がのびる ${spaced.join('→')}`)
  }
})

test('間隔：1回のまちがいはこれまでどおり、2回目のまちがい（苦手）で段階0・今日からやり直す（全10種類）', () => {
  for (const field of FIELDS) {
    withStore((setNow) => {
      const answer = (daysAgo, result) => {
        setNow(NOW - daysAgo * DAY_MS)
        WRITERS[field]('item', result)
        return useStore.getState()[field].item
      }
      // 段階3で「不正解」1回：1段下げて翌日。
      useStore.setState({ [field]: { item: { box: 3, correct: 3, wrong: 0, due: DAY, lastAt: NOW - 5 * DAY_MS } } })
      let entry = answer(0, 'wrong')
      assert.equal(entry.box, 2, `${field}: 不正解1回は1段下げる`)
      assert.equal(entry.due, DAY + 1, `${field}: 翌日に確かめる`)
      // 維持復習の「不正解」1回は、1段下げて次の予定日を保つ。
      useStore.setState({ [field]: { item: { box: 8, correct: 12, wrong: 0, due: DAY, lastAt: NOW - 90 * DAY_MS } } })
      entry = answer(0, 'wrong')
      assert.equal(entry.box, 7, `${field}: 維持復習の不正解`)
      assert.equal(entry.due, DAY + SRS_INTERVAL_DAYS[7], `${field}: 次の予定日を保つ`)
      // 「まだ」1回：段階0・今日。
      useStore.setState({ [field]: { item: { box: 3, correct: 3, wrong: 0, due: DAY, lastAt: NOW - 5 * DAY_MS } } })
      entry = answer(0, 'forgot')
      assert.equal(entry.box, 0, `${field}: まだ1回は段階0`)
      assert.equal(entry.due, DAY, `${field}: まだ1回は今日`)
      // 2回目のまちがい：苦手として段階0・今日（維持復習からでも）。
      useStore.setState({ [field]: { item: { box: 8, correct: 12, wrong: 0, due: DAY - 1, lastAt: NOW - 91 * DAY_MS } } })
      answer(1, 'wrong')
      entry = answer(0, 'wrong')
      assert.equal(entry.box, 0, `${field}: 2回続けて不正解なら段階0`)
      assert.equal(entry.due, DAY, `${field}: 今日のうちにもう一度`)
    })
  }
})

// ── 一覧と学習結果 ───────────────────────────────────────

test('一覧と学習結果：単語の一覧の「確認のおすすめ順」は苦手を先頭にし、定着の札は忘れかけていない定着だけ', () => {
  const words = wordsByLevel('3').slice(0, 12)
  const assigned = assignRoles(idsOf(words), 'srs', 'study')
  const lapsed = recordedEntry('srs', [[4, 'remembered', 90], [4, 'correct', 60], [4, 'remembered', 30]])
  const lapsedId = assigned.fresh[0]
  const srs = { ...assigned.srs, [lapsedId]: lapsed }
  const rows = vocabularyCatalogRows(words, srs, { now: NOW, day: DAY })
  assert.deepEqual(
    new Set(rows.slice(0, 2).map((row) => row.word.id)),
    new Set([assigned.role.strugglingToday, assigned.role.strugglingBefore]),
  )
  const priorityOf = (id) => rows.find((row) => row.word.id === id).priority
  assert.equal(priorityOf(assigned.role.strugglingToday), 'struggling')
  assert.equal(priorityOf(assigned.role.stable), 'steady')
  assert.equal(priorityOf(lapsedId), 'due', '忘れかけた定着は「定着の確認」ではなく復習どき')
})

test('一覧と学習結果：わたしの学習の一覧は全教材で苦手を先頭にし、「くり返しまちがえている」の札を付ける', () => {
  const catalog = read('../src/components/LearningContentCatalog.jsx')
  assert.match(catalog, /struggling: \{ label: 'くり返しまちがえている'/)
  const state = {
    srs: {}, etymologySrs: {}, kotenSrs: {}, kotenGrammarSrs: {}, kotenCultureSrs: {},
    kotenInterpretationSrs: {}, kanbunVocabSrs: {}, kanbunGrammarSrs: {}, kanbunCultureSrs: {},
    kanbunKundokuSrs: {}, contentQuizResults: {}, readingsDone: [], writingProgress: {}, mathDone: [],
    mathStoryLog: [], learningNotebook: null,
  }
  const srsContents = LEARNING_CONTENTS.filter((content) => content.kind === 'srs')
  assert.equal(srsContents.length, 14)
  for (const content of srsContents) {
    const [once, repeated] = [content.items[0].id, content.items[5].id]
    const store = {
      [once]: recordedEntry(content.store, [[1, 'forgot']]),
      [repeated]: recordedEntry(content.store, [[2, 'forgot'], [1, 'wrong']]),
    }
    const rows = learningContentCatalogRows(content, { ...state, [content.store]: store }, { now: NOW, day: DAY })
    assert.equal(rows[0].id, repeated, `${content.id}: 苦手が先頭`)
    assert.equal(rows[0].priority, 'struggling', `${content.id}: 札`)
    assert.equal(rows[1].id, once, `${content.id}: 1回のまちがいはその次`)
  }
  // 数学の歴史（問題ごとに記録）も、何度も間違えている問題がある話を苦手にする。
  const mathHistory = LEARNING_CONTENTS.find((content) => content.id === 'math-history')
  const chapter = mathHistory.items[3]
  let quizResults = {}
  for (const minutesAgo of [90, 30]) {
    quizResults = recordContentQuizResult(quizResults, {
      domain: MATH_HISTORY_QUIZ_DOMAIN, itemId: chapter.quiz[0].id, correct: 0, total: 1, timestamp: NOW - minutesAgo * 60_000,
    })
  }
  quizResults = recordContentQuizResult(quizResults, {
    domain: MATH_HISTORY_QUIZ_DOMAIN, itemId: mathHistory.items[0].quiz[0].id, correct: 0, total: 1, timestamp: NOW,
  })
  const mathRows = learningContentCatalogRows(mathHistory, { ...state, contentQuizResults: quizResults }, { now: NOW, day: DAY })
  assert.equal(mathRows[0].id, chapter.id)
  assert.equal(mathRows[0].priority, 'struggling')
})

test('一覧と学習結果：語源の一覧・語根の画面の次に学ぶ単語・学習結果の優先順も苦手を先頭にする', () => {
  const struggling = recordedEntry('etymologySrs', [[1, 'forgot'], [0, 'forgot', 30]])
  const due = recordedEntry('etymologySrs', [[3, 'remembered']])
  assert.ok(etymologyCardPriorityRank(struggling, DAY) < etymologyCardPriorityRank(due, DAY))
  assert.ok(etymologyCardPriorityRank(struggling, DAY) < etymologyCardPriorityRank(undefined, DAY))
  assert.match(read('../src/screens/Roots.jsx'), /etymologyCardPriorityRank\(etymologySrs\[card\.id\]\)/)

  const words = wordsByLevel('3').slice(0, 6)
  const wordSrs = {
    [words[0].id]: recordedEntry('srs', [[1, 'forgot']]),
    [words[4].id]: recordedEntry('srs', [[1, 'forgot'], [0, 'forgot', 30]]),
  }
  const next = nextWordsForRoot(words, wordSrs, 3)
  assert.deepEqual(idsOf(next), [words[4].id, words[0].id, words[1].id])
  assert.match(read('../src/screens/RootDetail.jsx'), /nextWordsForRoot\(words, srs, batchSize\)/)

  const ids = idsOf(wordsByLevel('3').slice(0, 5))
  const report = buildStudyCompletionReport({
    contentId: 'vocab',
    ids,
    reviewIds: [ids[0]],
    srs: {
      [ids[0]]: recordedEntry('srs', [[0, 'forgot', 10]]),
      [ids[3]]: recordedEntry('srs', [[1, 'forgot'], [0, 'forgot', 20]]),
    },
    now: NOW,
  })
  assert.equal(report.priorityItems[0].id, ids[3])
  assert.equal(report.priorityItems[0].reason, '何度もまちがえている')
  assert.equal(report.priorityItems[1].id, ids[0])
})

test('全21画面の出題口は、画面の呼び方と同じ（tests/study-order.test.mjs の21画面）', () => {
  const studyOrderTest = read('./study-order.test.mjs')
  for (const screen of [...ITEM_SCREENS, ...QUESTION_SCREENS]) {
    const file = `${/（(\w+)/.exec(screen.label)[1]}.jsx`
    assert.match(studyOrderTest, new RegExp(`\\['${file}'`), file)
  }
})
