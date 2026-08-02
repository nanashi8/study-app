// 学習セッションの「デッキ」を組む。
// 出題優先度：① 復習期限が来た既習語 → ② 未習語 → ③ まだ期限前の語。
import {
  ALL_WORDS,
  wordsByField,
  wordsByLevel,
  wordsByPos,
  wordsByRoot,
  getWord,
  shuffle,
} from '../data/vocab.js'
import { phrasesByKind, phrasesByLevel, getPhrase } from '../data/phrases.js'
import { quizMeaningKey } from '../data/compact.js'
import { LEVELS } from '../data/levels.js'
import { LEVEL_ORDER, enemyLevelIndex, clampPos } from './adaptive.js'
import { todayIndex } from '../store/useStore.js'

export const SESSION_SIZE = 10

/**
 * 復習ショートカットの表示状態。
 * 未着手の 0 件と、学習後に復習をすべて終えた 0 件を区別する。
 */
export function reviewActionState({ seen = 0, due = 0 } = {}) {
  if (due > 0) return 'due'
  return seen > 0 ? 'complete' : 'empty'
}

/** 暗記セッションの回答を記録し、忘れた項目の ID だけを復習対象として残す。 */
export function recordStudyAnswer(results, itemId, remembered) {
  if (remembered) {
    return {
      ...results,
      remembered: results.remembered + 1,
    }
  }
  return {
    ...results,
    forgot: results.forgot + 1,
    forgotIds: [...results.forgotIds, itemId],
  }
}

// 適応バトルの出題プール：敵LV（その級）を主力に、ひとつ下の級から少量だけ
// 復習を混ぜる（土台を確認しつつ学習効率を上げる）。
function battlePool(levelIndex, rng = Math.random) {
  const idx = clampPos(Math.round(levelIndex))
  const main = wordsByLevel(LEVEL_ORDER[idx])
  if (idx === 0) return main
  const review = shuffle(wordsByLevel(LEVEL_ORDER[idx - 1]), rng).slice(0, 4)
  return [...main, ...review]
}

export function wordsForSource(source = {}) {
  switch (source.type) {
    case 'all':
      return ALL_WORDS
    case 'field':
      return wordsByField(source.field)
    case 'pos':
      return wordsByPos(source.pos)
    case 'level':
      return wordsByLevel(source.levelId)
    case 'battle':
      return battlePool(source.levelIndex ?? enemyLevelIndex(source.pos ?? 0))
    case 'root':
      return wordsByRoot(source.rootId)
    case 'mylist':
      return (source.ids ?? []).map(getWord).filter(Boolean)
    case 'deck':
      return (source.ids ?? []).map(getWord).filter(Boolean)
    case 'due':
      return ALL_WORDS
    case 'custom':
      return source.words ?? []
    default:
      return []
  }
}

function rank(word, srs, day) {
  const e = srs[word.id]
  if (!e) return 1 // 未習
  if (e.due <= day) return 0 // 復習どき
  return 2 // まだ期限前
}

/** source からセッション用の単語配列を作る。 */
export function buildDeck(source, { srs = {}, size = SESSION_SIZE } = {}) {
  const day = todayIndex()
  let pool = shuffle(wordsForSource(source))
  if (source.type === 'due') {
    pool = pool.filter((w) => srs[w.id] && srs[w.id].due <= day)
  }
  pool.sort((a, b) => {
    const ra = rank(a, srs, day)
    const rb = rank(b, srs, day)
    if (ra !== rb) return ra - rb
    const ba = srs[a.id]?.box ?? 0
    const bb = srs[b.id]?.box ?? 0
    return ba - bb // box が低い（苦手）ほど先
  })
  return size ? pool.slice(0, size) : pool
}

/** 級ごとの進捗集計（既習・習得・期限切れ件数）。 */
export function levelProgress(levelId, srs) {
  return wordProgress(wordsByLevel(levelId), srs)
}

/** 任意の単語集合について、既習・習得・復習どき件数を集計する。 */
export function wordProgress(words, srs = {}) {
  const day = todayIndex()
  let seen = 0
  let mastered = 0
  let due = 0
  for (const w of words) {
    const e = srs[w.id]
    if (!e) continue
    seen++
    if (e.box >= 4) mastered++
    if (e.due <= day) due++
  }
  return { total: words.length, seen, mastered, due }
}

// ── 弱点ナビ：下の級（＝前提）が足を引っ張っていないか検知する ──
// 英検は 5級→1級 が学習の土台。上の級に進んでいるのに、下の級の定着が弱い
// （習得率が低い／復習がたまっている）なら、その級を「先に固めるべき前提」として返す。
// 返り値: { level, progress, masteredPct, reason:'due'|'mastery' } または null。
export function weakFoundationLevel(srs) {
  const stats = LEVELS.map((lv) => ({ lv, p: levelProgress(lv.id, srs) }))
  // いちばん上の「着手済み」級のインデックス。
  let highestActive = -1
  stats.forEach((s, i) => {
    if (s.p.seen > 0) highestActive = Math.max(highestActive, i)
  })
  if (highestActive <= 0) return null // 下に級がない＝判定不要

  for (let i = 0; i < highestActive; i++) {
    const { lv, p } = stats[i]
    if (p.seen < 3) continue // データが少なすぎる級は対象外
    const masteredPct = p.total ? p.mastered / p.total : 0
    if (p.due >= 3) return { level: lv, progress: p, masteredPct, reason: 'due' }
    if (masteredPct < 0.6) return { level: lv, progress: p, masteredPct, reason: 'mastery' }
  }
  return null
}

// ── 熟語・構文（phrase）。SRS は単語と同じ srs を id で共用 ──
function phraseCandidates(source) {
  if (source.type === 'phraseList') return (source.ids ?? []).map(getPhrase).filter(Boolean)
  if (source.type === 'customPhrase') return source.items ?? []
  if (source.levelId) return phrasesByLevel(source.kind, source.levelId)
  return phrasesByKind(source.kind)
}

export function buildPhraseDeck(source, { srs = {}, size = SESSION_SIZE } = {}) {
  const day = todayIndex()
  let pool = shuffle(phraseCandidates(source))
  if (source.type === 'phraseDue') {
    pool = pool.filter((p) => srs[p.id] && srs[p.id].due <= day)
  }
  pool.sort((a, b) => {
    const ra = rank(a, srs, day)
    const rb = rank(b, srs, day)
    if (ra !== rb) return ra - rb
    return (srs[a.id]?.box ?? 0) - (srs[b.id]?.box ?? 0)
  })
  return size ? pool.slice(0, size) : pool
}

export function pickPhraseDistractors(phrase, count, rng = Math.random) {
  const candidates = phrasesByKind(phrase.kind).filter((item) => item.id !== phrase.id)
  const tiers = [
    candidates.filter((item) =>
      item.level === phrase.level && item.category === phrase.category),
    candidates.filter((item) => item.level === phrase.level),
    candidates.filter((item) => item.category === phrase.category),
    candidates,
  ]
  const seenIds = new Set([phrase.id])
  const picked = []
  const used = new Set([quizMeaningKey(phrase)])
  for (const tier of tiers) {
    for (const item of shuffle(tier, rng)) {
      if (seenIds.has(item.id)) continue
      seenIds.add(item.id)
      const meaningKey = quizMeaningKey(item)
      if (!meaningKey || used.has(meaningKey)) continue
      used.add(meaningKey)
      picked.push(item)
      if (picked.length >= count) return picked
    }
  }
  return picked
}

export function phraseKindProgress(kind, srs) {
  const day = todayIndex()
  const items = phrasesByKind(kind)
  let seen = 0
  let mastered = 0
  let due = 0
  for (const p of items) {
    const e = srs[p.id]
    if (!e) continue
    seen++
    if (e.box >= 4) mastered++
    if (e.due <= day) due++
  }
  return { total: items.length, seen, mastered, due }
}

// ── 適応バトル：これまでの習得状況から初期ポジションを推定する ──
// 各級の習得率を下から見て、概ね習得(>=50%)できている最上位級の「少し上」を
// 初期ポジションにする。まだ何もしていなければ 5級(0)から。
export function suggestStartPosition(srs) {
  let pos = 0
  LEVEL_ORDER.forEach((id, i) => {
    const p = levelProgress(id, srs)
    const masteredPct = p.total ? p.mastered / p.total : 0
    if (masteredPct >= 0.5) pos = Math.min(LEVEL_ORDER.length - 1, i + 0.5)
    else if (p.seen > 0) pos = Math.max(pos, i)
  })
  return clampPos(pos)
}

/** 全体の習得数・期限切れ数。 */
export function overallProgress(srs) {
  const day = todayIndex()
  // 文法・熟語も同じ SRS 名前空間を使うため、英単語だけを明示的に数える。
  // Object.keys(srs) を数えるとホームの「N語」と単語復習デッキが食い違う。
  let mastered = 0
  let due = 0
  let seen = 0
  for (const word of ALL_WORDS) {
    const entry = srs[word.id]
    if (!entry) continue
    seen++
    if (entry.box >= 4) mastered++
    if (entry.due <= day) due++
  }
  return { seen, mastered, due, total: ALL_WORDS.length }
}
