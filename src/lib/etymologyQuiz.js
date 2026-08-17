import {
  ETYMOLOGY_PACKS,
  etymologyLearningGuideFor,
  getRoot,
  getWord,
  pickDistractors,
  shuffle,
} from '../data/vocab.js'
import { quizMeaning } from '../data/compact.js'

const OPTION_COUNT = 3

function hashText(text = '') {
  let hash = 2166136261
  for (const char of text) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function seededRng(seed) {
  let state = hashText(seed) || 1
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

const formulaFallback = (part) => {
  if (part.kind === 'prefix') return '前につく部品'
  if (part.kind === 'suffix') return '後ろにつく部品'
  return '意味の中心'
}

const formulaWordFor = (pack) =>
  pack.studyIds
    .map(getWord)
    .find((word) => (word?.etymology?.parts?.length ?? 0) >= 2)
  ?? getWord(pack.studyIds[0])

const familyWordFor = (pack) =>
  getWord(pack.studyIds.find((id) => id !== pack.anchorId) ?? pack.studyIds[0])

const targetWordFor = (pack) => {
  if (pack.mode === 'formula') return formulaWordFor(pack)
  if (pack.mode === 'family') return familyWordFor(pack)
  return getWord(pack.studyIds[0])
}

const unique = (values) => [...new Set(values.filter(Boolean))]

const orderedFromSeed = (values, seed) => {
  const items = unique(values)
  if (!items.length) return []
  const start = hashText(seed) % items.length
  return [...items.slice(start), ...items.slice(0, start)]
}

const formulaPartsFor = (pack) => {
  const word = formulaWordFor(pack)
  return {
    word,
    parts: word.etymology.parts.map((part) => ({
      form: part.t,
      kind: part.kind,
      meaning: part.gloss?.trim() || formulaFallback(part),
    })),
  }
}

const formatFormulaCombination = (parts) =>
  parts.map((part) => `${part.form}＝${part.meaning}`).join(' ＋ ')

const FORMULA_MEANINGS_BY_KIND = (() => {
  const pools = new Map()
  for (const pack of ETYMOLOGY_PACKS.filter((candidate) => candidate.mode === 'formula')) {
    for (const id of pack.studyIds) {
      const word = getWord(id)
      for (const part of word?.etymology?.parts ?? []) {
        const meaning = part.gloss?.trim() || formulaFallback(part)
        if (!pools.has(part.kind)) pools.set(part.kind, [])
        pools.get(part.kind).push(meaning)
      }
    }
  }
  return new Map([...pools].map(([kind, meanings]) => [kind, unique(meanings)]))
})()

export function etymologyKnowledgeOptionFor(pack) {
  if (!pack) return null

  if (pack.mode === 'formula') {
    const { word, parts } = formulaPartsFor(pack)
    return {
      id: `knowledge:${pack.id}`,
      label: formatFormulaCombination(parts),
      wordId: word.id,
    }
  }

  if (pack.mode === 'root') {
    const root = getRoot(pack.rootId)
    return {
      id: `knowledge:${pack.id}`,
      label: `${root?.form ?? pack.rootId} ＝ ${root?.meaning ?? '意味の中心'}`,
      wordId: pack.studyIds[0],
    }
  }

  if (pack.mode === 'family') {
    const anchor = getWord(pack.anchorId) ?? getWord(pack.studyIds[0])
    const word = familyWordFor(pack)
    return {
      id: `knowledge:${pack.id}`,
      label: `${anchor.word} → ${word.word}`,
      wordId: word.id,
    }
  }

  const word = getWord(pack.studyIds[0])
  return {
    id: `knowledge:${pack.id}`,
    label: `${etymologyLearningGuideFor(word).sourceText} → ${word.word}`,
    wordId: word.id,
  }
}

function knowledgePromptFor(pack, targetWord) {
  if (pack.mode === 'formula') return {
    cue: targetWord.word,
    prompt: '正しい部品と意味の組み合わせは？',
    contextWords: [],
  }

  if (pack.mode === 'root') {
    const root = getRoot(pack.rootId)
    return {
      cue: root?.form ?? pack.rootId,
      prompt: '正しい語根と意味の組み合わせは？',
      contextWords: pack.studyIds.map(getWord).filter(Boolean).slice(0, 4).map((word) => word.word),
    }
  }

  if (pack.mode === 'family') {
    const anchor = getWord(pack.anchorId) ?? getWord(pack.studyIds[0])
    return {
      cue: anchor.word,
      prompt: '正しい基語と仲間の組み合わせは？',
      contextWords: [],
    }
  }

  return {
    cue: targetWord.word,
    prompt: '正しい、もとの形・言語と単語の組み合わせは？',
    contextWords: [],
  }
}

const packsByMode = Object.fromEntries(
  ['formula', 'root', 'family', 'origin'].map((mode) => [
    mode,
    ETYMOLOGY_PACKS.filter((pack) => pack.mode === mode),
  ]),
)

function formulaKnowledgeOptionsFor(pack, correct) {
  const { word, parts } = formulaPartsFor(pack)
  const options = [correct]
  const labels = new Set([correct.label])
  const correctMeanings = parts.map((part) => part.meaning)

  // まずは同じ部品の意味を入れ替えた選択肢を作る。
  for (let shift = 1; shift < parts.length && options.length < OPTION_COUNT; shift++) {
    const shifted = parts.map((part, index) => ({
      ...part,
      meaning: correctMeanings[(index + shift) % correctMeanings.length],
    }))
    const label = formatFormulaCombination(shifted)
    if (labels.has(label)) continue
    labels.add(label)
    options.push({
      id: `knowledge:${pack.id}:wrong:${options.length}`,
      label,
      wordId: word.id,
    })
  }

  // 2部品などで入れ替えだけでは足りない場合は、同じ種類の実在する意味を使う。
  for (let attempt = 0; options.length < OPTION_COUNT && attempt < 100; attempt++) {
    const changed = parts.map((part, index) => {
      if (index !== attempt % parts.length) return part
      const candidates = orderedFromSeed(
        FORMULA_MEANINGS_BY_KIND.get(part.kind) ?? [],
        `${pack.id}:${part.kind}:${attempt}`,
      ).filter((meaning) => meaning !== part.meaning)
      return { ...part, meaning: candidates[attempt % candidates.length] ?? '別の意味' }
    })
    const label = formatFormulaCombination(changed)
    if (labels.has(label)) continue
    labels.add(label)
    options.push({
      id: `knowledge:${pack.id}:wrong:${options.length}`,
      label,
      wordId: word.id,
    })
  }

  return options
}

function rootKnowledgeOptionsFor(pack, correct) {
  const root = getRoot(pack.rootId)
  const meanings = orderedFromSeed(
    packsByMode.root.map((candidate) => getRoot(candidate.rootId)?.meaning),
    `root-meanings:${pack.id}`,
  ).filter((meaning) => meaning !== root?.meaning)
  return [
    correct,
    ...meanings.slice(0, OPTION_COUNT - 1).map((meaning, index) => ({
      id: `knowledge:${pack.id}:wrong:${index + 1}`,
      label: `${root?.form ?? pack.rootId} ＝ ${meaning}`,
      wordId: pack.studyIds[0],
    })),
  ]
}

function familyKnowledgeOptionsFor(pack, correct) {
  const anchor = getWord(pack.anchorId) ?? getWord(pack.studyIds[0])
  const candidates = orderedFromSeed(
    packsByMode.family
      .filter((candidate) => candidate.anchorId !== pack.anchorId)
      .flatMap((candidate) => candidate.studyIds.filter((id) => id !== candidate.anchorId)),
    `family-words:${pack.id}`,
  )
    .map(getWord)
    .filter(Boolean)
    .filter((word) => word.id !== correct.wordId)

  return [
    correct,
    ...candidates.slice(0, OPTION_COUNT - 1).map((word, index) => ({
      id: `knowledge:${pack.id}:wrong:${index + 1}`,
      label: `${anchor.word} → ${word.word}`,
      wordId: word.id,
    })),
  ]
}

function originKnowledgeOptionsFor(pack, correct) {
  const target = getWord(pack.studyIds[0])
  const sources = orderedFromSeed(
    packsByMode.origin
      .filter((candidate) => candidate.sourceKey !== pack.sourceKey)
      .flatMap((candidate) => candidate.studyIds)
      .map(getWord)
      .filter(Boolean)
      .map((word) => etymologyLearningGuideFor(word).sourceText),
    `origin-sources:${pack.id}`,
  ).filter((sourceText) => `${sourceText} → ${target.word}` !== correct.label)

  return [
    correct,
    ...sources.slice(0, OPTION_COUNT - 1).map((sourceText, index) => ({
      id: `knowledge:${pack.id}:wrong:${index + 1}`,
      label: `${sourceText} → ${target.word}`,
      wordId: target.id,
    })),
  ]
}

function knowledgeOptionsFor(pack) {
  const correct = etymologyKnowledgeOptionFor(pack)
  const options = pack.mode === 'formula'
    ? formulaKnowledgeOptionsFor(pack, correct)
    : pack.mode === 'root'
      ? rootKnowledgeOptionsFor(pack, correct)
      : pack.mode === 'family'
        ? familyKnowledgeOptionsFor(pack, correct)
        : originKnowledgeOptionsFor(pack, correct)

  if (options.length !== OPTION_COUNT) {
    throw new Error(`${pack.id}: 語源確認の選択肢を${OPTION_COUNT}件作れません。`)
  }
  return shuffle(options, seededRng(`knowledge-options:${pack.id}`))
}

function wordOptionsFor(pack, word) {
  const distractors = pickDistractors(word, OPTION_COUNT - 1, seededRng(`word-distractors:${pack.id}`))
  const options = shuffle([word, ...distractors], seededRng(`word-options:${pack.id}`))
    .map((candidate) => ({
      id: candidate.id,
      label: quizMeaning(candidate),
    }))
  if (options.length !== OPTION_COUNT) {
    throw new Error(`${pack.id}: 関連英単語の選択肢を${OPTION_COUNT}件作れません。`)
  }
  return options
}

export function buildEtymologyQuizQuestion(pack) {
  const targetWord = targetWordFor(pack)
  if (!targetWord) throw new Error(`${pack?.id ?? 'unknown'}: 確認する英単語がありません。`)
  const knowledgeAnswer = etymologyKnowledgeOptionFor(pack)
  const knowledgePrompt = knowledgePromptFor(pack, targetWord)

  return {
    packId: pack.id,
    mode: pack.mode,
    knowledge: {
      ...knowledgePrompt,
      answerId: knowledgeAnswer.id,
      correctLabel: knowledgeAnswer.label,
      options: knowledgeOptionsFor(pack),
    },
    word: {
      wordId: targetWord.id,
      headword: targetWord.word,
      prompt: `${targetWord.word} の意味は？`,
      answerId: targetWord.id,
      options: wordOptionsFor(pack, targetWord),
    },
  }
}

export const buildAllEtymologyQuizQuestions = () =>
  ETYMOLOGY_PACKS.map(buildEtymologyQuizQuestion)
