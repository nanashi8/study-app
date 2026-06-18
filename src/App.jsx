import { useEffect, useState } from 'react'
import { useStore } from './store/useStore.js'
import { useAuth } from './store/useAuth.js'
import { pullOrInit, startAutoSave } from './lib/cloudSync.js'
import { LoginScreen, UnconfiguredScreen } from './screens/Login.jsx'
import { AppShell } from './components/AppShell.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { HomeScreen } from './screens/Home.jsx'
import { VocabLevelsScreen } from './screens/VocabLevels.jsx'
import { VocabStudyScreen } from './screens/VocabStudy.jsx'
import { VocabQuizScreen } from './screens/VocabQuiz.jsx'
import { SessionResultScreen } from './screens/SessionResult.jsx'
import { WordDetailScreen } from './screens/WordDetail.jsx'
import { RootDetailScreen } from './screens/RootDetail.jsx'
import { MyListScreen } from './screens/MyList.jsx'
import { ProgressScreen } from './screens/Progress.jsx'
import { SettingsScreen } from './screens/Settings.jsx'
import { ReadingListScreen } from './screens/ReadingList.jsx'
import { ReaderScreen } from './screens/Reader.jsx'
import { ReadingSummaryScreen } from './screens/ReadingSummary.jsx'
import { PhrasesScreen } from './screens/Phrases.jsx'
import { PhraseStudyScreen } from './screens/PhraseStudy.jsx'
import { PhraseQuizScreen } from './screens/PhraseQuiz.jsx'
import { ListeningScreen } from './screens/Listening.jsx'
import { ListeningQuizScreen } from './screens/ListeningQuiz.jsx'
import { DictationScreen } from './screens/Dictation.jsx'
import { DictationPlayScreen } from './screens/DictationPlay.jsx'
import { PronounceScreen } from './screens/Pronounce.jsx'
import { PronouncePlayScreen } from './screens/PronouncePlay.jsx'
import { VocabSearchScreen } from './screens/VocabSearch.jsx'
import { MathMapScreen } from './screens/MathMap.jsx'
import { MathUnitsScreen } from './screens/MathUnits.jsx'
import { MathSolveScreen } from './screens/MathSolve.jsx'
import { GrammarScreen } from './screens/Grammar.jsx'
import { GrammarQuizScreen } from './screens/GrammarQuiz.jsx'
import { EnglishMapScreen } from './screens/EnglishMap.jsx'

const SCREENS = {
  home: HomeScreen,
  vocabLevels: VocabLevelsScreen,
  vocabStudy: VocabStudyScreen,
  vocabQuiz: VocabQuizScreen,
  sessionResult: SessionResultScreen,
  wordDetail: WordDetailScreen,
  rootDetail: RootDetailScreen,
  myList: MyListScreen,
  progress: ProgressScreen,
  settings: SettingsScreen,
  readingList: ReadingListScreen,
  reader: ReaderScreen,
  readingSummary: ReadingSummaryScreen,
  phrases: PhrasesScreen,
  phraseStudy: PhraseStudyScreen,
  phraseQuiz: PhraseQuizScreen,
  listening: ListeningScreen,
  listeningQuiz: ListeningQuizScreen,
  dictation: DictationScreen,
  dictationPlay: DictationPlayScreen,
  pronounce: PronounceScreen,
  pronouncePlay: PronouncePlayScreen,
  vocabSearch: VocabSearchScreen,
  mathMap: MathMapScreen,
  mathUnits: MathUnitsScreen,
  mathSolve: MathSolveScreen,
  grammar: GrammarScreen,
  grammarQuiz: GrammarQuizScreen,
  englishMap: EnglishMapScreen,
}

// 没入モード（学習・クイズ・結果系）はボトムナビを隠す。
const IMMERSIVE = new Set([
  'vocabStudy', 'vocabQuiz', 'sessionResult', 'reader', 'phraseStudy', 'phraseQuiz',
  'listeningQuiz', 'dictationPlay', 'pronouncePlay', 'mathSolve', 'grammarQuiz',
])

// 学習アプリ本体（ログイン済みのときだけ表示）。
function MainApp() {
  const screen = useStore((s) => s.screen)
  const Screen = SCREENS[screen] ?? HomeScreen
  const showNav = !IMMERSIVE.has(screen)
  return (
    <AppShell nav={showNav ? <BottomNav /> : null}>
      <Screen />
    </AppShell>
  )
}

// 中央寄せのシンプルなスプラッシュ（読み込み中表示）。
function Splash({ label }) {
  return (
    <AppShell>
      <div className="flex min-h-full flex-col items-center justify-center gap-3 text-ink/50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
        <p className="text-sm font-bold">{label}</p>
      </div>
    </AppShell>
  )
}

// 認証ゲート：未ログインならログイン画面、ログイン済みならクラウド復元→本体。
export default function App() {
  const status = useAuth((s) => s.status)
  const user = useAuth((s) => s.user)
  const init = useAuth((s) => s.init)
  const [synced, setSynced] = useState(false)

  // 起動時にログイン状態の購読を開始。
  useEffect(() => init(), [init])

  // ログインしたら：クラウドから進捗を復元 → 以後は自動保存。
  useEffect(() => {
    if (status !== 'in' || !user) return
    let stop = () => {}
    let alive = true
    setSynced(false)
    // クラウド読み込みが遅い/失敗しても画面を固めないよう、最大8秒で先へ進む。
    const timeout = new Promise((res) => setTimeout(res, 8000))
    Promise.race([
      pullOrInit(user.uid, user.email).catch((e) => console.warn('cloud pull failed', e)),
      timeout,
    ]).then(() => {
      if (!alive) return
      stop = startAutoSave(user.uid, user.email)
      setSynced(true)
    })
    return () => {
      alive = false
      stop()
    }
  }, [status, user])

  if (status === 'unconfigured')
    return (
      <AppShell>
        <UnconfiguredScreen />
      </AppShell>
    )
  if (status === 'loading') return <Splash label="読み込み中…" />
  if (status === 'out')
    return (
      <AppShell>
        <LoginScreen />
      </AppShell>
    )
  // status === 'in'
  if (!synced) return <Splash label="進捗を読み込み中…" />
  return <MainApp />
}
