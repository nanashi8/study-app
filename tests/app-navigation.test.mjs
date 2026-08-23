// 画面の行き来の回帰テスト。
// どの画面からでも、自分のアプリのホームと入口へ必ず帰れること。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  APP_HOMES,
  PORTAL_HOME,
  appHomeForScreen,
  fallbackDestination,
  isAppHomeScreen,
} from '../src/lib/appHome.js'
import {
  RETIRED_ETYMOLOGY_SCREENS,
  learnerDestination,
} from '../src/lib/learnerVisibility.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const ROUTED_SCREENS = (() => {
  const source = read('src/App.jsx')
  const block = /const SCREENS = \{([\s\S]*?)\n\}/.exec(source)?.[1] ?? ''
  return [...block.matchAll(/^\s{2}([A-Za-z]+):/gm)].map((match) => match[1])
})()

// どのアプリにも属さない共通画面。入口（スタディアプリ）へ戻す。
const SHARED_SCREENS = new Set(['portal', 'login', 'settings', 'progress', 'myLearning'])

test('ルーティングされた全画面に、帰る先が決まっている', () => {
  assert.ok(ROUTED_SCREENS.length >= 60, `画面が${ROUTED_SCREENS.length}件しか読めていない`)
  const mapped = new Set(APP_HOMES.flatMap((home) => home.screens))
  const missing = ROUTED_SCREENS.filter(
    (screen) => !mapped.has(screen) && !SHARED_SCREENS.has(screen),
  )
  assert.deepEqual(missing, [], '所属アプリが決まっていない画面がある')
})

test('対応表に、存在しない画面が混ざっていない', () => {
  const routed = new Set(ROUTED_SCREENS)
  for (const home of APP_HOMES) {
    for (const screen of home.screens) {
      assert.ok(routed.has(screen), `${screen} は画面として存在しない`)
    }
    assert.ok(routed.has(home.screen), `${home.label} のホーム ${home.screen} が無い`)
  }
})

test('どの画面からも、行き止まりにならない戻り先がある', () => {
  for (const screen of ROUTED_SCREENS) {
    if (screen === 'portal') {
      assert.equal(fallbackDestination(screen), null)
      continue
    }
    const destination = fallbackDestination(screen)
    assert.ok(destination, `${screen} の戻り先が無い`)
    assert.notEqual(destination, screen, `${screen} が自分自身へ戻ろうとしている`)
  }
})

test('アプリの中の画面は、そのアプリのホームへ帰る', () => {
  assert.equal(appHomeForScreen('roots').screen, 'home')
  assert.equal(appHomeForScreen('etymologyPack').label, '英語アプリ')
  assert.equal(appHomeForScreen('kotenQuiz').screen, 'kotenList')
  assert.equal(appHomeForScreen('kanbunStudy').screen, 'kanbunHome')
  assert.equal(appHomeForScreen('mathSolve').screen, 'mathMap')
  assert.equal(appHomeForScreen('literatureReader').screen, 'literatureLibrary')
  assert.equal(appHomeForScreen('settings').screen, PORTAL_HOME.screen)
  // ホームにいるときは入口へ戻す
  for (const home of APP_HOMES) {
    assert.ok(isAppHomeScreen(home.screen))
    assert.equal(fallbackDestination(home.screen), 'portal')
  }
})

test('履歴が無い画面の戻るは、そのアプリのホームへ行く', () => {
  const original = useStore.getState()
  try {
    for (const [screen, expected] of [
      ['etymologyPack', 'home'],
      ['roots', 'home'],
      ['kotenQuiz', 'kotenList'],
      ['kanbunStudy', 'kanbunHome'],
      ['mathSolve', 'mathMap'],
      ['home', 'portal'],
    ]) {
      useStore.setState({ screen, params: {}, stack: [] })
      useStore.getState().back()
      assert.equal(useStore.getState().screen, expected, `${screen} の戻る`)

      useStore.setState({ screen, params: {}, stack: [] })
      useStore.getState().globalBack()
      assert.equal(useStore.getState().screen, expected, `${screen} の共通バーの戻る`)
    }
  } finally {
    useStore.setState(original, true)
  }
})

test('廃止した語源専用暗記・2択画面は語源トップへ戻す', () => {
  assert.deepEqual(RETIRED_ETYMOLOGY_SCREENS, ['etymologyStudy', 'etymologyQuiz'])
  for (const screen of RETIRED_ETYMOLOGY_SCREENS) {
    assert.deepEqual(learnerDestination(screen, { packIds: ['legacy'] }), {
      screen: 'roots',
      params: {},
    })
  }
})

test('アプリのホームへ移る操作は履歴を残さない', () => {
  const original = useStore.getState()
  try {
    useStore.setState({
      screen: 'etymologyPack',
      params: {},
      stack: [{ screen: 'home', params: {} }, { screen: 'roots', params: {} }],
    })
    useStore.getState().goAppHome()
    assert.equal(useStore.getState().screen, 'home')
    assert.deepEqual(useStore.getState().stack, [])

    useStore.getState().goHomeScreen('kotenList')
    assert.equal(useStore.getState().screen, 'kotenList')
    assert.deepEqual(useStore.getState().stack, [])
  } finally {
    useStore.setState(original, true)
  }
})

test('共通バーに、いまのアプリのホームへ行くボタンがある', () => {
  const shell = read('src/components/AppShell.jsx')
  assert.match(shell, /data-global-home-button/)
  assert.match(shell, /appHomeForScreen/)
  assert.match(shell, /goAppHome/)
  // 学習中は確認をはさみ、確認後も同じ行き先へ進む
  assert.match(shell, /requiresProgressSaveConfirmation\(screen, home\.screen\)/)
  assert.match(shell, /openSpeechSettings\(\{ type: 'navigate'/)
})

test('入口へ移るときは履歴を積まない', () => {
  for (const path of [
    'src/App.jsx',
    'src/screens/MathMap.jsx',
    'src/screens/KotenList.jsx',
    'src/screens/KanbunHome.jsx',
  ]) {
    assert.doesNotMatch(read(path), /navigate\('portal'\)/, `${path} が入口を履歴に積んでいる`)
  }
})
