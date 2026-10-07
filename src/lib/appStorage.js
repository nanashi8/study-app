// 学習の記録を端末に保存する唯一の部品（ストアの persist の保存先）。
//
// 2026-10-07、英検準1級を1回100枚で暗記している途中から「まだ／覚えた」で次のカードへ進まなくなった。
// 原因は、記録を localStorage（どのブラウザもおよそ5MBまで）の1つのキーへ書いていたこと。記録は1語約350文字で、
// 学んだ項目が増えると上限に届き、localStorage.setItem が QuotaExceededError を投げる。persist は状態を変えた
// 直後に同じ流れで書くので、例外が review() から画面の処理へ伝わり、次のカードへ移る前に止まった。
//
// そこで次のようにする。
//  ・保存先は IndexedDB（容量が大きく、全教材を学んだ記録も入る）。開けない端末では localStorage。
//  ・書き込みはどの失敗でも例外も reject も外へ出さない。記録はメモリに残り、学習は続けられる。
//    失敗したことは saveStatus に置き、画面で知らせる（次に保存できたら消える）。
//  ・前の版が localStorage に残した記録は、起動したときに読み戻して引き継ぐ。IndexedDB へ保存できたら消して容量を空ける。
//  ・読み戻しが終わるまでの書き込み（読み戻す前の空の状態）は捨てる。保存してある記録を空の状態で上書きしない。
//
// 中身は今までと同じ JSON の文字列で持つ（読み戻したときの値が localStorage のころと同じになる）。

export const IDB_NAME = 'eigo-quest-store'
export const IDB_STORE = 'kv'
const IDB_VERSION = 1
// IndexedDB を開くのを待つ時間。返事が無い端末（古い iOS の不具合など）では localStorage に切り替える。
export const IDB_OPEN_TIMEOUT_MS = 4000

// ── 保存の状態（画面の知らせが読む） ─────────────────────────────
let status = Object.freeze({ ok: true, backend: null, reason: null })
const listeners = new Set()

function setStatus(next) {
  if (status.ok === next.ok && status.backend === next.backend && status.reason === next.reason) return
  status = Object.freeze({ ...next })
  for (const listener of listeners) {
    try {
      listener(status)
    } catch {
      // 知らせを受ける側の失敗で保存を止めない。
    }
  }
}

/** いまの保存の状態。ok が false なら、最後の書き込みが保存できなかった（reason にその型）。 */
export const getSaveStatus = () => status
export function subscribeSaveStatus(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** 書き込みの失敗の型。容量超過（quota）・保存先が使えない（unavailable）・開けない（open）・書き込みの失敗（write）。 */
export function saveFailureReason(error, fallback = 'write') {
  const name = String(error?.name ?? '')
  const code = Number(error?.code)
  if (name === 'QuotaExceededError' || name === 'NS_ERROR_DOM_QUOTA_REACHED' || code === 22 || code === 1014) return 'quota'
  return fallback
}

// ── localStorage（IndexedDB が使えない端末と、前の版の記録の読み戻し） ─────────
function localStorageOf(env) {
  try {
    const storage = env.localStorage
    return storage && typeof storage.getItem === 'function' ? storage : null
  } catch {
    // 設定で端末の保存を止めていると、localStorage を読むだけで例外になる。
    return null
  }
}

function readLocal(local, name) {
  if (!local) return null
  try {
    const raw = local.getItem(name)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function removeLocal(local, name) {
  try {
    local?.removeItem(name)
  } catch {
    // 消せなくても記録は IndexedDB にある。次に保存できたときにまた消す。
  }
}

// ── IndexedDB ─────────────────────────────────────────────
function openDatabase(indexedDB, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false
    const finish = (db) => {
      if (settled) {
        // 待ちきれずに localStorage へ切り替えたあとで開けたものは閉じる。
        try {
          db?.close()
        } catch {
          // 閉じられなくてもよい。
        }
        return
      }
      settled = true
      clearTimeout(timer)
      resolve(db)
    }
    const timer = setTimeout(() => finish(null), timeoutMs)
    try {
      const request = indexedDB.open(IDB_NAME, IDB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE)
      }
      request.onsuccess = () => {
        const db = request.result
        // 別のタブが新しい版で開き直すときは、こちらを閉じて邪魔をしない。
        db.onversionchange = () => db.close()
        finish(db)
      }
      request.onerror = () => finish(null)
      request.onblocked = () => {}
    } catch {
      finish(null)
    }
  })
}

function idbGet(db, name) {
  return new Promise((resolve, reject) => {
    try {
      const request = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(name)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    } catch (error) {
      reject(error)
    }
  })
}

function idbPut(db, name, value) {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction(IDB_STORE, 'readwrite')
      transaction.objectStore(IDB_STORE).put(value, name)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error ?? new Error('aborted'))
    } catch (error) {
      reject(error)
    }
  })
}

function idbDelete(db, name) {
  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(IDB_STORE, 'readwrite')
      transaction.objectStore(IDB_STORE).delete(name)
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => resolve()
      transaction.onabort = () => resolve()
    } catch {
      resolve()
    }
  })
}

const parseStored = (raw) => {
  if (raw == null) return null
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * ストアの persist に渡す保存先（zustand の PersistStorage：getItem・setItem・removeItem）。
 * env はテストで差し替える（既定はブラウザの window。window の無い Node では保存しない）。
 * IndexedDB があれば非同期、無ければ localStorage で同期に読み戻す。
 */
export function createAppStorage(
  env = typeof window === 'undefined' ? null : window,
  { openTimeoutMs = IDB_OPEN_TIMEOUT_MS } = {},
) {
  env ??= {}
  const local = localStorageOf(env)
  let indexedDB = null
  try {
    indexedDB = env.indexedDB && typeof env.indexedDB.open === 'function' ? env.indexedDB : null
  } catch {
    indexedDB = null
  }

  // localStorage だけの保存先（IndexedDB の無い端末・開けなかった端末）。
  const writeLocal = (name, value) => {
    if (!local) {
      setStatus({ ok: false, backend: 'none', reason: 'unavailable' })
      return
    }
    try {
      local.setItem(name, JSON.stringify(value))
      setStatus({ ok: true, backend: 'localStorage', reason: null })
    } catch (error) {
      setStatus({ ok: false, backend: 'localStorage', reason: saveFailureReason(error) })
    }
  }

  if (!indexedDB) {
    return {
      backend: local ? 'localStorage' : 'none',
      getItem: (name) => readLocal(local, name),
      setItem: (name, value) => writeLocal(name, value),
      removeItem: (name) => removeLocal(local, name),
    }
  }

  // IndexedDB の保存先。db が null になったら（開けなかった）localStorage へ切り替える。
  let db
  let opening = null
  const open = () => {
    opening ??= openDatabase(indexedDB, openTimeoutMs).then((opened) => {
      db = opened
      return opened
    })
    return opening
  }

  // 読み戻しが終わるまでの書き込みは捨てる（読み戻す前の空の状態で上書きしない）。
  let ready = false
  // 前の版が localStorage に残した記録を読み戻したか。IndexedDB へ保存できたら消す。
  let legacyLeft = false
  // 書き込みは1つの流れにまとめ、続けて来たら最後の状態だけを書く。
  let pending = null
  let writing = false

  const flush = async () => {
    if (writing) return
    writing = true
    try {
      while (pending) {
        const { name, value } = pending
        pending = null
        let text
        try {
          text = JSON.stringify(value)
        } catch {
          setStatus({ ok: false, backend: 'indexedDB', reason: 'write' })
          continue
        }
        const opened = db === undefined ? await open() : db
        if (!opened) {
          // IndexedDB を開けない端末。localStorage に書く（入りきらなければ知らせる）。
          if (!local) {
            setStatus({ ok: false, backend: 'none', reason: 'open' })
            continue
          }
          try {
            local.setItem(name, text)
            setStatus({ ok: true, backend: 'localStorage', reason: null })
          } catch (error) {
            setStatus({ ok: false, backend: 'localStorage', reason: saveFailureReason(error, 'open') })
          }
          continue
        }
        try {
          await idbPut(opened, name, text)
          setStatus({ ok: true, backend: 'indexedDB', reason: null })
          if (legacyLeft) {
            removeLocal(local, name)
            legacyLeft = false
          }
        } catch (error) {
          setStatus({ ok: false, backend: 'indexedDB', reason: saveFailureReason(error) })
        }
      }
    } finally {
      writing = false
    }
  }

  return {
    backend: 'indexedDB',
    getItem: async (name) => {
      try {
        const opened = await open()
        let stored = null
        if (opened) {
          try {
            stored = parseStored(await idbGet(opened, name))
          } catch {
            stored = null
          }
        }
        if (stored) return stored
        // IndexedDB にまだ無い（前の版の記録）か、開けなかった。localStorage の記録を引き継ぐ。
        const legacy = readLocal(local, name)
        if (legacy && opened) {
          // 引き継いだ記録をそのまま IndexedDB へ写し、写せたら localStorage から消して容量を空ける。
          try {
            await idbPut(opened, name, JSON.stringify(legacy))
            removeLocal(local, name)
          } catch {
            // 写せなかったら localStorage に残し、次に保存できたときに消す。
            legacyLeft = true
          }
        }
        return legacy
      } catch {
        return null
      } finally {
        ready = true
      }
    },
    setItem: (name, value) => {
      if (!ready) return undefined
      pending = { name, value }
      // 例外も reject も外へ出さない（flush の中で状態に置く）。
      flush().catch(() => {})
      return undefined
    },
    removeItem: (name) => {
      removeLocal(local, name)
      open().then((opened) => (opened ? idbDelete(opened, name) : null)).catch(() => {})
    },
    // テスト用：書きかけの書き込みが終わるのを待つ。
    settled: async () => {
      while (writing || pending) {
        await new Promise((resolve) => setTimeout(resolve, 5))
      }
    },
  }
}
