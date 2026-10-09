#!/usr/bin/env node
// 古典・漢文以外の16教材で、古典の難関・最難関のような段・コースの重なりと、項目の重複を数える
// （requests/2026-10-02-koten-level-merge.json の other-level-structure・other-item-duplicates）。
//   ① 段の作り：教材ごとの段・単元の軸（英語の級、数学の単元と入試演習の基礎・標準、社会・理科の単元と演習の基礎・標準・入試など）で、
//      各項目がちょうど1つの決まった値を持つか（id の重なり・決まっていない値）と、軸ごとの件数。1つ下を含む積み上げのコースは、
//      アプリでは古典の学年・目標別コースだけで（2026-10-02 に4コースへ統合）、ほかの教材は段ごとに項目を分けるだけ
//   ② 項目の重複：見出し・問題文・本文の一致と、物差しを広げた候補（英単語のつづりの違い・複数形・つづりが近く意味が同じ語、
//      熟語の言い方の違いと含む関係、英文法の同じ設問・同じ完成文、語源の同じ形の語根、演習・数学の同じ問題、教材をまたぐ同じ語句）
//      を拾い、OTHER_PAIRS（2026-10-02 に1組ずつ読んで決めた分け方）で次のどれかにする
//        duplicate … 同じ項目の二重登録　　form … 同じ語の別の形（つづり・複数形・目的語の有無・同じ表現を別の項目でも教える）
//        same      … 教材をまたいで同じ語句を学ぶ組（社会と理科の両方の教科書に出る語句など）
//        different … 別の項目（理由の印：homograph 同じつづりの別の語／similar 意味が近い別の語／derived 派生語・関連語／
//                    pattern 同じ形を使う別の表現・別の狙いの問題／root 同じ形の別の語根／spelling つづりが似た別の語）
// ①の誤りと、②で分け方を決めていない組があれば失敗する。②の二重登録・別の形は数えて報告する（整理するかは利用者が決める）。
// 使い方: node scripts/checks/content-overlap-survey.mjs [--json]
import { fileURLToPath } from 'node:url'
import { LEARNING_CONTENTS } from '../../src/lib/learningContentProgress.js'
import { LEVELS, READING_LEVELS } from '../../src/data/levels.js'
import { MATH_UNITS, MATH_PROBLEMS } from '../../src/data/math.js'
import { MATH_EXAM_LEVELS } from '../../src/data/math-exam.js'
import { PRACTICE_LEVELS } from '../../src/data/subjects/meta.js'
import { ALL_SUBJECT_UNITS } from '../../src/data/subjects/index.js'
import { KNOWN_DUPLICATE_FORMS, PLURAL_ONLY_SENSES, singularCandidates } from '../../src/data/duplicate-forms.js'

const CLASSICS = new Set(['koten-vocab', 'koten-grammar', 'koten-culture', 'koten-reading', 'kanbun-vocab', 'kanbun-grammar', 'kanbun-culture', 'kanbun-kundoku'])
const CONTENTS = LEARNING_CONTENTS.filter((content) => !CLASSICS.has(content.id))
const byId = Object.fromEntries(CONTENTS.map((content) => [content.id, content]))

const text = (value) => (typeof value === 'string' ? value : JSON.stringify(value ?? ''))
const norm = (value) => String(value ?? '').toLowerCase().replace(/[‘’]/gu, "'").replace(/[\s　]+/gu, ' ')
  .replace(/[.,!?;:"“”()（）［］[\]「」『』、。・…~〜]/gu, '').trim()
const meaningTokens = (meanings) => new Set(meanings.flatMap((meaning) => String(meaning ?? '').replace(/[（(][^）)]*[）)]/gu, '')
  .split(/[・、／,;]/u)).map((token) => token.trim()).filter((token) => token.length >= 2))
const sharedMeanings = (a, b) => {
  const left = meaningTokens(a.meanings ?? [a.meaning])
  return [...meaningTokens(b.meanings ?? [b.meaning])].filter((token) => left.has(token))
}
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]
}

// ---- ① 段の作り ----

const mathUnitOf = new Map(Object.entries(MATH_PROBLEMS).flatMap(([unit, problems]) => problems.map((problem) => [problem.id, unit])))
const subjectUnitIds = new Set(ALL_SUBJECT_UNITS.map((unit) => unit.id))
const levelIds = LEVELS.map((level) => level.id)
const readingLevelIds = READING_LEVELS.map((level) => level.id)

/** 教材ごとの段・単元の軸。values は決まった値の並び（無いものは空でない文字列であればよい）。 */
const AXES = {
  vocab: [{ name: '級', of: (item) => item.level, values: levelIds }, { name: '分野', of: (item) => item.field }],
  usage: [{ name: '級', of: (item) => item.level, values: levelIds }, { name: '熟語・構文', of: (item) => item.kind, values: ['idiom', 'syntax'] }],
  grammar: [{ name: '級', of: (item) => item.level, values: levelIds }, { name: '単元', of: (item) => item.topic }],
  listening: [{ name: '級', of: (item) => item.level, values: readingLevelIds }],
  dictation: [{ name: '級', of: (item) => item.level, values: levelIds }],
  etymology: [{ name: '語根', of: (item) => item.rootId }],
  reading: [{ name: '級', of: (item) => item.level, values: readingLevelIds }],
  writing: [{ name: '級', of: (item) => item.level, values: levelIds }],
  literature: [{ name: '種類', of: (item) => item.kind, values: ['english', 'classical', 'kanbun'] }, { name: '難しさの目安', of: (item) => item.level }],
  math: [{ name: '単元', of: (item) => mathUnitOf.get(item.id), values: MATH_UNITS.map((unit) => unit.id) }],
  'math-history': [{ name: '部', of: (item) => item.part, values: ['basic', 'junior', 'senior'] }],
  'math-exam': [{ name: '段', of: (item) => item.level, values: Object.keys(MATH_EXAM_LEVELS) }, { name: '単元', of: (item) => item.unit, values: MATH_UNITS.map((unit) => unit.id) }],
  'social-terms': [{ name: '単元', of: (item) => item.unitId, values: [...subjectUnitIds] }],
  'social-practice': [{ name: '段', of: (item) => item.level, values: Object.keys(PRACTICE_LEVELS) }, { name: '単元', of: (item) => item.unitId, values: [...subjectUnitIds] }],
  'science-terms': [{ name: '単元', of: (item) => item.unitId, values: [...subjectUnitIds] }],
  'science-practice': [{ name: '段', of: (item) => item.level, values: Object.keys(PRACTICE_LEVELS) }, { name: '単元', of: (item) => item.unitId, values: [...subjectUnitIds] }],
}

function levelStructure() {
  return CONTENTS.map((content) => {
    const ids = content.items.map((item) => item.id)
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
    const axes = (AXES[content.id] ?? []).map((axis) => {
      const counts = {}
      const bad = []
      for (const item of content.items) {
        const value = axis.of(item)
        if (typeof value !== 'string' || !value || (axis.values && !axis.values.includes(value))) bad.push(`${item.id}（${text(value)}）`)
        else counts[value] = (counts[value] ?? 0) + 1
      }
      return { name: axis.name, tiers: Object.keys(counts).length, counts, bad }
    })
    return { id: content.id, label: content.label, total: content.items.length, duplicateIds, axes }
  })
}

// ---- ② 項目の重複 ----

function pairsFrom(groups) {
  const pairs = []
  for (const list of groups) {
    const unique = [...new Map(list.map((item) => [item.id, item])).values()]
    for (let i = 0; i < unique.length; i++) for (let j = i + 1; j < unique.length; j++) pairs.push([unique[i], unique[j]])
  }
  return pairs
}
function sameKey(items, keyOf) {
  const index = new Map()
  for (const item of items) {
    for (const key of [keyOf(item)].flat()) {
      if (!key) continue
      if (!index.has(key)) index.set(key, [])
      index.get(key).push(item)
    }
  }
  return pairsFrom([...index.values()].filter((list) => list.length > 1))
}

const vocab = byId.vocab.items
const vocabByWord = new Map()
for (const word of vocab) {
  const key = word.word.toLowerCase()
  if (!vocabByWord.has(key)) vocabByWord.set(key, [])
  vocabByWord.get(key).push(word)
}
// つづりの英米の違い・ハイフン・空白の決まった書きかえ。書きかえた形が見出しにあれば候補にする。
const SPELLING_RULES = [
  [/our(s|ed|ing|ite|ful|less)?$/u, 'or$1'], [/our(?=[a-z])/u, 'or'], [/ise(s|d)?$/u, 'ize$1'], [/ising$/u, 'izing'], [/isation(s)?$/u, 'ization$1'],
  [/yse(s|d)?$/u, 'yze$1'], [/ysing$/u, 'yzing'], [/tre(s)?$/u, 'ter$1'], [/bre(s)?$/u, 'ber$1'], [/logue(s)?$/u, 'log$1'], [/gramme(s)?$/u, 'gram$1'],
  [/ence$/u, 'ense'], [/lled$/u, 'led'], [/lling$/u, 'ling'], [/ller$/u, 'ler'], [/^ae/u, 'e'], [/([a-z])ae([a-z])/u, '$1e$2'], [/([a-z])oe([a-z])/u, '$1e$2'],
  [/gement(s)?$/u, 'gment$1'], [/^grey/u, 'gray'], [/wards$/u, 'ward'], [/amongst$/u, 'among'], [/amidst$/u, 'amid'], [/whilst$/u, 'while'],
  [/rnt$/u, 'rned'], [/lt$/u, 'lled'], [/eable$/u, 'able'], [/ogue$/u, 'og'], [/ce$/u, 'se'], [/xion$/u, 'ction'], [/ey$/u, 'y'], [/-/gu, ''], [/ /gu, ''],
]
function vocabSpellingPairs() {
  const pairs = []
  for (const word of vocab) {
    const spelling = word.word.toLowerCase()
    for (const [pattern, replacement] of SPELLING_RULES) {
      if (!pattern.test(spelling)) continue
      const other = spelling.replace(pattern, replacement)
      if (other !== spelling) for (const match of vocabByWord.get(other) ?? []) pairs.push([word, match])
    }
  }
  return pairs
}
function vocabNearPairs() {
  const byToken = new Map()
  for (const word of vocab) for (const token of meaningTokens(word.meanings ?? [word.meaning])) {
    if (!byToken.has(token)) byToken.set(token, [])
    byToken.get(token).push(word)
  }
  const pairs = []
  for (const list of byToken.values()) {
    if (list.length > 200) continue
    for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
      const a = list[i].word.toLowerCase()
      const b = list[j].word.toLowerCase()
      if (a !== b && Math.min(a.length, b.length) >= 4 && distance(a, b) <= 2) pairs.push([list[i], list[j]])
    }
  }
  return pairs
}
function vocabPluralPairs() {
  const pairs = []
  for (const word of vocab) for (const singular of singularCandidates(word.word)) {
    for (const base of vocabByWord.get(singular) ?? []) if (base !== word && sharedMeanings(base, word).length) pairs.push([base, word])
  }
  return pairs
}

const usage = byId.usage.items
const usageNorm = (phrase) => norm(phrase).replace(/\b(one's|someone's|somebody's|sb's|sth|sb|someone|somebody|something|one|oneself|a|b|do|doing|to do|~ing)\b/gu, '').replace(/\s+/gu, ' ').trim()
function usageContainsPairs() {
  const pairs = []
  for (const a of usage) for (const b of usage) {
    if (a === b) continue
    const short = ` ${norm(a.phrase)} `
    const long = ` ${norm(b.phrase)} `
    if (short.length >= 6 && long.length > short.length && long.includes(short) && sharedMeanings(a, b).length) pairs.push([a, b])
  }
  return pairs
}

const grammar = byId.grammar.items
const isInstruction = (question) => !/_{2,}|＿/u.test(text(question))
const termKey = (term) => norm(String(term ?? '').replace(/[（(][^）)]*[）)]/gu, '')).replace(/ー$/u, '')

/** 拾う物差し（教材ごと・教材をまたぐもの）。 */
export const OVERLAP_SETS = [
  {
    id: 'vocab', label: '英単語', title: (item) => item.word,
    measures: {
      同じつづり: () => sameKey(vocab, (item) => item.word.toLowerCase()),
      つづりの英米・ハイフン・空白: vocabSpellingPairs,
      つづりが近く同じ訳語: vocabNearPairs,
      複数形と元の語: vocabPluralPairs,
    },
    // 同じつづりで id に _2 などが付く組は、同じつづりの別の語として別に立てた見出し（homograph-words.js）。
    rule: (a, b, measures) => (measures.length === 1 && measures[0] === '同じつづり' && (/_\d+$/u.test(a.id) || /_\d+$/u.test(b.id))
      ? { kind: 'different', why: 'homograph' } : undefined),
  },
  {
    id: 'usage', label: '熟語・構文', title: (item) => item.phrase,
    measures: {
      見出しの一致: () => sameKey(usage, (item) => norm(item.phrase)),
      言い方をそろえて同じ: () => sameKey(usage, (item) => usageNorm(item.phrase)),
      一方を含み意味が同じ: usageContainsPairs,
    },
  },
  {
    id: 'grammar', label: '英文法', title: (item) => (isInstruction(item.q) ? `［並べ替え］${text(item.answer)}` : text(item.q)),
    measures: {
      同じ設問: () => sameKey(grammar.filter((item) => !isInstruction(item.q)), (item) => norm(text(item.q))),
      同じ完成文: () => sameKey(grammar, (item) => norm(item.sentence?.en ?? (isInstruction(item.q) ? text(item.answer) : ''))),
    },
  },
  {
    id: 'listening', label: 'リスニング', title: (item) => text(item.question),
    measures: {
      同じ音声: () => sameKey(byId.listening.items, (item) => norm(text(item.audio))),
      同じ設問と選択肢: () => sameKey(byId.listening.items, (item) => norm(text(item.question) + text(item.choices))),
    },
  },
  { id: 'dictation', label: 'ディクテーション', title: (item) => item.text, measures: { 同じ本文: () => sameKey(byId.dictation.items, (item) => norm(item.text)) } },
  {
    id: 'etymology', label: '語源', title: (item) => `${item.rootForm}（${item.rootMeaning}）`,
    measures: {
      同じ形の語根: () => sameKey(byId.etymology.items, (item) => String(item.rootForm ?? '').split(/[/,・\s]+/u).map((form) => form.replace(/[-–]/gu, '').toLowerCase()).filter(Boolean)),
    },
  },
  {
    id: 'reading', label: '英語長文', title: (item) => item.title,
    measures: {
      同じ題名: () => sameKey(byId.reading.items, (item) => norm(item.title)),
      同じ最初の文: () => sameKey(byId.reading.items, (item) => norm(text(item.sentences?.[0]?.en ?? item.sentences?.[0]))),
    },
  },
  { id: 'writing', label: '英作文', title: (item) => item.title, measures: { 同じ題名・課題: () => sameKey(byId.writing.items, (item) => [norm(item.title), norm(text(item.task))]) } },
  { id: 'literature', label: '名作に親しむ', title: (item) => item.title, measures: { 同じ題名: () => sameKey(byId.literature.items, (item) => norm(item.title)) } },
  { id: 'math', label: '数学', title: (item) => text(item.text).slice(0, 30), measures: { 同じ問題: () => sameKey(byId.math.items, (item) => norm(text(item.text) + text(item.answer))) } },
  {
    id: 'math-history', label: '数学の歴史', title: (item) => item.title ?? text(item.question).slice(0, 30),
    measures: {
      同じ題名: () => sameKey(byId['math-history'].items, (item) => norm(item.title)),
      同じ問題: () => sameKey(byId['math-history'].quizItems, (item) => norm(text(item.question) + text(item.choices))),
    },
  },
  {
    id: 'math-exam', label: '数学の入試演習', title: (item) => item.id,
    measures: { 同じ問題: () => sameKey(byId['math-exam'].items, (item) => norm(text(item.text) + text(item.math) + text(item.parts) + text(item.boxes))) },
  },
  ...['social-terms', 'science-terms'].map((id) => ({
    id, label: byId[id].label, title: (item) => `${item.term}（${item.unitId}）`,
    measures: { 同じ語句: () => sameKey(byId[id].items, (item) => termKey(item.term)) },
  })),
  ...['social-practice', 'science-practice'].map((id) => ({
    id, label: byId[id].label, title: (item) => `${item.id}`,
    measures: { 同じ問題: () => sameKey(byId[id].items, (item) => norm(text(item.text) + text(item.figure) + text(item.choices) + text(item.items) + text(item.answer))) },
  })),
  {
    id: 'vocab-usage', label: '英単語 × 熟語・構文', title: (item) => item.word ?? item.phrase,
    measures: {
      同じ見出し: () => {
        const phrases = new Map(usage.map((item) => [norm(item.phrase), item]))
        return vocab.filter((word) => phrases.has(norm(word.word))).map((word) => [word, phrases.get(norm(word.word))])
      },
    },
  },
  {
    id: 'social-science-terms', label: '社会の語句 × 理科の語句', title: (item) => `${item.term}（${item.unitId}）`,
    measures: {
      同じ語句: () => {
        const science = new Map(byId['science-terms'].items.map((item) => [termKey(item.term), item]))
        return byId['social-terms'].items.filter((item) => science.has(termKey(item.term))).map((item) => [item, science.get(termKey(item.term))])
      },
    },
  },
  {
    id: 'listening-dictation', label: 'リスニング × ディクテーション', title: (item) => item.id,
    measures: {
      同じ文: () => byId.listening.items.flatMap((item) => byId.dictation.items
        .filter((dictation) => norm(dictation.text).length > 20 && norm(text(item.audio)).includes(norm(dictation.text))).map((dictation) => [item, dictation])),
    },
  },
  {
    id: 'math-mathexam', label: '数学 × 数学の入試演習', title: (item) => item.id,
    measures: {
      同じ問題: () => {
        const exam = new Map(byId['math-exam'].items.map((item) => [norm(text(item.math)), item]).filter(([key]) => key.length > 5))
        return byId.math.items.filter((item) => exam.has(norm(text(item.text)))).map((item) => [item, exam.get(norm(text(item.text)))])
      },
    },
  },
]

const D = (kind, why, note) => ({ kind, why, ...(note ? { note } : {}) })
const dup = (note) => D('duplicate', 'duplicate', note)
const form = (note) => D('form', 'form', note)
const diff = (why, note) => D('different', why, note)
const same = (note) => D('same', 'same', note)

// 拾った組の分け方（2026-10-02 に1組ずつ読んで決めた）。キーは「物差しの組の id:id|id」（id は文字の順）。
export const OTHER_PAIRS = {
  // ── 英単語：同じ語の別の形 ──
  'vocab:acknowledgement|acknowledgment': form('つづりの違い（acknowledgement と acknowledgment）だけの同じ語を2つの見出しで登録。どちらも準1級・名詞で、意味も「承認・認めること・謝辞」で同じ'),
  'vocab:claim|claims': form('複数形 claims（準1級・名詞「主張・請求」）の見出し。claim（3級）が名詞の「主張」を持ち、「請求」も単数の claim の意味で、複数形だけの意味はない'),
  'vocab:demand|demands': form('複数形 demands（準1級・名詞「要求・需要」）の見出し。demand（2級）が名詞の「需要」を持ち、「要求」も単数の demand の意味で、複数形だけの意味はない'),
  'vocab:notice|notices': form('複数形 notices（準1級・名詞「通知・掲示・注目」）の見出し。notice（4級）が名詞の「通知・掲示」を持ち、複数形だけの意味はない'),
  'vocab:corrupt|corrupted': form('corrupted は動詞 corrupt の過去分詞からの形容詞。「腐敗した」は形容詞 corrupt（2級）と重なり、「（ファイルが）破損した」はこの形で使う'),
  'vocab:grape|grapes': form('単数形と複数形（どちらも5級）。KNOWN_DUPLICATE_FORMS に、英検1900語の収録は grapes で消せないと理由を書いて残してある'),
  'vocab:sock|socks': form('単数形 sock（5級）と複数形 socks（4級）。KNOWN_DUPLICATE_FORMS に、英検1900語の収録は socks・長文は sock で両方要ると理由を書いて残してある'),
  // ── 英単語：複数形だけの意味を持つ別の見出し（PLURAL_ONLY_SENSES に理由あり） ──
  'vocab:brain|brains': diff('derived', 'brains は「知力・頭のよさ」。単数の brain は器官の「脳」'),
  'vocab:ethic|ethics': diff('derived', 'ethics は学問名の「倫理学」。an ethic は「道徳原則」'),
  // ── 英単語：つづりが似た別の語 ──
  'vocab:rice|rise': diff('spelling'), 'vocab:prey|pry': diff('spelling'), 'vocab:prey|pry_2': diff('spelling'), 'vocab:morning|mourning': diff('spelling'), 'vocab:for|four': diff('spelling'), 'vocab:or|our': diff('spelling'), 'vocab:pet|poet': diff('spelling'), 'vocab:forth|fourth': diff('spelling'), 'vocab:coat|court': diff('spelling'), 'vocab:code|cord': diff('spelling'),
  // ── 英単語：派生語・関連語（品詞や意味の幅が違う別の語） ──
  'vocab:advice|advise': diff('derived'), 'vocab:device|devise': diff('derived'), 'vocab:mere|merely': diff('derived'), 'vocab:enforce|force': diff('derived'),
  'vocab:resolve|solve': diff('derived'), 'vocab:sign|signal': diff('derived'), 'vocab:confident|confidently': diff('derived'), 'vocab:nation|national': diff('derived'),
  'vocab:assure|reassure': diff('derived'), 'vocab:await|wait': diff('derived'), 'vocab:scant|scanty': diff('derived'), 'vocab:minimal|minimum': diff('derived'),
  'vocab:ancestor|ancestry': diff('derived'), 'vocab:resolution|solution': diff('derived'), 'vocab:conciliation|reconciliation': diff('derived'), 'vocab:acid|acidic': diff('derived'),
  'vocab:allure|lure': diff('derived'), 'vocab:emigrate|migrate': diff('derived'), 'vocab:resonant|resonate': diff('derived'), 'vocab:secrecy|secret': diff('derived'),
  'vocab:emigration|migration': diff('derived'), 'vocab:converge|convergent': diff('derived'), 'vocab:form|format': diff('derived'), 'vocab:electric|electrical': diff('derived'),
  'vocab:direction|director': diff('derived'), 'vocab:near|nearby': diff('derived'),
  // ── 英単語：意味が近い別の語 ──
  'vocab:adverse|reverse': diff('similar'), 'vocab:compose|comprise': diff('similar'), 'vocab:rebut|refute': diff('similar'), 'vocab:attend|tend_2': diff('similar'),
  'vocab:expand|extend': diff('similar'), 'vocab:bicycle|cycle': diff('similar'), 'vocab:pace|rate': diff('similar'), 'vocab:barely|hardly': diff('similar'),
  'vocab:although|though': diff('similar'), 'vocab:coerce|force': diff('similar'), 'vocab:carry|cart': diff('similar'), 'vocab:assure|ensure': diff('similar'),
  'vocab:acute|astute': diff('similar'), 'vocab:contend|contest': diff('similar'), 'vocab:certify|testify': diff('similar'), 'vocab:garner|gather': diff('similar'),
  'vocab:affable|amiable': diff('similar'), 'vocab:earn|gain': diff('similar'), 'vocab:elect|select': diff('similar'), 'vocab:section|sector': diff('similar'),
  'vocab:insulate|isolate': diff('similar'), 'vocab:fragile|frail': diff('similar'), 'vocab:alarm|alert': diff('similar'), 'vocab:convene|converge': diff('similar'),
  'vocab:fake|false': diff('similar'), 'vocab:gallant|valiant': diff('similar'), 'vocab:empathy|sympathy': diff('similar'), 'vocab:empathize|sympathize': diff('similar'),
  'vocab:solid|sound_2': diff('similar'), 'vocab:emigrant|immigrant': diff('similar'), 'vocab:emigration|immigration': diff('similar'), 'vocab:dash|rush': diff('similar'),
  'vocab:teeter|totter': diff('similar'), 'vocab:groan|moan': diff('similar'), 'vocab:dramatically|drastically': diff('similar'), 'vocab:horrify|terrify': diff('similar'),
  'vocab:oppression|suppression': diff('similar'), 'vocab:oppression|repression': diff('similar'), 'vocab:lumber|timber': diff('similar'), 'vocab:clash|crash': diff('similar'),
  'vocab:oppress|suppress': diff('similar'), 'vocab:oppress|repress': diff('similar'), 'vocab:duplicate|replicate': diff('similar'), 'vocab:inflow|influx': diff('similar'),
  'vocab:avert|divert': diff('similar'), 'vocab:elusive|evasive': diff('similar'), 'vocab:duplication|replication': diff('similar'), 'vocab:horrifying|terrifying': diff('similar'),
  'vocab:definite|definitive': diff('similar'), 'vocab:brighten|lighten': diff('similar'), 'vocab:constriction|contraction': diff('similar'), 'vocab:dependence|dependency': diff('similar'),
  'vocab:horror|terror': diff('similar'), 'vocab:expansion|extension': diff('similar'), 'vocab:fragility|frailty': diff('similar'), 'vocab:gape|gawk': diff('similar'),
  'vocab:avenge|revenge': diff('similar'), 'vocab:highly|hugely': diff('similar'), 'vocab:inequality|inequity': diff('similar'), 'vocab:stain|taint': diff('similar'),
  'vocab:innovate|renovate': diff('similar'), 'vocab:bump|lump': diff('similar'), 'vocab:civic|civil': diff('similar'), 'vocab:humankind|mankind': diff('similar'),
  'vocab:jagged|ragged': diff('similar'), 'vocab:florid|lurid': diff('similar'), 'vocab:blink|wink': diff('similar'), 'vocab:cage|crate': diff('similar'),
  'vocab:icon|idol': diff('similar'), 'vocab:scour_2|scrub': diff('similar'), 'vocab:slide|slip': diff('similar'), 'vocab:billion|trillion': diff('similar'),
  'vocab:whip|whisk': diff('similar'), 'vocab:frantic|frenetic': diff('similar'),
  // ── 熟語・構文 ──
  'usage:curr1900_idm_5_keep_on_blanking|exam_idm_keep_on': dup('同じ熟語（keep on doing「〜し続ける」）を、keep on（3級）と keep on ~ing（5級）の2つの見出しで登録。意味も例文（He kept on asking the same question.）も同じ。英検1900語の熟語の一覧が keep on ~ing を、試験の熟語の一覧が keep on を名指ししている'),
  'usage:curr1900_idm_3_help_a_with_b|exam_idm_help_with': form('目的語 A の有無だけが違う同じ熟語（help with「〜を手伝う」4級、help A with B「AのBを手伝う」3級）'),
  'usage:curr1900_idm_pre2_turn_a_into_b|curr_idm_pre2_turn_into': form('turn into（準2級）の意味に「変える」もあり、turn A into B（準2級「AをBに変える」）と重なる'),
  'usage:curr1900_idm_2_generally_speaking|curr_syn_gr_auto_pre1_participle_idiom_001': form('熟語 generally speaking（2級）を、分詞構文の慣用表現の構文（準1級の例文の項目）でもう一度教える'),
  'usage:curr1900_idm_pre2_take_ones_place|idm_take_place': diff('pattern', 'take place「行われる」と take one\'s place「代わりをする」'),
  'usage:curr1900_idm_pre1_blank_so_that_blank|syn_so_that': diff('pattern', '「…, so that ～（その結果）」と「so … that ～（とても…なので～）」'),
  'usage:curr1900_idm_2_in_order|exam_syn_in_order_to_do': diff('pattern', '「in order（順序よく）」と「in order to do（～するために）」'),
  'usage:curr_idm_2_do_without|exam_syn_without_doing': diff('pattern', '「do without（～なしで済ませる）」と「without doing（～せずに）」'),
  'usage:curr_idm_pre1_refer_a_to_b|exam_idm_refer_to': diff('pattern', '「refer to（～を指す）」と「refer A to B（AをBに照会する）」で意味が違う'),
  'usage:curr1900_idm_2_derive_from|exam_syn_derive_a_from_b': diff('pattern', '「derive from（～に由来する）」と「derive A from B（AをBから得る）」で意味が違う'),
  'usage:curr1900_idm_pre1_something_of_a|curr_idm_4_one_of': diff('pattern'),
  'usage:curr1900_idm_pre2_adjust_a_to_b|curr_idm_2_adjust_to': diff('pattern', '「adjust to（～に順応する）」と「adjust A to B（AをBに合わせる）」で意味が違う'),
  'usage:curr_idm_1_subject_a_to_b|curr_idm_pre1_subject_to': diff('pattern', '「subject to（～を条件として）」と「subject A to B（AをBにさらす）」で意味が違う'),
  'usage:curr1900_idm_pre1_not_so_much_a_as_b|curr1900_idm_pre1_not_so_much_as_do': diff('pattern'),
  'usage:curr1900_idm_pre1_of_ones_own|curr1900_idm_pre1_of_ones_own_doing': diff('pattern', '「of one\'s own（自分自身の）」と「of one\'s own doing（自分自身が招いた）」'),
  'usage:curr1900_idm_pre2_remember_doing|curr1900_idm_pre2_remember_to_do': diff('pattern', '「remember doing（～したことを覚えている）」と「remember to do（忘れずに～する）」'),
  'usage:curr_idm_5_after_school|curr_syn_gr_auto_5_wh_001': diff('pattern', '疑問詞の構文の例文の中に after school が出るだけ'),
  'usage:curr_idm_2_in_practice|curr_syn_gr_auto_2_partial_negation_001': diff('pattern', '部分否定の構文の例文の中に in practice が出るだけ'),
  'usage:curr_idm_2_take_to|jr_idm_take_a_to_b': diff('pattern', '「take to（～を好きになる）」と「take A to B（AをBに連れて行く）」で意味が違う'),
  'usage:curr1900_idm_3_enjoy_oneself|jr_idm_enjoy_doing': diff('pattern', '「enjoy oneself（楽しく過ごす）」と「enjoy doing（～して楽しむ）」'),
  'usage:curr1900_idm_2_put_in|jr_idm_put_a_in_b': diff('pattern', '「put in（提出する・注ぎ込む）」と「put A in B（AをBに入れる）」で意味が違う'),
  'usage:jr_idm_try_doing|jr_idm_try_to_do': diff('pattern', '「try doing（試しに～してみる）」と「try to do（～しようとする）」'),
  'usage:jr_idm_what_a_blank|jr_idm_what_to_do': diff('pattern', '感嘆文の「What a ～!（なんて～なのだろう）」と「what to do（何を～すればよいか）」'),
  // ── 英文法 ──
  'grammar:gr_pre2_pron_3|gr_unit_us_pre2_pronoun_02': dup('同じ問題（「;」と「.」だけ違う）を2つ登録。どちらも準2級・代名詞で、選択肢も答え（the other）も同じ。一方は文法の参考書の単元の問題'),
  'grammar:gr_unit_wo_4_pronoun_02|gr_unit_wo_pre2_pronoun_01': dup('同じ並べ替えの問題（One is white and the other is black.、読点だけ違う）を4級と準2級の代名詞の単元に登録。解説も同じ'),
  'grammar:gr_depth_1_opt_02|gr_unit_wo_1_optative_01': form('同じ文（May all your efforts be rewarded.）を、穴埋めと並べ替えの2つの形式で問う（どちらも1級・祈願文）'),
  'grammar:gr_pre2_part_3|gr_unit_us_pre2_causative_03': diff('pattern', '同じ文で、分詞（calling）と知覚動詞＋原形（call）の別の狙いを問う。選択肢に互いの答えは入っていない'),
  'grammar:gr_3_rel_4|gr_unit_ch_5_pronoun_02': diff('pattern', '関係代名詞 whose（3級）と代名詞 Its（5級）の別の問題'),
  // ── 語源：同じ形の別の語根 ──
  'etymology:root:cord|root:pf-com': diff('root', 'cor「心」と接頭辞 cor-「共に」'),
  'etymology:root:cura|root:curr': diff('root', 'cura「世話」と currere「走る」'),
  'etymology:root:pare|root:pear': diff('root', 'parare「整える」と parere「現れる」'),
  'etymology:root:pass|root:pati': diff('root', 'passus「歩み」と pati「耐える」'),
  'etymology:root:serv|root:servire': diff('root', 'servare「守る」と servire「仕える」'),
  'etymology:root:terr|root:terrere': diff('root', 'terra「土地」と terrere「怖がらせる」'),
  'etymology:root:her|root:heres': diff('root', 'haerere「くっつく」と heres「相続人」'),
  'etymology:root:ge-un|root:uni': diff('root', '否定の un- と unus「1つ」'),
  'etymology:root:ge-en|root:pf-in-into': diff('root', '動詞を作る -en と接頭辞 en-「中へ」'),
  'etymology:root:acu|root:pf-ad': diff('root', 'acus「鋭い」と接頭辞 ac-（ad-）「～の方へ」'),
  'etymology:root:dies|root:pf-dis': diff('root', 'dies「日」と接頭辞 di-（dis-）「離れて」'),
  'etymology:root:pf-in-into|root:pf-in-not': diff('root', '接頭辞 in-「中へ」と in-「～でない」'),
  // ── 社会の語句 × 理科の語句：両方の教科書で学ぶ語句（季節風・酸性雨・地球温暖化・リサイクルなど） ──
  'social-science-terms:geo-04-t01|sc2-12-t02': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-05-t03|sc2-12-t01': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-05-t10|sc3-16-t06': same('社会と理科の両方の教科書に出る語句'),
  'social-science-terms:geo-11-t07|sc3-14-t11': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-11-t10|sc3-15-t07': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-12-t05|sc3-15-t09': same('社会と理科の両方の教科書に出る語句'),
  'social-science-terms:geo-14-t10|sc3-14-t05': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-19-t01|sc3-16-t07': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:geo-19-t02|sc3-16-t08': same('社会と理科の両方の教科書に出る語句'),
  'social-science-terms:civ-01-t04|sc3-15-t11': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-14-t05|sc3-16-t09': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-14-t07|sc3-16-t10': same('社会と理科の両方の教科書に出る語句'),
  'social-science-terms:civ-14-t08|sc3-16-t11': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-14-t09|sc3-16-t12': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-14-t11|sc3-15-t10': same('社会と理科の両方の教科書に出る語句'),
  'social-science-terms:civ-16-t01|sc3-16-t03': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-16-t02|sc3-16-t02': same('社会と理科の両方の教科書に出る語句'), 'social-science-terms:civ-16-t05|sc3-15-t04': same('社会と理科の両方の教科書に出る語句'),
}

/** 物差しを広げた重複の調べの結果。 */
export function surveyOtherOverlaps() {
  const sets = OVERLAP_SETS.map((set) => {
    const pairs = new Map()
    for (const [measure, collect] of Object.entries(set.measures)) {
      for (const [a, b] of collect()) {
        const [first, second] = a.id < b.id ? [a, b] : [b, a]
        const key = `${set.id}:${first.id}|${second.id}`
        if (first.id === second.id && set.id.includes('-') === false) continue
        if (!pairs.has(key)) pairs.set(key, { key, a: first, b: second, measures: new Set() })
        pairs.get(key).measures.add(measure)
      }
    }
    const list = [...pairs.values()].map((pair) => ({ ...pair, decision: OTHER_PAIRS[pair.key] ?? set.rule?.(pair.a, pair.b, [...pair.measures]) }))
    const label = (pair) => `${pair.key}（${set.title(pair.a)} × ${set.title(pair.b)}、${[...pair.measures].join('・')}）`
    const of = (kind) => list.filter((pair) => pair.decision?.kind === kind)
    const describe = (pair) => ({ key: pair.key, a: set.title(pair.a), b: set.title(pair.b), aLevel: pair.a.level ?? pair.a.unitId ?? '', bLevel: pair.b.level ?? pair.b.unitId ?? '', note: pair.decision.note ?? '' })
    return {
      id: set.id,
      label: set.label,
      candidates: list.length,
      duplicate: of('duplicate').map(describe),
      form: of('form').map(describe),
      same: of('same').map(describe),
      different: of('different').length,
      differentBy: of('different').reduce((counts, pair) => ({ ...counts, [pair.decision.why]: (counts[pair.decision.why] ?? 0) + 1 }), {}),
      unclassified: list.filter((pair) => !pair.decision).map(label),
      keys: list.map((pair) => pair.key),
    }
  })
  const keys = new Set(sets.flatMap((set) => set.keys))
  const stale = Object.keys(OTHER_PAIRS).filter((key) => !keys.has(key))
  return {
    sets: sets.map(({ keys: _keys, ...rest }) => rest),
    problems: [
      ...sets.flatMap((set) => set.unclassified.map((textValue) => `${set.label}: 分け方を決めていない組 ${textValue}`)),
      ...stale.map((key) => `OTHER_PAIRS: 候補にない組 ${key}（データが変わったら読み直す）`),
    ],
  }
}

/** ①と②をまとめた結果。 */
export function surveyContentOverlaps() {
  const structure = levelStructure()
  const overlaps = surveyOtherOverlaps()
  const problems = [
    ...structure.flatMap((content) => [
      ...content.duplicateIds.map((id) => `${content.label}: id ${id} が2つ以上`),
      ...content.axes.flatMap((axis) => axis.bad.map((item) => `${content.label}: ${axis.name}が決まっていない・決まった値でない ${item}`)),
    ]),
    ...overlaps.problems,
  ]
  return { structure, overlaps, problems, knownDuplicateForms: Object.keys(KNOWN_DUPLICATE_FORMS), pluralOnlySenses: Object.keys(PLURAL_ONLY_SENSES) }
}

function printReport(result) {
  const total = result.structure.reduce((sum, content) => sum + content.total, 0)
  console.log(`■ ①段の作り（${result.structure.length}教材・計${total.toLocaleString()}件）`)
  for (const content of result.structure) {
    const axes = content.axes.map((axis) => `${axis.name}${axis.tiers}（誤り${axis.bad.length}）`).join('・')
    console.log(`  ${content.label} ${content.total}件 … id の重なり${content.duplicateIds.length}・${axes}`)
  }
  const candidates = result.overlaps.sets.reduce((sum, set) => sum + set.candidates, 0)
  console.log(`■ ②項目の重複（候補${candidates}組を1組ずつ読んで分けた）`)
  for (const set of result.overlaps.sets) {
    const by = Object.entries(set.differentBy).map(([why, count]) => `${why}${count}`).join('・')
    console.log(`  ${set.label}: 候補${set.candidates}組 → 二重登録${set.duplicate.length}・別の形${set.form.length}${set.same.length ? `・両方で学ぶ${set.same.length}` : ''}・別の項目${set.different}${by ? `（${by}）` : ''}`)
    for (const pair of set.duplicate) console.log(`      二重登録 ${pair.a}[${pair.aLevel}] ／ ${pair.b}[${pair.bLevel}]：${pair.note}`)
    for (const pair of set.form) console.log(`      別の形 ${pair.a}[${pair.aLevel}] ／ ${pair.b}[${pair.bLevel}]：${pair.note}`)
  }
  if (result.problems.length) {
    console.log(`✗ 誤り・決めていない組 ${result.problems.length}件`)
    for (const problem of result.problems) console.log(`  ${problem}`)
  } else {
    console.log('✓ 段の誤り・id の重なり・分け方を決めていない組はどれも0件')
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = surveyContentOverlaps()
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2))
  else printReport(result)
  if (result.problems.length) process.exit(1)
}
