import { useEffect, useState } from 'react'
import { publicAssetUrl } from '../lib/publicAssetUrl.js'

export function BattleOpponentStandingActor({
  opponent,
  phase = 'ready',
  defeated = false,
  className = '',
  label = '',
  fallback = null,
}) {
  const [failed, setFailed] = useState(false)
  const src = publicAssetUrl(opponent?.standing)
  const opponentId = opponent?.teacherId ?? opponent?.id

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) return fallback

  return (
    <span
      className={[
        'battle-opponent-standing-actor',
        defeated ? 'battle-opponent-standing-actor-defeated' : '',
        className,
      ].filter(Boolean).join(' ')}
      data-battle-standing-opponent={opponentId}
      data-battle-standing-phase={phase}
      data-battle-standing-src={src}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      <img
        src={src}
        alt=""
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
