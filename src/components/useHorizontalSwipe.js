import { useEffect, useRef } from 'react'
import {
  beginSwipeGesture,
  finishSwipeGesture,
  moveSwipeGesture,
  swipeGestureOffset,
} from '../lib/cardSwipe.js'

// 文字の入力や選択はそのまま使えるよう、ここに置いた指はスワイプにしない。
const TEXT_ENTRY_TARGETS = 'input, select, textarea, [contenteditable="true"]'
// 横に動かしたあとに届く click で、ボタンや答えの開閉が動かないようにする時間。
const CLICK_SUPPRESS_MS = 450
// スワイプ領域が入れ子になっても、1回の操作は内側の1か所だけが受け取る。
const claimedEvents = new WeakSet()

/**
 * 要素の左右スワイプを受け取る。ボタンや語源チップの上から動かし始めてもよい。
 *
 * iPhone の Safari は、横に動かす途中で縦へ少しずれると pointercancel を送って
 * pointer イベントを打ち切る。そこで指はタッチイベントで離すまで追い、pointer イベントは
 * マウスとペンだけに使う。横と決まったら touchmove を止め、縦スクロールに指を取られないようにする。
 *
 * onDrag(offset) … 横に動かしている間、置いた位置からの横の移動量（px）
 * onEnd(direction) … 横に動かした指を離したとき。'next'（左へ）・'previous'（右へ）・null（短い・戻した）
 */
export function useHorizontalSwipe(ref, { onDrag, onEnd }) {
  const handlersRef = useRef({ onDrag, onEnd })
  useEffect(() => {
    handlersRef.current = { onDrag, onEnd }
  })

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    let active = null
    let suppressClickUntil = 0

    const end = (point) => {
      const { gesture } = active
      active = null
      const direction = point ? finishSwipeGesture(gesture, point) : null
      if (gesture?.axis !== 'x') return
      suppressClickUntil = Date.now() + CLICK_SUPPRESS_MS
      handlersRef.current.onEnd?.(direction)
    }

    const begin = (event, source, id, point) => {
      if (claimedEvents.has(event) || event.target?.closest?.(TEXT_ENTRY_TARGETS)) return
      claimedEvents.add(event)
      // 前の操作の終わりが届かなかった（押した要素が消えた・領域の外で離した）ときは、ここで閉じる。
      if (active) end(null)
      active = { source, id, gesture: beginSwipeGesture(point) }
    }

    // 横と決まっていれば、指に合わせて動かして true を返す。
    const move = (point) => {
      if (moveSwipeGesture(active.gesture, point) !== 'x') return false
      handlersRef.current.onDrag?.(swipeGestureOffset(active.gesture))
      return true
    }

    const touchPoint = (event, touch) => ({ x: touch.clientX, y: touch.clientY, t: event.timeStamp })
    const trackedTouch = (event) => Array.from(event.changedTouches)
      .find((touch) => touch.identifier === active?.id)

    const onTouchStart = (event) => {
      if (event.touches.length > 1) {
        // 2本指（拡大など）はスワイプにしない。
        if (active?.source === 'touch') end(null)
        return
      }
      const touch = event.changedTouches[0]
      if (touch) begin(event, 'touch', touch.identifier, touchPoint(event, touch))
    }
    const onTouchMove = (event) => {
      if (active?.source !== 'touch') return
      const touch = trackedTouch(event)
      if (touch && move(touchPoint(event, touch)) && event.cancelable) event.preventDefault()
    }
    const onTouchEnd = (event) => {
      if (active?.source !== 'touch') return
      const touch = trackedTouch(event)
      if (touch) end(event.type === 'touchend' ? touchPoint(event, touch) : null)
    }

    const pointerPoint = (event) => ({ x: event.clientX, y: event.clientY, t: event.timeStamp })
    const isTrackedPointer = (event) => active?.source === 'pointer' && active.id === event.pointerId
    const onPointerDown = (event) => {
      // 指はタッチイベントの側で追う。
      if (event.pointerType === 'touch' || event.isPrimary === false || event.button !== 0) return
      begin(event, 'pointer', event.pointerId, pointerPoint(event))
    }
    const onPointerMove = (event) => {
      if (!isTrackedPointer(event)) return
      const wasDragging = active.gesture?.axis === 'x'
      if (!move(pointerPoint(event)) || wasDragging) return
      // 横と決まってから捕まえる。押した時点で捕まえると、ボタンの click が領域へ移ってしまう。
      try {
        element.setPointerCapture(event.pointerId)
      } catch {
        // すでに離れたポインターは捕まえられない。
      }
    }
    const onPointerEnd = (event) => {
      if (isTrackedPointer(event)) end(event.type === 'pointerup' ? pointerPoint(event) : null)
    }

    const onClick = (event) => {
      if (Date.now() >= suppressClickUntil) return
      event.preventDefault()
      event.stopPropagation()
    }

    const listeners = [
      ['touchstart', onTouchStart, { passive: true }],
      // 横と決まった指の縦スクロールを止めるため、touchmove だけは passive にしない。
      ['touchmove', onTouchMove, { passive: false }],
      ['touchend', onTouchEnd],
      ['touchcancel', onTouchEnd],
      ['pointerdown', onPointerDown],
      ['pointermove', onPointerMove],
      ['pointerup', onPointerEnd],
      ['pointercancel', onPointerEnd],
      ['click', onClick, true],
    ]
    for (const [type, listener, options] of listeners) element.addEventListener(type, listener, options)
    return () => {
      for (const [type, listener, options] of listeners) element.removeEventListener(type, listener, options)
    }
  }, [ref])
}
