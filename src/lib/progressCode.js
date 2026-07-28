// 進捗コードの発行・読込。
// 学習状態を JSON → lz-string で圧縮し、URIセーフな文字列にする。
// 静的サイト（github.io）でもバックエンド無しで進捗を持ち運べる。
import LZString from 'lz-string'

const CODE_VERSION = 1
const PREFIX = 'EQ1-' // EigoQuest v1。先頭でアプリ/バージョンを判別する。
const isRecord = (value) =>
  !!value && typeof value === 'object' && !Array.isArray(value)

// 状態のうち「持ち運ぶ」部分だけを抜き出す。
// importCode / pullOrInit が読む全フィールドを網羅し、QR/コードで端末を
// 移っても古文・並び順まで丸ごと「続きから」復元できるようにする。
export function buildPayload(state) {
  return {
    v: CODE_VERSION,
    srs: state.srs,
    kotenSrs: state.kotenSrs,
    kotenInterpretationSrs: state.kotenInterpretationSrs,
    myList: state.myList,
    myGrammarList: state.myGrammarList,
    writingProgress: state.writingProgress,
    kotenWordList: state.kotenWordList,
    kotenGrammarList: state.kotenGrammarList,
    readingsDone: state.readingsDone,
    mathDone: state.mathDone,
    mathMastery: state.mathMastery,
    skillStats: state.skillStats,
    learningAnalytics: state.learningAnalytics,
    diagnosticHistory: state.diagnosticHistory,
    diagnosticAttempt: state.diagnosticAttempt,
    diagnosticSeed: state.diagnosticSeed,
    engPos: state.engPos,
    vnCleared: state.vnCleared,
    portalOrder: state.portalOrder,
    portalHidden: state.portalHidden,
    stats: state.stats,
    settings: state.settings,
  }
}

export function encodeProgress(state) {
  const json = JSON.stringify(buildPayload(state))
  return PREFIX + LZString.compressToEncodedURIComponent(json)
}

export function decodeProgress(code) {
  const trimmed = (code || '').trim()
  if (!trimmed) throw new Error('コードが空です。')
  if (!trimmed.startsWith(PREFIX)) {
    throw new Error('コードの形式が違います（先頭が「EQ1-」のはずです）。')
  }
  const body = trimmed.slice(PREFIX.length)
  const json = LZString.decompressFromEncodedURIComponent(body)
  if (!json) throw new Error('コードを復元できませんでした。途中で欠けていないか確認してください。')
  let payload
  try {
    payload = JSON.parse(json)
  } catch {
    throw new Error('コードの中身を読み取れませんでした。')
  }
  if (!isRecord(payload) || !('v' in payload)) {
    throw new Error('コードの中身が不正です。')
  }
  if (payload.v !== CODE_VERSION) {
    throw new Error(`この進捗コードのバージョン（${payload.v}）には対応していません。`)
  }

  const recordFields = [
    'srs',
    'kotenSrs',
    'kotenInterpretationSrs',
    'mathMastery',
    'skillStats',
    'learningAnalytics',
    'writingProgress',
    'stats',
    'settings',
  ]
  const arrayFields = [
    'myList',
    'myGrammarList',
    'kotenWordList',
    'kotenGrammarList',
    'readingsDone',
    'mathDone',
    'diagnosticHistory',
    'vnCleared',
    'portalOrder',
    'portalHidden',
  ]
  for (const field of recordFields) {
    if (field in payload && !isRecord(payload[field])) {
      throw new Error(`コードの ${field} が不正です。`)
    }
  }
  for (const field of arrayFields) {
    if (field in payload && !Array.isArray(payload[field])) {
      throw new Error(`コードの ${field} が不正です。`)
    }
  }
  if ('engPos' in payload && payload.engPos !== null && !Number.isFinite(payload.engPos)) {
    throw new Error('コードの engPos が不正です。')
  }
  if (
    'diagnosticAttempt' in payload
    && (!Number.isSafeInteger(payload.diagnosticAttempt) || payload.diagnosticAttempt < 0)
  ) {
    throw new Error('コードの diagnosticAttempt が不正です。')
  }
  if (
    'diagnosticSeed' in payload
    && payload.diagnosticSeed !== null
    && (
      !Number.isInteger(payload.diagnosticSeed)
      || payload.diagnosticSeed < 0
      || payload.diagnosticSeed > 0xffffffff
    )
  ) {
    throw new Error('コードの diagnosticSeed が不正です。')
  }
  return payload
}

// 読込前のプレビュー用に、コードの中身を要約する。
export function summarizePayload(payload, isWordId = () => true) {
  const srs = payload.srs ?? {}
  const wordIds = Object.keys(srs).filter(isWordId)
  const mastered = wordIds.filter((id) => (srs[id]?.box ?? 0) >= 4).length
  return {
    words: wordIds.length,
    mastered,
    myList: (payload.myList ?? []).length,
    myGrammar: (payload.myGrammarList ?? []).length,
    writing: Object.values(payload.writingProgress ?? {}).filter(
      (item) => (item?.completed ?? 0) > 0,
    ).length,
    xp: payload.stats?.xp ?? 0,
    streak: payload.stats?.streak ?? 0,
  }
}
