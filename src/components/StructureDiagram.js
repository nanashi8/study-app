import { createElement } from 'react'

const GROUP_CLASS = Object.freeze({
  clause: 'text-sky-800',
  phrase: 'text-violet-800',
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

export function StructureDiagram({ tokens = [] }) {
  return createElement(
    'span',
    {
      'data-structure-diagram': 'nested-markers',
      'data-structure-root-count': tokens.length,
    },
    ...tokens.map((token, index) => renderStructureToken(token, `${index}`, 0)),
  )
}
