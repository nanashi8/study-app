import * as notebookForBooks from '../src/lib/learningNotebook.js'
import * as wordBooksForBooks from '../src/lib/wordBooks.js'
import * as launchForBooks from '../src/lib/wordBookLaunch.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import LZString from 'lz-string'

import { ALL_WORDS, registerCustomWords } from '../src/data/vocab.js'
import { customStudyWords, upsertCustomWord } from '../src/lib/customWords.js'
import {
  MY_WORDS_SET_ID,
  MY_WORDS_SET_TITLE,
  NOTEBOOK_LIMITS,
  createLearningNotebook,
  createNotebookSet,
  createStarterLearningNotebook,
  foldLegacyMyWords,
  moveNotebookSet,
  setNotebookSetItems,
} from '../src/lib/learningNotebook.js'
import { isNotebookItemSaved } from '../src/lib/learningNotebookCatalog.js'
import {
  PERSISTED_PROGRESS_FIELDS,
  decodeProgress,
  encodeProgress,
  summarizePayload,
} from '../src/lib/progressCode.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import {
  findWordBook,
  wordBookVocabIds,
  wordBooksFromState,
} from '../src/lib/wordBooks.js'
import {
  createInitialLearningState,
  migratePersistedState,
  progressStateFromPayload,
  resetProgressState,
  useStore,
} from '../src/store/useStore.js'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')
const ids = (count, offset = 0) => ALL_WORDS.slice(offset, offset + count).map((word) => word.id)

test('単語帳はマイ学習ノートの単語帳と同じ並びで、「マイ単語」も1冊として並ぶ', () => {
  const [a, b, c] = ALL_WORDS
  const state = {
    learningNotebook: {
      sets: [
        { id: MY_WORDS_SET_ID, title: MY_WORDS_SET_TITLE, refs: [`vocab:${a.id}`, 'vocab:no-such-word', `vocab:${b.id}`] },
        { id: 'notebook-set-1', title: 'テスト範囲', refs: [`vocab:${c.id}`, 'phrases:some-phrase'] },
      ],
    },
  }
  assert.deepEqual(
    wordBooksFromState(state).map((book) => [book.id, book.title, book.ids]),
    [
      [MY_WORDS_SET_ID, 'マイ単語', [a.id, b.id]],
      ['notebook-set-1', 'テスト範囲', [c.id]],
    ],
  )
  // 熟語など英単語以外の項目は、単語帳の語として数えない。
  assert.deepEqual(wordBookVocabIds(state.learningNotebook.sets[1]), [c.id])
  // どの冊にも、特別扱いの印（名前を変えられない等）を付けない。
  assert.deepEqual(Object.keys(findWordBook(state, MY_WORDS_SET_ID)).sort(), ['id', 'ids', 'set', 'title'])
  assert.equal(findWordBook(state, 'deleted-set'), null)
  assert.equal(wordBooksFromState({}).length, 0)
})

test('初めて使う端末とリセット直後は、空の「マイ単語」を1冊だけ持つ', () => {
  const starter = createStarterLearningNotebook()
  assert.deepEqual(starter.sets.map((set) => [set.id, set.title, set.refs]), [[MY_WORDS_SET_ID, 'マイ単語', []]])
  assert.deepEqual(createInitialLearningState().learningNotebook, starter)
  assert.deepEqual(resetProgressState({}, ['saved']).learningNotebook, starter)
  // 保存項目に以前のマイ単語（myList）はもう無い。
  assert.equal(PERSISTED_PROGRESS_FIELDS.includes('myList'), false)
  assert.equal('myList' in createInitialLearningState(), false)
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
    const notebook = setNotebookSetItems(
      createStarterLearningNotebook(),
      MY_WORDS_SET_ID,
      'vocab',
      [ALL_WORDS[0].id, custom.id],
      true,
    )
    const [myWords] = wordBooksFromState({ learningNotebook: notebook })
    assert.deepEqual(myWords.ids, [ALL_WORDS[0].id, custom.id])
  } finally {
    registerCustomWords([])
  }
})

test('マイ単語も名前つきの単語帳も、名前の変更・並べ替え・削除が同じようにできる', () => {
  const original = useStore.getState()
  try {
    useStore.setState({ learningNotebook: createStarterLearningNotebook() })
    const setId = useStore.getState().createNotebookSet('テスト範囲')
    const titles = () => useStore.getState().learningNotebook.sets.map((set) => set.title)
    assert.deepEqual(titles(), ['マイ単語', 'テスト範囲'])

    // 名前：マイ単語も変えられ、空の名前では元の名前を保つ。
    useStore.getState().updateNotebookSet(MY_WORDS_SET_ID, { title: '  ふだんの単語  ' })
    useStore.getState().updateNotebookSet(setId, { title: '   ' })
    assert.deepEqual(titles(), ['ふだんの単語', 'テスト範囲'])

    // 並び順：どの冊も上下へ動かせる。端では動かない。
    useStore.getState().moveNotebookSet(setId, 'up')
    assert.deepEqual(titles(), ['テスト範囲', 'ふだんの単語'])
    useStore.getState().moveNotebookSet(setId, 'up')
    assert.deepEqual(titles(), ['テスト範囲', 'ふだんの単語'])
    useStore.getState().moveNotebookSet(MY_WORDS_SET_ID, 'down')
    assert.deepEqual(titles(), ['テスト範囲', 'ふだんの単語'])
    assert.deepEqual(
      moveNotebookSet(useStore.getState().learningNotebook, MY_WORDS_SET_ID, 'up').sets.map((set) => set.title),
      ['ふだんの単語', 'テスト範囲'],
    )

    // 削除：マイ単語も消せる。消したあとは読み込み直しても勝手に戻らない。
    useStore.getState().deleteNotebookSet(MY_WORDS_SET_ID)
    assert.deepEqual(titles(), ['テスト範囲'])
    const code = useStore.getState().exportCode()
    useStore.getState().importCode(code)
    assert.deepEqual(titles(), ['テスト範囲'])
  } finally {
    useStore.setState(original, true)
  }
})

test('まとめて入れると500項目までで止め、外すときは指定した語だけを外す', () => {
  const full = setNotebookSetItems(createStarterLearningNotebook(), MY_WORDS_SET_ID, 'vocab', ids(520), true, 1)
  assert.equal(full.sets[0].refs.length, NOTEBOOK_LIMITS.itemsPerSet)
  const removed = setNotebookSetItems(full, MY_WORDS_SET_ID, 'vocab', ids(3), false, 2)
  assert.deepEqual(removed.sets[0].refs.slice(0, 2), ids(2, 3).map((id) => `vocab:${id}`))
  assert.equal(removed.sets[0].refs.length, NOTEBOOK_LIMITS.itemsPerSet - 3)
  // 入っていない語を外そうとしても、冊は変えない。
  assert.deepEqual(setNotebookSetItems(removed, MY_WORDS_SET_ID, 'vocab', ['no-such-word'], false).sets[0], removed.sets[0])
})

test('以前の「マイ単語」（myList）は、単語帳の1冊「マイ単語」とノートの保存へ移し、何度読んでも増やさない', () => {
  const legacy = ids(3)
  const withSet = createNotebookSet(createLearningNotebook(), '期末テスト', { timestamp: 1, randomPart: 'a' }).notebook
  // 重複や、IDとして読めない値（数値・空）は入れない。
  const folded = foldLegacyMyWords(withSet, [...legacy, legacy[0], 42, '', null], { timestamp: 5 })
  assert.deepEqual(folded.sets.map((set) => set.title), ['マイ単語', '期末テスト'])
  assert.deepEqual(folded.sets[0].refs, legacy.map((id) => `vocab:${id}`))
  for (const id of legacy) assert.equal(isNotebookItemSaved({ learningNotebook: folded }, 'vocab', id), true)
  assert.deepEqual(foldLegacyMyWords(folded, legacy, { timestamp: 9 }), folded)
  // 今の形式の保存（myList が無い）は、何も足さない。
  assert.deepEqual(foldLegacyMyWords(withSet, undefined).sets.map((set) => set.title), ['期末テスト'])
  // 空の myList でも、以前は誰にでもあった「マイ単語」を用意する。
  assert.deepEqual(foldLegacyMyWords(undefined, []).sets.map((set) => [set.title, set.refs]), [['マイ単語', []]])

  // 1冊500項目を超える分は「マイ単語2」へ続ける。
  const many = foldLegacyMyWords(undefined, ids(620), { timestamp: 5 })
  assert.deepEqual(many.sets.map((set) => [set.title, set.refs.length]), [['マイ単語', 500], ['マイ単語2', 120]])
  // 40冊に届いていれば冊は増やさないが、語はノートに保存したまま残す。
  let crowded = createLearningNotebook()
  for (let index = 0; index < NOTEBOOK_LIMITS.sets; index++) {
    crowded = createNotebookSet(crowded, `冊${index + 1}`, { timestamp: index, randomPart: `r${index}` }).notebook
  }
  const crowdedFold = foldLegacyMyWords(crowded, legacy, { timestamp: 5 })
  assert.equal(crowdedFold.sets.length, NOTEBOOK_LIMITS.sets)
  assert.equal(crowdedFold.sets.some((set) => set.title === 'マイ単語'), false)
  assert.equal(isNotebookItemSaved({ learningNotebook: crowdedFold }, 'vocab', legacy[0]), true)
})

test('以前の端末保存・進捗コード・クラウド保存の「マイ単語」も、読み込むと単語帳の1冊になる', () => {
  const legacy = ids(2, 10)
  const oldNotebook = createNotebookSet(createLearningNotebook(), '期末テスト', { timestamp: 1, randomPart: 'b' }).notebook

  // 端末保存（v9）：移したあと myList は残さない。
  const migrated = migratePersistedState({ myList: legacy, learningNotebook: oldNotebook })
  assert.equal('myList' in migrated, false)
  assert.deepEqual(migrated.learningNotebook.sets.map((set) => set.title), ['マイ単語', '期末テスト'])
  assert.deepEqual(migrated.learningNotebook.sets[0].refs, legacy.map((id) => `vocab:${id}`))

  // 以前の進捗コード：読み込む前の確認でも、読み込んだあとと同じ冊数・保存数を示す。
  const oldCode = `EQ1-${LZString.compressToEncodedURIComponent(JSON.stringify({
    v: 1,
    myList: legacy,
    learningNotebook: oldNotebook,
  }))}`
  const payload = decodeProgress(oldCode)
  const restored = progressStateFromPayload(payload)
  assert.deepEqual(restored.learningNotebook.sets.map((set) => set.title), ['マイ単語', '期末テスト'])
  assert.equal('myList' in restored, false)
  assert.equal(summarizePayload(payload).notebookSets, 2)
  assert.equal(summarizePayload(payload).notebookSaved, 2)
  // 今の進捗コードは myList を持たない。
  assert.equal('myList' in decodeProgress(encodeProgress({ learningNotebook: restored.learningNotebook })), false)

  // 以前のクラウド保存。
  const cloud = progressStateFromCloud({ myList: legacy }, { ...createInitialLearningState(), learningNotebook: oldNotebook })
  assert.deepEqual(cloud.learningNotebook.sets.map((set) => set.title), ['マイ単語', '期末テスト'])
})

test('単語帳の一覧の歯車から、どの冊も名前の変更・並び順・削除ができ、一覧確認へ進める', () => {
  const sheet = read('../src/components/WordListSheet.jsx')
  const decks = read('../src/screens/VocabDecks.jsx')

  // 歯車はどの冊にも置く（マイ単語だけ出さない、という条件を持たない）。
  assert.doesNotMatch(sheet, /renamable|長文や辞書からの保存先/)
  assert.match(sheet, /<Gear size=\{18\} \/>/)
  assert.match(sheet, /aria-label=\{`\$\{book\.title\}の名前・並び順・削除`\}/)
  assert.match(sheet, /data-word-book-rename-input/)
  assert.match(sheet, /updateNotebookSet\(editing\.id, \{ title \}\)/)
  assert.match(sheet, /maxLength=\{NOTEBOOK_LIMITS\.setTitleLength\}/)
  assert.match(sheet, /moveNotebookSet\(book\.id, 'up'\)/)
  assert.match(sheet, /moveNotebookSet\(book\.id, 'down'\)/)
  assert.match(sheet, /data-word-book-delete-confirm/)
  assert.match(sheet, /deleteNotebookSet\(bookId\)/)
  assert.match(sheet, /入っている項目の学習記録は残ります/)
  assert.match(sheet, /wordBooksFromState\(\{ learningNotebook \}, meta\.id\)/)
  // 暗記・テストを始めた記録は、どの冊でも同じように残す。
  assert.doesNotMatch(sheet, /if \(book\.set\) \{/)
  assert.match(sheet, />\s*一覧で確認\s*</)
  // 一覧は級の一覧確認と同じ画面・同じ部品を使い、左右スワイプの記録もそのまま共有する。
  assert.match(sheet, /navigate\('vocabDecks', \{ wordBookId: book\.id \}\)/)
  assert.match(sheet, /data-word-book-catalog/)
  assert.match(decks, /findWordBook\(\{ learningNotebook \}, params\.wordBookId\)/)
  assert.match(decks, /data-vocab-catalog=\{`book:\$\{wordBook\.id\}`\}/)
  assert.match(decks, /title=\{`\$\{wordBook\.title\}の一覧を確認`\}/)
  assert.match(decks, /words=\{wordBookWords\}/)
  assert.match(decks, /review\(row\.word\.id, result, 'vocab'\)/)
  assert.match(decks, /data-vocab-word-book-missing/)
})

test('長文・辞書・名作・写真の読み取り・英作文・自作単語からは、入れる単語帳を選んで入れる', () => {
  const savers = {
    'src/screens/VocabSearch.jsx': /data-dictionary-word-book/,
    'src/components/ReadingSentenceDetail.jsx': /data-reading-word-book/,
    'src/components/ExtendedReader.jsx': /data-extended-reading-word-book/,
    'src/screens/LiteratureReader.jsx': /data-literature-word-book/,
    'src/screens/ReadingPrep.jsx': /data-reading-prep-word-book/,
    'src/screens/ReadingSummary.jsx': /data-reading-summary-word-book/,
    'src/screens/VocabCamera.jsx': /data-ocr-word-book/,
    'src/screens/WritingPlay.jsx': /data-writing-word-book/,
    'src/screens/CustomWords.jsx': /data-custom-word-book-select/,
  }
  for (const [path, marker] of Object.entries(savers)) {
    const source = read(`../${path}`)
    assert.match(source, marker, path)
    if (!path.endsWith('CustomWords.jsx')) assert.match(source, /<WordListSheet/, path)
    // 「マイ単語」だけへ直接入れる保存ボタンは残さない。
    assert.doesNotMatch(source, /toggleMyList|addManyToMyList|マイ単語に(?:追加|保存)/, path)
  }
  // まとめて入れる画面は、語の一覧をそのまま窓へ渡す。
  for (const path of ['src/screens/ReadingPrep.jsx', 'src/screens/VocabCamera.jsx']) {
    assert.match(read(`../${path}`), /wordIds=\{/, path)
  }
  const store = read('../src/store/useStore.js')
  assert.doesNotMatch(store, /toggleMyList|addManyToMyList|myList: \[\]/)
  assert.match(store, /setNotebookSetItems: \(setId, domain, itemIds, included\) =>/)
  assert.match(store, /moveNotebookSet: \(setId, direction\) =>/)
})

test('マイ学習ノートでは単語帳を「単語帳」と呼び、冊ごとの歯車で並び順も変えられる', () => {
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
  // 冊ごとの歯車で名前・説明・並び順を変え、英単語は一覧確認（左右スワイプ）へ進める。
  assert.match(notebook, /data-notebook-set-settings/)
  assert.match(notebook, /<Gear size=\{18\} \/>/)
  assert.match(notebook, /data-notebook-set-order/)
  assert.match(notebook, /onMoveSet\(set\.id, 'up'\)/)
  assert.match(notebook, /onMoveSet=\{moveNotebookSet\}/)
  assert.match(notebook, /domain\.id === 'vocab' && \(/)
  assert.match(notebook, /navigate\('vocabDecks', \{ wordBookId: target\.id \}\)/)
  assert.match(notebook, /data-notebook-set-word-list/)
  assert.doesNotMatch(notebook, /current\.myList/)
  // 単語帳の学習ボタンは、アプリ全体と同じ「暗記」「テスト」と呼ぶ。
  assert.match(notebook, /domain\.id === 'etymology' \? '語根を暗記' : '暗記'/)
})

test('熟語・文法・古典・漢文などほかの教材も単語帳に入れ、各教材の画面から冊ごとに学べる', () => {
  // 1冊に教材をまたいで入り、学ぶときは教材ごとに数える。
  let notebook = notebookForBooks.createStarterLearningNotebook()
  notebook = notebookForBooks.setNotebookSetRefs(
    notebook,
    notebookForBooks.MY_WORDS_SET_ID,
    ['phrases:idm_get_up', 'kanbunKundoku:kk001', 'vocab:book', 'unknown:x'],
    true,
    1,
  )
  assert.deepEqual(notebook.sets[0].refs, ['phrases:idm_get_up', 'kanbunKundoku:kk001', 'vocab:book'])
  assert.deepEqual(wordBooksForBooks.wordBookItemIds(notebook.sets[0], 'phrases'), ['idm_get_up'])
  assert.deepEqual(wordBooksForBooks.wordBooksFromState({ learningNotebook: notebook }, 'kanbunKundoku')[0].ids, ['kk001'])

  // 行き先は教材ごとに1か所で決め、暗記のない教材はテストを開く。
  for (const domain of notebookForBooks.NOTEBOOK_DOMAIN_IDS) {
    const study = launchForBooks.wordBookLaunchTarget(domain, 'study', ['x'], { title: '単語帳' })
    assert.ok(study?.screen, domain)
    if (!launchForBooks.wordBookCanStudy(domain)) {
      assert.equal(launchForBooks.wordBookLaunchTarget(domain, 'quiz', ['x']).screen, study.screen, domain)
    }
  }
  assert.equal(launchForBooks.wordBookLaunchTarget('kanbunGrammar', 'quiz', ['kgw001']).params.domain, 'grammar')
  assert.equal(launchForBooks.kanbunNotebookDomain('culture'), 'kanbunCulture')

  // 暗記・テストのカードの保存ボタンは、どれも入れる単語帳を選ぶ窓を開く。
  const toggles = {
    'src/screens/PhraseStudy.jsx': 'phrases',
    'src/screens/PhraseQuiz.jsx': 'phrases',
    'src/screens/GrammarQuiz.jsx': 'grammar',
    'src/screens/ListeningQuiz.jsx': 'listening',
    'src/screens/DictationPlay.jsx': 'dictation',
    'src/screens/EtymologyStudy.jsx': 'etymology',
    'src/screens/EtymologyQuiz.jsx': 'etymology',
    'src/screens/KotenStudy.jsx': 'kotenVocab',
    'src/screens/KotenQuiz.jsx': 'kotenVocab',
    'src/screens/KotenGrammarStudy.jsx': 'kotenGrammar',
    'src/screens/KotenCultureStudy.jsx': 'kotenCulture',
    'src/screens/KotenInterpretationQuiz.jsx': 'kotenVocab',
    'src/screens/KanbunKundokuQuiz.jsx': 'kanbunKundoku',
  }
  for (const [path, domain] of Object.entries(toggles)) {
    assert.ok(read(`../${path}`).includes(`<WordBookToggle domain="${domain}"`), path)
  }
  for (const path of ['src/screens/KanbunStudy.jsx', 'src/screens/KanbunQuiz.jsx']) {
    assert.ok(read(`../${path}`).includes('<WordBookToggle domain={kanbunNotebookDomain(domain)}'), path)
  }
  // 以前の登録リストの操作・画面は残さない。
  const store = read('../src/store/useStore.js')
  assert.doesNotMatch(store, /toggleKotenWordList|addManyToKotenWordList|toggleKanbunList|addManyToKanbunList|kotenWordList: \[\]/)
  assert.doesNotMatch(read('../src/App.jsx'), /kotenSaved|kanbunSaved/)
})
