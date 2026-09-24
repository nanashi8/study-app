// 依頼 2026-09-24-classics-enrich の条件 kanbun-vocab-master。
// 漢語の必修語リスト（docs/audits/classics-coverage.json の kanbunVocab）の全件が、
// 訓読文（送り仮名・返り点つき）・書き下し文・現代語訳つきの見出しとしてあること。リストにない語は教材に置かない。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { kanbunKakikudashiMatch, kanbunNotationIssues } from '../src/lib/kanbun-marks.js'

const coverage = JSON.parse(readFileSync(new URL('../docs/audits/classics-coverage.json', import.meta.url), 'utf8'))

// 依頼の文に挙げた分類と、比べる相手のない基本の名詞（時・自然の基本語）。どれも1語以上入っていること。
const SECTIONS = [
  '読みが問われる副詞・接続語', '人称と指示の語', '疑問・反語の語', '意味が現代と違う名詞',
  '身分と官職', '思想の徳目', '重要な動詞・形容詞', '時・自然の基本語',
]

// 依頼より前からある用例の重複（どちらも既存の語）。この依頼で足した語は、ほかの語と用例を共有しない。
const EXISTING_SHARED_EXAMPLES = new Set(['聞/朝', '行/難'])

test('漢語の必修語：必修語リストの全件が見出しとしてあり、読み・意味・訓読文・書き下し文・現代語訳を持つ', () => {
  const list = coverage.kanbunVocab
  assert.equal(list.length, 293)
  assert.equal(list.filter((entry) => entry.since === 'existing').length, 120, '既存120語を含む')
  assert.equal(new Set(list.map((entry) => entry.title)).size, list.length, '必修語リストに重複がある')
  const byTitle = new Map(KANBUN_VOCAB.map((item) => [item.title, item]))
  for (const entry of list) {
    const item = byTitle.get(entry.title)
    assert.ok(item, `「${entry.title}」が漢語にない`)
    for (const key of ['reading', 'answer', 'detail', 'clue', 'marked', 'kakikudashi', 'translation', 'pitfall']) {
      assert.ok(item[key]?.trim(), `${item.id} ${item.title}: ${key} がない`)
    }
    assert.ok(kanbunKakikudashiMatch(item.marked, item.kakikudashi).ok, `${item.id} ${item.title}: 訓読文と書き下し文が一字一致しない`)
    assert.deepEqual(kanbunNotationIssues(item.marked), [], `${item.id} ${item.title}: 返り点の規則`)
  }
  const listed = new Set(list.map((entry) => entry.title))
  for (const item of KANBUN_VOCAB) assert.ok(listed.has(item.title), `${item.id} ${item.title} が必修語リストにない`)
  const sections = new Set(list.map((entry) => entry.section))
  for (const section of SECTIONS) assert.ok(sections.has(section), `分類「${section}」の語がない`)
  assert.deepEqual([...sections].filter((section) => !SECTIONS.includes(section)), [], '依頼にない分類がある')
})

test('漢語の必修語：この依頼で足した語の用例は、ほかの漢語・漢文法の用例と重ならない', () => {
  const seen = new Map()
  for (const item of [...KANBUN_VOCAB, ...KANBUN_GRAMMAR]) {
    const prior = seen.get(item.marked)
    if (prior) {
      const pair = `${prior.title}/${item.title}`
      const added = [prior, item].some((entry) => entry.id.startsWith('kv') && Number(entry.id.slice(2)) > 120)
      assert.ok(!added, `${prior.id} と ${item.id} が同じ用例を使っている`)
      if (prior.id.startsWith('kv') && item.id.startsWith('kv')) assert.ok(EXISTING_SHARED_EXAMPLES.has(pair), `漢語どうしの用例の重複 ${pair}`)
    }
    seen.set(item.marked, item)
  }
})
