import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getWord } from '../data/vocab.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import { dismissSpeechPlayer, playSpeechItems } from '../lib/speech-player.js'
import { ReadingComprehensionCheck } from './ReadingComprehensionCheck.jsx'
import { Sheet } from './Sheet.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { SpeechSettingsButton } from './SpeechSettings.jsx'
import { Button, Chip, IconButton, cx } from './ui.jsx'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Close,
  Lightbulb,
  Link,
  SpeakerWave,
} from './Icons.jsx'

const TOKEN_PATTERN = /[A-Za-z]+(?:['’][A-Za-z]+)*|[^A-Za-z]+/g
const WORD_PATTERN = /^[A-Za-z]+(?:['’][A-Za-z]+)*$/
const normalizedToken = (token) => token.toLowerCase().replace('’', "'")
const sectionStorageKey = (passageId) => `study-app:extended-reading-section:v1:${passageId}`

function storedSectionIndex(passage) {
  if (typeof sessionStorage === 'undefined') return 0
  try {
    const parsed = Number(sessionStorage.getItem(sectionStorageKey(passage.id)))
    return Number.isInteger(parsed) && parsed >= 0 && parsed < passage.sections.length ? parsed : 0
  } catch {
    return 0
  }
}

function saveSectionIndex(passageId, sectionIndex) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(sectionStorageKey(passageId), String(sectionIndex))
  } catch {
    // 保存領域を使えない環境でも、読解自体は続ける。
  }
}

function paragraphGroups(sentences) {
  const groups = []
  for (const sentence of sentences) {
    if (!groups.length || sentence.paragraphStart) groups.push([])
    groups.at(-1).push(sentence)
  }
  return groups
}

function TappableSentence({ sentence, onWord }) {
  const parts = sentence.en.match(TOKEN_PATTERN) ?? [sentence.en]
  return (
    <span className={sentence.source === 'editorial-transition' ? 'font-extrabold text-ink' : ''}>
      {parts.map((part, index) => {
        if (!WORD_PATTERN.test(part)) return <span key={`${index}:${part}`}>{part}</span>
        const resolved = resolvePassageWord(normalizedToken(part), sentence.gloss)
        const target = Boolean(sentence.targetId && resolved?.id === sentence.targetId)
        if (!target) return <span key={`${index}:${part}`}>{part}</span>
        return (
          <button
            key={`${index}:${part}`}
            type="button"
            onClick={() => onWord(part, resolved)}
            className={cx(
              'inline rounded px-0.5 text-left font-[inherit] leading-[inherit] transition-colors active:bg-brand-100',
              'bg-amber-100 font-extrabold text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-2',
            )}
            data-extended-reading-word={resolved?.id ?? ''}
            data-target-vocabulary={target ? 'true' : 'false'}
            aria-label={`${part}${resolved?.ja ? `、${resolved.ja}` : ''}`}
          >
            {part}
          </button>
        )
      })}
      {' '}
    </span>
  )
}

export function ExtendedReader({ passage }) {
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const settings = useStore((state) => state.settings)
  const myList = useStore((state) => state.myList)
  const toggleMyList = useStore((state) => state.toggleMyList)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)
  const [sectionIndex, setSectionIndex] = useState(() => storedSectionIndex(passage))
  const [showJa, setShowJa] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [readingChecked, setReadingChecked] = useState(false)
  const scrollRef = useRef(null)
  const readingCheckRef = useRef(null)
  const level = getLevel(passage.level)
  const section = passage.sections[sectionIndex]
  const paragraphs = useMemo(() => paragraphGroups(section.sentences), [section])
  const finalSection = sectionIndex === passage.sections.length - 1
  const progress = (sectionIndex + 1) / passage.sections.length

  useEffect(() => dismissSpeechPlayer, [])

  useEffect(() => {
    saveSectionIndex(passage.id, sectionIndex)
  }, [passage.id, sectionIndex])

  const moveToSection = (nextIndex) => {
    const bounded = Math.max(0, Math.min(passage.sections.length - 1, nextIndex))
    dismissSpeechPlayer()
    setActiveWord(null)
    setSectionIndex(bounded)
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  const openWord = (surface, resolved) => {
    playSpeechItems([{ text: surface, label: surface, style: 'word' }], {
      title: '単語の読み上げ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
    if (resolved?.id) recordVocabHistory(resolved.id)
    const dictionaryWord = resolved?.id ? getWord(resolved.id) : null
    setActiveWord({
      surface,
      id: resolved?.id ?? null,
      ja: dictionaryWord?.meaning ?? resolved?.ja ?? null,
      dictionaryWord,
    })
  }

  const speakSection = () => {
    playSpeechItems(section.sentences.map((sentence) => ({
      label: sentence.en,
      text: sentence.en,
      style: 'passage',
    })), {
      title: `${sectionIndex + 1}. ${section.titleJa}`,
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
      pauseBetweenItemsMs: 180,
    })
  }

  return (
    <div
      className="flex h-full flex-col"
      data-extended-reading={passage.id}
      data-extended-reading-target-words={passage.targetWords}
    >
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
        <Chip color={level.color} className="shrink-0">約{passage.targetWords.toLocaleString()}語</Chip>
      </header>

      <div className="px-4 pb-2">
        <div className="h-2 overflow-hidden rounded-full bg-brand-100" aria-hidden="true">
          <div
            className="h-full rounded-full bg-brand-500 transition-[width]"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] font-extrabold text-ink/45">
          <span>節 {sectionIndex + 1}/{passage.sections.length}</span>
          <span>本文 {passage.actualWords.toLocaleString()}語・重点語 {passage.vocab.length.toLocaleString()}語</span>
        </div>
      </div>

      <nav
        className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-2"
        aria-label="節を選ぶ"
        data-extended-reading-section-tabs
      >
        {passage.sections.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => moveToSection(index)}
            aria-current={index === sectionIndex ? 'step' : undefined}
            className={cx(
              'min-h-11 shrink-0 rounded-full px-3 py-2 text-xs font-extrabold',
              index === sectionIndex ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700',
            )}
          >
            {index + 1}. {item.titleJa}
          </button>
        ))}
      </nav>

      <div className="flex flex-wrap items-center gap-2 px-4 pb-2">
        <button
          type="button"
          onClick={() => navigate('readingPrep', { passageId: passage.id })}
          className="flex min-h-10 items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <BookOpen size={14} /> 重要語・表現
        </button>
        <button
          type="button"
          onClick={() => navigate('readingRules')}
          className="flex min-h-10 items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-extrabold text-sky-700"
        >
          <Lightbulb size={14} /> 読解ルール
        </button>
        <button
          type="button"
          onClick={() => setShowJa((value) => !value)}
          aria-pressed={showJa}
          className={cx(
            'min-h-10 rounded-full px-3 py-1.5 text-xs font-extrabold',
            showJa ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          和訳 {showJa ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          onClick={speakSection}
          className="flex min-h-10 items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <SpeakerWave size={14} /> この節を聴く
        </button>
      </div>

      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <section className="rounded-2xl border border-brand-100 bg-brand-50/70 p-3">
          <p className="text-[10px] font-extrabold text-brand-600">語彙強化ロングリーディング</p>
          <h2 lang="en" className="mt-0.5 font-display text-xl font-extrabold text-ink">{section.title}</h2>
          <p className="mt-0.5 text-sm font-extrabold text-ink/65">{section.titleJa}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold text-ink/55">
            <span>この節 {section.wordCount}語</span>
            <span>・ 重点語 {section.targetVocabularyIds.length}語</span>
          </div>
          <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
            最初の主題文で読み方を定め、その後の関連語彙事例を順に読みます。
            黄色の重点語を押すと、監査済みの意味と音声を確認できます。
          </p>
        </section>

        <article className="mt-3 rounded-3xl bg-white p-5 shadow-card" lang="en">
          <div className="space-y-5 text-[17px] leading-[2.05] text-ink">
            {paragraphs.map((paragraph, paragraphIndex) => (
              <section key={`${section.id}:${paragraphIndex}`} data-extended-reading-paragraph>
                <p>
                  {paragraph.map((sentence) => (
                    <TappableSentence
                      key={sentence.reviewId}
                      sentence={sentence}
                      onWord={openWord}
                    />
                  ))}
                </p>
                {showJa && (
                  <p
                    lang="ja"
                    className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-3 py-2 text-sm font-bold leading-relaxed text-amber-950"
                  >
                    {paragraph.map((sentence) => sentence.ja).join(' ')}
                  </p>
                )}
              </section>
            ))}
          </div>
        </article>

        {finalSection && (
          <div ref={readingCheckRef} className="mt-4 scroll-mt-3">
            <ReadingComprehensionCheck
              passageId={passage.id}
              onStatusChange={setReadingChecked}
            />
          </div>
        )}
      </main>

      <footer
        className="shrink-0 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur"
        data-reading-section-navigation
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="min-h-12"
            disabled={sectionIndex === 0}
            onClick={() => moveToSection(sectionIndex - 1)}
          >
            <ChevronLeft size={18} /> 前の節
          </Button>
          <span className="whitespace-nowrap text-xs font-extrabold text-ink/45" aria-live="polite">
            {sectionIndex + 1}/{passage.sections.length}
          </span>
          {finalSection ? (
            <Button
              size="sm"
              className="min-h-12"
              onClick={() => {
                if (readingChecked) {
                  navigate('readingSummary', { passageId: passage.id })
                  return
                }
                readingCheckRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {readingChecked ? '単語まとめ' : '読解チェック'} <ArrowRight size={17} />
            </Button>
          ) : (
            <Button
              size="sm"
              className="min-h-12"
              onClick={() => moveToSection(sectionIndex + 1)}
            >
              次の節 <ChevronRight size={18} />
            </Button>
          )}
        </div>
      </footer>

      <Sheet
        open={Boolean(activeWord)}
        onClose={() => setActiveWord(null)}
        title="単語の意味"
      >
        {activeWord && (
          <div className="space-y-4 pb-3">
            <div className="rounded-2xl bg-brand-50 p-4">
              <div className="flex items-center gap-3">
                <SpeakButton text={activeWord.surface} size="sm" />
                <div className="min-w-0 flex-1">
                  <p lang="en" className="font-display text-xl font-extrabold text-ink">
                    {activeWord.surface}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-relaxed text-ink/65">
                    {activeWord.ja ?? 'この語の発音を確認できます。'}
                  </p>
                </div>
              </div>
            </div>
            {activeWord.id && (
              <>
                <Button
                  full
                  variant="secondary"
                  onClick={() => navigate('wordDetail', { id: activeWord.id })}
                >
                  <Link size={17} /> 辞書で例文・語源を見る
                </Button>
                <Button
                  full
                  variant={myList.includes(activeWord.id) ? 'hint' : 'primary'}
                  onClick={() => toggleMyList(activeWord.id)}
                >
                  {myList.includes(activeWord.id)
                    ? <><BookmarkFilled size={17} /> マイ単語に追加済み（押すと解除）</>
                    : <><Bookmark size={17} /> マイ単語に追加</>}
                </Button>
              </>
            )}
          </div>
        )}
      </Sheet>
    </div>
  )
}
