import { lazy, Suspense, useEffect, useState } from 'react'
import { useStore } from './store/useStore.js'
import { useAuth } from './store/useAuth.js'
import { pullOrInit, startAutoSave } from './lib/cloudSync.js'
import { LoginScreen } from './screens/Login.jsx'
import { AppShell } from './components/AppShell.jsx'
import { SpeechSettingsSheet } from './components/SpeechSettings.jsx'
import { PortalScreen } from './screens/Portal.jsx'
import { learnerDestination } from './lib/learnerVisibility.js'

// ポータル初期表示で全語彙・数式・QR読取などを一括取得しないよう、各画面を遅延読込する。
// named export の画面を React.lazy が要求する default export へ変換する小さなアダプタ。
const lazyScreen = (loader, name) =>
  lazy(() => loader().then((module) => ({ default: module[name] })))

const HomeScreen = lazyScreen(() => import('./screens/Home.jsx'), 'HomeScreen')
const VocabLevelsScreen = lazyScreen(() => import('./screens/VocabLevels.jsx'), 'VocabLevelsScreen')
const VocabGroupsScreen = lazyScreen(() => import('./screens/VocabGroups.jsx'), 'VocabGroupsScreen')
const VocabDecksScreen = lazyScreen(() => import('./screens/VocabDecks.jsx'), 'VocabDecksScreen')
const VocabStudyScreen = lazyScreen(() => import('./screens/VocabStudy.jsx'), 'VocabStudyScreen')
const VocabQuizScreen = lazyScreen(() => import('./screens/VocabQuiz.jsx'), 'VocabQuizScreen')
const SessionResultScreen = lazyScreen(() => import('./screens/SessionResult.jsx'), 'SessionResultScreen')
const WordDetailScreen = lazyScreen(() => import('./screens/WordDetail.jsx'), 'WordDetailScreen')
const RootDetailScreen = lazyScreen(() => import('./screens/RootDetail.jsx'), 'RootDetailScreen')
const EtymologyPackScreen = lazyScreen(
  () => import('./screens/EtymologyPack.jsx'),
  'EtymologyPackScreen',
)
const EtymologyStudyScreen = lazyScreen(
  () => import('./screens/EtymologyStudy.jsx'),
  'EtymologyStudyScreen',
)
const RootsScreen = lazyScreen(() => import('./screens/Roots.jsx'), 'RootsScreen')
const MyListScreen = lazyScreen(() => import('./screens/MyList.jsx'), 'MyListScreen')
const MyLearningScreen = lazyScreen(
  () => import('./screens/MyLearning.jsx'),
  'MyLearningScreen',
)
const VocabCameraScreen = lazyScreen(() => import('./screens/VocabCamera.jsx'), 'VocabCameraScreen')
const ProgressScreen = lazyScreen(() => import('./screens/Progress.jsx'), 'ProgressScreen')
const SettingsScreen = lazyScreen(() => import('./screens/Settings.jsx'), 'SettingsScreen')
const ReadingListScreen = lazyScreen(() => import('./screens/ReadingList.jsx'), 'ReadingListScreen')
const ReadingRulesScreen = lazyScreen(() => import('./screens/ReadingRules.jsx'), 'ReadingRulesScreen')
const ReadingPrepScreen = lazyScreen(() => import('./screens/ReadingPrep.jsx'), 'ReadingPrepScreen')
const ReaderScreen = lazyScreen(() => import('./screens/Reader.jsx'), 'ReaderScreen')
const ReadingSummaryScreen = lazyScreen(() => import('./screens/ReadingSummary.jsx'), 'ReadingSummaryScreen')
const LiteratureLibraryScreen = lazyScreen(
  () => import('./screens/LiteratureLibrary.jsx'),
  'LiteratureLibraryScreen',
)
const LiteratureReaderScreen = lazyScreen(
  () => import('./screens/LiteratureReader.jsx'),
  'LiteratureReaderScreen',
)
const PhrasesScreen = lazyScreen(() => import('./screens/Phrases.jsx'), 'PhrasesScreen')
const PhraseStudyScreen = lazyScreen(() => import('./screens/PhraseStudy.jsx'), 'PhraseStudyScreen')
const PhraseQuizScreen = lazyScreen(() => import('./screens/PhraseQuiz.jsx'), 'PhraseQuizScreen')
const ListeningScreen = lazyScreen(() => import('./screens/Listening.jsx'), 'ListeningScreen')
const ListeningQuizScreen = lazyScreen(() => import('./screens/ListeningQuiz.jsx'), 'ListeningQuizScreen')
const DictationScreen = lazyScreen(() => import('./screens/Dictation.jsx'), 'DictationScreen')
const DictationPlayScreen = lazyScreen(() => import('./screens/DictationPlay.jsx'), 'DictationPlayScreen')
const VocabSearchScreen = lazyScreen(() => import('./screens/VocabSearch.jsx'), 'VocabSearchScreen')
const WordRequestsScreen = lazyScreen(() => import('./screens/WordRequests.jsx'), 'WordRequestsScreen')
const MathMapScreen = lazyScreen(() => import('./screens/MathMap.jsx'), 'MathMapScreen')
const MathUnitsScreen = lazyScreen(() => import('./screens/MathUnits.jsx'), 'MathUnitsScreen')
const MathIntroScreen = lazyScreen(() => import('./screens/MathIntro.jsx'), 'MathIntroScreen')
const MathSolveScreen = lazyScreen(() => import('./screens/MathSolve.jsx'), 'MathSolveScreen')
const GrammarScreen = lazyScreen(() => import('./screens/Grammar.jsx'), 'GrammarScreen')
const GrammarQuizScreen = lazyScreen(() => import('./screens/GrammarQuiz.jsx'), 'GrammarQuizScreen')
const GrammarLessonsScreen = lazyScreen(() => import('./screens/GrammarLessons.jsx'), 'GrammarLessonsScreen')
const WritingScreen = lazyScreen(() => import('./screens/Writing.jsx'), 'WritingScreen')
const WritingPlayScreen = lazyScreen(() => import('./screens/WritingPlay.jsx'), 'WritingPlayScreen')
const MyGrammarScreen = lazyScreen(() => import('./screens/MyGrammar.jsx'), 'MyGrammarScreen')
const WritingGrammarReviewScreen = lazyScreen(
  () => import('./screens/WritingGrammarReview.jsx'),
  'WritingGrammarReviewScreen',
)
const DiagnosticScreen = lazyScreen(() => import('./screens/Diagnostic.jsx'), 'DiagnosticScreen')
const KotenListScreen = lazyScreen(() => import('./screens/KotenList.jsx'), 'KotenListScreen')
const KotenStudyScreen = lazyScreen(() => import('./screens/KotenStudy.jsx'), 'KotenStudyScreen')
const KotenQuizScreen = lazyScreen(() => import('./screens/KotenQuiz.jsx'), 'KotenQuizScreen')
const KotenInterpretationListScreen = lazyScreen(
  () => import('./screens/KotenInterpretationList.jsx'),
  'KotenInterpretationListScreen',
)
const KotenInterpretationPrepScreen = lazyScreen(
  () => import('./screens/KotenInterpretationPrep.jsx'),
  'KotenInterpretationPrepScreen',
)
const KotenInterpretationQuizScreen = lazyScreen(
  () => import('./screens/KotenInterpretationQuiz.jsx'),
  'KotenInterpretationQuizScreen',
)
const KotenGrammarScreen = lazyScreen(() => import('./screens/KotenGrammar.jsx'), 'KotenGrammarScreen')
const KotenGrammarStudyScreen = lazyScreen(
  () => import('./screens/KotenGrammarStudy.jsx'),
  'KotenGrammarStudyScreen',
)
const KotenGrammarQuizScreen = lazyScreen(
  () => import('./screens/KotenGrammarQuiz.jsx'),
  'KotenGrammarQuizScreen',
)
const KotenCultureScreen = lazyScreen(() => import('./screens/KotenCulture.jsx'), 'KotenCultureScreen')
const KotenCultureStudyScreen = lazyScreen(
  () => import('./screens/KotenCultureStudy.jsx'),
  'KotenCultureStudyScreen',
)
const KotenCultureQuizScreen = lazyScreen(
  () => import('./screens/KotenCultureQuiz.jsx'),
  'KotenCultureQuizScreen',
)
const KotenSavedScreen = lazyScreen(() => import('./screens/KotenSaved.jsx'), 'KotenSavedScreen')
const KanbunHomeScreen = lazyScreen(() => import('./screens/KanbunHome.jsx'), 'KanbunHomeScreen')
const KanbunCatalogScreen = lazyScreen(() => import('./screens/KanbunCatalog.jsx'), 'KanbunCatalogScreen')
const KanbunStudyScreen = lazyScreen(() => import('./screens/KanbunStudy.jsx'), 'KanbunStudyScreen')
const KanbunQuizScreen = lazyScreen(() => import('./screens/KanbunQuiz.jsx'), 'KanbunQuizScreen')
const KanbunKundokuScreen = lazyScreen(() => import('./screens/KanbunKundoku.jsx'), 'KanbunKundokuScreen')
const KanbunKundokuQuizScreen = lazyScreen(
  () => import('./screens/KanbunKundokuQuiz.jsx'),
  'KanbunKundokuQuizScreen',
)
const KanbunSavedScreen = lazyScreen(() => import('./screens/KanbunSaved.jsx'), 'KanbunSavedScreen')

const SCREENS = {
  portal: PortalScreen,
  login: LoginScreen,
  home: HomeScreen,
  vocabLevels: VocabLevelsScreen,
  vocabGroups: VocabGroupsScreen,
  vocabDecks: VocabDecksScreen,
  vocabStudy: VocabStudyScreen,
  vocabQuiz: VocabQuizScreen,
  sessionResult: SessionResultScreen,
  wordDetail: WordDetailScreen,
  rootDetail: RootDetailScreen,
  etymologyPack: EtymologyPackScreen,
  etymologyStudy: EtymologyStudyScreen,
  roots: RootsScreen,
  myLearning: MyLearningScreen,
  myList: MyListScreen,
  vocabCamera: VocabCameraScreen,
  progress: ProgressScreen,
  settings: SettingsScreen,
  readingList: ReadingListScreen,
  readingRules: ReadingRulesScreen,
  readingPrep: ReadingPrepScreen,
  reader: ReaderScreen,
  readingSummary: ReadingSummaryScreen,
  literatureLibrary: LiteratureLibraryScreen,
  literatureReader: LiteratureReaderScreen,
  phrases: PhrasesScreen,
  phraseStudy: PhraseStudyScreen,
  phraseQuiz: PhraseQuizScreen,
  listening: ListeningScreen,
  listeningQuiz: ListeningQuizScreen,
  dictation: DictationScreen,
  dictationPlay: DictationPlayScreen,
  vocabSearch: VocabSearchScreen,
  wordRequests: WordRequestsScreen,
  mathMap: MathMapScreen,
  mathUnits: MathUnitsScreen,
  mathIntro: MathIntroScreen,
  mathSolve: MathSolveScreen,
  grammar: GrammarScreen,
  grammarQuiz: GrammarQuizScreen,
  grammarLessons: GrammarLessonsScreen,
  writing: WritingScreen,
  writingPlay: WritingPlayScreen,
  myGrammar: MyGrammarScreen,
  writingGrammarReview: WritingGrammarReviewScreen,
  diagnostic: DiagnosticScreen,
  kotenList: KotenListScreen,
  kotenStudy: KotenStudyScreen,
  kotenQuiz: KotenQuizScreen,
  kotenInterpretationList: KotenInterpretationListScreen,
  kotenInterpretationPrep: KotenInterpretationPrepScreen,
  kotenInterpretationQuiz: KotenInterpretationQuizScreen,
  kotenGrammar: KotenGrammarScreen,
  kotenGrammarStudy: KotenGrammarStudyScreen,
  kotenGrammarQuiz: KotenGrammarQuizScreen,
  kotenCulture: KotenCultureScreen,
  kotenCultureStudy: KotenCultureStudyScreen,
  kotenCultureQuiz: KotenCultureQuizScreen,
  kotenSaved: KotenSavedScreen,
  kanbunHome: KanbunHomeScreen,
  kanbunCatalog: KanbunCatalogScreen,
  kanbunStudy: KanbunStudyScreen,
  kanbunQuiz: KanbunQuizScreen,
  kanbunKundoku: KanbunKundokuScreen,
  kanbunKundokuQuiz: KanbunKundokuQuizScreen,
  kanbunSaved: KanbunSavedScreen,
}

// 全公開画面はAppShell上部の戻る・統一メニュー入口を共有する。

// 学習アプリ本体（ログイン済みのときだけ表示）。
function MainApp() {
  const screen = useStore((s) => s.screen)
  const params = useStore((s) => s.params)
  const destination = learnerDestination(screen, params)
  const Screen = SCREENS[destination.screen] ?? HomeScreen
  return (
    <>
      <AppShell>
        <Suspense fallback={<ScreenLoader />}>
          <Screen />
        </Suspense>
      </AppShell>
      <SpeechSettingsSheet />
    </>
  )
}

function ScreenLoader() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 text-ink/50">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
      <p className="text-xs font-bold">画面を読み込み中…</p>
    </div>
  )
}

// 中央寄せのシンプルなスプラッシュ（読み込み中表示）。
function Splash({ label }) {
  return (
    <AppShell showGlobalMenu={false}>
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
