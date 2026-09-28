#!/usr/bin/env node
// 形は似ているが元の語がちがう語（requests/2026-09-28-lookalike-different-words.json）を、形の似た組の全件で確かめる。
//
// 母集団: 全見出し語（自作の単語を除く。大文字・空白・記号を含む語も小文字にして比べる）から、次の3つの決まりで拾う語の組。
//  頭      … 頭のつづりが、接頭辞の形を除いて4文字以上同じ（contemporary と contempt、temper と temple）
//  接頭辞  … 接頭辞の形のあとに、4文字以上の別の見出し語がそのまま続く（contempt＝con＋tempt、recover＝re＋cover）
//  頭に入る … 4文字以上の見出し語が、別の見出し語の頭にそのまま入っている（adult と adultery、real と realm）
// ただし、同じつづりの見出し語どうし（post と post_2）、ほかの品詞の形のまとまり（word-forms.js）の組と、
// つづり注意の洗い出しの母集団（scripts/checks/confusables-survey.mjs。1組ずつ読み済み）の組は除く。
//
// 決め方: 元の語がちがう組は、src/data/lookalike-forms.js の形の似た語のまとまり（LOOKALIKE_FORMS）に2語とも入れ、
// まとまりの中で由来ごとに分ける。載せない組は docs/audits/lookalike-forms-survey.json の reviewed に
// 理由の略号を書く。見出し語を足すと新しい組が出るので、読むまでこの確認は通らない。
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_WORDS, ETYMOLOGY_PACKS, etymologyStoryForWord, getWord } from '../../src/data/vocab.js'
import { WORD_FORM_GROUPS } from '../../src/data/word-forms.js'
import { LOOKALIKE_KINDS } from '../../src/data/lookalike-origins.js'
import { LOOKALIKE_LINKS, LOOKALIKE_NOTES } from '../../src/data/lookalike-forms.js'
import { lookalikeForms, relationInForm } from '../../src/lib/lookalikeForms.js'
import { confusableSurveyPairs } from './confusables-survey.mjs'
import { lookalikeNoteProblems, lookalikeVerdicts } from './lookalike-origins.mjs'

export const LOOKALIKE_FORMS_SURVEY_PATH = new URL('../../docs/audits/lookalike-forms-survey.json', import.meta.url)

// 載せない理由の略号。
export const LOOKALIKE_FORM_SKIP_REASONS = {
  同源: '似ている部分が同じ語・同じ語根・同じ接頭辞から来ている（派生語・複合語をふくむ）ので、元の語がちがう別の語ではない',
  説明済: '語根カードの似た語の欄か、つづり注意の欄で、この2語のつながりをもう出している',
  固有: '一方が国・人・曜日などの名前（とその形容詞）で、形の似た語と取り違える場面がない',
  切り方: '接頭辞がはっきり分かる語の切れ目をまたいだ所（dis｜honest の頭の dish、un｜clear の頭の uncle）や、接頭辞でない所で切ったときだけ（search を se＋arch、inter｜mediate の中の term と読む）別の語が出てくる組で、形が似ているとは言えない',
}

// 接頭辞の形: 接頭辞のカード（pf-）の2文字以上の形と、カードのない、学習でよく出る接頭辞。
// 1文字の形（e- など）は、頭がたまたま同じ語まで接頭辞として外してしまうので使わない。
const EXTRA_PREFIX_FORMS = [
  'ab', 'abs', 'ag', 'al', 'an', 'ap', 'ar', 'as', 'co', 'em', 'ante', 'auto', 'be', 'bi', 'counter', 'fore',
  'mis', 'non', 'out', 'over', 'post', 'semi', 'sus', 'tele', 'un', 'under', 'up', 'with',
]
export const LOOKALIKE_PREFIX_FORMS = Object.freeze([...new Set([
  ...ETYMOLOGY_PACKS
    .filter((card) => card.rootId.startsWith('pf-'))
    .flatMap((card) => String(card.rootForm).split('/').map((form) => form.trim().replace(/-/g, '')))
    .filter((form) => form.length >= 2),
  ...EXTRA_PREFIX_FORMS,
])])

// 頭の同じ部分から、いちばん長い接頭辞の形（頭そのものより短いもの）を除いた長さ。
const stemLength = (head) => head.length - Math.max(0, ...LOOKALIKE_PREFIX_FORMS
  .filter((prefix) => head.startsWith(prefix) && prefix.length < head.length)
  .map((prefix) => prefix.length))

const commonHead = (a, b) => {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1
  return i
}

const pairKey = (a, b) => [String(a), String(b)].sort().join('|')

const FORM_GROUPS = new Map()
for (const group of WORD_FORM_GROUPS) {
  for (const id of group) {
    if (!FORM_GROUPS.has(id)) FORM_GROUPS.set(id, [])
    FORM_GROUPS.get(id).push(group)
  }
}
/** 2語が同じ語の形のまとまり（word-forms.js。tempt と temptation）に入っているか。 */
const sameFormGroup = (a, b) => (FORM_GROUPS.get(a) ?? []).some((group) => group.includes(b))

/** 母集団の組（"idA|idB" → 拾った決まりの配列）。 */
export function lookalikeFormPairs(words = ALL_WORDS) {
  const pool = words.filter((word) => word?.id && !word.custom)
  const spellingOf = new Map(pool.map((word) => [word.id, String(word.word).toLowerCase()]))
  const idsBySpelling = new Map()
  for (const word of pool) {
    const spelling = spellingOf.get(word.id)
    if (!idsBySpelling.has(spelling)) idsBySpelling.set(spelling, [])
    idsBySpelling.get(spelling).push(word.id)
  }
  const surveyed = confusableSurveyPairs()
  const pairs = new Map()
  const add = (a, b, why) => {
    if (a === b) return
    const [x, y] = [spellingOf.get(a), spellingOf.get(b)]
    if (x === y || sameFormGroup(a, b) || surveyed.has(pairKey(x, y))) return
    const key = pairKey(a, b)
    if (!pairs.has(key)) pairs.set(key, new Set())
    pairs.get(key).add(why)
  }
  // 頭: つづりの順に並べ、頭の同じ部分が4文字未満になったら先を見ない。
  const sorted = [...pool].sort((a, b) => (spellingOf.get(a.id) < spellingOf.get(b.id) ? -1 : spellingOf.get(a.id) > spellingOf.get(b.id) ? 1 : 0))
  for (let i = 0; i < sorted.length; i += 1) {
    const a = spellingOf.get(sorted[i].id)
    for (let j = i + 1; j < sorted.length; j += 1) {
      const b = spellingOf.get(sorted[j].id)
      const length = commonHead(a, b)
      if (length < 4) break
      if (stemLength(a.slice(0, length)) >= 4) add(sorted[i].id, sorted[j].id, '頭')
    }
  }
  for (const word of pool) {
    const spelling = spellingOf.get(word.id)
    // 接頭辞: 接頭辞の形のあとに、別の見出し語がそのまま続く。
    for (const prefix of LOOKALIKE_PREFIX_FORMS) {
      if (!spelling.startsWith(prefix)) continue
      const rest = spelling.slice(prefix.length)
      for (let k = 4; k <= rest.length; k += 1) {
        for (const other of idsBySpelling.get(rest.slice(0, k)) ?? []) add(word.id, other, '接頭辞')
      }
    }
    // 頭に入る: 4文字以上の見出し語が、この語の頭にそのまま入っている。
    for (let k = 4; k < spelling.length; k += 1) {
      for (const other of idsBySpelling.get(spelling.slice(0, k)) ?? []) add(word.id, other, '頭に入る')
    }
  }
  return new Map([...pairs].map(([key, whys]) => [key, [...whys]]))
}

// 形の似た語のまとまりの語が、似ている形で始まるか、接頭辞の形のすぐあとに形が続くか。
const showsForm = (spelling, form) =>
  spelling.startsWith(form) || LOOKALIKE_PREFIX_FORMS.some((prefix) => spelling.startsWith(prefix) && spelling.slice(prefix.length).startsWith(form))

/** 2語が同じ形の似た語のまとまりに入っているか。 */
const covered = (a, b) => lookalikeForms.some((entry) => entry.ids.includes(a) && entry.ids.includes(b))

export function readLookalikeFormsSurvey() {
  try {
    return JSON.parse(readFileSync(LOOKALIKE_FORMS_SURVEY_PATH, 'utf8'))
  } catch {
    return { reviewed: {} }
  }
}

/** 台帳の不足・誤り。 */
export function lookalikeFormGaps({ pairs = lookalikeFormPairs(), survey = readLookalikeFormsSurvey() } = {}) {
  const reviewed = survey.reviewed ?? {}
  const gaps = {
    pairs: pairs.size,
    listed: 0,
    skipped: 0,
    undecided: [],
    stale: [],
    badCodes: [],
    notDisplayed: [],
    skipConflicts: [],
    forms: [],
    families: [],
    links: [],
    notes: [],
  }
  for (const key of pairs.keys()) {
    const [a, b] = key.split('|')
    if (covered(a, b)) gaps.listed += 1
    else if (reviewed[key]) gaps.skipped += 1
    else gaps.undecided.push(key)
  }
  for (const [key, code] of Object.entries(reviewed)) {
    const [a, b] = key.split('|')
    if (!pairs.has(key)) gaps.stale.push(`${key}（母集団にない）`)
    else if (covered(a, b)) gaps.stale.push(`${key}（形の似た語のまとまりに入っている）`)
    if (!LOOKALIKE_FORM_SKIP_REASONS[code]) gaps.badCodes.push(`${key}（${code}）`)
    // 「説明済」は、ほかの台帳でつながりを画面に出している組だけ（カードの語を通した判定は画面に出ないので数えない）。
    if (code === '説明済' && !lookalikeVerdicts(a, b, { forms: false, indirect: false }).length) gaps.notDisplayed.push(key)
    // 「同源」にした組を、ほかの台帳が別の語源・遠い親戚・はっきりしないと判定していたら食いちがい。
    if (code === '同源') {
      const other = lookalikeVerdicts(a, b, { forms: false, indirect: false }).filter(([, kind]) => kind !== 'same')
      if (other.length) gaps.skipConflicts.push(`${key}: 同源にしたが ${other.map(([where, kind]) => `${where} は ${kind}`).join('・')}`)
    }
  }

  // 形の似た語のまとまり
  const forms = new Set()
  const usedLinks = new Set()
  for (const entry of lookalikeForms) {
    if (forms.has(entry.form)) gaps.forms.push(`${entry.form}: 同じ形のまとまりが2つある`)
    forms.add(entry.form)
    if (new Set(entry.ids).size !== entry.ids.length) gaps.forms.push(`${entry.form}: 同じ語が2回入っている`)
    if (entry.groups.length < 2) gaps.forms.push(`${entry.form}: 由来が1つだけ（別の語がない）`)
    for (const group of entry.groups) {
      if (!group.ids.length) gaps.forms.push(`${entry.form}: 語のない由来`)
      else if (!lookalikeFamilyNoteFor(group.ids[0])) gaps.forms.push(`${entry.form}: ${group.ids[0]}（由来の説明がない）`)
    }
    for (const id of entry.ids) {
      const word = getWord(id)
      if (!word) { gaps.forms.push(`${entry.form}: ${id}（見出し語にない）`); continue }
      if (!showsForm(String(word.word).toLowerCase(), entry.form)) gaps.forms.push(`${entry.form}: ${id}（形が語の頭にも接頭辞のあとにもない）`)
      // まとまりの語は、ほかの語と母集団の組になる語か、その語の形（tempt に対する temptation）。
      if (!entry.ids.some((other) => other !== id && (pairs.has(pairKey(id, other)) || sameFormGroup(id, other)))) {
        gaps.forms.push(`${entry.form}: ${id}（まとまりのほかの語と母集団の組にならず、その語の形でもない）`)
      }
    }
    for (let i = 0; i < entry.groups.length; i += 1) {
      for (let j = i + 1; j < entry.groups.length; j += 1) {
        for (const a of entry.groups[i].ids) for (const b of entry.groups[j].ids) usedLinks.add(pairKey(a, b))
      }
    }
    if (entry.tip) for (const problem of lookalikeNoteProblems(entry.tip)) gaps.notes.push(`${entry.form} の見分け方（${problem}）`)
  }
  for (const [a, b, kind, note] of LOOKALIKE_LINKS) {
    if (!usedLinks.has(pairKey(a, b))) gaps.links.push(`${a}・${b}（同じまとまりの別々の由来に入っていない）`)
    if (!['distant', 'unclear', 'unrelated'].includes(kind)) gaps.links.push(`${a}・${b}（${kind}）`)
    for (const problem of lookalikeNoteProblems(note)) gaps.links.push(`${a}・${b}（${problem}）`)
  }
  const firstIds = new Set(lookalikeForms.flatMap((entry) => entry.groups.map((group) => group.ids[0])))
  for (const [id, note] of Object.entries(LOOKALIKE_NOTES)) {
    if (!firstIds.has(id)) gaps.families.push(`${id}: 説明を書いたが、どのまとまりでも由来の先頭の語ではない`)
    for (const problem of lookalikeNoteProblems(note)) gaps.notes.push(`${id} の説明（${problem}）`)
  }
  return gaps
}

const lookalikeFamilyNoteFor = (id) => LOOKALIKE_NOTES[id] ?? etymologyStoryForWord(id)?.note ?? ''

/**
 * つながりが食いちがう組。
 * - 同じ2語が2つ以上の形の似た語のまとまりに並ぶとき、まとまりごとのつながりが同じか。
 * - ほかの台帳（つづり注意の組の語源・語根カードの似た語）の判定と同じか。
 */
export function lookalikeFormConflicts() {
  const conflicts = []
  const relations = new Map()
  for (const entry of lookalikeForms) {
    for (let i = 0; i < entry.ids.length; i += 1) {
      for (let j = i + 1; j < entry.ids.length; j += 1) {
        const [a, b] = [entry.ids[i], entry.ids[j]]
        const relation = relationInForm(entry, a, b)
        if (!relation) continue
        const key = pairKey(a, b)
        if (!relations.has(key)) relations.set(key, [])
        relations.get(key).push([entry.form, relation.kind])
      }
    }
  }
  for (const [key, list] of relations) {
    const kinds = new Set(list.map(([, kind]) => kind))
    if (kinds.size > 1) conflicts.push(`${key}: まとまりごとにつながりがちがう（${list.map(([form, kind]) => `${form}=${kind}`).join('・')}）`)
    const [a, b] = key.split('|')
    const mine = list[0][1]
    for (const [where, kind] of lookalikeVerdicts(a, b, { forms: false })) {
      if (kind !== mine) conflicts.push(`${key}: 形の似た語の台帳は ${mine}、${where} では ${kind}`)
    }
  }
  return { checked: relations.size, conflicts }
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const pairs = lookalikeFormPairs()
  if (process.argv.includes('--list')) {
    for (const [key, whys] of pairs) console.log(`${key}\t${whys.join('・')}`)
    process.exit(0)
  }
  const gaps = lookalikeFormGaps({ pairs })
  const { checked, conflicts } = lookalikeFormConflicts()
  gaps.conflicts = conflicts
  const lists = ['undecided', 'stale', 'badCodes', 'notDisplayed', 'skipConflicts', 'forms', 'families', 'links', 'notes', 'conflicts']
  console.log(`形の似た組: ${gaps.pairs}組（まとまりに載せた ${gaps.listed}・載せない理由を書いた ${gaps.skipped}・決めていない ${gaps.undecided.length}）`)
  const groups = lookalikeForms.reduce((sum, entry) => sum + entry.groups.length, 0)
  console.log(`形の似た語のまとまり ${lookalikeForms.length}（由来 ${groups}）・つながりを決めた組 ${checked}`)
  for (const key of lists) {
    for (const row of gaps[key].slice(0, 20)) console.log(`  ${key}: ${row}`)
    if (gaps[key].length > 20) console.log(`  ${key}: ほか ${gaps[key].length - 20}件`)
  }
  process.exit(lists.some((key) => gaps[key].length) ? 1 : 0)
}
