import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  SAFE_AREA_BOTTOM_VAR,
  SAFE_AREA_TOP_VAR,
  resolveSafeAreaTop,
  statusBarFallback,
  syncSafeArea,
} from '../src/lib/safeArea.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('セーフエリアの実測値があるときは、そのまま使う', () => {
  assert.equal(resolveSafeAreaTop({ measuredTop: 59, standalone: true }), 59)
  assert.equal(resolveSafeAreaTop({ measuredTop: 47, standalone: false }), 47)
  assert.equal(resolveSafeAreaTop({ measuredTop: 20, standalone: true, viewportHeight: 800 }), 20)
})

test('ホーム画面アプリで実測0のときは、時刻表示ぶんを補う', () => {
  // iPhone 15 Pro 相当。画面の高さをまるごと使っている＝時刻表示の下まで描いている。
  const top = resolveSafeAreaTop({
    measuredTop: 0,
    standalone: true,
    viewportWidth: 393,
    viewportHeight: 852,
    screenWidth: 393,
    screenHeight: 852,
  })
  assert.equal(top, 59)

  // ノッチのない機種は時刻表示も低い。
  assert.equal(statusBarFallback({ screenWidth: 375, screenHeight: 667 }), 20)
  assert.equal(statusBarFallback({ screenWidth: 393, screenHeight: 852 }), 59)
})

test('アドレスバーがある表示や横向きでは、余分な余白を足さない', () => {
  // ブラウザ表示（アドレスバーぶん画面より低い）。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 0,
    standalone: false,
    viewportWidth: 393,
    viewportHeight: 720,
    screenWidth: 393,
    screenHeight: 852,
  }), 0)

  // ホーム画面アプリでも、iOSが時刻表示ぶんを引いてくれている場合。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 0,
    standalone: true,
    viewportWidth: 393,
    viewportHeight: 793,
    screenWidth: 393,
    screenHeight: 852,
  }), 0)

  // 横向きは時刻表示が消える。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 0,
    standalone: true,
    viewportWidth: 852,
    viewportHeight: 393,
    screenWidth: 393,
    screenHeight: 852,
  }), 0)
})

test('数pxのずれや小さすぎる実測値でも、時刻表示ぶんを確保する', () => {
  // 画面の高さとほぼ同じだが数pxずれる端末（文字サイズ設定など）。
  // 「ぴったり一致」しか認めないと余白が付かず、戻る・メニューが時刻に潜っていた。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 0,
    standalone: true,
    viewportWidth: 393,
    viewportHeight: 844,
    screenWidth: 393,
    screenHeight: 852,
  }), 59)

  // 実測が時刻表示より小さい値で返る端末は、不足ぶんまで引き上げる。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 20,
    standalone: true,
    viewportWidth: 393,
    viewportHeight: 852,
    screenWidth: 393,
    screenHeight: 852,
  }), 59)

  // 逆に実測のほうが大きいときは、その値を尊重する（勝手に縮めない）。
  assert.equal(resolveSafeAreaTop({
    measuredTop: 62,
    standalone: true,
    viewportWidth: 393,
    viewportHeight: 852,
    screenWidth: 393,
    screenHeight: 852,
  }), 62)
})

test('JSが動く前でも、ホーム画面アプリには最低限の上の余白がある', () => {
  const css = read('src/index.css')
  assert.match(css, /@media \(display-mode: standalone\)[^{]*\{\s*:root\s*\{\s*--app-safe-top:\s*max\(env\(safe-area-inset-top, 0px\), 20px\)/)

  // 確定値は JS が常に書き込む（保険のCSSを上書きできるようにする）。
  const lib = read('src/lib/safeArea.js')
  assert.match(lib, /root\.style\.setProperty\(SAFE_AREA_TOP_VAR/)
  assert.doesNotMatch(lib, /removeProperty\(SAFE_AREA_TOP_VAR/)

  // 他アプリから戻ったときも測り直す。
  assert.match(lib, /addEventListener\('pageshow'/)
  assert.match(lib, /addEventListener\('visibilitychange'/)
})

// ホーム画面アプリの iPhone を模した最小の window/document。
function fakeView({ envTop = 0, standalone = true, innerHeight = 852, screenHeight = 852 }) {
  const properties = new Map()
  const documentElement = {
    style: {
      setProperty: (name, value) => properties.set(name, value),
      removeProperty: (name) => properties.delete(name),
    },
  }
  const view = {
    innerWidth: 393,
    innerHeight,
    screen: { width: 393, height: screenHeight },
    navigator: { standalone },
    matchMedia: () => ({ matches: false }),
    document: {
      documentElement,
      body: { appendChild() {}, },
      createElement: () => ({ setAttribute() {}, style: {}, remove() {} }),
      defaultView: null,
    },
  }
  view.document.defaultView = {
    getComputedStyle: () => ({ paddingTop: `${envTop}px`, paddingBottom: '0px' }),
  }
  return { view, properties }
}

test('実測が0のホーム画面アプリでは、上の余白を確定値で書き込む', () => {
  const { view, properties } = fakeView({ envTop: 0 })
  const result = syncSafeArea(view)
  assert.equal(result.top, 59)
  assert.equal(properties.get(SAFE_AREA_TOP_VAR), '59px')
})

test('iOSが時刻表示ぶんを確保している場合は、余白を足さない', () => {
  const { view, properties } = fakeView({ envTop: 0, innerHeight: 793 })
  const result = syncSafeArea(view)
  assert.equal(result.top, 0)
  assert.equal(properties.get(SAFE_AREA_TOP_VAR), '0px')
})

test('ふちの余白は共通変数だけで組み立て、上下それぞれ一か所が受け持つ', () => {
  assert.equal(SAFE_AREA_TOP_VAR, '--app-safe-top')
  assert.equal(SAFE_AREA_BOTTOM_VAR, '--app-safe-bottom')

  const css = read('src/index.css')
  assert.match(css, /--app-safe-top:\s*env\(safe-area-inset-top, 0px\)/)
  assert.match(css, /--app-safe-bottom:\s*env\(safe-area-inset-bottom, 0px\)/)
  assert.match(css, /\.study-app-content\s*\{\s*padding-bottom:\s*var\(--app-safe-bottom\)/)

  // 上のふちは共通の上部バーだけが確保する（画面ごとの二重余白を作らない）。
  const shell = read('src/components/AppShell.jsx')
  assert.match(shell, /pt-\[calc\(var\(--app-safe-top\)\+0\.5rem\)\]/)

  // 起動時に実測して補正を始める。
  assert.match(read('src/main.jsx'), /startSafeAreaSync\(\)/)
})

test('画面側は env(safe-area-inset-*) を直接使わない', () => {
  const offenders = []
  for (const path of [
    'src/index.css',
    'src/components/AppShell.jsx',
    'src/components/Sheet.jsx',
    'src/screens/Portal.jsx',
    'src/screens/KotenList.jsx',
    'src/screens/KotenGrammar.jsx',
    'src/screens/KanbunHome.jsx',
    'src/screens/MathMap.jsx',
    'src/screens/WritingPlay.jsx',
    'src/screens/WordDetail.jsx',
  ]) {
    const source = read(path)
    // 変数の定義そのもの（:root）だけは env(...) を使う。
    const withoutRoot = source.replace(/--app-safe-(top|bottom):[^;]*;/g, '')
    if (withoutRoot.includes('env(safe-area-inset')) offenders.push(path)
  }
  assert.deepEqual(offenders, [])
})

test('画面いっぱいに固定する操作バーだけは、下のふち余白を自分で持つ', () => {
  for (const path of [
    'src/screens/WordDetail.jsx',
    'src/screens/WritingPlay.jsx',
    'src/screens/MathIntro.jsx',
  ]) {
    const source = read(path)
    for (const line of source.split('\n')) {
      if (!line.includes('fixed inset-x-0 bottom-0')) continue
      assert.match(line, /var\(--app-safe-bottom\)/, `${path}: 固定バーに下のふち余白がありません`)
    }
  }
})
