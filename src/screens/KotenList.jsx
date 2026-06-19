import { useStore } from '../store/useStore.js'
import { isDue } from '../store/useStore.js'
import { KOTEN_TOC, KOTEN_WORDS } from '../data/koten.js'
import { Card, ProgressRing, Button, Chip } from '../components/ui.jsx'
import { Book, Cards, Refresh, ArrowRight, ChevronLeft } from '../components/Icons.jsx'

// box>=4 を「習得」、box1〜3 を「学習中」とみなす（英単語と同基準）。
// 進み具合のリングは box 加重（1問正解=box+1 ごとに動く）。MAX=4 で満点。
const MASTER_BOX = 4
function kotenProgress(words, srs) {
  let mastered = 0, learning = 0, pts = 0
  for (const w of words) {
    const box = srs[w.id]?.box ?? 0
    if (box >= MASTER_BOX) mastered++
    else if (box >= 1) learning++
    pts += Math.min(box, MASTER_BOX)
  }
  const total = words.length
  return { mastered, learning, total, ratio: total ? pts / (total * MASTER_BOX) : 0 }
}

function CategoryCard({ cat, words, srs, onStudy, onQuiz }) {
  const { mastered, learning, ratio } = kotenProgress(words, srs)
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${cat.color}22` }}
        >
          {cat.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-extrabold text-ink">{cat.label}</h3>
          <p className="text-xs font-bold text-ink/50">
            習得 {mastered}・学習中 {learning} / {words.length}語
          </p>
        </div>
        <ProgressRing value={ratio} size={48} stroke={6} color={cat.color}>
          <span className="text-[11px] font-extrabold text-ink/70">{Math.round(ratio * 100)}%</span>
        </ProgressRing>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="primary" size="sm" onClick={onStudy}>
          <Book size={16} /> 覚える
        </Button>
        <Button variant="secondary" size="sm" onClick={onQuiz}>
          <Cards size={16} /> クイズ
        </Button>
      </div>
    </Card>
  )
}

export function KotenListScreen() {
  const navigate = useStore((s) => s.navigate)
  const kotenSrs = useStore((s) => s.kotenSrs)

  const dueWords = KOTEN_WORDS.filter((w) => kotenSrs[w.id] && isDue(kotenSrs[w.id]))
  const total = kotenProgress(KOTEN_WORDS, kotenSrs)

  const study = (ids, title) => navigate('kotenStudy', { ids, title })
  const quiz = (ids, title) => navigate('kotenQuiz', { ids, title })

  return (
    <div className="pb-6">
      {/* ヒーロー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <button
          onClick={() => navigate('portal')}
          className="mb-3 flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
        >
          <ChevronLeft size={14} /> スタディアプリ
        </button>
        <p className="text-xs font-bold text-white/75">大学受験・頻出古文単語</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典アプリ</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          全{KOTEN_WORDS.length}語 ・ 習得 {total.mastered}・学習中 {total.learning}語
        </p>
      </div>

      <div className="space-y-3 px-4 pt-5">
        {/* 復習・全部のショートカット */}
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={!dueWords.length}
            onClick={() => study(dueWords.map((w) => w.id), '復習')}
            className="flex items-center gap-2 rounded-2xl bg-hint-soft p-3 text-left active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-hint/20 text-hint">
              <Refresh size={20} />
            </span>
            <div>
              <div className="text-sm font-extrabold text-amber-900">復習</div>
              <div className="text-[11px] font-bold text-amber-800/70">{dueWords.length}語</div>
            </div>
          </button>
          <button
            onClick={() => quiz(KOTEN_WORDS.map((w) => w.id), '腕だめし')}
            className="flex items-center gap-2 rounded-2xl bg-orange-100 p-3 text-left active:scale-[0.98] transition-transform"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-200 text-orange-600">
              <Cards size={20} />
            </span>
            <div>
              <div className="text-sm font-extrabold text-orange-800">腕だめし</div>
              <div className="text-[11px] font-bold text-orange-700/70">全{KOTEN_WORDS.length}語から</div>
            </div>
          </button>
        </div>

        {KOTEN_TOC.map(({ category, words }) => (
          <CategoryCard
            key={category.id}
            cat={category}
            words={words}
            srs={kotenSrs}
            onStudy={() => study(words.map((w) => w.id), category.label)}
            onQuiz={() => quiz(words.map((w) => w.id), category.label)}
          />
        ))}
      </div>
    </div>
  )
}
