// 全語彙を、語源の確かさに応じた小さな学習パックへまとめる。
//
// 大切な境界:
// - parts / roots / family は、既存データに明示された関係だけを使う。
// - それらが無い語は、同語根だと推測せず「由来の型」で整理する。
// - 由来の型は記憶方法をそろえる箱であり、語どうしの同源関係を主張しない。

export const ETYMOLOGY_PACK_SIZE = 8

export const ETYMOLOGY_MODE_META = {
  formula: {
    label: '部品の式',
    short: '式',
    emoji: '🧩',
    description: '接頭辞・語根・接尾辞を足し、意味を組み立てます。',
  },
  root: {
    label: '共有語根',
    short: '語根',
    emoji: '🌳',
    description: '同じ意味の核を持つ語を、ひと束で覚えます。',
  },
  family: {
    label: '語族',
    short: '語族',
    emoji: '🔗',
    description: '基語と派生形を往復し、綴りと意味をまとめます。',
  },
  origin: {
    label: '由来の型',
    short: '由来',
    emoji: '🗺️',
    description: '分解できない語は、借用元や意味変化の型で整理します。',
  },
}

export const ETYMOLOGY_ORIGIN_META = {
  compound: {
    label: '見える部品・短縮',
    emoji: '🧱',
    description: '複合語・短縮語として、見える材料を手掛かりにします。',
  },
  sound: {
    label: '音から生まれた語',
    emoji: '🔊',
    description: '擬音・音の響きと単語を結び付けます。',
  },
  name: {
    label: '名前・地名から',
    emoji: '📍',
    description: '人名・地名・固有名と現在の意味を結び付けます。',
  },
  uncertain: {
    label: '由来未詳の基本語',
    emoji: '🪨',
    description: '無理に分解せず、古くからある形を一つの核として固定します。',
  },
  oldEnglish: {
    label: '古英語の基本語',
    emoji: '🏡',
    description: '英語の古い層にある日常語を、由来の流れで整理します。',
  },
  norse: {
    label: '古ノルド語の層',
    emoji: '⛵',
    description: '北欧から英語へ入った語を、歴史の層として整理します。',
  },
  germanic: {
    label: '英語・ゲルマン語の層',
    emoji: '🌲',
    description: '英語・中英語・ゲルマン諸語の古い語をまとめます。',
  },
  french: {
    label: 'フランス語経由',
    emoji: '🏰',
    description: 'フランス語を経て英語へ入った語を、意味変化と一緒に覚えます。',
  },
  latin: {
    label: 'ラテン語の層',
    emoji: '🏛️',
    description: 'ラテン語由来の語を、元の意味から現在の意味へたどります。',
  },
  greek: {
    label: 'ギリシャ語の層',
    emoji: '🏺',
    description: '学術語に多いギリシャ語由来の語を、元の像で固定します。',
  },
  world: {
    label: '世界からの借用語',
    emoji: '🌍',
    description: 'さまざまな言語から英語へ入った語を、借用の物語で覚えます。',
  },
  story: {
    label: '意味変化の物語',
    emoji: '💡',
    description: '元の意味から現在の意味へ進む短い物語を記憶フックにします。',
  },
}

const LEVEL_RANK = { '5': 0, '4': 1, '3': 2, pre2: 3, '2': 4, pre1: 5, '1': 6 }
const LEVEL_LABEL = {
  '5': '5級',
  '4': '4級',
  '3': '3級',
  pre2: '準2級',
  '2': '2級',
  pre1: '準1級',
  '1': '1級',
}
const MODE_ORDER = { formula: 0, root: 1, family: 2, origin: 3 }

const compactHead = (value = '') =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '')

const exactHead = (value = '') => value.trim().toLowerCase()

const unique = (items) => [...new Set(items)]

const chunks = (items, size) => {
  const out = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}

const formulaParts = (word) => word.etymology?.parts ?? []

const hasFormula = (word) => formulaParts(word).length >= 2

const relationItems = (word) => [
  ...(word.family ?? []),
  ...(word.derivatives ?? []),
]

const wordSort = (a, b) =>
  (LEVEL_RANK[a.level] ?? 99) - (LEVEL_RANK[b.level] ?? 99) ||
  a.word.localeCompare(b.word, 'en')

/** 由来説明を、同源関係ではなく「覚え方の型」へ分類する。 */
export function etymologyOriginKey(word) {
  const text = `${word.etymology?.origin ?? ''} ${word.etymology?.note ?? ''}`

  if (/由来(?:は)?(?:不明|未詳|はっきりしない)|語源(?:は)?(?:不明|未詳)/.test(text)) {
    return 'uncertain'
  }
  if (/(?:\+|＋)|複合語|短縮(?:形|語)?|略語|略称|頭文字|を組み合わせ|を合わせた/.test(text)) {
    return 'compound'
  }
  if (/擬音|擬態|鳴き声|音をまね|音の響き|音から生まれ/.test(text)) return 'sound'
  if (/人名|地名|姓|固有名|商標|発明者|神名|人物名/.test(text)) return 'name'
  if (/古英語/.test(text)) return 'oldEnglish'
  if (/古ノルド|ノルド語/.test(text)) return 'norse'
  if (/フランス語/.test(text)) return 'french'
  if (/ラテン語|ラテン /.test(text)) return 'latin'
  if (/ギリシャ語|ギリシャ /.test(text)) return 'greek'
  if (/中英語|ゲルマン語|古高ドイツ語|オランダ語|ドイツ語|英語由来/.test(text)) {
    return 'germanic'
  }
  if (
    /アラビア|サンスクリット|ヒンディー|ウルドゥー|ペルシャ|トルコ|中国語|日本語|マレー語|ポリネシア|イタリア語|スペイン語|ポルトガル語|ロシア語|ケルト語|ウェールズ語|アフリカ/.test(text)
  ) {
    return 'world'
  }
  return 'story'
}

function makeHeadwordLookup(words) {
  const exact = new Map()
  const compact = new Map()
  for (const word of words) {
    exact.set(exactHead(word.word), word)
    const key = compactHead(word.word)
    if (key && !compact.has(key)) compact.set(key, word)
  }
  return (value) => exact.get(exactHead(value)) ?? compact.get(compactHead(value))
}

function resolvedRelations(word, findHeadword) {
  return unique(
    relationItems(word)
      .map((item) => findHeadword(item.w)?.id)
      .filter((id) => id && id !== word.id),
  )
}

function primaryRootId(word, rootUse) {
  const manual = formulaParts(word)
    .map((part) => part.root)
    .find((rootId) => rootId && word.roots.includes(rootId))
  if (manual) return manual
  return [...word.roots].sort(
    (a, b) => (rootUse.get(b) ?? 0) - (rootUse.get(a) ?? 0) || a.localeCompare(b),
  )[0]
}

function formulaGroup(word, rootUse) {
  const rootId = word.roots.length ? primaryRootId(word, rootUse) : null
  if (rootId) return { key: `root-${rootId}`, rootId }

  const reusable = formulaParts(word)
    .filter((part) => ['prefix', 'suffix'].includes(part.kind) && compactHead(part.t).length > 0)
    .sort((a, b) => {
      const kindDiff = Number(a.kind === 'prefix') - Number(b.kind === 'prefix')
      return kindDiff || compactHead(a.t).length - compactHead(b.t).length
    })[0]

  if (reusable) {
    return {
      key: `${reusable.kind}-${compactHead(reusable.t)}-${reusable.gloss ?? ''}`,
      part: reusable,
    }
  }
  return { key: `parts-${word.level}` }
}

function anchorScore(target, candidate, relationDegree) {
  const targetHead = compactHead(target.word)
  const candidateHead = compactHead(candidate.word)
  const isVisibleBase =
    candidate.id !== target.id &&
    candidateHead.length >= 3 &&
    (targetHead.startsWith(candidateHead) || targetHead.endsWith(candidateHead))
  return [
    isVisibleBase ? 0 : 1,
    LEVEL_RANK[candidate.level] ?? 99,
    -(relationDegree.get(candidate.id) ?? 0),
    candidateHead.length,
    candidateHead,
  ]
}

function compareScore(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) continue
    return a[i] < b[i] ? -1 : 1
  }
  return 0
}

/**
 * 全単語に1つだけ compression profile を付け、学習パックを作る。
 * 戻り値の coverageIds は全語彙の厳密なパーティションになる。
 */
export function buildEtymologyCompression(words, roots) {
  const byId = new Map(words.map((word) => [word.id, word]))
  const rootsById = new Map(roots.map((root) => [root.id, root]))
  const findHeadword = makeHeadwordLookup(words)
  const relations = new Map()
  const rootUse = new Map(roots.map((root) => [root.id, 0]))

  for (const word of words) {
    relations.set(word.id, resolvedRelations(word, findHeadword))
    for (const rootId of word.roots) rootUse.set(rootId, (rootUse.get(rootId) ?? 0) + 1)
  }
  const relationDegree = new Map([...relations].map(([id, ids]) => [id, ids.length]))

  const assignments = new Map()
  const formulaBuckets = new Map()
  const rootBuckets = new Map()
  const familyBuckets = new Map()
  const originBuckets = new Map()

  const add = (map, key, id, meta = {}) => {
    if (!map.has(key)) map.set(key, { ids: [], ...meta })
    map.get(key).ids.push(id)
  }

  for (const word of words) {
    if (hasFormula(word)) {
      const group = formulaGroup(word, rootUse)
      assignments.set(word.id, { mode: 'formula', groupKey: group.key })
      add(formulaBuckets, group.key, word.id, group)
      continue
    }

    if (word.roots.length) {
      const rootId = primaryRootId(word, rootUse)
      assignments.set(word.id, { mode: 'root', groupKey: rootId })
      add(rootBuckets, rootId, word.id, { rootId })
      continue
    }

    const relationIds = relations.get(word.id)
    if (relationIds.length) {
      const candidates = [word.id, ...relationIds]
        .map((id) => byId.get(id))
        .filter(Boolean)
        .sort((a, b) =>
          compareScore(
            anchorScore(word, a, relationDegree),
            anchorScore(word, b, relationDegree),
          ))
      const anchorId = candidates[0].id
      assignments.set(word.id, { mode: 'family', groupKey: anchorId })
      add(familyBuckets, anchorId, word.id, { anchorId })
      continue
    }

    const originKey = etymologyOriginKey(word)
    const groupKey = `${originKey}-${word.level}`
    assignments.set(word.id, { mode: 'origin', groupKey })
    add(originBuckets, groupKey, word.id, { originKey, level: word.level })
  }

  const packs = []
  const profiles = new Map()

  const registerPack = (pack) => {
    pack.levelRank = Math.min(
      ...pack.coverageIds.map((id) => LEVEL_RANK[byId.get(id)?.level] ?? 99),
    )
    packs.push(pack)
    for (const id of pack.coverageIds) {
      profiles.set(id, {
        mode: pack.mode,
        packId: pack.id,
        label: ETYMOLOGY_MODE_META[pack.mode].label,
        size: Math.max(pack.coverageIds.length, pack.studyIds.length),
        rootId: pack.rootId,
        anchorId: pack.anchorId,
        originKey: pack.originKey,
      })
    }
  }

  for (const [groupKey, bucket] of formulaBuckets) {
    const sorted = bucket.ids.map((id) => byId.get(id)).sort(wordSort)
    for (const group of chunks(sorted, ETYMOLOGY_PACK_SIZE)) {
      const coverageIds = group.map((word) => word.id)
      const root = bucket.rootId ? rootsById.get(bucket.rootId) : null
      const part = bucket.part
      const title = root
        ? `${root.form} の意味の式`
        : part
          ? `${part.kind === 'prefix' ? `${part.t}-` : `-${part.t}`} を使う意味の式`
          : 'パーツで組み立てる'
      registerPack({
        id: `formula:${groupKey}:${coverageIds[0]}`,
        mode: 'formula',
        title,
        subtitle: '前から足して意味を予想',
        description: ETYMOLOGY_MODE_META.formula.description,
        caution: '',
        emoji: ETYMOLOGY_MODE_META.formula.emoji,
        rootId: bucket.rootId,
        coverageIds,
        studyIds: coverageIds,
      })
    }
  }

  for (const [rootId, bucket] of rootBuckets) {
    const root = rootsById.get(rootId)
    const coverageIds = bucket.ids
      .map((id) => byId.get(id))
      .sort(wordSort)
      .map((word) => word.id)
    registerPack({
      id: `root:${rootId}`,
      mode: 'root',
      title: `${root?.form ?? rootId}＝${root?.meaning ?? '意味の核'}`,
      subtitle: `${coverageIds.length}語を1つの核で整理`,
      description: ETYMOLOGY_MODE_META.root.description,
      caution: '',
      emoji: root?.emoji ?? ETYMOLOGY_MODE_META.root.emoji,
      rootId,
      coverageIds,
      studyIds: coverageIds.slice(0, ETYMOLOGY_PACK_SIZE),
    })
  }

  for (const [anchorId, bucket] of familyBuckets) {
    const anchor = byId.get(anchorId)
    const sorted = bucket.ids.map((id) => byId.get(id)).sort(wordSort)
    for (const group of chunks(sorted, ETYMOLOGY_PACK_SIZE - 1)) {
      const coverageIds = group.map((word) => word.id)
      const supportIds = unique(
        coverageIds.flatMap((id) => relations.get(id) ?? []),
      )
        .map((id) => byId.get(id))
        .filter(Boolean)
        .sort(wordSort)
        .map((word) => word.id)
      const studyIds = unique([anchorId, ...coverageIds, ...supportIds])
        .slice(0, ETYMOLOGY_PACK_SIZE)
      registerPack({
        id: `family:${anchorId}:${coverageIds[0]}`,
        mode: 'family',
        title: `${anchor.word} を核にまとめる`,
        subtitle: '基語・派生形を1セットに',
        description: ETYMOLOGY_MODE_META.family.description,
        caution: '',
        emoji: ETYMOLOGY_MODE_META.family.emoji,
        anchorId,
        coverageIds,
        studyIds,
      })
    }
  }

  for (const [groupKey, bucket] of originBuckets) {
    const meta = ETYMOLOGY_ORIGIN_META[bucket.originKey]
    const sorted = bucket.ids.map((id) => byId.get(id)).sort((a, b) =>
      a.field.localeCompare(b.field, 'ja') || wordSort(a, b))
    for (const group of chunks(sorted, ETYMOLOGY_PACK_SIZE)) {
      const coverageIds = group.map((word) => word.id)
      registerPack({
        id: `origin:${groupKey}:${coverageIds[0]}`,
        mode: 'origin',
        title: `${meta.label}・${LEVEL_LABEL[bucket.level] ?? bucket.level}`,
        subtitle: '由来の読み方をそろえる',
        description: meta.description,
        caution: 'この箱は同じ語根の集まりではありません。由来の覚え方だけを共有します。',
        emoji: meta.emoji,
        originKey: bucket.originKey,
        coverageIds,
        studyIds: coverageIds,
      })
    }
  }

  packs.sort((a, b) =>
    MODE_ORDER[a.mode] - MODE_ORDER[b.mode] ||
    a.levelRank - b.levelRank ||
    b.coverageIds.length - a.coverageIds.length ||
    a.title.localeCompare(b.title, 'ja') ||
    a.id.localeCompare(b.id))

  const counts = Object.fromEntries(Object.keys(ETYMOLOGY_MODE_META).map((mode) => [mode, 0]))
  for (const profile of profiles.values()) counts[profile.mode]++
  const packCounts = Object.fromEntries(Object.keys(ETYMOLOGY_MODE_META).map((mode) => [
    mode,
    packs.filter((pack) => pack.mode === mode).length,
  ]))

  return {
    words: words.map((word) => ({
      ...word,
      compression: profiles.get(word.id),
    })),
    packs,
    packsById: Object.fromEntries(packs.map((pack) => [pack.id, pack])),
    summary: {
      total: words.length,
      covered: profiles.size,
      counts,
      packCounts,
      packs: packs.length,
    },
  }
}
