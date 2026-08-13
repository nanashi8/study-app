import { KANBUN_CULTURE, getKanbunCulture } from './kanbun-culture.js'
import { KANBUN_GRAMMAR, getKanbunGrammar } from './kanbun-grammar.js'
import { KANBUN_VOCAB, getKanbunVocab } from './kanbun-vocab.js'
import { KANBUN_DOMAIN_META } from './kanbun-meta.js'

export const KANBUN_COLLECTIONS = Object.freeze({
  vocab: KANBUN_VOCAB,
  grammar: KANBUN_GRAMMAR,
  culture: KANBUN_CULTURE,
})

export const KANBUN_RESOLVERS = Object.freeze({
  vocab: getKanbunVocab,
  grammar: getKanbunGrammar,
  culture: getKanbunCulture,
})

export function getKanbunItem(domain, id) {
  return KANBUN_RESOLVERS[domain]?.(id)
}

export function kanbunItems(domain, ids) {
  const collection = KANBUN_COLLECTIONS[domain] ?? []
  if (!Array.isArray(ids) || !ids.length) return [...collection]
  const requested = new Set(ids)
  return collection.filter((item) => requested.has(item.id))
}

export function kanbunDomainMeta(domain) {
  return KANBUN_DOMAIN_META[domain] ?? null
}

export function kanbunSearchText(item) {
  return [
    item?.title,
    item?.reading,
    item?.pattern,
    item?.answer,
    item?.detail,
    item?.clue,
    item?.original,
    item?.kakikudashi,
    item?.translation,
    item?.pitfall,
    item?.scene,
    item?.application,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function shuffleKanbun(items, rng = Math.random) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1))
    ;[shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]]
  }
  return shuffled
}

export function pickKanbunDistractors(domain, item, count = 3, rng = Math.random) {
  const candidates = KANBUN_COLLECTIONS[domain] ?? []
  const sameCategory = candidates.filter(
    (candidate) => candidate.id !== item.id
      && candidate.category === item.category
      && candidate.answer !== item.answer,
  )
  const other = candidates.filter(
    (candidate) => candidate.id !== item.id
      && candidate.category !== item.category
      && candidate.answer !== item.answer,
  )
  const picked = []
  const used = new Set([item.answer])
  for (const candidate of [...shuffleKanbun(sameCategory, rng), ...shuffleKanbun(other, rng)]) {
    if (picked.length >= count) break
    if (used.has(candidate.answer)) continue
    used.add(candidate.answer)
    picked.push(candidate)
  }
  return picked
}

const choiceId = (domain, item) => `${domain}:${item.id}`

export function makeKanbunQuestion(domain, item, rng = Math.random) {
  const distractors = pickKanbunDistractors(domain, item, 3, rng)
  const choices = shuffleKanbun([item, ...distractors], rng).map((candidate) => ({
    id: choiceId(domain, candidate),
    label: candidate.answer,
  }))
  const prompt = domain === 'vocab'
    ? `「${item.title}」の中心の意味として最も適切なものは？`
    : domain === 'grammar'
      ? `句法「${item.title}」（${item.pattern}）の読み・意味として最も適切なものは？`
      : `「${item.title}」の説明として最も適切なものは？`
  return Object.freeze({
    id: `kq_${domain}_${item.id}`,
    domain,
    itemId: item.id,
    level: item.level,
    category: item.category,
    prompt,
    passage: item.original || item.scene,
    choices: Object.freeze(choices),
    answerId: choiceId(domain, item),
    answer: item.answer,
    clue: item.clue,
    detail: item.detail,
    pitfall: item.pitfall,
    kakikudashi: item.kakikudashi,
    translation: item.translation,
    application: item.application,
  })
}

export function pickKanbunQuestions(
  domain,
  ids,
  { size = 12, rng = Math.random } = {},
) {
  const candidates = shuffleKanbun(kanbunItems(domain, ids), rng)
  const requestedSize = Math.max(0, Math.min(Number(size) || 12, candidates.length))
  return candidates.slice(0, requestedSize).map((item) => makeKanbunQuestion(domain, item, rng))
}
