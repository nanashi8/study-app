import { getLevel } from '../data/levels.js'
import { longSentenceTranslationFor } from '../data/long-sentence-translations.js'
import { phraseSpeechText } from '../lib/phrase-speech.js'
import { usageGuidesForPhrase } from '../lib/usageGuides.js'
import { SpeakButton } from './SpeakButton.jsx'
import { StudyReviewHistory } from './StudyReviewHistory.jsx'
import { LongSentenceTranslation } from './LongSentenceTranslation.jsx'
import { SyntaxFamilyGuide } from './SyntaxFamilyGuide.jsx'
import { IdiomFormGuide } from './IdiomFormGuide.jsx'
import { UsageGuideSection } from './UsageGuideCards.jsx'
import { MeaningText } from './MeaningText.jsx'
import { Chip } from './ui.jsx'
import { ArrowRight, Lightbulb, Link } from './Icons.jsx'

/** 熟語・構文・表現のどれか（カードの右上の札）。 */
export const phraseCardKind = (p) =>
  p.category === 'expression' ? { label: '表現', color: '#0ea5e9' }
  : p.kind === 'syntax' ? { label: '構文', color: '#8b5cf6' }
  : { label: '熟語', color: '#0ea5e9' }

/**
 * 熟語・構文のカード1枚。暗記カード（PhraseStudy）と、英和辞書・熟語の一覧・辞書ページの熟語の欄・
 * 読解の準備などから開く熟語の詳細（PhraseDetail）で同じものを使う。
 * 詳細では開いた面（意味・成り立ち・例文…）を最初から出す（flipped を true のまま渡す）。
 *
 * - onToggle: カードを押したとき（暗記カードは表と裏を切り替える）。詳細では渡さない。
 * - navigateTo: 同じ形の仲間・使い分けの相手へ移るとき（暗記の途中なら記録を残してから）
 * - footer: 開いた面の末尾に置くもの（詳細の「この項目を暗記」など）
 */
export function PhraseStudyCard({
  item,
  entry = null,
  flipped,
  onToggle = null,
  spellingHidden = false,
  speechItems = [],
  speechKey = null,
  returnTo = null,
  familyId = null,
  navigateTo = null,
  footer = null,
}) {
  const level = getLevel(item.level)
  const kind = phraseCardKind(item)
  const longSentenceTranslation = longSentenceTranslationFor(item)
  const meanings = item.meanings?.length ? item.meanings : [item.meaning]
  return (
    <div
      onClick={() => onToggle?.()}
      className="animate-pop-in rounded-[2rem] bg-white p-6 shadow-card"
      data-phrase-study-card={item.id}
    >
      <div className="flex justify-between">
        <Chip color={level.color}>英検{level.label}</Chip>
        <Chip color={kind.color}>{kind.label}</Chip>
      </div>
      <div className="mt-3 flex flex-col items-center text-center">
        {spellingHidden ? (
          // 英語を隠すモード：意味から英語を思い出す。英語と読み上げはカードを開くまで出さない。
          <>
            <p className="text-[11px] font-extrabold text-brand-400">意味</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-snug text-ink" data-phrase-english-hidden>
              <MeaningText>{meanings.join('・')}</MeaningText>
            </h2>
          </>
        ) : (
          <>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink">{item.phrase}</h2>
            <div className="mt-3">
              <SpeakButton
                text={phraseSpeechText(item)}
                phrases={speechItems}
                phraseIndex={0}
                speechKey={speechKey}
                title="熟語・構文カード"
                size="lg"
              />
            </div>
          </>
        )}
        {/* この項目をいつ答えたか・次にいつ復習するか。英単語のカードと同じ並べ方。 */}
        <StudyReviewHistory entry={entry} className="mt-2" />
      </div>

      {!flipped ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 py-8 text-brand-400">
          <span className="text-sm font-extrabold">
            {spellingHidden
              ? 'タップして英語と発音を確かめる'
              : `タップして${item.kind === 'syntax' ? '意味とポイント' : '意味と成り立ち'}を見る`}
          </span>
          <ArrowRight size={20} className="rotate-90" />
        </div>
      ) : (
        <div className="mt-5 space-y-4 animate-slide-up">
          <div className="rounded-2xl bg-brand-50 p-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-brand-400">意味</div>
            <div className="mt-0.5 font-display text-xl font-extrabold text-ink"><MeaningText>{meanings.join('・')}</MeaningText></div>
          </div>

          {/* 成り立ち（語源・部品の意味から組み立てる）＝単語の語源にあたる */}
          {item.origin && (
            <div className="rounded-2xl bg-violet-50 p-4 ring-1 ring-violet-100">
              <div className="mb-1.5 flex items-center gap-1.5 text-violet-600">
                <Link size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wide">
                  {item.kind === 'syntax' ? 'この文のポイント' : '成り立ち'}
                </span>
              </div>
              <p className="text-sm font-bold leading-relaxed text-violet-900/90">{item.origin}</p>
            </div>
          )}

          {item.example && (
            <div className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
              <div className="flex items-start gap-2">
                <SpeakButton
                  text={item.example.en}
                  phrases={speechItems}
                  phraseIndex={1}
                  speechKey={speechKey}
                  title="熟語・構文カード"
                  size="sm"
                />
                <div>
                  <p className="font-bold text-ink">{item.example.en}</p>
                  <p className="mt-0.5 text-sm font-bold text-ink/55">
                    {longSentenceTranslation && <span className="mr-1 text-[11px] text-ink/35">自然な和訳</span>}
                    <MeaningText>{item.example.ja}</MeaningText>
                  </p>
                </div>
              </div>
            </div>
          )}
          <LongSentenceTranslation guide={longSentenceTranslation} />
          {item.note && (
            <div className="flex gap-2 rounded-2xl bg-hint-soft/70 p-3">
              <span className="mt-0.5 shrink-0 text-hint"><Lightbulb size={18} /></span>
              <p className="text-sm font-bold leading-relaxed text-amber-900/90">{item.note}</p>
            </div>
          )}
          {/* 使い分けカード（この熟語と取り違えやすい語・熟語を例文で比べる）。相手の語・熟語へ移れる。 */}
          <UsageGuideSection guides={usageGuidesForPhrase(item)} self={{ phraseId: item.id }} navigateTo={navigateTo} returnTo={returnTo} />
          <SyntaxFamilyGuide item={item} />
          <IdiomFormGuide item={item} familyId={familyId} returnTo={returnTo} navigateTo={navigateTo} />
          {footer}
        </div>
      )}
    </div>
  )
}
