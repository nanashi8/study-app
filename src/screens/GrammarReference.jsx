import { useEffect, useMemo, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import { getLevel } from '../data/levels.js'
import { grammarPracticeByTopic } from '../data/grammar.js'
import { grammarStrandForTopic } from '../data/grammar-strands.js'
import {
  grammarReferenceById,
  grammarReferenceByLevel,
  grammarReferenceNeighbors,
} from '../data/grammar-reference/index.js'
import { prepareReferenceUnit } from '../lib/grammarReferenceText.js'
import { GRAMMAR_REFERENCE_RESULTS, formatStudyDay, latestGrammarReference } from '../lib/grammarReferenceLog.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { RefExample, RefParts, RefPeek, RefTable } from '../components/GrammarReferenceParts.jsx'
import { StudySelfCheck } from '../components/GrammarStudyRecord.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import { ArrowRight, BookOpen, Cards, Check, ChevronLeft, ChevronRight, Lightbulb, Target } from '../components/Icons.jsx'

// 文法の参考書の1単元（英検の級×単元）。読んで確かめてから、同じ単元のテストへ進む。
// 読み終えたら「まだまだ」「理解した」を押し、その日の結果を学習記録（grammarReferenceLog）に残す。

function SectionHeading({ icon, children, className = '' }) {
  return (
    <h2 className={cx('mb-2 flex items-center gap-1.5 text-[13px] font-extrabold text-brand-700', className)}>
      {icon}
      {children}
    </h2>
  )
}

export function GrammarReferenceScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const replaceParams = useStore((state) => state.replaceParams)
  const grammarReferenceLog = useStore((state) => state.grammarReferenceLog)
  const recordGrammarReference = useStore((state) => state.recordGrammarReference)
  const recordVocabHistory = useStore((state) => state.recordVocabHistory)
  const unitId = params.unitId
  const unit = grammarReferenceById(unitId)
  const page = useMemo(() => (unit ? prepareReferenceUnit(unit) : null), [unit])
  const [peek, setPeek] = useState(null)

  // 別の単元へ移ったら、意味の窓は閉じる。
  useEffect(() => setPeek(null), [unitId])

  if (!unit || !page) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">ページが見つかりませんでした。</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const level = getLevel(unit.level)
  const questionCount = grammarPracticeByTopic(unit.level, unit.topic, 'mixed').length
  const strand = grammarStrandForTopic(unit.level, unit.topic)
  const { previous, next } = grammarReferenceNeighbors(unit.id)
  const units = grammarReferenceByLevel(unit.level)
  const number = units.findIndex((item) => item.id === unit.id) + 1
  const latest = latestGrammarReference(grammarReferenceLog, unit.id)

  const pick = (item) => {
    if (item.kind === 'word' && item.word.id) recordVocabHistory(item.word.id)
    setPeek((current) => (current?.kind === item.kind && current.key === item.key ? null : item))
  }
  const startTest = () => {
    navigate('grammarQuiz', {
      source: { type: 'grammar', level: unit.level, topic: unit.topic, questionType: 'mixed' },
      title: `${unit.topic}・3種類`,
      levelColor: level.color,
      returnTo: { screen: 'grammarReference', params: { unitId: unit.id } },
    })
  }
  // 前後の単元へは同じ画面のまま移る（戻るで目次へ帰れるように、履歴を積まない）。
  const openUnit = (id) => {
    replaceParams({ ...params, unitId: id })
    scrollScreenToTop()
  }

  return (
    <div className="pb-6" data-grammar-reference={unit.id}>
      <ScreenHeader
        title={unit.topic}
        subtitle={`英検${level.label}の文法・${number}/${units.length}`}
        color={level.color}
      />

      <div className="space-y-6 px-4 pt-4">
        {/* 題とここで学ぶこと */}
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={level.color}>英検{level.label}</Chip>
            <span className="text-xs font-bold text-ink/45">{level.sub}</span>
            {latest && (
              <Chip color={GRAMMAR_REFERENCE_RESULTS[latest.result].color}>
                {`${formatStudyDay(latest.day)} ${GRAMMAR_REFERENCE_RESULTS[latest.result].label}`}
              </Chip>
            )}
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink">{unit.title}</h1>
          <div className="mt-3 rounded-2xl bg-brand-50 p-3.5">
            <div className="mb-1 text-[11px] font-extrabold text-brand-600">ここで学ぶこと</div>
            <p className="text-[15px] font-bold leading-relaxed text-ink/85">
              <RefParts parts={page.leadParts} onPick={pick} active={peek} />
            </p>
          </div>
          <p className="mt-2 px-1 text-[11px] font-bold text-ink/45">
            {'青い英単語や点線の用語をタップすると、意味が出ます。'}
          </p>
        </section>

        {/* 基本の形 */}
        {page.forms.length > 0 && (
          <section>
            <SectionHeading icon={<BookOpen size={16} />}>基本の形</SectionHeading>
            <div className="space-y-2">
              {page.forms.map((form, index) => (
                <div key={index} className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-card">
                  <div className="text-[11px] font-extrabold text-ink/45">
                    <RefParts parts={form.labelParts} onPick={pick} active={peek} />
                  </div>
                  <p className="mt-0.5 font-display text-[15px] font-extrabold leading-relaxed text-ink">
                    <RefParts parts={form.formParts} onPick={pick} active={peek} />
                  </p>
                  {form.example && <RefExample example={form.example} onPick={pick} active={peek} className="mt-2 bg-brand-50/40" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ポイント */}
        {page.points.map((point, index) => (
          <section key={index} data-grammar-ref-point={index + 1}>
            <h2 className="mb-2 flex items-start gap-2 font-display text-lg font-extrabold leading-snug text-ink">
              <span
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black text-white"
                style={{ background: level.color }}
              >
                {index + 1}
              </span>
              <span><RefParts parts={point.titleParts} onPick={pick} active={peek} /></span>
            </h2>
            <div className="space-y-2.5">
              {point.textParts.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-[15px] font-bold leading-relaxed text-ink/80">
                  <RefParts parts={paragraph} onPick={pick} active={peek} />
                </p>
              ))}
              <RefTable table={point.tableParts} onPick={pick} active={peek} />
              {point.examples.length > 0 && (
                <div className="space-y-1.5">
                  {point.examples.map((example, exampleIndex) => (
                    <RefExample key={exampleIndex} example={example} onPick={pick} active={peek} />
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}

        {/* 言いかえ */}
        {page.rewrites.length > 0 && (
          <section>
            <SectionHeading icon={<ArrowRight size={16} />}>同じ意味の言いかえ</SectionHeading>
            <div className="space-y-2">
              {page.rewrites.map((rewrite, index) => (
                <div key={index} className="rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100">
                  <p lang="en" className="text-[15px] font-bold leading-relaxed text-ink">
                    <RefParts parts={rewrite.fromParts} onPick={pick} active={peek} tone="example" />
                  </p>
                  <p className="my-0.5 text-xs font-black text-sky-600">＝</p>
                  <p lang="en" className="text-[15px] font-bold leading-relaxed text-ink">
                    <RefParts parts={rewrite.toParts} onPick={pick} active={peek} tone="example" />
                  </p>
                  <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-sky-900/70">
                    <RefParts parts={rewrite.noteParts} onPick={pick} active={peek} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 間違えやすいところ */}
        {page.mistakes.length > 0 && (
          <section>
            <SectionHeading icon={<Lightbulb size={16} />} className="text-rose-600">間違えやすいところ</SectionHeading>
            <div className="space-y-2">
              {page.mistakes.map((mistake, index) => (
                <div key={index} className="rounded-2xl bg-rose-50/70 p-3 ring-1 ring-rose-100">
                  <p className="text-[15px] font-bold leading-relaxed text-rose-700">
                    <span className="mr-1.5 font-black">×</span>
                    <span lang="en" className="line-through decoration-rose-300">
                      <RefParts parts={mistake.wrongParts} onPick={pick} active={peek} tone="example" />
                    </span>
                  </p>
                  <p className="mt-1 text-[15px] font-bold leading-relaxed text-emerald-700">
                    <span className="mr-1.5 font-black">○</span>
                    <span lang="en"><RefParts parts={mistake.rightParts} onPick={pick} active={peek} tone="example" /></span>
                  </p>
                  <p className="mt-1.5 text-[13px] font-bold leading-relaxed text-ink/65">
                    <RefParts parts={mistake.whyParts} onPick={pick} active={peek} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 発展 */}
        {page.advanced && (
          <section className="rounded-2xl border-2 border-dashed border-violet-200 p-3.5">
            <div className="mb-1 flex items-center gap-2">
              <Chip color={getLevel(page.advanced.level).color}>{getLevel(page.advanced.level).label}から</Chip>
              <span className="text-[11px] font-extrabold text-violet-600">発展</span>
            </div>
            <h2 className="mb-2 font-display text-base font-extrabold text-ink">
              <RefParts parts={page.advanced.titleParts} onPick={pick} active={peek} />
            </h2>
            <div className="space-y-2.5">
              {page.advanced.textParts.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-[15px] font-bold leading-relaxed text-ink/80">
                  <RefParts parts={paragraph} onPick={pick} active={peek} />
                </p>
              ))}
              <RefTable table={page.advanced.tableParts} onPick={pick} active={peek} />
              {page.advanced.examples.map((example, exampleIndex) => (
                <RefExample key={exampleIndex} example={example} onPick={pick} active={peek} />
              ))}
            </div>
          </section>
        )}

        {/* テスト前のチェック */}
        <section className="rounded-2xl bg-emerald-50 p-3.5 ring-1 ring-emerald-100">
          <SectionHeading icon={<Check size={16} />} className="text-emerald-700">テストの前にチェック</SectionHeading>
          <ul className="space-y-1.5">
            {page.checkParts.map((item, index) => (
              <li key={index} className="flex gap-2 text-[15px] font-bold leading-relaxed text-emerald-900/80">
                <span className="mt-1 shrink-0 text-emerald-500"><Check size={15} /></span>
                <span><RefParts parts={item} onPick={pick} active={peek} /></span>
              </li>
            ))}
          </ul>
        </section>

        {/* 読み終えたら：まだまだ／理解した（押した日と結果が目次に履歴として残る） */}
        <StudySelfCheck
          pageId={unit.id}
          log={grammarReferenceLog}
          today={todayIndex()}
          question="この単元は理解できましたか。"
          onRecord={(result) => recordGrammarReference(unit.id, result)}
        />

        {/* テストへ・つながる単元 */}
        <section className="space-y-2.5">
          <Button full size="lg" onClick={startTest} disabled={!questionCount} className="h-auto min-h-14 py-2.5" data-grammar-ref-test>
            <Cards size={20} />
            <span className="text-left leading-tight">
              <span className="block">この単元のテストにチャレンジ</span>
              <span className="block text-xs font-bold text-white/80">{`${unit.topic}・${questionCount}問`}</span>
            </span>
          </Button>
          {strand && (
            <button
              type="button"
              onClick={() => navigate('grammarStrandReference', { strandId: strand.id })}
              className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 text-left shadow-card active:bg-brand-50"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-lg">{strand.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-ink">{strand.name}</span>
                <span className="block text-[11px] font-bold text-ink/50">級をまたいで、下の級から上の級まで読む</span>
              </span>
              <Target size={18} className="shrink-0 text-violet-500" />
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!previous}
              onClick={() => previous && openUnit(previous.id)}
              className="flex min-h-14 items-center gap-1 rounded-2xl bg-white px-2.5 text-left shadow-sm ring-1 ring-slate-200/70 active:bg-brand-50 disabled:opacity-35"
            >
              <ChevronLeft size={18} className="shrink-0 text-brand-400" />
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold text-ink/40">前の単元</span>
                <span className="block truncate text-xs font-extrabold text-ink">{previous?.topic ?? '―'}</span>
              </span>
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && openUnit(next.id)}
              className="flex min-h-14 items-center justify-end gap-1 rounded-2xl bg-white px-2.5 text-right shadow-sm ring-1 ring-slate-200/70 active:bg-brand-50 disabled:opacity-35"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold text-ink/40">次の単元</span>
                <span className="block truncate text-xs font-extrabold text-ink">{next?.topic ?? '―'}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-brand-400" />
            </button>
          </div>
        </section>

        <RefPeek item={peek} onClose={() => setPeek(null)} />
      </div>
    </div>
  )
}
