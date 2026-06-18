// ── Firebase の接続設定 ───────────────────────────────────────────────
// ここは Firebase コンソールの「プロジェクトの設定 > マイアプリ > SDK の設定と構成」
// に表示される firebaseConfig をそのまま貼り付ける。
//
// ⚠️ この値は「秘密鍵」ではない（公開して問題ない識別情報）。本当の安全は
//    Firestore セキュリティルールで守る。なのでこのファイルは commit してよい。
//
// まだ未設定のうちは下のダミー値のまま。コンソールで取得したら丸ごと差し替える。
export const firebaseConfig = {
  apiKey: 'AIzaSyCPUZBZ5JGNX_P7omiXAzgaF_HLFzGUz3c',
  authDomain: 'study-app-7165f.firebaseapp.com',
  projectId: 'study-app-7165f',
  storageBucket: 'study-app-7165f.firebasestorage.app',
  messagingSenderId: '227220955686',
  appId: '1:227220955686:web:cba9e37cd951b618873ce7',
  // Realtime Database の URL（プロジェクト study-app-7165f / Singapore）。
  databaseURL: 'https://study-app-7165f-default-rtdb.asia-southeast1.firebasedatabase.app',
}

// 設定がまだダミーかどうか（未設定なら警告を出す/ログイン画面で案内する）。
export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith('PASTE_')
