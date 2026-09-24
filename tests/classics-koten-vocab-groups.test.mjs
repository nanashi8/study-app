// 依頼 2026-09-24-classics-enrich の条件 koten-vocab-groups。
// 全古典単語が「まとめて暗記する仲間」に1つ以上入り、仲間は使い分けの解説を、
// 語は仲間の中での意味・位置づけを持つこと。仲間ごとに暗記・テストができ、カードの裏と辞書ページに出る。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_WORDS } from '../src/data/koten.js'
import {
  KOTEN_WORD_GROUP_TYPES,
  KOTEN_WORD_GROUPS,
} from '../src/data/koten-word-groups.js'
import {
  KOTEN_GROUPS,
  kotenGroupsForWord,
  resolveKotenMember,
} from '../src/lib/kotenWordGroups.js'

test('古典単語の仲間：全語が1つ以上の仲間に入り、仲間の語はすべて見出し語に引き当たる', () => {
  for (const group of KOTEN_WORD_GROUPS) {
    for (const [ref] of group.members) {
      assert.ok(resolveKotenMember(ref), `${group.id}: 「${ref}」が見出し語に1つに決まらない`)
    }
  }
  const missing = KOTEN_WORDS.filter((word) => kotenGroupsForWord(word.id).length === 0)
  assert.deepEqual(missing.map((word) => `${word.id}${word.word}`), [], '仲間に入っていない語がある')
})

test('古典単語の仲間：仲間は種類・使い分けの解説・2語以上を持ち、語ごとの位置づけを書く', () => {
  const typeIds = new Set(KOTEN_WORD_GROUP_TYPES.map((type) => type.id))
  const ids = new Set()
  for (const group of KOTEN_GROUPS) {
    assert.ok(!ids.has(group.id), `${group.id}: id が重複`)
    ids.add(group.id)
    assert.ok(typeIds.has(group.type), `${group.id}: 種類が不明`)
    assert.ok(group.title?.trim(), `${group.id}: 名前がない`)
    assert.ok(group.explain?.trim().length >= 30, `${group.id}: 使い分けの解説が短すぎる`)
    assert.ok(group.entries.length >= 2, `${group.id}: 語が2つ未満`)
    assert.equal(new Set(group.entries.map((entry) => entry.word.id)).size, group.entries.length, `${group.id}: 同じ語が重複`)
    for (const entry of group.entries) {
      assert.ok(entry.role?.trim(), `${group.id}: ${entry.word.word} の位置づけがない`)
    }
  }
  for (const type of ['syn', 'ant', 'fam', 'hon', 'scale', 'theme']) {
    assert.ok(KOTEN_GROUPS.some((group) => group.type === type), `種類 ${type} の仲間がない`)
  }
})

test('古典単語の仲間：仲間ごとに暗記・テストができ、暗記カードの裏と辞書ページに仲間の語を出す', () => {
  const list = readFileSync(new URL('../src/screens/KotenList.jsx', import.meta.url), 'utf8')
  assert.match(list, /view === 'groups'/)
  assert.match(list, /onStudy=\{\(\) => study\(group\.entries\.map/)
  assert.match(list, /onQuiz=\{\(\) => quiz\(group\.entries\.map/)
  for (const file of ['src/screens/KotenStudy.jsx', 'src/screens/KotenWordDetail.jsx', 'src/screens/KotenQuiz.jsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.match(source, /<KotenWordGroups word=\{word\}/, `${file}: 仲間と使い分けを出していない`)
  }
})
