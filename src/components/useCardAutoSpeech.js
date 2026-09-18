import { useEffect, useRef } from 'react'
import { useContentSettings } from '../store/useStore.js'
import { dismissSpeechPlayer, playSpeechItems } from '../lib/speech-player.js'
import { planCardAutoSpeech } from '../lib/cardSpeech.js'

/**
 * 英単語・熟語・構文の暗記カードの自動読み上げ（「カード表示時に自動で発音」と「読み上げる範囲」）。
 * カードが変わったら見出しを読み、カードを開いたら範囲に合わせて意味から続きを読む。
 * スペルを隠しているあいだは読まず、流れている音声と、つづりが出る下の再生パネルも閉じる。
 * items は cardSpeechItems の読み上げ列（見出しのボタンと同じもの）。
 */
export function useCardAutoSpeech({ cardKey, items, spellingHidden, answerOpen, title }) {
  const settings = useContentSettings()
  const spoken = useRef({ key: null, memory: null })

  useEffect(() => {
    if (!cardKey) return
    const plan = planCardAutoSpeech(
      spoken.current.key === cardKey ? spoken.current.memory : null,
      {
        spellingHidden,
        answerOpen,
        range: settings.speechRange,
        autoSpeak: settings.autoSpeak,
      },
    )
    spoken.current = { key: cardKey, memory: plan.memory }
    if (plan.action === 'dismiss') dismissSpeechPlayer()
    if (plan.action === 'play') {
      playSpeechItems(items, {
        title,
        rate: settings.ttsRate,
        voiceURI: settings.ttsVoiceURI,
        japaneseVoiceURI: settings.ttsJapaneseVoiceURI,
        startSegment: plan.startSegment,
      })
    }
    // 範囲・速さ・声を変えても、いまのカードは読み直さない（次のカードから）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardKey, spellingHidden, answerOpen])
}
