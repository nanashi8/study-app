import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  etymologyCardsForWord,
  etymologyStoryForWord,
  getWord,
  neighborWords,
  vocabFieldFor,
} from '../data/vocab.js'
import { getLevel } from '../data/levels.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { EtymologyBlock, HomographWords, OtherSenses, RelatedWords, PosBadge } from '../components/WordBits.jsx'
import { PronunciationNote } from '../components/PronunciationNote.jsx'
import { exampleSpeechAllowed } from '../lib/speechGuard.js'
import { UsageGuideCards } from '../components/UsageGuideCards.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { MeaningText } from '../components/MeaningText.jsx'
import {
  AntonymSection,
  ConfusableSection,
  IdiomEquivalentSection,
  LoanwordHint,
  RelatedWordList,
  SynonymSection,
  UsagePartnerSection,
  WordFormSection,
} from '../components/WordRelations.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { Bookmark, BookmarkFilled, Link, Lightbulb } from '../components/Icons.jsx'
import { WordListSheet, useWordInAnyBook } from '../components/WordListSheet.jsx'
import { summarizeVocabularySrsItems } from '../lib/vocabScheduler.js'
import { wordRelationsFor } from '../lib/wordRelations.js'
import { StudyReviewHistory } from '../components/StudyReviewHistory.jsx'

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
  const [listSheetOpen, setListSheetOpen] = useState(false)
  const inWordBook = useWordInAnyBook(id)
  const entry = useStore((s) => s.srs[id])
  const word = getWord(id)

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
  const etymologyStory = etymologyStoryForWord(word)
  const relations = wordRelationsFor(word)
  const openWord = (wordId) => navigate('wordDetail', { id: wordId })

  return (
    <div className="flex h-full flex-col">
      <div ref={screenRef} className="min-h-0 flex-1 overflow-y-auto pb-4" data-return-scroll="word-detail">
        <ScreenHeader
          title={word.word}
          color={level.color}
          right={
            <IconButton
              onClick={() => setListSheetOpen(true)}
              className={inWordBook ? 'text-hint' : 'text-ink/30'}
              aria-label="単語帳に入れる"
              aria-haspopup="dialog"
            >
              {inWordBook ? <BookmarkFilled size={24} /> : <Bookmark size={24} />}
            </IconButton>
          }
        />

        <div className="space-y-4 px-4">
          {/* ヒーロー */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <PosBadge pos={word.pos} />
                <Chip color={level.color}>英検{level.label}</Chip>
                {word.field && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-100">
                    {vocabFieldFor(word)}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-end gap-3">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">{word.word}</h1>
              <SpeakButton text={word.word} size="md" className="mb-1" />
            </div>
            {word.phonetic && <p className="mt-1 text-sm font-bold text-ink/45">{word.phonetic}</p>}
            {/* 使い方で発音が変わる語の読み分け（この語は音声を出さない） */}
            <PronunciationNote word={word} className="mt-2" />
            <div className="mt-3 rounded-2xl bg-brand-50 p-3">
              <div className="font-display text-xl font-extrabold text-ink"><MeaningText>{word.meanings.join('・')}</MeaningText></div>
            </div>
            {/* 日本語に定着したカタカナ語。意味がずれる語は注意書きを添える。 */}
            <LoanwordHint hint={relations.loanword} className="mt-2" />
            <LearningStatusBars progress={progress} className="mt-4" compact units={{ learning: '語', quiz: '問' }} />
            <StudyReviewHistory entry={entry} className="mt-3 justify-start" />
          </Card>

          {/* 例文 */}
          {word.example && (
            <Card className="p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-400">例文</div>
              <div className="flex items-start gap-2">
                {exampleSpeechAllowed(word) && <SpeakButton text={word.example.en} size="sm" />}
                <div className="flex-1">
                  <p className="font-bold text-ink">{word.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">{word.example.ja}</p>
                </div>
              </div>
            </Card>
          )}

          {/* 使い方・使い分け＋派生語 */}
          {(word.usage || word.derivatives?.length > 0) && (
            <Card className="space-y-3 p-4">
              {word.usage && (
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-amber-600">
                    <Lightbulb size={16} />
                    <span className="text-[11px] font-extrabold uppercase tracking-wide">使い方・使い分け</span>
                  </div>
                  <p className="text-sm font-bold leading-relaxed text-amber-900/90">{word.usage}</p>
                </div>
              )}
              {word.derivatives?.length > 0 && (
                <div>
                  <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-500">派生語</div>
                  <RelatedWordList items={word.derivatives} tone="der" onWord={openWord} />
                </div>
              )}
            </Card>
          )}

          {/* 代表義以外の意味を、品詞と習う級つきで並べる */}
          <OtherSenses senses={word.otherSenses} level={word.level} />

          {/* 由来のちがう、同じつづりの別の語。それぞれの見出し語へ移れる。 */}
          <HomographWords word={word} onWord={openWord} />

          {/* 入試・英検で混同しやすい語の比較と推奨表現 */}
          <UsageGuideCards guides={word.usageGuides} />

          {/* 品詞がちがうだけで同じ語から来た形。発音を聞いて、その語の辞書ページへ移れる。 */}
          {relations.forms.length > 0 && (
            <Card className="p-4">
              <WordFormSection items={relations.forms} ownNote={relations.formOwnNote} onWord={openWord} />
            </Card>
          )}

          {/* 意味が同じ・近い語、同じ意味の熟語、反対・対照の語 */}
          {(relations.synonyms.length > 0 || relations.idioms.length > 0 || relations.antonyms.length > 0 || relations.usagePartners.length > 0) && (
            <Card className="space-y-3 p-4">
              <SynonymSection items={relations.synonyms} onWord={openWord} />
              <IdiomEquivalentSection phrases={relations.idioms} />
              <AntonymSection items={relations.antonyms} onWord={openWord} />
              <UsagePartnerSection items={relations.usagePartners} onWord={openWord} />
            </Card>
          )}

          {/* つづりが似ていて間違えやすい語。ちがう文字に色をつける。 */}
          {relations.confusables.length > 0 && (
            <Card className="p-4">
              <ConfusableSection word={word} items={relations.confusables} onWord={openWord} />
            </Card>
          )}

          {/* 手動監査を通った語源だけを表示する。語根カードが無い語も成り立ちは出す。 */}
          {(etymologyCards.length > 0 || etymologyStory) && (
            <Card className="p-4">
              <div className="mb-3 text-sm font-extrabold text-brand-600">語の成り立ち</div>
              <EtymologyBlock
                word={word}
                onRoot={(rootId) => navigate('rootDetail', { rootId })}
                onPack={(packId) => navigate('etymologyPack', { packId })}
              />
            </Card>
          )}

          {/* 監査済みカードに明記された関連語だけを表示する。 */}
          {etymologyCards.length > 0 && (
            <Card className="p-4">
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

          {/* 辞書の前後（隣の見出し語へ）。自作単語は辞書の並びに入らないので出さない。 */}
          {!word.custom && <NeighborList word={word} navigate={navigate} />}
        </div>
      </div>

      {/* 保存ボタン（本文の外に置き、末尾のカードへ重ならないようにする） */}
      <div className="shrink-0 space-y-2 border-t border-brand-100 bg-white/95 p-4 backdrop-blur">
        {/* 保存先は「単語帳」1つ。押すと入れる冊を選ぶ。 */}
        <Button
          full
          variant={inWordBook ? 'soft' : 'primary'}
          onClick={() => setListSheetOpen(true)}
          aria-haspopup="dialog"
        >
          {inWordBook ? <BookmarkFilled size={18} /> : <Bookmark size={18} />}
          {inWordBook ? '単語帳に入っています（入れる冊を選ぶ）' : '単語帳に入れる'}
        </Button>
      </div>

      <WordListSheet
        open={listSheetOpen}
        onClose={() => setListSheetOpen(false)}
        wordId={word.id}
        wordLabel={word.word}
      />
    </div>
  )
}
