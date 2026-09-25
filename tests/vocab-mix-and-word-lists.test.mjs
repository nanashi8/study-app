import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { wordsByLevel } from '../src/data/vocab.js'
import { automaticVocabSessionPlan, buildDeck } from '../src/lib/session.js'
import {
  VOCAB_MIX_DEFAULT,
  VOCAB_MIX_STEPS,
  describeVocabMix,
  normalizeVocabMix,
  vocabMixAtIndex,
  vocabMixEmptyNotice,
  vocabMixFreshShare,
  vocabMixIndex,
} from '../src/lib/vocabMix.js'
import { vocabularyReviewMetrics } from '../src/lib/vocabScheduler.js'
import { normalizeSettings, todayIndex, useStore } from '../src/store/useStore.js'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

test('出題バランスの目盛りは自動を既定にし、割合を6段で示す', () => {
  assert.equal(VOCAB_MIX_DEFAULT, 'auto')
  assert.deepEqual(VOCAB_MIX_STEPS.map((step) => step.id), [
    'auto',
    'review-only',
    'review-heavy',
    'even',
    'fresh-heavy',
    'fresh-only',
  ])
  assert.equal(vocabMixFreshShare('auto'), null)
  assert.equal(vocabMixFreshShare('review-only'), 0)
  assert.equal(vocabMixFreshShare('fresh-only'), 1)
  assert.equal(vocabMixIndex('even'), 3)
  assert.equal(vocabMixAtIndex('3'), 'even')
  assert.equal(describeVocabMix('even'), '10問中 復習5・未修5')
  // 知らない保存値・古い保存値は自動へ戻す（配分を勝手に固定しない）。
  assert.equal(normalizeVocabMix('unknown'), 'auto')
  assert.equal(normalizeSettings({ vocabMix: 'nope' }).vocabMix, 'auto')
  assert.equal(normalizeSettings({}).vocabMix, 'auto')
  assert.equal(normalizeSettings({ vocabMix: 'review-only' }).vocabMix, 'review-only')
})

test('バーで指定した割合は、自動プロファイルより優先して出題を組む', () => {
  const now = new Date(2026, 7, 24, 12, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const words = wordsByLevel('4')
  const dueWords = words.slice(0, 8)
  const dueIds = new Set(dueWords.map((word) => word.id))
  const srs = Object.fromEntries(dueWords.map((word) => [word.id, {
    box: 1,
    due: day,
    last: day - 2,
    lastAt: now - 2 * 86_400_000,
  }]))

  // 同じ在庫でも、自動なら balanced（新しい語4問）になる場面。
  assert.equal(
    automaticVocabSessionPlan(words, { srs, size: 10, purpose: 'study', day }).profile,
    'balanced',
  )

  // 「復習だけ」は復習が8語しかなくても、まだ学んでいない語で10問に埋めない。
  // 途中の段（復習寄りなど）は、足りない側をもう一方で補う。
  const cases = [
    { mix: 'review-only', reviewCount: 8, varietyCount: 0 },
    { mix: 'review-heavy', reviewCount: 8, varietyCount: 2 },
    { mix: 'even', reviewCount: 5, varietyCount: 5 },
    { mix: 'fresh-only', reviewCount: 0, varietyCount: 10 },
  ]

  for (const expected of cases) {
    const freshShareOverride = vocabMixFreshShare(expected.mix)
    const plan = automaticVocabSessionPlan(words, {
      srs, size: 10, purpose: 'study', day, freshShareOverride,
    })
    const deck = buildDeck(
      { type: 'level', levelId: '4' },
      { srs, size: 10, purpose: 'study', now, day, freshShareOverride },
    )
    assert.equal(plan.profile, 'manual', expected.mix)
    assert.equal(plan.freshShare, freshShareOverride, expected.mix)
    assert.equal(deck.filter((word) => dueIds.has(word.id)).length, expected.reviewCount, expected.mix)
    assert.equal(deck.filter((word) => !dueIds.has(word.id)).length, expected.varietyCount, expected.mix)
  }
})

test('「未修だけ」は まだ・不正解 を、「復習だけ」は未修の語を出さず、足りない分は 覚えた・正解 で埋める', () => {
  const now = new Date(2026, 8, 12, 9, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const source = { type: 'level', levelId: '4' }
  const words = wordsByLevel('4')
  const remembered = (lastAt, due) => ({
    box: 1, correct: 1, wrong: 0, due, last: todayIndex(lastAt), lastAt,
    memory: { passes: 1, remembered: 1, forgot: 0, lastAt, lastJudgment: 'remembered', marks: [1] },
  })
  const forgot = (lastAt, due) => ({
    box: 0, correct: 0, wrong: 1, due, last: todayIndex(lastAt), lastAt,
    memory: { passes: 1, remembered: 0, forgot: 1, lastAt, lastJudgment: 'forgot', marks: [0] },
  })
  const studied = (srs) => (word) => Boolean(srs[word.id])
  const build = (srs, mix, purpose, size = 10) => buildDeck(source, {
    srs, size, purpose, now, day, freshShareOverride: vocabMixFreshShare(mix),
  })

  // 今日40語を「覚えた」（復習日は明日）。未修が残るうちは、未修の枠に学んだ語を入れない。
  const learnedToday = Object.fromEntries(words.slice(0, 40).map((word) => [word.id, remembered(now, day + 1)]))
  for (const purpose of ['study', 'quiz']) {
    const deck = build(learnedToday, 'fresh-only', purpose)
    assert.equal(deck.length, 10, purpose)
    assert.equal(deck.filter(studied(learnedToday)).length, 0, `${purpose}: 未修が残るのに学んだ語が混ざった`)
  }
  // 途中の段でも、未修が残るうちは「未修」の枠を学習済みの語で埋めない。
  const heavyQuiz = build(learnedToday, 'fresh-heavy', 'quiz')
  assert.equal(heavyQuiz.filter((word) => !learnedToday[word.id]).length, 8)

  // 未修の語が3語しか残っていない級。「未修だけ」は3語を先に出し、残りは覚えた語で埋める。
  const unlearnedIds = new Set(words.slice(-3).map((word) => word.id))
  const nearlyDone = Object.fromEntries(words
    .filter((word) => !unlearnedIds.has(word.id))
    .map((word, index) => [word.id, remembered(now - 2 * 86_400_000, index < 5 ? day : day + 3)]))
  for (const purpose of ['study', 'quiz']) {
    const freshOnly = build(nearlyDone, 'fresh-only', purpose)
    assert.equal(freshOnly.length, 10, purpose)
    assert.deepEqual(
      new Set(freshOnly.slice(0, 3).map((word) => word.id)),
      unlearnedIds,
      `${purpose}: 未修を先に出す`,
    )
    assert.equal(build(nearlyDone, 'fresh-only', purpose, 0).length, words.length, `${purpose}: 数えるときも同じ`)
    // 「復習だけ」は、残り3語の未修を混ぜない。
    const reviewOnly = build(nearlyDone, 'review-only', purpose)
    assert.equal(reviewOnly.length, 10, purpose)
    assert.equal(reviewOnly.filter((word) => unlearnedIds.has(word.id)).length, 0, purpose)
  }

  // 未修の語がない級で「未修だけ」なら、覚えた語から出す。
  const allLearned = Object.fromEntries(words.map((word) => [word.id, remembered(now, day + 1)]))
  assert.equal(build(allLearned, 'fresh-only', 'study').length, 10)
  assert.equal(build(allLearned, 'fresh-only', 'quiz').length, 10)
  // 未修も覚えた語もなく「まだ」の語だけが残る級なら、「未修だけ」は空にして、画面が理由を示す。
  const allForgot = Object.fromEntries(words.map((word) => [word.id, forgot(now - 86_400_000, day)]))
  assert.equal(build(allForgot, 'fresh-only', 'study').length, 0)
  assert.equal(build(allForgot, 'fresh-only', 'quiz').length, 0)
  assert.equal(build(allForgot, 'review-only', 'study').length, 10)
  assert.equal(vocabMixEmptyNotice('fresh-only').title, '未修の単語は残っていません')
  assert.equal(vocabMixEmptyNotice('review-only').title, '復習する単語はまだありません')
  assert.equal(vocabMixEmptyNotice('even'), null)
  assert.equal(vocabMixEmptyNotice('auto'), null)
})

test('未修の枠は未修が尽きたら 覚えた・正解 を出題順に、復習の枠は まだ・不正解 が尽きたら 覚えた・正解 を点数の低い順に出す', () => {
  const DAY_MS = 86_400_000
  const now = new Date(2026, 8, 21, 10, 0, 0, 0).getTime()
  const day = todayIndex(now)
  const source = { type: 'level', levelId: '4' }
  const words = wordsByLevel('4')
  const scoreOf = (entry) => vocabularyReviewMetrics(entry, { now, day }).score

  // 記録は実際の書き込み口（ストアの review）で作る。events は [何日前, 結果]。
  const recorded = (events) => {
    const original = useStore.getState()
    const realNow = Date.now
    try {
      useStore.setState({ srs: {} })
      events.forEach(([daysAgo, result], index) => {
        Date.now = () => now - daysAgo * DAY_MS - (events.length - index) * 60_000
        useStore.getState().review('fixture', result, 'vocab')
      })
      return useStore.getState().srs.fixture
    } finally {
      Date.now = realNow
      useStore.setState(original, true)
    }
  }
  // 復習日が来るたびに成功し続け、箱が育ったまま復習日を過ぎた記録。
  const steadyRecorded = (result) => {
    const events = []
    let daysAgo = 40
    for (let turn = 0; turn < 40 && daysAgo > 0; turn += 1) {
      events.push([daysAgo, result])
      const entry = recorded(events)
      if (entry.box >= 4) return entry
      daysAgo = Math.max(1, daysAgo - Math.max(1, entry.due - todayIndex(now - daysAgo * DAY_MS)))
    }
    throw new Error('素材の箱が育たない')
  }

  for (const purpose of ['study', 'quiz']) {
    const hit = purpose === 'quiz' ? 'correct' : 'remembered'
    const miss = purpose === 'quiz' ? 'wrong' : 'forgot'
    const entries = {
      missed: recorded([[3, miss], [1, miss]]),
      due: recorded([[5, hit], [3, hit]]),
      // 続けて覚えた・正解した語（定着）。きのう3回続けて成功し、まだ忘れかけていない。
      steady: recorded([[1, hit], [1, hit], [1, hit]]),
      // 長期に入ったあと復習日を大きく過ぎ、忘れかけた語。
      lapsed: steadyRecorded(hit),
      today: recorded([[0, hit]]),
    }
    // 連続で成功して復習日を大きく過ぎた語は、今日が復習日の語より点数が低い。
    assert.ok(
      scoreOf(entries.lapsed) < scoreOf(entries.due) && scoreOf(entries.due) < scoreOf(entries.today),
      `${purpose}: 素材の点数`,
    )
    assert.equal(vocabularyReviewMetrics(entries.steady, { now, day }).steady, true, `${purpose}: 定着の確認`)
    assert.equal(vocabularyReviewMetrics(entries.lapsed, { now, day }).steady, false, `${purpose}: 忘れかけた定着`)

    // 未修のない級：まだ15語、復習日が来た覚えた語5語、連続で覚えた語5語、残りは今日覚えた語。
    const kinds = new Map()
    const plan = [['missed', 15], ['due', 5], ['steady', 5]]
    let at = 0
    for (const [kind, count] of plan) {
      for (let index = 0; index < count; index += 1) kinds.set(words[at++].id, kind)
    }
    for (; at < words.length; at += 1) kinds.set(words[at].id, 'today')
    const srsFor = (swap = {}) => Object.fromEntries(words.map((word) => {
      const kind = kinds.get(word.id)
      return [word.id, entries[swap[kind] ?? kind]]
    }))
    const build = (srs, mix) => buildDeck(source, {
      srs, size: 10, purpose, now, day, freshShareOverride: vocabMixFreshShare(mix),
    })
    const kindsOf = (deck) => deck.map((word) => kinds.get(word.id))
    const missedCount = (deck) => kindsOf(deck).filter((kind) => kind === 'missed').length

    const srs = srsFor()
    // 未修寄りでも、まだ・不正解は復習の枠の2語だけ。未修の枠の8語は覚えた・正解から出す。
    assert.equal(missedCount(build(srs, 'fresh-heavy')), 2, `${purpose}: 未修寄り`)
    assert.equal(missedCount(build(srs, 'fresh-only')), 0, `${purpose}: 未修だけ`)
    assert.equal(missedCount(build(srs, 'review-heavy')), 8, `${purpose}: 復習寄り`)
    assert.equal(missedCount(build(srs, 'review-only')), 10, `${purpose}: 復習だけ`)
    // 未修の枠の覚えた・正解は出題順：復習日が来た語、次に定着の確認（続けて覚えた・正解した語）。
    assert.deepEqual(
      kindsOf(build(srs, 'fresh-only')),
      [...Array(5).fill('due'), ...Array(5).fill('steady')],
      `${purpose}: 未修の枠は出題順`,
    )
    // 定着の語を忘れかけた記録にすると、復習日が来た語と同じ段で点数の低い順（先に出る）。
    // （kindsOf は語の役の名前を返すので、忘れかけた記録を持つ語も 'steady' と数える。）
    const withLapsed = srsFor({ steady: 'lapsed' })
    assert.deepEqual(
      kindsOf(build(withLapsed, 'fresh-only')),
      [...Array(5).fill('steady'), ...Array(5).fill('due')],
      `${purpose}: 忘れかけた定着は復習と同じ`,
    )

    // まだ・不正解がない級（まだの語も今日覚えた語にする）：復習の枠は覚えた・正解を点数の低い順に。
    const noMissed = srsFor({ missed: 'today', steady: 'lapsed' })
    assert.deepEqual(
      kindsOf(build(noMissed, 'review-only')),
      [...Array(5).fill('steady'), ...Array(5).fill('due')],
      `${purpose}: 復習の枠は点数の低い順`,
    )
    assert.equal(
      kindsOf(build(noMissed, 'review-heavy')).filter((kind) => kind !== 'today').length,
      10,
      `${purpose}: 復習寄りも点数の低い語から`,
    )
  }
})

test('学習の途中でバーを動かすと、まだ答えていない先の問題からその割合で組み直す', () => {
  const study = read('../src/screens/VocabStudy.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')
  const result = read('../src/screens/SessionResult.jsx')
  const progress = read('../src/lib/vocabSessionProgress.js')

  for (const source of [study, quiz]) {
    assert.match(source, /appliedVocabMix\.current === (?:settings\.)?vocabMix/)
    assert.match(source, /if \(!isAutomaticVocabularySource\(source\)\) return/)
    // いま表示している問題と答えた問題は残し、その先だけを新しい割合の出題に替える。
    assert.match(source, /growDeck\(current, keepCount, buildFor\(size\), Math\.max\(size, keepCount\)\)/)
    assert.match(source, /vocabMixEmptyNotice\((?:settings\.)?vocabMix\)/)
    assert.doesNotMatch(source, /次に組む出題から効かせる/)
  }
  assert.match(study, /Math\.max\(i \+ 1, \.\.\.answeredIndexes\.map\(\(index\) => index \+ 1\)\)/)
  // 結果画面の「次の◯語へ」も、同じ割合で実際に出せる数を数える。
  assert.match(result, /freshShareOverride: vocabMixFreshShare\(settings\.vocabMix\)/)
  assert.equal((progress.match(/^ {4}freshShareOverride,$/gm) ?? []).length, 3)
})

test('画面下部の同じ枠で、読み上げと出題バランスを切り替える', () => {
  const dock = read('../src/components/SpeechConsole.jsx')
  const mix = read('../src/components/VocabMixConsole.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const quiz = read('../src/screens/VocabQuiz.jsx')

  assert.match(dock, /data-study-dock-tabs/)
  // 切り替えは各パネルの見出し行の先頭に入れ、切り替えだけの段を作らない。
  assert.match(dock, /export function SpeechConsole\(\{ state, onRateChange, onRangeChange = null, range = null, leading = null \}\)/)
  assert.match(mix, /export function VocabMixConsole\(\{ leading = null \} = \{\}\)/)
  assert.equal((dock.match(/leading=\{tabs\}/g) ?? []).length, 2)
  assert.doesNotMatch(dock, /grid grid-cols-2 gap-1 px-2 pt-1\.5/)
  // 再生の6操作は残し、アイコンと名前を横に並べて押せる高さ44pxの1段に収める。
  assert.match(dock, /flex min-h-11 min-w-0 items-center justify-center/)
  assert.doesNotMatch(dock, /flex min-h-11 min-w-0 flex-col/)
  assert.match(dock, /読み上げ/)
  assert.match(dock, /出題バランス/)
  assert.match(dock, /vocabMixApplies\(screen, params\)/)
  // 読み上げも出題バランスも無い画面では、これまでどおり何も出さない。
  assert.match(dock, /if \(!state\.visible && !mixAvailable\) return null/)
  assert.match(mix, /data-vocab-mix-range/)
  assert.match(mix, /setSetting\('vocabMix'/)
  assert.match(mix, /次の出題から/)
  // 読み上げ欄と同じ枠を分け合うので、見出し1行＋操作1行の高さから増やさない。
  assert.match(mix, /data-vocab-mix-console-controls/)
  assert.doesNotMatch(mix, /<p className="mt-0\.5/)
  // 出す語が決まっている画面（マイ単語・復習など）ではバーを出さない。
  assert.match(mix, /isAutomaticVocabularySource/)
  for (const source of [study, quiz]) {
    assert.match(source, /freshShareOverride: vocabMixFreshShare\(currentContentSettings\(\)\.vocabMix\)/)
  }
})

test('マイ単語はほかの単語帳と同じ1冊で、どの冊もマイ学習ノートと同じ保存先を使う', () => {
  const sheet = read('../src/components/WordListSheet.jsx')
  const study = read('../src/screens/VocabStudy.jsx')
  const detail = read('../src/screens/WordDetail.jsx')
  const levels = read('../src/screens/VocabLevels.jsx')

  assert.match(sheet, /title="単語帳"/)
  // 冊の並び・数え方はライブラリ1か所で決め、画面ごとにずらさない。「マイ単語」だけの特別な冊は作らない。
  const books = read('../src/lib/wordBooks.js')
  assert.match(books, /return sets\.map\(\(set\) => \(\{/)
  assert.doesNotMatch(books, /MY_WORDS_BOOK|renamable|myList/)
  // どの冊も同じ行で並べ、同じ操作で入れる・外す（1語でも、まとめてでも）。
  assert.doesNotMatch(sheet, /toggleMyList|(?:store|state)\.myList|data-word-list-my-words|いつもの単語帳/)
  assert.match(sheet, /createNotebookSet/)
  assert.match(sheet, /setNotebookSetRefs\(set\.id, refs, !removes\)/)
  // もう入らない冊（全部入っている・500項目でいっぱい）は、押すと入っている語を外す。行を押せないままにしない。
  assert.match(sheet, /const removes = present > 0 && !canAdd/)
  assert.match(sheet, /data-word-list-new-title/)
  // マイ学習ノートでも同じ「単語帳」の名前で並び、「問題集」とは呼ばない。
  assert.match(sheet, /単語帳は、マイ学習ノートの「単語帳」にも並びます/)
  assert.doesNotMatch(sheet, /問題集と同じもの/)
  // 新しい保存領域は作らない（進捗コード・クラウド同期の契約を増やさない）。
  assert.doesNotMatch(sheet, /useStore\.setState/)
  for (const source of [study, detail]) {
    assert.match(source, /<WordListSheet/)
    assert.match(source, /wordId=\{word\.id\}/)
    assert.match(source, /useWordInAnyBook/)
    assert.doesNotMatch(source, /toggleMyList|マイ単語/)
  }
  assert.match(study, /label="単語帳"/)
  assert.match(detail, /単語帳に入れる/)
  assert.doesNotMatch(detail, /マイ単語リストに保存|マイ単語帳に入れる/)

  // 単語画面の単語帳の入口は「今日の学習」の下、10分野・語源と並ぶ選び方の1つで、単語帳を選んで学ぶ。冊数だけを示す。
  assert.match(levels, /<WordBookStudySheet/)
  assert.match(levels, /data-vocab-word-books-shortcut/)
  assert.match(levels, /\{wordBookCount\}冊\n/)
  assert.doesNotMatch(levels, /title: 'マイ単語'|(?:s|state)\.myList|マイ単語\{/)
  assert.ok(levels.indexOf('今日の復習') < levels.indexOf('data-vocab-word-books-shortcut'))
})
