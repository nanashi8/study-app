// 依頼 2026-09-29-literature-full-text-tap の条件 classical-notes・kanbun-notes。
// 古典3作品（枕草子第一段・徒然草第五十二段・方丈記冒頭）の各文に、読み（ひらがな）・区切りごとの現代語訳・
// 文全体の現代語訳・語句の意味・文法の説明を書く。漢文3作品（論語・孟子「五十歩百歩」・韓非子「矛盾」）の
// 各文に、訓読文・書き下し文・読み・読む順・区切りごとの現代語訳・文全体の現代語訳・語句の意味・句法の説明を書く。
// 語句・文法のうちカードがあるものは、そのカードへ行ける（カードの語が本当にその語であること）。
import test from 'node:test'
import assert from 'node:assert/strict'

import { literatureByKind } from '../src/data/public-domain-literature.js'
import { literatureSentenceErrors, literatureSentences } from '../src/data/literature-sentences.js'
import { LITERATURE_CLASSICS_NOTES } from '../src/data/literature-classics-notes.js'
import { KOTEN_BY_ID } from '../src/data/koten.js'
import { KOTEN_GRAMMAR_BY_ID } from '../src/data/koten-grammar.js'
import { KANBUN_COLLECTIONS } from '../src/data/kanbun-content.js'
import { kanbunReadingOrder, parseKanbunMarkedText } from '../src/lib/kanbun-marks.js'
import { tokenizeKanbunText, uncoveredKanbunKanji } from '../src/lib/kanbunFurigana.js'

const KANBUN_VOCAB = new Map(KANBUN_COLLECTIONS.vocab.map((item) => [item.id, item]))
const KANBUN_GRAMMAR = new Map(KANBUN_COLLECTIONS.grammar.map((item) => [item.id, item]))

// 本文の形とカードの見出しが違うが、同じ語としてつないだもの（活用した形・派生した名詞）。
const KOTEN_DERIVED = Object.freeze({
  さらでも: 'さらぬ', // 「然り」＋打消の「で」。カードは同じ成り立ちの「さらぬ」
  急ぎ: 'いそぐ', // 動詞「いそぐ」の連用形
  もて渡る: 'わたる', // 「持ちて」＋「わたる（行く・通る）」
  ならひ: 'ならふ', // 動詞「ならふ」から来た名詞
})
// 本文は旧字体、カードは新字体のもの。
const KANBUN_VARIANTS = Object.freeze({ 國: '国' })

// ひらがな（現代仮名遣い）と句読点・かぎかっこ・中点・「…」だけで書いた読みか。
const HIRAGANA_READING = /^[ぁ-ゖー、。，「」？！・…\s]+$/u
// 読みと書き下し文の、句読点・かぎかっこの並び（読みを書き下し文どおりに区切っているか）。
const punctuation = (text) => [...`${text}`].filter((character) => /[、。「」？]/u.test(character)).join('')

test('古典・漢文の6作品の全50文に、文ごとの解説がそろっている（台帳の文と朗読の区切りが食い違わない）', () => {
  const counts = []
  for (const work of [...literatureByKind('classical'), ...literatureByKind('kanbun')]) {
    assert.deepEqual(literatureSentenceErrors(work), [], work.id)
    const entries = LITERATURE_CLASSICS_NOTES[work.id]
    const sentences = literatureSentences(work)
    assert.equal(entries.length, sentences.length, work.id)
    counts.push(sentences.length)
    for (const sentence of sentences) {
      const at = sentence.id
      const entry = sentence.entry
      assert.equal(sentence.provisional, undefined, `${at}: 仮の場面単位`)
      assert.ok(entry.ja.trim() && /[。」]$/u.test(entry.ja), `${at}: 文全体の現代語訳`)
      assert.ok(entry.point.trim().length >= 20, `${at}: 読みのポイント`)
      assert.ok(entry.words.length + entry.grammar.length > 0, `${at}: 語句・文法の説明がない`)
      assert.ok(sentence.segments.length > 0 && sentence.segments.every((segment) => segment.translation.trim()), `${at}: 区切りごとの現代語訳`)
      for (const word of entry.words) {
        assert.ok(word.term && word.reading && word.meaning, `${at}: 語句 ${word.term} の欄が空`)
        assert.match(word.reading, HIRAGANA_READING, `${at}: 語句 ${word.term} の読み`)
      }
      for (const item of entry.grammar) {
        assert.ok(item.term && item.text.length >= 10, `${at}: 文法 ${item.term} の説明`)
      }
    }
  }
  // 枕草子15・徒然草7・方丈記9・論語6・孟子7・韓非子6
  assert.deepEqual(counts, [15, 7, 9, 6, 7, 6])
})

test('古文の読みはひらがなで、語句のカードは同じ語の古典単語、文法のカードは古典文法の項目', () => {
  let words = 0
  let grammar = 0
  for (const work of literatureByKind('classical')) {
    for (const sentence of literatureSentences(work)) {
      // 古文の読みは端末の声で読む原稿なので、息継ぎの読点を足している所がある（句読点の並びは比べない）。
      assert.match(sentence.speech, HIRAGANA_READING, `${sentence.id}: 読み`)
      for (const word of sentence.entry.words.filter((item) => item.id)) {
        words += 1
        const card = KOTEN_BY_ID[word.id]
        assert.ok(card, `${sentence.id}: 古典単語 ${word.id} がない`)
        const sameWord = card.kana === word.reading || card.word === word.term || KOTEN_DERIVED[word.term] === card.word
        assert.ok(sameWord, `${sentence.id}: 「${word.term}（${word.reading}）」と古典単語「${card.word}（${card.kana}）」が同じ語でない`)
      }
      for (const item of sentence.entry.grammar.filter((entry) => entry.id)) {
        grammar += 1
        assert.ok(KOTEN_GRAMMAR_BY_ID[item.id], `${sentence.id}: 古典文法 ${item.id} がない`)
      }
    }
  }
  assert.equal(words, 41)
  assert.equal(grammar, 63)
})

test('漢文の書き下し文は訓読文を返り点どおりに読んだ形で、つなぐと作品の書き下し文と一字一句同じ。読みはひらがな', () => {
  for (const work of literatureByKind('kanbun')) {
    const sentences = literatureSentences(work)
    assert.equal(
      sentences.map((sentence) => sentence.entry.kakikudashi).join(''),
      work.scenes.map((scene) => scene.kakikudashi).join(''),
      `${work.id}: 書き下し文`,
    )
    for (const sentence of sentences) {
      const at = sentence.id
      assert.ok(sentence.marked, `${at}: 訓読文`)
      const parsed = parseKanbunMarkedText(sentence.marked)
      assert.deepEqual(parsed.errors, [], `${at}: 訓読文の書き方`)
      const order = kanbunReadingOrder(parsed)
      assert.deepEqual(order.errors, [], `${at}: 返り点どおりに読む順`)
      assert.equal(
        order.order.length,
        parsed.units.filter((unit) => unit.type === 'character').length,
        `${at}: 読む順に入らない字がある`,
      )
      assert.match(sentence.entry.reading, HIRAGANA_READING, `${at}: 読み`)
      assert.equal(punctuation(sentence.entry.reading), punctuation(sentence.entry.kakikudashi), `${at}: 読みの区切りが書き下し文と違う`)
    }
  }
})

test('漢文の語句は本文の字で、カードは同じ字の漢文語彙。句法のカードは漢文の句法の項目', () => {
  let words = 0
  let grammar = 0
  for (const work of literatureByKind('kanbun')) {
    for (const sentence of literatureSentences(work)) {
      for (const word of sentence.entry.words) {
        assert.ok(sentence.text.includes(word.term), `${sentence.id}: 語句「${word.term}」が本文にない`)
        if (!word.id) continue
        words += 1
        const card = KANBUN_VOCAB.get(word.id)
        assert.ok(card, `${sentence.id}: 漢文語彙 ${word.id} がない`)
        const term = [...word.term].map((character) => KANBUN_VARIANTS[character] ?? character).join('')
        assert.equal(card.title, term, `${sentence.id}: 「${word.term}」と漢文語彙「${card.title}」が同じ字でない`)
      }
      for (const item of sentence.entry.grammar.filter((entry) => entry.id)) {
        grammar += 1
        assert.ok(KANBUN_GRAMMAR.get(item.id), `${sentence.id}: 句法 ${item.id} がない`)
      }
    }
  }
  assert.equal(words, 50)
  assert.equal(grammar, 41)
})

test('漢文の朗読の読みは書き下し文と同じ言い方（「あなたの矛」「物として」のような言いかえをしない）', () => {
  // 朗読は漢字まじりの読み。朗読のかなのひと続きが、ひらがなの読みの中に同じ順で、切れずに入っていれば同じ言い方。
  // （漢字の読みまでは比べないので、「鋭き」と「利き（とき）」のような漢字の読みかえは、人が読んで確かめる）
  for (const work of literatureByKind('kanbun')) {
    for (const sentence of literatureSentences(work)) {
      const reading = sentence.entry.reading.replace(/[^ぁ-ゖ]/gu, '')
      let cursor = 0
      for (const run of sentence.speech.match(/[ぁ-ゖ]+/gu) ?? []) {
        const found = reading.indexOf(run, cursor)
        assert.ok(found >= 0, `${sentence.id}: 朗読「${sentence.speech}」の「${run}」が読み「${sentence.entry.reading}」にない`)
        cursor = found + run.length
      }
    }
  }
})

// 書き下し文の振り仮名は、字ごとの辞書だけだと、この文での読みと食い違う（知(ち)れば・止(し)まり・百歩(ひゃく・ほ)・
// 如(ごと)し・隣国(くに)・矛(む)・子(こ)の・応(おう)ふる・利(り)き・此(こ)を・填然(ぜん)・思(し)わざれば・請(せい)う）。
// 文ごとの ruby で、読み（ひらがな）と同じ読みに直す。
test('漢文の書き下し文の振り仮名は、すべての字に付き、この文での読みと食い違わない', () => {
  const expected = {
    lit_zh_lunyu_learning: ['知(し)れば', '殆(あや)ふし'],
    lit_zh_mengzi_fifty_steps: ['填然(てんぜん)', '止(とど)まり', '百歩(ひゃっぽ)', '五十歩(ごじっぽ)', '如(も)し', '此(これ)を', '隣国(りんごく)', '喩(たと)へん'],
    lit_zh_hanfeizi_contradiction: ['矛(ほこ)', '楯(たて)', '子(し)の', '利(と)きこと', '応(こた)ふる', '陥(とほ)す', '鬻(ひさ)ぐ'],
  }
  const shown = (text, ruby) => tokenizeKanbunText(text, ruby).map((segment) => (
    segment.reading ? `${segment.text}(${segment.reading})` : segment.text
  )).join('')
  for (const work of literatureByKind('kanbun')) {
    const sentences = literatureSentences(work)
    for (const sentence of sentences) {
      assert.deepEqual(uncoveredKanbunKanji(sentence.entry.kakikudashi, sentence.entry.ruby ?? []), [], `${sentence.id}: 振り仮名のない字`)
    }
    const all = sentences.map((sentence) => shown(sentence.entry.kakikudashi, sentence.entry.ruby ?? [])).join('')
    for (const piece of expected[work.id]) assert.ok(all.includes(piece), `${work.id}: ${piece}`)
    for (const wrong of ['知(ち)れば', '止(し)まり', '百(ひゃく)歩(ほ)', '如(ごと)し', '隣国(くに)', '矛(む)', '子(こ)の', '応(おう)ふる', '利(り)き', '此(こ)を', '填然(ぜん)']) {
      assert.equal(all.includes(wrong), false, `${work.id}: ${wrong} が残っている`)
    }
    // 区切りごとの読み（朗読の原稿）の振り仮名も、同じ直しを使う。
    const segments = sentences.flatMap((sentence) => sentence.segments.map((segment) => shown(segment.speech, sentence.entry.ruby ?? []))).join('')
    for (const wrong of ['思(し)わざれば', '思(し)いて', '請(せい)う', '百(ひゃく)歩(ほ)', '矛(む)']) {
      assert.equal(segments.includes(wrong), false, `${work.id}: 区切りの読みに ${wrong} が残っている`)
    }
  }
})
