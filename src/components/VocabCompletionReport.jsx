import { Button, Card, ProgressBar } from './ui.jsx'
import {
  ArrowRight,
  Bookmark,
  Refresh,
} from './Icons.jsx'

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

export function VocabCompletionReport({
  report,
  title,
  streak,
  onReviewNow,
  onContinue,
  onBack,
  onWord,
  onReviewSchedule = () => {},
  continueLabel = '次へ進む',
}) {
  const { session, today, priorityItems, schedule } = report

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label="英単語の学習結果"
      data-vocab-completion-report
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6">
        <div className="mx-auto w-full max-w-xl space-y-3">
          <header
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-brand-600 to-sky-500 p-4 text-left text-white shadow-lg"
            data-vocab-completion-today
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white/75">今日の成果</p>
                <h1 className="mt-1 font-display text-2xl font-extrabold">今日、{today.uniqueWords}語に取り組みました</h1>
                <p className="mt-1 text-xs font-bold text-white/75">今回：{title}（{session.total}語）</p>
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
                      : `あと${Math.max(0, today.goal - today.uniqueWords)}語です。`}
                  </p>
                </div>
                <p className="shrink-0 font-display text-2xl font-extrabold tabular-nums text-indigo-700">
                  {today.uniqueWords}<span className="text-sm text-ink/45">/{today.goal}語</span>
                </p>
              </div>
              <ProgressBar value={today.goalRate} className="mt-2.5" />
            </div>

            <div className="mt-3 rounded-2xl bg-indigo-950/20 p-3 ring-1 ring-white/15">
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <p className="text-xs font-extrabold text-white">今日の各単語の答え</p>
                <p className="text-[10px] font-bold text-white/70">今日初めて学んだ語：{today.newWords}語</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ResultStat value={`${today.rememberedLatest}語`} label="「覚えた」と答えた" tone="text-emerald-700" />
                <ResultStat value={`${today.needsReviewLatest}語`} label="「まだ」と答えた" tone="text-rose-600" />
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-white/70">
                同じ語に何度か答えた場合は、今日最後の答えで分けています。
              </p>
            </div>

            <p className="mt-3 text-xs font-bold leading-relaxed text-white/85">
              今回は{session.remembered}語を「覚えた」、{session.forgot}語を「まだ」と答えました。
            </p>
            <p className="mt-1 text-[10px] font-bold leading-relaxed text-white/70">
              復習間隔が延びた語：{session.advancedCount}語・長期定着へ進んだ語：{session.newlyMasteredCount}語
            </p>
          </header>

          <Card className="p-4 text-left" data-vocab-next-cycle>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-indigo-600">次にすること</p>
                <h2 className="mt-1 font-display text-lg font-extrabold text-ink">
                  {session.reviewNowCount > 0
                    ? `まず「まだ」の${session.reviewNowCount}語を復習`
                    : '次の学習へ進めます'}
                </h2>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-700">
                <Refresh size={20} />
              </span>
            </div>
            <p className="mt-2 text-xs font-bold leading-relaxed text-ink/55">
              {session.reviewNowCount > 0
                ? '答えを見る前に、もう一度意味を思い出しましょう。'
                : '今すぐやり直す語はありません。予定日になったら復習しましょう。'}
            </p>

            <div className="mt-4 border-t border-slate-200 pt-3">
              <h3 className="text-xs font-extrabold text-ink">このあとの復習予定</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {schedule.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!item.count}
                    onClick={() => onReviewSchedule(item)}
                    className="min-h-14 rounded-xl bg-indigo-50 px-2 py-2 text-center ring-1 ring-indigo-100 active:bg-indigo-100 disabled:cursor-default disabled:opacity-45"
                    aria-label={`復習日が${item.label}の${item.count}語を今復習する`}
                    data-vocab-review-schedule={item.id}
                  >
                    <span className="block text-[10px] font-bold text-ink/50">{item.label}</span>
                    <b className="mt-0.5 block text-base font-extrabold tabular-nums text-indigo-700">{item.count}語</b>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] font-bold leading-relaxed text-ink/50">
                日付を押すと、その語を今すぐ復習できます。予定日は、これまでの答えに合わせて変わります。
              </p>
              <p className="mt-1 text-[10px] font-bold leading-relaxed text-indigo-700/70" data-maintenance-review-policy>
                長期定着後は30→60→90→180日と間隔を広げ、以後は180日ごとに維持確認します。
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden text-left" data-vocab-completion-priority>
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                  <Bookmark size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-amber-700">語ごとの結果</p>
                  <h2 className="mt-1 font-display text-lg font-extrabold text-ink">今回学んだ語</h2>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-ink/50">
                    {session.reviewNowCount > 0
                      ? `「まだ」と答えた${session.reviewNowCount}語から表示します。`
                      : '今回の答えと、次に復習する日を確認できます。'}
                  </p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {priorityItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onWord(item.id)}
                  className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left active:bg-slate-50"
                  aria-label={`${item.word}の詳細を見る`}
                  data-vocab-priority-word={item.id}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <b className="font-display text-base font-extrabold text-ink">{item.word}</b>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${item.needsReviewNow ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                        {item.reason}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs font-bold text-ink/50">{item.meaning}</p>
                    <p className="mt-1 text-[10px] font-extrabold text-indigo-600">
                      次の復習：{dueLabel(item.dueInDays)}
                    </p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-ink/25" />
                </button>
              ))}
            </div>
            {report.hiddenPriorityCount > 0 && (
              <p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-[10px] font-bold text-ink/45">
                このほか{report.hiddenPriorityCount}語も記録しています
              </p>
            )}
          </Card>
        </div>
      </div>

      <div
        className="shrink-0 border-t border-indigo-100 bg-white/95 px-3 pb-4 pt-3 shadow-[0_-10px_30px_-18px_rgba(30,27,75,0.55)] backdrop-blur"
        aria-label="学習結果の操作"
        data-vocab-completion-actions
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
              ? `${session.reviewNowCount}語を復習する`
              : '今すぐ復習する語はありません'}
            data-vocab-fixed-review
          >
            <span className="shrink-0 whitespace-nowrap">復習する</span>
            {session.reviewNowCount > 0 && (
              <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{session.reviewNowCount}語</span>
            )}
          </Button>
          <Button
            full
            variant={session.reviewNowCount > 0 ? 'secondary' : 'primary'}
            className="whitespace-nowrap text-sm"
            style={{ paddingInline: '0.5rem' }}
            onClick={onContinue}
            data-vocab-fixed-continue
          >
            {continueLabel} <ArrowRight size={17} />
          </Button>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-1 flex min-h-9 w-full items-center justify-center text-xs font-extrabold text-indigo-700 active:text-indigo-900"
        >
          単語一覧へ戻る
        </button>
      </div>
    </section>
  )
}
