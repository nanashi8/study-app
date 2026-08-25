import {
  ETYMOLOGY_PACKS,
  etymologyLearningGuideFor,
  getRoot,
  getWord,
} from '../data/vocab.js'

const LANGUAGE_MARKERS = [
  'アングロ・フランス語',
  'アングロ＝フランス語',
  '古フランス語',
  '古高ドイツ語',
  '中低ドイツ語',
  '低地ドイツ語',
  '中世低地ドイツ',
  '中世オランダ',
  '中世ラテン',
  '古フランス',
  '古ノルド語',
  'サンスクリット語',
  'ポルトガル語',
  'スコットランド語',
  'フランス語',
  'ギリシャ語',
  'イタリア語',
  'スペイン語',
  'オランダ語',
  'アラビア語',
  'イディッシュ語',
  'ウェールズ語',
  'フィンランド語',
  'ハンガリー語',
  'ポリネシア語',
  'スワヒリ語',
  'ヘブライ語',
  'ベンガル語',
  'ヒンディー語',
  'ヒンディ語',
  'ウルドゥー語',
  'ウルドゥ語',
  'ペルシャ語',
  'マレー語',
  'ロシア語',
  'チェコ語',
  'タミル語',
  'ラテン語',
  'ドイツ語',
  '中国語',
  '広東語',
  '日本語',
  'トルコ語',
  'マオリ語',
  'ナワトル語',
  '古英語',
  '中英語',
  '近代英語',
  '古ノルド',
  '北欧語',
  'ゲルマン語',
  'ケルト語',
  'サンスクリット',
  'スカンジナビア',
  'ポルトガル',
  'フランス',
  'ギリシャ',
  'イタリア',
  'スペイン',
  'オランダ',
  'アラビア',
  'ドイツ',
  'ラテン',
  '北欧',
  'ゲルマン',
  'ケルト',
  '英語',
]

const LANGUAGE_MARKER_PATTERN = new RegExp(
  `(?:${LANGUAGE_MARKERS.sort((a, b) => b.length - a.length).join('|')})(?:系)?(?:の)?\\s*`,
  'g',
)

const unique = (values) => [...new Set(values.filter(Boolean))]

const normalizeTypography = (value = '') => String(value)
  .replace(/[「」]/g, '')
  .replaceAll('(', '（')
  .replaceAll(')', '）')
  .replace(/\s*[+＋]\s*/g, ' ＋ ')
  .replace(/\s*[=＝]\s*/g, '＝')
  .replace(/\s*→\s*/g, ' → ')
  .replace(/^[・、,:：\s]+|[。\s]+$/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

const primaryMeaning = (word) => normalizeTypography(
  word?.meanings?.slice(0, 2).join('・') || word?.meaning || '今の意味',
)

const formulaFallback = (part) => {
  if (part.kind === 'prefix') return '前につく意味'
  if (part.kind === 'suffix') return '後ろにつく意味'
  return '意味の中心'
}

export function cleanEtymologyMeaningText(value = '') {
  return normalizeTypography(String(value)
    .replace(LANGUAGE_MARKER_PATTERN, '')
    .replace(/(?:古|中世(?:低地)?|近代)(?=[A-Za-z])/g, ''))
}

export function learnerEtymologyStepsFor(word) {
  const guide = etymologyLearningGuideFor(word)
  const currentMeaning = primaryMeaning(word)
  const steps = unique(
    guide.storySteps
      .map(cleanEtymologyMeaningText)
      .filter((step) => step && step !== currentMeaning),
  )
  if (!steps.length) return [currentMeaning]
  return steps
}

const formulaWordFor = (pack) =>
  pack.studyIds
    .map(getWord)
    .find((word) => (word?.etymology?.parts?.length ?? 0) >= 2)
  ?? getWord(pack.studyIds[0])

const familyWordFor = (pack) => {
  const words = pack.studyIds.map(getWord).filter(Boolean)
  return words.find((word) => (word.etymology?.parts?.length ?? 0) >= 2)
    ?? words.find((word) => /→|⇒/.test(word.etymology?.note ?? ''))
    ?? words[0]
}

export function etymologyTargetWordFor(pack) {
  if (pack.mode === 'formula') return formulaWordFor(pack)
  if (pack.mode === 'family') return familyWordFor(pack)
  return getWord(pack.studyIds[0])
}

const partLabel = (part) => {
  const form = cleanEtymologyMeaningText(part.t)
  const meaning = cleanEtymologyMeaningText(part.gloss?.trim() || formulaFallback(part))
  return `${form}（${meaning}）`
}

export function etymologyMeaningGuideFor(pack) {
  const targetWord = etymologyTargetWordFor(pack)
  if (!targetWord) throw new Error(`${pack?.id ?? 'unknown'}: 学ぶ英単語がありません。`)
  const meaning = primaryMeaning(targetWord)

  if (pack.mode === 'formula') {
    const parts = targetWord.etymology.parts
    return {
      targetWordId: targetWord.id,
      headword: targetWord.word,
      meaning,
      statement: `${parts.map(partLabel).join(' ＋ ')} → ${meaning}`,
      explanation: '部品の意味を左から足すと、単語全体の意味を予想できます。',
      scope: 'verified-group',
    }
  }

  if (pack.mode === 'root') {
    const root = getRoot(pack.rootId)
    const rootForm = cleanEtymologyMeaningText(root?.form ?? pack.rootId)
    const rootMeaning = cleanEtymologyMeaningText(root?.meaning ?? '意味の中心')
    return {
      targetWordId: targetWord.id,
      headword: targetWord.word,
      meaning,
      statement: `${rootForm}（${rootMeaning}） → ${targetWord.word}（${meaning}）`,
      explanation: `語根 ${rootForm} の意味を手がかりに、単語全体の意味を考えます。`,
      scope: 'verified-group',
    }
  }

  if (pack.mode === 'family') {
    const parts = targetWord.etymology?.parts ?? []
    if (parts.length >= 2) {
      return {
        targetWordId: targetWord.id,
        headword: targetWord.word,
        meaning,
        statement: `${parts.map(partLabel).join(' ＋ ')} → ${meaning}`,
        explanation: `このセットでは、${targetWord.word} 自身の部品と意味だけを確かめます。`,
        scope: 'single-word',
      }
    }
    const steps = unique([...learnerEtymologyStepsFor(targetWord), meaning])
    return {
      targetWordId: targetWord.id,
      headword: targetWord.word,
      meaning,
      statement: steps.join(' → '),
      explanation: `このセットでは、${targetWord.word} 自身の形と由来だけを確かめます。`,
      scope: 'single-word',
    }
  }

  const steps = unique([...learnerEtymologyStepsFor(targetWord), meaning])
  return {
    targetWordId: targetWord.id,
    headword: targetWord.word,
    meaning,
    statement: steps.join(' → '),
    explanation: `語の形が表す意味を前からたどると、${targetWord.word} の意味につながります。`,
    scope: 'single-word',
  }
}

export const etymologyMeaningPool = unique(
  ETYMOLOGY_PACKS.flatMap((pack) => {
    const word = etymologyTargetWordFor(pack)
    const root = pack.rootId ? getRoot(pack.rootId) : null
    return [primaryMeaning(word), root?.meaning]
  })
    .map(cleanEtymologyMeaningText)
    .flatMap((meaning) => meaning.split('・'))
    .filter((meaning) => meaning.length >= 2 && meaning.length <= 8),
)
