import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import { isDue } from '../store/useStore.js'
import { KOTEN_TOC, KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR } from '../data/koten-grammar.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../data/koten-grammar-questions.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_QUESTIONS } from '../data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../data/koten-interpretations.js'
import {
  KOTEN_CURRICULUM_BY_ID,
  KOTEN_CURRICULUM_LEVELS,
} from '../data/koten-curriculum.js'
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
  const [curriculumLevel, setCurriculumLevel] = useState('middle')

  const dueWords = KOTEN_WORDS.filter((w) => kotenSrs[w.id] && isDue(kotenSrs[w.id]))
  const total = kotenProgress(KOTEN_WORDS, kotenSrs)
  const triedInterpretations = KOTEN_INTERPRETATIONS.filter(
    (item) => (interpretationSrs[item.id]?.box ?? 0) > 0,
  ).length

  const study = (ids, title) => navigate('kotenStudy', { ids, title })
  const quiz = (ids, title) => navigate('kotenQuiz', { ids, title })
  const selectedCourse = KOTEN_CURRICULUM_BY_ID[curriculumLevel]

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
        <p className="text-xs font-bold text-white/75">中学古典〜最難関大学</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">古典アプリ</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          単語・文法・常識をつないで、一文を読み切ろう
        </p>
      </div>

      <div className="space-y-3 px-4 pt-5">
        <div className="px-1 pb-1">
          <p className="text-[10px] font-extrabold tracking-[0.14em] text-amber-700">MAIN ITEMS</p>
          <h2 className="font-display text-xl font-extrabold text-ink">三つのメインアイテム</h2>
          <p className="mt-1 text-xs font-bold text-ink/45">覚える → テスト → 登録 → 間隔復習を一続きにします。</p>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-2xl">📖</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-extrabold text-ink">古典単語</h3>
              <p className="text-[11px] font-bold text-ink/50">全{KOTEN_WORDS.length}語・習得 {total.mastered}・学習中 {total.learning}</p>
            </div>
            <ProgressRing value={total.ratio} size={48} stroke={6} color="#d97706">
              <span className="text-[10px] font-extrabold text-amber-800">{Math.round(total.ratio * 100)}%</span>
            </ProgressRing>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" onClick={() => study(KOTEN_WORDS.map((word) => word.id), '古典単語・全範囲')}><Book size={16} /> 覚える</Button>
            <Button variant="secondary" size="sm" onClick={() => quiz(KOTEN_WORDS.map((word) => word.id), '古典単語・全範囲')}><Cards size={16} /> テスト</Button>
          </div>
        </Card>

        <Card className="p-4">
          <button type="button" onClick={() => navigate('kotenGrammar')} className="flex w-full items-center gap-3 text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700"><BookOpen size={22} /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold text-ink">古典文法</span>
              <span className="block text-[11px] font-bold text-ink/50">{KOTEN_GRAMMAR.length}項目・{KOTEN_GRAMMAR_QUESTIONS.length}問</span>
            </span>
            <ArrowRight size={19} className="text-purple-600" />
          </button>
        </Card>

        <Card className="p-4">
          <button type="button" onClick={() => navigate('kotenCulture')} className="flex w-full items-center gap-3 text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-fuchsia-100 text-2xl">🏯</span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-extrabold text-ink">古典常識</span>
              <span className="block text-[11px] font-bold text-ink/50">{KOTEN_CULTURE.length}テーマ・{KOTEN_CULTURE_QUESTIONS.length}問</span>
            </span>
            <ArrowRight size={19} className="text-fuchsia-600" />
          </button>
        </Card>

        <div className="px-1 pt-3">
          <p className="text-[10px] font-extrabold tracking-[0.14em] text-amber-700">LEVEL COURSES</p>
          <h2 className="font-display text-lg font-extrabold text-ink">到達段階から選ぶ</h2>
          <p className="mt-1 text-xs font-bold text-ink/45">各段階で、単語・文法・常識を偏りなく暗記してテストします。</p>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex min-w-max gap-2">
            {KOTEN_CURRICULUM_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setCurriculumLevel(level.id)}
                aria-pressed={curriculumLevel === level.id}
                className={`rounded-full px-3 py-2 text-xs font-extrabold transition-colors ${
                  curriculumLevel === level.id
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {level.shortLabel}
              </button>
            ))}
          </div>
        </div>

        <Card className="border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <div>
            <Chip className="bg-amber-200 text-amber-950">{selectedCourse.label}</Chip>
            <p className="mt-2 text-sm font-extrabold leading-relaxed text-amber-950">
              {selectedCourse.description}
            </p>
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-white/85 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典単語</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.vocabIds.length}語</p>
              </div>
              <Button size="sm" onClick={() => study(selectedCourse.vocabIds, `${selectedCourse.label}・古典単語`)}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => quiz(selectedCourse.vocabIds, `${selectedCourse.label}・古典単語`)}>テスト</Button>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-white/85 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典文法</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.grammarIds.length}項目</p>
              </div>
              <Button size="sm" onClick={() => navigate('kotenGrammarStudy', { ids: selectedCourse.grammarIds, title: `${selectedCourse.label}・古典文法` })}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('kotenGrammarQuiz', { ids: selectedCourse.grammarIds, title: `${selectedCourse.label}・古典文法` })}>テスト</Button>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-2xl bg-white/85 p-2.5">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-ink">古典常識</p>
                <p className="text-[10px] font-bold text-ink/45">{selectedCourse.cultureIds.length}テーマ</p>
              </div>
              <Button size="sm" onClick={() => navigate('kotenCultureStudy', { ids: selectedCourse.cultureIds, title: `${selectedCourse.label}・古典常識` })}>暗記</Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('kotenCultureQuiz', { ids: selectedCourse.cultureIds, title: `${selectedCourse.label}・古典常識` })}>テスト</Button>
            </div>
          </div>
        </Card>

        <div className="px-1 pt-3">
          <p className="text-[10px] font-extrabold tracking-[0.14em] text-ink/35">READING & SAVED</p>
          <h2 className="font-display text-lg font-extrabold text-ink">読解・登録</h2>
        </div>

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

        <button
          onClick={() => navigate('kotenSaved')}
          className="flex w-full items-center gap-3 rounded-2xl bg-sky-100 p-3.5 text-left transition-transform active:scale-[0.98]"
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
