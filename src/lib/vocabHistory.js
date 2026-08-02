export const VOCAB_HISTORY_LIMIT = 30

// 辞書の履歴は安定した単語IDだけを保存する。重複や壊れた値を除き、
// 進捗コードやクラウド同期が際限なく大きくならないよう上限を設ける。
export function normalizeVocabHistory(value) {
  if (!Array.isArray(value)) return []

  const seen = new Set()
  const normalized = []
  for (const id of value) {
    if (typeof id !== 'string' || !id || seen.has(id)) continue
    seen.add(id)
    normalized.push(id)
    if (normalized.length >= VOCAB_HISTORY_LIMIT) break
  }
  return normalized
}

// ids は「今回参照・登録した順」。今回分を先頭に置き、既存の重複は後ろから除く。
export function prependVocabHistory(history, ids) {
  const recent = normalizeVocabHistory(ids)
  if (!recent.length) return normalizeVocabHistory(history)

  const recentIds = new Set(recent)
  return normalizeVocabHistory([
    ...recent,
    ...normalizeVocabHistory(history).filter((id) => !recentIds.has(id)),
  ])
}
