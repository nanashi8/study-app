import {
  bgmEventsAtStep,
  bgmMidiToFrequency,
  bgmStepSeconds,
  bgmTotalSteps,
} from './gameBgmSequencer.js'

const SCHEDULE_AHEAD_SECONDS = 0.14
const SCHEDULER_INTERVAL_MS = 25
const TRACK_FADE_SECONDS = 0.42
const MAX_MASTER_GAIN = 0.28
const SPEECH_DUCK_FACTOR = 0.16

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0))

function audioContextConstructor() {
  if (typeof window === 'undefined') return null
  return window.AudioContext ?? window.webkitAudioContext ?? null
}

function createImpulse(context, seconds = 1.4, decay = 2.8) {
  const length = Math.floor(context.sampleRate * seconds)
  const impulse = context.createBuffer(2, length, context.sampleRate)
  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel)
    let random = channel ? 0x6d2b79f5 : 0x9e3779b9
    for (let index = 0; index < length; index += 1) {
      random ^= random << 13
      random ^= random >>> 17
      random ^= random << 5
      const unit = ((random >>> 0) / 0xffffffff) * 2 - 1
      data[index] = unit * ((1 - index / length) ** decay)
    }
  }
  return impulse
}

function createNoiseBuffer(context) {
  const length = Math.floor(context.sampleRate)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const data = buffer.getChannelData(0)
  let random = 0x12345678
  for (let index = 0; index < length; index += 1) {
    random = Math.imul(1664525, random) + 1013904223
    data[index] = ((random >>> 0) / 0xffffffff) * 2 - 1
  }
  return buffer
}

const TIMBRES = Object.freeze({
  bell: { partials: [['sine', 1, 1], ['sine', 2.01, 0.33]], cutoff: 6800, attack: 0.006, release: 0.55 },
  glass: { partials: [['sine', 1, 1], ['triangle', 2.99, 0.2]], cutoff: 8200, attack: 0.004, release: 0.42 },
  pluck: { partials: [['triangle', 1, 1], ['square', 2, 0.08]], cutoff: 3400, attack: 0.004, release: 0.18 },
  triangle: { partials: [['triangle', 1, 1]], cutoff: 4200, attack: 0.018, release: 0.24 },
  square: { partials: [['square', 1, 1], ['square', 0.5, 0.08]], cutoff: 2600, attack: 0.008, release: 0.16 },
  pulse: { partials: [['square', 1, 0.75], ['triangle', 1, 0.35]], cutoff: 3000, attack: 0.008, release: 0.2 },
  saw: { partials: [['sawtooth', 1, 0.72], ['triangle', 1, 0.35]], cutoff: 3300, attack: 0.012, release: 0.2 },
  brass: { partials: [['sawtooth', 1, 0.58], ['square', 1, 0.2]], cutoff: 2400, attack: 0.035, release: 0.28 },
  reed: { partials: [['triangle', 1, 0.8], ['sawtooth', 2, 0.12]], cutoff: 2800, attack: 0.025, release: 0.32 },
  warm: { partials: [['triangle', 1, 0.75], ['sine', 0.5, 0.25]], cutoff: 1800, attack: 0.16, release: 0.5 },
  air: { partials: [['sine', 1, 0.78], ['triangle', 2, 0.13]], cutoff: 3200, attack: 0.24, release: 0.65 },
  strings: { partials: [['sawtooth', 1, 0.34], ['triangle', 1.005, 0.42]], cutoff: 1500, attack: 0.22, release: 0.62 },
  choir: { partials: [['triangle', 1, 0.6], ['sine', 2, 0.22]], cutoff: 1200, attack: 0.28, release: 0.72 },
  organ: { partials: [['sine', 1, 0.62], ['sine', 2, 0.22], ['square', 0.5, 0.08]], cutoff: 2200, attack: 0.05, release: 0.36 },
  round: { partials: [['sine', 1, 0.86], ['triangle', 2, 0.12]], cutoff: 850, attack: 0.008, release: 0.18 },
  deep: { partials: [['sine', 1, 0.75], ['sawtooth', 1, 0.14]], cutoff: 620, attack: 0.012, release: 0.22 },
})

function roleAmplitude(role) {
  if (role === 'bass') return 0.2
  if (role === 'pad') return 0.11
  if (role === 'ornament' || role === 'counter') return 0.1
  return 0.16
}

function rolePan(role, midi) {
  if (role === 'bass') return 0
  if (role === 'pad') return ((midi % 3) - 1) * 0.28
  if (role === 'counter') return -0.35
  if (role === 'ornament') return 0.35
  return ((midi % 5) - 2) * 0.09
}

function scheduleTone(context, destination, event, midi, startTime, duration) {
  const spec = TIMBRES[event.timbre] ?? TIMBRES.triangle
  const envelope = context.createGain()
  const filter = context.createBiquadFilter()
  const panner = typeof context.createStereoPanner === 'function'
    ? context.createStereoPanner()
    : null
  const attack = Math.min(spec.attack, Math.max(0.003, duration * 0.3))
  const release = Math.min(spec.release, Math.max(0.04, duration * 0.55))
  const sustainEnd = Math.max(startTime + attack + 0.01, startTime + duration - release)
  const amplitude = Math.max(0.0001, roleAmplitude(event.role) * event.velocity)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(spec.cutoff, startTime)
  filter.Q.setValueAtTime(event.role === 'bass' ? 0.8 : 0.35, startTime)
  envelope.gain.setValueAtTime(0.0001, startTime)
  envelope.gain.linearRampToValueAtTime(amplitude, startTime + attack)
  envelope.gain.setValueAtTime(amplitude * 0.78, sustainEnd)
  envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  filter.connect(envelope)
  if (panner) {
    panner.pan.setValueAtTime(rolePan(event.role, midi), startTime)
    envelope.connect(panner)
    panner.connect(destination)
  } else {
    envelope.connect(destination)
  }

  const frequency = bgmMidiToFrequency(midi)
  for (const [type, ratio, gainValue] of spec.partials) {
    const oscillator = context.createOscillator()
    const partialGain = context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency * ratio, startTime)
    if (event.role === 'pad' && ratio === 1) oscillator.detune.setValueAtTime(-4, startTime)
    partialGain.gain.setValueAtTime(gainValue, startTime)
    oscillator.connect(partialGain)
    partialGain.connect(filter)
    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.06)
  }
}

function scheduleNoiseDrum(context, destination, noiseBuffer, startTime, {
  duration,
  highpass,
  bandpass = null,
  amplitude,
}) {
  const source = context.createBufferSource()
  const highFilter = context.createBiquadFilter()
  const envelope = context.createGain()
  source.buffer = noiseBuffer
  highFilter.type = bandpass ? 'bandpass' : 'highpass'
  highFilter.frequency.setValueAtTime(bandpass ?? highpass, startTime)
  highFilter.Q.setValueAtTime(bandpass ? 0.9 : 0.3, startTime)
  envelope.gain.setValueAtTime(amplitude, startTime)
  envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  source.connect(highFilter)
  highFilter.connect(envelope)
  envelope.connect(destination)
  source.start(startTime)
  source.stop(startTime + duration + 0.02)
}

function scheduleDrum(context, destination, noiseBuffer, event, startTime) {
  const velocity = clamp(event.velocity, 0.05, 1)
  if (event.drum === 'kick') {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(132, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(46, startTime + 0.13)
    envelope.gain.setValueAtTime(0.2 * velocity, startTime)
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18)
    oscillator.connect(envelope)
    envelope.connect(destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.2)
    return
  }
  if (event.drum === 'wood') {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(520, startTime)
    envelope.gain.setValueAtTime(0.09 * velocity, startTime)
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.065)
    oscillator.connect(envelope)
    envelope.connect(destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.08)
    return
  }
  if (event.drum === 'tom') {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(180, startTime)
    oscillator.frequency.exponentialRampToValueAtTime(92, startTime + 0.18)
    envelope.gain.setValueAtTime(0.14 * velocity, startTime)
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.24)
    oscillator.connect(envelope)
    envelope.connect(destination)
    oscillator.start(startTime)
    oscillator.stop(startTime + 0.26)
    return
  }

  const profiles = {
    snare: { duration: 0.14, highpass: 1500, bandpass: 2100, amplitude: 0.11 },
    hat: { duration: 0.045, highpass: 6200, amplitude: 0.055 },
    brush: { duration: 0.12, highpass: 3000, amplitude: 0.045 },
    shaker: { duration: 0.08, highpass: 4800, amplitude: 0.05 },
    metal: { duration: 0.16, highpass: 2600, bandpass: 3400, amplitude: 0.085 },
  }
  const profile = profiles[event.drum] ?? profiles.snare
  scheduleNoiseDrum(context, destination, noiseBuffer, startTime, {
    ...profile,
    amplitude: profile.amplitude * velocity,
  })
}

export class GameBgmPlayer {
  constructor() {
    this.context = null
    this.masterGain = null
    this.mixBus = null
    this.noiseBuffer = null
    this.track = null
    this.requestedTrack = null
    this.trackChannel = null
    this.scheduler = null
    this.speechWatcher = null
    this.nextStepTime = 0
    this.step = 0
    this.enabled = true
    this.volume = 0.35
    this.ducked = false
  }

  get supported() {
    return Boolean(audioContextConstructor())
  }

  _initialize() {
    if (this.context || !this.supported) return Boolean(this.context)
    const AudioContextClass = audioContextConstructor()
    const context = new AudioContextClass({ latencyHint: 'playback' })
    const mixBus = context.createGain()
    const dryGain = context.createGain()
    const reverb = context.createConvolver()
    const wetGain = context.createGain()
    const compressor = context.createDynamicsCompressor()
    const masterGain = context.createGain()

    reverb.buffer = createImpulse(context)
    dryGain.gain.value = 0.92
    wetGain.gain.value = 0.11
    compressor.threshold.value = -20
    compressor.knee.value = 16
    compressor.ratio.value = 5
    compressor.attack.value = 0.012
    compressor.release.value = 0.25
    masterGain.gain.value = 0

    mixBus.connect(dryGain)
    mixBus.connect(reverb)
    reverb.connect(wetGain)
    dryGain.connect(compressor)
    wetGain.connect(compressor)
    compressor.connect(masterGain)
    masterGain.connect(context.destination)

    this.context = context
    this.mixBus = mixBus
    this.masterGain = masterGain
    this.noiseBuffer = createNoiseBuffer(context)
    this._applyVolume(true)
    this._startSpeechWatcher()
    return true
  }

  async unlock() {
    if (!this._initialize()) return false
    try {
      if (this.context.state !== 'running') await this.context.resume()
    } catch {
      return false
    }
    if (this.enabled && this.requestedTrack) this._startTrack(this.requestedTrack)
    return this.context.state === 'running'
  }

  setTrack(track) {
    this.requestedTrack = track ?? null
    if (!track || !this.enabled) {
      this._fadeOutTrack()
      return
    }
    if (this.context?.state === 'running') this._startTrack(track)
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled)
    if (!this.enabled) {
      this._fadeOutTrack()
      return
    }
    if (this.context?.state === 'running' && this.requestedTrack) {
      this._startTrack(this.requestedTrack)
    }
  }

  setVolume(volume) {
    this.volume = clamp(volume, 0, 1)
    this._applyVolume()
  }

  _applyVolume(immediate = false) {
    if (!this.context || !this.masterGain) return
    const now = this.context.currentTime
    const target = MAX_MASTER_GAIN * this.volume * (this.ducked ? SPEECH_DUCK_FACTOR : 1)
    this.masterGain.gain.cancelScheduledValues(now)
    if (immediate) this.masterGain.gain.setValueAtTime(target, now)
    else this.masterGain.gain.setTargetAtTime(target, now, this.ducked ? 0.055 : 0.16)
  }

  _startSpeechWatcher() {
    if (this.speechWatcher || typeof window === 'undefined') return
    this.speechWatcher = window.setInterval(() => {
      const speaking = Boolean(window.speechSynthesis?.speaking || window.speechSynthesis?.pending)
      if (speaking === this.ducked) return
      this.ducked = speaking
      this._applyVolume()
    }, 120)
  }

  _startTrack(track) {
    if (!this.context || !this.mixBus || !track) return
    if (this.track?.id === track.id && this.trackChannel) return
    this._fadeOutTrack()

    const now = this.context.currentTime
    const channel = this.context.createGain()
    channel.gain.setValueAtTime(0.0001, now)
    channel.gain.exponentialRampToValueAtTime(1, now + TRACK_FADE_SECONDS)
    channel.connect(this.mixBus)
    this.trackChannel = channel
    this.track = track
    this.step = 0
    this.nextStepTime = now + 0.06
    this.scheduler = window.setInterval(() => this._schedule(), SCHEDULER_INTERVAL_MS)
    this._schedule()
  }

  _fadeOutTrack() {
    if (this.scheduler && typeof window !== 'undefined') {
      window.clearInterval(this.scheduler)
      this.scheduler = null
    }
    const oldChannel = this.trackChannel
    if (oldChannel && this.context) {
      const now = this.context.currentTime
      oldChannel.gain.cancelScheduledValues(now)
      oldChannel.gain.setValueAtTime(Math.max(0.0001, oldChannel.gain.value), now)
      oldChannel.gain.exponentialRampToValueAtTime(0.0001, now + TRACK_FADE_SECONDS)
      window.setTimeout(() => {
        try {
          oldChannel.disconnect()
        } catch {
          // 既に切断済みなら何もしない。
        }
      }, (TRACK_FADE_SECONDS + SCHEDULE_AHEAD_SECONDS) * 1000)
    }
    this.trackChannel = null
    this.track = null
  }

  _schedule() {
    if (!this.context || !this.track || !this.trackChannel || !this.enabled) return
    const horizon = this.context.currentTime + SCHEDULE_AHEAD_SECONDS
    const stepSeconds = bgmStepSeconds(this.track)
    const totalSteps = bgmTotalSteps(this.track)
    while (this.nextStepTime < horizon) {
      const events = bgmEventsAtStep(this.track, this.step)
      for (const event of events) {
        if (event.kind === 'drum') {
          scheduleDrum(
            this.context,
            this.trackChannel,
            this.noiseBuffer,
            event,
            this.nextStepTime,
          )
          continue
        }
        const duration = Math.max(0.035, event.durationSteps * stepSeconds)
        if (event.kind === 'chord') {
          event.notes.forEach((midi) => scheduleTone(
            this.context,
            this.trackChannel,
            event,
            midi,
            this.nextStepTime,
            duration,
          ))
        } else {
          scheduleTone(
            this.context,
            this.trackChannel,
            event,
            event.midi,
            this.nextStepTime,
            duration,
          )
        }
      }
      const swing = clamp(this.track.swing, 0, 0.22)
      const swingFactor = this.step % 2 === 0 ? 1 + swing : 1 - swing
      this.nextStepTime += stepSeconds * swingFactor
      this.step = (this.step + 1) % totalSteps
    }
  }

  async suspend() {
    if (!this.context || this.context.state !== 'running') return
    try {
      await this.context.suspend()
    } catch {
      // ブラウザ側で停止済みなら無視。
    }
  }

  async resume() {
    if (!this.enabled || !this.requestedTrack) return false
    return this.unlock()
  }

  destroy() {
    this._fadeOutTrack()
    if (this.speechWatcher && typeof window !== 'undefined') {
      window.clearInterval(this.speechWatcher)
      this.speechWatcher = null
    }
    if (this.context && this.context.state !== 'closed') this.context.close().catch(() => {})
    this.context = null
    this.mixBus = null
    this.masterGain = null
    this.noiseBuffer = null
  }
}
