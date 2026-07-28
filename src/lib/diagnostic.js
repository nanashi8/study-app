import {
  DIAGNOSTIC_LEVELS,
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_SKILLS,
  DIAGNOSTIC_VERSION,
} from '../data/diagnostic.js'
import { UNKNOWN_CHOICE_ID } from './quizChoices.js'

export const UNKNOWN_DIAGNOSTIC_ANSWER = UNKNOWN_CHOICE_ID

const THETA_MIN = -3.5
const THETA_MAX = 3.5
const THETA_STEP = 0.05
const DISCRIMINATION = 1.25

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

// 4択の偶然正答率を下限に含めた1パラメータ項目反応モデル。
// difficulty と theta は診断テスト内だけで使う標準化尺度。
export function probabilityCorrect(theta, difficulty, choiceCount = 4) {
  const guessing = 1 / Math.max(2, choiceCount)
  const logistic = 1 / (1 + Math.exp(-DISCRIMINATION * (theta - difficulty)))
  return guessing + (1 - guessing) * logistic
}

function posterior(items, answers) {
  const points = []
  let maxLogWeight = -Infinity

  for (let theta = THETA_MIN; theta <= THETA_MAX + 1e-9; theta += THETA_STEP) {
    // 標準正規分布を事前分布にして、少数問の極端な推定を抑える。
    let logWeight = -(theta * theta) / 2
    for (const item of items) {
      const p = clamp(
        probabilityCorrect(theta, item.difficulty, item.choices.length),
        1e-9,
        1 - 1e-9,
      )
      logWeight += answers[item.id] === item.answer ? Math.log(p) : Math.log(1 - p)
    }
    points.push({ theta, logWeight })
    maxLogWeight = Math.max(maxLogWeight, logWeight)
  }

  let totalWeight = 0
  let weightedTheta = 0
  for (const point of points) {
    point.weight = Math.exp(point.logWeight - maxLogWeight)
    totalWeight += point.weight
    weightedTheta += point.theta * point.weight
  }

  const theta = weightedTheta / totalWeight
  let variance = 0
  for (const point of points) {
    variance += point.weight * (point.theta - theta) ** 2
  }
  variance /= totalWeight
  return { theta, standardError: Math.sqrt(variance) }
}

function deviationFromTheta(theta) {
  return Math.round(clamp(50 + theta * 10, 25, 75))
}

function deviationBand(deviation) {
  if (deviation >= 65) return 'とても高い'
  if (deviation >= 55) return '高め'
  if (deviation >= 45) return '標準域'
  if (deviation >= 35) return '基礎固め'
  return '入門から確認'
}

function nearestLevel(theta) {
  return DIAGNOSTIC_LEVELS.reduce((best, level, index) => {
    const distance = Math.abs(theta - level.difficulty)
    return distance < best.distance ? { ...level, index, distance } : best
  }, { ...DIAGNOSTIC_LEVELS[0], index: 0, distance: Infinity })
}

function scoreItems(items, answers) {
  const correct = items.reduce(
    (count, item) => count + Number(answers[item.id] === item.answer),
    0,
  )
  const estimate = posterior(items, answers)
  const deviation = deviationFromTheta(estimate.theta)
  return {
    correct,
    total: items.length,
    accuracy: items.length ? correct / items.length : 0,
    theta: estimate.theta,
    standardError: estimate.standardError,
    deviation,
  }
}

function skillStatus(accuracy) {
  if (accuracy >= 0.75) return 'strength'
  if (accuracy >= 0.5) return 'steady'
  return 'focus'
}

export function scoreDiagnostic(
  answers,
  {
    questions = DIAGNOSTIC_QUESTIONS,
    completedAt = new Date().toISOString(),
    formNumber = null,
  } = {},
) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new Error('診断テストの回答形式が不正です。')
  }
  const missing = questions.filter((item) => !(item.id in answers))
  if (missing.length) {
    throw new Error(`未回答の問題が ${missing.length} 問あります。`)
  }

  const overall = scoreItems(questions, answers)
  const level = nearestLevel(overall.theta)
  const rangeRadius = Math.max(3, Math.round(overall.standardError * 10))
  const deviationLow = clamp(overall.deviation - rangeRadius, 20, 80)
  const deviationHigh = clamp(overall.deviation + rangeRadius, 20, 80)

  const skillResults = DIAGNOSTIC_SKILLS.map((skill) => {
    const items = questions.filter((item) => item.skill === skill.id)
    const result = scoreItems(items, answers)
    return {
      id: skill.id,
      correct: result.correct,
      total: result.total,
      accuracy: result.accuracy,
      deviation: result.deviation,
      status: skillStatus(result.accuracy),
    }
  })

  const levelResults = DIAGNOSTIC_LEVELS.map((itemLevel) => {
    const items = questions.filter((item) => item.level === itemLevel.id)
    const correct = items.reduce(
      (count, item) => count + Number(answers[item.id] === item.answer),
      0,
    )
    return {
      id: itemLevel.id,
      correct,
      total: items.length,
      accuracy: items.length ? correct / items.length : 0,
    }
  })

  const priority = [...skillResults].sort(
    (a, b) => a.deviation - b.deviation || a.accuracy - b.accuracy,
  )[0]
  const strength = [...skillResults].sort(
    (a, b) => b.deviation - a.deviation || b.accuracy - a.accuracy,
  )[0]
  const normalizedFormNumber = Number.isSafeInteger(formNumber) && formNumber > 0
    ? formNumber
    : null

  return {
    id: `diagnostic-v${DIAGNOSTIC_VERSION}${normalizedFormNumber ? `-f${normalizedFormNumber}` : ''}-${completedAt}`,
    version: DIAGNOSTIC_VERSION,
    ...(normalizedFormNumber ? { formNumber: normalizedFormNumber } : {}),
    completedAt,
    score: overall.correct,
    total: overall.total,
    accuracy: overall.accuracy,
    deviation: overall.deviation,
    deviationLow,
    deviationHigh,
    band: deviationBand(overall.deviation),
    estimatedLevel: {
      id: level.id,
      label: level.label,
      sub: level.sub,
      color: level.color,
    },
    position: level.index,
    skillResults,
    levelResults,
    prioritySkillId: priority.status === 'strength' ? null : priority.id,
    strengthSkillId: strength.id,
  }
}

export function buildDiagnosticAnswerReview(questions, answers) {
  if (!Array.isArray(questions)) {
    throw new Error('診断テストの問題形式が不正です。')
  }
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new Error('診断テストの回答形式が不正です。')
  }

  return questions.map((question, index) => {
    const selectedAnswer = answers[question.id]
    return {
      question,
      questionNumber: index + 1,
      selectedAnswer,
      isCorrect: selectedAnswer === question.answer,
      isUnknown: selectedAnswer === UNKNOWN_DIAGNOSTIC_ANSWER,
    }
  })
}

export function latestDiagnostic(history) {
  return Array.isArray(history) && history.length ? history[0] : null
}
