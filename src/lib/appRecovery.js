// 真っ白（ホワイトアウト）からの復帰まわりの共通処理。
//
// 背景：GitHub Pages は index.html を max-age=600 で配信し、画面ごとの JS は
// ハッシュ付きファイル名で毎ビルド差し替わる。古い index.html を掴んだままの
// 端末は、消えた JS を読みに行って 404（HTML）を受け取り、動的 import が失敗する。
// React.lazy はその失敗を描画中の例外として投げるため、境界が無いと画面全体が
// 消えて真っ白になる。ここではその判定と、1セッション1回だけの取り直しを扱う。

// index.html の復旧スクリプトと同じキー。読み込みが成功すると向こうで消される。
const RECOVERY_KEY = 'sa-recovered'
// 取り直しても直らないとき（本当に壊れたデプロイ・オフライン）に再読込を繰り返さない上限。
const RECOVERY_COUNT_KEY = 'sa-recover-count'
const MAX_RECOVERIES = 2

// 動的 import（画面チャンク）の読み込み失敗かどうか。
// ブラウザごとに文言が違うので、代表的なパターンを広めに拾う。
export function isChunkLoadError(error) {
  const message = String(error?.message ?? error ?? '')
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Unable to preload CSS/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    // 404 が HTML で返ると「JS ではない MIME」エラーになる。
    /expected a JavaScript(?:-or-Wasm)? module/i.test(message) ||
    /MIME type of "text\/html"/i.test(message)
  )
}

// キャッシュされた古い HTML を避けて取り直す。無限ループ防止に1セッション1回だけ。
// 取り直せた（=これから再読込する）なら true。
export function reloadFresh() {
  try {
    if (sessionStorage.getItem(RECOVERY_KEY)) return false
    const tried = Number(sessionStorage.getItem(RECOVERY_COUNT_KEY) ?? 0)
    if (tried >= MAX_RECOVERIES) return false
    sessionStorage.setItem(RECOVERY_COUNT_KEY, String(tried + 1))
    sessionStorage.setItem(RECOVERY_KEY, '1')
  } catch {
    // プライベートモード等で sessionStorage が使えないときは素直に諦める。
    return false
  }
  location.replace(`${location.pathname}?r=${Date.now()}${location.hash}`)
  return true
}

// 手動の「再読み込み」ボタン用：ガードを無視して必ず取り直す。
export function forceReloadFresh() {
  try {
    sessionStorage.removeItem(RECOVERY_KEY)
    sessionStorage.removeItem(RECOVERY_COUNT_KEY)
  } catch {
    // 何もしない
  }
  location.replace(`${location.pathname}?r=${Date.now()}${location.hash}`)
}

// 画面チャンクの読み込みを1回だけ再試行する。
// 一時的な通信断はこれで直り、ビルド差し替えによる 404 は失敗のまま境界へ渡る。
export function importWithRetry(loader) {
  return loader().catch((error) => {
    if (!isChunkLoadError(error)) throw error
    return new Promise((resolve) => setTimeout(resolve, 600)).then(() => loader())
  })
}
