// 2回目の見直し（同じ品詞の派生語）で読む候補を、語尾の規則で拾う。
// 見直しの表（word-forms-review-sheet.mjs --pass2）と、候補を1件ずつ決めたかの確認（checks/word-forms-review.mjs --derivatives）が使う。
// 候補: 見出し語どうしで語尾だけちがう語（musician に対する music）と、辞書に見出しのない、発音辞書 CMU にある語（* つき）。
// まとまりに入れた語、つづりが似た別の語、同じつづりの別の語の側、辞書にない形として載せた語・外した語は候補にしない。
import { dictionary } from 'cmu-pronouncing-dictionary'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_FORM_EXTRAS, WORD_FORM_EXTRA_SKIPPED, WORD_FORM_HOMOGRAPH_SIDE } from '../src/data/word-forms.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { wordFamilyFor } from '../src/lib/wordRelations.js'

const POS = new Set(['名', '動', '形', '副'])
const SUFFIXES = ['er', 'or', 'ist', 'ian', 'an', 'ship', 'hood', 'dom', 'ism', 'ery', 'ry', 'ee', 'ess', 'ette', 'let', 'ling',
  'ure', 'age', 'ity', 'ness', 'ment', 'ance', 'ence', 'ation', 'ion', 'al', 'ical', 'ic', 'ish', 'ive', 'ous', 'ful', 'less',
  'able', 'ible', 'y', 'ly', 'ed', 'ing', 'ary', 'ory', 'ent', 'ant', 'en', 'ize', 'ify', 'ate', 'ward', 'wards']
// 見出しのない候補を発音辞書から拾う語尾（人・物事の名詞と、形容詞どうし）。
const EXTRA_SUFFIXES = new Set(['er', 'or', 'ist', 'ian', 'ship', 'hood', 'dom', 'ism', 'ess', 'ee', 'ery', 'ness', 'ity', 'ical', 'ish'])
const stems = (base) => [...new Set([base, base.replace(/e$/, ''), base.replace(/y$/, 'i'), base + base.at(-1), base.replace(/le$/, 'l')])]
const pairKey = (a, b) => [String(a).toLowerCase(), String(b).toLowerCase()].sort().join('|')

/** 見直しで読む語（品詞のある全見出し語）の id → 候補 [{ spelling, pos? }]（pos のない候補は見出しのない語）。 */
export function derivativeCandidates(words = ALL_WORDS) {
  const headwords = new Map()
  for (const word of words) {
    if (!POS.has(word.pos)) continue
    const key = word.word.toLowerCase()
    if (!headwords.has(key)) headwords.set(key, [])
    headwords.get(key).push(word)
  }
  const confusable = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => pairKey(a, b)))
  const confusableExtras = new Set(SPELLING_CONFUSABLE_EXTRAS.map(([of, word]) => `${of}|${word.toLowerCase()}`))
  const side = new Set(WORD_FORM_HOMOGRAPH_SIDE)
  const extraOf = new Set(WORD_FORM_EXTRAS.map(([of, word]) => `${of}|${word.toLowerCase()}`))
  const result = new Map()
  for (const word of words) {
    if (!POS.has(word.pos)) continue
    const family = wordFamilyFor(word)
    const familyWords = new Set([...family.other, ...family.same].map((item) => item.word.toLowerCase()))
    const base = word.word.toLowerCase()
    const found = new Map()
    const consider = (spelling, fromExtraSuffix) => {
      if (spelling === base || familyWords.has(spelling)) return
      for (const other of headwords.get(spelling) ?? []) {
        if (other.id === word.id || confusable.has(pairKey(word.id, other.id)) || side.has(pairKey(word.id, other.id))) continue
        found.set(spelling, { spelling, pos: other.pos })
      }
      if (!headwords.has(spelling) && fromExtraSuffix && dictionary[spelling] && spelling.length > base.length) {
        const key = `${word.id}|${spelling}`
        if (!extraOf.has(key) && !confusableExtras.has(key) && !WORD_FORM_EXTRA_SKIPPED[key]) found.set(spelling, { spelling })
      }
    }
    if (/^[a-z]+$/.test(base)) {
      for (const suffix of SUFFIXES) {
        for (const stem of stems(base)) consider(stem + suffix, EXTRA_SUFFIXES.has(suffix))
        // 語尾を落とした元の語（musician に対する music）
        if (base.endsWith(suffix) && base.length - suffix.length >= 3) {
          const root = base.slice(0, -suffix.length)
          for (const spelling of [root, `${root}e`, root.replace(/i$/, 'y'), root.replace(/(.)\1$/, '$1')]) consider(spelling, false)
        }
      }
    }
    result.set(word.id, [...found.values()])
  }
  return result
}

// 候補を載せない理由の略号（docs/audits/word-forms-review.json の derivativeCandidatesSkipped に略号で書く）。
export const DERIVATIVE_SKIP_REASONS = {
  非語: '辞書のふつうの語ではない（人名・地名・略語・発音辞書だけにある語）',
  まれ: '学習でまず出会わない、まれな語',
  変化: '比較級・最上級・過去分詞などの変化形で、派生語ではない',
  別語: 'つづりが似ているだけで、語源と意味のつながりがない別の語',
  遠縁: '語源ではつながるが、意味が離れて今は別の語として覚える語',
  同音: '同じつづりの別の語から作られた語で、この語の形ではない',
  複合: '別の語と組み合わせた複合語で、派生語ではない',
  別つづり: '同じ語の別のつづりで、ふつうのつづりの語を載せてある',
}
