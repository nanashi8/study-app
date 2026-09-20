// 暗記カードの輪。「まだ」「覚えた」を押したカードはその回の輪から抜け、
// まだ押していないカードだけを何周でも回れる。上部の数字は「位置/残り枚数」で、
// 1枚押すたびに残りが 20→19→…→0 と減り、0 になったところでその回が終わる。
// 位置も詰まるので、1枚目を押すと次のカードが 1/19 になる。
//
// 輪から抜けるのは「その回」だけで、教材から消えるわけではない。次の復習日が来れば
// また出る（復習日の決め方は vocabScheduler.js）。
//
// answers は「カード番号 → 答え」の記録（useIndexedSessionState の values）。
// 番号が入っていれば処理済み、入っていなければ輪に残っている。

const isAnswered = (answers, index) => Object.hasOwn(answers ?? {}, index)

const cardCount = (total) => (
  Number.isInteger(total) && total > 0 ? total : 0
)

/** 輪に残っているカード番号を、小さい順に返す。 */
export function ringIndexes(total = 0, answers = {}) {
  const indexes = []
  for (let index = 0; index < cardCount(total); index += 1) {
    if (!isAnswered(answers, index)) indexes.push(index)
  }
  return indexes
}

/** 輪に残っている枚数。 */
export function ringRemaining(total = 0, answers = {}) {
  return ringIndexes(total, answers).length
}

/** 処理した枚数（進み具合のバーに使う）。 */
export function ringAnsweredCount(total = 0, answers = {}) {
  return cardCount(total) - ringRemaining(total, answers)
}

/**
 * 輪の中で次（'next'）・前（'previous'）のカード番号。末尾まで行ったら先頭へ戻る。
 * 動ける先が無いとき（残り1枚のときと、全部処理し終えたとき）は、その場から動かさない。
 * 処理済みのカードを開いているとき（選び直し）も、そこから輪へ戻れる。
 */
export function ringIndexAfter(index, total = 0, answers = {}, direction) {
  const count = cardCount(total)
  const step = direction === 'previous' ? -1 : direction === 'next' ? 1 : 0
  if (!count || !step || !Number.isInteger(index)) return index
  for (let offset = 1; offset <= count; offset += 1) {
    const candidate = (((index + step * offset) % count) + count) % count
    if (!isAnswered(answers, candidate)) return candidate
  }
  return index
}

/**
 * いま見ているカードが、輪に残っているうちの何枚目か（1始まり）。上部の数字の左側。
 * 押したカードが抜けるぶん詰まるので、1枚目を押すと次のカードがまた1枚目になる。
 * 処理済みのカードを開いているとき（選び直し）は、輪へ戻ったときの位置を返す。
 */
export function ringPosition(index, total = 0, answers = {}) {
  const indexes = ringIndexes(total, answers)
  if (!indexes.length) return 0
  const at = indexes.indexOf(index)
  if (at >= 0) return at + 1
  const before = indexes.filter((candidate) => candidate < index).length
  return Math.min(indexes.length, before + 1)
}

/** 進み具合（処理した枚数の割合）。上部バーの下端の細い線に使う。 */
export function ringProgress(total = 0, answers = {}) {
  const count = cardCount(total)
  return count ? ringAnsweredCount(count, answers) / count : 0
}

/** 輪を回せるか（残り1枚なら回しても同じカードなので、前へ・次へは押せなくする）。 */
export function canTurnRing(index, total = 0, answers = {}, direction) {
  return ringIndexAfter(index, total, answers, direction) !== index
}
