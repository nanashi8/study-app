// 使い分けカード。細かな使い分けがあり、生徒が注意しなければならない語・熟語の組を、例文で比べるカードにしたもの。
// 単語カードの裏・辞書ページ・熟語のカードと詳細で、カードに入っている語どうしの関連語の行からも開ける。
//
// 入試の頻出の43枚（exam-lexicon.js の EXAM_USAGE_GUIDES）に、候補の組を1組ずつ読んで足したカードを合わせる。
// 候補の組と、カードにしなかった組の理由は docs/audits/usage-guide-survey.json（scripts/checks/usage-guide-survey.mjs）。
//
// 形: { id, title, wordIds: 見出し語の id, phraseIds: 熟語・構文の id, summary,
//       choices: [{ term, rule, example, ja }], preferred?: { avoid, use, reason } }
// choices の term は、カードに入っている語・熟語のつづりそのもの（並べる順にカードに出す）。
import { EXAM_USAGE_GUIDES } from './exam-lexicon.js'
import { USAGE_GUIDE_CARDS } from './usage-guide-cards.js'

export const ALL_USAGE_GUIDES = [
  ...EXAM_USAGE_GUIDES.map((guide) => ({ phraseIds: [], ...guide })),
  ...USAGE_GUIDE_CARDS.map((guide) => ({ wordIds: [], phraseIds: [], ...guide })),
]

export const USAGE_GUIDES_BY_ID = new Map(ALL_USAGE_GUIDES.map((guide) => [guide.id, guide]))

const groupBy = (key) => {
  const byId = {}
  for (const guide of ALL_USAGE_GUIDES) {
    for (const id of guide[key]) byId[id] = [...(byId[id] ?? []), guide]
  }
  return byId
}

/** 見出し語の id → その語が入っている使い分けカード。 */
export const USAGE_GUIDES_BY_WORD = groupBy('wordIds')

/** 熟語・構文の id → その熟語が入っている使い分けカード。 */
export const USAGE_GUIDES_BY_PHRASE = groupBy('phraseIds')
