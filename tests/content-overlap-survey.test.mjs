// 古典・漢文以外の16教材で、段・コースの重なりと項目の重複を調べた結果を守るテスト
// （requests/2026-10-02-koten-level-merge.json の other-level-structure・other-item-duplicates。「同様の重複が他のコンテンツにないか確認しなさい。」）。
//
// ① 段の作り：16教材の19,099件は、どの軸（級・単元・段など）でもちょうど1つの決まった値を持ち、id の重なりもない。
//    1つ下を含む積み上げのコースは古典の学年・目標別コースだけだったので、ほかの教材に難関・最難関のような重なりはない。
// ② 項目の重複：物差しを広げて拾った候補257組を1組ずつ読んで分けた（scripts/checks/content-overlap-survey.mjs の OTHER_PAIRS）。
//    同じ項目の二重登録は3組（熟語の keep on と keep on ~ing、英文法の the other の穴埋め2問と並べ替え2問）、
//    同じ語の別の形は11組。整理するか（どちらを残すか）は利用者が決める。
import test from 'node:test'
import assert from 'node:assert/strict'

import { surveyContentOverlaps } from '../scripts/checks/content-overlap-survey.mjs'

const result = surveyContentOverlaps()

test('段の作り：16教材19,099件が、どの軸でもちょうど1つの決まった値を持ち、id の重なりがない', () => {
  assert.deepEqual(result.problems, [])
  assert.equal(result.structure.length, 16)
  assert.equal(result.structure.reduce((sum, content) => sum + content.total, 0), 19_099)
  for (const content of result.structure) {
    assert.deepEqual(content.duplicateIds, [], `${content.label}: id の重なり`)
    for (const axis of content.axes) assert.deepEqual(axis.bad, [], `${content.label}: ${axis.name}`)
  }
  assert.deepEqual(
    Object.fromEntries(result.structure.map((content) => [content.label, content.axes.map((axis) => `${axis.name}${axis.tiers}`).join('・')])),
    {
      英単語: '級7・分野41',
      '熟語・構文': '級7・熟語・構文2',
      英文法: '級7・単元101',
      リスニング: '級8',
      ディクテーション: '級7',
      語源: '語根339',
      英語長文: '級8',
      英作文: '級7',
      名作に親しむ: '種類3・難しさの目安10',
      数学: '単元45',
      数学の歴史: '部3',
      数学の入試演習: '段2・単元45',
      社会の重要語句: '単元58',
      社会の演習: '段3・単元58',
      理科の重要語句: '単元44',
      理科の演習: '段3・単元44',
    },
  )
})

test('項目の重複：候補257組をすべて分けてあり、二重登録3組・別の形11組・社会と理科の両方で学ぶ語句18組', () => {
  const rows = result.overlaps.sets.filter((set) => set.candidates)
    .map((set) => [set.label, set.candidates, set.duplicate.length, set.form.length, set.same.length, set.different])
  assert.deepEqual(rows, [
    ['英単語', 199, 0, 7, 0, 192],
    ['熟語・構文', 23, 1, 3, 0, 19],
    ['英文法', 5, 2, 1, 0, 2],
    ['語源', 12, 0, 0, 0, 12],
    ['社会の語句 × 理科の語句', 18, 0, 0, 18, 0],
  ])
  const keys = (kind) => result.overlaps.sets.flatMap((set) => set[kind].map((pair) => pair.key)).sort()
  assert.deepEqual(keys('duplicate'), [
    'grammar:gr_pre2_pron_3|gr_unit_us_pre2_pronoun_02',
    'grammar:gr_unit_wo_4_pronoun_02|gr_unit_wo_pre2_pronoun_01',
    'usage:curr1900_idm_5_keep_on_blanking|exam_idm_keep_on',
  ])
  assert.deepEqual(keys('form'), [
    'grammar:gr_depth_1_opt_02|gr_unit_wo_1_optative_01',
    'usage:curr1900_idm_2_generally_speaking|curr_syn_gr_auto_pre1_participle_idiom_001',
    'usage:curr1900_idm_3_help_a_with_b|exam_idm_help_with',
    'usage:curr1900_idm_pre2_turn_a_into_b|curr_idm_pre2_turn_into',
    'vocab:acknowledgement|acknowledgment',
    'vocab:claim|claims',
    'vocab:corrupt|corrupted',
    'vocab:demand|demands',
    'vocab:grape|grapes',
    'vocab:notice|notices',
    'vocab:sock|socks',
  ])
})
