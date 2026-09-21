// 単語から熟語・構文へのつながり（辞書ページの欄・不規則な形・ほかの品詞の形）の回帰テスト。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { IRREGULAR_PHRASE_LINKS, IRREGULAR_WORD_FORMS } from '../src/data/phrase-irregular-links.js'
import {
  formPhraseGroupsForWord,
  irregularPhraseCandidates,
  phraseGroupsForWord,
  phrasesForWord,
  sharesFormPhrases,
} from '../src/lib/wordPhrases.js'
import { wordFormsFor } from '../src/lib/wordRelations.js'

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

test('ほかの品詞の形を使う熟語・構文を、元の語のカードと辞書ページから引ける', () => {
  const decision = phraseGroupsForWord(getWord('decide')).viaForms.find((group) => group.form.word === 'decision')
  assert.ok(decision.phrases.some((phrase) => phrase.phrase === 'make a decision'))
  // 作られた形の熟語だけを元の語に出す。being（存在）や maker のカードに be・make の熟語を並べない。
  assert.deepEqual(formPhraseGroupsForWord(getWord('being')), [])
  assert.deepEqual(formPhraseGroupsForWord(getWord('maker')), [])
  // 意味がずれた形は出さない（クマの bear に be born、committee に be committed to を並べない）。
  assert.deepEqual(formPhraseGroupsForWord(getWord('bear')), [])
  assert.deepEqual(formPhraseGroupsForWord(getWord('committee')), [])
  // 同じ品詞の形（sensible と sensitive）は「ほかの品詞の形」ではないので出さない。
  assert.ok(!formPhraseGroupsForWord(getWord('sensible')).some((group) => group.form.word === 'sensitive'))
  let words = 0
  for (const word of ALL_WORDS) {
    const own = new Set(phrasesForWord(word).map((phrase) => phrase.id))
    const groups = formPhraseGroupsForWord(word)
    const forms = wordFormsFor(word)
    const seen = new Set()
    for (const { form, phrases } of groups) {
      assert.ok(forms.some((item) => item.word === form.word) && sharesFormPhrases(word, form), `${word.id}: ${form.word}`)
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
  assert.ok(words >= 100, `ほかの品詞の形の熟語・構文を持つ語が ${words}語しかない`)
})
