import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getWord } from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { PosBadge } from '../components/WordBits.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { Book, Cards, Bookmark, BookmarkFilled, Check, ArrowRight } from '../components/Icons.jsx'

export function ReadingSummaryScreen() {
  const passageId = useStore((s) => s.params.passageId)
  const navigate = useStore((s) => s.navigate)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const addManyToMyList = useStore((s) => s.addManyToMyList)
  const markReadingDone = useStore((s) => s.markReadingDone)

  const passage = getPassage(passageId)
  const [savedAll, setSavedAll] = useState(false)

  // この長文を読了にする
  useEffect(() => {
    if (passageId) markReadingDone(passageId)
  }, [passageId, markReadingDone])

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
  const allSaved = ids.every((id) => myList.includes(id))

  return (
    <div className="pb-6">
      <ScreenHeader title="長文のまとめ" subtitle={passage.titleJa} />

      <div className="space-y-4 px-4">
        <Card className="p-4 text-center">
          <div className="text-4xl">🎯</div>
          <h2 className="mt-1 font-display text-lg font-extrabold text-ink">この長文に出てきた単語</h2>
          <p className="text-sm font-bold text-ink/50">{words.length}語をまとめて覚えよう</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={() => navigate('vocabStudy', { source: { type: 'mylist', ids }, title: passage.title, mode: 'study' })}>
              <Book size={16} /> 覚える
            </Button>
            <Button variant="secondary" onClick={() => navigate('vocabQuiz', { source: { type: 'mylist', ids }, title: passage.title })}>
              <Cards size={16} /> クイズ
            </Button>
          </div>
          <Button
            full
            variant={allSaved || savedAll ? 'soft' : 'hint'}
            className="mt-2"
            disabled={allSaved}
            onClick={() => {
              addManyToMyList(ids)
              setSavedAll(true)
            }}
          >
            {allSaved || savedAll ? <><Check size={16} /> マイ単語に保存済み</> : <><Bookmark size={16} /> 全部マイ単語に保存</>}
          </Button>
        </Card>

        <div className="space-y-2">
          {words.map((w) => {
            const level = getLevel(w.level)
            const saved = myList.includes(w.id)
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
                <IconButton onClick={() => toggleMyList(w.id)} className={saved ? 'text-hint' : 'text-ink/30'} aria-label="マイ単語に保存">
                  {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
                </IconButton>
              </div>
            )
          })}
        </div>

        <Button full variant="ghost" onClick={() => navigate('reader', { passageId })}>
          もう一度読む
        </Button>
      </div>
    </div>
  )
}
