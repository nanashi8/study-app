// 不規則に変化する語（全級）を型ごとに学ぶ表と、その空所を埋める問題。
// 台帳から数え直した不規則な語が、ちょうど型ごとの表と問題に入り、文法の「語形変化」の両方の区分から入れること。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { parseInflection } from '../src/lib/wordInflections.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import {
  IRREGULAR_CATEGORIES,
  IRREGULAR_GROUP,
  inflectionBlankNote,
  inflectionCandidates,
  inflectionQuestionsFor,
  inflectionRound,
  irregularRows,
} from '../src/lib/inflectionQuiz.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
const seeded = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

/** 台帳から数え直す：決まりどおりに作れない形を持つ語と、その型。 */
function expectedIrregular() {
  const out = new Map()
  // d だけをつけるのは e で終わる語だけ（hear → heard は不規則）。
  const regularVerb = (head, form) => [`${head}ed`, ...(head.endsWith('e') ? [`${head}d`] : []), `${head.slice(0, -1)}ied`, `${head}${head.at(-1)}ed`, `${head}ked`].includes(form)
  const regularPlural = (head, form) => [`${head}s`, `${head}es`, `${head.slice(0, -1)}ies`].includes(form)
  const regularDegree = (head, form, er) => form.startsWith('more ') || form.startsWith('most ')
    || [`${head}${er}`, `${head}${er.slice(1)}`, `${head.slice(0, -1)}i${er}`, `${head.slice(0, -2)}i${er}`, `${head}${head.at(-1)}${er}`].includes(form)
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    const head = byId.get(id).word
    const verb = record.動 && parseInflection('動', record.動, head).rows
    if (verb?.length === 4) {
      const past = verb[1].forms[0].text
      const pp = verb[2].forms[0].text
      if (!regularVerb(head, past) || !regularVerb(head, pp)) {
        const [a, b, c] = [head, past, pp].map((text) => text.toLowerCase())
        out.set(`${id}|verb`, a === b && b === c ? 'verb-aaa' : a === c ? 'verb-aba' : b === c ? 'verb-abb' : 'verb-abc')
      }
    }
    const noun = record.名 && parseInflection('名', record.名, head).rows.find((row) => row.label === '複数形')
    if (noun && !regularPlural(head, noun.forms[0].text)) out.set(`${id}|noun`, 'noun')
    const degreePos = ['形', '副'].find((pos) => record[pos] && parseInflection(pos, record[pos], head).rows.length)
    if (degreePos) {
      const rows = parseInflection(degreePos, record[degreePos], head).rows
      if (!regularDegree(head, rows[0].forms[0].text, 'er') || !regularDegree(head, rows[1].forms[0].text, 'est')) out.set(`${id}|adjective`, 'adjective')
    }
  }
  return out
}

test('台帳の不規則に変化する語が、全級ちょうど型ごとの表に入る', () => {
  const expected = expectedIrregular()
  const actual = new Map(irregularRows().map((row) => [`${row.wordId}|${row.group}`, row.category]))
  const missing = [...expected].filter(([key, category]) => actual.get(key) !== category).map(([key, category]) => `${key} → ${category}（表は ${actual.get(key) ?? 'なし'}）`)
  const extra = [...actual.keys()].filter((key) => !expected.has(key))
  assert.deepEqual(missing.slice(0, 20), [])
  assert.deepEqual(extra, [])
  for (const category of IRREGULAR_CATEGORIES) assert.ok(irregularRows({ category: category.id }).length > 0, category.id)
  // 代表の語が正しい型に入っている。
  const categoryOf = (id) => actual.get(`${id}|verb`) ?? actual.get(`${id}|noun`) ?? actual.get(`${id}|adjective`)
  assert.equal(categoryOf('cut'), 'verb-aaa')
  assert.equal(categoryOf('come'), 'verb-aba')
  assert.equal(categoryOf('buy'), 'verb-abb')
  assert.equal(categoryOf('go'), 'verb-abc')
  assert.equal(categoryOf('child'), 'noun')
  assert.equal(categoryOf('good'), 'adjective')
  assert.equal(categoryOf('many'), 'adjective', 'many → more は前に more を置く形ではない')
  assert.equal(categoryOf('pricey'), undefined, 'pricier は ey → ier の決まりどおり')
})

test('学習の表は、型ごとに全部の語を、動詞は原形・過去形・過去分詞で並べ、形ごとに発音を確かめられる', () => {
  for (const row of irregularRows()) {
    if (row.group === 'verb') assert.deepEqual(row.cells.map((cell) => cell.label), ['原形', '過去形', '過去分詞'], row.wordId)
  }
  const page = read('src/screens/InflectionStudy.jsx')
  assert.match(page, /function IrregularTable\(\{ category \}\)/)
  assert.match(page, /irregularRows\(\{ category: category\.id \}\)/)
  assert.match(page, /<InflectionForm form=\{\{ text: cell\.answer \}\} wordId=\{row\.wordId\} label=\{cell\.label\} \/>/)
})

test('問題は型ごとの約5語の表で、全部の語が入り、空所3か所のタイルと説明がそろう', () => {
  for (const category of IRREGULAR_CATEGORIES) {
    const tables = inflectionQuestionsFor({ group: IRREGULAR_GROUP, level: category.id })
    const words = tables.flatMap((table) => table.rows.map((row) => row.wordId))
    assert.deepEqual(words.sort(), irregularRows({ category: category.id }).map((row) => row.wordId).sort(), category.id)
    for (const table of tables) {
      assert.ok(table.rows.length >= 1 && table.rows.length <= 7, `${table.id}: ${table.rows.length}`)
      for (let k = 0; k < 5; k += 1) {
        const round = inflectionRound(table, seeded(k + 11))
        assert.equal(round.blanks.length, 3)
        for (const answer of round.answer.split('|')) assert.ok(round.bank.includes(answer), `${table.id}: ${answer}`)
        for (const blank of round.blanks) {
          for (const tile of round.bank) assert.match(inflectionBlankNote(round, blank, tile), /[ぁ-んァ-ヶ一-龠]/)
        }
      }
    }
  }
  const deck = buildGrammarDeck({ type: 'inflection', group: IRREGULAR_GROUP, category: 'verb-abc', questionType: 'choice' }, { srs: {}, size: 5, rng: seeded(2) })
  assert.ok(deck.length > 0 && deck.every((item) => item.category === 'verb-abc' && item.blanks.length === 3))
  // 「語形変化」全体のテストには、不規則な語の表を混ぜない（その行から開いたときだけ）。
  assert.ok(inflectionCandidates({ type: 'inflection' }, {}).every((item) => item.group !== IRREGULAR_GROUP))
})

test('級別・単元別の両方の「語形変化」に「不規則に変化する語」の行があり、学習とテストの入口がある', () => {
  const division = read('src/components/GrammarInflectionDivision.jsx')
  assert.match(division, /key: 'irregular-forms',\n\s+title: '不規則に変化する語'/)
  assert.match(division, /params: \{ group: IRREGULAR_GROUP \}/)
  // 行は by の両方（kind・level）で rows の最後に足す。
  assert.ok(division.indexOf("key: 'irregular-forms'") > division.indexOf('INFLECTION_LEVEL_ROWS.map'))
})
