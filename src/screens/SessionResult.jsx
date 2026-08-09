import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { ProgressRing, ProgressBar, Button, Card } from '../components/ui.jsx'
import { Star, Flame, Refresh, Home, Bookmark, ArrowRight } from '../components/Icons.jsx'
import { heroProgress } from '../lib/rpg.js'
import { HeroPortrait } from '../components/HeroPortrait.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { DragonVeinCipherStage } from '../components/DragonVeinCipherStage.jsx'
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
  const goHome = useStore((state) => state.goHome)
  const streak = useStore((state) => state.stats.streak)
  const totalXp = useStore((state) => state.stats.xp)
  const selectedStudentId = useStore((state) => state.battleStudentId)
  const dragonVeinProgress = useStore((state) => state.dragonVeinProgress)
  const recordSkillResult = useStore((state) => state.recordSkillResult)
  const recordDragonVeinSession = useStore((state) => state.recordDragonVeinSession)
  const {
    title = '学習',
    mode = 'study',
    total = 0,
    correct = 0,
    wrong = 0,
    xpGained = 0,
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

  const heroBefore = heroProgress(Math.max(0, totalXp - xpGained))
  const heroAfter = heroProgress(totalXp)
  const leveledUp = heroAfter.level > heroBefore.level

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
    // 設問ごとのSRS・XPは各クイズ画面で確定済み。ここでは累計だけを一度記録する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const message = accuracy >= 0.9
    ? { emoji: '🏆', text: isDragonVein ? '記憶の文脈が鮮明に戻った！' : 'パーフェクト級！', color: '#f59e0b' }
    : accuracy >= 0.7
      ? { emoji: '✨', text: isDragonVein ? '龍脈の絡みがほどけていく' : 'よくできました！', color: '#10b981' }
      : accuracy >= 0.4
        ? { emoji: '🔎', text: isDragonVein ? '違和感の正体が見えてきた' : 'いい調子！', color: '#6366f1' }
        : { emoji: '💡', text: isDragonVein ? '手掛かりは残った。先生と整理しよう' : 'ここから伸びる！', color: '#0ea5e9' }

  const isPhrase = engine === 'phrase'
  const isGrammar = engine === 'grammar'
  const isDictation = engine === 'dictation' || params.replayScreen === 'dictationPlay'
  const isListening = engine === 'listening' || params.replayScreen === 'listeningQuiz'
  const isVocabStudy = mode === 'study' && engine === 'word'
  const isMemoryCheck = mode === 'study' && (engine === 'word' || engine === 'phrase')
  const reviewUnit = isGrammar || isDictation || isListening ? '問' : isPhrase ? '項目' : '語'

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
        })
      : isDictation
        ? navigate('dictationPlay', {
            source: { type: 'dictationList', ids: reviewIds, levelId: source?.levelId },
            title: `${title}・まちがい復習`,
            mode: 'quiz',
            engine: 'dictation',
            replayScreen: 'dictationPlay',
          })
        : isGrammar
          ? navigate('grammarQuiz', {
              source: { type: 'grammarList', ids: reviewIds },
              title: isMemoryCheck ? 'もう一度確認' : 'まちがい復習',
              mode: 'quiz',
              engine: 'grammar',
              replayScreen: 'grammarQuiz',
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
              })
            : navigate('vocabStudy', {
                source: { type: 'mylist', ids: reviewIds },
                title: 'まちがい復習',
                mode: 'study',
                size: reviewIds.length,
                continueTo: params.continueTo,
              })
  )

  if (isDragonVein) {
    const expressionStreak = accuracy >= 0.9 ? 5 : accuracy >= 0.7 ? 3 : 0
    const resultLastAnswer = accuracy >= 0.7 ? 'correct' : 'wrong'
    const kindLabel = restorationKind === 'phrase' ? '熟語・構文' : '英単語'
    const mainComplete = dragonVeinMainComplete(dragonVeinProgress)
    return (
      <div className="dragon-vein-result-screen relative min-h-full overflow-x-hidden px-3 pb-8 pt-3 text-center">
        {percent >= 80 && <Confetti />}
        <div className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20"><SpeechSettingsButton compact /></div>
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
            <Card className="p-3"><b className="block text-xl text-amber-600">+{xpGained}</b><small className="font-bold text-ink/45">調査XP</small></Card>
          </div>

          <Card className="mt-3 p-4 text-left">
            {source?.isDaily ? (
              <>
                <p className="text-xs font-black tracking-wider text-emerald-600">日常の歪みを修復</p>
                <h2 className="mt-1 font-display text-lg font-extrabold text-ink">{source?.distortionTitle ?? '街の違和感を記録した'}</h2>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">この調査XPは五芒星の主要龍脈へ挑む力になる。</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div><p className="text-xs font-black tracking-wider" style={{ color: node.accent }}>{node.levelLabel}・{kindLabel}</p><h2 className="font-display text-lg font-extrabold text-ink">{node.name}の復元進捗</h2></div>
                  <b className="text-2xl text-ink">{track?.correct ?? 0}<small className="text-xs text-ink/40">/{DRAGON_VEIN_TARGET}</small></b>
                </div>
                <ProgressBar value={(track?.correct ?? 0) / DRAGON_VEIN_TARGET} color={node.accent} className="mt-3" />
                <p className="mt-2 text-xs font-bold text-ink/50">単語と熟語・構文がそれぞれ100正解に達すると、この頂点が正常化する。</p>
                {nodeStatus.complete && <p className="mt-2 font-extrabold text-emerald-600">✨ {node.name}の龍脈は正常化済み</p>}
                {mainComplete && <p className="mt-2 font-extrabold text-fuchsia-600">👑 1級エクストラステージが開いた</p>}
              </>
            )}
          </Card>

          <LevelCard before={heroBefore} after={heroAfter} xpGained={xpGained} />
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

  return (
    <div className="relative flex min-h-full flex-col items-center gap-5 overflow-x-hidden px-6 pb-8 pt-8 text-center">
      {(percent >= 80 || leveledUp) && <Confetti />}
      <div className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)] z-20"><SpeechSettingsButton compact /></div>
      <div className="text-6xl animate-float">{message.emoji}</div>
      <h1 className="font-display text-2xl font-extrabold text-ink">{message.text}</h1>
      <p className="-mt-3 text-sm font-bold text-ink/45">{title}・{mode === 'quiz' ? 'クイズ' : '暗記'}</p>
      <ProgressRing value={accuracy} size={150} stroke={14} color={message.color}>
        <span className="font-display text-4xl font-extrabold text-ink">{percent}%</span>
        <span className="text-xs font-bold text-ink/45">{correct}/{total} 正解</span>
      </ProgressRing>
      <div className="flex w-full max-w-xs gap-3">
        <Card className="flex flex-1 flex-col items-center gap-1 p-3"><span className="text-hint"><Star size={22} /></span><span className="font-display text-xl font-extrabold text-ink">+{xpGained}</span><span className="text-[11px] font-bold text-ink/45">獲得XP</span></Card>
        <Card className="flex flex-1 flex-col items-center gap-1 p-3"><span className="text-rose-500"><Flame size={22} /></span><span className="font-display text-xl font-extrabold text-ink">{streak}</span><span className="text-[11px] font-bold text-ink/45">連続日数</span></Card>
      </div>
      <LevelCard before={heroBefore} after={heroAfter} xpGained={xpGained} />
      <div className="mt-2 w-full max-w-xs space-y-2.5">
        {params.continueTo?.screen && <Button full onClick={() => navigate(params.continueTo.screen, params.continueTo.params ?? {})}>{params.continueTo.label ?? '次へ'} <ArrowRight size={18} /></Button>}
        {wrong > 0 && <Button full variant="primary" onClick={reviewWrong}>{isMemoryCheck ? <><Refresh size={18} /> 「まだ」の{wrong}{reviewUnit}をもう一度確認する</> : <><Bookmark size={18} /> まちがい {wrong}{reviewUnit}を復習</>}</Button>}
        <Button full variant="secondary" onClick={replay}>{isVocabStudy ? <ArrowRight size={18} /> : <Refresh size={18} />}{isVocabStudy ? '次に進む' : 'もう一度'}</Button>
        <Button full variant="ghost" onClick={goHome}><Home size={18} /> ホームへ</Button>
      </div>
    </div>
  )
}

function LevelCard({ before, after, xpGained }) {
  const leveledUp = after.level > before.level
  return (
    <Card className={`mt-3 w-full max-w-xl p-3.5 ${leveledUp ? 'bg-gradient-to-br from-amber-50 to-violet-50 ring-2 ring-amber-300' : ''}`}>
      <div className="flex items-center gap-3">
        <HeroPortrait level={after.level} title={after.title} className="h-12 w-12" />
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-2"><span className="font-display font-extrabold text-ink">{leveledUp ? `調査LEVEL UP! ${before.level} → ${after.level}` : `調査レベル ${after.level}`}</span><span className="text-[10px] font-extrabold text-brand-500">+{xpGained} XP</span></div>
          <p className="truncate text-[11px] font-bold text-ink/50">{after.title.name}</p>
          <ProgressBar value={after.progress} color={leveledUp ? 'linear-gradient(90deg,#fbbf24,#8b5cf6)' : '#6366f1'} className="mt-1.5 h-2" />
          <div className="mt-1 flex justify-between text-[9px] font-bold text-ink/40"><span>{after.totalXp.toLocaleString()} XP</span><span>{after.isMax ? 'MAX LEVEL' : `次まで ${after.xpToNext} XP`}</span></div>
        </div>
      </div>
    </Card>
  )
}
