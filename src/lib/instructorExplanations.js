import { UNKNOWN_CHOICE_ID } from './quizChoices.js'

const clean = (value) => String(value ?? '')
  .replace(/\s+/g, ' ')
  .replace(/。{2,}/g, '。')
  .replace(/([！？!?])\1+/g, '$1')
  .replace(/[.．]。/g, '。')
  .trim()
const stripTerminal = (value) => clean(value).replace(/[。.!！?？]+$/u, '')
const quote = (value) => `「${clean(value)}」`
const list = (values, separator = '・') =>
  (values ?? []).map(clean).filter(Boolean).join(separator)

const explanation = ({ answer, evidence, trap, strategy }) => ({
  answer: clean(answer),
  evidence: clean(evidence),
  trap: clean(trap),
  strategy: clean(strategy),
})

const isUnknown = (selected) =>
  selected === UNKNOWN_CHOICE_ID || selected?.id === UNKNOWN_CHOICE_ID

const chosenText = (selected) => {
  if (selected == null || isUnknown(selected)) return ''
  if (typeof selected === 'string' || typeof selected === 'number') return clean(selected)
  return clean(
    selected.text
      ?? selected.meaning
      ?? selected.meanings?.[0]
      ?? selected.word
      ?? selected.phrase,
  )
}

const selectionTrap = ({
  selected,
  correct,
  wrong,
  unknown,
  correctAnswer,
}) => {
  if (isUnknown(selected)) return clean(unknown)
  const picked = chosenText(selected)
  if (picked && clean(correct) && picked !== clean(correct)) {
    return clean(wrong(picked))
  }
  return clean(correctAnswer)
}

const readingStrategy = (question = '') => {
  const value = clean(question).toLowerCase()
  if (value.startsWith('why')) {
    return 'Why は理由を問う。because / so / therefore だけでなく、原因と結果が別文に分かれていないかを確認し、本文の因果を言い換えた選択肢を選ぶ。'
  }
  if (value.startsWith('how')) {
    return 'How は方法・状態・経緯を問う。動作の手段や変化の流れを本文で特定し、同じ内容を別表現にした選択肢と結ぶ。'
  }
  if (/main|best expresses|suggest|author/.test(value)) {
    return '主旨・筆者意見は一文だけで決めず、導入の問題提起、本文の対比、結論の主張が共通して向かう内容を選ぶ。強すぎる断定は切る。'
  }
  if (/where|when|who|what/.test(value)) {
    return '疑問詞が求める情報の種類を決め、固有名詞・時・場所・動作の周辺を本文から探す。見つけた一文と、選択肢の言い換えを比べる。'
  }
  return '設問のキーワードを本文に戻し、根拠の一文を指で示せる選択肢だけを残す。本文にない常識や印象は足さない。'
}

const DIAGNOSTIC_SKILL_LABEL = Object.freeze({
  vocab: '語彙',
  grammar: '文法',
  usage: '熟語・語法',
  reading: '読解',
})

export function buildReadingInstructorExplanation(question, selected) {
  const basis = stripTerminal(question?.explain)
  const questionJa = clean(question?.questionJa)
  const answerJa = clean(question?.answerJa ?? question?.choiceTranslations?.[question?.answer])
  const answerTranslation = answerJa ? `（${answerJa}）` : ''
  return explanation({
    answer: `${questionJa ? `設問の和訳は${quote(questionJa)}。` : ''}正解は${quote(question?.answer)}${answerTranslation}。設問が求める情報に対し、本文と同じ内容を過不足なく言い換えている。`,
    evidence: `${basis}。${answerJa ? `したがって、本文の答えは${quote(answerJa)}となる。` : ''}この本文上の事実を、設問が求める形に言い換えれば正解へ到達する。`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => {
        const pickedJa = clean(question?.choiceTranslations?.[picked])
        return `${quote(picked)}${pickedJa ? `は${quote(pickedJa)}という意味。` : 'を選ぶには、'}この設問で本文が示す答えは${answerJa ? quote(answerJa) : quote(question?.answer)}であり、決め手は「${basis}」である。別箇所の語だけが一致しても、この設問への答えにならない選択肢は切る。`
      },
      unknown: `分からないときは全文を読み直す前に、${questionJa ? `設問の和訳${quote(questionJa)}を確認し、` : ''}疑問詞と名詞を本文へ戻す。この問題の根拠は「${basis}」である。`,
      correctAnswer: `正解できても、${answerJa ? `英語と和訳${quote(answerJa)}を対応させ、` : ''}本文のどの一文が根拠かを指せるか確認する。`,
    }),
    strategy: readingStrategy(question?.q ?? question?.prompt),
  })
}

export function buildReadingChoiceExplanations(question) {
  const basis = stripTerminal(question?.explain)
  const answerJa = clean(question?.answerJa ?? question?.choiceTranslations?.[question?.answer])

  return {
    question: {
      en: clean(question?.q ?? question?.prompt),
      ja: clean(question?.questionJa),
    },
    choices: (question?.choices ?? []).map((choice) => {
      const ja = clean(question?.choiceTranslations?.[choice])
      const correct = choice === question?.answer
      return {
        en: clean(choice),
        ja,
        correct,
        explanation: correct
          ? `${basis}。この内容が設問に直接答えている。`
          : `${quote(ja || choice)}という内容だが、この設問で本文が示す答えは${quote(answerJa || question?.answer)}である。${basis}。したがって、この選択肢はこの設問への答えにはならない。`,
      }
    }),
  }
}

// 実力診断の読解問題の解説。単語・熟語は語の説明と選択肢の中身、文法は規則ごとの解説を出すので、
// この4段の解説は使わない。
export function buildDiagnosticInstructorExplanation(question, selected) {
  const review = question?.review?.en && question?.review?.ja
    ? ` 確認例${quote(question.review.en)}は${quote(question.review.ja)}。`
    : ''
  const strategy = readingStrategy(question?.prompt)
  const skillLabel = DIAGNOSTIC_SKILL_LABEL[question?.skill] ?? '基礎力'
  return explanation({
    answer: `正解は${quote(question?.answer)}。この一問では${quote(skillLabel)}の基礎となる判断を確認している。`,
    evidence: `${clean(question?.explain)}${review}`,
    trap: selectionTrap({
      selected,
      correct: question?.answer,
      wrong: (picked) => `${quote(picked)}では設問の条件を満たさない。正解の暗記で終えず、${clean(question?.explain)}`,
      unknown: `「わからない」は弱点を正確に見つけた回答。まず ${clean(question?.explain)} を自分の言葉で言い直してから、例文で再確認する。`,
      correctAnswer: '正解できても、勘ではなく根拠を説明できるか確認する。説明できなければ復習対象に含める。',
    }),
    strategy,
  })
}

export function buildMathFillInstructorExplanation(problem, step, selectedValues = []) {
  const correctItems = (step?.fill?.blanks ?? []).map(clean)
  const pickedItems = selectedValues.map(clean)
  const correctValues = list(correctItems, '、')
  const pickedValues = list(selectedValues, '、')
  const sameValues = correctItems.length === pickedItems.length
    && (
      step?.fill?.unordered
        ? [...correctItems].sort().every((value, index) => value === [...pickedItems].sort()[index])
        : correctItems.every((value, index) => value === pickedItems[index])
    )
  return explanation({
    answer: `空欄は${quote(correctValues)}。一つ前の式との関係を保ったまま、この値を当てはめる。`,
    evidence: `この空欄で行っている操作は次の通り。${clean(step?.note)} 前後の式を比べると値の役割が確認できる。`,
    trap: pickedValues && !sameValues
      ? `入れた値${quote(pickedValues)}は途中式の条件と一致しない。この段階では ${clean(step?.note)} ${clean(problem?.pitfall)}`
      : `${step?.fill?.unordered ? '順序を入れ替えても条件を満たす値の組は同じである。' : ''}数値だけを合わせず、なぜこの演算・符号・式変形になるかを確認する。${clean(problem?.pitfall)}`,
    strategy: list(problem?.recall?.points, '。') || '一つ前の式から何を変えたかを言葉にし、等号の左右が同じ量を表すことを毎段確認する。',
  })
}

export function isCompleteInstructorExplanation(value) {
  return ['answer', 'evidence', 'trap', 'strategy'].every(
    (key) => (
      clean(value?.[key]).length > 0
      && !/\bundefined\b/.test(clean(value?.[key]))
    ),
  )
}
