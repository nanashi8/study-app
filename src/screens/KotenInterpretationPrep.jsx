import { useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getKoten } from '../data/koten.js'
import { getKotenGrammar, KOTEN_GRAMMAR_CATEGORIES } from '../data/koten-grammar.js'
import { getKotenInterpretation } from '../data/koten-interpretations.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, Chip, cx, IconButton } from '../components/ui.jsx'
import {
  ArrowRight,
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  ChevronDown,
  ChevronUp,
} from '../components/Icons.jsx'

const uniqueById = (items) => [
  ...new Map(items.filter(Boolean).map((item) => [item.id, item])).values(),
]

export function KotenInterpretationPrepScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const wordList = useStore((state) => state.kotenWordList)
  const grammarList = useStore((state) => state.kotenGrammarList)
  const kotenSrs = useStore((state) => state.kotenSrs)
  const toggleWord = useStore((state) => state.toggleKotenWordList)
  const toggleGrammar = useStore((state) => state.toggleKotenGrammarList)
  const addWords = useStore((state) => state.addManyToKotenWordList)
  const addGrammar = useStore((state) => state.addManyToKotenGrammarList)
  const [tab, setTab] = useState('words')
  const [openGrammarId, setOpenGrammarId] = useState(null)

  const items = useMemo(
    () => (params.ids ?? []).slice(0, 12).map(getKotenInterpretation).filter(Boolean),
    [params.ids],
  )
  const words = useMemo(
    () => uniqueById(items.flatMap((item) => item.wordIds.map(getKoten))),
    [items],
  )
  const grammar = useMemo(
    () => uniqueById(items.flatMap((item) => item.grammarIds.map(getKotenGrammar))),
    [items],
  )
  const cultureItems = useMemo(
    () => [
      ...new Map(
        items.map((item) => [
          `${item.source}:${item.culture.title}`,
          {
            id: item.id,
            source: item.source,
            title: item.culture.title,
            body: item.culture.body,
          },
        ]),
      ).values(),
    ],
    [items],
  )

  if (!items.length) {
    return (
      <div>
        <ScreenHeader title="短文解釈の準備" />
        <div className="p-8 text-center font-bold text-ink/50">
          事前確認できる短文が見つかりませんでした。
        </div>
      </div>
    )
  }

  const wordIds = words.map((word) => word.id)
  const grammarIds = grammar.map((item) => item.id)
  const allWordsSaved = wordIds.length > 0 && wordIds.every((id) => wordList.includes(id))
  const allGrammarSaved =
    grammarIds.length > 0 && grammarIds.every((id) => grammarList.includes(id))
  const learnedWords = words.filter((word) => kotenSrs[word.id]).length

  const tabs = [
    { id: 'words', label: `単語 ${words.length}`, emoji: '📖' },
    { id: 'grammar', label: `文法 ${grammar.length}`, emoji: '🧩' },
    { id: 'culture', label: `常識 ${cultureItems.length}`, emoji: '🏯' },
  ]

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader
        title="短文解釈の準備"
        subtitle={params.title ?? '古典短文'}
        color="#d97706"
        right={<Chip color="#d97706">{items.length}問</Chip>}
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <section className="pb-4 pt-1">
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl">
              📜
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-xl font-extrabold leading-tight text-ink">
                解く前の3点チェック
              </h1>
              <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">
                出題される短文の単語・文法・背景だけを先に確認します。答えと現代語訳はまだ表示しません。
              </p>
            </div>
          </div>
        </section>

        <Card className="p-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { emoji: '📖', value: words.length, label: '重要語', color: '#0284c7' },
              { emoji: '🧩', value: grammar.length, label: '文法', color: '#d97706' },
              { emoji: '🏯', value: cultureItems.length, label: '古典常識', color: '#9333ea' },
            ].map((summary) => (
              <div key={summary.label} className="rounded-2xl bg-paper p-2.5">
                <div className="text-xl">{summary.emoji}</div>
                <div className="font-display text-xl font-extrabold" style={{ color: summary.color }}>
                  {summary.value}
                </div>
                <div className="text-[10px] font-extrabold text-ink/45">{summary.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              disabled={!words.length}
              onClick={() =>
                navigate('kotenStudy', {
                  ids: wordIds,
                  title: `${params.title ?? '短文解釈'}・重要語`,
                })
              }
            >
              <Book size={17} /> 単語カード
            </Button>
            <Button variant="secondary" onClick={() => setTab('grammar')}>
              <span aria-hidden="true">🧩</span> 文法を確認
            </Button>
          </div>
          <p className="mt-3 text-center text-[11px] font-bold text-ink/40">
            重要語は {learnedWords}/{words.length}語を学習済み
          </p>
        </Card>

        <div className="mt-4 grid grid-cols-3 rounded-2xl bg-amber-100 p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cx(
                'min-h-11 rounded-xl px-1.5 py-2 text-xs font-extrabold transition-colors',
                tab === item.id ? 'bg-white text-amber-800 shadow-sm' : 'text-amber-800/60',
              )}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.label}
            </button>
          ))}
        </div>

        {tab === 'words' && (
          <section className="mt-3">
            <Button
              full
              variant={allWordsSaved ? 'soft' : 'hint'}
              disabled={allWordsSaved}
              onClick={() => addWords(wordIds)}
            >
              {allWordsSaved ? (
                <>
                  <Check size={17} /> 全語を登録済み
                </>
              ) : (
                <>
                  <Bookmark size={17} /> 全語を登録単語に追加
                </>
              )}
            </Button>

            <div className="mt-3 space-y-2">
              {words.map((word) => {
                const saved = wordList.includes(word.id)
                const learned = Boolean(kotenSrs[word.id])
                return (
                  <div key={word.id} className="flex items-start gap-2 rounded-2xl bg-white p-3 shadow-sm">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-extrabold text-ink">{word.word}</span>
                        <Chip color="#d97706">{word.pos}</Chip>
                        {learned && <Check size={15} className="text-emerald-500" />}
                      </div>
                      {word.kana && word.kana !== word.word && (
                        <p className="mt-0.5 text-[11px] font-bold text-ink/35">{word.kana}</p>
                      )}
                      <p className="mt-1 text-sm font-bold leading-relaxed text-ink/60">
                        {word.meanings.join('・')}
                      </p>
                      {word.note && (
                        <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/40">{word.note}</p>
                      )}
                    </div>
                    <IconButton
                      onClick={() => toggleWord(word.id)}
                      className={saved ? 'text-amber-600' : 'text-ink/25'}
                      aria-label={saved ? `${word.word}を登録から外す` : `${word.word}を登録する`}
                      aria-pressed={saved}
                    >
                      {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                    </IconButton>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {tab === 'grammar' && (
          <section className="mt-3">
            <Button
              full
              variant={allGrammarSaved ? 'soft' : 'hint'}
              disabled={allGrammarSaved}
              onClick={() => addGrammar(grammarIds)}
            >
              {allGrammarSaved ? (
                <>
                  <Check size={17} /> 全項目を登録済み
                </>
              ) : (
                <>
                  <Bookmark size={17} /> 全項目を登録文法に追加
                </>
              )}
            </Button>

            <div className="mt-3 space-y-2">
              {grammar.map((item) => {
                const saved = grammarList.includes(item.id)
                const open = openGrammarId === item.id
                const category = KOTEN_GRAMMAR_CATEGORIES.find(
                  (meta) => meta.id === item.category,
                )
                return (
                  <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="flex items-center gap-2 p-3">
                      <button
                        onClick={() => setOpenGrammarId(open ? null : item.id)}
                        aria-expanded={open}
                        className="min-w-0 flex-1 text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-sm font-extrabold text-ink">
                            {item.title}
                          </span>
                          {category && <Chip color={category.color}>{category.label}</Chip>}
                        </div>
                        <p className="mt-1 text-xs font-bold text-ink/55">{item.meaning}</p>
                      </button>
                      <IconButton
                        onClick={() => toggleGrammar(item.id)}
                        className={saved ? 'text-amber-600' : 'text-ink/25'}
                        aria-label={saved ? `${item.title}を登録から外す` : `${item.title}を登録する`}
                        aria-pressed={saved}
                      >
                        {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                      </IconButton>
                      <button
                        onClick={() => setOpenGrammarId(open ? null : item.id)}
                        aria-label={open ? '説明を閉じる' : '説明を開く'}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/35 active:bg-paper"
                      >
                        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                    {open && (
                      <div className="space-y-2 border-t border-amber-100 bg-amber-50/60 p-4 animate-slide-up">
                        <p className="text-xs font-extrabold text-amber-700">
                          接続：{item.connection}
                        </p>
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
          </section>
        )}

        {tab === 'culture' && (
          <section className="mt-3 space-y-2">
            {cultureItems.map((item) => (
              <div key={`${item.id}:${item.title}`} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xl">🏯</span>
                  <h2 className="font-display flex-1 font-extrabold text-purple-950">{item.title}</h2>
                  <Chip color="#9333ea">{item.source}</Chip>
                </div>
                <p className="mt-2 text-sm font-bold leading-relaxed text-ink/60">{item.body}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="shrink-0 border-t border-amber-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button
          full
          size="lg"
          onClick={() =>
            navigate('kotenInterpretationQuiz', {
              ids: items.map((item) => item.id),
              title: params.title,
            })
          }
        >
          問題を解く <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
