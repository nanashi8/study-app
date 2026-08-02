import { Check } from './Icons.jsx'
import { TeacherPortrait } from './TeacherPortrait.jsx'
import { Card } from './ui.jsx'
import {
  BATTLE_STUDENTS,
  battleStudentBestSubjects,
  battleStudentPortrait,
  battleTeacherAffinity,
} from '../lib/battleCast.js'
import { isBattleStudentUnlocked } from '../lib/afterSchoolBonds.js'

export function BattleCompanionPicker({
  selectedStudent,
  opponent,
  encounter,
  teacherSubject,
  unlockedStudentIds,
  onSelect,
}) {
  const selectedAffinity = battleTeacherAffinity(selectedStudent.id, teacherSubject)
  const unlockedCount = unlockedStudentIds.length

  return (
    <Card className="w-full overflow-hidden p-0 text-left ring-1 ring-violet-100">
      <div className="bg-gradient-to-br from-indigo-950 via-violet-950 to-fuchsia-950 p-3.5 text-white">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.15em] text-cyan-200">
              BATTLE PREPARATION
            </p>
            <h2 className="mt-0.5 font-display text-base font-extrabold">
              この対決の同行者を選ぶ
            </h2>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-1 text-[9px] font-extrabold text-emerald-100">
            仲間 {unlockedCount}/{BATTLE_STUDENTS.length}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-2.5 py-2">
          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
            {encounter.isTeacher ? (
              <TeacherPortrait teacher={encounter} className="h-full w-full" />
            ) : (
              <img
                src={opponent.portrait}
                alt=""
                className="h-full w-full object-cover [image-rendering:pixelated]"
              />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold text-white/60">
              今回の相手
            </p>
            <p className="truncate text-xs font-extrabold">{opponent.name}</p>
            <p className="text-[9px] font-bold text-white/55">
              {teacherSubject}との相性を成績から確認
            </p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div
          className="grid grid-cols-2 gap-2"
          role="group"
          aria-label={`${opponent.name}との対決に同行するクラスメート`}
        >
          {BATTLE_STUDENTS.map((student) => {
            const affinity = battleTeacherAffinity(student.id, teacherSubject)
            const selected = student.id === selectedStudent.id
            const unlocked = isBattleStudentUnlocked(unlockedStudentIds, student.id)
            const shortName = student.name.match(/[ァ-ヶー].*$/u)?.[0] ?? student.name
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => unlocked && onSelect(student.id)}
                disabled={!unlocked}
                aria-pressed={selected}
                aria-label={unlocked
                  ? `${student.name}。得意科目${battleStudentBestSubjects(student.id).join('、')}。${teacherSubject}に対し、${affinity.gradeBasisLabel}評定${affinity.grade}、${affinity.label}、${affinity.bonusLabel}`
                  : 'まだ出会っていないクラスメイト。放課後イベントで仲間になります。'}
                className={`flex min-h-[66px] items-center gap-2 rounded-2xl border p-2 transition-transform active:scale-[0.98] ${selected ? 'border-violet-400 bg-violet-50 ring-2 ring-violet-100' : unlocked ? 'border-ink/10 bg-paper' : 'cursor-not-allowed border-ink/5 bg-slate-100 opacity-65'}`}
              >
                <img
                  src={battleStudentPortrait(student.id, selected ? 'delighted' : 'idle')}
                  alt=""
                  loading="lazy"
                  className={`h-11 w-11 shrink-0 rounded-xl object-cover [image-rendering:pixelated] ${unlocked ? '' : 'brightness-0'}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1">
                    <strong className="truncate text-[10px] font-extrabold text-ink">
                      {unlocked ? shortName : '？？？'}
                    </strong>
                    {selected && <Check size={13} className="shrink-0 text-violet-600" />}
                  </span>
                  <span className="mt-0.5 block text-[8px] font-extrabold" style={{ color: unlocked ? affinity.color : '#64748b' }}>
                    {unlocked
                      ? `${affinity.gradeBasisLabel} ${affinity.grade} · ${affinity.emoji}${affinity.label}`
                      : '🔒 放課後で出会う'}
                  </span>
                  <span className="block truncate text-[7px] font-bold text-ink/40">
                    {unlocked ? `得意：${battleStudentBestSubjects(student.id).join('・')}` : 'イベントを終えると共闘可能'}
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-violet-50 px-3 py-2.5">
          <img
            src={battleStudentPortrait(selectedStudent.id, 'confident')}
            alt=""
            className="h-10 w-10 shrink-0 rounded-xl object-cover [image-rendering:pixelated]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-extrabold text-violet-950">
              同行：{selectedStudent.name} · {selectedAffinity.emoji} {selectedAffinity.label}
            </p>
            <p className="text-[8px] font-bold text-violet-700">
              {selectedAffinity.gradeBasisLabel} 評定{selectedAffinity.grade} · {selectedAffinity.bonusLabel}
            </p>
          </div>
          <span className="shrink-0 text-[8px] font-extrabold text-violet-500">
            選択中
          </span>
        </div>

        <p className="mt-2 text-[8px] font-bold leading-relaxed text-ink/40">
          同行者は次回まで保存されます。
          苦手相性でも正答率・XP・SRS・敵ランク・決着条件は変わりません。
        </p>
      </div>
    </Card>
  )
}
