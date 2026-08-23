import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')
const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8'),
)

test('英字は全画面で参考書調のSource Serif 4を使い、日本語は既存書体へフォールバックする', () => {
  assert.equal(
    packageJson.dependencies['@fontsource-variable/source-serif-4'],
    '5.3.0',
  )
  assert.match(css, /font-family: "Source Serif 4 English";/)
  assert.match(css, /source-serif-4-latin-standard-normal\.woff2/)
  assert.match(css, /source-serif-4-latin-standard-italic\.woff2/)
  assert.match(css, /font-weight: 200 900;/)
  assert.match(css, /unicode-range:[^;]*U\+0020-007E[^;]*;/s)
  assert.match(css, /--font-english-reading:[^;]*"M PLUS Rounded 1c"[^;]*;/s)
  assert.match(css, /--font-sans: var\(--font-english-reading\);/)
  assert.match(css, /--font-display: var\(--font-english-reading\);/)
  assert.match(css, /--font-serif: "Source Serif 4 English"/)
  assert.match(css, /\[lang\|="en"\][^{]*\{[^}]*var\(--font-english-reading\)/s)
})
