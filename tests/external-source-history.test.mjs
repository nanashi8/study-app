import assert from 'node:assert/strict'
import test from 'node:test'
import { fileHits, messageHits } from '../scripts/checks/external-source-history.mjs'

// 2026-09-25、他人の資料への言及を、公開している履歴（全コミットのファイルの全版・コミットの文）から消した。
// 消した行（行の値だけを持つ）が、履歴にも今の版にも戻っていないことを守る。

test('全コミットのファイルの全版に、消した言及の行が戻っていない', () => {
  const { blobs, hits } = fileHits()
  assert.ok(blobs > 0)
  assert.deepEqual(hits, [])
})

test('全コミットの文に、消した言及の行が戻っていない', () => {
  const { commits, hits } = messageHits()
  assert.ok(commits > 0)
  assert.deepEqual(hits, [])
})
