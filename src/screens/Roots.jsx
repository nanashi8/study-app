import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore, todayIndex } from '../store/useStore.js'
import {
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SOURCE_META,
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
  all: {
    label: 'すべて',
    short: '全件',
    pill: 'bg-slate-100 text-slate-600',
  },
  unlearned: {
    label: '未学習',
    short: '未学習',
    pill: 'bg-slate-100 text-slate-600',
  },
  reviewing: {
    label: '復習中',
    short: '復習中',
    pill: 'bg-amber-50 text-amber-700',
  },
  learned: {
    label: '学習済',
    short: '学習済',
    pill: 'bg-emerald-50 text-emerald-700',
  },
  due: {
    label: '今日の復習',
    short: '今日の復習',
    pill: 'bg-rose-50 text-rose-700',
  },
}

const countForStatus = (summary, due, status) => {
  if (status === 'all') return summary.total
  if (status === 'due') return due
  return summary.learning[status]
}

// 全語を語源データの確度に応じた4経路へ分け、各「語源知識」を単語とは別に追跡する。
export function RootsScreen() {
  const rootRef = useRef(null)
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const [mode, setMode] = useState(
    MODES.includes(params.mode) ? params.mode : 'formula',
  )
  const [status, setStatus] = useState(
    STATUSES.includes(params.status) ? params.status : 'all',
  )
  const [originFormation, setOriginFormation] = useState('all')
  const [originSource, setOriginSource] = useState('all')
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
  const modeStats = useMemo(
    () => Object.fromEntries(
      MODES.map((id) => {
        const packs = ETYMOLOGY_PACKS.filter((pack) => pack.mode === id)
        return [id, summarizeSrsItems(packs, etymologySrs)]
      }),
    ),
    [etymologySrs],
  )
  const axisPacks = useMemo(
    () => modePacks.filter((pack) =>
      mode !== 'origin' ||
      (originFormation === 'all' || pack.formationKey === originFormation) &&
      (originSource === 'all' || pack.sourceKey === originSource)),
    [mode, modePacks, originFormation, originSource],
  )
  const currentStatus = useMemo(
    () => summarizeSrsItems(axisPacks, etymologySrs),
    [axisPacks, etymologySrs],
  )
  const currentDue = useMemo(
    () => axisPacks.filter((pack) => isEtymologyDue(etymologySrs[pack.id], day)).length,
    [axisPacks, etymologySrs, day],
  )
  const overallStatus = useMemo(
    () => summarizeSrsItems(ETYMOLOGY_PACKS, etymologySrs),
    [etymologySrs],
  )
  const packs = useMemo(
    () => axisPacks.filter((pack) => {
      const entry = etymologySrs[pack.id]
      if (status === 'all') return true
      if (status === 'due') return isEtymologyDue(entry, day)
      return learningStatusForSrsEntry(entry) === status
    }),
    [axisPacks, etymologySrs, status, day],
  )
  const formationOptions = useMemo(
    () => Object.entries(ETYMOLOGY_FORMATION_META)
      .map(([id, item]) => ({
        id,
        ...item,
        count: ETYMOLOGY_SUMMARY.origin.formationCounts[id] ?? 0,
      }))
      .filter((item) => item.count > 0),
    [],
  )
  const sourceOptions = useMemo(
    () => Object.entries(ETYMOLOGY_SOURCE_META)
      .map(([id, item]) => ({
        id,
        ...item,
        count: ETYMOLOGY_SUMMARY.origin.sourceCounts[id] ?? 0,
      }))
      .filter((item) => item.count > 0),
    [],
  )

  const selectMode = (next) => {
    setMode(next)
    setVisible(PAGE_SIZE)
    if (next !== 'origin') {
      setOriginFormation('all')
      setOriginSource('all')
    }
  }

  const selectStatus = (next) => {
    setStatus(next)
    setVisible(PAGE_SIZE)
  }

  const startStudy = () =>
    navigate('etymologyStudy', {
      mode,
      status: status === 'all' ? 'priority' : 'all',
      packIds: packs.map((pack) => pack.id),
      size: ETYMOLOGY_SESSION_SIZE,
    })

  const startQuiz = () =>
    navigate('etymologyQuiz', {
      mode,
      status: status === 'all' ? 'priority' : 'all',
      packIds: packs.map((pack) => pack.id),
      size: ETYMOLOGY_SESSION_SIZE,
    })

  const studyLabel = status === 'all'
    ? `おすすめ${Math.min(ETYMOLOGY_SESSION_SIZE, currentStatus.total)}枚を学ぶ`
    : `${STATUS_STYLE[status].label}を${Math.min(ETYMOLOGY_SESSION_SIZE, packs.length)}枚学ぶ`
  const quizLabel = status === 'all'
    ? `おすすめ${Math.min(ETYMOLOGY_SESSION_SIZE, currentStatus.total)}枚を確認`
    : `${STATUS_STYLE[status].label}を${Math.min(ETYMOLOGY_SESSION_SIZE, packs.length)}枚確認`

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader
        title="語源で単語を理解する"
        subtitle={`${ETYMOLOGY_SUMMARY.total.toLocaleString()}語を4つの学び方で整理`}
      />

      <div className="space-y-4 px-4">
        <section
          className="overflow-hidden rounded-2xl border border-slate-300 bg-white"
          aria-label="語源知識の進捗概要"
          data-etymology-dashboard
        >
          <div className="flex items-end justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-xs font-extrabold text-slate-500">語源の学習</p>
              <p className="mt-0.5 font-display text-xl font-extrabold text-slate-900">
                全{overall.total.toLocaleString()}枚の暗記とクイズ
              </p>
            </div>
            <p className="text-right text-[10px] font-extrabold text-slate-500">別々に集計</p>
          </div>
          <div className="px-4 py-3">
            <LearningStatusBars progress={overallStatus} compact />
          </div>
          <div className="mx-3 mb-3 flex items-center justify-between gap-3 rounded-xl bg-rose-50 px-3 py-2 text-rose-800 ring-1 ring-rose-100">
            <div>
              <p className="text-xs font-extrabold">今日の復習</p>
              <p className="text-xs font-bold leading-relaxed text-rose-700">
                学習済・復習中の中で、もう一度見る時期のカード
              </p>
            </div>
            <p className="shrink-0 font-display text-lg font-extrabold">{overall.due.toLocaleString()}枚</p>
          </div>
          <details className="border-t border-slate-200">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-xs font-extrabold text-slate-600">
              <span>収録データについて</span>
              <span>{ETYMOLOGY_SUMMARY.covered.toLocaleString()}/{ETYMOLOGY_SUMMARY.total.toLocaleString()}語</span>
            </summary>
            <p className="border-t border-slate-100 px-4 py-3 text-sm font-bold leading-relaxed text-slate-600">
              全{ETYMOLOGY_SUMMARY.total.toLocaleString()}語を、{ETYMOLOGY_SUMMARY.packs.toLocaleString()}枚の語源カードに整理しています。
              語源カードの学習記録は、単語そのものの暗記記録とは分けて保存します。
            </p>
          </details>
        </section>

        <section aria-labelledby="etymology-mode-heading">
          <div className="mb-2 px-1">
            <h2 id="etymology-mode-heading" className="font-display text-base font-extrabold text-slate-900">学び方を選ぶ</h2>
            <p className="text-sm font-bold text-slate-500">まずは分かりやすい方法を1つ選びます。</p>
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
                  <span className="block whitespace-nowrap text-xs font-extrabold leading-snug">{item.emoji} {item.label}</span>
                  <span className={cx('mt-1 block text-xs font-bold', selected ? 'text-white/80' : 'text-slate-500')}>
                    {progress.learning.learned.toLocaleString()}/{progress.total.toLocaleString()}枚 学習済
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

        <section aria-label="表示する進捗状態">
          <p className="mb-2 px-1 text-sm font-extrabold text-slate-800">どのカードを見る？</p>
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

        {mode === 'origin' && (
          <details
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            data-etymology-filters
          >
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-xs font-extrabold text-slate-700">
              <span>さらにしぼる（任意）</span>
              <span className="text-slate-500">{axisPacks.length}/{modePacks.length}枚</span>
            </summary>
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
              <label className="min-w-0">
                <span className="mb-1 block text-xs font-extrabold text-slate-500">作られ方</span>
                <select
                  value={originFormation}
                  onChange={(event) => {
                    setOriginFormation(event.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className="min-h-11 w-full rounded-xl bg-slate-50 px-3 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <option value="all">すべての成り立ち</option>
                  {formationOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}（{item.count}語）</option>
                  ))}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-xs font-extrabold text-slate-500">もとの言語</span>
                <select
                  value={originSource}
                  onChange={(event) => {
                    setOriginSource(event.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className="min-h-11 w-full rounded-xl bg-slate-50 px-3 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <option value="all">すべての言語</option>
                  {sourceOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}（{item.count}語）</option>
                  ))}
                </select>
              </label>
            </div>
          </details>
        )}

        <div className="grid grid-cols-2 gap-2" data-etymology-actions>
          <Button
            full
            onClick={startStudy}
            disabled={packs.length === 0}
          >
            <Sparkles size={18} /> {studyLabel}
          </Button>
          <Button
            full
            variant="secondary"
            onClick={startQuiz}
            disabled={packs.length === 0}
          >
            <Cards size={18} /> {quizLabel}
          </Button>
        </div>

        {packs.length ? (
          <div className="space-y-2.5">
            {packs.slice(0, visible).map((pack) => {
              const entry = etymologySrs[pack.id]
              const learningStatus = learningStatusForSrsEntry(entry)
              const visual = STATUS_STYLE[learningStatus]
              const cardProgress = summarizeSrsItems([pack], etymologySrs)
              const dueNow = isEtymologyDue(entry, day)
              const examples = pack.studyIds
                .map(getWord)
                .filter(Boolean)
                .slice(0, 3)
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
                        <span className={cx(
                          'shrink-0 rounded-full px-2 py-1 text-xs font-extrabold',
                          visual.pill,
                        )}>
                          {visual.label}
                        </span>
                        {dueNow && (
                          <span className="shrink-0 rounded-full bg-rose-50 px-2 py-1 text-xs font-extrabold text-rose-700">
                            今日の復習
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-ink/55">
                        1枚のカード・関連 {pack.coverageIds.length}語
                      </p>
                      {pack.mode === 'origin' && (
                        <p className="mt-0.5 text-xs font-bold leading-relaxed text-violet-600/80">
                          {pack.subtitle}
                        </p>
                      )}
                      <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-relaxed text-brand-600/85">
                        {examples.map((word) => `${word.word}「${word.meanings?.[0] ?? word.meaning}」`).join(' ・ ')}
                      </p>
                    </div>
                    <span className="mt-3 text-brand-300"><ArrowRight size={17} /></span>
                    </div>
                    <LearningStatusBars progress={cardProgress} className="mt-3" compact />
                  </Card>
                </button>
              )
            })}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-3xl">✨</p>
            <p className="mt-2 font-display text-base font-extrabold text-ink">
              {STATUS_STYLE[status].label}のカードはありません
            </p>
            <p className="mt-1 text-xs font-bold text-ink/45">
              上の進み具合を切り替えると、ほかの語源カードを表示できます。
            </p>
          </Card>
        )}

        {visible < packs.length && (
          <div className="mt-4">
            <Button full variant="secondary" onClick={() => setVisible(visible + PAGE_SIZE)}>
              次の{Math.min(PAGE_SIZE, packs.length - visible)}枚を表示
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
