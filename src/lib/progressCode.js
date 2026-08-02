// 進捗コードの発行・読込。
// 学習状態を JSON → lz-string で圧縮し、URIセーフな文字列にする。
// 静的サイト（github.io）でもバックエンド無しで進捗を持ち運べる。
import LZString from 'lz-string'
import {
  MAX_BATTLE_STARS,
  isBattleThemeId,
} from './battleThemes.js'
import { isRestorableBattleStudentId } from './battleCast.js'
import {
  battleTraitPointsSpent,
  isValidBattleTraitInvestments,
} from './battleTraits.js'
import { MAX_BATTLE_STORY_STEP } from './afterSchoolStory.js'
import {
  isValidAfterSchoolBonds,
  isValidUnlockedBattleStudentIds,
  normalizeAfterSchoolBonds,
  normalizeUnlockedBattleStudentIds,
} from './afterSchoolBonds.js'
import {
  isValidStoryKeyVisualAlbum,
  normalizeStoryKeyVisualAlbum,
  storyKeyVisualAlbumCount,
} from './storyAlbum.js'
import { normalizeVocabHistory } from './vocabHistory.js'

const CODE_VERSION = 1
const PREFIX = 'EQ1-' // EigoQuest v1。先頭でアプリ/バージョンを判別する。
const isRecord = (value) =>
  !!value && typeof value === 'object' && !Array.isArray(value)

// 端末保存・進捗コード・クラウド同期・「学習の記録」画面で共有する永続項目。
// 項目追加時に各経路へ手書きで転記すると購読漏れが起きるため、ここを唯一の一覧にする。
export const PERSISTED_PROGRESS_FIELDS = Object.freeze([
  'srs',
  'etymologySrs',
  'kotenSrs',
  'kotenGrammarSrs',
  'kotenCultureSrs',
  'kotenInterpretationSrs',
  'myList',
  'vocabHistory',
  'myGrammarList',
  'writingProgress',
  'kotenWordList',
  'kotenGrammarList',
  'kotenCultureList',
  'readingsDone',
  'mathDone',
  'mathMastery',
  'skillStats',
  'learningAnalytics',
  'diagnosticHistory',
  'diagnosticAttempt',
  'diagnosticSeed',
  'engPos',
  'battleRelicLevel',
  'battleStars',
  'battleXpSpent',
  'battleThemeId',
  'battleStudentId',
  'battleTraitInvestments',
  'battleStoryStep',
  'battleStoryLastDay',
  'afterSchoolBonds',
  'unlockedBattleStudentIds',
  'storyKeyVisualAlbum',
  'portalOrder',
  'portalHidden',
  'stats',
  'settings',
])

export function selectProgressState(state = {}) {
  return Object.fromEntries(
    PERSISTED_PROGRESS_FIELDS.map((field) => [field, state[field]]),
  )
}

// 状態のうち「持ち運ぶ」部分だけを抜き出す。
// importCode / pullOrInit が読む全フィールドを網羅し、QR/コードで端末を
// 移っても古文・並び順まで丸ごと「続きから」復元できるようにする。
export function buildPayload(state = {}) {
  return {
    v: CODE_VERSION,
    ...selectProgressState(state),
    vocabHistory: normalizeVocabHistory(state.vocabHistory),
    afterSchoolBonds: normalizeAfterSchoolBonds(state.afterSchoolBonds),
    unlockedBattleStudentIds: normalizeUnlockedBattleStudentIds(
      state.unlockedBattleStudentIds,
    ),
    storyKeyVisualAlbum: normalizeStoryKeyVisualAlbum(state.storyKeyVisualAlbum),
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
    'etymologySrs',
    'kotenSrs',
    'kotenGrammarSrs',
    'kotenCultureSrs',
    'kotenInterpretationSrs',
    'mathMastery',
    'skillStats',
    'learningAnalytics',
    'writingProgress',
    'battleTraitInvestments',
    'afterSchoolBonds',
    'storyKeyVisualAlbum',
    'stats',
    'settings',
  ]
  const arrayFields = [
    'myList',
    'vocabHistory',
    'myGrammarList',
    'kotenWordList',
    'kotenGrammarList',
    'kotenCultureList',
    'readingsDone',
    'mathDone',
    'diagnosticHistory',
    'portalOrder',
    'portalHidden',
    'unlockedBattleStudentIds',
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
    'battleRelicLevel' in payload
    && payload.battleRelicLevel !== null
    && (
      !Number.isSafeInteger(payload.battleRelicLevel)
      || payload.battleRelicLevel < 1
      || payload.battleRelicLevel > 99
    )
  ) {
    throw new Error('コードの battleRelicLevel が不正です。')
  }
  if (
    'battleStars' in payload
    && (
      !Number.isSafeInteger(payload.battleStars)
      || payload.battleStars < 0
      || payload.battleStars > MAX_BATTLE_STARS
    )
  ) {
    throw new Error('コードの battleStars が不正です。')
  }
  if (
    'battleXpSpent' in payload
    && (
      !Number.isSafeInteger(payload.battleXpSpent)
      || payload.battleXpSpent < 0
      || (
        Number.isFinite(payload.stats?.xp)
        && payload.battleXpSpent > Math.max(0, Math.floor(payload.stats.xp))
      )
    )
  ) {
    throw new Error('コードの battleXpSpent が不正です。')
  }
  if (
    'battleThemeId' in payload
    && !isBattleThemeId(payload.battleThemeId)
  ) {
    throw new Error('コードの battleThemeId が不正です。')
  }
  if (
    'battleStudentId' in payload
    && !isRestorableBattleStudentId(payload.battleStudentId)
  ) {
    throw new Error('コードの battleStudentId が不正です。')
  }
  if (
    'battleTraitInvestments' in payload
    && !isValidBattleTraitInvestments(
      payload.battleTraitInvestments,
      payload.battleStars,
    )
  ) {
    throw new Error('コードの battleTraitInvestments が不正です。')
  }
  if (
    'battleStoryStep' in payload
    && (
      !Number.isSafeInteger(payload.battleStoryStep)
      || payload.battleStoryStep < 0
      || payload.battleStoryStep > MAX_BATTLE_STORY_STEP
    )
  ) {
    throw new Error('コードの battleStoryStep が不正です。')
  }
  if (
    'battleStoryLastDay' in payload
    && payload.battleStoryLastDay !== null
    && (
      !Number.isSafeInteger(payload.battleStoryLastDay)
      || payload.battleStoryLastDay < 0
    )
  ) {
    throw new Error('コードの battleStoryLastDay が不正です。')
  }
  if (
    'afterSchoolBonds' in payload
    && !isValidAfterSchoolBonds(payload.afterSchoolBonds)
  ) {
    throw new Error('コードの afterSchoolBonds が不正です。')
  }
  if (
    'unlockedBattleStudentIds' in payload
    && !isValidUnlockedBattleStudentIds(payload.unlockedBattleStudentIds)
  ) {
    throw new Error('コードの unlockedBattleStudentIds が不正です。')
  }
  if (
    'storyKeyVisualAlbum' in payload
    && !isValidStoryKeyVisualAlbum(payload.storyKeyVisualAlbum)
  ) {
    throw new Error('コードの storyKeyVisualAlbum が不正です。')
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
  const etymologySrs = payload.etymologySrs ?? {}
  const wordIds = Object.keys(srs).filter(isWordId)
  const mastered = wordIds.filter((id) => (srs[id]?.box ?? 0) >= 4).length
  return {
    words: wordIds.length,
    mastered,
    etymologyStarted: Object.keys(etymologySrs).length,
    etymologyMastered: Object.values(etymologySrs).filter(
      (entry) => (entry?.box ?? 0) >= 4,
    ).length,
    myList: (payload.myList ?? []).length,
    myGrammar: (payload.myGrammarList ?? []).length,
    writing: Object.values(payload.writingProgress ?? {}).filter(
      (item) => (item?.completed ?? 0) > 0,
    ).length,
    xp: payload.stats?.xp ?? 0,
    streak: payload.stats?.streak ?? 0,
    battleStars: payload.battleStars ?? 0,
    battleXpSpent: payload.battleXpSpent ?? 0,
    battleTraitPoints: battleTraitPointsSpent(payload.battleTraitInvestments),
    battleStoryStep: payload.battleStoryStep ?? 0,
    unlockedBattleStudents: (payload.unlockedBattleStudentIds ?? []).length,
    keyVisualMemories: storyKeyVisualAlbumCount(payload.storyKeyVisualAlbum),
  }
}
