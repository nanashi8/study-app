// ── 語源カードの「一緒に覚えられる語」 ────────────────────────────────
// カードに載っている語だけだと、1語しか出ないカードでは関連語が見えない。
// 同じ語根・同じ部品・同じ作り方・語の家族…と、つながりの強い順に集めて、
// どのカードでも「抱き合わせで覚えられる語」を並べられるようにする。
//
// 各候補には理由（同じ語根 port、-er と同じ作り方 …）を必ず付ける。
// 理由の言えないつながりは出さない。
import { ALL_WORDS, getRoot, rootIdsForWord } from '../data/vocab.js'

// 1枚のカードに並べる上限。多すぎると読み切れない。
export const COMPANION_LIMIT = 12
// これを下回るときだけ、最後の手段（同じ分野）で補う。
const MIN_BEFORE_FIELD_FILL = 6
// もとの語として認める最短のつづり（pet＋-y のような偶然を外す）。
const MIN_BASE_LENGTH = 4

// 同じ理由ばかりで埋まらないよう、つながりの弱い種類には上限を置く。
// （-ly で終わる語だけが12個並ぶより、家族・似た意味も混ざるほうが覚えやすい）
const RANK_CAP = { 3: 8, 4: 6, 5: 8, 6: 6, 7: 6 }

const LEVEL_RANK = { 5: 0, 4: 1, 3: 2, pre2: 3, 2: 4, pre1: 5, 1: 6 }

const compact = (value = '') =>
  String(value).toLowerCase().normalize('NFKC').replace(/[^a-z]/g, '')

const affixParts = (word) =>
  (word.etymology?.parts ?? []).filter((part) => part.kind === 'prefix' || part.kind === 'suffix')

// 部品の見分けは、つづりと意味の両方が同じときだけ同じ扱いにする。
// （river の -er と teacher の -er は別物）
const partKey = (part) => `${part.kind}:${compact(part.t)}:${part.gloss ?? ''}`
const partLabel = (part) => (part.kind === 'prefix' ? `${part.t}-` : `-${part.t}`)

// 語尾でよく使う作り方。長いものから先に見る。
// base は「もとの語に許す品詞」、pos は「できあがる語の品詞」。
// つづりが合うだけの偶然（butter＝but＋er、mother＝moth＋er）を品詞で外す。
const SUFFIX_FORMS = [
  { form: 'ness', base: ['形'], pos: ['名'] },
  { form: 'ment', base: ['動'], pos: ['名'] },
  { form: 'tion', base: ['動'], pos: ['名'] },
  { form: 'sion', base: ['動'], pos: ['名'] },
  { form: 'ance', base: ['動'], pos: ['名'] },
  { form: 'ence', base: ['動'], pos: ['名'] },
  { form: 'able', base: ['動'], pos: ['形'] },
  { form: 'ible', base: ['動'], pos: ['形'] },
  { form: 'less', base: ['名'], pos: ['形'] },
  { form: 'ful', base: ['名'], pos: ['形'] },
  { form: 'ous', base: ['名'], pos: ['形'] },
  { form: 'ive', base: ['動'], pos: ['形'] },
  { form: 'ist', base: ['名'], pos: ['名'] },
  { form: 'ity', base: ['形'], pos: ['名'] },
  { form: 'ize', base: ['名', '形'], pos: ['動'] },
  { form: 'ify', base: ['名', '形'], pos: ['動'] },
  { form: 'ish', base: ['名'], pos: ['形'] },
  { form: 'ly', base: ['形'], pos: ['副'] },
  { form: 'er', base: ['動'], pos: ['名'] },
  { form: 'or', base: ['動'], pos: ['名'] },
  { form: 'al', base: ['名'], pos: ['形'] },
  { form: 'y', base: ['名'], pos: ['形'] },
]
// 語頭の作り方は、もとの語と品詞が変わらない。
const PREFIX_FORMS = [
  'inter', 'super', 'under', 'over', 'anti', 'semi', 'non', 'mis', 'pre',
  'dis', 'sub', 'un', 're', 'in', 'im', 'ex', 'co',
]

const HEAD_INDEX = new Map()
const ID_INDEX = new Map()
for (const word of ALL_WORDS) {
  const key = compact(word.word)
  if (key && !HEAD_INDEX.has(key)) HEAD_INDEX.set(key, word)
  ID_INDEX.set(word.id, word)
}

const headword = (value) => HEAD_INDEX.get(compact(value))

/**
 * 語尾から作り方を見つける。もとの語が辞書にあるときだけ「作り方」と認める。
 * teacher → -er（もとの語 teach） / happiness → -ness（happy）
 */
export function suffixFormation(word) {
  const head = compact(word.word)
  for (const suffix of SUFFIX_FORMS) {
    if (!head.endsWith(suffix.form) || head.length < suffix.form.length + 3) continue
    if (!suffix.pos.includes(word.pos)) continue
    const stem = head.slice(0, -suffix.form.length)
    const doubled = stem.length >= 2 && stem.at(-1) === stem.at(-2)
    const candidates = [
      stem,
      `${stem}e`,
      ...(doubled ? [stem.slice(0, -1)] : []), // runner → run（重なった子音を戻す）
      ...(stem.endsWith('i') ? [`${stem.slice(0, -1)}y`] : []), // happiness → happy
      `${stem}y`, // luck → lucky のような形も見る
    ]
    for (const candidate of candidates) {
      const base = HEAD_INDEX.get(candidate)
      if (
        base
        && base.id !== word.id
        && compact(base.word).length >= MIN_BASE_LENGTH
        && suffix.base.includes(base.pos)
      ) {
        return { affix: `-${suffix.form}`, base }
      }
    }
  }
  return null
}

/** 語頭から作り方を見つける。unhappy → un-（happy） */
export function prefixFormation(word) {
  const head = compact(word.word)
  for (const prefix of PREFIX_FORMS) {
    if (!head.startsWith(prefix) || head.length < prefix.length + 3) continue
    const base = HEAD_INDEX.get(head.slice(prefix.length))
    if (
      base
      && base.id !== word.id
      && compact(base.word).length >= MIN_BASE_LENGTH
      && base.pos === word.pos
    ) {
      return { affix: `${prefix}-`, base }
    }
  }
  return null
}

const formationsFor = (word) => [suffixFormation(word), prefixFormation(word)].filter(Boolean)

// ── 索引（読み込み時に一度だけ作る） ──────────────────────────────
const byRoot = new Map()
const byPart = new Map()
const byAnchor = new Map()
const byOrigin = new Map()
const byAffix = new Map()
const byBase = new Map()
const byField = new Map()
const byFieldOnly = new Map()
const byLevelPos = new Map()
const COMPACT_HEADS = []

const push = (map, key, word) => {
  if (!key) return
  if (!map.has(key)) map.set(key, [])
  map.get(key).push(word)
}

for (const word of ALL_WORDS) {
  for (const rootId of rootIdsForWord(word)) push(byRoot, rootId, word)
  for (const part of affixParts(word)) push(byPart, partKey(part), word)
  const profile = word.compression ?? {}
  if (profile.anchorId) push(byAnchor, profile.anchorId, word)
  if (profile.formationKey) {
    push(byOrigin, `${profile.formationKey}:${profile.sourceKey}:${profile.domainKey}`, word)
  }
  for (const formation of formationsFor(word)) {
    push(byAffix, formation.affix, word)
    push(byBase, formation.base.id, word)
  }
  push(byField, `${word.field}:${word.level}`, word)
  push(byFieldOnly, word.field, word)
  push(byLevelPos, `${word.level}:${word.pos}`, word)
  COMPACT_HEADS.push({ word, head: compact(word.word) })
}

const originKey = (source) =>
  source?.formationKey ? `${source.formationKey}:${source.sourceKey}:${source.domainKey}` : null

/**
 * カード（パック）と一緒に覚えられる語を、つながりの強い順に集める。
 * 戻り値は { word, reason, rank } の配列。カードに載っている語は含めない。
 */
export function etymologyCompanions(pack, { limit = COMPANION_LIMIT } = {}) {
  if (!pack) return []
  const studyIds = new Set(pack.studyIds ?? [])
  const studyWords = (pack.studyIds ?? []).map((id) => ID_INDEX.get(id)).filter(Boolean)

  const found = new Map()
  const add = (word, reason, rank) => {
    if (!word || studyIds.has(word.id)) return
    const current = found.get(word.id)
    if (!current || rank < current.rank) found.set(word.id, { word, reason, rank })
  }

  // 0. 同じ語根
  const rootIds = new Set(
    [pack.rootId, ...studyWords.flatMap(rootIdsForWord)].filter(Boolean),
  )
  for (const rootId of rootIds) {
    const label = getRoot(rootId)?.form ?? rootId
    for (const word of byRoot.get(rootId) ?? []) add(word, `同じ語根 ${label}`, 0)
  }

  // 1. 同じ部品（意味まで同じもの）
  for (const word of studyWords) {
    for (const part of affixParts(word)) {
      for (const other of byPart.get(partKey(part)) ?? []) {
        add(other, `同じ部品 ${partLabel(part)}`, 1)
      }
    }
  }

  // 2. 語の家族（書かれている関係・同じ anchor・作り方のもとの語と派生語）
  const anchorIds = new Set(
    [pack.anchorId, ...studyWords.map((word) => word.compression?.anchorId)].filter(Boolean),
  )
  for (const anchorId of anchorIds) {
    const anchor = ID_INDEX.get(anchorId)
    const label = anchor?.word ?? anchorId
    add(anchor, `${label} の家族`, 2)
    for (const word of byAnchor.get(anchorId) ?? []) add(word, `${label} の家族`, 2)
  }
  for (const word of studyWords) {
    for (const item of [...(word.family ?? []), ...(word.derivatives ?? [])]) {
      add(headword(item?.w ?? item), `${word.word} の家族`, 2)
    }
    for (const formation of formationsFor(word)) {
      add(formation.base, `${word.word} のもとの語`, 2)
    }
    for (const derived of byBase.get(word.id) ?? []) {
      add(derived, `${word.word} から作った語`, 2)
    }
  }

  // 4. 同じ形（-er で終わる、un- で始まる…）。つづりの事実だけを言う。
  for (const word of studyWords) {
    for (const formation of formationsFor(word)) {
      const shape = formation.affix.startsWith('-')
        ? `${formation.affix} で終わる語`
        : `${formation.affix} で始まる語`
      for (const other of byAffix.get(formation.affix) ?? []) add(other, shape, 4)
    }
  }

  // 3. つづりの中にその語を含む語
  for (const word of studyWords) {
    const base = compact(word.word)
    if (base.length < 4) continue
    for (const entry of COMPACT_HEADS) {
      if (entry.head === base) continue
      if (entry.head.startsWith(base) || entry.head.endsWith(base)) {
        add(entry.word, `${word.word} を含む語`, 3)
      }
    }
  }

  // 5. 似た意味・反対の意味（辞書に書かれているもの）
  for (const word of studyWords) {
    for (const item of word.synonyms ?? []) {
      add(headword(item?.w ?? item), `${word.word} と似た意味`, 5)
    }
    for (const item of word.antonyms ?? []) {
      add(headword(item?.w ?? item), `${word.word} と反対の意味`, 5)
    }
  }

  // 6. 同じ作られ方・同じ由来
  const originKeys = new Set(
    [originKey(pack), ...studyWords.map((word) => originKey(word.compression))].filter(Boolean),
  )
  for (const key of originKeys) {
    for (const word of byOrigin.get(key) ?? []) add(word, '同じ作られ方の語', 6)
  }

  const sorted = () =>
    [...found.values()].sort(
      (a, b) =>
        a.rank - b.rank ||
        (LEVEL_RANK[a.word.level] ?? 99) - (LEVEL_RANK[b.word.level] ?? 99) ||
        a.word.word.localeCompare(b.word.word, 'en'),
    )

  // 7. ここまでで少なすぎるときだけ、同じ分野・同じ級の語で補う。
  if (sorted().length < MIN_BEFORE_FIELD_FILL) {
    for (const word of studyWords) {
      for (const other of byField.get(`${word.field}:${word.level}`) ?? []) {
        add(other, `同じ分野（${word.field}）`, 7)
      }
    }
  }
  // 同じ級に仲間がいない分野もある。そのときは級を問わず同じ分野から拾う。
  if (sorted().length === 0) {
    for (const word of studyWords) {
      for (const other of byFieldOnly.get(word.field) ?? []) {
        add(other, `同じ分野（${word.field}）`, 7)
      }
    }
  }
  // 分野に1語しかない語（theorem など）でも空にしない。同じ級・同じ品詞から拾う。
  if (sorted().length === 0) {
    for (const word of studyWords) {
      for (const other of byLevelPos.get(`${word.level}:${word.pos}`) ?? []) {
        add(other, '同じ級・同じ品詞', 8)
      }
    }
  }

  // まずは種類の上限を守って選び、それでも足りなければ残りから足す。
  const ordered = sorted()
  const picked = []
  const usedByRank = new Map()
  for (const item of ordered) {
    if (picked.length >= limit) break
    const used = usedByRank.get(item.rank) ?? 0
    if (used >= (RANK_CAP[item.rank] ?? limit)) continue
    usedByRank.set(item.rank, used + 1)
    picked.push(item)
  }
  if (picked.length < limit) {
    const chosen = new Set(picked.map((item) => item.word.id))
    for (const item of ordered) {
      if (picked.length >= limit) break
      if (!chosen.has(item.word.id)) picked.push(item)
    }
  }
  return picked
}
