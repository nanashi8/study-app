import { st } from '../../reading-structures/entry.js'

// 基礎長文の一文の構造台帳。記法・chunks・notes・unitNotes・rules・marks は長文の構造台帳（reading-structures/entry.js）と同じ。
// 語順訳 chunks は必ず書く（自動の解析器は使わない）。
// fragment: 動詞のない文（題名・「Day: Sunday, May 12」のような案内の項目・手紙の書き出しと結び）。文型を出さない
export const bs = (markup, options = {}) => Object.freeze({
  ...st(markup, options),
  fragment: Boolean(options.fragment),
})
