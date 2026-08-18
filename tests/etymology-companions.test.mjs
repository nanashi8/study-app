// 語源カードの「一緒に覚えられる語」の回帰テスト。
// カードに1語しか載っていなくても、必ず理由つきの関連語が並ぶこと。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { ALL_WORDS, ETYMOLOGY_PACKS } from '../src/data/vocab.js'
import {
  COMPANION_LIMIT,
  etymologyCompanions,
  prefixFormation,
  suffixFormation,
} from '../src/lib/etymologyCompanions.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const wordNamed = (name) => ALL_WORDS.find((word) => word.word === name)

test('どの語源カードにも関連語が1語以上つく', () => {
  const empty = ETYMOLOGY_PACKS.filter((pack) => etymologyCompanions(pack).length === 0)
  assert.deepEqual(empty.map((pack) => pack.title), [], '関連語が空のカードがある')
})

test('関連語は1枚あたり十分な数が出て、上限も守る', () => {
  const counts = ETYMOLOGY_PACKS.map((pack) => etymologyCompanions(pack).length)
  const average = counts.reduce((sum, count) => sum + count, 0) / counts.length
  assert.ok(average > 8, `平均${average.toFixed(1)}語では少ない`)
  assert.ok(Math.max(...counts) <= COMPANION_LIMIT)
  // 1語しか載っていないカードでも、抱き合わせで覚える語が並ぶ
  const single = ETYMOLOGY_PACKS.filter((pack) => pack.studyIds.length === 1)
  assert.ok(single.length > 0)
  for (const pack of single) assert.ok(etymologyCompanions(pack).length >= 1, pack.title)
})

test('関連語はカードの語と重ならず、必ず理由が付く', () => {
  for (const pack of ETYMOLOGY_PACKS.slice(0, 400)) {
    const studyIds = new Set(pack.studyIds)
    const ids = new Set()
    for (const item of etymologyCompanions(pack)) {
      assert.ok(!studyIds.has(item.word.id), `${pack.title}: カードの語が関連語にも出ている`)
      assert.ok(!ids.has(item.word.id), `${pack.title}: 同じ語が二重に出ている`)
      assert.ok(item.reason && item.reason.length > 1, `${pack.title}: 理由が無い`)
      ids.add(item.word.id)
    }
  }
})

test('作り方の見分けは、つづりが偶然そろっただけの語を拾わない', () => {
  // もとの語と品詞が合うものだけを「作り方」と認める
  for (const [name, base, affix] of [
    ['teacher', 'teach', '-er'],
    ['writer', 'write', '-er'],
    ['happiness', 'happy', '-ness'],
    ['happily', 'happy', '-ly'],
    ['careful', 'care', '-ful'],
    ['unhappy', 'happy', 'un-'],
  ]) {
    const word = wordNamed(name)
    if (!word) continue
    const formation = suffixFormation(word) ?? prefixFormation(word)
    assert.ok(formation, `${name} の作り方を見つけられない`)
    assert.equal(formation.base.word, base, name)
    assert.equal(formation.affix, affix, name)
  }

  // butter＝but＋er、mother＝moth＋er のような偶然は認めない
  for (const name of ['butter', 'father', 'mother', 'number', 'later', 'petty']) {
    const word = wordNamed(name)
    if (!word) continue
    const formation = suffixFormation(word) ?? prefixFormation(word)
    assert.equal(formation, null, `${name} を作り方として拾っている`)
  }
})

test('同じ語根の語が最優先で並ぶ', () => {
  const pack = ETYMOLOGY_PACKS.find((item) => item.rootId && item.studyIds.length <= 4)
  assert.ok(pack)
  const companions = etymologyCompanions(pack)
  if (companions.some((item) => item.reason.startsWith('同じ語根'))) {
    assert.ok(companions[0].reason.startsWith('同じ語根'), '語根の仲間が先頭に来ていない')
  }
})

test('語源カードの画面に一緒に覚えられる語の欄がある', () => {
  const source = read('src/components/EtymologyKnowledge.jsx')
  assert.match(source, /etymologyCompanions/)
  assert.match(source, /data-etymology-companions/)
  assert.match(source, /一緒に覚えられる語/)
})
