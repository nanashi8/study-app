import { useEffect, useState } from 'react'
import { useStore } from './store/useStore.js'
import { useAuth } from './store/useAuth.js'
import { pullOrInit, startAutoSave } from './lib/cloudSync.js'
import { LoginScreen } from './screens/Login.jsx'
import { AppShell } from './components/AppShell.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { PortalScreen } from './screens/Portal.jsx'
import { HomeScreen } from './screens/Home.jsx'
import { VocabLevelsScreen } from './screens/VocabLevels.jsx'
import { VocabDecksScreen } from './screens/VocabDecks.jsx'
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
import { WordRequestsScreen } from './screens/WordRequests.jsx'
import { MathMapScreen } from './screens/MathMap.jsx'
import { MathUnitsScreen } from './screens/MathUnits.jsx'
import { MathSolveScreen } from './screens/MathSolve.jsx'
import { GrammarScreen } from './screens/Grammar.jsx'
import { GrammarQuizScreen } from './screens/GrammarQuiz.jsx'
import { EnglishMapScreen } from './screens/EnglishMap.jsx'
import { KotenListScreen } from './screens/KotenList.jsx'
import { KotenStudyScreen } from './screens/KotenStudy.jsx'
import { KotenQuizScreen } from './screens/KotenQuiz.jsx'

const SCREENS = {
  portal: PortalScreen,
  login: LoginScreen,
  home: HomeScreen,
  vocabLevels: VocabLevelsScreen,
  vocabDecks: VocabDecksScreen,
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
  wordRequests: WordRequestsScreen,
  mathMap: MathMapScreen,
  mathUnits: MathUnitsScreen,
  mathSolve: MathSolveScreen,
  grammar: GrammarScreen,
  grammarQuiz: GrammarQuizScreen,
  englishMap: EnglishMapScreen,
  kotenList: KotenListScreen,
  kotenStudy: KotenStudyScreen,
  kotenQuiz: KotenQuizScreen,
}

// ボトムナビ（英語アプリのタブ）を隠す画面。
//  ・没入モード（学習・クイズ・結果系）
//  ・ポータル直下の別コンテンツ（辞書・数学・古典）＝英語アプリのタブを出さない
const IMMERSIVE = new Set([
  'portal',
  'login',
  'vocabStudy', 'vocabQuiz', 'sessionResult', 'reader', 'phraseStudy', 'phraseQuiz',
  'listeningQuiz', 'dictationPlay', 'pronouncePlay', 'mathSolve', 'grammarQuiz',
  // 別コンテンツ（ポータルから入る）
  'vocabSearch', 'wordRequests', 'mathMap', 'mathUnits',
  'kotenList', 'kotenStudy', 'kotenQuiz',
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

// 認証ゲート：未ログインはゲストとして本体へ、ログイン済みはクラウド復元→本体。
export default function App() {
  const status = useAuth((s) => s.status)
  const user = useAuth((s) => s.user)
  const init = useAuth((s) => s.init)
  const [synced, setSynced] = useState(false)

  // 起動時にログイン状態の購読を開始。
  useEffect(() => init(), [init])

  // QRのURL（#code=...）で開かれたら、進捗コード読込画面（記録）へ誘導する。
  // 実際の読込確認は ProgressScreen 側で行う。
  useEffect(() => {
    if (/[#&]code=EQ1-/.test(location.hash)) {
      useStore.getState().navigate('progress')
    }
  }, [])

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
      // ゲストからログインした直後はログイン画面に居るので、ポータルへ戻す。
      const st = useStore.getState()
      if (st.screen === 'login') st.navigate('portal')
      setSynced(true)
    })
    return () => {
      alive = false
      stop()
    }
  }, [status, user])

  // 認証の初期判定中だけ待つ。それ以外はログインの有無に関わらずアプリに入れる
  // （未ログイン＝ゲスト。進捗はローカルに保存され、QR/コードで持ち運べる）。
  if (status === 'loading') return <Splash label="読み込み中…" />
  // ログイン直後のクラウド復元中だけスプラッシュ。
  if (status === 'in' && !synced) return <Splash label="進捗を読み込み中…" />
  return <MainApp />
}
