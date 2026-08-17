import { ETYMOLOGY_PACKS } from '../data/vocab.js'
import {
  etymologyMeaningGuideFor,
  etymologyMeaningPool,
} from './etymologyMeaning.js'

function hashText(text = '') {
  let hash = 2166136261
  for (const char of text) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const wrongMeaningFor = (pack, correctMeanings) => {
  const candidates = etymologyMeaningPool.filter(
    (meaning) => meaning && !/[（）]/.test(meaning) && !correctMeanings.has(meaning),
  )
  return candidates[hashText(`wrong-meaning:${pack.id}`) % candidates.length] ?? '別の意味'
}

function incorrectStatementFor(pack, correctStatement) {
  const matches = [...correctStatement.matchAll(/（([^（）]+)）/g)]
    .filter((match) => !/^(?:の|こと|もの|する|を|に|が)$/.test(match[1]))
  const correctMeanings = new Set(matches.map((match) => match[1]))
  const wrongMeaning = wrongMeaningFor(pack, correctMeanings)

  if (matches.length) {
    const target = matches[hashText(`wrong-part:${pack.id}`) % matches.length]
    return `${correctStatement.slice(0, target.index)}（${wrongMeaning}）${correctStatement.slice(target.index + target[0].length)}`
  }

  const arrow = correctStatement.lastIndexOf(' → ')
  if (arrow >= 0) return `${correctStatement.slice(0, arrow)} → ${wrongMeaning}`
  return `${correctStatement} → ${wrongMeaning}`
}

export function etymologyKnowledgeOptionFor(pack) {
  const guide = etymologyMeaningGuideFor(pack)
  return {
    id: `knowledge:${pack.id}`,
    label: guide.statement,
    wordId: guide.targetWordId,
  }
}

export function buildEtymologyQuizQuestion(pack) {
  if (!pack) throw new Error('unknown: 確認する語源カードがありません。')
  const guide = etymologyMeaningGuideFor(pack)
  const statementIsCorrect = ((hashText(`truth:${pack.id}`) >>> 6) & 1) === 0
  const incorrectStatement = incorrectStatementFor(pack, guide.statement)

  if (incorrectStatement === guide.statement) {
    throw new Error(`${pack.id}: 正誤問題の誤った文を作れません。`)
  }

  return {
    packId: pack.id,
    mode: pack.mode,
    targetWordId: guide.targetWordId,
    headword: guide.headword,
    meaning: guide.meaning,
    relatedWordIds: pack.studyIds,
    knowledge: {
      cue: guide.headword,
      prompt: 'この「語の形と意味のつながり」は正しい？',
      statement: statementIsCorrect ? guide.statement : incorrectStatement,
      statementIsCorrect,
      answerId: statementIsCorrect ? 'correct' : 'incorrect',
      correctLabel: guide.statement,
      explanation: guide.explanation,
      options: [
        { id: 'correct', label: '正しい' },
        { id: 'incorrect', label: '正しくない' },
      ],
    },
  }
}

export const buildAllEtymologyQuizQuestions = () =>
  ETYMOLOGY_PACKS.map(buildEtymologyQuizQuestion)
