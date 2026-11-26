// 文法の「語形変化」：台帳の問える形すべてに4択（3択以上）の問題があり、正解・誤答・説明が正しく、
// 級別では5級の前、単元別では「文の基本と文型」の前にタブがあり、行ごとに学習とテストの入口があること。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { LEVELS } from '../src/data/levels.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { INFLECTION_REAL_WORD_MISTAKES } from '../src/data/inflection-quiz-real-words.js'
import { getGrammar } from '../src/data/grammar.js'
import { parseInflection } from '../src/lib/wordInflections.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import {
  INFLECTION_KINDS,
  inflectionCandidates,
  inflectionMistakeCandidates,
  inflectionQuestions,
  inflectionStudyRows,
} from '../src/lib/inflectionQuiz.js'
import { buildEnglishWordSet, ENGLISH_WORD_LIST_FILES } from '../src/lib/englishWordList.js'

const require = createRequire(import.meta.url)
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))

/** 台帳の全組のうち問える形（語 × 形の種類。形容詞と副詞で同じ形の語は1つ）。 */
function population() {
  const list = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    for (const kind of INFLECTION_KINDS) {
      const has = kind.pos.some((pos) => record[pos]
        && parseInflection(pos, record[pos], byId.get(id).word).rows.some((row) => row.label === kind.row))
      if (has) list.push(`${id}|${kind.id}`)
    }
  }
  return list
}

test('台帳の問える形すべてに問題がある', () => {
  const have = new Set(inflectionQuestions().map((item) => `${item.wordId}|${item.kind}`))
  const all = population()
  assert.ok(all.length >= 16664, `問える形 ${all.length}`)
  assert.deepEqual(all.filter((key) => !have.has(key)), [], '問題のない形')
  const ids = inflectionQuestions().map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length, 'id の重複')
})

test('正解は台帳の形、誤答はその語のその形として正しくない形で、すべての選択肢に説明がある', () => {
  const problems = []
  for (const item of inflectionQuestions()) {
    const word = byId.get(item.wordId)
    const kind = INFLECTION_KINDS.find((entry) => entry.id === item.kind)
    const entry = parseInflection(item.pos, WORD_INFLECTIONS[item.wordId][item.pos], word.word)
    const valid = entry.rows.find((row) => row.label === kind.row).forms.map((form) => form.text.toLowerCase())
    if (item.answer.toLowerCase() !== valid[0]) problems.push(`${item.id}: 正解 ${item.answer}`)
    if (item.choices.length < 3 || item.choices.length > 4) problems.push(`${item.id}: 選択肢 ${item.choices.length}`)
    if (new Set(item.choices.map((c) => c.toLowerCase())).size !== item.choices.length) problems.push(`${item.id}: 選択肢の重複`)
    for (const choice of item.choices.slice(1)) {
      if (valid.includes(choice.toLowerCase())) problems.push(`${item.id}: 誤答 ${choice} が正しい形`)
    }
    for (const choice of item.choices) {
      const note = item.choiceNotes[choice] ?? ''
      if (!/[ぁ-んァ-ヶ一-龠]/.test(note) || !note.includes(choice)) {
        // 説明はその選択肢の語を名指しするか、その形の作り方を書く。
        if (!/[ぁ-んァ-ヶ一-龠]/.test(note)) problems.push(`${item.id}: ${choice} の説明がない`)
      }
    }
    if (!item.ruleExplanation.includes(item.answer)) problems.push(`${item.id}: 解説に正解の語がない`)
    if (!item.sentence?.en || !item.sentence?.ja) problems.push(`${item.id}: 例の欄がない`)
  }
  assert.deepEqual(problems.slice(0, 20), [])
})

test('つづりの取り違えの誤答に、辞書にある語（別の語の形・認められる別の形）を使わない', () => {
  const dictionary = buildEnglishWordSet(ENGLISH_WORD_LIST_FILES.map((file) => require(`wordlist-english/${file}`)))
  const candidates = inflectionMistakeCandidates()
  const inDictionary = [...candidates].filter((text) => dictionary.has(text)).sort()
  // 台帳 inflection-quiz-real-words.js が、候補のうち辞書にある語をちょうどおおう。
  assert.deepEqual(inDictionary.filter((text) => !INFLECTION_REAL_WORD_MISTAKES.has(text)), [], '台帳にない辞書の語')
  assert.deepEqual([...INFLECTION_REAL_WORD_MISTAKES].filter((text) => !inDictionary.includes(text)), [], '候補でなくなった行')
  // 誤答のうち、その語の原形・ほかの形（gone・book など）でないものが、つづりの取り違え。
  for (const item of inflectionQuestions()) {
    const word = byId.get(item.wordId)
    const own = new Set([word.word.toLowerCase()])
    for (const [pos, value] of Object.entries(WORD_INFLECTIONS[item.wordId])) {
      for (const row of parseInflection(pos, value, word.word).rows) for (const form of row.forms) own.add(form.text.toLowerCase())
    }
    for (const choice of item.choices.slice(1)) {
      if (own.has(choice.toLowerCase())) continue
      assert.ok(!INFLECTION_REAL_WORD_MISTAKES.has(choice.toLowerCase()), `${item.id}: ${choice}`)
    }
  }
})

test('答えを取り違えやすい語の問題', () => {
  const q = (id) => inflectionQuestions().find((item) => item.id === id)
  assert.equal(q('gr_infl_past_go').answer, 'went')
  assert.ok(q('gr_infl_past_go').choices.includes('goed'))
  assert.equal(q('gr_infl_plural_child').answer, 'children')
  assert.ok(!q('gr_infl_plural_volcano').choices.includes('volcanos'), 'volcanos は認められる形')
  assert.ok(!q('gr_infl_comparative_pleasant').choices.includes('pleasanter'), 'pleasanter は認められる形')
  assert.equal(q('gr_infl_past_read').speech, false)
  assert.match(q('gr_infl_past_read').ruleExplanation, /\/ˈɹɛd\//)
  assert.equal(q('gr_infl_comparative_beautiful').answer, 'more beautiful')
  assert.equal(getGrammar('gr_infl_past_go')?.answer, 'went', '単語帳・復習から id で引ける')
})

test('テストは易しい級の語から出す', () => {
  const candidates = inflectionCandidates({ type: 'inflection', kind: 'past' }, {})
  assert.ok(candidates.length > 0)
  assert.ok(candidates.every((item) => item.level === LEVELS[0].id), '答えていないうちは最も易しい級だけ')
  const deck = buildGrammarDeck({ type: 'inflection', kind: 'past', questionType: 'choice' }, { srs: {}, size: 10 })
  assert.equal(deck.length, 10)
  assert.ok(deck.every((item) => item.kind === 'past' && item.level === LEVELS[0].id))
  const byLevel = buildGrammarDeck({ type: 'inflection', level: '3', questionType: 'mixed' }, { srs: {}, size: 10 })
  assert.ok(byLevel.every((item) => item.level === '3'))
  assert.deepEqual(buildGrammarDeck({ type: 'inflection', kind: 'past', questionType: 'order' }, { srs: {}, size: 10 }), [])
})

test('級別では5級の前、単元別では「文の基本と文型」の前に「語形変化」のタブがあり、行ごとに学習とテストの入口がある', () => {
  const screen = read('src/screens/Grammar.jsx')
  assert.match(screen, /const levelTabs = \[INFLECTION_TAB, \.\.\.ACTIVE_LEVELS\.map/)
  assert.match(screen, /const strandTabs = \[INFLECTION_TAB, \.\.\.overviews\.map/)
  assert.match(read('src/data/grammar-strands.js'), /id: 'sentence-basics',\n\s+name: '文の基本と文型'/)
  assert.match(screen, /<GrammarInflectionDivision\s+by=\{division === 'level' \? 'kind' : 'level'\}/)
  const division = read('src/components/GrammarInflectionDivision.jsx')
  assert.match(division, /INFLECTION_KINDS\.map/)
  assert.match(division, /LEVELS\.map/)
  assert.match(division, /onStudy=\{\(\) => onStudy\(row\.params\)\}/)
  assert.match(division, /onQuiz=\{\(\) => onTest\(row\.params, row\.title\)\}/)
})

test('学習ページは、形の作り方と、その行の全部の語の形を発音ボタンつきで並べる', () => {
  const app = read('src/App.jsx')
  assert.match(app, /inflectionStudy: InflectionStudyScreen/)
  const page = read('src/screens/InflectionStudy.jsx')
  assert.match(page, /<RuleList kind=\{kind\} \/>/)
  assert.match(page, /<InflectionForm /)
  assert.match(page, /<LoadMoreButton /)
  // 行ごとの全部の語：形の種類の行は問題の語と同じ数、級の行はその級の語を全部。
  for (const kind of INFLECTION_KINDS) {
    const words = new Set(inflectionQuestions().filter((item) => item.kind === kind.id).map((item) => `${item.wordId}|${item.pos}`))
    assert.equal(inflectionStudyRows({ kind: kind.id }).length, words.size, kind.id)
  }
  for (const level of LEVELS) {
    const words = new Set(inflectionQuestions().filter((item) => item.level === level.id).map((item) => `${item.wordId}|${item.pos}`))
    assert.equal(inflectionStudyRows({ level: level.id }).length, words.size, level.id)
  }
})
