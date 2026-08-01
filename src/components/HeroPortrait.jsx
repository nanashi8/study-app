import {
  heroEquipmentForLevel,
  titleForLevel,
} from '../lib/rpg.js'
import { cx } from './ui.jsx'

export function HeroPortrait({
  level = 1,
  title,
  className,
  attacking = false,
  damaged = false,
  guarding = false,
  decorative = false,
  showLevel = true,
}) {
  const safeLevel = Math.max(1, Math.min(99, Math.floor(level) || 1))
  const heroTitle = title ?? titleForLevel(safeLevel)
  const equipment = heroEquipmentForLevel(safeLevel)
  const equipped = Object.values(equipment).filter(Boolean)
  const tier =
    safeLevel >= 99
      ? 'crown'
      : safeLevel >= 80
        ? 'sky'
        : safeLevel >= 50
          ? 'knight'
          : safeLevel >= 20
            ? 'forest'
            : 'novice'
  const label = [
    `生徒レベル${safeLevel}、${heroTitle.name}`,
    equipped.length
      ? `装備：${equipped.map((relic) => relic.name).join('、')}`
      : null,
  ].filter(Boolean).join('。')

  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cx(
        'hero-portrait',
        `hero-portrait-${tier}`,
        attacking && 'hero-portrait-attacking',
        damaged && 'hero-portrait-damaged',
        guarding && 'hero-portrait-guarding',
        className,
      )}
    >
      {equipment.aura && (
        <span className="hero-gear hero-gear-aura" aria-hidden="true">
          {equipment.aura.emoji}
        </span>
      )}
      <span className="hero-portrait-glow" aria-hidden="true" />
      <span className="hero-portrait-base" aria-hidden="true">🧑‍🎓</span>
      {equipment.head && (
        <span className="hero-gear hero-gear-head" aria-hidden="true">
          {equipment.head.emoji}
        </span>
      )}
      {equipment.weapon && (
        <span className="hero-gear hero-gear-weapon" aria-hidden="true">
          {equipment.weapon.emoji}
        </span>
      )}
      {equipment.offhand && (
        <span className="hero-gear hero-gear-offhand" aria-hidden="true">
          {equipment.offhand.emoji}
        </span>
      )}
      {equipment.charm && (
        <span className="hero-gear hero-gear-charm" aria-hidden="true">
          {equipment.charm.emoji}
        </span>
      )}
      {showLevel && (
        <span className="hero-level-badge" aria-hidden="true">
          {safeLevel}
        </span>
      )}
    </div>
  )
}
