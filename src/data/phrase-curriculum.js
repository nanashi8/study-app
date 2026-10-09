// 熟語・構文カリキュラムの最低収録目標。
// 既存カードを含む最終件数を級×種別で固定し、追加時の偏りや後退を検知する。
export const PHRASE_LEVEL_TARGETS = Object.freeze({
  '5': Object.freeze({ idiom: 86, syntax: 25 }),
  '4': Object.freeze({ idiom: 227, syntax: 35 }),
  '3': Object.freeze({ idiom: 303, syntax: 51 }),
  pre2: Object.freeze({ idiom: 319, syntax: 54 }),
  '2': Object.freeze({ idiom: 655, syntax: 69 }),
  pre1: Object.freeze({ idiom: 158, syntax: 58 }),
  '1': Object.freeze({ idiom: 161, syntax: 58 }),
})

// 文法の例文から作る構文カードの枚数は、級を見直す前（2026-10-09 より前）の構文の目標で決める。
// 熟語・構文の級を phrase-levels-override.js で見直しても、作る構文カードの組と id は変えない。
export const GRAMMAR_SYNTAX_GENERATION_TARGETS = Object.freeze({
  '5': 25, '4': 35, '3': 45, pre2: 55, '2': 65, pre1: 65, '1': 60,
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
