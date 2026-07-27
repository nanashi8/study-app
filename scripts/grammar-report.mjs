#!/usr/bin/env node
// 英文法問題の級・単元カバレッジを一覧化する保守用レポート。
import {
  GRAMMAR,
  GRAMMAR_LEVEL_TARGETS,
  GRAMMAR_TOPIC_MINIMUM,
  GRAMMAR_TOTAL_TARGET,
  grammarByLevel,
  grammarByTopic,
  topicsForLevel,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { LEVELS } from '../src/data/levels.js'

const lessonKeys = new Set(
  GRAMMAR_LESSONS.map((lesson) => `${lesson.level}\u0000${lesson.topic}`),
)

console.log('英文法カバレッジ')
console.log('='.repeat(64))

for (const level of LEVELS) {
  const questions = grammarByLevel(level.id)
  const target = GRAMMAR_LEVEL_TARGETS[level.id]
  const topics = topicsForLevel(level.id)
  const coveredTopics = topics.filter((topic) => lessonKeys.has(`${level.id}\u0000${topic}`)).length

  console.log(
    `\n${level.label.padEnd(4)} ${String(questions.length).padStart(3)}問` +
      ` / 目標${target}問 / ${topics.length}単元 / 各単元${GRAMMAR_TOPIC_MINIMUM}問以上` +
      ` / 解説接続${coveredTopics}単元`,
  )
  for (const topic of topics) {
    const count = grammarByTopic(level.id, topic).length
    const lesson = lessonKeys.has(`${level.id}\u0000${topic}`) ? '解説あり' : '問題のみ'
    console.log(`  ${String(count).padStart(2)}問  ${topic}  [${lesson}]`)
  }
}

const explainedQuestions = GRAMMAR.filter((question) =>
  lessonKeys.has(`${question.level}\u0000${question.topic}`),
).length
console.log('\n' + '-'.repeat(64))
console.log(
  `合計 ${GRAMMAR.length}/${GRAMMAR_TOTAL_TARGET}問 / ${new Set(GRAMMAR.map((question) => question.topic)).size}種類の単元名` +
    ` / 単元解説へ接続可能 ${explainedQuestions}問`,
)
