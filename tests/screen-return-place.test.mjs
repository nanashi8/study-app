// 画面の戻り位置の回帰テスト。
// 一覧から別の画面へ移って戻ったとき、離れたときと同じ見え方・同じ位置から続けられること。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import {
  applyRequestedScreenPlace,
  captureScreenPlace,
  noteScreenTap,
  placedScrollTop,
  requestScreenPlace,
  requestedScreenPlace,
} from '../src/lib/screenScroll.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// 画面を描かずに位置の計算だけを確かめる、小さな作り物の main。
// 見えている main の上端は画面の61px、行の位置（offset）は一覧の先頭からの距離。
const AREA_TOP = 61

function fakeScrollArea({ scrollTop = 0, clientHeight = 751, rows = [], areas = [], headerHeight = 67 }) {
  const header = { offsetHeight: headerHeight, sticky: true }
  const area = {
    scrollTop,
    clientHeight,
    getBoundingClientRect: () => ({ top: AREA_TOP, bottom: AREA_TOP + clientHeight }),
    querySelector: (selector) => (selector === 'header' ? header : null),
    querySelectorAll: (selector) => {
      if (selector === '[data-return-row]') return rows
      if (selector === '[data-return-scroll]') return areas
      return []
    },
    contains: (element) => rows.includes(element),
  }
  for (const row of rows) row.area = area
  return area
}

function fakeRow(id, offset, height = 247) {
  const row = {
    offsetHeight: height,
    parentElement: { closest: () => null },
    getAttribute: (name) => (name === 'data-return-row' ? id : null),
    getBoundingClientRect: () => {
      const top = AREA_TOP + offset - row.area.scrollTop
      return { top, bottom: top + height }
    },
    closest: (selector) => (selector === '[data-return-row]' ? row : null),
  }
  return row
}

const fakeInnerArea = (name, scrollTop) => ({
  scrollTop,
  getAttribute: (attribute) => (attribute === 'data-return-scroll' ? name : null),
})

function withFakeDocument(scrollArea, run) {
  const saved = { document: globalThis.document, getComputedStyle: globalThis.getComputedStyle }
  globalThis.document = { querySelector: (selector) => (selector === '.study-app-content' ? scrollArea : null) }
  globalThis.getComputedStyle = (element) => ({ position: element.sticky ? 'sticky' : 'static' })
  try {
    return run()
  } finally {
    globalThis.document = saved.document
    globalThis.getComputedStyle = saved.getComputedStyle
    if (saved.document === undefined) delete globalThis.document
    if (saved.getComputedStyle === undefined) delete globalThis.getComputedStyle
  }
}

test('行を置く高さは、離れたときの高さを使い、見出しの下や画面の外へは出さない', () => {
  // 上に張り付く見出しが67px、見えている高さが751px、欄の高さが247px。
  const base = { itemOffset: 4248, itemHeight: 247, viewHeight: 751, coveredTop: 67 }
  assert.equal(placedScrollTop({ ...base, savedTop: 239 }), 4009)
  // 上が見出しに隠れていた行は、見出しのすぐ下へ下ろす。
  assert.equal(placedScrollTop({ ...base, savedTop: -130 }), 4248 - 79)
  // 下がはみ出していた行は、行の全体が見える所まで上げる。
  assert.equal(placedScrollTop({ ...base, savedTop: 515 }), 4248 - 492)
  // 高さが残っていなければ、見出しのすぐ下に置く。
  assert.equal(placedScrollTop({ ...base, savedTop: null }), 4248 - 79)
  // 大きい行（見える高さの半分を超える行）は、中で押した所が大きく動かないよう、離れたときの高さのまま置く。
  assert.equal(placedScrollTop({ ...base, itemHeight: 520, savedTop: -79 }), 4248 + 79)
  assert.equal(placedScrollTop({ ...base, itemHeight: 900, savedTop: -500 }), 4248 + 500)
  assert.equal(placedScrollTop({ ...base, itemHeight: 900, savedTop: null }), 4248 - 79)
  // 一覧の先頭の行は、スクロールを0より上にしない。
  assert.equal(placedScrollTop({ ...base, itemOffset: 67, savedTop: 27 }), 0)
})

test('離れるときは、main の位置・押した行の高さ・画面の中の欄の位置を残す', () => {
  const tapped = fakeRow('p_pre2_phone_free_focus', 4248)
  const scrollArea = fakeScrollArea({
    scrollTop: 4009,
    rows: [fakeRow('readingRules', 67), tapped],
    areas: [fakeInnerArea('reader', 320)],
  })
  noteScreenTap(tapped)
  const place = withFakeDocument(scrollArea, () => captureScreenPlace())
  assert.deepEqual(place, {
    top: 4009,
    row: { id: 'p_pre2_phone_free_focus', nth: 0, top: 239 },
    areas: { reader: 320 },
  })

  // 押したあとに遠くへ動かした行は目印にしない（戻ったときに、離れたときの見え方を崩さないため）。
  const far = fakeRow('p_5_lost_notebook', 100)
  const scrolledAway = fakeScrollArea({ scrollTop: 4009, rows: [far] })
  noteScreenTap(far)
  assert.deepEqual(withFakeDocument(scrolledAway, () => captureScreenPlace()), { top: 4009 })
  noteScreenTap(null)
})

test('戻ったら押した行を同じ高さへ置き、行が無ければ離れたときの位置へ戻す', () => {
  // 離れたあとに上の行の高さが変わっても（ここでは52px）、押した行は同じ高さに出る。
  const row = fakeRow('p_pre2_phone_free_focus', 4300)
  const returned = fakeScrollArea({ rows: [fakeRow('readingRules', 67), row], areas: [fakeInnerArea('reader', 0)] })
  requestScreenPlace({
    top: 4009,
    row: { id: 'p_pre2_phone_free_focus', nth: 0, top: 239 },
    areas: { reader: 320 },
  })
  withFakeDocument(returned, () => applyRequestedScreenPlace(returned))
  assert.equal(returned.scrollTop, 4300 - 239)
  assert.equal(returned.querySelectorAll('[data-return-scroll]')[0].scrollTop, 320)
  assert.equal(requestedScreenPlace(), null, '頼まれた位置は一度だけ使う')

  // 見出しに半分隠れていた行は、見出しのすぐ下まで下ろす。
  const halfHidden = fakeRow('p_2_space_debris', 7375)
  const clamped = fakeScrollArea({ rows: [halfHidden] })
  requestScreenPlace({ top: 7505, row: { id: 'p_2_space_debris', nth: 0, top: -130 } })
  withFakeDocument(clamped, () => applyRequestedScreenPlace(clamped))
  assert.equal(clamped.scrollTop, 7375 - 79)

  // 行が見つからない（別の見え方で戻った）ときは、離れたときの main の位置へ戻す。
  const missing = fakeScrollArea({ rows: [] })
  requestScreenPlace({ top: 1266, row: { id: 'gone', nth: 0, top: 150 } })
  withFakeDocument(missing, () => applyRequestedScreenPlace(missing))
  assert.equal(missing.scrollTop, 1266)

  // 新しく開いた画面は、前の画面の位置を持ち越さず先頭から。
  const fresh = fakeScrollArea({ scrollTop: 800 })
  requestScreenPlace(null)
  withFakeDocument(fresh, () => applyRequestedScreenPlace(fresh))
  assert.equal(fresh.scrollTop, 0)

  // 頼まれていないとき（一覧の条件だけを変えたときなど）は動かさない。
  const untouched = fakeScrollArea({ scrollTop: 640 })
  withFakeDocument(untouched, () => applyRequestedScreenPlace(untouched))
  assert.equal(untouched.scrollTop, 640)
})

test('進む画面は先頭から、戻る画面は離れたときの位置と見え方で開く', () => {
  const original = useStore.getState()
  const place = { top: 2118, row: { id: 'koten-grammar:g1', nth: 0, top: 330 } }
  try {
    useStore.setState({ screen: 'kotenGrammar', params: { view: 'list' }, stack: [] })
    useStore.getState().navigate('kotenGrammarStudy', { ids: ['g1'] })
    assert.deepEqual(requestedScreenPlace(), { top: 0 })

    // 履歴を一つ戻す：その画面を離れたときの位置を頼む。
    useStore.setState({
      screen: 'kotenGrammarStudy',
      params: { ids: ['g1'] },
      stack: [
        { screen: 'kotenList', params: {} },
        { screen: 'kotenGrammar', params: { view: 'list', category: 'keigo', openId: 'g1' }, place },
      ],
    })
    useStore.getState().globalBack()
    assert.equal(useStore.getState().screen, 'kotenGrammar')
    assert.deepEqual(useStore.getState().params, { view: 'list', category: 'keigo', openId: 'g1' })
    assert.deepEqual(requestedScreenPlace(), place)

    // 戻り先の指定で戻る：指定に無い見え方（準備画面の一覧・タブ・本文から戻る先）は、
    // 離れたときの params で補う。
    const toBundles = { screen: 'sceneBundles', params: { levelId: 'pre2' } }
    useStore.setState({
      screen: 'vocabStudy',
      params: { returnTo: { screen: 'readingPrep', params: { passageId: 'p1' } } },
      stack: [
        { screen: 'sceneBundles', params: { levelId: 'pre2' } },
        {
          screen: 'readingPrep',
          params: { passageId: 'p1', view: 'list', listTab: 'phrases', returnTo: toBundles },
          place,
        },
      ],
    })
    useStore.getState().globalBack()
    assert.equal(useStore.getState().screen, 'readingPrep')
    assert.deepEqual(useStore.getState().params, {
      passageId: 'p1',
      view: 'list',
      listTab: 'phrases',
      returnTo: toBundles,
    })
    assert.deepEqual(useStore.getState().stack, [{ screen: 'sceneBundles', params: { levelId: 'pre2' } }])
    assert.deepEqual(requestedScreenPlace(), place)

    // 指定した値はそのまま使う（場面の束は、暗記を終えたら同じ束を開き直す）。
    useStore.setState({
      screen: 'vocabStudy',
      params: { returnTo: { screen: 'sceneBundles', params: { levelId: 'pre2', bundleId: 'b1' } } },
      stack: [{ screen: 'sceneBundles', params: { levelId: '2' }, place }],
    })
    useStore.getState().globalBack()
    assert.deepEqual(useStore.getState().params, { levelId: 'pre2', bundleId: 'b1' })

    // 一覧の条件だけを変える操作は、頼んだ位置を変えない。
    useStore.getState().replaceParams({ levelId: '2' })
    assert.deepEqual(requestedScreenPlace(), place)

    // 履歴を空にして開くアプリのホームと入口は、先頭から。
    useStore.getState().goAppHome()
    assert.deepEqual(requestedScreenPlace(), { top: 0 })
    requestScreenPlace(place)
    useStore.getState().goPortal()
    assert.deepEqual(requestedScreenPlace(), { top: 0 })
  } finally {
    requestScreenPlace(null)
    useStore.setState(original, true)
  }
})

test('上部の共通の枠が、画面を移るたびに頼まれた位置へ置き、押した行を控える', () => {
  const shell = read('src/components/AppShell.jsx')
  assert.match(shell, /useLayoutEffect\(\(\) => \{\s*applyRequestedScreenPlace\(scrollAreaRef\.current\)\s*\}, \[stack\]\)/)
  assert.match(shell, /scrollArea\.addEventListener\('click', note, true\)/)
  assert.match(shell, /<main\s+ref=\{scrollAreaRef\}/)
  const store = read('src/store/useStore.js')
  assert.match(store, /const place = captureScreenPlace\(\)\s*requestScreenPlace\(null\)/)
  assert.match(store, /requestScreenPlace\(destination\.screen === prev\.screen \? prev\.place : null\)/)
  assert.match(store, /requestScreenPlace\(destination\.screen === entry\?\.screen \? entry\.place : null\)/)
})

test('一覧の見え方は params に置き、戻ったときも同じ一覧・同じ絞り込みから続ける', () => {
  const screens = {
    'src/screens/KotenList.jsx': ['view', 'course', 'category'],
    'src/screens/KotenGrammar.jsx': ['view', 'category', 'query', 'openId'],
    'src/screens/KotenCulture.jsx': ['view', 'category', 'query', 'openId'],
    'src/screens/KanbunCatalog.jsx': ['view', 'level', 'category', 'query'],
    'src/screens/Roots.jsx': ['status', 'family', 'view', 'query', 'visible'],
    'src/screens/Phrases.jsx': ['kind', 'view', 'query', 'levelFilter', 'familyFilter'],
    'src/screens/Grammar.jsx': ['view', 'level', 'strand', 'questionType'],
    'src/screens/Writing.jsx': ['level', 'mode', 'track'],
    'src/screens/LiteratureLibrary.jsx': ['kind'],
    'src/screens/LiteratureReader.jsx': ['scene', 'segment'],
    'src/screens/MyList.jsx': ['tab', 'domain', 'filter', 'query', 'shown', 'setId'],
    'src/screens/ReadingPrep.jsx': ['view', 'listTab'],
    'src/screens/Reader.jsx': ['showJa', 'showParagraphGuide'],
    'src/components/ExtendedReader.jsx': ['showJa'],
  }
  for (const [path, keys] of Object.entries(screens)) {
    const source = read(path)
    for (const key of keys) {
      assert.match(source, new RegExp(`useScreenParam\\(\\s*'${key}'`), `${path}: ${key} を params に置いていない`)
    }
  }
  // 共通の一覧は、学習とテストの切替・隠した行・表示件数を一覧ごとに params へ置く。
  // 表示件数は mount のたびに戻す useEffect を置かない（戻ったときの件数を消してしまうため）。
  const list = read('src/components/NormalLearningRecordList.jsx')
  assert.ok(list.includes('useScreenParam(`recordList:${entryId}`, readListState)'))
  assert.doesNotMatch(list, /setVisible\(pageSize\)/)
  const dictionary = read('src/screens/VocabSearch.jsx')
  assert.doesNotMatch(dictionary, /setShown\(PAGE\)/)
})

test('押した行と画面の中の欄に目印を付け、表示のたびに先頭へ戻す処理を置かない', () => {
  const rows = {
    'src/screens/ReadingList.jsx': /data-return-row=\{p\.id\}/,
    'src/screens/SceneBundles.jsx': /data-return-row=\{passage\.id\}/,
    'src/screens/Roots.jsx': /data-return-row=\{card\.id\}/,
    'src/screens/Grammar.jsx': /data-return-row=\{unit\.id\}/,
    'src/screens/LiteratureLibrary.jsx': /data-return-row=\{work\.id\}/,
    'src/components/NormalLearningRecordList.jsx': /data-return-row=\{`\$\{entryId\}:\$\{row\.id\}`\}/,
  }
  for (const [path, pattern] of Object.entries(rows)) assert.match(read(path), pattern, path)
  const areas = {
    'src/screens/Reader.jsx': 'reader',
    'src/components/ExtendedReader.jsx': 'extended-reader',
    'src/screens/ReadingPrep.jsx': 'reading-prep',
    'src/screens/VocabSearch.jsx': 'dictionary',
    'src/screens/WordDetail.jsx': 'word-detail',
    'src/screens/KotenInterpretationPrep.jsx': 'koten-interpretation-prep',
    'src/screens/MathIntro.jsx': 'math-intro',
    'src/screens/CustomWords.jsx': 'custom-words',
  }
  for (const [path, name] of Object.entries(areas)) {
    assert.ok(read(path).includes(`data-return-scroll="${name}"`), `${path}: 欄の目印がない`)
  }
  // 表示のたびに main を先頭へ戻すと、戻ったときの位置が消える。場面を切り替える診断だけに残す。
  const screenFiles = readdirSync(new URL('../src/screens', import.meta.url))
    .filter((name) => name.endsWith('.jsx'))
    .map((name) => `src/screens/${name}`)
  const resetters = screenFiles.filter((path) => /closest\('main'\)\?\.scrollTo\(\{ top: 0/.test(read(path)))
  assert.deepEqual(resetters, ['src/screens/Diagnostic.jsx'])
  // 語の詳細は、描く前に先頭へ戻す（描いたあとだと、履歴で戻ったときの位置を上書きする）。
  assert.match(read('src/screens/WordDetail.jsx'), /useLayoutEffect\(\(\) => \{\s*screenRef\.current\?\.scrollTo\(\{ top: 0 \}\)\s*\}, \[word\?\.id\]\)/)
})
