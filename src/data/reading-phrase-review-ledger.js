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
  reviewedPassage('p_5_lost_notebook', '6f1e947f', ['ffffd35c', 'd846133c', '199393cd', 'e45bb49a', 'd0d61839', '89a720c2', 'a91f22be', '19eca780', 'ce6ae5dc']),
  reviewedPassage('p_4_library_event', 'b314a14f', ['0a0f1217', '89f2999f', '2db54df2', 'c6245d29', 'c1daec34', '2796088c', 'cbab0e08', 'f4e69e10', 'b9c4fd80', '45544b0f', '9c183cff', '2cb0fe78', '61ce192c']),
  reviewedPassage('p_3_school_garden', '30f53803', ['4fc62807', 'cfc59a12', '99bf5fc0', 'de6667ae', '71b04a94', 'a952ac48', '46669c3d', '06bb78f6', 'fdfd5b3a', '391d5267', '4b38481c', '33f5aa8f', '1ebd3dd3', '97b8eeb9', '84315e79', '84fea83a', '08474e9c', '63576668']),
  reviewedPassage('p_pre2_museum_volunteers', '6f4d22a8', ['f5124d34', '1538e6bd', '913492e9', '113129b3', '56755fcd', '0da12600', 'b9cc80ca', '078d860e', 'aa608bb6', 'efde4b4e', 'a8b67fdb', 'e6e97e3e', '2e012c85', '6fa36697', 'e60b05f5', '44272138', 'd4748113', 'c2a9f7f4', '533471a9']),
  reviewedPassage('p_pre2plus_repair_cafes', '8c2ab1b7', ['eaf1f195', '8cf0cb56', 'a64d9290', '194f8baa', 'bc90222e', '4dd0d01a', '7bc8b74d', 'fa291157', 'e3fed390', '77cbbc87', '18463b02', '71269846', '991ff924', 'fe5890a9', '4759e8fa', '13c8be36', 'a29af2bb', '1c34cabb', 'f4f0bdd3', '865a126a', '135b5dfc', 'e5913a42', '26069f22']),
  reviewedPassage('p_2_quiet_technology', 'a778e876', ['e9593ca7', 'eed39837', '1baf8ab4', '2f84387f', 'f1f660c5', '4aeb9bb9', '466d1c59', '89afcf19', 'c7552db4', '2330bbd2', 'd9ca7968', '67aecdc2', 'b3113cbc', '8dc820f1', '1d492728', 'fc8ea965', 'c82afea5', '9f8366ed', '0c6751a8', '86e3b6b6', '1c8e2b13', '54caeb45']),
  reviewedPassage('p_pre1_resilient_cities', 'dbffc562', ['9ab4b1b4', '7e3e998b', '086076c5', '7d68e553', '8c485f44', 'a96f930f', '4aef0508', '946160b2', '61136649', 'fded1a81', 'c5eb7fcb', 'c0dc4465', 'aa2d214e', 'e3febf77', '54401c92', '7eecae90', '7f8eeade', 'c5c1d5ec', '8b442e62', '94ffc451', '15e685a3', 'd32c276f', '15f01588', '816e2348', '4b476eb5', '1477aba6', 'c1cd72dd', '475b554c', '74b746da', '293fccc8']),
  reviewedPassage('p_1_collective_memory', 'b3d01518', ['93967815', '9b5aa1bf', '421803f9', '35bbd59c', '098a529c', 'fdbffaa9', '76e33f40', '478fb382', '9190cb24', '7e6ab69f', 'b3822850', '435cda59', '9d5827fb', '582f0c42', '6c754bc8', 'ef1f9493', 'c3a3fb72', '392b3007', '2b7a9dcc', 'd735d59d', 'aaf9e207', '509b31e3', '5745b702', 'd0de0405', '91845694', '78020ff9', '809af77c', 'c0f3d36b', '1ef47eab', 'cee7b465', 'fdb6d32a', '895291e7', 'bd2ac4f5', '83560866', '21eb5dd7', '6a0df155', '33f260da', '0e356959', '1ff0cdf8', 'c9280125', 'e8c6bdee', 'f58aee30', 'f5e91a82', '866972aa', '96d70d97', '059eb1c5']),
  reviewedPassage('p_5_school_open_day', '4e83ee4b', ['a38cd912', 'fdb701b0', '383eb659', 'e9994dcf', '02f78543', '9bdd75b8', 'a1b7b410', '602fe6b4', '541ce10e', '3e153037']),
  reviewedPassage('p_4_bicycle_safety', 'a72726c1', ['ca6cc7a6', 'b90a0014', '521dcff2', '61a28ad5', 'fc8f6968', '57bd168a', '61462b13', '50253a86', '26e468b9', '2d74e15b', '5b85073a', 'e5948359', '6404f766']),
  reviewedPassage('p_3_lunch_food_waste', '15dd5fe2', ['27f48e7f', '702714a3', 'e35bbdd6', '958df0bc', '5a03c743', 'e400c2e6', '6b716dfc', 'ee2f44b0', '4ab23199', '546cde9b', '03ba80b9', '4970a8b4', '588223a7', 'd9eb69c7', 'a24ce964', 'b3bca0d6', '68c6d944']),
  reviewedPassage('p_pre2_later_school_start', '41942a94', ['94e00632', '2e25f35e', '890df80d', '1ecc1a89', '04358cbc', '03c2d424', '7e9545b6', 'adb57504', 'dbf4ef75', '84d04b18', '99784591', 'd3c43c30', 'fb083e75', '5be76bf1', '30571896', 'b889083f', 'd4400bb0', '781d7125', '1653366e', '420054d4']),
  reviewedPassage('p_pre2plus_city_bird_count', '513ba757', ['d407675a', '6f35c816', '40da3020', '016d1bfd', 'ba8bcff7', '007a0c54', '202382fe', '575870de', '32890dbb', '45e8216c', '576b48a8', 'ebe083d7', '2506bd97', '466a47e2', 'b5c1df7c', 'ce91b047', '9154fec7', 'edb2a500', 'dfb2d599', '05ed84b2', '352b140b', '329eea1c']),
  reviewedPassage('p_2_online_health_claims', '7c4083f6', ['53873212', '5ee6306e', '743334ef', 'c0753d66', '6552d1a2', '39173941', 'b7b6a5ca', 'f92bdf9e', '802653cd', 'c2852b8c', 'cea4b0ff', 'fb87d3f8', 'b8e03c5b', '546bf5e9', '3b90d4fa', '7c7f212c', '52428442', '0318b04c', '6c6adbc2', '53a2ce56', '148c0854', '342a0a41', '34a7db1b', '13346d65']),
  reviewedPassage('p_pre1_cashless_inclusion', 'a928e4ab', ['5dd9cdb3', 'dcff966b', 'a2b4de61', 'e858281c', '6c4501d4', '1d97367b', '71fb69cf', '0808c527', '1a77f019', '9a1c43fb', 'ee607d61', 'c36d36e3', '593d5485', 'df8c925e', 'ee2ea9d2', 'd0541b61', '41821e96', 'e5a422af', '158c688c', '86cd21c5', 'd6efa9ce', 'e9b72cce', '75572ac7', 'fe799530', '4a717a06', 'a3a907b9', 'c6918b7c', 'f574bb1c', '5b1b4eb8']),
  reviewedPassage('p_1_metric_fixation', '2d7c09c4', ['3a6de927', '2df6ad58', 'b627aba6', '4c5f97bf', '0e098fe0', '5b0fd49e', 'abb9e9f2', '9942d692', 'a671b02a', 'd52f2b8d', '8de90655', '68fab71c', 'ae01269a', '1f22ff4d', 'b7a4af47', 'ed1c4b24', 'bbc45bb0', '64dcf60a', '9ad1ec05', 'e9d99ecf', '502b8cc2', '171f4a7c', '99ca655e', '9054233c', '5f3da7a5', '1d18e850', '3b665ef8', '59b8174b', '6ddcad23', '54e175fd', '97e0aa63', '41c9cb55', '703f3180', 'd7dd1e7c', '3cfa3dc2', '1501308a', 'a1f34623', '8898cdd2', '7db3186d', 'da46bcd6', '791f8437', 'e41bf836', 'df44eb5d', '49ba75f9', '4a5ee950', 'b633d153', '88584ccc', '6c9f01eb']),
])

// 投影後の全1,042文法ブロックを、文ごとに独立して固定する。
// フレーズ列が同じでも、block境界・label・kind・role・note・translationGuide・
// 収容するphrase ID列のいずれかが変われば、その文はreview-neededへ戻る。
export const READING_MANUAL_BLOCK_FINGERPRINTS = Object.freeze({
  p_5_lost_notebook: Object.freeze(['cb02e4a1', '2a778a6a', 'be2a8d7b', '0339c2df', '0936f7b4', '4a12fa77', 'd8d7fbd6', '325d45fb', '89ae8946']),
  p_4_library_event: Object.freeze(['261ad68a', 'a88e5640', '38bc1f60', 'e84c602e', '21c12d1a', '90be93eb', '688537a2', '50e1c82f', '181763f7', 'b0b2a80b', '55054de1', '64225e4f', '4c99f19e']),
  p_3_school_garden: Object.freeze(['c6a84bd6', '1bf87b74', '0e59dce8', 'e0af38c1', '00d82025', 'a3055457', '63944884', 'f3ac1a04', '123ab4fa', '8dbb6400', '38381697', '8c2d14bf', 'bdc68207', '710ed402', '798346ff', 'b6972131', 'd1889b6b', 'f571ec73']),
  p_pre2_museum_volunteers: Object.freeze(['6667e27b', '407f589f', 'd93c8c9c', '3ba281fa', '932ef3d0', '54ad136b', '1c8ababd', '2eec7353', '3082325a', '3e432270', '613f6539', '94e6ab96', '857656e8', '9d3e4795', 'f7eb1d84', '70e36685', '21e0b37e', '1172749c', 'a779915f']),
  p_pre2plus_repair_cafes: Object.freeze(['db2bd578', '6c14afe8', '8981ed5b', '687d8dc5', '12f552a9', '2fefb4e7', 'f5c3d613', '7935b358', '381b6fac', '1060bf1b', '88fe33aa', '94b34e82', '6b21cbc0', '12398738', 'c0d4ffe9', 'a6e64724', 'c717b2ac', '40ff88c1', 'f0451ccf', '1791a2fd', '9c80417c', '48b68d1d', 'b5552abf']),
  p_2_quiet_technology: Object.freeze(['0afce33e', '2ec4a638', 'b0e94099', 'edc24e26', '3aedbd58', 'f6c03d4a', '9eeec9d1', '3aaebdfc', 'a80da105', '4ec3ef32', 'a22da807', '0cf4eddf', 'd941ea42', 'dbac41f7', 'a654e9dd', '377413d5', '1579603f', '4cfb6692', '45583b4b', 'e3a66e7c', 'bd31f2c6', '80a0311d']),
  p_pre1_resilient_cities: Object.freeze(['ed519bb1', 'b25bc2f0', 'f158ac26', 'd90d6dcb', '87aefc2c', '633af1f0', '919b414e', '4f43538e', '22d76a77', 'e3e73024', 'e233d9c8', 'd69a0bee', '7c556878', '850f1432', '82d73e76', '5c0aa2eb', '80fdadf8', '95bd9799', 'ae37b19f', 'fa8b2bd0', '12a9b618', 'f8a38496', 'fd39d77e', '8c46bfdf', '5443a4a4', '2011a65d', 'f9eb84d1', 'fa181a85', '49500f82', 'e531a27e']),
  p_1_collective_memory: Object.freeze(['953c2280', 'bc577ee4', 'cbe87eff', '13ee4a91', 'e866475b', '27554351', 'dab50f69', '3be233d3', '25a2a424', '7c41cec8', '4986125c', '4a2e3b38', '4e155c8b', '5b9089be', '92f3a34b', '69741787', 'c932468c', '91670d9c', '6a486ba7', 'e17eddd7', '35104a18', 'ebd39ecb', 'e6b3be7d', '566b603b', '8afae606', 'f543c16b', 'b4bcdfa9', 'cbd19d57', '5516093f', '1472add1', '1ec146e1', '3eab9502', '3d9db578', 'a0419bd2', '0684c583', '0dfdcd6a', '65b29735', '7fce51b0', '07986849', '26bef983', '5b25235b', 'e37283d6', '112f0869', '1e5319af', 'e63b6f4b', '81fe6038']),
  p_5_school_open_day: Object.freeze(['4e59d4c5', '48e02a3a', 'ada0cece', 'b8d353d2', 'a20142c2', '52dd781c', '66970d97', 'b1ef5a8d', 'c477d005', 'ce5d7d9f']),
  p_4_bicycle_safety: Object.freeze(['c0f54c84', '7325477d', 'dd06fab9', 'd619a51f', '117f6cd5', 'bf35eb30', 'cfd144cf', 'ec8a6068', '721a1b75', 'da3fbab7', '58f73f07', '3139bc98', '57a31740']),
  p_3_lunch_food_waste: Object.freeze(['b0add882', '355ea5b4', '0c3b290c', 'd1da8e29', '2489c61c', '1e8eb262', '7c8353bc', 'b1b61950', '4da64f30', '91625811', '0ae0bbf9', 'b7119b3c', '05dbe5ed', 'a980fd26', 'e7a8e86b', '3cb11fb5', '74d30a29']),
  p_pre2_later_school_start: Object.freeze(['5afe3229', 'aff7bbd8', 'aa95a14b', '413787be', '33255788', 'ae93c1e3', 'dd504be8', '6c881d65', '3f792a02', 'f7875b83', '4f22b1cb', 'c3cee8bc', '59e69e05', '7f1e6414', '9df17063', '8487446b', '9e2b0c88', '6ccbb3d7', '41c29741', 'f33f6b70']),
  p_pre2plus_city_bird_count: Object.freeze(['2dcb720b', '929f8f85', '94aa7ec2', '25ce45c7', 'cb22c8de', 'aea6790c', 'f622779f', '6155c11f', '20506aa5', '89ea4180', 'd53403ad', '5eac09fb', 'f1909165', 'cddf4ecf', '9852099b', '038eb47b', '41386f18', '5d92d4a4', 'd9d753de', '5159fb34', 'e35fb657', '1390b0b3']),
  p_2_online_health_claims: Object.freeze(['24f074f4', 'e614bd25', '2cb65081', '6c670e06', '32779c26', '0036ab77', '4bb2d7b8', '5db20e24', '637c85ab', '2ac2a772', '9fbe4070', '7e5d2351', 'cb54105b', '9c0f69d3', 'f0f1ace8', '3fe2ef1a', 'e95d6b93', 'b93bdf41', 'c619f1b8', '40190859', '66c94383', '27d269c4', 'c375b70a', '6b6967bd']),
  p_pre1_cashless_inclusion: Object.freeze(['5c0f0a3b', '231b9c4d', 'a57b48ba', 'fd435b1e', '706f63f9', '76699aff', 'ad22e37d', '66b99178', 'c04bae88', '91fccf25', 'dce709d4', '3028537f', '62f7f9cf', 'dfc2fc78', '20e8c28f', 'ceb756c6', 'c86f1d2b', 'a918790b', '3b24694f', '9b08ec32', 'f193b51b', '001ca78b', '4aa39c38', '06f3c270', '64a26539', '72f07064', 'b6f5063f', '9a614e75', '2e0edd43']),
  p_1_metric_fixation: Object.freeze(['6c0371ad', '134255e3', '4b26b7f9', '9655d948', '679b92fa', 'd75df070', '6cdbf6ad', 'ffd312e6', '4d3fa3af', '4722e241', '4ca930e1', 'f1cce24a', '3f5442db', 'df7dd9e5', '9a94ae55', 'b7296b0c', '8405dac5', '80c48835', '9e756c2e', '55f7ee6c', '9ce37dff', 'c79fa83a', '9b44bae4', 'e9fe623f', '9eb1b713', '98861118', 'aee5c80d', '9d4b2f9b', 'd7684ae6', '3c57e112', '75d87cd4', 'b7087de3', 'd6680981', '9034d0dc', '0e19e8d4', '132154a0', '2081bcd1', '43b4a09b', 'b9869f9b', 'a7f10dc1', '22d6f8d8', 'f2ddfd78', 'ee44a25e', '6415f7b2', 'f32ad462', 'c62810bd', '6f5c72ba', '44158a65']),
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
