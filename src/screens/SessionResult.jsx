import { useEffect, useMemo, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { ProgressRing, ProgressBar, Button, Card } from '../components/ui.jsx'
import { Flame, Refresh, Home, Bookmark, ArrowRight } from '../components/Icons.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { VocabCompletionReport } from '../components/VocabCompletionReport.jsx'
import { DragonVeinCipherStage } from '../components/DragonVeinCipherStage.jsx'
import { buildVocabCompletionReport } from '../lib/learningAnalyticsReport.js'
import {
  DRAGON_VEIN_TARGET,
  dragonVeinMainComplete,
  dragonVeinNodeById,
  dragonVeinNodeStatus,
  dragonVeinSourceKind,
  isDragonVeinSource,
} from '../lib/dragonVein.js'

function inferSkill({ engine, replayScreen }) {
  if (engine === 'grammar') return 'grammar'
  if (engine === 'phrase') return 'usage'
  if (engine === 'dictation') return 'dictation'
  if (engine === 'listening') return 'listening'
  if (replayScreen === 'dictationPlay') return 'dictation'
  if (replayScreen === 'listeningQuiz') return 'listening'
  return 'vocab'
}

const PIECES = ['🎉', '✨', '⭐', '🎊', '💫', '🌟']
function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: 18 }, (_, index) => (
        <span
          key={index}
          className="absolute top-0"
          style={{
            left: `${(index * 53) % 100}%`,
            fontSize: 16 + (index % 4) * 6,
            animation: `confetti-fall ${2.4 + (index % 5) * 0.4}s linear ${(index % 9) * 0.16}s`,
          }}
        >
          {PIECES[index % PIECES.length]}
        </span>
      ))}
    </div>
  )
}
export function SessionResultScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const exitSessionResult = useStore((state) => state.exitSessionResult)
  const goHome = useStore((state) => state.goHome)
  const stats = useStore((state) => state.stats)
  const settings = useStore((state) => state.settings)
  const srs = useStore((state) => state.srs)
  const learningAnalytics = useStore((state) => state.learningAnalytics)
  const skillStats = useStore((state) => state.skillStats)
  const streak = stats.streak
  const selectedStudentId = useStore((state) => state.battleStudentId)
  const dragonVeinProgress = useStore((state) => state.dragonVeinProgress)
  const recordSkillResult = useStore((state) => state.recordSkillResult)
  const recordDragonVeinSession = useStore((state) => state.recordDragonVeinSession)
  const advanceGrammarStrand = useStore((state) => state.advanceGrammarStrand)
  const {
    title = '学習',
    mode = 'study',
    total = 0,
    correct = 0,
    wrong = 0,
    reviewIds = [],
    source,
    engine = 'word',
    sessionId,
  } = params
  const accuracy = total ? correct / total : 0
  const percent = Math.round(accuracy * 100)
  const isDragonVein = isDragonVeinSource(source)
  const node = isDragonVein ? dragonVeinNodeById(source?.locationId) : null
  const restorationKind = isDragonVein ? dragonVeinSourceKind(source) : null
  const nodeStatus = isDragonVein ? dragonVeinNodeStatus(dragonVeinProgress, node.id) : null
  const track = nodeStatus?.[restorationKind]
  const recorded = useRef(false)
  const reportNow = useRef(
    Number.isFinite(params.vocabSession?.completedAt)
      ? params.vocabSession.completedAt
      : Date.now(),
  ).current

  const isPhrase = engine === 'phrase'
  const isGrammar = engine === 'grammar'
  const isDictation = engine === 'dictation' || params.replayScreen === 'dictationPlay'
  const isListening = engine === 'listening' || params.replayScreen === 'listeningQuiz'
  const isVocabStudy = mode === 'study' && engine === 'word'
  const isVocabResult = engine === 'word' || engine === 'vocab'
  const isMemoryCheck = mode === 'study' && (engine === 'word' || engine === 'phrase')
  const reviewUnit = isGrammar || isDictation || isListening ? '問' : isPhrase ? '項目' : '語'
  const vocabSessionIds = params.vocabSession?.wordIds ?? []
  const vocabReviewIds = reviewIds.length ? reviewIds : vocabSessionIds
  const vocabNextAfterReview = params.continueTo?.screen
    ? params.continueTo
    : {
        screen: 'vocabStudy',
        params: {
          source,
          title,
          mode: 'study',
          engine: 'word',
          size: params.size,
          returnTo: params.returnTo,
        },
      }
  const vocabCompletion = useMemo(() => {
    if (!isVocabStudy || !params.vocabSession?.wordIds?.length) return null
    return buildVocabCompletionReport({
      srs,
      learningAnalytics,
      skillStats,
      wordIds: params.vocabSession.wordIds,
      beforeBoxes: params.vocabSession.beforeBoxes,
      reviewIds,
      correct,
      wrong,
      dailyGoal: settings.dailyGoal,
      now: reportNow,
    })
  }, [
    correct,
    isVocabStudy,
    learningAnalytics,
    params.vocabSession,
    reportNow,
    reviewIds,
    settings.dailyGoal,
    skillStats,
    srs,
    wrong,
  ])

  useEffect(() => {
    if (recorded.current || !total) return
    recorded.current = true
    if (mode !== 'study') {
      recordSkillResult(inferSkill(params), correct, total, { trackLearning: false })
    }
    if (isDragonVein) {
      recordDragonVeinSession({
        sessionId: sessionId ?? `legacy-${Date.now()}-${source?.locationId ?? 'library'}`,
        source,
        correct,
        answered: total,
      })
    }
    // 系統テストは正答率で次回の級（現在地）を上下させる。
    if (source?.type === 'grammarStrand' && source.strandId) {
      advanceGrammarStrand(source.strandId, accuracy)
    }
    // 設問ごとのSRSは各テスト画面で確定済み。ここでは累計だけを一度記録する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const message = accuracy >= 0.9
    ? { emoji: '🏆', text: isDragonVein ? '失われた記憶がはっきり戻った！' : 'すばらしい結果です！', color: '#f59e0b' }
    : accuracy >= 0.7
      ? { emoji: '✨', text: isDragonVein ? '龍脈の絡みがほどけていく' : 'よくできました！', color: '#10b981' }
      : accuracy >= 0.4
        ? { emoji: '🔎', text: isDragonVein ? '違和感の正体が見えてきた' : 'いい調子！', color: '#6366f1' }
        : { emoji: '💡', text: isDragonVein ? '手掛かりは残った。先生と整理しよう' : 'ここから伸びる！', color: '#0ea5e9' }

  const replay = () => {
    const target = params.replayScreen
      ?? (isPhrase
        ? mode === 'quiz' ? 'phraseQuiz' : 'phraseStudy'
        : mode === 'quiz' ? 'vocabQuiz' : 'vocabStudy')
    navigate(target, {
      source,
      title,
      mode,
      engine,
      replayScreen: params.replayScreen,
      size: params.size,
      continueTo: params.continueTo,
      returnTo: params.returnTo,
    })
  }

  const reviewWrong = () => (
    isListening
      ? navigate('listeningQuiz', {
          source: { type: 'listeningList', ids: reviewIds, levelId: source?.levelId },
          title: `${title}・まちがい復習`,
          mode: 'quiz',
          engine: 'listening',
          replayScreen: 'listeningQuiz',
          continueTo: params.continueTo,
          returnTo: params.returnTo,
        })
      : isDictation
        ? navigate('dictationPlay', {
            source: { type: 'dictationList', ids: reviewIds, levelId: source?.levelId },
            title: `${title}・まちがい復習`,
            mode: 'quiz',
            engine: 'dictation',
            replayScreen: 'dictationPlay',
            continueTo: params.continueTo,
            returnTo: params.returnTo,
          })
        : isGrammar
          ? navigate('grammarQuiz', {
              source: { type: 'grammarList', ids: reviewIds },
              title: isMemoryCheck ? 'もう一度確認' : 'まちがい復習',
              mode: 'quiz',
              engine: 'grammar',
              replayScreen: 'grammarQuiz',
              continueTo: params.continueTo,
              returnTo: params.returnTo,
            })
          : isPhrase
            ? navigate('phraseStudy', {
                source: source?.type === 'customPhrase'
                  ? { type: 'customPhrase', items: (source.items ?? []).filter((item) => reviewIds.includes(item.id)) }
                  : { type: 'phraseList', kind: source?.kind, ids: reviewIds },
                title: isMemoryCheck ? 'もう一度確認' : 'まちがい復習',
                mode: 'study',
                engine: 'phrase',
                size: reviewIds.length,
                continueTo: params.continueTo,
                returnTo: params.returnTo,
              })
            : navigate('vocabStudy', {
                source: { type: 'mylist', ids: vocabReviewIds },
                title: '復習',
                mode: 'study',
                size: vocabReviewIds.length,
                continueTo: vocabNextAfterReview,
                returnTo: params.returnTo,
              })
  )

  const continueVocab = () => {
    if (params.continueTo?.screen) {
      navigate(params.continueTo.screen, params.continueTo.params ?? {})
      return
    }
    replay()
  }

  const reviewVocabSchedule = (scheduleItem) => {
    const ids = Array.isArray(scheduleItem?.ids) ? scheduleItem.ids : []
    if (!ids.length) return
    navigate('vocabStudy', {
      source: { type: 'mylist', ids },
      title: scheduleItem.days === 0 || scheduleItem.id === 'now'
        ? '今日の復習'
        : `${scheduleItem.label}の内容を今練習`,
      mode: 'study',
      size: ids.length,
      continueTo: vocabNextAfterReview,
      returnTo: params.returnTo,
    })
  }

  const returnFromVocab = () => {
    exitSessionResult()
  }

  if (isDragonVein) {
    const expressionStreak = accuracy >= 0.9 ? 5 : accuracy >= 0.7 ? 3 : 0
    const resultLastAnswer = accuracy >= 0.7 ? 'correct' : 'wrong'
    const kindLabel = restorationKind === 'phrase' ? '熟語・構文' : '英単語'
    const mainComplete = dragonVeinMainComplete(dragonVeinProgress)
    return (
      <div className="dragon-vein-result-screen relative min-h-full overflow-x-hidden px-3 pb-8 pt-3 text-center">
        {percent >= 80 && <Confetti />}
        <div className="absolute right-3 top-3 z-20"><SpeechSettingsButton compact /></div>
        <section className="mx-auto w-full max-w-xl" data-testid="dragon-vein-result" aria-label={`${node.name}の龍脈修復結果`}>
          <header className="mb-2 text-left">
            <p className="text-xs font-black tracking-[0.18em] text-violet-600">RESTORATION REPORT</p>
            <h1 className="font-display text-2xl font-extrabold text-ink">{message.emoji} {message.text}</h1>
          </header>
          <DragonVeinCipherStage
            source={source}
            studentId={selectedStudentId}
            answered
            lastAnswer={resultLastAnswer}
            streak={expressionStreak}
            wrongStreak={accuracy < 0.4 ? 2 : 0}
            current={total}
            total={total}
          />

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Card className="p-3"><b className="block text-xl text-ink">{percent}%</b><small className="font-bold text-ink/45">{correct}/{total} 正解</small></Card>
            <Card className="p-3"><b className="block text-xl text-violet-600">+{correct}</b><small className="font-bold text-ink/45">復元断片</small></Card>
            <Card className="p-3"><b className="block text-xl text-amber-600">{wrong}</b><small className="font-bold text-ink/45">復習対象</small></Card>
          </div>

          <Card className="mt-3 p-4 text-left">
            {source?.isDaily ? (
              <>
                <p className="text-xs font-black tracking-wider text-emerald-600">日常の歪みを修復</p>
                <h2 className="mt-1 font-display text-lg font-extrabold text-ink">{source?.distortionTitle ?? '街の違和感を記録した'}</h2>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">正誤と復習候補を学習記録へ反映しました。</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div><p className="text-xs font-black tracking-wider" style={{ color: node.accent }}>{node.levelLabel}・{kindLabel}</p><h2 className="font-display text-lg font-extrabold text-ink">{node.name}の復元進捗</h2></div>
                  <b className="text-2xl text-ink">{track?.correct ?? 0}<small className="text-xs text-ink/40">/{DRAGON_VEIN_TARGET}</small></b>
                </div>
                <ProgressBar value={(track?.correct ?? 0) / DRAGON_VEIN_TARGET} color={node.accent} className="mt-3" />
                <p className="mt-2 text-xs font-bold text-ink/50">単語と熟語・構文でそれぞれ100問正解すると、この場所の龍脈が元に戻ります。</p>
                {nodeStatus.complete && <p className="mt-2 font-extrabold text-emerald-600">✨ {node.name}の龍脈を修復しました</p>}
                {mainComplete && <p className="mt-2 font-extrabold text-fuchsia-600">👑 1級エクストラステージが開いた</p>}
              </>
            )}
          </Card>

          <div className="mt-3 space-y-2.5">
            <Button full onClick={() => navigate('afterSchoolChronicle', { menuSectionId: 'restoration' })}>
              龍脈調査へ戻る <ArrowRight size={18} />
            </Button>
            {wrong > 0 && <Button full variant="secondary" onClick={reviewWrong}><Bookmark size={16} /> 手掛かりを復習 {wrong}{reviewUnit}</Button>}
            <Button full variant="secondary" onClick={replay}><Refresh size={18} /> もう一度解読</Button>
            <Button full variant="ghost" onClick={goHome}><Home size={18} /> ホーム</Button>
          </div>
        </section>
      </div>
    )
  }

  if (vocabCompletion) {
    return (
      <div className="relative min-h-full overflow-x-hidden bg-slate-50 px-3 pb-8 pt-3">
        <div className="relative z-20 mb-2 flex justify-end"><SpeechSettingsButton compact /></div>
        <VocabCompletionReport
          report={vocabCompletion}
          title={title}
          streak={stats.streak}
          onReviewNow={reviewWrong}
          onContinue={continueVocab}
          onBack={returnFromVocab}
          onWord={(id) => navigate('wordDetail', { id })}
          onReviewSchedule={reviewVocabSchedule}
        />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-full flex-col items-center gap-5 overflow-x-hidden px-6 pb-8 pt-8 text-center">
      {percent >= 80 && <Confetti />}
      <div className="absolute right-3 top-3 z-20"><SpeechSettingsButton compact /></div>
      <div className="text-6xl animate-float">{message.emoji}</div>
      <h1 className="font-display text-2xl font-extrabold text-ink">{message.text}</h1>
      <p className="-mt-3 text-sm font-bold text-ink/45">{title}・{mode === 'quiz' ? 'テスト' : '暗記'}</p>
      <ProgressRing value={accuracy} size={150} stroke={14} color={message.color}>
        <span className="font-display text-4xl font-extrabold text-ink">{percent}%</span>
        <span className="text-xs font-bold text-ink/45">{correct}/{total} 正解</span>
      </ProgressRing>
      <div className="flex w-full max-w-xs gap-3">
        <Card className="flex flex-1 flex-col items-center gap-1 p-3"><span className="text-brand-500"><Bookmark size={22} /></span><span className="font-display text-xl font-extrabold text-ink">{wrong}</span><span className="text-[11px] font-bold text-ink/45">復習対象</span></Card>
        <Card className="flex flex-1 flex-col items-center gap-1 p-3"><span className="text-rose-500"><Flame size={22} /></span><span className="font-display text-xl font-extrabold text-ink">{streak}</span><span className="text-[11px] font-bold text-ink/45">連続日数</span></Card>
      </div>
      <div className="mt-2 w-full max-w-xs space-y-2.5">
        {isVocabResult ? (
          <>
            <Button full onClick={reviewWrong}><Refresh size={18} /> 復習する</Button>
            <Button full variant="secondary" onClick={continueVocab}>次へ進む <ArrowRight size={18} /></Button>
            <Button full variant="ghost" onClick={returnFromVocab}>戻る</Button>
          </>
        ) : (
          <>
            {params.continueTo?.screen && <Button full onClick={() => navigate(params.continueTo.screen, params.continueTo.params ?? {})}>{params.continueTo.label ?? '次へ'} <ArrowRight size={18} /></Button>}
            {wrong > 0 && <Button full variant="primary" onClick={reviewWrong}>{isMemoryCheck ? <><Refresh size={18} /> 「まだ」の{wrong}{reviewUnit}をもう一度確認する</> : <><Bookmark size={18} /> まちがい {wrong}{reviewUnit}を復習</>}</Button>}
            <Button full variant="secondary" onClick={replay}><Refresh size={18} /> もう一度</Button>
            <Button full variant="ghost" onClick={exitSessionResult}><Home size={18} /> 学習メニューへ戻る</Button>
          </>
        )}
      </div>
    </div>
  )
}
