// 全SRS教材で共有する復習間隔。既存の0〜30日を保ったまま、
// 十分に定着した項目だけを60・90・180日の維持復習へ進める。
export const SRS_INTERVAL_DAYS = Object.freeze([
  0,
  1,
  2,
  4,
  7,
  15,
  30,
  60,
  90,
  180,
])

export const MAX_SRS_BOX = SRS_INTERVAL_DAYS.length - 1
export const LONG_TERM_SRS_BOX = 4
export const MAINTENANCE_SRS_BOX = 7

export function srsStageLabel(box) {
  const normalized = Math.max(0, Math.min(MAX_SRS_BOX, Math.floor(Number(box) || 0)))
  if (normalized >= MAINTENANCE_SRS_BOX) return '維持復習'
  if (normalized >= LONG_TERM_SRS_BOX) return '長期定着'
  if (normalized >= 2) return '短期定着'
  return '土台づくり'
}
