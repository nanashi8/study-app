import test from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'

import { KANBUN_KUNDOKU_EXERCISES } from '../src/data/kanbun-kundoku.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { literatureByKind } from '../src/data/public-domain-literature.js'
import { KanbunMarkedText, KanbunPatternText } from '../src/components/KanbunMarkedText.js'
import {
  kanbunKakikudashiMatch,
  kanbunNotationIssues,
  kanbunPlainText,
  kanbunReadingOrder,
  kanbunTapOrder,
  parseKanbunMarkedText,
} from '../src/lib/kanbun-marks.js'

const EXAMPLES = [...KANBUN_VOCAB, ...KANBUN_GRAMMAR]
const LITERATURE_SCENES = literatureByKind('kanbun').flatMap((work) =>
  work.scenes.map((scene, index) => ({ id: `${work.id}:${index + 1}`, ...scene })))
const ALL_KUNDOKU_TEXTS = [...EXAMPLES, ...KANBUN_KUNDOKU_EXERCISES, ...LITERATURE_SCENES]

function sourceWithout(units, index, replacement) {
  return units.map((unit, position) => {
    if (position !== index) return unit.sourceText
    if (!replacement) return ''
    return `${replacement.character}${replacement.okurigana}${replacement.secondReading ? `〈${replacement.secondReading}〉` : ''}${replacement.marks.join('')}`
  }).join('')
}

test('返り点40題を親字単位へ分解しても原文を一字も変えない', () => {
  assert.equal(KANBUN_KUNDOKU_EXERCISES.length, 40)
  let markedExerciseCount = 0
  let returnMarkCount = 0
  let okuriganaCount = 0
  for (const exercise of KANBUN_KUNDOKU_EXERCISES) {
    const parsed = parseKanbunMarkedText(exercise.marked)
    assert.deepEqual(parsed.errors, [], `${exercise.id}: ${JSON.stringify(parsed.errors)}`)
    assert.equal(
      parsed.units.map((unit) => unit.sourceText).join(''),
      exercise.marked,
      exercise.id,
    )
    assert.ok(parsed.characterCount > 0, exercise.id)
    if (parsed.returnMarkCount > 0) markedExerciseCount += 1
    returnMarkCount += parsed.returnMarkCount
    okuriganaCount += parsed.okuriganaCount
  }
  assert.equal(markedExerciseCount, 39)
  assert.equal(returnMarkCount, 119)
  assert.equal(okuriganaCount, 180)
})

test('返り点は本文の漢字と別の記号なので、「天下」「其一」を点に読み違えない', () => {
  const people = parseKanbunMarkedText('愛㆑人')
  assert.deepEqual(
    people.units.map(({ character, marks }) => [character, [...marks]]),
    [['愛', ['㆑']], ['人', []]],
  )

  const sorrow = parseKanbunMarkedText('先ンジテ㆓天下之憂ヒニ㆒而憂フ。')
  assert.equal(kanbunPlainText(sorrow), '先天下之憂而憂。')
  assert.equal(sorrow.returnMarkCount, 2)

  const halfKnown = parseKanbunMarkedText('但ダ知リテ㆓其ノ一ヲ㆒、不㆑知ラ㆓其ノ二ヲ㆒。')
  assert.equal(kanbunPlainText(halfKnown), '但知其一、不知其二。')
  // 本文の「一」「二」はそのまま残り、閉じの一点はその本文字へ付く。
  assert.deepEqual(
    halfKnown.units.filter((unit) => unit.marks.length).map((unit) => [unit.character, unit.marks.join('')]),
    [['知', '㆓'], ['一', '㆒'], ['不', '㆑'], ['知', '㆓'], ['二', '㆒']],
  )
  assert.equal(kanbunReadingOrder(halfKnown).text, '但其一知其二知不')

  const combined = parseKanbunMarkedText('使ム㆓人ヲシテ読マ㆒㆑書ヲ。')
  assert.deepEqual(
    combined.units.find((unit) => unit.character === '読').marks,
    ['㆒', '㆑'],
  )
})

test('送り仮名と再読文字の二度目の読みは、付いている字と一緒に分解する', () => {
  const parsed = parseKanbunMarkedText('未ダ〈ズ〉㆑見㆓其ノ人ヲ㆒。')
  assert.deepEqual(parsed.errors, [])
  assert.deepEqual(
    parsed.units.map(({ character, okurigana, secondReading, marks }) => [character, okurigana, secondReading, marks.join('')]),
    [['未', 'ダ', 'ズ', '㆑'], ['見', '', '', '㆓'], ['其', 'ノ', '', ''], ['人', 'ヲ', '', '㆒'], ['。', '', '', '']],
  )
  assert.equal(kanbunPlainText(parsed), '未見其人。')
  // 再読文字は、その位置で一度目、返り点で戻ったところで二度目を読む。
  assert.deepEqual(
    kanbunReadingOrder(parsed).steps.map(({ index, kind }) => `${parsed.units[index].character}:${kind}`),
    ['未:first', '其:read', '人:read', '見:read', '未:second', '。:punctuation'],
  )
  // 返り点の後ろに送り仮名を書く、付け先の無い送り仮名を書く、といった崩れた訓読文は誤りとして残す。
  assert.ok(parseKanbunMarkedText('読㆑ム書ヲ').errors.some((error) => error.type === 'okurigana-after-return-mark'))
  assert.ok(parseKanbunMarkedText('、ヲ').errors.some((error) => error.type === 'unattached-okurigana'))
  assert.ok(parseKanbunMarkedText('未ダ〈ず〉㆑見').errors.some((error) => error.type === 'malformed-second-reading'))
})

test('返り点の階層どおりに読む順を組み立てる', () => {
  const cases = [
    ['読㆑書', '書読'],
    ['不㆑可㆑忘㆑恩。', '恩忘可不'],
    ['使㆓人読㆒㆑書', '人書読使'],
    ['毋㆘以㆓小利㆒害㆗大義㆖。', '小利以大義害毋'],
    ['不㆘為㆓児孫㆒買㆗美田㆖。', '児孫為美田買不'],
    ['欲㆚令㆘民読㆓此書㆒而知㆖㆑義、而安㆙㆑国。', '民此書読而義知令而国安欲'],
    ['吾願㆞欲㆚令㆘臣学㆓古礼㆒而知㆖㆑義、安㆙㆑国、以成㆝㆑業', '吾臣古礼学而義知令国安欲以業成願'],
  ]
  for (const [marked, expected] of cases) {
    const reading = kanbunReadingOrder(marked)
    assert.deepEqual(reading.errors, [], `${marked}: ${JSON.stringify(reading.errors)}`)
    assert.equal(reading.text, expected, marked)
  }
})

test('規則から外れた返り点は読む順を作らずに落とす', () => {
  // レ点と二点は同じ字に同居できない（複合できるのは一・上・甲・天のレ点付き）。
  assert.ok(kanbunReadingOrder('使㆓㆑人読書').errors.some((error) => error.type === 'return-mark-conflict'))
  // 二点だけあって一点が無ければ、どこへ返るか決まらない。
  assert.ok(kanbunReadingOrder('学㆓於師').errors.some((error) => error.type === 'unresolved-return-mark'))
  // 文の終わりをまたいで返ることはない。
  assert.ok(kanbunReadingOrder('学㆓於師。㆒').errors.some((error) => error.type === 'unresolved-return-mark'
    || error.type === 'return-across-sentence-end'))
  // 二度目の読みを書いた再読文字に返り点が無ければ、二度目を読む位置が無い。
  assert.ok(kanbunReadingOrder('未ダ〈ズ〉見').errors.some((error) => error.type === 'second-reading-without-return-mark'))
})

test('すぐ下の字を読んだ直後に戻るときは、一二点・上下点ではなくレ点で書く', () => {
  for (const marked of ['為㆓知㆒㆑之', '欲㆘使㆓人読㆒㆑書㆖', '雖㆔有㆓嘉肴㆒']) {
    assert.ok(
      kanbunNotationIssues(marked).some((issue) => issue.type === 'adjacent-return-needs-re-mark'),
      marked,
    )
  }
  for (const marked of ['為㆑知㆑之', '欲㆑使㆓人読㆒㆑書', '不㆑如㆓一見㆒', '有㆘能読㆓古書㆒者㆖', '使㆓人読㆒㆑書']) {
    assert.deepEqual(kanbunNotationIssues(marked), [], marked)
  }
  assert.ok(kanbunNotationIssues('読ム〈ズ〉㆑書').some((issue) => issue.type === 'second-reading-on-non-reread-character'))
})

test('訓読文を返り点どおりに読んで送り仮名をつなぐと、全件が書き下し文と一字残らず一致する', () => {
  let checked = 0
  let okuriganaCount = 0
  let secondReadingCount = 0
  for (const item of ALL_KUNDOKU_TEXTS) {
    const match = kanbunKakikudashiMatch(item.marked, item.kakikudashi)
    assert.ok(
      match.ok,
      `${item.id}: ${item.marked} / ${item.kakikudashi}（${match.reason}: ${match.matched ?? ''}｜${match.unit ?? JSON.stringify(match.errors ?? [])}）`,
    )
    assert.deepEqual(kanbunNotationIssues(item.marked), [], `${item.id}: 返り点の書き方`)
    const parsed = parseKanbunMarkedText(item.marked)
    okuriganaCount += parsed.okuriganaCount
    secondReadingCount += parsed.secondReadingCount
    checked += 1
  }
  assert.equal(checked, 264)
  assert.equal(okuriganaCount, 1138)
  assert.equal(secondReadingCount, 23)
})

test('送り仮名・返り点・二度目の読み・句読点を一つでも抜くと、書き下し文と合わなくなる', () => {
  let mutations = 0
  const survivors = []
  for (const item of ALL_KUNDOKU_TEXTS) {
    const { units } = parseKanbunMarkedText(item.marked)
    units.forEach((unit, index) => {
      const variants = []
      if (unit.okurigana) variants.push({ ...unit, okurigana: '' })
      unit.marks.forEach((_, markIndex) => variants.push({ ...unit, marks: unit.marks.filter((__, j) => j !== markIndex) }))
      if (unit.secondReading) variants.push({ ...unit, secondReading: '' })
      if (unit.type === 'punctuation') variants.push(null)
      for (const variant of variants) {
        mutations += 1
        const marked = sourceWithout(units, index, variant)
        if (kanbunKakikudashiMatch(marked, item.kakikudashi).ok && !kanbunNotationIssues(marked).length) {
          survivors.push(`${item.id}: ${marked}`)
        }
      }
    })
  }
  assert.deepEqual(survivors, [])
  assert.equal(mutations, 2183)
})

test('返り点ドリルの正解のタップ順は、訓読文の読む順と同じ', () => {
  for (const exercise of KANBUN_KUNDOKU_EXERCISES) {
    const labels = Object.fromEntries(exercise.tokens.map((token) => [token.id, token.label.replace(/[①②]/gu, '')]))
    assert.equal(
      exercise.order.map((id) => labels[id]).join(''),
      kanbunTapOrder(exercise.marked).text,
      `${exercise.id}: ${exercise.marked}`,
    )
  }
})

test('訓読文の表示は親字と送り仮名・返り点を同じDOM単位に入れ、支援技術にも読みと点名を渡す', () => {
  const html = renderToStaticMarkup(KanbunMarkedText({
    marked: '使ム㆓人ヲシテ読マ㆒㆑書ヲ。',
    inverse: true,
  }))
  assert.match(html, /data-kanbun-mark-status="complete"/)
  assert.match(html, /data-kanbun-character-unit="読"/)
  assert.match(html, /data-kanbun-okurigana="ヲシテ"/)
  assert.match(html, /data-kanbun-return-marks="一レ"/)
  assert.match(html, /aria-label="読マに一点・レ点"/)
  // レ点は字の下でなく次の字との境目に置き、フォントに頼らない図で描く。一・二などは字の下のまま。
  assert.match(html, /data-kanbun-return-marks="一レ" data-kanbun-return-mark-place="between"/)
  assert.match(html, /data-kanbun-return-marks="二" data-kanbun-return-mark-place="below"/)
  assert.equal((html.match(/data-kanbun-re-mark-shape/g) ?? []).length, 1)
  assert.doesNotMatch(html.replace(/aria-label="[^"]*"|data-kanbun-[a-z-]+="[^"]*"/g, ''), /レ/)
  assert.match(html, /字の右は送り仮名、字の下は返り点です。/)
  assert.doesNotMatch(html, /再読文字/)

  const reread = renderToStaticMarkup(KanbunMarkedText({ marked: '未ダ〈ズ〉㆑見㆓其ノ人ヲ㆒。' }))
  assert.match(reread, /data-kanbun-second-reading="ズ"/)
  assert.match(reread, /aria-label="未ダに二度目の読みズ・レ点"/)
  assert.match(reread, /青い仮名は再読文字の二度目の読みです。/)
})

test('句法の「形」は返り点を記号で添えて出し、本文の「二」「一」と混ぜない', () => {
  const html = renderToStaticMarkup(KanbunPatternText({ pattern: 'A為㆓B所㆒㆑V' }))
  assert.match(html, /data-kanbun-pattern-unit="為"/)
  assert.match(html, /data-kanbun-pattern-marks="二"/)
  assert.match(html, /data-kanbun-pattern-marks="一レ"/)
  assert.match(html, /（一点・レ点）/)
  // 形の書き方も、読む順を組み立てられること（旧：「A見レV於B」は一二点が無く読めなかった）。
  for (const item of KANBUN_GRAMMAR) {
    assert.deepEqual(kanbunReadingOrder(item.pattern).errors, [], `${item.id}: ${item.pattern}`)
  }
  const passive = KANBUN_GRAMMAR.find((item) => item.id === 'kgw043')
  assert.equal(kanbunReadingOrder(passive.pattern).text, 'A於BV見')
})
