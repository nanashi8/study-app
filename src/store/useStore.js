import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { decodeProgress, encodeProgress } from '../lib/progressCode.js'
import { nextPosition, clampPos } from '../lib/adaptive.js'
import { DEFAULT_CONTENT_ORDER } from '../data/contents.js'

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

const today = () => Math.floor(Date.now() / 86400000) // 日番号（整数）

// 保存済みのポータル並び順を正規化：既知のidだけ残し、未登場の新コンテンツは
// 既定の位置（末尾寄り）で補う。データ追加後も保存値が壊れないようにする。
export function normalizeOrder(order) {
  const known = new Set(DEFAULT_CONTENT_ORDER)
  const seen = new Set()
  const kept = (Array.isArray(order) ? order : []).filter((id) => known.has(id) && !seen.has(id) && seen.add(id))
  const missing = DEFAULT_CONTENT_ORDER.filter((id) => !seen.has(id))
  return [...kept, ...missing]
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
  showPhonetic: true,
  autoSpeak: true,
  dailyGoal: 20,
  revealAnswers: false, // 覚える/復習/マイ単語で、タップせず最初から意味・語源を表示する
}

const initialLearning = () => ({
  srs: {}, // wordId -> { box, correct, wrong, due, last }
  kotenSrs: {}, // 古文単語の wordId -> { box, ... }（英単語と別管理。idが衝突しないよう分離）
  myList: [], // [wordId]
  readingsDone: [], // [passageId] 読了した長文
  mathDone: [], // [problemId] クリアした数学問題
  mathMastery: {}, // unitId -> 最高正答率(0-100) ＝ 理解度
  skillStats: {}, // skill -> { answered, correct, sessions, lastDay } ＝ スキル別テスト結果
  engPos: null, // 適応バトルの現在ポジション(0=5級…6=1級, 小数可)。null=未配置（初回に推定）
  portalOrder: [...DEFAULT_CONTENT_ORDER], // ポータルのタイル並び順（コンテンツid配列）
  portalHidden: [], // ポータルで非表示にしたコンテンツid
  stats: freshStats(),
  settings: { ...DEFAULT_SETTINGS },
})

function applyReview(srs, stats, wordId, result) {
  const def = RESULTS[result] ?? RESULTS.unknown
  const day = today()
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

  return { srs: { ...srs, [wordId]: next }, stats: s }
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ── ナビゲーション（永続化しない） ──
      // 起動時はポータル（コンテンツ選択）。各コンテンツに入ると 'home' 等へ。
      screen: 'portal',
      params: {},
      stack: [],
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
      goHome: () => set({ screen: 'home', params: {}, stack: [] }),

      // ── クイズの一時退避（永続化しない） ──
      // 「語源をくわしく見る」等で一旦クイズ画面を離れて戻るとき、解答済みの
      // 状態を失わないよう deck・進行位置・結果をここへ退避→復元する。
      quizSession: null,
      saveQuizSession: (session) => set({ quizSession: session }),
      clearQuizSession: () => set({ quizSession: null }),

      // ── 学習state（永続化する） ──
      ...initialLearning(),

      review: (wordId, result) =>
        set((st) => applyReview(st.srs, st.stats, wordId, result)),

      // 古文単語の復習（英単語と同じLeitnerロジックを別srsで使う）。
      reviewKoten: (wordId, result) =>
        set((st) => {
          const { srs, stats } = applyReview(st.kotenSrs, st.stats, wordId, result)
          return { kotenSrs: srs, stats }
        }),

      toggleMyList: (wordId) =>
        set((st) => ({
          myList: st.myList.includes(wordId)
            ? st.myList.filter((id) => id !== wordId)
            : [...st.myList, wordId],
        })),

      addManyToMyList: (ids) =>
        set((st) => ({
          myList: [...st.myList, ...ids.filter((id) => !st.myList.includes(id))],
        })),

      markReadingDone: (id) =>
        set((st) =>
          st.readingsDone.includes(id) ? {} : { readingsDone: [...st.readingsDone, id] },
        ),

      markMathDone: (id) =>
        set((st) =>
          st.mathDone.includes(id) ? {} : { mathDone: [...st.mathDone, id] },
        ),

      // スキル別（単語/文法/語法/長文/リスニング/ディクテーション）のテスト結果を累積する。
      recordSkillResult: (skill, correct, total) =>
        set((st) => {
          if (!skill || !total) return {}
          const prev = st.skillStats[skill] ?? { answered: 0, correct: 0, sessions: 0, lastDay: null }
          return {
            skillStats: {
              ...st.skillStats,
              [skill]: {
                answered: prev.answered + total,
                correct: prev.correct + correct,
                sessions: prev.sessions + 1,
                lastDay: today(),
              },
            },
          }
        }),

      // ── 適応バトル（学習マップ）：ポジション＝立ち位置、敵LV＝出題級 ──
      // 明示的にポジションを設定（初回配置や復元時）。
      setEngPos: (pos) => set({ engPos: clampPos(pos) }),
      // バトルの正答率(0-1)で生徒のポジションを上下させる。
      // 正解しつづければ前進して敵が強くなり、つまずけば後退して敵が弱くなる。
      recordBattle: (accuracy) =>
        set((st) => ({ engPos: nextPosition(st.engPos ?? 0, accuracy) })),

      // 単元セッション終了時に理解度（最高正答率）を更新する。
      setMathMastery: (unitId, pct) =>
        set((st) => ({
          mathMastery: {
            ...st.mathMastery,
            [unitId]: Math.max(st.mathMastery[unitId] ?? 0, Math.round(pct)),
          },
        })),

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
        set({
          srs: payload.srs ?? {},
          kotenSrs: payload.kotenSrs ?? {},
          myList: payload.myList ?? [],
          readingsDone: payload.readingsDone ?? [],
          mathDone: payload.mathDone ?? [],
          mathMastery: payload.mathMastery ?? {},
          skillStats: payload.skillStats ?? {},
          engPos: payload.engPos ?? null,
          portalOrder: normalizeOrder(payload.portalOrder),
          portalHidden: payload.portalHidden ?? [],
          stats: { ...freshStats(), ...(payload.stats ?? {}) },
          settings: { ...DEFAULT_SETTINGS, ...(payload.settings ?? {}) },
        })
        return payload
      },
    }),
    {
      name: 'eigo-quest',
      version: 1,
      // ナビゲーション系は保存しない。
      partialize: (st) => ({
        srs: st.srs,
        kotenSrs: st.kotenSrs,
        myList: st.myList,
        readingsDone: st.readingsDone,
        mathDone: st.mathDone,
        mathMastery: st.mathMastery,
        skillStats: st.skillStats,
        engPos: st.engPos,
        portalOrder: st.portalOrder,
        portalHidden: st.portalHidden,
        stats: st.stats,
        settings: st.settings,
      }),
    },
  ),
)

// ── 画面から使う派生セレクタ（フックではない純関数） ──
export const isDue = (entry, day = today()) => !entry || entry.due <= day
export const todayIndex = today
export { INTERVALS, MAX_BOX }
