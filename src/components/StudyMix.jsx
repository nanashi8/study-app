import { useEffect, useRef } from 'react'
import { currentContentSettings, useContentSettings } from '../store/useStore.js'
import { vocabMixEmptyNotice, vocabMixFreshShare } from '../lib/vocabMix.js'

/**
 * いま開いている教材の出題バランス（画面下部の「出題」）の割合。自動は null。
 * 暗記・テストの全28画面が、問題を組むたびにこれを読む（lib/studyMix.js）。
 */
export const currentStudyMixShare = () => vocabMixFreshShare(currentContentSettings().vocabMix)

/**
 * 画面下部の「出題」を動かしたら、学習中の回も、表示中と答えた分を残して、まだ出していない先の問題を新しい割合で組み直す。
 * rebuild(keepCount) は、先頭の keepCount 枚を残して組み直す（growDeck）。並びを選んで始めた回（fixedOrder）は組み直さない。
 */
export function useStudyMixRebuild({ index = 0, answeredIndexes = [], fixedOrder = false, rebuild }) {
  const { vocabMix } = useContentSettings()
  const applied = useRef(vocabMix)
  useEffect(() => {
    if (applied.current === vocabMix) return
    applied.current = vocabMix
    if (fixedOrder) return
    rebuild(Math.max(index + 1, ...answeredIndexes.map((answered) => answered + 1)))
    // 組み直すのは目盛りを動かしたときだけ。表示中の位置や答えは、動かした時点のものを使う。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vocabMix])
}

/**
 * 出題バランスの両端（「未修だけ」「復習だけ」）で出せる項目がないときの案内。
 * 各画面の「対象の項目がありません」に添え、下部の「出題」で割合を変えれば続けられることを伝える。
 */
export function StudyMixEmptyNotice({ className = '' }) {
  const { vocabMix } = useContentSettings()
  const notice = vocabMixEmptyNotice(vocabMix, { unit: '項目' })
  if (!notice) return null
  return (
    <p className={`text-sm font-bold leading-relaxed text-ink/55 ${className}`} data-study-mix-empty-notice>
      {notice.detail}
    </p>
  )
}
