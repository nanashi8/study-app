// 英単語・熟語・構文の暗記カードの読み上げ。
// 設定の範囲（単語のみ／単語・意味／単語・意味・例文・例文の意味）に合わせて、
// 見出し→意味→例文→例文の意味の順に続けて読む。意味と例文の意味は日本語の声で読む。
// 意味と例文の意味は答えにあたるので、カードに見えているときだけ読む。
// 単語（見出し）を読まないカード（スペルを隠している、使い方で発音が変わる語）では、例文と例文の意味も読まない。
import { JAPANESE_SPEECH_READINGS } from '../data/japanese-speech-readings.js'
import { meaningSegments } from './meaningReadings.js'
import { isAmbiguousSpeechText } from './speechGuard.js'
import { normalizeSpeechRange } from './speechRange.js'

// 品詞の目印。「〜に水をやる(動)」の(動)は読まない。
const POS_MARK = /[(（](?:名|動|形|副|前|接|代|助|冠|間|複)[)）]/gu
// かっこの中が英語だけの補足（「（of）〜から成る」）は、日本語の声では読まない。
const ENGLISH_NOTE = /[(（]\s*[A-Za-z][A-Za-z\s.'’/-]*[)）]/gu
// 「ここに語が入る」印（〜・…・—）は読まない。
const SLOT_MARKS = /[〜～~…‥—―]/gu
const BRACKETED = /[(（]([^()（）]*)[)）]/gu
const HIRAGANA_START = /^\p{Script=Hiragana}/u
const ONE_KANJI = /^\p{Script=Han}$/u
const ENDS_WITH_COMPOUND = /\p{Script=Han}{2}$/u
// 次の部分を読む前に置く間（ミリ秒）。
const PART_PAUSE_MS = 300

// 並べた語の区切り（／・）は「、」で間を置く。カタカナ語の中の・（リンカーンなどの名前）はそのまま。
function spokenJapanese(text) {
  return text
    .replace(/[／/]/gu, '、')
    .replace(/(?<!\p{Script=Katakana}ー?)・|・(?!\p{Script=Katakana})/gu, '、')
    .replace(/\s+/gu, ' ')
    .replace(/\s*、[\s、]*/gu, '、')
    .replace(/^[、\s]+|[、\s]+$/gu, '')
}

// かっこの補足は中身を読む。語のあとに付いた補足（「〜の間に(2つ)」「〜すべきだ（強め）」）は間を置いて読み、
// 続きの言葉（「影響（を与える）」）や、熟語に付く1字（「洞察(力)」「交通(量)」）は続けて読む。
function spokenBracket(match, inner, offset, whole) {
  const content = inner.trim()
  if (!content) return ''
  const before = whole.slice(0, offset).trim()
  if (!before || HIRAGANA_START.test(content)) return content
  if (ONE_KANJI.test(content) && ENDS_WITH_COMPOUND.test(before)) return content
  return `、${content}`
}

function spokenMeaning(text, { readings }) {
  let value = String(text ?? '').replace(POS_MARK, '').replace(ENGLISH_NOTE, '')
  if (readings) {
    // 読みにくい語は台帳の読みで読む。意味の中に読みが書いてある語（灌漑(かんがい)）は、書いてある読みだけを読む。
    value = meaningSegments(value)
      .map((segment) => segment.reading ?? (segment.entry ? '' : segment.text))
      .join('')
  }
  return spokenJapanese(value.replace(SLOT_MARKS, '').replace(BRACKETED, spokenBracket))
}

/**
 * 意味を日本語の声で読む文。いくつかの意味は「、」で区切って続けて読む。
 * readings は英単語の意味だけで使う（画面で読みを添えている台帳 meaning-readings.js）。
 */
export function meaningSpeechText(meanings, { readings = false } = {}) {
  const list = Array.isArray(meanings) ? meanings : [meanings]
  return list
    .map((meaning) => spokenMeaning(meaning, { readings }))
    .filter(Boolean)
    .join('、')
}

/**
 * 例文の意味（和訳）を日本語の声で読む文。
 * readings は英単語・熟語の和訳で使う（画面で（よみ）を添えている台帳 meaning-readings.js）。
 * 画面で読みを添えた語は、その読みで1回だけ読む（「彗星（すいせい）」を二度読みしない）。
 */
export function exampleMeaningSpeechText(text, { readings = false } = {}) {
  const value = String(text ?? '')
  const spoken = readings
    ? meaningSegments(value).map((segment) => segment.reading ?? (segment.entry ? '' : segment.text)).join('')
    : value
  return spokenJapanese(spoken.replace(SLOT_MARKS, ''))
}

/**
 * 端末の声が読み違えやすい語を、台帳（japanese-speech-readings.js）の読みに置き換える。
 * 語は前後の字を含めて文の中で1か所に決まるように書いてあり、前から順に置き換える。
 */
export function applyJapaneseSpeechReadings(text, pairs) {
  let spoken = String(text ?? '')
  for (const [target, reading] of pairs ?? []) spoken = spoken.replace(target, reading)
  return spoken
}

/** その英単語・熟語・構文の、意味と例文の意味の読み上げ文（台帳の読みを当てたもの）。 */
export function cardJapaneseSpeechTexts({ id, meanings, meaningReadings = false, exampleJa }) {
  const readings = (id && JAPANESE_SPEECH_READINGS[id]) || {}
  const meaning = meaningSpeechText(meanings, { readings: meaningReadings })
  const exampleMeaning = exampleMeaningSpeechText(exampleJa, { readings: meaningReadings })
  return {
    meaning: applyJapaneseSpeechReadings(meaning, readings.meaning),
    // 文法の例文は、意味が例文の和訳そのもの。同じ文には同じ読みを当てる。
    exampleMeaning: applyJapaneseSpeechReadings(
      exampleMeaning,
      readings.example ?? (exampleMeaning === meaning ? readings.meaning : null),
    ),
  }
}

// 同じ言葉を続けて2度読まない（構文は見出しの音声が例文そのもの、文法の例文は意味が例文の和訳そのもの）。
const sameWords = (segment) => `${segment.lang}:${segment.text.replace(/[\s\p{P}]/gu, '').toLowerCase()}`

function withPauses(parts) {
  const seen = new Set()
  const segments = parts.filter((part) => {
    if (!part || !String(part.text ?? '').trim()) return false
    const key = sameWords(part)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return segments.map((segment, index) => (
    index < segments.length - 1 ? { ...segment, pauseAfterMs: PART_PAUSE_MS } : segment
  ))
}

/**
 * 見出し（単語・熟語、構文は完成した例文）を声に出して読むか。
 * スペル（英語）を隠しているあいだと、使い方で発音が変わる語（heteronyms.js）は読まない。
 */
export function cardHeadSpoken({ head, spellingHidden = false }) {
  const headText = String(head ?? '').trim()
  return !spellingHidden && Boolean(headText) && !isAmbiguousSpeechText(headText, 'en-US')
}

/**
 * 暗記カードの読み上げ列。[見出し, 例文] の2つ（例文を読まないカードは見出しだけ）。
 * 見出しのボタンと自動の読み上げは、範囲に合わせて 見出し→意味→例文→例文の意味 を続けて読む。
 * 例文のボタンは 例文（範囲が例文の意味までなら→例文の意味）を読む。
 * answerOpen が false のあいだ（カードを開く前）は、意味と例文の意味を入れない。
 * spellingHidden（スペル・英語を隠して意味を先に見せているカード）は、見出しを読まず、見出しの名前も hiddenLabel にする。
 * 意味はカードに見えているので、範囲が意味まで・例文までなら入れる。
 * 見出しを読まないカード（spellingHidden、使い方で発音が変わる語）には、例文と例文の意味を入れない。
 * 見出しはいつもいちばん前（カードを開いたときは、2つめの部分から続きを読む）。読まない見出しも位置だけ残す（silent）。
 */
export function cardSpeechItems({
  id = null,
  head,
  headStyle = 'word',
  meanings,
  meaningReadings = false,
  example,
  exampleSpeech = true,
  range,
  answerOpen,
  spellingHidden = false,
  hiddenLabel = 'この単語',
}) {
  const scope = normalizeSpeechRange(range)
  const headText = String(head ?? '').trim()
  const headSpoken = cardHeadSpoken({ head: headText, spellingHidden })
  const withMeaning = (Boolean(answerOpen) || Boolean(spellingHidden)) && scope !== 'word'
  // 単語を読まないときは、例文も例文の意味も読まない。
  const exampleText = headSpoken && exampleSpeech ? String(example?.en ?? '').trim() : ''
  const withExample = Boolean(answerOpen) && scope === 'example' && Boolean(exampleText)
  const japanese = withMeaning
    ? cardJapaneseSpeechTexts({ id, meanings, meaningReadings, exampleJa: example?.ja })
    : null
  const exampleMeaning = withExample
    ? { text: japanese.exampleMeaning, label: '例文の意味', lang: 'ja-JP', style: 'translation' }
    : null

  const items = [{
    id: 'head',
    label: spellingHidden ? hiddenLabel : headText,
    segments: withPauses([
      { text: headText, lang: 'en-US', style: headStyle, ...(headSpoken ? {} : { silent: true }) },
      withMeaning && {
        text: japanese.meaning,
        label: '意味',
        lang: 'ja-JP',
        style: 'translation',
      },
      withExample && { text: exampleText, label: '例文', lang: 'en-US', style: 'sentence' },
      exampleMeaning,
    ]),
  }]
  if (exampleText) {
    items.push({
      id: 'example',
      label: exampleText,
      segments: withPauses([
        { text: exampleText, lang: 'en-US', style: 'sentence' },
        exampleMeaning,
      ]),
    })
  }
  return items
}

/**
 * 読み上げ列の中身を1つの文字列にしたもの。カードを開いた・範囲を変えた・スペルを隠したで列が変わったかを見分ける。
 * 読まない部分（silent）と見出しの名前も含める（スペルを隠すと、同じ文でも読まなくなり、名前も変わる）。
 */
export function speechItemsSignature(items) {
  return (items ?? [])
    .map((item) => [
      item.label ?? '',
      ...(item.segments ?? []).map((segment) => `${segment.silent ? '~' : ''}${segment.lang}:${segment.text}`),
    ].join('|'))
    .join('||')
}

/**
 * 暗記カードの自動読み上げで、いま何をするか。
 * action は play（読み上げる）・cue（読まずに再生パネルへ入れて止めておく）・none（そのまま）。
 * memory はこのカードでここまでに読んだもの（別のカードに移ったら null）。返す memory を次に渡す。
 * 再生パネルはどの場合も閉じない。カードを出しているあいだは、いまのカードの列を「再生」できるように置く。
 * - カードを出したら見出しを読む。自動で発音がオフなら読まずにパネルへ入れる。
 * - カードを開いたら、まだ読んでいない意味から続きを読む（見出しは読み直さない）。
 * - スペルを隠しているあいだは読まない。読んでいた音声を止め、パネルには隠したままの列（つづり・例文なし）を入れる。
 * - 範囲が意味までなら、開いたカードを閉じ直したときに読んでいる意味を止め、閉じたカードの列に入れ替える
 *   （パネルの「再生」から、閉じたカードの意味を読まない）。
 */
export function planCardAutoSpeech(memory, { spellingHidden, answerOpen, range, autoSpeak }) {
  const answerParts = normalizeSpeechRange(range) !== 'word'
  const open = Boolean(answerOpen)
  const fresh = !memory
  const previous = memory ?? { head: false, answer: false, open: false, hidden: false }
  if (spellingHidden) {
    return {
      action: fresh || !previous.hidden ? 'cue' : 'none',
      memory: { head: false, answer: false, open, hidden: true },
    }
  }
  const next = { ...previous, open, hidden: false }
  if (previous.open && !open && answerParts) return { action: 'cue', memory: next }
  if (!autoSpeak) return { action: fresh || previous.hidden ? 'cue' : 'none', memory: next }
  if (!previous.head) {
    return { action: 'play', startSegment: 0, memory: { head: true, answer: open && answerParts, open, hidden: false } }
  }
  if (open && answerParts && !previous.answer) {
    return { action: 'play', startSegment: 1, memory: { ...next, answer: true } }
  }
  return { action: 'none', memory: next }
}
