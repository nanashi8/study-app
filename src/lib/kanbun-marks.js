// 返り点は Unicode の漢文用記号で書く。本文の「天下」「其一」と同じ字を使わないので、
// どれが返り点でどれが本文かを推し量る必要がない。label は画面に出す形。
const RETURN_MARK_META = Object.freeze({
  '㆑': Object.freeze({ name: 'レ点', label: 'レ', family: 're', rank: 0 }),
  '㆒': Object.freeze({ name: '一点', label: '一', family: 'number', rank: 0 }),
  '㆓': Object.freeze({ name: '二点', label: '二', family: 'number', rank: 1 }),
  '㆔': Object.freeze({ name: '三点', label: '三', family: 'number', rank: 2 }),
  '㆕': Object.freeze({ name: '四点', label: '四', family: 'number', rank: 3 }),
  '㆖': Object.freeze({ name: '上点', label: '上', family: 'upper-lower', rank: 0 }),
  '㆗': Object.freeze({ name: '中点', label: '中', family: 'upper-lower', rank: 1 }),
  '㆘': Object.freeze({ name: '下点', label: '下', family: 'upper-lower', rank: 2 }),
  '㆙': Object.freeze({ name: '甲点', label: '甲', family: 'stems', rank: 0 }),
  '㆚': Object.freeze({ name: '乙点', label: '乙', family: 'stems', rank: 1 }),
  '㆛': Object.freeze({ name: '丙点', label: '丙', family: 'stems', rank: 2 }),
  '㆜': Object.freeze({ name: '丁点', label: '丁', family: 'stems', rank: 3 }),
  '㆝': Object.freeze({ name: '天点', label: '天', family: 'heaven-earth', rank: 0 }),
  '㆞': Object.freeze({ name: '地点', label: '地', family: 'heaven-earth', rank: 1 }),
  '㆟': Object.freeze({ name: '人点', label: '人', family: 'heaven-earth', rank: 2 }),
})

const RETURN_MARK_SET = new Set(Object.keys(RETURN_MARK_META))
const PUNCTUATION_SET = new Set(['、', '。', '，', '．', '！', '？', '：', '；', '「', '」', '『', '』'])

function isReturnMarkAt(chars, index) {
  // 返り点は必ず親字の後ろに付く。書き出しの一字は本文しかありえない。
  return index > 0 && RETURN_MARK_SET.has(chars[index])
}

export function returnMarkLabel(mark) {
  return RETURN_MARK_META[mark]?.label ?? mark
}

export function returnMarkMeta(mark) {
  return RETURN_MARK_META[mark] ?? null
}

export function isKanbunReturnMark(mark) {
  return RETURN_MARK_SET.has(mark)
}

export function parseKanbunMarkedText(marked = '') {
  const source = `${marked}`
  const chars = [...source]
  const units = []
  const errors = []

  for (const [sourceIndex, character] of chars.entries()) {
    const mark = isReturnMarkAt(chars, sourceIndex)
    if (mark) {
      const parent = [...units].reverse().find((unit) => unit.type === 'character')
      if (!parent) {
        errors.push(Object.freeze({ type: 'unattached-return-mark', mark: character, sourceIndex }))
        continue
      }
      parent.marks.push(character)
      parent.sourceText += character
      continue
    }

    units.push({
      type: PUNCTUATION_SET.has(character) || /\s/u.test(character) ? 'punctuation' : 'character',
      character,
      marks: [],
      sourceText: character,
      sourceIndex,
    })
  }

  const frozenUnits = units.map((unit) => Object.freeze({
    ...unit,
    marks: Object.freeze([...unit.marks]),
  }))
  const reconstructed = frozenUnits.map((unit) => unit.sourceText).join('')
  if (reconstructed !== source) {
    errors.push(Object.freeze({ type: 'source-reconstruction-mismatch', reconstructed }))
  }

  return Object.freeze({
    source,
    units: Object.freeze(frozenUnits),
    errors: Object.freeze(errors),
    characterCount: frozenUnits.filter((unit) => unit.type === 'character').length,
    returnMarkCount: frozenUnits.reduce((count, unit) => count + unit.marks.length, 0),
    returnMarkFamilies: Object.freeze([
      ...new Set(frozenUnits.flatMap((unit) => unit.marks.map((item) => RETURN_MARK_META[item].family))),
    ]),
  })
}

// 返り点を外した白文。教材では白文と訓読文を並べて見せるので、訓読文ひとつから両方を作る。
export function kanbunPlainText(markedOrParsed) {
  const parsed = typeof markedOrParsed === 'string' ? parseKanbunMarkedText(markedOrParsed) : markedOrParsed
  return parsed.units.map((unit) => unit.character).join('')
}

// 同じ字に付く返り点は「レ点 → 一二点 → 上下点 → 甲乙点 → 天地人点」の順で内側から働く。
// 読む位置を決めるのは一番内側の一つだけで、外側の点はその字を読み終えてから発火する。
const RE_MARK = '㆑'

function holdingMark(unit) {
  if (unit.marks.includes(RE_MARK)) return RE_MARK
  return unit.marks.find((mark) => RETURN_MARK_META[mark].rank > 0) ?? null
}

/**
 * 返り点の規則どおりに読む順番を組み立てる。
 * ・レ点が付いた字は、すぐ下の一字（そのまとまり）を読んでから読む
 * ・二・下・乙・地などが付いた字は、同じ系列の内側の点（一・上・甲・天…）を読んでから読む
 * 規則から外れた組み合わせは読み順を作らず errors に残すので、教材の検査で落とせる。
 */
export function kanbunReadingOrder(markedOrParsed) {
  const parsed = typeof markedOrParsed === 'string' ? parseKanbunMarkedText(markedOrParsed) : markedOrParsed
  const units = parsed.units
  const errors = [...parsed.errors]
  const order = []
  const readIndexes = new Set()
  const pending = []
  // 系列ごとに「読み終えたが、まだ外側へ返っていない点」の深さ。
  const armed = new Map()

  const nextCharacterIndex = (index) => {
    for (let i = index + 1; i < units.length; i += 1) {
      if (units[i].type === 'character') return i
    }
    return -1
  }

  const readUnit = (index) => {
    order.push(index)
    readIndexes.add(index)
    for (const mark of units[index].marks) {
      const meta = RETURN_MARK_META[mark]
      if (meta.family === 're') continue
      if (!armed.has(meta.family)) armed.set(meta.family, new Set())
      armed.get(meta.family).add(meta.rank)
    }
  }

  const canRelease = (index) => {
    const unit = units[index]
    const hold = holdingMark(unit)
    if (hold === RE_MARK) {
      const below = nextCharacterIndex(index)
      return below !== -1 && readIndexes.has(below)
    }
    const meta = RETURN_MARK_META[hold]
    const inner = armed.get(meta.family)
    if (!inner) return false
    return [...inner].some((rank) => rank < meta.rank)
  }

  const releasePending = () => {
    while (pending.length) {
      const index = pending.at(-1)
      if (!canRelease(index)) break
      pending.pop()
      const hold = holdingMark(units[index])
      if (hold !== RE_MARK) {
        const meta = RETURN_MARK_META[hold]
        const inner = armed.get(meta.family)
        for (const rank of [...inner]) {
          if (rank < meta.rank) inner.delete(rank)
        }
      }
      readUnit(index)
    }
  }

  for (const [index, unit] of units.entries()) {
    if (unit.type !== 'character') continue
    const anchors = unit.marks.filter((mark) => RETURN_MARK_META[mark].rank > 0)
    if (unit.marks.includes(RE_MARK) && anchors.length) {
      errors.push(Object.freeze({
        type: 'return-mark-conflict',
        character: unit.character,
        marks: unit.marks.join(''),
      }))
    }
    if (anchors.length > 1) {
      errors.push(Object.freeze({
        type: 'multiple-return-anchors',
        character: unit.character,
        marks: unit.marks.join(''),
      }))
    }
    if (holdingMark(unit)) pending.push(index)
    else readUnit(index)
    releasePending()
  }

  for (const index of pending.reverse()) {
    errors.push(Object.freeze({
      type: 'unresolved-return-mark',
      character: units[index].character,
      marks: units[index].marks.join(''),
    }))
  }

  return Object.freeze({
    source: parsed.source,
    order: Object.freeze(order),
    text: order.map((index) => units[index].character).join(''),
    errors: Object.freeze(errors),
  })
}

// 再読文字は一字を二度読むため、読み順と書き下し文をそのまま並べても合わない。照合から外す。
const REREAD_CHARACTERS = new Set(['未', '将', '且', '当', '応', '宜', '須', '猶', '盍', '蓋'])
// 置き字。読まずに助詞や語調へ変わるので、書き下し文には字として現れない。
const UNREAD_CHARACTERS = new Set(['而', '乎', '焉', '矣', '也', '兮'])
// 「於A」「于A」は動詞の後ろにあっても「Aに」と動詞の前へ出る。読む順と書き下しの並びがここだけずれる。
const OBJECT_MARKERS = new Set(['於', '于'])

/**
 * 読み順の漢字と、「於A」の A に当たる字を取り出す。
 * 「於A」は動詞の後ろにあっても書き下しでは動詞の前へ出るので、並びの比較では位置を問わない。
 */
function comparableReading(units, order) {
  const objectPhrase = new Set()
  for (const [position, index] of order.entries()) {
    if (!OBJECT_MARKERS.has(units[index].character)) continue
    for (let next = position + 1; next < order.length; next += 1) {
      if (order[next] < index) break
      objectPhrase.add(order[next])
    }
  }
  const characters = []
  const movable = new Map()
  for (const index of order) {
    const character = units[index].character
    if (!/\p{Script=Han}/u.test(character)) continue
    if (UNREAD_CHARACTERS.has(character) || REREAD_CHARACTERS.has(character)) continue
    if (!OBJECT_MARKERS.has(character)) characters.push(character)
    if (objectPhrase.has(index)) movable.set(character, (movable.get(character) ?? 0) + 1)
  }
  return { characters, movable }
}

/**
 * 訓読文の読み順が書き下し文と矛盾しないかを見る。
 * 助字は書き下しで仮名になるので、書き下しに漢字で残った語が読む順どおりに並ぶかを確かめる。
 */
export function kanbunReadingMatchesKakikudashi(marked, kakikudashi) {
  const reading = kanbunReadingOrder(marked)
  if (reading.errors.length) {
    return Object.freeze({ ok: false, reason: 'return-mark-error', reading, errors: reading.errors })
  }
  const parsed = parseKanbunMarkedText(marked)
  const { characters, movable } = comparableReading(parsed.units, reading.order)
  const remaining = new Map(movable)
  const present = new Set(characters)
  const expected = [...`${kakikudashi}`].filter((character) => /\p{Script=Han}/u.test(character)
    && !UNREAD_CHARACTERS.has(character)
    && !OBJECT_MARKERS.has(character)
    && !REREAD_CHARACTERS.has(character))
  let cursor = 0
  let mismatch = ''
  for (const character of expected) {
    const movableLeft = remaining.get(character) ?? 0
    if (movableLeft > 0) {
      remaining.set(character, movableLeft - 1)
      continue
    }
    const found = characters.indexOf(character, cursor)
    if (found !== -1) {
      cursor = found + 1
      continue
    }
    // 書き下しで補われた字（「所」など）は原文にないので、並びの判定から外す。
    if (!present.has(character)) continue
    mismatch = character
    break
  }
  return Object.freeze({
    ok: !mismatch,
    reason: mismatch ? 'order-mismatch' : 'match',
    reading,
    readingText: characters.join(''),
    kakikudashiText: expected.join(''),
    mismatch,
  })
}

/**
 * 白文のままの並びで書き下し文と合うか。合わないのに返り点が一つも無ければ、付け忘れである。
 */
export function kanbunNeedsReturnMarks(plain, kakikudashi) {
  return !kanbunReadingMatchesKakikudashi(plain, kakikudashi).ok
}
