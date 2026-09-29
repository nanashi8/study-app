// 中学の社会・理科の教材の入口。冊ごとのファイルを集め、語句と問題に ID を付け、引き方・出題の選び方をまとめる。
// 本文の書き方は meta.js の冒頭。出題の順は全教材共通の決まり（lib/studyOrder.js）に従う。
import { GEOGRAPHY_UNITS } from './geography.js'
import { HISTORY_UNITS } from './history.js'
import { CIVICS_UNITS } from './civics.js'
import { SCIENCE1_UNITS } from './science1.js'
import { SCIENCE2_UNITS } from './science2.js'
import { SCIENCE3_UNITS } from './science3.js'
import { SUBJECTS, SUBJECT_IDS, PRACTICE_LEVEL_IDS } from './meta.js'
import { orderForStudy, pickInStudyOrder, rankQuestionsForStudy } from '../../lib/studyOrder.js'
import { mixItemsForStudy, mixRankedForStudy, questionMixStockOf } from '../../lib/studyMix.js'

export * from './meta.js'

const BOOK_SOURCES = Object.freeze({
  geography: GEOGRAPHY_UNITS,
  history: HISTORY_UNITS,
  civics: CIVICS_UNITS,
  science1: SCIENCE1_UNITS,
  science2: SCIENCE2_UNITS,
  science3: SCIENCE3_UNITS,
})

const pad2 = (number) => String(number).padStart(2, '0')

function finalizeTerm(unit, entry, index) {
  const [term, meaning, extra = {}] = entry
  return Object.freeze({
    id: `${unit.id}-t${pad2(index + 1)}`,
    unitId: unit.id,
    subject: unit.subject,
    book: unit.book,
    term,
    meaning,
    note: extra.note ?? '',
  })
}

function finalizeQuestion(unit, question, index) {
  const kind = question.kind ?? 'choice'
  const base = {
    id: `${unit.id}-q${pad2(index + 1)}`,
    unitId: unit.id,
    subject: unit.subject,
    book: unit.book,
    level: question.level,
    kind,
    text: question.text,
    figure: question.figure ?? null,
    explanation: question.explanation ?? '',
    // 図を使う問題の「図の読み取り方」（図のどこを見て、どう判断するか）。答えたあとの解説に出す。
    read: Object.freeze([...(question.read ?? [])]),
  }
  if (kind === 'choice') {
    const choices = question.choices.map(([text]) => text)
    return Object.freeze({
      ...base,
      choices: Object.freeze(choices),
      answer: choices[0],
      notes: Object.freeze(Object.fromEntries(question.choices.map(([text, note]) => [text, note]))),
    })
  }
  if (kind === 'number') {
    return Object.freeze({
      ...base,
      answer: question.answer,
      unit: question.unit ?? '',
      steps: Object.freeze([...(question.steps ?? [])]),
    })
  }
  return Object.freeze({
    ...base,
    items: Object.freeze(question.items.map(([text]) => text)),
    notes: Object.freeze(Object.fromEntries(question.items.map(([text, note]) => [text, note]))),
  })
}

function finalizeUnit(subject, bookId, source, order) {
  const unit = {
    id: source.id,
    subject,
    book: bookId,
    order,
    part: source.part ?? '',
    chapter: source.chapter ?? '',
    title: source.title,
    goal: source.goal ?? '',
    points: Object.freeze((source.points ?? []).map((point) => Object.freeze({ ...point }))),
  }
  unit.terms = Object.freeze((source.terms ?? []).map((entry, index) => finalizeTerm(unit, entry, index)))
  unit.questions = Object.freeze((source.questions ?? []).map((question, index) => finalizeQuestion(unit, question, index)))
  return Object.freeze(unit)
}

const UNITS_BY_SUBJECT = Object.freeze(Object.fromEntries(SUBJECT_IDS.map((subject) => {
  let order = 0
  const units = SUBJECTS[subject].books.flatMap((book) => (
    BOOK_SOURCES[book.id].map((source) => finalizeUnit(subject, book.id, source, order++))
  ))
  return [subject, Object.freeze(units)]
})))

export const ALL_SUBJECT_UNITS = Object.freeze(SUBJECT_IDS.flatMap((subject) => UNITS_BY_SUBJECT[subject]))
export const ALL_SUBJECT_TERMS = Object.freeze(ALL_SUBJECT_UNITS.flatMap((unit) => unit.terms))
export const ALL_SUBJECT_QUESTIONS = Object.freeze(ALL_SUBJECT_UNITS.flatMap((unit) => unit.questions))

const UNIT_BY_ID = new Map(ALL_SUBJECT_UNITS.map((unit) => [unit.id, unit]))
const TERM_BY_ID = new Map(ALL_SUBJECT_TERMS.map((term) => [term.id, term]))
const QUESTION_BY_ID = new Map(ALL_SUBJECT_QUESTIONS.map((question) => [question.id, question]))

export const subjectUnits = (subject, bookId = null) => (UNITS_BY_SUBJECT[subject] ?? [])
  .filter((unit) => !bookId || unit.book === bookId)
export const subjectTerms = (subject, bookId = null) => subjectUnits(subject, bookId).flatMap((unit) => unit.terms)
export const subjectQuestions = (subject, bookId = null) => subjectUnits(subject, bookId).flatMap((unit) => unit.questions)
export const getSubjectUnit = (id) => UNIT_BY_ID.get(id) ?? null
export const getSubjectTerm = (id) => TERM_BY_ID.get(id) ?? null
export const getSubjectQuestion = (id) => QUESTION_BY_ID.get(id) ?? null

/** 単元の見出し（教科書の編・章と単元名）。 */
export const unitHeading = (unit) => [unit.chapter, unit.title].filter(Boolean).join(' ')

/** 単元の問題（段階を指定すればその段階だけ）。 */
export const unitQuestions = (unitId, level = 'all') => (getSubjectUnit(unitId)?.questions ?? [])
  .filter((question) => level === 'all' || question.level === level)

// ── 語句テスト：語句の意味を読んで、その語句を選ぶ。選択肢の説明は、それぞれの語句の意味そのもの。─────────

function hashSeed(value) {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

/** 決まった種（問題ID）で並べ替える。同じ問題はいつ解いても同じ並びになる。 */
export function seededShuffle(list, seed) {
  return [...list]
    .map((item, index) => ({ item, key: hashSeed(`${seed}:${index}:${typeof item === 'string' ? item : JSON.stringify(item)}`) }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item)
}

// 誤答の語句は、同じ単元 → 同じ冊の順に、問題ごとに決まった種で選ぶ（同じ語句はいつも同じ選択肢）。
function distractorTerms(term, count = 3) {
  const unit = getSubjectUnit(term.unitId)
  const sameUnit = (unit?.terms ?? []).filter((other) => other.id !== term.id && other.term !== term.term)
  const sameBook = subjectTerms(term.subject, term.book)
    .filter((other) => other.unitId !== term.unitId && other.term !== term.term)
  const picked = []
  for (const pool of [sameUnit, sameBook]) {
    for (const other of seededShuffle(pool, term.id)) {
      if (picked.length >= count) break
      if (!picked.some((entry) => entry.term === other.term)) picked.push(other)
    }
  }
  return picked
}

/** 語句1つから、語句テストの問題を作る（教材は4択。出題は3択＋わからない）。 */
export function termQuestion(term) {
  if (!term) return null
  const options = [term, ...distractorTerms(term)]
  return Object.freeze({
    id: term.id,
    termId: term.id,
    unitId: term.unitId,
    subject: term.subject,
    text: term.meaning,
    choices: Object.freeze(options.map((option) => option.term)),
    answer: term.term,
    notes: Object.freeze(Object.fromEntries(options.map((option) => [option.term, option.meaning]))),
  })
}

// ── 出題の選び方（全教材共通の出題順・出題バランス） ─────────────────────────────

/** 暗記カードの束。記録（SRS）から全教材共通の出題順に並べ、出題バランスで未学習と復習を混ぜる。 */
export function pickSubjectTerms(ids, { srs = {}, size = 20, freshShare = null, preserveOrder = false, now = Date.now() } = {}) {
  const selected = [...new Set(ids ?? [])].map(getSubjectTerm).filter(Boolean)
  const ordered = preserveOrder
    ? selected
    : mixItemsForStudy(orderForStudy(selected, srs, { purpose: 'study', now }), srs, { freshShare, size, now })
  return size > 0 ? ordered.slice(0, size) : ordered
}

/** 語句テストの問題。問題ごとの結果（contentQuizResults）と語句の記録から出題順を決める。 */
export function pickSubjectTermQuestions(ids, { subject, srs = {}, quizResults = {}, size = 20, freshShare = null, preserveOrder = false, now = Date.now() } = {}) {
  const terms = [...new Set(ids ?? [])].map(getSubjectTerm).filter(Boolean)
  const questions = terms.map(termQuestion)
  if (preserveOrder) return size > 0 ? questions.slice(0, size) : questions
  const ranked = mixRankedForStudy(rankQuestionsForStudy(questions, {
    quizResults,
    quizDomain: SUBJECTS[subject]?.termDomain,
    srs,
    itemIdOf: (question) => question.termId,
    now,
  }), { freshShare, stockOf: questionMixStockOf })
  return pickInStudyOrder(ranked, size > 0 ? size : ranked.length).slice(0, size > 0 ? size : undefined)
}

/** 演習の問題。単元の中は基礎 → 標準 → 入試の順を保ったまま、問題ごとの結果から出題順を決める。 */
export function pickSubjectPractice(questions, { subject, quizResults = {}, size = 10, freshShare = null, mixed = false, now = Date.now() } = {}) {
  const ranked = rankQuestionsForStudy(questions, {
    quizResults,
    quizDomain: SUBJECTS[subject]?.practiceDomain,
    rng: mixed ? Math.random : null,
    now,
  })
  const limit = size > 0 ? size : ranked.length
  return pickInStudyOrder(mixRankedForStudy(ranked, { freshShare, stockOf: questionMixStockOf }), limit)
}

/** 開いた範囲の演習問題（単元・冊・教科全体、段階の指定つき）。 */
export function practicePool({ subject, unitId = null, bookId = null, level = 'all', ids = null } = {}) {
  if (Array.isArray(ids) && ids.length) return ids.map(getSubjectQuestion).filter(Boolean)
  const base = unitId ? unitQuestions(unitId) : subjectQuestions(subject, bookId)
  return base.filter((question) => level === 'all' || question.level === level)
}

export const PRACTICE_LEVEL_ORDER = PRACTICE_LEVEL_IDS
