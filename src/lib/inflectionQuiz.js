// 語形変化の問題（文法の「語形変化」の入口）。変化形の台帳（src/data/word-inflections.js）から、問える形すべてに4択を作る。
//   形の種類（INFLECTION_KINDS）: 動詞の3単現・過去形・過去分詞・ing形、名詞の複数形、形容詞・副詞の比較級・最上級
//   正解: 台帳の形（形が2つあるときはアメリカ式の先頭。ほかの形は誤答に使わない）
//   誤答: その語のほかの形（過去分詞・ing形など）と、つづりの規則を取り違えた形（studyed・makeing など）。
//         どれも、その語のその形として正しくない形だけを使う。4つの選択肢すべてに説明を付ける。
// 問題は GrammarQuiz（文法のテスト）でそのまま解ける形（id・q・choices・answer・choiceNotes・ruleExplanation・sentence）にする。
import { WORD_INFLECTIONS } from '../data/word-inflections.js'
import { ALL_WORDS } from '../data/vocab.js'
import { LEVELS } from '../data/levels.js'
import { shuffle } from '../data/vocab.js'
import { parseInflection } from './wordInflections.js'
import { isAmbiguousSpeechText } from './speechGuard.js'
import { inflectionPhoneticFor } from './inflectionSpeech.js'
import { INFLECTION_REAL_WORD_MISTAKES } from '../data/inflection-quiz-real-words.js'

export const INFLECTION_ID_PREFIX = 'gr_infl_'

export const INFLECTION_KINDS = Object.freeze([
  { id: 'third', label: '動詞の3単現', short: '3単現', pos: ['動'], row: '3単現', emoji: '🔤' },
  { id: 'past', label: '動詞の過去形', short: '過去形', pos: ['動'], row: '過去形', emoji: '⏪' },
  { id: 'participle', label: '動詞の過去分詞', short: '過去分詞', pos: ['動'], row: '過去分詞', emoji: '✅' },
  { id: 'ing', label: '動詞のing形', short: 'ing形', pos: ['動'], row: 'ing形', emoji: '🏃' },
  { id: 'plural', label: '名詞の複数形', short: '複数形', pos: ['名'], row: '複数形', emoji: '🍎' },
  { id: 'comparative', label: '形容詞・副詞の比較級', short: '比較級', pos: ['形', '副'], row: '比較級', emoji: '📈' },
  { id: 'superlative', label: '形容詞・副詞の最上級', short: '最上級', pos: ['形', '副'], row: '最上級', emoji: '🏆' },
])
export const inflectionKind = (id) => INFLECTION_KINDS.find((kind) => kind.id === id) ?? null

const LEVEL_ORDER = LEVELS.map((level) => level.id)
const levelRank = (level) => {
  const rank = LEVEL_ORDER.indexOf(level)
  return rank < 0 ? LEVEL_ORDER.length : rank
}

const VOWELS = 'aeiou'
const isConsonant = (ch) => Boolean(ch) && !VOWELS.includes(ch)
const endsCvc = (word) => /(?:^|[^aeiou]|qu)[aeiou][^aeiouwxy]$/.test(word)

/** 見出し語のその品詞の意味（問題文に添える）。 */
function meaningFor(word, pos) {
  const tagged = (word.meanings ?? []).filter((meaning) => /[(（](.)[)）]$/.test(meaning))
  if (pos === word.pos) {
    const own = (word.meanings ?? []).filter((meaning) => !/[(（].[)）]$/.test(meaning))
    return (own[0] ?? word.meanings?.[0] ?? '').trim()
  }
  const mark = tagged.find((meaning) => meaning.match(/[(（](.)[)）]$/)?.[1] === pos)
  if (mark) return mark.replace(/[(（].[)）]$/, '').trim()
  return (word.otherSenses ?? []).find((sense) => sense.pos === pos)?.meaning?.split('・')[0] ?? ''
}

// ---- つづりの決まり（正解の形がどの決まりで作られたか） ----

function suffixRule(kind, head, form) {
  const last = head.at(-1)
  const prev = head.at(-2)
  if (kind === 'third' || kind === 'plural') {
    if (form === `${head}s`) return 's'
    if (form === `${head}es`) return /o$/.test(head) ? 'oes' : 'es'
    if (last === 'y' && isConsonant(prev) && form === `${head.slice(0, -1)}ies`) return 'ies'
    if (kind === 'plural' && (form === `${head.slice(0, -1)}ves` || form === `${head.slice(0, -2)}ves`)) return 'ves'
    if (kind === 'plural' && form === head) return 'same'
    return 'irregular'
  }
  if (kind === 'past' || kind === 'participle') {
    if (form === `${head}d` && last === 'e') return 'e-d'
    if (last === 'y' && isConsonant(prev) && form === `${head.slice(0, -1)}ied`) return 'ied'
    if (form === `${head}${last}ed`) return 'double-ed'
    if (form === `${head}ked` && last === 'c') return 'cked'
    if (form === `${head}ed`) return 'ed'
    return 'irregular'
  }
  if (kind === 'ing') {
    if (head.endsWith('ie') && form === `${head.slice(0, -2)}ying`) return 'ying'
    if (last === 'e' && form === `${head.slice(0, -1)}ing`) return 'e-ing'
    if (form === `${head}${last}ing`) return 'double-ing'
    if (form === `${head}king` && last === 'c') return 'cking'
    if (form === `${head}ing`) return 'ing'
    return 'irregular'
  }
  // 比較級・最上級
  const [er, est] = kind === 'comparative' ? ['er', 'r'] : ['est', 'st']
  if (form.startsWith('more ') || form.startsWith('most ')) return 'more'
  if (last === 'e' && form === `${head}${est}`) return 'e-er'
  if (last === 'y' && form === `${head.slice(0, -1)}i${er}`) return 'ier'
  if (head.endsWith('ey') && form === `${head.slice(0, -2)}i${er}`) return 'ier'
  if (form === `${head}${last}${er}`) return 'double-er'
  if (form === `${head}${er}`) return 'er'
  return 'irregular'
}

const RULE_TEXT = {
  s: () => 'ふつうは語の終わりに s をつける。',
  es: () => 's・x・ch・sh で終わる語は es をつける。',
  oes: () => 'o で終わるこの語は es をつける。',
  ies: () => '子音字＋y で終わる語は、y を i に変えて es をつける。',
  ves: () => 'f・fe で終わるこの語は、f・fe を v に変えて es をつける。',
  same: () => 'この語は単数と複数が同じ形。',
  'e-d': () => 'e で終わる語は d だけをつける。',
  ied: () => '子音字＋y で終わる語は、y を i に変えて ed をつける。',
  'double-ed': () => '短い母音＋子音字で終わり、最後の音節を強く読む語は、最後の子音字を重ねて ed をつける。',
  cked: () => 'c で終わるこの語は、k を足してから ed をつける（panic・picnic など）。',
  ed: () => 'ふつうは語の終わりに ed をつける。',
  ying: () => 'ie で終わる語は、ie を y に変えて ing をつける。',
  'e-ing': () => '発音しない e で終わる語は、e をとって ing をつける。',
  'double-ing': () => '短い母音＋子音字で終わり、最後の音節を強く読む語は、最後の子音字を重ねて ing をつける。',
  cking: () => 'c で終わるこの語は、k を足してから ing をつける（panic・picnic など）。',
  ing: () => 'ふつうは語の終わりに ing をつける。',
  more: (k) => `この語は ${k === 'comparative' ? 'er' : 'est'} をつけず、前に ${k === 'comparative' ? 'more' : 'most'} を置いて${k === 'comparative' ? '比較級' : '最上級'}にする（長い語の多くや、-ed・-ful・-ous などで終わる語の作り方）。`,
  'e-er': (k) => `e で終わる語は ${k === 'comparative' ? 'r' : 'st'} だけをつける。`,
  ier: (k) => `子音字＋y で終わる語は、y を i に変えて ${k === 'comparative' ? 'er' : 'est'} をつける。`,
  'double-er': (k) => `短い母音＋子音字で終わる短い語は、最後の子音字を重ねて ${k === 'comparative' ? 'er' : 'est'} をつける。`,
  er: (k) => `短い語は、語の終わりに ${k === 'comparative' ? 'er' : 'est'} をつける。`,
  irregular: (k) => '決まりどおりに作らない、特別な形（不規則な変化）。1語ずつ暗記する。',
}

// ---- 誤答：つづりの決まりを取り違えた形 ----
// 誤答は「どの辞書でもその語のその形として認めない」形だけにする。認める辞書がある形（volcanos・focussed・
// broadcasted・shyer・more clever など）を誤りとして出さないよう、迷う語では作らない。

const syllables = (word) => {
  const groups = (word.match(/[aeiouy]+/g) ?? []).length
  return /[^aeiouy]e$/.test(word) && !/le$/.test(word) && groups > 1 ? groups - 1 : groups
}
// 規則どおりの形（-ed）も辞書が認める不規則動詞・形が変わらない動詞。-ed をつけた誤答を作らない。
const REGULAR_ALSO_ACCEPTED = new Set([
  'weave', 'bet', 'broadcast', 'forecast', 'quit', 'wet', 'input', 'output', 'rid', 'wed', 'plead', 'prove', 'shine',
  'strive', 'hang', 'dream', 'learn', 'burn', 'spell', 'smell', 'spill', 'spoil', 'dwell', 'kneel', 'leap', 'lean',
  'light', 'dive', 'sweat', 'fit', 'knit', 'speed', 'sow', 'sew', 'saw', 'mow', 'swell', 'hew', 'show', 'thrive',
  'awake', 'bid', 'cast', 'offset', 'beset', 'spit', 'gird', 'bless', 'dare', 'awaken', 'sneak', 'lie', 'outlast',
])
// 単数と複数が同じ形になる語や、ラテン語・ギリシャ語の複数形の語には、-s をつけた誤答を作らない。
const NATIVE_IRREGULAR_PLURALS = new Set(['child', 'man', 'woman', 'foot', 'tooth', 'goose', 'mouse', 'person', 'ox'])
// 比較級・最上級に -er・-est をつけない語尾（more・most を置く語）。
const NO_ER_ENDINGS = /(ful|ous|ive|ing|ed|ish|ic|al|less|ent|ant|able|ible|ary|ory|ian|ese|ile|ly)$/

function spellingMistakes(kind, head, answer, rule, pos) {
  const last = head.at(-1)
  const oneSyllable = syllables(head) === 1
  const list = []
  const add = (text, note) => list.push({ text, note })
  if (kind === 'third' || kind === 'plural') {
    const what = kind === 'third' ? '3単現' : '複数形'
    // 所有格（car's）は形が似ているが複数形ではない。どの名詞でも誤りになる。
    const possessive = () => pos === '名' && add(`${head}'s`, `${head}'s は所有格（「${head} の」と言う形）で、複数形ではない。`)
    if (rule === 'irregular') {
      if (pos === '名' && !answer.endsWith('s')) add(`${answer}s`, `${answer} はすでに複数形なので、さらに s をつけない。`)
      if (pos === '名' && NATIVE_IRREGULAR_PLURALS.has(head)) add(`${head}s`, `${head} の複数形は s をつけて作らない（特別な形 ${answer} になる）。`)
      if (pos === '名' && /[^sxz]$/.test(head) && !/(ch|sh)$/.test(head)) add(`${head}es`, `es をつけるのは s・x・ch・sh で終わる語。${head} の複数形は ${answer}。`)
      if (pos === '動') add(`${head}s`, `${head} の3単現は s をつけて作らない（特別な形 ${answer} になる）。`)
      possessive()
      return list
    }
    if (rule === 'same') {
      add(/s$/.test(head) ? `${head}es` : `${head}s`, `${head} は単数と複数が同じ形で、${/s$/.test(head) ? 'es' : 's'} をつけない。`)
      if (!/(s|x|z|ch|sh)$/.test(head)) add(`${head}es`, `es をつけるのは s・x・ch・sh で終わる語。${head} は単数と複数が同じ形にもなる。`)
      possessive()
      return list
    }
    if (/(o|f|fe)$/.test(head)) {
      possessive()
      return list
    }
    if (/(s|x|z|ch|sh)$/.test(head)) add(`${head}s`, `s・x・ch・sh で終わる語は、s ではなく es をつける。`)
    if (last === 'y' && isConsonant(head.at(-2))) {
      add(`${head}s`, `子音字＋y で終わる語は、y を i に変えて es をつける。`)
      add(`${head}es`, `子音字＋y で終わる語は、y を i に変えて es をつける（y を残さない）。`)
    }
    if (last === 'y' && !isConsonant(head.at(-2))) add(`${head.slice(0, -1)}ies`, `母音字＋y で終わる語は、y を変えずに s だけをつける。`)
    if (rule === 's' && !/(s|x|z|ch|sh|y|e)$/.test(head)) add(`${head}es`, `es をつけるのは s・x・ch・sh などで終わる語。${head} は s だけをつけて${what}にする。`)
    if (rule === 's' && last === 'e') add(`${head}es`, `e で終わる語は s だけをつける（${answer}）。`)
    possessive()
    return list
  }
  if (kind === 'past' || kind === 'participle') {
    const what = kind === 'past' ? '過去形' : '過去分詞'
    if (rule === 'irregular') {
      if (!REGULAR_ALSO_ACCEPTED.has(head) && answer !== head) {
        const regular = /e$/.test(head) ? `${head}d` : /[^aeiou]y$/.test(head) ? `${head.slice(0, -1)}ied` : `${head}ed`
        add(regular, `${head} は不規則に変化する動詞で、${what}は ed をつけて作らない（${answer}）。`)
      }
      return list
    }
    if (rule === 'e-d') add(`${head}ed`, `e で終わる語は d だけをつける（e を重ねない）。`)
    if (rule === 'ied') add(`${head}ed`, `子音字＋y で終わる語は、y を i に変えて ed をつける。`)
    if (last === 'y' && !isConsonant(head.at(-2))) add(`${head.slice(0, -1)}ied`, `母音字＋y で終わる語は、y を変えずに ed をつける。`)
    if (rule === 'cked') add(`${head}ed`, `c で終わるこの語は、k を足してから ed をつける。`)
    if (oneSyllable && rule === 'double-ed') add(`${head}ed`, `短い母音＋子音字1つで終わる1音節の語は、最後の子音字を重ねて ed をつける。`)
    if (oneSyllable && rule === 'ed' && /[^aeiouwxy]$/.test(head)) add(`${head}${last}ed`, `子音字を重ねるのは、短い母音＋子音字1つで終わる語だけ。${head} は重ねない。`)
    return list
  }
  if (kind === 'ing') {
    if (rule === 'e-ing' && !/(ge|ue|ye|oe|ee)$/.test(head)) add(`${head}ing`, `発音しない e で終わる語は、e をとって ing をつける。`)
    if (rule === 'ying') add(`${head}ing`, `ie で終わる語は、ie を y に変えて ing をつける。`)
    if (rule === 'cking') add(`${head}ing`, `c で終わるこの語は、k を足してから ing をつける。`)
    if (oneSyllable && rule === 'double-ing') add(`${head}ing`, `短い母音＋子音字1つで終わる1音節の語は、最後の子音字を重ねて ing をつける。`)
    if (oneSyllable && rule === 'ing' && /[^aeiouwxy]$/.test(head)) add(`${head}${last}ing`, `子音字を重ねるのは、短い母音＋子音字1つで終わる語だけ。${head} は重ねない。`)
    return list
  }
  // 比較級・最上級
  const [er, est] = kind === 'comparative' ? ['er', 'r'] : ['est', 'st']
  const what = kind === 'comparative' ? '比較級' : '最上級'
  const more = kind === 'comparative' ? 'more' : 'most'
  if (rule === 'irregular') {
    add(`${head}${er}`, `${head} の${what}は ${er} をつけて作らない（特別な形 ${answer} になる）。`)
    add(`${more} ${head}`, `${head} の${what}は ${more} を置いて作らない（特別な形 ${answer} になる）。`)
    return list
  }
  if (rule === 'more') {
    if (syllables(head) >= 3 || NO_ER_ENDINGS.test(head)) {
      add(`${head}${last === 'e' ? est : er}`, `${head} のような長い語・この語尾の語は、${er} をつけず前に ${more} を置く。`)
    }
    return list
  }
  if (rule === 'e-er') add(`${head}${er}`, `e で終わる語は ${est} だけをつける（e を重ねない）。`)
  if (rule === 'ier' && !oneSyllable) add(`${head}${er}`, `子音字＋y で終わる語は、y を i に変えて ${er} をつける。`)
  if (oneSyllable && rule === 'double-er') add(`${head}${er}`, `短い母音＋子音字1つで終わる1音節の語は、最後の子音字を重ねて ${er} をつける。`)
  if (oneSyllable && rule === 'er' && /[^aeiouwxy]$/.test(head)) add(`${head}${last}${er}`, `子音字を重ねるのは、短い母音＋子音字1つで終わる語だけ。${head} は重ねない。`)
  if (oneSyllable && /(er|e-er|double-er|ier)/.test(rule)) add(`${more} ${head}`, `${head} のような1音節の短い語は、${more} を置かず ${er} をつける。`)
  return list
}

// ---- 誤答：その語のほかの形 ----

const VERB_OTHER = {
  third: ['過去形', '過去分詞', 'ing形'],
  past: ['過去分詞', 'ing形', '3単現'],
  participle: ['過去形', 'ing形', '3単現'],
  ing: ['過去形', '3単現', '過去分詞'],
}
const OTHER_NOTE = {
  '3単現': (head, text) => `${text} は ${head} の3単現（主語が3人称単数で現在の文に使う形）。`,
  過去形: (head, text) => `${text} は ${head} の過去形（過去のことを言う形）。`,
  過去分詞: (head, text) => `${text} は ${head} の過去分詞（have ${text}・be ${text} のように使う形）。`,
  ing形: (head, text) => `${text} は ${head} のing形（be ${text} の進行形や動名詞に使う形）。`,
  比較級: (head, text) => `${text} は ${head} の比較級（2つを比べて「より〜」と言う形）。`,
  最上級: (head, text) => `${text} は ${head} の最上級（3つ以上で「いちばん〜」と言う形）。`,
}

const KIND_ROW = Object.fromEntries(INFLECTION_KINDS.map((kind) => [kind.id, kind.row]))

function buildQuestion(word, pos, kind, entry, allForms) {
  const head = word.word
  const rows = Object.fromEntries(entry.rows.map((row) => [row.label, row.forms.map((form) => form.text)]))
  const correct = rows[KIND_ROW[kind.id]]
  if (!correct?.length) return null
  const answer = correct[0]
  const used = new Set([answer.toLowerCase()])
  const valid = new Set(correct.map((text) => text.toLowerCase()))
  const notes = {}
  const distractors = []
  const take = (text, note, { allowHead = false } = {}) => {
    const key = text.toLowerCase()
    if (distractors.length >= 3 || used.has(key) || valid.has(key) || (!allowHead && key === head.toLowerCase())) return
    used.add(key)
    distractors.push(text)
    notes[text] = note
  }
  // その語のほかの形（2つまで）と、つづりの取り違え（1つ以上）を混ぜる。
  const others = pos === '動'
    ? VERB_OTHER[kind.id].map((label) => [label, rows[label]?.[0]])
    : pos === '名'
      ? []
      : [[kind.id === 'comparative' ? '最上級' : '比較級', rows[kind.id === 'comparative' ? '最上級' : '比較級']?.[0]]]
  const rule = suffixRule(kind.id, head.toLowerCase(), answer.toLowerCase())
  // つづりの取り違えは、ほかの語の正しい形と同じつづりになるもの（planed など）を使わない。
  // 辞書にある語（pleasanter・mouses・payed など、その語の別の形として認められるものもある）も使わない。
  const mistakes = spellingMistakes(kind.id, head, answer, rule, pos)
    .filter((mistake) => !allForms.has(mistake.text.toLowerCase()) && !INFLECTION_REAL_WORD_MISTAKES.has(mistake.text.toLowerCase()))
  if (mistakes[0]) take(mistakes[0].text, mistakes[0].note)
  for (const [label, text] of others) if (text) take(text, OTHER_NOTE[label](head, text))
  for (const mistake of mistakes) take(mistake.text, mistake.note)
  // 助動詞（can → could）は、ほかの助動詞の過去形を誤答にする。
  const MODAL_PAST = { will: 'would', can: 'could', shall: 'should', may: 'might' }
  if (pos === '動' && MODAL_PAST[head] && kind.id === 'past') {
    for (const [base, past] of Object.entries(MODAL_PAST)) if (base !== head) take(past, `${past} は ${base} の過去形。`)
  }
  const headNote = { 名: `${head} は単数形（1つのときの形）。`, 形: `${head} は原級（比べないときの形）。`, 副: `${head} は原級（比べないときの形）。`, 動: `${head} は原形（もとの形）。` }[pos]
  take(head, headNote, { allowHead: true })
  if (distractors.length < 2) return null
  const alternatives = correct.slice(1)
  const altText = alternatives.length ? `${alternatives.join('・')} とも書く。` : ''
  notes[answer] = `${answer} が ${head} の${kind.short}。${RULE_TEXT[rule](kind.id)}${altText}`
  const meaning = meaningFor(word, pos)
  const chain = pos === '動'
    ? kind.id === 'third' || kind.id === 'ing' ? [head, answer] : [head, rows.過去形?.[0], rows.過去分詞?.[0]]
    : pos === '名' ? [head, answer] : [head, rows.比較級?.[0], rows.最上級?.[0]]
  const en = [...new Set(chain.filter(Boolean))].join(', ')
  const speech = !en.split(/,\s*/).some((text) => isAmbiguousSpeechText(text))
  // 使い方で発音が変わる形（read の過去形など）をふくむときは読み上げず、正解の発音記号を解説に添える。
  const phonetic = inflectionPhoneticFor(word.id, KIND_ROW[kind.id], answer)
  const silentNote = speech ? '' : `（${phonetic ? `${answer} の発音は ${phonetic}。` : ''}使い方で発音が変わるつづりをふくむので、音声は出さない）`
  return {
    id: `${INFLECTION_ID_PREFIX}${kind.id}_${word.id}`,
    inflection: true,
    kind: kind.id,
    rule,
    wordId: word.id,
    pos,
    level: word.level,
    topic: `語形変化（${kind.short}）`,
    type: 'choice',
    q: `${head}（${meaning}）の${kind.short}は？`,
    prompt: `${kind.short}として正しい形は？`,
    choices: [answer, ...distractors],
    answer,
    choiceNotes: notes,
    ruleExplanation: `${head} の${kind.short}は ${answer}。${RULE_TEXT[rule](kind.id)}${altText}${silentNote}`,
    explain: `語形変化（${kind.short}）`,
    meaningCueRequired: false,
    sentence: { en, ja: meaning },
    speech,
  }
}

let cache = null

/** 台帳の問える形すべての、形1つずつの問い（表のマスの正解・誤り・説明のもと）。易しい級の語から。 */
function allCellQuestions() {
  if (cache) return cache
  const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
  const allForms = new Set()
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    const word = byId.get(id)
    for (const [pos, value] of Object.entries(record)) {
      for (const row of parseInflection(pos, value, word.word).rows) for (const form of row.forms) allForms.add(form.text.toLowerCase())
    }
  }
  const list = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    const word = byId.get(id)
    for (const kind of INFLECTION_KINDS) {
      // 形容詞と副詞で同じ形の語（fast など）は、1つにまとめる（形容詞を先に）。
      const posList = kind.pos.filter((pos) => record[pos])
      const seen = new Set()
      for (const pos of posList) {
        const entry = parseInflection(pos, record[pos], word.word)
        const key = entry.rows.map((row) => row.forms.map((form) => form.text).join('/')).join('|')
        if (!entry.rows.length || seen.has(key)) continue
        seen.add(key)
        const question = buildQuestion(word, pos, kind, entry, allForms)
        if (question) {
          list.push(posList.length > 1 && seen.size > 1 ? { ...question, id: `${question.id}_${pos === '副' ? 'adv' : 'adj'}` } : question)
        }
      }
    }
  }
  list.sort((a, b) => levelRank(a.level) - levelRank(b.level))
  cache = Object.freeze(list.map((item) => Object.freeze(item)))
  return cache
}

// ---- 問題にする語の範囲と、複数語の活用表 ----
// 範囲：級が5級・4級・3級の語と、準2級より上で決まりどおりに作れない不規則動詞（2026-11-27、利用者の決定）。
// 変化形そのものを問う問題は大学入試にほぼ出ないので、決まりを身につける3級以下の語にしぼる。
// 上の級の不規則動詞（seek → sought など）は、長文で形を見て元の語が分かるよう残す。
export const INFLECTION_SCOPE_LEVELS = Object.freeze(['5', '4', '3'])
export const INFLECTION_IRREGULAR_KEY = 'irregular'
export const INFLECTION_LEVEL_ROWS = Object.freeze([
  ...INFLECTION_SCOPE_LEVELS.map((id) => ({ id, label: `英検${LEVELS.find((level) => level.id === id)?.label ?? id}の語` })),
  { id: INFLECTION_IRREGULAR_KEY, label: '準2級〜1級の不規則動詞' },
])

// 表の種類。列は「もとの形」と、その品詞の形の種類。
export const INFLECTION_GROUPS = Object.freeze([
  { id: 'verb', label: '動詞の活用表', short: '活用表', emoji: '🔤', pos: ['動'], base: '原形', kinds: ['third', 'past', 'participle', 'ing'] },
  { id: 'noun', label: '名詞の複数形', short: '複数形', emoji: '🍎', pos: ['名'], base: '単数形', kinds: ['plural'] },
  { id: 'adjective', label: '形容詞・副詞の比較級と最上級', short: '比較級・最上級', emoji: '📈', pos: ['形', '副'], base: '原級', kinds: ['comparative', 'superlative'] },
])
export const inflectionGroup = (id) => INFLECTION_GROUPS.find((group) => group.id === id) ?? null
const groupOfPos = (pos) => INFLECTION_GROUPS.find((group) => group.pos.includes(pos))
const TABLE_SIZE = 5
const BASE_NOTE = { verb: (head) => `${head} は原形（もとの形）。`, noun: (head) => `${head} は単数形（1つのときの形）。`, adjective: (head) => `${head} は原級（比べないときの形）。` }

/** 範囲の語の行（語・品詞ごと）。表のすべてのマスの正解・誤り・説明を持つ。 */
/** 全見出し語の行（語・表の種類ごと。範囲で絞る前）。表の列がそろう語だけ（be・助動詞・変化形そのものの見出し語は外す）。 */
let allRowCache = null
function allInflectionRows() {
  if (allRowCache) return allRowCache
  const byWordPos = new Map()
  for (const item of allCellQuestions()) {
    const group = groupOfPos(item.pos)
    const key = `${item.wordId}|${group.id}`
    if (!byWordPos.has(key)) byWordPos.set(key, { wordId: item.wordId, pos: item.pos, group: group.id, level: item.level, cells: {} })
    byWordPos.get(key).cells[item.kind] = item
  }
  const rows = []
  for (const row of byWordPos.values()) {
    const group = inflectionGroup(row.group)
    // 列がそろう語（complete）だけを語形変化の表に使う。be は3単現の列がない（am・are・is）が、
    // 過去形・過去分詞はあるので、不規則に変化する語の表（原形・過去形・過去分詞）には入れる。
    const complete = group.kinds.every((kind) => row.cells[kind])
    const irregularOnly = !complete && row.group === 'verb' && row.cells.past && row.cells.participle
    if (!complete && !irregularOnly) continue
    const kinds = group.kinds.filter((kind) => row.cells[kind])
    const word = ALL_WORDS.find((item) => item.id === row.wordId)
    const cells = [
      {
        id: `${row.wordId}|${group.base}`,
        label: group.base,
        answer: word.word,
        note: BASE_NOTE[row.group](word.word),
        mistakes: kinds.map((kind) => ({
          text: row.cells[kind].answer,
          note: `${row.cells[kind].answer} は ${word.word} の${inflectionKind(kind).short}で、${group.base}ではない。`,
        })),
      },
      ...kinds.map((kind) => {
        const question = row.cells[kind]
        // be の過去形は主語で2つ（was・were）。別のつづりではないので、1つのマスに並べて書く。
        if (row.wordId === 'be' && kind === 'past') {
          return {
            id: `${row.wordId}|${inflectionKind(kind).short}`,
            label: inflectionKind(kind).short,
            kind,
            rule: question.rule,
            answer: 'was / were',
            note: 'be の過去形は、主語が I・he・she・it などなら was、you・we・they など（複数）なら were。',
            mistakes: question.choices.slice(1).filter((text) => text !== 'were').map((text) => ({ text, note: question.choiceNotes[text] })),
            speech: question.speech,
          }
        }
        return {
          id: `${row.wordId}|${inflectionKind(kind).short}`,
          label: inflectionKind(kind).short,
          kind,
          rule: question.rule,
          answer: question.answer,
          note: question.choiceNotes[question.answer],
          mistakes: question.choices.slice(1).map((text) => ({ text, note: question.choiceNotes[text] })),
          speech: question.speech,
        }
      }),
    ]
    const irregularVerb = row.group === 'verb' && ['past', 'participle'].some((kind) => row.cells[kind].rule === 'irregular')
    rows.push(Object.freeze({
      complete,
      wordId: row.wordId,
      pos: row.pos,
      group: row.group,
      level: row.level,
      levelKey: !complete ? null : INFLECTION_SCOPE_LEVELS.includes(row.level) ? row.level : irregularVerb ? INFLECTION_IRREGULAR_KEY : null,
      head: word.word,
      meaning: row.cells[kinds[0]].sentence.ja,
      cells: Object.freeze(cells),
    }))
  }
  rows.sort((a, b) => levelRank(a.level) - levelRank(b.level))
  allRowCache = Object.freeze(rows)
  return allRowCache
}

/** 範囲の語の行（3級以下の語と、準2級以上の不規則動詞）。 */
let rowCache = null
function inflectionRows() {
  if (rowCache) return rowCache
  const keyRank = (key) => (key === INFLECTION_IRREGULAR_KEY ? INFLECTION_SCOPE_LEVELS.length : INFLECTION_SCOPE_LEVELS.indexOf(key))
  rowCache = Object.freeze(allInflectionRows()
    .filter((row) => row.levelKey)
    .sort((a, b) => keyRank(a.levelKey) - keyRank(b.levelKey) || levelRank(a.level) - levelRank(b.level)))
  return rowCache
}

// ---- 不規則に変化する語（級を問わず全部）を型ごとに ----
// 動詞は原形・過去形・過去分詞の3つの形の並び方で4つの型に分ける（2026-11-27、利用者の依頼「不規則に変化するものを別に」）。
//   A-A-A cut-cut-cut ／ A-B-A come-came-come ／ A-B-B buy-bought-bought ／ A-B-C go-went-gone
// 名詞は決まりどおりでない複数形（children・crises・sheep・knives）、形容詞・副詞は決まりどおりでない比較級・最上級（good-better-best）。
export const IRREGULAR_GROUP = 'irregular'
export const IRREGULAR_CATEGORIES = Object.freeze([
  { id: 'verb-aaa', label: '動詞 A-A-A型', short: 'A-A-A', example: 'cut - cut - cut', note: '原形・過去形・過去分詞がみな同じ形。', group: 'verb' },
  { id: 'verb-aba', label: '動詞 A-B-A型', short: 'A-B-A', example: 'come - came - come', note: '過去分詞が原形と同じ形になる。', group: 'verb' },
  { id: 'verb-abb', label: '動詞 A-B-B型', short: 'A-B-B', example: 'buy - bought - bought', note: '過去形と過去分詞が同じ形。', group: 'verb' },
  { id: 'verb-abc', label: '動詞 A-B-C型', short: 'A-B-C', example: 'go - went - gone', note: '原形・過去形・過去分詞がみなちがう形。', group: 'verb' },
  { id: 'noun', label: '名詞の不規則な複数形', short: '複数形', example: 'child - children', note: 's・es をつけるだけでは作れない複数形（形が変わる・同じ形・f を v に変える・ラテン語やギリシャ語から来た形）。', group: 'noun' },
  { id: 'adjective', label: '不規則な比較級・最上級', short: '比較級・最上級', example: 'good - better - best', note: 'er・est も more・most も使わず、別の形になる。', group: 'adjective' },
])
export const irregularCategory = (id) => IRREGULAR_CATEGORIES.find((item) => item.id === id) ?? null
const VERB_COLUMNS = ['原形', '過去形', '過去分詞']

function irregularCategoryOf(row) {
  const cell = (label) => row.cells.find((item) => item.label === label)
  if (row.group === 'verb') {
    if (![cell('過去形'), cell('過去分詞')].some((item) => item.rule === 'irregular')) return null
    const [a, b, c] = VERB_COLUMNS.map((label) => cell(label).answer.toLowerCase())
    if (a === b && b === c) return 'verb-aaa'
    if (a === c) return 'verb-aba'
    if (b === c) return 'verb-abb'
    return 'verb-abc'
  }
  if (row.group === 'noun') return ['irregular', 'same', 'ves'].includes(cell('複数形').rule) ? 'noun' : null
  return [cell('比較級'), cell('最上級')].some((item) => item.rule === 'irregular') ? 'adjective' : null
}

/** 不規則に変化する語の行（全級）。動詞は原形・過去形・過去分詞の3列にする。 */
let irregularRowCache = null
export function irregularRows({ category = null } = {}) {
  irregularRowCache ??= Object.freeze(allInflectionRows().flatMap((row) => {
    const id = irregularCategoryOf(row)
    if (!id) return []
    const cells = row.group === 'verb' ? row.cells.filter((cell) => VERB_COLUMNS.includes(cell.label)) : row.cells
    return [Object.freeze({ ...row, category: id, cells: Object.freeze(cells) })]
  }))
  return category ? irregularRowCache.filter((row) => row.category === category) : irregularRowCache
}

function irregularTables() {
  const tables = []
  for (const category of IRREGULAR_CATEGORIES) {
    const rows = irregularRows({ category: category.id })
    const chunks = []
    for (let i = 0; i < rows.length; i += TABLE_SIZE) chunks.push(rows.slice(i, i + TABLE_SIZE))
    if (chunks.length > 1 && chunks.at(-1).length < 3) chunks.at(-2).push(...chunks.pop())
    chunks.forEach((chunk, index) => {
      tables.push(Object.freeze({
        id: `${INFLECTION_ID_PREFIX}irr_${category.id}_${index + 1}`,
        inflection: true,
        table: true,
        group: IRREGULAR_GROUP,
        category: category.id,
        levelKey: category.id,
        level: chunk[0].level,
        topic: `不規則変化（${category.short}）`,
        type: 'choice',
        q: `${category.label}の表の空所を埋めよう`,
        prompt: '空所を押して選び、下の語を押して入れる',
        columns: Object.freeze(chunk[0].cells.map((cell) => cell.label)),
        rows: Object.freeze(chunk),
        explain: `不規則変化（${category.short}）`,
        meaningCueRequired: false,
        patternExamples: Object.freeze([]),
      }))
    })
  }
  return tables
}

let tableCache = null
/** 範囲の語でできた全部の表（同じ表の種類・同じ級の語を約5語ずつ）。易しい級から。 */
export function inflectionQuestions() {
  if (tableCache) return tableCache
  const tables = []
  for (const levelRow of INFLECTION_LEVEL_ROWS) {
    for (const group of INFLECTION_GROUPS) {
      const rows = inflectionRows().filter((row) => row.levelKey === levelRow.id && row.group === group.id)
      if (!rows.length) continue
      const chunks = []
      for (let i = 0; i < rows.length; i += TABLE_SIZE) chunks.push(rows.slice(i, i + TABLE_SIZE))
      // 最後の表が2語以下なら、1つ前の表に入れる（空所3か所を散らせるように）。
      if (chunks.length > 1 && chunks.at(-1).length < 3) chunks.at(-2).push(...chunks.pop())
      chunks.forEach((chunk, index) => {
        tables.push(Object.freeze({
          id: `${INFLECTION_ID_PREFIX}tbl_${group.id}_${levelRow.id}_${index + 1}`,
          inflection: true,
          table: true,
          group: group.id,
          levelKey: levelRow.id,
          level: levelRow.id === INFLECTION_IRREGULAR_KEY ? chunk[0].level : levelRow.id,
          topic: `語形変化（${group.short}）`,
          type: 'choice',
          q: `${group.label}の空所を埋めよう`,
          prompt: '空所を押して選び、下の語を押して入れる',
          columns: Object.freeze([group.base, ...group.kinds.map((kind) => inflectionKind(kind).short)]),
          rows: Object.freeze(chunk),
          explain: `語形変化（${group.short}）`,
          meaningCueRequired: false,
          patternExamples: Object.freeze([]),
        }))
      })
    }
  }
  tables.push(...irregularTables())
  tableCache = Object.freeze(tables)
  return tableCache
}

let byIdCache = null
export function getInflectionQuestion(id) {
  if (!String(id ?? '').startsWith(INFLECTION_ID_PREFIX)) return null
  byIdCache ??= new Map(inflectionQuestions().map((item) => [item.id, item]))
  return byIdCache.get(id) ?? null
}

/** 表の種類 group・級 level（5・4・3・irregular）で絞った表。どちらも省けば全部。 */
export function inflectionQuestionsFor({ group = null, level = null } = {}) {
  return inflectionQuestions().filter((item) => (!group || item.group === group) && (!level || item.levelKey === level))
}

/** 表のマスの数（表の種類・級ごと）。 */
export function inflectionCellCount(tables) {
  return tables.reduce((sum, table) => sum + table.rows.reduce((n, row) => n + row.cells.length, 0), 0)
}

/**
 * テストに出す候補。易しい級の語から出すため、まだ答えていない表が残る最初の級までに絞る
 * （それより下の級は、答えた表の復習として残す）。級を指定したときはその級だけ。
 */
export function inflectionCandidates(source = {}, srs = {}) {
  if (source.questionType && !['mixed', 'choice'].includes(source.questionType)) return []
  // 不規則に変化する語の表は、その行から開いたときだけ出す（型ごとに全部の表）。
  if (source.group === IRREGULAR_GROUP) return inflectionQuestionsFor({ group: IRREGULAR_GROUP, level: source.category ?? null })
  const items = inflectionQuestionsFor({ group: source.group ?? null, level: source.level ?? null })
    .filter((item) => item.group !== IRREGULAR_GROUP)
  if (source.level) return items
  const firstOpen = items.find((item) => !srs?.[item.id])
  if (!firstOpen) return items
  const order = INFLECTION_LEVEL_ROWS.map((row) => row.id)
  const limit = order.indexOf(firstOpen.levelKey)
  return items.filter((item) => order.indexOf(item.levelKey) <= limit)
}

// ---- 1回分の出題：表の3か所を空所にし、入れる語のタイルを作る ----
export const INFLECTION_BLANKS = 3

/**
 * 表 table から1回分の問題を作る。空所はランダムに3か所。タイルは空所の正解3つと、
 * 空所ごとに誤り1つ（その語のその形として正しくない形。ほかの空所の正解・表に見えている形と同じつづりは使わない）。
 * answer は空所の正解を「|」でつないだもの（GrammarQuiz は入れた語を同じ形にして比べる）。
 */
export function inflectionRound(table, rng = Math.random) {
  if (!table?.table || table.blanks) return table
  const positions = table.rows.flatMap((row, r) => row.cells.map((cell, c) => ({ r, c })))
  const blanks = shuffle(positions, rng).slice(0, INFLECTION_BLANKS)
    .sort((a, b) => a.r - b.r || a.c - b.c)
  const cellAt = ({ r, c }) => table.rows[r].cells[c]
  const answers = blanks.map((blank) => cellAt(blank).answer)
  const blankSet = new Set(blanks.map(({ r, c }) => `${r}:${c}`))
  const visible = new Set(table.rows.flatMap((row, r) => row.cells
    .filter((cell, c) => !blankSet.has(`${r}:${c}`))
    .map((cell) => cell.answer.toLowerCase())))
  const used = new Set(answers.map((text) => text.toLowerCase()))
  const extras = []
  for (const blank of blanks) {
    const cell = cellAt(blank)
    const mistake = shuffle(cell.mistakes, rng)
      .find((item) => !used.has(item.text.toLowerCase()) && !visible.has(item.text.toLowerCase()))
    // もとの形の空所などで使える誤りがないときは、表のほかのマスの誤りから1つ足す。
    const fallback = mistake ?? shuffle(table.rows.flatMap((row) => row.cells.flatMap((item) => item.mistakes)), rng)
      .find((item) => !used.has(item.text.toLowerCase()) && !visible.has(item.text.toLowerCase()))
    if (!fallback) continue
    used.add(fallback.text.toLowerCase())
    extras.push(fallback.text)
  }
  const bank = shuffle([...answers, ...extras], rng)
  return Object.freeze({
    ...table,
    blanks: Object.freeze(blanks),
    bank: Object.freeze(bank),
    answer: answers.join('|'),
    ruleExplanation: blanks
      .map((blank) => {
        const cell = cellAt(blank)
        const lead = `${table.rows[blank.r].head} の${cell.label}は ${cell.answer}。`
        return cell.kind ? `${lead}${cell.note.replace(/^.*? が .*? の[^。]*。/, '')}` : lead
      })
      .join(' '),
  })
}

/** 空所 blank に text を入れたときの説明（正解なら作り方、誤りならなぜ入らないか）。 */
export function inflectionBlankNote(round, blank, text) {
  const row = round.rows[blank.r]
  const cell = row.cells[blank.c]
  if (!text) return ''
  if (text === cell.answer) return cell.note
  const mistake = cell.mistakes.find((item) => item.text === text)
  if (mistake) return mistake.note
  // ほかのマスの正しい形（ほかの空所の正解など）を入れたとき：その形が何かを言う。
  for (const other of round.rows) {
    const hit = other.cells.find((item) => item.answer === text)
    if (hit) return `${text} は ${other.head} の${hit.label}。ここ（${row.head} の${cell.label}）には ${cell.answer} が入る。`
  }
  // ほかのマスの誤りを入れたとき：その誤りの説明を、どのマスの誤りかを添えて言う。
  for (const other of round.rows) {
    for (const item of other.cells) {
      const wrong = item.mistakes.find((entry) => entry.text === text)
      if (wrong) {
        return `${text} はここ（${row.head} の${cell.label}）には入らない。${cell.label}は ${cell.answer}。（${text} は ${other.head} の${item.label}としても誤り：${wrong.note}）`
      }
    }
  }
  return `${text} は ${row.head} の${cell.label}ではない。${cell.label}は ${cell.answer}。`
}

/** 語形変化の学習ページ（表の種類・級ごと）に並べる語の行。 */
export function inflectionStudyRows({ group = null, level = null } = {}) {
  return inflectionRows().filter((row) => (!group || row.group === group) && (!level || row.levelKey === level))
}

/** 決まりの説明に使う例（形の種類 kind・決まり rule ごとに易しい語から）。 */
export function inflectionRuleExamples(kind, limit = 2) {
  const map = new Map()
  for (const row of inflectionRows()) {
    const cell = row.cells.find((item) => item.kind === kind)
    if (!cell) continue
    if (!map.has(cell.rule)) map.set(cell.rule, [])
    const list = map.get(cell.rule)
    if (list.length < limit) list.push({ row, cell })
  }
  return [...map]
}

export const INFLECTION_RULE_TEXT = RULE_TEXT

/** 全マスのつづりの取り違えの候補（台帳・辞書の語で外す前）。tests/inflection-quiz.test.mjs が辞書の語を突き合わせる。 */
export function inflectionMistakeCandidates() {
  const out = new Set()
  for (const item of allCellQuestions()) {
    const word = ALL_WORDS.find((w) => w.id === item.wordId)
    for (const mistake of spellingMistakes(item.kind, word.word, item.answer, item.rule, item.pos)) out.add(mistake.text.toLowerCase())
  }
  return out
}
