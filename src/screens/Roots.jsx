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
import { Button, Card, ProgressRing, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Sparkles } from '../components/Icons.jsx'

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
  const navigate = useStore((state) => state.navigate)
  const etymologySrs = useStore((state) => state.etymologySrs)
  const [mode, setMode] = useState('formula')
  const [status, setStatus] = useState('all')
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

      <div className="px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/70">
                  Etymology knowledge progress
                </p>
                <h1 className="mt-1 font-display text-xl font-extrabold leading-snug">
                  単語の習得とは別に、
                  <br />語源そのものを反復学習
                </h1>
              </div>
              <ProgressRing
                value={overall.ratio}
                size={76}
                stroke={8}
                color="#ffffff"
                track="rgba(255,255,255,0.22)"
              >
                <span className="text-sm font-extrabold">
                  {Math.round(overall.ratio * 100)}%
                </span>
              </ProgressRing>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-bold leading-relaxed text-ink/60">
              部品の式・共有語根・語族・成り立ちと変化を、それぞれ1つの語源カードとして記録します。
              「覚えた／まだ」の結果から次の復習日も決まります。
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['習得', overall.mastered, 'text-emerald-700 bg-emerald-50'],
                ['学習中', overall.learning, 'text-amber-700 bg-amber-50'],
                ['未着手', overall.unstarted, 'text-slate-600 bg-slate-50'],
                ['復習待ち', overall.due, 'text-rose-700 bg-rose-50'],
              ].map(([label, value, style]) => (
                <div key={label} className={cx('rounded-xl px-3 py-2', style)}>
                  <p className="font-display text-lg font-extrabold">{value.toLocaleString()}</p>
                  <p className="text-[10px] font-extrabold">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-xs font-extrabold text-brand-700">
              <span className="inline-flex items-center gap-1">
                <Check size={14} /> 全語の分類完了
              </span>
              <span>
                {ETYMOLOGY_SUMMARY.covered.toLocaleString()}/
                {ETYMOLOGY_SUMMARY.total.toLocaleString()}語
              </span>
            </div>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {MODES.map((id) => {
            const item = ETYMOLOGY_MODE_META[id]
            const selected = id === mode
            const progress = modeStats[id]
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectMode(id)}
                className={cx(
                  'rounded-2xl p-3 text-left ring-1 transition active:scale-[0.98]',
                  selected
                    ? 'bg-brand-600 text-white ring-brand-600 shadow-card'
                    : 'bg-white text-ink ring-brand-100',
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-extrabold">{item.label}</div>
                    <div className={cx(
                      'text-[10px] font-extrabold',
                      selected ? 'text-white/70' : 'text-ink/40',
                    )}>
                      {progress.total.toLocaleString()}項目・
                      {ETYMOLOGY_SUMMARY.counts[id].toLocaleString()}語
                    </div>
                    <div className={cx(
                      'mt-0.5 text-[10px] font-extrabold',
                      selected ? 'text-white/80' : 'text-brand-500/80',
                    )}>
                      習得 {progress.mastered}・未着手 {progress.unstarted}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mb-2 mt-5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.emoji}</span>
            <h2 className="font-display text-base font-extrabold text-ink/80">
              {meta.label}
            </h2>
          </div>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/45">
            {meta.description}
            {mode === 'origin' && ' 形成法と言語層を混ぜず、同じ3軸の語だけを1束にします。'}
          </p>
        </div>

        {mode === 'origin' && (
          <Card className="mb-3 space-y-2.5 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-ink/70">形成法と言語層で絞る</p>
                <p className="text-[10px] font-bold text-ink/40">
                  各束の中では意味分野も統一
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-2 py-1 text-[10px] font-extrabold text-brand-600">
                {axisPacks.length}/{modePacks.length}項目
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="min-w-0">
                <span className="mb-1 block text-[10px] font-extrabold text-ink/45">
                  英語への入り方
                </span>
                <select
                  value={originFormation}
                  onChange={(event) => {
                    setOriginFormation(event.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className="w-full rounded-xl bg-slate-50 px-2 py-2 text-xs font-extrabold text-ink ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-300"
                >
                  <option value="all">すべての成り立ち</option>
                  {formationOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}（{item.count}語）
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0">
                <span className="mb-1 block text-[10px] font-extrabold text-ink/45">
                  記載の出発言語
                </span>
                <select
                  value={originSource}
                  onChange={(event) => {
                    setOriginSource(event.target.value)
                    setVisible(PAGE_SIZE)
                  }}
                  className="w-full rounded-xl bg-slate-50 px-2 py-2 text-xs font-extrabold text-ink ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-300"
                >
                  <option value="all">すべての言語層</option>
                  {sourceOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}（{item.count}語）
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Card>
        )}

        <div className="flex flex-wrap gap-2" aria-label="語源知識の進捗で絞り込む">
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
                  'rounded-full px-3 py-1.5 text-[11px] font-extrabold ring-1 transition',
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

        <div className="my-3">
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
                  <Card className="flex items-center gap-3 p-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                      {pack.emoji}
                    </span>
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
                    <ProgressRing value={ratio} size={42} stroke={6} color={visual.ring}>
                      <span className="text-[9px] font-extrabold text-ink/65">
                        {Math.round(ratio * 100)}%
                      </span>
                    </ProgressRing>
                    <span className="text-brand-300"><ArrowRight size={17} /></span>
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
