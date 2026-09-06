import test from 'node:test'
import assert from 'node:assert/strict'
import {
  NOTEBOOK_DOMAIN_IDS,
  NOTEBOOK_LIMITS,
  createLearningNotebook,
  createNotebookSet,
  moveNotebookSetItem,
  normalizeLearningNotebook,
  notebookRef,
  parseNotebookRef,
  recordNotebookSetLaunch,
  setNotebookItemSaved,
  setNotebookSetItem,
  updateNotebookItem,
  updateNotebookSet,
} from '../src/lib/learningNotebook.js'
import {
  NOTEBOOK_CATALOG_COUNTS,
  NOTEBOOK_TOTAL_ITEMS,
  isNotebookItemSaved,
  notebookItemProgress,
  notebookRecentItems,
  notebookSavedCounts,
  notebookSavedRefs,
  notebookSetDomainGroups,
  resolveNotebookItem,
  searchNotebookItems,
} from '../src/lib/learningNotebookCatalog.js'
import {
  PERSISTED_PROGRESS_FIELDS,
  buildPayload,
  decodeProgress,
  encodeProgress,
  selectProgressState,
} from '../src/lib/progressCode.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import { progressStateFromPayload, useStore } from '../src/store/useStore.js'
import {
  learningContentPlanEntry,
  updateLearningContentPlan,
} from '../src/lib/learningContentPlan.js'

test('マイ学習ノートは指定8分野・全15,401項目を安定IDで解決する', () => {
  assert.deepEqual(NOTEBOOK_DOMAIN_IDS, [
    'vocab',
    'phrases',
    'grammar',
    'listening',
    'etymology',
    'kotenVocab',
    'kotenGrammar',
    'kotenCulture',
  ])
  assert.deepEqual(NOTEBOOK_CATALOG_COUNTS, {
    vocab: 8869,
    phrases: 2104,
    grammar: 3555,
    listening: 160,
    etymology: 283,
    kotenVocab: 300,
    kotenGrammar: 74,
    kotenCulture: 56,
  })
  assert.equal(NOTEBOOK_TOTAL_ITEMS, 15401)

  for (const [domain, count] of Object.entries(NOTEBOOK_CATALOG_COUNTS)) {
    assert.ok(count > 0, domain)
    const results = searchNotebookItems(domain, '')
    assert.equal(results.length, count, domain)
    assert.ok(results.every((item) => resolveNotebookItem(item.ref)?.id === item.id), domain)
  }
  assert.equal(
    resolveNotebookItem('etymology:root:port')?.id,
    'root:port',
  )
})

test('ノート参照・メモ・タグは上限と不正値を正規化し、コロン入り教材IDを保つ', () => {
  const ref = notebookRef('etymology', 'formula:root-fer:different')
  assert.equal(ref, 'etymology:formula:root-fer:different')
  assert.deepEqual(parseNotebookRef(ref), {
    domain: 'etymology',
    itemId: 'formula:root-fer:different',
  })
  assert.equal(notebookRef('unknown', 'x'), null)

  const note = 'a'.repeat(NOTEBOOK_LIMITS.noteLength + 50)
  let notebook = updateNotebookItem(createLearningNotebook(), 'phrases', 'idm_get_up', {
    note,
    tags: [' 重要 ', '重要', '', ...Array.from({ length: 20 }, (_, index) => `tag-${index}`)],
  }, 100)
  const entry = notebook.entries['phrases:idm_get_up']
  assert.equal(entry.saved, true)
  assert.equal(entry.note.length, NOTEBOOK_LIMITS.noteLength)
  assert.equal(entry.tags[0], '重要')
  assert.equal(entry.tags.length, NOTEBOOK_LIMITS.tagsPerItem)

  notebook = setNotebookItemSaved(notebook, 'phrases', 'idm_get_up', false, 200)
  assert.equal(notebook.entries['phrases:idm_get_up'].saved, false)
  assert.equal(notebook.entries['phrases:idm_get_up'].note.length, NOTEBOOK_LIMITS.noteLength)

  const normalized = normalizeLearningNotebook({
    entries: {
      bad: { saved: true },
      'vocab:book': { saved: true, tags: ['基礎'] },
    },
    sets: [{ id: 'x', title: '  基礎問題集  ', refs: ['bad', 'vocab:book', 'vocab:book'] }],
  })
  assert.deepEqual(Object.keys(normalized.entries), ['vocab:book'])
  assert.deepEqual(normalized.sets[0].refs, ['vocab:book'])
  assert.equal(normalized.sets[0].title, '基礎問題集')
})

test('自作問題集は作成・説明編集・分野混在・追加削除・並べ替え・起動履歴を保持する', () => {
  const created = createNotebookSet(createLearningNotebook(), '入試前チェック', {
    description: '8分野から選ぶ',
    timestamp: 1000,
    randomPart: 'fixed',
  })
  assert.ok(created.setId)
  let notebook = created.notebook
  notebook = setNotebookSetItem(notebook, created.setId, 'vocab', 'book', true, 1010)
  notebook = setNotebookSetItem(notebook, created.setId, 'grammar', 'gr_5_be_1', true, 1020)
  notebook = setNotebookSetItem(notebook, created.setId, 'kotenCulture', 'kc001', true, 1030)
  assert.deepEqual(notebook.sets[0].refs, [
    'vocab:book',
    'grammar:gr_5_be_1',
    'kotenCulture:kc001',
  ])

  notebook = moveNotebookSetItem(notebook, created.setId, 'kotenCulture:kc001', 'up', 1040)
  assert.deepEqual(notebook.sets[0].refs, [
    'vocab:book',
    'kotenCulture:kc001',
    'grammar:gr_5_be_1',
  ])
  notebook = updateNotebookSet(notebook, created.setId, {
    title: '直前チェック',
    description: '間違えた項目を集約',
  }, 1050)
  assert.equal(notebook.sets[0].title, '直前チェック')
  assert.equal(notebook.sets[0].description, '間違えた項目を集約')

  const groups = notebookSetDomainGroups(notebook.sets[0])
  assert.equal(groups.vocab.length, 1)
  assert.equal(groups.grammar.length, 1)
  assert.equal(groups.kotenCulture.length, 1)

  notebook = recordNotebookSetLaunch(notebook, {
    setId: created.setId,
    setTitle: notebook.sets[0].title,
    domain: 'grammar',
    count: 1,
    timestamp: 2000,
  })
  assert.deepEqual(
    Object.fromEntries(Object.entries(notebook.sessions[0]).filter(([key]) => key !== 'id')),
    {
      setId: created.setId,
      setTitle: '直前チェック',
      domain: 'grammar',
      mode: 'quiz',
      count: 1,
      startedAt: 2000,
    },
  )
})

test('旧マイ単語・古典リストを統合表示し、8分野の正誤・期限・最近履歴を読む', () => {
  const day = 20000
  const state = {
    myList: ['book'],
    kotenWordList: ['k001'],
    kotenGrammarList: ['kg_neg_zu'],
    kotenCultureList: ['kc001'],
    learningNotebook: setNotebookItemSaved(
      setNotebookItemSaved(createLearningNotebook(), 'phrases', 'idm_get_up', true, 10),
      'listening',
      'listen_1_01',
      true,
      20,
    ),
    srs: {
      book: { correct: 3, wrong: 1, box: 3, due: day, lastAt: 100 },
      idm_get_up: { correct: 1, wrong: 2, box: 0, due: day + 1, lastAt: 200 },
    },
    kotenSrs: { k001: { correct: 2, wrong: 0, box: 4, due: day - 1, lastAt: 300 } },
    kotenGrammarSrs: {},
    kotenCultureSrs: {},
    etymologySrs: {},
  }
  assert.equal(isNotebookItemSaved(state, 'vocab', 'book'), true)
  assert.equal(notebookSavedRefs(state).length, 6)
  assert.deepEqual(notebookSavedCounts(state), {
    vocab: 1,
    phrases: 1,
    grammar: 0,
    listening: 1,
    etymology: 0,
    kotenVocab: 1,
    kotenGrammar: 1,
    kotenCulture: 1,
  })
  assert.deepEqual(notebookItemProgress(state, 'vocab', 'book', day), {
    entry: state.srs.book,
    correct: 3,
    wrong: 1,
    attempts: 4,
    accuracy: 0.75,
    box: 3,
    due: true,
    lastAt: 100,
  })
  assert.deepEqual(
    notebookRecentItems(state, { day }).map(({ item }) => item.ref),
    ['kotenVocab:k001', 'phrases:idm_get_up', 'vocab:book'],
  )
})

test('統合ノートは旧保存配列と同期し、端末・進捗コード・クラウドの全経路で復元する', () => {
  const before = selectProgressState(useStore.getState())
  try {
    useStore.setState({
      ...before,
      myList: [],
      kotenWordList: [],
      kotenGrammarList: [],
      kotenCultureList: [],
      learningNotebook: createLearningNotebook(),
    })
    useStore.getState().toggleNotebookItem('vocab', 'book')
    useStore.getState().toggleNotebookItem('phrases', 'idm_get_up')
    useStore.getState().toggleNotebookItem('kotenGrammar', 'kg_neg_zu')
    useStore.getState().updateNotebookItem('listening', 'listen_1_01', {
      note: '最後の提案を聞く',
      tags: ['聞き直す'],
    })
    const setId = useStore.getState().createNotebookSet('明日の10問', '朝に解く')
    useStore.getState().setNotebookSetItem(setId, 'vocab', 'book', true)
    useStore.getState().setNotebookSetItem(setId, 'listening', 'listen_1_01', true)

    const current = useStore.getState()
    assert.deepEqual(current.myList, ['book'])
    assert.deepEqual(current.kotenGrammarList, ['kg_neg_zu'])
    assert.equal(current.learningNotebook.sets[0].refs.length, 2)
    assert.ok(PERSISTED_PROGRESS_FIELDS.includes('learningNotebook'))
    assert.deepEqual(selectProgressState(current).learningNotebook, current.learningNotebook)

    const decoded = decodeProgress(encodeProgress(current))
    assert.equal(decoded.learningNotebook.sets[0].title, '明日の10問')
    assert.equal(decoded.learningNotebook.entries['listening:listen_1_01'].note, '最後の提案を聞く')
    assert.equal(progressStateFromPayload(decoded).learningNotebook.sets[0].refs.length, 2)

    const cloud = progressStateFromCloud(decoded, before)
    assert.equal(cloud.learningNotebook.sets[0].description, '朝に解く')
    const oldCloud = progressStateFromCloud({ myList: ['book'] }, current)
    assert.equal(oldCloud.learningNotebook.sets[0].title, '明日の10問')

    useStore.getState().toggleMyList('book')
    assert.equal(isNotebookItemSaved(useStore.getState(), 'vocab', 'book'), false)
  } finally {
    useStore.setState(before)
  }
})

test('全教材の学習項目・非表示・優先度は保存、コード、クラウド、分類リセットを同じ契約で通る', () => {
  const before = selectProgressState(useStore.getState())
  try {
    const emptyPayload = buildPayload({
      ...before,
      learningNotebook: createLearningNotebook(),
    })
    assert.equal('contentPlan' in emptyPayload.learningNotebook, false)
    assert.deepEqual(
      progressStateFromPayload(emptyPayload).learningNotebook.contentPlan.entries,
      {},
    )

    let contentPlan = updateLearningContentPlan(
      undefined,
      'usage',
      'idm_get_up',
      'register',
      100,
    )
    contentPlan = updateLearningContentPlan(
      contentPlan,
      'usage',
      'idm_get_up',
      'raise-priority',
      200,
    )
    contentPlan = updateLearningContentPlan(
      contentPlan,
      'math',
      'math-linear-001',
      'hide',
      300,
    )
    useStore.setState({
      ...before,
      learningNotebook: { ...createLearningNotebook(), contentPlan },
    })
    useStore.getState().updateLearningContentPlanItem(
      'usage',
      'idm_get_up',
      'raise-priority',
    )

    const current = useStore.getState()
    assert.equal(
      learningContentPlanEntry(
        current.learningNotebook.contentPlan,
        'usage',
        'idm_get_up',
      ).priority,
      2,
    )
    assert.equal(
      learningContentPlanEntry(
        current.learningNotebook.contentPlan,
        'math',
        'math-linear-001',
      ).hidden,
      true,
    )

    const decoded = decodeProgress(encodeProgress(current))
    assert.equal(decoded.learningNotebook.contentPlan.entries['usage:idm_get_up'].priority, 2)
    assert.equal(
      progressStateFromPayload(decoded)
        .learningNotebook.contentPlan.entries['math:math-linear-001'].hidden,
      true,
    )
    assert.equal(
      progressStateFromCloud(decoded, before)
        .learningNotebook.contentPlan.entries['usage:idm_get_up'].registered,
      true,
    )

    useStore.getState().resetProgress(['saved'])
    assert.deepEqual(useStore.getState().learningNotebook.contentPlan.entries, {})
  } finally {
    useStore.setState(before)
  }
})
