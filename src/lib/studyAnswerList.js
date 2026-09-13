// 暗記カードを全部終えたあと「一覧で確認」で見せる、今回の「覚えた」「まだ」。
// 画面は答えるたびに { item, remembered } を足していくだけにして、分け方はここに1つだけ置く。

/**
 * 答えの記録を「まだ」と「覚えた」に分ける。前へ戻って選び直した項目は最後の答えで分け、
 * 並びは最初に答えた順のまま。item.id の無い記録は数えない。
 */
export function studyAnswerGroups(entries = []) {
  const latest = new Map()
  for (const entry of Array.isArray(entries) ? entries : []) {
    const id = entry?.item?.id
    if (id == null) continue
    latest.set(id, { item: entry.item, remembered: Boolean(entry.remembered) })
  }
  const rows = [...latest.values()]
  return {
    forgot: rows.filter((row) => !row.remembered).map((row) => row.item),
    remembered: rows.filter((row) => row.remembered).map((row) => row.item),
  }
}
