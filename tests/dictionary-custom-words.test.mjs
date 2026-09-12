import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { customWordDraftFromQuery } from '../src/lib/customWords.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('辞書で引いた語は、辞書の見出しにも自作単語にも無い英語のときだけ登録欄へ渡す', () => {
  assert.deepEqual(customWordDraftFromQuery('  Serendipity ', { headwords: ['serene'] }), { word: 'Serendipity' })
  assert.deepEqual(customWordDraftFromQuery('ice  cream'), { word: 'ice cream' })
  assert.deepEqual(customWordDraftFromQuery('ｅ－ｍａｉｌ'), { word: 'e-mail' })
  // 辞書の見出しと同じ語（大文字と小文字・空白の数の違いは同じ語と見なす）
  assert.equal(customWordDraftFromQuery('Happy', { headwords: ['happy', 'happen'] }), null)
  assert.equal(customWordDraftFromQuery('go  ahead', { headwords: ['go ahead'] }), null)
  // 登録済みの自作単語と同じ語
  assert.equal(customWordDraftFromQuery('serendipity', { customWords: [{ word: 'Serendipity' }] }), null)
  // 英語のつづりでないもの・長すぎるもの
  assert.equal(customWordDraftFromQuery('影響'), null)
  assert.equal(customWordDraftFromQuery('abc123'), null)
  assert.equal(customWordDraftFromQuery(''), null)
  assert.equal(customWordDraftFromQuery('a'.repeat(65)), null)
})

test('英和辞書から見つからない語を自作単語の登録へ渡し、登録してもやめても辞書へ戻る', () => {
  const search = read('../src/screens/VocabSearch.jsx')
  const custom = read('../src/screens/CustomWords.jsx')

  // 辞書：見出しに無い英語なら登録の入口を出し、登録欄へ語を渡す。戻り先には引いていた語を載せる。
  assert.match(search, /customWordDraftFromQuery\(q, \{ headwords: pool\.map\(headwordOf\), customWords \}\)/)
  assert.match(search, /data-dictionary-register-custom/)
  assert.match(search, /navigate\('customWords', \{\s*draft: \{ word: draft\.word \},\s*returnTo: \{ screen: 'vocabSearch', params: \{ q: draft\.word \} \},/)
  // 見つからないときの案内の中にも入口を置く。
  assert.match(search, /<NoResults[\s\S]*?registerEntry[\s\S]*?<\/NoResults>/)
  // 登録した自作単語は辞書に混ぜず、検索結果の先頭に「自作」として並べる。
  assert.match(search, /data-dictionary-custom-words/)
  assert.match(search, /customWords\s*\.map\(customWordToStudyWord\)/)
  // 語の詳細・学習・登録から戻ったとき、引いていた語から続ける。
  assert.match(search, /useState\(\(\) => \(typeof params\.q === 'string' \? params\.q : ''\)\)/)
  assert.match(search, /replaceParams\(\{ \.\.\.params, q, type \}\)/)

  // 自作単語の画面：辞書から渡された語で登録欄を開き、登録・やめるのどちらでも辞書へ戻る。
  assert.match(custom, /params\.draft\?\.word/)
  assert.match(custom, /fromDictionary: true/)
  assert.equal((custom.match(/fromDictionary\) back\(\)/g) ?? []).length, 2)
})
