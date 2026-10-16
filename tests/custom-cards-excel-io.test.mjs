// 自作カードの Excel 入出力の漏れを塞ぐ（依頼台帳 requests/2026-10-16-custom-cards-excel-io-audit.json）。
// 2026-10-16 利用者:「漏れなくエクセルで入出力ができるようになっているか入念に仕様や機能を確認しなさい。」
//   →「見つかった漏れを全部直して。上限は数千語まで広げて、UTF-16・セミコロンも読めるようにして。」
// 直した漏れ：上限（英単語5,000語・カード5,000枚）と黙った切り捨て、往復で別物になる型、カテゴリーの設定、UTF-16・セミコロン、
// テンプレート変更の置き換え、学習の記録ぜんぶのファイル保存。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  customCardsCsvText,
  decodeTableBytes,
  parseCustomCardsTable,
  tableDelimiter,
} from '../src/lib/customCardsCsv.js'
import { CUSTOM_CARD_LIMITS, normalizeCustomCard, normalizeCustomCategories } from '../src/lib/customCards.js'
import { CUSTOM_WORD_LIMITS, CUSTOM_WORD_POS, normalizeCustomWord } from '../src/lib/customWords.js'
import { mergeCustomLibrary, parseCustomLibraryFile } from '../src/lib/customLibrary.js'
import { decodeProgress, encodeProgress, selectProgressState } from '../src/lib/progressCode.js'
import { useStore } from '../src/store/useStore.js'

const NOW = 1_800_000_000_000
const NOUN = CUSTOM_WORD_POS.find((pos) => pos.label === '名詞').id
const VERB = CUSTOM_WORD_POS.find((pos) => pos.label === '動詞').id
const ADJECTIVE = CUSTOM_WORD_POS.find((pos) => pos.label === '形容詞').id
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const word = (input) => normalizeCustomWord({ id: 'u-aaa', createdAt: 1, ...input }, { now: NOW })
const roundTrip = (entry, categories = []) => {
  const csv = customCardsCsvText({ words: [entry], cards: [], categories })
  const back = parseCustomCardsTable(csv, { categories, now: NOW })
  return { back, word: back.library.words[0] }
}
const strip = ({ createdAt, updatedAt, ...rest }) => rest

test('上限は英単語5,000語・カード5,000枚。数千件を書き出して読み戻せる', () => {
  assert.equal(CUSTOM_WORD_LIMITS.words, 5000)
  assert.equal(CUSTOM_CARD_LIMITS.cards, 5000)
  const words = Array.from({ length: 5000 }, (_, index) => word({ id: `u-w${index}`, word: `word${index}`, meanings: `意味${index}`, createdAt: index }))
  const cards = Array.from({ length: 5000 }, (_, index) => normalizeCustomCard({ id: `c-k${index}`, template: 'other', front: `用語${index}`, back: `意味${index}`, createdAt: index }, { now: NOW }))
  const started = Date.now()
  const csv = customCardsCsvText({ words, cards, categories: [] })
  const back = parseCustomCardsTable(csv, { now: NOW })
  assert.equal(back.status, 'ok')
  assert.deepEqual(back.errors, [])
  assert.equal(back.library.words.length, 5000)
  assert.equal(back.library.cards.length, 5000)
  assert.equal(back.rowCount, 10000)
  assert.deepEqual(back.library.words.map((entry) => entry.id), words.map((entry) => entry.id))
  assert.ok(Date.now() - started < 15000, '数千件でも数秒で読み書きできる')
})

test('上限を超えた行は、黙って切らずに行の番号と理由を知らせる（まるごと入れ替えでも入らなかった枚数を数える）', () => {
  const lines = ['単語,意味,テンプレート', ...Array.from({ length: 5003 }, (_, index) => `w${index},意味${index},英単語`)]
  const parsed = parseCustomCardsTable(lines.join('\n'), { now: NOW })
  assert.equal(parsed.library.words.length, 5000)
  assert.equal(parsed.errors.length, 3)
  assert.match(parsed.errors[0].message, /5000語までなので、この行は読みません/u)
  assert.equal(parsed.errors[0].line, 5002)
  const cardLines = ['用語,意味,テンプレート', ...Array.from({ length: 5001 }, (_, index) => `t${index},m${index},その他`)]
  const cardParsed = parseCustomCardsTable(cardLines.join('\n'), { now: NOW })
  assert.equal(cardParsed.library.cards.length, 5000)
  assert.match(cardParsed.errors[0].message, /5000枚までなので/u)
  // まるごと入れ替え：JSON で上限を超える枚数を渡したとき、入らなかった枚数が skippedCount に出る。
  const over = Array.from({ length: 5002 }, (_, index) => ({ id: `u-j${index}`, word: `j${index}`, meanings: ['意味'] }))
  const replaced = mergeCustomLibrary({ words: [], cards: [], categories: [] }, { words: over, cards: [], categories: [] }, { mode: 'replace', now: NOW })
  assert.equal(replaced.library.words.length, 5000)
  assert.equal(replaced.skippedCount, 2)
  const file = parseCustomLibraryFile(JSON.stringify({ kind: 'custom-cards', words: over, cards: [], categories: [] }), { now: NOW })
  assert.equal(file.skipped, 2)
})

test('欄の長さ・個数の上限で切る中身は、行の番号・欄の名前・何字目（何個目）からかを知らせる', () => {
  const long = (n) => 'あ'.repeat(n)
  const csv = [
    '単語,意味,テンプレート,例文,解説・メモ,語の成り立ち,熟語・構文,類義語',
    `alpha,一・二・三・四・五・六,英単語,${'e'.repeat(250)},${long(350)},${long(450)},${Array.from({ length: 10 }, (_, index) => `p${index}（意${index}）`).join('；')},${Array.from({ length: 10 }, (_, index) => `s${index}`).join('；')}`,
    `Q${'q'.repeat(130)},${long(320)},その他,,${long(700)},,,`,
  ].join('\n')
  const parsed = parseCustomCardsTable(csv, { now: NOW })
  const messages = parsed.warnings.map((warning) => `${warning.line}:${warning.message}`).join('\n')
  assert.match(messages, /2:「意味」は4個までなので、5個目からは読みません（6個ありました）/u)
  assert.match(messages, /2:「例文」は200字までなので、201字目からは読みません（250字ありました）/u)
  assert.match(messages, /2:「解説・メモ」は300字までなので、301字目からは読みません（350字ありました）/u)
  assert.match(messages, /2:「語の成り立ち」は400字までなので、401字目からは読みません（450字ありました）/u)
  assert.match(messages, /2:「熟語・構文」は8個までなので、9個目からは読みません（10個ありました）/u)
  assert.match(messages, /2:「類義語」は8個までなので、9個目からは読みません（10個ありました）/u)
  assert.match(messages, /3:「用語」は120字までなので/u)
  assert.match(messages, /3:「意味」は300字までなので/u)
  assert.match(messages, /3:「解説」は600字までなので/u)
})

test('往復で別物になっていた型（意味なしの熟語・コロン・入れ子の括弧・；・意味の区切り文字・先頭の「\'」）が一致する', () => {
  const cases = [
    { phrases: [{ phrase: 'be fond of (doing)', meaning: '' }] },
    { phrases: [{ phrase: 'Note: this', meaning: '' }] },
    { phrases: [{ phrase: 'a b', meaning: '〜する（こと）（もの）' }] },
    { phrases: [{ phrase: 'a;b', meaning: 'x；y' }] },
    { synonyms: [{ w: 'dash', m: '走る（急ぐ（速く））' }] },
    { synonyms: [{ w: 'dash', m: '急ぐ；走る' }] },
    { antonyms: [{ w: 'a:b', m: '' }] },
    { derivatives: [{ w: 'x（y', m: '開き括弧だけ' }] },
    { derivatives: [{ w: 'back\\slash', m: '\\（' }] },
    { meanings: ['走る、急ぐ'] },
    { meanings: ['A・B', 'C,D'] },
    { meanings: ['走る（急ぐ・速く）', 'もう一つ'] },
    { meanings: ["'-s"] },
    { meanings: ["''=x"] },
    { otherSenses: [{ pos: NOUN, meaning: '人気者（愛称）' }, { pos: VERB, meaning: '比：例；二つ' }] },
    { otherSenses: [{ pos: VERB, meaning: '(' }] },
  ]
  for (const extra of cases) {
    const source = word({ word: 'sample', meanings: ['意味'], ...extra })
    const { back, word: parsed } = roundTrip(source)
    assert.deepEqual(back.errors, [], JSON.stringify(extra))
    assert.deepEqual(back.warnings, [], JSON.stringify(extra))
    assert.deepEqual(strip(parsed), strip(source), JSON.stringify(extra))
  }
})

test('手で書いた「語（意味）」「語：意味」「品詞：意味」は今まで通り読む', () => {
  const parsed = parseCustomCardsTable([
    '単語,意味,テンプレート,類義語,ほかの意味,熟語・構文',
    'popular,人気のある,英単語,famous(有名な)；well-known：よく知られた；plain,名詞：人気者；形容詞：大衆の,be popular with ～（～に人気がある）',
  ].join('\n'), { now: NOW })
  const [entry] = parsed.library.words
  assert.deepEqual(entry.synonyms, [{ w: 'famous', m: '有名な' }, { w: 'well-known', m: 'よく知られた' }, { w: 'plain', m: '' }])
  assert.deepEqual(entry.otherSenses.map((sense) => [sense.pos, sense.meaning]), [[NOUN, '人気者'], [ADJECTIVE, '大衆の']])
  assert.deepEqual(entry.phrases, [{ phrase: 'be popular with ～', meaning: '～に人気がある' }])
})

test('カテゴリーの表示する教科・最初のテンプレートを列に書き、カードのないカテゴリーも消さない', () => {
  const categories = normalizeCustomCategories([
    { id: 'cat-a', title: '定期テスト', subject: 'social', template: 'qa', createdAt: 5, updatedAt: 5 },
    { id: 'cat-empty', title: '空のカテゴリー', subject: 'english', template: 'english', createdAt: 6, updatedAt: 6 },
    { id: 'cat-bare', title: '設定なし', subject: null, template: null, createdAt: 7, updatedAt: 7 },
  ], { now: NOW })
  const card = normalizeCustomCard({ id: 'c-1', template: 'qa', category: 'cat-a', front: 'Q', back: 'A', createdAt: 10 }, { now: NOW })
  const csv = customCardsCsvText({ words: [], cards: [card], categories })
  const back = parseCustomCardsTable(csv, { categories: [], now: NOW })
  assert.equal(back.status, 'ok')
  assert.deepEqual(back.errors, [])
  assert.deepEqual(back.warnings, [])
  const byTitle = Object.fromEntries(back.library.categories.map((category) => [category.title, category]))
  assert.deepEqual(Object.keys(byTitle).sort(), ['定期テスト', '空のカテゴリー', '設定なし'].sort())
  assert.equal(byTitle['定期テスト'].subject, 'social')
  assert.equal(byTitle['定期テスト'].template, 'qa')
  assert.equal(byTitle['空のカテゴリー'].subject, 'english')
  assert.equal(byTitle['空のカテゴリー'].template, 'english')
  assert.equal(byTitle['設定なし'].subject, null)
  assert.equal(byTitle['設定なし'].template, null)
  assert.equal(back.library.cards.length, 1)
  assert.equal(back.library.cards[0].category, byTitle['定期テスト'].id)
  // 今ある同じ名前のカテゴリーには、ファイルの設定を反映する（暗記の記録の ID は変わらない）。
  const existing = normalizeCustomCategories([{ id: 'cat-old', title: '定期テスト', subject: null, template: null, createdAt: 1, updatedAt: 1 }], { now: NOW })
  const merged = parseCustomCardsTable(csv, { categories: existing, now: NOW })
  const same = merged.library.categories.find((category) => category.id === 'cat-old')
  assert.equal(same.subject, 'social')
  assert.equal(same.template, 'qa')
  assert.ok(!merged.newCategories.includes('定期テスト'))
})

test('Excel の保存形式：UTF-8・Shift_JIS に加えて UTF-16（BOM あり・なし、LE・BE）とセミコロン区切りを読む', () => {
  const text = '用語\t意味\n光合成\t植物が光を使って養分をつくるはたらき\nphotosynthesis\t光合成（こうごうせい）\n'
  const le = Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, 'utf16le')])
  const be = Buffer.from(text, 'utf16le').swap16()
  const beWithBom = Buffer.concat([Buffer.from([0xfe, 0xff]), be])
  assert.equal(decodeTableBytes(le), text)
  assert.equal(decodeTableBytes(beWithBom), text)
  assert.equal(decodeTableBytes(Buffer.from(text, 'utf16le')), text, 'BOM なしの UTF-16LE')
  assert.equal(decodeTableBytes(be), text, 'BOM なしの UTF-16BE')
  const parsed = parseCustomCardsTable(decodeTableBytes(le), { subject: 'social', now: NOW })
  assert.equal(parsed.library.cards.length, 2)
  assert.equal(parsed.library.cards[1].back, '光合成（こうごうせい）')
  // セミコロン区切り（地域の設定でカンマが小数点の Excel）。
  assert.equal(tableDelimiter('用語;意味\n光合成;光を使う\n'), ';')
  assert.equal(tableDelimiter('用語,意味\n光合成,光を使う\n'), ',')
  assert.equal(tableDelimiter('用語\t意味\n'), '\t')
  const semi = parseCustomCardsTable('用語;意味;解説・メモ\n光合成;光を使う、でんぷんをつくる;"覚え方; 光+水"\n', { subject: 'social', now: NOW })
  assert.deepEqual(semi.errors, [])
  assert.equal(semi.library.cards[0].back, '光を使う、でんぷんをつくる')
  assert.equal(semi.library.cards[0].note, '覚え方; 光+水')
  // 見出しのないセミコロン区切りの一覧（英文のカンマ・セミコロンに引きずられない）。
  assert.equal(tableDelimiter('三角州;川の河口の低い土地'), ';')
  // 書き出した CSV は、セミコロンを含む欄を引用符で囲む。
  const csv = customCardsCsvText({ words: [], cards: [normalizeCustomCard({ id: 'c-s', template: 'other', front: 'a;b', back: 'c', createdAt: 1 }, { now: NOW })], categories: [] })
  assert.ok(csv.includes('"a;b"'))
})

test('テンプレートを英単語とほかの間で変えて ID を残した行は、元のカードを新しいカードへ置き換える', () => {
  const original = useStore.getState()
  try {
    const oldWord = word({ id: 'u-keep', word: 'abc', meanings: 'あいう' })
    const oldCard = normalizeCustomCard({ id: 'c-keep', template: 'other', front: '用語', back: '意味', createdAt: 1 }, { now: NOW })
    useStore.setState({
      ...useStore.getInitialState(),
      customWords: [oldWord],
      customCards: [oldCard],
      customCategories: [],
    }, true)
    const csv = [
      '単語,意味,テンプレート,ID',
      'abc,あいう,その他,u-keep',
      '用語,意味,英単語,c-keep',
    ].join('\n')
    const parsed = parseCustomCardsTable(csv, { now: NOW })
    assert.equal(parsed.replaces.length, 2)
    assert.ok(parsed.warnings.every((warning) => /置き換えます/u.test(warning.message)))
    const result = useStore.getState().importCustomLibrary(parsed.library, 'merge', { replaces: parsed.replaces })
    const state = useStore.getState()
    assert.equal(result.replacedCount, 2)
    assert.deepEqual(state.customWords.map((entry) => entry.word), ['用語'])
    assert.deepEqual(state.customCards.map((entry) => entry.front), ['abc'])
    assert.ok(!state.customWords.some((entry) => entry.id === 'u-keep'))
    assert.ok(!state.customCards.some((entry) => entry.id === 'c-keep'))
  } finally {
    useStore.setState(original, true)
  }
})

test('学習の記録ぜんぶを進捗コードのファイルで保存・読み込みできる', () => {
  const backup = read('../src/components/ProgressBackup.jsx')
  assert.match(backup, /data-progress-code-file-save/)
  assert.match(backup, /new Blob\(\[`\$\{code\}\\n`\], \{ type: 'text\/plain;charset=utf-8' \}\)/)
  const screen = read('../src/screens/Progress.jsx')
  assert.match(screen, /data-progress-code-file-input/)
  assert.match(screen, /accept="\.txt,text\/plain"/)
  assert.match(screen, /file\.text\(\)\)\.match\(\/EQ1-/)
  // ファイルに保存した文字（コード＋改行）から取り出したコードが、そのまま復元に使える。
  const original = useStore.getState()
  try {
    const word1 = word({ id: 'u-rec', word: 'record', meanings: '記録' })
    useStore.setState({ ...useStore.getInitialState(), customWords: [word1], srs: { 'u-rec': { box: 2, due: 123 } } }, true)
    const code = encodeProgress(selectProgressState(useStore.getState()))
    const file = `${code}\n`
    const extracted = file.match(/EQ1-[^\s&"']+/u)[0]
    const payload = decodeProgress(extracted)
    assert.deepEqual(payload.srs['u-rec'], { box: 2, due: 123 })
    assert.equal(payload.customWords[0].id, 'u-rec')
  } finally {
    useStore.setState(original, true)
  }
})
