import { useMemo, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { getGrammarStrand } from '../data/grammar-strands.js'
import {
  grammarReferenceFor,
  grammarStrandReferenceFor,
} from '../data/grammar-reference/index.js'
import { strandOverview } from '../lib/grammarStrand.js'
import { exampleParts, explanationParts } from '../lib/grammarReferenceText.js'
import {
  GRAMMAR_REFERENCE_RESULTS,
  formatStudyDay,
  latestGrammarReference,
  strandReferencePageId,
} from '../lib/grammarReferenceLog.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { RefExample, RefParts, RefPeek } from '../components/GrammarReferenceParts.jsx'
import { StudySelfCheck } from '../components/GrammarStudyRecord.jsx'
import { Button, Chip } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Check, Lightbulb, Target } from '../components/Icons.jsx'

// 級をまたいだ単元（系統）の参考書。下の級から上の級へ、同じ文法がどう広がるかを1ページで見て、
// 段ごとの単元ページへ進む。最後に、成績に合わせた級から系統のテストを始める。

function prepareStrandPage(reference) {
  const overviewSeen = new Set()
  const linkSeen = new Set()
  return {
    overview: reference.overview.map((paragraph) => explanationParts(paragraph, overviewSeen)),
    steps: reference.steps.map((step) => {
      const seen = new Set()
      return {
        ...step,
        pointParts: explanationParts(step.point, seen),
        example: { ...step.example, parts: exampleParts(step.example.en, step.example.gloss) },
      }
    }),
    links: reference.links.map((link) => explanationParts(link, linkSeen)),
  }
}

export function GrammarStrandReferenceScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const srs = useStore((state) => state.srs)
  const grammarReferenceLog = useStore((state) => state.grammarReferenceLog)
  const recordGrammarReference = useStore((state) => state.recordGrammarReference)
  const grammarStrandPos = useStore((state) => state.grammarStrandPos)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)
  const strand = getGrammarStrand(params.strandId)
  const reference = grammarStrandReferenceFor(params.strandId)
  const page = useMemo(() => (reference ? prepareStrandPage(reference) : null), [reference])
  const [peek, setPeek] = useState(null)

  if (!strand || !page) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">ページが見つかりませんでした。</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const overview = strandOverview(strand, srs, grammarStrandPos?.[strand.id])
  const currentMeta = getLevel(overview.currentLevel)
  const pageId = strandReferencePageId(strand.id)
  const latestPage = latestGrammarReference(grammarReferenceLog, pageId)
  // 単元の、いちばん新しい「理解した／まだまだ」を小さな札にする。
  const resultChip = (unitId) => {
    const latest = latestGrammarReference(grammarReferenceLog, unitId)
    if (!latest) return null
    const result = GRAMMAR_REFERENCE_RESULTS[latest.result]
    return <Chip color={result.color} className="shrink-0">{result.label}</Chip>
  }
  const related = reference.related
    .map(({ level, topic }) => ({ unit: grammarReferenceFor(level, topic), meta: getLevel(level) }))
    .filter(({ unit }) => unit)
  const pick = (item) => {
    if (item.kind === 'word' && item.word.id) recordVocabHistory(item.word.id)
    setPeek((current) => (current?.kind === item.kind && current.key === item.key ? null : item))
  }
  const startTest = () => navigate('grammarQuiz', {
    source: { type: 'grammarStrand', strandId: strand.id, level: overview.currentLevel },
    title: `${strand.name}・${currentMeta.label}`,
    levelColor: currentMeta.color,
    returnTo: { screen: 'grammarStrandReference', params: { strandId: strand.id } },
  })

  return (
    <div className="pb-6" data-grammar-strand-reference={strand.id}>
      <ScreenHeader title={strand.name} subtitle="級をまたいで読む" />

      <div className="space-y-6 px-4 pt-4">
        <section>
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{strand.emoji}</span>
            <h1 className="font-display text-2xl font-extrabold leading-tight text-ink">{strand.name}</h1>
          </div>
          {latestPage && (
            <div className="mt-2">
              <Chip color={GRAMMAR_REFERENCE_RESULTS[latestPage.result].color}>
                {`${formatStudyDay(latestPage.day)} ${GRAMMAR_REFERENCE_RESULTS[latestPage.result].label}`}
              </Chip>
            </div>
          )}
          <div className="mt-3 space-y-2 rounded-2xl bg-violet-50 p-3.5">
            <div className="text-[11px] font-extrabold text-violet-600">全体の見取り図</div>
            {page.overview.map((paragraph, index) => (
              <p key={index} className="text-[15px] font-bold leading-relaxed text-ink/85">
                <RefParts parts={paragraph} onPick={pick} active={peek} />
              </p>
            ))}
          </div>
          <p className="mt-2 px-1 text-[11px] font-bold text-ink/45">
            {'青い英単語や点線の用語をタップすると、意味が出ます。'}
          </p>
        </section>

        {/* 段の並び：下の級から上の級へ */}
        <section>
          <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-brand-700">
            <Target size={16} /> 下の級から順に
          </h2>
          <ol className="relative space-y-3 border-l-2 border-violet-100 pl-4">
            {page.steps.map((step, index) => {
              const meta = getLevel(step.level)
              const unit = grammarReferenceFor(step.level, step.topic)
              return (
                <li key={`${step.level}-${step.topic}`} className="relative" data-return-row={`${step.level}:${step.topic}`}>
                  <span
                    className="absolute -left-[1.42rem] top-3 h-3 w-3 rounded-full ring-4 ring-paper"
                    style={{ background: meta.color }}
                    aria-hidden="true"
                  />
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-card">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip color={meta.color}>{meta.label}</Chip>
                      <span className="font-display text-base font-extrabold text-ink">{step.topic}</span>
                      <span className="text-[11px] font-bold text-ink/35">{index + 1}段目</span>
                      {unit && resultChip(unit.id)}
                    </div>
                    <p className="mt-1.5 text-[15px] font-bold leading-relaxed text-ink/80">
                      <RefParts parts={step.pointParts} onPick={pick} active={peek} />
                    </p>
                    <RefExample example={step.example} onPick={pick} active={peek} className="mt-2 bg-brand-50/40" />
                    {unit && (
                      <button
                        type="button"
                        onClick={() => navigate('grammarReference', { unitId: unit.id })}
                        className="mt-2 flex w-full items-center justify-between gap-2 rounded-xl bg-brand-50 px-3 py-2 text-left text-xs font-extrabold text-brand-700 active:bg-brand-100"
                      >
                        <span className="flex items-center gap-1.5"><BookOpen size={14} /> この単元のページを読む</span>
                        <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        {page.links.length > 0 && (
          <section className="rounded-2xl bg-amber-50 p-3.5 ring-1 ring-amber-100">
            <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-amber-700">
              <Lightbulb size={16} /> つながりと、取り違えやすいところ
            </h2>
            <ul className="space-y-1.5">
              {page.links.map((link, index) => (
                <li key={index} className="flex gap-2 text-[15px] font-bold leading-relaxed text-amber-950/75">
                  <span className="mt-1 shrink-0 text-amber-500"><Check size={15} /></span>
                  <span><RefParts parts={link} onPick={pick} active={peek} /></span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section data-grammar-strand-related>
            <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-brand-700">
              <BookOpen size={16} /> あわせて読む単元
            </h2>
            <div className="space-y-2">
              {related.map(({ unit, meta }) => (
                <button
                  key={unit.id}
                  type="button"
                  data-return-row={`${unit.level}:${unit.topic}`}
                  onClick={() => navigate('grammarReference', { unitId: unit.id })}
                  className="flex w-full items-center gap-2 rounded-2xl border border-slate-200/70 bg-white px-3 py-2.5 text-left shadow-card active:bg-slate-50"
                >
                  <Chip color={meta.color}>{meta.label}</Chip>
                  <span className="min-w-0 flex-1 font-display text-[15px] font-extrabold text-ink">{unit.topic}</span>
                  {resultChip(unit.id)}
                  <ArrowRight size={15} className="shrink-0 text-ink/30" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 読み終えたら：まだまだ／理解した（押した日と結果が一覧に履歴として残る） */}
        <StudySelfCheck
          pageId={pageId}
          log={grammarReferenceLog}
          today={todayIndex()}
          question="この系統は理解できましたか。"
          onRecord={(result) => recordGrammarReference(pageId, result)}
        />

        <section>
          <Button full size="lg" onClick={startTest} data-grammar-strand-ref-test>
            <Target size={18} /> {currentMeta.label}からテストにチャレンジ
          </Button>
          <p className="mt-1.5 px-1 text-[11px] font-bold leading-relaxed text-ink/45">
            {'正解が続けば上の級へ、つまずけば下の級へ移ります。'}
          </p>
        </section>

        <RefPeek item={peek} onClose={() => setPeek(null)} />
      </div>
    </div>
  )
}
