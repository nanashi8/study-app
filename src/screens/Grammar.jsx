import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { grammarByLevel, grammarByTopic, topicsForLevel } from '../data/grammar.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, ProgressBar, cx } from '../components/ui.jsx'
import { Cards, ArrowRight } from '../components/Icons.jsx'

// その級・トピックの習得状況（box>=4 を習得とみなす。単語・熟語と同じ基準）。
function progressOf(items, srs) {
  let mastered = 0
  for (const g of items) if ((srs[g.id]?.box ?? 0) >= 4) mastered++
  return { total: items.length, mastered }
}

export function GrammarScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const initial = useStore((s) => s.params.level)
  // 出題のある級だけタブに出す。
  const activeLevels = LEVELS.filter((l) => grammarByLevel(l.id).length > 0)
  const [level, setLevel] = useState(
    activeLevels.some((l) => l.id === initial) ? initial : activeLevels[0]?.id ?? '5',
  )

  const meta = getLevel(level)
  const topics = topicsForLevel(level)
  const levelItems = grammarByLevel(level)
  const lp = progressOf(levelItems, srs)

  const quizLevel = () =>
    navigate('grammarQuiz', { source: { type: 'grammar', level }, title: `${meta.label} 文法`, levelColor: meta.color })
  const quizTopic = (topic) =>
    navigate('grammarQuiz', { source: { type: 'grammar', level, topic }, title: topic, levelColor: meta.color })

  return (
    <div className="pb-6">
      <ScreenHeader title="文法" subtitle="級ごとに4択で文法を身につける" />

      <div className="px-4">
        {/* 級タブ */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {activeLevels.map((l) => {
            const on = level === l.id
            return (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={cx(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 font-display text-sm font-extrabold transition-all',
                  on ? 'text-white shadow-pop' : 'bg-white text-ink/55',
                )}
                style={on ? { background: l.color } : undefined}
              >
                <span>{l.emoji}</span> {l.label}
              </button>
            )
          })}
        </div>

        {/* 級まとめ */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-extrabold text-ink">{meta.emoji} {meta.label} 文法</div>
              <div className="text-xs font-bold text-ink/50">{meta.sub}・全{lp.total}問・{topics.length}単元</div>
            </div>
            <div className="text-right text-xs font-bold text-ink/45">習得 {lp.mastered}/{lp.total}</div>
          </div>
          <ProgressBar className="mt-3" value={lp.total ? lp.mastered / lp.total : 0} color={meta.color} />
          <Button className="mt-3" full onClick={quizLevel}><Cards size={16} /> この級をまとめてクイズ</Button>
        </Card>

        {/* 単元一覧 */}
        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">単元から選ぶ</h2>
        <div className="space-y-2">
          {topics.map((topic) => {
            const items = grammarByTopic(level, topic)
            const tp = progressOf(items, srs)
            return (
              <button
                key={topic}
                onClick={() => quizTopic(topic)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-sm active:bg-brand-50 active:scale-[0.99] transition-transform"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-ink">{topic}</span>
                    <Chip color={meta.color}>{tp.total}問</Chip>
                  </div>
                  <ProgressBar className="mt-2" value={tp.total ? tp.mastered / tp.total : 0} color={meta.color} />
                </div>
                <span className="text-brand-400"><ArrowRight size={20} /></span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
