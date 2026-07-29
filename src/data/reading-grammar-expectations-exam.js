// 追加8長文の主節を、日本の英語教育で用いる5文型として文ごとに確認した正解表。
const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const EXAM_READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  p_5_school_open_day: patterns(`
    SVO SV SVO SV SVO SVO SV SVO SVO SV
  `),
  p_4_bicycle_safety: patterns(`
    SVO SVOO SV SVO SVO SVO SVO SVO SVO SV SV SVO SVO
  `),
  p_3_lunch_food_waste: patterns(`
    SVO SVO SVO SVOO SVO SVO SVO SVO SV SVO SVC SVO SVOC SVOO SV SVO SVO
  `),
  p_pre2_later_school_start: patterns(`
    SV SVO SVO SVO SVO SVO SV SV SVO SV SV SVO SVOC SVC SVO SVO SVO SVC SVO SVC
  `),
  p_pre2plus_city_bird_count: patterns(`
    SVC SVO SVOC SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVOC SVO SVOO SVO SVC
    SVO SVO SVO SVO
  `),
  p_2_online_health_claims: patterns(`
    SVO SVO SVO SVO SVO SVO SVO SVC SVC SVO SV SVC SVO SVO SVO SVO SVO SVO SVOC
    SVOC SVO SVO SVO SVC
  `),
  p_pre1_cashless_inclusion: patterns(`
    SV SVO SVOC SVC SVO SVO SVO SVC SVO SVO SVC SVC SVO SVO SVO SVO SVO SVOC SVO
    SVO SVC SVO SVC SVC SVC SVO SVC SVC SVC
  `),
  p_1_metric_fixation: patterns(`
    SVO SVO SVOO SVO SV SVC SVO SVO SVO SVO SVO SVO SV SVO SVO SVO SVC SVO SVC
    SVOC SVO SVO SV SVO SV SVO SVO SVO SVC SV SVC SVC SVC SVO SVO SVOO SV SVO SVO
    SVC SVO SVO SVC SVO SVC SVO SVO SVO
  `),
})
