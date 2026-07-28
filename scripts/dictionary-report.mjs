#!/usr/bin/env node
import { LEVELS } from '../src/data/levels.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import {
  EXAM_USAGE_GUIDES,
  EXAM_WORDS,
} from '../src/data/exam-lexicon.js'
import { PHRASES } from '../src/data/phrases.js'
import { EXAM_PHRASES } from '../src/data/phrases-exam.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { EXAM_GRAMMAR_LESSONS } from '../src/data/grammar-lessons-exam.js'

const countByLevel = (items) =>
  Object.fromEntries(LEVELS.map((level) => [
    level.label,
    items.filter((item) => item.level === level.id).length,
  ]))

const line = (label, value) =>
  console.log(`${label.padEnd(24)} ${String(value).padStart(6)}`)

console.log('英語辞書・入試対策カバレッジ')
console.log('='.repeat(52))
line('英単語（全見出し語）', ALL_WORDS.length)
line('今回の学術・現代語補充', EXAM_WORDS.length)
line('語法説明付き見出し語', ALL_WORDS.filter((word) => word.usage).length)
line('使い分けガイド', EXAM_USAGE_GUIDES.length)
line('使い分け対象見出し語', new Set(EXAM_USAGE_GUIDES.flatMap((guide) => guide.wordIds)).size)
line('熟語・構文（全項目）', PHRASES.length)
line('今回の熟語・構文補充', EXAM_PHRASES.length)
line('英文法クイズ', GRAMMAR.length)
line('文法解説（全単元）', GRAMMAR_LESSONS.length)
line('今回の高校文法補充', EXAM_GRAMMAR_LESSONS.length)

console.log('\n級別の英単語')
for (const [level, count] of Object.entries(countByLevel(ALL_WORDS))) line(level, count)

console.log('\n級別の熟語・構文')
for (const [level, count] of Object.entries(countByLevel(PHRASES))) line(level, count)

console.log('\n学年別の文法解説')
for (const stage of ['中1', '中2', '中3', '高校基礎', '高校発展']) {
  line(stage, GRAMMAR_LESSONS.filter((lesson) => lesson.stage === stage).length)
}
