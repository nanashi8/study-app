// 進捗コードの発行・読込。
// 学習状態を JSON → lz-string で圧縮し、URIセーフな文字列にする。
// 静的サイト（github.io）でもバックエンド無しで進捗を持ち運べる。
import LZString from 'lz-string'

const CODE_VERSION = 1
const PREFIX = 'EQ1-' // EigoQuest v1。先頭でアプリ/バージョンを判別する。

// 状態のうち「持ち運ぶ」部分だけを抜き出す。
export function buildPayload(state) {
  return {
    v: CODE_VERSION,
    srs: state.srs,
    myList: state.myList,
    readingsDone: state.readingsDone,
    mathDone: state.mathDone,
    mathMastery: state.mathMastery,
    skillStats: state.skillStats,
    engPos: state.engPos,
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
  if (!payload || typeof payload !== 'object' || !('v' in payload)) {
    throw new Error('コードの中身が不正です。')
  }
  return payload
}

// 読込前のプレビュー用に、コードの中身を要約する。
export function summarizePayload(payload) {
  const srs = payload.srs ?? {}
  const wordIds = Object.keys(srs)
  const mastered = wordIds.filter((id) => (srs[id]?.box ?? 0) >= 4).length
  return {
    words: wordIds.length,
    mastered,
    myList: (payload.myList ?? []).length,
    xp: payload.stats?.xp ?? 0,
    streak: payload.stats?.streak ?? 0,
  }
}
