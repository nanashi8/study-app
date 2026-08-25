import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  SAFE_AREA_BOTTOM_VAR,
  SAFE_AREA_TOP_VAR,
  VISUAL_VIEWPORT_HEIGHT_VAR,
  VISUAL_VIEWPORT_TOP_VAR,
  resolveSafeAreaTop,
  statusBarFallback,
  syncSafeArea,
} from '../src/lib/safeArea.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const repoRoot = fileURLToPath(new URL('../', import.meta.url))

function sourceFilesUnder(relativeDir) {
  const files = []
  const visit = (absoluteDir) => {
    for (const entry of readdirSync(absoluteDir, { withFileTypes: true })) {
      const absolutePath = join(absoluteDir, entry.name)
      if (entry.isDirectory()) visit(absolutePath)
      else if (/\.(?:jsx|js)$/.test(entry.name)) {
        files.push({
          path: absolutePath.slice(repoRoot.length),
          source: readFileSync(absolutePath, 'utf8'),
        })
      }
    }
  }
  visit(join(repoRoot, relativeDir))
  return files
}

const sourceFiles = sourceFilesUnder('src')

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

test('ブラウザの見えている範囲を実測し、メニューを上下のコントロール内へ固定する', () => {
  const { view, properties } = fakeView({ envTop: 0, innerHeight: 720 })
  view.visualViewport = {
    height: 640,
    offsetTop: 48,
  }
  const result = syncSafeArea(view)
  assert.equal(result.viewportHeight, 640)
  assert.equal(result.viewportTop, 48)
  assert.equal(properties.get(VISUAL_VIEWPORT_HEIGHT_VAR), '640px')
  assert.equal(properties.get(VISUAL_VIEWPORT_TOP_VAR), '48px')

  const css = read('src/index.css')
  const shell = read('src/components/AppShell.jsx')
  const sheet = read('src/components/Sheet.jsx')
  const menu = read('src/components/SpeechSettings.jsx')
  const safeArea = read('src/lib/safeArea.js')
  assert.match(css, /:where\(\.study-app-surface\)\s*\{\s*height:\s*var\(--app-visual-viewport-height, 100svh\)/)
  assert.doesNotMatch(shell, /(?:min-)?h-\[100svh\]/)
  assert.match(css, /\.app-viewport-overlay\s*\{[^}]*top:\s*var\(--app-visual-viewport-top[^}]*height:\s*var\(--app-visual-viewport-height/s)
  assert.match(sheet, /app-viewport-overlay fixed inset-x-0/)
  assert.match(menu, /maxH="calc\(var\(--app-visual-viewport-height\) - 0\.5rem\)"/)
  assert.match(safeArea, /visualViewport\?\.addEventListener\('scroll'/)
  assert.match(safeArea, /visualViewport\?\.removeEventListener\('scroll'/)
  assert.doesNotMatch(menu, /maxH="92vh"/)
})

test('ふちの余白は共通変数だけで組み立て、上下それぞれ一か所が受け持つ', () => {
  assert.equal(SAFE_AREA_TOP_VAR, '--app-safe-top')
  assert.equal(SAFE_AREA_BOTTOM_VAR, '--app-safe-bottom')

  const css = read('src/index.css')
  assert.match(css, /--app-safe-top:\s*env\(safe-area-inset-top, 0px\)/)
  assert.match(css, /--app-safe-bottom:\s*env\(safe-area-inset-bottom, 0px\)/)
  assert.match(css, /--app-bottom-clearance:\s*max\([^;]*var\(--app-safe-bottom\)[^;]*var\(--app-ios-browser-bottom-clearance\)/s)
  assert.match(css, /\.study-app-bottom-clearance\s*\{\s*height:\s*var\(--app-bottom-clearance\)/)

  // 上は共通バー、下はflex末尾の共通退避領域が一度だけ受け持つ。
  const shell = read('src/components/AppShell.jsx')
  assert.match(shell, /pt-\[calc\(var\(--app-safe-top\)\+0\.5rem\)\]/)
  assert.match(shell, /<GlobalSpeechConsole \/>[\s\S]*data-app-bottom-clearance/)

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

test('viewportへ固定する操作バー5件はSafari退避を自分で受け持つ', () => {
  const fixedBars = sourceFiles.flatMap(({ path, source }) => (
    source.split('\n')
      .filter((line) => line.includes('fixed inset-x-0') && !line.includes('app-viewport-overlay'))
      .map((line) => ({ path, line }))
  ))

  assert.equal(fixedBars.length, 5, '固定下端バーの全件数が変わったら監査対象を更新してください')
  for (const { path, line } of fixedBars) {
    assert.match(line, /app-fixed-bottom-actions/, `${path}: 固定バーに共通Safari退避がありません`)
    assert.doesNotMatch(line, /\bbottom-0\b/, `${path}: bottom-0が共通offsetを上書きします`)
  }

  const css = read('src/index.css')
  assert.match(css, /\.app-fixed-bottom-actions\s*\{[^}]*bottom:\s*var\(--app-ios-browser-bottom-clearance\)[^}]*padding-bottom:\s*calc\(1rem \+ var\(--app-safe-bottom\)\)/s)
})

test('下端に接する操作欄21実装・追従欄2件・読み上げ欄を共通退避領域が守る', () => {
  const footerImplementations = sourceFiles.flatMap(({ path, source }) => (
    source.split('\n')
      .filter((line) => line.includes('shrink-0') && line.includes('border-t'))
      .map((line) => ({ path, line }))
  ))
  const stickyBottomControls = sourceFiles.flatMap(({ path, source }) => (
    source.split('\n')
      .filter((line) => /\bsticky\b[^\n]*\bbottom-/.test(line))
      .map((line) => ({ path, line }))
  ))
  const cardFooterUses = sourceFiles.reduce(
    (count, { source }) => count + (source.match(/<CardStudyFooter\b/g)?.length ?? 0),
    0,
  )

  assert.equal(footerImplementations.length, 21)
  assert.equal(cardFooterUses, 6)
  assert.equal(stickyBottomControls.length, 2)
  assert.match(read('src/components/SpeechConsole.jsx'), /data-speech-console/)

  const shell = read('src/components/AppShell.jsx')
  assert.match(shell, /study-app-content[^\n]*flex-1/)
  assert.match(shell, /<GlobalSpeechConsole \/>[\s\S]*study-app-bottom-clearance/)

  const result = read('src/screens/SessionResult.jsx')
  assert.match(result, /復習する/)
  assert.match(result, /vocabContinuation\.label/)
  const vocabCompletion = read('src/components/VocabCompletionReport.jsx')
  assert.match(vocabCompletion, /data-vocab-completion-actions/)
  assert.match(vocabCompletion, /app-fixed-bottom-actions fixed inset-x-0/)
})

test('下端固定オーバーレイ2件のスクロール末尾もSafari退避を持つ', () => {
  const bottomOverlays = sourceFiles.flatMap(({ path, source }) => (
    source.split('\n')
      .filter((line) => line.includes('items-end') && (
        line.includes('fixed inset-0') || line.includes('app-viewport-overlay')
      ))
      .map(() => ({ path, source }))
  ))

  assert.equal(bottomOverlays.length, 2, '下端固定オーバーレイの全件数が変わったら監査対象を更新してください')
  for (const { path, source } of bottomOverlays) {
    assert.match(source, /var\(--app-bottom-clearance\)/, `${path}: オーバーレイ末尾にSafari退避がありません`)
  }
})

test('単語カードの判定ボタンはiPhone Safariの下部UIより上へ退避する', () => {
  const css = read('src/index.css')
  const study = read('src/screens/VocabStudy.jsx')
  const shell = read('src/components/AppShell.jsx')

  assert.match(css, /--app-ios-browser-bottom-clearance:\s*0px/)
  assert.match(css, /@supports \(-webkit-touch-callout:\s*none\)/)
  assert.match(css, /@media \(display-mode:\s*browser\) and \(hover:\s*none\) and \(pointer:\s*coarse\) and \(max-width:\s*48rem\)/)
  assert.match(css, /--app-ios-browser-bottom-clearance:\s*5\.5rem/)
  assert.match(css, /--app-bottom-clearance:\s*max\([^;]*var\(--app-safe-bottom\)[^;]*var\(--app-ios-browser-bottom-clearance\)/s)

  assert.match(study, /className="vocab-study-actions[^\"]*"/)
  assert.match(study, /data-vocab-study-actions/)
  assert.match(shell, /data-app-bottom-clearance/)
})
