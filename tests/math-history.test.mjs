// 数学の歴史をたどるコース：話のデータ・史実の記録・動かす図・テスト・画面の配線・保存。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import {
  MATH_BASICS,
  MATH_HISTORY_CHAPTERS,
  MATH_HISTORY_PARTS,
  MATH_HISTORY_QUESTIONS,
  MATH_HISTORY_QUIZ_DOMAIN,
  chapterNeighbors,
  chaptersByEra,
  chaptersByYear,
  chaptersForUnit,
  mathHistoryThemeColor,
  questionsForChapters,
} from '../src/data/math-history.js'
import { toKanjiNumeral, toRomanNumeral } from '../src/data/math-history/controls.js'
import { MATH_UNITS } from '../src/data/math.js'
import { checkChapters, checkFacts } from '../scripts/checks/math-history.mjs'
import { contrastRatio, readableMathAccent } from '../src/lib/mathVisualColors.js'
import {
  appendMathStoryLog,
  nextMathStory,
  normalizeMathStoryLog,
  understoodMathStories,
} from '../src/lib/mathStoryLog.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { PROGRESS_RESET_GROUPS } from '../src/lib/progressReset.js'

const require = createRequire(import.meta.url)
const { kanji: JOYO_KANJI } = require('joyo-kanji')
const JOYO = new Set(JOYO_KANJI)
const read = (relative) => readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8')

const valueSetsFor = (controls) => controls.reduce((sets, control) => {
  const choices = control.type === 'range'
    ? Array.from(
      { length: Math.round((control.max - control.min) / control.step) + 1 },
      (_, index) => Number((control.min + index * control.step).toFixed(10)),
    )
    : control.options.map((option) => option.value)
  return sets.flatMap((values) => choices.map((choice) => ({ ...values, [control.id]: choice })))
}, [{}])

let vite
let MathHistoryVisual
let MATH_HISTORY_SCENES

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  const visualModule = await vite.ssrLoadModule('/src/components/MathHistoryVisual.jsx')
  MathHistoryVisual = visualModule.MathHistoryVisual
  MATH_HISTORY_SCENES = visualModule.MATH_HISTORY_SCENES
})

after(async () => {
  await vite?.close()
})

const render = (chapterId, values) => {
  const chapter = MATH_HISTORY_CHAPTERS.find((item) => item.id === chapterId)
  return renderToStaticMarkup(React.createElement(MathHistoryVisual, {
    visual: chapter.visual,
    values: { ...Object.fromEntries(chapter.visual.controls.map((control) => [control.id, control.initial])), ...values },
    color: readableMathAccent(mathHistoryThemeColor(chapter.theme)),
    label: `${chapter.title}の図`,
  }))
}

test('全話が、年代・場所・問い・筋道・動かす図・今の使われ方・つながる学習・テストをそろえる', () => {
  assert.deepEqual(checkChapters(), [])
  assert.ok(MATH_HISTORY_CHAPTERS.length > 0)
  // 学ぶ順の最初は「数える」。
  assert.equal(MATH_HISTORY_CHAPTERS[0].id, 'mh-counting')
  assert.deepEqual(MATH_HISTORY_PARTS.map((part) => part.id), ['basic', 'junior', 'senior'])
  assert.equal(MATH_BASICS.length, 33)
  assert.equal(new Set(MATH_BASICS.map((basic) => basic.id)).size, 33)
})

test('話に書いた史実は、1件ずつ確かめた記録と本文が一致する（伝説・異説は言い回しで書き分ける）', () => {
  assert.deepEqual(checkFacts(), [])
})

test('動かす図は、全話・全操作値の組み合わせで SVG として描け、文字と線の色が読める', () => {
  for (const chapter of MATH_HISTORY_CHAPTERS) {
    assert.ok(MATH_HISTORY_SCENES[chapter.visual.scene], `${chapter.id}: 図 ${chapter.visual.scene}`)
    const color = readableMathAccent(mathHistoryThemeColor(chapter.theme))
    assert.ok(contrastRatio(color, '#ffffff') >= 4.5, `${chapter.id}: 読める色`)
    for (const values of valueSetsFor(chapter.visual.controls)) {
      const label = `${chapter.id} ${JSON.stringify(values)}`
      const markup = renderToStaticMarkup(React.createElement(MathHistoryVisual, {
        visual: chapter.visual,
        values,
        color,
        label: `${chapter.title}の図`,
      }))
      assert.match(markup, /^<svg /, `${label}: svg`)
      assert.match(markup, /role="img"/, `${label}: 読み上げ名`)
      assert.doesNotMatch(markup, /NaN|undefined|Infinity/, `${label}: 数が壊れていない`)
      for (const match of markup.matchAll(/<text\b[^>]*\bfill="(#[0-9a-f]{6})"[^>]*>/gi)) {
        assert.ok(contrastRatio(match[1], '#ffffff') >= 4.5, `${label}: 文字の色 ${match[1]}`)
      }
      for (const match of markup.matchAll(/\bstroke="(#[0-9a-f]{6})"/gi)) {
        const stroke = match[1].toLowerCase()
        if (['#ffffff', '#e7e5f3'].includes(stroke)) continue
        assert.ok(contrastRatio(stroke, '#ffffff') >= 3, `${label}: 線の色 ${stroke}`)
      }
      const formula = chapter.visual.formula(values)
      const insight = chapter.visual.insight(values)
      assert.doesNotMatch(formula, /NaN|undefined|Infinity|\+-/, `${label}: 式`)
      assert.doesNotMatch(insight, /NaN|undefined|Infinity/, `${label}: 気づき`)
    }
  }
})

test('図の数は操作値と数学的に一致する（数える・位取り・ゼロ）', () => {
  // 17 は 5・5・5・2 のまとまり。
  const tally = render('mh-counting', { n: 17 })
  assert.deepEqual([...tally.matchAll(/data-tally-size="(\d)"/g)].map((match) => Number(match[1])), [5, 5, 5, 2])
  assert.match(tally, /5のまとまり 3つ ＋ 2  ＝  17/)
  const counting = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-counting')
  assert.equal(counting.visual.formula({ n: 20 }), '20=5\\times4')
  assert.equal(counting.visual.formula({ n: 3 }), '3')

  // 位取り：ブロックの数・3つの書き方。
  const place = render('mh-place-value', { h: 3, t: 0, o: 5 })
  assert.equal((place.match(/data-place-block="100"/g) ?? []).length, 3)
  assert.equal((place.match(/data-place-block="10"/g) ?? []).length, 0)
  assert.equal((place.match(/data-place-block="1"/g) ?? []).length, 5)
  assert.match(place, />305</)
  assert.match(place, />三百五</)
  assert.match(place, />CCCV</)
  assert.match(render('mh-place-value', { h: 0, t: 0, o: 0 }), /0を表す記号がない/)
  const expected = [[4, 'IV', '四'], [9, 'IX', '九'], [14, 'XIV', '十四'], [40, 'XL', '四十'], [90, 'XC', '九十'],
    [400, 'CD', '四百'], [444, 'CDXLIV', '四百四十四'], [999, 'CMXCIX', '九百九十九'], [2026, 'MMXXVI', '二千二十六'], [110, 'CX', '百十']]
  for (const [value, roman, kanji] of expected) {
    assert.equal(toRomanNumeral(value), roman, `${value} のローマ数字`)
    assert.equal(toKanjiNumeral(value), kanji, `${value} の漢数字`)
  }

  // ゼロ：わる計算は答えを出さない。
  const divide = render('mh-zero', { op: 'divide', a: 6 })
  assert.equal((divide.match(/data-zero-try=/g) ?? []).length, 5)
  assert.match(divide, /6 ÷ 0 の答えは決められない/)
  const zero = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-zero')
  assert.equal(zero.visual.formula({ op: 'multiply', a: 7 }), '7\\times0=0')
  assert.equal(zero.visual.formula({ op: 'add', a: 7 }), '7+0=7')
})

test('テストの全問で、正解は1つ・選択肢3つに説明があり、画面は毎回並びを入れかえて全選択肢の説明を出す', () => {
  const ids = MATH_HISTORY_QUESTIONS.map((question) => question.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const question of MATH_HISTORY_QUESTIONS) {
    assert.equal(question.choices.length, 3, question.id)
    assert.equal(question.notes.length, 3, question.id)
    assert.ok(question.notes[question.answer].startsWith('正解'), `${question.id}: 正解の説明は「正解」から始める`)
    question.notes.forEach((note, index) => {
      if (index !== question.answer) assert.ok(!note.startsWith('正解'), `${question.id}: 誤答の説明が「正解」で始まる`)
    })
    assert.ok(MATH_HISTORY_CHAPTERS.some((chapter) => chapter.id === question.chapterId), question.id)
  }
  const quiz = read('src/screens/MathStoryQuiz.jsx')
  assert.match(quiz, /choiceOrders\.current\[question\.id\] = shuffledOrder\(question\.choices\.length\)/)
  assert.match(quiz, /rows=\{order\.map\(\(choiceIndex\) => \(\{/)
  assert.match(quiz, /body: question\.notes\[choiceIndex\]/)
  assert.match(quiz, /recordQuizResult\(MATH_HISTORY_QUIZ_DOMAIN, question\.id, result === 'correct' \? 1 : 0, 1\)/)
  assert.match(quiz, /rankQuestionsForStudy\(questionsForChapters\(ids\), \{/)
  assert.equal(MATH_HISTORY_QUIZ_DOMAIN, 'math-history')
  // 話1つのテストは、その話の問題だけを出す。
  const first = MATH_HISTORY_CHAPTERS[0]
  assert.deepEqual(questionsForChapters([first.id]).map((question) => question.id), first.quiz.map((question) => question.id))
})

test('目次は学ぶ順と年代順で同じ話を並べ、前後の話・単元からの話が引ける', () => {
  const byYear = chaptersByYear()
  assert.equal(byYear.length, MATH_HISTORY_CHAPTERS.length)
  for (let index = 1; index < byYear.length; index += 1) assert.ok(byYear[index - 1].year <= byYear[index].year)
  assert.equal(chaptersByEra().flatMap((group) => group.chapters).length, MATH_HISTORY_CHAPTERS.length)
  const { previous, next } = chapterNeighbors(MATH_HISTORY_CHAPTERS[1].id)
  assert.equal(previous.id, MATH_HISTORY_CHAPTERS[0].id)
  assert.equal(next?.id ?? null, MATH_HISTORY_CHAPTERS[2]?.id ?? null)
  for (const chapter of MATH_HISTORY_CHAPTERS) {
    for (const unitId of chapter.units) {
      assert.ok(MATH_UNITS.some((unit) => unit.id === unitId), `${chapter.id}: ${unitId}`)
      assert.ok(chaptersForUnit(unitId).includes(chapter), `${unitId} から ${chapter.id} が引けない`)
    }
  }
})

test('学習の記録（理解した／まだまだ）は1日1件で残り、続きの話と全教材の一覧の「学習済み」に使う', () => {
  let log = appendMathStoryLog({}, 'mh-zero', 'notYet', 100)
  log = appendMathStoryLog(log, 'mh-zero', 'understood', 100)
  assert.deepEqual(log['mh-zero'], [{ day: 100, result: 'understood' }])
  log = appendMathStoryLog(log, 'mh-counting', 'notYet', 101)
  assert.deepEqual(understoodMathStories(log), ['mh-zero'])
  // 話のIDでないもの・結果の名前が違うものは捨てる。
  assert.deepEqual(appendMathStoryLog(log, 'gref_5_be', 'understood', 102), log)
  assert.deepEqual(normalizeMathStoryLog({ 'mh-zero': [{ day: 3, result: 'understood' }, { day: 3, result: 'notYet' }], bad: [] }), {
    'mh-zero': [{ day: 3, result: 'notYet' }],
  })
  const chapters = [{ id: 'mh-a' }, { id: 'mh-b' }, { id: 'mh-c' }]
  assert.equal(nextMathStory(chapters, {}).id, 'mh-a')
  assert.equal(nextMathStory(chapters, { 'mh-b': [{ day: 5, result: 'notYet' }] }).id, 'mh-c')
  assert.equal(nextMathStory(chapters, { 'mh-c': [{ day: 5, result: 'understood' }] }).id, 'mh-a')
})

test('学習の記録は端末保存・進捗コード・クラウド・記録のリセットに乗る', () => {
  assert.ok(PERSISTED_PROGRESS_FIELDS.includes('mathStoryLog'))
  const completion = PROGRESS_RESET_GROUPS.find((group) => group.id === 'completion')
  assert.ok(completion.fields.includes('mathStoryLog'))
  assert.match(read('src/store/useStore.js'), /mathStoryLog: normalizeMathStoryLog\(payload\.mathStoryLog\)/)
  assert.match(read('src/store/useStore.js'), /mathStoryLog: appendMathStoryLog\(st\.mathStoryLog, pageId, result, today\(\)\)/)
  assert.match(read('src/lib/cloudSync.js'), /mathStoryLog: normalizeMathStoryLog\(data\.mathStoryLog \?\? current\.mathStoryLog\)/)
  assert.match(read('src/lib/progressCode.js'), /'grammarReferenceLog',\n\s*'mathStoryLog',\n\s*'contentQuizResults',/)
})

test('数学マップ・単元の導入・ポータルから、コースと話へ行き来できる', () => {
  const app = read('src/App.jsx')
  for (const screen of ['mathHistory', 'mathStory', 'mathStoryQuiz']) {
    assert.match(app, new RegExp(`\\b${screen}: `), `${screen} が画面一覧にない`)
    assert.match(read('src/lib/appHome.js'), new RegExp(`'${screen}'`), `${screen} が数学アプリに属していない`)
  }
  assert.match(read('src/lib/navigationPolicy.js'), /'mathStoryQuiz',/)
  assert.match(read('src/screens/MathMap.jsx'), /onClick=\{\(\) => navigate\('mathHistory'\)\}/)
  assert.match(read('src/screens/MathIntro.jsx'), /navigate\('mathStory', \{ chapterId: chapter\.id \}\)/)
  assert.match(read('src/screens/MathStory.jsx'), /navigate\('mathIntro', \{ unitId: unit\.id \}\)/)
  assert.match(read('src/screens/MathStory.jsx'), /<StudySelfCheck/)
  assert.match(read('src/screens/MathHistory.jsx'), /<LearningEntryCard/)
  assert.match(read('src/data/contents.js'), /数えることから数IIIまで/)
})

test('話・図・テストの日本語は、常用漢字の外の字に読みを添える', () => {
  const texts = []
  for (const chapter of MATH_HISTORY_CHAPTERS) {
    texts.push(chapter.title, chapter.headline, chapter.era, chapter.place, ...chapter.people, chapter.question, ...chapter.story)
    texts.push(chapter.visual.instruction, ...chapter.visual.controls.map((control) => control.label))
    for (const control of chapter.visual.controls) {
      if (control.options) texts.push(...control.options.map((option) => option.label))
    }
    for (const values of valueSetsFor(chapter.visual.controls)) texts.push(chapter.visual.insight(values))
    texts.push(...chapter.uses.flatMap((use) => [use.title, use.text]))
    texts.push(...chapter.quiz.flatMap((question) => [question.question, ...question.choices, question.explanation, ...question.notes]))
  }
  for (const basic of MATH_BASICS) texts.push(basic.title)
  const unreadable = []
  for (const text of texts) {
    for (const match of text.matchAll(/[\p{Script=Han}々]+/gu)) {
      if ([...match[0]].every((char) => char === '々' || JOYO.has(char))) continue
      const after = text.slice(match.index + match[0].length, match.index + match[0].length + 2)
      if (!/^（[ぁ-ゖ]/u.test(after)) unreadable.push(`${match[0]}（${text.slice(0, 30)}…）`)
    }
  }
  assert.deepEqual([...new Set(unreadable)], [])
})
