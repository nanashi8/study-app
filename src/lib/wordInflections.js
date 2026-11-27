// 台帳（src/data/word-inflections.js）の1組を、画面に並べる行へ読みほどく。
// 辞書ページ・暗記カードの裏の「変化形」の欄（WordInflections.jsx）と、写真の読み取りの変化形の表（ocrWordForms.js）が使う。
import { WORD_INFLECTIONS } from '../data/word-inflections.js'

const POS_ORDER = ['動', '名', '形', '副']
const VERB_LABELS = ['3単現', '過去形', '過去分詞', 'ing形']

/** 'traveled/英travelled' → [{ text: 'traveled' }, { text: 'travelled', british: true }] */
function parseForms(field) {
  return field.split('/').map((raw) => {
    // = で始まる形はそのままの語（many の比較級 more）。前に more を置く形（more beautiful）と区別する。
    const literal = raw.startsWith('=')
    const text = literal ? raw.slice(1) : raw
    const form = text.startsWith('英') ? { text: text.slice(1), british: true } : { text }
    return literal ? { ...form, literal: true } : form
  })
}

function splitNote(value) {
  const at = value.indexOf('#')
  return at < 0 ? [value, ''] : [value.slice(0, at), value.slice(at + 1)]
}

/**
 * 台帳の1組（品詞 pos の値 value）を読みほどく。head は見出しのつづり（more beautiful を作るのに使う）。
 *   rows: [{ label, forms: [{ text, british? }] }]   形の行（3単現・複数形・比較級など）
 *   status: 形の行のかわりに示す一言（数えない名詞・比較変化しない など）
 *   baseOf: { word, label }  見出し語そのものが別の語の変化形のとき
 *   note: 注意書き
 */
export function parseInflection(pos, value, head) {
  const [body, note] = splitNote(value)
  const entry = { pos, rows: [], status: '', baseOf: null, note }
  if (body.startsWith('of:')) {
    const [, word, label] = body.split(':')
    entry.baseOf = { word, label }
    return entry
  }
  if (pos === '動') {
    if (body === '-') entry.status = '形が変わらない'
    else if (body.startsWith('助:')) entry.rows.push({ label: '過去形', forms: parseForms(body.slice(2)) })
    else {
      const fields = body.split('|')
      fields.forEach((field, i) => {
        const label = i === 0 && head === 'be' ? '現在形' : VERB_LABELS[i]
        entry.rows.push({ label, forms: parseForms(field) })
      })
    }
    return entry
  }
  if (pos === '名') {
    const [kind, plural] = body.split(/:(.*)/s)
    if (kind === 'C' || kind === 'CU') entry.rows.push({ label: '複数形', forms: parseForms(plural) })
    entry.status = {
      C: '',
      CU: '数えない使い方もある',
      U: '数えない名詞（複数形にしない）',
      SG: 'ふつう a・the をつけて単数で使う',
      PL: '複数形で使う・複数扱い',
      P: '固有名詞（複数形にしない）',
    }[kind]
    return entry
  }
  // 形容詞・副詞
  if (body === '-') {
    entry.status = '比較変化しない'
    return entry
  }
  const [comparative, superlative] = body.split('|')
  const periphrastic = (field, adverb) =>
    parseForms(field).map((form) => {
      if (form.literal) return { text: form.text }
      return form.text === adverb ? { ...form, text: `${adverb} ${head}` } : form
    })
  entry.rows.push({ label: '比較級', forms: periphrastic(comparative, 'more') })
  entry.rows.push({ label: '最上級', forms: periphrastic(superlative, 'most') })
  return entry
}

/** 見出し語 word の変化形を、カードの品詞を先に、あとは動・名・形・副の順に並べる。台帳にない語（自作単語など）は []。 */
export function inflectionsForWord(word) {
  const record = word?.id ? WORD_INFLECTIONS[word.id] : null
  if (!record) return []
  const order = [word.pos, ...POS_ORDER.filter((pos) => pos !== word.pos)]
  return order.filter((pos) => record[pos]).map((pos) => parseInflection(pos, record[pos], word.word))
}

/** 台帳の全部の形（写真の読み取りで元の語へ戻すのに使う）。見出し語 id → Set。 */
export function allInflectedForms(id, head) {
  const record = WORD_INFLECTIONS[id]
  const forms = new Set()
  if (!record) return forms
  for (const [pos, value] of Object.entries(record)) {
    for (const row of parseInflection(pos, value, head).rows) {
      for (const form of row.forms) if (!/\s/.test(form.text) || /\s/.test(head)) forms.add(form.text)
    }
  }
  forms.delete(head)
  return forms
}
