#!/usr/bin/env node
// 社会・理科の図表を、生徒の理解を助ける形に充実させた記録（docs/audits/junior-social-science-figure-enrich.json）の道具。
// 依頼台帳 requests/2026-10-01-subject-figure-enrich.json の text-figures-visual・all-figures-understanding・data-sourced。
// テストは tests/junior-social-science-figure-enrich.test.mjs。
//
//   points    … 全要点の図を375pxで見て判断した記録。decision は visual（目で見てわかる図＝地図・グラフ・しくみの図・図解などがある）か
//               text（表・流れ図・年表だけで、そのほうが理解を助ける。reason に理由）。
//   questions … 図を使う演習の図を見た記録。
//   data      … 数値を使う図（棒グラフ・折れ線グラフ・帯グラフと、統計から色や点を決めた出典つきの図）のうち、
//               この依頼で足したり変えたりしたものと資料の照らし合わせ。
//               実際の統計は figure.source（出典のページの id）を持ち、checked に照らし合わせ方を書く。
//               実験の例のように作った数値の図は illustrative に理由を書く。
//   sha256 は判断したときの中身の指紋。中身を変えたら、見直してから押し直す。
//
//   node scripts/checks/junior-social-science-figure-enrich.mjs                           … 記録と中身の食いちがいを並べる
//   node scripts/checks/junior-social-science-figure-enrich.mjs --stamp his-09 [geo-01 …]  … 見直した単元の指紋を押し直す
//   node scripts/checks/junior-social-science-figure-enrich.mjs --text his-01#3 "理由"      … 文字の図のままにする理由を書く
//   node scripts/checks/junior-social-science-figure-enrich.mjs --data his-09#3 図1 "照らし合わせ" [--illustrative "理由"]
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { ALL_SUBJECT_QUESTIONS, ALL_SUBJECT_UNITS, getSubjectUnit } from '../../src/data/subjects/index.js'

const ROOT = new URL('../../', import.meta.url)
export const ENRICH_LEDGER_PATH = new URL('docs/audits/junior-social-science-figure-enrich.json', ROOT)

/** 文字だけの図の種類。これだけで描く図は「文字の図」。 */
export const TEXT_FIGURE_KINDS = Object.freeze(['table', 'chain', 'timeline'])
/** 数値を使う図の種類。 */
export const NUMERIC_FIGURE_KINDS = Object.freeze(['bars', 'lines', 'ratio'])

const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')

/** 図の中の図（set の items）までたどった、すべての図。 */
export const flatFigures = (figure) => (figure ? [figure, ...(figure.type === 'set' ? figure.items.flatMap(flatFigures) : [])] : [])
/** 図の種類（set は中の図の種類）。 */
export const figureKinds = (figure) => flatFigures(figure).filter((item) => item.type !== 'set').map((item) => item.type)
/** 目で見てわかる図（文字だけの図ではない図）を持つか。 */
export const hasVisualFigure = (figure) => figureKinds(figure).some((kind) => !TEXT_FIGURE_KINDS.includes(kind))

/** 要点の指紋（見出し・本文・図と図の読み方）。 */
export const pointFingerprint = (point) => sha256([point.heading, point.body, point.figure ?? null])
/** 演習の図の指紋（問題文・図・読み取り方・解き方）。 */
export const questionFingerprint = (question) => sha256([question.text, question.figure ?? null, question.read ?? [], question.steps ?? []])
/** 数値の図の指紋（図の読み方をのぞく図の中身）。 */
export const numericFingerprint = (figure) => {
  const { guide: _guide, ...rest } = figure
  return sha256(rest)
}

export const readEnrichLedger = () => JSON.parse(readFileSync(ENRICH_LEDGER_PATH, 'utf8'))
const writeLedger = (ledger) => writeFileSync(ENRICH_LEDGER_PATH, `${JSON.stringify(ledger, null, 2)}\n`)

/** 数値を使う図か（棒・折れ線・帯グラフと、出典つきの図）。 */
export const isNumericFigure = (figure) => NUMERIC_FIGURE_KINDS.includes(figure.type) || Boolean(figure.source)

/** 要点・演習の数値の図を、場所と図の題つきで並べる。 */
export function numericFigures() {
  const list = []
  for (const unit of ALL_SUBJECT_UNITS) {
    unit.points.forEach((point, index) => {
      for (const figure of flatFigures(point.figure)) if (figure.type !== 'set' && isNumericFigure(figure)) list.push({ where: `${unit.id}#${index + 1}`, figure })
    })
  }
  for (const question of ALL_SUBJECT_QUESTIONS) {
    for (const figure of flatFigures(question.figure)) if (figure.type !== 'set' && isNumericFigure(figure)) list.push({ where: question.id, figure })
  }
  return list
}

/** 記録と今の中身の食いちがい。空なら、全要点・図を使う全演習を見て判断したときのまま。 */
export function enrichLedgerProblems(ledger = readEnrichLedger()) {
  const problems = []
  const keys = new Set()
  for (const unit of ALL_SUBJECT_UNITS) {
    unit.points.forEach((point, index) => {
      const key = `${unit.id}#${index + 1}`
      keys.add(key)
      const entry = ledger.points?.[key]
      const visual = hasVisualFigure(point.figure)
      if (!entry) problems.push(`${key}: 図を375pxで見て判断した記録がない`)
      else if (entry.sha256 !== pointFingerprint(point)) problems.push(`${key}: 判断したあとに要点が変わった（見直して --stamp ${unit.id}）`)
      else if (entry.decision !== (visual ? 'visual' : 'text')) problems.push(`${key}: 記録の判断（${entry.decision}）と図が合わない`)
      else if (entry.decision === 'text' && !(String(entry.reason ?? '').length >= 15)) problems.push(`${key}: 文字の図のままにする理由がない（--text ${key} "理由"）`)
    })
  }
  for (const key of Object.keys(ledger.points ?? {})) if (!keys.has(key)) problems.push(`${key}: 記録にあるが、要点がない`)
  const questionIds = new Set()
  for (const question of ALL_SUBJECT_QUESTIONS.filter((item) => item.figure)) {
    questionIds.add(question.id)
    const entry = ledger.questions?.[question.id]
    if (!entry) problems.push(`${question.id}: 演習の図を見た記録がない`)
    else if (entry.sha256 !== questionFingerprint(question)) problems.push(`${question.id}: 見たあとに演習の図が変わった（見直して --stamp ${question.unitId}）`)
  }
  for (const id of Object.keys(ledger.questions ?? {})) if (!questionIds.has(id)) problems.push(`${id}: 記録にあるが、図を使う演習ではない`)
  // この依頼で足したり変えたりした数値の図は、資料との照らし合わせ（または例の数値である理由）を持つ。
  const baseline = new Set(ledger.baseline?.numericFigures ?? [])
  const dataPrints = new Set()
  for (const { where, figure } of numericFigures()) {
    const print = numericFingerprint(figure)
    if (baseline.has(print)) continue
    dataPrints.add(print)
    const entry = Object.values(ledger.data ?? {}).find((item) => item.sha256 === print)
    const label = `${where}「${figure.caption ?? figure.type}」`
    if (!entry) problems.push(`${label}: 数値を資料と照らし合わせた記録がない（--data）`)
    else if (!figure.source && !(String(entry.illustrative ?? '').length >= 10)) problems.push(`${label}: 実際の数値なら出典（source）、例の数値なら illustrative に理由がない`)
    else if (figure.source && !(String(entry.checked ?? '').length >= 10)) problems.push(`${label}: 資料と照らし合わせた方法（checked）がない`)
  }
  for (const [id, entry] of Object.entries(ledger.data ?? {})) if (!dataPrints.has(entry.sha256)) problems.push(`data ${id}: 記録にあるが、その数値の図がない（図を変えたら記録し直す）`)
  return problems
}

/** 単元の全要点と、図を使う演習の指紋を押し直す。文字の図の理由は記録に残す。 */
export function stampUnits(unitIds, ledger = readEnrichLedger()) {
  ledger.points ??= {}
  ledger.questions ??= {}
  for (const id of unitIds) {
    const unit = getSubjectUnit(id)
    if (!unit) throw new Error(`単元 ${id} がない`)
    unit.points.forEach((point, index) => {
      const key = `${unit.id}#${index + 1}`
      const visual = hasVisualFigure(point.figure)
      const before = ledger.points[key] ?? {}
      ledger.points[key] = visual
        ? { decision: 'visual', sha256: pointFingerprint(point) }
        : { decision: 'text', reason: before.reason ?? '', sha256: pointFingerprint(point) }
    })
    for (const question of unit.questions.filter((item) => item.figure)) {
      ledger.questions[question.id] = { sha256: questionFingerprint(question) }
    }
    for (const question of unit.questions.filter((item) => !item.figure)) delete ledger.questions[question.id]
  }
  ledger.points = Object.fromEntries(Object.entries(ledger.points).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })))
  ledger.questions = Object.fromEntries(Object.entries(ledger.questions).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })))
  return ledger
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const args = process.argv.slice(2)
  if (!existsSync(ENRICH_LEDGER_PATH)) throw new Error('台帳がない')
  if (args[0] === '--stamp') {
    writeLedger(stampUnits(args.slice(1)))
    console.log('押した:', args.slice(1).join(' '))
  } else if (args[0] === '--text') {
    const [key, reason] = args.slice(1)
    const ledger = readEnrichLedger()
    ledger.points ??= {}
    ledger.points[key] = { ...(ledger.points[key] ?? { decision: 'text', sha256: '' }), reason }
    writeLedger(ledger)
    console.log('理由を書いた:', key)
  } else if (args[0] === '--data') {
    const [where, captionPrefix, checked] = args.slice(1)
    const illustrativeAt = args.indexOf('--illustrative')
    const illustrative = illustrativeAt >= 0 ? args[illustrativeAt + 1] : undefined
    const found = numericFigures().filter((item) => item.where === where && String(item.figure.caption ?? '').startsWith(captionPrefix))
    if (found.length !== 1) throw new Error(`${where} の「${captionPrefix}」で始まる数値の図が ${found.length} 件`)
    const ledger = readEnrichLedger()
    ledger.data ??= {}
    const { figure } = found[0]
    const id = `${where} ${figure.caption}`
    ledger.data[id] = { sha256: numericFingerprint(figure), ...(figure.source ? { source: figure.source } : {}), ...(checked ? { checked } : {}), ...(illustrative ? { illustrative } : {}) }
    writeLedger(ledger)
    console.log('記録した:', id)
  } else {
    const problems = enrichLedgerProblems()
    if (problems.length) {
      console.log(`食いちがい ${problems.length}件`)
      for (const problem of problems.slice(0, 80)) console.log(`  - ${problem}`)
      process.exitCode = 1
    } else {
      const ledger = readEnrichLedger()
      const points = Object.values(ledger.points)
      console.log(`✅ 全${points.length}要点（目で見る図 ${points.filter((item) => item.decision === 'visual').length}・文字の図 ${points.filter((item) => item.decision === 'text').length}）と図を使う演習${Object.keys(ledger.questions).length}問が、見て判断した記録と一致`)
    }
  }
}
