// 依頼 2026-09-24-classics-enrich の条件 screens。
// 足した情報（活用表・仲間・使い分け・時代背景・体系表）を、関わるすべての画面に出すこと。
// 1) 画面が使う表示部品を、全項目・全仲間・全体系表について実際に描き、持っている情報が欠けずに出ることを確かめる。
// 2) 10画面（KotenList・KotenStudy・KotenQuiz・古典単語の辞書ページ・KotenGrammar・KotenGrammarStudy・
//    KotenGrammarQuiz・KanbunCatalog・KanbunStudy・KanbunQuiz）が、その部品を使っていることを確かめる。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_GRAMMAR_SYSTEMS } from '../src/data/koten-grammar-systems.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KOTEN_GROUPS, kotenGroupsForWord } from '../src/lib/kotenWordGroups.js'
import { KANBUN_GROUPS, KANBUN_SYSTEMS, kanbunGroupsForItem, kanbunSystemsForItem } from '../src/lib/kanbunGroups.js'
import { conjugationTablesFor } from '../src/lib/kotenConjugation.js'
import { kotenGrammarConjugationTables, kotenGrammarListTable } from '../src/lib/kotenGrammarTables.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const h = React.createElement
const count = (html, attribute) => html.split(attribute).length - 1

let vite
let koten
let kotenGrammar
let kanbun

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  koten = await vite.ssrLoadModule('/src/components/KotenWordExtras.jsx')
  kotenGrammar = await vite.ssrLoadModule('/src/components/KotenGrammarExtras.jsx')
  kanbun = await vite.ssrLoadModule('/src/components/KanbunExtras.jsx')
})

after(async () => {
  await vite?.close()
})

test('古典単語：全語の活用表・仲間・時代背景・漢字表記が、カードの裏・辞書ページ・答え合わせの部品に出る', () => {
  assert.equal(KOTEN_WORDS.length, 612)
  for (const word of KOTEN_WORDS) {
    const conjugation = renderToStaticMarkup(h(koten.KotenWordConjugation, { word }))
    assert.equal(count(conjugation, 'data-koten-conjugation-table='), conjugationTablesFor(word).length, `${word.id}: 活用表`)
    const groups = renderToStaticMarkup(h(koten.KotenWordGroups, { word, compact: true }))
    assert.equal(count(groups, 'data-koten-word-group='), kotenGroupsForWord(word.id).length, `${word.id}: 仲間`)
    assert.ok(kotenGroupsForWord(word.id).length > 0, `${word.id}: 仲間に入っていない`)
    const background = renderToStaticMarkup(h(koten.KotenBackground, { text: word.background }))
    assert.equal(background.includes('data-koten-background'), Boolean(word.background), `${word.id}: 時代背景`)
    const kanji = renderToStaticMarkup(h(koten.KotenKanjiLine, { word }))
    assert.equal(kanji.includes('data-koten-kanji'), Boolean(word.kanji), `${word.id}: 漢字表記`)
  }
  // 仲間の画面：どの仲間にも、仲間の語と使い分けの解説がある。
  for (const group of KOTEN_GROUPS) assert.ok(group.entries.length >= 2 && group.explain, group.id)
})

test('古典文法：全項目の活用表・使い分け・時代背景・体系表が、カードの裏・文法辞典・答え合わせの部品に出る', () => {
  assert.equal(KOTEN_GRAMMAR.length, 130)
  for (const item of KOTEN_GRAMMAR) {
    const tables = renderToStaticMarkup(h(kotenGrammarTables(), { item }))
    const expected = kotenGrammarConjugationTables(item).length
    assert.equal(count(tables, 'data-koten-conjugation-table='), expected, `${item.id}: 活用表`)
    assert.equal(tables.includes('data-koten-grammar-list-table'), Boolean(kotenGrammarListTable(item)), `${item.id}: 表で整理`)
    const notes = renderToStaticMarkup(h(kotenGrammar.KotenGrammarNotes, { item }))
    assert.equal(notes.includes('data-koten-grammar-usage'), Boolean(item.usage), `${item.id}: 使い分け`)
    assert.equal(notes.includes('data-koten-background'), Boolean(item.background), `${item.id}: 時代背景`)
    const links = renderToStaticMarkup(h(kotenGrammar.KotenGrammarSystemLinks, { item }))
    assert.ok(count(links, 'data-koten-grammar-system-link=') > 0, `${item.id}: 体系表への案内`)
  }
  for (const system of KOTEN_GRAMMAR_SYSTEMS) {
    const html = renderToStaticMarkup(h(kotenGrammar.KotenGrammarSystemTable, { system, onToggleRow: () => {} }))
    const rows = system.rows.filter((row) => !row.group).length
    assert.equal(count(html, 'data-koten-grammar-system-row='), rows, `${system.id}: 表の行`)
  }
})

test('漢文：全漢語の使い分け・時代背景・仲間と、全漢文法項目の使い分け・時代背景・体系表が、カードの裏・一覧・答え合わせの部品に出る', () => {
  assert.equal(KANBUN_VOCAB.length, 293)
  for (const item of KANBUN_VOCAB) {
    const html = renderToStaticMarkup(h(kanbun.KanbunExtras, { domain: 'vocab', item, compact: true }))
    assert.equal(html.includes('data-kanbun-usage'), Boolean(item.usage), `${item.id}: 使い分け`)
    assert.equal(html.includes('data-kanbun-background'), Boolean(item.background), `${item.id}: 時代背景`)
    assert.equal(count(html, 'data-kanbun-group='), kanbunGroupsForItem(item.id).length, `${item.id}: 仲間`)
    assert.ok(kanbunGroupsForItem(item.id).length > 0, `${item.id}: 仲間に入っていない`)
  }
  assert.equal(KANBUN_GRAMMAR.length, 131)
  for (const item of KANBUN_GRAMMAR) {
    const html = renderToStaticMarkup(h(kanbun.KanbunExtras, { domain: 'grammar', item, compact: true }))
    assert.equal(html.includes('data-kanbun-usage'), Boolean(item.usage), `${item.id}: 使い分け`)
    assert.equal(html.includes('data-kanbun-background'), Boolean(item.background), `${item.id}: 時代背景`)
    assert.equal(count(html, 'data-kanbun-system-toggle='), kanbunSystemsForItem(item.id).length, `${item.id}: 体系表`)
    assert.ok(kanbunSystemsForItem(item.id).length > 0, `${item.id}: 体系表に入っていない`)
  }
  for (const system of KANBUN_SYSTEMS) {
    const html = renderToStaticMarkup(h(kanbun.KanbunSystemTable, { system, onToggleRow: () => {} }))
    const rows = system.rows.filter((row) => !row.group).length
    assert.equal(count(html, 'data-kanbun-system-row='), rows, `${system.id}: 表の行`)
    const aux = renderToStaticMarkup(h(kanbun.KanbunSystemAuxTables, { system }))
    assert.equal(count(aux, 'data-koten-conjugation-table='), system.aux?.length ?? 0, `${system.id}: 活用表`)
  }
  for (const group of KANBUN_GROUPS) assert.ok(group.items.length >= 2 && group.explain, group.id)
})

test('10画面が、足した情報を出す部品を使う', () => {
  const SCREENS = {
    'src/screens/KotenList.jsx': [/view === 'groups'/u, /<GroupCard/u, /KOTEN_WORD_LEVELS\.map/u, /onOpen=\{\(item\) => openWordDetail\(item\.id\)\}/u],
    'src/screens/KotenStudy.jsx': [/<KotenKanjiLine word=\{word\}/u, /<KotenWordConjugation word=\{word\}/u, /<KotenWordGroups word=\{word\}/u, /<KotenBackground text=\{word\.background\}/u],
    'src/screens/KotenQuiz.jsx': [/<KotenWordConjugation word=\{word\}/u, /<KotenWordGroups word=\{word\}/u, /<KotenBackground text=\{word\.background\}/u],
    'src/screens/KotenWordDetail.jsx': [/<KotenKanjiLine word=\{word\}/u, /<KotenWordConjugation word=\{word\}/u, /<KotenWordGroups word=\{word\}/u, /<KotenBackground text=\{word\.background\}/u],
    'src/screens/KotenGrammar.jsx': [/<KotenGrammarTables item=\{item\}/u, /<KotenGrammarNotes item=\{item\}/u, /<KotenGrammarSystemLinks item=\{item\}/u, /<KotenGrammarSystemTable/u],
    'src/screens/KotenGrammarStudy.jsx': [/<KotenGrammarTables item=\{item\}/u, /<KotenGrammarNotes item=\{item\}/u, /<KotenGrammarSystemLinks item=\{item\}/u],
    'src/screens/KotenGrammarQuiz.jsx': [/<KotenGrammarNotes item=\{item\}/u, /<KotenGrammarTablesToggle item=\{item\}/u],
    'src/screens/KanbunCatalog.jsx': [/<KanbunExtras/u, /<GroupCard/u, /<SystemCard/u, /<KanbunSystemTable/u, /<KanbunSystemAuxTables/u],
    'src/screens/KanbunStudy.jsx': [/<KanbunExtras domain=\{domain\} item=\{item\}/u],
    'src/screens/KanbunQuiz.jsx': [/<KanbunExtras/u],
  }
  for (const [file, patterns] of Object.entries(SCREENS)) {
    const source = read(file)
    for (const pattern of patterns) assert.match(source, pattern, `${file}: ${pattern}`)
  }
})

// 活用表と「表で整理」をまとめて出す部品（KotenGrammarTables）。
function kotenGrammarTables() {
  return kotenGrammar.KotenGrammarTables
}
