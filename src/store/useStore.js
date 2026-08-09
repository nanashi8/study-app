import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  decodeProgress,
  encodeProgress,
  selectProgressState,
} from '../lib/progressCode.js'
import { battleProgression, clampPos } from '../lib/adaptive.js'
import {
  createLearningAnalytics,
  learningSkillForItem,
  recordLearningEvent,
  recordLearningEvents,
} from '../lib/learningAnalytics.js'
import { DEFAULT_CONTENT_ORDER } from '../data/contents.js'
import {
  BATTLE_THEMES,
  battleXpExchange,
  battleThemeById,
  normalizeBattleXpSpent,
  normalizeBattleStars,
} from '../lib/battleThemes.js'
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

// ── 学習ロジックの定数 ──────────────────────────────────────────────
// Leitner 式の間隔反復。box が上がるほど次に出る間隔（日数）が伸びる。
const INTERVALS = [0, 1, 2, 4, 7, 15, 30]
const MAX_BOX = INTERVALS.length - 1

// 回答結果ごとの box 変化と獲得XP。
const RESULTS = {
  correct: { box: +1, xp: 10 }, // クイズ正解
  wrong: { box: -1, xp: 3 }, // クイズ誤答
  unknown: { box: 'reset', xp: 2 }, // 「わからない」
  remembered: { box: +1, xp: 6 }, // カードで「覚えた」
  forgot: { box: 'reset', xp: 2 }, // カードで「まだ」
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

const today = () => localDayIndexAt()

// 保存済みのポータル並び順を正規化：既知のidだけ残し、未登場の新コンテンツは
// 既定の位置（末尾寄り）で補う。データ追加後も保存値が壊れないようにする。
export function normalizeOrder(order) {
  const known = new Set(DEFAULT_CONTENT_ORDER)
  const seen = new Set()
  const kept = (Array.isArray(order) ? order : []).filter((id) => known.has(id) && !seen.has(id) && seen.add(id))
  const missing = DEFAULT_CONTENT_ORDER.filter((id) => !seen.has(id))
  return [...kept, ...missing]
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
  revealAnswers: false, // 覚える/復習/マイ単語で、タップせず最初から意味・語源を表示する
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

const initialLearning = () => ({
  srs: {}, // wordId -> { box, correct, wrong, due, last }
  etymologySrs: {}, // etymologyPackId -> { box, correct, wrong, due, last }
  kotenSrs: {}, // 古文単語の wordId -> { box, ... }（英単語と別管理。idが衝突しないよう分離）
  kotenGrammarSrs: {}, // 古典文法の grammarId -> { box, ... }
  kotenCultureSrs: {}, // 古典常識の cultureId -> { box, ... }
  kotenInterpretationSrs: {}, // 古典短文の questionId -> { box, ... }
  myList: [], // [wordId]
  vocabHistory: [], // 最近検索・参照・マイ単語登録した英単語ID（新しい順）
  myGrammarList: [], // [writingGrammarId] 英作文で保存した文法カード
  writingProgress: {}, // exerciseId -> { completed, lastText, lastMode, lastDay, bestWords, grammarIds }
  kotenWordList: [], // [古文単語id] 登録単語
  kotenGrammarList: [], // [古典文法id] 登録文法
  kotenCultureList: [], // [古典常識id] 登録常識
  readingsDone: [], // [passageId | literatureId] 読了した長文・名作朗読
  mathDone: [], // [problemId] クリアした数学問題
  mathMastery: {}, // unitId -> 最高正答率(0-100) ＝ 理解度
  skillStats: {}, // skill -> { answered, correct, sessions, lastDay } ＝ スキル別テスト結果
  learningAnalytics: createLearningAnalytics(), // 時刻・反復間隔・正誤の匿名集計
  diagnosticHistory: [], // 学習診断の新しい順の結果（最大5件）
  diagnosticAttempt: 0, // 学習診断を開始した回数。問題候補を重複なしで順送りする
  diagnosticSeed: null, // 端末ごとの問題候補の並びを再現する符号なし32bit整数
  engPos: null, // 適応バトルの現在ポジション(0=5級…6=1級, 小数可)。null=未配置（初回に推定）
  battleRelicLevel: null, // バトルへ持ち込む取得済み戦利品の解放LV。nullは最新を自動選択
  battleStars: 0, // バトル正解やXP変換で貯まる、演出スキン解放専用の放課後スター
  battleXpSpent: 0, // 放課後スターへ一度だけ変換済みの累計XP
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

function applyReview(srs, stats, wordId, result, timestamp = Date.now()) {
  const def = RESULTS[result] ?? RESULTS.unknown
  const day = localDayIndexAt(timestamp)
  const prev = srs[wordId] ?? { box: 0, correct: 0, wrong: 0, due: day, last: null }
  let box
  if (def.box === 'reset') box = 0
  else box = Math.max(0, Math.min(MAX_BOX, prev.box + def.box))

  const next = {
    box,
    correct: prev.correct + (result === 'correct' || result === 'remembered' ? 1 : 0),
    wrong: prev.wrong + (result === 'wrong' || result === 'unknown' || result === 'forgot' ? 1 : 0),
    due: day + INTERVALS[box],
    last: day,
    lastAt: timestamp,
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
  if (result === 'correct' || result === 'remembered') s.correct += 1
  s.xp += def.xp

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
    },
  }
}

// 英作文1本の完成を、今日の学習回数・連続日数・XPへ反映する。
function awardWriting(stats, xp = 20, timestamp = Date.now()) {
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
  next.xp += xp
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
  state.battleStars = normalizeBattleStars(state.battleStars)
  state.battleXpSpent = normalizeBattleXpSpent(
    state.battleXpSpent,
    state.stats?.xp,
  )
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
  const stats = { ...freshStats(), ...(payload.stats ?? {}) }
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
    myList: payload.myList ?? [],
    vocabHistory: normalizeVocabHistory(payload.vocabHistory),
    myGrammarList: payload.myGrammarList ?? [],
    writingProgress: payload.writingProgress ?? {},
    kotenWordList: payload.kotenWordList ?? [],
    kotenGrammarList: payload.kotenGrammarList ?? [],
    kotenCultureList: payload.kotenCultureList ?? [],
    readingsDone: payload.readingsDone ?? [],
    mathDone: payload.mathDone ?? [],
    mathMastery: payload.mathMastery ?? {},
    skillStats: payload.skillStats ?? {},
    learningAnalytics: payload.learningAnalytics ?? createLearningAnalytics(),
    diagnosticHistory: payload.diagnosticHistory ?? [],
    diagnosticAttempt: payload.diagnosticAttempt ?? 0,
    diagnosticSeed: payload.diagnosticSeed ?? null,
    engPos: payload.engPos ?? null,
    battleRelicLevel: payload.battleRelicLevel ?? null,
    battleStars,
    battleXpSpent: normalizeBattleXpSpent(payload.battleXpSpent, stats.xp),
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
      openSpeechSettings: () => set({ speechSettingsOpen: true }),
      closeSpeechSettings: () => set({ speechSettingsOpen: false }),
      navigate: (screen, params = {}) =>
        set((st) => ({
          screen,
          params,
          stack: [...st.stack, { screen: st.screen, params: st.params }].slice(-20),
        })),
      back: () =>
        set((st) => {
          if (!st.stack.length) return { screen: 'home', params: {} }
          const prev = st.stack[st.stack.length - 1]
          return { screen: prev.screen, params: prev.params, stack: st.stack.slice(0, -1) }
        }),
      returnToAfterSchoolChronicle: () =>
        set((st) => {
          let homeIndex = -1
          for (let index = st.stack.length - 1; index >= 0; index -= 1) {
            if (st.stack[index]?.screen === 'home') {
              homeIndex = index
              break
            }
          }
          return {
            screen: 'afterSchoolChronicle',
            params: {},
            stack: homeIndex >= 0 ? st.stack.slice(0, homeIndex + 1) : [],
          }
        }),
      goHome: () => set({ screen: 'home', params: {}, stack: [] }),

      // ── クイズの一時退避（永続化しない） ──
      // 「語源をくわしく見る」等で一旦クイズ画面を離れて戻るとき、解答済みの
      // 状態を失わないよう deck・進行位置・結果をここへ退避→復元する。
      quizSession: null,
      saveQuizSession: (session) => set({ quizSession: session }),
      clearQuizSession: () => set({ quizSession: null }),

      // ── 学習state（永続化する） ──
      ...initialLearning(),

      review: (wordId, result, skillHint = null) =>
        set((st) => {
          const timestamp = Date.now()
          const { srs, stats, reviewMeta } = applyReview(
            st.srs,
            st.stats,
            wordId,
            result,
            timestamp,
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

      // 語源知識は単語の正誤と分け、濃縮パックそのものを1つの暗記項目として反復する。
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

      // 古典文法も「覚える→腕試し」を同じLeitner間隔でつなぐ。
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
            stats: awardWriting(st.stats, 20, timestamp),
            learningAnalytics: recordLearningEvent(
              st.learningAnalytics,
              { skill: 'writing', inputs: 1, scored: 0, correct: 0 },
              timestamp,
            ),
          }
        }),

      toggleKotenWordList: (wordId) =>
        set((st) => ({
          kotenWordList: st.kotenWordList.includes(wordId)
            ? st.kotenWordList.filter((id) => id !== wordId)
            : [...st.kotenWordList, wordId],
        })),

      addManyToKotenWordList: (ids) =>
        set((st) => ({
          kotenWordList: [
            ...st.kotenWordList,
            ...ids.filter((id) => !st.kotenWordList.includes(id)),
          ],
        })),

      toggleKotenGrammarList: (grammarId) =>
        set((st) => ({
          kotenGrammarList: st.kotenGrammarList.includes(grammarId)
            ? st.kotenGrammarList.filter((id) => id !== grammarId)
            : [...st.kotenGrammarList, grammarId],
        })),

      addManyToKotenGrammarList: (ids) =>
        set((st) => ({
          kotenGrammarList: [
            ...st.kotenGrammarList,
            ...ids.filter((id) => !st.kotenGrammarList.includes(id)),
          ],
        })),

      toggleKotenCultureList: (cultureId) =>
        set((st) => ({
          kotenCultureList: st.kotenCultureList.includes(cultureId)
            ? st.kotenCultureList.filter((id) => id !== cultureId)
            : [...st.kotenCultureList, cultureId],
        })),

      addManyToKotenCultureList: (ids) =>
        set((st) => ({
          kotenCultureList: [
            ...st.kotenCultureList,
            ...ids.filter((id) => !st.kotenCultureList.includes(id)),
          ],
        })),

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
      exchangeXpForBattleStars: () =>
        set((st) => {
          const exchange = battleXpExchange(
            st.stats?.xp,
            st.battleXpSpent,
            st.battleStars,
          )
          if (!exchange.canExchange) return {}
          return {
            battleXpSpent: exchange.nextSpentXp,
            battleStars: exchange.nextBattleStars,
          }
        }),
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
        // 表示時のstepと保存中のstepが一致するときだけ、XPと絆を一括確定する。
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
          // 放課後XPは冒険者LVへ加えるが、正答数・SRS・診断結果には混ぜない。
          stats: {
            ...st.stats,
            xp: Math.max(0, Math.floor(Number(st.stats?.xp) || 0)) + reward.xpGained,
          },
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
      // fromPos / maxPos を渡すと、冒険者LVで解放済みの範囲内だけを移動する。
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

      resetProgress: () => set(initialLearning()),

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
      version: 5,
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
