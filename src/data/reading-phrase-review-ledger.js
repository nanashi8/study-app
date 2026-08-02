// 人手で本文を読んだ範囲と、機械的に生成できる状態を分離する台帳。
// passage/guide の原文が1字でも変わった場合、または文が追加された場合は、
// 台帳を明示的に更新するまで review-needed へ戻す。

export function reviewSourceFingerprint(value = '') {
  let hash = 2166136261
  for (const char of `${value}`.normalize('NFKC')) {
    hash ^= char.codePointAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function reviewedPhraseFingerprint(phrases = []) {
  const payload = phrases.map((phrase) => ({
    en: phrase.en,
    role: phrase.role,
    ja: phrase.ja,
    displayEn: phrase.displayEn ?? phrase.en,
    spokenEn: phrase.spokenEn ?? phrase.en,
    explanation: phrase.explanation ?? phrase.grammarNote ?? phrase.note ?? '',
  }))
  return reviewSourceFingerprint(JSON.stringify(payload))
}

export function reviewedBlockFingerprint(blocks = []) {
  const payload = blocks.map((block) => ({
    id: block.id,
    en: block.en,
    label: block.label,
    kind: block.kind,
    role: block.role,
    note: block.note,
    translationGuide: block.translationGuide,
    phraseIds: block.phrasePairs.map((phrase) => phrase.id),
  }))
  return reviewSourceFingerprint(JSON.stringify(payload))
}

const reviewedPassage = (passageId, sourceFingerprint, phraseFingerprints) =>
  Object.freeze({
    passageId,
    sentenceCount: phraseFingerprints.length,
    sourceFingerprint,
    phraseFingerprints: Object.freeze(phraseFingerprints),
  })

// passageId＋文番号が全363文の安定ID。sourceFingerprint は、その順序と原文を
// まとめて固定する。実出力から監査時に生成せず、本文読了時点の値を記録する。
export const READING_MANUAL_REVIEW_CORPUS = Object.freeze([
  reviewedPassage('p_5_lost_notebook', '6f1e947f', ['c144d3f3', '2feab9fd', 'da7d0fc6', '8c9063a4', '4d2c27e4', 'd83a5b89', '31e5a9dc', '1563912c', '2def3337']),
  reviewedPassage('p_4_library_event', 'b314a14f', ['fdf95c50', 'e4862830', '288942c1', '0dd22dc3', 'f21b8868', 'b911e76d', '13b45770', '028ca3df', 'a01b7156', 'd9b04c1c', '83b24656', '0ac7b1b6', '9351299f']),
  reviewedPassage('p_3_school_garden', '30f53803', ['1a089861', 'a7cbe492', '3a192b77', 'bfdff3e4', '26a5662c', '97db29b5', '348ba0e1', '7e5a98bf', '9dd98f4a', 'd86eb786', 'e6d6ccf4', 'b7f806f9', '40750a66', '2d22ff0a', '4b9235f5', '181dd70b', '632f28c6', '6cee3c36']),
  reviewedPassage('p_pre2_museum_volunteers', '6f4d22a8', ['dcc84bdb', 'da99962f', '7ec2a831', '639aff79', '051b6262', 'b8b0a66e', '622d8d26', '804ebf72', '90e16178', 'e3777b05', '7a7ce941', 'c6a6f929', 'ba8daab9', 'e0a1200b', '106a9b61', '98dc484a', '103bb265', '6c2e280c', 'f43e7400']),
  reviewedPassage('p_pre2plus_repair_cafes', '8c2ab1b7', ['6983f86f', '40220717', '1f77ccd0', '8823a29f', '78901739', '59fe753c', 'c9f172b4', '18bfd54b', '064e73ec', 'a02359eb', '3ed8d541', '5410546a', '699b830f', 'aa252c2d', '8d3aa389', '19149869', '2a016873', '1f29635b', '12941636', '4554c208', '730fe587', '5686c965', 'd365756b']),
  reviewedPassage('p_2_quiet_technology', 'a778e876', ['5ff778be', '7c10156a', '812dcac5', '48a3e85d', '12e008c9', '3704968b', 'dbacb90a', 'f5a22b7d', 'cbac18aa', '5cc0a057', '73e002d4', '3991f65c', 'ed5c592a', 'bdb8ff8b', '47376602', '09cc1fa4', 'eaf58e49', '5e9ff6ce', 'b50a68e0', 'fdeaedf9', '424d20b8', '66399e39']),
  reviewedPassage('p_pre1_resilient_cities', 'dbffc562', ['cfcee8e3', 'f1ccd180', '712c929a', '8b618f70', '700b2b7d', '41dec31f', '86a05704', 'b748b2e9', 'eab33624', '479f41d4', 'b3753b7f', '02b1b863', 'fede0131', 'd930b9ac', '8be3b3f3', '2af42270', 'c5b0f3bc', 'f5a59a51', '48fa5046', '2de9f282', '20d2a3ed', 'e8627464', '7d20ad6a', '4bb4113d', 'f4c472cb', 'cb3c4f8f', '8f17e34f', 'f02926f3', '7d0a27ae', 'cb2208c6']),
  reviewedPassage('p_1_collective_memory', 'b3d01518', ['e79a4c62', 'c8d325e3', '11a82957', '7854b03b', '479609ff', '11f91eae', '79cc7b55', '55afa08f', 'e884f8a3', '30c5308d', '50853d9b', '407de0da', 'bcebc1d8', 'f5b6f8ae', 'dc74e442', 'd7f81304', 'd4690ae7', '20be6ffc', '19865874', '87860799', 'ca126680', '20e63c40', 'd9a3d308', '621ec6e4', '2ead2167', '5d8f87b7', '02bd45cf', 'a3c01451', '2432e8a6', '84da9a25', '7167e332', '6cab1460', '9cce02f5', 'e4565ffd', '853f311a', 'b6b030d7', '21294c1a', '7abd9ff0', '2ae32b9a', 'e4c244b6', '2ab4ea63', '13e09c49', '1a21f586', '0ed667bb', '24293afb', '7c4d8049']),
  reviewedPassage('p_5_school_open_day', '4e83ee4b', ['29f4055d', '33ec5cf4', '3e4186f8', '8374fe9a', '8d66c284', 'cb0be52f', 'f50e6d83', 'f3c2f342', '6b4f70d6', 'd44735e6']),
  reviewedPassage('p_4_bicycle_safety', 'a72726c1', ['ba42050c', '6be0bf39', '760fbd1c', '246a64e2', '313ef6c0', 'cb4a7806', 'ffa210be', 'fb1177c8', '9d99b5c1', '5e1b600d', '79ccc68d', 'b9fe44d6', '9e04754e']),
  reviewedPassage('p_3_lunch_food_waste', '15dd5fe2', ['0d1f54dd', 'eadb42a6', '1d50ba2e', '8d5ab712', 'b7c1255a', '45d42f08', 'a32311ed', '89797784', '35c7bcc4', '3f3daecb', '81088091', '331b6c4f', 'dc658848', '5b48862d', '0ee3a436', '72bba188', 'ccbe0fb0']),
  reviewedPassage('p_pre2_later_school_start', '41942a94', ['7aab4fb5', '09d5f724', '6854ec63', '202ca9c9', 'a15c83ad', '41a3e966', '8d9e042d', '474e5f44', 'f8d5e380', '1e590ecf', '23d4cd5a', 'c00012c1', 'f405a86f', 'b7e3bc45', 'dc4dcbf1', 'bcefcce3', 'be82b649', 'e45b0194', '4361fc8e', 'fc41376f']),
  reviewedPassage('p_pre2plus_city_bird_count', '513ba757', ['1ca946e0', '34ac977e', 'c7211f97', 'c093fe66', '2fd794c8', 'a21a33bf', '81f39672', '0b4e3eac', '5276f627', 'efda0a96', '260f5a95', 'c78dba0d', '3f41b2ac', '3d356ce3', '60c1ad11', '2cc71596', 'aba8f39e', '594a72c3', '67dd892d', '77ad46ea', '6c1a09ae', 'f30d45ad']),
  reviewedPassage('p_2_online_health_claims', '7c4083f6', ['32747a6d', 'c158b08b', '6e06cb7a', 'a86e9c40', '94afb423', '009cc967', 'ced0edea', 'af6520f7', '86e78e71', 'b2a35121', '0563de7e', '0692950d', 'db7d974a', '69f7af74', 'a8f595b0', '25f4e701', '8bc20a53', '01bdbbfe', '438e7bec', '5c7ad373', '7dcada46', 'd7da17ec', '58c986ac', '5217b053']),
  reviewedPassage('p_pre1_cashless_inclusion', 'a928e4ab', ['afb41978', 'ee6a47d9', '54bf219c', 'da7f2c09', '8205c248', '20d9c2b6', 'e3b4da72', 'a95106f9', 'bb9f0e88', '658043f4', 'f0600ea8', 'e12d7fd9', 'f50dc011', '7286f932', 'c33b7d93', 'c21bce39', '8ef14570', '8be093fc', 'e4f74431', '59905364', 'b0fff74e', 'f143e100', '881a1478', 'bcf38a1a', '21652068', 'b4507ddd', 'b77795f4', 'a8977b23', 'f189407e']),
  reviewedPassage('p_1_metric_fixation', '2d7c09c4', ['8b9b16b0', 'e2786198', 'f87e7792', 'e7f8996a', 'db83fbfb', '267241b0', '98dcfc54', 'e9dd1740', 'ab0f7f5b', '7bb7e764', '251a130f', 'df683dc8', 'a526717b', 'cf5d309b', '90f05bd7', '0611a894', '10de7011', '5ea7bfbc', '45e34290', '99180c4e', '093eae21', 'b5d7632d', 'e96220ac', 'c885f673', '317ab68b', '46c48479', 'f5211a1b', '7f743652', '1637667b', 'e7883b58', 'ce96e44e', '5b776ea4', '99e2a360', 'da634394', '19dde117', '21ebdf1d', '6890fb0b', '8b7fcd9b', '3f2d12d6', 'ccfc95c8', '39fd9582', '816b770a', 'c0bffa2e', '82f4907a', 'b84d7db3', 'e7ac5df4', 'b966da1e', 'c40479f1']),
])

// 投影後の全1,042文法ブロックを、文ごとに独立して固定する。
// フレーズ列が同じでも、block境界・label・kind・role・note・translationGuide・
// 収容するphrase ID列のいずれかが変われば、その文はreview-neededへ戻る。
export const READING_MANUAL_BLOCK_FINGERPRINTS = Object.freeze({
  p_5_lost_notebook: Object.freeze(['cb02e4a1', '2a778a6a', 'fa96c4da', '6927614d', '0936f7b4', '4a12fa77', 'd8d7fbd6', '325d45fb', '4d24acb8']),
  p_4_library_event: Object.freeze(['261ad68a', 'a88e5640', '38bc1f60', 'e84c602e', '568a0604', 'd869134d', '688537a2', '50e1c82f', '181763f7', 'b0b2a80b', '5be34529', '5d40afc6', '626a7846']),
  p_3_school_garden: Object.freeze(['c6a84bd6', '1bf87b74', '0e59dce8', 'e0af38c1', '00d82025', 'a3055457', '63944884', 'f3ac1a04', '123ab4fa', '8f9e289c', '38381697', '8c2d14bf', 'bdc68207', '710ed402', '1e79335d', 'b6972131', 'b70213d7', '0ac9ba1f']),
  p_pre2_museum_volunteers: Object.freeze(['6667e27b', '2ba40ad2', 'd5f1c405', '3ba281fa', '7765dc3c', 'e7011419', '1c8ababd', '85e62366', '3082325a', '3e432270', '613f6539', 'd9e524a0', '857656e8', 'f00b2199', '45e92c8c', '70e36685', 'a63f3bfb', '1172749c', 'a779915f']),
  p_pre2plus_repair_cafes: Object.freeze(['db2bd578', '6c14afe8', '6808d69d', '687d8dc5', '12f552a9', '2fefb4e7', 'f5c3d613', '7935b358', '381b6fac', '1060bf1b', '88fe33aa', '94b34e82', '6b21cbc0', 'cdd23f9a', 'c0d4ffe9', 'e01f9405', 'c717b2ac', '40ff88c1', 'ba075b37', '1791a2fd', '9c80417c', '83a1db6f', 'b5552abf']),
  p_2_quiet_technology: Object.freeze(['2db0ec82', '2ec4a638', '25372a14', '0ab3d66f', 'cadf4182', 'f6c03d4a', '9eeec9d1', 'ec7a19bf', 'a80da105', '14df116b', '57d8253f', '252fc227', '7826d328', 'f8a87165', '40aa34ac', '739f9bc4', '1579603f', '4cfb6692', '45583b4b', 'e3a66e7c', '344f2a73', '7fca24ba']),
  p_pre1_resilient_cities: Object.freeze(['ed519bb1', 'b25bc2f0', '4e3a872a', 'd90d6dcb', '87aefc2c', 'bc485254', '0c1829d2', '4f43538e', 'ea68d284', '54f144da', 'e233d9c8', 'e6649e62', '46029fd0', '850f1432', '82d73e76', '5c0aa2eb', '80fdadf8', '95bd9799', 'ae37b19f', '3188c6a0', '12a9b618', '0b7e57ac', '784a18dc', '58c0ade3', '25ceffd2', '2011a65d', 'f9eb84d1', 'f6b8ab9a', '49500f82', 'e531a27e']),
  p_1_collective_memory: Object.freeze(['0fb87b92', '80da969a', 'cbe87eff', '13ee4a91', '986e198f', '27554351', 'dab50f69', '3be233d3', '4641e02d', '7c41cec8', '4986125c', '3cda5631', '9eb7acba', '165266f3', '92f3a34b', '69741787', 'dfa80edd', '91670d9c', '6a486ba7', 'c2776702', '35104a18', '6c2e0bae', 'a84c9f37', 'dd316ab3', '8afae606', 'fd5092a6', 'b4bcdfa9', 'cbd19d57', '5516093f', '1472add1', '7c3d517f', 'fa13a7e6', '05bfeee9', 'd9157309', 'e3a2d119', '032aa584', '65b29735', '8d301ef7', '07986849', '26bef983', '5b25235b', 'cf1b659a', '112f0869', 'ad26586e', 'e63b6f4b', '81fe6038']),
  p_5_school_open_day: Object.freeze(['4e59d4c5', '48e02a3a', 'ada0cece', 'b8d353d2', 'a20142c2', '52dd781c', '66970d97', 'b1ef5a8d', '52341d9a', 'ce5d7d9f']),
  p_4_bicycle_safety: Object.freeze(['c0f54c84', '7325477d', 'dd06fab9', 'd619a51f', 'c599b378', '46d0c9de', 'cfd144cf', 'ec8a6068', '721a1b75', 'da3fbab7', '58f73f07', '3139bc98', '2d95bea9']),
  p_3_lunch_food_waste: Object.freeze(['b0add882', '8325d363', '0c3b290c', 'd1da8e29', '2489c61c', '1e8eb262', '7c8353bc', 'b1b61950', '5cd78e88', 'd7e98832', '0ae0bbf9', 'b7119b3c', '05dbe5ed', 'a980fd26', 'e7a8e86b', '3cb11fb5', '553c123e']),
  p_pre2_later_school_start: Object.freeze(['5afe3229', 'aff7bbd8', 'aa95a14b', '413787be', '33255788', 'ae93c1e3', '037e0593', '6c881d65', 'ea93420f', 'f7875b83', '4f22b1cb', 'cdf95e64', '59e69e05', '937e51d6', '9df17063', '8487446b', '9e2b0c88', '6ccbb3d7', '141e2e31', '9c5295d0']),
  p_pre2plus_city_bird_count: Object.freeze(['fe6b8512', '929f8f85', '94aa7ec2', '25ce45c7', 'b961c152', 'aea6790c', 'f622779f', '6155c11f', '20506aa5', 'd74ab2b3', '69fc577f', '5eac09fb', '7b26412c', 'cddf4ecf', 'c92529a0', '7cf4ac26', 'aa02bf94', '5d92d4a4', 'd9d753de', 'a0ce40c8', '8744ed8e', '1390b0b3']),
  p_2_online_health_claims: Object.freeze(['24f074f4', 'e614bd25', '70dd2f27', '18ed4785', '2c21d6e2', '0036ab77', '09a70730', '5db20e24', '637c85ab', '2ac2a772', '9fbe4070', '7e5d2351', 'db9cb347', '9c0f69d3', 'f0f1ace8', 'bac7072a', 'c9950ad4', 'b93bdf41', 'f1539548', '40190859', '66c94383', '27d269c4', 'c75e5ad1', '8808ea91']),
  p_pre1_cashless_inclusion: Object.freeze(['5c0f0a3b', '231b9c4d', 'a57b48ba', 'fd435b1e', 'c193b620', '76699aff', 'ad22e37d', '66b99178', 'b54cc8de', '91fccf25', 'fd81a818', '3028537f', '62f7f9cf', 'bc1d1dc9', 'a46dddb9', 'ceb756c6', 'c86f1d2b', 'a918790b', '3b24694f', '6b545b10', 'f193b51b', '001ca78b', '4aa39c38', '06f3c270', '64a26539', '72f07064', 'b6f5063f', '5640b227', '2e0edd43']),
  p_1_metric_fixation: Object.freeze(['6c0371ad', '134255e3', '4b26b7f9', 'd6aa4037', 'cb8f136e', 'd75df070', 'd31b3b7b', '543d7b1e', '4d3fa3af', '4722e241', 'fc5365b4', 'f1cce24a', 'ba1e6457', 'df7dd9e5', '9a94ae55', 'b7296b0c', 'a9e3a4a0', '80c48835', '136a27ec', '55f7ee6c', '9ce37dff', '2545326c', '9b44bae4', 'e9fe623f', '9eb1b713', '98861118', '9f3d07fd', '91ba106f', '2811495e', '3c57e112', '0b4879f4', 'b7087de3', 'd6680981', 'e80551a3', '0e19e8d4', '54dff470', '2081bcd1', '0ce8e163', '601c78ba', 'a7f10dc1', '22d6f8d8', 'f2ddfd78', 'ee44a25e', 'c0b4d068', 'b644acfe', 'abd7acaf', 'f31cb386', '44f2d4f1']),
})

const readingCorpusByPassage = new Map(
  READING_MANUAL_REVIEW_CORPUS.map((entry) => [entry.passageId, entry]),
)

export const READING_MANUAL_REVIEW_LEDGER = Object.freeze(Object.fromEntries(
  READING_MANUAL_REVIEW_CORPUS.flatMap((entry) =>
    Array.from({ length: entry.sentenceCount }, (_, offset) => {
      const reviewId = `${entry.passageId}#${offset + 1}`
      return [reviewId, Object.freeze({
        reviewId,
        passageId: entry.passageId,
        sentenceIndex: offset,
        sourceFingerprint: entry.sourceFingerprint,
        phraseFingerprint: entry.phraseFingerprints[offset],
        blockFingerprint: READING_MANUAL_BLOCK_FINGERPRINTS[entry.passageId]?.[offset] ?? '',
        reviewState: 'audit-confirmed',
        status: 'confirmed',
      })]
    })),
))

export function readingManualReviewEvidence(sentence, phrases, blocks) {
  const reviewId = `${sentence?.reviewId ?? ''}`
  const evidence = READING_MANUAL_REVIEW_LEDGER[reviewId]
  if (!evidence) return null
  const passage = readingCorpusByPassage.get(evidence.passageId)
  if (!passage || sentence?.reviewPassageFingerprint !== passage.sourceFingerprint) return null
  if (reviewedPhraseFingerprint(phrases) !== evidence.phraseFingerprint) return null
  if (reviewedBlockFingerprint(blocks) !== evidence.blockFingerprint) return null
  return evidence
}

const reviewedLong = (id, sourceFingerprint, phraseFingerprint) => Object.freeze({
  id,
  sourceFingerprint,
  phraseFingerprint,
  reviewState: 'audit-confirmed',
  status: 'confirmed',
})

// 12語以上の長い一文33件はIDと原文を個別に固定する。
export const LONG_MANUAL_REVIEW_LEDGER = Object.freeze(Object.fromEntries([
  reviewedLong('exam_syn_as_long_as', '850a2d74', 'dbb2b908'),
  reviewedLong('curr_syn_gr_more_1_tense_01', '55867ab7', '255c1467'),
  reviewedLong('curr_syn_gr_auto_1_agreement_neither_001', 'ba11e5fa', 'f08bad1d'),
  reviewedLong('curr_syn_gr_auto_1_all_the_more_001', '8e4859fd', '3eab7c11'),
  reviewedLong('curr_syn_gr_auto_1_future_perfect_progressive_001', '62cf7d81', 'e4d2ed82'),
  reviewedLong('curr_syn_gr_auto_1_no_sooner_001', '967d8cb2', '5db0b6a7'),
  reviewedLong('curr_syn_gr_auto_1_provided_that_001', '76bdd39f', 'd56889ec'),
  reviewedLong('curr_syn_gr_auto_1_superior_to_001', '1d63c464', '2b4047cd'),
  reviewedLong('curr_syn_gr_auto_1_were_to_001', 'f96d1735', '564a0612'),
  reviewedLong('curr_syn_gr_exam_university_1_degree_adverb_001', '15c6b4b4', '39bfa65a'),
  reviewedLong('curr_syn_gr_more_1_modal_02', 'f6c5e6fa', '9c4e0657'),
  reviewedLong('curr_syn_gr_more_1_emph_01', '78b70442', '305a4e8c'),
  reviewedLong('curr_syn_gr_auto_1_agreement_neither_002', 'e99da969', 'e62332d9'),
  reviewedLong('curr_syn_gr_auto_1_all_the_more_002', '34a66316', '200d779d'),
  reviewedLong('curr_syn_gr_auto_1_extent_to_which_002', '01a59ebb', '01737079'),
  reviewedLong('curr_syn_gr_auto_1_future_perfect_progressive_002', '5724eac6', 'b4144239'),
  reviewedLong('curr_syn_gr_auto_1_lest_002', '47735b7a', '28714336'),
  reviewedLong('curr_syn_gr_auto_2_gerund_idiom_001', '8921790c', '38b09581'),
  reviewedLong('curr_syn_gr_auto_2_inanimate_subject_001', 'bbfe6fdd', '5dbd64c5'),
  reviewedLong('curr_syn_gr_auto_2_past_subjunctive_001', '5590e2f3', 'c3dd5aca'),
  reviewedLong('curr_syn_gr_auto_pre2_correlative_001', 'bc48c2bd', '523151a8'),
  reviewedLong('curr_syn_gr_pre2_pron_3', 'b053f4a4', '69c050c7'),
  reviewedLong('curr_syn_gr_auto_pre1_agreement_001', 'e3f63d94', 'deb38d6a'),
  reviewedLong('curr_syn_gr_auto_pre1_be_to_001', '3f8d5c0d', 'dbfc8372'),
  reviewedLong('curr_syn_gr_auto_pre1_conditional_inversion_001', 'c8954612', '8bbed689'),
  reviewedLong('curr_syn_gr_auto_pre1_whale_001', '40b9109f', 'c1608ac4'),
  reviewedLong('curr_syn_gr_auto_pre1_agreement_002', 'd199a180', '97a35d91'),
  reviewedLong('curr_syn_gr_auto_pre1_appositive_that_002', '134b8538', 'ad302d71'),
  reviewedLong('curr_syn_gr_auto_pre1_be_to_002', '52eb99ee', 'c6bff82d'),
  reviewedLong('curr_syn_gr_auto_pre1_comparison_002', '75356b2d', 'b77a3ea7'),
  reviewedLong('curr_syn_gr_auto_pre1_conditional_inversion_002', '2f8ac8fa', '8ae63a4b'),
  reviewedLong('curr_syn_gr_auto_pre1_ellipsis_002', '2ff92c95', '05de00fa'),
  reviewedLong('curr_syn_gr_auto_pre1_only_inversion_002', 'f8f1c8a0', 'eccb69f4'),
].map((entry) => [entry.id, entry])))

export function longManualReviewEvidence(id, sourceEnglish, phrases) {
  const evidence = LONG_MANUAL_REVIEW_LEDGER[id]
  if (!evidence || reviewSourceFingerprint(sourceEnglish) !== evidence.sourceFingerprint) return null
  if (reviewedPhraseFingerprint(phrases) !== evidence.phraseFingerprint) return null
  return evidence
}

// therefore / consequently が介在する6述語も、短い助動詞＋本動詞の
// 一つのVとして確定したため、現在の未決規則はない。
export function pendingVerbGroupRule() {
  return ''
}
