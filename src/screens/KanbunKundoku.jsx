import { todayIndex, useStore } from '../store/useStore.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  KANBUN_KUNDOKU_LEVELS,
} from '../data/kanbun-kundoku.js'
import { Button, Card } from '../components/ui.jsx'
import { ScreenHeader } from '../components/AppShell.jsx'
import { KanbunMarkedText } from '../components/KanbunMarkedText.js'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import {
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'
import { Book, Cards } from '../components/Icons.jsx'

export function KanbunKundokuScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.kanbunKundokuSrs)
  const totalStatus = summarizeSrsItems(KANBUN_KUNDOKU_EXERCISES, srs)
  const review = contentReviewSummary(KANBUN_KUNDOKU_EXERCISES, srs, todayIndex())

  return (
    <div className="pb-8">
      <ScreenHeader title="返り点・訓読" subtitle="点の名前だけでなく、実際に読む順を指で組み立てる" />

      <main className="space-y-3 px-4">
        {/* 今日の学習とほかの選び方は、英語アプリの単語画面と同じ形で上に置く。 */}
        <TodayCard data-kanbun-kundoku-today>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="題"
            onStart={() => navigate('kanbunKundokuQuiz', {
              ids: reviewTargetItems(review).map((item) => item.id),
              title: review.state === 'due' ? '返り点・今日の復習' : '返り点・復習日より前に練習',
            })}
          />
        </TodayCard>
        <ChooserTiles data-kanbun-kundoku-choosers>
          <WordBookTile domain="kanbunKundoku" returnTo={{ screen: 'kanbunKundoku' }} />
        </ChooserTiles>

        {/* 全範囲：段階別と同じカードで、全題から出す。 */}
        <Card className="p-4" data-kanbun-kundoku-status>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-xl" aria-hidden="true">🔁</span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-base font-extrabold text-ink">返り点・訓読の全範囲</h2>
              <p className="text-[11px] font-bold text-ink/45">
                全{KANBUN_KUNDOKU_EXERCISES.length}題・{KANBUN_KUNDOKU_LEVELS.length}段階
              </p>
            </div>
          </div>
          <LearningStatusBars progress={totalStatus} className="mt-3" compact units={{ learning: '題', quiz: '問' }} />
          <Button full size="sm" className="mt-3" onClick={() => navigate('kanbunKundokuQuiz')}>
            <Cards size={16} /> 10題の読む順を作る
          </Button>
        </Card>

        <section>
          <h2 className="px-1 pt-2 font-display text-base font-extrabold text-ink/80">段階から選ぶ</h2>
          <div className="mt-2 space-y-3">
            {KANBUN_KUNDOKU_LEVELS.map((level) => {
              const items = KANBUN_KUNDOKU_EXERCISES.filter((item) => item.level === level.id)
              const progress = summarizeSrsItems(items, srs)
              return (
                <Card key={level.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${level.color}18`, color: level.color }}>↩</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-extrabold text-ink">{level.label}</h3>
                      <p className="text-[11px] font-bold text-ink/45">全{items.length}題</p>
                    </div>
                  </div>
                  <LearningStatusBars progress={progress} className="mt-3" compact units={{ learning: '題', quiz: '問' }} />
                  <Button
                    full
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate('kanbunKundokuQuiz', { ids: items.map((item) => item.id), title: level.label, size: items.length })}
                  >
                    <Cards size={16} /> この段階を解く
                  </Button>
                </Card>
              )
            })}
          </div>
        </section>

        <Card className="border-rose-100 p-4">
          <div className="flex gap-3">
            <Book size={21} className="mt-0.5 shrink-0 text-rose-700" />
            <div>
              <h2 className="font-display text-base font-extrabold text-ink">返って読む順のきまり</h2>
              <ol className="mt-2 space-y-1.5 text-xs font-bold leading-relaxed text-ink/60">
                <li>1. レ点：すぐ下の一字を先に読む</li>
                <li>2. 一二点：一点を読んで二点へ返る</li>
                <li>3. 上下点：一二点をまたぎ、上から下へ返る</li>
                <li>4. 甲乙点 → 天地人点：さらに外側の階層</li>
                <li>5. 複合するときは、必ず内側の小さい返りから閉じる</li>
              </ol>
            </div>
          </div>
          <KanbunMarkedText marked="使二人読一レ書" className="mt-4 rounded-2xl bg-slate-50 px-3 py-3" />
        </Card>
      </main>
    </div>
  )
}
