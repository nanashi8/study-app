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
import {
  CHOICE_ONLY_EXPECTED_ROLE_PARTS,
  READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT,
  READING_FOCUS_ROLE_EXPECTED_COUNTS,
  READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT,
  READING_FOCUS_ROLE_EXPECTED_REVIEW_FINGERPRINT_COUNT,
  READING_FOCUS_ROLE_EXPECTED_SENTENCE_COUNT,
  READING_ONLY_ROLE_REVIEWS,
  auditReadingRoleQuality,
} from '../src/lib/reading-role-quality.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { buildSentenceStructure, STRUCTURE_DISPLAY_ROLE } from '../src/lib/reading-sentence-structure.js'
import { LITERATURE_SENTENCE_STRUCTURES } from '../src/data/literature-structures/index.js'
import { BASIC_READING_STRUCTURES } from '../src/data/basic-reading/structures/index.js'
import { READING_SENTENCE_STRUCTURES } from '../src/data/reading-structures/index.js'
import { layoutParallel, numberWords, textPieces } from '../src/lib/structure-parallel-layout.js'

test('全38長文・全990文の最上段英文へSVOCM等の役割を欠落なく直接対応させる', () => {
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

  assert.equal(PASSAGES.length, 38)
  assert.equal(sentenceCount, 990)
  assert.equal(roleSegmentCount, 7455)
  assert.equal(renderedRoleSegmentCount, 7455)
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

test('接続語の下線ラベルは種類だけを出し、「接続」と「接続詞」を重ねない', () => {
  const html = renderToStaticMarkup(ReadingRoleSentence({
    sentence: 'Shops welcomed the change because families had left.',
    parts: [
      { role: 'S', text: 'Shops' },
      { role: 'V', text: 'welcomed' },
      { role: 'O', text: 'the change' },
      { role: 'LINK', text: 'because', connector: '接続詞' },
      { role: 'S', text: 'families' },
      { role: 'V', text: 'had left' },
    ],
  }))
  assert.match(html, /data-reading-connector="接続詞"/)
  assert.doesNotMatch(html, />接続</)
  assert.equal(html.split('>接続詞<').length - 1, 1)
})

test('全174個の焦点語・74訂正と指摘文の全14役割・関連解説を人手正解表でGATEする', () => {
  const report = auditReadingRoleQuality(PASSAGES, analyzeReadingSentence)

  assert.deepEqual(report.errors, [])
  assert.equal(report.passageCount, 38)
  assert.equal(report.sentenceCount, 990)
  assert.equal(report.onlyOccurrenceCount, 23)
  assert.equal(report.reviewedOnlyOccurrenceCount, 23)
  assert.equal(report.focusOccurrenceCount, READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT)
  assert.equal(report.reviewedFocusOccurrenceCount, READING_FOCUS_ROLE_EXPECTED_OCCURRENCE_COUNT)
  assert.equal(report.focusCorrectionCount, READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT)
  assert.equal(report.appliedFocusCorrectionCount, READING_FOCUS_ROLE_EXPECTED_CORRECTION_COUNT)
  assert.equal(report.focusSentenceCount, READING_FOCUS_ROLE_EXPECTED_SENTENCE_COUNT)
  assert.equal(report.focusReviewFingerprintCount, READING_FOCUS_ROLE_EXPECTED_REVIEW_FINGERPRINT_COUNT)
  assert.deepEqual(report.focusCounts, READING_FOCUS_ROLE_EXPECTED_COUNTS)
  assert.equal(READING_ONLY_ROLE_REVIEWS.length, 23)
  assert.equal(CHOICE_ONLY_EXPECTED_ROLE_PARTS.length, 14)
})

// 短縮形を2つの要素に分けた所（[S It][V ’s]・[V let][O ’s]）。後ろの要素の頭の ’s・’ll などを数える。
const CONTRACTION_TAIL = /^['’](?:s|ll|re|ve|m|d|em)\b/i
// 前の要素の終わりに残ったアポストロフィ（「It’ ／ s」と切った誤り）。
const contractionCutBeforeApostrophe = (segment, next) =>
  /[A-Za-z]['’]\s*$/.test(segment.sourceText) && Boolean(next) && /^(?:s|ll|re|ve|m|d|em)\b/i.test(next.sourceText)
// 前の要素の終わりに残った開きの引用符（「says, "」と切った誤り）：“ ‘ と、空白や開きの記号のあとの "。
const openingQuoteLeftBehind = (segment) => /(?:^|[\s(<“‘])["“‘]\s*$|[“‘]\s*$/.test(segment.sourceText)
// 後ろの要素の頭に来た閉じの引用符（bag." の " を次へ動かした誤り）。
const closingQuoteMovedAhead = (segment) => /^\s*["”’](?=[\s.,!?;:)>]|$)/.test(segment.sourceText)

// 並列の縦そろえ（ReadingRoleSentence の parallelRoleChildren と同じ組み方）で、並びの枠の直前に取り残された開きの引用符。
// 枠の外に " だけの列ができ、その列に前の要素の下線が付く（"You can …, and I can …"）。
function strandedOpeningQuotes(annotation, parallel) {
  const pieces = numberWords(annotation.segments.flatMap((segment) => textPieces(segment.sourceText, { element: segment.index })))
  const found = []
  const walk = (row) => row.items.forEach((item, at) => {
    if (item.type === 'stack') return item.lines.forEach(walk)
    if (item.type === 'box') return walk(item.row)
    const opening = item.type === 'punct' &&
      ('“‘'.includes(item.text) || (item.text === '"' && (at === 0 || ['space', 'open'].includes(row.items[at - 1].type))))
    if (!opening) return
    let next = at + 1
    while (row.items[next]?.type === 'space') next++
    if (['stack', 'box'].includes(row.items[next]?.type)) found.push(item.text)
  })
  walk(layoutParallel(pieces, parallel))
  return found
}

/** 構造台帳の1文から、画面が部品へ渡す行（文の要素の行と、節・句の中の要素の行）を全部作る。 */
function structureRoleRows(entry) {
  // 画面に出す行だけを使うので、本文との照合（第1引数）は空で作る。
  const structure = buildSentenceStructure('', entry.markup, entry)
  const displayParts = (parts) => parts.map((part) => ({ role: STRUCTURE_DISPLAY_ROLE[part.role] ?? part.role, text: part.text }))
  return [
    { sentence: structure.markedSentence, parts: displayParts(structure.displayElements), parallel: structure.parallel ?? [] },
    ...structure.units.filter((unit) => unit.parts.length).map((unit) => ({ sentence: unit.marked, parts: displayParts(unit.parts), parallel: unit.parallel ?? [] })),
  ]
}

test('短縮形のアポストロフィと引用の始まりの引用符は、後ろの要素の側に出す（全構造台帳の文の要素と節・句の中の要素）', () => {
  // 2026-11-05 の誤りの確認で見つけた（requests/2026-11-05-exam-reading-a3.json の contraction-split）。
  // 原文を役割ごとに切るとき、It’s の ’ が It の側に入り「It’ ／ s」と出ていた（contraction-split）。
  // 引用の始まりの引用符も前の要素に付き「says, " ／ Please …」と出ていた（opening-quote-split）。
  const groups = {
    名作: LITERATURE_SENTENCE_STRUCTURES,
    基礎長文: BASIC_READING_STRUCTURES,
    長文: READING_SENTENCE_STRUCTURES,
  }
  const counts = {}
  for (const [name, ledgers] of Object.entries(groups)) {
    const count = { sentences: 0, rows: 0, tails: 0, tailSentences: 0, quoteStarts: 0, parallelRows: 0 }
    for (const [id, entries] of Object.entries(ledgers)) {
      entries.forEach((entry, index) => {
        if (!entry) return
        count.sentences++
        let tailsHere = 0
        for (const row of structureRoleRows(entry)) {
          count.rows++
          const annotation = buildReadingRoleAnnotation(row.sentence, row.parts, { allowMissingVerb: true })
          assert.equal(annotation.segments.map((segment) => segment.sourceText).join(''), row.sentence, `${name} ${id} 第${index + 1}文: 原文を切り分けて戻せない`)
          if (row.parallel.length && !annotation.errors.length) {
            count.parallelRows++
            assert.deepEqual(strandedOpeningQuotes(annotation, row.parallel), [], `${name} ${id} 第${index + 1}文: 開きの引用符が並列の枠の外に残っている`)
          }
          annotation.segments.forEach((segment, at) => {
            const next = annotation.segments[at + 1]
            assert.ok(!contractionCutBeforeApostrophe(segment, next), `${name} ${id} 第${index + 1}文: 「${segment.sourceText.trim()} ／ ${next?.sourceText.trim()}」と短縮形のアポストロフィが前の要素に入っている`)
            if (CONTRACTION_TAIL.test(segment.sourceText.trim())) tailsHere++
            if (next) assert.ok(!openingQuoteLeftBehind(segment), `${name} ${id} 第${index + 1}文: 「${segment.sourceText.trim()}」と開きの引用符が前の要素に残っている`)
            if (at > 0) assert.ok(!closingQuoteMovedAhead(segment), `${name} ${id} 第${index + 1}文: 「${segment.sourceText.trim()}」と閉じの引用符が後ろの要素に入っている`)
            if (at > 0 && /^["“‘]/.test(segment.sourceText)) count.quoteStarts++
          })
        }
        count.tails += tailsHere
        if (tailsHere) count.tailSentences++
      })
    }
    counts[name] = count
  }
  // 見つけたときの数（増えるのはよい）。短縮形は名作30文の34か所・基礎長文2文の2か所。長文の構造台帳は短縮形を分けていない。
  // 引用符で始まる2つ目以降の要素は、名作で直す前の0から81か所・基礎長文で0から7か所が加わった。
  // 並列の枠の外に残った開きの引用符は、直す前は名作32・基礎長文6か所（並列のある行は名作442・基礎長文287・長文889行）。
  assert.ok(counts.名作.parallelRows >= 442 && counts.基礎長文.parallelRows >= 287 && counts.長文.parallelRows >= 889, JSON.stringify(counts))
  assert.ok(counts.名作.tails >= 34 && counts.名作.tailSentences >= 30, JSON.stringify(counts.名作))
  assert.ok(counts.基礎長文.tails >= 2 && counts.基礎長文.tailSentences >= 2, JSON.stringify(counts.基礎長文))
  assert.ok(counts.名作.quoteStarts >= 81 && counts.基礎長文.quoteStarts >= 7, JSON.stringify(counts))
  assert.ok(counts.名作.sentences >= 624 && counts.基礎長文.sentences >= 611 && counts.長文.sentences >= 1518, JSON.stringify(counts))

  // 部品の表示でも、後ろの要素は ’s のまま出て、前の要素の語にアポストロフィが付かない。
  const html = renderToStaticMarkup(ReadingRoleSentence({
    sentence: 'It’s Christmas Eve, boy.',
    parts: [
      { role: 'S', text: 'It' },
      { role: 'V', text: '’s' },
      { role: 'C', text: 'Christmas Eve' },
      { role: 'IND', text: 'boy' },
    ],
  }))
  assert.match(html, /<span>’s<\/span>/)
  assert.doesNotMatch(html, /It’</)
  const letUs = buildReadingRoleAnnotation('Now let’s begin the lesson.', [
    { role: 'M', text: 'Now' },
    { role: 'V', text: 'let' },
    { role: 'O', text: '’s' },
    { role: 'C', text: 'begin the lesson' },
  ])
  assert.deepEqual(letUs.segments.map((segment) => segment.sourceText.trim()), ['Now', 'let', '’s', 'begin the lesson.'])
  const quoted = buildReadingRoleAnnotation('The sign also says, "Please close the gate." He nodded.', [
    { role: 'S', text: 'The sign' },
    { role: 'M', text: 'also' },
    { role: 'V', text: 'says' },
    { role: 'O', text: 'Please close the gate' },
    { role: 'S', text: 'He' },
    { role: 'V', text: 'nodded' },
  ])
  assert.deepEqual(quoted.segments.map((segment) => segment.sourceText.trim()), ['The sign', 'also', 'says,', '"Please close the gate."', 'He', 'nodded.'])
  const curly = buildReadingRoleAnnotation('said his lady to him one day, “have you heard?”', [
    { role: 'V', text: 'said' },
    { role: 'S', text: 'his lady' },
    { role: 'M', text: 'to him' },
    { role: 'M', text: 'one day' },
    { role: 'O', text: 'have you heard' },
  ], { allowMissingVerb: true })
  assert.deepEqual(curly.segments.map((segment) => segment.sourceText.trim()), ['said', 'his lady', 'to him', 'one day,', '“have you heard?”'])
})
