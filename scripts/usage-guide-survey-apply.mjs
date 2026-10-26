#!/usr/bin/env node
// 使い分けカードの候補の表（usage-guide-survey-sheet.mjs）で決めたことを台帳へ書く。
//   node scripts/usage-guide-survey-apply.mjs <batch-NNNN.tsv> <略号の並び>
// 略号の並びは表の行の順に1行1文字（空白は読み飛ばす）。「1別 2解 3C」のように行の番号を付けてもよい（番号が1から続くかを確かめる）。
//   C    → 使い分けカードにする。docs/audits/usage-guide-survey.json の toCard に置き、カードに2つとも入るまで未決のまま
//   略号 → reviewed に理由として書く（checks/usage-guide-survey.mjs の USAGE_GUIDE_SKIP_REASONS）
// 決めたことは表のファイルにも「組<TAB>略号」で書き戻す。
import { readFileSync, writeFileSync } from 'node:fs'
import { USAGE_GUIDE_SKIP_REASONS, USAGE_GUIDE_SURVEY_PATH, readUsageGuideSurvey, usageGuidePairCards, usageGuideSurveyPairs } from './checks/usage-guide-survey.mjs'

const [batch, codesArg = ''] = process.argv.slice(2)
if (!batch) {
  console.error('使い方: node scripts/usage-guide-survey-apply.mjs <batch-NNNN.tsv> <略号の並び>')
  process.exit(1)
}
const path = new URL(`../docs/audits/usage-guide-survey/${batch.replace(/^.*\//, '')}`, import.meta.url)
const keys = readFileSync(path, 'utf8').split('\n').map((line) => line.split('\t')[0]).filter(Boolean)
const numbered = /\d/.test(codesArg)
const codes = numbered
  ? codesArg.trim().split(/\s+/).map((token, index) => {
    const match = token.match(/^(\d+)(\D)$/u)
    if (!match || Number(match[1]) !== index + 1) throw new Error(`番号が続いていない: ${token}（${index + 1}番目）`)
    return match[2]
  })
  : [...codesArg.replace(/\s+/g, '')]
if (codes.length !== keys.length) {
  console.error(`行の数 ${keys.length} と略号の数 ${codes.length} がちがう`)
  process.exit(1)
}
const pairs = usageGuideSurveyPairs()
const ledger = readUsageGuideSurvey()
const reviewed = { ...(ledger.reviewed ?? {}) }
const toCard = { ...(ledger.toCard ?? {}) }
keys.forEach((key, index) => {
  const code = codes[index]
  if (!pairs.has(key)) throw new Error(`候補にない組: ${key}`)
  if (code !== 'C' && !USAGE_GUIDE_SKIP_REASONS[code]) throw new Error(`知らない略号: ${index + 1}行 ${code}`)
  delete reviewed[key]
  delete toCard[key]
  if (code === 'C') toCard[key] = true
  else reviewed[key] = code
})
// カードに2つとも入った組は、カード待ちから外す。
const cards = usageGuidePairCards()
for (const key of Object.keys(toCard)) if (cards.has(key)) delete toCard[key]
// カードに入った組は、カードにしない理由も要らない（あとからカードに足した組）。
for (const key of Object.keys(reviewed)) if (cards.has(key)) delete reviewed[key]
const sorted = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(USAGE_GUIDE_SURVEY_PATH, `${JSON.stringify({
  about: '使い分けカードの候補の組（scripts/checks/usage-guide-survey.mjs）のうち、カードにしない組の理由（reviewed）と、カードにすると決めてまだカードに入れていない組（toCard）。',
  reasons: USAGE_GUIDE_SKIP_REASONS,
  toCard: sorted(toCard),
  reviewed: sorted(reviewed),
}, null, 2)}\n`)
writeFileSync(path, keys.map((key, index) => `${key}\t${codes[index]}`).join('\n') + '\n')
console.log(`${keys.length}組を書いた（カードにする ${codes.filter((code) => code === 'C').length}組）。カード待ち ${Object.keys(toCard).length}組・理由 ${Object.keys(reviewed).length}組`)
