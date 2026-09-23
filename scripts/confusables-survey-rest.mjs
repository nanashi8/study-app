#!/usr/bin/env node
// 読み終えた範囲のうち、まだ決めていない組を1つの理由でまとめて書き出す。
//   node scripts/confusables-survey-rest.mjs <件数> <略号> > 決めたことのファイル
// 表（confusables-survey-sheet.mjs）と同じ並びの先頭から <件数> 組を取り、まだ決めていないものを出す。
import { readFileSync } from 'node:fs'
import { SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { confusableSurveyPairs, CONFUSABLES_SURVEY_PATH } from './checks/confusables-survey.mjs'

const [count, reason] = process.argv.slice(2)
const listed = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => [a, b].sort().join('|')))
const reviewed = JSON.parse(readFileSync(CONFUSABLES_SURVEY_PATH, 'utf8')).reviewed ?? {}
const rest = [...confusableSurveyPairs().keys()]
  .filter((key) => !listed.has(key) && !reviewed[key])
  .sort()
  .slice(0, Number(count))
console.log(rest.map((key) => `${key}\t${reason}`).join('\n'))
