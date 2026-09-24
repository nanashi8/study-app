// 依頼 2026-09-24-classics-enrich の条件 koten-vocab-kanji-level。
// 全古典単語が漢字表記（慣用の漢字がない語は空文字）と5段階の重要度を持ち、
// 古典単語のトップの「レベルから選ぶ」と学年・目標別コースがこの重要度で組まれていること。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { KOTEN_WORD_LEVELS, KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_CURRICULUM_PATHS } from '../src/data/koten-curriculum.js'

const LEVEL_IDS = ['middle', 'basic', 'standard', 'advanced', 'elite']

test('古典単語の漢字表記と重要度：全語が漢字表記（空と明記を含む）と5段階の重要度を持つ', () => {
  assert.deepEqual(KOTEN_WORD_LEVELS.map((level) => level.id), LEVEL_IDS)
  for (const word of KOTEN_WORDS) {
    assert.equal(typeof word.kanji, 'string', `${word.id} ${word.word}: 漢字表記の判断がない`)
    if (word.kanji) assert.match(word.kanji, /\p{Script=Han}/u, `${word.id}: 漢字表記に漢字がない`)
    assert.ok(LEVEL_IDS.includes(word.level), `${word.id} ${word.word}: 重要度がない`)
  }
  for (const id of LEVEL_IDS) {
    assert.ok(KOTEN_WORDS.some((word) => word.level === id), `重要度 ${id} の語がない`)
  }
})

test('古典単語の漢字表記と重要度：学年・目標別コースは重要度の段までの語を積み上げる', () => {
  const rank = Object.fromEntries(LEVEL_IDS.map((id, index) => [id, index]))
  for (const [index, path] of KOTEN_CURRICULUM_PATHS.entries()) {
    const expected = KOTEN_WORDS.filter((word) => rank[word.level] <= index).map((word) => word.id).sort()
    assert.deepEqual([...path.vocabIds].sort(), expected, `${path.id}: コースの語が重要度と合わない`)
  }
})

test('古典単語の漢字表記と重要度：トップに「レベルから選ぶ」があり、暗記カード・辞書ページが漢字表記を出す', () => {
  const list = readFileSync(new URL('../src/screens/KotenList.jsx', import.meta.url), 'utf8')
  assert.match(list, /レベルから選ぶ/)
  assert.match(list, /KOTEN_WORD_LEVELS\.map/)
  for (const file of ['src/screens/KotenStudy.jsx', 'src/screens/KotenWordDetail.jsx']) {
    const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.match(source, /<KotenKanjiLine word=\{word\}/, `${file}: 漢字表記を出していない`)
  }
})
