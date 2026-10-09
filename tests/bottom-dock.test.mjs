// 画面下部の枠（読み上げ・出題・単語帳）の依頼（requests/2026-09-28-bottom-dock.json）の受け入れ条件。
// 2026-09-28 利用者:
//   ・画面下部にあった再生コントロールをなぜ許可もなく表示されなくしたのか復元しなさい。
//   ・単語を発音しないときに、例文を読み上げさせないようにしなさい。
//   ・出題コントロールも今の仕様をコントロールできるようにして復元しなさい。
//     （回答）すべてのコンテンツで今の出題の仕様を反映してコントロールできるようにしなさい。
//   ・単語帳ボタンを押したら、選択中の単語帳に登録されるように、スロット登録できるように画面下部から単語帳の設定を開くようにしなさい。
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { PHRASES } from '../src/data/phrases.js'
import { buildDictationDeck, dictationByLevel } from '../src/data/dictation.js'
import { buildListeningDeck, listeningByLevel, LISTENING_PROFILES } from '../src/data/listening.js'
import { pickKanbunQuestions, kanbunItems } from '../src/data/kanbun-content.js'
import { KANBUN_KUNDOKU_EXERCISES, pickKanbunKundokuExercises } from '../src/data/kanbun-kundoku.js'
import { KOTEN_GRAMMAR_QUESTIONS, pickKotenGrammarQuestions } from '../src/data/koten-grammar-questions.js'
import { KOTEN_CULTURE_QUESTIONS, pickKotenCultureQuestions } from '../src/data/koten-culture.js'
import { GRAMMAR } from '../src/data/grammar.js'
import { cardHeadSpoken, cardSpeechItems } from '../src/lib/cardSpeech.js'
import {
  createCardSpeechPanel,
  restoreCardSpeechPanel,
  syncCardSpeechItems,
  syncCardSpeechState,
} from '../src/lib/cardSpeechPanel.js'
import { phraseSpeechText } from '../src/lib/phrase-speech.js'
import { exampleSpeechAllowed, heteronymFor, isAmbiguousSpeechText } from '../src/lib/speechGuard.js'
import { dismissSpeechPlayer, getSpeechPlayerSnapshot, playSpeechPlayer } from '../src/lib/speech-player.js'
import { recordContentQuizResult } from '../src/lib/contentProgress.js'
import { buildGrammarDeck } from '../src/lib/grammarDeck.js'
import { buildDeck, buildPhraseDeck, growDeck } from '../src/lib/session.js'
import { STUDY_ORDER_STAGE, orderForStudy, rankQuestionsForStudy, studyOrderKey } from '../src/lib/studyOrder.js'
import {
  mixItemsForStudy,
  mixRankedForStudy,
  questionMixStockOf,
  studyMixStockOf,
} from '../src/lib/studyMix.js'
import { STUDY_DOCK_PANELS, studyDockPanels, studyDockShowing } from '../src/lib/studyDock.js'
import { VOCAB_MIX_STEPS, vocabMixEmptyNotice, vocabMixFreshShare } from '../src/lib/vocabMix.js'
import { APP_MENU_CONTENT_ITEMS } from '../src/lib/appMenu.js'
import { SCOPE_SCREENS, SHARED_SCREENS } from '../src/lib/contentSettings.js'
import {
  NOTEBOOK_LIMITS,
  activeNotebookSetId,
  createLearningNotebook,
  createNotebookSet,
  createStarterLearningNotebook,
  deleteNotebookSet,
  normalizeLearningNotebook,
  selectNotebookSet,
} from '../src/lib/learningNotebook.js'
import { wordBookSlotNotice, wordBookSlotStatus } from '../src/lib/wordBookSlot.js'
import { decodeProgress, encodeProgress } from '../src/lib/progressCode.js'
import { progressStateFromCloud } from '../src/lib/cloudSync.js'
import {
  createInitialLearningState,
  migratePersistedState,
  progressStateFromPayload,
  resetProgressState,
  todayIndex,
  useStore,
} from '../src/store/useStore.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const DAY_MS = 86_400_000
const NOW = new Date(2026, 8, 28, 10, 0, 0, 0).getTime()

// ─── 読み上げ（端末の声の代わりに、読んだ文を queued に積む） ───────────────────────────
function withMockSpeech(run) {
  const previousWindow = globalThis.window
  const PreviousUtterance = globalThis.SpeechSynthesisUtterance
  const queued = []
  class MockUtterance {
    constructor(text) {
      this.text = text
    }
  }
  globalThis.window = {
    speechSynthesis: {
      getVoices: () => [],
      cancel: () => {},
      pause: () => {},
      resume: () => {},
      speak: (utterance) => queued.push(utterance),
    },
    // 部分のあいだの間（ミリ秒）は待たずに続ける。
    setTimeout: (callback) => {
      callback()
      return 0
    },
    clearTimeout: () => {},
  }
  globalThis.SpeechSynthesisUtterance = MockUtterance
  try {
    run(queued)
  } finally {
    dismissSpeechPlayer()
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
    if (PreviousUtterance === undefined) delete globalThis.SpeechSynthesisUtterance
    else globalThis.SpeechSynthesisUtterance = PreviousUtterance
  }
}

// 読んでいる列を最後まで読み進め、読んだ文を返す。
function drain(queued, from) {
  const texts = []
  for (let guard = 0; guard < 20 && queued.length > from + texts.length; guard += 1) {
    const utterance = queued[from + texts.length]
    texts.push(utterance.text)
    utterance.onend?.()
  }
  return texts
}

// 暗記カードの画面が作る読み上げ列（VocabStudy・PhraseStudy と同じ引数）。
const WORD_HIDDEN_LABEL = 'この単語'
const phraseKindLabel = (item) => (item.category === 'expression' ? '表現' : item.kind === 'syntax' ? '構文' : '熟語')
function wordCardItems(word, { range, answerOpen, spellingHidden }) {
  return cardSpeechItems({
    id: word.id,
    head: word.word,
    meanings: word.meanings,
    meaningReadings: true,
    example: word.example,
    exampleSpeech: exampleSpeechAllowed(word),
    range,
    answerOpen,
    spellingHidden,
    hiddenLabel: WORD_HIDDEN_LABEL,
  })
}
function phraseCardItems(item, { range, answerOpen, spellingHidden }) {
  return cardSpeechItems({
    id: item.id,
    head: phraseSpeechText(item),
    headStyle: item.kind === 'syntax' ? 'sentence' : 'phrase',
    meanings: item.meanings,
    example: item.example,
    range,
    answerOpen,
    spellingHidden,
    hiddenLabel: `この${phraseKindLabel(item)}`,
  })
}

// 目のボタンの3段（意味を隠す・スペル／英語を隠す・全部見せる）と、カードの3つの状態を、
// 画面が useCardAutoSpeech へ渡す (spellingHidden, answerOpen) の並びにする。
const EYE_MODES = ['meaning', 'spelling', 'all']
const CARD_STATES = ['before', 'opened', 'reclosed']
function cardSteps(mode, state) {
  const hidden = mode === 'spelling'
  const start = mode === 'all'
    ? { spellingHidden: false, answerOpen: true }
    : { spellingHidden: hidden, answerOpen: false }
  const open = { spellingHidden: false, answerOpen: true }
  const closed = { spellingHidden: hidden, answerOpen: false }
  if (state === 'before') return [start]
  if (state === 'opened') return mode === 'all' ? [start, open] : [start, open]
  return [start, open, closed]
}

test('再生パネルをいつも出す：英単語・熟語・構文の暗記カードは、どの状態でもパネルを閉じない（216通り）', () => {
  const readWord = getWord('abandon')
  const silentWord = getWord('close')
  assert.ok(isAmbiguousSpeechText(silentWord.word), 'close は見出しを読まない語')
  const readPhrase = PHRASES.find((item) => item.id === 'idm_look_at')
  // 熟語・構文には見出しを読まない項目がないので、同じ部品（cardSpeechItems）に1語の見出しを渡して確かめる。
  const silentPhrase = { ...readPhrase, id: 'test_silent_phrase', phrase: 'record', example: { en: 'Please record the song.', ja: 'その歌を録音してください。' } }
  const screens = [
    ['VocabStudy', (card, state) => wordCardItems(card, state), { read: readWord, silent: silentWord }, WORD_HIDDEN_LABEL],
    ['PhraseStudy', (card, state) => phraseCardItems(card, state), { read: readPhrase, silent: silentPhrase }, 'この熟語'],
  ]
  let cases = 0
  withMockSpeech((queued) => {
    for (const [screen, itemsOf, cards, hiddenLabel] of screens) {
      for (const autoSpeak of [true, false]) {
        for (const mode of EYE_MODES) {
          for (const cardState of CARD_STATES) {
            for (const range of ['word', 'meaning', 'example']) {
              for (const head of ['read', 'silent']) {
                const card = cards[head]
                const label = `${screen} 自動で発音${autoSpeak ? 'オン' : 'オフ'} 目:${mode} ${cardState} 範囲:${range} 見出し:${head}`
                dismissSpeechPlayer()
                const panel = createCardSpeechPanel()
                const speechKey = `0:${card.id}`
                for (const step of cardSteps(mode, cardState)) {
                  const items = itemsOf(card, { range, ...step })
                  const options = { key: speechKey, rangeAdjustable: true, title: 'カード', placeholder: items[0]?.label ?? '' }
                  const before = queued.length
                  syncCardSpeechState(panel, { speechKey, items, ...step, range, autoSpeak, options })
                  syncCardSpeechItems(panel, { speechKey, items, range, placeholder: options.placeholder })
                  const player = getSpeechPlayerSnapshot()
                  // どの状態でも、パネルは出したまま。
                  assert.equal(player.visible, true, `${label}: パネルが閉じた`)
                  assert.equal(player.rangeAdjustable, true, `${label}: 範囲が出ない`)
                  const spoken = drain(queued, before)
                  if (step.spellingHidden) {
                    // スペル（英語）を隠しているあいだは読まず、パネルにつづり・英文を出さない。
                    assert.deepEqual(spoken, [], `${label}: 隠しているのに読んだ`)
                    assert.equal(player.itemLabel, hiddenLabel, `${label}: パネルにつづりが出た`)
                  }
                  // 自動で発音がオフなら、どの状態でも読まない（パネルに入れて止めておく）。
                  if (!autoSpeak) assert.deepEqual(spoken, [], `${label}: 自動で発音がオフなのに読んだ`)
                  // 単語を発音しないときは例文も読まない。
                  if (!cardHeadSpoken({ head: items[0]?.segments?.[0]?.text, spellingHidden: step.spellingHidden })) {
                    for (const text of spoken) assert.ok(!text.includes(card.example.en), `${label}: 例文を読んだ`)
                  }
                }
                // 「再生」は、いまのカードの列を読む（読める部分がない列では押せない）。
                const player = getSpeechPlayerSnapshot()
                const last = itemsOf(card, { range, ...cardSteps(mode, cardState).at(-1) })
                const readable = last.some((item) => item.segments.some((segment) => !segment.silent && !isAmbiguousSpeechText(segment.text, segment.lang)))
                assert.equal(player.canPlay, readable, `${label}: 再生の押せる／押せないがちがう`)
                // カードを移ったら、そのカードの列に入れ替える（前のカードの列を残さない）。
                const next = head === 'read' ? cards.silent : cards.read
                const nextItems = itemsOf(next, { range, spellingHidden: false, answerOpen: false })
                syncCardSpeechState(panel, {
                  speechKey: `1:${next.id}`,
                  items: nextItems,
                  spellingHidden: false,
                  answerOpen: false,
                  range,
                  autoSpeak,
                  options: { key: `1:${next.id}`, rangeAdjustable: true, title: 'カード', placeholder: nextItems[0].label },
                })
                assert.equal(getSpeechPlayerSnapshot().visible, true, `${label}: 次のカードでパネルが閉じた`)
                assert.equal(getSpeechPlayerSnapshot().itemLabel, nextItems[0].label, `${label}: 前のカードの列が残った`)
                drain(queued, queued.length - 1)
                cases += 1
              }
            }
          }
        }
      }
    }

    // 設定の窓を閉じたときなど、カードを出したままパネルが閉じられても、カードの列で出し直す。
    const items = wordCardItems(readWord, { range: 'word', answerOpen: false, spellingHidden: false })
    dismissSpeechPlayer()
    assert.equal(getSpeechPlayerSnapshot().visible, false)
    assert.equal(restoreCardSpeechPanel({ speechKey: '0:abandon', items, options: { key: '0:abandon', rangeAdjustable: true } }), true)
    assert.equal(getSpeechPlayerSnapshot().visible, true)
    assert.equal(getSpeechPlayerSnapshot().itemLabel, 'abandon')
    const before = queued.length
    assert.equal(playSpeechPlayer(), true)
    assert.deepEqual(drain(queued, before), ['abandon'])
  })
  assert.equal(cases, 216)

  // 画面は閉じる操作を持たず、この部品（lib/cardSpeechPanel.js）でパネルを扱う。
  const hook = read('src/components/useCardAutoSpeech.js')
  assert.match(hook, /syncCardSpeechState\(panel\.current, \{/)
  assert.match(hook, /syncCardSpeechItems\(panel\.current, \{ speechKey, items, range, placeholder \}\)/)
  assert.match(hook, /if \(!visible\) restoreCardSpeechPanel\(\{ speechKey, items, options \}\)/)
  for (const path of ['src/components/useCardAutoSpeech.js', 'src/lib/cardSpeechPanel.js', 'src/screens/VocabStudy.jsx', 'src/screens/PhraseStudy.jsx']) {
    assert.doesNotMatch(read(path), /dismissSpeechPlayer/, path)
  }
})

test('例文を読み上げない：単語を発音しないカードと辞書ページは、例文と例文の意味を読まない', () => {
  let silentHeads = 0
  let checked = 0
  const exampleLabels = new Set(['例文', '例文の意味'])
  const check = (label, items, headSpoken, expectExample) => {
    const labels = items.flatMap((item) => item.segments.map((segment) => segment.label))
    if (!headSpoken) {
      assert.equal(items.length, 1, `${label}: 例文の読み上げ列が残っている`)
      assert.ok(!labels.some((name) => exampleLabels.has(name)), `${label}: 例文を読む`)
    } else if (expectExample) {
      assert.equal(items.length, 2, `${label}: 例文の読み上げ列がない`)
    }
    checked += 1
  }
  for (const word of ALL_WORDS) {
    if (isAmbiguousSpeechText(word.word)) silentHeads += 1
    for (const range of ['word', 'meaning', 'example']) {
      for (const answerOpen of [false, true]) {
        for (const spellingHidden of [false, true]) {
          const items = wordCardItems(word, { range, answerOpen, spellingHidden })
          const headSpoken = cardHeadSpoken({ head: word.word, spellingHidden })
          check(`${word.id} ${range} ${answerOpen} ${spellingHidden}`, items, headSpoken, Boolean(word.example?.en))
        }
      }
    }
    // 辞書ページとカードの例文の読み上げボタンも、単語を発音しない語では出さない。
    assert.equal(exampleSpeechAllowed(word), !isAmbiguousSpeechText(word.word), word.id)
  }
  for (const item of PHRASES) {
    for (const range of ['word', 'meaning', 'example']) {
      for (const answerOpen of [false, true]) {
        for (const spellingHidden of [false, true]) {
          const items = phraseCardItems(item, { range, answerOpen, spellingHidden })
          const headSpoken = cardHeadSpoken({ head: phraseSpeechText(item), spellingHidden })
          check(`${item.id} ${range} ${answerOpen} ${spellingHidden}`, items, headSpoken, true)
        }
      }
    }
  }
  assert.equal(ALL_WORDS.length, 8929)
  assert.equal(PHRASES.length, 2259)
  assert.equal(silentHeads, 103)
  assert.equal(checked, (8929 + 2259) * 12)
  // 使い方で発音が変わる語は、台帳の全語で例文も読まない。
  for (const word of ALL_WORDS.filter((item) => heteronymFor(item))) assert.equal(exampleSpeechAllowed(word), false, word.id)

  // 画面：例文の読み上げボタンは exampleSpeechAllowed を通したときだけ出す。
  for (const path of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(path), /\{exampleSpeechAllowed\(word\) && /, path)
  }
  assert.match(read('src/lib/speechGuard.js'), /export const exampleSpeechAllowed = \(word\) => !heteronymFor\(word\)/)
  assert.match(read('src/components/PronunciationNote.jsx'), /この語と例文の音声はありません/)
})

test('スペルを隠しているあいだの再生パネルは、つづり・英文を出さず、見えている意味だけを読む', () => {
  for (const word of ALL_WORDS) {
    for (const range of ['word', 'meaning', 'example']) {
      const items = wordCardItems(word, { range, answerOpen: false, spellingHidden: true })
      assert.equal(items.length, 1, word.id)
      assert.equal(items[0].label, WORD_HIDDEN_LABEL, word.id)
      const readable = items[0].segments.filter((segment) => !segment.silent)
      assert.ok(readable.every((segment) => segment.lang === 'ja-JP'), `${word.id}: 英語を読む`)
      assert.equal(readable.some((segment) => segment.label === '意味'), range !== 'word', `${word.id} ${range}`)
    }
  }
  for (const item of PHRASES) {
    for (const range of ['word', 'meaning', 'example']) {
      const items = phraseCardItems(item, { range, answerOpen: false, spellingHidden: true })
      assert.equal(items.length, 1, item.id)
      assert.equal(items[0].label, `この${phraseKindLabel(item)}`, item.id)
      const readable = items[0].segments.filter((segment) => !segment.silent)
      assert.ok(readable.every((segment) => segment.lang === 'ja-JP'), `${item.id}: 英語を読む`)
      assert.equal(readable.some((segment) => segment.label === '意味'), range !== 'word', `${item.id} ${range}`)
    }
  }
  // パネル：自動では読まず、「再生」で見えている意味だけを読む。
  withMockSpeech((queued) => {
    const word = getWord('abandon')
    const items = wordCardItems(word, { range: 'meaning', answerOpen: false, spellingHidden: true })
    const panel = createCardSpeechPanel()
    const options = { key: '0:abandon', rangeAdjustable: true, placeholder: items[0].label }
    const before = queued.length
    syncCardSpeechState(panel, { speechKey: '0:abandon', items, spellingHidden: true, answerOpen: false, range: 'meaning', autoSpeak: true, options })
    assert.equal(queued.length, before)
    assert.equal(getSpeechPlayerSnapshot().itemLabel, WORD_HIDDEN_LABEL)
    assert.equal(playSpeechPlayer(), true)
    const spoken = drain(queued, before)
    assert.equal(spoken.length, 1)
    assert.ok(!spoken[0].includes('abandon'))
  })
  assert.match(read('src/screens/VocabStudy.jsx'), /hiddenLabel: 'この単語',/)
  assert.match(read('src/screens/PhraseStudy.jsx'), /hiddenLabel: `この\$\{itemKind\(item\)\.label\}`,/)
})

// ─── 出題（出題バランス） ──────────────────────────────────────────────────────────
// 暗記・テストの全30画面（SessionCounter を持つ画面）を、App.jsx の画面IDに引き当てる。
function studyScreens() {
  const app = read('src/App.jsx')
  const componentFile = new Map(
    [...app.matchAll(/const (\w+) = lazyScreen\(\s*\(\) => import\('\.\/screens\/(\w+)\.jsx'\)/g)]
      .map((match) => [match[1], match[2]]),
  )
  // 社会・理科のように、1つのファイルが教科ごとの2つの画面を持つこともある。
  const screensOf = new Map()
  for (const match of app.slice(app.indexOf('const SCREENS = {')).matchAll(/^ {2}(\w+): (\w+),$/gm)) {
    const file = componentFile.get(match[2])
    if (file) screensOf.set(file, [...(screensOf.get(file) ?? []), match[1]])
  }
  return readdirSync(new URL('../src/screens/', import.meta.url))
    .filter((file) => file.endsWith('.jsx') && /<SessionCounter\b/.test(read(`src/screens/${file}`)))
    .flatMap((file) => (screensOf.get(file.replace(/\.jsx$/, '')) ?? [undefined]).map((screen) => ({ file, screen })))
}

let vite
let modules

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  modules = {
    console: await vite.ssrLoadModule('/src/components/SpeechConsole.jsx'),
    slot: await vite.ssrLoadModule('/src/components/WordBookSlot.jsx'),
    lists: await vite.ssrLoadModule('/src/components/WordListSheet.jsx'),
    mix: await vite.ssrLoadModule('/src/components/VocabMixConsole.jsx'),
    dock: await vite.ssrLoadModule('/src/lib/studyDock.js'),
    store: await vite.ssrLoadModule('/src/store/useStore.js'),
  }
})

after(async () => {
  await vite?.close()
})

// サーバー描画では、zustand はストアの今の値ではなく初期値（getInitialState）を読む。初期値を一時的に差し替えて描く。
function withInitialState(patch, run) {
  const initial = modules.store.useStore.getInitialState()
  const saved = Object.fromEntries(Object.keys(patch).map((key) => [key, initial[key]]))
  Object.assign(initial, patch)
  try {
    return run()
  } finally {
    Object.assign(initial, saved)
  }
}
const renderDock = (patch) => withInitialState(patch, () => renderToStaticMarkup(React.createElement(modules.console.GlobalSpeechConsole)))

test('出題を全30画面に出す：暗記・テストのどの画面にも下部の「出題」があり、英単語はすべての出題元で出す', () => {
  const screens = studyScreens()
  assert.equal(screens.length, 30)
  assert.deepEqual([...modules.mix.STUDY_MIX_SCREENS].sort(), screens.map(({ screen }) => screen).sort())
  for (const { file, screen } of screens) {
    const source = read(`src/screens/${file}`)
    // 問題を組むたびに、いまの教材の出題バランスを読む。
    assert.match(source, /currentStudyMixShare\(\)|vocabMixFreshShare\(currentContentSettings\(\)\.vocabMix\)/, file)
    assert.ok(modules.mix.studyMixContext(screen, {}), screen)
    // 下部の枠を描くと「出題」がある。
    const html = renderDock({ screen, params: {} })
    assert.match(html, /data-vocab-mix-console/, screen)
  }
  // 暗記・テスト以外の画面には出さない。
  for (const screen of ['portal', 'home', 'vocabLevels', 'wordDetail', 'reader']) {
    assert.equal(modules.mix.studyMixContext(screen, {}), null, screen)
    assert.doesNotMatch(renderDock({ screen, params: {} }), /data-vocab-mix-console/, screen)
  }
  // 英単語は、級・分野・品詞・全語に加えて、単語帳・今日の復習・先取り復習・語根・自作単語・一覧から始めた回でも出す。
  for (const type of ['all', 'field', 'pos', 'level', 'levelField', 'mylist', 'deck', 'root', 'due', 'review', 'custom', 'battle', 'dragonVein']) {
    for (const screen of ['vocabStudy', 'vocabQuiz']) {
      const context = modules.mix.studyMixContext(screen, { source: { type } })
      assert.ok(context, `${screen} ${type}`)
      assert.equal(context.fixedOrder, false, `${screen} ${type}`)
    }
  }
  // 選んだ順に出す回（一覧で並べた項目、辞書から選んだ1件など）は、動かせないことを示す。
  const fixed = modules.mix.studyMixContext('phraseStudy', { source: { type: 'phraseList', ids: ['idm_look_at'], preserveOrder: true } })
  assert.equal(fixed.fixedOrder, true)
  assert.equal(modules.mix.studyMixContext('kotenStudy', { ids: ['a'], preserveOrder: true }).fixedOrder, true)
  const fixedHtml = renderDock({ screen: 'phraseStudy', params: { source: { type: 'phraseList', ids: ['idm_look_at'], preserveOrder: true } } })
  assert.match(fixedHtml, /選んだ順に出す回/)
  assert.match(fixedHtml, /type="range"[^>]*disabled=""/)
  assert.match(read('src/screens/VocabSearch.jsx'), /source: \{ type: 'phraseList', ids: \[phrase\.id\], preserveOrder: true \},/)
})

// 学習記録の素材。results は at の直前に1分おきで答えた結果（最後が最新）。
function recorded(results, { at = NOW } = {}) {
  const original = useStore.getState()
  const realNow = Date.now
  try {
    useStore.setState({ srs: {} })
    results.forEach((result, index) => {
      Date.now = () => at - (results.length - index) * 60_000
      useStore.getState().review('fixture', result, null)
    })
    return useStore.getState().srs.fixture
  } finally {
    Date.now = realNow
    useStore.setState(original, true)
  }
}

// 在庫の分かれる記録：未修（記録なし）・まだ／不正解（前の日に1回まちがえた）・覚えた（続けて覚えた）・苦手（くり返しまちがえている）。
const ENTRIES = {
  missed: () => recorded(['forgot'], { at: NOW - DAY_MS }),
  known: () => recorded(['remembered', 'remembered'], { at: NOW - 3 * DAY_MS }),
  struggling: () => recorded(['forgot', 'forgot', 'forgot'], { at: NOW - DAY_MS }),
}
function stockedRecords(items, { idOf = (item) => item.id } = {}) {
  const kinds = ['fresh', 'missed', 'known', 'struggling']
  const srs = {}
  const kindOf = new Map()
  items.forEach((item, index) => {
    const kind = kinds[index % kinds.length]
    kindOf.set(idOf(item), kind)
    if (kind !== 'fresh') srs[idOf(item)] = ENTRIES[kind]()
  })
  return { srs, kindOf }
}

test('今の出題順の上で：出題バランスの6段が、全30画面の出題口で今の出題順に効く', () => {
  const realNow = Date.now
  Date.now = () => NOW
  try {
    // 共通の組み方（lib/studyMix.js）。英単語と同じ在庫の分け方と枠の組み方。
    const items = Array.from({ length: 40 }, (_, index) => ({ id: `item-${index}` }))
    const { srs, kindOf } = stockedRecords(items)
    for (const [id, kind] of kindOf) {
      const expected = kind === 'fresh' ? 'fresh' : kind === 'known' ? 'known' : 'missed'
      assert.equal(studyMixStockOf(srs[id]), expected, `${id} ${kind}`)
    }
    const ordered = orderForStudy(items, srs, { purpose: 'study', rng: null, now: NOW })
    // 自動は今の出題順のまま。
    assert.deepEqual(mixItemsForStudy(ordered, srs, { freshShare: null, now: NOW }), ordered)
    const kinds = (list) => list.map((item) => kindOf.get(item.id))
    for (const step of VOCAB_MIX_STEPS.filter((item) => item.freshShare !== null)) {
      const mixed = mixItemsForStudy(ordered, srs, { freshShare: step.freshShare, size: 10, now: NOW }).slice(0, 10)
      const k = kinds(mixed)
      // 苦手は先頭にまとめる（未修だけ は まだ・不正解 を出さないので苦手も出さない）。
      const struggling = k.filter((kind) => kind === 'struggling').length
      if (step.freshShare < 1) assert.deepEqual(k.slice(0, struggling), Array(struggling).fill('struggling'), step.id)
      if (step.freshShare === 1) assert.ok(!k.includes('missed') && !k.includes('struggling'), `${step.id}: ${k}`)
      if (step.freshShare === 0) assert.ok(!k.includes('fresh'), `${step.id}: ${k}`)
      if (step.freshShare > 0 && step.freshShare < 1) {
        assert.equal(k.filter((kind) => kind === 'fresh').length, Math.round(10 * step.freshShare), `${step.id}: ${k}`)
      }
    }

    // 英単語：すべての出題元（級・分野などに加えて単語帳・今日の復習・先取り復習・語根・自作単語・一覧）で効く。
    const words = ALL_WORDS.filter((word) => word.level === '4').slice(0, 60)
    const wordRecords = stockedRecords(words)
    const sources = [
      { type: 'level', levelId: '4' },
      { type: 'mylist', ids: words.map((word) => word.id) },
      { type: 'deck', ids: words.map((word) => word.id) },
      { type: 'custom', words },
    ]
    for (const source of sources) {
      for (const purpose of ['study', 'quiz']) {
        const build = (share) => buildDeck(source, {
          srs: wordRecords.srs,
          size: 10,
          purpose,
          freshShareOverride: share,
          now: NOW,
          day: todayIndex(NOW),
        })
        const onlyFresh = build(1).map((word) => wordRecords.kindOf.get(word.id))
        assert.ok(onlyFresh.length > 0 && !onlyFresh.includes('missed') && !onlyFresh.includes('struggling'), `${source.type} ${purpose} 未修だけ: ${onlyFresh}`)
        const onlyReview = build(0).map((word) => wordRecords.kindOf.get(word.id))
        assert.ok(onlyReview.length > 0 && !onlyReview.includes(undefined) && !onlyReview.includes('fresh'), `${source.type} ${purpose} 復習だけ: ${onlyReview}`)
        assert.equal(onlyReview[0], 'struggling', `${source.type} ${purpose}: 苦手が先頭でない`)
      }
    }
    // 並びを選んで始めた回（preserveOrder）は、選んだ順のまま。
    const chosen = { type: 'deck', ids: words.slice(0, 5).map((word) => word.id), preserveOrder: true }
    assert.deepEqual(
      buildDeck(chosen, { srs: wordRecords.srs, size: 5, freshShareOverride: 1, now: NOW }).map((word) => word.id),
      chosen.ids,
    )

    // 熟語・構文。
    const phrases = PHRASES.filter((item) => item.level === '4').slice(0, 40)
    const phraseRecords = stockedRecords(phrases)
    const phraseSource = { type: 'phraseList', ids: phrases.map((item) => item.id) }
    const phraseKinds = (share) => buildPhraseDeck(phraseSource, { srs: phraseRecords.srs, size: 10, purpose: 'study', freshShare: share, now: NOW })
      .map((item) => phraseRecords.kindOf.get(item.id))
    assert.ok(!phraseKinds(1).includes('missed'))
    assert.ok(!phraseKinds(0).includes('fresh'))
    assert.equal(phraseKinds(0)[0], 'struggling')

    // 英文法（形式の巡回・単元の散らしは、混ぜた順の中で行う）。
    const grammarItems = GRAMMAR.filter((item) => item.level === '4').slice(0, 40)
    const grammarRecords = stockedRecords(grammarItems)
    const grammarSource = { type: 'grammarList', ids: grammarItems.map((item) => item.id) }
    const grammarKinds = (share) => buildGrammarDeck(grammarSource, { srs: grammarRecords.srs, size: 10, now: NOW, day: todayIndex(NOW), freshShare: share })
      .map((item) => grammarRecords.kindOf.get(item.id))
    assert.ok(!grammarKinds(1).includes('missed') && !grammarKinds(1).includes('struggling'))
    assert.ok(!grammarKinds(0).includes('fresh'))

    // リスニング（級の形式の配分は保つ）。
    const listeningItems = listeningByLevel('3')
    const listeningRecords = stockedRecords(listeningItems)
    for (const share of [0, 0.5, 1, null]) {
      const deck = buildListeningDeck({ type: 'level', levelId: '3' }, { size: 10, srs: listeningRecords.srs, now: NOW, freshShare: share })
      const byType = (list) => Object.fromEntries(Object.keys(LISTENING_PROFILES['3'].typeTargets).map((type) => [type, list.filter((item) => item.type === type).length]))
      const automatic = buildListeningDeck({ type: 'level', levelId: '3' }, { size: 10, srs: listeningRecords.srs, now: NOW })
      assert.equal(deck.length, 10, `リスニング ${share}`)
      if (share === null) assert.deepEqual(byType(deck), byType(automatic))
      const k = deck.map((item) => listeningRecords.kindOf.get(item.id))
      if (share === 1) assert.ok(!k.includes('missed') && !k.includes('struggling'), `${k}`)
      if (share === 0) assert.ok(!k.includes('fresh'), `${k}`)
      // 形式ごとの数は、どの割合でも自動のときと同じ（配分を守る）。
      assert.deepEqual(byType(deck), byType(automatic), `リスニング ${share}`)
    }

    // ディクテーション・漢文・返り点・古典（項目ごとの記録で並べる出題口）。
    const dictationItems = dictationByLevel('3')
    const dictationRecords = stockedRecords(dictationItems)
    const dictationKinds = (share) => buildDictationDeck({ type: 'level', levelId: '3' }, { size: 8, srs: dictationRecords.srs, now: NOW, freshShare: share })
      .map((item) => dictationRecords.kindOf.get(item.id))
    assert.ok(!dictationKinds(1).includes('missed'))
    assert.ok(!dictationKinds(0).includes('fresh'))
    const kanbun = kanbunItems('vocab', null).slice(0, 40)
    const kanbunRecords = stockedRecords(kanbun)
    const kanbunKinds = (share) => pickKanbunQuestions('vocab', kanbun.map((item) => item.id), { size: 10, srs: kanbunRecords.srs, now: NOW, freshShare: share })
      .map((question) => kanbunRecords.kindOf.get(question.itemId))
    assert.ok(!kanbunKinds(1).includes('missed'))
    assert.ok(!kanbunKinds(0).includes('fresh'))
    const kundoku = KANBUN_KUNDOKU_EXERCISES.slice(0, 40)
    const kundokuRecords = stockedRecords(kundoku)
    const kundokuKinds = (share) => pickKanbunKundokuExercises(kundoku.map((item) => item.id), { size: 10, srs: kundokuRecords.srs, now: NOW, freshShare: share })
      .map((item) => kundokuRecords.kindOf.get(item.id))
    assert.ok(!kundokuKinds(1).includes('missed'))
    assert.ok(!kundokuKinds(0).includes('fresh'))

    // 1項目に複数の問題がある教材（古典文法・古典常識・数学の歴史）は、問題ごとの結果で在庫を分け、文脈8・基礎4の配分を守る。
    for (const [domain, questions, pick, itemIdsOf] of [
      ['koten-grammar', KOTEN_GRAMMAR_QUESTIONS, pickKotenGrammarQuestions, (question) => question.grammarIds],
      ['koten-culture', KOTEN_CULTURE_QUESTIONS, pickKotenCultureQuestions, (question) => question.cultureIds],
    ]) {
      // どの在庫にも文脈型と基礎型が入るよう、両方から同じ数ずつ取る。
      const pool = [
        ...questions.filter((question) => question.style === 'context').slice(0, 45),
        ...questions.filter((question) => question.style === 'foundation').slice(0, 45),
      ]
      let quizResults = {}
      const kindOf = new Map()
      pool.forEach((question, index) => {
        const kind = ['fresh', 'missed', 'known'][index % 3]
        kindOf.set(question.id, kind)
        if (kind === 'fresh') return
        quizResults = recordContentQuizResult(quizResults, {
          domain,
          itemId: question.id,
          correct: kind === 'known' ? 1 : 0,
          total: 1,
          timestamp: NOW - DAY_MS,
        })
      })
      const ids = [...new Set(pool.flatMap(itemIdsOf))]
      for (const share of [0, 1]) {
        const deck = pick(ids, { size: 12, quizResults, now: NOW, freshShare: share })
        const k = deck.filter((question) => kindOf.has(question.id)).map((question) => kindOf.get(question.id))
        if (share === 1) assert.ok(!k.includes('missed'), `${domain} 未修だけ: ${k}`)
        if (share === 0) assert.ok(!k.includes('fresh'), `${domain} 復習だけ: ${k}`)
        // 文脈型8・基礎型4の配分は、どの割合でも保つ。
        assert.equal(deck.length, 12, `${domain} ${share}`)
        assert.equal(deck.filter((question) => question.style === 'context').length, 8, `${domain} ${share}: 文脈・基礎の配分`)
      }
    }
    // 数学の歴史など、問題の段から在庫を読む。
    assert.equal(questionMixStockOf({ stage: STUDY_ORDER_STAGE.fresh }), 'fresh')
    assert.equal(questionMixStockOf({ stage: STUDY_ORDER_STAGE.rest }), 'known')
    assert.equal(questionMixStockOf({ stage: STUDY_ORDER_STAGE.missedToday }), 'missed')
    const ranked = rankQuestionsForStudy(items.map((item) => ({ ...item })), { quizResults: {}, quizDomain: 'x' })
    assert.deepEqual(mixRankedForStudy(ranked, { freshShare: null, stockOf: questionMixStockOf }), ranked)

    // 画面の出題口がどれも出題バランスを渡している。
    const wiring = {
      'EtymologyStudy.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(cards, useStore\.getState\(\)\.etymologySrs, \{ purpose: 'study' \}\),/,
      'EtymologyQuiz.jsx': /mixItemsForStudy\(orderForStudy\(/,
      'KotenStudy.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(words, useStore\.getState\(\)\.kotenSrs, \{ purpose: 'study' \}\),/,
      'KotenQuiz.jsx': /mixItemsForStudy\(orderForStudy\(/,
      'KotenGrammarStudy.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(selected, useStore\.getState\(\)\.kotenGrammarSrs/,
      'KotenCultureStudy.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(selected, useStore\.getState\(\)\.kotenCultureSrs/,
      'KotenInterpretationQuiz.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(selected, useStore\.getState\(\)\.kotenInterpretationSrs/,
      'KanbunStudy.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(selected, useStore\.getState\(\)\[meta\.srsField\]/,
      'WritingGrammarReview.jsx': /mixItemsForStudy\(\n\s*orderForStudy\(due\.length \? due : items, state\.srs/,
      'MathStoryQuiz.jsx': /pickInStudyOrder\(mixRankedForStudy\(ranked, \{ freshShare: currentStudyMixShare\(\), stockOf: questionMixStockOf \}\), size\)/,
      'MathExamSolve.jsx': /pickInStudyOrder\(mixRankedForStudy\(ranked, \{ freshShare: currentStudyMixShare\(\), stockOf: questionMixStockOf \}\), size\)/,
      'KotenGrammarQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'KotenCultureQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'KanbunQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'KanbunKundokuQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'PhraseStudy.jsx': /freshShare: currentStudyMixShare\(\),/,
      'PhraseQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'GrammarQuiz.jsx': /freshShare: currentStudyMixShare\(\) \}/,
      'ListeningQuiz.jsx': /freshShare: currentStudyMixShare\(\) \}/,
      'DictationPlay.jsx': /freshShare: currentStudyMixShare\(\) \}/,
      'VocabStudy.jsx': /freshShareOverride: vocabMixFreshShare\(currentContentSettings\(\)\.vocabMix\),/,
      'VocabQuiz.jsx': /freshShareOverride: vocabMixFreshShare\(currentContentSettings\(\)\.vocabMix\),/,
      // 社会・理科は1ファイルで教科ごとの2画面（27ファイルで30画面）。
      'SubjectStudy.jsx': /pickSubjectTerms\(ids, \{ srs, size, freshShare: currentStudyMixShare\(\), preserveOrder \}\)/,
      'SubjectQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
      'SubjectPractice.jsx': /freshShare: currentStudyMixShare\(\),/,
      // 自作カード（英単語以外のテンプレート）の暗記とテスト。
      'CustomCardStudy.jsx': /pickCustomCards\(ids, \{ srs, size, freshShare: currentStudyMixShare\(\), preserveOrder \}\)/,
      'CustomCardQuiz.jsx': /freshShare: currentStudyMixShare\(\),/,
    }
    assert.equal(Object.keys(wiring).length, 27)
    for (const [file, pattern] of Object.entries(wiring)) assert.match(read(`src/screens/${file}`), pattern, file)
    // 下部の説明も今の出題順で書く。
    assert.match(read('src/lib/vocabMix.js'), /adaptive \? 'たまり具合で自動' : '苦手→復習→未修の順'/)
    assert.match(read('src/components/VocabMixConsole.jsx'), /何度もまちがえている項目は先頭に出します/)
    // 出せる項目がないときの案内は、教材の呼び方で出す。
    assert.equal(vocabMixEmptyNotice('fresh-only', { unit: '項目' }).title, '未修の項目は残っていません')
    assert.equal(vocabMixFreshShare('auto'), null)
  } finally {
    Date.now = realNow
  }
})

test('先の問題を組み直す：バーを動かすと、全30画面で表示中と答えた分を残して先を新しい割合で組み直す', () => {
  for (const { file } of studyScreens()) {
    const source = read(`src/screens/${file}`)
    assert.match(source, /useStudyMixRebuild\(\{\n\s*index(?:: \w+)?,\n\s*answeredIndexes(?::|,)/, file)
    assert.match(source, /rebuild: \(keepCount\) => \{/, file)
    assert.match(source, /growDeck\(current, current\.length \? keepCount : 0, /, file)
    // フックは、出す問題がないときの早い return より前に置く。
    const hookAt = source.indexOf('useStudyMixRebuild({')
    const emptyAt = source.search(/\n {2}if \(!(?:deck\.length|question|exercise)\b/)
    assert.ok(emptyAt > 0, `${file}: 出す問題がないときの分かれ目がない`)
    assert.ok(hookAt > 0 && hookAt < emptyAt, `${file}: フックが早い return より後ろ`)
  }
  const hook = read('src/components/StudyMix.jsx')
  assert.match(hook, /if \(applied\.current === vocabMix\) return/)
  assert.match(hook, /if \(fixedOrder\) return/)
  assert.match(hook, /rebuild\(Math\.max\(index \+ 1, \.\.\.answeredIndexes\.map\(\(answered\) => answered \+ 1\)\)\)/)
  // 組み直しは表示中と答えた問題を残し、その先だけを新しい順に替える。
  const current = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }))
  const next = ['x', 'a', 'y', 'z', 'w'].map((id) => ({ id }))
  assert.deepEqual(growDeck(current, 2, next, 5).map((item) => item.id), ['a', 'b', 'x', 'y', 'z'])
})

test('出題バランスを教材の設定に並べる：30画面を開く教材の設定にどれも出題バランスがある', () => {
  const settingsOf = (screen) => APP_MENU_CONTENT_ITEMS.find((item) => item.screen === screen)?.settings ?? []
  const screens = studyScreens().map(({ screen }) => screen)
  const owners = new Set()
  for (const screen of screens) {
    const owner = Object.entries(SCOPE_SCREENS).find(([, list]) => list.includes(screen))?.[0]
    const shared = SHARED_SCREENS[screen]
    const scopes = [owner, shared?.primary, ...(shared?.scopes ?? [])].filter(Boolean)
    assert.ok(scopes.length, `${screen} の設定の持ち主がない`)
    for (const scope of scopes) {
      // 辞書から開く熟語・構文の暗記は選んだ1件だけ（選んだ順の回）なので、出題バランスを使わない。
      if (scope === 'vocabSearch') continue
      owners.add(scope)
      assert.ok(settingsOf(scope).includes('vocabMix'), `${scope}（${screen}）の設定に出題バランスがない`)
    }
  }
  assert.deepEqual([...owners].sort(), [
    'dictation', 'grammar', 'kanbunHome', 'kotenList', 'listening', 'literatureLibrary', 'mathMap',
    'phrases', 'readingList', 'roots', 'scienceHome', 'socialHome', 'vocabLevels', 'writing',
  ])
  assert.ok(settingsOf('home').includes('vocabMix'))
  // 設定の行の名前は全教材で同じ「出題バランス」。
  assert.match(read('src/components/SpeechSettings.jsx'), /title="出題バランス"/)
})

// ─── 単語帳（登録先） ────────────────────────────────────────────────────────────
function notebookWithBooks(titles) {
  let notebook = createLearningNotebook()
  const ids = []
  titles.forEach((title, index) => {
    const result = createNotebookSet(notebook, title, { timestamp: index + 1, randomPart: `b${index}` })
    notebook = result.notebook
    ids.push(result.setId)
  })
  return { notebook, ids }
}

// 単語帳ボタンを持つ全38ファイル（カード・一覧・まとめて入れるボタン）。自作カードの一覧のカードは CustomCardItems.jsx。
const WORD_BOOK_FILES = [
  'components/CustomCardItems.jsx', 'components/ExtendedReader.jsx', 'components/GrammarReferenceParts.jsx', 'components/ReadingSentenceDetail.jsx',
  'components/SceneBundles.jsx', 'screens/CustomCardQuiz.jsx', 'screens/CustomCardStudy.jsx', 'screens/DictationPlay.jsx', 'screens/EtymologyQuiz.jsx',
  'screens/EtymologyStudy.jsx', 'screens/GrammarQuiz.jsx', 'screens/KanbunCatalog.jsx', 'screens/KanbunKundokuQuiz.jsx',
  'screens/KanbunQuiz.jsx', 'screens/KanbunStudy.jsx', 'screens/KotenCulture.jsx', 'screens/KotenCultureQuiz.jsx',
  'screens/KotenCultureStudy.jsx', 'screens/KotenGrammar.jsx', 'screens/KotenGrammarQuiz.jsx', 'screens/KotenGrammarStudy.jsx',
  'screens/KotenInterpretationPrep.jsx', 'screens/KotenInterpretationQuiz.jsx', 'screens/KotenQuiz.jsx', 'screens/KotenStudy.jsx',
  'screens/KotenWordDetail.jsx', 'screens/ListeningQuiz.jsx', 'screens/LiteratureReader.jsx', 'screens/PhraseQuiz.jsx',
  'screens/PhraseStudy.jsx', 'screens/ReadingPrep.jsx', 'screens/ReadingSummary.jsx', 'screens/VocabCamera.jsx',
  'screens/VocabQuiz.jsx', 'screens/VocabSearch.jsx', 'screens/VocabStudy.jsx', 'screens/WordDetail.jsx', 'screens/WritingPlay.jsx',
]

test('下部の単語帳：登録先を切り替え、単語帳の設定を開き、登録先は保存して消した冊なら先頭の冊にする', () => {
  // 登録先は learningNotebook.activeSetId。選んでいないときは並びの先頭の冊。
  const { notebook, ids } = notebookWithBooks(['テスト範囲', '苦手'])
  assert.equal(activeNotebookSetId(notebook), ids[0])
  const chosen = selectNotebookSet(notebook, ids[1])
  assert.equal(activeNotebookSetId(chosen), ids[1])
  assert.equal(normalizeLearningNotebook(chosen).activeSetId, ids[1])
  // 無い冊は選ばない。消えた冊を指す保存は持たない。
  assert.equal(selectNotebookSet(notebook, 'missing').activeSetId, undefined)
  assert.equal(normalizeLearningNotebook({ ...chosen, activeSetId: 'missing' }).activeSetId, undefined)
  // 登録先の冊を消したら、並びの先頭の冊が登録先。
  const deleted = deleteNotebookSet(chosen, ids[1])
  assert.equal(deleted.activeSetId, undefined)
  assert.equal(activeNotebookSetId(deleted), ids[0])
  // ほかの冊を消しても登録先は変わらない。
  assert.equal(deleteNotebookSet(chosen, ids[0]).activeSetId, ids[1])
  assert.equal(activeNotebookSetId(createLearningNotebook()), null)

  // 端末保存・進捗コード・クラウド同期で保つ。
  assert.equal(migratePersistedState({ learningNotebook: chosen }).learningNotebook.activeSetId, ids[1])
  const code = encodeProgress({ learningNotebook: chosen })
  assert.equal(progressStateFromPayload(decodeProgress(code)).learningNotebook.activeSetId, ids[1])
  assert.equal(progressStateFromCloud({ learningNotebook: chosen }, createInitialLearningState()).learningNotebook.activeSetId, ids[1])
  // 保存した教材・ノートのリセットで、はじめの「マイ単語」だけに戻る。
  const reset = resetProgressState({ learningNotebook: chosen }, ['saved'])
  assert.deepEqual(reset.learningNotebook, createStarterLearningNotebook())

  // 下部の枠：単語帳ボタンが画面にあるとき「単語帳」を出し、登録先・単語帳の並び・設定を開くボタンを置く。
  const unregister = modules.dock.registerWordBookButton()
  try {
    const html = renderDock({ screen: 'wordDetail', params: {}, learningNotebook: chosen })
    assert.match(html, /data-word-book-slot-console/)
    assert.match(html, /登録先/)
    assert.match(html, /data-word-book-slot-settings/)
    assert.match(html, /aria-label="単語帳の設定を開く"/)
    for (const id of ids) assert.match(html, new RegExp(`data-word-book-slot="${id}"`))
    assert.match(html, new RegExp(`aria-checked="true"[^>]*data-word-book-slot="${ids[1]}"`))
    // 単語帳が1冊もないときは、作る入口を出す。
    const empty = renderDock({ screen: 'wordDetail', params: {}, learningNotebook: createLearningNotebook() })
    assert.match(empty, /単語帳を作る/)
  } finally {
    unregister()
  }
  // 単語帳ボタンがない画面には出さない。
  assert.doesNotMatch(renderDock({ screen: 'portal', params: {}, learningNotebook: chosen }), /data-word-book-slot-console/)

  // 単語帳の設定：登録先を選ぶ・作る・冊ごとの歯車（名前・並び順・削除）。
  modules.dock.openWordBookSettings()
  try {
    const sheet = withInitialState({ learningNotebook: chosen }, () => renderToStaticMarkup(React.createElement(modules.slot.WordBookSlotSheet)))
    assert.match(sheet, /data-word-book-slot-sheet/)
    assert.match(sheet, /単語帳の設定/)
    for (const id of ids) assert.match(sheet, new RegExp(`data-word-book-slot-choose="${id}"`))
    assert.match(sheet, /data-word-book-slot-new-title/)
    assert.match(sheet, /作って登録先にする/)
    assert.equal((sheet.match(/data-word-book-settings-button/g) ?? []).length, ids.length)
  } finally {
    modules.dock.closeWordBookSettings()
  }

  // 単語帳ボタンのある全38ファイルが、押すと登録先へ入れる部品（useWordBookSlot か、それを使う WordBookToggle・WordBookButton）を使う。
  assert.equal(WORD_BOOK_FILES.length, 38)
  for (const file of WORD_BOOK_FILES) {
    const source = read(`src/${file}`)
    assert.match(source, /useWordBookSlot\(|<WordBookToggle\b|<WordBookButton\b/, file)
  }
  // 単語帳ボタンが画面に出ているあいだ、下部に「単語帳」を出す。
  assert.match(read('src/components/WordBookSlot.jsx'), /useEffect\(\(\) => \(enabled \? registerWordBookButton\(\) : undefined\), \[enabled\]\)/)
})

test('単語帳ボタンは登録先に入れる：押すと入れ、もう一度押すと外し、入らないときは知らせて単語帳の設定を開く', () => {
  const original = useStore.getState()
  try {
    const { notebook, ids } = notebookWithBooks(['マイ単語', 'テスト範囲'])
    useStore.setState({ learningNotebook: selectNotebookSet(notebook, ids[1]) })
    const refs = ['vocab:abandon']
    const toggle = () => useStore.getState().toggleWordBookSlot(refs)
    const setOf = (id) => useStore.getState().learningNotebook.sets.find((set) => set.id === id)
    // 押すと登録先に入れる（ほかの冊は変えない）。
    assert.deepEqual(toggle(), { action: 'add', bookId: ids[1], bookTitle: 'テスト範囲', requested: 1, added: 1, removed: 0 })
    assert.deepEqual(setOf(ids[1]).refs, refs)
    assert.deepEqual(setOf(ids[0]).refs, [])
    assert.equal(wordBookSlotStatus(useStore.getState().learningNotebook, refs).inBook, true)
    // もう一度押すと外す。
    assert.equal(toggle().action, 'remove')
    assert.deepEqual(setOf(ids[1]).refs, [])
    // 登録先を変えると、そちらに入る。
    useStore.getState().selectNotebookSet(ids[0])
    assert.equal(toggle().bookTitle, 'マイ単語')
    assert.deepEqual(setOf(ids[0]).refs, refs)
    // まとめて入れる：一部が入っていれば入っていない分を入れ、全部入っていれば全部外す。
    const many = ['vocab:abandon', 'vocab:ability', 'phrases:idm_look_at']
    const partial = useStore.getState().toggleWordBookSlot(many)
    assert.equal(partial.action, 'add')
    assert.equal(partial.added, 2)
    assert.equal(useStore.getState().toggleWordBookSlot(many).action, 'remove')
    assert.deepEqual(setOf(ids[0]).refs, [])
    // 登録先が500項目でいっぱいなら入れない。
    const full = ALL_WORDS.filter((word) => word.id !== 'abandon').slice(0, NOTEBOOK_LIMITS.itemsPerSet).map((word) => `vocab:${word.id}`)
    useStore.getState().setNotebookSetRefs(ids[0], full, true)
    const refused = toggle()
    assert.equal(refused.action, 'full')
    assert.equal(setOf(ids[0]).refs.includes('vocab:abandon'), false)
    // 単語帳が1冊もないとき。
    useStore.setState({ learningNotebook: createLearningNotebook() })
    assert.equal(toggle().action, 'noBook')

    // 下部に出す知らせ。入れた先と結果を先に書き、項目の名前は最後に添える。
    assert.equal(wordBookSlotNotice({ action: 'add', bookTitle: 'テスト範囲', requested: 1, added: 1 }, { label: 'abandon', refs }), '「テスト範囲」に入れました（abandon）')
    assert.equal(wordBookSlotNotice({ action: 'remove', bookTitle: 'テスト範囲' }, { label: 'abandon', refs }), '「テスト範囲」から外しました（abandon）')
    assert.equal(wordBookSlotNotice({ action: 'add', bookTitle: 'マイ単語', requested: 12, added: 8 }, { refs: Array(12).fill('vocab:x') }), '「マイ単語」に8語入れました（500項目まで）')
    assert.equal(wordBookSlotNotice({ action: 'full', bookTitle: 'マイ単語' }, { refs }), '「マイ単語」は500項目まで入っています')
    assert.equal(wordBookSlotNotice({ action: 'noBook' }, { refs }), '単語帳がありません。作ると入れられます')
  } finally {
    useStore.setState(original, true)
  }

  // ボタンの塗りと読み上げ名は、登録先に入っているかで示す。
  const { notebook, ids } = notebookWithBooks(['マイ単語', 'テスト範囲'])
  const withWord = selectNotebookSet({
    ...notebook,
    sets: notebook.sets.map((set) => (set.id === ids[1] ? { ...set, refs: ['vocab:abandon'] } : set)),
  }, ids[1])
  const toggleHtml = (learningNotebook) => withInitialState({ learningNotebook }, () => renderToStaticMarkup(
    React.createElement(modules.lists.WordBookToggle, { domain: 'vocab', itemId: 'abandon', itemLabel: 'abandon' }),
  ))
  assert.match(toggleHtml(withWord), /aria-pressed="true"/)
  assert.match(toggleHtml(withWord), /abandonを単語帳「テスト範囲」から外す（入っています）/)
  const inOtherBook = selectNotebookSet(withWord, ids[0])
  assert.match(toggleHtml(inOtherBook), /aria-pressed="false"/)
  assert.match(toggleHtml(inOtherBook), /abandonを単語帳「マイ単語」に入れる/)
  const buttonHtml = withInitialState({ learningNotebook: withWord }, () => renderToStaticMarkup(
    React.createElement(modules.lists.WordBookButton, { domain: 'vocab', itemId: 'abandon', itemLabel: 'abandon' }),
  ))
  assert.match(buttonHtml, /単語帳「テスト範囲」から外す/)

  // 入れる冊を選ぶ窓は開かない（どの画面にも残さない）。入らないときだけ、単語帳の設定を開き、選んだ・作った冊へ入れる。
  const all = WORD_BOOK_FILES.map((file) => read(`src/${file}`)).join('\n')
  assert.doesNotMatch(all, /<WordListSheet|useWordBookPicker|入れる単語帳を選ぶ/)
  assert.doesNotMatch(read('src/components/WordListSheet.jsx'), /export function WordListSheet|export function useWordBookPicker/)
  const slot = read('src/components/WordBookSlot.jsx')
  assert.match(slot, /if \(!done\) openWordBookSettings\(\{ refs: list, label \}\)/)
  assert.match(slot, /const result = useStore\.getState\(\)\.toggleWordBookSlot\(pending\.refs\)/)
})

test('下部の枠：読み上げ・出題・単語帳の使えるものを左の縦の切り替えで選び、どれも見出し1行＋操作1行に収める', () => {
  // 7通りの組み合わせ。並びは 読み上げ→出題→単語帳。
  const combos = []
  for (const speechVisible of [false, true]) {
    for (const mix of [false, true]) {
      for (const book of [false, true]) {
        const panels = studyDockPanels({ speechVisible, mixContext: mix ? {} : null, wordBookButtons: book ? 1 : 0 })
        const expected = STUDY_DOCK_PANELS.filter((panel) => ({ speech: speechVisible, mix, book })[panel])
        assert.deepEqual(panels, expected)
        if (panels.length) combos.push(panels)
      }
    }
  }
  assert.equal(combos.length, 7)
  for (const panels of combos) {
    // はじめは並びの先頭。自分で選んだもの、単語帳ボタンの結果（単語帳）を優先する。
    assert.equal(studyDockShowing(panels), panels[0])
    for (const panel of panels) assert.equal(studyDockShowing(panels, { chosen: panel }), panel)
    if (panels.includes('book')) assert.equal(studyDockShowing(panels, { chosen: panels[0], flash: 'book' }), 'book')
    // 画面に無いものを選んでいたら先頭へ戻す。
    assert.equal(studyDockShowing(panels, { chosen: 'none' }), panels[0])
  }
  assert.equal(studyDockPanels({}).length, 0)

  // 描いた枠：2つ以上なら左に縦の切り替え、1つなら切り替えなし。同じマスに重ねて、見えていないものは隠す。
  const unregister = modules.dock.registerWordBookButton()
  try {
    const both = renderDock({ screen: 'kotenStudy', params: {} })
    assert.match(both, /data-study-dock-tabs/)
    assert.match(both, /data-study-dock-tab="mix"/)
    assert.match(both, /data-study-dock-tab="book"/)
    assert.equal((both.match(/data-study-dock-panel="/g) ?? []).length, 2)
    assert.match(both, /class="col-start-1 row-start-1 min-w-0 invisible"[^>]*data-study-dock-panel="book"/)
    const bookOnly = renderDock({ screen: 'wordDetail', params: {} })
    assert.doesNotMatch(bookOnly, /data-study-dock-tabs/)
    assert.equal((bookOnly.match(/data-study-dock-panel="/g) ?? []).length, 1)
  } finally {
    unregister()
  }
  const mixOnly = renderDock({ screen: 'kotenStudy', params: {} })
  assert.doesNotMatch(mixOnly, /data-study-dock-tabs/)
  assert.equal((mixOnly.match(/data-study-dock-panel="/g) ?? []).length, 1)

  // どれも見出し1行（h-8）＋操作1行（min-h-11）。切り替えは左に縦に並べ、切り替えだけの段を作らない。
  const dockSource = read('src/components/SpeechConsole.jsx')
  assert.match(dockSource, /className="flex w-10 shrink-0 flex-col gap-0\.5 py-1 pl-1"/)
  assert.match(dockSource, /\{shared && \(/)
  for (const [path, controls] of [
    ['src/components/SpeechConsole.jsx', 'data-speech-console-controls'],
    ['src/components/VocabMixConsole.jsx', 'data-vocab-mix-console-controls'],
    ['src/components/WordBookSlot.jsx', 'data-word-book-slot-list'],
  ]) {
    const source = read(path)
    assert.match(source, /className="mb-1 flex h-8 min-w-0 items-center gap-1\.5"/, path)
    assert.ok(source.includes(controls), `${path}: 操作の行`)
  }
  assert.match(dockSource, /flex min-h-11 min-w-0 flex-col items-center justify-center/)
  assert.match(read('src/components/VocabMixConsole.jsx'), /flex min-h-11 flex-1 items-center gap-1\.5/)
  assert.match(read('src/components/WordBookSlot.jsx'), /no-scrollbar flex min-h-11 min-w-0 flex-1 items-center gap-1 overflow-x-auto/)
})
