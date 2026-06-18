import { useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { PASSAGES } from '../data/passages.js'
import { LEVELS } from '../data/levels.js'
import { suggestStartPosition } from '../lib/session.js'
import { battleSource, enemyLevel, enemyLevelIndex, POS_MAX } from '../lib/adaptive.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { ProgressRing, ProgressBar, Button, Chip, cx } from '../components/ui.jsx'
import { Lightbulb, ArrowRight, Check } from '../components/Icons.jsx'

// テスト結果から弱点を判定するしきい値。
const MIN_ATTEMPTS = 10 // これ未満は「まだテスト不足」とみなす
const WEAK_ACC = 0.7 // 正答率がこれ未満なら弱点

// スキル一覧（単語・文法・語法・長文・リスニング・ディクテーション）。
const SKILLS = [
  { id: 'vocab', label: '単語', emoji: '📖', color: '#6366f1', screen: 'vocabLevels', kind: 'acc' },
  { id: 'grammar', label: '文法', emoji: '💡', color: '#f59e0b', screen: 'grammar', kind: 'acc' },
  { id: 'usage', label: '語法・熟語', emoji: '✨', color: '#8b5cf6', screen: 'phrases', kind: 'acc' },
  { id: 'reading', label: '長文読解', emoji: '📚', color: '#10b981', screen: 'readingList', kind: 'reading' },
  { id: 'listening', label: 'リスニング', emoji: '🎧', color: '#0ea5e9', screen: 'listening', kind: 'acc' },
  { id: 'dictation', label: 'ディクテーション', emoji: '⌨️', color: '#14b8a6', screen: 'dictation', kind: 'acc' },
]

// 各スキルの理解度・状態をまとめる。
//  status: 'weak' | 'ok' | 'progress' | 'untested'
function skillInfo(skill, skillStats, readingsDone) {
  if (skill.kind === 'reading') {
    const total = PASSAGES.length
    const read = readingsDone.length
    const value = total ? read / total : 0
    const status = read === 0 ? 'untested' : value >= 0.5 ? 'ok' : 'progress'
    return { status, value, label: `${read}/${total} 本 読了`, attempts: read }
  }
  const s = skillStats[skill.id]
  const attempts = s?.answered ?? 0
  if (attempts < MIN_ATTEMPTS) {
    return { status: 'untested', value: 0, label: `テスト ${attempts} 問`, attempts }
  }
  const acc = s.correct / s.answered
  const status = acc < WEAK_ACC ? 'weak' : 'ok'
  return { status, value: acc, acc, label: `正答率 ${Math.round(acc * 100)}%・${attempts}問`, attempts }
}

export function EnglishMapScreen() {
  const navigate = useStore((s) => s.navigate)
  const skillStats = useStore((s) => s.skillStats)
  const readingsDone = useStore((s) => s.readingsDone)
  const srs = useStore((s) => s.srs)
  const engPos = useStore((s) => s.engPos)
  const setEngPos = useStore((s) => s.setEngPos)

  // 初回は、これまでの習得状況からポジションを推定して配置する。
  useEffect(() => {
    if (engPos == null) setEngPos(suggestStartPosition(srs))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pos = engPos ?? suggestStartPosition(srs)

  const infos = SKILLS.map((sk) => ({ skill: sk, info: skillInfo(sk, skillStats, readingsDone) }))
  // 弱点（正答率が低いスキル）を低い順に。
  const weak = infos
    .filter(({ info }) => info.status === 'weak')
    .sort((a, b) => (a.info.acc ?? 1) - (b.info.acc ?? 1))

  return (
    <div className="pb-6">
      <ScreenHeader title="学習マップ" subtitle="敵LVが成績で変化する適応バトル" />

      <div className="space-y-3 px-4">
        {/* アドベンチャー：ポジションと敵LV */}
        <AdventureCard pos={pos} onBattle={() =>
          navigate('vocabQuiz', {
            source: battleSource(pos),
            title: `${enemyLevel(pos).label}と対戦`,
            mode: 'quiz',
          })
        } />

        {/* 弱点補強ナビ */}
        {weak.length > 0 ? (
          <div className="rounded-2xl border-2 border-amber-300 bg-hint-soft p-3.5">
            <div className="flex items-center gap-1.5">
              <Lightbulb size={16} className="text-amber-600" />
              <span className="font-display text-sm font-extrabold text-amber-900">
                弱点が見つかりました — 補強しよう
              </span>
            </div>
            <p className="mt-1 text-[11px] font-bold text-amber-800/75">
              テストの正答率が低いスキルです。ここを重点的に練習しましょう。
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {weak.map(({ skill, info }) => (
                <button
                  key={skill.id}
                  onClick={() => navigate(skill.screen)}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-amber-800 shadow-sm active:scale-95"
                >
                  {skill.emoji} {skill.label}
                  <span className="text-amber-500">（{Math.round(info.acc * 100)}%）</span>
                  <ArrowRight size={13} />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-correct-soft p-3.5 text-center text-sm font-bold text-emerald-700">
            いまのところ大きな弱点はありません。各スキルを続けよう💪
          </div>
        )}

        {/* スキル別カード */}
        {infos.map(({ skill, info }) => (
          <SkillCard key={skill.id} skill={skill} info={info} onOpen={() => navigate(skill.screen)} />
        ))}
      </div>
    </div>
  )
}

// アドベンチャー：級のはしご上の「ポジション」と、対応する「敵LV（出題級）」。
// 成績でポジションが上下し、敵LVが変化する。タップでそのLVのバトルを始める。
function AdventureCard({ pos, onBattle }) {
  const idx = enemyLevelIndex(pos)
  const enemy = LEVELS[idx]
  const frac = POS_MAX ? pos / POS_MAX : 0

  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 p-4 text-white shadow-card">
      <div className="flex items-center gap-1.5">
        <span className="text-base">⚔️</span>
        <span className="font-display text-sm font-extrabold">アドベンチャー</span>
        <span className="ml-auto text-[11px] font-bold text-white/70">成績で敵の強さが変わる</span>
      </div>

      {/* 級のはしご（5級→1級）。現在ポジションの級が「敵」。 */}
      <div className="mt-3 flex items-end justify-between">
        {LEVELS.map((lv, i) => {
          const here = i === idx
          return (
            <div key={lv.id} className="flex flex-1 flex-col items-center gap-1">
              {here && <span className="text-[10px] font-extrabold leading-none text-amber-300">敵LV</span>}
              <span
                className={cx(
                  'flex items-center justify-center rounded-full transition-all',
                  here ? 'h-10 w-10 text-2xl ring-2 ring-amber-300 ring-offset-2 ring-offset-brand-700' : 'h-6 w-6 text-sm opacity-60',
                )}
                style={{ backgroundColor: here ? `${lv.color}` : 'rgba(255,255,255,0.12)' }}
              >
                {here ? '👾' : lv.emoji}
              </span>
              <span className={cx('text-[9px] font-bold leading-none', here ? 'text-white' : 'text-white/45')}>
                {lv.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-2.5">
        <ProgressBar value={frac} color="#fbbf24" />
      </div>

      {/* 現在の敵LV */}
      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-2xl" style={{ backgroundColor: enemy.color }}>
          👾
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold">敵LV：英検{enemy.label}</span>
            <Chip className="bg-white/15 text-white">{enemy.cefr}</Chip>
          </div>
          <div className="text-[11px] font-bold text-white/70">{enemy.sub}の単語が出題されます</div>
        </div>
      </div>

      <button
        onClick={onBattle}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 font-display text-base font-extrabold text-brand-700 shadow-sm transition-transform active:scale-[0.98]"
      >
        ▶ 出題スタート（{enemy.label}と対戦）
      </button>
      <p className="mt-2 text-center text-[11px] font-bold text-white/70">
        正解しつづけると敵が強く、つまずくと弱くなります
      </p>
    </div>
  )
}

const STATUS_BADGE = {
  weak: { label: '弱点', cls: 'bg-amber-100 text-amber-700' },
  ok: { label: '良好', cls: 'bg-emerald-100 text-emerald-700' },
  progress: { label: '学習中', cls: 'bg-brand-100 text-brand-700' },
  untested: { label: 'テスト不足', cls: 'bg-ink/10 text-ink/50' },
}

function SkillCard({ skill, info, onOpen }) {
  const badge = STATUS_BADGE[info.status]
  const ringColor = info.status === 'weak' ? '#f59e0b' : info.status === 'ok' ? '#10b981' : skill.color
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-card transition-transform active:scale-[0.98]"
    >
      <ProgressRing value={info.value} size={52} stroke={6} color={ringColor} track="#eee">
        <span className="text-xl leading-none">{skill.emoji}</span>
      </ProgressRing>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-ink">{skill.label}</span>
          <Chip className={cx(badge.cls)}>
            {info.status === 'ok' && <Check size={12} />} {badge.label}
          </Chip>
        </div>
        <div className="mt-0.5 text-xs font-bold text-ink/45">
          {info.status === 'untested' ? `${info.label}（テストして弱点を診断）` : info.label}
        </div>
      </div>
      <span className="text-ink/30"><ArrowRight size={20} /></span>
    </button>
  )
}
