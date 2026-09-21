// 単語から熟語・構文へのつながり（辞書ページの欄・不規則な形・ほかの品詞の形）の回帰テスト。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { IRREGULAR_PHRASE_LINKS, IRREGULAR_WORD_FORMS } from '../src/data/phrase-irregular-links.js'
import {
  FORM_PHRASES_OPEN_LIMIT,
  formPhraseGroupsForWord,
  irregularPhraseCandidates,
  isDerivedForm,
  phrasesForWord,
  sharesFormPhrases,
} from '../src/lib/wordPhrases.js'
import { wordFormsFor } from '../src/lib/wordRelations.js'
import { phraseLinksReviewGap } from '../scripts/checks/phrase-links-review.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const phraseNames = (id) => phrasesForWord(getWord(id)).map((phrase) => phrase.phrase)

test('辞書ページにも、暗記カードの裏と同じ熟語・構文の欄を出す', () => {
  for (const screen of ['src/screens/WordDetail.jsx', 'src/screens/VocabStudy.jsx']) {
    const source = read(screen)
    assert.match(source, /phraseGroupsForWord\(word\)/, screen)
    assert.match(source, /<WordPhraseSection word=\{word\} groups=\{relatedPhrases\} \/>/, screen)
  }
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /export function WordPhraseSection/)
  assert.match(component, /data-word-form-phrases/)
})

test('不規則な形でしか現れない熟語・構文は、全候補を1件ずつ読んだ台帳でつなぐ', () => {
  const candidates = new Set()
  for (const word of ALL_WORDS) {
    for (const phrase of irregularPhraseCandidates(word)) candidates.add(`${word.id}|${phrase.id}`)
  }
  const unread = [...candidates].filter((key) => !(key in IRREGULAR_PHRASE_LINKS))
  assert.deepEqual(unread, [], '候補 → IRREGULAR_PHRASE_LINKS に true か外す理由を書く')
  const stale = Object.keys(IRREGULAR_PHRASE_LINKS).filter((key) => !candidates.has(key))
  assert.deepEqual(stale, [], '候補でなくなった行は台帳からも消す')
  for (const [key, decision] of Object.entries(IRREGULAR_PHRASE_LINKS)) {
    const [wordId, phraseId] = key.split('|')
    const shown = phrasesForWord(getWord(wordId)).some((phrase) => phrase.id === phraseId)
    if (decision === true) assert.ok(shown, key)
    else assert.ok(typeof decision === 'string' && decision && !shown, key)
  }
  // be → there is・as it were、make → be made of、tooth → brush one's teeth、commit → be committed to
  assert.ok(phraseNames('be').includes('there is / are ~'))
  assert.ok(phraseNames('be').includes('as it were'))
  assert.ok(phraseNames('make').includes('be made of'))
  assert.ok(phraseNames('tooth').includes("brush one's teeth"))
  assert.ok(phraseNames('commit').includes('be committed to'))
  // つづりが同じ別の語の熟語はつながない（turn left の left は「左」、lay off は動詞 lay）
  assert.ok(!phraseNames('leave').includes('turn left'))
  assert.ok(!phraseNames('lie_2').includes('lay off'))
  for (const id of Object.keys(IRREGULAR_WORD_FORMS)) assert.ok(getWord(id), `${id} は見出し語の id`)
})

test('ほかの品詞の形を使う熟語・構文を、両方向の語のカードと辞書ページから引ける', () => {
  const groupsOf = (id) => formPhraseGroupsForWord(getWord(id))
  // 作られた形の熟語（decide に対する decision の make a decision）
  const decision = groupsOf('decide').find((group) => group.form.word === 'decision')
  assert.ok(decision.derived && decision.phrases.some((phrase) => phrase.phrase === 'make a decision'))
  // 元の語の熟語（response に対する respond の respond to、decision に対する decide の decide to）
  assert.ok(groupsOf('response').some((group) => !group.derived && group.phrases.some((phrase) => phrase.phrase === 'respond to')))
  assert.ok(groupsOf('decision').some((group) => group.form.word === 'decide' && group.phrases.some((phrase) => phrase.phrase === 'decide to')))
  // 項目が多い形（being に対する be、maker に対する make）は畳んで出す。
  assert.ok(groupsOf('being').find((group) => group.form.word === 'be').collapsed)
  assert.ok(groupsOf('maker').find((group) => group.form.word === 'make').collapsed)
  // 意味がずれた形は出さない（クマの bear に be born、committee に be committed to を並べない）。
  assert.deepEqual(groupsOf('bear'), [])
  assert.deepEqual(groupsOf('committee'), [])
  // 同じ品詞の形（sensible と sensitive）は「ほかの品詞の形」ではないので出さない。
  assert.ok(!groupsOf('sensible').some((group) => group.form.word === 'sensitive'))
  let words = 0
  for (const word of ALL_WORDS) {
    const own = new Set(phrasesForWord(word).map((phrase) => phrase.id))
    const groups = formPhraseGroupsForWord(word)
    const forms = wordFormsFor(word)
    const seen = new Set()
    let reverse = false
    for (const group of groups) {
      const { form, phrases } = group
      assert.ok(forms.some((item) => item.word === form.word) && sharesFormPhrases(word, form), `${word.id}: ${form.word}`)
      assert.equal(group.derived, isDerivedForm(word, form), `${word.id}: ${form.word}`)
      // 作られた形を先に、元の語の側の形をあとに並べる。
      if (!group.derived) reverse = true
      else assert.ok(!reverse, `${word.id}: ${form.word} の並び`)
      assert.equal(group.collapsed, phrases.length > FORM_PHRASES_OPEN_LIMIT, `${word.id}: ${form.word} の畳み`)
      for (const phrase of phrases) {
        assert.ok(!own.has(phrase.id) && !seen.has(phrase.id), `${word.id}: ${phrase.phrase} を重ねて出している`)
        seen.add(phrase.id)
      }
    }
    // 出すと決めた形を含む熟語・構文は1件も落とさない
    for (const form of forms.filter((item) => sharesFormPhrases(word, item))) {
      const target = form.extra ? form.word : getWord(form.id)
      for (const phrase of phrasesForWord(target)) {
        assert.ok(own.has(phrase.id) || seen.has(phrase.id), `${word.id}: ${form.word} の ${phrase.phrase} が出ない`)
      }
    }
    if (groups.length) words++
  }
  assert.ok(words >= 700, `ほかの品詞の形の熟語・構文を持つ語が ${words}語しかない`)
})

test('単語から熟語・構文へのつながりは全件を1件ずつ読み、別の語の熟語は外すか正しい語へ移してある', () => {
  const gap = phraseLinksReviewGap()
  assert.deepEqual(gap.missing, [], 'まだ読んでいない語')
  assert.deepEqual(gap.staleReviewed, [], 'つながりのなくなった語')
  assert.deepEqual(gap.staleExcluded, [], 'つながりでなくなった外した行')
  assert.deepEqual(gap.noReason, [], '理由のない外した行')
  assert.deepEqual(gap.unmoved, [], '別の語へまだ移していないつながり')
  assert.equal(gap.reviewed, gap.words)
  // 変化形を作らない代名詞・前置詞・接続詞は、変化形に見える語を拾わない（I の is、she の shed）。
  assert.ok(!phraseNames('i').some((phrase) => /\bis\b/.test(phrase)))
  assert.ok(!phraseNames('she').some((phrase) => /\bshed\b/.test(phrase)))
  // つづりがたまたま同じ別の語の熟語は外す（be の go to bed、mean の by means of）。
  assert.ok(!phraseNames('be').includes('go to bed'))
  assert.ok(!phraseNames('mean').includes('by means of'))
  // 同じつづりの別の語の熟語は、その語の見出し語へ移す（クマの bear に bear with を出さない）。
  assert.ok(!phraseNames('bear').includes('bear with'))
  assert.ok(phraseNames('bear_2').includes('bear with'))
  assert.ok(phraseNames('like_2').includes('look like'))
  assert.ok(!phraseNames('like').includes('look like'))
  assert.ok(phraseNames('like').includes('would like to'))
})
