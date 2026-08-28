import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  decodeProgress,
  encodeProgress,
  selectProgressState,
} from '../lib/progressCode.js'
import { battleProgression, clampPos } from '../lib/adaptive.js'
import { getGrammarStrand, grammarStrandLevels } from '../data/grammar-strands.js'
import {
  clampStrandPos,
  nextStrandPosition,
  resolveStrandPosition,
} from '../lib/grammarStrand.js'
import {
  createLearningAnalytics,
  learningSkillForItem,
  normalizeLearningAnalytics,
  recordLearningEvent,
  recordLearningEvents,
} from '../lib/learningAnalytics.js'
import { DEFAULT_CONTENT_ORDER } from '../data/contents.js'
import {
  BATTLE_THEMES,
  battleThemeById,
  normalizeBattleStars,
} from '../lib/battleThemes.js'
import {
  normalizeLegacyStats,
  normalizeLegacyXp,
} from '../lib/legacyProgress.js'
import {
  DEFAULT_BATTLE_STUDENT_ID,
  normalizeBattleStudentId,
} from '../lib/battleCast.js'
import {
  normalizeBattleTraitInvestments,
  raiseBattleTrait,
  resetBattleStudentTraits,
} from '../lib/battleTraits.js'
import {
  normalizeBattleStoryLastDay,
  normalizeBattleStoryStep,
} from '../lib/afterSchoolStory.js'
import {
  INITIAL_UNLOCKED_BATTLE_STUDENT_IDS,
  LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
  isBattleStudentUnlocked,
  normalizeAfterSchoolBonds,
  normalizeUnlockedBattleStudentIds,
  resolveAfterSchoolReward,
} from '../lib/afterSchoolBonds.js'
import {
  normalizeStoryKeyVisualAlbum,
  recordAfterSchoolEventMemory,
  recordTeacherVictoryMemory,
  storyKeyVisualAlbumFromLegacyBonds,
} from '../lib/storyAlbum.js'
import {
  normalizeVocabHistory,
  prependVocabHistory,
} from '../lib/vocabHistory.js'
import {
  createDragonVeinProgress,
  normalizeDragonVeinProgress,
  recordDragonVeinResult,
} from '../lib/dragonVein.js'
import { learnerDestination } from '../lib/learnerVisibility.js'
import { appHomeForScreen, fallbackDestination } from '../lib/appHome.js'
import {
  createLearningNotebook,
  createNotebookSet as createNotebookSetState,
  deleteNotebookSet as deleteNotebookSetState,
  moveNotebookSetItem as moveNotebookSetItemState,
  normalizeLearningNotebook,
  recordNotebookSetLaunch as recordNotebookSetLaunchState,
  setNotebookItemSaved,
  setNotebookSetItem as setNotebookSetItemState,
  updateNotebookItem as updateNotebookItemState,
  updateNotebookSet as updateNotebookSetState,
} from '../lib/learningNotebook.js'
import { updateLearningContentPlan } from '../lib/learningContentPlan.js'
import {
  ALL_PROGRESS_RESET_GROUP_IDS,
  RESET_PRESERVED_PROGRESS_FIELDS,
  RESETTABLE_PROGRESS_FIELDS,
  progressResetFieldsForGroups,
} from '../lib/progressReset.js'
import {
  normalizeContentQuizResults,
  recordContentQuizResult as recordContentQuizResultState,
} from '../lib/contentProgress.js'
import {
  appendReviewMark,
  reviewMarksForEntry,
} from '../lib/reviewHistory.js'
import {
  MAX_SRS_BOX,
  SRS_INTERVAL_DAYS,
} from '../lib/srs.js'
import { scheduleVocabularyReview } from '../lib/vocabScheduler.js'
import { completedSessionDestination } from '../lib/navigationPolicy.js'
import { learningContentCatalogReviewCommand } from '../lib/learningContentCatalogReview.js'

// ── 学習ロジックの定数 ──────────────────────────────────────────────
// Leitner 式の間隔反復。十分に定着した後は60・90・180日の維持復習へ進む。
const INTERVALS = SRS_INTERVAL_DAYS
const MAX_BOX = MAX_SRS_BOX

// 回答結果ごとの box 変化。学習評価はSRSと正誤記録だけで扱う。
const RESULTS = {
  correct: { box: +1 }, // テスト正解
  wrong: { box: -1 }, // テスト誤答
  unknown: { box: 'reset' }, // 「わからない」
  remembered: { box: +1 }, // カードで「覚えた」
  forgot: { box: 'reset' }, // カードで「まだ」
}

const DAY_MS = 86400000

// 端末の現地日付を連続した日番号へ変換する。
// UTC の経過時間をそのまま割ると日本では午前9時に日付が変わるため、
// その時点のタイムゾーン差を加味して現地の午前0時で切り替える。
export function localDayIndexAt(
  timestamp = Date.now(),
  timezoneOffsetMinutes = new Date(timestamp).getTimezoneOffset(),
) {
  return Math.floor((timestamp - timezoneOffsetMinutes * 60000) / DAY_MS)
}

const today = (timestamp = Date.now()) => localDayIndexAt(timestamp)

// 保存済みのポータル並び順を正規化：既知のidだけ残し、未登場の新コンテンツを補う。
// 旧ポータルに独立していた英和辞書は英語アプリ内へ移したため、その旧IDを含む保存値は
// 新しい主要6コンテンツの学習順へ一度だけ移行する。移行後のユーザー並べ替えは保持する。
export function normalizeOrder(order) {
  if (Array.isArray(order) && order.includes('eigo-dict')) {
    return [...DEFAULT_CONTENT_ORDER]
  }
  const known = new Set(DEFAULT_CONTENT_ORDER)
  const seen = new Set()
  const kept = (Array.isArray(order) ? order : []).filter((id) => known.has(id) && !seen.has(id) && seen.add(id))
  const missing = DEFAULT_CONTENT_ORDER.filter((id) => !seen.has(id))
  const normalized = [...kept]
  normalized.push(...missing)
  return normalized
}

export function normalizeHidden(hidden) {
  const known = new Set(DEFAULT_CONTENT_ORDER)
  return (Array.isArray(hidden) ? hidden : []).filter((id) => known.has(id))
}

const freshStats = () => ({
  xp: 0,
  streak: 0,
  day: null, // 最後に学習した日番号
  todayCount: 0, // 今日の回答数
  answered: 0,
  correct: 0,
})

const DEFAULT_SETTINGS = {
  ttsRate: 0.9,
  ttsVoiceURI: null,
  ttsJapaneseVoiceURI: null,
  showPhonetic: true,
  autoSpeak: true,
  dailyGoal: 20,
  sessionSize: 10, // 1回の暗記・テストで出す問題数（進捗表示のタップで変更）
  revealAnswers: false, // 暗記/復習/マイ単語で、タップせず最初から意味・語源を表示する
  autoAdvanceCorrect: true, // テストで正解したら、短い確認時間の後に次の問題へ進む
}

export function normalizeSettings(settings) {
  const source = settings && typeof settings === 'object' ? settings : {}
  return Object.fromEntries(
    Object.entries(DEFAULT_SETTINGS).map(([key, fallback]) => [
      key,
      Object.hasOwn(source, key) ? source[key] : fallback,
    ]),
  )
}

function returnNavigationState(st, screen, params = {}) {
  const destination = learnerDestination(screen, params)
  let targetIndex = -1
  for (let index = st.stack.length - 1; index >= 0; index--) {
    if (st.stack[index].screen === destination.screen) {
      targetIndex = index
      break
    }
  }
  return {
    ...destination,
    stack: targetIndex >= 0 ? st.stack.slice(0, targetIndex) : [],
  }
}

export const createInitialLearningState = () => ({
  srs: {}, // wordId -> { box, correct, wrong, due, last }
  etymologySrs: {}, // 旧語源専用SRS。既存の保存・同期データを読み戻す互換用。
  kotenSrs: {}, // 古文単語の wordId -> { box, ... }（英単語と別管理。idが衝突しないよう分離）
  kotenGrammarSrs: {}, // 古典文法の grammarId -> { box, ... }
  kotenCultureSrs: {}, // 古典常識の cultureId -> { box, ... }
  kotenInterpretationSrs: {}, // 古典短文の questionId -> { box, ... }
  kanbunVocabSrs: {}, // 漢語の itemId -> { box, ... }
  kanbunGrammarSrs: {}, // 漢文法の itemId -> { box, ... }
  kanbunCultureSrs: {}, // 漢文常識の itemId -> { box, ... }
  kanbunKundokuSrs: {}, // 返り点・訓読ドリルの exerciseId -> { box, ... }
  myList: [], // [wordId]
  vocabHistory: [], // 最近検索・参照・マイ単語登録した英単語ID（新しい順）
  myGrammarList: [], // [writingGrammarId] 英作文で保存した文法カード
  learningNotebook: createLearningNotebook(), // 8分野のメモ・タグ・自作問題集
  writingProgress: {}, // exerciseId -> { completed, lastText, lastMode, lastDay, bestWords, grammarIds }
  kotenWordList: [], // [古文単語id] 登録単語
  kotenGrammarList: [], // [古典文法id] 登録文法
  kotenCultureList: [], // [古典常識id] 登録常識
  kanbunVocabList: [], // [漢語id] 登録語
  kanbunGrammarList: [], // [漢文法id] 登録文法
  kanbunCultureList: [], // [漢文常識id] 登録常識
  readingsDone: [], // [passageId | literatureId] 読了した長文・名作朗読
  mathDone: [], // [problemId] クリアした数学問題
  mathMastery: {}, // unitId -> 最高正答率(0-100) ＝ 理解度
  contentQuizResults: {}, // SRS外教材の教材ID別・直近テスト結果
  skillStats: {}, // skill -> { answered, correct, sessions, lastDay } ＝ スキル別テスト結果
  learningAnalytics: createLearningAnalytics(), // 時刻・反復間隔・正誤の匿名集計
  diagnosticHistory: [], // 学習診断の新しい順の結果（最大5件）
  diagnosticAttempt: 0, // 学習診断を開始した回数。問題候補を重複なしで順送りする
  diagnosticSeed: null, // 端末ごとの問題候補の並びを再現する符号なし32bit整数
  engPos: null, // 適応バトルの現在ポジション(0=5級…6=1級, 小数可)。null=未配置（初回に推定）
  // 文法の系統ごとの現在地。{ 系統id: その系統の級配列の添字(小数可) }。
  // 未登録の系統は成績から推定するので、ここには実際に解いた系統だけが載る。
  grammarStrandPos: {},
  battleRelicLevel: null, // バトルへ持ち込む取得済み戦利品の解放LV。nullは最新を自動選択
  battleStars: 0, // 旧ゲーム表示との保存互換用スター
  battleXpSpent: 0, // 旧保存データとの往復だけに残す不活性な互換値
  battleThemeId: BATTLE_THEMES[0].id,
  battleStudentId: DEFAULT_BATTLE_STUDENT_ID, // 放課後と魔法の言葉へ同行するクラスメイト
  battleTraitInvestments: {}, // 生徒id -> 五つの星彩パラメータへ配分したポイント
  battleStoryStep: 0, // 日常パートを読み終えた回数。学習評価とは独立
  battleStoryLastDay: null, // 日常パートを最後に表示した学習日。同日中の連続表示を防ぐ
  afterSchoolBonds: {}, // 生徒id -> { points, visits }。放課後分岐で育つ関係性
  unlockedBattleStudentIds: [...INITIAL_UNLOCKED_BATTLE_STUDENT_IDS], // 出会いイベントを終え、共闘できる生徒
  storyKeyVisualAlbum: { events: [], teacherVictories: [] }, // 出会いイベント・先生戦の振り返り
  dragonVeinProgress: createDragonVeinProgress(), // 龍脈五地点と日常の歪みを修復した記録
  portalOrder: [...DEFAULT_CONTENT_ORDER], // ポータルのタイル並び順（コンテンツid配列）
  portalHidden: [], // ポータルで非表示にしたコンテンツid
  stats: freshStats(),
  settings: { ...DEFAULT_SETTINGS },
})

export { RESET_PRESERVED_PROGRESS_FIELDS }

// 全選択・部分選択リセットの単一実行口。
// 対象項目は progressReset.js で保存契約と全件照合してから初期値へ戻す。
export function resetProgressState(
  current = {},
  groupIds = ALL_PROGRESS_RESET_GROUP_IDS,
) {
  const fields = progressResetFieldsForGroups(groupIds)
  if (!fields.length) return {}
  const fresh = createInitialLearningState()
  return {
    ...Object.fromEntries(fields.map((field) => [field, fresh[field]])),
    ...(fields.length === RESETTABLE_PROGRESS_FIELDS.length
      ? { quizSession: null, interruptedSession: null }
      : {}),
  }
}

function applyReview(
  srs,
  stats,
  wordId,
  result,
  timestamp = Date.now(),
  { adaptiveVocabulary = false } = {},
) {
  const def = RESULTS[result] ?? RESULTS.unknown
  const day = localDayIndexAt(timestamp)
  const prev = srs[wordId] ?? { box: 0, correct: 0, wrong: 0, due: day, last: null }
  const activity = result === 'remembered' || result === 'forgot' ? 'memory' : 'test'
  const remembered = result === 'correct' || result === 'remembered'
  const previousMarks = reviewMarksForEntry(prev)
  const memory = {
    passes: Math.max(0, Number(prev.memory?.passes) || 0),
    remembered: Math.max(0, Number(prev.memory?.remembered) || 0),
    forgot: Math.max(0, Number(prev.memory?.forgot) || 0),
    lastAt: Number.isFinite(prev.memory?.lastAt) ? prev.memory.lastAt : null,
    lastHour: Number.isInteger(prev.memory?.lastHour) ? prev.memory.lastHour : null,
    lastJudgment: ['remembered', 'forgot'].includes(prev.memory?.lastJudgment)
      ? prev.memory.lastJudgment
      : null,
    marks: previousMarks.memory,
  }
  const test = {
    attempts: Math.max(0, Number(prev.test?.attempts) || 0),
    correct: Math.max(0, Number(prev.test?.correct) || 0),
    wrong: Math.max(0, Number(prev.test?.wrong) || 0),
    unknown: Math.max(0, Number(prev.test?.unknown) || 0),
    lastAt: Number.isFinite(prev.test?.lastAt) ? prev.test.lastAt : null,
    lastResult: ['correct', 'wrong', 'unknown'].includes(prev.test?.lastResult)
      ? prev.test.lastResult
      : null,
    marks: previousMarks.test,
  }
  let box
  if (def.box === 'reset') box = 0
  else box = Math.max(0, Math.min(MAX_BOX, (Number(prev.box) || 0) + def.box))

  const nextMemory = activity === 'memory'
    ? {
        passes: memory.passes + 1,
        remembered: memory.remembered + (remembered ? 1 : 0),
        forgot: memory.forgot + (remembered ? 0 : 1),
        lastAt: timestamp,
        lastHour: new Date(timestamp).getHours(),
        lastJudgment: remembered ? 'remembered' : 'forgot',
        marks: appendReviewMark(memory.marks, remembered),
      }
    : memory
  const nextTest = activity === 'test'
    ? {
        attempts: test.attempts + 1,
        correct: test.correct + (result === 'correct' ? 1 : 0),
        wrong: test.wrong + (result === 'wrong' ? 1 : 0),
        unknown: test.unknown + (result === 'unknown' ? 1 : 0),
        lastAt: timestamp,
        lastResult: ['correct', 'wrong', 'unknown'].includes(result) ? result : 'unknown',
        marks: appendReviewMark(test.marks, result === 'correct'),
      }
    : test

  const updatedEntry = {
    ...prev,
    box,
    correct: Math.max(0, Number(prev.correct) || 0) + (remembered ? 1 : 0),
    wrong: Math.max(0, Number(prev.wrong) || 0) + (remembered ? 0 : 1),
    last: day,
    lastAt: timestamp,
    firstAt: Number.isFinite(prev.firstAt) ? prev.firstAt : timestamp,
    memory: nextMemory,
    test: nextTest,
  }
  const adaptiveSchedule = adaptiveVocabulary
    ? scheduleVocabularyReview({
        previousEntry: prev,
        updatedEntry,
        result,
        timestamp,
        day,
      })
    : null
  if (adaptiveSchedule) box = adaptiveSchedule.box
  const next = {
    ...updatedEntry,
    box,
    due: adaptiveSchedule?.due ?? day + INTERVALS[box],
  }

  // ── stats / streak / 今日のカウント ──
  const s = { ...stats }
  if (s.day !== day) {
    s.streak = s.day === day - 1 ? s.streak + 1 : 1
    s.todayCount = 0
    s.day = day
  }
  s.todayCount += 1
  s.answered += 1
  if (remembered) s.correct += 1
  return {
    srs: { ...srs, [wordId]: next },
    stats: s,
    reviewMeta: {
      beforeBox: prev.box ?? 0,
      afterBox: box,
      gapHours: Number.isFinite(prev.lastAt)
        ? Math.max(0, (timestamp - prev.lastAt) / 3600000)
        : null,
      repetitions: next.correct + next.wrong,
      itemId: wordId,
      activity,
      memoryPasses: nextMemory.passes,
      memoryHour: nextMemory.lastHour,
    },
  }
}

// 英作文1本の完成を、今日の学習回数・連続日数へ反映する。
function awardWriting(stats, timestamp = Date.now()) {
  const day = localDayIndexAt(timestamp)
  const next = { ...stats }
  if (next.day !== day) {
    next.streak = next.day === day - 1 ? next.streak + 1 : 1
    next.todayCount = 0
    next.day = day
  }
  next.todayCount += 1
  next.answered += 1
  next.correct += 1
  return next
}

export function migratePersistedState(persistedState) {
  const state = { ...(persistedState ?? {}) }
  // v1 に保存されていた廃止済みコンテンツの状態を、初回起動時に取り除く。
  delete state.vnCleared
  state.settings = normalizeSettings(state.settings)
  state.portalOrder = normalizeOrder(state.portalOrder)
  state.portalHidden = normalizeHidden(state.portalHidden)
  state.vocabHistory = normalizeVocabHistory(state.vocabHistory)
  state.learningNotebook = normalizeLearningNotebook(state.learningNotebook)
  state.learningAnalytics = normalizeLearningAnalytics(state.learningAnalytics)
  state.contentQuizResults = normalizeContentQuizResults(state.contentQuizResults)
  state.stats = { ...freshStats(), ...normalizeLegacyStats(state.stats) }
  state.battleStars = normalizeBattleStars(state.battleStars)
  state.battleXpSpent = normalizeLegacyXp(state.battleXpSpent)
  state.battleThemeId = battleThemeById(
    state.battleThemeId,
    state.battleStars,
  ).id
  state.battleStudentId = normalizeBattleStudentId(state.battleStudentId)
  state.battleTraitInvestments = normalizeBattleTraitInvestments(
    state.battleTraitInvestments,
    state.battleStars,
  )
  state.battleStoryStep = normalizeBattleStoryStep(state.battleStoryStep)
  state.battleStoryLastDay = normalizeBattleStoryLastDay(state.battleStoryLastDay)
  state.afterSchoolBonds = normalizeAfterSchoolBonds(state.afterSchoolBonds)
  const hadUnlockedStudents = Array.isArray(state.unlockedBattleStudentIds)
  state.unlockedBattleStudentIds = normalizeUnlockedBattleStudentIds(
    hadUnlockedStudents
      ? [...state.unlockedBattleStudentIds, state.battleStudentId]
      : LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
    { legacyFallback: !hadUnlockedStudents },
  )
  state.storyKeyVisualAlbum = state.storyKeyVisualAlbum
    ? normalizeStoryKeyVisualAlbum(state.storyKeyVisualAlbum)
    : storyKeyVisualAlbumFromLegacyBonds(state.afterSchoolBonds)
  state.dragonVeinProgress = normalizeDragonVeinProgress(state.dragonVeinProgress)
  return state
}

// 進捗コードから復元する永続項目を一括で組み立てる。
// importCode 内へ項目を散らさず、永続項目一覧との全件照合を可能にする。
export function progressStateFromPayload(payload = {}) {
  const battleStars = normalizeBattleStars(payload.battleStars)
  const stats = { ...freshStats(), ...normalizeLegacyStats(payload.stats) }
  const battleStudentId = normalizeBattleStudentId(payload.battleStudentId)
  const unlockedBattleStudentIds = normalizeUnlockedBattleStudentIds(
    Array.isArray(payload.unlockedBattleStudentIds)
      ? [...payload.unlockedBattleStudentIds, battleStudentId]
      : LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
    { legacyFallback: !Array.isArray(payload.unlockedBattleStudentIds) },
  )
  return {
    srs: payload.srs ?? {},
    etymologySrs: payload.etymologySrs ?? {},
    kotenSrs: payload.kotenSrs ?? {},
    kotenGrammarSrs: payload.kotenGrammarSrs ?? {},
    kotenCultureSrs: payload.kotenCultureSrs ?? {},
    kotenInterpretationSrs: payload.kotenInterpretationSrs ?? {},
    kanbunVocabSrs: payload.kanbunVocabSrs ?? {},
    kanbunGrammarSrs: payload.kanbunGrammarSrs ?? {},
    kanbunCultureSrs: payload.kanbunCultureSrs ?? {},
    kanbunKundokuSrs: payload.kanbunKundokuSrs ?? {},
    myList: payload.myList ?? [],
    vocabHistory: normalizeVocabHistory(payload.vocabHistory),
    myGrammarList: payload.myGrammarList ?? [],
    learningNotebook: normalizeLearningNotebook(payload.learningNotebook),
    writingProgress: payload.writingProgress ?? {},
    kotenWordList: payload.kotenWordList ?? [],
    kotenGrammarList: payload.kotenGrammarList ?? [],
    kotenCultureList: payload.kotenCultureList ?? [],
    kanbunVocabList: payload.kanbunVocabList ?? [],
    kanbunGrammarList: payload.kanbunGrammarList ?? [],
    kanbunCultureList: payload.kanbunCultureList ?? [],
    readingsDone: payload.readingsDone ?? [],
    mathDone: payload.mathDone ?? [],
    mathMastery: payload.mathMastery ?? {},
    contentQuizResults: normalizeContentQuizResults(payload.contentQuizResults),
    skillStats: payload.skillStats ?? {},
    learningAnalytics: normalizeLearningAnalytics(payload.learningAnalytics),
    diagnosticHistory: payload.diagnosticHistory ?? [],
    diagnosticAttempt: payload.diagnosticAttempt ?? 0,
    diagnosticSeed: payload.diagnosticSeed ?? null,
    engPos: payload.engPos ?? null,
    grammarStrandPos: payload.grammarStrandPos ?? {},
    battleRelicLevel: payload.battleRelicLevel ?? null,
    battleStars,
    battleXpSpent: normalizeLegacyXp(payload.battleXpSpent),
    battleThemeId: battleThemeById(payload.battleThemeId, battleStars).id,
    battleStudentId,
    battleTraitInvestments: normalizeBattleTraitInvestments(
      payload.battleTraitInvestments,
      battleStars,
    ),
    battleStoryStep: normalizeBattleStoryStep(payload.battleStoryStep),
    battleStoryLastDay: normalizeBattleStoryLastDay(payload.battleStoryLastDay),
    afterSchoolBonds: normalizeAfterSchoolBonds(payload.afterSchoolBonds),
    unlockedBattleStudentIds,
    storyKeyVisualAlbum: payload.storyKeyVisualAlbum
      ? normalizeStoryKeyVisualAlbum(payload.storyKeyVisualAlbum)
      : storyKeyVisualAlbumFromLegacyBonds(payload.afterSchoolBonds),
    dragonVeinProgress: normalizeDragonVeinProgress(payload.dragonVeinProgress),
    portalOrder: normalizeOrder(payload.portalOrder),
    portalHidden: normalizeHidden(payload.portalHidden),
    stats,
    settings: normalizeSettings(payload.settings),
  }
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ── ナビゲーション（永続化しない） ──
      // 起動時はポータル（コンテンツ選択）。各コンテンツに入ると 'home' 等へ。
      screen: 'portal',
      params: {},
      stack: [],
      speechSettingsOpen: false,
      speechSettingsRequest: 'menu',
      openSpeechSettings: (request = 'menu') => set({
        speechSettingsOpen: true,
        speechSettingsRequest: request,
      }),
      closeSpeechSettings: () => set({
        speechSettingsOpen: false,
        speechSettingsRequest: 'menu',
      }),
      navigate: (screen, params = {}) =>
        set((st) => {
          const destination = learnerDestination(screen, params)
          if (destination.screen === 'home' && screen !== 'home') {
            return { ...destination, stack: [] }
          }
          return {
            ...destination,
            stack: [...st.stack, { screen: st.screen, params: st.params }].slice(-20),
          }
        }),
      // 同じ画面内の一覧条件だけを更新する。履歴は増やさず、次の画面から
      // 戻ったときに現在選んでいる教材の一覧へ正しく復元できるようにする。
      replaceParams: (params = {}) => set({ params }),
      // 完了画面から選択画面へ戻るとき、終了済みの学習・結果画面を履歴へ残さない。
      // 同じ画面が履歴にあれば、その直前までを復元する。
      returnTo: (screen, params = {}) =>
        set((st) => returnNavigationState(st, screen, params)),
      exitSessionResult: () =>
        set((st) => {
          const destination = completedSessionDestination(st.params)
          return returnNavigationState(st, destination.screen, destination.params)
        }),
      back: () =>
        set((st) => {
          if (st.screen === 'sessionResult') {
            const destination = completedSessionDestination(st.params)
            return returnNavigationState(st, destination.screen, destination.params)
          }
          if (st.params?.returnTo?.screen) {
            return returnNavigationState(
              st,
              st.params.returnTo.screen,
              st.params.returnTo.params ?? {},
            )
          }
          // 履歴なしで開いた画面は、そのアプリのホームへ戻す
          // （英語なら英語アプリ、古典なら古典アプリ）。
          if (!st.stack.length) {
            const destination = fallbackDestination(st.screen)
            return destination ? { screen: destination, params: {}, stack: [] } : {}
          }
          const prev = st.stack[st.stack.length - 1]
          const destination = learnerDestination(prev.screen, prev.params)
          return {
            ...destination,
            stack: destination.screen === 'home' && prev.screen !== 'home'
              ? []
              : st.stack.slice(0, -1),
          }
        }),
      // AppShell の共通「戻る」。通常は履歴を一つ戻し、直接開いた
      // トップ階層ではスタディアプリの入口へ戻す。
      globalBack: () =>
        set((st) => {
          if (st.screen === 'sessionResult') {
            const destination = completedSessionDestination(st.params)
            return returnNavigationState(st, destination.screen, destination.params)
          }
          if (st.params?.returnTo?.screen) {
            return returnNavigationState(
              st,
              st.params.returnTo.screen,
              st.params.returnTo.params ?? {},
            )
          }
          if (!st.stack.length) {
            // 画面内の「やめる」と同じ戻り先にそろえる。
            const destination = fallbackDestination(st.screen)
            return destination ? { screen: destination, params: {}, stack: [] } : {}
          }
          const prev = st.stack[st.stack.length - 1]
          const destination = learnerDestination(prev.screen, prev.params)
          return {
            ...destination,
            stack: destination.screen === 'home' && prev.screen !== 'home'
              ? []
              : st.stack.slice(0, -1),
          }
        }),
      returnToAfterSchoolChronicle: () =>
        set({ screen: 'home', params: {}, stack: [] }),
      goHome: () => set({ screen: 'home', params: {}, stack: [] }),
      // いま見ている画面のアプリのホームへ。上部バーの「◯◯アプリ」から使う。
      goAppHome: () =>
        set((st) => ({ screen: appHomeForScreen(st.screen).screen, params: {}, stack: [] })),
      // 各アプリのホームへ直接移動する（履歴は初期化）。
      goHomeScreen: (screen) => set({ screen, params: {}, stack: [] }),
      goPortal: () => set({ screen: 'portal', params: {}, stack: [] }),

      // ── 進行中の単語暗記／テストの一時退避（永続化しない） ──
      // 辞書・語源などの参考画面を開いて戻るとき、deck・進行位置・結果を
      // 失わないようここへ退避→復元する。旧保存契約のフィールド名はそのまま使う。
      quizSession: null,
      saveQuizSession: (session) => set({ quizSession: session }),
      clearQuizSession: () => set({ quizSession: null }),

      // ── 途中でやめたテストの途中経過（永続化しない） ──
      // 各テスト画面が「その分野・答えた数・正解数」を預け、画面が変わった
      // ところで一度だけ学習記録へ残す。最後まで進んだ場合と、辞書などを見る
      // ために続きを退避した場合は画面側が預けを外すので、二重に数えない。
      interruptedSession: null,
      keepInterruptedSession: (session) => set({ interruptedSession: session }),
      commitInterruptedSession: () => {
        const st = get()
        const session = st.interruptedSession
        if (!session || session.screen === st.screen) return
        set({ interruptedSession: null })
        if (!session.skill || !(session.answered > 0)) return
        st.recordSkillResult(session.skill, session.correct, session.answered, {
          trackLearning: false,
        })
      },

      // ── 学習state（永続化する） ──
      ...createInitialLearningState(),

      review: (wordId, result, skillHint = null) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.srs,
            st.stats,
            wordId,
            result,
            timestamp,
            { adaptiveVocabulary: skillHint === 'vocab' },
          )
          const remembered = result === 'correct' || result === 'remembered'
          return {
            srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: learningSkillForItem(wordId, skillHint),
                inputs: 1,
                scored: 1,
                correct: remembered ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 旧版の語源専用SRSを読み戻すために残す互換操作。現行の学習者向け画面は
      // vocabStudy だけを使い、語源から覚えた結果も単語SRSへ記録する。
      reviewEtymology: (packId, result) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.etymologySrs,
            st.stats,
            packId,
            result,
            timestamp,
          )
          return {
            etymologySrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'etymology',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 古文単語の復習（英単語と同じLeitnerロジックを別srsで使う）。
      reviewKoten: (wordId, result) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.kotenSrs,
            st.stats,
            wordId,
            result,
            timestamp,
          )
          return {
            kotenSrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'koten',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 古典文法も「暗記→テスト」を同じLeitner間隔でつなぐ。
      reviewKotenGrammar: (grammarId, result) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.kotenGrammarSrs,
            st.stats,
            grammarId,
            result,
            timestamp,
          )
          return {
            kotenGrammarSrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'koten_grammar',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 古典常識も本文で思い出せるよう、暗記と入試型問題を同じSRSでつなぐ。
      reviewKotenCulture: (cultureId, result) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.kotenCultureSrs,
            st.stats,
            cultureId,
            result,
            timestamp,
          )
          return {
            kotenCultureSrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'koten_culture',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 古典短文解釈も、問題ごとに同じ間隔反復で復習時期を管理する。
      reviewKotenInterpretation: (questionId, result) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.kotenInterpretationSrs,
            st.stats,
            questionId,
            result,
            timestamp,
          )
          return {
            kotenInterpretationSrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'koten_reading',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 漢文の三主分野は保存領域を分離し、同じ間隔反復ロジックで暗記とテストをつなぐ。
      reviewKanbun: (domain, itemId, result) =>
        set((st) => {
          const config = {
            vocab: { field: 'kanbunVocabSrs', skill: 'kanbun_vocab' },
            grammar: { field: 'kanbunGrammarSrs', skill: 'kanbun_grammar' },
            culture: { field: 'kanbunCultureSrs', skill: 'kanbun_culture' },
          }[domain]
          if (!config || !itemId) return {}
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st[config.field],
            st.stats,
            itemId,
            result,
            timestamp,
          )
          return {
            [config.field]: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: config.skill,
                inputs: 1,
                scored: 1,
                correct: result === 'correct' || result === 'remembered' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      reviewKanbunKundoku: (exerciseId, result) =>
        set((st) => {
          if (!exerciseId) return {}
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.kanbunKundokuSrs,
            st.stats,
            exerciseId,
            result,
            timestamp,
          )
          return {
            kanbunKundokuSrs: srs,
            stats,
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'kanbun_kundoku',
                inputs: 1,
                scored: 1,
                correct: result === 'correct' ? 1 : 0,
                ...reviewMeta,
              },
              timestamp,
            ),
          }
        }),

      // 一覧の連続スワイプも、各教材の暗記・テスト画面と同じ書き込み口を使う。
      // 新しい進捗領域を作らず、進捗コード・クラウド同期・リセットとの互換を保つ。
      reviewLearningContent: (contentId, itemId, result) => {
        const command = learningContentCatalogReviewCommand(contentId, itemId, result)
        const action = command ? get()[command.action] : null
        if (typeof action !== 'function') return false
        action(...command.args)
        return true
      },

      recordVocabHistory: (wordId) =>
        set((st) => ({
          vocabHistory: prependVocabHistory(st.vocabHistory, [wordId]),
        })),

      clearVocabHistory: () => set({ vocabHistory: [] }),

      toggleMyList: (wordId) =>
        set((st) => {
          const saved = st.myList.includes(wordId)
          return {
            myList: saved
              ? st.myList.filter((id) => id !== wordId)
              : [...st.myList, wordId],
            learningNotebook: setNotebookItemSaved(
              st.learningNotebook,
              'vocab',
              wordId,
              !saved,
            ),
            // 登録した単語は、詳細画面以外から保存しても辞書履歴へ出す。
            vocabHistory: saved
              ? st.vocabHistory
              : prependVocabHistory(st.vocabHistory, [wordId]),
          }
        }),

      addManyToMyList: (ids) =>
        set((st) => {
          const known = new Set(st.myList)
          const added = []
          for (const id of Array.isArray(ids) ? ids : []) {
            if (typeof id !== 'string' || !id || known.has(id)) continue
            known.add(id)
            added.push(id)
          }
          return {
            myList: [...st.myList, ...added],
            vocabHistory: prependVocabHistory(st.vocabHistory, added),
          }
        }),

      toggleMyGrammar: (grammarId) =>
        set((st) => ({
          myGrammarList: st.myGrammarList.includes(grammarId)
            ? st.myGrammarList.filter((id) => id !== grammarId)
            : [...st.myGrammarList, grammarId],
        })),

      addManyToMyGrammar: (ids) =>
        set((st) => ({
          myGrammarList: [
            ...st.myGrammarList,
            ...ids.filter((id) => !st.myGrammarList.includes(id)),
          ],
        })),

      // 8分野共通のノート保存。既存の英単語・古典リストは互換経路として
      // 同時更新し、旧画面・旧保存データ・既存SRSをそのまま利用できるようにする。
      toggleNotebookItem: (domain, itemId) =>
        set((st) => {
          const legacyField = {
            vocab: 'myList',
            kotenVocab: 'kotenWordList',
            kotenGrammar: 'kotenGrammarList',
            kotenCulture: 'kotenCultureList',
          }[domain]
          const legacySaved = legacyField && st[legacyField].includes(itemId)
          const ref = `${domain}:${itemId}`
          const saved = legacySaved || st.learningNotebook?.entries?.[ref]?.saved === true
          const next = {
            learningNotebook: setNotebookItemSaved(
              st.learningNotebook,
              domain,
              itemId,
              !saved,
            ),
          }
          if (legacyField) {
            next[legacyField] = saved
              ? st[legacyField].filter((id) => id !== itemId)
              : [...st[legacyField], itemId]
          }
          if (domain === 'vocab' && !saved) {
            next.vocabHistory = prependVocabHistory(st.vocabHistory, [itemId])
          }
          return next
        }),

      updateNotebookItem: (domain, itemId, patch) =>
        set((st) => {
          const legacyField = {
            vocab: 'myList',
            kotenVocab: 'kotenWordList',
            kotenGrammar: 'kotenGrammarList',
            kotenCulture: 'kotenCultureList',
          }[domain]
          const next = {
            learningNotebook: updateNotebookItemState(
              st.learningNotebook,
              domain,
              itemId,
              patch,
            ),
          }
          if (legacyField && !st[legacyField].includes(itemId)) {
            next[legacyField] = [...st[legacyField], itemId]
          }
          if (domain === 'vocab') {
            next.vocabHistory = prependVocabHistory(st.vocabHistory, [itemId])
          }
          return next
        }),

      updateLearningContentPlanItem: (contentId, itemId, action) =>
        set((st) => ({
          learningNotebook: {
            ...st.learningNotebook,
            contentPlan: updateLearningContentPlan(
              st.learningNotebook?.contentPlan,
              contentId,
              itemId,
              action,
            ),
          },
        })),

      createNotebookSet: (title, description = '') => {
        let setId = null
        set((st) => {
          const result = createNotebookSetState(st.learningNotebook, title, { description })
          setId = result.setId
          return { learningNotebook: result.notebook }
        })
        return setId
      },

      updateNotebookSet: (setId, patch) =>
        set((st) => ({
          learningNotebook: updateNotebookSetState(st.learningNotebook, setId, patch),
        })),

      deleteNotebookSet: (setId) =>
        set((st) => ({
          learningNotebook: deleteNotebookSetState(st.learningNotebook, setId),
        })),

      setNotebookSetItem: (setId, domain, itemId, included) =>
        set((st) => ({
          learningNotebook: setNotebookSetItemState(
            st.learningNotebook,
            setId,
            domain,
            itemId,
            included,
          ),
        })),

      moveNotebookSetItem: (setId, ref, direction) =>
        set((st) => ({
          learningNotebook: moveNotebookSetItemState(
            st.learningNotebook,
            setId,
            ref,
            direction,
          ),
        })),

      recordNotebookSetLaunch: (session) =>
        set((st) => ({
          learningNotebook: recordNotebookSetLaunchState(st.learningNotebook, session),
        })),

      // 完成作文は級別の再挑戦状況として保存する。全文は各課題の最新1本だけを保持。
      recordWritingCompletion: ({ exerciseId, text, mode, wordCount, grammarIds }) =>
        set((st) => {
          if (!exerciseId || !text) return {}
          const timestamp = Date.now()
          const day = localDayIndexAt(timestamp)
          const previous = st.writingProgress[exerciseId] ?? {
            completed: 0,
            bestWords: 0,
          }
          const writingSkill = st.skillStats.writing ?? {
            answered: 0,
            correct: 0,
            sessions: 0,
            lastDay: null,
          }
          return {
            writingProgress: {
              ...st.writingProgress,
              [exerciseId]: {
                completed: previous.completed + 1,
                lastText: text,
                lastMode: mode === 'free' ? 'free' : 'guide',
                lastDay: day,
                bestWords: Math.max(previous.bestWords ?? 0, Number(wordCount) || 0),
                grammarIds: Array.isArray(grammarIds) ? [...new Set(grammarIds)] : [],
              },
            },
            skillStats: {
              ...st.skillStats,
              writing: {
                answered: writingSkill.answered + 1,
                correct: writingSkill.correct + 1,
                sessions: writingSkill.sessions + 1,
                lastDay: day,
              },
            },
            stats: awardWriting(st.stats, timestamp),
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              { skill: 'writing', inputs: 1, scored: 0, correct: 0 },
              timestamp,
            ),
          }
        }),

      toggleKotenWordList: (wordId) =>
        set((st) => {
          const saved = st.kotenWordList.includes(wordId)
          return {
            kotenWordList: saved
              ? st.kotenWordList.filter((id) => id !== wordId)
              : [...st.kotenWordList, wordId],
            learningNotebook: setNotebookItemSaved(
              st.learningNotebook,
              'kotenVocab',
              wordId,
              !saved,
            ),
          }
        }),

      addManyToKotenWordList: (ids) =>
        set((st) => ({
          kotenWordList: [
            ...st.kotenWordList,
            ...ids.filter((id) => !st.kotenWordList.includes(id)),
          ],
        })),

      toggleKotenGrammarList: (grammarId) =>
        set((st) => {
          const saved = st.kotenGrammarList.includes(grammarId)
          return {
            kotenGrammarList: saved
              ? st.kotenGrammarList.filter((id) => id !== grammarId)
              : [...st.kotenGrammarList, grammarId],
            learningNotebook: setNotebookItemSaved(
              st.learningNotebook,
              'kotenGrammar',
              grammarId,
              !saved,
            ),
          }
        }),

      addManyToKotenGrammarList: (ids) =>
        set((st) => ({
          kotenGrammarList: [
            ...st.kotenGrammarList,
            ...ids.filter((id) => !st.kotenGrammarList.includes(id)),
          ],
        })),

      toggleKotenCultureList: (cultureId) =>
        set((st) => {
          const saved = st.kotenCultureList.includes(cultureId)
          return {
            kotenCultureList: saved
              ? st.kotenCultureList.filter((id) => id !== cultureId)
              : [...st.kotenCultureList, cultureId],
            learningNotebook: setNotebookItemSaved(
              st.learningNotebook,
              'kotenCulture',
              cultureId,
              !saved,
            ),
          }
        }),

      addManyToKotenCultureList: (ids) =>
        set((st) => ({
          kotenCultureList: [
            ...st.kotenCultureList,
            ...ids.filter((id) => !st.kotenCultureList.includes(id)),
          ],
        })),

      toggleKanbunList: (domain, itemId) =>
        set((st) => {
          const field = {
            vocab: 'kanbunVocabList',
            grammar: 'kanbunGrammarList',
            culture: 'kanbunCultureList',
          }[domain]
          if (!field || !itemId) return {}
          const saved = st[field].includes(itemId)
          return {
            [field]: saved
              ? st[field].filter((id) => id !== itemId)
              : [...st[field], itemId],
          }
        }),

      addManyToKanbunList: (domain, ids) =>
        set((st) => {
          const field = {
            vocab: 'kanbunVocabList',
            grammar: 'kanbunGrammarList',
            culture: 'kanbunCultureList',
          }[domain]
          if (!field || !Array.isArray(ids)) return {}
          return {
            [field]: [
              ...st[field],
              ...ids.filter((id) => !st[field].includes(id)),
            ],
          }
        }),

      markReadingDone: (id) =>
        set((st) =>
          st.readingsDone.includes(id) ? {} : { readingsDone: [...st.readingsDone, id] },
        ),

      // 名作朗読は既存の読了リスト・同期経路を再利用し、初回読了だけを分析へ加算する。
      markLiteratureDone: (id, skill = 'reading', inputs = 1) =>
        set((st) => {
          if (!id || st.readingsDone.includes(id)) return {}
          return {
            readingsDone: [...st.readingsDone, id],
            learningAnalytics: recordLearningEvent(st.learningAnalytics, {
              skill,
              inputs: Math.max(1, Number(inputs) || 1),
              scored: 0,
              correct: 0,
            }),
          }
        }),

      markMathDone: (id) =>
        set((st) =>
          st.mathDone.includes(id) ? {} : { mathDone: [...st.mathDone, id] },
        ),

      // スキル別（単語/文法/語法/長文/リスニング/ディクテーション）のテスト結果を累積する。
      recordSkillResult: (skill, correct, total, options = {}) =>
        set((st) => {
          if (!skill || !total) return {}
          const timestamp = Date.now()
          const day = localDayIndexAt(timestamp)
          const prev = st.skillStats[skill] ?? { answered: 0, correct: 0, sessions: 0, lastDay: null }
          return {
            skillStats: {
              ...st.skillStats,
              [skill]: {
                answered: prev.answered + total,
                correct: prev.correct + correct,
                sessions: prev.sessions + 1,
                lastDay: day,
              },
            },
            ...(options.trackLearning === false
              ? {}
              : {
                  learningAnalytics: recordLearningEvent(
                    st.learningAnalytics,
                    {
                      skill,
                      inputs: total,
                      scored: total,
                      correct,
                    },
                    timestamp,
                  ),
                }),
          }
        }),

      // SRSを使わない長文・名作・数学も、教材ごとの直近正誤を保存する。
      // 分野別累計とは分け、未回答の母数と直近結果を正確に表示する。
      recordContentQuizResult: (domain, itemId, correct, total) =>
        set((st) => ({
          contentQuizResults: recordContentQuizResultState(
            st.contentQuizResults,
            { domain, itemId, correct, total },
          ),
        })),

      // 開始時点で回数を進める。中断したテストも消費済みにすることで、
      // やり直した直後に同じ問題が再表示されないようにする。
      beginDiagnosticAttempt: () => {
        const st = get()
        const previousAttempt = Number.isInteger(st.diagnosticAttempt) && st.diagnosticAttempt >= 0
          ? st.diagnosticAttempt
          : 0
        const seed = Number.isInteger(st.diagnosticSeed)
          ? st.diagnosticSeed >>> 0
          : Math.floor(Math.random() * 0x100000000) >>> 0
        const attemptNumber = previousAttempt + 1
        set({ diagnosticAttempt: attemptNumber, diagnosticSeed: seed })
        return { attemptNumber, seed }
      },

      // 学習診断を保存し、同時に学習マップの分野別成績へ反映する。
      // 初めて現在地を決める場合だけ、診断した英検級を適応バトルの初期位置にも使う。
      recordDiagnosticResult: (result) =>
        set((st) => {
          if (!result?.id || !Array.isArray(result.skillResults)) return {}
          const history = Array.isArray(st.diagnosticHistory) ? st.diagnosticHistory : []
          if (history.some((item) => item.id === result.id)) return {}

          const timestamp = Date.now()
          const day = localDayIndexAt(timestamp)
          const skillStats = { ...st.skillStats }
          const learningEvents = []
          for (const item of result.skillResults) {
            if (!item?.id || !Number.isFinite(item.correct) || !Number.isFinite(item.total) || item.total <= 0) {
              continue
            }
            const prev = skillStats[item.id] ?? {
              answered: 0,
              correct: 0,
              sessions: 0,
              lastDay: null,
            }
            skillStats[item.id] = {
              answered: prev.answered + item.total,
              correct: prev.correct + item.correct,
              sessions: prev.sessions + 1,
              lastDay: day,
            }
            learningEvents.push({
              skill: item.id,
              inputs: item.total,
              scored: item.total,
              correct: item.correct,
            })
          }

          return {
            diagnosticHistory: [result, ...history].slice(0, 5),
            skillStats,
            learningAnalytics: recordLearningEvents(
              st.learningAnalytics,
              learningEvents,
              timestamp,
            ),
            engPos: st.engPos == null && Number.isFinite(result.position)
              ? clampPos(result.position)
              : st.engPos,
          }
        }),

      // ── 適応バトル（学習マップ）：ポジション＝立ち位置、敵LV＝出題級 ──
      // 明示的にポジションを設定（初回配置や復元時）。
      setEngPos: (pos) => set({ engPos: clampPos(pos) }),

      // ── 文法の系統：級をまたぐ単元ごとに現在地を持つ ──
      // セッションの正答率で現在地を上下させ、次に開いたときの級へ反映する。
      // 系統や級が不正なときは何も変えない（保存が壊れて学習が止まるのを防ぐ）。
      advanceGrammarStrand: (strandId, accuracy) =>
        set((st) => {
          const strand = getGrammarStrand(strandId)
          if (!strand || !Number.isFinite(accuracy)) return {}
          const current = resolveStrandPosition(strand, st.srs, st.grammarStrandPos?.[strandId])
          const next = nextStrandPosition(strand, current, accuracy)
          return {
            grammarStrandPos: { ...st.grammarStrandPos, [strandId]: next },
          }
        }),

      // 学習者が段を選び直したときに現在地を合わせる。
      setGrammarStrandPos: (strandId, pos) =>
        set((st) => {
          const strand = getGrammarStrand(strandId)
          if (!strand || !Number.isFinite(pos)) return {}
          const stageCount = grammarStrandLevels(strand).length
          return {
            grammarStrandPos: {
              ...st.grammarStrandPos,
              [strandId]: clampStrandPos(pos, stageCount),
            },
          }
        }),
      setBattleRelicLevel: (level) =>
        set({
          battleRelicLevel:
            Number.isSafeInteger(level) && level >= 1 && level <= 99
              ? level
              : null,
        }),
      addBattleStars: (amount) =>
        set((st) => ({
          battleStars: normalizeBattleStars(
            normalizeBattleStars(st.battleStars) + normalizeBattleStars(amount),
          ),
        })),
      setBattleThemeId: (themeId) =>
        set((st) => {
          const theme = battleThemeById(themeId, st.battleStars)
          return theme.id === themeId ? { battleThemeId: themeId } : {}
        }),
      setBattleStudentId: (studentId) =>
        set((st) => {
          const nextStudentId = normalizeBattleStudentId(studentId)
          return isBattleStudentUnlocked(st.unlockedBattleStudentIds, nextStudentId)
            ? { battleStudentId: nextStudentId }
            : {}
        }),
      raiseBattleTrait: (studentId, traitId) =>
        set((st) => ({
          battleTraitInvestments: raiseBattleTrait({
            battleStars: st.battleStars,
            investments: st.battleTraitInvestments,
            studentId,
            traitId,
          }),
        })),
      resetBattleStudentTraits: (studentId) =>
        set((st) => ({
          battleTraitInvestments: resetBattleStudentTraits({
            battleStars: st.battleStars,
            investments: st.battleTraitInvestments,
            studentId,
          }),
        })),
      advanceBattleStory: () =>
        set((st) => ({
          battleStoryStep: normalizeBattleStoryStep(st.battleStoryStep + 1),
        })),
      skipAfterSchoolRoute: ({ step } = {}) => {
        const currentStep = normalizeBattleStoryStep(get().battleStoryStep)
        // 任意の日常を見送った場合も、完了時と同じく物語だけを一話進める。
        // 表示時のstepを照合し、連打や古い画面からの二重進行を防ぐ。
        if (!Number.isSafeInteger(step) || step < 0) return false
        if (normalizeBattleStoryStep(step) !== currentStep) return false
        set({ battleStoryStep: normalizeBattleStoryStep(currentStep + 1) })
        return true
      },
      completeAfterSchoolRoute: ({ step, branchId, choiceId } = {}) => {
        const st = get()
        const currentStep = normalizeBattleStoryStep(st.battleStoryStep)
        // 表示時のstepと保存中のstepが一致するときだけ、絆と物語を一括確定する。
        // 戻る・再読込・連打でも同じ放課後報酬を二重受取できない。
        if (normalizeBattleStoryStep(step) !== currentStep) return null
        const bonds = normalizeAfterSchoolBonds(st.afterSchoolBonds)
        const reward = resolveAfterSchoolReward({ bonds, branchId, choiceId })
        if (!reward) return null
        const unlockedStudentIds = normalizeUnlockedBattleStudentIds(
          st.unlockedBattleStudentIds,
        )
        const companionUnlocked = !unlockedStudentIds.includes(reward.studentId)
        const nextUnlockedStudentIds = normalizeUnlockedBattleStudentIds([
          ...unlockedStudentIds,
          reward.studentId,
        ])
        const granted = {
          ...reward,
          companionUnlocked,
          unlockedCompanion: companionUnlocked ? reward.studentId : null,
        }
        set({
          afterSchoolBonds: {
            ...bonds,
            [reward.studentId]: reward.nextBondEntry,
          },
          unlockedBattleStudentIds: nextUnlockedStudentIds,
          storyKeyVisualAlbum: recordAfterSchoolEventMemory(
            st.storyKeyVisualAlbum,
            { branchId, storyStep: currentStep },
          ),
          battleStoryStep: normalizeBattleStoryStep(currentStep + 1),
        })
        return granted
      },
      recordTeacherKeyVisual: ({ teacherId, studentId, themeId } = {}) =>
        set((st) => ({
          storyKeyVisualAlbum: recordTeacherVictoryMemory(
            st.storyKeyVisualAlbum,
            { teacherId, studentId, themeId },
          ),
        })),
      markBattleStorySeen: (day) =>
        set({ battleStoryLastDay: normalizeBattleStoryLastDay(day) }),
      // バトルの正答率(0-1)で生徒のポジションを上下させる。
      // fromPos / maxPos を渡すと、指定された解放範囲内だけを移動する。
      recordBattle: (accuracy, fromPos = null, maxPos = null) =>
        set((st) => {
          const start = Number.isFinite(fromPos) ? fromPos : st.engPos ?? 0
          const battle = battleProgression(
            { position: start },
            accuracy,
            Number.isFinite(maxPos) ? maxPos : undefined,
          )
          return {
            engPos: battle.to,
          }
        }),

      // 龍脈修復は通常の正誤・SRS・XPとは別の表示用進捗として記録する。
      // sessionId を保持し、結果画面の再表示や連打による二重加算を防ぐ。
      recordDragonVeinSession: ({ sessionId, source, correct, answered } = {}) => {
        if (!sessionId || !source) return false
        const st = get()
        const recent = Array.isArray(st.dragonVeinProgress?.recentSessionIds)
          ? st.dragonVeinProgress.recentSessionIds
          : []
        if (recent.includes(sessionId)) return false
        const next = recordDragonVeinResult(st.dragonVeinProgress, source, {
          correct,
          answered,
        })
        set({
          dragonVeinProgress: {
            ...next,
            recentSessionIds: [sessionId, ...recent].slice(0, 40),
          },
        })
        return true
      },

      // 単元セッション終了時に理解度（最高正答率）を更新する。
      setMathMastery: (unitId, pct) =>
        set((st) => {
          const timestamp = Date.now()
          const normalizedPct = Math.max(0, Math.min(100, Number(pct) || 0))
          return {
            mathMastery: {
              ...st.mathMastery,
              [unitId]: Math.max(st.mathMastery[unitId] ?? 0, Math.round(normalizedPct)),
            },
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              {
                skill: 'math',
                inputs: 1,
                scored: 1,
                correct: normalizedPct / 100,
              },
              timestamp,
            ),
          }
        }),

      setSetting: (key, value) =>
        set((st) => ({ settings: { ...st.settings, [key]: value } })),

      // ── ポータルのタイル並べ替え／表示オンオフ ──
      // タイルを上下に動かす（dir: -1=上, +1=下）。並びは表示・非表示まとめて1列で管理。
      moveContent: (id, dir) =>
        set((st) => {
          const order = normalizeOrder(st.portalOrder)
          const i = order.indexOf(id)
          const j = i + dir
          if (i < 0 || j < 0 || j >= order.length) return {}
          const next = [...order]
          ;[next[i], next[j]] = [next[j], next[i]]
          return { portalOrder: next }
        }),
      // タイルの表示／非表示を切り替える。
      togglePortalHidden: (id) =>
        set((st) => ({
          portalHidden: st.portalHidden.includes(id)
            ? st.portalHidden.filter((x) => x !== id)
            : [...st.portalHidden, id],
        })),
      // 並び順・表示を初期状態に戻す。
      resetPortal: () => set({ portalOrder: [...DEFAULT_CONTENT_ORDER], portalHidden: [] }),

      // 学習状況だけを初期化する。音声・カード設定と、スタディアプリ ホームの
      // 並び／表示は端末の使い方なので保持する。
      resetProgress: (groupIds = ALL_PROGRESS_RESET_GROUP_IDS) =>
        set((state) => resetProgressState(state, groupIds)),

      // ── 進捗コード ──
      exportCode: () => encodeProgress(get()),
      importCode: (code) => {
        const payload = decodeProgress(code) // 失敗時は例外
        set(progressStateFromPayload(payload))
        return payload
      },
    }),
    {
      name: 'eigo-quest',
      version: 9,
      migrate: migratePersistedState,
      // ナビゲーション系は保存しない。
      partialize: selectProgressState,
    },
  ),
)

// ── 画面から使う派生セレクタ（フックではない純関数） ──
export const isDue = (entry, day = today()) => !entry || entry.due <= day
export const todayIndex = today
export { INTERVALS, MAX_BOX }
