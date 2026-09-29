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
import { literatureSentences } from '../src/data/literature-sentences.js'
import { tokenize } from '../src/lib/text.js'

const here = new URL('../', import.meta.url)
const source = (path) => readFileSync(new URL(path, here), 'utf8')

// 英語は段落を場面にしている（2026-09-29 全文表示へ）。高慢と偏見は挿絵の説明7語を本文から外し、
// 孟子は返り点が区切りをまたぐ2区切りを1つにした。
test('全12作品・全247場面の本文語彙が未対応0件で全3,799枚の予習カードになる', () => {
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

  assert.equal(sceneCount, 247)
  assert.equal(occurrenceCount, 11908)
  assert.equal(coveredCount, 11908)
  assert.equal(cardCount, 3799)
})

test('英語6作品は本文11,758語・出現形3,902種を全件解決し、共通辞書2,880語へ接続する', () => {
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

  assert.equal(tokenCount, 11758)
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

  // 同じ作品でも文によって意味が変わる語は、文の番号つきの語義を使う（番号は literature-sentences.js の文の番号）。
  const contextCases = [
    ['lit_en_moby_dick_water_gazers', 10, 'right', 'right', '右へ'],
    ['lit_en_pride_prejudice_netherfield', 2, 'little', 'little', 'ほとんど〜ない'],
    ['lit_en_tale_two_cities_times', 5, 'lord', 'lord', '主・キリスト'],
    ['lit_en_alice_rabbit_hole', 4, 'out', 'out', '普通から外れて'],
    ['lit_en_happy_prince_statue', 2, 'leaves', 'leaf', '薄い葉・箔（leafの複数）'],
    ['lit_en_gift_of_magi_opening', 10, 'made', 'make', '〜からできている'],
    ['lit_en_gift_of_magi_opening', 12, '8', null, '8ドル（金額）'],
  ]
  for (const [workId, sentenceNumber, key, id, ja] of contextCases) {
    assert.deepEqual(
      resolveLiteratureEnglishWord(key, { workId, sentenceNumber }),
      { ja, id, literatureOnly: !id },
      `${workId}: ${key}`,
    )
  }
  // 場面ごとに引いていたころは、同じ場面の別の文の out（take a watch out of …）・went（the rabbit-hole went …）にも
  // 「普通から外れて」「入って行った」を出していた。文ごとに引くので、その文では共通辞書の意味になる。
  assert.equal(resolveLiteratureEnglishWord('out', { workId: 'lit_en_alice_rabbit_hole', sentenceNumber: 5 }).ja, '外へ・外に')
  assert.equal(resolveLiteratureEnglishWord('went', { workId: 'lit_en_alice_rabbit_hole', sentenceNumber: 8 }).ja, '行った（goの過去形）')

  for (const [key, alias] of Object.entries(LITERATURE_ENGLISH_FORM_ALIASES)) {
    assert.ok(getWord(alias.id), `${key}: ${alias.id}`)
  }

  for (const work of literatureByKind('english')) {
    const tokenKeysBySentence = literatureSentences(work).map((sentence) => new Set(
      tokenize(sentence.text).filter((token) => token.word).map((token) => token.key),
    ))
    for (const key of Object.keys(LITERATURE_ENGLISH_CONTEXT_GLOSS[work.id] ?? {})) {
      assert.doesNotMatch(key, /^\d+:/, `${work.id}: 場面の番号で引く語義 ${key} が残っている`)
      const sentenceKey = key.match(/^s(\d+):(.*)$/)
      const found = sentenceKey
        ? tokenKeysBySentence[Number(sentenceKey[1]) - 1]?.has(sentenceKey[2])
        : tokenKeysBySentence.some((keys) => keys.has(key))
      assert.ok(found, `${work.id}: unused context gloss ${key}`)
    }
  }
})

test('古典3作品は共通古典単語35語と本文103区切りを、漢文3作品は共通漢語35語と本文47区切りを学べる', () => {
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
  assert.equal(kanbunSegments, 47)
})

test('全作品の読む前に共通予習導線があり、一覧・検索・カード・3分野の保存先を備える', () => {
  const reader = source('src/screens/LiteratureReader.jsx')
  const sheet = source('src/components/LiteratureVocabularySheet.jsx')
  const sentenceSheet = source('src/components/LiteratureSentenceSheet.jsx')
  const detail = source('src/components/ReadingSentenceDetail.jsx')

  assert.match(reader, /data-literature-vocabulary-preparation=\{work\.id\}/)
  assert.match(reader, /data-literature-vocabulary-open/)
  assert.match(reader, /本文語彙を予習/)
  // 本文語彙は、英語・古典・漢文のどの作品でも、画面下部の「単語帳」で選んだ登録先へまとめて入れる（1語ずつも同じ）。
  assert.match(reader, /useWordBookSlot\(notebookRefs\(sharedWordDomain, sharedWordIds\)/)
  assert.match(reader, /: work\?\.kind === 'classical'\s*\? 'kotenVocab'\s*: 'kanbunVocab'/)
  // 本文の英単語を押したときの単語帳ボタンは、一文の構文解説（長文読解と同じ部品）が持つ。
  assert.match(sentenceSheet, /<ReadingSentenceDetail/)
  assert.match(detail, /useWordBookSlot\(activeWord\?\.id \? \[wordBookRef\(activeWord\.id\)\] : \[\]/)
  assert.match(reader, /useWordBookSlot\(notebookRefs\('kotenGrammar', work\?\.grammarIds \?\? \[\]\)/)
  assert.doesNotMatch(reader, /<WordListSheet/)
  // フックは作品が見つからないときの早期 return より前に置く。
  assert.ok(reader.indexOf('useWordBookSlot(') < reader.indexOf('if (!work) {'))
  assert.doesNotMatch(reader, /addManyToMyList|toggleMyList|マイ単語に追加|addManyToKotenWordList|addManyToKotenGrammarList|addManyToKanbunList/)
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
