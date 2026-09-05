#!/usr/bin/env node
// 公開語源教材の強制GATE。
//
// 旧来の全語バッチは保存互換のためデータ内に残すが、公開可否には使わない。
// 公開カードは「手動監査台帳 + 明示された語根リンク + 内容固定hash」の三条件を
// すべて満たすものだけに限定する。
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ALL_WORDS,
  ETYMOLOGY_LEGACY_PACKS,
  ETYMOLOGY_PACKS,
  ETYMOLOGY_SUMMARY,
  etymologyCardsForWord,
  getRoot,
} from '../src/data/vocab.js'
import { ETYMOLOGY_CARD_REVIEWS } from '../src/data/etymology-card-reviews.js'
import { buildAllEtymologyQuizQuestions } from '../src/lib/etymologyQuiz.js'
import { QUIZ_CHOICE_COUNT } from '../src/lib/quizChoices.js'
import { etymologyCardReviewMaterial } from '../src/data/etymology-reviewed-cards.js'

export const ETYMOLOGY_QUALITY_TARGETS = Object.freeze({
  rawWords: 8869,
  publicCards: 196,
  publicWords: 1977,
  publicLinks: 2019,
  quarantinedWords: 6892,
  retiredLegacyPacks: 2933,
})

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = (relativePath) => readFileSync(path.join(projectRoot, relativePath), 'utf8')
const lowerHead = (value = '') => String(value).trim().toLowerCase()
const publicAssociationIsExplicit = (word, rootId) =>
  (word?.etymology?.parts ?? []).some((part) => part.root === rootId) ||
  (word?.referenceRoots ?? []).includes(rootId)

const FORBIDDEN_PUBLIC_COPY = /ことばの歴史|由来ストーリー単独|学習量をまとめたセット|語どうしが同じ語根の仲間や関連語という意味ではありません/

export function auditEtymologyLearningQuality() {
  const errors = []
  const fail = (message) => errors.push(message)
  const wordsById = new Map(ALL_WORDS.map((word) => [word.id, word]))
  const wordsByHead = new Map(ALL_WORDS.map((word) => [lowerHead(word.word), word]))
  const cardIds = new Set()
  const publicWordIds = new Set()
  const reviewRootIds = new Set(Object.keys(ETYMOLOGY_CARD_REVIEWS))
  let publicLinks = 0
  let sourceLinks = 0

  if (ALL_WORDS.length !== ETYMOLOGY_QUALITY_TARGETS.rawWords) {
    fail(`全語源レコード数が監査対象と不一致: ${ALL_WORDS.length}/${ETYMOLOGY_QUALITY_TARGETS.rawWords}`)
  }
  if (ETYMOLOGY_LEGACY_PACKS.length !== ETYMOLOGY_QUALITY_TARGETS.retiredLegacyPacks) {
    fail(`互換用旧パック数が不一致: ${ETYMOLOGY_LEGACY_PACKS.length}/${ETYMOLOGY_QUALITY_TARGETS.retiredLegacyPacks}`)
  }
  if (ETYMOLOGY_PACKS.length !== ETYMOLOGY_QUALITY_TARGETS.publicCards) {
    fail(`公開カード数が手動監査対象と不一致: ${ETYMOLOGY_PACKS.length}/${ETYMOLOGY_QUALITY_TARGETS.publicCards}`)
  }

  for (const word of ALL_WORDS) {
    if (!word.id || !word.word || !word.meaning) fail(`${word.id || '(idなし)'}: 単語の必須項目が空`)
    if (!word.etymology?.note?.trim()) fail(`${word.id}: 互換用語源レコードが空`)
  }

  for (const card of ETYMOLOGY_PACKS) {
    const at = `${card.id}（${card.title}）`
    if (cardIds.has(card.id)) fail(`${at}: カードIDが重複`)
    cardIds.add(card.id)
    reviewRootIds.delete(card.rootId)

    const root = getRoot(card.rootId)
    const review = ETYMOLOGY_CARD_REVIEWS[card.rootId]
    if (!root) fail(`${at}: 語根が存在しない`)
    if (!review) fail(`${at}: 手動監査台帳にない`)
    if (card.mode !== 'root' || card.groupClaim !== 'manual-reviewed-root') {
      fail(`${at}: 公開カードが確認済み語根カードではない`)
    }
    if (!card.rootForm || !card.rootMeaning || !card.rootOrigin) fail(`${at}: 語根の事実が空`)
    if (FORBIDDEN_PUBLIC_COPY.test([
      card.title,
      card.subtitle,
      card.description,
      card.caution,
    ].join(' '))) fail(`${at}: 廃止した学習量バッチの説明が残る`)

    const ids = new Set(card.coverageIds)
    if (!ids.size || ids.size !== card.coverageIds.length) fail(`${at}: 紐づく単語が空または重複`)
    if (card.studyIds.join('\n') !== card.coverageIds.join('\n')) {
      fail(`${at}: 補助の単語学習対象が確認済みリンク全件と一致しない`)
    }
    if (!card.exampleIds.length || card.exampleIds.some((id) => !ids.has(id))) {
      fail(`${at}: 語源カード例が確認済み単語から選ばれていない`)
    }

    for (const id of card.coverageIds) {
      const word = wordsById.get(id)
      publicLinks += 1
      publicWordIds.add(id)
      if (!word) fail(`${at}: 存在しない単語 ${id}`)
      else if (!publicAssociationIsExplicit(word, card.rootId)) {
        fail(`${at}: ${word.word} は綴りの自動推測だけで結ばれている`)
      }
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(card.evidence?.reviewedAt ?? '')) {
      fail(`${at}: 手動確認日がない`)
    }
    if (card.evidence?.reviewedBy !== 'manual-etymology-audit') {
      fail(`${at}: 手動確認者の記録がない`)
    }
    if (!card.evidence?.sourceHeads?.length) fail(`${at}: 照合見出し語がない`)
    for (const head of card.evidence?.sourceHeads ?? []) {
      const word = wordsByHead.get(lowerHead(head))
      if (!word || !ids.has(word.id)) fail(`${at}: 照合見出し語 ${head} がカード内にない`)
    }
    const expectedSourceCount = (card.evidence?.sourceHeads?.length ?? 0) * 2
    if (card.evidence?.sources?.length !== expectedSourceCount) {
      fail(`${at}: 独立した照合先が各見出し語に2件ない`)
    }
    for (const item of card.evidence?.sources ?? []) {
      sourceLinks += 1
      if (!/^https:\/\/(?:www\.etymonline\.com|en\.wiktionary\.org)\//.test(item.url ?? '')) {
        fail(`${at}: 許可していない出典URL ${item.url ?? '(空)'}`)
      }
      if (!card.evidence.sourceHeads.includes(item.head)) {
        fail(`${at}: 出典見出し ${item.head} が監査対象外`)
      }
    }

    const actualFingerprint = createHash('sha256')
      .update(etymologyCardReviewMaterial(card))
      .digest('hex')
    if (actualFingerprint !== card.evidence?.fingerprint) {
      fail(`${at}: 説明または紐づけ語が手動確認後に変更された`)
    }
  }

  if (reviewRootIds.size) fail(`台帳にあるのに公開カードがない語根: ${[...reviewRootIds].join(', ')}`)
  if (publicWordIds.size !== ETYMOLOGY_QUALITY_TARGETS.publicWords) {
    fail(`公開確認済み単語数が不一致: ${publicWordIds.size}/${ETYMOLOGY_QUALITY_TARGETS.publicWords}`)
  }
  if (publicLinks !== ETYMOLOGY_QUALITY_TARGETS.publicLinks) {
    fail(`公開確認済み紐づけ数が不一致: ${publicLinks}/${ETYMOLOGY_QUALITY_TARGETS.publicLinks}`)
  }
  const quarantinedWords = ALL_WORDS.length - publicWordIds.size
  if (quarantinedWords !== ETYMOLOGY_QUALITY_TARGETS.quarantinedWords) {
    fail(`非公開に隔離した自由記述語源数が不一致: ${quarantinedWords}/${ETYMOLOGY_QUALITY_TARGETS.quarantinedWords}`)
  }
  if (
    ETYMOLOGY_SUMMARY.total !== publicWordIds.size ||
    ETYMOLOGY_SUMMARY.links !== publicLinks ||
    ETYMOLOGY_SUMMARY.quarantinedWords !== quarantinedWords
  ) fail('公開語源サマリーの母数が監査結果と一致しない')

  // 利用者報告と既知の誤接続を、公開APIで直接再現して禁止する。
  if (etymologyCardsForWord('he').length) fail('he が語源カードへ混入している')
  if (etymologyCardsForWord('compose').some((card) => card.rootId === 'pos')) {
    fail('compose を ponere の確定的な同根語として表示している')
  }
  if (etymologyCardsForWord('adjust').some((card) => card.rootId === 'jud')) {
    fail('adjust を jud の同根語として表示している')
  }
  if (!etymologyCardsForWord('print').some((card) => card.rootId === 'press')) {
    fail('print が確認済みの press カードへつながらない')
  }
  if (etymologyCardsForWord('print').some((card) => card.rootId === 'prim')) {
    fail('print が別語源の prim カードへつながる')
  }

  const publicFiles = [
    'src/screens/Roots.jsx',
    'src/screens/EtymologyPack.jsx',
    'src/screens/EtymologyStudy.jsx',
    'src/screens/EtymologyQuiz.jsx',
    'src/screens/RootDetail.jsx',
    'src/components/WordBits.jsx',
    'src/screens/WordDetail.jsx',
    'src/screens/VocabStudy.jsx',
    'src/screens/VocabQuiz.jsx',
    'src/screens/VocabLevels.jsx',
    'src/screens/MyList.jsx',
    'src/screens/Progress.jsx',
    'src/lib/learningNotebookCatalog.js',
    'src/lib/learningAnalyticsReport.js',
    'src/lib/appMenu.js',
    'src/lib/instructorExplanations.js',
    'src/lib/diagnosticQuestions.js',
  ]
  const publicSource = publicFiles.map(source).join('\n')
  if (FORBIDDEN_PUBLIC_COPY.test(publicSource)) fail('公開画面に廃止した「ことばの歴史」または学習量バッチが残る')
  if (publicSource.includes('data-etymology-card-study-action')) {
    fail('廃止した語源カード専用暗記への主導線が残る')
  }
  if (!publicSource.includes('data-etymology-word-study-action')) {
    fail('確認済みカードに紐づく単語を通常の単語暗記で学ぶ導線がない')
  }
  const rootsSource = source('src/screens/Roots.jsx')
  const packSource = source('src/screens/EtymologyPack.jsx')
  const wordBitsSource = source('src/components/WordBits.jsx')
  const appSource = source('src/App.jsx')
  if (!rootsSource.includes("navigate('vocabStudy'")) fail('語源トップが通常の単語暗記へ進まない')
  if (!packSource.includes("navigate('vocabStudy'")) fail('カード詳細が通常の単語暗記へ進まない')
  // 語源そのものを暗記・テスト・一覧で学ぶ導線は公開する（単語・熟語と同じ扱い）。
  if (!rootsSource.includes("navigate('etymologyStudy'")) fail('語源トップに語根の暗記がない')
  if (!rootsSource.includes("navigate('etymologyQuiz'")) fail('語源トップに語根のテストがない')
  if (!rootsSource.includes('NormalLearningRecordList')) fail('語源トップに一覧で確認する導線がない')
  if (!/etymologyStudy: EtymologyStudyScreen/.test(appSource)) fail('語源の暗記画面がルートにない')
  if (!/etymologyQuiz: EtymologyQuizScreen/.test(appSource)) fail('語源のテスト画面がルートにない')
  for (const relativePath of [
    'src/screens/EtymologyStudy.jsx',
    'src/screens/EtymologyQuiz.jsx',
    'src/lib/etymologyQuiz.js',
  ]) {
    if (!existsSync(path.join(projectRoot, relativePath))) {
      fail(`語源の暗記・テスト実装がない: ${relativePath}`)
    }
  }
  // 廃止したのは2択の正誤問題。現行のテストは「3択＋わからない」でそろえる。
  const quizSource = source('src/screens/EtymologyQuiz.jsx')
  if (!quizSource.includes('UnknownChoiceButton')) fail('語源テストに「わからない」がない')
  if (/'正しい'|'正しくない'/.test(quizSource)) fail('廃止した2択の正誤問題が残る')
  for (const question of buildAllEtymologyQuizQuestions()) {
    const at = `${question.cardId}（${question.formatLabel}）`
    const labels = question.options.map((option) => option.label)
    if (labels.length !== QUIZ_CHOICE_COUNT) fail(`${at}: 選択肢が${labels.length}個`)
    if (new Set(labels).size !== labels.length) fail(`${at}: 同じ表示の選択肢がある`)
    if (!question.options.some((option) => option.id === question.answerId)) {
      fail(`${at}: 正解が選択肢にない`)
    }
    if (!question.cue || !question.prompt || !question.explanation) fail(`${at}: 出題文が空`)
    const card = ETYMOLOGY_PACKS.find((item) => item.id === question.cardId)
    for (const option of question.options) {
      if (option.id === question.answerId) continue
      const other = ETYMOLOGY_PACKS.find((item) => item.id === option.id)
      if (!other) fail(`${at}: 誤答 ${option.id} が確認済みカードでない`)
      else if (question.exampleWordId && other.coverageIds.includes(question.exampleWordId)) {
        fail(`${at}: 誤答 ${option.id} にも例語が紐づき、正解が2つある`)
      }
    }
    if (question.exampleWordId && !card.coverageIds.includes(question.exampleWordId)) {
      fail(`${at}: 例語が確認済みリンク外`)
    }
  }
  const etymologyBlockSource = wordBitsSource.slice(
    wordBitsSource.indexOf('export function EtymologyBlock'),
    wordBitsSource.indexOf('/** 語源でつながる単語'),
  )
  if (/word\.etymology|EtymologyHistoryTrail|EtymologyParts/.test(etymologyBlockSource)) {
    fail('単語画面が未承認の自由記述語源を表示する')
  }
  const learnerSurfaceSource = [
    'src/screens/Roots.jsx',
    'src/screens/EtymologyPack.jsx',
    'src/screens/EtymologyStudy.jsx',
    'src/screens/EtymologyQuiz.jsx',
    'src/screens/RootDetail.jsx',
    'src/components/WordBits.jsx',
    'src/screens/WordDetail.jsx',
    'src/screens/VocabStudy.jsx',
    'src/screens/VocabQuiz.jsx',
    'src/lib/etymologyQuiz.js',
    'src/lib/learningNotebookCatalog.js',
    'src/lib/instructorExplanations.js',
    'src/lib/diagnosticQuestions.js',
  ].map(source).join('\n')
  if (/\b(?:word|item)\??\.etymology\??\.(?:note|origin|parts)/.test(learnerSurfaceSource)) {
    fail('学習者向け画面・解説・診断が未承認の語源自由記述を参照する')
  }
  if (!learnerSurfaceSource.includes('etymologyCardsForWord')) {
    fail('単語側の語源表示が確認済みカードAPIを通っていない')
  }

  return {
    errors,
    rawWords: ALL_WORDS.length,
    publicCards: ETYMOLOGY_PACKS.length,
    publicWords: publicWordIds.size,
    publicLinks,
    quarantinedWords,
    sourceLinks,
    retiredLegacyPacks: ETYMOLOGY_LEGACY_PACKS.length,
  }
}

export function printEtymologyLearningQuality(report) {
  const line = (label, value) => console.log(`${label.padEnd(34)} ${String(value).padStart(8)}`)
  console.log('語源教材・手動監査固定GATE')
  console.log('='.repeat(52))
  line('全語源レコード走査', report.rawWords)
  line('公開する確認済み語源カード', report.publicCards)
  line('公開カードに紐づく確認済み単語', report.publicWords)
  line('確認済みカード→単語リンク（延べ）', report.publicLinks)
  line('照合先URL', report.sourceLinks)
  line('未承認のため公開しない自由記述', report.quarantinedWords)
  line('保存互換だけに残す旧パック', report.retiredLegacyPacks)

  if (report.errors.length) {
    console.error(`\n❌ 語源教材品質: ${report.errors.length}件の違反`)
    for (const error of report.errors.slice(0, 100)) console.error(`- ${error}`)
    if (report.errors.length > 100) console.error(`…ほか${report.errors.length - 100}件`)
    return false
  }
  console.log('\n✅ 公開語源は全件、出典・手動承認・内容固定hashが一致しています。')
  return true
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const report = auditEtymologyLearningQuality()
  if (!printEtymologyLearningQuality(report)) process.exit(1)
}
