#!/usr/bin/env node
// 文法の参考書（127単元＋25系統）と、参考書に結び付く文法の問題の、英文と和訳の食いちがいを止める
// （requests/2026-10-01-grammar-reference-translations.json）。
//
// 2026-10-01〜02、参考書の英文と和訳の組・英語をふくむ地の文・参考書に結び付く文法の問題を1件ずつ読んだ。
// 見つかった食いちがいの多くは、同じ単元の語法問題と並び替え問題のあいだで和訳や狙いが入れかわったもの
// （'I know who broke the vase.' に「窓を割った」、'I know who broke the window.' に「花びんを割った」など）。
// 参考書の「語と語の決まった結び付き」の例文は語法問題と同じ文なので、入れかわりは参考書のページにも出ていた。
// ここは次の3つで、読んだあとに変わったものと、手がかりでわかる食いちがいを止める。
//   1. 読んだ記録     … ページ（単元・系統）ごとに、英文と和訳の組・地の文・結び付く問題の指紋を台帳に残す。
//                        変えたらそのページを読み直して --stamp で指紋を書き直す
//   2. 和訳の手がかり … 数・人名・時・天気・色・家族・物の名前・彼と彼女を、英文と和訳の両方向から照らし合わせる
//   3. 狙いの手がかり … 語法問題の狙い（参考書の本文に「〜は …」と並ぶ結び付き）の英語の語が例文にあるか、
//                        狙いの日本語が例文にない物・時・人を言っていないか
// 手がかりで拾っても食いちがいではないものは、台帳の exceptions（和訳）・focusExceptions（狙い）に
// 「指紋: 理由」で書く（英文・和訳・狙いを変えると指紋が変わり、読み直すまで止まる）。
//   node scripts/checks/grammar-reference-translations.mjs          … 理由のない候補と、読んだあとに変わったページを出す
//   node scripts/checks/grammar-reference-translations.mjs --all    … 拾った候補をすべて出す
//   node scripts/checks/grammar-reference-translations.mjs --stamp  … 読み直したページの指紋と数を台帳に書く
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import {
  GRAMMAR_REFERENCE_UNITS,
  GRAMMAR_STRAND_REFERENCES,
  grammarReferenceFor,
} from '../../src/data/grammar-reference/index.js'
import { GRAMMAR_PRACTICE } from '../../src/data/grammar.js'
import { grammarQuestionType } from '../../src/data/grammar-format-expansion.js'

export const GRAMMAR_REFERENCE_TRANSLATION_REVIEW_PATH = new URL('../../docs/audits/grammar-reference-translations.json', import.meta.url)

const hash = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16)
export const pairKey = (en, ja) => hash(`${en}\n${ja}`)
export const focusKey = (focus, en) => hash(`${focus}\n${en}`)

/** 参考書の英文と和訳の組すべて（基本の形・ポイントの例文・発展の例文・系統の段の例文）。 */
export function grammarReferencePairs() {
  const pairs = []
  const push = (page, where, example) => {
    if (!example?.en) return
    pairs.push({ page, where, en: example.en, ja: example.ja, key: pairKey(example.en, example.ja) })
  }
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    unit.forms.forEach((form, index) => push(unit.id, `基本の形${index + 1}`, form.example))
    unit.points.forEach((point, p) => point.examples.forEach((example, index) => push(unit.id, `ポイント${p + 1}の例文${index + 1}`, example)))
    unit.advanced?.examples.forEach((example, index) => push(unit.id, `発展の例文${index + 1}`, example))
  }
  for (const strand of GRAMMAR_STRAND_REFERENCES) {
    strand.steps.forEach((step, index) => push(`gstrand_${strand.id}`, `段${index + 1}`, step.example))
  }
  return pairs
}

/** 英語の語句をふくむ地の文すべて（ここで学ぶこと・基本の形の形・本文・表・言いかえ・間違えやすいところ・チェック・系統の概要とつながり）。 */
export function grammarReferenceTexts() {
  const texts = []
  const ENGLISH = /[A-Za-z]{2,}/u
  const push = (page, where, text) => { if (text && ENGLISH.test(text)) texts.push({ page, where, text }) }
  const table = (page, where, value) => {
    if (!value) return
    ;[value.head, ...value.rows].forEach((row, index) => push(page, `${where}の表${index}`, row.join(' | ')))
  }
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    push(unit.id, 'ここで学ぶこと', unit.lead)
    unit.forms.forEach((form, index) => push(unit.id, `基本の形${index + 1}の形`, `${form.label}: ${form.form}`))
    unit.points.forEach((point, p) => {
      push(unit.id, `ポイント${p + 1}の題`, point.title)
      point.text.forEach((text, index) => push(unit.id, `ポイント${p + 1}の本文${index + 1}`, text))
      table(unit.id, `ポイント${p + 1}`, point.table)
    })
    if (unit.advanced) {
      push(unit.id, '発展の題', unit.advanced.title)
      unit.advanced.text.forEach((text, index) => push(unit.id, `発展の本文${index + 1}`, text))
      table(unit.id, '発展', unit.advanced.table)
    }
    unit.rewrites.forEach((item, index) => push(unit.id, `言いかえ${index + 1}`, `${item.from} → ${item.to}（${item.note}）`))
    unit.mistakes.forEach((item, index) => push(unit.id, `間違えやすいところ${index + 1}`, `× ${item.wrong} ○ ${item.right}（${item.why}）`))
    unit.check.forEach((text, index) => push(unit.id, `チェック${index + 1}`, text))
  }
  for (const strand of GRAMMAR_STRAND_REFERENCES) {
    strand.overview.forEach((text, index) => push(`gstrand_${strand.id}`, `概要${index + 1}`, text))
    strand.steps.forEach((step, index) => push(`gstrand_${strand.id}`, `段${index + 1}の要点`, step.point))
    strand.links.forEach((text, index) => push(`gstrand_${strand.id}`, `つながり${index + 1}`, text))
  }
  return texts
}

/**
 * 参考書に結び付く文法の問題（語法問題すべて・単元別の並び替え／選択問題・参考書と同じ英文を使う問題）。
 * 語法問題は参考書の「語と語の決まった結び付き」の例文と同じ文を使い、狙い（focus）がその本文に並ぶ。
 */
export function grammarQuizSentences() {
  const referenceEnglish = new Set(grammarReferencePairs().map((pair) => pair.en))
  return GRAMMAR_PRACTICE.flatMap((item) => {
    const type = grammarQuestionType(item)
    const { en, ja } = item.sentence ?? {}
    if (!en) return []
    if (type !== 'usage' && item.formatSource !== 'unit-question-formats' && !referenceEnglish.has(en)) return []
    const page = item.unitId ?? grammarReferenceFor(item.level, item.topic)?.id ?? `quiz_${item.level}_${item.topic}`
    return [{ id: item.id, page, type, en, ja, ...(type === 'usage' ? { focus: item.focus } : {}), key: pairKey(en, ja) }]
  })
}

/** ページ（単元・系統）ごとの指紋。組・地の文・結び付く問題のどれかを変えると、そのページの指紋が変わる。 */
export function grammarReferencePageFingerprints() {
  const pages = new Map()
  const page = (id) => {
    if (!pages.has(id)) pages.set(id, { pairs: [], texts: [], quiz: [] })
    return pages.get(id)
  }
  for (const unit of GRAMMAR_REFERENCE_UNITS) page(unit.id)
  for (const strand of GRAMMAR_STRAND_REFERENCES) page(`gstrand_${strand.id}`)
  for (const pair of grammarReferencePairs()) page(pair.page).pairs.push([pair.where, pair.en, pair.ja])
  for (const text of grammarReferenceTexts()) page(text.page).texts.push([text.where, text.text])
  for (const item of grammarQuizSentences()) page(item.page).quiz.push([item.id, item.en, item.ja, item.focus ?? ''])
  return Object.fromEntries([...pages].sort(([a], [b]) => a.localeCompare(b)).map(([id, content]) => [id, hash(JSON.stringify(content))]))
}

// ── 数 ──
const NUMBER_WORDS = {
  two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
  thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
  twice: 2, twenties: 20, dozen: 12,
}
const SCALE = { hundred: 100, thousand: 1000, million: 1_000_000 }
function englishNumbers(text) {
  const values = new Set()
  const words = text.toLowerCase().replace(/[’']s\b/gu, '').match(/[a-z]+|\d[\d,]*/gu) ?? []
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index]
    let value = /^\d/u.test(word) ? Number(word.replace(/,/gu, '')) : NUMBER_WORDS[word]
    if (value === undefined) continue
    // five million・two hundred のように後ろの桁の語をかける。
    while (SCALE[words[index + 1]]) { value *= SCALE[words[index + 1]]; index += 1 }
    if (value !== 1) values.add(value)
  }
  return values
}
const KANJI_DIGITS = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 }
function japaneseNumbers(text) {
  const values = new Set()
  const normalized = text.replace(/[０-９]/gu, (digit) => String.fromCharCode(digit.charCodeAt(0) - 0xFEE0))
  // 「5月」の月は月の名前の手がかり（may など）で見る。「2番目」「2作目」のような順番は、英語の second などと数えない。
  for (const match of normalized.matchAll(/(\d[\d,]*)(万|千)?(?!\d|,\d|月|番目|作目|回目|本目|度目|つ目|人目)/gu)) {
    const value = Number(match[1].replace(/,/gu, '')) * (match[2] === '万' ? 10_000 : match[2] === '千' ? 1000 : 1)
    if (value !== 1) values.add(value)
  }
  if (/(?<![\d一二三四五六七八九])千(?=円|人)/u.test(normalized)) values.add(1000)
  // 数を表すことがはっきりしている漢数字の言い方だけ（「十分」「一生けんめい」などは数ではない）。
  // 「二度と」「二度目」「何十年」は数ではない。
  for (const match of normalized.matchAll(/(?<!何)([二三四五六七八九十])(?=[人つ度回倍匹本冊枚年日時])(?!度と|度目|回目)/gu)) values.add(KANJI_DIGITS[match[1]])
  if (/二人|ふたり/u.test(normalized)) values.add(2)
  return values
}

// ── 対応する語 [名前, 英文の正規表現, 和訳の正規表現, 向き] ──
// 向き both は、どちらか一方にだけ出たら候補。en は「英文にあるのに和訳にない」だけ、ja は「和訳にあるのに英文にない」だけを見る
// （和訳の字がほかの語にもふくまれる「分（分かる）」「先（先生）」や、Ms. Brown を「ブラウン先生」と訳すように
// 和訳にだけ出てよいものは、和訳から英文へは見ない）。色は人名（Ms. Green）と分けるため小文字だけを見る。
const PAIRS = [
  // 人名
  ['ken', /\bKen\b/u, /ケン/u, 'both'], ['emi', /\bEmi\b/u, /エミ/u, 'both'], ['tom', /\bTom\b/u, /トム/u, 'both'], ['mary', /\bMary\b/u, /メアリー/u, 'both'],
  ['aya', /\bAya\b/u, /アヤ/u, 'both'], ['mika', /\bMika\b/u, /ミカ/u, 'both'], ['mina', /\bMina\b/u, /ミナ/u, 'both'], ['naomi', /\bNaomi\b/u, /ナオミ/u, 'both'],
  ['john', /\bJohn\b/u, /ジョン/u, 'both'], ['max', /\bMax\b/u, /マックス/u, 'both'], ['pochi', /\bPochi\b/u, /ポチ/u, 'both'], ['sato', /\bSato\b/u, /佐藤|サトウ/u, 'both'],
  ['columbus', /\bColumbus\b/u, /コロンブス/u, 'both'], ['curie', /\bCurie\b/u, /キュリー/u, 'both'],
  // 時
  ['yesterday', /\byesterday\b/iu, /昨日/u, 'both'], ['today', /\btoday\b/iu, /今日|本日|今でも|今も/u, 'en'], ['tomorrow', /\btomorrow\b/iu, /明日/u, 'both'],
  ['tonight', /\btonight\b|\bthis evening\b/iu, /今夜|今晩/u, 'both'], ['this morning', /\bthis morning\b/iu, /今朝|朝/u, 'en'], ['kesa', /\bthis morning\b/iu, /今朝/u, 'ja'],
  ['afternoon', /\bafternoon\b/iu, /午後/u, 'both'], ['morning', /\bmorning\b/iu, /朝|午前/u, 'en'],
  ['night', /\bnight\b|\btonight\b|\bevening\b|\bmidnight\b/iu, /夜(?!明け)|晩|夕方/u, 'both'], ['evening', /\bevening\b/iu, /夕方|晩|夜/u, 'en'],
  ['noon', /\bnoon\b/iu, /正午|昼/u, 'en'], ['midnight', /\bmidnight\b/iu, /真夜中|夜の12時/u, 'en'],
  ['week', /\bweeks?\b/iu, /週/u, 'en'], ['month', /\bmonths?\b/iu, /月|か月|ヶ月/u, 'en'], ['year', /\byears?\b|\bdecades?\b|\btwenties\b/iu, /年|歳|代|学期/u, 'en'],
  ['weekend', /\bweekends?\b/iu, /週末/u, 'both'], ['hour', /\bhours?\b/iu, /時間/u, 'en'], ['minute', /\bminutes?\b/iu, /分/u, 'en'],
  ['last', /\blast (?:night|week|weekend|month|year|spring|summer|autumn|fall|winter|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b|\bthe day before\b/iu, /昨夜|昨晩|昨年|先週|先月|去年|この前|前の日|前日/u, 'both'],
  ['next', /\bnext\b(?!\s+(?:door|to)\b)/iu, /来週|来月|来年|来春|来秋|次の|次に|翌/u, 'both'],
  ['ago', /\bago\b/iu, /前|昔/u, 'en'],
  ['monday', /\bmondays?\b/iu, /月曜/u, 'both'], ['tuesday', /\btuesdays?\b/iu, /火曜/u, 'both'], ['wednesday', /\bwednesdays?\b/iu, /水曜/u, 'both'],
  ['thursday', /\bthursdays?\b/iu, /木曜/u, 'both'], ['friday', /\bfridays?\b/iu, /金曜/u, 'both'], ['saturday', /\bsaturdays?\b/iu, /土曜/u, 'both'],
  ['sunday', /\bsundays?\b/iu, /日曜/u, 'both'],
  ['january', /\bJanuary\b/u, /(?<!\d)1月/u, 'both'], ['february', /\bFebruary\b/u, /(?<!\d)2月/u, 'both'], ['march', /\bMarch\b/u, /(?<!\d)3月/u, 'both'],
  ['april', /\bApril\b/u, /(?<!\d)4月/u, 'both'], ['may', /\b(?:in|on|of|since|until|by) May\b|\bMay \d/u, /(?<!\d)5月/u, 'both'],
  ['june', /\bJune\b/u, /(?<!\d)6月/u, 'both'], ['july', /\bJuly\b/u, /(?<!\d)7月/u, 'both'], ['august', /\bAugust\b/u, /(?<!\d)8月/u, 'both'],
  ['september', /\bSeptember\b/u, /(?<!\d)9月/u, 'both'], ['october', /\bOctober\b/u, /10月/u, 'both'], ['november', /\bNovember\b/u, /11月/u, 'both'],
  ['december', /\bDecember\b/u, /12月/u, 'both'],
  ['spring', /\bspring\b/iu, /春/u, 'both'], ['summer', /\bsummer\b/iu, /夏/u, 'both'], ['autumn', /\bautumn\b|\bin the fall\b/iu, /秋/u, 'both'], ['winter', /\bwinter\b/iu, /冬/u, 'both'],
  // 天気（「素晴らしい」の晴、「台風」「風呂」の風は天気ではない）
  ['rain', /\brain(?:s|ed|ing|y)?\b/iu, /雨/u, 'both'], ['snow', /\bsnow(?:s|ed|ing|y)?\b/iu, /雪/u, 'both'], ['sunny', /\bsunny\b/iu, /(?<!素)晴/u, 'both'],
  ['cloudy', /\bcloudy\b/iu, /曇|くもり/u, 'both'], ['storm', /\bstorms?\b/iu, /嵐/u, 'both'], ['wind', /\bwind(?:y|s)?\b/iu, /(?<!台)風(?!邪|呂)/u, 'both'],
  // 色（「面白い」の白は色ではない）
  ['red', /\bred\b/u, /赤(?!ちゃん|ん坊)/u, 'both'], ['blue', /\bblue\b/u, /青/u, 'both'], ['white', /\bwhite\b/u, /(?<!面)白/u, 'both'], ['black', /\bblack\b/u, /黒/u, 'both'],
  ['green', /\bgreen\b/u, /緑/u, 'both'], ['yellow', /\byellow\b/u, /黄/u, 'both'],
  // 家族・人を指す語（叔父・伯父の父、祖母・叔母の母は、父・母ではない）
  ['mother', /\bmother\b|\bmom\b/iu, /(?<!祖|叔|伯|父)母(?!国)/u, 'both'], ['father', /\bfather\b|\bdad\b/iu, /(?<!祖|叔|伯)父/u, 'both'], ['parents', /\bparents\b/iu, /両親|親/u, 'en'],
  ['brother', /\bbrothers?\b/iu, /兄|弟/u, 'both'], ['sister', /\bsisters?\b/iu, /姉|妹/u, 'both'],
  ['grandmother', /\bgrandmother\b|\bgrandma\b/iu, /祖母|おばあ/u, 'both'], ['grandfather', /\bgrandfather\b|\bgrandpa\b/iu, /祖父(?!母)|おじいさん/u, 'both'],
  ['grandparents', /\bgrandparents\b/iu, /祖父母/u, 'both'], ['uncle', /\buncle\b/iu, /おじ(?!い)|叔父|伯父/u, 'both'], ['aunt', /\baunt\b/iu, /おば(?!あ)|叔母|伯母/u, 'both'],
  ['son', /\bsons?\b/iu, /息子/u, 'both'], ['daughter', /\bdaughters?\b/iu, /娘/u, 'both'], ['cousin', /\bcousins?\b/iu, /いとこ/u, 'both'],
  ['teacher', /\bteachers?\b(?![’']\s*room)/iu, /先生|教師/u, 'en'], ['doctor', /\bdoctors?\b/iu, /医者|医師/u, 'both'],
  // よく出る物・場所・教科
  ['movie', /\bmovies?\b|\bfilms?\b/iu, /映画/u, 'both'], ['show', /\b(?:this|the|a|TV) shows?\b/iu, /番組|ショー(?!ウィンドウ)|公演/u, 'both'],
  ['vase', /\bvase\b/iu, /花びん|花瓶/u, 'both'], ['window', /\bwindows?\b/iu, /窓|ウィンドウ/u, 'both'], ['door', /(?<!next )\bdoors?\b/iu, /ドア|扉/u, 'both'],
  ['science', /\bscien(?:ce|tists?)\b/iu, /理科|科学/u, 'both'], ['music', /\bmusic(?:al)?\b/iu, /音楽(?!家)/u, 'both'], ['math', /\bmath\b/iu, /数学/u, 'both'],
  ['history', /\bhistory\b/iu, /歴史|史/u, 'both'],
  ['english', /\bEnglish\b/u, /英語|英/u, 'both'], ['french', /\bFrench\b/u, /フランス/u, 'both'], ['japanese', /\bJapanese\b/u, /日本語|日本人|日本の/u, 'en'], ['japan', /\bJapan\b/u, /日本/u, 'en'],
  ['tennis', /\btennis\b/iu, /テニス/u, 'both'], ['soccer', /\bsoccer\b/iu, /サッカー/u, 'both'], ['baseball', /\bbaseball\b/iu, /野球/u, 'both'],
  ['piano', /\bpiano\b/iu, /ピアノ/u, 'both'], ['guitar', /\bguitar\b/iu, /ギター/u, 'both'], ['violin', /\bviolin\b/iu, /バイオリン/u, 'both'],
  ['bus', /\bbus(?:es)?\b/iu, /バス(?!ケ)/u, 'both'], ['train', /\btrains?\b/iu, /電車|列車|終電/u, 'both'], ['bike', /\bbikes?\b|\bbicycles?\b/iu, /自転車/u, 'both'],
  ['cat', /\bcats?\b/iu, /ネコ|猫/u, 'both'], ['dog', /\bdogs?\b|\bpupp(?:y|ies)\b/iu, /犬/u, 'both'], ['bird', /\bbirds?\b/iu, /鳥/u, 'both'],
  ['station', /\bstations?\b/iu, /駅/u, 'both'], ['library', /\blibrar(?:y|ies)\b/iu, /図書館|図書室/u, 'both'], ['park', /\bparks?\b/iu, /公園/u, 'both'],
  ['museum', /\bmuseums?\b/iu, /博物館|美術館/u, 'both'], ['hospital', /\bhospitals?\b/iu, /病院/u, 'both'], ['river', /\brivers?\b/iu, /川/u, 'both'],
  ['mountain', /\bmountains?\b|\bMount\b/u, /(?<!登)山/u, 'both'], ['sea', /\bseas?\b/iu, /(?<!北)海(?!外|岸)/u, 'both'], ['lake', /\blakes?\b/iu, /湖/u, 'both'],
  ['tea', /\btea\b/iu, /紅茶|茶/u, 'both'], ['coffee', /\bcoffee\b/iu, /コーヒー/u, 'both'], ['milk', /\bmilk\b/iu, /牛乳|ミルク/u, 'both'],
  ['bread', /\bbread\b/iu, /パン/u, 'both'], ['cake', /\bcakes?\b/iu, /ケーキ/u, 'both'], ['umbrella', /\bumbrellas?\b/iu, /傘|かさ/u, 'both'],
  ['letter', /\bletters?\b/iu, /手紙|文字/u, 'en'], ['report', /\breports?\b/iu, /レポート|報告/u, 'both'],
]

/** 英文と和訳の組1つから、食いちがいの候補（手がかりの名前と中身）を返す。 */
export function translationClues({ en, ja }) {
  const clues = []
  const enNumbers = englishNumbers(en)
  const jaNumbers = japaneseNumbers(ja)
  const missing = [...enNumbers].filter((value) => !jaNumbers.has(value))
  const extra = [...jaNumbers].filter((value) => !enNumbers.has(value))
  if (missing.length || extra.length) clues.push(`数（英文 ${[...enNumbers].join('・') || 'なし'}／和訳 ${[...jaNumbers].join('・') || 'なし'}）`)
  for (const [name, english, japanese, direction] of PAIRS) {
    const inEnglish = english.test(en)
    const inJapanese = japanese.test(ja)
    if (direction !== 'ja' && inEnglish && !inJapanese) clues.push(`${name}（英文にあって和訳にない）`)
    if (direction !== 'en' && !inEnglish && inJapanese) clues.push(`${name}（和訳にあって英文にない）`)
  }
  // 彼と彼女：英文に she・her だけがあるのに和訳が「彼」、he・him・his だけがあるのに和訳が「彼女」。
  const female = /\b(?:she|her|hers|herself)\b/iu.test(en)
  const male = /\b(?:he|him|his|himself)\b/iu.test(en)
  const jaMale = /彼(?!女|ら)/u.test(ja)
  const jaFemale = /彼女/u.test(ja)
  if (female && !male && jaMale) clues.push('彼と彼女（英文は女性、和訳に「彼」）')
  if (male && !female && jaFemale) clues.push('彼と彼女（英文は男性、和訳に「彼女」）')
  return clues
}

// ── 語法問題の狙い ──
// 狙い「バスに乗って行くは take a bus」の英語の語（take・bus）が、例文 'I took a bus which goes to the airport.' にあるか。
// 動詞の形の変化（took・goes・studied・larger など）は同じ語として見る。
const IRREGULAR = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'], have: ['has', 'had', 'having'], do: ['does', 'did', 'done', 'doing'],
  go: ['goes', 'went', 'gone'], break: ['broke', 'broken'], take: ['took', 'taken'], see: ['saw', 'seen'], make: ['made'], win: ['won'],
  catch: ['caught'], hold: ['held'], lead: ['led'], withdraw: ['withdrew', 'withdrawn'], fall: ['fell', 'fallen'], bring: ['brought'],
  buy: ['bought'], teach: ['taught'], keep: ['kept'], get: ['got', 'gotten'], give: ['gave', 'given'], come: ['came'], run: ['ran'],
  write: ['wrote', 'written'], speak: ['spoke', 'spoken'], tell: ['told'], find: ['found'], think: ['thought'], feel: ['felt'],
  leave: ['left'], meet: ['met'], sit: ['sat'], stand: ['stood'], lie: ['lay', 'lain', 'lying'], rise: ['rose', 'risen'], swim: ['swam', 'swum'],
  forget: ['forgot', 'forgotten'], hear: ['heard'], say: ['said'], pay: ['paid'], lose: ['lost'], begin: ['began', 'begun'], wear: ['wore', 'worn'],
  steal: ['stole', 'stolen'], know: ['knew', 'known'], grow: ['grew', 'grown'], fly: ['flew', 'flown', 'flies'], ride: ['rode', 'ridden'],
  sleep: ['slept'], spend: ['spent'], send: ['sent'], build: ['built'], understand: ['understood'], misunderstand: ['misunderstood'],
  choose: ['chose', 'chosen'], drink: ['drank', 'drunk'], eat: ['ate', 'eaten'], sing: ['sang', 'sung'], drive: ['drove', 'driven'],
  wake: ['woke', 'woken'], arise: ['arose', 'arisen'], seek: ['sought'], fight: ['fought'], can: ['could'], will: ['would'], may: ['might'],
}
// 冠詞と、one’s・oneself（例文では my・himself などに置きかわる）、文法の用語の一部（動詞ing の ing）は見ない。
const FOCUS_SKIP = new Set(['the', 'a', 'an', 'one’s', "one's", 'oneself', 'ing'])
function wordForms(word) {
  const forms = new Set([word, ...(IRREGULAR[word] ?? [])])
  for (const ending of ['s', 'es', 'ed', 'd', 'ing', 'r', 'er', 'st', 'est']) forms.add(`${word}${ending}`)
  if (word.endsWith('e')) forms.add(`${word.slice(0, -1)}ing`)
  if (/[^aeiou]y$/u.test(word)) for (const ending of ['ies', 'ied', 'ier', 'iest']) forms.add(`${word.slice(0, -1)}${ending}`)
  if (/[^aeiou][aeiou][bdgmnprt]$/u.test(word)) for (const ending of ['ed', 'ing', 'er', 'est']) forms.add(`${word}${word.at(-1)}${ending}`)
  return forms
}
/**
 * 語法問題の狙いと例文の食いちがいの候補。狙いの英語の語が例文にないもの（1文字の A・B などの置き場所の記号と、
 * be動詞 などの用語は見ない）と、狙いの日本語が例文にない物・時・人を言っているもの（「電車が出発する」と bus など）。
 */
export function focusClues(focus, en) {
  const words = new Set((en.match(/[A-Za-z][A-Za-z’']*/gu) ?? []).map((word) => word.toLowerCase()))
  const english = (focus.replace(/be動詞/gu, '').match(/[A-Za-z][A-Za-z’']*/gu) ?? []).map((word) => word.toLowerCase())
  const clues = english
    .filter((word) => !FOCUS_SKIP.has(word) && !(word.length === 1 && word !== 'i') && ![...wordForms(word)].some((form) => words.has(form)))
    .map((word) => `${word}（狙いの英語にあって例文にない）`)
  const japanese = focus.replace(/[A-Za-z][A-Za-z’'\s.,!?]*/gu, ' ')
  for (const clue of translationClues({ en, ja: japanese })) {
    if (clue.endsWith('（和訳にあって英文にない）')) clues.push(clue.replace('（和訳にあって英文にない）', '（狙いの日本語にあって例文にない）'))
  }
  return clues
}

function readLedger() {
  try {
    return JSON.parse(readFileSync(GRAMMAR_REFERENCE_TRANSLATION_REVIEW_PATH, 'utf8'))
  } catch {
    return { exceptions: {}, focusExceptions: {}, pages: {} }
  }
}

/** 台帳と今のデータを照らし合わせる。 */
export function translationReview(ledger = readLedger()) {
  const pairs = grammarReferencePairs()
  const texts = grammarReferenceTexts()
  const quiz = grammarQuizSentences()
  // 和訳の手がかりは、英文と和訳が同じなら1つにまとめる（参考書の例文と語法問題は同じ組を持つ）。
  const groups = new Map()
  for (const source of [...pairs.map((pair) => ({ ...pair, from: `${pair.page} ${pair.where}` })), ...quiz.map((item) => ({ ...item, from: item.id }))]) {
    const group = groups.get(source.key) ?? { key: source.key, en: source.en, ja: source.ja, from: [] }
    group.from.push(source.from)
    groups.set(source.key, group)
  }
  const exceptions = ledger.exceptions ?? {}
  const candidates = [...groups.values()].map((group) => ({ ...group, clues: translationClues(group) })).filter((group) => group.clues.length)
  const candidateKeys = new Set(candidates.map((group) => group.key))

  const focusExceptions = ledger.focusExceptions ?? {}
  const focusCandidates = quiz
    .filter((item) => item.type === 'usage')
    .map((item) => ({ ...item, focusKey: focusKey(item.focus, item.en), clues: focusClues(item.focus, item.en) }))
    .filter((item) => item.clues.length)
  const focusCandidateKeys = new Set(focusCandidates.map((item) => item.focusKey))

  const fingerprints = grammarReferencePageFingerprints()
  const stamped = ledger.pages ?? {}
  const changedPages = Object.keys(fingerprints).filter((page) => stamped[page] !== fingerprints[page])
  const removedPages = Object.keys(stamped).filter((page) => !(page in fingerprints))
  return {
    pairs,
    texts,
    quiz,
    candidates,
    unexplained: candidates.filter((group) => !exceptions[group.key]),
    stale: Object.keys(exceptions).filter((key) => !candidateKeys.has(key)),
    focusCandidates,
    unexplainedFocus: focusCandidates.filter((item) => !focusExceptions[item.focusKey]),
    staleFocus: Object.keys(focusExceptions).filter((key) => !focusCandidateKeys.has(key)),
    fingerprints,
    changedPages,
    removedPages,
  }
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === `file://${process.argv[1]}`
if (runDirectly) {
  const ledger = readLedger()
  const review = translationReview(ledger)
  if (process.argv.includes('--stamp')) {
    ledger.counts = {
      pages: Object.keys(review.fingerprints).length,
      pairs: review.pairs.length,
      texts: review.texts.length,
      quizSentences: review.quiz.length,
      usageFocus: review.quiz.filter((item) => item.type === 'usage').length,
    }
    ledger.pages = review.fingerprints
    writeFileSync(GRAMMAR_REFERENCE_TRANSLATION_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
    console.error(`指紋を書き直した: ${review.changedPages.length}ページ（全${ledger.counts.pages}ページ）`)
    process.exit(0)
  }
  const all = process.argv.includes('--all')
  for (const group of all ? review.candidates : review.unexplained) {
    console.log(['和訳', group.key, group.from.join(' / '), group.en, group.ja, group.clues.join(' / ')].join('\t'))
  }
  for (const item of all ? review.focusCandidates : review.unexplainedFocus) {
    console.log(['狙い', item.focusKey, item.id, item.focus, item.en, item.clues.join(' / ')].join('\t'))
  }
  for (const page of review.changedPages) console.log(['読み直し', page].join('\t'))
  for (const page of review.removedPages) console.log(['なくなったページ', page].join('\t'))
  console.error([
    `英文と和訳: 参考書${review.pairs.length}組＋結び付く問題${review.quiz.length}問のうち手がかりの候補${review.candidates.length}組（理由のないもの${review.unexplained.length}・使われなくなった理由${review.stale.length}）`,
    `語法の狙い: 候補${review.focusCandidates.length}問（理由のないもの${review.unexplainedFocus.length}・使われなくなった理由${review.staleFocus.length}）`,
    `読んだ記録: 全${Object.keys(review.fingerprints).length}ページのうち読み直しが要るもの${review.changedPages.length}・なくなったもの${review.removedPages.length}`,
  ].join('\n'))
  const failed = review.unexplained.length || review.stale.length || review.unexplainedFocus.length || review.staleFocus.length || review.changedPages.length || review.removedPages.length
  process.exit(failed ? 1 : 0)
}
