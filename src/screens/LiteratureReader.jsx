import { useEffect, useMemo, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  LITERATURE_KIND_META,
  getLiteratureWork,
} from '../data/public-domain-literature.js'
import {
  getLiteratureReadingGuide,
  getLiteratureReadingQuestions,
} from '../data/literature-reading.js'
import { readingRulesForPassage, readingRulesForSentence } from '../data/reading-rules.js'
import { resolvePassageWord } from '../data/passage-gloss.js'
import {
  buildLiteratureNarration,
  literatureNarrationSegments,
  narrationStepIndex,
} from '../lib/literature.js'
import { isTTSSupported } from '../lib/tts.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { SpeakButton } from '../components/SpeakButton.jsx'
import { ReadingRoleSentence } from '../components/ReadingRoleSentence.js'
import { ReadingRuleCard } from '../components/ReadingRuleCard.jsx'
import { LiteratureSceneNavigator } from '../components/LiteratureSceneNavigator.jsx'
import { Button, Card, Chip, ProgressBar, cx } from '../components/ui.jsx'
import { translationRoleMeta } from '../lib/translation-roles.js'
import {
  Book,
  Bookmark,
  BookmarkFilled,
  Check,
  ChevronRight,
  Link,
  SpeakerWave,
} from '../components/Icons.jsx'

const NARRATION_PAUSE_MS = {
  original: 260,
  translation: 420,
}

const READER_COPY = Object.freeze({
  english: Object.freeze({
    playingOriginal: '英語を再生中',
    playingTranslation: '対応する日本語を再生中',
    originalSegment: 'English',
    translationSegment: '対応する日本語',
    help: '英語を一息ぶん読み、その区切りに対応する日本語を続けて読みます。',
    speechSummary: null,
    footer: '英語 → 対応する日本語',
    gradient: 'linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)',
  }),
  classical: Object.freeze({
    playingOriginal: '古文を再生中',
    playingTranslation: '現代語訳を再生中',
    originalSegment: '古文',
    translationSegment: '区切りの現代語訳',
    help: '古文を一息ぶん読み、その区切りの現代語訳を続けて読みます。',
    speechSummary: '場面全体の読み仮名',
    footer: '古文 → 区切りの現代語訳',
    gradient: 'linear-gradient(135deg,#451a03,#92400e,#7c2d12)',
  }),
  kanbun: Object.freeze({
    playingOriginal: '書き下しを再生中',
    playingTranslation: '現代語訳を再生中',
    originalSegment: '漢文（原文）',
    translationSegment: '区切りの現代語訳',
    help: '漢文の原文を目で追い、書き下し文を一息ぶん読んだあと、対応する現代語訳を続けて読みます。',
    speechSummary: '場面全体の書き下し文',
    footer: '漢文（書き下し） → 区切りの現代語訳',
    gradient: 'linear-gradient(135deg,#4c0519,#9f1239,#7f1d1d)',
  }),
})

export function LiteratureReaderScreen() {
  const workId = useStore((state) => state.params.workId)
  const navigate = useStore((state) => state.navigate)
  const settings = useStore((state) => state.settings)
  const readingsDone = useStore((state) => state.readingsDone)
  const markLiteratureDone = useStore((state) => state.markLiteratureDone)
  const recordContentQuizResult = useStore((state) => state.recordContentQuizResult)
  const myList = useStore((state) => state.myList)
  const addManyToMyList = useStore((state) => state.addManyToMyList)
  const toggleMyList = useStore((state) => state.toggleMyList)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)
  const kotenWordList = useStore((state) => state.kotenWordList)
  const kotenGrammarList = useStore((state) => state.kotenGrammarList)
  const addManyToKotenWordList = useStore((state) => state.addManyToKotenWordList)
  const addManyToKotenGrammarList = useStore((state) => state.addManyToKotenGrammarList)

  const work = getLiteratureWork(workId)
  const steps = useMemo(() => buildLiteratureNarration(work), [work])
  const [sceneIndex, setSceneIndex] = useState(0)
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [phase, setPhase] = useState('original')
  const [playbackStatus, setPlaybackStatus] = useState('stopped')
  const [syntaxOpen, setSyntaxOpen] = useState(false)
  const [activeWord, setActiveWord] = useState(null)
  const [questionAnswers, setQuestionAnswers] = useState({})

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
            label: step.text,
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
    setSceneIndex(0)
    setSegmentIndex(0)
    setPhase('original')
    setPlaybackStatus('stopped')
    setSyntaxOpen(false)
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
  const currentScene = work.scenes[sceneIndex]
  const currentSegments = literatureNarrationSegments(currentScene)
  const currentStep = narrationStepIndex(work, sceneIndex, segmentIndex, phase)
  const completed = readingsDone.includes(work.id)
  const ttsSupported = isTTSSupported()
  const currentNarrationIndex = Math.max(
    0,
    narrationItems.findIndex(
      (item) =>
        item.meta.sceneIndex === sceneIndex &&
        item.meta.segmentIndex === segmentIndex,
    ),
  )
  const playing = playbackStatus === 'playing'
  const playbackActive = playing || playbackStatus === 'paused'
  const learnedIds = work.kind === 'english' ? myList : kotenWordList
  const savedWordCount = (work.kind === 'english' ? work.wordIds : work.kotenWordIds)
    .filter((id) => learnedIds.includes(id)).length
  const savedGrammarCount = work.grammarIds.filter((id) => kotenGrammarList.includes(id)).length
  const isEnglish = work.kind === 'english'
  const readingGuide = isEnglish ? getLiteratureReadingGuide(work.id, sceneIndex) : null
  const readingQuestions = isEnglish ? getLiteratureReadingQuestions(work.id) : []
  const answeredQuestionCount = readingQuestions.filter((item) => questionAnswers[item.id] != null).length
  const allQuestionsAnswered = answeredQuestionCount === readingQuestions.length
  const correctQuestionCount = readingQuestions.filter(
    (item) => questionAnswers[item.id] === item.answer,
  ).length
  const passageRules = isEnglish
    ? readingRulesForPassage({
        sentences: work.scenes.map((scene, index) => ({
          en: scene.original,
          paragraphStart: index === 0,
        })),
      }, 4)
    : []
  const sentenceRules = isEnglish
    ? readingRulesForSentence({ en: currentScene.original, paragraphStart: sceneIndex === 0 }, 3)
    : []

  const stopPlayback = () => {
    dismissSpeechPlayer()
    setPlaybackStatus('stopped')
  }

  const finishWork = () => {
    setPlaybackStatus('ended')
    setSceneIndex(work.scenes.length - 1)
    setSegmentIndex(
      Math.max(
        0,
        literatureNarrationSegments(work.scenes[work.scenes.length - 1]).length - 1,
      ),
    )
    setPhase('translation')
    // 英語名作は通常の長文と同様、読解チェックを終えてから読了にする。
    if (!isEnglish) markLiteratureDone(work.id, 'koten_reading', work.scenes.length)
  }

  const startPlayback = (fromIndex = currentNarrationIndex) => {
    if (!ttsSupported || !narrationItems.length) return
    playSpeechItems(narrationItems, {
      index: fromIndex,
      title: '名作に親しむ',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      autoAdvance: true,
      onIndexChange: (_index, item) => {
        setSceneIndex(item.meta.sceneIndex)
        setSegmentIndex(item.meta.segmentIndex)
        setPhase('original')
      },
      onSegmentChange: (segment) => setPhase(segment.meta.phase),
      onStatusChange: setPlaybackStatus,
      onComplete: finishWork,
    })
  }

  const moveToScene = (nextIndex) => {
    stopPlayback()
    setSyntaxOpen(false)
    setActiveWord(null)
    setSceneIndex(Math.max(0, Math.min(nextIndex, work.scenes.length - 1)))
    setSegmentIndex(0)
    setPhase('original')
  }

  const moveToSegment = (nextIndex) => {
    stopPlayback()
    setSegmentIndex(Math.max(0, Math.min(nextIndex, currentSegments.length - 1)))
    setPhase('original')
  }

  const openStudy = () => {
    stopPlayback()
    if (work.kind === 'english') {
      navigate('vocabStudy', {
        source: { type: 'mylist', ids: work.wordIds },
        title: `${work.titleJa}・重要語`,
        mode: 'study',
      })
      return
    }
    navigate('kotenStudy', {
      ids: work.kotenWordIds,
      title: `${work.titleJa}・古典単語`,
    })
  }

  const saveWords = () => {
    if (work.kind === 'english') addManyToMyList(work.wordIds)
    else addManyToKotenWordList(work.kotenWordIds)
  }

  const openSyntax = () => {
    stopPlayback()
    setActiveWord(null)
    setSyntaxOpen(true)
  }

  const tapWord = (token) => {
    const meaning = resolvePassageWord(token.key)
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

        {isEnglish && (
          <Card className="border-2 border-sky-100 p-4" data-literature-reading-preparation>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.14em] text-sky-600">BEFORE READING</p>
                <h2 className="font-display text-lg font-extrabold text-ink">読む前の準備</h2>
              </div>
              <Chip color="#0284c7">{work.level}</Chip>
            </div>
            <p className="mt-2 text-sm font-bold leading-relaxed text-ink/65">
              先に「何を追うか」を決め、本文では英語順のまとまりを保ちます。読みどころ：{work.focus}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sky-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-sky-800">{work.scenes.length}</span>
                <span className="text-[10px] font-bold text-ink/45">場面</span>
              </div>
              <div className="rounded-xl bg-violet-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-violet-800">{work.wordIds.length}</span>
                <span className="text-[10px] font-bold text-ink/45">重要語</span>
              </div>
              <div className="rounded-xl bg-emerald-50 px-2 py-2">
                <span className="block text-lg font-extrabold text-emerald-800">{readingQuestions.length}</span>
                <span className="text-[10px] font-bold text-ink/45">読解問題</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={openStudy}>
                <Book size={16} /> 重要語を確認
              </Button>
              <Button
                size="sm"
                variant={savedWordCount === work.wordIds.length ? 'soft' : 'hint'}
                onClick={saveWords}
              >
                <Bookmark size={16} /> 保存 {savedWordCount}/{work.wordIds.length}
              </Button>
            </div>
            <div className="mt-3 rounded-2xl bg-sky-50/60 p-3" data-literature-passage-rules>
              <p className="text-xs font-extrabold text-sky-800">この作品で先に使う読解ルール</p>
              <div className="mt-2 space-y-2">
                {passageRules.map((rule) => (
                  <ReadingRuleCard key={rule.id} rule={rule} compact />
                ))}
              </div>
            </div>
          </Card>
        )}

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

        <LiteratureSceneNavigator
          current={sceneIndex}
          total={work.scenes.length}
          onChange={moveToScene}
          color={meta.color}
          completed={completed}
        />

        <Card className="overflow-hidden">
          <div className="border-b border-ink/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink/40">
                  この場面を一息ずつ
                </p>
                <h2 className="font-display text-base font-extrabold text-ink">
                  区切り {segmentIndex + 1} / {currentSegments.length}
                </h2>
              </div>
              <Chip color={phase === 'original' ? meta.color : '#d97706'}>
                {playbackStatus === 'paused'
                  ? '一時停止中'
                  : playing
                  ? phase === 'original'
                    ? copy.playingOriginal
                    : copy.playingTranslation
                  : `区切り ${segmentIndex + 1}`}
              </Chip>
            </div>
            <ProgressBar
              value={
                steps.length
                  ? (currentStep + (playbackActive ? 0.5 : 0)) / steps.length
                  : 0
              }
              className="mt-3"
              color={meta.color}
            />
          </div>

          <div className="space-y-3 p-4" aria-live="polite">
            <div className="rounded-2xl bg-teal-50 p-3">
              <p className="flex items-center gap-2 text-xs font-extrabold text-teal-800">
                <SpeakerWave size={15} />
                間で区切る交互朗読
              </p>
              <p className="mt-1 text-[11px] font-bold leading-relaxed text-teal-950/55">
                {copy.help}
              </p>
            </div>

            {isEnglish && readingGuide && (
              <button
                type="button"
                onClick={openSyntax}
                className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-left active:bg-sky-50"
                data-literature-syntax-trigger={sceneIndex + 1}
              >
                <span className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-sky-700">
                  一文をタップして構文解説
                  <span aria-hidden="true">S・V・O・C・M ›</span>
                </span>
                <span lang="en" className="mt-2 block text-base font-bold leading-[1.8] text-ink">
                  {currentScene.original}
                </span>
              </button>
            )}

            <Button
              full
              disabled={!ttsSupported || playbackActive}
              onClick={() => startPlayback(currentNarrationIndex)}
            >
              <SpeakerWave size={17} />
              {playbackActive ? '共通コンソールで操作中' : 'ここから交互再生'}
            </Button>
            <p className="text-center text-[10px] font-bold text-ink/35">
              再生後は下の共通コンソールで、前後のフレーズ・停止・速度を操作できます。
            </p>

            <section className="space-y-2" aria-label="間で区切った交互朗読">
              {currentSegments.map((segment, index) => {
                const active = segmentIndex === index
                return (
                  <button
                    key={`${sceneIndex}:${index}`}
                    type="button"
                    onClick={() => moveToSegment(index)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`区切り${index + 1}を選択`}
                    className={cx(
                      'w-full overflow-hidden rounded-2xl border-2 text-left transition-colors',
                      active
                        ? 'border-teal-300 shadow-sm'
                        : 'border-ink/5 bg-white',
                    )}
                  >
                    <div
                      className={cx(
                        'p-3.5 transition-colors',
                        active && phase === 'original' ? 'bg-teal-50' : 'bg-white',
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wide text-teal-700">
                          {copy.originalSegment} {index + 1}
                        </span>
                        {playbackActive && active && phase === 'original' && (
                          <span className="text-[10px] font-extrabold text-teal-700">
                            再生中
                          </span>
                        )}
                      </div>
                      <p
                        className={cx(
                          'font-bold leading-[1.8] text-ink',
                          work.kind !== 'english'
                            ? 'font-serif text-lg'
                            : 'text-base',
                        )}
                      >
                        {segment.original}
                      </p>
                      {work.kind === 'kanbun' && (
                        <div className="mt-2 border-t border-teal-100 pt-2">
                          <span className="text-[10px] font-extrabold tracking-wide text-rose-700">
                            書き下し（朗読）
                          </span>
                          <p className="mt-1 text-sm font-bold leading-[1.8] text-ink/65">
                            {segment.speech}
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className={cx(
                        'border-t border-ink/5 p-3.5 transition-colors',
                        active && phase === 'translation'
                          ? 'bg-amber-50'
                          : 'bg-paper',
                      )}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-extrabold tracking-wide text-amber-700">
                          {copy.translationSegment}
                        </span>
                        {playbackActive && active && phase === 'translation' && (
                          <span className="text-[10px] font-extrabold text-amber-700">
                            再生中
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold leading-[1.8] text-ink">
                        {segment.translation}
                      </p>
                    </div>
                  </button>
                )
              })}
            </section>

            {copy.speechSummary && currentScene.speech && (
              <details className="rounded-xl bg-white px-3 py-2">
                <summary className="cursor-pointer text-xs font-extrabold text-teal-800">
                  {copy.speechSummary}
                </summary>
                <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">
                  {currentScene.speech}
                </p>
              </details>
            )}

            <details className="rounded-xl bg-amber-50 px-3 py-2">
              <summary className="cursor-pointer text-xs font-extrabold text-amber-800">
                {work.kind === 'english'
                  ? '場面全体の自然な和訳'
                  : '場面全体の現代語訳'}
              </summary>
              <p className="mt-2 text-sm font-bold leading-relaxed text-ink/65">
                {currentScene.translation}
              </p>
            </details>

            <div className="rounded-2xl bg-violet-50 p-3">
              <p className="text-[11px] font-extrabold text-violet-700">読みのポイント</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-violet-950/70">
                {currentScene.guide}
              </p>
            </div>
          </div>
        </Card>

        {isEnglish && (
          <Card className="border-2 border-emerald-100 p-4" data-literature-reading-check>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[0.14em] text-emerald-600">READING CHECK</p>
                <h2 className="font-display text-lg font-extrabold text-ink">読解チェック</h2>
              </div>
              <Chip color="#059669">{answeredQuestionCount}/{readingQuestions.length} 回答</Chip>
            </div>
            <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
              選ぶとすぐに根拠を確認できます。誤答でも、本文へ戻って読み直せば学習完了にできます。
            </p>
            <div className="mt-4 space-y-5">
              {readingQuestions.map((item, questionIndex) => {
                const selected = questionAnswers[item.id]
                const answered = selected != null
                const correct = selected === item.answer
                return (
                  <section key={item.id} data-literature-question={item.id}>
                    <p lang="en" className="text-sm font-extrabold leading-relaxed text-ink">
                      {questionIndex + 1}. {item.prompt}
                    </p>
                    <div className="mt-2 space-y-2">
                      {item.choices.map((choice, choiceIndex) => (
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
                          <span className="shrink-0 font-black">{String.fromCharCode(65 + choiceIndex)}.</span>
                          <span lang="en">{choice}</span>
                        </button>
                      ))}
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
                          {correct ? '正解。' : 'ここを読み直そう。'} {item.explanation}
                        </p>
                        <p lang="en" className="mt-2 border-l-2 border-sky-300 pl-2 text-[11px] font-bold leading-relaxed text-ink/60">
                          根拠 Scene {item.evidenceScene + 1}: {work.scenes[item.evidenceScene].original}
                        </p>
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </Card>
        )}

        {!isEnglish && <Card className="p-4">
          <h2 className="font-display text-base font-extrabold text-ink">この作品から覚える</h2>
          <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
            朗読で出会った語を、いつもの暗記カード・登録リストで復習できます。
          </p>

          {(work.kind === 'english' ? work.wordIds : work.kotenWordIds).length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" onClick={openStudy}>
                <Book size={16} /> 単語カード
              </Button>
              <Button
                size="sm"
                variant={
                  savedWordCount ===
                  (work.kind === 'english' ? work.wordIds : work.kotenWordIds).length
                    ? 'soft'
                    : 'hint'
                }
                onClick={saveWords}
              >
                <Bookmark size={16} /> {savedWordCount}/
                {(work.kind === 'english' ? work.wordIds : work.kotenWordIds).length}
              </Button>
            </div>
          )}

          {work.grammarIds.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
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
                onClick={() => addManyToKotenGrammarList(work.grammarIds)}
              >
                <Bookmark size={16} /> {savedGrammarCount}/{work.grammarIds.length}
              </Button>
            </div>
          )}
        </Card>}

        <Card className="p-4">
          <details>
            <summary className="flex cursor-pointer list-none items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Check size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-sm font-extrabold text-ink">
                  出典と著作権の確認
                </h2>
                <p className="truncate text-xs font-bold text-ink/45">{work.rights.status}</p>
              </div>
              <ChevronRight size={18} className="text-ink/30" />
            </summary>
            <div className="mt-3 space-y-2 border-t border-ink/5 pt-3 text-xs font-bold leading-relaxed text-ink/55">
              <p>{work.rights.basis}</p>
              <p>{work.rights.translation}</p>
              <a
                href={work.source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-teal-700 underline underline-offset-2"
              >
                <Link size={13} /> {work.source.label}
              </a>
              <p className="text-[10px] text-ink/35">
                確認日 {work.source.checkedOn}。原文は学習しやすい句読点・表記に一部整えています。
              </p>
            </div>
          </details>
        </Card>

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

      {isEnglish && readingGuide && (
        <Sheet
          open={syntaxOpen}
          onClose={() => {
            setSyntaxOpen(false)
            setActiveWord(null)
          }}
          title="一文の構文解説"
          maxH="88vh"
        >
          <div className="space-y-4" data-literature-syntax-sheet={sceneIndex + 1}>
            <div className="rounded-2xl bg-brand-50 p-4" data-reading-role-card="direct-labels">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold tracking-wide text-brand-500">
                  文の要素
                </span>
                <SpeakButton text={currentScene.original} size="sm" />
              </div>
              <ReadingRoleSentence
                sentence={currentScene.original}
                parts={readingGuide.parts}
                activeWord={activeWord?.word}
                isKnownWord={(token) => Boolean(resolvePassageWord(token.key)?.id)}
                onWordClick={tapWord}
                allowVerbOmission={readingGuide.allowVerbOmission}
                verbOmissionNote={readingGuide.note}
              />
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/55">
                ラベルと同じ色の下線が役割の範囲です。どの英単語もタップして意味を確認できます。
              </p>
            </div>

            {activeWord && (
              <div className="rounded-2xl bg-white p-3 ring-2 ring-brand-200" data-literature-active-word>
                <div className="flex items-center gap-3">
                  <SpeakButton text={activeWord.word} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p lang="en" className="font-display text-lg font-extrabold text-ink">{activeWord.word}</p>
                    <p className="text-sm font-bold text-ink/60">{activeWord.ja ?? '発音を確認できます'}</p>
                  </div>
                  {activeWord.id && (
                    <button
                      type="button"
                      onClick={() => navigate('wordDetail', { id: activeWord.id })}
                      className="rounded-full bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
                    >
                      詳しく
                    </button>
                  )}
                </div>
                {activeWord.id && (
                  <button
                    type="button"
                    onClick={() => toggleMyList(activeWord.id)}
                    className={cx(
                      'mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold',
                      myList.includes(activeWord.id)
                        ? 'bg-hint-soft text-amber-700'
                        : 'bg-brand-500 text-white',
                    )}
                  >
                    {myList.includes(activeWord.id)
                      ? <><BookmarkFilled size={16} /> マイ単語に追加済み（タップで解除）</>
                      : <><Bookmark size={16} /> マイ単語に追加</>}
                  </button>
                )}
              </div>
            )}

            <section className="rounded-2xl border border-brand-100 bg-white p-3" data-literature-svoc-flow>
              <h3 className="text-xs font-extrabold text-brand-700">英語の順に役割を追う</h3>
              <ol className="mt-2 space-y-1.5">
                {readingGuide.parts.map((part, index) => {
                  const roleMeta = translationRoleMeta(part.role)
                  return (
                    <li key={`${part.role}-${index}`} className="grid grid-cols-[2.7rem_minmax(0,1fr)] gap-2 rounded-lg bg-slate-50 px-2 py-2">
                      <span className="flex h-7 items-center justify-center rounded border border-brand-200 bg-white text-[10px] font-black text-brand-700">
                        {roleMeta.code}
                      </span>
                      <div className="min-w-0">
                        <p lang="en" className="break-words text-xs font-extrabold leading-relaxed text-ink">{part.text}</p>
                        <p className="text-[10px] font-bold text-ink/45">{roleMeta.label}：{roleMeta.question}</p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </section>

            <section className="rounded-2xl border border-sky-100 bg-sky-50/50 p-3" data-literature-sentence-rules>
              <h3 className="text-xs font-extrabold text-sky-700">読解ルール</h3>
              <div className="mt-2 space-y-2">
                {sentenceRules.map((rule) => (
                  <ReadingRuleCard key={rule.id} rule={rule} compact />
                ))}
              </div>
            </section>

            <div className="rounded-2xl bg-violet-50 p-3">
              <p className="text-[11px] font-extrabold text-violet-700">この場面の読み方</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-violet-950/70">{readingGuide.note}</p>
              <p className="mt-2 border-t border-violet-100 pt-2 text-xs font-bold leading-relaxed text-violet-950/60">
                作品上のポイント：{currentScene.guide}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-[11px] font-extrabold text-amber-700">最後に自然な和訳</p>
              <p className="mt-1 text-sm font-bold leading-relaxed text-amber-950">{currentScene.translation}</p>
            </div>
          </div>
        </Sheet>
      )}
    </div>
  )
}
