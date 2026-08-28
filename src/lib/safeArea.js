// ── 画面のふちの余白（セーフエリア）─────────────────────────────────────
// ホーム画面へ登録して使うと、iPhone ではアプリが画面いっぱいに描かれる。
// このとき本来はセーフエリアの実測値が時刻表示ぶんの高さを返すはずだが、
// 0 のまま返る端末・OS があり、上部の「戻る」「メニュー」が時刻に隠れてしまう。
//
// そこで CSS からは常に var(--app-safe-top) / var(--app-safe-bottom) を使い、
// 画面の高さと実測値を突き合わせて、足りないぶんをここで補って書き込む。
// この JS が動く前でも隠れないよう、CSS 側にも最低限の保険を置いてある。
export const SAFE_AREA_TOP_VAR = '--app-safe-top'
export const SAFE_AREA_BOTTOM_VAR = '--app-safe-bottom'
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--app-visual-viewport-height'
export const VISUAL_VIEWPORT_TOP_VAR = '--app-visual-viewport-top'

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

// 上のふち幅を決める。
// 実測（env）が正しく返る端末はそれをそのまま使う。ホーム画面アプリでは
// 0 を返したり、時刻表示より小さい値を返す端末があるので、そのときだけ補う。
export function resolveSafeAreaTop({
  measuredTop = 0,
  standalone = false,
  viewportWidth = 0,
  viewportHeight = 0,
  screenWidth = 0,
  screenHeight = 0,
} = {}) {
  // ブラウザのアドレスバーがある表示では、時刻表示の下に潜り込むことはない。
  if (!standalone) return measuredTop
  // 横向きの iPhone は時刻表示自体が消えるので、余白を足すと逆に間延びする。
  if (viewportWidth > viewportHeight) return measuredTop
  // 画面の大きさが分からないときは判断材料がないので、実測を信じる。
  if (!screenHeight || !viewportHeight) return measuredTop
  // iOS が時刻表示ぶんを先に差し引いてくれている場合は、こちらで足さない。
  // 差が時刻表示1本ぶんに満たないなら「画面いっぱいに描いている」とみなす。
  // （文字サイズ設定などで数pxずれる端末があるため、ぴったり一致は求めない）
  const reserved = screenHeight - viewportHeight
  if (reserved >= PLAIN_STATUS_BAR) return measuredTop
  return Math.max(measuredTop, statusBarFallback({ screenWidth, screenHeight }))
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
  // 決めた値は常に書き込む。CSS 側はこの JS が動くまでの保険として
  // ホーム画面アプリに最低限の余白を持たせてあるので、こちらが確定値で上書きする。
  const root = doc.documentElement
  root.style.setProperty(SAFE_AREA_TOP_VAR, `${Math.round(top)}px`)
  const viewportHeight = Number(view.visualViewport?.height) || Number(view.innerHeight) || 0
  const viewportTop = Number(view.visualViewport?.offsetTop) || 0
  if (viewportHeight > 0) {
    root.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${Math.round(viewportHeight)}px`)
  }
  root.style.setProperty(VISUAL_VIEWPORT_TOP_VAR, `${Math.max(0, Math.round(viewportTop))}px`)
  return { measured, top, viewportHeight, viewportTop }
}

export function startSafeAreaSync(view = globalThis) {
  if (!view?.document) return () => {}
  const doc = view.document
  const run = () => syncSafeArea(view)
  run()
  // 画面の向き・表示モードが変わると、時刻表示の扱いも変わる。
  view.addEventListener('resize', run)
  view.addEventListener('orientationchange', run)
  view.visualViewport?.addEventListener('resize', run)
  view.visualViewport?.addEventListener('scroll', run)
  // ホーム画面アプリは他のアプリから戻ったときに再表示されるだけで、
  // resize が来ないことがある。復帰のたびに測り直して余白を合わせ直す。
  view.addEventListener('pageshow', run)
  doc.addEventListener('visibilitychange', run)
  // 起動直後はまだ最終的な大きさが決まっていないことがある。
  // 1フレーム後・0.4秒後・1.2秒後に測り直して、確定した値へ追従する。
  const timers = [
    view.setTimeout(run, 0),
    view.setTimeout(run, 400),
    view.setTimeout(run, 1200),
  ]
  return () => {
    timers.forEach((timer) => view.clearTimeout(timer))
    view.removeEventListener('resize', run)
    view.removeEventListener('orientationchange', run)
    view.visualViewport?.removeEventListener('resize', run)
    view.visualViewport?.removeEventListener('scroll', run)
    view.removeEventListener('pageshow', run)
    doc.removeEventListener('visibilitychange', run)
  }
}
