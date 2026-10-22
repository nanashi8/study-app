// 自作カードの「写真から作る」で、読み取った文字からカードの候補を作る決まり（src/lib/customCardsPhoto.js）と、
// まとめて登録する部品（customWords.js の appendCustomWords・customCards.js の appendCustomCards）。
// 依頼 requests/2026-10-22-custom-cards-photo-ocr.json の受け入れ条件 photo-candidates-all-templates・photo-register-all-templates。
// 利用者：「自作カードのところに、OCRでテキストを読み取って単語を登録する機能を配置しなさい。」
//
// 母集団：テンプレート5つ（英単語・古文単語・漢語・その他・一問一答）と、行の形（表と裏が別の箱・空白・区切り記号・英語と日本語の
// 境目・番号や印つき・2行に分かれた単語と意味／問題と答え・英文・日本語だけの行）。画面の操作は custom-cards-photo-screens.test.mjs、
// 本物の読み取りエンジンで読む確かめは custom-cards-photo-ocr.test.mjs。
import test from 'node:test'
import assert from 'node:assert/strict'
import nlp from 'compromise/two'

import { ALL_WORDS } from '../src/data/vocab.js'
import { createContextReading } from '../src/lib/ocrContext.js'
import { ocrPageFromItems } from '../src/lib/ocrEngine.js'
import {
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATE_IDS,
  appendCustomCards,
  normalizeCustomCards,
} from '../src/lib/customCards.js'
import { CUSTOM_WORD_LIMITS, appendCustomWords, normalizeCustomWords } from '../src/lib/customWords.js'
import { customCardInput, customWordInput } from '../src/lib/customEntryForm.js'
import {
  PHOTO_ROW_SEPARATOR,
  buildPhotoCardCandidates,
  existingPhotoKeys,
  photoCandidateIssues,
  photoEntryValues,
  photoFieldLabels,
  photoRowConfidences,
  photoRowsFromLines,
  photoTextFromRows,
  stripLeadingMarks,
} from '../src/lib/customCardsPhoto.js'
import { englishWordSetForTests } from './english-word-set.mjs'

const S = PHOTO_ROW_SEPARATOR
const englishWords = englishWordSetForTests()
const build = (text, template, options = {}) => buildPhotoCardCandidates(text, {
  template,
  words: ALL_WORDS,
  englishWords,
  contextReading: (joined) => createContextReading(nlp, joined, ALL_WORDS),
  ...options,
})
const pairs = (result) => result.candidates.map((candidate) => [candidate.front, candidate.back])
const byFront = (result, front) => result.candidates.find((candidate) => candidate.front === front)
const box = (x, y, width, height = 30) => [[x, y], [x + width, y], [x + width, y + height], [x, y + height]]

test('5つのテンプレートすべてに、表と裏の欄の名前がある（候補の欄・足りない欄の知らせに使う）', () => {
  assert.deepEqual(CUSTOM_CARD_TEMPLATE_IDS, ['english', 'koten', 'kanbun', 'other', 'qa'])
  assert.deepEqual(CUSTOM_CARD_TEMPLATE_IDS.map(photoFieldLabels), [
    { front: '単語', back: '意味' },
    { front: '古語', back: '意味' },
    { front: '漢語・句法', back: '意味' },
    { front: '用語', back: '意味' },
    { front: '問題', back: '答え' },
  ])
})

test('写真で同じ高さに並ぶ箱は1行（左から並べて「　」でつなぐ）、高さのちがう箱は別の行、行は上から並べる', () => {
  // 単語表：左の英単語と右の意味は少し上下にずれている。見出しは1つだけの行。
  const lines = [
    { text: '名 図書館', confidence: 97, poly: box(375, 103, 120) },
    { text: '新出単語', confidence: 99, poly: box(40, 50, 110) },
    { text: 'borrow', confidence: 92, poly: box(40, 162, 95) },
    { text: 'library', confidence: 98, poly: box(40, 106, 90, 26) },
    { text: '動 借りる', confidence: 96, poly: box(376, 160, 120, 34) },
  ]
  const rows = photoRowsFromLines(lines)
  assert.deepEqual(rows.map((row) => row.text), ['新出単語', `library${S}名 図書館`, `borrow${S}動 借りる`])
  assert.deepEqual(rows.map((row) => row.confidence), [99, 97, 92])
  assert.equal(photoTextFromRows(rows), `新出単語\nlibrary${S}名 図書館\nborrow${S}動 借りる`)
  assert.deepEqual([...photoRowConfidences(rows)], [['新出単語', 99], ['library 名 図書館', 97], ['borrow 動 借りる', 92]])
  // 行の間が狭くても、高さの中ほどが半分以上ずれた箱はつながない。
  const tight = photoRowsFromLines([
    { text: 'one', confidence: 99, poly: box(0, 0, 50, 30) },
    { text: 'two', confidence: 99, poly: box(0, 32, 50, 30) },
    { text: '一', confidence: 99, poly: box(200, 14, 30, 30) },
  ])
  assert.equal(tight.length, 2)
  // 読み取りエンジンの結果（ocrEngine.js の ocrPageFromItems）の lines をそのまま受け取る。位置のない箱は、読んだ順の1箱1行。
  const page = ocrPageFromItems([{ text: 'apple', score: 0.99, poly: box(0, 0, 80) }, { text: 'りんご', score: 0.95, poly: box(300, 2, 80) }])
  assert.deepEqual(photoRowsFromLines(page.lines).map((row) => row.text), [`apple${S}りんご`])
  assert.deepEqual(photoRowsFromLines([{ text: 'b', confidence: 90 }, { text: 'a', confidence: 90 }]).map((row) => row.text), ['b', 'a'])
})

test('行の頭の番号・印は外し、4けたの数（年）は外さない', () => {
  assert.equal(stripLeadingMarks('1. apple'), 'apple')
  assert.equal(stripLeadingMarks('(12) apple'), 'apple')
  assert.equal(stripLeadingMarks('③ apple'), 'apple')
  assert.equal(stripLeadingMarks('□ ・apple'), 'apple')
  assert.equal(stripLeadingMarks('Q2. 江戸幕府は？'), '江戸幕府は？')
  assert.equal(stripLeadingMarks('問3 鎌倉幕府は？'), '鎌倉幕府は？')
  assert.equal(stripLeadingMarks('3 apples'), 'apples')
  assert.equal(stripLeadingMarks('1990年 東西ドイツ統一'), '1990年 東西ドイツ統一')
})

test('英単語：英語と日本語が並ぶ行は単語と意味（品詞の印・発音記号も）、辞書の語は品詞・級・発音記号を辞書から入れて最初から選ぶ', () => {
  const result = build([
    '新出単語',
    `library${S}名 図書館`,
    `borrow${S}【動】借りる`,
    '1. apple [ǽpl] 名 りんご',
    '② look forward to ~ing ～を楽しみに待つ',
    'ねこ cat',
    `wanted${S}動 want の過去形`,
  ].join('\n'), 'english')
  assert.deepEqual(pairs(result), [
    ['library', '図書館'],
    ['borrow', '借りる'],
    ['apple', 'りんご'],
    ['look forward to ~ing', '～を楽しみに待つ'],
    ['cat', 'ねこ'],
    ['wanted', 'want の過去形'],
  ])
  assert.equal(result.japaneseOnlyRows, 1, '日本語だけの行（新出単語）は英単語のカードにしない')
  const library = byFront(result, 'library')
  assert.deepEqual(
    [library.posId, library.level, library.phonetic, library.meaningFrom, library.suggested, library.kind],
    ['名', '4', '/ˈlaɪbɹɛˌɹi/', 'photo', true, 'row'],
  )
  assert.equal(byFront(result, 'borrow').posId, '動')
  assert.deepEqual([byFront(result, 'apple').phonetic, byFront(result, 'apple').posId], ['[ǽpl]', '名'])
  // 辞書にない形（wanted）は、写真の品詞の印だけを入れる。
  const wanted = byFront(result, 'wanted')
  assert.deepEqual([wanted.posId, wanted.level, wanted.phonetic, wanted.suggested], ['動', null, '', true])
  assert.ok(result.candidates.every((candidate) => candidate.suggested), '単語と意味がそろった行は最初から選ぶ')
})

test('英単語：意味にくっついて読まれた品詞の印（名図書館）は、辞書か表のほかの行から印と決めたときだけ外す', () => {
  // 本物の読み取りエンジンは「名 図書館」を「名図書館」と読む（2026-10-22 に試料 word-list.png で確かめた）。
  const table = build([
    `library${S}名図書館`,
    `animal${S}名動物`,
    `interesting${S}形おもしろい`,
    `wanted${S}動 want の過去形`,
  ].join('\n'), 'english')
  assert.deepEqual(pairs(table), [['library', '図書館'], ['animal', '動物'], ['interesting', 'おもしろい'], ['wanted', 'want の過去形']])
  assert.deepEqual(table.candidates.map((candidate) => candidate.posId), ['名', '名', '形', '動'])
  // 印のない表：意味そのものが辞書の意味（動物・動く）なら、頭の字は意味の字。辞書にない語の1行だけでは外さない。
  const plain = build([`animal${S}動物`, `move${S}動く`, `zorblax${S}名前の一部`].join('\n'), 'english')
  assert.deepEqual(pairs(plain), [['animal', '動物'], ['move', '動く'], ['zorblax', '名前の一部']])
  assert.deepEqual(plain.candidates.map((candidate) => candidate.posId), ['名', '動', null])
})

test('英単語：英語の語句の行の下に日本語だけの短い行があれば意味にする。訳の文（。で終わる）は意味にしない', () => {
  const result = build(['apple', 'りんご', 'Thank you', 'ありがとう', 'Emi went to the zoo', '恵美は動物園へ行った。'].join('\n'), 'english')
  assert.deepEqual(pairs(result).slice(0, 2), [['apple', 'りんご'], ['Thank you', 'ありがとう']])
  assert.equal(byFront(result, 'apple').meaningFrom, 'photo')
  // 訳の文の上の英文は、英文の中の語（最初は選ばない）。
  assert.equal(byFront(result, 'zoo').kind, 'word')
  assert.equal(byFront(result, 'zoo').suggested, false)
  assert.equal(result.japaneseOnlyRows, 1)
})

test('英単語：単語だけの行は辞書の意味で選び、熟語だけの行は辞書の見出しなら意味を入れ、なければ意味を書く候補にする', () => {
  const result = build(['go　went　gone', 'ice cream', 'take care of', 'Apple'].join('\n'), 'english')
  const go = byFront(result, 'go')
  assert.deepEqual([go.back, go.kind, go.meaningFrom, go.suggested, go.occurrences], ['行く', 'row', 'dictionary', true, 3])
  assert.deepEqual(go.observed, ['go', 'went', 'gone'])
  const iceCream = byFront(result, 'ice cream')
  assert.deepEqual([iceCream.meaningFrom, iceCream.suggested, Boolean(iceCream.back)], ['dictionary', true, true])
  const takeCareOf = byFront(result, 'take care of')
  assert.deepEqual([takeCareOf.back, takeCareOf.suggested], ['', false])
  assert.deepEqual(photoCandidateIssues(takeCareOf, 'english').missing, ['意味'])
  // 大文字で始まる1語の行も単語として読む（見出しは辞書の形）。
  assert.equal(byFront(result, 'apple').suggested, true)
})

test('英単語：英文の中の語は辞書の意味つき（saw は文脈で see）、辞書にない実在の語・確かめられない並びも、意味を書く候補として残し、どれも最初は選ばない', () => {
  const result = build([
    'Lesson 3　図書館で',
    'Emi saw a walrus at the zoo. xqzrt',
    'decide は「決める」という意味',
    '恵美は動物園でセイウチを見ました。',
  ].join('\n'), 'english')
  const words = result.candidates.filter((candidate) => candidate.kind === 'word')
  assert.equal(words.length, result.candidates.length, 'どの行も単語と意味の組にしない（数字のある見出し・助詞で始まる説明・訳の文）')
  assert.ok(words.every((candidate) => !candidate.suggested), '英文の中の語は、登録する語を選んでもらう')
  const see = byFront(result, 'see')
  assert.deepEqual([see.back, see.meaningFrom, see.posId], [ALL_WORDS.find((word) => word.id === 'see').meaning, 'dictionary', '動'])
  assert.deepEqual(see.observed, ['saw'])
  for (const front of ['lesson', 'zoo', 'decide']) assert.ok(byFront(result, front), front)
  const walrus = byFront(result, 'walrus')
  assert.deepEqual([walrus.listed, walrus.back], [true, ''])
  for (const front of ['Emi', 'xqzrt']) {
    const rejected = byFront(result, front)
    assert.deepEqual([rejected.rejected, rejected.back], [true, ''], front)
  }
  assert.equal(result.japaneseOnlyRows, 1)
})

test('英単語：英語のほうが多い残り（問題文と選択肢）は意味にせず、英文の中の語にする', () => {
  const result = build('(1) I (　) to school every day.　ア go　イ goes　ウ going', 'english')
  assert.ok(result.candidates.length > 0)
  assert.ok(result.candidates.every((candidate) => candidate.kind === 'word' && !candidate.suggested), JSON.stringify(pairs(result)))
  assert.ok(byFront(result, 'school'))
})

test('英単語：同じ語は1枚にまとめ、読み取りが不確かな行（確からしさ90未満）は最初は選ばない', () => {
  const text = [`apple${S}りんご`, `apple${S}りんご`, `borrow${S}借りる`].join('\n')
  const result = build(text, 'english', { rowConfidences: new Map([['borrow 借りる', 62]]) })
  assert.equal(result.candidates.length, 2)
  assert.equal(byFront(result, 'apple').occurrences, 2)
  assert.deepEqual([byFront(result, 'borrow').uncertain, byFront(result, 'borrow').suggested], [true, false])
})

test('古文単語：【 】は品詞・活用の欄、別の箱・空白・「：」の後ろを意味にし、意味のない行も候補に残す', () => {
  const result = build([
    `あはれなり【形動ナリ】${S}しみじみとした趣がある`,
    'いと　とても',
    'をかし：趣がある',
    'ゆかし 見たい・知りたい',
    'つれづれなり',
  ].join('\n'), 'koten')
  assert.deepEqual(pairs(result), [
    ['あはれなり', 'しみじみとした趣がある'],
    ['いと', 'とても'],
    ['をかし', '趣がある'],
    ['ゆかし', '見たい・知りたい'],
    ['つれづれなり', ''],
  ])
  assert.equal(byFront(result, 'あはれなり').pos, '形動ナリ')
  assert.equal(photoEntryValues(byFront(result, 'あはれなり'), 'koten').pos, '形動ナリ')
  assert.deepEqual(photoCandidateIssues(byFront(result, 'つれづれなり'), 'koten').missing, ['意味'])
  assert.equal(byFront(result, 'つれづれなり').suggested, false)
})

test('漢語・その他：別の箱・空白・「：」、英語の語句と日本語の境目で表と裏に分ける', () => {
  assert.deepEqual(pairs(build(['未だ〜ず　まだ〜ない', '蓋し けだし・思うに', '1. 須らく〜べし：ぜひ〜する必要がある'].join('\n'), 'kanbun')), [
    ['未だ〜ず', 'まだ〜ない'],
    ['蓋し', 'けだし・思うに'],
    ['須らく〜べし', 'ぜひ〜する必要がある'],
  ])
  assert.deepEqual(pairs(build([
    '光合成 植物が光を使って養分をつくるはたらき',
    'the Industrial Revolution 産業革命',
    `GDP${S}国内総生産`,
    '1990年 東西ドイツ統一',
  ].join('\n'), 'other')), [
    ['光合成', '植物が光を使って養分をつくるはたらき'],
    ['the Industrial Revolution', '産業革命'],
    ['GDP', '国内総生産'],
    ['1990年', '東西ドイツ統一'],
  ])
})

test('一問一答：「？」の後ろを答えにし、「？」で終わる行は次の行（問いでない行）を答えにする', () => {
  const result = build([
    '問1 鎌倉幕府を開いた人物は？ 源頼朝',
    '日本の首都は？',
    '東京',
    'Q2. 江戸幕府を開いた人物は？',
    '室町幕府を開いた人物は？',
    '足利尊氏',
    '三権分立　立法・行政・司法',
  ].join('\n'), 'qa')
  assert.deepEqual(pairs(result), [
    ['鎌倉幕府を開いた人物は？', '源頼朝'],
    ['日本の首都は？', '東京'],
    ['江戸幕府を開いた人物は？', ''],
    ['室町幕府を開いた人物は？', '足利尊氏'],
    ['三権分立', '立法・行政・司法'],
  ])
  assert.deepEqual(photoCandidateIssues(byFront(result, '江戸幕府を開いた人物は？'), 'qa').missing, ['答え'])
})

test('登録できるか：欄の上限を超えるものは黙って切らず、直すまで登録できない', () => {
  const english = { front: 'apple', back: 'りんご・リンゴの木・赤い実・果物・食べ物', posId: '名', level: null, field: null, phonetic: '', pos: '' }
  assert.deepEqual(photoCandidateIssues(english, 'english'), { missing: [], overflow: ['意味は「・」で区切って4つまで'], blocked: true })
  assert.equal(photoCandidateIssues({ ...english, back: 'りんご' }, 'english').blocked, false)
  assert.deepEqual(photoCandidateIssues({ ...english, front: 'a'.repeat(CUSTOM_WORD_LIMITS.word + 1), back: 'りんご' }, 'english').overflow, [`単語は${CUSTOM_WORD_LIMITS.word}字まで`])
  assert.deepEqual(photoCandidateIssues({ ...english, back: 'あ'.repeat(CUSTOM_WORD_LIMITS.meaning + 1) }, 'english').overflow, [`意味は1つ${CUSTOM_WORD_LIMITS.meaning}字まで`])
  const card = { front: '用語', back: 'あ'.repeat(CUSTOM_CARD_LIMITS.back + 1), pos: '' }
  assert.deepEqual(photoCandidateIssues(card, 'other').overflow, [`意味は${CUSTOM_CARD_LIMITS.back}字まで`])
  assert.deepEqual(photoCandidateIssues({ ...card, front: 'あ'.repeat(CUSTOM_CARD_LIMITS.front + 1), back: '答え' }, 'qa').overflow, [`問題は${CUSTOM_CARD_LIMITS.front}字まで`])
  assert.deepEqual(photoCandidateIssues({ front: '', back: '' }, 'qa').missing, ['問題', '答え'])
  // 区切りだけの意味は、保存すると空になるので「意味がない」とする。
  assert.deepEqual(photoCandidateIssues({ ...english, back: '・、' }, 'english').missing, ['意味'])
})

test('登録する中身：英単語は品詞・級・分野・発音記号、古文単語は品詞・活用を入れ、ほかのテンプレートには入れない', () => {
  const english = photoEntryValues({ front: ' library ', back: '図書館', posId: '名', level: '4', field: null, phonetic: '/ˈlaɪbɹɛˌɹi/', pos: '' }, 'english')
  assert.deepEqual([english.front, english.back, english.posId, english.level, english.phonetic], ['library', '図書館', '名', '4', '/ˈlaɪbɹɛˌɹi/'])
  const word = normalizeCustomWords([customWordInput(english, 'subject:english')])[0]
  assert.deepEqual([word.word, word.meanings, word.pos, word.level, word.phonetic], ['library', ['図書館'], '名', '4', '/ˈlaɪbɹɛˌɹi/'])
  const koten = photoEntryValues({ front: 'あはれなり', back: 'しみじみ', pos: '形動ナリ' }, 'koten')
  assert.equal(normalizeCustomCards([customCardInput('koten', koten, 'subject:koten')])[0].pos, '形動ナリ')
  assert.equal(photoEntryValues({ front: '蓋し', back: 'けだし', pos: '副詞' }, 'kanbun').pos, '')
})

test('分類にもうあるカード：英単語はその分類の英単語のカード（大文字・小文字を区別しない）、ほかはその分類のカード', () => {
  const library = {
    words: [{ word: 'Library', category: 'subject:english' }, { word: 'apple', category: 'cat-a' }],
    cards: [{ front: '光合成', category: 'subject:science' }, { front: '呼吸', category: 'cat-a' }],
  }
  assert.deepEqual([...existingPhotoKeys(library, 'subject:english', 'english')], ['library'])
  assert.deepEqual([...existingPhotoKeys(library, 'subject:science', 'other')], ['光合成'])
  assert.deepEqual([...existingPhotoKeys(library, 'cat-a', 'qa')], ['呼吸'])
})

test('まとめて足す：入れたものの ID を並びの順に返し、空の欄のもの・上限を超えた分は入れずに数える', () => {
  const now = Date.UTC(2026, 9, 22)
  const words = appendCustomWords([], [
    customWordInput(photoEntryValues({ front: 'apple', back: 'りんご', posId: '名' }, 'english'), 'cat-a'),
    customWordInput(photoEntryValues({ front: 'empty', back: '' }, 'english'), 'cat-a'),
    customWordInput(photoEntryValues({ front: 'borrow', back: '借りる', posId: '動' }, 'english'), 'cat-a'),
  ], { now })
  assert.equal(words.words.length, 2)
  assert.deepEqual(words.ids.map(Boolean), [true, false, true])
  assert.equal(new Set(words.ids.filter(Boolean)).size, 2)
  assert.deepEqual([words.invalidCount, words.fullCount], [1, 0])
  assert.ok(words.words.every((word) => word.createdAt === now && word.category === 'cat-a'))

  const cards = appendCustomCards([], [
    customCardInput('qa', photoEntryValues({ front: '日本の首都は？', back: '東京' }, 'qa'), 'subject:social'),
    customCardInput('qa', photoEntryValues({ front: '答えのない問題', back: '' }, 'qa'), 'subject:social'),
  ], { now })
  assert.deepEqual([cards.cards.length, cards.ids.map(Boolean), cards.invalidCount], [1, [true, false], 1])
  assert.deepEqual([cards.cards[0].template, cards.cards[0].front, cards.cards[0].back], ['qa', '日本の首都は？', '東京'])

  // 上限に届いていたら、それ以上は入れない（英単語・カード）。
  const fullWords = Array.from({ length: CUSTOM_WORD_LIMITS.words }, (_, at) => ({ id: `u-full${at}`, word: `w${at}`, meanings: ['意味'] }))
  const overWords = appendCustomWords(fullWords, [customWordInput(photoEntryValues({ front: 'apple', back: 'りんご' }, 'english'), 'cat-a')], { now })
  assert.deepEqual([overWords.words.length, overWords.ids, overWords.fullCount], [CUSTOM_WORD_LIMITS.words, [null], 1])
  const fullCards = Array.from({ length: CUSTOM_CARD_LIMITS.cards }, (_, at) => ({ id: `c-full${at}`, template: 'other', front: `f${at}`, back: 'b' }))
  const overCards = appendCustomCards(fullCards, [customCardInput('other', photoEntryValues({ front: 'x', back: 'y' }, 'other'), 'cat-a')], { now })
  assert.deepEqual([overCards.cards.length, overCards.ids, overCards.fullCount], [CUSTOM_CARD_LIMITS.cards, [null], 1])
})
