import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PASSAGES } from '../src/data/passages.js'
import { READING_TRANSLATION_SCENARIOS } from '../src/data/reading-translation-scenarios.js'
import {
  READING_CORE_PHRASE_WORD_LIMIT,
  READING_MODIFIER_PHRASE_WORD_LIMIT,
  analyzeReadingSentence,
} from '../src/lib/reading-grammar.js'

test('全長文・全文・全ブロックに講師監修の語順訳シナリオが対応する', () => {
  assert.deepEqual(
    Object.keys(READING_TRANSLATION_SCENARIOS).sort(),
    PASSAGES.map((passage) => passage.id).sort(),
    '長文の追加・削除時は語順訳シナリオも同時に更新する',
  )

  let sentenceCount = 0
  let blockCount = 0
  let orderedSegmentCount = 0
  let phrasePairCount = 0
  let explicitSequenceCount = 0
  for (const passage of PASSAGES) {
    const passageScenarios = READING_TRANSLATION_SCENARIOS[passage.id]
    assert.equal(
      passageScenarios.length,
      passage.sentences.length,
      `${passage.id}: 文単位のシナリオ数`,
    )

    for (const [sentenceIndex, sentence] of passage.sentences.entries()) {
      sentenceCount++
      assert.equal(
        sentence.translationScenario,
        passageScenarios[sentenceIndex],
        `${passage.id}: 第${sentenceIndex + 1}文へシナリオが接続されていない`,
      )
      const analysis = analyzeReadingSentence(sentence)
      const scenario = passageScenarios[sentenceIndex]
      assert.equal(
        scenario.length,
        analysis.blocks.length,
        `${passage.id}: 第${sentenceIndex + 1}文のブロック数`,
      )

      for (const [blockIndex, block] of analysis.blocks.entries()) {
        blockCount++
        const location = `${passage.id}: 第${sentenceIndex + 1}文・第${blockIndex + 1}ブロック`
        assert.ok(Array.isArray(block.jaSegments), `${location}: 語順訳の意味単位がない`)
        assert.ok(block.jaSegments.length >= 1, `${location}: 語順訳の意味単位が空`)
        assert.ok(Object.isFrozen(block.jaSegments), `${location}: 語順訳の意味単位が固定されていない`)
        assert.ok(Array.isArray(block.phrasePairs), `${location}: 英日フレーズ組がない`)
        assert.ok(Object.isFrozen(block.phrasePairs), `${location}: 英日フレーズ組が固定されていない`)
        assert.ok(block.phrasePairs.length >= 1, `${location}: 役割別フレーズがない`)
        assert.equal(
          block.phrasePairs.map((pair) => pair.spokenEn ?? pair.en).join(' '),
          block.en,
          `${location}: 英語フレーズを連結しても元のブロックを復元できない`,
        )
        assert.deepEqual(
          block.jaSegments,
          block.phrasePairs.map((pair) => pair.ja),
          `${location}: 下段ブロックの直訳が確定フレーズ列と一致しない`,
        )
        for (const [phraseIndex, pair] of block.phrasePairs.entries()) {
          const phraseAt = `${location}・第${phraseIndex + 1}フレーズ`
          assert.ok(Object.isFrozen(pair), `${phraseAt}: 英日フレーズ組が固定されていない`)
          assert.ok(pair.en.trim(), `${phraseAt}: 英語が空`)
          assert.ok(pair.ja.trim(), `${phraseAt}: 直訳が空`)
          const wordCount = pair.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)?.length ?? 0
          assert.equal(pair.roles.length, 1, `${phraseAt}: 異なる役割が一フレーズに混在している`)
          const extendedPhrase = pair.roles.every((role) => ['M', 'LINK'].includes(role))
          const wordLimit = extendedPhrase
            ? READING_MODIFIER_PHRASE_WORD_LIMIT
            : READING_CORE_PHRASE_WORD_LIMIT
          assert.ok(
            wordCount >= 1 && wordCount <= wordLimit,
            `${phraseAt}: ${pair.roleHeading}の${wordCount}語は構造フレーズとして長すぎる`,
          )
          assert.ok(pair.roles.length >= 1, `${phraseAt}: SVOCM・接続の役割がない`)
          assert.ok(pair.roleParts.length >= 1, `${phraseAt}: 役割ごとの英語部分がない`)
          assert.ok(pair.roleHeading.trim(), `${phraseAt}: 役割表示がない`)
          assert.ok(pair.roleNote.length >= 30, `${phraseAt}: 役割別の直訳説明が短い`)
          phrasePairCount++
        }
        assert.equal(block.ja, block.jaSegments.join('／'), `${location}: 表示順が意味単位の順と一致しない`)
        assert.equal(
          block.orderedSpeechJa,
          block.jaSegments.join('。'),
          `${location}: 音声の順が表示順と一致しない`,
        )
        assert.ok(
          block.jaSegments.every((segment) => segment.trim() === segment && segment.length > 0),
          `${location}: 空または前後空白付きの意味単位がある`,
        )
        assert.ok(
          block.jaSegments.every((segment) => /[ぁ-んァ-ヶ一-龠]/.test(segment)),
          `${location}: 日本語のない意味単位がある`,
        )
        assert.doesNotMatch(block.ja, /[。！？]/, `${location}: 自然訳の文末が語順訳へ混入した`)
        if (block.jaSegments.length > 1) {
          explicitSequenceCount++
          assert.match(block.ja, /／/, `${location}: 前へ進む区切りが表示されない`)
        }
        orderedSegmentCount += block.jaSegments.length
        assert.equal(block.jaSource, 'teaching', `${location}: 自動辞書訳へ後退した`)
        assert.match(block.ja, /[ぁ-んァ-ヶ一-龠]/, `${location}: 日本語訳がない`)
        assert.doesNotMatch(
          block.ja,
          /このまとまりの意味を自然な和訳で確認/,
          `${location}: 仮表示が残っている`,
        )
        assert.ok(block.translationGuide.length >= 20, `${location}: 読み方の解説が短すぎる`)
        assert.match(block.translationGuide, /語順|主語|まとまり|節|動詞/, `${location}: 読解指導がない`)
        for (const segment of block.jaSegments) {
          assert.ok(block.speechJa.includes(segment), `${location}: 音声に意味単位「${segment}」がない`)
        }
        assert.ok(
          block.speechJa.includes(block.translationGuide),
          `${location}: 音声に講師解説がない`,
        )
        assert.ok(block.speechJa.includes(block.note), `${location}: 音声に文法解説がない`)
      }
    }
  }

  assert.equal(sentenceCount, PASSAGES.reduce((sum, passage) => sum + passage.sentences.length, 0))
  assert.equal(
    blockCount,
    PASSAGES.flatMap((passage) =>
      passage.sentences.flatMap((sentence) => analyzeReadingSentence(sentence).blocks))
      .length,
  )
  assert.equal(
    orderedSegmentCount,
    phrasePairCount,
  )
  assert.ok(explicitSequenceCount > blockCount / 2, '大半のブロックで前へ進む意味単位が明示されていない')
  assert.equal(PASSAGES.length, 16, '全16長文を対象にする')
  assert.equal(sentenceCount, 363, '全363文を対象にする')
  assert.equal(blockCount, 1042, '全1,042文法ブロックを対象にする')
  assert.equal(phrasePairCount, 3238, '全3,238ブロック内役割単位を英語フレーズと直訳の組にする')
})

test('基準例は英語の語順どおり、動作・行き先・手段・時を丁寧に読める', () => {
  const sentence = PASSAGES
    .flatMap((passage) => passage.sentences)
    .find((item) => item.en === 'She goes to school by bus every morning.')
  assert.ok(sentence)

  const analysis = analyzeReadingSentence(sentence)
  assert.deepEqual(
    analysis.phraseSequence.map(({ en, ja }) => ({ en, ja })),
    [
      { en: 'She', ja: '彼女は' },
      { en: 'goes', ja: '行きます' },
      { en: 'to school', ja: '学校へ' },
      { en: 'by bus', ja: 'バスで' },
      { en: 'every morning', ja: '毎朝' },
    ],
  )
  assert.match(analysis.phraseMethod, /^corpus-svocm-(?:reviewed|confirmed)$/)
  assert.equal(analysis.phraseSequence[0].role, 'S')
  assert.equal(analysis.phraseSequence[1].role, 'V')
  assert.match(analysis.phraseSequence[2].explanation, /M（修飾語）/)
})

test('日本語の自然語順へ戻りやすい目的語・比較・理由も英語順に固定する', () => {
  const allBlocks = PASSAGES.flatMap((passage) =>
    passage.sentences.flatMap((sentence) => analyzeReadingSentence(sentence).blocks))

  const bicycleProgram = allBlocks.find((block) =>
    block.en === 'The program will teach simple traffic rules and show people how to prevent common bicycle accidents')
  assert.deepEqual(bicycleProgram?.jaSegments, [
    'その催しは',
    '教えます',
    '簡単な交通ルールを',
    'そして示します',
    '人々に',
    'どのように防ぐかを',
    'よくある自転車事故を',
  ])

  const collectiveMemory = allBlocks.find((block) =>
    block.en === 'Yet collective memory is a far more fragile phenomenon than the existence of records might suggest')
  assert.deepEqual(collectiveMemory?.jaSegments, [
    'しかし',
    '集合的記憶は',
    '〜です',
    'はるかにもろい現象',
    '〜よりも',
    '記録の存在が',
    '示すかもしれない',
  ])

  const platformRisk = allBlocks.find((block) =>
    block.en === 'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation')
  assert.deepEqual(platformRisk?.jaSegments, [
    'デジタルプラットフォームは',
    '強めます',
    'この危険を',
    'なぜなら、それらは',
    '報いるからです',
    '速さを',
    '感情的な確信を',
    'そして忠誠を',
    '集団への',
    'より容易に',
    '粘り強い調査より',
  ])

  const repairDesign = allBlocks.find((block) =>
    block.en === 'that manufacturers should make parts and instructions easier')
  assert.deepEqual(repairDesign?.jaSegments, [
    '製造業者は',
    'するべきだと',
    '部品と説明書を',
    'より容易に（内容は次へ）',
  ])

  const reviewAndPublish = allBlocks.find((block) =>
    block.en === 'Setting review dates and publishing results allows governments')
  assert.deepEqual(reviewAndPublish?.jaSegments, [
    '定めることと',
    '見直しの日程を',
    '公表することは',
    '結果を',
    '可能にします',
    '政府が',
  ])

  const slowReading = allBlocks.find((block) =>
    block.en === 'materials that require slow reading or moral reflection may become almost invisible')
  assert.deepEqual(slowReading?.jaSegments, [
    '資料は',
    'そしてその資料は必要とする',
    'ゆっくり読むことや道徳的な考察を',
    'ほとんど見えなくなるかもしれません',
  ])
})

test('長文画面は文全体のフレーズ列を英語→直訳→必要な解説の順で再生する', () => {
  const source = readFileSync(
    new URL('../src/screens/Reader.jsx', import.meta.url),
    'utf8',
  )

  const automaticStart = source.indexOf('const speakChunkSeq')
  const automaticEnglish = source.indexOf('speakWith(c.en', automaticStart)
  const automaticJapanese = source.indexOf('speakWith(`前からは、「${c.ja}」', automaticEnglish)
  const automaticExplanation = source.indexOf('speakWith(c.explanation', automaticJapanese)
  assert.ok(
    automaticStart >= 0 &&
    automaticEnglish > automaticStart &&
    automaticJapanese > automaticEnglish &&
    automaticExplanation > automaticJapanese,
    '自動再生が英語フレーズ→直訳→必要な解説の順ではない',
  )

  const manualStart = source.indexOf('const speakBlockPair')
  const manualEnglish = source.indexOf('speakWith(pair.en', manualStart)
  const manualJapanese = source.indexOf('speakWith(`前からは、「${pair.ja}」', manualEnglish)
  const manualExplanation = source.indexOf('`読み方は、${block.translationGuide}', manualJapanese)
  assert.ok(
    manualStart >= 0 &&
    manualEnglish > manualStart &&
    manualJapanese > manualEnglish &&
    manualExplanation > manualJapanese,
    '個別再生が英語フレーズ→直訳→読解・文法の順ではない',
  )

  assert.match(source, /block\.phrasePairs\.map/)
  assert.match(source, /analysis\.phraseSequence\.map/)
  assert.match(source, /sentenceAnalysis\.phraseSequence\.map/)
  assert.match(source, /pair\.spokenEn \?\? pair\.en/)
  assert.match(source, /pair\.displayEn \?\? pair\.en/)
  assert.match(source, /pair\.grammar \?\? pair\.explanation \?\? pair\.roleNote/)
  assert.match(source, /data-reading-phrase-method=\{sentenceAnalysis\.phraseMethod\}/)
  assert.match(source, /speakWith\(phraseItem\.spokenEn \?\? phraseItem\.en/)
  assert.match(source, /data-translation-role-flow/)
  assert.match(source, /pair\.roleNote/)
  assert.match(source, /フレーズ直訳・講師音声/)
  assert.match(source, /文全体を自然な日本語に整えると/)
  assert.match(source, /前からの直訳：\{pair\.ja\}/)
  assert.match(source, /読み方：\{block\.translationGuide\}/)
  assert.match(source, /文法上の注意：\{block\.note\}/)
  assert.match(source, /文法上の注意：\{cur\.grammarNote\}/)
})
