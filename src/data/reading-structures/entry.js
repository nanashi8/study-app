// 長文の構造台帳の1文分。
// markup: 構造の記法（src/lib/reading-sentence-structure.js の先頭を参照）
// chunks: 語順訳のまとまりと日本語を、この文だけ明示するときの [英語, 日本語] の並び
// notes: 語順訳のまとまり（英語）ごとの文法メモ
// unitNotes: 節・句のまとまり（英語）ごとの文法メモ
// rules: 一文の読解ルールを手で決めるときの id の並び

export const st = (markup, options = {}) => Object.freeze({
  markup,
  chunks: options.chunks
    ? Object.freeze(options.chunks.map(([en, ja]) => Object.freeze({ en, ja })))
    : null,
  notes: Object.freeze({ ...(options.notes ?? {}) }),
  unitNotes: Object.freeze({ ...(options.unitNotes ?? {}) }),
  // 語の字面だけでは関係の薄いルールが選ばれる文だけ、表示するルールを本文から決めて指定する。
  rules: options.rules ? Object.freeze([...options.rules]) : null,
})
