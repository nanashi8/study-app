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
  etymologyKnowledgeStatus,
  etymologyProgress,
  filterEtymologyPacks,
  isEtymologyDue,
  ETYMOLOGY_MASTER_BOX,
  ETYMOLOGY_SESSION_SIZE,
  ETYMOLOGY_STATUS_META,
} from '../lib/etymologyProgress.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, ProgressBar, cx } from '../components/ui.jsx'
import { ArrowRight, Sparkles } from '../components/Icons.jsx'

const PAGE_SIZE = 24
const MODES = ['formula', 'root', 'family', 'origin']
const STATUSES = ['all', 'unstarted', 'learning', 'mastered', 'due']

const STATUS_STYLE = {
  unstarted: {
    label: '未着手',
    pill: 'bg-slate-100 text-slate-600',
    ring: '#94a3b8',
  },
  learning: {
    label: '学習中',
    pill: 'bg-amber-50 text-amber-700',
    ring: '#f59e0b',
  },
  mastered: {
    label: '習得',
    pill: 'bg-emerald-50 text-emerald-700',
    ring: '#10b981',
  },
  due: {
    label: '復習待ち',
    pill: 'bg-rose-50 text-rose-700',
    ring: '#f43f5e',
  },
}

const countForStatus = (progress, status) =>
  status === 'all' ? progress.total : progress[status]

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
        return [id, etymologyProgress(packs, etymologySrs, day)]
      }),
    ),
    [etymologySrs, day],
  )
  const axisPacks = useMemo(
    () => modePacks.filter((pack) =>
      mode !== 'origin' ||
      (originFormation === 'all' || pack.formationKey === originFormation) &&
      (originSource === 'all' || pack.sourceKey === originSource)),
    [mode, modePacks, originFormation, originSource],
  )
  const current = useMemo(
    () => etymologyProgress(axisPacks, etymologySrs, day),
    [axisPacks, etymologySrs, day],
  )
  const packs = useMemo(
    () => filterEtymologyPacks(axisPacks, etymologySrs, { status, day }),
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
      status: status === 'all' ? 'priority' : status,
      packIds: packs.map((pack) => pack.id),
      size: ETYMOLOGY_SESSION_SIZE,
    })

  const studyLabel = status === 'all'
    ? `優先${Math.min(ETYMOLOGY_SESSION_SIZE, current.total)}項目を学ぶ`
    : `${ETYMOLOGY_STATUS_META[status].label}を${Math.min(ETYMOLOGY_SESSION_SIZE, packs.length)}項目学ぶ`

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader
        title="語源知識マップ"
        subtitle={`${ETYMOLOGY_SUMMARY.total.toLocaleString()}語 → ${ETYMOLOGY_SUMMARY.packs.toLocaleString()}項目`}
      />

      <div className="space-y-4 px-4">
        <section
          className="overflow-hidden rounded-2xl border border-slate-300 bg-white"
          aria-label="語源知識の進捗概要"
          data-etymology-dashboard
        >
          <div className="flex items-end justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.12em] text-slate-500">語源知識・全体</p>
              <p className="mt-0.5 font-display text-xl font-extrabold text-slate-900">
                {overall.mastered.toLocaleString()} / {overall.total.toLocaleString()} 項目を習得
              </p>
            </div>
            <p className="font-display text-2xl font-extrabold tabular-nums text-violet-700">
              {Math.round(overall.ratio * 100)}%
            </p>
          </div>
          <div className="px-4 pt-3">
            <ProgressBar value={overall.ratio} color="#7c3aed" />
          </div>
          <div className="grid grid-cols-4 divide-x divide-slate-200 px-2 py-3 text-center">
            {[
              ['未着手', overall.unstarted],
              ['学習中', overall.learning],
              ['習得', overall.mastered],
              ['復習待ち', overall.due],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 px-1">
                <p className="font-display text-base font-extrabold tabular-nums text-slate-900">{value.toLocaleString()}</p>
                <p className="truncate text-[9px] font-extrabold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
          <details className="border-t border-slate-200">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-xs font-extrabold text-slate-600">
              <span>収録範囲と集計基準</span>
              <span>{ETYMOLOGY_SUMMARY.covered.toLocaleString()}/{ETYMOLOGY_SUMMARY.total.toLocaleString()}語</span>
            </summary>
            <p className="border-t border-slate-100 px-4 py-3 text-xs font-bold leading-relaxed text-slate-600">
              全{ETYMOLOGY_SUMMARY.total.toLocaleString()}語を、部品の式・共有語根・語族・成り立ちと変化の
              {ETYMOLOGY_SUMMARY.packs.toLocaleString()}項目に整理しています。語源知識の復習記録は、単語のSRSとは分けて保存します。
            </p>
          </details>
        </section>

        <section aria-labelledby="etymology-mode-heading">
          <div className="mb-2 px-1">
            <h2 id="etymology-mode-heading" className="font-display text-base font-extrabold text-slate-900">学び方を選ぶ</h2>
            <p className="text-xs font-bold text-slate-500">4つの整理法を一度に混ぜず、1種類ずつ確認します。</p>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="語源の学び方">
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
                    'min-h-14 w-[8.4rem] shrink-0 rounded-xl border px-3 py-2 text-left transition-colors',
                    selected
                      ? 'border-violet-700 bg-violet-700 text-white'
                      : 'border-slate-200 bg-white text-slate-700',
                  )}
                >
                  <span className="block text-xs font-extrabold">{item.emoji} {item.label}</span>
                  <span className={cx('mt-0.5 block text-[10px] font-bold', selected ? 'text-white/70' : 'text-slate-500')}>
                    {progress.mastered}/{progress.total} 習得
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold leading-relaxed text-slate-600">
            <span className="font-extrabold text-slate-900">{meta.emoji} {meta.label}：</span>
            {meta.description}
            {mode === 'origin' && ' 形成法・出発言語・意味分野の3軸が同じ語だけを束ねます。'}
          </p>
        </section>

        <section aria-label="表示する進捗状態">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1" aria-label="語源知識の進捗で絞り込む">
          {STATUSES.map((id) => {
            const selected = status === id
            const count = countForStatus(current, id)
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectStatus(id)}
                className={cx(
                  'min-h-10 shrink-0 rounded-full px-3 text-[11px] font-extrabold ring-1 transition',
                  selected
                    ? 'bg-violet-600 text-white ring-violet-600'
                    : 'bg-white text-ink/55 ring-brand-100',
                )}
              >
                {ETYMOLOGY_STATUS_META[id].short} {count}
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
              <span>成り立ち・出発言語でさらに絞る</span>
              <span className="text-slate-400">{axisPacks.length}/{modePacks.length}項目</span>
            </summary>
            <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-3 sm:grid-cols-2">
              <label className="min-w-0">
                <span className="mb-1 block text-[10px] font-extrabold text-slate-500">英語への入り方</span>
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
                <span className="mb-1 block text-[10px] font-extrabold text-slate-500">記載上の出発言語</span>
                <select
                  value={originSource}
                  onChange={(event) => {
                    setOriginSource(event.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className="min-h-11 w-full rounded-xl bg-slate-50 px-3 text-xs font-extrabold text-slate-800 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-violet-300"
                >
                  <option value="all">すべての言語層</option>
                  {sourceOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}（{item.count}語）</option>
                  ))}
                </select>
              </label>
            </div>
          </details>
        )}

        <div>
          <Button
            full
            onClick={startStudy}
            disabled={packs.length === 0}
          >
            <Sparkles size={18} /> {studyLabel}
          </Button>
        </div>

        {packs.length ? (
          <div className="space-y-2.5">
            {packs.slice(0, visible).map((pack) => {
              const entry = etymologySrs[pack.id]
              const baseStatus = etymologyKnowledgeStatus(entry)
              const visualStatus = isEtymologyDue(entry, day) ? 'due' : baseStatus
              const visual = STATUS_STYLE[visualStatus]
              const ratio = Math.min(entry?.box ?? 0, ETYMOLOGY_MASTER_BOX)
                / ETYMOLOGY_MASTER_BOX
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
                          'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold',
                          visual.pill,
                        )}>
                          {visual.label}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-ink/45">
                        語源知識 1項目・関連 {pack.coverageIds.length}語
                      </p>
                      {pack.mode === 'origin' && (
                        <p className="mt-0.5 truncate text-[10px] font-bold text-violet-500/75">
                          {pack.subtitle}
                        </p>
                      )}
                      <p className="mt-1 truncate text-[11px] font-extrabold text-brand-500/80">
                        {examples.map((word) => word.word).join(' ・ ')}
                      </p>
                    </div>
                    <span className="mt-3 text-brand-300"><ArrowRight size={17} /></span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100" aria-label={`反復進捗${Math.round(ratio * 100)}%`}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.round(ratio * 100)}%`, backgroundColor: visual.ring }} />
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-3xl">✨</p>
            <p className="mt-2 font-display text-base font-extrabold text-ink">
              {ETYMOLOGY_STATUS_META[status].label}の項目はありません
            </p>
            <p className="mt-1 text-xs font-bold text-ink/45">
              上の進捗分類を切り替えると、ほかの語源知識を表示できます。
            </p>
          </Card>
        )}

        {visible < packs.length && (
          <div className="mt-4">
            <Button full variant="secondary" onClick={() => setVisible(visible + PAGE_SIZE)}>
              次の{Math.min(PAGE_SIZE, packs.length - visible)}項目を表示
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
