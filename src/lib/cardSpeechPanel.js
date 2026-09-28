// 英単語・熟語・構文の暗記カードと、画面下部の再生パネルのつなぎ（useCardAutoSpeech が描画のたびに呼ぶ）。
// 再生パネルは閉じない。自動で読まないとき（自動で発音がオフ、スペルを隠している、開いたカードを閉じ直した）も、
// いまのカードの読み上げ列を入れて止めたまま置き、「再生」で読めるようにする。
import {
  cueSpeechItems,
  getSpeechPlayerSnapshot,
  playSpeechItems,
  replaceSpeechItems,
} from './speech-player.js'
import { planCardAutoSpeech, speechItemsSignature } from './cardSpeech.js'
import { normalizeSpeechRange } from './speechRange.js'

/** 1枚のカード画面が持つ、ここまでに読んだもの（spoken）と、パネルへ入れた列（synced）。 */
export function createCardSpeechPanel() {
  return {
    spoken: { key: null, memory: null },
    synced: { key: null, signature: null, range: null },
  }
}

/**
 * カードが変わった・開いた・スペルを隠した／見せたときに呼ぶ。読むなら読み、読まないならパネルへ入れて止めておく。
 * options は再生パネルへ渡す設定（key・title・速さ・声・placeholder など）。autoSpeak は「自動で発音」。
 */
export function syncCardSpeechState(panel, { speechKey, items, spellingHidden, answerOpen, range, autoSpeak, options }) {
  if (!speechKey) return null
  const plan = planCardAutoSpeech(
    panel.spoken.key === speechKey ? panel.spoken.memory : null,
    { spellingHidden, answerOpen, range: normalizeSpeechRange(range), autoSpeak },
  )
  panel.spoken = { key: speechKey, memory: plan.memory }
  if (plan.action === 'play' && playSpeechItems(items, { ...options, startSegment: plan.startSegment })) return 'play'
  // 読まないとき・読める部分がないときも、パネルは閉じずに、このカードの列を止めたまま入れる。
  if (plan.action !== 'none') {
    cueSpeechItems(items, options)
    return 'cue'
  }
  return 'none'
}

/**
 * 読み上げ列が変わったら（カードを開いた・読み上げる範囲を変えた・スペルを隠した）、このカードのパネルの列も入れ替える。
 * 範囲を変えたときは、読んでいる途中ならいまの部分を新しい範囲で最初から読み直す。
 */
export function syncCardSpeechItems(panel, { speechKey, items, range, placeholder }) {
  const signature = speechItemsSignature(items)
  const scope = normalizeSpeechRange(range)
  const previous = panel.synced
  panel.synced = { key: speechKey, signature, range: scope }
  if (!speechKey || previous.key !== speechKey || previous.signature === signature) return false
  return replaceSpeechItems(speechKey, items, { restart: previous.range !== scope, placeholder })
}

/** 設定の窓を閉じたときなど、カードを出したままパネルが閉じられたら、このカードの列で出し直す。 */
export function restoreCardSpeechPanel({ speechKey, items, options }) {
  if (!speechKey || getSpeechPlayerSnapshot().visible) return false
  return cueSpeechItems(items, options)
}
