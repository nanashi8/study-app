import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { getWord, homographsFor } from '../src/data/vocab.js'
import { LOANWORD_HINTS } from '../src/data/loanword-hints.js'
import { WORD_IDIOM_EQUIVALENTS } from '../src/data/word-idiom-equivalents.js'
import {
  confusablesFor,
  loanwordHintFor,
  spellingDifference,
  wordRelationsFor,
} from '../src/lib/wordRelations.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('つづりの違いは、見ている語にない文字だけに印をつける', () => {
  assert.deepEqual(spellingDifference('accept', 'except'), [
    { text: 'ex', changed: true },
    { text: 'cept', changed: false },
  ])
  assert.deepEqual(spellingDifference('desert', 'dessert'), [
    { text: 'des', changed: false },
    { text: 's', changed: true },
    { text: 'ert', changed: false },
  ])
})

test('つづり注意の組はどちらの語からも引け、発音が同じ組には印がつく', () => {
  const principle = confusablesFor(getWord('principal')).find((item) => item.word.id === 'principle')
  assert.ok(principle)
  assert.equal(principle.sameSound, true)
  const except = getWord('except')
  const ids = confusablesFor(except).map((item) => item.word.id)
  assert.ok(ids.includes('accept'))
  assert.ok(ids.includes('expect'))
  assert.equal(confusablesFor(except).find((item) => item.word.id === 'accept').sameSound, false)
})

test('同じ意味の熟語に選んだ熟語は、意味が同じ・近い語の欄へ重ねて出さない', () => {
  let checked = 0
  for (const [wordId, phraseIds] of Object.entries(WORD_IDIOM_EQUIVALENTS)) {
    const relations = wordRelationsFor(getWord(wordId))
    assert.equal(relations.idioms.length, phraseIds.length, wordId)
    const idiomTexts = new Set(relations.idioms.map((phrase) => phrase.phrase.toLowerCase()))
    for (const synonym of relations.synonyms) {
      assert.equal(idiomTexts.has(synonym.w.toLowerCase()), false, `${wordId}: ${synonym.w}`)
    }
    checked += 1
  }
  assert.ok(checked > 300)
})

test('カタカナ語は、意味欄に同じ表記があり注意書きもない語では出さない', () => {
  const tension = loanwordHintFor(getWord('tension'))
  assert.equal(tension.kana, 'テンション')
  assert.match(tension.note, /excited/)
  for (const [wordId, hint] of Object.entries(LOANWORD_HINTS)) {
    const word = getWord(wordId)
    const inMeaning = word.meanings.some((meaning) => meaning.includes(hint.kana))
    assert.equal(Boolean(loanwordHintFor(word)), !inMeaning || Boolean(hint.note), wordId)
  }
})

test('日本語に定着したカタカナ語は、意味とのつながりや別の語との区別を添えて出す', () => {
  const snap = loanwordHintFor(getWord('snap'))
  assert.equal(snap.kana, 'スナップ')
  assert.match(snap.note, /snapshot/)
  assert.match(loanwordHintFor(getWord('tip')).note, /chip/)
  // 同じカタカナになる別の英単語は、どちらの語からも取り違えを示す。
  assert.match(loanwordHintFor(getWord('drag')).note, /drug/)
  assert.match(loanwordHintFor(getWord('drug')).note, /drag/)
  assert.equal(loanwordHintFor(getWord('strike')).kana, 'ストライク')
  // 同じつづりの別の語は代表義に混ぜず、独立した見出し語にして互いにリンクする。
  const bark = getWord('bark')
  assert.equal(bark.meanings.includes('樹皮'), false)
  assert.deepEqual(homographsFor(bark).map((word) => [word.id, word.meaning]), [['bark_2', '樹皮']])
  // 分けた語を部品にする派生語も合わせる（「光」の lighten と「軽い」の lighten）。
  const lighten = getWord('lighten')
  assert.equal(lighten.meanings.some((meaning) => meaning.includes('軽く')), false)
  assert.ok(getWord('lighten_2').meanings[0].startsWith('軽くする'))
  // カタカナ語は、そのカタカナが来ている方の語に付ける（紙をはさむクリップは「留める」の clip）。
  assert.match(loanwordHintFor(getWord('clip_2')).note, /紙をはさむクリップがこの clip/)
  assert.equal(LOANWORD_HINTS.bit, undefined)
})

test('関連語の欄と台帳は、同じつづりの別の語のうち意味の合う方へつなぐ', () => {
  // つづりで引くと元の語へ飛んでしまう項目は、別の語の id を持つ。
  assert.equal(getWord('heavy').antonyms.find((item) => item.w === 'light')?.id, 'light_2')
  assert.equal(wordRelationsFor(getWord('pillar')).synonyms.find((item) => item.w === 'post')?.id, 'post_2')
  // 元の語を指す項目は id を持たず、つづりのまま元の語へ飛ぶ。
  assert.equal(getWord('dark').antonyms.find((item) => item.w === 'light')?.id, undefined)
  // 「世話をする」の attend to は、別の語の tend（世話をする）の同じ意味の熟語。
  assert.deepEqual(wordRelationsFor(getWord('tend_2')).idioms.map((phrase) => phrase.phrase), ['attend to'])
  assert.equal(wordRelationsFor(getWord('tend')).idioms.some((phrase) => phrase.phrase === 'attend to'), false)
  // lay と取り違えるのは、過去形が lay になる「横たわる」の lie。
  assert.ok(confusablesFor(getWord('lie_2')).some((item) => item.word.id === 'lay'))
  assert.equal(confusablesFor(getWord('lie')).some((item) => item.word.id === 'lay'), false)
})

test('自作単語には辞書の台帳を当てない', () => {
  const custom = { id: 'tension', word: 'tension', custom: true, meanings: ['緊張'], synonyms: [] }
  assert.deepEqual(wordRelationsFor(custom), { forms: [], sameForms: [], formOwnNote: '', derivatives: [], synonyms: [], antonyms: [], idioms: [], confusables: [], usagePartners: [], loanword: null })
})

test('単語カードの裏と辞書ページは同じ部品で関連語を出す', () => {
  const study = read('src/screens/VocabStudy.jsx')
  const detail = read('src/screens/WordDetail.jsx')
  for (const source of [study, detail]) {
    for (const part of ['wordRelationsFor', 'LoanwordHint', 'SynonymSection', 'IdiomEquivalentSection', 'ConfusableSection']) {
      assert.match(source, new RegExp(part))
    }
  }
  // カードの裏から語へ移るときは、途中のカードを保存してから辞書ページへ行く。
  assert.match(study, /const openRelatedWord = \(id\) => saveBeforeReference\('wordDetail', \{ id \}\)/)
  const component = read('src/components/WordRelations.jsx')
  for (const marker of ['data-word-synonyms', 'data-word-idiom-equivalents', 'data-word-confusables', 'data-word-loanword']) {
    assert.match(component, new RegExp(marker))
  }
})
