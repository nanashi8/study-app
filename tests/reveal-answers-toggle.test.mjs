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
  'src/screens/EtymologyStudy.jsx',
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

// 下部の判定欄に置くのは「まだ」「覚えた」だけ。カードを開く操作は上の目のボタンと
// カードのタップが受け持つので、下部の「意味を見る」「答えを見る」「意味・成り立ちを見る」とは重ねない。
// 慣れた学習者は、英単語でも古文・漢文でも、意味や答えを開かないまま答えて次のカードへ進める。
test('全暗記カードは、意味や答えを開かないままでも「まだ」「覚えた」を押せる', () => {
  for (const path of CARD_SCREENS) {
    const source = readFileSync(path, 'utf8')
    const start = source.indexOf('<CardStudyFooter')
    assert.ok(start > 0, `${path}: 下部の判定欄がない`)
    const footer = source.slice(start, source.indexOf('</CardStudyFooter>', start))
    // 開いたかどうかで下部を入れ替えず、カードを開くボタンも置かない。
    assert.doesNotMatch(footer, /flipped|revealed/, `${path}: 下部の判定欄がカードを開いたかで変わる`)
    assert.doesNotMatch(footer, /を見る/, `${path}: 下部にカードを開くボタンが残っている`)
    // 答えていないカードでは、開いていなくても両方の判定を押せる。
    assert.match(footer, /まだ\s*🤔/, `${path}: 下部に「まだ」がない`)
    assert.match(footer, /覚えた\s*👍/, `${path}: 下部に「覚えた」がない`)
    assert.match(footer, /onClick=\{\(\) => answer\(false\)\}/, `${path}: 「まだ」が答えを記録しない`)
    assert.match(footer, /onClick=\{\(\) => answer\(true\)\}/, `${path}: 「覚えた」が答えを記録しない`)
    // カードそのもののタップは、これまでどおり意味・答えを開く道として残す。
    assert.match(source, /タップ/, `${path}: カードのタップ案内が消えている`)
    assert.match(
      source,
      /onClick=\{\(\) => [^}]*set(?:Flipped|Revealed)\(/,
      `${path}: カードのタップで開けない`,
    )
  }

  // 名作の本文語彙カードは共通の判定欄を使わないが、下部の形は同じにそろえる。
  const literature = readFileSync('src/components/LiteratureVocabularySheet.jsx', 'utf8')
  const cards = literature.slice(
    literature.indexOf('data-literature-vocabulary-card='),
    literature.indexOf("mode === 'done'"),
  )
  const beforeAnswers = cards.slice(cards.lastIndexOf('</article>'), cards.lastIndexOf('grid grid-cols-2'))
  assert.doesNotMatch(beforeAnswers, /revealed/, '名作の本文語彙カード: 下部の判定が開いたかで変わる')
  assert.doesNotMatch(beforeAnswers, /を見る/, '名作の本文語彙カード: 下部にカードを開くボタンが残っている')
  assert.match(cards, /onClick=\{\(\) => answer\(false\)\}/, '名作の本文語彙カード: 「まだ」が答えを記録しない')
  assert.match(cards, /onClick=\{\(\) => answer\(true\)\}/, '名作の本文語彙カード: 「覚えた」が答えを記録しない')
  assert.match(cards, /<RevealAnswersToggle/, '名作の本文語彙カード: 上の目のボタンがない')
  assert.match(cards, /onClick=\{\(\) => !revealed && setRevealed\(true\)\}/, '名作の本文語彙カード: カードのタップで開けない')
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
