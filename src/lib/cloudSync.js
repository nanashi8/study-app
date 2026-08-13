// ── クラウド同期（Realtime Database 版）─────────────────────────────────
// 学習state（useStore の永続スライス）を Realtime Database の students/{uid} に
// 保存し、ログイン時はそこから復元する。「どの端末でも続きから」が成立する。
//
// データ構造（先生用ダッシュボードもここを読む）：
//   /students/{uid} = { email, updatedAt, srs, myList, readingsDone, stats, settings }
import { ref, get, set, serverTimestamp } from 'firebase/database'
import { db } from './firebase.js'
import {
  normalizeHidden,
  normalizeOrder,
  normalizeSettings,
  useStore,
} from '../store/useStore.js'
import { buildPayload } from './progressCode.js'
import {
  battleThemeById,
  normalizeBattleXpSpent,
  normalizeBattleStars,
} from './battleThemes.js'
import { normalizeBattleStudentId } from './battleCast.js'
import { normalizeBattleTraitInvestments } from './battleTraits.js'
import {
  normalizeBattleStoryLastDay,
  normalizeBattleStoryStep,
} from './afterSchoolStory.js'
import {
  LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
  normalizeAfterSchoolBonds,
  normalizeUnlockedBattleStudentIds,
} from './afterSchoolBonds.js'
import {
  normalizeStoryKeyVisualAlbum,
  storyKeyVisualAlbumFromLegacyBonds,
} from './storyAlbum.js'
import { normalizeVocabHistory } from './vocabHistory.js'
import { normalizeDragonVeinProgress } from './dragonVein.js'
import { normalizeLearningNotebook } from './learningNotebook.js'

const node = (uid) => ref(db, `students/${uid}`)

// クラウドから復元する永続項目を一括で組み立てる。
// ネットワークなしの回帰テストでも、全項目が戻る契約を検査できるようにする。
export function progressStateFromCloud(data = {}, current = useStore.getState()) {
  const battleStars = normalizeBattleStars(data.battleStars)
  const stats = { ...current.stats, ...(data.stats ?? {}) }
  const battleStudentId = normalizeBattleStudentId(data.battleStudentId)
  const afterSchoolBonds = normalizeAfterSchoolBonds(data.afterSchoolBonds)
  const unlockedBattleStudentIds = normalizeUnlockedBattleStudentIds(
    Array.isArray(data.unlockedBattleStudentIds)
      ? [...data.unlockedBattleStudentIds, battleStudentId]
      : LEGACY_UNLOCKED_BATTLE_STUDENT_IDS,
    { legacyFallback: !Array.isArray(data.unlockedBattleStudentIds) },
  )
  return {
    srs: data.srs ?? {},
    etymologySrs: data.etymologySrs ?? {},
    kotenSrs: data.kotenSrs ?? {},
    kotenGrammarSrs: data.kotenGrammarSrs ?? {},
    kotenCultureSrs: data.kotenCultureSrs ?? {},
    kotenInterpretationSrs: data.kotenInterpretationSrs ?? {},
    myList: data.myList ?? [],
    vocabHistory: normalizeVocabHistory(data.vocabHistory ?? current.vocabHistory),
    myGrammarList: data.myGrammarList ?? [],
    // 古いクラウド保存にこの項目が無い場合、端末側で作ったノートを消さない。
    learningNotebook: normalizeLearningNotebook(
      data.learningNotebook ?? current.learningNotebook,
    ),
    writingProgress: data.writingProgress ?? {},
    kotenWordList: data.kotenWordList ?? [],
    kotenGrammarList: data.kotenGrammarList ?? [],
    kotenCultureList: data.kotenCultureList ?? [],
    readingsDone: data.readingsDone ?? [],
    mathDone: data.mathDone ?? [],
    mathMastery: data.mathMastery ?? {},
    skillStats: data.skillStats ?? {},
    learningAnalytics: data.learningAnalytics ?? current.learningAnalytics,
    diagnosticHistory: data.diagnosticHistory ?? [],
    diagnosticAttempt: Number.isSafeInteger(data.diagnosticAttempt) && data.diagnosticAttempt >= 0
      ? data.diagnosticAttempt
      : 0,
    diagnosticSeed: Number.isInteger(data.diagnosticSeed)
      && data.diagnosticSeed >= 0
      && data.diagnosticSeed <= 0xffffffff
      ? data.diagnosticSeed
      : null,
    engPos: data.engPos ?? null,
    battleRelicLevel:
      Number.isSafeInteger(data.battleRelicLevel)
      && data.battleRelicLevel >= 1
      && data.battleRelicLevel <= 99
        ? data.battleRelicLevel
        : null,
    battleStars,
    battleXpSpent: normalizeBattleXpSpent(data.battleXpSpent, stats.xp),
    battleThemeId: battleThemeById(data.battleThemeId, battleStars).id,
    battleStudentId,
    battleTraitInvestments: normalizeBattleTraitInvestments(
      data.battleTraitInvestments,
      battleStars,
    ),
    battleStoryStep: normalizeBattleStoryStep(data.battleStoryStep),
    battleStoryLastDay: normalizeBattleStoryLastDay(data.battleStoryLastDay),
    afterSchoolBonds,
    unlockedBattleStudentIds,
    storyKeyVisualAlbum: data.storyKeyVisualAlbum
      ? normalizeStoryKeyVisualAlbum(data.storyKeyVisualAlbum)
      : storyKeyVisualAlbumFromLegacyBonds(afterSchoolBonds),
    dragonVeinProgress: normalizeDragonVeinProgress(data.dragonVeinProgress),
    portalOrder: normalizeOrder(data.portalOrder ?? current.portalOrder),
    portalHidden: normalizeHidden(data.portalHidden ?? current.portalHidden),
    stats,
    settings: normalizeSettings({ ...current.settings, ...(data.settings ?? {}) }),
  }
}

// ログイン直後：クラウドに保存済みなら読み込んで上書き、無ければ今の状態で新規作成。
export async function pullOrInit(uid, email) {
  const snap = await get(node(uid))
  if (snap.exists()) {
    const d = snap.val() || {}
    const cur = useStore.getState()
    useStore.setState(progressStateFromCloud(d, cur))
  } else {
    // 初回ログイン：今ローカルにある進捗をそのままクラウドへ。
    await push(uid, email)
  }
}

// 現在の学習stateをクラウドへ書き込む（ノードを丸ごと上書き）。
export async function push(uid, email) {
  const slice = buildPayload(useStore.getState())
  await set(node(uid), { email: email ?? null, updatedAt: serverTimestamp(), ...slice })
}

// useStore の変更を購読し、デバウンスしてクラウドへ自動保存する。
// 返り値を呼ぶと購読解除（ログアウト時に使う）。
export function startAutoSave(uid, email, delay = 1500) {
  let timer = null
  const unsub = useStore.subscribe(() => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      push(uid, email).catch((e) => console.warn('cloud save failed', e))
    }, delay)
  })
  return () => {
    if (timer) clearTimeout(timer)
    unsub()
  }
}
