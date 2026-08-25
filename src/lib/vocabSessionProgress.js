import {
  buildDeck,
  SESSION_SIZE,
} from './session.js'
import { completedSessionDestination } from './navigationPolicy.js'

function uniqueWordIds(...groups) {
  return [...new Set(groups.flatMap((group) => (
    Array.isArray(group) ? group.filter((id) => typeof id === 'string' && id) : []
  )))]
}

function nextSessionCount(requestedSize, storedSize, remainingCount) {
  const rawSize = requestedSize ?? storedSize
  const size = Math.floor(Number(rawSize))
  if (size === 0) return remainingCount
  if (!Number.isFinite(size) || size < 1) {
    return Math.min(SESSION_SIZE, remainingCount)
  }
  return Math.min(size, remainingCount)
}

/**
 * 英単語の結果画面で「次へ進む」を押したときの行き先を決める。
 * 同じ連続学習で終えた語を引き継ぎ、対象を一巡するまで再出題しない。
 * 「復習する」で作った明示的な復習セッションは continueTo を優先する。
 */
export function vocabularySessionContinuation(
  params = {},
  {
    srs = {},
    storedSize = SESSION_SIZE,
    now = Date.now(),
  } = {},
) {
  const source = params.source ?? { type: 'due' }
  const mode = params.mode === 'quiz' ? 'quiz' : 'study'
  const previousCycleIds = params.vocabSession?.cycleIds
  const currentIds = params.vocabSession?.wordIds
  const cycleIds = uniqueWordIds(previousCycleIds, currentIds)

  if (params.continueTo?.screen) {
    return {
      destination: {
        screen: params.continueTo.screen,
        params: params.continueTo.params ?? {},
        ...(params.continueTo.label ? { label: params.continueTo.label } : {}),
      },
      cycleIds,
      remainingCount: null,
      nextCount: null,
      exhausted: false,
      label: params.continueTo.label ?? '次へ進む',
    }
  }

  const remainingCount = buildDeck(source, {
    srs,
    size: 0,
    purpose: mode,
    excludeIds: cycleIds,
    now,
  }).length

  if (!remainingCount) {
    return {
      destination: completedSessionDestination(params),
      cycleIds,
      remainingCount: 0,
      nextCount: 0,
      exhausted: true,
      label: mode === 'quiz' ? 'テストを終える' : '学習を終える',
    }
  }

  const selectableCount = buildDeck(source, {
    srs,
    size: 0,
    purpose: mode,
    cycleIds,
    now,
  }).length
  const requestedCount = nextSessionCount(params.size, storedSize, selectableCount)
  const nextCount = buildDeck(source, {
    srs,
    size: requestedCount,
    purpose: mode,
    cycleIds,
    now,
  }).length
  return {
    destination: {
      screen: mode === 'quiz' ? 'vocabQuiz' : 'vocabStudy',
      params: {
        source,
        title: params.title,
        mode,
        engine: 'word',
        size: params.size,
        returnTo: params.returnTo,
        vocabCycleIds: cycleIds,
      },
    },
    cycleIds,
    remainingCount,
    nextCount,
    exhausted: false,
    label: `次の${nextCount}語へ`,
  }
}
