import { useStore } from '../store/useStore.js'
import { cx } from './ui.jsx'
import { Eye, EyeOff } from './Icons.jsx'

// 「タップして意味を見る」を毎回タップしなくても済むよう、カード画面の上で
// そのまま切り替える。設定メニューの「答えを開いたまま見せる」と同じ値を使うので、
// 英単語・古文単語・熟語・文法・古典常識・漢文のどのカードでも同じ操作になる。
export function RevealAnswersToggle({ onChange, className = '', label = '意味' }) {
  const revealAnswers = useStore((state) => state.settings.revealAnswers === true)
  const setSetting = useStore((state) => state.setSetting)

  const toggle = () => {
    const next = !revealAnswers
    setSetting('revealAnswers', next)
    onChange?.(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={revealAnswers}
      aria-label={revealAnswers
        ? `${label}を最初から表示中。タップして開く方式に切り替える`
        : `${label}はタップして表示中。最初から表示に切り替える`}
      data-reveal-answers-toggle
      className={cx(
        'inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-2.5 text-[11px] font-extrabold transition-colors',
        revealAnswers
          ? 'bg-brand-500 text-white'
          : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
        className,
      )}
    >
      {revealAnswers ? <Eye size={15} /> : <EyeOff size={15} />}
      {label}
    </button>
  )
}
