// 関連語・熟語の依頼で残っていたこと（requests/2026-09-21-relations-remaining.json）の回帰テスト。
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { ALL_WORDS, getWord } from '../src/data/vocab.js'
import { posSensesFor, sameFormsFor, wordFormsFor, wordRelationsFor } from '../src/lib/wordRelations.js'
import { samePosUsageGap } from '../scripts/checks/same-pos-usage.mjs'
import { phraseSensesGap } from '../scripts/checks/phrase-senses.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('類義語・反対語の欄に、品詞がちがうだけの同じ語の形を出さない', () => {
  // metallic の metal、woolen の wool、posture の pose は、ほかの品詞の形の欄だけに出す。
  for (const [id, form] of [['metallic', 'metal'], ['woolen', 'wool'], ['posture', 'pose']]) {
    const relations = wordRelationsFor(getWord(id))
    assert.ok(relations.forms.some((item) => item.word === form), `${id}: ${form} がほかの品詞の形にない`)
    assert.ok(!relations.synonyms.some((item) => item.w === form), `${id}: ${form} が類義語に出る`)
  }
  for (const word of ALL_WORDS) {
    const relations = wordRelationsFor(word)
    const otherPos = new Set(relations.forms.filter((item) => item.pos !== word.pos).map((item) => item.word.toLowerCase()))
    for (const item of [...relations.synonyms, ...relations.antonyms]) {
      assert.ok(!otherPos.has(String(item.w).toLowerCase()), `${word.id}: ${item.w}`)
    }
  }
})

test('辞書ページの派生語欄は、形の欄に出す語を重ねない', () => {
  const withDerivatives = ALL_WORDS.filter((word) => word.derivatives?.length)
  assert.equal(withDerivatives.length, 15)
  for (const word of withDerivatives) {
    const relations = wordRelationsFor(word)
    const shown = new Set(relations.forms.map((item) => item.word.toLowerCase()))
    for (const item of relations.derivatives) assert.ok(!shown.has(String(item.w).toLowerCase()), `${word.id}: ${item.w}`)
  }
  // popular の popularity は、ほかの品詞の形の欄にだけ出す。
  assert.deepEqual(wordRelationsFor(getWord('popular')).derivatives, [])
  const detail = read('src/screens/WordDetail.jsx')
  assert.match(detail, /const derivatives = relations\.derivatives/)
  assert.doesNotMatch(detail, /items=\{word\.derivatives\}/)
})

test('熟語・構文の欄と同じ意味の熟語の欄は、全行に発音ボタンをつける', () => {
  const component = read('src/components/WordRelations.jsx')
  // 熟語は見出しを、構文は記号の入った見出しでなく例文を読む（phraseSpeechText）。
  const phraseRows = component.slice(component.indexOf('function PhraseList'), component.indexOf('function PhraseListHeading'))
  assert.match(phraseRows, /<RowSpeakButton text=\{phraseSpeechText\(phrase\)\}/)
  const idiomRows = component.slice(component.indexOf('export function IdiomEquivalentSection'), component.indexOf('function PhraseList'))
  assert.match(idiomRows, /<RowSpeakButton text=\{phraseSpeechText\(phrase\)\}/)
})

test('同じ品詞の派生語を、ほかの品詞の形と分けて暗記カードの裏と辞書ページに出す', () => {
  const decision = wordRelationsFor(getWord('decision'))
  assert.ok(decision.sameForms.some((item) => item.word === 'decisiveness'))
  assert.ok(!decision.forms.some((item) => item.word === 'decisiveness'))
  const component = read('src/components/WordRelations.jsx')
  assert.match(component, /同じ品詞の派生語/)
  assert.match(component, /data-word-same-forms/)
  for (const screen of ['src/screens/VocabStudy.jsx', 'src/screens/WordDetail.jsx']) {
    assert.match(read(screen), /sameItems=\{relations\.sameForms\}/, screen)
  }
})

test('ほかの品詞でも使う語は、その品詞の意味で形として出す', () => {
  // 意味欄の印（force の「強制する(動)」）と word-senses.js（content の「満足して」）を読む。
  const force = wordFormsFor(getWord('enforcement')).find((item) => item.word === 'force')
  assert.deepEqual([force.pos, force.meaning], ['動', '強制する'])
  const content = wordFormsFor(getWord('contentment')).find((item) => item.word === 'content')
  assert.deepEqual([content.pos, content.meaning], ['形', '満足して'])
  assert.deepEqual(posSensesFor(getWord('promise')).map((sense) => sense.pos), ['名', '動'])
})

test('同じ品詞の派生語と別の品詞の意味を、依頼の例のとおりにつなぐ', () => {
  const same = (id) => sameFormsFor(getWord(id)).map((item) => item.word)
  assert.ok(same('photograph').includes('photographer'))
  assert.ok(same('music').includes('musician'))
  assert.ok(same('dream').includes('dreamer'))
  assert.ok(same('worth').includes('worthless'))
  assert.ok(same('book').includes('booking'))
  assert.ok(same('contract').includes('contraction'))
  // still の「静かな」、musical の「音楽の」、train の「訓練する」は別の品詞の意味として持つ。
  assert.ok(wordFormsFor(getWord('still')).some((item) => item.word === 'stillness'))
  assert.ok(posSensesFor(getWord('musical')).some((sense) => sense.pos === '形' && /音楽の/.test(sense.meaning)))
  assert.ok(wordFormsFor(getWord('music')).some((item) => item.word === 'musical' && item.pos === '形'))
  assert.ok(posSensesFor(getWord('train')).some((sense) => sense.pos === '動'))
})

test('同じ品詞の組は、使い分けを書いたか、書かない理由を残してある', () => {
  const gap = samePosUsageGap()
  assert.deepEqual(gap.missing, [], '使い分けも理由もない組')
  assert.deepEqual(gap.stale, [], '同じ品詞の組でなくなった理由の行')
})

test('熟語や形で使う意味は、品詞・級・例文つきのほかの意味としてカードに出す', () => {
  const has = (id, pos, pattern) => getWord(id).otherSenses.some((sense) => sense.pos === pos && pattern.test(sense.meaning) && sense.level && sense.example?.en)
  // 熟語で使う意味（at will・spring from・be faced with・present A with B・set off・be subject to・major in など）
  assert.ok(has('will', '名', /意志/))
  assert.ok(has('spring', '動', /生じる/))
  assert.ok(has('spring', '名', /泉/))
  assert.ok(has('shoulder', '動', /引き受ける/))
  assert.ok(has('face', '動', /直面する/))
  assert.ok(has('present', '動', /贈る/))
  assert.ok(has('set', '動', /置く/))
  assert.ok(has('subject', '形', /受けやすい/))
  assert.ok(has('subject', '動', /さらす/))
  assert.ok(has('major', '動', /専攻する/))
  // 形のもとになる別の品詞の意味（torn の tear「裂く」、deserter の desert「見捨てる」、defector の defect「寝返る」、minutely の minute「微小な」）
  assert.ok(has('tear', '動', /引き裂く/))
  assert.ok(has('desert', '動', /見捨てる/))
  assert.ok(has('defect', '動', /寝返る/))
  assert.ok(has('minute', '形', /微小な/))
  // 形容詞の「決まった」は set の名詞の意味に混ぜない。
  assert.equal(getWord('set').meaning, '一式・組')
  assert.ok(has('set', '形', /決まった/))
  // 同じ語の品詞ちがいなので、別の見出し語にせず形をつなぐ。
  assert.ok(sameFormsFor(getWord('desert')).some((item) => item.word === 'deserter'))
  assert.ok(sameFormsFor(getWord('defect')).some((item) => item.word === 'defector'))
})

test('熟語の中でカードにない品詞として使っていそうな行は、意味を足したか、足さない理由を残してある', () => {
  const gap = phraseSensesGap()
  assert.deepEqual(gap.undecided, [], '意味も理由もない行')
  assert.deepEqual(gap.stale, [], '拾われなくなった理由の行')
  assert.deepEqual(gap.badCodes, [], '略号がちがう行')
})
