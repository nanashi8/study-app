import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ProgressRing, ProgressBar, Button, Card } from '../components/ui.jsx'
import { Star, Flame, Refresh, Home, Bookmark, ArrowRight } from '../components/Icons.jsx'
import { enemyLevel, nextPosition, battleTrend } from '../lib/adaptive.js'
import {
  battleQuest,
  battleVerdict,
  encounterFor,
  heroProgress,
} from '../lib/rpg.js'

// セッションの種類から「スキル」を判定する（弱点ナビ用）。
function inferSkill({ engine, replayScreen }) {
  if (engine === 'grammar') return 'grammar'
  if (engine === 'phrase') return 'usage'
  if (engine === 'dictation') return 'dictation'
  if (engine === 'listening') return 'listening'
  if (replayScreen === 'dictationPlay') return 'dictation'
  if (replayScreen === 'listeningQuiz') return 'listening'
  if (replayScreen === 'pronouncePlay') return 'pronunciation'
  return 'vocab'
}

const PIECES = ['🎉', '✨', '⭐', '🎊', '💫', '🌟']
function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: 18 }).map((_, k) => (
        <span
          key={k}
          className="absolute top-0"
          style={{
            left: `${(k * 53) % 100}%`,
            fontSize: 16 + (k % 4) * 6,
            animation: `confetti-fall ${2.4 + (k % 5) * 0.4}s linear ${(k % 9) * 0.16}s`,
          }}
        >
          {PIECES[k % PIECES.length]}
        </span>
      ))}
    </div>
  )
}

export function SessionResultScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const goHome = useStore((s) => s.goHome)
  const streak = useStore((s) => s.stats.streak)
  const totalXp = useStore((s) => s.stats.xp)

  const { title = '学習', mode = 'study', total = 0, correct = 0, wrong = 0, xpGained = 0, reviewIds = [], source, engine = 'word' } = params
  const acc = total ? correct / total : 0
  const pct = Math.round(acc * 100)

  // この結果をスキル別テスト結果として1回だけ記録する（学習マップの弱点ナビが参照）。
  const recordSkillResult = useStore((s) => s.recordSkillResult)
  const recordBattle = useStore((s) => s.recordBattle)
  const isBattle = source?.type === 'battle'
  const heroBefore = heroProgress(Math.max(0, totalXp - xpGained))
  const heroAfter = heroProgress(totalXp)
  const leveledUp = heroAfter.level > heroBefore.level
  const newRelics = heroAfter.relics.filter(
    (relic) => relic.level > heroBefore.level,
  )
  const encounter = isBattle
    ? encounterFor({
        level: source?.heroLevel ?? heroBefore.level,
        day: source?.adventureDay ?? 0,
        enemyRankIndex: source?.levelIndex ?? 0,
      })
    : null
  const quest = isBattle ? battleQuest(source?.questId) : null
  const verdict = isBattle ? battleVerdict(acc) : null
  const [battle, setBattle] = useState(null) // { from, to, trend }
  const recorded = useRef(false)
  useEffect(() => {
    // 暗記カード（自己採点の study）はテストではないので弱点判定に含めない。
    if (recorded.current || !total || mode === 'study') return
    recorded.current = true
    recordSkillResult(inferSkill(params), correct, total)
    // 適応バトルなら成績でポジションを上下させ、敵LVの変化を表示する。
    if (isBattle) {
      const from = useStore.getState().engPos ?? 0
      const to = nextPosition(from, acc)
      recordBattle(acc)
      setBattle({ from, to, trend: battleTrend(from, to) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const msg = isBattle
    ? {
        emoji: verdict.emoji,
        text: verdict.title,
        color:
          verdict.id === 'legendary'
            ? '#f59e0b'
            : verdict.id === 'victory'
              ? '#10b981'
              : verdict.id === 'draw'
                ? '#6366f1'
                : '#0ea5e9',
      }
    : acc >= 0.9
      ? { emoji: '🏆', text: 'パーフェクト級！', color: '#f59e0b' }
      : acc >= 0.7
        ? { emoji: '🎉', text: 'よくできました！', color: '#10b981' }
        : acc >= 0.4
          ? { emoji: '💪', text: 'いい調子！', color: '#6366f1' }
          : { emoji: '🌱', text: 'ここから伸びる！', color: '#0ea5e9' }

  const isPhrase = engine === 'phrase'
  const isGrammar = engine === 'grammar'
  const isDictation = engine === 'dictation' || params.replayScreen === 'dictationPlay'
  const isListening = engine === 'listening' || params.replayScreen === 'listeningQuiz'
  const reviewUnit = isGrammar || isDictation || isListening ? '問' : isPhrase ? '項目' : '語'

  const replay = () => {
    const target =
      params.replayScreen ??
      (isPhrase ? (mode === 'quiz' ? 'phraseQuiz' : 'phraseStudy') : mode === 'quiz' ? 'vocabQuiz' : 'vocabStudy')
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

  const reviewWrong = () =>
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
          title: 'まちがい復習',
          mode: 'quiz',
          engine: 'grammar',
          replayScreen: 'grammarQuiz',
        })
      : isPhrase
      ? navigate('phraseStudy', {
          source:
            source?.type === 'customPhrase'
              ? {
                  type: 'customPhrase',
                  items: (source.items ?? []).filter((item) => reviewIds.includes(item.id)),
                }
              : { type: 'phraseList', kind: source?.kind, ids: reviewIds },
          title: 'まちがい復習',
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

  return (
    <div className="relative flex min-h-full flex-col items-center gap-5 overflow-x-hidden px-6 pb-8 pt-8 text-center">
      {(pct >= 80 || leveledUp) && <Confetti />}
      <div className="text-6xl animate-float">{msg.emoji}</div>
      <h1 className="font-display text-2xl font-extrabold text-ink">{msg.text}</h1>
      <p className="-mt-3 text-sm font-bold text-ink/45">
        {isBattle
          ? `${encounter.emoji} ${encounter.name}・${quest.label}`
          : `${title}・${mode === 'quiz' ? 'クイズ' : '暗記'}`}
      </p>

      <ProgressRing value={acc} size={150} stroke={14} color={msg.color}>
        <span className="font-display text-4xl font-extrabold text-ink">{pct}%</span>
        <span className="text-xs font-bold text-ink/45">
          {correct}/{total} 正解
        </span>
      </ProgressRing>

      <div className="flex w-full max-w-xs gap-3">
        <Card className="flex flex-1 flex-col items-center gap-1 p-3">
          <span className="text-hint"><Star size={22} /></span>
          <span className="font-display text-xl font-extrabold text-ink">+{xpGained}</span>
          <span className="text-[11px] font-bold text-ink/45">獲得XP</span>
        </Card>
        <Card className="flex flex-1 flex-col items-center gap-1 p-3">
          <span className="text-rose-500"><Flame size={22} /></span>
          <span className="font-display text-xl font-extrabold text-ink">{streak}</span>
          <span className="text-[11px] font-bold text-ink/45">連続日数</span>
        </Card>
      </div>

      <HeroLevelCard
        before={heroBefore}
        after={heroAfter}
        xpGained={xpGained}
        newRelics={newRelics}
      />

      {battle && (
        <BattleOutcome
          battle={battle}
          encounter={encounter}
          verdict={verdict}
        />
      )}

      <div className="mt-2 w-full max-w-xs space-y-2.5">
        {params.continueTo?.screen && (
          <Button
            full
            onClick={() => navigate(params.continueTo.screen, params.continueTo.params ?? {})}
          >
            {params.continueTo.label ?? '次へ'} <ArrowRight size={18} />
          </Button>
        )}
        {wrong > 0 && (
          <Button full variant="primary" onClick={reviewWrong}>
            <Bookmark size={18} /> まちがい {wrong}{reviewUnit}を復習
          </Button>
        )}
        <Button full variant="secondary" onClick={replay}>
          <Refresh size={18} /> もう一度
        </Button>
        <Button full variant="ghost" onClick={goHome}>
          <Home size={18} /> ホームへ
        </Button>
      </div>
    </div>
  )
}

function HeroLevelCard({ before, after, xpGained, newRelics }) {
  const leveledUp = after.level > before.level
  return (
    <Card
      className={`w-full max-w-xs overflow-hidden p-3.5 ${
        leveledUp
          ? 'bg-gradient-to-br from-amber-50 to-violet-50 ring-2 ring-amber-300'
          : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
          {after.title.emoji}
        </span>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-extrabold text-ink">
              {leveledUp
                ? `LEVEL UP! ${before.level} → ${after.level}`
                : `冒険者 LV${after.level}`}
            </span>
            <span className="text-[10px] font-extrabold text-brand-500">
              +{xpGained} XP
            </span>
          </div>
          <p className="truncate text-[11px] font-bold text-ink/50">
            {after.title.name}
          </p>
          <ProgressBar
            value={after.progress}
            color={
              leveledUp
                ? 'linear-gradient(90deg,#fbbf24,#8b5cf6)'
                : '#6366f1'
            }
            className="mt-1.5 h-2"
          />
          <div className="mt-1 flex justify-between text-[9px] font-bold text-ink/40">
            <span>{after.totalXp.toLocaleString()} XP</span>
            <span>
              {after.isMax ? 'MAX LEVEL' : `次まで ${after.xpToNext} XP`}
            </span>
          </div>
        </div>
      </div>

      {newRelics.length > 0 && (
        <div className="mt-3 rounded-2xl bg-white/80 p-2.5 text-left">
          <p className="text-[9px] font-extrabold tracking-[0.15em] text-amber-600">
            NEW TREASURE
          </p>
          {newRelics.map((relic) => (
            <p key={relic.level} className="mt-0.5 text-xs font-extrabold text-ink">
              {relic.emoji} {relic.name}
              <span className="ml-1 font-bold text-ink/40">を獲得！</span>
            </p>
          ))}
        </div>
      )}
    </Card>
  )
}

// バトルの物語上の決着と、次回の適応敵ランクをまとめて示す。
const TREND = {
  up: { text: '次は敵ランクアップ', tone: 'text-emerald-700', bg: 'bg-correct-soft' },
  down: { text: '次は敵ランクを調整', tone: 'text-amber-800', bg: 'bg-hint-soft' },
  flat: { text: '次も同じ敵ランク', tone: 'text-brand-700', bg: 'bg-brand-100' },
}
function BattleOutcome({ battle, encounter, verdict }) {
  const t = TREND[battle.trend] ?? TREND.flat
  const from = enemyLevel(battle.from)
  const to = enemyLevel(battle.to)
  const moved = from.id !== to.id
  return (
    <Card className={`w-full max-w-xs p-3.5 ${t.bg}`}>
      <div className="flex items-start gap-3 text-left">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-2xl">
          {encounter.emoji}
        </span>
        <div>
          <div className={`font-display text-sm font-extrabold ${t.tone}`}>
            {verdict.title}
          </div>
          <p className="mt-0.5 text-[11px] font-bold leading-relaxed text-ink/55">
            {verdict.text}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-white/55 p-2 text-ink">
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${from.color}22`, color: from.color }}>
          英検{from.label}
        </span>
        <span className="font-extrabold text-ink/40">→</span>
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${to.color}22`, color: to.color }}>
          英検{to.label}
        </span>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-bold text-ink/50">
        {t.text}。{moved ? `英検${to.label}へ` : `英検${to.label}のまま`}
      </p>
    </Card>
  )
}
