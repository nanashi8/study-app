import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getWord } from '../src/data/vocab.js'
import { getKoten } from '../src/data/koten.js'
import { getKanbunVocab } from '../src/data/kanbun-vocab.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import {
  PUBLIC_DOMAIN_LITERATURE,
  literatureByKind,
  literatureWordCount,
} from '../src/data/public-domain-literature.js'
import {
  LITERATURE_ENGLISH_CONTEXT_GLOSS,
  LITERATURE_ENGLISH_FORM_ALIASES,
  LITERATURE_ENGLISH_GLOSS,
  buildLiteratureVocabulary,
  resolveLiteratureEnglishWord,
} from '../src/data/literature-vocabulary.js'
import { LITERATURE_FULL_TEXT_GLOSS } from '../src/data/literature-full-text/gloss.js'
import { tokenize } from '../src/lib/text.js'

const here = new URL('../', import.meta.url)
const source = (path) => readFileSync(new URL(path, here), 'utf8')

test('全12作品・全158場面の本文語彙が未対応0件で全3,801枚の予習カードになる', () => {
  let sceneCount = 0
  let occurrenceCount = 0
  let coveredCount = 0
  let cardCount = 0

  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    const vocabulary = buildLiteratureVocabulary(work)
    sceneCount += work.scenes.length
    occurrenceCount += vocabulary.totalOccurrences
    coveredCount += vocabulary.coveredOccurrences
    cardCount += vocabulary.entries.length

    assert.ok(vocabulary.entries.length > 0, work.id)
    assert.equal(vocabulary.missingOccurrences.length, 0, work.id)
    assert.equal(
      vocabulary.coveredOccurrences,
      vocabulary.totalOccurrences,
      work.id,
    )
    assert.equal(
      new Set(vocabulary.entries.map((entry) => entry.id)).size,
      vocabulary.entries.length,
      `${work.id}: card id`,
    )
    if (work.kind === 'english') {
      assert.equal(literatureWordCount(work), vocabulary.totalOccurrences, work.id)
    }
    for (const entry of vocabulary.entries) {
      assert.ok(entry.id, `${work.id}: id`)
      assert.ok(entry.word?.trim(), `${work.id}: word`)
      assert.ok(entry.meanings?.every((meaning) => meaning.trim()), `${work.id}: meaning`)
      assert.ok(entry.lang, `${work.id}: lang`)
      assert.ok(entry.reviewDomain, `${work.id}: review domain`)
    }
  }

  assert.equal(sceneCount, 158)
  assert.equal(occurrenceCount, 11916)
  assert.equal(coveredCount, 11916)
  assert.equal(cardCount, 3801)
})

test('英語6作品は本文11,765語・出現形3,902種を全件解決し、共通辞書2,880語へ接続する', () => {
  let tokenCount = 0
  let uniqueFormCount = 0
  let sharedCardCount = 0
  const unresolvedKeys = new Set()

  for (const work of literatureByKind('english')) {
    const vocabulary = buildLiteratureVocabulary(work)
    const tokens = work.scenes.flatMap((scene) =>
      tokenize(scene.original).filter((token) => token.word))
    const tokenKeys = new Set(tokens.map((token) => token.key))
    const coveredForms = new Set(
      vocabulary.entries.flatMap((entry) =>
        entry.sourceForms.map((form) => tokenize(form)[0]?.key).filter(Boolean)),
    )

    tokenCount += tokens.length
    uniqueFormCount += tokenKeys.size
    sharedCardCount += vocabulary.sharedEntries.length
    for (const key of tokenKeys) {
      if (!resolvePassageWord(key)) unresolvedKeys.add(key)
    }

    assert.deepEqual([...coveredForms].sort(), [...tokenKeys].sort(), work.id)
    assert.deepEqual(vocabulary.sharedIds, work.wordIds, `${work.id}: shared ids`)
    assert.ok(work.wordIds.length >= 68, `${work.id}: full shared deck`)
    assert.equal(new Set(work.wordIds).size, work.wordIds.length, work.id)
    for (const id of work.wordIds) assert.ok(getWord(id), `${work.id}: ${id}`)
  }

  assert.equal(tokenCount, 11765)
  assert.equal(uniqueFormCount, 3902)
  assert.equal(sharedCardCount, 2880)
  assert.deepEqual(
    [...unresolvedKeys].sort(),
    [...new Set([
      ...Object.keys(LITERATURE_ENGLISH_GLOSS),
      ...Object.keys(LITERATURE_FULL_TEXT_GLOSS),
    ])].filter((key) => !resolvePassageWord(key)).sort(),
    '共通辞書外の出現形は作品用語義で過不足なく補う',
  )
  for (const [key, meaning] of Object.entries(LITERATURE_FULL_TEXT_GLOSS)) {
    assert.match(meaning, /[ぁ-んァ-ヶ一-龠]/, `${key}: 日本語語義`)
    assert.doesNotMatch(meaning, /翻訳エラー|さらに表示|star_border/, key)
  }
})

test('空白のない句読点でも語を落とさず、作品文脈の意味と正しい共通語へ結び付ける', () => {
  assert.deepEqual(
    tokenize('reefs—commerce see?—Posted stand—miles way—in')
      .filter((token) => token.word)
      .map((token) => token.key),
    ['reefs', 'commerce', 'see', 'posted', 'stand', 'miles', 'way', 'in'],
  )

  for (const work of literatureByKind('english')) {
    for (const scene of work.scenes) {
      const expectedWords = scene.original.match(
        /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:-[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*)*/g,
      ) ?? []
      assert.deepEqual(
        tokenize(scene.original).filter((token) => token.word).map((token) => token.word),
        expectedWords,
        `${work.id}: raw token coverage`,
      )
    }
  }

  const contextCases = [
    ['lit_en_moby_dick_water_gazers', 2, 'right', null, '右へ'],
    ['lit_en_pride_prejudice_netherfield', 0, 'little', 'little', 'ほとんど〜ない'],
    ['lit_en_tale_two_cities_times', 2, 'lord', 'lord', '主・キリスト'],
    ['lit_en_alice_rabbit_hole', 1, 'out', 'out', '普通から外れて'],
    ['lit_en_happy_prince_statue', 0, 'leaves', 'leaf', '薄い葉・箔（leafの複数）'],
    ['lit_en_gift_of_magi_opening', 0, 'made', 'make', '〜からできている'],
    ['lit_en_gift_of_magi_opening', 1, '8', null, '8ドル（金額）'],
  ]
  for (const [workId, sceneIndex, key, id, ja] of contextCases) {
    assert.deepEqual(
      resolveLiteratureEnglishWord(key, { workId, sceneIndex }),
      { ja, id, literatureOnly: !id },
      `${workId}: ${key}`,
    )
  }

  for (const [key, alias] of Object.entries(LITERATURE_ENGLISH_FORM_ALIASES)) {
    assert.ok(getWord(alias.id), `${key}: ${alias.id}`)
  }

  for (const work of literatureByKind('english')) {
    const tokenKeysByScene = work.scenes.map((scene) => new Set(
      tokenize(scene.original).filter((token) => token.word).map((token) => token.key),
    ))
    for (const key of Object.keys(LITERATURE_ENGLISH_CONTEXT_GLOSS[work.id] ?? {})) {
      const sceneKey = key.match(/^(\d+):(.*)$/)
      const found = sceneKey
        ? tokenKeysByScene[Number(sceneKey[1]) - 1]?.has(sceneKey[2])
        : tokenKeysByScene.some((keys) => keys.has(key))
      assert.ok(found, `${work.id}: unused context gloss ${key}`)
    }
  }
})

test('古典3作品は共通古典単語35語と本文103区切りを、漢文3作品は共通漢語35語と本文48区切りを学べる', () => {
  const classical = literatureByKind('classical')
  const kanbun = literatureByKind('kanbun')

  assert.deepEqual(classical.map((work) => work.kotenWordIds.length), [13, 11, 11])
  assert.deepEqual(kanbun.map((work) => work.kanbunVocabIds.length), [14, 13, 8])

  let classicalSegments = 0
  let kanbunSegments = 0
  for (const work of classical) {
    const vocabulary = buildLiteratureVocabulary(work)
    classicalSegments += vocabulary.contextEntries.length
    assert.equal(vocabulary.sharedEntries.length, work.kotenWordIds.length, work.id)
    for (const id of work.kotenWordIds) assert.ok(getKoten(id), `${work.id}: ${id}`)
  }
  for (const work of kanbun) {
    const vocabulary = buildLiteratureVocabulary(work)
    kanbunSegments += vocabulary.contextEntries.length
    assert.equal(vocabulary.sharedEntries.length, work.kanbunVocabIds.length, work.id)
    for (const id of work.kanbunVocabIds) {
      assert.ok(getKanbunVocab(id), `${work.id}: ${id}`)
    }
  }

  assert.equal(classicalSegments, 103)
  assert.equal(kanbunSegments, 48)
})

test('全作品の読む前に共通予習導線があり、一覧・検索・カード・3分野の保存先を備える', () => {
  const reader = source('src/screens/LiteratureReader.jsx')
  const sheet = source('src/components/LiteratureVocabularySheet.jsx')

  assert.match(reader, /data-literature-vocabulary-preparation=\{work\.id\}/)
  assert.match(reader, /data-literature-vocabulary-open/)
  assert.match(reader, /本文語彙を予習/)
  assert.match(reader, /addManyToMyList\(sharedWordIds\)/)
  assert.match(reader, /addManyToKotenWordList\(sharedWordIds\)/)
  assert.match(reader, /addManyToKanbunList\('vocab', sharedWordIds\)/)
  assert.match(reader, /navigate\('kanbunStudy'/)

  assert.match(sheet, /data-literature-vocabulary-sheet/)
  assert.match(sheet, /data-literature-vocabulary-missing/)
  assert.match(sheet, /本文語彙を検索/)
  assert.match(sheet, /カードで暗記/)
  assert.match(sheet, /RevealAnswersToggle/)
  assert.match(sheet, /reviewKoten\(entry\.id, result\)/)
  assert.match(sheet, /reviewKanbun\('vocab', entry\.id, result\)/)
  assert.match(sheet, /data-literature-vocabulary-complete/)
})
