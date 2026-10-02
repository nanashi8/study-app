#!/usr/bin/env node
// 古典・漢文の全教材で、コース・難易度（重要度）の重複を数える（requests/2026-10-02-koten-level-merge.json の overlap-survey）。
//   ① 段：各項目がちょうど1つの決まった段を持つか（id の重なり・決まっていない段の名前）
//   ② 二重登録：同じ見出しの項目が2つないか（古典単語は見出し語＋品詞、ほかは題名・本文）
//   ③ コース：古典の学年・目標別コースごとの件数と、1つ下のコースと重なる数（コースは1つ下を含む積み上げ）。
//      1つ下のコースから増える項目がないコース（中身が同じコース）を重複とする
//   ④ 教材をまたぐ組：古典文法の題名の「」の中の語と古典単語の見出し語・漢字表記、漢文法の題名の字と漢語の見出しが
//      同じ文字になる組をすべて出し、CROSS_PAIRS（1組ずつ本文を読んで決めた分け方）で
//      同じ語・識別の項目が見分ける語の1つ・別の語に分ける。同じ語の組は段の食い違いを数える
//   ⑤ 物差しを広げた重複（2026-10-02 の再検査）：見出しが違っても同じ語かもしれない組（読みの部分・漢字表記・つづりの近さ・
//      訳語の重なり・見出しを含む組、古典単語×漢語など）を classics-wide-overlap.mjs で拾い、1組ずつ読んだ分け方で
//      同じ語の二重登録・同じ語の別の形・別の語に分ける
// ①②③の重複、④⑤で分け方を決めていない組、⑤の二重登録が1件でもあれば失敗する。④の段の食い違いと⑤の別の形は数えて報告する。
// 使い方: node scripts/checks/classics-level-overlap.mjs [--json]
import { fileURLToPath } from 'node:url'
import { surveyWideOverlap } from './classics-wide-overlap.mjs'
import { KOTEN_WORD_LEVELS, KOTEN_WORDS } from '../../src/data/koten.js'
import { KOTEN_GRAMMAR, KOTEN_GRAMMAR_ITEM_LEVELS } from '../../src/data/koten-grammar.js'
import { KOTEN_CULTURE, KOTEN_CULTURE_LEVELS } from '../../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS, KOTEN_INTERPRETATION_LEVELS } from '../../src/data/koten-interpretations.js'
import { KOTEN_CURRICULUM_PATHS } from '../../src/data/koten-curriculum.js'
import { KANBUN_LEVELS } from '../../src/data/kanbun-meta.js'
import { KANBUN_VOCAB } from '../../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../../src/data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES, KANBUN_KUNDOKU_LEVELS } from '../../src/data/kanbun-kundoku.js'

const kanbunLevels = KANBUN_LEVELS.map((level) => ({ id: level.id, label: level.shortLabel }))

/** 調べる教材。levels は段の並び（易しい順）、keys は二重登録を見る見出しの取り出し方。 */
export const CLASSICS_CONTENTS = [
  {
    id: 'kotenVocab', label: '古典単語', unit: '語', items: KOTEN_WORDS,
    levels: KOTEN_WORD_LEVELS.map((level) => ({ id: level.id, label: level.shortLabel })),
    keys: { '見出し語＋品詞': (word) => `${word.word}（${word.pos}）` },
  },
  {
    id: 'kotenGrammar', label: '古典文法', unit: '項目', items: KOTEN_GRAMMAR,
    levels: KOTEN_GRAMMAR_ITEM_LEVELS.map((level) => ({ id: level.id, label: level.shortLabel })),
    keys: { 題名: (item) => item.title },
  },
  {
    id: 'kotenCulture', label: '古典常識', unit: 'テーマ', items: KOTEN_CULTURE,
    levels: Object.entries(KOTEN_CULTURE_LEVELS).map(([id, level]) => ({ id, label: level.label })),
    keys: { 題名: (item) => item.title },
  },
  {
    id: 'kotenInterpretation', label: '短文解釈', unit: '問', items: KOTEN_INTERPRETATIONS,
    levels: KOTEN_INTERPRETATION_LEVELS.map((level) => ({ id: level.id, label: level.label })),
    keys: { 本文: (item) => item.text },
  },
  { id: 'kanbunVocab', label: '漢語', unit: '語', items: KANBUN_VOCAB, levels: kanbunLevels, keys: { 見出し: (item) => item.title } },
  { id: 'kanbunGrammar', label: '漢文法', unit: '項目', items: KANBUN_GRAMMAR, levels: kanbunLevels, keys: { 題名: (item) => item.title } },
  { id: 'kanbunCulture', label: '漢文常識', unit: 'テーマ', items: KANBUN_CULTURE, levels: kanbunLevels, keys: { 題名: (item) => item.title } },
  {
    id: 'kanbunKundoku', label: '返り点・訓読', unit: '題', items: KANBUN_KUNDOKU_EXERCISES,
    levels: KANBUN_KUNDOKU_LEVELS.map((level) => ({ id: level.id, label: level.label })),
    keys: { 題名: (item) => item.title, 訓読文: (item) => item.marked },
  },
]

const SAME = 'same'
const IDENTIFICATION = 'identification'
const different = (why) => ({ kind: 'different', why })

// ④の組の分け方（2026-10-02 に候補107組の本文を1組ずつ読んで決めた）。キーは「文法の項目の id|単語の id」。
//   same           … 文法の項目が、単語の項目と同じ語を同じ働きで扱う（「え・よも」のように数語をまとめた項目を含む。
//                    単語の項目が多義で、文法の項目の働きを意味・説明に持つものも同じ語とする）
//   identification … 識別・見分け方の項目が、見分ける語の1つとして扱う
//   different      … 文字が同じ別の語か、単語の項目が持たない働き（理由を書く）
export const CROSS_PAIRS = {
  // 古典文法 × 古典単語（「」の中の語と見出し語）
  'kg_neg_zu|k290': SAME,
  'kg_past_ki|k287': SAME,
  'kg_past_keri|k286': SAME,
  'kg_perfect_tsu|k288': SAME,
  'kg_perfect_nu|k288': SAME,
  'kg_perfect_nu|k472': different('単語は動詞「寝（ぬ）」'),
  'kg_perfect_tari|k289': SAME,
  'kg_perfect_tari|k455': different('単語は断定の「たり」'),
  'kg_perfect_ri|k289': SAME,
  'kg_conjecture_mu|k293': SAME,
  'kg_conjecture_beshi|k119': SAME,
  'kg_negative_maji|k118': SAME,
  'kg_negative_ji|k295': SAME,
  'kg_present_ramu|k120': SAME,
  'kg_past_kemu|k121': SAME,
  'kg_evidence_rashi|k296': SAME,
  'kg_visual_meri|k123': SAME,
  'kg_hearsay_nari|k122': SAME,
  'kg_hearsay_nari|k454': different('単語は断定の「なり」'),
  'kg_assertion_nari|k454': SAME,
  'kg_assertion_nari|k122': different('単語は伝聞・推定の「なり」'),
  'kg_voice_raru|k291': SAME,
  'kg_causative_sasu|k292': SAME,
  'kg_causative_sasu|k497': different('単語はサ変動詞「す（為）」'),
  'kg_kakari_renntai|k116': different('単語は他者への願望の終助詞「なむ」（係助詞の「なむ」とは別の語）'),
  'kg_wish_baya|k114': SAME,
  'kg_conj_te|k604': different('単語は名詞「手（て）」'),
  'kg_conjecture_muzu|k452': SAME,
  'kg_counterfactual_mashi|k294': SAME,
  'kg_desire_mahoshi|k117': SAME,
  'kg_desire_tashi|k453': SAME,
  'kg_comparison_gotoshi|k297': SAME,
  'kg_assertion_tari|k455': SAME,
  'kg_assertion_tari|k289': different('単語は完了・存続の「たり・り」'),
  'kg_prohibition_na_so|k113': SAME,
  'kg_wish_teshigana|k447': SAME,
  'kg_adverb_e_yomo|k063': SAME,
  'kg_adverb_e_yomo|k200': SAME,
  'kg_adverb_sarani_tsuyu|k066': SAME,
  'kg_adverb_sarani_tsuyu|k065': SAME,
  'kg_adverb_dani_sura_sae|k199': SAME,
  'kg_adverb_dani_sura_sae|k450': SAME,
  'kg_adverb_dani_sura_sae|k451': SAME,
  'kg_identification_ru_re|k291': IDENTIFICATION,
  'kg_identification_nu_ne|k288': IDENTIFICATION,
  'kg_identification_nu_ne|k472': different('識別の項目が見分けるのは打消「ず」・完了「ぬ」・ナ変動詞で、単語は下二段の動詞「寝（ぬ）」'),
  'kg_identification_namu|k116': IDENTIFICATION,
  'kg_identification_nari|k122': IDENTIFICATION,
  'kg_identification_nari|k454': IDENTIFICATION,
  'kg_identification_ramu|k120': IDENTIFICATION,
  'kg_identification_baya|k114': IDENTIFICATION,
  'kg_aux_jodai|k502': different('単語は動詞「経（ふ）」'),
  'kg_conj_de|k298': SAME,
  'kg_final_mogana|k115': SAME,
  'kg_final_kashi|k448': SAME,
  'kg_interjection|k589': different('単語は名詞「世（よ）」'),
  'kg_adverb_yume_osaosa|k405': SAME,
  'kg_adverb_yume_osaosa|k064': SAME,
  'kg_adverb_yume_osaosa|k406': SAME,
  'kg_adverb_ikade|k068': SAME,
  'kg_adverb_ikade|k094': SAME,
  'kg_adverb_yoshi|k024': different('単語は形容詞「良し（よし）」'),
  'kg_adverb_yoshi|k103': different('単語は名詞「由（よし）」'),
  'kg_id_tari|k289': IDENTIFICATION,
  'kg_id_tari|k455': IDENTIFICATION,
  'kg_id_de|k298': IDENTIFICATION,
  'kg_id_mu_imi|k293': IDENTIFICATION,
  'kg_id_raru_imi|k291': IDENTIFICATION,
  // 古典文法 × 古典単語（「」の中の語と漢字表記）
  'kg_honorific_tamau|k081': SAME,
  'kg_honorific_sosu_keisu|k269': SAME,
  'kg_honorific_sosu_keisu|k270': SAME,
  'kg_hon_tatematsuru_mairu|k082': SAME,
  'kg_hon_tatematsuru_mairu|k174': SAME,
  'kg_hon_haberi_saburau|k084': SAME,
  'kg_hon_haberi_saburau|k085': SAME,
  // 漢文法 × 漢語（題名の字と見出し）
  'kgw011|kv201': SAME,
  'kgw013|kv021': SAME,
  'kgw014|kv022': SAME,
  'kgw015|kv023': SAME,
  'kgw016|kv024': SAME,
  'kgw017|kv025': SAME,
  'kgw018|kv026': SAME,
  'kgw019|kv027': SAME,
  'kgw020|kv028': SAME,
  'kgw027|kv096': SAME,
  'kgw028|kv018': SAME,
  'kgw044|kv292': SAME,
  'kgw045|kv005': SAME,
  'kgw046|kv173': SAME,
  'kgw049|kv190': SAME,
  'kgw050|kv196': SAME,
  'kgw051|kv194': SAME,
  'kgw052|kv195': SAME,
  'kgw053|kv197': SAME,
  'kgw068|kv255': SAME,
  'kgw074|kv038': SAME,
  'kgw080|kv153': SAME,
  'kgw081|kv171': SAME,
  'kgw081|kv255': SAME,
  'kgw083|kv154': SAME,
  'kgw089|kv195': SAME,
  'kgw102|kv191': SAME,
  'kgw102|kv192': SAME,
  'kgw102|kv193': SAME,
  'kgw103|kv199': SAME,
  'kgw115|kv031': different('漢語「已」の項目は「すでに・やむ」で、限定の「のみ」を持たない'),
  'kgw115|kv181': SAME,
  'kgw120|kv158': SAME,
}

const quoted = (text) => [...String(text ?? '').matchAll(/「([^」]+)」/gu)].map((match) => match[1])
const splitForms = (text) => String(text ?? '').replace(/[（(][^）)]*[）)]/gu, '').split(/[・／/]/u).map((form) => form.trim()).filter(Boolean)

function indexBy(items, keysOf) {
  const index = new Map()
  for (const item of items) {
    for (const key of keysOf(item)) {
      if (!index.has(key)) index.set(key, new Set())
      index.get(key).add(item)
    }
  }
  return index
}

/** ④の候補：文法の項目ごとに、同じ文字の単語の項目を集める。 */
function crossCandidates(grammarItems, vocabItems, grammarForms, vocabForms) {
  const index = indexBy(vocabItems, vocabForms)
  const pairs = []
  for (const grammar of grammarItems) {
    const found = new Set(grammarForms(grammar).flatMap((form) => [...(index.get(form) ?? [])]))
    for (const vocab of found) pairs.push({ grammar, vocab, key: `${grammar.id}|${vocab.id}` })
  }
  return pairs
}

const CROSS_SETS = [
  {
    id: 'koten', label: '古典文法 × 古典単語', grammarLevels: KOTEN_GRAMMAR_ITEM_LEVELS, vocabLevels: KOTEN_WORD_LEVELS,
    pairs: () => crossCandidates(
      KOTEN_GRAMMAR,
      KOTEN_WORDS,
      (item) => quoted(item.title).flatMap(splitForms),
      (word) => [...splitForms(word.word), ...splitForms(word.kanji)],
    ),
    vocabTitle: (word) => word.word,
  },
  {
    id: 'kanbun', label: '漢文法 × 漢語', grammarLevels: KANBUN_LEVELS, vocabLevels: KANBUN_LEVELS,
    pairs: () => crossCandidates(
      KANBUN_GRAMMAR,
      KANBUN_VOCAB,
      (item) => [...quoted(item.title), ...splitForms(item.title)].flatMap(splitForms),
      (item) => splitForms(item.title),
    ),
    vocabTitle: (item) => item.title,
  },
]

/** 全教材を調べた結果を返す。 */
export function surveyClassicsLevels() {
  const contents = CLASSICS_CONTENTS.map((content) => {
    const levelIds = content.levels.map((level) => level.id)
    const counts = Object.fromEntries(levelIds.map((id) => [id, 0]))
    const badLevels = []
    for (const item of content.items) {
      if (levelIds.includes(item.level)) counts[item.level] += 1
      else badLevels.push(`${item.id}（段「${item.level}」）`)
    }
    const ids = new Map()
    for (const item of content.items) ids.set(item.id, (ids.get(item.id) ?? 0) + 1)
    const duplicateIds = [...ids].filter(([, count]) => count > 1).map(([id]) => id)
    const duplicates = []
    for (const [keyLabel, keyOf] of Object.entries(content.keys)) {
      const seen = new Map()
      for (const item of content.items) {
        const key = keyOf(item)
        if (!seen.has(key)) seen.set(key, [])
        seen.get(key).push(item)
      }
      for (const [key, items] of seen) {
        if (items.length > 1) duplicates.push(`${keyLabel}「${key}」: ${items.map((item) => `${item.id}（${item.level}）`).join('・')}`)
      }
    }
    return {
      id: content.id,
      label: content.label,
      unit: content.unit,
      total: content.items.length,
      levels: content.levels.map((level) => ({ ...level, count: counts[level.id] })),
      badLevels,
      duplicateIds,
      duplicates,
    }
  })

  // 同じつづりで品詞の違う古典単語（別の語。二重登録ではない）。
  const byWord = new Map()
  for (const word of KOTEN_WORDS) {
    if (!byWord.has(word.word)) byWord.set(word.word, [])
    byWord.get(word.word).push(word)
  }
  const kotenHomographs = [...byWord].filter(([, words]) => words.length > 1)
    .map(([spelling, words]) => `${spelling}（${words.map((word) => `${word.pos}・${word.level}`).join('／')}）`)

  const fields = [['vocab', 'vocabIds', '古典単語'], ['grammar', 'grammarIds', '古典文法'], ['culture', 'cultureIds', '古典常識']]
  const courses = KOTEN_CURRICULUM_PATHS.map((course, index) => {
    const previous = KOTEN_CURRICULUM_PATHS[index - 1]
    const domains = Object.fromEntries(fields.map(([domain, field]) => {
      const ids = course[field]
      const before = new Set(previous?.[field] ?? [])
      const overlap = ids.filter((id) => before.has(id)).length
      return [domain, { count: ids.length, overlapWithPrevious: overlap, added: ids.length - overlap, droppedFromPrevious: [...before].filter((id) => !ids.includes(id)).length }]
    }))
    return { id: course.id, label: course.label, shortLabel: course.shortLabel, domains }
  })
  const duplicateCourses = courses.filter((course, index) => index > 0 && fields.every(([domain]) => course.domains[domain].added === 0))
    .map((course) => course.label)
  const nonCumulative = courses.flatMap((course) => fields
    .filter(([domain]) => course.domains[domain].droppedFromPrevious > 0)
    .map(([domain, , label]) => `${course.label}の${label}`))

  const cross = CROSS_SETS.map((set) => {
    const rank = (levels) => Object.fromEntries(levels.map((level, index) => [level.id, index]))
    const grammarRank = rank(set.grammarLevels)
    const vocabRank = rank(set.vocabLevels)
    const levelLabel = (levels, id) => levels.find((level) => level.id === id)?.shortLabel ?? id
    const pairs = set.pairs().map((pair) => ({ ...pair, decision: CROSS_PAIRS[pair.key] }))
    const unclassified = pairs.filter((pair) => !pair.decision).map((pair) => `${pair.key}（${pair.grammar.title} × ${set.vocabTitle(pair.vocab)}）`)
    const kindOf = (pair) => (typeof pair.decision === 'string' ? pair.decision : pair.decision?.kind)
    const same = pairs.filter((pair) => kindOf(pair) === SAME)
    const mismatched = same.filter((pair) => grammarRank[pair.grammar.level] !== vocabRank[pair.vocab.level])
      .map((pair) => ({
        grammar: `${pair.grammar.title}（${pair.grammar.id}）`,
        grammarLevel: levelLabel(set.grammarLevels, pair.grammar.level),
        vocab: `${set.vocabTitle(pair.vocab)}（${pair.vocab.id}）`,
        vocabLevel: levelLabel(set.vocabLevels, pair.vocab.level),
        vocabEasier: vocabRank[pair.vocab.level] < grammarRank[pair.grammar.level],
      }))
    return {
      id: set.id,
      label: set.label,
      candidates: pairs.length,
      same: same.length,
      sameGrammarItems: new Set(same.map((pair) => pair.grammar.id)).size,
      sameVocabItems: new Set(same.map((pair) => pair.vocab.id)).size,
      identification: pairs.filter((pair) => kindOf(pair) === IDENTIFICATION).length,
      different: pairs.filter((pair) => kindOf(pair) === 'different').map((pair) => `${pair.grammar.title} × ${set.vocabTitle(pair.vocab)}：${pair.decision.why}`),
      mismatched,
      unclassified,
    }
  })
  const classifiedKeys = new Set(CROSS_SETS.flatMap((set) => set.pairs().map((pair) => pair.key)))
  const staleDecisions = Object.keys(CROSS_PAIRS).filter((key) => !classifiedKeys.has(key))

  const problems = [
    ...contents.flatMap((content) => [
      ...content.badLevels.map((text) => `${content.label}: 決まっていない段 ${text}`),
      ...content.duplicateIds.map((id) => `${content.label}: id ${id} が2つ以上`),
      ...content.duplicates.map((text) => `${content.label}: 二重登録 ${text}`),
    ]),
    ...duplicateCourses.map((label) => `古典のコース: ${label}は1つ下のコースと中身が同じ`),
    ...nonCumulative.map((text) => `古典のコース: ${text}が1つ下のコースの項目を落としている`),
    ...cross.flatMap((set) => set.unclassified.map((text) => `${set.label}: 分け方を決めていない組 ${text}`)),
    ...staleDecisions.map((key) => `CROSS_PAIRS: 候補にない組 ${key}（データが変わったら読み直す）`),
  ]
  const wide = surveyWideOverlap()
  problems.push(...wide.problems)
  return { contents, kotenHomographs, courses, cross, wide, problems }
}

function printReport(result) {
  const total = result.contents.reduce((sum, content) => sum + content.total, 0)
  console.log(`■ ①段 ②二重登録（${result.contents.length}教材・計${total.toLocaleString()}件）`)
  for (const content of result.contents) {
    const levels = content.levels.map((level) => `${level.label}${level.count}`).join('・')
    const issues = content.badLevels.length + content.duplicateIds.length + content.duplicates.length
    console.log(`  ${content.label} ${content.total}${content.unit}（${levels}）… 段の誤り${content.badLevels.length + content.duplicateIds.length}・二重登録${content.duplicates.length}${issues ? ' ✗' : ''}`)
  }
  console.log(`  同じつづりで品詞の違う古典単語（別の語）: ${result.kotenHomographs.join('、') || 'なし'}`)
  console.log('■ ③古典の学年・目標別コース（1つ下のコースを含む積み上げ）')
  for (const course of result.courses) {
    const parts = Object.entries(course.domains).map(([domain, value]) => {
      const name = { vocab: '単語', grammar: '文法', culture: '常識' }[domain]
      return `${name}${value.count}（重なり${value.overlapWithPrevious}・増${value.added}）`
    })
    console.log(`  ${course.label}: ${parts.join('　')}`)
  }
  console.log('■ ④教材をまたぐ組')
  for (const set of result.cross) {
    console.log(`  ${set.label}: 候補${set.candidates}組 → 同じ語${set.same}組（文法${set.sameGrammarItems}項目・単語${set.sameVocabItems}語）・識別の項目${set.identification}組・別の語${set.different.length}組`)
    console.log(`    同じ語で段が違う組: ${set.mismatched.length}組（単語のほうが易しい${set.mismatched.filter((pair) => pair.vocabEasier).length}組）`)
    for (const pair of set.mismatched) console.log(`      ${pair.grammar}＝${pair.grammarLevel} ／ ${pair.vocab}＝${pair.vocabLevel}`)
  }
  const wideCandidates = result.wide.sets.reduce((sum, set) => sum + set.candidates, 0)
  console.log(`■ ⑤物差しを広げた重複（候補${wideCandidates}組を1組ずつ読んで分けた）`)
  for (const set of result.wide.sets) {
    const by = Object.entries(set.differentBy).map(([why, count]) => `${why}${count}`).join('・')
    const same = set.same ? `・両方で同じ語${set.same}組` : ''
    console.log(`  ${set.label}: 候補${set.candidates}組 → 二重登録${set.duplicate.length}・別の形${set.form.length}${same}・別の語${set.different}${by ? `（${by}）` : ''}`)
    for (const pair of set.form) console.log(`      別の形 ${pair.a}[${pair.aLevel}] ／ ${pair.b}[${pair.bLevel}]：${pair.why}`)
  }
  if (result.problems.length) {
    console.log(`✗ 重複・決めていない組 ${result.problems.length}件`)
    for (const problem of result.problems) console.log(`  ${problem}`)
  } else {
    console.log('✓ 段の誤り・二重登録（⑤の広げた物差しも）・中身が同じコース・決めていない組はどれも0件')
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = surveyClassicsLevels()
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
  else printReport(result)
  if (result.problems.length) process.exit(1)
}
