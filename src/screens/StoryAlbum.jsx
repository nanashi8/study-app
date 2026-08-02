import { useState } from 'react'
import { ScreenHeader } from '../components/AppShell.jsx'
import { TeacherPortrait } from '../components/TeacherPortrait.jsx'
import { cx } from '../components/ui.jsx'
import {
  AFTER_SCHOOL_BRANCHES,
  afterSchoolBranchScene,
} from '../lib/afterSchoolBonds.js'
import {
  battleStudentById,
  battleStudentPortrait,
} from '../lib/battleCast.js'
import { battleThemeById } from '../lib/battleThemes.js'
import { TEACHER_RIVALS } from '../lib/rpg.js'
import {
  normalizeStoryKeyVisualAlbum,
  storyKeyVisualAlbumCapacity,
} from '../lib/storyAlbum.js'
import { afterSchoolStoryArcById } from '../lib/storyProgression.js'
import { useStore } from '../store/useStore.js'

function StoryKeyVisualStage({ slot }) {
  if (!slot) {
    return (
      <div className="grid aspect-video place-items-center bg-[radial-gradient(circle_at_center,rgba(99,102,241,.28),transparent_55%),#0f172a] px-8 text-center">
        <div>
          <span className="text-3xl" aria-hidden="true">📕</span>
          <p className="mt-2 text-xs font-extrabold text-white">まだ記録されていません</p>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/45">
            放課後イベントを終えるか、先生の影蝕を解除するとキービジュアルが開きます。
          </p>
        </div>
      </div>
    )
  }

  if (slot.kind === 'event') {
    const student = battleStudentById(slot.branch.studentId)
    return (
      <div className="relative aspect-video overflow-hidden bg-slate-900">
        <img
          src={slot.scene.image}
          alt={`${slot.branch.title}。${slot.branch.location}`}
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
        <img
          src={battleStudentPortrait(student.id, 'determined')}
          alt={`${student.name}の決意した表情`}
          className="absolute bottom-3 right-3 h-20 w-20 rounded-2xl border-2 border-white/60 bg-slate-900 object-cover shadow-xl [image-rendering:pixelated]"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 pr-24">
          <p className="text-[8px] font-extrabold tracking-[0.13em] text-cyan-200">
            EVENT · FILE {String(slot.arc.number).padStart(2, '0')}
          </p>
          <h3 className="mt-1 font-display text-sm font-extrabold text-white">
            {slot.branch.title}
          </h3>
          <p className="mt-0.5 truncate text-[9px] font-bold text-white/55">
            {student.name} · {slot.arc.shortTitle}
          </p>
        </div>
      </div>
    )
  }

  const student = battleStudentById(slot.memory.studentId)
  return (
    <div className="relative aspect-video overflow-hidden bg-slate-900">
      <img
        src={slot.theme.stage}
        alt={`${slot.theme.name}の先生戦舞台`}
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      <img
        src={battleStudentPortrait(student.id, 'victory')}
        alt={`${student.name}の勝利した表情`}
        className="absolute bottom-3 left-3 h-20 w-20 rounded-2xl border-2 border-amber-200/70 bg-slate-900 object-cover shadow-xl [image-rendering:pixelated]"
      />
      <span className="absolute bottom-3 right-3 h-20 w-20 rounded-2xl border-2 border-cyan-100/60 bg-white shadow-xl">
        <TeacherPortrait
          teacher={slot.teacher}
          teacherId={slot.teacher.id}
          defeated
          className="h-full w-full"
        />
      </span>
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-slate-950/90 to-transparent p-3 pb-10 text-center">
        <p className="text-[8px] font-extrabold tracking-[0.13em] text-amber-200">
          TEACHER LIBERATION
        </p>
        <h3 className="mt-1 font-display text-sm font-extrabold text-white">
          {slot.teacher.name} · 影蝕解除
        </h3>
      </div>
    </div>
  )
}

export function StoryKeyVisualAlbum({ album }) {
  const normalized = normalizeStoryKeyVisualAlbum(album)
  const eventMemoryByBranch = new Map(
    normalized.events.map((memory) => [memory.branchId, memory]),
  )
  const teacherMemoryById = new Map(
    normalized.teacherVictories.map((memory) => [memory.teacherId, memory]),
  )
  const eventSlots = AFTER_SCHOOL_BRANCHES.map((branch) => {
    const memory = eventMemoryByBranch.get(branch.id)
    return {
      id: `event:${branch.id}`,
      kind: 'event',
      unlocked: Boolean(memory),
      memory,
      branch,
      scene: afterSchoolBranchScene(branch),
      arc: memory ? afterSchoolStoryArcById(memory.storyArcId) : null,
    }
  })
  const teacherSlots = Object.values(TEACHER_RIVALS).map((teacher) => {
    const memory = teacherMemoryById.get(teacher.id)
    return {
      id: `teacher:${teacher.id}`,
      kind: 'teacher',
      unlocked: Boolean(memory),
      memory,
      teacher,
      theme: memory
        ? battleThemeById(memory.themeId, Number.MAX_SAFE_INTEGER)
        : null,
    }
  })
  const [category, setCategory] = useState('event')
  const [selectedId, setSelectedId] = useState(() => (
    eventSlots.find((slot) => slot.unlocked)?.id
    ?? teacherSlots.find((slot) => slot.unlocked)?.id
    ?? null
  ))
  const visibleSlots = category === 'teacher' ? teacherSlots : eventSlots
  const selectedSlot = visibleSlots.find(
    (slot) => slot.id === selectedId && slot.unlocked,
  ) ?? visibleSlots.find((slot) => slot.unlocked) ?? null
  const unlockedCount = normalized.events.length + normalized.teacherVictories.length

  return (
    <section
      className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-card"
      aria-label="思い出キービジュアルアルバム"
    >
      <div className="flex items-start justify-between gap-3 p-4 pb-3">
        <div className="min-w-0">
          <p className="text-[9px] font-extrabold tracking-[0.18em] text-pink-200">
            KEY VISUAL MEMORY ALBUM
          </p>
          <h2 className="mt-0.5 font-display text-base font-extrabold">
            思い出キービジュアル
          </h2>
          <p className="mt-1 text-[9px] font-bold leading-relaxed text-white/50">
            仲間とのイベントと、先生の影蝕を解除した瞬間をいつでも振り返る。
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[8px] font-extrabold text-amber-100">
          {unlockedCount}/{storyKeyVisualAlbumCapacity()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 px-3 pb-3" role="tablist" aria-label="思い出の種類">
        {[
          { id: 'event', label: `🤝 出会い・イベント ${normalized.events.length}/${eventSlots.length}` },
          { id: 'teacher', label: `💮 先生戦 ${normalized.teacherVictories.length}/${teacherSlots.length}` },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            onClick={() => setCategory(item.id)}
            className={cx(
              'min-h-11 rounded-2xl border px-2 text-[9px] font-extrabold',
              category === item.id
                ? 'border-cyan-200 bg-cyan-300 text-slate-950'
                : 'border-white/10 bg-white/[0.05] text-white/60',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        <StoryKeyVisualStage slot={selectedSlot} />
      </div>

      <div
        className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3"
        role="group"
        aria-label="思い出キービジュアルを選ぶ"
      >
        {visibleSlots.map((slot) => {
          const selected = slot.id === selectedSlot?.id
          const label = slot.kind === 'event'
            ? slot.unlocked ? slot.branch.title : '未記録のイベント'
            : slot.unlocked ? `${slot.teacher.name}の影蝕解除` : '未解除の先生戦'
          const preview = slot.unlocked
            ? slot.kind === 'event' ? slot.scene.image : slot.theme?.preview
            : null
          return (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.unlocked}
              onClick={() => setSelectedId(slot.id)}
              aria-pressed={selected}
              aria-label={label}
              className={cx(
                'min-h-20 overflow-hidden rounded-2xl border text-left',
                selected && 'border-cyan-200 bg-white/15 ring-2 ring-cyan-300/25',
                slot.unlocked && !selected && 'border-white/10 bg-white/[0.05]',
                !slot.unlocked && 'cursor-not-allowed border-white/5 bg-white/[0.025]',
              )}
            >
              <span className="relative block aspect-video overflow-hidden bg-slate-900">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center bg-[radial-gradient(circle_at_center,rgba(99,102,241,.18),transparent_55%)] text-xl text-white/25">
                    🔒
                  </span>
                )}
                {!slot.unlocked && (
                  <span className="absolute inset-0 grid place-items-center bg-slate-950/65 text-lg">
                    🔒
                  </span>
                )}
              </span>
              <span className={cx(
                'block truncate px-2 py-2 text-[8px] font-extrabold',
                slot.unlocked ? 'text-white/75' : 'text-white/25',
              )}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function StoryAlbumScreen() {
  const album = useStore((state) => state.storyKeyVisualAlbum)

  return (
    <div className="pb-8" data-story-album-screen>
      <ScreenHeader
        title="おまけアルバム"
        subtitle="出会いと先生戦のキービジュアル"
      />
      <div className="space-y-3 px-4 pt-4">
        <aside className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
          <p className="text-[9px] font-extrabold tracking-[0.16em] text-violet-700">
            BONUS
          </p>
          <p className="mt-1 text-[10px] font-bold leading-relaxed text-ink/55">
            物語や対決の進行には影響しない、おまけの振り返り機能です。
          </p>
        </aside>
        <StoryKeyVisualAlbum album={album} />
      </div>
    </div>
  )
}
