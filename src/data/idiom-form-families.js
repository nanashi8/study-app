import { PHRASES } from './phrases.js'

const ENDING_WORDS = Object.freeze([
  'up', 'at', 'with', 'out', 'off', 'on', 'in', 'to', 'of', 'for', 'from', 'about',
  'down', 'over', 'back', 'away', 'into', 'around', 'through', 'across', 'along',
  'against', 'after', 'as', 'by', 'under', 'upon', 'without', 'together', 'apart',
  'forth', 'forward', 'ahead',
])
const ENDING_WORD_SET = new Set(ENDING_WORDS)
const PREPOSITIONS = new Set([
  'about', 'after', 'against', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'of',
  'on', 'over', 'through', 'to', 'under', 'upon', 'with', 'without',
])
const LEADING_PREPOSITIONS = new Set([
  'after', 'as', 'at', 'before', 'by', 'for', 'from', 'in', 'of', 'on', 'out',
  'through', 'to', 'under', 'with', 'without',
])
const VERB_HEADS = new Set([
  'bear', 'break', 'bring', 'brush', 'call', 'carry', 'catch', 'come', 'cut', 'do',
  'draw', 'drop', 'fall', 'feel', 'fill', 'find', 'get', 'give', 'go', 'hand', 'have',
  'help', 'hold', 'keep', 'lay', 'leave', 'let', 'live', 'look', 'lose', 'make', 'meet',
  'pass', 'pay', 'pick', 'play', 'pull', 'put', 'reach', 'read', 'run', 'see', 'set',
  'show', 'sit', 'speak', 'stand', 'step', 'stick', 'take', 'talk', 'think', 'throw',
  'turn', 'work', 'write',
])
const STOP_TOKENS = new Set([
  'a', 'an', 'the', 'one', 'ones', "one's", 'and', 'or', 'be', 'do', 'doing',
  'blank', 'slot', ...ENDING_WORDS,
])

const CATEGORY_META = Object.freeze({
  'phrasal-verb': {
    title: '句動詞の仲間',
    summary: '動詞と副詞・前置詞を一つのまとまりとして使う熟語を比べます。',
  },
  preposition: {
    title: '前置詞を中心にした表現',
    summary: '前置詞を含む決まった言い方を、文の中での働きと一緒に比べます。',
  },
  collocation: {
    title: '動詞と名詞の決まった組み合わせ',
    summary: '一緒に使うことが多い動詞と名詞を、ひとかたまりで覚えます。',
  },
  structure: {
    title: '語順で覚える表現',
    summary: '語の並ぶ順番が決まっている表現を、空所の位置までそろえて比べます。',
  },
  fixed: {
    title: 'ひとかたまりで使う定型表現',
    summary: '語を入れ替えず、場面と語順を一緒に覚える表現を比べます。',
  },
  discourse: {
    title: '文と文をつなぐ表現',
    summary: '追加・逆接・言い換え・結論など、前後の関係を示す表現を比べます。',
  },
  conversation: {
    title: '会話の決まり文句',
    summary: '質問・依頼・提案・返答など、会話の場面ごとに決まった表現を比べます。',
  },
  expression: {
    title: '決まった言い回し',
    summary: '意味と使う場面をひとかたまりで覚える表現を比べます。',
  },
  idiom: {
    title: '同じ使い方の熟語',
    summary: '形だけでは分けにくい熟語を、使う場面と語法が近い仲間で比べます。',
  },
})

const ENDING_GUIDANCE = Object.freeze({
  up: 'up は「上へ」だけでなく、「最後まで」「現れる」「近づく」などの意味も作ります。',
  at: 'at は、動作や気持ちが向かう一点・対象を示すことが多い語です。',
  with: 'with は、「一緒に」「相手に」「道具で」などの関係を示します。',
  out: 'out は、「外へ」「なくなるまで」「はっきり」などの意味を作ります。',
  off: 'off は、「離れる」「止める」「取り除く」などの意味を作ります。',
  on: 'on は、「接して」「続けて」「支えにして」などの意味を作ります。',
  in: 'in は、「中へ」「加わって」「ある状態で」などの意味を作ります。',
  to: 'to は、動作や気持ちが向かう先・到達点を示します。',
  of: 'of は、対象・中身・一部と全体の関係を示します。',
  for: 'for は、目的・理由・相手など「何に向けたものか」を示します。',
  from: 'from は、出発点・原因・分離する相手を示します。',
  about: 'about は、話題や関係する事柄を示します。',
  down: 'down は、「下へ」「小さく」「完全に止める」などの意味を作ります。',
  over: 'over は、「越えて」「全体に」「もう一度」などの意味を作ります。',
  back: 'back は、元の場所・状態へ戻る向きを示します。',
  away: 'away は、ある場所・状態から離れる向きを示します。',
})

const SECTION_META = Object.freeze([
  { id: 'ending', label: '後ろの語でまとめる' },
  { id: 'be', label: 'be の形でまとめる' },
  { id: 'frame', label: '語順・空所の形でまとめる' },
  { id: 'verb', label: '最初の動詞でまとめる' },
  { id: 'opening', label: '最初の前置詞でまとめる' },
  { id: 'function', label: '会話・文の働きでまとめる' },
  { id: 'usage', label: 'そのほかの使い方でまとめる' },
])
const SECTION_ORDER = new Map(SECTION_META.map((section, index) => [section.id, index]))
const ENDING_ORDER = new Map(ENDING_WORDS.map((word, index) => [word, index]))

const clean = (value) => String(value ?? '')
  .normalize('NFKC')
  .replace(/[‘’]/g, "'")
  .replace(/\.\.\.|~/g, ' blank ')
  .replace(/\b[A-D]\b|比較級/g, ' slot ')
  .replace(/[^a-zA-Z0-9']+/g, ' ')
  .trim()
  .toLowerCase()

const tokensFor = (item) => clean(item?.phrase).split(/\s+/).filter(Boolean)
const lastPreposition = (tokens) => [...tokens].reverse().find((token) => PREPOSITIONS.has(token))

const formKeysFor = (item) => {
  if (!item || item.kind !== 'idiom') return []
  const tokens = tokensFor(item)
  const [head] = tokens
  const ending = tokens.at(-1)
  const keys = []
  const phrase = item.phrase ?? ''

  if (head === 'be' && /\bto do\s*$/i.test(phrase)) keys.push('be:to-do')
  if (head === 'be' && PREPOSITIONS.has(ending)) keys.push(`be:prep:${ending}`)
  if (/\bA\b.*\bB\b/i.test(phrase)) {
    const prep = lastPreposition(tokens)
    keys.push(`frame:a-${prep ?? 'link'}-b`)
  }
  if (/~ing|\bdoing\b/i.test(phrase)) keys.push('complement:doing')
  if (/\bto do\b/i.test(phrase)) keys.push('complement:to-do')
  if (item.category === 'conversation' || /[.?!]\s*$/.test(phrase)) {
    const question = /\?\s*$/.test(phrase) || /^(can|could|how|shall|what|why|would)\b/i.test(phrase)
    keys.push(question ? 'conversation:question' : 'conversation:response')
  }
  if (ENDING_WORD_SET.has(ending)) keys.push(`ending:${ending}`)
  if (VERB_HEADS.has(head)) keys.push(`verb:${head}`)
  if (LEADING_PREPOSITIONS.has(head)) keys.push(`preposition:${head}`)
  if (item.category === 'discourse') keys.push('discourse:connector')
  if (/\bas\b.*\bas\b|比較級|\bmore\b|\bless\b/i.test(phrase)) keys.push('structure:comparison')
  if (head === 'be') keys.push('be:expression')
  // discourse は直前の専用グループと対象が完全に同じになるため、
  // 選択欄へ同じ「文と文をつなぐ表現」を二重に出さない。
  if (item.category !== 'discourse') keys.push(`category:${item.category ?? 'idiom'}`)
  return [...new Set(keys)]
}

const sectionFor = (key) => {
  if (key.startsWith('ending:')) return 'ending'
  if (key.startsWith('be:')) return 'be'
  if (key.startsWith('frame:') || key.startsWith('complement:') || key.startsWith('structure:')) return 'frame'
  if (key.startsWith('verb:')) return 'verb'
  if (key.startsWith('preposition:')) return 'opening'
  if (key.startsWith('conversation:') || key === 'discourse:connector') return 'function'
  return 'usage'
}

const titleFor = (key) => {
  const [, type, detail] = key.split(':')
  if (key.startsWith('ending:')) return `〜 ${type}`
  if (key === 'conversation:question') return '質問の決まり文句'
  if (key === 'conversation:response') return '返答・あいさつの決まり文句'
  if (key === 'be:to-do') return 'be 〜 to do'
  if (key.startsWith('be:prep:')) return `be 〜 ${detail}`
  if (key === 'be:expression') return 'be 〜 の形'
  if (key.startsWith('frame:a-')) {
    const prep = key.slice('frame:a-'.length, -2)
    return prep === 'link' ? 'A と B を結ぶ形' : `A 〜 ${prep} 〜 B`
  }
  if (key.startsWith('verb:')) return `${type} 〜`
  if (key.startsWith('preposition:')) return `${type} 〜`
  if (key === 'complement:doing') return '〜 doing'
  if (key === 'complement:to-do') return '〜 to do'
  if (key === 'discourse:connector') return '文と文をつなぐ表現'
  if (key === 'structure:comparison') return '比較を表す形'
  if (key.startsWith('category:')) return CATEGORY_META[type]?.title ?? CATEGORY_META.idiom.title
  return '同じ使い方の熟語'
}

const summaryFor = (key) => {
  if (key.startsWith('ending:')) {
    const ending = key.split(':')[1]
    const guidance = ENDING_GUIDANCE[ending] ?? `${ending} を含む句全体の意味を、前の語と一緒に比べます。`
    return `句の最後が ${ending} の熟語を横に並べます。${guidance}`
  }
  if (key.startsWith('be:prep:')) {
    const prep = key.split(':')[2]
    return `be と ${prep} の間に入る語を一組にして、後ろに置く相手・物・行為の違いを比べます。`
  }
  if (key === 'be:to-do') return 'be の後ろの語と to do を一組にし、これから行う動作との関係を比べます。'
  if (key === 'be:expression') return 'be と後ろの語を一組にし、人・物の状態を表す熟語を比べます。'
  if (key.startsWith('frame:a-')) return 'A と B の役割をそろえ、間に入る語と動詞の組み合わせを横に並べて覚えます。'
  if (key.startsWith('verb:')) return '同じ基本動詞でも、後ろの語によって方向や意味が変わります。動詞だけで訳を決めません。'
  if (key.startsWith('preposition:')) return '先頭の前置詞が作る共通の関係を手掛かりに、定型表現どうしを比べます。'
  if (key.startsWith('conversation:')) return '場面と語順を一緒に覚え、同じ会話の働きをする表現を選び分けます。'
  if (key.startsWith('complement:')) return '後ろに doing を置くか to do を置くかを、意味と時の向きまで含めて比べます。'
  if (key === 'discourse:connector') return '前後が追加・逆接・言い換え・結論のどれかを確かめて選びます。'
  if (key === 'structure:comparison') return '比べる対象と程度を表す語順をそろえて確認します。'
  if (key.startsWith('category:')) return CATEGORY_META[key.split(':')[1]]?.summary ?? CATEGORY_META.idiom.summary
  return '形と使う場面が近い表現をまとめて比べます。'
}

const decisionFor = (key) => {
  if (key.startsWith('ending:')) {
    const ending = key.split(':')[1]
    return `${ending} だけで意味を決めず、直前の動詞と、後ろに目的語が必要かどうかまで確認します。`
  }
  if (key.startsWith('be:prep:')) {
    const prep = key.split(':')[2]
    return `be と ${prep} の間の語を見て、${prep} の後ろが人・物・行為のどれかを確かめます。`
  }
  if (key.startsWith('frame:a-')) return 'Aが動作する側か受ける側か、Bが原因・結果・相手のどれかを先に確かめます。'
  if (key.startsWith('verb:')) return '動詞の直後と文末の前置詞・副詞まで読んで、句全体の意味を決めます。'
  if (key.startsWith('preposition:')) return '表現を一語ずつ訳さず、後ろの名詞と文中での働きを確認します。'
  if (key.startsWith('conversation:')) return '質問、依頼、提案、返答のどの場面かを先に判断します。'
  if (key.startsWith('category:')) return '空所の前後と文全体で必要な意味を確かめ、語順ごと選びます。'
  return '空所の後ろの形と、文全体で必要な意味の両方を確認します。'
}

const idioms = PHRASES.filter((item) => item.kind === 'idiom')
const idiomsById = new Map(idioms.map((item) => [item.id, item]))
const membersByKey = new Map()
for (const item of idioms) {
  for (const key of formKeysFor(item)) {
    if (!membersByKey.has(key)) membersByKey.set(key, [])
    membersByKey.get(key).push(item)
  }
}

const levelOrder = new Map(['5', '4', '3', 'pre2', '2', 'pre1', '1'].map((level, index) => [level, index]))
const buildFamily = ([key, members]) => Object.freeze({
  id: key.replace(/:/g, '-'),
  key,
  section: sectionFor(key),
  title: titleFor(key),
  summary: summaryFor(key),
  decision: decisionFor(key),
  count: members.length,
  memberIds: Object.freeze([...members]
    .sort((a, b) => (levelOrder.get(a.level) - levelOrder.get(b.level)) || a.phrase.localeCompare(b.phrase, 'en'))
    .map((item) => item.id)),
})

const familiesByKey = new Map(
  [...membersByKey.entries()]
    .filter(([, members]) => members.length >= 2)
    .map((entry) => [entry[0], buildFamily(entry)]),
)

const familySort = (a, b) => {
  const sectionDifference = SECTION_ORDER.get(a.section) - SECTION_ORDER.get(b.section)
  if (sectionDifference) return sectionDifference
  if (a.section === 'ending') {
    return ENDING_ORDER.get(a.key.split(':')[1]) - ENDING_ORDER.get(b.key.split(':')[1])
  }
  return a.title.localeCompare(b.title, 'ja')
}

export const IDIOM_FORM_FAMILIES = Object.freeze(
  [...familiesByKey.values()].sort(familySort),
)

const familiesById = new Map(IDIOM_FORM_FAMILIES.map((family) => [family.id, family]))
const memberIdsByFamilyId = new Map(
  IDIOM_FORM_FAMILIES.map((family) => [family.id, new Set(family.memberIds)]),
)

export const IDIOM_FORM_FAMILY_SECTIONS = Object.freeze(
  SECTION_META.map((section) => Object.freeze({
    ...section,
    families: Object.freeze(IDIOM_FORM_FAMILIES.filter((family) => family.section === section.id)),
  })).filter((section) => section.families.length > 0),
)

export const FEATURED_IDIOM_FORM_FAMILY_IDS = Object.freeze([
  'ending-up',
  'ending-at',
  'ending-with',
  'be-prep-at',
])

export function idiomFormFamilyById(id) {
  return familiesById.get(id) ?? null
}

export function idiomFormFamiliesFor(item) {
  if (!item || item.kind !== 'idiom') return []
  return formKeysFor(item).map((key) => familiesByKey.get(key)).filter(Boolean)
}

export function idiomFormFamilyFor(item) {
  return idiomFormFamiliesFor(item)[0] ?? null
}

export function idiomBelongsToFormFamily(item, familyId) {
  return Boolean(item?.id && memberIdsByFamilyId.get(familyId)?.has(item.id))
}

const contentTokens = (item) => new Set(tokensFor(item).filter((token) => !STOP_TOKENS.has(token)))

export function relatedIdiomForms(item, limit = 5, familyId = null) {
  const requestedFamily = idiomFormFamilyById(familyId)
  const family = requestedFamily && idiomBelongsToFormFamily(item, requestedFamily.id)
    ? requestedFamily
    : idiomFormFamilyFor(item)
  if (!family) return []
  const ownTokens = contentTokens(item)
  const ownFamilyIds = new Set(idiomFormFamiliesFor(item).map((candidate) => candidate.id))
  return family.memberIds
    .map((id) => idiomsById.get(id))
    .filter((candidate) => candidate && candidate.id !== item.id)
    .map((candidate) => {
      const sharedTokens = [...contentTokens(candidate)].filter((token) => ownTokens.has(token)).length
      const sharedFamilies = idiomFormFamiliesFor(candidate)
        .filter((candidateFamily) => ownFamilyIds.has(candidateFamily.id)).length
      return {
        item: candidate,
        score: sharedFamilies * 5 + sharedTokens * 4 +
          (candidate.level === item.level ? 3 : 0) +
          (candidate.category === item.category ? 2 : 0),
      }
    })
    .sort((a, b) => b.score - a.score || a.item.phrase.localeCompare(b.item.phrase, 'en'))
    .slice(0, limit)
    .map(({ item: candidate }) => candidate)
}

export function idiomFormSearchText(item) {
  return idiomFormFamiliesFor(item)
    .flatMap((family) => [family.title, family.summary, family.decision])
    .join(' ')
}
