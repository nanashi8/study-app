// 依頼 2026-09-24-classics-enrich の条件 kanbun-usage-background。
// 全漢語・全漢文法項目を読み、使い分け（同じ読み・似た形・似た句法との違い）と時代背景（思想・制度・歴史）が
// 関わる項目に解説を書く。書かない項目も null で判断を残す。暗記カードの裏・一覧・テストの答え合わせに出す。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KANBUN_VOCAB_DETAILS } from '../src/data/kanbun-vocab-details.js'
import { KANBUN_GRAMMAR_DETAILS } from '../src/data/kanbun-grammar-details.js'
import { KANBUN_GROUPS } from '../src/lib/kanbunGroups.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const coverage = JSON.parse(read('docs/audits/classics-coverage.json'))

function checkJudged(items, details, label) {
  assert.deepEqual(Object.keys(details).sort(), items.map((item) => item.title).sort(), `${label}: 台帳の見出しが教材と合わない`)
  for (const item of items) {
    for (const key of ['usage', 'background']) {
      assert.ok(Object.hasOwn(details[item.title], key), `${item.title}: ${key} の判断がない`)
      const value = item[key]
      assert.ok(value === null || (typeof value === 'string' && value.trim().length >= 20), `${item.id} ${item.title}: ${key} が短すぎるか空`)
      assert.equal(value, details[item.title][key], `${item.id}: 台帳の ${key} が項目に入っていない`)
    }
  }
}

test('漢語の使い分け・時代背景：全語が判断を持つ（書かない語は null）', () => {
  checkJudged(KANBUN_VOCAB, KANBUN_VOCAB_DETAILS, '漢語')
  assert.equal(KANBUN_VOCAB.filter((item) => item.usage).length, 290, '使い分けの数が変わった（読み直して判断したら数を直す）')
  assert.equal(KANBUN_VOCAB.filter((item) => item.background).length, 67, '時代背景の数が変わった（読み直して判断したら数を直す）')
  // 同じ読みの字の仲間に入る語は、比べる相手があるので必ず使い分けを書く。
  for (const group of KANBUN_GROUPS.filter((entry) => entry.type === 'same')) {
    for (const item of group.items) assert.ok(item.usage, `${item.title}（${group.title}）: 使い分けがない`)
  }
  // 制度・思想が意味に関わる分類（身分と官職・思想の徳目）の語は、全件に時代背景を書く。
  const section = new Map(coverage.kanbunVocab.map((entry) => [entry.title, entry.section]))
  for (const item of KANBUN_VOCAB.filter((entry) => ['身分と官職', '思想の徳目'].includes(section.get(entry.title)))) {
    assert.ok(item.background, `${item.title}（${section.get(item.title)}）: 時代背景がない`)
  }
})

test('漢文法の使い分け・時代背景：全項目が判断を持ち、似た句法との違いを書く', () => {
  checkJudged(KANBUN_GRAMMAR, KANBUN_GRAMMAR_DETAILS, '漢文法')
  assert.equal(KANBUN_GRAMMAR.filter((item) => item.usage).length, 131, '使い分けの数が変わった（読み直して判断したら数を直す）')
  assert.equal(KANBUN_GRAMMAR.filter((item) => item.background).length, 6, '時代背景の数が変わった（読み直して判断したら数を直す）')
  // 紛らわしい組は、相手の形に触れて使い分けを書く。
  const PAIRS = [
    ['再読文字「将」', '且'], ['再読文字「当」', '応'], ['再読文字「猶」', '由'],
    ['部分否定「不常」', '全部否定'], ['部分否定「不必」', '必不'], ['否定の語順「不復」と「復不」', '復不'],
    ['二重否定「非不」', '無不'], ['判断否定「非」', '無'],
    ['受身「見…於…」', '被'], ['反語「豈…乎」', '詠嘆'], ['限定「耳・已・爾」', '唯'],
  ]
  const byTitle = new Map(KANBUN_GRAMMAR.map((item) => [item.title, item]))
  for (const [title, counterpart] of PAIRS) {
    assert.ok(byTitle.get(title)?.usage?.includes(counterpart), `${title}: 使い分けに「${counterpart}」との違いがない`)
  }
})

test('漢文の使い分け・時代背景：暗記カードの裏・一覧・テストの答え合わせに出す', () => {
  assert.match(read('src/screens/KanbunStudy.jsx'), /<KanbunExtras domain=\{domain\} item=\{item\}/u, '暗記カードの裏に出していない')
  assert.match(read('src/screens/KanbunQuiz.jsx'), /<KanbunExtras[\s\S]*?item=\{getKanbunItem\(question\.domain, question\.itemId\)\}/u, 'テストの答え合わせに出していない')
  assert.match(read('src/screens/KanbunCatalog.jsx'), /<KanbunExtras[\s\S]*?item=\{item\}/u, '一覧に出していない')
  const extras = read('src/components/KanbunExtras.jsx')
  assert.match(extras, /data-kanbun-usage/u)
  assert.match(extras, /data-kanbun-background/u)
})
