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

function resultStatus(accuracy) {
  if (accuracy >= 0.75) return 'strength'
  if (accuracy >= 0.5) return 'steady'
  return 'focus'
}

function summarizeReviewItems(items) {
  const total = items.length
  const correct = items.filter((item) => item.isCorrect).length
  const unknown = items.filter((item) => item.isUnknown).length
  const incorrect = Math.max(0, total - correct - unknown)
  const accuracy = total ? correct / total : 0
  return {
    correct,
    total,
    unknown,
    incorrect,
    accuracy,
    status: resultStatus(accuracy),
  }
}

// 28問を「7級 × 4分野」の成績表へ整形する。各マスの設問数も返し、
// 将来問題数が変わっても「1問だけの評価」を断定的に見せない。
export function buildDiagnosticPerformanceReport(questions, answers) {
  const reviewItems = buildDiagnosticAnswerReview(questions, answers)
  const skills = DIAGNOSTIC_SKILLS.map((skill) => ({
    id: skill.id,
    label: skill.label,
    shortLabel: skill.shortLabel,
    ...summarizeReviewItems(
      reviewItems.filter((item) => item.question.skill === skill.id),
    ),
  }))
  const levels = DIAGNOSTIC_LEVELS.map((level) => ({
    id: level.id,
    label: level.label,
    ...summarizeReviewItems(
      reviewItems.filter((item) => item.question.level === level.id),
    ),
  }))
  const matrix = levels.map((level) => ({
    ...level,
    cells: DIAGNOSTIC_SKILLS.map((skill) => {
      const summary = summarizeReviewItems(
        reviewItems.filter(
          (item) =>
            item.question.level === level.id
            && item.question.skill === skill.id,
        ),
      )
      return {
        levelId: level.id,
        skillId: skill.id,
        ...summary,
        mark:
          summary.total === 0 ? 'empty'
            : summary.correct === summary.total ? 'correct'
              : summary.unknown === summary.total ? 'unknown'
                : 'incorrect',
      }
    }),
  }))

  return { skills, levels, matrix }
}

const STUDY_ACTIONS = {
  vocab: {
    routeLabel: '級別英単語',
    duration: 15,
    first:
      '英単語10語を、英語→意味で確認したあと、日本語だけを見て英語を声に出します。',
    recall:
      '同じ10語を答えを隠して再テストし、思い出せなかった語だけマイ単語で復習します。',
    transfer:
      '覚えた語を含む例文を読み、意味を文の中でも取り出せるか確かめます。',
  },
  grammar: {
    routeLabel: '文法・構文レッスン',
    duration: 15,
    first:
      '該当級の文法・構文を1単元だけ学び、ルール→例文→確認問題5問の順で進めます。',
    recall:
      '例文の一部を隠して構文を組み立て直し、同じ単元の確認問題を解きます。',
    transfer:
      '別の例文でも同じルールを使えるか、単元クイズで確かめます。',
  },
  usage: {
    routeLabel: '熟語・語法',
    duration: 15,
    first:
      '熟語10個を例文ごと音読し、英語を隠して意味のまとまりを思い出します。',
    recall:
      '同じ熟語を例文の空所で再テストし、前置詞や語順まで言えるか確かめます。',
    transfer:
      '似た熟語を混ぜたクイズで、文脈に合う表現を選び分けます。',
  },
  reading: {
    routeLabel: '級別長文',
    duration: 20,
    first:
      '短い長文を1本読み、各設問の答えだけでなく根拠になった一文を指で確認します。',
    recall:
      '同じ本文を見ずに要点を一文で思い出してから、根拠箇所をもう一度探します。',
    transfer:
      '同じ級の別の長文を1本解き、要点と根拠を取り違えないか確かめます。',
  },
}

const DEFAULT_STUDY_HOUR = 19

function validDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date() : date
}

function scheduledAt(baseDate, offsetDays, hour) {
  const date = new Date(baseDate)
  date.setDate(date.getDate() + offsetDays)
  date.setHours(hour, 0, 0, 0)
  return date.toISOString()
}

function timeRecommendation(analysis) {
  const bestWindow = analysis?.bestWindow
  const hasWindow =
    Number.isInteger(bestWindow?.start)
    && bestWindow.start >= 0
    && bestWindow.start <= 23
    && Number(bestWindow.scored) >= 5
  const windowHours = hasWindow
    ? [bestWindow.start, (bestWindow.start + 1) % 24, (bestWindow.start + 2) % 24]
    : []
  const strongestHour = (Array.isArray(analysis?.hourly) ? analysis.hourly : [])
    .filter((hour) => windowHours.includes(hour?.hour) && Number(hour?.scored) > 0)
    .sort(
      (a, b) =>
        (Number(b.efficiency) || 0) - (Number(a.efficiency) || 0)
        || Number(b.scored) - Number(a.scored),
    )[0]
  const windowStartHour = hasWindow ? bestWindow.start : DEFAULT_STUDY_HOUR
  const startHour = hasWindow
    ? strongestHour?.hour ?? bestWindow.start
    : DEFAULT_STUDY_HOUR
  const endHour = hasWindow
    ? Number.isInteger(bestWindow.end)
      ? bestWindow.end
      : (windowStartHour + 3) % 24
    : (DEFAULT_STUDY_HOUR + 1) % 24
  const readiness = analysis?.trackingReadiness ?? 'empty'
  const stable = readiness === 'stable'

  return {
    startHour,
    windowStartHour,
    endHour,
    personalized: hasWindow,
    provisional: !hasWindow || !stable,
    sampleSize: hasWindow ? Number(bestWindow.scored) : 0,
    evidence: hasWindow
      ? stable
        ? `時刻別の採点済み回答を比べ、この時間帯の成績が最も安定しています（${bestWindow.scored}回答）。`
        : `今ある時刻別記録では、この時間帯の成績が最も高い傾向です（${bestWindow.scored}回答）。まだ暫定なので、学習が増えると更新します。`
      : '時刻別データがまだ足りないため、続けやすい19:00を仮設定しました。各時間帯の回答が増えると個別の時間へ更新します。',
  }
}

function memoryEvidence(analysis) {
  if (!analysis || !Number(analysis.learnedItems)) {
    return {
      available: false,
      text:
        '定着段階のデータはまだ少ないため、今回は診断の正誤を主な根拠にしています。',
    }
  }
  const fragile = Number(analysis.stages?.fragile) || 0
  return {
    available: true,
    text:
      `学習済み${analysis.learnedItems}項目の定着推定は${analysis.memoryScore}/100で、`
      + `要再学習は${fragile}項目です。`,
  }
}

// 診断の正誤、SRS定着段階、時刻別集計を、根拠付きの次回計画へまとめる。
// 質問文や本人の回答そのものは保存せず、結果画面を開いている間だけ利用する。
export function buildDiagnosticGuidance({
  result,
  questions,
  answers,
  learningAnalysis,
} = {}) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) {
    throw new Error('診断結果の形式が不正です。')
  }
  const report = buildDiagnosticPerformanceReport(questions, answers)
  const rankedSkills = [...(result.skillResults ?? [])].sort(
    (a, b) => a.accuracy - b.accuracy || a.deviation - b.deviation,
  )
  const weakestResult =
    rankedSkills.find((skill) => skill.id === result.prioritySkillId)
    ?? rankedSkills[0]
  const weakestMeta = DIAGNOSTIC_SKILLS.find(
    (skill) => skill.id === weakestResult?.id,
  )
  const weakestReport = report.skills.find(
    (skill) => skill.id === weakestResult?.id,
  )
  const strengthResult =
    (result.skillResults ?? []).find((skill) => skill.id === result.strengthSkillId)
    ?? [...(result.skillResults ?? [])].sort(
      (a, b) => b.accuracy - a.accuracy || b.deviation - a.deviation,
    )[0]
  const strengthMeta = DIAGNOSTIC_SKILLS.find(
    (skill) => skill.id === strengthResult?.id,
  )
  const weakRows = report.matrix.filter(
    (row) => row.cells.find((cell) => cell.skillId === weakestResult?.id)?.mark !== 'correct',
  )
  const firstGap = weakRows[0]
  const action = STUDY_ACTIONS[weakestResult?.id] ?? STUDY_ACTIONS.vocab
  const hasErrors = Boolean(weakestReport && weakestReport.correct < weakestReport.total)
  const tiedAtBottom = rankedSkills.filter(
    (skill) => skill.accuracy === weakestResult?.accuracy,
  ).length
  const weakLevelLabels = weakRows.map((row) => row.label)
  const shownWeakLevels = weakLevelLabels.slice(0, 3).join('・')
  const remainingWeakLevels = Math.max(0, weakLevelLabels.length - 3)
  const weakLevelText = remainingWeakLevels
    ? `${shownWeakLevels}ほか${remainingWeakLevels}級`
    : shownWeakLevels

  const recommendation = hasErrors
    ? {
        kind: 'foundation',
        skillId: weakestResult.id,
        screen: weakestMeta?.screen ?? 'englishMap',
        routeLabel: action.routeLabel,
        targetLevelId: firstGap?.id ?? result.estimatedLevel?.id,
        targetLevelLabel: firstGap?.label ?? result.estimatedLevel?.label,
        title: `英検${firstGap?.label ?? result.estimatedLevel?.label}の${weakestMeta?.label}`,
        evidence: [
          `${weakestMeta?.label}は${weakestReport.correct}/${weakestReport.total}問（${Math.round(weakestReport.accuracy * 100)}%）で、4分野の${tiedAtBottom > 1 ? '中で最も低いグループ' : '中で最も低い分野'}です。`,
          `${weakLevelText}で要確認が${weakestReport.total - weakestReport.correct}問${weakestReport.unknown ? `（「わからない」${weakestReport.unknown}問）` : ''}ありました。`,
          strengthResult?.accuracy > weakestResult.accuracy
            ? `一方、${strengthMeta?.label}は${strengthResult.correct}/${strengthResult.total}問で、比較すると優先順位が明確です。`
            : tiedAtBottom > 1
              ? `同率の弱点が${tiedAtBottom}分野あるため、英検${firstGap?.label ?? result.estimatedLevel?.label}の${weakestMeta?.label}から一つずつ進めます。`
              : null,
        ].filter(Boolean),
        reason:
          `最初のつまずきが英検${firstGap?.label ?? result.estimatedLevel?.label}にあるため、`
          + '難しい級を先に解き続けるより、ここから土台をつなぎ直すほうが次の級にも使えます。',
        firstAction: action.first,
        duration: action.duration,
      }
    : {
        kind: 'stretch',
        skillId: null,
        screen: 'englishMap',
        routeLabel: '英語学習マップ',
        targetLevelId: result.estimatedLevel?.id,
        targetLevelLabel: result.estimatedLevel?.label,
        title: `英検${result.estimatedLevel?.label}目安の総合演習`,
        evidence: [
          `今回の4分野はすべて${result.skillResults?.[0]?.total ?? 7}問中${result.skillResults?.[0]?.total ?? 7}問正解でした。`,
          `英検級別でも全${result.levelResults?.length ?? 7}級の問題に正解し、今回の設問では明確な弱点が見つかりませんでした。`,
        ],
        reason:
          '同じ問題の見直しより、現在地に合う別問題で再現できるか確かめると、実力として定着しているか判断できます。',
        firstAction:
          '学習マップの適応問題を解き、別の単語・構文・熟語・長文でも同じ正答率を保てるか確かめます。',
        duration: 15,
      }

  const time = timeRecommendation(learningAnalysis)
  const baseDate = validDate(result.completedAt)
  const memory = memoryEvidence(learningAnalysis)
  const recallTask = hasErrors
    ? action.recall
    : '今回とは別の総合問題を、答えを見ずに解いて現在地を確かめます。'
  const transferTask = hasErrors
    ? action.transfer
    : '単語・構文・熟語・長文を混ぜた問題で、分野をまたいでも解けるか確かめます。'

  return {
    report,
    recommendation,
    time,
    memory,
    schedule: [
      {
        id: 'next',
        offsetDays: 1,
        at: scheduledAt(baseDate, 1, time.startHour),
        label: '次回',
        title: hasErrors
          ? `英検${recommendation.targetLevelLabel}の${weakestMeta?.label}`
          : '総合問題で再チェック',
        task: recallTask,
        duration: recommendation.duration,
        screen: recommendation.screen,
      },
      {
        id: 'three-days',
        offsetDays: 3,
        at: scheduledAt(baseDate, 3, time.startHour),
        label: '3日後',
        title: hasErrors ? `${weakestMeta?.label}を別問題で確認` : '別の総合問題',
        task: transferTask,
        duration: recommendation.duration,
        screen: recommendation.screen,
      },
      {
        id: 'seven-days',
        offsetDays: 7,
        at: scheduledAt(baseDate, 7, time.startHour),
        label: '7日後',
        title: '4分野ミックスで定着確認',
        task:
          '単語・文法構文・熟語・長文を混ぜて解き、正答率が上がったか次の診断前に確認します。',
        duration: 15,
        screen: 'englishMap',
      },
    ],
  }
}

export function latestDiagnostic(history) {
  return Array.isArray(history) && history.length ? history[0] : null
}
