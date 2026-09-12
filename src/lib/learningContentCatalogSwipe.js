import { cardSwipeDirection } from './cardSwipe.js'

// 一覧の行は、指を動かした向き（右・左）をそのまま操作の名前にする。
export function learningContentCatalogSwipeSide(direction) {
  if (direction === 'previous') return 'right'
  if (direction === 'next') return 'left'
  return null
}

export function learningContentCatalogSwipeAction(start, end) {
  return learningContentCatalogSwipeSide(cardSwipeDirection(start, end))
}
