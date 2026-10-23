// カタカナ語の依頼（requests/2026-10-23-loanword-katakana-expand.json）の回帰テスト。
// 全見出し語を1語ずつ読んだ記録、同じカタカナになる別の語どうしの相互の注意書き、画面に出る形を確かめる。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { LOANWORD_HINTS } from '../src/data/loanword-hints.js'
import { loanwordHintFor } from '../src/lib/wordRelations.js'

const survey = JSON.parse(readFileSync(new URL('../docs/audits/loanword-survey.json', import.meta.url), 'utf8'))

// 同じ語の変化形・派生語。同じカタカナでも取り違える別の語ではないので、互いに触れなくてよい。
const SAME_WORD_FAMILY = [
  ['dramatic', 'dramatically'],
  ['grape', 'grapes'],
  ['legend', 'legendary'],
  ['manner', 'manners'],
  ['manual', 'manually'],
  ['note', 'notebook'],
  ['random', 'randomly'],
  ['recommend', 'recommendation'],
  ['renovate', 'renovation'],
  ['sock', 'socks'],
  ['subscribe', 'subscription'],
  ['text', 'textbook'],
  ['mail', 'e_mail'],
]
const familyOf = new Map()
for (const family of SAME_WORD_FAMILY) for (const id of family) familyOf.set(id, family[0])
const familyKey = (id) => familyOf.get(id) ?? id

// 長音・促音は発音がちがうので残す。表記ゆれ（ヴ／ブ、ウィ／ウイ、中黒）だけそろえる。
const normalizeKana = (kana) => kana.normalize('NFKC').replace(/・/g, '').replace(/ヴ/g, 'ブ').replace(/ウィ/g, 'ウイ')
const spellingOf = (id) => getWord(id).word.toLowerCase()
const mentions = (note, spelling) => new RegExp(`(^|[^a-z])${spelling}([^a-z]|$)`, 'i').test(note)

test('辞書の全見出し語を1語ずつ読んだ記録がある', () => {
  const read = new Set(survey.read)
  const unread = ALL_WORDS.filter((word) => !read.has(word.id)).map((word) => word.id)
  assert.deepEqual(unread, [], `未読の見出し語: ${unread.slice(0, 20).join(', ')}`)
  const ids = new Set(ALL_WORDS.map((word) => word.id))
  assert.deepEqual(survey.read.filter((id) => !ids.has(id)), [], '辞書にない id を読んだことになっている')
  assert.equal(survey.read.length, ALL_WORDS.length)
})

test('カタカナ語の台帳は、辞書の語を指し、カタカナだけで書かれている', () => {
  const entries = Object.entries(LOANWORD_HINTS)
  assert.ok(entries.length >= 2900, `台帳が ${entries.length} 語しかない`)
  for (const [id, hint] of entries) {
    assert.ok(getWord(id), `${id} が辞書にない`)
    assert.match(hint.kana, /^[ァ-ヺー・]+$/u, id)
    if ('note' in hint) assert.ok(String(hint.note).trim(), `${id} の注意書きが空`)
  }
})

test('同じカタカナになる別の語は、どちらの注意書きも相手を名指しして取り違えを防ぐ', () => {
  const groups = new Map()
  for (const [id, hint] of Object.entries(LOANWORD_HINTS)) {
    const key = normalizeKana(hint.kana)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(id)
  }
  const problems = []
  let compared = 0
  for (const ids of groups.values()) {
    for (const a of ids) {
      const note = LOANWORD_HINTS[a].note ?? ''
      for (const b of ids) {
        if (a === b || familyKey(a) === familyKey(b)) continue
        compared += 1
        const spellingB = spellingOf(b)
        if (spellingOf(a) === spellingB) {
          if (!note) problems.push(`${a}: 同じつづりの ${b} と区別する注意書きがない`)
        } else if (!mentions(note, spellingB) && !mentions(note, spellingOf(familyKey(b)))) {
          problems.push(`${a}: 同じカタカナの ${b} に触れていない`)
        }
      }
    }
  }
  assert.deepEqual(problems, [])
  assert.ok(compared >= 150, `突き合わせた組が ${compared} しかない`)
})

test('依頼のきっかけの barrister と barista、日本語になっている語の例が画面に出る', () => {
  const barrister = loanwordHintFor(getWord('barrister'))
  assert.equal(barrister.kana, 'バリスター')
  assert.match(barrister.note, /barista/)
  assert.match(barrister.note, /バリスタ/)
  // 日本で作られた言い方・外国語由来は、英語の言い方を添える。
  assert.match(loanwordHintFor(getWord('bread')).note, /ポルトガル語/)
  assert.match(loanwordHintFor(getWord('gas')).note, /gas station/)
  assert.match(loanwordHintFor(getWord('eleven')).note, /サッカー/)
  assert.match(loanwordHintFor(getWord('norm')).note, /ロシア語/)
  assert.match(loanwordHintFor(getWord('hear')).note, /ヒアリング/)
  assert.match(loanwordHintFor(getWord('grammar')).note, /glamour/)
  assert.match(loanwordHintFor(getWord('clash')).note, /crash/)
})

test('意味欄に同じカタカナがあり注意書きもない語は出さない（ほかの欄とだぶらない）', () => {
  for (const [id, hint] of Object.entries(LOANWORD_HINTS)) {
    const word = getWord(id)
    const inMeaning = word.meanings.some((meaning) => meaning.includes(hint.kana))
    assert.equal(Boolean(loanwordHintFor(word)), !inMeaning || Boolean(hint.note), id)
  }
})
