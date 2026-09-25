// 例文が、カードで学ぶ意味で使われているか（requests/2026-09-25-example-learned-sense.json）の回帰テスト。
// preliminary「予備の・準備の」の例文が These are preliminary results.／「これらは暫定の結果だ。」で、
// カードにない「暫定の」の例文に見えていた。
import assert from 'node:assert/strict'
import test from 'node:test'
import { getWord } from '../src/data/vocab.js'
import { getPhrase } from '../src/data/phrases.js'
import { PASSAGES } from '../src/data/passages.js'
import { WORD_RELATION_NOTES } from '../src/data/word-relation-notes.js'
import {
  exampleSenseCandidates,
  exampleSenseGap,
  exampleSenseItems,
  glossShownIn,
  reviewEntryProblem,
} from '../scripts/checks/example-learned-sense.mjs'

test('preliminary の例文は「予備の・準備の」の意味で使い、古い例文を引く説明も残さない', () => {
  const word = getWord('preliminary')
  assert.equal(word.meaning, '予備の・準備の')
  assert.notEqual(word.example.en, 'These are preliminary results.')
  assert.match(word.example.en, /\bpreliminary\b/)
  assert.match(word.example.ja, /予備|準備/)
  assert.doesNotMatch(word.example.ja, /暫定/)
  assert.doesNotMatch(WORD_RELATION_NOTES['initial|preliminary'], /preliminary results/)
})

test('和訳に意味の訳語がない例文は、全件を読んで書き直したか「和訳の語=意味の訳語」を台帳に残してある', () => {
  const gap = exampleSenseGap()
  // 見出し語・ほかの意味・熟語・構文の例文すべて（2026-09-25 に 11,146件）。
  assert.ok(gap.items >= 11146, `例文の数が減っている: ${gap.items}`)
  assert.ok(gap.candidates > 0)
  assert.deepEqual(gap.undecided, [], '読んでいない例文')
  assert.deepEqual(gap.stale, [], '候補でなくなった台帳の行')
  assert.deepEqual(gap.wrong, [], '和訳や意味と合わない台帳の行')
  const kinds = new Set(exampleSenseItems().map((item) => item.key.split(':')[0]))
  assert.deepEqual([...kinds].sort(), ['phrase', 'sense', 'word'])
})

test('訳語が和訳に出ているかは、活用・漢字のかたまり・かなの動詞の活用まで見て、別の意味の訳は通さない', () => {
  assert.equal(glossShownIn('予備の', 'これらは暫定の結果だ。'), false)
  assert.equal(glossShownIn('予備の', '本調査の前に、私たちは10人の生徒で予備調査を行った。'), true)
  assert.equal(glossShownIn('疲れた', '旅行のあとで疲れている。'), true)
  assert.equal(glossShownIn('気前のよい', '彼女は誰にでも気前がよい。'), true)
  assert.equal(glossShownIn('みなす', '私は彼を友人とみなしている。'), true)
  assert.equal(glossShownIn('見る', '彼は見物に行った。'), false)
  assert.equal(glossShownIn('…すぎて〜できない', '外を歩くには暑すぎる。'), false)
  assert.equal(glossShownIn('…すぎて〜できない', '暑すぎて外を歩くことができない。'), true)
})

test('見出し語や例文を足し・変えたら、読むまで通らない', () => {
  const item = { key: 'word:preliminary', glosses: ['予備の', '準備の'], example: { en: 'These are preliminary results.', ja: 'これらは暫定の結果だ。' } }
  assert.deepEqual(exampleSenseCandidates([item]).map((candidate) => candidate.key), ['word:preliminary'])
  // 台帳の行は、和訳にその語があり、右側がカードの意味の訳語でなければ通らない
  // （その語がその意味を訳しているかどうかは人が読んで決める）。
  assert.equal(reviewEntryProblem(item, '暫定の結果=予備'), '「予備」がカードの意味にない')
  assert.equal(reviewEntryProblem(item, '予備調査=予備の'), '和訳に「予備調査」がない')
  assert.match(reviewEntryProblem(item, '暫定'), /形になっていない/)
})

test('別の意味で使っていた例文は、学ぶ意味の例文へ書き直してある', () => {
  // 英文が別の意味だった例（チャンネル登録・見当もつかない・あいさつ・熟練者の意味など）
  assert.match(getWord('subscribe').example.ja, /定期購読/)
  assert.match(getWord('notion').example.ja, /概念/)
  assert.match(getWord('morning').example.ja, /朝/)
  assert.match(getWord('evening').example.ja, /夕方/)
  assert.match(getWord('master').example.ja, /主人/)
  assert.match(getWord('cook').example.ja, /料理人/)
  // 和訳の言い換えで別の意味に見えていた例（評価された→功績、融通がきく→柔軟）
  assert.match(getWord('credit').example.ja, /功績/)
  assert.match(getWord('flexible').example.ja, /柔軟/)
  // 構文は、学ぶ訳し方の形で訳す。
  assert.match(getPhrase('syn_too_to').example.ja, /すぎて.*できない/)
})

test('長文辞書語の例文は長文の本文を書き換えず、その語の定義に例文を書く', () => {
  const farm = getWord('farm')
  assert.match(farm.example.en, /\bfarm\b/)
  assert.match(farm.example.ja, /農場/)
  // 長文の本文（farming tips の文）はそのまま残る。
  const passageSentences = PASSAGES.flatMap((passage) => passage.sentences.map((sentence) => sentence.en))
  assert.ok(passageSentences.some((sentence) => sentence.includes('many useful farming tips')))
})
