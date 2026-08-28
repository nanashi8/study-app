// 同じ画面のまま「学ぶ」と「一覧を確認」を切り替えたときも、
// 切り替え先は必ず見出しから読み始められるようにする。
export function scrollScreenToTop() {
  if (typeof document === 'undefined') return
  const scrollArea = document.querySelector('.study-app-content')
  if (scrollArea) scrollArea.scrollTop = 0
}
