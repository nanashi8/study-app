// 画面の文に、出典の表示（アプリが使った資料を示す表示）があるかを探す。
// 利用者の指示（2026-11-04）「出典の表示を削除しなさい。著作者の許諾なく使用していると勘違いしないようにしなさい。」
// （requests/2026-11-04-remove-credits-page.json）は、アプリの出典の表示を消すもの。出典の画面・メニューの行・出典のデータが
// 残らないことは tests/no-credits-page.test.mjs が画面の作りから確かめる。
// 2026-11-05 まで、学習の画面では「出典」の2文字があるだけで止めていたため、レポートに出典を書くことを教える地理総合の
// 本文まで言い換えていた（requests/2026-11-05-citation-term-in-lessons.json）。学習の本文や語句の用語としての「出典」は止めず、
// 学習の画面では、図や資料のそばに資料を書く形（「出典：」「出典:」）と資料の名前だけを止める。メニューは「出典」の語で止める。

/** 学習の画面に出さない資料の名前（出典のページだけに載っていたもの）。 */
export const CREDIT_SOURCE_NAMES = Object.freeze(['Natural Earth', '東京書籍'])

/**
 * 画面の文から出典の表示を探し、見つかったものを返す（空なら表示なし）。
 * menu: true のときは、メニューの行として「出典」の語そのものを止める。
 */
export function creditDisplays(text, { menu = false } = {}) {
  const found = []
  if (menu && text.includes('出典')) found.push('出典')
  for (const match of text.matchAll(/出典\s*[：:]/g)) found.push(match[0])
  for (const name of CREDIT_SOURCE_NAMES) if (text.includes(name)) found.push(name)
  return found
}
