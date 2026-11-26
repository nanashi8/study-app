// 語形変化の問題（文法の「語形変化」の入口）。変化形の台帳（src/data/word-inflections.js）から、問える形すべてに4択を作る。
//   形の種類（INFLECTION_KINDS）: 動詞の3単現・過去形・過去分詞・ing形、名詞の複数形、形容詞・副詞の比較級・最上級
//   正解: 台帳の形（形が2つあるときはアメリカ式の先頭。ほかの形は誤答に使わない）
//   誤答: その語のほかの形（過去分詞・ing形など）と、つづりの規則を取り違えた形（studyed・makeing など）。
//         どれも、その語のその形として正しくない形だけを使う。4つの選択肢すべてに説明を付ける。
// 問題は GrammarQuiz（文法のテスト）でそのまま解ける形（id・q・choices・answer・choiceNotes・ruleExplanation・sentence）にする。
import { WORD_INFLECTIONS } from '../data/word-inflections.js'
import { ALL_WORDS } from '../data/vocab.js'
import { LEVELS } from '../data/levels.js'
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

/** 台帳の問える形すべての問題（易しい級の語から）。 */
export function inflectionQuestions() {
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
      // 形容詞と副詞で同じ形の語（fast など）は、1問にまとめる（形容詞を先に）。
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
  // 同じ決まりで作る形の例（答え合わせの「同じ形の例」）。易しい語から2つ。
  const byRule = new Map()
  for (const item of list) {
    const key = `${item.kind}|${item.rule}`
    if (!byRule.has(key)) byRule.set(key, [])
    byRule.get(key).push(item)
  }
  cache = Object.freeze(list.map((item) => Object.freeze({
    ...item,
    patternExamples: Object.freeze(byRule.get(`${item.kind}|${item.rule}`)
      .filter((other) => other.id !== item.id)
      .slice(0, 2)
      .map((other) => Object.freeze({ id: other.id, en: other.sentence.en, ja: other.sentence.ja, speech: other.speech }))),
  })))
  return cache
}

let byIdCache = null
export function getInflectionQuestion(id) {
  if (!String(id ?? '').startsWith(INFLECTION_ID_PREFIX)) return null
  byIdCache ??= new Map(inflectionQuestions().map((item) => [item.id, item]))
  return byIdCache.get(id) ?? null
}

/** 形の種類 kind・級 level で絞った問題。どちらも省けば全部。 */
export function inflectionQuestionsFor({ kind = null, level = null } = {}) {
  return inflectionQuestions().filter((item) => (!kind || item.kind === kind) && (!level || item.level === level))
}

/**
 * テストに出す候補。易しい級の語から出すため、まだ答えていない問題が残る最初の級までに絞る
 * （それより下の級は、答えた問題の復習として残す）。級を指定したときはその級だけ。
 */
export function inflectionCandidates(source = {}, srs = {}) {
  if (source.questionType && !['mixed', 'choice'].includes(source.questionType)) return []
  const items = inflectionQuestionsFor({ kind: source.kind ?? null, level: source.level ?? null })
  if (source.level) return items
  const firstOpen = items.find((item) => !srs?.[item.id])
  if (!firstOpen) return items
  const limit = levelRank(firstOpen.level)
  return items.filter((item) => levelRank(item.level) <= limit)
}

/** 語形変化の学習ページ（形の種類・級ごと）に並べる語の行。 */
export function inflectionStudyRows({ kind = null, level = null } = {}) {
  const seen = new Set()
  const rows = []
  for (const item of inflectionQuestionsFor({ kind, level })) {
    const key = `${item.wordId}|${item.pos}`
    if (seen.has(key)) continue
    seen.add(key)
    rows.push({ wordId: item.wordId, pos: item.pos, level: item.level, rule: item.rule })
  }
  return rows
}

export const INFLECTION_RULE_TEXT = RULE_TEXT

/** 全問題のつづりの取り違えの候補（台帳・辞書の語で外す前）。tests/inflection-quiz.test.mjs が辞書の語を突き合わせる。 */
export function inflectionMistakeCandidates() {
  const out = new Set()
  for (const item of inflectionQuestions()) {
    const word = ALL_WORDS.find((w) => w.id === item.wordId)
    for (const mistake of spellingMistakes(item.kind, word.word, item.answer, item.rule, item.pos)) out.add(mistake.text.toLowerCase())
  }
  return out
}
