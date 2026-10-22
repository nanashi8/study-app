// 自作カードの「写真から作る」の画面（src/components/CustomCardPhoto.jsx）。依頼 requests/2026-10-22-custom-cards-photo-ocr.json の
// 受け入れ条件 photo-entry-all-places・photo-register-all-templates。
// 利用者：「自作カードのところに、OCRでテキストを読み取って単語を登録する機能を配置しなさい。」
//
// 母集団：自作カードの入口すべて（ホームの全体1つと6教科、分類のまとまり＝教科の分類6つと作ったカテゴリー、分類1つの画面、
// カードを作る画面）と、テンプレート5つ × 分類（教科・作ったカテゴリー・この画面で新しく作るカテゴリー）。
// 開発サーバー（375px）で画面を動かす。読み取りエンジン（PaddleOCR）は、決まった文字の箱を返す代わりのものに差し替える
// （本物のエンジンで読む確かめは custom-cards-photo-ocr.test.mjs）。外への通信は止める。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'

import { CUSTOM_SUBJECTS, subjectCategoryId } from '../src/lib/customCards.js'
import { entryValues, startCustomCardBrowser } from './custom-cards-browser.mjs'

const PHOTO = fileURLToPath(new URL('./fixtures/vocab-ocr/word-list.png', import.meta.url))

// 読み取りエンジンの代わり。読むたびに window.__photoOcrItems の箱（{ text, score, poly }）を返す。
const PADDLE_STUB = `
export const PaddleOCR = {
  async create() {
    return {
      async predict() {
        window.__photoOcrReads = (window.__photoOcrReads ?? 0) + 1
        return [{ items: window.__photoOcrItems ?? [], metrics: {}, runtime: {} }]
      },
      async dispose() {},
    }
  },
}
`
const paddleStub = () => ({
  name: 'paddle-stub',
  enforce: 'pre',
  resolveId: (id) => (id === '@paddleocr/paddleocr-js' ? '\0paddle-stub' : null),
  load: (id) => (id === '\0paddle-stub' ? PADDLE_STUB : null),
})

// 表の形の箱：行ごとに、左から 330px ずつ離れた箱を並べる（左右の箱は少し上下にずらす）。
const table = (rows) => rows.flatMap((cells, row) => cells.map((text, column) => {
  const x = 40 + column * 330
  const y = 50 + row * 57 + column * 2
  const width = Math.max(60, text.length * 18)
  return { text, score: 0.97, poly: [[x, y], [x + width, y], [x + width, y + 30], [x, y + 30]] }
}))

let ui
let page

before(async () => {
  ui = await startCustomCardBrowser({
    cacheDir: 'node_modules/.vite-custom-photo-test',
    plugins: [paddleStub()],
    exclude: ['@paddleocr/paddleocr-js'],
  })
  page = ui.page
})

after(async () => {
  await ui?.close()
})

const photoView = () => page.locator('[data-custom-photo]')
async function waitPhotoView() {
  await ui.waitScreen('customWords')
  await photoView().waitFor({ timeout: 30_000 })
}
/** 開いた「写真から作る」の分類・テンプレート・見え方。 */
const photoState = async () => ({
  category: await page.locator('[data-custom-photo-category]').inputValue(),
  template: await photoView().locator('[data-custom-card-template][aria-checked="true"]').getAttribute('data-custom-card-template'),
  params: (await ui.current()).params,
})

async function readPhoto(items) {
  await page.evaluate((value) => { window.__photoOcrItems = value }, items)
  await photoView().locator('input[type=file]:not([capture])').setInputFiles(PHOTO)
  await page.getByRole('button', { name: '文字を読み取る' }).click()
  await page.locator('[data-custom-photo-summary]').waitFor({ timeout: 30_000 })
}

/** 候補の一覧（表・裏・選んでいるか・選べるか・知らせ）。 */
const candidates = () => page.locator('[data-custom-photo-candidate]').evaluateAll((items) => items.map((item) => ({
  front: item.querySelector('[data-custom-photo-front]').value,
  back: item.querySelector('[data-custom-photo-back]').value,
  checked: item.querySelector('[data-custom-photo-check]').checked,
  disabled: item.querySelector('[data-custom-photo-check]').disabled,
  details: item.querySelector('[data-custom-photo-details]')?.textContent ?? '',
  notes: [...item.querySelectorAll('[data-custom-photo-note]')].map((note) => note.textContent),
})))
const candidate = (front) => page.locator('[data-custom-photo-candidate]', { has: page.locator(`[data-custom-photo-front][value="${front}"]`) })

const library = () => ui.state(['customWords', 'customCards', 'customCategories', 'learningNotebook'])

test('自作カードのホーム（メニューから・6教科のアプリから）の「写真から作る」は、その教科の分類と、分類の最初のテンプレートで開く', async () => {
  await ui.open('customWords', {})
  await page.locator('[data-custom-photo-open]').click()
  await waitPhotoView()
  assert.deepEqual(await photoState(), { category: 'subject:english', template: 'english', params: { view: 'photo' } })
  assert.match(await ui.mainText(), /写真から作る/)
  await ui.checkWidth('写真から作る（全体）')

  for (const subject of CUSTOM_SUBJECTS) {
    // 教科のアプリのホームの「自作カード」から入る。
    await ui.open(subject.appScreen, {})
    await page.locator(`[data-custom-cards-entry="${subject.id}"]`).click()
    await ui.waitScreen('customWords')
    await page.locator('[data-custom-photo-open]').click()
    await waitPhotoView()
    const state = await photoState()
    assert.equal(state.category, subjectCategoryId(subject.id), `${subject.label}：分類`)
    assert.equal(state.template, subject.template, `${subject.label}：テンプレート`)
    assert.equal(state.params.subject, subject.id, `${subject.label}：教科のまま`)
    assert.equal(await ui.topBarLabel(), subject.appLabel, `${subject.label}：上部のバー`)
    await ui.checkWidth(`写真から作る（${subject.label}）`)
  }
  assert.deepEqual(ui.overflow, [])
})

test('分類のまとまり（教科6つ・作ったカテゴリー）、分類1つの画面、カードを作る画面からも開き、その分類・テンプレートで始める', async () => {
  for (const subject of CUSTOM_SUBJECTS) {
    const template = subject.template
    const values = template === 'english' ? entryValues({ front: 'starter', back: '始めの語' }) : entryValues({ front: `${subject.label}の表`, back: `${subject.label}の裏` })
    assert.equal((await ui.act('saveCustomEntry', { template, category: subjectCategoryId(subject.id), values })).status, 'saved')
  }
  const created = await ui.act('saveCustomCategory', { title: '社会の一問一答', subject: 'social', template: 'qa' })
  const blocks = [
    ...CUSTOM_SUBJECTS.map((subject) => ({ id: subjectCategoryId(subject.id), template: subject.template })),
    { id: created.id, template: 'qa' },
  ]

  // メニューから開いたホーム：作ったカテゴリーと、カードのある教科6つのまとまり。
  for (const block of blocks) {
    await ui.open('customWords', {})
    await page.locator(`[data-custom-category-photo="${block.id}"]`).click()
    await waitPhotoView()
    const state = await photoState()
    assert.deepEqual([state.category, state.template], [block.id, block.template], block.id)
  }
  await ui.open('customWords', {})
  await ui.checkWidth('自作カードのホーム（3つのボタン）')

  // 教科（社会）のホーム：社会の分類と、社会に表示するカテゴリー。
  await ui.open('customWords', { subject: 'social' })
  for (const id of ['subject:social', created.id]) assert.equal(await page.locator(`[data-custom-category-photo="${id}"]`).count(), 1, id)

  // 分類1つの画面。
  await ui.open('customWords', { category: created.id })
  await page.locator(`[data-custom-category-view] [data-custom-category-photo="${created.id}"]`).click()
  await waitPhotoView()
  assert.deepEqual((await photoState()).category, created.id)

  // カードを作る画面：選んでいた分類・テンプレートのまま開く。
  await ui.open('customWords', { form: { category: created.id } })
  await page.locator('[data-custom-card-template="kanbun"]').click()
  await page.locator('[data-custom-form-photo]').click()
  await waitPhotoView()
  const fromForm = await photoState()
  assert.deepEqual([fromForm.category, fromForm.template, fromForm.params.template], [created.id, 'kanbun', 'kanbun'])
  // 書き換えと、英和辞書から来た登録の画面には出さない（1枚を直す・その語を入れる画面）。
  const word = (await library()).customWords[0]
  await ui.open('customWords', { form: { kind: 'word', id: word.id } })
  assert.equal(await page.locator('[data-custom-form-photo]').count(), 0)
  await ui.open('customWords', { draft: { word: 'zorbling' } })
  assert.equal(await page.locator('[data-custom-form-photo]').count(), 0)
  assert.deepEqual(ui.overflow, [])
})

// テンプレート5つ × 分類3種（教科・作ったカテゴリー・この画面で新しく作るカテゴリー）＝15とおり。行ごとに表と裏、選んだ候補だけを登録する。
// subject は、教科の分類で登録するときの教科。
const TEMPLATE_CASES = [
  {
    template: 'english',
    subject: 'english',
    items: table([['新出単語'], ['library', '名図書館'], ['borrow', '動借りる'], ['zorblax', 'ゾルブラクス']]),
    expected: [
      { front: 'library', back: '図書館', checked: true },
      { front: 'borrow', back: '借りる', checked: true },
      { front: 'zorblax', back: 'ゾルブラクス', checked: true },
    ],
    saved: ['library', 'borrow', 'zorblax'],
  },
  {
    template: 'koten',
    subject: 'koten',
    items: table([['あはれなり【形動ナリ】', 'しみじみとした趣がある'], ['いと', 'とても'], ['つれづれなり']]),
    expected: [
      { front: 'あはれなり', back: 'しみじみとした趣がある', checked: true },
      { front: 'いと', back: 'とても', checked: true },
      { front: 'つれづれなり', back: '', checked: false },
    ],
    saved: ['あはれなり', 'いと'],
  },
  {
    template: 'kanbun',
    subject: 'kanbun',
    items: table([['未だ〜ず', 'まだ〜ない'], ['蓋し', 'けだし・思うに']]),
    expected: [
      { front: '未だ〜ず', back: 'まだ〜ない', checked: true },
      { front: '蓋し', back: 'けだし・思うに', checked: true },
    ],
    saved: ['未だ〜ず', '蓋し'],
  },
  {
    template: 'other',
    subject: 'science',
    items: table([['光合成', '植物が光を使って養分をつくるはたらき'], ['GDP', '国内総生産']]),
    expected: [
      { front: '光合成', back: '植物が光を使って養分をつくるはたらき', checked: true },
      { front: 'GDP', back: '国内総生産', checked: true },
    ],
    saved: ['光合成', 'GDP'],
  },
  {
    template: 'qa',
    subject: 'social',
    items: table([['鎌倉幕府を開いた人物は？', '源頼朝'], ['日本の首都は？'], ['東京']]),
    expected: [
      { front: '鎌倉幕府を開いた人物は？', back: '源頼朝', checked: true },
      { front: '日本の首都は？', back: '東京', checked: true },
    ],
    saved: ['鎌倉幕府を開いた人物は？', '日本の首都は？'],
  },
]

const CATEGORY_KINDS = ['subject', 'custom', 'new']

test('5つのテンプレート × 分類3種（教科・作ったカテゴリー・新しく作るカテゴリー）のどれでも、1行を1枚の候補にし、選んだ候補を分類のカードとして登録して、単語帳にも入れる', async () => {
  for (const item of TEMPLATE_CASES) {
    await ui.act('saveCustomCategory', { title: `写真の${item.template}`, subject: null, template: item.template })
  }
  let combinations = 0
  for (const item of TEMPLATE_CASES) {
    for (const kind of CATEGORY_KINDS) {
      const label = `${item.template}×${kind}`
      const { customCategories } = await library()
      const openWith = kind === 'subject'
        ? subjectCategoryId(item.subject)
        : kind === 'custom' ? customCategories.find((category) => category.title === `写真の${item.template}`).id : null
      await ui.open('customWords', { view: 'photo', ...(openWith ? { category: openWith } : {}) })
      await waitPhotoView()
      await photoView().locator(`[data-custom-card-template="${item.template}"]`).click()
      if (kind === 'new') {
        await page.locator('[data-custom-photo-category]').selectOption('__new-category__')
        await page.locator('[data-custom-photo-new-category]').fill(`新しい${item.template}`)
      }
      await readPhoto(item.items)
      const rows = await candidates()
      assert.deepEqual(rows.map(({ front, back, checked }) => ({ front, back, checked })), item.expected, `${label}：候補`)
      await ui.checkWidth(`写真から作る（${label}の候補）`)
      const bookTitle = await page.locator('[data-custom-photo-book] option:checked').innerText()
      await page.locator('[data-custom-photo-save]').click()
      const notice = await page.locator('[data-custom-photo-notice] p').innerText()
      const category = kind === 'new'
        ? (await library()).customCategories.find((entry) => entry.title === `新しい${item.template}`)?.id
        : openWith
      assert.ok(category, `${label}：分類`)
      assert.equal(await page.locator('[data-custom-photo-category]').inputValue(), category, `${label}：登録した分類を選んだまま`)
      const categoryTitle = await page.locator('[data-custom-photo-category] option:checked').innerText()
      assert.equal(notice, `${item.saved.length}枚を「${categoryTitle}」に登録しました。単語帳「${bookTitle}」にも入れました。`, label)

      const state = await library()
      const english = item.template === 'english'
      const entries = english
        ? state.customWords.filter((word) => word.category === category && item.saved.includes(word.word))
        : state.customCards.filter((card) => card.category === category && item.saved.includes(card.front))
      assert.equal(entries.length, item.saved.length, `${label}：登録した数`)
      if (!english) assert.ok(entries.every((card) => card.template === item.template), `${label}：テンプレート`)
      if (kind === 'new') {
        const created = state.customCategories.find((entry) => entry.id === category)
        assert.deepEqual([created.template, created.subject], [item.template, null], `${label}：作ったカテゴリーの最初のテンプレート`)
      }
      const book = state.learningNotebook.sets.find((set) => set.title === bookTitle)
      for (const entry of entries) assert.ok(book.refs.includes(`${english ? 'vocab' : 'customCards'}:${entry.id}`), `${label}：単語帳`)
      if (english) {
        const libraryWord = entries.find((word) => word.word === 'library')
        assert.deepEqual([libraryWord.meanings, libraryWord.pos, libraryWord.level, libraryWord.phonetic], [['図書館'], '名', '4', '/ˈlaɪbɹɛˌɹi/'])
        assert.deepEqual(entries.find((word) => word.word === 'borrow').pos, '動')
      }
      if (item.template === 'koten') assert.equal(entries.find((card) => card.front === 'あはれなり').pos, '形動ナリ')

      // 登録した候補は「登録しました」になり、もう選べない。「カードを見る」で分類のカードの一覧へ。
      for (const front of item.saved) assert.match((await candidate(front).innerText()), /登録しました/)
      await page.locator('[data-custom-photo-open-category]').click()
      await page.locator(`[data-custom-category-view="${category}"]`).waitFor()
      const list = await page.locator('[data-custom-entry-list]').innerText()
      for (const front of item.saved) assert.ok(list.includes(front), `${label}：一覧に ${front}`)
      combinations += 1
    }
  }
  assert.equal(combinations, 15)
  assert.deepEqual(ui.overflow, [])
})

test('登録したカードは、分類のまとまりから暗記できる（ほかのテンプレートは自作カードの暗記、英単語は英単語の暗記）', async () => {
  const state = await library()
  await ui.open('customWords', { category: 'subject:koten' })
  await page.locator('[data-custom-category-view] [data-custom-study="card"]').click()
  await ui.waitScreen('customCardStudy')
  const study = await ui.current()
  const ids = state.customCards.filter((card) => card.category === 'subject:koten').map((card) => card.id)
  assert.deepEqual([...study.params.ids].sort(), [...ids].sort())

  await ui.open('customWords', { category: 'subject:english' })
  await page.locator('[data-custom-category-view] [data-custom-study="word"]').click()
  await ui.waitScreen('vocabStudy')
  const vocab = await ui.current()
  const wordIds = state.customWords.filter((word) => word.category === 'subject:english').map((word) => word.id)
  assert.deepEqual([...vocab.params.source.ids].sort(), [...wordIds].sort())
})

test('英単語：英文の中の語は選ばずに出し、意味のない語は意味を入れると選べ、分類にある語は知らせて選ばない。上限を超える意味は直すまで登録できない', async () => {
  await ui.open('customWords', { view: 'photo', category: 'subject:english' })
  await waitPhotoView()
  await readPhoto([
    ...table([['library', '名図書館'], ['apple', 'りんご・リンゴの木・赤い実・果物・食べ物']]),
    { text: 'Emi saw a walrus at the zoo.', score: 0.95, poly: [[40, 200], [700, 200], [700, 230], [40, 230]] },
  ])
  // 分類にもうある語（前のテストで登録した library）は、知らせて選ばない。
  const libraryRow = await candidate('library').innerText()
  assert.match(libraryRow, /この分類にもうあります。/)
  assert.equal(await candidate('library').locator('[data-custom-photo-check]').isChecked(), false)
  // 意味が5つ：直すまで選べない。4つに直すと選べて、選んだ状態になる。
  const apple = candidate('apple')
  assert.match(await apple.innerText(), /意味は「・」で区切って4つまでです。直すと登録できます。/)
  assert.equal(await apple.locator('[data-custom-photo-check]').isDisabled(), true)
  await apple.locator('[data-custom-photo-back]').fill('りんご・リンゴの木')
  assert.equal(await apple.locator('[data-custom-photo-check]').isChecked(), true)
  // 英文の中の語：見出しのあとに並び、辞書の語は辞書の意味で選ばない。辞書にない語・確かめられない並びは、意味を入れると選べる。
  assert.equal(await page.locator('[data-custom-photo-word-heading]').count(), 1)
  const rows = await candidates()
  const see = rows.find((row) => row.front === 'see')
  assert.deepEqual([see.checked, see.disabled], [false, false])
  assert.ok(see.notes.includes('saw → see'))
  assert.ok(see.notes.includes('意味は辞書から入れました。'))
  const walrus = rows.find((row) => row.front === 'walrus')
  assert.deepEqual([walrus.back, walrus.disabled], ['', true])
  assert.ok(walrus.notes.includes('意味を入れると登録できます。'))
  assert.ok(walrus.notes.includes('辞書にない英単語です。'))
  assert.ok(rows.find((row) => row.front === 'Emi').notes.some((note) => note.startsWith('英単語として確かめられませんでした')))
  await candidate('walrus').locator('[data-custom-photo-back]').fill('セイウチ')
  assert.equal(await candidate('walrus').locator('[data-custom-photo-check]').isChecked(), true)
  assert.match(await page.locator('[data-custom-photo-count]').innerText(), /選択中 2枚/)
  await page.locator('[data-custom-photo-book]').selectOption('')
  await page.locator('[data-custom-photo-save]').click()
  assert.equal(await page.locator('[data-custom-photo-notice] p').innerText(), '2枚を「英語」に登録しました。')
  const words = (await library()).customWords.filter((word) => word.category === 'subject:english')
  assert.deepEqual(words.find((word) => word.word === 'apple').meanings, ['りんご', 'リンゴの木'])
  assert.deepEqual(words.find((word) => word.word === 'walrus').meanings, ['セイウチ'])
  assert.equal(words.filter((word) => word.word === 'library').length, 1, '分類にある語は重ねて登録していない')
  assert.equal(words.some((word) => ['see', 'Emi', 'zoo'].includes(word.word)), false, '選ばなかった語は登録しない')
  await ui.checkWidth('写真から作る（英文の中の語）')
  assert.deepEqual(ui.overflow, [])
})

test('テンプレートを替えると候補を作り直し、読み取った文字を直すと、直した文字で作り直せる', async () => {
  await ui.open('customWords', { view: 'photo', category: 'subject:science' })
  await waitPhotoView()
  await readPhoto(table([['光合成', '植物が光を使って養分をつくるはたらき'], ['呼吸 酸素を使ってエネルギーを取り出すはたらき']]))
  assert.deepEqual((await candidates()).map((row) => row.front), ['光合成', '呼吸'])
  await photoView().locator('[data-custom-card-template="qa"]').click()
  assert.deepEqual((await candidates()).map((row) => [row.front, row.back]), [
    ['光合成', '植物が光を使って養分をつくるはたらき'],
    ['呼吸', '酸素を使ってエネルギーを取り出すはたらき'],
  ])
  assert.match(await page.locator('[data-custom-photo-text-card]').innerText(), /「？」の後ろか、空白・「：」の後ろを答えにします。/)
  await page.locator('#custom-photo-text').fill('葉緑体はどこにある？ 葉の細胞\n気孔のはたらきは？')
  await page.locator('[data-custom-photo-rebuild]').click()
  assert.deepEqual((await candidates()).map((row) => [row.front, row.back, row.checked]), [
    ['葉緑体はどこにある？', '葉の細胞', true],
    ['気孔のはたらきは？', '', false],
  ])
})

test('この画面で新しいカテゴリーを作って登録できる（教科から開いたら、その教科に表示するカテゴリー）', async () => {
  await ui.open('customWords', { subject: 'science' })
  await page.locator('[data-custom-photo-open]').click()
  await waitPhotoView()
  await readPhoto(table([['光合成', '植物が光を使って養分をつくるはたらき']]))
  // 理科の分類には前のテストで登録した「光合成」があるので、知らせて選ばない。新しいカテゴリーへ替えると選ぶ。
  assert.match(await candidate('光合成').innerText(), /この分類にもうあります。/)
  assert.equal(await candidate('光合成').locator('[data-custom-photo-check]').isChecked(), false)
  await page.locator('[data-custom-photo-category]').selectOption('__new-category__')
  assert.equal(await candidate('光合成').locator('[data-custom-photo-check]').isChecked(), true)
  assert.doesNotMatch(await candidate('光合成').innerText(), /この分類にもうあります。/)
  assert.equal(await page.locator('[data-custom-photo-save]').isDisabled(), true, '名前を入れるまで登録しない')
  await page.locator('[data-custom-photo-new-category]').fill('2学期中間理科')
  await page.locator('[data-custom-photo-save]').click()
  assert.match(await page.locator('[data-custom-photo-notice]').innerText(), /1枚を「2学期中間理科」に登録しました。/)
  const state = await library()
  const category = state.customCategories.find((item) => item.title === '2学期中間理科')
  assert.deepEqual([category.subject, category.template], ['science', 'other'])
  assert.deepEqual(state.customCards.filter((card) => card.category === category.id).map((card) => card.front), ['光合成'])
  assert.equal(await page.locator('[data-custom-photo-category]').inputValue(), category.id)
})

test('上限（英単語のカード5,000語）を超える分は登録せず、何枚入らなかったかを知らせる', async () => {
  const words = Array.from({ length: 4999 }, (_, at) => ({ id: `u-limit${at}`, word: `limitword${at}`, meanings: ['意味'], category: 'subject:english' }))
  await ui.act('importCustomLibrary', { words, cards: [], categories: [] }, 'replace')
  await ui.open('customWords', { view: 'photo', category: 'subject:english' })
  await waitPhotoView()
  await readPhoto(table([['library', '名図書館'], ['borrow', '動借りる']]))
  await page.locator('[data-custom-photo-save]').click()
  assert.match(await page.locator('[data-custom-photo-notice]').innerText(), /1枚を「英語」に登録しました。上限（英単語のカード5000語・カード5000枚）のため、1枚は登録できませんでした。/)
  const rows = await candidates()
  assert.deepEqual(rows.map((row) => row.notes.includes('登録しました')), [true, false])
  assert.equal((await library()).customWords.length, 5000)
  await ui.act('importCustomLibrary', { words: [], cards: [], categories: [] }, 'replace')
})
