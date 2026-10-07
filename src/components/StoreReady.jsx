import { useSyncExternalStore } from 'react'
import { useStore } from '../store/useStore.js'

const subscribeHydration = (callback) => useStore.persist.onFinishHydration(callback)
const hasHydrated = () => useStore.persist.hasHydrated()

/**
 * 端末に保存した学習の記録を読み戻し終えてから画面を出す。
 * 保存先の IndexedDB は読み戻しが非同期なので、読み戻す前の空の記録で出題を組んだり、
 * 画面が空の記録を前提に動いたりしないようにする（lib/appStorage.js）。
 */
export function StoreReady({ children }) {
  const ready = useSyncExternalStore(subscribeHydration, hasHydrated, hasHydrated)
  if (!ready) return null
  return children
}
