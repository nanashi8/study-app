// 暗記・テストの「復習」と「未修（まだ学んでいない項目）」の配分を、学習者が手で寄せるための目盛り（画面下部の「出題」）。
// 英単語だけでなく、暗記・テストの全22画面（熟語・構文・英文法・リスニング・ディクテーション・語源・古典・漢文・英作文・数学の歴史・数学の入試演習）
// で同じ目盛りを使う。値は教材ごとに持つ（設定の vocabMix。名前は前からの保存のまま）。
//
// 既定は auto ＝ 今の出題順（studyOrder.js：苦手→復習→未学習・未回答→今日1回まちがえた項目→定着の確認→そのほか）のまま。
// 英単語の級・分野・品詞・全語の回だけは、session.js の適応プロファイル（復習の滞留量と直近の失敗率で 30〜60%）に任せる。
// テスト前に復習だけ回したい、先へ進みたい、といった日は、目盛りを動かして未修の割合そのものを指定できる。
//
// 復習の枠は「まだ」「不正解」の項目から、未修の枠は未修の項目から出す。どちらも足りない分は
// 「覚えた」「正解」の項目で埋める（復習の枠は点数の低い順、未修の枠は出題順）。
// 途中の段（復習寄り・半々・未修寄り）は、それでも足りない枠をもう一方で補う。
// 両端の「復習だけ」は未修の項目を、「未修だけ」は「まだ」「不正解」の項目を出さない（そのぶん少なく出す）。
// どの段でも、何度も「まだ」「不正解」をくり返している項目（苦手）は、未修の項目と混ぜる前に先頭へまとめて出す。
// 組み方は lib/studyMix.js。バーを動かすと、学習中の回もまだ出していない先の問題から組み直す。

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
 * 「未修だけ」「復習だけ」で出せる項目がなくなったときの案内。途中の段と自動は null。
 * 「未修だけ」が空になるのは、未修も「覚えた」「正解」の項目もなく、「まだ」「不正解」の項目だけが残るとき。
 * 「復習だけ」が空になるのは、まだ何も学んでいないとき。出さない理由と、下部の「出題」で続けられることを伝える。
 * unit は教材の呼び方（英単語は「単語」、ほかの教材は「項目」）。
 */
export function vocabMixEmptyNotice(value, { unit = '単語' } = {}) {
  const share = vocabMixFreshShare(value)
  if (share === 1) {
    return {
      title: `未修の${unit}は残っていません`,
      detail: `出題バランスが「未修だけ」なので、「まだ」「不正解」の${unit}は出していません。下の「出題」で割合を変えると、その${unit}も出せます。`,
    }
  }
  if (share === 0) {
    return {
      title: `復習する${unit}はまだありません`,
      detail: `出題バランスが「復習だけ」なので、まだ学んでいない${unit}は出していません。下の「出題」で割合を変えると、新しい${unit}も出せます。`,
    }
  }
  return null
}

/**
 * 「復習7・未修3」のような、10問あたりの内訳。下部の枠の見出しに収まる長さで返す。
 * adaptive は英単語の級・分野・品詞・全語の回（自動はたまり具合で決める）。ほかの回の自動は今の出題順のまま。
 */
export function describeVocabMix(value, { adaptive = true } = {}) {
  const share = vocabMixFreshShare(value)
  if (share === null) return adaptive ? 'たまり具合で自動' : '苦手→復習→未修の順'
  const fresh = Math.round(share * 10)
  return `10問中 復習${10 - fresh}・未修${fresh}`
}
