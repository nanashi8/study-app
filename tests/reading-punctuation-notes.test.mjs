// 依頼 2026-09-29-literature-full-text-tap の条件 punctuation-explained。
// 英語長文の — ： ；（ダッシュ・コロン・セミコロン）のすべてに、その文でその記号が何を表すか
// （挿入・言い換え・具体例・理由・並べる区切り・話の転換など）の解説を書き、一文の構文解説に出す。
// 対象は長文読解42本の全文と、名作英語6作品の全文。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ANNOTATED_PASSAGES } from '../src/data/passages.js'
import { READING_SENTENCE_STRUCTURES } from '../src/data/reading-structures/index.js'
import { literatureByKind } from '../src/data/public-domain-literature.js'
import { literatureSentences } from '../src/data/literature-sentences.js'
import { buildPunctuationNotes, punctuationOccurrences } from '../src/lib/punctuation-notes.js'

const count = (html, attribute) => html.split(attribute).length - 1

// 長文読解：構造台帳のある全文（42本）。
function readingSentences() {
  return ANNOTATED_PASSAGES.flatMap((passage) => passage.sentences.map((sentence, index) => ({
    id: sentence.reviewId,
    text: sentence.en,
    marks: READING_SENTENCE_STRUCTURES[passage.id]?.[index]?.marks ?? [],
  })))
}

// 名作英語：6作品の全文（台帳の文）。
function literatureEnglishSentences() {
  return literatureByKind('english').flatMap((work) => literatureSentences(work).map((sentence) => ({
    id: sentence.id,
    text: sentence.text,
    marks: sentence.entry.marks ?? [],
  })))
}

function tally(sentences) {
  const byMark = { '—': 0, ':': 0, ';': 0 }
  let withMarks = 0
  for (const sentence of sentences) {
    const occurrences = punctuationOccurrences(sentence.text)
    if (occurrences.length) withMarks += 1
    for (const occurrence of occurrences) byMark[occurrence.mark] += 1
    const notes = buildPunctuationNotes(sentence.text, sentence.marks)
    assert.deepEqual(notes.errors, [], `${sentence.id}: ${sentence.text}`)
    assert.equal(notes.count, occurrences.length, sentence.id)
    for (const note of notes.notes) {
      assert.ok(note.text.length >= 12, `${sentence.id}: ${note.mark} の説明が短い`)
      assert.match(note.text, /[ぁ-んァ-ヶ一-龠]/u, `${sentence.id}: ${note.mark} の説明が日本語でない`)
    }
  }
  return { byMark, withMarks, sentences: sentences.length }
}

test('長文読解42本の全1,518文：記号のある16文の : 4個・; 12個すべてに、その文での働きの説明がある（ダッシュは0個）', () => {
  const result = tally(readingSentences())
  assert.equal(ANNOTATED_PASSAGES.length, 42)
  assert.equal(result.sentences, 1518)
  assert.equal(result.withMarks, 16)
  assert.deepEqual(result.byMark, { '—': 0, ':': 4, ';': 12 })
})

test('名作英語6作品の全624文：— 53個・: 28個・; 100個のすべてに、その文での働きの説明がある', () => {
  const result = tally(literatureEnglishSentences())
  assert.equal(result.sentences, 624)
  assert.deepEqual(result.byMark, { '—': 53, ':': 28, ';': 100 })
})

let vite
let detail

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  detail = {
    component: (await vite.ssrLoadModule('/src/components/ReadingSentenceDetail.jsx')).ReadingSentenceDetail,
    reading: await vite.ssrLoadModule('/src/lib/reading-grammar.js'),
    passages: await vite.ssrLoadModule('/src/data/passages.js'),
    literature: await vite.ssrLoadModule('/src/data/public-domain-literature.js'),
    sentences: await vite.ssrLoadModule('/src/data/literature-sentences.js'),
    analysis: await vite.ssrLoadModule('/src/lib/literature-sentence-analysis.js'),
  }
})

after(async () => {
  await vite?.close()
})

test('一文の構文解説の「記号の働き」に、記号のある文の記号がすべて出る（長文読解・名作英語の両方）', () => {
  const h = React.createElement
  let shownReading = 0
  for (const passage of detail.passages.ANNOTATED_PASSAGES) {
    for (const sentence of passage.sentences) {
      const marks = punctuationOccurrences(sentence.en).length
      if (!marks) continue
      const html = renderToStaticMarkup(h(detail.component, {
        sentence,
        sentenceAnalysis: detail.reading.analyzeReadingSentence(sentence),
      }))
      const notes = buildPunctuationNotes(sentence.en, detail.reading.analyzeReadingSentence(sentence).structure?.marks ?? []).notes.length
      assert.ok(html.includes(`data-reading-punctuation-notes="${notes}"`), `${sentence.reviewId}: 記号の働きの欄`)
      assert.equal(count(html, 'data-reading-punctuation-mark='), notes, sentence.reviewId)
      shownReading += 1
    }
  }
  assert.equal(shownReading, 16)
  let shownLiterature = 0
  for (const work of detail.literature.literatureByKind('english')) {
    for (const sentence of detail.sentences.literatureSentences(work)) {
      if (!punctuationOccurrences(sentence.text).length) continue
      const html = renderToStaticMarkup(h(detail.component, {
        sentence,
        sentenceAnalysis: detail.analysis.analyzeLiteratureSentence(sentence),
      }))
      const notes = buildPunctuationNotes(sentence.text, sentence.entry.marks).notes.length
      assert.ok(html.includes(`data-reading-punctuation-notes="${notes}"`), `${sentence.id}: 記号の働きの欄`)
      assert.equal(count(html, 'data-reading-punctuation-mark='), notes, sentence.id)
      shownLiterature += 1
    }
  }
  assert.ok(shownLiterature > 0)
})
