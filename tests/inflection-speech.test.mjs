// 変化形の欄の全部の形が、発音ボタンか、（端末の声が読み違える形は）発音記号のどちらかで発音を確かめられるか。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { INFLECTION_PHONETICS } from '../src/data/inflection-phonetics.js'
import { parseInflection } from '../src/lib/wordInflections.js'
import { inflectionPhoneticFor } from '../src/lib/inflectionSpeech.js'
import { isAmbiguousSpeechText } from '../src/lib/speechGuard.js'

const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))

function allForms() {
  const forms = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    for (const [pos, value] of Object.entries(record)) {
      for (const row of parseInflection(pos, value, byId.get(id).word).rows) {
        for (const form of row.forms) forms.push({ id, label: row.label, text: form.text })
      }
    }
  }
  return forms
}

test('全部の形が、発音ボタンか発音記号のどちらかで発音を確かめられる', () => {
  const forms = allForms()
  assert.ok(forms.length >= 16823, `形の数 ${forms.length}`)
  const missing = []
  let spoken = 0
  let shown = 0
  for (const form of forms) {
    if (!isAmbiguousSpeechText(form.text)) {
      spoken += 1
      continue
    }
    if (inflectionPhoneticFor(form.id, form.label, form.text)) shown += 1
    else missing.push(`${form.id}|${form.label}: ${form.text}`)
  }
  assert.deepEqual(missing, [], '音声も発音記号もない形')
  assert.equal(spoken + shown, forms.length)
  // 発音記号の台帳に、もう音声を出せる形・台帳にない形の行が残っていない。
  const used = new Set(forms.filter((form) => isAmbiguousSpeechText(form.text)).map((form) => `${form.id}|${form.label}`))
  assert.deepEqual(Object.keys(INFLECTION_PHONETICS).filter((key) => !used.has(key)), [], '使われない発音記号')
  for (const value of Object.values(INFLECTION_PHONETICS)) assert.match(value, /^\/[^/]+\/$/)
})

test('使い方で発音が変わる形は、その使い方の発音記号になっている', () => {
  assert.equal(INFLECTION_PHONETICS['read|過去形'], '/ˈɹɛd/')
  assert.equal(INFLECTION_PHONETICS['read|3単現'], '/ˈɹidz/')
  assert.equal(INFLECTION_PHONETICS['record|複数形'], '/ˈɹɛkɚdz/')
  assert.equal(INFLECTION_PHONETICS['record|3単現'], '/ɹəˈkɔɹdz/')
  assert.equal(INFLECTION_PHONETICS['life|複数形'], '/ˈlaɪvz/')
  assert.equal(INFLECTION_PHONETICS['wind_2|過去形'], '/ˈwaʊnd/')
  assert.equal(INFLECTION_PHONETICS['tear_2|複数形'], '/ˈtɪɹz/')
})

test('変化形の欄は形ごとに発音ボタンを置き、読めない形は発音記号と注釈を出す', () => {
  const source = readFileSync(new URL('../src/components/WordInflections.jsx', import.meta.url), 'utf8')
  assert.match(source, /<SpeakButton text=\{form\.text\}/)
  assert.match(source, /data-inflection-phonetic/)
  assert.match(source, /data-inflection-silent-note/)
})
