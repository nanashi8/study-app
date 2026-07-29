// 全長文の主節を、日本の英語教育で用いる5文型として人手確認した正解表。
//
// 判定規約:
// - 前置詞句と副詞はMとし、主節の5文型には含めない。
// - 受動態の be + 過去分詞はVとしてSV、叙述用法の形容詞・名詞はCとしてSVC。
// - try/need + to不定詞はO、ask/allow/help + O + 不定詞はO+C。
// - there構文は形式語thereをM、後置された名詞句を意味上のSとしてSV。
// - tell/show/teach/give + 人 + 物・節はSVOO。

import { EXAM_READING_GRAMMAR_EXPECTATIONS } from './reading-grammar-expectations-exam.js'

const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  ...EXAM_READING_GRAMMAR_EXPECTATIONS,
  p_5_lost_notebook: patterns(`
    SVC SV SVO SVO SVO SV SVO SVO SVC
  `),
  p_4_library_event: patterns(`
    SVO SV SVC SVO SV SV SVO SV SV SV SV SVO SVC
  `),
  p_3_school_garden: patterns(`
    SVO SVO SVO SVO SVOC SV SVO SVO SVO SVO SVO SVO SVO SVO SVO SVOO SVOO SVC
  `),
  p_pre2_museum_volunteers: patterns(`
    SVO SVO SVO SVO SVO SVC SVO SVC SVO SVO SVO SVO SVC SVC SVO SVO SVO SVO SVO
  `),
  p_pre2plus_repair_cafes: patterns(`
    SVO SVC SVC SVO SVOC SVC SVC SVOO SVOC SVO SVO SVO SVO SVO SVOC SVC SVO SVC
    SVO SV SVO SVO SVC
  `),
  p_2_quiet_technology: patterns(`
    SVO SV SVO SV SVOO SVO SV SVO SVO SVO SVC SVC SVO SV SVOC SVO SVO SVO SVO
    SVOC SV SVO
  `),
  p_pre1_resilient_cities: patterns(`
    SV SVOC SVO SVC SVO SVO SV SVC SVO SVC SVO SVO SVO SV SVO SVO SVO SVOC SVC
    SVO SVC SVC SVO SVC SVO SVO SVC SVC SVOC SVC
  `),
  p_1_collective_memory: patterns(`
    SVO SVC SV SVC SVC SVC SVC SVO SVC SV SV SV SVO SVC SVO SVO SVC SVO SVC SVO
    SVO SVO SVO SVC SVO SVC SVOC SVO SVO SVOC SVO SV SVO SVO SVO SV SV SVOO SVC
    SVO SV SVO SVO SV SVC SVO
  `),
})
