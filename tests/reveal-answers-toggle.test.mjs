import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { normalizeSettings, useStore } from '../src/store/useStore.js'
import { planCardAutoSpeech } from '../src/lib/cardSpeech.js'

// 「タップして意味を見る」を毎回タップしなくて済むカード上の切り替えは、
// 一度ヘッダー整理で消えたことがある。カード画面から消えないよう固定する。
const CARD_SCREENS = [
  'src/screens/VocabStudy.jsx',
  'src/screens/KotenStudy.jsx',
  'src/screens/KotenGrammarStudy.jsx',
  'src/screens/KotenCultureStudy.jsx',
  'src/screens/PhraseStudy.jsx',
  'src/screens/KanbunStudy.jsx',
]

test('カード画面に答えを開いたままにする切り替えがある', () => {
  const toggle = readFileSync('src/components/RevealAnswers.jsx', 'utf8')
  assert.match(toggle, /export function RevealAnswersToggle/)
  assert.match(toggle, /setSetting\('revealAnswers'/)

  for (const path of CARD_SCREENS) {
    const source = readFileSync(path, 'utf8')
    assert.match(source, /import \{ RevealAnswersToggle \}/, `${path} でトグルを読み込んでいない`)
    assert.match(source, /<RevealAnswersToggle/, `${path} にトグルが置かれていない`)
    // 設定がONなら最初から開いた状態で始まり、次のカードでも開いたままにする
    assert.match(source, /settings\.revealAnswers|state\.settings\.revealAnswers/, `${path} が設定を見ていない`)
    assert.match(
      source,
      path.endsWith('VocabStudy.jsx')
        ? /useState\(restore\?\.flipped \?\? revealAll\)/
        : /useState\(revealAll\)/,
      `${path} が最初から開いた状態で始まらない`,
    )
  }
})

// 覚えたか・まだかを答える2つのボタンは、どのカード画面にも必ず要る。
// （語源カードでは一度「もう一度」だけに置き換わり、まだ側が消えていた）
test('カード画面に「まだ」と「覚えた」の両方のボタンがある', () => {
  for (const path of CARD_SCREENS) {
    const source = readFileSync(path, 'utf8')
    assert.match(source, /まだ\s*🤔/, `${path} に「まだ」のボタンがない`)
    assert.match(source, /覚えた\s*👍/, `${path} に「覚えた」のボタンがない`)
    assert.match(source, /answer\(false\)/, `${path} が「まだ」を記録していない`)
    assert.match(source, /answer\(true\)/, `${path} が「覚えた」を記録していない`)
  }
})

// 英単語・熟語のカードは、目のボタンで「意味を隠す→スペルを隠す→全部見せる」と切り替える。
// スペルを隠しているあいだは、つづり・発音記号・読み上げボタンを出さず、自動の読み上げもしない。
test('英単語・熟語のカードは目のボタンでスペルも隠し、隠しているあいだは発音しない', () => {
  const toggle = readFileSync('src/components/RevealAnswers.jsx', 'utf8')
  assert.match(toggle, /spellingLabel/)
  assert.match(toggle, /setSetting\('hideSpelling', true\)/)
  assert.match(toggle, /data-reveal-mode=\{mode\}/)

  for (const [path, spellingLabel, heading] of [
    ['src/screens/VocabStudy.jsx', 'スペル', '{word.word}'],
    ['src/screens/PhraseStudy.jsx', '英語', '{item.phrase}'],
  ]) {
    const source = readFileSync(path, 'utf8')
    assert.match(
      source,
      new RegExp(`<RevealAnswersToggle[\\s\\S]*?spellingLabel="${spellingLabel}"`),
      `${path}: 目のボタンでスペルを隠せない`,
    )
    assert.match(source, /const spellingHidden = Boolean\((?:word|item)\) && hideSpelling && !flipped/)
    // 自動の読み上げ（useCardAutoSpeech）に、スペルを隠しているかとカードを開いたかを渡す
    assert.match(
      source,
      /useCardAutoSpeech\(\{[\s\S]*?\n\s*spellingHidden,\n\s*answerOpen: flipped,\n[\s\S]*?\}\)/,
      `${path}: スペルを隠しても読み上げる`,
    )
    // 隠している側の表示に、つづりと読み上げボタンを置かない
    const hiddenStart = source.indexOf('{spellingHidden ? (')
    assert.ok(hiddenStart > 0, `${path}: スペルを隠した表示がない`)
    const hiddenBranch = source.slice(hiddenStart, source.indexOf(') : (', hiddenStart))
    assert.doesNotMatch(hiddenBranch, /SpeakButton|phonetic/, `${path}: 隠している側に読み上げが残っている`)
    assert.ok(!hiddenBranch.includes(heading), `${path}: 隠している側につづりが出る`)
  }

  // 隠しているあいだは読み上げず、流れている音声と、つづりが出る再生パネルも閉じる（自動で発音がオフでも閉じる）。
  const hook = readFileSync('src/components/useCardAutoSpeech.js', 'utf8')
  assert.match(hook, /if \(plan\.action === 'dismiss'\) dismissSpeechPlayer\(\)/)
  assert.match(hook, /\}, \[cardKey, spellingHidden, answerOpen\]\)/)
  for (const autoSpeak of [true, false]) {
    const hidden = planCardAutoSpeech(null, { spellingHidden: true, answerOpen: false, range: 'word', autoSpeak })
    assert.equal(hidden.action, 'dismiss')
  }
  // カードを開いてスペルが見えたら、そこで単語から読み上げる
  const hidden = planCardAutoSpeech(null, { spellingHidden: true, answerOpen: false, range: 'word', autoSpeak: true })
  const shown = planCardAutoSpeech(hidden.memory, { spellingHidden: false, answerOpen: true, range: 'word', autoSpeak: true })
  assert.deepEqual([shown.action, shown.startSegment], ['play', 0])
})

test('「答えを開いたまま」と「スペルを隠す」は、片方をONにするともう片方が外れる', () => {
  const original = useStore.getState().settings
  try {
    const { setSetting } = useStore.getState()
    setSetting('revealAnswers', true)
    setSetting('hideSpelling', true)
    assert.equal(useStore.getState().settings.hideSpelling, true)
    assert.equal(useStore.getState().settings.revealAnswers, false)
    setSetting('revealAnswers', true)
    assert.equal(useStore.getState().settings.revealAnswers, true)
    assert.equal(useStore.getState().settings.hideSpelling, false)
    setSetting('revealAnswers', false)
    assert.equal(useStore.getState().settings.hideSpelling, false)
  } finally {
    useStore.setState({ settings: original })
  }
  // 両方ONで届いた値は、前からある「開いたまま」を残す
  const both = normalizeSettings({ revealAnswers: true, hideSpelling: true })
  assert.equal(both.revealAnswers, true)
  assert.equal(both.hideSpelling, false)
  assert.equal(normalizeSettings({}).hideSpelling, false)
  assert.equal(normalizeSettings({ hideSpelling: true }).hideSpelling, true)
})
