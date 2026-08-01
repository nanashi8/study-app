import { GAME_BGM_STEPS_PER_BAR } from '../data/game-bgm.js'

export const BGM_SCALES = Object.freeze({
  major: Object.freeze([0, 2, 4, 5, 7, 9, 11]),
  minor: Object.freeze([0, 2, 3, 5, 7, 8, 10]),
  dorian: Object.freeze([0, 2, 3, 5, 7, 9, 10]),
  mixolydian: Object.freeze([0, 2, 4, 5, 7, 9, 10]),
  lydian: Object.freeze([0, 2, 4, 6, 7, 9, 11]),
  harmonicMinor: Object.freeze([0, 2, 3, 5, 7, 8, 11]),
  pentatonic: Object.freeze([0, 2, 4, 7, 9]),
})

const positiveMod = (value, modulus) => ((value % modulus) + modulus) % modulus
const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

function deterministicUnit(seed, index) {
  let value = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) + index) | 0
  value ^= value >>> 16
  value = Math.imul(value, 0x7feb352d)
  value ^= value >>> 15
  value = Math.imul(value, 0x846ca68b)
  value ^= value >>> 16
  return (value >>> 0) / 0x100000000
}

export function bgmStepSeconds(track) {
  return 60 / track.tempo / 4
}

export function bgmTotalSteps(track) {
  return track.bars * GAME_BGM_STEPS_PER_BAR
}

export function bgmDegreeToMidi(track, degree, octave = 0) {
  const scale = BGM_SCALES[track.mode] ?? BGM_SCALES.major
  const scaleIndex = positiveMod(degree, scale.length)
  const octaveFromDegree = Math.floor(degree / scale.length)
  return track.rootMidi + scale[scaleIndex] + (octaveFromDegree + octave) * 12
}

export function bgmMidiToFrequency(midi) {
  return 440 * (2 ** ((midi - 69) / 12))
}

export function bgmSectionAtBar(track, rawBar) {
  const bar = positiveMod(rawBar, track.bars)
  if (bar < 4) {
    return { id: 'intro', energy: 0.48, lead: bar >= 2, bass: bar >= 1, drums: false }
  }
  if (bar >= track.bars - 4) {
    return { id: 'return', energy: 0.58, lead: true, bass: true, drums: bar < track.bars - 1 }
  }
  const phases = [
    { id: 'a', energy: 0.72, lead: true, bass: true, drums: true },
    { id: 'a2', energy: 0.8, lead: true, bass: true, drums: true },
    { id: 'b', energy: 0.9, lead: true, bass: true, drums: true },
    { id: 'bridge', energy: 0.64, lead: true, bass: true, drums: true },
    { id: 'climax', energy: 1, lead: true, bass: true, drums: true },
  ]
  return phases[Math.floor((bar - 4) / 8) % phases.length]
}

function chordDegrees(track, bar) {
  const root = track.progression[positiveMod(bar, track.progression.length)]
  return [root, root + 2, root + 4]
}

function leadDegree(track, bar, withinBar, section) {
  const eighth = Math.floor(withinBar / 2)
  let index = positiveMod((bar % 2) * 8 + eighth, track.motif.length)
  if (section.id === 'b') index = positiveMod(index + 4, track.motif.length)
  if (section.id === 'bridge') index = positiveMod(track.motif.length - 1 - index, track.motif.length)
  const base = track.motif[index]
  if (base == null) return null
  const lift = section.id === 'climax' ? 7 : section.id === 'a2' ? 2 : 0
  const variation = deterministicUnit(track.seed, bar * 31 + withinBar) > 0.86 ? 1 : 0
  return base + lift + variation
}

function drumEvents(track, withinBar, energy) {
  if (track.drums === 'none') return []
  const events = []
  const strongKick = [0, 8].includes(withinBar)
  const syncKick = energy > 0.78 && [6, 10, 14].includes(withinBar)
  const marchKick = track.drums === 'march' && withinBar % 4 === 0
  if (strongKick || syncKick || marchKick) {
    events.push({ kind: 'drum', drum: 'kick', velocity: strongKick ? 0.9 : 0.62 })
  }

  if ([4, 12].includes(withinBar)) {
    const drum = ['wood', 'clockwork'].includes(track.drums)
      ? 'wood'
      : track.drums === 'cinematic'
        ? 'tom'
        : 'snare'
    events.push({ kind: 'drum', drum, velocity: 0.55 + energy * 0.3 })
  }

  const hatEveryStep = energy > 0.9 || ['sports', 'industrial'].includes(track.drums)
  const hatEveryEighth = ['rock', 'electro', 'pop', 'clockwork'].includes(track.drums)
  const softHat = ['soft', 'brush', 'lofi', 'world'].includes(track.drums)
  if (
    (hatEveryStep && withinBar % 2 === 1)
    || (hatEveryEighth && withinBar % 2 === 0)
    || (softHat && [2, 6, 10, 14].includes(withinBar))
  ) {
    events.push({
      kind: 'drum',
      drum: track.drums === 'brush' || track.drums === 'lofi' ? 'brush' : 'hat',
      velocity: clamp(0.22 + energy * 0.22, 0.2, 0.5),
    })
  }

  if (track.drums === 'world' && [3, 7, 11, 15].includes(withinBar)) {
    events.push({ kind: 'drum', drum: 'shaker', velocity: 0.32 })
  }
  if (track.drums === 'industrial' && [2, 10].includes(withinBar)) {
    events.push({ kind: 'drum', drum: 'metal', velocity: 0.42 })
  }
  return events
}

/**
 * 16分音符1ステップで鳴らすイベントを純粋計算する。
 * ブラウザのAudioContextと切り離してあるため、30曲全件をNodeで監査できる。
 */
export function bgmEventsAtStep(track, rawStep) {
  const totalSteps = bgmTotalSteps(track)
  const step = positiveMod(rawStep, totalSteps)
  const bar = Math.floor(step / GAME_BGM_STEPS_PER_BAR)
  const withinBar = step % GAME_BGM_STEPS_PER_BAR
  const section = bgmSectionAtBar(track, bar)
  const sectionEnergy = clamp(track.energy * section.energy, 0.12, 1)
  const chords = chordDegrees(track, bar)
  const events = []

  if (withinBar === 0) {
    events.push({
      kind: 'chord',
      role: 'pad',
      notes: chords.map((degree) => bgmDegreeToMidi(track, degree, 0)),
      durationSteps: 15.6,
      velocity: 0.2 + sectionEnergy * 0.2,
      timbre: track.pad,
    })
  }

  if (section.bass && withinBar % 4 === 0) {
    const rootDegree = chords[0]
    const fifth = sectionEnergy > 0.82 && withinBar === 12 ? rootDegree + 4 : rootDegree
    events.push({
      kind: 'tone',
      role: 'bass',
      midi: bgmDegreeToMidi(track, fifth, -2),
      durationSteps: 3.4,
      velocity: 0.34 + sectionEnergy * 0.2,
      timbre: track.bass,
    })
  }

  if (section.lead && withinBar % 2 === 0) {
    const degree = leadDegree(track, bar, withinBar, section)
    if (degree != null) {
      events.push({
        kind: 'tone',
        role: 'lead',
        midi: bgmDegreeToMidi(track, degree, 1),
        durationSteps: section.id === 'bridge' ? 3.2 : 1.65,
        velocity: 0.24 + sectionEnergy * 0.28,
        timbre: track.lead,
      })
    }
  }

  if (track.ornament === 'arp' && sectionEnergy > 0.55) {
    const degree = chords[withinBar % chords.length] + (withinBar >= 8 ? 7 : 0)
    events.push({
      kind: 'tone',
      role: 'ornament',
      midi: bgmDegreeToMidi(track, degree, 1),
      durationSteps: 0.72,
      velocity: 0.1 + sectionEnergy * 0.12,
      timbre: 'pluck',
    })
  } else if (
    ['sparkle', 'droplets', 'pages'].includes(track.ornament)
    && [3, 7, 11, 15].includes(withinBar)
  ) {
    const chance = track.ornament === 'pages' ? 0.48 : 0.7
    if (deterministicUnit(track.seed, bar * 17 + withinBar) < chance) {
      const degree = chords[Math.floor(withinBar / 4) % chords.length] + 7
      events.push({
        kind: 'tone',
        role: 'ornament',
        midi: bgmDegreeToMidi(track, degree, 1),
        durationSteps: track.ornament === 'pages' ? 2.2 : 1.1,
        velocity: track.ornament === 'pages' ? 0.12 : 0.17,
        timbre: track.ornament === 'droplets' ? 'glass' : 'bell',
      })
    }
  } else if (
    track.ornament === 'counter'
    && sectionEnergy > 0.62
    && [5, 13].includes(withinBar)
  ) {
    const degree = chords[1] + (bar % 2 ? 7 : 4)
    events.push({
      kind: 'tone',
      role: 'counter',
      midi: bgmDegreeToMidi(track, degree, 1),
      durationSteps: 2.5,
      velocity: 0.14 + sectionEnergy * 0.12,
      timbre: track.lead === 'brass' ? 'triangle' : 'bell',
    })
  }

  if (section.drums) events.push(...drumEvents(track, withinBar, sectionEnergy))

  return events
}

export function bgmTrackEventSummary(track, sampleBars = 16) {
  const counts = { chord: 0, tone: 0, drum: 0 }
  const roles = new Set()
  const notes = new Set()
  const steps = Math.min(track.bars, sampleBars) * GAME_BGM_STEPS_PER_BAR
  for (let step = 0; step < steps; step += 1) {
    for (const event of bgmEventsAtStep(track, step)) {
      counts[event.kind] = (counts[event.kind] ?? 0) + 1
      if (event.role) roles.add(event.role)
      if (Number.isFinite(event.midi)) notes.add(event.midi)
      event.notes?.forEach((note) => notes.add(note))
    }
  }
  return Object.freeze({
    counts: Object.freeze(counts),
    roles: Object.freeze([...roles].sort()),
    noteCount: notes.size,
  })
}
