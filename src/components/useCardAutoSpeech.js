import { useEffect, useRef } from 'react'
import { useContentSettings } from '../store/useStore.js'
import { dismissSpeechPlayer, playSpeechItems, replaceSpeechItems } from '../lib/speech-player.js'
import { planCardAutoSpeech, speechItemsSignature } from '../lib/cardSpeech.js'
import { normalizeSpeechRange } from '../lib/speechRange.js'

/**
 * 英単語・熟語・構文の暗記カードの自動読み上げ（「カード表示時に自動で発音」と「読み上げる範囲」）。
 * カードが変わったら見出しを読み、カードを開いたら範囲に合わせて意味から続きを読む。
 * スペルを隠しているあいだは読まず、流れている音声と、つづりが出る下の再生パネルも閉じる。
 * items は cardSpeechItems の読み上げ列（見出しのボタンと同じもの）。speechKey は読み上げ列の持ち主で、
 * 見出し・例文のボタンにも同じものを渡す（再生パネルの「範囲」を変えたとき、このカードの列を入れ替えるため）。
 */
export function useCardAutoSpeech({ speechKey, items, spellingHidden, answerOpen, title }) {
  const settings = useContentSettings()
  const range = normalizeSpeechRange(settings.speechRange)
  const signature = speechItemsSignature(items)
  const spoken = useRef({ key: null, memory: null })
  const synced = useRef({ key: null, signature: null, range: null })

  useEffect(() => {
    if (!speechKey) return
    const plan = planCardAutoSpeech(
      spoken.current.key === speechKey ? spoken.current.memory : null,
      {
        spellingHidden,
        answerOpen,
        range,
        autoSpeak: settings.autoSpeak,
      },
    )
    spoken.current = { key: speechKey, memory: plan.memory }
    if (plan.action === 'dismiss') dismissSpeechPlayer()
    if (plan.action === 'play') {
      playSpeechItems(items, {
        key: speechKey,
        rangeAdjustable: true,
        title,
        rate: settings.ttsRate,
        voiceURI: settings.ttsVoiceURI,
        japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
        startSegment: plan.startSegment,
      })
    }
    // 速さ・声を変えても、いまのカードは読み直さない（次のカードから）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechKey, spellingHidden, answerOpen])

  // 読み上げ列が変わったら（カードを開いた・読み上げる範囲を変えた）、このカードの再生パネルの列も入れ替える。
  // 範囲を変えたときは、読んでいる途中ならいまの部分を新しい範囲で最初から読み直す。
  useEffect(() => {
    const previous = synced.current
    synced.current = { key: speechKey, signature, range }
    if (!speechKey || previous.key !== speechKey || previous.signature === signature) return
    replaceSpeechItems(speechKey, items, { restart: previous.range !== range })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechKey, signature, range])
}
