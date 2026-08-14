const RETURN_MARK_META = Object.freeze({
  'レ': Object.freeze({ name: 'レ点', family: 're' }),
  '一': Object.freeze({ name: '一点', family: 'number' }),
  '二': Object.freeze({ name: '二点', family: 'number' }),
  '三': Object.freeze({ name: '三点', family: 'number' }),
  '四': Object.freeze({ name: '四点', family: 'number' }),
  '上': Object.freeze({ name: '上点', family: 'upper-lower' }),
  '中': Object.freeze({ name: '中点', family: 'upper-lower' }),
  '下': Object.freeze({ name: '下点', family: 'upper-lower' }),
  '甲': Object.freeze({ name: '甲点', family: 'stems' }),
  '乙': Object.freeze({ name: '乙点', family: 'stems' }),
  '丙': Object.freeze({ name: '丙点', family: 'stems' }),
  '丁': Object.freeze({ name: '丁点', family: 'stems' }),
  '天': Object.freeze({ name: '天点', family: 'heaven-earth' }),
  '地': Object.freeze({ name: '地点', family: 'heaven-earth' }),
  '人': Object.freeze({ name: '人点', family: 'heaven-earth' }),
})

const RETURN_MARK_SET = new Set(Object.keys(RETURN_MARK_META))
const PUNCTUATION_SET = new Set(['、', '。', '，', '．', '！', '？', '「', '」', '『', '』'])

// 一・二などは本文の漢数字にもなる。教材中の「如二一見一」のように、
// 二点の直後から「一見」という本文語が始まる場合は、後ろに別の一点が
// 閉じ記号として存在することを確かめて本文の「一」と判定する。
function isLiteralNumeral(chars, index) {
  const current = chars[index]
  const previous = chars[index - 1]
  const next = chars[index + 1]
  if (current !== '一' || previous !== '二' || !next || RETURN_MARK_SET.has(next)) return false
  return chars.slice(index + 2).includes('一')
}

function isReturnMarkAt(chars, index) {
  const character = chars[index]
  if (!RETURN_MARK_SET.has(character) || isLiteralNumeral(chars, index)) return false
  // 「人」「中」は本文にも頻出するため、対応する外枠が実際にある場合だけ返り点とする。
  if (character === '人') return chars.includes('天') && chars.includes('地')
  if (character === '中') return chars.includes('上') && chars.includes('下')
  return true
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
