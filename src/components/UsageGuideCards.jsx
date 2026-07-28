import { Card } from './ui.jsx'
import { SpeakButton } from './SpeakButton.jsx'
import { Check, Lightbulb } from './Icons.jsx'

export function UsageGuideCards({ guides = [] }) {
  if (!guides.length) return null

  return (
    <div className="space-y-3">
      {guides.map((guide) => (
        <Card key={guide.id} className="overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3.5">
            <div className="flex items-center gap-1.5 text-amber-700">
              <Lightbulb size={16} />
              <span className="text-[11px] font-extrabold uppercase tracking-wide">
                入試で差がつく使い分け
              </span>
            </div>
            <h2 className="mt-1 font-display text-lg font-extrabold text-ink">
              {guide.title}
            </h2>
            <p className="mt-1 text-sm font-bold leading-relaxed text-amber-950/75">
              {guide.summary}
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
                    {choice.rule}
                  </p>
                </div>
                <div className="mt-2 flex items-start gap-2 rounded-xl bg-ink/[0.025] p-2.5">
                  <SpeakButton text={choice.example} size="sm" />
                  <div className="min-w-0">
                    <p className="font-bold text-ink">{choice.example}</p>
                    <p className="mt-0.5 text-xs font-bold text-ink/50">{choice.ja}</p>
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
                <p className="text-rose-600">
                  <span className="mr-1.5 rounded bg-rose-100 px-1.5 py-0.5 text-[10px]">避ける</span>
                  {guide.preferred.avoid}
                </p>
                <p className="text-emerald-800">
                  <span className="mr-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px]">使う</span>
                  {guide.preferred.use}
                </p>
              </div>
              <p className="mt-2 text-xs font-bold leading-relaxed text-emerald-900/70">
                {guide.preferred.reason}
              </p>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
