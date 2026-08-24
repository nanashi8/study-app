import { useStore } from '../store/useStore.js'
import { LEVELS } from '../data/levels.js'
import { ALL_WORDS, VOCAB_FIELDS, wordsByLevel } from '../data/vocab.js'
import {
  levelProgress,
  nextVocabularyReviewInDays,
  overallProgress,
  reviewActionState,
  weakFoundationLevel,
} from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Card, Button, Chip, IconButton } from '../components/ui.jsx'
import { LearningStatusBars } from '../components/LearningStatusBars.jsx'
import { summarizeSrsItems } from '../lib/contentProgress.js'
import { Refresh, Bookmark, Book, Cards, Search, Lightbulb, ArrowRight, Sparkles, Check, Link } from '../components/Icons.jsx'

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

function LevelCard({ level, srs, onStudy, onQuiz, onFields }) {
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

      <LearningStatusBars progress={status} className="mt-3" compact units={{ learning: '語', quiz: '問' }} />
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
        onClick={onFields}
        disabled={!p.total}
        aria-label={`英検${level.label}の10分野を選ぶ`}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-paper py-2 text-xs font-extrabold text-brand-600 active:scale-[0.98] transition-transform disabled:opacity-50"
      >
        <Sparkles size={15} /> 10分野で選ぶ
        <ArrowRight size={15} />
      </button>
    </Card>
  )
}

function FieldChooser({ onChoose }) {
  return (
    <button
      type="button"
      onClick={onChoose}
      className="block w-full overflow-hidden rounded-2xl bg-white text-left shadow-card active:bg-brand-50"
      data-vocab-ten-field-entry
    >
      <div className="bg-gradient-to-r from-brand-500 to-violet-500 p-4 text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h2 className="font-display text-lg font-extrabold">10分野から学ぶ</h2>
        </div>
        <p className="mt-1 text-xs font-bold text-white/80">
          全{ALL_WORDS.length.toLocaleString('ja-JP')}語を{VOCAB_FIELDS.length}分野に整理
        </p>
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <p className="text-xs font-bold leading-relaxed text-ink/55">基本・日常から自然・環境まで、目的の分野を直接選べます。</p>
        <ArrowRight size={20} className="shrink-0 text-brand-500" />
      </div>
    </button>
  )
}

export function VocabLevelsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const myList = useStore((s) => s.myList)
  const prog = overallProgress(srs)
  const reviewState = reviewActionState(prog)
  const reviewComplete = reviewState === 'complete'
  const canReview = prog.seen > 0
  const nextReviewInDays = nextVocabularyReviewInDays(srs)
  const reviewLabel = reviewState === 'due'
    ? '今日の復習'
    : reviewComplete
      ? '先取り復習'
      : '復習'
  const reviewTiming = reviewState === 'due'
    ? `${prog.due}語が期限`
    : reviewComplete
      ? nextReviewInDays === 1
        ? '次の期限は明日'
        : Number.isFinite(nextReviewInDays)
          ? `次の期限まであと${nextReviewInDays}日`
          : '学習済み語を確認'
      : '学習後に表示'

  const study = (levelId, label) =>
    navigate('vocabStudy', { source: { type: 'level', levelId }, title: `英検${label}`, mode: 'study', returnTo: { screen: 'vocabLevels' } })
  const quiz = (levelId, label) =>
    navigate('vocabQuiz', { source: { type: 'level', levelId }, title: `英検${label}`, returnTo: { screen: 'vocabLevels' } })

  return (
    <div className="pb-6">
      <ScreenHeader
        title="単語"
        subtitle="10分野または英検級を選ぶ"
        right={
          <IconButton onClick={() => navigate('vocabSearch')} aria-label="英和辞書">
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
            disabled={!canReview}
            onClick={() => navigate('vocabStudy', {
              source: { type: reviewState === 'due' ? 'due' : 'review' },
              title: reviewState === 'due' ? '今日の復習' : '先取り復習',
              mode: 'study',
              returnTo: { screen: 'vocabLevels' },
            })}
            aria-label={`${reviewLabel}。${reviewTiming}`}
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
                {reviewLabel}
              </div>
              <div className={`text-[11px] font-bold ${reviewComplete ? 'text-emerald-700/70' : 'text-amber-800/70'}`}>
                {reviewTiming}
              </div>
            </div>
          </button>
          <button
            disabled={!myList.length}
            onClick={() =>
              navigate('vocabStudy', { source: { type: 'mylist', ids: myList }, title: 'マイ単語', mode: 'study', returnTo: { screen: 'vocabLevels' } })
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

        <p
          className="rounded-2xl bg-white/70 px-4 py-3 text-xs font-bold leading-relaxed text-ink/55"
          data-vocab-session-policy
        >
          通常セッションは固定配分ではありません。直近の「まだ」・誤答と今日の復習量に合わせ、新しい語・別の語を約30〜60%に調整します（対象語がある場合）。「まだ」も同日の次のセッションから候補に戻し、期限語と新しい語の間に分散します。
        </p>

        <FieldChooser onChoose={() => navigate('vocabGroups')} />

        <button
          type="button"
          onClick={() => navigate('roots')}
          className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-left shadow-sm active:bg-violet-100"
          data-vocab-etymology-entry
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-600 text-white">
            <Link size={18} />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="block text-sm font-extrabold text-violet-900">語源から学ぶ</strong>
            <span className="mt-0.5 block text-xs font-bold text-violet-700">語源から関連英単語を覚える</span>
          </span>
          <ArrowRight size={17} className="shrink-0 text-violet-400" />
        </button>

        {LEVELS.map((level) => (
          <LevelCard
            key={level.id}
            level={level}
            srs={srs}
            onStudy={() => study(level.id, level.label)}
            onQuiz={() => quiz(level.id, level.label)}
            onFields={() => navigate('vocabDecks', { levelId: level.id })}
          />
        ))}
      </div>
    </div>
  )
}
