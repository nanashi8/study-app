// and・or・but で並ぶもの（並列）を、改行して縦にそろえる配置。
// 2026-09-18 利用者が図で決めた形：
//   接続詞は単独の行に置く。並ぶものは、1つ目の先頭の位置にそろえて縦に並べる。
//   文どうしの並列は左端から行を分ける。並びの後ろに続く語句は、その行の始まりに戻って次の行に置く。
//   ただし節・句の中の並びなら、続きはその節・句の開き括弧の位置にそろえる（2026-09-18 利用者が決定）。
//
//   The students measured the water level
//                and
//                recorded the temperature every week.
//
// 並ぶものの範囲は構造台帳から作る（reading-sentence-structure.js の parallel。本文の語の番号）。
// ここでは括弧つきの英文を語・括弧・記号の小片に分け、並列の範囲で行とそろえ位置の入れ子を組む。

import { STRUCTURE_WORD_SOURCE } from './reading-sentence-structure.js'

const OPENERS = new Set(['(', '<'])
const CLOSERS = new Set([')', '>'])

function otherPieces(text, extra) {
  const pieces = []
  for (const character of text) {
    const type = /\s/.test(character)
      ? 'space'
      : OPENERS.has(character) ? 'open' : CLOSERS.has(character) ? 'close' : 'punct'
    const last = pieces.at(-1)
    if (type === 'space' && last?.type === 'space') {
      last.text += character
      continue
    }
    pieces.push({ ...extra, text: character, type })
  }
  return pieces
}

// 英文を語・空白・括弧・記号の小片に分ける（extra は小片ごとに持たせる情報）。
export function textPieces(text = '', extra = {}) {
  const pieces = []
  let cursor = 0
  for (const match of `${text}`.matchAll(new RegExp(STRUCTURE_WORD_SOURCE, 'g'))) {
    const index = match.index ?? 0
    pieces.push(...otherPieces(text.slice(cursor, index), extra))
    pieces.push({ ...extra, text: match[0], type: 'word' })
    cursor = index + match[0].length
  }
  pieces.push(...otherPieces(text.slice(cursor), extra))
  return pieces
}

// 語の小片に、本文の頭からの語の番号を振る。
export function numberWords(pieces) {
  let word = 0
  return pieces.map((piece) => (piece.type === 'word' ? { ...piece, word: word++ } : piece))
}

// 構造図の括弧の木（parseStructureMarkers の tokens）を小片にする。kind は色分けに使う一番内側の括弧の種類。
export function tokenPieces(tokens = []) {
  const pieces = []
  const walk = (list, kind) => {
    for (const token of list) {
      if (token.type === 'text') {
        pieces.push(...textPieces(token.text, { kind }))
        continue
      }
      pieces.push({ text: token.open, type: 'open', kind: token.kind })
      walk(token.children, token.kind)
      if (token.close) pieces.push({ text: token.close, type: 'close', kind: token.kind })
    }
  }
  walk(tokens, null)
  return numberWords(pieces)
}

// 並列の語の範囲を、小片の範囲に置く。語の直前の開き括弧はその並ぶものの行へ、
// 直後の閉じ括弧・コンマ・句点もその並ぶものの行へ入れる。
function placeGroup(pieces, wordPiece, group) {
  const conjuncts = []
  for (const conjunct of group.conjuncts) {
    const firstWord = conjunct.start + conjunct.lead
    const lastWord = conjunct.end - 1
    if ([conjunct.start, firstWord, lastWord].some((word) => wordPiece[word] === undefined)) return null
    const leadStart = conjunct.lead ? wordPiece[conjunct.start] : null
    let leadEnd = conjunct.lead ? wordPiece[firstWord - 1] + 1 : null
    // and, (when possible) のように接続詞の直後に付くコンマは、接続詞の行に入れる。
    while (leadEnd !== null && pieces[leadEnd]?.type === 'punct') leadEnd++
    let contentStart = wordPiece[firstWord]
    for (let probe = contentStart - 1; probe >= (leadEnd ?? 0); probe--) {
      if (pieces[probe].type === 'open') contentStart = probe
      else if (pieces[probe].type !== 'space') break
    }
    let contentEnd = wordPiece[lastWord] + 1
    while (contentEnd < pieces.length && ['close', 'punct'].includes(pieces[contentEnd].type)) contentEnd++
    conjuncts.push({ leadStart, leadEnd, contentStart, contentEnd })
  }
  if (conjuncts.length < 2) return null
  return {
    kind: group.kind,
    start: conjuncts[0].leadStart ?? conjuncts[0].contentStart,
    end: conjuncts.at(-1).contentEnd,
    conjuncts,
  }
}

function trimRow(items) {
  const isSpace = (item) => item.type === 'space'
  let start = 0
  let end = items.length
  while (start < end && isSpace(items[start])) start++
  while (end > start && isSpace(items[end - 1])) end--
  return items.slice(start, end)
}

// 括弧の組（開き括弧の小片の番号 → 閉じ括弧の小片の番号）。
function bracketPairs(pieces) {
  const pairs = new Map()
  const open = []
  pieces.forEach((piece, index) => {
    if (piece.type === 'open') open.push(index)
    if (piece.type === 'close' && open.length) pairs.set(open.pop(), index)
  })
  return pairs
}

// 並びの後ろの続きが、並びを囲む節・句の中から始まるときの、その一番内側の開き括弧（なければ -1）。
function enclosingBracket(pieces, from, cursor, to, group, pairs) {
  let found = -1
  for (const [open, close] of pairs) {
    if (open <= from || open < cursor || open >= group.start || close < group.end) continue
    const last = Math.min(close, to)
    const continues = pieces.slice(group.end, last).some((piece) => piece.type === 'word' || piece.type === 'open')
    if (continues && open > found) found = open
  }
  return found
}

function layoutRange(pieces, from, to, groups, pairs) {
  const inside = groups.filter((group) => group.start >= from && group.end <= to)
  const outermost = inside
    .filter((group) => !inside.some((other) =>
      other !== group && other.start <= group.start && group.end <= other.end &&
      (other.start !== group.start || other.end !== group.end)))
    .sort((a, b) => a.start - b.start)
  const items = []
  let cursor = from
  for (const group of outermost) {
    if (group.start < cursor) continue
    // 節・句の中の並びは、開き括弧から先を一つの枠にして、続きを開き括弧の位置にそろえる。
    const box = enclosingBracket(pieces, from, cursor, to, group, pairs)
    if (box >= 0) {
      items.push(...pieces.slice(cursor, box))
      items.push({
        type: 'box',
        row: layoutRange(pieces, box, to, inside.filter((other) => other.start >= box), pairs),
      })
      cursor = to
      break
    }
    items.push(...pieces.slice(cursor, group.start))
    const lines = []
    for (const conjunct of group.conjuncts) {
      if (conjunct.leadStart !== null) {
        lines.push({
          type: 'row',
          coordinator: true,
          items: trimRow(pieces.slice(conjunct.leadStart, conjunct.leadEnd)),
        })
      }
      const nested = inside.filter((other) => other !== group &&
        other.start >= conjunct.contentStart && other.end <= conjunct.contentEnd)
      lines.push(layoutRange(pieces, conjunct.contentStart, conjunct.contentEnd, nested, pairs))
    }
    items.push({ type: 'stack', kind: group.kind, lines })
    cursor = group.end
    if (pieces.slice(cursor, to).some((piece) => piece.type === 'word' || piece.type === 'open')) {
      items.push({ type: 'break' })
    }
  }
  items.push(...pieces.slice(cursor, to))
  return { type: 'row', coordinator: false, items: trimRow(items) }
}

// 小片と並列の範囲から、行とそろえ位置の入れ子（row → piece / stack / break）を作る。
export function layoutParallel(pieces = [], groups = []) {
  const wordPiece = []
  pieces.forEach((piece, index) => {
    if (piece.type === 'word') wordPiece[piece.word] = index
  })
  const placed = groups
    .map((group) => placeGroup(pieces, wordPiece, group))
    .filter(Boolean)
  return layoutRange(pieces, 0, pieces.length, placed, bracketPairs(pieces))
}

// 行を、改行（break）で区切った段に分ける。段は「手前の語句」と、その後ろの並列の枠（あれば1つ）。
export function rowSegments(row) {
  const segments = [{ pieces: [], stack: null }]
  for (const item of row.items) {
    if (item.type === 'break') {
      segments.push({ pieces: [], stack: null })
      continue
    }
    const current = segments.at(-1)
    if (item.type === 'stack' || item.type === 'box') {
      if (current.stack) segments.push({ pieces: [], stack: item })
      else current.stack = item
      continue
    }
    if (current.stack) segments.push({ pieces: [item], stack: null })
    else current.pieces.push(item)
  }
  return segments.filter((segment) => segment.stack || segment.pieces.some((piece) => piece.type !== 'space'))
}

// 並列の枠は、手前の語句の右に残りの幅が 12rem 以上あればその右に置き（1つ目の先頭にそろう）、
// なければ次の行の左端から置く。枠の中の行は枠の幅で折り返す。
export const PARALLEL_STACK_STYLE = Object.freeze({ flex: '1 1 12rem', minWidth: 0 })

// 配置に入った小片を順に並べた文字列（空白を除いて元の英文と一致するかの検査に使う）。
export function layoutPlainText(row) {
  return row.items.map((item) => {
    if (item.type === 'stack') return item.lines.map(layoutPlainText).join(' ')
    if (item.type === 'box') return layoutPlainText(item.row)
    if (item.type === 'break') return ' '
    return item.text
  }).join('')
}

// 等幅の文字で配置を確かめるための行の並び（先頭の空白でそろえ位置を示す）。
export function parallelLayoutLines(row) {
  const lines = ['']
  const append = (text) => {
    const current = lines[lines.length - 1]
    lines[lines.length - 1] = current.trim() ? `${current}${text}` : `${current}${text.replace(/^\s+/, '')}`
  }
  const render = (item, indent) => {
    for (const child of item.items) {
      if (child.type === 'break') {
        lines.push(' '.repeat(indent))
        continue
      }
      if (child.type === 'box') {
        let current = lines[lines.length - 1].replace(/\s+$/, '')
        if (current.trim()) current += ' '
        lines[lines.length - 1] = current
        render(child.row, current.length)
        continue
      }
      if (child.type === 'stack') {
        let current = lines[lines.length - 1].replace(/\s+$/, '')
        if (current.trim()) current += ' '
        lines[lines.length - 1] = current
        const column = current.length
        child.lines.forEach((line, index) => {
          if (index > 0) lines.push(' '.repeat(column))
          render(line, column)
        })
        continue
      }
      append(child.text)
    }
  }
  render(row, 0)
  return lines.map((line) => line.replace(/\s+$/, ''))
}
