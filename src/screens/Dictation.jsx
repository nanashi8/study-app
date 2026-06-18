import { useStore } from '../store/useStore.js'
import { wordsByLevel } from '../data/vocab.js'
import { LevelPicker } from '../components/LevelPicker.jsx'

export function DictationScreen() {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  return (
    <LevelPicker
      title="ディクテーション"
      subtitle="聞こえた順に単語を並べよう"
      accent="#14b8a6"
      note="英文の音声を聞いて、バラバラの単語ブロックを聞こえた順にタップして並べます。タイプ不要・スマホで快適。"
      countFor={(l) => wordsByLevel(l).length}
      onPick={(levelId, label) => navigate('dictationPlay', { source: { type: 'level', levelId }, title: `英検${label}` })}
      myListCount={myList.length}
      onMyList={() => navigate('dictationPlay', { source: { type: 'mylist', ids: myList }, title: 'マイ単語' })}
    />
  )
}
