import { isDue } from '../store/useStore.js'

export const KANBUN_MASTER_BOX = 4

export function kanbunDueItems(items, srs = {}) {
  return items.filter((item) => srs[item.id] && isDue(srs[item.id]))
}

export function kanbunProgress(items, srs = {}) {
  let mastered = 0
  let learning = 0
  let points = 0
  let due = 0
  for (const item of items) {
    const entry = srs[item.id]
    const box = entry?.box ?? 0
    if (box >= KANBUN_MASTER_BOX) mastered += 1
    else if (box > 0) learning += 1
    if (entry && isDue(entry)) due += 1
    points += Math.min(KANBUN_MASTER_BOX, Math.max(0, box))
  }
  return {
    total: items.length,
    mastered,
    learning,
    due,
    ratio: items.length ? points / (items.length * KANBUN_MASTER_BOX) : 0,
  }
}
