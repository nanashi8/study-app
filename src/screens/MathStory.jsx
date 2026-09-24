import { useMemo, useState } from 'react'
import { todayIndex, useStore } from '../store/useStore.js'
import {
  MATH_BASICS,
  MATH_HISTORY_CHAPTERS,
  chapterNeighbors,
  chapterNumber,
  mathHistoryChapter,
  mathHistoryPart,
  mathHistoryThemeColor,
} from '../data/math-history.js'
import { unitById } from '../data/math.js'
import { readableMathAccent } from '../lib/mathVisualColors.js'
import { STUDY_LOG_RESULTS, formatStudyDay, latestStudyLog } from '../lib/studyLog.js'
import { scrollScreenToTop } from '../lib/screenScroll.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { MathHistoryVisual } from '../components/MathHistoryVisual.jsx'
import { MathBlock, MathText } from '../components/MathText.jsx'
import { StudySelfCheck } from '../components/GrammarStudyRecord.jsx'
import { Button, Chip, cx } from '../components/ui.jsx'
import {
  ArrowRight, Cards, ChevronLeft, ChevronRight, Eye, Lightbulb, Link as LinkIcon, Sparkles, Target,
} from '../components/Icons.jsx'
import { VisualControl } from './MathIntro.jsx'
import './MathIntro.css'

// 数学の歴史の1話。困っていたこと → 発見の筋道 → 動かしてみよう → 今の使われ方 → つながる単元 の順に読み、
// 読み終えたら「まだまだ」「理解した」を押して、その日の結果を学習記録（mathStoryLog）に残す。

const BASIC_BY_ID = new Map(MATH_BASICS.map((basic) => [basic.id, basic]))
const defaultsFor = (visual) =>
  Object.fromEntries((visual?.controls ?? []).map((control) => [control.id, control.initial]))

/** 動かす図の操作。選択肢が多いときは、1行に押しこまず折り返して並べる（文字が縦に割れないように）。 */
function StoryControl({ control, value, color, onChange }) {
  if (control.type !== 'options' || control.options.length <= 4) {
    return <VisualControl control={control} value={value} color={color} onChange={onChange} />
  }
  return (
    <fieldset
      className="rounded-2xl border-2 bg-white p-3 shadow-sm"
      style={{ borderColor: `${color}70` }}
      data-math-story-choice-control={control.id}
    >
      <legend className="px-1 text-sm font-extrabold text-ink">{control.label}</legend>
      <div className="flex flex-wrap gap-2">
        {control.options.map((option) => {
          const selected = String(value) === String(option.value)
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cx(
                'min-h-11 min-w-12 whitespace-nowrap rounded-xl border-2 px-3 py-2 text-sm font-extrabold transition-all focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-[0.98]',
                selected ? 'text-white shadow-md' : 'border-slate-500 bg-white text-ink/80 shadow-sm active:bg-violet-50',
              )}
              style={selected
                ? { backgroundColor: color, borderColor: color, outlineColor: color }
                : { outlineColor: color }}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function SectionHeading({ icon, children, color }) {
  return (
    <h2 className="mb-2 flex items-center gap-1.5 text-[13px] font-extrabold" style={{ color }}>
      {icon}
      {children}
    </h2>
  )
}

export function MathStoryScreen() {
  const params = useStore((state) => state.params)
  const navigate = useStore((state) => state.navigate)
  const back = useStore((state) => state.back)
  const replaceParams = useStore((state) => state.replaceParams)
  const mathStoryLog = useStore((state) => state.mathStoryLog)
  const recordMathStory = useStore((state) => state.recordMathStory)
  const chapter = mathHistoryChapter(params.chapterId)
  const defaults = useMemo(() => defaultsFor(chapter?.visual), [chapter])
  const [session, setSession] = useState(() => ({ chapterId: params.chapterId, values: defaults }))
  const values = session.chapterId === params.chapterId ? session.values : defaults

  if (!chapter) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-bold text-ink/50">話が見つかりませんでした。</p>
        <Button onClick={back}>戻る</Button>
      </div>
    )
  }

  const part = mathHistoryPart(chapter.part)
  const accent = readableMathAccent(mathHistoryThemeColor(chapter.theme))
  const number = chapterNumber(chapter.id)
  const { previous, next } = chapterNeighbors(chapter.id)
  const latest = latestStudyLog(mathStoryLog, chapter.id)
  const units = chapter.units.map(unitById).filter(Boolean)
  const basics = chapter.basics.map((id) => BASIC_BY_ID.get(id)).filter(Boolean)
  const formula = chapter.visual.formula(values)
  const insight = chapter.visual.insight(values)

  const setValue = (id, value) => {
    setSession((current) => ({
      chapterId: chapter.id,
      values: {
        ...(current.chapterId === chapter.id ? current.values : defaults),
        [id]: value,
      },
    }))
  }
  // 前後の話へは同じ画面のまま移る（戻るで目次へ帰れるように、履歴を積まない）。
  const openChapter = (id) => {
    replaceParams({ ...params, chapterId: id })
    scrollScreenToTop()
  }
  const startTest = () => navigate('mathStoryQuiz', {
    chapterIds: [chapter.id],
    title: chapter.title,
    returnTo: { screen: 'mathStory', params: { chapterId: chapter.id } },
  })

  return (
    <div className="pb-6" data-math-story={chapter.id}>
      <ScreenHeader
        title={chapter.title}
        subtitle={`${part?.title ?? '数学の歴史'}・${number}/${MATH_HISTORY_CHAPTERS.length}話`}
        color={accent}
      />

      <div className="space-y-6 px-4 pt-4">
        {/* 年代・場所・人物と、この話の問い */}
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <Chip color={accent}>{chapter.theme}</Chip>
            <span className="text-xs font-extrabold text-ink/55">{chapter.era}</span>
            <span className="text-xs font-bold text-ink/45">{chapter.place}</span>
            {latest && (
              <Chip color={STUDY_LOG_RESULTS[latest.result].color}>
                {`${formatStudyDay(latest.day)} ${STUDY_LOG_RESULTS[latest.result].label}`}
              </Chip>
            )}
          </div>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-ink">
            <span className="mr-1.5" aria-hidden="true">{chapter.emoji}</span>
            {chapter.headline}
          </h1>
          {chapter.people.length > 0 && (
            <p className="mt-1.5 text-xs font-extrabold text-ink/55">{`人物：${chapter.people.join('・')}`}</p>
          )}
          <div className="mt-3 rounded-2xl p-3.5" style={{ background: `${accent}12` }} data-math-story-question>
            <div className="mb-1 text-[11px] font-extrabold" style={{ color: accent }}>困っていたこと</div>
            <p className="text-[15px] font-bold leading-relaxed text-ink/85">
              <MathText>{chapter.question}</MathText>
            </p>
          </div>
        </section>

        {/* 発見・発明の筋道 */}
        <section data-math-story-steps>
          <SectionHeading icon={<Target size={16} />} color={accent}>発見の筋道</SectionHeading>
          <ol className="space-y-3">
            {chapter.story.map((paragraph, index) => (
              <li key={index} className="flex gap-3">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{ background: accent }}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 text-[15px] font-bold leading-relaxed text-ink/85">
                  <MathText>{paragraph}</MathText>
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* 動かしてみよう */}
        <section data-math-story-visual>
          <SectionHeading icon={<Sparkles size={15} />} color={accent}>動かしてみよう</SectionHeading>
          <p className="mb-2 text-sm font-bold leading-relaxed text-ink/75">{chapter.visual.instruction}</p>
          <div
            className="overflow-hidden rounded-[1.75rem] bg-white shadow-card"
            style={{ '--intro-color': accent }}
          >
            <div className="bg-gradient-to-b from-white to-paper px-2 pb-1 pt-3">
              <MathHistoryVisual
                visual={chapter.visual}
                values={values}
                color={accent}
                label={`${chapter.title}の図。${chapter.visual.instruction}`}
              />
            </div>
            <div className="border-t-2 border-violet-100 bg-gradient-to-b from-violet-50/80 to-white px-3 pb-4 pt-3" aria-label="図を動かす操作">
              <div className="space-y-3">
                {chapter.visual.controls.map((control) => (
                  <StoryControl
                    key={control.id}
                    control={control}
                    value={values[control.id]}
                    color={accent}
                    onChange={(value) => setValue(control.id, value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border-2 border-violet-100 bg-white px-4 py-3.5">
            <div className="flex items-center gap-2">
              <Eye size={17} className="shrink-0 text-violet-700" />
              <p className="text-xs font-extrabold tracking-wide text-violet-700">いま図に出ている関係</p>
            </div>
            <MathBlock tex={formula} className="mt-2 overflow-x-auto text-ink [&_.katex]:text-[1.15rem]" />
          </div>
          <div className="mt-3 rounded-2xl bg-hint-soft px-4 py-3.5">
            <div className="flex items-start gap-2">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-extrabold tracking-wide text-amber-700">動かして分かること</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-amber-900">
                  <MathText>{insight}</MathText>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 今の使われ方 */}
        <section data-math-story-uses>
          <SectionHeading icon={<Lightbulb size={16} />} color={accent}>今の使われ方</SectionHeading>
          <ul className="space-y-2">
            {chapter.uses.map((use) => (
              <li key={use.title} className="flex gap-3 rounded-2xl bg-white p-3.5 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-xl" aria-hidden="true">
                  {use.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-ink">{use.title}</span>
                  <span className="mt-0.5 block text-[13px] font-bold leading-relaxed text-ink/70">
                    <MathText>{use.text}</MathText>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* つながる単元・算数の基本 */}
        {(units.length > 0 || basics.length > 0) && (
          <section data-math-story-links>
            <SectionHeading icon={<LinkIcon size={16} />} color={accent}>つながる学習</SectionHeading>
            {basics.length > 0 && (
              <div className="mb-2 rounded-2xl bg-white p-3 shadow-card">
                <p className="text-[11px] font-extrabold text-ink/50">この話で学び直す算数の基本</p>
                <ul className="mt-1 space-y-0.5">
                  {basics.map((basic) => (
                    <li key={basic.id} className="text-[13px] font-bold leading-relaxed text-ink/80">{`・${basic.title}`}</li>
                  ))}
                </ul>
              </div>
            )}
            {units.length > 0 && (
              <div className="space-y-2">
                {units.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => navigate('mathIntro', { unitId: unit.id })}
                    className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card active:bg-violet-50"
                    data-math-story-unit={unit.id}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl" style={{ background: `${unit.color}1a` }}>
                      {unit.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-ink">{unit.title}</span>
                      <span className="block text-[11px] font-bold text-ink/50">{`${unit.grade}・動かして学び、問題を解く`}</span>
                    </span>
                    <ArrowRight size={18} className="shrink-0" style={{ color: accent }} />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 読み終えたら：まだまだ／理解した（押した日と結果が目次に履歴として残る） */}
        <StudySelfCheck
          pageId={chapter.id}
          log={mathStoryLog}
          today={todayIndex()}
          question="この話の考えは理解できましたか。"
          onRecord={(result) => recordMathStory(chapter.id, result)}
        />

        {/* テストへ・前後の話 */}
        <section className="space-y-2.5">
          <Button full size="lg" onClick={startTest} className="h-auto min-h-14 py-2.5" data-math-story-test>
            <Cards size={20} />
            <span className="text-left leading-tight">
              <span className="block">この話のテストにチャレンジ</span>
              <span className="block text-xs font-bold text-white/80">{`${chapter.title}・${chapter.quiz.length}問`}</span>
            </span>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!previous}
              onClick={() => previous && openChapter(previous.id)}
              className="flex min-h-14 items-center gap-1 rounded-2xl bg-white px-2.5 text-left shadow-sm ring-1 ring-slate-200/70 active:bg-brand-50 disabled:opacity-35"
            >
              <ChevronLeft size={18} className="shrink-0 text-brand-400" />
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold text-ink/40">前の話</span>
                <span className="block truncate text-xs font-extrabold text-ink">{previous?.title ?? '―'}</span>
              </span>
            </button>
            <button
              type="button"
              disabled={!next}
              onClick={() => next && openChapter(next.id)}
              className={cx(
                'flex min-h-14 items-center justify-end gap-1 rounded-2xl bg-white px-2.5 text-right shadow-sm ring-1 ring-slate-200/70 active:bg-brand-50 disabled:opacity-35',
              )}
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold text-ink/40">次の話</span>
                <span className="block truncate text-xs font-extrabold text-ink">{next?.title ?? '―'}</span>
              </span>
              <ChevronRight size={18} className="shrink-0 text-brand-400" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
