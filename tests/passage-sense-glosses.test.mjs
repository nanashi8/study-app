import assert from 'node:assert/strict'
import test from 'node:test'
import { resolvePassageWord } from '../src/data/passage-gloss.js'
import { PASSAGE_SENSE_GLOSSES } from '../src/data/passage-sense-glosses.js'
import { ALL_PASSAGES, getPassage } from '../src/data/passages.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'
import { tokenize } from '../src/lib/text.js'

const sentenceAt = (passageId, sentenceNumber) => getPassage(passageId).sentences[sentenceNumber - 1]

// 長文の n 文目（1始まり）で、本文の語をタップしたときに出る見出し語と意味。
const tap = (passageId, sentenceNumber, key) => {
  const sentence = sentenceAt(passageId, sentenceNumber)
  assert.ok(tokenize(sentence.en).some((token) => token.key === key), `${passageId}#${sentenceNumber} に ${key} が無い`)
  return resolvePassageWord(key, sentence.gloss)
}

test('leaves は葉の文では leaf、出発する文では leave を引く', () => {
  assert.equal(sentenceAt('p_5_hot_summer_school', 5).en, 'The plants make a cool wall of leaves.')
  assert.deepEqual(tap('p_5_hot_summer_school', 5, 'leaves'), { id: 'leaf', ja: '葉（複数）' })
  assert.match(sentenceAt('p_3_school_garden', 8).en, /insects were eating the leaves of several plants/)
  assert.deepEqual(tap('p_3_school_garden', 8, 'leaves'), { id: 'leaf', ja: '葉（複数）' })
  assert.match(sentenceAt('p_3_school_garden', 11).en, /the number of damaged leaves soon decreased/)
  assert.deepEqual(tap('p_3_school_garden', 11, 'leaves'), { id: 'leaf', ja: '葉（複数）' })

  assert.equal(sentenceAt('p_5_weather_field_trip', 7).en, 'The bus leaves the zoo at two thirty.')
  assert.equal(tap('p_5_weather_field_trip', 7, 'leaves').id, 'leave')
  assert.equal(PASSAGE_SENSE_GLOSSES['The bus leaves the zoo at two thirty.'], undefined)
})

// 名詞・動詞などで割れやすい形は、全長文のすべての出現を一文ずつ読んで見出し語を決めた。
// 長文を足してこれらの形が増えたら、その文を読んで、ここと passage-sense-glosses.js に足す。
const SPLIT_FORM_SENSES = {
  leaves: {
    'p_3_school_garden#8': 'leaf',
    'p_3_school_garden#11': 'leaf',
    'p_pre1_cashless_inclusion#9': 'leave',
    'p_5_weather_field_trip#7': 'leave',
    'p_5_hot_summer_school#5': 'leaf',
    'p_1_synthetic_media_trust#21': 'leave',
    'p_ext_2000_customs_across_borders#43': 'leave',
    'p_ext_3000_shared_watershed#5': 'leaf',
    'p_ext_3000_shared_watershed#15': 'leave',
    'p_ext_3000_shared_watershed#29': 'leaf',
    'p_ext_3000_shared_watershed#53': 'leave',
    'p_ext_4000_generational_city#198': 'leave',
  },
  saw: { 'p_1_synthetic_media_trust#32': 'see', 'p_ext_2000_customs_across_borders#92': 'see' },
  left: {
    'p_2_quiet_technology#16': 'leave',
    'p_3_lunch_food_waste#1': 'left_2',
    'p_3_lunch_food_waste#6': 'left_2',
    'p_1_choice_architecture#21': 'leave',
    'p_pre2_crowded_town_tourism#4': 'leave',
    'p_2_disaster_translators#28': 'leave',
    'p_ext_2000_customs_across_borders#54': 'leave',
    'p_ext_4000_generational_city#101': 'leave',
  },
  found: {
    'p_2_quiet_technology#7': 'found',
    'p_2_online_health_claims#7': 'find',
    'p_4_emergency_map#9': 'find',
    'p_3_multilingual_town_guide#15': 'find',
    'p_3_ai_class_rules#8': 'find',
    'p_3_ai_class_rules#9': 'find',
    'p_ext_4000_generational_city#200': 'found',
  },
  lies: {
    'p_1_collective_memory#32': 'lie_2',
    'p_ext_2000_customs_across_borders#93': 'lie_2',
    'p_ext_4000_generational_city#62': 'lie_2',
    'p_ext_4000_generational_city#182': 'lie_2',
  },
  rest: { 'p_pre2_school_radio#26': 'rest_2' },
  rests: {
    'p_ext_2000_customs_across_borders#105': 'rest',
    'p_ext_3000_shared_watershed#64': 'rest',
    'p_ext_3000_shared_watershed#121': 'rest',
  },
  bear: { 'p_ext_4000_generational_city#23': 'bear' },
  bears: { 'p_1_metric_fixation#37': 'bear' },
  felt: {
    'p_pre2_phone_free_focus#15': 'feel',
    'p_2_injury_free_practice#20': 'feel',
    'p_pre2_school_radio#8': 'feel',
  },
  lead: { 'p_2_factory_museum#27': 'lead' },
}

test('割れやすい形は、全長文のすべての出現が確かめた見出し語に当たる', () => {
  const actual = Object.fromEntries(Object.keys(SPLIT_FORM_SENSES).map((key) => [key, {}]))
  for (const passage of ALL_PASSAGES) {
    for (const [index, sentence] of passage.sentences.entries()) {
      for (const token of tokenize(sentence.en)) {
        if (!(token.key in actual)) continue
        actual[token.key][`${passage.id}#${index + 1}`] = resolvePassageWord(token.key, sentence.gloss)?.id
      }
    }
  }
  assert.deepEqual(actual, SPLIT_FORM_SENSES)
  // 辞書の bear は「クマ」だけなので、動詞の文は意味まで文ごとに持つ。
  assert.deepEqual(tap('p_ext_4000_generational_city', 23, 'bear'), { id: 'bear', ja: '耐える' })
})

test('確かめた文と語の組：同じつづりの別の語・品詞・熟語を文脈で引き分ける', () => {
  const confirmed = [
    // [長文, 文番号, 語, 見出し語, 意味]
    ['p_3_lunch_food_waste', 1, 'left', 'left_2', '残された・残っている'],
    ['p_2_disaster_translators', 28, 'left', 'leave', '出た・離れた'],
    ['p_1_collective_memory', 32, 'lies', 'lie_2', '（〜に）ある'],
    ['p_1_synthetic_media_trust', 32, 'saw', 'see', '見た'],
    ['p_pre2_school_radio', 26, 'rest', 'rest_2', '残り'],
    ['p_1_metric_fixation', 37, 'bears', 'bear', '負う・引き受ける'],
    ['p_pre2_pond_comeback', 15, 'bank', 'bank_2', '岸・土手'],
    ['p_3_ai_class_rules', 8, 'found', 'find', '分かった・気づいた'],
    ['p_4_school_solar_roof', 7, 'thought', 'think', '思った'],
    ['p_4_library_event', 8, 'may', 'may_2', '〜してよい・〜できる（助動詞）'],
    ['p_pre2_museum_volunteers', 7, 'may', 'may_2', '〜かもしれない・〜することがある（助動詞）'],
    ['p_pre2_museum_volunteers', 16, 'used', 'use', '（used to で）以前は〜していた'],
    ['p_pre1_resilient_cities', 23, 'lives', 'life', '命（複数）'],
    ['p_pre2_later_school_start', 2, 'sleep', 'sleep', '睡眠'],
    ['p_1_collective_memory', 20, 'calls', 'call', '求める声・呼びかけ（複数）'],
    ['p_3_school_garden', 9, 'research', 'research', '調べる・研究する'],
    ['p_ext_2000_customs_across_borders', 107, 'own', 'own', '自分自身の'],
  ]
  for (const [passageId, sentenceNumber, key, id, ja] of confirmed) {
    assert.deepEqual(tap(passageId, sentenceNumber, key), { id, ja }, `${passageId}#${sentenceNumber} ${key}`)
  }

  // つづりから引いた語がそのまま文脈に合う文には、台帳を置かない。
  const spelled = [
    ['p_4_school_solar_roof', 5, 'may', 'may'],
    ['p_pre1_cashless_inclusion', 5, 'bank', 'bank'],
    ['p_2_quiet_technology', 7, 'found', 'found'],
    ['p_pre2_later_school_start', 5, 'sleep', 'sleep'],
    ['p_ext_4000_generational_city', 74, 'lives', 'live'],
    ['p_pre2_museum_volunteers', 5, 'used', 'used'],
  ]
  for (const [passageId, sentenceNumber, key, id] of spelled) {
    assert.equal(tap(passageId, sentenceNumber, key).id, id, `${passageId}#${sentenceNumber} ${key}`)
    assert.equal(PASSAGE_SENSE_GLOSSES[sentenceAt(passageId, sentenceNumber).en]?.[key], undefined)
  }
})

test('語義台帳の英文はすべて本文にあり、本文のタップが台帳どおりの見出し語と意味を返す', () => {
  const sentences = new Map()
  for (const passage of ALL_PASSAGES) {
    for (const [index, sentence] of passage.sentences.entries()) {
      sentences.set(sentence.en, { at: `${passage.id}#${index + 1}`, sentence })
    }
  }
  let words = 0
  for (const [en, senses] of Object.entries(PASSAGE_SENSE_GLOSSES)) {
    const place = sentences.get(en)
    assert.ok(place, `本文に無い英文: ${en}`)
    const keys = new Set(tokenize(en).map((token) => token.key))
    for (const [key, sense] of Object.entries(senses)) {
      words += 1
      assert.ok(keys.has(key), `${place.at}: 本文に ${key} が無い`)
      assert.deepEqual(resolvePassageWord(key, place.sentence.gloss), { id: sense.id, ja: sense.ja }, `${place.at} ${key}`)
      assert.notDeepEqual(resolvePassageWord(key), { id: sense.id, ja: sense.ja }, `${place.at} ${key}: つづりから引いても同じ`)
    }
  }
  assert.equal(Object.keys(PASSAGE_SENSE_GLOSSES).length, 814)
  assert.equal(words, 1295)
})

test('語尾を落とすと別の語（ad・rid・suite・us）に当たる活用形は、元の語へつなぐ', () => {
  const forms = [
    ['added', 'add'],
    ['adding', 'add'],
    ['reader', 'read'],
    ['rider', 'ride'],
    ['riding', 'ride'],
    ['suited', 'suit'],
    ['using', 'use'],
  ]
  for (const [key, id] of forms) assert.equal(resolvePassageWord(key)?.id, id, key)
})

test('語義を直しても、確認済みの語順訳はそのまま残る', () => {
  // この3文は、語義が変わると解析器の句の区切りが動く。訂正台帳の照合と指紋を合わせてある。
  for (const [passageId, sentenceNumber] of [
    ['p_4_school_solar_roof', 7],
    ['p_3_ai_class_rules', 25],
    ['p_pre2plus_rural_bus_future', 16],
  ]) {
    const analysis = analyzeReadingSentence(sentenceAt(passageId, sentenceNumber))
    assert.ok(
      analysis.phraseSequence.every((phrase) => phrase.status === 'confirmed'),
      `${passageId}#${sentenceNumber}`,
    )
  }
  const solar = analyzeReadingSentence(sentenceAt('p_4_school_solar_roof', 7))
  assert.deepEqual(solar.phraseSequence.slice(0, 5).map((phrase) => `${phrase.role} ${phrase.en}＝${phrase.ja}`), [
    'S Some students＝一部の生徒は',
    'V thought＝〜と思いました（内容は次へ）',
    'S the panels＝パネルが',
    'V were＝〜です（状態は次へ）',
    'C broken＝壊れている',
  ])
})
