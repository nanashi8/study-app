import { st } from '../reading-structures/entry.js'

// 名作（英語）の一文の構造台帳。本文の順に並べ、並べた文をつなぐと作品の本文と一字一句同じになる。
// markup: 構造の記法（src/lib/reading-sentence-structure.js の先頭。長文の構造台帳と同じ）
// ja: その文の自然な和訳
// p: 段落の始まり（原文の段落どおり）
// part: とても長い1文を、セミコロン・コロン・ダッシュや、会話にはさまる語り（かっこ）・and の前で分けたとき、
//   後ろに同じ文の続きがある部分（分けた位置は画面で説明する。literature-sentences.js の literaturePartBreaks）
// fragment: 動詞のない文（Strange! や “Bingley.” など）。文型を出さず、独立語などの役割だけを示す
// marks: 記号（— ： ；）がこの文で何を表すか。[記号, 説明] の並びで、本文に出る順に書く。
//   記号は '—' '：' ではなく本文の文字（'—' ':' ';'）で書き、挿入をはさむ一対のダッシュは '— —' と書く
// chunks: 語順訳のまとまり。書かなければ朗読の区切り（英語と対応する日本語）をそのまま使う
// notes / unitNotes / rules: 長文の構造台帳と同じ
export const ls = (markup, options = {}) => Object.freeze({
  ...st(markup, options),
  ja: options.ja ?? '',
  p: Boolean(options.p),
  part: Boolean(options.part),
  fragment: Boolean(options.fragment),
  marks: Object.freeze((options.marks ?? []).map(([mark, text]) => Object.freeze({ mark, text }))),
})
