// 全教材の内容・選択肢・解説の誤りを検査した依頼（requests/2026-10-13-content-truth-inspection.json）の固定。
//
//   1) 出題する全問題（全教材の選択問題 6,756 問）を、既存の監査（正答が一意・選択肢の説明がある）とは別の物差しで確かめる。
//      正解の説明が「不正解」で始まる・誤答の説明が「正解」で始まる食い違い、誤答を空所に入れた文が別の問題の正しい文と
//      一致する（誤答が実は正しい）ことを全件で落とす。
//   2) 語の成り立ちで、同じ語根とは確かめられないのに「X と同じ語源」と書いていた組を直した本文を固定する。
//   3) 社会・理科の語句で、事実と食い違っていた言い方を直した本文を固定する。
import assert from 'node:assert/strict'
import test from 'node:test'

import { ETYMOLOGY_WORD_STORIES } from '../src/data/vocab.js'
import { ALL_SUBJECT_QUESTIONS, ALL_SUBJECT_TERMS, termQuestion } from '../src/data/subjects/index.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { MATH_PROBLEMS } from '../src/data/math.js'
import { MATH_HISTORY_QUESTIONS } from '../src/data/math-history.js'
import { MATH_EXAM_PROBLEMS } from '../src/data/math-exam.js'
import { PASSAGES } from '../src/data/passages.js'
import { EXTENDED_PASSAGES } from '../src/data/reading-extended-passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { DIAGNOSTIC_QUESTIONS } from '../src/data/diagnostic.js'
import { diagnosticChoiceNoteFor } from '../src/lib/diagnosticQuestions.js'
import { kotenCultureChoiceNoteFor } from '../src/lib/kotenCultureChoiceNotes.js'
import { kotenGrammarChoiceNoteFor } from '../src/lib/kotenGrammarChoiceNotes.js'
import { kotenInterpretationChoiceNoteFor } from '../src/data/koten-interpretation-choice-notes.js'
import { literatureReadingChoiceNoteFor } from '../src/data/literature-reading-choice-notes.js'
import { listeningChoiceNoteFor } from '../src/data/listening-choice-notes.js'
import { mathChoiceNoteFor } from '../src/data/math-choice-notes.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import { KOTEN_CULTURE_QUESTIONS } from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { PUBLIC_DOMAIN_LITERATURE } from '../src/data/public-domain-literature.js'
import { getLiteratureReadingQuestions } from '../src/data/literature-reading.js'
import { grammarChoiceNoteFor } from '../src/lib/grammarChoiceNotes.js'
import { readingChoiceNoteFor } from '../src/lib/readingChoiceNotes.js'

// 選択問題を「正解の語・全選択肢・選択肢ごとの説明」の形にそろえる。
function questionRecords() {
  const records = []
  const add = (bank, id, choices, answer, notes, stem = '') => records.push({ bank, id, choices, answer, notes, stem })
  for (const g of GRAMMAR) add('grammar', g.id, g.choices, g.answer, g.choices.map((c) => grammarChoiceNoteFor(g, c)), g.q)
  for (const p of [...PASSAGES, ...EXTENDED_PASSAGES]) {
    getReadingQuestions(p.id).forEach((q, i) => add('reading', `${p.id}#${i + 1}`, q.choices, q.answer, q.choices.map((c) => readingChoiceNoteFor(p.id, i, c))))
  }
  for (const q of LISTENING_ITEMS) {
    add('listening', q.id, q.choices.map((c) => c.text), q.choices.find((c) => c.id === q.answer)?.text, q.choices.map((c) => listeningChoiceNoteFor(q, c.id)))
  }
  for (const q of KOTEN_GRAMMAR_QUESTIONS) add('koten-grammar', q.id, q.choices, q.answer, q.choices.map((c) => kotenGrammarChoiceNoteFor(q, c)))
  for (const q of KOTEN_CULTURE_QUESTIONS) add('koten-culture', q.id, q.choices, q.answer, q.choices.map((c) => kotenCultureChoiceNoteFor(q, c)))
  for (const q of KOTEN_INTERPRETATIONS) add('koten-reading', q.id, q.choices, q.answer, q.choices.map((c) => kotenInterpretationChoiceNoteFor(q, c)))
  for (const w of PUBLIC_DOMAIN_LITERATURE) {
    for (const q of getLiteratureReadingQuestions(w.id)) {
      add('literature', `${w.id}:${q.id}`, q.choices, q.choices[q.answer], q.choices.map((_, i) => literatureReadingChoiceNoteFor(q, i)))
    }
  }
  for (const q of MATH_HISTORY_QUESTIONS) add('math-history', q.id, q.choices, q.choices[q.answer], q.notes)
  for (const q of ALL_SUBJECT_QUESTIONS.filter((x) => x.kind === 'choice')) add('subject-choice', q.id, q.choices, q.answer, q.choices.map((c) => q.notes?.[c]))
  for (const t of ALL_SUBJECT_TERMS) {
    const q = termQuestion(t)
    add('subject-terms', q.id, q.choices, q.answer, q.choices.map((c) => q.notes?.[c]))
  }
  for (const p of MATH_EXAM_PROBLEMS) {
    for (const [label, c] of Object.entries(p.choices ?? {})) add('math-exam', `${p.id}:${label}`, c.options, c.options[p.boxes[label]], c.notes)
  }
  for (const prob of Object.values(MATH_PROBLEMS).flat()) {
    if (prob.recall?.quiz) {
      const q = prob.recall.quiz
      add('math-choice', `${prob.id}:recall`, q.choices, q.choices[q.answer], q.choices.map((_, i) => mathChoiceNoteFor(`${prob.id}:recall`, i)))
    }
    prob.steps.forEach((s, i) => {
      if (!s.fill) add('math-choice', `${prob.id}:step:${i}`, s.choices, s.choices?.[s.answer], (s.choices ?? []).map((_, k) => mathChoiceNoteFor(`${prob.id}:step:${i}`, k)))
    })
  }
  for (const q of DIAGNOSTIC_QUESTIONS) add('diagnostic', q.id, q.choices, q.answer, q.choices.map((c) => diagnosticChoiceNoteFor(q, c)))
  return records
}

const RECORDS = questionRecords()

test('全問題の選択肢：正解が選択肢に1つだけあり、全選択肢に説明がある', () => {
  assert.ok(RECORDS.length >= 6700, `選択問題が ${RECORDS.length} 問しか集まらない`)
  const problems = []
  for (const r of RECORDS) {
    const hits = r.choices.filter((c) => c === r.answer).length
    if (hits !== 1) problems.push(`${r.bank} ${r.id}: 正解が選択肢に${hits}個`)
    r.notes.forEach((note, i) => {
      if (typeof note !== 'string' || !note.trim()) problems.push(`${r.bank} ${r.id}: 選択肢${i + 1}の説明が空`)
    })
  }
  assert.deepEqual(problems, [])
})

test('全問題の選択肢：正解の説明が「不正解」で始まらず、誤答の説明が「正解」で始まらない', () => {
  const NEGATIVE_HEAD = /^(不正解|間違い|まちがい|誤答|誤り[。、：:です]|×)/
  const POSITIVE_HEAD = /^(正解|正答|正しい[。、：:です]|○)/
  const problems = []
  for (const r of RECORDS) {
    r.choices.forEach((choice, i) => {
      const note = r.notes[i] ?? ''
      if (choice === r.answer && NEGATIVE_HEAD.test(note)) problems.push(`${r.bank} ${r.id}: 正解「${choice}」の説明が否定で始まる: ${note.slice(0, 40)}`)
      if (choice !== r.answer && POSITIVE_HEAD.test(note)) problems.push(`${r.bank} ${r.id}: 誤答「${choice}」の説明が肯定で始まる: ${note.slice(0, 40)}`)
    })
  }
  assert.deepEqual(problems, [])
})

const normalizeSentence = (text) => String(text).toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/\s+([.,?!;:])/g, '$1').trim()
const fillBlank = (q, choice) => normalizeSentence(q.replace(/_{2,}/, choice))

test('文法：誤答を空所に入れた文が、別の問題の正しい完成文と一致しない（誤答が実は正しい問題がない）', () => {
  const known = new Map()
  for (const g of GRAMMAR) {
    for (const sentence of [fillBlank(g.q, g.answer), g.sentence?.en && normalizeSentence(g.sentence.en)].filter(Boolean)) {
      if (!known.has(sentence)) known.set(sentence, g.id)
    }
  }
  const problems = []
  for (const g of GRAMMAR) {
    if (!/_{2,}/.test(g.q)) continue
    for (const choice of g.choices) {
      if (choice === g.answer) continue
      const owner = known.get(fillBlank(g.q, choice))
      if (owner && owner !== g.id) problems.push(`${g.id}: 誤答「${choice}」を入れた文が ${owner} の正しい文と同じ`)
    }
  }
  assert.deepEqual(problems, [])
})

// 会話文（問い—答え）の問題は、完成文に答えの文も含むので、sentence.en は問いの文だけを持つ。
const DIALOGUE_SENTENCE_IDS = new Set([
  'gr_5_wh_1', 'gr_5_wh_2', 'gr_5_be_4', 'gr_5_wh_3', 'gr_5_pron_3', 'gr_5_wh_4',
  'gr_4_modal_2', 'gr_2_inv_1', 'gr_2_inv_2', 'gr_5_pron_x1',
])

test('文法：正解を空所に入れた文と、問題が持つ完成文（sentence.en）が一致する', () => {
  const problems = []
  for (const g of GRAMMAR) {
    if (!/_{2,}/.test(g.q) || !g.sentence?.en) continue
    if (DIALOGUE_SENTENCE_IDS.has(g.id)) continue
    if (fillBlank(g.q, g.answer) !== normalizeSentence(g.sentence.en)) problems.push(`${g.id}: 「${fillBlank(g.q, g.answer)}」≠「${g.sentence.en}」`)
  }
  assert.deepEqual(problems, [])
})

const storyNote = (head) => ETYMOLOGY_WORD_STORIES.find((story) => story.head === head)?.note ?? ''

test('語の成り立ち：同じ語根とは確かめられない組を「同じ語源」と書かない', () => {
  // [見出し語, 「同じ語源」と書いてはならない語]。直した理由は src/data/etymology-word-notes-clear.js の truth のコメントにある。
  const FORBIDDEN_SAME_ORIGIN = [
    ['fluid', 'flow'],
    ['fluctuate', 'flow'],
    ['fervent', 'fever'],
    ['bullet', 'ball'],
  ]
  for (const [head, other] of FORBIDDEN_SAME_ORIGIN) {
    const note = storyNote(head)
    assert.ok(note, `${head}: 語の成り立ちがない`)
    assert.ok(!new RegExp(`${other}[^。]*と同じ語源`).test(note), `${head}: ${other} と同じ語源とは確かめられない: ${note}`)
  }
  assert.match(storyNote('fluctuate'), /fluere「流れる」/)
  assert.match(storyNote('fluid'), /fluent と同じ語源/)
})

test('語の成り立ち：接頭辞の意味を取り違えない（dimension の di- は「離して」で「完全に」ではない）', () => {
  const note = storyNote('dimension')
  assert.ok(!/di[-]?「完全に」/.test(note), note)
  assert.match(note, /di-「離して/)
})

test('社会・理科の語句：ESD は SDGs の「目標」ではなく目標4のターゲットとして書く', () => {
  const term = ALL_SUBJECT_TERMS.find((entry) => entry.term === 'ESD')
  assert.ok(term, 'ESD の語句がない')
  assert.ok(!/SDGsの目標の1つ/.test(term.note), term.note)
  assert.match(term.note, /目標4/)
  assert.match(term.note, /ターゲット/)
})
