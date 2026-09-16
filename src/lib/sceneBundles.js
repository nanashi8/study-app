// 場面の束：長文1本を、本文の場面ごとの6〜10語に分けた暗記の単位（台帳は src/data/scene-bundles.js）。
// 束の語が本文のどの文に出るかをここで求め、一覧・読解の準備・検査が同じ答えを使う。
import { SCENE_BUNDLE_LEDGER } from '../data/scene-bundles.js'
import { READING_LEVELS } from '../data/levels.js'
import { PASSAGES, getPassage } from '../data/passages.js'
import { PASSAGE_IRREGULAR_FORMS, resolvePassageWord } from '../data/passage-gloss.js'
import { getWord } from '../data/vocab.js'

export const SCENE_BUNDLE_SIZE = Object.freeze({ min: 6, max: 10 })

// 比べる形（-er / -est）を持つのは形容詞・副詞だけ。teacher を teach の変化形と数えないため。
const COMPARABLE_POS = /形|副/

const IRREGULAR_FORMS_BY_LEMMA = new Map()
for (const [form, { lemma }] of Object.entries(PASSAGE_IRREGULAR_FORMS)) {
  if (!IRREGULAR_FORMS_BY_LEMMA.has(lemma)) IRREGULAR_FORMS_BY_LEMMA.set(lemma, [])
  IRREGULAR_FORMS_BY_LEMMA.get(lemma).push(form)
}

/** 見出し語が本文に出るときの形（原形・規則変化・長文で使う不規則変化）。 */
export function sceneWordForms(word) {
  const base = String(word?.word ?? '').toLowerCase()
  const forms = new Set()
  if (!/^[a-z]+$/.test(base)) return forms
  const comparable = COMPARABLE_POS.test(word.pos ?? '')
  const add = (...items) => items.forEach((item) => forms.add(item))

  add(base, `${base}ed`, `${base}ing`)
  if (/(s|x|z|ch|sh|o)$/.test(base)) add(`${base}es`)
  if (!/(s|x|z|ch|sh)$/.test(base)) add(`${base}s`)
  if (comparable) add(`${base}er`, `${base}est`)
  if (base.endsWith('e')) {
    add(`${base}d`, `${base.slice(0, -1)}ing`)
    if (comparable) add(`${base}r`, `${base}st`)
  }
  if (/[^aeiou]y$/.test(base)) {
    const stem = base.slice(0, -1)
    add(`${stem}ies`, `${stem}ied`)
    if (comparable) add(`${stem}ier`, `${stem}iest`)
  }
  // plan → planned、stop → stopping のように、短母音＋子音で終わる語は子音を重ねる。
  if (/(^|[^aeiou])[aeiou][bdgklmnprt]$/.test(base)) {
    const last = base.at(-1)
    add(`${base}${last}ed`, `${base}${last}ing`)
    if (comparable) add(`${base}${last}er`, `${base}${last}est`)
  }
  if (base.endsWith('ie')) add(`${base.slice(0, -2)}ying`)
  if (base.endsWith('fe')) add(`${base.slice(0, -2)}ves`)
  else if (base.endsWith('f')) add(`${base.slice(0, -1)}ves`)
  for (const form of IRREGULAR_FORMS_BY_LEMMA.get(base) ?? []) add(form)
  return forms
}

const sentenceTokens = (sentence) => sentence?.en?.match(/[A-Za-z]+/g) ?? []

/**
 * 束の語が本文で初めて出る文と、そのときの形。見つからなければ null。
 * 本文の語義が同じ見出し語を指す出現を先に選び、別の見出し語に解決される形（damaged など）は控えにする。
 * 同じつづりの別の語（id が _2 で終わる語）は、本文の語義がその語を指す出現だけを数える。
 */
export function findSceneWordInPassage(passage, word) {
  if (!passage || !word) return null
  const forms = sceneWordForms(word)
  const homograph = /_\d+$/.test(word.id)
  let fallback = null
  for (const [index, sentence] of (passage.sentences ?? []).entries()) {
    for (const token of sentenceTokens(sentence)) {
      const key = token.toLowerCase()
      if (!forms.has(key)) continue
      if (resolvePassageWord(key, sentence.gloss)?.id === word.id) return { index, surface: token }
      if (!homograph) fallback ??= { index, surface: token }
    }
  }
  return fallback
}

export const SCENE_BUNDLES = Object.freeze(
  Object.entries(SCENE_BUNDLE_LEDGER).flatMap(([passageId, bundles]) => (
    bundles.map((bundle, index) => Object.freeze({
      id: `${passageId}#${index + 1}`,
      passageId,
      number: index + 1,
      name: bundle.name,
      wordIds: bundle.words,
      headwords: Object.freeze(bundle.words.map((id) => getWord(id)?.word ?? id)),
    }))
  )),
)

const SCENE_BUNDLES_BY_ID = new Map(SCENE_BUNDLES.map((bundle) => [bundle.id, bundle]))
const SCENE_BUNDLES_BY_PASSAGE = new Map()
for (const bundle of SCENE_BUNDLES) {
  if (!SCENE_BUNDLES_BY_PASSAGE.has(bundle.passageId)) SCENE_BUNDLES_BY_PASSAGE.set(bundle.passageId, [])
  SCENE_BUNDLES_BY_PASSAGE.get(bundle.passageId).push(bundle)
}

export const getSceneBundle = (id) => SCENE_BUNDLES_BY_ID.get(id) ?? null

/** その長文の場面の束（本文の順）。束のない長文は空配列。 */
export const sceneBundlesForPassage = (passageId) => SCENE_BUNDLES_BY_PASSAGE.get(passageId) ?? []

/** 束に入っている語の数（同じ長文の束どうしで語は重ならない）。 */
export const sceneBundleWordCount = (bundles) => bundles.reduce((sum, bundle) => sum + bundle.wordIds.length, 0)

const LEVEL_ORDER = new Map(READING_LEVELS.map((level, index) => [level.id, index]))

/** 場面の束のある長文。級の順に並べ、同じ級の中は長文一覧と同じ順。 */
export const SCENE_BUNDLE_PASSAGES = Object.freeze(
  PASSAGES
    .filter((passage) => SCENE_BUNDLES_BY_PASSAGE.has(passage.id))
    .map((passage, index) => ({ passage, index }))
    .sort((a, b) => (LEVEL_ORDER.get(a.passage.level) - LEVEL_ORDER.get(b.passage.level)) || a.index - b.index)
    .map(({ passage }) => passage),
)

/** 場面の束のある級（READING_LEVELS の順）。 */
export const SCENE_BUNDLE_LEVELS = Object.freeze(
  READING_LEVELS.filter((level) => SCENE_BUNDLE_PASSAGES.some((passage) => passage.level === level.id)),
)

export const SCENE_BUNDLE_SUMMARY = Object.freeze({
  passages: SCENE_BUNDLE_PASSAGES.length,
  bundles: SCENE_BUNDLES.length,
  words: new Set(SCENE_BUNDLES.flatMap((bundle) => bundle.wordIds)).size,
})

/** 束の語と、本文でその語が初めて出る文。一覧で「本文ではこう出る」を見せるために使う。 */
export function sceneBundleExamples(bundle) {
  const passage = getPassage(bundle?.passageId)
  if (!passage) return []
  return bundle.wordIds
    .map((id) => getWord(id))
    .filter(Boolean)
    .map((word) => {
      const found = findSceneWordInPassage(passage, word)
      return {
        word,
        sentenceIndex: found?.index ?? null,
        surface: found?.surface ?? null,
        sentence: found ? passage.sentences[found.index] : null,
      }
    })
}

/**
 * 束の暗記（mode: 'study'）・テスト（'quiz'）を開く画面と引数。
 * continueTo は結果画面の「次へ」の行き先、returnTo は途中でやめたときの戻り先。
 */
export function sceneBundleLaunch(bundle, mode, { continueTo, returnTo } = {}) {
  const quiz = mode === 'quiz'
  const passage = getPassage(bundle.passageId)
  return {
    screen: quiz ? 'vocabQuiz' : 'vocabStudy',
    params: {
      source: { type: 'deck', ids: [...bundle.wordIds] },
      size: bundle.wordIds.length,
      title: `${passage?.titleJa ?? '場面の束'}・${bundle.name}`,
      ...(quiz ? {} : { mode: 'study' }),
      ...(continueTo ? { continueTo } : {}),
      ...(returnTo ? { returnTo } : {}),
    },
  }
}
