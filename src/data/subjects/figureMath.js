// 社会・理科の図が値から描くときの計算。図の部品とテストが同じ式を使う（図の数と本文・問題の数が合うことを確かめるため）。

/** 経度 lon の地点の時刻（時）。基準の地点（経度 baseLon、時刻 baseHour）から、東へ15度ごとに1時間進める。24をこえたら次の日。 */
export const localHour = (baseHour, baseLon, lon) => baseHour + (lon - baseLon) / 15

/** 時刻（時、小数もよい）を、日のずれ（前の日なら-1）と「10時」「9時30分」の文字にする。 */
export function clockOf(hour) {
  const day = Math.floor(hour / 24)
  const h = ((hour % 24) + 24) % 24
  const whole = Math.floor(h)
  const minutes = Math.round((h - whole) * 60)
  return { day, text: `${whole}時${minutes ? `${minutes}分` : ''}` }
}
