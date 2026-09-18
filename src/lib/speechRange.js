// 英単語・熟語・構文の暗記カードで読み上げる範囲。設定に保存する値と、設定画面に出す名前。
// 熟語・構文のカードでは、「単語」を熟語・構文（構文は完成した例文）として読む。
export const SPEECH_RANGES = Object.freeze([
  Object.freeze({ id: 'word', label: '単語のみ' }),
  Object.freeze({ id: 'meaning', label: '単語・意味' }),
  Object.freeze({ id: 'example', label: '単語・意味・例文・例文の意味' }),
])

// 前からの読み上げ（単語だけを読む）と同じにしておく。
export const SPEECH_RANGE_DEFAULT = 'word'

export function normalizeSpeechRange(value) {
  return SPEECH_RANGES.some((range) => range.id === value) ? value : SPEECH_RANGE_DEFAULT
}
