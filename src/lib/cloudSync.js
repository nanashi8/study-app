// ── クラウド同期（Realtime Database 版）─────────────────────────────────
// 学習state（useStore の永続スライス）を Realtime Database の students/{uid} に
// 保存し、ログイン時はそこから復元する。「どの端末でも続きから」が成立する。
//
// データ構造（先生用ダッシュボードもここを読む）：
//   /students/{uid} = { email, updatedAt, srs, myList, readingsDone, stats, settings }
import { ref, get, set, serverTimestamp } from 'firebase/database'
import { db } from './firebase.js'
import { useStore } from '../store/useStore.js'
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
import { normalizeAfterSchoolBonds } from './afterSchoolBonds.js'
import { normalizeVocabHistory } from './vocabHistory.js'

const node = (uid) => ref(db, `students/${uid}`)

// ログイン直後：クラウドに保存済みなら読み込んで上書き、無ければ今の状態で新規作成。
export async function pullOrInit(uid, email) {
  const snap = await get(node(uid))
  if (snap.exists()) {
    const d = snap.val() || {}
    const cur = useStore.getState()
    const battleStars = normalizeBattleStars(d.battleStars)
    const stats = { ...cur.stats, ...(d.stats ?? {}) }
    useStore.setState({
      srs: d.srs ?? {},
      etymologySrs: d.etymologySrs ?? {},
      kotenSrs: d.kotenSrs ?? {},
      kotenGrammarSrs: d.kotenGrammarSrs ?? {},
      kotenCultureSrs: d.kotenCultureSrs ?? {},
      kotenInterpretationSrs: d.kotenInterpretationSrs ?? {},
      myList: d.myList ?? [],
      vocabHistory: normalizeVocabHistory(d.vocabHistory ?? cur.vocabHistory),
      myGrammarList: d.myGrammarList ?? [],
      writingProgress: d.writingProgress ?? {},
      kotenWordList: d.kotenWordList ?? [],
      kotenGrammarList: d.kotenGrammarList ?? [],
      kotenCultureList: d.kotenCultureList ?? [],
      readingsDone: d.readingsDone ?? [],
      mathDone: d.mathDone ?? [],
      mathMastery: d.mathMastery ?? {},
      skillStats: d.skillStats ?? {},
      learningAnalytics: d.learningAnalytics ?? cur.learningAnalytics,
      diagnosticHistory: d.diagnosticHistory ?? [],
      diagnosticAttempt: Number.isSafeInteger(d.diagnosticAttempt) && d.diagnosticAttempt >= 0
        ? d.diagnosticAttempt
        : 0,
      diagnosticSeed: Number.isInteger(d.diagnosticSeed)
        && d.diagnosticSeed >= 0
        && d.diagnosticSeed <= 0xffffffff
        ? d.diagnosticSeed
        : null,
      engPos: d.engPos ?? null,
      battleRelicLevel:
        Number.isSafeInteger(d.battleRelicLevel)
        && d.battleRelicLevel >= 1
        && d.battleRelicLevel <= 99
          ? d.battleRelicLevel
          : null,
      battleStars,
      battleXpSpent: normalizeBattleXpSpent(d.battleXpSpent, stats.xp),
      battleThemeId: battleThemeById(d.battleThemeId, battleStars).id,
      battleStudentId: normalizeBattleStudentId(d.battleStudentId),
      battleTraitInvestments: normalizeBattleTraitInvestments(
        d.battleTraitInvestments,
        battleStars,
      ),
      battleStoryStep: normalizeBattleStoryStep(d.battleStoryStep),
      battleStoryLastDay: normalizeBattleStoryLastDay(d.battleStoryLastDay),
      afterSchoolBonds: normalizeAfterSchoolBonds(d.afterSchoolBonds),
      stats,
      settings: { ...cur.settings, ...(d.settings ?? {}) },
    })
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
