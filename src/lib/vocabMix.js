// 通常セッションの「復習」と「未修（新しい語）」の配分を、学習者が手で寄せるための目盛り。
//
// 既定は auto ＝ これまでどおり session.js の適応プロファイル
// （復習の滞留量と直近の失敗率で 30〜60% を選ぶ）に任せる。
// テスト前に復習だけ回したい、先へ進みたい、といった日は
// 目盛りを動かして新しい語の割合そのものを指定できる。
//
// 指定できるのは「割合」だけで、在庫が足りないときの補い方は変えない。
// 復習が0件なら新しい語で埋め、新しい語が尽きれば復習で埋める。

export const VOCAB_MIX_DEFAULT = 'auto'

export const VOCAB_MIX_STEPS = Object.freeze([
  Object.freeze({ id: 'auto', label: '自動', freshShare: null }),
  Object.freeze({ id: 'review-only', label: '復習だけ', freshShare: 0 }),
  Object.freeze({ id: 'review-heavy', label: '復習寄り', freshShare: 0.2 }),
  Object.freeze({ id: 'even', label: '半々', freshShare: 0.5 }),
  Object.freeze({ id: 'fresh-heavy', label: '未修寄り', freshShare: 0.8 }),
  Object.freeze({ id: 'fresh-only', label: '未修だけ', freshShare: 1 }),
])

const STEP_BY_ID = new Map(VOCAB_MIX_STEPS.map((step) => [step.id, step]))

/** 保存値を目盛りIDへ正す。知らない値は自動へ戻す。 */
export function normalizeVocabMix(value) {
  return STEP_BY_ID.has(value) ? value : VOCAB_MIX_DEFAULT
}

export function vocabMixStep(value) {
  return STEP_BY_ID.get(normalizeVocabMix(value)) ?? VOCAB_MIX_STEPS[0]
}

export function vocabMixIndex(value) {
  return VOCAB_MIX_STEPS.findIndex((step) => step.id === normalizeVocabMix(value))
}

export function vocabMixAtIndex(index) {
  const step = VOCAB_MIX_STEPS[Math.round(Number(index))]
  return step ? step.id : VOCAB_MIX_DEFAULT
}

/**
 * セッションの新しい語の割合。自動のときは null を返し、
 * session.js の適応プロファイルへそのまま任せる。
 */
export function vocabMixFreshShare(value) {
  return vocabMixStep(value).freshShare
}

/** 「復習7 : 未修3」のような、いま何が起きるかの説明。 */
export function describeVocabMix(value) {
  const share = vocabMixFreshShare(value)
  if (share === null) return '復習のたまり具合と最近の正誤で自動配分'
  const fresh = Math.round(share * 10)
  return `10問なら 復習${10 - fresh}問 : 未修${fresh}問`
}
