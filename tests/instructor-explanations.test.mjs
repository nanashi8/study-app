import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import katex from 'katex'

import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import {
  DICTATION_EXPLANATIONS,
  dictationExplanationFor,
} from '../src/data/dictation-explanations.js'
import {
  GRAMMAR,
  GRAMMAR_PRACTICE,
} from '../src/data/grammar.js'
import { KOTEN_CULTURE_QUESTIONS } from '../src/data/koten-culture.js'
import { KOTEN_CULTURE_CHOICE_NOTES } from '../src/data/koten-culture-choice-notes.js'
import { KOTEN_GRAMMAR_CHOICE_NOTES } from '../src/data/koten-grammar-choice-notes.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import {
  KOTEN_INTERPRETATION_CHOICE_NOTES,
  kotenInterpretationChoiceNoteFor,
} from '../src/data/koten-interpretation-choice-notes.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { LITERATURE_READING_QUESTIONS } from '../src/data/literature-reading.js'
import {
  LITERATURE_READING_CHOICE_NOTES,
  literatureReadingChoiceNoteFor,
} from '../src/data/literature-reading-choice-notes.js'
import { kotenCultureChoiceNoteFor } from '../src/lib/kotenCultureChoiceNotes.js'
import { kotenGrammarChoiceNoteFor } from '../src/lib/kotenGrammarChoiceNotes.js'
import {
  KOTEN_WORDS,
  pickKotenDistractors,
} from '../src/data/koten.js'
import { KANBUN_COLLECTIONS } from '../src/data/kanbun-content.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import {
  LISTENING_CHOICE_NOTES,
  listeningChoiceNoteFor,
} from '../src/data/listening-choice-notes.js'
import { MATH_PROBLEMS } from '../src/data/math.js'
import { MATH_CHOICE_NOTES, mathChoiceNoteFor } from '../src/data/math-choice-notes.js'
import { MATH_FILL_NOTES, mathFillNoteFor } from '../src/data/math-fill-notes.js'
import { PHRASES } from '../src/data/phrases.js'
import {
  ALL_WORDS,
  getEtymologyPack,
  pickDistractors,
} from '../src/data/vocab.js'
import {
  WRITING_EXERCISES,
  getWritingGrammar,
} from '../src/data/writing.js'
import { buildDiagnosticQuestions, diagnosticChoiceNoteFor } from '../src/lib/diagnosticQuestions.js'
import { buildAllEtymologyQuizQuestions } from '../src/lib/etymologyQuiz.js'
import { grammarRuleExplanationFor } from '../src/lib/grammarQuestionExplanations.js'
import { isGenericPhraseNote, isGenericPhraseOrigin } from '../src/lib/phraseNotes.js'
import { pickPhraseDistractors } from '../src/lib/session.js'

const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const deterministicRng = () => 0.3141592653
// scripts/english-content-audit.mjs と同じ決まった順の乱数（出題の組み方を再現する）。
const seededRandom = (seed) => {
  let value = seed >>> 0
  return () => {
    value = (value + 0x6d2b79f5) >>> 0
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}
const diagnosticQuestions = [
  ...DIAGNOSTIC_QUESTIONS,
  ...[1, 2, 3].flatMap((attemptNumber) => buildDiagnosticQuestions({
    attemptNumber,
    seed: 0x1a2b3c4d,
  })),
]
const sameFillAnswer = (fill, selectedValues) => {
  const correct = fill.blanks.map(normalize)
  const selected = selectedValues.map(normalize)
  if (correct.length !== selected.length) return false
  if (fill.unordered) {
    return [...correct].sort().every((value, index) => value === [...selected].sort()[index])
  }
  return correct.every((value, index) => value === selected[index])
}

// 数学の穴埋め。決まり文句の4段解説は置かず、その段の解説と、出したタイル1枚ずつの説明を示す。
// 説明で「正解」とするタイル（空所に入るもの）と、画面の正誤判定がそろっていることも確かめる。
test('数学440穴埋めは、全タイルに式や値に照らした説明があり、正誤判定と一致し、順不同7題は逆順も正答として扱う', () => {
  let fills = 0
  let unordered = 0
  let tiles = 0
  const problems = Object.values(MATH_PROBLEMS).flat()
  for (const problem of problems) {
    for (const [index, step] of problem.steps.entries()) {
      if (!step.fill) continue
      fills += 1
      const key = `${problem.id}:step:${index}`
      assert.ok(normalize(step.note), `math:${key} の解説がありません`)
      assert.equal(sameFillAnswer(step.fill, step.fill.blanks), true, `math:${key} の正答が正答と判定されません`)
      const texts = step.fill.tiles.map((_, tileIndex) => normalize(mathFillNoteFor(key, tileIndex)))
      step.fill.tiles.forEach((tile, tileIndex) => {
        const label = `math:${key}「${tile}」`
        const text = texts[tileIndex]
        assert.ok(text.length >= 5, `${label} の説明がありません`)
        // 画面は $...$ を数式として描くので、閉じていない $ や描けない数式を残さない。
        const segments = text.split('$')
        assert.equal(segments.length % 2, 1, `${label} の説明の $ が閉じていません`)
        segments.forEach((segment, part) => {
          if (part % 2 === 0) return
          assert.doesNotThrow(
            () => katex.renderToString(segment, { throwOnError: true }),
            `${label} の説明の数式「${segment}」が描けません`,
          )
        })
        if (step.fill.blanks.includes(tile)) {
          // 空所が2つある段は、どちらの空所に入るか（順不同ならどちらでもよいこと）を書く。
          if (step.fill.blanks.length > 1) assert.match(text, /①|②/u, `${label} の説明に入る空所がありません`)
        } else {
          // 空所に入らないタイルは、どの空所に入れても正答にならない。
          step.fill.blanks.forEach((_, blankIndex) => {
            const candidate = [...step.fill.blanks]
            candidate[blankIndex] = tile
            assert.equal(sameFillAnswer(step.fill, candidate), false, `${label} を入れても正答になります`)
          })
        }
        tiles += 1
      })
      assert.equal(new Set(texts).size, texts.length, `math:${key} のタイルの説明が重複しています`)
      if (step.fill.unordered) {
        unordered += 1
        assert.equal(sameFillAnswer(step.fill, [...step.fill.blanks].reverse()), true, `math:${key} の順不同判定が不一致です`)
      }
    }
  }
  // 問題やタイルを直したのに、説明だけが古いまま残らないようにする。
  for (const [key, list] of Object.entries(MATH_FILL_NOTES)) {
    const [problemId, , stepIndex] = key.split(':')
    const step = problems.find((problem) => problem.id === problemId)?.steps[Number(stepIndex)]
    assert.ok(step?.fill, `math:${key} は存在しない穴埋めの説明です`)
    assert.equal(list.length, step.fill.tiles.length, `math:${key} の説明の数がタイルの数と違います`)
  }
  assert.equal(fills, 440)
  assert.equal(unordered, 7)
  assert.equal(tiles, 1745)
})

// 長文の内容理解と学習診断の読解は、決まり文句の4段解説をやめ、本文のどの文が根拠かを書いた解説と、
// 出題した選択肢1件ずつの説明を出す（選択肢の説明の中身は tests/reading-question-translations.test.mjs）。
test('長文の内容理解と学習診断の読解は、根拠の解説と選択肢ごとの説明を出し、決まり文句の講師解説を使わない', async () => {
  const read = (relative) => readFile(new URL(`../src/${relative}`, import.meta.url), 'utf8')
  const check = await read('components/ReadingComprehensionCheck.jsx')
  assert.doesNotMatch(check, /InstructorExplanation|instructorExplanations/, 'ReadingComprehensionCheck.jsx: 決まり文句の講師解説が戻っています')
  assert.match(check, /data-reading-explanation[\s\S]*?\{question\.explain\}/, 'ReadingComprehensionCheck.jsx: 根拠の解説がありません')
  assert.match(check, /<ReadingChoiceExplanations\s+passageId=\{passageId\}\s+questionIndex=\{questionIndex\}/)

  const choices = await read('components/ReadingChoiceExplanations.jsx')
  assert.doesNotMatch(choices, /instructorExplanations/)
  assert.match(
    choices,
    /rows=\{question\.choices\.map\(\(choice\) => \(\{[\s\S]*?readingChoiceNoteFor\(passageId, questionIndex, choice\)/,
    'ReadingChoiceExplanations.jsx: 選択肢の欄が、出題した選択肢から作られていません',
  )

  const diagnostic = await read('screens/Diagnostic.jsx')
  assert.doesNotMatch(diagnostic, /InstructorExplanation|instructorExplanations/, 'Diagnostic.jsx: 決まり文句の講師解説が戻っています')
  assert.match(diagnostic, /data-diagnostic-explanation[\s\S]*?\{question\.explain\}/)
})

// 英文法は、決まり文句の4段解説をやめ、規則ごとに書いた解説を出す（形の決まり方と、その文への当てはめ）。
test('英文法4,430問は規則ごとの解説を出し、決まり文句の講師解説を使わない', async () => {
  const source = await readFile(new URL('../src/screens/GrammarQuiz.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /InstructorExplanation/, 'GrammarQuiz.jsx: 決まり文句の講師解説が戻っています')
  assert.match(source, /\{grammarRuleExplanationFor\(item\)\}/, 'GrammarQuiz.jsx: 規則ごとの解説がありません')

  const explanations = new Set()
  for (const item of GRAMMAR_PRACTICE) {
    const value = normalize(grammarRuleExplanationFor(item))
    assert.ok(value.length >= 30, `grammar:${item.id} の解説がありません`)
    assert.doesNotMatch(
      value,
      /英語の手掛かり|適用する規則|したがって、空所は|この条件を満たすのは|正解は一つに決まる/,
      `grammar:${item.id} の解説に決まり文句が残っています`,
    )
    explanations.add(value)
  }
  assert.equal(GRAMMAR_PRACTICE.length, 4430)
  // 規則654件と、形式別の問題105問・単元別の問題875問に1つずつ。別の規則と同じ文を使い回していない。
  assert.equal(explanations.size, 1629)

  // 学習診断の文法問題も、同じ規則の解説を出す。
  const grammarById = new Map(GRAMMAR.map((item) => [item.id, item]))
  const diagnosticGrammar = diagnosticQuestions.filter(({ sourceId }) => sourceId?.startsWith('grammar:'))
  assert.ok(diagnosticGrammar.length > 0)
  for (const question of diagnosticGrammar) {
    const item = grammarById.get(question.sourceId.slice('grammar:'.length))
    assert.equal(question.explain, grammarRuleExplanationFor(item), `diagnostic:${question.id}`)
  }
})

// リスニングも問題形式のテスト。設問の型から作る決まり文句の4段解説は置かず、
// 問題固有の解説と、出題した選択肢すべての説明（和訳と、放送・絵のどこと合うか）を示す。
test('リスニング160問は、教材の全選択肢に放送や絵に照らした説明を示し、決まり文句の講師解説を使わない', async () => {
  const source = await readFile(new URL('../src/screens/ListeningQuiz.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /InstructorExplanation/, 'ListeningQuiz.jsx: 決まり文句の講師解説が戻っています')
  assert.match(source, /\{item\.explain\}/, 'ListeningQuiz.jsx: 問題固有の解説がありません')
  assert.match(source, /<ChoiceExplanations/, 'ListeningQuiz.jsx: 選択肢ごとの欄がありません')
  assert.match(
    source,
    /rows=\{options\.map\(\(choice\) => \(\{[\s\S]*?body: listeningChoiceNoteFor\(item, choice\.id\)/,
    'ListeningQuiz.jsx: 選択肢の欄がボタンと同じ選択肢から作られていません',
  )

  let notes = 0
  for (const item of LISTENING_ITEMS) {
    const texts = item.choices.map((choice) => normalize(listeningChoiceNoteFor(item, choice.id)))
    texts.forEach((text, index) => {
      // 「選択肢の和訳」。放送・絵のどこと合うか（合わないか）、の形。
      assert.match(text, /^「[^」]+」。.{4,}/u, `listening:${item.id}「${item.choices[index].text}」の説明がありません`)
    })
    assert.equal(new Set(texts).size, texts.length, `listening:${item.id} の選択肢の説明が重複しています`)
    notes += texts.length
  }
  // 問題や選択肢を直したのに、説明だけが古いまま残らないようにする。
  for (const [id, notesByChoice] of Object.entries(LISTENING_CHOICE_NOTES)) {
    const item = LISTENING_ITEMS.find((entry) => entry.id === id)
    assert.ok(item, `listening:${id} は存在しない問題の説明です`)
    assert.deepEqual(
      Object.keys(notesByChoice).sort(),
      item.choices.map((choice) => choice.id).sort(),
      `listening:${id} の説明の選択肢が教材と違います`,
    )
  }
  assert.equal(notes, 608)
})

// 数学の選択問題（方針の確認・選択式のステップ）。決まり文句の4段解説は置かず、設問固有の解説と、
// 出した選択肢すべての説明を示す。教材は正解を先頭に書いているので、画面で並びを混ぜる。
test('数学の選択問題299問は、全選択肢に式や値に照らした説明を示し、正解を先頭に固定しない', async () => {
  const source = await readFile(new URL('../src/screens/MathSolve.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /buildMathChoiceInstructorExplanation/, 'MathSolve.jsx: 選択問題に決まり文句の講師解説が戻っています')
  assert.match(
    source,
    /const order = useMemo\(\(\) => shuffle\(q\.choices\.map\(\(_, index\) => index\)\), \[q\]\)/,
    'MathSolve.jsx: 選択肢の並びを混ぜていません',
  )
  assert.match(source, /\{order\.map\(\(idx\) => \{/, 'MathSolve.jsx: 選択肢ボタンが混ぜた並びから作られていません')
  assert.match(source, /<MathText>\{q\.why \?\? q\.note\}<\/MathText>/, 'MathSolve.jsx: 設問固有の解説がありません')
  assert.match(
    source,
    /rows=\{order\.map\(\(idx\) => \(\{[\s\S]*?body: mathChoiceNoteFor\(noteKey, idx\)/,
    'MathSolve.jsx: 選択肢の欄がボタンと同じ並びから作られていません',
  )
  assert.match(source, /noteKey=\{`\$\{p\.id\}:recall`\}/)
  assert.match(source, /noteKey=\{`\$\{p\.id\}:step:\$\{si\}`\}/)

  const questions = Object.values(MATH_PROBLEMS).flat().flatMap((problem) => [
    ...(problem.recall?.quiz ? [{ key: `${problem.id}:recall`, question: problem.recall.quiz }] : []),
    ...problem.steps.flatMap((step, index) => (step.fill ? [] : [{ key: `${problem.id}:step:${index}`, question: step }])),
  ])
  let notes = 0
  for (const { key, question } of questions) {
    assert.ok(normalize(question.why ?? question.note), `math:${key} の解説がありません`)
    const texts = question.choices.map((_, index) => normalize(mathChoiceNoteFor(key, index)))
    texts.forEach((text, index) => {
      assert.ok(text.length >= 5, `math:${key}「${question.choices[index]}」の説明がありません`)
      // 画面は $...$ を数式として描くので、閉じていない $ や描けない数式を残さない。
      const segments = text.split('$')
      assert.equal(segments.length % 2, 1, `math:${key}「${question.choices[index]}」の説明の $ が閉じていません`)
      segments.forEach((segment, part) => {
        if (part % 2 === 0) return
        assert.doesNotThrow(
          () => katex.renderToString(segment, { throwOnError: true }),
          `math:${key} の説明の数式「${segment}」が描けません`,
        )
      })
    })
    assert.equal(new Set(texts).size, texts.length, `math:${key} の選択肢の説明が重複しています`)
    notes += texts.length
  }
  // 設問や選択肢を直したのに、説明だけが古いまま残らないようにする。
  for (const [key, list] of Object.entries(MATH_CHOICE_NOTES)) {
    const entry = questions.find((candidate) => candidate.key === key)
    assert.ok(entry, `math:${key} は存在しない設問の説明です`)
    assert.equal(list.length, entry.question.choices.length, `math:${key} の説明の数が選択肢の数と違います`)
  }
  assert.equal(questions.length, 299)
  assert.equal(notes, 896)
})

// ディクテーション・英作文・数学の解き終わりは、決まり文句の4段解説をやめ、その文・その問題だけの説明を出す。
test('ディクテーション140文は、その文の区切りと文法の要点を解説し、決まり文句の講師解説を使わない', async () => {
  const source = await readFile(new URL('../src/screens/DictationPlay.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /InstructorExplanation/, 'DictationPlay.jsx: 決まり文句の講師解説が戻っています')
  assert.match(source, /\{dictationExplanationFor\(item\)\}/, 'DictationPlay.jsx: 文ごとの解説がありません')

  const englishWords = (text) => (String(text).match(/[A-Za-z][A-Za-z’'-]*/g) ?? []).map((word) => word.toLowerCase())
  const notes = new Set()
  for (const item of DICTATION_ITEMS) {
    const note = normalize(dictationExplanationFor(item))
    assert.ok(note.length >= 40, `dictation:${item.id} の解説がありません`)
    // 解説はその文の英語を引きながら説明する（別の文の解説が入っていない）。
    const sentenceWords = new Set(englishWords(item.text))
    assert.ok(
      englishWords(note).some((word) => word.length > 3 && sentenceWords.has(word)),
      `dictation:${item.id} の解説がこの文を説明していません`,
    )
    assert.ok(!notes.has(note), `dictation:${item.id} の解説が別の文と同じです`)
    notes.add(note)
  }
  for (const id of Object.keys(DICTATION_EXPLANATIONS)) {
    assert.ok(DICTATION_ITEMS.some((item) => item.id === id), `dictation:${id} は存在しない文の解説です`)
  }
  assert.equal(notes.size, 140)
})

test('英作文の答え合わせは、選んだ文のポイントと文法の説明を出し、決まり文句の講師解説を使わない', async () => {
  const source = await readFile(new URL('../src/screens/WritingPlay.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /InstructorExplanation/, 'WritingPlay.jsx: 決まり文句の講師解説が戻っています')
  assert.match(source, /\{selected\.tip\}/, 'WritingPlay.jsx: 選んだ文のポイントがありません')
  assert.match(source, /\{selectedGrammar\.explanation\}/, 'WritingPlay.jsx: 文法の説明がありません')

  const tips = new Set()
  for (const exercise of WRITING_EXERCISES) {
    for (const step of exercise.steps) {
      for (const option of step.options) {
        const label = `writing:${exercise.id}:${step.id}:${option.id}`
        assert.ok(normalize(option.tip).length >= 10, `${label} のポイントがありません`)
        assert.ok(normalize(getWritingGrammar(option.grammarId)?.explanation), `${label} の文法の説明がありません`)
        assert.ok(!tips.has(option.tip), `${label} のポイントが別の文と同じです`)
        tips.add(option.tip)
      }
    }
  }
  assert.equal(tips.size, 330)
})

test('数学の解き終わりは、答えと解き方を1段ずつと、つまずきやすい点を示す', async () => {
  const source = await readFile(new URL('../src/screens/MathSolve.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /buildMathSolvedInstructorExplanation/, 'MathSolve.jsx: 解き終わりに決まり文句の講師解説が戻っています')
  assert.match(source, /data-math-solution/)
  assert.match(source, /resolveFill\(step\.fill, step\.fill\.blanks\)/)
  assert.match(source, /step\.choices\[step\.answer\]/)
  assert.match(source, /data-math-pitfall/)
  for (const problem of Object.values(MATH_PROBLEMS).flat()) {
    assert.ok(normalize(problem.answer), `math:${problem.id} の答えがありません`)
    assert.ok(normalize(problem.pitfall), `math:${problem.id} のつまずきやすい点がありません`)
    problem.steps.forEach((step, index) => {
      const label = `math:${problem.id}:step:${index}`
      assert.ok(normalize(step.fill ? step.fill.ask : step.q ?? step.ask), `${label} の何を求めるかがありません`)
      assert.ok(normalize(step.fill ? step.note : step.why ?? step.note), `${label} の理由がありません`)
    })
  }
})

test('数学の穴埋めの答え合わせは、その段の解説とタイル1枚ずつの説明を出し、決まり文句の講師解説を使わない', async () => {
  const source = await readFile(new URL('../src/screens/MathSolve.jsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /InstructorExplanation|instructorExplanations/, 'MathSolve.jsx: 決まり文句の講師解説が戻っています')
  assert.match(source, /data-math-fill-explanation[\s\S]*?<MathText>\{step\.note\}<\/MathText>/, 'MathSolve.jsx: 穴埋めの解説がありません')
  assert.match(
    source,
    /rows=\{bank\.map\(\(tile\) => \(\{[\s\S]*?body: mathFillNoteFor\(`\$\{p\.id\}:step:\$\{si\}`, tile\.id\)/,
    'MathSolve.jsx: タイルの欄が、出したタイルから作られていません',
  )
})

// どの教材の答え合わせも、問題ごとに書いた解説と選択肢・タイルごとの説明に置き換えた。
test('決まり文句の4段解説の部品と組み立て関数を残さない', async () => {
  const exists = (relative) => readFile(new URL(relative, import.meta.url)).then(() => true, () => false)
  assert.equal(await exists('../src/components/InstructorExplanation.jsx'), false)
  assert.equal(await exists('../src/lib/instructorExplanations.js'), false)
})

// 意味を知っているかを問うテスト。出題にない例文や文脈から答えを決めさせる4段解説は置かず、
// 画面の選択肢ボタンと同じ並びから、出題した選択肢すべての中身を並べる。
const MEANING_CHOICE_SCREENS = [
  ['VocabQuiz.jsx', /rows=\{options\.map\(\(option\) => \(\{[\s\S]*?heading: option\.word,[\s\S]*?option\.meanings\.join\('・'\)/],
  ['PhraseQuiz.jsx', /rows=\{options\.map\(\(option\) => \(\{[\s\S]*?heading: option\.phrase,[\s\S]*?option\.meanings\.join\('・'\)/],
  ['KotenQuiz.jsx', /rows=\{options\.map\(\(option\) => \(\{[\s\S]*?heading: <KotenWord word=\{option\} \/>,[\s\S]*?option\.meanings\.join\('・'\)/],
  ['KanbunQuiz.jsx', /rows=\{question\.choices\.map\(\(choice\) => \{[\s\S]*?heading: choice\.label,/],
  ['EtymologyQuiz.jsx', /rows=\{options\.map\(\(option\) => \{[\s\S]*?heading: option\.label,/],
]

test('意味を問うテストは、出題した選択肢すべての中身を示し、例文や文脈で答えを決めさせない', async () => {
  for (const [screen, rowsPattern] of MEANING_CHOICE_SCREENS) {
    const source = await readFile(new URL(`../src/screens/${screen}`, import.meta.url), 'utf8')
    assert.doesNotMatch(source, /InstructorExplanation|instructorExplanation/, `${screen}: 4段の講師解説が戻っています`)
    assert.doesNotMatch(
      source,
      /文脈の中で確定|例文から手掛かり|例文の位置|例文を手掛かり|例文の語順を手掛かり|例文で使われる場面/,
      `${screen}: 例文や文脈を答えの根拠にしています`,
    )
    // 例文は暗記カードと辞書で見る。答え合わせには、長い例文の訳し方も構文の仲間の例文も出さない。
    assert.doesNotMatch(
      source,
      /\.example\.(?:en|ja|gendai)\b|<LongSentenceTranslation|<SyntaxFamilyGuide(?![^>]*showExamples=\{false\})/,
      `${screen}: 答え合わせに例文が戻っています`,
    )
    assert.match(source, /<ChoiceExplanations/, `${screen}: 選択肢ごとの欄がありません`)
    assert.match(source, rowsPattern, `${screen}: 選択肢の欄がボタンと同じ選択肢から作られていません`)
  }
  const read = (screen) => readFile(new URL(`../src/screens/${screen}`, import.meta.url), 'utf8')
  assert.match(await read('VocabQuiz.jsx'), /<EtymologyBlock word=\{word\} \/>/)
  assert.match(await read('PhraseQuiz.jsx'), /\{item\.origin\}/)
  assert.match(await read('PhraseQuiz.jsx'), /<SyntaxFamilyGuide item=\{item\} showExamples=\{false\}/)
  // 表現の種類だけを言う決まり文句の成り立ち・進め方の指示だけの注意書きは、答え合わせに出さない。
  assert.match(await read('PhraseQuiz.jsx'), /!isGenericPhraseOrigin\(item\.origin\)/)
  assert.match(await read('PhraseQuiz.jsx'), /!isGenericPhraseNote\(item\.note\)/)
  assert.equal(isGenericPhraseOrigin('前置詞を含む語のまとまり全体で一つの働きをする定型表現。'), true)
  assert.equal(isGenericPhraseNote('目的語を置く位置と、自動詞・他動詞の違いまで例文で確認する。'), true)
  assert.equal(isGenericPhraseOrigin(PHRASES.find((item) => item.phrase === 'get up')?.origin), false)
  assert.equal(isGenericPhraseNote(PHRASES.find((item) => item.phrase === 'get up')?.note), false)
  // 熟語・構文カードは、成り立ちも注意書きもすべてその表現だけの文にする（決まり文句で埋めず、ほかの表現と同じ成り立ちにしない）。
  assert.deepEqual(
    PHRASES.filter((item) => isGenericPhraseOrigin(item.origin) || isGenericPhraseNote(item.note)).map((item) => item.id),
    [],
  )
  assert.equal(new Set(PHRASES.map((item) => item.origin)).size, PHRASES.length)
  assert.match(PHRASES.find((item) => item.id === 'curr_idm_2_pull_down')?.origin ?? '', /^pull\(引く\)＋down\(下へ\)。/)
  assert.match(PHRASES.find((item) => item.id === 'curr1900_idm_pre2_pull_blank_s_leg')?.origin ?? '', /相手の脚を引っ張る/)
  assert.match(await read('KotenQuiz.jsx'), /<KotenText>\{word\.note\}<\/KotenText>/)
  const diagnostic = await read('Diagnostic.jsx')
  // 単語・熟語は語の説明、文法は規則ごとの解説、読解は本文の根拠を1段落で出す（4段の解説は置かない）。
  assert.doesNotMatch(diagnostic, /InstructorExplanation/)
  assert.match(diagnostic, /question\.skill !== 'vocab' && question\.skill !== 'usage' && question\.review\?\.en/)
  assert.match(diagnostic, /rows=\{question\.choices\.map\(\(choice\) => \(\{[\s\S]*?body: diagnosticChoiceNoteFor\(question, choice\)/)

  // 誤答はどの項目からも選ばれうるので、全項目に選択肢の欄へ出す中身があることを確かめる。
  for (const word of ALL_WORDS) {
    assert.ok(normalize(word.word), `vocab:${word.id} の英単語が空です`)
    assert.ok(
      word.meanings?.length && word.meanings.every((meaning) => normalize(meaning)),
      `vocab:${word.id} の意味が空です`,
    )
  }
  for (const item of PHRASES) {
    assert.ok(
      normalize(item.phrase) && item.meanings?.length && normalize(item.origin),
      `phrase:${item.id} の表現・意味・成り立ちが欠けています`,
    )
  }
  for (const word of KOTEN_WORDS) {
    assert.ok(
      normalize(word.word) && word.meanings?.length && normalize(word.note),
      `koten:${word.id} の古語・意味・覚え方が欠けています`,
    )
  }
  for (const [domain, items] of Object.entries(KANBUN_COLLECTIONS)) {
    for (const item of items) {
      assert.ok(
        normalize(item.title) && normalize(item.answer) && normalize(item.clue),
        `kanbun:${domain}:${item.id} の見出し・答え・見分けるヒントが欠けています`,
      )
      if (domain === 'grammar') assert.ok(normalize(item.pattern), `kanbun:grammar:${item.id} の句形が欠けています`)
    }
  }
  for (const question of buildAllEtymologyQuizQuestions()) {
    for (const option of question.options) {
      const card = getEtymologyPack(option.id)
      assert.ok(
        card && normalize(card.rootForm) && normalize(card.rootMeaning) && normalize(card.rootOrigin),
        `etymology:${question.cardId}:${option.id} の語根の説明が欠けています`,
      )
    }
  }

  // 出題と同じ組み方で、どの項目も3択がそろい、英単語の選択肢は見出しが重ならない。
  let choices = 0
  for (const seed of [17, 101, 20260729]) {
    const rng = seededRandom(seed)
    for (const word of ALL_WORDS) {
      const options = [word, ...pickDistractors(word, 2, rng)]
      assert.equal(options.length, 3, `vocab:${word.id} の選択肢が不足しています`)
      assert.equal(
        new Set(options.map((option) => option.word.toLowerCase())).size,
        3,
        `vocab:${word.id} の選択肢の英単語が重なっています`,
      )
      choices += options.length
    }
    for (const item of PHRASES) {
      const options = [item, ...pickPhraseDistractors(item, 2, rng)]
      assert.equal(options.length, 3, `phrase:${item.id} の選択肢が不足しています`)
      choices += options.length
    }
    for (const word of KOTEN_WORDS) {
      const options = [word, ...pickKotenDistractors(word, 2, rng)]
      assert.equal(options.length, 3, `koten:${word.id} の選択肢が不足しています`)
      choices += options.length
    }
  }
  assert.equal(choices, (ALL_WORDS.length + PHRASES.length + KOTEN_WORDS.length) * 9)

  // 実力診断：単語・熟語・読解と、出典のない文法の固定問題は、表示する全選択肢に説明がある。
  let notes = 0
  for (const question of diagnosticQuestions) {
    if (question.skill === 'grammar' && question.sourceId?.startsWith('grammar:')) continue
    for (const choice of question.choices) {
      assert.ok(
        normalize(diagnosticChoiceNoteFor(question, choice)),
        `diagnostic:${question.id}「${choice}」の説明がありません`,
      )
      notes += 1
    }
  }
  assert.ok(notes >= 300, `診断の選択肢説明の監査数が不足しています: ${notes}`)
})

// 問題形式の古典テスト（古典文法・古典常識・短文解釈）。テンプレートの4段解説は置かず、
// 問題固有の解説と、出題した選択肢すべての説明を示す。教材の4択すべてに説明を書く。
test('古典文法・古典常識・短文解釈は、教材の全選択肢に問題固有の説明があり、決まり文句の講師解説を使わない', async () => {
  const read = (screen) => readFile(new URL(`../src/screens/${screen}`, import.meta.url), 'utf8')
  for (const [screen, rowsPattern] of [
    ['KotenGrammarQuiz.jsx', /rows=\{choices\.map\(\(choice\) => \(\{[\s\S]*?body: kotenGrammarChoiceNoteFor\(question, choice\)/],
    ['KotenCultureQuiz.jsx', /rows=\{choices\.map\(\(choice\) => \(\{[\s\S]*?body: kotenCultureChoiceNoteFor\(question, choice\)/],
    ['KotenInterpretationQuiz.jsx', /rows=\{choices\.map\(\(choice\) => \(\{[\s\S]*?body: kotenInterpretationChoiceNoteFor\(item, choice\)/],
  ]) {
    const source = await read(screen)
    assert.doesNotMatch(source, /InstructorExplanation/, `${screen}: 決まり文句の講師解説が戻っています`)
    assert.match(source, /<ChoiceExplanations/, `${screen}: 選択肢ごとの欄がありません`)
    assert.match(source, rowsPattern, `${screen}: 選択肢の欄がボタンと同じ選択肢から作られていません`)
  }

  let notes = 0
  for (const [label, questions, noteFor, table] of [
    ['koten-grammar', KOTEN_GRAMMAR_QUESTIONS, kotenGrammarChoiceNoteFor, KOTEN_GRAMMAR_CHOICE_NOTES],
    ['koten-culture', KOTEN_CULTURE_QUESTIONS, kotenCultureChoiceNoteFor, KOTEN_CULTURE_CHOICE_NOTES],
    ['koten-interpretation', KOTEN_INTERPRETATIONS, kotenInterpretationChoiceNoteFor, KOTEN_INTERPRETATION_CHOICE_NOTES],
  ]) {
    for (const question of questions) {
      const texts = question.choices.map((choice) => normalize(noteFor(question, choice)))
      texts.forEach((text, index) => {
        assert.ok(text.length >= 5, `${label}:${question.id}「${question.choices[index]}」の説明がありません`)
      })
      assert.equal(new Set(texts).size, texts.length, `${label}:${question.id} の選択肢の説明が重複しています`)
      notes += texts.length
    }
    // 問題や選択肢を直したのに、説明だけが古いまま残らないようにする。
    for (const [id, notesByChoice] of Object.entries(table)) {
      const question = questions.find((entry) => entry.id === id)
      assert.ok(question, `${label}:${id} は存在しない問題の説明です`)
      for (const choice of Object.keys(notesByChoice)) {
        assert.ok(question.choices.includes(choice), `${label}:${id}「${choice}」は選択肢にありません`)
      }
    }
  }
  assert.equal(notes, 544 + 448 + 144)
})

test('名作の読解チェックは、教材の全選択肢に本文に照らした説明を示す', async () => {
  const source = await readFile(new URL('../src/screens/LiteratureReader.jsx', import.meta.url), 'utf8')
  assert.match(source, /<ChoiceExplanations/, 'LiteratureReader.jsx: 選択肢ごとの欄がありません')
  assert.match(
    source,
    /rows=\{shownChoices\.map\(\(\{ choice, choiceIndex \}\) => \(\{[\s\S]*?body: literatureReadingChoiceNoteFor\(item, choiceIndex\)/,
    'LiteratureReader.jsx: 選択肢の欄が、表示した選択肢から作られていません',
  )

  const questions = Object.values(LITERATURE_READING_QUESTIONS).flat()
  let notes = 0
  for (const question of questions) {
    const texts = question.choices.map((_, index) => normalize(literatureReadingChoiceNoteFor(question, index)))
    texts.forEach((text, index) => {
      assert.ok(text.length >= 5, `literature:${question.id} の選択肢${index + 1}の説明がありません`)
    })
    assert.equal(new Set(texts).size, texts.length, `literature:${question.id} の選択肢の説明が重複しています`)
    notes += texts.length
  }
  for (const [id, list] of Object.entries(LITERATURE_READING_CHOICE_NOTES)) {
    const question = questions.find((entry) => entry.id === id)
    assert.ok(question, `literature:${id} は存在しない問題の説明です`)
    assert.equal(list.length, question.choices.length, `literature:${id} の説明の数が選択肢の数と違います`)
  }
  assert.equal(notes, 72)
})
