// カタカナ語の使う場面の依頼（requests/2026-11-09-loanword-scenes.json）の回帰テスト。
// カタカナだけだった 2,392 語のどれにも、日本語でそのカタカナを使う場面の例か、使わない理由の注意書きがあることを確かめる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { getWord } from '../src/data/vocab.js'
import { LOANWORD_HINTS } from '../src/data/loanword-hints.js'
import { loanwordHintFor } from '../src/lib/wordRelations.js'

const { targets } = JSON.parse(readFileSync(new URL('../docs/audits/loanword-scenes.json', import.meta.url), 'utf8'))
const plain = (text) => String(text).normalize('NFKC').replace(/[・\s]/g, '')

test('カタカナだけだった語の全件に、使う場面の例か注意書きがある', () => {
  assert.equal(targets.length, 2392)
  assert.equal(new Set(targets).size, targets.length)
  const missing = []
  for (const id of targets) {
    const hint = LOANWORD_HINTS[id]
    assert.ok(hint, `${id} が台帳から消えた`)
    if (!hint.scene && !hint.note) missing.push(id)
  }
  assert.deepEqual(missing.slice(0, 30), [], `場面も注意書きもない語が ${missing.length} 語`)
})

test('使う場面の文は日本語だけで書き、そのカタカナを入れる', () => {
  let scenes = 0
  for (const [id, hint] of Object.entries(LOANWORD_HINTS)) {
    if (!('scene' in hint)) continue
    scenes += 1
    assert.ok(String(hint.scene).trim(), `${id} の場面が空`)
    assert.doesNotMatch(hint.scene, /[A-Za-z]/, `${id} の場面に英字がある`)
    assert.ok(plain(hint.scene).includes(plain(hint.kana)), `${id} の場面に ${hint.kana} がない: ${hint.scene}`)
    assert.ok(loanwordHintFor(getWord(id))?.scene, `${id} の場面がヒントに出ない`)
  }
  assert.ok(scenes >= 2000, `場面が ${scenes} 語しかない`)
})

test('spur はボクシングのスパー（spar）・ラストスパート（spurt）と結びつけない', () => {
  const hint = LOANWORD_HINTS.spur
  assert.ok(!hint.scene, 'spur に使う場面を書かない')
  assert.match(hint.note, /(^|[^a-z])spar([^a-z]|$)/)
  assert.match(hint.note, /spurt/)
  assert.match(hint.note, /ボクシング/)
})

test('カードの裏と辞書ページの部品に使う場面の行がある', () => {
  const component = readFileSync(new URL('../src/components/WordRelations.jsx', import.meta.url), 'utf8')
  assert.match(component, /data-word-loanword-scene/)
  assert.match(component, /hint\.scene/)
})
