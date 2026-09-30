// 自作カードのセクション（依頼台帳 requests/2026-09-30-custom-card-templates.json の card-section）。
// 2026-09-30 利用者:「カード自作のセクションを作るか？」
// スタディアプリのホームのタイル「自作カード」と、メニューの区切り「カード自作」から、教科・カテゴリーの一覧（自作カードの画面）を開く。
// ホームの表示の設定（並べ替え・表示しない）にも出る。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { CONTENTS, DEFAULT_CONTENT_ORDER } from '../src/data/contents.js'
import { APP_MENU_SECTIONS } from '../src/lib/appMenu.js'
import { appHomeForScreen } from '../src/lib/appHome.js'
import { normalizeHidden, normalizeOrder } from '../src/store/useStore.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

test('スタディアプリのホームに「自作カード」のタイルがあり、以前の並びの保存にも後ろへ足される', () => {
  const tile = CONTENTS.find((content) => content.id === 'custom-cards')
  assert.deepEqual([tile.title, tile.screen, tile.status], ['自作カード', 'customWords', 'available'])
  assert.equal(DEFAULT_CONTENT_ORDER.at(-1), 'custom-cards')
  // 以前の並び（自作カードのない保存）には、いちばん後ろへ足す。表示しない設定にも入れられる。
  assert.deepEqual(
    normalizeOrder(['science-quest', 'eigo-quest', 'koten-quest', 'kanbun-quest', 'literature-listening', 'math-quest', 'social-quest']).at(-1),
    'custom-cards',
  )
  assert.deepEqual(normalizeHidden(['custom-cards', 'unknown']), ['custom-cards'])
  // ホームから開くと、どの教科にも属さない（入口のスタディアプリ）。
  assert.equal(appHomeForScreen('customWords', {}).screen, 'portal')
})

test('メニューに区切り「カード自作」があり、「自作カード」の行はそこだけにある', () => {
  const cards = APP_MENU_SECTIONS.find((section) => section.id === 'cards')
  assert.equal(cards.label, 'カード自作')
  assert.deepEqual(cards.items.map((item) => [item.screen, item.label]), [['customWords', '自作カード']])
  const everywhere = APP_MENU_SECTIONS.flatMap((section) => section.items.filter((item) => item.screen === 'customWords').map(() => section.id))
  assert.deepEqual(everywhere, ['cards'])
  // 区切りは「学習サポート」と「保存・記録」の間。
  const ids = APP_MENU_SECTIONS.map((section) => section.id)
  assert.equal(ids.indexOf('cards'), ids.indexOf('support') + 1)
  assert.equal(ids.indexOf('records'), ids.indexOf('cards') + 1)
})

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-section-test' })
})

after(async () => {
  await ui?.close()
})

test('ホームのタイル・メニューの行から自作カードを開き、ホームの表示の設定に「自作カード」が並ぶ', async () => {
  await ui.open('portal')
  const tile = ui.page.locator('.study-app-content button', { hasText: '自作カード' }).first()
  await tile.waitFor()
  await ui.checkWidth('スタディアプリのホーム')
  await tile.click()
  await ui.waitScreen('customWords')
  assert.equal(await ui.topBarLabel(), 'スタディアプリ')
  assert.ok((await ui.mainText()).includes('カードを作る'))

  await ui.open('portal')
  await ui.page.evaluate(() => window.__customTest.store.getState().openSpeechSettings())
  const section = ui.page.locator('[data-menu-section="cards"]')
  await section.waitFor()
  assert.ok((await section.innerText()).includes('カード自作'))
  await section.locator('[data-menu-destination="customWords"]').click()
  await ui.waitScreen('customWords')

  await ui.page.evaluate(() => window.__customTest.store.getState().openSpeechSettings())
  await ui.page.click('[data-menu-settings-entry]')
  // 設定の「ホームの表示」を開く（畳んである）。
  await ui.page.click('[data-settings-section="ホームの表示"] summary')
  await ui.page.getByRole('button', { name: '自作カードを非表示にする' }).waitFor()
  await ui.page.getByRole('button', { name: '自作カードを非表示にする' }).click()
  const { portalHidden } = await ui.state(['portalHidden'])
  assert.ok(portalHidden.includes('custom-cards'), '表示しない設定')
  await ui.page.getByRole('button', { name: '自作カードを表示する' }).click()
  await ui.page.evaluate(() => window.__customTest.store.getState().closeSpeechSettings())
})

test('セクションの画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
