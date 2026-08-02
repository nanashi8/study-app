import { teacherPortraitProfile } from '../lib/teacherPortraits.js'
import { cx } from './ui.jsx'

export function TeacherPortrait({
  teacher,
  teacherId,
  className = '',
  decorative = false,
  defeated = false,
}) {
  const profile = teacherPortraitProfile(teacherId ?? teacher)
  const label = `${teacher?.name ?? '先生'}の専用ビジュアル${teacher?.teacherSubject ? `。${teacher.teacherSubject}担当` : ''}`

  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-teacher-portrait={profile.id}
      data-teacher-visual={profile.src}
      data-defeated={defeated || undefined}
      className={cx('teacher-avatar-icon', className)}
      style={{ '--teacher-icon-accent': teacher?.accent ?? profile.accent }}
    >
      <img
        src={profile.src}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    </span>
  )
}
