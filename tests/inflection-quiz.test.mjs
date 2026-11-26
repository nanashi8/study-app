// 文法の「語形変化」：3級以下の語と準2級以上の不規則動詞の全部の形が、約5語の活用表のマスにあり、
// 出題のたびに3か所を空所にして、入れる語のタイルを作ること。誤りのタイルは正しくない形だけで、説明がそろうこと。
// 級別では5級の前、単元別では「文の基本と文型」の前にタブがあり、行ごとに学習とテストの入口があること。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { INFLECTION_REAL_WORD_MISTAKES } from '../src/data/inflection-quiz-real-words.js'
import { getGrammar } from '../src/data/grammar.js'
import { parseInflection } from '../src/lib/wordInflections.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import {
  INFLECTION_BLANKS,
  INFLECTION_GROUPS,
  INFLECTION_LEVEL_ROWS,
  INFLECTION_SCOPE_LEVELS,
  inflectionBlankNote,
  inflectionCandidates,
  inflectionCellCount,
  inflectionMistakeCandidates,
  inflectionQuestions,
  inflectionRound,
  inflectionStudyRows,
} from '../src/lib/inflectionQuiz.js'
import { buildEnglishWordSet, ENGLISH_WORD_LIST_FILES } from '../src/lib/englishWordList.js'

const require = createRequire(import.meta.url)
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
const seeded = (seed) => () => {
  seed = (seed * 9301 + 49297) % 233280
  return seed / 233280
}

/** 台帳から数え直した範囲：3級以下の語（品詞の表ごと）と、準2級以上で過去形・過去分詞が不規則な動詞。 */
function population() {
  const regular = (head, form, suffix) => form === `${head}${suffix}` || form === `${head}d` || form === `${head.slice(0, -1)}ied` || form === `${head}${head.at(-1)}${suffix}` || form === `${head}k${suffix}`
  const list = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    const word = byId.get(id)
    for (const group of INFLECTION_GROUPS) {
      const pos = group.pos.find((item) => record[item] && parseInflection(item, record[item], word.word).rows.length)
      if (!pos) continue
      const rows = parseInflection(pos, record[pos], word.word).rows
      const labels = rows.map((row) => row.label)
      const full = group.id === 'verb'
        ? ['3単現', '過去形', '過去分詞', 'ing形'].every((label) => labels.includes(label))
        : group.id === 'noun' ? labels.includes('複数形') : labels.includes('比較級') && labels.includes('最上級')
      const inScope = INFLECTION_SCOPE_LEVELS.includes(word.level)
      const irregular = group.id === 'verb' && full && rows
        .filter((row) => row.label === '過去形' || row.label === '過去分詞')
        .some((row) => !regular(word.word, row.forms[0].text, 'ed'))
      if (inScope || irregular) list.push({ key: `${id}|${group.id}`, full, rows, head: word.word })
    }
  }
  return list
}

test('範囲の語の全部の形が、どれかの表のマスにある（表の形にならない語は理由つきで外す）', () => {
  const tables = inflectionQuestions()
  const cells = new Map()
  for (const table of tables) {
    for (const row of table.rows) for (const cell of row.cells) cells.set(cell.id, cell.answer)
  }
  const missing = []
  const notTable = []
  for (const entry of population()) {
    const [id, group] = entry.key.split('|')
    if (!entry.full) {
      notTable.push(id)
      continue
    }
    const base = INFLECTION_GROUPS.find((item) => item.id === group).base
    if (cells.get(`${id}|${base}`) !== entry.head) missing.push(`${id}|${base}`)
    for (const row of entry.rows) {
      if (!cells.has(`${id}|${row.label}`)) missing.push(`${id}|${row.label}`)
      else if (cells.get(`${id}|${row.label}`) !== row.forms[0].text) missing.push(`${id}|${row.label}（形がちがう）`)
    }
  }
  assert.deepEqual(missing.slice(0, 20), [])
  // 表の列がそろわない語：be（am/are/is）、助動詞（can → could など過去形だけ）、変化形そのものの見出し語（is・better など）は数えない。
  assert.ok(notTable.every((id) => /^(be|can|will|shall|may_2)$/.test(id)), `外した語 ${notTable.join(' ')}`)
  assert.equal(inflectionCellCount(tables), cells.size)
  assert.ok(cells.size >= 6625, `マス ${cells.size}`)
})

test('表は同じ種類・同じ級の3〜7語で、範囲の外の語はない', () => {
  for (const table of inflectionQuestions()) {
    assert.ok(table.rows.length >= 3 && table.rows.length <= 7, `${table.id}: ${table.rows.length}語`)
    for (const row of table.rows) {
      assert.equal(row.group, table.group)
      assert.equal(row.levelKey, table.levelKey)
      assert.equal(row.cells.length, table.columns.length)
      assert.ok(INFLECTION_SCOPE_LEVELS.includes(row.level) || (row.group === 'verb' && row.levelKey === 'irregular'), row.wordId)
    }
  }
  const ids = inflectionQuestions().map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(getGrammar(ids[0])?.id, ids[0], '単語帳・復習から id で引ける')
})

test('出題のたびに3か所を空所にし、タイルは正解3つと正しくない形だけで、どれにも説明がある', () => {
  const problems = []
  for (const table of inflectionQuestions()) {
    for (let k = 0; k < 6; k += 1) {
      const round = inflectionRound(table, seeded(k * 97 + table.id.length))
      const answers = round.answer.split('|')
      if (round.blanks.length !== INFLECTION_BLANKS) problems.push(`${table.id}: 空所 ${round.blanks.length}`)
      if (new Set(round.blanks.map((b) => `${b.r}:${b.c}`)).size !== INFLECTION_BLANKS) problems.push(`${table.id}: 空所の重なり`)
      const bank = [...round.bank]
      for (const answer of answers) {
        const at = bank.indexOf(answer)
        if (at < 0) problems.push(`${table.id}: タイルに ${answer} がない`)
        else bank.splice(at, 1)
      }
      if (round.bank.length < 5) problems.push(`${table.id}: タイル ${round.bank.length}`)
      for (const extra of bank) {
        // 誤りのタイルは、どの空所の語のどの形とも同じつづりにならない（正しい形を誤りとして出さない）。
        for (const blank of round.blanks) {
          const word = byId.get(round.rows[blank.r].wordId)
          const own = Object.entries(WORD_INFLECTIONS[word.id]).flatMap(([pos, value]) =>
            parseInflection(pos, value, word.word).rows.flatMap((row) => row.forms.map((form) => form.text)))
          const cell = round.rows[blank.r].cells[blank.c]
          const valid = cell.kind
            ? parseInflection(round.rows[blank.r].pos, WORD_INFLECTIONS[word.id][round.rows[blank.r].pos], word.word).rows
              .find((row) => row.label === cell.label)?.forms.map((form) => form.text) ?? []
            : [word.word]
          if (valid.includes(extra)) problems.push(`${table.id}: ${extra} は ${word.word} の${cell.label}として正しい`)
          if (!own.includes(extra) && INFLECTION_REAL_WORD_MISTAKES.has(extra.toLowerCase())) problems.push(`${table.id}: ${extra} は辞書にある語`)
        }
        for (const blank of round.blanks) {
          if (!/[ぁ-んァ-ヶ一-龠]/.test(inflectionBlankNote(round, blank, extra))) problems.push(`${table.id}: ${extra} の説明がない`)
        }
      }
      for (const [index, blank] of round.blanks.entries()) {
        const note = inflectionBlankNote(round, blank, answers[index])
        if (!/[ぁ-んァ-ヶ一-龠]/.test(note)) problems.push(`${table.id}: 正解 ${answers[index]} の説明がない`)
      }
    }
  }
  assert.deepEqual(problems.slice(0, 20), [])
})

test('つづりの取り違えの誤りに、辞書にある語（別の語の形・認められる別の形）を使わない', () => {
  const dictionary = buildEnglishWordSet(ENGLISH_WORD_LIST_FILES.map((file) => require(`wordlist-english/${file}`)))
  const candidates = inflectionMistakeCandidates()
  const inDictionary = [...candidates].filter((text) => dictionary.has(text)).sort()
  assert.deepEqual(inDictionary.filter((text) => !INFLECTION_REAL_WORD_MISTAKES.has(text)), [], '台帳にない辞書の語')
  assert.deepEqual([...INFLECTION_REAL_WORD_MISTAKES].filter((text) => !inDictionary.includes(text)), [], '候補でなくなった行')
})

test('テストは易しい級の語から出し、出題の組で空所とタイルを決める', () => {
  const candidates = inflectionCandidates({ type: 'inflection', group: 'verb' }, {})
  assert.ok(candidates.length > 0)
  assert.ok(candidates.every((item) => item.levelKey === '5'), '答えていないうちは5級の語の表だけ')
  const deck = buildGrammarDeck({ type: 'inflection', group: 'verb', questionType: 'choice' }, { srs: {}, size: 10, rng: seeded(3) })
  assert.equal(deck.length, 10)
  assert.ok(deck.every((item) => item.table && item.blanks.length === INFLECTION_BLANKS && item.answer.split('|').length === INFLECTION_BLANKS))
  const irregular = buildGrammarDeck({ type: 'inflection', level: 'irregular', questionType: 'mixed' }, { srs: {}, size: 5, rng: seeded(5) })
  assert.ok(irregular.length > 0 && irregular.every((item) => item.levelKey === 'irregular' && item.group === 'verb'))
  assert.deepEqual(buildGrammarDeck({ type: 'inflection', group: 'verb', questionType: 'order' }, { srs: {}, size: 10 }), [])
})

test('級別は表の種類の行、単元別は級の行に、学習とテストの入口がある（タブは5級・文の基本と文型の前）', () => {
  const screen = read('src/screens/Grammar.jsx')
  assert.match(screen, /const levelTabs = \[INFLECTION_TAB, \.\.\.ACTIVE_LEVELS\.map/)
  assert.match(screen, /const strandTabs = \[INFLECTION_TAB, \.\.\.overviews\.map/)
  assert.match(read('src/data/grammar-strands.js'), /id: 'sentence-basics',\n\s+name: '文の基本と文型'/)
  const division = read('src/components/GrammarInflectionDivision.jsx')
  assert.match(division, /INFLECTION_GROUPS\.map/)
  assert.match(division, /INFLECTION_LEVEL_ROWS\.map/)
  assert.match(division, /onStudy=\{\(\) => onStudy\(row\.params\)\}/)
  assert.match(division, /onQuiz=\{\(\) => onTest\(row\.params, row\.title\)\}/)
  assert.deepEqual(INFLECTION_GROUPS.map((group) => group.id), ['verb', 'noun', 'adjective'])
  assert.deepEqual(INFLECTION_LEVEL_ROWS.map((row) => row.id), ['5', '4', '3', 'irregular'])
  for (const group of INFLECTION_GROUPS) assert.ok(inflectionQuestions().some((table) => table.group === group.id), group.id)
  for (const level of INFLECTION_LEVEL_ROWS) assert.ok(inflectionQuestions().some((table) => table.levelKey === level.id), level.id)
})

test('学習ページは、テストと同じ範囲の全部の語を表の種類・級ごとに並べる', () => {
  const page = read('src/screens/InflectionStudy.jsx')
  assert.match(page, /<RuleList group=\{group\} \/>/)
  assert.match(page, /<InflectionForm /)
  assert.match(page, /<LoadMoreButton /)
  const inTables = (filter) => new Set(inflectionQuestions().filter(filter).flatMap((table) => table.rows.map((row) => `${row.wordId}|${row.group}`)))
  for (const group of INFLECTION_GROUPS) {
    assert.equal(inflectionStudyRows({ group: group.id }).length, inTables((table) => table.group === group.id).size, group.id)
  }
  for (const level of INFLECTION_LEVEL_ROWS) {
    assert.equal(inflectionStudyRows({ level: level.id }).length, inTables((table) => table.levelKey === level.id).size, level.id)
  }
})
