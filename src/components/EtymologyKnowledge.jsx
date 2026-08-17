import {
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_SOURCE_META,
  getRoot,
  getWord,
} from '../data/vocab.js'
import { EtymologyFormula, EtymologyHistoryTrail } from './WordBits.jsx'
import { ArrowRight } from './Icons.jsx'

export const wordsForEtymologyPack = (pack) =>
  pack.studyIds.map(getWord).filter(Boolean)

function WordHeads({ words }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {words.map((word) => (
        <span
          key={word.id}
          className="rounded-xl bg-brand-50 px-3 py-1.5 font-display text-sm font-extrabold text-brand-700 ring-1 ring-brand-100"
        >
          {word.word}
        </span>
      ))}
    </div>
  )
}

export function EtymologyKnowledgePrompt({ pack, words }) {
  const lead = words[0]
  const root = pack.rootId ? getRoot(pack.rootId) : null

  if (pack.mode === 'formula') {
    const examples = words.filter((word) => word.etymology?.parts?.length).slice(0, 3)
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold leading-relaxed text-ink/55">
          色のついた部品の意味を左から足して、単語の意味を予想してみよう。
        </p>
        <div className="space-y-3">
          {examples.map((word) => (
            <div key={word.id} className="rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
              <p className="font-display text-2xl font-extrabold text-ink">{word.word}</p>
              <p className="mt-2 text-sm font-black text-brand-500">
                {word.etymology.parts.map((part) => part.t).join(' ＋ ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (pack.mode === 'root') {
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold leading-relaxed text-ink/55">
          語根は、単語の意味の中心になる部品です。この語根はどんな意味？
        </p>
        <p className="font-display text-5xl font-extrabold tracking-tight text-brand-700">
          {root?.form ?? pack.rootId}
        </p>
        <WordHeads words={words.slice(0, 5)} />
      </div>
    )
  }

  if (pack.mode === 'family') {
    const anchor = getWord(pack.anchorId) ?? lead
    return (
      <div className="space-y-5 text-center">
        <p className="text-sm font-extrabold leading-relaxed text-ink/55">
          もとの単語と仲間を比べよう。つづりの同じ部分はどこ？
        </p>
        <p className="font-display text-4xl font-extrabold tracking-tight text-brand-700">
          {anchor?.word}
        </p>
        <ArrowRight className="mx-auto rotate-90 text-brand-300" size={24} />
        <WordHeads words={words.filter((word) => word.id !== anchor?.id).slice(0, 6)} />
      </div>
    )
  }

  const formation = ETYMOLOGY_FORMATION_META[pack.formationKey]
  const source = ETYMOLOGY_SOURCE_META[pack.sourceKey]
  const domain = ETYMOLOGY_DOMAIN_META[pack.domainKey]
  return (
    <div className="space-y-5 text-center">
      <p className="text-sm font-extrabold leading-relaxed text-ink/55">
        この語は、どの言語から来て、どう今の意味になった？
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['作られ方', formation?.emoji, formation?.short],
          ['もとの言語', source?.emoji, source?.short],
          ['今の分野', domain?.emoji, pack.fieldLabel ?? domain?.label],
        ].map(([label, emoji, value]) => (
          <div key={label} className="min-w-0 rounded-xl bg-slate-50 px-2 py-2 ring-1 ring-slate-100">
            <p className="text-xs font-extrabold text-ink/45">{label}</p>
            <p className="mt-1 text-xs font-extrabold leading-snug text-ink/75">
              {emoji} {value}
            </p>
          </div>
        ))}
      </div>
      <p className="font-display text-4xl font-extrabold tracking-tight text-brand-700">
        {lead?.word}
      </p>
      <WordHeads words={words.slice(1, 5)} />
      <p className="text-xs font-bold leading-relaxed text-amber-700">
        このカードの語は、同じ語根の仲間とは限りません。1語ずつ由来を確かめます。
      </p>
    </div>
  )
}

export function EtymologyKnowledgeAnswer({ pack, words }) {
  const root = pack.rootId ? getRoot(pack.rootId) : null

  return (
    <div className="space-y-3" data-etymology-word-bundle>
      <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p className="text-xs font-extrabold text-emerald-600">覚えるポイント</p>
        <h2 className="mt-1 font-display text-lg font-extrabold leading-snug text-ink">
          {pack.title}
        </h2>
        <p className="mt-1 text-xs font-bold leading-relaxed text-ink/55">
          {root ? `${root.form} ＝ ${root.meaning}` : pack.description}
        </p>
      </div>

      {pack.caution && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-extrabold leading-relaxed text-amber-800 ring-1 ring-amber-100">
          {pack.caution}
        </p>
      )}

      <div className="space-y-2">
        {words.map((word) => (
          <div key={word.id} className="rounded-2xl bg-white p-3 ring-1 ring-brand-100">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-extrabold text-ink">{word.word}</span>
              <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink/50">
                {word.meaning}
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
            ) : (
              word.etymology?.note && (
                <p className="mt-1.5 text-xs font-bold leading-relaxed text-ink/55">
                  {word.etymology.note}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
