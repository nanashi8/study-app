import { useState, useMemo, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import {
  analyzePassageParagraphs,
  analyzeReadingSentence,
} from '../lib/reading-grammar.js'
import { readingRulesForSentence } from '../data/reading-rules.js'
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
import { translationRoleMeta } from '../lib/translation-roles.js'
import { StructureDiagram } from '../components/StructureDiagram.js'
import { ReadingRoleSentence } from '../components/ReadingRoleSentence.js'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { ReadingComprehensionCheck } from '../components/ReadingComprehensionCheck.jsx'
import { ExtendedReader } from '../components/ExtendedReader.jsx'
import {
  readingBlockExplanationTexts,
  readingPhraseExplanationTexts,
} from '../lib/explanationDedup.js'

const ROLE_STYLE = {
  S: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  V: 'border-rose-200 bg-rose-50 text-rose-800',
  O: 'border-sky-200 bg-sky-50 text-sky-800',
  O1: 'border-sky-200 bg-sky-50 text-sky-800',
  O2: 'border-cyan-200 bg-cyan-50 text-cyan-800',
  C: 'border-amber-200 bg-amber-50 text-amber-800',
  M: 'border-violet-200 bg-violet-50 text-violet-800',
  LINK: 'border-slate-200 bg-slate-50 text-slate-700',
  並列: 'border-slate-200 bg-slate-50 text-slate-700',
}

function SvocFlow({ parts }) {
  if (!parts?.length) return null
  return (
    <ol className="space-y-1.5" aria-label="SVOCMを英語順に読む型">
      {parts.map((part, index) => {
        const meta = translationRoleMeta(part.role)
        return (
          <li
            key={`${part.role}-${index}`}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-2 border border-ink/5 bg-white px-2 py-2"
          >
            <span className={cx(
              'flex h-7 items-center justify-center border text-[11px] font-black',
              ROLE_STYLE[part.role] ?? 'border-brand-200 bg-brand-50 text-brand-800',
            )}>
              {meta.code}
            </span>
            <div className="min-w-0">
              <p lang="en" className="break-words text-xs font-extrabold leading-relaxed text-ink">
                {part.text}
              </p>
              <p className="mt-0.5 text-[10px] font-bold leading-relaxed text-ink/50">
                {meta.label}：{meta.question} → {meta.japaneseShape}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function blockFlowParts(block) {
  return block?.phrasePairs.flatMap((pair) =>
    pair.roleParts.map((part) => ({ role: part.role, text: part.en }))) ?? []
}

function sentenceFlowParts(analysis) {
  return analysis?.phraseSequence.flatMap((pair) =>
    pair.roleParts.map((part) => ({ role: part.role, text: part.en }))) ?? []
}

function flowPattern(parts) {
  return parts.map((part) => translationRoleMeta(part.role).code).join(' → ')
}

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
  const visiblePhraseExplanations = readingPhraseExplanationTexts(sentenceAnalysis)
  const visibleBlockExplanations = readingBlockExplanationTexts(
    sentenceAnalysis,
    visiblePhraseExplanations,
  )
  const visibleSentenceRules = readingRulesForSentence(sentence)

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
        {sentence && sentenceAnalysis && (
          <div className="space-y-4">
            {/* 構文ラベルを原文へ直接対応させた英文（単語タップ可） */}
            <div className="rounded-2xl bg-brand-50 p-4" data-reading-role-card="direct-labels">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold tracking-wide text-brand-500">
                  文の要素
                </span>
                <SpeakButton text={sentence.en} size="sm" />
              </div>
              <ReadingRoleSentence
                sentence={sentence.en}
                parts={sentenceFlowParts(sentenceAnalysis)}
                activeWord={activeWord?.word}
                isKnownWord={(token) => Boolean(
                  resolvePassageWord(token.key, sentence.gloss)?.id,
                )}
                onWordClick={tapToken}
              />
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/55">
                下線の下にあるS・V・O・C・Mが、その役割の範囲です。青い太字は重要語で、どの単語もタップできます。
              </p>
            </div>

            {/* タップした単語 */}
            {activeWord && (
              <div className="animate-pop-in rounded-2xl bg-white p-3 ring-2 ring-brand-200">
                <div className="flex items-center gap-3">
                  <SpeakButton text={activeWord.word} size="sm" />
                  <div className="flex-1">
                    <div className="font-display text-lg font-extrabold text-ink">{activeWord.word}</div>
                    <div className="text-sm font-bold text-ink/60">
                      {activeWord.ja ?? '（発音を確認できます）'}
                    </div>
                  </div>
                  {activeWord.id && (
                    <button
                      onClick={() => navigate('wordDetail', { id: activeWord.id })}
                      className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
                    >
                      <Link size={14} /> 詳しく
                    </button>
                  )}
                </div>
                {/* マイ単語に追加（語彙データにある語のみ） */}
                {activeWord.id && (
                  <button
                    onClick={() => toggleMyList(activeWord.id)}
                    className={cx(
                      'mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold transition-colors',
                      myList.includes(activeWord.id)
                        ? 'bg-hint-soft text-amber-700'
                        : 'bg-brand-500 text-white active:bg-brand-600',
                    )}
                  >
                    {myList.includes(activeWord.id) ? (
                      <>
                        <BookmarkFilled size={16} /> マイ単語に追加済み（タップで解除）
                      </>
                    ) : (
                      <>
                        <Bookmark size={16} /> マイ単語に追加
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* 節・句の区分と文全体の流れ */}
            <section className="border-y border-brand-100 bg-white py-3">
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">長文読解</span>
              </div>
              <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-bold text-ink/55">
                <span><b className="text-sky-700">( )</b> は節（S+Vを含む）</span>
                <span>
                  <b className="text-violet-700">&lt; &gt;</b> は句
                  （句自体にS+Vなし・中に節を含む場合あり）
                </span>
              </div>
              <p
                className="text-base font-bold leading-loose text-ink"
                data-reading-structure-diagram={sentenceAnalysis.marked}
              >
                <StructureDiagram tokens={sentenceAnalysis.structureTokens} />
              </p>
              <div className="mt-3">
                <SvocFlow parts={sentenceFlowParts(sentenceAnalysis)} />
              </div>
            </section>

            <section
              className="rounded-2xl border border-sky-100 bg-sky-50/50 p-3"
              data-reading-rules-for-sentence={sentence.reviewId}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wide text-sky-600">
                    読解ルール
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-ink/50">
                    文中の合図から選んだ{visibleSentenceRules.length}件
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeSentence()
                    navigate('readingRules')
                  }}
                  className="shrink-0 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-extrabold text-sky-700"
                >
                  全30件
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {visibleSentenceRules.map((rule) => (
                  <ReadingRuleCard key={rule.id} rule={rule} compact />
                ))}
              </div>
            </section>

            {/* 文法ブロックから独立した、全長文共通の意味フレーズ列 */}
            <section
              className="border-y border-emerald-100 bg-emerald-50/40 py-3"
              data-reading-phrase-method={sentenceAnalysis.phraseMethod}
            >
              <div className="space-y-2" aria-label="英文と対応する日本語">
                {sentenceAnalysis.meaningPhraseSequence.map((phraseItem, phraseIndex) => {
                  return (
                    <article
                      key={phraseItem.id}
                      className="border border-emerald-100 bg-white p-3"
                      data-reading-phrase-status={phraseItem.status}
                      data-reading-review-state={phraseItem.reviewState}
                    >
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                          <span className="border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-emerald-800">
                            {phraseIndex + 1}. {phraseItem.pattern || phraseItem.label || '意味フレーズ'}
                          </span>
                        </div>
                        <p lang="en" className="font-bold leading-relaxed text-ink">
                          {phraseItem.displayEn}
                        </p>
                        {phraseItem.structureEn && (
                          <p className="mt-0.5 text-[10px] font-bold text-ink/45">
                            音声では原文どおり「{phraseItem.spokenEn}」と発音
                          </p>
                        )}
                        <p className="mt-1 text-sm font-bold leading-relaxed text-brand-700">
                          {phraseItem.ja}
                        </p>
                      </div>
                      {visiblePhraseExplanations[phraseIndex] && (
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          フレーズ内の文法：{visiblePhraseExplanations[phraseIndex]}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 上段の意味フレーズを再掲せず、節・句ごとの固有情報だけを示す。 */}
            <section data-reading-grammar-explanations>
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <BookOpen size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                  文法解説
                </span>
              </div>
              <div className="space-y-2">
                {sentenceAnalysis.blocks.map((block, index) => {
                  const readingExplanation = visibleBlockExplanations[index * 2]
                  const grammarExplanation = visibleBlockExplanations[index * 2 + 1]
                  return (
                    <article key={block.id} className="border border-brand-100 bg-white p-3">
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-extrabold">
                        <span className="bg-brand-50 px-1.5 py-0.5 text-brand-700">
                          {index + 1}. {block.label}
                        </span>
                        <span className={cx(
                          'border px-1.5 py-0.5',
                          ROLE_STYLE[block.role] ?? 'border-brand-200 bg-brand-50 text-brand-800',
                        )}>
                          {block.role ? `文中の働き ${block.role}` : '主節'}
                        </span>
                        {blockFlowParts(block).length > 0 && (
                          <span className="bg-ink/5 px-1.5 py-0.5 text-ink/60">
                            内部の順：{flowPattern(blockFlowParts(block))}
                          </span>
                        )}
                      </div>
                      <p lang="en" className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
                        {block.displayEn}
                      </p>
                      {blockFlowParts(block).length > 1 && (
                        <div className="mt-2">
                          <SvocFlow parts={blockFlowParts(block)} />
                        </div>
                      )}
                      {readingExplanation && (
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-sky-900/75">
                          読み進め方：{readingExplanation}
                        </p>
                      )}
                      {grammarExplanation && (
                        <p className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          文法の決まり：{grammarExplanation}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>

            {/* 自然な和訳 */}
            <div className="rounded-2xl bg-hint-soft/70 p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-500">きれいな日本語訳</div>
              <p className="font-bold leading-relaxed text-amber-900">{sentence.ja}</p>
            </div>

          </div>
        )}
      </Sheet>
    </div>
  )
}
