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

const normalizeEnglish = (value = '') => value
  .replace(/\s+([,.;:!?])/g, '$1')
  .replace(/\s+/g, ' ')
  .trim()

const englishWords = (value = '') =>
  (value.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) ?? []).map((word) => word.toLowerCase())

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
  let meaningPhraseCount = 0
  let meaningMultiRoleCount = 0
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
      assert.match(analysis.phraseMethod, /^corpus-meaning-phrase-(?:reviewed|confirmed)$/)
      assert.deepEqual(
        englishWords(analysis.meaningPhraseSequence.map((phrase) => phrase.spokenEn).join(' ')),
        englishWords(sentence.en),
        `${passage.id}: 第${sentenceIndex + 1}文の意味フレーズから原文を復元できない`,
      )
      for (const [phraseIndex, phrase] of analysis.meaningPhraseSequence.entries()) {
        const phraseAt = `${passage.id}: 第${sentenceIndex + 1}文・意味フレーズ${phraseIndex + 1}`
        const wordCount = phrase.en.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g)?.length ?? 0
        assert.ok(wordCount >= 1 && wordCount <= 8, `${phraseAt}: 一息の上限8語を超えている`)
        assert.ok(phrase.en && phrase.ja && phrase.explanation, `${phraseAt}: 必須欄がない`)
        assert.equal(phrase.spokenEn, phrase.en, `${phraseAt}: 原文にない補いを発音する`)
        assert.ok(phrase.roles.length >= 1, `${phraseAt}: 内部SVOCMがない`)
        assert.ok(phrase.roleParts.length >= 1, `${phraseAt}: 役割別英語がない`)
        meaningPhraseCount++
        if (phrase.roles.length > 1) meaningMultiRoleCount++
      }
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
          const wordLimit = Number.isFinite(pair.wordLimit)
            ? pair.wordLimit
            : extendedPhrase
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
        assert.doesNotMatch(block.ja, /[。！？]$/, `${location}: 自然訳の文末が語順訳へ混入した`)
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
  assert.equal(meaningPhraseCount, 2290, '全2,290件の学習者向け意味フレーズを対象にする')
  assert.equal(meaningMultiRoleCount, 775, 'SVOCMを内部に複数含む775件も一つの意味フレーズとして保つ')
})

test('基準例は英語の語順どおり、動作・行き先・手段・時を丁寧に読める', () => {
  const sentence = PASSAGES
    .flatMap((passage) => passage.sentences)
    .find((item) => item.en === 'She goes to school by bus every morning.')
  assert.ok(sentence)

  const analysis = analyzeReadingSentence(sentence)
  assert.deepEqual(
    analysis.meaningPhraseSequence.map(({ en, roles, ja }) => ({ en, roles, ja })),
    [
      { en: 'She goes', roles: ['S', 'V'], ja: '彼女は行きます' },
      { en: 'to school', roles: ['M'], ja: '学校へ' },
      { en: 'by bus', roles: ['M'], ja: 'バスで' },
      { en: 'every morning', roles: ['M'], ja: '毎朝' },
    ],
  )
  assert.match(analysis.phraseMethod, /^corpus-meaning-phrase-(?:reviewed|confirmed)$/)
  assert.deepEqual(analysis.meaningPhraseSequence[0].roles, ['S', 'V'])
  assert.match(analysis.meaningPhraseSequence[1].explanation, /M（修飾語）/)
})

test('日本語の自然語順へ戻りやすい目的語・比較・理由も英語順に固定する', () => {
  const phraseJapanese = (fragment) => {
    const sentence = PASSAGES.flatMap((passage) => passage.sentences)
      .find((item) => item.en.includes(fragment))
    assert.ok(sentence, `対象文がない: ${fragment}`)
    return analyzeReadingSentence(sentence).phraseSequence.map((phrase) => phrase.ja)
  }

  assert.deepEqual(phraseJapanese('The program will teach'), [
    'その催しは',
    '教えます',
    '簡単な交通ルールを',
    'そして',
    '示します',
    '人々に',
    'どのように',
    '防ぐこと（対象は次へ）',
    'よくある自転車事故をどう防ぐかを（人々に示します）',
  ])

  assert.deepEqual(phraseJapanese('Yet collective memory'), [
    'しかし',
    '集合的記憶は',
    '〜です',
    'はるかにもろい現象',
    '〜よりも',
    '記録の存在が',
    '示すかもしれない',
  ])

  assert.deepEqual(phraseJapanese('Digital platforms intensify'), [
    'デジタルプラットフォームは',
    '強めます',
    'この危険を',
    'なぜなら',
    'それらは',
    '報います（対象・比較は次へ）',
    '速さを',
    '感情的な確信を',
    'そして',
    '忠誠を',
    '集団への（忠誠を）',
    'より容易に',
    '粘り強い調査より、速さ・感情的確信・集団への忠誠に容易に報いるからです',
  ])

  assert.deepEqual(phraseJapanese('Critics therefore argue'), [
    '批判する人々は',
    'そのため',
    '主張します',
    '次の内容だと（中身は次へ）',
    '製造業者は',
    '〜にするべきです（対象・状態は次へ）',
    '部品と説明書を',
    'より入手しやすい状態にするべきだ（と主張します）',
  ])

  assert.deepEqual(phraseJapanese('Setting review dates'), [
    '見直しの日程を定めること',
    'そして',
    '結果を公表することは',
    '可能にします',
    '政府が',
    '改めること（対象・条件は次へ）',
    '政策を',
    '〜することなく（内容は次へ）',
    'みなします（何を何と、は次へ）',
    '見直しを',
    '見直しを失敗とみなさずに政策を改められるよう、政府を助けます',
  ])

  assert.deepEqual(phraseJapanese('When search results'), [
    '〜すると',
    '検索結果が',
    '短い動画が',
    'そして',
    'アルゴリズムによる推薦が',
    '競い合う',
    '人々の注意を得ようと（競い合うと）',
    '資料は',
    'そしてその資料は',
    '必要とする',
    'ゆっくり読むことや道徳的な考察を',
    '〜になります（状態は次へ）',
    'ほとんど目立たない状態',
  ])
})

test('長文画面は文全体の意味フレーズを英語→対応する日本語→必要な解説の順で再生する', () => {
  const source = readFileSync(
    new URL('../src/screens/Reader.jsx', import.meta.url),
    'utf8',
  )
  assert.match(source, /<StructureDiagram tokens=\{sentenceAnalysis\.structureTokens\} \/>/)
  assert.doesNotMatch(source, /sentenceAnalysis\.blocks\.map\(\(block\) =>/)

  const automaticStart = source.indexOf('const chunkSpeechItems')
  const automaticEnglish = source.indexOf('text: chunk.en', automaticStart)
  const automaticJapanese = source.indexOf(
    'japanesePhraseSpeechText(chunk.ja)',
    automaticEnglish,
  )
  const automaticExplanation = source.indexOf('text: chunk.explanation', automaticJapanese)
  assert.ok(
    automaticStart >= 0 &&
    automaticEnglish > automaticStart &&
    automaticJapanese > automaticEnglish &&
    automaticExplanation > automaticJapanese,
    '自動再生が英語フレーズ→対応する日本語→必要な解説の順ではない',
  )

  const manualStart = source.indexOf('const speakBlockPair')
  const manualEnglish = source.indexOf('text: pair.spokenEn ?? pair.en', manualStart)
  const manualJapanese = source.indexOf(
    'japanesePhraseSpeechText(pair.ja)',
    manualEnglish,
  )
  const manualExplanationSpeech = source.indexOf('text: explanation', manualJapanese)
  assert.ok(
    manualStart >= 0 &&
    manualEnglish > manualStart &&
    manualJapanese > manualEnglish &&
    manualExplanationSpeech > manualJapanese,
    '個別再生が英語フレーズ→対応する日本語→読解・文法の順ではない',
  )
  assert.match(source, /ブロック全体の読み方は、\$\{block\.translationGuide\}/)

  assert.match(source, /learnerPhrasePairsForBlock\(block\)/)
  assert.match(source, /block\?\.meaningPhrasePairs \?\? block\?\.phrasePairs/)
  assert.match(source, /phrasePairs\.map/)
  assert.match(source, /analysis\.meaningPhraseSequence\.map/)
  assert.match(source, /sentenceAnalysis\.meaningPhraseSequence\.map/)
  assert.match(source, /pair\.spokenEn \?\? pair\.en/)
  assert.match(source, /pair\.displayEn \?\? pair\.en/)
  assert.match(source, /pair\.grammar \?\? pair\.explanation \?\? pair\.roleNote/)
  assert.match(source, /data-reading-phrase-method=\{sentenceAnalysis\.phraseMethod\}/)
  assert.match(source, /text:\s*item\.spokenEn \?\? item\.en/)
  assert.match(source, /japanesePhraseSpeechText\(item\.ja\)/)
  assert.match(source, /data-translation-role-flow/)
  assert.match(source, /pair\.roleNote/)
  assert.match(source, /<SpeakerWave size=\{14\} \/> 講師音声/)
  assert.doesNotMatch(source, /フレーズ直訳・講師音声/)
  assert.match(source, /文全体を自然な日本語に整えると/)
  assert.doesNotMatch(source, /前からの直訳：\{pair\.ja\}/)
  assert.doesNotMatch(source, /フレーズ訳：\{phraseItem\.ja\}/)
  assert.doesNotMatch(source, /前から読むフレーズ解説/)
  assert.match(source, /英文を発音できて意味が通るまとまりに区切ります/)
  assert.match(source, /S・V・O・C・Mはフレーズ内の構造を確かめる注釈です/)
  assert.match(source, /前後を含む上段の意味フレーズにまとめています/)
  assert.match(source, /\{pair\.ja\}/)
  assert.match(source, /読み方：\{block\.translationGuide\}/)
  assert.match(source, /文法上の注意：\{block\.note\}/)
  assert.match(source, /label:\s*'読み方・文法上の注意'/)
})
