import test from 'node:test'
import assert from 'node:assert/strict'

import { getWord } from '../src/data/vocab.js'
import { getPhrase } from '../src/data/phrases.js'
import { EXAM_USAGE_GUIDES } from '../src/data/exam-lexicon.js'
import { USAGE_GUIDE_CARDS } from '../src/data/usage-guide-cards.js'
import { ALL_USAGE_GUIDES, USAGE_GUIDES_BY_PHRASE, USAGE_GUIDES_BY_WORD } from '../src/data/usage-guides.js'

// 使い分けカード（入試の43枚＋候補の組を全件読んで足したカード）の中身（requests/2026-10-26-usage-guide-cards.json）。
// 例文の英語は check-data.mjs の英文監査、日本語は学習者向け日本語の監査（learner-japanese-audit）が見る。

const filled = (text) => typeof text === 'string' && text.trim().length > 0
// 見出しに出す形。熟語の ~ ・ ... ・ A / B と、語の大文字・アポストロフィの違いをならす。
const plain = (text) => String(text ?? '').toLowerCase().replace(/[’']/g, "'").replace(/[~〜…]|\.\.\./g, ' ').replace(/\b[ab]\b/g, ' ').replace(/\s+/g, ' ').trim()

test('使い分けカードの数と id（入試の43枚に、全件読んで足したカードを合わせる）', () => {
  assert.equal(EXAM_USAGE_GUIDES.length, 43)
  // 2026-10-26 に候補の組を全件読んで 152枚を足した。
  assert.equal(USAGE_GUIDE_CARDS.length, 152)
  assert.equal(ALL_USAGE_GUIDES.length, 195)
  assert.equal(new Set(ALL_USAGE_GUIDES.map((guide) => guide.id)).size, ALL_USAGE_GUIDES.length)
})

test('どのカードもまとめの一文・語ごとの決まり・例文と和訳を持つ', () => {
  for (const guide of ALL_USAGE_GUIDES) {
    assert.ok(filled(guide.title) && filled(guide.summary), guide.id)
    assert.ok(guide.choices.length >= 2, `${guide.id}: 比べる項目が2つ未満`)
    for (const choice of guide.choices) {
      for (const key of ['term', 'rule', 'example', 'ja']) assert.ok(filled(choice[key]), `${guide.id} ${choice.term} の ${key}`)
      assert.match(choice.example, /^[A-Z“"].*[.?!]["”]?$/, `${guide.id} ${choice.term}: 例文が文になっていない`)
      assert.match(choice.ja, /[。？！]$/, `${guide.id} ${choice.term}: 和訳が文になっていない`)
    }
    if (guide.preferred) {
      for (const key of ['avoid', 'use', 'reason']) assert.ok(filled(guide.preferred[key]), `${guide.id} preferred.${key}`)
      assert.notEqual(guide.preferred.avoid, guide.preferred.use, guide.id)
    }
  }
})

test('カードの語・熟語は辞書の見出し語と熟語・構文に実在し、2つ以上を比べる', () => {
  for (const guide of ALL_USAGE_GUIDES) {
    for (const id of guide.wordIds) assert.ok(getWord(id), `${guide.id}: 見出し語 ${id} がない`)
    for (const id of guide.phraseIds) assert.ok(getPhrase(id), `${guide.id}: 熟語 ${id} がない`)
    assert.equal(new Set(guide.wordIds).size, guide.wordIds.length, `${guide.id}: 見出し語の重複`)
    assert.equal(new Set(guide.phraseIds).size, guide.phraseIds.length, `${guide.id}: 熟語の重複`)
    assert.ok(guide.wordIds.length + guide.phraseIds.length >= 2, `${guide.id}: 比べる語が2つ未満`)
  }
})

test('カードの語・熟語は、すべて見出しか項目の名前に出ている（比べない語をカードに入れない）', () => {
  for (const guide of ALL_USAGE_GUIDES) {
    const shown = plain([guide.title, ...guide.choices.map((choice) => choice.term)].join(' / '))
    const members = [
      ...guide.wordIds.map((id) => getWord(id).word),
      ...guide.phraseIds.map((id) => getPhrase(id).phrase),
    ]
    for (const text of members) {
      // 文法の構文カードには、見出しが例文そのもの（Ken will play tennis tomorrow.）のものがある。それは形ではないので見ない。
      if (/[.?!]$/.test(text.trim())) continue
      // do・doing は動詞が入る場所の印なので見出しに出さなくてよい。
      const parts = plain(text).split(' ').filter((part) => part && !['do', 'doing'].includes(part))
      assert.ok(parts.every((part) => shown.includes(part)), `${guide.id}: ${text} が見出しにも項目にも出ていない`)
    }
  }
})

test('語・熟語からカードを逆に引ける', () => {
  for (const guide of ALL_USAGE_GUIDES) {
    for (const id of guide.wordIds) {
      assert.ok(USAGE_GUIDES_BY_WORD[id].includes(guide), `${guide.id} ← ${id}`)
      assert.ok(getWord(id).usageGuides.some((item) => item.id === guide.id), `${id} の usageGuides に ${guide.id} がない`)
    }
    for (const id of guide.phraseIds) assert.ok(USAGE_GUIDES_BY_PHRASE[id].includes(guide), `${guide.id} ← ${id}`)
  }
})
