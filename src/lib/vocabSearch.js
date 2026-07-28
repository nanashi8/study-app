const normalize = (value = '') =>
  value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

export function normalizeVocabQuery(value) {
  return normalize(value)
}

function usageGuideText(guides = []) {
  return guides.flatMap((guide) => [
    guide.title,
    guide.summary,
    ...guide.choices.flatMap((choice) => [
      choice.term,
      choice.rule,
      choice.example,
      choice.ja,
    ]),
    guide.preferred?.avoid,
    guide.preferred?.use,
    guide.preferred?.reason,
  ]).filter(Boolean).join(' ')
}

export function vocabSearchText(word) {
  return normalize([
    word.meaning,
    ...(word.meanings ?? []),
    word.field,
    word.usage,
    word.example?.en,
    word.example?.ja,
    ...(word.synonyms ?? []).flatMap((item) => [item.w, item.m]),
    ...(word.antonyms ?? []).flatMap((item) => [item.w, item.m]),
    ...(word.family ?? []).flatMap((item) => [item.w, item.m]),
    usageGuideText(word.usageGuides),
  ].filter(Boolean).join(' '))
}

// 小さいほど上位。見出し語一致を守りつつ、語法・例文・使い分けも検索対象にする。
export function vocabMatchRank(word, rawQuery) {
  const query = normalize(rawQuery)
  if (!query) return -1

  const headword = normalize(word.word)
  if (headword === query) return 0
  if (headword.startsWith(query)) return 1
  if (headword.includes(query)) return 2

  const meanings = normalize([word.meaning, ...(word.meanings ?? [])].join(' '))
  if (meanings.includes(query)) return 3
  if (vocabSearchText(word).includes(query)) return 4
  return -1
}
