import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  LITERATURE_KIND_META,
  getLiteratureWork,
} from '../data/public-domain-literature.js'
import {
  buildLiteratureNarration,
  narrationStepIndex,
} from '../lib/literature.js'
import {
  isTTSSupported,
  speakWith,
  stopSpeaking,
} from '../lib/tts.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, Card, Chip, IconButton, ProgressBar, cx } from '../components/ui.jsx'
import {
  Book,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Link,
  Close,
  SpeakerWave,
} from '../components/Icons.jsx'

const PACES = [
  { id: 'slow', label: 'ゆっくり', factor: 0.82 },
  { id: 'normal', label: '標準', factor: 1 },
  { id: 'brisk', label: '速め', factor: 1.14 },
]

export function LiteratureReaderScreen() {
  const workId = useStore((state) => state.params.workId)
  const navigate = useStore((state) => state.navigate)
  const settings = useStore((state) => state.settings)
  const readingsDone = useStore((state) => state.readingsDone)
  const markLiteratureDone = useStore((state) => state.markLiteratureDone)
  const myList = useStore((state) => state.myList)
  const addManyToMyList = useStore((state) => state.addManyToMyList)
  const kotenWordList = useStore((state) => state.kotenWordList)
  const kotenGrammarList = useStore((state) => state.kotenGrammarList)
  const addManyToKotenWordList = useStore((state) => state.addManyToKotenWordList)
  const addManyToKotenGrammarList = useStore((state) => state.addManyToKotenGrammarList)

  const work = getLiteratureWork(workId)
  const steps = useMemo(() => buildLiteratureNarration(work), [work])
  const [sceneIndex, setSceneIndex] = useState(0)
  const [phase, setPhase] = useState('original')
  const [paceId, setPaceId] = useState('normal')
  const [playing, setPlaying] = useState(false)
  const playToken = useRef(0)

  useEffect(
    () => () => {
      playToken.current += 1
      stopSpeaking()
    },
    [],
  )

  if (!work) {
    return (
      <div>
        <ScreenHeader title="名作交互朗読" />
        <div className="p-8 text-center font-bold text-ink/50">
          作品が見つかりませんでした。
        </div>
      </div>
    )
  }

  const meta = LITERATURE_KIND_META[work.kind]
  const currentScene = work.scenes[sceneIndex]
  const currentStep = narrationStepIndex(sceneIndex, phase)
  const completed = readingsDone.includes(work.id)
  const ttsSupported = isTTSSupported()
  const pace = PACES.find((item) => item.id === paceId) ?? PACES[1]
  const learnedIds = work.kind === 'english' ? myList : kotenWordList
  const savedWordCount = (work.kind === 'english' ? work.wordIds : work.kotenWordIds)
    .filter((id) => learnedIds.includes(id)).length
  const savedGrammarCount = work.grammarIds.filter((id) => kotenGrammarList.includes(id)).length

  const stopPlayback = () => {
    playToken.current += 1
    stopSpeaking()
    setPlaying(false)
  }

  const finishWork = () => {
    setPlaying(false)
    setSceneIndex(work.scenes.length - 1)
    setPhase('translation')
    markLiteratureDone(
      work.id,
      work.kind === 'english' ? 'reading' : 'koten_reading',
      work.scenes.length,
    )
  }

  const startPlayback = (fromStep = currentStep) => {
    if (!ttsSupported || !steps.length) return
    const token = playToken.current + 1
    playToken.current = token
    stopSpeaking()
    setPlaying(true)

    const playStep = (index) => {
      if (playToken.current !== token) return
      if (index >= steps.length) {
        finishWork()
        return
      }

      const step = steps[index]
      setSceneIndex(step.sceneIndex)
      setPhase(step.phase)
      const baseRate = Math.max(0.55, Math.min(1.45, settings.ttsRate * pace.factor))
      const rate = step.lang === 'ja-JP' ? Math.min(baseRate, 1.08) : baseRate

      speakWith(step.text, {
        lang: step.lang,
        rate,
        voiceURI: settings.ttsVoiceURI,
        onend: () => {
          if (playToken.current === token) playStep(index + 1)
        },
      })
    }

    playStep(Math.max(0, Math.min(fromStep, steps.length - 1)))
  }

  const moveToScene = (nextIndex) => {
    stopPlayback()
    setSceneIndex(Math.max(0, Math.min(nextIndex, work.scenes.length - 1)))
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
            background:
              work.kind === 'english'
                ? 'linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)'
                : 'linear-gradient(135deg,#451a03,#92400e,#7c2d12)',
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

        <Card className="overflow-hidden">
          <div className="border-b border-ink/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wide text-ink/40">
                  Scene {sceneIndex + 1}
                </p>
                <h2 className="font-display text-base font-extrabold text-ink">
                  {sceneIndex + 1} / {work.scenes.length} 場面
                </h2>
              </div>
              <Chip color={phase === 'original' ? meta.color : '#d97706'}>
                {phase === 'original'
                  ? work.kind === 'english'
                    ? '英語を再生中'
                    : '古文を再生中'
                  : work.kind === 'english'
                    ? '和訳を再生中'
                    : '現代語訳を再生中'}
              </Chip>
            </div>
            <ProgressBar
              value={(currentStep + (playing ? 0.5 : 0)) / steps.length}
              className="mt-3"
              color={meta.color}
            />
          </div>

          <div className="space-y-3 p-4" aria-live="polite">
            <section
              className={cx(
                'rounded-2xl border-2 p-4 transition-colors',
                phase === 'original'
                  ? 'border-teal-400 bg-teal-50'
                  : 'border-transparent bg-paper',
              )}
            >
              <div className="mb-2 flex items-center gap-2 text-teal-700">
                <SpeakerWave size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                  {work.kind === 'english' ? '原文 English' : '原文 古文'}
                </span>
              </div>
              <p
                className={cx(
                  'font-bold leading-[1.9] text-ink',
                  work.kind === 'classical' ? 'font-serif text-lg' : 'text-base',
                )}
              >
                {currentScene.original}
              </p>
              {work.kind === 'classical' && currentScene.speech && (
                <details className="mt-3 rounded-xl bg-white/70 px-3 py-2">
                  <summary className="cursor-pointer text-xs font-extrabold text-teal-800">
                    読み仮名を確認
                  </summary>
                  <p className="mt-2 text-sm font-bold leading-relaxed text-ink/55">
                    {currentScene.speech}
                  </p>
                </details>
              )}
            </section>

            <section
              className={cx(
                'rounded-2xl border-2 p-4 transition-colors',
                phase === 'translation'
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-transparent bg-paper',
              )}
            >
              <div className="mb-2 flex items-center gap-2 text-amber-700">
                <Book size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                  {work.kind === 'english' ? 'やさしい和訳' : 'わかりやすい現代語訳'}
                </span>
              </div>
              <p className="text-base font-bold leading-[1.9] text-ink">
                {currentScene.translation}
              </p>
            </section>

            <div className="rounded-2xl bg-violet-50 p-3">
              <p className="text-[11px] font-extrabold text-violet-700">読みのポイント</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-violet-950/70">
                {currentScene.guide}
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-4 gap-2">
          {work.scenes.map((_, index) => (
            <button
              key={index}
              onClick={() => moveToScene(index)}
              aria-label={`${index + 1}場面へ移動`}
              aria-current={sceneIndex === index ? 'step' : undefined}
              className={cx(
                'min-h-10 rounded-xl text-xs font-extrabold transition-colors',
                sceneIndex === index
                  ? 'text-white'
                  : readingsDone.includes(work.id)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-white text-ink/45 shadow-sm',
              )}
              style={sceneIndex === index ? { backgroundColor: meta.color } : undefined}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Card className="p-4">
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
        </Card>

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
          onClick={() =>
            markLiteratureDone(
              work.id,
              work.kind === 'english' ? 'reading' : 'koten_reading',
              work.scenes.length,
            )
          }
        >
          <Check size={17} /> {completed ? '読了として記録済み' : '読み終えたので記録する'}
        </Button>
      </div>

      <div className="sticky bottom-0 z-20 mt-5 border-t border-teal-100 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mb-2 flex items-center justify-center gap-1.5">
          <span className="mr-1 text-[11px] font-extrabold text-ink/40">速さ</span>
          {PACES.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                stopPlayback()
                setPaceId(item.id)
              }}
              aria-pressed={paceId === item.id}
              className={cx(
                'rounded-full px-3 py-1 text-[11px] font-extrabold',
                paceId === item.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-teal-50 text-teal-800/60',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => moveToScene(sceneIndex - 1)}
            disabled={sceneIndex === 0}
            aria-label="前の場面"
          >
            <ChevronLeft size={22} />
          </IconButton>
          {playing ? (
            <Button full variant="secondary" onClick={stopPlayback}>
              <Close size={17} /> 一時停止
            </Button>
          ) : (
            <Button full disabled={!ttsSupported} onClick={() => startPlayback(currentStep)}>
              <SpeakerWave size={17} /> ここから交互再生
            </Button>
          )}
          <IconButton
            onClick={() => moveToScene(sceneIndex + 1)}
            disabled={sceneIndex >= work.scenes.length - 1}
            aria-label="次の場面"
          >
            <ChevronRight size={22} />
          </IconButton>
        </div>
        <p className="mt-2 text-center text-[10px] font-bold text-ink/35">
          {work.kind === 'english' ? '英語原文 → 和訳' : '古文原文 → 現代語訳'}を場面ごとに再生
        </p>
      </div>
    </div>
  )
}
