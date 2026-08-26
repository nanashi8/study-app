import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { selectProgressState } from '../lib/progressCode.js'
import {
  LEARNING_CONTENT_GROUPS,
  buildLearningContentProgress,
} from '../lib/learningContentProgress.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card } from '../components/ui.jsx'
import {
  LearningStatusBars,
  LearningStatusLegend,
} from '../components/LearningStatusBars.jsx'
import { LearningContentCatalog } from '../components/LearningContentCatalog.jsx'
import {
  ArrowRight,
  Book,
  BookOpen,
  Cards,
  Chart,
  Headphones,
  Keyboard,
  Lightbulb,
  Link,
  MathRoot,
  Sparkles,
} from '../components/Icons.jsx'

const CONTENT_META = Object.freeze({
  vocab: { Icon: Book, tone: 'text-indigo-700 bg-indigo-50' },
  usage: { Icon: Sparkles, tone: 'text-violet-700 bg-violet-50' },
  grammar: { Icon: Lightbulb, tone: 'text-amber-700 bg-amber-50' },
  listening: { Icon: Headphones, tone: 'text-sky-700 bg-sky-50' },
  dictation: { Icon: Keyboard, tone: 'text-teal-700 bg-teal-50' },
  etymology: { Icon: Link, tone: 'text-fuchsia-700 bg-fuchsia-50' },
  reading: { Icon: BookOpen, tone: 'text-emerald-700 bg-emerald-50' },
  writing: { Icon: Cards, tone: 'text-pink-700 bg-pink-50' },
  'koten-vocab': { Icon: Book, tone: 'text-orange-700 bg-orange-50' },
  'koten-grammar': { Icon: Lightbulb, tone: 'text-orange-700 bg-orange-50' },
  'koten-culture': { Icon: BookOpen, tone: 'text-amber-800 bg-amber-50' },
  'koten-reading': { Icon: BookOpen, tone: 'text-orange-800 bg-orange-50' },
  'kanbun-vocab': { Icon: Book, tone: 'text-rose-800 bg-rose-50' },
  'kanbun-grammar': { Icon: Lightbulb, tone: 'text-rose-800 bg-rose-50' },
  'kanbun-culture': { Icon: BookOpen, tone: 'text-rose-800 bg-rose-50' },
  'kanbun-kundoku': { Icon: Cards, tone: 'text-red-800 bg-red-50' },
  literature: { Icon: BookOpen, tone: 'text-teal-700 bg-teal-50' },
  math: { Icon: MathRoot, tone: 'text-indigo-700 bg-indigo-50' },
})

function LearningCategoryCard({ content, onOpen, onCatalog }) {
  const meta = CONTENT_META[content.id] ?? CONTENT_META.reading
  const { Icon } = meta
  const engaged = content.progress.activeIds.length
  return (
    <Card
      className="rounded-xl border-slate-300 p-3 shadow-none"
      data-learning-content={content.id}
    >
      <div className="flex items-start gap-2.5">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.tone}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-extrabold text-slate-900">{content.label}</h3>
            <span className="shrink-0 text-[10px] font-extrabold tabular-nums text-slate-500">
              全{content.progress.total.toLocaleString('ja-JP')}{content.unit}
              {content.hasQuiz && content.progress.quizTotal !== content.progress.total
                && `・${content.progress.quizTotal.toLocaleString('ja-JP')}${content.quizUnit}`}
            </span>
          </div>
          <p className="text-[10px] font-bold leading-relaxed text-slate-500">
            取り組み {engaged.toLocaleString('ja-JP')}{content.unit}
            {content.due > 0 && `・今日の復習 ${content.due}`}
          </p>
        </div>
      </div>

      <LearningStatusBars
        progress={content.progress}
        className="mt-3"
        compact
        showQuiz={content.hasQuiz}
        showLegend={false}
        units={{ learning: content.unit, quiz: content.quizUnit }}
      />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-slate-100 px-2 text-[11px] font-extrabold text-slate-700 active:bg-slate-200"
        >
          教材トップ <ArrowRight size={13} />
        </button>
        <button
          type="button"
          onClick={onCatalog}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-slate-800 px-2 text-[11px] font-extrabold text-white active:bg-slate-700"
          data-learning-content-catalog-entry={content.id}
        >
          一覧を確認 <ArrowRight size={13} />
        </button>
      </div>
    </Card>
  )
}

export function MyLearningScreen() {
  const navigate = useStore((state) => state.navigate)
  const params = useStore((state) => state.params)
  const state = useStore(useShallow(selectProgressState))
  const contentRows = useMemo(() => buildLearningContentProgress(state), [state])
  const engagedTotal = contentRows.reduce(
    (sum, content) => sum + content.progress.activeIds.length,
    0,
  )
  const engagedContents = contentRows.filter((content) => content.progress.activeIds.length > 0).length
  const dueTotal = contentRows.reduce((sum, content) => sum + content.due, 0)

  const openContent = (content) => {
    if (content.id.startsWith('kanbun-') && content.id !== 'kanbun-kundoku') {
      navigate(content.screen, { domain: content.id.replace('kanbun-', '') })
      return
    }
    navigate(content.screen)
  }

  if (params.view === 'catalog') {
    return (
      <LearningContentCatalog
        initialContentId={params.contentId}
        initialCatalogView={params.catalogView}
      />
    )
  }

  return (
    <div className="pb-6" data-my-learning-screen>
      <ScreenHeader title="暗記・テストの記録" subtitle="18教材の一覧を確認し、結果を見直す" />

      <div className="space-y-5 px-4">
        <Card className="rounded-xl border-slate-300 p-4 shadow-none" data-learning-record-summary>
          <h2 className="font-display text-base font-extrabold text-slate-950">この画面の見方</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-slate-600">
            各教材の「一覧を確認」で学習記録を見直せます。英単語は学習前・テスト前も含め、連続スワイプでさっと学習できます。
          </p>
          <dl className="mt-3 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center">
            {[
              ['取り組んだ教材', `${engagedContents}/${contentRows.length}`],
              ['取り組んだ項目', engagedTotal.toLocaleString('ja-JP')],
              ['今日の復習', dueTotal.toLocaleString('ja-JP')],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 px-1">
                <dd className="font-display text-lg font-extrabold tabular-nums text-slate-950">{value}</dd>
                <dt className="mt-0.5 text-[9px] font-bold leading-tight text-slate-500">{label}</dt>
              </div>
            ))}
          </dl>
          <LearningStatusLegend className="mt-3" />
        </Card>

        <nav className="rounded-xl border border-slate-300 bg-white p-3" aria-label="教科別の記録へ移動">
          <p className="text-xs font-extrabold text-slate-800">見たい教科へ移動</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {LEARNING_CONTENT_GROUPS.map((group) => {
              const count = contentRows.filter((content) => content.group === group.id).length
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => document.getElementById(`learning-group-${group.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="min-h-11 rounded-lg bg-slate-100 px-3 text-left text-xs font-extrabold text-slate-800 active:bg-slate-200"
                >
                  {group.label}<span className="ml-1 text-[9px] text-slate-500">{count}教材</span>
                </button>
              )
            })}
          </div>
        </nav>

        {LEARNING_CONTENT_GROUPS.map((group) => {
          const contents = contentRows.filter((content) => content.group === group.id)
          return (
            <section key={group.id} id={`learning-group-${group.id}`} className="scroll-mt-16" aria-labelledby={`learning-group-heading-${group.id}`} data-learning-content-group={group.id}>
              <div className="mb-2 px-1">
                <h2 id={`learning-group-heading-${group.id}`} className="font-display text-base font-extrabold text-slate-900">
                  {group.label}
                </h2>
                <p className="text-[10px] font-bold text-slate-500">{contents.length}教材の暗記とテスト</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {contents.map((content) => (
                  <LearningCategoryCard
                    key={content.id}
                    content={content}
                    onOpen={() => openContent(content)}
                    onCatalog={() => navigate('myLearning', { view: 'catalog', contentId: content.id })}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <Button full variant="secondary" onClick={() => navigate('progress')}>
          <Chart size={17} /> 学習記録とおすすめを見る
        </Button>
      </div>
    </div>
  )
}
