import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { NormalLearningRecordList } from '../components/NormalLearningRecordList.jsx'
import { Card, Button, cx } from '../components/ui.jsx'
import { useWordBookSlot, wordBookSlotButtonText, wordBookSlotLabel } from '../components/WordBookSlot.jsx'
import { wordBookRef } from '../lib/wordBooks.js'
import { Book, Cards, Bookmark, BookmarkFilled, Check } from '../components/Icons.jsx'

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

        {/* 単語の一覧の確認と同じ共通の一覧。左で覚えた（正解）、右でまだ（不正解）を単語の記録へ書き、その行を隠す。 */}
        <NormalLearningRecordList
          entryId={`reading-summary:${passageId}`}
          contentId="vocab"
          items={words}
          unit="語"
          pageSize={Math.max(words.length, 1)}
          titleLanguage="en"
          onOpen={(item) => navigate('wordDetail', { id: item.id })}
          openLabel="この単語の詳細を見る"
          openHint="詳細"
          badgeFor={(item) => <WordLevelBadge word={item} />}
          actionsFor={(item) => <WordRowActions word={item} />}
          emptyMessage="この長文に出てきた単語はありません。"
        />

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

// 行の見出しの行（品詞の隣）に置く級の印。行そのものが button なので、押せない span で出す。
function WordLevelBadge({ word }) {
  const level = getLevel(word.level)
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-extrabold"
      style={{ backgroundColor: `${level.color}1a`, color: level.color }}
      data-reading-summary-word-level={word.id}
    >
      {level.label}
    </span>
  )
}

// 行のカードの右下に置く、発音と単語帳のボタン。行と一緒に横へ動く。
function WordRowActions({ word }) {
  return (
    <span className="flex items-center gap-0.5" data-reading-summary-word-actions={word.id}>
      <SpeakButton text={word.word} size="sm" />
      <WordRowBookButton word={word} />
    </span>
  )
}

// 1語の単語帳ボタン。画面下部の「単語帳」で選んだ登録先に入れる（もう一度押すと外す）。
function WordRowBookButton({ word }) {
  const wordBook = useWordBookSlot([wordBookRef(word.id)], { label: word.word })
  return (
    <button
      type="button"
      onClick={wordBook.press}
      className={cx(
        'inline-flex h-8 w-8 items-center justify-center rounded-full transition-transform active:scale-90 active:bg-brand-100',
        wordBook.inBook ? 'text-hint' : 'text-ink/30',
      )}
      aria-pressed={wordBook.inBook}
      aria-label={wordBookSlotLabel({ itemLabel: word.word, bookTitle: wordBook.bookTitle, inBook: wordBook.inBook })}
    >
      {wordBook.inBook ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
    </button>
  )
}
