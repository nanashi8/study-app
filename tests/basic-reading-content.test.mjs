import test from 'node:test'
import assert from 'node:assert/strict'

import {
  BASIC_READING_LENGTH,
  BASIC_READING_LEVEL_IDS,
  BASIC_READING_PASSAGES,
  BASIC_READING_QUESTIONS,
  basicReadingPassagesForLevel,
} from '../src/data/basic-reading/index.js'
import { READING_RULES } from '../src/data/reading-rules.js'
import { basicReadingParagraphs, basicReadingWordCount } from '../src/lib/basicReading.js'
import { MULTI_PARAGRAPH_RULES, lessonProblems } from '../scripts/checks/basic-reading.mjs'

// 基礎長文：依頼に挙がった5つの級のそれぞれで、30ルールをすべて本文の文で学ぶ（requests/2026-10-28-basic-reading.json）。

test('級は依頼に挙がった5つ（5級・4級・3級・準2級・2級）で、どの級も10本', () => {
  assert.deepEqual([...BASIC_READING_LEVEL_IDS], ['5', '4', '3', 'pre2', '2'])
  for (const level of BASIC_READING_LEVEL_IDS) assert.equal(basicReadingPassagesForLevel(level).length, 10, level)
  assert.equal(BASIC_READING_PASSAGES.length, 50)
})

test('5つの級×30ルール＝150のルールの学習が、それぞれ1つずつある', () => {
  assert.equal(READING_RULES.length, 30)
  assert.equal(BASIC_READING_QUESTIONS.length, 150)
  for (const level of BASIC_READING_LEVEL_IDS) {
    const rules = basicReadingPassagesForLevel(level).flatMap((passage) => passage.lessons.map((lesson) => lesson.rule))
    assert.deepEqual([...rules].sort(), READING_RULES.map((rule) => rule.id).sort(), `${level}級`)
  }
})

test('どのルールの学習も、本文の文・当てはめ方・4択の問題・全選択肢の説明・正解を持つ', () => {
  assert.deepEqual(lessonProblems(), [])
  for (const passage of BASIC_READING_PASSAGES) {
    for (const lesson of passage.lessons) {
      assert.equal(lesson.choices.length, 4, `${passage.id}#${lesson.rule}`)
      assert.ok(lesson.sentences.every((index) => passage.sentences[index]), `${passage.id}#${lesson.rule}`)
    }
  }
})

test('正解の位置が偏らない（どの級も、正解が1つの位置に集まらない）', () => {
  for (const level of BASIC_READING_LEVEL_IDS) {
    const counts = [0, 0, 0, 0]
    for (const passage of basicReadingPassagesForLevel(level)) for (const lesson of passage.lessons) counts[lesson.answer] += 1
    assert.ok(Math.max(...counts) <= 18, `${level}級の正解の位置 ${counts.join('/')}`)
  }
})

test('長さはルールを学ぶのに要る長さ：段落は2つ以上、級ごとの語数の目安の中、級が上がるほど長い', () => {
  let previousMin = 0
  for (const level of BASIC_READING_LEVEL_IDS) {
    const range = BASIC_READING_LENGTH[level]
    assert.ok(range.min > previousMin, `${level}級の目安`)
    previousMin = range.min
    for (const passage of basicReadingPassagesForLevel(level)) {
      const words = basicReadingWordCount(passage)
      assert.ok(words >= range.min && words <= range.max, `${passage.id}: ${words}語`)
      assert.ok(basicReadingParagraphs(passage).length >= 2, `${passage.id}: 段落`)
      for (const lesson of passage.lessons) {
        if (MULTI_PARAGRAPH_RULES.has(lesson.rule)) assert.ok(basicReadingParagraphs(passage).length >= 2, `${passage.id}#${lesson.rule}`)
      }
    }
  }
})
