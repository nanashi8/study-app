// 一覧から語の詳細や学習へ移って戻ったとき、一覧の見え方をそのまま戻すための保存形。
// 画面の params に入れて履歴と一緒に運ぶ（端末には保存しない）。
// 戻すのは、しぼり込み・並び替え・学習とテストの切替・スワイプで隠した行・表示件数・スクロール位置。

const ACTIVITIES = ['memory', 'test']
const DIRECTIONS = ['asc', 'desc']

/** いまの一覧の見え方を、戻ったときに読み戻せる形で残す。 */
export function catalogReturnState({
  key,
  activity = 'memory',
  sort,
  direction,
  filters = {},
  toolsOpen = false,
  visible,
  dismissedByActivity = {},
  scrollTop = 0,
}) {
  return {
    key,
    activity,
    sort,
    direction,
    filters: { ...filters },
    toolsOpen: Boolean(toolsOpen),
    visible,
    dismissed: Object.fromEntries(
      ACTIVITIES.map((id) => [id, [...(dismissedByActivity[id] ?? [])]]),
    ),
    scrollTop: Math.max(0, Math.round(Number(scrollTop) || 0)),
  }
}

/**
 * 同じ一覧で残した見え方だけを読み戻す。別の一覧のものや形の崩れた値は使わない。
 * sorts は選べる並び替えの id、defaultDirections は並び替えごとの既定の向き。
 */
export function readCatalogReturnState(saved, {
  key,
  sorts = [],
  defaultSort,
  defaultDirections = {},
  pageSize,
}) {
  if (!saved || typeof saved !== 'object' || saved.key !== key) return null
  const sort = sorts.includes(saved.sort) ? saved.sort : defaultSort
  const filters = saved.filters && typeof saved.filters === 'object' ? saved.filters : {}
  return {
    activity: ACTIVITIES.includes(saved.activity) ? saved.activity : 'memory',
    sort,
    direction: DIRECTIONS.includes(saved.direction)
      ? saved.direction
      : defaultDirections[sort] ?? 'desc',
    filters: Object.fromEntries(
      Object.entries(filters).filter(([, value]) => typeof value === 'string'),
    ),
    toolsOpen: saved.toolsOpen === true,
    visible: Number.isInteger(saved.visible) && saved.visible > pageSize ? saved.visible : pageSize,
    dismissedByActivity: Object.fromEntries(ACTIVITIES.map((id) => [
      id,
      new Set(
        Array.isArray(saved.dismissed?.[id])
          ? saved.dismissed[id].filter((itemId) => typeof itemId === 'string')
          : [],
      ),
    ])),
    scrollTop: Number.isFinite(saved.scrollTop) && saved.scrollTop > 0 ? saved.scrollTop : 0,
  }
}
