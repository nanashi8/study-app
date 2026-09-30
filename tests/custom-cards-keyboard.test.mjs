// キーボードを出したときの自作カードの登録の画面（依頼台帳 requests/2026-09-30-custom-card-form-followup.json の keyboard-no-gap）。
// 2026-09-30 利用者:「入力のためのキーボードを表示すると、やめる・登録する、と、キーボードの間に空白があって、入力部が見づらい。」
//
// 原因：キーボードが出ている間、外枠はページの高さのまま（lib/safeArea.js）。ブラウザがページを下まで寄せると、外枠の下端の
// 「端末の下のふち（ホームバー）の余白」が、足元の欄とキーボードの間に空白として残っていた。
// 今は、キーボードが出ている間は下のふちの余白を 0 にし（data-app-keyboard）、キーボードのすぐ上に置く欄のある画面
// （data-keyboard-actions）では外枠の下端を見えている範囲の下端（キーボードの上端）に合わせる。
//
// このMacには Xcode がなく iPhone のシミュレータは使えない。キーボードは、見えている範囲（visualViewport）だけを
// キーボードの高さ縮めた window を syncSafeArea に渡して作る（ホームバーの余白は --app-safe-bottom を 34px にして作る）。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  APP_FRAME_HEIGHT_VAR,
  APP_KEYBOARD_ATTR,
  isSoftwareKeyboardOpen,
  resolveAppFrameHeight,
  syncSafeArea,
} from '../src/lib/safeArea.js'
import { CUSTOM_CARD_TEMPLATES } from '../src/lib/customCards.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('外枠の高さ：キーボードのすぐ上に置く欄のある画面だけ、外枠の下端をキーボードの上端に合わせる', () => {
  const keyboard = { viewportHeight: 476, layoutHeight: 812, typing: true, scale: 1 }
  // 欄がない画面は、これまでどおりページの高さのまま（打っている欄を見せるのはブラウザ）。
  assert.equal(resolveAppFrameHeight({ ...keyboard, viewportTop: 0 }), 812)
  // 欄がある画面：寄せない・途中まで寄せる・下まで寄せる、どれも見えている範囲の下端。
  assert.equal(resolveAppFrameHeight({ ...keyboard, viewportTop: 0, keyboardActions: true }), 476)
  assert.equal(resolveAppFrameHeight({ ...keyboard, viewportTop: 120, keyboardActions: true }), 596)
  assert.equal(resolveAppFrameHeight({ ...keyboard, viewportTop: 336, keyboardActions: true }), 812)
  // 打っていない（キーボードが閉じる途中）・拡大表示・縮みが小さい（キーボードでない）ときは変えない。
  assert.equal(resolveAppFrameHeight({ ...keyboard, typing: false, keyboardActions: true }), 812)
  assert.equal(resolveAppFrameHeight({ ...keyboard, scale: 2, keyboardActions: true }), 812)
  assert.equal(resolveAppFrameHeight({ viewportHeight: 760, layoutHeight: 812, typing: true, keyboardActions: true }), 812)
  assert.equal(resolveAppFrameHeight({ viewportHeight: 812, layoutHeight: 812, typing: true, keyboardActions: true }), 812)
  // キーボードが出ているとみなすのは、文字を打つ欄にフォーカスがあり、拡大ではなく150px以上縮んだとき。
  assert.equal(isSoftwareKeyboardOpen(keyboard), true)
  assert.equal(isSoftwareKeyboardOpen({ ...keyboard, typing: false }), false)
  assert.equal(isSoftwareKeyboardOpen({ ...keyboard, scale: 1.5 }), false)
  assert.equal(isSoftwareKeyboardOpen({ ...keyboard, viewportHeight: 700 }), false)
})

test('キーボードが出ている間だけ data-app-keyboard を付け、CSS が下のふちの余白を 0 にする。登録の画面の足元の欄は data-keyboard-actions', () => {
  const attributes = new Map()
  const properties = new Map()
  const root = {
    style: { setProperty: (name, value) => properties.set(name, value), removeProperty: (name) => properties.delete(name), getPropertyValue: (name) => properties.get(name) ?? '' },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
  }
  const activeElement = { tagName: 'INPUT', type: 'text' }
  const makeView = (visualViewport, typing) => ({
    innerWidth: 375,
    innerHeight: 812,
    screen: { width: 375, height: 812 },
    navigator: {},
    matchMedia: () => ({ matches: false }),
    visualViewport,
    document: {
      documentElement: root,
      activeElement: typing ? activeElement : null,
      body: { appendChild() {} },
      createElement: () => ({ setAttribute() {}, style: {}, remove() {} }),
      defaultView: { getComputedStyle: () => ({ paddingTop: '0px', paddingBottom: '34px' }) },
      querySelector: () => ({}),
    },
  })
  syncSafeArea(makeView({ height: 476, offsetTop: 0, scale: 1 }, true))
  assert.equal(attributes.get(APP_KEYBOARD_ATTR), 'open')
  assert.equal(properties.get(APP_FRAME_HEIGHT_VAR), '476px')
  syncSafeArea(makeView({ height: 812, offsetTop: 0, scale: 1 }, false))
  assert.equal(attributes.has(APP_KEYBOARD_ATTR), false)
  assert.equal(properties.get(APP_FRAME_HEIGHT_VAR), '812px')

  const css = read('../src/index.css')
  assert.match(css, /:root\[data-app-keyboard='open'\]\s*\{\s*--app-bottom-clearance:\s*0px;\s*\}/)
  const screen = read('../src/screens/CustomWords.jsx')
  assert.match(screen, /data-custom-card-form-actions data-keyboard-actions/)
})

// ── 画面（375px） ─────────────────────────────────────────
const KEYBOARD = 336 // iPhone の日本語キーボード（予測の段つき）と入力補助の段のおよその高さ
const HOME_BAR = 34

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-keyboard-test' })
  // 起動直後の測り直し（0.4秒・1.2秒）が済むのを待つ。
  await ui.page.waitForTimeout(1500)
  await ui.page.evaluate(async ({ homeBar }) => {
    const moduleUrl = (path) => performance.getEntriesByType('resource').map((entry) => entry.name).find((name) => new URL(name).pathname === path)
    window.__safeArea = await import(moduleUrl('/src/lib/safeArea.js'))
    document.documentElement.style.setProperty('--app-safe-bottom', `${homeBar}px`)
  }, { homeBar: HOME_BAR })
})

after(async () => {
  await ui?.close()
})

/**
 * 今フォーカスのある欄で、キーボードを出した状態を作って測る。pan は、ブラウザがページを寄せた量（visualViewport.offsetTop）。
 * 'none' は寄せない、'bottom' は下まで寄せる（欄を足元の欄のすぐ上へ送ってから寄せる。利用者が見た空白の出る状態）。
 */
function measureKeyboard(pan) {
  return ui.page.evaluate(({ pan: mode, keyboard }) => {
    const field = document.activeElement
    const scroller = field.closest('.overflow-y-auto')
    const height = window.innerHeight
    const visibleHeight = height - keyboard
    if (mode === 'bottom') {
      const box = scroller.getBoundingClientRect()
      const rect = field.getBoundingClientRect()
      scroller.scrollTop += rect.bottom - box.bottom
    }
    const offsetTop = mode === 'bottom' ? keyboard : 0
    const bind = (target, value) => (typeof value === 'function' ? value.bind(target) : value)
    const view = new Proxy(window, {
      get: (target, key) => (key === 'visualViewport'
        ? { addEventListener() {}, removeEventListener() {}, height: visibleHeight, offsetTop, scale: 1 }
        : bind(target, Reflect.get(target, key))),
    })
    window.__safeArea.syncSafeArea(view)
    const bar = document.querySelector('[data-keyboard-actions]').getBoundingClientRect()
    const clearance = document.querySelector('[data-app-bottom-clearance]').getBoundingClientRect().height
    const rect = field.getBoundingClientRect()
    const box = scroller.getBoundingClientRect()
    const visibleTop = offsetTop
    const visibleBottom = offsetTop + visibleHeight
    const result = {
      keyboard: document.documentElement.getAttribute('data-app-keyboard'),
      gap: Math.round(visibleBottom - bar.bottom),
      clearance: Math.round(clearance),
      // 打っている欄：本文の見えている所に入り、足元の欄の下に入らず、見えている範囲（キーボードの上）の中にある。
      fieldVisible: rect.top >= Math.max(box.top, visibleTop) - 1 && rect.bottom <= Math.min(box.bottom, bar.top, visibleBottom) + 1,
      where: `${Math.round(rect.top)}〜${Math.round(rect.bottom)}（本文 ${Math.round(box.top)}〜${Math.round(box.bottom)}・見える ${visibleTop}〜${visibleBottom}・欄 ${Math.round(bar.top)}〜${Math.round(bar.bottom)}）`,
    }
    // キーボードを閉じる：元の配置（下のふちの余白あり）に戻る。
    field.blur()
    window.__safeArea.syncSafeArea(window)
    const closedBar = document.querySelector('[data-keyboard-actions]').getBoundingClientRect()
    result.closedClearance = Math.round(document.querySelector('[data-app-bottom-clearance]').getBoundingClientRect().height)
    result.closedGap = Math.round(height - closedBar.bottom)
    result.closedKeyboard = document.documentElement.getAttribute('data-app-keyboard')
    return result
  }, { pan, keyboard: KEYBOARD })
}

// 登録の欄の中の、文字を打つ欄（1行・複数行）。行を足して書く欄は、行を出してから数える。
const textFields = () => ui.page.evaluate(() => [...document.querySelectorAll('[data-custom-card-form] input, [data-custom-card-form] textarea')]
  .filter((element) => !['checkbox', 'radio', 'file', 'range'].includes(element.type))
  .map((element, index) => {
    element.setAttribute('data-keyboard-test-field', String(index))
    return element.getAttribute('data-custom-card-input') ?? element.getAttribute('data-custom-card-new-category') ?? element.getAttribute('aria-label') ?? `欄${index}`
  }))

async function checkField(label, index) {
  for (const pan of ['none', 'bottom']) {
    await ui.page.focus(`[data-keyboard-test-field="${index}"]`)
    const result = await measureKeyboard(pan)
    const where = `${label}（${pan === 'none' ? '寄せない' : '下まで寄せる'}）`
    assert.equal(result.keyboard, 'open', `${where}：キーボードが出ている`)
    assert.equal(result.gap, 0, `${where}：足元の欄とキーボードの間の空白 ${result.gap}px`)
    assert.equal(result.clearance, 0, `${where}：下のふちの余白`)
    assert.ok(result.fieldVisible, `${where}：打っている欄が見えない ${result.where}`)
    assert.equal(result.closedKeyboard, null, `${where}：閉じたら外す`)
    assert.equal(result.closedClearance, HOME_BAR, `${where}：閉じたら下のふちの余白が戻る`)
    assert.equal(result.closedGap, HOME_BAR, `${where}：閉じたら足元の欄はホームバーの上`)
  }
}

test('登録の画面の5つのテンプレートの文字を打つ全ての欄で、キーボードのすぐ上に「やめる・登録する」が来て、打っている欄が見える', async () => {
  const counts = {}
  for (const template of CUSTOM_CARD_TEMPLATES) {
    await ui.open('customWords', { form: { template: template.id, category: 'subject:social' } })
    await ui.page.waitForSelector('[data-custom-card-form]')
    if (template.id === 'english') {
      // 行を足して書く欄（ほかの意味・派生語・類義語・反意語・つづりが似た語・熟語）に1行ずつ出す。
      for (const button of await ui.page.locator('[data-custom-card-list-add]').all()) await button.click()
    }
    const labels = await textFields()
    counts[template.id] = labels.length
    for (const [index, label] of labels.entries()) await checkField(`${template.label}の${label}`, index)
  }
  // 数：英単語は1行の欄・複数行の欄7つと、足した行の欄11（ほかの意味は品詞を選ぶので意味だけ）。
  assert.deepEqual(counts, { english: 18, koten: 8, kanbun: 6, other: 3, qa: 3 })

  // 新しいカテゴリーの名前の欄。
  await ui.open('customWords', { form: { template: 'other', category: 'subject:social' } })
  await ui.page.waitForSelector('[data-custom-card-form]')
  await ui.page.selectOption('[data-custom-card-category]', '__new-category__')
  await textFields()
  const target = await ui.page.getAttribute('[data-custom-card-new-category]', 'data-keyboard-test-field')
  assert.ok(target, '新しいカテゴリーの名前の欄')
  await checkField('新しいカテゴリーの名前', Number(target))
})

test('画面に重ねるシート（カテゴリーの設定の名前の欄）も、キーボードの上に下のふちの余白を残さない', async () => {
  await ui.open('customWords', {})
  await ui.page.click('[data-custom-category-add]')
  await ui.page.waitForSelector('[data-custom-category-sheet="new"]')
  for (const pan of [0, KEYBOARD]) {
    await ui.page.focus('[data-custom-category-title]')
    const result = await ui.page.evaluate(({ offsetTop, keyboard }) => {
      const visibleHeight = window.innerHeight - keyboard
      const bind = (target, value) => (typeof value === 'function' ? value.bind(target) : value)
      const view = new Proxy(window, {
        get: (target, key) => (key === 'visualViewport'
          ? { addEventListener() {}, removeEventListener() {}, height: visibleHeight, offsetTop, scale: 1 }
          : bind(target, Reflect.get(target, key))),
      })
      window.__safeArea.syncSafeArea(view)
      const layer = document.querySelector('[data-sheet-layer]').getBoundingClientRect()
      const scroll = getComputedStyle(document.querySelector('[data-sheet-layer] [data-sheet-scroll-area]'))
      const field = document.activeElement.getBoundingClientRect()
      const out = {
        layerBottom: Math.round(layer.bottom),
        visibleBottom: offsetTop + visibleHeight,
        paddingBottom: scroll.paddingBottom,
        fieldVisible: field.top >= offsetTop && field.bottom <= offsetTop + visibleHeight,
      }
      document.activeElement.blur()
      window.__safeArea.syncSafeArea(window)
      out.closedPaddingBottom = getComputedStyle(document.querySelector('[data-sheet-layer] [data-sheet-scroll-area]')).paddingBottom
      return out
    }, { offsetTop: pan, keyboard: KEYBOARD })
    assert.equal(result.layerBottom, result.visibleBottom, `寄せ ${pan}px：シートはキーボードの上端まで`)
    assert.equal(result.paddingBottom, '24px', `寄せ ${pan}px：シートの下に下のふちの余白を足さない`)
    assert.ok(result.fieldVisible, `寄せ ${pan}px：名前の欄が見える`)
    assert.equal(result.closedPaddingBottom, `${24 + HOME_BAR}px`, `寄せ ${pan}px：閉じたら下のふちの余白が戻る`)
  }
  await ui.page.keyboard.press('Escape')
})
