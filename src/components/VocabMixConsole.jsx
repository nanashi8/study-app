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
import { cx } from './ui.jsx'

const MIX_SCREENS = new Set(['vocabStudy', 'vocabQuiz'])

/**
 * 級・分野をまるごと学ぶ通常セッションだけが、復習と未修を混ぜて組み立てる。
 * マイ単語や復習など、出す語がすでに決まっている画面ではバーを出さない。
 */
export function vocabMixApplies(screen, params = {}) {
  return MIX_SCREENS.has(screen)
    && isAutomaticVocabularySource(params.source ?? { type: 'due' })
}

/** 復習と未修（まだ学んでいない語）の配分を手で寄せるバー。 */
export function VocabMixConsole() {
  const settings = useStore((store) => store.settings)
  const setSetting = useStore((store) => store.setSetting)
  const value = normalizeVocabMix(settings.vocabMix)
  const index = vocabMixIndex(value)
  const step = vocabMixStep(value)

  return (
    <section
      aria-label="出題バランスの調整"
      data-vocab-mix-console
      className="px-2 py-1.5"
    >
      <div className="mb-1 flex min-w-0 items-center gap-1.5">
        <span className="shrink-0 text-[9px] font-black tracking-[0.08em] text-brand-600">
          出題バランス
        </span>
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink">
          {step.label}
          <span className="ml-1 font-bold text-ink/45">· {describeVocabMix(value)}</span>
        </p>
        <button
          type="button"
          onClick={() => setSetting('vocabMix', 'auto')}
          disabled={value === 'auto'}
          className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[9px] font-extrabold text-ink/70 active:bg-slate-200 disabled:opacity-35"
        >
          自動に戻す
        </button>
      </div>

      <input
        type="range"
        min={0}
        max={VOCAB_MIX_STEPS.length - 1}
        step={1}
        value={index}
        onChange={(event) => setSetting('vocabMix', vocabMixAtIndex(event.target.value))}
        aria-label="復習と未修の配分"
        aria-valuetext={`${step.label}。${describeVocabMix(value)}`}
        data-vocab-mix-range
        className="h-9 w-full accent-brand-600"
      />

      <div className="flex items-center justify-between gap-1" aria-hidden="true">
        {VOCAB_MIX_STEPS.map((option) => (
          <button
            key={option.id}
            type="button"
            tabIndex={-1}
            onClick={() => setSetting('vocabMix', option.id)}
            className={cx(
              'min-w-0 flex-1 truncate rounded px-0.5 py-1 text-[8px] font-extrabold leading-none',
              option.id === value ? 'text-brand-700' : 'text-ink/35',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="mt-0.5 text-[9px] font-bold leading-snug text-ink/40">
        次に組む出題から反映します。指定した割合ぶんの在庫が無いときは、残った側から補います。
      </p>
    </section>
  )
}
