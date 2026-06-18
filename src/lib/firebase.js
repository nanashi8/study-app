// Firebase 本体の初期化。Auth と Realtime Database をアプリ全体で使い回す。
// （Firestore は無料プランで作成時に課金が必要だったため、カード不要の
//   Realtime Database を保管庫に採用。）
import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig.js'

// 未設定（ダミーのまま）でもアプリが落ちないよう、その時だけ初期化をスキップする。
let app = null
let auth = null
let db = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getDatabase(app) // config.databaseURL を使う
  // ログイン状態をブラウザに保持＝次回アクセス時は自動ログイン（毎回入力しない）。
  setPersistence(auth, browserLocalPersistence).catch(() => {})
}

export { app, auth, db, isFirebaseConfigured }
