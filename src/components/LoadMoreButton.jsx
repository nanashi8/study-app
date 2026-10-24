import { useEffect, useRef } from 'react'
import { Button } from './ui.jsx'

// 一覧の続きを足して表示するボタン。押しても足せるし、下までスクロールしてボタンが見えたら押さなくても足す。
// 足したあともボタンが見えたまま（足した行が短い）なら、見えなくなるか全部並ぶまで続けて足す。
// count は今並べている数。数が変わるたびに見張り直し、見えているかを確かめ直す。
export function LoadMoreButton({ count, onMore, children, ...props }) {
  const ref = useRef(null)
  const onMoreRef = useRef(onMore)
  onMoreRef.current = onMore

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    let done = false
    const observer = new IntersectionObserver((entries) => {
      if (done || !entries.some((entry) => entry.isIntersecting)) return
      done = true
      observer.disconnect()
      onMoreRef.current()
    })
    observer.observe(node)
    return () => {
      done = true
      observer.disconnect()
    }
  }, [count])

  return (
    <Button ref={ref} full variant="secondary" data-load-more onClick={() => onMoreRef.current()} {...props}>
      {children}
    </Button>
  )
}
