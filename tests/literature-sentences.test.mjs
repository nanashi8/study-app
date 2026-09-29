// 依頼 2026-09-29-literature-full-text-tap の条件 english-one-sentence。
// 英語6作品で、押す単位と構文解説の対象は必ず本文の1文にする（複数の文や、文の途中で切れた
// まとまりを「一文」として出さない）。1文の中に別の文の終わりがなく、全文をつなぐと本文と一字一句同じ。
// 朗読の区切りも文をまたがない。古典・漢文も、押す単位は「。」「？」で終わる1文。
import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

import { PUBLIC_DOMAIN_LITERATURE, literatureByKind } from '../src/data/public-domain-literature.js'
import {
  literatureParagraphs,
  literaturePartBreaks,
  literatureSentenceErrors,
  literatureSentences,
} from '../src/data/literature-sentences.js'

// 文の終わりらしき所：. ! ? （閉じる引用符・かっこが続いてもよい）のあとに空白、そして大文字（引用符が前に付いてもよい）。
const SENTENCE_END = /[.!?]["”’)]*\s+(?=["“‘(]?\s*[A-Z])/g
// 略語のピリオドは文の終わりではない（Mr. Bennet・Mrs. Long・Mme. Sofronie など）。
const ABBREVIATION = /\b(?:Mr|Mrs|Mme|Dr|St|Mt|Messrs)\.$/

// 引用符の範囲（“…” と ‘…’）。‘ の閉じは、うしろに文字が続かない ’（it’s などのアポストロフィは除く）。
function quoteSpans(text) {
  const spans = []
  for (const [open, close] of [['“', /”/g], ['‘', /’(?![A-Za-z])/g]]) {
    let from = 0
    for (;;) {
      const start = text.indexOf(open, from)
      if (start < 0) break
      close.lastIndex = start + 1
      const end = close.exec(text)?.index ?? text.length
      spans.push({ start, end })
      from = end + 1
    }
  }
  return spans
}

// 押す単位の中の、文の終わりらしき所。地の文に埋め込まれた引用（say to itself, “Oh dear! Oh dear! …” のように、
// 引用の前に地の文がある）の中は、引用した言葉の区切りなので数えない。
function innerSentenceEnds(text) {
  const spans = quoteSpans(text)
  const found = []
  for (const match of text.matchAll(SENTENCE_END)) {
    const at = match.index
    if (ABBREVIATION.test(text.slice(0, at + 1))) continue
    const embedded = spans.some((span) => span.start < at && at < span.end && /[A-Za-z]/.test(text.slice(0, span.start)))
    if (embedded) continue
    found.push(text.slice(Math.max(0, at - 30), at + 20))
  }
  return found
}

test('英語6作品の全624文：押す単位の中に別の文の終わりがない（引用の中の区切りは、地の文に埋め込んだ引用だけ）', () => {
  let total = 0
  let embeddedQuotes = 0
  for (const work of literatureByKind('english')) {
    for (const sentence of literatureSentences(work)) {
      total += 1
      assert.deepEqual(innerSentenceEnds(sentence.text), [], `${sentence.id}: ${sentence.text}`)
      if ([...sentence.text.matchAll(SENTENCE_END)].some((match) => !ABBREVIATION.test(sentence.text.slice(0, match.index + 1)))) {
        embeddedQuotes += 1
      }
    }
  }
  assert.equal(total, 624)
  // 地の文に埋め込んだ引用の中で区切りがある文（アリス3文・賢者の贈り物2文）。増えたら1文ずつ読んで確かめる。
  assert.equal(embeddedQuotes, 5)
})

test('押す単位は文の終わりの記号で終わる。長い1文を分けた部分だけが ; : — などで終わる', () => {
  for (const work of literatureByKind('english')) {
    const sentences = literatureSentences(work)
    for (const [index, sentence] of sentences.entries()) {
      const core = sentence.text.trim().replace(/["”’)\]\s]+$/u, '')
      const last = core.slice(-1)
      if (sentence.partIndex < sentence.partCount - 1) {
        assert.ok(sentence.continues, `${sentence.id}: 続きのある部分`)
        continue
      }
      if (last === ':') {
        // 次の段落に掲示の文句を並べる前置き（白鯨の「この番組表はこうだったに違いない:」）だけ。
        assert.ok(sentences[index + 1]?.paragraphStart, `${sentence.id}: コロンで終わる文のあとは新しい段落`)
        continue
      }
      assert.match(last, /[.!?]/, `${sentence.id}: 文の終わりの記号で終わらない（${sentence.text.slice(-30)}）`)
    }
  }
})

test('全文をつなぐと本文と一字一句同じになり（6作品の指紋が一致）、朗読の区切りは文をまたがない', () => {
  for (const work of literatureByKind('english')) {
    assert.deepEqual(literatureSentenceErrors(work), [], work.id)
    const paragraphs = literatureParagraphs(work)
    assert.equal(paragraphs.length, work.scenes.length, `${work.id}: 段落＝場面`)
    for (const paragraph of paragraphs) {
      assert.equal(
        paragraph.sentences.map((sentence) => sentence.text).join(' '),
        work.scenes[paragraph.index].original,
        `${work.id} 段落${paragraph.index + 1}`,
      )
    }
    const fullText = literatureSentences(work).map((sentence) => sentence.text).join(' ')
    assert.equal(createHash('sha256').update(fullText).digest('hex'), work.coverage.sourceSha256, `${work.id}: 本文の指紋`)
    const owner = new Map()
    for (const sentence of literatureSentences(work)) {
      for (const segment of sentence.segments) {
        const key = `${segment.sceneIndex}:${segment.segmentIndex}`
        assert.equal(owner.has(key), false, `${work.id}: 区切り ${key} が2つの文にまたがる`)
        owner.set(key, sentence.number)
      }
    }
    const segmentCount = work.scenes.reduce((sum, scene) => sum + scene.narrationSegments.length, 0)
    assert.equal(owner.size, segmentCount, `${work.id}: 文に入っていない区切りがある`)
  }
})

test('長い1文を分けた部分は番号がつながり、分けた位置を解説で示す（二都物語・アリス・幸福な王子の9文）', () => {
  const allowed = new Set(['セミコロン（;）のところ', 'コロン（:）のところ', 'ダッシュ（—）のところ', 'かっこに入った語りの前後'])
  let groups = 0
  for (const work of literatureByKind('english')) {
    const sentences = literatureSentences(work)
    for (const [index, sentence] of sentences.entries()) {
      if (sentence.partCount < 2) {
        assert.deepEqual(literaturePartBreaks(sentences, index), [], sentence.id)
        continue
      }
      const start = index - sentence.partIndex
      assert.equal(sentences[start].partIndex, 0, sentence.id)
      assert.equal(sentences[start + sentence.partCount - 1].partIndex, sentence.partCount - 1, sentence.id)
      const labels = literaturePartBreaks(sentences, index)
      assert.ok(labels.length > 0, `${sentence.id}: 分けた位置の説明がない`)
      for (const label of labels) {
        assert.ok(allowed.has(label) || /^[a-z]+ の前$/.test(label), `${sentence.id}: ${label}`)
      }
      if (sentence.partIndex === 0) groups += 1
    }
  }
  assert.equal(groups, 9)
})

test('古典・漢文も押す単位は「。」「？」で終わる1文で、文の中に別の文の終わりがない（全50文）', () => {
  let total = 0
  for (const work of PUBLIC_DOMAIN_LITERATURE.filter((item) => item.kind !== 'english')) {
    assert.deepEqual(literatureSentenceErrors(work), [], work.id)
    for (const sentence of literatureSentences(work)) {
      total += 1
      const text = sentence.text
      assert.match(text, /[。？！][」』）]*$/u, `${sentence.id}: 文の終わり`)
      // 「。」などのあとに閉じかっこ以外が続く所があれば、2文以上が入っている。
      assert.doesNotMatch(text.replace(/[。？！][」』）]*$/u, ''), /[。？！](?![」』）])/u, `${sentence.id}: ${text}`)
    }
  }
  assert.equal(total, 50)
})
