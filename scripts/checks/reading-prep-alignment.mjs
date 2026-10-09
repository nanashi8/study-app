#!/usr/bin/env node
// 読解の準備（ReadingPrep）の中身が、これから読む長文と合っているかを確かめる
// （requests/2026-10-09-reading-prep-alignment.json）。
//
// 見るもの
//   1. 準備に出る語（テーマ必須語彙・場面の束）が本文に出るか。重点語ケースの語は節の重点語ケースに出るか
//   2. 準備に出る語の、本文で使われる意味をカード（代表義・ほかの意味）で学べるか
//      本文の和訳にカードの訳語が入っていれば通す。入っていない組は1組ずつ読んだ台帳で決める
//   3. 本文を読むのに要る語（長文の級と同じか上の級の内容語）が、すべて準備に入っているか
//   4. 準備の熟語・表現が本文に出るか（どの文で使うかを読んだ台帳）
//   5. 本文に出る熟語・構文（長文の級と同じか上の級）が準備で学べるか（照合の候補を読んだ台帳）
//   6. 準備の読解ルールが、読解画面（文ごと・設問ごと）に出るルールと合っているか
//   7. あらすじ・テーマ・読解ポイント・読み方が本文と合うか（1本ずつ読んだ台帳）
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { ALL_PASSAGES } from '../../src/data/passages.js'
import {
  getReadingStudy,
  passageBodyWordIds,
  passageNeededWordIds,
} from '../../src/data/reading-study.js'
import { resolvePassageWord, PASSAGE_IRREGULAR_FORMS } from '../../src/data/passage-gloss.js'
import { getWord } from '../../src/data/vocab.js'
import { splitMeanings } from '../../src/data/compact.js'
import { PHRASES } from '../../src/data/phrases.js'
import { READING_LEVELS } from '../../src/data/levels.js'
import { readingApproachForPassage, READING_RULES_BY_ID } from '../../src/data/reading-rules.js'
import { sceneBundlesForPassage, sceneWordForms } from '../../src/lib/sceneBundles.js'
import { readingPrepRulesForPassage, readerRuleCounts } from '../../src/lib/readingPrepRules.js'
import { glossShownIn } from './example-learned-sense.mjs'

const audit = (name) => new URL(`../../docs/audits/${name}`, import.meta.url)
export const SENSE_REVIEW_PATH = audit('reading-prep-sense-review.json')
export const PHRASE_REVIEW_PATH = audit('reading-prep-phrase-review.json')
export const PHRASE_COVERAGE_PATH = audit('reading-prep-phrase-coverage.json')
export const OVERVIEW_REVIEW_PATH = audit('reading-prep-overview-review.json')

const readLedger = (path) => JSON.parse(readFileSync(path, 'utf8'))
export const fingerprint = (text) => createHash('sha256').update(String(text)).digest('hex').slice(0, 12)
const WORD_TOKENS = /[A-Za-z]+(?:['’][A-Za-z]+)*/g
const LEVEL_RANK = new Map(READING_LEVELS.map((level, index) => [level.id, index]))

/** 準備に出る語（テーマ必須語彙・場面の束）の id。 */
export function prepWordIds(passage) {
  const ids = new Set(getReadingStudy(passage).words.map((word) => word.id))
  for (const bundle of sceneBundlesForPassage(passage.id)) bundle.wordIds.forEach((id) => ids.add(id))
  return ids
}

// 本文の語の形（原形・規則変化・不規則変化）→ 準備の語。場面の束と同じ照らし方（sceneWordForms）で、
// researchers を researcher の形として数える（本文のタップは語族の research を引く）。
function prepWordsByForm(passage) {
  const byForm = new Map()
  for (const id of prepWordIds(passage)) {
    for (const form of sceneWordForms(getWord(id))) {
      if (!byForm.has(form)) byForm.set(form, new Set())
      byForm.get(form).add(id)
    }
  }
  return byForm
}

// ---- 1. 準備の語が本文に出るか ----
export function prepWordsAppearGaps() {
  const gaps = []
  let pairs = 0
  let caseWords = 0
  for (const passage of ALL_PASSAGES) {
    const body = new Set(passageBodyWordIds(passage))
    const tokens = new Set(passage.sentences.flatMap((sentence) => sentenceTokens(sentence.en)))
    for (const id of prepWordIds(passage)) {
      pairs += 1
      const surface = [...sceneWordForms(getWord(id))].some((form) => tokens.has(form))
      if (!body.has(id) && !surface) gaps.push(`${passage.id}: ${id} が本文に出ない`)
    }
    const caseIds = new Set((passage.sections ?? []).flatMap((section) => section.targetVocabularyIds ?? []))
    for (const word of getReadingStudy(passage).caseWords) {
      caseWords += 1
      if (!caseIds.has(word.id)) gaps.push(`${passage.id}: 重点語ケースの語 ${word.id} が節の重点語ケースに無い`)
    }
  }
  return { pairs, caseWords, gaps }
}

// ---- 2. 本文の意味をカードで学べるか ----
const cardGlosses = (word) => [
  ...splitMeanings(word.meaning),
  ...(word.otherSenses ?? []).flatMap((sense) => splitMeanings(sense.meaning)),
]

/** 準備の語が本文に出る（文・語）の組を全部。和訳にカードの訳語が入っていれば shown。 */
export function prepSenseRows() {
  const rows = []
  for (const passage of ALL_PASSAGES) {
    const prep = prepWordIds(passage)
    const byForm = prepWordsByForm(passage)
    passage.sentences.forEach((sentence, index) => {
      const seen = new Set()
      for (const token of sentence.en.match(WORD_TOKENS) ?? []) {
        const key = token.toLowerCase().replace(/’/g, "'")
        const resolvedId = resolvePassageWord(key, sentence.gloss)?.id
        // 本文のタップが引く見出し語（準備の語なら）と、語形が合う準備の語（researchers の researcher など）を見る。
        const ids = new Set([...(resolvedId && prep.has(resolvedId) ? [resolvedId] : []), ...(byForm.get(key) ?? [])])
        for (const id of ids) {
        if (seen.has(id)) continue
        seen.add(id)
        const word = getWord(id)
        const ja = [sentence.ja, ...(sentence.chunks ?? []).map((chunk) => chunk.ja)].join(' ')
        rows.push({
          key: `${passage.id}#${index}|${id}`,
          passageId: passage.id,
          id,
          token,
          en: sentence.en,
          fp: fingerprint(sentence.en),
          shown: cardGlosses(word).some((gloss) => glossShownIn(gloss, ja)),
        })
        }
      }
    })
  }
  return rows
}

// 台帳の判定。diff（本文の意味がカードに無い）は直すまで残してはいけない。
export const SENSE_VERDICTS = Object.freeze({
  same: 'カードと同じ意味（和訳が言い換えている）',
  form: '派生・活用の形（gardening・others など）で、意味はカードの語から分かる',
  pos: '品詞が変わるだけで、意味はカードの語から分かる（名詞の repair など）',
  other: 'カード裏の「ほかの意味」で使う',
  phrase: '熟語の一部として使う（open day・in this sense など）',
})

export function prepSenseGap() {
  const ledger = readLedger(SENSE_REVIEW_PATH).reviewed ?? {}
  const rows = prepSenseRows()
  const candidates = rows.filter((row) => !row.shown)
  const keys = new Set(candidates.map((row) => row.key))
  const problems = []
  for (const row of candidates) {
    const entry = ledger[row.key]
    if (!entry) problems.push(`未読: ${row.key}（${row.en}）`)
    else if (entry.fp !== row.fp) problems.push(`文が変わった: ${row.key}`)
    else if (!SENSE_VERDICTS[entry.verdict]) problems.push(`直していない: ${row.key} ${entry.verdict} ${entry.note ?? ''}`)
    else if (entry.verdict === 'other' && !(getWord(row.id).otherSenses ?? []).length) problems.push(`ほかの意味が無い: ${row.key}`)
  }
  const stale = Object.keys(ledger).filter((key) => !keys.has(key))
  return {
    pairs: new Set(rows.map((row) => `${row.passageId}|${row.id}`)).size,
    occurrences: rows.length,
    candidates: candidates.length,
    problems,
    stale,
  }
}

// ---- 3. 本文を読むのに要る語が準備に入っているか ----
export function neededWordsGap() {
  const gaps = []
  let needed = 0
  for (const passage of ALL_PASSAGES) {
    const prep = prepWordIds(passage)
    for (const id of passageNeededWordIds(passage)) {
      needed += 1
      if (!prep.has(id)) gaps.push(`${passage.id}: ${id}（${getWord(id).level}級）が準備に無い`)
    }
  }
  return { needed, gaps }
}

// ---- 4・5. 熟語 ----
// 熟語の文字の並び（〜・...・A・B などは「何語か入る」）を、活用を含めて本文の文と照らす。
const IRREGULAR = {
  be: ['am', 'is', 'are', 'was', 'were', 'been', 'being'], have: ['has', 'had', 'having'],
  do: ['does', 'did', 'done', 'doing'], go: ['goes', 'went', 'gone', 'going'],
  get: ['gets', 'got', 'gotten', 'getting'], make: ['makes', 'made', 'making'],
  take: ['takes', 'took', 'taken', 'taking'], come: ['comes', 'came', 'coming'],
  give: ['gives', 'gave', 'given', 'giving'], find: ['finds', 'found', 'finding'],
  keep: ['keeps', 'kept', 'keeping'], put: ['puts', 'putting'], run: ['runs', 'ran', 'running'],
  bring: ['brings', 'brought', 'bringing'], think: ['thinks', 'thought', 'thinking'],
  hold: ['holds', 'held', 'holding'], lead: ['leads', 'led', 'leading'], leave: ['leaves', 'left', 'leaving'],
  pay: ['pays', 'paid', 'paying'], say: ['says', 'said', 'saying'], see: ['sees', 'saw', 'seen', 'seeing'],
  tell: ['tells', 'told', 'telling'], stand: ['stands', 'stood', 'standing'],
  fall: ['falls', 'fell', 'fallen', 'falling'], grow: ['grows', 'grew', 'grown', 'growing'],
  know: ['knows', 'knew', 'known', 'knowing'], build: ['builds', 'built', 'building'],
  choose: ['chooses', 'chose', 'chosen', 'choosing'], learn: ['learns', 'learned', 'learnt', 'learning'],
  begin: ['begins', 'began', 'begun', 'beginning'], write: ['writes', 'wrote', 'written', 'writing'],
  meet: ['meets', 'met', 'meeting'], send: ['sends', 'sent', 'sending'], show: ['shows', 'showed', 'shown', 'showing'],
  speak: ['speaks', 'spoke', 'spoken', 'speaking'], teach: ['teaches', 'taught', 'teaching'],
  turn: ['turns', 'turned', 'turning'], set: ['sets', 'setting'], cut: ['cuts', 'cutting'],
  try: ['tries', 'tried', 'trying'], carry: ['carries', 'carried', 'carrying'], rely: ['relies', 'relied', 'relying'],
  apply: ['applies', 'applied', 'applying'],
}
const STOP_INFLECT = new Set(['to', 'of', 'in', 'on', 'at', 'for', 'by', 'up', 'out', 'off', 'as', 'the', 'an', 'a', 'and', 'or', 'with', 'from', 'into', 'about', 'than', 'so', 'not', 'no', 'all', 'it', 'that', 'this'])
const PLACEHOLDERS = new Set(['~', '...', '…', '—', 'a', 'b', 'x', 'y', 'o', 'c', 's', 'v', "~'s", 'sb', 'sth', 'something', 'someone', 'somebody', '名詞', '人', '組織', '過去分詞'])
const POSSESSIVES = ['my', 'your', 'his', 'her', 'its', 'our', 'their', "one's"]
const REFLEXIVES = ['myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves', 'oneself']
// 型の印：その位置に、その形の語が1語入る。
const TYPED = {
  doing: (token) => /ing$/.test(token),
  '~ing': (token) => /ing$/.test(token),
  '-ing': (token) => /ing$/.test(token),
  '比較級': (token) => /er$/.test(token) || token === 'more' || token === 'less',
  '-er': (token) => /er$/.test(token),
}

export function wordForms(word) {
  const w = word.toLowerCase()
  const out = new Set([w, ...(IRREGULAR[w] ?? [])])
  for (const [form, entry] of Object.entries(PASSAGE_IRREGULAR_FORMS)) if (entry.lemma === w) out.add(form)
  if (w.length > 2 && /^[a-z]+$/.test(w) && !STOP_INFLECT.has(w)) {
    for (const ending of ['s', 'es', 'ed', 'd', 'ing']) out.add(w + ending)
    if (w.endsWith('e')) out.add(`${w.slice(0, -1)}ing`)
    if (/[^aeiou]y$/.test(w)) { out.add(`${w.slice(0, -1)}ies`); out.add(`${w.slice(0, -1)}ied`) }
    if (/[^aeiou][aeiou][bdgmnprt]$/.test(w)) { out.add(`${w}${w.at(-1)}ed`); out.add(`${w}${w.at(-1)}ing`) }
  }
  return out
}

/**
 * 熟語の文字の並びを、照らす部品に分ける。語は活用を含む組（set）、doing・oneself・比較級などは型（test）、
 * 〜・...・A・B と「to do」の do は「何語か入る」（gap）。語も型も無ければ null。
 */
export function compilePhrase(phrase) {
  const text = String(phrase)
    .split(' / ')[0]
    .replace(/…/g, ' ... ')
    .replace(/\.\.\./g, ' ~ ')
    .replace(/[?!.,+]/g, ' ')
    .replace(/\(.*?\)/g, ' ')
  const parts = []
  let previous = ''
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    const lower = raw.toLowerCase().replace(/’/g, "'")
    const part = (() => {
      if (raw === 'I') return { set: new Set(['i']) }
      if (TYPED[lower]) return { test: TYPED[lower] }
      if (lower === 'oneself') return { set: new Set(REFLEXIVES) }
      if (lower === "one's") return { set: new Set(POSSESSIVES) }
      // 小文字の a は冠詞、大文字の A・B は「何語か入る」。to do の do は動詞の原形が入る印。
      if (lower === 'do' && previous === 'to') return { gap: true }
      if (/^[A-Z]$/.test(raw) || (PLACEHOLDERS.has(lower) && !(lower === 'a' && raw === 'a'))) return { gap: true }
      if (!/^[a-z'-]+$/.test(lower)) return { gap: true }
      return { set: wordForms(lower) }
    })()
    parts.push(part)
    previous = lower
  }
  while (parts[0]?.gap) parts.shift()
  while (parts.at(-1)?.gap) parts.pop()
  return parts.some((part) => !part.gap) ? parts : null
}

/** 照らせる部品（語と型）の数。1つだけの熟語（do with の with など）は、語の並びだけでは見分けられない。 */
export const phraseAnchors = (parts) => parts.filter((part) => !part.gap).length

export const sentenceTokens = (en) => en.toLowerCase().replace(/’/g, "'").match(/[a-z]+(?:'[a-z]+)*/g) ?? []

const partMatches = (part, token) => (part.set ? part.set.has(token) : part.test(token))

/** 熟語の語が、その順で文に出るか（「何語か入る」の所は5語まで飛ばせる）。 */
export function phraseInSentence(parts, tokens) {
  const walk = (partIndex, tokenIndex, allowGap) => {
    if (partIndex === parts.length) return true
    const part = parts[partIndex]
    if (part.gap) return walk(partIndex + 1, tokenIndex, 5)
    for (let k = tokenIndex; k < tokens.length && k <= tokenIndex + allowGap; k += 1) {
      if (partMatches(part, tokens[k]) && walk(partIndex + 1, k + 1, 0)) return true
    }
    return false
  }
  return tokens.some((token, index) => partMatches(parts[0], token) && walk(1, index + 1, 0))
}

/** 準備の熟語・表現のうち、本文のどの文で使うかを読んだ台帳と照らす。 */
export function prepPhraseGap() {
  const ledger = readLedger(PHRASE_REVIEW_PATH).reviewed ?? {}
  const problems = []
  const keys = new Set()
  let count = 0
  for (const passage of ALL_PASSAGES) {
    for (const phrase of getReadingStudy(passage).phrases) {
      count += 1
      const key = `${passage.id}|${phrase.id}`
      keys.add(key)
      const entry = ledger[key]
      if (!entry) { problems.push(`未読: ${key}「${phrase.phrase}」`); continue }
      const sentence = passage.sentences[entry.sentence]
      if (!sentence) { problems.push(`文が無い: ${key} #${entry.sentence}`); continue }
      if (entry.fp !== fingerprint(sentence.en)) { problems.push(`文が変わった: ${key}`); continue }
      if (entry.phrase !== phrase.phrase) { problems.push(`熟語が変わった: ${key}「${phrase.phrase}」`); continue }
      const parts = compilePhrase(entry.match ?? phrase.phrase)
      if (!parts || !phraseInSentence(parts, sentenceTokens(sentence.en))) {
        problems.push(`文に熟語の語が無い: ${key}「${entry.match ?? phrase.phrase}」#${entry.sentence}`)
      }
    }
  }
  const stale = Object.keys(ledger).filter((key) => !keys.has(key))
  return { count, problems, stale }
}

// 照合する熟語・構文：熟語の全件と、型で書いた構文（syn_）。例文そのものを見出しにした構文は照合できないので除く。
// 照らせる部品が1つだけの熟語（do with・will do など）は、語の並びだけでは熟語の使い方か見分けられないので候補にしない。
const matchablePhrases = () => PHRASES
  .filter((phrase) => phrase.kind === 'idiom' || /^syn_/.test(phrase.id))
  .map((phrase) => ({ phrase, parts: compilePhrase(phrase.phrase) }))
  .filter((entry) => entry.parts && phraseAnchors(entry.parts) >= 2)

/** 本文に出る熟語・構文（長文の級以上）で準備に無いもの＝照合の候補。 */
export function phraseCoverageCandidates() {
  const matchable = matchablePhrases()
  const candidates = []
  for (const passage of ALL_PASSAGES) {
    const prepIds = new Set(getReadingStudy(passage).phrases.map((phrase) => phrase.id))
    const rank = LEVEL_RANK.get(passage.level)
    for (const { phrase, parts } of matchable) {
      if (prepIds.has(phrase.id) || LEVEL_RANK.get(phrase.level) < rank) continue
      const index = passage.sentences.findIndex((sentence) => phraseInSentence(parts, sentenceTokens(sentence.en)))
      if (index < 0) continue
      candidates.push({ key: `${passage.id}|${phrase.id}`, passageId: passage.id, phrase, index, fp: fingerprint(passage.sentences[index].en) })
    }
  }
  return candidates
}

export const COVERAGE_DECISIONS = Object.freeze({
  covered: '準備の別の項目（by）で同じ熟語を学べる',
  'not-idiom': '語の並びが合うだけで、熟語として使われていない',
})

export function phraseCoverageGap() {
  const ledger = readLedger(PHRASE_COVERAGE_PATH).reviewed ?? {}
  const candidates = phraseCoverageCandidates()
  const problems = []
  for (const candidate of candidates) {
    const entry = ledger[candidate.key]
    if (!entry) { problems.push(`未読: ${candidate.key}「${candidate.phrase.phrase}」#${candidate.index}`); continue }
    if (entry.fp !== candidate.fp) { problems.push(`文が変わった: ${candidate.key}`); continue }
    if (!COVERAGE_DECISIONS[entry.decision]) { problems.push(`決めていない: ${candidate.key} ${entry.decision}`); continue }
    if (entry.decision === 'covered') {
      const prepIds = new Set(getReadingStudy(ALL_PASSAGES.find((p) => p.id === candidate.passageId)).phrases.map((p) => p.id))
      if (!prepIds.has(entry.by)) problems.push(`学べる先が準備に無い: ${candidate.key} → ${entry.by}`)
    }
  }
  const keys = new Set(candidates.map((candidate) => candidate.key))
  const stale = Object.keys(ledger).filter((key) => !keys.has(key))
  return { candidates: candidates.length, problems, stale }
}

// ---- 6. 読解ルール ----
export function prepRulesGap() {
  const problems = []
  let readerRules = 0
  let prepRules = 0
  for (const passage of ALL_PASSAGES) {
    const counts = readerRuleCounts(passage)
    const prep = readingPrepRulesForPassage(passage)
    const prepIds = new Set(prep.map((entry) => entry.rule.id))
    readerRules += counts.size
    prepRules += prep.length
    for (const id of counts.keys()) if (!prepIds.has(id)) problems.push(`${passage.id}: 読解画面の ${id} が準備に無い`)
    for (const { rule } of prep) {
      if (rule.phase !== 'orient' && !counts.has(rule.id)) problems.push(`${passage.id}: 準備の ${rule.id} が読解画面に出ない`)
    }
  }
  return { readerRules, prepRules, problems }
}

// ---- 7. あらすじ・テーマ・読解ポイント・読み方 ----
export function overviewSource(passage) {
  const approach = readingApproachForPassage(passage)
  return {
    blurb: passage.blurb,
    theme: passage.theme,
    examFocus: passage.examFocus,
    approach: approach && { title: approach.title, summary: approach.summary, steps: approach.steps },
    body: passage.sentences.map((sentence) => sentence.en).join(' '),
  }
}

export function overviewGap() {
  const ledger = readLedger(OVERVIEW_REVIEW_PATH).reviewed ?? {}
  const problems = []
  for (const passage of ALL_PASSAGES) {
    const entry = ledger[passage.id]
    if (!entry) { problems.push(`未読: ${passage.id}`); continue }
    if (entry.fp !== fingerprint(JSON.stringify(overviewSource(passage)))) problems.push(`読んだ後に変わった: ${passage.id}`)
    if (!entry.cues?.length) problems.push(`本文の手がかりが書かれていない: ${passage.id}`)
    for (const cue of entry.cues ?? []) {
      if (!passage.sentences.some((sentence) => sentence.en.includes(cue))) problems.push(`${passage.id}: 手がかり「${cue}」が本文に無い`)
    }
  }
  const stale = Object.keys(ledger).filter((id) => !ALL_PASSAGES.some((passage) => passage.id === id))
  return { passages: ALL_PASSAGES.length, problems, stale }
}

export { READING_RULES_BY_ID }

if (import.meta.url === `file://${process.argv[1]}`) {
  const sections = [
    ['準備の語が本文に出る', () => { const r = prepWordsAppearGaps(); return [`長文×語 ${r.pairs}組・重点語ケース ${r.caseWords}語`, r.gaps] }],
    ['本文の意味をカードで学べる', () => { const r = prepSenseGap(); return [`長文×語 ${r.pairs}組・出現 ${r.occurrences}・読んだ組 ${r.candidates}`, [...r.problems, ...r.stale.map((k) => `使われなくなった台帳の行: ${k}`)]] }],
    ['本文を読むのに要る語', () => { const r = neededWordsGap(); return [`長文×語 ${r.needed}組`, r.gaps] }],
    ['準備の熟語・表現が本文に出る', () => { const r = prepPhraseGap(); return [`${r.count}件`, [...r.problems, ...r.stale.map((k) => `使われなくなった台帳の行: ${k}`)]] }],
    ['本文の熟語を準備で学べる', () => { const r = phraseCoverageGap(); return [`照合の候補 ${r.candidates}件`, [...r.problems, ...r.stale.map((k) => `使われなくなった台帳の行: ${k}`)]] }],
    ['読解ルール', () => { const r = prepRulesGap(); return [`読解画面 ${r.readerRules}・準備 ${r.prepRules}`, r.problems] }],
    ['あらすじ・読み方', () => { const r = overviewGap(); return [`${r.passages}本`, [...r.problems, ...r.stale]] }],
  ]
  let failed = false
  for (const [label, run] of sections) {
    const [summary, problems] = run()
    console.log(`${problems.length ? '✗' : '✓'} ${label}: ${summary}${problems.length ? `・問題 ${problems.length}` : ''}`)
    for (const problem of problems.slice(0, 20)) console.log(`    ${problem}`)
    if (problems.length) failed = true
  }
  process.exit(failed ? 1 : 0)
}
