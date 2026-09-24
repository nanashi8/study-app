// 単元別の並び替え・語法問題。文法の参考書の全127単元に、どちらの形式も3問以上置く。
//
// 既存の選択問題3,485問に対し、並び替え・語法は各35問しかなく、級ごとに5問ずつ
// しかなかったため、形式を絞ったテストが1回分（20問）にも届かなかった。
// ここで単元ごとに補い、どの級・どの単元でも3形式そろって練習できるようにする。

import { GRAMMAR_UNIT_FORMATS_5 } from './level-5.js'
import { GRAMMAR_UNIT_FORMATS_4 } from './level-4.js'
import { GRAMMAR_UNIT_FORMATS_3 } from './level-3.js'
import { GRAMMAR_UNIT_FORMATS_PRE2 } from './level-pre2.js'
import { GRAMMAR_UNIT_FORMATS_2 } from './level-2.js'
import { GRAMMAR_UNIT_FORMATS_PRE1 } from './level-pre1.js'
import { GRAMMAR_UNIT_FORMATS_1 } from './level-1.js'

export const GRAMMAR_UNIT_FORMATS = Object.freeze([
  ...GRAMMAR_UNIT_FORMATS_5,
  ...GRAMMAR_UNIT_FORMATS_4,
  ...GRAMMAR_UNIT_FORMATS_3,
  ...GRAMMAR_UNIT_FORMATS_PRE2,
  ...GRAMMAR_UNIT_FORMATS_2,
  ...GRAMMAR_UNIT_FORMATS_PRE1,
  ...GRAMMAR_UNIT_FORMATS_1,
])

// 1単元・1形式に置く最低数。選択問題の GRAMMAR_TOPIC_MINIMUM と同じ基準にそろえる。
export const UNIT_FORMAT_MINIMUM = 3
