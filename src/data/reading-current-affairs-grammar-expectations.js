// 時事長文の主節を本文全体の意味から人手確認した5文型正解表。
// 等位節では先に置かれた独立節、受動態では be＋過去分詞をVとして判定する。

const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const CURRENT_AFFAIRS_READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  p_5_hot_summer_school: patterns(`
    SVC SVO SVO SVO SVO SVO SV SV SVO SVO
  `),
  p_4_school_solar_roof: patterns(`
    SVO SVO SVO SVOC SVO SVO SVO SVO SVO SVO SV SVO SVO SVO SV
  `),
  p_3_ai_class_rules: patterns(`
    SVO SVO SVO SVO SV SVOC SVO SVO SVO SV SVO SVO SVO SVO SVO SVO SVO SVO SVOC
    SVO SVC SVO SVO SVO SVOO
  `),
  p_pre2_crowded_town_tourism: patterns(`
    SVC SVO SV SVO SV SVO SVC SVO SV SVO SVO SVO SVOC SVO SVO SV SVO SV SVO SV
    SVO SVO SVO SVO
  `),
  p_pre2plus_rural_bus_future: patterns(`
    SVC SV SVO SVC SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SV SVO SVO SVO SVO
    SVO SVO SVO SV SVO SV
  `),
  p_2_space_debris: patterns(`
    SV SVO SV SVO SVC SVO SVO SVO SVO SVO SVO SVC SV SV SV SVO SVO SVO SVC SVC
    SV SVO SVO SVO SV SVO SVO SVC SVO SVC
  `),
  p_pre1_ai_and_work: patterns(`
    SVC SVO SVO SV SV SVO SVO SVC SVO SVO SV SVO SV SVO SV SVO SVC SV SVO SVC
    SVO SV SVO SVC SVO SVO SVO SV SVO SVO SV SVC SVC SVO SV SVO SVO SVO SVC SVO
    SVC SVC
  `),
  p_1_synthetic_media_trust: patterns(`
    SVO SV SV SVO SVOC SVO SV SVC SVO SVC SVO SVO SVO SV SV SVO SVOC SVO SV SV
    SV SV SVOO SVC SVO SVO SVO SVO SV SVO SVO SVC SVO SVO SVO SVC SVO SV SVO
    SVC SVC SV SVOC SVO SV SVC SVC SVO SV SVO SV SVO SVO SVC SVO SV
  `),
})
