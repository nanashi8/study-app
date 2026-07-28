// 適応出題（学習マップのアドベンチャー）。
// 生徒は級のはしご(5級→1級)上の「ポジション」に立つ。成績でポジションが上下し、
// 立ち位置に応じて「敵LV（出題級）」が変化する。正解しつづけると敵が強くなり、
// つまずくと弱くなる——常に「少し難しい」状態を保って学習効率を上げる仕組み。
//
// 依存は levels.js（純データ）のみ。循環参照を避けるため、ここには副作用や
// srs 依存のロジックを置かない（srs からの初期位置推定は session.js 側）。
import { LEVELS } from '../data/levels.js'

// 級の並び（易→難）。index 0 = 5級 … 6 = 1級。
export const LEVEL_ORDER = LEVELS.map((l) => l.id)
export const POS_MIN = 0
export const POS_MAX = LEVEL_ORDER.length - 1

export const clampPos = (p) => Math.max(POS_MIN, Math.min(POS_MAX, Number.isFinite(p) ? p : 0))

// ポジション(float) → 敵LV（級index）。最寄りの級に丸める。
export const enemyLevelIndex = (pos) => clampPos(Math.round(clampPos(pos)))
export const enemyLevel = (pos) => LEVELS[enemyLevelIndex(pos)]
export const enemyLevelId = (pos) => LEVEL_ORDER[enemyLevelIndex(pos)]

// バトル結果(正答率)からポジションの増減幅を決める。
// 目標ゾーンは正答率 ~0.6–0.85。簡単すぎれば前進（敵を強く）、難しすぎれば後退（敵を弱く）。
export function positionDelta(accuracy) {
  if (accuracy >= 0.9) return +0.6 // 圧勝 → ぐっと前進
  if (accuracy >= 0.75) return +0.3 // 快勝 → 前進
  if (accuracy >= 0.6) return +0.1 // ちょうど良い → 少しだけ前進
  if (accuracy >= 0.45) return 0 // 互角 → 据え置き
  if (accuracy >= 0.3) return -0.3 // 苦戦 → 後退
  return -0.6 // 完敗 → 立て直し
}

// バトル後の新しいポジション。
export function nextPosition(pos, accuracy) {
  return clampPos(clampPos(pos) + positionDelta(accuracy))
}

// 出題ソース（buildDeck に渡す）。敵LV＝ポジションの級。
export function battleSource(pos) {
  const idx = enemyLevelIndex(pos)
  return {
    type: 'battle',
    levelIndex: idx,
    levelId: LEVEL_ORDER[idx],
    position: clampPos(pos),
  }
}

// 結果表示・保存・再戦で同じ次回位置を使うための単一計算。
// 元の作戦・問題数などは保ちつつ、再戦用sourceの級とpositionを必ず更新する。
export function battleProgression(source = {}, accuracy = 0, maxPos = POS_MAX) {
  const safeSource = source && typeof source === 'object' ? source : {}
  const start = Number.isFinite(safeSource.position)
    ? safeSource.position
    : safeSource.levelIndex
  const from = clampPos(start)
  const to = Math.min(nextPosition(from, accuracy), clampPos(maxPos))
  return {
    from,
    to,
    trend: battleTrend(from, to),
    source: {
      ...safeSource,
      ...battleSource(to),
    },
  }
}

// 結果表示用の移動判定。
// 級そのものが変わった場合だけ up / down を返し、同じ級の中で
// ポジションが動いただけなら advance / ease として区別する。
// これにより「5級のままなのにランクアップ」と表示される矛盾を防ぐ。
export function battleTrend(fromPos, toPos) {
  const a = enemyLevelIndex(fromPos)
  const b = enemyLevelIndex(toPos)
  if (b > a) return 'up'
  if (b < a) return 'down'
  return toPos > fromPos ? 'advance' : toPos < fromPos ? 'ease' : 'flat'
}
