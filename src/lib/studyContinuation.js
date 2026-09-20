// 暗記を終えたあと「続けて次の◯へ」で出す項目。英単語と同じで、
// ひと続きの学習で答えた項目は一巡するまで出さない。

/**
 * items は全教材共通の出題順（orderForStudy）に並べた教材の項目。
 * doneIds はこの続きで答えた項目のID、size は1回のカード数（0はすべて）。
 */
export function nextStudyItems(items = [], doneIds = [], size = 0) {
  const done = doneIds instanceof Set ? doneIds : new Set(doneIds)
  const remaining = items.filter((item) => item?.id && !done.has(item.id))
  return size > 0 ? remaining.slice(0, size) : remaining
}

/** 続ける行き先の名前。残りが無いときは終わりだと分かる名前にする。 */
export function studyContinueLabel(count, unit) {
  return count > 0 ? `次の${count}${unit}へ` : '学習を終える'
}
