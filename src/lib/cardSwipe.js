export const CARD_SWIPE_MIN_DISTANCE = 52
export const CARD_SWIPE_AXIS_RATIO = 1.2

export function cardSwipeDirection(start, end) {
  const deltaX = Number(end?.x) - Number(start?.x)
  const deltaY = Number(end?.y) - Number(start?.y)
  if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) return null

  const horizontalDistance = Math.abs(deltaX)
  const verticalDistance = Math.abs(deltaY)
  if (
    horizontalDistance < CARD_SWIPE_MIN_DISTANCE
    || horizontalDistance <= verticalDistance * CARD_SWIPE_AXIS_RATIO
  ) {
    return null
  }

  return deltaX < 0 ? 'next' : 'previous'
}

export function cardIndexAfterSwipe(index, total, direction) {
  if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0) return index
  if (direction === 'next') return Math.min(total - 1, index + 1)
  if (direction === 'previous') return Math.max(0, index - 1)
  return index
}
