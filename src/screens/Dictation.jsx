import { useStore } from '../store/useStore.js'
import { DICTATION_PROFILES, dictationByLevel } from '../data/dictation.js'
import { LevelPicker } from '../components/LevelPicker.jsx'

export function DictationScreen() {
  const navigate = useStore((s) => s.navigate)
  return (
    <LevelPicker
      title="ディクテーション"
      subtitle="音声を聞いて、英文を全文入力"
      accent="#14b8a6"
      note="この教材は、級別の場面・題材に合わせて、文長・構文・話題を段階化したトレーニングです。大文字・句読点は採点せず、綴りと語順を採点します。"
      countFor={(levelId) => dictationByLevel(levelId).length}
      countUnit="問"
      detailFor={(levelId) => DICTATION_PROFILES[levelId]?.target}
      onPick={(levelId, label) => navigate('dictationPlay', { source: { type: 'level', levelId }, title: `英検${label}` })}
    />
  )
}
