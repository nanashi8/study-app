// 関連語・熟語の見直しで見つかった、同じつづりの別の語（requests/2026-09-21-relations-remaining.json の homograph-headwords）の回帰テスト。
// 見出し語がないと、別の語の形・熟語・関連語のリンクが元の語のカードに入るか、行き場がなくなる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { HOMOGRAPH_NOT_HEADWORD } from '../src/data/homographs.js'
import { WORD_FORM_EXTRAS, WORD_FORM_NOTES } from '../src/data/word-forms.js'
import { wordFamilyFor } from '../src/lib/wordRelations.js'
import { phrasesForWord } from '../src/lib/wordPhrases.js'
import { derivativeCandidates } from '../scripts/derivative-candidates.mjs'

const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'))
const familyOf = (word) => {
  const family = wordFamilyFor(word)
  return new Set([...family.other, ...family.same].map((item) => item.word.toLowerCase()))
}
const homographsBySpelling = new Map()
for (const word of ALL_WORDS) {
  if (!word.homographOf) continue
  if (!homographsBySpelling.has(word.word)) homographsBySpelling.set(word.word, [])
  homographsBySpelling.get(word.word).push(word)
}

// 見出し語にした別の語と、その語へ移した形・熟語・関連語のリンク。
const SPLIT = {
  bear_2: { forms: ['bearable', 'born', 'bearer', 'birth'], phrases: ['bear on', 'bear responsibility for', 'bear with', 'bear out'] },
  tear_2: { forms: ['tearful'] },
  wind_2: { forms: ['winding'], phrases: ['wind up'], linkedFrom: ['twist'] },
  wake_2: { phrases: ['in the wake of'] },
  counter_2: { phrases: ['run counter to'] },
  host_2: { phrases: ['a host of'], linkedFrom: ['myriad'] },
  found_2: { forms: ['foundation', 'founder'] },
  peer_2: { forms: ['peerless'] },
  utter_2: { forms: ['utterly'], linkedFrom: ['arrant', 'sheer'] },
  converse_2: { forms: ['conversely'] },
  sound_2: { forms: ['soundly', 'soundness'] },
  rear_2: { forms: ['rearing'] },
  can_2: { forms: ['canned'], linkedFrom: ['tin'] },
  rock_2: { linkedFrom: ['sway'] },
  mean_2: { forms: ['meanness'], linkedFrom: ['kind'] },
  like_2: { forms: ['likeness', 'liken', 'alike', 'likely'], phrases: ['look like', 'sound like', 'feel like doing', 'What is ... like?'] },
  row_3: { forms: ['rower', 'rowing'] },
  count_2: { forms: ['countess', 'county'] },
  box_2: { forms: ['boxing', 'boxer'] },
  bowl_2: { forms: ['bowling', 'bowler'] },
  bound_3: { forms: ['boundary', 'boundless'] },
  bow_2: { forms: ['bowed'] },
}

test('見直しで見つかった別の語は見出し語になり、形・熟語・関連語のリンクがその語へ移っている', () => {
  for (const [id, expected] of Object.entries(SPLIT)) {
    const word = getWord(id)
    assert.ok(word?.homographOf, `${id}: 見出し語がない`)
    const base = getWord(word.homographOf)
    const own = familyOf(word)
    const baseFamily = familyOf(base)
    for (const form of expected.forms ?? []) {
      assert.ok(own.has(form), `${id}: ${form} が形にない`)
      assert.ok(!baseFamily.has(form), `${base.id}: 別の語の形 ${form} が元の語のカードに残っている`)
    }
    const ownPhrases = phrasesForWord(word).map((phrase) => phrase.phrase)
    const basePhrases = phrasesForWord(base).map((phrase) => phrase.phrase)
    for (const phrase of expected.phrases ?? []) {
      assert.ok(ownPhrases.includes(phrase), `${id}: 熟語 ${phrase} がない`)
      assert.ok(!basePhrases.includes(phrase), `${base.id}: 別の語の熟語 ${phrase} が元の語のカードに残っている`)
    }
    for (const referrerId of expected.linkedFrom ?? []) {
      const referrer = getWord(referrerId)
      const items = [...referrer.synonyms, ...referrer.antonyms]
      assert.ok(items.some((item) => item.id === id), `${referrerId}: 関連語の欄が ${id} を指していない`)
    }
  }
  // bear（クマ）には「耐える」の熟語も形も残らない。
  assert.deepEqual(phrasesForWord(getWord('bear')).map((phrase) => phrase.phrase), [])
  assert.ok(!familyOf(getWord('bear')).has('bearable'))
})

test('同じつづりの別の語から来たとして見送った派生語の候補は、その語の見出し語で決めてあるか、見出し語にしない理由がある', () => {
  const { derivativeCandidatesSkipped } = readJson('docs/audits/word-forms-review.json')
  const candidates = derivativeCandidates()
  const decidedOn = (homograph, spelling) =>
    familyOf(homograph).has(spelling) || (candidates.get(homograph.id) ?? []).some((item) => item.spelling === spelling)
  const usedReasons = new Set()
  const undecided = []
  for (const [key, code] of Object.entries(derivativeCandidatesSkipped)) {
    if (code !== '同音') continue
    const [id, spelling] = key.split('|')
    const word = getWord(id)
    // 別の語の見出し語の側で見送った候補は、元の語の形（元の語のカードで決める）。
    if (word.homographOf) continue
    const own = word.word.toLowerCase()
    // 候補が「この語と同じつづりの別の語」から来た向きと、この語が「候補と同じつづりの別の語」から来た向きの両方を見る。
    const fromOwnSpelling = (homographsBySpelling.get(own) ?? []).some((homograph) => decidedOn(homograph, spelling))
    const fromCandidateSpelling = (homographsBySpelling.get(spelling) ?? []).some((homograph) => familyOf(homograph).has(own))
    if (fromOwnSpelling || fromCandidateSpelling) continue
    const reason = HOMOGRAPH_NOT_HEADWORD[own] ? own : HOMOGRAPH_NOT_HEADWORD[spelling] ? spelling : null
    if (reason) usedReasons.add(reason)
    else undecided.push(key)
  }
  assert.deepEqual(undecided, [], '別の語の見出し語を作るか、homographs.js の HOMOGRAPH_NOT_HEADWORD に見出し語にしない理由を書く')
  // 理由は、見送った候補に使われているものだけを残す。
  assert.deepEqual(Object.keys(HOMOGRAPH_NOT_HEADWORD).filter((spelling) => !usedReasons.has(spelling)), [])
  for (const [spelling, reason] of Object.entries(HOMOGRAPH_NOT_HEADWORD)) {
    assert.ok(getWord(spelling), `${spelling}: 元の語が辞書にない`)
    assert.ok(!homographsBySpelling.has(spelling), `${spelling}: 見出し語にした別の語がある`)
    assert.match(reason, /から/, `${spelling}: 由来がない`)
  }
})

test('元の語のカードに、別の語から来た形を「別の」と説明して載せない', () => {
  // 同じ語の意味の枝分かれ（minute の「微小な」、just の「公正な」など）は、ほかの意味として持ち、「別の」と書かない。
  const separated = /とは別の/
  assert.deepEqual(WORD_FORM_EXTRAS.filter((extra) => separated.test(extra[5] ?? '')).map(([of, word]) => `${of}|${word}`), [])
  assert.deepEqual(Object.entries(WORD_FORM_NOTES).filter(([, note]) => separated.test(note)).map(([id]) => id), [])
  // 形が意味の枝分かれから来る語は、その品詞の意味をカードに持つ。
  for (const [id, pos] of [['minute', '形'], ['just', '形'], ['present', '形'], ['desert', '動'], ['defect', '動'], ['tear', '動']]) {
    assert.ok(getWord(id).otherSenses.some((sense) => sense.pos === pos), `${id}: ${pos} の意味がない`)
  }
  // 意味欄に別の語の意味を混ぜない（bow の「弓」、utter の「全くの」、converse の「逆の」）。
  assert.equal(getWord('bow').meaning, 'お辞儀する・屈する')
  assert.equal(getWord('utter').meaning, '口に出す・(声を)発する')
  assert.equal(getWord('converse').meaning, '会話する・語り合う')
})
