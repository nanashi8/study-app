import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import {
  KOTEN_WORDS,
  pickKotenDistractors,
} from '../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../src/data/koten-grammar.js'
import { KOTEN_GRAMMAR_QUESTIONS } from '../src/data/koten-grammar-questions.js'
import {
  KOTEN_CULTURE,
  KOTEN_CULTURE_QUESTIONS,
} from '../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../src/data/koten-interpretations.js'
import { KOTEN_CURRICULUM_PATHS } from '../src/data/koten-curriculum.js'
import { KANBUN_VOCAB } from '../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../src/data/kanbun-culture.js'
import {
  KANBUN_COLLECTIONS,
  makeKanbunQuestion,
} from '../src/data/kanbun-content.js'
import {
  KANBUN_KUNDOKU_EXERCISES,
  isCorrectKanbunKundokuOrder,
} from '../src/data/kanbun-kundoku.js'
import { KANBUN_LEVELS } from '../src/data/kanbun-meta.js'
import { parseKanbunMarkedText } from '../src/lib/kanbun-marks.js'
import { CONTENTS } from '../src/data/contents.js'
import { APP_MENU_SCREEN_DESTINATIONS } from '../src/lib/appMenu.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'

const exactCounts = {
  kotenWords: 300,
  kotenGrammar: 74,
  kotenGrammarQuestions: 136,
  kotenCulture: 56,
  kotenCultureQuestions: 112,
  kotenInterpretations: 36,
  kanbunVocab: 120,
  kanbunGrammar: 87,
  kanbunCulture: 95,
  kanbunKundoku: 40,
}

assert.deepEqual({
  kotenWords: KOTEN_WORDS.length,
  kotenGrammar: KOTEN_GRAMMAR.length,
  kotenGrammarQuestions: KOTEN_GRAMMAR_QUESTIONS.length,
  kotenCulture: KOTEN_CULTURE.length,
  kotenCultureQuestions: KOTEN_CULTURE_QUESTIONS.length,
  kotenInterpretations: KOTEN_INTERPRETATIONS.length,
  kanbunVocab: KANBUN_VOCAB.length,
  kanbunGrammar: KANBUN_GRAMMAR.length,
  kanbunCulture: KANBUN_CULTURE.length,
  kanbunKundoku: KANBUN_KUNDOKU_EXERCISES.length,
}, exactCounts, '古典・漢文の全対象件数が契約と不一致です')

for (const word of KOTEN_WORDS) {
  assert.equal(pickKotenDistractors(word, 3, () => 0.41).length, 3, word.id)
  assert.ok(word.meanings?.length && word.note, `${word.id}: 語義または識別メモがありません`)
}
for (const question of [...KOTEN_GRAMMAR_QUESTIONS, ...KOTEN_CULTURE_QUESTIONS]) {
  assert.equal(question.choices.length, 4, question.id)
  assert.equal(new Set(question.choices).size, 4, question.id)
  assert.ok(question.choices.includes(question.answer), question.id)
  assert.ok(question.explanation, `${question.id}: 解説がありません`)
}

assert.equal(KOTEN_CURRICULUM_PATHS.length, 5)
for (const [index, level] of KOTEN_CURRICULUM_PATHS.entries()) {
  for (const field of ['vocabIds', 'grammarIds', 'cultureIds']) {
    assert.equal(new Set(level[field]).size, level[field].length, `${level.id}:${field}`)
    if (index > 0) {
      assert.ok(
        KOTEN_CURRICULUM_PATHS[index - 1][field].every((id) => level[field].includes(id)),
        `${level.id}:${field}: 前段階を包含していません`,
      )
    }
  }
}
assert.equal(KOTEN_CURRICULUM_PATHS.at(-1).vocabIds.length, KOTEN_WORDS.length)
assert.equal(KOTEN_CURRICULUM_PATHS.at(-1).grammarIds.length, KOTEN_GRAMMAR.length)
assert.equal(KOTEN_CURRICULUM_PATHS.at(-1).cultureIds.length, KOTEN_CULTURE.length)

const levelIds = new Set(KANBUN_LEVELS.map((level) => level.id))
for (const [domain, collection] of Object.entries(KANBUN_COLLECTIONS)) {
  assert.deepEqual(new Set(collection.map((item) => item.level)), levelIds, `${domain}: 5段階不足`)
  for (const item of collection) {
    for (const field of ['title', 'answer', 'detail', 'clue', 'pitfall', 'front']) {
      assert.ok(item[field]?.trim(), `${domain}:${item.id}:${field}`)
    }
    const question = makeKanbunQuestion(domain, item, () => 0.43)
    assert.equal(question.choices.length, 4, question.id)
    assert.equal(new Set(question.choices.map((choice) => choice.id)).size, 4, question.id)
    assert.ok(question.choices.some((choice) => choice.id === question.answerId), question.id)
  }
}

const grammarText = KANBUN_GRAMMAR.map((item) => Object.values(item).join(' ')).join('\n')
for (const term of ['白文', '訓読', '書き下し', 'レ点', '一二点', '上下点', '甲乙', '天地人', '再読文字', '使役', '受身', '反語', '比較']) {
  assert.ok(grammarText.includes(term), `漢文法に「${term}」がありません`)
}
let kanbunReturnMarkCount = 0
for (const exercise of KANBUN_KUNDOKU_EXERCISES) {
  assert.equal(isCorrectKanbunKundokuOrder(exercise, exercise.order), true, exercise.id)
  assert.equal(new Set(exercise.order).size, exercise.tokens.length, exercise.id)
  assert.ok(exercise.kakikudashi && exercise.translation && exercise.clue && exercise.pitfall, exercise.id)
  const parsed = parseKanbunMarkedText(exercise.marked)
  assert.deepEqual(parsed.errors, [], `${exercise.id}: 返り点の親字対応が不正`)
  assert.equal(parsed.units.map((unit) => unit.sourceText).join(''), exercise.marked, exercise.id)
  kanbunReturnMarkCount += parsed.returnMarkCount
}
assert.equal(kanbunReturnMarkCount, 113, '返り点40題の点数が監査基準と不一致です')

const kotenTile = CONTENTS.find((content) => content.id === 'koten-quest')
const kanbunTile = CONTENTS.find((content) => content.id === 'kanbun-quest')
assert.equal(kotenTile?.screen, 'kotenList')
assert.equal(kanbunTile?.screen, 'kanbunHome')
assert.notEqual(kotenTile.screen, kanbunTile.screen)
for (const screen of ['kotenList', 'kanbunHome', 'kanbunSaved']) {
  assert.ok(APP_MENU_SCREEN_DESTINATIONS.includes(screen), `${screen}: 統一メニュー未接続`)
}

const appSource = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const kundokuSource = readFileSync(new URL('../src/screens/KanbunKundoku.jsx', import.meta.url), 'utf8')
const kundokuQuizSource = readFileSync(new URL('../src/screens/KanbunKundokuQuiz.jsx', import.meta.url), 'utf8')
assert.match(kundokuSource, /KanbunMarkedText/, '返り点ドリルに構造化表示がありません')
assert.match(kundokuQuizSource, /KanbunMarkedText/, '返り点テストに構造化表示がありません')
assert.doesNotMatch(kundokuQuizSource, /\{exercise\.marked\}<\/p>/, '旧式の返り点文字列表示が残っています')
for (const screen of [
  'kanbunHome',
  'kanbunCatalog',
  'kanbunStudy',
  'kanbunQuiz',
  'kanbunKundoku',
  'kanbunKundokuQuiz',
  'kanbunSaved',
]) {
  assert.match(appSource, new RegExp(`${screen}:`), `${screen}: 公開ルート未接続`)
}

const kanbunProgressFields = [
  'kanbunVocabSrs',
  'kanbunGrammarSrs',
  'kanbunCultureSrs',
  'kanbunKundokuSrs',
  'kanbunVocabList',
  'kanbunGrammarList',
  'kanbunCultureList',
]
for (const field of kanbunProgressFields) {
  assert.ok(PERSISTED_PROGRESS_FIELDS.includes(field), `${field}: 保存契約にありません`)
}

console.log('古典・漢文全件監査: PASS')
console.log('  古典: 暗記430項目 / 4択548問相当 / 短文読解36問 / 5段階')
console.log(`  漢文: 暗記302項目 / 自動4択302問 / 返り点・訓読40題・返り点${kanbunReturnMarkCount}個を親字へ固定 / 5段階`)
console.log(`  保存契約: 漢文7項目 / 全${PERSISTED_PROGRESS_FIELDS.length}永続項目`)
