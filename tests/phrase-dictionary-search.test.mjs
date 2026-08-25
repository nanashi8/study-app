// 英和辞書の回帰テスト。
// 単語・熟語・構文が同じ検索欄から引けて、紙の辞書と同じ1本のABC順に並ぶこと。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_WORDS } from '../src/data/vocab.js'
import { PHRASES, getPhrase } from '../src/data/phrases.js'
import { phraseMatchRank, phraseSearchText } from '../src/lib/vocabSearch.js'
import {
  DICTIONARY_COUNTS,
  DICTIONARY_ENTRIES,
  DICTIONARY_INITIALS,
  compareDictionaryEntries,
  dictionaryByInitial,
  dictionaryInitial,
  dictionaryMatchRank,
  dictionarySortKey,
  searchDictionary,
} from '../src/lib/dictionary.js'

const top = (query) =>
  PHRASES.map((p) => ({ p, rank: phraseMatchRank(p, query) }))
    .filter((h) => h.rank >= 0)
    .sort((a, b) => a.rank - b.rank)[0]?.p

test('見出しの熟語・構文が完全一致で最上位に来る', () => {
  assert.equal(top('look at')?.id, 'idm_look_at')
  assert.equal(phraseMatchRank(getPhrase('idm_look_at'), 'LOOK AT'), 0)
  assert.equal(phraseMatchRank(getPhrase('idm_look_at'), 'look'), 1)
})

test('日本語の意味・例文・成り立ちからも熟語を引ける', () => {
  const phrase = getPhrase('idm_get_up')
  assert.equal(phraseMatchRank(phrase, '起きる'), 3)
  assert.ok(phraseSearchText(phrase).includes('毎朝'))
  assert.ok(phraseMatchRank(phrase, '毎朝') >= 0)
  assert.equal(phraseMatchRank(phrase, 'まったく無関係な語'), -1)
})

test('構文の「〜」は入力しなくても一致する', () => {
  const syntax = PHRASES.find((p) => p.kind === 'syntax' && p.phrase.includes('~'))
  assert.ok(syntax)
  assert.ok(phraseMatchRank(syntax, syntax.phrase.replace(/[~〜]/g, ' ').replace(/\s+/g, ' ').trim()) <= 1)
})

// ── 単語・熟語・構文をまぜた1本のABC順 ──────────────────────────────

test('見出しは単語・熟語・構文をまぜたまま通しでABC順に並ぶ', () => {
  assert.equal(DICTIONARY_ENTRIES.length, ALL_WORDS.length + PHRASES.length)
  assert.equal(DICTIONARY_COUNTS.word, ALL_WORDS.length)
  assert.equal(DICTIONARY_COUNTS.idiom + DICTIONARY_COUNTS.syntax, PHRASES.length)
  for (let i = 1; i < DICTIONARY_ENTRIES.length; i++) {
    assert.ok(
      compareDictionaryEntries(DICTIONARY_ENTRIES[i - 1], DICTIONARY_ENTRIES[i]) < 0,
      `${DICTIONARY_ENTRIES[i - 1].head} が ${DICTIONARY_ENTRIES[i].head} より前にある`,
    )
  }
})

test('go を引くと go → go abroad → go ahead → goal の順に並ぶ', () => {
  const results = searchDictionary('go')
  const heads = results.map((entry) => entry.head)
  assert.equal(heads[0], 'go')
  for (const [before, after] of [
    ['go', 'go abroad'],
    ['go abroad', 'go ahead'],
    ['go ahead', 'goal'],
  ]) {
    assert.ok(heads.includes(before) && heads.includes(after), `${before} と ${after} が引ける`)
    assert.ok(heads.indexOf(before) < heads.indexOf(after), `${before} → ${after} の順`)
  }
  // 単語だけ・熟語だけに寄らず、同じ並びの中に両方がある。
  const types = new Set(results.slice(0, 30).map((entry) => entry.type))
  assert.ok(types.has('word') && types.has('idiom'))
})

test('同じ一致の強さの中では必ずABC順になる', () => {
  for (const query of ['go', 'take', 'as', '影響']) {
    const results = searchDictionary(query)
    assert.ok(results.length > 0, `${query} が引ける`)
    let previous = null
    let previousRank = -1
    for (const entry of results) {
      const rank = dictionaryMatchRank(entry, query)
      assert.ok(rank >= previousRank, `${query}: 一致の強い順に並ぶ`)
      if (previous && rank === previousRank) {
        assert.ok(
          compareDictionaryEntries(previous, entry) < 0,
          `${query}: ${previous.head} → ${entry.head} がABC順`,
        )
      }
      previous = entry
      previousRank = rank
    }
  }
})

test('構文も同じ検索欄・同じ並びから引ける', () => {
  const results = searchDictionary('so as to do')
  assert.equal(results[0].type, 'syntax')
  assert.equal(results[0].phrase.id, 'syn_so_as_to')
  assert.ok(searchDictionary('too').some((entry) => entry.type === 'syntax'))
  assert.ok(searchDictionary('〜するために').some((entry) => entry.type === 'syntax'))
})

test('構文ファミリー名と比較解説から同じ仲間をまとめて引ける', () => {
  const results = searchDictionary('使役', { type: 'syntax' })
  const ids = new Set(results.map((entry) => entry.phrase.id))
  for (const id of [
    'curr_syn_gr_auto_pre2_causative_have_001',
    'curr_syn_gr_auto_3_bare_infinitive_001',
    'curr_syn_gr_auto_2_causative_get_001',
  ]) {
    assert.ok(ids.has(id), id)
  }
  assert.equal(results.length, 7)
  assert.equal(searchDictionary('O がその動作をする側', { type: 'syntax' }).length, 7)
})

test('種類での絞り込みは並びを変えずに単語・熟語・構文を選び出す', () => {
  const all = searchDictionary('go')
  for (const type of ['word', 'idiom', 'syntax']) {
    const only = searchDictionary('go', { type })
    assert.ok(only.every((entry) => entry.type === type))
    assert.deepEqual(only.map((entry) => entry.id), all.filter((entry) => entry.type === type).map((entry) => entry.id))
  }
})

test('頭文字の索引はABC順で、単語も熟語も構文も同じ letter に入る', () => {
  const letters = DICTIONARY_INITIALS.map((item) => item.letter).filter((letter) => letter !== '#')
  assert.deepEqual(letters, [...letters].sort())
  assert.equal(
    DICTIONARY_INITIALS.reduce((sum, item) => sum + item.count, 0),
    DICTIONARY_ENTRIES.length,
  )

  const g = dictionaryByInitial('G')
  assert.ok(g.every((entry) => dictionaryInitial(entry.head) === 'G'))
  assert.ok(g.some((entry) => entry.type === 'word'))
  assert.ok(g.some((entry) => entry.type === 'idiom'))
  const goIndex = g.findIndex((entry) => entry.head === 'go')
  assert.ok(goIndex >= 0 && g.findIndex((entry) => entry.head === 'go ahead') > goIndex)
})

test('並べ替えキーは記号を無視し、語の切れ目を英字より前に置く', () => {
  assert.equal(dictionarySortKey('go ahead'), 'go ahead')
  assert.equal(dictionarySortKey('It is ... for — to do'), 'it is for to do')
  assert.equal(dictionarySortKey('no sooner ... than ~'), 'no sooner than')
  assert.ok(dictionarySortKey('go abroad') < dictionarySortKey('goal'))
  assert.equal(dictionaryInitial('~ing form'), 'I')
})

test('検索画面はABC一覧を出さず、単語・熟語・構文を同じ検索欄から引ける', () => {
  const src = readFileSync(new URL('../src/screens/VocabSearch.jsx', import.meta.url), 'utf8')
  const menu = readFileSync(new URL('../src/lib/appMenu.js', import.meta.url), 'utf8')
  assert.ok(src.includes('searchDictionary'))
  assert.ok(src.includes("from '../lib/dictionary.js'"))
  assert.ok(!src.includes('dictionaryByInitial'))
  assert.ok(!src.includes('DICTIONARY_INITIALS'))
  assert.ok(!src.includes('ABCから引く'))
  assert.ok(!src.includes('ABC一覧へ戻る'))
  assert.ok(!menu.includes('ABC順に引く'))
  assert.ok(menu.includes("screenItem('vocabSearch', '英和辞書', '単語・熟語・構文を検索')"))
  for (const label of ['単語', '熟語', '構文']) assert.ok(src.includes(label))
})
