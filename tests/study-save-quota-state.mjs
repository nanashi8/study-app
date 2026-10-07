// 全教材の全項目を、暗記とテストの両方で学んだときの最大の記録を作る（tests/study-save-quota-browser.test.mjs が使う）。
// requests/2026-10-07-study-save-quota.json の capacity-all-content。
//
// 記録はストアの本物の操作で書く。暗記・テストで記録する教材（kind: 'srs'）は、1項目を暗記5回・テスト5回答えた記録
// （覚えた・まだ・正解・不正解をまぜる。○×の控えは5件までなので、これより多く答えても大きくならない）を作り、
// 同じ形の記録を全項目に置く（1項目ずつ操作を流すと、記録の写しが項目数の2乗になって終わらない）。
// 読了・完了で記録する教材（kind: 'completion'）は、全項目と全問題をそれぞれの操作で記録する。
import { LEARNING_CONTENTS } from '../src/lib/learningContentProgress.js'
import { selectProgressState } from '../src/lib/progressCode.js'
import { SUBJECTS } from '../src/data/subjects/meta.js'
import { useStore } from '../src/store/useStore.js'

const MEMORY_RESULTS = ['remembered', 'forgot', 'remembered', 'remembered', 'forgot']
const TEST_RESULTS = ['correct', 'wrong', 'correct', 'wrong', 'correct']

function fullSrsEntry(store) {
  const probe = '__save-quota-probe__'
  for (let index = 0; index < 5; index += 1) {
    store.getState().review(probe, MEMORY_RESULTS[index], 'vocab')
    store.getState().review(probe, TEST_RESULTS[index], 'vocab')
  }
  const entry = store.getState().srs[probe]
  const { [probe]: _removed, ...rest } = store.getState().srs
  store.setState({ srs: rest })
  return entry
}

/**
 * 最大の記録（保存する全欄）と、数えた項目数を返す。
 * 時刻は項目ごとにずらし、同じ文字の並びばかりにならないようにする。
 */
export function buildFullLearningState() {
  const store = useStore
  store.getState().resetProgress?.()
  const template = fullSrsEntry(store)
  const srsFields = {}
  let itemCount = 0
  const counts = {}
  for (const content of LEARNING_CONTENTS) {
    counts[content.id] = content.items.length
    itemCount += content.items.length
    if (content.kind !== 'srs') continue
    const field = (srsFields[content.store] ??= { ...(store.getState()[content.store] ?? {}) })
    content.items.forEach((item, index) => {
      const shift = (index % 997) * 61_000
      field[item.id] = {
        ...template,
        lastAt: template.lastAt - shift,
        firstAt: template.firstAt - shift * 3,
        memory: { ...template.memory, lastAt: template.memory.lastAt - shift },
        test: { ...template.test, lastAt: template.test.lastAt - shift },
      }
    })
  }
  store.setState(srsFields)

  const state = () => store.getState()
  for (const content of LEARNING_CONTENTS) {
    if (content.kind !== 'completion') continue
    for (const item of content.items) {
      if (content.id === 'reading') state().markReadingDone(item.id)
      else if (content.id === 'literature') state().markLiteratureDone(item.id)
      else if (content.id === 'writing') {
        state().recordWritingCompletion({
          exerciseId: item.id,
          text: 'I think that studying English every day is important because it helps me understand the world.',
          mode: 'guide',
          wordCount: 18,
          grammarIds: [],
        })
      } else if (content.id === 'math') state().markMathDone(item.id)
      else if (content.id === 'math-history') state().recordMathStory(item.id, 'understood')
      else if (content.id === 'math-exam') state().recordMathExamAttempt(item.id, 'solved', 240)
      else {
        const subject = Object.keys(SUBJECTS).find((key) => SUBJECTS[key].practiceDomain === content.id)
        if (subject) state().recordSubjectPractice(subject, item.id, 'correct', 45)
      }
    }
    if (content.quizDomain && content.quizItems) {
      for (const question of content.quizItems) state().recordContentQuizResult(content.quizDomain, question.id, 1, 1)
    }
  }
  return { state: selectProgressState(state()), itemCount, counts }
}
