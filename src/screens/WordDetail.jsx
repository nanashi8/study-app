import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useStore, useContentSettings } from '../store/useStore.js'
import {
  etymologyCardsForWord,
  getWord,
  neighborWords,
  vocabFieldFor,
} from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { RelatedWords } from '../components/WordBits.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { MeaningText } from '../components/MeaningText.jsx'
import { ExplanationScope } from '../components/ExplainedText.jsx'
import { RelatedWordList } from '../components/WordRelations.jsx'
import { WordStudyCard } from '../components/WordStudyCard.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { Bookmark, BookmarkFilled, Link } from '../components/Icons.jsx'
import { useWordBookSlot, wordBookSlotButtonText, wordBookSlotLabel } from '../components/WordBookSlot.jsx'
import { wordBookRef } from '../lib/wordBooks.js'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { wordRelationsFor } from '../lib/wordRelations.js'
import { phraseGroupsForWord } from '../lib/wordPhrases.js'
import { cardSpeechItems } from '../lib/cardSpeech.js'
import { exampleSpeechAllowed } from '../lib/speechGuard.js'

// 辞書の前後（アルファベット順で隣り合う見出し語）。ページをめくる感覚で移動。
function NeighborList({ word, navigate }) {
  const { prev, next } = neighborWords(word.id, 2, 2)
  const Row = ({ w, dir }) => {
    const lv = getLevel(w.level)
    return (
      <button
        onClick={() => navigate('wordDetail', { id: w.id })}
        className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left active:bg-brand-50"
      >
        <span className="w-4 shrink-0 text-center text-xs font-extrabold text-brand-300">
          {dir === 'prev' ? '↑' : '↓'}
        </span>
        <span className="font-display font-extrabold text-ink">{w.word}</span>
        <Chip color={lv.color}>{lv.label}</Chip>
        <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/45"><MeaningText>{w.meaning}</MeaningText></span>
      </button>
    )
  }
  return (
    <Card className="p-3">
      <div className="mb-1 px-1 text-[11px] font-extrabold uppercase tracking-wide text-ink/35">辞書の前後</div>
      <div className="divide-y divide-brand-50">
        {prev.map((w) => <Row key={w.id} w={w} dir="prev" />)}
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="w-4 shrink-0 text-center text-xs font-extrabold text-brand-400">●</span>
          <span className="font-display font-extrabold text-brand-600">{word.word}</span>
        </div>
        {next.map((w) => <Row key={w.id} w={w} dir="next" />)}
      </div>
    </Card>
  )
}

export function WordDetailScreen() {
  const screenRef = useRef(null)
  const id = useStore((s) => s.params.id)
  const navigate = useStore((s) => s.navigate)
  const recordVocabHistory = useStore((s) => s.recordVocabHistory)
  const entry = useStore((s) => s.srs[id])
  const settings = useContentSettings()
  const word = getWord(id)
  // 単語帳ボタンは、画面下部の「単語帳」で選んだ登録先に入れる・外す。
  const wordBook = useWordBookSlot(word ? [wordBookRef(word.id)] : [], { label: word?.word })
  const inWordBook = wordBook.inBook
  const relations = useMemo(() => (word ? wordRelationsFor(word) : null), [word?.id])
  const relatedPhrases = useMemo(() => (word ? phraseGroupsForWord(word) : null), [word?.id])

  useEffect(() => {
    if (word) recordVocabHistory(word.id)
  }, [recordVocabHistory, word])

  // 別の語へ移ったら先頭から。描く前に戻すので、履歴で戻ったときは AppShell が離れたときの位置へ置き直す。
  useLayoutEffect(() => {
    screenRef.current?.scrollTo({ top: 0 })
  }, [word?.id])

  if (!word) {
    return (
      <div>
        <ScreenHeader title="単語" />
        <div className="p-8 text-center font-bold text-ink/50">単語が見つかりませんでした。</div>
      </div>
    )
  }

  const level = getLevel(word.level)
  const progress = summarizeVocabularySrsItems([word], entry ? { [word.id]: entry } : {})
  const etymologyCards = etymologyCardsForWord(word)
  // 派生語欄は、形の欄に出す語を除いたもの（wordRelationsFor）。自作単語の派生語はカードの中に出る。
  const derivatives = word.custom ? [] : relations.derivatives
  const openWord = (wordId) => navigate('wordDetail', { id: wordId })
  const returnTo = { screen: 'wordDetail', params: { id: word.id } }
  // 暗記カードと同じ読み上げ列。辞書ページでは開いた面を見ているので、意味・例文まで範囲どおりに読む。
  const speechKey = `detail:${word.id}`
  const speechItems = cardSpeechItems({
    id: word.id,
    head: word.word,
    meanings: word.meanings,
    meaningReadings: true,
    example: word.example,
    exampleSpeech: exampleSpeechAllowed(word),
    range: settings.speechRange,
    answerOpen: true,
  })

  return (
    <div className="flex h-full flex-col">
      <div ref={screenRef} className="min-h-0 flex-1 overflow-y-auto pb-4" data-return-scroll="word-detail">
        <ScreenHeader
          title={word.word}
          color={level.color}
          right={
            <IconButton
              onClick={wordBook.press}
              className={inWordBook ? 'text-hint' : 'text-ink/30'}
              aria-pressed={inWordBook}
              aria-label={wordBookSlotLabel({ itemLabel: word.word, bookTitle: wordBook.bookTitle, inBook: inWordBook })}
              data-word-detail-word-book
            >
              {inWordBook ? <BookmarkFilled size={24} /> : <Bookmark size={24} />}
            </IconButton>
          }
        />

        <div className="space-y-4 px-4">
          {/* 暗記カードと同じカード（WordStudyCard）を、開いた面で出す。見慣れた並びで確かめられるように。
              辞書ページは調べる画面なので、発音記号はいつも出す（部品の既定）。 */}
          <WordStudyCard
            key={word.id}
            word={word}
            entry={entry}
            flipped
            speechItems={speechItems}
            speechKey={speechKey}
            relations={relations}
            relatedPhrases={relatedPhrases}
            openWord={openWord}
            navigateTo={navigate}
            returnTo={returnTo}
            onPack={(packId) => navigate('etymologyPack', { packId })}
          />

          <ExplanationScope selfId={word.id} onWord={openWord}>
          {/* この語の分野（暗記カードには出さない）と、学習とテストの進み具合 */}
          <Card className="p-4">
            {word.field && (
              <div className="mb-3 flex items-center gap-2" data-word-detail-field>
                <span className="text-[11px] font-extrabold text-ink/40">分野</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                  {vocabFieldFor(word)}
                </span>
              </div>
            )}
            <LearningStatusBars progress={progress} compact units={{ learning: '語', quiz: '問' }} />
          </Card>

          {/* 同じ語から作られた派生語（形の欄に出す語を除く） */}
          {derivatives.length > 0 && (
            <Card className="mt-4 p-4">
              <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-500">派生語</div>
              <RelatedWordList items={derivatives} tone="der" onWord={openWord} />
            </Card>
          )}

          {/* 監査済みカードに明記された関連語だけを表示する。 */}
          {etymologyCards.length > 0 && (
            <Card className="mt-4 p-4">
              <div className="mb-3 flex items-center gap-1.5 text-brand-600">
                <Link size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">この語源から増やせる単語</span>
              </div>
              <RelatedWords
                word={word}
                onPick={(wid) => navigate('wordDetail', { id: wid })}
                onRoot={(rootId) => navigate('rootDetail', { rootId })}
              />
            </Card>
          )}
          </ExplanationScope>

          {/* 辞書の前後（隣の見出し語へ）。自作単語は辞書の並びに入らないので出さない。 */}
          {!word.custom && <NeighborList word={word} navigate={navigate} />}
        </div>
      </div>

      {/* 保存ボタン（本文の外に置き、末尾のカードへ重ならないようにする） */}
      <div className="shrink-0 space-y-2 border-t border-brand-100 bg-white/95 p-4 backdrop-blur">
        {/* 押すと、画面下部の「単語帳」で選んだ登録先に入れる（もう一度押すと外す）。 */}
        <Button
          full
          variant={inWordBook ? 'soft' : 'primary'}
          onClick={wordBook.press}
          aria-pressed={inWordBook}
        >
          {inWordBook ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
          {wordBookSlotButtonText({ bookTitle: wordBook.bookTitle, inBook: inWordBook })}
        </Button>
      </div>

    </div>
  )
}
