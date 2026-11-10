import { useStore, useContentSettings } from '../store/useStore.js'
import { cardSpeechItems } from '../lib/cardSpeech.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { Sheet } from './Sheet.jsx'
import { PhraseStudyCard } from './PhraseStudyCard.jsx'

/**
 * 熟語・構文1件の詳細。熟語・構文の一覧、英和辞書、単語の辞書ページ・暗記カードの裏の熟語・構文カード、
 * 読解の準備で同じものを出す。中身は熟語・構文の暗記カード（PhraseStudyCard）を開いた面のまま見せる。
 * navigateTo は同じ形の仲間を学ぶときの移り方（暗記の途中なら記録を残してから移る）。
 * footer はカードの末尾に置くボタン（「この項目を暗記」など）。
 */
export function PhraseDetailSheet({ phrase, onClose, familyId = null, returnTo = null, navigateTo = null, footer = null }) {
  return (
    <Sheet open={!!phrase} onClose={onClose} title="くわしく">
      {phrase && <PhraseDetail phrase={phrase} familyId={familyId} returnTo={returnTo} navigateTo={navigateTo} footer={footer} />}
    </Sheet>
  )
}

/** シートの中身。暗記カードと同じカードを開いた面で出す。 */
export function PhraseDetail({ phrase, familyId = null, returnTo = null, navigateTo = null, footer = null }) {
  const settings = useContentSettings()
  const entry = useStore((state) => state.srs[phrase.id] ?? null)
  // 暗記カードと同じ読み上げ列。開いた面を見ているので、意味・例文まで範囲どおりに読む。
  const speechKey = `detail:${phrase.id}`
  const speechItems = cardSpeechItems({
    id: phrase.id,
    head: phraseSpeechText(phrase),
    headStyle: phrase.kind === 'syntax' ? 'sentence' : 'phrase',
    meanings: phrase.meanings?.length ? phrase.meanings : [phrase.meaning],
    example: phrase.example,
    range: settings.speechRange,
    answerOpen: true,
  })
  return (
    <div data-phrase-detail={phrase.id}>
      <PhraseStudyCard
        key={phrase.id}
        item={phrase}
        entry={entry}
        flipped
        speechItems={speechItems}
        speechKey={speechKey}
        returnTo={returnTo}
        familyId={familyId}
        navigateTo={navigateTo}
        footer={footer}
      />
    </div>
  )
}
