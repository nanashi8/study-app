// 依頼 2026-09-24-classics-enrich の条件 koten-vocab-background。
// 全古典単語が時代背景の判断（解説か null）を持ち、場面テーマの仲間（宮廷・恋愛・仏教・暦・住まい・死と出家）に
// 入る語は全件が時代背景の解説を持つこと。暗記カードの裏と辞書ページに出る。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GROUPS } from '../src/lib/kotenWordGroups.js'

test('古典単語の時代背景：全語が時代背景の判断を持ち、場面テーマの仲間の語は全件が解説を持つ', () => {
  for (const word of KOTEN_WORDS) {
    assert.ok(word.background === null || (typeof word.background === 'string' && word.background.trim().length >= 20),
      `${word.id} ${word.word}: 時代背景の判断がない（解説か null）`)
  }
  const cultureGroups = KOTEN_GROUPS.filter((group) => group.culture)
  for (const theme of ['mikado', 'kyuutei-hito', 'koi-hajime', 'koi-kokoro', 'bukkyou', 'inori', 'shinu', 'shukke', 'sumai', 'jikoku', 'tsuki-imei']) {
    assert.ok(cultureGroups.some((group) => group.id === theme), `場面テーマの仲間 ${theme} がない`)
  }
  for (const group of cultureGroups) {
    for (const entry of group.entries) {
      assert.ok(entry.word.background, `${group.id}: ${entry.word.id} ${entry.word.word} に時代背景の解説がない`)
    }
  }
  assert.ok(KOTEN_WORDS.filter((word) => word.background).length >= 200, '時代背景の解説が少なすぎる')
})

test('古典単語の時代背景：暗記カードの裏・辞書ページ・テストの答え合わせが時代背景を出す', () => {
  for (const file of ['src/screens/KotenStudy.jsx', 'src/screens/KotenWordDetail.jsx', 'src/screens/KotenQuiz.jsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.match(source, /<KotenBackground text=\{word\.background\}/, `${file}: 時代背景を出していない`)
  }
})
