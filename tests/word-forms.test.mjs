import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { dictionary } from 'cmu-pronouncing-dictionary'
import {
  WORD_FORM_EXTRAS,
  WORD_FORM_EXTRA_SKIPPED,
  WORD_FORM_GROUPS,
  WORD_FORM_HOMOGRAPH_SIDE,
  WORD_FORM_NOTES,
} from '../src/data/word-forms.js'
import { SPELLING_CONFUSABLE_EXTRAS, SPELLING_CONFUSABLE_PAIRS } from '../src/data/spelling-confusables.js'
import { antonymWordsFor, confusablesFor, wordFormsFor, wordRelationsFor } from '../src/lib/wordRelations.js'
import { wordFormCandidatePairs, wordFormExtraCandidates } from '../scripts/word-form-candidates.mjs'
import { arpaToIPA } from '../scripts/arpa-ipa.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const formsOf = (id) => wordFormsFor(getWord(id)).map((word) => `${word.word}:${word.pos}`)
const pairKey = (a, b) => [a, b].sort().join('|')
const lexicon = new Set(Object.keys(dictionary).filter((key) => /^[a-z]+$/.test(key)))

test('ほかの品詞の形は、見ている語とちがう品詞だけを動詞・名詞・形容詞・副詞の順に並べる', () => {
  // 辞書に見出しのない形（decisiveness）も、見出し語の形のあとに並べる。
  assert.deepEqual(formsOf('decide'), ['decision:名', 'decisiveness:名', 'decisive:形', 'decisively:副'])
  assert.deepEqual(formsOf('decision'), ['decide:動', 'decisive:形', 'decisively:副'])
  assert.deepEqual(formsOf('happy'), ['happiness:名', 'happily:副'])
  // 意味の筋が分かれる語は、見ている語の筋の形だけを出す（success に successive「連続する」は出さない）。
  assert.deepEqual(formsOf('success'), ['succeed:動', 'successful:形', 'successfully:副'])
  // 意味が広がった形も参考に並べ、ずれ方を添える。
  const considerable = wordFormsFor(getWord('consider')).find((word) => word.word === 'considerable')
  assert.match(considerable.formNote, /かなりの/)
  // 辞書に見出しのない形は、意味と発音記号を持つ。
  const violence = wordFormsFor(getWord('violent')).find((word) => word.word === 'violence')
  assert.deepEqual([violence.extra, violence.pos, violence.phonetic], [true, '名', '/ˈvaɪələns/'])
  assert.equal(formsOf('flow').some((form) => form.startsWith('flower')), false)
})

test('つづりが似ているだけの別の語は、ほかの品詞の形ではなく、つづりが似ていて間違えやすい語に出す', () => {
  assert.ok(confusablesFor(getWord('flow')).some((item) => item.word.id === 'flower'))
  assert.ok(confusablesFor(getWord('flower')).some((item) => item.word.id === 'flow'))
  // 辞書に見出しのない語も、意味と発音記号つきで出す（admire と admiral）。
  const admiral = confusablesFor(getWord('admire')).find((item) => item.word.word === 'admiral')
  assert.equal(admiral.word.meaning, '提督・海軍大将')
  assert.ok(admiral.segments.some((segment) => segment.changed))
})

test('台帳のまとまりは辞書にある語だけで、どれも2つ以上の品詞にまたがる', () => {
  const seen = new Set()
  for (const group of WORD_FORM_GROUPS) {
    const key = group.join('|')
    assert.equal(seen.has(key), false, `重複: ${key}`)
    seen.add(key)
    for (const id of group) assert.ok(getWord(id), `辞書にない語: ${id}`)
    assert.ok(new Set(group.map((id) => getWord(id).pos)).size >= 2, `品詞が1つだけ: ${key}`)
  }
  const grouped = new Set(WORD_FORM_GROUPS.flat())
  for (const id of Object.keys(WORD_FORM_NOTES)) assert.ok(grouped.has(id), `説明の語がまとまりにない: ${id}`)
})

test('規則が拾った見出し語どうしの組は、1組も捨てずに行き先を決めてある', () => {
  const together = new Set()
  for (const group of WORD_FORM_GROUPS) {
    for (const a of group) for (const b of group) if (a < b) together.add(`${a}|${b}`)
  }
  const confusable = new Set(SPELLING_CONFUSABLE_PAIRS.map(([a, b]) => pairKey(a, b)))
  const homograph = new Set(WORD_FORM_HOMOGRAPH_SIDE)
  const candidates = wordFormCandidatePairs(ALL_WORDS).map(([a, b]) => `${a}|${b}`)
  const undecided = candidates.filter((pair) => !together.has(pair) && !confusable.has(pair) && !homograph.has(pair))
  assert.deepEqual(undecided, [], '候補の組 → 同じ語の形なら WORD_FORM_GROUPS、つづりが似た別の語なら spelling-confusables.js、同じつづりの別の語の側なら WORD_FORM_HOMOGRAPH_SIDE')
  const candidateSet = new Set(candidates)
  assert.deepEqual(WORD_FORM_HOMOGRAPH_SIDE.filter((pair) => !candidateSet.has(pair)), [])
})

test('辞書に見出しのない形の候補は、載せるか理由をつけて外すかを1語ずつ決めてある', () => {
  const decided = new Set([
    ...WORD_FORM_EXTRAS.map(([of, word]) => `${of}|${word.toLowerCase()}`),
    ...SPELLING_CONFUSABLE_EXTRAS.map(([of, word]) => `${of}|${word.toLowerCase()}`),
    ...Object.keys(WORD_FORM_EXTRA_SKIPPED),
  ])
  const candidates = wordFormExtraCandidates(ALL_WORDS, lexicon).map(({ of, word }) => `${of}|${word}`)
  assert.deepEqual(candidates.filter((key) => !decided.has(key)), [], '候補 → WORD_FORM_EXTRAS に意味つきで載せるか、WORD_FORM_EXTRA_SKIPPED に理由を書く')
  // 外した理由は候補に対して書くので、候補でなくなった語の理由は台帳からも消す（全語の見直しで手で足した形は候補でなくてよい）。
  const candidateSet = new Set(candidates)
  assert.deepEqual(Object.keys(WORD_FORM_EXTRA_SKIPPED).filter((key) => !candidateSet.has(key)), [], '候補でなくなった語の外した理由は台帳からも消す')
  for (const [of, word, pos, meaning, phonetic] of WORD_FORM_EXTRAS) {
    assert.ok(getWord(of), of)
    assert.ok(['動', '名', '形', '副'].includes(pos), `${word}: ${pos}`)
    assert.ok(meaning, word)
    // 発音辞書にある語は辞書の読みと一致させ、ない語は見出し語と同じ書き方で手で書いた発音記号を持つ。
    const arpa = dictionary[word.toLowerCase()]
    if (arpa) assert.equal(phonetic, arpaToIPA(arpa), `${word} の発音記号`)
    else assert.match(phonetic, /^\/[^/\s]+\/$/, `${word} の発音記号`)
  }
  for (const [of, word, meaning, phonetic] of SPELLING_CONFUSABLE_EXTRAS) {
    assert.ok(getWord(of) && meaning, word)
    assert.equal(phonetic, arpaToIPA(dictionary[word.toLowerCase()]), `${word} の発音記号`)
  }
})

test('意味が反対の語は、同じつづりを重ねずに返す', () => {
  const items = antonymWordsFor(getWord('happy'))
  assert.deepEqual(items.map((item) => item.w), ['sad', 'unhappy'])
  assert.deepEqual(wordRelationsFor(getWord('happy')).antonyms, items)
})

test('ほかの品詞の形・意味が同じ・近い語・意味が反対の語は、1語ずつ発音を再生できる', () => {
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /export function RelatedWordList/)
  assert.match(component, /isAmbiguousSpeechText\(text\)/)
  assert.match(component, /<RowSpeakButton text=\{row\.text\} \/>/)
  assert.match(component, /<RowSpeakButton text=\{item\.word\.word\} \/>/)
  assert.match(component, /data-speech-group/)
  for (const name of ['WordFormSection', 'SynonymSection', 'AntonymSection']) {
    assert.match(component, new RegExp(`export function ${name}[\\s\\S]*?<RelatedWordList`), name)
  }
  // 暗記カードの裏と辞書ページの両方に出す。
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    const source = read(screen)
    for (const name of ['WordFormSection', 'SynonymSection', 'AntonymSection']) {
      assert.match(source, new RegExp(`<${name} items=\\{relations\\.`), `${screen}: ${name}`)
    }
  }
})

test('使い分けの区別がある関連語には、使い分けを参考に添える', () => {
  // 同じ品詞の形でも、使い分けがあれば出す（classic と classical）。
  const classical = wordFormsFor(getWord('classic')).find((word) => word.word === 'classical')
  assert.match(classical.usageNote, /古典/)
  // 類義語の行にも添える（happy と glad）。
  const glad = wordRelationsFor(getWord('happy')).synonyms.find((item) => item.w === 'glad')
  assert.match(glad.usageNote, /名詞の前/)
  // ほかの欄に出ない相手は「使い分けに注意する語」に出す（percent と percentage）。
  const partners = wordRelationsFor(getWord('percent')).usagePartners.map((item) => item.word)
  assert.ok(partners.includes('percentage'))
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /export function UsagePartnerSection/)
  assert.match(component, /data-word-usage-note/)
  // 暗記カードの裏にも、辞書ページと同じ使い方・使い分けを出す。
  const card = read('src/screens/VocabStudy.jsx')
  assert.match(card, /<UsageGuideCards guides=\{word\.usageGuides\} \/>/)
  assert.match(card, /data-word-usage>/)
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(screen), /<UsagePartnerSection items=\{relations\.usagePartners\}/, screen)
  }
})

test('同じ品詞の使い分けの相手は、ほかの欄と重ねずに1か所だけに出す', () => {
  // respectable と respectful は、つづりが似た語の欄にだけ使い分けつきで出す。
  const respectable = wordRelationsFor(getWord('respectable'))
  assert.ok(!respectable.forms.some((item) => item.word === 'respectful'))
  assert.ok(respectable.confusables.find((item) => item.word.word === 'respectful').usageNote)
  // 品詞がちがう形（advice と advise）は、ほかの品詞の形にも、つづりの注意にも出す。
  const advice = wordRelationsFor(getWord('advice'))
  assert.ok(advice.forms.some((item) => item.word === 'advise'))
  assert.ok(advice.confusables.some((item) => item.word.word === 'advise'))
  for (const word of ALL_WORDS) {
    const relations = wordRelationsFor(word)
    const elsewhere = new Set([
      ...relations.synonyms.map((item) => item.w),
      ...relations.antonyms.map((item) => item.w),
      ...relations.confusables.map((item) => item.word.word),
    ].map((text) => text.toLowerCase()))
    const twice = relations.forms.filter((item) => item.pos === word.pos && elsewhere.has(item.word.toLowerCase()))
    assert.deepEqual(twice.map((item) => item.word), [], word.id)
  }
})
