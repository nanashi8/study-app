import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from '../store/useStore.js'
import { notebookStoredSavedCount } from '../lib/learningNotebook.js'
import { selectProgressState } from '../lib/progressCode.js'
import {
  LEARNING_CONTENT_GROUPS,
  buildLearningContentProgress,
} from '../lib/learningContentProgress.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import {
  ArrowRight,
  Book,
  BookOpen,
  Bookmark,
  Cards,
  Chart,
  Headphones,
  Keyboard,
  Lightbulb,
  Link,
  MathRoot,
  Search,
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

function CategoryCard({ label, note, count, unit, due, Icon, tone, onOpen, action = '開く' }) {
  return (
    <Card className="flex min-h-28 flex-col rounded-xl border-slate-300 p-3 shadow-none">
      <div className="flex items-start gap-2.5">
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}>
          <Icon size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-slate-900">{label}</h3>
          <p className="text-[10px] font-bold leading-relaxed text-slate-500">{note}</p>
        </div>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2 border-t border-slate-200 pt-2">
        <div>
          <span className="inline-flex items-baseline whitespace-nowrap">
            <span className="font-display text-xl font-extrabold tabular-nums text-slate-950">{count.toLocaleString()}</span>
            <span className="ml-1 text-[10px] font-bold text-slate-500">{unit}</span>
          </span>
          {due > 0 && <p className="text-[9px] font-extrabold text-rose-700">今日の復習 {due}</p>}
        </div>
        <button
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          className="inline-flex min-h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-slate-800 px-2.5 text-[10px] font-extrabold text-white disabled:bg-slate-100 disabled:text-slate-400"
        >
          {action}<ArrowRight size={13} />
        </button>
      </div>
    </Card>
  )
}

function LearningCategoryCard({ content, onOpen }) {
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
              {content.progress.quizTotal !== content.progress.total
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
        units={{ learning: content.unit, quiz: content.quizUnit }}
      />

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-1 rounded-lg bg-slate-800 px-3 text-[11px] font-extrabold text-white active:bg-slate-700"
      >
        この教材を開く <ArrowRight size={13} />
      </button>
    </Card>
  )
}

export function MyLearningScreen() {
  const navigate = useStore((state) => state.navigate)
  const state = useStore(useShallow(selectProgressState))
  const contentRows = useMemo(() => buildLearningContentProgress(state), [state])
  const curriculumTotal = contentRows.reduce((sum, content) => sum + content.progress.total, 0)
  const engagedTotal = contentRows.reduce(
    (sum, content) => sum + content.progress.activeIds.length,
    0,
  )
  const savedKoten = state.kotenWordList.length
    + state.kotenGrammarList.length
    + state.kotenCultureList.length
  const savedKanbun = state.kanbunVocabList.length
    + state.kanbunGrammarList.length
    + state.kanbunCultureList.length
  const savedNotebook = notebookStoredSavedCount(state)

  const openContent = (content) => {
    if (content.id.startsWith('kanbun-') && content.id !== 'kanbun-kundoku') {
      navigate(content.screen, { domain: content.id.replace('kanbun-', '') })
      return
    }
    navigate(content.screen)
  }

  return (
    <div className="pb-6" data-my-learning-screen>
      <ScreenHeader title="マイ学習" subtitle="全教材の学習状態とクイズ結果" />

      <div className="space-y-5 px-4">
        <section className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white">
          <div className="border-b border-slate-300 bg-slate-800 px-4 py-3 text-white">
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-300">PERSONAL LEARNING INDEX</p>
            <div className="mt-0.5 flex items-end justify-between gap-3">
              <h2 className="font-display text-lg font-extrabold">あなたの学習索引</h2>
              <p className="text-right font-display text-lg font-extrabold tabular-nums">
                {engagedTotal.toLocaleString()}<small className="text-[10px] text-slate-300"> / {curriculumTotal.toLocaleString()}</small>
              </p>
            </div>
          </div>
          <p className="px-4 py-3 text-xs font-bold leading-relaxed text-slate-600">
            学習は「覚えた／まだ」、クイズは直近の「正解／不正解」を別々に集計します。灰色は、その学習方法ではまだ取り組んでいない項目です。
          </p>
        </section>

        <section aria-labelledby="saved-learning-heading">
          <div className="mb-2 px-1">
            <h2 id="saved-learning-heading" className="font-display text-base font-extrabold text-slate-900">保存した項目</h2>
            <p className="text-[10px] font-bold text-slate-500">自分で登録した項目と参照履歴</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <CategoryCard
              label="マイ学習ノート"
              note="8分野のメモ・タグ・問題集"
              count={savedNotebook}
              unit="項目"
              Icon={Bookmark}
              tone="bg-amber-50 text-amber-700"
              onOpen={() => navigate('myList')}
              action="一覧"
            />
            <CategoryCard
              label="保存した英文法"
              note="英作文で使った型を登録"
              count={state.myGrammarList.length}
              unit="項目"
              Icon={Lightbulb}
              tone="bg-violet-50 text-violet-700"
              onOpen={() => navigate('myGrammar')}
              action="一覧"
            />
            <CategoryCard
              label="古典の登録"
              note="単語・文法・古典常識"
              count={savedKoten}
              unit="項目"
              Icon={BookOpen}
              tone="bg-orange-50 text-orange-700"
              onOpen={() => navigate('kotenSaved')}
              action="一覧"
            />
            <CategoryCard
              label="漢文の登録"
              note="漢語・漢文法・漢文常識"
              count={savedKanbun}
              unit="項目"
              Icon={BookOpen}
              tone="bg-rose-50 text-rose-800"
              onOpen={() => navigate('kanbunSaved')}
              action="一覧"
            />
            <CategoryCard
              label="辞書の参照履歴"
              note="検索・参照・登録した英単語"
              count={state.vocabHistory.length}
              unit="語"
              Icon={Search}
              tone="bg-sky-50 text-sky-700"
              onOpen={() => navigate('vocabSearch')}
              action="辞書"
            />
          </div>
        </section>

        {LEARNING_CONTENT_GROUPS.map((group) => {
          const contents = contentRows.filter((content) => content.group === group.id)
          return (
            <section key={group.id} aria-labelledby={`learning-group-${group.id}`} data-learning-content-group={group.id}>
              <div className="mb-2 px-1">
                <h2 id={`learning-group-${group.id}`} className="font-display text-base font-extrabold text-slate-900">
                  {group.label}の学習状況
                </h2>
                <p className="text-[10px] font-bold text-slate-500">各棒の3区分は重ならず、学習は項目数、クイズは問題数の合計になります</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {contents.map((content) => (
                  <LearningCategoryCard
                    key={content.id}
                    content={content}
                    onOpen={() => openContent(content)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <Button full variant="secondary" onClick={() => navigate('progress')}>
          <Chart size={17} /> 成績分析票と全進捗を見る
        </Button>
      </div>
    </div>
  )
}
