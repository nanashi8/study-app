import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'
import { startSafeAreaSync } from './lib/safeArea.js'

// 上下のふち（時刻表示・ホームバー）に隠れないよう、実測して余白を合わせる。
startSafeAreaSync()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
