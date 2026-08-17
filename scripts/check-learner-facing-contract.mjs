import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { GRAMMAR, grammarChoiceGuidanceFor } from '../src/data/grammar.js'
import { LONG_SENTENCE_TRANSLATIONS } from '../src/data/long-sentence-translations.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  longSentenceExplanationTexts,
  readingBlockExplanationTexts,
  readingPhraseExplanationTexts,
} from '../src/lib/explanationDedup.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { buildGrammarInstructorExplanation } from '../src/lib/instructorExplanations.js'
import {
  ALL_WORDS,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  etymologyLearningGuideFor,
} from '../src/data/vocab.js'
import { buildAllEtymologyQuizQuestions } from '../src/lib/etymologyQuiz.js'
import {
  APP_MENU_SECTIONS,
  APP_MENU_ITEMS,
  APP_MENU_SCREEN_DESTINATIONS,
} from '../src/lib/appMenu.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import {
  ALL_PROGRESS_RESET_GROUP_IDS,
  PROGRESS_RESET_GROUPS,
  RESET_PRESERVED_PROGRESS_FIELDS,
  RESETTABLE_PROGRESS_FIELDS,
} from '../src/lib/progressReset.js'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceRoot = path.join(projectRoot, 'src')
const errors = []

const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
const uniqueNonEmpty = (values) => {
  const normalized = values.map(normalize).filter(Boolean)
  return new Set(normalized).size === normalized.length
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(target)
    return /\.(?:js|jsx)$/.test(entry.name) ? [target] : []
  }))
  return nested.flat()
}

const forbiddenRuntimeCopy = [
  '選択肢の使い分け',
  '別の場面で使う',
  '根拠を一本化',
  '誤答を切る',
  '次も解ける型',
  '構文の見取り図',
  '構造を確かめる文法ブロック解説',
  '節・句・文法ブロック解説',
  '英文を発音できて意味が通るまとまりに区切ります。',
  'S・V・O・C・Mはフレーズ内の構造を確かめる注釈です。',
]

const files = await sourceFiles(sourceRoot)
for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(projectRoot, file)
  for (const forbidden of forbiddenRuntimeCopy) {
    if (source.includes(forbidden)) errors.push(`${relative}: 廃止表記「${forbidden}」`)
  }
}

const readProjectFile = (relative) => readFile(path.join(projectRoot, relative), 'utf8')
const [
  instructorSource,
  grammarQuizSource,
  homeSource,
  readerSource,
  appSource,
  shellSource,
  menuSource,
  progressBackupSource,
  storeSource,
  rootsSource,
  etymologyStudySource,
  etymologyQuizSource,
  etymologyPackSource,
  etymologyKnowledgeSource,
  wordBitsSource,
  vocabStudySource,
  vocabQuizSource,
] = await Promise.all([
  readProjectFile('src/components/InstructorExplanation.jsx'),
  readProjectFile('src/screens/GrammarQuiz.jsx'),
  readProjectFile('src/screens/Home.jsx'),
  readProjectFile('src/screens/Reader.jsx'),
  readProjectFile('src/App.jsx'),
  readProjectFile('src/components/AppShell.jsx'),
  readProjectFile('src/components/SpeechSettings.jsx'),
  readProjectFile('src/components/ProgressBackup.jsx'),
  readProjectFile('src/store/useStore.js'),
  readProjectFile('src/screens/Roots.jsx'),
  readProjectFile('src/screens/EtymologyStudy.jsx'),
  readProjectFile('src/screens/EtymologyQuiz.jsx'),
  readProjectFile('src/screens/EtymologyPack.jsx'),
  readProjectFile('src/components/EtymologyKnowledge.jsx'),
  readProjectFile('src/components/WordBits.jsx'),
  readProjectFile('src/screens/VocabStudy.jsx'),
  readProjectFile('src/screens/VocabQuiz.jsx'),
])

for (const label of ['根拠', '消去法', '考え方']) {
  if (!instructorSource.includes(`label: '${label}'`)) errors.push(`共通解説に「${label}」がない`)
}
if (!grammarQuizSource.includes('選択肢解説')) errors.push('英文法画面に「選択肢解説」がない')
if (/id: 'quiz'/.test(homeSource)) errors.push('英語ホームに重複したクイズ入口がある')
if (!homeSource.includes("id: 'vocab'")) errors.push('英語ホームの単語入口がない')
if (!homeSource.includes("id: 'etymology'") || !homeSource.includes("screen: 'roots'")) {
  errors.push('英語ホームから語源へ直接進めない')
}
if (!readerSource.includes('長文読解')) errors.push('Readerに「長文読解」がない')
if (!readerSource.includes('文法解説')) errors.push('Readerに「文法解説」がない')
if (/learnerPhrasePairsForBlock|speakBlockPair/.test(readerSource)) {
  errors.push('Reader下段が上段の意味フレーズを再表示・再生している')
}
if (!shellSource.includes('data-global-back-button')) errors.push('AppShell上部に共通の戻る操作がない')
if (!shellSource.includes('data-global-menu-button')) errors.push('AppShell上部にメニュー入口がない')
if (!shellSource.includes('aria-label="メニューを開く"')) errors.push('上部メニューボタンの名前がない')
if (!shellSource.includes('openSpeechSettings()')) errors.push('上部メニューボタンがメニューを開かない')
if (shellSource.includes('data-global-bottom-nav') || appSource.includes('BottomNav')) {
  errors.push('廃止した統一下部ナビが残っている')
}
if (!menuSource.includes('data-progress-save-confirmation')) errors.push('途中離脱の保存確認がない')
if (!menuSource.includes('data-progress-discard-confirmation')) errors.push('途中の戻る操作に進捗破棄確認がない')
if (!menuSource.includes('進捗は破棄されます')) errors.push('途中の戻る操作で進捗破棄メッセージがない')
if (!menuSource.includes('requiresProgressSaveConfirmation')) errors.push('保存確認の画面判定がない')
if (!progressBackupSource.includes('selectProgressState')) errors.push('QR／コードが共通永続スライスを使っていない')
if (!progressBackupSource.includes('QRCodeCanvas')) errors.push('QR出力がない')
if (!progressBackupSource.includes('コードをコピー')) errors.push('進捗コード出力がない')

const expectedEtymologyModes = ['部品で分ける', '同じ語根', '語の家族', 'ことばの歴史']
const actualEtymologyModes = Object.values(ETYMOLOGY_MODE_META).map((item) => item.label)
if (actualEtymologyModes.join(',') !== expectedEtymologyModes.join(',')) {
  errors.push(`語源の4分類が平易な表示契約と不一致: ${actualEtymologyModes.join(',')}`)
}
const learnerEtymologySources = `${rootsSource}\n${etymologyStudySource}\n${etymologyQuizSource}\n${etymologyPackSource}\n${etymologyKnowledgeSource}\n${wordBitsSource}`
for (const obsolete of [
  '現在義',
  '共通軸',
  '記載上の出発言語',
  '濃縮パック',
  'もとの形・言語',
  'もとの言語',
  'どの言語から',
]) {
  if (learnerEtymologySources.includes(obsolete)) {
    errors.push(`語源の学習者向け画面に専門的な表示語「${obsolete}」が残る`)
  }
}
if (!vocabQuizSource.includes('<EtymologyBlock word={word} />')) {
  errors.push('単語クイズの解答直後に語源本文がない')
}
if (!vocabStudySource.includes('<EtymologyBlock')) {
  errors.push('単語カードの答えに語源本文がない')
}
if (/語源をくわしく見る|くわしく見る/.test(`${vocabQuizSource}\n${vocabStudySource}`)) {
  errors.push('単語の語源本文が「くわしく見る」操作を必須にしている')
}
if (etymologyStudySource.includes('答えと説明を見る')) {
  errors.push('語源の学習内容が追加操作の後ろに隠れている')
}
if (!etymologyKnowledgeSource.includes('data-etymology-learning-flow')) {
  errors.push('語源学習が「形・意味・関連語」の流れになっていない')
}
const etymologyQuestions = buildAllEtymologyQuizQuestions()
if (etymologyQuestions.length !== ETYMOLOGY_PACKS.length) {
  errors.push(`語源2択の全件数が不一致: ${etymologyQuestions.length}/${ETYMOLOGY_PACKS.length}`)
}
for (const question of etymologyQuestions) {
  const labels = question.knowledge.options.map((option) => option.label)
  if (labels.join(',') !== '正しい,正しくない') {
    errors.push(`語源 ${question.packId}: 正誤2択ではない`)
  }
  if (/何語|もとの言語|どの言語/.test(`${question.knowledge.prompt} ${question.knowledge.statement}`)) {
    errors.push(`語源 ${question.packId}: 由来言語を答えさせている`)
  }
}
for (const word of ALL_WORDS) {
  const guide = etymologyLearningGuideFor(word)
  if (
    !guide.formationLabel || !guide.formationText ||
    !guide.sourceLabel || !guide.sourceText ||
    !guide.storyLabel || !guide.storySteps.length ||
    guide.storySteps.some((step) => !normalize(step)) ||
    !guide.currentMeaning
  ) {
    errors.push(`語源 ${word.id}: 中高生向け4段階ガイドが不完全`)
  }
}
for (const pack of ETYMOLOGY_PACKS) {
  const learnerText = [pack.title, pack.subtitle, pack.description, pack.caution].join(' ')
  if (/undefined|（\s*）|\(\s*\)/.test(learnerText) || pack.title.length > 45) {
    errors.push(`語源カード ${pack.id}: 見出しが不完全または長すぎる`)
  }
}

const expectedMenuSections = ['apps', 'english', 'support', 'records', 'settings']
const actualMenuSections = APP_MENU_SECTIONS.map((section) => section.id)
if (actualMenuSections.join(',') !== expectedMenuSections.join(',')) {
  errors.push(`メニューの見出しが不一致: ${actualMenuSections.join(',')}`)
}
const menuSectionCounts = APP_MENU_SECTIONS.map((section) => section.items.length)
if (menuSectionCounts.join(',') !== '6,8,6,6,3') {
  errors.push(`メニューの項目数が不一致: ${menuSectionCounts.join(',')}`)
}
const appHomeEntry = APP_MENU_ITEMS.find((item) => item.kind === 'screen' && item.screen === 'portal')
if (appHomeEntry?.label !== 'スタディアプリ ホーム') {
  errors.push('メニューからスタディアプリ ホームを直接開けない')
}
if (APP_MENU_ITEMS.length !== 29) errors.push(`メニューが全29項目ではない: ${APP_MENU_ITEMS.length}`)
if (new Set(APP_MENU_SCREEN_DESTINATIONS).size !== APP_MENU_SCREEN_DESTINATIONS.length) {
  errors.push('メニューに重複した画面入口がある')
}
if (!menuSource.includes('data-menu-section-list')) errors.push('メニューに一段の項目一覧がない')
if (!menuSource.includes('data-menu-section={menuSection.id}')) errors.push('メニューの見出しが描画されない')
if (!menuSource.includes('data-menu-item')) errors.push('メニュー項目を直接選べない')
if (!menuSource.includes('data-menu-advisor-entry')) errors.push('メニューに学習アドバイザーがない')
if (!menuSource.includes('data-menu-retention-entry')) errors.push('メニューに学習分析がない')
for (const obsolete of [
  'data-menu-group-list',
  'data-menu-group-entry',
  'data-menu-group-panel',
  'data-menu-direct-list',
  'data-menu-group-count',
  'data-menu-hub-intro',
  'data-menu-hub-footer',
  'DataManagementPanel',
  'data-data-management-panel',
]) {
  if (menuSource.includes(obsolete)) errors.push(`メニューに廃止した入れ子・重複UI「${obsolete}」がある`)
}
if (storeSource.includes('clearLearningData')) {
  errors.push('履歴リセットと重複する旧clearLearningData処理がある')
}

const resetGroupIds = PROGRESS_RESET_GROUPS.map((group) => group.id)
const coveredProgressFields = [
  ...RESETTABLE_PROGRESS_FIELDS,
  ...RESET_PRESERVED_PROGRESS_FIELDS,
]
if (resetGroupIds.join(',') !== ALL_PROGRESS_RESET_GROUP_IDS.join(',')) {
  errors.push('履歴リセットの表示順と分類ID契約が不一致')
}
if (PROGRESS_RESET_GROUPS.length !== 6) {
  errors.push(`履歴リセットが6分類ではない: ${PROGRESS_RESET_GROUPS.length}`)
}
if (RESETTABLE_PROGRESS_FIELDS.length !== 44 || RESET_PRESERVED_PROGRESS_FIELDS.length !== 3) {
  errors.push(`履歴リセットの対象数が不一致: 対象${RESETTABLE_PROGRESS_FIELDS.length}・保持${RESET_PRESERVED_PROGRESS_FIELDS.length}`)
}
if (new Set(coveredProgressFields).size !== coveredProgressFields.length) {
  errors.push('履歴リセットの保存項目が二重分類されている')
}
if (
  [...coveredProgressFields].sort().join(',')
  !== [...PERSISTED_PROGRESS_FIELDS].sort().join(',')
) {
  errors.push('全保存項目がリセット対象または保持対象へ一意に分類されていない')
}
for (const marker of [
  'data-reset-select-all',
  'data-reset-selection-list',
  'data-reset-group={group.id}',
  'data-reset-preserved-data',
]) {
  if (!menuSource.includes(marker)) errors.push(`履歴リセット画面に${marker}がない`)
}

let sentenceCount = 0
let phraseCount = 0
let blockCount = 0
for (const passage of PASSAGES) {
  for (const sentence of passage.sentences) {
    sentenceCount += 1
    const analysis = analyzeReadingSentence(sentence)
    const phraseTexts = readingPhraseExplanationTexts(analysis)
    const blockTexts = readingBlockExplanationTexts(analysis, phraseTexts)
    phraseCount += analysis.meaningPhraseSequence.length
    blockCount += analysis.blocks.length
    if (!uniqueNonEmpty([...phraseTexts, ...blockTexts])) {
      errors.push(`長文 ${passage.id}: 同一文内に重複表示される解説がある: ${sentence.en}`)
    }
  }
}

let longSentenceCount = 0
let longStepCount = 0
for (const [id, guide] of Object.entries(LONG_SENTENCE_TRANSLATIONS)) {
  longSentenceCount += 1
  const steps = guide.meaningSteps?.length ? guide.meaningSteps : guide.steps
  longStepCount += steps.length
  if (!uniqueNonEmpty(longSentenceExplanationTexts(steps))) {
    errors.push(`長い一文 ${id}: 重複表示される解説がある`)
  }
}

let grammarChoicePaths = 0
for (const item of GRAMMAR) {
  const base = buildGrammarInstructorExplanation(item)
  if (!normalize(base.evidence).includes(normalize(item.explain))) {
    errors.push(`文法 ${item.id}: 根拠が設問固有の説明を含まない`)
  }
  if (!normalize(base.strategy) || normalize(base.strategy) === normalize(base.evidence)) {
    errors.push(`文法 ${item.id}: 考え方が独立した手順になっていない`)
  }
  for (const choice of item.choices) {
    if (choice === item.answer) continue
    grammarChoicePaths += 1
    const guidance = grammarChoiceGuidanceFor(item, choice)
    const explanation = buildGrammarInstructorExplanation(item, choice, guidance)
    if (!normalize(explanation.trap).includes(normalize(choice))) {
      errors.push(`文法 ${item.id}: 消去法が選択肢「${choice}」を特定しない`)
    }
    if (!normalize(explanation.trap).includes(normalize(item.explain))) {
      errors.push(`文法 ${item.id}: 消去法がこの問題の根拠を含まない`)
    }
  }
}

if (PASSAGES.length < 24 || sentenceCount < 567) errors.push('長文の全対象数が基準を下回る')
if (longSentenceCount < 33) errors.push('長い一文の全対象数が基準を下回る')
if (GRAMMAR.length !== 3140 || grammarChoicePaths !== 9420) errors.push('英文法の全対象数が契約と不一致')

if (errors.length) {
  console.error(`学習者向け品質契約: ${errors.length}件の違反`)
  errors.slice(0, 80).forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(
  `学習者向け品質契約: 違反0 / 語源${ALL_WORDS.length}語・${ETYMOLOGY_PACKS.length}カード / メニュー${APP_MENU_ITEMS.length}項目 / 履歴リセット${PROGRESS_RESET_GROUPS.length}分類・保存${PERSISTED_PROGRESS_FIELDS.length}項目 / 長文${PASSAGES.length}本・${sentenceCount}文・${phraseCount}フレーズ・${blockCount}ブロック / 長い一文${longSentenceCount}件・${longStepCount}フレーズ / 文法${GRAMMAR.length}問・誤答${grammarChoicePaths}経路`,
)
