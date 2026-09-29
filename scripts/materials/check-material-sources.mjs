#!/usr/bin/env node
// 教材づくりの素材の台帳（docs/material-sources.json）の決まりを確かめる。通信はしない。
//   node scripts/materials/check-material-sources.mjs                    台帳の書き方と決まり
//   node scripts/materials/check-material-sources.mjs --require-verified  さらに、ready のすべてが取り出して確かめてあること
// 決まり：
//   1. 素材の種類12種（依頼台帳 requests/2026-09-29-free-material-sources.json の母集団）がそろい、どの種類にも候補がある
//   2. どの候補にも、利用条件の根拠（一次資料の URL と原文の一文）と確かめた日がある
//   3. 出典の表示が条件のもの（attribution: required）は ready にしない（画面に出典を出さない決まりと合わない）
//   4. 非商用・改変禁止のものは rejected にする
//   5. ready は取り出し方（scripts/materials/sources.mjs の HANDLERS）を持ち、--require-verified では確かめた記録がある
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { HANDLERS } from './sources.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const CATALOG_PATH = join(ROOT, 'docs', 'material-sources.json')
export const EXPECTED_KINDS = [
  'map-shapes', 'rivers', 'elevation', 'facts', 'statistics', 'art-history',
  'nature-photos', 'drawings', 'fonts', 'drawing-tools', 'illustrator-tools', 'photo-search',
]
export const STATUSES = ['ready', 'needs-user', 'rejected']
export const ATTRIBUTIONS = ['none', 'requested', 'required']
const DATE = /^\d{4}-\d{2}-\d{2}$/
const isText = (value, min = 1) => typeof value === 'string' && value.trim().length >= min

/** 台帳の決まりに合わない所を、文の配列で返す（空なら合っている）。 */
export function checkCatalog(catalog, { handlers = HANDLERS, requireVerified = false } = {}) {
  const problems = []
  const kinds = catalog?.kinds ?? []
  const sources = catalog?.sources ?? []
  const kindIds = kinds.map((kind) => kind.id)
  for (const id of EXPECTED_KINDS) {
    if (!kindIds.includes(id)) problems.push(`種類 ${id} が台帳に無い`)
    else if (!sources.some((source) => source.kind === id)) problems.push(`種類 ${id} に候補が1件も無い`)
  }
  for (const id of kindIds) if (!EXPECTED_KINDS.includes(id)) problems.push(`決まっていない種類 ${id}`)
  for (const kind of kinds) if (!isText(kind.name)) problems.push(`種類 ${kind.id} に名前が無い`)

  const seen = new Set()
  for (const source of sources) {
    const at = `候補 ${source.id ?? '(id なし)'}`
    if (!isText(source.id)) problems.push(`${at}：id が無い`)
    else if (seen.has(source.id)) problems.push(`${at}：id が重なっている`)
    seen.add(source.id)
    if (!EXPECTED_KINDS.includes(source.kind)) problems.push(`${at}：種類 ${source.kind} が決まっていない`)
    for (const field of ['name', 'use', 'license']) if (!isText(source[field])) problems.push(`${at}：${field} が無い`)
    if (!/^https:\/\//.test(source.url ?? '')) problems.push(`${at}：url が https で始まらない`)
    for (const field of ['commercial', 'modify']) if (typeof source[field] !== 'boolean') problems.push(`${at}：${field} が true・false でない`)
    if (!ATTRIBUTIONS.includes(source.attribution)) problems.push(`${at}：attribution が ${ATTRIBUTIONS.join('・')} のどれでもない`)
    if (!STATUSES.includes(source.status)) problems.push(`${at}：status が ${STATUSES.join('・')} のどれでもない`)
    if (!Array.isArray(source.evidence) || !source.evidence.length) problems.push(`${at}：利用条件の根拠（evidence）が無い`)
    else {
      for (const evidence of source.evidence) {
        if (!/^https:\/\//.test(evidence.url ?? '')) problems.push(`${at}：根拠の url が https で始まらない`)
        if (!isText(evidence.quote, 10)) problems.push(`${at}：根拠の原文の一文が無い`)
      }
    }
    if (!DATE.test(source.checkedOn ?? '')) problems.push(`${at}：確かめた日（checkedOn）が無い`)

    if (source.status === 'ready') {
      if (source.commercial !== true) problems.push(`${at}：商用に使えないのに ready`)
      if (source.modify !== true) problems.push(`${at}：改変できないのに ready`)
      if (source.attribution === 'required') problems.push(`${at}：出典の表示が条件なのに ready（画面に出典を出さない決まりと合わない）`)
      if (!handlers[source.tool?.id]) problems.push(`${at}：取り出し方 ${source.tool?.id ?? '(なし)'} が scripts/materials/sources.mjs に無い`)
      if (requireVerified) {
        const verified = source.verified
        if (!verified) problems.push(`${at}：取り出して確かめた記録（verified）が無い`)
        else {
          if (!DATE.test(verified.on ?? '')) problems.push(`${at}：確かめた日が無い`)
          if (!(Number.isInteger(verified.items) && verified.items >= 1)) problems.push(`${at}：取り出した件数が無い`)
          if (!(Number.isInteger(verified.bytes) && verified.bytes > 0)) problems.push(`${at}：取り出した大きさが無い`)
          if (!/^[0-9a-f]{64}$/.test(verified.sha256 ?? '')) problems.push(`${at}：sha256 が無い`)
        }
      }
    }
    if ((source.commercial === false || source.modify === false) && source.status !== 'rejected') problems.push(`${at}：非商用か改変禁止なのに rejected でない`)
    if (source.status === 'needs-user' && !isText(source.question, 10)) problems.push(`${at}：利用者に聞くこと（question）が無い`)
    if (source.status === 'rejected' && !isText(source.reason, 5)) problems.push(`${at}：使えない理由（reason）が無い`)
  }
  return problems
}

export const readCatalog = (path = CATALOG_PATH) => JSON.parse(readFileSync(path, 'utf8'))

/** 種類ごと・状態ごとの件数。 */
export function summarize(catalog) {
  return catalog.kinds.map((kind) => {
    const list = catalog.sources.filter((source) => source.kind === kind.id)
    const count = (status) => list.filter((source) => source.status === status).length
    return { kind: kind.id, name: kind.name, total: list.length, ready: count('ready'), needsUser: count('needs-user'), rejected: count('rejected') }
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const catalog = readCatalog()
  const problems = checkCatalog(catalog, { requireVerified: process.argv.includes('--require-verified') })
  const rows = summarize(catalog)
  for (const row of rows) console.log(`${row.name}：${row.total} 件（ready ${row.ready}・判断待ち ${row.needsUser}・使えない ${row.rejected}）`)
  const total = catalog.sources.length
  const ready = catalog.sources.filter((source) => source.status === 'ready')
  console.log(`計 ${total} 件（ready ${ready.length}・確かめた記録あり ${ready.filter((source) => source.verified).length}）`)
  if (problems.length) {
    for (const problem of problems) console.error(`✘ ${problem}`)
    process.exitCode = 1
  } else console.log('✔ 台帳の決まりに合っている')
}
