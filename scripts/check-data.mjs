#!/usr/bin/env node
// データ整合性ゲート（npm run check / build前に自動実行）。
// 全単語・熟語・長文が「既存機能を満たす必須項目」を備えるか検証し、
// 1件でも不備があれば exit 1 でビルドを止める。データ生成ミスを二度と通さない。
import {
  ALL_WORDS,
  ROOTS,
  VOCAB_FIELDS,
  VOCAB_POS,
  getWord,
  wordsByField,
  wordsByPos,
} from '../src/data/vocab.js'
import { PHRASES, getPhrase } from '../src/data/phrases.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  READING_STUDY,
  READING_WORD_COUNT_TARGETS,
  getReadingWords,
  passageWordCount,
} from '../src/data/reading-study.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import { READING_GRAMMAR_EXPECTATIONS } from '../src/data/reading-grammar-expectations.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import {
  READING_QUESTION_COUNTS,
  getReadingQuestions,
} from '../src/data/reading-questions.js'
import {
  GRAMMAR,
  GRAMMAR_LEVEL_TARGETS,
  GRAMMAR_TOPIC_MINIMUM,
  GRAMMAR_TOTAL_TARGET,
} from '../src/data/grammar.js'
import {
  GRAMMAR_EXAM_PATTERN_COUNT,
  GRAMMAR_EXAM_PATTERN_FAMILIES,
  GRAMMAR_EXAM_PATTERNS,
  GRAMMAR_EXAM_QUESTION_COUNT,
} from '../src/data/grammar-exam-patterns.js'
import { PHONETIC_OVERRIDES } from '../src/data/phonetic-overrides.js'
import { VN_EPISODES, SPEAKERS } from '../src/data/vn.js'
import {
  DICTATION_ITEMS,
  DICTATION_PROFILES,
  dictationByLevel,
} from '../src/data/dictation.js'
import {
  LISTENING_ITEMS,
  LISTENING_PROFILES,
  LISTENING_TYPE_META,
  listeningByLevel,
  listeningSpokenSegments,
} from '../src/data/listening.js'
import { KOTEN_WORDS, getKoten } from '../src/data/koten.js'
import {
  KOTEN_GRAMMAR,
  KOTEN_GRAMMAR_CATEGORIES,
  getKotenGrammar,
} from '../src/data/koten-grammar.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
} from '../src/data/koten-interpretations.js'
import {
  WRITING_EXERCISES,
  WRITING_GRAMMAR,
} from '../src/data/writing.js'
import { hasBalancedParentheses } from '../src/data/compact.js'

const LEVELS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const READING_LEVELS = new Set(['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1'])
const POS = new Set(['動', '名', '形', '副', '前', '接', '代'])
const ETYMOLOGY_KINDS = new Set(['prefix', 'root', 'suffix', 'stem'])
const ROOT_IDS = new Set(ROOTS.map((r) => r.id))
const errors = []
const ids = new Set()

// ── 単語：id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA) ──
for (const w of ALL_WORDS) {
  const at = w.id || w.word || '?'
  if (!w.id) errors.push(`単語「${w.word}」: id 無し`)
  else if (ids.has(w.id)) errors.push(`重複 id: ${w.id}`)
  ids.add(w.id)
  if (!w.word) errors.push(`${at}: word 無し`)
  if (!POS.has(w.pos)) errors.push(`${at}: pos が不正 (${w.pos})`)
  if (!w.field?.trim()) errors.push(`${at}: field 無し`)
  if (!LEVELS.has(w.level)) errors.push(`${at}: level が不正 (${w.level})`)
  if (!w.meaning) errors.push(`${at}: meaning 無し`)
  if (!w.meanings?.length) errors.push(`${at}: meanings 無し`)
  if (!hasBalancedParentheses(w.meaning)) errors.push(`${at}: meaning の括弧が不整合 (${w.meaning})`)
  for (const item of w.meanings ?? []) {
    if (!hasBalancedParentheses(item)) errors.push(`${at}: 分割後の意味の括弧が不整合 (${item})`)
  }
  if (w.meanings?.join('・') !== w.meaning) {
    errors.push(`${at}: meanings から meaning を復元できない (${w.meanings?.join('・')} != ${w.meaning})`)
  }
  if (!w.example?.en || !w.example?.ja) errors.push(`${at}: 例文(en/ja) 無し`)
  if (!w.etymology) {
    errors.push(`${at}: 語源 無し`)
  } else {
    if (!w.etymology.note?.trim()) errors.push(`${at}: 語源の意味変化説明(note) 無し`)
    for (const [i, part] of (w.etymology.parts ?? []).entries()) {
      const where = `${at}: 語源parts[${i}]`
      if (!part?.t?.trim()) errors.push(`${where} の綴り(t) 無し`)
      if (!ETYMOLOGY_KINDS.has(part?.kind)) errors.push(`${where} のkindが不正 (${part?.kind})`)
      if (part?.root && !ROOT_IDS.has(part.root)) errors.push(`${where} のroot参照先が不明 (${part.root})`)
      if (part?.root && part.kind !== 'root') errors.push(`${where} はroot参照付きだがkindがrootではない`)
    }
  }
  if (!w.phonetic) errors.push(`${at}: 発音記号(IPA) 無し → npm run phonetics`)
}

// ── 全語彙の分類学習：全件が分野・品詞にちょうど1回ずつ含まれるか ──
function checkPartition(label, groups, select) {
  const members = groups.flatMap((group) => select(group))
  const memberIds = new Set(members.map((word) => word.id))
  if (members.length !== ALL_WORDS.length) {
    errors.push(`${label}分類の合計が全語彙数と不一致 (${members.length}/${ALL_WORDS.length})`)
  }
  if (memberIds.size !== ALL_WORDS.length) {
    errors.push(`${label}分類に重複または未分類あり (一意${memberIds.size}/${ALL_WORDS.length})`)
  }
  for (const group of groups) {
    const words = select(group)
    if (!words.length) errors.push(`${label}分類「${typeof group === 'string' ? group : group.id}」が空`)
  }
}

checkPartition('分野', VOCAB_FIELDS, wordsByField)
checkPartition('品詞', VOCAB_POS, ({ id }) => wordsByPos(id))

// ── 補助項目（類義語/反対語/派生語）と「語族=1エントリ」ルールの強制 ──
const wordIds = new Set(ALL_WORDS.map((w) => w.id))
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
for (const w of ALL_WORDS) {
  for (const key of ['synonyms', 'antonyms', 'derivatives', 'family']) {
    const refs = new Set()
    for (const it of w[key] ?? []) {
      if (!it || !it.w || !it.m) errors.push(`${w.id}: ${key} の項目は {w:英単語, m:意味} が必須 (${JSON.stringify(it)})`)
      const ref = it?.w ? slug(it.w) : ''
      if (ref === w.id) errors.push(`${w.id}: ${key} に自分自身 (${it.w}) は指定不可`)
      if (ref && refs.has(ref)) errors.push(`${w.id}: ${key} に重複 (${it.w})`)
      if (ref) refs.add(ref)
    }
  }
  // 推奨ルール: 透明な派生語はメタデータに留め、独立エントリと二重計上しない
  for (const d of w.derivatives ?? []) {
    if (d?.w && wordIds.has(slug(d.w)) && slug(d.w) !== w.id) {
      errors.push(`${w.id}: 派生語「${d.w}」は独立エントリです。派生語(メタ)と独立エントリは二重計上不可（語族=1エントリで数える）。別語なら synonyms/usage で参照を。`)
    }
  }
}

// ── 熟語・構文 ──
for (const p of PHRASES) {
  const at = p.id || p.phrase
  if (!p.phrase || !p.meaning || !p.meanings?.length || !p.example?.en || !p.example?.ja) {
    errors.push(`熟語/構文 ${at}: 必須項目(phrase/meaning/meanings/example) 不足`)
  }
}

// ── 長文：まとめ語彙・gloss の id が辞書解決できるか ──
for (const ps of PASSAGES) {
  if (!READING_LEVELS.has(ps.level)) errors.push(`長文 ${ps.id}: level が不正 (${ps.level})`)
  for (const id of ps.vocab) if (!getWord(id)) errors.push(`長文 ${ps.id}: vocab ${id} が辞書に無い`)
  const study = READING_STUDY[ps.id]
  if (!study) {
    errors.push(`長文 ${ps.id}: 読解前の熟語・表現データが無い`)
  } else {
    for (const id of study.phraseIds ?? []) {
      if (!getPhrase(id)) errors.push(`長文 ${ps.id}: phrase ${id} が熟語・構文データに無い`)
    }
    for (const item of study.expressions ?? []) {
      if (
        !item.id ||
        !item.phrase ||
        !item.meaning ||
        !item.meanings?.length ||
        !item.example?.en ||
        !item.example?.ja
      ) {
        errors.push(`長文 ${ps.id}: 読解前表現 ${item.id ?? '(id無し)'} の必須項目が不足`)
      }
    }
  }
  const expectedPatterns = READING_GRAMMAR_EXPECTATIONS[ps.id]
  if (!expectedPatterns) {
    errors.push(`長文 ${ps.id}: 人手確認済みの主節文型正解表が無い`)
  } else if (expectedPatterns.length !== ps.sentences.length) {
    errors.push(
      `長文 ${ps.id}: 文型正解表が${expectedPatterns.length}文分（本文は${ps.sentences.length}文）`,
    )
  }
  for (const [sentenceIndex, s] of ps.sentences.entries()) {
    if (!s.en || !s.ja || !s.chunks?.length) errors.push(`長文 ${ps.id}: 文に en/ja/chunks 不足`)
    for (const [k, g] of Object.entries(s.gloss ?? {})) {
      if (g.id && !getWord(g.id)) errors.push(`長文 ${ps.id}: gloss "${k}"→${g.id} が辞書に無い`)
    }
    const tokens = s.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []
    for (const surface of tokens) {
      const key = surface.toLowerCase().replace('’', "'")
      const resolved = resolvePassageWord(key, s.gloss)
      const proper = s.gloss?.[key]?.proper === true
      if (!resolved) {
        errors.push(`長文 ${ps.id}: 本文語 "${surface}" の意味を解決できない (${s.en})`)
      } else if (!resolved.id && !proper) {
        errors.push(`長文 ${ps.id}: 本文語 "${surface}" に保存可能な共通辞書IDが無い`)
      } else if (resolved.id && !getWord(resolved.id)) {
        errors.push(`長文 ${ps.id}: 本文語 "${surface}" の辞書ID ${resolved.id} が実在しない`)
      }
    }
    const expectedPattern = expectedPatterns?.[sentenceIndex]
    const actualPattern = analyzeReadingSentence(s).mainPattern
    if (expectedPattern && actualPattern !== expectedPattern) {
      errors.push(
        `長文 ${ps.id}: 第${sentenceIndex + 1}文の主節は${actualPattern || '未判定'}（正解表は${expectedPattern}）`,
      )
    }
  }
  const studyWordIds = new Set(getReadingWords(ps).map((word) => word.id))
  for (const id of ps.vocab) {
    if (!studyWordIds.has(id)) errors.push(`長文 ${ps.id}: vocab ${id} が読解前単語学習に出ない`)
  }
  const target = READING_WORD_COUNT_TARGETS[ps.level]
  const wordCount = passageWordCount(ps)
  if (!target) {
    errors.push(`長文 ${ps.id}: 語数設計が無い`)
  } else if (wordCount < target.min || wordCount > target.max) {
    errors.push(
      `長文 ${ps.id}: ${wordCount}語は英検${ps.level}級の範囲外 (${target.min}〜${target.max}語)`,
    )
  }
  const paragraphCount = ps.sentences.filter((sentence) => sentence.paragraphStart).length
  if (paragraphCount < 2) errors.push(`長文 ${ps.id}: 段落が2件未満`)
  const questions = getReadingQuestions(ps.id)
  const expectedQuestions = READING_QUESTION_COUNTS[ps.level]
  if (questions.length !== expectedQuestions) {
    errors.push(
      `長文 ${ps.id}: 内容理解問題が${questions.length}問 (設計は${expectedQuestions}問)`,
    )
  }
  for (const [i, q] of questions.entries()) {
    const at = `長文 ${ps.id}: 問題${i + 1}`
    if (!q.q || !q.explain) errors.push(`${at}: q/explain 不足`)
    if (!Array.isArray(q.choices) || q.choices.length < 3) errors.push(`${at}: choices は3件以上必要`)
    if (!q.choices?.includes(q.answer)) errors.push(`${at}: answer が choices に無い`)
  }
}
for (const level of READING_LEVELS) {
  if (!PASSAGES.some((passage) => passage.level === level)) {
    errors.push(`長文: 英検${level}級の教材が無い`)
  }
}

// ── 文法：空所・正解・完成文の整合性 ──
const grammarIds = new Set()
const grammarPrompts = new Set()
const grammarSentences = new Set()
const normalizeSentence = (text) =>
  (text ?? '').replace(/\s+/g, ' ').replace(/\s+([,.?!])/g, '$1').trim()
for (const g of GRAMMAR) {
  const at = `文法 ${g.id ?? '(id無し)'}`
  if (!g.id || grammarIds.has(g.id)) errors.push(`${at}: id 無し/重複`)
  grammarIds.add(g.id)
  if (!LEVELS.has(g.level)) errors.push(`${at}: level が不正 (${g.level})`)
  if (!g.topic?.trim()) errors.push(`${at}: topic 無し`)
  if (!g.q || (g.q.match(/___/g) ?? []).length !== 1) errors.push(`${at}: 空所 ___ は1個必要`)
  if (!Array.isArray(g.choices) || g.choices.length !== 4) errors.push(`${at}: choices は4件必要`)
  if (g.choices?.some((choice) => typeof choice !== 'string' || !choice.trim())) {
    errors.push(`${at}: choices は空でない文字列が必要`)
  }
  if (g.choices?.some((choice) => choice !== choice.trim())) {
    errors.push(`${at}: choices の前後に空白あり`)
  }
  if (g.choices && new Set(g.choices).size !== g.choices.length) {
    errors.push(`${at}: choices に重複あり`)
  }
  if (typeof g.answer !== 'string' || g.answer !== g.answer.trim()) {
    errors.push(`${at}: answer は前後に空白のない文字列が必要`)
  }
  if (!g.choices?.includes(g.answer)) errors.push(`${at}: answer が choices に無い (${g.answer})`)
  if (!g.sentence?.en || !g.sentence?.ja || !g.explain) errors.push(`${at}: sentence(en/ja) または explain 不足`)
  const promptKey = normalizeSentence(g.q).toLowerCase()
  if (promptKey && grammarPrompts.has(promptKey)) errors.push(`${at}: 同一の問題文が重複`)
  grammarPrompts.add(promptKey)
  const sentenceKey = normalizeSentence(g.sentence?.en).toLowerCase()
  if (sentenceKey && grammarSentences.has(sentenceKey)) errors.push(`${at}: 同一の完成文が重複`)
  grammarSentences.add(sentenceKey)
  const completed = normalizeSentence(g.q?.replace('___', g.answer))
  const expected = normalizeSentence(g.sentence?.en)
  if (completed && expected && !completed.includes(expected)) {
    errors.push(`${at}: 正解を入れた問題文と完成文が不一致 (${completed} / ${expected})`)
  }
  if (g.id?.startsWith('gr_auto_')) {
    if (completed !== expected) {
      errors.push(`${at}: 生成問題の完成文が空所補完結果と完全一致しない (${completed} / ${expected})`)
    }
    if (/[A-Za-z]/.test(g.sentence?.ja ?? '')) {
      errors.push(`${at}: 生成問題の和訳に未翻訳の英字がある (${g.sentence.ja})`)
    }
    if (/(するし|するした|するして|するでき|するす|行きて|撮りて|手伝いて|ででした|をを)/.test(g.sentence?.ja ?? '')) {
      errors.push(`${at}: 生成問題の和訳に不自然な活用がある (${g.sentence.ja})`)
    }
  }
}
for (const [level, minimum] of Object.entries(GRAMMAR_LEVEL_TARGETS)) {
  const count = GRAMMAR.filter((item) => item.level === level).length
  if (count !== minimum) errors.push(`文法 英検${level}級: ${count}問（収録目標は${minimum}問）`)
}
if (GRAMMAR.length !== GRAMMAR_TOTAL_TARGET) {
  errors.push(`文法 合計: ${GRAMMAR.length}問（収録目標は${GRAMMAR_TOTAL_TARGET}問）`)
}
const grammarTopicCounts = new Map()
for (const item of GRAMMAR) {
  const key = `${item.level}\u0000${item.topic}`
  grammarTopicCounts.set(key, (grammarTopicCounts.get(key) ?? 0) + 1)
}
const generatedPatternCounts = new Map()
for (const item of GRAMMAR.filter((question) => question.id.startsWith('gr_auto_'))) {
  if (!item.pattern?.startsWith('auto:')) {
    errors.push(`文法 ${item.id}: 自動生成問題の pattern 無し`)
    continue
  }
  generatedPatternCounts.set(item.pattern, (generatedPatternCounts.get(item.pattern) ?? 0) + 1)
}
for (const [pattern, count] of generatedPatternCounts) {
  if (count < 10) errors.push(`文法 pattern ${pattern}: ${count}問（同型反復には10問以上必要）`)
}
const examSources = new Set(['eiken', 'common', 'university'])
const examPatternCounts = new Map()
const examPatternMeta = new Map()
const examItems = GRAMMAR.filter((question) => question.id.startsWith('gr_exam_'))
const registeredExamIds = new Set(GRAMMAR_EXAM_PATTERNS.map((question) => question.id))
if (examItems.length !== GRAMMAR_EXAM_QUESTION_COUNT) {
  errors.push(`文法 入試型問題: ${examItems.length}問（収録目標は${GRAMMAR_EXAM_QUESTION_COUNT}問）`)
}
if (GRAMMAR_EXAM_PATTERN_FAMILIES.length !== GRAMMAR_EXAM_PATTERN_COUNT) {
  errors.push(`文法 入試型 family 数が定数と不一致 (${GRAMMAR_EXAM_PATTERN_FAMILIES.length}/${GRAMMAR_EXAM_PATTERN_COUNT})`)
}
for (const family of GRAMMAR_EXAM_PATTERN_FAMILIES) {
  if (family.length !== 10) {
    errors.push(`文法 入試型 family ${family[0]?.pattern ?? '(空)'}: ${family.length}問（各型10問必要）`)
  }
  const focusCounts = new Map()
  for (const item of family) {
    focusCounts.set(item.examFocus, (focusCounts.get(item.examFocus) ?? 0) + 1)
  }
  if (focusCounts.size < 4) {
    errors.push(`文法 入試型 family ${family[0]?.pattern ?? '(空)'}: 問う箇所が${focusCounts.size}種（4種以上必要）`)
  }
  if (Math.max(0, ...focusCounts.values()) > 3) {
    errors.push(`文法 入試型 family ${family[0]?.pattern ?? '(空)'}: 同じ問題箇所が4問以上に偏っている`)
  }
  if (new Set(family.map((item) => item.answer)).size < 4) {
    errors.push(`文法 入試型 family ${family[0]?.pattern ?? '(空)'}: 正解語句が4種未満`)
  }
}
for (const item of examItems) {
  const at = `文法 ${item.id}`
  if (!registeredExamIds.has(item.id)) errors.push(`${at}: 入試型データ本体に未登録`)
  if (!examSources.has(item.examSource)) errors.push(`${at}: examSource が不正 (${item.examSource})`)
  if (!item.examFocus?.trim()) errors.push(`${at}: 問題箇所を示す examFocus が無い`)
  if (!item.pattern?.startsWith(`exam:${item.examSource}:`)) {
    errors.push(`${at}: pattern と examSource が不一致 (${item.pattern}/${item.examSource})`)
    continue
  }
  const completed = normalizeSentence(item.q.replace('___', item.answer))
  const expected = normalizeSentence(item.sentence.en)
  if (completed !== expected) {
    errors.push(`${at}: 入試型問題の完成文が空所補完結果と完全一致しない (${completed} / ${expected})`)
  }
  if (/[A-Za-z]/.test(item.sentence.ja)) {
    errors.push(`${at}: 入試型問題の和訳に未翻訳の英字がある (${item.sentence.ja})`)
  }
  examPatternCounts.set(item.pattern, (examPatternCounts.get(item.pattern) ?? 0) + 1)
  const meta = `${item.examSource}\u0000${item.level}\u0000${item.topic}`
  const knownMeta = examPatternMeta.get(item.pattern)
  if (knownMeta && knownMeta !== meta) {
    errors.push(`${at}: 同じ入試型 pattern 内で source/level/topic が不一致`)
  }
  examPatternMeta.set(item.pattern, meta)
}
if (examPatternCounts.size !== GRAMMAR_EXAM_PATTERN_COUNT) {
  errors.push(`文法 入試型 pattern: ${examPatternCounts.size}種（収録目標は${GRAMMAR_EXAM_PATTERN_COUNT}種）`)
}
for (const [pattern, count] of examPatternCounts) {
  if (count !== 10) errors.push(`文法 入試型 pattern ${pattern}: ${count}問（各型10問必要）`)
}
for (const [key, count] of grammarTopicCounts) {
  if (count < GRAMMAR_TOPIC_MINIMUM) {
    const [level, topic] = key.split('\u0000')
    errors.push(`文法 英検${level}級「${topic}」: ${count}問（単元下限は${GRAMMAR_TOPIC_MINIMUM}問）`)
  }
}

// ── 古典：文法登録項目と「単語・文法・常識」短文解釈の参照整合性 ──
const kotenGrammarCategories = new Set(KOTEN_GRAMMAR_CATEGORIES.map((item) => item.id))
const kotenGrammarIds = new Set()
for (const item of KOTEN_GRAMMAR) {
  const at = `古典文法 ${item.id ?? '(id無し)'}`
  if (!item.id || kotenGrammarIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
  kotenGrammarIds.add(item.id)
  if (!kotenGrammarCategories.has(item.category)) errors.push(`${at}: category が不正 (${item.category})`)
  if (
    !item.title ||
    !item.forms ||
    !item.connection ||
    !item.meaning ||
    !item.summary ||
    !item.example?.ja ||
    !item.example?.gendai
  ) {
    errors.push(`${at}: title/forms/connection/meaning/summary/example が不足`)
  }
}

const kotenLevelIds = new Set(KOTEN_INTERPRETATION_LEVELS.map((item) => item.id))
const kotenFocusIds = new Set(Object.keys(KOTEN_INTERPRETATION_FOCUS))
const kotenQuestionIds = new Set()
if (KOTEN_INTERPRETATIONS.length < 30) {
  errors.push(`古典短文解釈: 30問未満 (${KOTEN_INTERPRETATIONS.length}問)`)
}
for (const item of KOTEN_INTERPRETATIONS) {
  const at = `古典短文 ${item.id ?? '(id無し)'}`
  if (!item.id || kotenQuestionIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
  kotenQuestionIds.add(item.id)
  if (!kotenLevelIds.has(item.level)) errors.push(`${at}: level が不正 (${item.level})`)
  if (!kotenFocusIds.has(item.focus)) errors.push(`${at}: focus が不正 (${item.focus})`)
  if (!item.source || !item.text || !item.question || !item.translation) {
    errors.push(`${at}: source/text/question/translation が不足`)
  }
  if (!Array.isArray(item.choices) || item.choices.length !== 4) {
    errors.push(`${at}: choices は4件必要`)
  } else if (new Set(item.choices).size !== item.choices.length) {
    errors.push(`${at}: choices に重複あり`)
  }
  if (!item.choices?.includes(item.answer)) errors.push(`${at}: answer が choices に無い`)
  if (!item.wordIds?.length || !item.grammarIds?.length) {
    errors.push(`${at}: wordIds/grammarIds は各1件以上必要`)
  }
  for (const id of item.wordIds ?? []) {
    if (!getKoten(id)) errors.push(`${at}: 古典単語 ${id} が存在しない`)
  }
  for (const id of item.grammarIds ?? []) {
    if (!getKotenGrammar(id)) errors.push(`${at}: 古典文法 ${id} が存在しない`)
  }
  if (!item.vocabTip || !item.grammarTip || !item.culture?.title || !item.culture?.body) {
    errors.push(`${at}: 単語・文法・常識の解説が不足`)
  }
}
for (const level of kotenLevelIds) {
  if (!KOTEN_INTERPRETATIONS.some((item) => item.level === level)) {
    errors.push(`古典短文解釈: ${level} の問題が無い`)
  }
}
for (const focus of kotenFocusIds) {
  if (!KOTEN_INTERPRETATIONS.some((item) => item.focus === focus)) {
    errors.push(`古典短文解釈: ${focus} 中心の問題が無い`)
  }
}

// ── ディクテーション：専用問題数・必須項目・級別文長の段階性 ──
const dictationIds = new Set()
const dictationTexts = new Set()
let previousDictationAverage = 0
for (const level of ['5', '4', '3', 'pre2', '2', 'pre1', '1']) {
  const profile = DICTATION_PROFILES[level]
  const items = dictationByLevel(level)
  if (!profile) errors.push(`ディクテーション: 英検${level}級の設計基準が無い`)
  if (items.length < 20) errors.push(`ディクテーション: 英検${level}級が20問未満 (${items.length})`)
  if (new Set(items.map((item) => item.topic)).size < 6) {
    errors.push(`ディクテーション: 英検${level}級の話題が6種類未満`)
  }
  if (new Set(items.map((item) => item.focus)).size < 6) {
    errors.push(`ディクテーション: 英検${level}級の構文焦点が6種類未満`)
  }

  for (const item of items) {
    const at = `ディクテーション ${item.id ?? '(id無し)'}`
    if (!item.id || dictationIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
    dictationIds.add(item.id)
    const normalizedText = item.text?.toLowerCase()
    if (!normalizedText || dictationTexts.has(normalizedText)) errors.push(`${at}: 英文無し/重複`)
    dictationTexts.add(normalizedText)
    if (!item.ja || !item.topic || !item.kind || !item.focus) errors.push(`${at}: ja/topic/kind/focus 不足`)
    if (
      profile &&
      (item.wordCount < profile.wordRange[0] || item.wordCount > profile.wordRange[1])
    ) {
      errors.push(
        `${at}: ${item.wordCount}語は英検${level}級の範囲外 (${profile.wordRange.join('〜')}語)`,
      )
    }
  }

  const average = items.length
    ? items.reduce((sum, item) => sum + item.wordCount, 0) / items.length
    : 0
  if (average <= previousDictationAverage) {
    errors.push(`ディクテーション: 英検${level}級の平均文長が下位級以下 (${average.toFixed(1)}語)`)
  }
  previousDictationAverage = average
}
if (dictationIds.size !== DICTATION_ITEMS.length) {
  errors.push(`ディクテーション: id一意件数が全問題数と不一致 (${dictationIds.size}/${DICTATION_ITEMS.length})`)
}

// ── リスニング：英検級別形式・放送回数・必須項目・情報量の段階性 ──
const listeningIds = new Set()
const listeningStimuli = new Set()
let previousListeningAverage = 0
for (const level of ['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1']) {
  const profile = LISTENING_PROFILES[level]
  const items = listeningByLevel(level)
  if (!profile) {
    errors.push(`リスニング: 英検${level}級の設計基準が無い`)
    continue
  }
  if (items.length !== 20) {
    errors.push(`リスニング: 英検${level}級が20問ではない (${items.length})`)
  }
  if (new Set(items.map((item) => item.topic)).size < 6) {
    errors.push(`リスニング: 英検${level}級の話題が6種類未満`)
  }
  if (new Set(items.map((item) => item.answer)).size < 3) {
    errors.push(`リスニング: 英検${level}級の正解位置が偏りすぎている`)
  }

  for (const [type, target] of Object.entries(profile.typeTargets)) {
    const actual = items.filter((item) => item.type === type).length
    if (actual !== target) {
      errors.push(`リスニング: 英検${level}級 ${type} が ${actual}/${target}問`)
    }
  }

  for (const item of items) {
    const at = `リスニング ${item.id ?? '(id無し)'}`
    if (!item.id || listeningIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
    listeningIds.add(item.id)
    if (!LISTENING_TYPE_META[item.type]) errors.push(`${at}: type が不正 (${item.type})`)
    if (!(item.type in profile.typeTargets)) errors.push(`${at}: 級の対象外形式 (${item.type})`)
    if (!item.topic || !item.question || !item.questionJa || !item.explain) {
      errors.push(`${at}: topic/question/questionJa/explain 不足`)
    }
    if (item.type !== 'picture' && !item.audio.length) errors.push(`${at}: 音声本文が無い`)
    if (item.type === 'picture' && !item.visual) errors.push(`${at}: イラストが無い`)

    const expectedChoices = LISTENING_TYPE_META[item.type]?.spokenChoices ? 3 : 4
    if (item.choices.length !== expectedChoices) {
      errors.push(`${at}: choices は${expectedChoices}件必要 (${item.choices.length})`)
    }
    if (new Set(item.choices.map((choice) => choice.text)).size !== item.choices.length) {
      errors.push(`${at}: choices に重複あり`)
    }
    if (!item.choices.some((choice) => choice.id === item.answer)) {
      errors.push(`${at}: answer が choices に無い`)
    }
    if (item.plays !== profile.plays[item.type]) {
      errors.push(`${at}: 放送回数が級別基準と不一致 (${item.plays}/${profile.plays[item.type]})`)
    }
    if (!Number.isFinite(item.wordCount) || item.wordCount <= 0) {
      errors.push(`${at}: wordCount が不正 (${item.wordCount})`)
    }

    const spoken = listeningSpokenSegments(item)
    if (!spoken.length) errors.push(`${at}: 再生セグメントが空`)
    if (
      LISTENING_TYPE_META[item.type]?.spokenChoices &&
      spoken.slice(-item.choices.length).some((segment, index) =>
        !segment.text.startsWith(`Number ${index + 1}.`),
      )
    ) {
      errors.push(`${at}: 音声選択肢の番号と順序が不正`)
    }

    const stimulus = spoken.map((segment) => segment.text.toLowerCase()).join(' ')
    if (!stimulus || listeningStimuli.has(stimulus)) errors.push(`${at}: 音声内容が空/重複`)
    listeningStimuli.add(stimulus)
  }

  const average = items.length
    ? items.reduce((sum, item) => sum + item.wordCount, 0) / items.length
    : 0
  if (average <= previousListeningAverage) {
    errors.push(`リスニング: 英検${level}級の平均情報量が下位級以下 (${average.toFixed(1)}語)`)
  }
  previousListeningAverage = average
}
if (listeningIds.size !== LISTENING_ITEMS.length) {
  errors.push(`リスニング: id一意件数が全問題数と不一致 (${listeningIds.size}/${LISTENING_ITEMS.length})`)
}

// ── 発音：同綴異音語の補正が実際の見出し語へ適用されているか ──
for (const [id, ipa] of Object.entries(PHONETIC_OVERRIDES)) {
  const word = getWord(id)
  if (!word) errors.push(`発音補正 ${id}: 見出し語が無い`)
  else if (word.phonetic !== ipa) errors.push(`発音補正 ${id}: ${ipa} が適用されていない (${word.phonetic})`)
}

// ── 英会話ノベル：遷移先・到達可能性・返答話者 ──
const episodeIds = new Set()
for (const episode of VN_EPISODES) {
  const at = `英会話ノベル ${episode.id ?? '(id無し)'}`
  if (!episode.id || episodeIds.has(episode.id)) errors.push(`${at}: id 無し/重複`)
  episodeIds.add(episode.id)
  if (!episode.nodes?.[episode.start]) errors.push(`${at}: start (${episode.start}) が存在しない`)

  for (const [nodeId, node] of Object.entries(episode.nodes ?? {})) {
    const where = `${at}/${nodeId}`
    if (node.speaker !== 'narration' && !SPEAKERS[node.speaker]) {
      errors.push(`${where}: speaker が不明 (${node.speaker})`)
    }
    if (node.next && !episode.nodes[node.next]) errors.push(`${where}: next が不明 (${node.next})`)
    for (const [i, choice] of (node.choices ?? []).entries()) {
      if (!episode.nodes[choice.next]) errors.push(`${where}: choices[${i}].next が不明 (${choice.next})`)
      const replySpeaker = choice.reply?.speaker ?? node.speaker
      if (choice.reply && replySpeaker === 'narration') {
        errors.push(`${where}: choices[${i}] の返答話者を明示する必要がある`)
      } else if (choice.reply && !SPEAKERS[replySpeaker]) {
        errors.push(`${where}: choices[${i}] の返答話者が不明 (${replySpeaker})`)
      }
    }
  }

  const reached = new Set()
  const visit = (id) => {
    if (!id || reached.has(id) || !episode.nodes?.[id]) return
    reached.add(id)
    const node = episode.nodes[id]
    visit(node.next)
    for (const choice of node.choices ?? []) visit(choice.next)
  }
  visit(episode.start)
  for (const nodeId of Object.keys(episode.nodes ?? {})) {
    if (!reached.has(nodeId)) errors.push(`${at}/${nodeId}: start から到達できない`)
  }
  if (![...reached].some((id) => episode.nodes[id]?.end)) errors.push(`${at}: 到達可能な終了ノードが無い`)
}

// ── 全英語教材：機械的に確定できる英文破損を横断監査 ──
function auditEnglish(label, text, { complete = false } = {}) {
  if (typeof text !== 'string' || !/[A-Za-z]/.test(text)) return
  if (/\s{2,}/.test(text)) errors.push(`${label}: 英文に連続空白あり (${text})`)
  if (/\s+[,.!?;:]/.test(text)) errors.push(`${label}: 句読点直前に空白あり (${text})`)
  if (/___|\{\{[^}]+\}\}/.test(text)) errors.push(`${label}: 未解決の空欄・変数あり (${text})`)
  const withoutEllipses = text.replace(/\.{3}/g, '')
  if (/[,!?;:]{2,}|\.\.(?!\.)/.test(withoutEllipses)) {
    errors.push(`${label}: 句読点の重複あり (${text})`)
  }
  const duplicate = text.match(/\b([A-Za-z]+)\s+\1\b/i)?.[0]?.toLowerCase()
  if (duplicate && duplicate !== 'had had' && duplicate !== 'that that') {
    errors.push(`${label}: 同一語が連続 (${text})`)
  }
  for (const [open, close] of [['(', ')'], ['[', ']']]) {
    const opens = [...text].filter((char) => char === open).length
    const closes = [...text].filter((char) => char === close).length
    if (opens !== closes) errors.push(`${label}: ${open}${close} の対応が不正 (${text})`)
  }

  const greeting = /^(?:Dear|Hello|Hi)\b.*,$/.test(text)
  if (complete && !greeting && !/[.!?]['”’)]?$/.test(text)) {
    errors.push(`${label}: 完全文の末尾に句点・疑問符・感嘆符が無い (${text})`)
  }
  if (complete && !/^[('"“‘]*[A-Z0-9]/.test(text)) {
    errors.push(`${label}: 完全文が大文字で始まらない (${text})`)
  }

  for (const match of text.matchAll(/\b([Aa]n?|AN)\s+([a-z][A-Za-z'-]*)/g)) {
    const article = match[1].toLowerCase()
    if (match[1] === 'A' && match.index > 0) continue
    const word = match[2].toLowerCase()
    const silentH = /^(?:heir|honest|honor|hour)/.test(word)
    const consonantSoundVowel =
      /^(?:eulogy|euphem|euro|ewe|once|oneself|oneness|uni(?:form|que|t|vers)|use|user|usual|useful)/.test(word) ||
      word === 'one' ||
      word.startsWith('one-')
    const expectsAn = (/^[aeiou]/.test(word) && !consonantSoundVowel) || silentH
    if ((article === 'an') !== expectsAn) {
      errors.push(`${label}: 冠詞 ${match[0]} のa/anが不正 (${text})`)
    }
  }
}

for (const word of ALL_WORDS) auditEnglish(`単語 ${word.id} 例文`, word.example?.en)
for (const phrase of PHRASES) auditEnglish(`熟語 ${phrase.id} 例文`, phrase.example?.en)
for (const passage of PASSAGES) {
  passage.sentences.forEach((sentence, index) =>
    auditEnglish(`長文 ${passage.id} 第${index + 1}文`, sentence.en, { complete: true }))
}
for (const item of GRAMMAR) {
  auditEnglish(`文法 ${item.id} 完成文`, item.sentence?.en, { complete: true })
}
for (const item of DICTATION_ITEMS) {
  auditEnglish(`ディクテーション ${item.id}`, item.text, { complete: true })
}
for (const item of LISTENING_ITEMS) {
  item.audio.forEach((segment, index) =>
    auditEnglish(`リスニング ${item.id} 音声${index + 1}`, segment.text, { complete: true }))
  auditEnglish(`リスニング ${item.id} 設問`, item.question, { complete: true })
  item.choices.forEach((choice) =>
    auditEnglish(`リスニング ${item.id} 選択肢${choice.id}`, choice.text, { complete: true }))
}
for (const item of WRITING_GRAMMAR) {
  auditEnglish(`英作文文法 ${item.id}`, item.example?.en, { complete: true })
}
for (const exercise of WRITING_EXERCISES) {
  for (const step of exercise.steps) {
    for (const option of step.options) {
      auditEnglish(`英作文 ${exercise.id}/${step.id}/${option.id}`, option.text, { complete: true })
    }
  }
}
for (const episode of VN_EPISODES) {
  for (const [nodeId, node] of Object.entries(episode.nodes ?? {})) {
    auditEnglish(`英会話ノベル ${episode.id}/${nodeId}`, node.en, { complete: true })
    for (const [index, choice] of (node.choices ?? []).entries()) {
      auditEnglish(`英会話ノベル ${episode.id}/${nodeId} 選択肢${index + 1}`, choice.en, { complete: true })
      auditEnglish(`英会話ノベル ${episode.id}/${nodeId} 返答${index + 1}`, choice.reply?.en, { complete: true })
    }
  }
}

if (errors.length) {
  console.error(`\n❌ データ検証 失敗（${errors.length}件）`)
  errors.slice(0, 40).forEach((e) => console.error('  - ' + e))
  if (errors.length > 40) console.error(`  … 他 ${errors.length - 40} 件`)
  console.error('\n【単語の必須項目】id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA)')
  console.error('単語を足したら: npm run phonetics（IPA生成）→ npm run check。これらを満たすまでビルドできません。\n')
  process.exit(1)
}

console.log(`✅ データ検証OK: ${ALL_WORDS.length}英単語 / ${PHRASES.length}熟語・構文 / ${GRAMMAR.length}英文法 / ${PASSAGES.length}長文 / ${DICTATION_ITEMS.length}ディクテーション / ${LISTENING_ITEMS.length}リスニング / ${KOTEN_WORDS.length}古典単語 / ${KOTEN_GRAMMAR.length}古典文法 / ${KOTEN_INTERPRETATIONS.length}古典短文 — 全て必須項目を満たす`)
