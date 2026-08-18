import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'
import { startSafeAreaSync } from './lib/safeArea.js'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { isChunkLoadError, reloadFresh } from './lib/appRecovery.js'

// 上下のふち（時刻表示・ホームバー）に隠れないよう、実測して余白を合わせる。
startSafeAreaSync()

// 起動そのものに失敗したとき（古いキャッシュで JS が欠けている等）も真っ白にしない。
window.addEventListener('unhandledrejection', (event) => {
  if (isChunkLoadError(event.reason)) reloadFresh()
})

const root = document.getElementById('root')

try {
  createRoot(root).render(
    <StrictMode>
      {/* アプリ全体の最後の受け皿。ここまで来た例外も画面として出す。 */}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
} catch (error) {
  console.error('アプリを起動できませんでした', error)
  if (!isChunkLoadError(error) || !reloadFresh()) {
    root.textContent = 'アプリを起動できませんでした。ページを再読み込みしてください。'
  }
}
