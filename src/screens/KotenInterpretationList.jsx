import { useStore } from '../store/useStore.js'
import { isDue } from '../store/useStore.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
  kotenInterpretationsByLevel,
  pickKotenInterpretationIds,
} from '../data/koten-interpretations.js'
import { Button, Card, Chip } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { ArrowRight, Cards, ChevronLeft, Refresh } from '../components/Icons.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'

export function KotenInterpretationListScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.kotenInterpretationSrs)
  const overallStatus = summarizeSrsItems(KOTEN_INTERPRETATIONS, srs)
  const due = KOTEN_INTERPRETATIONS.filter((item) => srs[item.id] && isDue(srs[item.id]))

  const start = (items, title) =>
    navigate('kotenInterpretationPrep', {
      ids: pickKotenInterpretationIds(items.map((item) => item.id)),
      title,
    })

  return (
    <div className="pb-7">
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('kotenList')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 transition-transform active:scale-95"
          >
            <ChevronLeft size={14} /> 古典アプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/75">単語 × 文法 × 古典常識</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">短文解釈</h1>
        <p className="mt-1 max-w-sm text-sm font-bold leading-relaxed text-white/85">
          一文ずつ訳し、答えの根拠を3つの視点でつなげます。
        </p>
        <div className="mt-4 rounded-2xl bg-white/15 p-3 backdrop-blur">
          <div>
            <div className="font-display font-extrabold">全{overallStatus.total}問</div>
            <div className="text-xs font-bold text-white/75">
              学習済 {overallStatus.learning.learned}・復習中 {overallStatus.learning.reviewing}・未学習 {overallStatus.learning.unlearned}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-5">
        <Card className="p-4" data-koten-interpretation-status>
          <LearningStatusBars progress={overallStatus} compact />
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={!due.length}
            onClick={() => start(due, '短文解釈の復習')}
            className="flex items-center gap-2 rounded-2xl bg-amber-100 p-3 text-left transition-transform active:scale-[0.98] disabled:opacity-45"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 text-amber-700">
              <Refresh size={20} />
            </span>
            <div>
              <div className="text-sm font-extrabold text-amber-900">復習</div>
              <div className="text-[11px] font-bold text-amber-800/70">{due.length}問</div>
            </div>
          </button>
          <button
            onClick={() => start(KOTEN_INTERPRETATIONS, '短文解釈 腕だめし')}
            className="flex items-center gap-2 rounded-2xl bg-orange-100 p-3 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-200 text-orange-700">
              <Cards size={20} />
            </span>
            <div>
              <div className="text-sm font-extrabold text-orange-900">腕だめし</div>
              <div className="text-[11px] font-bold text-orange-800/70">事前確認して12問</div>
            </div>
          </button>
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
            問題で出会った古典単語と古典文法は、その場で登録リストへ保存できます。
          </p>
        </Card>

        <div>
          <h2 className="mb-2 px-1 font-display text-base font-extrabold text-ink/80">
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
                  <LearningStatusBars progress={status} className="mt-3" compact />
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
      </div>
    </div>
  )
}
