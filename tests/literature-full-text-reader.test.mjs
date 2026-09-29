// 依頼 2026-09-29-literature-full-text-tap の条件 full-text-tap・features-kept・screen-verified（テストの分）。
// 名作12作品の読む画面は、本文全体を段落ごとに続けて見せ（場面ごとにページを切り替えない）、
// 本文の文を押すと、その文の解説が開く。解説から前の文・次の文へ移れる。
// 読む画面が使う部品（LiteratureFullText・LiteratureSentenceBody・LiteratureSentenceNavigation）を
// 全作品・全文について実際に描いて確かめる。シートそのものは画面の外側へ描く仕組みなので、中身を描く。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const h = React.createElement
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const count = (html, attribute) => html.split(attribute).length - 1
const unescapeHtml = (text) => text
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
// ルビの読み（rt・rp）と、意味に添える小さな（よみ）を除いた、画面に本文として見える文字。
const visibleText = (html) => unescapeHtml(html
  .replace(/<rp>[^<]*<\/rp>/g, '')
  .replace(/<rt>[^<]*<\/rt>/g, '')
  .replace(/<span class="text-\[0\.72em\] font-bold opacity-70">（[^<]*）<\/span>/g, '')
  .replace(/<[^>]+>/g, ''))
const squeeze = (text) => text.replace(/\s+/g, ' ').trim()

let vite
let mods
const noop = () => {}

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  mods = {
    fullText: await vite.ssrLoadModule('/src/components/LiteratureFullText.jsx'),
    sheet: await vite.ssrLoadModule('/src/components/LiteratureSentenceSheet.jsx'),
    data: await vite.ssrLoadModule('/src/data/public-domain-literature.js'),
    sentences: await vite.ssrLoadModule('/src/data/literature-sentences.js'),
    vocabulary: await vite.ssrLoadModule('/src/data/literature-vocabulary.js'),
    narration: await vite.ssrLoadModule('/src/lib/literature.js'),
  }
})

after(async () => {
  await vite?.close()
})

const works = () => mods.data.PUBLIC_DOMAIN_LITERATURE

function renderFullText(work, options = {}) {
  const paragraphs = mods.sentences.literatureParagraphs(work)
  return renderToStaticMarkup(h(mods.fullText.LiteratureFullText, { work, paragraphs, onOpen: noop, ...options }))
}

function renderBody(work, index) {
  const sentences = mods.sentences.literatureSentences(work)
  return renderToStaticMarkup(h(mods.sheet.LiteratureSentenceBody, {
    work,
    sentences,
    index,
    onClose: noop,
    onPlayFrom: noop,
    playEnabled: true,
    activeWord: null,
    onWordTap: noop,
    resolveWord: (key) => mods.vocabulary.resolveLiteratureSentenceWord(work, sentences[index], key),
    onOpenWord: noop,
    onOpenGrammar: noop,
  }))
}

test('全12作品の読む画面は、本文全体を段落ごとに続けて描き、どの文も押せる（全674文）', () => {
  assert.equal(works().length, 12)
  let sentenceTotal = 0
  for (const work of works()) {
    const sentences = mods.sentences.literatureSentences(work)
    const paragraphs = mods.sentences.literatureParagraphs(work)
    assert.deepEqual(mods.sentences.literatureSentenceErrors(work), [], work.id)
    assert.equal(sentences.some((sentence) => sentence.provisional), false, `${work.id}: 文の台帳がない`)
    const html = renderFullText(work)
    assert.equal(count(html, 'data-literature-full-text='), 1, work.id)
    assert.equal(count(html, 'data-literature-paragraph='), paragraphs.length, `${work.id}: 段落`)
    assert.equal(count(html, 'data-literature-sentence='), sentences.length, `${work.id}: 押せる文`)
    for (const sentence of sentences) {
      assert.ok(html.includes(`data-literature-sentence="${sentence.number}"`), `${sentence.id}: 押せない`)
      assert.ok(html.includes(`aria-label="${sentence.number}番目の文の解説を開く"`), `${sentence.id}: 読み上げの名前`)
    }
    // 英語・古文は、画面に見える本文が全文と一字一句同じ（漢文は訓点つきの行で組むので、文ごとの行の数で見る）。
    if (work.kind === 'english') {
      assert.equal(
        squeeze(visibleText(html)),
        squeeze(work.scenes.map((scene) => scene.original).join(' ')),
        `${work.id}: 本文全体`,
      )
    } else if (work.kind === 'classical') {
      assert.equal(visibleText(html).replace(/\s+/g, ''), work.scenes.map((scene) => scene.original).join(''), work.id)
    } else {
      assert.equal(count(html, '<button'), sentences.length, `${work.id}: 漢文は文ごとの行`)
    }
    sentenceTotal += sentences.length
  }
  assert.equal(sentenceTotal, 674)
})

test('訳の表示を入れると段落ごとに文の訳を全部出し、漢文は書き下し文も文ごとに出せる', () => {
  for (const work of works()) {
    const paragraphs = mods.sentences.literatureParagraphs(work)
    const html = renderFullText(work, { showTranslation: true, showKakikudashi: true })
    assert.equal(count(html, 'data-literature-paragraph-translation='), paragraphs.length, work.id)
    const shown = visibleText(html)
    for (const paragraph of paragraphs) {
      const ja = paragraph.sentences.map((sentence) => sentence.ja).join('')
      assert.ok(shown.replace(/\s+/g, '').includes(ja.replace(/\s+/g, '')), `${work.id} 段落${paragraph.index + 1}: 訳`)
    }
    if (work.kind === 'kanbun') {
      for (const sentence of mods.sentences.literatureSentences(work)) {
        assert.ok(shown.includes(sentence.entry.kakikudashi.replace(/[「」]/g, '').slice(0, 4)), `${sentence.id}: 書き下し文`)
      }
    }
  }
})

test('文を押して開く解説を全674文で描く：英語は台帳の構文解説、古文は読み・語句・文法、漢文は訓読文・書き下し文・読む順', () => {
  let rendered = 0
  for (const work of works()) {
    const sentences = mods.sentences.literatureSentences(work)
    for (const [index, sentence] of sentences.entries()) {
      const html = renderBody(work, index)
      rendered += 1
      const at = sentence.id
      assert.ok(html.includes(`data-literature-sentence-sheet="${sentence.number}"`), at)
      assert.ok(html.includes(`第${sentence.paragraphIndex + 1}段落・${sentence.number}番目の文`), `${at}: 位置`)
      assert.ok(html.includes('ここから交互再生'), `${at}: 交互再生`)
      const shown = visibleText(html)
      if (work.kind === 'english') {
        // 自動の解析ではなく、手で書いた構造台帳から作った解説を出す。
        assert.ok(html.includes('data-reading-role-card="direct-labels"'), `${at}: 文の要素`)
        assert.ok(html.includes('data-reading-structure="ledger"'), `${at}: 台帳の構文解説`)
        // 文の要素の下線（主節・節と句の行）が本文の語とずれずにすべて付く。
        assert.equal(html.includes('data-reading-role-status="incomplete"'), false, `${at}: 文の要素の下線がずれる`)
        assert.ok(shown.includes(sentence.ja), `${at}: 和訳`)
        assert.equal(html.includes('data-literature-sentence-part'), sentence.partCount > 1, `${at}: 長い文を分けた説明`)
      } else if (work.kind === 'classical') {
        assert.ok(html.includes(`data-literature-classical-detail="${sentence.number}"`), at)
        assert.ok(shown.includes(sentence.speech), `${at}: 読み`)
        assert.equal(count(html, 'data-literature-segments='), 1, `${at}: 区切りごとの現代語訳`)
        assert.equal(count(html, '<li class="border-l-2'), sentence.segments.length, `${at}: 区切りの数`)
        assert.ok(shown.includes(sentence.ja), `${at}: 現代語訳`)
        assert.ok(html.includes('data-literature-sentence-point'), `${at}: 読みのポイント`)
        assert.equal(count(html, 'data-literature-word-card='), sentence.entry.words.filter((word) => word.id).length, `${at}: 古典単語のカード`)
        assert.equal(count(html, 'data-literature-grammar-card='), sentence.entry.grammar.filter((item) => item.id).length, `${at}: 文法のカード`)
      } else {
        assert.ok(html.includes(`data-literature-kanbun-detail="${sentence.number}"`), at)
        assert.ok(html.includes('data-literature-reading-order='), `${at}: 返り点どおりに読む順`)
        assert.ok(html.includes('data-literature-kanbun-reading'), `${at}: 読み`)
        assert.ok(shown.includes(sentence.entry.reading), `${at}: 読み（ひらがな）`)
        assert.ok(shown.replace(/\s+/g, '').includes(sentence.entry.kakikudashi.replace(/\s+/g, '')), `${at}: 書き下し文`)
        assert.ok(shown.includes(sentence.ja), `${at}: 現代語訳`)
        assert.equal(count(html, 'data-literature-word-card='), sentence.entry.words.filter((word) => word.id).length, `${at}: 漢文のカード`)
        assert.equal(count(html, 'data-literature-grammar-card='), sentence.entry.grammar.filter((item) => item.id).length, `${at}: 句法のカード`)
      }
    }
  }
  assert.equal(rendered, 674)
})

test('解説の下で前の文・次の文へ移れ、最初と最後では行き止まりのボタンが押せない', () => {
  for (const work of works()) {
    const total = mods.sentences.literatureSentences(work).length
    const first = renderToStaticMarkup(h(mods.sheet.LiteratureSentenceNavigation, { index: 0, count: total, onMove: noop }))
    const middle = renderToStaticMarkup(h(mods.sheet.LiteratureSentenceNavigation, { index: 1, count: total, onMove: noop }))
    const last = renderToStaticMarkup(h(mods.sheet.LiteratureSentenceNavigation, { index: total - 1, count: total, onMove: noop }))
    assert.ok(first.includes('data-literature-sentence-navigation'), work.id)
    assert.equal(count(first, 'disabled=""'), 1, `${work.id}: 最初の文は前へ行けない`)
    assert.equal(count(middle, 'disabled=""'), 0, `${work.id}: 途中の文は前後へ行ける`)
    assert.equal(count(last, 'disabled=""'), 1, `${work.id}: 最後の文は次へ行けない`)
    assert.ok(first.includes(`1/${total}`), work.id)
  }
  const reader = read('src/screens/LiteratureReader.jsx')
  // 前後の文へ移るのも、文を押すのと同じ openSentence（開いた文を params に置く）で行う。
  assert.match(reader, /onMove=\{openSentence\}/)
  assert.match(reader, /onOpen=\{openSentence\}/)
})

test('白鯨の冒頭は1文ずつ：Call me Ishmael. だけを1文として押し、命令文の V・O・C を台帳から示す', () => {
  const moby = mods.data.getLiteratureWork('lit_en_moby_dick_water_gazers')
  const sentences = mods.sentences.literatureSentences(moby)
  assert.equal(sentences[0].text, 'Call me Ishmael.')
  assert.match(sentences[1].text, /^Some years ago — never mind how long precisely — having little or no money/)
  assert.match(sentences[1].text, /see the watery part of the world\.$/)
  const html = renderBody(moby, 0)
  assert.ok(html.includes('data-reading-structure="ledger"'))
  // 主節の要素は V（Call）・O（me）・C（Ishmael）で、修飾語 M にしない。
  for (const role of ['V', 'O', 'C']) {
    assert.ok(html.includes(`data-reading-role="${role}"`), `Call me Ishmael. の ${role}`)
  }
  assert.equal(html.includes('data-reading-role="M"'), false, 'Call me Ishmael. に M はない')
  assert.ok(visibleText(html).includes('SVOC'), '文型は第5文型（命令文）')
})

test('今ある操作と中身を残す：交互朗読と再生パネル、区切りの訳、訳の全文、読みのポイント、本文語彙、文法カード、読解チェック、読了', () => {
  const reader = read('src/screens/LiteratureReader.jsx')
  const sheet = read('src/components/LiteratureSentenceSheet.jsx')
  const fullText = read('src/components/LiteratureFullText.jsx')
  for (const [source, contract] of [
    [reader, 'playSpeechItems('],
    [reader, 'onIndexChange'],
    [reader, 'literatureSentenceIndexForSegment('],
    [reader, 'data-literature-play-from'],
    [reader, "useScreenParam('showJa'"],
    [reader, "useScreenParam('open'"],
    [reader, 'data-literature-translation-toggle'],
    [reader, 'data-literature-kakikudashi-toggle'],
    [reader, 'data-literature-vocabulary-open'],
    [reader, 'data-literature-save-words'],
    [reader, 'data-literature-save-grammar'],
    [reader, "navigate('kotenGrammarStudy'"],
    [reader, 'data-literature-reading-check'],
    [reader, 'data-literature-evidence-sentence'],
    [reader, 'markLiteratureDone('],
    [reader, '<LiteratureVocabularySheet'],
    [sheet, 'ここから交互再生'],
    [sheet, 'data-literature-segments'],
    [sheet, 'data-literature-sentence-point'],
    [fullText, "playing ? 'bg-teal-100 text-teal-950'"],
    [fullText, 'scrollIntoView'],
  ]) {
    assert.ok(source.includes(contract), `残す操作: ${contract}`)
  }
  // 交互朗読は全文表示から始められ、どの区切りを読んでいても、本文で読んでいる文が分かる。
  for (const work of works()) {
    const steps = mods.narration.buildLiteratureNarration(work)
    const segments = work.scenes.reduce((total, scene) => total + scene.narrationSegments.length, 0)
    assert.equal(steps.length, segments * 2, work.id)
    for (const step of steps) {
      assert.ok(
        mods.sentences.literatureSentenceIndexForSegment(work, step.sceneIndex, step.segmentIndex) >= 0,
        `${work.id}: 区切り ${step.sceneIndex + 1}.${step.segmentIndex + 1} の文が分からない`,
      )
    }
  }
})
