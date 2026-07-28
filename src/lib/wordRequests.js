// ── 辞書リクエスト ────────────────────────────────────────────────────
// 辞書で引いて「見つからなかった」単語を、利用者がボタンでリクエストできる。
// 記録は Realtime Database の /wordRequests に追記され、アプリ内の一覧画面
// （生徒も見られる）で確認する。バックエンドの追加は不要。
//
//   /wordRequests/{pushId} = { word, q, ts, byEmail, source }
//     word    … 正規化した見出し語（小文字・トリム）。集計キー
//     q       … 実際に入力された語（表示の参考）
//     ts      … サーバ時刻
//     byEmail … リクエストした人のメール（任意・記録用）
//     source  … dictionary-search / camera-ocr（任意・流入元の確認用）
import { ref, push, get, update, serverTimestamp } from 'firebase/database'
import { db, isFirebaseConfigured } from './firebase.js'

const COL = 'wordRequests'

const normalize = (s) => s.trim().toLowerCase()

// 1語リクエストを追記する。成功で true。
export async function requestWord(rawWord, user) {
  const result = await requestWords([rawWord], user, { source: 'dictionary-search' })
  return result.sent === 1
}

// 複数語を1回の更新で追記する。写真OCRの未登録語を個別のリクエストとして
// 送るために使う。同じ語は大文字小文字を無視して1件にまとめる。
export async function requestWords(rawWords, user, { source = 'camera-ocr' } = {}) {
  const unique = new Map()
  for (const rawWord of Array.isArray(rawWords) ? rawWords : []) {
    const q = String(rawWord ?? '').trim()
    const word = normalize(q)
    if (word && !unique.has(word)) unique.set(word, q)
  }
  if (!unique.size || !isFirebaseConfigured || !db) {
    return { sent: 0, words: [] }
  }

  const collectionRef = ref(db, COL)
  const writes = {}
  for (const [word, q] of unique) {
    const key = push(collectionRef).key
    if (!key) continue
    writes[key] = {
      word,
      q,
      ts: serverTimestamp(),
      byEmail: user?.email ?? null,
      source,
    }
  }

  const keys = Object.keys(writes)
  if (!keys.length) return { sent: 0, words: [] }
  await update(collectionRef, writes)
  return { sent: keys.length, words: [...unique.keys()] }
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
