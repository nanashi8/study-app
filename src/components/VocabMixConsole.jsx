import { useStore } from '../store/useStore.js'
import { isAutomaticVocabularySource } from '../lib/session.js'
import {
  VOCAB_MIX_STEPS,
  describeVocabMix,
  normalizeVocabMix,
  vocabMixAtIndex,
  vocabMixIndex,
  vocabMixStep,
} from '../lib/vocabMix.js'

const MIX_SCREENS = new Set(['vocabStudy', 'vocabQuiz'])

/**
 * 級・分野をまるごと学ぶ通常セッションだけが、復習と未修を混ぜて組み立てる。
 * 単語帳や復習など、出す語がすでに決まっている画面ではバーを出さない。
 */
export function vocabMixApplies(screen, params = {}) {
  return MIX_SCREENS.has(screen)
    && isAutomaticVocabularySource(params.source ?? { type: 'due' })
}

/**
 * 復習と未修（まだ学んでいない語）の配分を手で寄せるバー。
 * 読み上げ欄と同じ枠を分け合うので、見出し1行＋操作1行の高さにそろえる。
 * leading には、読み上げとの切り替えが入る（そのときは見出しの名前を切り替えに任せる）。
 */
export function VocabMixConsole({ leading = null } = {}) {
  const settings = useStore((store) => store.settings)
  const setSetting = useStore((store) => store.setSetting)
  const value = normalizeVocabMix(settings.vocabMix)
  const step = vocabMixStep(value)

  return (
    <section
      aria-label="出題バランスの調整"
      data-vocab-mix-console
      className="flex h-full flex-col px-2 py-1"
    >
      <div className="mb-1 flex h-8 min-w-0 items-center gap-1.5">
        {leading ?? (
          <span className="shrink-0 text-[9px] font-black tracking-[0.08em] text-brand-600">
            出題バランス
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink">
          {step.label}
          <span className="ml-1 font-bold text-ink/45">
            · {describeVocabMix(value)}・次の出題から
          </span>
        </p>
        <button
          type="button"
          onClick={() => setSetting('vocabMix', 'auto')}
          disabled={value === 'auto'}
          className="h-7 shrink-0 rounded-lg bg-slate-100 px-2 text-[9px] font-extrabold text-ink/70 active:bg-slate-200 disabled:opacity-35"
        >
          自動
        </button>
      </div>

      <div className="flex min-h-11 flex-1 items-center gap-1.5" data-vocab-mix-console-controls>
        <span className="shrink-0 text-[9px] font-extrabold text-ink/40">復習</span>
        <input
          type="range"
          min={0}
          max={VOCAB_MIX_STEPS.length - 1}
          step={1}
          value={vocabMixIndex(value)}
          onChange={(event) => setSetting('vocabMix', vocabMixAtIndex(event.target.value))}
          aria-label="復習と未修の配分"
          aria-valuetext={`${step.label}。${describeVocabMix(value)}`}
          data-vocab-mix-range
          className="h-9 min-w-0 flex-1 accent-brand-600"
        />
        <span className="shrink-0 text-[9px] font-extrabold text-ink/40">未修</span>
      </div>
    </section>
  )
}
