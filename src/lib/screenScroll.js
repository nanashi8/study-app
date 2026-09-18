// 画面のスクロールは AppShell の main（.study-app-content）1つが全画面を通して受け持つ。
// そのままだと、別の画面へ移ると前の画面の位置が残り、画面いっぱいの画面（本文・暗記など）を
// 通ると0に戻る。そこで履歴の1件ごとに「離れたときの位置」を持たせ、戻ったら同じ位置に、
// 新しく開いた画面は先頭から見せる（ストアの navigate・back が頼み、AppShell が置く）。
const SCROLL_AREA = '.study-app-content'
const TOP = Object.freeze({ top: 0 })

let pendingPlace = null
let lastTapTarget = null

// 同じ画面のまま「学ぶ」と「一覧を確認」を切り替えたときも、
// 切り替え先は必ず見出しから読み始められるようにする。
export function scrollScreenToTop() {
  if (typeof document === 'undefined') return
  const scrollArea = document.querySelector(SCROLL_AREA)
  if (scrollArea) scrollArea.scrollTop = 0
}

/**
 * 行を画面の上端から savedTop の高さに置くスクロール位置。itemOffset は一覧の先頭から行の上端まで。
 * 小さい行（見える高さの半分まで）は、上に張り付く見出し（coveredTop）の下に隠さず、下端も画面から
 * はみ出さない範囲へ寄せて、行の全体を見せる。大きい行（開いた説明を含む行など）は、中で押した所が
 * 大きく動かないよう、離れたときの高さのまま置く。
 */
export function placedScrollTop({ itemOffset, itemHeight, viewHeight, coveredTop = 0, savedTop, gap = 12 }) {
  const highest = coveredTop + gap
  const lowest = viewHeight - itemHeight - gap
  const small = itemHeight <= (viewHeight - coveredTop) / 2
  let top = highest
  if (Number.isFinite(savedTop)) {
    top = small ? Math.min(Math.max(savedTop, highest), lowest) : savedTop
  }
  return Math.max(0, Math.round(itemOffset - top))
}

// main の中で最後に押された所。押した行（data-return-row）を、戻ったときの目印にする。
// 行を押してシート（main の外）から移るときも、行を押した記録が残っているので同じ行を使える。
export function noteScreenTap(target) {
  lastTapTarget = target
}

function sameRows(scrollArea, id) {
  return [...scrollArea.querySelectorAll('[data-return-row]')]
    .filter((row) => row.getAttribute('data-return-row') === id)
}

// 目印にする行。main で動く行だけを使い（中の欄で動く行は欄ごと戻す）、
// いま画面に見えていない行は使わない（押したあとに遠くへ動かした位置を崩さないため）。
function tappedRow(scrollArea) {
  const row = lastTapTarget?.closest?.('[data-return-row]')
  if (!row || !scrollArea.contains(row) || row.parentElement?.closest('[data-return-scroll]')) return null
  const area = scrollArea.getBoundingClientRect()
  const rect = row.getBoundingClientRect()
  return rect.bottom > area.top && rect.top < area.bottom ? row : null
}

function stickyHeaderHeight(scrollArea) {
  const header = scrollArea.querySelector('header')
  if (!header || getComputedStyle(header).position !== 'sticky') return 0
  return header.offsetHeight
}

/**
 * いまの画面を離れる直前の位置。履歴に積み、戻ったときに同じ位置へ置く。
 * top は main の位置、row は押した行が画面のどの高さにあったか、
 * areas は画面の中で自分でスクロールする欄（data-return-scroll）の位置。
 */
export function captureScreenPlace() {
  if (typeof document === 'undefined') return null
  const scrollArea = document.querySelector(SCROLL_AREA)
  if (!scrollArea) return null
  const place = { top: Math.round(scrollArea.scrollTop) }
  const row = tappedRow(scrollArea)
  if (row) {
    const id = row.getAttribute('data-return-row')
    place.row = {
      id,
      nth: sameRows(scrollArea, id).indexOf(row),
      top: Math.round(row.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top),
    }
  }
  const areas = {}
  for (const area of scrollArea.querySelectorAll('[data-return-scroll]')) {
    areas[area.getAttribute('data-return-scroll')] = Math.round(area.scrollTop)
  }
  if (Object.keys(areas).length) place.areas = areas
  return place
}

/** 次に描く画面の位置を頼む。place が無ければ（新しく開いた画面は）先頭から。 */
export function requestScreenPlace(place) {
  pendingPlace = place ?? TOP
}

/** 頼まれている位置（テストで確かめる用）。 */
export function requestedScreenPlace() {
  return pendingPlace
}

/** 画面を描いた直後に、頼まれた位置へ置く。AppShell が画面を移るたびに呼ぶ。 */
export function applyRequestedScreenPlace(scrollArea) {
  const place = pendingPlace
  pendingPlace = null
  if (!place || !scrollArea) return
  for (const [name, top] of Object.entries(place.areas ?? {})) {
    const area = [...scrollArea.querySelectorAll('[data-return-scroll]')]
      .find((candidate) => candidate.getAttribute('data-return-scroll') === name)
    if (area) area.scrollTop = top
  }
  const row = place.row && sameRows(scrollArea, place.row.id)[place.row.nth]
  if (!row) {
    scrollArea.scrollTop = place.top ?? 0
    return
  }
  const areaTop = scrollArea.getBoundingClientRect().top
  scrollArea.scrollTop = placedScrollTop({
    itemOffset: row.getBoundingClientRect().top - areaTop + scrollArea.scrollTop,
    itemHeight: row.offsetHeight,
    viewHeight: scrollArea.clientHeight,
    coveredTop: stickyHeaderHeight(scrollArea),
    savedTop: place.row.top,
  })
}
