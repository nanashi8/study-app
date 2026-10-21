import { getLevel } from '../data/levels.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { Sheet } from './Sheet.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { LongSentenceTranslation } from './LongSentenceTranslation.jsx'
import { SyntaxFamilyGuide } from './SyntaxFamilyGuide.jsx'
import { IdiomFormGuide } from './IdiomFormGuide.jsx'
import { Chip } from './ui.jsx'
import { Lightbulb, Link } from './Icons.jsx'

/**
 * 熟語・構文1件の詳細（意味・例文・成り立ち・注意・同じ形の仲間）。
 * 熟語・構文の一覧と、単語の辞書ページ・暗記カードの裏の熟語・構文カードで同じ中身を出す。
 * navigateTo は同じ形の仲間を学ぶときの移り方（暗記の途中なら記録を残してから移る）。
 */
export function PhraseDetailSheet({ phrase, onClose, familyId = null, returnTo = null, navigateTo = null }) {
  return (
    <Sheet open={!!phrase} onClose={onClose} title="くわしく">
      {phrase && <PhraseDetail phrase={phrase} familyId={familyId} returnTo={returnTo} navigateTo={navigateTo} />}
    </Sheet>
  )
}

/** シートの中身。 */
export function PhraseDetail({ phrase, familyId = null, returnTo = null, navigateTo = null }) {
  const translation = longSentenceTranslationFor(phrase)
  return (
    <div className="space-y-4" data-phrase-detail={phrase.id}>
      <div className="flex items-center gap-3">
        <SpeakButton text={phraseSpeechText(phrase)} size="md" />
        <div>
          <div className="font-display text-2xl font-extrabold text-ink">{phrase.phrase}</div>
          <Chip color={getLevel(phrase.level).color}>英検{getLevel(phrase.level).label}</Chip>
        </div>
      </div>
      <div className="rounded-2xl bg-brand-50 p-3">
        <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
        <div className="font-display text-lg font-extrabold text-ink">{phrase.meanings.join('・')}</div>
      </div>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
        <div className="flex items-start gap-2">
          <SpeakButton text={phrase.example.en} size="sm" />
          <div>
            <p className="font-bold text-ink">{phrase.example.en}</p>
            <p className="mt-0.5 text-sm font-bold text-ink/55">
              {translation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
              {phrase.example.ja}
            </p>
          </div>
        </div>
      </div>
      <LongSentenceTranslation guide={translation} />
      {phrase.origin && (
        <div className="rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
          <div className="mb-1 flex items-center gap-1.5 text-violet-600">
            <Link size={16} />
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              {phrase.kind === 'syntax' ? 'この文のポイント' : '成り立ち'}
            </span>
          </div>
          <p className="text-sm font-bold leading-relaxed text-violet-900/90">{phrase.origin}</p>
        </div>
      )}
      {phrase.note && (
        <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
          <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
          <p className="text-sm font-bold leading-relaxed text-amber-900/90">{phrase.note}</p>
        </div>
      )}
      <SyntaxFamilyGuide item={phrase} />
      <IdiomFormGuide item={phrase} familyId={familyId} returnTo={returnTo} navigateTo={navigateTo} />
    </div>
  )
}
