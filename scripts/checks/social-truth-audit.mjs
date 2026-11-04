#!/usr/bin/env node
// 社会の全116単元（地理・歴史・公民・地理総合・歴史総合）の内容に誤りがないかを1単元ずつ読んだ監査（2026-11-04）の道具。
// 依頼台帳 requests/2026-11-04-social-content-audit.json。記録は docs/audits/social-truth-audit-2026-11-04.json、テストは tests/social-truth-audit.test.mjs。
//
//   units に単元ごとの中身の指紋（読んだとき・直したあと）、fixes に見つけた誤りと直し方、yearConflicts に単元をまたいで
//   同じ語に違う年が添えられた組（機械で洗い出し、全件を読んで判断したもの）を書く。
//   読んだあとに中身が変わった単元は、精査の台帳（junior-social-science-review.json）で読み直した印が今の中身と合っていれば通す
//   （地理総合・歴史総合は別の依頼で書き足しが続くため）。
//
//   node scripts/checks/social-truth-audit.mjs            … 全116単元を読んだ記録と、fixes の誤りが残っていないかを確かめる
//   node scripts/checks/social-truth-audit.mjs --years    … 単元をまたぐ年の食いちがいを洗い出し、全件が読んだ記録にあるかを確かめる
//   node scripts/checks/social-truth-audit.mjs --stamp    … 今の中身で units と yearConflicts を押し直す
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { subjectUnits } from '../../src/data/subjects/index.js'
import { readReviewLedger, unitFingerprint } from './junior-social-science-review.mjs'

const ROOT = new URL('../../', import.meta.url)
export const SOCIAL_AUDIT_PATH = new URL('docs/audits/social-truth-audit-2026-11-04.json', ROOT)
export const SOCIAL_UNIT_COUNT = 116

// 監査で1単元ずつ読んだのは、中学の3冊と高校の地理総合・歴史総合の116単元。2026-11-04 に足した地理探究・日本史探究
// （requests/2026-11-04-high-school-social-tankyu.json）は、その依頼で読んだので、この監査の母数に入れない。
export const AUDITED_BOOKS = Object.freeze(['geography', 'history', 'civics', 'geoSogo', 'hisSogo'])
export const socialUnits = () => subjectUnits('social').filter((unit) => AUDITED_BOOKS.includes(unit.book))
// 単元をまたぐ年の食いちがいは、地理探究・日本史探究もふくむ社会の全冊で見る（同じ出来事の年が冊ごとにずれないように）。
export const yearConflictUnits = () => subjectUnits('social')
export const readSocialAudit = () => JSON.parse(readFileSync(SOCIAL_AUDIT_PATH, 'utf8'))

const unitTexts = (unit) => {
  const texts = []
  const walk = (value) => {
    if (typeof value === 'string') texts.push(value)
    else if (Array.isArray(value)) value.forEach(walk)
    else if (value && typeof value === 'object') Object.values(value).forEach(walk)
  }
  walk({ goal: unit.goal, exam: unit.exam, points: unit.points, terms: unit.terms.map((term) => [term.term, term.meaning, term.note]), questions: unit.questions })
  return texts
}

/** 単元をまたいで、同じ重要語句の近くに違う年が書かれた組。鍵は「語句|年,年」。 */
export function yearConflicts(units = socialUnits()) {
  const terms = new Set()
  for (const unit of units) for (const term of unit.terms) {
    const key = term.term.replace(/（.*?）|\(.*?\)/g, '').trim()
    if (key.length >= 3 && !/^\d/.test(key)) terms.add(key)
  }
  const pairs = new Map()
  for (const unit of units) for (const text of unitTexts(unit)) for (const sentence of text.split(/[。．\n]/)) {
    const years = [...sentence.matchAll(/(?<![\d〜~―-])(\d{3,4})年(?!代|間|ほど|ごと|前|分|後|以上|あまり|余り|から|にわたり)/g)].map((m) => [Number(m[1]), m.index])
    if (!years.length) continue
    for (const term of terms) {
      const at = sentence.indexOf(term)
      if (at < 0) continue
      let best = null
      for (const [year, index] of years) { const distance = Math.abs(index - at); if (!best || distance < best[1]) best = [year, distance] }
      if (best[1] > 14 || (years.length > 1 && best[1] > 8)) continue
      const byYear = pairs.get(term) ?? new Set()
      byYear.add(best[0])
      pairs.set(term, byYear)
    }
  }
  return [...pairs].filter(([, years]) => years.size > 1)
    .map(([term, years]) => `${term}|${[...years].sort((a, b) => a - b).join(',')}`)
    .sort()
}

export function socialAuditProblems(audit = readSocialAudit(), units = socialUnits()) {
  const problems = []
  if (units.length !== SOCIAL_UNIT_COUNT) problems.push(`社会の単元が${units.length}（${SOCIAL_UNIT_COUNT}のはず。増減したら読む）`)
  const review = readReviewLedger()
  for (const unit of units) {
    const recorded = audit.units?.[unit.id]
    const now = unitFingerprint(unit)
    if (!recorded) problems.push(`${unit.id}（${unit.title}）: 監査で読んだ記録がない`)
    else if (recorded !== now && review.units?.[unit.id] !== now) problems.push(`${unit.id}（${unit.title}）: 監査のあとに変わり、精査の台帳でも読み直されていない`)
  }
  const ids = new Set(units.map((unit) => unit.id))
  const textsById = new Map(units.map((unit) => [unit.id, unitTexts(unit).join('\n')]))
  for (const [index, fix] of (audit.fixes ?? []).entries()) {
    if (!ids.has(fix.unit) || !fix.where?.trim() || !fix.what?.trim() || !fix.fix?.trim() || !fix.wrong?.trim()) {
      problems.push(`fixes[${index}]: unit・where・what・fix・wrong がそろっていない`)
      continue
    }
    if (textsById.get(fix.unit).includes(fix.wrong)) problems.push(`fixes[${index}] ${fix.unit}: 直したはずの誤り「${fix.wrong}」が残っている`)
  }
  return problems
}

export function yearConflictProblems(audit = readSocialAudit(), units = yearConflictUnits()) {
  const reviewed = new Set((audit.yearConflicts?.reviewed ?? []))
  return yearConflicts(units).filter((key) => !reviewed.has(key)).map((key) => `${key}: 単元をまたいで年が違う組を、まだ読んで判断していない`)
}

const runDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href
if (runDirectly) {
  const audit = existsSync(SOCIAL_AUDIT_PATH) ? readSocialAudit() : { units: {}, fixes: [] }
  const units = socialUnits()
  if (process.argv.includes('--stamp')) {
    audit.units = Object.fromEntries(units.map((unit) => [unit.id, unitFingerprint(unit)]).sort(([a], [b]) => a.localeCompare(b)))
    audit.yearConflicts = { ...(audit.yearConflicts ?? {}), reviewed: yearConflicts(yearConflictUnits()) }
    writeFileSync(SOCIAL_AUDIT_PATH, `${JSON.stringify(audit, null, 2)}\n`)
    console.log(`押した: ${units.length}単元・年の組 ${audit.yearConflicts.reviewed.length}件`)
  } else if (process.argv.includes('--years')) {
    const all = yearConflicts(yearConflictUnits())
    const problems = yearConflictProblems(audit)
    for (const problem of problems.slice(0, 30)) console.log(`  - ${problem}`)
    console.log(problems.length ? `❌ ${problems.length}件` : `✅ 単元をまたいで年が違う組 ${all.length}件をすべて読んで判断した記録と一致`)
    process.exit(problems.length ? 1 : 0)
  } else {
    const problems = socialAuditProblems(audit, units)
    for (const problem of problems.slice(0, 30)) console.log(`  - ${problem}`)
    console.log(problems.length ? `❌ ${problems.length}件` : `✅ 社会の全${units.length}単元を監査で読んだ記録と一致（見つけて直した誤り ${audit.fixes.length}件）`)
    process.exit(problems.length ? 1 : 0)
  }
}
