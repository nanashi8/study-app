// ── 辞書リクエスト ────────────────────────────────────────────────────
// 辞書で引いて「見つからなかった」単語を、ログインなしでも受け付ける。
// ログインを必須にする代わりに《アプリ全体で受け付ける語数の上限》で守る。
//
//   /wordRequests/{word} = { word, q, ts, source }   ← 見出し語そのものがキー
//     word    … 正規化した見出し語（小文字・トリム）。キーと同じ値
//     q       … 実際に入力された語（表示の参考）
//     ts      … サーバ時刻
//     source  … dictionary-search / camera-ocr（流入元の確認用）
//
//   /wordRequestQuota/used = 受付済みの語数（誰でも読める整数だけ）
//
// キーが見出し語なので、同じ語は何度送っても1件しか増えない。
// さらに used が上限に達したら、ルール側で新規追加そのものを止める。
// 一覧は公開せず（.read:false）、メール等の個人情報は一切送らない。
//
// 辞書検索ぶんはボタンを押さずに自動で送るので、次の3段で受付を絞る。
//   1. 端末側：1日に自動で送れる語数の上限（打ち間違いの連投を止める）
//   2. データ構造：見出し語がキー＝同じ語は何度でも1件
//   3. ルール側：全体の受付語数が上限に達したら書き込み自体を拒否
import { ref, get, set, runTransaction, serverTimestamp } from 'firebase/database'
import { db, isFirebaseConfigured } from './firebase.js'

const COL = 'wordRequests'
const QUOTA_PATH = 'wordRequestQuota/used'
const REQUEST_WORD = /^[a-z]+(?:[-'][a-z]+)*$/
const REQUEST_SOURCES = new Set(['dictionary-search', 'camera-ocr'])
const MAX_WORD_LENGTH = 64

// アプリ全体で受け付ける語数の上限。database.rules.json の同じ数値と必ず揃える。
export const WORD_REQUEST_TOTAL_LIMIT = 2000

// 自動リクエスト（辞書で見つからなかった語）を、1つの端末が1日に送れる語数。
// みんなで使う受付枠を、打ち間違いの連投で一気に使い切らないための歯止め。
export const WORD_REQUEST_DEVICE_DAILY_LIMIT = 20

// 自動で送るのはこの流入元だけ。写真の読み取りは選んで送るので対象外。
const AUTO_SOURCE = 'dictionary-search'

// 1文字だけの打ちかけを自動で送らないための下限。
const MIN_AUTO_WORD_LENGTH = 2

// 同じ端末から同じ語を何度も送らないための控え。通信前に弾くだけの補助で、
// 本当の重複防止は「見出し語＝キー」というデータ構造側が担う。
const SENT_STORAGE_KEY = 'sa-word-requests'

// 自動リクエストの当日ぶんの数え。{ day, count } を1件だけ持つ。
const DAILY_STORAGE_KEY = 'sa-word-requests-day'

const localStore = () => {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage
  } catch {
    return null
  }
}

function loadSentWords() {
  try {
    const raw = localStore()?.getItem(SENT_STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(list) ? list.filter((w) => typeof w === 'string') : [])
  } catch {
    return new Set()
  }
}

function rememberSentWord(word) {
  try {
    const words = loadSentWords()
    words.add(word)
    // 端末側の控えは最新200語だけ保つ。
    const trimmed = [...words].slice(-200)
    localStore()?.setItem(SENT_STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // 保存できなくても送信自体は成立しているので黙って続ける。
  }
}

// 端末の日付で区切る。時差を持つ端末でも「その端末の今日」で数える。
const dayKey = (now = Date.now()) => {
  const date = new Date(now)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

// 今日その端末が自動で送った語数。読めないときは0（＝送れる側に倒す）。
export function readDeviceDailyCount(now = Date.now()) {
  try {
    const raw = localStore()?.getItem(DAILY_STORAGE_KEY)
    const saved = raw ? JSON.parse(raw) : null
    const count = Number(saved?.count)
    return saved?.day === dayKey(now) && Number.isFinite(count) && count > 0 ? count : 0
  } catch {
    return 0
  }
}

function bumpDeviceDailyCount(now = Date.now()) {
  try {
    const count = readDeviceDailyCount(now) + 1
    localStore()?.setItem(DAILY_STORAGE_KEY, JSON.stringify({ day: dayKey(now), count }))
  } catch {
    // 数えられなくても、全体の上限と見出し語キーの重複防止は効いている。
  }
}

export function normalizeRequestWord(rawWord) {
  const word = String(rawWord ?? '').trim().toLowerCase()
  return word.length >= 1 && word.length <= MAX_WORD_LENGTH && REQUEST_WORD.test(word)
    ? word
    : ''
}

// 受付済み語数を読む。読めないときは null（＝上限判定をあきらめる）。
export async function readWordRequestUsage() {
  if (!isFirebaseConfigured || !db) return null
  try {
    const snapshot = await get(ref(db, QUOTA_PATH))
    const used = Number(snapshot.val())
    return Number.isFinite(used) && used >= 0 ? used : 0
  } catch {
    return null
  }
}

async function bumpUsage() {
  try {
    await runTransaction(ref(db, QUOTA_PATH), (current) => {
      const used = Number.isFinite(current) ? current : 0
      return used >= WORD_REQUEST_TOTAL_LIMIT ? undefined : used + 1
    })
  } catch {
    // 集計だけの失敗は利用者に見せない（本体の1件は登録済み）。
  }
}

// 1語リクエストする。戻り値の status は
//   sent（新規に受け付け） / already（受付済み） / full（全体の上限に到達）
//   limit（この端末の今日ぶんが上限） / invalid（英単語として扱えない）
//   offline（送信できなかった）
export async function requestWord(rawWord, { source = AUTO_SOURCE } = {}) {
  const q = String(rawWord ?? '').trim()
  const word = normalizeRequestWord(q)
  const auto = source === AUTO_SOURCE
  if (!word || !REQUEST_SOURCES.has(source)) return { status: 'invalid', word: '' }
  if (auto && word.length < MIN_AUTO_WORD_LENGTH) return { status: 'invalid', word: '' }
  if (!isFirebaseConfigured || !db) return { status: 'offline', word }
  if (loadSentWords().has(word)) return { status: 'already', word }
  if (auto && readDeviceDailyCount() >= WORD_REQUEST_DEVICE_DAILY_LIMIT) {
    return { status: 'limit', word }
  }

  const used = await readWordRequestUsage()
  if (used !== null && used >= WORD_REQUEST_TOTAL_LIMIT) return { status: 'full', word, used }

  try {
    await set(ref(db, `${COL}/${word}`), { word, q, ts: serverTimestamp(), source })
  } catch {
    // 書き込みが通らない理由は「同じ語が受付済み」か「全体が上限」か。
    // 一覧は公開していないので中身は見分けられないため、上限だけ読み直す。
    const after = await readWordRequestUsage()
    if (after !== null && after >= WORD_REQUEST_TOTAL_LIMIT) return { status: 'full', word, used: after }
    // ここで端末に「送信済み」と控えると、ルールの入れ替わりなどで
    // 一時的に弾かれただけの語を二度と送れなくしてしまうので控えない。
    return { status: 'already', word }
  }
  rememberSentWord(word)
  if (auto) bumpDeviceDailyCount()
  await bumpUsage()
  return { status: 'sent', word }
}

// 複数語をまとめてリクエストする。写真OCRの未登録語をまとめて送るために使う。
// 同じ語は大文字小文字を無視して1件にまとめ、上限に達したらそこで止める。
export async function requestWords(rawWords, { source = 'camera-ocr' } = {}) {
  const unique = new Map()
  for (const rawWord of Array.isArray(rawWords) ? rawWords : []) {
    const q = String(rawWord ?? '').trim()
    const word = normalizeRequestWord(q)
    if (word && !unique.has(word)) unique.set(word, q)
  }
  const result = { sent: 0, already: 0, skipped: 0, words: [], status: 'sent' }
  if (!unique.size) return { ...result, status: 'invalid' }
  if (!isFirebaseConfigured || !db) return { ...result, skipped: unique.size, status: 'offline' }

  for (const [, q] of unique) {
    const one = await requestWord(q, { source })
    if (one.status === 'sent') {
      result.sent += 1
      result.words.push(one.word)
    } else if (one.status === 'already') {
      result.already += 1
      result.words.push(one.word)
    } else if (one.status === 'full' || one.status === 'limit') {
      result.status = one.status
      break
    } else {
      result.skipped += 1
    }
  }
  if (result.status === 'sent' && result.sent === 0 && result.already === 0) {
    result.status = 'offline'
  }
  return result
}
