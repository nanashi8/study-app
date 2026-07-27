const CURLY_APOSTROPHE_RE = /[’‘]/g
const DASH_RE = /[‐‑‒–—-]/g

// 大文字小文字と句読点は採点しない。綴り・縮約形・語順は採点する。
export function normalizeDictationText(text) {
  return (text ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(CURLY_APOSTROPHE_RE, "'")
    .replace(DASH_RE, ' ')
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const dictationTokens = (text) => {
  const normalized = normalizeDictationText(text)
  return normalized ? normalized.split(' ') : []
}

// 語単位の Levenshtein アラインメント。
// UI は target を基準に missing/substitution を示し、余計な語も別に表示できる。
export function alignDictationWords(targetText, answerText) {
  const target = dictationTokens(targetText)
  const answer = dictationTokens(answerText)
  const rows = target.length + 1
  const cols = answer.length + 1
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0))

  for (let i = 0; i < rows; i++) dp[i][0] = i
  for (let j = 0; j < cols; j++) dp[0][j] = j

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const substitution = dp[i - 1][j - 1] + (target[i - 1] === answer[j - 1] ? 0 : 1)
      const deletion = dp[i - 1][j] + 1
      const insertion = dp[i][j - 1] + 1
      dp[i][j] = Math.min(substitution, deletion, insertion)
    }
  }

  const alignment = []
  let i = target.length
  let j = answer.length
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      target[i - 1] === answer[j - 1] &&
      dp[i][j] === dp[i - 1][j - 1]
    ) {
      alignment.push({
        target: target[i - 1],
        answer: answer[j - 1],
        status: 'correct',
      })
      i--
      j--
      continue
    }

    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      alignment.push({
        target: target[i - 1],
        answer: answer[j - 1],
        status: 'incorrect',
      })
      i--
      j--
      continue
    }

    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      alignment.push({
        target: target[i - 1],
        answer: '',
        status: 'missing',
      })
      i--
      continue
    }

    alignment.push({
      target: '',
      answer: answer[j - 1],
      status: 'extra',
    })
    j--
  }

  return {
    target,
    answer,
    distance: dp[target.length][answer.length],
    alignment: alignment.reverse(),
  }
}

export function scoreDictation(answerText, targetText, { passScore = 90 } = {}) {
  const aligned = alignDictationWords(targetText, answerText)
  const denominator = Math.max(aligned.target.length, aligned.answer.length, 1)
  const score = Math.max(0, Math.round((1 - aligned.distance / denominator) * 100))
  const correctWords = aligned.alignment.filter((part) => part.status === 'correct').length
  return {
    ...aligned,
    score,
    correctWords,
    exact: aligned.distance === 0,
    passed: score >= passScore,
  }
}
