import { createContext, useContext } from 'react'
import { usageGuidesWith } from '../lib/usageGuides.js'

// 関連語の行に添える「使い分けカード」のボタン。見ている語の使い分けカード（UsageGuideProvider の guides）に
// 行の相手も入っていれば、押すと同じ画面のそのカード（UsageGuideSection）へ移る。
const UsageGuideContext = createContext([])

export function UsageGuideProvider({ guides = [], children }) {
  return <UsageGuideContext.Provider value={guides}>{children}</UsageGuideContext.Provider>
}

/** 画面の中の使い分けカードへ移る。 */
export function scrollToUsageGuide(id) {
  const card = document.querySelector(`[data-usage-guide="${id}"]`)
  card?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function UsageGuideLink({ text = '', wordId = null, phraseId = null }) {
  const guides = usageGuidesWith(useContext(UsageGuideContext), { text, wordId, phraseId })
  if (!guides.length) return null
  return (
    <span className="mt-1 flex flex-wrap gap-1.5">
      {guides.map((guide) => (
        <button
          key={guide.id}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            scrollToUsageGuide(guide.id)
          }}
          className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-extrabold text-amber-800 ring-1 ring-amber-200 active:bg-amber-200"
          data-usage-guide-link={guide.id}
        >
          使い分けカード：{guide.title}
        </button>
      ))}
    </span>
  )
}
