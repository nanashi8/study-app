// 画面の params に置く見え方（useScreenParam）の読み方。無い値・崩れた値は既定値にする。
// 戻ったときに同じ見え方で始められるよう、一覧の表示・絞り込み・開いた項目を params に置く。

/** 「学ぶ」と「一覧を確認」を切り替える画面の表示。 */
export const readListView = (value) => (value === 'list' ? 'list' : 'home')

/** 検索語などの文字。 */
export const readText = (value) => (typeof value === 'string' ? value : '')

/** 開いている項目の ID。開いていなければ null。 */
export const readOpenId = (value) => (typeof value === 'string' ? value : null)

/** 決まった選択肢のどれか。 */
export const readChoice = (choices, fallback) => (value) => (choices.includes(value) ? value : fallback)

/** 1以上の整数（表示件数など）。 */
export const readCount = (fallback) => (value) => (Number.isInteger(value) && value > 0 ? value : fallback)
