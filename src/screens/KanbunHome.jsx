import { useStore } from '../store/useStore.js'
import { KANBUN_VOCAB } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES } from '../data/kanbun-kundoku.js'
import { kanbunProgress } from '../lib/kanbunProgress.js'
import { ProgressRing } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import {
  ArrowRight,
  Book,
  BookmarkFilled,
  Cards,
  ChevronLeft,
  Headphones,
} from '../components/Icons.jsx'

function MainItem({ emoji, title, description, count, unit, progress, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-3xl border border-rose-100 bg-white p-4 text-left shadow-card transition-transform active:scale-[0.99]"
    >
      <span className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-3xl">
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-extrabold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs font-bold leading-relaxed text-ink/50">{description}</span>
        <span className="mt-1 block text-[10px] font-extrabold text-rose-700">
          全{count}{unit}・習得 {progress.mastered}・学習中 {progress.learning}
        </span>
      </span>
      <ProgressRing value={progress.ratio} size={48} stroke={6} color="#be123c">
        <span className="text-[10px] font-extrabold text-rose-800">
          {Math.round(progress.ratio * 100)}%
        </span>
      </ProgressRing>
      <ArrowRight size={18} className="shrink-0 text-rose-600" />
    </button>
  )
}

export function KanbunHomeScreen() {
  const navigate = useStore((state) => state.navigate)
  const vocabSrs = useStore((state) => state.kanbunVocabSrs)
  const grammarSrs = useStore((state) => state.kanbunGrammarSrs)
  const cultureSrs = useStore((state) => state.kanbunCultureSrs)
  const kundokuSrs = useStore((state) => state.kanbunKundokuSrs)
  const vocabList = useStore((state) => state.kanbunVocabList)
  const grammarList = useStore((state) => state.kanbunGrammarList)
  const cultureList = useStore((state) => state.kanbunCultureList)

  const vocab = kanbunProgress(KANBUN_VOCAB, vocabSrs)
  const grammar = kanbunProgress(KANBUN_GRAMMAR, grammarSrs)
  const culture = kanbunProgress(KANBUN_CULTURE, cultureSrs)
  const kundoku = kanbunProgress(KANBUN_KUNDOKU_EXERCISES, kundokuSrs)
  const learned = vocab.mastered + vocab.learning
    + grammar.mastered + grammar.learning
    + culture.mastered + culture.learning
    + kundoku.mastered + kundoku.learning
  const total = KANBUN_VOCAB.length + KANBUN_GRAMMAR.length
    + KANBUN_CULTURE.length + KANBUN_KUNDOKU_EXERCISES.length

  return (
    <div className="pb-8">
      <header className="rounded-b-[2.5rem] bg-gradient-to-br from-rose-950 via-red-900 to-orange-800 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('portal')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90 active:scale-95"
          >
            <ChevronLeft size={14} /> スタディアプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/70">中学入門〜最難関大学</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide">漢文アプリ</h1>
        <p className="mt-1 text-sm font-bold text-white/80">
          漢語・句法・背景を覚え、返り点どおりに読み切る
        </p>
        <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-white/12 p-3.5">
          <ProgressRing value={total ? learned / total : 0} size={62} stroke={7} color="#ffffff">
            <span className="text-xs font-extrabold text-white">{learned}/{total}</span>
          </ProgressRing>
          <div>
            <p className="font-display text-base font-extrabold">5段階・全{total}学習項目</p>
            <p className="mt-1 text-[11px] font-bold leading-relaxed text-white/65">
              暗記カード → 4択テスト → 間隔復習。返り点は語順ドリルで実践。
            </p>
          </div>
        </div>
      </header>

      <main className="space-y-3 px-4 pt-5">
        <div className="px-1">
          <p className="text-[10px] font-extrabold tracking-[0.14em] text-rose-700">MAIN ITEMS</p>
          <h2 className="font-display text-xl font-extrabold text-ink">三つのメインアイテム</h2>
          <p className="mt-1 text-xs font-bold text-ink/45">英語と同じく、覚える・テスト・登録・復習を一続きにします。</p>
        </div>

        <MainItem
          emoji="📖"
          title="漢語"
          description="重要漢字・熟語・虚字を、訓読と用例で覚える"
          count={KANBUN_VOCAB.length}
          unit="語"
          progress={vocab}
          onOpen={() => navigate('kanbunCatalog', { domain: 'vocab' })}
        />
        <MainItem
          emoji="🧭"
          title="漢文法"
          description="返り点・再読文字・否定・使役・受身・疑問・比較"
          count={KANBUN_GRAMMAR.length}
          unit="項目"
          progress={grammar}
          onOpen={() => navigate('kanbunCatalog', { domain: 'grammar' })}
        />
        <MainItem
          emoji="🏛️"
          title="漢文常識"
          description="思想・歴史・制度・漢詩・故事成語を読解へ接続"
          count={KANBUN_CULTURE.length}
          unit="テーマ"
          progress={culture}
          onOpen={() => navigate('kanbunCatalog', { domain: 'culture' })}
        />

        <section className="pt-2">
          <button
            type="button"
            onClick={() => navigate('kanbunKundoku')}
            className="w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-rose-950 to-red-900 p-5 text-left text-white shadow-card active:scale-[0.99]"
          >
            <span className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">🔁</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl font-extrabold">返り点・訓読ドリル</span>
                <span className="mt-1 block text-xs font-bold leading-relaxed text-white/65">
                  レ点・一二点・上下点・甲乙点・天地人点を、実際の読む順に並べる
                </span>
                <span className="mt-2 block text-[11px] font-extrabold text-rose-200">
                  全{KANBUN_KUNDOKU_EXERCISES.length}題・習得 {kundoku.mastered}・復習待ち {kundoku.due}
                </span>
              </span>
              <ArrowRight size={20} className="mt-3 shrink-0 text-rose-200" />
            </span>
          </button>
        </section>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => navigate('kanbunSaved')}
            className="rounded-2xl bg-amber-50 p-3.5 text-left active:scale-[0.98]"
          >
            <BookmarkFilled size={21} className="text-amber-700" />
            <span className="mt-2 block text-sm font-extrabold text-amber-950">登録リスト</span>
            <span className="mt-1 block text-[10px] font-bold text-amber-800/65">
              漢語{vocabList.length}・文法{grammarList.length}・常識{cultureList.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate('literatureLibrary', { kind: 'kanbun' })}
            className="rounded-2xl bg-teal-50 p-3.5 text-left active:scale-[0.98]"
          >
            <Headphones size={21} className="text-teal-700" />
            <span className="mt-2 block text-sm font-extrabold text-teal-950">漢文の名作</span>
            <span className="mt-1 block text-[10px] font-bold text-teal-800/65">書き下し → 現代語訳を聴く</span>
          </button>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
          <div className="flex gap-3">
            <Book size={20} className="mt-0.5 shrink-0 text-rose-700" />
            <div>
              <p className="text-sm font-extrabold text-rose-950">学習の順序</p>
              <p className="mt-1 text-xs font-bold leading-relaxed text-rose-900/65">
                中学は訓読の仕組みと故事成語から。高校では再読文字・句法、難関大では複合返り・思想・史伝の含意まで進みます。
              </p>
              <div className="mt-3 flex gap-2 text-[10px] font-extrabold text-rose-800">
                <span className="inline-flex items-center gap-1"><Book size={13} /> 暗記</span>
                <span>→</span>
                <span className="inline-flex items-center gap-1"><Cards size={13} /> テスト</span>
                <span>→</span>
                <span>間隔復習</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
