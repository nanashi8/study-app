import { useStore } from '../store/useStore.js'
import { cx } from './ui.jsx'
import { Eye, EyeOff } from './Icons.jsx'

// 「タップして意味を見る」を毎回タップしなくても済むよう、カード画面の上で
// そのまま切り替える。設定メニューの「答えを開いたまま見せる」と同じ値を使うので、
// 英単語・古文単語・熟語・文法・古典常識・漢文のどのカードでも同じ操作になる。
//
// 英単語・熟語のカードは spellingLabel（「スペル」「英語」）を渡す。押すたびに
// 「意味を隠す → スペルを隠す → 全部見せる」と進む。スペルを隠す値は設定メニューの
// 「英語のスペルと発音を隠す」と同じで、隠しているあいだ発音を止めるのは各カード画面。
export function RevealAnswersToggle({
  onChange,
  className = '',
  label = '意味',
  spellingLabel = null,
  toolbar = false,
}) {
  const revealAnswers = useStore((state) => state.settings.revealAnswers === true)
  const hideSpelling = useStore((state) => state.settings.hideSpelling === true)
  const setSetting = useStore((state) => state.setSetting)
  const withSpelling = Boolean(spellingLabel)
  // スペルを隠せない画面（古典・漢文など）では、スペルを隠す設定のときも「意味を隠す」段として扱う。
  const mode = withSpelling && hideSpelling ? 'spelling' : revealAnswers ? 'open' : 'meaning'

  // onChange には「答えを最初から開いておくか」を渡す。画面はそれでいまのカードを開け閉めする。
  const toggle = () => {
    if (withSpelling && mode === 'meaning') {
      setSetting('hideSpelling', true)
      onChange?.(false)
      return
    }
    const next = mode !== 'open'
    setSetting('revealAnswers', next)
    onChange?.(next)
  }

  const ariaLabel = withSpelling
    ? {
        meaning: `${label}を隠しています。タップして${spellingLabel}と発音を隠す方式に切り替える`,
        spelling: `${spellingLabel}と発音を隠しています。タップして全部を最初から表示する`,
        open: `${label}と${spellingLabel}を最初から表示中。タップして${label}を隠す方式に切り替える`,
      }[mode]
    : mode === 'open'
      ? `${label}を最初から表示中。タップして開く方式に切り替える`
      : `${label}はタップして表示中。最初から表示に切り替える`

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mode === 'open'}
      aria-label={ariaLabel}
      data-reveal-answers-toggle
      data-reveal-mode={mode}
      className={cx(
        'inline-flex shrink-0 items-center font-extrabold transition-colors',
        toolbar
          ? 'min-h-11 min-w-[3.25rem] flex-col justify-center gap-0 rounded-xl px-1 text-[10px]'
          : 'h-9 gap-1 rounded-full px-2.5 text-[11px]',
        mode === 'open'
          ? 'bg-brand-500 text-white'
          : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
        className,
      )}
    >
      {mode === 'open' ? <Eye size={toolbar ? 17 : 15} /> : <EyeOff size={toolbar ? 17 : 15} />}
      {/* 目の開閉と名前で、いま何を隠しているかを示す。全部見せているときは、スペルを隠せる画面だけ「全部」と書く。 */}
      <span>{mode === 'spelling' ? spellingLabel : mode === 'open' && withSpelling ? '全部' : label}</span>
    </button>
  )
}
