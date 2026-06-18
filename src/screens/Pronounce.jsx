import { useStore } from '../store/useStore.js'
import { wordsByLevel } from '../data/vocab.js'
import { isRecognitionSupported } from '../lib/speech.js'
import { LevelPicker } from '../components/LevelPicker.jsx'

export function PronounceScreen() {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const note = isRecognitionSupported()
    ? 'お手本を聞いて発音してみよう。マイクで自動採点します。'
    : '⚠️ この端末/ブラウザは自動採点（音声認識）に未対応です。お手本を聞いて練習し、自己評価で進められます（iPhoneのSafariなどが該当）。'
  return (
    <LevelPicker
      title="発音採点"
      subtitle="お手本を聞いて発音しよう"
      accent="#f43f5e"
      note={note}
      countFor={(l) => wordsByLevel(l).length}
      onPick={(levelId, label) => navigate('pronouncePlay', { source: { type: 'level', levelId }, title: `英検${label}` })}
      myListCount={myList.length}
      onMyList={() => navigate('pronouncePlay', { source: { type: 'mylist', ids: myList }, title: 'マイ単語' })}
    />
  )
}
