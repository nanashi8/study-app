import { todayIndex, useStore } from '../store/useStore.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
  kotenInterpretationsByLevel,
  pickKotenInterpretationIds,
} from '../data/koten-interpretations.js'
import { Button, Card, Chip } from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import {
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'

export function KotenInterpretationListScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.kotenInterpretationSrs)
  const overallStatus = summarizeSrsItems(KOTEN_INTERPRETATIONS, srs)
  // 今日の学習：短文解釈の復習。今日の分がなければ、解いた問題を復習日が近い順に。
  const review = contentReviewSummary(KOTEN_INTERPRETATIONS, srs, todayIndex())

  const start = (items, title) =>
    navigate('kotenInterpretationPrep', {
      ids: pickKotenInterpretationIds(items.map((item) => item.id)),
      title,
    })

  return (
    <div className="pb-7">
      <ScreenHeader title="短文解釈" subtitle="一文ずつ訳し、答えの根拠を3つの視点でつなげる" />

      <div className="space-y-3 px-4">
        <TodayCard data-koten-interpretation-today>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="問"
            onStart={() => start(
              reviewTargetItems(review),
              review.state === 'due' ? '短文解釈の復習' : '短文解釈・復習日より前に練習',
            )}
          />
        </TodayCard>
        <ChooserTiles data-koten-interpretation-choosers>
          <WordBookTile domain="kotenInterpretation" returnTo={{ screen: 'kotenInterpretationList' }} />
        </ChooserTiles>

        {/* 全範囲：難易度別と同じカードで、全問から事前確認つきで出す。 */}
        <Card className="p-4" data-koten-interpretation-status>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-2xl" aria-hidden="true">📜</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-extrabold text-ink">短文解釈の全範囲</h2>
                <Chip color="#ea580c">{overallStatus.total}問</Chip>
              </div>
              <p className="mt-0.5 text-xs font-bold text-ink/50">単語 × 文法 × 古典常識</p>
            </div>
          </div>
          <LearningStatusBars progress={overallStatus} className="mt-3" compact units={{ learning: '問', quiz: '問' }} />
          <Button full size="sm" className="mt-3" onClick={() => start(KOTEN_INTERPRETATIONS, '短文解釈のテスト')}>
            事前確認して12問 <ArrowRight size={16} />
          </Button>
        </Card>

        <div>
          <h2 className="mb-2 px-1 pt-2 font-display text-base font-extrabold text-ink/80">
            難易度から選ぶ
          </h2>
          <div className="space-y-3">
            {KOTEN_INTERPRETATION_LEVELS.map((level) => {
              const items = kotenInterpretationsByLevel(level.id)
              const status = summarizeSrsItems(items, srs)
              return (
                <Card key={level.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                      style={{ backgroundColor: `${level.color}18` }}
                    >
                      {level.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-extrabold text-ink">{level.label}</h3>
                        <Chip color={level.color}>{items.length}問</Chip>
                      </div>
                      <p className="mt-0.5 text-xs font-bold text-ink/50">{level.subtitle}</p>
                    </div>
                  </div>
                  <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '問', quiz: '問' }} />
                  <Button
                    full
                    size="sm"
                    className="mt-3"
                    onClick={() => start(items, `${level.label}の短文解釈`)}
                  >
                    事前確認へ <ArrowRight size={16} />
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="p-4">
          <p className="font-display text-sm font-extrabold text-ink">答え合わせは3つの視点</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Object.entries(KOTEN_INTERPRETATION_FOCUS).map(([id, meta]) => (
              <div key={id} className="rounded-2xl bg-paper p-2.5 text-center">
                <div className="text-xl">{meta.emoji}</div>
                <div className="mt-1 text-[11px] font-extrabold text-ink/70">
                  {meta.label.replace('中心', '')}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-bold leading-relaxed text-ink/50">
            問題で出会った古典単語と古典文法は、その場で単語帳へ入れられます。
          </p>
        </Card>
      </div>
    </div>
  )
}
