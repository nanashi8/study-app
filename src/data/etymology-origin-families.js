// 語根カードの系統（どのことばから来たか）。
//
// カードの origin 文の先頭に出る言語名だけで決める。origin は
// 「ラテン語 portāre「運ぶ」」のように必ず出どころの言語から書き始めるため、
// 別表を二重管理せずに分類できる。
// 古英語・中英語・古ノルド語は英語本来のゲルマン系としてまとめる
// （cast の古ノルド語、long の古英語 lang もここへ入る）。

export const ETYMOLOGY_ORIGIN_FAMILIES = Object.freeze([
  Object.freeze({ id: 'latin', label: 'ラテン語系', short: 'ラテン', emoji: '🏛️' }),
  Object.freeze({ id: 'greek', label: 'ギリシャ語系', short: 'ギリシャ', emoji: '🏺' }),
  Object.freeze({ id: 'germanic', label: '英語の土着語', short: '土着', emoji: '🌾' }),
])

export const ETYMOLOGY_ORIGIN_FAMILY_META = Object.freeze(
  Object.fromEntries(ETYMOLOGY_ORIGIN_FAMILIES.map((family) => [family.id, family])),
)

const FAMILY_MARKERS = Object.freeze([
  ['germanic', /古英語|中英語|古ノルド語|ゲルマン/],
  ['greek', /ギリシャ語/],
  ['latin', /ラテン語|フランス語/],
])

/**
 * 語根の由来文から系統を決める。複数の言語に触れる由来文（「古英語 lang /
 * ラテン語 longus」など）は、最初に出てくる言語をその語根の出どころとみなす。
 */
export function etymologyOriginFamily(origin = '') {
  const text = String(origin)
  let best = null
  for (const [id, pattern] of FAMILY_MARKERS) {
    const index = text.search(pattern)
    if (index < 0) continue
    if (!best || index < best.index) best = { id, index }
  }
  return best?.id ?? 'latin'
}

export const etymologyOriginFamilyMeta = (id) =>
  ETYMOLOGY_ORIGIN_FAMILY_META[id] ?? ETYMOLOGY_ORIGIN_FAMILY_META.latin
