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
import { checkBasics, checkChapters, checkFacts, checkUnits } from '../scripts/checks/math-history.mjs'
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

test('図の数は操作値と数学的に一致する（中学：負の数・方程式・座標・球・連立・速さ・地球・球面・合同）', () => {
  const count = (markup, pattern) => (markup.match(pattern) ?? []).length
  // 負の数：+3 と -5 は3組が打ち消し合い、黒が2本残る。
  const rods = render('mh-negative', { a: 3, b: -5 })
  assert.equal(count(rods, /data-rod-row="a" data-rod-sign="pos"/g), 3)
  assert.equal(count(rods, /data-rod-row="b" data-rod-sign="neg"/g), 5)
  assert.equal(count(rods, /data-rod-pair=/g), 3)
  assert.equal(count(rods, /data-rod-row="sum" data-rod-sign="neg"/g), 2)
  assert.equal(count(render('mh-negative', { a: 2, b: 4 }), /data-rod-pair=/g), 0)
  assert.match(render('mh-negative', { a: 4, b: -4 }), /算木なし（0）/)

  // 一次方程式：2x-3=x+5 → x=8。確かめで両辺が13。
  const moved = render('mh-equation', { c: 3, d: 5, step: 2 })
  assert.match(moved, /data-pan="right" data-pan-boxes="0" data-pan-units="8"/)
  assert.match(moved, /data-pan="left" data-pan-boxes="1"/)
  const checked = render('mh-equation', { c: 3, d: 5, step: 3 })
  assert.match(checked, /2×8 − 3 ＝ 13/)
  assert.match(checked, /8 ＋ 5 ＝ 13/)
  const equation = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-equation')
  for (let c = 1; c <= 5; c += 1) {
    for (let d = 1; d <= 9; d += 1) assert.match(equation.visual.insight({ c, d, step: 3 }), new RegExp(`左も右も${c + 2 * d}`))
  }

  // 座標：式を満たす点。
  assert.match(render('mh-coordinates', { curve: 'parabola', x: -1.5 }), /data-point-x="-1.5" data-point-y="2.25"/)
  assert.match(render('mh-coordinates', { curve: 'line', x: 2.5 }), /data-point-y="5"/)
  assert.match(render('mh-coordinates', { curve: 'circle', x: 0 }), /data-point-y="3"/)

  // 球：高さ h の切り口は、半球も「円柱−円すい」も π(25−h²)。
  for (const h of [0, 1.5, 3, 4.5, 5]) {
    const markup = render('mh-sphere', { h })
    const area = String(Number((25 - h * h).toFixed(2)))
    assert.match(markup, new RegExp(`data-slice-disk="${area}"`), `h=${h}`)
    assert.match(markup, new RegExp(`data-slice-ring="${area}"`), `h=${h}`)
  }

  // つるかめ算：頭10・足32 はかめ6匹。
  const tsurukame = render('mh-simultaneous', { legs: 32, t: 6 })
  assert.match(tsurukame, /data-legs-now="32"/)
  assert.equal(count(tsurukame, /data-animal="turtle"/g), 6)
  assert.equal(count(tsurukame, /data-animal="crane"/g), 4)
  assert.match(tsurukame, /目標の32本とぴったり/)
  const simultaneous = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-simultaneous')
  for (const legs of [24, 28, 32, 36]) {
    const turtles = (legs - 20) / 2
    assert.match(simultaneous.visual.insight({ legs, t: turtles }), /これが答え/)
  }

  // 速さのグラフ：台形の面積＝真ん中の速さ×時間。
  const oresme = render('mh-linear-graph', { v0: 1, a: 2, t: 4 })
  assert.match(oresme, /data-oresme-area="20"/)
  assert.match(oresme, /data-oresme-mean="5"/)

  // 地球：7.2度・800km → 一周 40000km。
  assert.match(render('mh-earth', { theta: 7.2, d: 800 }), /data-earth-circumference="40000"/)
  assert.match(render('mh-earth', { theta: 9, d: 900 }), /data-earth-circumference="36000"/)

  // 球面の三角形：90+90+λ。
  assert.match(render('mh-non-euclid', { lambda: 60 }), /data-angle-sum="240"/)
  assert.match(render('mh-non-euclid', { lambda: 180 }), /data-angle-sum="360"/)

  // 合同：3つの合同条件は1つに決まり、2辺と間でない角は2つ、3つの角は大きさが決まらない。
  for (const condition of ['sss', 'sas', 'asa']) {
    assert.match(render('mh-proof', { condition }), /data-congruence-unique="yes" data-congruence-count="1"/, condition)
  }
  assert.match(render('mh-proof', { condition: 'ssa' }), /data-congruence-unique="no" data-congruence-count="2"/)
  assert.match(render('mh-proof', { condition: 'aaa' }), /data-congruence-unique="no" data-congruence-count="2"/)
})

test('図の数は操作値と数学的に一致する（中学：確率・箱ひげ図・平方完成・√2・ヘロン・y＝ax²・相似・円周角・三平方・標本調査）', () => {
  const count = (markup, pattern) => (markup.match(pattern) ?? []).length
  // 分配問題：A があと a 勝、B があと b 勝。並び方 2^(a+b-1) 通りを数える（パスカルの例 2勝・3勝は 11：5）。
  for (const [a, b, wa, wb] of [[1, 2, 3, 1], [2, 3, 11, 5], [3, 3, 16, 16], [1, 1, 1, 1], [3, 1, 1, 7]]) {
    const markup = render('mh-probability', { a, b })
    assert.match(markup, new RegExp(`data-points-a="${wa}" data-points-b="${wb}"`), `${a}-${b}`)
    assert.equal(count(markup, /data-points-cell=/g), 2 ** (a + b - 1))
  }
  const probability = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-probability')
  assert.equal(probability.visual.formula({ a: 2, b: 3 }), '2^{4}=16\\ \\text{通り}\\qquad A:B=11:5')

  // 箱ひげ図：11人の5つの数（中央値を除いた前半・後半の中央値）と平均。
  assert.match(render('mh-boxplot', { v: 90 }), /data-box-five="45,56,67,78,90"/)
  const low = render('mh-boxplot', { v: 0 })
  assert.match(low, /data-box-five="0,52,63,72,84"/)
  assert.match(low, /data-box-mean="58.8"/)

  // 平方完成：x²+10x=39 は (x+5)²=64 で x=3。整数にならないときは近い値。
  assert.match(render('mh-square-completion', { b: 10, c: 39, step: 2 }), /data-complete-total="64" data-complete-x="3"/)
  assert.match(render('mh-square-completion', { b: 6, c: 16, step: 1 }), /data-complete-corner="filled"/)
  assert.match(render('mh-square-completion', { b: 6, c: 16, step: 0 }), /data-complete-corner="missing"/)
  assert.match(render('mh-square-completion', { b: 10, c: 5, step: 2 }), /data-complete-total="30" data-complete-x="0.477"/)
  const square = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-square-completion')
  for (let b = 2; b <= 10; b += 2) {
    for (let c = 5; c <= 40; c += 1) {
      const text = square.visual.insight({ b, c, step: 2 })
      const x = Math.sqrt(c + (b / 2) ** 2) - b / 2
      if (Number.isInteger(x)) assert.match(text, new RegExp(`＝${x * x + b * x}。$`), `${b} ${c}`)
    }
  }

  // √2 に近い分数：p² と 2q² の差は0にならない。
  for (let q = 1; q <= 12; q += 1) {
    const p = Math.round(q * Math.SQRT2)
    const markup = render('mh-irrational', { q })
    assert.match(markup, new RegExp(`data-sqrt-p="${p}" data-sqrt-gap="${Math.abs(p * p - 2 * q * q)}"`))
    assert.notEqual(p * p, 2 * q * q)
  }

  // ヘロンの方法：横 2 から 4 回で √2 に近づく。
  assert.match(render('mh-sqrt-method', { a: 2, n: 3 }), /data-heron-x="1.41421569"/)
  assert.match(render('mh-sqrt-method', { a: 10, n: 4 }), /data-heron-x="3.16245562"/)

  // y＝ax²：3目もりで a×9。
  assert.match(render('mh-galileo', { a: 2, t: 3 }), /data-galileo-y="18"/)
  const galileo = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-galileo')
  assert.match(galileo.visual.insight({ a: 1, t: 4 }), /1・3・5・7/)

  // 相似：太陽の高さが変わっても、求めた高さはいつも146m。
  for (const sun of [1, 1.5, 2]) {
    for (const stick of [1, 1.5, 2]) {
      assert.match(render('mh-similar', { sun, stick }), new RegExp(`data-shadow-height="146" data-shadow-length="${146 * sun}"`))
    }
  }

  // 円周角：中心角の半分。直径なら90度。
  assert.match(render('mh-thales', { central: 180, p: 3 }), /data-inscribed="90"/)
  assert.match(render('mh-thales', { central: 100, p: 7 }), /data-inscribed="50"/)

  // 三平方：a²＋b²。
  assert.match(render('mh-pythagoras', { a: 3, b: 4, view: 'squares' }), /data-pyth-sum="25" data-pyth-view="squares"/)
  assert.match(render('mh-pythagoras', { a: 6, b: 8, view: 'proof' }), /data-pyth-sum="100" data-pyth-view="proof"/)
  const pythagoras = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-pythagoras')
  assert.equal(pythagoras.visual.formula({ a: 6, b: 8 }), '6^2+8^2=36+64=100\\ \\to\\ c=10')

  // 標本調査：見積もり＝印をつけた数×とった数÷印のある数。印が0匹なら見積もれない。
  for (const n of [10, 40, 100, 200]) {
    for (let s = 1; s <= 10; s += 1) {
      const markup = render('mh-sampling', { n, s })
      const picked = Number(markup.match(/data-recapture-m="(\d+)"/)[1])
      const estimate = markup.match(/data-recapture-estimate="(\w+)"/)[1]
      assert.equal(estimate, picked ? String(Math.round((80 * n) / picked)) : 'none', `${n}匹・${s}回目`)
      assert.equal(count(markup, /r="4" fill="none" stroke="#312e81"/g), n)
    }
  }
})

test('図の数は操作値と数学的に一致する（高校：集合・三角比・相関・組合せ・互除法・複素数・対数・e）', () => {
  // 集合：1〜20 の2の倍数A・3の倍数B。
  assert.match(render('mh-sets', { op: 'and', n: 20 }), /data-venn-count="3"/)
  assert.match(render('mh-sets', { op: 'or', n: 20 }), /data-venn-count="13"/)
  assert.match(render('mh-sets', { op: 'notA', n: 20 }), /data-venn-count="10"/)
  assert.match(render('mh-sets', { op: 'notAnd', n: 30 }), /data-venn-count="25"/)
  const sets = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-sets')
  assert.equal(sets.visual.formula({ op: 'or', n: 20 }), 'n(A\\cup B)=n(A)+n(B)-n(A\\cap B)=10+6-3=13')

  // 三角比：h＝d tanθ。45°なら距離と同じ。
  assert.match(render('mh-trig', { d: 30, theta: 45 }), /data-trig-height="30"/)
  assert.match(render('mh-trig', { d: 20, theta: 60 }), /data-trig-height="34.6"/)

  // 相関係数：4つの例のデータの r。
  const expected = { height: '0.58', ice: '0.95', heating: '-0.92', birthday: '-0.07' }
  for (const [data, r] of Object.entries(expected)) {
    assert.match(render('mh-correlation', { data, view: 'mean' }), new RegExp(`data-correlation-r="${r}"`), data)
  }

  // パスカルの三角形：nCr と、上の2つの和。
  assert.match(render('mh-pascal', { n: 10, r: 5 }), /data-pascal-value="252"/)
  assert.match(render('mh-pascal', { n: 4, r: 2 }), /data-pascal-value="6"/)
  assert.match(render('mh-pascal', { n: 3, r: 5 }), /data-pascal-value="0"/)
  const pascal = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-pascal')
  assert.match(pascal.visual.insight({ n: 6, r: 2 }), /15通り。上の段の 5 と 10 をたした数/)

  // 互除法：最大公約数と、切り取った正方形の数（商の合計）。
  assert.match(render('mh-cipher', { pair: '42-30', step: 6 }), /data-euclid-gcd="6" data-euclid-squares="5"/)
  assert.match(render('mh-cipher', { pair: '21-13', step: 6 }), /data-euclid-gcd="1" data-euclid-squares="7"/)
  assert.match(render('mh-cipher', { pair: '24-18', step: 1 }), /data-euclid-squares="1"/)

  // 複素数：(a+bi)×i＝−b＋ai、×(1＋i)＝(a−b)＋(a＋b)i。
  assert.match(render('mh-complex', { a: 3, b: 2, times: 'i' }), /data-complex-result="-2,3"/)
  assert.match(render('mh-complex', { a: 2, b: 1, times: 'minus' }), /data-complex-result="-2,-1"/)
  assert.match(render('mh-complex', { a: 2, b: 1, times: 'onePlusI' }), /data-complex-result="1,3"/)
  const complex = MATH_HISTORY_CHAPTERS.find((chapter) => chapter.id === 'mh-complex')
  assert.equal(complex.visual.formula({ a: 3, b: -2, times: 'i' }), '(3-2i)\\times i=2+3i')

  // 計算尺：a×b。
  assert.match(render('mh-logarithm', { a: 2.5, b: 3 }), /data-slide-product="7.5"/)

  // e：(1＋1/n)^n。
  assert.match(render('mh-compound', { n: 1 }), /data-compound-value="2"/)
  assert.match(render('mh-compound', { n: 12 }), /data-compound-value="2.61304"/)
  assert.match(render('mh-compound', { n: 8760 }), /data-compound-value="2.71813"/)
})

test('図の数は操作値と数学的に一致する（高校：波・微分・積分・基本定理・最大最小・数列の和・フィボナッチ）', () => {
  // フーリエ級数：四角い波は x＝π/2 で 1 に、のこぎりの波は π/4 に近づく。
  const squarePeak = Number(render('mh-waves', { shape: 'square', terms: 10, theta: 60 }).match(/data-fourier-peak="([-\d.]+)"/)[1])
  assert.ok(Math.abs(squarePeak - 1) < 0.1, `四角い波 ${squarePeak}`)
  const sawPeak = Number(render('mh-waves', { shape: 'saw', terms: 10, theta: 60 }).match(/data-fourier-peak="([-\d.]+)"/)[1])
  assert.ok(Math.abs(sawPeak - Math.PI / 4) < 0.1, `のこぎりの波 ${sawPeak}`)
  assert.match(render('mh-waves', { shape: 'square', terms: 1, theta: 90 }), /data-fourier-peak="1.273"/)

  // 微分：2点の傾き 2x＋h と接線の傾き 2x。
  assert.match(render('mh-derivative', { x: 1, h: 0.1 }), /data-secant-slope="2.1" data-tangent-slope="2"/)
  assert.match(render('mh-derivative', { x: -1.5, h: 1 }), /data-secant-slope="-2" data-tangent-slope="-3"/)

  // 積分：x² の長方形の和（右はしは上から、左はしは下から 1/3 に近づく）。
  assert.match(render('mh-integral', { n: 4, side: 'right' }), /data-riemann-sum="0.4688"/)
  assert.match(render('mh-integral', { n: 4, side: 'left' }), /data-riemann-sum="0.2188"/)
  assert.match(render('mh-integral', { n: 32, side: 'right' }), /data-riemann-sum="0.3491"/)

  // 基本定理：S(x) と、その傾き＝f(x)。
  assert.match(render('mh-ftc', { f: 'x', x: 2 }), /data-area-s="2" data-area-slope="2"/)
  assert.match(render('mh-ftc', { f: 'x2', x: 3 }), /data-area-s="9" data-area-slope="9"/)

  // 箱の体積：x＝2 で最大 128、傾き 0。
  assert.match(render('mh-optimization', { x: 2 }), /data-box-volume="128" data-box-slope="0"/)
  assert.match(render('mh-optimization', { x: 1 }), /data-box-volume="100" data-box-slope="60"/)

  // 等差数列の和：階段のます目と、2つ組み合わせた長方形。
  assert.match(render('mh-sum', { n: 6, view: 'stairs' }), /data-staircase-sum="21" data-staircase-cells="21"/)
  assert.match(render('mh-sum', { n: 6, view: 'double' }), /data-staircase-sum="21" data-staircase-cells="42"/)

  // フィボナッチ：F_n と、となりとの比。
  assert.match(render('mh-fibonacci', { n: 12 }), /data-fib-value="144" data-fib-ratio="1.61806"/)
  assert.match(render('mh-fibonacci', { n: 6 }), /data-fib-value="8" data-fib-ratio="1.625"/)
})

test('図の数は操作値と数学的に一致する（高校：正規分布・検定・ベクトル・だ円・放物線・極限）', () => {
  // 平均±1・±2標準偏差に入る確率（回数をふやすと 68.3%・95.4% に近づく）。
  const band = (n, which) => Number(render('mh-normal', { n, band: which }).match(/data-normal-band="([\d.]+)"/)[1])
  assert.deepEqual([4, 16, 64, 256].map((n) => band(n, 'sd1')), [87.5, 79, 74, 71.2])
  assert.deepEqual([4, 16, 64, 256].map((n) => band(n, 'sd2')), [100, 97.9, 96.7, 96.1])
  assert.match(render('mh-normal', { n: 16, band: 'none' }), /data-normal-band="none"/)

  // 紅茶：k 杯以上当たる選び方（70通りのうち）。
  assert.deepEqual([0, 1, 2, 3, 4].map((hits) => Number(render('mh-tea', { hits }).match(/data-tea-count="(\d+)"/)[1])), [70, 69, 53, 17, 1])
  const tea = render('mh-tea', { hits: 3 })
  assert.equal((tea.match(/data-tea-picked="yes"/g) ?? []).length, 4)

  // ベクトル：直角なら三平方、同じ向きならたし算、反対向きならひき算。
  assert.match(render('mh-vector', { a: 3, b: 4, angle: 90 }), /data-vector-length="5"/)
  assert.match(render('mh-vector', { a: 3, b: 2, angle: 0 }), /data-vector-length="5"/)
  assert.match(render('mh-vector', { a: 3, b: 3, angle: 180 }), /data-vector-length="0"/)

  // だ円：焦点からの距離の和はいつも 2a＝10。
  for (let e = 0; e <= 0.9; e += 0.3) {
    for (const t of [0, 60, 150, 270]) {
      assert.match(render('mh-ellipse', { e: Number(e.toFixed(1)), t }), /data-ellipse-sum="10"/, `e=${e} t=${t}`)
    }
  }

  // 放物線：はね返った点から焦点まで＝準線まで＝y＋p。
  assert.match(render('mh-parabola', { p: 1, ray: 2 }), /data-parabola-distance="2"/)
  assert.match(render('mh-parabola', { p: 0.5, ray: 3 }), /data-parabola-distance="5"/)

  // 無限等比級数の部分和。
  assert.match(render('mh-limit', { series: 'half', n: 10 }), /data-zeno-sum="0.999023"/)
  assert.match(render('mh-limit', { series: 'achilles', n: 3 }), /data-zeno-sum="111"/)
})

test('算数の基本33項目と、数学の45単元のすべてに、つながる話がある', () => {
  assert.deepEqual(checkBasics(), [])
  assert.deepEqual(checkUnits(), [])
  assert.ok(MATH_HISTORY_CHAPTERS.length >= 70, `話の数 ${MATH_HISTORY_CHAPTERS.length}`)
  assert.ok(MATH_HISTORY_QUESTIONS.length >= 210, `問題の数 ${MATH_HISTORY_QUESTIONS.length}`)
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
