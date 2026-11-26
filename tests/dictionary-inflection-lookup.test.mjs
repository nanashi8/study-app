// 英和辞書で、変化形（went・children・better など）から元の見出し語を引けるか。
// 変化形の台帳の全部の形を検索語にして、その形を持つ見出し語が最初に並ぶ60件の中に出て、何の形かが分かること。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { parseInflection } from '../src/lib/wordInflections.js'
import { INFLECTION_MATCH_RANK, inflectionLookup, searchDictionary } from '../src/lib/dictionary.js'
import { normalizeVocabQuery } from '../src/lib/vocabSearch.js'
import { customWordDraftFromQuery } from '../src/lib/customWords.js'

const PAGE = 60 // 検索画面が最初に並べる数（VocabSearch.jsx の PAGE）
const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))

function allForms() {
  const list = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    for (const [pos, value] of Object.entries(record)) {
      for (const row of parseInflection(pos, value, byId.get(id).word).rows) {
        for (const form of row.forms) list.push({ id, label: row.label, text: form.text })
      }
    }
  }
  return list
}

test('台帳の全部の形で、その形を持つ見出し語が最初の60件に出て、何の形かが分かる', () => {
  // 全形で検索をそのまま流すと、1万を超える語 × 全見出しの照合で10分を超える。
  // 変化形で当たった語の順位は INFLECTION_MATCH_RANK（見出し語の完全一致 0 の次）なので、
  // 「見出し語がその形と同じ語の数 ＋ その形で当たる語の数」が60以下なら、最初の60件に必ず入る。
  // そのことを全形で確かめ、検索そのものは300形を選んで流す。
  const forms = allForms()
  assert.ok(forms.length >= 16823, `形の数 ${forms.length}`)
  assert.ok(INFLECTION_MATCH_RANK > 0 && INFLECTION_MATCH_RANK < 1)
  const headCounts = new Map()
  for (const word of ALL_WORDS) {
    const key = normalizeVocabQuery(word.word)
    headCounts.set(key, (headCounts.get(key) ?? 0) + 1)
  }
  const missing = []
  for (const form of forms) {
    const lookup = inflectionLookup(form.text)
    const hit = lookup.find((item) => item.wordId === form.id)
    if (!hit || !hit.labels.some((label) => label.startsWith(form.label))) missing.push(`${form.text} → ${form.id}（${form.label}）`)
    else if ((headCounts.get(normalizeVocabQuery(form.text)) ?? 0) + lookup.length > PAGE) missing.push(`${form.text}（上位が多すぎる）`)
  }
  assert.deepEqual(missing.slice(0, 30), [])
  const step = Math.floor(forms.length / 300)
  for (let i = 0; i < forms.length; i += step) {
    const form = forms[i]
    const ids = searchDictionary(form.text).slice(0, PAGE).map((entry) => entry.id)
    assert.ok(ids.includes(`word:${form.id}`), `${form.text} → ${form.id}`)
  }
})

test('変化形で引いた語は先頭の近くに並び、何の形かを添える', () => {
  const first = (query) => searchDictionary(query)[0]?.id
  assert.equal(first('went'), 'word:go')
  assert.equal(first('children'), 'word:child')
  assert.equal(first('better'), 'word:better') // 見出し語そのものが先、変化形の good がそのあと
  assert.ok(searchDictionary('better').slice(0, 3).some((entry) => entry.id === 'word:good'))
  assert.deepEqual(inflectionLookup('went').map((hit) => [hit.wordId, hit.labels]), [['go', ['過去形']]])
  const read = inflectionLookup('read').find((hit) => hit.wordId === 'read')
  assert.deepEqual(read.labels, ['過去形', '過去分詞'])
  const travelled = inflectionLookup('travelled').find((hit) => hit.wordId === 'travel')
  assert.ok(travelled.labels.every((label) => label.includes('イギリス式')))
  assert.ok(inflectionLookup('Went').length, '大文字でも引ける')
})

test('変化形で引けた語は、辞書にない語として扱わない（リクエスト・自作カードの登録の入口を出さない）', () => {
  for (const query of ['went', 'children', 'mice', 'studied', 'happier']) {
    assert.ok(searchDictionary(query).length > 0, query)
    assert.equal(customWordDraftFromQuery(query, { headwords: [query], customWords: [] }), null)
  }
  const screen = readFileSync(new URL('../src/screens/VocabSearch.jsx', import.meta.url), 'utf8')
  assert.match(screen, /form=\{formMatches\.get\(entry\.word\.id\) \?\? null\}/)
  assert.match(screen, /headwords: \[\.\.\.pool\.map\(headwordOf\), \.\.\.\(formMatches\.size \? \[query\] : \[\]\)\]/)
  assert.match(screen, /data-dictionary-inflection-match/)
})
