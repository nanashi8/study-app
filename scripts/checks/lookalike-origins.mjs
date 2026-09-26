#!/usr/bin/env node
// つづりが似た語は語源がつながっているのか（requests/2026-09-26-lookalike-origins.json）を、2つの母集団の全件で確かめる。
//  1) 語根カードの似た語: 語根カード（接頭辞・接尾辞のカードを除く）の3文字以上の形で始まる見出し語（小文字にして比べる）と、
//     接頭辞のカードに入る語で、頭の接頭辞のすぐあとにその形が続く見出し語のうち、
//     カードの語にもその語の形のまとまり（word-forms.js）にも入っていない語（src/lib/lookalikeOrigins.js の決まり）。
//     src/data/lookalike-root-cards.js の ROOT_LOOKALIKES に、カードごとの由来のまとまりで書く。
//  2) つづり注意の組: SPELLING_CONFUSABLE_PAIRS と SPELLING_CONFUSABLE_EXTRAS の全組。
//     src/data/lookalike-confusables.js の CONFUSABLE_ORIGINS に書く。
// 見出し語・語源カード・つづり注意の組を足すと、読んで書くまでこの確認は通らない。
// 同じ2語が両方の台帳に出るとき（humanity と humidity）は、つながりが食いちがわないことも確かめる。
import { pathToFileURL } from 'node:url'
import { ALL_WORDS, ETYMOLOGY_WORD_STORIES, getWord } from '../../src/data/vocab.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../../src/data/spelling-confusables.js'
import {
  CONFUSABLE_ORIGINS,
  LOOKALIKE_KINDS,
  ROOT_LOOKALIKES,
  ROOT_LOOKALIKE_LINKS,
} from '../../src/data/lookalike-origins.js'
import {
  LOOKALIKE_ROOT_CARDS,
  cardFamilyIds,
  groupRelation,
  lookalikeGroupsOf,
  rootLookalikeCandidates,
} from '../../src/lib/lookalikeOrigins.js'

const pairKey = (a, b) => [String(a), String(b)].sort().join('|')

/** 説明の書き方の誤り（語の成り立ちの本文と同じ決まり）。 */
export function lookalikeNoteProblems(note) {
  const problems = []
  const text = String(note ?? '')
  if (!text.trim()) return ['説明がない']
  if (/(?:ラテン|ギリシャ|アラビア|イタリア|スペイン|ドイツ|オランダ|フランス|ノルド|ヘブライ|ペルシャ)(?![語系人])[\s(（]/u.test(text)) problems.push('言語名を略している')
  if (/古(?:英|仏)(?!語)/u.test(text)) problems.push('言語名を略している')
  if (/と同(?:源|系|根)/u.test(text)) problems.push('「〜と同じ語源」と書いていない')
  if (!text.endsWith('。')) problems.push('「。」で終わっていない')
  if (/\s{2,}|^\s|\s$/u.test(text)) problems.push('余分な空白')
  return problems
}

/** 母集団のつづり注意の組（キー → [a, b]）。辞書にない語はつづりで持つ。 */
export function confusablePairKeys() {
  const keys = new Map()
  for (const [a, b] of SPELLING_CONFUSABLE_PAIRS) keys.set(pairKey(a, b), [a, b])
  for (const [of, word] of SPELLING_CONFUSABLE_EXTRAS) keys.set(pairKey(of, word), [of, word])
  return keys
}

export function lookalikeOriginGaps() {
  const candidates = rootLookalikeCandidates(ALL_WORDS)
  const rootIds = new Set(LOOKALIKE_ROOT_CARDS.map((card) => card.rootId))
  const cardsById = new Map(LOOKALIKE_ROOT_CARDS.map((card) => [card.rootId, card]))
  const gaps = {
    cards: candidates.size,
    entries: 0,
    words: new Set(),
    missing: [],
    stale: [],
    duplicate: [],
    badKind: [],
    notes: [],
    links: [],
    confusables: 0,
    confusableMissing: [],
    confusableStale: [],
    conflicts: [],
  }
  for (const [rootId, found] of candidates) {
    gaps.entries += found.size
    for (const id of found.keys()) gaps.words.add(id)
    const placed = new Map()
    lookalikeGroupsOf(rootId).forEach((group, index) => {
      for (const id of group.ids) {
        if (placed.has(id)) gaps.duplicate.push(`${rootId}: ${id}`)
        placed.set(id, index)
      }
    })
    for (const id of found.keys()) if (!placed.has(id)) gaps.missing.push(`${rootId}: ${id}`)
  }
  for (const [rootId, rows] of Object.entries(ROOT_LOOKALIKES)) {
    if (!rootIds.has(rootId)) { gaps.stale.push(`${rootId}: 語根カードではない`); continue }
    const found = candidates.get(rootId) ?? new Map()
    rows.forEach(([kind, , note], index) => {
      const group = lookalikeGroupsOf(rootId)[index]
      if (!LOOKALIKE_KINDS[kind]) gaps.badKind.push(`${rootId}: ${group.ids.join(' ')}（${kind}）`)
      for (const problem of lookalikeNoteProblems(note)) gaps.notes.push(`${rootId}: ${group.ids.join(' ')}（${problem}）`)
      if (!group.ids.length) gaps.stale.push(`${rootId}: 語のないまとまり`)
      for (const id of group.ids) {
        if (!getWord(id)) gaps.stale.push(`${rootId}: ${id}（見出し語にない）`)
        else if (!found.has(id)) gaps.stale.push(`${rootId}: ${id}（母集団にない）`)
      }
    })
  }
  for (const [rootId, links] of Object.entries(ROOT_LOOKALIKE_LINKS)) {
    const groups = lookalikeGroupsOf(rootId)
    for (const [a, b, kind, note] of links) {
      const ga = groups.findIndex((group) => group.ids.includes(a))
      const gb = groups.findIndex((group) => group.ids.includes(b))
      if (ga < 0 || gb < 0 || ga === gb) gaps.links.push(`${rootId}: ${a}・${b}（別々のまとまりの語ではない）`)
      if (!LOOKALIKE_KINDS[kind]) gaps.links.push(`${rootId}: ${a}・${b}（${kind}）`)
      for (const problem of lookalikeNoteProblems(note)) gaps.links.push(`${rootId}: ${a}・${b}（${problem}）`)
    }
  }

  // つづり注意の組
  const pairs = confusablePairKeys()
  gaps.confusables = pairs.size
  for (const key of pairs.keys()) if (!CONFUSABLE_ORIGINS[key]) gaps.confusableMissing.push(key)
  for (const [key, entry] of Object.entries(CONFUSABLE_ORIGINS)) {
    if (!pairs.has(key)) { gaps.confusableStale.push(key); continue }
    const [kind, note] = entry
    if (!LOOKALIKE_KINDS[kind]) gaps.badKind.push(`${key}（${kind}）`)
    for (const problem of lookalikeNoteProblems(note)) gaps.notes.push(`${key}（${problem}）`)
  }

  // 同じ2語が語根カードの台帳にも出るとき、つながりが食いちがわない。
  for (const rootId of Object.keys(ROOT_LOOKALIKES)) {
    const card = cardsById.get(rootId)
    if (!card) continue
    const family = cardFamilyIds(card)
    const groupOf = new Map()
    lookalikeGroupsOf(rootId).forEach((group, index) => { for (const id of group.ids) groupOf.set(id, index) })
    const relationOf = (a, b) => {
      if (family.has(a) && family.has(b)) return 'same'
      if (family.has(a) && groupOf.has(b)) return lookalikeGroupsOf(rootId)[groupOf.get(b)].kind
      if (family.has(b) && groupOf.has(a)) return lookalikeGroupsOf(rootId)[groupOf.get(a)].kind
      if (groupOf.has(a) && groupOf.has(b)) return groupRelation(rootId, groupOf.get(a), groupOf.get(b))?.kind ?? null
      return null
    }
    for (const [key, [a, b]] of pairs) {
      const entry = CONFUSABLE_ORIGINS[key]
      if (!entry) continue
      const expected = relationOf(a, b)
      if (expected && expected !== entry[0]) gaps.conflicts.push(`${key}: つづり注意は ${entry[0]}、${rootId} のカードでは ${expected}`)
    }
  }
  gaps.words = gaps.words.size
  return gaps
}

// ── 語の成り立ち（公開している本文）が名指しした語のつながりを、台帳と照らす ──
// 2026-09-26、omit の「miss と同じ語源」・cure の「care と同じ語源」・isolate の「island と同じ語源」のように、
// つづりが似ているだけの語を同じ語源と書いた本文が見つかったことから作った。
//   「X と同じ語源」            … 台帳で same（同じ語源）のはず
//   「X … 遠い親戚」            … distant（遠い親戚）のはず
//   「X とは別の語源」「関係ない」 … unrelated（別の語源）か unclear（はっきりしない）のはず
// 2語の組が台帳に直接あればそれで決め、なければ語根カード（接頭辞・接尾辞のカードを除く）の語を通して決める
// （curious と care は、curious が cure と同じカードの語で、cure と care が別の語源なので、別の語源）。
// 同じつづりの見出し語が2つ以上ある語（grave と grave_2）は、どれか1つと合えばよい。
const CLAIM_MARKS = [
  ['same', /と同じ語源|と同系|と同じ語根/g],
  ['distant', /遠い親戚/g],
  ['unrelated', /とは別の語源|とは関係ない|とは無関係/g],
]
const CLAIM_OK = {
  same: ['same'],
  distant: ['distant'],
  unrelated: ['unrelated', 'unclear'],
}
const LATIN_TOKEN = /[\p{Script=Latin}][\p{Script=Latin}'’-]*/gu

// 印の直前の句（前の文・→・閉じていない丸かっこのあと）。「遠い親戚」は文全体を見る。
function claimClause(text, index, kind) {
  const before = text.slice(0, index)
  if (kind === 'distant') return before.slice(before.lastIndexOf('。') + 1)
  let cut = Math.max(before.lastIndexOf('。'), before.lastIndexOf('→'))
  let depth = 0
  for (let k = before.length - 1; k > cut; k -= 1) {
    const char = before[k]
    if (char === '）' || char === ')') depth += 1
    else if (char === '（' || char === '(') {
      if (depth === 0) { cut = k; break }
      depth -= 1
    }
  }
  return before.slice(cut + 1)
}

// 「同じ語源」は丸かっこの中（意味・元の語）を名指しに数えない。ほかは「体の腕（arm）」のように中の語も見る。
const claimTokens = (clause, kind) => {
  const stripped = clause.replace(/「[^」]*」/gu, ' ')
  return (kind === 'same' ? stripped.replace(/（[^）]*）/gu, ' ').replace(/\([^)]*\)/gu, ' ') : stripped).match(LATIN_TOKEN) ?? []
}

// 語根カードと、その語（カードの語とその形のまとまり）。はじめて使うときに1回だけ作る。
let cardFamilies = null
const rootCardFamilies = () => (cardFamilies ??= LOOKALIKE_ROOT_CARDS.map((card) => [card, cardFamilyIds(card)]))

/** 2語のつながりの台帳の判定（[どこ, kind] の並び）。直接の組があればそれだけ。 */
export function lookalikeVerdicts(aId, bId) {
  const direct = CONFUSABLE_ORIGINS[pairKey(aId, bId)]
  if (direct) return [[`つづり注意 ${pairKey(aId, bId)}`, direct[0]]]
  const out = []
  const families = rootCardFamilies()
  for (const [card, family] of families) {
    if (!ROOT_LOOKALIKES[card.rootId]) continue
    const groups = lookalikeGroupsOf(card.rootId)
    const groupOf = (id) => groups.findIndex((group) => group.ids.includes(id))
    const [ga, gb] = [groupOf(aId), groupOf(bId)]
    if (family.has(aId) && family.has(bId)) out.push([`${card.rootId} のカード`, 'same'])
    else if (family.has(aId) && gb >= 0) out.push([`${card.rootId} のカード`, groups[gb].kind])
    else if (family.has(bId) && ga >= 0) out.push([`${card.rootId} のカード`, groups[ga].kind])
    else if (ga >= 0 && gb >= 0) {
      const relation = ga === gb ? (groups[ga].affix ? null : { kind: 'same' }) : groupRelation(card.rootId, ga, gb)
      if (relation) out.push([`${card.rootId} のカード`, relation.kind])
    }
  }
  if (out.length) return out
  // カードの語を通す（a と同じカードの語 m と b の組がつづり注意にある）。
  for (const [card, family] of families) {
    if (!family.has(aId)) continue
    for (const member of family) {
      const entry = CONFUSABLE_ORIGINS[pairKey(member, bId)]
      if (entry && member !== aId) out.push([`${card.rootId} のカードの ${member} とのつづり注意`, entry[0]])
    }
  }
  return out
}

/** 語の成り立ちの名指しで、台帳の判定と食いちがうもの。 */
export function storyClaimConflicts(stories = ETYMOLOGY_WORD_STORIES) {
  const idsBySpelling = new Map()
  for (const word of ALL_WORDS) {
    const key = word.word.toLowerCase()
    if (!idsBySpelling.has(key)) idsBySpelling.set(key, [])
    idsBySpelling.get(key).push(word.id)
  }
  const conflicts = []
  let claims = 0
  for (const story of stories) {
    const word = getWord(story.wordId)
    if (!word) continue
    const self = word.word.toLowerCase()
    for (const [kind, mark] of CLAIM_MARKS) {
      for (const match of story.note.matchAll(mark)) {
        for (const token of claimTokens(claimClause(story.note, match.index, kind), kind)) {
          const lower = token.toLowerCase()
          if (lower === self) continue
          const judged = (idsBySpelling.get(lower) ?? [])
            .map((id) => [id, lookalikeVerdicts(word.id, id)])
            .filter(([, verdicts]) => verdicts.length)
          if (!judged.length) continue
          claims += 1
          const ok = judged.some(([, verdicts]) => verdicts.some(([, verdict]) => CLAIM_OK[kind].includes(verdict)))
          if (!ok) {
            const detail = judged.map(([id, verdicts]) => `${id}: ${verdicts.map(([where, verdict]) => `${where}=${verdict}`).join('・')}`).join(' / ')
            conflicts.push(`${word.id} の語の成り立ち「${lower}」を ${kind} と書いたが、台帳は ${detail}`)
          }
        }
      }
    }
  }
  return { claims, conflicts }
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  if (process.argv.includes('--list')) {
    for (const [rootId, found] of rootLookalikeCandidates(ALL_WORDS)) {
      for (const [id, matches] of found) console.log(`${rootId}\t${id}\t${matches.join(',')}`)
    }
    process.exit(0)
  }
  const gaps = lookalikeOriginGaps()
  const stories = storyClaimConflicts()
  gaps.storyConflicts = stories.conflicts
  const lists = ['missing', 'stale', 'duplicate', 'badKind', 'notes', 'links', 'confusableMissing', 'confusableStale', 'conflicts', 'storyConflicts']
  const total = lists.reduce((sum, key) => sum + gaps[key].length, 0)
  console.log(`語根カードの似た語: ${gaps.cards}枚・${gaps.entries}件・${gaps.words}語（書いていない ${gaps.missing.length}件）`)
  console.log(`つづり注意の組: ${gaps.confusables}組（書いていない ${gaps.confusableMissing.length}組）`)
  console.log(`語の成り立ちの名指しで台帳と照らせたもの: ${stories.claims}件（食いちがい ${stories.conflicts.length}件）`)
  for (const key of lists) {
    for (const row of gaps[key].slice(0, 30)) console.log(`  ${key}: ${row}`)
    if (gaps[key].length > 30) console.log(`  ${key}: ほか ${gaps[key].length - 30}件`)
  }
  process.exit(total ? 1 : 0)
}
