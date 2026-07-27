import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { MATH_UNITS } from '../src/data/math.js'
import { MATH_INTROS, introForUnit } from '../src/data/math-intros.js'

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
    assert.ok(intro.question?.trim(), `${unit.id}: question`)
    assert.ok(intro.instruction?.trim(), `${unit.id}: instruction`)
    assert.ok(Array.isArray(intro.controls) && intro.controls.length > 0, `${unit.id}: controls`)
    assert.equal(new Set(intro.controls.map((control) => control.id)).size, intro.controls.length, `${unit.id}: control ids`)

    const values = Object.fromEntries(
      intro.controls.map((control) => [control.id, control.initial]),
    )
    assert.ok(intro.formula(values)?.trim(), `${unit.id}: formula`)
    assert.ok(intro.insight(values)?.trim(), `${unit.id}: insight`)

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

test('全単元の図は操作範囲の端でもSVGとして描画できる', async () => {
  const vite = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })

  try {
    const { MathVisual } = await vite.ssrLoadModule('/src/components/MathVisual.jsx')

    for (const unit of MATH_UNITS) {
      const intro = MATH_INTROS[unit.id]
      const valueSets = [
        Object.fromEntries(intro.controls.map((control) => [control.id, control.initial])),
        Object.fromEntries(intro.controls.map((control) => [
          control.id,
          control.type === 'range' ? control.min : control.options[0].value,
        ])),
        Object.fromEntries(intro.controls.map((control) => [
          control.id,
          control.type === 'range' ? control.max : control.options.at(-1).value,
        ])),
      ]

      for (const values of valueSets) {
        const markup = renderToStaticMarkup(
          React.createElement(MathVisual, {
            intro,
            values,
            unit,
            label: `${unit.title}の図`,
          }),
        )
        assert.match(markup, /^<svg /, `${unit.id}: svg root`)
        assert.doesNotMatch(markup, /NaN|undefined/, `${unit.id}: finite markup`)
        assert.match(markup, /role="img"/, `${unit.id}: accessible image`)
      }
    }
  } finally {
    await vite.close()
  }
})
