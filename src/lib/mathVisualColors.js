const WHITE = '#ffffff'

const normalizeHex = (color) => {
  const match = String(color ?? '').trim().match(/^#([0-9a-f]{6})$/i)
  return match ? `#${match[1].toLowerCase()}` : null
}

const rgbFor = (color) => {
  const normalized = normalizeHex(color)
  if (!normalized) return null
  return [1, 3, 5].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16))
}

const linearChannel = (channel) => {
  const value = channel / 255
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4
}

export const relativeLuminance = (color) => {
  const rgb = rgbFor(color)
  if (!rgb) return null
  const [red, green, blue] = rgb.map(linearChannel)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

export const contrastRatio = (foreground, background = WHITE) => {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  if (foregroundLuminance === null || backgroundLuminance === null) return 0
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

const ACCESSIBLE_ACCENTS = {
  '#6366f1': '#4f46e5',
  '#7c3aed': '#6d28d9',
  '#0ea5e9': '#0369a1',
  '#10b981': '#047857',
  '#f59e0b': '#b45309',
  '#ec4899': '#be185d',
  '#0d9488': '#0f766e',
  '#06b6d4': '#0e7490',
  '#f43f5e': '#be123c',
}

const darken = (color, factor) => {
  const rgb = rgbFor(color)
  if (!rgb) return null
  return `#${rgb
    .map((channel) => Math.round(channel * factor).toString(16).padStart(2, '0'))
    .join('')}`
}

export const readableMathAccent = (color) => {
  const normalized = normalizeHex(color)
  if (!normalized) return '#4f46e5'
  if (ACCESSIBLE_ACCENTS[normalized]) return ACCESSIBLE_ACCENTS[normalized]
  if (contrastRatio(normalized, WHITE) >= 4.5) return normalized

  let candidate = normalized
  for (let factor = 0.92; factor >= 0.2; factor -= 0.08) {
    candidate = darken(normalized, factor)
    if (contrastRatio(candidate, WHITE) >= 4.5) return candidate
  }
  return '#312e81'
}

export const MATH_VISUAL_COLORS = {
  ink: '#312e81',
  muted: '#5f5b78',
  grid: '#e7e5f3',
  paper: WHITE,
  good: '#047857',
  warm: '#b45309',
  rose: '#be123c',
}
