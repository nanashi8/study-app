// 変化形の欄（WordInflections）が辞書ページと暗記カードの裏に出ること、台帳の全組が欄の行に読みほどけること、
// 台帳の全部の形が写真の読み取りで元の見出し語へ戻ることを確かめる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS } from '../src/data/vocab.js'
import { WORD_INFLECTIONS } from '../src/data/word-inflections.js'
import { allInflectedForms, inflectionsForWord, parseInflection } from '../src/lib/wordInflections.js'
import { wordFormIndex } from '../src/lib/ocrWordForms.js'
import { inflectionPosOf } from '../scripts/checks/word-inflections.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('変化形の欄は WordStudyCard の開いた面にあり、暗記カードと詳細の両方がその部品を使う', () => {
  const card = read('src/components/WordStudyCard.jsx')
  assert.match(card, /import \{ WordInflections \} from '\.\/WordInflections\.jsx'/)
  const flipped = card.slice(card.indexOf('<ExplanationScope'))
  assert.match(flipped, /<WordInflections word=\{word\} \/>/)
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(screen), /<WordStudyCard\b/, `${screen} が WordStudyCard を使う`)
  }
})

test('台帳の全組が、見出しつきの行か一言に読みほどける', () => {
  const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
  let pairs = 0
  const empty = []
  for (const [id, record] of Object.entries(WORD_INFLECTIONS)) {
    const word = byId.get(id)
    for (const [pos, value] of Object.entries(record)) {
      pairs += 1
      const entry = parseInflection(pos, value, word.word)
      const shows = entry.rows.length > 0 || entry.status || entry.baseOf
      if (!shows || entry.rows.some((row) => !row.label || !row.forms.length || row.forms.some((f) => !f.text))) {
        empty.push(`${id}（${pos}）: ${value}`)
      }
      if (pos === '動' && entry.rows.length === 4) {
        assert.deepEqual(entry.rows.map((row) => row.label), [word.word === 'be' ? '現在形' : '3単現', '過去形', '過去分詞', 'ing形'])
      }
    }
    // 欄に並ぶ品詞は、見出し語の品詞の順（代表の品詞・ほかの品詞）と同じ組。
    assert.deepEqual(inflectionsForWord(word).map((e) => e.pos).sort(), inflectionPosOf(word).sort(), id)
  }
  assert.deepEqual(empty, [], '何も出ない組・空の形')
  assert.ok(pairs >= 9601)
  // 比較級を more で作る語は、見出し語を添えて出す。
  const beautiful = parseInflection('形', WORD_INFLECTIONS.beautiful.形, 'beautiful')
  assert.deepEqual(beautiful.rows.map((r) => r.forms[0].text), ['more beautiful', 'most beautiful'])
  const travel = parseInflection('動', WORD_INFLECTIONS.travel.動, 'travel')
  assert.deepEqual(travel.rows[1].forms, [{ text: 'traveled' }, { text: 'travelled', british: true }])
  const information = parseInflection('名', WORD_INFLECTIONS.information.名, 'information')
  assert.equal(information.rows.length, 0)
  assert.match(information.status, /数えない/)
})

test('台帳の全部の形が、写真の読み取りで元の見出し語へ戻る', () => {
  const index = wordFormIndex(ALL_WORDS)
  const lost = []
  let checked = 0
  for (const word of ALL_WORDS) {
    if (!/^[a-z]+$/.test(word.word)) continue
    for (const form of allInflectedForms(word.id, word.word)) {
      if (!/^[a-z]+$/.test(form)) continue
      checked += 1
      if (!index.basesOf(form).some((entry) => entry.word.id === word.id)) lost.push(`${form} → ${word.id}`)
    }
  }
  assert.deepEqual(lost, [])
  assert.ok(checked >= 10000, `確かめた形 ${checked}`)
})
