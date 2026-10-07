// 暗記の途中で次の単語へ進まなくなった不具合（requests/2026-10-07-study-save-quota.json）。
// 2026-10-07 利用者:
//   英単語を1回のカード数を100で10問中10問未習からの出題で英検準1級を暗記していたところ、途中から自動で次の単語に
//   進まなくなる不具合が発生したので、原因を究明して、同様の不具合が発生しないようにしなさい。
//
// 原因：記録は localStorage（およそ5MBまで）へ、記録を変えるたびに同じ流れで書いていた。容量を超えると
// localStorage.setItem が QuotaExceededError を投げ、review() から暗記カードの「まだ／覚えた」の処理へ伝わって、
// 次のカードへ移る前に止まった。直した作り（src/lib/appStorage.js）は IndexedDB へ保存し、どの失敗でも例外を外へ出さない。
// ブラウザでの確かめ（容量・引き継ぎ・利用者の場面・画面の知らせ）は tests/study-save-quota-browser.test.mjs。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createJSONStorage } from 'zustand/middleware'

import {
  IDB_STORE,
  createAppStorage,
  getSaveStatus,
  saveFailureReason,
} from '../src/lib/appStorage.js'
import { ALL_WORDS } from '../src/data/vocab.js'
import { KOTEN_WORDS } from '../src/data/koten.js'
import { MATH_EXAM_PROBLEMS } from '../src/data/math-exam.js'
import { ALL_SUBJECT_QUESTIONS } from '../src/data/subjects/index.js'
import { useStore } from '../src/store/useStore.js'

const ROOT = new URL('..', import.meta.url).pathname
const quotaError = () => new DOMException('The quota has been exceeded.', 'QuotaExceededError')

// 入る文字数に上限がある localStorage（limit を超える書き込みは QuotaExceededError）。
function limitedLocalStorage(limit = 0, initial = {}) {
  const memory = new Map(Object.entries(initial))
  return {
    memory,
    getItem: (key) => (memory.has(key) ? memory.get(key) : null),
    setItem: (key, value) => {
      const text = String(value)
      let used = 0
      for (const [other, stored] of memory) if (other !== key) used += other.length + stored.length
      if (used + key.length + text.length > limit) throw quotaError()
      memory.set(key, text)
    },
    removeItem: (key) => memory.delete(key),
  }
}

// 小さな IndexedDB の作り物。open（成功・例外・失敗・返事なし）と書き込み（成功・失敗・例外）を選べる。
function fakeIndexedDB({ open = 'ok', put = 'ok', initial = {} } = {}) {
  const data = new Map(Object.entries(initial))
  const later = (callback) => setTimeout(callback, 1)
  const transaction = () => {
    if (put === 'throw') throw new DOMException('The database connection is closing.', 'InvalidStateError')
    const tx = {}
    tx.objectStore = () => ({
      get: (key) => {
        const request = {}
        later(() => {
          request.result = data.get(key)
          request.onsuccess?.()
        })
        return request
      },
      put: (value, key) => {
        later(() => {
          if (put === 'quota' || put === 'error') {
            tx.error = put === 'quota' ? quotaError() : new DOMException('write failed', 'UnknownError')
            tx.onerror?.()
            return
          }
          data.set(key, value)
          tx.oncomplete?.()
        })
      },
      delete: (key) => {
        later(() => {
          data.delete(key)
          tx.oncomplete?.()
        })
      },
    })
    return tx
  }
  const db = {
    objectStoreNames: { contains: (name) => name === IDB_STORE },
    createObjectStore: () => {},
    transaction,
    close: () => {},
  }
  return {
    data,
    open: () => {
      if (open === 'throw') throw new DOMException('blocked', 'SecurityError')
      const request = {}
      if (open === 'hang') return request
      later(() => {
        if (open === 'error') {
          request.error = new DOMException('open failed', 'UnknownError')
          request.onerror?.()
          return
        }
        request.result = db
        request.onsuccess?.()
      })
      return request
    },
  }
}

const VALUE = Object.freeze({ state: { srs: { abandon: { box: 1 } } }, version: 11 })
const unhandled = []
const onUnhandled = (reason) => unhandled.push(reason)
let vite

before(async () => {
  process.on('unhandledRejection', onUnhandled)
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
})

after(async () => {
  process.off('unhandledRejection', onUnhandled)
  await vite?.close()
})

// 1回の書き込みを、例外も reject も出さずに終えるか。終えたあとの保存の状態を返す。
async function writeOnce(storage) {
  const loaded = storage.getItem('eigo-quest')
  await assert.doesNotReject(Promise.resolve(loaded))
  let returned
  assert.doesNotThrow(() => {
    returned = storage.setItem('eigo-quest', VALUE)
  })
  assert.equal(returned, undefined, 'setItem は reject しうる Promise を返さない')
  await storage.settled?.()
  await new Promise((resolve) => setTimeout(resolve, 5))
  return getSaveStatus()
}

test('原因の再現：直す前の作り（localStorage へそのまま書く）では、容量がいっぱいだと記録の書き込みが例外を投げる', () => {
  const word = ALL_WORDS.find((item) => item.level === 'pre1')
  const full = limitedLocalStorage(0)
  // 2026-10-07 までの persist の保存先（zustand の既定と同じ createJSONStorage(() => localStorage)）。
  useStore.persist.setOptions({ storage: createJSONStorage(() => full) })
  try {
    assert.throws(
      () => useStore.getState().review(word.id, 'remembered', 'vocab'),
      { name: 'QuotaExceededError' },
      '直す前の作りでは「覚えた」の review が例外を投げ、画面は次のカードへ移る前に止まる',
    )
    // 記録はメモリには入るので、押し直すと二重に数えていた。
    assert.equal(useStore.getState().srs[word.id]?.correct, 1)
  } finally {
    useStore.persist.setOptions({ storage: createAppStorage(null) })
  }
})

test('原因の再現：直した作り（lib/appStorage.js）では、容量がいっぱいでも記録の書き込みは例外を投げず、記録はメモリに入る', async () => {
  const word = ALL_WORDS.filter((item) => item.level === 'pre1')[1]
  const full = limitedLocalStorage(0)
  const storage = createAppStorage({ localStorage: full })
  useStore.persist.setOptions({ storage })
  try {
    const before = useStore.getState().srs[word.id]?.correct ?? 0
    assert.doesNotThrow(() => useStore.getState().review(word.id, 'remembered', 'vocab'))
    assert.equal(useStore.getState().srs[word.id].correct, before + 1)
    assert.deepEqual({ ok: getSaveStatus().ok, reason: getSaveStatus().reason }, { ok: false, reason: 'quota' })
  } finally {
    useStore.persist.setOptions({ storage: createAppStorage(null) })
  }
})

test('保存の失敗の全ての型で、書き込みは例外も reject も外へ出さず、失敗の型を状態に置く', async () => {
  const throwingGetter = {}
  Object.defineProperty(throwingGetter, 'localStorage', {
    get() {
      throw new DOMException('denied', 'SecurityError')
    },
  })
  const cases = [
    ['localStorage が容量超過（IndexedDB の無い端末）', { localStorage: limitedLocalStorage(0) }, 'quota'],
    ['保存先が無い', {}, 'unavailable'],
    ['localStorage を読むだけで例外（端末の保存を止めている）', throwingGetter, 'unavailable'],
    ['IndexedDB を開くと例外・localStorage も無い', { indexedDB: fakeIndexedDB({ open: 'throw' }) }, 'open'],
    ['IndexedDB を開けない・localStorage は容量超過', { indexedDB: fakeIndexedDB({ open: 'error' }), localStorage: limitedLocalStorage(0) }, 'quota'],
    ['IndexedDB から返事が無い・localStorage も無い', { indexedDB: fakeIndexedDB({ open: 'hang' }) }, 'open'],
    ['IndexedDB の書き込みが容量超過', { indexedDB: fakeIndexedDB({ put: 'quota' }) }, 'quota'],
    ['IndexedDB の書き込みが失敗', { indexedDB: fakeIndexedDB({ put: 'error' }) }, 'write'],
    ['IndexedDB の書き込みを始めると例外', { indexedDB: fakeIndexedDB({ put: 'throw' }) }, 'write'],
  ]
  for (const [label, env, reason] of cases) {
    const status = await writeOnce(createAppStorage(env, { openTimeoutMs: 30 }))
    assert.deepEqual({ ok: status.ok, reason: status.reason }, { ok: false, reason }, label)
  }
  // 保存できたら、失敗の状態は消える（画面の知らせも消える）。
  const ok = await writeOnce(createAppStorage({ indexedDB: fakeIndexedDB() }))
  assert.deepEqual({ ok: ok.ok, backend: ok.backend }, { ok: true, backend: 'indexedDB' })
  // IndexedDB を開けない端末でも、localStorage に入れば保存できたことになる。
  const fallback = await writeOnce(createAppStorage({ indexedDB: fakeIndexedDB({ open: 'error' }), localStorage: limitedLocalStorage(1e6) }))
  assert.deepEqual({ ok: fallback.ok, backend: fallback.backend }, { ok: true, backend: 'localStorage' })
  assert.equal(saveFailureReason({ name: 'NS_ERROR_DOM_QUOTA_REACHED' }), 'quota')
  assert.deepEqual(unhandled, [], '処理されない reject が出た')
})

test('記録を書くストアの全操作が、保存に失敗しても例外を投げず、記録はメモリに入る', async () => {
  const storage = createAppStorage({ localStorage: limitedLocalStorage(0) })
  useStore.persist.setOptions({ storage })
  const word = ALL_WORDS.filter((item) => item.level === 'pre1')[2]
  const koten = KOTEN_WORDS[0]
  const scienceQuestion = ALL_SUBJECT_QUESTIONS.find((question) => question.subject === 'science')
  const state = () => useStore.getState()
  let receipt = null
  // [操作の名前, 呼び方, 変わるはずの欄]
  const actions = [
    ['review', () => { receipt = state().review(word.id, 'remembered', 'vocab') }, 'srs'],
    ['reviseReview', () => { receipt = state().reviseReview(receipt, 'forgot') }, 'srs'],
    ['reviewEtymology', () => state().reviewEtymology('pack-test', 'remembered'), 'etymologySrs'],
    ['reviewKoten', () => state().reviewKoten(koten.id, 'remembered'), 'kotenSrs'],
    ['reviewKotenGrammar', () => state().reviewKotenGrammar('kg-test', 'correct'), 'kotenGrammarSrs'],
    ['reviewSubjectTerm', () => state().reviewSubjectTerm('social', 'term-test', 'remembered'), 'socialTermSrs'],
    ['reviewKotenCulture', () => state().reviewKotenCulture('kc-test', 'correct'), 'kotenCultureSrs'],
    ['reviewKotenInterpretation', () => state().reviewKotenInterpretation('ki-test', 'wrong'), 'kotenInterpretationSrs'],
    ['reviewKanbun', () => state().reviewKanbun('vocab', 'kv-test', 'remembered'), 'kanbunVocabSrs'],
    ['reviewKanbunKundoku', () => state().reviewKanbunKundoku('kk-test', 'correct'), 'kanbunKundokuSrs'],
    ['reviewLearningContent', () => state().reviewLearningContent('vocab', ALL_WORDS[3].id, 'remembered'), 'srs'],
    ['reviewCustomCard', () => state().reviewCustomCard('c-test', 'remembered'), 'customCardSrs'],
    ['recordVocabHistory', () => state().recordVocabHistory(word.id), 'vocabHistory'],
    ['recordWritingCompletion', () => state().recordWritingCompletion({ exerciseId: 'w-test', text: 'I like it.', mode: 'guide', wordCount: 3 }), 'writingProgress'],
    ['markReadingDone', () => state().markReadingDone('passage-test'), 'readingsDone'],
    ['markLiteratureDone', () => state().markLiteratureDone('literature-test'), 'readingsDone'],
    ['recordGrammarReference', () => state().recordGrammarReference('gref_test', 'understood'), 'grammarReferenceLog'],
    ['recordMathStory', () => state().recordMathStory('mh-test', 'understood'), 'mathStoryLog'],
    ['recordMathExamAttempt', () => state().recordMathExamAttempt(MATH_EXAM_PROBLEMS[0].id, 'solved', 30), 'mathExamLog'],
    ['recordSubjectPractice', () => state().recordSubjectPractice(scienceQuestion.subject, scienceQuestion.id, 'correct', 20), 'sciencePracticeLog'],
    ['markMathDone', () => state().markMathDone('math-test'), 'mathDone'],
    ['recordSkillResult', () => state().recordSkillResult('vocab', 1, 1), 'skillStats'],
    ['recordContentQuizResult', () => state().recordContentQuizResult('vocab', 'quiz-test', 1, 1), 'contentQuizResults'],
  ]
  try {
    for (const [name, run, field] of actions) {
      const before = state()[field]
      assert.doesNotThrow(run, `${name} が例外を投げた`)
      assert.notEqual(state()[field], before, `${name} の記録がメモリに入っていない`)
      assert.equal(getSaveStatus().ok, false, `${name} の保存の失敗が状態にない`)
    }
    // 記録を書く review 系の操作が増えても、ここで確かめていない操作を残さない。
    const tested = new Set(actions.map(([name]) => name))
    const reviewActions = Object.keys(state()).filter((key) => /^review/.test(key) && typeof state()[key] === 'function')
    assert.deepEqual(reviewActions.filter((name) => !tested.has(name)), [], '確かめていない review 系の操作がある')
  } finally {
    useStore.persist.setOptions({ storage: createAppStorage(null) })
  }
})

test('アプリの中で localStorage・IndexedDB を使うのは保存の部品（lib/appStorage.js）だけで、ストアはそれを保存先にする', () => {
  const files = []
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name)
      if (statSync(path).isDirectory()) walk(path)
      else if (/\.(js|jsx)$/.test(name)) files.push(path)
    }
  }
  walk(join(ROOT, 'src'))
  const users = files
    .filter((path) => /\blocalStorage\s*[.[]|\bindexedDB\s*[.[]|createJSONStorage|\blocalStorage\s*\)/.test(readFileSync(path, 'utf8')))
    .map((path) => path.slice(ROOT.length))
  assert.deepEqual(users, ['src/lib/appStorage.js'])
  const store = readFileSync(join(ROOT, 'src/store/useStore.js'), 'utf8')
  assert.match(store, /storage: createAppStorage\(\),/)
})

test('前の版の localStorage の記録を引き継ぎ、IndexedDB へ写せたら localStorage から消す。読み戻す前の書き込みは捨てる', async () => {
  const legacy = JSON.stringify(VALUE)
  const local = limitedLocalStorage(1e6, { 'eigo-quest': legacy })
  const idb = fakeIndexedDB()
  const storage = createAppStorage({ localStorage: local, indexedDB: idb })
  // 読み戻す前の書き込み（空の状態）は捨てる。
  storage.setItem('eigo-quest', { state: { srs: {} }, version: 11 })
  await storage.settled()
  assert.equal(idb.data.size, 0, '読み戻す前の空の状態を書いた')
  assert.equal(local.memory.get('eigo-quest'), legacy, '読み戻す前に localStorage の記録を変えた')
  assert.deepEqual(await storage.getItem('eigo-quest'), VALUE)
  assert.equal(idb.data.get('eigo-quest'), legacy, '引き継いだ記録を IndexedDB へ写していない')
  assert.equal(local.memory.has('eigo-quest'), false, '写したあとも localStorage に古い記録が残った')
  // IndexedDB にあれば、そちらを読む（localStorage に古い記録が残っていても）。
  const newer = { state: { srs: { newer: { box: 2 } } }, version: 11 }
  const both = createAppStorage({
    localStorage: limitedLocalStorage(1e6, { 'eigo-quest': legacy }),
    indexedDB: fakeIndexedDB({ initial: { 'eigo-quest': JSON.stringify(newer) } }),
  })
  assert.deepEqual(await both.getItem('eigo-quest'), newer)
  // 写せなかったとき（IndexedDB の容量超過）は localStorage に残し、記録は読み戻す。
  const keep = limitedLocalStorage(1e6, { 'eigo-quest': legacy })
  const failing = createAppStorage({ localStorage: keep, indexedDB: fakeIndexedDB({ put: 'quota' }) })
  assert.deepEqual(await failing.getItem('eigo-quest'), VALUE)
  assert.equal(keep.memory.get('eigo-quest'), legacy)
})

test('記録を保存できなかったときは、失敗の型ごとに画面で知らせ、保存できたら消える', async () => {
  const notice = await vite.ssrLoadModule('/src/components/SaveFailureNotice.jsx')
  const storageModule = await vite.ssrLoadModule('/src/lib/appStorage.js')
  const render = () => renderToStaticMarkup(React.createElement(notice.SaveFailureNotice))
  const write = async (env) => {
    const storage = storageModule.createAppStorage(env, { openTimeoutMs: 30 })
    await storage.getItem('eigo-quest')
    storage.setItem('eigo-quest', VALUE)
    await storage.settled?.()
    await new Promise((resolve) => setTimeout(resolve, 5))
  }
  assert.equal(render(), '', '保存できているあいだは何も出さない')
  const cases = [
    ['quota', { localStorage: limitedLocalStorage(0) }],
    ['unavailable', {}],
    ['open', { indexedDB: fakeIndexedDB({ open: 'throw' }) }],
    ['write', { indexedDB: fakeIndexedDB({ put: 'error' }) }],
  ]
  for (const [reason, env] of cases) {
    await write(env)
    const html = render()
    assert.match(html, new RegExp(`data-save-failure-notice="${reason}"`), reason)
    assert.match(html, /学習の記録を保存できませんでした/)
    assert.ok(html.includes(notice.SAVE_FAILURE_DETAILS[reason]), `${reason} の続け方がない`)
    assert.match(html, /role="alert"/)
  }
  await write({ indexedDB: fakeIndexedDB() })
  assert.equal(render(), '', '保存できたあとも知らせが残った')
  // 外枠（全画面共通）に置いてある。
  const shell = readFileSync(join(ROOT, 'src/components/AppShell.jsx'), 'utf8')
  assert.match(shell, /<SaveFailureNotice \/>/)
})
