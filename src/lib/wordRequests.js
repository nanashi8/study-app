// ── 辞書リクエスト ────────────────────────────────────────────────────
// 辞書で引いて「見つからなかった」単語を、利用者がボタンでリクエストできる。
// 記録は Realtime Database の /wordRequests に追記され、アプリ内の一覧画面
// （生徒も見られる）で確認する。バックエンドの追加は不要。
//
//   /wordRequests/{pushId} = { word, q, ts, byEmail }
//     word    … 正規化した見出し語（小文字・トリム）。集計キー
//     q       … 実際に入力された語（表示の参考）
//     ts      … サーバ時刻
//     byEmail … リクエストした人のメール（任意・記録用）
import { ref, push, get, serverTimestamp } from 'firebase/database'
import { db, isFirebaseConfigured } from './firebase.js'

const COL = 'wordRequests'

const normalize = (s) => s.trim().toLowerCase()

// 1語リクエストを追記する。成功で true。
export async function requestWord(rawWord, user) {
  const word = normalize(rawWord)
  if (!word || !isFirebaseConfigured || !db) return false
  await push(ref(db, COL), {
    word,
    q: rawWord.trim(),
    ts: serverTimestamp(),
    byEmail: user?.email ?? null,
  })
  return true
}

// 全リクエストを取得し、見出し語ごとに集計して返す。
//   → [{ word, q, count, lastTs, emails:[...] }]（件数→新しい順）
export async function fetchWordRequests() {
  if (!isFirebaseConfigured || !db) return []
  const snap = await get(ref(db, COL))
  if (!snap.exists()) return []
  const byWord = new Map()
  snap.forEach((child) => {
    const r = child.val()
    if (!r?.word) return
    const cur = byWord.get(r.word) ?? { word: r.word, q: r.q || r.word, count: 0, lastTs: 0, emails: new Set() }
    cur.count += 1
    if (typeof r.ts === 'number' && r.ts > cur.lastTs) cur.lastTs = r.ts
    if (r.byEmail) cur.emails.add(r.byEmail)
    byWord.set(r.word, cur)
  })
  return [...byWord.values()]
    .map((c) => ({ ...c, emails: [...c.emails] }))
    .sort((a, b) => b.count - a.count || b.lastTs - a.lastTs)
}
