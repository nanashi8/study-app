// 単語帳の1冊から、教材ごとの暗記・テスト画面を開くときの行き先。
// 単語画面・各コンテンツのトップ・マイ学習ノートが同じ行き先を使い、画面ごとにずらさない。
import { NOTEBOOK_DOMAIN_BY_ID } from './learningNotebook.js'

// 漢文の暗記・テスト画面は、漢語・漢文法・漢文常識を domain（vocab / grammar / culture）で受け取る。
const KANBUN_SCREEN_DOMAIN = Object.freeze({
  kanbunVocab: 'vocab',
  kanbunGrammar: 'grammar',
  kanbunCulture: 'culture',
})

/** 漢文の画面の domain（vocab / grammar / culture）を、単語帳に入れるときの教材名へ。 */
export function kanbunNotebookDomain(domain) {
  return Object.keys(KANBUN_SCREEN_DOMAIN).find((key) => KANBUN_SCREEN_DOMAIN[key] === domain) ?? 'kanbunVocab'
}

/** その教材を「暗記」で始められるか。できない教材（文法問題・リスニングなど）はテストで学ぶ。 */
export function wordBookCanStudy(domain) {
  return NOTEBOOK_DOMAIN_BY_ID[domain]?.canStudy === true
}

/**
 * 教材 domain の項目 ids を、mode（'study' 暗記 / 'quiz' テスト）で学ぶ画面と引数。
 * 暗記のない教材は、mode に関係なくテストの画面を返す。returnTo は、終わったあとに戻す画面。
 */
export function wordBookLaunchTarget(domain, mode, ids, { title, returnTo } = {}) {
  if (!NOTEBOOK_DOMAIN_BY_ID[domain] || !Array.isArray(ids) || !ids.length) return null
  const study = mode === 'study' && wordBookCanStudy(domain)
  const back = returnTo ? { returnTo } : {}
  switch (domain) {
    case 'vocab':
      return {
        screen: study ? 'vocabStudy' : 'vocabQuiz',
        params: { source: { type: 'mylist', ids }, title, mode: study ? 'study' : 'quiz', ...back },
      }
    case 'phrases':
      return {
        screen: study ? 'phraseStudy' : 'phraseQuiz',
        params: {
          source: { type: 'phraseList', ids },
          title,
          ...(study ? { mode: 'study' } : {}),
          engine: 'phrase',
          ...back,
        },
      }
    case 'grammar':
      return { screen: 'grammarQuiz', params: { source: { type: 'grammarList', ids }, title, ...back } }
    case 'listening':
      return {
        screen: 'listeningQuiz',
        params: { source: { type: 'listeningList', ids }, title, engine: 'listening', ...back },
      }
    case 'dictation':
      return { screen: 'dictationPlay', params: { source: { type: 'dictationList', ids }, title, ...back } }
    case 'etymology':
      return { screen: study ? 'etymologyStudy' : 'etymologyQuiz', params: { ids, title, ...back } }
    case 'kotenVocab':
      return { screen: study ? 'kotenStudy' : 'kotenQuiz', params: { ids, title, ...back } }
    case 'kotenGrammar':
      return { screen: study ? 'kotenGrammarStudy' : 'kotenGrammarQuiz', params: { ids, title, ...back } }
    case 'kotenCulture':
      return { screen: study ? 'kotenCultureStudy' : 'kotenCultureQuiz', params: { ids, title, ...back } }
    case 'kotenInterpretation':
      // 短文解釈は、答える前に重要語と文法を確かめる画面から始める。
      return { screen: 'kotenInterpretationPrep', params: { ids, title, ...back } }
    case 'kanbunVocab':
    case 'kanbunGrammar':
    case 'kanbunCulture':
      return {
        screen: study ? 'kanbunStudy' : 'kanbunQuiz',
        params: { domain: KANBUN_SCREEN_DOMAIN[domain], ids, title, ...back },
      }
    case 'kanbunKundoku':
      return { screen: 'kanbunKundokuQuiz', params: { ids, title, ...back } }
    default:
      return null
  }
}
