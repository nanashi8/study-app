// 語源カードの一覧を実ブラウザ（375px）で下までスクロールすると、「次の◯枚を表示」を押さずにカードが増える
// （依頼台帳 requests/2026-10-24-load-more-on-scroll.json）。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { startCustomCardBrowser } from './custom-cards-browser.mjs'

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-load-more-test' })
})
after(async () => {
  await ui?.close()
})

const cardCount = () => ui.page.evaluate(() => document.querySelectorAll('.study-app-content [data-return-row]').length)

test('下までスクロールすると、押さなくても次の枚数が並ぶ', async () => {
  await ui.open('roots', {})
  await ui.page.waitForSelector('[data-load-more]')
  const first = await cardCount()
  assert.equal(first, 24)
  // 指で一覧を下まで送る（ボタンは押さない）。
  for (let step = 0; step < 12; step += 1) {
    await ui.page.mouse.move(187, 400)
    await ui.page.mouse.wheel(0, 1500)
    await ui.settle()
  }
  await ui.page.waitForFunction((count) => document.querySelectorAll('.study-app-content [data-return-row]').length > count, first, { timeout: 10_000 })
  const after = await cardCount()
  assert.ok(after >= 48, `スクロールで ${first}枚 → ${after}枚`)
  const params = (await ui.current()).params
  assert.equal(params.visible, after, '並べた数は画面の状態に残る（戻ったときに同じ数で開く）')
  await ui.checkWidth('語源カードの一覧')
})

test('ボタンは残り、押しても足せる', async () => {
  await ui.open('roots', {})
  await ui.page.waitForSelector('[data-load-more]')
  // 一番上にいる間は足さない。
  assert.equal(await cardCount(), 24)
  await ui.page.evaluate(() => document.querySelector('[data-load-more]').click())
  await ui.page.waitForFunction(() => document.querySelectorAll('.study-app-content [data-return-row]').length >= 48)
})

test('375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
