import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useStore, todayIndex } from '../store/useStore.js'
import { ALL_WORDS } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import { GRAMMAR } from '../data/grammar.js'
import { LISTENING_ITEMS } from '../data/listening.js'
import { DICTATION_ITEMS } from '../data/dictation.js'
import { notebookStoredSavedCount } from '../lib/learningNotebook.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card } from '../components/ui.jsx'
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

const ITEM_IDS = Object.freeze({
  vocab: new Set(ALL_WORDS.map((item) => item.id)),
  usage: new Set(PHRASES.map((item) => item.id)),
  grammar: new Set(GRAMMAR.map((item) => item.id)),
  listening: new Set(LISTENING_ITEMS.map((item) => item.id)),
  dictation: new Set(DICTATION_ITEMS.map((item) => item.id)),
})

const ENGLISH_CATEGORY_META = Object.freeze({
  vocab: { label: '英単語', unit: '語', Icon: Book, tone: 'text-indigo-700 bg-indigo-50' },
  usage: { label: '熟語・構文', unit: '項目', Icon: Sparkles, tone: 'text-violet-700 bg-violet-50' },
  grammar: { label: '英文法', unit: '問', Icon: Lightbulb, tone: 'text-amber-700 bg-amber-50' },
  listening: { label: 'リスニング', unit: '問', Icon: Headphones, tone: 'text-sky-700 bg-sky-50' },
  dictation: { label: 'ディクテーション', unit: '問', Icon: Keyboard, tone: 'text-teal-700 bg-teal-50' },
})

const dueCountFor = (ids, srs, day) =>
  ids.reduce((count, id) => count + (srs[id]?.due <= day ? 1 : 0), 0)

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
          <span className="font-display text-xl font-extrabold tabular-nums text-slate-950">{count.toLocaleString()}</span>
          <span className="ml-1 text-[10px] font-bold text-slate-500">{unit}</span>
          {due > 0 && <p className="text-[9px] font-extrabold text-rose-700">復習待ち {due}</p>}
        </div>
        <button
          type="button"
          onClick={onOpen}
          disabled={!onOpen}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg bg-slate-800 px-2.5 text-[10px] font-extrabold text-white disabled:bg-slate-100 disabled:text-slate-400"
        >
          {action}<ArrowRight size={13} />
        </button>
      </div>
    </Card>
  )
}

export function MyLearningScreen() {
  const navigate = useStore((state) => state.navigate)
  const state = useStore(useShallow((current) => ({
    srs: current.srs,
    etymologySrs: current.etymologySrs,
    kotenSrs: current.kotenSrs,
    kotenGrammarSrs: current.kotenGrammarSrs,
    kotenCultureSrs: current.kotenCultureSrs,
    kotenInterpretationSrs: current.kotenInterpretationSrs,
    kanbunVocabSrs: current.kanbunVocabSrs,
    kanbunGrammarSrs: current.kanbunGrammarSrs,
    kanbunCultureSrs: current.kanbunCultureSrs,
    kanbunKundokuSrs: current.kanbunKundokuSrs,
    myList: current.myList,
    myGrammarList: current.myGrammarList,
    learningNotebook: current.learningNotebook,
    kotenWordList: current.kotenWordList,
    kotenGrammarList: current.kotenGrammarList,
    kotenCultureList: current.kotenCultureList,
    kanbunVocabList: current.kanbunVocabList,
    kanbunGrammarList: current.kanbunGrammarList,
    kanbunCultureList: current.kanbunCultureList,
    vocabHistory: current.vocabHistory,
    readingsDone: current.readingsDone,
    writingProgress: current.writingProgress,
    mathDone: current.mathDone,
  })))
  const day = todayIndex()

  const english = useMemo(() => {
    const srsIds = Object.keys(state.srs)
    return Object.fromEntries(Object.entries(ITEM_IDS).map(([id, knownIds]) => {
      const ids = srsIds.filter((itemId) => knownIds.has(itemId))
      return [id, { ids, due: dueCountFor(ids, state.srs, day) }]
    }))
  }, [state.srs, day])

  const etymologyIds = Object.keys(state.etymologySrs)
  const etymologyDue = dueCountFor(etymologyIds, state.etymologySrs, day)
  const kotenLearned = Object.keys(state.kotenSrs).length
    + Object.keys(state.kotenGrammarSrs).length
    + Object.keys(state.kotenCultureSrs).length
    + Object.keys(state.kotenInterpretationSrs).length
  const savedKoten = state.kotenWordList.length
    + state.kotenGrammarList.length
    + state.kotenCultureList.length
  const kanbunLearned = Object.keys(state.kanbunVocabSrs).length
    + Object.keys(state.kanbunGrammarSrs).length
    + Object.keys(state.kanbunCultureSrs).length
    + Object.keys(state.kanbunKundokuSrs).length
  const savedKanbun = state.kanbunVocabList.length
    + state.kanbunGrammarList.length
    + state.kanbunCultureList.length
  const savedNotebook = notebookStoredSavedCount(state)
  const writingCompleted = Object.values(state.writingProgress)
    .filter((entry) => (entry?.completed ?? 0) > 0).length
  const learnedTotal = Object.values(english).reduce((sum, item) => sum + item.ids.length, 0)
    + etymologyIds.length
    + kotenLearned
    + kanbunLearned
    + state.readingsDone.length
    + writingCompleted
    + state.mathDone.length

  const openEnglishReview = (id, ids) => {
    if (!ids.length) return
    if (id === 'vocab') {
      navigate('vocabStudy', {
        source: { type: 'deck', ids },
        title: '学習済み英単語',
        mode: 'study',
      })
    } else if (id === 'usage') {
      navigate('phraseStudy', {
        source: { type: 'phraseList', ids },
        title: '学習済み熟語・構文',
        mode: 'study',
        engine: 'phrase',
      })
    } else if (id === 'grammar') {
      navigate('grammarQuiz', {
        source: { type: 'grammarList', ids },
        title: '学習済み英文法',
      })
    } else if (id === 'listening') {
      navigate('listeningQuiz', {
        source: { type: 'listeningList', ids },
        title: '学習済みリスニング',
        engine: 'listening',
      })
    } else if (id === 'dictation') {
      navigate('dictationPlay', {
        source: { type: 'dictationList', ids },
        title: '学習済みディクテーション',
      })
    }
  }

  return (
    <div className="pb-6" data-my-learning-screen>
      <ScreenHeader title="マイ学習" subtitle="保存・学習済み項目を種類別に再利用" />

      <div className="space-y-5 px-4">
        <section className="overflow-hidden rounded-xl border-2 border-slate-700 bg-white">
          <div className="border-b border-slate-300 bg-slate-800 px-4 py-3 text-white">
            <p className="text-[10px] font-extrabold tracking-[0.16em] text-slate-300">PERSONAL LEARNING INDEX</p>
            <div className="mt-0.5 flex items-end justify-between gap-3">
              <h2 className="font-display text-lg font-extrabold">あなたの学習索引</h2>
              <p className="font-display text-2xl font-extrabold tabular-nums">{learnedTotal.toLocaleString()}</p>
            </div>
          </div>
          <p className="px-4 py-3 text-xs font-bold leading-relaxed text-slate-600">
            「マイ単語」だけでなく、実際に解いた英単語・熟語・構文・文法・音声問題と、他教科の履歴を種類別に呼び出せます。
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

        <section aria-labelledby="studied-english-heading">
          <div className="mb-2 px-1">
            <h2 id="studied-english-heading" className="font-display text-base font-extrabold text-slate-900">学習した英語項目</h2>
            <p className="text-[10px] font-bold text-slate-500">正誤・覚えた／まだを記録した項目を再出題</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5" data-my-learning-english-categories>
            {Object.entries(ENGLISH_CATEGORY_META).map(([id, meta]) => {
              const category = english[id]
              return (
                <CategoryCard
                  key={id}
                  {...meta}
                  note="学習履歴から再出題"
                  count={category.ids.length}
                  due={category.due}
                  onOpen={category.ids.length ? () => openEnglishReview(id, category.ids) : null}
                  action="復習"
                />
              )
            })}
            <CategoryCard
              label="語源知識"
              note="部品・語根・語族・成り立ち"
              count={etymologyIds.length}
              unit="項目"
              due={etymologyDue}
              Icon={Link}
              tone="bg-fuchsia-50 text-fuchsia-700"
              onOpen={() => navigate('roots', { status: etymologyDue ? 'due' : 'all' })}
              action="語源"
            />
          </div>
        </section>

        <section aria-labelledby="other-learning-heading">
          <div className="mb-2 px-1">
            <h2 id="other-learning-heading" className="font-display text-base font-extrabold text-slate-900">読了・演習・他教科</h2>
            <p className="text-[10px] font-bold text-slate-500">完了履歴から元の学習画面へ戻る</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <CategoryCard label="長文・名作" note="読了した教材" count={state.readingsDone.length} unit="件" Icon={BookOpen} tone="bg-emerald-50 text-emerald-700" onOpen={() => navigate('readingList')} action="読む" />
            <CategoryCard label="英作文" note="完成した演習" count={writingCompleted} unit="題" Icon={Cards} tone="bg-pink-50 text-pink-700" onOpen={() => navigate('writing')} action="書く" />
            <CategoryCard label="数学" note="解答済み問題" count={state.mathDone.length} unit="問" Icon={MathRoot} tone="bg-indigo-50 text-indigo-700" onOpen={() => navigate('mathMap')} action="数学" />
            <CategoryCard label="古典学習" note="単語・文法・常識・読解" count={kotenLearned} unit="項目" Icon={Book} tone="bg-orange-50 text-orange-700" onOpen={() => navigate('kotenList')} action="古典" />
            <CategoryCard label="漢文学習" note="漢語・文法・常識・返り点" count={kanbunLearned} unit="項目" Icon={BookOpen} tone="bg-rose-50 text-rose-800" onOpen={() => navigate('kanbunHome')} action="漢文" />
          </div>
        </section>

        <Button full variant="secondary" onClick={() => navigate('progress')}>
          <Chart size={17} /> 成績分析票と全進捗を見る
        </Button>
      </div>
    </div>
  )
}
