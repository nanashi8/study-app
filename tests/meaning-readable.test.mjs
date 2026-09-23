// 学習者に見せる日本語が「中高生にそのまま読めて、意味が分かる」かを守るテスト。
// 2026-09-23、fathom の意味が「(水深の)尋(名)」（尋＝ひろ。常用漢字だが表外の読み）だったことから作った。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { MEANING_READINGS } from '../src/data/meaning-readings.js'
import { meaningWithReadings } from '../src/lib/meaningReadings.js'
import {
  learnerJapaneseTexts,
  learnerMeaningGlosses,
  learnerJapaneseRuns,
} from '../scripts/checks/learner-japanese-review.mjs'

const ledger = JSON.parse(readFileSync(new URL('../docs/audits/learner-japanese-review.json', import.meta.url), 'utf8'))
const meaningsOf = (id) => ALL_WORDS.find((word) => word.id === id)?.meanings ?? []

test('fathom の意味は、読み方の分かる書き方になっている', () => {
  const meanings = meaningsOf('fathom')
  assert.deepEqual(meanings, ['見抜く', '理解する', '(水深の単位)ひろ(名)'])
  for (const meaning of meanings) assert.doesNotMatch(meaning, /尋/u)
})

test('学習者に通じない訳語を置き直したままにする', () => {
  const gone = [
    ['flap', '垂れ蓋'], ['diligence', '精励'], ['implode', '内破'], ['journal', '仕訳帳'],
    ['contrition', '痛悔'], ['linen', '亜麻布'], ['quill', '羽軸'], ['stump', '断端'],
    ['harangue', '長広舌'], ['tirade', '長広舌'], ['iconoclast', '因習打破論者'], ['dote', '盲愛'],
    ['misnomer', '誤称'], ['hopelessness', '無望'], ['lunar', '太陰'], ['junket', '遊山'],
    ['boulder', '巨礫'], ['adulation', '阿諛'], ['populate', '人口を与える'], ['abnegation', '克己'],
  ]
  for (const [id, word] of gone) {
    const meanings = meaningsOf(id)
    assert.ok(meanings.length, `${id} が辞書にない`)
    for (const meaning of meanings) assert.ok(!meaning.includes(word), `${id} の意味に「${word}」が残っている`)
  }
})

test('意味の欄の訳語は、全件を読んだ台帳に載っている', () => {
  const reviewed = new Set(ledger.glosses)
  const glosses = learnerMeaningGlosses()
  const unreviewed = [...glosses].filter((text) => !reviewed.has(text))
  assert.deepEqual(unreviewed, [], '読んでいない訳語がある')
  const stale = [...reviewed].filter((text) => !glosses.has(text))
  assert.deepEqual(stale, [], '教材に出てこない訳語が台帳に残っている')
})

test('学習者に見せる日本語の漢字語は、全件を読んだ台帳に載っている', () => {
  const decisions = new Map()
  for (const [decision, list] of Object.entries(ledger.decisions)) for (const run of list) decisions.set(run, decision)
  const runs = learnerJapaneseRuns()
  const unreviewed = [...runs.keys()].filter((run) => !decisions.has(run))
  assert.deepEqual(unreviewed, [], '読んでいない漢字語がある')
  const stale = [...decisions.keys()].filter((run) => !runs.has(run))
  assert.deepEqual(stale, [], '教材に出てこない漢字語が台帳に残っている')
})

test('読みの台帳の語は、意味の欄で（よみ）が付いて出る', () => {
  for (const run of ledger.decisions.reading) {
    const reading = MEANING_READINGS.find(([text]) => text === run)?.[1]
    assert.ok(reading, `「${run}」の読みが台帳にない`)
    assert.equal(meaningWithReadings(run), `${run}（${reading}）`)
  }
})

test('本文に読みを書いた語は、そのとおり読みが書いてある', () => {
  const texts = learnerJapaneseTexts().map(([text]) => text)
  for (const run of ledger.decisions.inline) {
    const written = texts.some((text) => new RegExp(`${run}[(（][ぁ-ゖー・=＝]`, 'u').test(text))
    assert.ok(written, `「${run}」に本文の読みがない`)
  }
})
