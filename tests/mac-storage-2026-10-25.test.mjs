import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

// 2026-10-25 に scratchpad に残っていた検証用の clone（どちらも依頼を閉じて公開済み）
const leftoverClones = [
  '/private/tmp/claude-501/-Users-yuichinakamura-projects-study-app/91e032c1-e4c5-4dad-835e-f47e4987bf00/scratchpad/clone',
  '/private/tmp/claude-501/-Users-yuichinakamura-projects-study-app/340789d7-4dd0-44a2-9bdb-e6df7a40a0b1/scratchpad/clone',
]

test('公開済みの依頼が残した検証用の clone を消してある', () => {
  assert.deepEqual(leftoverClones.filter((path) => existsSync(path)), [])
})

test('検証用の clone を公開後に消す決まりが CLAUDE.md にある', () => {
  const rules = readFileSync(new URL('../CLAUDE.md', import.meta.url), 'utf8')
  assert.match(rules, /検証用の clone は、push して公開版を確かめたら消す/)
})
