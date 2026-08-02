import { teacherPortraitProfile } from '../lib/teacherPortraits.js'
import { cx } from './ui.jsx'

function HairBack({ profile }) {
  switch (profile.hairStyle) {
    case 'bob':
      return <path d="M24 40Q24 16 48 14T73 40v27H23z" fill={profile.hair} />
    case 'ponytail':
      return <><circle cx="75" cy="39" r="13" fill={profile.hair} /><path d="M26 42Q25 17 49 15t22 29v22H25z" fill={profile.hair} /></>
    case 'bun':
      return <><circle cx="49" cy="13" r="11" fill={profile.hair} /><path d="M24 42Q23 17 48 15t25 27v23H24z" fill={profile.hair} /></>
    case 'long':
      return <path d="M21 43Q22 15 48 14t27 29v39H20z" fill={profile.hair} />
    case 'classic-bun':
      return <><circle cx="66" cy="16" r="10" fill={profile.hair} /><path d="M23 43Q23 18 48 15t25 28v34H22z" fill={profile.hair} /></>
    default:
      return null
  }
}

function HairFront({ profile }) {
  switch (profile.hairStyle) {
    case 'bob':
      return <path d="M25 39Q25 17 48 16t24 23l-7-7-4 12-7-14-7 13-7-12-9 9z" fill={profile.hair} />
    case 'short':
      return <path d="M27 36l3-14 9 3 6-9 7 8 10-5 7 17-10-7-8 7-9-7-8 8z" fill={profile.hair} />
    case 'parted':
    case 'formal':
    case 'silver':
      return <path d="M25 37Q27 17 47 16l2 17 8-14q12 5 14 19l-12-8-10 8-8-9-9 9z" fill={profile.hair} />
    case 'ponytail':
      return <path d="M26 38Q28 17 49 16q15 1 21 19l-17-8-6 12-8-10-9 10z" fill={profile.hair} />
    case 'bun':
    case 'classic-bun':
      return <path d="M25 38Q27 18 48 17t23 21l-12-9-9 10-8-11-11 11z" fill={profile.hair} />
    case 'swept':
      return <path d="M24 37q4-23 27-21 15 1 22 18l-11-3-5-10-7 15-11-8-9 10z" fill={profile.hair} />
    case 'cropped':
      return <path d="M27 34q5-18 21-19 17 1 22 19l-10-5-7 4-8-5-8 5z" fill={profile.hair} />
    case 'rough':
      return <path d="M25 37l5-17 8 4 6-10 7 10 9-7 4 9 7 11-12-7-8 8-9-9-10 9z" fill={profile.hair} />
    case 'long':
      return <path d="M24 39Q26 17 48 16t24 22l-15-9-7 11-9-12-10 12z" fill={profile.hair} />
    default:
      return <path d="M27 36q5-19 21-20 17 1 22 20l-12-7-9 8-9-8-9 8z" fill={profile.hair} />
  }
}

export function TeacherPortrait({
  teacher,
  teacherId,
  className = '',
  decorative = false,
  defeated = false,
}) {
  const profile = teacherPortraitProfile(teacherId ?? teacher)
  const label = `${teacher?.name ?? '先生'}の専用アイコン${teacher?.teacherSubject ? `。${teacher.teacherSubject}担当` : ''}`

  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      data-teacher-portrait={profile.id}
      data-defeated={defeated || undefined}
      className={cx('teacher-avatar-icon', className)}
      style={{ '--teacher-icon-accent': teacher?.accent ?? profile.accent }}
    >
      <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false">
        <rect width="96" height="96" rx="18" fill="#f8fafc" />
        <path d="M0 18h96M0 48h96M18 0v96M48 0v96M78 0v96" stroke={profile.accent} strokeOpacity=".13" />
        <circle cx="48" cy="43" r="34" fill={profile.accent} opacity=".2" />
        <HairBack profile={profile} />
        <path d="M19 96q3-29 29-29t29 29z" fill={profile.jacket} />
        <path d="M38 68l10 10 10-10 5 28H33z" fill="#f8fafc" />
        <path d="M44 68h8l3 10-7 9-7-9z" fill={profile.accent} />
        <rect x="42" y="58" width="12" height="15" rx="5" fill={profile.skin} />
        <ellipse cx="48" cy="43" rx="21" ry="24" fill={profile.skin} />
        <HairFront profile={profile} />
        <ellipse cx="40" cy="45" rx="2.2" ry="2.8" fill="#172033" />
        <ellipse cx="57" cy="45" rx="2.2" ry="2.8" fill="#172033" />
        {profile.glasses && (
          <g fill="none" stroke="#334155" strokeWidth="2">
            <rect x="33" y="39" width="14" height="11" rx="4" />
            <rect x="50" y="39" width="14" height="11" rx="4" />
            <path d="M47 44h3" />
          </g>
        )}
        <path d="M42 55q6 5 12 0" fill="none" stroke="#9f524f" strokeWidth="2" strokeLinecap="round" />
        {profile.beard && <path d="M34 54q14 18 28 0-2 17-14 17T34 54z" fill={profile.hair} opacity=".8" />}
        <rect x="5" y="5" width="26" height="22" rx="8" fill="#0f172a" opacity=".88" />
        <text x="18" y="21" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">{profile.initial}</text>
        <circle cx="78" cy="77" r="14" fill={profile.accent} stroke="white" strokeWidth="3" />
        <text x="78" y="83" textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="900">{profile.subjectMark}</text>
      </svg>
    </span>
  )
}
