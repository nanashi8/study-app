import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { PHRASE_KINDS, phrasesByKind } from '../data/phrases.js'
import { LEVELS, getLevel } from '../data/levels.js'
import { phraseKindProgress } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { Card, Button, Chip, ProgressBar } from '../components/ui.jsx'
import { Book, Cards, Lightbulb, Link, Refresh } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const levelOrder = Object.fromEntries(LEVELS.map((l, i) => [l.id, i]))
const speakText = (p) => (p.kind === 'syntax' ? p.example.en : p.phrase)

export function PhrasesScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const initialKind = useStore((s) => s.params.kind) ?? 'idiom'
  const [kind, setKind] = useState(initialKind)
  const [detail, setDetail] = useState(null)

  const meta = PHRASE_KINDS.find((k) => k.id === kind)
  const prog = phraseKindProgress(kind, srs)
  const items = [...phrasesByKind(kind)].sort((a, b) => levelOrder[a.level] - levelOrder[b.level])

  const study = () => navigate('phraseStudy', { source: { type: 'phrase', kind }, title: meta.label, mode: 'study', engine: 'phrase' })
  const quiz = () => navigate('phraseQuiz', { source: { type: 'phrase', kind }, title: meta.label, engine: 'phrase' })
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
            <Button onClick={study}><Book size={16} /> 覚える</Button>
            <Button variant="secondary" onClick={quiz}><Cards size={16} /> クイズ</Button>
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
