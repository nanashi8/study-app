// 訓読文（marked）は、漢字の直後に訓点を次の順で書く。
//   送り仮名（カタカナ）→〈再読文字の二度目の読み〉→ 返り点
//   例: 未ダ〈ズ〉㆑見㆓其ノ人ヲ㆒。 → 未だ其の人を見ず。
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
const SENTENCE_END_SET = new Set(['。', '．', '！', '？'])
const KATAKANA = /^[ァ-ヺー]$/u
const SECOND_READING_OPEN = '〈'
const SECOND_READING_CLOSE = '〉'

export function returnMarkLabel(mark) {
  return RETURN_MARK_META[mark]?.label ?? mark
}

export function returnMarkMeta(mark) {
  return RETURN_MARK_META[mark] ?? null
}

export function isKanbunReturnMark(mark) {
  return RETURN_MARK_SET.has(mark)
}

// 一字の中で訓点が並ぶ段。送り仮名・二度目の読み・返り点の順を崩した書き方は誤りとして残す。
const STAGE = Object.freeze({ character: 0, okurigana: 1, secondReading: 2, marks: 3 })

export function parseKanbunMarkedText(marked = '') {
  const source = `${marked}`
  const chars = [...source]
  const units = []
  const errors = []
  // 訓点を付ける先の字。句読点を挟んだら付け先はない。
  let current = null
  let stage = STAGE.character

  const reject = (type, character, sourceIndex) => {
    errors.push(Object.freeze({ type, character, sourceIndex }))
  }

  for (let sourceIndex = 0; sourceIndex < chars.length; sourceIndex += 1) {
    const character = chars[sourceIndex]

    if (KATAKANA.test(character)) {
      if (!current) {
        reject('unattached-okurigana', character, sourceIndex)
        continue
      }
      if (stage > STAGE.okurigana) {
        reject('okurigana-after-return-mark', character, sourceIndex)
        continue
      }
      current.okurigana += character
      current.sourceText += character
      stage = STAGE.okurigana
      continue
    }

    if (character === SECOND_READING_OPEN) {
      const close = chars.indexOf(SECOND_READING_CLOSE, sourceIndex + 1)
      const reading = close === -1 ? '' : chars.slice(sourceIndex + 1, close).join('')
      if (close === -1 || !reading || ![...reading].every((kana) => KATAKANA.test(kana))) {
        reject('malformed-second-reading', character, sourceIndex)
        continue
      }
      if (!current || current.secondReading || stage > STAGE.okurigana) {
        reject(current ? 'second-reading-out-of-order' : 'unattached-second-reading', character, sourceIndex)
        sourceIndex = close
        continue
      }
      current.secondReading = reading
      current.sourceText += chars.slice(sourceIndex, close + 1).join('')
      stage = STAGE.secondReading
      sourceIndex = close
      continue
    }

    if (RETURN_MARK_SET.has(character)) {
      if (!current) {
        reject('unattached-return-mark', character, sourceIndex)
        continue
      }
      current.marks.push(character)
      current.sourceText += character
      stage = STAGE.marks
      continue
    }

    if (character === SECOND_READING_CLOSE || character === '㆐') {
      // 竪点（熟語へ返るときの記号）はまだ扱わない。使う教材が出たら読み順の規則から足す。
      reject(character === '㆐' ? 'unsupported-linking-mark' : 'unattached-second-reading', character, sourceIndex)
      continue
    }

    const punctuation = PUNCTUATION_SET.has(character) || /\s/u.test(character)
    const unit = {
      type: punctuation ? 'punctuation' : 'character',
      character,
      okurigana: '',
      secondReading: '',
      marks: [],
      sourceText: character,
      sourceIndex,
    }
    units.push(unit)
    current = punctuation ? null : unit
    stage = STAGE.character
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
    okuriganaCount: frozenUnits.filter((unit) => unit.okurigana).length,
    secondReadingCount: frozenUnits.filter((unit) => unit.secondReading).length,
    returnMarkFamilies: Object.freeze([
      ...new Set(frozenUnits.flatMap((unit) => unit.marks.map((item) => RETURN_MARK_META[item].family))),
    ]),
  })
}

const parse = (markedOrParsed) => (
  typeof markedOrParsed === 'string' ? parseKanbunMarkedText(markedOrParsed) : markedOrParsed
)

// 訓点を外した白文。教材では白文と訓読文を並べて見せるので、訓読文ひとつから両方を作る。
export function kanbunPlainText(markedOrParsed) {
  return parse(markedOrParsed).units.map((unit) => unit.character).join('')
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
 * ・再読文字は、その位置で一度目を読み、返り点で戻ったときに二度目を読む
 * order は字を読み終える順（再読文字は二度目の位置）、steps は句読点と再読文字の一度目も含めた読みの流れ。
 * 規則から外れた組み合わせは errors に残すので、教材の検査で落とせる。
 */
export function kanbunReadingOrder(markedOrParsed) {
  const parsed = parse(markedOrParsed)
  const units = parsed.units
  const errors = [...parsed.errors]
  const order = []
  const steps = []
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
    steps.push(Object.freeze({ index, kind: units[index].secondReading ? 'second' : 'read' }))
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
    if (unit.type !== 'character') {
      if (pending.length && SENTENCE_END_SET.has(unit.character)) {
        // 読点をまたいで返ることはあるが、文の終わりをまたいで返る訓読文は無い。
        errors.push(Object.freeze({
          type: 'return-across-sentence-end',
          character: units[pending.at(-1)].character,
          punctuation: unit.character,
        }))
      }
      steps.push(Object.freeze({ index, kind: 'punctuation' }))
      continue
    }
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
    if (holdingMark(unit)) {
      if (unit.secondReading) steps.push(Object.freeze({ index, kind: 'first' }))
      pending.push(index)
    } else {
      if (unit.secondReading) {
        errors.push(Object.freeze({ type: 'second-reading-without-return-mark', character: unit.character }))
      }
      readUnit(index)
    }
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
    steps: Object.freeze(steps),
    text: order.map((index) => units[index].character).join(''),
    errors: Object.freeze(errors),
  })
}

// 再読文字。一度目は副詞として、二度目は返り点で戻って助動詞・動詞として読む。
export const KANBUN_REREAD_CHARACTERS = Object.freeze(new Set(['未', '将', '且', '当', '応', '宜', '須', '猶', '由', '盍']))
// 「於A」「于A」の於・于は読まず、Aの後ろへ助詞「に・より」を送る。
const OBJECT_MARKERS = new Set(['於', '于'])

/**
 * 返り点の書き方で守る決まり。読む順は作れても、訓読文として誤った付け方を拾う。
 * ・すぐ下の字を読んだ直後に戻るときはレ点で書く。その下の字が一二点で遠くから返る字でも同じ
 *   （「為㆓知㆒㆑之」ではなく「為㆑知㆑之」、「欲㆘使㆓人読㆒㆑書㆖」ではなく「欲㆑使㆓人読㆒㆑書」）
 * ・二度目の読みを書けるのは再読文字だけ
 */
export function kanbunNotationIssues(markedOrParsed) {
  const parsed = parse(markedOrParsed)
  const units = parsed.units
  const issues = []
  const { order } = kanbunReadingOrder(parsed)
  for (const [position, index] of order.entries()) {
    const unit = units[index]
    const hold = holdingMark(unit)
    if (!hold || hold === RE_MARK || position === 0) continue
    const next = units[index + 1]
    if (next?.type === 'character' && order[position - 1] === index + 1) {
      issues.push(Object.freeze({
        type: 'adjacent-return-needs-re-mark',
        character: unit.character,
        next: next.character,
        marks: unit.marks.join(''),
      }))
    }
  }
  for (const unit of units) {
    if (unit.secondReading && !KANBUN_REREAD_CHARACTERS.has(unit.character)) {
      issues.push(Object.freeze({ type: 'second-reading-on-non-reread-character', character: unit.character }))
    }
  }
  return Object.freeze(issues)
}

/**
 * 返り点ドリルで字をタップする順。読む順と同じだが、置き字「於・于」だけは
 * 読まない字なので、助詞「に・より」が入る位置（目的語を読み終えた後）でタップする。
 */
export function kanbunTapOrder(markedOrParsed) {
  const parsed = parse(markedOrParsed)
  const units = parsed.units
  const steps = kanbunReadingOrder(parsed).steps.filter((step) => step.kind !== 'punctuation')
  const tap = []
  for (let position = 0; position < steps.length; position += 1) {
    const step = steps[position]
    const unit = units[step.index]
    const silentMarker = OBJECT_MARKERS.has(unit.character) && !unit.okurigana && !unit.marks.length
    if (!silentMarker) {
      tap.push(step)
      continue
    }
    let end = position + 1
    while (end < steps.length && steps[end].index > step.index) end += 1
    tap.push(...steps.slice(position + 1, end), step)
    position = end - 1
  }
  return Object.freeze({
    steps: Object.freeze(tap),
    text: tap.map((step) => units[step.index].character).join(''),
  })
}

// 作品本文の旧字体。書き下し文は新字体で書くので、突き合わせる前にそろえる。
export const KANBUN_OLD_TO_NEW_FORMS = Object.freeze({
  學: '学', 說: '説', 來: '来', 樂: '楽', 溫: '温', 爲: '為', 對: '対', 戰: '戦',
  塡: '填', 步: '歩', 鄰: '隣', 國: '国', 與: '与', 譽: '誉', 陷: '陥', 應: '応', 喻: '喩',
})

export function modernizeKanbunForms(text = '') {
  return [...`${text}`].map((character) => KANBUN_OLD_TO_NEW_FORMS[character] ?? character).join('')
}

export function katakanaToHiragana(text = '') {
  return `${text}`.replace(/[ァ-ヶ]/gu, (kana) => String.fromCharCode(kana.charCodeAt(0) - 0x60))
}

// 書き下し文で平仮名に直す助字。full は送り仮名を付けずに書く読み、stems は送り仮名の前に来る読み。
// 送り仮名は活用する部分を書く（不ル＝ざる、可シ＝べし、可カラ＝べから、使ム＝しむ、見ル＝る、如シ＝ごとし）。
// 可・使・見・如・自などは送り仮名を付けて書く決まりなので、送り仮名が無ければ一致させない。
const KANA_FUNCTION_CHARACTERS = Object.freeze({
  之: Object.freeze({ full: ['の'], stems: [] }),
  不: Object.freeze({ full: ['ず'], stems: ['ざ', 'ず'] }),
  弗: Object.freeze({ full: ['ず'], stems: ['ざ', 'ず'] }),
  可: Object.freeze({ full: [], stems: ['べ'] }),
  使: Object.freeze({ full: [], stems: ['し'] }),
  令: Object.freeze({ full: [], stems: ['し'] }),
  教: Object.freeze({ full: [], stems: ['し'] }),
  遣: Object.freeze({ full: [], stems: ['し'] }),
  見: Object.freeze({ full: [], stems: [''] }),
  被: Object.freeze({ full: [], stems: [''] }),
  為: Object.freeze({ full: [], stems: [''] }),
  如: Object.freeze({ full: [], stems: ['ごと'] }),
  若: Object.freeze({ full: [], stems: ['ごと'] }),
  也: Object.freeze({ full: ['なり', 'や', 'か'], stems: ['な'] }),
  乎: Object.freeze({ full: ['や', 'か', 'かな'], stems: [] }),
  哉: Object.freeze({ full: ['かな', 'や', 'か'], stems: [] }),
  耶: Object.freeze({ full: ['や', 'か'], stems: [] }),
  邪: Object.freeze({ full: ['や', 'か'], stems: [] }),
  歟: Object.freeze({ full: ['や', 'か'], stems: [] }),
  与: Object.freeze({ full: ['と', 'や', 'か'], stems: ['と', 'よ'] }),
  者: Object.freeze({ full: ['は'], stems: [] }),
  耳: Object.freeze({ full: ['のみ'], stems: [] }),
  爾: Object.freeze({ full: ['のみ'], stems: [] }),
  已: Object.freeze({ full: ['のみ'], stems: [] }),
  自: Object.freeze({ full: [], stems: ['よ'] }),
  従: Object.freeze({ full: [], stems: ['よ'] }),
  夫: Object.freeze({ full: ['かな'], stems: [] }),
})
// 置き字。訓点が付かなければ読まない。文末の也も、禁止「無かれ」の後などでは読まない。
const SILENT_CHARACTERS = new Set(['而', '於', '于', '乎', '焉', '矣', '兮', '也'])

const PUNCTUATION_FOR_MATCH = Object.freeze({
  '、': '、', '，': '、', '：': '、', '；': '、',
  '。': '。', '．': '。', '？': '。', '！': '。',
  '「': '「', '」': '」', '『': '『', '』': '』',
})

function normalizeKakikudashi(text) {
  return [...modernizeKanbunForms(text)]
    .filter((character) => !/\s/u.test(character))
    .map((character) => PUNCTUATION_FOR_MATCH[character] ?? character)
    .join('')
}

function stepCandidates(unit, kind) {
  if (kind === 'punctuation') {
    const mark = PUNCTUATION_FOR_MATCH[unit.character] ?? unit.character
    return [/\s/u.test(mark) ? '' : mark]
  }
  if (kind === 'second') return [katakanaToHiragana(unit.secondReading)]
  const character = modernizeKanbunForms(unit.character)
  const okurigana = katakanaToHiragana(unit.okurigana)
  const candidates = new Set([`${character}${okurigana}`])
  if (kind === 'first') return [...candidates]
  const kana = KANA_FUNCTION_CHARACTERS[character]
  if (kana) {
    if (!okurigana) for (const reading of kana.full) candidates.add(reading)
    else for (const stem of kana.stems) candidates.add(`${stem}${okurigana}`)
  }
  if (SILENT_CHARACTERS.has(character) && !okurigana) candidates.add('')
  return [...candidates]
}

/**
 * 訓読文を返り点どおりに読み、送り仮名と二度目の読みをつないだとき、書き下し文と一字残らず一致するか。
 * 助字は漢字のままでも平仮名（之→の、不ル→ざる）でもよく、置き字は読まなくてよい。
 * 送り仮名・返り点・句読点のどれかが抜けていれば、どこかで書き下し文から外れる。
 */
export function kanbunKakikudashiMatch(marked, kakikudashi) {
  const parsed = parseKanbunMarkedText(marked)
  const reading = kanbunReadingOrder(parsed)
  const target = normalizeKakikudashi(kakikudashi)
  if (reading.errors.length) {
    return Object.freeze({ ok: false, reason: 'return-mark-error', errors: reading.errors, target })
  }
  let positions = new Map([[0, null]])
  const trail = []
  let furthest = 0
  for (const step of reading.steps) {
    const unit = parsed.units[step.index]
    const next = new Map()
    for (const position of positions.keys()) {
      for (const candidate of stepCandidates(unit, step.kind)) {
        if (!target.startsWith(candidate, position)) continue
        const end = position + candidate.length
        if (!next.has(end)) next.set(end, { position, candidate })
        furthest = Math.max(furthest, end)
      }
    }
    if (!next.size) {
      return Object.freeze({
        ok: false,
        reason: 'mismatch',
        target,
        matched: target.slice(0, furthest),
        unit: `${unit.character}${unit.okurigana}${unit.secondReading ? `〈${unit.secondReading}〉` : ''}`,
        kind: step.kind,
        candidates: stepCandidates(unit, step.kind),
      })
    }
    trail.push(next)
    positions = next
  }
  if (!positions.has(target.length)) {
    return Object.freeze({
      ok: false,
      reason: 'unread-kakikudashi',
      target,
      matched: target.slice(0, Math.max(...positions.keys())),
    })
  }
  const pieces = []
  let position = target.length
  for (let index = trail.length - 1; index >= 0; index -= 1) {
    const link = trail[index].get(position)
    pieces.unshift(link.candidate)
    position = link.position
  }
  return Object.freeze({ ok: true, reason: 'match', target, pieces: Object.freeze(pieces) })
}
