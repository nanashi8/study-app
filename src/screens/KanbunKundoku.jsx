import { useStore } from '../store/useStore.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  KANBUN_KUNDOKU_LEVELS,
} from '../data/kanbun-kundoku.js'
import { kanbunDueItems, kanbunProgress } from '../lib/kanbunProgress.js'
import { Button, Card, ProgressRing } from '../components/ui.jsx'
import { SpeechSettingsButton } from '../components/SpeechSettings.jsx'
import { Book, Cards, ChevronLeft, Refresh } from '../components/Icons.jsx'

export function KanbunKundokuScreen() {
  const navigate = useStore((state) => state.navigate)
  const srs = useStore((state) => state.kanbunKundokuSrs)
  const total = kanbunProgress(KANBUN_KUNDOKU_EXERCISES, srs)
  const due = kanbunDueItems(KANBUN_KUNDOKU_EXERCISES, srs)

  return (
    <div className="pb-8">
      <header className="rounded-b-[2.5rem] bg-gradient-to-br from-slate-950 via-rose-950 to-red-900 px-5 pb-7 pt-[calc(env(safe-area-inset-top)+1.25rem)] text-white">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('kanbunHome')}
            className="flex items-center gap-1 rounded-full bg-white/15 py-1 pl-1.5 pr-2.5 text-[11px] font-extrabold text-white/90"
          >
            <ChevronLeft size={14} /> 漢文アプリ
          </button>
          <SpeechSettingsButton compact inverse />
        </div>
        <p className="text-xs font-bold text-white/70">読む順を指で組み立てる</p>
        <h1 className="font-display text-2xl font-extrabold">返り点・訓読ドリル</h1>
        <p className="mt-1 text-sm font-bold text-white/80">点の名前を暗記するだけでなく、実際の語順を完成させる</p>
        <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-4 rounded-2xl bg-white/12 p-3.5">
          <ProgressRing value={total.ratio} size={62} stroke={7} color="#ffffff">
            <span className="text-xs font-extrabold text-white">{Math.round(total.ratio * 100)}%</span>
          </ProgressRing>
          <div>
            <p className="font-display text-base font-extrabold">全{KANBUN_KUNDOKU_EXERCISES.length}題・5段階</p>
            <p className="mt-1 text-[11px] font-bold text-white/65">習得 {total.mastered}・学習中 {total.learning}・復習待ち {total.due}</p>
          </div>
        </div>
      </header>

      <main className="space-y-5 px-4 pt-5">
        <section className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => navigate('kanbunKundokuQuiz')}
            className="rounded-3xl bg-gradient-to-br from-rose-700 to-red-900 p-4 text-left text-white shadow-card active:scale-[0.98]"
          >
            <Cards size={23} />
            <span className="mt-3 block font-display text-lg font-extrabold">全範囲テスト</span>
            <span className="mt-1 block text-[11px] font-bold text-white/70">10題の読む順を作る</span>
          </button>
          <button
            type="button"
            disabled={!due.length}
            onClick={() => navigate('kanbunKundokuQuiz', { ids: due.map((item) => item.id), title: '返り点・復習待ち' })}
            className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-700 p-4 text-left text-white shadow-card active:scale-[0.98] disabled:opacity-45"
          >
            <Refresh size={23} />
            <span className="mt-3 block font-display text-lg font-extrabold">復習</span>
            <span className="mt-1 block text-[11px] font-bold text-white/70">期限到来 {due.length}題</span>
          </button>
        </section>

        <Card className="border-rose-100 p-4">
          <div className="flex gap-3">
            <Book size={21} className="mt-0.5 shrink-0 text-rose-700" />
            <div>
              <h2 className="font-display text-base font-extrabold text-ink">返る順の原則</h2>
              <ol className="mt-2 space-y-1.5 text-xs font-bold leading-relaxed text-ink/60">
                <li>1. レ点：すぐ下の一字を先に読む</li>
                <li>2. 一二点：一点を読んで二点へ返る</li>
                <li>3. 上下点：一二点をまたぎ、上から下へ返る</li>
                <li>4. 甲乙点 → 天地人点：さらに外側の階層</li>
                <li>5. 複合するときは、必ず内側の小さい返りから閉じる</li>
              </ol>
            </div>
          </div>
        </Card>

        <section>
          <div className="px-1">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-rose-700">LEVEL MAP</p>
            <h2 className="font-display text-lg font-extrabold text-ink">段階別に練習する</h2>
          </div>
          <div className="mt-3 space-y-3">
            {KANBUN_KUNDOKU_LEVELS.map((level) => {
              const items = KANBUN_KUNDOKU_EXERCISES.filter((item) => item.level === level.id)
              const progress = kanbunProgress(items, srs)
              return (
                <Card key={level.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl" style={{ backgroundColor: `${level.color}18`, color: level.color }}>↩</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-base font-extrabold text-ink">{level.label}</h3>
                      <p className="text-[11px] font-bold text-ink/45">{items.length}題・習得 {progress.mastered}</p>
                    </div>
                    <ProgressRing value={progress.ratio} size={45} stroke={6} color={level.color}>
                      <span className="text-[10px] font-extrabold text-ink/60">{Math.round(progress.ratio * 100)}%</span>
                    </ProgressRing>
                  </div>
                  <Button
                    full
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate('kanbunKundokuQuiz', { ids: items.map((item) => item.id), title: level.label, size: items.length })}
                  >
                    <Cards size={16} /> この段階を解く
                  </Button>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="rounded-2xl bg-sky-50 p-4">
          <p className="text-xs font-extrabold text-sky-900">表記について</p>
          <p className="mt-1 text-[11px] font-bold leading-relaxed text-sky-900/65">
            このドリルではスマートフォンで位置関係を明瞭にするため、返り点を「読レ書」「学二於師一」のように親字の直後へ表示します。実際の縦書きでは返り点は漢字の左下に付きます。
          </p>
        </section>
      </main>
    </div>
  )
}
