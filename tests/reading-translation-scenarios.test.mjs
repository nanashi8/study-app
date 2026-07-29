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
        assert.equal(block.jaSource, 'teaching', `${location}: 自動辞書訳へ後退した`)
        assert.match(block.ja, /[ぁ-んァ-ヶ一-龠]/, `${location}: 日本語訳がない`)
        assert.doesNotMatch(
          block.ja,
          /このまとまりの意味を自然な和訳で確認/,
          `${location}: 仮表示が残っている`,
        )
        assert.ok(block.translationGuide.length >= 20, `${location}: 読み方の解説が短すぎる`)
        assert.match(block.translationGuide, /語順|主語|まとまり|節|動詞/, `${location}: 読解指導がない`)
        assert.ok(block.speechJa.includes(block.ja), `${location}: 音声に語順訳がない`)
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
      { en: 'She goes to school', ja: '彼女は、行きます、学校に' },
      { en: 'by bus every morning', ja: 'バスで、毎朝' },
    ],
  )
  assert.match(blocks[0].translationGuide, /goes.+行きます.+to school.+学校に/)
  assert.match(blocks[1].translationGuide, /by bus.+バスで.+every morning.+毎朝/)
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
