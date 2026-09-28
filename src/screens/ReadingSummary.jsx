import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { useWordBookSlot, wordBookSlotButtonText, wordBookSlotLabel } from '../components/WordBookSlot.jsx'
import { wordBookRef } from '../lib/wordBooks.js'
import { Book, Cards, Bookmark, BookmarkFilled, Check, ArrowRight } from '../components/Icons.jsx'
import { MeaningText } from '../components/MeaningText.jsx'

export function ReadingSummaryScreen() {
  const params = useStore((s) => s.params)
  const passageId = params.passageId
  const navigate = useStore((s) => s.navigate)
  const returnTo = useStore((s) => s.returnTo)
  const passage = getPassage(passageId)
  // この長文の単語は、画面下部の「単語帳」で選んだ登録先にまとめて入れる（全部入っていれば外す）。
  const summaryIds = (passage?.vocab ?? []).map(getWord).filter(Boolean).map((word) => word.id)
  const wordsBook = useWordBookSlot(summaryIds.map(wordBookRef), {
    label: `この長文の単語${summaryIds.length}語`,
  })

  if (!passage) {
    return (
      <div>
        <ScreenHeader title="まとめ" />
        <div className="p-8 text-center font-bold text-ink/50">長文が見つかりませんでした。</div>
      </div>
    )
  }

  const words = passage.vocab.map(getWord).filter(Boolean)
  const ids = words.map((w) => w.id)
  const allSaved = wordsBook.inBook

  return (
    <div className="pb-6">
      <ScreenHeader title="長文の単語まとめ" subtitle={passage.titleJa} />

      <div className="space-y-4 px-4">
        <Card className="p-4 text-center">
          <div className="text-4xl">🎯</div>
          <h2 className="mt-1 font-display text-lg font-extrabold text-ink">この長文に出てきた単語</h2>
          <p className="text-sm font-bold text-ink/50">{words.length}語をまとめて覚えよう</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => navigate('vocabStudy', { source: { type: 'mylist', ids }, title: passage.title, mode: 'study', returnTo: { screen: 'readingSummary', params: { passageId } } })}>
              <Book size={16} /> 暗記
            </Button>
            <Button variant="secondary" onClick={() => navigate('vocabQuiz', { source: { type: 'mylist', ids }, title: passage.title, returnTo: { screen: 'readingSummary', params: { passageId } } })}>
              <Cards size={16} /> テスト
            </Button>
          </div>
          <Button
            full
            variant={allSaved ? 'soft' : 'hint'}
            className="mt-2"
            disabled={!ids.length}
            onClick={wordsBook.press}
            aria-pressed={allSaved}
            data-reading-summary-word-book
          >
            {allSaved ? <Check size={16} /> : <Bookmark size={16} />}
            {wordBookSlotButtonText({ bookTitle: wordsBook.bookTitle, inBook: allSaved, what: `全${ids.length}語を` })}
          </Button>
        </Card>

        <div className="space-y-2">
          {words.map((w) => {
            const level = getLevel(w.level)
            return (
              <div key={w.id} className="flex items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm">
                <SpeakButton text={w.word} size="sm" />
                <button onClick={() => navigate('wordDetail', { id: w.id })} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <PosBadge pos={w.pos} />
                      <span className="font-display font-extrabold text-ink">{w.word}</span>
                      <Chip color={level.color}>{level.label}</Chip>
                    </div>
                    <div className="truncate text-xs font-bold text-ink/55"><MeaningText>{w.meaning}</MeaningText></div>
                  </div>
                  <span className="text-brand-300"><ArrowRight size={16} /></span>
                </button>
                <WordRowBookButton word={w} />
              </div>
            )
          })}
        </div>

        <Button full variant="ghost" onClick={() => navigate('reader', { passageId, returnTo: params.returnTo })}>
          もう一度読む
        </Button>
        {params.returnTo?.screen && (
          <Button
            full
            variant="secondary"
            onClick={() => returnTo(params.returnTo.screen, params.returnTo.params ?? {})}
          >
            教材一覧へ戻る
          </Button>
        )}
      </div>
    </div>
  )
}

// 1語の単語帳ボタン。画面下部の「単語帳」で選んだ登録先に入れる（もう一度押すと外す）。
function WordRowBookButton({ word }) {
  const wordBook = useWordBookSlot([wordBookRef(word.id)], { label: word.word })
  return (
    <IconButton
      onClick={wordBook.press}
      className={wordBook.inBook ? 'text-hint' : 'text-ink/30'}
      aria-pressed={wordBook.inBook}
      aria-label={wordBookSlotLabel({ itemLabel: word.word, bookTitle: wordBook.bookTitle, inBook: wordBook.inBook })}
    >
      {wordBook.inBook ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
    </IconButton>
  )
}
