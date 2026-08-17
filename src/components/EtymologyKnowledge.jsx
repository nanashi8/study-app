import { getWord } from '../data/vocab.js'
import {
  cleanEtymologyMeaningText,
  etymologyMeaningGuideFor,
} from '../lib/etymologyMeaning.js'
import { EtymologyFormula, EtymologyHistoryTrail } from './WordBits.jsx'

export const wordsForEtymologyPack = (pack) =>
  pack.studyIds.map(getWord).filter(Boolean)

function StepHeading({ id, number, title, detail }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-violet-600 text-xs font-extrabold text-white">
        {number}
      </span>
      <div className="min-w-0">
        <h2 id={id} className="font-display text-base font-extrabold text-ink">{title}</h2>
        {detail && <p className="mt-0.5 text-xs font-bold leading-relaxed text-ink/50">{detail}</p>}
      </div>
    </div>
  )
}

export function EtymologyKnowledgePrompt({ pack }) {
  const guide = etymologyMeaningGuideFor(pack)
  return (
    <div className="space-y-4 text-center" data-etymology-meaning-prompt>
      <p className="text-xs font-extrabold text-violet-600">語の形から意味を予想しよう</p>
      <p className="font-display text-4xl font-extrabold tracking-tight text-ink">{guide.headword}</p>
      <p className="rounded-2xl bg-violet-50 px-4 py-4 font-display text-lg font-extrabold leading-relaxed text-violet-800 ring-1 ring-violet-100">
        {guide.statement}
      </p>
    </div>
  )
}

export function EtymologyKnowledgeAnswer({ pack, words }) {
  const guide = etymologyMeaningGuideFor(pack)

  return (
    <div className="space-y-5" data-etymology-learning-flow>
      <section className="space-y-3" aria-labelledby="etymology-step-shape">
        <StepHeading
          id="etymology-step-shape"
          number="1"
          title="語の形を見る"
          detail="かっこの中が、その部品や語の意味です。"
        />
        <div className="rounded-2xl bg-violet-50 px-4 py-4 text-center ring-1 ring-violet-100">
          <p className="font-display text-2xl font-extrabold text-ink">
            {guide.headword}
          </p>
          <p className="mt-2 break-words font-display text-base font-extrabold leading-relaxed text-violet-800">
            {guide.statement}
          </p>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="etymology-step-meaning">
        <StepHeading
          id="etymology-step-meaning"
          number="2"
          title="意味をつなぐ"
          detail={guide.explanation}
        />
        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100">
          <span className="shrink-0 text-xs font-extrabold text-emerald-700">今の意味</span>
          <span className="min-w-0 flex-1 font-display text-lg font-extrabold text-ink">
            {guide.meaning}
          </span>
        </div>
      </section>

      <section className="space-y-3" aria-labelledby="etymology-step-related">
        <StepHeading
          id="etymology-step-related"
          number="3"
          title="関連語で確かめる"
          detail="同じカードの単語も、形と意味を一緒に見ます。"
        />
        <div className="grid gap-2 sm:grid-cols-2" data-etymology-related-words>
          {words.map((word) => (
            <div key={word.id} className="min-w-0 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base font-extrabold text-ink">{word.word}</span>
                <span className="min-w-0 flex-1 text-xs font-bold leading-relaxed text-ink/55">
                  {word.meanings?.slice(0, 2).join('・') || word.meaning}
                </span>
              </div>
              {pack.mode === 'formula' ? (
                <div className="mt-2">
                  <EtymologyFormula word={word} compact />
                </div>
              ) : pack.mode === 'origin' ? (
                <div className="mt-2">
                  <EtymologyHistoryTrail word={word} compact />
                </div>
              ) : word.etymology?.note ? (
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/55">
                  {cleanEtymologyMeaningText(word.etymology.note)}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
