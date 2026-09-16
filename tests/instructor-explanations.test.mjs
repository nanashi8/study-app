import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import katex from 'katex'

import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import {
  GRAMMAR,
  grammarChoiceGuidanceFor,
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
import { PHRASES } from '../src/data/phrases.js'
import { ALL_PASSAGES } from '../src/data/passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import {
  ALL_WORDS,
  getEtymologyPack,
  pickDistractors,
} from '../src/data/vocab.js'
import {
  WRITING_EXERCISES,
  getWritingGrammar,
} from '../src/data/writing.js'
import {
  buildDiagnosticInstructorExplanation,
  buildDictationInstructorExplanation,
  buildGrammarInstructorExplanation,
  buildMathFillInstructorExplanation,
  buildMathSolvedInstructorExplanation,
  buildReadingInstructorExplanation,
  buildWritingInstructorExplanation,
  isCompleteInstructorExplanation,
} from '../src/lib/instructorExplanations.js'
import { buildDiagnosticQuestions, diagnosticChoiceNoteFor } from '../src/lib/diagnosticQuestions.js'
import { buildAllEtymologyQuizQuestions } from '../src/lib/etymologyQuiz.js'
import { isGenericPhraseNote, isGenericPhraseOrigin } from '../src/lib/phraseNotes.js'
import { UNKNOWN_CHOICE_ID } from '../src/lib/quizChoices.js'
import { pickPhraseDistractors } from '../src/lib/session.js'

const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const withoutTerminal = (value) => normalize(value).replace(/[。.!！?？]+$/u, '')
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
const forbiddenOutput = /\bundefined\b|\bNaN\b|__study_app_unknown_choice__/

const assertExplanation = (value, label) => {
  assert.equal(
    isCompleteInstructorExplanation(value),
    true,
    `${label} に「正解・根拠・消去法・考え方」のいずれかがありません: ${JSON.stringify(value)}`,
  )
  for (const key of ['answer', 'evidence', 'trap', 'strategy']) {
    assert.ok(value[key].length >= 20, `${label}.${key} が短すぎます: ${value[key]}`)
    assert.doesNotMatch(
      value[key],
      forbiddenOutput,
      `${label}.${key} に内部値または不正値が露出しています`,
    )
  }
  assert.equal(
    new Set(['answer', 'evidence', 'trap', 'strategy'].map((key) => value[key])).size,
    4,
    `${label} の4段解説が重複しています`,
  )
}

const assertContains = (actual, expected, label) => {
  const needle = withoutTerminal(expected)
  if (!needle) return
  assert.ok(
    normalize(actual).includes(needle),
    `${label} に問題固有の根拠「${needle}」がありません: ${actual}`,
  )
}

const assertChoiceFamily = ({
  label,
  cases,
  build,
  answerAnchor,
  evidenceAnchor,
  wrongTrapAnchor,
}) => {
  let correctTrap = ''
  let unknownTrap = ''
  const wrongTraps = []
  for (const choiceCase of cases) {
    const value = build(choiceCase.selected)
    assertExplanation(value, `${label}:${choiceCase.kind}:${choiceCase.label}`)
    assertContains(value.answer, answerAnchor, `${label}.answer`)
    assertContains(value.evidence, evidenceAnchor, `${label}.evidence`)
    if (choiceCase.kind === 'correct') {
      correctTrap = value.trap
    } else if (choiceCase.kind === 'unknown') {
      unknownTrap = value.trap
    } else {
      assertContains(
        value.trap,
        choiceCase.label,
        `${label}.trap:${choiceCase.label}`,
      )
      assertContains(
        value.trap,
        wrongTrapAnchor,
        `${label}.trap:${choiceCase.label}:rule`,
      )
      wrongTraps.push(value.trap)
    }
  }
  assert.ok(correctTrap, `${label} に正答時解説がありません`)
  assert.ok(unknownTrap, `${label} に「わからない」時解説がありません`)
  assert.notEqual(
    unknownTrap,
    correctTrap,
    `${label} の正答時と「わからない」時の指導が同一です`,
  )
  assert.equal(
    new Set(wrongTraps).size,
    wrongTraps.length,
    `${label} の誤答別指導が選択肢ごとに分かれていません`,
  )
  return cases.length
}

const choiceCases = (choices, answer) => [
  ...choices.map((choice) => ({
    selected: choice,
    label: normalize(choice),
    kind: choice === answer ? 'correct' : 'wrong',
  })),
  {
    selected: UNKNOWN_CHOICE_ID,
    label: 'わからない',
    kind: 'unknown',
  },
]

const diagnosticQuestions = [
  ...DIAGNOSTIC_QUESTIONS,
  ...[1, 2, 3].flatMap((attemptNumber) => buildDiagnosticQuestions({
    attemptNumber,
    seed: 0x1a2b3c4d,
  })),
]
// 共通講師解説を使うのは文法と読解だけ。単語・熟語は選択肢の中身を示す（下の意味を問うテストの検査）。
const diagnosticInstructorQuestions = diagnosticQuestions.filter(
  ({ skill }) => skill === 'grammar' || skill === 'reading',
)

const allReadingQuestions = ALL_PASSAGES.flatMap((passage) =>
  getReadingQuestions(passage.id))

test('全教材の全設問から問題固有の予備校講師型4段解説を生成できる', () => {
  let units = 0
  for (const item of GRAMMAR) {
    const value = buildGrammarInstructorExplanation(item)
    assertExplanation(value, `grammar:${item.id}`)
    assertContains(value.answer, item.answer, `grammar:${item.id}.answer`)
    assertContains(value.evidence, item.explain, `grammar:${item.id}.evidence`)
    units += 1
  }

  for (const question of allReadingQuestions) {
    const value = buildReadingInstructorExplanation(question)
    assertExplanation(value, `reading:${question.q}`)
    assertContains(value.answer, question.answer, `reading:${question.q}.answer`)
    assertContains(value.evidence, question.explain, `reading:${question.q}.evidence`)
    units += 1
  }

  for (const question of diagnosticInstructorQuestions) {
    const value = buildDiagnosticInstructorExplanation(question)
    assertExplanation(value, `diagnostic:${question.id}`)
    assertContains(value.answer, question.answer, `diagnostic:${question.id}.answer`)
    assertContains(value.evidence, question.explain, `diagnostic:${question.id}.evidence`)
    units += 1
  }

  for (const item of DICTATION_ITEMS) {
    const value = buildDictationInstructorExplanation(item, { wrongSelections: 0 })
    assertExplanation(value, `dictation:${item.id}`)
    assertContains(value.answer, item.text, `dictation:${item.id}.answer`)
    assertContains(value.evidence, item.focus, `dictation:${item.id}.evidence`)
    units += 1
  }

  for (const exercise of WRITING_EXERCISES) {
    for (const step of exercise.steps) {
      for (const option of step.options) {
        const value = buildWritingInstructorExplanation(
            step,
            option,
            getWritingGrammar(option.grammarId),
          )
        assertExplanation(value, `writing:${exercise.id}:${step.id}:${option.id}`)
        assertContains(
          value.answer,
          option.text,
          `writing:${exercise.id}:${step.id}:${option.id}.answer`,
        )
        assertContains(
          value.evidence,
          option.tip,
          `writing:${exercise.id}:${step.id}:${option.id}.evidence`,
        )
        units += 1
      }
    }
  }

  for (const problem of Object.values(MATH_PROBLEMS).flat()) {
    const solved = buildMathSolvedInstructorExplanation(problem)
    assertExplanation(solved, `math:${problem.id}:solved`)
    assertContains(solved.answer, problem.answer, `math:${problem.id}:solved.answer`)
    assertContains(
      solved.evidence,
      problem.steps[0]?.note,
      `math:${problem.id}:solved.evidence`,
    )
    units += 1
    // 選択問題（方針の確認・選択式のステップ）は、問題固有の解説と選択肢ごとの説明を示す（数学の選択問題のテスト）。
    // 講師解説を使うのは穴埋めと解き終わりだけ。
    problem.steps.forEach((step, index) => {
      if (!step.fill) return
      const value = buildMathFillInstructorExplanation(problem, step, step.fill.blanks)
      assertExplanation(value, `math:${problem.id}:step:${index}`)
      assertContains(value.answer, step.fill.blanks.join('、'), `math:${problem.id}:step:${index}.answer`)
      assertContains(value.evidence, step.note, `math:${problem.id}:step:${index}.evidence`)
      units += 1
    })
  }

  assert.ok(units >= 4_800, `全件監査の対象数が不足しています: ${units}`)
})

test('全選択式問題の正答・全誤答・「わからない」に回答別の指導を返す', () => {
  let paths = 0
  for (const item of GRAMMAR) {
    paths += assertChoiceFamily({
      label: `grammar:${item.id}`,
      cases: choiceCases(item.choices, item.answer),
      build: (selected) => buildGrammarInstructorExplanation(
        item,
        selected,
        selected === UNKNOWN_CHOICE_ID
          ? undefined
          : grammarChoiceGuidanceFor(item, selected),
      ),
      answerAnchor: item.answer,
      evidenceAnchor: item.explain,
      wrongTrapAnchor: item.explain,
    })
  }

  for (const question of allReadingQuestions) {
    paths += assertChoiceFamily({
      label: `reading:${question.q}`,
      cases: choiceCases(question.choices, question.answer),
      build: (selected) => buildReadingInstructorExplanation(question, selected),
      answerAnchor: question.answer,
      evidenceAnchor: question.explain,
      wrongTrapAnchor: question.explain,
    })
  }

  for (const question of diagnosticInstructorQuestions) {
    paths += assertChoiceFamily({
      label: `diagnostic:${question.id}`,
      cases: choiceCases(question.choices, question.answer),
      build: (selected) => buildDiagnosticInstructorExplanation(question, selected),
      answerAnchor: question.answer,
      evidenceAnchor: question.explain,
      wrongTrapAnchor: question.explain,
    })
  }

  assert.ok(paths >= 18_000, `全回答経路の監査数が不足しています: ${paths}`)
})

const grammarStrategyExpectation = (topic) => {
  if (topic === '高度語法') return /この問題では.+を最終判断の軸にする/
  if (/used to\s*\/\s*be used to/.test(topic)) return /to の品詞と直後の形/
  if (/be to構文/.test(topic)) return /予定・義務・可能・運命・意図/
  if (/疑問詞\+不定詞|完了不定詞|原形不定詞|不定詞|動名詞/.test(topic)) {
    return /to不定詞と動名詞/
  }
  if (/so\.\.\.that|so\/such\.\.\.that|too\/enough|目的の表現/.test(topic)) {
    return /程度・結果・目的/
  }
  if (/命令文|感嘆文|祈願文/.test(topic)) return /命令・感嘆・願望/
  if (/倒置|強調|省略|代用|部分否定|クジラ構文/.test(topic)) return /通常語順/
  if (/it\.\.\.to\/for/.test(topic)) return /形式主語/
  if (/形式目的語/.test(topic)) return /形式目的語/
  if (/^(?:一致|主語と動詞の一致)$/.test(topic)) return /主語の中心語/
  if (/文型|無生物主語|同格|付帯状況/.test(topic)) return /主語・動詞・目的語・補語/
  if (/関係|複合関係詞|whatever|連鎖関係詞/.test(topic)) return /完全文か不完全文/
  if (/接続|名詞節|譲歩|相関/.test(topic)) return /語・句・節/
  if (/be動詞|3単現|3人称単数|There is\/are/.test(topic)) return /人称と単数・複数/
  if (/名詞の複数形|冠詞|限定詞|数量表現|指示語/.test(topic)) return /数えられるか/
  if (/再帰代名詞|代名詞/.test(topic)) return /代名詞が指す名詞/
  if (/前置詞/.test(topic)) return /位置・方向・時・手段/
  if (/否定文・疑問文|付加疑問|間接疑問|疑問詞/.test(topic)) return /疑問文全体の語順/
  if (/助動詞|仮定|条件|had better/.test(topic)) return /反実仮想/
  if (/時制|完了|進行|過去形|未来表現|過去の習慣|used to|話法/.test(topic)) {
    return /基準時/
  }
  if (/比較/.test(topic)) return /比較する対象/
  if (/受動|分詞|使役|知覚/.test(topic)) return /する側.*される側/
  return null
}

test('英文法3,450問は全単元で対応する再現可能な解法を示す', () => {
  const topics = new Set()
  for (const item of GRAMMAR) {
    topics.add(item.topic)
    const value = buildGrammarInstructorExplanation(item)
    const expected = grammarStrategyExpectation(item.topic)
    assert.ok(expected, `grammar:${item.id} の単元「${item.topic}」が解法分類されていません`)
    assert.match(
      value.strategy,
      expected,
      `grammar:${item.id} の単元「${item.topic}」と解法が一致しません`,
    )
    if (item.topic === '高度語法') {
      assertContains(value.strategy, item.explain, `grammar:${item.id}.strategy`)
    } else {
      assert.doesNotMatch(
        value.strategy,
        /まず完成文で必要な意味と品詞/,
        `grammar:${item.id} が単元別解法ではなく汎用フォールバックです`,
      )
    }
  }
  assert.ok(topics.size >= 100, `監査した文法単元数が不足しています: ${topics.size}`)

  const recognizedDiagnosticStrategy =
    /主語の人称|疑問文全体|基準時|する側|反実仮想|通常語順|比較する対象|to不定詞と動名詞|完全文か不完全文|形式目的語|語・句・節|主語・動詞・目的語・補語|命令・感嘆・願望|数えられるか|代名詞が指す名詞|位置・方向・時・手段|この問題では/
  for (const question of diagnosticQuestions.filter(({ skill }) => skill === 'grammar')) {
    const strategy = buildDiagnosticInstructorExplanation(question).strategy
    assert.match(
      strategy,
      recognizedDiagnosticStrategy,
      `diagnostic:${question.id} に文法事項固有の解法がありません`,
    )
    assert.doesNotMatch(
      strategy,
      /この問題では\s*を最終判断/,
      `diagnostic:${question.id} の判断軸が空です`,
    )
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

const sameFillAnswer = (fill, selectedValues) => {
  const correct = fill.blanks.map(normalize)
  const selected = selectedValues.map(normalize)
  if (correct.length !== selected.length) return false
  if (fill.unordered) {
    return [...correct].sort().every((value, index) => value === [...selected].sort()[index])
  }
  return correct.every((value, index) => value === selected[index])
}

test('数学440穴埋めは正誤判定と解説が一致し、順不同7題は逆順も正答として扱う', () => {
  let fills = 0
  let unordered = 0
  for (const problem of Object.values(MATH_PROBLEMS).flat()) {
    for (const [index, step] of problem.steps.entries()) {
      if (!step.fill) continue
      fills += 1
      const label = `math:${problem.id}:fill:${index}`
      const correct = buildMathFillInstructorExplanation(problem, step, step.fill.blanks)
      assertExplanation(correct, `${label}:correct`)
      assert.doesNotMatch(correct.trap, /一致しない/, `${label} が正答を誤答として説明しています`)

      let wrongValues
      for (let blankIndex = 0; blankIndex < step.fill.blanks.length; blankIndex += 1) {
        for (const tile of step.fill.tiles) {
          const candidate = [...step.fill.blanks]
          candidate[blankIndex] = tile
          if (!sameFillAnswer(step.fill, candidate)) {
            wrongValues = candidate
            break
          }
        }
        if (wrongValues) break
      }
      assert.ok(wrongValues, `${label} の誤答経路を作れません`)
      const wrong = buildMathFillInstructorExplanation(problem, step, wrongValues)
      assertExplanation(wrong, `${label}:wrong`)
      assert.match(wrong.trap, /一致しない/, `${label} が誤答を明示していません`)
      assertContains(wrong.trap, wrongValues.join('、'), `${label}:wrong.trap`)
      assertContains(wrong.trap, step.note, `${label}:wrong.rule`)

      if (step.fill.unordered) {
        unordered += 1
        const reversed = [...step.fill.blanks].reverse()
        assert.equal(sameFillAnswer(step.fill, reversed), true, `${label} の順不同判定が不一致です`)
        const reverseExplanation = buildMathFillInstructorExplanation(problem, step, reversed)
        assertExplanation(reverseExplanation, `${label}:reversed`)
        assert.doesNotMatch(
          reverseExplanation.trap,
          /一致しない/,
          `${label} が逆順の正答を誤答として説明しています`,
        )
        assert.match(reverseExplanation.trap, /順序/, `${label} が順不同条件を説明していません`)
      }
    }
  }
  assert.equal(fills, 440)
  assert.equal(unordered, 7)
})

test('ディクテーションは結果別の具体的な復習指示を返す', () => {
  for (const item of DICTATION_ITEMS) {
    const value = buildDictationInstructorExplanation(item, { wrongSelections: 2 })
    assertExplanation(value, `dictation:${item.id}:wrong`)
    assert.match(value.trap, /2回/)
    assertContains(value.evidence, item.focus, `dictation:${item.id}:wrong.evidence`)
  }
})

test('採点を伴う全問題画面が共通の講師解説を表示する', async () => {
  const screens = [
    'Diagnostic.jsx',
    'DictationPlay.jsx',
    'GrammarQuiz.jsx',
    'MathSolve.jsx',
    'components/ReadingComprehensionCheck.jsx',
    'WritingPlay.jsx',
  ]

  for (const screen of screens) {
    const source = await readFile(
      new URL(screen.includes('/') ? `../src/${screen}` : `../src/screens/${screen}`, import.meta.url),
      'utf8',
    )
    assert.match(source, /InstructorExplanation/, `${screen} に共通講師解説がありません`)
  }
})

test('共通解説の表示名と各フィールドの意味契約を一致させる', async () => {
  const source = await readFile(
    new URL('../src/components/InstructorExplanation.jsx', import.meta.url),
    'utf8',
  )
  assert.match(source, /key: 'evidence', label: '根拠'/)
  assert.match(source, /key: 'trap', label: '消去法'/)
  assert.match(source, /key: 'strategy', label: '考え方'/)
  assert.doesNotMatch(source, /根拠を一本化|誤答を切る|次も解ける型/)
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
  assert.match(await read('KotenQuiz.jsx'), /<KotenText>\{word\.note\}<\/KotenText>/)
  const diagnostic = await read('Diagnostic.jsx')
  assert.match(diagnostic, /question\.skill === 'vocab' \|\| question\.skill === 'usage' \?/)
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
