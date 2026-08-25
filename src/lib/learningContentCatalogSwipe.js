import { cardSwipeDirection } from './cardSwipe.js'

export function learningContentCatalogSwipeAction(start, end) {
  const direction = cardSwipeDirection(start, end)
  if (direction === 'previous') return 'right'
  if (direction === 'next') return 'left'
  return null
}
