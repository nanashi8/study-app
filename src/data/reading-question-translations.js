import { CORE_READING_QUESTION_TRANSLATIONS } from './reading-question-translations-core.js'
import { CURRENT_AFFAIRS_READING_QUESTION_TRANSLATIONS } from './reading-question-translations-current-affairs.js'
import { EXAM_READING_QUESTION_TRANSLATIONS } from './reading-question-translations-exam.js'
import { EXPANDED_READING_QUESTION_TRANSLATIONS } from './reading-question-translations-expansion.js'

export const READING_QUESTION_TRANSLATIONS = Object.freeze({
  ...EXAM_READING_QUESTION_TRANSLATIONS,
  ...EXPANDED_READING_QUESTION_TRANSLATIONS,
  ...CURRENT_AFFAIRS_READING_QUESTION_TRANSLATIONS,
  ...CORE_READING_QUESTION_TRANSLATIONS,
})

// 設問・選択肢の英語原文を人手で和訳確認した時点の fingerprint。
// 原文追加・順序変更・文言変更時に、和訳を再確認せず古い対応を流用させない。
export const READING_QUESTION_TRANSLATION_REVIEW_LEDGER = Object.freeze({
  p_5_school_open_day: 'e17458f9',
  p_4_bicycle_safety: '372f7e7f',
  p_3_lunch_food_waste: 'd42d4048',
  p_pre2_later_school_start: 'a7eb769e',
  p_pre2plus_city_bird_count: '1e03d941',
  p_2_online_health_claims: '5fe69491',
  p_pre1_cashless_inclusion: '06302c34',
  p_1_metric_fixation: '22d17b30',
  p_5_weather_field_trip: '15032ea5',
  p_4_emergency_map: 'd0c2b50d',
  p_3_multilingual_town_guide: '1273e35e',
  p_pre2_phone_free_focus: '073a688d',
  p_pre2plus_clothing_second_life: 'ce61ab6d',
  p_2_vertical_farming: 'e6dd92f8',
  p_pre1_dark_sky_policy: '1bd76f7d',
  p_1_choice_architecture: 'da11c5fb',
  p_5_hot_summer_school: '0b2dafa9',
  p_4_school_solar_roof: '9eb20bf8',
  p_3_ai_class_rules: 'd161b43e',
  p_pre2_crowded_town_tourism: 'de98bb97',
  p_pre2plus_rural_bus_future: 'd503becc',
  p_2_space_debris: '16225121',
  p_pre1_ai_and_work: '6883b8ef',
  p_1_synthetic_media_trust: '77bcdfe7',
  p_5_lost_notebook: '8593e091',
  p_4_library_event: '834132f8',
  p_3_school_garden: '2dd1dccf',
  p_pre2_museum_volunteers: 'f53a87cd',
  p_pre2plus_repair_cafes: 'fdd956d1',
  p_2_quiet_technology: '153ae552',
  p_pre1_resilient_cities: '9c8b7675',
  p_1_collective_memory: 'd3dc9dbf',
})

export function enrichReadingQuestionWithJapanese(passageId, question, questionIndex) {
  const translated = READING_QUESTION_TRANSLATIONS[passageId]?.[questionIndex]
  const choiceTranslations = Object.fromEntries(
    question.choices.map((choice, choiceIndex) => [
      choice,
      translated?.choices?.[choiceIndex] ?? '',
    ]),
  )

  return Object.freeze({
    ...question,
    questionJa: translated?.question ?? '',
    choiceTranslations: Object.freeze(choiceTranslations),
    answerJa: choiceTranslations[question.answer] ?? '',
  })
}

export const readingChoiceTranslationFor = (question, choice) =>
  question?.choiceTranslations?.[choice] ?? ''
