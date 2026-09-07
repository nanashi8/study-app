import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  GRAMMAR,
  grammarChoiceGuidanceFor,
  grammarChoiceUsageFor,
} from '../src/data/grammar.js'
import { LONG_SENTENCE_TRANSLATIONS } from '../src/data/long-sentence-translations.js'
import { PASSAGES } from '../src/data/passages.js'
import {
  READING_RULES,
  readingApproachForPassage,
} from '../src/data/reading-rules.js'
import {
  longSentenceExplanationTexts,
  readingBlockExplanationTexts,
  readingPhraseExplanationTexts,
} from '../src/lib/explanationDedup.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { buildGrammarInstructorExplanation } from '../src/lib/instructorExplanations.js'
import { grammarChoiceExplanationFor } from '../src/lib/grammarQuestionExplanations.js'
import {
  ALL_WORDS,
  ETYMOLOGY_MODE_META,
  ETYMOLOGY_PACKS,
  etymologyCardsForWord,
  etymologyLearningGuideFor,
} from '../src/data/vocab.js'
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

// 途中でやめても、答えた分をその分野の学習記録へ残す共通結果のテスト画面。
const INTERRUPTED_SESSION_RECORD_SCREENS = [
  'src/screens/VocabQuiz.jsx',
  'src/screens/PhraseQuiz.jsx',
  'src/screens/ListeningQuiz.jsx',
  'src/screens/DictationPlay.jsx',
  'src/screens/GrammarQuiz.jsx',
]

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
  // 中高生に伝わらない言い回し・開発者向け用語は画面へ出さない。
  '再利用できる見抜き方',
  'わからない時の切り方',
  '正解と決定的な手掛かり',
  '取り違え注意',
  '中心の答え',
  '細かな理解',
  '見抜く手掛かり',
  'ここでの誤り',
  '本文への適用場面',
  '入試の見抜き方',
  '定着段階アップ',
  'SRS段階',
  'SRS BOX',
  'カードで想起',
  '手掛かりを想起',
  '答えを隠して想起',
  '2択で確認',
  '語源の確認問題',
]

const files = await sourceFiles(sourceRoot)
// 廃止したのは2択の正誤問題を出す旧実装。語源そのものの暗記・テストは公開する。
for (const retired of ['src/components/EtymologyKnowledge.jsx']) {
  if (files.some((file) => path.relative(projectRoot, file) === retired)) {
    errors.push(`${retired}: 廃止した2択実装が残る`)
  }
}
for (const required of [
  'src/screens/EtymologyStudy.jsx',
  'src/screens/EtymologyQuiz.jsx',
  'src/lib/etymologyQuiz.js',
]) {
  if (!files.some((file) => path.relative(projectRoot, file) === required)) {
    errors.push(`${required}: 語源そのものの暗記・テスト実装がない`)
  }
}
for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(projectRoot, file)
  for (const forbidden of forbiddenRuntimeCopy) {
    if (source.includes(forbidden)) errors.push(`${relative}: 廃止表記「${forbidden}」`)
  }
}

// 公開画面と、そこへ製品用語を渡す共通モジュールでは、操作名を
// 「暗記」「テスト」に統一する。教材本文で通常の動詞として使う
// 「覚える」や、英単語 quiz 自体を扱う語義データはこの対象に含めない。
const learnerUiRoots = [
  path.join(sourceRoot, 'components'),
  path.join(sourceRoot, 'screens'),
]
const learnerTerminologyProviders = [
  'src/data/diagnostic.js',
  'src/data/etymology-compression.js',
  'src/data/kanbun-meta.js',
  'src/lib/appMenu.js',
  'src/lib/diagnostic.js',
  'src/lib/learningAnalyticsReport.js',
  'src/lib/learningPower.js',
  'src/lib/rpg.js',
].map((relative) => path.join(projectRoot, relative))
const learnerTerminologyFiles = [
  ...files.filter((file) => learnerUiRoots.some((root) => file.startsWith(`${root}${path.sep}`))),
  ...learnerTerminologyProviders,
]
for (const file of learnerTerminologyFiles) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(projectRoot, file)
  for (const match of source.matchAll(/覚える/g)) {
    errors.push(`${relative}: 製品用語「${match[0]}」を「暗記」へ統一できていない`)
  }
}

// 「クイズ」は公開実装全体で「テスト」に統一する。ただし、英単語 quiz の
// 語義や英文の忠実な和訳として必要な4表記だけは教材本文として保持する。
const allowedCurriculumQuizCopy = new Map([
  ['src/data/grammar-exam-patterns.js', ['クイズで一番多く正解した人は誰でも']],
  ['src/data/words-curriculum-1900-q-z.js', ['小テスト・クイズ']],
  ['src/data/words-etymology-completion.js', ['そのクイズは映画の雑学知識を試す']],
  ['src/data/writing.js', ['対話型クイズは学習者の弱点を特定できます']],
])
for (const file of files) {
  const relative = path.relative(projectRoot, file)
  let source = await readFile(file, 'utf8')
  for (const allowed of allowedCurriculumQuizCopy.get(relative) ?? []) {
    if (!source.includes(allowed)) errors.push(`${relative}: 教材上必要な「${allowed}」が見つからない`)
    source = source.replace(allowed, '')
  }
  for (const match of source.matchAll(/クイズ/g)) {
    errors.push(`${relative}: 製品用語「${match[0]}」を「テスト」へ統一できていない`)
  }
}

const readProjectFile = (relative) => readFile(path.join(projectRoot, relative), 'utf8')
const [
  instructorSource,
  grammarQuizSource,
  grammarChoiceExplanationsSource,
  homeSource,
  readerSource,
  readingSentenceDetailSource,
  appSource,
  shellSource,
  menuSource,
  progressBackupSource,
  storeSource,
  rootsSource,
  etymologyPackSource,
  rootDetailSource,
  myListSource,
  analyticsReportSource,
  learningContentSource,
  wordBitsSource,
  vocabStudySource,
  vocabQuizSource,
  sessionControlsSource,
  vocabCompletionReportSource,
] = await Promise.all([
  readProjectFile('src/components/InstructorExplanation.jsx'),
  readProjectFile('src/screens/GrammarQuiz.jsx'),
  readProjectFile('src/components/GrammarChoiceExplanations.jsx'),
  readProjectFile('src/screens/Home.jsx'),
  readProjectFile('src/screens/Reader.jsx'),
  readProjectFile('src/components/ReadingSentenceDetail.jsx'),
  readProjectFile('src/App.jsx'),
  readProjectFile('src/components/AppShell.jsx'),
  readProjectFile('src/components/SpeechSettings.jsx'),
  readProjectFile('src/components/ProgressBackup.jsx'),
  readProjectFile('src/store/useStore.js'),
  readProjectFile('src/screens/Roots.jsx'),
  readProjectFile('src/screens/EtymologyPack.jsx'),
  readProjectFile('src/screens/RootDetail.jsx'),
  readProjectFile('src/screens/MyList.jsx'),
  readProjectFile('src/lib/learningAnalyticsReport.js'),
  readProjectFile('src/lib/learningContentProgress.js'),
  readProjectFile('src/components/WordBits.jsx'),
  readProjectFile('src/screens/VocabStudy.jsx'),
  readProjectFile('src/screens/VocabQuiz.jsx'),
  readProjectFile('src/components/QuestionSessionControls.jsx'),
  readProjectFile('src/components/VocabCompletionReport.jsx'),
])

for (const label of ['根拠', '消去法', '考え方']) {
  if (!instructorSource.includes(`label: '${label}'`)) errors.push(`共通解説に「${label}」がない`)
}
if (!grammarQuizSource.includes('GrammarChoiceExplanations')) errors.push('英文法画面に選択肢解説部品がない')
if (!grammarChoiceExplanationsSource.includes('選択肢解説（3択すべて）')) {
  errors.push('英文法画面に正解を含む3択すべての解説がない')
}
if (!grammarQuizSource.includes('limitQuizChoices')) errors.push('英文法画面が3択に絞っていない')
if (/id: 'quiz'/.test(homeSource)) errors.push('英語ホームに重複したクイズ入口がある')
if (!homeSource.includes("id: 'vocab'")) errors.push('英語ホームの単語入口がない')
if (!homeSource.includes("id: 'etymology'") || !homeSource.includes("screen: 'roots'")) {
  errors.push('英語ホームから語源へ直接進めない')
}
// 一文の構文詳細は受験長文と語彙強化長文で共通の部品にまとめている。
const readerDetailSource = `${readerSource}\n${readingSentenceDetailSource}`
if (!readerDetailSource.includes('長文読解')) errors.push('Readerに「長文読解」がない')
if (!readerDetailSource.includes('文法解説')) errors.push('Readerに「文法解説」がない')
if (/learnerPhrasePairsForBlock|speakBlockPair/.test(readerDetailSource)) {
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
if (menuSource.includes('data-progress-discard-confirmation') || menuSource.includes('進捗は破棄されます')) {
  errors.push('途中の戻る操作に廃止した進捗破棄の確認が残っている')
}
if (shellSource.includes("openSpeechSettings('back')") || shellSource.includes('requiresProgressSaveConfirmation')) {
  errors.push('途中の戻る操作が確認を挟んでいる')
}
if (!menuSource.includes('requiresProgressSaveConfirmation')) errors.push('保存確認の画面判定がない')
if (!sessionControlsSource.includes('export function useUnfinishedSessionRecord')) {
  errors.push('途中でやめたテストの記録を残す共通処理がない')
}
if (!storeSource.includes('commitInterruptedSession') || !storeSource.includes('keepInterruptedSession')) {
  errors.push('途中でやめたテストの途中経過を預かる保存口がない')
}
if (!appSource.includes('commitInterruptedSession()')) {
  errors.push('画面が変わったときに途中でやめたテストを記録していない')
}
for (const relative of INTERRUPTED_SESSION_RECORD_SCREENS) {
  const source = await readProjectFile(relative)
  if (!source.includes('useUnfinishedSessionRecord(')) {
    errors.push(`${relative}: 途中でやめたときの学習記録を残していない`)
  }
}
// 英単語の暗記は画面内の`やめる`でも学習結果へ進み、答えたカードだけを数える。
if (!vocabStudySource.includes('onClick={stopSession}')) {
  errors.push('英単語の暗記の`やめる`が中断時の結果へ進んでいない')
}
if (!vocabStudySource.includes('const wordIds = answeredWordIds(answers)')
  || vocabStudySource.includes('wordIds: deck.map')) {
  errors.push('英単語の暗記が答えていない語まで今回の結果に数えている')
}
if (!vocabCompletionReportSource.includes('data-vocab-completion-interrupted')
  || !vocabCompletionReportSource.includes('途中でやめたので、答えた')) {
  errors.push('中断した暗記の結果に、答えた語数と残りの語数の案内がない')
}
if (!progressBackupSource.includes('selectProgressState')) errors.push('QR／コードが共通永続スライスを使っていない')
if (!progressBackupSource.includes('QRCodeCanvas')) errors.push('QR出力がない')
if (!progressBackupSource.includes('コードをコピー')) errors.push('進捗コード出力がない')

const expectedEtymologyModes = ['部品で分ける', '同じ語根', '形と由来', 'ことばの歴史']
const actualEtymologyModes = Object.values(ETYMOLOGY_MODE_META).map((item) => item.label)
if (actualEtymologyModes.join(',') !== expectedEtymologyModes.join(',')) {
  errors.push(`語源の4分類が平易な表示契約と不一致: ${actualEtymologyModes.join(',')}`)
}
const learnerEtymologySources = `${rootsSource}\n${etymologyPackSource}\n${rootDetailSource}\n${wordBitsSource}`
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
  errors.push('単語テストの解答直後に語源本文がない')
}
if (!vocabStudySource.includes('<EtymologyBlock')) {
  errors.push('単語カードの答えに語源本文がない')
}
if (!vocabQuizSource.includes('etymologyCardsForWord(word).length') ||
    !vocabStudySource.includes('etymologyCardsForWord(word).length')) {
  errors.push('単語の暗記・テストが確認済みカードの有無で語源表示を制限していない')
}
if (/語源をくわしく見る|くわしく見る/.test(`${vocabQuizSource}\n${vocabStudySource}`)) {
  errors.push('単語の語源本文が「くわしく見る」操作を必須にしている')
}
for (const [name, source] of [
  ['語源トップ', rootsSource],
  ['語源カード', etymologyPackSource],
  ['同じ語根', rootDetailSource],
]) {
  if (!source.includes('data-etymology-word-study-action')) {
    errors.push(`${name}から単語の「暗記」へ進めない`)
  }
  if (!source.includes("navigate('vocabStudy'")) {
    errors.push(`${name}が通常の単語暗記画面を使っていない`)
  }
  if (/単語クイズ/.test(source)) {
    errors.push(`${name}に廃止した表記「単語クイズ」が残る`)
  }
}
// 語源そのものも、単語・熟語と同じ「暗記・テスト・一覧を確認」の3導線をそろえる。
for (const [label, needle] of [
  ['暗記', "navigate('etymologyStudy'"],
  ['テスト', "navigate('etymologyQuiz'"],
  ['一覧を確認', 'NormalLearningRecordList'],
]) {
  if (!rootsSource.includes(needle)) errors.push(`語源トップに語根の「${label}」がない`)
}
if (!rootsSource.includes('英単語の学習記録に入ります')) {
  errors.push('語源トップが通常の単語暗記と記録を共有することを説明していない')
}
if (!/etymologyStudy: EtymologyStudyScreen/.test(appSource)
  || !/etymologyQuiz: EtymologyQuizScreen/.test(appSource)) {
  errors.push('語源の暗記・テスト画面が公開ルートにない')
}
if (!myListSource.includes('単語を暗記') || !myListSource.includes("navigate('vocabStudy'")) {
  errors.push('マイ学習ノートの語源項目から通常の単語暗記へ進めない')
}
if (!/domain === 'etymology'[\s\S]{0,600}screen: mode === 'memory' \? 'etymologyStudy' : 'etymologyQuiz'/.test(analyticsReportSource)) {
  errors.push('学習分析の語源導線が語源の暗記・テストへ進まない')
}
if (
  !learningContentSource.includes("srsContent('etymology'")
  || !learningContentSource.includes("'etymologySrs'")
) {
  errors.push('教材ごとの記録で語源が専用の学習記録を持っていない')
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
  if (pack.mode !== 'root' || pack.groupClaim !== 'manual-reviewed-root') {
    errors.push(`語源カード ${pack.id}: 手動監査済み語根カードではない`)
  }
  if (!pack.evidence?.reviewedAt || !pack.evidence?.fingerprint || !pack.evidence?.sources?.length) {
    errors.push(`語源カード ${pack.id}: 確認日・内容固定hash・出典がそろっていない`)
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
if (RESETTABLE_PROGRESS_FIELDS.length !== 45 || RESET_PRESERVED_PROGRESS_FIELDS.length !== 3) {
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
let grammarWrongChoicePaths = 0
for (const item of GRAMMAR) {
  const base = buildGrammarInstructorExplanation(item)
  if (!normalize(base.evidence).includes(normalize(item.explain))) {
    errors.push(`文法 ${item.id}: 根拠が設問固有の説明を含まない`)
  }
  if (!normalize(base.strategy) || normalize(base.strategy) === normalize(base.evidence)) {
    errors.push(`文法 ${item.id}: 考え方が独立した手順になっていない`)
  }
  for (const choice of item.choices) {
    grammarChoicePaths += 1
    const choiceReason = grammarChoiceExplanationFor(item, choice)
    const usage = grammarChoiceUsageFor(item, choice)
    if (!normalize(choiceReason).includes(normalize(choice)) || !normalize(choiceReason).includes(normalize(item.answer))) {
      errors.push(`文法 ${item.id}: 選択肢「${choice}」の根拠が選択肢と正答を比較しない`)
    }
    if (!usage?.summary || usage.status === 'unresolved') {
      errors.push(`文法 ${item.id}: 選択肢「${choice}」の使い方が未解決`)
    }
    if (choice === item.answer) continue
    grammarWrongChoicePaths += 1
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

// ── テーマ別の読み方が、項目の種類と深さに合っているか ────────────────
// 「このテーマの読み方」は、その種類の文章に何度でも使える手順でなければならない。
// 本文にいくつ出てきたかという中身は手順ではないので書かない。
const READING_TEXT_KINDS = [
  '物語', '案内', '告知', '説明文', '論説文', '評論', '報告', '記事', 'お知らせ', '手紙',
]
const CONTENT_COUNT = /[一二三四五六七八九十](?:者|つに分け|人に分け|種類に分け)/
const STEP_ACTION = /(る|す|く|つ|ぶ|む|う|ぐ|ぬ)$/

for (const passage of PASSAGES) {
  const approach = readingApproachForPassage(passage)
  if (!approach) {
    errors.push(`長文 ${passage.id}: テーマ別の読み方がない`)
    continue
  }
  if (!READING_TEXT_KINDS.some((kind) => approach.summary.includes(kind))) {
    errors.push(`長文 ${passage.id}: 読み方の説明が、どんな種類の文章の話か示していない`)
  }
  for (const text of [approach.title, approach.summary, ...approach.steps]) {
    if (CONTENT_COUNT.test(text)) {
      errors.push(`長文 ${passage.id}: 読み方に本文の中身の個数「${text}」が入っている`)
    }
  }
  for (const step of approach.steps) {
    if (!STEP_ACTION.test(step)) {
      errors.push(`長文 ${passage.id}: 手順「${step}」が動作で終わっていない`)
    }
  }
}

// 読解ルールも、段階（見通す→根拠で答える）ごとに手順が3つそろっていること。
for (const rule of READING_RULES) {
  if (rule.steps.length !== 3) errors.push(`読解ルール ${rule.id}: 手順が3つでない`)
  for (const step of rule.steps) {
    if (!STEP_ACTION.test(step)) {
      errors.push(`読解ルール ${rule.id}: 手順「${step}」が動作で終わっていない`)
    }
    if (CONTENT_COUNT.test(step)) {
      errors.push(`読解ルール ${rule.id}: 手順に本文の中身の個数が入っている`)
    }
  }
}

// ── 暗記カードは、どの教科でも同じように意味・答えを開ける ────────────
// 「タップして…を見る」を出す画面は、必ず画面上の切り替えも持たせる。
for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(projectRoot, file)
  // カード裏面の案内（「タップして◯◯を見る」）だけを対象にする。
  if (!/タップして[^「」]{0,12}(?:意味|答え)[^「」]{0,12}を見る/.test(source)) continue
  if (!source.includes('RevealAnswersToggle')) {
    errors.push(`${relative}: 「タップして見る」の切り替えが画面上にない`)
  }
}

if (PASSAGES.length < 24 || sentenceCount < 567) errors.push('長文の全対象数が基準を下回る')
if (longSentenceCount < 33) errors.push('長い一文の全対象数が基準を下回る')
if (GRAMMAR.length !== 3450 || grammarChoicePaths !== 13800 || grammarWrongChoicePaths !== 10350) {
  errors.push('英文法の全対象数が契約と不一致')
}

if (errors.length) {
  console.error(`学習者向け品質契約: ${errors.length}件の違反`)
  errors.slice(0, 80).forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(
  `学習者向け品質契約: 違反0 / 用語監査${learnerTerminologyFiles.length}ファイル / 語源${ALL_WORDS.length}語・${ETYMOLOGY_PACKS.length}カード / メニュー${APP_MENU_ITEMS.length}項目 / 履歴リセット${PROGRESS_RESET_GROUPS.length}分類・保存${PERSISTED_PROGRESS_FIELDS.length}項目 / 長文${PASSAGES.length}本・${sentenceCount}文・${phraseCount}フレーズ・${blockCount}ブロック / 長い一文${longSentenceCount}件・${longStepCount}フレーズ / 文法${GRAMMAR.length}問・4択根拠${grammarChoicePaths}件（誤答${grammarWrongChoicePaths}件）`,
)
