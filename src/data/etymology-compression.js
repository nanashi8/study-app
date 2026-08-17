import {
  ETYMOLOGY_DOMAIN_META,
  ETYMOLOGY_FORMATION_META,
  ETYMOLOGY_SOURCE_META,
  etymologyDomainKey,
  etymologyFormationKey,
  etymologySourceKey,
} from './etymology-history.js'

// 全語彙を、語源の確かさに応じた小さな学習パックへまとめる。
//
// 大切な境界:
// - parts / roots / family は、既存データに明示された関係だけを使う。
// - それらが無い語は、同語根だと推測せず「成り立ち・出発言語・意味分野」の
//   3軸で整理する。
// - 言語名と形成法を同じ「型」へ混在させず、語どうしの同源関係も主張しない。

export const ETYMOLOGY_PACK_SIZE = 8

export const ETYMOLOGY_MODE_META = {
  formula: {
    label: '部品で分ける',
    short: '部品',
    emoji: '🧩',
    description: '単語を小さな部品に分け、左から意味を足します。',
    tip: '色のついた部品を順に見て、単語全体の意味を予想してみよう。',
  },
  root: {
    label: '同じ語根',
    short: '語根',
    emoji: '🌳',
    description: '同じ語根（意味の中心になる部品）を持つ単語を比べます。',
    tip: '語根の意味を1つ覚えると、初めて見る単語の意味も予想しやすくなります。',
  },
  family: {
    label: '語の家族',
    short: '家族',
    emoji: '🔗',
    description: 'もとの単語と、そこから形が変わった単語を一緒に覚えます。',
    tip: 'つづりの同じ部分と、意味がどう広がったかを見比べよう。',
  },
  origin: {
    label: 'ことばの歴史',
    short: '歴史',
    emoji: '🧭',
    description: 'もとの形が表す意味から、今の意味までをたどります。',
    tip: '言語名ではなく、1語ずつ形と意味のつながりを確かめよう。',
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
const FORMATION_ORDER = Object.fromEntries(
  Object.keys(ETYMOLOGY_FORMATION_META).map((key, index) => [key, index]),
)
const SOURCE_ORDER = Object.fromEntries(
  Object.keys(ETYMOLOGY_SOURCE_META).map((key, index) => [key, index]),
)
const DOMAIN_ORDER = Object.fromEntries(
  Object.keys(ETYMOLOGY_DOMAIN_META).map((key, index) => [key, index]),
)
const WORD_CLASS_LABEL = {
  名: '名詞',
  動: '動詞',
  形: '修飾語',
  副: '修飾語',
  前: '機能語',
  接: '機能語',
  代: '機能語',
}

const compactHead = (value = '') =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '')

const exactHead = (value = '') => value.trim().toLowerCase()

// 語源進捗はパックIDをFirebaseのオブジェクトキーにも使う。
// 「. # $ [ ] /」を含む語源注記でも保存できるよう、動的部分だけURI形式へ逃がす。
const safeKeySegment = (value = '') =>
  encodeURIComponent(String(value)).replaceAll('.', '%2E')

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

const levelSpan = (words) => {
  const levels = unique(words.map((word) => word.level))
    .sort((a, b) => (LEVEL_RANK[a] ?? 99) - (LEVEL_RANK[b] ?? 99))
  if (!levels.length) return ''
  const first = LEVEL_LABEL[levels[0]] ?? levels[0]
  const last = LEVEL_LABEL[levels.at(-1)] ?? levels.at(-1)
  return first === last ? first : `${first}〜${last}`
}

// 同じ形成法・言語層・意味領域の中でも、まず同じ詳細分野を8語ずつ固める。
// 8語未満の端数だけを同じ意味領域内で合わせ、無関係な分野の機械分割を避ける。
const originCohesiveGroups = (words, domainKey) => {
  const byField = new Map()
  for (const word of words) {
    const key = domainKey === 'core'
      ? `${word.field}:${WORD_CLASS_LABEL[word.pos] ?? word.pos}`
      : word.field
    if (!byField.has(key)) byField.set(key, [])
    byField.get(key).push(word)
  }

  const complete = []
  const remainder = []
  for (const field of [...byField.keys()].sort((a, b) => a.localeCompare(b, 'ja'))) {
    const sorted = byField.get(field).sort(wordSort)
    const fullLength = Math.floor(sorted.length / ETYMOLOGY_PACK_SIZE) * ETYMOLOGY_PACK_SIZE
    for (let index = 0; index < fullLength; index += ETYMOLOGY_PACK_SIZE) {
      complete.push(sorted.slice(index, index + ETYMOLOGY_PACK_SIZE))
    }
    const leftover = sorted.slice(fullLength)
    if (domainKey === 'core' && leftover.length) complete.push(leftover)
    else remainder.push(...leftover)
  }

  return [...complete, ...chunks(remainder, ETYMOLOGY_PACK_SIZE)].sort((a, b) =>
    (LEVEL_RANK[a[0]?.level] ?? 99) - (LEVEL_RANK[b[0]?.level] ?? 99) ||
    a[0]?.field.localeCompare(b[0]?.field, 'ja') ||
    a[0]?.word.localeCompare(b[0]?.word, 'en'))
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

    const sourceKey = etymologySourceKey(word)
    const formationKey = etymologyFormationKey(word, sourceKey)
    const domainKey = etymologyDomainKey(word)
    const groupKey = `${formationKey}:${sourceKey}:${domainKey}`
    assignments.set(word.id, { mode: 'origin', groupKey })
    add(originBuckets, groupKey, word.id, { formationKey, sourceKey, domainKey })
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
        formationKey: pack.formationKey,
        sourceKey: pack.sourceKey,
        domainKey: pack.domainKey,
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
        ? `${root.form}（${root.meaning}）を使う単語`
        : part
          ? `${part.kind === 'prefix' ? `${part.t}-` : `-${part.t}`}${part.gloss ? `（${part.gloss}）` : ''}を使う単語`
          : '部品に分けて覚える単語'
      registerPack({
        id: `formula:${safeKeySegment(groupKey)}:${safeKeySegment(coverageIds[0])}`,
        mode: 'formula',
        title,
        subtitle: '部品の意味を左から足してみよう',
        description: ETYMOLOGY_MODE_META.formula.description,
        caution: '部品の意味は手がかりです。今の意味とぴったり同じにならない語もあります。',
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
      id: `root:${safeKeySegment(rootId)}`,
      mode: 'root',
      title: `${root?.form ?? rootId}＝${root?.meaning ?? '意味の中心'} の仲間`,
      subtitle: `同じ語根を持つ${coverageIds.length}語`,
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
        id: `family:${safeKeySegment(anchorId)}:${safeKeySegment(coverageIds[0])}`,
        mode: 'family',
        title: `${anchor.word} から広がる語`,
        subtitle: 'もとの語と形の変化を比べよう',
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
    const formation = ETYMOLOGY_FORMATION_META[bucket.formationKey]
    const source = ETYMOLOGY_SOURCE_META[bucket.sourceKey]
    const domain = ETYMOLOGY_DOMAIN_META[bucket.domainKey]
    const grouped = originCohesiveGroups(
      bucket.ids.map((id) => byId.get(id)),
      bucket.domainKey,
    )
    for (const group of grouped) {
      const coverageIds = group.map((word) => word.id)
      const fields = unique(group.map((word) => word.field))
      const wordClasses = unique(group.map((word) => WORD_CLASS_LABEL[word.pos] ?? word.pos))
      const fieldLabel = bucket.domainKey === 'core' && wordClasses.length === 1
        ? `${domain.label}の${wordClasses[0]}`
        : fields.length === 1
          ? fields[0]
          : domain.label
      const topicLabel = fieldLabel.endsWith('語') ? fieldLabel : `${fieldLabel}のことば`
      const sharedLabel = `${formation.label}・${source.label}・${fieldLabel}`
      registerPack({
        id: `origin:${safeKeySegment(groupKey)}:${safeKeySegment(coverageIds[0])}`,
        mode: 'origin',
        title: topicLabel,
        subtitle: `${formation.short}・${fieldLabel}（${levelSpan(group)}）`,
        description: formation.description,
        caution:
          '同じ語根の仲間ではありません。共通点は、作られ方と今の意味の分野です。',
        emoji: formation.emoji,
        formationKey: bucket.formationKey,
        sourceKey: bucket.sourceKey,
        domainKey: bucket.domainKey,
        fields,
        wordClasses,
        fieldLabel,
        sharedLabel,
        levelLabel: levelSpan(group),
        coverageIds,
        studyIds: coverageIds,
      })
    }
  }

  packs.sort((a, b) =>
    MODE_ORDER[a.mode] - MODE_ORDER[b.mode] ||
    (FORMATION_ORDER[a.formationKey] ?? 99) - (FORMATION_ORDER[b.formationKey] ?? 99) ||
    (SOURCE_ORDER[a.sourceKey] ?? 99) - (SOURCE_ORDER[b.sourceKey] ?? 99) ||
    (DOMAIN_ORDER[a.domainKey] ?? 99) - (DOMAIN_ORDER[b.domainKey] ?? 99) ||
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
  const originProfiles = [...profiles.values()].filter((profile) => profile.mode === 'origin')
  const countOriginAxis = (meta, key) => Object.fromEntries(
    Object.keys(meta).map((id) => [
      id,
      originProfiles.filter((profile) => profile[key] === id).length,
    ]),
  )
  const originPacks = packs.filter((pack) => pack.mode === 'origin')

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
      origin: {
        formationCounts: countOriginAxis(ETYMOLOGY_FORMATION_META, 'formationKey'),
        sourceCounts: countOriginAxis(ETYMOLOGY_SOURCE_META, 'sourceKey'),
        domainCounts: countOriginAxis(ETYMOLOGY_DOMAIN_META, 'domainKey'),
        packs: originPacks.length,
        singletonPacks: originPacks.filter((pack) => pack.coverageIds.length === 1).length,
      },
    },
  }
}
