import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { PHRASE_KINDS, phrasesByKind } from '../data/phrases.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { phraseKindProgress } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Card, Button, Chip, ProgressBar } from '../components/ui.jsx'
import { Book, Cards, Lightbulb, Link, Refresh, Search } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const levelOrder = Object.fromEntries(LEVELS.map((l, i) => [l.id, i]))
const speakText = (p) => (p.kind === 'syntax' ? p.example.en : p.phrase)

export function PhrasesScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const initialKind = useStore((s) => s.params.kind) ?? 'idiom'
  const [kind, setKind] = useState(initialKind)
  const [detail, setDetail] = useState(null)
  const [query, setQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  const meta = PHRASE_KINDS.find((k) => k.id === kind)
  const prog = phraseKindProgress(kind, srs)
  const normalizedQuery = query.trim().toLowerCase()
  const items = [...phrasesByKind(kind)]
    .filter((item) => levelFilter === 'all' || item.level === levelFilter)
    .filter((item) => {
      if (!normalizedQuery) return true
      return [
        item.phrase,
        item.meaning,
        item.note,
        item.example?.en,
        item.example?.ja,
      ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery)
    })
    .sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

  const selectedSource = normalizedQuery
    ? { type: 'phraseList', ids: items.map((item) => item.id) }
    : {
        type: 'phrase',
        kind,
        ...(levelFilter === 'all' ? {} : { levelId: levelFilter }),
      }
  const selectedTitle = levelFilter === 'all'
    ? meta.label
    : `${getLevel(levelFilter).label} ${meta.label}`
  const study = () => navigate('phraseStudy', { source: selectedSource, title: selectedTitle, mode: 'study', engine: 'phrase' })
  const quiz = () => navigate('phraseQuiz', { source: selectedSource, title: selectedTitle, engine: 'phrase' })
  const reviewDue = () =>
    navigate('phraseStudy', {
      source: { type: 'phraseDue', kind },
      title: `${meta.label}の復習`,
      mode: 'study',
      engine: 'phrase',
    })

  return (
    <div className="pb-6">
      <ScreenHeader title="熟語・構文" subtitle="3択＋わからないで覚える" />

      <div className="px-4">
        {/* 種類切替 */}
        <div className="grid grid-cols-2 gap-2">
          {PHRASE_KINDS.map((k) => {
            const on = kind === k.id
            return (
              <button
                key={k.id}
                onClick={() => setKind(k.id)}
                className={cx(
                  'flex items-center justify-center gap-2 rounded-2xl py-3 font-display font-extrabold transition-all',
                  on ? 'text-white shadow-pop' : 'bg-white text-ink/60',
                )}
                style={on ? { background: k.color } : undefined}
              >
                <span className="text-xl">{k.emoji}</span> {k.label}
              </button>
            )
          })}
        </div>

        {/* 200項目以上でも目的の表現へすぐ到達できる検索・級フィルター */}
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 rounded-2xl bg-white px-3 shadow-sm ring-1 ring-brand-100 focus-within:ring-2 focus-within:ring-brand-300">
            <Search size={17} className="shrink-0 text-brand-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="英語・意味・語法で絞り込む"
              className="h-11 min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:font-normal placeholder:text-ink/30"
              aria-label="熟語と構文を検索"
            />
          </label>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setLevelFilter('all')}
              className={cx(
                'shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold',
                levelFilter === 'all' ? 'bg-ink text-white' : 'bg-white text-ink/50',
              )}
            >
              全級
            </button>
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => setLevelFilter(level.id)}
                className={cx(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-extrabold',
                  levelFilter === level.id ? 'text-white' : 'bg-white text-ink/50',
                )}
                style={levelFilter === level.id ? { background: level.color } : undefined}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* 進捗＋学習ボタン */}
        <Card className="mt-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display text-lg font-extrabold text-ink">
                {meta.emoji} {meta.label}
              </div>
              <div className="text-xs font-bold text-ink/50">{meta.desc}・全{prog.total}項目</div>
            </div>
            <div className="text-right text-xs font-bold text-ink/45">
              習得 {prog.mastered}/{prog.total}
            </div>
          </div>
          <ProgressBar className="mt-3" value={prog.total ? prog.mastered / prog.total : 0} color={meta.color} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={study} disabled={!items.length}><Book size={16} /> 覚える</Button>
            <Button variant="secondary" onClick={quiz} disabled={!items.length}><Cards size={16} /> クイズ</Button>
          </div>
          {prog.due > 0 && (
            <Button full variant="hint" className="mt-2" onClick={reviewDue}>
              <Refresh size={16} /> 復習どき {prog.due}項目
            </Button>
          )}
        </Card>

        {/* 一覧 */}
        <h2 className="mb-2 mt-5 px-1 font-display text-base font-extrabold text-ink/80">
          {meta.label}の一覧
          <span className="ml-2 text-xs text-ink/35">{items.length}項目を表示</span>
        </h2>
        <div className="space-y-2">
          {items.map((p) => {
            const level = getLevel(p.level)
            return (
              <div key={p.id} className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                <SpeakButton text={speakText(p)} size="sm" />
                <button onClick={() => setDetail(p)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-ink">{p.phrase}</span>
                    <Chip color={level.color}>{level.label}</Chip>
                  </div>
                  <div className="truncate text-xs font-bold text-ink/55">{p.meaning}</div>
                </button>
              </div>
            )
          })}
          {items.length === 0 && (
            <div className="rounded-2xl bg-white px-4 py-8 text-center text-sm font-bold text-ink/45">
              条件に合う{meta.label}はありません。
            </div>
          )}
        </div>
      </div>

      {/* 詳細シート */}
      <Sheet open={!!detail} onClose={() => setDetail(null)} title="くわしく">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SpeakButton text={speakText(detail)} size="md" />
              <div>
                <div className="font-display text-2xl font-extrabold text-ink">{detail.phrase}</div>
                <Chip color={getLevel(detail.level).color}>英検{getLevel(detail.level).label}</Chip>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-50 p-3">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
              <div className="font-display text-lg font-extrabold text-ink">{detail.meanings.join('・')}</div>
            </div>
            <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
              <div className="flex items-start gap-2">
                <SpeakButton text={detail.example.en} size="sm" />
                <div>
                  <p className="font-bold text-ink">{detail.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">{detail.example.ja}</p>
                </div>
              </div>
            </div>
            {detail.origin && (
              <div className="rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
                <div className="mb-1 flex items-center gap-1.5 text-violet-600">
                  <Link size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">成り立ち</span>
                </div>
                <p className="text-sm font-bold leading-relaxed text-violet-900/90">{detail.origin}</p>
              </div>
            )}
            {detail.note && (
              <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
                <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
                <p className="text-sm font-bold leading-relaxed text-amber-900/90">{detail.note}</p>
              </div>
            )}
          </div>
        )}
      </Sheet>
    </div>
  )
}
