import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { getWord } from '../src/data/vocab.js'
import { getKoten } from '../src/data/koten.js'
import { getKotenGrammar } from '../src/data/koten-grammar.js'
import {
  PUBLIC_DOMAIN_LITERATURE,
  getLiteratureWork,
  literatureByKind,
  literatureCompletionCount,
  literatureWordCount,
} from '../src/data/public-domain-literature.js'
import {
  buildLiteratureNarration,
  narrationStepIndex,
} from '../src/lib/literature.js'
import { japanesePhraseSpeechText } from '../src/lib/phrase-speech.js'
import {
  kanbunKakikudashiMatch,
  kanbunNotationIssues,
  kanbunPlainText,
  parseKanbunMarkedText,
} from '../src/lib/kanbun-marks.js'
import { literatureSentences } from '../src/data/literature-sentences.js'
import { createLearningAnalytics } from '../src/lib/learningAnalytics.js'
import { useStore } from '../src/store/useStore.js'

test('名作に親しむは英語6作品・古典3作品・漢文3作品を一意IDで収録する', () => {
  assert.equal(literatureByKind('english').length, 6)
  assert.equal(literatureByKind('classical').length, 3)
  assert.equal(literatureByKind('kanbun').length, 3)
  assert.equal(PUBLIC_DOMAIN_LITERATURE.length, 12)
  assert.equal(
    new Set(PUBLIC_DOMAIN_LITERATURE.map((work) => work.id)).size,
    PUBLIC_DOMAIN_LITERATURE.length,
  )
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    assert.equal(getLiteratureWork(work.id), work)
    assert.match(work.id, /^lit_(?:en|ja|zh)_/)
    assert.ok(work.scenes.length >= 5, work.id)
    assert.match(work.source.url, /^https:\/\//)
    assert.ok(work.rights.basis.includes('70年'), work.id)
    assert.ok(work.rights.translation.includes('本アプリ独自'), work.id)
    assert.equal(work.coverage.complete, true, work.id)
    assert.match(work.coverage.label, /全文/, work.id)
  }
})

test('英語名作6作品は5,000語以内の章または短編を全文収録する', () => {
  const works = literatureByKind('english')
  // 高慢と偏見は、本文の途中に入っていた挿絵の説明（“He came down to see the place”・7語）を本文から外した（2026-09-29）。
  assert.deepEqual(works.map((work) => work.coverage.sourceWordCount), [2237, 853, 1015, 2162, 3499, 2071])
  assert.deepEqual(works.map(literatureWordCount), [2217, 849, 1004, 2143, 3472, 2073])
  for (const work of works) {
    const fullText = work.scenes.map((scene) => scene.original).join(' ')
    assert.ok(work.coverage.sourceWordCount <= 5000, work.id)
    assert.equal(work.coverage.maxWordTarget, 5000, work.id)
    assert.ok(fullText.startsWith(work.coverage.startMarker), `${work.id}: start`)
    assert.ok(fullText.endsWith(work.coverage.endMarker), `${work.id}: end`)
    assert.equal(
      createHash('sha256').update(fullText).digest('hex'),
      work.coverage.sourceSha256,
      `${work.id}: source hash`,
    )
  }
})

// 英語は段落を場面にし、文ごとの構造台帳の語順訳のまとまりを朗読の区切りにする（会話1行の段落は区切り1つ）。
// 古典・漢文は朗読の場面ごとに2組以上の区切りを持つ。
test('全247場面（英語は段落）が原文・訳と、間で区切った一対一の朗読データを持つ', () => {
  let sceneCount = 0
  let segmentCount = 0
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const [index, scene] of work.scenes.entries()) {
      const at = `${work.id}:${index + 1}`
      sceneCount += 1
      assert.ok(scene.original.trim(), `${at}: 原文`)
      assert.ok(scene.translation.trim(), `${at}: 訳`)
      if (work.kind !== 'english') assert.ok(scene.speech?.trim(), `${at}: 読み上げ文`)
      assert.ok(scene.narrationSegments.length >= (work.kind === 'english' ? 1 : 2), `${at}: 間の区切り`)
      segmentCount += scene.narrationSegments.length

      const joiner = work.kind === 'english' ? ' ' : ''
      assert.equal(
        scene.narrationSegments.map((segment) => segment.original).join(joiner),
        scene.original,
        `${at}: 区切りから原文を復元`,
      )
      assert.equal(
        scene.narrationSegments.map((segment) => segment.speech).join(joiner),
        scene.speech || scene.original,
        `${at}: 区切りから読み上げ文を復元`,
      )
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const segmentAt = `${at}:${segmentIndex + 1}`
        assert.ok(segment.original.trim(), `${segmentAt}: 区切り原文`)
        assert.ok(segment.translation.trim(), `${segmentAt}: 区切り訳`)
        assert.ok(segment.speech.trim(), `${segmentAt}: 音声原稿`)
        assert.match(segment.translation, /[ぁ-んァ-ヶ一-龠]/, `${segmentAt}: 日本語訳`)
      }
    }
    if (work.kind === 'english') {
      assert.ok(literatureWordCount(work) >= 130, `${work.id}: 長文語数`)
    }
  }
  assert.equal(sceneCount, 247)
  assert.equal(segmentCount, 1725)
})

// 英語の和訳と語順訳の日本語は、文ごとの構造台帳（literature-structures/）が持つ。
test('英語名作6作品の全624文の和訳と全1,575区切りの対応する日本語に、生成途中の記号や英語の残りがない', () => {
  const artifact = /翻訳エラー|star_border|さらに表示|\d{8,}[|｜]|\[SEG|⟦SEG|ZXQ|[<>]|\bnull\b/i
  let sentenceCount = 0
  let segmentCount = 0
  for (const work of literatureByKind('english')) {
    for (const sentence of literatureSentences(work)) {
      sentenceCount += 1
      assert.ok(sentence.ja.trim(), `${sentence.id}: 和訳`)
      assert.doesNotMatch(sentence.ja, artifact, sentence.id)
      for (const segment of sentence.segments) {
        segmentCount += 1
        assert.doesNotMatch(segment.translation, artifact, `${sentence.id}: ${segment.original}`)
      }
    }
  }
  assert.equal(sentenceCount, 624)
  assert.equal(segmentCount, 1575)
})

test('朗読順は全作品・全区切りで必ず原文→対応する日本語になる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    const steps = buildLiteratureNarration(work)
    const expectedSegmentCount = work.scenes.reduce(
      (count, scene) => count + scene.narrationSegments.length,
      0,
    )
    assert.equal(steps.length, expectedSegmentCount * 2, work.id)

    let expectedStepIndex = 0
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const originalStep = steps[expectedStepIndex]
        const translationStep = steps[expectedStepIndex + 1]
        assert.equal(originalStep.phase, 'original', originalStep.id)
        assert.equal(translationStep.phase, 'translation', translationStep.id)
        assert.equal(originalStep.sceneIndex, sceneIndex, originalStep.id)
        assert.equal(translationStep.sceneIndex, sceneIndex, translationStep.id)
        assert.equal(originalStep.segmentIndex, segmentIndex, originalStep.id)
        assert.equal(translationStep.segmentIndex, segmentIndex, translationStep.id)
        assert.equal(originalStep.displayText, segment.original, originalStep.id)
        assert.equal(
          translationStep.text,
          japanesePhraseSpeechText(segment.translation),
          translationStep.id,
        )
        assert.equal(translationStep.displayText, segment.translation, translationStep.id)
        assert.equal(originalStep.lang, work.language, originalStep.id)
        assert.equal(translationStep.lang, 'ja-JP', translationStep.id)
        assert.equal(
          narrationStepIndex(work, sceneIndex, segmentIndex, 'original'),
          expectedStepIndex,
          originalStep.id,
        )
        assert.equal(
          narrationStepIndex(work, sceneIndex, segmentIndex, 'translation'),
          expectedStepIndex + 1,
          translationStep.id,
        )
        expectedStepIndex += 2
      }
    }
  }
})

test('アリスが時計を見て追いかける段落も全文の中で対応訳と音声を保つ', () => {
  const work = getLiteratureWork('lit_en_alice_rabbit_hole')
  const sceneIndex = work.scenes.findIndex((scene) => scene.original.includes('waistcoat-pocket'))
  const segmentIndex = work.scenes[sceneIndex].narrationSegments.findIndex(
    (segment) => segment.original.includes('actually took a watch'),
  )
  const segment = work.scenes[sceneIndex].narrationSegments[segmentIndex]
  assert.equal(segment.translation, 'ところが、ウサギが本当に時計を取り出して')
  const translationStep = buildLiteratureNarration(work).find(
    (step) => step.sceneIndex === sceneIndex && step.segmentIndex === segmentIndex && step.phase === 'translation',
  )
  assert.ok(translationStep)
  assert.equal(translationStep.displayText, segment.translation)
  assert.equal(translationStep.text, japanesePhraseSpeechText(segment.translation))
  assert.doesNotMatch(translationStep.text, /[（）()]/u)
})

test('アリスが穴へ飛び込む2段落は8区切りで英語→対応する日本語になる', () => {
  const work = getLiteratureWork('lit_en_alice_rabbit_hole')
  const first = work.scenes.findIndex((scene) => scene.original.startsWith('In another moment down went Alice'))
  assert.ok(first > 0)
  const sceneIndexes = [first, first + 1]
  assert.deepEqual(
    sceneIndexes.flatMap((sceneIndex) => work.scenes[sceneIndex].narrationSegments.map((segment) => segment.original)),
    [
      'In another moment down went Alice after it,',
      'never once considering how in the world',
      'she was to get out again.',
      'The rabbit-hole went straight on like a tunnel for some way,',
      'and then dipped suddenly down,',
      'so suddenly that Alice had not a moment',
      'to think about stopping herself',
      'before she found herself falling down a very deep well.',
    ],
  )
  assert.deepEqual(
    buildLiteratureNarration(work)
      .filter((step) => sceneIndexes.includes(step.sceneIndex))
      .map((step) => step.phase),
    Array.from({ length: 8 }, () => ['original', 'translation']).flat(),
  )
})

test('漢文3作品は全17場面で原文を表示し、書き下し→現代語訳の順に読む', () => {
  const works = literatureByKind('kanbun')
  assert.deepEqual(
    works.map((work) => work.id),
    [
      'lit_zh_lunyu_learning',
      'lit_zh_mengzi_fifty_steps',
      'lit_zh_hanfeizi_contradiction',
    ],
  )
  assert.equal(works.reduce((count, work) => count + work.scenes.length, 0), 17)

  for (const work of works) {
    const steps = buildLiteratureNarration(work)
    assert.equal(work.language, 'ja-JP', work.id)
    assert.match(work.source.url, /^https:\/\/zh\.wikisource\.org\//, work.id)
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      assert.notEqual(scene.original, scene.speech, `${work.id}:${sceneIndex + 1}`)
      for (const [segmentIndex, segment] of scene.narrationSegments.entries()) {
        const originalIndex = narrationStepIndex(
          work,
          sceneIndex,
          segmentIndex,
          'original',
        )
        assert.equal(steps[originalIndex].displayText, segment.original)
        assert.equal(steps[originalIndex].text, segment.speech)
        assert.equal(steps[originalIndex].label, '書き下し文')
        assert.equal(steps[originalIndex + 1].displayText, segment.translation)
        assert.equal(steps[originalIndex + 1].phase, 'translation')
      }
    }
  }

  assert.equal(
    getLiteratureWork('lit_zh_hanfeizi_contradiction').scenes[4].original,
    '其人弗能應也。',
  )
})

// 作品本文は旧字体、書き下し文は新字体。突き合わせでは字体をそろえる（kanbun-marks.js）。
test('漢文3作品は本文も朗読の区切りも訓点付きで、訓読文を読むと書き下し文と一字残らず一致する', () => {
  let returnMarkCount = 0
  let okuriganaCount = 0
  for (const work of literatureByKind('kanbun')) {
    for (const [sceneIndex, scene] of work.scenes.entries()) {
      const where = `${work.id}:${sceneIndex + 1}`
      assert.ok(scene.marked, `${where}: 訓読文がありません`)
      assert.ok(scene.kakikudashi, `${where}: 書き下し文がありません`)
      const parsed = parseKanbunMarkedText(scene.marked)
      assert.deepEqual(parsed.errors, [], `${where}: ${JSON.stringify(parsed.errors)}`)
      assert.equal(kanbunPlainText(parsed), scene.original, `${where}: 白文が訓読文と一致しません`)
      const match = kanbunKakikudashiMatch(scene.marked, scene.kakikudashi)
      assert.ok(match.ok, `${where}: 訓読文が書き下し文と合いません（${match.reason}: ${match.matched ?? ''}｜${match.unit ?? ''}）`)
      assert.deepEqual(kanbunNotationIssues(scene.marked), [], `${where}: 返り点の付け方が誤っています`)
      // 区切りへ配った訓読文は、つなぎ直すと必ず場面の訓読文へ戻る。
      assert.equal(
        scene.narrationSegments.map((segment) => segment.marked).join(''),
        scene.marked,
        `${where}: 区切りの訓読文が場面と一致しません`,
      )
      returnMarkCount += parsed.returnMarkCount
      okuriganaCount += parsed.okuriganaCount
    }
  }
  assert.equal(returnMarkCount, 70)
  assert.equal(okuriganaCount, 143)
})

test('作品語彙・古典文法は既存の共通学習データへ解決できる', () => {
  for (const work of PUBLIC_DOMAIN_LITERATURE) {
    for (const id of work.wordIds) assert.ok(getWord(id), `${work.id}: ${id}`)
    for (const id of work.kotenWordIds) assert.ok(getKoten(id), `${work.id}: ${id}`)
    for (const id of work.grammarIds) assert.ok(getKotenGrammar(id), `${work.id}: ${id}`)
  }
})

test('読了集計は通常長文IDを混ぜず、種類別にも数えられる', () => {
  const [english, classical, kanbun] = [
    literatureByKind('english')[0],
    literatureByKind('classical')[0],
    literatureByKind('kanbun')[0],
  ]
  const done = ['p_5_lost_notebook', english.id, classical.id, kanbun.id, 'unknown']
  assert.equal(literatureCompletionCount(done), 3)
  assert.equal(literatureCompletionCount(done, 'english'), 1)
  assert.equal(literatureCompletionCount(done, 'classical'), 1)
  assert.equal(literatureCompletionCount(done, 'kanbun'), 1)
})

test('名作読了は既存の同期対象へ保存し、初回だけ分野別分析へ加算する', () => {
  const before = useStore.getState()
  const english = literatureByKind('english')[0]
  const classical = literatureByKind('classical')[0]
  const kanbun = literatureByKind('kanbun')[0]
  useStore.setState({
    readingsDone: [],
    learningAnalytics: createLearningAnalytics(),
  })

  useStore.getState().markLiteratureDone(english.id, 'reading', english.scenes.length)
  useStore.getState().markLiteratureDone(english.id, 'reading', english.scenes.length)
  useStore.getState().markLiteratureDone(
    classical.id,
    'koten_reading',
    classical.scenes.length,
  )
  useStore.getState().markLiteratureDone(
    kanbun.id,
    'koten_reading',
    kanbun.scenes.length,
  )

  const state = useStore.getState()
  assert.deepEqual(state.readingsDone, [english.id, classical.id, kanbun.id])
  assert.equal(state.learningAnalytics.skills.reading.inputs, english.scenes.length)
  assert.equal(
    state.learningAnalytics.skills.koten_reading.inputs,
    classical.scenes.length + kanbun.scenes.length,
  )
  assert.equal(
    state.learningAnalytics.inputs,
    english.scenes.length + classical.scenes.length + kanbun.scenes.length,
  )

  useStore.setState({
    readingsDone: before.readingsDone,
    learningAnalytics: before.learningAnalytics,
  })
})

test('画面導線・連続TTS・通常長文の分離集計を実装している', () => {
  const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const app = read('../src/App.jsx')
  const reader = read('../src/screens/LiteratureReader.jsx')
  const library = read('../src/screens/LiteratureLibrary.jsx')
  const fullText = read('../src/components/LiteratureFullText.jsx')
  const sheet = read('../src/components/LiteratureSentenceSheet.jsx')
  const contents = read('../src/data/contents.js')
  const koten = read('../src/screens/KotenList.jsx')
  const kanbun = read('../src/screens/KanbunHome.jsx')
  const map = read('../src/screens/EnglishMap.jsx')
  const store = read('../src/store/useStore.js')

  assert.match(app, /literatureLibrary:\s*LiteratureLibraryScreen/)
  assert.match(app, /literatureReader:\s*LiteratureReaderScreen/)
  assert.match(reader, /playSpeechItems\(/)
  assert.match(reader, /segmentIndex/)
  assert.match(reader, /NARRATION_PAUSE_MS/)
  assert.match(reader, /対応する日本語/)
  assert.doesNotMatch(reader, /前からの直訳|フレーズ訳|区切りの直訳/)
  assert.match(reader, /markLiteratureDone\(/)
  // 本文は場面ごとに切り替えず、全文を段落ごとに見せる。文を押すと一文の解説が開き、前後の文へ移れる。
  assert.match(reader, /<LiteratureFullText/)
  assert.match(reader, /<LiteratureSentenceSheet/)
  assert.doesNotMatch(reader, /LiteratureSceneNavigator|前の場面|次の場面/)
  assert.match(reader, /data-literature-kakikudashi-toggle/)
  assert.doesNotMatch(reader, /grid grid-cols-4 gap-2/)
  assert.match(fullText, /data-literature-full-text=\{work\.id\}/)
  assert.match(fullText, /'data-literature-sentence': sentence\.number/)
  assert.match(fullText, /role: 'button'/)
  assert.match(fullText, /event\.key !== 'Enter'/)
  assert.match(sheet, /data-literature-sentence-navigation/)
  assert.match(sheet, /← 前の文/)
  assert.match(sheet, /次の文 →/)
  assert.match(sheet, /aria-live="polite"/)
  assert.match(library, /title="名作に親しむ"/)
  assert.match(library, /段落・/)
  assert.doesNotMatch(library, /scenes\.length\}場面/)
  // 権利・出典・収録範囲の確認は教材を用意する側の管理情報で、生徒の学習には使わない。
  for (const source of [reader, library, fullText, sheet]) {
    assert.doesNotMatch(source, /work\.rights|work\.source|work\.coverage/)
    assert.doesNotMatch(source, /出典|著作権|権利を確認|パブリックドメイン|本アプリ独自|音声合成です|文化庁/)
  }
  assert.match(library, /id: 'kanbun'/)
  assert.match(contents, /title: '名作に親しむ'/)
  assert.doesNotMatch(koten, /kind: 'kanbun'/)
  assert.match(kanbun, /kind: 'kanbun'/)
  assert.match(map, /PASSAGE_IDS\.has\(id\)/)
  assert.match(store, /learningAnalytics:\s*recordLearningEvent/)
})
