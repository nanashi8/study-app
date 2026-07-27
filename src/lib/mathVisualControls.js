export function rangeProgress(control, value) {
  const min = Number(control.min)
  const max = Number(control.max)
  const span = max - min
  if (span <= 0) return 0

  const clamped = Math.min(max, Math.max(min, Number(value)))
  return Number((((clamped - min) / span) * 100).toFixed(4))
}

export function stepRangeValue(control, value, direction) {
  const min = Number(control.min)
  const max = Number(control.max)
  const step = Number(control.step)
  const currentStep = Math.round((Number(value) - min) / step)
  const next = min + (currentStep + direction) * step
  return Math.min(max, Math.max(min, Number(next.toFixed(10))))
}
