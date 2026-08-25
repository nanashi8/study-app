import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PHRASES } from '../src/data/phrases.js'
import {
  FEATURED_IDIOM_FORM_FAMILY_IDS,
  IDIOM_FORM_FAMILIES,
  IDIOM_FORM_FAMILY_SECTIONS,
  idiomBelongsToFormFamily,
  idiomFormFamiliesFor,
  idiomFormFamilyById,
  idiomFormFamilyFor,
  relatedIdiomForms,
} from '../src/data/idiom-form-families.js'
import { buildPhraseDeck, pickPhraseDistractors } from '../src/lib/session.js'

const idioms = PHRASES.filter((item) => item.kind === 'idiom')
const phrase = (head) => idioms.find((item) => item.phrase === head)
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const tokensFor = (item) => String(item?.phrase ?? '')
  .normalize('NFKC')
  .match(/[a-z]+(?:'[a-z]+)?/gi)
  ?.map((token) => token.toLowerCase()) ?? []

test('全1,754熟語を同形グループへ分類し、選択欄の7区分から全組を選べる', () => {
  assert.equal(idioms.length, 1754)
  assert.equal(IDIOM_FORM_FAMILIES.length, 136)
  assert.equal(IDIOM_FORM_FAMILY_SECTIONS.length, 7)

  assert.equal(
    new Set(IDIOM_FORM_FAMILIES.map((family) => family.title)).size,
    IDIOM_FORM_FAMILIES.length,
  )
  assert.equal(
    new Set(IDIOM_FORM_FAMILIES.map((family) => [...family.memberIds].sort().join('|'))).size,
    IDIOM_FORM_FAMILIES.length,
  )

  const sectionFamilyIds = IDIOM_FORM_FAMILY_SECTIONS.flatMap((section) =>
    section.families.map((family) => family.id))
  assert.equal(new Set(sectionFamilyIds).size, IDIOM_FORM_FAMILIES.length)
  assert.deepEqual(
    new Set(sectionFamilyIds),
    new Set(IDIOM_FORM_FAMILIES.map((family) => family.id)),
  )

  for (const item of idioms) {
    const families = idiomFormFamiliesFor(item)
    assert.ok(families.length > 0, item.id)
    assert.equal(idiomFormFamilyFor(item)?.id, families[0].id, item.id)
    assert.ok(families.every((family) => family.memberIds.includes(item.id)), item.id)
    assert.ok(relatedIdiomForms(item).length > 0, item.id)
  }
})

test('〜 up・〜 at・〜 with・be 〜 at は全熟語から末尾の形を漏れなく抽出する', () => {
  const expected = [
    ['ending-up', '〜 up', 47, (tokens) => tokens.at(-1) === 'up'],
    ['ending-at', '〜 at', 13, (tokens) => tokens.at(-1) === 'at'],
    ['ending-with', '〜 with', 88, (tokens) => tokens.at(-1) === 'with'],
    ['be-prep-at', 'be 〜 at', 3, (tokens) => tokens[0] === 'be' && tokens.at(-1) === 'at'],
  ]
  assert.deepEqual(FEATURED_IDIOM_FORM_FAMILY_IDS, expected.map(([id]) => id))

  for (const [id, title, count, matches] of expected) {
    const family = idiomFormFamilyById(id)
    const expectedIds = new Set(idioms.filter((item) => matches(tokensFor(item))).map((item) => item.id))
    assert.equal(family.title, title)
    assert.equal(family.count, count)
    assert.deepEqual(new Set(family.memberIds), expectedIds)
    assert.deepEqual(
      new Set(buildPhraseDeck({ type: 'phraseList', ids: family.memberIds }, { size: 0 }).map((item) => item.id)),
      expectedIds,
    )
  }

  assert.ok(idiomBelongsToFormFamily(phrase('get up'), 'ending-up'))
  assert.ok(idiomBelongsToFormFamily(phrase('look at'), 'ending-at'))
  assert.ok(idiomBelongsToFormFamily(phrase('put up with'), 'ending-with'))
  assert.ok(idiomBelongsToFormFamily(phrase('be good at'), 'ending-at'))
  assert.ok(idiomBelongsToFormFamily(phrase('be good at'), 'be-prep-at'))
  assert.ok(!idiomBelongsToFormFamily(phrase("make up one's mind"), 'ending-up'))
})

test('同じ形を暗記・テストへ渡し、比較候補にも別の形を混ぜない', () => {
  const getUp = phrase('get up')
  const up = idiomFormFamilyById('ending-up')
  assert.equal(idiomFormFamilyFor(getUp).id, up.id)
  assert.ok(relatedIdiomForms(getUp, 12).every((item) => up.memberIds.includes(item.id)))
  assert.ok(pickPhraseDistractors(getUp, 3, () => 0.5).every((item) => up.memberIds.includes(item.id)))

  const list = read('../src/screens/Phrases.jsx')
  const guide = read('../src/components/IdiomFormGuide.jsx')
  const study = read('../src/screens/PhraseStudy.jsx')
  const quiz = read('../src/screens/PhraseQuiz.jsx')

  assert.match(list, /IDIOM_FORM_FAMILY_SECTIONS\.map/)
  assert.match(list, /idiomBelongsToFormFamily\(item, familyFilter\)/)
  assert.match(list, /data-idiom-featured-form=\{guide\.id\}/)
  assert.match(list, /「〜 up」「〜 at」「〜 with」「be 〜 at」/)
  assert.match(list, /idiomFormFamilyId: familyFilter/)
  assert.match(list, /params: \{ kind, levelFilter, familyFilter, query \}/)
  assert.match(guide, /idiomFormFamilyId: family\.id/)
  assert.match(guide, /この形を暗記/)
  assert.match(guide, /この形をテスト/)
  assert.match(study, /familyId=\{params\.idiomFormFamilyId\}/)
  assert.match(quiz, /familyId=\{params\.idiomFormFamilyId\}/)
})
