#!/usr/bin/env node
// データ整合性ゲート（npm run check / build前に自動実行）。
// 全単語・熟語・長文が「既存機能を満たす必須項目」を備えるか検証し、
// 1件でも不備があれば exit 1 でビルドを止める。データ生成ミスを二度と通さない。
import {
  ALL_WORDS,
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FIELD_TO_DOMAIN,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SOURCE_META,
  ETYMOLOGY_SUMMARY,
  ROOTS,
  VOCAB_FIELD_GROUPS,
  VOCAB_FIELDS,
  VOCAB_POS,
  getWord,
  vocabFieldFor,
  wordsByField,
  wordsByPos,
} from '../src/data/vocab.js'
import { PHRASES, getPhrase } from '../src/data/phrases.js'
import {
  LONG_SENTENCE_TRANSLATIONS,
  LONG_SENTENCE_CORE_WORD_LIMIT,
  LONG_SENTENCE_MODIFIER_WORD_LIMIT,
  LONG_SENTENCE_WORD_THRESHOLD,
  englishWordCount,
  isLongSyntaxSentence,
  longSentenceTranslationFor,
} from '../src/data/long-sentence-translations.js'
import { EXAM_PHRASES } from '../src/data/phrases-exam.js'
import { CURRICULUM_IDIOMS } from '../src/data/phrases-bank.js'
import {
  PHRASE_LEVEL_TARGETS,
  PHRASE_TARGET_TOTALS,
} from '../src/data/phrase-curriculum.js'
import {
  EXAM_USAGE_GUIDES,
  EXAM_WORDS,
} from '../src/data/exam-lexicon.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  READING_PHRASE_EXPLANATIONS,
  READING_PHRASE_OPEN_QUESTIONS,
} from '../src/data/reading-phrase-explanations.js'
import {
  READING_MANUAL_BLOCK_FINGERPRINTS,
  READING_MANUAL_REVIEW_LEDGER,
} from '../src/data/reading-phrase-review-ledger.js'
import {
  READING_STUDY,
  READING_WORD_COUNT_TARGETS,
  getReadingWords,
  passageWordCount,
} from '../src/data/reading-study.js'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import { READING_GRAMMAR_EXPECTATIONS } from '../src/data/reading-grammar-expectations.js'
import {
  READING_CORE_PHRASE_WORD_LIMIT,
  READING_MODIFIER_PHRASE_WORD_LIMIT,
  analyzeReadingSentence,
} from '../src/lib/reading-grammar.js'
import {
  READING_QUESTION_COUNTS,
  getReadingQuestions,
} from '../src/data/reading-questions.js'
import {
  GRAMMAR,
  GRAMMAR_LEVEL_TARGETS,
  GRAMMAR_TOPIC_MINIMUM,
  GRAMMAR_TOTAL_TARGET,
  grammarChoiceGuidanceFor,
  grammarByTopic,
} from '../src/data/grammar.js'
import { GRAMMAR_LESSONS } from '../src/data/grammar-lessons.js'
import { EXAM_GRAMMAR_LESSONS } from '../src/data/grammar-lessons-exam.js'
import {
  GRAMMAR_EXAM_PATTERN_COUNT,
  GRAMMAR_EXAM_PATTERN_FAMILIES,
  GRAMMAR_EXAM_PATTERNS,
  GRAMMAR_EXAM_QUESTION_COUNT,
} from '../src/data/grammar-exam-patterns.js'
import { PHONETIC_OVERRIDES } from '../src/data/phonetic-overrides.js'
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
  KOTEN_GRAMMAR_FOUNDATION_QUESTIONS,
  KOTEN_GRAMMAR_LEVELS,
  KOTEN_GRAMMAR_QUESTIONS,
  KOTEN_GRAMMAR_QUESTION_FORMATS,
} from '../src/data/koten-grammar-questions.js'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_CATEGORIES,
  KOTEN_CULTURE_CONTEXT_QUESTIONS,
  KOTEN_CULTURE_FOUNDATION_QUESTIONS,
  KOTEN_CULTURE_LEVELS,
  KOTEN_CULTURE_QUESTIONS,
  KOTEN_CULTURE_QUESTION_FORMATS,
  getKotenCulture,
} from '../src/data/koten-culture.js'
import {
  KOTEN_INTERPRETATIONS,
  KOTEN_INTERPRETATION_FOCUS,
  KOTEN_INTERPRETATION_LEVELS,
} from '../src/data/koten-interpretations.js'
import {
  PUBLIC_DOMAIN_LITERATURE,
  literatureWordCount,
} from '../src/data/public-domain-literature.js'
import {
  getLiteratureReadingGuide,
  getLiteratureReadingQuestions,
} from '../src/data/literature-reading.js'
import { buildLiteratureNarration } from '../src/lib/literature.js'
import { buildReadingRoleAnnotation } from '../src/lib/reading-role-annotations.js'
import { japanesePhraseSpeechText } from '../src/lib/phrase-speech.js'
import {
  WRITING_EXERCISES,
  WRITING_GRAMMAR,
} from '../src/data/writing.js'
import { hasBalancedParentheses } from '../src/data/compact.js'

const LEVELS = new Set(['5', '4', '3', 'pre2', '2', 'pre1', '1'])
const READING_LEVELS = new Set(['5', '4', '3', 'pre2', 'pre2plus', '2', 'pre1', '1'])
const POS = new Set(['動', '名', '形', '副', '前', '接', '代'])
const ETYMOLOGY_KINDS = new Set(['prefix', 'root', 'suffix', 'stem'])
const ETYMOLOGY_FORMATIONS = new Set(Object.keys(ETYMOLOGY_FORMATION_META))
const ETYMOLOGY_SOURCES = new Set(Object.keys(ETYMOLOGY_SOURCE_META))
const ETYMOLOGY_DOMAINS = new Set(Object.keys(ETYMOLOGY_DOMAIN_META))
const ROOT_IDS = new Set(ROOTS.map((r) => r.id))
const errors = []
const ids = new Set()

if (ROOT_IDS.size !== ROOTS.length) errors.push('語根idに重複あり')

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
  const referenceRoots = w.referenceRoots ?? []
  if (new Set(referenceRoots).size !== referenceRoots.length) {
    errors.push(`${at}: 補助語根に重複あり`)
  }
  for (const rootId of referenceRoots) {
    if (!ROOT_IDS.has(rootId)) errors.push(`${at}: 補助語根の参照先が不明 (${rootId})`)
  }
}

// ── 全語源濃縮：全語が正確に1経路へ入り、パックは既存SRSで扱えるか ──
const etymologyModes = new Set(Object.keys(ETYMOLOGY_MODE_META))
const etymologyPackIds = new Set()
const compressedIds = []
for (const pack of ETYMOLOGY_PACKS) {
  if (!pack.id) errors.push('語源濃縮パック: id 無し')
  else if (etymologyPackIds.has(pack.id)) errors.push(`語源濃縮パックid重複: ${pack.id}`)
  etymologyPackIds.add(pack.id)
  if (!etymologyModes.has(pack.mode)) {
    errors.push(`語源濃縮パック ${pack.id}: mode が不正 (${pack.mode})`)
  }
  if (!pack.coverageIds?.length) errors.push(`語源濃縮パック ${pack.id}: 対象語が空`)
  if (!pack.studyIds?.length) errors.push(`語源濃縮パック ${pack.id}: 学習カードが空`)
  if ((pack.studyIds?.length ?? 0) > 8) {
    errors.push(`語源濃縮パック ${pack.id}: 一度の学習が8語超 (${pack.studyIds.length})`)
  }
  if (new Set(pack.studyIds ?? []).size !== (pack.studyIds?.length ?? 0)) {
    errors.push(`語源濃縮パック ${pack.id}: 学習カードに重複`)
  }
  if (pack.mode === 'origin') {
    if (!pack.caution?.includes('同じ語根')) {
      errors.push(`語源濃縮パック ${pack.id}: 非同根である注意書き無し`)
    }
    if (!pack.caution?.includes('共通点')) {
      errors.push(`語源濃縮パック ${pack.id}: 束の共通軸説明無し`)
    }
    if (!ETYMOLOGY_FORMATIONS.has(pack.formationKey)) {
      errors.push(`語源濃縮パック ${pack.id}: formationKey が不正 (${pack.formationKey})`)
    }
    if (!ETYMOLOGY_SOURCES.has(pack.sourceKey)) {
      errors.push(`語源濃縮パック ${pack.id}: sourceKey が不正 (${pack.sourceKey})`)
    }
    if (!ETYMOLOGY_DOMAINS.has(pack.domainKey)) {
      errors.push(`語源濃縮パック ${pack.id}: domainKey が不正 (${pack.domainKey})`)
    }
    if (pack.domainKey === 'core' && pack.wordClasses?.length !== 1) {
      errors.push(`語源濃縮パック ${pack.id}: 基礎・日常の品詞群が混在`)
    }
  }
  for (const id of [...(pack.coverageIds ?? []), ...(pack.studyIds ?? [])]) {
    if (!ids.has(id)) errors.push(`語源濃縮パック ${pack.id}: 不明な単語id (${id})`)
  }
  for (const id of pack.coverageIds ?? []) {
    compressedIds.push(id)
    const word = getWord(id)
    if (word?.compression?.packId !== pack.id) {
      errors.push(`単語 ${id}: 濃縮パックの逆参照が不一致 (${word?.compression?.packId} != ${pack.id})`)
    }
    if (word?.compression?.mode !== pack.mode) {
      errors.push(`単語 ${id}: 濃縮modeがパックと不一致`)
    }
    if (pack.mode === 'origin') {
      if (word?.compression?.formationKey !== pack.formationKey) {
        errors.push(`単語 ${id}: 形成法が由来パックと不一致`)
      }
      if (word?.compression?.sourceKey !== pack.sourceKey) {
        errors.push(`単語 ${id}: 出発言語が由来パックと不一致`)
      }
      if (word?.compression?.domainKey !== pack.domainKey) {
        errors.push(`単語 ${id}: 意味領域が由来パックと不一致`)
      }
      if ((ETYMOLOGY_FIELD_TO_DOMAIN[word?.field] ?? 'other') !== pack.domainKey) {
        errors.push(`単語 ${id}: 分野 ${word?.field} が由来パックの意味領域と不一致`)
      }
    }
  }
}
if (compressedIds.length !== ALL_WORDS.length) {
  errors.push(`語源濃縮の合計が全語彙数と不一致 (${compressedIds.length}/${ALL_WORDS.length})`)
}
if (new Set(compressedIds).size !== ALL_WORDS.length) {
  errors.push(`語源濃縮に重複または未収録あり (一意${new Set(compressedIds).size}/${ALL_WORDS.length})`)
}
if (
  ETYMOLOGY_SUMMARY.total !== ALL_WORDS.length ||
  ETYMOLOGY_SUMMARY.covered !== ALL_WORDS.length
) {
  errors.push(
    `語源濃縮サマリー不一致 (${ETYMOLOGY_SUMMARY.covered}/${ETYMOLOGY_SUMMARY.total}, 全語${ALL_WORDS.length})`,
  )
}

// ── 全語彙の分類学習：10分野へ漏れなく一意にまとまっているか ──
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

if (VOCAB_FIELD_GROUPS.length !== 10 || VOCAB_FIELDS.length !== 10) {
  errors.push(`学習者向け英単語分野は10分野であること (${VOCAB_FIELD_GROUPS.length}/${VOCAB_FIELDS.length})`)
}
const configuredSourceFields = VOCAB_FIELD_GROUPS.flatMap((group) => group.sourceFields)
const configuredSourceFieldSet = new Set(configuredSourceFields)
const actualSourceFieldSet = new Set(ALL_WORDS.map((word) => word.field))
if (configuredSourceFieldSet.size !== configuredSourceFields.length) {
  errors.push('学習者向け英単語分野の元分類に重複あり')
}
for (const field of actualSourceFieldSet) {
  if (!configuredSourceFieldSet.has(field)) errors.push(`元分類「${field}」が10分野へ未割当`)
}
for (const field of configuredSourceFieldSet) {
  if (!actualSourceFieldSet.has(field)) errors.push(`10分野の元分類「${field}」に単語がない`)
}
for (const word of ALL_WORDS) {
  if (!VOCAB_FIELDS.includes(vocabFieldFor(word))) {
    errors.push(`${word.id}: 学習者向け英単語分野が不明 (${word.field})`)
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

// ── 高校・入試・英検辞書補充：新規語、使い分け、推奨表現の接続 ──
if (EXAM_WORDS.length < 139) {
  errors.push(`入試辞書の新規見出し語が不足 (${EXAM_WORDS.length}/139)`)
}
for (const added of EXAM_WORDS) {
  const word = getWord(added.id)
  if (!word) errors.push(`入試辞書 ${added.id}: 共通辞書に統合されていない`)
  else {
    if (!word.usage?.trim()) errors.push(`入試辞書 ${added.id}: 語法・よく使う形が無い`)
    if (!word.phonetic?.trim()) errors.push(`入試辞書 ${added.id}: 発音記号が無い`)
  }
}

const usageGuideIds = new Set()
const usageGuideWordIds = new Set()
for (const guide of EXAM_USAGE_GUIDES) {
  if (!guide.id || usageGuideIds.has(guide.id)) {
    errors.push(`使い分けガイド id が無いか重複 (${guide.id ?? '?'})`)
  }
  usageGuideIds.add(guide.id)
  if (!guide.title?.trim() || !guide.summary?.trim() || (guide.choices?.length ?? 0) < 2) {
    errors.push(`使い分けガイド ${guide.id}: title/summary/choices が不足`)
  }
  for (const wordId of guide.wordIds ?? []) {
    usageGuideWordIds.add(wordId)
    const word = getWord(wordId)
    if (!word) {
      errors.push(`使い分けガイド ${guide.id}: 見出し語 ${wordId} が辞書に無い`)
    } else if (!(word.usageGuides ?? []).some((item) => item.id === guide.id)) {
      errors.push(`使い分けガイド ${guide.id}: ${wordId} の詳細画面へ逆参照されない`)
    }
  }
  for (const [index, choice] of (guide.choices ?? []).entries()) {
    if (!choice?.term || !choice?.rule || !choice?.example || !choice?.ja) {
      errors.push(`使い分けガイド ${guide.id}: choices[${index}] の必須項目不足`)
    }
  }
  if (guide.preferred && (
    !guide.preferred.avoid ||
    !guide.preferred.use ||
    !guide.preferred.reason
  )) {
    errors.push(`使い分けガイド ${guide.id}: 推奨表現の avoid/use/reason 不足`)
  }
}
if (EXAM_USAGE_GUIDES.length < 43 || usageGuideWordIds.size < 93) {
  errors.push(`使い分けガイドの網羅性不足 (${EXAM_USAGE_GUIDES.length}ガイド/${usageGuideWordIds.size}語)`)
}

// ── 熟語・構文 ──
const phraseIds = new Set()
const phraseHeads = new Set()
const longSentenceTargetIds = new Set()
let longSentenceTranslationCount = 0
let longSentenceTranslationStepCount = 0
let longSentenceMeaningStepCount = 0
for (const p of PHRASES) {
  const at = p.id || p.phrase
  if (!p.id || phraseIds.has(p.id)) errors.push(`熟語/構文 id が無いか重複 (${at})`)
  phraseIds.add(p.id)
  const head = p.phrase?.toLowerCase()
  if (head && phraseHeads.has(head)) errors.push(`熟語/構文の見出し重複 (${p.phrase})`)
  if (head) phraseHeads.add(head)
  if (!p.phrase || !p.meaning || !p.meanings?.length || !p.example?.en || !p.example?.ja) {
    errors.push(`熟語/構文 ${at}: 必須項目(phrase/meaning/meanings/example) 不足`)
  }
  if (!LEVELS.has(p.level) || !['idiom', 'syntax'].includes(p.kind)) {
    errors.push(`熟語/構文 ${at}: 級または種別が不正 (${p.level}/${p.kind})`)
  }
  if (!p.origin?.trim() || !p.note?.trim()) {
    errors.push(`熟語/構文 ${at}: 成り立ち・語法注意が不足`)
  }
  if (isLongSyntaxSentence(p)) {
    longSentenceTargetIds.add(p.id)
    const translation = longSentenceTranslationFor(p)
    if (!translation) {
      errors.push(`長い一文 ${at}: ${LONG_SENTENCE_WORD_THRESHOLD}語以上だがフレーズ直訳が無い`)
    } else {
      longSentenceTranslationCount += 1
      longSentenceTranslationStepCount += translation.steps?.length ?? 0
      longSentenceMeaningStepCount += translation.meaningSteps?.length ?? 0
      const rebuiltEnglish = translation.steps?.map((part) => part.en).join(' ')
      if (rebuiltEnglish?.replace(/\s+/g, ' ').trim() !== p.example.en.replace(/\s+/g, ' ').trim()) {
        errors.push(`長い一文 ${at}: フレーズ連結で元英文を復元できない`)
      }
      if (
        !Array.isArray(translation.steps) ||
        translation.steps.length < 2 ||
        translation.steps.some((part) => {
          const wordLimit = part.role === 'M'
            ? LONG_SENTENCE_MODIFIER_WORD_LIMIT
            : LONG_SENTENCE_CORE_WORD_LIMIT
          return !part.en?.trim() ||
            englishWordCount(part.en) > wordLimit ||
            !/[ぁ-んァ-ヶ一-龠]/.test(part.ja ?? '') ||
            !['LINK', 'S', 'V', 'O', 'O1', 'O2', 'C', 'M'].includes(part.role) ||
            !Array.isArray(part.roles) ||
            part.roles.length < 1 ||
            !Array.isArray(part.roleParts) ||
            part.roleParts.length < 1 ||
            part.roleParts.some((rolePart) => !part.roles.includes(rolePart.role)) ||
            (part.roleHeading?.length ?? 0) < 1 ||
            (part.roleNote?.length ?? 0) < 30 ||
            (part.note?.length ?? 0) < 7 ||
            part.spokenEn !== part.en ||
            !['confirmed', 'reviewed', 'review-needed'].includes(part.status)
        }) ||
        (translation.tip?.length ?? 0) < 30
      ) {
        errors.push(`長い一文 ${at}: 直訳フレーズまたは項目別解説が不足`)
      }
      const rebuiltMeaningEnglish = translation.meaningSteps
        ?.map((part) => part.spokenEn ?? part.en)
        .join(' ')
      if (
        !Array.isArray(translation.meaningSteps) ||
        translation.meaningSteps.length < 2 ||
        rebuiltMeaningEnglish?.replace(/\s+/g, ' ').trim() !==
          p.example.en.replace(/\s+/g, ' ').trim() ||
        translation.meaningSteps.some((part) =>
          !part.en?.trim() ||
          !part.ja?.trim() ||
          englishWordCount(part.en) > 8 ||
          part.spokenEn !== part.en ||
          !Array.isArray(part.roles) ||
          part.roles.length < 1 ||
          !Array.isArray(part.roleParts) ||
          part.roleParts.length < 1 ||
          part.status !== 'confirmed' ||
          part.reviewState !== 'audit-confirmed')
      ) {
        errors.push(`長い一文 ${at}: 意味・発音フレーズまたは対応する日本語が不正`)
      }
    }
  }
}

for (const id of Object.keys(LONG_SENTENCE_TRANSLATIONS)) {
  if (!longSentenceTargetIds.has(id)) {
    errors.push(`長い一文 ${id}: 対象外または削除済みの直訳ガイドが残っている`)
  }
}
if (
  longSentenceTargetIds.size !== 33 ||
  longSentenceTranslationCount !== longSentenceTargetIds.size ||
  longSentenceMeaningStepCount !== 104 ||
  Object.keys(LONG_SENTENCE_TRANSLATIONS).length !== longSentenceTargetIds.size
) {
  errors.push(
    `長い一文フレーズ監査: ${longSentenceTranslationCount}/${longSentenceTargetIds.size}文・` +
    `${longSentenceMeaningStepCount}意味フレーズ・${longSentenceTranslationStepCount}内部SVOCM単位` +
    '（現行の全対象は33文・104意味フレーズ）',
  )
}

const phraseKindTotals = Object.fromEntries(
  ['idiom', 'syntax'].map((kind) => [
    kind,
    PHRASES.filter((phrase) => phrase.kind === kind).length,
  ]),
)
if (
  EXAM_PHRASES.length < 144 ||
  CURRICULUM_IDIOMS.length < 978 ||
  PHRASES.length < PHRASE_TARGET_TOTALS.all ||
  phraseKindTotals.idiom < PHRASE_TARGET_TOTALS.idiom ||
  phraseKindTotals.syntax < PHRASE_TARGET_TOTALS.syntax
) {
  errors.push(
    `熟語・構文カリキュラム不足 ` +
      `(全${PHRASES.length}/${PHRASE_TARGET_TOTALS.all}, ` +
      `熟語${phraseKindTotals.idiom}/${PHRASE_TARGET_TOTALS.idiom}, ` +
      `構文${phraseKindTotals.syntax}/${PHRASE_TARGET_TOTALS.syntax})`,
  )
}

for (const phrase of CURRICULUM_IDIOMS) {
  if (!phrase.curriculumSupplement || !phrase.category) {
    errors.push(`熟語カリキュラム ${phrase.id}: 補充元または分類が不足`)
  }
}

for (const [level, target] of Object.entries(PHRASE_LEVEL_TARGETS)) {
  for (const kind of ['idiom', 'syntax']) {
    const count = PHRASES.filter(
      (phrase) => phrase.level === level && phrase.kind === kind,
    ).length
    if (count < target[kind]) {
      errors.push(`熟語/構文 ${level}級 ${kind}: 項目不足 (${count}/${target[kind]})`)
    }
  }
}

const phraseCollisionWordIds = new Set(ALL_WORDS.map((word) => word.id))
const phraseCollisionGrammarIds = new Set(GRAMMAR.map((item) => item.id))
for (const id of phraseIds) {
  if (phraseCollisionWordIds.has(id) || phraseCollisionGrammarIds.has(id)) {
    errors.push(`熟語/構文 id が単語・文法SRSと衝突 (${id})`)
  }
}

// ── 高校文法解説：全追加単元が同じ論点の既存クイズへ接続するか ──
const grammarLessonIds = new Set()
for (const lesson of GRAMMAR_LESSONS) {
  if (!lesson.id || grammarLessonIds.has(lesson.id)) {
    errors.push(`文法解説 id が無いか重複 (${lesson.id ?? '?'})`)
  }
  grammarLessonIds.add(lesson.id)
}
if (EXAM_GRAMMAR_LESSONS.length < 35) {
  errors.push(`高校文法解説の追加単元が不足 (${EXAM_GRAMMAR_LESSONS.length}/35)`)
}
for (const lesson of EXAM_GRAMMAR_LESSONS) {
  if (!lesson.summary?.trim() || !lesson.form?.trim() || (lesson.points?.length ?? 0) < 2) {
    errors.push(`高校文法解説 ${lesson.id}: summary/form/points が不足`)
  }
  if ((lesson.examples?.length ?? 0) < 2) {
    errors.push(`高校文法解説 ${lesson.id}: 例文が2文未満`)
  }
  if (!grammarByTopic(lesson.level, lesson.topic).length) {
    errors.push(`高校文法解説 ${lesson.id}: ${lesson.level}/${lesson.topic} のクイズ接続先が無い`)
  }
  for (const [index, item] of (lesson.preferred ?? []).entries()) {
    if (!item?.avoid || !item?.use || !item?.reason) {
      errors.push(`高校文法解説 ${lesson.id}: preferred[${index}] の必須項目不足`)
    }
  }
}

// ── 長文：まとめ語彙・gloss の id が辞書解決できるか ──
const readingPassageIds = new Set()
const readingThemes = new Set()
const readingEssentialWordMinimums = {
  5: 10,
  4: 15,
  3: 20,
  pre2: 20,
  pre2plus: 20,
  2: 24,
  pre1: 25,
  1: 30,
}
const readingAnswerPositionCounts = [0, 0, 0, 0]
let readingTranslationSentenceCount = 0
let readingTranslationBlockCount = 0
let readingTranslationSegmentCount = 0
let readingTranslationSequenceCount = 0
let readingPhrasePairCount = 0
let readingPhraseSequenceCount = 0
let readingMeaningPhraseCount = 0
let readingMeaningMultiRoleCount = 0
let readingReviewedPhraseSentenceCount = 0
let readingManualReviewSentenceCount = 0
const readingPhraseWords = (text) =>
  (text.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).map((word) => word.toLowerCase())
for (const ps of PASSAGES) {
  if (!ps.id || readingPassageIds.has(ps.id)) errors.push(`長文 ${ps.id ?? '(id無し)'}: id 無し/重複`)
  readingPassageIds.add(ps.id)
  if (!READING_LEVELS.has(ps.level)) errors.push(`長文 ${ps.id}: level が不正 (${ps.level})`)
  if (!ps.theme || readingThemes.has(ps.theme)) {
    errors.push(`長文 ${ps.id}: theme が無い、または他教材と重複 (${ps.theme ?? '未設定'})`)
  }
  readingThemes.add(ps.theme)
  if (!Array.isArray(ps.examFocus) || ps.examFocus.length < 3) {
    errors.push(`長文 ${ps.id}: 入試・英検の読解ポイントが3件未満`)
  }
  if (ps.vocab.length < (readingEssentialWordMinimums[ps.level] ?? 10)) {
    errors.push(
      `長文 ${ps.id}: テーマ必須語彙が${ps.vocab.length}語` +
      `（最低${readingEssentialWordMinimums[ps.level] ?? 10}語）`,
    )
  }
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
    readingTranslationSentenceCount += 1
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
    const analysis = analyzeReadingSentence(s)
    readingPhraseSequenceCount += analysis.phraseSequence.length
    readingMeaningPhraseCount += analysis.meaningPhraseSequence.length
    readingMeaningMultiRoleCount += analysis.meaningPhraseSequence
      .filter((phrase) => phrase.roles.length > 1)
      .length
    if (
      JSON.stringify(
        analysis.meaningPhraseSequence.flatMap((phrase) =>
          readingPhraseWords(phrase.spokenEn ?? phrase.en)),
      ) !== JSON.stringify(readingPhraseWords(s.en)) ||
      analysis.meaningPhraseSequence.some((phrase) =>
        !phrase.en?.trim() ||
        !phrase.ja?.trim() ||
        !(phrase.explanation ?? phrase.grammarNote)?.trim() ||
        phrase.spokenEn !== phrase.en ||
        readingPhraseWords(phrase.en).length > 8 ||
        !Array.isArray(phrase.roles) ||
        phrase.roles.length < 1 ||
        !Array.isArray(phrase.roleParts) ||
        phrase.roleParts.length < 1 ||
        phrase.status !== 'confirmed' ||
        phrase.reviewState !== 'audit-confirmed')
    ) {
      errors.push(
        `長文 ${ps.id}: 第${sentenceIndex + 1}文の意味・発音フレーズまたは対応する日本語が不正`,
      )
    }
    if (analysis.phraseSequence.length > 0 && analysis.phraseSequence.every(
      (phrase) => phrase.reviewEvidenceId === s.reviewId,
    )) {
      readingManualReviewSentenceCount += 1
    } else {
      errors.push(
        `長文 ${ps.id}: 第${sentenceIndex + 1}文の手動レビューfingerprintが現行表示と一致しない`,
      )
    }
    if (analysis.phraseExplanationGuide) {
      readingReviewedPhraseSentenceCount += 1
      const reviewed = analysis.phraseExplanationGuide
      const phraseAt = `長文 ${ps.id}: 第${sentenceIndex + 1}文の確認済みフレーズ列`
      if (
        JSON.stringify(reviewed.phrases.flatMap((phrase) => readingPhraseWords(phrase.en))) !==
        JSON.stringify(readingPhraseWords(s.en))
      ) {
        errors.push(`${phraseAt}: 連結しても原文の語順を復元できない`)
      }
      const visibleMeaning = (phrase) => ({
        en: phrase.en,
        roles: phrase.roles,
        ja: phrase.ja,
        displayEn: phrase.displayEn ?? phrase.en,
        spokenEn: phrase.spokenEn ?? phrase.en,
      })
      if (
        JSON.stringify(analysis.meaningPhraseSequence.map(visibleMeaning)) !==
        JSON.stringify(reviewed.phrases.map(visibleMeaning))
      ) errors.push(`${phraseAt}: 全件意味フレーズ出力が回帰例と一致しない`)
      if (reviewed.phrases.some((phrase) =>
        !phrase.en?.trim() ||
        !phrase.ja?.trim() ||
        !phrase.grammar?.trim() ||
        phrase.spokenEn !== phrase.en ||
        !['confirmed', 'reviewed', 'review-needed'].includes(phrase.status)
      )) {
        errors.push(`${phraseAt}: 英語・対応する日本語・解説・確認状態・原文音声のいずれかが不正`)
      }
    }
    const scenario = s.translationScenario
    const translationAt = `長文 ${ps.id}: 第${sentenceIndex + 1}文の語順訳`
    if (!Array.isArray(scenario)) {
      errors.push(`${translationAt}: 監修シナリオが無い`)
    } else if (scenario.length !== analysis.blocks.length) {
      errors.push(
        `${translationAt}: ${scenario.length}ブロック（英文解析は${analysis.blocks.length}ブロック）`,
      )
    } else {
      for (const [blockIndex, block] of analysis.blocks.entries()) {
        readingTranslationBlockCount += 1
        const blockAt = `${translationAt} 第${blockIndex + 1}ブロック`
        if (!Array.isArray(block.jaSegments) || block.jaSegments.length === 0) {
          errors.push(`${blockAt}: 英語順の意味単位が無い`)
          continue
        }
        readingTranslationSegmentCount += block.jaSegments.length
        if (block.jaSegments.length > 1) readingTranslationSequenceCount += 1
        if (
          block.jaSegments.some(
            (segment) =>
              typeof segment !== 'string' ||
              segment.length === 0 ||
              segment !== segment.trim() ||
              !/[ぁ-んァ-ヶ一-龠]/.test(segment) ||
              /[。！？]$|→/.test(segment),
          )
        ) {
          errors.push(`${blockAt}: 意味単位に空欄・自然訳の文末・区切り混入がある`)
        }
        if (block.ja !== block.jaSegments.join('／')) {
          errors.push(`${blockAt}: 表示順が意味単位の順と一致しない`)
        }
        if (block.orderedSpeechJa !== block.jaSegments.join('。')) {
          errors.push(`${blockAt}: 音声順が意味単位の順と一致しない`)
        }
        if (block.jaSource !== 'teaching') errors.push(`${blockAt}: 監修訳が英文解析へ接続されていない`)
        if (!Array.isArray(block.phrasePairs) || block.phrasePairs.length === 0) {
          errors.push(`${blockAt}: 役割別の英日フレーズがない`)
        } else {
          readingPhrasePairCount += block.phrasePairs.length
          if (block.phrasePairs.map((pair) => pair.spokenEn ?? pair.en).join(' ') !== block.en) {
            errors.push(`${blockAt}: 英語フレーズを連結しても元の英文を復元できない`)
          }
          if (block.phrasePairs.some((pair) => {
            const wordCount = (pair.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).length
            const extendedPhrase = pair.roles?.every((role) => ['M', 'LINK'].includes(role))
            const wordLimit = Number.isFinite(pair.wordLimit)
              ? pair.wordLimit
              : extendedPhrase
                ? READING_MODIFIER_PHRASE_WORD_LIMIT
                : READING_CORE_PHRASE_WORD_LIMIT
            return !pair.en?.trim() ||
              !pair.ja?.trim() ||
              wordCount > wordLimit ||
              !Array.isArray(pair.roles) ||
              pair.roles.length !== 1 ||
              !Array.isArray(pair.roleParts) ||
              pair.roleParts.length < 1 ||
              !pair.roleHeading?.trim() ||
              (pair.roleNote?.length ?? 0) < 30
          })) {
            errors.push(`${blockAt}: 空欄・対応ずれ・役割不明・構造単位を超える英日フレーズがある`)
          }
        }
        if (
          block.translationGuide.length < 20 ||
          !/(?:語順|主語|まとまり|節|動詞)/.test(block.translationGuide) ||
          !block.note?.trim()
        ) {
          errors.push(`${blockAt}: 読み方または文法上の注意が不足`)
        }
      }
      const visiblePayload = (phrase) => ({
        en: phrase.en,
        spokenEn: phrase.spokenEn ?? phrase.en,
        displayEn: phrase.displayEn ?? phrase.en,
        role: phrase.role,
        ja: phrase.ja,
        roleHeading: phrase.roleHeading,
        roleNote: phrase.roleNote,
        explanation: phrase.explanation ?? phrase.grammarNote ?? '',
      })
      const blockPhrasePayload = analysis.blocks
        .flatMap((block) => block.phrasePairs)
        .map(visiblePayload)
      const reviewedPhrasePayload = analysis.phraseSequence.map(visiblePayload)
      if (JSON.stringify(blockPhrasePayload) !== JSON.stringify(reviewedPhrasePayload)) {
        errors.push(`${translationAt}: 下段文法ブロックが最終確認済みフレーズ列と一致しない`)
      }
      const visibleMeaningPayload = (phrase) => ({
        en: phrase.en,
        spokenEn: phrase.spokenEn ?? phrase.en,
        displayEn: phrase.displayEn ?? phrase.en,
        roles: phrase.roles,
        ja: phrase.ja,
        explanation: phrase.explanation ?? phrase.grammarNote ?? '',
      })
      const blockMeaningPayload = analysis.blocks
        .flatMap((block) => block.meaningPhrasePairs ?? [])
        .map(visibleMeaningPayload)
      const sentenceMeaningPayload = analysis.meaningPhraseSequence.map(visibleMeaningPayload)
      if (JSON.stringify(blockMeaningPayload) !== JSON.stringify(sentenceMeaningPayload)) {
        errors.push(`${translationAt}: 下段ブロックの意味フレーズが文全体の表示・音声と一致しない`)
      }
    }
    const expectedPattern = expectedPatterns?.[sentenceIndex]
    const actualPattern = analysis.mainPattern
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
    const answerPosition = q.choices?.indexOf(q.answer) ?? -1
    if (answerPosition >= 0) readingAnswerPositionCounts[answerPosition] += 1
  }
  const answerPositions = questions.map((question) => question.choices.indexOf(question.answer))
  if (questions.length > 1 && new Set(answerPositions).size < 2) {
    errors.push(`長文 ${ps.id}: 正解位置が1か所に固定`)
  }
}
for (const level of READING_LEVELS) {
  const count = PASSAGES.filter((passage) => passage.level === level).length
  if (count < 2) {
    errors.push(`長文: 英検${level}級の教材が${count}題（最低2題）`)
  }
}
for (const [position, count] of readingAnswerPositionCounts.entries()) {
  if (count < 10) errors.push(`長文: 正解位置${position + 1}が${count}問（最低10問）`)
}
if (readingTranslationSequenceCount <= readingTranslationBlockCount / 2) {
  errors.push(
    `長文語順訳: 前へ進む意味単位を明示したブロックが${readingTranslationSequenceCount}/` +
    `${readingTranslationBlockCount}件`,
  )
}
if (
  PASSAGES.length !== 24 ||
  readingTranslationSentenceCount !== 567 ||
  readingTranslationBlockCount !== 1546 ||
  readingPhrasePairCount !== 4446 ||
  readingPhraseSequenceCount !== 4446 ||
  readingMeaningPhraseCount !== 3246 ||
  readingMeaningMultiRoleCount !== 1243
) {
  errors.push(
    `長文フレーズ監査: ${PASSAGES.length}長文・${readingTranslationSentenceCount}文・` +
    `${readingTranslationBlockCount}ブロック・${readingMeaningPhraseCount}意味フレーズ` +
    `（複数役割${readingMeaningMultiRoleCount}件）・${readingPhrasePairCount}ブロック内内部SVOCM単位・` +
    `${readingPhraseSequenceCount}文全体内部SVOCM単位` +
    '（現行全件は24長文・567文・1,546ブロック・3,246意味フレーズ・4,446内部SVOCM単位）',
  )
}
if (
  Object.keys(READING_MANUAL_REVIEW_LEDGER).length !== 567 ||
  readingManualReviewSentenceCount !== 567 ||
  PASSAGES.some((passage) =>
    READING_MANUAL_BLOCK_FINGERPRINTS[passage.id]?.length !== passage.sentences.length)
) {
  errors.push(
    `長文の手動レビュー台帳: ${readingManualReviewSentenceCount}/567文照合、` +
    `${Object.keys(READING_MANUAL_REVIEW_LEDGER).length}/567 ID登録、` +
    `${Object.values(READING_MANUAL_BLOCK_FINGERPRINTS).reduce((sum, items) => sum + items.length, 0)}/567 ブロック構造fingerprint`,
  )
}
if (readingReviewedPhraseSentenceCount !== READING_PHRASE_EXPLANATIONS.length) {
  errors.push(
    `長文の確認済みフレーズ列: 長文画面への接続は${readingReviewedPhraseSentenceCount}文` +
    `（正解例は${READING_PHRASE_EXPLANATIONS.length}文）`,
  )
}
if (READING_PHRASE_OPEN_QUESTIONS.some(
  (item) => !item.id || !item.example || !item.proposal || !item.reason,
)) {
  errors.push('長文のフレーズ解説: 未確定パターンの必須項目が不足')
}

// ── 文法：空所・正解・完成文の整合性 ──
const grammarIds = new Set()
const grammarPrompts = new Set()
const grammarSentences = new Set()
let grammarDistractorGuidanceCount = 0
let grammarInvalidChoiceCount = 0
const normalizeGrammarChoice = (text) =>
  (text ?? '').trim().toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ')
const grammarAnswerForms = new Set(GRAMMAR.map((item) => normalizeGrammarChoice(item.answer)))
const vocabularyHeadwordForms = new Set(
  ALL_WORDS.map((word) => normalizeGrammarChoice(word.word)),
)
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
  for (const choice of g.choices?.filter((candidate) => candidate !== g.answer) ?? []) {
    grammarDistractorGuidanceCount += 1
    const guidance = grammarChoiceGuidanceFor(g, choice)
    if (!guidance || !['valid', 'invalid'].includes(guidance.status)) {
      errors.push(`${at}: 誤答「${choice}」の使う場面が未分類`)
      continue
    }
    if (!guidance.summary?.trim()) {
      errors.push(`${at}: 誤答「${choice}」の使い分け説明が空`)
    }
    if (guidance.source === 'unresolved' || guidance.source === 'related-vocabulary') {
      errors.push(`${at}: 誤答「${choice}」が具体的な使い分けガイドに未接続`)
    }
    if (guidance.status === 'valid' && !guidance.example?.en && !guidance.pattern) {
      errors.push(`${at}: 誤答「${choice}」の使用例・型が無い`)
    }
    if (guidance.status === 'invalid') {
      grammarInvalidChoiceCount += 1
      const normalizedChoice = normalizeGrammarChoice(choice)
      if (grammarAnswerForms.has(normalizedChoice)) {
        errors.push(`${at}: 別問題の正答「${choice}」を「使わない形」に分類`)
      }
      if (vocabularyHeadwordForms.has(normalizedChoice)) {
        errors.push(`${at}: 登録語彙「${choice}」を「使わない形」に分類`)
      }
    }
  }
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
if (grammarDistractorGuidanceCount !== GRAMMAR.length * 3) {
  errors.push(
    `文法 誤答使い分けガイド: ${grammarDistractorGuidanceCount}件` +
      `（4択全問なら${GRAMMAR.length * 3}件必要）`,
  )
}
if (grammarInvalidChoiceCount === 0) {
  errors.push('文法 誤答使い分けガイド: 「使わない形」の分類が0件')
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
if (KOTEN_GRAMMAR.length < 70) {
  errors.push(`古典文法: 70項目未満 (${KOTEN_GRAMMAR.length}項目)`)
}
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

const kotenGrammarQuestionIds = new Set()
const kotenGrammarQuestionLevels = new Set(Object.keys(KOTEN_GRAMMAR_LEVELS))
const kotenGrammarQuestionFormats = new Set(Object.keys(KOTEN_GRAMMAR_QUESTION_FORMATS))
if (KOTEN_GRAMMAR_QUESTIONS.length < 120) {
  errors.push(`古典文法問題: 120問未満 (${KOTEN_GRAMMAR_QUESTIONS.length}問)`)
}
for (const item of KOTEN_GRAMMAR_QUESTIONS) {
  const at = `古典文法問題 ${item.id ?? '(id無し)'}`
  if (!item.id || kotenGrammarQuestionIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
  kotenGrammarQuestionIds.add(item.id)
  if (!kotenGrammarCategories.has(item.category)) {
    errors.push(`${at}: category が不正 (${item.category})`)
  }
  if (!kotenGrammarQuestionLevels.has(item.level)) {
    errors.push(`${at}: level が不正 (${item.level})`)
  }
  if (!kotenGrammarQuestionFormats.has(item.format)) {
    errors.push(`${at}: format が不正 (${item.format})`)
  }
  if (!['context', 'foundation'].includes(item.style)) {
    errors.push(`${at}: style が不正 (${item.style})`)
  }
  if (
    !item.source ||
    !item.passage ||
    !item.target ||
    !item.question ||
    !item.explanation
  ) {
    errors.push(`${at}: source/passage/target/question/explanation が不足`)
  }
  if (!Array.isArray(item.choices) || item.choices.length !== 4) {
    errors.push(`${at}: choices は4件必要`)
  } else if (new Set(item.choices).size !== item.choices.length) {
    errors.push(`${at}: choices に重複あり`)
  }
  if (!item.choices?.includes(item.answer)) errors.push(`${at}: answer が choices に無い`)
  if (!Array.isArray(item.grammarIds) || !item.grammarIds.length) {
    errors.push(`${at}: grammarIds が無い`)
  }
  for (const grammarId of item.grammarIds ?? []) {
    if (!getKotenGrammar(grammarId)) errors.push(`${at}: 古典文法 ${grammarId} が存在しない`)
  }
  if (item.grammarIds?.[0] && getKotenGrammar(item.grammarIds[0])?.category !== item.category) {
    errors.push(`${at}: primary grammar と category が不一致`)
  }
}
const foundationGrammarIds = new Set(
  KOTEN_GRAMMAR_FOUNDATION_QUESTIONS.flatMap((item) => item.grammarIds),
)
for (const grammarId of kotenGrammarIds) {
  if (!foundationGrammarIds.has(grammarId)) {
    errors.push(`古典文法 ${grammarId}: 基礎問題が無い`)
  }
}
for (const categoryId of kotenGrammarCategories) {
  if (
    !KOTEN_GRAMMAR_QUESTIONS.some(
      (item) => item.category === categoryId && item.style === 'context',
    )
  ) {
    errors.push(`古典文法 ${categoryId}: 文脈型問題が無い`)
  }
}

// ── 古典常識：テーマ・基礎問題・文脈問題・短文への導線を全件検査 ──
const kotenCultureCategories = new Set(KOTEN_CULTURE_CATEGORIES.map((item) => item.id))
const kotenCultureLevels = new Set(Object.keys(KOTEN_CULTURE_LEVELS))
const kotenCultureFormats = new Set(Object.keys(KOTEN_CULTURE_QUESTION_FORMATS))
const kotenCultureIds = new Set()
const knownInterpretationIds = new Set(KOTEN_INTERPRETATIONS.map((item) => item.id))
if (KOTEN_CULTURE.length < 50) {
  errors.push(`古典常識: 50テーマ未満 (${KOTEN_CULTURE.length}テーマ)`)
}
if (KOTEN_CULTURE_CATEGORIES.length < 6) {
  errors.push(`古典常識: 6分野未満 (${KOTEN_CULTURE_CATEGORIES.length}分野)`)
}
for (const item of KOTEN_CULTURE) {
  const at = `古典常識 ${item.id ?? '(id無し)'}`
  if (!item.id || kotenCultureIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
  kotenCultureIds.add(item.id)
  if (!kotenCultureCategories.has(item.category)) {
    errors.push(`${at}: category が不正 (${item.category})`)
  }
  if (!kotenCultureLevels.has(item.level)) errors.push(`${at}: level が不正 (${item.level})`)
  if (
    !item.title ||
    !item.keyword ||
    !item.prompt ||
    !item.core ||
    !item.detail ||
    !item.examTip ||
    !item.scene?.text ||
    !item.scene?.note
  ) {
    errors.push(`${at}: title/keyword/prompt/core/detail/examTip/scene が不足`)
  }
  if (!Array.isArray(item.relatedInterpretationIds)) {
    errors.push(`${at}: relatedInterpretationIds が配列でない`)
  }
  for (const interpretationId of item.relatedInterpretationIds ?? []) {
    if (!knownInterpretationIds.has(interpretationId)) {
      errors.push(`${at}: 古典短文 ${interpretationId} が存在しない`)
    }
  }
  if (
    !item.exam?.format ||
    !item.exam?.passage ||
    !item.exam?.question ||
    !item.exam?.explanation
  ) {
    errors.push(`${at}: 文脈問題データが不足`)
  }
}

const kotenCultureQuestionIds = new Set()
if (KOTEN_CULTURE_QUESTIONS.length < 100) {
  errors.push(`古典常識問題: 100問未満 (${KOTEN_CULTURE_QUESTIONS.length}問)`)
}
for (const item of KOTEN_CULTURE_QUESTIONS) {
  const at = `古典常識問題 ${item.id ?? '(id無し)'}`
  if (!item.id || kotenCultureQuestionIds.has(item.id)) errors.push(`${at}: id 無し/重複`)
  kotenCultureQuestionIds.add(item.id)
  if (!kotenCultureCategories.has(item.category)) {
    errors.push(`${at}: category が不正 (${item.category})`)
  }
  if (!kotenCultureLevels.has(item.level)) errors.push(`${at}: level が不正 (${item.level})`)
  if (!kotenCultureFormats.has(item.format)) errors.push(`${at}: format が不正 (${item.format})`)
  if (!['context', 'foundation'].includes(item.style)) {
    errors.push(`${at}: style が不正 (${item.style})`)
  }
  if (!item.source || !item.passage || !item.target || !item.question || !item.explanation) {
    errors.push(`${at}: source/passage/target/question/explanation が不足`)
  }
  if (!Array.isArray(item.choices) || item.choices.length !== 4) {
    errors.push(`${at}: choices は4件必要`)
  } else if (new Set(item.choices).size !== item.choices.length) {
    errors.push(`${at}: choices に重複あり`)
  }
  if (!item.choices?.includes(item.answer)) errors.push(`${at}: answer が choices に無い`)
  if (!Array.isArray(item.cultureIds) || !item.cultureIds.length) {
    errors.push(`${at}: cultureIds が無い`)
  }
  for (const cultureId of item.cultureIds ?? []) {
    if (!getKotenCulture(cultureId)) errors.push(`${at}: 古典常識 ${cultureId} が存在しない`)
  }
  if (item.cultureIds?.[0] && getKotenCulture(item.cultureIds[0])?.category !== item.category) {
    errors.push(`${at}: primary culture と category が不一致`)
  }
}
const foundationCultureIds = new Set(
  KOTEN_CULTURE_FOUNDATION_QUESTIONS.flatMap((item) => item.cultureIds),
)
const contextCultureIds = new Set(
  KOTEN_CULTURE_CONTEXT_QUESTIONS.flatMap((item) => item.cultureIds),
)
for (const cultureId of kotenCultureIds) {
  if (!foundationCultureIds.has(cultureId)) errors.push(`古典常識 ${cultureId}: 基礎問題が無い`)
  if (!contextCultureIds.has(cultureId)) errors.push(`古典常識 ${cultureId}: 文脈問題が無い`)
}
for (const categoryId of kotenCultureCategories) {
  if (!KOTEN_CULTURE_CONTEXT_QUESTIONS.some((item) => item.category === categoryId)) {
    errors.push(`古典常識 ${categoryId}: 文脈型問題が無い`)
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

// ── 名作に親しむ：権利カード、原文→訳の順序、共通SRS参照を全作品で検証 ──
const literatureIds = new Set()
let literatureSceneCount = 0
let literatureNarrationSegmentCount = 0
let englishLiteratureSyntaxSceneCount = 0
let englishLiteratureQuestionCount = 0
for (const work of PUBLIC_DOMAIN_LITERATURE) {
  const at = `名作朗読 ${work.id ?? '(id無し)'}`
  if (!work.id || literatureIds.has(work.id)) errors.push(`${at}: id 無し/重複`)
  literatureIds.add(work.id)
  if (!['english', 'classical', 'kanbun'].includes(work.kind)) {
    errors.push(`${at}: kind が不正 (${work.kind})`)
  }
  if (!work.title || !work.titleJa || !work.author || !work.authorYears || !work.excerpt) {
    errors.push(`${at}: title/titleJa/author/authorYears/excerpt 不足`)
  }
  if (!work.rights?.status || !work.rights?.basis || !work.rights?.translation) {
    errors.push(`${at}: 著作権・独自訳の説明が不足`)
  }
  if (!/^https:\/\//.test(work.source?.url ?? '') || !work.source?.label || !work.source?.checkedOn) {
    errors.push(`${at}: 出典URL/名称/確認日が不足`)
  }
  if ((work.scenes?.length ?? 0) < 5) errors.push(`${at}: 場面が5件未満`)

  for (const [index, item] of (work.scenes ?? []).entries()) {
    const sceneAt = `${at} 場面${index + 1}`
    literatureSceneCount += 1
    if (!item.original?.trim() || !item.translation?.trim() || !item.guide?.trim()) {
      errors.push(`${sceneAt}: 原文/訳/読みのポイント不足`)
    }
    if (work.kind !== 'english' && !item.speech?.trim()) {
      errors.push(`${sceneAt}: 古文・漢文の読み上げ文不足`)
    }
    if (work.kind === 'english') {
      const guide = getLiteratureReadingGuide(work.id, index)
      if (!guide?.parts?.length || !guide.note?.trim()) {
        errors.push(`${sceneAt}: 長文型のSVOCMまたは場面別解説が不足`)
      } else {
        const annotation = buildReadingRoleAnnotation(item.original, guide.parts, {
          allowVerbOmission: guide.allowVerbOmission,
        })
        if (annotation.errors.length) {
          errors.push(`${sceneAt}: SVOCM原文対応が不正 (${annotation.errors.map((error) => error.type).join(', ')})`)
        }
        englishLiteratureSyntaxSceneCount += 1
      }
    }

    const narrationSegments = item.narrationSegments ?? []
    if (narrationSegments.length < 2) {
      errors.push(`${sceneAt}: 間で区切った朗読が2組未満`)
    }
    literatureNarrationSegmentCount += narrationSegments.length
    const joiner = work.kind === 'english' ? ' ' : ''
    if (narrationSegments.map((segment) => segment.original).join(joiner) !== item.original) {
      errors.push(`${sceneAt}: 区切りを連結しても原文を復元できない`)
    }
    if (
      narrationSegments.map((segment) => segment.speech).join(joiner) !==
      (item.speech || item.original)
    ) {
      errors.push(`${sceneAt}: 区切りを連結しても読み上げ原稿を復元できない`)
    }
    for (const [segmentIndex, segment] of narrationSegments.entries()) {
      const segmentAt = `${sceneAt} 区切り${segmentIndex + 1}`
      if (!segment.original?.trim() || !segment.speech?.trim()) {
        errors.push(`${segmentAt}: 原文または読み上げ原稿が空`)
      }
      if (
        !segment.translation?.trim() ||
        !/[ぁ-んァ-ヶ一-龠]/.test(segment.translation)
      ) {
        errors.push(`${segmentAt}: 対応する日本語の直訳・現代語訳が無い`)
      }
      if (
        work.kind === 'english' &&
        segment.original.trim().split(/\s+/).filter(Boolean).length > 12
      ) {
        errors.push(`${segmentAt}: 一息の英語が12語を超える`)
      }
    }
  }

  if (work.kind === 'english' && literatureWordCount(work) < 130) {
    errors.push(`${at}: 英語原文が長文として短すぎる (${literatureWordCount(work)}語)`)
  }

  const narration = buildLiteratureNarration(work)
  const expectedNarrationLength = (work.scenes ?? []).reduce(
    (count, item) => count + (item.narrationSegments?.length ?? 0) * 2,
    0,
  )
  if (narration.length !== expectedNarrationLength) {
    errors.push(`${at}: 区切り原文→対応する訳の再生数が不正`)
  }
  narration.forEach((step, index) => {
    const expectedPhase = index % 2 === 0 ? 'original' : 'translation'
    const pairedStep = narration[index - (index % 2)]
    const segment = work.scenes?.[step.sceneIndex]?.narrationSegments?.[step.segmentIndex]
    if (
      step.phase !== expectedPhase ||
      !step.text ||
      !step.lang ||
      step.sceneIndex !== pairedStep?.sceneIndex ||
      step.segmentIndex !== pairedStep?.segmentIndex
    ) {
      errors.push(`${at}: 再生順または音声言語が不正 (${index + 1})`)
    }
    if (
      step.phase === 'translation' &&
      (
        step.displayText !== segment?.translation ||
        step.text !== japanesePhraseSpeechText(segment?.translation) ||
        /[（）()]/u.test(step.text)
      )
    ) {
      errors.push(`${at}: 日本語フレーズの括弧表示と音声原稿が分離されていない (${index + 1})`)
    }
  })

  for (const id of new Set(work.wordIds ?? [])) {
    if (!getWord(id)) errors.push(`${at}: 共通英単語 ${id} が無い`)
  }
  if (new Set(work.wordIds ?? []).size !== (work.wordIds ?? []).length) {
    errors.push(`${at}: 共通英単語IDが重複`)
  }
  for (const id of new Set(work.kotenWordIds ?? [])) {
    if (!getKoten(id)) errors.push(`${at}: 共通古典単語 ${id} が無い`)
  }
  if (new Set(work.kotenWordIds ?? []).size !== (work.kotenWordIds ?? []).length) {
    errors.push(`${at}: 共通古典単語IDが重複`)
  }
  for (const id of new Set(work.grammarIds ?? [])) {
    if (!getKotenGrammar(id)) errors.push(`${at}: 共通古典文法 ${id} が無い`)
  }
  if (new Set(work.grammarIds ?? []).size !== (work.grammarIds ?? []).length) {
    errors.push(`${at}: 共通古典文法IDが重複`)
  }
  if (work.kind === 'english') {
    const questions = getLiteratureReadingQuestions(work.id)
    if (questions.length !== 3) errors.push(`${at}: 読解チェックが3問ではない`)
    englishLiteratureQuestionCount += questions.length
    for (const item of questions) {
      if (item.choices?.length !== 4 || new Set(item.choices).size !== 4) {
        errors.push(`${at} ${item.id}: 4択が不足または重複`)
      }
      if (!Number.isInteger(item.answer) || !item.choices?.[item.answer]) {
        errors.push(`${at} ${item.id}: 正解番号が不正`)
      }
      if (!item.explanation?.trim() || !work.scenes[item.evidenceScene]?.original) {
        errors.push(`${at} ${item.id}: 解説または根拠場面が不足`)
      }
    }
  }
}
if (englishLiteratureSyntaxSceneCount !== 23 || englishLiteratureQuestionCount !== 9) {
  errors.push(`英語名作の長文型構成が全件ではない (構文${englishLiteratureSyntaxSceneCount}/23場面・設問${englishLiteratureQuestionCount}/9問)`)
}
for (const kind of ['english', 'classical', 'kanbun']) {
  const count = PUBLIC_DOMAIN_LITERATURE.filter((work) => work.kind === kind).length
  if (count < 3) errors.push(`名作朗読: ${kind} が3作品未満 (${count})`)
}

// ── 発音：同綴異音語の補正が実際の見出し語へ適用されているか ──
for (const [id, ipa] of Object.entries(PHONETIC_OVERRIDES)) {
  const word = getWord(id)
  if (!word) errors.push(`発音補正 ${id}: 見出し語が無い`)
  else if (word.phonetic !== ipa) errors.push(`発音補正 ${id}: ${ipa} が適用されていない (${word.phonetic})`)
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
for (const guide of EXAM_USAGE_GUIDES) {
  for (const [index, choice] of guide.choices.entries()) {
    auditEnglish(`使い分け ${guide.id} 例文${index + 1}`, choice.example, { complete: true })
  }
}
for (const lesson of EXAM_GRAMMAR_LESSONS) {
  for (const [index, example] of lesson.examples.entries()) {
    auditEnglish(`高校文法解説 ${lesson.id} 例文${index + 1}`, example.en, { complete: true })
  }
}
for (const passage of PASSAGES) {
  passage.sentences.forEach((sentence, index) =>
    auditEnglish(`長文 ${passage.id} 第${index + 1}文`, sentence.en, { complete: true }))
}
for (const work of PUBLIC_DOMAIN_LITERATURE.filter((item) => item.kind === 'english')) {
  work.scenes.forEach((item, index) =>
    auditEnglish(`名作朗読 ${work.id} 場面${index + 1}`, item.original, { complete: true }))
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
if (errors.length) {
  console.error(`\n❌ データ検証 失敗（${errors.length}件）`)
  errors.slice(0, 40).forEach((e) => console.error('  - ' + e))
  if (errors.length > 40) console.error(`  … 他 ${errors.length - 40} 件`)
  console.error('\n【単語の必須項目】id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA)')
  console.error('単語を足したら: npm run phonetics（IPA生成）→ npm run check。これらを満たすまでビルドできません。\n')
  process.exit(1)
}

console.log(`✅ データ検証OK: ${ALL_WORDS.length}英単語 / ${EXAM_USAGE_GUIDES.length}使い分けガイド / ${PHRASES.length}熟語・構文（長い一文${longSentenceTranslationCount}文・${longSentenceMeaningStepCount}意味フレーズ・${longSentenceTranslationStepCount}内部SVOCM単位） / ${GRAMMAR.length}英文法 / ${GRAMMAR_LESSONS.length}文法解説 / ${PASSAGES.length}長文（${readingTranslationSentenceCount}文・${readingTranslationBlockCount}語順訳ブロック・${readingMeaningPhraseCount}意味フレーズ・${readingPhrasePairCount}ブロック内内部SVOCM単位・手動本文台帳${readingManualReviewSentenceCount}文・回帰例${readingReviewedPhraseSentenceCount}文） / ${PUBLIC_DOMAIN_LITERATURE.length}名作朗読（${literatureSceneCount}場面・${literatureNarrationSegmentCount}区切り・英語構文${englishLiteratureSyntaxSceneCount}場面・英語読解${englishLiteratureQuestionCount}問） / ${DICTATION_ITEMS.length}ディクテーション / ${LISTENING_ITEMS.length}リスニング / ${KOTEN_WORDS.length}古典単語 / ${KOTEN_GRAMMAR.length}古典文法 / ${KOTEN_GRAMMAR_QUESTIONS.length}古典文法問題 / ${KOTEN_CULTURE.length}古典常識 / ${KOTEN_CULTURE_QUESTIONS.length}古典常識問題 / ${KOTEN_INTERPRETATIONS.length}古典短文 — 全て必須項目を満たす`)
