import { WORDS_CURRICULUM_1900_A_F } from './words-curriculum-1900-a-f.js'
import { WORDS_CURRICULUM_1900_G_P } from './words-curriculum-1900-g-p.js'
import { WORDS_CURRICULUM_1900_Q_Z } from './words-curriculum-1900-q-z.js'

// 補完した単語。各分割ファイルは見出し語をアルファベット順に並べる。
export const CURRICULUM_1900_WORDS = [
  ...WORDS_CURRICULUM_1900_A_F,
  ...WORDS_CURRICULUM_1900_G_P,
  ...WORDS_CURRICULUM_1900_Q_Z,
]
