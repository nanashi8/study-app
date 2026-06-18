import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { ProgressRing, Button, Card } from '../components/ui.jsx'
import { Star, Flame, Refresh, Home, Bookmark } from '../components/Icons.jsx'
import { enemyLevel, nextPosition, battleTrend } from '../lib/adaptive.js'

// セッションの種類から「スキル」を判定する（弱点ナビ用）。
function inferSkill({ engine, replayScreen }) {
  if (engine === 'grammar') return 'grammar'
  if (engine === 'phrase') return 'usage'
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

  const { title = '学習', mode = 'study', total = 0, correct = 0, wrong = 0, xpGained = 0, reviewIds = [], source, engine = 'word' } = params
  const acc = total ? correct / total : 0
  const pct = Math.round(acc * 100)

  // この結果をスキル別テスト結果として1回だけ記録する（学習マップの弱点ナビが参照）。
  const recordSkillResult = useStore((s) => s.recordSkillResult)
  const recordBattle = useStore((s) => s.recordBattle)
  const isBattle = source?.type === 'battle'
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

  const msg =
    acc >= 0.9 ? { emoji: '🏆', text: 'パーフェクト級！', color: '#f59e0b' }
    : acc >= 0.7 ? { emoji: '🎉', text: 'よくできました！', color: '#10b981' }
    : acc >= 0.4 ? { emoji: '💪', text: 'いい調子！', color: '#6366f1' }
    : { emoji: '🌱', text: 'ここから伸びる！', color: '#0ea5e9' }

  const isPhrase = engine === 'phrase'

  const replay = () => {
    const target =
      params.replayScreen ??
      (isPhrase ? (mode === 'quiz' ? 'phraseQuiz' : 'phraseStudy') : mode === 'quiz' ? 'vocabQuiz' : 'vocabStudy')
    navigate(target, { source, title, mode, engine, replayScreen: params.replayScreen })
  }

  const isGrammar = engine === 'grammar'

  const reviewWrong = () =>
    isGrammar
      ? navigate('grammarQuiz', {
          source: { type: 'grammarList', ids: reviewIds },
          title: 'まちがい復習',
          mode: 'quiz',
          engine: 'grammar',
          replayScreen: 'grammarQuiz',
        })
      : isPhrase
      ? navigate('phraseStudy', {
          source: { type: 'phraseList', kind: source?.kind, ids: reviewIds },
          title: 'まちがい復習',
          mode: 'study',
          engine: 'phrase',
        })
      : navigate('vocabStudy', {
          source: { type: 'mylist', ids: reviewIds },
          title: 'まちがい復習',
          mode: 'study',
        })

  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden px-6 pb-6 text-center">
      {pct >= 80 && <Confetti />}
      <div className="text-6xl animate-float">{msg.emoji}</div>
      <h1 className="font-display text-2xl font-extrabold text-ink">{msg.text}</h1>
      <p className="-mt-3 text-sm font-bold text-ink/45">{title}・{mode === 'quiz' ? 'クイズ' : '暗記'}</p>

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

      {battle && <BattleOutcome battle={battle} />}

      <div className="mt-2 w-full max-w-xs space-y-2.5">
        {wrong > 0 && (
          <Button full variant="primary" onClick={reviewWrong}>
            <Bookmark size={18} /> まちがい {wrong} 語を復習
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

// 適応バトルの結果：ポジション(立ち位置)の変化と次の敵LVを示す。
const TREND = {
  up: { emoji: '⚔️', text: '敵が強くなった！前進', tone: 'text-emerald-700', bg: 'bg-correct-soft' },
  down: { emoji: '🛡️', text: '敵を少し下げて立て直し', tone: 'text-amber-800', bg: 'bg-hint-soft' },
  flat: { emoji: '⚖️', text: '互角！この調子で', tone: 'text-brand-700', bg: 'bg-brand-100' },
}
function BattleOutcome({ battle }) {
  const t = TREND[battle.trend] ?? TREND.flat
  const from = enemyLevel(battle.from)
  const to = enemyLevel(battle.to)
  const moved = from.id !== to.id
  return (
    <Card className={`w-full max-w-xs p-3.5 ${t.bg}`}>
      <div className={`flex items-center justify-center gap-1.5 font-display text-sm font-extrabold ${t.tone}`}>
        <span className="text-base">{t.emoji}</span> {t.text}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-ink">
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${from.color}22`, color: from.color }}>
          {from.emoji} {from.label}
        </span>
        <span className="font-extrabold text-ink/40">→</span>
        <span className="rounded-xl px-2.5 py-1 text-xs font-extrabold" style={{ backgroundColor: `${to.color}22`, color: to.color }}>
          {to.emoji} {to.label}
        </span>
      </div>
      <p className="mt-1.5 text-center text-[11px] font-bold text-ink/50">
        {moved ? `次の敵LVは ${to.label}` : `敵LVは ${to.label} のまま`}
      </p>
    </Card>
  )
}
