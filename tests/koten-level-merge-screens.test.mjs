// 古典単語の最難関を難関に統合したことを、画面で確かめるテスト（requests/2026-10-02-koten-level-merge.json の screens）。
//
// 375px の Chromium で、最難関を出していた画面をすべて開く：
//   古典単語のトップ（見出しの説明・「レベルから選ぶ」）、古典アプリのホームの「学年・目標から選ぶ」、
//   古典単語の辞書ページ（移した51語すべて）、古典文法の文法辞典と体系表・文法の暗記カード（移した2項目）。
// どの画面にも「最難関」が出ず、移した語・項目が「難関大学」として出て、横にはみ出さないことを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_GRAMMAR_SYSTEMS } from '../src/data/koten-grammar-systems.js'
import { KOTEN_CURRICULUM_PATHS } from '../src/data/koten-curriculum.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'
import { MOVED_GRAMMAR_IDS, MOVED_WORD_IDS } from './koten-level-merge-ids.mjs'

let ui

before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-koten-level-merge-test' })
})

after(async () => {
  await ui?.close()
})

const noElite = async (where) => {
  assert.doesNotMatch(await ui.mainText(), /最難関/u, `${where}: 「最難関」が出ている`)
  await ui.checkWidth(where)
}

test('古典単語のトップ：見出しの説明は「中学古典〜難関大学」、「レベルから選ぶ」は4枚で難関は158語、最難関は出ない', async () => {
  await ui.open('kotenList', { view: 'vocab' })
  await ui.page.waitForSelector('[data-koten-vocab-top]')
  const text = await ui.mainText()
  assert.match(text, /中学古典〜難関大学の重要語を暗記・テスト/u)
  const levels = await ui.page.$$eval('[data-koten-level]', (cards) => cards.map((card) => [card.dataset.kotenLevel, card.innerText]))
  assert.deepEqual(levels.map(([id]) => id), ['middle', 'basic', 'standard', 'advanced'])
  const counts = { middle: 58, basic: 179, standard: 217, advanced: 158 }
  for (const [id, cardText] of levels) assert.match(cardText, new RegExp(`${counts[id]}語`, 'u'), `${id} の語数`)
  assert.match(levels.at(-1)[1], /難関大学/u)
  await noElite('古典単語のトップ')
})

test('古典アプリのホーム：「学年・目標から選ぶ」は中学・基礎・標準・難関の4つで、難関コースは古典単語612語・古典文法130項目・古典常識56テーマ', async () => {
  await ui.open('kotenList', { view: 'home' })
  await ui.page.waitForSelector('[data-koten-courses]')
  const chips = ui.page.locator('[data-koten-courses] button[aria-pressed]')
  assert.deepEqual(await chips.allInnerTexts(), ['中学', '基礎', '標準', '難関'])
  for (const [index, course] of KOTEN_CURRICULUM_PATHS.entries()) {
    await chips.nth(index).click()
    await ui.settle()
    const text = await ui.page.locator('[data-koten-courses]').innerText()
    assert.match(text, new RegExp(course.label, 'u'), `${course.shortLabel}: コース名`)
    assert.match(text, new RegExp(`古典単語\\s*${course.vocabIds.length}語`, 'u'), `${course.shortLabel}: 古典単語`)
    assert.match(text, new RegExp(`古典文法\\s*${course.grammarIds.length}項目`, 'u'), `${course.shortLabel}: 古典文法`)
    assert.match(text, new RegExp(`古典常識\\s*${course.cultureIds.length}テーマ`, 'u'), `${course.shortLabel}: 古典常識`)
    await noElite(`古典アプリのホーム（${course.shortLabel}）`)
  }
  assert.deepEqual(
    [KOTEN_CURRICULUM_PATHS.at(-1).vocabIds.length, KOTEN_CURRICULUM_PATHS.at(-1).grammarIds.length, KOTEN_CURRICULUM_PATHS.at(-1).cultureIds.length],
    [612, 130, 56],
  )
})

test('古典単語の辞書ページ：最難関から移した51語すべてが「難関大学」と出る', async () => {
  assert.equal(MOVED_WORD_IDS.length, 51)
  for (const id of MOVED_WORD_IDS) {
    const word = KOTEN_WORDS.find((entry) => entry.id === id)
    await ui.open('kotenWordDetail', { id })
    await ui.page.waitForSelector(`[data-koten-word-detail="${id}"]`)
    const chips = await ui.page.$$eval(`[data-koten-word-detail="${id}"] span`, (spans) => spans.map((span) => span.innerText.trim()))
    assert.ok(chips.includes('難関大学'), `${id} ${word.word}: 重要度が「難関大学」でない`)
    await noElite(`辞書ページ ${id} ${word.word}`)
  }
})

test('古典文法：最難関から移した2項目は、文法辞典・体系表・暗記カードの重要度の印が「難関大学」', async () => {
  for (const id of MOVED_GRAMMAR_IDS) {
    const item = KOTEN_GRAMMAR.find((entry) => entry.id === id)
    const chip = async (where) => {
      const found = await ui.page.$$eval(
        `[data-koten-grammar-level]`,
        (elements) => elements.map((element) => [element.dataset.kotenGrammarLevel, element.innerText.trim()]),
      )
      assert.deepEqual(found, [['advanced', '難関大学']], `${where} ${id}: 重要度の印`)
      await noElite(`${where} ${id}`)
    }

    await ui.open('kotenGrammar', { view: 'list', query: item.title, openId: id })
    await ui.page.waitForSelector(`[data-koten-grammar-detail="${id}"]`)
    await chip('文法辞典')

    const system = KOTEN_GRAMMAR_SYSTEMS.find((entry) => entry.rows.some((row) => row.ids?.includes(id)))
    const rowIndex = system.rows.findIndex((row) => row.ids?.includes(id))
    await ui.open('kotenGrammar', { view: 'systems', system: system.id, systemRow: `${system.id}:${rowIndex}` })
    await ui.page.waitForSelector(`[data-koten-grammar-detail="${id}"]`)
    await chip(`体系表「${system.title}」`)

    await ui.open('kotenGrammarStudy', { ids: [id], title: item.title })
    await ui.page.waitForSelector('[data-koten-grammar-level]')
    await chip('暗記カード')
  }
})

test('375px で、開いた画面のどれも横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
