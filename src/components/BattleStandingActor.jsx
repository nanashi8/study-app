import { useEffect, useState } from 'react'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

export function BattleStandingActor({
  student,
  pose = 'wind',
  phase = 'ready',
  defeated = false,
  className = '',
  label = '',
  fallback = null,
}) {
  const [sheetFailed, setSheetFailed] = useState(false)
  const sheetSrc = publicAssetUrl(student?.standingSheet)

  useEffect(() => {
    setSheetFailed(false)
  }, [sheetSrc])

  if (!sheetSrc || sheetFailed) return fallback

  return (
    <span
      className={[
        'battle-standing-actor',
        defeated ? 'battle-standing-actor-defeated' : '',
        className,
      ].filter(Boolean).join(' ')}
      data-battle-standing-student={student.id}
      data-battle-standing-pose={pose}
      data-battle-standing-phase={phase}
      data-battle-standing-sheet={sheetSrc}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      <span className="battle-standing-sprite" aria-hidden="true">
        <img
          src={sheetSrc}
          alt=""
          decoding="async"
          onError={() => setSheetFailed(true)}
        />
      </span>
    </span>
  )
}
