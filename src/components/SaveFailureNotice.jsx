import { useSyncExternalStore } from 'react'
import { getSaveStatus, subscribeSaveStatus } from '../lib/appStorage.js'

// 失敗の型ごとの続け方（lib/appStorage.js の saveFailureReason）。
export const SAVE_FAILURE_DETAILS = Object.freeze({
  quota: '端末の空き容量が足りません。空きを増やすと、次に答えたときに保存します。',
  unavailable: 'このブラウザでは端末に保存できません。プライベートブラウズでないか確かめてください。',
  open: 'このブラウザでは端末に保存できません。プライベートブラウズでないか確かめてください。',
  write: '次に答えたときに、もう一度保存します。',
})

/** 学習の記録を端末に保存できなかったときの知らせ。保存できたら消える。学習はそのまま続けられる。 */
export function SaveFailureNotice() {
  const status = useSyncExternalStore(subscribeSaveStatus, getSaveStatus, getSaveStatus)
  if (status.ok) return null
  return (
    <div
      role="alert"
      data-save-failure-notice={status.reason}
      className="shrink-0 border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold leading-relaxed text-rose-800"
    >
      <p className="font-extrabold">学習の記録を保存できませんでした</p>
      <p>{SAVE_FAILURE_DETAILS[status.reason] ?? SAVE_FAILURE_DETAILS.write}</p>
    </div>
  )
}
