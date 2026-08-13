import { readFileSync } from 'node:fs'
import { ALL_WORDS, ETYMOLOGY_PACKS } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { LISTENING_ITEMS } from '../src/data/listening.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_CULTURE } from '../src/data/koten-culture.js'
import {
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
  grammar: GRAMMAR,
  listening: LISTENING_ITEMS,
  etymology: ETYMOLOGY_PACKS,
  kotenVocab: KOTEN_WORDS,
  kotenGrammar: KOTEN_GRAMMAR,
  kotenCulture: KOTEN_CULTURE,
}

if (NOTEBOOK_DOMAIN_IDS.length !== 8) fail(`分野数が8ではありません: ${NOTEBOOK_DOMAIN_IDS.length}`)

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
const created = createNotebookSet(sample, '8分野監査問題集', {
  description: '全分野の往復監査',
  timestamp: 300,
  randomPart: 'audit',
})
sample = created.notebook
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  sample = setNotebookSetItem(sample, created.setId, domain, sources[domain][0].id, true, 400)
}
sample = normalizeLearningNotebook(sample)
if (Object.keys(sample.entries).length !== 8) fail('8分野のメモを保存できません')
if (sample.sets[0]?.refs.length !== 8) fail('8分野混在の問題集を保存できません')
if (!sampleRefs.every((ref) => sample.sets[0]?.refs.includes(ref))) fail('問題集の安定参照が欠落しています')

const decoded = decodeProgress(encodeProgress({ learningNotebook: sample }))
if (decoded.learningNotebook?.sets?.[0]?.refs?.length !== 8) {
  fail('進捗コードで8分野問題集を往復できません')
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
for (const route of [
  'vocabStudy', 'vocabQuiz', 'phraseStudy', 'phraseQuiz', 'grammarQuiz',
  'listeningQuiz', 'etymologyStudy', 'kotenStudy', 'kotenQuiz',
  'kotenGrammarStudy', 'kotenGrammarQuiz', 'kotenCultureStudy', 'kotenCultureQuiz',
]) {
  if (!screen.includes(`'${route}'`)) fail(`統合画面から学習経路 ${route} へ接続していません`)
}

const store = read('../src/store/useStore.js')
for (const action of [
  'toggleNotebookItem', 'updateNotebookItem', 'createNotebookSet',
  'updateNotebookSet', 'deleteNotebookSet', 'setNotebookSetItem',
  'moveNotebookSetItem', 'recordNotebookSetLaunch',
]) {
  if (!store.includes(`${action}:`)) fail(`ストア操作不足: ${action}`)
}
for (const legacyField of ['myList', 'kotenWordList', 'kotenGrammarList', 'kotenCultureList']) {
  if (!store.includes(`${legacyField}:`)) fail(`旧保存互換不足: ${legacyField}`)
}

const progress = read('../src/lib/progressCode.js')
const cloud = read('../src/lib/cloudSync.js')
if (!progress.includes("'learningNotebook'")) fail('進捗コードにlearningNotebookがありません')
if (!cloud.includes('data.learningNotebook ?? current.learningNotebook')) {
  fail('旧クラウド保存からの復元時に端末ノートを保護していません')
}

const directSaveScreens = {
  phrases: ['PhraseStudy.jsx', 'PhraseQuiz.jsx'],
  grammar: ['GrammarQuiz.jsx'],
  listening: ['ListeningQuiz.jsx'],
  etymology: ['EtymologyStudy.jsx'],
}
for (const [domain, files] of Object.entries(directSaveScreens)) {
  for (const file of files) {
    const source = read(`../src/screens/${file}`)
    if (!source.includes(`toggleNotebookItem('${domain}'`)) {
      fail(`${file}: ${domain}の直接保存がありません`)
    }
  }
}

console.log('マイ学習ノート・全件監査')
for (const domain of NOTEBOOK_DOMAIN_IDS) {
  console.log(`  ${domain.padEnd(13)} ${sources[domain].length.toLocaleString()}件`)
}
console.log(`  合計            ${expectedTotal.toLocaleString()}件`)
console.log(`  永続参照        ${sample.sets[0]?.refs.length ?? 0}/8分野`)
console.log(`  エラー          ${errors.length}件`)

if (errors.length) {
  errors.forEach((error) => console.error(`❌ ${error}`))
  process.exitCode = 1
} else {
  console.log('✅ マイ学習ノート監査OK')
}
