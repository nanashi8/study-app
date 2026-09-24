// 依頼 2026-09-24-classics-enrich の条件 kanbun-grammar-master。
// 漢文法の必修項目リスト（docs/audits/classics-coverage.json の kanbunGrammar）の全件が、
// 形・読みと意味・訓読文・書き下し文・現代語訳つきの項目としてあること。リストにない項目は教材に置かない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { kanbunKakikudashiMatch, kanbunNotationIssues } from '../src/lib/kanbun-marks.js'

const coverage = JSON.parse(readFileSync(new URL('../docs/audits/classics-coverage.json', import.meta.url), 'utf8'))

// 依頼の文に挙げた句法の範囲。どれも1項目以上入っていること。
const SECTIONS = [
  '訓読の決まり', '置き字', '返読文字', '再読文字', '否定', '使役', '受身', '疑問と反語', '比較と選択',
  '限定と累加', '抑揚', '仮定', '願望', '詠嘆', '比況', '倒置と強調', '慣用の形',
]

// 依頼より前からある用例の重複（どちらも既存の項目）。
const EXISTING_SHARED_EXAMPLES = new Set(['複合返り点/使役「使」'])

test('漢文法の必修項目：必修項目リストの全件が項目としてあり、形・読みと意味・用例を持つ', () => {
  const list = coverage.kanbunGrammar
  assert.equal(list.length, 131)
  assert.equal(list.filter((entry) => entry.since === 'existing').length, 87, '既存87項目を含む')
  assert.equal(new Set(list.map((entry) => entry.title)).size, list.length, '必修項目リストに重複がある')
  const byTitle = new Map(KANBUN_GRAMMAR.map((item) => [item.title, item]))
  for (const entry of list) {
    const item = byTitle.get(entry.title)
    assert.ok(item, `「${entry.title}」が漢文法にない`)
    for (const key of ['pattern', 'answer', 'detail', 'clue', 'marked', 'kakikudashi', 'translation', 'pitfall']) {
      assert.ok(item[key]?.trim(), `${item.id} ${item.title}: ${key} がない`)
    }
    assert.ok(kanbunKakikudashiMatch(item.marked, item.kakikudashi).ok, `${item.id} ${item.title}: 訓読文と書き下し文が一字一致しない`)
    assert.deepEqual(kanbunNotationIssues(item.marked), [], `${item.id} ${item.title}: 返り点の規則`)
  }
  const listed = new Set(list.map((entry) => entry.title))
  for (const item of KANBUN_GRAMMAR) assert.ok(listed.has(item.title), `${item.id} ${item.title} が必修項目リストにない`)
  const sections = new Set(list.map((entry) => entry.section))
  for (const section of SECTIONS) assert.ok(sections.has(section), `範囲「${section}」の項目がない`)
  assert.deepEqual([...sections].filter((section) => !SECTIONS.includes(section)), [], '依頼にない範囲がある')
})

test('漢文法の必修項目：依頼に名前を挙げた字・形を、それぞれ項目として持つ', () => {
  const titles = new Set(KANBUN_GRAMMAR.map((item) => item.title))
  // 再読文字の全字。
  for (const char of ['未', '将', '且', '当', '応', '宜', '須', '猶', '由', '盍']) {
    assert.ok(titles.has(`再読文字「${char}」`), `再読文字「${char}」がない`)
  }
  // 否定（二重否定・部分否定と全部否定・禁止）、疑問詞と文末の字、慣用の形。
  for (const title of [
    '二重否定「無不」', '二重否定「非不」', '部分否定「不必」', '部分否定「不常」', '否定の語順「不復」と「復不」',
    '禁止「勿」', '禁止「毋」', '疑問・反語の文末の字', '疑問詞「何」', '疑問詞「胡・奚・曷」',
    '慣用「所以」', '慣用「所謂」', '慣用「以為」', '慣用「以A為B」',
    '置き字「於」', '置き字「而」', '文末の置き字「矣・焉・兮」', '返読文字',
  ]) {
    assert.ok(titles.has(title), `「${title}」がない`)
  }
})

test('漢文法の必修項目：この依頼で足した項目の用例は、ほかの項目と重ならない', () => {
  const seen = new Map()
  for (const item of KANBUN_GRAMMAR) {
    const prior = seen.get(item.marked)
    if (prior) {
      const added = [prior, item].some((entry) => Number(entry.id.slice(3)) > 87)
      assert.ok(!added, `${prior.id} と ${item.id} が同じ用例を使っている`)
      assert.ok(EXISTING_SHARED_EXAMPLES.has(`${prior.title}/${item.title}`), `用例の重複 ${prior.title}/${item.title}`)
    }
    seen.set(item.marked, item)
  }
})
