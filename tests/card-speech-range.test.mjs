import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import {
  applyJapaneseSpeechReadings,
  cardSpeechItems,
  exampleMeaningSpeechText,
  meaningSpeechText,
  planCardAutoSpeech,
} from '../src/lib/cardSpeech.js'
import { JAPANESE_SPEECH_READINGS } from '../src/data/japanese-speech-readings.js'
import { SPEECH_RANGES, SPEECH_RANGE_DEFAULT, normalizeSpeechRange, speechRangeOf } from '../src/lib/speechRange.js'
import { phraseSpeechText } from '../src/lib/phrase-speech.js'
import { exampleSpeechAllowed } from '../src/lib/speechGuard.js'
import {
  dismissSpeechPlayer,
  getSpeechPlayerSnapshot,
  playSpeechItems,
  playSpeechPlayer,
  replaceSpeechItems,
} from '../src/lib/speech-player.js'
import { normalizeSettings } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// 読み上げ列を「言語:文」の並びにして見比べる。
const spoken = (items) => items.map((item) => item.segments.map((segment) => `${segment.lang}:${segment.text}`))

const wordItems = (id, range, answerOpen) => {
  const word = getWord(id)
  return cardSpeechItems({
    id,
    head: word.word,
    meanings: word.meanings,
    meaningReadings: true,
    example: word.example,
    exampleSpeech: exampleSpeechAllowed(word),
    range,
    answerOpen,
  })
}

const phraseItems = (id, range, answerOpen) => {
  const item = PHRASES.find((phrase) => phrase.id === id)
  return cardSpeechItems({
    id,
    head: phraseSpeechText(item),
    headStyle: item.kind === 'syntax' ? 'sentence' : 'phrase',
    meanings: item.meanings,
    example: item.example,
    range,
    answerOpen,
  })
}

test('読み上げる範囲は3つから選び、知らない値と前からの保存は「単語のみ」になる', () => {
  assert.deepEqual(SPEECH_RANGES.map((range) => [range.id, range.label]), [
    ['word', '単語のみ'],
    ['meaning', '単語・意味'],
    ['example', '単語・意味・例文・例文の意味'],
  ])
  assert.equal(SPEECH_RANGE_DEFAULT, 'word')
  for (const id of ['word', 'meaning', 'example']) assert.equal(normalizeSpeechRange(id), id)
  for (const value of [undefined, null, '', 'all', 1]) assert.equal(normalizeSpeechRange(value), 'word')
  assert.equal(normalizeSettings({}).speechRange, 'word')
  assert.equal(normalizeSettings({ speechRange: 'example' }).speechRange, 'example')
  // 画面下部の再生パネルでは、どこまで読むかを1行に収まる名前で見せる。
  assert.deepEqual(SPEECH_RANGES.map((range) => range.short), ['単語のみ', '意味まで', '例文まで'])
  assert.equal(speechRangeOf('meaning').short, '意味まで')
  assert.equal(speechRangeOf('all').id, 'word')
})

test('英単語カードは範囲に合わせて 単語→意味→例文→例文の意味 と読み、開く前は意味を読まない', () => {
  const word = ['en-US:abandon']
  const example = ['en-US:They had to abandon the plan.']
  const meaning = 'ja-JP:見捨てる、放棄する'
  const exampleMeaning = 'ja-JP:彼らは計画を放棄せざるを得なかった。'

  // 単語のみ：前からと同じ。見出しは単語だけ、例文のボタンは英文だけ。
  for (const open of [false, true]) {
    assert.deepEqual(spoken(wordItems('abandon', 'word', open)), [word, example])
  }
  // カードを開く前は、どの範囲でも答え（意味・例文の意味）を入れない。
  for (const range of ['meaning', 'example']) {
    assert.deepEqual(spoken(wordItems('abandon', range, false)), [word, example])
  }
  assert.deepEqual(spoken(wordItems('abandon', 'meaning', true)), [[...word, meaning], example])
  assert.deepEqual(spoken(wordItems('abandon', 'example', true)), [
    [...word, meaning, ...example, exampleMeaning],
    [...example, exampleMeaning],
  ])

  // 続けて読む部分のあいだに間を置き、再生パネルには読んでいる部分の名前を出す。
  const [head, sentence] = wordItems('abandon', 'example', true)
  assert.equal(head.label, 'abandon')
  assert.deepEqual(head.segments.map((segment) => segment.label), [undefined, '意味', '例文', '例文の意味'])
  assert.deepEqual(head.segments.map((segment) => segment.pauseAfterMs), [300, 300, 300, undefined])
  assert.deepEqual(head.segments.map((segment) => segment.style), ['word', 'translation', 'sentence', 'translation'])
  assert.equal(sentence.label, 'They had to abandon the plan.')
})

test('使い方で発音が変わる語も意味は読み、文でも読み分けられない語は例文とその意味を読まない', () => {
  // record は単語だけでは読まない（再生パネルが外す）。例文は文の中で読み分けられるので読む。
  assert.equal(spoken(wordItems('record', 'example', true))[0][0], 'en-US:record')
  assert.deepEqual(spoken(wordItems('row_2', 'example', true)), [['en-US:row', 'ja-JP:口論、騒ぎ']])
  assert.deepEqual(spoken(wordItems('row_2', 'word', false)), [['en-US:row']])
})

test('熟語は見出し、構文は完成した例文を読み、同じ文を続けて2度読まない', () => {
  assert.deepEqual(spoken(phraseItems('idm_look_at', 'example', true)), [
    ['en-US:look at', 'ja-JP:を見る、に目を向ける', 'en-US:Look at the blackboard.', 'ja-JP:黒板を見なさい。'],
    ['en-US:Look at the blackboard.', 'ja-JP:黒板を見なさい。'],
  ])
  // 構文の見出しの音声は例文そのものなので、見出しのあとに同じ英文を読み直さない。
  assert.deepEqual(spoken(phraseItems('syn_too_to', 'example', true)), [
    ['en-US:It is too hot to walk outside.', 'ja-JP:すぎてできない、あまりにでできない', 'ja-JP:外を歩くには暑すぎる。'],
    ['en-US:It is too hot to walk outside.', 'ja-JP:外を歩くには暑すぎる。'],
  ])
  // 文法の例文は、意味が例文の和訳そのものなので1度だけ読む。
  const sentence = 'Neither the chair nor the members were willing to compromise.'
  const translation = '議長も委員たちも妥協する意思がありませんでした。'
  assert.deepEqual(spoken(phraseItems('curr_syn_gr_more_1_agree_01', 'example', true)), [
    [`en-US:${sentence}`, `ja-JP:${translation}`],
    [`en-US:${sentence}`, `ja-JP:${translation}`],
  ])
  assert.deepEqual(spoken(phraseItems('syn_too_to', 'meaning', false)), [
    ['en-US:It is too hot to walk outside.'],
    ['en-US:It is too hot to walk outside.'],
  ])
})

test('意味は画面の記号を読まず、読みにくい語は画面と同じ読みで読む', () => {
  // 品詞の目印・語が入る印（〜 …）・英語だけのかっこ書きは読まない。
  assert.equal(meaningSpeechText(['水', '〜に水をやる(動)']), '水、に水をやる')
  assert.equal(meaningSpeechText(['口座', '説明', '（for）占める']), '口座、説明、占める')
  assert.equal(meaningSpeechText(['…すぎて〜できない']), 'すぎてできない')
  // かっこの補足は中身を読む。語のあとの補足は間を置き、続きの言葉や熟語に付く1字は続けて読む。
  assert.equal(meaningSpeechText(['遊ぶ', '（楽器を）演奏する']), '遊ぶ、楽器を演奏する')
  assert.equal(meaningSpeechText(['〜の間に(2つ)']), 'の間に、2つ')
  assert.equal(meaningSpeechText(['影響（を与える）']), '影響を与える')
  assert.equal(meaningSpeechText(['洞察(力)']), '洞察力')
  assert.equal(meaningSpeechText(['月(暦)']), '月、暦')
  assert.equal(meaningSpeechText(['(情報・反応を)引き出す']), '情報、反応を引き出す')
  // 英単語の意味は、画面で（よみ）を添えた語を読みで読む。意味に読みが書いてある語は、その読みだけを読む。
  assert.equal(meaningSpeechText(['恣意的な', '任意の'], { readings: true }), 'しいてきな、任意の')
  assert.equal(meaningSpeechText(['灌漑(かんがい)'], { readings: true }), 'かんがい')
  assert.equal(meaningSpeechText(['恣意的な']), '恣意的な')
  // 例文の意味は文のまま読み、カタカナの名前の中の・は区切らない。
  assert.equal(exampleMeaningSpeechText('モナ・リザは、なぞめいた微笑みで有名だ。'), 'モナ・リザは、なぞめいた微笑みで有名だ。')
  assert.equal(exampleMeaningSpeechText('英語もフランス語もどちらも〜ない'), '英語もフランス語もどちらもない')
})

test('全英単語・全熟語・構文の意味は、記号を残さず読める文になる', () => {
  const rows = [
    ...ALL_WORDS.map((word) => [word.id, meaningSpeechText(word.meanings, { readings: true })]),
    ...PHRASES.map((phrase) => [phrase.id, meaningSpeechText(phrase.meanings)]),
  ]
  assert.equal(rows.length, ALL_WORDS.length + PHRASES.length)
  assert.deepEqual(rows.filter(([, text]) => !text).map(([id]) => id), [])
  assert.deepEqual(rows.filter(([, text]) => /[〜～~…‥—―()（）／/]|^、|、$|、、/u.test(text)).map(([id]) => id), [])
  const translations = [...ALL_WORDS, ...PHRASES].map((item) => [item.id, exampleMeaningSpeechText(item.example?.ja)])
  assert.deepEqual(translations.filter(([, text]) => !text || /[〜～~…]/u.test(text)).map(([id]) => id), [])
})

test('端末の声が読み違えやすい語は、台帳の読みをかなで読ませる（画面の文字は変えない）', () => {
  // 台帳の語は、いまの読み上げ文の中に1か所だけある。教材の文を直して見つからなくなったら、読みを決め直す。
  const words = new Map(ALL_WORDS.map((word) => [word.id, word]))
  const phrases = new Map(PHRASES.map((phrase) => [phrase.id, phrase]))
  let pairs = 0
  for (const [id, parts] of Object.entries(JAPANESE_SPEECH_READINGS)) {
    const word = words.get(id)
    const item = word ?? phrases.get(id)
    assert.ok(item, `${id} が英単語にも熟語・構文にもない`)
    assert.ok(!(word && phrases.has(id)), `${id} が英単語と熟語・構文の両方にある`)
    const source = {
      meaning: meaningSpeechText(item.meanings, { readings: Boolean(word) }),
      example: exampleMeaningSpeechText(item.example?.ja),
    }
    for (const [part, list] of Object.entries(parts)) {
      assert.ok(Object.hasOwn(source, part), `${id}: ${part}`)
      let text = source[part]
      for (const [target, reading] of list) {
        assert.equal(text.split(target).length - 1, 1, `${id} ${part}: 「${target}」が文の中で1か所に決まらない`)
        assert.match(target, /[\p{Script=Han}]/u, `${id}: ${target}`)
        assert.match(reading, /\p{Script=Hiragana}/u, `${id}: ${reading}`)
        text = text.replace(target, reading)
        pairs += 1
      }
      assert.equal(applyJapaneseSpeechReadings(source[part], list), text)
    }
  }
  assert.equal(Object.keys(JAPANESE_SPEECH_READINGS).length, 857)
  assert.equal(pairs, 989)

  const japanese = (items) => items.map((item) => item.segments.filter((segment) => segment.lang === 'ja-JP').map((segment) => segment.text))
  // 後＝あと、間＝あいだ、数と助数詞は数字も含めて読む。
  assert.deepEqual(japanese(wordItems('thirsty', 'example', true)), [
    ['のどがかわいた', 'サッカーの練習のあとで、とてものどが渇いている。'],
    ['サッカーの練習のあとで、とてものどが渇いている。'],
  ])
  assert.deepEqual(japanese(wordItems('between', 'example', true))[0], ['のあいだに、2つ', '私たちのあいだに座って。'])
  assert.equal(japanese(wordItems('election', 'example', true))[1][0], '選挙はごがつに行われる。')
  // 月の名前は、2つの辞書がそろって「つき」と読むので、辞書の食い違いとは別に全部書く。
  assert.deepEqual(japanese(wordItems('may', 'example', true))[0], ['ごがつ', 'ごがつには長い休みがある。'])
  assert.equal(japanese(wordItems('within', 'example', true))[1][0], 'みっか以内に返信して。')
  assert.equal(japanese(wordItems('corner', 'meaning', true))[0][0], 'かど、隅')
  // 助数詞や接尾語は、かなにした語と一緒に読む（なんびゃく人→なんびゃくにん、ふつか後→ふつかご）。
  assert.match(japanese(wordItems('eruption', 'example', true))[1][0], /なんびゃくにんもの人/)
  assert.match(japanese(wordItems('convict', 'example', true))[1][0], /ふつかごに/)
  // 文法の例文は、意味が例文の和訳そのもの。例文のボタンで読む和訳にも同じ読みを当てる。
  assert.deepEqual(japanese(phraseItems('curr_syn_gr_exam_eiken_pre2_conjunction_1_001', 'example', true)), [
    ['ケンが夕食を作っているあいだ、アヤはテーブルの準備をした。'],
    ['ケンが夕食を作っているあいだ、アヤはテーブルの準備をした。'],
  ])
  // 台帳のない語はそのまま。カードを開く前は日本語を読まない。
  assert.deepEqual(japanese(wordItems('abandon', 'example', true))[0], ['見捨てる、放棄する', '彼らは計画を放棄せざるを得なかった。'])
  assert.deepEqual(japanese(wordItems('thirsty', 'example', false)), [[], []])
  // 画面に出す意味と例文は変えない。
  assert.equal(getWord('thirsty').example.ja, 'サッカーの練習の後で、とてものどが渇いている。')
})

test('自動の読み上げは、カードを開く前は見出しだけ、開いたら意味から続きを読む', () => {
  const plan = (memory, state) => planCardAutoSpeech(memory, { spellingHidden: false, autoSpeak: true, ...state })

  // 単語のみ：カードを出したときに単語を読み、開いても読み直さない（前からと同じ）。
  const shown = plan(null, { answerOpen: false, range: 'word' })
  assert.deepEqual([shown.action, shown.startSegment], ['play', 0])
  assert.equal(plan(shown.memory, { answerOpen: true, range: 'word' }).action, 'none')

  // 単語・意味：開いたら、読んだ単語の続き（2つめの部分＝意味）から読む。閉じて開き直しても読み直さない。
  const front = plan(null, { answerOpen: false, range: 'meaning' })
  const opened = plan(front.memory, { answerOpen: true, range: 'meaning' })
  assert.deepEqual([opened.action, opened.startSegment], ['play', 1])
  const closed = plan(opened.memory, { answerOpen: false, range: 'meaning' })
  assert.equal(closed.action, 'dismiss')
  assert.equal(plan(closed.memory, { answerOpen: true, range: 'meaning' }).action, 'none')

  // 答えを開いたままのカードは、はじめから範囲の最後まで読む。
  const revealed = plan(null, { answerOpen: true, range: 'example' })
  assert.deepEqual([revealed.action, revealed.startSegment], ['play', 0])
  assert.equal(plan(revealed.memory, { answerOpen: true, range: 'example' }).action, 'none')

  // 自動で発音がオフなら読まない。閉じ直したときは、パネルから意味を読み直せないように閉じる。
  const silent = planCardAutoSpeech(null, { spellingHidden: false, answerOpen: true, range: 'meaning', autoSpeak: false })
  assert.equal(silent.action, 'none')
  assert.equal(planCardAutoSpeech(silent.memory, { spellingHidden: false, answerOpen: false, range: 'meaning', autoSpeak: false }).action, 'dismiss')

  // スペルを隠すカードは、開いてスペルが見えたところで単語から読む。
  const hidden = planCardAutoSpeech(null, { spellingHidden: true, answerOpen: false, range: 'example', autoSpeak: true })
  assert.equal(hidden.action, 'dismiss')
  const spelled = plan(hidden.memory, { answerOpen: true, range: 'example' })
  assert.deepEqual([spelled.action, spelled.startSegment], ['play', 0])
})

// 端末の読み上げの代わりに、読んだ文を queued に積む。
function withMockSpeech(run) {
  const previousWindow = globalThis.window
  const PreviousUtterance = globalThis.SpeechSynthesisUtterance
  const queued = []
  class MockUtterance {
    constructor(text) {
      this.text = text
    }
  }
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      speak: (utterance) => queued.push(utterance),
    },
    // 部分のあいだの間（ミリ秒）は待たずに続ける。
    setTimeout: (callback) => {
      callback()
      return 0
    },
    clearTimeout: () => {},
  }
  globalThis.SpeechSynthesisUtterance = MockUtterance
  try {
    run(queued)
  } finally {
    dismissSpeechPlayer()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (PreviousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance
    else globalThis.SpeechSynthesisUtterance = PreviousUtterance
  }
}

test('再生パネルの「範囲」を変えると、同じカードの読み上げ列を入れ替え、読んでいる途中なら読み直す', () => {
  withMockSpeech((queued) => {
    // 暗記カードの読み上げだけ、再生パネルに「範囲」を出す。
    assert.equal(playSpeechItems(['look at']), true)
    assert.equal(getSpeechPlayerSnapshot().rangeAdjustable, false)
    assert.equal(replaceSpeechItems('0:abandon', wordItems('abandon', 'meaning', true)), false)

    assert.equal(playSpeechItems(wordItems('abandon', 'word', true), { key: '0:abandon', rangeAdjustable: true }), true)
    assert.equal(getSpeechPlayerSnapshot().rangeAdjustable, true)
    assert.equal(queued.at(-1).text, 'abandon')
    // ほかのカードの列は入れ替えない。
    assert.equal(replaceSpeechItems('1:more', wordItems('abandon', 'meaning', true), { restart: true }), false)

    // 読んでいる途中に範囲を広げると、見出しを新しい範囲で最初から読み直す。
    assert.equal(replaceSpeechItems('0:abandon', wordItems('abandon', 'meaning', true), { restart: true }), true)
    assert.equal(queued.at(-1).text, 'abandon')
    queued.at(-1).onend()
    assert.equal(queued.at(-1).text, '見捨てる、放棄する、')
    queued.at(-1).onend()
    assert.equal(getSpeechPlayerSnapshot().status, 'ended')

    // 読み終えたあとは入れ替えるだけ。次の「再生」から新しい範囲で読む。
    const spokenBefore = queued.length
    assert.equal(replaceSpeechItems('0:abandon', wordItems('abandon', 'example', true), { restart: true }), true)
    assert.equal(queued.length, spokenBefore)
    assert.equal(getSpeechPlayerSnapshot().status, 'ended')
    assert.equal(playSpeechPlayer(), true)
    const replayed = []
    for (let part = 0; part < 4; part += 1) {
      replayed.push(queued.at(-1).text)
      queued.at(-1).onend()
    }
    assert.deepEqual(replayed, [
      'abandon',
      '見捨てる、放棄する、',
      'They had to abandon the plan.',
      '彼らは計画を放棄せざるを得なかった。',
    ])

    dismissSpeechPlayer()
    assert.equal(getSpeechPlayerSnapshot().rangeAdjustable, false)
  })
})

test('再生パネルは途中の部分から読み始め、外した部分があっても位置がずれず、読み直しは最初から', () => {
  const previousWindow = globalThis.window
  const PreviousUtterance = globalThis.SpeechSynthesisUtterance
  const queued = []
  class MockUtterance {
    constructor(text) {
      this.text = text
    }
  }
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      speak: (utterance) => queued.push(utterance),
    },
    setTimeout,
    clearTimeout,
  }
  globalThis.SpeechSynthesisUtterance = MockUtterance
  try {
    const [head] = wordItems('abandon', 'meaning', true)
    assert.equal(playSpeechItems([head], { startSegment: 1 }), true)
    assert.equal(queued.at(-1).text, '見捨てる、放棄する、')
    assert.equal(queued.at(-1).lang, 'ja-JP')
    queued.at(-1).onend()
    assert.equal(getSpeechPlayerSnapshot().status, 'ended')
    assert.equal(playSpeechPlayer(), true)
    assert.equal(queued.at(-1).text, 'abandon')

    // record は単語だけでは読まない。単語を外しても、続きは意味から読む。
    const [record] = wordItems('record', 'meaning', true)
    assert.equal(playSpeechItems([record], { startSegment: 1 }), true)
    assert.equal(queued.at(-1).text, '記録する、録音する、記録、')
    assert.equal(playSpeechItems([record]), true)
    assert.equal(queued.at(-1).text, '記録する、録音する、記録、')
  } finally {
    dismissSpeechPlayer()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (PreviousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance
    else globalThis.SpeechSynthesisUtterance = PreviousUtterance
  }
})

test('英単語・熟語・構文の暗記カードは、見出しのボタンと自動の読み上げで同じ読み上げ列を使う', () => {
  for (const [path, items, title] of [
    ['src/screens/VocabStudy.jsx', 'wordSpeechItems', '単語カード'],
    ['src/screens/PhraseStudy.jsx', 'phraseSpeechItems', '熟語・構文カード'],
  ]) {
    const source = read(path)
    assert.match(source, new RegExp(`const ${items} = (?:word|item)\\n\\s*\\? cardSpeechItems\\(\\{`), path)
    assert.match(source, /range: settings\.speechRange,\n\s*answerOpen: flipped,/, path)
    assert.match(source, new RegExp(`useCardAutoSpeech\\(\\{[\\s\\S]*?items: ${items},[\\s\\S]*?title: '${title}',`), path)
    // 見出しのボタンは1つめ、例文のボタンは2つめから読む。どちらもカードの読み上げ列の持ち主を渡す。
    assert.match(source, new RegExp(`phrases=\\{${items}\\}\\n\\s*phraseIndex=\\{0\\}\\n\\s*speechKey=\\{speechKey\\}`), path)
    assert.match(source, new RegExp(`phrases=\\{${items}\\}\\n\\s*phraseIndex=\\{1\\}\\n\\s*speechKey=\\{speechKey\\}`), path)
    assert.match(source, /const speechKey = (?:word|item) \? `\$\{i\}:\$\{(?:word|item)\.id\}` : null/, path)
    assert.match(source, /useCardAutoSpeech\(\{\n\s*speechKey,/, path)
    assert.doesNotMatch(source, /playSpeechItems|dismissSpeechPlayer/, path)
  }
  // 英単語の意味だけ、画面で（よみ）を添える語を読みで読む。どちらも id で読みの台帳を引く。
  assert.match(read('src/screens/VocabStudy.jsx'), /meaningReadings: true,/)
  assert.doesNotMatch(read('src/screens/PhraseStudy.jsx'), /meaningReadings/)
  assert.match(read('src/screens/VocabStudy.jsx'), /cardSpeechItems\(\{\n\s*id: word\.id,/)
  assert.match(read('src/screens/PhraseStudy.jsx'), /cardSpeechItems\(\{\n\s*id: item\.id,/)

  // 自動の読み上げとボタンは同じ持ち主で読み、範囲を変えたらそのカードの列を入れ替える（読んでいる途中なら読み直す）。
  const hook = read('src/components/useCardAutoSpeech.js')
  assert.match(hook, /key: speechKey,\n\s*rangeAdjustable: true,/)
  assert.match(hook, /replaceSpeechItems\(speechKey, items, \{ restart: previous\.range !== range \}\)/)
  assert.match(hook, /\}, \[speechKey, signature, range\]\)/)
  assert.match(read('src/components/SpeakButton.jsx'), /\.\.\.\(speechKey && phrases\?\.length \? \{ key: speechKey, rangeAdjustable: true \} : \{\}\),/)

  // 設定は英単語・熟語・構文の暗記カードを開く教材の設定と、全体の設定に並ぶ。
  const settings = read('src/components/SpeechSettings.jsx')
  assert.match(settings, /title="読み上げる範囲"/)
  assert.match(settings, /\{SPEECH_RANGES\.map\(\(range\) => \(/)
  assert.match(settings, /speechRange: SpeechRangeSetting,/)
})
