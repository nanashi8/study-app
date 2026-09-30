// 自作カードの編集：選んだカードの移動・統合・削除と、カテゴリーの統合
// （依頼台帳 requests/2026-09-30-custom-card-form-followup.json の edit-mode・move-cards・merge-cards・merge-categories・delete-selected）。
// 2026-09-30 利用者:「自作カードを編集したり、別のカードに移動したり、カード同士を統合できるように編集機能も実装しなさい。」
// 画面の操作（375px）は tests/custom-cards-edit-screens.test.mjs。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_TEMPLATE_IDS,
  CUSTOM_CARD_LIMITS,
  CUSTOM_CARD_QUIZ_DOMAIN,
  CUSTOM_CARD_TEMPLATES,
  CUSTOM_SUBJECTS,
  subjectCategoryId,
  templateFor,
} from '../src/lib/customCards.js'
import { CUSTOM_WORD_LIMITS } from '../src/lib/customWords.js'
import {
  MERGE_BLOCKER_TEXT,
  dropQuizResults,
  dropReviewRecords,
  entryKey,
  mergeBlocker,
  mergeCardsPreview,
  mergeHistoryIds,
  mergeQuizResults,
  mergeReviewRecords,
  mergeWordsPreview,
  mergedReviewRecord,
  moveEntriesToCategory,
  parseEntryKey,
  splitEntryKeys,
} from '../src/lib/customCardsEdit.js'
import { mergeNotebookItemRefs } from '../src/lib/learningNotebook.js'
import { contentQuizKey } from '../src/lib/contentProgress.js'
import { emptyEntryValues } from '../src/lib/customEntryForm.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const NOW = Date.UTC(2026, 8, 30)

function freshStore() {
  const initial = useStore.getInitialState()
  useStore.setState({
    ...initial,
    customWords: [],
    customCards: [],
    customCategories: [],
    customCardSrs: {},
    srs: {},
    contentQuizResults: {},
    vocabHistory: [],
    learningNotebook: initial.learningNotebook,
  }, true)
  return useStore.getState()
}

// テンプレートごとの1枚（英単語は単語と意味）。tag で見分ける。
function valuesFor(template, tag) {
  if (template === 'english') {
    return { ...emptyEntryValues(), front: `word${tag}`, back: `意味${tag}`, posId: '名', level: '3', field: '基本・日常' }
  }
  return {
    ...emptyEntryValues(),
    front: `表${tag}`,
    back: `裏${tag}`,
    reading: `よみ${tag}`,
    kanji: `漢${tag}`,
    pos: `品詞${tag}`,
    example: `例文${tag}`,
    exampleTranslation: `訳${tag}`,
    note: `解説${tag}`,
  }
}

const withStore = (run) => {
  const original = useStore.getState()
  try {
    return run(freshStore())
  } finally {
    useStore.setState(original, true)
  }
}

const refOf = (kind, id) => `${kind === 'word' ? 'vocab' : 'customCards'}:${id}`

test('選んだカードの鍵：英単語のカードとほかのカードを分けて持つ', () => {
  assert.equal(entryKey('word', 'u-1'), 'word:u-1')
  assert.deepEqual(parseEntryKey('card:c-1'), { kind: 'card', id: 'c-1' })
  assert.equal(parseEntryKey('other:c-1'), null)
  assert.equal(parseEntryKey('card:'), null)
  assert.deepEqual(splitEntryKeys(['word:u-1', 'card:c-1', 'card:c-2', 'card:c-1', 'bad']), { wordIds: ['u-1'], cardIds: ['c-1', 'c-2'] })
})

test('移動：5つのテンプレートのカードを、教科・作ったカテゴリー・新しいカテゴリーへ移す。ID・記録・単語帳・メモはそのまま', () => withStore((store) => {
  const created = store.saveCustomCategory({ title: '2学期中間英語' })
  const saved = CUSTOM_CARD_TEMPLATES.map((template) => ({
    template: template.id,
    ...useStore.getState().saveCustomEntry({ template: template.id, category: subjectCategoryId('social'), values: valuesFor(template.id, template.id) }),
  }))
  const setId = useStore.getState().learningNotebook.sets[0].id
  useStore.getState().setNotebookSetRefs(setId, saved.map((item) => refOf(item.kind, item.id)), true)
  useStore.getState().updateNotebookItem('customCards', saved.find((item) => item.kind === 'card').id, { note: '単語帳のメモ' })
  for (const item of saved) {
    if (item.kind === 'card') useStore.getState().reviewCustomCard(item.id, 'remembered')
  }
  const before = useStore.getState()
  const recordsBefore = before.customCardSrs
  const wordIds = saved.filter((item) => item.kind === 'word').map((item) => item.id)
  const cardIds = saved.filter((item) => item.kind === 'card').map((item) => item.id)

  // 教科の分類へ（6教科どれも移し先になる）。
  for (const subject of CUSTOM_SUBJECTS) {
    const result = useStore.getState().moveCustomEntries({ wordIds, cardIds, category: subjectCategoryId(subject.id) })
    assert.equal(result.status, 'moved', subject.id)
    const state = useStore.getState()
    assert.ok([...state.customWords, ...state.customCards].every((entry) => entry.category === subjectCategoryId(subject.id)), `${subject.label}へ移る`)
  }
  // 同じ分類へ移しても数えない。
  assert.equal(useStore.getState().moveCustomEntries({ wordIds, cardIds, category: subjectCategoryId('science') }).movedCount, 0)
  // 作ったカテゴリーへ。
  assert.equal(useStore.getState().moveCustomEntries({ wordIds, cardIds, category: created.id }).movedCount, 5)
  // 新しいカテゴリー（画面はシートで作ってから移す）へ。
  const fresh = useStore.getState().saveCustomCategory({ title: '期末テスト' })
  assert.equal(useStore.getState().moveCustomEntries({ wordIds: wordIds.slice(0, 1), cardIds: cardIds.slice(0, 2), category: fresh.id }).movedCount, 3)
  const state = useStore.getState()
  assert.equal([...state.customWords, ...state.customCards].filter((entry) => entry.category === fresh.id).length, 3)
  assert.equal([...state.customWords, ...state.customCards].filter((entry) => entry.category === created.id).length, 2)
  // ID は変わらず、記録・単語帳・メモはそのまま。
  assert.deepEqual(state.customCards.map((card) => card.id).sort(), [...cardIds].sort())
  assert.deepEqual(state.customCardSrs, recordsBefore)
  assert.deepEqual(state.learningNotebook.sets[0].refs, before.learningNotebook.sets[0].refs)
  assert.deepEqual(state.learningNotebook.entries, before.learningNotebook.entries)
  // ない分類へは移さない。
  assert.equal(useStore.getState().moveCustomEntries({ wordIds, cardIds, category: 'cat-none' }).status, 'invalid')
  assert.equal(useStore.getState().moveCustomEntries({ wordIds, cardIds, category: 'subject:music' }).status, 'invalid')
  // 計算そのもの：分類の形でない移し先は何もしない。
  const same = moveEntriesToCategory({ words: state.customWords, cards: state.customCards }, { wordIds, cardIds, category: 'なし' })
  assert.equal(same.movedCount, 0)
}))

test('統合できるか：2枚以上・同じ種類（英単語どうし）・同じテンプレートどうし', () => {
  const card = (template) => ({ kind: 'card', entry: { template } })
  const word = { kind: 'word', entry: { word: 'a' } }
  assert.equal(mergeBlocker([card('other')]), 'count')
  assert.equal(mergeBlocker([word, card('other')]), 'kind')
  assert.equal(mergeBlocker([card('other'), card('qa')]), 'template')
  // 以前のテンプレートの名前は「その他」と同じに扱う。
  assert.equal(mergeBlocker([card('other'), card('term'), card('termNote')]), null)
  assert.equal(mergeBlocker([word, { kind: 'word', entry: { word: 'b' } }]), null)
  for (const key of ['count', 'kind', 'template']) assert.ok(MERGE_BLOCKER_TEXT[key], key)
})

test('統合（英単語以外の4つのテンプレート）：空の欄は埋め、同じ文は重ねず、ちがう文は消さずに並べるか解説へ。上限を超える欄は知らせる', () => {
  for (const template of CARD_TEMPLATE_IDS) {
    const fields = templateFor(template).fields
    const multiline = (item) => ['back', 'example', 'exampleTranslation', 'note'].includes(item.key) || item.multiline
    const target = { id: 'c-a', template, category: 'cat-x', front: '表', back: '裏A', reading: '', kanji: '', pos: '', example: '', exampleTranslation: '', note: '解説A', createdAt: 1, updatedAt: 1 }
    const same = { ...target, id: 'c-b', back: '裏A', note: '解説A', reading: 'よみB' }
    const other = { ...target, id: 'c-c', front: '別の表', back: '裏C', note: '解説C', reading: 'よみC', kanji: '漢C', pos: '品詞C', example: '例文C', exampleTranslation: '訳C' }
    const preview = mergeCardsPreview([target, same, other], 'c-a', { now: NOW })
    const card = preview.card
    assert.equal(card.id, 'c-a', `${template}：残すカードの ID`)
    assert.equal(card.template, template)
    assert.equal(card.category, 'cat-x')
    assert.deepEqual(preview.sources.map((item) => item.id), ['c-b', 'c-c'])
    // 裏（意味・答え）：同じ文は1つ、ちがう文は行を分けて並べる。
    assert.equal(card.back, '裏A\n裏C', `${template}：裏`)
    for (const item of fields) {
      if (item.key === 'note' || item.key === 'back') continue
      if (multiline(item)) {
        // 複数行の欄（例文・訳・一問一答の問題）：空なら埋める、ちがう文は並べる。
        const expected = item.key === 'front' ? '表\n別の表' : { example: '例文C', exampleTranslation: '訳C' }[item.key]
        assert.equal(card[item.key], expected, `${template}.${item.key}`)
      } else if (item.key === 'front') {
        // 1行の見出し：残すカードの文のまま、ちがう文は解説へ。
        assert.equal(card.front, '表', `${template}：見出しは残すカードのもの`)
        assert.ok(card.note.includes(`${item.label}：別の表`), `${template}：ちがう見出しは解説へ`)
      } else {
        // 1行の欄（読み・漢字・品詞）：空なら最初に書いてあるカードの文、ちがう文は解説へ。
        const first = { reading: 'よみB', kanji: '漢C', pos: '品詞C' }[item.key]
        assert.equal(card[item.key], first, `${template}.${item.key}`)
        if (item.key === 'reading') assert.ok(card.note.includes(`${item.label}：よみC`), `${template}：ちがう読みは解説へ`)
      }
    }
    // 解説：同じ文は1つ、ちがう文も残す。
    assert.ok(card.note.startsWith('解説A\n解説C'), `${template}：解説`)
    assert.deepEqual(preview.cut, [], `${template}：上限を超えない`)

    // 上限を超える中身は知らせる（統合は画面が確かめてから行う）。
    const long = { ...target, id: 'c-long', back: 'あ'.repeat(CUSTOM_CARD_LIMITS.back) }
    const cut = mergeCardsPreview([target, long], 'c-a').cut
    assert.deepEqual(cut.map((item) => item.key), ['back'], `${template}：裏が上限を超える`)
    assert.equal(cut[0].limit, CUSTOM_CARD_LIMITS.back)
  }
})

test('統合（英単語）：意味は4つまで、品詞のちがう意味とあふれた意味は「ほかの意味」へ、関連する語・熟語は重ねずに足し、ちがう例文・発音・つづりはメモへ', () => {
  const base = { level: '3', field: '基本・日常', otherSenses: [], derivatives: [], synonyms: [], antonyms: [], confusables: [], phrases: [], etymology: '', note: '', phonetic: '', example: null, category: 'cat-x', createdAt: 1, updatedAt: 1 }
  const target = { ...base, id: 'u-a', word: 'popular', meanings: ['人気のある', '大衆の'], pos: '形', phonetic: '/pɑ́pjələr/', synonyms: [{ w: 'famous', m: '' }], example: { en: 'It is popular.', ja: 'それは人気だ。' }, etymology: '「人々」から' }
  const samePos = { ...base, id: 'u-b', word: 'popular', meanings: ['人気のある', '評判のよい', 'はやりの', '民衆の'], pos: '形', synonyms: [{ w: 'famous', m: '有名な' }, { w: 'well-known', m: 'よく知られた' }], phrases: [{ phrase: 'be popular with', meaning: '〜に人気がある' }], etymology: '「人々」から' }
  const nounPos = { ...base, id: 'u-c', word: 'Popular', meanings: ['人気者'], pos: '名', phonetic: '/pɑ́pjulər/', example: { en: 'He is a popular.', ja: '彼は人気者だ。' }, note: '口語', etymology: 'ラテン語の populus' }
  const { word, sources, cut } = mergeWordsPreview([target, samePos, nounPos], 'u-a', { now: NOW })
  assert.equal(word.id, 'u-a')
  assert.equal(word.word, 'popular')
  assert.deepEqual(sources.map((item) => item.id), ['u-b', 'u-c'])
  // 同じ品詞の意味は4つまで。あふれた意味と、品詞のちがうカードの意味は「ほかの意味」へ。
  assert.deepEqual(word.meanings, ['人気のある', '大衆の', '評判のよい', 'はやりの'])
  assert.deepEqual(word.otherSenses, [{ pos: '名', meaning: '人気者' }, { pos: '形', meaning: '民衆の' }])
  // 関連する語：同じ語は1つにし、空の意味はあとのカードで埋める。熟語も足す。
  assert.deepEqual(word.synonyms, [{ w: 'famous', m: '有名な' }, { w: 'well-known', m: 'よく知られた' }])
  assert.deepEqual(word.phrases, [{ phrase: 'be popular with', meaning: '〜に人気がある' }])
  // 例文・発音記号は残すカードのもの。ちがう例文・発音記号はメモへ（つづりは大文字小文字のちがいだけなら同じ語）。
  assert.deepEqual(word.example, target.example)
  assert.equal(word.phonetic, target.phonetic)
  assert.ok(word.note.includes('口語'))
  assert.ok(word.note.includes('発音記号：/pɑ́pjulər/'))
  assert.ok(word.note.includes('例文：He is a popular.（彼は人気者だ。）'))
  assert.ok(!word.note.includes('ほかの書き方'), '大文字小文字だけのちがいは同じつづり')
  assert.equal(word.etymology, '「人々」から ／ ラテン語の populus')
  assert.deepEqual(cut, [])

  // ほかの意味・関連する語の上限を超える分は、メモへ。
  const many = { ...base, id: 'u-d', word: 'popular', meanings: ['意味'], pos: '形', otherSenses: Array.from({ length: CUSTOM_WORD_LIMITS.otherSenses }, (_, index) => ({ pos: '名', meaning: `名詞の意味${index}` })), antonyms: Array.from({ length: CUSTOM_WORD_LIMITS.relatedWords }, (_, index) => ({ w: `anti${index}`, m: '' })) }
  const extra = { ...base, id: 'u-e', word: 'populer', meanings: ['意味'], pos: '動', antonyms: [{ w: 'extra', m: '余り' }] }
  const merged = mergeWordsPreview([many, extra], 'u-d').word
  assert.equal(merged.otherSenses.length, CUSTOM_WORD_LIMITS.otherSenses)
  assert.equal(merged.antonyms.length, CUSTOM_WORD_LIMITS.relatedWords)
  assert.ok(merged.note.includes('ほかの意味：動詞・意味') || merged.note.includes('ほかの意味：動・意味'), merged.note)
  assert.ok(merged.note.includes('反意語：extra（余り）'))
  assert.ok(merged.note.includes('ほかの書き方：populer'))
  // メモが上限を超えるときは知らせる。
  const longNote = { ...base, id: 'u-f', word: 'popular', meanings: ['意味'], pos: '形', note: 'あ'.repeat(CUSTOM_WORD_LIMITS.note) }
  assert.deepEqual(mergeWordsPreview([{ ...many, note: 'メモ' }, longNote], 'u-d').cut.map((item) => item.key), ['note'])
  assert.deepEqual(mergeWordsPreview([many, longNote], 'u-d').cut, [], 'ちょうど上限の字数は入る')
})

test('記録・テストの結果・単語帳・辞書の履歴を、残すカードへ寄せる計算', () => {
  const low = { box: 1, memory: { lastAt: 10 } }
  const high = { box: 3, memory: { lastAt: 5 } }
  const recent = { box: 3, test: { lastAt: 20 } }
  // 残すカードの記録があればそれ。
  assert.equal(mergedReviewRecord({ a: low, b: high }, 'a', ['b']), low)
  // なければ、学習の進んだ記録（箱が大きい→最後に学んだのが新しい）。
  assert.equal(mergedReviewRecord({ b: high, c: recent, d: low }, 'a', ['b', 'c', 'd']), recent)
  assert.equal(mergedReviewRecord({}, 'a', ['b']), null)
  assert.deepEqual(mergeReviewRecords({ b: high, x: low }, 'a', ['b']), { a: high, x: low })
  assert.deepEqual(dropReviewRecords({ a: low, b: high }, ['a']), { b: high })

  const key = (id) => contentQuizKey(CUSTOM_CARD_QUIZ_DOMAIN, id)
  const results = { [key('b')]: { correct: 1, total: 1, lastAt: 5 }, [key('c')]: { correct: 0, total: 1, lastAt: 9 }, other: { total: 1 } }
  assert.deepEqual(mergeQuizResults(results, CUSTOM_CARD_QUIZ_DOMAIN, 'a', ['b', 'c']), { other: { total: 1 }, [key('a')]: { correct: 0, total: 1, lastAt: 9 } })
  assert.deepEqual(dropQuizResults(results, CUSTOM_CARD_QUIZ_DOMAIN, ['b', 'c']), { other: { total: 1 } })
  assert.deepEqual(mergeHistoryIds(['x', 'b', 'a', 'c', 'y'], 'a', ['b', 'c']), ['x', 'a', 'y'])

  // 単語帳：同じ冊に両方あれば1つに、残すカードがない冊は元の位置に入れる。メモはつなぎ、タグは合わせ、保存はどれか。
  const notebook = {
    sets: [
      { id: 's1', title: '冊1', refs: ['customCards:b', 'customCards:x', 'customCards:a'] },
      { id: 's2', title: '冊2', refs: ['customCards:x', 'customCards:c'] },
    ],
    entries: {
      'customCards:a': { saved: false, note: 'メモA', tags: ['t1'] },
      'customCards:b': { saved: true, note: 'メモB', tags: ['t1', 't2'] },
      'customCards:c': { saved: false, note: 'メモA', tags: [] },
    },
  }
  const merged = mergeNotebookItemRefs(notebook, ['customCards:b', 'customCards:c'], 'customCards:a', NOW)
  assert.deepEqual(merged.sets.map((set) => set.refs), [['customCards:x', 'customCards:a'], ['customCards:x', 'customCards:a']])
  assert.deepEqual(Object.keys(merged.entries), ['customCards:a'])
  assert.equal(merged.entries['customCards:a'].note, 'メモA\n\nメモB')
  assert.deepEqual(merged.entries['customCards:a'].tags, ['t1', 't2'])
  assert.equal(merged.entries['customCards:a'].saved, true)
})

test('ストアの統合：英単語どうし・同じテンプレートのカードどうしを1枚にし、記録・テストの結果・単語帳・メモ・履歴を寄せて、ほかを消す', () => withStore((store) => {
  for (const template of CUSTOM_CARD_TEMPLATES) {
    freshStore()
    const ids = ['1', '2', '3'].map((tag) => useStore.getState().saveCustomEntry({ template: template.id, category: subjectCategoryId('english'), values: valuesFor(template.id, tag) }).id)
    const kind = template.id === 'english' ? 'word' : 'card'
    const [target, ...sources] = ids
    const setId = useStore.getState().learningNotebook.sets[0].id
    useStore.getState().setNotebookSetRefs(setId, ids.map((id) => refOf(kind, id)), true)
    useStore.getState().updateNotebookItem(kind === 'word' ? 'vocab' : 'customCards', sources[0], { note: 'ほかのカードのメモ' })
    // 残すカードに記録はなく、ほかのカードに記録がある。
    if (kind === 'word') {
      useStore.getState().recordVocabHistory(sources[1])
      useStore.setState({ srs: { [sources[0]]: { box: 2, due: 1 }, [sources[1]]: { box: 4, due: 2 } } })
    } else {
      useStore.setState({ customCardSrs: { [sources[0]]: { box: 2, due: 1 }, [sources[1]]: { box: 4, due: 2 } } })
      useStore.getState().recordContentQuizResult(CUSTOM_CARD_QUIZ_DOMAIN, sources[0], 1, 1)
    }
    const result = useStore.getState().mergeCustomEntries({ kind, targetId: target, sourceIds: sources })
    assert.deepEqual(result, { status: 'merged', id: target, mergedCount: 2 }, template.id)
    const state = useStore.getState()
    const list = kind === 'word' ? state.customWords : state.customCards
    assert.deepEqual(list.map((item) => item.id), [target], `${template.id}：1枚になる`)
    const merged = list[0]
    if (kind === 'word') {
      assert.deepEqual(merged.meanings, ['意味1', '意味2', '意味3'])
      assert.deepEqual(state.srs[target], { box: 4, due: 2 }, '英単語：学習の進んだ記録を移す')
      assert.equal(state.srs[sources[0]], undefined)
      assert.ok(state.vocabHistory.includes(target) && !state.vocabHistory.includes(sources[1]), '辞書の履歴')
    } else {
      assert.equal(merged.back, '裏1\n裏2\n裏3', `${template.id}：裏`)
      assert.deepEqual(state.customCardSrs[target], { box: 4, due: 2 }, `${template.id}：学習の進んだ記録を移す`)
      assert.equal(state.customCardSrs[sources[0]], undefined)
      assert.ok(state.contentQuizResults[contentQuizKey(CUSTOM_CARD_QUIZ_DOMAIN, target)], `${template.id}：テストの結果`)
      assert.equal(state.contentQuizResults[contentQuizKey(CUSTOM_CARD_QUIZ_DOMAIN, sources[0])], undefined)
    }
    assert.deepEqual(state.learningNotebook.sets[0].refs, [refOf(kind, target)], `${template.id}：単語帳は1つに`)
    assert.equal(state.learningNotebook.entries[refOf(kind, target)]?.note, 'ほかのカードのメモ', `${template.id}：メモを寄せる`)
  }

  // 統合できない選び方・残すカードのない呼び方は、何もしない。
  freshStore()
  const card = useStore.getState().saveCustomEntry({ template: 'other', category: subjectCategoryId('social'), values: valuesFor('other', 'A') }).id
  const qa = useStore.getState().saveCustomEntry({ template: 'qa', category: subjectCategoryId('social'), values: valuesFor('qa', 'B') }).id
  assert.equal(useStore.getState().mergeCustomEntries({ kind: 'card', targetId: card, sourceIds: [qa] }).status, 'invalid', 'テンプレートがちがう')
  assert.equal(useStore.getState().mergeCustomEntries({ kind: 'card', targetId: card, sourceIds: [] }).status, 'invalid', '1枚だけ')
  assert.equal(useStore.getState().mergeCustomEntries({ kind: 'card', targetId: 'c-none', sourceIds: [card] }).status, 'invalid', '残すカードがない')
  assert.equal(useStore.getState().customCards.length, 2)
  assert.equal(store.customCards.length, 0)
}))

test('まとめて削除：英単語のカードとほかのカードを消し、記録・テストの結果・単語帳・メモ・辞書の履歴からも外す（1枚の削除も同じ）', () => withStore(() => {
  const word = useStore.getState().saveCustomEntry({ template: 'english', category: subjectCategoryId('english'), values: valuesFor('english', 'W') }).id
  const card = useStore.getState().saveCustomEntry({ template: 'koten', category: subjectCategoryId('koten'), values: valuesFor('koten', 'K') }).id
  const kept = useStore.getState().saveCustomEntry({ template: 'kanbun', category: subjectCategoryId('kanbun'), values: valuesFor('kanbun', 'N') }).id
  const setId = useStore.getState().learningNotebook.sets[0].id
  useStore.getState().setNotebookSetRefs(setId, [refOf('word', word), refOf('card', card), refOf('card', kept)], true)
  useStore.getState().updateNotebookItem('customCards', card, { note: 'メモ' })
  useStore.getState().recordVocabHistory(word)
  useStore.setState({ srs: { [word]: { box: 1 } }, customCardSrs: { [card]: { box: 1 }, [kept]: { box: 2 } } })
  useStore.getState().recordContentQuizResult(CUSTOM_CARD_QUIZ_DOMAIN, card, 1, 1)
  const result = useStore.getState().deleteCustomEntries({ wordIds: [word], cardIds: [card, 'c-none'] })
  assert.deepEqual(result, { deletedCount: 2 })
  let state = useStore.getState()
  assert.deepEqual(state.customWords, [])
  assert.deepEqual(state.customCards.map((item) => item.id), [kept])
  assert.deepEqual(state.srs, {})
  assert.deepEqual(state.customCardSrs, { [kept]: { box: 2 } })
  assert.equal(state.contentQuizResults[contentQuizKey(CUSTOM_CARD_QUIZ_DOMAIN, card)], undefined)
  assert.deepEqual(state.learningNotebook.sets[0].refs, [refOf('card', kept)])
  assert.equal(state.learningNotebook.entries[refOf('card', card)], undefined)
  assert.ok(!state.vocabHistory.includes(word))
  // 1枚の削除（カードの「削除」）も同じ片付けをする。
  useStore.getState().deleteCustomCard(kept)
  state = useStore.getState()
  assert.deepEqual(state.customCards, [])
  assert.deepEqual(state.customCardSrs, {})
  assert.deepEqual(state.learningNotebook.sets[0].refs, [])
  assert.deepEqual(useStore.getState().deleteCustomEntries({ wordIds: ['u-none'] }), { deletedCount: 0 })
}))

test('カテゴリーの統合：中のカードをすべてほかの分類（教科・作ったカテゴリー）へ移して、元のカテゴリーを消す。記録・単語帳はそのまま', () => withStore(() => {
  const from = useStore.getState().saveCustomCategory({ title: '1学期中間英語' }).id
  const into = useStore.getState().saveCustomCategory({ title: '2学期中間英語' }).id
  const word = useStore.getState().saveCustomEntry({ template: 'english', category: from, values: valuesFor('english', 'W') }).id
  const card = useStore.getState().saveCustomEntry({ template: 'qa', category: from, values: valuesFor('qa', 'Q') }).id
  const setId = useStore.getState().learningNotebook.sets[0].id
  useStore.getState().setNotebookSetRefs(setId, [refOf('word', word), refOf('card', card)], true)
  useStore.setState({ customCardSrs: { [card]: { box: 3 } } })
  const result = useStore.getState().mergeCustomCategory(from, into)
  assert.deepEqual(result, { status: 'merged', movedCount: 2, category: into })
  let state = useStore.getState()
  assert.deepEqual(state.customCategories.map((category) => category.id), [into])
  assert.equal(state.customWords[0].category, into)
  assert.equal(state.customCards[0].category, into)
  assert.deepEqual(state.customCardSrs, { [card]: { box: 3 } })
  assert.deepEqual(state.learningNotebook.sets[0].refs, [refOf('word', word), refOf('card', card)])
  // 教科へまとめる。空のカテゴリーもまとめられる（消える）。
  const empty = useStore.getState().saveCustomCategory({ title: '空のカテゴリー' }).id
  assert.deepEqual(useStore.getState().mergeCustomCategory(empty, subjectCategoryId('social')), { status: 'merged', movedCount: 0, category: subjectCategoryId('social') })
  assert.equal(useStore.getState().mergeCustomCategory(into, subjectCategoryId('english')).movedCount, 2)
  state = useStore.getState()
  assert.deepEqual(state.customCategories, [])
  assert.ok([...state.customWords, ...state.customCards].every((entry) => entry.category === subjectCategoryId('english')))
  // 自分自身・ない分類・教科の分類そのものは、まとめない。
  const again = useStore.getState().saveCustomCategory({ title: 'もう1つ' }).id
  assert.equal(useStore.getState().mergeCustomCategory(again, again).status, 'invalid')
  assert.equal(useStore.getState().mergeCustomCategory(again, 'cat-none').status, 'invalid')
  assert.equal(useStore.getState().mergeCustomCategory(subjectCategoryId('english'), again).status, 'invalid')
}))

test('編集の画面：一覧の「編集」、選んだカードの操作の欄（書き換える・別の分類へ移す・1枚に統合する・削除）、移動と統合のシート、カテゴリーの統合', () => {
  const screen = read('../src/screens/CustomWords.jsx')
  const edit = read('../src/components/CustomCardEdit.jsx')
  const items = read('../src/components/CustomCardItems.jsx')
  assert.match(screen, /data-custom-edit-toggle/)
  assert.match(screen, /mode=\{editing \? 'select' : 'list'\}/)
  assert.match(screen, /<CustomEditBar/)
  assert.match(screen, /<MoveEntriesSheet/)
  assert.match(screen, /<MergeEntriesSheet/)
  assert.match(screen, /moveCustomEntries\(\{ \.\.\.splitEntryKeys\(selectedVisible\), category: target \}\)/)
  assert.match(screen, /deleteCustomEntries\(splitEntryKeys\(selectedVisible\)\)/)
  // 操作は、しぼり込みで見えているカードにだけ行う。
  assert.match(screen, /const selectedVisible = selectedKeys\.filter\(\(key\) => visibleKeys\.includes\(key\)\)/)
  for (const action of ['edit', 'move', 'merge', 'delete']) assert.match(edit, new RegExp(`data-custom-edit-action="${action}"`))
  assert.match(edit, /data-custom-merge-preview/)
  assert.match(edit, /data-custom-merge-blocked/)
  assert.match(edit, /data-custom-move-target/)
  assert.match(items, /data-custom-entry-select/)
  assert.match(items, /data-custom-category-merge-target/)
  assert.match(items, /mergeCustomCategory\(category\.id, mergeTarget\)/)
})
