// 社会・理科の図表を、生徒の理解を助ける形に充実させたことの確認
// （依頼台帳 requests/2026-10-01-subject-figure-enrich.json の text-figures-visual・all-figures-understanding・data-sourced）。
// 2026-10-01 利用者「中学理科社会の図表を充実させて生徒の理解を助けるように改善しなさい。」
// 記録は docs/audits/junior-social-science-figure-enrich.json（道具は scripts/checks/junior-social-science-figure-enrich.mjs）。
import test from 'node:test'
import assert from 'node:assert/strict'
import { getSubjectUnit } from '../src/data/subjects/index.js'
import { enrichLedgerProblems, hasVisualFigure, readEnrichLedger } from '../scripts/checks/junior-social-science-figure-enrich.mjs'

test('図が文字だけだった要点216件は、目で見てわかる図を持つか、文字の図のほうが理解を助ける理由が記録されている', () => {
  const ledger = readEnrichLedger()
  // 2026-10-01 に数えた、図が表・流れ図・年表だけの要点（地理22・歴史67・公民56・理科1年23・2年20・3年28）。
  assert.equal(ledger.baseline.textOnly.length, 216)
  const problems = []
  for (const key of ledger.baseline.textOnly) {
    const [id, number] = key.split('#')
    const point = getSubjectUnit(id)?.points[Number(number) - 1]
    if (!point) {
      problems.push(`${key}: 要点がない`)
      continue
    }
    if (hasVisualFigure(point.figure)) continue
    const entry = ledger.points?.[key]
    if (entry?.decision !== 'text' || !(String(entry.reason ?? '').length >= 15)) problems.push(`${key}（${point.heading}）: 文字の図のままで、理由がない`)
  }
  assert.deepEqual(problems, [])
})

test('全要点の図と図を使う全演習を375pxで見て判断した記録が今の中身と一致し、足した数値の図は資料と照らし合わせてある', () => {
  assert.deepEqual(enrichLedgerProblems(), [])
})
