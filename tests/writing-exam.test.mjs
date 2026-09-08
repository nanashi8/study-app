import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  WRITING_EXAM_QUESTIONS,
  WRITING_EXAM_UNITS,
  WRITING_EXAM_UNITS_BY_ID,
  getWritingExamUnit,
  writingExamUnitsByLevel,
} from '../src/data/writing-exam.js'
import { WRITING_LEVEL_ORDER } from '../src/data/writing.js'
import { topicsForLevel } from '../src/data/grammar.js'
import {
  buildWritingTokenText,
  maskWritingSentence,
  normalizeWritingSentence,
  shuffledWritingTokens,
  writingSentenceReview,
  writingWordTokens,
} from '../src/lib/writing.js'

const readSource = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

test('入試型英作文は全7級に8文法単元・3問ずつの計56単元168問をそろえる', () => {
  assert.equal(WRITING_EXAM_UNITS.length, 56)
  assert.equal(WRITING_EXAM_QUESTIONS.length, 168)

  for (const level of WRITING_LEVEL_ORDER) {
    const units = writingExamUnitsByLevel(level)
    assert.equal(units.length, 8, level)
    assert.equal(
      new Set(units.map((unit) => unit.topic)).size,
      units.length,
      `${level}: 同じ文法単元が重複している`,
    )
  }
})

test('全単元は英文法テストと同じ単元名を使い、型と決まりを先に示す', () => {
  const ids = new Set()
  for (const unit of WRITING_EXAM_UNITS) {
    assert.ok(!ids.has(unit.id), unit.id)
    ids.add(unit.id)
    assert.equal(getWritingExamUnit(unit.id), unit, unit.id)
    assert.equal(WRITING_EXAM_UNITS_BY_ID[unit.id], unit, unit.id)
    assert.ok(
      topicsForLevel(unit.level).includes(unit.topic),
      `${unit.id}: 英文法テストに ${unit.topic} がない`,
    )
    assert.ok(unit.title.length >= 5, `${unit.id}: title`)
    assert.ok(unit.form.length >= 8, `${unit.id}: form`)
    assert.ok(unit.focus.length >= 15, `${unit.id}: focus`)
    assert.equal(unit.rule.length, 2, `${unit.id}: rule`)
    assert.ok(unit.rule.every((rule) => rule.length >= 12), `${unit.id}: rule`)
    assert.equal(unit.questions.length, 3, `${unit.id}: 問題数`)
  }
})

test('全168問は日本語文・模範解答・判断・誤りやすい点を備える', () => {
  const ids = new Set()
  for (const question of WRITING_EXAM_QUESTIONS) {
    const label = question.id
    assert.ok(!ids.has(label), label)
    ids.add(label)
    assert.match(label, /^wx_/, label)
    assert.ok(/[぀-ヿ㐀-鿿]/u.test(question.ja), `${label}: 日本語文`)
    assert.match(question.answer, /^[A-Z“]/, `${label}: 英文の書き出し`)
    assert.match(question.answer, /[.?!]$/, `${label}: 英文の終わり`)
    assert.ok(question.point.length >= 10, `${label}: point`)
    assert.ok(question.trap.length >= 10, `${label}: trap`)
    assert.ok(Array.isArray(question.alt), `${label}: alt`)
  }
})

test('全模範解答は単語カードへ分けても元の英文へ戻る', () => {
  for (const question of WRITING_EXAM_QUESTIONS) {
    const tokens = writingWordTokens(question.answer)
    assert.ok(tokens.length >= 3, `${question.id}: ${tokens.length}語`)
    assert.ok(tokens.length <= 16, `${question.id}: ${tokens.length}語`)
    assert.equal(buildWritingTokenText(tokens), question.answer, question.id)

    const shuffled = shuffledWritingTokens(question.answer, question.id)
    assert.equal(shuffled.length, tokens.length, question.id)
    assert.equal(
      shuffled.every((token, index) => token.originalIndex === index),
      false,
      `${question.id}: 開いた時点で並び終えている`,
    )
  }
})

test('答え合わせは模範解答と別解を正解にし、違う語だけを返す', () => {
  for (const question of WRITING_EXAM_QUESTIONS) {
    for (const sentence of [question.answer, ...question.alt]) {
      const review = writingSentenceReview(sentence, question)
      assert.equal(review.correct, true, `${question.id}: ${sentence}`)
      assert.deepEqual(review.missing, [], question.id)
      assert.deepEqual(review.extra, [], question.id)
    }
    // 別解は模範解答と別の書き方であって、同じ文字列の重複ではない。
    for (const sentence of question.alt) {
      assert.notEqual(sentence, question.answer, question.id)
    }
  }

  const question = { answer: 'I visited my grandmother yesterday.', alt: [] }
  const partial = writingSentenceReview('I visited my grandmother.', question)
  assert.equal(partial.correct, false)
  assert.deepEqual(partial.missing, ['yesterday'])
  assert.deepEqual(partial.extra, [])

  const extra = writingSentenceReview('I visited my old grandmother yesterday', question)
  assert.deepEqual(extra.extra, ['old'])
  assert.equal(writingSentenceReview('', question).answered, false)
})

test('大文字・句読点・短縮形の違いだけでは不正解にしない', () => {
  assert.equal(
    normalizeWritingSentence("I'm a student, and I can't swim."),
    'i am a student and i cannot swim',
  )
  assert.equal(
    normalizeWritingSentence('  I am a student and I can not swim  '),
    'i am a student and i cannot swim',
  )
  assert.equal(normalizeWritingSentence("Let's go."), 'let us go')
  assert.equal(normalizeWritingSentence(''), '')
})

test('書く前のヒントは語数と頭文字だけで、模範解答を出さない', () => {
  assert.equal(
    maskWritingSentence('I am a junior high school student.'),
    'I a_ a j_____ h___ s_____ s______.',
  )

  for (const question of WRITING_EXAM_QUESTIONS) {
    const masked = maskWritingSentence(question.answer)
    assert.equal(masked.length, question.answer.length, question.id)
    assert.ok(masked.includes('_'), question.id)
    assert.notEqual(masked, question.answer, question.id)
  }
})

test('入試型英作文の画面は、答え合わせの前に模範解答を出さない', () => {
  const source = readSource('../src/screens/WritingExam.jsx')
  // 出題中に描く部分だけを見る。解説カードは答え合わせのあとにしか出ない。
  const composing = source.slice(
    source.indexOf('export function WritingExamScreen'),
    source.indexOf('{checked && review'),
  )

  // 答え合わせ前に出るのは日本語文・型・伏せ字だけ。
  assert.ok(composing.includes('maskWritingSentence(question.answer)'))
  assert.ok(
    !/(?<![=(])\{question\.answer\}/.test(composing),
    '答え合わせ前に模範解答を描画している',
  )
  assert.ok(source.includes('showSkeleton && !checked'), '伏せ字ヒントが答え合わせ後も残る')
  assert.ok(
    source.includes('checked={checked}'),
    '単語カードの正誤表示を答え合わせに結び付けていない',
  )
})
