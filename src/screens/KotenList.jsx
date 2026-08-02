import { useStore } from '../store/useStore.js'
import { isDue } from '../store/useStore.js'
import { KOTEN_TOC, KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR } from '../data/koten-grammar.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../data/koten-grammar-questions.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_QUESTIONS } from '../data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../data/koten-interpretations.js'
import { Card, ProgressRing, Button, Chip } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  Book,
  BookmarkFilled,
  BookOpen,
  Cards,
  Refresh,
  ArrowRight,
  ChevronLeft,
  Headphones,
} from '../components/Icons.jsx'

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
  const interpretationSrs = useStore((s) => s.kotenInterpretationSrs)
  const savedWords = useStore((s) => s.kotenWordList)
  const savedGrammar = useStore((s) => s.kotenGrammarList)
  const savedCulture = useStore((s) => s.kotenCultureList)

  const dueWords = KOTEN_WORDS.filter((w) => kotenSrs[w.id] && isDue(kotenSrs[w.id]))
  const total = kotenProgress(KOTEN_WORDS, kotenSrs)
  const triedInterpretations = KOTEN_INTERPRETATIONS.filter(
    (item) => (interpretationSrs[item.id]?.box ?? 0) > 0,
  ).length

  const study = (ids, title) => navigate('kotenStudy', { ids, title })
  const quiz = (ids, title) => navigate('kotenQuiz', { ids, title })

  return (
    <div className="pb-6">
      {/* ヒーロー */}
      <div className="rounded-b-[2.5rem] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => navigate('portal')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95 transition-transform"
          >
            <ChevronLeft size={14} /> スタディアプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/75">大学受験・古文読解</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典アプリ</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          単語・文法・常識をつないで、一文を読み切ろう
        </p>
      </div>

      <div className="space-y-3 px-4 pt-5">
        <button
          onClick={() => navigate('literatureLibrary', { kind: 'classical' })}
          className="flex w-full items-center gap-3 rounded-3xl bg-gradient-to-r from-teal-900 to-emerald-800 p-4 text-left text-white shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12">
            <Headphones size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold">日本古典の名作に親しむ</div>
            <div className="mt-0.5 text-xs font-bold text-white/65">
              古文 → 現代語訳を一息ずつ
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-emerald-200" />
        </button>

        <button
          onClick={() => navigate('literatureLibrary', { kind: 'kanbun' })}
          className="flex w-full items-center gap-3 rounded-3xl bg-gradient-to-r from-rose-950 to-red-800 p-4 text-left text-white shadow-card transition-transform active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12">
            <Headphones size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold">漢文の名作に親しむ</div>
            <div className="mt-0.5 text-xs font-bold text-white/65">
              白文を見て、書き下し → 現代語訳を一息ずつ
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-rose-200" />
        </button>

        <button
          onClick={() => navigate('kotenInterpretationList')}
          className="group w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950 to-orange-900 p-5 text-left text-white shadow-card transition-transform active:scale-[0.99]"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-2xl">
              📜
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-extrabold">短文解釈</h2>
                <Chip className="bg-white/15 text-white">{KOTEN_INTERPRETATIONS.length}問</Chip>
              </div>
              <p className="mt-1 text-xs font-bold leading-relaxed text-white/70">
                答え合わせで、古典単語・古典文法・古典常識を一度につなぐ
              </p>
              <p className="mt-2 text-[11px] font-extrabold text-amber-200">
                挑戦 {triedInterpretations} / {KOTEN_INTERPRETATIONS.length}問
              </p>
            </div>
            <ArrowRight size={22} className="mt-3 shrink-0 text-amber-300 transition-transform group-active:translate-x-1" />
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('kotenGrammar')}
            className="rounded-2xl bg-purple-100 p-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-200 text-purple-700">
              <BookOpen size={20} />
            </span>
            <div className="mt-2 font-display text-sm font-extrabold text-purple-950">古典文法</div>
            <div className="mt-0.5 text-[11px] font-bold text-purple-800/65">
              {KOTEN_GRAMMAR.length}項目・{KOTEN_GRAMMAR_QUESTIONS.length}問
            </div>
            <div className="mt-1 text-[10px] font-extrabold text-purple-700">覚える → 腕試し</div>
          </button>
          <button
            onClick={() => navigate('kotenCulture')}
            className="rounded-2xl bg-fuchsia-100 p-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-200 text-xl">
              🏯
            </span>
            <div className="mt-2 font-display text-sm font-extrabold text-fuchsia-950">古典常識</div>
            <div className="mt-0.5 text-[11px] font-bold text-fuchsia-800/65">
              {KOTEN_CULTURE.length}テーマ・{KOTEN_CULTURE_QUESTIONS.length}問
            </div>
            <div className="mt-1 text-[10px] font-extrabold text-fuchsia-700">覚える → 腕試し</div>
          </button>
          <button
            onClick={() => navigate('kotenSaved')}
            className="col-span-2 flex items-center gap-3 rounded-2xl bg-sky-100 p-3.5 text-left transition-transform active:scale-[0.98]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-200 text-sky-700">
              <BookmarkFilled size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-sm font-extrabold text-sky-950">登録リスト</div>
              <div className="mt-0.5 text-[11px] font-bold text-sky-800/65">
                単語{savedWords.length}・文法{savedGrammar.length}・常識{savedCulture.length}
              </div>
            </div>
            <ArrowRight size={18} className="text-sky-600" />
          </button>
        </div>

        <div className="flex items-end justify-between px-1 pt-2">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">古典単語</h2>
            <p className="text-xs font-bold text-ink/45">
              全{KOTEN_WORDS.length}語・習得 {total.mastered}・学習中 {total.learning}語
            </p>
          </div>
        </div>

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
