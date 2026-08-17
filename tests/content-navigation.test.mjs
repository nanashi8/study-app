import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { CONTENTS, DEFAULT_CONTENT_ORDER } from '../src/data/contents.js'

test('主要コンテンツは指定順を保ち、英語アプリから英和辞書と語源へ直接進める', async () => {
  assert.deepEqual(DEFAULT_CONTENT_ORDER, [
    'eigo-quest',
    'koten-quest',
    'kanbun-quest',
    'literature-listening',
    'math-quest',
    'other-subjects',
  ])
  assert.deepEqual(CONTENTS.map((item) => item.title), [
    '英語アプリ',
    '古典アプリ',
    '漢文アプリ',
    '名作に親しむ',
    '数学アプリ',
    'その他',
  ])
  assert.equal(CONTENTS.some((item) => item.id === 'eigo-dict'), false)

  const homeSource = await readFile(new URL('../src/screens/Home.jsx', import.meta.url), 'utf8')
  const vocabLevelsSource = await readFile(new URL('../src/screens/VocabLevels.jsx', import.meta.url), 'utf8')
  assert.match(homeSource, /id: 'dictionary', label: '英和辞書'/)
  assert.match(homeSource, /screen: 'vocabSearch'/)
  assert.doesNotMatch(homeSource, /data-home-etymology-check/)
  assert.match(homeSource, /id: 'etymology', label: '語源'/)
  assert.match(homeSource, /screen: 'roots'/)
  assert.match(vocabLevelsSource, /data-vocab-etymology-entry/)
  assert.ok(vocabLevelsSource.includes("navigate('roots')"))
})

test('英語名作画面は準備・構文・読解ルール・根拠付き設問・完了ゲートを備える', async () => {
  const source = await readFile(new URL('../src/screens/LiteratureReader.jsx', import.meta.url), 'utf8')
  for (const contract of [
    'data-literature-reading-preparation',
    'data-literature-syntax-trigger',
    'data-reading-role-card="direct-labels"',
    'data-literature-sentence-rules',
    'data-literature-reading-check',
    'item.evidenceScene',
    'disabled={isEnglish && !completed && !allQuestionsAnswered}',
  ]) {
    assert.ok(source.includes(contract), `英語名作の構成要件が不足: ${contract}`)
  }
})
