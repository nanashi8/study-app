import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS, registerCustomWords } from '../src/data/vocab.js'
import { customStudyWords, upsertCustomWord } from '../src/lib/customWords.js'
import {
  MY_WORDS_BOOK_ID,
  MY_WORDS_BOOK_TITLE,
  findWordBook,
  wordBookVocabIds,
  wordBooksFromState,
} from '../src/lib/wordBooks.js'
import { useStore } from '../src/store/useStore.js'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

test('単語帳の並びはマイ単語が先頭で、出題・一覧に出せる語だけを数える', () => {
  const [a, b, c] = ALL_WORDS
  const state = {
    myList: [a.id, 'no-such-word', b.id],
    learningNotebook: {
      sets: [{
        id: 'notebook-set-1',
        title: 'テスト範囲',
        refs: [`vocab:${c.id}`, 'phrases:some-phrase', 'vocab:no-such-word'],
      }],
    },
  }
  assert.deepEqual(
    wordBooksFromState(state).map((book) => [book.id, book.title, book.ids, book.renamable]),
    [
      [MY_WORDS_BOOK_ID, MY_WORDS_BOOK_TITLE, [a.id, b.id], false],
      ['notebook-set-1', 'テスト範囲', [c.id], true],
    ],
  )
  // 熟語など英単語以外の項目は、単語帳の語として数えない。
  assert.deepEqual(wordBookVocabIds(state.learningNotebook.sets[0]), [c.id, 'no-such-word'])
  assert.equal(findWordBook(state, 'notebook-set-1')?.title, 'テスト範囲')
  assert.equal(findWordBook(state, 'deleted-set'), null)
})

test('自作単語も単語帳の語として数え、辞書の語と同じ一覧に並ぶ', () => {
  const { words } = upsertCustomWord([], {
    word: 'serendipity',
    meanings: '思いがけない発見',
    level: '1',
    pos: '名',
  })
  const [custom] = customStudyWords(words)
  try {
    registerCustomWords([custom])
    const [myWords] = wordBooksFromState({ myList: [ALL_WORDS[0].id, custom.id], learningNotebook: { sets: [] } })
    assert.deepEqual(myWords.ids, [ALL_WORDS[0].id, custom.id])
  } finally {
    registerCustomWords([])
  }
})

test('名前をつけた単語帳は名前を変えられ、空の名前では元の名前を保つ', () => {
  const original = useStore.getState()
  try {
    const setId = useStore.getState().createNotebookSet('テスト範囲')
    useStore.getState().updateNotebookSet(setId, { title: '  期末テスト  ' })
    assert.equal(findWordBook(useStore.getState(), setId)?.title, '期末テスト')
    useStore.getState().updateNotebookSet(setId, { title: '   ' })
    assert.equal(findWordBook(useStore.getState(), setId)?.title, '期末テスト')
    // マイ単語は各画面の保存先の名前なので、名前の変更対象にしない。
    assert.equal(findWordBook(useStore.getState(), MY_WORDS_BOOK_ID)?.renamable, false)
  } finally {
    useStore.setState(original, true)
  }
})

test('単語帳の一覧から名前の変更と、左右スワイプの一覧確認へ進める', () => {
  const sheet = read('../src/components/WordListSheet.jsx')
  const decks = read('../src/screens/VocabDecks.jsx')

  assert.match(sheet, /book\.renamable && \(/)
  // 名前の変更は、暗記・テストが並ぶ単語帳の一覧に、冊ごとの歯車で置く。
  assert.match(sheet, /<Gear size=\{18\} \/>/)
  assert.match(sheet, /aria-label=\{`\$\{book\.title\}の名前を変更`\}/)
  assert.match(sheet, />\s*一覧で確認\s*</)
  assert.match(sheet, /data-word-book-rename-input/)
  assert.match(sheet, /updateNotebookSet\(renaming\.id, \{ title \}\)/)
  assert.match(sheet, /maxLength=\{NOTEBOOK_LIMITS\.setTitleLength\}/)
  assert.match(sheet, /wordBooksFromState\(\{ myList, learningNotebook \}\)/)
  // 一覧は級の一覧確認と同じ画面・同じ部品を使い、左右スワイプの記録もそのまま共有する。
  assert.match(sheet, /navigate\('vocabDecks', \{ wordBookId: book\.id \}\)/)
  assert.match(sheet, /data-word-book-catalog/)
  assert.match(decks, /findWordBook\(\{ myList, learningNotebook \}, params\.wordBookId\)/)
  assert.match(decks, /data-vocab-catalog=\{`book:\$\{wordBook\.id\}`\}/)
  assert.match(decks, /title=\{`\$\{wordBook\.title\}の一覧を確認`\}/)
  assert.match(decks, /words=\{wordBookWords\}/)
  assert.match(decks, /review\(row\.word\.id, result, 'vocab'\)/)
  assert.match(decks, /data-vocab-word-book-missing/)
})

test('マイ学習ノートでは単語帳を「単語帳」と呼び、冊ごとに歯車と一覧確認を置く', () => {
  const notebook = read('../src/screens/MyList.jsx')
  const menu = read('../src/lib/appMenu.js')
  const progress = read('../src/screens/Progress.jsx')

  // 「問題集」「8分野」「保存項目」は、学習者に見せる表記から外す。
  for (const source of [notebook, menu, progress]) {
    assert.doesNotMatch(source, /問題集|8分野|保存項目/)
  }
  assert.match(notebook, /\['sets', '単語帳'\]/)
  assert.match(notebook, /コンテンツの記録/)
  assert.match(menu, /コンテンツのメモ・単語帳・履歴/)
  // 数字は何を数えたかを名前と単位で示し、学習済み・回答・復習どきの集計は出さない。
  assert.match(notebook, /\['しおりで保存した教材', savedRefs\.length, '件'\]/)
  assert.match(notebook, /\['作った単語帳', state\.learningNotebook\.sets\.length, '冊'\]/)
  assert.doesNotMatch(notebook, /\['学習済み', summary\.studied|\['回答', summary\.attempts|\['復習どき', (?:summary|learningSummary)\.due/)
  // 冊ごとの歯車で名前・説明を変え、英単語は一覧確認（左右スワイプ）へ進める。
  assert.match(notebook, /data-notebook-set-settings/)
  assert.match(notebook, /<Gear size=\{18\} \/>/)
  assert.match(notebook, /domain\.id === 'vocab' && \(/)
  assert.match(notebook, /navigate\('vocabDecks', \{ wordBookId: target\.id \}\)/)
  assert.match(notebook, /data-notebook-set-word-list/)
  // 単語帳の学習ボタンは、アプリ全体と同じ「暗記」「テスト」と呼ぶ。
  assert.match(notebook, /domain\.id === 'etymology' \? '語根を暗記' : '暗記'/)
})
