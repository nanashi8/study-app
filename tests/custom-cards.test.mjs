// 自作カードのテンプレートとカテゴリー（依頼台帳 requests/2026-09-30-custom-card-templates.json の templates・custom-categories）。
// 2026-09-30 利用者:
//   単語を登録機能を、単語帳のようにカスタマイズできるようにしなさい。例えば、用語と意味だけを登録できるテンプレートを表示したり、
//   英単語で使われている情報を登録するテンプレートを表示させたり。教科を既存で実装されている強化で登録して、その内容に追加表示できるようにしたり、
//   独自のカテゴリーで、例えば2学期中間英語というカテゴリーで作成できるように考えて実装しなさい。
// 2026-09-30 利用者（続き。requests/2026-09-30-custom-card-form-followup.json の templates-five）:
//   テンプレートは英単語、古文単語、漢語、その他、一問一答にしなさい。
// 画面の操作（375px）は tests/custom-cards-screens.test.mjs、英単語の欄は tests/custom-cards-english.test.mjs。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_FIELD_KEYS,
  CARD_TEMPLATE_IDS,
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECTS,
  LEGACY_TEMPLATE_IDS,
  cardFieldRows,
  categorySubject,
  customCategoryChoices,
  customCategoryGroups,
  defaultTemplateFor,
  getCustomCard,
  normalizeCustomCard,
  normalizeCustomCategory,
  reconcileCustomCategories,
  subjectCategoryId,
  templateFor,
} from '../src/lib/customCards.js'
import { ENGLISH_WORD_FIELDS } from '../src/lib/customWords.js'
import {
  carryEntryValues,
  emptyEntryValues,
  entryValuesFromCard,
  entryValuesFromWord,
  missingEntryFields,
} from '../src/lib/customEntryForm.js'
import { getWord } from '../src/data/vocab.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

// テンプレート（登録の画面で選ぶ順）と、それぞれの欄の名前。
export const EXPECTED_TEMPLATE_FIELDS = Object.freeze({
  english: [
    '単語', '意味', '品詞', '級', '分野', '発音記号', '例文', '例文の訳', '使い方・メモ',
    'ほかの意味', '派生語・ほかの品詞の形', '類義語', '反意語', 'つづりが似ていて間違えやすい語', '熟語・構文', '語の成り立ち',
  ],
  koten: ['古語', '読み（現代仮名遣い）', '漢字', '品詞・活用', '意味', '例文', '例文の訳', '解説'],
  kanbun: ['漢語・句法', '読み', '意味', '用例（書き下し文）', '用例の訳', '解説'],
  other: ['用語', '意味', '解説'],
  qa: ['問題', '答え', '解説'],
})

const fieldLabels = (templateId) => (templateId === 'english'
  ? ENGLISH_WORD_FIELDS.map((item) => item.label)
  : templateFor(templateId).fields.map((item) => item.label))

// 1枚のカードに書く中身。テンプレートにない欄にも書いておき、保存されないことを確かめる。
function sampleValues(templateId, tag = '') {
  const values = emptyEntryValues()
  if (templateId === 'english') {
    return {
      ...values,
      front: `glimmer${tag}`,
      back: 'かすかな光・わずかな気配',
      posId: '名',
      level: 'pre1',
      field: '自然・環境・地理',
      phonetic: '/ˈɡlɪmər/',
      example: 'There was a glimmer of hope.',
      exampleTranslation: 'かすかな希望があった。',
      note: 'a glimmer of ～ の形でよく使う',
      otherSenses: [{ pos: '動', meaning: 'ちらちら光る' }],
      derivatives: [{ w: 'glimmering', m: 'かすかな' }],
      synonyms: [{ w: 'gleam', m: 'かすかな光' }],
      antonyms: [{ w: 'glare', m: 'ぎらぎらした光' }],
      confusables: [{ w: 'glamour', m: '魅力' }],
      phrases: [{ phrase: 'a glimmer of hope', meaning: 'かすかな希望' }],
      etymology: '「光る」を表す古い語から。',
      reading: 'テンプレートにない欄',
    }
  }
  return {
    ...values,
    front: `用語${tag}の表`,
    back: `用語${tag}の裏`,
    reading: 'よみ',
    kanji: '漢字',
    pos: '名詞',
    example: '例文の文',
    exampleTranslation: '例文の訳の文',
    note: '解説の文',
  }
}

// ストアを初期値に戻してから動かす（ほかのテストの状態を持ち込まない）。
function freshStore() {
  const initial = useStore.getInitialState()
  useStore.setState({
    ...initial,
    customWords: [],
    customCards: [],
    customCategories: [],
    customCardSrs: {},
    learningNotebook: initial.learningNotebook,
  }, true)
  return useStore.getState()
}

test('テンプレートは5つ（英単語・古文単語・漢語・その他・一問一答）で、「その他」は用語・意味と、書かなくてもよい解説', () => {
  assert.deepEqual(CUSTOM_CARD_TEMPLATES.map((template) => template.id), Object.keys(EXPECTED_TEMPLATE_FIELDS))
  assert.deepEqual(CUSTOM_CARD_TEMPLATES.map((template) => template.label), ['英単語', '古文単語', '漢語', 'その他', '一問一答'])
  for (const [templateId, labels] of Object.entries(EXPECTED_TEMPLATE_FIELDS)) {
    assert.deepEqual(fieldLabels(templateId), labels, `${templateId} の欄`)
  }
  // 「その他」は用語と意味だけで登録できる（解説は書かなくてもよい）。
  assert.deepEqual(templateFor('other').fields.map((item) => [item.key, item.required]), [['front', true], ['back', true], ['note', false]])
  const onlyTwo = normalizeCustomCard({ template: 'other', front: '光合成', back: '植物が光を使って養分をつくるはたらき' })
  assert.deepEqual([onlyTwo.template, onlyTwo.front, onlyTwo.note], ['other', '光合成', ''])
  // 以前のテンプレート（用語と意味・用語・意味・解説）は「その他」として読む。
  assert.deepEqual(LEGACY_TEMPLATE_IDS, { term: 'other', termNote: 'other' })
  assert.equal(templateFor('term').id, 'other')
  assert.equal(templateFor('termNote').id, 'other')
  // どのテンプレートにも説明があり、必須の欄は表と裏（英単語は単語と意味）。
  for (const template of CUSTOM_CARD_TEMPLATES) {
    assert.ok(template.description, `${template.id} の説明`)
    if (template.id === 'english') continue
    assert.deepEqual(template.fields.filter((item) => item.required).map((item) => item.key), ['front', 'back'])
    // テンプレートの欄はカードの欄のどれか。
    for (const item of template.fields) assert.ok(CARD_FIELD_KEYS.includes(item.key), `${template.id}.${item.key}`)
  }
  assert.deepEqual(ENGLISH_WORD_FIELDS.filter((item) => item.required).map((item) => item.key), ['word', 'meanings'])
})

test('どのテンプレートでも、必須の欄が空なら登録せず、足りない欄の名前を知らせる', () => {
  for (const template of CUSTOM_CARD_TEMPLATES) {
    const missing = missingEntryFields(template.id, emptyEntryValues())
    assert.equal(missing.length, 2, template.id)
    const store = freshStore()
    const result = store.saveCustomEntry({ template: template.id, category: subjectCategoryId('english'), values: emptyEntryValues() })
    assert.equal(result.status, 'invalid', template.id)
  }
  assert.deepEqual(missingEntryFields('other', emptyEntryValues()), ['用語', '意味'])
  assert.deepEqual(missingEntryFields('qa', emptyEntryValues()), ['問題', '答え'])
  assert.deepEqual(missingEntryFields('english', emptyEntryValues()), ['単語', '意味'])
})

test('どのテンプレートでも登録・書き換え・削除ができ、テンプレートにない欄は保存しない', () => {
  const original = useStore.getState()
  try {
    for (const template of CUSTOM_CARD_TEMPLATES) {
      const store = freshStore()
      const values = sampleValues(template.id)
      const saved = store.saveCustomEntry({ template: template.id, category: subjectCategoryId('social'), values })
      assert.equal(saved.status, 'saved', template.id)
      let state = useStore.getState()
      if (template.id === 'english') {
        assert.equal(saved.kind, 'word')
        const word = state.customWords.find((item) => item.id === saved.id)
        assert.equal(word.word, values.front)
        assert.deepEqual(word.meanings, ['かすかな光', 'わずかな気配'])
        assert.equal(word.category, subjectCategoryId('social'))
        assert.equal(getWord(saved.id)?.word, values.front)
      } else {
        assert.equal(saved.kind, 'card')
        const card = state.customCards.find((item) => item.id === saved.id)
        assert.equal(card.template, template.id)
        assert.equal(card.category, subjectCategoryId('social'))
        const allowed = new Set(template.fields.map((item) => item.key))
        for (const key of CARD_FIELD_KEYS) {
          assert.equal(Boolean(card[key]), allowed.has(key), `${template.id}.${key}：テンプレートの欄だけを保存する`)
        }
        assert.equal(getCustomCard(saved.id)?.front, values.front)
        // 一覧には欄の名前をつけて出す（空の欄は出さない）。
        assert.deepEqual(cardFieldRows(card).map((row) => row.label), template.fields.map((item) => item.label))
      }

      // 書き換え：同じ ID のまま中身と分類を変える。
      const edited = useStore.getState().saveCustomEntry({
        template: template.id,
        category: subjectCategoryId('science'),
        values: { ...values, back: '書き換えた裏' },
        previous: { kind: saved.kind, id: saved.id },
      })
      assert.equal(edited.id, saved.id, `${template.id}：書き換えは同じ ID`)
      state = useStore.getState()
      const entry = saved.kind === 'word'
        ? state.customWords.find((item) => item.id === saved.id)
        : state.customCards.find((item) => item.id === saved.id)
      assert.equal(entry.category, subjectCategoryId('science'))
      assert.equal(saved.kind === 'word' ? entry.meanings.join('・') : entry.back, '書き換えた裏')

      // 削除
      if (saved.kind === 'word') useStore.getState().deleteCustomWord(saved.id)
      else useStore.getState().deleteCustomCard(saved.id)
      state = useStore.getState()
      assert.equal(state.customWords.length + state.customCards.length, 0, `${template.id}：消える`)
    }
  } finally {
    useStore.setState(original, true)
  }
})

test('書き換えのときテンプレートを変えられ、同じ意味の欄（表・裏・例文・例文の訳・解説・品詞）は中身を引き継ぐ', () => {
  const original = useStore.getState()
  try {
    for (const from of CUSTOM_CARD_TEMPLATES) {
      for (const to of CUSTOM_CARD_TEMPLATES) {
        if (from.id === to.id) continue
        const store = freshStore()
        const saved = store.saveCustomEntry({ template: from.id, category: subjectCategoryId('english'), values: sampleValues(from.id) })
        const setId = useStore.getState().learningNotebook.sets[0].id
        const fromRef = `${saved.kind === 'word' ? 'vocab' : 'customCards'}:${saved.id}`
        useStore.getState().setNotebookSetRefs(setId, [fromRef], true)
        useStore.getState().updateNotebookItem(saved.kind === 'word' ? 'vocab' : 'customCards', saved.id, { note: 'メモ' })

        // 画面の登録欄と同じ手順：登録済みの中身を読み、テンプレートを切り替えて保存する。
        const state = useStore.getState()
        const values = saved.kind === 'word'
          ? entryValuesFromWord(state.customWords[0])
          : entryValuesFromCard(state.customCards[0])
        const carried = carryEntryValues(values, from.id, to.id)
        const result = useStore.getState().saveCustomEntry({
          template: to.id,
          category: subjectCategoryId('english'),
          values: carried,
          previous: { kind: saved.kind, id: saved.id },
        })
        assert.equal(result.status, 'saved', `${from.id}→${to.id}`)
        const after = useStore.getState()
        assert.equal(after.customWords.length + after.customCards.length, 1, `${from.id}→${to.id}：1枚のまま`)
        const entry = result.kind === 'word' ? after.customWords[0] : after.customCards[0]
        assert.equal(result.kind === 'word' ? entry.word : entry.front, sampleValues(from.id).front, `${from.id}→${to.id}：表を引き継ぐ`)
        const toRef = `${result.kind === 'word' ? 'vocab' : 'customCards'}:${result.id}`
        // 単語帳とメモも新しいカードへ移る（英単語とほかの間で ID が変わっても外れない）。
        assert.ok(after.learningNotebook.sets[0].refs.includes(toRef), `${from.id}→${to.id}：単語帳に残る`)
        assert.equal(after.learningNotebook.entries[toRef]?.note, 'メモ', `${from.id}→${to.id}：メモが残る`)
        if (toRef !== fromRef) assert.ok(!after.learningNotebook.sets[0].refs.includes(fromRef))
        // 例文と解説は、移った先のテンプレートにその欄があれば引き継ぐ。
        const toKeys = new Set(to.id === 'english' ? ['example', 'note'] : to.fields.map((item) => item.key))
        const fromKeys = new Set(from.id === 'english' ? ['example', 'exampleTranslation', 'note'] : from.fields.map((item) => item.key))
        if (toKeys.has('note') && fromKeys.has('note')) {
          assert.equal(entry.note, sampleValues(from.id).note, `${from.id}→${to.id}：解説・メモを引き継ぐ`)
        }
      }
    }
  } finally {
    useStore.setState(original, true)
  }
})

test('分類は教科6つ（英語・古典・漢文・数学・社会・理科）と、自分で作ったカテゴリー', () => {
  assert.deepEqual(CUSTOM_SUBJECTS.map((subject) => subject.label), ['英語', '古典', '漢文', '数学', '社会', '理科'])
  assert.deepEqual(CUSTOM_SUBJECTS.map((subject) => subject.appScreen), ['home', 'kotenList', 'kanbunHome', 'mathMap', 'socialHome', 'scienceHome'])
  const choices = customCategoryChoices([{ id: 'cat-1', title: '2学期中間英語', subject: 'english' }])
  assert.deepEqual(choices.map((choice) => choice.title), ['英語', '古典', '漢文', '数学', '社会', '理科', '2学期中間英語'])
  // 教科を選んだときの最初のテンプレート。
  assert.deepEqual(
    CUSTOM_SUBJECTS.map((subject) => defaultTemplateFor([], subjectCategoryId(subject.id))),
    ['english', 'koten', 'kanbun', 'qa', 'other', 'other'],
  )
})

test('独自のカテゴリー：作る・名前・既定のテンプレート・表示する教科・並べ替え・削除（中のカードごと）', () => {
  const original = useStore.getState()
  try {
    const store = freshStore()
    assert.equal(store.saveCustomCategory({ title: '  ' }).status, 'invalid')
    const created = store.saveCustomCategory({ title: '2学期中間英語' })
    assert.equal(created.status, 'saved')
    const second = useStore.getState().saveCustomCategory({ title: '期末社会', subject: 'social', template: 'qa' })
    let state = useStore.getState()
    assert.deepEqual(state.customCategories.map((category) => category.title), ['2学期中間英語', '期末社会'])
    assert.equal(categorySubject(state.customCategories, second.id), 'social')
    assert.equal(defaultTemplateFor(state.customCategories, second.id), 'qa')
    // 表示する教科のないカテゴリーは、教科のアプリには出ない。
    assert.equal(categorySubject(state.customCategories, created.id), null)

    // 名前・表示する教科・既定のテンプレートを変える。
    useStore.getState().saveCustomCategory({ id: created.id, title: '2学期中間 英語', subject: 'english', template: 'english' })
    state = useStore.getState()
    const renamed = state.customCategories.find((category) => category.id === created.id)
    assert.deepEqual([renamed.title, renamed.subject, renamed.template], ['2学期中間 英語', 'english', 'english'])
    assert.equal(defaultTemplateFor(state.customCategories, created.id), 'english')

    // 並べ替え
    useStore.getState().moveCustomCategory(second.id, 'up')
    assert.deepEqual(useStore.getState().customCategories.map((category) => category.id), [second.id, created.id])
    useStore.getState().moveCustomCategory(second.id, 'up')
    assert.deepEqual(useStore.getState().customCategories.map((category) => category.id), [second.id, created.id])
    useStore.getState().moveCustomCategory(second.id, 'down')
    assert.deepEqual(useStore.getState().customCategories.map((category) => category.id), [created.id, second.id])

    // カテゴリーへ、5つのテンプレートのカードを入れる。
    for (const template of CUSTOM_CARD_TEMPLATES) {
      const result = useStore.getState().saveCustomEntry({ template: template.id, category: created.id, values: sampleValues(template.id, template.id) })
      assert.equal(result.status, 'saved', template.id)
    }
    state = useStore.getState()
    const groups = customCategoryGroups({ words: state.customWords, cards: state.customCards, categories: state.customCategories })
    const group = groups.find((item) => item.category.id === created.id)
    assert.equal(group.words.length, 1)
    assert.equal(group.cards.length, 4)
    // 表示する教科（英語）のアプリにも出る。
    const english = customCategoryGroups({ words: state.customWords, cards: state.customCards, categories: state.customCategories }, { subject: 'english' })
    assert.deepEqual(english.map((item) => item.category.id), [subjectCategoryId('english'), created.id])

    // 単語帳に入れてから、カテゴリーを消す：中のカードも消え、単語帳・メモからも外れる。
    const setId = state.learningNotebook.sets[0].id
    useStore.getState().setNotebookSetRefs(setId, [
      ...state.customWords.map((word) => `vocab:${word.id}`),
      ...state.customCards.map((card) => `customCards:${card.id}`),
    ], true)
    useStore.getState().deleteCustomCategory(created.id)
    state = useStore.getState()
    assert.deepEqual(state.customCategories.map((category) => category.id), [second.id])
    assert.equal(state.customWords.length + state.customCards.length, 0)
    assert.equal(state.learningNotebook.sets[0].refs.some((ref) => ref.startsWith('customCards:') || ref.startsWith('vocab:u-')), false)

    // 上限：40個まで。
    let current = []
    let status = 'saved'
    for (let index = 0; index < CUSTOM_CARD_LIMITS.categories + 1; index += 1) {
      const result = useStore.getState().saveCustomCategory({ title: `カテゴリー${index}` })
      status = result.status
      current = useStore.getState().customCategories
    }
    assert.equal(current.length, CUSTOM_CARD_LIMITS.categories)
    assert.equal(status, 'full')
  } finally {
    useStore.setState(original, true)
  }
})

test('分類のないカード・ないカテゴリーを指すカードは、なくさずに分類をそろえる', () => {
  // 以前の自作単語（分類なし）は教科「英語」、消えたカテゴリーを指すカードは「名前のないカテゴリー」を作って残す。
  const card = normalizeCustomCard({ front: '表', back: '裏', category: 'cat-gone' })
  const reconciled = reconcileCustomCategories({ categories: [], cards: [card], words: [] })
  assert.deepEqual(reconciled.categories.map((category) => [category.id, category.title]), [['cat-gone', '名前のないカテゴリー']])
  assert.equal(reconciled.cards[0].category, 'cat-gone')
  assert.equal(normalizeCustomCard({ front: '表', back: '裏' }).category, subjectCategoryId('english'))
  assert.equal(normalizeCustomCard({ front: '表', back: '裏', template: 'english' }).template, 'other', '英単語はカードではなく自作単語で持つ')
})

test('以前のテンプレートで保存したカード・カテゴリーは「その他」になり、中身を残す', () => {
  const term = normalizeCustomCard({ id: 'c-old1', template: 'term', front: '三角州', back: '河口の平らな土地', category: 'subject:social' })
  const termNote = normalizeCustomCard({ id: 'c-old2', template: 'termNote', front: '扇状地', back: '扇の形の土地', note: '果樹園に使われる', category: 'subject:social' })
  assert.deepEqual([term.id, term.template, term.front, term.back, term.note], ['c-old1', 'other', '三角州', '河口の平らな土地', ''])
  assert.deepEqual([termNote.id, termNote.template, termNote.front, termNote.back, termNote.note], ['c-old2', 'other', '扇状地', '扇の形の土地', '果樹園に使われる'])
  assert.equal(normalizeCustomCategory({ id: 'cat-old', title: '期末社会', template: 'term' }).template, 'other')
  assert.equal(normalizeCustomCategory({ id: 'cat-old', title: '期末社会', template: 'termNote' }).template, 'other')
  assert.equal(normalizeCustomCategory({ id: 'cat-old', title: '期末社会', template: 'koten' }).template, 'koten')
})

test('登録の画面：テンプレートの選択・分類の選択（新しいカテゴリーを作る）・欄・入れる単語帳を持つ', () => {
  const form = read('../src/components/CustomCardForm.jsx')
  const screen = read('../src/screens/CustomWords.jsx')
  const items = read('../src/components/CustomCardItems.jsx')
  assert.match(form, /data-custom-card-templates/)
  assert.match(form, /role="radio"/)
  assert.match(form, /data-custom-card-template=\{template\.id\}/)
  assert.match(form, /data-custom-card-category/)
  assert.match(form, /NEW_CATEGORY_OPTION/)
  assert.match(form, /data-custom-card-new-category/)
  assert.match(form, /data-custom-word-book-select/)
  assert.match(screen, /saveCustomEntry\(\{ template, category: categoryId, values, previous: initial\.previous \}\)/)
  assert.match(screen, /saveCustomCategory\(\{ title: newCategoryTitle, subject, template \}\)/)
  assert.match(items, /data-custom-category-sheet/)
  assert.match(items, /deleteCustomCategory\(category\.id\)/)
  assert.match(items, /moveCustomCategory\(category\.id, 'up'\)/)
  assert.match(items, /中のカード\$\{cardCount\}枚も消えます/)
  for (const id of CARD_TEMPLATE_IDS) assert.ok(templateFor(id).quiz, `${id} のテストの問い方`)
})
