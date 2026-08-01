import mobAtlas from '../assets/rpg-mob-atlas-v2.webp'
import { cx } from './ui.jsx'

const ATLAS_COLUMNS = 6
const ATLAS_ROWS = 4
const LAST_SPRITE = ATLAS_COLUMNS * ATLAS_ROWS - 1

const atlasPosition = (index, count) =>
  count <= 1 ? '0%' : `${((index / (count - 1)) * 100).toFixed(3)}%`

export function MobPortrait({
  encounter,
  className,
  hit = false,
  defeated = false,
  decorative = false,
  showBadge = true,
}) {
  const sprite = Math.max(
    0,
    Math.min(LAST_SPRITE, Math.floor(Number(encounter?.sprite) || 0)),
  )
  const column = sprite % ATLAS_COLUMNS
  const row = Math.floor(sprite / ATLAS_COLUMNS)
  const isTeacher = encounter?.isTeacher === true
  const label = isTeacher
    ? `${encounter.name}。${encounter.teacherSubject}の先生ライバル。必殺技は${encounter.move}`
    : `${encounter?.name ?? 'モンスター'}。${encounter?.element ?? '未知'}属性、${encounter?.species ?? '未確認種'}`

  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cx(
        'mob-avatar mob-portrait',
        isTeacher && 'teacher-portrait',
        hit && 'mob-portrait-hit',
        defeated && 'mob-portrait-defeated',
        className,
      )}
      style={{
        '--mob-accent': encounter?.accent ?? '#a78bfa',
        '--mob-scene': encounter?.chapterGradient ?? 'linear-gradient(135deg,#172554,#4c1d95)',
      }}
    >
      <span className="mob-avatar-grid" aria-hidden="true" />
      {isTeacher ? (
        <>
          <span className="teacher-portrait-face" aria-hidden="true">
            {encounter.portraitEmoji}
          </span>
          <span className="teacher-portrait-tool" aria-hidden="true">
            {encounter.attackEmoji}
          </span>
        </>
      ) : (
        <span className="mob-atlas-sprite-frame" aria-hidden="true">
          <span
            className="mob-atlas-sprite"
            style={{
              backgroundImage: `url(${mobAtlas})`,
              backgroundPosition: `${atlasPosition(column, ATLAS_COLUMNS)} ${atlasPosition(row, ATLAS_ROWS)}`,
              filter: `hue-rotate(${Number(encounter?.hue) || 0}deg) saturate(1.08)`,
              transform: encounter?.flip ? 'scaleX(-1)' : undefined,
            }}
          />
        </span>
      )}
      {showBadge && (
        <span className="mob-element-badge" aria-hidden="true">
          {encounter?.elementEmoji ?? '✦'}
        </span>
      )}
    </div>
  )
}
