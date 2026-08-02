import {
  isTTSSupported,
  pauseSpeaking,
  resumeSpeaking,
  speakWith,
  stopSpeaking,
} from './tts.js'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const EMPTY_STATE = Object.freeze({
  visible: false,
  status: 'idle',
  title: '読み上げ',
  itemLabel: '',
  segmentLabel: '',
  index: 0,
  count: 0,
  rate: 0.9,
  canPlay: false,
  canPause: false,
  canPrevious: false,
  canNext: false,
  canStop: false,
})

let playerState = EMPTY_STATE
let session = null
let runToken = 0
let pendingTimer = null
let pendingCallback = null
let pendingStartedAt = 0
let pendingRemainingMs = 0
const listeners = new Set()

const emit = () => listeners.forEach((listener) => listener())

function setPlayerState(patch) {
  playerState = Object.freeze({ ...playerState, ...patch })
  emit()
}

function textSegment(value, defaults = {}) {
  if (typeof value === 'string') return { ...defaults, text: value }
  return { ...defaults, ...(value ?? {}) }
}

function normalizeItems(items, defaults) {
  return (Array.isArray(items) ? items : [items])
    .map((item, index) => {
      const source = typeof item === 'string' ? { text: item } : (item ?? {})
      const segments = (source.segments?.length ? source.segments : [source])
        .map((segment) => textSegment(segment, defaults))
        .filter((segment) => String(segment.text ?? '').trim())
      if (!segments.length) return null
      return {
        id: source.id ?? `speech-item-${index}`,
        label: source.label ?? source.text ?? segments[0].text,
        pauseAfterMs: Math.max(0, Number(source.pauseAfterMs) || 0),
        segments,
        meta: source.meta,
      }
    })
    .filter(Boolean)
}

function clearContinuation() {
  if (pendingTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(pendingTimer)
  }
  pendingTimer = null
  pendingCallback = null
  pendingStartedAt = 0
  pendingRemainingMs = 0
}

function scheduleContinuation(callback, delayMs = 0) {
  clearContinuation()
  if (!delayMs || typeof window === 'undefined') {
    callback()
    return
  }
  pendingCallback = callback
  pendingRemainingMs = delayMs
  pendingStartedAt = Date.now()
  pendingTimer = window.setTimeout(() => {
    const next = pendingCallback
    clearContinuation()
    next?.()
  }, delayMs)
}

function pauseContinuation() {
  if (pendingTimer === null || typeof window === 'undefined') return
  window.clearTimeout(pendingTimer)
  pendingTimer = null
  pendingRemainingMs = Math.max(
    0,
    pendingRemainingMs - (Date.now() - pendingStartedAt),
  )
}

function resumeContinuation() {
  if (!pendingCallback || pendingTimer !== null || typeof window === 'undefined') return
  const callback = pendingCallback
  const delay = pendingRemainingMs
  pendingStartedAt = Date.now()
  pendingTimer = window.setTimeout(() => {
    clearContinuation()
    callback()
  }, delay)
}

function controlsFor(status = playerState.status) {
  if (!session) {
    return {
      canPlay: false,
      canPause: false,
      canPrevious: false,
      canNext: false,
      canStop: false,
    }
  }
  const navigationEnabled = !session.navigationLocked
  return {
    canPlay:
      status !== 'playing' &&
      (status === 'paused' || session.allowReplay),
    canPause: status === 'playing',
    canPrevious: navigationEnabled && session.index > 0,
    canNext: navigationEnabled && session.index < session.items.length - 1,
    canStop: status === 'playing' || status === 'paused',
  }
}

function publishStatus(status, extra = {}) {
  setPlayerState({
    status,
    ...controlsFor(status),
    ...extra,
  })
  session?.onStatusChange?.(status)
}

function voiceForSegment(segment) {
  if (segment.voiceURI !== undefined) return segment.voiceURI
  return /^ja/i.test(segment.lang ?? '')
    ? session.japaneseVoiceURI
    : session.voiceURI
}

function rateForSegment(segment) {
  if (Number.isFinite(segment.rate)) return segment.rate
  const factor = Number.isFinite(segment.rateFactor) ? segment.rateFactor : 1
  return clamp(
    session.rate * factor,
    Number.isFinite(segment.minRate) ? segment.minRate : 0.5,
    Number.isFinite(segment.maxRate) ? segment.maxRate : 1.4,
  )
}

function finishCurrentItem(token) {
  if (!session || token !== runToken) return
  if (session.autoAdvance && session.index < session.items.length - 1) {
    const delay = session.items[session.index].pauseAfterMs || session.pauseBetweenItemsMs
    scheduleContinuation(() => {
      if (!session || token !== runToken) return
      session.index += 1
      startCurrentItem({ reason: 'advance' })
    }, delay)
    return
  }
  publishStatus('ended', { segmentLabel: '' })
  session.onComplete?.({ index: session.index })
  if (session.dismissOnComplete) dismissSpeechPlayer()
}

function playSegment(segmentIndex, token) {
  if (!session || token !== runToken) return
  const item = session.items[session.index]
  const segment = item?.segments[segmentIndex]
  if (!segment) {
    finishCurrentItem(token)
    return
  }

  setPlayerState({ segmentLabel: segment.label ?? '' })
  session.onSegmentChange?.(segment, segmentIndex, {
    index: session.index,
    item,
  })

  speakWith(segment.text, {
    rate: rateForSegment(segment),
    pitch: segment.pitch ?? 1,
    voiceURI: voiceForSegment(segment),
    lang: segment.lang ?? 'en-US',
    style: segment.style ?? 'auto',
    onend: () => {
      if (!session || token !== runToken) return
      scheduleContinuation(
        () => playSegment(segmentIndex + 1, token),
        Math.max(0, Number(segment.pauseAfterMs) || 0),
      )
    },
  })
}

function startCurrentItem({ reason = 'play' } = {}) {
  if (!session) return false
  clearContinuation()
  stopSpeaking()
  const token = ++runToken
  const item = session.items[session.index]
  session.restartOnResume = false
  publishStatus('playing', {
    itemLabel: String(item.label ?? ''),
    segmentLabel: '',
    index: session.index,
    count: session.items.length,
    rate: session.rate,
  })
  session.onIndexChange?.(session.index, item)
  if (reason !== 'rate-change') {
    session.onPlayStart?.({ reason, index: session.index, item })
  }
  playSegment(0, token)
  return true
}

/**
 * 共通コンソールで扱う読み上げ列を開始する。
 * 1 item が「前へ／次へ」で移動する一つの意味フレーズ、segments はその中で
 * 続けて読む英語・直訳・解説などを表す。
 */
export function playSpeechItems(items, options = {}) {
  if (!isTTSSupported()) return false
  const normalized = normalizeItems(items, {
    lang: options.lang ?? 'en-US',
    style: options.style ?? 'auto',
  })
  if (!normalized.length) return false

  runToken += 1
  clearContinuation()
  stopSpeaking()
  session = {
    items: normalized,
    index: clamp(Math.trunc(options.index ?? 0), 0, normalized.length - 1),
    title: options.title ?? '読み上げ',
    rate: clamp(Number(options.rate) || 0.9, 0.5, 1.2),
    voiceURI: options.voiceURI ?? null,
    japaneseVoiceURI: options.japaneseVoiceURI ?? null,
    autoAdvance: options.autoAdvance === true,
    allowReplay: options.allowReplay !== false,
    navigationLocked: options.navigationLocked === true,
    pauseBetweenItemsMs: Math.max(0, Number(options.pauseBetweenItemsMs) || 0),
    dismissOnComplete: options.dismissOnComplete === true,
    onIndexChange: options.onIndexChange,
    onSegmentChange: options.onSegmentChange,
    onStatusChange: options.onStatusChange,
    onPlayStart: options.onPlayStart,
    onComplete: options.onComplete,
    onStop: options.onStop,
    restartOnResume: false,
  }
  playerState = Object.freeze({
    ...EMPTY_STATE,
    visible: true,
    status: 'stopped',
    title: session.title,
    itemLabel: String(normalized[session.index].label ?? ''),
    index: session.index,
    count: normalized.length,
    rate: session.rate,
    ...controlsFor('stopped'),
  })
  emit()
  return startCurrentItem({ reason: 'initial' })
}

export function playSpeechPlayer() {
  if (!session) return false
  if (playerState.status === 'paused') {
    if (session.restartOnResume) return startCurrentItem({ reason: 'rate-change' })
    resumeSpeaking()
    resumeContinuation()
    publishStatus('playing')
    return true
  }
  if (!session.allowReplay) return false
  return startCurrentItem({ reason: 'replay' })
}

export function pauseSpeechPlayer() {
  if (!session || playerState.status !== 'playing') return false
  pauseContinuation()
  pauseSpeaking()
  publishStatus('paused')
  return true
}

export function stopSpeechPlayer({ dismiss = false } = {}) {
  if (!session) return false
  runToken += 1
  clearContinuation()
  stopSpeaking()
  session.restartOnResume = false
  publishStatus('stopped', { segmentLabel: '' })
  session.onStop?.()
  if (dismiss) dismissSpeechPlayer()
  return true
}

function moveSpeechPlayer(delta) {
  if (!session || session.navigationLocked) return false
  const nextIndex = clamp(session.index + delta, 0, session.items.length - 1)
  if (nextIndex === session.index) return false
  session.index = nextIndex
  return startCurrentItem({ reason: delta < 0 ? 'previous' : 'next' })
}

export const previousSpeechItem = () => moveSpeechPlayer(-1)
export const nextSpeechItem = () => moveSpeechPlayer(1)

export function setSpeechPlayerRate(rate) {
  if (!session) return false
  session.rate = clamp(Number(rate) || 0.9, 0.5, 1.2)
  setPlayerState({ rate: session.rate })
  if (playerState.status === 'playing') {
    startCurrentItem({ reason: 'rate-change' })
  } else if (playerState.status === 'paused') {
    session.restartOnResume = true
  }
  return true
}

export function updateSpeechPlayerVoices({ voiceURI, japaneseVoiceURI } = {}) {
  if (!session) return
  if (voiceURI !== undefined) session.voiceURI = voiceURI
  if (japaneseVoiceURI !== undefined) session.japaneseVoiceURI = japaneseVoiceURI
}

export function dismissSpeechPlayer() {
  runToken += 1
  clearContinuation()
  stopSpeaking()
  session = null
  playerState = EMPTY_STATE
  emit()
}

export const getSpeechPlayerSnapshot = () => playerState
export const getSpeechPlayerServerSnapshot = () => EMPTY_STATE

export function subscribeSpeechPlayer(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
