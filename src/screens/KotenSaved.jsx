import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten } from '../data/koten.js'
import { getKotenGrammar, KOTEN_GRAMMAR_CATEGORIES } from '../data/koten-grammar.js'
import {
  KOTEN_INTERPRETATIONS,
  pickKotenInterpretationIds,
} from '../data/koten-interpretations.js'
import { Button, Chip, cx, EmptyState, IconButton } from '../components/ui.jsx'
import {
  Book,
  BookmarkFilled,
  Cards,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
} from '../components/Icons.jsx'

export function KotenSavedScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const wordIds = useStore((state) => state.kotenWordList)
  const grammarIds = useStore((state) => state.kotenGrammarList)
  const toggleWord = useStore((state) => state.toggleKotenWordList)
  const toggleGrammar = useStore((state) => state.toggleKotenGrammarList)
  const [tab, setTab] = useState(params.tab === 'grammar' ? 'grammar' : 'words')
  const [openId, setOpenId] = useState(null)

  const words = wordIds.map(getKoten).filter(Boolean)
  const grammar = grammarIds.map(getKotenGrammar).filter(Boolean)
  const relatedQuestionIds = useMemo(() => {
    const ids = new Set(grammar.map((item) => item.id))
    return KOTEN_INTERPRETATIONS
      .filter((item) => item.grammarIds.some((id) => ids.has(id)))
      .map((item) => item.id)
  }, [grammar])

  return (
    <div className="pb-7">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 px-5 pb-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={() => navigate('kotenList')}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 transition-transform active:scale-95"
        >
          <ChevronLeft size={14} /> 古典アプリ
        </button>
        <p className="text-xs font-bold text-white/75">あとで何度でも見直せる</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典の登録リスト</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          登録単語 {words.length}語・登録文法 {grammar.length}項目
        </p>
      </div>

      <div className="px-4 pt-5">
        <div className="grid grid-cols-2 rounded-2xl bg-amber-100 p-1">
          <button
            onClick={() => setTab('words')}
            className={cx(
              'rounded-xl px-3 py-2.5 text-sm font-extrabold transition-colors',
              tab === 'words' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-800/55',
            )}
          >
            📖 登録単語 {words.length}
          </button>
          <button
            onClick={() => setTab('grammar')}
            className={cx(
              'rounded-xl px-3 py-2.5 text-sm font-extrabold transition-colors',
              tab === 'grammar' ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-800/55',
            )}
          >
            🧩 登録文法 {grammar.length}
          </button>
        </div>

        {tab === 'words' && (
          <div className="mt-4">
            {!words.length ? (
              <EmptyState icon="🔖" title="登録単語はまだありません">
                単語カードや短文解釈の答え合わせにある「登録」を押すと、ここへ集められます。
              </EmptyState>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() =>
                      navigate('kotenStudy', {
                        ids: words.map((word) => word.id),
                        title: '登録単語',
                      })
                    }
                  >
                    <Book size={16} /> 覚える
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      navigate('kotenQuiz', {
                        ids: words.map((word) => word.id),
                        title: '登録単語',
                      })
                    }
                  >
                    <Cards size={16} /> クイズ
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {words.map((word) => (
                    <div key={word.id} className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-extrabold text-ink">{word.word}</span>
                          <Chip color="#d97706">{word.pos}</Chip>
                        </div>
                        {word.kana && word.kana !== word.word && (
                          <p className="mt-0.5 text-[11px] font-bold text-ink/35">{word.kana}</p>
                        )}
                        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                          {word.meanings.join('・')}
                        </p>
                      </div>
                      <IconButton
                        onClick={() => toggleWord(word.id)}
                        className="text-amber-600"
                        aria-label={`${word.word}を登録単語から外す`}
                      >
                        <BookmarkFilled size={20} />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'grammar' && (
          <div className="mt-4">
            {!grammar.length ? (
              <EmptyState icon="🧩" title="登録文法はまだありません">
                古典文法の一覧や短文解釈の答え合わせから、覚えたい文法を登録できます。
              </EmptyState>
            ) : (
              <>
                <Button
                  full
                  disabled={!relatedQuestionIds.length}
                  onClick={() =>
                    navigate('kotenInterpretationPrep', {
                      ids: pickKotenInterpretationIds(relatedQuestionIds),
                      title: '登録文法の短文',
                    })
                  }
                >
                  <Cards size={17} /> 登録文法が出る短文を解く（{relatedQuestionIds.length}問）
                </Button>

                <div className="mt-4 space-y-2">
                  {grammar.map((item) => {
                    const open = openId === item.id
                    const category = KOTEN_GRAMMAR_CATEGORIES.find((meta) => meta.id === item.category)
                    return (
                      <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                        <div className="flex items-center gap-2 p-3">
                          <button
                            onClick={() => setOpenId(open ? null : item.id)}
                            aria-expanded={open}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display text-sm font-extrabold text-ink">{item.title}</span>
                              {category && <Chip color={category.color}>{category.label}</Chip>}
                            </div>
                            <p className="mt-1 text-xs font-bold text-ink/55">{item.meaning}</p>
                          </button>
                          <IconButton
                            onClick={() => toggleGrammar(item.id)}
                            className="text-amber-600"
                            aria-label={`${item.title}を登録文法から外す`}
                          >
                            <BookmarkFilled size={20} />
                          </IconButton>
                          <button
                            onClick={() => setOpenId(open ? null : item.id)}
                            aria-label={open ? '説明を閉じる' : '説明を開く'}
                            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/35 active:bg-paper"
                          >
                            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </div>
                        {open && (
                          <div className="space-y-2 border-t border-amber-100 bg-amber-50/60 p-4 animate-slide-up">
                            <p className="text-xs font-extrabold text-amber-700">接続：{item.connection}</p>
                            <p className="text-sm font-bold leading-relaxed text-ink/65">{item.summary}</p>
                            <div className="rounded-2xl bg-white p-3">
                              <p className="font-serif font-bold text-ink">{item.example.ja}</p>
                              <p className="mt-1 text-xs font-bold text-ink/50">{item.example.gendai}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            <button
              onClick={() => navigate('kotenGrammar')}
              className="mt-4 w-full rounded-2xl bg-amber-100 px-4 py-3 text-sm font-extrabold text-amber-800 active:bg-amber-200"
            >
              古典文法の一覧から登録する
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
