import { todayIndex, useStore } from '../store/useStore.js'
import { DICTATION_ITEMS, DICTATION_PROFILES, dictationByLevel } from '../data/dictation.js'
import { LevelPicker } from '../components/LevelPicker.jsx'
import {
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'

export function DictationScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const review = contentReviewSummary(DICTATION_ITEMS, srs, todayIndex())
  const returnTo = { screen: 'dictation' }
  return (
    <LevelPicker
      title="ディクテーション"
      subtitle="音声を聞いて、英文を全文入力"
      accent="#14b8a6"
      today={(
        <TodayCard data-dictation-today>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="問"
            onStart={() => navigate('dictationPlay', {
              source: { type: 'dictationList', ids: reviewTargetItems(review).map((item) => item.id) },
              title: review.state === 'due' ? 'ディクテーション・今日の復習' : 'ディクテーション・復習日より前に練習',
              returnTo,
            })}
          />
        </TodayCard>
      )}
      choosers={(
        <ChooserTiles data-dictation-choosers>
          <WordBookTile domain="dictation" returnTo={returnTo} />
        </ChooserTiles>
      )}
      note="英検本試験に書き取り問題はありません。級別リスニングを使った練習で、大文字・句読点は採点せず、綴りと語順を採点します。"
      countFor={(levelId) => dictationByLevel(levelId).length}
      countUnit="問"
      detailFor={(levelId) => DICTATION_PROFILES[levelId]?.target}
      statusFor={(levelId) => summarizeSrsItems(
        DICTATION_ITEMS.filter((item) => item.level === levelId),
        srs,
      )}
      onPick={(levelId, label) => navigate('dictationPlay', { source: { type: 'level', levelId }, title: `英検${label}`, returnTo: { screen: 'dictation' } })}
    />
  )
}
