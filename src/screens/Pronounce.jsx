import { useStore } from '../store/useStore.js'
import { wordsByLevel } from '../data/vocab.js'
import { isRecognitionSupported } from '../lib/speech.js'
import { LevelPicker } from '../components/LevelPicker.jsx'

export function PronounceScreen() {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const note = isRecognitionSupported()
    ? '録音をタップして単語を1回発音すると、複数の音声認識候補との一致度を確認します。音素やアクセントの精密採点ではありません。'
    : '⚠️ この端末/ブラウザは音声認識に未対応です。お手本を聞いて練習し、自己評価で進められます。'
  return (
    <LevelPicker
      title="発音チェック"
      subtitle="話した単語が認識されるか確かめよう"
      accent="#f43f5e"
      note={note}
      countFor={(l) => wordsByLevel(l).length}
      onPick={(levelId, label) => navigate('pronouncePlay', { source: { type: 'level', levelId }, title: `英検${label}` })}
      myListCount={myList.length}
      onMyList={() => navigate('pronouncePlay', { source: { type: 'mylist', ids: myList }, title: 'マイ単語' })}
    />
  )
}
