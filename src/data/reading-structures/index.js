// 長文の一文ごとの構造台帳。本文を1文ずつ読んで、主節の要素と、節・句の中の要素を
// 入れ子で書いた正解。画面の「文の要素」「構造図」「文型」「節・句の解説」はここから作る。
// 配列の順番は本文の文の順番と一致させる（検査で照合する）。

import p_5_lost_notebook from './p_5_lost_notebook.js'
import p_4_library_event from './p_4_library_event.js'
import p_3_school_garden from './p_3_school_garden.js'
import p_pre2_museum_volunteers from './p_pre2_museum_volunteers.js'
import p_pre2plus_repair_cafes from './p_pre2plus_repair_cafes.js'
import p_2_quiet_technology from './p_2_quiet_technology.js'
import p_pre1_resilient_cities from './p_pre1_resilient_cities.js'
import p_1_collective_memory from './p_1_collective_memory.js'
import p_5_school_open_day from './p_5_school_open_day.js'
import p_4_bicycle_safety from './p_4_bicycle_safety.js'
import p_3_lunch_food_waste from './p_3_lunch_food_waste.js'
import p_pre2_later_school_start from './p_pre2_later_school_start.js'
import p_pre2plus_city_bird_count from './p_pre2plus_city_bird_count.js'
import p_2_online_health_claims from './p_2_online_health_claims.js'
import p_pre1_cashless_inclusion from './p_pre1_cashless_inclusion.js'
import p_1_metric_fixation from './p_1_metric_fixation.js'

const PASSAGE_STRUCTURES = Object.freeze({
  p_5_lost_notebook,
  p_4_library_event,
  p_3_school_garden,
  p_pre2_museum_volunteers,
  p_pre2plus_repair_cafes,
  p_2_quiet_technology,
  p_pre1_resilient_cities,
  p_1_collective_memory,
  p_5_school_open_day,
  p_4_bicycle_safety,
  p_3_lunch_food_waste,
  p_pre2_later_school_start,
  p_pre2plus_city_bird_count,
  p_2_online_health_claims,
  p_pre1_cashless_inclusion,
  p_1_metric_fixation,
})

export const READING_SENTENCE_STRUCTURES = PASSAGE_STRUCTURES

export function readingSentenceStructureEntry(reviewId = '') {
  const [passageId, number] = `${reviewId}`.split('#')
  const entries = PASSAGE_STRUCTURES[passageId]
  if (!entries) return null
  return entries[Number(number) - 1] ?? null
}
