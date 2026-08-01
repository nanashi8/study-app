const OPEN_MARKERS = Object.freeze({
  '(': Object.freeze({ close: ')', kind: 'clause' }),
  '<': Object.freeze({ close: '>', kind: 'phrase' }),
})

const CLOSE_MARKERS = new Set(Object.values(OPEN_MARKERS).map(({ close }) => close))

export function parseStructureMarkers(marked = '') {
  const tokens = []
  const errors = []
  const stack = [{ children: tokens, expectedClose: '', start: -1 }]
  let text = ''

  const flushText = () => {
    if (!text) return
    stack.at(-1).children.push(Object.freeze({ type: 'text', text }))
    text = ''
  }

  for (const [index, character] of [...`${marked}`].entries()) {
    const opening = OPEN_MARKERS[character]
    if (opening) {
      flushText()
      const group = {
        type: 'group',
        kind: opening.kind,
        open: character,
        close: '',
        children: [],
      }
      stack.at(-1).children.push(group)
      stack.push({
        children: group.children,
        expectedClose: opening.close,
        start: index,
        group,
      })
      continue
    }

    if (CLOSE_MARKERS.has(character)) {
      const current = stack.at(-1)
      if (stack.length > 1 && character === current.expectedClose) {
        flushText()
        current.group.close = character
        Object.freeze(current.group.children)
        Object.freeze(current.group)
        stack.pop()
      } else {
        errors.push(Object.freeze({
          type: 'unexpected-close',
          marker: character,
          index,
        }))
        text += character
      }
      continue
    }

    text += character
  }

  flushText()
  for (const item of stack.slice(1)) {
    errors.push(Object.freeze({
      type: 'unclosed-group',
      marker: item.group.open,
      expectedClose: item.expectedClose,
      index: item.start,
    }))
    Object.freeze(item.group.children)
    Object.freeze(item.group)
  }

  return Object.freeze({
    tokens: Object.freeze(tokens),
    errors: Object.freeze(errors),
  })
}

export function serializeStructureTokens(tokens = []) {
  return tokens.map((token) => {
    if (token.type === 'text') return token.text
    return `${token.open}${serializeStructureTokens(token.children)}${token.close}`
  }).join('')
}

export function structureGroupOutline(tokens = [], depth = 0, parentKind = null) {
  return tokens.flatMap((token) => {
    if (token.type !== 'group') return []
    const text = serializeStructureTokens(token.children)
      .replace(/[()<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return [
      Object.freeze({ kind: token.kind, depth, parentKind, text }),
      ...structureGroupOutline(token.children, depth + 1, token.kind),
    ]
  })
}
