import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { GRAMMAR_STRANDS } from '../data/grammar-strands.js'
import { strandOverview } from '../lib/grammarStrand.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, Target } from '../components/Icons.jsx'

const percent = (value) => `${Math.round(value * 100)}%`

// 正答率の帯。習得・苦手・未回答を色で区別する。
function levelAccuracyRow({ stat }) {
  const meta = getLevel(stat.level)
  const state = stat.answered === 0
    ? { label: '未回答', color: '#cbd5e1', text: 'text-ink/40' }
    : stat.mastered
      ? { label: '習得', color: '#059669', text: 'text-emerald-700' }
      : stat.weak
        ? { label: '苦手', color: '#e11d48', text: 'text-rose-700' }
        : { label: '練習中', color: '#f59e0b', text: 'text-amber-700' }
  return { meta, state }
}

function StrandCard({ overview, onStart, onPickLevel }) {
  const [open, setOpen] = useState(false)
  const { strand, stats, currentLevel, weakest, untouched, accuracy, total } = overview
  const currentMeta = getLevel(currentLevel)

  return (
    <Card className="p-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-start gap-3 text-left">
        <span className="text-2xl leading-none">{strand.emoji}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-display text-base font-extrabold text-ink">{strand.name}</span>
            <Chip color={currentMeta.color}>{stats.length}段</Chip>
            <Chip>{total}問</Chip>
          </div>
          <div className="mt-0.5 text-xs font-bold text-ink/50">{strand.summary}</div>

          {/* 級ごとの正答率を一列に並べ、いま自分がどの段にいるかを見せる。
              どの列も「級名・棒・現在地」の3行で高さをそろえ、棒の基準線を合わせる。 */}
          <div className="mt-2.5 flex gap-1">
            {stats.map((stat) => {
              const { meta, state } = levelAccuracyRow({ stat })
              const isCurrent = stat.level === currentLevel
              return (
                <div key={stat.level} className="flex-1">
                  <div
                    className={cx(
                      'h-4 text-center text-[9px] font-extrabold leading-4',
                      isCurrent ? 'text-ink' : 'text-ink/45',
                    )}
                  >
                    {meta.label}
                  </div>
                  <div
                    className={cx(
                      'relative h-9 overflow-hidden rounded-md bg-slate-100',
                      isCurrent && 'ring-2 ring-brand-400',
                    )}
                  >
                    {stat.answered > 0 && (
                      <div
                        className="absolute inset-x-0 bottom-0"
                        style={{ height: percent(stat.accuracy), background: state.color }}
                      />
                    )}
                    {/* 数値は塗りの境界にも重なるため、必ず読める下地を敷く。 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className={cx(
                          'rounded px-1 text-[10px] font-extrabold leading-tight',
                          stat.answered === 0 ? 'text-ink/30' : 'bg-white/85 text-ink',
                        )}
                      >
                        {stat.answered ? percent(stat.accuracy) : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 text-center text-[9px] font-extrabold leading-4 text-brand-500">
                    {isCurrent ? '現在地' : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </button>

      {/* 成績に応じた次の一手 */}
      <div className="mt-3 rounded-xl bg-brand-50/70 p-2.5">
        {/* 苦手な級と、これから出す級が食い違うことがある（直近で正解が続いて先へ進んだ場合）。
            「◯級が苦手。△級から出題」と並べると矛盾して読めるため、理由まで書き分ける。 */}
        <div className="text-[11px] font-bold text-ink/65">
          {untouched ? (
            <>まだ解いていません。<b className="text-ink">{currentMeta.label}</b>から始めます。</>
          ) : weakest && weakest.level === currentLevel ? (
            <>正答率が低い<b className="text-rose-700">{currentMeta.label}（{percent(weakest.accuracy)}）</b>を練習します。</>
          ) : weakest ? (
            <>
              <b className="text-rose-700">{getLevel(weakest.level).label}（{percent(weakest.accuracy)}）</b>
              に苦手が残っていますが、直近の成績にあわせて
              <b className="text-ink">{currentMeta.label}</b>を練習します。
            </>
          ) : (
            <>これまでの正答率は<b className="text-ink">{accuracy == null ? '—' : percent(accuracy)}</b>。<b className="text-ink">{currentMeta.label}</b>を練習します。</>
          )}
        </div>
        <Button className="mt-2" full onClick={() => onStart(overview)}>
          <Target size={16} /> {currentMeta.label}から学習する
        </Button>
      </div>

      {open && (
        <div className="mt-2 space-y-1.5">
          <div className="px-1 text-[11px] font-extrabold text-ink/55">級を選んで学習する</div>
          {stats.map((stat) => {
            const { meta, state } = levelAccuracyRow({ stat })
            return (
              <button
                key={stat.level}
                onClick={() => onPickLevel(overview, stat.level)}
                className="flex w-full items-center gap-2.5 rounded-xl bg-white p-2.5 text-left shadow-sm active:scale-[0.99]"
              >
                <span
                  className="flex h-7 w-11 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                  style={{ background: meta.color }}
                >
                  {meta.label}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-ink/70">
                    {stat.total}問・
                    {stat.answered
                      ? <>正答率 <b className={state.text}>{percent(stat.accuracy)}</b>（{stat.answered}問回答）</>
                      : <span className="text-ink/40">未回答</span>}
                  </div>
                </div>
                <span className={cx('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold', state.text)}>
                  {state.label}
                </span>
                <span className="text-brand-400"><ArrowRight size={16} /></span>
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export function GrammarStrandsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const grammarStrandPos = useStore((s) => s.grammarStrandPos)
  const setGrammarStrandPos = useStore((s) => s.setGrammarStrandPos)

  const overviews = useMemo(
    () => GRAMMAR_STRANDS.map((strand) => strandOverview(strand, srs, grammarStrandPos?.[strand.id])),
    [srs, grammarStrandPos],
  )

  const start = (overview, level = null) => {
    const target = level ?? overview.currentLevel
    const meta = getLevel(target)
    // 級を選び直したときは、その段を現在地として覚える。
    if (level) {
      const index = overview.levels.indexOf(level)
      if (index >= 0) setGrammarStrandPos(overview.strand.id, index)
    }
    navigate('grammarQuiz', {
      source: { type: 'grammarStrand', strandId: overview.strand.id, level: target },
      title: `${overview.strand.name}・${meta.label}`,
      levelColor: meta.color,
      returnTo: { screen: 'grammarStrands' },
    })
  }

  // 苦手が見つかっている系統を上に出す。次に手つかず、あとは既定の順。
  const sorted = useMemo(() => {
    const weight = (o) => (o.weakest ? 0 : o.untouched ? 2 : 1)
    return [...overviews].sort((a, b) => weight(a) - weight(b))
  }, [overviews])

  const weakCount = overviews.filter((o) => o.weakest).length

  return (
    <div className="pb-6">
      <ScreenHeader title="単元から学ぶ" subtitle="級をまたいで1つの文法を、成績に合わせた級で練習する" />
      <div className="px-4">
        <Card className="mb-4 p-4">
          <div className="font-display text-sm font-extrabold text-ink">
            {weakCount > 0
              ? <>正答率が下がっている系統が{weakCount}つあります</>
              : <>25系統を、いまの実力に合う級で練習できます</>}
          </div>
          <div className="mt-1 text-xs font-bold text-ink/55">
            各系統は「比較 → 比較応用 → 比較構文 → 高度比較」のように級をまたいで1本につながっています。
            正解が続けば上の級へ、つまずけば下の級へ自動で移ります。
          </div>
        </Card>

        <div className="space-y-3">
          {sorted.map((overview) => (
            <StrandCard
              key={overview.strand.id}
              overview={overview}
              onStart={start}
              onPickLevel={start}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
