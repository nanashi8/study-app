// 辞書の検索で「ほかの意味」からも引けることを守るテスト（requests/2026-10-02-dictionary-search-other-senses.json）。
//
// 2026-10-02 まで、辞書の検索は見出し語・代表義・例文・類義語などを見ていたが、ほかの意味（word-senses.js と、
// 代表義に入らない疑問詞・関係詞の働き。vocab.js が otherSenses に合流する）を見ていなかった（「権利」で right が出ない）。
//   全件       … ほかの意味143件の訳語の全体と「・」で区切った1つずつで、その語が検索結果に出る
//   順位       … 代表義で当たった語（3）の次（3.5）、例文などで当たった語（4）より上。ほかの意味の例文は 4 で引ける
//   別の語     … 同じつづりの別の語（homograph-words.js）は、自分の意味で当たるときだけ上位に出る
//   自作カード … ほかの意味の欄の訳語から、辞書の検索に混ぜて出す自作カードの英単語が出る
//   ノート     … 単語帳の画面のノートの検索でも、辞書の語と自作カードのほかの意味から引ける
import assert from 'node:assert/strict'
import test from 'node:test'
import { ALL_WORDS, homographsFor, registerCustomWords } from '../src/data/vocab.js'
import { WORD_SENSES } from '../src/data/word-senses.js'
import { HOMOGRAPH_WORDS } from '../src/data/homograph-words.js'
import { searchDictionary } from '../src/lib/dictionary.js'
import {
  OTHER_SENSE_RANK,
  matchedOtherSense,
  normalizeVocabQuery,
  vocabMatchRank,
  vocabMeaningMatchRank,
} from '../src/lib/vocabSearch.js'
import { customWordToStudyWord } from '../src/lib/customWords.js'
import { searchNotebookItems } from '../src/lib/learningNotebookCatalog.js'

const SENSES = ALL_WORDS.flatMap((word) => (word.otherSenses ?? []).map((sense) => ({ word, sense })))
// 訳語の全体と、「・」で区切った1つずつ（同じものは1回。区切りのない訳語は全体だけ）。
const queriesOf = (meaning) => [...new Set([meaning, ...meaning.split('・')].map((part) => part.trim()).filter(Boolean))]
const includesQuery = (texts, query) => texts.some((text) => normalizeVocabQuery(text).includes(normalizeVocabQuery(query)))
const representativeTexts = (word) => [word.meaning, ...(word.meanings ?? [])]
const ownMeaningTexts = (word) => [...representativeTexts(word), ...(word.otherSenses ?? []).map((sense) => sense.meaning)]

test('ほかの意味は143件（word-senses.js の113語126件と、疑問詞・関係詞の働きの17件）で、どれも辞書の語にある', () => {
  const ids = Object.keys(WORD_SENSES)
  assert.equal(ids.length, 113)
  assert.equal(ids.reduce((sum, id) => sum + WORD_SENSES[id].length, 0), 126)
  const wordIds = new Set(ALL_WORDS.map((word) => word.id))
  assert.deepEqual(ids.filter((id) => !wordIds.has(id)), [])
  assert.equal(SENSES.length, 143, 'ほかの意味を足したら、ここの数を直す')
  assert.equal(SENSES.filter(({ sense }) => sense.role).length, 17)
})

test('ほかの意味143件の訳語の全体と「・」で区切った1つずつで検索すると、その語が出る', () => {
  let queries = 0
  for (const { word, sense } of SENSES) {
    for (const query of queriesOf(sense.meaning)) {
      queries += 1
      // 見出し語に当たる訳語はないので、順位は代表義（3）か、ほかの意味（3.5）。
      const expected = includesQuery(representativeTexts(word), query) ? 3 : OTHER_SENSE_RANK
      assert.equal(vocabMatchRank(word, query), expected, `${word.id}「${query}」の順位`)
      if (expected === OTHER_SENSE_RANK) {
        assert.ok(normalizeVocabQuery(matchedOtherSense(word, query)?.meaning ?? '').includes(normalizeVocabQuery(query)), `${word.id}「${query}」: 当たったほかの意味`)
      } else {
        assert.equal(matchedOtherSense(word, query), null, `${word.id}「${query}」: 代表義で当たるときは添えない`)
      }
    }
    // 検索画面と同じ入口（単語・熟語・構文をまとめた検索の、単語の分）でも出る。
    assert.ok(searchDictionary(sense.meaning, { type: 'word' }).some((entry) => entry.word.id === word.id), `${word.id}: 「${sense.meaning}」で出ない`)
  }
  assert.equal(queries, 393)
})

test('順位：ほかの意味で当たった語は、代表義で当たった語の次、例文などで当たった語より上に並ぶ', () => {
  const query = '権利'
  const hits = searchDictionary(query, { type: 'word' })
  const ranks = hits.map((entry) => vocabMatchRank(entry.word, query))
  assert.deepEqual(ranks, [...ranks].sort((a, b) => a - b), '一致の強い順')
  const right = hits.findIndex((entry) => entry.word.id === 'right')
  assert.ok(right > 0, 'right が出て、代表義で当たる語がその前にある')
  assert.equal(ranks[right], OTHER_SENSE_RANK)
  assert.ok(ranks.slice(0, right).every((rank) => rank <= 3), '前は代表義までの一致')
  assert.ok(ranks.slice(right + 1).some((rank) => rank === 4), '後ろに例文などでしか当たらない語がある')
  assert.equal(matchedOtherSense(hits[right].word, query).meaning, '権利')
})

test('ほかの意味の例文（英文と和訳）は、代表義の例文と同じく例文などの一致で引ける', () => {
  let examples = 0
  for (const { word, sense } of SENSES) {
    for (const text of [sense.example?.en, sense.example?.ja].filter(Boolean)) {
      examples += 1
      const rank = vocabMatchRank(word, text)
      assert.ok(rank >= 0 && rank <= 4, `${word.id}: 「${text}」で出ない`)
    }
  }
  assert.equal(examples, 286)
})

test('同じつづりの別の語は、ほかの意味と取り違えて上位に出ない（自分の意味で当たるときだけ上位に出る）', () => {
  assert.equal(HOMOGRAPH_WORDS.length, 78)
  let checked = 0
  // ほかの意味を持つ語の、同じつづりの別の語。
  for (const { word, sense } of SENSES) {
    for (const other of homographsFor(word)) {
      for (const query of queriesOf(sense.meaning)) {
        checked += 1
        if (includesQuery(ownMeaningTexts(other), query)) continue
        assert.equal(vocabMeaningMatchRank(other, query), -1, `${other.id} が ${word.id} のほかの意味「${query}」で上位に出る`)
        assert.equal(matchedOtherSense(other, query), null)
      }
    }
  }
  // 同じつづりの語のまとまりのすべての語の代表義で、まとまりのほかの語が上位に出ない。
  const groups = ALL_WORDS.filter((word) => homographsFor(word).length)
  for (const word of groups) {
    for (const other of homographsFor(word)) {
      for (const query of queriesOf(word.meaning)) {
        checked += 1
        if (includesQuery(ownMeaningTexts(other), query)) continue
        assert.equal(vocabMeaningMatchRank(other, query), -1, `${other.id} が ${word.id} の意味「${query}」で上位に出る`)
      }
    }
  }
  assert.ok(checked > 400, `照らし合わせた組 ${checked}`)
})

test('自作カードの英単語は、ほかの意味の欄の訳語から引け、当たったほかの意味を添えられる', () => {
  const word = customWordToStudyWord({
    word: 'glimmer',
    meanings: 'かすかな光',
    pos: '名',
    level: '2',
    otherSenses: [{ pos: '動', meaning: 'ちらちら光る・かすかに見える' }],
  })
  assert.ok(word)
  assert.equal(vocabMeaningMatchRank(word, 'かすかな光'), 3)
  assert.equal(vocabMeaningMatchRank(word, 'ちらちら光る'), OTHER_SENSE_RANK)
  assert.equal(vocabMeaningMatchRank(word, 'かすかに見える'), OTHER_SENSE_RANK)
  assert.deepEqual(matchedOtherSense(word, 'ちらちら光る'), { pos: '動', meaning: 'ちらちら光る・かすかに見える', level: '2' })
  assert.equal(vocabMeaningMatchRank(word, '関係のない言葉'), -1)

  // ノートの検索でも、登録した自作カードの英単語がほかの意味から出る。
  registerCustomWords([word])
  try {
    assert.ok(searchNotebookItems('vocab', 'ちらちら光る').some((item) => item.id === word.id))
  } finally {
    registerCustomWords([])
  }
})

test('単語帳の画面のノートの検索でも、辞書の語のほかの意味143件の訳語から引ける', () => {
  let queries = 0
  for (const { word, sense } of SENSES) {
    for (const query of queriesOf(sense.meaning)) {
      queries += 1
      assert.ok(searchNotebookItems('vocab', query).some((item) => item.id === word.id), `${word.id}: ノートで「${query}」から出ない`)
    }
  }
  assert.equal(queries, 393)
  assert.ok(searchNotebookItems('vocab', '権利').some((item) => item.id === 'right'))
})
