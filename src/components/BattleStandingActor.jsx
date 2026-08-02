import { useEffect, useState } from 'react'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(media.matches)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  return prefersReducedMotion
}

export function BattleStandingActor({
  student,
  pose = 'wind',
  phase = 'ready',
  motionSrc = null,
  motionActive = false,
  posterSrc = null,
  defeated = false,
  className = '',
  label = '',
  fallback = null,
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [sheetFailed, setSheetFailed] = useState(false)
  const [motionFailed, setMotionFailed] = useState(false)
  const sheetSrc = publicAssetUrl(student?.standingSheet)
  const resolvedMotionSrc = publicAssetUrl(motionSrc)
  const resolvedPosterSrc = publicAssetUrl(posterSrc)
  const showMotion = Boolean(
    motionActive
      && resolvedMotionSrc
      && !prefersReducedMotion
      && !motionFailed,
  )

  useEffect(() => {
    setSheetFailed(false)
  }, [sheetSrc])

  useEffect(() => {
    setMotionFailed(false)
  }, [resolvedMotionSrc])

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
      data-battle-standing-motion={showMotion ? resolvedMotionSrc : undefined}
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

      {showMotion && (
        <span className="battle-standing-motion-cut-in" aria-hidden="true">
          <video
            key={resolvedMotionSrc}
            src={resolvedMotionSrc}
            poster={resolvedPosterSrc || undefined}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => setMotionFailed(true)}
          />
        </span>
      )}
    </span>
  )
}
