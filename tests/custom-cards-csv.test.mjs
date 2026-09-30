// 自作カードの一覧を Excel・テキストエディタで作る・直す（依頼台帳 requests/2026-09-30-custom-card-templates.json の csv-edit）。
// 2026-09-30 利用者:「カードの一覧は自作できてエクセルかテキストエディタで編集できるといいね。」
// 1行が1枚の CSV（Excel で文字化けしない UTF-8・BOM つき）で書き出し、見本を保存でき、
// Excel・テキストエディタで作った・直したファイル（CSV・タブ区切り、UTF-8 の BOM あり・なし、Shift_JIS）と貼り付けた表を読み込む。
// 6つのテンプレートの全欄（英単語は16欄）を列で書け、書き出して読み戻すと同じカードになる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CUSTOM_CARD_TABLE_COLUMNS,
  customCardsCsvFileName,
  customCardsCsvSample,
  customCardsCsvText,
  decodeTableBytes,
  levelFromText,
  parseCustomCardsTable,
  parseDelimitedText,
  tableDelimiter,
} from '../src/lib/customCardsCsv.js'
import { CARD_FIELD_KEYS, CUSTOM_CARD_LIMITS, CUSTOM_CARD_TEMPLATES, normalizeCustomCard, templateFor } from '../src/lib/customCards.js'
import { ENGLISH_WORD_FIELDS, normalizeCustomWord } from '../src/lib/customWords.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const CATEGORY = { id: 'cat-midterm', title: '2学期中間英語', subject: 'english', template: 'english', createdAt: 1, updatedAt: 1 }

// 6つのテンプレートのカードに、全部の欄を書く（カンマ・""・改行・- で始まる欄も入れる）。
const WORD = normalizeCustomWord({
  id: 'u-csvword',
  word: 'glimmer',
  meanings: 'かすかな光・わずかな気配',
  pos: '名',
  level: 'pre1',
  field: '自然・環境・地理',
  phonetic: '/ˈɡlɪmər/',
  example: { en: 'There was a glimmer of hope, "a small one".', ja: 'かすかな希望、"小さな"希望があった。' },
  note: 'a glimmer of ～ の形で、よく使う',
  category: CATEGORY.id,
  otherSenses: [{ pos: '動', meaning: 'ちらちら光る' }],
  derivatives: [{ w: 'glimmering', m: 'かすかな光' }],
  synonyms: [{ w: 'gleam', m: 'かすかな光' }, { w: 'flicker', m: '' }],
  antonyms: [{ w: 'glare', m: 'ぎらぎらした光' }],
  confusables: [{ w: 'glamour', m: '魅力' }],
  phrases: [{ phrase: 'a glimmer of hope', meaning: 'かすかな希望' }],
  etymology: '-er がついた形。古い英語の「光る」から',
})

const CARDS = CUSTOM_CARD_TEMPLATES.filter((template) => template.id !== 'english').map((template, index) => normalizeCustomCard({
  id: `c-csv${index}`,
  template: template.id,
  category: index % 2 ? 'subject:social' : CATEGORY.id,
  front: `${template.label}の表, カンマ入り`,
  back: `${template.label}の裏\n2行目`,
  reading: 'よみ',
  kanji: '漢字',
  pos: '品詞・活用',
  example: `"${template.label}"の例文`,
  exampleTranslation: '例文の訳',
  note: '=で始まらない解説',
}))

const LIBRARY = { words: [WORD], cards: CARDS, categories: [CATEGORY] }

const wordFields = (word) => ({
  id: word.id, word: word.word, meanings: word.meanings, pos: word.pos, level: word.level, field: word.field,
  phonetic: word.phonetic, example: word.example, note: word.note, category: word.category,
  otherSenses: word.otherSenses, derivatives: word.derivatives, synonyms: word.synonyms, antonyms: word.antonyms,
  confusables: word.confusables, phrases: word.phrases, etymology: word.etymology,
})
const cardFields = (card) => ({ id: card.id, template: card.template, category: card.category, ...Object.fromEntries(CARD_FIELD_KEYS.map((key) => [key, card[key]])) })

test('列は、分類・テンプレートと、6つのテンプレートの全欄（英単語は16欄）・ID', () => {
  assert.deepEqual(CUSTOM_CARD_TABLE_COLUMNS.map((column) => column.name), [
    '分類', 'テンプレート', '表', '裏', '読み', '漢字', '品詞', '例文', '例文の訳', '解説・メモ',
    '級', '分野', '発音記号', 'ほかの意味', '派生語', '類義語', '反意語', 'つづりが似た語', '熟語・構文', '語の成り立ち', 'ID',
  ])
  // 英単語以外の5つのテンプレートの欄は、どれも列にある。
  const keys = new Set(CUSTOM_CARD_TABLE_COLUMNS.map((column) => column.key))
  for (const template of CUSTOM_CARD_TEMPLATES) for (const item of template.fields) assert.ok(keys.has(item.key), `${template.id}.${item.key}`)
  // 英単語の16欄も列で書ける（単語＝表、意味＝裏、例文・例文の訳・使い方とメモ＝例文・例文の訳・解説・メモ）。
  const englishToColumn = { word: 'front', meanings: 'back', exampleEn: 'example', exampleJa: 'exampleTranslation', note: 'note' }
  for (const item of ENGLISH_WORD_FIELDS) assert.ok(keys.has(englishToColumn[item.key] ?? item.key), `英単語の ${item.key}`)
})

test('書き出し：Excel で文字化けしない UTF-8（BOM つき）の CSV で、書き出して読み戻すと全欄が同じカードになる', () => {
  const text = customCardsCsvText(LIBRARY)
  assert.ok(text.startsWith('﻿'), 'BOM')
  assert.ok(text.includes('\r\n'), 'CRLF')
  assert.equal(customCardsCsvFileName(new Date(2026, 8, 30).getTime()), 'study-app-custom-cards-20260930.csv')
  // - で始まる欄は、Excel が数式として読まないよう ' を付けて書き出し、読み込むときに外す。
  assert.ok(text.includes("'-er がついた形。"))
  const parsed = parseCustomCardsTable(text, { categories: [CATEGORY] })
  assert.equal(parsed.status, 'ok')
  assert.deepEqual(parsed.errors, [])
  assert.deepEqual(parsed.warnings, [])
  assert.deepEqual(parsed.newCategories, [])
  assert.deepEqual(parsed.library.words.map(wordFields), [wordFields(WORD)])
  assert.deepEqual(
    [...parsed.library.cards].sort((a, b) => a.id.localeCompare(b.id)).map(cardFields),
    [...CARDS].sort((a, b) => a.id.localeCompare(b.id)).map(cardFields),
  )
})

test('見本の CSV は6つのテンプレートを1行ずつ持ち、そのまま読み込める', () => {
  const sample = parseCustomCardsTable(customCardsCsvSample(), { categories: [] })
  assert.equal(sample.status, 'ok')
  assert.deepEqual(sample.errors, [])
  assert.deepEqual(sample.warnings, [])
  const templates = [...sample.library.words.map(() => 'english'), ...sample.library.cards.map((card) => card.template)]
  assert.deepEqual(templates.sort(), CUSTOM_CARD_TEMPLATES.map((template) => template.id).sort())
  assert.deepEqual(sample.newCategories, ['2学期中間英語'])
  assert.equal(customCardsCsvFileName(Date.now(), true), 'study-app-custom-cards-sample.csv')
})

test('読み込む形：UTF-8（BOM あり・なし）と Shift_JIS、カンマ区切りとタブ区切り、"" で囲んだ欄（カンマ・改行・""）', () => {
  const plain = '分類,テンプレート,表,裏,解説\r\n社会,用語・意味・解説,三角州,川の河口にできる低く平らな土地,水田に使われる\r\n'
  const utf8 = new TextEncoder().encode(plain)
  assert.equal(decodeTableBytes(utf8), plain)
  assert.equal(decodeTableBytes(new Uint8Array([0xef, 0xbb, 0xbf, ...utf8])), plain)
  // 日本語の Excel が「CSV（コンマ区切り）」で保存する Shift_JIS。
  const shiftJis = Uint8Array.from(Buffer.from('95aa97de2c836583938376838c815b83672c955c2c97a02c89f090e00d0a8ed089ef2c97708cea814588d396a1814589f090e02c8e4f8a708f422c90ec82cc89cd8cfb82c982c582ab82e992e182ad95bd82e782c89379926e2c9085936382c98e6782ed82ea82e90d0a', 'hex'))
  assert.equal(decodeTableBytes(shiftJis), plain)
  for (const text of [plain, plain.replaceAll(',', '\t'), plain.replaceAll('\r\n', '\n')]) {
    const parsed = parseCustomCardsTable(text)
    assert.equal(parsed.status, 'ok')
    assert.deepEqual(parsed.library.cards.map((card) => [card.template, card.category, card.front, card.back, card.note]), [
      ['termNote', 'subject:social', '三角州', '川の河口にできる低く平らな土地', '水田に使われる'],
    ])
  }
  assert.equal(tableDelimiter('a\tb\nc,d'), '\t')
  assert.equal(tableDelimiter('a,b\nc\td'), ',')
  const quoted = parseDelimitedText('表,裏\r\n"カンマ, 入り","1行目\r\n2行目 ""引用"""\r\n')
  assert.deepEqual(quoted.map((row) => row.cells), [['表', '裏'], ['カンマ, 入り', '1行目\r\n2行目 "引用"']])
  assert.deepEqual(quoted.map((row) => row.line), [1, 2])
})

test('貼り付けた表（Excel からコピーしたタブ区切り・見出しのない一覧）も読む', () => {
  // Excel でえらんでコピーした表は、タブ区切りの文になる。
  const copied = 'テンプレート\t用語\t意味\n用語と意味\t光合成\t植物が光を使って養分をつくるはたらき\n用語と意味\t呼吸\t養分を分解してエネルギーを取り出すはたらき'
  const fromExcel = parseCustomCardsTable(copied, { subject: 'science' })
  assert.deepEqual(fromExcel.library.cards.map((card) => [card.category, card.front]), [['subject:science', '光合成'], ['subject:science', '呼吸']])
  // 見出しのない一覧は「表・裏・解説」の3列。分類が空なら英語（教科から開いたときはその教科）、テンプレートは分類の最初のもの。
  const headerless = parseCustomCardsTable('photosynthesis\t光合成\nrespiration\t呼吸\t生き物のはたらき')
  assert.deepEqual(headerless.library.words.map((word) => [word.word, word.meanings, word.note, word.category]), [
    ['photosynthesis', ['光合成'], '', 'subject:english'],
    ['respiration', ['呼吸'], '生き物のはたらき', 'subject:english'],
  ])
  const socialList = parseCustomCardsTable('扇状地,扇の形の土地', { subject: 'social' })
  assert.deepEqual(socialList.library.cards.map((card) => [card.template, card.category]), [['termNote', 'subject:social']])
})

test('読めない行は、行の番号と理由を知らせる（ほかの行は読む）。一部の欄を読まない行は注意として知らせる', () => {
  const text = [
    '分類,テンプレート,表,裏,解説,級,品詞,知らない列',
    '社会,用語と意味,三角州,低く平らな土地,この欄はテンプレートにない,,,',
    ',用語と意味,表だけ,,,,,',
    ',なぞのテンプレート,表,裏,,,,',
    ',英単語,glimmer,かすかな光,,10級,謎詞,',
  ].join('\n')
  const parsed = parseCustomCardsTable(text)
  assert.equal(parsed.status, 'ok')
  assert.deepEqual(parsed.errors.map((error) => error.line), [3, 4])
  assert.match(parsed.errors[0].message, /表.*裏.*両方/)
  assert.match(parsed.errors[1].message, /テンプレート「なぞのテンプレート」はありません/)
  const warnings = parsed.warnings.map((warning) => `${warning.line}:${warning.message}`)
  assert.ok(warnings.some((warning) => warning.startsWith('1:「知らない列」の列は読みません')), warnings.join(' / '))
  assert.ok(warnings.some((warning) => warning.startsWith('2:「解説・メモ」はテンプレート「用語と意味」にない欄')), warnings.join(' / '))
  assert.ok(warnings.some((warning) => warning.startsWith('5:品詞「謎詞」')), warnings.join(' / '))
  assert.ok(warnings.some((warning) => warning.startsWith('5:級「10級」')), warnings.join(' / '))
  assert.equal(parsed.library.cards.length + parsed.library.words.length, 2)
  assert.equal(levelFromText('英検準2級'), 'pre2')
  assert.equal(levelFromText('5'), '5')
  // カテゴリーは40個まで。超える名前の行は読まない。
  const many = ['分類,表,裏', ...Array.from({ length: CUSTOM_CARD_LIMITS.categories + 2 }, (_, index) => `カテゴリー${index},表${index},裏${index}`)].join('\n')
  const limited = parseCustomCardsTable(many)
  assert.equal(limited.newCategories.length, CUSTOM_CARD_LIMITS.categories)
  assert.equal(limited.errors.length, 2)
})

test('足す・書き換える：ID の同じカードを書き換え（暗記・テストの記録が残る）、新しい行は足し、ない名前のカテゴリーは作る。まるごと入れ替えるもできる', () => {
  const original = useStore.getState()
  try {
    useStore.setState({ ...useStore.getInitialState(), customWords: [WORD], customCards: CARDS, customCategories: [CATEGORY], customCardSrs: { 'c-csv0': { box: 3, due: 99999 } } }, true)
    const exported = customCardsCsvText({ words: [WORD], cards: CARDS, categories: [CATEGORY] })
    // Excel で1枚の裏を直し、新しい行を1つ足したファイル。
    const edited = exported
      .replace('用語と意味の裏\n2行目', '直した裏')
      + '期末理科,一問一答,植物が光を使って養分をつくるはたらきは？,光合成,,,,,,,,,,,,,,,,,\r\n'
    const parsed = parseCustomCardsTable(edited, { categories: useStore.getState().customCategories })
    assert.deepEqual(parsed.newCategories, ['期末理科'])
    const result = useStore.getState().importCustomLibrary(parsed.library, 'merge')
    assert.equal(result.addedCount, 1)
    assert.equal(result.updatedCount, CARDS.length + 1)
    assert.equal(result.categoryCount, 1)
    let state = useStore.getState()
    assert.equal(state.customCards.find((card) => card.id === 'c-csv0').back, '直した裏')
    assert.deepEqual(state.customCardSrs['c-csv0'], { box: 3, due: 99999 }, '同じカードの記録が残る')
    assert.ok(state.customCards.some((card) => card.back === '光合成'))
    assert.ok(state.customCategories.some((category) => category.title === '期末理科'))
    // 今あるカテゴリーは、表示する教科・最初のテンプレートの設定を保つ。
    assert.deepEqual(state.customCategories.find((category) => category.id === CATEGORY.id), CATEGORY)

    const replaced = parseCustomCardsTable('分類,表,裏\n社会,三角州,低い土地', { categories: state.customCategories })
    useStore.getState().importCustomLibrary(replaced.library, 'replace')
    state = useStore.getState()
    assert.deepEqual(state.customWords, [])
    assert.deepEqual(state.customCards.map((card) => card.front), ['三角州'])
    assert.deepEqual(state.customCategories, [])
  } finally {
    useStore.setState(original, true)
  }
})

test('ファイルの画面：CSV で書き出す・見本を保存・CSV やテキストのファイルを読み込む・表を貼り付けて読み込む', () => {
  const screen = read('../src/screens/CustomWords.jsx')
  assert.match(screen, /data-custom-cards-csv-export/)
  assert.match(screen, /saveFile\(customCardsCsvText\(library\), customCardsCsvFileName\(\), 'text\/csv;charset=utf-8'\)/)
  assert.match(screen, /data-custom-cards-csv-sample/)
  assert.match(screen, /accept="\.csv,\.tsv,\.txt,text\/csv,text\/tab-separated-values,text\/plain"/)
  assert.match(screen, /readTable\(decodeTableBytes\(await file\.arrayBuffer\(\)\), file\.name\)/)
  assert.match(screen, /data-custom-cards-paste-input/)
  assert.match(screen, /readTable\(pasted, '貼り付けた表'\)/)
  assert.match(screen, /parseCustomCardsTable\(text, \{ categories: library\.categories, subject \}\)/)
  assert.match(screen, /data-custom-cards-import-errors/)
  assert.match(screen, /data-custom-cards-import-warnings/)
  assert.match(screen, /data-custom-cards-import-new-categories/)
  assert.match(screen, /data-custom-cards-table-guide/)
  for (const template of CUSTOM_CARD_TEMPLATES) assert.ok(templateFor(template.id))
})
