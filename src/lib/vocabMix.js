// 通常セッションの「復習」と「未修（新しい語）」の配分を、学習者が手で寄せるための目盛り。
//
// 既定は auto ＝ これまでどおり session.js の適応プロファイル
// （復習の滞留量と直近の失敗率で 30〜60% を選ぶ）に任せる。
// テスト前に復習だけ回したい、先へ進みたい、といった日は
// 目盛りを動かして新しい語の割合そのものを指定できる。
//
// 途中の段（復習寄り・半々・未修寄り）は「割合」の指定で、在庫が足りない側はもう一方で補う。
// 両端の「復習だけ」「未修だけ」は、足りなくてももう一方の語を出さない（そのぶん少なく出す）。
// バーを動かすと、学習中のセッションもまだ答えていない先の問題から組み直す。

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

/**
 * 「未修だけ」「復習だけ」で出せる語がなくなったときの案内。途中の段と自動は null。
 * もう一方の語を出さない理由と、バーで続けられることを伝える。
 */
export function vocabMixEmptyNotice(value) {
  const share = vocabMixFreshShare(value)
  if (share === 1) {
    return {
      title: '未修の単語は残っていません',
      detail: '出題バランスが「未修だけ」なので、一度学んだ単語は出していません。下のバーで割合を変えると、学んだ単語も出せます。',
    }
  }
  if (share === 0) {
    return {
      title: '復習する単語はまだありません',
      detail: '出題バランスが「復習だけ」なので、まだ学んでいない単語は出していません。下のバーで割合を変えると、新しい単語も出せます。',
    }
  }
  return null
}

/** 「復習7・未修3」のような、10問あたりの内訳。読み上げ欄と同じ高さに収まる長さで返す。 */
export function describeVocabMix(value) {
  const share = vocabMixFreshShare(value)
  if (share === null) return 'たまり具合で自動'
  const fresh = Math.round(share * 10)
  return `10問中 復習${10 - fresh}・未修${fresh}`
}
