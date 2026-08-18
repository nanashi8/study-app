// 単語カードに出す「その語を含む熟語・構文」の回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import {
  inflectedForms,
  phraseGroupsForWord,
  phraseTokens,
  phrasesForWord,
} from '../src/lib/wordPhrases.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const wordNamed = (name) => ALL_WORDS.find((word) => word.word === name)

test('その語を含む熟語をすべて集める', () => {
  const heads = phrasesForWord(wordNamed('go')).map((phrase) => phrase.phrase)
  for (const expected of ['go abroad', 'go ahead', 'go on', 'go to bed', 'go out']) {
    assert.ok(heads.includes(expected), `go の熟語に ${expected} が無い`)
  }
  // 見出しの一部として含む語だけを拾う（goal は go を含む熟語ではない）
  assert.ok(!heads.includes('reach a goal'))

  const take = phrasesForWord(wordNamed('take'))
  assert.ok(take.length >= 20, `take の熟語が${take.length}件しかない`)
})

test('やさしい級から順に並ぶ', () => {
  const rank = { 5: 0, 4: 1, 3: 2, pre2: 3, 2: 4, pre1: 5, 1: 6 }
  for (const name of ['go', 'take', 'look', 'get']) {
    const levels = phrasesForWord(wordNamed(name)).map((phrase) => rank[phrase.level] ?? 99)
    assert.deepEqual(levels, [...levels].sort((a, b) => a - b), `${name} の並びが級順でない`)
  }
})

test('語形が変わって使われる語も拾う', () => {
  assert.ok(inflectedForms('compose').includes('composed'))
  assert.ok(inflectedForms('carry').includes('carries'))
  assert.ok(inflectedForms('stop').includes('stopping'))
  assert.equal(inflectedForms('2語 の語').length, 0)

  const compose = phrasesForWord(wordNamed('compose')).map((phrase) => phrase.phrase)
  assert.ok(compose.includes('be composed of'), '語形変化した熟語を拾えていない')
})

test('文法から作った例文カードは熟語として出さない', () => {
  const sentences = PHRASES.filter((phrase) => phrase.category === 'grammar-example')
  assert.ok(sentences.length > 0, '前提となる例文カードが無い')
  const sentenceIds = new Set(sentences.map((phrase) => phrase.id))
  for (const name of ['still', 'go', 'take', 'the']) {
    const word = wordNamed(name)
    if (!word) continue
    for (const phrase of phrasesForWord(word)) {
      assert.ok(!sentenceIds.has(phrase.id), `${name}: 例文カードが混ざっている`)
      assert.ok(!/[.?!]$/.test(phrase.phrase), `${name}: 文がそのまま並んでいる`)
    }
  }
})

test('熟語と構文に分けて数えられる', () => {
  const groups = phraseGroupsForWord(wordNamed('go'))
  assert.equal(groups.all.length, groups.idioms.length + groups.syntax.length)
  assert.ok(groups.idioms.every((phrase) => phrase.kind === 'idiom'))
  assert.ok(phraseTokens('go ~ to ...').includes('go'))
})

test('単語カードは、その語を含む熟語を省略せず全部並べる', () => {
  const source = read('src/screens/VocabStudy.jsx')
  assert.match(source, /phraseGroupsForWord/)
  assert.match(source, /data-word-phrases/)
  assert.match(source, /を含む熟語・構文/)
  assert.match(source, /relatedPhrases\.all\.map/, '一部だけを表示している')
  assert.doesNotMatch(source, /relatedPhrases\.all\.slice/, '熟語を途中で切っている')
})

test('冠詞は熟語の見出し語として扱わない', () => {
  // take a bath を「a の熟語」として並べても覚える助けにならない
  for (const article of ['a', 'an', 'the']) {
    assert.deepEqual(phrasesForWord(article), [], `${article} が熟語一覧を持っている`)
  }
  // 前置詞・副詞は熟語の意味そのものなので残す
  assert.ok(phrasesForWord('at').length > 0)
  assert.ok(phrasesForWord('out').length > 0)
})

test('熟語のある語がまとまった数ある', () => {
  const covered = ALL_WORDS.filter((word) => phrasesForWord(word).length > 0)
  assert.ok(covered.length >= 700, `熟語が付く語が${covered.length}語しかない`)
})
