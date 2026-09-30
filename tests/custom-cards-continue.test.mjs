// 登録したあと、同じ分類で続けて入力できる（依頼台帳 requests/2026-09-30-custom-card-form-followup.json の continue-same-category）。
// 2026-09-30 利用者:「登録すると画面が戻るので、続けて同じカテゴリーで入力できるようにしなさい。」
//
// 新しいカードを登録したら、登録の画面のまま：分類とテンプレートはそのまま、欄は空になり、最初の欄にカーソル。
// 登録したカードの名前と、その分類のカードの枚数を出す。入れる単語帳の選びと、英単語の級・分野は引き継ぐ。
// 登録したあとは「やめる」が「終わる」になり、押すと元の画面へ戻って、登録したカードが並ぶ。
// 5テンプレート × 登録を始める所4つ（自作カードの画面・分類ごと・教科のアプリから・その場で作った新しいカテゴリー）で確かめる。
// 書き換え（元の画面へ戻る）と英和辞書からの登録（辞書へ戻る）は tests/custom-cards-screens.test.mjs。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { CUSTOM_CARD_TEMPLATES, subjectCategoryId } from '../src/lib/customCards.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

let ui
let midterm
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-continue-test' })
  midterm = (await ui.act('saveCustomCategory', { title: '2学期中間英語' })).id
})

after(async () => {
  await ui?.close()
})

// 登録を始める所。open は登録の画面を開き、back は「終わる」で戻る先の見え方（params）。
const START_PLACES = [
  {
    id: 'list',
    label: '自作カードの画面の「カードを作る」',
    async open() {
      await ui.open('customWords', {})
      await ui.page.click('[data-custom-word-add]')
    },
    back: {},
  },
  {
    id: 'category',
    label: '分類ごとの「カードを作る」',
    async open() {
      await ui.open('customWords', {})
      await ui.page.click(`[data-custom-category-create="${midterm}"]`)
    },
    back: {},
  },
  {
    id: 'subject',
    label: '教科のアプリ（社会）から開いた自作カードの「カードを作る」',
    async open() {
      await ui.open('socialHome', {})
      await ui.page.click('[data-custom-cards-entry="social"]')
      await ui.waitScreen('customWords')
      await ui.page.click('[data-custom-word-add]')
    },
    back: { subject: 'social' },
  },
  {
    id: 'new',
    label: '登録の欄でその場で作った新しいカテゴリー',
    async open() {
      await ui.open('customWords', {})
      await ui.page.click('[data-custom-word-add]')
    },
    back: {},
  },
]

// テンプレートの必須の欄に打つ中身（英単語は英字の語と意味）。
function typed(template, place, round) {
  const tag = `${place}${template}${round}`
  return template === 'english'
    ? { word: `cont${place}${round}x`, meanings: `続けて登録した意味${round}` }
    : { front: `続けて${tag}`, back: `続けて登録した${tag}の裏` }
}
const titleOf = (values) => values.word ?? values.front

async function fillRequired(values) {
  for (const [key, value] of Object.entries(values)) await ui.page.fill(`[data-custom-card-input="${key}"]`, value)
}

const categoryTitleOf = async (id) => {
  const { customCategories } = await ui.state(['customCategories'])
  const subjects = { english: '英語', koten: '古典', kanbun: '漢文', math: '数学', social: '社会', science: '理科' }
  return id.startsWith('subject:') ? subjects[id.slice(8)] : customCategories.find((category) => category.id === id)?.title
}

const countIn = async (category) => {
  const { customWords, customCards } = await ui.state(['customWords', 'customCards'])
  return [...customWords, ...customCards].filter((entry) => entry.category === category).length
}

test('5つのテンプレート × 登録を始める所4つ：登録しても登録の画面のまま、同じ分類・テンプレートで次のカードを入れられる', async () => {
  for (const place of START_PLACES) {
    for (const template of CUSTOM_CARD_TEMPLATES) {
      const where = `${place.label}・${template.label}`
      await place.open()
      await ui.page.waitForSelector('[data-custom-card-form]')
      if (place.id === 'new') {
        await ui.page.selectOption('[data-custom-card-category]', '__new-category__')
        await ui.page.fill('[data-custom-card-new-category]', `続けて${template.id}`)
      }
      await ui.page.click(`[data-custom-card-template="${template.id}"]`)
      await ui.page.waitForSelector(`[data-custom-card-template="${template.id}"][aria-checked="true"]`)
      assert.equal((await ui.page.innerText('[data-custom-word-cancel]')).trim(), 'やめる', `${where}：登録する前は「やめる」`)
      if (template.id === 'english') {
        await ui.page.selectOption('[data-custom-card-input="level"]', '3')
        await ui.page.selectOption('[data-custom-card-input="field"]', '科学・技術・健康')
      }
      const book = await ui.page.inputValue('[data-custom-word-book-select]')

      let category = null
      for (const round of [1, 2]) {
        const values = typed(template.id, place.id, round)
        await fillRequired(values)
        await ui.page.click('[data-custom-word-save]')
        await ui.page.waitForFunction((name) => document.querySelector('[data-custom-card-saved-notice]')?.innerText.includes(`「${name}」を登録しました`), titleOf(values))
        const now = await ui.page.inputValue('[data-custom-card-category]')
        if (round === 1) {
          category = now
          if (place.id === 'new') {
            assert.equal(await categoryTitleOf(category), `続けて${template.id}`, `${where}：作ったカテゴリーを選んだまま`)
          } else if (place.id === 'category') {
            assert.equal(category, midterm, `${where}：その分類のまま`)
          } else if (place.id === 'subject') {
            assert.equal(category, subjectCategoryId('social'), `${where}：その教科のまま`)
          }
        }
        assert.equal(now, category, `${where}（${round}枚目）：同じ分類のまま`)
        assert.equal(await ui.page.getAttribute('[data-custom-card-template][aria-checked="true"]', 'data-custom-card-template'), template.id, `${where}：同じテンプレートのまま`)
        // 欄は空になり、最初の欄にカーソル。
        for (const key of Object.keys(values)) assert.equal(await ui.page.inputValue(`[data-custom-card-input="${key}"]`), '', `${where}：${key} は空`)
        const first = template.id === 'english' ? 'word' : 'front'
        assert.equal(await ui.page.evaluate(() => document.activeElement?.getAttribute('data-custom-card-input')), first, `${where}：最初の欄にカーソル`)
        // 登録したカードの名前と、その分類のカードの枚数。
        const count = await countIn(category)
        const notice = await ui.page.innerText('[data-custom-card-saved-notice]')
        assert.ok(notice.includes(`（${await categoryTitleOf(category)}：${count}枚）`), `${where}：枚数 ${notice}`)
        assert.equal((await ui.page.innerText('[data-custom-word-cancel]')).trim(), '終わる', `${where}：登録したら「終わる」`)
        // 入れる単語帳の選びと、英単語の級・分野は引き継ぐ。
        assert.equal(await ui.page.inputValue('[data-custom-word-book-select]'), book, `${where}：入れる単語帳`)
        if (template.id === 'english') {
          assert.equal(await ui.page.inputValue('[data-custom-card-input="level"]'), '3', `${where}：級`)
          assert.equal(await ui.page.inputValue('[data-custom-card-input="field"]'), '科学・技術・健康', `${where}：分野`)
        }
      }
      await ui.checkWidth(`${where}の登録の画面`)

      // 2枚とも、その分類にそのテンプレートで入り、入れる単語帳にも入る。
      const state = await ui.state(['customWords', 'customCards', 'learningNotebook'])
      const saved = template.id === 'english'
        ? state.customWords.filter((word) => [1, 2].some((round) => word.word === typed('english', place.id, round).word))
        : state.customCards.filter((card) => [1, 2].some((round) => card.front === typed(template.id, place.id, round).front))
      assert.equal(saved.length, 2, `${where}：2枚`)
      assert.ok(saved.every((entry) => entry.category === category), `${where}：同じ分類`)
      if (template.id !== 'english') assert.ok(saved.every((entry) => entry.template === template.id), `${where}：同じテンプレート`)
      if (book) {
        const domain = template.id === 'english' ? 'vocab' : 'customCards'
        const refs = state.learningNotebook.sets.find((set) => set.id === book)?.refs ?? []
        assert.ok(saved.every((entry) => refs.includes(`${domain}:${entry.id}`)), `${where}：入れる単語帳に入る`)
      }

      // 「終わる」で元の画面へ戻り、登録したカードが並ぶ。
      await ui.page.click('[data-custom-word-cancel]')
      await ui.page.waitForSelector('[data-custom-words-home]')
      const current = await ui.current()
      assert.deepEqual(current.params, place.back, `${where}：元の画面へ戻る`)
      const block = ui.page.locator(`[data-custom-category="${category}"]`)
      assert.ok((await block.innerText()).includes(`${await countIn(category)}枚`), `${where}：戻った画面に登録したカードの数`)
    }
  }
})

test('入れる単語帳を「入れない」にしたら、続けて登録するカードも入れない', async () => {
  await ui.open('customWords', { form: { template: 'other', category: subjectCategoryId('science') } })
  await ui.page.waitForSelector('[data-custom-card-form]')
  await ui.page.selectOption('[data-custom-word-book-select]', '')
  for (const round of [1, 2]) {
    await ui.page.fill('[data-custom-card-input="front"]', `単語帳に入れない${round}`)
    await ui.page.fill('[data-custom-card-input="back"]', '裏')
    await ui.page.click('[data-custom-word-save]')
    await ui.page.waitForFunction((name) => document.querySelector('[data-custom-card-saved-notice]')?.innerText.includes(name), `単語帳に入れない${round}`)
    assert.equal(await ui.page.inputValue('[data-custom-word-book-select]'), '')
  }
  const state = await ui.state(['customCards', 'learningNotebook'])
  const ids = state.customCards.filter((card) => card.front.startsWith('単語帳に入れない')).map((card) => card.id)
  assert.equal(ids.length, 2)
  assert.ok(state.learningNotebook.sets.every((set) => ids.every((id) => !set.refs.includes(`customCards:${id}`))))
})

test('続けて登録する画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
