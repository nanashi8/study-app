import { LEVELS } from '../data/levels.js'
import { BATTLE_DAILY_SCENES } from './battleCast.js'
import { battleVerdict, encounterFor } from './rpg.js'
import {
  bossBgmTrack,
  dailyBgmTrack,
  rankBgmTrack,
  resultBgmTrack,
} from '../data/game-bgm.js'

const positiveMod = (value, modulus) => ((value % modulus) + modulus) % modulus

/** 現在のゲーム画面と保存済みバトルsourceから、鳴らす1曲を決める。 */
export function gameBgmTrackForState({ screen, params = {}, day = 0 } = {}) {
  if (screen === 'englishMap') {
    const index = positiveMod(Math.floor(Number(day) || 0), BATTLE_DAILY_SCENES.length)
    return dailyBgmTrack(BATTLE_DAILY_SCENES[index].id)
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
