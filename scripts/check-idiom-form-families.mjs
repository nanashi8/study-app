#!/usr/bin/env node
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

const errors = []
const idioms = PHRASES.filter((item) => item.kind === 'idiom')
const idiomsById = new Map(idioms.map((item) => [item.id, item]))

const tokensFor = (item) => String(item?.phrase ?? '')
  .normalize('NFKC')
  .replace(/[‘’]/g, "'")
  .match(/[a-z]+(?:'[a-z]+)?/gi)
  ?.map((token) => token.toLowerCase()) ?? []

const sameSet = (actual, expected) => (
  actual.size === expected.size && [...actual].every((id) => expected.has(id))
)

const familyIds = new Set()
const familyTitles = new Set()
const familyMemberSets = new Map()
for (const family of IDIOM_FORM_FAMILIES) {
  if (familyIds.has(family.id)) errors.push(`同形グループIDが重複: ${family.id}`)
  familyIds.add(family.id)
  if (familyTitles.has(family.title)) errors.push(`選択欄の表示名が重複: ${family.title}`)
  familyTitles.add(family.title)
  const memberIds = new Set(family.memberIds)
  const memberSetKey = [...memberIds].sort().join('|')
  if (familyMemberSets.has(memberSetKey)) {
    errors.push(`同じ熟語だけを含むグループが重複: ${familyMemberSets.get(memberSetKey)} / ${family.id}`)
  }
  familyMemberSets.set(memberSetKey, family.id)
  if (family.count !== family.memberIds.length || memberIds.size !== family.memberIds.length) {
    errors.push(`${family.id}: 件数または熟語IDが重複 (${family.count}/${family.memberIds.length}/${memberIds.size})`)
  }
  if (family.memberIds.length < 2) errors.push(`${family.id}: 比較相手が2件未満`)
  for (const id of family.memberIds) {
    if (!idiomsById.has(id)) errors.push(`${family.id}: 熟語でないIDを含む (${id})`)
  }
}

const sectionFamilyIds = IDIOM_FORM_FAMILY_SECTIONS.flatMap((section) =>
  section.families.map((family) => family.id))
if (
  new Set(sectionFamilyIds).size !== sectionFamilyIds.length ||
  !sameSet(new Set(sectionFamilyIds), familyIds)
) {
  errors.push(`選択欄の区分と同形グループが不一致 (${sectionFamilyIds.length}/${familyIds.size})`)
}

let classified = 0
let related = 0
for (const item of idioms) {
  const families = idiomFormFamiliesFor(item)
  const primary = idiomFormFamilyFor(item)
  if (families.length > 0) classified += 1
  else errors.push(`${item.id}: 同じ形・使い方のグループがない`)
  if (!primary || primary.id !== families[0]?.id || !primary.memberIds.includes(item.id)) {
    errors.push(`${item.id}: カードに表示する同形グループが不正`)
  }
  if (relatedIdiomForms(item).length > 0) related += 1
  else errors.push(`${item.id}: 比較できる別の熟語がない`)
}

const requestedFamilies = [
  {
    id: 'ending-up',
    title: '〜 up',
    matches: (tokens) => tokens.at(-1) === 'up',
    examples: ['get up', 'give up', 'grow up'],
  },
  {
    id: 'ending-at',
    title: '〜 at',
    matches: (tokens) => tokens.at(-1) === 'at',
    examples: ['look at', 'arrive at', 'laugh at'],
  },
  {
    id: 'ending-with',
    title: '〜 with',
    matches: (tokens) => tokens.at(-1) === 'with',
    examples: ['deal with', 'come up with', 'put up with'],
  },
  {
    id: 'be-prep-at',
    title: 'be 〜 at',
    matches: (tokens) => tokens[0] === 'be' && tokens.at(-1) === 'at',
    examples: ['be good at', 'be surprised at', 'be amazed at'],
  },
]

for (const expected of requestedFamilies) {
  const family = idiomFormFamilyById(expected.id)
  const expectedIds = new Set(
    idioms.filter((item) => expected.matches(tokensFor(item))).map((item) => item.id),
  )
  if (!family) {
    errors.push(`${expected.title}: グループがない`)
    continue
  }
  if (family.title !== expected.title) errors.push(`${expected.id}: 表示名が不正 (${family.title})`)
  if (!sameSet(new Set(family.memberIds), expectedIds)) {
    errors.push(`${expected.title}: 全熟語の抽出結果と不一致 (${family.memberIds.length}/${expectedIds.size})`)
  }
  for (const phrase of expected.examples) {
    const item = idioms.find((candidate) => candidate.phrase === phrase)
    if (!item || !idiomBelongsToFormFamily(item, expected.id)) {
      errors.push(`${expected.title}: 代表例を含まない (${phrase})`)
    }
  }
}

if (
  FEATURED_IDIOM_FORM_FAMILY_IDS.length !== requestedFamilies.length ||
  !sameSet(
    new Set(FEATURED_IDIOM_FORM_FAMILY_IDS),
    new Set(requestedFamilies.map((family) => family.id)),
  )
) {
  errors.push('一覧の「よく使う形」が要望の4グループと一致しない')
}

const beGoodAt = idioms.find((item) => item.phrase === 'be good at')
if (
  !beGoodAt ||
  !idiomBelongsToFormFamily(beGoodAt, 'ending-at') ||
  !idiomBelongsToFormFamily(beGoodAt, 'be-prep-at')
) {
  errors.push('be good at を「〜 at」と「be 〜 at」の両方から学べない')
}

for (const { id } of requestedFamilies) {
  const family = idiomFormFamilyById(id)
  const first = family?.memberIds.map((itemId) => idiomsById.get(itemId)).find(Boolean)
  if (!family || !first) continue
  const relatedInFamily = relatedIdiomForms(first, 12, id)
  if (relatedInFamily.some((item) => !family.memberIds.includes(item.id))) {
    errors.push(`${id}: 比較欄に別の形の熟語が混ざる`)
  }
}

if (errors.length) {
  console.error(`❌ 熟語同形グループ監査 失敗（${errors.length}件）`)
  errors.slice(0, 40).forEach((error) => console.error(`  - ${error}`))
  if (errors.length > 40) console.error(`  … 他 ${errors.length - 40}件`)
  process.exit(1)
}

const requestedSummary = requestedFamilies
  .map(({ id, title }) => `${title} ${idiomFormFamilyById(id).count}件`)
  .join(' / ')
console.log(
  `✅ 熟語同形グループ監査OK: 全${classified}/${idioms.length}熟語を${IDIOM_FORM_FAMILIES.length}組へ分類・` +
  `比較相手あり${related}/${idioms.length}熟語 / ${requestedSummary}`,
)
