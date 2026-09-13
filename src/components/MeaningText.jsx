import { Fragment } from 'react'
import { meaningSegments } from '../lib/meaningReadings.js'

// 英単語の意味を表示する。読みにくい語には、すぐ後ろに（よみ）を小さく添える。
// 語と読みは行の途中で切り離さない。
export function MeaningText({ children }) {
  if (children == null || children === '') return null
  if (typeof children !== 'string') return children
  return meaningSegments(children).map((segment, index) => (
    segment.reading ? (
      <span key={`${index}:${segment.text}`} className="whitespace-nowrap" data-meaning-reading={segment.reading}>
        {segment.text}
        <span className="text-[0.72em] font-bold opacity-70">（{segment.reading}）</span>
      </span>
    ) : (
      <Fragment key={`${index}:${segment.text}`}>{segment.text}</Fragment>
    )
  ))
}
