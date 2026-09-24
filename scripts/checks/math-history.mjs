#!/usr/bin/env node
// 数学の歴史をたどるコース（src/data/math-history.js）の確認。依頼台帳 requests/2026-09-24-math-history.json の check。
//
//   basics   … 算数の基本33項目のすべてに、第1部（算数の基本）の話が1話以上ある
//   units    … 数学の45単元のすべてに、つながる話が1話以上あり、単元の導入と話の両方から行き来できる
//   chapters … 全話が、年代・場所・人物・問い・筋道（3段落以上）・動かす図・今の使われ方（2件以上）・
//              つながる学習・テスト（3問以上、3択、全選択肢の説明）をそろえている
//   facts    … 全話の史実を確かめた記録（docs/audits/math-history-facts.json）が、いまの本文と一致する
//              （本文を変えたら、読み直して --stamp <話ID> で記録を押し直すまで通らない）
//   引数なし … 4つとも
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import {
  MATH_BASICS,
  MATH_HISTORY_CHAPTERS,
  MATH_HISTORY_PARTS,
  MATH_HISTORY_THEME_COLORS,
} from '../../src/data/math-history.js'
import { MATH_UNITS } from '../../src/data/math.js'

const ROOT = new URL('../../', import.meta.url)
export const FACTS_PATH = new URL('docs/audits/math-history-facts.json', ROOT)
const read = (relative) => readFileSync(new URL(relative, ROOT), 'utf8')

export const FACT_STATUSES = Object.freeze({
  established: '確かな史実',
  approximate: '年代・数値に幅がある（本文で「ごろ」「約」などと書く）',
  debated: '説が分かれる（本文で「考えられている」「説がある」などと書く）',
  legend: '伝説・言い伝え（本文で「伝えられる」などと書く）',
})
// 確かでない記述の本文に要る言い回し。
const HEDGES = {
  approximate: /ごろ|約|およそ|ほど|前後|遅くとも|までに|世紀|年代|あまり|近く/u,
  debated: /考えられ|説が|説も|とされ|見られ|ではないか|らしい|言われ/u,
  legend: /伝えられ|伝わ|言い伝え|伝説|逸話|言われ|話が残/u,
}

/** 話の学習者に見せる文を1つの文字列にする（史実の記録と突き合わせる本文）。 */
export function chapterText(chapter) {
  return [
    chapter.title,
    chapter.headline,
    chapter.era,
    chapter.place,
    ...chapter.people,
    chapter.question,
    ...chapter.story,
    chapter.visual?.instruction,
    ...chapter.uses.flatMap((use) => [use.title, use.text]),
    ...chapter.quiz.flatMap((question) => [
      question.question,
      ...question.choices,
      question.explanation,
      ...question.notes,
    ]),
  ].filter((part) => typeof part === 'string').join('\n')
}

export const chapterTextHash = (chapter) => createHash('sha256').update(chapterText(chapter)).digest('hex')

const hasText = (value) => typeof value === 'string' && value.trim().length > 0

/** 動かす図の名前（src/components/math-history/ の各ファイルの ◯◯_SCENES のキー）。 */
export function sceneNames() {
  const names = new Set()
  const directory = new URL('src/components/math-history/', ROOT)
  for (const file of readdirSync(directory).filter((name) => name.endsWith('.jsx'))) {
    const source = readFileSync(new URL(file, directory), 'utf8')
    for (const match of source.matchAll(/export const [A-Z_]+_SCENES = Object\.freeze\(\{([\s\S]*?)\}\)/g)) {
      for (const key of match[1].matchAll(/^\s*'?([a-z0-9-]+)'?\s*:/gmu)) names.add(key[1])
    }
  }
  return names
}

function valueSets(controls) {
  return controls.reduce((sets, control) => {
    const choices = control.type === 'range'
      ? Array.from(
        { length: Math.round((control.max - control.min) / control.step) + 1 },
        (_, index) => Number((control.min + index * control.step).toFixed(10)),
      )
      : control.options.map((option) => option.value)
    return sets.flatMap((values) => choices.map((choice) => ({ ...values, [control.id]: choice })))
  }, [{}])
}

export function checkChapters() {
  const problems = []
  const scenes = sceneNames()
  const partIds = new Set(MATH_HISTORY_PARTS.map((part) => part.id))
  const unitIds = new Set(MATH_UNITS.map((unit) => unit.id))
  const basicIds = new Set(MATH_BASICS.map((basic) => basic.id))
  const ids = new Set()
  const questionIds = new Set()
  let partIndex = 0
  for (const chapter of MATH_HISTORY_CHAPTERS) {
    const at = chapter.id ?? '(id なし)'
    const fail = (message) => problems.push(`${at}: ${message}`)
    if (!/^mh-[a-z0-9-]+$/.test(chapter.id ?? '')) fail('id は mh- で始まる英小文字')
    if (ids.has(chapter.id)) fail('id が重複')
    ids.add(chapter.id)
    if (!partIds.has(chapter.part)) fail(`part「${chapter.part}」がない`)
    // 学ぶ順：算数の基本 → 中学 → 高校（部が戻らない）。
    const index = MATH_HISTORY_PARTS.findIndex((part) => part.id === chapter.part)
    if (index < partIndex) fail('部の並び（算数の基本 → 中学 → 高校）が戻っている')
    partIndex = Math.max(partIndex, index)
    if (!Object.hasOwn(MATH_HISTORY_THEME_COLORS, chapter.theme)) fail(`分野「${chapter.theme}」の色がない`)
    for (const key of ['emoji', 'title', 'headline', 'era', 'place', 'question']) {
      if (!hasText(chapter[key])) fail(`${key} がない`)
    }
    // 数式として描かない欄（目次・見出し・操作の名前など）に、数式の書き方を入れない。
    const plain = [
      chapter.title, chapter.headline, chapter.era, chapter.place, ...(chapter.people ?? []),
      chapter.visual?.instruction, ...(chapter.visual?.controls ?? []).flatMap((control) => [
        control.label, ...(control.options ?? []).map((option) => option.label),
      ]),
      ...(chapter.uses ?? []).map((use) => use.title),
    ]
    for (const text of plain) {
      if (typeof text === 'string' && /[$\\]/.test(text)) fail(`数式として描かない欄に $ や \\ がある：${text}`)
    }
    if (!Number.isFinite(chapter.year)) fail('year（年代順に並べる年）が数でない')
    if (!Array.isArray(chapter.people) || chapter.people.some((person) => !hasText(person))) fail('people は人物名の配列')
    if (!Array.isArray(chapter.story) || chapter.story.length < 3 || chapter.story.some((paragraph) => !hasText(paragraph))) {
      fail('発見の筋道（story）が3段落に満たない')
    }
    const visual = chapter.visual
    if (!visual || !scenes.has(visual.scene)) fail(`動かす図「${visual?.scene}」が MathHistoryVisual.jsx にない`)
    if (!hasText(visual?.instruction)) fail('動かす図の説明（instruction）がない')
    if (!Array.isArray(visual?.controls) || !visual.controls.length) fail('動かす図の操作がない')
    else {
      for (const control of visual.controls) {
        if (!hasText(control.id) || !hasText(control.label)) fail('操作に id・label がない')
        if (control.type === 'range') {
          const ok = [control.min, control.max, control.step, control.initial].every(Number.isFinite)
            && control.step > 0 && control.min < control.max
            && control.initial >= control.min && control.initial <= control.max
          if (!ok) fail(`操作「${control.label}」の範囲が正しくない`)
        } else if (control.type === 'options') {
          if (!control.options?.some((option) => option.value === control.initial)) fail(`操作「${control.label}」の初期値が選択肢にない`)
        } else fail(`操作「${control.label}」の種類が range・options でない`)
      }
      const sets = valueSets(visual.controls)
      if (sets.length > 5000) fail(`操作の組み合わせが多すぎる（${sets.length}）`)
      for (const values of sets) {
        const formula = visual.formula(values)
        const insight = visual.insight(values)
        if (!hasText(formula) || /NaN|undefined|Infinity/.test(formula)) fail(`式が作れない ${JSON.stringify(values)}`)
        if (!hasText(insight) || /NaN|undefined|Infinity/.test(insight)) fail(`気づきの文が作れない ${JSON.stringify(values)}`)
      }
    }
    if (!Array.isArray(chapter.uses) || chapter.uses.length < 2) fail('今の使われ方が2件に満たない')
    for (const use of chapter.uses ?? []) {
      if (!hasText(use.emoji) || !hasText(use.title) || !hasText(use.text)) fail('今の使われ方に emoji・title・text がない')
    }
    for (const unitId of chapter.units ?? []) if (!unitIds.has(unitId)) fail(`単元「${unitId}」がない`)
    for (const basicId of chapter.basics ?? []) if (!basicIds.has(basicId)) fail(`算数の基本「${basicId}」がない`)
    if (!(chapter.units?.length || chapter.basics?.length)) fail('つながる単元も算数の基本もない')
    if (!Array.isArray(chapter.quiz) || chapter.quiz.length < 3) fail('テストが3問に満たない')
    for (const [number, question] of (chapter.quiz ?? []).entries()) {
      const where = `${question.id ?? `${number + 1}問目`}`
      if (question.id !== `${chapter.id}-${number + 1}`) fail(`${where}: 問題の id は ${chapter.id}-${number + 1}`)
      if (questionIds.has(question.id)) fail(`${where}: 問題の id が重複`)
      questionIds.add(question.id)
      if (!hasText(question.question)) fail(`${where}: 問題文がない`)
      if (!Array.isArray(question.choices) || question.choices.length !== 3) fail(`${where}: 選択肢は3つ`)
      else {
        if (question.choices.some((choice) => !hasText(choice))) fail(`${where}: 空の選択肢がある`)
        if (new Set(question.choices).size !== 3) fail(`${where}: 選択肢が重複`)
      }
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 2) fail(`${where}: 正解の番号が0〜2でない`)
      if (!hasText(question.explanation)) fail(`${where}: 解説がない`)
      if (!Array.isArray(question.notes) || question.notes.length !== 3 || question.notes.some((note) => !hasText(note))) {
        fail(`${where}: 選択肢の説明が3つそろっていない`)
      } else if (new Set(question.notes).size !== 3) fail(`${where}: 選択肢の説明が重複`)
    }
  }
  return problems
}

export function checkBasics() {
  const problems = []
  for (const basic of MATH_BASICS) {
    const chapters = MATH_HISTORY_CHAPTERS.filter((chapter) => chapter.part === 'basic' && chapter.basics.includes(basic.id))
    if (!chapters.length) problems.push(`算数の基本「${basic.title}」（${basic.id}）を学べる話が第1部にない`)
  }
  if (MATH_BASICS.length !== 33) problems.push(`算数の基本の項目が33でない（${MATH_BASICS.length}）`)
  if (MATH_HISTORY_CHAPTERS[0]?.basics?.[0] !== 'b-count') problems.push('コースの最初の話が「数える」でない')
  return problems
}

export function checkUnits() {
  const problems = []
  for (const unit of MATH_UNITS) {
    if (!MATH_HISTORY_CHAPTERS.some((chapter) => chapter.units.includes(unit.id))) {
      problems.push(`単元「${unit.title}」（${unit.grade}・${unit.id}）につながる話がない`)
    }
  }
  if (MATH_UNITS.length !== 45) problems.push(`数学の単元が45でない（${MATH_UNITS.length}）`)
  const intro = read('src/screens/MathIntro.jsx')
  if (!/chaptersForUnit\(params\.unitId\)/.test(intro) || !/navigate\('mathStory', \{ chapterId: chapter\.id \}\)/.test(intro)) {
    problems.push('単元の導入画面（MathIntro）から話へ行けない')
  }
  const story = read('src/screens/MathStory.jsx')
  if (!/navigate\('mathIntro', \{ unitId: unit\.id \}\)/.test(story)) problems.push('話の画面（MathStory）から単元の導入へ行けない')
  return problems
}

export function loadFacts() {
  return JSON.parse(readFileSync(FACTS_PATH, 'utf8'))
}

export function checkFacts(ledger = loadFacts()) {
  const problems = []
  const entries = ledger.chapters ?? {}
  for (const chapter of MATH_HISTORY_CHAPTERS) {
    const entry = entries[chapter.id]
    const fail = (message) => problems.push(`${chapter.id}: ${message}`)
    if (!entry) {
      fail('史実を確かめた記録がない')
      continue
    }
    const text = chapterText(chapter)
    if (entry.textSha256 !== chapterTextHash(chapter)) {
      fail('本文が記録のあとで変わった（読み直してから --stamp で押し直す）')
    }
    const facts = Array.isArray(entry.facts) ? entry.facts : []
    if (facts.length < 3) fail(`確かめた史実が3件に満たない（${facts.length}件）`)
    for (const fact of facts) {
      if (!hasText(fact.claim)) fail('史実の要約（claim）がない')
      if (!Object.hasOwn(FACT_STATUSES, fact.status)) fail(`「${fact.claim}」の status が ${Object.keys(FACT_STATUSES).join('/')} でない`)
      if (!hasText(fact.quote) || !text.includes(fact.quote)) {
        fail(`「${fact.claim}」の本文の箇所（quote）が本文にない`)
        continue
      }
      const hedge = HEDGES[fact.status]
      if (hedge && !hedge.test(fact.quote)) {
        fail(`「${fact.claim}」は ${FACT_STATUSES[fact.status]}。本文の箇所に言い回しがない：${fact.quote}`)
      }
    }
  }
  for (const id of Object.keys(entries)) {
    if (!MATH_HISTORY_CHAPTERS.some((chapter) => chapter.id === id)) problems.push(`${id}: 記録にあるが、話がない`)
  }
  return problems
}

const MODES = {
  basics: checkBasics,
  units: checkUnits,
  chapters: checkChapters,
  facts: () => checkFacts(),
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const args = process.argv.slice(2)
  const stampAt = args.indexOf('--stamp')
  if (stampAt >= 0) {
    // 人が本文を読み、史実の記録（facts）を直したあとで、いまの本文の指紋を押す。読まずに押さないこと。
    const targets = args.slice(stampAt + 1)
    const ledger = loadFacts()
    for (const id of targets) {
      const chapter = MATH_HISTORY_CHAPTERS.find((item) => item.id === id)
      if (!chapter) throw new Error(`話 ${id} がない`)
      if (!ledger.chapters[id]) throw new Error(`${id} の史実の記録（facts）を先に書く`)
      ledger.chapters[id].textSha256 = chapterTextHash(chapter)
    }
    ledger.chapters = Object.fromEntries(
      MATH_HISTORY_CHAPTERS.filter((chapter) => ledger.chapters[chapter.id]).map((chapter) => [chapter.id, ledger.chapters[chapter.id]]),
    )
    writeFileSync(FACTS_PATH, `${JSON.stringify(ledger, null, 2)}\n`)
    console.log(`押し直した: ${targets.join(', ')}`)
    process.exit(0)
  }
  const modes = args.length ? args : Object.keys(MODES)
  let failed = 0
  for (const mode of modes) {
    const run = MODES[mode]
    if (!run) throw new Error(`知らない確認: ${mode}（${Object.keys(MODES).join(' / ')}）`)
    const problems = run()
    if (problems.length) {
      failed += problems.length
      console.log(`❌ ${mode}: ${problems.length}件`)
      for (const problem of problems.slice(0, 60)) console.log(`  - ${problem}`)
      if (problems.length > 60) console.log(`  - ほか ${problems.length - 60}件`)
    } else {
      const counts = {
        basics: `算数の基本 ${MATH_BASICS.length}項目すべてに話がある`,
        units: `数学の ${MATH_UNITS.length}単元すべてに、つながる話がある`,
        chapters: `全${MATH_HISTORY_CHAPTERS.length}話・テスト${MATH_HISTORY_CHAPTERS.reduce((sum, chapter) => sum + chapter.quiz.length, 0)}問がそろっている`,
        facts: `全${MATH_HISTORY_CHAPTERS.length}話の史実の記録が本文と一致する`,
      }
      console.log(`✅ ${mode}: ${counts[mode]}`)
    }
  }
  process.exit(failed ? 1 : 0)
}

