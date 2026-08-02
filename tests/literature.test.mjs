import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { getWord } from '../src/data/vocab.js'
import { getKoten } from '../src/data/koten.js'
import { getKotenGrammar } from '../src/data/koten-grammar.js'
import {
  PUBLIC_DOMAIN_LITERATURE,
  getLiteratureWork,
  literatureByKind,
  literatureCompletionCount,
  literatureWordCount,
} from '../src/data/public-domain-literature.js'
import {
  buildLiteratureNarration,
  narrationStepIndex,
} from '../src/lib/literature.js'
import { japanesePhraseSpeechText } from '../src/lib/phrase-speech.js'
import { createLearningAnalytics } from '../src/lib/learningAnalytics.js'
import { useStore } from '../src/store/useStore.js'

test('名作に親しむは英語3作品・古典3作品・漢文3作品を一意IDで収録する', () => {
  assert.equal(literatureByKind('english').length, 3)
  assert.equal(literatureByKind('classical').length, 3)
  assert.equal(literatureByKind('kanbun').length, 3)
  assert.equal(PUBLIC_DOMAIN_LITERATURE.length, 9)
  assert.equal(
    new Set(PUBLIC_DOMAIN_LITERATURE.map((work) => work.id)).size,
    PUBLIC_DOMAIN_LITERATURE.length,
  )
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    assert.equal(getLiteratureWork(work.id), work)
    assert.match(work.id, /^lit_(?:en|ja|zh)_/)
    assert.ok(work.scenes.length >= 5, work.id)
    assert.match(work.source.url, /^https:\/\//)
    assert.ok(work.rights.basis.includes('70年'), work.id)
    assert.ok(work.rights.translation.includes('本アプリ独自'), work.id)
  }
})

test('全59場面が原文・訳・解説と、間で区切った一対一の朗読データを持つ', () => {
  let sceneCount = 0
  let segmentCount = 0
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const [index, scene] of work.scenes.entries()) {
      const at = `${work.id}:${index + 1}`
      sceneCount += 1
      assert.ok(scene.original.trim(), `${at}: 原文`)
      assert.ok(scene.translation.trim(), `${at}: 訳`)
      assert.ok(scene.guide.trim(), `${at}: 解説`)
      if (work.kind !== 'english') assert.ok(scene.speech?.trim(), `${at}: 読み上げ文`)
      assert.ok(scene.narrationSegments.length >= 2, `${at}: 間の区切り`)
      segmentCount += scene.narrationSegments.length

      const joiner = work.kind === 'english' ? ' ' : ''
      assert.equal(
        scene.narrationSegments.map((segment) => segment.original).join(joiner),
        scene.original,
        `${at}: 区切りから原文を復元`,
      )
      assert.equal(
        scene.narrationSegments.map((segment) => segment.speech).join(joiner),
        scene.speech || scene.original,
        `${at}: 区切りから読み上げ文を復元`,
      )
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const segmentAt = `${at}:${segmentIndex + 1}`
        assert.ok(segment.original.trim(), `${segmentAt}: 区切り原文`)
        assert.ok(segment.translation.trim(), `${segmentAt}: 区切り訳`)
        assert.ok(segment.speech.trim(), `${segmentAt}: 音声原稿`)
        assert.match(segment.translation, /[ぁ-んァ-ヶ一-龠]/, `${segmentAt}: 日本語訳`)
      }
    }
    if (work.kind === 'english') {
      assert.ok(literatureWordCount(work) >= 130, `${work.id}: 長文語数`)
    }
  }
  assert.equal(sceneCount, 59)
  assert.equal(segmentCount, 257)
})

test('朗読順は全作品・全区切りで必ず原文→対応する直訳になる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    const steps = buildLiteratureNarration(work)
    const expectedSegmentCount = work.scenes.reduce(
      (count, scene) => count + scene.narrationSegments.length,
      0,
    )
    assert.equal(steps.length, expectedSegmentCount * 2, work.id)

    let expectedStepIndex = 0
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const originalStep = steps[expectedStepIndex]
        const translationStep = steps[expectedStepIndex + 1]
        assert.equal(originalStep.phase, 'original', originalStep.id)
        assert.equal(translationStep.phase, 'translation', translationStep.id)
        assert.equal(originalStep.sceneIndex, sceneIndex, originalStep.id)
        assert.equal(translationStep.sceneIndex, sceneIndex, translationStep.id)
        assert.equal(originalStep.segmentIndex, segmentIndex, originalStep.id)
        assert.equal(translationStep.segmentIndex, segmentIndex, translationStep.id)
        assert.equal(originalStep.displayText, segment.original, originalStep.id)
        assert.equal(
          translationStep.text,
          japanesePhraseSpeechText(segment.translation),
          translationStep.id,
        )
        assert.equal(translationStep.displayText, segment.translation, translationStep.id)
        assert.equal(originalStep.lang, work.language, originalStep.id)
        assert.equal(translationStep.lang, 'ja-JP', translationStep.id)
        assert.equal(
          narrationStepIndex(work, sceneIndex, segmentIndex, 'original'),
          expectedStepIndex,
          originalStep.id,
        )
        assert.equal(
          narrationStepIndex(work, sceneIndex, segmentIndex, 'translation'),
          expectedStepIndex + 1,
          translationStep.id,
        )
        expectedStepIndex += 2
      }
    }
  }
})

test('接続の受け直しは括弧付きで表示し、括弧内の語だけを日本語音声で読む', () => {
  const work = getLiteratureWork('lit_en_alice_rabbit_hole')
  const segments = work.scenes[4].narrationSegments
  assert.deepEqual(
    segments.slice(0, 2).map(({ original, translation }) => ({ original, translation })),
    [
      { original: 'But when', translation: 'しかし、その時' },
      {
        original: 'the Rabbit actually took a watch',
        translation: 'ウサギが本当に時計を取り出した（時）',
      },
    ],
  )

  const translationStep = buildLiteratureNarration(work).find(
    (step) =>
      step.sceneIndex === 4 &&
      step.segmentIndex === 1 &&
      step.phase === 'translation',
  )
  assert.ok(translationStep)
  assert.equal(translationStep.displayText, 'ウサギが本当に時計を取り出した（時）')
  assert.equal(translationStep.text, 'ウサギが本当に時計を取り出した時')
  assert.doesNotMatch(translationStep.text, /[（）()]/u)
})

test('指定されたアリスの場面は、実際に間を置く6区切りで英語→直訳になる', () => {
  const work = getLiteratureWork('lit_en_alice_rabbit_hole')
  const segments = work.scenes[6].narrationSegments
  assert.deepEqual(
    segments.map((segment) => segment.original),
    [
      'In another moment',
      'down went Alice',
      'after it,',
      'never once considering how',
      'in the world',
      'she was to get out again.',
    ],
  )
  assert.deepEqual(
    buildLiteratureNarration(work)
      .filter((step) => step.sceneIndex === 6)
      .map((step) => step.phase),
    [
      'original',
      'translation',
      'original',
      'translation',
      'original',
      'translation',
      'original',
      'translation',
      'original',
      'translation',
      'original',
      'translation',
    ],
  )
})

test('漢文3作品は全17場面で原文を表示し、書き下し→現代語訳の順に読む', () => {
  const works = literatureByKind('kanbun')
  assert.deepEqual(
    works.map((work) => work.id),
    [
      'lit_zh_lunyu_learning',
      'lit_zh_mengzi_fifty_steps',
      'lit_zh_hanfeizi_contradiction',
    ],
  )
  assert.equal(works.reduce((count, work) => count + work.scenes.length, 0), 17)

  for (const work of works) {
    const steps = buildLiteratureNarration(work)
    assert.equal(work.language, 'ja-JP', work.id)
    assert.match(work.source.url, /^https:\/\/zh\.wikisource\.org\//, work.id)
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      assert.notEqual(scene.original, scene.speech, `${work.id}:${sceneIndex + 1}`)
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const originalIndex = narrationStepIndex(
          work,
          sceneIndex,
          segmentIndex,
          'original',
        )
        assert.equal(steps[originalIndex].displayText, segment.original)
        assert.equal(steps[originalIndex].text, segment.speech)
        assert.equal(steps[originalIndex].label, '書き下し文')
        assert.equal(steps[originalIndex + 1].displayText, segment.translation)
        assert.equal(steps[originalIndex + 1].phase, 'translation')
      }
    }
  }

  assert.equal(
    getLiteratureWork('lit_zh_hanfeizi_contradiction').scenes[4].original,
    '其人弗能應也。',
  )
})

test('作品語彙・古典文法は既存の共通学習データへ解決できる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const id of work.wordIds) assert.ok(getWord(id), `${work.id}: ${id}`)
    for (const id of work.kotenWordIds) assert.ok(getKoten(id), `${work.id}: ${id}`)
    for (const id of work.grammarIds) assert.ok(getKotenGrammar(id), `${work.id}: ${id}`)
  }
})

test('読了集計は通常長文IDを混ぜず、種類別にも数えられる', () => {
  const [english, classical, kanbun] = [
    literatureByKind('english')[0],
    literatureByKind('classical')[0],
    literatureByKind('kanbun')[0],
  ]
  const done = ['p_5_lost_notebook', english.id, classical.id, kanbun.id, 'unknown']
  assert.equal(literatureCompletionCount(done), 3)
  assert.equal(literatureCompletionCount(done, 'english'), 1)
  assert.equal(literatureCompletionCount(done, 'classical'), 1)
  assert.equal(literatureCompletionCount(done, 'kanbun'), 1)
})

test('名作読了は既存の同期対象へ保存し、初回だけ分野別分析へ加算する', () => {
  const before = useStore.getState()
  const english = literatureByKind('english')[0]
  const classical = literatureByKind('classical')[0]
  const kanbun = literatureByKind('kanbun')[0]
  useStore.setState({
    readingsDone: [],
    learningAnalytics: createLearningAnalytics(),
  })

  useStore.getState().markLiteratureDone(english.id, 'reading', english.scenes.length)
  useStore.getState().markLiteratureDone(english.id, 'reading', english.scenes.length)
  useStore.getState().markLiteratureDone(
    classical.id,
    'koten_reading',
    classical.scenes.length,
  )
  useStore.getState().markLiteratureDone(
    kanbun.id,
    'koten_reading',
    kanbun.scenes.length,
  )

  const state = useStore.getState()
  assert.deepEqual(state.readingsDone, [english.id, classical.id, kanbun.id])
  assert.equal(state.learningAnalytics.skills.reading.inputs, english.scenes.length)
  assert.equal(
    state.learningAnalytics.skills.koten_reading.inputs,
    classical.scenes.length + kanbun.scenes.length,
  )
  assert.equal(
    state.learningAnalytics.inputs,
    english.scenes.length + classical.scenes.length + kanbun.scenes.length,
  )

  useStore.setState({
    readingsDone: before.readingsDone,
    learningAnalytics: before.learningAnalytics,
  })
})

test('画面導線・連続TTS・通常長文の分離集計を実装している', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const reader = readFileSync(
    new URL('../src/screens/LiteratureReader.jsx', import.meta.url),
    'utf8',
  )
  const library = readFileSync(
    new URL('../src/screens/LiteratureLibrary.jsx', import.meta.url),
    'utf8',
  )
  const contents = readFileSync(new URL('../src/data/contents.js', import.meta.url), 'utf8')
  const koten = readFileSync(new URL('../src/screens/KotenList.jsx', import.meta.url), 'utf8')
  const map = readFileSync(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8')
  const store = readFileSync(new URL('../src/store/useStore.js', import.meta.url), 'utf8')

  assert.match(app, /literatureLibrary:\s*LiteratureLibraryScreen/)
  assert.match(app, /literatureReader:\s*LiteratureReaderScreen/)
  assert.match(reader, /playSpeechItems\(/)
  assert.match(reader, /segmentIndex/)
  assert.match(reader, /NARRATION_PAUSE_MS/)
  assert.match(reader, /区切りの直訳/)
  assert.match(reader, /書き下し（朗読）/)
  assert.match(reader, /markLiteratureDone\(/)
  assert.match(library, /title="名作に親しむ"/)
  assert.match(library, /id: 'kanbun'/)
  assert.match(contents, /title: '名作に親しむ'/)
  assert.match(koten, /kind: 'kanbun'/)
  assert.match(map, /PASSAGE_IDS\.has\(id\)/)
  assert.match(store, /learningAnalytics:\s*recordLearningEvent/)
})
