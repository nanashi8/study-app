const TRACK_FADE_SECONDS = 0.62
const MAX_MASTER_GAIN = 0.85
const SPEECH_DUCK_FACTOR = 0.16
const BUFFER_CACHE_LIMIT = 2

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0))

function audioContextConstructor() {
  if (typeof window === 'undefined') return null
  return window.AudioContext ?? window.webkitAudioContext ?? null
}

export function gameBgmAssetUrl(path) {
  const source = String(path ?? '').trim()
  if (!source) return null
  if (/^(?:https?:|data:|blob:)/.test(source)) return source
  const base = import.meta.env?.BASE_URL || './'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${source.replace(/^\.?\//, '')}`
}

/**
 * 完成済みのサウンドトラック音源をデコードし、曲間をクロスフェードする。
 * 旧実装のOscillatorNodeによる簡易演奏は使わず、AAC内の実楽器アンサンブルをそのまま鳴らす。
 */
export class GameBgmPlayer {
  constructor() {
    this.context = null
    this.masterGain = null
    this.activeVoice = null
    this.requestedTrack = null
    this.track = null
    this.loadingTrackId = null
    this.loadGeneration = 0
    this.bufferCache = new Map()
    this.cleanupTimers = new Set()
    this.speechWatcher = null
    this.enabled = true
    this.volume = 0.35
    this.ducked = false
  }

  get supported() {
    return Boolean(audioContextConstructor() && typeof window?.fetch === 'function')
  }

  _initialize() {
    if (this.context || !this.supported) return Boolean(this.context)
    const AudioContextClass = audioContextConstructor()
    const context = new AudioContextClass({ latencyHint: 'playback' })
    const masterGain = context.createGain()
    masterGain.gain.value = 0
    masterGain.connect(context.destination)

    this.context = context
    this.masterGain = masterGain
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
    if (this.enabled && this.requestedTrack) await this._startTrack(this.requestedTrack)
    return this.context.state === 'running'
  }

  setTrack(track) {
    this.requestedTrack = track ?? null
    if (!track || !this.enabled) {
      this.loadGeneration += 1
      this.loadingTrackId = null
      this._fadeOutActiveVoice()
      return
    }
    if (this.context?.state === 'running') void this._startTrack(track)
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled)
    if (!this.enabled) {
      this.loadGeneration += 1
      this.loadingTrackId = null
      this._fadeOutActiveVoice()
      return
    }
    if (this.context?.state === 'running' && this.requestedTrack) {
      void this._startTrack(this.requestedTrack)
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

  async _loadBuffer(track) {
    const cached = this.bufferCache.get(track.id)
    if (cached) return cached
    const url = gameBgmAssetUrl(track.audioPath)
    if (!url) throw new Error(`BGM音源パスがありません: ${track.id}`)
    const load = (async () => {
      const response = await window.fetch(url, { cache: 'force-cache' })
      if (!response.ok) throw new Error(`BGM音源を取得できません (${response.status}): ${url}`)
      const encoded = await response.arrayBuffer()
      return this.context.decodeAudioData(encoded)
    })()
    this.bufferCache.set(track.id, load)
    try {
      const buffer = await load
      this._trimBufferCache(track.id)
      return buffer
    } catch (error) {
      if (this.bufferCache.get(track.id) === load) this.bufferCache.delete(track.id)
      throw error
    }
  }

  _trimBufferCache(newestTrackId) {
    if (this.bufferCache.size <= BUFFER_CACHE_LIMIT) return
    const protectedIds = new Set([
      newestTrackId,
      this.requestedTrack?.id,
      this.activeVoice?.track?.id,
    ].filter(Boolean))
    for (const id of this.bufferCache.keys()) {
      if (this.bufferCache.size <= BUFFER_CACHE_LIMIT) break
      if (!protectedIds.has(id)) this.bufferCache.delete(id)
    }
  }

  async _startTrack(track) {
    if (!this.context || !this.masterGain || !track || !this.enabled) return false
    if (this.activeVoice?.track.id === track.id) return true
    if (this.loadingTrackId === track.id) return false

    const generation = ++this.loadGeneration
    this.loadingTrackId = track.id
    let buffer
    try {
      buffer = await this._loadBuffer(track)
    } catch (error) {
      if (generation === this.loadGeneration) {
        console.warn(`BGM「${track.title}」を再生できませんでした。`, error)
      }
      return false
    } finally {
      if (this.loadingTrackId === track.id) this.loadingTrackId = null
    }

    if (
      generation !== this.loadGeneration
      || !this.enabled
      || this.requestedTrack?.id !== track.id
      || this.context.state !== 'running'
    ) return false

    const now = this.context.currentTime
    const source = this.context.createBufferSource()
    const gain = this.context.createGain()
    source.buffer = buffer
    source.loop = true
    source.loopStart = 0
    source.loopEnd = buffer.duration
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(1, now + TRACK_FADE_SECONDS)
    source.connect(gain)
    gain.connect(this.masterGain)

    const previous = this.activeVoice
    const voice = { source, gain, track }
    this.activeVoice = voice
    this.track = track
    source.start(now)
    if (previous) this._fadeAndStop(previous)
    return true
  }

  _fadeAndStop(voice) {
    if (!this.context || !voice) return
    const now = this.context.currentTime
    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now)
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + TRACK_FADE_SECONDS)
    const timer = window.setTimeout(() => {
      this.cleanupTimers.delete(timer)
      try { voice.source.stop() } catch { /* 停止済み */ }
      try { voice.source.disconnect() } catch { /* 切断済み */ }
      try { voice.gain.disconnect() } catch { /* 切断済み */ }
      if (voice.track.id !== this.activeVoice?.track.id) this.bufferCache.delete(voice.track.id)
    }, (TRACK_FADE_SECONDS + 0.08) * 1000)
    this.cleanupTimers.add(timer)
  }

  _fadeOutActiveVoice() {
    const voice = this.activeVoice
    this.activeVoice = null
    this.track = null
    if (voice) this._fadeAndStop(voice)
  }

  async suspend() {
    if (!this.context || this.context.state !== 'running') return
    try { await this.context.suspend() } catch { /* ブラウザ側で停止済み */ }
  }

  async resume() {
    if (!this.enabled || !this.requestedTrack) return false
    return this.unlock()
  }

  destroy() {
    this.loadGeneration += 1
    this._fadeOutActiveVoice()
    for (const timer of this.cleanupTimers) window.clearTimeout(timer)
    this.cleanupTimers.clear()
    if (this.speechWatcher && typeof window !== 'undefined') {
      window.clearInterval(this.speechWatcher)
      this.speechWatcher = null
    }
    if (this.context && this.context.state !== 'closed') this.context.close().catch(() => {})
    this.context = null
    this.masterGain = null
    this.bufferCache.clear()
  }
}
