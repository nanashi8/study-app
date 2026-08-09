import { useState, useMemo, useEffect } from 'react'
import { useStore } from '../store/useStore.js'
import { getPassage } from '../data/passages.js'
import { getLevel } from '../data/levels.js'
import { tokenize } from '../lib/text.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import {
  analyzePassageParagraphs,
  analyzeReadingSentence,
} from '../lib/reading-grammar.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { japanesePhraseSpeechText } from '../lib/phrase-speech.js'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, IconButton } from '../components/ui.jsx'
import { Close, SpeakerWave, ArrowRight, Lightbulb, Link, Bookmark, BookmarkFilled, BookOpen } from '../components/Icons.jsx'
import { cx } from '../components/ui.jsx'
import { translationRoleMeta } from '../lib/translation-roles.js'
import { StructureDiagram } from '../components/StructureDiagram.js'

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

function learnerPhrasePairsForBlock(block) {
  // 空配列は「この文法ブロックが前後を含む意味フレーズに統合済み」の印です。
  // length で旧SVOCM列へ戻すと、学習者向け表示だけが再び細切れになります。
  return block?.meaningPhrasePairs ?? block?.phrasePairs ?? []
}

function sentenceFlowParts(analysis) {
  return analysis?.phraseSequence.flatMap((pair) =>
    pair.roleParts.map((part) => ({ role: part.role, text: part.en }))) ?? []
}

function flowPattern(parts) {
  return parts.map((part) => translationRoleMeta(part.role).code).join(' → ')
}

export function ReaderScreen() {
  const passageId = useStore((s) => s.params.passageId)
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

  const sentenceAnalyses = useMemo(
    () => passage?.sentences.map((item) => analyzeReadingSentence(item)) ?? [],
    [passage],
  )
  const paragraphGuides = useMemo(
    () => passage ? analyzePassageParagraphs(passage) : [],
    [passage],
  )

  // ── 講師音声（文全体の意味フレーズごとに英語→対応する日本語→必要な解説）──
  const chunks = useMemo(
    () => sentenceAnalyses.flatMap((analysis, si) =>
      analysis.meaningPhraseSequence.map((phrase, phraseIndex) => ({
        ...phrase,
        en: phrase.spokenEn ?? phrase.en,
        displayEn: phrase.displayEn ?? phrase.en,
        phraseIndex,
        phraseCount: analysis.meaningPhraseSequence.length,
        si,
        isSentenceEnd: phraseIndex === analysis.meaningPhraseSequence.length - 1,
        sentenceJa: passage?.sentences[si]?.ja ?? '',
      })),
    ),
    [passage, sentenceAnalyses],
  )
  const paragraphs = useMemo(() => {
    const groups = []
    for (const [index, item] of (passage?.sentences ?? []).entries()) {
      if (!groups.length || item.paragraphStart) groups.push([])
      groups.at(-1).push({ item, index })
    }
    return groups
  }, [passage])
  const [playIdx, setPlayIdx] = useState(0) // 現在のチャンク
  const [playerActive, setPlayerActive] = useState(false)

  const chunkSpeechItems = useMemo(
    () => chunks.map((chunk) => ({
      id: chunk.id,
      label: chunk.displayEn,
      segments: [
        {
          text: chunk.en,
          label: '英語フレーズ',
          lang: 'en-US',
          style: 'narration',
        },
        {
          text: `前からは、「${japanesePhraseSpeechText(chunk.ja)}」と取ります。`,
          label: '対応する日本語',
          lang: 'ja-JP',
          style: 'translation',
        },
        ...(chunk.explanation
          ? [{
              text: chunk.explanation,
              label: '読み方・文法上の注意',
              lang: 'ja-JP',
              style: 'explanation',
            }]
          : []),
        ...(chunk.isSentenceEnd && chunk.sentenceJa
          ? [{
              text: `文全体を自然な日本語に整えると、「${chunk.sentenceJa}」です。`,
              label: '文全体の自然訳',
              lang: 'ja-JP',
              style: 'explanation',
            }]
          : []),
      ],
    })),
    [chunks],
  )

  // 画面を離れたら必ず止める
  useEffect(() => dismissSpeechPlayer, [])

  // 原文の英語→対応する日本語→必要な解説を、意味フレーズ単位で共通コンソールへ渡す。
  const playChunks = (index = 0) => {
    playSpeechItems(chunkSpeechItems, {
      index,
      title: '講師音声',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
      onIndexChange: (nextIndex) => setPlayIdx(nextIndex),
      onStatusChange: (status) => {
        setPlayerActive(status === 'playing' || status === 'paused')
      },
    })
  }

  const speakBlockPair = (block) => {
    const phrasePairs = learnerPhrasePairsForBlock(block)
    if (!phrasePairs.length) return
    const items = phrasePairs.map((pair, index) => {
      const explanation = pair.grammar ?? pair.explanation ?? pair.roleNote
      return {
        label: pair.displayEn ?? pair.en,
        segments: [
          {
            text: pair.spokenEn ?? pair.en,
            label: '英語フレーズ',
            lang: 'en-US',
            style: 'narration',
          },
          {
            text: `前からは、「${japanesePhraseSpeechText(pair.ja)}」と取ります。`,
            label: '対応する日本語',
            lang: 'ja-JP',
            style: 'translation',
          },
          ...(explanation
            ? [{
                text: explanation,
                label: 'フレーズ解説',
                lang: 'ja-JP',
                style: 'explanation',
              }]
            : []),
          ...(index === phrasePairs.length - 1
            ? [{
                text: `ブロック全体の読み方は、${block.translationGuide} 文法上の注意は、${block.note}`,
                label: 'ブロック全体の解説',
                lang: 'ja-JP',
                style: 'explanation',
              }]
            : []),
        ],
      }
    })
    playSpeechItems(items, {
      title: 'ブロック解説',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
    })
  }

  const speakReviewedPhrasePair = (phraseItem, phraseIndex) => {
    const phrases = sentenceAnalysis?.meaningPhraseSequence ?? [phraseItem]
    const items = phrases.map((item) => {
      const grammar = item.grammar ?? item.explanation
      return {
        label: item.displayEn ?? item.en,
        segments: [
          {
            text: item.spokenEn ?? item.en,
            label: '英語フレーズ',
            lang: 'en-US',
            style: 'narration',
          },
          {
            text: `前からは、「${japanesePhraseSpeechText(item.ja)}」と取ります。`,
            label: '対応する日本語',
            lang: 'ja-JP',
            style: 'translation',
          },
          ...(grammar
            ? [{
                text: grammar,
                label: '読み方・文法解説',
                lang: 'ja-JP',
                style: 'explanation',
              }]
            : []),
        ],
      }
    })
    playSpeechItems(items, {
      index: Math.max(0, phraseIndex ?? 0),
      title: 'フレーズ解説',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
  }

  if (!passage) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="absolute right-3 top-[calc(env(safe-area-inset-top)+0.75rem)]">
          <SpeechSettingsButton compact />
        </div>
        <p className="font-bold text-ink/50">長文が見つかりませんでした。</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const level = getLevel(passage.level)
  const sentence = activeIdx != null ? passage.sentences[activeIdx] : null
  const sentenceAnalysis = activeIdx != null ? sentenceAnalyses[activeIdx] : null

  const openSentence = (i) => {
    dismissSpeechPlayer()
    setPlayerActive(false)
    setActiveWord(null)
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
    setPlayerActive(false)
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
          onClick={() => navigate('readingPrep', { passageId })}
          className="flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
        >
          <BookOpen size={14} /> 重要語・表現
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
        <button
          onClick={() => playChunks(0)}
          className={cx(
            'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
            playerActive ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700',
          )}
        >
          <SpeakerWave size={14} /> 講師音声
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
                        className={cx(
                          'rounded-md px-0.5 text-left transition-colors hover:bg-brand-50 active:bg-brand-100',
                          playerActive && chunks[playIdx]?.si === index && 'bg-amber-200',
                        )}
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
      </div>

      {/* フッター */}
      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        <Button full size="lg" onClick={() => navigate('readingSummary', { passageId })}>
          読解チェック・単語まとめ <ArrowRight size={18} />
        </Button>
      </div>

      {/* 一文の詳細ウィンドウ */}
      <Sheet open={activeIdx != null} onClose={closeSentence} title="一文の構文解説" maxH="88vh">
        {sentence && sentenceAnalysis && (
          <div className="space-y-4">
            {/* 英文（単語タップ可） */}
            <div className="rounded-2xl bg-brand-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">英文</span>
                <SpeakButton text={sentence.en} size="sm" />
              </div>
              <p className="text-lg leading-relaxed text-ink">
                {tokenize(sentence.en).map((tok, k) => {
                  if (tok.space) return ' '
                  if (!tok.word) return <span key={k}>{tok.pre}</span>
                  // 重要語（語彙データにある語）は下線で示す。機能語も意味は出る。
                  const known = !!resolvePassageWord(tok.key, sentence.gloss)?.id
                  return (
                    <span key={k}>
                      {tok.pre}
                      <button
                        onClick={() => tapToken(tok)}
                        className={cx(
                          'rounded transition-colors active:bg-brand-200',
                          known
                            ? 'font-bold text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-2'
                            : 'text-ink underline decoration-dotted decoration-ink/20 underline-offset-2',
                          activeWord?.word === tok.word && 'bg-brand-200',
                        )}
                      >
                        {tok.word}
                      </button>
                      {tok.post}
                    </span>
                  )
                })}
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

            {/* 括弧付き構文と文全体の流れ */}
            <section className="border-y border-brand-100 bg-white py-3">
              <div className="mb-2 flex items-center gap-1.5 text-brand-600">
                <Lightbulb size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">構文の見取り図</span>
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

            {/* 文法ブロックから独立した、全363文共通の発音・意味フレーズ列 */}
            <section
              className="border-y border-emerald-100 bg-emerald-50/40 py-3"
              data-reading-phrase-method={sentenceAnalysis.phraseMethod}
            >
                <p className="mb-3 text-xs font-bold leading-relaxed text-emerald-950/65">
                  英文を発音できて意味が通るまとまりに区切ります。S・V・O・C・Mはフレーズ内の構造を確かめる注釈です。
                </p>
                <div className="space-y-2" aria-label="英文と対応する日本語">
                  {sentenceAnalysis.meaningPhraseSequence.map((phraseItem, phraseIndex) => {
                    return (
                      <article
                        key={phraseItem.id}
                        className="border border-emerald-100 bg-white p-3"
                        data-reading-phrase-status={phraseItem.status}
                        data-reading-review-state={phraseItem.reviewState}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            onClick={() => speakReviewedPhrasePair(phraseItem, phraseIndex)}
                            aria-label={`${phraseItem.en}を英語、対応する日本語、文法解説の順で再生`}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 active:bg-emerald-200"
                          >
                            <SpeakerWave size={17} />
                          </button>
                          <div className="min-w-0 flex-1">
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
                        </div>
                        <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                          文法・読み方：{phraseItem.grammar ?? phraseItem.explanation}
                        </p>
                      </article>
                    )
                  })}
                </div>
            </section>

            {/* 節・句・文法ブロックごとの解説 */}
            <section>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-brand-600">
                  <BookOpen size={16} />
                  <span className="text-[11px] font-extrabold uppercase tracking-wide">
                    {sentenceAnalysis.phraseExplanationGuide
                      ? '構造を確かめる文法ブロック解説'
                      : '節・句・文法ブロック解説'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-ink/40">
                  音声は英語 → 日本語 → 読み方・文法
                </span>
              </div>
              <div className="space-y-2">
                {sentenceAnalysis.blocks.map((block, index) => (
                  <article key={block.id} className="border border-brand-100 bg-white p-3">
                    <div className="flex items-start gap-2">
                      {learnerPhrasePairsForBlock(block).length > 0 ? (
                        <button
                          onClick={() => speakBlockPair(block)}
                          aria-label={`ブロック${index + 1}を英語フレーズ、対応する日本語、講師解説の順で再生`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 active:bg-brand-200"
                        >
                          <SpeakerWave size={17} />
                        </button>
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink/30"
                        >
                          <BookOpen size={17} />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
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
                      </div>
                    </div>
                    <div className="mt-2 space-y-1.5" aria-label="英語と対応する日本語">
                        {learnerPhrasePairsForBlock(block).map((pair, phraseIndex) => (
                        <div
                          key={`${block.id}-${phraseIndex}`}
                          className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2 border border-brand-100 bg-brand-50/60 px-2 py-2"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-black text-brand-600">
                            {phraseIndex + 1}
                          </span>
                          <div className="min-w-0">
                            <div
                              className="mb-1 flex flex-wrap gap-1"
                              data-translation-role-flow
                              aria-label={`${pair.roleHeading}の順`}
                            >
                              {pair.roleParts.map((part) => (
                                <span
                                  key={`${part.role}-${part.en}`}
                                  className={cx(
                                    'max-w-full border px-1.5 py-0.5 text-[10px] font-extrabold leading-relaxed',
                                    ROLE_STYLE[part.role] ?? 'border-brand-200 bg-brand-50 text-brand-800',
                                  )}
                                >
                                  {part.code} {part.en}
                                </span>
                              ))}
                            </div>
                            <p lang="en" className="font-bold leading-relaxed text-ink">
                              {pair.displayEn ?? pair.en}
                            </p>
                            {pair.structureEn && (
                              <p className="mt-0.5 text-[10px] font-bold text-ink/45">
                                音声では原文どおり「{pair.spokenEn}」と発音
                              </p>
                            )}
                            <p className="mt-0.5 text-sm font-bold leading-relaxed text-brand-700">
                              {pair.ja}
                            </p>
                            <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/50">
                              {pair.grammar ?? pair.explanation ?? pair.roleNote}
                            </p>
                          </div>
                        </div>
                        ))}
                        {learnerPhrasePairsForBlock(block).length === 0 && (
                          <p className="border border-brand-100 bg-brand-50/60 px-2 py-2 text-xs font-bold leading-relaxed text-ink/55">
                            この部分は、前後を含む上段の意味フレーズにまとめています。ここでは文法構造だけを確認します。
                          </p>
                        )}
                    </div>
                    {blockFlowParts(block).length > 1 && (
                      <div className="mt-2">
                        <SvocFlow parts={blockFlowParts(block)} />
                      </div>
                    )}
                    <p className="mt-2 border-l-2 border-sky-300 bg-sky-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-sky-900/75">
                      読み方：{block.translationGuide}
                    </p>
                    <p className="mt-2 border-l-2 border-amber-300 bg-amber-50/70 px-2 py-1.5 text-xs font-bold leading-relaxed text-ink/65">
                      文法上の注意：{block.note}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* 自然な和訳 */}
            <div className="rounded-2xl bg-hint-soft/70 p-4">
              <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-500">きれいな日本語訳</div>
              <p className="font-bold leading-relaxed text-amber-900">{sentence.ja}</p>
            </div>

            {/* 文の移動 */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <Button
                variant="secondary"
                size="sm"
                disabled={activeIdx === 0}
                onClick={() => openSentence(activeIdx - 1)}
              >
                ← 前の文
              </Button>
              <span className="text-xs font-bold text-ink/40">
                {activeIdx + 1}/{passage.sentences.length}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={activeIdx >= passage.sentences.length - 1}
                onClick={() => openSentence(activeIdx + 1)}
              >
                次の文 →
              </Button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}
