import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { LEVELS } from '../src/data/levels.js'
import { grammarPracticeTopicsForLevel } from '../src/data/grammar.js'
import { GRAMMAR_STRANDS } from '../src/data/grammar-strands.js'
import {
  GRAMMAR_REFERENCE_UNITS,
  GRAMMAR_STRAND_REFERENCES,
  grammarReferenceById,
  grammarReferenceByLevel,
  grammarReferenceFor,
  grammarReferenceNeighbors,
  grammarStrandReferenceFor,
  nextGrammarReferenceUnit,
} from '../src/data/grammar-reference/index.js'
import {
  GRAMMAR_REFERENCE_LOG_LIMIT,
  appendGrammarReferenceLog,
  formatStudyDay,
  grammarReferenceHistory,
  grammarReferenceStatusCounts,
  latestGrammarReference,
  normalizeGrammarReferenceLog,
  strandReferencePageId,
} from '../src/lib/grammarReferenceLog.js'
import {
  exampleParts,
  explanationParts,
  prepareReferenceUnit,
  resolveReferenceWord,
  splitEnglish,
} from '../src/lib/grammarReferenceText.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const words = (parts) => parts.filter((part) => part.kind === 'word').map((part) => part.text)
const terms = (parts) => parts.filter((part) => part.kind === 'term').map((part) => part.term)

test('文法の参考書は、テストのある級・単元すべてに1ページずつある（127単元・級ごとに学ぶ順）', () => {
  assert.equal(GRAMMAR_REFERENCE_UNITS.length, 127)
  const counts = Object.fromEntries(LEVELS.map((level) => [level.id, grammarReferenceByLevel(level.id).length]))
  assert.deepEqual(counts, { 5: 12, 4: 15, 3: 16, pre2: 26, 2: 26, pre1: 20, 1: 12 })
  for (const level of LEVELS) {
    for (const topic of grammarPracticeTopicsForLevel(level.id, 'mixed')) {
      const unit = grammarReferenceFor(level.id, topic)
      assert.ok(unit, `${level.id}/${topic}`)
      assert.equal(grammarReferenceById(unit.id), unit)
    }
  }
  // 学ぶ順：5級は be動詞から命令文まで。前後の単元は同じ級の中だけでつなぐ。
  assert.equal(grammarReferenceByLevel('5')[0].topic, 'be動詞')
  const { previous, next } = grammarReferenceNeighbors('gref_5_be')
  assert.equal(previous, null)
  assert.equal(next.id, 'gref_5_verb')
  assert.equal(grammarReferenceNeighbors(grammarReferenceByLevel('5').at(-1).id).next, null)
})

test('級をまたいだ25系統のページは、系統の段（級・単元）と同じ順でそろい、各段の単元ページへつながる', () => {
  assert.equal(GRAMMAR_STRAND_REFERENCES.length, GRAMMAR_STRANDS.length)
  for (const strand of GRAMMAR_STRANDS) {
    const reference = grammarStrandReferenceFor(strand.id)
    assert.ok(reference, strand.id)
    assert.deepEqual(
      reference.steps.map((step) => [step.level, step.topic]),
      strand.topics,
      strand.id,
    )
    for (const step of reference.steps) assert.ok(grammarReferenceFor(step.level, step.topic), `${strand.id} ${step.topic}`)
  }
  // 系統に入っていない前置詞の単元は、前置詞の系統ページから「つながる単元」として読める。
  assert.deepEqual(
    grammarStrandReferenceFor('preposition').related.map((item) => `${item.level}:${item.topic}`),
    ['4:前置詞', '2:前置詞', 'pre1:前置詞'],
  )
})

test('例文の英単語はすべてタップで意味が出る。文脈に合わない辞書の意味は例文ごとの意味で上書きする', () => {
  for (const unit of GRAMMAR_REFERENCE_UNITS) {
    const page = prepareReferenceUnit(unit)
    const examples = [
      ...page.forms.flatMap((form) => (form.example ? [form.example] : [])),
      ...page.points.flatMap((point) => point.examples),
    ]
    for (const example of examples) {
      const english = splitEnglish(example.en).filter((part) => part.kind === 'en').map((part) => part.text)
      assert.deepEqual(words(example.parts), english, `${unit.id}: ${example.en}`)
    }
  }
  // 例文の意味 → 参考書の語義表 → 辞書 の順に引く。
  assert.equal(resolveReferenceWord('over', { over: 'over there で「あそこに」' }).ja, 'over there で「あそこに」')
  assert.match(resolveReferenceWord('went').ja, /go の過去形/)
  assert.equal(resolveReferenceWord('went').headword, 'go')
  assert.match(resolveReferenceWord('don’t').ja, /do not の短縮形/)
  assert.match(resolveReferenceWord('Ken’s').ja, /’s が付いて「〜の」/)
  assert.match(resolveReferenceWord('yet').ja, /まだ/)
})

test('本文の英語は、記号の1文字や語尾の断片を引かず、5月の May と助動詞の may を見分ける', () => {
  assert.deepEqual(words(explanationParts('y → ies（city → cities）')), ['city', 'cities'])
  assert.deepEqual(words(explanationParts('S＋V＋O、A and B')), ['and'])
  assert.deepEqual(words(explanationParts('I のときは am')), ['I', 'am'])
  const month = explanationParts('on May 5、in May').filter((part) => part.kind === 'word' && part.text === 'May')
  assert.equal(month.length, 2)
  assert.ok(month.every((part) => part.word.ja === '5月'))
  const modal = exampleParts('May I use your pen?').find((part) => part.text === 'May')
  assert.match(modal.word.ja, /してもよい/)
})

test('用語はまとまりごとに最初の1回だけタップでき、長い用語を先に当てる', () => {
  const seen = new Set()
  const first = explanationParts('主語が3人称単数なら、主語に合わせて be動詞は is。代名詞と名詞。', seen)
  assert.deepEqual(terms(first), ['主語', '3人称単数', 'be動詞', '代名詞', '名詞'])
  const second = explanationParts('主語と be動詞', seen)
  assert.deepEqual(terms(second), [])
  // 季節の「節」は用語にしない。
  assert.deepEqual(terms(explanationParts('月・季節・年には in')), [])
})

test('参考書の学習記録は、押した日と「理解した／まだまだ」を1日1件ずつ古い順に残す', () => {
  let log = {}
  log = appendGrammarReferenceLog(log, 'gref_5_be', 'notYet', 100)
  log = appendGrammarReferenceLog(log, 'gref_5_be', 'understood', 103)
  // 同じ日に押し直したら、その日の結果を置き換える。
  log = appendGrammarReferenceLog(log, 'gref_5_be', 'notYet', 103)
  assert.deepEqual(log.gref_5_be, [{ day: 100, result: 'notYet' }, { day: 103, result: 'notYet' }])
  assert.deepEqual(grammarReferenceHistory(log, 'gref_5_be').map((entry) => entry.day), [103, 100])
  assert.deepEqual(latestGrammarReference(log, 'gref_5_be'), { day: 103, result: 'notYet' })
  // 知らない結果・ページIDは残さない。系統のページは gstrand_ で残す。
  assert.equal(appendGrammarReferenceLog(log, 'gref_5_be', 'done', 104), log)
  assert.equal(appendGrammarReferenceLog(log, 'passage-1', 'understood', 104), log)
  assert.equal(strandReferencePageId('preposition'), 'gstrand_preposition')
  log = appendGrammarReferenceLog(log, strandReferencePageId('preposition'), 'understood', 104)
  assert.equal(latestGrammarReference(log, 'gstrand_preposition').result, 'understood')

  // 古い記録は上限まで。読み込むときは形の正しいものだけを日付順にそろえる。
  let long = {}
  for (let day = 1; day <= GRAMMAR_REFERENCE_LOG_LIMIT + 5; day += 1) long = appendGrammarReferenceLog(long, 'gref_5_be', 'understood', day)
  assert.equal(long.gref_5_be.length, GRAMMAR_REFERENCE_LOG_LIMIT)
  assert.equal(long.gref_5_be[0].day, 6)
  assert.deepEqual(
    normalizeGrammarReferenceLog({
      gref_5_be: [{ day: 9, result: 'understood' }, { day: 2, result: 'notYet' }, { day: -1, result: 'notYet' }, { day: 3, result: 'x' }],
      gref_5_verb: 'broken',
      other: [{ day: 1, result: 'notYet' }],
    }),
    { gref_5_be: [{ day: 2, result: 'notYet' }, { day: 9, result: 'understood' }] },
  )
  assert.deepEqual(normalizeGrammarReferenceLog(null), {})

  // 目次の「学習」の帯は、いちばん新しい結果で数える。
  assert.deepEqual(
    grammarReferenceStatusCounts(log, ['gref_5_be', 'gstrand_preposition', 'gref_5_verb']),
    { understood: 1, notYet: 1, unstudied: 1 },
  )
  // 日番号は端末の日付（todayIndex と同じ数え方）で、目次には「9/19」の形で出す。
  const day = Math.floor(Date.UTC(2026, 8, 19) / 86400000)
  assert.equal(formatStudyDay(day), '9/19')
})

test('続きから読む単元は、いちばん新しく学習した単元の次で、まだ学習していない単元', () => {
  assert.equal(nextGrammarReferenceUnit({}).id, 'gref_5_be')
  assert.equal(nextGrammarReferenceUnit({ gref_5_be: [{ day: 5, result: 'notYet' }] }).id, 'gref_5_verb')
  // いちばん新しい日の単元の次から探す。学習済みの単元（まだまだを含む）は飛ばす。
  assert.equal(nextGrammarReferenceUnit({
    gref_5_verb: [{ day: 3, result: 'understood' }],
    gref_5_be: [{ day: 5, result: 'understood' }],
  }).id, 'gref_5_negq')
  // 同じ日なら、後ろの単元の次から。
  assert.equal(nextGrammarReferenceUnit({
    gref_5_be: [{ day: 5, result: 'understood' }],
    gref_5_negq: [{ day: 5, result: 'notYet' }],
  }).id, nextGrammarReferenceUnit({ gref_5_negq: [{ day: 5, result: 'notYet' }] }).id)
  const all = Object.fromEntries(GRAMMAR_REFERENCE_UNITS.map((unit) => [unit.id, [{ day: 1, result: 'understood' }]]))
  assert.equal(nextGrammarReferenceUnit(all), null)
})

test('文法の各級の目次は、級と単元ごとに「学習」と「テスト」の入口を別々に置き、テストへすぐ入れる', () => {
  const grammar = read('src/screens/Grammar.jsx')
  // 全体を切り替える入口のタブは置かない。
  assert.doesNotMatch(grammar, /EntranceTabs|useScreenParam\('mode'/)
  assert.match(grammar, /<ol className="space-y-3" data-grammar-contents=\{level\}>/)
  // 単元ごと：学習は参考書のページ、テストは参考書を通らずその単元の問題へ。
  assert.match(grammar, /data-grammar-unit=\{unit\.id\}/)
  assert.match(grammar, /studyLabel="学習"/)
  assert.match(grammar, /onStudy=\{\(\) => onRead\(unit\.id\)\}/)
  assert.match(grammar, /onQuiz=\{\(\) => onTestUnit\(unit\.topic\)\}/)
  assert.match(grammar, /navigate\('grammarQuiz', \{ source: \{ type: 'grammar', level, topic, questionType \}/)
  assert.match(grammar, /navigate\('grammarReference', \{ unitId \}\)/)
  // 目次の各単元に、いちばん新しい結果と学習日の履歴、級には「理解した／まだまだ／未学習」の帯。
  assert.match(grammar, /<StudyHistory history=\{history\} limit=\{HISTORY_SHOWN\}/)
  assert.match(grammar, /learningStatusKind="reference"/)
  assert.match(grammar, /navigate\('grammarStrands'\)/)

  const strands = read('src/screens/GrammarStrands.jsx')
  assert.doesNotMatch(strands, /data-grammar-strand-modes|useScreenParam\('mode'/)
  assert.match(strands, /data-grammar-strand-learn=\{strand\.id\}/)
  assert.match(strands, /data-grammar-strand-test=\{strand\.id\}/)
  assert.match(strands, /onLearn=\{\(\) => navigate\('grammarStrandReference', \{ strandId: overview\.strand\.id \}\)\}/)

  // ページの末尾で「まだまだ」「理解した」を押すと、その日の結果が学習記録に残る。テストは同じ級・単元の3種類。
  const reference = read('src/screens/GrammarReference.jsx')
  assert.match(reference, /onRecord=\{\(result\) => recordGrammarReference\(unit\.id, result\)\}/)
  assert.doesNotMatch(reference, /markReadingDone|IntersectionObserver/)
  assert.match(reference, /source: \{ type: 'grammar', level: unit\.level, topic: unit\.topic, questionType: 'mixed' \}/)
  assert.match(reference, /returnTo: \{ screen: 'grammarReference', params: \{ unitId: unit\.id \} \}/)
  const strand = read('src/screens/GrammarStrandReference.jsx')
  assert.match(strand, /onRecord=\{\(result\) => recordGrammarReference\(pageId, result\)\}/)
  assert.match(strand, /source: \{ type: 'grammarStrand', strandId: strand\.id, level: overview\.currentLevel \}/)
  const record = read('src/components/GrammarStudyRecord.jsx')
  assert.match(record, /\['notYet', 'understood'\]\.map/)

  // 記録は端末・進捗コード・クラウドに残り、リセットでは「学習を終えた記録」に入る。
  assert.match(read('src/store/useStore.js'), /grammarReferenceLog: normalizeGrammarReferenceLog\(payload\.grammarReferenceLog\)/)
  assert.match(read('src/lib/cloudSync.js'), /grammarReferenceLog: normalizeGrammarReferenceLog\(data\.grammarReferenceLog \?\? current\.grammarReferenceLog\)/)
  assert.match(read('src/lib/progressReset.js'), /\['writingProgress', 'readingsDone', 'grammarReferenceLog', 'mathDone', 'mathMastery'\]/)

  const app = read('src/App.jsx')
  assert.match(app, /grammarReference: GrammarReferenceScreen/)
  assert.match(app, /grammarStrandReference: GrammarStrandReferenceScreen/)
  assert.doesNotMatch(app, /grammarLessons/)
})
