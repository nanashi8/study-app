// 自作カードの暗記・テスト（依頼台帳 requests/2026-09-30-custom-card-templates.json の study-test）。
// どのテンプレートのカードも暗記とテストができ、記録（覚えた・まだ、正解・不正解、復習日）が残る。
// 英単語のカードは辞書の語と同じ英単語の暗記・テスト（記録 srs）、ほかの4つのテンプレート（古文単語・漢語・その他・一問一答）は
// 自作カードの暗記・テスト（記録 customCardSrs）。
// 始める場所：自作カードの画面の分類（教科・カテゴリー）、教科のアプリのホーム（→その教科の自作カード）、単語帳。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  CARD_TEMPLATE_IDS,
  CUSTOM_CARD_QUIZ_DOMAIN,
  customCardDistractors,
  customCardQuestion,
  getCustomCard,
  pickCustomCardQuestions,
  pickCustomCards,
  quizzableCustomCardIds,
  registerCustomCards,
  templateFor,
} from '../src/lib/customCards.js'
import { getWord } from '../src/data/vocab.js'
import { buildDeck } from '../src/lib/session.js'
import { wordBookLaunchTarget } from '../src/lib/wordBookLaunch.js'
import { wordBooksFromState } from '../src/lib/wordBooks.js'
import { NOTEBOOK_DOMAIN_BY_ID } from '../src/lib/learningNotebook.js'
import { buildStudyCompletionReport, learningLaunchFor } from '../src/lib/learningAnalyticsReport.js'
import { IN_PROGRESS_SCREENS } from '../src/lib/navigationPolicy.js'
import { contentQuizKey } from '../src/lib/contentProgress.js'
import { settingsScopeFor } from '../src/lib/contentSettings.js'
import { useStore } from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

const card = (template, index, category = 'cat-test') => ({
  id: `c-${template}${index}`,
  template,
  category,
  front: `${template}の表${index}`,
  back: `${template}の裏${index}`,
  reading: '', kanji: '', pos: '', example: '', exampleTranslation: '', note: `${template}の解説${index}`,
})

// 4つのテンプレート×3枚。テストの誤答は、同じ分類・同じテンプレートのカードの答えから作る。
const CARDS = CARD_TEMPLATE_IDS.flatMap((template) => [1, 2, 3].map((index) => card(template, index)))

test('英単語以外の4つのテンプレートは、それぞれの問い方でテストを作る（3択＋わからない、誤答はほかの自作カードの答え）', () => {
  registerCustomCards(CARDS, [{ id: 'cat-test', title: 'テスト用' }])
  try {
    for (const template of CARD_TEMPLATE_IDS) {
      const quiz = templateFor(template).quiz
      const target = getCustomCard(`c-${template}1`)
      const question = customCardQuestion(target)
      assert.equal(question.text, target[quiz.prompt], `${template}：問い`)
      assert.equal(question.answer, target[quiz.answer], `${template}：答え`)
      assert.equal(question.ask, quiz.ask)
      assert.equal(question.choices[0], question.answer)
      assert.equal(new Set(question.choices).size, question.choices.length, `${template}：同じ選択肢を出さない`)
      // 同じテンプレートのカードが先に誤答になる。
      const distractors = customCardDistractors(target)
      assert.deepEqual(distractors.slice(0, 2).map((item) => item.template), [template, template], `${template}：誤答は同じテンプレートから`)
      // 選択肢の説明は、その選択肢のカードの問いの欄。
      for (const choice of question.choices) assert.ok(question.notes[choice], `${template}：選択肢「${choice}」の説明`)
    }
    // 古文単語・漢語は語→意味、その他は意味→用語、一問一答は問題→答え。
    assert.deepEqual(CARD_TEMPLATE_IDS, ['koten', 'kanbun', 'other', 'qa'])
    assert.deepEqual(
      CARD_TEMPLATE_IDS.map((template) => [templateFor(template).quiz.prompt, templateFor(template).quiz.answer]),
      [['front', 'back'], ['front', 'back'], ['back', 'front'], ['front', 'back']],
    )
    // 答えのちがうカードが1枚しかないと、テストは作れない。
    registerCustomCards([card('other', 1)], [])
    assert.equal(customCardQuestion(getCustomCard('c-other1')), null)
    assert.deepEqual(quizzableCustomCardIds(['c-other1']), [])
  } finally {
    registerCustomCards([], [])
  }
})

test('暗記とテストの束は、全教材共通の出題順で組み、記録（customCardSrs・テストの結果）を残す', () => {
  const original = useStore.getState()
  try {
    useStore.setState({ ...useStore.getInitialState(), customCards: CARDS, customCategories: [{ id: 'cat-test', title: 'テスト用', subject: null, template: null }], customCardSrs: {} }, true)
    const ids = CARDS.map((item) => item.id)
    const deck = pickCustomCards(ids, { size: 0 })
    assert.equal(deck.length, CARDS.length)
    const questions = pickCustomCardQuestions(ids, { size: 0 })
    assert.equal(questions.length, CARDS.length)

    // 暗記の「覚えた」「まだ」、テストの「正解」「不正解」が記録に残り、復習日が決まる。
    const store = useStore.getState()
    store.reviewCustomCard('c-other1', 'remembered')
    store.reviewCustomCard('c-other2', 'forgot')
    store.reviewCustomCard('c-qa1', 'correct')
    store.reviewCustomCard('c-qa2', 'wrong')
    store.recordContentQuizResult(CUSTOM_CARD_QUIZ_DOMAIN, 'c-qa1', 1, 1)
    const srs = useStore.getState().customCardSrs
    assert.equal(srs['c-other1'].memory.lastJudgment, 'remembered')
    assert.equal(srs['c-other2'].memory.lastJudgment, 'forgot')
    assert.equal(srs['c-qa1'].test.lastResult, 'correct')
    assert.equal(srs['c-qa2'].test.lastResult, 'wrong')
    for (const id of ['c-other1', 'c-other2', 'c-qa1', 'c-qa2']) assert.ok(Number.isFinite(srs[id].due), `${id} の復習日`)
    assert.equal(useStore.getState().contentQuizResults[contentQuizKey(CUSTOM_CARD_QUIZ_DOMAIN, 'c-qa1')].lastResult, 'correct')

    // 暗記を終えた画面（全教材共通）の記録も組める。
    const report = buildStudyCompletionReport({ contentId: 'custom-cards', srs, ids: ['c-other1', 'c-other2'], reviewIds: ['c-other2'], correct: 1, wrong: 1 })
    assert.equal(report.contentId, 'custom-cards')
    assert.deepEqual(report.session.ids, ['c-other1', 'c-other2'])
    assert.equal(report.session.forgot, 1)
    assert.ok(report.today.uniqueItems >= 2)

    // 出題順：まだ・不正解のカードは、今日の候補（まだ学習していないカード）のあと。
    const again = pickCustomCards(['c-other1', 'c-other2', 'c-other3'], { srs, size: 0 })
    assert.equal(again[0].id, 'c-other3')
  } finally {
    useStore.setState(original, true)
  }
})

test('英単語のカードは、辞書の語と同じ英単語の暗記・テストの束に入る', () => {
  const original = useStore.getState()
  try {
    const saved = useStore.getState().saveCustomWord({ word: 'serendipitous', meanings: '思いがけない幸運の', category: 'cat-test' })
    assert.equal(getWord(saved.id)?.word, 'serendipitous')
    const deck = buildDeck({ type: 'mylist', ids: [saved.id] }, { size: 1 })
    assert.deepEqual(deck.map((item) => item.id), [saved.id])
  } finally {
    useStore.setState(original, true)
  }
})

test('始める場所：分類（自作カードの画面）・教科のアプリのホーム・単語帳・学習の記録から、暗記とテストを開く', () => {
  const screen = read('../src/screens/CustomWords.jsx')
  // 分類の暗記・テスト：英単語のカードは英単語の暗記・テスト、ほかは自作カードの暗記・テスト。
  assert.match(screen, /navigate\(mode === 'study' \? 'vocabStudy' : 'vocabQuiz', \{\s*source: \{ type: 'mylist', ids \},/)
  assert.match(screen, /navigate\(mode === 'study' \? 'customCardStudy' : 'customCardQuiz', \{/)
  // 教科のアプリのホームの入口は、その教科の自作カードを開く。
  assert.match(read('../src/components/CustomCardsEntry.jsx'), /navigate\('customWords', \{ subject \}\)/)
  // 単語帳：自作カードは教材の1つ（暗記できる）で、冊ごとに自作カードの暗記・テストを開く。
  assert.equal(NOTEBOOK_DOMAIN_BY_ID.customCards.label, '自作カード')
  assert.equal(NOTEBOOK_DOMAIN_BY_ID.customCards.canStudy, true)
  assert.deepEqual(wordBookLaunchTarget('customCards', 'study', ['c-1'], { title: '単語帳' }), {
    screen: 'customCardStudy',
    params: { ids: ['c-1'], title: '単語帳' },
  })
  assert.equal(wordBookLaunchTarget('customCards', 'quiz', ['c-1'], { title: '単語帳' }).screen, 'customCardQuiz')
  // 単語帳の数は、消したカードの ID を数えない。
  registerCustomCards([card('other', 1)], [])
  try {
    const books = wordBooksFromState({ learningNotebook: { sets: [{ id: 's', title: '冊', refs: ['customCards:c-other1', 'customCards:c-gone'] }] } }, 'customCards')
    assert.deepEqual(books[0].ids, ['c-other1'])
    // 学習の記録からも開ける。
    assert.equal(learningLaunchFor('customCards', ['c-other1'], 'memory').screen, 'customCardStudy')
    assert.equal(learningLaunchFor('customCards', ['c-other1'], 'test').screen, 'customCardQuiz')
  } finally {
    registerCustomCards([], [])
  }
})

test('自作カードの暗記・テストは、ほかの教材と同じ仕組み（出題バランス・出題の順・1回のカード数・選び直し・終わりの画面・単語帳ボタン）で動く', () => {
  const mixScreens = read('../src/components/VocabMixConsole.jsx').match(/export const STUDY_MIX_SCREENS = Object\.freeze\(\[([\s\S]*?)\]\)/)[1]
  assert.match(mixScreens, /'customCardStudy'/)
  assert.match(mixScreens, /'customCardQuiz'/)
  assert.ok(IN_PROGRESS_SCREENS.has('customCardStudy'))
  assert.ok(IN_PROGRESS_SCREENS.has('customCardQuiz'))
  // 設定（問題数・答えの表示・自動で次へ・出題バランス）は、開いた教科のアプリの値。メニューから開いたときは全体の値。
  const scopes = { english: 'vocabLevels', koten: 'kotenList', kanbun: 'kanbunHome', math: 'mathMap', social: 'socialHome', science: 'scienceHome' }
  const homes = { english: 'home', koten: 'kotenList', kanbun: 'kanbunHome', math: 'mathMap', social: 'socialHome', science: 'scienceHome' }
  for (const screen of ['customCardStudy', 'customCardQuiz']) {
    for (const [subject, scope] of Object.entries(scopes)) {
      assert.equal(
        settingsScopeFor({ screen, stack: [{ screen: homes[subject] }, { screen: 'customWords' }], params: { subject } }),
        scope,
        `${screen}：${subject}から`,
      )
    }
    assert.equal(settingsScopeFor({ screen, stack: [{ screen: 'portal' }, { screen: 'customWords' }], params: {} }), null)
  }
  const study = read('../src/screens/CustomCardStudy.jsx')
  const quiz = read('../src/screens/CustomCardQuiz.jsx')
  assert.match(study, /pickCustomCards\(ids, \{ srs, size, freshShare: currentStudyMixShare\(\), preserveOrder \}\)/)
  assert.match(study, /<SessionCounter/)
  assert.match(study, /useStudyMixRebuild\(/)
  assert.match(study, /<StudyAnswerReselect/)
  assert.match(study, /<StudyCompletionReport/)
  assert.match(study, /contentId: 'custom-cards'/)
  assert.match(study, /<WordBookToggle domain="customCards"/)
  assert.match(study, /reviewCard\(card\.id, result\)/)
  assert.match(quiz, /pickCustomCardQuestions\(ids, \{/)
  assert.match(quiz, /limitQuizChoices\(question\.choices, question\.answer, \{ seed: question\.id \}\)/)
  assert.match(quiz, /<UnknownChoiceButton/)
  assert.match(quiz, /<ChoiceExplanations/)
  assert.match(quiz, /recordQuizResult\(CUSTOM_CARD_QUIZ_DOMAIN, question\.cardId/)
  assert.match(quiz, /<SessionCounter/)
  assert.match(quiz, /<WordBookToggle\s+domain="customCards"/)
})
