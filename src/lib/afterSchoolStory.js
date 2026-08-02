import { BATTLE_DAILY_SCENES, battleDailySceneById } from './battleCast.js'
import { publicAssetUrl } from './publicAssetUrl.js'

export const AFTER_SCHOOL_CHRONICLE = {
  id: 'after-school-chronicle',
  title: '放課後の魔法と言葉',
  shortTitle: '魔法と言葉',
  subtitle: '先生の課題に挑み、対決後の3つの放課後ルートで関係を育てる校内ストーリー',
  keyVisual: publicAssetUrl('/assets/battle/chronicle/after-school-route-key-visual.webp'),
}

export const MAX_BATTLE_STORY_STEP = 999_999
export const AFTER_SCHOOL_INTERLUDE_CHANCE = 1 / 3

export function normalizeBattleStoryStep(value) {
  if (!Number.isSafeInteger(value) || value < 0) return 0
  return Math.min(value, MAX_BATTLE_STORY_STEP)
}

export function normalizeBattleStoryLastDay(value) {
  return Number.isSafeInteger(value) && value >= 0 ? value : null
}

// 旧バージョンの保存データ・テストとの互換用。現在の戦果画面は毎回3ルートへ進む。
export function shouldContinueToAfterSchoolInterlude({
  storyStep = 0,
  lastDay = null,
  currentDay = null,
  roll = 1,
} = {}) {
  const day = normalizeBattleStoryLastDay(currentDay)
  if (day !== null && normalizeBattleStoryLastDay(lastDay) === day) return false
  if (normalizeBattleStoryStep(storyStep) === 0) return true
  return Number.isFinite(roll)
    && roll >= 0
    && roll < AFTER_SCHOOL_INTERLUDE_CHANCE
}

export function afterSchoolSceneForStep(step) {
  const normalized = normalizeBattleStoryStep(step)
  return BATTLE_DAILY_SCENES[normalized % BATTLE_DAILY_SCENES.length]
}

export function afterSchoolScene({ sceneId, step = 0 } = {}) {
  return sceneId
    ? battleDailySceneById(sceneId)
    : afterSchoolSceneForStep(step)
}

export function afterSchoolEpisodeNumber(step) {
  return normalizeBattleStoryStep(step) + 1
}
