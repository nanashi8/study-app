import { useState } from 'react'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Button, cx } from '../components/ui.jsx'
import { ArrowRight, Check } from '../components/Icons.jsx'
import { useStore } from '../store/useStore.js'
import {
  battleEmotionById,
  battleStudentById,
  battleStudentLifestylePortrait,
  battleStudentPortrait,
  battleSupportStyleById,
} from '../lib/battleCast.js'
import {
  AFTER_SCHOOL_CHRONICLE,
  afterSchoolEpisodeNumber,
  afterSchoolScene,
} from '../lib/afterSchoolStory.js'

function publicAssetUrl(path) {
  return `${import.meta.env.BASE_URL}${String(path ?? '').replace(/^\//, '')}`
}

function scenePortrait(scene, studentId, emotionId) {
  if (scene.outfitId === 'home' || scene.outfitId === 'weekend') {
    return battleStudentLifestylePortrait(studentId, scene.outfitId)
  }
  return battleStudentPortrait(studentId, emotionId)
}

export function AfterSchoolInterludeScreen() {
  const params = useStore((state) => state.params)
  const goHome = useStore((state) => state.goHome)
  const storyStep = useStore((state) => state.battleStoryStep)
  const advanceBattleStory = useStore((state) => state.advanceBattleStory)
  const returnToChronicle = useStore((state) => state.returnToAfterSchoolChronicle)
  const [choiceId, setChoiceId] = useState(null)

  const scene = afterSchoolScene({ sceneId: params.sceneId, step: storyStep })
  const episode = scene.episode
  const speaker = battleStudentById(episode.speakerId)
  const selectedChoice = episode.choices.find((choice) => choice.id === choiceId) ?? null
  const episodeNumber = afterSchoolEpisodeNumber(storyStep)
  const finishEpisode = () => {
    if (!selectedChoice) return
    advanceBattleStory()
    returnToChronicle()
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 pb-8 text-white">
      <ScreenHeader
        title={`${AFTER_SCHOOL_CHRONICLE.shortTitle}・放課後日誌`}
        subtitle={params.fromBattle ? 'ことばの対決、そのあとの一幕' : '次の課題へ向かう前の一幕'}
        onBack={returnToChronicle}
        color="#0f172a"
        inverse
      />

      <div className="space-y-4 px-4">
        <section className="after-school-interlude-hero relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 shadow-2xl">
          <img
            src={publicAssetUrl(scene.image)}
            alt={`${scene.name}。${scene.description}`}
            className="aspect-[16/10] w-full object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-white/20 bg-slate-950/65 px-2 py-1 text-[8px] font-extrabold tracking-[0.12em] backdrop-blur-sm">
                JOURNAL {String(episodeNumber).padStart(2, '0')}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[8px] font-extrabold text-amber-100 backdrop-blur-sm">
                {scene.emoji} {scene.time}
              </span>
            </div>
            <h1 className="mt-2 font-display text-xl font-extrabold leading-tight">
              {scene.name}
            </h1>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/65">
              {scene.description}
            </p>
          </div>
        </section>

        {params.fromBattle && (
          <section className="rounded-2xl border border-amber-200/20 bg-amber-100/10 px-3 py-2.5 text-[10px] font-bold leading-relaxed text-amber-50">
            <span className="font-extrabold text-amber-200">ことばの対決を終えて：</span>
            {' '}{params.rivalName ?? '今日の相手'}との課題を終え、校内の日常へ戻りました。
          </section>
        )}

        <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-4 shadow-xl backdrop-blur-sm">
          <p className="text-[9px] font-extrabold tracking-[0.16em] text-pink-200">
            TODAY'S STORY
          </p>
          <h2 className="mt-1 font-display text-lg font-extrabold">{episode.title}</h2>
          <p className="mt-2 text-[11px] font-bold leading-relaxed text-white/60">
            {episode.situation}
          </p>

          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/55 p-3">
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-pink-200/25 bg-slate-900">
              <img
                src={publicAssetUrl(scenePortrait(scene, speaker.id, episode.openingEmotionId))}
                alt={`${speaker.name}の${battleEmotionById(episode.openingEmotionId).label}の表情`}
                className="h-full w-full object-cover [image-rendering:pixelated]"
              />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-extrabold text-cyan-200">
                {speaker.name} · {speaker.club}
              </span>
              <p className="mt-1 text-xs font-extrabold leading-relaxed">{episode.opening}</p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div>
              <h3 className="text-sm font-extrabold">どんな声をかける？</h3>
              <p className="mt-0.5 text-[9px] font-bold text-white/40">
                採点なし・学習評価には影響しません
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-extrabold text-white/55">
              3 CHOICES
            </span>
          </div>

          <div className="mt-2.5 grid gap-2" role="group" aria-label={`${speaker.name}への声かけ`}>
            {episode.choices.map((choice) => {
              const style = battleSupportStyleById(choice.styleId)
              const selected = selectedChoice?.id === choice.id
              return (
                <button
                  key={choice.id}
                  type="button"
                  onClick={() => setChoiceId(choice.id)}
                  aria-pressed={selected}
                  className={cx(
                    'min-h-14 rounded-2xl border px-3 py-2.5 text-left transition-transform active:scale-[0.99]',
                    selected
                      ? 'border-pink-200 bg-pink-300/20 ring-2 ring-pink-300/20'
                      : 'border-white/10 bg-white/[0.06]',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-base">
                      {style.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[8px] font-extrabold text-amber-200">
                        {style.label}
                      </span>
                      <strong className="mt-0.5 block text-[11px] font-extrabold leading-relaxed">
                        {choice.label}
                      </strong>
                    </span>
                    {selected && <Check size={17} className="shrink-0 text-pink-200" />}
                  </span>
                </button>
              )
            })}
          </div>

          {selectedChoice && (
            <div
              key={selectedChoice.id}
              className="battle-expression-change mt-3 flex items-start gap-3 rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/15 to-violet-400/10 p-3"
              role="status"
              aria-live="polite"
            >
              <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-cyan-100/25 bg-slate-900">
                <img
                  src={publicAssetUrl(scenePortrait(scene, speaker.id, selectedChoice.emotionId))}
                  alt={`${speaker.name}の${battleEmotionById(selectedChoice.emotionId).label}の表情`}
                  className="h-full w-full object-cover [image-rendering:pixelated]"
                />
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-extrabold text-cyan-100">
                  {speaker.name}の返事 · {battleEmotionById(selectedChoice.emotionId).emoji}
                </span>
                <p className="mt-1 text-xs font-extrabold leading-relaxed">
                  {selectedChoice.reply}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="space-y-2">
          <Button full size="lg" disabled={!selectedChoice} onClick={finishEpisode}>
            日誌に残して校内へ <ArrowRight size={19} />
          </Button>
          <Button full variant="ghost" className="text-white/65 active:bg-white/10" onClick={goHome}>
            今回はここで終える
          </Button>
        </div>
      </div>
    </div>
  )
}
