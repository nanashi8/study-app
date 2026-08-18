import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  getWord,
} from '../data/vocab.js'
import {
  etymologyProgress,
  isEtymologyDue,
  ETYMOLOGY_SESSION_SIZE,
} from '../lib/etymologyProgress.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, cx } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { learningStatusForSrsEntry, summarizeSrsItems } from '../lib/contentProgress.js'
import { ArrowRight, Cards, Sparkles } from '../components/Icons.jsx'

const PAGE_SIZE = 24
const MODES = ['formula', 'root', 'family', 'origin']
const STATUSES = ['all', 'unlearned', 'reviewing', 'learned', 'due']

const STATUS_STYLE = {
  all: { label: 'すべて', short: '全件', pill: 'bg-slate-100 text-slate-600' },
  unlearned: { label: '未学習', short: '未学習', pill: 'bg-slate-100 text-slate-600' },
  reviewing: { label: '復習中', short: '復習中', pill: 'bg-amber-50 text-amber-700' },
  learned: { label: '学習済', short: '学習済', pill: 'bg-emerald-50 text-emerald-700' },
  due: { label: '今日の復習', short: '今日の復習', pill: 'bg-rose-50 text-rose-700' },
}

const countForStatus = (summary, due, status) => {
  if (status === 'all') return summary.total
  if (status === 'due') return due
  return summary.learning[status]
}

export function RootsScreen() {
  const rootRef = useRef(null)
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const [mode, setMode] = useState(MODES.includes(params.mode) ? params.mode : 'formula')
  const [status, setStatus] = useState(STATUSES.includes(params.status) ? params.status : 'all')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const day = todayIndex()
  const meta = ETYMOLOGY_MODE_META[mode]

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const modePacks = useMemo(
    () => ETYMOLOGY_PACKS.filter((pack) => pack.mode === mode),
    [mode],
  )
  const overall = useMemo(
    () => etymologyProgress(ETYMOLOGY_PACKS, etymologySrs, day),
    [etymologySrs, day],
  )
  const overallStatus = useMemo(
    () => summarizeSrsItems(ETYMOLOGY_PACKS, etymologySrs),
    [etymologySrs],
  )
  const modeStats = useMemo(
    () => Object.fromEntries(MODES.map((id) => {
      const items = ETYMOLOGY_PACKS.filter((pack) => pack.mode === id)
      return [id, summarizeSrsItems(items, etymologySrs)]
    })),
    [etymologySrs],
  )
  const currentStatus = useMemo(
    () => summarizeSrsItems(modePacks, etymologySrs),
    [modePacks, etymologySrs],
  )
  const currentDue = useMemo(
    () => modePacks.filter((pack) => isEtymologyDue(etymologySrs[pack.id], day)).length,
    [modePacks, etymologySrs, day],
  )
  const packs = useMemo(
    () => modePacks.filter((pack) => {
      const entry = etymologySrs[pack.id]
      if (status === 'all') return true
      if (status === 'due') return isEtymologyDue(entry, day)
      return learningStatusForSrsEntry(entry) === status
    }),
    [modePacks, etymologySrs, status, day],
  )

  const selectMode = (next) => {
    setMode(next)
    setStatus('all')
    setVisible(PAGE_SIZE)
  }

  const selectStatus = (next) => {
    setStatus(next)
    setVisible(PAGE_SIZE)
  }

  const sessionParams = {
    mode,
    status: status === 'all' ? 'priority' : 'all',
    packIds: packs.map((pack) => pack.id),
    size: ETYMOLOGY_SESSION_SIZE,
  }

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader
        title="語源"
        subtitle="語の形と意味をつなげて覚える"
      />

      <div className="space-y-4 px-4">
        <section
          className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-600 p-4 text-white shadow-card"
          aria-labelledby="etymology-flow-heading"
          data-etymology-intro
        >
          <p className="text-xs font-extrabold tracking-[0.14em] text-white/70">ETYMOLOGY</p>
          <h1 id="etymology-flow-heading" className="mt-1 font-display text-xl font-extrabold">
            形が分かると、意味を思い出せる
          </h1>
          <p className="mt-1 text-sm font-bold leading-relaxed text-white/80">
            言語名の暗記ではなく、英単語を作る形と意味を学びます。
          </p>
          <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="語源学習の3ステップ">
            {[
              ['1', '形を見る'],
              ['2', '意味をつなぐ'],
              ['3', '2択で確認'],
            ].map(([number, label]) => (
              <li key={number} className="rounded-2xl bg-white/12 px-2 py-2.5 text-center">
                <span className="mx-auto grid h-6 w-6 place-items-center rounded-full bg-white text-xs font-extrabold text-violet-700">{number}</span>
                <span className="mt-1.5 block text-xs font-extrabold leading-snug">{label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="etymology-mode-heading">
          <div className="mb-2 px-1">
            <h2 id="etymology-mode-heading" className="font-display text-base font-extrabold text-slate-900">学び方を選ぶ</h2>
            <p className="text-sm font-bold text-slate-500">最初は「部品で分ける」がおすすめです。</p>
          </div>
          <div className="grid grid-cols-2 gap-2" role="tablist" aria-label="語源の学び方">
            {MODES.map((id) => {
              const item = ETYMOLOGY_MODE_META[id]
              const selected = id === mode
              const progress = modeStats[id]
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectMode(id)}
                  className={cx(
                    'min-h-16 min-w-0 rounded-xl border px-3 py-2.5 text-left transition-colors',
                    selected
                      ? 'border-violet-700 bg-violet-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700',
                  )}
                >
                  <span className="block text-xs font-extrabold leading-snug">{item.emoji} {item.label}</span>
                  <span className={cx('mt-1 block text-xs font-bold', selected ? 'text-white/80' : 'text-slate-500')}>
                    {progress.total.toLocaleString()}枚
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm font-bold leading-relaxed text-slate-600">
            <p><span className="font-extrabold text-slate-900">{meta.emoji} {meta.label}：</span>{meta.description}</p>
            <p className="mt-1 text-slate-500">{meta.tip}</p>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-3 ring-1 ring-slate-200" data-etymology-actions>
          <p className="mb-3 text-center text-xs font-extrabold text-slate-500">
            {meta.label}から、おすすめ{Math.min(ETYMOLOGY_SESSION_SIZE, packs.length)}枚
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              full
              onClick={() => navigate('etymologyStudy', sessionParams)}
              disabled={packs.length === 0}
            >
              <Sparkles size={18} /> 意味を見て学ぶ
            </Button>
            <Button
              full
              variant="secondary"
              onClick={() => navigate('etymologyQuiz', sessionParams)}
              disabled={packs.length === 0}
            >
              <Cards size={18} /> 2択で確認
            </Button>
          </div>
        </section>

        <details
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          data-etymology-dashboard
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span>学習記録を見る</span>
            <span className="text-xs text-slate-500">今日の復習 {overall.due.toLocaleString()}枚</span>
          </summary>
          <div className="space-y-3 border-t border-slate-100 p-4">
            <LearningStatusBars progress={overallStatus} compact units={{ learning: '項目', quiz: '問' }} />
            <p className="text-xs font-bold leading-relaxed text-slate-500">
              全{overall.total.toLocaleString()}枚。語源の記録は、英単語の暗記記録とは分けて保存します。
            </p>
          </div>
        </details>

        <details
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
          data-etymology-card-browser
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-extrabold text-slate-700">
            <span>カードを選んで学ぶ</span>
            <span className="text-xs text-slate-500">{packs.length.toLocaleString()}枚</span>
          </summary>
          <div className="space-y-4 border-t border-slate-100 p-3">
            <section aria-label="表示する進捗状態">
              <p className="mb-2 text-xs font-extrabold text-slate-600">進み具合</p>
              <div className="flex flex-wrap gap-2" aria-label="語源カードの進み具合で絞り込む">
                {STATUSES.map((id) => {
                  const selected = status === id
                  const count = countForStatus(currentStatus, currentDue, id)
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => selectStatus(id)}
                      className={cx(
                        'min-h-11 shrink-0 rounded-full px-3 text-xs font-extrabold ring-1 transition',
                        selected
                          ? 'bg-violet-600 text-white ring-violet-600'
                          : 'bg-white text-ink/55 ring-brand-100',
                      )}
                    >
                      {STATUS_STYLE[id].short} {count}
                    </button>
                  )
                })}
              </div>
            </section>

            {packs.length ? (
              <div className="space-y-2.5">
                {packs.slice(0, visible).map((pack) => {
                  const entry = etymologySrs[pack.id]
                  const learningStatus = learningStatusForSrsEntry(entry)
                  const visual = STATUS_STYLE[learningStatus]
                  const cardProgress = summarizeSrsItems([pack], etymologySrs)
                  const dueNow = isEtymologyDue(entry, day)
                  const examples = pack.studyIds.map(getWord).filter(Boolean).slice(0, 3)
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => navigate('etymologyPack', { packId: pack.id })}
                      className="w-full text-left transition active:scale-[0.99]"
                    >
                      <Card className="p-3.5">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 text-xl" aria-hidden="true">{pack.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <h3 className="min-w-0 flex-1 line-clamp-2 font-display text-base font-extrabold leading-tight text-ink">
                                {pack.title}
                              </h3>
                              <span className={cx('shrink-0 rounded-full px-2 py-1 text-xs font-extrabold', visual.pill)}>
                                {visual.label}
                              </span>
                              {dueNow && (
                                <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-extrabold text-rose-700">
                                  今日の復習
                                </span>
                              )}
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-relaxed text-brand-600/85">
                              {examples.map((word) => `${word.word}「${word.meanings?.[0] ?? word.meaning}」`).join(' ・ ')}
                            </p>
                          </div>
                          <span className="mt-3 text-brand-300"><ArrowRight size={17} /></span>
                        </div>
                        <LearningStatusBars progress={cardProgress} className="mt-3" compact units={{ learning: '項目', quiz: '問' }} />
                      </Card>
                    </button>
                  )
                })}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="font-display text-base font-extrabold text-ink">{STATUS_STYLE[status].label}のカードはありません</p>
                <p className="mt-1 text-xs font-bold text-ink/45">進み具合を切り替えると、ほかのカードを表示できます。</p>
              </Card>
            )}

            {visible < packs.length && (
              <Button full variant="secondary" onClick={() => setVisible(visible + PAGE_SIZE)}>
                次の{Math.min(PAGE_SIZE, packs.length - visible)}枚を表示
              </Button>
            )}
          </div>
        </details>

        <p className="px-1 text-xs font-bold leading-relaxed text-slate-400">
          全{ETYMOLOGY_SUMMARY.total.toLocaleString()}語を{ETYMOLOGY_SUMMARY.packs.toLocaleString()}枚に整理しています。
        </p>
      </div>
    </div>
  )
}
