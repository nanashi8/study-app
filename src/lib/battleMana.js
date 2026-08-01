export const BATTLE_MANA_AFFINITIES = [
  {
    id: 'insight',
    name: '星図術式',
    glyph: '✦',
    style: 'facet',
    description: '結晶のような直線で術式を精密に組み立てる',
  },
  {
    id: 'empathy',
    name: '水鏡術式',
    glyph: '≋',
    style: 'wave',
    description: '呼吸に合わせた波紋でマナを受け渡す',
  },
  {
    id: 'harmony',
    name: '翠環術式',
    glyph: '❋',
    style: 'orbit',
    description: '複数の光を周回させて力を一つに束ねる',
  },
  {
    id: 'resolve',
    name: '花印術式',
    glyph: '✿',
    style: 'bloom',
    description: '花弁状の印を重ね、守る意志を力へ変える',
  },
  {
    id: 'courage',
    name: '雷駆術式',
    glyph: 'ϟ',
    style: 'surge',
    description: '稲妻の脈動でマナを一気に加速させる',
  },
]

export const BATTLE_MANA_SEQUENCES = [
  {
    id: 'focus',
    label: 'マナ集束',
    phases: ['呼吸', '集束', '周回', '待機'],
  },
  {
    id: 'cast',
    label: '攻勢術式',
    phases: ['集束', '紋章展開', '射出', '命中'],
  },
  {
    id: 'ward',
    label: '防壁術式',
    phases: ['感知', '障壁展開', '受け止め', '散開'],
  },
  {
    id: 'restore',
    label: '治癒術式',
    phases: ['採光', '循環', '治癒', '余韻'],
  },
  {
    id: 'break',
    label: '迎撃術式',
    phases: ['敵術式接近', '迎撃', '衝撃', '残光'],
  },
  {
    id: 'triumph',
    label: '勝利術式',
    phases: ['残存マナ回収', '周回', '勝利紋', '星光'],
  },
]

const AFFINITY_BY_ID = new Map(
  BATTLE_MANA_AFFINITIES.map((affinity) => [affinity.id, affinity]),
)
const SEQUENCE_BY_ID = new Map(
  BATTLE_MANA_SEQUENCES.map((sequence) => [sequence.id, sequence]),
)

const GUARD_EVENTS = new Set(['shield', 'block', 'item-guard'])
const BREAK_EVENTS = new Set(['damage', 'unknown'])

export function battleManaAffinityById(traitId) {
  return AFFINITY_BY_ID.get(traitId) ?? BATTLE_MANA_AFFINITIES[0]
}

export function battleManaSequenceById(sequenceId) {
  return SEQUENCE_BY_ID.get(sequenceId) ?? BATTLE_MANA_SEQUENCES[0]
}

// 戦闘結果を演出へ写すだけに留め、正誤・HP・報酬の計算には関与しない。
export function battleManaSequenceFor({
  eventActive = false,
  eventKind = null,
  enemyDefeated = false,
  heroDefeated = false,
  healing = 0,
  themeAbility = null,
} = {}) {
  if (!eventActive) return battleManaSequenceById('focus')
  if (enemyDefeated) return battleManaSequenceById('triumph')
  if (heroDefeated || BREAK_EVENTS.has(eventKind)) {
    return battleManaSequenceById('break')
  }
  if (GUARD_EVENTS.has(eventKind)) return battleManaSequenceById('ward')
  if (Number(healing) > 0 || themeAbility === 'encore') {
    return battleManaSequenceById('restore')
  }
  return battleManaSequenceById('cast')
}

export function battleManaPresentation({
  traitId,
  secondaryTraitId,
  eventActive = false,
  eventKind = null,
  enemyDefeated = false,
  heroDefeated = false,
  healing = 0,
  themeAbility = null,
} = {}) {
  const affinity = battleManaAffinityById(traitId)
  let secondaryAffinity = battleManaAffinityById(secondaryTraitId)
  if (secondaryAffinity.id === affinity.id) {
    const index = BATTLE_MANA_AFFINITIES.indexOf(affinity)
    secondaryAffinity = BATTLE_MANA_AFFINITIES[
      (index + 1) % BATTLE_MANA_AFFINITIES.length
    ]
  }
  const sequence = battleManaSequenceFor({
    eventActive,
    eventKind,
    enemyDefeated,
    heroDefeated,
    healing,
    themeAbility,
  })

  return {
    affinity,
    secondaryAffinity,
    sequence,
    label: `${affinity.name}・${sequence.label}`,
    ariaLabel: `${affinity.name}のマナを操る。${sequence.phases.join('、')}。`,
  }
}
