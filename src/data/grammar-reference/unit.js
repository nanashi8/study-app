// 文法の参考書の1単元（英検の級×単元）。書くときは短い形で書き、ここで画面が読む形にそろえる。
//
//   key      : ID の一部（gref_<級>_<key>）。読んだ記録に使うので、一度決めたら変えない
//   level    : 英検の級（grammar.js の level）
//   topic    : grammar.js の topic と完全に一致させる（その単元のテストへつなぐ）
//   title    : ページの題
//   lead     : ここで学ぶこと（1〜2文）
//   forms    : 基本の形 [ラベル, 形, 英文, 和訳, gloss?]
//   points   : ポイント { title, text: [段落], table?: [[見出し...], [行...]...], examples?: [[英文, 和訳, gloss?]] }
//   rewrites : 言いかえ [[もとの文, 言いかえた文, 説明]]（入試の書き換えで問われる組）
//   mistakes : 間違えやすいところ [[×の文, ○の文, 理由]]
//   advanced : 発展 { level, title, text: [段落], table?, examples? }（上の級で出る内容）
//   check    : テスト前のチェック [文]
//
// gloss は例文の中で辞書どおりに引くと意味がずれる語だけに書く（{ 語: '意味' } または { 語: ['見出し語ID', '意味'] }）。

const example = ([en, ja, gloss = null]) => Object.freeze({ en, ja, gloss })

const table = (rows) => (rows?.length
  ? Object.freeze({ head: Object.freeze(rows[0]), rows: Object.freeze(rows.slice(1).map((row) => Object.freeze(row))) })
  : null)

const block = ({ title, text = [], table: rows = null, examples = [], level = null }) => Object.freeze({
  title,
  text: Object.freeze(text),
  table: table(rows),
  examples: Object.freeze(examples.map(example)),
  level,
})

export function referenceUnit(unit) {
  return Object.freeze({
    id: `gref_${unit.level}_${unit.key}`,
    key: unit.key,
    level: unit.level,
    topic: unit.topic,
    title: unit.title,
    lead: unit.lead,
    forms: Object.freeze((unit.forms ?? []).map(([label, form, en, ja, gloss = null]) => Object.freeze({
      label,
      form,
      example: en ? example([en, ja, gloss]) : null,
    }))),
    points: Object.freeze(unit.points.map(block)),
    rewrites: Object.freeze((unit.rewrites ?? []).map(([from, to, note]) => Object.freeze({ from, to, note }))),
    mistakes: Object.freeze((unit.mistakes ?? []).map(([wrong, right, why]) => Object.freeze({ wrong, right, why }))),
    advanced: unit.advanced ? block(unit.advanced) : null,
    check: Object.freeze(unit.check ?? []),
  })
}
