import { LEVELS } from '../data/levels.js'
import { battleVerdict, encounterFor } from './rpg.js'
import { afterSchoolScene } from './afterSchoolStory.js'
import {
  bossBgmTrack,
  dailyBgmTrack,
  rankBgmTrack,
  resultBgmTrack,
} from '../data/game-bgm.js'

const DAILY_GAME_SCREENS = new Set([
  'afterSchoolChronicle',
  'afterSchoolInterlude',
  'characterTalk',
])

/** 現在のゲーム画面と保存済みバトルsourceから、鳴らす1曲を決める。 */
export function gameBgmTrackForState({ screen, params = {}, day = 0, storyStep = 0 } = {}) {
  if (DAILY_GAME_SCREENS.has(screen)) {
    const scene = afterSchoolScene({
      sceneId: params.sceneId,
      step: Number.isSafeInteger(params.storyStep) ? params.storyStep : storyStep,
    })
    return dailyBgmTrack(scene.id)
  }

  const source = params?.source
  if (screen === 'vocabQuiz' && source?.type === 'battle') {
    const rankIndex = Math.max(0, Math.min(LEVELS.length - 1, Math.floor(source.levelIndex) || 0))
    const encounter = encounterFor({
      level: source.heroLevel ?? 1,
      day: source.adventureDay ?? day,
      enemyRankIndex: rankIndex,
    })
    if (encounter.isBoss) return bossBgmTrack(encounter.id) ?? rankBgmTrack(LEVELS[rankIndex].id)
    return rankBgmTrack(source.levelId ?? LEVELS[rankIndex].id)
  }

  if (screen === 'sessionResult' && source?.type === 'battle') {
    const total = Math.max(0, Number(params.total) || 0)
    const correct = Math.max(0, Number(params.correct) || 0)
    return resultBgmTrack(battleVerdict(total ? correct / total : 0).id)
  }

  return null
}
