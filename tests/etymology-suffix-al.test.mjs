// 接尾辞カード「-al」を、形容詞をつくる -al（sf-al）と動詞＋-al「〜すること」の名詞（sf-al-n）に分けた確認
// （requests/2026-10-14-content-observations-fix.json）。arrival・refusal など名詞をつくる -al の語が、
// 「〜の・〜に関する」のカードに並ぶと、個別の語源メモ（-al「〜すること」）と食い違う。
import assert from 'node:assert/strict'
import test from 'node:test'

import { SUFFIX_ROOTS, SUFFIX_ROOT_WORDS, SUFFIX_VARIANTS } from '../src/data/etymology-suffix-roots.js'
import { ETYMOLOGY_PACKS, ETYMOLOGY_WORD_STORIES, getRoot } from '../src/data/vocab.js'

const ADJECTIVE_AL = 'sf-al'
const NOUN_AL = 'sf-al-n'
const story = new Map(ETYMOLOGY_WORD_STORIES.map((entry) => [entry.head, entry.note]))

// 動詞に -al を付けて「〜すること」の名詞にした語。語源メモは「X ＋ -al」と、元の動詞を書く。
const NOUN_FORMING = [
  'acquittal', 'approval', 'arrival', 'betrayal', 'denial', 'dismissal', 'disposal', 'rebuttal', 'refusal',
  'removal', 'rental', 'reversal', 'revival', 'survival', 'trial', 'upheaval', 'withdrawal',
]

test('語根カード -al は、形容詞の -al と名詞の -al の2枚で、どの語もちょうど1枚に載る', () => {
  const adjective = new Set(SUFFIX_ROOT_WORDS[ADJECTIVE_AL])
  const noun = new Set(SUFFIX_ROOT_WORDS[NOUN_AL])
  assert.equal(adjective.size, SUFFIX_ROOT_WORDS[ADJECTIVE_AL].length, '形容詞の -al に重複がある')
  assert.equal(noun.size, SUFFIX_ROOT_WORDS[NOUN_AL].length, '名詞の -al に重複がある')
  assert.deepEqual([...adjective].filter((head) => noun.has(head)), [], '2枚に載った語')
  assert.equal(adjective.size + noun.size, 150, '分ける前の -al の語数')
  assert.deepEqual([...noun].sort(), [...NOUN_FORMING].sort())
  assert.deepEqual(SUFFIX_VARIANTS[NOUN_AL], SUFFIX_VARIANTS[ADJECTIVE_AL])
  for (const head of [...adjective, ...noun]) assert.ok(head.endsWith('al'), `${head} は al で終わらない`)
})

test('カードの見出し・意味・由来が、載せた語と食い違わない', () => {
  assert.equal(SUFFIX_ROOTS.find((root) => root.id === ADJECTIVE_AL).meaning, '〜の・〜に関する')
  const noun = SUFFIX_ROOTS.find((root) => root.id === NOUN_AL)
  assert.equal(noun.form, '-al（名詞）')
  assert.equal(noun.meaning, '〜すること')
  assert.match(noun.origin, /-ālia/)
  assert.equal(getRoot(NOUN_AL)?.meaning, '〜すること')
  // 公開カードとして両方が出る。
  for (const id of [ADJECTIVE_AL, NOUN_AL]) assert.ok(ETYMOLOGY_PACKS.some((card) => card.id === `root:${id}`), id)
  const nounCard = ETYMOLOGY_PACKS.find((card) => card.id === `root:${NOUN_AL}`)
  assert.equal(nounCard.coverageIds.length, NOUN_FORMING.length)
})

test('語源メモが「-al「〜すること」」と書いた語は名詞の -al のカードにあり、形容詞の -al のカードにない', () => {
  const problems = []
  for (const head of SUFFIX_ROOT_WORDS[ADJECTIVE_AL]) {
    const note = story.get(head) ?? ''
    if (/-al「(〜すること|こと)」/.test(note)) problems.push(`${head}: 〜すること の -al なのに形容詞の -al のカードにある`)
    if (NOUN_FORMING.includes(head)) problems.push(`${head}: 名詞の -al なのに形容詞の -al のカードにある`)
  }
  for (const head of SUFFIX_ROOT_WORDS[NOUN_AL]) {
    const note = story.get(head) ?? ''
    // 元の動詞に -al を付けた語（arrive ＋ -al、survive ＋ -al、up ＋ heave）。形容詞の「〜の・〜に関する」とは書かない。
    if (/-al「〜の・〜に関する」/.test(note)) problems.push(`${head}: 語源メモは形容詞の -al と書いている`)
  }
  assert.deepEqual(problems, [])
})
