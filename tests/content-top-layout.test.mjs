import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// 英語アプリの各コンテンツのトップは、単語画面と同じ並び
//（「今日の学習」の1枚 → 級・分野のほかの選び方と単語帳 → 級・分野のカード）にそろえる。
const ENGLISH_TOPS = {
  'src/screens/VocabLevels.jsx': { domain: null, marker: 'data-vocab-today' },
  'src/screens/Phrases.jsx': { domain: 'phrases', marker: 'data-phrase-today' },
  'src/screens/Grammar.jsx': { domain: 'grammar', marker: 'data-grammar-today' },
  'src/screens/Listening.jsx': { domain: 'listening', marker: 'data-listening-today' },
  'src/screens/Dictation.jsx': { domain: 'dictation', marker: 'data-dictation-today' },
  'src/screens/Roots.jsx': { domain: 'etymology', marker: 'data-etymology-today' },
}

test('英語アプリの各コンテンツのトップは、今日の学習・ほかの選び方・単語帳を単語画面と同じ形で上に置く', () => {
  const top = read('src/components/ContentTop.jsx')
  for (const name of ['TodayCard', 'TodayRow', 'ReviewTodayRow', 'ChooserTiles', 'ChooserTile', 'WordBookTile']) {
    assert.match(top, new RegExp(`export function ${name}\\b`), name)
  }
  // 入口が1つだけなら横長の1行、2つ・3つなら同じ大きさで並べる（外枠448pxなので sm: で列を増やさない）。
  assert.match(top, /tiles\.length >= 3 \? 'grid-cols-3' : tiles\.length === 2 \? 'grid-cols-2' : 'grid-cols-1'/)
  assert.doesNotMatch(top, /\bsm:/)

  for (const [path, { domain, marker }] of Object.entries(ENGLISH_TOPS)) {
    const source = read(path)
    assert.match(source, /from '\.\.\/components\/ContentTop\.jsx'/, path)
    assert.ok(source.includes(`<TodayCard ${marker}>`), `${path}: 今日の学習の1枚がない`)
    assert.match(source, /<ReviewTodayRow/, path)
    assert.match(source, /<ChooserTiles/, path)
    if (domain) assert.ok(source.includes(`<WordBookTile domain="${domain}"`), `${path}: 単語帳の入口がない`)
    // 今日の学習は、ほかの選び方より先に置く。
    assert.ok(source.indexOf('<TodayCard') < source.indexOf('<ChooserTiles'), path)
  }

  // 以前のグラデーションの大きな入口・帯は置かない。
  assert.doesNotMatch(read('src/screens/Phrases.jsx'), /function FormChooser/)
  assert.doesNotMatch(read('src/screens/Grammar.jsx'), /文法を復習しよう|bg-gradient-to-r from-brand-500 to-brand-400/)
  assert.doesNotMatch(read('src/screens/Roots.jsx'), /bg-gradient-to-br from-violet-700 to-indigo-600/)
  // リスニングとディクテーションは、級選びの共通部品へ今日の学習と選び方を渡す。
  assert.match(read('src/components/LevelPicker.jsx'), /\{today\}\s*\{choosers\}/)
  for (const path of ['src/screens/Listening.jsx', 'src/screens/Dictation.jsx']) {
    const source = read(path)
    assert.match(source, /today=\{\(/, path)
    assert.match(source, /choosers=\{\(/, path)
  }
})

// 古典アプリ・漢文アプリも、英語アプリと同じく「ホーム（学ぶ内容を選ぶ）→ コンテンツのトップ」の2段にする。
const CLASSICS_TOPS = {
  'src/screens/KotenList.jsx': { tile: '<WordBookTile domain="kotenVocab"', marker: 'data-koten-vocab-today' },
  'src/screens/KotenGrammar.jsx': { tile: '<WordBookTile domain="kotenGrammar"', marker: 'data-koten-grammar-today' },
  'src/screens/KotenCulture.jsx': { tile: '<WordBookTile domain="kotenCulture"', marker: 'data-koten-culture-today' },
  'src/screens/KotenInterpretationList.jsx': { tile: '<WordBookTile domain="kotenInterpretation"', marker: 'data-koten-interpretation-today' },
  'src/screens/KanbunCatalog.jsx': { tile: '<WordBookTile domain={wordBookDomain}', marker: 'data-kanbun-catalog-today={domain}' },
  'src/screens/KanbunKundoku.jsx': { tile: '<WordBookTile domain="kanbunKundoku"', marker: 'data-kanbun-kundoku-today' },
}

test('古典・漢文のアプリのホームはコンテンツを選ぶだけにし、各コンテンツのトップを単語画面の形にそろえる', () => {
  const menu = read('src/components/ContentMenu.jsx')
  for (const name of ['ContentMenu', 'ContentMenuSection', 'ContentMenuButton']) {
    assert.match(menu, new RegExp(`export function ${name}\\b`), name)
  }
  const koten = read('src/screens/KotenList.jsx')
  const kanbun = read('src/screens/KanbunHome.jsx')
  for (const [source, title] of [[koten, '古典アプリ'], [kanbun, '漢文アプリ']]) {
    assert.ok(source.includes(`<ContentMenu title="${title}"`), title)
    assert.match(source, /<ContentMenuSection title="コンテンツを選ぶ"/, title)
    // 以前のグラデーションのヒーローと、画面ごとの「スタディアプリ」へ戻るボタンは置かない（上部の共通バーが担う）。
    assert.doesNotMatch(source, /rounded-b-\[2\.5rem\]|goPortal|SpeechSettingsButton/, title)
  }
  // 古典単語のトップはホームから view 'vocab' で開き、上部の「戻る」でホームへ戻る（同じ画面のまま表示をそろえる）。
  assert.ok(koten.includes("navigate('kotenList', { view: 'vocab' })"))
  assert.match(koten, /useEffect\(\(\) => \{\s*setView\(viewFromParams\(params\)\)\s*\}, \[params\]\)/)

  for (const [path, { tile, marker }] of Object.entries(CLASSICS_TOPS)) {
    const source = read(path)
    assert.ok(source.includes(`<TodayCard ${marker}>`), `${path}: 今日の学習の1枚がない`)
    assert.match(source, /<ReviewTodayRow/, path)
    assert.ok(source.includes(tile), `${path}: 単語帳の入口がない`)
    assert.ok(source.indexOf('<TodayCard') < source.indexOf('<ChooserTiles'), path)
    assert.doesNotMatch(source, /rounded-b-\[2\.5rem\]|SpeechSettingsButton/, `${path}: 以前のヒーローが残っている`)
  }
})
