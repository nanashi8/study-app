// 自作カードの編集を 375px の幅で実際に操作する（依頼台帳 requests/2026-09-30-custom-card-form-followup.json の
// edit-mode・move-cards・merge-cards・merge-categories・delete-selected・edit-screen-verified）。
// 2026-09-30 利用者:「自作カードを編集したり、別のカードに移動したり、カード同士を統合できるように編集機能も実装しなさい。」
//   一覧の「編集」→ カードを押して選ぶ → 書き換える（1枚）・別の分類へ移す・1枚に統合する（2枚以上）・削除。
//   カテゴリーの設定の「ほかの分類にまとめる」。計算とストアは tests/custom-cards-edit.test.mjs。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { CUSTOM_SUBJECTS, subjectCategoryId } from '../src/lib/customCards.js'
import { entryValues, startCustomCardBrowser } from './custom-cards-browser.mjs'

const SOCIAL = subjectCategoryId('social')
let ui
const ids = {}

before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-edit-test' })
  const save = async (key, template, values) => {
    const result = await ui.act('saveCustomEntry', { template, category: SOCIAL, values: entryValues(values) })
    assert.equal(result.status, 'saved', key)
    ids[key] = result.id
  }
  await save('fan1', 'other', { front: '扇状地', back: '扇の形の土地', note: '果樹園に使われる' })
  await save('fan2', 'other', { front: '扇状地', back: '川が山地から平地へ出る所にできた土地' })
  await save('delta', 'other', { front: '三角州', back: '河口にできる低く平らな土地' })
  await save('qa', 'qa', { front: '日本でいちばん長い川は？', back: '信濃川' })
  await save('adj', 'english', { front: 'popular', back: '人気のある', posId: '形' })
  await save('noun', 'english', { front: 'popular', back: '人気者', posId: '名' })
  // 残すカードでない方に記録と単語帳のメモを付けておく（統合で残すカードへ寄る）。
  await ui.act('reviewCustomCard', ids.fan2, 'remembered')
  await ui.page.evaluate((cardId) => {
    const state = window.__customTest.store.getState()
    state.setNotebookSetItem(state.learningNotebook.sets[0].id, 'customCards', cardId, true)
    state.updateNotebookItem('customCards', cardId, { note: '統合するカードのメモ' })
  }, ids.fan2)
})

after(async () => {
  await ui?.close()
})

// 同じ見え方を開き直しても画面は作り直されない（しぼり込み・編集の状態が残る）ので、入口を挟んで開く。
const openSocial = async () => {
  await ui.open('portal', {})
  await ui.open('customWords', { category: SOCIAL })
  await ui.page.waitForSelector('[data-custom-entry-list]')
}

const startEditing = async () => {
  await ui.page.click('[data-custom-edit-toggle]')
  await ui.page.waitForSelector('[data-custom-edit-bar]')
}

const select = async (id) => {
  await ui.page.click(`[data-custom-entry-select="${id}"]`)
  await ui.page.waitForSelector(`[data-custom-entry-select="${id}"][aria-checked="true"]`)
}

const notice = () => ui.page.innerText('[data-custom-edit-notice]')

test('一覧の「編集」でカードを選ぶ：枚数と操作の欄が出て、1枚なら書き換える、2枚以上なら統合できる。終わると元の一覧', async () => {
  await openSocial()
  await startEditing()
  assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), 'カードを押して選んでください')
  const disabled = async () => ui.page.locator('[data-custom-edit-action]').evaluateAll((buttons) => Object.fromEntries(buttons.map((button) => [button.getAttribute('data-custom-edit-action'), button.disabled])))
  assert.deepEqual(await disabled(), { edit: true, move: true, merge: true, delete: true })
  await select(ids.fan1)
  assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), '1枚を選んでいます')
  assert.deepEqual(await disabled(), { edit: false, move: false, merge: true, delete: false })
  await select(ids.fan2)
  assert.deepEqual(await disabled(), { edit: true, move: false, merge: false, delete: false })
  // 全部選ぶ・選ぶのをやめる。
  await ui.page.click('[data-custom-edit-all]')
  assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), '6枚を選んでいます')
  await ui.page.click('[data-custom-edit-all]')
  assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), 'カードを押して選んでください')
  // しぼり込みをしているときは、見えているカードだけを全部選ぶ。
  await ui.page.fill('[data-custom-category-search]', '扇状地')
  await ui.page.click('[data-custom-edit-all]')
  assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), '2枚を選んでいます')
  await ui.checkWidth('編集で選ぶ')
  // 終わると、元の一覧（カードの下に単語帳・書き換える・削除）。
  await ui.page.click('[data-custom-edit-toggle]')
  assert.equal(await ui.page.locator('[data-custom-edit-bar]').count(), 0)
  assert.ok(await ui.page.locator('[data-custom-entry-edit]').count())
})

test('書き換える（1枚を選んで）：登録の画面で直すと、元の一覧へ戻る', async () => {
  await openSocial()
  await startEditing()
  await select(ids.delta)
  await ui.page.click('[data-custom-edit-action="edit"]')
  await ui.page.waitForSelector('[data-custom-card-form]')
  assert.equal(await ui.page.inputValue('[data-custom-card-input="front"]'), '三角州')
  await ui.page.fill('[data-custom-card-input="back"]', '川の河口に、土砂が積もってできた低く平らな土地')
  await ui.page.click('[data-custom-word-save]')
  await ui.page.waitForSelector('[data-custom-entry-list]')
  assert.equal((await ui.current()).params.category, SOCIAL)
  assert.ok((await ui.mainText()).includes('川の河口に、土砂が積もってできた低く平らな土地'))
})

test('1枚に統合する：残すカードを選び、統合したあとの中身を見てから統合する。記録・単語帳のメモは残すカードへ', async () => {
  await openSocial()
  await startEditing()
  await select(ids.fan1)
  await select(ids.fan2)
  await ui.page.click('[data-custom-edit-action="merge"]')
  await ui.page.waitForSelector('[data-custom-merge-sheet]')
  const targets = await ui.page.locator('[data-custom-merge-target]').evaluateAll((buttons) => buttons.map((button) => [button.getAttribute('data-custom-merge-target'), button.getAttribute('aria-checked')]))
  assert.deepEqual(targets, [[ids.fan1, 'true'], [ids.fan2, 'false']], '最初に選んだカードを残すカードにする')
  const preview = await ui.page.innerText('[data-custom-merge-preview]')
  assert.ok(preview.includes('扇の形の土地') && preview.includes('川が山地から平地へ出る所にできた土地'), '両方の意味が並ぶ')
  assert.ok(preview.includes('果樹園に使われる'))
  assert.ok((await ui.page.innerText('[data-custom-merge-notes]')).includes('ほかの1枚は消えます'))
  await ui.checkWidth('統合のシート')
  await ui.page.click('[data-custom-merge-run]')
  await ui.page.waitForSelector('[data-custom-edit-notice]')
  assert.equal(await notice(), '2枚を「扇状地」の1枚に統合しました。')
  assert.equal(await ui.page.locator('[data-custom-edit-bar]').count(), 0, '統合したら編集を終える')
  const state = await ui.state(['customCards', 'customCardSrs', 'learningNotebook'])
  const fans = state.customCards.filter((card) => card.front === '扇状地')
  assert.deepEqual(fans.map((card) => card.id), [ids.fan1])
  assert.equal(fans[0].back, '扇の形の土地\n川が山地から平地へ出る所にできた土地')
  assert.equal(state.customCardSrs[ids.fan1]?.memory?.lastJudgment, 'remembered', '記録は残すカードへ')
  assert.equal(state.customCardSrs[ids.fan2], undefined)
  assert.ok(state.learningNotebook.sets[0].refs.includes(`customCards:${ids.fan1}`))
  assert.ok(!state.learningNotebook.sets[0].refs.includes(`customCards:${ids.fan2}`))
  assert.equal(state.learningNotebook.entries[`customCards:${ids.fan1}`]?.note, '統合するカードのメモ')
})

test('英単語どうしの統合：残すカードを選び直せ、品詞のちがう意味は「ほかの意味」になる。英単語とほかのカードは統合できない', async () => {
  await openSocial()
  await startEditing()
  // 英単語とほかのカードを混ぜると、理由だけを出す。
  await select(ids.adj)
  await select(ids.qa)
  await ui.page.click('[data-custom-edit-action="merge"]')
  await ui.page.waitForSelector('[data-custom-merge-blocked]')
  assert.equal(await ui.page.getAttribute('[data-custom-merge-blocked]', 'data-custom-merge-blocked'), 'kind')
  assert.equal(await ui.page.locator('[data-custom-merge-run]').count(), 0)
  await ui.page.click('[data-sheet-layer] [aria-label="閉じる"]')
  // 一問一答を外して、名詞の popular を選ぶ。
  await ui.page.click(`[data-custom-entry-select="${ids.qa}"]`)
  await ui.page.waitForSelector(`[data-custom-entry-select="${ids.qa}"][aria-checked="false"]`)
  await select(ids.noun)
  await ui.page.click('[data-custom-edit-action="merge"]')
  await ui.page.waitForSelector('[data-custom-merge-sheet]')
  // 残すカードを「人気者」（名詞）に選び直す。
  await ui.page.click(`[data-custom-merge-target="${ids.noun}"]`)
  const preview = await ui.page.innerText('[data-custom-merge-preview]')
  assert.ok(preview.includes('人気者') && preview.includes('ほかの意味') && preview.includes('人気のある'))
  await ui.page.click('[data-custom-merge-run]')
  await ui.page.waitForSelector('[data-custom-edit-notice]')
  const { customWords } = await ui.state(['customWords'])
  assert.deepEqual(customWords.map((word) => [word.id, word.meanings, word.otherSenses]), [[ids.noun, ['人気者'], [{ pos: '形', meaning: '人気のある' }]]])
})

test('別の分類へ移す：新しいカテゴリーを作って移すと、元の分類から消え、移した先に並ぶ。記録はそのまま', async () => {
  await openSocial()
  await startEditing()
  await select(ids.qa)
  await select(ids.noun)
  await ui.page.click('[data-custom-edit-action="move"]')
  await ui.page.waitForSelector('[data-custom-move-sheet]')
  // 今の分類は選べない。
  assert.equal(await ui.page.locator(`[data-custom-move-target] option[value="${SOCIAL}"]`).getAttribute('disabled'), '')
  await ui.page.selectOption('[data-custom-move-target]', '__new-category__')
  await ui.page.fill('[data-custom-move-new-category]', '期末テスト')
  await ui.checkWidth('移動のシート')
  await ui.page.click('[data-custom-move-run]')
  await ui.page.waitForSelector('[data-custom-edit-notice]')
  assert.equal(await notice(), '2枚を「期末テスト」へ移しました。')
  const state = await ui.state(['customCategories', 'customWords', 'customCards'])
  const created = state.customCategories.find((category) => category.title === '期末テスト')
  assert.ok(created)
  assert.equal(state.customCards.find((card) => card.id === ids.qa).category, created.id)
  assert.equal(state.customWords.find((word) => word.id === ids.noun).category, created.id)
  const listed = await ui.page.locator('[data-custom-entry-id]').evaluateAll((cards) => cards.map((card) => card.getAttribute('data-custom-entry-id')))
  assert.ok(!listed.includes(ids.qa) && !listed.includes(ids.noun), '元の分類から消える')
  // 移した先のカテゴリーに並ぶ。
  await ui.open('customWords', { category: created.id })
  await ui.page.waitForSelector('[data-custom-entry-list]')
  const moved = await ui.page.locator('[data-custom-entry-id]').evaluateAll((cards) => cards.map((card) => card.getAttribute('data-custom-entry-id')))
  assert.deepEqual([...moved].sort(), [ids.qa, ids.noun].sort())
})

test('ほかの分類にまとめる（カテゴリーの設定）：中のカードをすべて移して、カテゴリーを消し、まとめた先を開く', async () => {
  const { customCategories } = await ui.state(['customCategories'])
  const created = customCategories.find((category) => category.title === '期末テスト')
  await ui.open('customWords', { category: created.id })
  await ui.page.click(`[data-custom-category-settings="${created.id}"]`)
  await ui.page.waitForSelector('[data-custom-category-merge]')
  await ui.page.selectOption('[data-custom-category-merge-target]', SOCIAL)
  await ui.page.click('[data-custom-category-merge-run]')
  assert.ok((await ui.page.innerText('[data-custom-category-merge-confirm]')).includes('中のカード2枚を「社会」へ移して、このカテゴリーを消します。'))
  await ui.checkWidth('カテゴリーの統合')
  await ui.page.click('[data-custom-category-merge-run]')
  await ui.page.waitForFunction(() => document.querySelector('[data-custom-edit-notice]')?.innerText.includes('ここへまとめました'))
  assert.equal((await ui.current()).params.category, SOCIAL, 'まとめた先の分類を開く')
  assert.ok(!(await ui.current()).params.mergedFrom, '知らせは1度だけ')
  assert.equal(await notice(), '「期末テスト」のカード2枚を、ここへまとめました。')
  const state = await ui.state(['customCategories', 'customWords', 'customCards'])
  assert.ok(!state.customCategories.some((category) => category.id === created.id))
  assert.equal(state.customCards.find((card) => card.id === ids.qa).category, SOCIAL)
  assert.equal(state.customWords.find((word) => word.id === ids.noun).category, SOCIAL)
})

test('削除（選んだカードをまとめて）：1回目で確かめ、2回目で消す。記録と単語帳からも外れる', async () => {
  await openSocial()
  await startEditing()
  await select(ids.fan1)
  await select(ids.noun)
  await ui.page.click('[data-custom-edit-action="delete"]')
  assert.equal((await ui.page.innerText('[data-custom-edit-action="delete"]')).trim(), '2枚を本当に消す')
  // 選び直すと確かめは取り消す。
  await select(ids.delta)
  assert.equal((await ui.page.innerText('[data-custom-edit-action="delete"]')).trim(), '削除')
  await ui.page.click(`[data-custom-entry-select="${ids.delta}"]`)
  await ui.page.waitForSelector(`[data-custom-entry-select="${ids.delta}"][aria-checked="false"]`)
  await ui.page.click('[data-custom-edit-action="delete"]')
  await ui.page.click('[data-custom-edit-action="delete"]')
  await ui.page.waitForSelector('[data-custom-edit-notice]')
  assert.equal(await notice(), '2枚を消しました。')
  const state = await ui.state(['customCards', 'customWords', 'customCardSrs', 'learningNotebook'])
  assert.ok(!state.customCards.some((card) => card.id === ids.fan1))
  assert.ok(!state.customWords.some((word) => word.id === ids.noun))
  assert.equal(state.customCardSrs[ids.fan1], undefined, '記録から外れる')
  assert.ok(!state.learningNotebook.sets[0].refs.includes(`customCards:${ids.fan1}`), '単語帳から外れる')
  assert.ok(state.customCards.some((card) => card.id === ids.delta), '選んでいないカードは残る')
})

test('どの分類の画面（教科6つ・作ったカテゴリー）でも、「編集」で英単語のカードとほかのカードを選び、操作の欄が出る', async () => {
  const custom = (await ui.act('saveCustomCategory', { title: '編集の確かめ' })).id
  const categories = [...CUSTOM_SUBJECTS.map((subject) => subjectCategoryId(subject.id)), custom]
  for (const [index, category] of categories.entries()) {
    const word = await ui.act('saveCustomEntry', { template: 'english', category, values: entryValues({ front: `pickword${index}x`, back: `選ぶ英単語${index}` }) })
    const card = await ui.act('saveCustomEntry', { template: 'kanbun', category, values: entryValues({ front: `選ぶ漢語${index}`, back: `選ぶ漢語の意味${index}` }) })
    await ui.open('portal', {})
    await ui.open('customWords', { category })
    await ui.page.waitForSelector('[data-custom-entry-list]')
    await startEditing()
    await select(word.id)
    await select(card.id)
    const where = category
    assert.equal((await ui.page.innerText('[data-custom-edit-count]')).trim(), '2枚を選んでいます', `${where}：2枚`)
    const disabled = await ui.page.locator('[data-custom-edit-action]').evaluateAll((buttons) => Object.fromEntries(buttons.map((button) => [button.getAttribute('data-custom-edit-action'), button.disabled])))
    assert.deepEqual(disabled, { edit: true, move: false, merge: false, delete: false }, `${where}：操作の欄`)
    await ui.checkWidth(`${where}の編集`)
    // 編集を終えると、元の一覧（カードの下の操作つき）に戻る。
    await ui.page.click('[data-custom-edit-toggle]')
    assert.equal(await ui.page.locator('[data-custom-edit-bar]').count(), 0, `${where}：編集を終える`)
    assert.ok(await ui.page.locator(`[data-custom-entry-id="${word.id}"] [data-custom-entry-edit]`).count(), `${where}：元の一覧`)
  }
})

test('編集の画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
