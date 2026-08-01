import { BATTLE_DAILY_SCENES, battleDailySceneById } from './battleCast.js'
import { publicAssetUrl } from './publicAssetUrl.js'

export const AFTER_SCHOOL_CHRONICLE = {
  id: 'after-school-chronicle',
  title: '放課後ことば探検記',
  shortTitle: 'ことば探検記',
  subtitle: '仲間との日常と、先生からの課題を巡る校内ストーリー',
  keyVisual: publicAssetUrl('/assets/battle/chronicle/after-school-route-key-visual.webp'),
}

export const AFTER_SCHOOL_STORY_PHASES = [
  {
    id: 'daily',
    number: '01',
    emoji: '🌇',
    label: '日常の一幕',
    description: '仲間の悩みや出来事を知る',
  },
  {
    id: 'challenge',
    number: '02',
    emoji: '📝',
    label: 'ことばの対決',
    description: '先生の課題へ英語で挑む',
  },
  {
    id: 'journal',
    number: '03',
    emoji: '📔',
    label: '放課後日誌',
    description: '声をかけ、次の一日へ進む',
  },
]

export const MAX_BATTLE_STORY_STEP = 999_999

export function normalizeBattleStoryStep(value) {
  if (!Number.isSafeInteger(value) || value < 0) return 0
  return Math.min(value, MAX_BATTLE_STORY_STEP)
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
