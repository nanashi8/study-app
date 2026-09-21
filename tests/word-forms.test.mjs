import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { WORD_FORM_GROUPS, WORD_FORM_REJECTED } from '../src/data/word-forms.js'
import { antonymWordsFor, wordFormsFor, wordRelationsFor } from '../src/lib/wordRelations.js'
import { wordFormCandidatePairs } from '../scripts/word-form-candidates.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const formsOf = (id) => wordFormsFor(getWord(id)).map((word) => `${word.word}:${word.pos}`)

test('ほかの品詞の形は、見ている語とちがう品詞だけを動詞・名詞・形容詞・副詞の順に並べる', () => {
  assert.deepEqual(formsOf('decide'), ['decision:名', 'decisive:形', 'decisively:副'])
  assert.deepEqual(formsOf('decision'), ['decide:動', 'decisive:形', 'decisively:副'])
  assert.deepEqual(formsOf('happy'), ['happiness:名', 'happily:副'])
  // 意味の筋が分かれる語は、見ている語の筋の形だけを出す（success に successive「連続する」は出さない）。
  assert.deepEqual(formsOf('success'), ['succeed:動', 'successful:形'])
  // 意味が離れた語・つづりが似ているだけの語は出さない。
  assert.equal(formsOf('consider').includes('considerable:形'), false)
  assert.equal(formsOf('flow').some((form) => form.startsWith('flower')), false)
  assert.deepEqual(wordRelationsFor(getWord('decide')).forms.map((word) => word.id), ['decision', 'decisive', 'decisively'])
})

test('台帳のまとまりは辞書にある語だけで、どれも2つ以上の品詞にまたがる', () => {
  const seen = new Set()
  for (const group of WORD_FORM_GROUPS) {
    const key = group.join('|')
    assert.equal(seen.has(key), false, `重複: ${key}`)
    seen.add(key)
    for (const id of group) assert.ok(getWord(id), `辞書にない語: ${id}`)
    assert.ok(new Set(group.map((id) => getWord(id).pos)).size >= 2, `品詞が1つだけ: ${key}`)
  }
})

test('規則が拾った候補は、同じまとまりに並べるか WORD_FORM_REJECTED に外すかを人が決めてある', () => {
  const together = new Set()
  for (const group of WORD_FORM_GROUPS) {
    for (const a of group) for (const b of group) if (a < b) together.add(`${a}|${b}`)
  }
  const rejected = new Set(WORD_FORM_REJECTED)
  const candidates = wordFormCandidatePairs(ALL_WORDS).map(([a, b]) => `${a}|${b}`)
  const unreviewed = candidates.filter((pair) => !together.has(pair) && !rejected.has(pair))
  assert.deepEqual(unreviewed, [], '候補の組 → word-forms.js の WORD_FORM_GROUPS か WORD_FORM_REJECTED に置く')
  // 外した組が候補でなくなったら（見出し語の削除・品詞の変更）、台帳からも消す。
  const candidateSet = new Set(candidates)
  assert.deepEqual(WORD_FORM_REJECTED.filter((pair) => !candidateSet.has(pair)), [])
  for (const pair of WORD_FORM_REJECTED) assert.equal(together.has(pair), false, `外した組が同じまとまりにある: ${pair}`)
})

test('意味が反対の語は、同じつづりを重ねずに返す', () => {
  const items = antonymWordsFor(getWord('happy'))
  assert.deepEqual(items.map((item) => item.w), ['sad', 'unhappy'])
  assert.deepEqual(wordRelationsFor(getWord('happy')).antonyms, items)
})

test('ほかの品詞の形・意味が同じ・近い語・意味が反対の語は、1語ずつ発音を再生できる', () => {
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /export function RelatedWordList/)
  assert.match(component, /<SpeakButton text=\{row\.text\}/)
  assert.match(component, /isAmbiguousSpeechText\(row\.text\)/)
  assert.match(component, /data-speech-group/)
  for (const name of ['WordFormSection', 'SynonymSection', 'AntonymSection']) {
    assert.match(component, new RegExp(`export function ${name}[\\s\\S]*?<RelatedWordList`), name)
  }
  // 暗記カードの裏と辞書ページの両方に出す。
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    const source = read(screen)
    for (const name of ['WordFormSection', 'SynonymSection', 'AntonymSection']) {
      assert.match(source, new RegExp(`<${name} items=\\{relations\\.`), `${screen}: ${name}`)
    }
  }
})
