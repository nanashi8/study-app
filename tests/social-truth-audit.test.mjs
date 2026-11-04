// 社会の全116単元の内容の監査（2026-11-04、requests/2026-11-04-social-content-audit.json）で直した誤りを戻さない。
import assert from 'node:assert/strict'
import test from 'node:test'
import { getSubjectUnit } from '../src/data/subjects/index.js'
import { readSocialAudit, socialAuditProblems, socialUnits, SOCIAL_UNIT_COUNT, yearConflictProblems } from '../scripts/checks/social-truth-audit.mjs'

test('社会の全116単元を監査で読んだ記録があり、直した誤りが残っていない', () => {
  assert.equal(socialUnits().length, SOCIAL_UNIT_COUNT)
  assert.deepEqual(socialAuditProblems(), [])
  assert.ok(readSocialAudit().fixes.length >= 12)
})

test('単元をまたいで同じ語に違う年が書かれた組は、すべて読んで判断した記録にある', () => {
  assert.deepEqual(yearConflictProblems(), [])
})

test('歴史総合の東西の陣営の地図に、1982年加盟のスペインをNATOとして塗らない', () => {
  const findMaps = (value, out = []) => {
    if (Array.isArray(value)) value.forEach((item) => findMaps(item, out))
    else if (value && typeof value === 'object') {
      if (value.type === 'worldMap' && value.fills && value.legend?.some(([label]) => label.includes('NATO'))) out.push(value)
      Object.values(value).forEach((item) => findMaps(item, out))
    }
    return out
  }
  const maps = findMaps(getSubjectUnit('hso-29').points)
  assert.ok(maps.length >= 1)
  for (const map of maps) {
    assert.equal(map.fills.ESP, undefined)
    for (const code of ['BEL', 'NLD', 'PRT']) assert.ok(map.fills[code], `${code} はNATOの原加盟国`)
  }
})
