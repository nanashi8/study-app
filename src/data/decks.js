// デッキ（学習グループ）の自動生成。
//
// 目的：6800超の語を「目次→章→デッキ」の階層に整理し、中高生が
//       グループ単位で学べるようにする。進捗もデッキ単位で持てるので
//       持ち運ぶコード/QR が小さく収まる（語単位より2桁小さい）。
//
// 設計の肝＝「安定性」：
//   デッキの中身は《級 × 分野 × 安定ID順の20語チャンク》で機械的に決まる。
//   単語IDは内容由来で不変（compact.js）。後から語を足しても、その語は
//   ID順の決まった位置に入るだけで、他デッキの構成は基本そのまま。
//   → 過去に発行した進捗コードが将来も意味を保てる。
//
// 進捗の保存粒度：
//   端末内は従来どおり語単位SRS（精密な復習）。持ち運ぶのはデッキ達成度
//   だけ。deckId は安定キーなので、コードはデッキIDをキーに保存できる。
import {
  ALL_WORDS,
  VOCAB_FIELD_GROUPS,
  vocabFieldGroupFor,
  wordsByLevel,
} from './vocab.js'
import { LEVELS } from './levels.js'

// デッキ構成のバージョン。チャンクサイズや合流規則を変えたら上げる。
// 進捗コード側はこの番号を見て古い構成からの移行を判断できる。
export const DECK_VERSION = 1

// 1デッキの目安語数（中高生が一度に扱える量）と上下限。
const CHUNK = 20
const MIN_DECK = 15 // これ未満のデッキは作らない（厳守）
const MAX_DECK = 25 // できればこれ以下に分割する（MIN_DECKを割るくらいなら超過を許す）
// この語数未満の分野は、同じ級の「その他」章へ合流させる（極小デッキ防止）。
const MERGE_MIN = MIN_DECK
const MISC_FIELD = 'その他'

// 級内での章（分野）の並び順。大きい分野を先に、よく出る順で。
// ここに無い分野は後ろに回り、同点はID順で安定させる。
const FIELD_ORDER = [
  '一般', '動作・行為', '性質・状態', '様子・程度', '機能語', '時間・数量',
  '心理', '家族・人', '食・生活', '自然', '科学', '医学', '技術',
  '経済', 'ビジネス', '政治', '法律', '教育', '言語', '地理',
  'スポーツ', '芸術', '測定',
]
const fieldRank = (f) => {
  const i = FIELD_ORDER.indexOf(f)
  return i === -1 ? FIELD_ORDER.length : i
}

// 安定ソート：まずID辞書順。デッキ内の語順を不変にするための基準。
const byId = (a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

// 級の中の語を「章（分野）」にまとめる。極小分野は「その他」に合流。
function chaptersOf(levelId) {
  const words = wordsByLevel(levelId)
  const byField = {}
  for (const w of words) (byField[w.field || MISC_FIELD] ??= []).push(w)

  // 合流：MERGE_MIN 未満の分野は「その他」へ寄せる。
  const misc = byField[MISC_FIELD] ?? []
  delete byField[MISC_FIELD]
  for (const f of Object.keys(byField)) {
    if (byField[f].length < MERGE_MIN) {
      misc.push(...byField[f])
      delete byField[f]
    }
  }
  if (misc.length) byField[MISC_FIELD] = misc

  // 章を並べる：FIELD_ORDER 順、その他は常に最後。
  return Object.entries(byField)
    .map(([field, ws]) => ({ field, words: ws.slice().sort(byId) }))
    .sort((a, b) => {
      if (a.field === MISC_FIELD) return 1
      if (b.field === MISC_FIELD) return -1
      return fieldRank(a.field) - fieldRank(b.field) || byId({ id: a.field }, { id: b.field })
    })
}

// 章を何デッキに割るか決める。目安は CHUNK 語だが、
// 各デッキが MIN_DECK〜MAX_DECK 語に収まるよう分割数を調整する。
function chunkCount(n) {
  let total = Math.max(1, Math.round(n / CHUNK))
  while (total > 1 && Math.floor(n / total) < MIN_DECK) total-- // 小さすぎ→減らす
  // 大きすぎ→増やす。ただし増やすと MIN_DECK を割る場合は増やさない（最小を厳守）。
  while (Math.ceil(n / total) > MAX_DECK && Math.floor(n / (total + 1)) >= MIN_DECK) total++
  return total
}

// 章を「均等に」デッキへ割る。
// 例: 21語 → 1デッキ(21)、41語 → 2デッキ(21,20)。末尾に極小デッキを作らない。
function decksOfChapter(levelId, field, words) {
  const total = chunkCount(words.length)
  const base = Math.floor(words.length / total)
  const extra = words.length % total // 先頭 extra 個のデッキだけ +1 語
  const decks = []
  let i = 0
  for (let part = 1; part <= total; part++) {
    const size = base + (part <= extra ? 1 : 0)
    const slice = words.slice(i, i + size)
    i += size
    decks.push({
      id: `${levelId}|${field}|${part}`, // 安定キー（級|分野|連番）
      levelId,
      field,
      part,
      partCount: total,
      title: total > 1 ? `${field} ${part}` : field,
      wordIds: slice.map((w) => w.id),
      size: slice.length,
    })
  }
  return decks
}

// 全デッキ（目次のフラット版）。級→章→デッキの順で安定に並ぶ。
export const DECKS = LEVELS.flatMap((l) =>
  chaptersOf(l.id).flatMap((ch) => decksOfChapter(l.id, ch.field, ch.words)),
)

export const DECKS_BY_ID = Object.fromEntries(DECKS.map((d) => [d.id, d]))

// 目次（級→章→デッキ）の階層ビュー。UI はこれをそのまま描ける。
export const DECK_TOC = LEVELS.map((l) => {
  const level = l
  const chapters = chaptersOf(l.id).map((ch) => ({
    field: ch.field,
    decks: decksOfChapter(l.id, ch.field, ch.words),
    size: ch.words.length,
  }))
  return {
    level,
    chapters,
    deckCount: chapters.reduce((n, c) => n + c.decks.length, 0),
    size: chapters.reduce((n, c) => n + c.size, 0),
  }
}).filter((x) => x.size > 0)

// 現行の学習画面用目次。旧 DECKS/DECK_TOC は進捗コード内の並びとIDを
// 保つため変更せず、画面では20語チャンクを使わず10の学習分野だけを見せる。
function learningChaptersOf(levelId) {
  const byGroup = new Map(VOCAB_FIELD_GROUPS.map((group) => [group.id, []]))
  for (const word of wordsByLevel(levelId)) {
    const group = vocabFieldGroupFor(word)
    if (group) byGroup.get(group.id).push(word)
  }
  return VOCAB_FIELD_GROUPS
    .map((group) => ({ group, words: byGroup.get(group.id).slice().sort(byId) }))
    .filter(({ words }) => words.length)
}

export const LEARNING_FIELD_TOC = LEVELS.map((level) => {
  const chapters = learningChaptersOf(level.id).map(({ group, words }) => ({
    field: group.label,
    fieldId: group.id,
    emoji: group.emoji,
    color: group.color,
    description: group.description,
    wordIds: words.map((word) => word.id),
    size: words.length,
  }))
  return {
    level,
    chapters,
    size: chapters.reduce((count, chapter) => count + chapter.size, 0),
  }
}).filter(({ size }) => size > 0)

// デッキの達成度（0〜1）。SRSのbox≥4を「習得」とみなす（progressと同基準）。
export function deckMastery(deck, srs = {}) {
  if (!deck?.wordIds?.length) return 0
  const mastered = deck.wordIds.filter((id) => (srs[id]?.box ?? 0) >= 4).length
  return mastered / deck.wordIds.length
}

// ── 持ち運ぶ進捗（デッキ単位）の超コンパクト符号化 ───────────────────
// QR1枚に収めるため、deckId をキーに持たず《DECKS の並び順に固定した
// 位置》で達成度を並べる。各デッキは 0〜5 の1桁（達成度を6段階に量子化）。
// 並び順は DECK_VERSION で固定。構成を変えるときは版を上げ、旧版コードは
// migrate で読み替える（今は同版のみ対応）。
const QUANT = 5 // 達成度を 0..5 の6段階に量子化

// srs（語単位）→ デッキ達成度の桁列（"0".."5" を DECKS 順に連結）。
export function encodeDeckDigits(srs = {}) {
  return DECKS.map((d) => String(Math.round(deckMastery(d, srs) * QUANT))).join('')
}

// 桁列 → { deckId: 達成度(0..1) }。長さが合わなければ版ずれとみなす。
export function decodeDeckDigits(digits) {
  if (typeof digits !== 'string' || digits.length !== DECKS.length) return null
  const out = {}
  for (let i = 0; i < DECKS.length; i++) {
    const n = Number(digits[i])
    if (n > 0) out[DECKS[i].id] = n / QUANT
  }
  return out
}
