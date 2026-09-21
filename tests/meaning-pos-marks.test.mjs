// 意味欄の訳語の品詞の印（requests/2026-09-21-relations-remaining.json の meaning-pos-marks）の回帰テスト。
import assert from 'node:assert/strict'
import test from 'node:test'
import { getWord } from '../src/data/vocab.js'
import { posSensesFor } from '../src/lib/wordRelations.js'
import { meaningPosMarksGap } from '../scripts/checks/meaning-pos-marks.mjs'

test('意味欄で見出しの品詞とちがって見える訳語は、品詞の印を付けたか、付けない理由を残してある', () => {
  const gap = meaningPosMarksGap()
  assert.deepEqual(gap.undecided, [], '印も理由もない訳語')
  assert.deepEqual(gap.stale, [], '拾われなくなった理由の行')
  assert.deepEqual(gap.badCodes, [], '略号がちがう行')
})

test('別の品詞の訳語は印で区別し、先頭の訳語は見出しの品詞の訳語にする', () => {
  assert.equal(getWord('work').meaning, '働く・仕事(名)')
  assert.equal(getWord('end').meaning, '終わる・終わらせる・終わり(名)')
  assert.equal(getWord('potential').meaning, '可能性・潜在能力・潜在的な(形)')
  assert.equal(getWord('whole').meaning, '全体の・全部の・全体(名)')
  // 印を付けた訳語は、その品詞の意味として形のつながりにも使う。
  assert.deepEqual(posSensesFor(getWord('study')).map((sense) => [sense.pos, sense.meaning]), [['動', '勉強する'], ['名', '研究']])
  assert.ok(posSensesFor(getWord('clean')).some((sense) => sense.pos === '動' && sense.meaning === 'きれいにする'))
})
