import { useEffect, useMemo, useRef, useState } from 'react'
import { useScreenParam, useStore, useContentSettings } from '../store/useStore.js'
import { notebookRefs } from '../lib/learningNotebook.js'
import {
  LITERATURE_KIND_META,
  getLiteratureWork,
} from '../data/public-domain-literature.js'
import { getLiteratureReadingQuestions } from '../data/literature-reading.js'
import { readingRulesForPassage } from '../data/reading-rules.js'
import { buildLiteratureVocabulary, resolveLiteratureSentenceWord } from '../data/literature-vocabulary.js'
import {
  literatureParagraphs,
  literatureSentences,
  literatureSentenceIndexForSegment,
} from '../data/literature-sentences.js'
import { buildLiteratureNarration } from '../lib/literature.js'
import { isTTSSupported } from '../lib/tts.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { limitQuizChoices, UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { ChoiceExplanations } from '../components/ChoiceExplanations.jsx'
import { literatureReadingChoiceNoteFor } from '../data/literature-reading-choice-notes.js'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { LiteratureFullText } from '../components/LiteratureFullText.jsx'
import { LiteratureSentenceSheet } from '../components/LiteratureSentenceSheet.jsx'
import { LiteratureVocabularySheet } from '../components/LiteratureVocabularySheet.jsx'
import { useWordBookSlot, wordBookSlotButtonText } from '../components/WordBookSlot.jsx'
import { Button, Card, Chip, cx } from '../components/ui.jsx'
import {
  Book,
  Bookmark,
  Check,
  SpeakerWave,
} from '../components/Icons.jsx'

const NARRATION_PAUSE_MS = {
  original: 260,
  translation: 420,
}

const READER_COPY = Object.freeze({
  english: Object.freeze({
    help: '分からない文を押すと、その文の構文解説（文の要素・記号の働き・区切りごとの日本語・節と句の解説・きれいな日本語訳）が開きます。',
    translationToggle: '和訳',
    narration: '英語を一息ぶん読み、その区切りに対応する日本語を続けて読みます。',
    gradient: 'linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)',
  }),
  classical: Object.freeze({
    help: '分からない文を押すと、その文の読み・語句の意味・文法・現代語訳が開きます。',
    translationToggle: '現代語訳',
    narration: '古文を一息ぶん読み、その区切りの現代語訳を続けて読みます。',
    gradient: 'linear-gradient(135deg,#451a03,#92400e,#7c2d12)',
  }),
  kanbun: Object.freeze({
    help: '分からない文を押すと、その文の書き下し文・読む順・語句・句法・現代語訳が開きます。',
    translationToggle: '現代語訳',
    narration: '書き下し文を一息ぶん読み、対応する現代語訳を続けて読みます。',
    gradient: 'linear-gradient(135deg,#4c0519,#9f1239,#7f1d1d)',
  }),
})

// 読んでいる文（交互朗読の位置と、最後に開いた文）と、訳・解説の表示は params に置き、
// 語の詳細や単語の暗記から戻ったときも同じ所・同じ表示から読み続ける。
const readPosition = (value) => (Number.isInteger(value) && value >= 0 ? value : 0)
const readShown = (value) => value === true
const readOpen = (value) => (Number.isInteger(value) && value >= 0 ? value : null)

export function LiteratureReaderScreen() {
  const workId = useStore((state) => state.params.workId)
  const navigate = useStore((state) => state.navigate)
  const settings = useContentSettings()
  const readingsDone = useStore((state) => state.readingsDone)
  const markLiteratureDone = useStore((state) => state.markLiteratureDone)
  const recordContentQuizResult = useStore((state) => state.recordContentQuizResult)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)

  const work = getLiteratureWork(workId)
  const sentences = useMemo(() => (work ? literatureSentences(work) : []), [work])
  const paragraphs = useMemo(() => (work ? literatureParagraphs(work) : []), [work])
  const steps = useMemo(() => buildLiteratureNarration(work), [work])
  const vocabulary = useMemo(() => buildLiteratureVocabulary(work), [work])
  const [sentenceIndex, setSentenceIndex] = useScreenParam('sentence', readPosition)
  const [openIndex, setOpenIndex] = useScreenParam('open', readOpen)
  const [showTranslation, setShowTranslation] = useScreenParam('showJa', readShown)
  const [showKakikudashi, setShowKakikudashi] = useScreenParam('showKakikudashi', readShown)
  const [playbackStatus, setPlaybackStatus] = useState('stopped')
  const [vocabularyOpen, setVocabularyOpen] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [questionAnswers, setQuestionAnswers] = useState({})
  const sheetScrollRef = useRef(null)
  // 単語帳ボタンは、画面下部の「単語帳」で選んだ登録先に入れる（全部入っていれば外す）。
  // 本文の語（英単語・古典単語・漢語）はまとめて、古典文法もまとめて入れる。
  const sharedWordDomain = work?.kind === 'english'
    ? 'vocab'
    : work?.kind === 'classical'
      ? 'kotenVocab'
      : 'kanbunVocab'
  const sharedWordIds = !work
    ? []
    : work.kind === 'english'
      ? work.wordIds
      : work.kind === 'classical'
        ? work.kotenWordIds
        : work.kanbunVocabIds
  const sharedWordKind = work?.kind === 'english' ? '本文語彙' : work?.kind === 'classical' ? '古典単語' : '漢語'
  const wordsBook = useWordBookSlot(notebookRefs(sharedWordDomain, sharedWordIds), {
    label: work ? `${work.titleJa}の${sharedWordKind}${sharedWordIds.length}語` : '',
  })
  const grammarBook = useWordBookSlot(notebookRefs('kotenGrammar', work?.grammarIds ?? []), {
    label: work ? `${work.titleJa}の古典文法${work.grammarIds.length}項目` : '',
  })

  // 交互朗読の順（区切りごとに、原文→対応する訳）。
  const narrationItems = useMemo(() => {
    const items = []
    for (const step of steps) {
      const previous = items.at(-1)
      const samePhrase =
        previous?.meta.sceneIndex === step.sceneIndex &&
        previous?.meta.segmentIndex === step.segmentIndex
      const item = samePhrase
        ? previous
        : {
            id: `${step.sceneIndex}:${step.segmentIndex}`,
            label: step.displayText,
            meta: {
              sceneIndex: step.sceneIndex,
              segmentIndex: step.segmentIndex,
            },
            segments: [],
          }
      item.segments.push({
        text: step.text,
        label: step.phase === 'original' ? '原文' : '対応する訳',
        lang: step.lang,
        style: step.phase === 'original' ? 'narration' : 'translation',
        maxRate: step.lang === 'ja-JP' ? 1.08 : 1.4,
        pauseAfterMs: NARRATION_PAUSE_MS[step.phase],
        meta: { phase: step.phase },
      })
      if (!samePhrase) items.push(item)
    }
    return items
  }, [steps])

  useEffect(() => {
    setPlaybackStatus('stopped')
    setVocabularyOpen(false)
    setActiveWord(null)
    setQuestionAnswers({})
    return dismissSpeechPlayer
  }, [workId])

  if (!work) {
    return (
      <div>
        <ScreenHeader title="名作に親しむ" />
        <div className="p-8 text-center font-bold text-ink/50">
          作品が見つかりませんでした。
        </div>
      </div>
    )
  }

  const meta = LITERATURE_KIND_META[work.kind]
  const copy = READER_COPY[work.kind] ?? READER_COPY.classical
  const completed = readingsDone.includes(work.id)
  const ttsSupported = isTTSSupported()
  const playing = playbackStatus === 'playing'
  const playbackActive = playing || playbackStatus === 'paused'
  const currentSentence = Math.min(sentenceIndex, Math.max(0, sentences.length - 1))
  // 本文の語と古典文法は、登録先の単語帳に入っている数で示す。
  const savedWordCount = wordsBook.present
  const savedGrammarCount = grammarBook.present
  const isEnglish = work.kind === 'english'
  const readingQuestions = isEnglish ? getLiteratureReadingQuestions(work.id, work) : []
  const answeredQuestionCount = readingQuestions.filter((item) => questionAnswers[item.id] != null).length
  const allQuestionsAnswered = answeredQuestionCount === readingQuestions.length
  const correctQuestionCount = readingQuestions.filter(
    (item) => questionAnswers[item.id] === item.answer,
  ).length
  const passageRules = isEnglish
    ? readingRulesForPassage({
        sentences: sentences.map((sentence) => ({
          en: sentence.en,
          paragraphStart: sentence.paragraphStart,
        })),
      }, 4)
    : []

  const stopPlayback = () => {
    dismissSpeechPlayer()
    setPlaybackStatus('stopped')
  }

  const finishWork = () => {
    setPlaybackStatus('ended')
    setSentenceIndex(sentences.length - 1)
    // 英語名作は通常の長文と同様、読解チェックを終えてから読了にする。
    if (!isEnglish) markLiteratureDone(work.id, 'koten_reading', work.scenes.length)
  }

  // 文の最初の区切りから交互朗読を始める。
  const startPlayback = (fromSentence = currentSentence) => {
    if (!ttsSupported || !narrationItems.length) return
    const first = sentences[fromSentence]?.segments[0]
    const fromIndex = Math.max(0, narrationItems.findIndex((item) =>
      item.meta.sceneIndex === first?.sceneIndex && item.meta.segmentIndex === first?.segmentIndex))
    setOpenIndex(null)
    setActiveWord(null)
    setSentenceIndex(fromSentence)
    playSpeechItems(narrationItems, {
      index: fromIndex,
      title: '名作に親しむ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
      onIndexChange: (_index, item) => {
        const next = literatureSentenceIndexForSegment(work, item.meta.sceneIndex, item.meta.segmentIndex)
        if (next >= 0) setSentenceIndex(next)
      },
      onStatusChange: setPlaybackStatus,
      onComplete: finishWork,
    })
  }

  const openSentence = (index) => {
    stopPlayback()
    setActiveWord(null)
    if (sheetScrollRef.current) sheetScrollRef.current.scrollTop = 0
    setSentenceIndex(index)
    setOpenIndex(index)
  }

  const closeSentence = () => {
    dismissSpeechPlayer()
    setOpenIndex(null)
    setActiveWord(null)
  }

  const openStudy = () => {
    stopPlayback()
    setVocabularyOpen(false)
    if (work.kind === 'english') {
      navigate('vocabStudy', {
        source: { type: 'deck', ids: sharedWordIds },
        title: `${work.titleJa}・本文の共通単語`,
        mode: 'study',
        returnTo: { screen: 'literatureReader', params: { workId: work.id } },
      })
      return
    }
    if (work.kind === 'classical') {
      navigate('kotenStudy', {
        ids: sharedWordIds,
        title: `${work.titleJa}・古典単語`,
        returnTo: { screen: 'literatureReader', params: { workId: work.id } },
      })
      return
    }
    navigate('kanbunStudy', {
      domain: 'vocab',
      ids: sharedWordIds,
      title: `${work.titleJa}・漢文語彙`,
      returnTo: { screen: 'literatureReader', params: { workId: work.id } },
    })
  }

  // 本文語彙は、登録先の単語帳にまとめて入れる（英語・古典・漢文のどの作品でも同じ）。全部入っていれば外す。
  const saveWords = wordsBook.press

  const openVocabulary = () => {
    stopPlayback()
    setVocabularyOpen(true)
  }

  const openSheetSentence = openIndex != null ? sentences[openIndex] : null
  const resolveWord = (key) => resolveLiteratureSentenceWord(work, openSheetSentence, key)

  const tapWord = (token) => {
    playSpeechItems([{ text: token.word, label: token.word, style: 'word' }], {
      title: '単語の読み上げ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
    })
    const meaning = resolveWord(token.key)
    if (meaning?.id) recordVocabHistory(meaning.id)
    setActiveWord({
      word: token.word,
      ja: meaning?.ja ?? null,
      id: meaning?.id ?? null,
    })
  }

  const answerQuestion = (questionId, choiceIndex) => {
    setQuestionAnswers((answers) => (
      answers[questionId] == null
        ? { ...answers, [questionId]: choiceIndex }
        : answers
    ))
  }

  const completeWork = () => {
    if (isEnglish && allQuestionsAnswered && readingQuestions.length) {
      recordContentQuizResult(
        'literature',
        work.id,
        correctQuestionCount,
        readingQuestions.length,
      )
    }
    markLiteratureDone(
      work.id,
      isEnglish ? 'reading' : 'koten_reading',
      work.scenes.length,
    )
  }

  return (
    <div className="pb-5">
      <ScreenHeader
        title={work.titleJa}
        subtitle={`${work.authorJa}・${work.excerpt}`}
        color={meta.color}
      />

      <div className="space-y-4 px-4">
        <section
          className="overflow-hidden rounded-3xl p-5 text-white shadow-card"
          style={{
            background: copy.gradient,
          }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              {work.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Chip className="bg-white/12 text-white">{meta.description}</Chip>
                {completed && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-200">
                    <Check size={13} /> 読了
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-xl font-extrabold leading-tight">
                {work.title}
              </h1>
              <p className="mt-1 text-sm font-bold text-white/70">
                {work.author}（{work.authorYears}）
              </p>
            </div>
          </div>
          <p className="mt-4 text-xs font-bold leading-relaxed text-white/75">
            読みどころ：{work.focus}
          </p>
        </section>

        <Card
          className="border-2 border-sky-100 p-4"
          data-literature-reading-preparation
          data-literature-vocabulary-preparation={work.id}
        >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold text-sky-600">読む前に</p>
                <h2 className="font-display text-lg font-extrabold text-ink">読む前の準備</h2>
              </div>
              <Chip color="#0284c7">{work.level}</Chip>
            </div>
            <p className="mt-2 text-sm font-bold leading-relaxed text-ink/65">
              {isEnglish
                ? '本文に出る語を先に確認してから、全文を読みます。分からない文は押して構文解説を開きます。'
                : work.kind === 'classical'
                  ? '古典単語を先に確認してから、全文を読みます。分からない文は押して解説を開きます。'
                  : '漢文語彙を先に確認してから、訓読文を読みます。分からない文は押して解説を開きます。'}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sky-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-sky-800">{sentences.length}</span>
                <span className="text-[10px] font-bold text-ink/45">文</span>
              </div>
              <div className="rounded-xl bg-violet-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-violet-800">
                  {vocabulary.coveredOccurrences}
                </span>
                <span className="text-[10px] font-bold text-ink/45">
                  本文{vocabulary.coverageUnitLabel}
                </span>
              </div>
              <div className="rounded-xl bg-emerald-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-emerald-800">
                  {vocabulary.entries.length}
                </span>
                <span className="text-[10px] font-bold text-ink/45">予習カード</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={openVocabulary} data-literature-vocabulary-open>
                <Book size={16} /> 本文語彙を予習
              </Button>
              <Button
                size="sm"
                variant={savedWordCount === sharedWordIds.length ? 'soft' : 'hint'}
                onClick={saveWords}
                disabled={!sharedWordIds.length}
                aria-pressed={wordsBook.inBook}
                aria-label={wordBookSlotButtonText({ bookTitle: wordsBook.bookTitle, inBook: wordsBook.inBook, what: `${sharedWordKind}${sharedWordIds.length}語を` })}
                data-literature-save-words
              >
                <Bookmark size={16} /> 単語帳 {savedWordCount}/{sharedWordIds.length}
              </Button>
            </div>
            {isEnglish && (
              <div className="mt-3 rounded-2xl bg-sky-50/60 p-3" data-literature-passage-rules>
                <p className="text-xs font-extrabold text-sky-800">この作品で先に使う読解ルール</p>
                <div className="mt-2 space-y-2">
                  {passageRules.map((rule) => (
                    <ReadingRuleCard key={rule.id} rule={rule} compact />
                  ))}
                </div>
              </div>
            )}
        </Card>

        {!ttsSupported && (
          <Card className="border-2 border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-extrabold text-amber-900">
              この端末では音声合成を利用できません。
            </p>
            <p className="mt-1 text-xs font-bold leading-relaxed text-amber-800/70">
              原文と訳はそのまま読めます。音声対応ブラウザで開くと交互再生できます。
            </p>
          </Card>
        )}

        <Card className="overflow-hidden" data-literature-reader-body>
          <div className="space-y-3 border-b border-ink/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold tracking-wide text-ink/40">本文</p>
                <h2 className="font-display text-base font-extrabold text-ink">
                  全文・{paragraphs.length}段落
                </h2>
              </div>
              {playbackActive && (
                <Chip color={meta.color}>
                  {playbackStatus === 'paused' ? '一時停止中' : `${currentSentence + 1}番目の文を再生中`}
                </Chip>
              )}
            </div>
            <p className="text-xs font-bold leading-relaxed text-ink/55">{copy.help}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTranslation((value) => !value)}
                aria-pressed={showTranslation}
                className={cx(
                  'min-h-9 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
                  showTranslation ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800',
                )}
                data-literature-translation-toggle
              >
                {copy.translationToggle} {showTranslation ? 'ON' : 'OFF'}
              </button>
              {work.kind === 'kanbun' && (
                <button
                  type="button"
                  onClick={() => setShowKakikudashi((value) => !value)}
                  aria-pressed={showKakikudashi}
                  className={cx(
                    'min-h-9 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
                    showKakikudashi ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800',
                  )}
                  data-literature-kakikudashi-toggle
                >
                  書き下し文 {showKakikudashi ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
            <div className="rounded-2xl bg-teal-50 p-3">
              <p className="flex items-center gap-2 text-xs font-extrabold text-teal-800">
                <SpeakerWave size={15} />
                間で区切る交互朗読
              </p>
              <p className="mt-1 text-[11px] font-bold leading-relaxed text-teal-950/55">{copy.narration}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!ttsSupported || playbackActive}
                  onClick={() => startPlayback(0)}
                >
                  <SpeakerWave size={15} /> 最初から
                </Button>
                <Button
                  size="sm"
                  disabled={!ttsSupported || playbackActive}
                  onClick={() => startPlayback(currentSentence)}
                  data-literature-play-from
                >
                  <SpeakerWave size={15} /> {currentSentence > 0 ? `${currentSentence + 1}番目の文から` : '再生'}
                </Button>
              </div>
              <p className="mt-2 text-center text-[10px] font-bold text-teal-950/40">
                {playbackActive ? '下の再生パネルで、前後の区切り・停止・速度を操作できます。' : '再生中の文は本文で色が付きます。'}
              </p>
            </div>
          </div>
          <div className="p-4">
            <LiteratureFullText
              work={work}
              paragraphs={paragraphs}
              currentIndex={playbackActive || openIndex != null || currentSentence > 0 ? currentSentence : -1}
              playing={playing}
              onOpen={openSentence}
              showTranslation={showTranslation}
              showKakikudashi={showKakikudashi}
            />
          </div>
        </Card>

        {isEnglish && (
          <Card className="border-2 border-emerald-100 p-4" data-literature-reading-check>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold text-emerald-600">読解チェック</p>
                <h2 className="font-display text-lg font-extrabold text-ink">読解チェック</h2>
              </div>
              <Chip color="#059669">{answeredQuestionCount}/{readingQuestions.length} 回答</Chip>
            </div>
            <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
              選ぶとすぐに根拠を確認できます。根拠の文を押すと、その文の構文解説が開きます。
            </p>
            <div className="mt-4 space-y-5">
              {readingQuestions.map((item, questionIndex) => {
                const selected = questionAnswers[item.id]
                const answered = selected != null
                const correct = selected === item.answer
                const unknown = selected === UNKNOWN_CHOICE_ID
                // 教材は4択だが、出題は「3択＋わからない」にそろえる。
                // answer は添字なので、元の添字を保ったまま表示する分だけ残す。
                const shownChoices = limitQuizChoices(
                  item.choices.map((choice, choiceIndex) => ({ choice, choiceIndex })),
                  (entry) => entry.choiceIndex === item.answer,
                  { seed: item.id },
                )
                const evidence = sentences[item.evidenceSentence]
                return (
                  <section key={item.id} data-literature-question={item.id}>
                    <p lang="en" className="text-sm font-extrabold leading-relaxed text-ink">
                      {questionIndex + 1}. {item.prompt}
                    </p>
                    <div className="mt-2 space-y-2">
                      {shownChoices.map(({ choice, choiceIndex }, displayIndex) => (
                        <button
                          key={choice}
                          type="button"
                          disabled={answered}
                          onClick={() => answerQuestion(item.id, choiceIndex)}
                          className={cx(
                            'flex w-full items-start gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-xs font-bold leading-relaxed transition-colors',
                            !answered && 'border-slate-200 bg-white text-ink active:border-emerald-300',
                            answered && choiceIndex === item.answer && 'border-emerald-400 bg-emerald-50 text-emerald-900',
                            answered && choiceIndex === selected && !correct && 'border-rose-400 bg-rose-50 text-rose-900',
                            answered && choiceIndex !== item.answer && choiceIndex !== selected && 'border-slate-100 bg-slate-50 text-ink/40',
                          )}
                        >
                          <span className="shrink-0 font-black">{String.fromCharCode(65 + displayIndex)}.</span>
                          <span lang="en">{choice}</span>
                        </button>
                      ))}
                      <UnknownChoiceButton
                        selected={unknown}
                        disabled={answered}
                        onClick={() => answerQuestion(item.id, UNKNOWN_CHOICE_ID)}
                        className="rounded-xl py-2.5"
                      />
                    </div>
                    {answered && (
                      <div
                        className={cx(
                          'mt-2 rounded-xl border p-3',
                          correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50',
                        )}
                        aria-live="polite"
                      >
                        <p className={cx('text-xs font-extrabold', correct ? 'text-emerald-800' : 'text-rose-800')}>
                          {correct ? '正解。' : unknown ? '答えはこちら。' : 'ここを読み直そう。'} {item.explanation}
                        </p>
                        {evidence && (
                          <button
                            type="button"
                            onClick={() => openSentence(item.evidenceSentence)}
                            className="mt-2 block w-full border-l-2 border-sky-300 pl-2 text-left text-[11px] font-bold leading-relaxed text-ink/60 active:bg-sky-50"
                            data-literature-evidence-sentence={evidence.number}
                          >
                            <span className="mr-1 font-extrabold text-sky-700">根拠（{evidence.number}番目の文）</span>
                            <span lang="en">{evidence.text}</span>
                          </button>
                        )}
                      </div>
                    )}
                    {answered && (
                      <ChoiceExplanations
                        title="選択肢解説（3択すべて）"
                        name="literature"
                        className="mt-2"
                        rows={shownChoices.map(({ choice, choiceIndex }) => ({
                          id: `${item.id}:${choiceIndex}`,
                          heading: choice,
                          body: literatureReadingChoiceNoteFor(item, choiceIndex),
                          correct: choiceIndex === item.answer,
                          chosen: choiceIndex === selected,
                        }))}
                      />
                    )}
                  </section>
                )
              })}
            </div>
          </Card>
        )}

        {!isEnglish && work.grammarIds.length > 0 && <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">文法も一緒に固める</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
            本文語彙の予習とあわせて、この作品に出る古典文法を復習できます。
          </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  stopPlayback()
                  navigate('kotenGrammarStudy', {
                    ids: work.grammarIds,
                    title: `${work.titleJa}・古典文法`,
                  })
                }}
              >
                <span aria-hidden="true">🧩</span> 文法カード
              </Button>
              <Button
                size="sm"
                variant={savedGrammarCount === work.grammarIds.length ? 'soft' : 'hint'}
                onClick={grammarBook.press}
                aria-pressed={grammarBook.inBook}
                aria-label={wordBookSlotButtonText({ bookTitle: grammarBook.bookTitle, inBook: grammarBook.inBook, what: `古典文法${work.grammarIds.length}項目を` })}
                data-literature-save-grammar
              >
                <Bookmark size={16} /> 単語帳 {savedGrammarCount}/{work.grammarIds.length}
              </Button>
            </div>
        </Card>}

        <Button
          full
          variant={completed ? 'soft' : 'secondary'}
          disabled={isEnglish && !completed && !allQuestionsAnswered}
          onClick={completeWork}
        >
          <Check size={17} /> {completed
            ? '読了として記録済み'
            : isEnglish && !allQuestionsAnswered
              ? `読解チェックを完了する（${answeredQuestionCount}/${readingQuestions.length}）`
              : '読み終えたので記録する'}
        </Button>
      </div>


      <LiteratureVocabularySheet
        open={vocabularyOpen}
        onClose={() => setVocabularyOpen(false)}
        work={work}
        vocabulary={vocabulary}
        onOpenSharedStudy={openStudy}
      />

      <LiteratureSentenceSheet
        work={work}
        sentences={sentences}
        index={openIndex != null && openIndex < sentences.length ? openIndex : null}
        onClose={closeSentence}
        onMove={openSentence}
        onPlayFrom={(index) => startPlayback(index)}
        playEnabled={ttsSupported}
        activeWord={activeWord}
        onWordTap={tapWord}
        resolveWord={resolveWord}
        scrollAreaRef={sheetScrollRef}
      />
    </div>
  )
}
