// 古文の活用表を、活用の種類と見出し語（歴史的仮名遣い）から組み立てる。
// 古典単語の暗記カード・辞書ページ・古典文法の表が、同じ表をここから描く。
//
// 活用の種類の書き方（単語データの conj）
//   動詞   … '四段' '上一段' '上二段' '下一段' '下二段' 'カ変' 'サ変' 'ナ変' 'ラ変'
//   形容詞 … 'ク' 'シク'
//   形容動詞 … 'ナリ' 'タリ'
//   助動詞 … 'aux:けり' のように AUXILIARY_TABLES の名前
// 活用の種類が2つある語は [{ type: '四段', gloss: '…' }, { type: '下二段', gloss: '…' }] と並べる。
// 行は見出し語の最後の仮名から決める。ア行とワ行のように仮名だけでは決まらない語は { type, row: 'ワ' } と書く。

// 行ごとの5段（ア段・イ段・ウ段・エ段・オ段）
const ROWS = Object.freeze({
  ア: ['あ', 'い', 'う', 'え', 'お'],
  カ: ['か', 'き', 'く', 'け', 'こ'],
  ガ: ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
  サ: ['さ', 'し', 'す', 'せ', 'そ'],
  ザ: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
  タ: ['た', 'ち', 'つ', 'て', 'と'],
  ダ: ['だ', 'ぢ', 'づ', 'で', 'ど'],
  ナ: ['な', 'に', 'ぬ', 'ね', 'の'],
  ハ: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  バ: ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
  マ: ['ま', 'み', 'む', 'め', 'も'],
  ヤ: ['や', 'い', 'ゆ', 'え', 'よ'],
  ラ: ['ら', 'り', 'る', 'れ', 'ろ'],
  ワ: ['わ', 'ゐ', 'う', 'ゑ', 'を'],
})

// ウ段の仮名 → 行（う はア行を既定にし、ワ行の語は row で指定する）
const ROW_OF_U = Object.freeze({
  う: 'ア', く: 'カ', ぐ: 'ガ', す: 'サ', ず: 'ザ', つ: 'タ', づ: 'ダ', ぬ: 'ナ',
  ふ: 'ハ', ぶ: 'バ', む: 'マ', ゆ: 'ヤ', る: 'ラ',
})
// イ段の仮名 → 行（上一段の語幹の最後。い はヤ行の「射る・鋳る」）
const ROW_OF_I = Object.freeze({
  い: 'ヤ', き: 'カ', ぎ: 'ガ', し: 'サ', じ: 'ザ', ち: 'タ', ぢ: 'ダ', に: 'ナ',
  ひ: 'ハ', び: 'バ', み: 'マ', り: 'ラ', ゐ: 'ワ',
})

export const VERB_TYPES = Object.freeze(['四段', '上一段', '上二段', '下一段', '下二段', 'カ変', 'サ変', 'ナ変', 'ラ変'])
export const ADJECTIVE_TYPES = Object.freeze(['ク', 'シク'])
export const ADJECTIVAL_VERB_TYPES = Object.freeze(['ナリ', 'タリ'])

// 助動詞の活用表。空の配列はその活用形がない（表では ○）。（ ）は用法が限られる形。
export const AUXILIARY_TABLES = Object.freeze({
  る: { type: '下二段型', forms: [['れ'], ['れ'], ['る'], ['るる'], ['るれ'], ['れよ']] },
  らる: { type: '下二段型', forms: [['られ'], ['られ'], ['らる'], ['らるる'], ['らるれ'], ['られよ']] },
  す: { type: '下二段型', forms: [['せ'], ['せ'], ['す'], ['する'], ['すれ'], ['せよ']] },
  さす: { type: '下二段型', forms: [['させ'], ['させ'], ['さす'], ['さする'], ['さすれ'], ['させよ']] },
  しむ: { type: '下二段型', forms: [['しめ'], ['しめ'], ['しむ'], ['しむる'], ['しむれ'], ['しめよ']] },
  ず: { type: '特殊型', forms: [['（ず）', 'ざら'], ['ず', 'ざり'], ['ず'], ['ぬ', 'ざる'], ['ね', 'ざれ'], ['ざれ']] },
  じ: { type: '無変化型', forms: [[], [], ['じ'], ['じ'], ['じ'], []] },
  む: { type: '四段型', forms: [['（ま）'], [], ['む'], ['む'], ['め'], []] },
  むず: { type: 'サ変型', forms: [[], [], ['むず'], ['むずる'], ['むずれ'], []] },
  まし: { type: '特殊型', forms: [['（ませ）', 'ましか'], [], ['まし'], ['まし'], ['ましか'], []] },
  まほし: { type: '形容詞型（シク活用）', forms: [['（まほしく）', 'まほしから'], ['まほしく', 'まほしかり'], ['まほし'], ['まほしき', 'まほしかる'], ['まほしけれ'], []] },
  たし: { type: '形容詞型（ク活用）', forms: [['（たく）', 'たから'], ['たく', 'たかり'], ['たし'], ['たき', 'たかる'], ['たけれ'], []] },
  き: { type: '特殊型', forms: [['（せ）'], [], ['き'], ['し'], ['しか'], []] },
  けり: { type: 'ラ変型', forms: [['（けら）'], [], ['けり'], ['ける'], ['けれ'], []] },
  つ: { type: '下二段型', forms: [['て'], ['て'], ['つ'], ['つる'], ['つれ'], ['てよ']] },
  ぬ: { type: 'ナ変型', forms: [['な'], ['に'], ['ぬ'], ['ぬる'], ['ぬれ'], ['ね']] },
  たり: { type: 'ラ変型', forms: [['たら'], ['たり'], ['たり'], ['たる'], ['たれ'], ['たれ']] },
  り: { type: 'ラ変型', forms: [['ら'], ['り'], ['り'], ['る'], ['れ'], ['れ']] },
  けむ: { type: '四段型', forms: [[], [], ['けむ'], ['けむ'], ['けめ'], []] },
  らむ: { type: '四段型', forms: [[], [], ['らむ'], ['らむ'], ['らめ'], []] },
  らし: { type: '無変化型', forms: [[], [], ['らし'], ['らし', '（らしき）'], ['らし'], []] },
  めり: { type: 'ラ変型', forms: [[], ['（めり）'], ['めり'], ['める'], ['めれ'], []] },
  'なり（伝聞・推定）': { type: 'ラ変型', forms: [[], ['（なり）'], ['なり'], ['なる'], ['なれ'], []] },
  べし: { type: '形容詞型（ク活用）', forms: [['（べく）', 'べから'], ['べく', 'べかり'], ['べし'], ['べき', 'べかる'], ['べけれ'], []] },
  まじ: { type: '形容詞型（シク活用）', forms: [['（まじく）', 'まじから'], ['まじく', 'まじかり'], ['まじ'], ['まじき', 'まじかる'], ['まじけれ'], []] },
  'なり（断定）': { type: '形容動詞型', forms: [['なら'], ['なり', 'に'], ['なり'], ['なる'], ['なれ'], ['（なれ）']] },
  'たり（断定）': { type: '形容動詞型', forms: [['たら'], ['たり', 'と'], ['たり'], ['たる'], ['たれ'], ['（たれ）']] },
  ごとし: { type: '形容詞型（ク活用）', forms: [['（ごとく）'], ['ごとく'], ['ごとし'], ['ごとき'], [], []] },
})

const each = (endings) => endings.map((ending) => [ending])

function verbTable(word, type, rowOverride) {
  const last = word.at(-1)
  switch (type) {
    case '四段':
    case '上二段':
    case '下二段': {
      const row = rowOverride ?? ROW_OF_U[last]
      const k = ROWS[row]
      if (!k) return null
      const [a, i, u, e] = k
      const endings = {
        四段: [a, i, u, u, e, e],
        上二段: [i, i, u, `${u}る`, `${u}れ`, `${i}よ`],
        下二段: [e, e, u, `${u}る`, `${u}れ`, `${e}よ`],
      }[type]
      return { stem: word.slice(0, -1), row, endings: each(endings) }
    }
    case '上一段': {
      if (last !== 'る') return null
      const i = word.at(-2)
      const row = rowOverride ?? ROW_OF_I[i]
      if (!row) return null
      return { stem: word.slice(0, -2), row, endings: each([i, i, `${i}る`, `${i}る`, `${i}れ`, `${i}よ`]) }
    }
    case '下一段':
      if (!word.endsWith('ける')) return null
      return { stem: word.slice(0, -2), row: 'カ', endings: each(['け', 'け', 'ける', 'ける', 'けれ', 'けよ']) }
    case 'カ変':
      if (last !== 'く') return null
      return { stem: word.slice(0, -1), row: 'カ', endings: [['こ'], ['き'], ['く'], ['くる'], ['くれ'], ['こ', 'こよ']] }
    case 'サ変':
      if (last === 'す') return { stem: word.slice(0, -1), row: 'サ', endings: each(['せ', 'し', 'す', 'する', 'すれ', 'せよ']) }
      if (last === 'ず') return { stem: word.slice(0, -1), row: 'ザ', endings: each(['ぜ', 'じ', 'ず', 'ずる', 'ずれ', 'ぜよ']) }
      return null
    case 'ナ変':
      if (last !== 'ぬ') return null
      return { stem: word.slice(0, -1), row: 'ナ', endings: each(['な', 'に', 'ぬ', 'ぬる', 'ぬれ', 'ね']) }
    case 'ラ変':
      if (last !== 'り') return null
      return { stem: word.slice(0, -1), row: 'ラ', endings: each(['ら', 'り', 'り', 'る', 'れ', 'れ']) }
    default:
      return null
  }
}

function adjectiveTable(word, type) {
  if (type === 'ク') {
    if (!word.endsWith('し')) return null
    return {
      stem: word.slice(0, -1),
      endings: [['（く）', 'から'], ['く', 'かり'], ['し'], ['き', 'かる'], ['けれ'], ['かれ']],
    }
  }
  if (type === 'シク') {
    // 「いみじ」「すさまじ」のように じ で終わる語は、し の代わりに じ で活用する。
    const s = word.at(-1)
    if (s !== 'し' && s !== 'じ') return null
    return {
      stem: word.slice(0, -1),
      endings: [[`（${s}く）`, `${s}から`], [`${s}く`, `${s}かり`], [s], [`${s}き`, `${s}かる`], [`${s}けれ`], [`${s}かれ`]],
    }
  }
  return null
}

function adjectivalVerbTable(word, type) {
  const tail = type === 'ナリ' ? 'なり' : type === 'タリ' ? 'たり' : null
  if (!tail || !word.endsWith(tail)) return null
  const t = tail[0]
  return {
    stem: word.slice(0, -2),
    endings: [[`${t}ら`], [`${t}り`, t === 'な' ? 'に' : 'と'], [`${t}り`], [`${t}る`], [`${t}れ`], [`${t}れ`]],
  }
}

const TYPE_LABELS = {
  四段: '四段活用', 上一段: '上一段活用', 上二段: '上二段活用', 下一段: '下一段活用', 下二段: '下二段活用',
  カ変: 'カ行変格活用', サ変: 'サ行変格活用', ナ変: 'ナ行変格活用', ラ変: 'ラ行変格活用',
  ク: 'ク活用', シク: 'シク活用', ナリ: 'ナリ活用', タリ: 'タリ活用',
}

/** 活用の種類の書き方を、[{ type, row?, gloss?, word? }] の並びにそろえる。 */
export function conjugationSpecs(conj) {
  if (!conj) return []
  const list = Array.isArray(conj) ? conj : [conj]
  return list.map((entry) => (typeof entry === 'string' ? { type: entry } : { ...entry }))
}

/**
 * 1つの活用の種類から活用表を作る。
 * 返り値: { kind, type, label, row, stem, forms: [[語尾,…]×6], full: [[活用した形,…]×6], gloss }
 * 組み立てられないとき（見出し語と種類が合わないとき）は null。
 */
export function conjugationTable(word, spec) {
  const { type, row: rowOverride, gloss } = spec
  const base = spec.word ?? word
  if (type.startsWith('aux:')) {
    const name = type.slice(4)
    const table = AUXILIARY_TABLES[name]
    if (!table) return null
    return {
      kind: '助動詞',
      type: table.type,
      label: `助動詞「${name.replace(/（.*）$/u, '')}」（${table.type}）`,
      name,
      row: null,
      stem: null,
      forms: table.forms.map((cell) => [...cell]),
      full: table.forms.map((cell) => [...cell]),
      gloss: gloss ?? null,
    }
  }
  let built = null
  let kind = null
  if (VERB_TYPES.includes(type)) {
    built = verbTable(base, type, rowOverride)
    kind = '動詞'
  } else if (ADJECTIVE_TYPES.includes(type)) {
    built = adjectiveTable(base, type)
    kind = '形容詞'
  } else if (ADJECTIVAL_VERB_TYPES.includes(type)) {
    built = adjectivalVerbTable(base, type)
    kind = '形容動詞'
  }
  if (!built) return null
  const rowLabel = built.row ? `${built.row}行` : ''
  let label = `${rowLabel}${TYPE_LABELS[type]}`
  if (type === 'サ変' && built.row === 'ザ') label = 'サ行変格活用（ザ行）'
  if (type === 'カ変' || (type === 'サ変' && built.row === 'サ') || type === 'ナ変' || type === 'ラ変') label = TYPE_LABELS[type]
  const full = built.endings.map((cell) => cell.map((ending) => {
    const bare = ending.replace(/[（）]/gu, '')
    const joined = `${built.stem}${bare}`
    return ending.startsWith('（') ? `（${joined}）` : joined
  }))
  return {
    kind,
    type,
    label,
    row: built.row ?? null,
    stem: built.stem,
    forms: built.endings,
    full,
    gloss: gloss ?? null,
  }
}

/** 単語の conj から、表示する活用表をすべて作る。 */
export function conjugationTablesFor(word) {
  if (!word?.conj) return []
  return conjugationSpecs(word.conj)
    .map((spec) => conjugationTable(spec.word ?? word.word, spec))
    .filter(Boolean)
}

/** 活用表の終止形（丸かっこを外した最初の形）。見出し語と一致するかの確認に使う。 */
export function dictionaryFormOf(table) {
  const cell = table?.full?.[2] ?? []
  return (cell[0] ?? '').replace(/[（）]/gu, '')
}

/** 語幹の表示。語幹と語尾の区別がない語は「（なし）」。助動詞は語幹を持たない。 */
export const stemLabel = (table) => (table?.stem ? table.stem : '（なし）')
