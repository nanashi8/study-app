import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

import { LEARNING_FIELD_TOC } from '../src/data/decks.js'
import { DICTATION_ITEMS, buildDictationDeck } from '../src/data/dictation.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { pickKanbunQuestions } from '../src/data/kanbun-content.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  pickKanbunKundokuExercises,
} from '../src/data/kanbun-kundoku.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import {
  KOTEN_CULTURE_QUESTIONS,
  pickKotenCultureQuestions,
} from '../src/data/koten-culture.js'
import {
  KOTEN_GRAMMAR_QUESTIONS,
  pickKotenGrammarQuestions,
} from '../src/data/koten-grammar-questions.js'
import { buildListeningDeck, listeningByLevel } from '../src/data/listening.js'
import { PHRASES } from '../src/data/phrases.js'
import { recordContentQuizResult } from '../src/lib/contentProgress.js'
import { LONG_TERM_SRS_BOX } from '../src/lib/srs.js'
import { buildGrammarDeck, grammarVariationKey } from '../src/lib/grammarDeck.js'
import { buildDeck, buildPhraseDeck, wordsForSource } from '../src/lib/session.js'
import { orderForStudy, studyOrderKey } from '../src/lib/studyOrder.js'
import { vocabularyReviewMetrics } from '../src/lib/vocabScheduler.js'
import { todayIndex, useStore } from '../src/store/useStore.js'

const DAY_MS = 86_400_000
const NOW = new Date(2026, 8, 13, 10, 0, 0, 0).getTime()
const DAY = todayIndex(NOW)
const idsOf = (items) => items.map((item) => item.id)

// 記録は実際の書き込み口（ストアの review）で作る。results は at の直前に1分おきで答えた結果（最後が最新）。
function recorded(results, { at = NOW, skill = null } = {}) {
  const original = useStore.getState()
  const realNow = Date.now
  try {
    useStore.setState({ srs: {} })
    results.forEach((result, index) => {
      Date.now = () => at - (results.length - index) * 60_000
      useStore.getState().review('fixture', result, skill)
    })
    return useStore.getState().srs.fixture
  } finally {
    Date.now = realNow
    useStore.setState(original, true)
  }
}

// 復習日が来るたびに成功し続けた記録。箱が上がって間隔がのび、いまは復習日を過ぎている。
function steadyRecorded(result, { skill = null, startDaysAgo = 40 } = {}) {
  const original = useStore.getState()
  const realNow = Date.now
  try {
    useStore.setState({ srs: {} })
    let daysAgo = startDaysAgo
    for (let turn = 0; turn < startDaysAgo && daysAgo > 0; turn += 1) {
      Date.now = () => NOW - daysAgo * DAY_MS
      useStore.getState().review('fixture', result, skill)
      const entry = useStore.getState().srs.fixture
      // 箱が育ったら、そのまま復習日が過ぎるまで置いておく。
      if (entry.box >= LONG_TERM_SRS_BOX) break
      const wait = Math.max(1, entry.due - todayIndex(NOW - daysAgo * DAY_MS))
      daysAgo = Math.max(1, daysAgo - wait)
    }
    const entry = useStore.getState().srs.fixture
    assert.ok(entry.box >= LONG_TERM_SRS_BOX, `素材の箱 ${entry.box}`)
    assert.ok(entry.due <= DAY, `素材の復習日 ${entry.due - DAY}`)
    return entry
  } finally {
    Date.now = realNow
    useStore.setState(original, true)
  }
}

const scoreOf = (entry) => vocabularyReviewMetrics(entry, { now: NOW, day: DAY }).score

// 同じ日に学び終えかけた教材の記録。暗記は「覚えた／まだ」、テストは「正解／不正解」で答える。
// fresh は未学習（暗記）・未回答（テスト）、missed は今日間違えた項目（点数の低い順）、rest は今日覚えた・正解した項目。
function sameDayRoles(purpose, skill = null) {
  const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
  const hit = purpose === 'quiz' ? 'correct' : 'remembered'
  // もう片方の活動だけ済ませた項目は、この活動ではまだ手をつけていない。
  const otherOnly = purpose === 'quiz' ? 'remembered' : 'correct'
  return {
    fresh: [null, recorded([otherOnly], { skill })],
    missed: [
      recorded([miss, miss, miss], { skill }),
      recorded([hit, miss], { skill }),
      recorded([hit, hit, hit, miss], { skill }),
    ],
    rest: [recorded([hit], { skill }), recorded([hit, hit], { skill })],
  }
}

// 実在する項目IDへ、sameDayRoles の記録を先頭から割り当てる。
function assignRoles(ids, purpose, skill = null) {
  const roles = sameDayRoles(purpose, skill)
  const count = roles.fresh.length + roles.missed.length + roles.rest.length
  assert.ok(ids.length >= count, '素材の項目数')
  const srs = {}
  let at = 0
  const take = (entries) => entries.map((entry) => {
    const id = ids[at++]
    if (entry) srs[id] = entry
    return id
  })
  const fresh = take(roles.fresh)
  const missed = take(roles.missed)
  const rest = take(roles.rest)
  return { ids: ids.slice(0, count), srs, fresh, missed, rest }
}

function assertStudyOrder(orderedIds, { fresh, missed, rest }, label) {
  assert.deepEqual(
    new Set(orderedIds.slice(0, fresh.length)),
    new Set(fresh),
    `${label}: 未学習・未回答から出す`,
  )
  assert.deepEqual(
    orderedIds.slice(fresh.length, fresh.length + missed.length),
    missed,
    `${label}: 今日の「まだ」「不正解」は点数の低い順`,
  )
  assert.deepEqual(
    new Set(orderedIds.slice(fresh.length + missed.length)),
    new Set(rest),
    `${label}: 覚えた・正解は最後`,
  )
}

test('出題の段は、取りこぼしの復習 → 未学習・未回答 → 今日の「まだ」「不正解」 → 定着の確認 → そのほか', () => {
  const cases = [
    { label: '記録なし', entry: undefined, study: 1, quiz: 1 },
    { label: '前の日に「まだ」', entry: recorded(['forgot'], { at: NOW - DAY_MS }), study: 0, quiz: 0 },
    { label: '前の日に「不正解」', entry: recorded(['wrong'], { at: NOW - DAY_MS }), study: 0, quiz: 0 },
    { label: '今日「まだ」（テストは未回答）', entry: recorded(['forgot']), study: 2, quiz: 1 },
    { label: '今日「不正解」（暗記は未学習）', entry: recorded(['wrong']), study: 1, quiz: 2 },
    { label: '今日「わからない」', entry: recorded(['unknown']), study: 1, quiz: 2 },
    { label: '今日「覚えた」→「不正解」', entry: recorded(['remembered', 'wrong']), study: 2, quiz: 2 },
    { label: '今日「まだ」→「正解」', entry: recorded(['forgot', 'correct']), study: 2, quiz: 2 },
    { label: '今日「覚えた」（テストは未回答）', entry: recorded(['remembered']), study: 4, quiz: 1 },
    { label: '今日「覚えた」→「正解」', entry: recorded(['remembered', 'correct']), study: 4, quiz: 4 },
    // 連続で成功を重ねた項目は、復習日が来ても最優先では出さない。
    { label: '連続「覚えた」で復習日が来た', entry: steadyRecorded('remembered'), study: 3, quiz: 1 },
    { label: '連続「正解」で復習日が来た', entry: steadyRecorded('correct'), study: 1, quiz: 3 },
  ]
  for (const { label, entry, study, quiz } of cases) {
    assert.equal(studyOrderKey(entry, { purpose: 'study', now: NOW, day: DAY }).stage, study, `暗記・${label}`)
    assert.equal(studyOrderKey(entry, { purpose: 'quiz', now: NOW, day: DAY }).stage, quiz, `テスト・${label}`)
  }
})

test('連続で覚えた・正解した項目の復習は、今日の「まだ」「不正解」より後ろに出す', () => {
  for (const purpose of ['study', 'quiz']) {
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
    const srs = {
      overdue: recorded([miss], { at: NOW - DAY_MS }),
      missed: recorded([miss]),
      steady: steadyRecorded(hit),
    }
    const items = ['steady', 'missed', 'fresh', 'overdue'].map((id) => ({ id }))
    for (let run = 1; run <= 20; run += 1) {
      assert.deepEqual(
        idsOf(orderForStudy(items, srs, { purpose, now: NOW, day: DAY })),
        ['overdue', 'fresh', 'missed', 'steady'],
        `${purpose}・${run}回目`,
      )
    }
  }
})

test('今日の「まだ」「不正解」は、間違えた回数が多く点数の低い項目から出す', () => {
  for (const purpose of ['study', 'quiz']) {
    const scores = sameDayRoles(purpose).missed.map(scoreOf)
    assert.ok(scores[0] < scores[1] && scores[1] < scores[2], `${purpose}: 素材の点数 ${scores.join(' < ')}`)

    const items = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => ({ id }))
    const assigned = assignRoles(idsOf(items), purpose)
    for (let run = 1; run <= 20; run += 1) {
      const ordered = orderForStudy([...items].reverse(), assigned.srs, { purpose, now: NOW, day: DAY })
      assertStudyOrder(idsOf(ordered), assigned, `${purpose}・${run}回目`)
    }
  }
})

// 1回10枚で数回まわすと同じ日に学び終える、小さめの級別分野。
function smallChapter() {
  for (const level of LEARNING_FIELD_TOC) {
    for (const chapter of level.chapters) {
      const source = { type: 'levelField', levelId: level.level.id, field: chapter.fieldId }
      const words = wordsForSource(source)
      if (words.length >= 14 && words.length <= 30) return { source, words }
    }
  }
  throw new Error('監査に使う14〜30語の級別分野が見つからない')
}

test('英単語の暗記・テストも、今日の候補を出し切ってから今日の「まだ」「不正解」を点数の低い順に出す', () => {
  const { source, words } = smallChapter()
  for (const purpose of ['study', 'quiz']) {
    const assigned = assignRoles(idsOf(words), purpose, 'vocab')
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    // 割り当てなかった残りの語も、今日覚えた・正解した語にする。
    for (const id of idsOf(words).slice(assigned.ids.length)) {
      assigned.srs[id] = recorded([hit], { skill: 'vocab' })
      assigned.rest.push(id)
    }
    const options = { srs: assigned.srs, purpose, now: NOW, day: DAY }

    const all = buildDeck(source, { ...options, size: 0 })
    assert.equal(all.length, words.length, `${purpose}: 全部を選ぶと全語`)
    assertStudyOrder(idsOf(all), assigned, `英単語・${purpose}・全部`)
    assertStudyOrder(
      idsOf(buildDeck(source, { ...options, size: words.length })),
      assigned,
      `英単語・${purpose}・${words.length}語`,
    )
    // 未学習・未回答の語が残るうちは、今日の「まだ」「不正解」を混ぜない（テストも暗記と同じ）。
    assert.deepEqual(
      new Set(idsOf(buildDeck(source, { ...options, size: 2 }))),
      new Set(assigned.fresh),
      `${purpose}: 今日の候補で足りる回`,
    )
    assert.deepEqual(
      idsOf(buildDeck(source, { ...options, size: 3 })).slice(2),
      assigned.missed.slice(0, 1),
      `${purpose}: 今日の候補のすぐ後は、いちばん点数の低い語`,
    )
  }
})

test('英単語の今日の候補に、連続で覚えた・正解した語の復習は混ぜない', () => {
  const { source, words } = smallChapter()
  for (const purpose of ['study', 'quiz']) {
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    const ids = idsOf(words)
    const fresh = ids.slice(0, 2)
    const steady = ids.slice(2, 5)
    const steadyEntry = steadyRecorded(hit, { skill: 'vocab' })
    const srs = {}
    for (const id of steady) srs[id] = steadyEntry
    // 残りは今日学び終えた語にして、今日の候補が未学習・未回答の2語だけになるようにする。
    for (const id of ids.slice(5)) srs[id] = recorded([hit], { skill: 'vocab' })
    const options = { srs, purpose, now: NOW, day: DAY }

    assert.deepEqual(
      new Set(idsOf(buildDeck(source, { ...options, size: 2 }))),
      new Set(fresh),
      `${purpose}: 今日の候補だけで足りる回`,
    )
    const all = idsOf(buildDeck(source, { ...options, size: 0 }))
    assert.deepEqual(new Set(all.slice(0, 2)), new Set(fresh), `${purpose}: 未学習・未回答から出す`)
    assert.deepEqual(
      new Set(all.slice(2, 5)),
      new Set(steady),
      `${purpose}: 定着の確認は今日の候補の後`,
    )
  }
})

test('熟語・文法・リスニング・書き取り・漢文・返り点も同じ順番で出す', () => {
  for (const purpose of ['study', 'quiz']) {
    const phrase = assignRoles(idsOf(PHRASES), purpose)
    assertStudyOrder(
      idsOf(buildPhraseDeck(
        { type: 'phraseList', ids: phrase.ids },
        { srs: phrase.srs, size: 0, purpose, now: NOW },
      )),
      phrase,
      `熟語・${purpose}`,
    )
  }

  // 文法は同型を1問に束ね、単元を散らすので、型も単元も別々の問題で確かめる。
  const grammarIds = []
  const keys = new Set()
  const topics = new Set()
  for (const item of GRAMMAR) {
    const key = grammarVariationKey(item)
    if (keys.has(key) || topics.has(item.topic)) continue
    keys.add(key)
    topics.add(item.topic)
    grammarIds.push(item.id)
    if (grammarIds.length === 7) break
  }
  const grammar = assignRoles(grammarIds, 'quiz')
  assertStudyOrder(
    idsOf(buildGrammarDeck(
      { type: 'grammarList', ids: grammar.ids },
      { srs: grammar.srs, size: 0, day: DAY, now: NOW },
    )),
    grammar,
    '文法',
  )

  const listening = assignRoles(idsOf(listeningByLevel('3')), 'quiz')
  assertStudyOrder(
    idsOf(buildListeningDeck(
      { type: 'listeningList', ids: listening.ids },
      { srs: listening.srs, size: 0, now: NOW },
    )),
    listening,
    'リスニング・一覧から',
  )

  const dictation = assignRoles(idsOf(DICTATION_ITEMS), 'quiz')
  assertStudyOrder(
    idsOf(buildDictationDeck(
      { type: 'dictationList', ids: dictation.ids },
      { srs: dictation.srs, size: 0, now: NOW },
    )),
    dictation,
    '書き取り',
  )

  const kanbun = assignRoles(idsOf(KANBUN_VOCAB), 'quiz')
  assertStudyOrder(
    pickKanbunQuestions('vocab', kanbun.ids, { srs: kanbun.srs, size: 7, now: NOW })
      .map((question) => question.itemId),
    kanbun,
    '漢文テスト',
  )

  const kundoku = assignRoles(idsOf(KANBUN_KUNDOKU_EXERCISES), 'quiz')
  assertStudyOrder(
    idsOf(pickKanbunKundokuExercises(kundoku.ids, { srs: kundoku.srs, size: 7, now: NOW })),
    kundoku,
    '返り点',
  )
  // 一覧で選んだ順は、記録にかかわらずそのまま。
  assert.deepEqual(
    idsOf(pickKanbunKundokuExercises([...kundoku.ids].reverse(), {
      srs: kundoku.srs,
      size: 7,
      preserveOrder: true,
      now: NOW,
    })),
    [...kundoku.ids].reverse(),
  )
})

test('リスニングの級別テストは、形式の配分より先に未回答 → 今日の不正解（点数の低い順）を守る', () => {
  const items = listeningByLevel('3')
  const assigned = assignRoles(idsOf(items), 'quiz')
  for (const id of idsOf(items).slice(assigned.ids.length)) {
    assigned.srs[id] = recorded(['correct'])
    assigned.rest.push(id)
  }
  const deck = idsOf(buildListeningDeck(
    { type: 'level', levelId: '3' },
    { srs: assigned.srs, size: 10, now: NOW },
  ))
  assert.equal(deck.length, 10)
  assert.equal(new Set(deck).size, 10)
  assert.deepEqual(new Set(deck.slice(0, 2)), new Set(assigned.fresh), '未回答から出す')
  assert.deepEqual(deck.slice(2, 5), assigned.missed, '今日の不正解は点数の低い順')
  assert.ok(deck.slice(5).every((id) => assigned.rest.includes(id)), '残りは正解した問題')
})

test('古典文法・古典常識のテストは、問題ごとの結果で未回答を先に、今日間違えた問題を扱う項目の点数の低い順に出す', () => {
  const cases = [
    {
      label: '古典文法',
      questions: KOTEN_GRAMMAR_QUESTIONS,
      domain: 'koten-grammar',
      itemIdsOf: (question) => question.grammarIds,
      pick: pickKotenGrammarQuestions,
    },
    {
      label: '古典常識',
      questions: KOTEN_CULTURE_QUESTIONS,
      domain: 'koten-culture',
      itemIdsOf: (question) => question.cultureIds,
      pick: pickKotenCultureQuestions,
    },
  ]
  for (const { label, questions, domain, itemIdsOf, pick } of cases) {
    const primaryOf = (question) => itemIdsOf(question)[0]
    const unanswered = [
      ...questions.filter((question) => question.style === 'context').slice(0, 2),
      ...questions.filter((question) => question.style === 'foundation').slice(0, 2),
    ]
    const unansweredIds = new Set(idsOf(unanswered))
    // 扱う項目が互いに違う3問を、今日間違えた問題にする。
    const wrong = []
    const primaries = new Set()
    for (const question of questions) {
      if (unansweredIds.has(question.id) || primaries.has(primaryOf(question))) continue
      primaries.add(primaryOf(question))
      wrong.push(question)
      if (wrong.length === 3) break
    }
    const wrongIds = new Set(idsOf(wrong))
    let quizResults = {}
    for (const question of questions) {
      if (unansweredIds.has(question.id)) continue
      quizResults = recordContentQuizResult(quizResults, {
        domain,
        itemId: question.id,
        correct: wrongIds.has(question.id) ? 0 : 1,
        total: 1,
        timestamp: NOW,
      })
    }
    // 点数は扱う項目の記録から出す。間違えた回数が多いほど低い。
    const srs = {
      [primaryOf(wrong[1])]: recorded(['wrong', 'wrong', 'wrong']),
      [primaryOf(wrong[2])]: recorded(['correct', 'wrong']),
      [primaryOf(wrong[0])]: recorded(['correct', 'correct', 'correct', 'wrong']),
    }
    const expectedWrong = idsOf([wrong[1], wrong[2], wrong[0]])
    const itemIds = [...new Set(questions.flatMap(itemIdsOf))]

    for (const size of [5, 12]) {
      const deck = pick(itemIds, { size, srs, quizResults, now: NOW })
      const ids = idsOf(deck)
      assert.equal(ids.length, size, `${label}・${size}問`)
      assert.deepEqual(new Set(ids.slice(0, 4)), unansweredIds, `${label}・${size}問: 未回答から出す`)
      assert.deepEqual(
        ids.slice(4, Math.min(size, 7)),
        expectedWrong.slice(0, size - 4),
        `${label}・${size}問: 今日間違えた問題は点数の低い順`,
      )
      if (size === 12) {
        // 文脈型8・基礎型4の配分は、今日の候補とそのほかの中で保つ。
        assert.equal(deck.filter((question) => question.style === 'context').length, 8, label)
        assert.equal(deck.filter((question) => question.style === 'foundation').length, 4, label)
      }
    }
  }
})

test('暗記・テストの全21画面が、いまの記録から共通の出題順で組む', () => {
  const read = (file) => readFileSync(new URL(`../src/screens/${file}`, import.meta.url), 'utf8')
  const expectations = [
    ['VocabStudy.jsx', /buildDeck\(source, \{[\s\S]*?purpose: 'study'/],
    ['VocabQuiz.jsx', /buildDeck\(source, \{[\s\S]*?purpose: 'quiz'/],
    ['PhraseStudy.jsx', /buildPhraseDeck\([\s\S]*?srs: useStore\.getState\(\)\.srs,\s*size,\s*purpose: 'study',/],
    ['PhraseQuiz.jsx', /buildPhraseDeck\(source, \{[\s\S]*?srs: useStore\.getState\(\)\.srs,\s*size,\s*purpose: 'quiz',/],
    ['GrammarQuiz.jsx', /buildGrammarDeck\([\s\S]*?srs: useStore\.getState\(\)\.srs/],
    ['ListeningQuiz.jsx', /buildListeningDeck\(source, \{ size, srs: useStore\.getState\(\)\.srs \}\)/],
    ['DictationPlay.jsx', /buildDictationDeck\(source, \{ size, srs: useStore\.getState\(\)\.srs \}\)/],
    ['EtymologyStudy.jsx', /orderForStudy\(cards, useStore\.getState\(\)\.etymologySrs, \{ purpose: 'study' \}\)/],
    ['EtymologyQuiz.jsx', /useStore\.getState\(\)\.etymologySrs,\s*\{ purpose: 'quiz' \}/],
    ['KotenStudy.jsx', /orderForStudy\(words, useStore\.getState\(\)\.kotenSrs, \{ purpose: 'study' \}\)/],
    ['KotenQuiz.jsx', /useStore\.getState\(\)\.kotenSrs,\s*\{ purpose: 'quiz' \}/],
    ['KotenGrammarStudy.jsx', /orderForStudy\(selected, useStore\.getState\(\)\.kotenGrammarSrs, \{ purpose: 'study' \}\)/],
    ['KotenGrammarQuiz.jsx', /pickKotenGrammarQuestions\(ids, \{\s*size,\s*srs: state\.kotenGrammarSrs,\s*quizResults: state\.contentQuizResults,/],
    ['KotenCultureStudy.jsx', /orderForStudy\(selected, useStore\.getState\(\)\.kotenCultureSrs, \{ purpose: 'study' \}\)/],
    ['KotenCultureQuiz.jsx', /pickKotenCultureQuestions\(ids, \{\s*size,\s*srs: state\.kotenCultureSrs,\s*quizResults: state\.contentQuizResults,/],
    ['KotenInterpretationQuiz.jsx', /orderForStudy\(selected, useStore\.getState\(\)\.kotenInterpretationSrs, \{ purpose: 'quiz' \}\)/],
    ['KanbunStudy.jsx', /orderForStudy\(selected, useStore\.getState\(\)\[meta\.srsField\], \{ purpose: 'study' \}\)/],
    ['KanbunQuiz.jsx', /pickKanbunQuestions\(domain, ids, \{\s*size,\s*srs: useStore\.getState\(\)\[meta\.srsField\],/],
    ['KanbunKundokuQuiz.jsx', /pickKanbunKundokuExercises\(ids, \{\s*size,\s*preserveOrder: params\.preserveOrder,\s*srs: useStore\.getState\(\)\.kanbunKundokuSrs,/],
    ['WritingGrammarReview.jsx', /orderForStudy\(due\.length \? due : items, state\.srs, \{ purpose: 'study', rng: null \}\)/],
    ['MathStoryQuiz.jsx', /rankQuestionsForStudy\(questionsForChapters\(ids\), \{\s*quizResults: state\.contentQuizResults,\s*quizDomain: MATH_HISTORY_QUIZ_DOMAIN,/],
  ]
  assert.equal(expectations.length, 21)
  // 1回の数を数える部品（SessionCounter）を持つ画面が、暗記・テストの画面のすべて。
  const sessionScreens = readdirSync(new URL('../src/screens/', import.meta.url))
    .filter((file) => file.endsWith('.jsx') && /<SessionCounter\b/.test(read(file)))
  assert.deepEqual(new Set(sessionScreens), new Set(expectations.map(([file]) => file)))
  for (const [file, pattern] of expectations) {
    assert.match(read(file), pattern, `${file}: 記録から出題順を決めていない`)
  }
})
