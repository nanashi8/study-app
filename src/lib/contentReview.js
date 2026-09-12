// 教材ごとの「今日の復習」の見方。単語画面と各コンテンツのトップが、同じ数え方で「今日の学習」を出す。
// srs は教材の復習記録（項目ID → { due, ... }）、day は今日の日番号（todayIndex()）。

/**
 * items のうち、学んだ記録がある項目と、今日が復習日の項目をまとめる。
 * - state: 'due'（今日の復習がある）/ 'complete'（学んだが今日の分はない）/ 'empty'（まだ何も学んでいない）
 * - studiedItems は次の復習日が近い順（復習日より前に練習するときの出題順）
 * - nextInDays は、今日の分がないときの次の復習日までの日数（決まっていなければ Infinity）
 */
export function contentReviewSummary(items = [], srs = {}, day) {
  const dueItems = []
  const studied = []
  let nextDue = Infinity
  for (const item of items) {
    const entry = srs?.[item.id]
    if (!entry) continue
    const due = Number.isFinite(entry.due) ? entry.due : Infinity
    studied.push({ item, due })
    if (due <= day) dueItems.push(item)
    else nextDue = Math.min(nextDue, due)
  }
  studied.sort((left, right) => left.due - right.due)
  return {
    state: dueItems.length ? 'due' : studied.length ? 'complete' : 'empty',
    dueItems,
    studiedItems: studied.map((entry) => entry.item),
    nextInDays: Number.isFinite(nextDue) ? nextDue - day : Infinity,
  }
}

/** 復習の行を押したときに学ぶ項目。今日の復習があればそれを、なければ学んだ項目を復習日が近い順に。 */
export function reviewTargetItems(summary) {
  return summary.state === 'due' ? summary.dueItems : summary.studiedItems
}
