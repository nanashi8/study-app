import test from 'node:test'
import assert from 'node:assert/strict'

import { localDayIndexAt, todayIndex } from '../src/store/useStore.js'
import { buildDeck, buildPhraseDeck, overallProgress } from '../src/lib/session.js'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHONETIC_OVERRIDES } from '../src/data/phonetic-overrides.js'
import {
  GRAMMAR,
  GRAMMAR_LEVEL_TARGETS,
  GRAMMAR_TOPIC_MINIMUM,
  grammarByLevel,
  samePatternExamplesFor,
} from '../src/data/grammar.js'
import { PHRASES } from '../src/data/phrases.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  READING_QUESTION_COUNTS,
  getReadingQuestions,
} from '../src/data/reading-questions.js'
import {
  READING_WORD_COUNT_TARGETS,
  passageWordCount,
} from '../src/data/reading-study.js'
import { lemmaCandidates, resolvePassageWord } from '../src/data/passage-gloss.js'
import { VN_EPISODES, SPEAKERS } from '../src/data/vn.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import {
  buildDictationDeck,
  DICTATION_ITEMS,
  DICTATION_PROFILES,
  dictationByLevel,
} from '../src/data/dictation.js'
import { scoreDictation } from '../src/lib/dictation.js'
import {
  buildListeningDeck,
  LISTENING_ITEMS,
  LISTENING_PROFILES,
  LISTENING_TYPE_META,
  listeningByLevel,
  listeningSpokenSegments,
  shuffledListeningChoices,
} from '../src/data/listening.js'
import { getKoten } from '../src/data/koten.js'
import { getKotenGrammar, KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
  pickKotenInterpretationIds,
} from '../src/data/koten-interpretations.js'

const entry = (due = todayIndex()) => ({
  box: 0,
  correct: 0,
  wrong: 1,
  due,
  last: due,
})

test('現地日付は日本時間の午前0時で切り替わる', () => {
  const jstOffset = -540
  const start = localDayIndexAt(Date.parse('2026-07-27T00:00:00+09:00'), jstOffset)
  assert.equal(localDayIndexAt(Date.parse('2026-07-27T08:59:59+09:00'), jstOffset), start)
  assert.equal(localDayIndexAt(Date.parse('2026-07-27T23:59:59+09:00'), jstOffset), start)
  assert.equal(localDayIndexAt(Date.parse('2026-07-28T00:00:00+09:00'), jstOffset), start + 1)
})

test('ホームの単語進捗は文法・熟語IDを数えない', () => {
  const phrase = PHRASES[0]
  const srs = {
    gr_5_be_1: entry(-1),
    [phrase.id]: entry(-1),
  }
  assert.deepEqual(overallProgress(srs), {
    seen: 0,
    mastered: 0,
    due: 0,
    total: ALL_WORDS.length,
  })
  assert.equal(buildDeck({ type: 'due' }, { srs, size: 20 }).length, 0)

  srs.read = entry(-1)
  assert.equal(overallProgress(srs).due, 1)
  assert.equal(buildDeck({ type: 'due' }, { srs, size: 20 })[0].id, 'read')
})

test('熟語の期限切れ復習は種類別デッキに現れる', () => {
  const phrase = PHRASES[0]
  const deck = buildPhraseDeck(
    { type: 'phraseDue', kind: phrase.kind },
    { srs: { [phrase.id]: entry(-1) }, size: 20 },
  )
  assert.deepEqual(deck.map((item) => item.id), [phrase.id])
})

test('同綴異音語は見出し語の品詞・語義に合うIPAを使う', () => {
  for (const [id, ipa] of Object.entries(PHONETIC_OVERRIDES)) {
    assert.equal(getWord(id)?.phonetic, ipa, id)
  }
  assert.equal(getWord('read').phonetic, '/ˈɹid/')
  assert.equal(getWord('minute').phonetic, '/maɪˈnut/')
})

test('全ての文法問題は正解を入れると完成文を含む', () => {
  const normalize = (text) =>
    text.replace(/\s+/g, ' ').replace(/\s+([,.?!])/g, '$1').trim()
  for (const item of GRAMMAR) {
    const completed = normalize(item.q.replace('___', item.answer))
    assert.ok(completed.includes(normalize(item.sentence.en)), item.id)
  }
})

test('英文法は全7級に60問以上あり、重複のない4択を備える', () => {
  for (const [level, minimum] of Object.entries(GRAMMAR_LEVEL_TARGETS)) {
    assert.ok(grammarByLevel(level).length >= minimum, level)
  }
  assert.equal(new Set(GRAMMAR.map((item) => item.id)).size, GRAMMAR.length)
  assert.equal(new Set(GRAMMAR.map((item) => item.q)).size, GRAMMAR.length)
  for (const item of GRAMMAR) {
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(new Set(item.choices).size, 4, item.id)
    assert.ok(item.choices.includes(item.answer), item.id)
  }
})

test('全ての文法問題は同じ級・単元の完成例を2文表示できる', () => {
  for (const item of GRAMMAR) {
    const examples = samePatternExamplesFor(item)
    assert.equal(examples.length, GRAMMAR_TOPIC_MINIMUM - 1, item.id)
    assert.ok(examples.every((example) => example.id !== item.id), item.id)
    assert.ok(examples.every((example) => example.en && example.ja), item.id)
    for (const example of examples) {
      const source = GRAMMAR.find((candidate) => candidate.id === example.id)
      assert.equal(source.level, item.level, item.id)
      assert.equal(source.topic, item.topic, item.id)
    }
  }
})

test('長文の原形推定は uses/used と主要な語尾変化を誤認しない', () => {
  const expected = {
    uses: 'use',
    used: 'use',
    studied: 'study',
    tried: 'try',
    running: 'run',
    planned: 'plan',
  }
  for (const [surface, id] of Object.entries(expected)) {
    assert.ok(lemmaCandidates(surface).includes(id), surface)
    assert.equal(resolvePassageWord(surface, {})?.id, id, surface)
  }
})

test('各長文に内容理解問題があり、正解が選択肢に含まれる', () => {
  assert.deepEqual(
    new Set(PASSAGES.map((passage) => passage.level)),
    new Set(['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']),
  )
  for (const passage of PASSAGES) {
    const questions = getReadingQuestions(passage.id)
    assert.equal(questions.length, READING_QUESTION_COUNTS[passage.level], passage.id)
    for (const question of questions) assert.ok(question.choices.includes(question.answer), passage.id)
  }
})

test('長文は級別の本試験上限対策語数と段落構成を満たす', () => {
  for (const passage of PASSAGES) {
    const target = READING_WORD_COUNT_TARGETS[passage.level]
    const count = passageWordCount(passage)
    assert.ok(target, passage.level)
    assert.ok(count >= target.min && count <= target.max, `${passage.id}: ${count}語`)
    assert.ok(
      passage.sentences.filter((sentence) => sentence.paragraphStart).length >= 2,
      `${passage.id}: 段落`,
    )
  }
})

test('英会話ノベルの返答話者と遷移先は解決できる', () => {
  for (const episode of VN_EPISODES) {
    assert.ok(episode.nodes[episode.start], episode.id)
    for (const [nodeId, node] of Object.entries(episode.nodes)) {
      if (node.next) assert.ok(episode.nodes[node.next], `${episode.id}/${nodeId}`)
      for (const choice of node.choices ?? []) {
        assert.ok(episode.nodes[choice.next], `${episode.id}/${nodeId}`)
        if (choice.reply) {
          const speaker = choice.reply.speaker ?? node.speaker
          assert.notEqual(speaker, 'narration', `${episode.id}/${nodeId}`)
          assert.ok(SPEAKERS[speaker], `${episode.id}/${nodeId}/${speaker}`)
        }
      }
    }
  }
})

test('進捗コードはVNクリア状況を保持し、不正な型を拒否する', () => {
  const base = {
    srs: {},
    kotenSrs: {},
    kotenInterpretationSrs: {},
    myList: [],
    kotenWordList: ['k001'],
    kotenGrammarList: ['kg_neg_zu'],
    readingsDone: [],
    mathDone: [],
    mathMastery: {},
    skillStats: {},
    engPos: null,
    vnCleared: ['ep1_first_day'],
    portalOrder: [],
    portalHidden: [],
    stats: {},
    settings: {},
  }
  const restored = decodeProgress(encodeProgress(base))
  assert.deepEqual(restored.vnCleared, ['ep1_first_day'])
  assert.deepEqual(restored.kotenWordList, ['k001'])
  assert.deepEqual(restored.kotenGrammarList, ['kg_neg_zu'])
  assert.throws(() => decodeProgress(encodeProgress({ ...base, srs: [] })), /srs/)
})

test('古典短文は単語・文法・常識を備え、登録先をすべて解決できる', () => {
  assert.ok(KOTEN_INTERPRETATIONS.length >= 30)
  assert.deepEqual(
    new Set(KOTEN_INTERPRETATIONS.map((item) => item.level)),
    new Set(KOTEN_INTERPRETATION_LEVELS.map((item) => item.id)),
  )
  assert.deepEqual(
    new Set(KOTEN_INTERPRETATIONS.map((item) => item.focus)),
    new Set(Object.keys(KOTEN_INTERPRETATION_FOCUS)),
  )
  assert.equal(new Set(KOTEN_GRAMMAR.map((item) => item.id)).size, KOTEN_GRAMMAR.length)

  for (const item of KOTEN_INTERPRETATIONS) {
    assert.equal(item.choices.length, 4, item.id)
    assert.equal(new Set(item.choices).size, 4, item.id)
    assert.ok(item.choices.includes(item.answer), item.id)
    assert.ok(item.vocabTip && item.grammarTip && item.culture?.title && item.culture?.body, item.id)
    assert.ok(item.wordIds.length > 0 && item.wordIds.every(getKoten), item.id)
    assert.ok(item.grammarIds.length > 0 && item.grammarIds.every(getKotenGrammar), item.id)
  }
})

test('古典短文の事前確認セットと実際の出題idは12問以内で一致する', () => {
  const sourceIds = KOTEN_INTERPRETATIONS.map((item) => item.id)
  const picked = pickKotenInterpretationIds(
    [...sourceIds, sourceIds[0], 'unknown'],
    { size: 12, rng: () => 0.25 },
  )
  assert.equal(picked.length, 12)
  assert.equal(new Set(picked).size, picked.length)
  assert.ok(picked.every((id) => sourceIds.includes(id)))
})

test('ディクテーションは全級に専用問題があり、文長が級ごとに段階化されている', () => {
  const levelOrder = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
  const ids = new Set()
  const texts = new Set()
  let previousAverage = 0

  for (const level of levelOrder) {
    const profile = DICTATION_PROFILES[level]
    const items = dictationByLevel(level)
    assert.ok(profile, level)
    assert.ok(items.length >= 20, `${level}: ${items.length}問`)
    assert.ok(new Set(items.map((item) => item.topic)).size >= 6, `${level}: 話題の幅`)
    assert.ok(new Set(items.map((item) => item.focus)).size >= 6, `${level}: 構文の幅`)

    for (const item of items) {
      assert.ok(!ids.has(item.id), `${item.id}: id重複`)
      assert.ok(!texts.has(item.text.toLowerCase()), `${item.id}: 英文重複`)
      ids.add(item.id)
      texts.add(item.text.toLowerCase())
      assert.ok(item.text && item.ja && item.topic && item.kind && item.focus, item.id)
      assert.ok(
        item.wordCount >= profile.wordRange[0] && item.wordCount <= profile.wordRange[1],
        `${item.id}: ${item.wordCount}語`,
      )
    }

    const average = items.reduce((sum, item) => sum + item.wordCount, 0) / items.length
    assert.ok(average > previousAverage, `${level}: 平均${average.toFixed(1)}語`)
    previousAverage = average
  }

  assert.equal(ids.size, DICTATION_ITEMS.length)
  assert.equal(DICTATION_PROFILES['5'].recommendedPlays, 2)
  assert.equal(DICTATION_PROFILES['4'].recommendedPlays, 2)
  for (const level of ['pre2', '2', 'pre1', '1']) {
    assert.equal(DICTATION_PROFILES[level].recommendedPlays, 1, level)
  }
})

test('ディクテーション採点は句読点と大文字を許容し、語の抜け・余分・誤綴りを検出する', () => {
  const target = 'My sister walks to school every morning.'
  const exact = scoreDictation('my sister walks to school every morning', target)
  assert.equal(exact.exact, true)
  assert.equal(exact.score, 100)

  const missing = scoreDictation('My sister walks school every morning!', target)
  assert.equal(missing.exact, false)
  assert.ok(missing.alignment.some((part) => part.status === 'missing' && part.target === 'to'))

  const extra = scoreDictation('My sister quickly walks to school every morning.', target)
  assert.ok(extra.alignment.some((part) => part.status === 'extra' && part.answer === 'quickly'))

  const spelling = scoreDictation('My sister works to school every morning.', target)
  assert.ok(spelling.alignment.some((part) => part.status === 'incorrect'))

  const apostrophe = scoreDictation(
    "It strengthens workers' bargaining power.",
    'It strengthens workers’ bargaining power.',
  )
  assert.equal(apostrophe.exact, true)
})

test('ディクテーションの級別デッキと間違い復習は専用問題だけを返す', () => {
  const deck = buildDictationDeck(
    { type: 'level', levelId: '3' },
    { size: 8, rng: () => 0.25 },
  )
  assert.equal(deck.length, 8)
  assert.ok(deck.every((item) => item.level === '3'))
  assert.equal(new Set(deck.map((item) => item.id)).size, deck.length)

  const ids = deck.slice(0, 3).map((item) => item.id)
  const reviewDeck = buildDictationDeck(
    { type: 'dictationList', ids, levelId: '3' },
    { size: 0, rng: () => 0.5 },
  )
  assert.deepEqual(new Set(reviewDeck.map((item) => item.id)), new Set(ids))
})

test('リスニングは全級20問で、形式・放送回数・情報量が級別設計に一致する', () => {
  const levelOrder = ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']
  const ids = new Set()
  const stimuli = new Set()
  let previousAverage = 0

  for (const level of levelOrder) {
    const profile = LISTENING_PROFILES[level]
    const items = listeningByLevel(level)
    assert.ok(profile, level)
    assert.equal(items.length, 20, `${level}: ${items.length}問`)
    assert.ok(new Set(items.map((item) => item.topic)).size >= 6, `${level}: 話題の幅`)
    assert.ok(new Set(items.map((item) => item.answer)).size >= 3, `${level}: 正解位置`)

    for (const [type, target] of Object.entries(profile.typeTargets)) {
      assert.equal(
        items.filter((item) => item.type === type).length,
        target,
        `${level}/${type}`,
      )
    }

    for (const item of items) {
      assert.ok(!ids.has(item.id), `${item.id}: id重複`)
      ids.add(item.id)
      assert.ok(LISTENING_TYPE_META[item.type], item.id)
      assert.equal(item.plays, profile.plays[item.type], `${item.id}: 放送回数`)
      assert.equal(
        item.choices.length,
        LISTENING_TYPE_META[item.type].spokenChoices ? 3 : 4,
        `${item.id}: 選択肢数`,
      )
      assert.ok(item.choices.some((choice) => choice.id === item.answer), item.id)
      assert.equal(new Set(item.choices.map((choice) => choice.text)).size, item.choices.length)

      const spoken = listeningSpokenSegments(item)
      assert.ok(spoken.length > 0, item.id)
      const stimulus = spoken.map((segment) => segment.text.toLowerCase()).join(' ')
      assert.ok(!stimuli.has(stimulus), `${item.id}: 音声重複`)
      stimuli.add(stimulus)

      if (LISTENING_TYPE_META[item.type].spokenChoices) {
        const choiceSegments = spoken.slice(-item.choices.length)
        choiceSegments.forEach((segment, index) => {
          assert.ok(segment.text.startsWith(`Number ${index + 1}.`), item.id)
        })
        assert.deepEqual(
          shuffledListeningChoices(item, () => 0).map((choice) => choice.id),
          item.choices.map((choice) => choice.id),
          `${item.id}: 音声番号を固定`,
        )
      } else {
        assert.equal(spoken.at(-1).speaker, 'Q', `${item.id}: 最後に設問`)
        assert.equal(spoken.at(-1).text, item.question, `${item.id}: 設問本文`)
      }
    }

    const average = items.reduce((sum, item) => sum + item.wordCount, 0) / items.length
    assert.ok(average > previousAverage, `${level}: 平均${average.toFixed(1)}語`)
    previousAverage = average
  }

  assert.equal(ids.size, LISTENING_ITEMS.length)
  assert.deepEqual(LISTENING_PROFILES['5'].plays, {
    response: 2,
    conversation: 2,
    picture: 2,
  })
  assert.equal(LISTENING_PROFILES['3'].plays.response, 1)
  assert.equal(LISTENING_PROFILES['3'].plays.conversation, 2)
  for (const level of ['pre2', 'pre2plus', '2', 'pre1', '1']) {
    assert.ok(Object.values(LISTENING_PROFILES[level].plays).every((plays) => plays === 1), level)
  }
})

test('リスニングの級別デッキと間違い復習は専用問題だけを返す', () => {
  for (const level of ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']) {
    const deck = buildListeningDeck(
      { type: 'level', levelId: level },
      { size: 10, rng: () => 0.25 },
    )
    assert.equal(deck.length, 10, level)
    assert.ok(deck.every((item) => item.level === level), level)
    assert.equal(new Set(deck.map((item) => item.id)).size, deck.length, level)
    assert.deepEqual(
      new Set(deck.map((item) => item.type)),
      new Set(Object.keys(LISTENING_PROFILES[level].typeTargets)),
      `${level}: 10問でも全形式を含む`,
    )
  }

  const ids = listeningByLevel('pre1').slice(0, 4).map((item) => item.id)
  const reviewDeck = buildListeningDeck(
    { type: 'listeningList', ids, levelId: 'pre1' },
    { size: 0, rng: () => 0.5 },
  )
  assert.deepEqual(new Set(reviewDeck.map((item) => item.id)), new Set(ids))
})
