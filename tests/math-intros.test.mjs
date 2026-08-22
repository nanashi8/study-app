import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { MATH_UNITS } from '../src/data/math.js'
import { MATH_INTROS, introForUnit } from '../src/data/math-intros.js'
import { rangeProgress, stepRangeValue } from '../src/lib/mathVisualControls.js'
import { contrastRatio, readableMathAccent } from '../src/lib/mathVisualColors.js'

const SUPPORTED_VISUAL_VARIANTS = {
  number: ['signed-add', 'absolute', 'square-root', 'limit'],
  balance: ['linear'],
  algebra: ['groups', 'combine', 'expand', 'factor', 'binomial'],
  graph: ['proportion', 'intersection', 'line', 'quadratic-roots', 'parabola', 'vertex', 'exp-log'],
  geometry: ['sector', 'angles', 'congruence', 'similarity', 'circle-angle', 'pythagorean', 'trig', 'cevian', 'circle-equation', 'conic'],
  solid: ['prism', 'revolution'],
  data: ['histogram', 'boxplot', 'sample', 'correlation', 'normal'],
  probability: ['die', 'tree'],
  set: ['implication'],
  integer: ['euclid'],
  complex: ['rotation'],
  'trig-wave': ['unit-circle'],
  calculus: ['derivative', 'integral', 'derivative3'],
  sequence: ['arithmetic'],
  vector: ['addition'],
}

const valueSetsFor = (intro) => intro.controls.reduce((sets, control) => {
  const choices = control.type === 'range'
    ? Array.from(
      { length: Math.round((control.max - control.min) / control.step) + 1 },
      (_, index) => Number((control.min + index * control.step).toFixed(10)),
    )
    : control.options.map((option) => option.value)

  return sets.flatMap((values) =>
    choices.map((choice) => ({ ...values, [control.id]: choice })))
}, [{}])

let vite
let MathVisual
let VisualControl

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  const mathModule = await vite.ssrLoadModule('/src/components/MathVisual.jsx')
  const introModule = await vite.ssrLoadModule('/src/screens/MathIntro.jsx')
  MathVisual = mathModule.MathVisual
  VisualControl = introModule.VisualControl
})

after(async () => {
  await vite?.close()
})

test('数学45単元のすべてに動的な視覚導入がある', () => {
  const unitIds = MATH_UNITS.map((unit) => unit.id)
  const introIds = Object.keys(MATH_INTROS)

  assert.equal(new Set(unitIds).size, unitIds.length)
  assert.deepEqual([...introIds].sort(), [...unitIds].sort())

  for (const unit of MATH_UNITS) {
    const intro = introForUnit(unit.id)
    assert.ok(intro, unit.id)
    assert.ok(intro.kind?.trim(), `${unit.id}: kind`)
    assert.ok(intro.variant?.trim(), `${unit.id}: variant`)
    assert.ok(
      SUPPORTED_VISUAL_VARIANTS[intro.kind]?.includes(intro.variant),
      `${unit.id}: unsupported ${intro.kind}/${intro.variant}`,
    )
    assert.ok(intro.question?.trim(), `${unit.id}: question`)
    assert.ok(intro.instruction?.trim(), `${unit.id}: instruction`)
    assert.ok(Array.isArray(intro.controls) && intro.controls.length > 0, `${unit.id}: controls`)
    assert.equal(new Set(intro.controls.map((control) => control.id)).size, intro.controls.length, `${unit.id}: control ids`)

    const values = Object.fromEntries(
      intro.controls.map((control) => [control.id, control.initial]),
    )
    assert.ok(intro.formula(values)?.trim(), `${unit.id}: formula`)
    assert.ok(intro.insight(values)?.trim(), `${unit.id}: insight`)
    assert.ok(
      contrastRatio(readableMathAccent(unit.color), '#ffffff') >= 4.5,
      `${unit.id}: readable accent`,
    )

    for (const control of intro.controls) {
      assert.ok(control.label?.trim(), `${unit.id}:${control.id}: label`)
      assert.ok(['range', 'options'].includes(control.type), `${unit.id}:${control.id}: type`)
      if (control.type === 'range') {
        assert.ok(Number.isFinite(control.min), `${unit.id}:${control.id}: min`)
        assert.ok(Number.isFinite(control.max), `${unit.id}:${control.id}: max`)
        assert.ok(Number.isFinite(control.step) && control.step > 0, `${unit.id}:${control.id}: step`)
        assert.ok(control.initial >= control.min && control.initial <= control.max, `${unit.id}:${control.id}: initial`)
      } else {
        assert.ok(control.options.some((option) => option.value === control.initial), `${unit.id}:${control.id}: initial option`)
      }
    }
  }
})

test('全単元の図はすべての操作値でSVGとして描画できる', () => {
  for (const unit of MATH_UNITS) {
    const intro = MATH_INTROS[unit.id]
    const valueSets = valueSetsFor(intro)

    for (const values of valueSets) {
      const stateLabel = `${unit.id} ${JSON.stringify(values)}`
      const formula = intro.formula(values)
      const insight = intro.insight(values)
      assert.ok(formula?.trim(), `${stateLabel}: formula`)
      assert.ok(insight?.trim(), `${stateLabel}: insight`)
      assert.doesNotMatch(formula, /NaN|undefined|\+\-/, `${stateLabel}: valid formula`)
      assert.doesNotMatch(insight, /NaN|undefined/, `${stateLabel}: valid insight`)

      const markup = renderToStaticMarkup(
        React.createElement(MathVisual, {
          intro,
          values,
          unit,
          label: `${unit.title}の図`,
        }),
      )
      assert.match(markup, /^<svg /, `${stateLabel}: svg root`)
      assert.doesNotMatch(markup, /NaN|undefined/, `${stateLabel}: finite markup`)
      assert.match(markup, /role="img"/, `${stateLabel}: accessible image`)

      for (const match of markup.matchAll(/<text\b[^>]*\bfill="(#[0-9a-f]{6})"[^>]*>/gi)) {
        const color = match[1]
        assert.ok(
          contrastRatio(color, '#ffffff') >= 4.5,
          `${stateLabel}: text ${color} must reach 4.5:1`,
        )
      }

      for (const match of markup.matchAll(/\bstroke="(#[0-9a-f]{6})"/gi)) {
        const color = match[1].toLowerCase()
        if (['#ffffff', '#e7e5f3'].includes(color)) continue
        assert.ok(
          contrastRatio(color, '#ffffff') >= 3,
          `${stateLabel}: meaningful stroke ${color} must reach 3:1`,
        )
      }
    }
  }
})

test('手順式の視覚教材は数式と図を同じ段階で表示する', () => {
  const balanceIntro = MATH_INTROS.eq1
  const balanceUnit = MATH_UNITS.find((candidate) => candidate.id === 'eq1')
  const balanceSteps = [
    ['2x + 3', '>9<', '2x+3=9'],
    ['>2x<', '>6<', '2x=6'],
    ['>x<', '>3<', 'x=3'],
  ]
  for (const [step, [left, right, formula]] of balanceSteps.entries()) {
    const markup = renderToStaticMarkup(
      React.createElement(MathVisual, {
        intro: balanceIntro,
        values: { step },
        unit: balanceUnit,
        label: '一次方程式の図',
      }),
    )
    assert.ok(markup.includes(left), `eq1 step ${step}: ${left}`)
    assert.ok(markup.includes(right), `eq1 step ${step}: ${right}`)
    assert.equal(balanceIntro.formula({ step }), formula)
  }

  const intro = MATH_INTROS.intA
  const unit = MATH_UNITS.find((candidate) => candidate.id === 'intA')
  const expected = [
    ['1071 と 462 から開始', '大きい数を小さい数で割る'],
    ['1071 を 462 で割る', '462 × 2', '余り 147', '次は (462, 147)'],
    ['462 を 147 で割る', '147 × 3', '余り 21', '次は (147, 21)'],
    ['147 を 21 で割る', '21 × 7', '余り 0', '最大公約数 = 21'],
  ]
  assert.equal(
    intro.formula({ step: 3 }),
    '\\begin{aligned}147&=21\\times7+0\\\\\\therefore\\ \\gcd(1071,462)&=21\\end{aligned}',
  )

  for (const [step, fragments] of expected.entries()) {
    const markup = renderToStaticMarkup(
      React.createElement(MathVisual, {
        intro,
        values: { step },
        unit,
        label: '整数の性質の図',
      }),
    )

    for (const fragment of fragments) {
      assert.ok(markup.includes(fragment), `step ${step}: ${fragment}`)
    }
    if (step < 3) {
      assert.ok(!markup.includes('最大公約数 = 21'), `step ${step}: 結果を先に表示しない`)
    }
    assert.ok(!markup.includes('gcd = 21'), `step ${step}: 引数のないgcdを表示しない`)
  }
})

test('方向・座標・回転・縮尺の図は操作値と数学的意味を一致させる', () => {
    const renderUnit = (unitId, values) => {
      const unit = MATH_UNITS.find((candidate) => candidate.id === unitId)
      return renderToStaticMarkup(
        React.createElement(MathVisual, {
          intro: MATH_INTROS[unitId],
          values,
          unit,
          label: `${unit.title}の図`,
        }),
      )
    }

    const negativeMove = renderUnit('pn', { b: -6 })
    const negativeMotion = negativeMove.match(
      /data-number-motion="signed-add" data-start-x="([^"]+)" data-end-x="([^"]+)"/,
    )
    assert.ok(negativeMotion, 'pn: signed motion metadata')
    assert.ok(Number(negativeMotion[1]) > Number(negativeMotion[2]), 'pn: negative addition points left')

    const inverseZero = renderUnit('prop', { mode: 'inverse', a: 0 })
    assert.match(inverseZero, /a=0 は反比例ではない/)
    assert.equal((inverseZero.match(/<circle[^>]*fill="#b45309"/g) ?? []).length, 1)
    assert.match(MATH_INTROS.prop.formula({ mode: 'inverse', a: 0 }), /反比例ではない/)

    assert.equal(
      MATH_INTROS.simul.formula({ b: -3 }),
      '\\begin{cases}y=x+1\\\\y=-x-3\\end{cases}',
    )

    const circle = renderUnit('coordII', { r: 4 })
    assert.match(circle, /<circle cx="198" cy="123" r="72"/)

    const noRotation = renderUnit('complex', { turn: 0 })
    const fullRotation = renderUnit('complex', { turn: 4 })
    assert.equal((noRotation.match(/data-rotation-quarter=/g) ?? []).length, 0)
    assert.equal((fullRotation.match(/data-rotation-quarter=/g) ?? []).length, 4)

    const oppositeVectors = renderUnit('vector', { theta: 180 })
    const bVector = oppositeVectors.match(/data-vector="b"[^>]*x2="([^"]+)"[^>]*y2="([^"]+)"/)
    assert.ok(bVector, 'vector: b endpoint')
    assert.ok(Number(bVector[1]) >= 0 && Number(bVector[1]) <= 360, 'vector: b x remains visible')
    assert.ok(Number(bVector[2]) >= 0 && Number(bVector[2]) <= 220, 'vector: b y remains visible')
    assert.match(oppositeVectors, /data-vector="b"[^>]*marker-end="url\(#math-intro-arrow-vector-rose\)"/)

    const ellipseLow = renderUnit('curveC', { e: 0.4 })
    const ellipseHigh = renderUnit('curveC', { e: 0.9 })
    const lowRy = Number(ellipseLow.match(/<ellipse[^>]*ry="([^"]+)"/)?.[1])
    const highRy = Number(ellipseHigh.match(/<ellipse[^>]*ry="([^"]+)"/)?.[1])
    assert.ok(lowRy > highRy, 'curveC: ellipse narrows as eccentricity approaches 1')

    const revolution = renderUnit('integ3', { b: 3 })
    assert.match(revolution, /<ellipse cx="300" cy="125" rx="5" ry="69"/)

    assert.match(MATH_INTROS.trig.formula({ theta: 35 }), /\\tan35\^\\circ/)
    assert.match(MATH_INTROS.prob.formula({ favorable: 1 }), /\\approx0\.17/)
    assert.match(MATH_INTROS.plane1.formula({ theta: 30 }), /\\approx0\.08/)
    assert.equal(MATH_INTROS.integ.formula({ b: 0.5 }), '\\int_0^{0.5}x\\,dx=0.125')
})

test('視覚教材の操作UIは値の位置・大きな操作対象・選択状態を明示する', () => {
    const rangeControl = MATH_INTROS.pn.controls[0]

    assert.equal(rangeProgress(rangeControl, rangeControl.min), 0)
    assert.equal(rangeProgress(rangeControl, rangeControl.max), 100)
    assert.equal(rangeProgress(rangeControl, rangeControl.initial), 83.3333)
    assert.equal(stepRangeValue(rangeControl, rangeControl.min, -1), rangeControl.min)
    assert.equal(stepRangeValue(rangeControl, rangeControl.max, 1), rangeControl.max)

    const decimalControl = MATH_INTROS.simil.controls[0]
    assert.equal(stepRangeValue(decimalControl, 0.4, 1), 0.5)

    const rangeMarkup = renderToStaticMarkup(
      React.createElement(VisualControl, {
        control: rangeControl,
        value: rangeControl.initial,
        color: '#4f46e5',
        onChange: () => {},
      }),
    )
    assert.match(rangeMarkup, /class="math-visual-range"/)
    assert.match(rangeMarkup, /--range-progress:83\.3333%/)
    assert.match(rangeMarkup, /aria-label="足す数：前の値"/)
    assert.match(rangeMarkup, /aria-label="足す数：次の値"/)
    assert.match(rangeMarkup, /h-11 w-11/)
    assert.match(rangeMarkup, /text-sm font-extrabold text-white/)

    const optionsControl = MATH_INTROS.setlogic.controls[0]
    const optionsMarkup = renderToStaticMarkup(
      React.createElement(VisualControl, {
        control: optionsControl,
        value: optionsControl.initial,
        color: '#4f46e5',
        onChange: () => {},
      }),
    )
    assert.match(optionsMarkup, /aria-pressed="true"/)
    assert.match(optionsMarkup, /min-h-12/)
    assert.match(optionsMarkup, /十分条件/)
    assert.match(optionsMarkup, /必要条件/)
})
