// 英文をタップ可能な単語トークンに分解する。
// 各トークン： pre(前の記号) / word(語) / post(後の記号) / key(gloss照合用の正規化形)

export const normalizeToken = (t) =>
  (t || '').toLowerCase().replace(/[^a-z0-9'’-]/g, '')

export function tokenize(sentence) {
  const out = []
  for (const chunk of sentence.split(/(\s+)/)) {
    if (chunk === '') continue
    if (/^\s+$/.test(chunk)) {
      out.push({ space: true })
      continue
    }
    // 空白のないダッシュ・疑問符の両側も別々の語として拾う。
    // 例: reefs—commerce / see?—Posted / way—in
    // アポストロフィと通常のハイフンは語の一部として保つ。
    const matches = [...chunk.matchAll(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:-[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*)*/g)]
    if (!matches.length) {
      out.push({ pre: chunk, word: '', post: '', key: '' })
      continue
    }
    for (const [index, match] of matches.entries()) {
      const word = match[0]
      const start = match.index ?? 0
      const end = start + word.length
      const nextStart = matches[index + 1]?.index ?? chunk.length
      out.push({
        pre: index === 0 ? chunk.slice(0, start) : '',
        word,
        post: chunk.slice(end, nextStart),
        key: normalizeToken(word),
      })
    }
  }
  return out
}
