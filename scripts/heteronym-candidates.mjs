// 発音辞書（CMU）で読みが分かれる英単語を、品詞・意味で発音が変わる語の候補として拾う。
// 候補かどうかは機械で拾えるが、読み分けの注意を出すかは人が決める（src/data/heteronyms.js）。
import { dictionary } from 'cmu-pronouncing-dictionary'

const vowelsOf = (pronunciation) => pronunciation.split(' ').filter((phone) => /\d$/.test(phone))
const primaryIndex = (pronunciation) => vowelsOf(pronunciation).findIndex((phone) => phone.endsWith('1'))
const primaryVowel = (pronunciation) =>
  (vowelsOf(pronunciation).find((phone) => phone.endsWith('1')) ?? '').replace(/\d$/, '')
// 強勢のある母音がこの組で入れ替わると、別の読みになる（row の oʊ/aʊ、read の i/ɛ、live の aɪ/ɪ など）。
const VOWEL_PAIRS = new Set([
  'AW|OW', 'OW|AW', 'IY|EH', 'EH|IY', 'AY|IH', 'IH|AY', 'UW|AW', 'AW|UW', 'IH|EH', 'EH|IH',
])

/** つづりの読みを、発音辞書に載っている順にすべて返す。 */
export function cmuPronunciations(spelling) {
  const key = String(spelling ?? '').toLowerCase()
  const found = []
  for (const suffix of ['', '(2)', '(3)', '(4)']) {
    const pronunciation = dictionary[`${key}${suffix}`]
    if (pronunciation) found.push(pronunciation)
  }
  return found
}

/**
 * 読みの分かれ方から、品詞・意味で発音が変わる語かもしれない理由を返す（なければ空）。
 * 機能語の弱形（the の ðə/ði など）は強勢のない読みなので数えない。
 */
export function heteronymCandidateReasons(spelling) {
  const key = String(spelling ?? '').toLowerCase()
  const pronunciations = cmuPronunciations(key)
  const reasons = new Set()
  for (let i = 0; i < pronunciations.length; i += 1) {
    for (let j = i + 1; j < pronunciations.length; j += 1) {
      const a = pronunciations[i]
      const b = pronunciations[j]
      const stressed = primaryIndex(a) >= 0 && primaryIndex(b) >= 0
      if (stressed && vowelsOf(a).length === vowelsOf(b).length && primaryIndex(a) !== primaryIndex(b)) {
        reasons.add('強勢の位置')
      }
      if (/ate$/.test(key) && /EY2 T$/.test(a) !== /EY2 T$/.test(b)) reasons.add('-ate の読み')
      if (a !== b && a.replace(/ Z$/, ' S') === b.replace(/ Z$/, ' S')) reasons.add('語尾の s/z')
      if (stressed && VOWEL_PAIRS.has(`${primaryVowel(a)}|${primaryVowel(b)}`)) reasons.add('強勢のある母音')
    }
  }
  return [...reasons]
}
