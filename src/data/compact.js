// コンパクト語彙形式の展開関数（効率的に語数を増やすための共有ヘルパー・統一フォーマット）。
//   [ word, pos, level, "意味（・区切り）", "英語例文", "和訳", ety?, extra? ]
// ety（7番目）は次のどちらでも可：
//   - 文字列  → etymology.note になる（簡潔な由来）
//   - オブジェクト → そのまま etymology（parts で語根リンクも可）
// extra（8番目）は補助情報のオブジェクト（任意）。1語に全部入りで持たせる：
//   { syn: [{w,m}], ant: [{w,m}], der: [{w,m}], fam: [{w,m}], usage: "使い方", field: "分野", origin: "由来" }
//   syn=類義語 / ant=反対語 / der=派生語 / fam=語族(基語＋関連形, w=英単語, m=主な意味) / usage=使い分け / field=分野。
//   （後方互換：extra が文字列なら etymology.origin として扱う）
// IPA は省略可（npm run phonetics が CMU 辞書から自動補完）。すべての語に語源を付ける方針。
const OPEN_PARENS = new Set(['(', '（'])
const CLOSE_PARENS = new Map([
  [')', '('],
  ['）', '（'],
])

// 「・」は語義の区切りにも、括弧内の列挙にも使われる。
// 括弧内では分割せず、クイズの選択肢に「(王位」のような断片を出さない。
export function splitMeanings(meaning = '') {
  const meanings = []
  let current = ''
  let depth = 0

  for (const char of meaning) {
    if (OPEN_PARENS.has(char)) depth++
    if (char === '・' && depth === 0) {
      if (current.trim()) meanings.push(current.trim())
      current = ''
      continue
    }
    current += char
    if (CLOSE_PARENS.has(char)) depth = Math.max(0, depth - 1)
  }

  if (current.trim()) meanings.push(current.trim())
  return meanings
}

export function hasBalancedParentheses(text = '') {
  const stack = []
  for (const char of text) {
    if (OPEN_PARENS.has(char)) stack.push(char)
    else if (CLOSE_PARENS.has(char) && stack.pop() !== CLOSE_PARENS.get(char)) return false
  }
  return stack.length === 0
}

export function expandCompact([word, pos, level, meaning, en, ja, ety, extra]) {
  const id = word.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  const entry = {
    id,
    word,
    pos,
    level,
    meaning,
    meanings: splitMeanings(meaning),
    example: { en, ja },
  }
  let etymology
  if (ety && typeof ety === 'object') etymology = ety
  else if (ety) etymology = { note: ety }
  // 8番目：補助情報。文字列なら origin（後方互換）。
  if (typeof extra === 'string' && extra) {
    etymology = { ...(etymology ?? {}), origin: extra }
  } else if (extra && typeof extra === 'object') {
    if (extra.origin) etymology = { ...(etymology ?? {}), origin: extra.origin }
    if (extra.syn?.length) entry.synonyms = extra.syn
    if (extra.ant?.length) entry.antonyms = extra.ant
    if (extra.der?.length) entry.derivatives = extra.der
    if (extra.fam?.length) entry.family = extra.fam
    if (extra.usage) entry.usage = extra.usage
    if (extra.field) entry.field = extra.field
  }
  if (etymology) entry.etymology = etymology
  return entry
}
