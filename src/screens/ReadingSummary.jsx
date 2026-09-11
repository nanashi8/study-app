import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { WordListSheet } from '../components/WordListSheet.jsx'
import { wordBookRef } from '../lib/wordBooks.js'
import { Book, Cards, Bookmark, BookmarkFilled, Check, ArrowRight } from '../components/Icons.jsx'

export function ReadingSummaryScreen() {
  const params = useStore((s) => s.params)
  const passageId = params.passageId
  const navigate = useStore((s) => s.navigate)
  const returnTo = useStore((s) => s.returnTo)
  const wordBookSets = useStore((s) => s.learningNotebook.sets)

  const passage = getPassage(passageId)
  // 単語帳を選ぶ窓で入れる語。{ ids, label }。1語でも全部でも同じ窓を使う。
  const [bookSheetWords, setBookSheetWords] = useState(null)

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
  const inWordBook = (id) => wordBookSets.some((set) => set.refs.includes(wordBookRef(id)))
  const allSaved = ids.length > 0 && ids.every(inWordBook)

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
            onClick={() => setBookSheetWords({ ids, label: `この長文の単語${ids.length}語` })}
            aria-haspopup="dialog"
            data-reading-summary-word-book
          >
            {allSaved
              ? <><Check size={16} /> 全部が単語帳に入っています（入れる冊を選ぶ）</>
              : <><Bookmark size={16} /> 全部を単語帳に入れる</>}
          </Button>
        </Card>

        <div className="space-y-2">
          {words.map((w) => {
            const level = getLevel(w.level)
            const saved = inWordBook(w.id)
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
                    <div className="truncate text-xs font-bold text-ink/55">{w.meaning}</div>
                  </div>
                  <span className="text-brand-300"><ArrowRight size={16} /></span>
                </button>
                <IconButton
                  onClick={() => setBookSheetWords({ ids: [w.id], label: w.word })}
                  className={saved ? 'text-hint' : 'text-ink/30'}
                  aria-haspopup="dialog"
                  aria-label={saved ? `${w.word}の単語帳を選ぶ（単語帳に入っています）` : `${w.word}を入れる単語帳を選ぶ`}
                >
                  {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                </IconButton>
              </div>
            )
          })}
        </div>

        <WordListSheet
          open={Boolean(bookSheetWords)}
          onClose={() => setBookSheetWords(null)}
          wordIds={bookSheetWords?.ids}
          wordLabel={bookSheetWords?.label}
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
