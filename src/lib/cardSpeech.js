// 英単語・熟語・構文の暗記カードの読み上げ。
// 設定の範囲（単語のみ／単語・意味／単語・意味・例文・例文の意味）に合わせて、
// 見出し→意味→例文→例文の意味の順に続けて読む。意味と例文の意味は日本語の声で読む。
// 意味と例文の意味は答えにあたるので、カードを開いて見えているときだけ読む。
import { meaningSegments } from './meaningReadings.js'
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

/** 例文の意味（和訳）を日本語の声で読む文。 */
export function exampleMeaningSpeechText(text) {
  return spokenJapanese(String(text ?? '').replace(SLOT_MARKS, ''))
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
 * 暗記カードの読み上げ列。[見出し, 例文] の2つ（例文を読まないカードは見出しだけ）。
 * 見出しのボタンと自動の読み上げは、範囲に合わせて 見出し→意味→例文→例文の意味 を続けて読む。
 * 例文のボタンは 例文（範囲が例文の意味までなら→例文の意味）を読む。
 * answerOpen が false のあいだ（カードを開く前）は、意味と例文の意味を入れない。
 * 見出しはいつもいちばん前（カードを開いたときは、2つめの部分から続きを読む）。
 */
export function cardSpeechItems({
  head,
  headStyle = 'word',
  meanings,
  meaningReadings = false,
  example,
  exampleSpeech = true,
  range,
  answerOpen,
}) {
  const scope = normalizeSpeechRange(range)
  const withMeaning = Boolean(answerOpen) && scope !== 'word'
  const withExample = Boolean(answerOpen) && scope === 'example'
  const headText = String(head ?? '').trim()
  const exampleText = exampleSpeech ? String(example?.en ?? '').trim() : ''
  const exampleMeaning = exampleText && withExample
    ? { text: exampleMeaningSpeechText(example?.ja), label: '例文の意味', lang: 'ja-JP', style: 'translation' }
    : null

  const items = [{
    id: 'head',
    label: headText,
    segments: withPauses([
      { text: headText, lang: 'en-US', style: headStyle },
      withMeaning && {
        text: meaningSpeechText(meanings, { readings: meaningReadings }),
        label: '意味',
        lang: 'ja-JP',
        style: 'translation',
      },
      withExample && exampleText && { text: exampleText, label: '例文', lang: 'en-US', style: 'sentence' },
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

/** 読み上げ列の中身を1つの文字列にしたもの。カードを開いた・範囲を変えたで列が変わったかを見分ける。 */
export function speechItemsSignature(items) {
  return (items ?? [])
    .map((item) => (item.segments ?? []).map((segment) => `${segment.lang}:${segment.text}`).join('|'))
    .join('||')
}

/**
 * 暗記カードの自動読み上げで、いま何をするか。
 * memory はこのカードでここまでに読んだもの（別のカードに移ったら null）。返す memory を次に渡す。
 * - スペルを隠しているあいだは読まず、再生パネルも閉じる（パネルにつづりが出るため）。
 * - カードを開く前は見出しだけを読む。開いたら、まだ読んでいない意味から続きを読む（見出しは読み直さない）。
 * - 範囲が意味までなら、開いたカードを閉じ直したときに再生パネルを閉じる（パネルから意味を読み直せるため）。
 */
export function planCardAutoSpeech(memory, { spellingHidden, answerOpen, range, autoSpeak }) {
  const answerParts = normalizeSpeechRange(range) !== 'word'
  const open = Boolean(answerOpen)
  const previous = memory ?? { head: false, answer: false, open: false }
  if (spellingHidden) {
    return { action: 'dismiss', memory: { head: false, answer: false, open } }
  }
  const next = { ...previous, open }
  if (previous.open && !open && answerParts) return { action: 'dismiss', memory: next }
  if (!autoSpeak) return { action: 'none', memory: next }
  if (!previous.head) {
    return { action: 'play', startSegment: 0, memory: { head: true, answer: open && answerParts, open } }
  }
  if (open && answerParts && !previous.answer) {
    return { action: 'play', startSegment: 1, memory: { ...next, answer: true } }
  }
  return { action: 'none', memory: next }
}
