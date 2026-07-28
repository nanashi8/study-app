import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  getWord,
} from '../data/vocab.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, ProgressRing } from '../components/ui.jsx'
import { ArrowRight, Check } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'

const MASTER_BOX = 4
const PAGE_SIZE = 24
const MODES = ['formula', 'root', 'family', 'origin']

function packProgress(pack, srs) {
  const words = pack.coverageIds.map(getWord).filter(Boolean)
  let mastered = 0
  let points = 0
  for (const word of words) {
    const box = srs[word.id]?.box ?? 0
    if (box >= MASTER_BOX) mastered++
    points += Math.min(box, MASTER_BOX)
  }
  return {
    mastered,
    total: words.length,
    ratio: words.length ? points / (words.length * MASTER_BOX) : 0,
  }
}

// 全語を、語源データの確度に応じた4経路へ重複なく分けて学ぶ。
// 「由来の型」は同語根を主張せず、分解できない語も正直に全件収録する。
export function RootsScreen() {
  const rootRef = useRef(null)
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.srs)
  const [mode, setMode] = useState('formula')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const meta = ETYMOLOGY_MODE_META[mode]

  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const packs = useMemo(
    () => ETYMOLOGY_PACKS.filter((pack) => pack.mode === mode),
    [mode],
  )
  const masteredAll = ETYMOLOGY_PACKS.reduce(
    (sum, pack) => sum + pack.coverageIds.filter(
      (id) => (srs[id]?.box ?? 0) >= MASTER_BOX,
    ).length,
    0,
  )

  const selectMode = (next) => {
    setMode(next)
    setVisible(PAGE_SIZE)
  }

  const openPack = (pack) => {
    if (pack.mode === 'root') {
      navigate('rootDetail', { rootId: pack.rootId })
    } else {
      navigate('etymologyPack', { packId: pack.id })
    }
  }

  return (
    <div ref={rootRef} className="pb-6">
      <ScreenHeader
        title="語源で濃縮する"
        subtitle={`全${ETYMOLOGY_SUMMARY.total.toLocaleString()}語を4つの経路へ`}
      />

      <div className="px-4">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-white/70">
                  Etymology compression map
                </p>
                <h1 className="mt-1 font-display text-xl font-extrabold leading-snug">
                  {ETYMOLOGY_SUMMARY.total.toLocaleString()}語を孤立させず、
                  <br />確かなつながりの強さで整理
                </h1>
              </div>
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl bg-white/15 ring-1 ring-white/20">
                <span className="font-display text-2xl font-extrabold">100%</span>
                <span className="text-[10px] font-extrabold text-white/70">全語収録</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 p-4">
            <p className="text-sm font-bold leading-relaxed text-ink/60">
              分解できる語は意味の式へ、同じ核がある語は語根・語族へ。
              それ以外は誤った同源扱いをせず、由来の読み方をそろえます。
            </p>
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700">
              <span className="inline-flex items-center gap-1">
                <Check size={14} /> 濃縮経路あり
              </span>
              <span>
                {ETYMOLOGY_SUMMARY.covered.toLocaleString()}/
                {ETYMOLOGY_SUMMARY.total.toLocaleString()}語
              </span>
            </div>
            <p className="text-right text-[11px] font-bold text-ink/40">
              現在の習得 {masteredAll.toLocaleString()}語
            </p>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {MODES.map((id) => {
            const item = ETYMOLOGY_MODE_META[id]
            const selected = id === mode
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
                      {ETYMOLOGY_SUMMARY.counts[id].toLocaleString()}語・
                      {ETYMOLOGY_SUMMARY.packCounts[id].toLocaleString()}束
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
            {mode === 'origin' && ' 同じ語根の集まりではないことを各パックにも明記します。'}
          </p>
        </div>

        <div className="space-y-2.5">
          {packs.slice(0, visible).map((pack) => {
            const progress = packProgress(pack, srs)
            const examples = pack.studyIds
              .map(getWord)
              .filter(Boolean)
              .slice(0, 3)
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => openPack(pack)}
                className="w-full text-left transition active:scale-[0.99]"
              >
                <Card className="flex items-center gap-3 p-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                    {pack.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-extrabold text-ink">
                      {pack.title}
                    </h3>
                    <p className="text-[11px] font-bold text-ink/45">
                      対象 {progress.total}語・習得 {progress.mastered}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-extrabold text-brand-500/80">
                      {examples.map((word) => word.word).join(' ・ ')}
                    </p>
                  </div>
                  <ProgressRing value={progress.ratio} size={42} stroke={6} color="#6366f1">
                    <span className="text-[9px] font-extrabold text-ink/65">
                      {Math.round(progress.ratio * 100)}%
                    </span>
                  </ProgressRing>
                  <span className="text-brand-300"><ArrowRight size={17} /></span>
                </Card>
              </button>
            )
          })}
        </div>

        {visible < packs.length && (
          <div className="mt-4">
            <Button full variant="secondary" onClick={() => setVisible(visible + PAGE_SIZE)}>
              次の{Math.min(PAGE_SIZE, packs.length - visible)}束を表示
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
