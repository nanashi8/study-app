import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  LITERATURE_KIND_META,
  PUBLIC_DOMAIN_LITERATURE,
  literatureCompletionCount,
  literatureWordCount,
} from '../data/public-domain-literature.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Chip, ProgressBar, cx } from '../components/ui.jsx'
import { ArrowRight, Check, Headphones, Link } from '../components/Icons.jsx'

const FILTERS = [
  { id: 'all', label: 'すべて' },
  { id: 'english', label: '英語' },
  { id: 'classical', label: '古典' },
  { id: 'kanbun', label: '漢文' },
]

export function LiteratureLibraryScreen() {
  const navigate = useStore((state) => state.navigate)
  const readingsDone = useStore((state) => state.readingsDone)
  const initialKind = useStore((state) => state.params.kind)
  const [filter, setFilter] = useState(() =>
    ['english', 'classical', 'kanbun'].includes(initialKind) ? initialKind : 'all',
  )

  const works =
    filter === 'all'
      ? PUBLIC_DOMAIN_LITERATURE
      : PUBLIC_DOMAIN_LITERATURE.filter((work) => work.kind === filter)
  const done = literatureCompletionCount(readingsDone, filter === 'all' ? null : filter)
  const total = works.length

  return (
    <div className="pb-7">
      <ScreenHeader
        title="名作に親しむ"
        subtitle="間で区切る → 一対ずつ意味を確かめる"
        color="#0f766e"
      />

      <div className="space-y-4 px-4">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-900 p-5 text-white shadow-card">
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              🎙️
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-teal-200">
                Listen & understand
              </p>
              <h1 className="mt-1 font-display text-xl font-extrabold">
                一息ずつ、原文と訳を往復
              </h1>
              <p className="mt-2 text-xs font-bold leading-relaxed text-white/70">
                英語は英語→直訳、古典は古文→現代語訳、漢文は原文を見ながら書き下し→現代語訳。朗読で間を置くまとまりごとに交互に読み上げます。
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-white/75">
                <span>読了</span>
                <span>{literatureCompletionCount(readingsDone)}/{PUBLIC_DOMAIN_LITERATURE.length}作品</span>
              </div>
              <ProgressBar
                value={
                  PUBLIC_DOMAIN_LITERATURE.length
                    ? literatureCompletionCount(readingsDone) / PUBLIC_DOMAIN_LITERATURE.length
                    : 0
                }
                className="mt-1.5 h-2 bg-white/15"
                color="linear-gradient(90deg,#5eead4,#34d399)"
              />
            </div>
            <Headphones size={22} className="text-teal-200" />
          </div>
        </section>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Check size={20} />
            </span>
            <div>
              <h2 className="font-display text-sm font-extrabold text-ink">
                権利を確認した原文だけを収録
              </h2>
              <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                作品ごとに作者・初出・確認した底本を表示します。訳と解説は本アプリ独自で、市販の朗読音源は使いません。
              </p>
              <a
                href="https://www.bunka.go.jp/seisaku/chosakuken/taisetsu/point/index.html"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 underline underline-offset-2"
              >
                <Link size={12} /> 文化庁「保護期間とパブリックドメイン」
              </a>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-4 rounded-2xl bg-teal-100 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={cx(
                'min-h-11 rounded-xl px-2 text-sm font-extrabold transition-colors',
                filter === item.id
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-teal-800/55',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-end justify-between px-1">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">
              {filter === 'all' ? '収録作品' : LITERATURE_KIND_META[filter].label}
            </h2>
            <p className="text-xs font-bold text-ink/45">
              {total}作品・読了 {done}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {works.map((work) => {
            const meta = LITERATURE_KIND_META[work.kind]
            const completed = readingsDone.includes(work.id)
            return (
              <Card key={work.id} className="overflow-hidden">
                <button
                  onClick={() => navigate('literatureReader', { workId: work.id })}
                  className="w-full p-4 text-left active:bg-teal-50"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl"
                      style={{ backgroundColor: `${meta.color}18` }}
                    >
                      {work.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Chip color={meta.color}>{meta.shortLabel}</Chip>
                        <Chip className="bg-ink/5 text-ink/55">{work.level}</Chip>
                        {completed && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600">
                            <Check size={13} /> 読了
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-display text-base font-extrabold leading-tight text-ink">
                        {work.title}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-ink/55">{work.titleJa}</p>
                      <p className="mt-2 text-xs font-bold leading-relaxed text-ink/45">
                        {work.blurb}
                      </p>
                    </div>
                    <ArrowRight size={20} className="mt-5 shrink-0 text-teal-600" />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-ink/5 pt-3 text-[11px] font-extrabold text-ink/40">
                    <span>{work.authorJa}（{work.authorYears}）</span>
                    <span>{work.scenes.length}場面</span>
                    {work.kind === 'english' && <span>原文 {literatureWordCount(work)}語</span>}
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <Link size={12} /> 出典表示あり
                    </span>
                  </div>
                </button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
