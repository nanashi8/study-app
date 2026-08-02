import {
  GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID,
  gameSoundtrackProduction,
} from '../src/data/game-soundtrack-production.js'
import { BGM_SCALES } from '../src/lib/gameBgmSequencer.js'

export const MIDI_TICKS_PER_BEAT = 480

const GM_PROGRAM_NAMES = Object.freeze({
  0: 'Grand Piano', 1: 'Bright Piano', 4: 'Electric Piano', 9: 'Glockenspiel',
  11: 'Vibraphone', 12: 'Marimba', 13: 'Xylophone', 19: 'Church Organ',
  21: 'Accordion', 24: 'Nylon Guitar', 25: 'Steel Guitar', 27: 'Clean Guitar',
  29: 'Overdrive Guitar', 32: 'Acoustic Bass', 33: 'Finger Bass', 40: 'Violin',
  42: 'Cello', 45: 'Pizzicato Strings', 46: 'Harp', 48: 'Strings',
  49: 'Slow Strings', 56: 'Trumpet', 57: 'Trombone', 60: 'French Horn',
  61: 'Brass Section', 65: 'Alto Sax', 66: 'Tenor Sax', 68: 'Oboe',
  69: 'English Horn', 70: 'Bassoon', 71: 'Clarinet', 73: 'Flute',
  77: 'Shakuhachi', 106: 'Shamisen', 107: 'Koto',
})

const ROLE_MIX = Object.freeze({
  piano: { gainDb: 3, pan: -0.08 },
  guitar: { gainDb: 0, pan: 0.34 },
  bass: { gainDb: 3, pan: 0 },
  strings: { gainDb: -0.5, pan: -0.3 },
  melody: { gainDb: 4, pan: 0.08 },
  counter: { gainDb: 0, pan: -0.38 },
  color: { gainDb: -3.5, pan: 0.46 },
  brass: { gainDb: -1, pan: 0.3 },
  drums: { gainDb: 1.5, pan: 0 },
})

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const positiveMod = (value, modulus) => ((value % modulus) + modulus) % modulus

function deterministicUnit(seed, index) {
  let value = (Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) + index) | 0
  value ^= value >>> 16
  value = Math.imul(value, 0x7feb352d)
  value ^= value >>> 15
  value = Math.imul(value, 0x846ca68b)
  value ^= value >>> 16
  return (value >>> 0) / 0x100000000
}

function roleSeed(role) {
  return [...role].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function degreeToMidi(track, degree, octave = 0) {
  const scale = BGM_SCALES[track.mode] ?? BGM_SCALES.major
  const scaleIndex = positiveMod(degree, scale.length)
  const octaveFromDegree = Math.floor(degree / scale.length)
  return track.rootMidi + scale[scaleIndex] + (octaveFromDegree + octave) * 12
}

function sectionAtBar(track, bar) {
  if (bar < 4) return { id: 'intro', energy: 0.48 }
  if (bar >= track.bars - 4) return { id: 'return', energy: 0.58 }
  const phase = (bar - 4) / Math.max(1, track.bars - 8)
  if (phase < 0.2) return { id: 'a', energy: 0.72 }
  if (phase < 0.4) return { id: 'a2', energy: 0.82 }
  if (phase < 0.58) return { id: 'b', energy: 0.92 }
  if (phase < 0.68) return { id: 'bridge', energy: 0.62 }
  if (phase < 0.9) return { id: 'climax', energy: 1 }
  return { id: 'return', energy: 0.68 }
}

function progressionRoot(track, bar, section) {
  if (bar === 0 || bar === track.bars - 1) return 0
  const offset = section.id === 'b' ? 1 : section.id === 'bridge' ? 2 : 0
  return track.progression[positiveMod(bar + offset, track.progression.length)]
}

function chordFor(track, bar, section, octave = -1) {
  const root = progressionRoot(track, bar, section)
  const isSeventh = ['cafe-swing', 'rainy', 'reflection'].includes(
    gameSoundtrackProduction(track.id).groove,
  ) && bar % 2 === 1
  const degrees = isSeventh ? [root, root + 2, root + 4, root + 6] : [root, root + 2, root + 4]
  return degrees.map((degree) => degreeToMidi(track, degree, octave))
}

function instrumentSpecs(profile) {
  const melodicRoles = [
    ['piano', profile.piano],
    ['guitar', profile.guitar],
    ['bass', profile.bass],
    ['strings', profile.strings],
    ['melody', profile.melody],
    ['counter', profile.counter],
    ['color', profile.color],
    ['brass', profile.brass],
  ]
  const specs = melodicRoles
    .filter(([, program]) => Number.isInteger(program))
    .map(([role, program]) => Object.freeze({
      role,
      name: `${role}: ${GM_PROGRAM_NAMES[program] ?? `GM ${program}`}`,
      program,
      percussion: false,
      ...ROLE_MIX[role],
    }))
  if (profile.drumStyle !== 'none') {
    specs.push(Object.freeze({
      role: 'drums',
      name: `drums: ${profile.drumStyle}`,
      program: 0,
      percussion: true,
      ...ROLE_MIX.drums,
    }))
  }
  return Object.freeze(specs)
}

function arrangementFlags(profile) {
  const groove = profile.groove
  return Object.freeze({
    chamber: ['chamber', 'homeward', 'reflection', 'hopeful-coda'].includes(groove),
    comic: ['witty', 'comic-chase', 'teacher-comedy', 'clockwork', 'laboratory'].includes(groove),
    cinematic: ['cinematic-school', 'dramatic-school', 'finale', 'grand-finale'].includes(groove),
    march: ['parade', 'school-march'].includes(groove),
    swing: ['rainy', 'cafe-swing', 'picnic'].includes(groove),
    fast: ['comic-chase', 'sports-day', 'battle-pop', 'orchestral-pop', 'brass-drive'].includes(groove),
  })
}

function velocity(track, section, base, accent = 0) {
  return clamp(Math.round(base + track.energy * 22 + section.energy * 12 + accent), 18, 118)
}

function melodyDegree(track, bar, eighth, section) {
  let index = positiveMod((bar % 2) * 8 + eighth, track.motif.length)
  if (section.id === 'b') index = positiveMod(index + 4, track.motif.length)
  if (section.id === 'bridge') index = positiveMod(track.motif.length - 1 - index, track.motif.length)
  const base = track.motif[index]
  if (base == null) return null
  const lift = section.id === 'climax' ? 7 : section.id === 'a2' ? 2 : 0
  const turn = deterministicUnit(track.seed, bar * 29 + eighth) > 0.86 ? 1 : 0
  return base + lift + turn
}

function buildNoteBuckets(track, profile, instruments) {
  const totalBeats = track.bars * 4
  const buckets = new Map(instruments.map(({ role }) => [role, []]))
  const flags = arrangementFlags(profile)

  const addNote = (role, startBeat, durationBeats, rawNote, rawVelocity, options = {}) => {
    const bucket = buckets.get(role)
    if (!bucket) return
    const index = bucket.length + Math.round(startBeat * 16)
    const jitterScale = options.humanize === false ? 0 : role === 'drums' ? 0.008 : 0.018
    const timingJitter = (deterministicUnit(track.seed + roleSeed(role), index) - 0.5) * jitterScale
    const velocityJitter = options.humanize === false
      ? 0
      : Math.round((deterministicUnit(track.seed ^ roleSeed(role), index + 97) - 0.5) * 7)
    const start = clamp(startBeat + timingJitter, 0, Math.max(0, totalBeats - 0.02))
    const end = clamp(start + durationBeats, start + 0.025, totalBeats - 0.005)
    bucket.push(Object.freeze({
      startBeat: start,
      durationBeats: end - start,
      note: clamp(Math.round(rawNote), 0, 127),
      velocity: clamp(Math.round(rawVelocity + velocityJitter), 1, 127),
    }))
  }

  const addChord = (role, start, duration, notes, noteVelocity, strum = 0) => {
    notes.forEach((note, index) => addNote(
      role,
      start + strum * index,
      Math.max(0.08, duration - strum * index),
      note,
      noteVelocity - index,
    ))
  }

  const addDrums = (bar, section, energy) => {
    if (!buckets.has('drums')) return
    const base = bar * 4
    const style = profile.drumStyle
    const intro = section.id === 'intro'
    const finalBar = bar === track.bars - 1
    if (finalBar || (intro && bar < 3)) return
    const drumVelocity = velocity(track, section, 38)
    const note = (beat, midi, amount = 0, duration = 0.08) => addNote(
      'drums', base + beat, duration, midi, drumVelocity + amount,
    )

    if (['brush', 'soft'].includes(style)) {
      note(0, 36, 2)
      note(1, 37, -8)
      note(2, 36, -4)
      note(3, 37, -6)
      for (const beat of [0.5, 1.5, 2.5, 3.5]) note(beat, 42, -18, 0.05)
    } else if (style === 'march') {
      note(0, 36, 8)
      note(2, 36, 4)
      for (let eighth = 0; eighth < 8; eighth += 1) note(eighth * 0.5, 38, eighth % 2 ? -8 : 2)
      note(0, 49, -2, 0.15)
    } else if (style === 'wood' || style === 'clockwork') {
      note(0, 36, 2)
      note(1, 76, -5)
      note(2, 37, 1)
      note(3, 77, -7)
      for (const beat of [0.5, 1.5, 2.5, 3.5]) note(beat, style === 'clockwork' ? 80 : 42, -15)
    } else if (style === 'world') {
      note(0, 36, 4)
      note(1, 64, -5)
      note(2, 36, -1)
      note(3, 63, -3)
      for (const beat of [0.5, 1.5, 2.5, 3.5]) note(beat, 82, -14)
    } else if (style === 'cinematic' || style === 'heavy') {
      note(0, 36, 10)
      note(2, style === 'heavy' ? 41 : 45, 2, 0.18)
      note(3, 38, 0)
      for (const beat of [0.5, 1.5, 2.5, 3.5]) note(beat, 51, -18)
      if (section.id === 'climax') note(0, 49, 7, 0.2)
    } else {
      note(0, 36, 7)
      note(1, 38, 0)
      note(2, 36, 2)
      if (energy > 0.72) note(2.75, 36, -5)
      note(3, 38, 3)
      for (let eighth = 0; eighth < 8; eighth += 1) {
        note(eighth * 0.5, eighth === 7 ? 46 : 42, -16 + (eighth % 2 ? -4 : 0), 0.05)
      }
    }

    const sectionChange = sectionAtBar(track, Math.min(track.bars - 1, bar + 1)).id !== section.id
    if (sectionChange && !intro) {
      note(3, 45, -2, 0.12)
      note(3.25, 47, 1, 0.12)
      note(3.5, 50, 5, 0.15)
      note(3.75, 49, 7, 0.18)
    }
  }

  for (let bar = 0; bar < track.bars; bar += 1) {
    const section = sectionAtBar(track, bar)
    const energy = clamp(track.energy * section.energy, 0.15, 1)
    const base = bar * 4
    const chord = chordFor(track, bar, section)
    const highChord = chord.map((note) => note + 12)
    const chordVelocity = velocity(track, section, 38)
    const phraseIndex = Math.floor(bar / 2)
    const finalBar = bar === track.bars - 1
    const tonicChord = [0, 2, 4].map((degree) => degreeToMidi(track, degree, -1))

    if (finalBar) {
      addChord('piano', base, 3.85, tonicChord, chordVelocity, 0.012)
    } else if (section.id === 'intro' || section.id === 'bridge' || flags.chamber) {
      const arp = [0, 1, 2, 1, 0, 1, 2, chord.length > 3 ? 3 : 1]
      for (let eighth = 0; eighth < 8; eighth += 1) {
        const swingDelay = flags.swing && eighth % 2 ? track.swing * 0.32 : 0
        addNote('piano', base + eighth * 0.5 + swingDelay, 0.43, chord[arp[eighth]], chordVelocity - 7)
      }
    } else if (flags.comic) {
      for (const beat of [0, 0.75, 1.5, 2.5, 3.25]) {
        addChord('piano', base + beat, 0.28, chord, chordVelocity + (beat === 0 ? 5 : -2), 0.008)
      }
    } else {
      addChord('piano', base, 0.72, chord, chordVelocity + 3, 0.012)
      addChord('piano', base + 1.5, 0.42, highChord, chordVelocity - 4, -0.006)
      addChord('piano', base + 2.5, 0.62, chord, chordVelocity, 0.01)
      if (section.id === 'climax') addChord('piano', base + 3.5, 0.3, highChord, chordVelocity - 2)
    }

    if (buckets.has('guitar') && !finalBar && !(section.id === 'intro' && bar < 2)) {
      const guitarChord = chord.map((note, index) => note + (index === 0 ? 0 : 12))
      const beats = flags.fast || flags.march ? [0, 1, 2, 3] : [0, 2]
      for (const beat of beats) {
        const reverse = beat % 2 === 1
        const notes = reverse ? [...guitarChord].reverse() : guitarChord
        addChord('guitar', base + beat, flags.fast ? 0.62 : 1.35, notes, chordVelocity - 9, 0.018)
      }
    }

    if (finalBar) {
      addChord('strings', base, 3.85, tonicChord.map((note) => note + 12), chordVelocity - 12, 0.015)
    } else if (profile.strings === 45) {
      if (bar > 0) {
        const pizz = [0, 2, 1, 2]
        for (let beat = 0; beat < 4; beat += 1) {
          addNote('strings', base + beat, 0.34, highChord[pizz[beat] % highChord.length], chordVelocity - 12)
        }
      }
    } else if (section.id !== 'intro' || bar >= 2) {
      const stringDuration = section.id === 'return' ? 3.75 : 3.9
      addChord('strings', base, stringDuration, highChord, chordVelocity - 13, 0.016)
    }

    if (finalBar) {
      addNote('bass', base, 3.75, degreeToMidi(track, 0, -2), velocity(track, section, 44))
    } else if (bar >= 1 && !(section.id === 'bridge' && bar % 2 === 1)) {
      const rootDegree = progressionRoot(track, bar, section)
      const root = degreeToMidi(track, rootDegree, -2)
      const fifth = degreeToMidi(track, rootDegree + 4, -2)
      const passing = degreeToMidi(track, rootDegree + (bar % 2 ? 1 : -1), -2)
      const bassVelocity = velocity(track, section, 44)
      addNote('bass', base, 1.45, root, bassVelocity)
      addNote('bass', base + 2, 0.82, fifth, bassVelocity - 5)
      addNote('bass', base + 3, 0.72, passing, bassVelocity - 9)
    }

    const melodyRest = section.id === 'bridge' && bar % 2 === 1
    if (bar >= 2 && !melodyRest) {
      for (let eighth = 0; eighth < 8; eighth += 1) {
        if (section.id === 'return' && bar === track.bars - 1 && eighth >= 4) continue
        const degree = melodyDegree(track, bar, eighth, section)
        if (degree == null) continue
        const nextDegree = eighth < 7 ? melodyDegree(track, bar, eighth + 1, section) : null
        const swingDelay = flags.swing && eighth % 2 ? track.swing * 0.34 : 0
        const longEnding = nextDegree == null || eighth === 7
        addNote(
          'melody',
          base + eighth * 0.5 + swingDelay,
          longEnding ? 0.78 : 0.42,
          degreeToMidi(track, degree, 1),
          velocity(track, section, 45, eighth === 0 ? 5 : 0),
        )
      }
    }

    const responseBar = phraseIndex % 4 === 3 || section.id === 'bridge'
    if (responseBar && bar >= 3 && !(section.id === 'return' && bar === track.bars - 1)) {
      const root = progressionRoot(track, bar, section)
      const response = [root + 4, root + 2, root]
      for (let index = 0; index < response.length; index += 1) {
        addNote(
          'counter', base + 0.75 + index,
          index === 2 ? 0.85 : 0.52,
          degreeToMidi(track, response[index], 1),
          chordVelocity - 5,
        )
      }
    }

    if (bar % 4 === 0 || ['b', 'climax'].includes(section.id)) {
      const accents = section.id === 'climax' ? [0.5, 2.5] : [1.5]
      for (const beat of accents) {
        const noteIndex = Math.floor(beat) % highChord.length
        addNote('color', base + beat, 0.52, highChord[noteIndex] + 12, chordVelocity - 13)
      }
    }

    if (buckets.has('brass') && ['b', 'climax', 'return'].includes(section.id)) {
      addChord('brass', base, 0.4, highChord, chordVelocity - 6, 0.01)
      if (section.id === 'climax') addChord('brass', base + 2.75, 0.52, highChord, chordVelocity - 8)
    }

    addDrums(bar, section, energy)
  }

  return Object.freeze(Object.fromEntries(
    [...buckets.entries()].map(([role, notes]) => [
      role,
      Object.freeze(notes.sort((a, b) => a.startBeat - b.startBeat || a.note - b.note)),
    ]),
  ))
}

export function buildSoundtrackArrangement(track) {
  const profile = gameSoundtrackProduction(track.id)
  if (!profile) throw new Error(`音源プロファイルがありません: ${track.id}`)
  const instruments = instrumentSpecs(profile)
  const notesByRole = buildNoteBuckets(track, profile, instruments)
  const noteCount = Object.values(notesByRole).reduce((sum, notes) => sum + notes.length, 0)
  return Object.freeze({
    trackId: track.id,
    title: track.title,
    tempo: track.tempo,
    bars: track.bars,
    durationSeconds: track.durationSeconds,
    ensemble: profile.ensemble,
    groove: profile.groove,
    reverbMix: profile.reverb,
    masterGainDb: 0,
    instruments,
    notesByRole,
    noteCount,
  })
}

function encodeVariableLength(rawValue) {
  let value = Math.max(0, Math.floor(rawValue))
  const bytes = [value & 0x7f]
  while ((value >>= 7) > 0) bytes.unshift((value & 0x7f) | 0x80)
  return bytes
}

function uint16(value) {
  return [(value >>> 8) & 0xff, value & 0xff]
}

function uint32(value) {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff]
}

function chunk(id, bytes) {
  return Buffer.from([...Buffer.from(id, 'ascii'), ...uint32(bytes.length), ...bytes])
}

function textMeta(type, value) {
  const bytes = [...Buffer.from(value, 'utf8')]
  return [0xff, type, ...encodeVariableLength(bytes.length), ...bytes]
}

function tempoTrackBytes(arrangement) {
  const micros = Math.round(60_000_000 / arrangement.tempo)
  const endTick = arrangement.bars * 4 * MIDI_TICKS_PER_BEAT
  const events = [
    { tick: 0, bytes: textMeta(0x03, arrangement.title) },
    { tick: 0, bytes: [0xff, 0x51, 0x03, (micros >>> 16) & 0xff, (micros >>> 8) & 0xff, micros & 0xff] },
    { tick: 0, bytes: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08] },
    { tick: endTick, bytes: [0xff, 0x2f, 0x00] },
  ]
  let previousTick = 0
  return events.flatMap((event) => {
    const delta = event.tick - previousTick
    previousTick = event.tick
    return [...encodeVariableLength(delta), ...event.bytes]
  })
}

function instrumentTrackBytes(arrangement, instrument) {
  const channel = instrument.percussion ? 9 : 0
  const sourceNotes = arrangement.notesByRole[instrument.role] ?? []
  const events = [
    { tick: 0, priority: -2, bytes: textMeta(0x03, instrument.name) },
    { tick: 0, priority: -1, bytes: [0xc0 | channel, instrument.program & 0x7f] },
  ]
  for (const note of sourceNotes) {
    const startTick = clamp(Math.round(note.startBeat * MIDI_TICKS_PER_BEAT), 0, 0x7fffffff)
    const endTick = Math.max(startTick + 1, Math.round(
      (note.startBeat + note.durationBeats) * MIDI_TICKS_PER_BEAT,
    ))
    events.push({
      tick: startTick,
      priority: 1,
      bytes: [0x90 | channel, note.note & 0x7f, note.velocity & 0x7f],
    })
    events.push({
      tick: endTick,
      priority: 0,
      bytes: [0x80 | channel, note.note & 0x7f, 0],
    })
  }
  events.push({
    tick: arrangement.bars * 4 * MIDI_TICKS_PER_BEAT,
    priority: 2,
    bytes: [0xff, 0x2f, 0x00],
  })
  events.sort((a, b) => a.tick - b.tick || a.priority - b.priority)
  let previousTick = 0
  return events.flatMap((event) => {
    const delta = Math.max(0, event.tick - previousTick)
    previousTick = event.tick
    return [...encodeVariableLength(delta), ...event.bytes]
  })
}

export function soundtrackArrangementToMidi(arrangement) {
  const tracks = [
    tempoTrackBytes(arrangement),
    ...arrangement.instruments.map((instrument) => instrumentTrackBytes(arrangement, instrument)),
  ]
  const header = chunk('MThd', [
    0x00, 0x01,
    ...uint16(tracks.length),
    ...uint16(MIDI_TICKS_PER_BEAT),
  ])
  return Buffer.concat([header, ...tracks.map((bytes) => chunk('MTrk', bytes))])
}

export function auditProductionProfiles(trackIds) {
  const configured = Object.keys(GAME_SOUNDTRACK_PRODUCTION_BY_TRACK_ID).sort()
  const expected = [...trackIds].sort()
  return Object.freeze({
    configured,
    expected,
    complete: JSON.stringify(configured) === JSON.stringify(expected),
  })
}
