import { Card } from './ui.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Check, Lightbulb } from './Icons.jsx'
import { ExplainedText } from './ExplainedText.jsx'
import { PhraseCardList, RelatedWordList } from './WordRelations.jsx'
import { UsageGuideProvider } from './UsageGuideLink.jsx'
import { useStore } from '../store/useStore.js'
import { usageGuideMembers } from '../lib/usageGuides.js'

/**
 * 使い分けカード（data/usage-guides.js）。単語カードの裏・辞書ページ・熟語の詳細とカードの裏で、
 * 関連語の欄の1つとして出す。カードの下に、カードに入っている相手の語・熟語を並べ、押すとその語・熟語へ移れる。
 * self は見ている語・熟語（{ wordId } か { phraseId }）。onWord がなければ辞書ページへ移る。
 */
export function UsageGuideSection({ guides = [], self = {}, onWord = null, navigateTo = null, returnTo = null }) {
  const storeNavigate = useStore((state) => state.navigate)
  if (!guides.length) return null
  const openWord = onWord ?? ((id) => (navigateTo ?? storeNavigate)('wordDetail', { id }))
  return (
    <div className="space-y-3" data-usage-guide-section>
      {guides.map((guide) => (
        <UsageGuideCard
          key={guide.id}
          guide={guide}
          footer={<UsageGuideMembers guide={guide} self={self} onWord={openWord} navigateTo={navigateTo} returnTo={returnTo} />}
        />
      ))}
    </div>
  )
}

function UsageGuideMembers({ guide, self, onWord, navigateTo, returnTo }) {
  const members = usageGuideMembers(guide, self)
  const words = members.filter((member) => member.kind === 'word').map((member) => ({ w: member.text, m: member.entry.meaning, id: member.id }))
  const phrases = members.filter((member) => member.kind === 'phrase').map((member) => member.entry)
  if (!words.length && !phrases.length) return null
  return (
    // カードの中の相手の行には「使い分けカード」のボタンを重ねない。
    <UsageGuideProvider guides={[]}>
      <div className="border-t border-amber-100 px-4 pb-3 pt-2.5" data-usage-guide-members={guide.id}>
        <div className="mb-1 text-xs font-extrabold text-amber-700">このカードで比べる語</div>
        {words.length > 0 && <RelatedWordList items={words} tone="syn" onWord={onWord} />}
        {phrases.length > 0 && <PhraseCardList phrases={phrases} navigateTo={navigateTo} returnTo={returnTo} />}
      </div>
    </UsageGuideProvider>
  )
}

export function UsageGuideCards({ guides = [] }) {
  if (!guides.length) return null
  return (
    <div className="space-y-3">
      {guides.map((guide) => <UsageGuideCard key={guide.id} guide={guide} />)}
    </div>
  )
}

function UsageGuideCard({ guide, footer = null }) {
  return (
    <Card className="scroll-mt-28 overflow-hidden" data-usage-guide={guide.id}>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-amber-700">
          <Lightbulb size={16} />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">
            使い分けカード
          </span>
        </div>
        <h2 className="mt-1 font-display text-lg font-extrabold text-ink">
          {guide.title}
        </h2>
        <p className="mt-1 text-sm font-bold leading-relaxed text-amber-950/75">
          <ExplainedText>{guide.summary}</ExplainedText>
        </p>
      </div>

      <div className="divide-y divide-brand-50 px-4">
        {guide.choices.map((choice) => (
          <div key={`${guide.id}-${choice.term}`} className="py-3">
            <div className="flex items-start gap-2">
              <span className="shrink-0 rounded-lg bg-brand-50 px-2 py-1 font-display text-sm font-extrabold text-brand-700">
                {choice.term}
              </span>
              <p className="pt-0.5 text-sm font-bold leading-relaxed text-ink/75">
                <ExplainedText>{choice.rule}</ExplainedText>
              </p>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-xl bg-ink/[0.025] p-2.5">
              <SpeakButton text={choice.example} size="sm" />
              <div className="min-w-0">
                <p className="font-bold text-ink" data-explain-exempt="例文">{choice.example}</p>
                <p className="mt-0.5 text-xs font-bold text-ink/50" data-explain-exempt="例文">{choice.ja}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {guide.preferred && (
        <div className="m-3 rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
          <div className="mb-2 flex items-center gap-1.5 text-emerald-700">
            <Check size={15} />
            <span className="text-[11px] font-extrabold uppercase tracking-wide">
              自然・推奨
            </span>
          </div>
          <div className="grid gap-1.5 text-sm font-bold">
            <p className="text-rose-600" data-explain-exempt="用例">
              <span className="mr-1.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px]">避ける</span>
              {guide.preferred.avoid}
            </p>
            <p className="text-emerald-800" data-explain-exempt="用例">
              <span className="mr-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px]">使う</span>
              {guide.preferred.use}
            </p>
          </div>
          <p className="mt-2 text-xs font-bold leading-relaxed text-emerald-900/70">
            <ExplainedText>{guide.preferred.reason}</ExplainedText>
          </p>
        </div>
      )}
      {footer}
    </Card>
  )
}
