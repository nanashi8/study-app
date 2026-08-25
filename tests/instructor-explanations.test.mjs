import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import {
  GRAMMAR,
  grammarChoiceGuidanceFor,
} from '../src/data/grammar.js'
import {
  KOTEN_CULTURE_QUESTIONS,
  getKotenCulture,
} from '../src/data/koten-culture.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import {
  KOTEN_WORDS,
  pickKotenDistractors,
} from '../src/data/koten.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { MATH_PROBLEMS } from '../src/data/math.js'
import { PHRASES } from '../src/data/phrases.js'
import { ALL_PASSAGES } from '../src/data/passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import {
  ALL_WORDS,
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
  buildKotenCultureInstructorExplanation,
  buildKotenGrammarInstructorExplanation,
  buildKotenInterpretationInstructorExplanation,
  buildKotenWordInstructorExplanation,
  buildListeningInstructorExplanation,
  buildMathChoiceInstructorExplanation,
  buildMathFillInstructorExplanation,
  buildMathSolvedInstructorExplanation,
  buildPhraseInstructorExplanation,
  buildReadingInstructorExplanation,
  buildVocabInstructorExplanation,
  buildWritingInstructorExplanation,
  isCompleteInstructorExplanation,
} from '../src/lib/instructorExplanations.js'
import { buildDiagnosticQuestions } from '../src/lib/diagnosticQuestions.js'
import { UNKNOWN_CHOICE_ID } from '../src/lib/quizChoices.js'
import { pickPhraseDistractors } from '../src/lib/session.js'

const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const withoutTerminal = (value) => normalize(value).replace(/[。.!！?？]+$/u, '')
const deterministicRng = () => 0.3141592653
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

const allReadingQuestions = ALL_PASSAGES.flatMap((passage) =>
  getReadingQuestions(passage.id))

test('全教材の全設問から問題固有の予備校講師型4段解説を生成できる', () => {
  let units = 0
  for (const word of ALL_WORDS) {
    const vocab = buildVocabInstructorExplanation(word)
    assertExplanation(vocab, `vocab:${word.id}`)
    assertContains(vocab.answer, word.meaning, `vocab:${word.id}.answer`)
    assertContains(vocab.evidence, word.example?.en, `vocab:${word.id}.evidence`)
    units += 1

  }

  for (const item of PHRASES) {
    const value = buildPhraseInstructorExplanation(item)
    assertExplanation(value, `phrase:${item.id}`)
    assertContains(
      value.answer,
      item.meanings?.[0] ?? item.meaning,
      `phrase:${item.id}.answer`,
    )
    assertContains(value.evidence, item.example?.en, `phrase:${item.id}.evidence`)
    units += 1
  }

  for (const item of GRAMMAR) {
    const value = buildGrammarInstructorExplanation(item)
    assertExplanation(value, `grammar:${item.id}`)
    assertContains(value.answer, item.answer, `grammar:${item.id}.answer`)
    assertContains(value.evidence, item.explain, `grammar:${item.id}.evidence`)
    units += 1
  }

  for (const word of KOTEN_WORDS) {
    const value = buildKotenWordInstructorExplanation(word)
    assertExplanation(value, `koten-word:${word.id}`)
    assertContains(value.answer, word.meaning, `koten-word:${word.id}.answer`)
    assertContains(value.evidence, word.note, `koten-word:${word.id}.evidence`)
    units += 1
  }

  for (const question of KOTEN_GRAMMAR_QUESTIONS) {
    const value = buildKotenGrammarInstructorExplanation(question)
    assertExplanation(value, `koten-grammar:${question.id}`)
    assertContains(value.answer, question.answer, `koten-grammar:${question.id}.answer`)
    assertContains(
      value.evidence,
      question.explanation,
      `koten-grammar:${question.id}.evidence`,
    )
    units += 1
  }

  for (const question of KOTEN_CULTURE_QUESTIONS) {
    const related = getKotenCulture(question.cultureIds?.[0])
    const value = buildKotenCultureInstructorExplanation(question, undefined, related)
    assertExplanation(value, `koten-culture:${question.id}`)
    assertContains(value.answer, question.answer, `koten-culture:${question.id}.answer`)
    assertContains(
      value.evidence,
      question.explanation,
      `koten-culture:${question.id}.evidence`,
    )
    units += 1
  }

  for (const item of KOTEN_INTERPRETATIONS) {
    const value = buildKotenInterpretationInstructorExplanation(item)
    assertExplanation(value, `koten-interpretation:${item.id}`)
    assertContains(value.answer, item.answer, `koten-interpretation:${item.id}.answer`)
    assertContains(
      value.evidence,
      item.vocabTip,
      `koten-interpretation:${item.id}.evidence`,
    )
    units += 1
  }

  for (const item of LISTENING_ITEMS) {
    const value = buildListeningInstructorExplanation(item)
    const correct = item.choices.find((choice) => choice.id === item.answer)
    assertExplanation(value, `listening:${item.id}`)
    assertContains(value.answer, correct?.text, `listening:${item.id}.answer`)
    assertContains(value.evidence, item.explain, `listening:${item.id}.evidence`)
    units += 1
  }

  for (const question of allReadingQuestions) {
    const value = buildReadingInstructorExplanation(question)
    assertExplanation(value, `reading:${question.q}`)
    assertContains(value.answer, question.answer, `reading:${question.q}.answer`)
    assertContains(value.evidence, question.explain, `reading:${question.q}.evidence`)
    units += 1
  }

  for (const question of diagnosticQuestions) {
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
    if (problem.recall?.quiz) {
      const value = buildMathChoiceInstructorExplanation(
          problem,
          problem.recall.quiz,
          problem.recall.quiz.answer,
        )
      assertExplanation(value, `math:${problem.id}:recall`)
      assertContains(
        value.answer,
        problem.recall.quiz.choices[problem.recall.quiz.answer],
        `math:${problem.id}:recall.answer`,
      )
      assertContains(
        value.evidence,
        problem.recall.quiz.why ?? problem.recall.quiz.note,
        `math:${problem.id}:recall.evidence`,
      )
      units += 1
    }
    problem.steps.forEach((step, index) => {
      const value = step.fill
        ? buildMathFillInstructorExplanation(problem, step, step.fill.blanks)
        : buildMathChoiceInstructorExplanation(problem, step, step.answer)
      assertExplanation(value, `math:${problem.id}:step:${index}`)
      assertContains(
        value.answer,
        step.fill ? step.fill.blanks.join('、') : step.choices[step.answer],
        `math:${problem.id}:step:${index}.answer`,
      )
      assertContains(
        value.evidence,
        step.fill ? step.note : step.why ?? step.note,
        `math:${problem.id}:step:${index}.evidence`,
      )
      units += 1
    })
  }

  assert.ok(units >= 15_000, `全件監査の対象数が不足しています: ${units}`)
})

test('全選択式問題の正答・全誤答・「わからない」に回答別の指導を返す', () => {
  let paths = 0
  for (const word of ALL_WORDS) {
    const options = [word, ...pickDistractors(word, 2, deterministicRng)]
    assert.equal(options.length, 3, `vocab:${word.id} の選択肢が不足しています`)
    paths += assertChoiceFamily({
      label: `vocab:${word.id}`,
      cases: [
        ...options.map((option) => ({
          selected: option,
          label: option.meaning,
          kind: option.id === word.id ? 'correct' : 'wrong',
        })),
        { selected: UNKNOWN_CHOICE_ID, label: 'わからない', kind: 'unknown' },
      ],
      build: (selected) => buildVocabInstructorExplanation(word, selected),
      answerAnchor: word.meaning,
      evidenceAnchor: word.example?.en,
    })
  }

  for (const item of PHRASES) {
    const options = [item, ...pickPhraseDistractors(item, 2, deterministicRng)]
    assert.equal(options.length, 3, `phrase:${item.id} の選択肢が不足しています`)
    paths += assertChoiceFamily({
      label: `phrase:${item.id}`,
      cases: [
        ...options.map((option) => ({
          selected: option,
          label: option.meanings?.[0] ?? option.meaning,
          kind: option.id === item.id ? 'correct' : 'wrong',
        })),
        { selected: UNKNOWN_CHOICE_ID, label: 'わからない', kind: 'unknown' },
      ],
      build: (selected) => buildPhraseInstructorExplanation(item, selected),
      answerAnchor: item.meanings?.[0] ?? item.meaning,
      evidenceAnchor: item.example?.en,
    })
  }

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

  for (const word of KOTEN_WORDS) {
    const options = [word, ...pickKotenDistractors(word, 3, deterministicRng)]
    assert.equal(options.length, 4, `koten-word:${word.id} の選択肢が不足しています`)
    paths += assertChoiceFamily({
      label: `koten-word:${word.id}`,
      cases: [
        ...options.map((option) => ({
          selected: option,
          label: option.meaning,
          kind: option.id === word.id ? 'correct' : 'wrong',
        })),
        { selected: UNKNOWN_CHOICE_ID, label: 'わからない', kind: 'unknown' },
      ],
      build: (selected) => buildKotenWordInstructorExplanation(word, selected),
      answerAnchor: word.meaning,
      evidenceAnchor: word.note,
      wrongTrapAnchor: word.note,
    })
  }

  for (const question of KOTEN_GRAMMAR_QUESTIONS) {
    paths += assertChoiceFamily({
      label: `koten-grammar:${question.id}`,
      cases: choiceCases(question.choices, question.answer),
      build: (selected) => buildKotenGrammarInstructorExplanation(question, selected),
      answerAnchor: question.answer,
      evidenceAnchor: question.explanation,
      wrongTrapAnchor: question.explanation,
    })
  }

  for (const question of KOTEN_CULTURE_QUESTIONS) {
    const related = getKotenCulture(question.cultureIds?.[0])
    paths += assertChoiceFamily({
      label: `koten-culture:${question.id}`,
      cases: choiceCases(question.choices, question.answer),
      build: (selected) => buildKotenCultureInstructorExplanation(
        question,
        selected,
        related,
      ),
      answerAnchor: question.answer,
      evidenceAnchor: question.explanation,
      wrongTrapAnchor: question.explanation,
    })
  }

  for (const item of KOTEN_INTERPRETATIONS) {
    paths += assertChoiceFamily({
      label: `koten-interpretation:${item.id}`,
      cases: choiceCases(item.choices, item.answer),
      build: (selected) => buildKotenInterpretationInstructorExplanation(item, selected),
      answerAnchor: item.answer,
      evidenceAnchor: item.vocabTip,
      wrongTrapAnchor: item.vocabTip,
    })
  }

  for (const item of LISTENING_ITEMS) {
    const correct = item.choices.find((choice) => choice.id === item.answer)
    paths += assertChoiceFamily({
      label: `listening:${item.id}`,
      cases: [
        ...item.choices.map((choice) => ({
          selected: choice,
          label: choice.text,
          kind: choice.id === item.answer ? 'correct' : 'wrong',
        })),
        { selected: UNKNOWN_CHOICE_ID, label: 'わからない', kind: 'unknown' },
      ],
      build: (selected) => buildListeningInstructorExplanation(item, selected),
      answerAnchor: correct?.text,
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

  for (const question of diagnosticQuestions) {
    paths += assertChoiceFamily({
      label: `diagnostic:${question.id}`,
      cases: choiceCases(question.choices, question.answer),
      build: (selected) => buildDiagnosticInstructorExplanation(question, selected),
      answerAnchor: question.answer,
      evidenceAnchor: question.explain,
      wrongTrapAnchor: question.explain,
    })
  }

  for (const problem of Object.values(MATH_PROBLEMS).flat()) {
    const questions = [
      ...(problem.recall?.quiz ? [{ id: 'recall', question: problem.recall.quiz }] : []),
      ...problem.steps
        .map((step, index) => ({ id: `step:${index}`, question: step }))
        .filter(({ question }) => !question.fill),
    ]
    for (const { id, question } of questions) {
      paths += assertChoiceFamily({
        label: `math:${problem.id}:${id}`,
        cases: [
          ...question.choices.map((choice, index) => ({
            selected: index,
            label: choice,
            kind: index === question.answer ? 'correct' : 'wrong',
          })),
          { selected: UNKNOWN_CHOICE_ID, label: 'わからない', kind: 'unknown' },
        ],
        build: (selected) => buildMathChoiceInstructorExplanation(
          problem,
          question,
          selected,
        ),
        answerAnchor: question.choices[question.answer],
        evidenceAnchor: question.why ?? question.note,
        wrongTrapAnchor: question.why ?? question.note,
      })
    }
  }

  assert.ok(paths >= 60_000, `全回答経路の監査数が不足しています: ${paths}`)
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

test('リスニング160問は設問意図ごとの聞き方と誤答の切り方を示す', () => {
  for (const item of LISTENING_ITEMS) {
    const value = buildListeningInstructorExplanation(item)
    const question = normalize(
      item.type === 'response' ? item.audio?.at(-1)?.text : item.question,
    ).toLowerCase()

    let expected
    if (/^(how many|how much)\b/.test(question)) expected = /数量|合計/
    else if (/^how long\b/.test(question)) expected = /期間/
    else if (/^(when|what time|what day|which day)\b/.test(question)) {
      expected = /曜日|日付|時刻/
    } else if (/^where\b/.test(question)) expected = /場所|位置/
    else if (/^why\b|what caused|what influences?/.test(question)) expected = /理由|因果/
    else if (/^how\b/.test(question)) expected = /方法|手段/
    else if (/^who\b/.test(question)) expected = /人物|対象者/
    else if (/suggest|imply|infer|probably|attitude|feel|believe|conclusion/.test(question)) {
      expected = /推測|言える範囲/
    }
    else if (/\b(condition|qualification|limitation|challenge|problem|weakness|concern|caution)\b/.test(question)) {
      expected = /条件|弱点|懸念/
    } else if (/\b(change|changes|changed|result|happened|effect|benefit|advantage)\b/.test(question)) {
      expected = /変化・結果/
    } else if (/\b(agree|decide|plan|solution|recommend|advise|propose)\b/.test(question)) {
      expected = /案|合意|推奨/
    }

    if (expected) {
      assert.match(
        `${value.strategy} ${value.evidence}`,
        expected,
        `listening:${item.id} の問い「${question}」と解法が一致しません`,
      )
    }
    assert.doesNotMatch(
      value.strategy,
      /^(?:会話は各発言|説明文は冒頭|案内は|質問者の問い)|先に質問の焦点を定め/,
      `listening:${item.id} が設問意図ではなく素材タイプだけの汎用解法です`,
    )
    if (item.type === 'response') {
      assert.match(value.answer, /応答/)
      assert.doesNotMatch(
        `${value.answer} ${value.evidence}`,
        /言い換え/,
        `listening:${item.id} が応答問題を言い換え問題として説明しています`,
      )
    }
  }
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
    'KotenCultureQuiz.jsx',
    'KotenGrammarQuiz.jsx',
    'KotenInterpretationQuiz.jsx',
    'KotenQuiz.jsx',
    'ListeningQuiz.jsx',
    'MathSolve.jsx',
    'PhraseQuiz.jsx',
    'components/ReadingComprehensionCheck.jsx',
    'VocabQuiz.jsx',
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
