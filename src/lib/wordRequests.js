// ── 辞書リクエスト ────────────────────────────────────────────────────
// 辞書で引いて「見つからなかった」単語を、利用者がボタンでリクエストできる。
// 記録は Realtime Database の /wordRequests に追記されるが、公開一覧にはしない。
// Security Rules 側でも認証・型・長さ・許可フィールドを検証する。
//
//   /wordRequests/{pushId} = { word, q, ts, source }
//     word    … 正規化した見出し語（小文字・トリム）。集計キー
//     q       … 実際に入力された語（表示の参考）
//     ts      … サーバ時刻
//     source  … dictionary-search / camera-ocr（流入元の確認用）
import { ref, push, update, serverTimestamp } from 'firebase/database'
import { db, isFirebaseConfigured } from './firebase.js'

const COL = 'wordRequests'
const REQUEST_WORD = /^[a-z]+(?:[-'][a-z]+)*$/
const REQUEST_SOURCES = new Set(['dictionary-search', 'camera-ocr'])
const MAX_WORD_LENGTH = 64

const normalize = (s) => s.trim().toLowerCase()

// 1語リクエストを追記する。成功で true。
export async function requestWord(rawWord, user) {
  const result = await requestWords([rawWord], user, { source: 'dictionary-search' })
  return result.sent === 1
}

// 複数語を1回の更新で追記する。写真OCRの未登録語を個別のリクエストとして
// 送るために使う。同じ語は大文字小文字を無視して1件にまとめる。
export async function requestWords(rawWords, user, { source = 'camera-ocr' } = {}) {
  if (!user?.uid || !REQUEST_SOURCES.has(source)) {
    return { sent: 0, words: [] }
  }
  const unique = new Map()
  for (const rawWord of Array.isArray(rawWords) ? rawWords : []) {
    const q = String(rawWord ?? '').trim()
    const word = normalize(q)
    if (
      word
      && word.length <= MAX_WORD_LENGTH
      && REQUEST_WORD.test(word)
      && !unique.has(word)
    ) {
      unique.set(word, q)
    }
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
      source,
    }
  }

  const keys = Object.keys(writes)
  if (!keys.length) return { sent: 0, words: [] }
  await update(collectionRef, writes)
  return { sent: keys.length, words: [...unique.keys()] }
}
