#!/usr/bin/env node
// 単元別の並び替え・語法問題の検査。
//
// 文法の参考書の全127単元それぞれに、並び替えと語法を3問以上置く（選択問題の単元最低数と同じ基準）。
// ここでは「全単元に行き渡っているか」と「追加した1問ずつが単元の学習内容を問えているか」を、
// 母集団＝127単元の全件で確かめる。
import { GRAMMAR_PRACTICE, GRAMMAR_TOPIC_MINIMUM } from '../src/data/grammar.js'
import { grammarQuestionType } from '../src/data/grammar-format-expansion.js'
import {
  GRAMMAR_UNIT_FORMATS,
  UNIT_FORMAT_MINIMUM,
} from '../src/data/grammar-unit-formats/index.js'
import { GRAMMAR_REFERENCE_UNITS, grammarReferenceById } from '../src/data/grammar-reference/index.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'
import {
  isWritingTokenOrderCorrect,
  shuffledWritingTokens,
  writingWordTokens,
} from '../src/lib/writing.js'

const FORMATS = Object.freeze(['word-order', 'usage'])
const hasJapanese = (value = '') => /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(value)
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

export function auditGrammarUnitFormats() {
  const issues = []
  const add = (kind, where, detail = '') => issues.push({ kind, where, detail: String(detail) })

  // 1. 全単元に両形式が3問以上あるか（既存の問題も数に入れる）。
  const unitCounts = []
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    const counts = {}
    for (const format of FORMATS) {
      counts[format] = GRAMMAR_PRACTICE.filter((item) => (
        item.level === unit.level
        && item.topic === unit.topic
        && grammarQuestionType(item) === format
      )).length
      if (counts[format] < UNIT_FORMAT_MINIMUM) {
        add('単元の問題が足りない', `${unit.level}/${unit.topic}`, `${format}:${counts[format]}`)
      }
    }
    unitCounts.push({ id: unit.id, level: unit.level, topic: unit.topic, ...counts })
  }

  // 2. 追加した問題の中身。
  const focusByUnitFormat = new Map()
  for (const item of GRAMMAR_UNIT_FORMATS) {
    const unit = grammarReferenceById(item.unitId)
    if (!unit) {
      add('参考書にない単元', item.id, item.unitId)
      continue
    }
    if (unit.level !== item.level || unit.topic !== item.topic) {
      add('単元と級・単元名が合わない', item.id, `${item.level}/${item.topic}`)
    }
    if (!item.focus || !hasJapanese(item.focus)) add('狙いがない', item.id)
    const focusKey = `${item.unitId}\u0000${item.questionType}`
    const seen = focusByUnitFormat.get(focusKey) ?? new Set()
    if (seen.has(item.focus)) add('同じ単元・形式で狙いが重なる', item.id, item.focus)
    seen.add(item.focus)
    focusByUnitFormat.set(focusKey, seen)

    if (!hasJapanese(item.sentence.ja)) add('和訳がない', item.id)
    if (normalize(item.explain).length < 30) add('解説が短い', item.id, normalize(item.explain).length)

    if (item.questionType === 'word-order') {
      const tokens = writingWordTokens(item.answer)
      if (item.choices.length !== 0) add('並び替えに選択肢がある', item.id)
      if (item.answer !== item.sentence.en) add('並び替えの答えが完成文と違う', item.id)
      if (!hasJapanese(item.q)) add('並び替えの指示文が日本語でない', item.id)
      if (tokens.length < 5 || tokens.length > 12) add('並び替えの語数が範囲外', item.id, tokens.length)
      if (isWritingTokenOrderCorrect(shuffledWritingTokens(item.answer, item.id), item.answer)) {
        add('並び替えが最初から解けている', item.id)
      }
      continue
    }

    if (item.q.split('___').length - 1 !== 1) add('空所が1つでない', item.id)
    if (item.q.replace('___', item.answer) !== item.sentence.en) add('完成文を組み直せない', item.id)
    if (item.choices.length !== 4 || new Set(item.choices).size !== 4) {
      add('選択肢が4つでない', item.id, item.choices.length)
    }
    if (item.choices.filter((choice) => choice === item.answer).length !== 1) {
      add('正解が選択肢にちょうど1つない', item.id)
    }
    for (const choice of item.choices) {
      if (!hasJapanese(grammarChoiceNoteFor(item, choice))) add('選択肢の説明がない', item.id, choice)
    }
  }

  // 3. 文法在庫全体で、完成文とIDが重複しないこと。
  const sentences = new Map()
  const ids = new Set()
  for (const item of GRAMMAR_PRACTICE) {
    if (ids.has(item.id)) add('IDの重複', item.id)
    ids.add(item.id)
    const previous = sentences.get(item.sentence.en)
    if (previous) add('完成文の重複', item.id, `${previous} と同じ英文`)
    else sentences.set(item.sentence.en, item.id)
  }

  const typeCounts = Object.fromEntries(FORMATS.map((format) => [
    format,
    GRAMMAR_UNIT_FORMATS.filter((item) => item.questionType === format).length,
  ]))

  return Object.freeze({
    complete: issues.length === 0,
    unitCount: GRAMMAR_REFERENCE_UNITS.length,
    addedCount: GRAMMAR_UNIT_FORMATS.length,
    addedTypeCounts: Object.freeze(typeCounts),
    minimum: UNIT_FORMAT_MINIMUM,
    choiceMinimum: GRAMMAR_TOPIC_MINIMUM,
    unitCounts: Object.freeze(unitCounts),
    issues: Object.freeze(issues),
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const audit = auditGrammarUnitFormats()
  const short = process.argv.includes('--summary')
  if (!audit.complete) {
    const shown = short ? audit.issues.slice(0, 40) : audit.issues
    for (const issue of shown) console.error(`❌ ${issue.kind}: ${issue.where} ${issue.detail}`)
    console.error(`\n${audit.issues.length}件の問題があります。`)
    process.exit(1)
  }
  console.log(
    `✅ 単元別の出題形式OK: 参考書${audit.unitCount}単元すべてに並び替え・語法が各${audit.minimum}問以上`
    + `（追加 並び替え${audit.addedTypeCounts['word-order']}問・語法${audit.addedTypeCounts.usage}問）`,
  )
}
