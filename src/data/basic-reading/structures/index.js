// 基礎長文の一文ごとの構造台帳（長文id → 本文の順の台帳の並び）。
import { BASIC_READING_STRUCTURES_5 } from './level-5.js'
import { BASIC_READING_STRUCTURES_4 } from './level-4.js'
import { BASIC_READING_STRUCTURES_3 } from './level-3.js'
import { BASIC_READING_STRUCTURES_PRE2 } from './level-pre2.js'
import { BASIC_READING_STRUCTURES_2 } from './level-2.js'

export const BASIC_READING_STRUCTURES = Object.freeze({
  ...BASIC_READING_STRUCTURES_5,
  ...BASIC_READING_STRUCTURES_4,
  ...BASIC_READING_STRUCTURES_3,
  ...BASIC_READING_STRUCTURES_PRE2,
  ...BASIC_READING_STRUCTURES_2,
})

export const basicReadingStructureEntry = (passageId, index) => BASIC_READING_STRUCTURES[passageId]?.[index] ?? null
