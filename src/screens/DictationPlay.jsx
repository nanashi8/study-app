import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import { buildDictationDeck, DICTATION_PROFILES } from '../data/dictation.js'
import { scoreDictationSelection } from '../lib/dictation.js'
import {
  buildWritingTokenText,
  shuffledWritingTokens,
  writingTokenPositionResults,
  writingWordTokens,
} from '../lib/writing.js'
import { isTTSSupported } from '../lib/tts.js'
import {
  dismissSpeechPlayer,
  playSpeechItems,
} from '../lib/speech-player.js'
import { buildDictationInstructorExplanation } from '../lib/instructorExplanations.js'
import { Button, Chip, ProgressBar, IconButton, cx } from '../components/ui.jsx'
import { InstructorExplanation } from '../components/InstructorExplanation.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Close, ArrowRight, SpeakerWave, Check } from '../components/Icons.jsx'

const clampRate = (rate) => Math.max(0.55, Math.min(1.25, rate))

const buildWordBank = (item) =>
  shuffledWritingTokens(
    item?.text ?? '',
    `${item?.id ?? 'dictation'}:${Date.now()}:${Math.random()}`,
  )

export function DictationPlayScreen() {
  const params = useStore((s) => s.params)
  const navigate = useStore((s) => s.navigate)
  const back = useStore((s) => s.back)
  const review = useStore((s) => s.review)
  const settings = useStore((s) => s.settings)

  const source = params.source ?? { type: 'level', levelId: '5' }
  const [deck] = useState(() =>
    buildDictationDeck(source, {
      size: source.type === 'dictationList' ? 0 : 8,
    }),
  )
  const [i, setI] = useState(0)
  const [wordBank, setWordBank] = useState(() => buildWordBank(deck[0]))
  const [answerTokens, setAnswerTokens] = useState([])
  const [wrongSelections, setWrongSelections] = useState(0)
  const [result, setResult] = useState(null)
  const [normalPlays, setNormalPlays] = useState(0)
  const [slowPlays, setSlowPlays] = useState(0)
  const results = useRef({ correct: 0, wrong: 0, wrongIds: [] })

  const item = deck[i]
  const profile = DICTATION_PROFILES[item?.level ?? source.levelId] ?? DICTATION_PROFILES['5']
  const userRateScale = (settings.ttsRate ?? 0.9) / 0.9
  const normalRate = clampRate(profile.rate * userRateScale)
  const slowRate = clampRate(profile.slowRate * userRateScale)
  const targetTokens = writingWordTokens(item?.text ?? '')
  const positionResults = writingTokenPositionResults(
    answerTokens,
    item?.text ?? '',
  )
  const hasIncorrectPosition = positionResults.some((correct) => !correct)
  const sentenceComplete =
    targetTokens.length > 0 &&
    answerTokens.length === targetTokens.length &&
    positionResults.every(Boolean)
  const arrangedText = buildWritingTokenText(answerTokens)

  const play = (slow = false) => {
    if (!item) return
    const effectiveRate = slow ? slowRate : normalRate
    playSpeechItems([{
      text: item.text,
      label: item.text,
      style: 'listening',
      rateFactor: effectiveRate / settings.ttsRate,
      minRate: 0.55,
      maxRate: 1.25,
    }], {
      title: slow ? 'ディクテーション・ゆっくり' : 'ディクテーション',
      rate: settings.ttsRate,
      voiceURI: settings.ttsVoiceURI,
      japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
      onPlayStart: () => {
        if (slow) setSlowPlays((count) => count + 1)
        else setNormalPlays((count) => count + 1)
      },
    })
  }

  useEffect(() => {
    setNormalPlays(0)
    setSlowPlays(0)
    if (settings.autoSpeak !== false) play()
    return dismissSpeechPlayer
    // 設問が変わったときだけ、その級の速度で自動再生する。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, item?.id])

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="text-5xl">⌨️</div>
        <p className="font-display text-lg font-extrabold text-ink">出題できる英文がありません</p>
        <Button onClick={back}>もどる</Button>
      </div>
    )
  }

  const finish = () => {
    navigate('sessionResult', {
      title: params.title ?? `英検${profile.label}`,
      mode: 'quiz',
      engine: 'dictation',
      replayScreen: 'dictationPlay',
      total: deck.length,
      correct: results.current.correct,
      wrong: results.current.wrong,
      reviewIds: results.current.wrongIds,
      source,
    })
  }

  const check = () => {
    if (!sentenceComplete || result) return
    const checked = scoreDictationSelection(item.text, wrongSelections, {
      passScore: profile.passScore,
    })
    setResult(checked)
    review(
      item.id,
      checked.passed ? 'correct' : checked.score >= 60 ? 'wrong' : 'unknown',
      'dictation',
    )
    if (checked.passed) {
      results.current.correct++
    } else {
      results.current.wrong++
      results.current.wrongIds.push(item.id)
    }
  }

  const placeWord = (token) => {
    if (result || sentenceComplete) return
    const nextPosition = answerTokens.length
    if (token.word !== targetTokens[nextPosition]?.word) {
      setWrongSelections((count) => count + 1)
    }
    setWordBank((items) => items.filter((entry) => entry.id !== token.id))
    setAnswerTokens((items) => [...items, token])
  }

  const returnWord = (token) => {
    if (result || sentenceComplete) return
    setAnswerTokens((items) => items.filter((entry) => entry.id !== token.id))
    setWordBank((items) => [...items, token])
  }

  const next = () => {
    if (i + 1 >= deck.length) {
      finish()
      return
    }
    const nextItem = deck[i + 1]
    setI((current) => current + 1)
    setWordBank(buildWordBank(nextItem))
    setAnswerTokens([])
    setWrongSelections(0)
    setResult(null)
  }

  const playGoal =
    profile.recommendedPlays === 1 ? '通常速度1回で聞き取る' : `通常速度${profile.recommendedPlays}回以内`

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-3 py-3">
        <IconButton onClick={back} aria-label="やめる"><Close size={22} /></IconButton>
        <div className="flex-1"><ProgressBar value={i / deck.length} color="#14b8a6" /></div>
        <SpeechSettingsButton compact />
        <span className="w-12 text-right text-sm font-extrabold text-ink/50">{i + 1}/{deck.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Chip color="#14b8a6">{profile.label}</Chip>
          <Chip color="#64748b">{item.kind}</Chip>
          <span className="text-xs font-extrabold text-ink/45">{targetTokens.length}語・{profile.benchmark}</span>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-teal-400 to-teal-600 p-5 text-white shadow-card">
          {!isTTSSupported() && (
            <p className="mb-3 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold">
              この端末は音声合成に対応していません
            </p>
          )}
          <div className="flex items-center gap-4">
            <button
              onClick={() => play(false)}
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform active:scale-90"
              aria-label="通常速度でもう一度聞く"
            >
              <SpeakerWave size={40} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-extrabold">聞こえた順に選ぼう</p>
              <p className="mt-1 text-xs font-bold text-white/80">目標：{playGoal}</p>
              <p className="mt-2 text-xs font-extrabold">
                通常 {normalPlays}回
                {slowPlays > 0 && <span className="ml-2 text-white/75">・ゆっくり {slowPlays}回</span>}
              </p>
            </div>
          </div>
          <button
            onClick={() => play(true)}
            className="mt-4 w-full rounded-2xl bg-white/15 px-3 py-2 text-xs font-extrabold transition-colors active:bg-white/25"
          >
            🐢 練習用のゆっくり再生
          </button>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-sm font-extrabold text-ink">
                聞こえた英文
              </h2>
              <p className="mt-0.5 text-[11px] font-bold text-ink/45">
                単語カードを文の先頭から選びます
              </p>
            </div>
            <span className="shrink-0 text-xs font-extrabold text-ink/40">
              {answerTokens.length}/{targetTokens.length}語
            </span>
          </div>

          <div
            className={cx(
              'mt-3 min-h-28 rounded-[1.5rem] border-2 p-3 transition-colors',
              sentenceComplete && 'border-emerald-400 bg-emerald-50',
              !sentenceComplete &&
                hasIncorrectPosition &&
                'border-rose-300 bg-rose-50',
              !sentenceComplete &&
                !hasIncorrectPosition &&
                answerTokens.length > 0 &&
                'border-emerald-300 bg-emerald-50/60',
              !answerTokens.length && 'border-dashed border-brand-200 bg-paper/50',
            )}
          >
            {answerTokens.length ? (
              <div
                className="flex flex-wrap gap-2"
                aria-label={`現在の語順: ${arrangedText}`}
              >
                {answerTokens.map((token, index) => {
                  const correctPosition = positionResults[index]
                  return (
                    <button
                      key={token.id}
                      onClick={() => returnWord(token)}
                      disabled={sentenceComplete || !!result}
                      aria-label={`${index + 1}番目 ${token.word}。${
                        correctPosition
                          ? '正しい位置'
                          : 'この位置ではありません'
                      }${sentenceComplete || result ? '' : '。タップして戻す'}`}
                      className={cx(
                        'inline-flex max-w-full animate-pop-in items-center gap-1.5 break-words rounded-xl border-2 px-2.5 py-2 font-display text-sm font-extrabold shadow-sm transition-all',
                        correctPosition
                          ? 'border-emerald-400 bg-emerald-100 text-emerald-900'
                          : 'border-rose-300 bg-rose-50 text-rose-700',
                        !sentenceComplete && !result && 'active:scale-95',
                      )}
                    >
                      {token.word}
                      {correctPosition ? (
                        <Check size={14} className="shrink-0 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <Close size={14} className="shrink-0 text-rose-500" aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex min-h-20 items-center justify-center px-4 text-center text-xs font-bold leading-relaxed text-ink/35">
                音声を聞いて、下の単語カードを
                <br />
                文の先頭からタップしよう
              </div>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {answerTokens.length > 0 &&
              `${answerTokens.length}番目の${answerTokens.at(-1).word}は、${
                positionResults.at(-1)
                  ? '正しい位置です'
                  : 'この位置ではありません'
              }`}
          </p>

          {hasIncorrectPosition && !result && (
            <div
              role="alert"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-rose-100 px-3 py-2.5 text-xs font-extrabold text-rose-700"
            >
              <Close size={16} className="shrink-0" />
              赤いカードはその位置ではありません。タップして戻そう。
            </div>
          )}

          {sentenceComplete && !result && (
            <div
              role="status"
              className="mt-2 flex items-center gap-2 rounded-2xl bg-emerald-100 px-3 py-2.5 text-xs font-extrabold text-emerald-700"
            >
              <Check size={16} className="shrink-0" />
              正しい語順です！ 答えを確定しよう。
            </div>
          )}

          {!sentenceComplete && !result && (
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <p className="text-[11px] font-extrabold text-ink/48">
                  単語カード
                </p>
                <p className="text-[10px] font-bold text-ink/35">
                  正しい位置はすぐ緑になります
                </p>
              </div>
              <div className="flex min-h-24 flex-wrap content-start gap-2 rounded-[1.5rem] bg-teal-50 p-3">
                {wordBank.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => placeWord(token)}
                    aria-label={`${token.word}を次に置く`}
                    className="max-w-full break-words rounded-xl border border-teal-100 bg-white px-2.5 py-2 font-display text-sm font-extrabold text-ink shadow-[0_3px_8px_-4px_rgba(15,118,110,0.45)] transition-transform active:scale-95"
                  >
                    {token.word}
                  </button>
                ))}
                {!wordBank.length && (
                  <p className="m-auto text-xs font-extrabold text-teal-700/55">
                    赤いカードをタップして語順を直そう
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-4 animate-slide-up rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className={cx(
                    'font-display text-lg font-extrabold',
                    result.exact ? 'text-emerald-600' : result.passed ? 'text-teal-600' : 'text-amber-600',
                  )}
                >
                  {result.exact ? 'ノーミスで完成！' : result.passed ? '練習クリア！' : '並べ直して完成！'}
                </p>
                <p className="mt-0.5 text-xs font-bold text-ink/45">
                  {result.correctWords}/{result.target.length}語を迷わず選択・クリア基準 {profile.passScore}%
                </p>
              </div>
              <span
                className="font-display text-3xl font-extrabold"
                style={{ color: result.passed ? '#0f9f8f' : '#f59e0b' }}
              >
                {result.score}%
              </span>
            </div>

            <div className="mt-3 border-t border-brand-50 pt-3">
              <p className="text-[11px] font-extrabold text-ink/40">選択の記録</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-ink/65">
                {result.wrongSelections === 0
                  ? 'すべての単語を一度で正しい位置へ置けました。'
                  : `別の位置のカードを${result.wrongSelections}回選び、確認しながら完成しました。`}
              </p>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-brand-50/70 p-3">
              <span className="mt-0.5 shrink-0 text-emerald-500"><Check size={16} /></span>
              <div>
                <p className="font-bold leading-relaxed text-ink">{item.text}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-ink/55">{item.ja}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Chip color="#0f9f8f">{item.topic}</Chip>
              <Chip color="#6366f1">{item.focus}</Chip>
              <span className="self-center text-[11px] font-bold text-ink/45">
                通常再生 {normalPlays}回{slowPlays ? `・ゆっくり ${slowPlays}回` : ''}
              </span>
            </div>
            <InstructorExplanation
              explanation={buildDictationInstructorExplanation(item, result)}
              className="mt-3"
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-brand-100 bg-white/90 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur">
        {!result ? (
          <Button full size="lg" disabled={!sentenceComplete} onClick={check}>
            {sentenceComplete
              ? '答えを確定する'
              : hasIncorrectPosition
                ? '赤いカードを直そう'
                : `あと${wordBank.length}語を選ぼう`}
          </Button>
        ) : (
          <Button full size="lg" onClick={next}>
            {i + 1 >= deck.length ? '結果を見る' : '次へ'} <ArrowRight size={18} />
          </Button>
        )}
      </div>
    </div>
  )
}
