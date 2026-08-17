import assert from 'node:assert/strict'
import test from 'node:test'

import { publicDataSecurityErrors } from '../scripts/check-public-data-security.mjs'

test('公開ビルドと辞書リクエストが秘密情報・個人情報を公開しない', () => {
  assert.deepEqual(publicDataSecurityErrors(), [])
})
