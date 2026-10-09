import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { MEANING_READINGS } from '../src/data/meaning-readings.js'
import { meaningSegments, meaningWithReadings } from '../src/lib/meaningReadings.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('読みにくい語だけに（よみ）を添え、ほかはそのまま出す', () => {
  assert.equal(meaningWithReadings('家禽・鶏肉'), '家禽（かきん）・鶏肉')
  assert.deepEqual(meaningSegments('家禽・鶏肉'), [
    { text: '家禽', entry: '家禽', reading: 'かきん' },
    { text: '・鶏肉' },
  ])
  assert.equal(meaningWithReadings('上がる・昇る・立ち上がる'), '上がる・昇る・立ち上がる')
})

test('長い語から当て、熟語の途中からは当てない', () => {
  assert.equal(meaningWithReadings('大喝采'), '大喝采（だいかっさい）')
  assert.equal(meaningWithReadings('喝采する'), '喝采（かっさい）する')
  assert.equal(meaningWithReadings('居心地のよい'), '居心地（いごこち）のよい')
  assert.equal(meaningWithReadings('施す'), '施す（ほどこす）')
  assert.equal(meaningWithReadings('実施する'), '実施する')
})

test('文中にもう読みが書いてある語には重ねない', () => {
  assert.equal(meaningWithReadings('灌漑(かんがい)'), '灌漑(かんがい)')
})

test('台帳の読みはひらがなで、同じ語を2回載せない', () => {
  const texts = MEANING_READINGS.map(([text]) => text)
  assert.equal(new Set(texts).size, texts.length)
  for (const [text, reading] of MEANING_READINGS) assert.match(reading, /^[ぁ-ゖー・]+$/u, text)
})

test('英単語の意味を出す画面は、読みを添える部品を通して表示する', () => {
  for (const file of [
    'src/screens/VocabStudy.jsx',
    'src/screens/WordDetail.jsx',
    'src/screens/VocabQuiz.jsx',
    'src/screens/VocabSearch.jsx',
    'src/screens/EtymologyStudy.jsx',
    'src/screens/WritingPlay.jsx',
    // 名作は全文表示の段落ごとの和訳と、文を押した解説（英語は ReadingSentenceDetail）で出す。
    'src/components/LiteratureFullText.jsx',
    'src/components/LiteratureSentenceSheet.jsx',
    'src/components/WordBits.jsx',
    'src/components/WordRelations.jsx',
    'src/components/ExplainedText.jsx',
    'src/components/ExtendedReader.jsx',
    'src/components/ReadingSentenceDetail.jsx',
    'src/components/VocabularyHistoryRow.jsx',
    'src/components/LearningContentCatalog.jsx',
  ]) {
    // 解説の文を出す部品（ExplainedText）は、中で MeaningText を通す。
    assert.match(read(file), /<MeaningText>|<ExplainedText>/, file)
  }
  // 長文の単語まとめは、共通のスワイプ一覧（行は VocabularyHistoryRow.jsx の LearningRecordRow）へ英語の教材として渡し、
  // 行が意味に読みを添える。
  assert.match(read('src/screens/ReadingSummary.jsx'), /<NormalLearningRecordList[\s\S]*?titleLanguage="en"/)
  assert.match(read('src/components/NormalLearningRecordList.jsx'), /titleLanguage=\{titleLanguage\}/)
  // テストの選択肢も読みを添えて出す（正誤の判定は元の文字列のまま）。
  assert.match(read('src/screens/VocabQuiz.jsx'), /<MeaningText>\{quizMeaning\(option\)\}<\/MeaningText>/)
})
