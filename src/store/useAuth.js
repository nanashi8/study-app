// ── 認証ストア ────────────────────────────────────────────────────────
// 生徒のログイン状態を1か所で管理する。学習state（useStore）とは分離。
import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase.js'
import { useStore } from './useStore.js'

// Firebase の英語エラーを生徒向けの日本語に翻訳する。
function jaError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'メールアドレスの形式が正しくありません。'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'IDかパスワードが違います。先生に確認してください。'
    case 'auth/too-many-requests':
      return '試行が多すぎます。少し待ってからもう一度お試しください。'
    case 'auth/network-request-failed':
      return 'ネットワークに接続できませんでした。'
    default:
      return 'ログインに失敗しました。もう一度お試しください。'
  }
}

export const useAuth = create((set) => ({
  // status: 'loading'（判定中） | 'in'（ログイン済み） | 'out'（未ログイン）
  status: isFirebaseConfigured ? 'loading' : 'unconfigured',
  user: null, // { uid, email }
  error: null,
  busy: false,

  // アプリ起動時に1回だけ呼ぶ。ログイン状態の変化を購読する。
  init() {
    if (!isFirebaseConfigured) return () => {}
    return onAuthStateChanged(auth, (u) => {
      if (u) set({ status: 'in', user: { uid: u.uid, email: u.email }, error: null })
      else set({ status: 'out', user: null })
    })
  },

  async signIn(email, password) {
    if (!isFirebaseConfigured) return
    set({ busy: true, error: null })
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      // 成功すると onAuthStateChanged が status:'in' にする。
    } catch (e) {
      set({ error: jaError(e?.code) })
    } finally {
      set({ busy: false })
    }
  },

  async signOutNow() {
    if (!isFirebaseConfigured) return
    await signOut(auth)
    // 共有端末対策：次の生徒に前の生徒の進捗が残らないようローカルを初期化。
    // （クラウドには保存済みなので、本人が再ログインすれば復元される。）
    useStore.getState().resetProgress()
  },
}))
