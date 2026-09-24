import { conjugationTable } from './kotenConjugation.js'

// 古典文法の項目が持つ表（koten-grammar-details.js・koten-grammar-more.js の table）を、画面に出す形にする。
//   aux     … 助動詞の活用表（lib/kotenConjugation.js の AUXILIARY_TABLES）
//   conj    … 用言・敬語動詞の活用表（語と活用の種類から組み立てる）
//   columns … 見分け方・用法などの一覧表

/** 文法項目の活用表。活用表を持たない項目は []。 */
export function kotenGrammarConjugationTables(item) {
  const table = item?.table
  if (!table) return []
  const tables = []
  for (const name of table.aux ?? []) {
    const built = conjugationTable(null, { type: `aux:${name}` })
    if (built) tables.push(built)
  }
  for (const spec of table.conj ?? []) {
    const built = conjugationTable(spec.word, spec)
    if (built) tables.push({ ...built, label: `${spec.word}（${built.label}）` })
  }
  return tables
}

/** 見分け方・用法などの一覧表。持たない項目は null。 */
export function kotenGrammarListTable(item) {
  const table = item?.table
  if (!table?.columns?.length || !table?.rows?.length) return null
  return { columns: table.columns, rows: table.rows }
}
