// 教材づくりに使える無償・商用可の素材の台帳（docs/material-sources.json）の決まりを守る。
// 依頼（requests/2026-09-29-free-material-sources.json）で、素材の種類12種の候補の利用条件を一次資料で確かめ、
// 出典の表示が要らないものだけを ready にして、scripts/materials/sources.mjs で取り出して確かめた。
import assert from 'node:assert/strict'
import test from 'node:test'
import { EXPECTED_KINDS, checkCatalog, readCatalog, summarize } from '../scripts/materials/check-material-sources.mjs'
import { HANDLERS } from '../scripts/materials/sources.mjs'

const catalog = readCatalog()

test('台帳は決まりに合い、ready のすべてが取り出して確かめてある', () => {
  assert.deepEqual(checkCatalog(catalog, { requireVerified: true }), [])
})

test('素材の種類12種のどれにも候補がある', () => {
  assert.equal(EXPECTED_KINDS.length, 12)
  for (const row of summarize(catalog)) assert.ok(row.total >= 1, `${row.name} に候補がない`)
})

test('出典の表示が条件のものは ready にならず、利用者に聞くことが書いてある', () => {
  const required = catalog.sources.filter((source) => source.attribution === 'required')
  assert.ok(required.length > 0)
  for (const source of required) {
    assert.notEqual(source.status, 'ready', source.id)
    if (source.status === 'needs-user') assert.ok(source.question.length >= 10, source.id)
  }
})

test('非商用のもの（国土数値情報の河川）は使えないものとして残してある', () => {
  const rivers = catalog.sources.find((source) => source.id === 'ksj-rivers')
  assert.equal(rivers.commercial, false)
  assert.equal(rivers.status, 'rejected')
})

test('ready の取り出し方は scripts/materials/sources.mjs にある', () => {
  for (const source of catalog.sources.filter((item) => item.status === 'ready')) {
    assert.ok(HANDLERS[source.tool.id], `${source.id} の取り出し方 ${source.tool.id}`)
  }
})

// 検査そのものが、決まりに反する台帳を見のがさないこと。
const base = {
  kinds: EXPECTED_KINDS.map((id) => ({ id, name: id })),
  sources: EXPECTED_KINDS.map((kind) => ({
    id: `s-${kind}`,
    kind,
    name: '素材',
    url: 'https://example.org/',
    use: '使い道',
    license: 'CC0',
    commercial: true,
    modify: true,
    attribution: 'none',
    evidence: [{ url: 'https://example.org/license', quote: 'released into the public domain' }],
    checkedOn: '2026-09-29',
    status: 'ready',
    tool: { id: 'wikidata' },
    verified: { on: '2026-09-29', items: 1, bytes: 10, sha256: 'a'.repeat(64) },
  })),
}
const variant = (change) => {
  const copy = structuredClone(base)
  change(copy)
  return checkCatalog(copy, { requireVerified: true })
}

test('決まりに合う台帳では何も言わない', () => {
  assert.deepEqual(variant(() => {}), [])
})

test('出典の表示が条件なのに ready なら止める', () => {
  const problems = variant((copy) => { copy.sources[0].attribution = 'required' })
  assert.ok(problems.some((problem) => problem.includes('出典の表示が条件なのに ready')))
})

test('非商用・改変禁止なのに rejected でなければ止める', () => {
  assert.ok(variant((copy) => { copy.sources[0].commercial = false }).some((problem) => problem.includes('rejected でない')))
  assert.ok(variant((copy) => { copy.sources[0].modify = false }).some((problem) => problem.includes('rejected でない')))
})

test('根拠の一文・確かめた日が無ければ止める', () => {
  assert.ok(variant((copy) => { copy.sources[0].evidence = [] }).some((problem) => problem.includes('根拠')))
  assert.ok(variant((copy) => { copy.sources[0].evidence[0].quote = '' }).some((problem) => problem.includes('原文の一文')))
  assert.ok(variant((copy) => { delete copy.sources[0].checkedOn }).some((problem) => problem.includes('checkedOn')))
})

test('ready なのに取り出し方か確かめた記録が無ければ止める', () => {
  assert.ok(variant((copy) => { copy.sources[0].tool = { id: 'no-such-tool' } }).some((problem) => problem.includes('取り出し方')))
  assert.ok(variant((copy) => { delete copy.sources[0].verified }).some((problem) => problem.includes('verified')))
})

test('種類が欠けたり、候補の無い種類があったりすれば止める', () => {
  assert.ok(variant((copy) => { copy.kinds = copy.kinds.filter((kind) => kind.id !== 'fonts') }).some((problem) => problem.includes('fonts')))
  assert.ok(variant((copy) => { copy.sources = copy.sources.filter((source) => source.kind !== 'rivers') }).some((problem) => problem.includes('rivers')))
})

test('利用者の判断待ちには聞くこと、使えないものには理由が要る', () => {
  assert.ok(variant((copy) => { copy.sources[0].status = 'needs-user' }).some((problem) => problem.includes('question')))
  assert.ok(variant((copy) => {
    copy.sources[0].status = 'rejected'
    copy.sources.push({ ...copy.sources[1], id: 'extra' })
  }).some((problem) => problem.includes('reason')))
})
