// 基礎長文：本文の語を辞書の見出し語へ戻し、その級の語・熟語の確認の欄と、級より上の語がないかの検査に使う。
import { getWord } from '../data/vocab.js'
import { getPhrase } from '../data/phrases.js'
import { READING_LEVELS } from '../data/levels.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { isPassageFunctionWord } from '../data/reading-study.js'

const LEVEL_RANK = new Map(READING_LEVELS.map((level, index) => [level.id, index]))
export const levelRank = (levelId) => LEVEL_RANK.get(levelId) ?? -1

// 語尾を落とすだけでは原形に戻らない形。左の形は、右の見出し語として引く。
const IRREGULAR_BASES = Object.freeze({
  am: 'be', are: 'be', is: 'be', was: 'be', were: 'be', been: 'be', being: 'be',
  did: 'do', does: 'do', done: 'do', has: 'have', had: 'have',
  went: 'go', gone: 'go', made: 'make', took: 'take', taken: 'take', came: 'come',
  saw: 'see', seen: 'see', gave: 'give', given: 'give', wrote: 'write', written: 'write',
  spoke: 'speak', spoken: 'speak', bought: 'buy', brought: 'bring', taught: 'teach',
  thought: 'think', caught: 'catch', found: 'find', knew: 'know', known: 'know',
  got: 'get', gotten: 'get', felt: 'feel', kept: 'keep', held: 'hold', heard: 'hear',
  met: 'meet', paid: 'pay', sent: 'send', built: 'build', became: 'become', began: 'begin',
  begun: 'begin', broke: 'break', broken: 'break', chose: 'choose', chosen: 'choose',
  drove: 'drive', driven: 'drive', ate: 'eat', eaten: 'eat', fell: 'fall', fallen: 'fall',
  forgot: 'forget', forgotten: 'forget', grew: 'grow', grown: 'grow', lost: 'lose',
  ran: 'run', sold: 'sell', sat: 'sit', slept: 'sleep', stood: 'stand', swam: 'swim',
  understood: 'understand', wore: 'wear', worn: 'wear', won: 'win', said: 'say', told: 'tell',
  led: 'lead', meant: 'mean', spent: 'spend', drew: 'draw', drawn: 'draw', flew: 'fly',
  flown: 'fly', threw: 'throw', thrown: 'throw', sang: 'sing', sung: 'sing', drank: 'drink',
  rode: 'ride', ridden: 'ride', woke: 'wake', hid: 'hide', hidden: 'hide', shook: 'shake',
  lent: 'lend', fed: 'feed', fought: 'fight', risen: 'rise', shot: 'shoot',
  stole: 'steal', stolen: 'steal', struck: 'strike', dug: 'dig',
  bitten: 'bite', froze: 'freeze', frozen: 'freeze', hung: 'hang',
  sought: 'seek', swept: 'sweep', forgave: 'forgive', forgiven: 'forgive', overcame: 'overcome',
  children: 'child', people: 'person', men: 'man', women: 'woman', feet: 'foot',
  teeth: 'tooth', mice: 'mouse', leaves: 'leaf', lives: 'life', knives: 'knife',
  wives: 'wife', shelves: 'shelf', halves: 'half', wolves: 'wolf',
  better: 'good', best: 'good', worse: 'bad', worst: 'bad', less: 'little', least: 'little',
  further: 'far', farther: 'far', bigger: 'big', biggest: 'big', hotter: 'hot', hottest: 'hot',
})

// 短縮形は、つながった2語として引く（どちらの語も級の検査に入れる）。
const CONTRACTIONS = Object.freeze({
  "i'm": ['i', 'am'], "you're": ['you', 'are'], "we're": ['we', 'are'], "they're": ['they', 'are'],
  "he's": ['he', 'is'], "she's": ['she', 'is'], "it's": ['it', 'is'], "that's": ['that', 'is'],
  "there's": ['there', 'is'], "what's": ['what', 'is'], "let's": ['let', 'us'],
  "don't": ['do', 'not'], "doesn't": ['does', 'not'], "didn't": ['did', 'not'],
  "isn't": ['is', 'not'], "aren't": ['are', 'not'], "wasn't": ['was', 'not'], "weren't": ['were', 'not'],
  "can't": ['can', 'not'], "couldn't": ['could', 'not'], "won't": ['will', 'not'],
  "wouldn't": ['would', 'not'], "shouldn't": ['should', 'not'], "haven't": ['have', 'not'],
  "hasn't": ['has', 'not'], "i'll": ['i', 'will'], "you'll": ['you', 'will'], "we'll": ['we', 'will'],
  "it'll": ['it', 'will'], "they'll": ['they', 'will'], "i've": ['i', 'have'], "we've": ['we', 'have'],
  "you've": ['you', 'have'], "they've": ['they', 'have'], "i'd": ['i', 'would'],
})

const tokenPattern = /[A-Za-z]+(?:['’][A-Za-z]+)*/g

/** 文の英字の語を、出てくる順に（短縮形は2語に分けて）返す。's（所有格）は前の語に戻す。 */
export function sentenceWordTokens(en) {
  const out = []
  for (const raw of String(en).match(tokenPattern) ?? []) {
    const token = raw.replace(/’/g, "'")
    const lower = token.toLowerCase()
    if (CONTRACTIONS[lower]) {
      out.push(...CONTRACTIONS[lower].map((part) => ({ surface: token, key: part })))
      continue
    }
    const possessive = lower.match(/^(.+)'s$/)
    out.push({ surface: token, key: possessive ? possessive[1] : lower.replace(/'$/, '') })
  }
  return out
}

/**
 * 本文の1語を見出し語へ戻す。長文ごとの forms（つづりが同じ別の語に当たる語の行き先）を先に見る。
 * 固有名詞（names）は null を返す（級の検査からも外す）。
 */
export function resolveBasicReadingToken(key, passage) {
  if (passage?.names?.some((name) => name.toLowerCase() === key)) return null
  const forced = passage?.forms?.[key]
  if (forced) return getWord(forced) ?? null
  const base = IRREGULAR_BASES[key]
  if (base) return getWord(base) ?? null
  const id = resolvePassageWord(key)?.id
  return (id && getWord(id)) || null
}

/**
 * 本文の全語。{ sentenceIndex, surface, key, word, isName }。word が null のものは固有名詞か辞書にない語。
 * ice cream・table tennis のように2語で1つの見出し語になる並びは、1語として引く。
 */
export function basicReadingTokens(passage) {
  return (passage?.sentences ?? []).flatMap((sentence, sentenceIndex) => {
    const tokens = sentenceWordTokens(sentence.en)
    const out = []
    for (let index = 0; index < tokens.length; index += 1) {
      const token = tokens[index]
      const next = tokens[index + 1]
      const pair = next && getWord(`${token.key}_${next.key}`)
      if (pair) {
        out.push({ sentenceIndex, surface: `${token.surface} ${next.surface}`, key: pair.id, word: pair, isName: false })
        index += 1
        continue
      }
      out.push({
        sentenceIndex,
        ...token,
        word: resolveBasicReadingToken(token.key, passage),
        isName: !!passage?.names?.some((name) => name.toLowerCase() === token.key),
      })
    }
    return out
  })
}

/** 本文の語数（英字と数字のかたまり）。 */
export function basicReadingWordCount(passage) {
  const text = (passage?.sentences ?? []).map((sentence) => sentence.en).join(' ')
  return text.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0
}

/**
 * 語彙の確認の欄に出す、その級の見出し語（本文に出る順に1回ずつ）。冠詞・代名詞などの機能語と、
 * 「知らない単語は文脈から推測する」問題で推測させる語（inferWords）は出さない。
 */
export function basicReadingLevelWords(passage) {
  const infer = new Set(passage?.inferWords ?? [])
  const seen = new Set()
  const words = []
  for (const { word } of basicReadingTokens(passage)) {
    if (!word || seen.has(word.id) || infer.has(word.id)) continue
    seen.add(word.id)
    if (word.level !== passage.level || isPassageFunctionWord(word)) continue
    words.push(word)
  }
  return words
}

/** 語彙の確認の欄に出す熟語・構文。 */
export function basicReadingPhrases(passage) {
  return (passage?.phrases ?? []).map(getPhrase).filter(Boolean)
}

/** 段落ごとの文（{ item, index }）のまとまり。 */
export function basicReadingParagraphs(passage) {
  const groups = []
  for (const [index, item] of (passage?.sentences ?? []).entries()) {
    if (!groups.length || item.paragraphStart) groups.push([])
    groups.at(-1).push({ item, index })
  }
  return groups
}
