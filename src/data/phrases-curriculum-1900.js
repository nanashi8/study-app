// 1900.xlsx との差分を、出典の並びを使わず英字順で再構成した独自補完。
// 分割ファイルも各々 case-insensitive の英字順に固定し、順序の回帰をテストする。
import { CURRICULUM_1900_PHRASES_A_C } from './phrases-curriculum-1900-a-c.js'
import { CURRICULUM_1900_PHRASES_D_H } from './phrases-curriculum-1900-d-h.js'
import { CURRICULUM_1900_PHRASES_I_M } from './phrases-curriculum-1900-i-m.js'
import { CURRICULUM_1900_PHRASES_N_S } from './phrases-curriculum-1900-n-s.js'
import { CURRICULUM_1900_PHRASES_T_Z } from './phrases-curriculum-1900-t-z.js'

export const CURRICULUM_1900_IDIOMS = Object.freeze([
  ...CURRICULUM_1900_PHRASES_A_C,
  ...CURRICULUM_1900_PHRASES_D_H,
  ...CURRICULUM_1900_PHRASES_I_M,
  ...CURRICULUM_1900_PHRASES_N_S,
  ...CURRICULUM_1900_PHRASES_T_Z,
])
