import { useStore } from '../store/useStore.js'
import { DICTATION_ITEMS, DICTATION_PROFILES, dictationByLevel } from '../data/dictation.js'
import { LevelPicker } from '../components/LevelPicker.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'

export function DictationScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  return (
    <LevelPicker
      title="ディクテーション"
      subtitle="音声を聞いて、英文を全文入力"
      accent="#14b8a6"
      note="英検本試験に書き取り問題はありません。この教材は、公式の級別リスニングの場面・題材・放送回数を基準に、文長・構文・話題を段階化したトレーニングです。大文字・句読点は採点せず、綴りと語順を採点します。"
      countFor={(levelId) => dictationByLevel(levelId).length}
      countUnit="問"
      detailFor={(levelId) => DICTATION_PROFILES[levelId]?.target}
      statusFor={(levelId) => summarizeSrsItems(
        DICTATION_ITEMS.filter((item) => item.level === levelId),
        srs,
      )}
      onPick={(levelId, label) => navigate('dictationPlay', { source: { type: 'level', levelId }, title: `英検${label}` })}
    />
  )
}
