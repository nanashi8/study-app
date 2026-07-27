import { useState } from 'react'
import { useStore } from '../store/useStore.js'
import {
  ALL_WORDS,
  VOCAB_FIELDS,
  VOCAB_POS,
  wordsByField,
  wordsByPos,
} from '../data/vocab.js'
import { SESSION_SIZE, overallProgress, wordProgress } from '../lib/session.js'
import { ScreenHeader } from '../components/AppShell.jsx'
import { Book, Cards, Refresh, Sparkles } from '../components/Icons.jsx'
import { Button, Card, Chip, ProgressBar, cx } from '../components/ui.jsx'

const MODES = [
  { id: 'random', short: 'ランダム', emoji: '🎲' },
  { id: 'field', short: '分野別', emoji: '🗂️' },
  { id: 'pos', short: '品詞別', emoji: '🔤' },
]

const FIELD_EMOJI = {
  一般: '🌐',
  '動作・行為': '🏃',
  '性質・状態': '🎨',
  '様子・程度': '📊',
  機能語: '🧩',
  '時間・数量': '⏱️',
  心理: '💭',
  '家族・人': '👥',
  '食・生活': '🏠',
  料理: '🍳',
  自然: '🌿',
  気象: '🌦️',
  環境: '🌏',
  科学: '🔬',
  医学: '🩺',
  技術: '💻',
  測定: '📐',
  学問: '🎓',
  教育: '🏫',
  言語: '💬',
  文学: '📖',
  歴史: '🏛️',
  地理: '🗺️',
  社会: '🤝',
  経済: '📈',
  ビジネス: '💼',
  政治: '🏢',
  法律: '⚖️',
  軍事: '🛡️',
  宗教: '🕊️',
  交通: '🚆',
  農業: '🌾',
  建築: '🏗️',
  メディア: '📰',
  スポーツ: '⚽',
  芸術: '🖼️',
  音楽: '🎵',
  副詞: '⚡',
}

const POS_META = {
  名: { emoji: '🧱', desc: '人・もの・場所・考え', color: '#0ea5e9' },
  動: { emoji: '🏃', desc: '動作・状態・変化', color: '#6366f1' },
  形: { emoji: '🎨', desc: '人やものの性質・状態', color: '#f59e0b' },
  副: { emoji: '⚡', desc: '動作や性質の様子・程度', color: '#10b981' },
  前: { emoji: '🧭', desc: '位置・時間・方向などの関係', color: '#8b5cf6' },
  接: { emoji: '🔗', desc: '語・句・文をつなぐ', color: '#ec4899' },
  代: { emoji: '👤', desc: '名詞の代わりをする語', color: '#14b8a6' },
}

const FIELD_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

function GroupCard({ label, detail, icon, color, words, srs, onStudy, onQuiz }) {
  const progress = wordProgress(words, srs)
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl"
          style={{ backgroundColor: `${color}1f` }}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display font-extrabold text-ink">{label}</h3>
            <Chip color={color}>{progress.total.toLocaleString('ja-JP')}語</Chip>
          </div>
          {detail && <p className="mt-0.5 text-[11px] font-bold text-ink/50">{detail}</p>}
        </div>
      </div>

      <ProgressBar
        className="mt-3"
        value={progress.total ? progress.mastered / progress.total : 0}
        color={color}
      />
      <div className="mt-1.5 flex justify-between text-[11px] font-bold text-ink/45">
        <span>習得 {progress.mastered} ・ 学習済 {progress.seen}</span>
        <span>{progress.due > 0 ? `復習どき ${progress.due}` : '10語ずつ'}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={onStudy} aria-label={`${label}の単語を覚える`}>
          <Book size={16} /> 覚える
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={onQuiz}
          aria-label={`${label}の単語クイズ`}
        >
          <Cards size={16} /> クイズ
        </Button>
      </div>
    </Card>
  )
}

export function VocabGroupsScreen() {
  const navigate = useStore((s) => s.navigate)
  const srs = useStore((s) => s.srs)
  const initialMode = useStore((s) => s.params.mode)
  const [mode, setMode] = useState(MODES.some((item) => item.id === initialMode) ? initialMode : 'random')
  const total = overallProgress(srs)

  const start = ({ source, title, quiz = false }) =>
    navigate(quiz ? 'vocabQuiz' : 'vocabStudy', {
      source,
      title,
      size: SESSION_SIZE,
      ...(quiz ? {} : { mode: 'study' }),
    })

  const startRandom = (quiz = false) =>
    start({ source: { type: 'all' }, title: '全語彙ランダム', quiz })

  const groups =
    mode === 'field'
      ? VOCAB_FIELDS.map((field, index) => ({
          id: field,
          label: field,
          detail: null,
          icon: FIELD_EMOJI[field] ?? '📚',
          color: FIELD_COLORS[index % FIELD_COLORS.length],
          words: wordsByField(field),
          source: { type: 'field', field },
          title: `分野：${field}`,
        }))
      : mode === 'pos'
        ? VOCAB_POS.map(({ id, label }) => ({
            id,
            label,
            detail: POS_META[id]?.desc,
            icon: POS_META[id]?.emoji ?? '🔤',
            color: POS_META[id]?.color ?? '#6366f1',
            words: wordsByPos(id),
            source: { type: 'pos', pos: id },
            title: `品詞：${label}`,
          }))
        : []

  return (
    <div className="pb-6">
      <ScreenHeader
        title="全語彙から学ぶ"
        subtitle={`${ALL_WORDS.length.toLocaleString('ja-JP')}語をランダム・分野・品詞で選べます`}
      />

      <div className="space-y-4 px-4">
        <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="全語彙の学び方">
          {MODES.map((item) => {
            const active = mode === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setMode(item.id)}
                className={cx(
                  'flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-xs font-extrabold transition-all',
                  active
                    ? 'bg-brand-500 text-white shadow-pop'
                    : 'bg-white text-ink/55 shadow-sm active:bg-brand-50',
                )}
              >
                <span className="text-xl">{item.emoji}</span>
                {item.short}
              </button>
            )
          })}
        </div>

        {mode === 'random' ? (
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-brand-500 via-brand-500 to-violet-500 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Sparkles size={17} />
                    <span className="text-xs font-extrabold">標準の学び方</span>
                  </div>
                  <h2 className="mt-1 font-display text-xl font-extrabold">🎲 全語彙ランダム</h2>
                  <p className="mt-1 text-xs font-bold leading-relaxed text-white/80">
                    全{ALL_WORDS.length.toLocaleString('ja-JP')}語から、復習どきと未学習を優先して10語ずつ選びます。
                  </p>
                </div>
                <Chip className="shrink-0 bg-white/20 text-white">
                  習得 {total.mastered}
                </Chip>
              </div>
              <ProgressBar
                className="mt-4 bg-white/20"
                value={total.total ? total.mastered / total.total : 0}
                color="#ffffff"
              />
              <div className="mt-1.5 flex justify-between text-[11px] font-bold text-white/70">
                <span>学習済 {total.seen}語</span>
                <span>{total.due > 0 ? `復習どき ${total.due}語` : `全 ${total.total.toLocaleString('ja-JP')}語`}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <Button onClick={() => startRandom(false)}>
                <Book size={17} /> 覚える
              </Button>
              <Button variant="secondary" onClick={() => startRandom(true)}>
                <Cards size={17} /> クイズ
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="rounded-2xl bg-brand-100/70 px-4 py-3">
              <div className="flex items-center gap-2 text-brand-700">
                <span className="text-lg">{mode === 'field' ? '🗂️' : '🔤'}</span>
                <h2 className="font-display font-extrabold">
                  {mode === 'field' ? `${VOCAB_FIELDS.length}分野から選ぶ` : `${VOCAB_POS.length}品詞から選ぶ`}
                </h2>
              </div>
              <p className="mt-1 text-xs font-bold leading-relaxed text-brand-800/65">
                各分類の全単語から、復習どきと未学習を優先して10語ずつ出題します。
              </p>
            </div>

            <div className="space-y-3">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  {...group}
                  srs={srs}
                  onStudy={() => start({ source: group.source, title: group.title })}
                  onQuiz={() => start({ source: group.source, title: group.title, quiz: true })}
                />
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-2xl bg-white/70 px-4 py-3 text-xs font-bold leading-relaxed text-ink/50">
              <span className="mt-0.5 text-brand-500"><Refresh size={16} /></span>
              <p>
                {mode === 'field'
                  ? `全${VOCAB_FIELDS.length}分野の合計で${ALL_WORDS.length.toLocaleString('ja-JP')}語を網羅しています。`
                  : `全${VOCAB_POS.length}品詞の合計で${ALL_WORDS.length.toLocaleString('ja-JP')}語を網羅しています。`}
                繰り返すと未学習語を優先し、全語彙へ進めます。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
