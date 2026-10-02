// 古典・漢文のコース・難易度の重複を調べ、古典単語の最難関を難関に統合した依頼のテスト（requests/2026-10-02-koten-level-merge.json）。
//
// 2026-10-02 まで、古典単語・古典文法の重要度は中学入門・高校基礎・共通テスト・中堅大・難関大学・最難関大学の5段で、
// 古典アプリのホームの学年・目標別コースはこの段で1つ下のコースを含むように積み上げていた。そのため難関コースの561語は
// すべて最難関コース（612語＝全範囲）に重なっていた。利用者の指示で最難関をなくし、難関に統合した。
//   古典単語 … 最難関の51語を難関へ（難関107語→158語）。重要度は4段
//   コース   … 最難関コースをなくし、難関コースが旧最難関コースの中身（全範囲）を持つ。コースは4つ
//   古典文法 … 重要度は古典単語と同じ段でコースを組むので、最難関の2項目も難関へ。基礎問題の難しさは変えない
// 調べた重複（①段 ②二重登録 ③中身が同じコース ④教材をまたぐ組の分け方）は scripts/checks/classics-level-overlap.mjs。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

import { KOTEN_WORD_LEVELS, KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_ITEM_LEVELS } from '../src/data/koten-grammar.js'
import { KOTEN_CULTURE } from '../src/data/koten-culture.js'
import { KOTEN_CURRICULUM_LEVELS, KOTEN_CURRICULUM_PATHS } from '../src/data/koten-curriculum.js'
import { KOTEN_GRAMMAR_FOUNDATION_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { surveyClassicsLevels } from '../scripts/checks/classics-level-overlap.mjs'
import { MOVED_GRAMMAR_IDS, MOVED_WORD_IDS } from './koten-level-merge-ids.mjs'

const LEVEL_IDS = ['middle', 'basic', 'standard', 'advanced']
const countBy = (items, key) => items.reduce((counts, item) => ({ ...counts, [item[key]]: (counts[item[key]] ?? 0) + 1 }), {})

test('重複の調べ：古典・漢文の8教材1,393件で、2つの段に入る項目・二重登録・中身が同じコースは0件、教材をまたぐ組はすべて分け方を決めてある', () => {
  const result = surveyClassicsLevels()
  assert.deepEqual(result.problems, [])
  assert.equal(result.contents.reduce((sum, content) => sum + content.total, 0), 1_393)
  assert.deepEqual(
    Object.fromEntries(result.contents.map((content) => [content.label, content.total])),
    { 古典単語: 612, 古典文法: 130, 古典常識: 56, 短文解釈: 36, 漢語: 293, 漢文法: 131, 漢文常識: 95, '返り点・訓読': 40 },
  )
  // 教材をまたぐ組（古典文法×古典単語75組、漢文法×漢語33組）は1組ずつ読んで分けた。
  assert.deepEqual(result.cross.map((set) => [set.label, set.candidates, set.same, set.identification, set.different.length]), [
    ['古典文法 × 古典単語', 75, 50, 12, 13],
    ['漢文法 × 漢語', 33, 32, 0, 1],
  ])
})

test('古典単語：重要度は中学入門・高校基礎・共通テスト・中堅大・難関大学の4段で、最難関だった51語はすべて難関（難関158語）', () => {
  assert.deepEqual(KOTEN_WORD_LEVELS.map((level) => level.id), LEVEL_IDS)
  assert.deepEqual(KOTEN_WORD_LEVELS.map((level) => level.label), ['中学入門', '高校基礎', '共通テスト・中堅大', '難関大学'])
  assert.equal(KOTEN_WORDS.length, 612)
  for (const word of KOTEN_WORDS) assert.ok(LEVEL_IDS.includes(word.level), `${word.id} ${word.word}: 重要度 ${word.level}`)
  assert.equal(new Set(MOVED_WORD_IDS).size, 51)
  for (const id of MOVED_WORD_IDS) {
    const word = KOTEN_WORDS.find((entry) => entry.id === id)
    assert.equal(word?.level, 'advanced', `${id} ${word?.word}: 難関に移っていない`)
  }
  // 中学・基礎・標準の語数は変えず、難関は 107語＋51語。
  assert.deepEqual(countBy(KOTEN_WORDS, 'level'), { middle: 58, basic: 179, standard: 217, advanced: 158 })
})

test('コース：中学・基礎・標準・難関の4つで1つ下のコースを含み、難関コースは旧最難関コースの中身（古典単語612語・古典文法130項目・古典常識56テーマ）をすべて持つ', () => {
  assert.deepEqual(KOTEN_CURRICULUM_LEVELS.map((level) => level.id), LEVEL_IDS)
  assert.deepEqual(KOTEN_CURRICULUM_LEVELS.map((level) => level.shortLabel), ['中学', '基礎', '標準', '難関'])
  assert.deepEqual(
    KOTEN_CURRICULUM_PATHS.map((course) => [course.id, course.vocabIds.length, course.grammarIds.length, course.cultureIds.length]),
    [
      ['middle', 58, 15, 14],
      ['basic', 237, 63, 28],
      ['standard', 454, 107, 42],
      ['advanced', 612, 130, 56],
    ],
  )
  const advanced = KOTEN_CURRICULUM_PATHS.at(-1)
  assert.deepEqual([...advanced.vocabIds].sort(), KOTEN_WORDS.map((word) => word.id).sort())
  assert.deepEqual([...advanced.grammarIds].sort(), KOTEN_GRAMMAR.map((item) => item.id).sort())
  assert.deepEqual([...advanced.cultureIds].sort(), KOTEN_CULTURE.map((item) => item.id).sort())
  for (const id of MOVED_WORD_IDS) {
    assert.ok(advanced.vocabIds.includes(id), `${id}: 難関コースにない`)
    assert.ok(!KOTEN_CURRICULUM_PATHS[2].vocabIds.includes(id), `${id}: 標準コースに入ってしまった`)
  }
  for (const [index, course] of KOTEN_CURRICULUM_PATHS.entries()) {
    if (!index) continue
    for (const field of ['vocabIds', 'grammarIds', 'cultureIds']) {
      const ids = new Set(course[field])
      assert.ok(KOTEN_CURRICULUM_PATHS[index - 1][field].every((id) => ids.has(id)), `${course.id}:${field}: 1つ下のコースを含まない`)
    }
  }
})

test('古典文法：重要度は古典単語と同じ4段で、最難関だった2項目は難関。基礎問題130問の難しさは変わらない（基礎63・標準44・発展23）', () => {
  assert.deepEqual(KOTEN_GRAMMAR_ITEM_LEVELS.map((level) => level.id), LEVEL_IDS)
  assert.deepEqual(KOTEN_GRAMMAR_ITEM_LEVELS, KOTEN_WORD_LEVELS)
  for (const item of KOTEN_GRAMMAR) assert.ok(LEVEL_IDS.includes(item.level), `${item.id}: 重要度 ${item.level}`)
  for (const id of MOVED_GRAMMAR_IDS) {
    assert.equal(KOTEN_GRAMMAR.find((item) => item.id === id)?.level, 'advanced', `${id}: 難関に移っていない`)
  }
  assert.deepEqual(countBy(KOTEN_GRAMMAR, 'level'), { middle: 13, basic: 50, standard: 44, advanced: 23 })
  assert.equal(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.length, 130)
  assert.deepEqual(countBy(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS, 'level'), { basic: 63, standard: 44, advanced: 23 })
  for (const id of MOVED_GRAMMAR_IDS) {
    assert.equal(KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.find((question) => question.grammarIds.includes(id))?.level, 'advanced', `${id}: 基礎問題の難しさ`)
  }
})

test('古典アプリの画面・データ・作りに最難関の段（elite）と「最難関」の文字が残っていない', () => {
  const files = [
    ...readdirSync(new URL('../src/data/', import.meta.url)).filter((name) => /^koten.*\.js$/u.test(name)).map((name) => `src/data/${name}`),
    ...readdirSync(new URL('../src/screens/', import.meta.url)).filter((name) => /^Koten.*\.jsx$/u.test(name)).map((name) => `src/screens/${name}`),
    ...readdirSync(new URL('../src/components/', import.meta.url)).filter((name) => /^Koten.*\.jsx$/u.test(name)).map((name) => `src/components/${name}`),
    ...readdirSync(new URL('../src/lib/', import.meta.url)).filter((name) => /^koten.*\.js$/u.test(name)).map((name) => `src/lib/${name}`),
  ]
  assert.ok(files.length > 40, `${files.length}ファイル`)
  for (const file of files) {
    const text = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.doesNotMatch(text, /['"`]elite['"`]/u, `${file}: 最難関の段の id が残っている`)
    // 「最難関」はいきさつを書いたコメントにだけ残す（画面に出る文字・データには書かない）。
    const outsideComments = text.split('\n').filter((line) => !/^\s*\/\//u.test(line)).join('\n')
    assert.doesNotMatch(outsideComments, /最難関/u, `${file}: 画面に出る文字・データに「最難関」が残っている`)
  }
})
