import { useState, useMemo, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import {
  analyzePassageParagraphs,
  analyzeReadingSentence,
} from '../lib/reading-grammar.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { Close, SpeakerWave, ArrowRight, Lightbulb, Link, Bookmark, BookmarkFilled, BookOpen } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { ReadingComprehensionCheck } from '../components/ReadingComprehensionCheck.jsx'
import { ExtendedReader } from '../components/ExtendedReader.jsx'
import { ReadingSentenceDetail } from '../components/ReadingSentenceDetail.jsx'

export function ReaderScreen() {
  const params = useStore((s) => s.params)
  const passageId = params.passageId
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const settings = useStore((s) => s.settings)
  const myList = useStore((s) => s.myList)
  const toggleMyList = useStore((s) => s.toggleMyList)
  const recordVocabHistory = useStore((s) => s.recordVocabHistory)
  const passage = getPassage(passageId)

  const [showJa, setShowJa] = useState(false)
  const [showParagraphGuide, setShowParagraphGuide] = useState(false)
  const [activeIdx, setActiveIdx] = useState(null) // 詳細ウィンドウ対象の文
  const [activeWord, setActiveWord] = useState(null)
  const [readingChecked, setReadingChecked] = useState(false)
  const readingCheckRef = useRef(null)
  const sentenceSheetScrollRef = useRef(null)

  const sentenceAnalyses = useMemo(
    () => passage && !passage.extended
      ? passage.sentences.map((item) => analyzeReadingSentence(item))
      : [],
    [passage],
  )
  const paragraphGuides = useMemo(
    () => passage && !passage.extended ? analyzePassageParagraphs(passage) : [],
    [passage],
  )

  const paragraphs = useMemo(() => {
    if (passage?.extended) return []
    const groups = []
    for (const [index, item] of (passage?.sentences ?? []).entries()) {
      if (!groups.length || item.paragraphStart) groups.push([])
      groups.at(-1).push({ item, index })
    }
    return groups
  }, [passage])
  // 画面を離れたら必ず止める
  useEffect(() => dismissSpeechPlayer, [])

  if (!passage) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="absolute right-3 top-3">
          <SpeechSettingsButton compact />
        </div>
        <p className="font-bold text-ink/50">長文が見つかりませんでした。</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  if (passage.extended) return <ExtendedReader passage={passage} />

  const level = getLevel(passage.level)
  const sentence = activeIdx != null ? passage.sentences[activeIdx] : null
  const sentenceAnalysis = activeIdx != null ? sentenceAnalyses[activeIdx] : null

  const openSentence = (i) => {
    dismissSpeechPlayer()
    setActiveWord(null)
    if (sentenceSheetScrollRef.current) sentenceSheetScrollRef.current.scrollTop = 0
    setActiveIdx(i)
  }
  const tapToken = (tok) => {
    playSpeechItems([{ text: tok.word, label: tok.word, style: 'word' }], {
      title: '単語の読み上げ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
    const meaning = resolvePassageWord(tok.key, sentence?.gloss)
    if (meaning?.id) recordVocabHistory(meaning.id)
    setActiveWord({ word: tok.word, ja: meaning?.ja ?? null, id: meaning?.id ?? null })
  }
  const closeSentence = () => {
    dismissSpeechPlayer()
    setActiveIdx(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー */}
      <header
        className="flex items-center gap-1 px-2 py-2.5"
        style={{ background: `linear-gradient(to bottom, ${level.color}22, transparent)` }}
      >
        <IconButton onClick={back} aria-label="閉じる">
          <Close size={22} />
        </IconButton>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base font-extrabold text-ink">{passage.title}</h1>
          <p className="truncate text-xs font-bold text-ink/50">{passage.titleJa}</p>
        </div>
        <SpeechSettingsButton compact />
        <Chip color={level.color}>英検{level.label}</Chip>
      </header>

      {/* 操作バー */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2">
        <button
          onClick={() => navigate('readingPrep', { passageId, returnTo: params.returnTo })}
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <BookOpen size={14} /> 重要語・表現
        </button>
        <button
          onClick={() => navigate('readingRules')}
          className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700"
        >
          <Lightbulb size={14} /> 読解ルール
        </button>
        <button
          onClick={() => setShowJa((v) => !v)}
          aria-pressed={showJa}
          className={cx(
            'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            showJa ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          和訳 {showJa ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => setShowParagraphGuide((value) => !value)}
          aria-pressed={showParagraphGuide}
          className={cx(
            'rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            showParagraphGuide ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-700',
          )}
        >
          段落解説 {showParagraphGuide ? 'ON' : 'OFF'}
        </button>
        <button
          onClick={() => playSpeechItems(
            passage.sentences.map((item) => ({
              label: item.en,
              text: item.en,
              style: 'passage',
            })),
            {
              title: '長文・全文',
              rate: settings.ttsRate,
              voiceURI: settings.ttsVoiceURI,
              japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
              autoAdvance: true,
              pauseBetweenItemsMs: 250,
            },
          )}
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <SpeakerWave size={14} /> 全文を読み上げ
        </button>
      </div>

      {/* 本文 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {showParagraphGuide && (
          <section className="mb-3 border-y border-emerald-100 bg-emerald-50/70 px-3 py-3">
            <div className="mb-2 flex items-center gap-1.5 text-emerald-800">
              <BookOpen size={15} />
              <h2 className="text-xs font-extrabold">パラグラフリーディングの流れ</h2>
            </div>
            <div className="overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-1">
                {paragraphGuides.map((guide, index) => (
                  <div key={guide.index} className="flex items-center gap-1">
                    <div className="w-28 border border-emerald-200 bg-white px-2 py-1.5 text-center">
                      <div className="text-[10px] font-black text-emerald-600">P{index + 1}</div>
                      <div className="text-xs font-bold text-ink">{guide.role}</div>
                    </div>
                    {index < paragraphGuides.length - 1 && (
                      <ArrowRight size={15} className="shrink-0 text-emerald-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className="rounded-3xl bg-white p-5 shadow-card">
          <div className="space-y-6 text-lg leading-loose text-ink">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <section key={paragraphIndex}>
                <p>
                  {paragraph.map(({ item, index }) => (
                    <span key={index}>
                      <button
                        onClick={() => openSentence(index)}
                        className="rounded-md px-0.5 text-left transition-colors hover:bg-brand-50 active:bg-brand-100"
                      >
                        {item.en}
                      </button>{' '}
                    </span>
                  ))}
                </p>
                {showParagraphGuide && paragraphGuides[paragraphIndex] && (
                  <div className="mt-2 border-l-2 border-emerald-300 bg-emerald-50/60 px-3 py-2 text-sm leading-relaxed">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-black text-emerald-700">P{paragraphIndex + 1}</span>
                      <span className="font-extrabold text-ink">{paragraphGuides[paragraphIndex].role}</span>
                    </div>
                    <p className="mt-1 font-bold text-ink/70">
                      要旨：{paragraphGuides[paragraphIndex].summary}
                    </p>
                    <p className="mt-1 font-bold text-emerald-800">
                      前後関係：{paragraphGuides[paragraphIndex].connection}
                    </p>
                    <p className="mt-1 text-xs font-bold text-ink/55">
                      読み方：{paragraphGuides[paragraphIndex].strategy}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
          {showJa && (
            <div className="mt-4 space-y-3 border-t border-brand-100 pt-4 text-sm font-bold leading-relaxed text-ink/55">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph.map(({ item }) => item.ja).join(' ')}
                </p>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 px-1 text-center text-xs font-bold text-ink/40">
          一文をタップすると、英語と対応する日本語、SVOCM、文法上の注意を確認できます。
        </p>
        <div ref={readingCheckRef} className="mt-4 scroll-mt-3">
          <ReadingComprehensionCheck
            passageId={passageId}
            onStatusChange={setReadingChecked}
          />
        </div>
      </div>

      {/* フッター */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button
          full
          size="lg"
          onClick={() => {
            if (readingChecked) {
              navigate('readingSummary', { passageId, returnTo: params.returnTo })
              return
            }
            readingCheckRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        >
          {readingChecked ? '単語まとめへ' : '読解チェックへ'} <ArrowRight size={18} />
        </Button>
      </div>

      {/* 一文の詳細ウィンドウ */}
      <Sheet
        open={activeIdx != null}
        onClose={closeSentence}
        title="一文の構文解説"
        maxH="88vh"
        scrollAreaRef={sentenceSheetScrollRef}
        footer={sentence ? (
          <nav
            className="flex items-center justify-between gap-2"
            aria-label="文の移動"
            data-reading-sentence-navigation
          >
            <Button
              variant="secondary"
              size="sm"
              className="min-h-12"
              disabled={activeIdx === 0}
              onClick={() => openSentence(activeIdx - 1)}
            >
              ← 前の文
            </Button>
            <span className="text-xs font-bold text-ink/40" aria-live="polite">
              {activeIdx + 1}/{passage.sentences.length}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="min-h-12"
              disabled={activeIdx >= passage.sentences.length - 1}
              onClick={() => openSentence(activeIdx + 1)}
            >
              次の文 →
            </Button>
          </nav>
        ) : null}
      >
        <ReadingSentenceDetail
          sentence={sentence}
          sentenceAnalysis={sentenceAnalysis}
          activeWord={activeWord}
          onWordTap={tapToken}
          onNavigateAway={closeSentence}
        />
      </Sheet>
    </div>
  )
}
