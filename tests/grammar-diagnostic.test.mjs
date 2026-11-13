// 文法の実力診断（依頼台帳 requests/2026-11-13-grammar-diagnostic-in-app.json）。
// 範囲の全単元から1問目を1問ずつ・1回10単元ずつ出し、まちがえた単元にだけ同じ単元の別の問題を出すこと、
// 結果の数え方と弱点からのつながり、文法モードへのつなぎ、記録の保存を、全127単元・3つの範囲で確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { GRAMMAR_STRANDS } from '../src/data/grammar-strands.js'
import { GRAMMAR_PRACTICE, getGrammar, grammarPracticeByTopic } from '../src/data/grammar.js'
import { grammarVariationKey } from '../src/lib/grammarDeck.js'
import { grammarReferenceFor } from '../src/data/grammar-reference/index.js'
import {
  GRAMMAR_DIAGNOSTIC_ROUND,
  GRAMMAR_DIAGNOSTIC_SCOPES,
  GRAMMAR_DIAGNOSTIC_UNITS,
  grammarDiagnosticHistory,
  grammarDiagnosticPracticeIds,
  grammarDiagnosticUnitKey,
  grammarDiagnosticUnits,
  nextGrammarDiagnosticRound,
  normalizeGrammarDiagnostic,
  pickGrammarDiagnosticQuestion,
  recordGrammarDiagnosticAnswer,
  startGrammarDiagnostic,
  summarizeGrammarDiagnostic,
} from '../src/lib/grammarDiagnostic.js'
import { PERSISTED_PROGRESS_FIELDS } from '../src/lib/progressCode.js'
import { RESETTABLE_PROGRESS_FIELDS } from '../src/lib/progressReset.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const EXPECTED_UNITS = { high: 43, kyotsu: 95, nankan: 127 }
const LEVEL_ORDER = ['5', '4', '3', 'pre2', '2', 'pre1', '1']
const keyOf = (item) => grammarDiagnosticUnitKey(item.level, item.topic)

// 範囲を最後まで解く。wrongFirst / wrongSecond は、まちがえる問題を決める（何番目に出た1問目・2問目か）。
function solveAll(scopeId, { wrongFirst = (n) => n % 3 === 0, wrongSecond = (n) => n % 2 === 0 } = {}) {
  let record = startGrammarDiagnostic(null, scopeId, 100)
  const rounds = []
  const firsts = []
  const seconds = []
  const missedFirst = new Set()
  const missedSecond = new Set()
  for (let guard = 0; guard < 100; guard += 1) {
    const ids = nextGrammarDiagnosticRound(record)
    if (!ids.length) break
    const round = { firsts: 0, seconds: 0, order: [] }
    for (const id of ids) {
      const item = getGrammar(id)
      const key = keyOf(item)
      const isSecond = Boolean(record.current.units[key]?.first)
      let ok
      if (isSecond) {
        ok = !wrongSecond(seconds.length)
        seconds.push({ key, id })
        if (!ok) missedSecond.add(key)
        round.seconds += 1
      } else {
        ok = !wrongFirst(firsts.length)
        firsts.push({ key, id })
        if (!ok) missedFirst.add(key)
        round.firsts += 1
      }
      round.order.push(isSecond ? 'second' : 'first')
      record = recordGrammarDiagnosticAnswer(record, id, ok)
    }
    rounds.push(round)
  }
  return { record, rounds, firsts, seconds, missedFirst, missedSecond }
}

test('診断の単元は grammar-strands.js の全127単元（25系統）で、範囲は43・95・127単元', () => {
  const strandUnits = GRAMMAR_STRANDS.flatMap((strand) => strand.topics.map(([level, topic]) => grammarDiagnosticUnitKey(level, topic)))
  assert.equal(GRAMMAR_STRANDS.length, 25)
  assert.equal(strandUnits.length, 127)
  assert.deepEqual(GRAMMAR_DIAGNOSTIC_UNITS.map((unit) => unit.key), strandUnits)
  for (const scope of GRAMMAR_DIAGNOSTIC_SCOPES) {
    const units = grammarDiagnosticUnits(scope.id)
    assert.equal(units.length, EXPECTED_UNITS[scope.id], scope.id)
    assert.equal(new Set(units.map((unit) => unit.key)).size, units.length, `${scope.id} の単元が重複`)
    const top = LEVEL_ORDER.indexOf(scope.upTo)
    assert.deepEqual(
      [...units.map((unit) => unit.key)].sort(),
      strandUnits.filter((key) => LEVEL_ORDER.indexOf(key.split('|')[0]) <= top).sort(),
      `${scope.id} の範囲が級で切った単元と違う`,
    )
    // 易しい級から出す。
    const levels = units.map((unit) => LEVEL_ORDER.indexOf(unit.level))
    assert.deepEqual(levels, [...levels].sort((a, b) => a - b), `${scope.id} の出題が易しい級から並んでいない`)
  }
})

for (const scope of GRAMMAR_DIAGNOSTIC_SCOPES) {
  test(`${scope.label}：全${EXPECTED_UNITS[scope.id]}単元に1問目を1問ずつ、10単元ずつの区切りで、まちがえた単元にだけ別の問題の2問目`, () => {
    const units = grammarDiagnosticUnits(scope.id)
    const { record, rounds, firsts, seconds, missedFirst, missedSecond } = solveAll(scope.id)
    // 1問目：範囲の全単元にちょうど1問ずつ、範囲の順に。
    assert.deepEqual(firsts.map((entry) => entry.key), units.map((unit) => unit.key))
    // 回：1問目は10単元ずつ（最後の回だけ少ない）。2問目は回の頭に出す。最後は2問目だけの回。
    const firstCounts = rounds.map((round) => round.firsts).filter(Boolean)
    assert.equal(firstCounts.length, Math.ceil(units.length / GRAMMAR_DIAGNOSTIC_ROUND))
    assert.ok(firstCounts.slice(0, -1).every((count) => count === GRAMMAR_DIAGNOSTIC_ROUND))
    for (const round of rounds) {
      const firstAt = round.order.indexOf('first')
      if (firstAt >= 0) assert.ok(!round.order.slice(firstAt).includes('second'), '2問目が1問目より後に出た')
    }
    // 2問目：1問目をまちがえた単元にだけ、同じ単元の別の問題を1問。
    assert.deepEqual(seconds.map((entry) => entry.key).sort(), [...missedFirst].sort())
    for (const entry of seconds) {
      const first = firsts.find((item) => item.key === entry.key)
      assert.notEqual(entry.id, first.id, `${entry.key} の2問目が1問目と同じ問題`)
    }
    // 問題は GRAMMAR_PRACTICE のその単元の問題。
    for (const entry of [...firsts, ...seconds]) {
      const item = GRAMMAR_PRACTICE.find((question) => question.id === entry.id)
      assert.ok(item, `${entry.id} が GRAMMAR_PRACTICE にない`)
      assert.equal(keyOf(item), entry.key)
    }
    // 結果：全単元の出来が、答えたとおりに数えられる。
    const summary = summarizeGrammarDiagnostic(record)
    assert.equal(summary.total, units.length)
    assert.equal(summary.finished, true)
    assert.deepEqual(summary.units.map((unit) => unit.key), units.map((unit) => unit.key))
    for (const unit of units) {
      const expected = !missedFirst.has(unit.key) ? 'ok' : missedSecond.has(unit.key) ? 'weak' : 'unsure'
      assert.equal(summary.verdictOf(unit), expected, unit.key)
    }
    assert.deepEqual(summary.counts, {
      ok: units.length - missedFirst.size,
      unsure: missedFirst.size - missedSecond.size,
      weak: missedSecond.size,
      pending: 0,
      todo: 0,
    })
    assert.deepEqual(summary.weak.map((unit) => unit.key).sort(), [...missedSecond].sort())
    // 弱点・あやふやの一覧は易しい級から。
    for (const list of [summary.weak, summary.unsure]) {
      const levels = list.map((unit) => LEVEL_ORDER.indexOf(unit.level))
      assert.deepEqual(levels, [...levels].sort((a, b) => a - b))
    }
    // 系統の行は、範囲に単元がある系統すべて。
    assert.equal(summary.strands.length, new Set(units.map((unit) => unit.strand.id)).size)
    assert.equal(summary.strands.reduce((total, row) => total + row.units.length, 0), units.length)
    // 解き終えた回は履歴に1行で残り、その回のまとめが同じになる。
    assert.equal(record.history.length, 1)
    assert.deepEqual(summarizeGrammarDiagnostic(record, record.history[0].attempt).counts, summary.counts)
    assert.equal(nextGrammarDiagnosticRound(record).length, 0)
  })
}

test('途中の結果：解いていない単元は「まだ」、2問目を待つ単元は「確かめ待ち」で、弱点には入れない', () => {
  let record = startGrammarDiagnostic(null, 'kyotsu', 5)
  const ids = nextGrammarDiagnosticRound(record)
  assert.equal(ids.length, GRAMMAR_DIAGNOSTIC_ROUND)
  ids.forEach((id, index) => { record = recordGrammarDiagnosticAnswer(record, id, index % 2 === 0) })
  const summary = summarizeGrammarDiagnostic(record)
  assert.equal(summary.answered, 10)
  assert.equal(summary.counts.pending, 5)
  assert.equal(summary.counts.todo, 85)
  assert.equal(summary.counts.weak, 0)
  assert.equal(summary.finished, false)
  // 次の回は、確かめの5問を先に、続けて10単元。
  assert.equal(nextGrammarDiagnosticRound(record).length, 15)
})

test('選び直し：同じ問題の答えは置き換え、1問目を正解に直したら2問目は要らない', () => {
  let record = startGrammarDiagnostic(null, 'high', 0)
  const [id] = nextGrammarDiagnosticRound(record)
  const key = keyOf(getGrammar(id))
  record = recordGrammarDiagnosticAnswer(record, id, false)
  const second = nextGrammarDiagnosticRound(record)[0]
  assert.equal(keyOf(getGrammar(second)), key)
  record = recordGrammarDiagnosticAnswer(record, second, false)
  assert.equal(summarizeGrammarDiagnostic(record).verdictOf({ key }), 'weak')
  record = recordGrammarDiagnosticAnswer(record, second, true)
  assert.equal(summarizeGrammarDiagnostic(record).verdictOf({ key }), 'unsure')
  record = recordGrammarDiagnosticAnswer(record, id, true)
  assert.equal(summarizeGrammarDiagnostic(record).verdictOf({ key }), 'ok')
  assert.equal(record.current.units[key].second, undefined)
  // 範囲の外の級の問題・診断に出していない問題は記録しない。
  const outside = GRAMMAR_PRACTICE.find((item) => item.level === '1')
  assert.deepEqual(recordGrammarDiagnosticAnswer(record, outside.id, false), record)
})

// 全127単元：前の回までに出した回数（usage）を1問ずつ積み、単元の問題を使い切るまで毎回まだ出していない問題を選び、
// 前の回に出した型が残っていれば別の型を選ぶこと。使い切ったあとは、出した回数のいちばん少ない問題を選ぶこと。
test('全127単元で、単元の問題を使い切るまで前の回と別の問題（別の型を先に）を選び、使い切ったら出した回数の少ない問題から選ぶ', () => {
  let picks = 0
  for (const unit of GRAMMAR_DIAGNOSTIC_UNITS) {
    const pool = grammarPracticeByTopic(unit.level, unit.topic)
    const counts = new Map()
    const patterns = new Map([[unit.key, new Set()]])
    for (let attempt = 0; attempt < pool.length + 3; attempt += 1) {
      const item = pickGrammarDiagnosticQuestion(unit, { attempt, usage: { counts, patterns } })
      const least = Math.min(...pool.map((question) => counts.get(question.id) ?? 0))
      assert.equal(counts.get(item.id) ?? 0, least, `${unit.key} の${attempt + 1}回目に、出した回数の少ない問題を選んでいない`)
      if (attempt < pool.length) assert.equal(counts.get(item.id) ?? 0, 0, `${unit.key} の${attempt + 1}回目に前の回の問題が出た`)
      const unusedPattern = pool.some((question) => !counts.get(question.id) && !patterns.get(unit.key).has(grammarVariationKey(question)))
      if (unusedPattern && !counts.get(item.id)) {
        assert.ok(!patterns.get(unit.key).has(grammarVariationKey(item)), `${unit.key} の${attempt + 1}回目に、別の型が残っているのに前の型を選んだ`)
      }
      counts.set(item.id, (counts.get(item.id) ?? 0) + 1)
      patterns.get(unit.key).add(grammarVariationKey(item))
      picks += 1
    }
  }
  assert.ok(picks > 4430)
})

for (const scope of GRAMMAR_DIAGNOSTIC_SCOPES) {
  test(`${scope.label}：受け直すたびに、前の回までの問題を出さない（全部まちがえる受け方で12回続けても、全単元で重ならない）`, () => {
    let record = null
    const used = new Map() // 問題 id → 回数
    // 2026-11-13 に前置詞の3単元を24問にしたので、全部まちがえる受け方で12回続けても、どの単元も前の回の問題を出さない。
    const rounds = 12
    for (let attempt = 0; attempt < rounds; attempt += 1) {
      record = startGrammarDiagnostic(record, scope.id, attempt)
      assert.equal(record.current.attempt, attempt)
      const asked = []
      for (let guard = 0; guard < 40; guard += 1) {
        const ids = nextGrammarDiagnosticRound(record)
        if (!ids.length) break
        for (const id of ids) {
          asked.push(id)
          record = recordGrammarDiagnosticAnswer(record, id, false, attempt)
        }
      }
      assert.equal(asked.length, EXPECTED_UNITS[scope.id] * 2)
      for (const id of asked) {
        if (!used.has(id)) continue
        const item = getGrammar(id)
        const pool = grammarPracticeByTopic(item.level, item.topic)
        assert.ok(pool.every((question) => used.has(question.id)), `${scope.id} の第${attempt + 1}回に、まだ出していない問題が残る ${keyOf(item)} で前の回の ${id} が出た`)
      }
      for (const id of asked) used.set(id, (used.get(id) ?? 0) + 1)
    }
    const repeated = [...used].filter(([, count]) => count > 1).map(([id]) => keyOf(getGrammar(id)))
    assert.deepEqual([...new Set(repeated)], [], '前の回の問題が出た単元')
  })
}

test('回ごとの履歴：解き終えた回・途中で受け直した回・範囲のちがう回が残り、前の同じ範囲の回からの変化と、その回の単元ごとの出来が見られる', () => {
  // 第1回：高校入試を解き終える（1問目は3問に1問まちがい、2問目も全部まちがい）。
  let record = startGrammarDiagnostic(null, 'high', 10)
  for (let guard = 0; guard < 20; guard += 1) {
    const ids = nextGrammarDiagnosticRound(record)
    if (!ids.length) break
    ids.forEach((id, index) => { record = recordGrammarDiagnosticAnswer(record, id, index % 3 !== 0 && Boolean(record.current.units[keyOf(getGrammar(id))]?.first) === false, 10) })
  }
  const first = summarizeGrammarDiagnostic(record)
  assert.equal(first.finished, true)
  // 第2回：共通テストを1区切りだけ解いて、受け直す（途中の回として残る）。
  record = startGrammarDiagnostic(record, 'kyotsu', 11)
  for (const id of nextGrammarDiagnosticRound(record)) record = recordGrammarDiagnosticAnswer(record, id, true, 11)
  // 第3回：高校入試を全部正解で解き終える。
  record = startGrammarDiagnostic(record, 'high', 12)
  assert.equal(record.current.attempt, 2)
  for (let guard = 0; guard < 20; guard += 1) {
    const ids = nextGrammarDiagnosticRound(record)
    if (!ids.length) break
    for (const id of ids) record = recordGrammarDiagnosticAnswer(record, id, true, 12)
  }
  const rows = grammarDiagnosticHistory(record)
  assert.deepEqual(rows.map((row) => [row.attempt, row.scope, row.day, row.finished]), [
    [2, 'high', 12, true],
    [1, 'kyotsu', 11, false],
    [0, 'high', 10, true],
  ])
  assert.deepEqual(rows[1].counts, { ok: 10, unsure: 0, weak: 0, pending: 0, todo: 85 })
  assert.equal(rows[1].answered, 10)
  assert.deepEqual(rows[0].counts, { ok: 43, unsure: 0, weak: 0, pending: 0, todo: 0 })
  assert.equal(rows[0].rate, 1)
  // 前の同じ範囲の回（第1回）からの変化。範囲のちがう第2回とは比べない。
  assert.deepEqual(rows[0].previous, { attempt: 0, weak: -first.counts.weak, ok: 43 - first.counts.ok })
  assert.equal(rows[1].previous, null)
  assert.equal(rows[2].previous, null)
  // 履歴から開いた第1回のまとめは、その回の答えのまま（単元ごとの出来・弱点の一覧）。
  const past = summarizeGrammarDiagnostic(record, 0)
  assert.equal(past.isCurrent, false)
  assert.deepEqual(past.counts, first.counts)
  assert.deepEqual(past.weak.map((unit) => unit.key), first.weak.map((unit) => unit.key))
  for (const unit of past.units) assert.equal(past.verdictOf(unit), first.verdictOf(unit))
  assert.equal(summarizeGrammarDiagnostic(record, 2).isCurrent, true)
  // 保存の形（JSON）で往復しても同じ履歴。
  assert.deepEqual(grammarDiagnosticHistory(JSON.parse(JSON.stringify(record))).map((row) => row.counts), rows.map((row) => row.counts))
})

test('弱点からのつながり：全127単元に参考書のページとテストに出す問題がある', () => {
  for (const unit of GRAMMAR_DIAGNOSTIC_UNITS) {
    const page = grammarReferenceFor(unit.level, unit.topic)
    assert.ok(page?.id, `${unit.key} に参考書のページがない`)
    const ids = grammarDiagnosticPracticeIds([unit])
    assert.ok(ids.length >= 2, `${unit.key} の問題が2問ない`)
    assert.ok(ids.every((id) => keyOf(getGrammar(id)) === unit.key))
  }
})

test('文法モードへのつなぎ：入口・文法テストでの記録・戻り先・参考書とテストへの移り先', () => {
  const app = read('src/App.jsx')
  assert.match(app, /grammarDiagnostic: GrammarDiagnosticScreen,/)
  assert.match(read('src/lib/appHome.js'), /'grammarDiagnostic'/)
  assert.match(read('src/lib/contentSettings.js'), /grammar: \[[^\]]*'grammarDiagnostic'/)
  const grammar = read('src/screens/Grammar.jsx')
  assert.match(grammar, /onClick=\{\(\) => navigate\('grammarDiagnostic'\)\}/)
  assert.match(grammar, /data-grammar-diagnostic-entry/)
  const quiz = read('src/screens/GrammarQuiz.jsx')
  assert.match(quiz, /const diagnostic = params\.source\?\.diagnostic === true/)
  // 最初の答えと選び直しの両方で、診断の記録に入れる。
  assert.equal((quiz.match(/if \(diagnostic\) recordDiagnosticAnswer\(item\.id, answer === 'correct'\)/g) ?? []).length, 2)
  const screen = read('src/screens/GrammarDiagnostic.jsx')
  assert.match(screen, /source: \{ type: 'grammarList', ids, preserveOrder: true, diagnostic: true \}/)
  assert.match(screen, /continueTo: \{ screen: 'grammarDiagnostic'/)
  assert.match(screen, /navigate\('grammarReference', \{ unitId: page\.id \}\)/)
  assert.match(screen, /source: \{ type: 'grammar', level: unit\.level, topic: unit\.topic, questionType: 'mixed' \}/)
  assert.match(screen, /source: \{ type: 'grammarList', ids: grammarDiagnosticPracticeIds\(summary\.weak\) \}/)
})

test('記録の保存：端末の保存・進捗コード・同期・記録の消去に入り、壊れた値は空に戻す', async () => {
  assert.ok(PERSISTED_PROGRESS_FIELDS.includes('grammarDiagnostic'))
  assert.ok(RESETTABLE_PROGRESS_FIELDS.includes('grammarDiagnostic'))
  assert.match(read('src/lib/cloudSync.js'), /grammarDiagnostic: normalizeGrammarDiagnostic\(data\.grammarDiagnostic\)/)
  assert.match(read('src/store/useStore.js'), /grammarDiagnostic: normalizeGrammarDiagnostic\(payload\.grammarDiagnostic\)/)
  assert.deepEqual(normalizeGrammarDiagnostic(null), { current: null, history: [] })
  assert.deepEqual(normalizeGrammarDiagnostic({ current: { scope: 'nope', units: {} }, history: 'x' }), { current: null, history: [] })
  // 途中まで解いた記録を保存の形（JSON）で往復しても、続きから同じ問題が出る。
  let record = startGrammarDiagnostic(null, 'nankan', 3)
  for (const id of nextGrammarDiagnosticRound(record)) record = recordGrammarDiagnosticAnswer(record, id, false)
  const restored = normalizeGrammarDiagnostic(JSON.parse(JSON.stringify(record)))
  assert.deepEqual(nextGrammarDiagnosticRound(restored), nextGrammarDiagnosticRound(record))
  assert.equal(summarizeGrammarDiagnostic(restored).answered, 10)
})
