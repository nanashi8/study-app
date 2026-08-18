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
