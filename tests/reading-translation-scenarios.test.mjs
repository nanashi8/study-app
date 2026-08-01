import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { PASSAGES } from '../src/data/passages.js'
import { READING_TRANSLATION_SCENARIOS } from '../src/data/reading-translation-scenarios.js'
import { analyzeReadingSentence } from '../src/lib/reading-grammar.js'

test('全長文・全文・全ブロックに講師監修の語順訳シナリオが対応する', () => {
  assert.deepEqual(
    Object.keys(READING_TRANSLATION_SCENARIOS).sort(),
    PASSAGES.map((passage) => passage.id).sort(),
    '長文の追加・削除時は語順訳シナリオも同時に更新する',
  )

  let sentenceCount = 0
  let blockCount = 0
  let orderedSegmentCount = 0
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
        const scripted = scenario[blockIndex]
        const location = `${passage.id}: 第${sentenceIndex + 1}文・第${blockIndex + 1}ブロック`
        assert.equal(scripted.en, block.en, `${location}: 英文との対応がずれた`)
        assert.equal(block.ja, scripted.ja, `${location}: 監修訳が使われていない`)
        assert.ok(Array.isArray(scripted.jaSegments), `${location}: 語順訳の意味単位がない`)
        assert.ok(scripted.jaSegments.length >= 1, `${location}: 語順訳の意味単位が空`)
        assert.ok(Object.isFrozen(scripted.jaSegments), `${location}: 語順訳の意味単位が固定されていない`)
        assert.deepEqual(block.jaSegments, scripted.jaSegments, `${location}: 意味単位が画面へ渡っていない`)
        assert.equal(
          scripted.ja,
          scripted.jaSegments.join(' → '),
          `${location}: 表示順が意味単位の順と一致しない`,
        )
        assert.equal(
          block.orderedSpeechJa,
          scripted.jaSegments.join('。次に、'),
          `${location}: 音声の順が表示順と一致しない`,
        )
        assert.ok(
          scripted.jaSegments.every((segment) => segment.trim() === segment && segment.length > 0),
          `${location}: 空または前後空白付きの意味単位がある`,
        )
        assert.ok(
          scripted.jaSegments.every((segment) => /[ぁ-んァ-ヶ一-龠]/.test(segment)),
          `${location}: 日本語のない意味単位がある`,
        )
        assert.doesNotMatch(scripted.ja, /[。！？]/, `${location}: 自然訳の文末が語順訳へ混入した`)
        if (scripted.jaSegments.length > 1) {
          explicitSequenceCount++
          assert.match(scripted.ja, / → /, `${location}: 前へ進む区切りが表示されない`)
        }
        orderedSegmentCount += scripted.jaSegments.length
        assert.equal(block.jaSource, 'teaching', `${location}: 自動辞書訳へ後退した`)
        assert.match(block.ja, /[ぁ-んァ-ヶ一-龠]/, `${location}: 日本語訳がない`)
        assert.doesNotMatch(
          block.ja,
          /このまとまりの意味を自然な和訳で確認/,
          `${location}: 仮表示が残っている`,
        )
        assert.ok(block.translationGuide.length >= 20, `${location}: 読み方の解説が短すぎる`)
        assert.match(block.translationGuide, /語順|主語|まとまり|節|動詞/, `${location}: 読解指導がない`)
        for (const segment of scripted.jaSegments) {
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
    Object.values(READING_TRANSLATION_SCENARIOS)
      .flat(2)
      .reduce((sum, block) => sum + block.jaSegments.length, 0),
  )
  assert.ok(explicitSequenceCount > blockCount / 2, '大半のブロックで前へ進む意味単位が明示されていない')
})

test('基準例は英語の語順どおり、動作・行き先・手段・時を丁寧に読める', () => {
  const sentence = PASSAGES
    .flatMap((passage) => passage.sentences)
    .find((item) => item.en === 'She goes to school by bus every morning.')
  assert.ok(sentence)

  const blocks = analyzeReadingSentence(sentence).blocks
  assert.deepEqual(
    blocks.map(({ en, ja }) => ({ en, ja })),
    [
      { en: 'She goes to school', ja: '彼女は → 行きます → 学校に' },
      { en: 'by bus every morning', ja: 'バスで → 毎朝' },
    ],
  )
  assert.match(blocks[0].translationGuide, /goes.+行きます.+to school.+学校に/)
  assert.match(blocks[1].translationGuide, /by bus.+バスで.+every morning.+毎朝/)
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
    'はるかにもろい現象です',
    '記録の存在が示すかもしれない以上に',
  ])

  const platformRisk = allBlocks.find((block) =>
    block.en === 'Digital platforms intensify this risk because they reward speed, emotional certainty, and loyalty to a group more readily than patient investigation')
  assert.deepEqual(platformRisk?.jaSegments, [
    'デジタルプラットフォームは',
    '強めます',
    'この危険を',
    'なぜなら、それらは',
    '報いるからです',
    '速さ・感情的な確信・集団への忠誠を',
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

test('長文画面は英語の後に語順訳と講師解説を読み上げ、両方を表示する', () => {
  const source = readFileSync(
    new URL('../src/screens/Reader.jsx', import.meta.url),
    'utf8',
  )

  assert.match(source, /speakWith\(c\.speechJa \?\? c\.ja/)
  assert.match(source, /speakWith\(block\.speechJa \?\? block\.ja/)
  assert.match(source, /語順訳・講師音声/)
  assert.match(source, /文全体を自然な日本語に整えると/)
  assert.match(source, /前から読む語順訳：/)
  assert.match(source, /読み方：\{block\.translationGuide\}/)
  assert.match(source, /文法のポイント：\{block\.note\}/)
  assert.match(source, /文法のポイント：\{cur\.note\}/)
})
