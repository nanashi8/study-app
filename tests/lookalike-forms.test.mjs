// 依頼 2026-09-28-lookalike-different-words（形は似ているが元の語がちがう別の語の解説）の条件を守るテスト。
// 「contemporary, contempt, contemplation辺りは見た目が近いが全く別の語源だが、学生が迷いやすい形は似ているけど、
//   全く別の言葉の解説はできないか」という依頼から。
//  1) contemporary・contempt・contemplate … 3つの由来（tempus・temnere・templum）と見分け方、contempt は con＋tempt ではないこと
//  2) 形が似た組 … 形の似た見出し語の組の全件を読み、まとまりに載せたか、載せない理由を書いたか
//  3) 単語の画面 … 辞書ページ・暗記カードの裏・テストの答えに、形の似た語のまとまりが出ること
//  4) 食いちがい … つづり注意・語根カードの似た語の台帳と、語の成り立ちの本文の名指しと食いちがわないこと（見つけた誤りを直した）
import test, { after, before } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

import { ALL_WORDS, etymologyStoryForWord, getWord } from '../src/data/vocab.js'
import { LOOKALIKE_LINKS } from '../src/data/lookalike-forms.js'
import { lookalikeFormRelation, lookalikeFormSectionsForWord, lookalikeForms } from '../src/lib/lookalikeForms.js'
import {
  LOOKALIKE_FORM_SKIP_REASONS,
  lookalikeFormConflicts,
  lookalikeFormGaps,
  lookalikeFormPairs,
  readLookalikeFormsSurvey,
} from '../scripts/checks/lookalike-forms.mjs'
import { lookalikeVerdicts, storyClaimConflicts } from '../scripts/checks/lookalike-origins.mjs'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const h = React.createElement
const count = (html, attribute) => html.split(attribute).length - 1
// 画面ではじめに見せる行の数（src/components/LookalikeOrigins.jsx の ROW_LIMIT）。
const ROW_LIMIT = 4

let vite
let parts
let bits

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  })
  parts = await vite.ssrLoadModule('/src/components/LookalikeOrigins.jsx')
  bits = await vite.ssrLoadModule('/src/components/WordBits.jsx')
})

after(async () => {
  await vite?.close()
})

const formSection = (id, form) => lookalikeFormSectionsForWord(getWord(id)).find((section) => section.form === form)
const rowWith = (section, id) => section?.rows.find((row) => row.words.some((word) => word.id === id))
const ids = (words) => words.map((word) => word.id).sort()
const blockHtml = (id, props = {}) => renderToStaticMarkup(h(bits.EtymologyBlock, { word: getWord(id), onWord: () => {}, ...props }))

test('contemporary・contempt・contemplate：3語とその形の画面で、元の語がちがう別の語だと答え、contempt は con＋tempt ではないことを contempt と tempt の両方に出す', () => {
  // 母集団: contemp で始まる見出し語5語と、contempt に似た tempt・temptation・tempting・attempt。
  const contemp = ALL_WORDS.filter((word) => /^contemp/.test(word.word)).map((word) => word.id).sort()
  assert.deepEqual(contemp, ['contemplate', 'contemporary', 'contempt', 'contemptible', 'contemptuous'])

  // どの語の画面にも「contemp で始まる語」のまとまりが出る。同じ由来の語はまとめ、ほかの由来の語はつながりと説明を並べる。
  const contempt = formSection('contempt', 'contemp')
  assert.equal(contempt.heading, 'contemp で始まる語')
  assert.deepEqual(ids(contempt.siblings), ['contemptible', 'contemptuous'])
  assert.equal(rowWith(contempt, 'contemporary').kind, 'unrelated')
  assert.equal(rowWith(contempt, 'contemplate').kind, 'unrelated')
  assert.match(rowWith(contempt, 'contemporary').note, /tempus「時」/)
  assert.match(rowWith(contempt, 'contemplate').note, /templum/)
  for (const id of ['contemptible', 'contemptuous']) {
    assert.deepEqual(ids(formSection(id, 'contemp').siblings), ['contempt', 'contemptible', 'contemptuous'].filter((other) => other !== id))
  }
  // contemporary と contemplate: tempus「時」と templum「神殿」は同じ古い語根から来たとする説があるので「はっきりしない」。
  const contemporary = formSection('contemporary', 'contemp')
  assert.deepEqual(contemporary.siblings, [])
  assert.equal(rowWith(contemporary, 'contemplate').kind, 'unclear')
  assert.match(rowWith(contemporary, 'contemplate').relationNote, /はっきりしない/)
  assert.equal(rowWith(contemporary, 'contempt').kind, 'unrelated')
  assert.match(rowWith(contemporary, 'contempt').note, /temnere「軽んじる」/)
  assert.equal(rowWith(formSection('contemplate', 'contemp'), 'contemporary').kind, 'unclear')
  assert.equal(rowWith(formSection('contemplate', 'contemp'), 'contempt').kind, 'unrelated')
  // 近い順（はっきりしない→別の語源）に並ぶ。
  assert.deepEqual(contemporary.rows.map((row) => row.kind), ['unclear', 'unrelated'])
  // 見分け方: contemp のすぐあとの文字で、3つの元の語を見分ける。
  for (const pattern of [/tempus「時」/, /temnere「軽んじる」/, /templum「神殿」/, /temporary/, /temple/]) assert.match(contempt.tip, pattern)
  // temp で始まる語のまとまりでも、temporary・temple・tempt・temper の4つの由来を分ける。
  const temp = lookalikeForms.find((entry) => entry.form === 'temp')
  assert.equal(temp.groups.length, 4)

  // contempt は con＋tempt ではない: contempt の仲間と tempt の仲間のどちらの画面にも出る。
  for (const [id, other] of [['contempt', 'tempt'], ['contemptuous', 'tempting'], ['tempt', 'contempt'], ['attempt', 'contemptible']]) {
    const row = rowWith(formSection(id, 'tempt'), other)
    assert.equal(row?.kind, 'unrelated', `${id} と ${other}`)
    assert.match(row.relationNote, /con＋tempt ではない/, `${id} と ${other}`)
    assert.match(row.relationNote, /temnere「軽んじる」/)
  }
  assert.equal(formSection('tempt', 'tempt').heading, 'tempt の形を含む語')
  assert.deepEqual(ids(formSection('attempt', 'tempt').siblings), ['tempt', 'temptation', 'tempting'])

  // 3画面（辞書ページ・暗記カードの裏・テストの答え）が出す「語の成り立ち」の欄。
  for (const id of contemp) {
    const html = blockHtml(id)
    assert.ok(html.includes('data-lookalike-form-section="contemp"'), id)
    assert.ok(html.includes('見分け方'), id)
    for (const other of contemp.filter((x) => x !== id)) assert.ok(html.includes(`>${getWord(other).word}<`), `${id} の画面に ${other}`)
  }
  for (const id of ['tempt', 'temptation', 'tempting', 'attempt']) {
    const html = blockHtml(id)
    assert.ok(html.includes('data-lookalike-form-section="tempt"'), id)
    // 解説の文の英単語はリンクの部品で描き、意味を添えることがあるので、タグを外した文で確かめる。
    assert.match(html.replace(/<[^>]+>/gu, ''), /con＋tempt(?:（[^）]*）)? ではない/u, id)
    assert.ok(html.includes('>contempt<'), id)
  }
  assert.match(blockHtml('contempt').replace(/<[^>]+>/gu, ''), /con＋tempt(?:（[^）]*）)? ではない/u)
  // テストの答え合わせでは見出しだけにしておき、押すと開く。
  const folded = blockHtml('contempt', { lookalikeCollapsed: true })
  assert.ok(folded.includes('つづりが似た語は同じ語源？') && !folded.includes('data-lookalike-form-row='))
})

test('形が似た組：全見出し語 8,929語から3つの決まりで拾う 5,000組の全件を読み、まとまりに載せたか、載せない理由を書いた', () => {
  assert.equal(ALL_WORDS.filter((word) => !word.custom).length, 8929)
  const pairs = lookalikeFormPairs()
  assert.equal(pairs.size, 5000)
  // 3つの決まり: 頭（接頭辞の形を除いて4文字以上同じ）・接頭辞（接頭辞の形のあとに別の見出し語）・頭に入る。
  assert.deepEqual(pairs.get('contemporary|contempt'), ['頭'])
  assert.deepEqual(pairs.get('contempt|tempt'), ['接頭辞'])
  assert.deepEqual(pairs.get('adult|adultery'), ['頭に入る'])
  // ほかの品詞の形のまとまり（tempt と temptation）と、つづり注意の洗い出しで読んだ組は除く。
  assert.equal(pairs.has('tempt|temptation'), false)

  const gaps = lookalikeFormGaps({ pairs })
  assert.equal(gaps.listed, 2664, 'まとまりに載せた組')
  assert.equal(gaps.skipped, 2336, '載せない理由を書いた組')
  assert.equal(gaps.listed + gaps.skipped, pairs.size)
  for (const key of ['undecided', 'stale', 'badCodes', 'notDisplayed', 'skipConflicts', 'forms', 'families', 'links', 'notes']) {
    assert.deepEqual(gaps[key].slice(0, 20), [], key)
  }
  // 載せない理由は、理由のある4つだけ（捨てる箱を作らない）。
  assert.deepEqual(Object.keys(LOOKALIKE_FORM_SKIP_REASONS), ['同源', '説明済', '固有', '切り方'])
  const codes = {}
  for (const code of Object.values(readLookalikeFormsSurvey().reviewed)) codes[code] = (codes[code] ?? 0) + 1
  assert.deepEqual(codes, { 同源: 1915, 説明済: 330, 切り方: 75, 固有: 16 })

  // まとまり 388（由来 916・似て見える部分だけが同じ由来 7）、由来どうしのつながり 71。
  assert.equal(lookalikeForms.length, 388)
  assert.equal(lookalikeForms.reduce((sum, entry) => sum + entry.groups.length, 0), 916)
  assert.equal(lookalikeForms.reduce((sum, entry) => sum + entry.groups.filter((group) => group.part).length, 0), 7)
  const kinds = {}
  for (const [, , kind] of LOOKALIKE_LINKS) kinds[kind] = (kinds[kind] ?? 0) + 1
  assert.deepEqual(kinds, { distant: 39, unclear: 30, unrelated: 2 })
  // 見分け方のないまとまりは、由来どうしのつながりの説明がある2つの由来のまとまりだけ。
  for (const entry of lookalikeForms.filter((item) => !item.tip)) {
    assert.equal(entry.groups.length, 2, entry.form)
    assert.ok(LOOKALIKE_LINKS.some(([a, b]) => entry.groups[0].ids.includes(a) && entry.groups[1].ids.includes(b)
      || entry.groups[0].ids.includes(b) && entry.groups[1].ids.includes(a)), entry.form)
  }

  // まとまりに入る語と同じつづりの別の見出し語（rear と rear_2）は、どちらもまとまりに入れる。
  const bySpelling = new Map()
  for (const word of ALL_WORDS.filter((item) => !item.custom)) {
    const key = word.word.toLowerCase()
    bySpelling.set(key, [...(bySpelling.get(key) ?? []), word.id])
  }
  for (const entry of lookalikeForms) {
    for (const id of entry.ids) {
      for (const other of bySpelling.get(getWord(id).word.toLowerCase())) assert.ok(entry.ids.includes(other), `${entry.form}: ${id} と ${other}`)
    }
  }
  assert.equal(lookalikeFormRelation('rear', 'rearing')?.kind, 'unrelated')
  assert.equal(lookalikeFormRelation('rear_2', 'rearing')?.kind, 'same')

  // 台帳は、読んで決めた中身（docs/audits/lookalike-forms/dec-*.tsv）から作ったものと一字ちがわない。
  const run = spawnSync(process.execPath, ['scripts/lookalike-forms-apply.mjs', '--check'], { cwd: ROOT, encoding: 'utf8' })
  assert.equal(run.status, 0, run.stderr)
})

test('単語の画面：まとまりに入る 1,666語の辞書ページ・暗記カードの裏・テストの答えに、形の似た語のまとまりが出る', () => {
  const words = new Set(lookalikeForms.flatMap((entry) => entry.ids))
  assert.equal(words.size, 1666)
  const order = { same: 0, distant: 1, unclear: 2, unrelated: 3 }
  let sectionCount = 0
  for (const id of words) {
    const word = getWord(id)
    const sections = lookalikeFormSectionsForWord(word)
    assert.ok(sections.length, id)
    sectionCount += sections.length
    for (const section of sections) {
      assert.ok(section.rows.length, `${id} ${section.form}`)
      // ほかの由来の語は、つながり（別の語源・遠い親戚・はっきりしない）と、その由来の説明を出し、近い順に並べる。
      for (const row of section.rows) {
        assert.ok(['distant', 'unclear', 'unrelated'].includes(row.kind), `${id} ${section.form}`)
        assert.ok(row.label && row.note && row.words.length, `${id} ${section.form} ${row.kind}`)
        assert.ok(!row.words.some((other) => other.id === id), `${id} ${section.form}`)
      }
      const kinds = section.rows.map((row) => order[row.kind])
      assert.deepEqual(kinds, [...kinds].sort((a, b) => a - b), `${id} ${section.form}: 近い順`)
    }
    const html = renderToStaticMarkup(h(parts.LookalikeWordSection, { word, onWord: () => {} }))
    assert.equal(count(html, 'data-lookalike-form-section='), sections.length, `${id}: まとまりの数`)
    const rows = sections.reduce((sum, section) => sum + Math.min(section.rows.length, ROW_LIMIT), 0)
    assert.equal(count(html, 'data-lookalike-form-row='), rows, `${id}: 行の数`)
    // テストの答え合わせでは見出しだけにしておき、押すと開く。
    const folded = renderToStaticMarkup(h(parts.LookalikeWordSection, { word, collapsible: true }))
    assert.ok(folded.includes('つづりが似た語は同じ語源？') && !folded.includes('data-lookalike-form-row='), `${id}: 畳んだ欄`)
  }
  assert.equal(sectionCount, lookalikeForms.reduce((sum, entry) => sum + entry.ids.length, 0))
  assert.equal(sectionCount, 1697, 'まとまりの欄の数（2つ以上のまとまりに入る語がある）')
  // 押すとその語へ移れる（語はボタン）。
  const html = renderToStaticMarkup(h(parts.LookalikeWordSection, { word: getWord('temple'), onWord: () => {} }))
  assert.match(html, /<button type="button"[^>]*>tempt<\/button>/)
  // 似て見える部分だけが同じ由来の語（over- の語どうし）は同じ由来の語として並べず、つながりも決めない。
  const overseas = lookalikeFormSectionsForWord(getWord('overseas')).find((section) => section.form === 'over')
  assert.deepEqual(overseas?.siblings, [])
  assert.equal(lookalikeFormRelation('overseas', 'oversee'), null)

  // 3画面は、語の成り立ちの欄（EtymologyBlock）の LookalikeWordSection を通して出す。
  assert.match(read('src/components/WordBits.jsx'), /<LookalikeWordSection word=\{word\} onWord=\{onWord\} collapsible=\{lookalikeCollapsed\} \/>/)
  assert.match(read('src/components/LookalikeOrigins.jsx'), /lookalikeFormSectionsForWord\(word\)/)
  const blockOf = (file) => read(file).match(/<EtymologyBlock\b[\s\S]*?\/>/)?.[0] ?? ''
  assert.match(blockOf('src/screens/WordDetail.jsx'), /onWord=\{openWord\}/)
  assert.match(blockOf('src/screens/VocabStudy.jsx'), /onWord=\{openRelatedWord\}/)
  assert.match(read('src/screens/VocabQuiz.jsx'), /<EtymologyBlock word=\{word\} lookalikeCollapsed \/>/)
})

test('食いちがい：つづり注意・語根カードの似た語の台帳と、語の成り立ちの名指しと食いちがわず、見つけた本文の誤りを直した', () => {
  // 形の似た語の台帳で決めた 4,455組のうち、ほかの台帳でも判定がある 811組が同じ判定。
  const { checked, conflicts } = lookalikeFormConflicts()
  assert.deepEqual(conflicts, [])
  assert.equal(checked, 4455)
  let both = 0
  const seen = new Set()
  for (const entry of lookalikeForms) {
    for (const a of entry.ids) {
      for (const b of entry.ids) {
        const key = [a, b].sort().join('|')
        if (a === b || seen.has(key) || !lookalikeFormRelation(a, b)) continue
        seen.add(key)
        if (lookalikeVerdicts(a, b, { forms: false }).length) both += 1
      }
    }
  }
  assert.equal(both, 811)

  // 語の成り立ち 8,929件が名指しした語（「X と同じ語源」「遠い親戚」「X とは別の語源」）のうち、台帳で判定できるもの。
  const { claims, conflicts: storyConflicts } = storyClaimConflicts()
  assert.deepEqual(storyConflicts, [])
  assert.ok(claims >= 748, `台帳で判定できた名指し ${claims}件`)
  // 直す前の本文なら食いちがいとして捕まえる。
  const before = storyClaimConflicts([
    { wordId: 'prolong', note: 'ラテン語 pro-「前へ」＋ longus「長い」→「延長する・長引かせる」。long と同じ語源。' },
    { wordId: 'longitude', note: 'ラテン語 longitūdō「長さ」から→「経度」。long と同じ語源。' },
    { wordId: 'converge', note: 'ラテン語 con-「共に」＋ vergere「傾く」→「収束する・集まる」。verge と同じ語源。' },
    { wordId: 'mineral', note: '中世ラテン語 minerale「鉱石」→「鉱物・ミネラル」。mine と同じ語源。' },
  ])
  assert.equal(before.conflicts.length, 4, before.conflicts.join('\n'))
  // 「同じ語根ではない」は名指しに数えない（adjust の juxta と just）。
  assert.match(etymologyStoryForWord('adjust').note, /just「公正な」と同じ語根ではない/)
  assert.deepEqual(storyClaimConflicts([{ wordId: 'adjust', note: etymologyStoryForWord('adjust').note }]).conflicts, [])

  // 直した本文。
  const story = (id) => etymologyStoryForWord(id)?.note ?? ''
  for (const id of ['prolong', 'longitude']) {
    assert.match(story(id), /英語の long（長い）とは、同じ古い語から分かれた遠い親戚/, id)
    assert.doesNotMatch(story(id), /long と同じ語源/, id)
  }
  assert.match(story('converge'), /diverge と同じ語源。verge（縁・間際、ラテン語 virga「小枝」から）とは別の語源/)
  assert.match(story('mineral'), /undermine と同じ語源。「私のもの」の mine とは関係ない/)
  for (const id of ['simultaneously', 'assemble']) {
    assert.match(story(id), /similar（似た）の元のラテン語 similis とは、同じ古い語根から来た遠い親戚/, id)
    assert.doesNotMatch(story(id), /similar と同じ語源/, id)
  }
  assert.match(story('pond'), /家畜を入れておく囲いを表す pound と同じ語源で、重さの単位の pound（ポンド）とは別の語/)
  assert.match(story('ponder'), /重さの単位の pound（ポンド）と同じ語源/)
  assert.match(story('foremost'), /古英語 formest/)
  assert.doesNotMatch(story('foremost'), /^fore「前」＋ most/)
  assert.match(story('wander'), /「巻く・曲がりくねる」の wind と同じ語源で、「風」の wind とは別の語/)
})
