import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useContentSettings } from '../store/useStore.js'
import { getSpeechPlayerSnapshot, subscribeSpeechPlayer } from '../lib/speech-player.js'
import { speechItemsSignature } from '../lib/cardSpeech.js'
import {
  createCardSpeechPanel,
  restoreCardSpeechPanel,
  syncCardSpeechItems,
  syncCardSpeechState,
} from '../lib/cardSpeechPanel.js'
import { normalizeSpeechRange } from '../lib/speechRange.js'

const playerVisible = () => getSpeechPlayerSnapshot().visible
const hiddenOnServer = () => false

/**
 * 英単語・熟語・構文の暗記カードの自動読み上げ（「カード表示時に自動で発音」と「読み上げる範囲」）と、画面下部の再生パネル。
 * カードが変わったら見出しを読み、カードを開いたら範囲に合わせて意味から続きを読む。
 * 再生パネルは閉じない。自動で読まないとき（自動で発音がオフ、スペルを隠している、開いたカードを閉じ直した）も、
 * いまのカードの読み上げ列を入れて止めたまま置き、「再生」で読めるようにする（lib/cardSpeechPanel.js）。
 * 設定の窓などがパネルを閉じても、カードを出しているあいだはこのカードの列で出し直す。
 * スペルを隠しているあいだは読まず、パネルにもつづり・例文を出さない（items は隠したままの列）。
 * items は cardSpeechItems の読み上げ列（見出しのボタンと同じもの）。speechKey は読み上げ列の持ち主で、
 * 見出し・例文のボタンにも同じものを渡す（再生パネルの「範囲」を変えたとき、このカードの列を入れ替えるため）。
 */
export function useCardAutoSpeech({ speechKey, items, spellingHidden, answerOpen, title }) {
  const settings = useContentSettings()
  const range = normalizeSpeechRange(settings.speechRange)
  const signature = speechItemsSignature(items)
  const panel = useRef(null)
  if (!panel.current) panel.current = createCardSpeechPanel()
  const visible = useSyncExternalStore(subscribeSpeechPlayer, playerVisible, hiddenOnServer)
  // 読める部分がない列（見出しを読まない語で範囲が単語のみ、など）でも、パネルに出す見出し。
  const placeholder = items?.[0]?.label ?? ''
  const options = {
    key: speechKey,
    rangeAdjustable: true,
    title,
    placeholder,
    rate: settings.ttsRate,
    voiceURI: settings.ttsVoiceURI,
    japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
  }

  useEffect(() => {
    syncCardSpeechState(panel.current, {
      speechKey,
      items,
      spellingHidden,
      answerOpen,
      range,
      autoSpeak: settings.autoSpeak,
      options,
    })
    // 速さ・声を変えても、いまのカードは読み直さない（次のカードから）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechKey, spellingHidden, answerOpen])

  useEffect(() => {
    syncCardSpeechItems(panel.current, { speechKey, items, range, placeholder })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechKey, signature, range])

  useEffect(() => {
    if (!visible) restoreCardSpeechPanel({ speechKey, items, options })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechKey, visible])
}
