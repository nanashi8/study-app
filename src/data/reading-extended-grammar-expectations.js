// 語彙強化ロングリーディングの主節を、日本の英語教育で用いる5文型として人手確認した正解表。
//
// 判定規約は reading-grammar-expectations.js と同じ:
// - 前置詞句と副詞はMとし、主節の5文型には含めない。
// - 受動態の be + 過去分詞はVとしてSV、叙述用法の形容詞・名詞はCとしてSVC。
// - 等位節では先に置かれた独立節を主節として判定する。
// - treat A as B / make O C は O+C としてSVOC、give 人 物 はSVOO。

const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const EXTENDED_READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  p_ext_4000_generational_city: patterns(`
    SVC  SV   SV   SVC  SVO  SVO  SVO  SVO  SVC  SV   SVO  SV
    SVO  SVO  SVO  SVC  SVC  SVO  SV   SVO
    SV   SV   SV   SVC  SV   SVO  SVC  SV   SVC  SVO  SVO  SVOC
    SVO  SV   SVO  SV   SV   SV   SVO  SVC
    SVC  SV   SVO  SVO  SVC  SVO  SVO  SVC  SVO  SVC  SVO  SVC
    SVO  SVO  SVO  SV   SVC  SV   SV   SVO
    SV   SV   SVC  SV   SVC  SVO  SVO  SVO  SVC  SVO  SVC  SVO
    SVO  SV   SVC  SVO  SVO  SVC  SV   SVC
    SVC  SVO  SVC  SVC  SVC  SVC  SVO  SVC  SVO  SVO  SVO  SVO
    SVC  SV   SVC  SVC  SV   SVO  SVC  SVC
    SVC  SV   SVC  SVO  SV   SVC  SV   SVO  SVO  SVO  SVC  SVC
    SVC  SVO  SVC  SVO  SV   SVC  SVC  SVO
    SVO  SVO  SV   SVO  SVO  SV   SVO  SVC  SVC  SVO  SVO  SVC
    SV   SVO  SVO  SVO  SV   SV   SVC  SVO
    SV   SVO  SV   SVC  SVC  SV   SVO  SVC  SVO  SV   SVO  SVO
    SVO  SVO  SV   SVC  SVO  SVO  SVO  SVC
    SVO  SV   SVC  SVC  SVO  SVC  SVC  SVC  SV   SVO  SVC  SVO
    SVO  SVO  SVO  SVC  SVC  SVC  SVO  SVC
    SVO  SV   SV   SVO  SVC  SVC  SV   SVC  SVC  SVO  SV   SVO
    SV   SVO  SVO  SVC  SV   SVO  SVO  SVC
  `),
  p_ext_3000_shared_watershed: patterns(`
    SVC  SV   SVO  SV   SVO  SV   SV   SVO  SVO  SV   SV   SV
    SVC  SV   SVO  SVC  SVO  SVO  SVO  SVC
    SVC  SVO  SVC  SVC  SVC  SVC  SVC  SVO  SVO  SVC  SVC  SV
    SV   SVO  SVC  SVOC SVOC SVO  SVO  SVC
    SVO  SVO  SVO  SVC  SVO  SVC  SVO  SV   SV   SVO  SVO  SVO
    SVO  SVC  SVC  SVO  SV   SVC  SVO  SVC
    SVC  SVO  SVC  SV   SVOO SV   SVO  SV   SVO  SVO  SV   SVO
    SVO  SVO  SV   SVO  SVO  SV   SVO  SV
    SV   SV   SV   SV   SVO  SV   SVC  SVC  SVO  SVO  SVO  SVO
    SVO  SV   SVC  SVC  SVO  SVC  SV   SVC
    SVC  SVO  SVO  SVO  SVC  SVO  SVC  SVC  SVO  SVO  SVO  SVC
    SV   SVOC SVO  SV   SVC  SV   SVC  SVC
    SV   SVO  SVC  SVO  SV   SVO  SVC  SVC  SVOC SVOC SVO  SVO
    SVO  SVC  SVC  SVO  SVO  SVC  SVC  SVO
    SVOO SV   SVC  SV   SVOO SVO  SVC  SV   SVOC SVC  SVC  SV
    SVO  SV   SVO  SVC  SV   SVO  SVO  SV
  `),
  p_ext_2000_customs_across_borders: patterns(`
    SVC  SVO  SVO  SV   SV   SVC  SVO  SV   SV   SVC  SVO  SVO
    SVO  SV   SVO  SVC  SVC  SVC
    SVC  SV   SV   SV   SVC  SVO  SVC  SVO  SVO  SVO  SVO  SV
    SVO  SVC  SVO  SVC  SVC  SVC
    SV   SVO  SVC  SVC  SVC  SVOC SVO  SV   SVC  SVC  SVC  SVO
    SVO  SV   SVC  SVO  SVC  SVO
    SVO  SVO  SVO  SV   SVC  SVC  SV   SVO  SVC  SVO  SVO  SVO
    SV   SVC  SVO  SVC  SVO  SVO
    SV   SVC  SVO  SV   SVO  SVOC SVO  SVO  SVC  SVO  SVO  SVO
    SVO  SVO  SVO  SV   SVO  SVC
    SVC  SV   SVC  SV   SV   SVO  SV   SVC  SVC  SVC  SVC  SVOC
    SVC  SVC  SVO  SVC  SVC  SVC
  `),
  p_ext_1000_civic_decisions: patterns(`
    SV   SVO  SVC  SVO  SVO  SVO  SVC  SVO  SVO  SVO  SVO  SVO
    SVC  SVO  SVO  SVO  SVOC SVO  SVO  SV   SVO  SVO  SV   SVC
    SVC  SVC  SVC  SV   SV   SVC  SV   SVO  SVC  SVOO SV   SVC
    SVO  SVC  SVC  SVO  SVO  SVC  SVO  SVO  SV   SVO  SV   SVC
    SVC  SVC  SVO  SV   SVC  SVC  SVOC SVO  SVO  SV   SVC  SVC
  `),
})
