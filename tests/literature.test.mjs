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
import { createLearningAnalytics } from '../src/lib/learningAnalytics.js'
import { useStore } from '../src/store/useStore.js'

test('名作交互朗読は英語3作品・古典3作品を一意IDで収録する', () => {
  assert.equal(literatureByKind('english').length, 3)
  assert.equal(literatureByKind('classical').length, 3)
  assert.equal(PUBLIC_DOMAIN_LITERATURE.length, 6)
  assert.equal(
    new Set(PUBLIC_DOMAIN_LITERATURE.map((work) => work.id)).size,
    PUBLIC_DOMAIN_LITERATURE.length,
  )
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    assert.equal(getLiteratureWork(work.id), work)
    assert.match(work.id, /^lit_(?:en|ja)_/)
    assert.ok(work.scenes.length >= 5, work.id)
    assert.match(work.source.url, /^https:\/\//)
    assert.ok(work.rights.basis.includes('70年'), work.id)
    assert.ok(work.rights.translation.includes('本アプリ独自'), work.id)
  }
})

test('全場面が原文・訳・解説を持ち、古文は読み仮名を備える', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const [index, scene] of work.scenes.entries()) {
      const at = `${work.id}:${index + 1}`
      assert.ok(scene.original.trim(), `${at}: 原文`)
      assert.ok(scene.translation.trim(), `${at}: 訳`)
      assert.ok(scene.guide.trim(), `${at}: 解説`)
      if (work.kind === 'classical') assert.ok(scene.speech?.trim(), `${at}: 読み仮名`)
    }
    if (work.kind === 'english') {
      assert.ok(literatureWordCount(work) >= 130, `${work.id}: 長文語数`)
    }
  }
})

test('朗読順は全作品・全場面で必ず原文→訳になる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    const steps = buildLiteratureNarration(work)
    assert.equal(steps.length, work.scenes.length * 2, work.id)
    for (const [index, step] of steps.entries()) {
      const expectedPhase = index % 2 === 0 ? 'original' : 'translation'
      assert.equal(step.phase, expectedPhase, step.id)
      assert.equal(step.sceneIndex, Math.floor(index / 2), step.id)
      assert.equal(narrationStepIndex(step.sceneIndex, step.phase), index, step.id)
      assert.ok(step.text)
      assert.equal(step.lang, expectedPhase === 'translation' ? 'ja-JP' : work.language)
    }
  }
})

test('作品語彙・古典文法は既存の共通学習データへ解決できる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const id of work.wordIds) assert.ok(getWord(id), `${work.id}: ${id}`)
    for (const id of work.kotenWordIds) assert.ok(getKoten(id), `${work.id}: ${id}`)
    for (const id of work.grammarIds) assert.ok(getKotenGrammar(id), `${work.id}: ${id}`)
  }
})

test('読了集計は通常長文IDを混ぜず、種類別にも数えられる', () => {
  const [english, classical] = [
    literatureByKind('english')[0],
    literatureByKind('classical')[0],
  ]
  const done = ['p_5_lost_notebook', english.id, classical.id, 'unknown']
  assert.equal(literatureCompletionCount(done), 2)
  assert.equal(literatureCompletionCount(done, 'english'), 1)
  assert.equal(literatureCompletionCount(done, 'classical'), 1)
})

test('名作読了は既存の同期対象へ保存し、初回だけ分野別分析へ加算する', () => {
  const before = useStore.getState()
  const english = literatureByKind('english')[0]
  const classical = literatureByKind('classical')[0]
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

  const state = useStore.getState()
  assert.deepEqual(state.readingsDone, [english.id, classical.id])
  assert.equal(state.learningAnalytics.skills.reading.inputs, english.scenes.length)
  assert.equal(
    state.learningAnalytics.skills.koten_reading.inputs,
    classical.scenes.length,
  )
  assert.equal(
    state.learningAnalytics.inputs,
    english.scenes.length + classical.scenes.length,
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
  const map = readFileSync(new URL('../src/screens/EnglishMap.jsx', import.meta.url), 'utf8')
  const store = readFileSync(new URL('../src/store/useStore.js', import.meta.url), 'utf8')

  assert.match(app, /literatureLibrary:\s*LiteratureLibraryScreen/)
  assert.match(app, /literatureReader:\s*LiteratureReaderScreen/)
  assert.match(reader, /speakWith\(/)
  assert.match(reader, /markLiteratureDone\(/)
  assert.match(map, /PASSAGE_IDS\.has\(id\)/)
  assert.match(store, /learningAnalytics:\s*recordLearningEvent/)
})
