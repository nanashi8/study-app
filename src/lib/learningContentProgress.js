import { ALL_WORDS, ETYMOLOGY_PACKS } from '../data/vocab.js'
import { PHRASES } from '../data/phrases.js'
import { GRAMMAR_PRACTICE } from '../data/grammar.js'
import { LISTENING_ITEMS } from '../data/listening.js'
import { DICTATION_ITEMS } from '../data/dictation.js'
import { ALL_PASSAGES } from '../data/passages.js'
import { WRITING_EXERCISES } from '../data/writing.js'
import { KOTEN_WORDS } from '../data/koten.js'
import { KOTEN_GRAMMAR } from '../data/koten-grammar.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../data/koten-grammar-questions.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_QUESTIONS } from '../data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../data/koten-interpretations.js'
import { KANBUN_VOCAB } from '../data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES } from '../data/kanbun-kundoku.js'
import { PUBLIC_DOMAIN_LITERATURE } from '../data/public-domain-literature.js'
import { MATH_PROBLEMS } from '../data/math.js'
import {
  summarizeCompletionItems,
  summarizeQuizItems,
  summarizeSrsItems,
} from './contentProgress.js'
import { summarizeVocabularySrsItems } from './vocabScheduler.js'

const MATH_ITEMS = Object.freeze(Object.values(MATH_PROBLEMS).flat())

const localDayIndexAt = (timestamp = Date.now()) => {
  const date = new Date(timestamp)
  return Math.floor((timestamp - date.getTimezoneOffset() * 60000) / 86400000)
}

// quiz は「テストの母数」。1項目に複数問ある教材では questions と domain を渡し、
// 暗記は項目単位・テストは出題単位という別々の数え方で表示する。
const srsContent = (id, group, label, unit, screen, items, store, quiz = {}) => Object.freeze({
  id,
  group,
  label,
  unit,
  quizUnit: quiz.unit ?? '問',
  screen,
  kind: 'srs',
  items,
  store,
  quizItems: quiz.questions ?? null,
  quizDomain: quiz.domain ?? null,
  hasQuiz: quiz.enabled !== false,
})

const completionContent = (
  id,
  group,
  label,
  unit,
  screen,
  items,
  completedIds,
  quizDomain = id,
) => Object.freeze({
  id,
  group,
  label,
  unit,
  quizUnit: unit,
  screen,
  kind: 'completion',
  items,
  completedIds,
  quizItems: null,
  quizDomain,
  hasQuiz: true,
})

export const LEARNING_CONTENT_GROUPS = Object.freeze([
  { id: 'english', label: '英語' },
  { id: 'classics', label: '古典' },
  { id: 'kanbun', label: '漢文' },
  { id: 'other', label: '名作・数学' },
])

// learner-facing の全教材母集団。辞書・診断・保存リスト・設定は教材ではないため除く。
export const LEARNING_CONTENTS = Object.freeze([
  srsContent('vocab', 'english', '英単語', '語', 'vocabLevels', ALL_WORDS, 'srs'),
  srsContent('usage', 'english', '熟語・構文', '項目', 'phrases', PHRASES, 'srs'),
  srsContent('grammar', 'english', '英文法', '問', 'grammar', GRAMMAR_PRACTICE, 'srs'),
  srsContent('listening', 'english', 'リスニング', '問', 'listening', LISTENING_ITEMS, 'srs'),
  srsContent('dictation', 'english', 'ディクテーション', '問', 'dictation', DICTATION_ITEMS, 'srs'),
  // 語源は手動確認済みカードを1件とし、単語・熟語と同じように
  // 語根そのものを暗記・テストする。記録は語源専用SRSへ入る。
  srsContent('etymology', 'english', '語源', 'カード', 'roots', ETYMOLOGY_PACKS, 'etymologySrs'),
  completionContent(
    'reading',
    'english',
    '英語長文',
    '本',
    'readingList',
    ALL_PASSAGES,
    (state) => state.readingsDone,
  ),
  completionContent(
    'writing',
    'english',
    '英作文',
    '題',
    'writing',
    WRITING_EXERCISES,
    (state) => Object.entries(state.writingProgress ?? {}).flatMap(([id, entry]) => (
      (entry?.completed ?? 0) > 0 ? [id] : []
    )),
  ),
  srsContent('koten-vocab', 'classics', '古典単語', '語', 'kotenList', KOTEN_WORDS, 'kotenSrs'),
  srsContent(
    'koten-grammar', 'classics', '古典文法', '項目', 'kotenGrammar', KOTEN_GRAMMAR, 'kotenGrammarSrs',
    { questions: KOTEN_GRAMMAR_QUESTIONS, domain: 'koten-grammar' },
  ),
  srsContent(
    'koten-culture', 'classics', '古典常識', 'テーマ', 'kotenCulture', KOTEN_CULTURE, 'kotenCultureSrs',
    { questions: KOTEN_CULTURE_QUESTIONS, domain: 'koten-culture' },
  ),
  srsContent('koten-reading', 'classics', '古典短文', '問', 'kotenInterpretationList', KOTEN_INTERPRETATIONS, 'kotenInterpretationSrs'),
  srsContent('kanbun-vocab', 'kanbun', '漢語', '語', 'kanbunCatalog', KANBUN_VOCAB, 'kanbunVocabSrs'),
  srsContent('kanbun-grammar', 'kanbun', '漢文法', '項目', 'kanbunCatalog', KANBUN_GRAMMAR, 'kanbunGrammarSrs'),
  srsContent('kanbun-culture', 'kanbun', '漢文常識', '項目', 'kanbunCatalog', KANBUN_CULTURE, 'kanbunCultureSrs'),
  srsContent('kanbun-kundoku', 'kanbun', '返り点・訓読', '問', 'kanbunKundoku', KANBUN_KUNDOKU_EXERCISES, 'kanbunKundokuSrs'),
  completionContent(
    'literature',
    'other',
    '名作に親しむ',
    '作品',
    'literatureLibrary',
    PUBLIC_DOMAIN_LITERATURE,
    (state) => state.readingsDone,
  ),
  completionContent(
    'math',
    'other',
    '数学',
    '問',
    'mathMap',
    MATH_ITEMS,
    (state) => state.mathDone,
  ),
])

export function buildLearningContentProgress(state = {}) {
  const today = localDayIndexAt()
  return LEARNING_CONTENTS.map((content) => {
    const base = content.kind === 'srs'
      ? content.id === 'vocab'
        ? summarizeVocabularySrsItems(content.items, state[content.store])
        : summarizeSrsItems(content.items, state[content.store])
      : summarizeCompletionItems({
          items: content.items,
          completedIds: content.completedIds(state) ?? [],
          quizResults: state.contentQuizResults,
          quizDomain: content.quizDomain,
        })
    // 出題が項目数と違う教材は、テストだけ出題単位で数え直す。
    const questionQuiz = content.quizItems
      ? summarizeQuizItems({
          items: content.quizItems,
          quizResults: state.contentQuizResults,
          quizDomain: content.quizDomain,
        })
      : null
    const progress = !content.hasQuiz
      ? {
          ...base,
          quiz: { correct: 0, incorrect: 0, unanswered: 0 },
          quizTotal: 0,
        }
      : questionQuiz
        ? { ...base, quiz: questionQuiz.counts, quizTotal: questionQuiz.total }
        : { ...base, quizTotal: base.total }
    const due = content.kind === 'srs'
      ? content.id === 'vocab'
        ? base.due
        : content.items.reduce((count, item) => (
            state[content.store]?.[item.id]?.due <= today
              ? count + 1
              : count
          ), 0)
      : 0
    return { ...content, progress, due }
  })
}

export function learningContentProgressById(state = {}) {
  return Object.fromEntries(
    buildLearningContentProgress(state).map((content) => [content.id, content]),
  )
}
