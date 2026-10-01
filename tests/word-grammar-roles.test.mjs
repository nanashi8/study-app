// 疑問詞・関係詞の語の「文の中での働き」（requests/2026-10-01-wh-word-grammar-roles.json の core-four・same-type-words・
// screens（データの部分）・etymology-links）。
// 2026-10-01 利用者: 「who, whose, whom, whichの単語の意味に関係代名詞や疑問視の意味や解説を載せないのか？」
//   母集団は英語の疑問詞・関係詞の語17語。辞書の見出し語にある11語すべてに、働き（疑問詞・関係代名詞など）ごとの
//   意味・形・解説・例文・文法の参考書の単元を載せ、代表義の訳語がどの働きの意味かも示す。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ALL_WORDS, etymologyStoryForWord, getWord } from '../src/data/vocab.js'
import { quizMeaning, splitMeanings } from '../src/data/compact.js'
import {
  GRAMMAR_ROLE_STYLES,
  GRAMMAR_ROLE_UNITS,
  WH_WORDS,
  WH_WORDS_NOT_HEADWORDS,
  WORD_GRAMMAR_ROLES,
} from '../src/data/word-grammar-roles.js'
import { GRAMMAR_REFERENCE_UNITS } from '../src/data/grammar-reference/index.js'
import { getPassage } from '../src/data/passages.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import { resolveLiteratureEnglishWord } from '../src/data/literature-vocabulary.js'
import { resolveReferenceWord } from '../src/lib/grammarReferenceText.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { searchDictionary } from '../src/lib/dictionary.js'
import { exampleSenseGap } from '../scripts/checks/example-learned-sense.mjs'
import { PHRASES } from '../src/data/phrases.js'

const HEADWORDS = ['who', 'whom', 'whose', 'which', 'what', 'that', 'when', 'where', 'why', 'how', 'however']
const LEVEL_IDS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const roleOf = (id) => getWord(id).grammarRoles
const find = (id, role, pos) => roleOf(id).filter((item) => item.role === role && (!pos || item.pos === pos))

let vite
let components
before(async () => {
  vite = await createServer({ configFile: false, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } })
  components = {
    roles: await vite.ssrLoadModule('/src/components/GrammarRoles.jsx'),
    bits: await vite.ssrLoadModule('/src/components/WordBits.jsx'),
    vocab: await vite.ssrLoadModule('/src/data/vocab.js'),
  }
})
after(async () => {
  await vite?.close()
})

test('疑問詞・関係詞の語17語のうち、辞書の見出し語11語すべてに働きがあり、見出し語にない6語は理由がある', () => {
  assert.equal(WH_WORDS.length, 17)
  const headwords = WH_WORDS.filter((id) => getWord(id))
  assert.deepEqual(headwords, HEADWORDS)
  assert.deepEqual(Object.keys(WORD_GRAMMAR_ROLES).sort(), [...HEADWORDS].sort())
  for (const id of headwords) assert.ok(roleOf(id).length >= 2, `${id}: 働きが2つ以上ある`)
  const missing = WH_WORDS.filter((id) => !getWord(id))
  assert.deepEqual(missing, ['whoever', 'whomever', 'whatever', 'whichever', 'whenever', 'wherever'])
  for (const id of missing) assert.match(WH_WORDS_NOT_HEADWORDS[id], /複合関係詞.*参考書/u, id)
  // 働きを持つのは、この11語だけ（ほかの語にまぎれこまない）。
  assert.deepEqual(ALL_WORDS.filter((word) => word.grammarRoles?.length).map((word) => word.id).sort(), [...HEADWORDS].sort())
})

test('who・whom・whose・which に、疑問詞と関係代名詞の意味と解説がそろう', () => {
  // who: 疑問詞（代表義）・関係代名詞（主格）・継続用法
  assert.deepEqual(roleOf('who').map((item) => [item.role, item.level, item.meaning, Boolean(item.main)]), [
    ['疑問詞', '5', '誰が・誰', true],
    ['関係代名詞', '3', '〜する(人)', false],
    ['関係代名詞・継続用法', 'pre2', 'そしてその人は〜', false],
  ])
  assert.match(find('who', '関係代名詞')[0].explain, /先行詞.*主格/u)
  assert.match(find('who', '関係代名詞・継続用法')[0].explain, /コンマ.*that は使えない/u)
  // whom: 疑問詞（代表義）・関係代名詞（目的格・前置詞＋whom・数量＋of whom）
  assert.deepEqual(roleOf('whom').map((item) => [item.role, item.level, item.meaning, Boolean(item.main)]), [
    ['疑問詞', 'pre2', 'だれを・だれに', true],
    ['関係代名詞', '3', '〜が…する(人)', false],
  ])
  assert.match(find('whom', '関係代名詞')[0].explain, /目的格.*前置詞.*of whom/u)
  assert.deepEqual(find('whom', '関係代名詞')[0].grammar, ['gref_3_relative', 'gref_pre2_preprel', 'gref_2_relapp'])
  // whose: 疑問詞（誰の・誰のもの）・関係代名詞（所有）
  assert.deepEqual(roleOf('whose').map((item) => [item.role, item.meaning, Boolean(item.main)]), [
    ['疑問詞', '誰の', true],
    ['疑問詞', '誰のもの', false],
    ['関係代名詞', 'その〜が…する(人・物)', false],
  ])
  assert.match(find('whose', '関係代名詞')[0].explain, /持ち主.*whose＋名詞/u)
  // which: 疑問詞（どれ・どちら／どの・どちらの）・関係代名詞（前置詞＋which）・継続用法
  assert.deepEqual(roleOf('which').map((item) => [item.role, item.pos, item.meaning, Boolean(item.main)]), [
    ['疑問詞', '代', 'どれ・どちら', true],
    ['疑問詞', '形', 'どの・どちらの', false],
    ['関係代名詞', '代', '〜する(物・事)', false],
    ['関係代名詞・継続用法', '代', 'そしてそれは〜', false],
  ])
  assert.match(find('which', '関係代名詞')[0].explain, /前置詞のすぐ後ろでは that ではなく which/u)
})

test('what・that・when・where・why・how・however にも、疑問詞・関係詞の働きと代表義の訳語の働きがそろう', () => {
  const shape = (id) => roleOf(id).map((item) => `${item.main ? '代表義:' : ''}${item.role}`)
  assert.deepEqual(shape('what'), ['代表義:疑問詞', '関係代名詞', '感嘆文'])
  assert.deepEqual(shape('that'), ['代表義:指示語', '代表義:接続詞', '関係代名詞'])
  assert.deepEqual(shape('when'), ['代表義:疑問詞', '代表義:接続詞', '関係副詞'])
  assert.deepEqual(shape('where'), ['代表義:疑問詞', '関係副詞'])
  assert.deepEqual(shape('why'), ['代表義:疑問詞', '関係副詞'])
  assert.deepEqual(shape('how'), ['代表義:疑問詞', '関係副詞', '感嘆文'])
  assert.deepEqual(shape('however'), ['代表義:接続副詞', '複合関係詞'])
  assert.match(find('what', '関係代名詞')[0].explain, /先行詞を置かない/u)
  assert.match(find('that', '関係代名詞')[0].explain, /継続用法.*前置詞のすぐ後ろでは使えない/u)
  for (const id of ['when', 'where', 'why', 'how']) assert.deepEqual(find(id, '関係副詞')[0].grammar, ['gref_pre2_reladv'], id)
  assert.match(find('however', '複合関係詞')[0].explain, /no matter how/u)
  // where の「〜の場所」はどの働きにも当たらない訳語だったので、「どこで」に直した。
  assert.equal(getWord('where').meaning, 'どこに・どこで')
})

test('働きはどれも名前・品詞・級・意味・形・解説・参考書の単元を持ち、代表義の訳語はちょうど1回ずつ働きに入る', () => {
  const references = new Map(GRAMMAR_REFERENCE_UNITS.map((unit) => [unit.id, unit]))
  for (const [unitId, unit] of Object.entries(GRAMMAR_ROLE_UNITS)) {
    assert.equal(references.get(unitId)?.level, unit.level, unitId)
    assert.equal(references.get(unitId)?.topic, unit.topic, unitId)
  }
  for (const id of HEADWORDS) {
    const word = getWord(id)
    const mainGlosses = []
    for (const item of word.grammarRoles) {
      const at = `${id} ${item.role} ${item.meaning}`
      assert.ok(Object.hasOwn(GRAMMAR_ROLE_STYLES, item.role), at)
      assert.ok(['代', '形', '副', '接'].includes(item.pos), at)
      assert.ok(LEVEL_IDS.has(item.level), at)
      assert.ok(item.form?.trim(), `${at}: 形`)
      assert.match(item.explain, /。$/u, `${at}: 解説`)
      for (const unitId of item.grammar) assert.ok(GRAMMAR_ROLE_UNITS[unitId], `${at}: ${unitId}`)
      if (item.main) {
        mainGlosses.push(...splitMeanings(item.meaning))
      } else {
        // 代表義に入らない働きは、例文を持ち、ほかの意味にも合流している（長文のタップ・例文の確認に乗る）。
        assert.match(item.example.en, new RegExp(`\\b${word.word}\\b`, 'iu'), `${at}: 例文に見出し語`)
        assert.ok(word.otherSenses.some((sense) => sense.role === item.role && sense.meaning === item.meaning), `${at}: ほかの意味`)
      }
    }
    assert.deepEqual([...mainGlosses].sort(), [...word.meanings].sort(), `${id}: 代表義の訳語`)
    // 参考書の単元がない働きは whom の疑問詞だけ（疑問詞の whom を説明する単元はない）。
    const withoutUnit = word.grammarRoles.filter((item) => !item.grammar.length).map((item) => `${id}:${item.role}`)
    assert.deepEqual(withoutUnit, id === 'whom' ? ['whom:疑問詞'] : [], id)
  }
})

test('テストの答えは代表義の先頭のまま変わらない', () => {
  const answers = Object.fromEntries(HEADWORDS.map((id) => [id, quizMeaning(getWord(id))]))
  assert.deepEqual(answers, {
    who: '誰が', whom: 'だれを', whose: '誰の', which: 'どれ', what: '何', that: 'あれ',
    when: 'いつ', where: 'どこに', why: 'なぜ', how: 'どのように', however: 'しかしながら',
  })
})

test('長文・名作・参考書の本文で語をタップすると、働きつきの意味が出る。語順訳の解析には働きの意味を渡さない', () => {
  assert.equal(
    resolvePassageWord('who').ja,
    '（疑問詞）誰が・誰／（関係代名詞）〜する(人)／（関係代名詞・継続用法）そしてその人は〜',
  )
  assert.equal(
    resolvePassageWord('that').ja,
    '（指示語）あれ・その／（接続詞）〜ということ／（関係代名詞）〜する(人・物)',
  )
  assert.match(resolvePassageWord('where').ja, /^（疑問詞）どこに・どこで／（関係副詞）〜する\(場所\)$/u)
  // 解析器（reading-grammar.js）が引く形。働きの意味は入らない。
  assert.equal(resolvePassageWord('who', null, { grammarRoles: false }).ja, '誰が・誰')
  assert.equal(resolvePassageWord('that', null, { grammarRoles: false }).ja, 'あれ・その・〜ということ')
  // 参考書・名作のタップも同じ辞書の意味を使う（参考書の語義表には who・which・whose・whom・that を置かない）。
  for (const id of ['who', 'which', 'whose', 'whom', 'that', 'what', 'where']) {
    assert.match(resolveReferenceWord(id).ja, /（関係(代名詞|副詞)）/u, `参考書 ${id}`)
    assert.match(resolveLiteratureEnglishWord(id).ja, /（関係(代名詞|副詞)）/u, `名作 ${id}`)
  }
  // 働きの意味を解析に使うと区切りが動いた4文が、手で確かめた語順訳のまま。
  for (const [passageId, index] of [['p_1_metric_fixation', 29], ['p_pre2_crowded_town_tourism', 17], ['p_pre1_ai_and_work', 6], ['p_pre1_ai_and_work', 38]]) {
    const analysis = analyzeReadingSentence(getPassage(passageId).sentences[index])
    for (const phrase of analysis.meaningPhraseSequence) {
      assert.equal(phrase.reviewState, 'audit-confirmed', `${passageId}#${index}: ${phrase.en}`)
    }
  }
})

test('辞書の検索で、働きの名前（関係代名詞・関係副詞・複合関係詞・疑問詞）から引ける', () => {
  const hits = (query) => new Set(searchDictionary(query, { type: 'word' }).map((entry) => entry.word.id))
  for (const id of ['who', 'whom', 'whose', 'which', 'what', 'that']) assert.ok(hits('関係代名詞').has(id), `関係代名詞 ${id}`)
  for (const id of ['when', 'where', 'why', 'how']) assert.ok(hits('関係副詞').has(id), `関係副詞 ${id}`)
  assert.ok(hits('複合関係詞').has('however'))
  for (const id of ['who', 'whom', 'whose', 'which', 'what', 'when', 'where', 'why', 'how']) assert.ok(hits('疑問詞').has(id), `疑問詞 ${id}`)
  assert.ok(hits('先行詞').has('who'))
})

test('働きの欄は単語カードの裏と辞書ページの部品で出し、ほかの意味の欄には重ねない', () => {
  const { GrammarRoles } = components.roles
  const { OtherSenses } = components.bits
  const word = components.vocab.getWord('who')
  const opened = []
  const html = renderToStaticMarkup(React.createElement(GrammarRoles, { word, onGrammarRef: (unitId) => opened.push(unitId) }))
  for (const text of ['文の中での働き', '疑問詞', '関係代名詞', '関係代名詞・継続用法', '〜する(人)', 'そしてその人は〜', '先行詞', '人 ＋ who ＋ 動詞 〜', 'The boy who is running over there is my brother.', '参考書「関係代名詞」', '参考書「関係代名詞(継続)」', '語順', 'この先の級で出てくる']) {
    assert.ok(html.includes(text.replace(/&/gu, '&amp;')), text)
  }
  assert.equal((html.match(/data-word-grammar-role="/gu) ?? []).length, 3)
  assert.equal((html.match(/data-word-grammar-ref="/gu) ?? []).length, 4)
  // ほかの意味の欄は、働きの意味だけの語では出さない。働きのない語はこれまでどおり。
  assert.equal(renderToStaticMarkup(React.createElement(OtherSenses, { senses: word.otherSenses, level: word.level })), '')
  const right = components.vocab.getWord('right')
  assert.match(renderToStaticMarkup(React.createElement(OtherSenses, { senses: right.otherSenses, level: right.level })), /権利/u)
  assert.equal(renderToStaticMarkup(React.createElement(GrammarRoles, { word: right })), '')
})

test('例文はどれも学ぶ働きの意味で使い、和訳の語と意味の対応を読んで台帳に残してある', () => {
  const gap = exampleSenseGap()
  assert.deepEqual(gap.undecided, [])
  assert.deepEqual(gap.wrong, [])
  assert.deepEqual(gap.stale, [])
})

test('意味が増えた語の語の成り立ちは、働きのつながりを書き、指紋を押し直してある', () => {
  const roleWords = {
    who: /関係代名詞「〜する\(人\)」/u,
    whom: /関係代名詞「〜が…する\(人\)」.*1300年ごろ/u,
    whose: /関係代名詞/u,
    which: /中英語.*関係代名詞/u,
    what: /ベーオウルフ.*関係代名詞/u,
    that: /関係代名詞の使い方も、古英語のころから/u,
    when: /接続詞.*関係副詞/u,
    where: /「どこに・どこで」.*関係副詞/u,
    why: /関係副詞「〜する\(理由\)」/u,
    how: /感嘆文.*関係副詞/u,
  }
  for (const [id, pattern] of Object.entries(roleWords)) {
    const story = etymologyStoryForWord(getWord(id))
    assert.match(story.note, pattern, id)
    assert.equal(story.evidence.reviewedAt, '2026-10-01', id)
  }
  assert.doesNotMatch(etymologyStoryForWord(getWord('where')).note, /〜の場所/u)
  // however は本文がもとから「どんなにしても」→「しかしながら」とつないでいる。
  assert.match(etymologyStoryForWord(getWord('however')).note, /どんなにしても.*しかしながら/u)
})

test('働きの例文は、ほかのカード・熟語・構文・参考書の例文と同じ文・同じ場面にしない', () => {
  // 例文を一文に書き直したときの決まり（内容語の重なり係数0.6以上かつ3語以上、または同じ文は書き直す）。
  // 最初の案では What a beautiful view this is! が参考書・構文と同じ文で、ほか4件が同じ場面だった。
  const STOP = new Set('a an the this that these those is are was were be been being am do does did done have has had having i you he she it we they me him her us them my your his its our their mine yours to of in on at by for from with into over up down out off about as and or but if so not no yes very too also here there now then who whom whose which what when where why how however can could will would shall should may might must just only than more most some any all each every one two own same such s t don didn doesn isn aren wasn weren won couldn shouldn'.split(' '))
  const stem = (word) => word.replace(/'s$/u, '').replace(/ies$/u, 'y').replace(/(ing|ed|es|s)$/u, '')
  const contentWords = (text, head) => new Set((String(text).toLowerCase().match(/[a-z']+/gu) ?? [])
    .filter((word) => !STOP.has(word) && word !== head).map(stem).filter((word) => word.length > 1))
  const pool = []
  for (const word of ALL_WORDS) {
    pool.push({ key: `word:${word.id}`, en: word.example?.en })
    for (const sense of word.otherSenses ?? []) if (sense.example && !sense.role) pool.push({ key: `sense:${word.id}`, en: sense.example.en })
  }
  for (const phrase of PHRASES) pool.push({ key: `phrase:${phrase.id}`, en: phrase.example?.en })
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    const examples = [...unit.forms.map((form) => form.example), ...unit.points.flatMap((point) => point.examples), ...(unit.advanced?.examples ?? [])]
    for (const example of examples.filter(Boolean)) pool.push({ key: `参考書 ${unit.id}`, en: example.en })
  }
  const roleExamples = HEADWORDS.flatMap((id) => roleOf(id).filter((item) => item.example).map((item) => ({ id, en: item.example.en })))
  assert.equal(roleExamples.length, 27)
  const clashes = []
  for (const item of roleExamples) {
    const mine = contentWords(item.en, item.id)
    for (const other of pool) {
      if (!other.en) continue
      const theirs = contentWords(other.en, item.id)
      const shared = [...mine].filter((word) => theirs.has(word))
      const coefficient = shared.length / Math.max(1, Math.min(mine.size, theirs.size))
      if (other.en.trim().toLowerCase() === item.en.trim().toLowerCase() || (shared.length >= 3 && coefficient >= 0.6)) {
        clashes.push(`${item.en} ／ ${other.key}: ${other.en}`)
      }
    }
  }
  assert.deepEqual(clashes, [])
})
