import { cx } from './ui.jsx'

/**
 * 本文の中の1文。押すと一文の構文解説を開く。
 * button は必ず inline-block になり、文ごとに箱が分かれて段落が1文ずつの行に崩れるので、
 * 文字の流れに乗る span を「ボタン」として使う（Enter・スペースでも開く）。
 * 本文は行間が広く、行と行の間を押すと文から外れるので、上下の余白で押せる範囲を行の間まで広げる
 * （inline の上下の余白は行の高さを変えない）。
 */
export function SentenceTap({ onOpen, className, children, ...rest }) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onOpen()
      }}
      className={cx(
        'cursor-pointer rounded-md px-0.5 py-[0.4em] transition-colors [-webkit-box-decoration-break:clone] [box-decoration-break:clone] hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-400 active:bg-brand-100',
        className,
      )}
      data-reading-sentence-tap
      {...rest}
    >
      {children}
    </span>
  )
}
