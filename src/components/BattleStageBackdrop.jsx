export function BattleStageBackdrop({
  scene = 'linear-gradient(135deg,#312e81,#0f172a)',
  phase = 'ready',
  className = '',
}) {
  return (
    <span
      className={[
        'battle-stage-backdrop',
        className,
      ].filter(Boolean).join(' ')}
      data-battle-stage-backdrop
      data-battle-backdrop-phase={phase}
      style={{ '--battle-backdrop-scene': scene }}
      aria-hidden="true"
    >
      <span className="battle-stage-backdrop-motion">
        <span className="battle-stage-backdrop-image" />
      </span>
      <span className="battle-stage-backdrop-atmosphere">
        <i />
        <i />
        <i />
      </span>
    </span>
  )
}
