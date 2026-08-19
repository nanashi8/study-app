import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  buildListeningDeck,
  LISTENING_PROFILES,
  LISTENING_TYPE_META,
  listeningSpokenSegments,
  shuffledListeningChoices,
} from '../data/listening.js'
import { isTTSSupported } from '../lib/tts.js'
import { playListeningItem, stopListeningAudio } from '../lib/listening.js'
import { UNKNOWN_CHOICE_ID } from '../lib/quizChoices.js'
import { UnknownChoiceButton } from '../components/UnknownChoiceButton.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Button, Chip, ProgressBar, IconButton, cx } from '../components/ui.jsx'
import { growDeck } from '../lib/session.js'
import {
  ArrowRight,
  Bookmark,
  BookmarkFilled,
  Check,
  Close,
  Eye,
  EyeOff,
  SpeakerWave,
} from '../components/Icons.jsx'
import { buildListeningInstructorExplanation } from '../lib/instructorExplanations.js'
import { SessionCounter, useSessionSize } from '../components/SessionSize.jsx'

const PROMPTS = Object.freeze({
  response: '最後の発話に対する、最も自然な応答を選んでください。',
  picture: 'イラストの内容に合う英文を選んでください。',
  conversation: '会話と最後の質問を聞き、最も適切な答えを選んでください。',
  passage: '説明と最後の質問を聞き、最も適切な答えを選んでください。',
  realLife: '実生活の案内を聞き、最も適切な答えを選んでください。',
  interview: 'インタビューを聞き、要点や話者の意図に合う答えを選んでください。',
})

const SPEAKER_LABELS = Object.freeze({
  A: '話者A',
  B: '話者B',
  N: 'ナレーター',
  Q: '質問',
})

const clampRate = (rate) => Math.max(0.55, Math.min(1.25, rate))

export function ListeningQuizScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)
  const toggleNotebookItem = useStore((s) => s.toggleNotebookItem)
  const learningNotebook = useStore((s) => s.learningNotebook)

  const source = params.source ?? { type: 'level', levelId: '5' }
  // size=0 は「絞り込みなし」。登録リストは全問、それ以外は設定した問題数で出す。
  const buildFor = (size) => buildListeningDeck(source, { size })
  const [poolSize] = useState(() => buildFor(0).length)
  const sessionSize = useSessionSize(poolSize || Infinity)
  const [deck, setDeck] = useState(() => (
    source.type === 'listeningList' ? buildFor(0) : buildFor(params.size ?? sessionSize)
  ))
  const [i, setI] = useState(0)
  const [selected, setSelected] = useState(null)
  const [playsUsed, setPlaysUsed] = useState(0)
  const [practicePlays, setPracticePlays] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [activeSegment, setActiveSegment] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)
  const results = useRef({ correct: 0, wrong: 0, unknown: 0, wrongIds: [] })

  const item = deck[i]
  const profile =
    LISTENING_PROFILES[item?.level ?? source.levelId] ?? LISTENING_PROFILES['5']
  const saved = Boolean(item && learningNotebook?.entries?.[`listening:${item.id}`]?.saved)
  const typeMeta = LISTENING_TYPE_META[item?.type]
  const options = useMemo(
    () => shuffledListeningChoices(item),
    // 選択肢の並びは設問ごとに一度だけ決める。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item?.id],
  )
  const spokenSegments = useMemo(
    () => listeningSpokenSegments(item),
    [item],
  )
  const answered = selected !== null
  const isCorrectPick = answered && selected === item?.answer
  const correctChoice = item?.choices.find((choice) => choice.id === item.answer)
  const instructorExplanation = answered
    ? buildListeningInstructorExplanation(
        item,
        selected === UNKNOWN_CHOICE_ID
          ? UNKNOWN_CHOICE_ID
          : options.find((choice) => choice.id === selected),
      )
    : null
  const userRateScale = (settings.ttsRate ?? 0.9) / 0.9
  const normalRate = clampRate(profile.rate * userRateScale)
  const slowRate = clampRate(profile.slowRate * userRateScale)
  const remainingPlays = Math.max(0, (item?.plays ?? 0) - playsUsed)

  const play = ({ slow = false, practice = false } = {}) => {
    if (!item || playing) return
    const isPractice = practice || answered
    if (!isPractice && remainingPlays <= 0) return

    setPlaying(true)
    setActiveSegment(null)
    const effectiveRate = slow ? slowRate : normalRate
    const started = playListeningItem(item, {
      rate: settings.ttsRate,
      rateFactor: effectiveRate / settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      navigationLocked: !answered,
      onSegment: (_segment, index) => setActiveSegment(index),
      onStatusChange: (status) => {
        const active = status === 'playing' || status === 'paused'
        setPlaying(active)
        if (!active) setActiveSegment(null)
      },
      onEnd: () => {
        setPlaying(false)
        setActiveSegment(null)
      },
    })
    if (!started) {
      setPlaying(false)
      return
    }
    if (isPractice) setPracticePlays((count) => count + 1)
    else setPlaysUsed((count) => count + 1)
  }

  useEffect(() => {
    setPlaysUsed(0)
    setPracticePlays(0)
    setPlaying(false)
    setActiveSegment(null)
    setShowTranscript(false)
    return stopListeningAudio
    // リスニングは準備前に始まらないよう、自動再生せず明示的な操作を待つ。
  }, [i, item?.id])

  // コンテンツ画面の「戻る」は履歴でなく、リスニングの内容選択画面へ。
  const backToListening = () => navigate('listening')

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">🎧</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる問題がありません</p>
        <Button onClick={backToListening}>もどる</Button>
      </div>
    )
  }

  const finish = () => {
    stopListeningAudio()
    navigate('sessionResult', {
      title: params.title ?? `英検${profile.label}`,
      mode: 'quiz',
      engine: 'listening',
      replayScreen: 'listeningQuiz',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong + results.current.unknown,
      reviewIds: results.current.wrongIds,
      source,
    })
  }

  const choose = (choiceId) => {
    if (answered) return
    setSelected(choiceId)
    setShowTranscript(true)
    if (choiceId === UNKNOWN_CHOICE_ID) {
      review(item.id, 'unknown', 'listening')
      results.current.unknown++
      results.current.wrongIds.push(item.id)
    } else if (choiceId === item.answer) {
      review(item.id, 'correct', 'listening')
      results.current.correct++
    } else {
      review(item.id, 'wrong', 'listening')
      results.current.wrong++
      results.current.wrongIds.push(item.id)
    }
  }

  const next = () => {
    stopListeningAudio()
    if (i + 1 >= deck.length) {
      finish()
      return
    }
    setI((current) => current + 1)
    setSelected(null)
    setPlaysUsed(0)
    setPracticePlays(0)
    setPlaying(false)
    setActiveSegment(null)
    setShowTranscript(false)
  }

  const quit = () => {
    stopListeningAudio()
    backToListening()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={quit} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1">
          <ProgressBar value={i / deck.length} color="#0ea5e9" />
        </div>
        <IconButton
          onClick={() => item && toggleNotebookItem('listening', item.id)}
          aria-label={saved ? `${item?.topic}をマイ学習ノートから外す` : `${item?.topic}をマイ学習ノートへ保存`}
          aria-pressed={saved}
          className={saved ? 'text-amber-600' : 'text-ink/30'}
        >
          {saved ? <BookmarkFilled size={20} /> : <Bookmark size={20} />}
        </IconButton>
        <SpeechSettingsButton compact />
        <SessionCounter
          index={i}
          total={deck.length}
          max={poolSize}
          onResize={(size, { discard }) => {
            if (discard) {
              setDeck(buildFor(size))
              setI(0)
              setSelected(null)
              setPlaysUsed(0)
              setPracticePlays(0)
              setShowTranscript(false)
              results.current = { correct: 0, wrong: 0, unknown: 0, wrongIds: [] }
            } else {
              setDeck((current) => growDeck(current, i + 1, buildFor(size), size))
            }
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Chip color="#0ea5e9">{profile.label}</Chip>
          <Chip color="#64748b">{typeMeta?.icon} {typeMeta?.label}</Chip>
          <span className="text-xs font-extrabold text-ink/45">
            {profile.benchmark}
          </span>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-sky-400 to-sky-600 p-5 text-white shadow-card">
          {!isTTSSupported() && (
            <p className="mb-3 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold">
              この端末では音声を再生できません。下の「放送文を表示」から本文をご確認ください。
            </p>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => play()}
              disabled={!isTTSSupported() || playing || (!answered && remainingPlays <= 0)}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform active:scale-90 disabled:opacity-45 disabled:active:scale-100"
              aria-label={answered ? '復習でもう一度聞く' : '音声を再生'}
            >
              <SpeakerWave size={40} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-extrabold">
                {playing
                  ? '音声を再生しています…'
                  : answered
                    ? '音声を聞き直す'
                    : playsUsed === 0
                      ? '問題を再生する'
                      : remainingPlays > 0
                        ? 'もう一度聞く'
                        : '本番形式での再生は終了'}
              </p>
              <p className="mt-1 text-xs font-bold text-white/80">
                本番形式での放送回数：{item.plays}回
              </p>
              <p className="mt-2 text-xs font-extrabold">
                解答前 {playsUsed}/{item.plays}回
                {practicePlays > 0 && (
                  <span className="ml-2 text-white/75">・復習 {practicePlays}回</span>
                )}
              </p>
              {playing && activeSegment !== null && (
                <p className="mt-1 text-[11px] font-bold text-white/70">
                  発話 {activeSegment + 1} を再生中
                </p>
              )}
            </div>
          </div>
          {!answered && playsUsed > 0 && remainingPlays > 0 && (
            <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-center text-xs font-bold leading-relaxed">
              あと{remainingPlays}回、本番と同じ条件で聞き直せます。
            </p>
          )}
          {!answered && remainingPlays <= 0 && (
            <p
              aria-live="polite"
              className="mt-3 rounded-xl bg-slate-900/15 px-3 py-2 text-xs font-bold leading-relaxed"
            >
              {playing
                ? '現在の音声が、解答前に聞ける最後の再生です。終了後は、聞き取れた内容をもとに解答してください。'
                : '本番形式での再生回数に達しました。これは、試験と同じ放送回数で練習するための設定です。聞き取れた内容をもとに解答してください。'}
              必要な場合は、下の「放送文を表示」から本文も確認できます。解答後は音声を何度でも聞き直せます。
            </p>
          )}
          {answered && (
            <p className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold leading-relaxed">
              解答後は、通常速度・ゆっくり速度のどちらでも何度でも復習できます。
            </p>
          )}
        </div>

        {item.visual && (
          <div
            className="mt-4 rounded-3xl border-2 border-sky-100 bg-white p-5 text-center shadow-card"
            aria-label={`イラスト問題：${item.topic}`}
          >
            <div className="text-5xl leading-relaxed" aria-hidden="true">{item.visual}</div>
            <p className="mt-1 text-xs font-extrabold text-ink/40">
              イラストを見ながら音声をお聞きください。
            </p>
          </div>
        )}

        <p className="mt-4 text-center text-sm font-extrabold text-ink/55">
          {PROMPTS[item.type]}
        </p>

        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-sky-100 bg-white shadow-card">
          <button
            type="button"
            onClick={() => setShowTranscript((visible) => !visible)}
            aria-expanded={showTranscript}
            aria-controls={`listening-transcript-${item.id}`}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sky-800 active:bg-sky-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100">
              {showTranscript ? <EyeOff size={19} /> : <Eye size={19} />}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-extrabold">
                {showTranscript ? '放送文を隠す' : '放送文を表示'}
              </span>
              <span className="mt-0.5 block text-[11px] font-bold leading-relaxed text-sky-700/65">
                英語の本文・質問・音声で読む選択肢を確認できます。
              </span>
            </span>
          </button>

          {showTranscript && (
            <div
              id={`listening-transcript-${item.id}`}
              className="border-t border-sky-100 bg-sky-50/60 px-4 py-3"
            >
              {!answered && (
                <p className="mb-3 rounded-xl bg-white px-3 py-2 text-[11px] font-bold leading-relaxed text-ink/50">
                  本文の表示は学習用のヒントです。本番形式で挑戦する場合は、解答後にご確認ください。
                </p>
              )}
              <div className="space-y-2">
                {spokenSegments.map((segment, index) => (
                  <div key={`${segment.speaker}-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 min-w-[4.5rem] rounded-lg bg-white px-2 py-1 text-center text-[10px] font-extrabold text-slate-600">
                      {SPEAKER_LABELS[segment.speaker] ?? segment.speaker}
                    </span>
                    <p className="text-sm font-bold leading-relaxed text-ink/75">
                      {segment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-2.5">
          {options.map((choice, displayIndex) => {
            const correct = choice.id === item.answer
            const chosen = selected === choice.id
            let tone = 'idle'
            if (answered) tone = correct ? 'correct' : chosen ? 'wrong' : 'dim'
            const hideText = typeMeta?.spokenChoices && !answered
            return (
              <button
                key={choice.id}
                disabled={answered}
                onClick={() => choose(choice.id)}
                aria-label={hideText ? `第${displayIndex + 1}番を選ぶ` : choice.text}
                className={cx(
                  'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition-all',
                  tone === 'idle' && 'border-brand-100 bg-white text-ink active:bg-brand-50 active:scale-[0.99]',
                  tone === 'correct' && 'border-emerald-400 bg-correct-soft text-emerald-800',
                  tone === 'wrong' && 'animate-shake border-rose-400 bg-wrong-soft text-rose-800',
                  tone === 'dim' && 'border-transparent bg-paper text-ink/35',
                )}
              >
                {hideText ? (
                  <span className="flex-1 py-0.5 text-center text-lg leading-relaxed">
                    第{displayIndex + 1}番を選ぶ
                  </span>
                ) : (
                  <>
                    <span
                      className={cx(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold',
                        tone === 'idle' && 'bg-sky-100 text-sky-700',
                        tone === 'correct' && 'bg-emerald-200 text-emerald-800',
                        tone === 'wrong' && 'bg-rose-200 text-rose-800',
                        tone === 'dim' && 'bg-ink/5 text-ink/35',
                      )}
                    >
                      {displayIndex + 1}
                    </span>
                    <span className="flex-1 leading-relaxed">{choice.text}</span>
                  </>
                )}
                {tone === 'correct' && <Check size={20} className="text-emerald-600" />}
                {tone === 'wrong' && <Close size={18} className="text-rose-500" />}
              </button>
            )
          })}
          <UnknownChoiceButton
            selected={selected === UNKNOWN_CHOICE_ID}
            disabled={answered}
            onClick={() => choose(UNKNOWN_CHOICE_ID)}
          />
        </div>

        {answered && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <p
              className={cx(
                'font-display text-lg font-extrabold',
                isCorrectPick ? 'text-emerald-600' : 'text-rose-500',
              )}
            >
              {isCorrectPick ? '正解！🎉' : selected === UNKNOWN_CHOICE_ID ? '答えはこちら' : 'ざんねん…'}
            </p>
            <p className="mt-1 font-bold leading-relaxed text-ink">
              正解：{correctChoice?.text}
            </p>

            <div className="mt-3 rounded-2xl bg-sky-50 p-3">
              <p className="text-sm font-extrabold leading-relaxed text-sky-900">
                {item.question}
              </p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-sky-800/70">
                {item.questionJa}
              </p>
            </div>

            <InstructorExplanation
              explanation={instructorExplanation}
              className="mt-3"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => play({ practice: true })}
                disabled={playing}
                className="rounded-xl bg-sky-100 px-3 py-2 text-xs font-extrabold text-sky-700 disabled:opacity-40"
              >
                🔊 通常速度で復習
              </button>
              <button
                onClick={() => play({ slow: true, practice: true })}
                disabled={playing}
                className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-700 disabled:opacity-40"
              >
                🐢 ゆっくり復習
              </button>
              <Chip color="#64748b">{item.topic}</Chip>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-4 backdrop-blur">
        <Button full size="lg" disabled={!answered} onClick={next}>
          {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  )
}
