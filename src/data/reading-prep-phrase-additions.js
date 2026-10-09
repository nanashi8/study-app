// 読解の準備の「熟語・表現」に、熟語・構文の辞書から足すもの。
// 2026-10-09、本文に出る熟語・構文（長文の級と同じか上の級）を1件ずつ本文の文で読み、
// 熟語として使われているのに準備に無かったものをここに置いた。長文ごとに本文に出る順。
// 照合で拾っても熟語として使われていないもの（than before の the 比較級、came to the gym の come to など）は
// 置かない。何を読んでどう決めたかは docs/audits/reading-prep-phrase-coverage.json にある。
export const READING_PREP_PHRASE_ADDITIONS = Object.freeze({
  p_4_library_event: Object.freeze(['curr_idm_4_one_of', 'jr_idm_need_to_do', 'jr_idm_not_very', 'exam_idm_learn_about']),
  p_3_school_garden: Object.freeze([
    'jr_idm_ask_a_to_do', 'curr1900_idm_3_want_to', 'curr_idm_3_the_number_of', 'jr_idm_share_a_with_b',
    'curr_idm_3_instead_of', 'curr_idm_3_talk_with',
  ]),
  p_pre2_museum_volunteers: Object.freeze(['syn_the_way']),
  p_pre2plus_repair_cafes: Object.freeze(['curr_idm_pre1_in_addition']),
  p_4_bicycle_safety: Object.freeze(['jr_idm_how_to_do']),
  p_3_lunch_food_waste: Object.freeze([
    'curr1900_idm_3_have_to', 'jr_idm_ask_a_to_do', 'jr_idm_share_a_with_b', 'curr1900_idm_3_encourage_a_to_b',
  ]),
  p_pre2_later_school_start: Object.freeze(['curr_idm_pre2_care_for']),
  p_pre2plus_city_bird_count: Object.freeze(['curr_idm_2_in_practice']),
  p_5_weather_field_trip: Object.freeze(['curr_idm_5_at_school', 'curr_idm_5_in_the_afternoon']),
  p_4_emergency_map: Object.freeze(['jr_idm_tell_a_to_do', 'exam_idm_ask_for', 'curr_idm_3_cover_a_with_b']),
  p_3_multilingual_town_guide: Object.freeze([
    'curr1900_idm_3_want_to', 'curr_idm_3_such_as', 'jr_idm_ask_a_to_do', 'curr_idm_pre2_no_longer',
  ]),
  p_5_hot_summer_school: Object.freeze([
    'jr_idm_than_before', 'jr_idm_last_year', 'jr_idm_put_a_in_b', 'curr_idm_5_every_morning', 'curr_idm_5_every_day',
  ]),
  p_4_school_solar_roof: Object.freeze(['curr_idm_3_talk_about']),
  p_3_ai_class_rules: Object.freeze([
    'curr1900_idm_3_want_to', 'jr_idm_ask_a_to_do', 'curr_idm_3_compare_a_with_b', 'curr_idm_3_in_the_future',
    'curr1900_idm_2_at_work', 'jr_idm_learn_to_do',
  ]),
  p_pre2_morning_market: Object.freeze(['curr1900_idm_pre2_turn_a_into_b']),
  p_2_disaster_translators: Object.freeze(['curr_idm_2_in_practice', 'curr_idm_2_keep_to']),
  p_ext_1000_civic_decisions: Object.freeze(['curr_idm_2_accuse_a_of_b', 'curr1900_idm_2_in_place']),
  p_ext_2000_customs_across_borders: Object.freeze(['curr_idm_pre1_build_on']),
  p_ext_3000_shared_watershed: Object.freeze(['curr_idm_pre1_leave_behind']),
})
