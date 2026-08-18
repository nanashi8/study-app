// ── 画面のふちの余白（セーフエリア）─────────────────────────────────────
// ホーム画面へ登録して使うと、iPhone ではアプリが画面いっぱいに描かれる。
// このとき本来はセーフエリアの実測値が時刻表示ぶんの高さを返すはずだが、
// 0 のまま返る端末・OS があり、上部の「戻る」「メニュー」が時刻に隠れてしまう。
//
// そこで CSS からは常に var(--app-safe-top) / var(--app-safe-bottom) を使い、
// 実測が 0 なのに画面いっぱいを占めているときだけ、ここで不足分を補う。
export const SAFE_AREA_TOP_VAR = '--app-safe-top'
export const SAFE_AREA_BOTTOM_VAR = '--app-safe-bottom'

// 時刻表示（ステータスバー）の高さ。ノッチ・Dynamic Island のある機種は高い。
const NOTCHED_STATUS_BAR = 59
const PLAIN_STATUS_BAR = 20

export function statusBarFallback({ screenWidth = 0, screenHeight = 0 } = {}) {
  const shortSide = Math.min(screenWidth, screenHeight)
  const longSide = Math.max(screenWidth, screenHeight)
  if (!shortSide || !longSide) return NOTCHED_STATUS_BAR
  // ノッチ・Dynamic Island のある機種は縦横比がおよそ2以上になる。
  return longSide / shortSide >= 1.9 ? NOTCHED_STATUS_BAR : PLAIN_STATUS_BAR
}

// 上のふち幅を決める。実測できていればそれをそのまま使う。
export function resolveSafeAreaTop({
  measuredTop = 0,
  standalone = false,
  viewportWidth = 0,
  viewportHeight = 0,
  screenWidth = 0,
  screenHeight = 0,
} = {}) {
  if (measuredTop > 0) return measuredTop
  // ブラウザのアドレスバーがある表示では、時刻表示の下に潜り込むことはない。
  if (!standalone) return 0
  // 横向きの iPhone は時刻表示自体が消えるので、余白を足すと逆に間延びする。
  if (viewportWidth > viewportHeight) return 0
  // 画面の高さぶんまるごと使えている＝時刻表示の下まで描いている状態。
  const coversScreen = screenHeight > 0 && viewportHeight >= screenHeight - 2
  if (!coversScreen) return 0
  return statusBarFallback({ screenWidth, screenHeight })
}

function measureEnvInsets(doc) {
  const probe = doc.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:0',
    'height:0',
    'visibility:hidden',
    'pointer-events:none',
    'padding-top:env(safe-area-inset-top, 0px)',
    'padding-bottom:env(safe-area-inset-bottom, 0px)',
  ].join(';')
  doc.body.appendChild(probe)
  const style = doc.defaultView.getComputedStyle(probe)
  const insets = {
    top: Number.parseFloat(style.paddingTop) || 0,
    bottom: Number.parseFloat(style.paddingBottom) || 0,
  }
  probe.remove()
  return insets
}

function isStandalone(view) {
  if (view.navigator?.standalone === true) return true
  return view.matchMedia?.('(display-mode: standalone)')?.matches === true
    || view.matchMedia?.('(display-mode: fullscreen)')?.matches === true
    || view.matchMedia?.('(display-mode: minimal-ui)')?.matches === true
}

// 実測して、足りないぶんだけ CSS 変数を上書きする。
// 足りているときは変数を外し、CSS 側の env(...) をそのまま生かす。
export function syncSafeArea(view = globalThis) {
  const doc = view?.document
  if (!doc?.body) return null
  const measured = measureEnvInsets(doc)
  const top = resolveSafeAreaTop({
    measuredTop: measured.top,
    standalone: isStandalone(view),
    viewportWidth: view.innerWidth ?? 0,
    viewportHeight: view.innerHeight ?? 0,
    screenWidth: view.screen?.width ?? 0,
    screenHeight: view.screen?.height ?? 0,
  })
  const root = doc.documentElement
  if (top > measured.top) root.style.setProperty(SAFE_AREA_TOP_VAR, `${Math.round(top)}px`)
  else root.style.removeProperty(SAFE_AREA_TOP_VAR)
  return { measured, top }
}

export function startSafeAreaSync(view = globalThis) {
  if (!view?.document) return () => {}
  const run = () => syncSafeArea(view)
  run()
  // 画面の向き・表示モードが変わると、時刻表示の扱いも変わる。
  view.addEventListener('resize', run)
  view.addEventListener('orientationchange', run)
  view.visualViewport?.addEventListener('resize', run)
  // 起動直後はまだ最終的な大きさが決まっていないことがあるので、一度だけ測り直す。
  const timer = view.setTimeout(run, 400)
  return () => {
    view.clearTimeout(timer)
    view.removeEventListener('resize', run)
    view.removeEventListener('orientationchange', run)
    view.visualViewport?.removeEventListener('resize', run)
  }
}
