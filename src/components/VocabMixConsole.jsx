import { useStore, useContentSettings } from '../store/useStore.js'
import { isAutomaticVocabularySource } from '../lib/session.js'
import {
  VOCAB_MIX_STEPS,
  describeVocabMix,
  normalizeVocabMix,
  vocabMixAtIndex,
  vocabMixIndex,
  vocabMixStep,
} from '../lib/vocabMix.js'

// 暗記・テストの全30画面。どの画面も、今の出題順（lib/studyOrder.js）の上で出題バランスを当てて問題を組む（lib/studyMix.js）。
export const STUDY_MIX_SCREENS = Object.freeze([
  'vocabStudy',
  'vocabQuiz',
  'phraseStudy',
  'phraseQuiz',
  'grammarQuiz',
  'listeningQuiz',
  'dictationPlay',
  'etymologyStudy',
  'etymologyQuiz',
  'kotenStudy',
  'kotenQuiz',
  'kotenGrammarStudy',
  'kotenGrammarQuiz',
  'kotenCultureStudy',
  'kotenCultureQuiz',
  'kotenInterpretationQuiz',
  'kanbunStudy',
  'kanbunQuiz',
  'kanbunKundokuQuiz',
  'writingGrammarReview',
  'mathStoryQuiz',
  'mathExamSolve',
  'socialStudy',
  'socialQuiz',
  'socialPractice',
  'scienceStudy',
  'scienceQuiz',
  'sciencePractice',
  'customCardStudy',
  'customCardQuiz',
])

/**
 * いまの画面で下部に「出題」を出すか。出すときは { fixedOrder, adaptive } を返す。
 * fixedOrder … 一覧で選んで並べた項目など、選んだ順に出す回（バーは出すが動かせない）
 * adaptive   … 英単語の級・分野・品詞・全語の回（自動はたまり具合で配分を決める）
 */
export function studyMixContext(screen, params = {}) {
  if (!STUDY_MIX_SCREENS.includes(screen)) return null
  const source = params?.source ?? null
  return {
    fixedOrder: params?.preserveOrder === true || source?.preserveOrder === true,
    adaptive: (screen === 'vocabStudy' || screen === 'vocabQuiz')
      && isAutomaticVocabularySource(source ?? { type: 'due' }),
  }
}

/**
 * 復習と未修（まだ学んでいない項目）の配分を手で寄せるバー（画面下部の「出題」）。
 * 読み上げ・単語帳と同じ枠を分け合うので、見出し1行＋操作1行の高さにそろえる。
 * 自動は今の出題順（苦手→復習→未学習・未回答→今日1回まちがえた項目→定着の確認）のまま出す。
 * titled は見出し行の先頭に「出題バランス」と名前を出すか（左の切り替えで名前が見えているときは出さない）。
 */
export function VocabMixConsole({ context = null, titled = true } = {}) {
  const settings = useContentSettings()
  const setSetting = useStore((store) => store.setSetting)
  const value = normalizeVocabMix(settings.vocabMix)
  const step = vocabMixStep(value)
  const fixedOrder = context?.fixedOrder === true
  const adaptive = context?.adaptive !== false
  const description = describeVocabMix(value, { adaptive })

  return (
    <section
      aria-label="出題バランスの調整"
      data-vocab-mix-console
      className="flex h-full min-w-0 flex-col px-2 py-1"
    >
      <div className="mb-1 flex h-8 min-w-0 items-center gap-1.5">
        {titled && (
          <span className="shrink-0 text-[9px] font-black tracking-[0.08em] text-brand-600">
            出題バランス
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-[11px] font-extrabold leading-tight text-ink" data-vocab-mix-summary>
          {fixedOrder ? (
            <>
              {'選んだ順に出す回'}
              <span className="ml-1 font-bold text-ink/45">{'· 出題バランスは使いません'}</span>
            </>
          ) : (
            <>
              {step.label}
              <span className="ml-1 font-bold text-ink/45">
                · {description}・次の出題から
              </span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => setSetting('vocabMix', 'auto')}
          disabled={fixedOrder || value === 'auto'}
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
          disabled={fixedOrder}
          aria-label="復習と未修の配分"
          aria-valuetext={`${step.label}。${description}。何度もまちがえている項目は先頭に出します`}
          data-vocab-mix-range
          className="h-9 min-w-0 flex-1 accent-brand-600 disabled:opacity-35"
        />
        <span className="shrink-0 text-[9px] font-extrabold text-ink/40">未修</span>
      </div>
    </section>
  )
}
