import { readFileSync } from 'node:fs'
import { ALL_WORDS, ETYMOLOGY_PACKS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { GRAMMAR_PRACTICE } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { DICTATION_ITEMS } from '../src/data/dictation.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_CULTURE } from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../src/data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES } from '../src/data/kanbun-kundoku.js'
import {
  LEGACY_SAVED_LIST_FIELDS,
  NOTEBOOK_DOMAIN_IDS,
  createLearningNotebook,
  createNotebookSet,
  normalizeLearningNotebook,
  notebookRef,
  setNotebookItemSaved,
  setNotebookSetItem,
  updateNotebookItem,
} from '../src/lib/learningNotebook.js'
import {
  NOTEBOOK_CATALOG_COUNTS,
  NOTEBOOK_TOTAL_ITEMS,
  notebookItemsForDomain,
  resolveNotebookItem,
} from '../src/lib/learningNotebookCatalog.js'
import {
  PERSISTED_PROGRESS_FIELDS,
  decodeProgress,
  encodeProgress,
} from '../src/lib/progressCode.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const errors = []
const fail = (message) => errors.push(message)

const sources = {
  vocab: ALL_WORDS,
  phrases: PHRASES,
  grammar: GRAMMAR_PRACTICE,
  listening: LISTENING_ITEMS,
  dictation: DICTATION_ITEMS,
  etymology: ETYMOLOGY_PACKS,
  kotenVocab: KOTEN_WORDS,
  kotenGrammar: KOTEN_GRAMMAR,
  kotenCulture: KOTEN_CULTURE,
  kotenInterpretation: KOTEN_INTERPRETATIONS,
  kanbunVocab: KANBUN_VOCAB,
  kanbunGrammar: KANBUN_GRAMMAR,
  kanbunCulture: KANBUN_CULTURE,
  kanbunKundoku: KANBUN_KUNDOKU_EXERCISES,
}
const domainCount = NOTEBOOK_DOMAIN_IDS.length

if (domainCount !== 14) fail(`教材の種類が14ではありません: ${domainCount}`)
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  if (!sources[domain]) fail(`${domain}: 監査する正本データがありません`)
}

for (const domain of NOTEBOOK_DOMAIN_IDS) {
  const source = sources[domain] ?? []
  const catalog = notebookItemsForDomain(domain)
  if (catalog.length !== source.length) {
    fail(`${domain}: 正本${source.length}件に対し統合カタログ${catalog.length}件`)
  }
  if (NOTEBOOK_CATALOG_COUNTS[domain] !== source.length) {
    fail(`${domain}: 公開件数${NOTEBOOK_CATALOG_COUNTS[domain]}が正本${source.length}と不一致`)
  }

  const ids = new Set()
  source.forEach((raw, index) => {
    if (typeof raw?.id !== 'string' || !raw.id) {
      fail(`${domain}[${index}]: 安定IDがありません`)
      return
    }
    if (ids.has(raw.id)) fail(`${domain}: ID重複 ${raw.id}`)
    ids.add(raw.id)
    const ref = notebookRef(domain, raw.id)
    const item = resolveNotebookItem(ref)
    if (!item || item.raw !== raw || item.id !== raw.id) {
      fail(`${domain}:${raw.id}: 正本と統合参照が一対一ではありません`)
    }
    if (!item?.title || !item?.searchText) {
      fail(`${domain}:${raw.id}: 見出しまたは検索索引が空です`)
    }
  })
}

const expectedTotal = Object.values(sources).reduce((sum, items) => sum + items.length, 0)
if (NOTEBOOK_TOTAL_ITEMS !== expectedTotal) {
  fail(`全件数が不一致: 統合${NOTEBOOK_TOTAL_ITEMS} / 正本${expectedTotal}`)
}

let sample = createLearningNotebook()
const sampleRefs = []
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  const itemId = sources[domain][0].id
  sample = setNotebookItemSaved(sample, domain, itemId, true, 100)
  sample = updateNotebookItem(sample, domain, itemId, {
    note: `${domain}の監査メモ`,
    tags: ['監査', domain],
  }, 200)
  sampleRefs.push(notebookRef(domain, itemId))
}
const created = createNotebookSet(sample, '全教材監査単語帳', {
  description: '全教材の往復監査',
  timestamp: 300,
  randomPart: 'audit',
})
sample = created.notebook
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  sample = setNotebookSetItem(sample, created.setId, domain, sources[domain][0].id, true, 400)
}
sample = normalizeLearningNotebook(sample)
if (Object.keys(sample.entries).length !== domainCount) fail('全教材のメモを保存できません')
if (sample.sets[0]?.refs.length !== domainCount) fail('全教材が混ざった単語帳を保存できません')
if (!sampleRefs.every((ref) => sample.sets[0]?.refs.includes(ref))) fail('問題集の安定参照が欠落しています')

const decoded = decodeProgress(encodeProgress({ learningNotebook: sample }))
if (decoded.learningNotebook?.sets?.[0]?.refs?.length !== domainCount) {
  fail('進捗コードで全教材の単語帳を往復できません')
}
if (!PERSISTED_PROGRESS_FIELDS.includes('learningNotebook')) {
  fail('learningNotebook が一元永続化契約にありません')
}

const screen = read('../src/screens/MyList.jsx')
for (const marker of [
  'data-learning-notebook-screen',
  'data-notebook-library',
  'data-notebook-workbooks',
  'data-notebook-history',
  'data-notebook-note-editor',
  'data-notebook-set-editor',
]) {
  if (!screen.includes(marker)) fail(`統合画面の機能マーカー不足: ${marker}`)
}
// 単語帳から学ぶ行き先は1か所（wordBookLaunch.js）で決め、ノート・単語画面・各コンテンツのトップが同じものを使う。
const launch = read('../src/lib/wordBookLaunch.js')
for (const route of [
  'vocabStudy', 'vocabQuiz', 'phraseStudy', 'phraseQuiz', 'grammarQuiz',
  'listeningQuiz', 'dictationPlay', 'etymologyStudy', 'etymologyQuiz', 'kotenStudy', 'kotenQuiz',
  'kotenGrammarStudy', 'kotenGrammarQuiz', 'kotenCultureStudy', 'kotenCultureQuiz',
  'kotenInterpretationPrep', 'kanbunStudy', 'kanbunQuiz', 'kanbunKundokuQuiz',
]) {
  if (!launch.includes(`'${route}'`)) fail(`単語帳の行き先に学習経路 ${route} がありません`)
}
if (!screen.includes('wordBookLaunchTarget(domainId, mode, ids')) {
  fail('統合画面が単語帳と同じ行き先を使っていません')
}
const etymologyLaunch = screen.slice(
  screen.indexOf("if (domainId === 'etymology' && mode === 'words') {"),
  screen.indexOf('const target = wordBookLaunchTarget('),
)
if (!etymologyLaunch.includes("navigate('vocabStudy'")) {
  fail('語源ノートが単語の「暗記」へ接続していません')
}
if (/vocabQuiz/.test(etymologyLaunch)) {
  fail('語源ノートに廃止した単語テストへの接続が残っています')
}
if (!screen.includes("domain.id === 'etymology' ? (") || !screen.includes('単語を暗記')) {
  fail('語源の自作問題集に単語の「暗記」を表示する契約がありません')
}
if (/domain\.id === 'etymology' \? '確認'/.test(screen)) {
  fail('語源の自作問題集に廃止した確認ボタンが残っています')
}
if (!screen.includes("const mode = domainId === 'etymology' && requestedMode === 'words'")) {
  fail('語源ノートの起動記録が語根と単語を区別していません')
}

const store = read('../src/store/useStore.js')
for (const action of [
  'toggleNotebookItem', 'updateNotebookItem', 'createNotebookSet',
  'updateNotebookSet', 'deleteNotebookSet', 'setNotebookSetItem', 'setNotebookSetItems',
  'moveNotebookSet', 'moveNotebookSetItem', 'recordNotebookSetLaunch', 'setNotebookSetRefs',
]) {
  if (!store.includes(`${action}:`)) fail(`ストア操作不足: ${action}`)
}
// 以前の古典・漢文の登録リストは保存項目から外し、どこから読んでも単語帳へ移す。
for (const legacyField of LEGACY_SAVED_LIST_FIELDS) {
  if (PERSISTED_PROGRESS_FIELDS.includes(legacyField)) fail(`以前の登録リスト ${legacyField} が保存項目に残っています`)
}
for (const [label, text] of [
  ['端末保存・進捗コード', store],
  ['クラウド', read('../src/lib/cloudSync.js')],
  ['進捗コードの要約', read('../src/lib/progressCode.js')],
]) {
  if (!text.includes('foldLegacySavedLists(')) fail(`旧保存互換不足: ${label}の登録リストを単語帳へ移していません`)
}
// 以前の「マイ単語」（myList）は、端末保存・進捗コード・クラウドのどこから読んでも単語帳の1冊へ移す。
for (const [label, source, needle] of [
  ['端末保存', 'store', 'foldLegacyMyWords(state.learningNotebook, state.myList)'],
  ['進捗コード', 'store', 'foldLegacyMyWords(payload.learningNotebook, payload.myList)'],
  ['クラウド', 'cloud', 'data.myList,'],
]) {
  const text = source === 'store' ? store : read('../src/lib/cloudSync.js')
  if (!text.includes(needle)) fail(`旧保存互換不足: ${label}の myList を単語帳へ移していません`)
}

const progress = read('../src/lib/progressCode.js')
const cloud = read('../src/lib/cloudSync.js')
if (!progress.includes("'learningNotebook'")) fail('進捗コードにlearningNotebookがありません')
if (!cloud.includes('data.learningNotebook ?? current.learningNotebook')) {
  fail('旧クラウド保存からの復元時に端末ノートを保護していません')
}

// 暗記・テストのカードからは、どの教材も入れる単語帳を選ぶ窓を開く。
const wordBookScreens = {
  phrases: ['PhraseStudy.jsx', 'PhraseQuiz.jsx'],
  grammar: ['GrammarQuiz.jsx'],
  listening: ['ListeningQuiz.jsx'],
  dictation: ['DictationPlay.jsx'],
  etymology: ['EtymologyStudy.jsx', 'EtymologyQuiz.jsx'],
  kotenVocab: ['KotenStudy.jsx', 'KotenQuiz.jsx'],
  kotenGrammar: ['KotenGrammarStudy.jsx'],
  kotenCulture: ['KotenCultureStudy.jsx'],
  kanbunKundoku: ['KanbunKundokuQuiz.jsx'],
}
for (const [domain, files] of Object.entries(wordBookScreens)) {
  for (const file of files) {
    const source = read(`../src/screens/${file}`)
    if (!source.includes(`<WordBookToggle domain="${domain}"`)) {
      fail(`${file}: ${domain}を単語帳へ入れるボタンがありません`)
    }
  }
}

console.log('マイ学習ノート・全件監査')
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  console.log(`  ${domain.padEnd(13)} ${sources[domain].length.toLocaleString()}件`)
}
console.log(`  合計            ${expectedTotal.toLocaleString()}件`)
console.log(`  永続参照        ${sample.sets[0]?.refs.length ?? 0}/${domainCount}教材`)
console.log(`  エラー          ${errors.length}件`)

if (errors.length) {
  errors.forEach((error) => console.error(`❌ ${error}`))
  process.exitCode = 1
} else {
  console.log('✅ マイ学習ノート監査OK')
}
