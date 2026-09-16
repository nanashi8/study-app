import {
  buildDeck,
  buildPhraseDeck,
  SESSION_SIZE,
} from './session.js'
import { completedSessionDestination } from './navigationPolicy.js'

// 英単語と熟語・構文は、結果画面から同じ流れで続ける。
// 教材ごとに違うのは、出題の組み方・行き先の画面・数え方の単位・引き継ぐ記録の名前だけ。
const ENGINES = {
  word: {
    engine: 'word',
    build: buildDeck,
    unit: '語',
    defaultSource: { type: 'due' },
    screens: { study: 'vocabStudy', quiz: 'vocabQuiz' },
    sessionKey: 'vocabSession',
    idsKey: 'wordIds',
    cycleKey: 'vocabCycleIds',
  },
  phrase: {
    engine: 'phrase',
    build: buildPhraseDeck,
    unit: '項目',
    defaultSource: { type: 'phrase', kind: 'idiom' },
    screens: { study: 'phraseStudy', quiz: 'phraseQuiz' },
    sessionKey: 'phraseSession',
    idsKey: 'itemIds',
    cycleKey: 'phraseCycleIds',
  },
}

function uniqueIds(...groups) {
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
 * 結果画面で「次へ進む」を押したときの行き先を決める。
 * 同じ連続学習で終えた語・項目を引き継ぎ、対象を一巡するまで再出題しない。
 * 「復習する」で作った明示的な復習セッションは continueTo を優先する。
 */
function sessionContinuation(
  params,
  {
    srs = {},
    storedSize = SESSION_SIZE,
    now = Date.now(),
    // 出題バランスの指定。次の回で実際に出せる数を、同じ条件で数える。
    freshShareOverride = null,
  } = {},
  engineId = 'word',
) {
  const engine = ENGINES[engineId]
  const source = params.source ?? engine.defaultSource
  const mode = params.mode === 'quiz' ? 'quiz' : 'study'
  const record = params[engine.sessionKey] ?? {}
  const cycleIds = uniqueIds(record.cycleIds, record[engine.idsKey])

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

  const remainingCount = engine.build(source, {
    srs,
    size: 0,
    purpose: mode,
    excludeIds: cycleIds,
    now,
    freshShareOverride,
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

  const selectableCount = engine.build(source, {
    srs,
    size: 0,
    purpose: mode,
    cycleIds,
    now,
    freshShareOverride,
  }).length
  const requestedCount = nextSessionCount(params.size, storedSize, selectableCount)
  const nextCount = engine.build(source, {
    srs,
    size: requestedCount,
    purpose: mode,
    cycleIds,
    now,
    freshShareOverride,
  }).length
  return {
    destination: {
      screen: engine.screens[mode],
      params: {
        source,
        title: params.title,
        mode,
        engine: engine.engine,
        size: params.size,
        returnTo: params.returnTo,
        [engine.cycleKey]: cycleIds,
      },
    },
    cycleIds,
    remainingCount,
    nextCount,
    exhausted: false,
    label: `次の${nextCount}${engine.unit}へ`,
  }
}

/** 英単語の暗記・テストの続き。 */
export function vocabularySessionContinuation(params = {}, options = {}) {
  return sessionContinuation(params, options, 'word')
}

/** 熟語・構文の暗記・テストの続き。英単語と同じ数え方・同じ進み方で続ける。 */
export function phraseSessionContinuation(params = {}, options = {}) {
  return sessionContinuation(params, options, 'phrase')
}
