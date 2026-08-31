// 正答データや教材IDと衝突しない、選択問題共通の「わからない」回答。
// 実在する英単語IDに "unknown" があるため、その文字列は番兵値に使わない。
export const UNKNOWN_CHOICE_ID = '__study_app_unknown_choice__'

// 学習者に見せる選択肢は「3択＋わからない」でそろえる。
// 4択だと消去法で当てられる余地が大きく、迷った回答が「わからない」に集まらない。
// 教材データ側は4択のまま（誤答ごとの根拠を全件そろえるため）で、出題時にここで絞る。
export const QUIZ_CHOICE_COUNT = 3

function hashSeed(value) {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// 4択以上の教材から、正解を必ず残して3択へ絞る。
// 残す誤答は seed（問題ID）だけで決まるため、同じ問題はいつ解いても同じ3択になる。
// 並び順は元のまま返すので、呼び出し側のシャッフルや添字で持つ answer と衝突しない。
// isAnswer には正解の値そのもの、または (choice, index) を受け取る判定関数を渡す。
export function limitQuizChoices(choices, isAnswer, { seed = '', count = QUIZ_CHOICE_COUNT } = {}) {
  const list = Array.isArray(choices) ? choices : []
  if (list.length <= count) return [...list]

  const matches = typeof isAnswer === 'function' ? isAnswer : (choice) => choice === isAnswer
  const answerIndexes = []
  const wrongIndexes = []
  list.forEach((choice, index) => {
    ;(matches(choice, index) ? answerIndexes : wrongIndexes).push(index)
  })

  const keep = new Set(answerIndexes)
  const offset = wrongIndexes.length ? hashSeed(seed) % wrongIndexes.length : 0
  for (let step = 0; step < wrongIndexes.length && keep.size < count; step += 1) {
    keep.add(wrongIndexes[(offset + step) % wrongIndexes.length])
  }
  return list.filter((_, index) => keep.has(index))
}
