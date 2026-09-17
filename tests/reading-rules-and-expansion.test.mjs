import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PASSAGES } from '../src/data/passages.js'
import { EXPANDED_PASSAGES } from '../src/data/reading-expansion-passages.js'
import { getReadingQuestions } from '../src/data/reading-questions.js'
import { EXTENDED_PASSAGE_READING_APPROACHES } from '../src/data/reading-extended-approaches.js'
import {
  PASSAGE_READING_APPROACHES,
  READING_RULE_PHASES,
  READING_RULES,
  readingApproachForPassage,
  readingRuleForQuestion,
  readingRulesByPhase,
  readingRulesForPassage,
  readingRulesForSentence,
} from '../src/data/reading-rules.js'

const wordCount = (passage) => passage.sentences.reduce(
  (total, sentence) => total + (sentence.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).length,
  0,
)

const minimumWordsByLevel = Object.freeze({
  5: 80,
  4: 150,
  3: 250,
  pre2: 300,
  pre2plus: 320,
  2: 350,
  pre1: 500,
  1: 780,
})

test('読解30ルールは五段階・三つの手順・読み違いの注意・図解を備える', () => {
  assert.equal(READING_RULES.length, 30)
  assert.equal(new Set(READING_RULES.map((rule) => rule.id)).size, 30)
  assert.equal(READING_RULE_PHASES.length, 5)
  assert.deepEqual(
    READING_RULE_PHASES.map((phase) => readingRulesByPhase(phase.id).length),
    [4, 7, 7, 6, 6],
  )
  assert.equal(READING_RULES.filter((rule) => rule.origin === 'added').length, 10)
  assert.equal(READING_RULES.filter((rule) => rule.origin === 'core').length, 20)
  assert.ok(!JSON.stringify(READING_RULES).includes('読む目的を一つ決める'))
  assert.equal(
    READING_RULES.find((rule) => rule.id === 'purpose-first')?.title,
    '文章の種類に合わせて、注目する点を変える',
  )

  const phaseIds = new Set(READING_RULE_PHASES.map((phase) => phase.id))
  for (const rule of READING_RULES) {
    assert.ok(phaseIds.has(rule.phase), `${rule.id}: 段階が不明`)
    assert.ok(['basic', 'standard', 'advanced'].includes(rule.level), `${rule.id}: 難度が不明`)
    assert.ok(rule.title && rule.short && rule.signal && rule.caution, `${rule.id}: 学習欄が不足`)
    assert.equal(rule.steps.length, 3, `${rule.id}: 判断手順は三手にする`)
    assert.ok(rule.steps.every((step) => step.length >= 8), `${rule.id}: 手順が短すぎる`)
    assert.ok(rule.example.en && rule.example.ja, `${rule.id}: 英日例が不足`)
    assert.ok(rule.diagram?.nodes?.length >= 2, `${rule.id}: 図解が不足`)
  }
})

// 30ルール画面の校正（2026-09-17）で直した言い回し。塾の教材として不自然・不正確だったもの。
const READING_RULE_COPY_DEFECTS = [
  ['三つ以内の手順', '手順はどのルールも三つ。「以内」とぼかさない'],
  ['物語・案内・説明・論説', '「案内」「説明」「論説」だけでは文章の種類と読めない。案内文・説明文・論説文と書く'],
  ['五段階へ戻', '段階へ「戻る」とは言わない。段階を順にたどり直すと書く'],
  ['十数字', '「十数文字」の誤り'],
  ['地図にする', '段落は地図にできない。役割を一言でまとめると書く'],
  ['地図化', '文章は地図化できない。整理する・まとめると書く'],
  ['案内板にする', '記号は案内板にできない。意味の手がかりにすると書く'],
  ['確保する', '主語と動詞は「つかむ」'],
  ['道順', 'route は「ルート」。道順は曲がる順のことで、長さを測ったり安全さを比べたりする語ではない'],
  ['精密に読む', '「じっくり読む」'],
  ['減速', '読む速さは「ペースを落とす」'],
  ['論理語', 'アプリ全体の用語は「接続語」'],
  ['関係節', 'アプリ全体の用語は「関係詞節」'],
  ['文種', '「文章の種類」'],
  ['文章の型', '「文章の種類」'],
  ['中心成分', '専門用語を避け「文の中心になる語」'],
  ['入口語', '造語。「目印」'],
  ['上位概念', '「まとめの言葉」'],
  ['設問語', '造語。「設問の言葉」'],
  ['仮置き', '「仮に決める」'],
  ['待ち受ける', '「予測しながら読む」'],
  ['意味が壊れ', '意味は壊れない。「話が合わなくなる」'],
  ['重く置く', '「重く見る」'],
  ['逆転内容', '「予想がどうくつがえるか」'],
  ['曲がり角を逃す', '「曲がり角を見落とす」'],
  ['生徒が向上', '生徒は向上しない。「上達した」'],
  ['で検索する', '文章は検索できない。「探し出す」'],
  ['往復する', '「結びつけて読む」'],
  ['何対何', '数ではなく、どれとどれが対応するかを書く'],
  ['語彙事例', '散文に書き直した長文には当てはまらない旧形式の説明'],
  ['誤読防止', '「読み違いに注意」'],
  ['実戦補強', '追加した経緯を示すだけで、段階の表示と重なる'],
  ['言いかえ', '表記は「言い換え」にそろえる'],
  ['置きかえ', '表記は「置き換え」にそろえる'],
  ['最終段落', '表記は「最後の段落」にそろえる'],
]

const learnerRuleTexts = () => [
  ...READING_RULE_PHASES.flatMap((phase) => [phase.label, phase.description]),
  ...READING_RULES.flatMap((rule) => [
    rule.title, rule.short, rule.signal, ...rule.steps, rule.example.ja, rule.caution, ...rule.diagram.nodes,
  ]),
  ...Object.values({ ...PASSAGE_READING_APPROACHES, ...EXTENDED_PASSAGE_READING_APPROACHES })
    .flatMap((approach) => [approach.title, approach.summary, ...approach.steps]),
]

test('読解ルールと長文の読み方は、校正で直した言い回し・用語に戻らない', () => {
  const screenSources = ['../src/screens/ReadingRules.jsx', '../src/screens/ReadingList.jsx', '../src/components/ReadingRuleCard.jsx']
    .map((file) => [file, readFileSync(new URL(file, import.meta.url), 'utf8')])
  for (const [phrase, reason] of READING_RULE_COPY_DEFECTS) {
    const hit = learnerRuleTexts().find((text) => text.includes(phrase))
    assert.equal(hit, undefined, `「${phrase}」: ${reason}（${hit}）`)
    for (const [file, source] of screenSources) {
      assert.ok(!source.includes(phrase), `${file}「${phrase}」: ${reason}`)
    }
  }

  // 段階名は「全体を見通す」「骨組みをつかむ」のように、どれも動作の形でそろえる。
  for (const phase of READING_RULE_PHASES) {
    assert.match(phase.label, /[うくぐすつぬぶむる]$/, `段階「${phase.label}」が動作の形でない`)
  }

  // 横に並ぶ図は、区切りの矢印や不等号を画面側で入れる。項目に記号を書くと「→ → →」「→ ← →」と重なる。
  const card = screenSources.find(([file]) => file.endsWith('ReadingRuleCard.jsx'))[1]
  const labelBlock = card.match(/const DIAGRAM_LABELS = Object\.freeze\(\{([\s\S]*?)\}\)/)[1]
  const labeledTypes = new Set([...labelBlock.matchAll(/^\s*(\w+):/gm)].map((match) => match[1]))
  const verticalTypes = new Set([...card.match(/const VERTICAL_DIAGRAM_TYPES = new Set\(\[([^\]]*)\]\)/)[1].matchAll(/'(\w+)'/g)]
    .map((match) => match[1]))
  assert.ok(verticalTypes.has('branch'), '縦に並べる図の種類を読み取れない')
  for (const rule of READING_RULES) {
    assert.ok(labeledTypes.has(rule.diagram.type), `${rule.id}: 図の種類「${rule.diagram.type}」に見出しがない`)
    if (verticalTypes.has(rule.diagram.type)) continue
    for (const node of rule.diagram.nodes) {
      assert.doesNotMatch(node, /^[→←＜<>：:;；]|[→←]$/, `${rule.id}: 図の項目「${node}」が区切り記号で始まる・終わる`)
    }
  }
})

test('全38長文は級別の複数題・試験テーマ・十分な語数・根拠付き設問を保つ', () => {
  assert.equal(PASSAGES.length, 38)
  assert.equal(EXPANDED_PASSAGES.length, 8)
  assert.equal(PASSAGES.reduce((total, passage) => total + passage.sentences.length, 0), 990)

  // 語彙10分野を1本で通す分野長文を、準2級と2級へ3本ずつ追加している。
  const passagesByLevel = { 5: 4, 4: 4, 3: 4, pre2: 7, pre2plus: 4, 2: 7, pre1: 4, 1: 4 }
  for (const level of Object.keys(minimumWordsByLevel)) {
    assert.equal(
      PASSAGES.filter((passage) => passage.level === level).length,
      passagesByLevel[level],
      `${level}: 級別の収録数が設計と違う`,
    )
  }
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('高校受験')).length, 15)
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('大学受験')).length, 19)
  assert.equal(PASSAGES.filter((passage) => passage.examTypes.includes('英検')).length, 38)

  for (const passage of PASSAGES) {
    assert.ok(
      wordCount(passage) >= minimumWordsByLevel[passage.level],
      `${passage.id}: ${wordCount(passage)}語は長文慣れの基準未満`,
    )
    assert.ok(passage.theme && passage.examLabel, `${passage.id}: 試験メタデータ不足`)
    assert.equal(passage.examFocus.length, 3, `${passage.id}: 読解ポイント不足`)
    assert.ok(passage.sentences.filter((sentence) => sentence.paragraphStart).length >= 2)

    const questions = getReadingQuestions(passage.id)
    assert.ok(questions.length >= 3, `${passage.id}: 設問不足`)
    for (const question of questions) {
      assert.ok(question.choices.includes(question.answer), `${passage.id}: 正答不在`)
      assert.ok(question.explain.length >= 20, `${passage.id}: 根拠解説が短い`)
    }
  }
})

test('既存16本を含む全文・全設問へ文脈に合う読解ルールを注入する', () => {
  const knownRuleIds = new Set(READING_RULES.map((rule) => rule.id))
  const allPhaseIds = new Set(READING_RULE_PHASES.map((phase) => phase.id))
  const usedRuleIds = new Set()
  const approachTitles = new Set()
  const approachRuleSequences = new Set()
  const recommendedRuleSets = []

  assert.equal(Object.keys(PASSAGE_READING_APPROACHES).length, PASSAGES.length)

  for (const passage of PASSAGES) {
    const approach = readingApproachForPassage(passage)
    assert.ok(approach, `${passage.id}: テーマ別の読み方がない`)
    assert.ok(approach.title.length >= 12, `${passage.id}: 読み方の見出しが短い`)
    assert.ok(approach.summary.length >= 35, `${passage.id}: テーマ別解説が短い`)
    assert.equal(approach.steps.length, 3, `${passage.id}: テーマ別の三手がない`)
    assert.ok(approach.steps.every((step) => step.length >= 12), `${passage.id}: テーマ別手順が短い`)
    assert.equal(approach.ruleIds.length, 6, `${passage.id}: 中核ルール数`)
    assert.equal(new Set(approach.ruleIds).size, approach.ruleIds.length)
    assert.ok(approach.ruleIds.every((id) => knownRuleIds.has(id)), `${passage.id}: 不明な中核ルール`)
    assert.deepEqual(
      new Set(approach.ruleIds.map((id) => READING_RULES.find((rule) => rule.id === id)?.phase)),
      allPhaseIds,
      `${passage.id}: テーマ別ルールに五段階がそろわない`,
    )
    approachTitles.add(approach.title)
    approachRuleSequences.add(approach.ruleIds.join(','))

    const passageRules = readingRulesForPassage(passage)
    assert.ok(passageRules.length >= 6 && passageRules.length <= 8, `${passage.id}: 準備ルール数`)
    assert.equal(new Set(passageRules.map((rule) => rule.id)).size, passageRules.length)
    assert.deepEqual(new Set(passageRules.map((rule) => rule.phase)), allPhaseIds)
    assert.deepEqual(
      passageRules.slice(0, approach.ruleIds.length).map((rule) => rule.id),
      approach.ruleIds,
      `${passage.id}: テーマ別の中核ルールが先に出ない`,
    )
    recommendedRuleSets.push(new Set(passageRules.map((rule) => rule.id)))
    passageRules.forEach((rule) => usedRuleIds.add(rule.id))

    for (const sentence of passage.sentences) {
      const sentenceRules = readingRulesForSentence(sentence)
      assert.ok(sentenceRules.length >= 1 && sentenceRules.length <= 3, `${sentence.reviewId}: 本文ルール数`)
      assert.equal(new Set(sentenceRules.map((rule) => rule.id)).size, sentenceRules.length)
      assert.ok(sentenceRules.every((rule) => knownRuleIds.has(rule.id)))
      sentenceRules.forEach((rule) => usedRuleIds.add(rule.id))
    }

    for (const question of getReadingQuestions(passage.id)) {
      const questionRule = readingRuleForQuestion(question.q)
      assert.ok(knownRuleIds.has(questionRule.id), `${passage.id}: 設問ルール不在`)
      usedRuleIds.add(questionRule.id)
    }
  }

  assert.equal(approachTitles.size, PASSAGES.length, '全38長文で読み方の見出しを使い回さない')
  assert.equal(approachRuleSequences.size, PASSAGES.length, '全38長文で中核ルールの組合せを使い回さない')
  const rulesSharedByEveryPassage = [...knownRuleIds].filter((id) =>
    recommendedRuleSets.every((ruleSet) => ruleSet.has(id)))
  assert.deepEqual(rulesSharedByEveryPassage, [], '全テーマへ同じルールを固定配布しない')
  assert.deepEqual(usedRuleIds, knownRuleIds, '30ルールに実本文・実設問で使える入口を持たせる')
})

test('条件と代替を対比・譲歩として誤分類しない', () => {
  const passage = PASSAGES.find((item) => item.id === 'p_5_weather_field_trip')
  const sentence = passage.sentences.find((item) => item.en.startsWith('If it rains'))
  const ruleIds = readingRulesForSentence(sentence).map((rule) => rule.id)

  assert.ok(ruleIds.includes('logic-connectors'))
  assert.ok(!ruleIds.includes('contrast-concession'))
})

test('morning・eveningをing形と誤判定せず、本物のing形は拾う', () => {
  assert.ok(!readingRulesForSentence({ en: 'We meet on Thursday evening.' })
    .some((rule) => rule.id === 'ing-ed-role'))
  assert.ok(readingRulesForSentence({ en: 'Running helps.' })
    .some((rule) => rule.id === 'ing-ed-role'))
})

test('読解ルール画面と準備・本文・設問の三地点が接続される', () => {
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
  const list = readFileSync(new URL('../src/screens/ReadingList.jsx', import.meta.url), 'utf8')
  const prep = readFileSync(new URL('../src/screens/ReadingPrep.jsx', import.meta.url), 'utf8')
  const reader = readFileSync(new URL('../src/components/ReadingSentenceDetail.jsx', import.meta.url), 'utf8')
  const readingCheck = readFileSync(new URL('../src/components/ReadingComprehensionCheck.jsx', import.meta.url), 'utf8')
  const rules = readFileSync(new URL('../src/screens/ReadingRules.jsx', import.meta.url), 'utf8')

  assert.match(app, /readingRules:\s*ReadingRulesScreen/)
  assert.match(list, /navigate\('readingRules'\)/)
  assert.match(prep, /data-reading-rules-for-passage=\{passage\.id\}/)
  assert.match(prep, /data-reading-approach-for-passage=\{passage\.id\}/)
  assert.match(prep, /このテーマの読み方/)
  assert.match(reader, /data-reading-rules-for-sentence=\{sentence\.reviewId\}/)
  assert.match(readingCheck, /readingRuleForQuestion\(question\.q\)/)
  assert.match(rules, /長文読解の30ルール/)
  assert.match(rules, /aria-label="長文読解の五段階"/)
})
