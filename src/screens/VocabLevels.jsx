import { useStore } from '../store/useStore.js'
import { LEVELS } from '../data/levels.js'
import { ALL_WORDS, VOCAB_FIELDS, VOCAB_POS, wordsByLevel } from '../data/vocab.js'
import {
  levelProgress,
  overallProgress,
  reviewActionState,
  weakFoundationLevel,
} from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Refresh, Bookmark, Book, Cards, Search, Lightbulb, ArrowRight, Sparkles, Check } from '../components/Icons.jsx'

// 下の級（前提）が弱点なら「先に固めよう」と案内するバナー。
function WeakFoundationBanner({ srs, onReview }) {
  const weak = weakFoundationLevel(srs)
  if (!weak) return null
  const { level, progress, reason } = weak
  const status = summarizeSrsItems(wordsByLevel(level.id), srs)
  return (
    <button
      onClick={() => onReview(level)}
      className="flex w-full items-center gap-3 rounded-2xl border-2 border-amber-300 bg-hint-soft p-3.5 text-left active:scale-[0.98] transition-transform"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/70 text-amber-700">
        <Lightbulb size={22} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-extrabold text-amber-900">
          英検{level.label}を先に固めよう
        </div>
        <div className="text-[11px] font-bold text-amber-800/75">
          {reason === 'due'
            ? `復習が ${progress.due} 語たまっています。土台の級です`
            : `学習済 ${status.learning.learned}/${status.total} 語。上の級の土台になります`}
        </div>
      </div>
      <span className="text-amber-700"><ArrowRight size={20} /></span>
    </button>
  )
}

function LevelCard({ level, srs, onStudy, onQuiz, onDecks }) {
  const p = levelProgress(level.id, srs)
  const status = summarizeSrsItems(wordsByLevel(level.id), srs)
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: `${level.color}22` }}
        >
          {level.emoji}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-extrabold text-ink">英検{level.label}</h3>
            <Chip color={level.color}>{level.cefr}</Chip>
          </div>
          <p className="text-xs font-bold text-ink/50">{level.sub}</p>
        </div>
        <span className="shrink-0 text-xs font-extrabold tabular-nums text-ink/45">全{p.total}語</span>
      </div>

      <LearningStatusBars progress={status} className="mt-3" compact />
      {p.due > 0 && <p className="mt-1.5 text-right text-[10px] font-extrabold text-amber-700">今日の復習 {p.due}語</p>}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          variant="primary"
          size="sm"
          disabled={!p.total}
          onClick={onStudy}
          aria-label={`英検${level.label}の単語を覚える`}
        >
          <Book size={16} /> 覚える
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!p.total}
          onClick={onQuiz}
          aria-label={`英検${level.label}の単語クイズ`}
        >
          <Cards size={16} /> クイズ
        </Button>
      </div>
      <button
        onClick={onDecks}
        disabled={!p.total}
        aria-label={`英検${level.label}の目次・デッキを選ぶ`}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-paper py-2 text-xs font-extrabold text-brand-600 active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        <Sparkles size={15} /> 目次・デッキでえらぶ
        <ArrowRight size={15} />
      </button>
    </Card>
  )
}

function AllVocabChooser({ onChoose }) {
  const choices = [
    { mode: 'random', emoji: '🎲', label: '標準ランダム' },
    { mode: 'field', emoji: '🗂️', label: '分野別' },
    { mode: 'pos', emoji: '🔤', label: '品詞別' },
  ]
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-brand-500 to-violet-500 p-4 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h2 className="font-display text-lg font-extrabold">全語彙から学ぶ</h2>
        </div>
        <p className="mt-1 text-xs font-bold text-white/80">
          全{ALL_WORDS.length.toLocaleString('ja-JP')}語・{VOCAB_FIELDS.length}分野・{VOCAB_POS.length}品詞
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {choices.map((choice) => (
          <button
            key={choice.mode}
            onClick={() => onChoose(choice.mode)}
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-brand-50 px-1 py-2 text-center text-[11px] font-extrabold text-brand-700 transition-transform active:scale-[0.97] active:bg-brand-100"
          >
            <span className="text-xl">{choice.emoji}</span>
            {choice.label}
          </button>
        ))}
      </div>
    </Card>
  )
}

export function VocabLevelsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const myList = useStore((s) => s.myList)
  const prog = overallProgress(srs)
  const reviewState = reviewActionState(prog)
  const reviewComplete = reviewState === 'complete'

  const study = (levelId, label) =>
    navigate('vocabStudy', { source: { type: 'level', levelId }, title: `英検${label}`, mode: 'study' })
  const quiz = (levelId, label) =>
    navigate('vocabQuiz', { source: { type: 'level', levelId }, title: `英検${label}` })

  return (
    <div className="pb-6">
      <ScreenHeader
        title="単語を学ぶ"
        subtitle="級を選んでね"
        right={
          <IconButton onClick={() => navigate('vocabSearch')} aria-label="単語をさがす">
            <Search size={22} />
          </IconButton>
        }
      />
      <div className="space-y-3 px-4">
        {/* 弱点ナビ：下の級が足を引っ張っていたら案内 */}
        <WeakFoundationBanner
          srs={srs}
          onReview={(level) =>
            study(level.id, level.label)
          }
        />

        {/* 復習・マイ単語のショートカット */}
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={!prog.due}
            onClick={() => navigate('vocabStudy', { source: { type: 'due' }, title: '復習', mode: 'study' })}
            aria-label={reviewComplete ? '復習完了。次の復習待ち' : `復習 ${prog.due}語`}
            data-review-state={reviewState}
            className={`flex items-center gap-2 rounded-2xl p-3 text-left transition-transform active:scale-[0.98] disabled:cursor-default ${
              reviewComplete ? 'bg-emerald-50' : 'bg-hint-soft disabled:opacity-50'
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                reviewComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-hint/20 text-hint'
              }`}
            >
              {reviewComplete ? <Check size={20} /> : <Refresh size={20} />}
            </span>
            <div>
              <div className={`text-sm font-extrabold ${reviewComplete ? 'text-emerald-900' : 'text-amber-900'}`}>
                {reviewComplete ? '復習完了' : '復習'}
              </div>
              <div className={`text-[11px] font-bold ${reviewComplete ? 'text-emerald-700/70' : 'text-amber-800/70'}`}>
                {reviewComplete ? '次の復習待ち' : `${prog.due}語`}
              </div>
            </div>
          </button>
          <button
            disabled={!myList.length}
            onClick={() =>
              navigate('vocabStudy', { source: { type: 'mylist', ids: myList }, title: 'マイ単語', mode: 'study' })
            }
            className="flex items-center gap-2 rounded-2xl bg-brand-100 p-3 text-left active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-200 text-brand-600">
              <Bookmark size={20} />
            </span>
            <div>
              <div className="text-sm font-extrabold text-brand-800">マイ単語</div>
              <div className="text-[11px] font-bold text-brand-700/70">{myList.length}語</div>
            </div>
          </button>
        </div>

        <AllVocabChooser onChoose={(mode) => navigate('vocabGroups', { mode })} />

        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            srs={srs}
            onStudy={() => study(level.id, level.label)}
            onQuiz={() => quiz(level.id, level.label)}
            onDecks={() => navigate('vocabDecks', { levelId: level.id })}
          />
        ))}
      </div>
    </div>
  )
}
