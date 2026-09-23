#!/usr/bin/env node
// アプリが学習者に見せる日本語を、「中高生がそのまま読めるか」で1件ずつ見直した台帳の確認。
//
// 母集団は2つの入口から集める。
//  1) 教材データ: src/data の全モジュールが書き出す日本語の文字列（英語・古典・漢文・数学・名作朗読のすべて）
//  2) 画面の文言: .jsx と src/lib に書かれた日本語
// 見直しは2つの粒度でする。
//  glosses … 英単語・熟語の意味の欄（見出し語の訳語・ほかの意味・関連語の意味・熟語構文の意味）は、訳語1つずつ全文を読む。
//            「(水深の)尋(名)」のように、字は見慣れていても読み方・言い方が学習者に通じない訳語は、ここでしか捕まえられない。
//  runs    … そのほかの日本語は、漢字のかたまりごとに読む。
// 決め方: 1件ずつ人が読み、docs/audits/learner-japanese-review.json に次のどれかで記録する。
//   ok      … 中高生がそのまま読める
//   reading … 読みの台帳 src/data/meaning-readings.js で（よみ）を添えた
//   inline  … 本文の中に「琥珀（こはく）」のように読みを書いた
// 読めない・訳語として通じない語は、書き直して母集団から消す（台帳にも残らない）。
//
// 判定は人の目だけに頼らず、常用漢字表（joyo-kanji の2,136字）でも裏打ちする。
// 常用漢字表にない字を含む語を ok にするには、joyoExceptions に理由を書くか、読みを添える。
// 古典・漢文の教材は原文・古語・訓読文が本体で、別のルビの仕組み（KotenFurigana・訓点）を持つので、
// rubyMaterials のファイルに出る語はこの字の検査から外す（読むこと自体は外さない）。
import { readFileSync, writeFileSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { ALL_WORDS, etymologyStoryForWord } from '../../src/data/vocab.js'
import { PHRASES } from '../../src/data/phrases.js'
import { WORD_FORM_NOTES, WORD_FORM_EXTRAS, WORD_FORM_SENSES } from '../../src/data/word-forms.js'
import { WORD_USAGE_NOTES } from '../../src/data/word-usage-notes.js'
import { LOANWORD_HINTS } from '../../src/data/loanword-hints.js'
import { MEANING_READINGS } from '../../src/data/meaning-readings.js'
import { meaningSegments } from '../../src/lib/meaningReadings.js'

const require = createRequire(import.meta.url)
const { kanji: JOYO_KANJI } = require('joyo-kanji')
const JOYO = new Set(JOYO_KANJI)
const projectRoot = new URL('../../', import.meta.url)
const projectDir = fileURLToPath(projectRoot).replace(/\/$/, '')
export const LEARNER_JAPANESE_REVIEW_PATH = new URL('docs/audits/learner-japanese-review.json', projectRoot)

const KANJI_RUN = /[\p{Script=Han}々〆ヶ]+/gu
const JAPANESE = /[぀-ヿ㐀-鿿々]/u
// 繰り返しの印は字として数えない（人々・時々）。
const REPEAT_MARKS = new Set(['々', '〆', 'ヶ'])
// 「琥珀（こはく）」のように、本文の中に読みが書いてあるか。
const inlineReadingAfter = (text, end) => /^[(（][ぁ-ゖー・=＝]/u.test(text.slice(end, end + 3))

/** 常用漢字表にない字を含むか（繰り返しの印は除く）。 */
export const hasNonJoyo = (run) => [...run].some((char) => !REPEAT_MARKS.has(char) && !JOYO.has(char))

/** 英単語・熟語の「意味の欄」の文（[本文, 欄, どこ]）。欄が meaning のものだけ、読みの台帳が画面に効く。 */
export function learnerJapaneseTexts() {
  const rows = []
  const push = (text, field, at) => { if (text != null && String(text).trim()) rows.push([String(text), field, at]) }
  for (const word of ALL_WORDS) {
    for (const t of word.meanings ?? []) push(t, 'meaning', word.id)
    for (const sense of word.otherSenses ?? []) {
      push(sense.meaning, 'meaning', word.id)
      push(sense.note, 'note', word.id)
      push(sense.example?.ja, 'example', word.id)
    }
    for (const key of ['synonyms', 'antonyms', 'derivatives']) {
      for (const item of word[key] ?? []) push(item.m, 'meaning', `${word.id}>${item.w}`)
    }
    push(word.example?.ja, 'example', word.id)
    push(word.usage, 'note', word.id)
    for (const guide of word.usageGuides ?? []) {
      push(typeof guide === 'string' ? guide : (guide?.text ?? guide?.note ?? guide?.usage), 'note', word.id)
    }
    push(etymologyStoryForWord(word)?.note, 'note', word.id)
  }
  for (const [id, note] of Object.entries(WORD_FORM_NOTES)) push(note, 'note', `form:${id}`)
  // ほかの品詞の形は [元の語, 形, 品詞, 意味, 発音記号] の並び。
  for (const [base, form, , meaning] of WORD_FORM_EXTRAS) push(meaning, 'meaning', `extra:${base}>${form}`)
  // 別の品詞でも使う語の意味は [品詞, 意味] の並び。
  for (const [id, senses] of Object.entries(WORD_FORM_SENSES)) {
    for (const [, meaning] of senses ?? []) push(meaning, 'meaning', `formSense:${id}`)
  }
  for (const [id, note] of Object.entries(WORD_USAGE_NOTES)) {
    push(typeof note === 'string' ? note : note?.note ?? note?.text, 'note', `usage:${id}`)
  }
  for (const [id, hint] of Object.entries(LOANWORD_HINTS)) push(hint?.note, 'note', `loan:${id}`)
  for (const phrase of PHRASES) {
    for (const t of phrase.meanings ?? [phrase.meaning]) push(t, 'phraseMeaning', phrase.id)
    push(phrase.example?.ja, 'example', phrase.id)
    push(phrase.note, 'note', phrase.id)
    push(phrase.origin, 'note', phrase.id)
  }
  return rows
}

/** 意味の欄に出る訳語の全種類（重複を除く）。 */
export function learnerMeaningGlosses() {
  const glosses = new Set()
  for (const [text, field] of learnerJapaneseTexts()) {
    if (field === 'meaning' || field === 'phraseMeaning') glosses.add(text)
  }
  return glosses
}

const listFiles = async (dir, match) => {
  const out = []
  const walk = async (current) => {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name)
      if (entry.isDirectory()) await walk(full)
      else if (match(entry.name)) out.push(full)
    }
  }
  await walk(dir)
  return out.sort()
}

/** 教材データ（src/data の全モジュール）が書き出す日本語の文字列。[本文, ファイル] の並び。 */
export async function materialTexts() {
  const root = path.join(projectDir, 'src/data')
  const files = await listFiles(root, (name) => name.endsWith('.js'))
  const rows = []
  for (const file of files) {
    const relative = path.relative(projectDir, file)
    let module
    try { module = await import(pathToFileURL(file).href) } catch { continue }
    const seen = new Set()
    const visit = (value, depth) => {
      if (depth > 14 || value == null) return
      if (typeof value === 'string') { if (JAPANESE.test(value)) rows.push([value, relative]); return }
      if (typeof value !== 'object' || seen.has(value)) return
      seen.add(value)
      for (const item of Array.isArray(value) ? value : Object.values(value)) visit(item, depth + 1)
    }
    for (const value of Object.values(module)) visit(value, 0)
  }
  return rows
}

/** 画面の文言（.jsx と src/lib）に書かれた日本語。[本文, ファイル] の並び。 */
export async function screenTexts() {
  const srcRoot = path.join(projectDir, 'src')
  const files = await listFiles(srcRoot, (name) => name.endsWith('.jsx') || name.endsWith('.js'))
  const rows = []
  for (const file of files) {
    const relative = path.relative(projectDir, file)
    if (!(relative.endsWith('.jsx') || relative.startsWith('src/lib/'))) continue
    const source = await readFile(file, 'utf8')
    for (const match of source.matchAll(/(['"`])((?:[^\\\n]|\\.)*?)\1/g)) {
      if (JAPANESE.test(match[2])) rows.push([match[2], relative])
    }
    for (const match of source.matchAll(/>([^<>{}]*[぀-ヿ㐀-鿿々][^<>{}]*)</g)) {
      rows.push([match[1], relative])
    }
  }
  return rows
}

/**
 * 母集団の漢字のかたまりを、いま画面でどう見えるかで分ける。
 * reading: 意味の欄で読みの台帳が当たる語／inline: 本文に読みが書いてある語／plain: 読みの手当てがない語。
 */
export async function learnerJapaneseRuns() {
  const runs = new Map()
  const mark = (run, kind, where) => {
    const current = runs.get(run) ?? { kinds: new Set(), where: new Set(), plainWhere: new Set(), count: 0 }
    current.kinds.add(kind)
    if (current.where.size < 4) current.where.add(where)
    // 読みの手当てがないまま出る場所は、常用漢字表の検査で使うので全部おぼえておく。
    if (kind === 'plain') current.plainWhere.add(where)
    current.count += 1
    runs.set(run, current)
  }
  // 英単語・熟語の欄は <MeaningText> を通すので、読みの台帳がそのまま画面に出る。
  const scan = (text, { reading, where }) => {
    for (const segment of meaningSegments(text)) {
      if (segment.entry) { mark(segment.entry, reading ? 'reading' : 'plain', where); continue }
      for (const match of segment.text.matchAll(KANJI_RUN)) {
        const end = match.index + match[0].length
        mark(match[0], inlineReadingAfter(segment.text, end) ? 'inline' : 'plain', where)
      }
    }
  }
  const covered = new Set()
  for (const [text, field, at] of learnerJapaneseTexts()) {
    covered.add(text)
    scan(text, { reading: true, where: at })
  }
  const ledger = JSON.parse(readFileSync(LEARNER_JAPANESE_REVIEW_PATH, 'utf8'))
  // 長文の和訳・名作の訳も <MeaningText> を通すので、その教材のファイルは読みが画面に出る。
  const readingSurfaces = ledger.readingSurfaces ?? []
  const showsReadings = (file) => readingSurfaces.some((prefix) => file.startsWith(prefix))
  const skipFiles = ledger.notLearnerFacing ?? []
  for (const [text, file] of await materialTexts()) {
    if (covered.has(text) || skipFiles.some((prefix) => file.startsWith(prefix))) continue
    scan(text, { reading: showsReadings(file), where: file })
  }
  for (const [text, file] of await screenTexts()) {
    if (covered.has(text) || skipFiles.some((prefix) => file.startsWith(prefix))) continue
    scan(text, { reading: showsReadings(file), where: file })
  }
  return runs
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const ledger = JSON.parse(readFileSync(LEARNER_JAPANESE_REVIEW_PATH, 'utf8'))
  const runs = await learnerJapaneseRuns()
  const decisions = new Map()
  for (const [decision, list] of Object.entries(ledger.decisions)) {
    for (const run of list) decisions.set(run, decision)
  }
  const exceptions = ledger.joyoExceptions ?? {}
  const rubyMaterials = ledger.rubyMaterials ?? []
  const isRubyMaterial = (where) => rubyMaterials.some((prefix) => where.startsWith(prefix))

  if (process.argv.includes('--write')) {
    // 人が読んで決めたあとに、台帳を書き直す。読んでいない run をそのまま ok にしないこと。
    const next = { ok: [], reading: [], inline: [] }
    for (const [run, info] of runs) {
      if (info.kinds.has('reading')) next.reading.push(run)
      else if (decisions.get(run) === 'inline') next.inline.push(run)
      else next.ok.push(run)
    }
    for (const key of Object.keys(next)) next[key].sort((a, b) => a.localeCompare(b, 'ja'))
    ledger.decisions = next
    ledger.glosses = [...learnerMeaningGlosses()].sort((a, b) => a.localeCompare(b, 'ja'))
    ledger.joyoExceptions = Object.fromEntries(
      Object.entries(exceptions).filter(([run]) => runs.has(run)).sort(([a], [b]) => a.localeCompare(b, 'ja')),
    )
    ledger.counts = {
      訳語: ledger.glosses.length,
      run: runs.size,
      ...Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v.length])),
      常用外の例外: Object.keys(ledger.joyoExceptions).length,
    }
    writeFileSync(LEARNER_JAPANESE_REVIEW_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
    console.log('台帳を書き直した', ledger.counts)
    process.exit(0)
  }

  const problems = []
  const unreviewed = []
  const unreadableJoyo = []
  for (const [run, info] of runs) {
    const decision = decisions.get(run)
    if (!decision) { unreviewed.push(`${run}（${[...info.where].join(' / ')}）`); continue }
    if (info.kinds.has('reading') && decision !== 'reading') {
      problems.push(`「${run}」は読みの台帳が当たる語なので reading に置く（いまは ${decision}）`)
    }
    if (decision === 'reading' && !info.kinds.has('reading')) {
      problems.push(`「${run}」は reading だが、意味の欄で読みが当たっていない（${[...info.where].join(' / ')}）`)
    }
    if (decision === 'inline' && !info.kinds.has('inline')) {
      problems.push(`「${run}」は inline だが、本文のどこにも読みを書いていない（${[...info.where].join(' / ')}）`)
    }
    if (decision !== 'reading' && hasNonJoyo(run) && !exceptions[run]) {
      // 読みの手当てがないまま出る場所が、ルビの仕組みを持つ教材の外に1か所でもあれば止める。
      const bare = [...info.plainWhere].filter((where) => !isRubyMaterial(where))
      if (bare.length) unreadableJoyo.push(`${run}（${bare.slice(0, 3).join(' / ')}）`)
    }
  }
  for (const run of decisions.keys()) {
    if (!runs.has(run)) problems.push(`「${run}」は台帳にあるが、もう教材のどこにも出てこない`)
  }
  for (const run of Object.keys(exceptions)) {
    if (!runs.has(run)) problems.push(`常用外の例外「${run}」は、もう教材のどこにも出てこない`)
    else if (!hasNonJoyo(run)) problems.push(`常用外の例外「${run}」は常用漢字だけでできている`)
  }
  // 読みの台帳に載せたのに、もう教材のどこにも出てこない語は落とす。
  const usedEntries = new Set()
  for (const [run, info] of runs) if (info.kinds.has('reading') || info.kinds.has('plain')) usedEntries.add(run)
  for (const [text] of MEANING_READINGS) {
    if (!usedEntries.has(text)) problems.push(`読みの台帳の「${text}」は、もう教材のどこにも出てこない`)
  }
  // 意味の欄は訳語1つずつ読む。新しい訳語・書き換えた訳語は、読むまでここで止まる。
  const reviewedGlosses = new Set(ledger.glosses ?? [])
  const glosses = learnerMeaningGlosses()
  const unreviewedGlosses = [...glosses].filter((text) => !reviewedGlosses.has(text))
  for (const text of reviewedGlosses) {
    if (!glosses.has(text)) problems.push(`訳語「${text}」は台帳にあるが、もう意味の欄に出てこない`)
  }

  const total = unreviewed.length + unreviewedGlosses.length + unreadableJoyo.length + problems.length
  if (total) {
    console.log(`❌ 学習者向け日本語の見直し: ${total}件`)
    for (const row of unreviewedGlosses.slice(0, 30)) console.log(`  - まだ読んでいない訳語: ${row}`)
    if (unreviewedGlosses.length > 30) console.log(`  - ほか ${unreviewedGlosses.length - 30}件の訳語`)
    for (const row of unreviewed.slice(0, 30)) console.log(`  - まだ読んでいない漢字語: ${row}`)
    if (unreviewed.length > 30) console.log(`  - ほか ${unreviewed.length - 30}件の漢字語`)
    for (const row of unreadableJoyo.slice(0, 30)) console.log(`  - 常用漢字表にない字を含む: ${row}`)
    if (unreadableJoyo.length > 30) console.log(`  - ほか ${unreadableJoyo.length - 30}件`)
    for (const row of problems.slice(0, 30)) console.log(`  - ${row}`)
    if (problems.length > 30) console.log(`  - ほか ${problems.length - 30}件`)
    console.log('  直し方: 1件ずつ読み、中高生がそのまま読めて意味が分かるなら docs/audits/learner-japanese-review.json に足す。')
    console.log('          読めないなら訳語・本文を書き直すか、意味の欄なら src/data/meaning-readings.js に読みを載せる。')
    console.log('          常用漢字表にない字は、読みを添えるか、joyoExceptions に理由を書く。')
    process.exit(1)
  }
  console.log(`✅ 学習者向け日本語: 訳語${glosses.size}件・漢字語${runs.size}件すべて見直し済み`
    + `（読みを添えた語 ${ledger.decisions.reading.length}件・本文に読みを書いた語 ${ledger.decisions.inline.length}件`
    + `・常用外の例外 ${Object.keys(exceptions).length}件）`)
}
