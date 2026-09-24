// 単元別の並び替え・語法問題を、短い書き方から画面が読む形へそろえる部品。
//
// 文法の参考書は級×単元で127ページある。どのページで学んだ形も、選択だけでなく
// 並び替え（語順を自分で組む）・語法（語と語の結び付きを選ぶ）で確かめられるよう、
// 1単元につき両形式を3問以上置く。ここはその問題を作る型だけを持つ。
//
//   unit   : 参考書の単元ID（gref_<級>_<key>）。問題の級・単元名はこの単元から取る
//   focus  : その問題で習得させる形（単元の中で重ならないように書く）
//   order  : [focus, 英文, 和訳, 解説]
//   usage  : [kind, focus, 問題文(___が1つ), [選択肢4つ], 正解, 和訳, 解説, [選択肢の説明4つ]]
//   choice : [focus, 問題文(___が1つ), [選択肢4つ], 正解, 和訳, 解説, [選択肢の説明4つ]]
//
// 語法（usage）は「その語がどの語と結び付くか・後ろにどんな形をとるか」を問うものだけ。
// kind は grammar-usage-kinds.js の型のどれか。時制の形・語順・一致・関係詞の選択のように
// 規則がどの語にも同じように当てはまるものは語法ではないので、choice に置く。
//
// 解説は答え合わせの「解説」欄にそのまま出る（item.explain ＝ ruleExplanation）。
// 選択肢の説明は選択肢と同じ並びで書き、問題データが持つ（自動生成の問題と同じ持ち方）。

import { grammarReferenceById } from '../grammar-reference/index.js'
import { USAGE_KINDS } from '../grammar-usage-kinds.js'

const WORD_ORDER_PROMPT = '次の意味になるように、単語を英文の順に並べなさい。'

const unitKey = (unitId) => unitId.replace(/^gref_/, '')

function orderItem(unit, [focus, en, ja, explain], index) {
  const id = `gr_unit_wo_${unitKey(unit.id)}_${String(index + 1).padStart(2, '0')}`
  return Object.freeze({
    id,
    level: unit.level,
    topic: unit.topic,
    unitId: unit.id,
    focus,
    questionType: 'word-order',
    q: WORD_ORDER_PROMPT,
    choices: Object.freeze([]),
    answer: en,
    explain,
    ruleExplanation: explain,
    sentence: Object.freeze({ en, ja }),
    variationGroup: `unit-format:word-order:${id}`,
    formatSource: 'unit-question-formats',
  })
}

function blankItem(type, unit, [focus, q, choices, answer, ja, explain, notes], index, kind = null) {
  const prefix = type === 'usage' ? 'us' : 'ch'
  const id = `gr_unit_${prefix}_${unitKey(unit.id)}_${String(index + 1).padStart(2, '0')}`
  return Object.freeze({
    id,
    level: unit.level,
    topic: unit.topic,
    unitId: unit.id,
    focus,
    ...(kind ? { usageKind: kind } : {}),
    questionType: type,
    q,
    choices: Object.freeze([...choices]),
    answer,
    explain,
    ruleExplanation: explain,
    choiceNotes: Object.freeze(Object.fromEntries(choices.map((choice, i) => [choice, notes[i]]))),
    sentence: Object.freeze({ en: q.replace('___', answer), ja }),
    variationGroup: `unit-format:${type}:${id}`,
    formatSource: 'unit-question-formats',
  })
}

const usageItem = (unit, row, index) => {
  const [kind, ...rest] = row
  if (!USAGE_KINDS[kind]) throw new Error(`語法問題: 型がない ${unit.id} ${kind}`)
  return blankItem('usage', unit, rest, index, kind)
}

const choiceItem = (unit, row, index) => blankItem('choice', unit, row, index)

/** 1つの級ぶんの単元別問題。単元IDが参考書にないときは、取りこぼしに気づけるよう止める。 */
export function unitFormats(level, units) {
  return units.flatMap(({ unit: unitId, order = [], usage = [], choice = [] }) => {
    const unit = grammarReferenceById(unitId)
    if (!unit) throw new Error(`単元別の問題: 参考書にない単元 ${unitId}`)
    if (unit.level !== level) throw new Error(`単元別の問題: 級が合わない ${unitId}`)
    return [
      ...order.map((row, index) => orderItem(unit, row, index)),
      ...usage.map((row, index) => usageItem(unit, row, index)),
      ...choice.map((row, index) => choiceItem(unit, row, index)),
    ]
  })
}
