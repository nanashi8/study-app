import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  ALL_WORDS,
  getWord,
  pickDistractors,
  registerCustomWords,
} from '../src/data/vocab.js'
import {
  CUSTOM_WORD_LIMITS,
  buildCustomWordsFile,
  customStudyWords,
  customWordsFileText,
  isCustomWordId,
  mergeCustomWords,
  normalizeCustomWords,
  parseCustomWordsFile,
  removeCustomWord,
  upsertCustomWord,
} from '../src/lib/customWords.js'
import {
  NOTEBOOK_TOTAL_ITEMS,
  notebookItemsForDomain,
  resolveNotebookItem,
} from '../src/lib/learningNotebookCatalog.js'
import { buildDeck } from '../src/lib/session.js'
import {
  PERSISTED_PROGRESS_FIELDS,
  buildPayload,
  decodeProgress,
  encodeProgress,
} from '../src/lib/progressCode.js'
import { PROGRESS_RESET_GROUPS } from '../src/lib/progressReset.js'
import { progressStateFromPayload, useStore } from '../src/store/useStore.js'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

const sample = {
  word: ' serendipity ',
  meanings: '思いがけない発見・幸運な巡り合わせ',
  pos: '名',
  level: '1',
  field: '心・コミュニケーション',
  example: { en: 'It was pure serendipity.', ja: 'まったくの偶然だった。' },
}

test('自作単語は語と意味がそろったものだけを、上限つきで保存する', () => {
  const first = upsertCustomWord([], sample)
  assert.equal(first.status, 'saved')
  assert.ok(isCustomWordId(first.id))
  assert.deepEqual(first.words[0].meanings, ['思いがけない発見', '幸運な巡り合わせ'])
  assert.equal(first.words[0].word, 'serendipity')

  // 意味だけ、語だけの入力は登録として成り立たない。
  assert.equal(upsertCustomWord([], { word: 'x' }).status, 'invalid')
  assert.equal(upsertCustomWord([], { meanings: '意味だけ' }).status, 'invalid')

  // 同じIDへの保存は書き換え。件数は増えない。
  const edited = upsertCustomWord(first.words, {
    ...sample,
    id: first.id,
    meanings: '偶然の幸運',
  })
  assert.equal(edited.words.length, 1)
  assert.deepEqual(edited.words[0].meanings, ['偶然の幸運'])
  assert.equal(edited.words[0].createdAt, first.words[0].createdAt)

  assert.deepEqual(removeCustomWord(edited.words, first.id), [])

  const full = normalizeCustomWords(
    Array.from({ length: CUSTOM_WORD_LIMITS.words + 5 }, (_, index) => ({
      ...sample,
      id: `u-${index}`,
      word: `word${index}`,
    })),
  )
  assert.equal(full.length, CUSTOM_WORD_LIMITS.words)
  assert.equal(upsertCustomWord(full, sample).status, 'full')
})

test('JSONファイルは同じ形だけを読み戻し、足すか入れ替えるかを選べる', () => {
  const { words } = upsertCustomWord([], sample)
  const file = buildCustomWordsFile(words)
  assert.equal(file.kind, 'custom-words')
  assert.equal(file.words.length, 1)

  const parsed = parseCustomWordsFile(customWordsFileText(words))
  assert.equal(parsed.status, 'ok')
  assert.deepEqual(parsed.words, words)

  assert.equal(parseCustomWordsFile('{壊れた').status, 'broken')
  assert.equal(parseCustomWordsFile('{"kind":"progress"}').status, 'other')
  assert.equal(parseCustomWordsFile('{"words":[]}').status, 'empty')

  const other = upsertCustomWord([], { ...sample, word: 'ephemeral', meanings: 'つかの間の' })
  const merged = mergeCustomWords(words, [...other.words, { ...words[0], meanings: '書き換え' }])
  assert.equal(merged.words.length, 2)
  assert.equal(merged.addedCount, 1)
  assert.equal(merged.updatedCount, 1)
  assert.deepEqual(
    merged.words.find((word) => word.id === words[0].id).meanings,
    ['書き換え'],
  )

  const replaced = mergeCustomWords(words, other.words, { mode: 'replace' })
  assert.deepEqual(replaced.words, other.words)
})

test('自作単語は辞書へ混ぜず、ID の引き当てだけを共有して学習に乗る', () => {
  const dictionarySize = ALL_WORDS.length
  const catalogTotal = NOTEBOOK_TOTAL_ITEMS
  const dictionaryVocabItems = notebookItemsForDomain('vocab').length
  const { words } = upsertCustomWord([], sample)
  const [word] = customStudyWords(words)

  try {
    registerCustomWords([word])

    // 辞書本体と、全教材の件数は動かさない。
    assert.equal(ALL_WORDS.length, dictionarySize)
    assert.equal(NOTEBOOK_TOTAL_ITEMS, catalogTotal)
    assert.equal(ALL_WORDS.some((item) => isCustomWordId(item.id)), false)

    assert.equal(getWord(word.id)?.word, 'serendipity')
    // 単語帳から始める学習は、辞書の語と同じ経路で組める。
    const deck = buildDeck({ type: 'mylist', ids: [word.id] }, { size: 1 })
    assert.deepEqual(deck.map((item) => item.id), [word.id])
    // テストの誤答は辞書側から作れる（自作語だけでも3択が成り立つ）。
    assert.equal(pickDistractors(word, 2).length, 2)
    // マイ学習ノートでは、保存した自作語として引き当てられる。
    assert.equal(resolveNotebookItem('vocab', word.id)?.title, 'serendipity')
    assert.equal(resolveNotebookItem(`vocab:${word.id}`)?.domain, 'vocab')
    assert.equal(notebookItemsForDomain('vocab').length, dictionaryVocabItems + 1)
  } finally {
    registerCustomWords([])
  }
  assert.equal(getWord(word.id), undefined)
  assert.equal(resolveNotebookItem('vocab', word.id), null)
})

test('自作単語は端末保存・進捗コード・リセット分類の契約に載る', () => {
  assert.ok(PERSISTED_PROGRESS_FIELDS.includes('customWords'))
  assert.deepEqual(
    PROGRESS_RESET_GROUPS.find((group) => group.id === 'customWords')?.fields,
    ['customWords'],
  )

  const original = useStore.getState()
  try {
    const saved = useStore.getState().saveCustomWord(sample)
    assert.equal(saved.status, 'saved')
    const state = useStore.getState()
    assert.equal(state.customWords.length, 1)
    // 保存した直後から、辞書と同じ引き当てで学習画面が語を取り出せる。
    assert.equal(getWord(saved.id)?.word, 'serendipity')

    // 「マイ単語」も自分で作った単語帳も、同じ操作で入れる。
    const myWordsId = useStore.getState().learningNotebook.sets[0].id
    const setId = useStore.getState().createNotebookSet('テスト範囲')
    useStore.getState().setNotebookSetItem(myWordsId, 'vocab', saved.id, true)
    useStore.getState().setNotebookSetItem(setId, 'vocab', saved.id, true)
    const books = useStore.getState().learningNotebook.sets
    assert.ok(books.every((set) => set.refs.includes(`vocab:${saved.id}`)))

    const payload = buildPayload(useStore.getState())
    assert.equal(payload.customWords.length, 1)
    assert.deepEqual(
      progressStateFromPayload(decodeProgress(encodeProgress(useStore.getState()))).customWords,
      state.customWords,
    )

    // 語を消したら、どの単語帳・辞書履歴からも一緒に外れる。
    useStore.getState().deleteCustomWord(saved.id)
    const after = useStore.getState()
    assert.deepEqual(after.customWords, [])
    assert.equal(after.vocabHistory.includes(saved.id), false)
    assert.ok(after.learningNotebook.sets.every((set) => !set.refs.includes(`vocab:${saved.id}`)))
    assert.equal(after.learningNotebook.entries[`vocab:${saved.id}`], undefined)
    assert.equal(getWord(saved.id), undefined)
  } finally {
    useStore.setState(original, true)
  }
})

test('自作単語の画面は登録・編集・削除とファイルの出し入れを一つの入口にまとめる', () => {
  const screen = read('../src/screens/CustomWords.jsx')
  const app = read('../src/App.jsx')
  const menu = read('../src/lib/appMenu.js')
  const home = read('../src/lib/appHome.js')

  assert.match(app, /customWords: CustomWordsScreen/)
  assert.match(menu, /screenItem\('customWords', '自作単語'/)
  assert.match(home, /'customWords'/)
  assert.match(screen, /data-custom-word-form/)
  assert.match(screen, /data-custom-word-save/)
  assert.match(screen, /data-custom-word-delete/)
  assert.match(screen, /data-custom-words-file-input/)
  assert.match(screen, /data-custom-words-import-choice/)
  assert.match(screen, /saveCustomWord/)
  assert.match(screen, /deleteCustomWord/)
  assert.match(screen, /importCustomWords/)
  // 登録した語は、選んだ単語帳（最初は並びの先頭の冊）に入り、暗記・テストへつながる。
  assert.match(screen, /data-custom-word-book-select/)
  assert.match(screen, /setNotebookSetItem\(bookId, 'vocab', result\.id, true\)/)
  assert.doesNotMatch(screen, /toggleMyList|myList|単語帳「マイ単語」/)
  assert.match(screen, /<WordListSheet/)
  assert.match(screen, /navigate\(screen, \{/)
  // 枚数は「1回のカード数」に任せ、画面側で頭打ちにしない。
  assert.match(screen, /source: \{ type: 'mylist', ids \}/)
  assert.doesNotMatch(screen, /SESSION_LIMIT/)
})
