import { createElement } from 'react'
import {
  PARALLEL_STACK_STYLE,
  layoutParallel,
  rowSegments,
  tokenPieces,
} from '../lib/structure-parallel-layout.js'

const GROUP_CLASS = Object.freeze({
  clause: 'text-sky-800',
  phrase: 'text-violet-800',
})

// 並ぶもの（並列）の行。並ぶものごとに左の細い線を引き、折り返した行と次の並ぶものを見分けられるようにする。
// 接続詞だけの行は線を引かずに、同じ位置へそろえる。
export const PARALLEL_LINE_CLASS = Object.freeze({
  item: 'border-l-2 border-slate-300',
  coordinator: 'border-l-2 border-transparent',
})

function renderStructureToken(token, path, depth) {
  if (token.type === 'text') return token.text

  return createElement(
    'span',
    {
      key: path,
      className: GROUP_CLASS[token.kind] ?? '',
      'data-structure-kind': token.kind,
      'data-structure-depth': depth,
    },
    token.open,
    ...token.children.map((child, index) =>
      renderStructureToken(child, `${path}.${index}`, depth + 1)),
    token.close,
  )
}

// 並列の配置（行・そろえ位置）を、括弧の色分けを保ったまま描く。
function renderPieces(pieces, path) {
  return pieces.map((piece, index) => {
    const className = GROUP_CLASS[piece.kind] ?? ''
    return className
      ? createElement('span', { key: `${path}.${index}`, className }, piece.text)
      : piece.text
  })
}

// 並列の枠の手前の語句は、空白ごとに区切って並べる。折り返した最後の行の右に枠が入れば、そこに置く。
function wordClusters(pieces) {
  const clusters = [[]]
  for (const piece of trimSpaces(pieces)) {
    if (piece.type === 'space') clusters.push([])
    else clusters.at(-1).push(piece)
  }
  return clusters.filter((cluster) => cluster.length)
}

function renderParallelRow(row, path) {
  return rowSegments(row).map((segment, index) => {
    const key = `${path}.${index}`
    if (!segment.stack) {
      return createElement('span', { key, className: 'block' }, ...renderPieces(trimSpaces(segment.pieces), key))
    }
    const stack = segment.stack
    return createElement(
      'span',
      { key, className: 'flex flex-wrap items-start', style: { columnGap: '0.3em' } },
      ...wordClusters(segment.pieces).map((cluster, clusterIndex) => createElement(
        'span',
        { key: `w${clusterIndex}`, className: 'whitespace-nowrap' },
        ...renderPieces(cluster, `${key}.w${clusterIndex}`),
      )),
      createElement(
        'span',
        {
          key: 'stack',
          className: 'flex flex-col gap-y-1',
          style: PARALLEL_STACK_STYLE,
          'data-structure-parallel': stack.kind,
        },
        ...stack.lines.map((line, lineIndex) => createElement(
          'span',
          {
            key: `${key}.${lineIndex}`,
            className: `block pl-1.5 ${PARALLEL_LINE_CLASS[line.coordinator ? 'coordinator' : 'item']}`,
            'data-structure-parallel-line': line.coordinator ? 'coordinator' : 'item',
          },
          ...renderParallelRow(line, `${key}.${lineIndex}`),
        )),
      ),
    )
  })
}

function trimSpaces(pieces) {
  let start = 0
  let end = pieces.length
  while (start < end && pieces[start].type === 'space') start++
  while (end > start && pieces[end - 1].type === 'space') end--
  return pieces.slice(start, end)
}

export function StructureDiagram({ tokens = [], parallel = [] }) {
  if (parallel.length) {
    return createElement(
      'span',
      {
        'data-structure-diagram': 'parallel-layout',
        'data-structure-root-count': tokens.length,
        className: 'block',
      },
      ...renderParallelRow(layoutParallel(tokenPieces(tokens), parallel), 'p'),
    )
  }
  return createElement(
    'span',
    {
      'data-structure-diagram': 'nested-markers',
      'data-structure-root-count': tokens.length,
    },
    ...tokens.map((token, index) => renderStructureToken(token, `${index}`, 0)),
  )
}
