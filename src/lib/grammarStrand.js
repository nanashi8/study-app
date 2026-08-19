// 系統（級をまたぐ文法の筋道）を、成績に応じた難易度で学習するための計算。
//
// 学習マップの適応バトルはアプリ全体で1つのポジションを持つが、ここでは
// 「比較は2級まで進んだが仮定法は3級で苦戦中」のように系統ごとに現在地を持つ。
// 段(ステージ)の数は系統ごとに違う（受動態は3級のみ、助動詞は6級ぶん）ため、
// ポジションは級の絶対位置ではなく「その系統の級配列の添字」で扱う。
//
// 難易度の上下判定は適応バトルと同じ positionDelta を使い、アプリ全体で
// 「正答率60〜85%あたりを保つ」という同じ手応えに揃える。

import {
  getGrammarStrand,
  grammarStrandLevels,
  grammarStrandQuestions,
} from '../data/grammar-strands.js'
import { summarizeSrsItems } from './contentProgress.js'
import { positionDelta } from './adaptive.js'

// その級を「もう十分」と見なす基準。母数が少ないうちは判定しない。
export const STRAND_MASTERY_ACCURACY = 0.8
export const STRAND_MASTERY_MIN_ANSWERS = 5

// 「つまずいている」と見なす基準。この級は復習対象として画面に出す。
export const STRAND_WEAK_ACCURACY = 0.6

export function clampStrandPos(pos, stageCount) {
  const max = Math.max(0, stageCount - 1)
  if (!Number.isFinite(pos)) return 0
  return Math.max(0, Math.min(max, pos))
}

// ポジション(小数) → 実際に出題する段の添字。
export const strandStageIndex = (pos, stageCount) =>
  Math.round(clampStrandPos(pos, stageCount))

// 系統×級の成績。正答率は「正解÷(正解+不正解)」で、未回答は母数に入れない。
export function strandLevelStats(strand, srs = {}) {
  const resolved = typeof strand === 'string' ? getGrammarStrand(strand) : strand
  if (!resolved) return []
  return grammarStrandLevels(resolved).map((level) => {
    const questions = grammarStrandQuestions(resolved, level)
    const summary = summarizeSrsItems(questions, srs)
    const answered = summary.quiz.correct + summary.quiz.incorrect
    const accuracy = answered > 0 ? summary.quiz.correct / answered : null
    return {
      level,
      total: questions.length,
      correct: summary.quiz.correct,
      incorrect: summary.quiz.incorrect,
      unanswered: summary.quiz.unanswered,
      answered,
      accuracy,
      // 母数が足りるまでは「できている/苦手」を断定しない。
      judged: answered >= STRAND_MASTERY_MIN_ANSWERS,
      mastered: answered >= STRAND_MASTERY_MIN_ANSWERS && accuracy >= STRAND_MASTERY_ACCURACY,
      weak: answered >= STRAND_MASTERY_MIN_ANSWERS && accuracy < STRAND_WEAK_ACCURACY,
    }
  })
}

// 初回の現在地。易しい級から順に「もう十分」を満たす限り進み、
// 最初に満たさない級で止める。実績が無ければ一番易しい級から。
export function estimateStrandPosition(strand, srs = {}) {
  const stats = strandLevelStats(strand, srs)
  if (!stats.length) return 0
  let index = 0
  while (index < stats.length - 1 && stats[index].mastered) index += 1
  return index
}

// 保存済みの現在地が無ければ実績から推定する。
export function resolveStrandPosition(strand, srs = {}, storedPos = null) {
  const stats = strandLevelStats(strand, srs)
  if (!stats.length) return 0
  return Number.isFinite(storedPos)
    ? clampStrandPos(storedPos, stats.length)
    : estimateStrandPosition(strand, srs)
}

// セッション後の現在地。判定は適応バトルと同じ基準。
export function nextStrandPosition(strand, pos, accuracy) {
  const resolved = typeof strand === 'string' ? getGrammarStrand(strand) : strand
  const stageCount = grammarStrandLevels(resolved).length
  return clampStrandPos(clampStrandPos(pos, stageCount) + positionDelta(accuracy), stageCount)
}

// 画面が必要とする情報を一度に返す。
export function strandOverview(strand, srs = {}, storedPos = null) {
  const resolved = typeof strand === 'string' ? getGrammarStrand(strand) : strand
  if (!resolved) return null
  const levels = grammarStrandLevels(resolved)
  const stats = strandLevelStats(resolved, srs)
  const position = resolveStrandPosition(resolved, srs, storedPos)
  const stageIndex = strandStageIndex(position, levels.length)
  const answered = stats.reduce((sum, item) => sum + item.answered, 0)
  const correct = stats.reduce((sum, item) => sum + item.correct, 0)
  // 苦手な級は「一番正答率が低い級」。同率なら易しい方を先に立て直す。
  const weakest = stats
    .filter((item) => item.weak)
    .sort((a, b) => a.accuracy - b.accuracy)[0] ?? null
  return {
    strand: resolved,
    levels,
    stats,
    position,
    stageIndex,
    currentLevel: levels[stageIndex] ?? levels[0] ?? null,
    total: stats.reduce((sum, item) => sum + item.total, 0),
    answered,
    accuracy: answered > 0 ? correct / answered : null,
    weakest,
    // 一番易しい級から一度も解いていない＝まだ手つかずの系統。
    untouched: answered === 0,
  }
}

export function grammarStrandSource(strand, level) {
  const resolved = typeof strand === 'string' ? getGrammarStrand(strand) : strand
  return {
    type: 'grammarStrand',
    strandId: resolved?.id ?? null,
    level,
  }
}
