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
import { STUDY_ORDER_STAGE, orderForStudy, studyOrderKey } from '../src/lib/studyOrder.js'
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

// 続けて覚えた・正解した（定着）記録。daysAgo 日前に3回続けて成功し、1日後の今は復習日を迎えたばかり（まだ忘れかけていない）。
function stableRecorded(result, { skill = null, daysAgo = 1 } = {}) {
  return recorded([result, result, result], { at: NOW - daysAgo * DAY_MS, skill })
}

// 同じ日に学び終えかけた教材の記録。暗記は「覚えた／まだ」、テストは「正解／不正解」で答える。
// struggling は何度もまちがえている項目、fresh は未学習（暗記）・未回答（テスト）、
// missed は今日1回まちがえた項目（点数の低い順）、rest は今日覚えた・正解した項目。
function sameDayRoles(purpose, skill = null) {
  const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
  const hit = purpose === 'quiz' ? 'correct' : 'remembered'
  // もう片方の活動だけ済ませた項目は、この活動ではまだ手をつけていない。
  const otherOnly = purpose === 'quiz' ? 'remembered' : 'correct'
  return {
    struggling: [recorded([miss, miss, miss], { skill })],
    fresh: [null, recorded([otherOnly], { skill })],
    missed: [
      recorded([hit, miss], { skill }),
      recorded([hit, hit, hit, miss], { skill }),
    ],
    rest: [recorded([hit], { skill }), recorded([hit, hit], { skill })],
  }
}

// 実在する項目IDへ、sameDayRoles の記録を先頭から割り当てる。
function assignRoles(ids, purpose, skill = null) {
  const roles = sameDayRoles(purpose, skill)
  const count = roles.struggling.length + roles.fresh.length + roles.missed.length + roles.rest.length
  assert.ok(ids.length >= count, '素材の項目数')
  const srs = {}
  let at = 0
  const take = (entries) => entries.map((entry) => {
    const id = ids[at++]
    if (entry) srs[id] = entry
    return id
  })
  const struggling = take(roles.struggling)
  const fresh = take(roles.fresh)
  const missed = take(roles.missed)
  const rest = take(roles.rest)
  return { ids: ids.slice(0, count), srs, struggling, fresh, missed, rest }
}

function assertStudyOrder(orderedIds, { struggling, fresh, missed, rest }, label) {
  assert.deepEqual(
    orderedIds.slice(0, struggling.length),
    struggling,
    `${label}: 何度もまちがえている項目がいちばん先`,
  )
  const afterStruggling = orderedIds.slice(struggling.length)
  assert.deepEqual(
    new Set(afterStruggling.slice(0, fresh.length)),
    new Set(fresh),
    `${label}: 次に未学習・未回答`,
  )
  assert.deepEqual(
    afterStruggling.slice(fresh.length, fresh.length + missed.length),
    missed,
    `${label}: 今日1回の「まだ」「不正解」は点数の低い順`,
  )
  assert.deepEqual(
    new Set(afterStruggling.slice(fresh.length + missed.length)),
    new Set(rest),
    `${label}: 覚えた・正解は最後`,
  )
}

test('出題の段は、苦手 → 復習 → 未学習・未回答 → 今日1回の「まだ」「不正解」 → 定着の確認 → そのほか', () => {
  const S = STUDY_ORDER_STAGE
  const cases = [
    { label: '記録なし', entry: undefined, study: S.fresh, quiz: S.fresh },
    { label: '前の日に「まだ」', entry: recorded(['forgot'], { at: NOW - DAY_MS }), study: S.review, quiz: S.review },
    { label: '前の日に「不正解」', entry: recorded(['wrong'], { at: NOW - DAY_MS }), study: S.review, quiz: S.review },
    { label: '今日「まだ」（テストは未回答）', entry: recorded(['forgot']), study: S.missedToday, quiz: S.fresh },
    { label: '今日「不正解」（暗記は未学習）', entry: recorded(['wrong']), study: S.fresh, quiz: S.missedToday },
    { label: '今日「わからない」', entry: recorded(['unknown']), study: S.fresh, quiz: S.missedToday },
    { label: '今日「覚えた」→「不正解」', entry: recorded(['remembered', 'wrong']), study: S.missedToday, quiz: S.missedToday },
    { label: '今日「まだ」→「正解」', entry: recorded(['forgot', 'correct']), study: S.missedToday, quiz: S.missedToday },
    { label: '今日「覚えた」（テストは未回答）', entry: recorded(['remembered']), study: S.rest, quiz: S.fresh },
    { label: '今日「覚えた」→「正解」', entry: recorded(['remembered', 'correct']), study: S.rest, quiz: S.rest },
    // 何度もまちがえている項目は、今日でも、暗記でもテストでもいちばん先。
    { label: '今日「まだ」を2回', entry: recorded(['forgot', 'forgot']), study: S.struggling, quiz: S.struggling },
    { label: '前の日から「不正解」を2回', entry: recorded(['wrong', 'wrong'], { at: NOW - DAY_MS }), study: S.struggling, quiz: S.struggling },
    // 続けて覚えた・正解した項目は、復習日が来ても後回し。もう一方の活動でも未学習・未回答にしない。
    { label: '続けて「覚えた」で復習日が来た', entry: stableRecorded('remembered'), study: S.steady, quiz: S.steady },
    { label: '続けて「正解」で復習日が来た', entry: stableRecorded('correct'), study: S.steady, quiz: S.steady },
    // 後回しは忘れかける前まで。
    { label: '続けて「覚えた」あと忘れかけた', entry: stableRecorded('remembered', { daysAgo: 4 }), study: S.review, quiz: S.review },
    { label: '長期に入って復習日を過ぎた', entry: steadyRecorded('correct'), study: S.review, quiz: S.review },
  ]
  for (const { label, entry, study, quiz } of cases) {
    assert.equal(studyOrderKey(entry, { purpose: 'study', now: NOW, day: DAY }).stage, study, `暗記・${label}`)
    assert.equal(studyOrderKey(entry, { purpose: 'quiz', now: NOW, day: DAY }).stage, quiz, `テスト・${label}`)
  }
})

test('続けて覚えた・正解した項目の確認は、今日1回の「まだ」「不正解」より後ろ、忘れかけたら復習と同じに戻す', () => {
  for (const purpose of ['study', 'quiz']) {
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
    const srs = {
      struggling: recorded([miss, miss]),
      overdue: recorded([miss], { at: NOW - DAY_MS }),
      missed: recorded([miss]),
      steady: stableRecorded(hit),
      lapsed: stableRecorded(hit, { daysAgo: 4 }),
    }
    const items = ['steady', 'missed', 'fresh', 'lapsed', 'overdue', 'struggling'].map((id) => ({ id }))
    for (let run = 1; run <= 20; run += 1) {
      const ordered = idsOf(orderForStudy(items, srs, { purpose, now: NOW, day: DAY }))
      assert.equal(ordered[0], 'struggling', `${purpose}・${run}回目: 苦手がいちばん先`)
      assert.deepEqual(new Set(ordered.slice(1, 3)), new Set(['overdue', 'lapsed']), `${purpose}・${run}回目: 復習`)
      assert.deepEqual(ordered.slice(3), ['fresh', 'missed', 'steady'], `${purpose}・${run}回目`)
    }
  }
})

test('今日1回の「まだ」「不正解」は、間違えた回数が多く点数の低い項目から出し、何度もまちがえた項目はいちばん先', () => {
  for (const purpose of ['study', 'quiz']) {
    const scores = sameDayRoles(purpose).missed.map(scoreOf)
    assert.ok(scores[0] < scores[1], `${purpose}: 素材の点数 ${scores.join(' < ')}`)

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
  throw new Error('14〜30語の級別分野が見つからない')
}

test('英単語の暗記・テストも、苦手 → 今日の候補を出し切ってから、今日1回の「まだ」「不正解」を点数の低い順に出す', () => {
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
    // 未学習・未回答の語が残るうちは、今日1回の「まだ」「不正解」を混ぜない（テストも暗記と同じ）。
    const candidates = [...assigned.struggling, ...assigned.fresh]
    const today = idsOf(buildDeck(source, { ...options, size: candidates.length }))
    assert.equal(today[0], assigned.struggling[0], `${purpose}: 苦手がいちばん先`)
    assert.deepEqual(new Set(today), new Set(candidates), `${purpose}: 今日の候補で足りる回`)
    assert.deepEqual(
      idsOf(buildDeck(source, { ...options, size: candidates.length + 1 })).slice(candidates.length),
      assigned.missed.slice(0, 1),
      `${purpose}: 今日の候補のすぐ後は、いちばん点数の低い語`,
    )
  }
})

test('英単語の今日の候補に、定着の確認は混ぜず、忘れかけた定着は復習として混ぜる', () => {
  const { source, words } = smallChapter()
  for (const purpose of ['study', 'quiz']) {
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    const ids = idsOf(words)
    const fresh = ids.slice(0, 2)
    const steady = ids.slice(2, 5)
    const lapsed = ids.slice(5, 7)
    const srs = {}
    for (const id of steady) srs[id] = stableRecorded(hit, { skill: 'vocab' })
    for (const id of lapsed) srs[id] = stableRecorded(hit, { skill: 'vocab', daysAgo: 4 })
    // 残りは今日学び終えた語にして、今日の候補が未学習・未回答の2語と忘れかけた2語だけになるようにする。
    for (const id of ids.slice(7)) srs[id] = recorded([hit], { skill: 'vocab' })
    const options = { srs, purpose, now: NOW, day: DAY }

    assert.deepEqual(
      new Set(idsOf(buildDeck(source, { ...options, size: 4 }))),
      new Set([...fresh, ...lapsed]),
      `${purpose}: 今日の候補だけで足りる回`,
    )
    const all = idsOf(buildDeck(source, { ...options, size: 0 }))
    assert.deepEqual(new Set(all.slice(0, 4)), new Set([...fresh, ...lapsed]), `${purpose}: 今日の候補から出す`)
    assert.deepEqual(
      new Set(all.slice(4, 7)),
      new Set(steady),
      `${purpose}: 定着の確認は今日の候補の後`,
    )
  }
})

test('熟語・文法・リスニング・書き取り・漢文・返り点も同じ順番（苦手 → 未学習・未回答 → 今日1回のまちがい → 覚えた）で出す', () => {
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

test('リスニングの級別テストは、形式の配分より先に 苦手 → 未回答 → 今日1回の不正解（点数の低い順）を守る', () => {
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
  assert.equal(deck[0], assigned.struggling[0], '何度も間違えた問題がいちばん先')
  assert.deepEqual(new Set(deck.slice(1, 3)), new Set(assigned.fresh), '次に未回答')
  assert.deepEqual(deck.slice(3, 5), assigned.missed, '今日1回の不正解は点数の低い順')
  assert.ok(deck.slice(5).every((id) => assigned.rest.includes(id)), '残りは正解した問題')
})

test('古典文法・古典常識のテストは、問題ごとの結果で、扱う項目が苦手な間違えた問題 → 未回答 → 今日間違えた問題を扱う項目の点数の低い順に出す', () => {
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
    // wrong[1] の項目は3回続けてまちがえている（苦手）ので、その問題をいちばん先に出す。
    const strugglingId = wrong[1].id
    const expectedWrong = idsOf([wrong[2], wrong[0]])
    const itemIds = [...new Set(questions.flatMap(itemIdsOf))]

    for (const size of [5, 12]) {
      const deck = pick(itemIds, { size, srs, quizResults, now: NOW })
      const ids = idsOf(deck)
      assert.equal(ids.length, size, `${label}・${size}問`)
      assert.equal(ids[0], strugglingId, `${label}・${size}問: 苦手な項目の間違えた問題がいちばん先`)
      assert.deepEqual(new Set(ids.slice(1, 5)), unansweredIds, `${label}・${size}問: 次に未回答`)
      assert.deepEqual(
        ids.slice(5, Math.min(size, 7)),
        expectedWrong.slice(0, Math.max(0, size - 5)),
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
