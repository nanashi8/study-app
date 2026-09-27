// ── 認証ストア ────────────────────────────────────────────────────────
// 生徒のログイン状態を1か所で管理する。学習state（useStore）とは分離。
// ログインの入口は紛らわしいので画面に出さない（2026-09-27）。すでにログインしている端末の
// 状態だけを読み、その端末では見えないまま今までどおりクラウドへ保存・復元を続ける。
import { create } from 'zustand'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'

export const useAuth = create((set) => ({
  // status: 'loading'（判定中） | 'in'（ログイン済み） | 'out'（未ログイン） | 'unconfigured'
  status: isFirebaseConfigured ? 'loading' : 'unconfigured',
  user: null, // { uid, email }

  // アプリ起動時に1回だけ呼ぶ。ログイン状態の変化を購読する。
  init() {
    if (!isFirebaseConfigured) return () => {}
    return onAuthStateChanged(auth, (u) => {
      if (u) set({ status: 'in', user: { uid: u.uid, email: u.email } })
      else set({ status: 'out', user: null })
    })
  },
}))
