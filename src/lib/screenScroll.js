// 同じ画面のまま「学ぶ」と「一覧を確認」を切り替えたときも、
// 切り替え先は必ず見出しから読み始められるようにする。
export function scrollScreenToTop() {
  if (typeof document === 'undefined') return
  const scrollArea = document.querySelector('.study-app-content')
  if (scrollArea) scrollArea.scrollTop = 0
}

/**
 * 行を画面の上端から savedTop の高さに置くスクロール位置。
 * itemOffset は一覧の先頭から行の上端まで。上に張り付く見出し（coveredTop）の下に隠さず、
 * 行の下端も画面からはみ出さない範囲へ寄せる。行が画面より高いときは見出しのすぐ下にそろえる。
 */
export function placedScrollTop({ itemOffset, itemHeight, viewHeight, coveredTop = 0, savedTop, gap = 12 }) {
  const highest = coveredTop + gap
  const lowest = Math.max(highest, viewHeight - itemHeight - gap)
  const top = Number.isFinite(savedTop) ? Math.min(Math.max(savedTop, highest), lowest) : highest
  return Math.max(0, Math.round(itemOffset - top))
}

// 一覧から本文などへ移る前に、選んだ行（data 属性 attribute の値が id）が
// 画面の上端から何pxの所にあったかを残す。戻ったら restoreListItemPlace で同じ高さへ置き直す。
export function listItemPlace(screen, attribute, id) {
  const item = screen?.querySelector(`[${attribute}="${id}"]`)
  const scrollArea = item?.closest('.study-app-content')
  const top = scrollArea
    ? Math.round(item.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top)
    : null
  return { id, top }
}

// 残した行を同じ高さへ置き直す。残した行が無い（新しく開いた）ときは、前の画面のスクロールを
// 持ち越さず一覧の先頭から見せる。screen は画面の外枠で、先頭の見出しは上に張り付く。
export function restoreListItemPlace(screen, attribute, place) {
  const scrollArea = screen?.closest('.study-app-content')
  if (!scrollArea) return
  const item = place && screen.querySelector(`[${attribute}="${place.id}"]`)
  if (!item) {
    scrollArea.scrollTop = 0
    return
  }
  const areaTop = scrollArea.getBoundingClientRect().top
  scrollArea.scrollTop = placedScrollTop({
    itemOffset: item.getBoundingClientRect().top - areaTop + scrollArea.scrollTop,
    itemHeight: item.offsetHeight,
    viewHeight: scrollArea.clientHeight,
    coveredTop: screen.querySelector(':scope > header')?.offsetHeight ?? 0,
    savedTop: place.top,
  })
}
