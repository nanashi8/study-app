import { useStore } from '../store/useStore.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Button, Chip, EmptyState, IconButton } from '../components/ui.jsx'
import { Book, Cards, BookmarkFilled, ArrowRight, Lightbulb } from '../components/Icons.jsx'

export function MyListScreen() {
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const myGrammarList = useStore((s) => s.myGrammarList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const words = myList.map(getWord).filter(Boolean)

  return (
    <div className="pb-6">
      <ScreenHeader title="マイ単語リスト" subtitle={`${words.length}語を保存中`} />

      <div className="px-4">
        <button
          onClick={() => navigate('vocabCamera')}
          className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-brand-600 p-3.5 text-left text-white shadow-card active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-xl">
            📷
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-extrabold">教科書から単語を追加</p>
            <p className="text-xs font-bold text-white/70">
              写真から英単語を読み取り、意味を確認して保存
            </p>
          </div>
          <ArrowRight size={19} />
        </button>

        <button
          onClick={() => navigate('myGrammar')}
          className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-brand-600 p-3.5 text-left text-white shadow-card active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Lightbulb size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-extrabold">マイ文法</p>
            <p className="text-xs font-bold text-white/70">
              英作文から保存した {myGrammarList.length} 項目を復習
            </p>
          </div>
          <ArrowRight size={19} />
        </button>

        {words.length === 0 ? (
          <EmptyState icon="🔖" title="まだ保存した単語はありません">
            単語の詳細画面やカードの🔖ボタンから、覚えたい単語をここに保存できます。長文に出てきた単語もここに集まります。
          </EmptyState>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate('vocabStudy', { source: { type: 'mylist', ids: myList }, title: 'マイ単語', mode: 'study' })}
              >
                <Book size={16} /> 覚える
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('vocabQuiz', { source: { type: 'mylist', ids: myList }, title: 'マイ単語' })}
              >
                <Cards size={16} /> クイズ
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {words.map((w) => {
                const level = getLevel(w.level)
                return (
                  <div
                    key={w.id}
                    className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm"
                  >
                    <SpeakButton text={w.word} size="sm" />
                    <button
                      onClick={() => navigate('wordDetail', { id: w.id })}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-extrabold text-ink">{w.word}</span>
                          <Chip color={level.color}>{level.label}</Chip>
                        </div>
                        <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                      </div>
                    </button>
                    <IconButton
                      onClick={() => toggleMyList(w.id)}
                      className="text-hint"
                      aria-label="マイ単語から外す"
                    >
                      <BookmarkFilled size={20} />
                    </IconButton>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
