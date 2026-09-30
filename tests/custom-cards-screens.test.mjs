// 自作カードの画面を 375px の幅で実際に操作する（依頼台帳 requests/2026-09-30-custom-card-templates.json の screen-verified・related-screens）。
//   入口     … メニューの行「自作カード」から開く（上部のバーは入口のスタディアプリ）。
//   登録     … 6つのテンプレートを選んで、それぞれの欄に打ち込んで登録する。英単語は16欄すべてを打ち込む。
//               分類で「新しいカテゴリーを作る」を選び、「2学期中間英語」を作りながら登録する。
//   カテゴリー… シートで作る・名前・表示する教科（そのアプリのホームにも出る）・並べ替え・削除（中のカードの枚数を示す）。
//   学ぶ     … カテゴリーから暗記（めくる→覚えた→終わりの画面）とテスト（3択＋わからない→答え合わせ）。
//   英和辞書 … 見出しに無い英語から「自作カードに登録」→英単語のテンプレートで登録→辞書へ戻り、検索結果に「自作」で出る。
//   単語帳   … カードの「単語帳」ボタンで登録先に入れ、マイ学習ノートの単語帳から自作カードの暗記を開く。画面下部に「単語帳」が出る。
//   戻る     … 登録欄・カードの一覧から戻ると、前の見え方へ帰る。
//   幅       … 開いたどの画面も、375px の幅で横にはみ出さない。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'

import { readFile } from 'node:fs/promises'
import { CUSTOM_CARD_TEMPLATES } from '../src/lib/customCards.js'
import { customCardsCsvSample, parseCustomCardsTable } from '../src/lib/customCardsCsv.js'
import { startCustomCardBrowser } from './custom-cards-browser.mjs'

let ui
before(async () => {
  ui = await startCustomCardBrowser({ cacheDir: 'node_modules/.vite-custom-screens-test' })
})

after(async () => {
  await ui?.close()
})

// テンプレートごとに打ち込む中身（欄の key → 文）。
const TYPED = {
  term: { front: '過去分詞', back: '動詞の変化形の1つ。受け身や完了形で使う形' },
  termNote: { front: '扇状地', back: '川が山地から平地へ出る所に、土砂が積もってできた扇の形の土地', note: '水はけがよく、果樹園に使われる' },
  qa: { front: '鎌倉幕府を開いた人物は？', back: '源頼朝', note: '1192年ごろに征夷大将軍になった' },
  koten: { front: 'いとほし', reading: 'いとおし', kanji: '愛ほし', pos: '形容詞・シク活用', back: 'かわいそうだ・気の毒だ', example: 'いとほしと思ふ', exampleTranslation: '気の毒だと思う', note: '今の「いとおしい」とちがう意味に注意' },
  kanbun: { front: '未だ〜ず', reading: 'いまだ〜ず', back: 'まだ〜ない', example: '未だ学を好む者を聞かざるなり', exampleTranslation: 'まだ学問を好む者を聞いたことがない', note: '再読文字' },
}

// 英単語の16欄（行を足して書く欄は「〜を足す」で行を出して打ち込む）。
const ENGLISH = {
  front: 'lumination',
  back: '明るく照らすこと・照明',
  posId: '名',
  level: '2',
  field: '科学・技術・健康',
  phonetic: '/ˌluːmɪˈneɪʃən/',
  example: 'The lumination of the stage was beautiful.',
  exampleTranslation: '舞台の照明が美しかった。',
  note: 'illumination とつづりを比べて覚える',
  etymology: 'ラテン語の lumen（光）から。',
  lists: {
    otherSenses: ['動', '照らす'],
    derivatives: ['luminate', '照らす'],
    synonyms: ['lighting', '照明'],
    antonyms: ['darkness', '暗さ'],
    confusables: ['illumination', '照明・解明'],
    phrases: ['under the lumination', '明かりの下で'],
  },
}

async function openMenuRow() {
  await ui.open('portal')
  await ui.page.evaluate(() => window.__customTest.store.getState().openSpeechSettings())
  // メニューの区切り「カード自作」の行（ホームのタイルも同じ名前なので、メニューの行を目印で選ぶ）。
  await ui.page.click('[data-menu-section="cards"] [data-menu-destination="customWords"]')
  await ui.waitScreen('customWords')
}

async function startForm() {
  await ui.page.click('[data-custom-word-add]')
  await ui.page.waitForSelector('[data-custom-card-form]')
}

async function chooseTemplate(id) {
  await ui.page.click(`[data-custom-card-template="${id}"]`)
  await ui.page.waitForSelector(`[data-custom-card-template="${id}"][aria-checked="true"]`)
}

async function fill(key, value) {
  await ui.page.fill(`[data-custom-card-input="${key}"]`, value)
}

async function save() {
  await ui.page.click('[data-custom-word-save]')
}

test('メニューの行「自作カード」から開き、上部のバーは入口のスタディアプリ', async () => {
  await openMenuRow()
  assert.equal(await ui.topBarLabel(), 'スタディアプリ')
  const text = await ui.mainText()
  assert.ok(text.includes('自作カード'))
  assert.ok(text.includes('カードを作る'))
  assert.ok(text.includes('カテゴリーを作る'))
  await ui.checkWidth('自作カードの入口')
})

test('6つのテンプレートを選んで打ち込んで登録し、「2学期中間英語」を登録欄から作る', async () => {
  // 1枚目：用語と意味。分類で新しいカテゴリーを作る。
  await ui.open('customWords', {})
  await startForm()
  await chooseTemplate('term')
  const fields = await ui.page.locator('[data-custom-card-input]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-custom-card-input')))
  assert.deepEqual(fields, ['front', 'back'], '用語と意味は2欄だけ')
  await ui.page.selectOption('[data-custom-card-category]', '__new-category__')
  await ui.page.fill('[data-custom-card-new-category]', '2学期中間英語')
  await fill('front', TYPED.term.front)
  await fill('back', TYPED.term.back)
  await ui.checkWidth('登録欄（用語と意味）')
  await save()
  await ui.waitScreen('customWords')
  await ui.page.waitForSelector('[data-custom-category]')
  const { customCategories } = await ui.state(['customCategories'])
  assert.deepEqual(customCategories.map((category) => category.title), ['2学期中間英語'])
  const categoryId = customCategories[0].id

  // 残りの4つ（英単語以外）を、同じカテゴリーへ。
  for (const template of ['termNote', 'qa', 'koten', 'kanbun']) {
    await ui.open('customWords', {})
    await startForm()
    await chooseTemplate(template)
    await ui.page.selectOption('[data-custom-card-category]', categoryId)
    const expected = CUSTOM_CARD_TEMPLATES.find((item) => item.id === template).fields.map((item) => item.key)
    const shown = await ui.page.locator('[data-custom-card-input]').evaluateAll((elements) => elements.map((element) => element.getAttribute('data-custom-card-input')))
    assert.deepEqual(shown, expected, `${template} の欄`)
    for (const [key, value] of Object.entries(TYPED[template])) await fill(key, value)
    await ui.checkWidth(`登録欄（${template}）`)
    await save()
    await ui.waitScreen('customWords')
  }

  // 英単語：16欄すべてを打ち込む。
  await ui.open('customWords', {})
  await startForm()
  await chooseTemplate('english')
  await ui.page.selectOption('[data-custom-card-category]', categoryId)
  await fill('word', ENGLISH.front)
  await fill('meanings', ENGLISH.back)
  await ui.page.selectOption('[data-custom-card-input="posId"]', ENGLISH.posId)
  await ui.page.selectOption('[data-custom-card-input="level"]', ENGLISH.level)
  await ui.page.selectOption('[data-custom-card-input="field"]', ENGLISH.field)
  await fill('phonetic', ENGLISH.phonetic)
  await fill('exampleEn', ENGLISH.example)
  await fill('exampleJa', ENGLISH.exampleTranslation)
  await fill('note', ENGLISH.note)
  await fill('etymology', ENGLISH.etymology)
  for (const [key, [first, second]] of Object.entries(ENGLISH.lists)) {
    await ui.page.click(`[data-custom-card-list-add="${key}"]`)
    const row = ui.page.locator(`[data-custom-card-list="${key}"] li`).last()
    if (key === 'otherSenses') await row.locator('select').selectOption(first)
    else await row.locator('input').first().fill(first)
    await row.locator('input').last().fill(second)
  }
  await ui.checkWidth('登録欄（英単語）')
  await save()
  await ui.waitScreen('customWords')

  const { customWords, customCards } = await ui.state(['customWords', 'customCards'])
  assert.equal(customCards.length, 5)
  assert.deepEqual(customCards.map((card) => card.template).sort(), ['kanbun', 'koten', 'qa', 'term', 'termNote'])
  assert.ok(customCards.every((card) => card.category === categoryId))
  assert.equal(customWords.length, 1)
  const word = customWords[0]
  assert.equal(word.category, categoryId)
  assert.equal(word.word, ENGLISH.front)
  assert.deepEqual(word.meanings, ['明るく照らすこと', '照明'])
  assert.deepEqual([word.pos, word.level, word.field, word.phonetic], [ENGLISH.posId, ENGLISH.level, ENGLISH.field, ENGLISH.phonetic])
  assert.deepEqual(word.example, { en: ENGLISH.example, ja: ENGLISH.exampleTranslation })
  assert.equal(word.note, ENGLISH.note)
  assert.equal(word.etymology, ENGLISH.etymology)
  assert.deepEqual(word.otherSenses, [{ pos: '動', meaning: '照らす' }])
  for (const key of ['derivatives', 'synonyms', 'antonyms', 'confusables']) assert.deepEqual(word[key], [{ w: ENGLISH.lists[key][0], m: ENGLISH.lists[key][1] }], key)
  assert.deepEqual(word.phrases, [{ phrase: ENGLISH.lists.phrases[0], meaning: ENGLISH.lists.phrases[1] }])
})

test('カテゴリーのカードの一覧：6つのテンプレートのカードが欄の名前つきで並び、書き換え・削除・単語帳・辞書ページへ行ける', async () => {
  const { customCategories } = await ui.state(['customCategories'])
  const categoryId = customCategories[0].id
  await ui.open('customWords', {})
  await ui.page.click(`[data-custom-category-open="${categoryId}"]`)
  await ui.page.waitForSelector('[data-custom-entry-list]')
  const text = await ui.mainText()
  for (const values of Object.values(TYPED)) for (const value of Object.values(values)) assert.ok(text.includes(value), `一覧：${value}`)
  for (const label of ['用語と意味', '用語・意味・解説', '一問一答', '古典単語', '漢語', '英単語', '読み（現代仮名遣い）', '品詞・活用', '用例（書き下し文）', '解説']) {
    assert.ok(text.includes(label), `一覧の欄の名前：${label}`)
  }
  // 画面下部に「単語帳」（登録先）が出る。
  assert.ok(await ui.page.locator('[data-study-dock]').count(), '画面下部の枠')
  assert.ok((await ui.page.locator('[data-study-dock]').innerText()).includes('単語帳'), '画面下部の単語帳')
  await ui.checkWidth('カテゴリーのカードの一覧')

  // 書き換え：用語と意味のカードを開き、意味を変えて戻る。
  const card = ui.page.locator('[data-custom-entry-kind="card"]', { hasText: TYPED.term.front })
  await card.locator('[data-custom-entry-edit]').click()
  await ui.page.waitForSelector('[data-custom-card-form]')
  assert.equal(await ui.page.inputValue('[data-custom-card-input="front"]'), TYPED.term.front)
  await fill('back', '書き換えた意味')
  await save()
  await ui.page.waitForSelector('[data-custom-entry-list]')
  assert.ok((await ui.mainText()).includes('書き換えた意味'), '書き換えて一覧へ戻る')
  const state = await ui.current()
  assert.equal(state.params.category, categoryId, '戻ると同じカテゴリーの一覧')

  // 単語帳：カードの「単語帳」で登録先（マイ単語）に入れる。
  await ui.page.locator('[data-custom-entry-kind="card"]', { hasText: TYPED.qa.front }).locator('[data-custom-word-book]').click()
  const { learningNotebook } = await ui.state(['learningNotebook'])
  assert.ok(learningNotebook.sets[0].refs.some((ref) => ref.startsWith('customCards:')), '単語帳に自作カードが入る')

  // 英単語のカードは辞書ページへ。
  await ui.page.locator('[data-custom-entry-kind="word"]').locator('[data-custom-entry-dictionary]').click()
  await ui.waitScreen('wordDetail')
  assert.ok((await ui.mainText()).includes(ENGLISH.etymology))
})

test('カテゴリーから暗記（めくる→覚えた→終わりの画面）とテスト（3択＋わからない→答え合わせ→結果）ができ、記録が残る', async () => {
  const { customCategories } = await ui.state(['customCategories'])
  const categoryId = customCategories[0].id
  await ui.open('customWords', { category: categoryId })
  await ui.page.click('[data-custom-study="card"]')
  await ui.waitScreen('customCardStudy')
  for (let index = 0; index < 5; index += 1) {
    await ui.page.waitForSelector('[data-custom-card]')
    await ui.page.click('[data-custom-card]')
    await ui.page.waitForSelector('[data-custom-card-answer]')
    await ui.checkWidth('自作カードの暗記')
    await ui.page.locator('button', { hasText: '覚えた👍' }).click()
  }
  await ui.page.waitForSelector('[data-study-completion-report], [data-study-completion-title], :text("自作カードへ戻る")')
  const { customCardSrs } = await ui.state(['customCardSrs'])
  assert.equal(Object.values(customCardSrs).filter((entry) => entry.memory?.lastJudgment === 'remembered').length, 5)

  await ui.open('customWords', { category: categoryId })
  await ui.page.click('[data-custom-quiz="card"]')
  await ui.waitScreen('customCardQuiz')
  for (let index = 0; index < 5; index += 1) {
    await ui.page.waitForSelector('[data-custom-card-quiz-question]')
    await ui.page.locator('button', { hasText: 'わからない' }).click()
    await ui.page.waitForSelector('[data-custom-card-quiz-answer]')
    const text = await ui.mainText()
    assert.ok(text.includes('選択肢解説'), '答え合わせの選択肢解説')
    await ui.checkWidth('自作カードのテストの答え合わせ')
    await ui.page.locator('button', { hasText: index === 4 ? '結果を見る' : '次の問題へ' }).last().click()
  }
  await ui.page.waitForSelector('[data-custom-card-quiz-result]')
  const after = await ui.state(['customCardSrs', 'contentQuizResults'])
  assert.equal(Object.values(after.customCardSrs).filter((entry) => entry.test?.lastResult).length, 5)
  assert.equal(Object.keys(after.contentQuizResults).filter((key) => key.startsWith('custom-cards:')).length, 5)
})

test('カテゴリーのシート：作る・名前・表示する教科（そのアプリのホームにも出る）・並べ替え・削除（中のカードの枚数を示す）', async () => {
  await ui.open('customWords', {})
  await ui.page.click('[data-custom-category-add]')
  await ui.page.waitForSelector('[data-custom-category-sheet="new"]')
  await ui.page.fill('[data-custom-category-title]', '期末理科')
  await ui.page.selectOption('[data-custom-category-subject]', 'science')
  await ui.page.selectOption('[data-custom-category-template]', 'qa')
  await ui.page.click('[data-custom-category-save]')
  let { customCategories } = await ui.state(['customCategories'])
  const created = customCategories.find((category) => category.title === '期末理科')
  assert.deepEqual([created.subject, created.template], ['science', 'qa'])

  // そのカテゴリーで「カードを作る」と、最初のテンプレートは一問一答。
  await ui.page.click(`[data-custom-category-create="${created.id}"]`)
  await ui.page.waitForSelector('[data-custom-card-form]')
  assert.equal(await ui.page.getAttribute('[data-custom-card-template][aria-checked="true"]', 'data-custom-card-template'), 'qa')
  await fill('front', '植物が光を使って養分をつくるはたらきは？')
  await fill('back', '光合成')
  await save()
  await ui.waitScreen('customWords')

  // 理科アプリのホームにも出る。
  await ui.open('scienceHome', {})
  const entry = ui.page.locator('[data-custom-cards-entry="science"]')
  assert.ok((await entry.innerText()).includes('1枚'))
  await entry.click()
  await ui.waitScreen('customWords')
  assert.ok((await ui.mainText()).includes('期末理科'))

  // 名前を変え、並べ替える。
  await ui.page.click(`[data-custom-category-settings="${created.id}"]`)
  await ui.page.waitForSelector(`[data-custom-category-sheet="${created.id}"]`)
  await ui.page.fill('[data-custom-category-title]', '2学期期末理科')
  await ui.page.click('[data-custom-category-save]')
  ;({ customCategories } = await ui.state(['customCategories']))
  assert.equal(customCategories.find((category) => category.id === created.id).title, '2学期期末理科')
  await ui.page.click(`[data-custom-category-settings="${created.id}"]`)
  await ui.page.click('[data-custom-category-move="up"]')
  ;({ customCategories } = await ui.state(['customCategories']))
  assert.equal(customCategories[0].id, created.id, '上へ動く')
  await ui.checkWidth('カテゴリーのシート')

  // 削除：中のカードの枚数を示して確かめてから、カードごと消す。
  await ui.page.click('[data-custom-category-delete]')
  assert.ok((await ui.page.locator('[data-custom-category-delete]').innerText()).includes('中のカード1枚も消えます'))
  await ui.page.click('[data-custom-category-delete]')
  const after = await ui.state(['customCategories', 'customCards'])
  assert.ok(!after.customCategories.some((category) => category.id === created.id))
  assert.ok(!after.customCards.some((card) => card.back === '光合成'))
})

test('英和辞書：見出しに無い英語から英単語のテンプレートで登録し、辞書へ戻ると検索結果に「自作」で出る', async () => {
  await ui.open('vocabSearch', {})
  await ui.page.fill('.study-app-content input', 'florbast')
  await ui.page.waitForSelector('[data-dictionary-register-custom]')
  assert.ok((await ui.page.locator('[data-dictionary-register-custom]').first().innerText()).includes('自作カードに登録'))
  await ui.page.locator('[data-dictionary-register-custom]').first().click()
  await ui.waitScreen('customWords')
  await ui.page.waitForSelector('[data-custom-word-from-dictionary]')
  // 英語アプリの中の登録なので、上部のバーは英語アプリ。
  assert.equal(await ui.topBarLabel(), '英語アプリ')
  assert.equal(await ui.page.getAttribute('[data-custom-card-template][aria-checked="true"]', 'data-custom-card-template'), 'english')
  assert.equal(await ui.page.inputValue('[data-custom-card-input="word"]'), 'florbast')
  await fill('meanings', '作った語の意味')
  await save()
  await ui.waitScreen('vocabSearch')
  await ui.page.waitForSelector('[data-dictionary-custom-words]')
  assert.ok((await ui.page.locator('[data-dictionary-custom-words]').innerText()).includes('florbast'))
})

test('マイ学習ノートの単語帳から、自作カードの暗記を開ける', async () => {
  await ui.open('myList', { tab: 'sets' })
  const row = ui.page.locator('[data-notebook-set-id] div', { hasText: '自作カード' }).last()
  await row.waitFor()
  await row.locator('button', { hasText: '暗記' }).click()
  await ui.waitScreen('customCardStudy')
  await ui.page.waitForSelector('[data-custom-card]')
})

test('カードの一覧をファイルで編集：CSV の書き出し・見本の保存・ファイル（Shift_JIS）の読み込み・表の貼り付け', async () => {
  await ui.open('customWords', {})
  await ui.page.click('[data-custom-words-file-open]')
  await ui.page.waitForSelector('[data-custom-cards-table]')
  await ui.checkWidth('ファイルで編集')

  // 見本の CSV を保存すると、6つのテンプレートの見本が入ったファイルになる。
  const [sample] = await Promise.all([ui.page.waitForEvent('download'), ui.page.click('[data-custom-cards-csv-sample]')])
  assert.equal(sample.suggestedFilename(), 'study-app-custom-cards-sample.csv')
  assert.equal(await readFile(await sample.path(), 'utf8'), customCardsCsvSample())

  // 全カードを CSV で書き出す。読み戻すと、いまのカードがすべて入っている。
  const before = await ui.state(['customWords', 'customCards', 'customCategories'])
  const [exported] = await Promise.all([ui.page.waitForEvent('download'), ui.page.click('[data-custom-cards-csv-export]')])
  const exportedText = await readFile(await exported.path(), 'utf8')
  const parsed = parseCustomCardsTable(exportedText, { categories: before.customCategories })
  assert.deepEqual(parsed.errors, [])
  assert.equal(parsed.library.words.length, before.customWords.length)
  assert.equal(parsed.library.cards.length, before.customCards.length)

  // 日本語の Excel が保存した Shift_JIS の CSV を読み込み、足す。
  const shiftJis = Buffer.from('95aa97de2c836583938376838c815b83672c955c2c97a02c89f090e00d0a8ed089ef2c97708cea814588d396a1814589f090e02c8e4f8a708f422c90ec82cc89cd8cfb82c982c582ab82e992e182ad95bd82e782c89379926e2c9085936382c98e6782ed82ea82e90d0a', 'hex')
  await ui.page.setInputFiles('[data-custom-cards-csv-input]', { name: 'excel.csv', mimeType: 'text/csv', buffer: shiftJis })
  await ui.page.waitForSelector('[data-custom-words-import-choice]')
  assert.ok((await ui.page.locator('[data-custom-words-import-choice]').innerText()).includes('カード1枚'))
  await ui.page.click('[data-custom-cards-import-merge]')
  let after = await ui.state(['customCards'])
  assert.ok(after.customCards.some((card) => card.front === '三角州' && card.note === '水田に使われる'), 'Shift_JIS のファイルのカード')

  // Excel からコピーした表（タブ区切り）を貼り付けて読み込み、新しいカテゴリーを作る。
  await ui.page.click('[data-custom-cards-paste-open]')
  await ui.page.fill('[data-custom-cards-paste-input]', '分類\t用語\t意味\n3学期期末理科\t光合成\t植物が光を使って養分をつくるはたらき\n3学期期末理科\t呼吸\t養分を分解してエネルギーを取り出すはたらき')
  await ui.page.click('[data-custom-cards-paste-read]')
  await ui.page.waitForSelector('[data-custom-cards-import-new-categories]')
  assert.ok((await ui.page.locator('[data-custom-cards-import-new-categories]').innerText()).includes('3学期期末理科'))
  await ui.checkWidth('読み込む前の確かめ')
  await ui.page.click('[data-custom-cards-import-merge]')
  after = await ui.state(['customCards', 'customCategories'])
  const created = after.customCategories.find((category) => category.title === '3学期期末理科')
  assert.ok(created, '新しいカテゴリー')
  assert.equal(after.customCards.filter((card) => card.category === created.id).length, 2)

  // 読めない行は、行の番号と理由を出す。
  await ui.page.click('[data-custom-cards-paste-open]')
  await ui.page.fill('[data-custom-cards-paste-input]', '分類,テンプレート,表,裏\n社会,用語と意味,表だけ,\n社会,用語と意味,表,裏')
  await ui.page.click('[data-custom-cards-paste-read]')
  await ui.page.waitForSelector('[data-custom-cards-import-errors]')
  assert.ok((await ui.page.locator('[data-custom-cards-import-errors]').innerText()).includes('2行目'))
  await ui.page.locator('[data-custom-words-import-choice] button', { hasText: 'やめる' }).click()
})

test('自作カードの画面は、375px の幅で横にはみ出さない', () => {
  assert.deepEqual(ui.overflow, [])
})
