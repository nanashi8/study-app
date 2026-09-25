import assert from 'node:assert/strict'
import test from 'node:test'
import { extraBranches, staleReferences, wrongIdentityCommits } from '../scripts/checks/history-authors.mjs'

// 2026-09-25、端末名から作った名前のコミット（40件）が公開の履歴に入っていたので、main の履歴を書き換え、
// 一直線の決まりに反して残っていた枝を片付けた（中身は refs/backup/2026-09-25/ に控えた）。その状態を守る。

test('今の枝の全コミットの作者・コミッターは、このリポジトリの名前（nanashi8）', () => {
  const { total, wrong } = wrongIdentityCommits()
  assert.ok(total >= 1)
  assert.deepEqual(wrong, [])
})

test('一直線の決まりのとおり、枝は main だけ（控えの refs/backup は枝に数えない）', () => {
  assert.deepEqual(extraBranches({ remote: false }), [])
})

test('名指ししたコミットの番号に、書き換える前の main の番号が残っていない', () => {
  assert.deepEqual(staleReferences().stale, [])
})
