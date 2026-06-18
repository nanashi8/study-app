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
    const m = chunk.match(/^([^A-Za-z0-9'’-]*)([A-Za-z0-9'’-]+)?([^A-Za-z0-9'’-]*)$/)
    if (m && m[2]) {
      out.push({ pre: m[1] || '', word: m[2], post: m[3] || '', key: normalizeToken(m[2]) })
    } else {
      out.push({ pre: chunk, word: '', post: '', key: '' })
    }
  }
  return out
}
