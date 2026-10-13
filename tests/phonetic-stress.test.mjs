// 発音記号の強勢の書き方（requests/2026-10-14-content-observations-fix.json）。
//
//   1) 1つの語の発音記号には主強勢（ˈ）を1つだけ置く。CMU 辞書は複合語・-teen・-ation の語に主強勢を2つ以上付けるので、
//      scripts/arpa-ipa.mjs が1つだけ残す（thirteen /ˌθɝˈtin/・widespread /ˈwaɪdˌspɹɛd/）。
//   2) s と f が語幹の境目をまたぐ語（satisfy・transfer・disfavor）は、強勢記号を s の後ろ・f の前に置く。
//      sphere 系だけは s+f を語頭の連続子音として強勢記号を s の前に置く。
import assert from 'node:assert/strict'
import test from 'node:test'
import { dictionary } from 'cmu-pronouncing-dictionary'

import { arpaToIPA } from '../scripts/arpa-ipa.mjs'
import { PHONETICS } from '../src/data/phonetics.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import { PHONETIC_OVERRIDES } from '../src/data/phonetic-overrides.js'
import { WORD_FORM_EXTRAS } from '../src/data/word-forms.js'
import { SPELLING_CONFUSABLE_EXTRAS } from '../src/data/spelling-confusables.js'

const primaries = (ipa) => (String(ipa).match(/ˈ/g) ?? []).length
const firstArpa = (entry) => (typeof entry === 'string' ? entry : entry[0])

test('発音辞書の全語（CMU）で、変換した発音記号の主強勢は1つ以下になる', () => {
  const entries = Object.entries(dictionary)
  assert.ok(entries.length > 100_000, `CMU の語数 ${entries.length}`)
  const bad = []
  for (const [word, entry] of entries) {
    const ipa = arpaToIPA(firstArpa(entry))
    if (primaries(ipa) > 1) bad.push(`${word} ${ipa}`)
  }
  assert.deepEqual(bad.slice(0, 20), [], `主強勢が2つ以上の語 ${bad.length}件`)
})

test('全見出し語・ほかの品詞の形・つづり注意の語の発音記号に、主強勢が2つ以上ある語がない', () => {
  const bad = []
  for (const word of ALL_WORDS) {
    for (const token of String(word.phonetic ?? '').split(/\s+/)) {
      if (primaries(token) > 1) bad.push(`${word.id} ${word.phonetic}`)
    }
  }
  for (const [word, ipa] of Object.entries(PHONETICS)) if (primaries(ipa) > 1) bad.push(`PHONETICS ${word} ${ipa}`)
  for (const [id, ipa] of Object.entries(PHONETIC_OVERRIDES)) if (primaries(ipa) > 1) bad.push(`override ${id} ${ipa}`)
  for (const [, word, , , phonetic] of WORD_FORM_EXTRAS) if (primaries(phonetic) > 1) bad.push(`form ${word} ${phonetic}`)
  for (const [, word, , phonetic] of SPELLING_CONFUSABLE_EXTRAS) if (primaries(phonetic) > 1) bad.push(`confusable ${word} ${phonetic}`)
  assert.deepEqual(bad, [])
})

test('主強勢を2つ付けていた語：辞書の書き方どおり、残す位置を決めて1つにする', () => {
  const expected = {
    // あとの音節が主強勢の語（-teen・-ation・-eer・副詞・前置詞・動詞）。最初は副強勢。
    thirteen: '/ˌθɝˈtin/',
    nineteen: '/ˌnaɪnˈtin/',
    thirteenth: '/ˌθɝˈtinθ/',
    engineer: '/ˌɛndʒəˈnɪɹ/',
    navigation: '/ˌnævəˈɡeɪʃən/',
    relocation: '/ˌɹiˌloʊˈkeɪʃən/',
    nearby: '/ˌnɪɹˈbaɪ/',
    overdo: '/ˌoʊvɚˈdu/',
    outside: '/ˌaʊtˈsaɪd/',
    downtown: '/ˌdaʊnˈtaʊn/',
    gdp: '/ˌɡiˌdiˈpi/',
    // 最初の要素が主強勢の複合名詞・形容詞。
    widespread: '/ˈwaɪdˌspɹɛd/',
    baseball: '/ˈbeɪsˌbɔl/',
    overseer: '/ˈoʊvɚˌsiɚ/',
    coworker: '/ˈkoʊˌwɝkɚ/',
    hitherto: '/ˈhɪˌðɝˌtu/',
  }
  for (const [word, ipa] of Object.entries(expected)) {
    assert.equal(arpaToIPA(dictionary[word]), ipa, word)
    assert.equal(PHONETICS[word], ipa, `${word} の見出し語の発音記号`)
  }
})

test('s と f が語幹の境目をまたぐ語は強勢記号を f の前に置き、sphere 系だけ語頭の連続子音 sf を残す', () => {
  const boundary = {
    satisfy: '/ˈsætəsˌfaɪ/',
    satisfied: '/ˈsætəsˌfaɪd/',
    satisfaction: '/ˌsætəsˈfækʃən/',
    satisfactory: '/ˌsætəsˈfæktɹi/',
    dissatisfied: '/dɪˈsætəsˌfaɪd/',
    dissatisfaction: '/ˌdɪsætɪsˈfækʃən/',
    disfavor: '/dɪsˈfeɪvɚ/',
    misfortune: '/mɪsˈfɔɹtʃən/',
    transfer: '/tɹænsˈfɝ/',
    transform: '/tɹænsˈfɔɹm/',
    henceforth: '/ˈhɛnsˌfɔɹθ/',
    ceasefire: '/ˈsisˌfaɪɚ/',
  }
  for (const [word, ipa] of Object.entries(boundary)) assert.equal(PHONETICS[word], ipa, word)
  const sphere = { sphere: '/ˈsfɪɹ/', atmosphere: '/ˈætməˌsfɪɹ/', hemisphere: '/ˈhɛmɪˌsfɪɹ/', biosphere: '/ˈbaɪoʊˌsfɪɹ/' }
  for (const [word, ipa] of Object.entries(sphere)) assert.equal(PHONETICS[word], ipa, word)

  // 全辞書で、強勢記号の直後が sf になるのは sphere 系（IH・EH＋R が続く）だけ。
  const bad = []
  for (const [word, entry] of Object.entries(dictionary)) {
    const arpa = firstArpa(entry)
    const ipa = arpaToIPA(arpa)
    if (/[ˈˌ]sf/.test(ipa) && !/\bS F (IH|EH)\d R\b/.test(arpa) && !/^\/[ˈˌ]sf/.test(ipa)) bad.push(`${word} ${ipa}`)
  }
  assert.deepEqual(bad.slice(0, 20), [], `語中で強勢記号の直後が sf になる語 ${bad.length}件`)
})

test('語頭の母音が強勢を持つ語は、語頭の子音がいくつ続いても強勢記号を語頭に置く（svelte /ˈsvɛlt/）', () => {
  assert.equal(arpaToIPA(dictionary.svelte), '/ˈsvɛlt/')
  const bad = []
  for (const [word, entry] of Object.entries(dictionary)) {
    const arpa = firstArpa(entry)
    const first = arpa.trim().split(/\s+/).find((token) => /\d$/.test(token))
    if (!first || !/[12]$/.test(first)) continue
    const ipa = arpaToIPA(arpa)
    if (!/^\/[ˈˌ]/.test(ipa)) bad.push(`${word} ${ipa}`)
  }
  assert.deepEqual(bad.slice(0, 20), [], `強勢記号が語頭にない語 ${bad.length}件`)
})
