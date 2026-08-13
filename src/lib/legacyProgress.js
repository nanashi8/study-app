// 旧保存データとの往復だけに使う不活性な互換値。
// 学習評価、表示、報酬、解放条件、推薦へ渡してはならない。
export function normalizeLegacyXp(value) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return 0
  return Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(numeric)))
}

export function normalizeLegacyStats(stats = {}) {
  const source = stats && typeof stats === 'object' && !Array.isArray(stats)
    ? stats
    : {}
  return {
    ...source,
    xp: normalizeLegacyXp(source.xp),
  }
}

export function isValidLegacyXp(value) {
  return Number.isSafeInteger(value) && value >= 0
}
