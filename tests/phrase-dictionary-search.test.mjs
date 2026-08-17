// 辞書検索が熟語・構文も引けることの回帰テスト。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PHRASES, getPhrase } from '../src/data/phrases.js'
import { phraseMatchRank, phraseSearchText } from '../src/lib/vocabSearch.js'

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

test('検索画面が単語と熟語・構文の両方を対象にしている', () => {
  const src = readFileSync(new URL('../src/screens/VocabSearch.jsx', import.meta.url), 'utf8')
  assert.ok(src.includes('phraseMatchRank'))
  assert.ok(src.includes("from '../data/phrases.js'"))
  assert.ok(src.includes('熟語・構文'))
})
