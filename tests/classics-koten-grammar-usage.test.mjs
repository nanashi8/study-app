// 依頼 2026-09-24-classics-enrich の条件 koten-grammar-usage。
// 全古典文法項目を読み、紛らわしい相手がある項目に使い分けの解説を、歴史的な変化や身分社会などの背景が
// 関わる項目に時代背景の解説を書く。書かない項目も null で判断を残す。画面にも出す。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('古典文法の使い分け・時代背景：全項目が判断を持つ（書かない項目は null）', () => {
  assert.equal(KOTEN_GRAMMAR.length, 130)
  for (const item of KOTEN_GRAMMAR) {
    for (const key of ['usage', 'background']) {
      assert.ok(Object.hasOwn(item, key), `${item.id}: ${key} の判断がない`)
      const value = item[key]
      assert.ok(value === null || (typeof value === 'string' && value.trim().length >= 20), `${item.id}: ${key} が短すぎるか空`)
    }
    assert.ok(Object.hasOwn(item, 'level'), `${item.id}: 重要度がない`)
  }
  const withUsage = KOTEN_GRAMMAR.filter((item) => item.usage).length
  const withBackground = KOTEN_GRAMMAR.filter((item) => item.background).length
  assert.equal(withUsage, 130, '使い分けの解説の数が変わった（読み直して判断したら数を直す）')
  assert.equal(withBackground, 52, '時代背景の解説の数が変わった（読み直して判断したら数を直す）')
})

test('古典文法の使い分け：依頼に挙げた紛らわしい組は、相手の語に触れて使い分けを書く', () => {
  const PAIRS = [
    ['kg_past_ki', 'けり'], ['kg_past_keri', 'き'],
    ['kg_perfect_tsu', 'ぬ'], ['kg_perfect_nu', 'つ'],
    ['kg_perfect_tari', 'り'], ['kg_perfect_ri', 'エ段'],
    ['kg_present_ramu', 'けむ'], ['kg_past_kemu', 'らむ'], ['kg_conjecture_mu', '主語'],
    ['kg_visual_meri', 'なり'], ['kg_hearsay_nari', '断定'],
    ['kg_voice_raru', '自発'], ['kg_id_raru_imi', '受身'],
    ['kg_honorific_sonkei', '謙譲'], ['kg_honorific_kenjo', '尊敬'],
  ]
  for (const [id, counterpart] of PAIRS) {
    const usage = KOTEN_GRAMMAR_BY_ID[id]?.usage ?? ''
    assert.ok(usage.includes(counterpart), `${id}: 使い分けに「${counterpart}」との違いがない`)
  }
})

test('古典文法の使い分け・時代背景：暗記カードの裏・文法辞典・テストの答え合わせに出す', () => {
  for (const file of ['src/screens/KotenGrammarStudy.jsx', 'src/screens/KotenGrammar.jsx', 'src/screens/KotenGrammarQuiz.jsx']) {
    assert.match(read(file), /<KotenGrammarNotes item=\{item\}/u, `${file}: 使い分け・時代背景を出していない`)
  }
  const extras = read('src/components/KotenGrammarExtras.jsx')
  assert.match(extras, /data-koten-grammar-usage/u)
  assert.match(extras, /<KotenBackground text=\{item\.background\}/u)
})
