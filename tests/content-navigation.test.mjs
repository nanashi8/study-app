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
    'social-quest',
    'science-quest',
  ])
  assert.deepEqual(CONTENTS.map((item) => item.title), [
    '英語アプリ',
    '古典アプリ',
    '漢文アプリ',
    '名作に親しむ',
    '数学アプリ',
    '社会アプリ',
    '理科アプリ',
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
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
  const reader = await read('../src/screens/LiteratureReader.jsx')
  const fullText = await read('../src/components/LiteratureFullText.jsx')
  const sheet = await read('../src/components/LiteratureSentenceSheet.jsx')
  const detail = await read('../src/components/ReadingSentenceDetail.jsx')
  // 読む画面は全文を段落ごとに見せ、文を押すと長文読解と同じ一文の構文解説（読解ルールつき）が開く。
  for (const [source, contract] of [
    [reader, 'data-literature-reading-preparation'],
    [reader, '<LiteratureFullText'],
    [reader, '<LiteratureSentenceSheet'],
    [fullText, 'data-literature-syntax-trigger'],
    [sheet, '<ReadingSentenceDetail'],
    [detail, 'data-reading-role-card="direct-labels"'],
    [detail, 'data-reading-rules-for-sentence'],
    [reader, 'data-literature-reading-check'],
    [reader, 'item.evidenceSentence'],
    [reader, 'disabled={isEnglish && !completed && !allQuestionsAnswered}'],
  ]) {
    assert.ok(source.includes(contract), `英語名作の構成要件が不足: ${contract}`)
  }
})
