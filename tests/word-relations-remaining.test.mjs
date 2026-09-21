// 関連語・熟語の依頼で残っていたこと（requests/2026-09-21-relations-remaining.json）の回帰テスト。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { posSensesFor, wordFormsFor, wordRelationsFor } from '../src/lib/wordRelations.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('類義語・反対語の欄に、品詞がちがうだけの同じ語の形を出さない', () => {
  // metallic の metal、woolen の wool、posture の pose は、ほかの品詞の形の欄だけに出す。
  for (const [id, form] of [['metallic', 'metal'], ['woolen', 'wool'], ['posture', 'pose']]) {
    const relations = wordRelationsFor(getWord(id))
    assert.ok(relations.forms.some((item) => item.word === form), `${id}: ${form} がほかの品詞の形にない`)
    assert.ok(!relations.synonyms.some((item) => item.w === form), `${id}: ${form} が類義語に出る`)
  }
  for (const word of ALL_WORDS) {
    const relations = wordRelationsFor(word)
    const otherPos = new Set(relations.forms.filter((item) => item.pos !== word.pos).map((item) => item.word.toLowerCase()))
    for (const item of [...relations.synonyms, ...relations.antonyms]) {
      assert.ok(!otherPos.has(String(item.w).toLowerCase()), `${word.id}: ${item.w}`)
    }
  }
})

test('辞書ページの派生語欄は、形の欄に出す語を重ねない', () => {
  const withDerivatives = ALL_WORDS.filter((word) => word.derivatives?.length)
  assert.equal(withDerivatives.length, 15)
  for (const word of withDerivatives) {
    const relations = wordRelationsFor(word)
    const shown = new Set(relations.forms.map((item) => item.word.toLowerCase()))
    for (const item of relations.derivatives) assert.ok(!shown.has(String(item.w).toLowerCase()), `${word.id}: ${item.w}`)
  }
  // popular の popularity は、ほかの品詞の形の欄にだけ出す。
  assert.deepEqual(wordRelationsFor(getWord('popular')).derivatives, [])
  const detail = read('src/screens/WordDetail.jsx')
  assert.match(detail, /const derivatives = relations\.derivatives/)
  assert.doesNotMatch(detail, /items=\{word\.derivatives\}/)
})

test('熟語・構文の欄と同じ意味の熟語の欄は、全行に発音ボタンをつける', () => {
  const component = read('src/components/WordRelations.jsx')
  // 熟語は見出しを、構文は記号の入った見出しでなく例文を読む（phraseSpeechText）。
  const phraseRows = component.slice(component.indexOf('function PhraseList'), component.indexOf('function PhraseListHeading'))
  assert.match(phraseRows, /<RowSpeakButton text=\{phraseSpeechText\(phrase\)\}/)
  const idiomRows = component.slice(component.indexOf('export function IdiomEquivalentSection'), component.indexOf('function PhraseList'))
  assert.match(idiomRows, /<RowSpeakButton text=\{phraseSpeechText\(phrase\)\}/)
})

test('同じ品詞の派生語を、ほかの品詞の形と分けて暗記カードの裏と辞書ページに出す', () => {
  const decision = wordRelationsFor(getWord('decision'))
  assert.ok(decision.sameForms.some((item) => item.word === 'decisiveness'))
  assert.ok(!decision.forms.some((item) => item.word === 'decisiveness'))
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /同じ品詞の派生語/)
  assert.match(component, /data-word-same-forms/)
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(screen), /sameItems=\{relations\.sameForms\}/, screen)
  }
})

test('ほかの品詞でも使う語は、その品詞の意味で形として出す', () => {
  // 意味欄の印（force の「強制する(動)」）と word-senses.js（content の「満足して」）を読む。
  const force = wordFormsFor(getWord('enforcement')).find((item) => item.word === 'force')
  assert.deepEqual([force.pos, force.meaning], ['動', '強制する'])
  const content = wordFormsFor(getWord('contentment')).find((item) => item.word === 'content')
  assert.deepEqual([content.pos, content.meaning], ['形', '満足して'])
  assert.deepEqual(posSensesFor(getWord('promise')).map((sense) => sense.pos), ['名', '動'])
})
