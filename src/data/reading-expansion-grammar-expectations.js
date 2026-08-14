// 追加長文の主節を本文全体の意味から人手確認した5文型正解表。
// 等位節では先に置かれた独立節、受動態では be＋過去分詞をVとして判定する。

const patterns = (source) => Object.freeze(source.trim().split(/\s+/))

export const EXPANDED_READING_GRAMMAR_EXPECTATIONS = Object.freeze({
  p_5_weather_field_trip: patterns(
    'SVO SV SVO SVOO SVO SVO SVO SVO SVC SVO',
  ),
  p_4_emergency_map: patterns(
    'SVO SVO SVO SVO SV SVOO SVOC SVO SVO SV SVO SVO SVO SVO',
  ),
  p_3_multilingual_town_guide: patterns(
    'SVO SVO SVO SVOO SVO SVO SVOO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVC SVO ' +
    'SVOC SVO SVO',
  ),
  p_pre2_phone_free_focus: patterns(
    'SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVOC SVO SVC SVO SVOC SVO ' +
    'SVC SVO SVO SVOC SVO SVC',
  ),
  p_pre2plus_clothing_second_life: patterns(
    'SVO SV SV SVO SVO SVO SVO SVO SVO SV SVC SVC SVC SVO SVO SVO SVO SVO SVO SV ' +
    'SVO SVO SVO SVO SVO SV',
  ),
  p_2_vertical_farming: patterns(
    'SVO SVO SVO SVO SV SVO SVOC SVO SVO SVO SV SVC SVO SV SVO SVO SVO SV SVO SVO ' +
    'SVO SVO SVC SVO SVO SVC',
  ),
  p_pre1_dark_sky_policy: patterns(
    'SVC SVOC SVO SVC SVOC SVO SVO SVO SVO SVO SVO SVO SVC SVC SVO SVO SVO SVC ' +
    'SVO SVO SVC SV SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVO SVOC SVC',
  ),
  p_1_choice_architecture: patterns(
    'SVOC SV SVO SVC SVO SVO SVO SVO SVC SVC SVOC SVO SVO SV SVO SVO SV SVO SVO ' +
    'SVO SV SVC SV SVO SV SVO SVO SVC SVC SV SV SVO SVO SVO SVO SVC SV SVOC SVO ' +
    'SVOC SVC SV SVO SVO SVC SVC SVO SVC',
  ),
})
