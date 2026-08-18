import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

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
    assert.match(source, /useState\(revealAll\)/, `${path} が最初から開いた状態で始まらない`)
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
