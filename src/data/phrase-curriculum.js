// 熟語・構文カリキュラムの最低収録目標。
// 既存カードを含む最終件数を級×種別で固定し、追加時の偏りや後退を検知する。
export const PHRASE_LEVEL_TARGETS = Object.freeze({
  '5': Object.freeze({ idiom: 70, syntax: 25 }),
  '4': Object.freeze({ idiom: 105, syntax: 35 }),
  '3': Object.freeze({ idiom: 145, syntax: 45 }),
  pre2: Object.freeze({ idiom: 185, syntax: 55 }),
  '2': Object.freeze({ idiom: 215, syntax: 65 }),
  pre1: Object.freeze({ idiom: 240, syntax: 65 }),
  '1': Object.freeze({ idiom: 190, syntax: 60 }),
})

export const PHRASE_TARGET_TOTALS = Object.freeze(
  Object.values(PHRASE_LEVEL_TARGETS).reduce(
    (totals, target) => ({
      idiom: totals.idiom + target.idiom,
      syntax: totals.syntax + target.syntax,
      all: totals.all + target.idiom + target.syntax,
    }),
    { idiom: 0, syntax: 0, all: 0 },
  ),
)

