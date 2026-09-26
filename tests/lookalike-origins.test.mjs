// 依頼 2026-09-26-lookalike-origins（つづりが似た語は語源がつながっているのか）の条件を守るテスト。
// 「humiliate と human に語源的なつながりはあるのか。生徒は似た語について疑問を持つので、その解説も」という依頼から。
//  1) humiliate と human … hum で始まる14語と exhume の、語根 humil（土・低い）とのつながり
//  2) 語根カードの似た語 … 語根カードの形に似た見出し語の全件の判定と説明（src/data/lookalike-root-cards.js）
//  3) つづり注意の組 … つづりが似ていて間違えやすい語の全組の語源のつながり（src/data/lookalike-confusables.js）
//  4) 単語の画面 … 辞書ページ・暗記カードの裏・テストの答えに出ること
//  5) 語源カードの画面 … 同じ語根の単語・カード・カードの暗記・カードのテストに出ること
//  6) 語の成り立ち … 既存の本文が名指しした語のつながりが、台帳と食いちがわないこと（見つけた誤りを直した）
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ALL_WORDS, ETYMOLOGY_PACKS, etymologyStoryForWord, getWord } from '../src/data/vocab.js'
import { confusablesFor } from '../src/lib/wordRelations.js'
import {
  LOOKALIKE_ROOT_CARDS,
  isAffixCard,
  lookalikeRowsForCard,
  lookalikeSectionsForWord,
} from '../src/lib/lookalikeOrigins.js'
import { lookalikeOriginGaps, storyClaimConflicts } from '../scripts/checks/lookalike-origins.mjs'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const h = React.createElement
const count = (html, attribute) => html.split(attribute).length - 1
// 画面ではじめに見せる行の数（src/components/LookalikeOrigins.jsx の ROW_LIMIT）。
const ROW_LIMIT = 4

let vite
let parts
let relations
let bits

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  parts = await vite.ssrLoadModule('/src/components/LookalikeOrigins.jsx')
  relations = await vite.ssrLoadModule('/src/components/WordRelations.jsx')
  bits = await vite.ssrLoadModule('/src/components/WordBits.jsx')
})

after(async () => {
  await vite?.close()
})

const humilSection = (id) => lookalikeSectionsForWord(getWord(id)).find((section) => section.card.rootId === 'humil')
const kindOfRowWith = (section, id) => section.rows.find((row) => row.words.some((word) => word.id === id))?.kind

test('humiliate と human：どちらの語の画面でも「遠い親戚」と出て、hum で始まるほかの語と exhume のつながりも出る', () => {
  // 母集団: hum で始まる見出し語14語と、ex- のあとに hum が続く exhume。
  const hum = ALL_WORDS.filter((word) => /^hum/.test(word.word)).map((word) => word.id).sort()
  assert.deepEqual(hum, [
    'hum', 'human', 'humane', 'humanitarian', 'humanity', 'humankind', 'humble', 'humid', 'humidity',
    'humiliate', 'humiliated', 'humiliation', 'humility', 'humor',
  ])
  const fromHumus = ['humble', 'humility', 'humiliate', 'humiliation', 'humiliated']
  const fromHumanus = ['human', 'humane', 'humanity', 'humanitarian', 'humankind']
  const fromUmere = ['humid', 'humidity', 'humor']
  // humiliate の画面: human の仲間は遠い親戚、humid の仲間と hum は別の語源、exhume は同じ語源。
  for (const id of fromHumus) {
    const section = humilSection(id)
    assert.equal(section?.role, 'family', id)
    assert.equal(kindOfRowWith(section, 'human'), 'distant', `${id} と human`)
    for (const other of fromHumanus) assert.equal(kindOfRowWith(section, other), 'distant', `${id} と ${other}`)
    for (const other of fromUmere) assert.equal(kindOfRowWith(section, other), 'unrelated', `${id} と ${other}`)
    assert.equal(kindOfRowWith(section, 'hum'), 'unrelated', `${id} と hum`)
    assert.equal(kindOfRowWith(section, 'exhume'), 'same', `${id} と exhume`)
  }
  // human の画面: humiliate（カードの語）とは遠い親戚、humid の仲間・hum とは別の語源。
  for (const id of fromHumanus) {
    const section = humilSection(id)
    assert.equal(section?.role, 'lookalike', id)
    assert.equal(section.rows[0].card, true)
    assert.equal(kindOfRowWith(section, 'humiliate'), 'distant', `${id} と humiliate`)
    for (const other of fromUmere) assert.equal(kindOfRowWith(section, other), 'unrelated', `${id} と ${other}`)
    assert.equal(kindOfRowWith(section, 'hum'), 'unrelated', `${id} と hum`)
  }
  for (const id of [...fromUmere, 'hum']) {
    assert.equal(kindOfRowWith(humilSection(id), 'humiliate'), 'unrelated', `${id} と humiliate`)
  }
  assert.equal(kindOfRowWith(humilSection('exhume'), 'humiliate'), 'same')
  // 説明: どちらも「土・大地」の古い語根にさかのぼることと、humid・hum の由来。
  const human = humilSection('humiliate').rows.find((row) => row.kind === 'distant')
  assert.match(human.note, /hūmānus/)
  assert.match(human.note, /humus「土・地面」/)
  assert.match(human.note, /遠い親戚/)
  const humid = humilSection('humiliate').rows.find((row) => row.words.some((word) => word.id === 'humid'))
  assert.match(humid.note, /ūmēre「湿っている」/)
  // 画面の部品にも出る（辞書ページ・暗記カードの裏・テストの答えの「語の成り立ち」の欄）。
  for (const id of ['humiliate', 'human']) {
    const html = renderToStaticMarkup(h(bits.EtymologyBlock, { word: getWord(id), onWord: () => {} }))
    assert.ok(html.includes('data-lookalike-word'), id)
    assert.ok(html.includes('遠い親戚'), id)
    assert.ok(html.includes(id === 'human' ? '>humiliate<' : '>human<'), id)
  }
})

test('語根カードの似た語：母集団（語根カード 277枚の形に似た全見出し語）の全件に判定と説明があり、古い行・書き方の誤りがない', () => {
  // 接頭辞・接尾辞のカード（語の一部の形を教えるカード）は母集団から外す。
  assert.equal(ETYMOLOGY_PACKS.length, 339)
  assert.equal(LOOKALIKE_ROOT_CARDS.length, 277)
  assert.equal(ETYMOLOGY_PACKS.filter(isAffixCard).length, 62)
  const gaps = lookalikeOriginGaps()
  // 母集団は全見出し語 8,929語（Monday・post office のような大文字・空白・記号を含む語も小文字にして比べる）。
  assert.equal(gaps.cards, 162, '似た語を持つ語根カード')
  assert.equal(gaps.entries, 1010, 'カードと語の組')
  assert.equal(gaps.words, 918, '似た語の見出し語')
  // 大文字の見出し語も拾う（Monday は mon「注意させる」の形に似ているが別の語源）。
  assert.equal(lookalikeSectionsForWord(getWord('monday')).find((section) => section.card.rootId === 'mon')?.rows[0].kind, 'unrelated')
  for (const key of ['missing', 'stale', 'duplicate', 'badKind', 'notes', 'links']) {
    assert.deepEqual(gaps[key].slice(0, 20), [], key)
  }
})

test('つづり注意の組：946組の全件に語源のつながりと説明があり、語根カードの台帳と食いちがわない', () => {
  const gaps = lookalikeOriginGaps()
  assert.equal(gaps.confusables, 946)
  assert.deepEqual(gaps.confusableMissing.slice(0, 20), [], '書いていない組')
  assert.deepEqual(gaps.confusableStale.slice(0, 20), [], '母集団にない組')
  assert.deepEqual(gaps.conflicts.slice(0, 20), [], '語根カードの台帳と食いちがう組')
  // 画面が引く形でも、全組の両方の語から、つながりと説明が引ける。
  let rows = 0
  for (const word of ALL_WORDS) {
    for (const item of confusablesFor(word)) {
      rows += 1
      assert.ok(item.origin?.label && item.origin.note, `${word.id} と ${item.word.word}`)
    }
  }
  assert.equal(rows, 915 * 2 + 31, 'つづり注意の欄の行数（見出し語どうしの組は両方の語に出る）')
  assert.equal(confusablesFor(getWord('cure')).find((item) => item.word.id === 'care').origin.kind, 'unrelated')
  assert.equal(confusablesFor(getWord('state')).find((item) => item.word.id === 'statue').origin.kind, 'same')
  assert.equal(confusablesFor(getWord('weak')).find((item) => item.word.id === 'week').origin.kind, 'distant')
})

test('単語の画面：辞書ページ・暗記カードの裏・テストの答えに「つづりが似た語は同じ語源？」が出て、つづり注意の全行に語源が出る', () => {
  let words = 0
  for (const word of ALL_WORDS) {
    const sections = lookalikeSectionsForWord(word)
    if (!sections.length) continue
    words += 1
    const html = renderToStaticMarkup(h(parts.LookalikeWordSection, { word, onWord: () => {} }))
    assert.equal(count(html, 'data-lookalike-section='), sections.length, `${word.id}: 欄の数`)
    const rows = sections.reduce((sum, section) => sum + Math.min(section.rows.length, ROW_LIMIT), 0)
    assert.equal(count(html, 'data-lookalike-row='), rows, `${word.id}: 行の数`)
    // テストの答え合わせでは見出しだけにしておき、押すと開く。
    const folded = renderToStaticMarkup(h(parts.LookalikeWordSection, { word, collapsible: true }))
    assert.ok(folded.includes('つづりが似た語は同じ語源？') && !folded.includes('data-lookalike-row='), `${word.id}: 畳んだ欄`)
  }
  // 似た語を持つカードの語（とその形）と、似た語（909語）。
  assert.ok(words > 2000, `似た語の欄を出す語 ${words}語`)
  // つづり注意の欄の全行に、語源の一行が出る。
  let confusableWords = 0
  for (const word of ALL_WORDS) {
    const items = confusablesFor(word)
    if (!items.length) continue
    confusableWords += 1
    const html = renderToStaticMarkup(h(relations.ConfusableSection, { word, items, onWord: () => {} }))
    assert.equal(count(html, 'data-word-origin-note='), items.length, `${word.id}: つづり注意の語源`)
  }
  assert.ok(confusableWords > 1000, `つづり注意の欄を出す語 ${confusableWords}語`)
  // 3画面は、語の成り立ちの欄（EtymologyBlock）とつづり注意の欄を通して出す。
  const wordBits = read('src/components/WordBits.jsx')
  assert.match(wordBits, /<LookalikeWordSection word=\{word\} onWord=\{onWord\} collapsible=\{lookalikeCollapsed\} \/>/)
  assert.match(read('src/components/WordRelations.jsx'), /<OriginNote origin=\{item\.origin\} \/>/)
  // 属性の中に => があるので、EtymologyBlock の開きから閉じ（/>）までを見る。
  const blockOf = (file) => read(file).match(/<EtymologyBlock\b[\s\S]*?\/>/)?.[0] ?? ''
  assert.match(blockOf('src/screens/WordDetail.jsx'), /onWord=\{openWord\}/)
  assert.match(blockOf('src/screens/VocabStudy.jsx'), /onWord=\{openRelatedWord\}/)
  assert.match(read('src/screens/VocabQuiz.jsx'), /<EtymologyBlock word=\{word\} lookalikeCollapsed \/>/)
  for (const file of ['src/screens/WordDetail.jsx', 'src/screens/VocabStudy.jsx']) {
    assert.match(read(file), /<ConfusableSection /, file)
  }
})

test('語源カードの画面：同じ語根の単語・カード・カードの暗記・カードのテストに、似た語と語根とのつながりが出る', () => {
  let cards = 0
  for (const card of LOOKALIKE_ROOT_CARDS) {
    const rows = lookalikeRowsForCard(card.rootId)
    if (!rows.length) continue
    cards += 1
    for (const row of rows) assert.ok(row.label && row.note && row.words.length, `${card.rootId}: ${row.kind}`)
    const html = renderToStaticMarkup(h(parts.LookalikeCardSection, { rootId: card.rootId, onWord: () => {} }))
    assert.equal(count(html, 'data-lookalike-row='), Math.min(rows.length, ROW_LIMIT), `${card.rootId}: 行の数`)
    if (rows.length > ROW_LIMIT) assert.ok(html.includes(`ほかの似た語（${rows.length - ROW_LIMIT}組）も見る`), card.rootId)
    const folded = renderToStaticMarkup(h(parts.LookalikeCardSection, { rootId: card.rootId, collapsible: true }))
    assert.ok(folded.includes('つづりが似た語は同じ語源？') && !folded.includes('data-lookalike-row='), `${card.rootId}: 畳んだ欄`)
  }
  assert.equal(cards, 162)
  // 近い順（同じ語源→遠い親戚→はっきりしない→別の語源）に並ぶ。
  assert.deepEqual(lookalikeRowsForCard('humil').map((row) => row.kind), ['same', 'distant', 'unrelated', 'unrelated'])
  for (const file of ['src/screens/RootDetail.jsx', 'src/screens/EtymologyPack.jsx']) {
    assert.match(read(file), /<LookalikeCardSection rootId=\{[^}]+\} onWord=/, file)
  }
  for (const file of ['src/screens/EtymologyStudy.jsx', 'src/screens/EtymologyQuiz.jsx']) {
    assert.match(read(file), /<LookalikeCardSection rootId=\{card\.rootId\} collapsible/, file)
  }
})

test('語の成り立ち：本文が名指しした語のつながりが似た語の台帳と食いちがわず、見つけた誤りを直してある', () => {
  const { claims, conflicts } = storyClaimConflicts()
  assert.deepEqual(conflicts, [])
  assert.ok(claims >= 667, `台帳で判定できた名指し ${claims}件`)
  // 直す前の本文なら食いちがいとして捕まえる。
  const before = storyClaimConflicts([
    { wordId: 'omit', note: 'ラテン語 omittere から。miss と同じ語源。' },
    { wordId: 'curious', note: 'ラテン語 cura「注意」→「好奇心が強い」。care と同じ語源。' },
    { wordId: 'isolate', note: 'ラテン語 insula「島」→「孤立させる」。island と同じ語源。' },
    { wordId: 'counsel', note: 'ラテン語 consilium「相談」→「助言」。council と同じ語源。' },
    { wordId: 'state', note: 'ラテン語 status から。stand と同じ語源。' },
    { wordId: 'arms', note: 'ラテン語 arma「武器」から。体の腕（arm）とは別の語源。' },
  ])
  assert.equal(before.conflicts.length, 6, before.conflicts.join('\n'))
  // 直した本文。
  const story = (id) => etymologyStoryForWord(id)?.note ?? ''
  for (const id of ['omit', 'dismiss', 'emission', 'surmise', 'intermittent']) {
    assert.match(story(id), /mission（使命）と同じ語源/, id)
    assert.doesNotMatch(story(id), /miss と同じ語源/, id)
  }
  for (const id of ['cure', 'curious', 'accurate']) {
    assert.match(story(id), /care（[^）]+）は古英語 caru/, id)
    assert.doesNotMatch(story(id), /care と同じ語源/, id)
  }
  assert.match(story('counsel'), /council（評議会）は concilium「集まり」から来た別の語/)
  for (const id of ['isolate', 'peninsula']) assert.match(story(id), /island は古英語 īegland から来た別の語/, id)
  assert.match(story('state'), /英語の stand（立つ）も、さかのぼると同じ古い語根から来た遠い親戚/)
  assert.match(story('depose'), /poser「置く」/)
  assert.match(story('college'), /lēgāre/)
  assert.match(story('prize'), /price（値段）と同じ語源/)
  // isolate・isolated・isolation は sōlus「ひとりの」ではなく īnsula「島」のカードの語。
  const card = (rootId) => ETYMOLOGY_PACKS.find((pack) => pack.rootId === rootId)
  for (const id of ['isolate', 'isolated', 'isolation']) {
    assert.ok(card('insul').coverageIds.includes(id), `${id} が insul のカードにない`)
    assert.ok(!card('solus').coverageIds.includes(id), `${id} が solus のカードに残っている`)
  }
})
