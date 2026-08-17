import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { ReadingRoleSentence } from '../src/components/ReadingRoleSentence.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  buildReadingRoleAnnotation,
  READING_ROLE_CODES,
  readingSentenceRoleParts,
} from '../src/lib/reading-role-annotations.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'

test('全24長文・全567文の最上段英文へSVOCM等の役割を欠落なく直接対応させる', () => {
  const allowedRoles = new Set(READING_ROLE_CODES)
  const impliedSubjects = []
  let sentenceCount = 0
  let roleSegmentCount = 0
  let renderedRoleSegmentCount = 0

  for (const passage of PASSAGES) {
    for (const [sentenceIndex, sentence] of passage.sentences.entries()) {
      sentenceCount++
      const analysis = analyzeReadingSentence(sentence)
      const parts = readingSentenceRoleParts(analysis)
      const annotation = buildReadingRoleAnnotation(sentence.en, parts)
      const at = `${passage.id}: 第${sentenceIndex + 1}文`

      assert.deepEqual(annotation.errors, [], `${at}: 最上段の役割対応が不完全`)
      assert.equal(
        annotation.segments.map((segment) => segment.sourceText).join(''),
        sentence.en,
        `${at}: 構文ラベルから原文を完全復元できない`,
      )
      assert.equal(annotation.annotatedWordCount, annotation.sourceWordCount, `${at}: 未対応語がある`)
      assert.ok(annotation.segments.every((segment) => allowedRoles.has(segment.role)), `${at}: 不明な役割`)
      assert.ok(annotation.segments.some((segment) => segment.role === 'V'), `${at}: V表示がない`)

      if (annotation.impliedSubject) {
        impliedSubjects.push({ passageId: passage.id, sentenceIndex, en: sentence.en })
      } else {
        assert.ok(annotation.segments.some((segment) => segment.role === 'S'), `${at}: S表示がない`)
      }

      const html = renderToStaticMarkup(ReadingRoleSentence({
        sentence: sentence.en,
        parts,
      }))
      assert.match(html, /data-reading-role-status="complete"/, `${at}: 完全表示にならない`)
      assert.doesNotMatch(html, /\bunderline\b/, `${at}: 意味のない単語下線が残っている`)
      const renderedSegments = html.match(/data-reading-role="/g)?.length ?? 0
      assert.equal(renderedSegments, annotation.segments.length, `${at}: 役割ラベルの描画欠落`)

      roleSegmentCount += annotation.segments.length
      renderedRoleSegmentCount += renderedSegments
    }
  }

  assert.equal(PASSAGES.length, 24)
  assert.equal(sentenceCount, 567)
  assert.equal(roleSegmentCount, 4784)
  assert.equal(renderedRoleSegmentCount, 4784)
  assert.deepEqual(impliedSubjects, [{
    passageId: 'p_5_school_open_day',
    sentenceIndex: 5,
    en: 'Please bring your own drinks.',
  }])
})

test('役割ラベルは対応する下線の下にSVOCMを表示する', () => {
  const sentence = PASSAGES[0].sentences[0]
  const parts = readingSentenceRoleParts(analyzeReadingSentence(sentence))
  const html = renderToStaticMarkup(ReadingRoleSentence({ sentence: sentence.en, parts }))

  assert.match(html, /data-reading-role="S"/)
  assert.match(html, /data-reading-role="V"/)
  assert.match(html, /data-reading-role="C"/)
  assert.match(html, />S 主語</)
  assert.match(html, />V 動詞</)
  assert.match(html, />C 補語</)
  assert.match(html, /border-b-\[3px\]/)
  assert.ok(html.indexOf('border-b-[3px]') < html.indexOf('>S 主語<'))
})
