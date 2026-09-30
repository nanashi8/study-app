// 既存の教科に登録した自作カードを、その教科のアプリに出す（依頼台帳 requests/2026-09-30-custom-card-templates.json の subjects）。
// 利用者：「教科を既存で実装されている教科で登録して、その内容に追加表示できるようにしたり」。
// 教科＝英語・古典・漢文・数学・社会・理科のアプリ。どのテンプレートのカードも、その教科のアプリのホームの「自作カード」に数が出て、
// 押すとその教科の自作カード（一覧・暗記・テスト・登録）が開く。上部のバーはその教科のアプリを示す。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import {
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECTS,
  customCategoryGroups,
  customEntryCountForSubject,
  normalizeCustomCard,
  subjectCategoryId,
} from '../src/lib/customCards.js'
import { normalizeCustomWord } from '../src/lib/customWords.js'
import { customCardInput, customWordInput } from '../src/lib/customEntryForm.js'
import { entryValues, startCustomCardBrowser } from './custom-cards-browser.mjs'

// 教科ごと・テンプレートごとに1枚ずつ（英単語は辞書に無いつづり）。
const valuesFor = (subject, template) => (template === 'english'
  ? entryValues({ front: `${subject}word`, back: `${subject}の英単語の意味` })
  : entryValues({ front: `${subject}の${template}の表`, back: `${subject}の${template}の裏`, note: '解説' }))

test('6教科×5テンプレート：どのテンプレートのカードも、選んだ教科に入り、その教科のアプリの数に入る', () => {
  const words = []
  const cards = []
  for (const subject of CUSTOM_SUBJECTS) {
    for (const template of CUSTOM_CARD_TEMPLATES) {
      const category = subjectCategoryId(subject.id)
      if (template.id === 'english') words.push(normalizeCustomWord(customWordInput(valuesFor(subject.id, template.id), category)))
      else cards.push(normalizeCustomCard(customCardInput(template.id, valuesFor(subject.id, template.id), category)))
    }
  }
  const categories = [{ id: 'cat-linked', title: '期末の範囲', subject: 'science' }]
  cards.push(normalizeCustomCard({ template: 'other', category: 'cat-linked', front: '表', back: '裏' }))
  const library = { words, cards, categories }
  for (const subject of CUSTOM_SUBJECTS) {
    const groups = customCategoryGroups(library, { subject: subject.id })
    assert.equal(groups[0].category.id, subjectCategoryId(subject.id), `${subject.label}：教科の分類が先頭`)
    assert.equal(groups[0].words.length, 1, `${subject.label}：英単語のカード`)
    assert.deepEqual(groups[0].cards.map((card) => card.template), ['koten', 'kanbun', 'other', 'qa'], `${subject.label}：ほかの4つ`)
    // 「表示する教科」に選んだカテゴリーも、その教科のアプリに出る。
    const linked = subject.id === 'science' ? 1 : 0
    assert.equal(groups.length, 1 + linked, `${subject.label}：出る分類`)
    assert.equal(customEntryCountForSubject(library, subject.id), 5 + linked, `${subject.label}：アプリに出す数`)
  }
})

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-subjects-test' })
  // 6教科×5テンプレートのカードと、理科に表示するカテゴリーのカード。
  for (const subject of CUSTOM_SUBJECTS) {
    for (const template of CUSTOM_CARD_TEMPLATES) {
      const result = await ui.act('saveCustomEntry', { template: template.id, category: subjectCategoryId(subject.id), values: valuesFor(subject.id, template.id) })
      assert.equal(result.status, 'saved', `${subject.id}/${template.id}`)
    }
  }
  const linked = await ui.act('saveCustomCategory', { title: '期末の範囲', subject: 'science', template: 'other' })
  await ui.act('saveCustomEntry', { template: 'other', category: linked.id, values: entryValues({ front: '光合成', back: '植物が光を使って養分をつくるはたらき' }) })
})

after(async () => {
  await ui?.close()
})

test('6教科のアプリのホームに「自作カード」と枚数が出て、押すとその教科の自作カードが開き、上部のバーがその教科のアプリを示す', async () => {
  for (const subject of CUSTOM_SUBJECTS) {
    const expected = subject.id === 'science' ? 6 : 5
    await ui.open(subject.appScreen, {})
    const entry = ui.page.locator(`[data-custom-cards-entry="${subject.id}"]`)
    await entry.waitFor()
    assert.ok((await entry.innerText()).includes(`${expected}枚`), `${subject.label}のホーム：${expected}枚`)
    await ui.checkWidth(`${subject.appLabel}のホーム`)
    await entry.click()
    await ui.waitScreen('customWords')
    const state = await ui.current()
    assert.equal(state.params.subject, subject.id, `${subject.label}：その教科の自作カード`)
    assert.equal(await ui.topBarLabel(), subject.appLabel, `${subject.label}：上部のバー`)
    const text = await ui.mainText()
    assert.ok(text.includes(`${subject.label}の自作カード`))
    // 一覧のまとまりには枚数だけを出す。カードの中身は「カードを見る」で開いた一覧で確かめる。
    assert.ok(await ui.page.locator(`[data-custom-category="${subjectCategoryId(subject.id)}"]`).count(), `${subject.label}の分類`)
    if (subject.id === 'science') assert.ok(text.includes('期末の範囲'), '理科に表示するカテゴリー')
    await ui.checkWidth(`${subject.label}の自作カード`)

    // カードを見る：5つのテンプレートのカードが並ぶ。
    await ui.page.click(`[data-custom-category-open="${subjectCategoryId(subject.id)}"]`)
    await ui.page.waitForSelector('[data-custom-entry-list]')
    const templates = await ui.page.locator('[data-custom-entry-template]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-custom-entry-template')))
    assert.deepEqual([...templates].sort(), CUSTOM_CARD_TEMPLATES.map((template) => template.id).sort(), `${subject.label}：5つのテンプレートのカード`)
    const list = await ui.mainText()
    for (const template of CUSTOM_CARD_TEMPLATES) assert.ok(list.includes(valuesFor(subject.id, template.id).front), `${subject.label}：${template.label}のカード`)
    await ui.checkWidth(`${subject.label}のカードの一覧`)
  }
})

test('教科の自作カードから、英単語のカードは英単語の暗記・テスト、ほかのカードは自作カードの暗記・テストが開き、上部のバーはその教科のアプリ', async () => {
  const library = await ui.state(['customWords', 'customCards'])
  for (const subject of CUSTOM_SUBJECTS) {
    const category = subjectCategoryId(subject.id)
    const cardIds = library.customCards.filter((card) => card.category === category).map((card) => card.id)
    const wordIds = library.customWords.filter((word) => word.category === category).map((word) => word.id)
    for (const [kind, mode, screen] of [['card', 'study', 'customCardStudy'], ['card', 'quiz', 'customCardQuiz'], ['word', 'study', 'vocabStudy'], ['word', 'quiz', 'vocabQuiz']]) {
      await ui.open('customWords', { subject: subject.id })
      const block = ui.page.locator(`[data-custom-category="${category}"]`)
      await block.locator(mode === 'study' ? `[data-custom-study="${kind}"]` : `[data-custom-quiz="${kind}"]`).click()
      await ui.waitScreen(screen)
      const state = await ui.current()
      if (kind === 'card') {
        assert.deepEqual([...state.params.ids].sort(), [...cardIds].sort(), `${subject.label}：${screen} のカード`)
        assert.equal(state.params.subject, subject.id)
        assert.equal(await ui.topBarLabel(), subject.appLabel, `${subject.label}：${screen} の上部のバー`)
        await ui.page.waitForSelector(mode === 'study' ? '[data-custom-card]' : '[data-custom-card-quiz-question]')
      } else {
        assert.deepEqual(state.params.source.ids, wordIds, `${subject.label}：${screen} の英単語のカード`)
      }
      await ui.checkWidth(`${subject.label}の${screen}`)
    }
  }
})

test('教科の自作カードから「カードを作る」と、その教科を選んだ状態で、教科に合ったテンプレートから登録を始める', async () => {
  for (const subject of CUSTOM_SUBJECTS) {
    await ui.open('customWords', { subject: subject.id })
    await ui.page.click('[data-custom-word-add]')
    await ui.page.waitForSelector('[data-custom-card-form]')
    assert.equal(await ui.page.inputValue('[data-custom-card-category]'), subjectCategoryId(subject.id), `${subject.label}：分類`)
    const checked = await ui.page.getAttribute('[data-custom-card-template][aria-checked="true"]', 'data-custom-card-template')
    assert.equal(checked, subject.template, `${subject.label}：最初のテンプレート`)
    await ui.checkWidth(`${subject.label}の登録欄`)
  }
})

test('教科のアプリの画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
