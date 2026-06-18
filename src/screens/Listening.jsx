import { useStore } from '../store/useStore.js'
import { wordsByLevel } from '../data/vocab.js'
import { LevelPicker } from '../components/LevelPicker.jsx'

export function ListeningScreen() {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  return (
    <LevelPicker
      title="リスニング"
      subtitle="音声を聞いて意味を当てよう"
      accent="#0ea5e9"
      note="単語は表示されません。音だけを頼りに意味を選びます（端末の音声合成を使用）。"
      countFor={(l) => wordsByLevel(l).length}
      onPick={(levelId, label) => navigate('listeningQuiz', { source: { type: 'level', levelId }, title: `英検${label}` })}
      myListCount={myList.length}
      onMyList={() => navigate('listeningQuiz', { source: { type: 'mylist', ids: myList }, title: 'マイ単語' })}
    />
  )
}
