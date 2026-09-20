import { useState } from 'react'
import { Button, Card, ProgressBar } from './ui.jsx'
import { StudyAnswerListButton } from './CardStudyControls.jsx'
import { NormalLearningRecordList } from './NormalLearningRecordList.jsx'
import {
  ArrowRight,
  Bookmark,
  Refresh,
} from './Icons.jsx'

// 暗記を終えたときの共通の結果画面。英単語・熟語・語源・古典・漢文のどの教材でも、
// 同じ順番で「今日の成果 → 次にすること → このあとの復習予定 → 今回学んだ項目」を見せる。
// 教材ごとに変わるのは、数え方の単位・教材名・行き先の文言だけ。

const dueLabel = (days) => {
  if (days <= 0) return '今日'
  if (days === 1) return '明日'
  return `${days}日後`
}

function ResultStat({ value, label, tone = 'text-ink' }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3 text-center shadow-sm">
      <b className={`block font-display text-2xl font-extrabold tabular-nums ${tone}`}>{value}</b>
      <span className="mt-0.5 block text-xs font-extrabold text-ink/55">{label}</span>
    </div>
  )
}

export function StudyCompletionReport({
  report,
  // 学習記録の一覧と同じ教材ID（vocab / usage / etymology / koten-vocab / kanbun-vocab …）。
  contentId = 'vocab',
  contentLabel = '英単語',
  unit = '語',
  title,
  streak,
  onReviewNow,
  onContinue,
  onBack,
  // 項目の詳しい説明を開ける教材だけ渡す（英単語の辞書ページなど）。
  onOpenItem = null,
  openLabel = '説明を見る',
  openHint = '説明',
  onReviewSchedule = () => {},
  continueLabel = '次へ進む',
  backLabel = '一覧へ戻る',
  titleLanguage = 'ja',
  // 今回「まだ」「覚えた」と答えた項目（studyAnswerGroups）。「一覧で確認」で分けて並べる。
  answerGroups = null,
  renderAnswerTitle,
  renderAnswerMeaning,
}) {
  const { session, today, priorityItems, schedule } = report
  // 一覧で答えを直すたびに記録は変わるが、並びは開いたときのまま保つ。
  // 直した項目が目の前で飛ばないようにするため。
  const [orderedIds] = useState(() => priorityItems.map((item) => item.id))
  const itemById = new Map(priorityItems.map((item) => [item.id, item]))
  const resultNote = (id) => {
    const item = itemById.get(id)
    return item ? `${item.reason}・次の復習：${dueLabel(item.dueInDays)}` : ''
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label={`${contentLabel}の学習結果`}
      data-study-completion-report={contentId}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <div className="mx-auto w-full max-w-xl space-y-3">
          <header
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-brand-600 to-sky-500 p-4 text-left text-white shadow-lg"
            data-study-completion-today
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white/75">今日の成果</p>
                <h1 className="mt-1 font-display text-2xl font-extrabold">今日、{today.uniqueItems}{unit}に取り組みました</h1>
                <p className="mt-1 text-xs font-bold text-white/75">今回：{title}（{session.total}{unit}）</p>
              </div>
              <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-extrabold">連続 {streak}日</span>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-3 text-ink shadow-sm">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold text-indigo-700">今日の目標</p>
                  <p className="mt-0.5 text-xs font-bold text-ink/55">
                    {today.goalReached
                      ? '目標を達成しました。'
                      : `あと${Math.max(0, today.goal - today.uniqueItems)}${unit}です。`}
                  </p>
                </div>
                <p className="shrink-0 font-display text-2xl font-extrabold tabular-nums text-indigo-700">
                  {today.uniqueItems}<span className="text-sm text-ink/45">/{today.goal}{unit}</span>
                </p>
              </div>
              <ProgressBar value={today.goalRate} className="mt-2.5" />
            </div>

            <div className="mt-3 rounded-2xl bg-indigo-950/20 p-3 ring-1 ring-white/15">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <p className="text-xs font-extrabold text-white">今日の答え</p>
                <p className="text-[10px] font-bold text-white/70">今日初めて学んだ{unit}：{today.newItems}{unit}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ResultStat value={`${today.rememberedLatest}${unit}`} label="「覚えた」と答えた" tone="text-emerald-700" />
                <ResultStat value={`${today.needsReviewLatest}${unit}`} label="「まだ」と答えた" tone="text-rose-600" />
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/70">
                {`同じ${unit}に何度か答えた場合は、今日最後の答えで分けています。`}
              </p>
            </div>

            <p className="mt-3 text-xs font-bold leading-relaxed text-white/85">
              今回は{session.remembered}{unit}を「覚えた」、{session.forgot}{unit}を「まだ」と答えました。
            </p>
            {answerGroups && (
              <StudyAnswerListButton
                groups={answerGroups}
                unit={unit}
                titleLang={titleLanguage === 'en' ? 'en' : undefined}
                renderTitle={renderAnswerTitle}
                renderMeaning={renderAnswerMeaning}
                variant="secondary"
                className="mt-2 text-sm"
              />
            )}
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/70">
              復習間隔が延びた{unit}：{session.advancedCount}{unit}・長期定着へ進んだ{unit}：{session.newlyMasteredCount}{unit}
            </p>
          </header>

          <Card className="p-4 text-left" data-study-completion-next>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-indigo-600">次にすること</p>
                <h2 className="mt-1 font-display text-lg font-extrabold text-ink">
                  {session.reviewNowCount > 0
                    ? `まず「まだ」の${session.reviewNowCount}${unit}を復習`
                    : '次の学習へ進めます'}
                </h2>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                <Refresh size={20} />
              </span>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
              {session.reviewNowCount > 0
                ? '答えを見る前に、もう一度思い出しましょう。'
                : `今すぐやり直す${unit}はありません。予定日になったら復習しましょう。`}
            </p>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-extrabold text-ink">このあとの復習予定</h3>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {schedule.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!item.count}
                    onClick={() => onReviewSchedule(item)}
                    className="min-h-14 rounded-xl bg-indigo-50 px-2 py-2 text-center ring-1 ring-indigo-100 active:bg-indigo-100 disabled:cursor-default disabled:opacity-45"
                    aria-label={`復習日が${item.label}の${item.count}${unit}を今復習する`}
                    data-study-review-schedule={item.id}
                  >
                    <span className="block text-[10px] font-bold text-ink/50">{item.label}</span>
                    <b className="mt-0.5 block text-base font-extrabold tabular-nums text-indigo-700">{item.count}{unit}</b>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/50">
                日付を押すと、その{unit}を今すぐ復習できます。予定日は、これまでの答えに合わせて変わります。
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden text-left" data-study-completion-priority>
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                  <Bookmark size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-amber-700">{unit}ごとの結果</p>
                  <h2 className="mt-1 font-display text-lg font-extrabold text-ink">今回学んだ{unit}</h2>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                    {session.reviewNowCount > 0
                      ? `「まだ」と答えた${session.reviewNowCount}${unit}から表示します。`
                      : '今回の答えと、次に復習する日を確認できます。'}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                    {`答えが違っていた${unit}は、左へスワイプで「覚えた」、右へスワイプで「まだ」に直せます。`}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <NormalLearningRecordList
                entryId={`${contentId}-completion`}
                contentId={contentId}
                items={orderedIds}
                unit={unit}
                titleLanguage={titleLanguage}
                onOpen={typeof onOpenItem === 'function' ? (item) => onOpenItem(item.id) : undefined}
                openLabel={openLabel}
                openHint={openHint}
                noteFor={(item) => resultNote(item.id)}
                emptyMessage={`今回学んだ${unit}はありません。`}
              />
            </div>
          </Card>
        </div>
      </div>

      <div
        className="shrink-0 border-t border-indigo-100 bg-white/95 px-3 pb-4 pt-3 shadow-[0_-10px_30px_-18px_rgba(30,27,75,0.55)] backdrop-blur"
        aria-label="学習結果の操作"
        data-study-completion-actions
      >
        <div className="grid grid-cols-2 gap-2">
          <Button
            full
            variant={session.reviewNowCount > 0 ? 'primary' : 'secondary'}
            className="text-sm"
            style={{ paddingInline: '0.5rem' }}
            disabled={session.reviewNowCount === 0}
            onClick={onReviewNow}
            aria-label={session.reviewNowCount > 0
              ? `${session.reviewNowCount}${unit}を復習する`
              : `今すぐ復習する${unit}はありません`}
            data-study-fixed-review
          >
            <span className="shrink-0 whitespace-nowrap">復習する</span>
            {session.reviewNowCount > 0 && (
              <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{session.reviewNowCount}{unit}</span>
            )}
          </Button>
          <Button
            full
            variant={session.reviewNowCount > 0 ? 'secondary' : 'primary'}
            className="whitespace-nowrap text-sm"
            style={{ paddingInline: '0.5rem' }}
            onClick={onContinue}
            data-study-fixed-continue
          >
            {continueLabel} <ArrowRight size={17} />
          </Button>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-1 flex min-h-9 w-full items-center justify-center text-xs font-extrabold text-indigo-700 active:text-indigo-900"
        >
          {backLabel}
        </button>
      </div>
    </section>
  )
}
