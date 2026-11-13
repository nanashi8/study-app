// 文法の実力診断：受ける入試の範囲の全単元から1問ずつ出し、まちがえた単元にだけ確かめの2問目を出して、
// 弱い単元を系統×級のマップで見つける。問題は文法テストと同じ在庫（GRAMMAR_PRACTICE）から選び、
// 1回分は文法テストの画面（GrammarQuiz）で解く。
import { LEVELS } from '../data/levels.js'
import { getGrammar, grammarPracticeByTopic } from '../data/grammar.js'
import { grammarQuestionType } from '../data/grammar-format-expansion.js'
import { GRAMMAR_STRANDS } from '../data/grammar-strands.js'
import { grammarVariationKey } from './grammarDeck.js'

export const GRAMMAR_DIAGNOSTIC_ROUND = 10

const LEVEL_ORDER = LEVELS.map((level) => level.id)
const levelIndex = (level) => LEVEL_ORDER.indexOf(level)

// 範囲は英検の級で区切る。下の級の単元も入試の範囲に入るので、5級から数える。
export const GRAMMAR_DIAGNOSTIC_SCOPES = Object.freeze([
  { id: 'high', label: '高校入試', note: '中学で習う文法（英検5級〜3級）', upTo: '3' },
  { id: 'kyotsu', label: '大学入試・共通テスト', note: '中学〜高校の文法（英検5級〜2級）', upTo: '2' },
  { id: 'nankan', label: '大学入試・難関大', note: '中学〜難関大の文法（英検5級〜1級）', upTo: '1' },
])

export const grammarDiagnosticScope = (scopeId) =>
  GRAMMAR_DIAGNOSTIC_SCOPES.find((scope) => scope.id === scopeId) ?? null

export const grammarDiagnosticUnitKey = (level, topic) => `${level}|${topic}`

// 全127単元。系統の中の並び（易→難）を ui に持つ。
export const GRAMMAR_DIAGNOSTIC_UNITS = Object.freeze(
  GRAMMAR_STRANDS.flatMap((strand, si) => strand.topics.map(([level, topic], ui) => Object.freeze({
    key: grammarDiagnosticUnitKey(level, topic),
    level,
    topic,
    strand,
    si,
    ui,
  }))),
)
const UNIT_BY_KEY = new Map(GRAMMAR_DIAGNOSTIC_UNITS.map((unit) => [unit.key, unit]))
export const grammarDiagnosticUnit = (key) => UNIT_BY_KEY.get(key) ?? null

export const grammarDiagnosticLevels = (scopeId) => {
  const scope = grammarDiagnosticScope(scopeId)
  return scope ? LEVEL_ORDER.slice(0, levelIndex(scope.upTo) + 1) : []
}

// 出題の順：易しい級から。級の中は系統を散らし、途中でやめてもそこまでの範囲を満遍なく見られるようにする。
export function grammarDiagnosticUnits(scopeId) {
  const levels = grammarDiagnosticLevels(scopeId)
  return levels.flatMap((level, li) => GRAMMAR_DIAGNOSTIC_UNITS
    .filter((unit) => unit.level === level)
    .sort((a, b) => ((a.si * 7 + li * 3) % 25) - ((b.si * 7 + li * 3) % 25) || a.si - b.si || a.ui - b.ui))
}

// 前の回までに出した問題の回数（問題 id → 回数）と、出した型（単元 → 型の集まり）。受けている回は数えない。
export function grammarDiagnosticUsage(record) {
  const base = normalizeGrammarDiagnostic(record)
  const counts = new Map()
  const patterns = new Map()
  for (const entry of base.history) {
    if (base.current && entry.attempt === base.current.attempt) continue
    for (const [key, unitRecord] of Object.entries(entry.units)) {
      for (const answer of [unitRecord.first, unitRecord.second]) {
        const item = answer && getGrammar(answer.id)
        if (!item) continue
        counts.set(answer.id, (counts.get(answer.id) ?? 0) + 1)
        if (!patterns.has(key)) patterns.set(key, new Set())
        patterns.get(key).add(grammarVariationKey(item))
      }
    }
  }
  return { counts, patterns }
}

// 回ごとに並びを変えるための小さな混ぜ方（同じ回・同じ問題なら同じ値）。
function mix(text) {
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// 単元の問題から1問を選ぶ。前の回までに出していない問題（出した回数の少ない問題）を先に、
// その中で前の回に出していない型、早く解ける選択問題、まだ答えたことのない問題の順に選ぶ。
export function pickGrammarDiagnosticQuestion(unit, { attempt = 0, slot = 0, srs = {}, exclude = [], usage = null } = {}) {
  const all = grammarPracticeByTopic(unit.level, unit.topic).filter((item) => !exclude.includes(item.id))
  if (!all.length) return null
  const counts = usage?.counts ?? new Map()
  const patterns = usage?.patterns?.get(unit.key) ?? new Set()
  const score = (item) => [
    counts.get(item.id) ?? 0,
    patterns.has(grammarVariationKey(item)) ? 1 : 0,
    grammarQuestionType(item) === 'choice' ? 0 : 1,
    srs[item.id] ? 1 : 0,
    mix(`${attempt}:${slot}:${item.id}`),
  ]
  const better = (a, b) => {
    for (let index = 0; index < a.length; index += 1) if (a[index] !== b[index]) return a[index] < b[index]
    return false
  }
  let best = all[0]
  let bestScore = score(best)
  for (const item of all.slice(1)) {
    const itemScore = score(item)
    if (better(itemScore, bestScore)) { best = item; bestScore = itemScore }
  }
  return best
}

export function emptyGrammarDiagnostic() {
  return { current: null, history: [] }
}

const HISTORY_LIMIT = 50

function normalizeUnits(units) {
  if (!units || typeof units !== 'object') return {}
  const answer = (value) => (value && typeof value.id === 'string' ? { id: value.id, ok: value.ok === true } : null)
  return Object.fromEntries(Object.entries(units)
    .filter(([key]) => UNIT_BY_KEY.has(key))
    .map(([key, value]) => {
      const first = answer(value?.first)
      const second = first && !first.ok ? answer(value?.second) : null
      return [key, second ? { first, second } : first ? { first } : {}]
    })
    .filter(([, value]) => value.first))
}

export function normalizeGrammarDiagnostic(value) {
  if (!value || typeof value !== 'object') return emptyGrammarDiagnostic()
  const history = Array.isArray(value.history)
    ? value.history
        .filter((entry) => entry && grammarDiagnosticScope(entry.scope) && Number.isSafeInteger(entry.attempt))
        .map((entry) => ({
          attempt: entry.attempt,
          scope: entry.scope,
          day: Number.isFinite(entry.day) ? entry.day : 0,
          lastDay: Number.isFinite(entry.lastDay) ? entry.lastDay : Number.isFinite(entry.day) ? entry.day : 0,
          units: normalizeUnits(entry.units),
        }))
        .slice(-HISTORY_LIMIT)
    : []
  const current = value.current && grammarDiagnosticScope(value.current.scope)
    && value.current.units && typeof value.current.units === 'object'
    ? {
        scope: value.current.scope,
        attempt: Number.isSafeInteger(value.current.attempt) ? value.current.attempt : 0,
        startedDay: Number.isFinite(value.current.startedDay) ? value.current.startedDay : 0,
        units: normalizeUnits(value.current.units),
      }
    : null
  return { current, history }
}

// 新しい回を始める。回の番号は、これまでのどの回よりも大きくする（途中の回も履歴に残っている）。
export function startGrammarDiagnostic(record, scopeId, day = 0) {
  const base = normalizeGrammarDiagnostic(record)
  if (!grammarDiagnosticScope(scopeId)) return base
  const used = [...base.history.map((entry) => entry.attempt), base.current?.attempt ?? -1]
  return {
    ...base,
    current: { scope: scopeId, attempt: Math.max(-1, ...used) + 1, startedDay: day, units: {} },
  }
}

// 単元の出来。1問目が正解＝できた、1問目がまちがいで2問目が正解＝あやふや、2問ともまちがい＝弱点。
export function grammarDiagnosticVerdict(unitRecord) {
  if (!unitRecord?.first) return 'todo'
  if (unitRecord.first.ok) return 'ok'
  if (!unitRecord.second) return 'pending'
  return unitRecord.second.ok ? 'unsure' : 'weak'
}

export const GRAMMAR_DIAGNOSTIC_VERDICTS = Object.freeze({
  ok: 'できた',
  unsure: 'あやふや',
  weak: '弱点',
  pending: '確かめ待ち',
  todo: 'まだ',
})

// 次の1回分：前の回でまちがえた単元の確かめの2問目を先に、続けてまだ解いていない単元を10単元。
export function nextGrammarDiagnosticRound(record, { srs = {} } = {}) {
  const current = normalizeGrammarDiagnostic(record).current
  if (!current) return []
  const units = grammarDiagnosticUnits(current.scope)
  const usage = grammarDiagnosticUsage(record)
  const seconds = units
    .filter((unit) => grammarDiagnosticVerdict(current.units[unit.key]) === 'pending')
    .map((unit) => pickGrammarDiagnosticQuestion(unit, {
      attempt: current.attempt,
      slot: 1,
      srs,
      exclude: [current.units[unit.key].first.id],
      usage,
    }))
  const firsts = units
    .filter((unit) => !current.units[unit.key]?.first)
    .slice(0, GRAMMAR_DIAGNOSTIC_ROUND)
    .map((unit) => pickGrammarDiagnosticQuestion(unit, { attempt: current.attempt, slot: 0, srs, usage }))
  return [...seconds, ...firsts].filter(Boolean).map((item) => item.id)
}

// 答えを記録する。同じ問題を選び直したときは、その答えを置き換える。
export function recordGrammarDiagnosticAnswer(record, itemId, ok, day = null) {
  const base = normalizeGrammarDiagnostic(record)
  const item = getGrammar(itemId)
  if (!base.current || !item) return base
  const key = grammarDiagnosticUnitKey(item.level, item.topic)
  if (!UNIT_BY_KEY.has(key) || !grammarDiagnosticLevels(base.current.scope).includes(item.level)) return base
  const unitRecord = base.current.units[key] ?? {}
  const answer = { id: itemId, ok: ok === true }
  let next = null
  if (!unitRecord.first || unitRecord.first.id === itemId) next = { ...unitRecord, first: answer }
  else if (unitRecord.second?.id === itemId || (!unitRecord.first.ok && !unitRecord.second)) next = { ...unitRecord, second: answer }
  if (!next) return base
  // 1問目を正解に選び直したら、確かめの2問目は要らない。
  if (next.first.ok) delete next.second
  const current = { ...base.current, units: { ...base.current.units, [key]: next } }
  return { current, history: upsertHistory(base.history, current, day) }
}

// 受けている回の記録を履歴へ写す（答えるたびに同じ回の行を置き換える）。途中で受け直しても、その回は履歴に残る。
function upsertHistory(history, current, day) {
  const entry = {
    attempt: current.attempt,
    scope: current.scope,
    day: current.startedDay,
    lastDay: Number.isFinite(day) ? day : current.startedDay,
    units: current.units,
  }
  const rest = history.filter((item) => item.attempt !== current.attempt)
  return [...rest, entry].sort((a, b) => a.attempt - b.attempt).slice(-HISTORY_LIMIT)
}

// 結果のまとめ。attempt を渡すと、履歴に残ったその回のまとめ（渡さなければ受けている回）。
export function summarizeGrammarDiagnostic(record, attempt = null) {
  const base = normalizeGrammarDiagnostic(record)
  const current = attempt == null || attempt === base.current?.attempt
    ? base.current
    : base.history.find((entry) => entry.attempt === attempt) ?? null
  if (!current) return null
  const units = grammarDiagnosticUnits(current.scope)
  const verdictOf = (unit) => grammarDiagnosticVerdict(current.units[unit.key])
  const counts = { ok: 0, unsure: 0, weak: 0, pending: 0, todo: 0 }
  for (const unit of units) counts[verdictOf(unit)] += 1
  const byEase = (a, b) => levelIndex(a.level) - levelIndex(b.level) || a.si - b.si || a.ui - b.ui
  const strands = GRAMMAR_STRANDS
    .map((strand) => {
      const mine = units.filter((unit) => unit.strand.id === strand.id)
      const solved = mine.filter((unit) => ['ok', 'unsure', 'weak'].includes(verdictOf(unit)))
      const good = mine.filter((unit) => verdictOf(unit) === 'ok').length
      return {
        strand,
        units: mine,
        rate: solved.length ? good / solved.length : null,
      }
    })
    .filter((row) => row.units.length)
  return {
    scope: current.scope,
    attempt: current.attempt,
    day: current.startedDay ?? current.day,
    isCurrent: current.attempt === base.current?.attempt,
    units,
    verdictOf,
    unitAnswers: (unit) => [current.units[unit.key]?.first, current.units[unit.key]?.second].filter(Boolean),
    counts,
    total: units.length,
    answered: units.length - counts.todo,
    finished: counts.todo === 0 && counts.pending === 0,
    strands,
    weak: units.filter((unit) => verdictOf(unit) === 'weak').sort(byEase),
    unsure: units.filter((unit) => verdictOf(unit) === 'unsure').sort(byEase),
  }
}

// 単元のテストに出す問題（その単元の全問題）。弱点まとめのテストは弱点の単元の問題を合わせる。
export const grammarDiagnosticPracticeIds = (units) =>
  units.flatMap((unit) => grammarPracticeByTopic(unit.level, unit.topic).map((item) => item.id))

// 回ごとの成績の一覧（新しい回から）。同じ範囲の前の回から、弱点・できた単元の数がどう変わったかをつける。
export function grammarDiagnosticHistory(record) {
  const base = normalizeGrammarDiagnostic(record)
  const rows = base.history.map((entry) => {
    const summary = summarizeGrammarDiagnostic(base, entry.attempt)
    return {
      attempt: entry.attempt,
      scope: entry.scope,
      day: entry.day,
      lastDay: entry.lastDay,
      counts: summary.counts,
      total: summary.total,
      answered: summary.answered,
      finished: summary.finished,
      rate: summary.answered ? summary.counts.ok / summary.answered : null,
      isCurrent: entry.attempt === base.current?.attempt,
    }
  })
  for (const row of rows) {
    const previous = rows.filter((other) => other.scope === row.scope && other.attempt < row.attempt).at(-1) ?? null
    row.previous = previous
      ? { attempt: previous.attempt, weak: row.counts.weak - previous.counts.weak, ok: row.counts.ok - previous.counts.ok }
      : null
  }
  return rows.reverse()
}
