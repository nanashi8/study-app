import assert from 'node:assert/strict'
import { test } from 'node:test'
import { publicAssetUrl } from '../src/lib/publicAssetUrl.js'

test('ゲーム画像はGitHub Pagesのbase配下へ解決され、二重変換されない', () => {
  const asset = '/assets/battle/cast/students/mio/idle.webp'
  const pagesAsset = '/study-app/assets/battle/cast/students/mio/idle.webp'

  assert.equal(publicAssetUrl(asset, '/study-app/'), pagesAsset)
  assert.equal(publicAssetUrl(asset, './'), './assets/battle/cast/students/mio/idle.webp')
  assert.equal(publicAssetUrl(pagesAsset, '/study-app/'), pagesAsset)
  assert.equal(publicAssetUrl('https://example.com/icon.webp', '/study-app/'), 'https://example.com/icon.webp')
  assert.equal(publicAssetUrl('data:image/png;base64,AA==', '/study-app/'), 'data:image/png;base64,AA==')
})
