import { todayIndex, useStore } from '../store/useStore.js'
import {
  LISTENING_PROFILES,
  LISTENING_TYPE_META,
  LISTENING_ITEMS,
  listeningByLevel,
} from '../data/listening.js'
import { READING_LEVELS } from '../data/levels.js'
import { LevelPicker } from '../components/LevelPicker.jsx'
import {
  ChooserTiles,
  ReviewTodayRow,
  TodayCard,
  WordBookTile,
} from '../components/ContentTop.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { contentReviewSummary, reviewTargetItems } from '../lib/contentReview.js'

const profileDetail = (levelId) => {
  const profile = LISTENING_PROFILES[levelId]
  if (!profile) return ''
  const formats = Object.keys(profile.typeTargets)
    .map((type) => LISTENING_TYPE_META[type]?.label)
    .filter(Boolean)
    .join('・')
  const playCounts = new Set(Object.values(profile.plays))
  const plays =
    playCounts.size === 1
      ? `放送${[...playCounts][0]}回`
      : '形式により放送1〜2回'
  return `${formats}｜${plays}｜${profile.target}`
}

export function ListeningScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const review = contentReviewSummary(LISTENING_ITEMS, srs, todayIndex())
  const returnTo = { screen: 'listening' }

  return (
    <LevelPicker
      title="リスニング"
      subtitle="英検形式で、聞いて考える"
      accent="#0ea5e9"
      levels={READING_LEVELS}
      today={(
        <TodayCard data-listening-today>
          <ReviewTodayRow
            state={review.state}
            due={review.dueItems.length}
            nextInDays={review.nextInDays}
            unit="問"
            onStart={() => navigate('listeningQuiz', {
              source: { type: 'listeningList', ids: reviewTargetItems(review).map((item) => item.id) },
              title: review.state === 'due' ? 'リスニング・今日の復習' : 'リスニング・復習日より前に練習',
              engine: 'listening',
              returnTo,
            })}
          />
        </TodayCard>
      )}
      choosers={(
        <ChooserTiles data-listening-choosers>
          <WordBookTile domain="listening" returnTo={returnTo} />
        </ChooserTiles>
      )}
      note="英検の級別形式と放送回数を参考にしたオリジナル問題です。解答前は本番と同じ回数、解答後は何度でも聞けます。音声は端末の音声合成です。"
      countFor={(levelId) => listeningByLevel(levelId).length}
      countUnit="問"
      detailFor={profileDetail}
      statusFor={(levelId) => summarizeSrsItems(
        LISTENING_ITEMS.filter((item) => item.level === levelId),
        srs,
      )}
      onPick={(levelId, label) =>
        navigate('listeningQuiz', {
          source: { type: 'level', levelId },
          title: `英検${label}`,
          engine: 'listening',
          returnTo: { screen: 'listening' },
        })
      }
    />
  )
}
