/**
 * 熟語・構文カードの見出し横にある主音声を決める。
 *
 * 熟語・表現は見出しそのものを発音する。構文は A / B / ... / do などの
 * 学習用記号を含むため、自然な完成例文を読み上げる。
 * 例文欄の音声は、この関数とは別に example.en を明示して再生する。
 */
export function phraseSpeechText(item) {
  const phrase = item?.phrase?.trim() ?? ''
  const example = item?.example?.en?.trim() ?? ''
  return item?.kind === 'syntax' ? example || phrase : phrase || example
}
