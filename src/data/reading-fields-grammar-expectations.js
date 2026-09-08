// 分野長文の主節を本文全体の意味から人手確認した5文型正解表。
// 等位節では先に置かれた独立節、受動態では be＋過去分詞をVとして判定する。

const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const FIELD_READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  p_pre2_pond_comeback: patterns(`
    SV SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVOO SVO SVO SVO SV SVO SVO SVO
    SVO SVO SVO SVO SVO
  `),
  p_pre2_morning_market: patterns(`
    SV SVO SV SV SVO SVOC SVO SV SVO SVO SVO SVO SVO SVO SVO SVO SVC SVC SVO SV
    SVO SVO SVO SVO SVO SVO SVC SVO SVO
  `),
  p_2_injury_free_practice: patterns(`
    SV SVOC SV SVOC SVO SVO SV SVC SVO SVO SVO SVC SVO SVO SVO SVO SVO SVC SVO SVO
    SVO SVO SVO SVO SVC SVO SVC SV SVOC SVO SVO SVO SVO SVO SVC SV
  `),
  p_2_factory_museum: patterns(`
    SV SVO SV SV SVO SV SVO SVO SV SVO SVC SVO SVO SVO SVO SV SVC SVO SVO SVO
    SVO SV SVO SV SVO SVO SVO SVO SV SVO SVC SVC SVC SV SVO SVO SVO
  `),
  p_pre2_school_radio: patterns(`
    SV SV SVO SVOC SVO SVC SVO SVC SV SVO SVO SVO SVO SVO SV SVO SVO SVO SVO SVO
    SV SV SV SVOO SVO SVO SVO SVO SVOC SVO SVO
  `),
  p_2_disaster_translators: patterns(`
    SVO SVO SVO SVO SVO SVO SVO SVC SVC SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO
    SVO SV SVO SVO SVO SV SVO SVO SVO SV SVO SVC SVO SVO SVO SVO SV SVO
  `),
})
