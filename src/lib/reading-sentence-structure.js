// 長文の一文を、人が本文を読んで確定した入れ子の構造から組み立てる。
//
// 記法
//   [R 語句]       要素。R は S V O O1 O2 C M 接 仮S 真S 仮O 真O
//   {種類| 中身}   節・句のまとまり。中身には、そのまとまりの中の要素を並べる。
//
// 例
//   [S A screen near the office] [V reports]
//   [O the power {関係>the power| [O that] [S the school] [V makes] [M each day]}].
//
// 名詞を後ろから説明する節・句は、その名詞を含む要素の中に置く。
// そのため reports の目的語Oは the power that the school makes each day 全体になる。
//
// 構造図の括弧（利用者と例文で決めたルール。docs/reading-structure-brackets.md）
//   ( ) 節。主語と動詞を持つまとまり。主語と be動詞を省いた while using … / when possible も節
//   < > 句。前置詞句 {前| …}・to不定詞・動名詞・分詞のまとまり
//   前置詞の後ろの節・動名詞は前置詞の外側で入れ子にする: {前| about {疑問詞節| …}} → <about (who pays …)>
//   for A to do は {前:意味上の主語| for A} {to:…| [V to do]} と2つに分ける
//   前置詞＋関係代名詞（[M in which]）と句動詞の V の中の語は、前置詞句として括らない

import { parseStructureMarkers } from './structure-markers.js'
import {
  describeLinkElement,
  describeUnitConnector,
  relativeThatActsAsAdverb,
  shortConnectorNote,
} from './reading-structure-connectors.js'

export const STRUCTURE_ROLES = Object.freeze([
  'S', 'V', 'O', 'O1', 'O2', 'C', 'M', '接', '仮S', '真S', '仮O', '真O',
])

// 画面の下線表示で使う役割コードへの対応。
export const STRUCTURE_DISPLAY_ROLE = Object.freeze({
  S: 'S',
  V: 'V',
  O: 'O',
  O1: 'O1',
  O2: 'O2',
  C: 'C',
  M: 'M',
  接: 'LINK',
  仮S: 'S_FORMAL',
  真S: 'S_REAL',
  仮O: 'O_FORMAL',
  真O: 'O_REAL',
})

const ROLE_NAMES = Object.freeze({
  S: '主語S',
  V: '動詞V',
  O: '目的語O',
  O1: '間接目的語O1',
  O2: '直接目的語O2',
  C: '補語C',
  M: '修飾語M',
  接: '接続語',
  仮S: '形式主語（仮S）',
  真S: '真主語（真S）',
  仮O: '形式目的語（仮O）',
  真O: '真目的語（真O）',
})

export const PATTERN_NAMES = Object.freeze({
  SV: '第1文型（SV）',
  SVC: '第2文型（SVC）',
  SVO: '第3文型（SVO）',
  SVOO: '第4文型（SVOO）',
  SVOC: '第5文型（SVOC）',
})

const ADVERBIAL_CLAUSE_KINDS = Object.freeze({
  時: '時',
  理由: '理由',
  条件: '条件',
  譲歩: '譲歩',
  対比: '対比',
  目的: '目的',
  結果: '結果',
  様態: '様態',
  比較: '比較',
  程度: '程度',
  範囲: '範囲の限定',
  場所: '場所',
  比例: '比例（〜するにつれて）',
})

const INFINITIVE_ADVERB_KINDS = Object.freeze({
  目的: '目的',
  結果: '結果',
  原因: '感情の原因',
  根拠: '判断の根拠',
  程度: '程度',
  形容詞: '形容詞の限定',
})

const PARTICIPIAL_CONSTRUCTION_KINDS = Object.freeze({
  付帯状況: '付帯状況',
  時: '時',
  理由: '理由',
  結果: '結果',
  条件: '条件',
})

const CLAUSE_TYPES = new Set([
  '関係', '関係,', '関係省略', 'that節', 'that省略', '同格that', '疑問詞節',
  'whether節', 'if節', 'what節', '副詞節', '強調',
])

const PHRASE_TYPES = new Set([
  'to', '疑問詞to', '原形', '動名詞', 'ing限定', '現在分詞', '過去分詞', '分詞構文', '同格', '挿入', '前', '数量', '反復',
])

// 役割（要素）を持たずに語句を直接入れるまとまり。前置詞句は中に節・句を入れ子にできる。
// 数量は、more than ten thousand のような数の言い方を一まとまりの句として括る（利用者と確認済み）。
// 反復は、year after year のように同じ名詞を前置詞でつなぐ決まった言い方を一つの句にする（2026-09-18 利用者が決定）。
const BARE_UNIT_TYPES = new Set(['同格', '挿入', '前', '数量', '反復'])

// 前置詞句の先頭に置ける前置詞（2語以上のものを先に照らす）。
export const MULTIWORD_PREPOSITIONS = Object.freeze([
  'in addition to', 'in front of', 'in spite of', 'in terms of', 'in response to', 'in favor of',
  'in place of', 'in case of', 'on behalf of', 'by means of', 'with regard to', 'as well as',
  'according to', 'ahead of', 'along with', 'apart from', 'as for', 'aside from', 'because of',
  'close to', 'due to', 'except for', 'far from', 'instead of', 'next to', 'out of', 'owing to',
  'prior to', 'rather than', 'regardless of', 'such as', 'thanks to', 'together with', 'up to',
])

export const SINGLE_PREPOSITIONS = new Set([
  'about', 'above', 'across', 'after', 'against', 'along', 'alongside', 'amid', 'among', 'amongst',
  'around', 'as', 'at',
  'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'by',
  'concerning', 'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'including', 'inside',
  'into', 'like', 'near', 'of', 'off', 'on', 'onto', 'outside', 'over', 'past', 'per', 'regarding',
  'since', 'than', 'through', 'throughout', 'to', 'toward', 'towards', 'under', 'underneath',
  'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without',
])

// 語の並び（小文字）の先頭にある前置詞。なければ空文字。
export function leadingPreposition(words = []) {
  const lower = words.map((word) => `${word}`.toLowerCase())
  for (const phrase of MULTIWORD_PREPOSITIONS) {
    const parts = phrase.split(' ')
    if (parts.every((part, index) => lower[index] === part)) return phrase
  }
  return SINGLE_PREPOSITIONS.has(lower[0]) ? lower[0] : ''
}

const WORD_PATTERN = /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:[-‐][A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*)*/g
const TRAILING_PUNCTUATION = /[\s,;:—–-]+$/u
const LEADING_PUNCTUATION = /^[\s,;:—–-]+/u

export function structureWords(text = '') {
  return [...`${text}`.matchAll(WORD_PATTERN)].map((match) => match[0])
}

export function normalizeStructureText(text = '') {
  return `${text}`
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)\]”’])/g, '$1')
    .replace(/([(\[“‘])\s+/g, '$1')
    .trim()
}

function trimPhraseText(text = '') {
  return normalizeStructureText(text)
    .replace(TRAILING_PUNCTUATION, '')
    .replace(LEADING_PUNCTUATION, '')
    .replace(/[.!?]$/u, '')
    .trim()
}

class StructureSyntaxError extends Error {}

// 反復の句（year after year・step by step）で名詞をつなぐ前置詞と、よく出る言い方の意味。
const REPETITION_PREPOSITIONS = new Set(['after', 'by', 'to', 'upon', 'in'])
const REPETITION_MEANINGS = Object.freeze({
  'year after year': '毎年毎年',
  'day after day': '来る日も来る日も',
  'time after time': '何度も何度も',
  'step by step': '一歩ずつ',
  'one by one': '一つずつ',
  'little by little': '少しずつ',
  'side by side': '並んで',
  'face to face': '向かい合って',
  'hand in hand': '手を取り合って',
})

// 数量の句の先頭（more than＋数など）と、その意味。
const QUANTITY_LEAD_MEANINGS = Object.freeze({
  'more than': '〜を超える',
  'less than': '〜に満たない',
  'fewer than': '〜より少ない',
})

function parseUnitType(spec) {
  const raw = spec.trim()
  const [head, antecedent = ''] = raw.split('>')
  const [base, detail = ''] = head.split(':')
  const unit = { rawType: raw, base, detail, antecedent: antecedent.trim() }
  if (base.startsWith('to') && base !== 'to') {
    throw new StructureSyntaxError(`不明なまとまりの種類「${raw}」`)
  }
  if (!CLAUSE_TYPES.has(base) && !PHRASE_TYPES.has(base)) {
    throw new StructureSyntaxError(`不明なまとまりの種類「${raw}」`)
  }
  if (base === '副詞節' && !ADVERBIAL_CLAUSE_KINDS[detail]) {
    throw new StructureSyntaxError(`副詞節の種類が不明「${raw}」`)
  }
  if (base === '分詞構文' && !PARTICIPIAL_CONSTRUCTION_KINDS[detail]) {
    throw new StructureSyntaxError(`分詞構文の種類が不明「${raw}」`)
  }
  if (['数量', '反復'].includes(base) && detail) {
    throw new StructureSyntaxError(`${base}の句に種類は付けません「${raw}」`)
  }
  if (base === '前' && !['', '意味上の主語'].includes(detail)) {
    throw new StructureSyntaxError(`前置詞句の種類が不明「${raw}」`)
  }
  // 関係省略:目的格（節の動詞の目的語が欠ける）／目的格(improve)（その動詞の目的語が欠ける）／関係副詞（欠けた語がない）
  if (base === '関係省略' && !/^(?:目的格(?:\([A-Za-z'’ -]+\))?|関係副詞)$/u.test(detail)) {
    throw new StructureSyntaxError(`省略された関係詞の種類（目的格・目的格(動詞)・関係副詞）が必要です「${raw}」`)
  }
  if (base === '関係省略') {
    unit.omittedKind = detail.startsWith('目的格') ? '目的格' : '関係副詞'
    unit.gapVerb = /\((.+)\)$/u.exec(detail)?.[1] ?? ''
  }
  if (base === 'to') {
    const usage = detail.replace(/\(.*\)$/u, '')
    const adverbKind = /\((.+)\)$/u.exec(detail)?.[1] ?? ''
    if (!['名詞', '形容詞', '副詞', '補語'].includes(usage)) {
      throw new StructureSyntaxError(`to不定詞の用法が不明「${raw}」`)
    }
    if (usage === '副詞' && !INFINITIVE_ADVERB_KINDS[adverbKind]) {
      throw new StructureSyntaxError(`to不定詞の副詞的用法の種類が不明「${raw}」`)
    }
    unit.usage = usage
    unit.adverbKind = adverbKind
  }
  const needsAntecedent = ['関係', '関係,', '関係省略', '同格that', '現在分詞', '過去分詞', '同格']
    .includes(base) || (base === 'to' && unit.usage === '形容詞')
  if (needsAntecedent && !unit.antecedent) {
    throw new StructureSyntaxError(`「${raw}」には説明する名詞（>名詞）が必要です`)
  }
  return unit
}

function parseNodes(source, cursor, closer) {
  const nodes = []
  let text = ''
  const flush = () => {
    if (text) nodes.push({ kind: 'text', text })
    text = ''
  }
  while (cursor.index < source.length) {
    const character = source[cursor.index]
    if (character === closer) {
      flush()
      cursor.index++
      return nodes
    }
    if (character === '[') {
      flush()
      cursor.index++
      const match = /^(仮S|真S|仮O|真O|O1|O2|接|S|V|O|C|M) /u.exec(source.slice(cursor.index))
      if (!match) {
        throw new StructureSyntaxError(`役割の書き方が不正です（${source.slice(cursor.index, cursor.index + 12)}）`)
      }
      cursor.index += match[0].length
      const children = parseNodes(source, cursor, ']')
      nodes.push({ kind: 'element', role: match[1], children })
      continue
    }
    if (character === '{') {
      flush()
      cursor.index++
      const bar = source.indexOf('|', cursor.index)
      if (bar < 0) throw new StructureSyntaxError('まとまりの種類の後ろに | がありません')
      const unit = parseUnitType(source.slice(cursor.index, bar))
      cursor.index = bar + 1
      const children = parseNodes(source, cursor, '}')
      nodes.push({ kind: 'unit', ...unit, children })
      continue
    }
    if (character === ']' || character === '}' || character === '|') {
      throw new StructureSyntaxError(`対応しない記号「${character}」があります`)
    }
    text += character
    cursor.index++
  }
  if (closer) throw new StructureSyntaxError(`「${closer}」で閉じていないまとまりがあります`)
  flush()
  return nodes
}

function rawText(nodes) {
  return nodes.map((node) => (node.kind === 'text' ? node.text : rawText(node.children))).join('')
}

function unitIsClause(unit) {
  return CLAUSE_TYPES.has(unit.base)
}

function firstElement(unit) {
  return unit.children.find((child) => child.kind === 'element') ?? null
}

function relativeKind(unit) {
  const first = firstElement(unit)
  const lead = normalizeStructureText(first ? rawText(first.children) : '').toLowerCase()
  if (unit.base === '関係省略') return 'omitted'
  if (/^(?:where|when|why)$/.test(lead)) return 'adverb'
  if (lead === 'that' && relativeThatActsAsAdverb(unit)) return 'adverbThat'
  if (/^whose\b/.test(lead)) return 'whose'
  if (/^(?:[a-z]+\s+)+(?:which|whom)$/.test(lead)) return 'preposition'
  return 'pronoun'
}

export function structureUnitLabel(unit) {
  switch (unit.base) {
    case '関係': {
      const kind = relativeKind(unit)
      if (kind === 'adverb') return '関係副詞の節（形容詞節）'
      if (kind === 'adverbThat') return '関係副詞の働きをする that の節（形容詞節）'
      if (kind === 'preposition') return '前置詞＋関係代名詞の節（形容詞節）'
      if (kind === 'whose') return '関係代名詞 whose の節（形容詞節）'
      return '関係代名詞の節（形容詞節）'
    }
    case '関係,':
      return relativeKind(unit) === 'adverb'
        ? '非制限用法の関係副詞の節'
        : '非制限用法の関係代名詞の節'
    case '関係省略':
      return unit.omittedKind === '関係副詞'
        ? '関係副詞の働きをする語が省略された節（形容詞節）'
        : '目的格の関係代名詞が省略された節（形容詞節）'
    case 'that節':
      return 'that節（名詞節）'
    case 'that省略':
      return 'that が省略された名詞節'
    case '同格that':
      return '同格の that節'
    case '疑問詞節':
      return '疑問詞で始まる名詞節（間接疑問）'
    case 'whether節':
      return 'whether で始まる名詞節'
    case 'if節':
      return 'if で始まる名詞節（〜かどうか）'
    case 'what節':
      return '関係代名詞 what の節（名詞節）'
    case '副詞節':
      return adverbialClauseHasSubject(unit)
        ? `${ADVERBIAL_CLAUSE_KINDS[unit.detail]}を表す副詞節`
        : `${ADVERBIAL_CLAUSE_KINDS[unit.detail]}を表す副詞節（主語と be動詞の省略）`
    case '強調':
      return '強調構文（It is 〜 that …）'
    case 'to':
      if (unit.usage === '名詞') return 'to不定詞句（名詞的用法）'
      if (unit.usage === '形容詞') return 'to不定詞句（形容詞的用法）'
      if (unit.usage === '補語') return 'to不定詞句（補語）'
      return `to不定詞句（副詞的用法・${INFINITIVE_ADVERB_KINDS[unit.adverbKind]}）`
    case '疑問詞to':
      return '疑問詞＋to不定詞（名詞句）'
    case '原形':
      return '原形不定詞'
    case '動名詞':
      return '動名詞句（名詞のはたらき）'
    case 'ing限定':
      return '-ing形のまとまり（形容詞の内容を限定）'
    case '現在分詞':
      return '現在分詞句（後ろから名詞を説明）'
    case '過去分詞':
      return '過去分詞句（後ろから名詞を説明）'
    case '分詞構文':
      return `分詞構文（${PARTICIPIAL_CONSTRUCTION_KINDS[unit.detail]}）`
    case '同格':
      return '同格の名詞句'
    case '挿入':
      return '挿入句'
    case '前':
      return unit.detail === '意味上の主語' ? '不定詞の意味上の主語（for＋名詞）' : '前置詞句'
    case '数量':
      return '数を表す句'
    case '反復':
      return '同じ名詞をくり返す句'
    default:
      return 'まとまり'
  }
}

// 副詞節の中に主語があるか。while using … や when possible は主語と be動詞を省いた形。
function adverbialClauseHasSubject(unit) {
  return unit.children.some((child) => child.kind === 'element' && ['S', '仮S'].includes(child.role))
}

function patternFromRoles(roles) {
  const has = (role) => roles.includes(role)
  const subject = has('S') || has('仮S')
  if (!has('V')) return ''
  // and で並んだ目的語（O … and O …）は一つの目的語として数え、第4文型は O1 があるときだけ。
  let core = 'V'
  if (has('O1')) core = 'VOO'
  else if ((has('O') || has('仮O') || has('O2')) && has('C')) core = 'VOC'
  else if (has('O') || has('仮O') || has('O2')) core = 'VO'
  else if (has('C')) core = 'VC'
  return `${subject ? 'S' : '(S)'}${core}`
}

const AUXILIARY_ONLY = /^(?:will|would|can|could|shall|should|may|might|must|do|does|did|has|have|had|am|is|are|was|were|be|been|being|not|never|also|still|often|always|cannot|can't|couldn't|won't|wouldn't|shouldn't|mustn't|don't|doesn't|didn't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't)(?:\s+(?:not|never))?$/i

// 助動詞だけの形（will / is / has など）でも、後ろ（修飾語を除く）に動詞が続かなければ、
// それ自体が述語動詞（is not merely … の is not など）。
function verbIsComplete(element, elements = []) {
  const text = normalizeStructureText(rawText(element.children))
  if (!AUXILIARY_ONLY.test(text)) return true
  const index = elements.indexOf(element)
  if (index < 0) return false
  // Nor does S … guarantee のような倒置も、主語をはさんで動詞が続くので未完結。
  const next = elements.slice(index + 1).find((item) => !['M', 'S', '仮S'].includes(item.role))
  return next?.role !== 'V'
}

function clauseGroups(elements) {
  // 接続語のあとに主語が来れば新しい節、動詞が来れば主語を共有する述語の並列。
  // 接続語のないコンマの並列（listen …, make …）も、動詞が完結したあとの新しい動詞で区切る。
  const groups = []
  let current = { elements: [], sharedSubject: false }
  for (const [index, element] of elements.entries()) {
    // セミコロン・コロンの後ろなど、接続語なしで新しい主語が来たら新しい節。
    if (
      ['S', '仮S'].includes(element.role) &&
      elements.slice(index + 1).find((item) => item.role !== 'M')?.role === 'V' &&
      current.elements.some((item) => item.role === 'V' && verbIsComplete(item, elements))
    ) {
      groups.push(current)
      current = { elements: [], sharedSubject: false }
    }
    if (
      element.role === 'V' &&
      current.elements.some((item) => item.role === 'V' && verbIsComplete(item, elements)) &&
      current.elements.at(-1)?.role !== '接'
    ) {
      groups.push(current)
      current = { elements: [], sharedSubject: true }
    }
    if (element.role === '接' && current.elements.some((item) => item.role === 'V')) {
      // 接続語の直後（修飾語を除く）が主語か動詞のときだけ、新しい節・述語とする。
      // and national achievement to another のように動詞を省いた並列は同じ節に含める。
      const next = elements.slice(index + 1).find((item) => item.role !== 'M')
      if (next && ['S', '仮S', 'V'].includes(next.role)) {
        groups.push(current)
        current = {
          elements: [],
          sharedSubject: next.role === 'V',
        }
      }
    }
    current.elements.push(element)
  }
  groups.push(current)
  return groups.filter((group) => group.elements.some((item) => item.role === 'V'))
}

function patternsForScope(elements, { root = false } = {}) {
  const groups = clauseGroups(elements)
  let previousHadSubject = false
  return groups.map((group) => {
    const roles = group.elements.map((element) => element.role)
    const inherits = group.sharedSubject && previousHadSubject
    const pattern = patternFromRoles(inherits ? ['S', ...roles] : roles)
    previousHadSubject = roles.some((role) => ['S', '仮S'].includes(role)) || inherits
    // 文全体の主節に主語がなければ、主語 you を省いた命令文。
    return root && pattern.startsWith('(S)') ? `(you)${pattern.slice(3)}` : pattern
  }).filter(Boolean)
}

export function structurePatternName(pattern = '') {
  if (!pattern) return ''
  if (pattern.startsWith('(S)')) {
    const name = PATTERN_NAMES[`S${pattern.slice(3)}`]
    return name ? `主語のない形・${name}` : ''
  }
  if (pattern.startsWith('(you)')) {
    const name = PATTERN_NAMES[`S${pattern.slice(5)}`]
    return name ? `命令文（主語 you の省略）・${name}` : ''
  }
  return PATTERN_NAMES[pattern] ?? ''
}

function nodeText(node) {
  return trimPhraseText(rawText(node.children))
}

// 同じ節（接続語で区切られた範囲）の中だけで、要素を探す。
function sameClauseBefore(scopeElements, container) {
  const index = scopeElements.indexOf(container)
  const before = []
  for (const element of scopeElements.slice(0, Math.max(0, index)).reverse()) {
    if (element.role === '接') break
    before.push(element)
  }
  return before
}

function nearestVerb(scopeElements, container) {
  const index = scopeElements.indexOf(container)
  const before = sameClauseBefore(scopeElements, container)
    .find((element) => element.role === 'V')
  const after = scopeElements.slice(index + 1).find((element) => element.role === 'V')
  const verb = before ?? after
  return verb ? nodeText(verb) : ''
}

function nearestRole(scopeElements, container, roles) {
  const before = sameClauseBefore(scopeElements, container)
    .find((element) => roles.includes(element.role))
  return before ? nodeText(before) : ''
}

// 意味上の主語の for A は、後ろの不定詞と並ぶだけで、語の並びを調べるときは読み飛ばす。
function isSubjectPhrase(node) {
  return node?.kind === 'unit' && node.base === '前' && node.detail === '意味上の主語'
}

// まとまりの直前にある前置詞（instead of のような2語以上の前置詞も含む）。
// 要素の中でまとまりの前に名詞があるとき（books about …）は前置詞ではないので返さない。
// parent は、まとまりをじかに含む要素か前置詞句。
function prepositionBeforeUnit(parent, unit) {
  const index = parent.children.indexOf(unit)
  const siblings = parent.children.slice(0, Math.max(0, index)).filter((child) => !isSubjectPhrase(child))
  const before = normalizeStructureText(rawText(siblings))
  const words = structureWords(before)
  if (!words.length) return ''
  // A, B, and C や A or B のように並んだ二つ目以降のまとまりは、一つ目と同じ前置詞を受ける。
  const previousIndex = parent.children.slice(0, Math.max(0, index))
    .map((child, childIndex) => ({ child, childIndex }))
    .reverse()
    .find(({ child }) => child.kind === 'unit' && !isSubjectPhrase(child))?.childIndex ?? -1
  if (previousIndex >= 0) {
    const between = structureWords(rawText(parent.children.slice(previousIndex + 1, index)))
    if (between.every((word) => /^(?:and|or|but|also|not|only)$/i.test(word))) {
      return prepositionBeforeUnit(parent, parent.children[previousIndex])
    }
  }
  const joined = words.join(' ').toLowerCase()
  const multi = /(?:^|\s)(instead of|because of|in spite of|as well as|according to|in addition to|rather than|such as|by means of|in terms of|apart from|out of)$/.exec(joined)
  if (multi) return words.slice(-multi[1].split(' ').length).join(' ')
  const last = words.at(-1).toLowerCase()
  const prepositions = new Set(['about', 'after', 'against', 'as', 'at', 'before', 'by', 'during', 'for', 'from', 'in', 'into', 'like', 'of', 'on', 'over', 'than', 'through', 'to', 'toward', 'towards', 'under', 'until', 'upon', 'with', 'within', 'without', 'beyond', 'despite', 'among', 'between', 'behind', 'besides', 'since', 'across', 'around', 'along', 'onto'])
  return prepositions.has(last) ? words.at(-1) : ''
}

function nounFunctionText(unit, container, scopeElements, scopeUnit, parent = container) {
  const inside = scopeUnit ? `${structureUnitLabel(scopeUnit)}の中で、` : ''
  const verb = nearestVerb(scopeElements, container)
  const preposition = prepositionBeforeUnit(parent, unit)
  if (preposition) {
    if (/^(?:rather than|than|as)$/i.test(preposition)) {
      return `${inside}${preposition} の後ろに置かれた、比べる相手です（${ROLE_NAMES[container.role]}「${nodeText(container)}」の一部）。`
    }
    const containerText = nodeText(container)
    const startsWithPreposition = containerText.toLowerCase().startsWith(preposition.toLowerCase())
    return startsWithPreposition
      ? `${inside}前置詞 ${preposition} の目的語です（${preposition} から始まるまとまりが${ROLE_NAMES[container.role]}）。`
      : `${inside}前置詞 ${preposition} の目的語です（${ROLE_NAMES[container.role]}「${containerText}」の一部）。`
  }
  switch (container.role) {
    case 'S':
      return `${inside}${verb ? `${verb} の` : ''}主語Sです。`
    case 'O':
      return `${inside}${verb ? `${verb} の` : ''}目的語Oです。`
    case 'O1':
      return `${inside}${verb ? `${verb} の` : ''}間接目的語O1です。`
    case 'O2':
      return `${inside}${verb ? `${verb} の` : ''}直接目的語O2（何を）です。`
    case 'C': {
      const object = nearestRole(scopeElements, container, ['O', '仮O'])
      const subject = nearestRole(scopeElements, container, ['S', '仮S'])
      return object
        ? `${inside}目的語 ${object} の内容・状態を説明する補語Cです。`
        : `${inside}${subject ? `主語 ${subject} の` : '主語の'}内容を説明する補語Cです。`
    }
    case '真S':
      return `${inside}形式主語 It が指す中身（真主語）です。`
    case '真O':
      return `${inside}形式目的語 it が指す中身（真目的語）です。`
    default:
      return `${inside}${ROLE_NAMES[container.role]}として働きます。`
  }
}

function unitFunctionText(unit, container, scopeElements, scopeUnit, parent = container) {
  const inside = scopeUnit ? `${structureUnitLabel(scopeUnit)}の中で、` : ''
  const containerText = container ? nodeText(container) : ''
  const containerRole = container ? ROLE_NAMES[container.role] : ''
  const partOf = container && !['M', '接'].includes(container.role) && containerText !== unitText(unit)
    ? `（${containerRole}「${containerText}」の一部）`
    : ''
  // 形容詞を後ろから限定するまとまりは、すぐ前の語がその形容詞（意味上の主語の for A は読み飛ばす）。
  const siblingsBefore = parent
    ? parent.children.slice(0, Math.max(0, parent.children.indexOf(unit)))
    : []
  const wordBefore = structureWords(rawText(siblingsBefore.filter((child) => !isSubjectPhrase(child)))).at(-1) ?? ''
  const adjectiveBefore = wordBefore ? ` ${wordBefore} ` : ''
  // difficult for outsiders to challenge の for outsiders は、不定詞の意味上の主語。
  const subjectPhrase = [...siblingsBefore].reverse().find((child) => child.kind === 'unit')
  const semanticSubject = isSubjectPhrase(subjectPhrase)
    ? `意味上の主語は、直前の ${trimPhraseText(rawText(subjectPhrase.children))} です。`
    : ''
  switch (unit.base) {
    case '関係':
    case '関係省略':
      return `${inside}直前の ${unit.antecedent} を後ろから説明します${partOf}。`
    case '関係,':
      return unit.antecedent === '前の内容'
        ? `${inside}前の節の内容を受けて、情報を付け足します。`
        : `${inside}${unit.antecedent} について、コンマの後ろで情報を付け足します${partOf}。`
    case '同格that':
      return `${inside}${unit.antecedent} の内容を具体的に述べます${partOf}。`
    case '同格':
      return `${inside}${unit.antecedent} を別の言葉で言いかえます${partOf}。`
    case '数量': {
      const words = structureWords(rawText(unit.children))
      const lead = words.slice(0, 2).join(' ').toLowerCase()
      const meaning = QUANTITY_LEAD_MEANINGS[lead]
      return meaning
        ? `${inside}後ろの名詞の数を表します${partOf}。${lead} は数 ${words.slice(2).join(' ')} にかかる副詞のはたらきで「${meaning}」。`
        : `${inside}後ろの名詞の数を表します${partOf}。`
    }
    case '反復': {
      const words = structureWords(rawText(unit.children))
      const [noun = '', preposition = ''] = words
      const meaning = REPETITION_MEANINGS[words.join(' ').toLowerCase()]
      return `${inside}${noun} を前置詞 ${preposition} でくり返す決まった言い方${meaning ? `（「${meaning}」）` : ''}で、副詞のはたらきをします${partOf}。`
    }
    case '現在分詞':
    case '過去分詞':
      return `${inside}直前の ${unit.antecedent} を後ろから説明します${partOf}。`
    case '副詞節': {
      const kind = ADVERBIAL_CLAUSE_KINDS[unit.detail]
      if (unit.detail === '比較' && container && container.role !== 'M') {
        return `${inside}比べる相手を表します${partOf}。`
      }
      return scopeUnit
        ? `${inside}${kind}を表す修飾語Mとして働きます。`
        : `${kind}を表す修飾語Mとして働きます。`
    }
    case '分詞構文':
      return `${inside}${PARTICIPIAL_CONSTRUCTION_KINDS[unit.detail]}を表し、修飾語Mとして働きます。`
    case '挿入':
      return `${inside}文の途中に補足を差し込みます。`
    case 'ing限定':
      return `${inside}直前の形容詞${adjectiveBefore}の内容を「〜することに・〜するのに」と後ろから限定します${partOf}。`
    case '強調':
      return `${inside}強調したい語句を It is と that の間に置く形です。`
    case '原形': {
      if (container && /^(?:rather than|than|as|but|except)$/i.test(prepositionBeforeUnit(parent, unit))) {
        return nounFunctionText(unit, container, scopeElements, scopeUnit, parent)
      }
      // help design … のように、原形不定詞そのものが動詞の目的語になる形。
      if (container?.role === 'O' && containerText === unitText(unit)) {
        const verb = nearestVerb(scopeElements, container)
        return `${inside}${verb ? `${verb} の` : ''}目的語Oです（to のない不定詞）。`
      }
      const object = container ? nearestRole(scopeElements, container, ['O', '仮O']) : ''
      return object
        ? `${inside}目的語 ${object} が何をするかを表す補語Cです（to のない不定詞）。`
        : `${inside}to のない不定詞として働きます。`
    }
    case 'to': {
      if (unit.usage === '形容詞') {
        return `${inside}直前の ${unit.antecedent} を後ろから説明します${partOf}。`
      }
      if (unit.usage === '副詞') {
        const kind = INFINITIVE_ADVERB_KINDS[unit.adverbKind]
        if (unit.adverbKind === '形容詞') {
          return `${inside}直前の形容詞${adjectiveBefore}の内容を後ろから限定します${partOf}。${semanticSubject}`
        }
        if (unit.adverbKind === '程度' && container && container.role !== 'M') {
          return `${inside}enough や too と組んで、どのくらいかという程度を表します${partOf}。${semanticSubject}`
        }
        return `${inside}${kind}を表し、修飾語Mとして働きます。${semanticSubject}`
      }
      if (unit.usage === '補語') {
        // depend on A to 〜 のように、前置詞の目的語 A が意味の上の主語になる形。
        if (container?.role === 'M') {
          const words = structureWords(rawText(siblingsBefore))
          const preposition = words[0] ?? ''
          const noun = words.slice(1).join(' ')
          if (preposition && noun) {
            return `${inside}前置詞 ${preposition} の目的語 ${noun} が何をするかを表します（修飾語M「${containerText}」の一部）。`
          }
        }
        const object = container ? nearestRole(scopeElements, container, ['O', '仮O']) : ''
        const subject = container ? nearestRole(scopeElements, container, ['S', '仮S']) : ''
        return object
          ? `${inside}目的語 ${object} が何をするかを表す補語Cです。`
          : `${inside}主語 ${subject} が何をするかを表す補語Cです。`
      }
      return container ? nounFunctionText(unit, container, scopeElements, scopeUnit, parent) : ''
    }
    default:
      return container ? nounFunctionText(unit, container, scopeElements, scopeUnit, parent) : ''
  }
}

function unitText(unit) {
  return trimPhraseText(rawText(unit.children))
}

function unitMarker(unit) {
  return unitIsClause(unit) ? ['(', ')'] : ['<', '>']
}

// 構造図の括弧。節 ( ) は入れ子にし、節の中では句を改めて < > でくくる。
// 句 < > の中の句は入れ子にせず、句ごとに閉じて並べる（2026-09-18 利用者が決めた型）：
//   <about the future> <of a city>、<to help them> <explore the town> <without getting lost>
// 前置詞の目的語になる動名詞・原形などの句は、前置詞と一つの < > にまとめる（<from losing their ability>）。
// 後ろから入った句のあとに外側の句の語が残るときは、残りを < > で閉じ直す（<to charge the fee> <for one year> <and publish the results>）。
function markedText(nodes) {
  const out = []
  const emit = (text) => out.push(text)
  const walk = (list, phrase, parentUnit = null) => {
    for (const node of list) {
      if (node.kind === 'text') {
        // and・or だけが残るときは括らない（<across places> and <over time>）。
        const reopenWords = structureWords(node.text).filter((word) => !OBJECT_COORDINATORS.has(word.toLowerCase()))
        if (phrase && !phrase.open && reopenWords.length) {
          // 閉じ直すときは、先頭のコンマや and・or を括弧の外に出す（<beyond headlines>, <tolerate …>、
          // <the price> <of food>, and <the currency>）。
          const lead = /^[\s,;:]*(?:(?:and|or|but|nor)\b[\s,]*)?/i.exec(node.text)[0]
          emit(lead)
          emit(' <')
          phrase.open = true
          emit(node.text.slice(lead.length))
          continue
        }
        emit(node.text)
        continue
      }
      if (node.kind === 'element') {
        walk(node.children, phrase, parentUnit)
        continue
      }
      if (unitIsClause(node)) {
        // 名詞を後ろから説明する節は、句を閉じてから ( ) だけで示す（<about the old station> (that stood …)）。
        // 前置詞の目的語そのものになる節（<about (who pays …)>）は句の中に残す。2026-09-18 利用者が決定。
        if (phrase?.open && NOUN_MODIFYING_CLAUSES.has(node.base)) {
          emit('> ')
          phrase.open = false
        }
        // 閉じた句の後ろに節だけが残るときは、節の ( ) だけにする（<of removal> (that follows …)）。
        emit(' (')
        walk(node.children, null, node)
        emit(') ')
        continue
      }
      // 同格の語句は、言いかえる名詞そのものは括らず、中の句・節だけを括る（Ms. Brown, one <of the librarians>）。
      if (node.base === '同格') {
        if (phrase?.open) {
          emit('> ')
          phrase.open = false
        }
        walk(node.children, null, node)
        continue
      }
      if (phrase && isPrepositionObject(node, parentUnit)) {
        walk(node.children, phrase, node)
        continue
      }
      if (phrase?.open) {
        emit('> ')
        phrase.open = false
      }
      const inner = { open: true }
      emit(' <')
      walk(node.children, inner, node)
      if (inner.open) emit('> ')
    }
  }
  walk(nodes, null)
  // 括弧の内側には空白を入れない（<to help them> <explore the town>）。
  return out.join('')
    .replace(/\s+/g, ' ')
    .replace(/([(<])\s+/g, '$1')
    .replace(/\s+([)>])/g, '$1')
    .replace(/([,;:])>/g, '>$1')
}

// 前置詞と目的語の間に入っても目的語との一まとまりを崩さない語（rather than only during …）。
const FOCUS_BEFORE_OBJECT = new Set(['only', 'even', 'just', 'simply', 'merely', 'also', 'not', 'mainly', 'mostly', 'partly'])

const OBJECT_COORDINATORS = new Set(['and', 'or', 'but', 'nor'])

// 名詞を後ろから説明する節（句の < > の外に出す）。
const NOUN_MODIFYING_CLAUSES = new Set(['関係', '関係,', '関係省略', '同格that'])

// 前置詞句の中で、前置詞の目的語になる句か。前置詞のすぐ後ろのほか、
// such as A or B・in A, B, and C のように and・or で並んだ目的語も一つの < > に入れる。
function isPrepositionObject(unit, parent) {
  if (!parent || parent.kind !== 'unit' || parent.base !== '前') return false
  const before = parent.children.slice(0, parent.children.indexOf(unit))
  if (before[0]?.kind !== 'text') return false
  const words = structureWords(before.filter((node) => node.kind === 'text').map((node) => node.text).join(' '))
  const preposition = leadingPreposition(words)
  if (!preposition) return false
  return words.slice(preposition.split(' ').length).every((word) => {
    const lower = word.toLowerCase()
    return FOCUS_BEFORE_OBJECT.has(lower) || OBJECT_COORDINATORS.has(lower)
  })
}

function collectWords(nodes, scopes, elements, output) {
  for (const node of nodes) {
    if (node.kind === 'text') {
      for (const match of `${node.text}`.matchAll(WORD_PATTERN)) {
        output.push({
          word: match[0],
          node,
          offset: match.index ?? 0,
          scopes: [...scopes],
          elements: [...elements],
        })
      }
      continue
    }
    if (node.kind === 'element') {
      collectWords(node.children, scopes, [...elements, node], output)
      continue
    }
    // 前置詞句は括弧を付けるだけで、語順訳の役割を探す場面（節・句の中）にはしない。
    collectWords(node.children, ['前', '数量', '反復'].includes(node.base) ? scopes : [...scopes, node], elements, output)
  }
}

function validateTree(nodes, errors, scopeUnit = null) {
  for (const node of nodes) {
    if (node.kind === 'text') {
      if (structureWords(node.text).length && !(scopeUnit && BARE_UNIT_TYPES.has(scopeUnit.base))) {
        errors.push(`役割のない語句「${normalizeStructureText(node.text)}」があります`)
      }
      continue
    }
    if (node.kind === 'unit') {
      errors.push(`まとまり「${unitText(node)}」は要素の中に置く必要があります`)
      validateUnit(node, errors)
      continue
    }
    validateElement(node, errors)
  }
}

function validateElement(element, errors) {
  if (!structureWords(rawText(element.children)).length) {
    errors.push(`空の要素 [${element.role}] があります`)
  }
  for (const child of element.children) {
    if (child.kind === 'element') {
      errors.push(`要素 [${element.role}] の中に要素を直接置けません（まとまり {…} で囲みます）`)
    }
    if (child.kind === 'unit') {
      child.parentNode = element
      validateUnit(child, errors)
    }
  }
}

// 同じ親の中で、すぐ後ろに続くまとまり（間に語があれば null）。
function nextUnitSibling(unit) {
  const siblings = unit.parentNode?.children ?? []
  const index = siblings.indexOf(unit)
  for (const child of siblings.slice(index + 1)) {
    if (child.kind === 'unit') return child
    if (child.kind === 'text' && structureWords(child.text).length) return null
  }
  return null
}

function validateUnit(unit, errors) {
  const elements = unit.children.filter((child) => child.kind === 'element')
  const bare = BARE_UNIT_TYPES.has(unit.base)
  if (!bare && !elements.length) {
    errors.push(`まとまり「${unitText(unit)}」の中に要素がありません`)
  }
  // when possible のように主語と be動詞を省いた副詞節は、動詞がなくてもよい。
  const ellipticalAdverbial = unit.base === '副詞節' && !adverbialClauseHasSubject(unit)
  if (!bare && !elements.some((element) => element.role === 'V') && unit.base !== '強調' && !ellipticalAdverbial) {
    errors.push(`まとまり「${unitText(unit)}」に動詞Vがありません`)
  }
  // 関係詞が目的語・補語・修飾語になる節には、必ず主語がある（受け身なら関係代名詞が主語S）。
  if (['関係', '関係,'].includes(unit.base) && ['O', 'O1', 'O2', 'C', 'M'].includes(elements[0]?.role)) {
    if (!elements.some((element) => ['S', '仮S'].includes(element.role))) {
      errors.push(`関係代名詞の節「${unitText(unit)}」に主語Sがありません（受け身なら関係代名詞が主語Sです）`)
    }
  }
  if (unit.base === '反復') {
    const words = structureWords(rawText(unit.children)).map((word) => word.toLowerCase())
    if (words.length !== 3 || words[0] !== words[2] || !REPETITION_PREPOSITIONS.has(words[1])) {
      errors.push(`反復の句「${unitText(unit)}」は year after year のように「名詞＋前置詞＋同じ名詞」で書きます`)
    }
  }
  if (unit.base === '数量') {
    const lead = structureWords(rawText(unit.children)).slice(0, 2).join(' ').toLowerCase()
    if (!QUANTITY_LEAD_MEANINGS[lead]) {
      errors.push(`数量の句「${unitText(unit)}」は more than・less than・fewer than で始めます`)
    }
  }
  if (unit.base === '前') {
    const words = structureWords(rawText(unit.children))
    const preposition = leadingPreposition(words)
    const leadingText = unit.children[0]?.kind === 'text' ? structureWords(unit.children[0].text) : []
    if (!preposition || leadingText.length < preposition.split(' ').length) {
      errors.push(`前置詞句「${unitText(unit)}」が前置詞で始まっていません`)
    } else if (words.length <= preposition.split(' ').length) {
      errors.push(`前置詞句「${unitText(unit)}」に前置詞の目的語がありません`)
    }
    if (elements.length) errors.push(`前置詞句「${unitText(unit)}」の中に要素を置けません（要素の中に前置詞句を置きます）`)
    if (unit.detail === '意味上の主語') {
      const next = nextUnitSibling(unit)
      if (!/^for$/i.test(words[0] ?? '') || next?.base !== 'to') {
        errors.push(`意味上の主語「${unitText(unit)}」は for で始め、すぐ後ろに to不定詞のまとまりを置きます`)
      }
    }
  }
  for (const child of unit.children) {
    if (child.kind === 'unit') {
      if (!bare) errors.push(`まとまり「${unitText(child)}」は要素の中に置く必要があります`)
      child.parentNode = unit
    }
    if (child.kind === 'element') validateElement(child, errors)
    if (child.kind === 'text' && structureWords(child.text).length && !bare) {
      errors.push(`まとまり「${unitText(unit)}」の中に役割のない語句「${normalizeStructureText(child.text)}」があります`)
    }
  }
  if (unit.antecedent && unit.antecedent !== '前の内容') {
    // 説明する名詞は、まとまりより前に本文として現れていなければならない。
    unit.antecedentMustAppear = true
  }
}

function collectUnits(nodes, scopeUnit, scopeElements, containerElement, output, depth, parent = null) {
  for (const node of nodes) {
    if (node.kind === 'element') {
      collectUnits(node.children, scopeUnit, scopeElements, node, output, depth, node)
      continue
    }
    if (node.kind !== 'unit') continue
    // 前置詞句は節・句の解説には並べず、中の節・句だけを、前置詞句を親として集める。
    if (node.base === '前') {
      collectUnits(node.children, scopeUnit, scopeElements, containerElement, output, depth, node)
      continue
    }
    const innerElements = node.children.filter((child) => child.kind === 'element')
    const roles = innerElements.map((element) => element.role)
    const clause = unitIsClause(node)
    output.push({
      node,
      depth,
      type: node.rawType,
      base: node.base,
      detail: node.detail,
      usage: node.usage ?? '',
      clause,
      label: structureUnitLabel(node),
      antecedent: node.antecedent,
      text: unitText(node),
      containerRole: containerElement?.role ?? '',
      functionText: unitFunctionText(node, containerElement, scopeElements, scopeUnit, parent ?? containerElement),
      containerVerb: containerElement ? nearestVerb(scopeElements, containerElement) : '',
      parts: innerElements.map((element) => Object.freeze({
        role: element.role,
        text: nodeText(element),
      })),
      patterns: clause ? patternsForScope(innerElements) : [],
      // 節・句そのものを括弧つきで示す文字列（外側の括弧も含む）。
      marked: normalizeStructureText(markedText([node])),
    })
    collectUnits(node.children, node, innerElements, null, output, depth + 1, node)
  }
}

export function parseSentenceStructure(markup = '') {
  try {
    const root = parseNodes(`${markup}`, { index: 0 }, '')
    return { root, error: '' }
  } catch (error) {
    if (error instanceof StructureSyntaxError) return { root: [], error: error.message }
    throw error
  }
}

// 本文と台帳を比べて、画面表示に必要な情報をまとめる。
export function buildSentenceStructure(sentenceEn = '', markup = '', options = {}) {
  const { root, error } = parseSentenceStructure(markup)
  const errors = error ? [error] : []
  if (!error) {
    const plain = normalizeStructureText(rawText(root))
    if (plain !== normalizeStructureText(sentenceEn)) {
      errors.push(`台帳の英文が本文と一致しません（台帳: ${plain}）`)
    }
    validateTree(root, errors)
  }
  const elements = root.filter((node) => node.kind === 'element')
  const words = []
  collectWords(root, [], [], words)
  const sentenceWords = structureWords(sentenceEn)
  if (!error && words.length !== sentenceWords.length) {
    errors.push('台帳の語数が本文と一致しません')
  }
  const units = []
  collectUnits(root, null, elements, null, units, 0)
  for (const unit of units) {
    if (!unit.antecedent || unit.antecedent === '前の内容') continue
    const unitStart = words.findIndex((word) => word.scopes.includes(unit.node))
    const before = words.slice(0, Math.max(0, unitStart)).map((word) => word.word).join(' ')
    const target = structureWords(unit.antecedent).join(' ')
    // 文頭の先行詞は、文の途中へ戻すときに小文字へ直せるよう印を付ける。
    unit.antecedentAtSentenceStart = before.trim() === target
    if (!` ${before} `.includes(` ${target} `)) {
      errors.push(`「${unit.text}」が説明する ${unit.antecedent} が前にありません`)
    }
  }
  // 構造図は文末の句点を付けずに示す（本文の句点は上の英文で見える）。
  const markedSentence = normalizeStructureText(markedText(root))
  const marked = markedSentence.replace(/[.!?]$/u, '')
  const parsedMarkers = parseStructureMarkers(marked)
  const notes = options.notes ?? {}
  const unitNotes = options.unitNotes ?? {}
  // つなぐ語（接続詞・関係詞・疑問詞・接続副詞）の種類と見分け方。
  const connectorByUnit = new Map()
  for (const unit of units) {
    const info = describeUnitConnector(unit)
    if (info) connectorByUnit.set(unit.node, info)
  }
  const wordRange = (elementNode) => {
    const indexes = words
      .map((word, index) => (word.elements.includes(elementNode) ? index : -1))
      .filter((index) => index >= 0)
    return indexes.length ? { start: indexes[0], end: indexes.at(-1) + 1 } : null
  }
  const unitWordStart = (unitNode) => {
    const index = words.findIndex((word) => word.scopes.includes(unitNode))
    return index >= 0 ? { start: index, end: index + 1 } : null
  }
  const connectorSpans = []
  const chipByElement = new Map()
  const links = []
  const scopes = [
    { elements, unit: null },
    ...units.map((unit) => ({
      elements: unit.node.children.filter((child) => child.kind === 'element'),
      unit,
    })),
  ]
  for (const scope of scopes) {
    const info = scope.unit ? connectorByUnit.get(scope.unit.node) : null
    scope.elements.forEach((element, index) => {
      // 節の先頭の接続詞・関係詞は、その節のつなぐ語としてすでに説明している。
      if (info && index === 0 && (element.role === '接' || nodeText(element) === info.word)) {
        chipByElement.set(element, info.chip)
        const range = wordRange(element)
        if (range) connectorSpans.push({ ...range, note: shortConnectorNote(info, scope.unit) })
        return
      }
      const link = describeLinkElement(element, scope.elements, index)
      if (!link) return
      chipByElement.set(element, link.chip)
      links.push(link)
      const range = wordRange(element)
      if (range) connectorSpans.push({ ...range, note: shortConnectorNote(link) })
    })
    // 省略された関係詞・接続詞は語がないので、節の先頭の語に注記を結びつける。
    if (info && !info.word) {
      const range = unitWordStart(scope.unit.node)
      if (range) connectorSpans.push({ ...range, note: shortConnectorNote(info, scope.unit) })
    }
  }
  return Object.freeze({
    markup,
    errors: Object.freeze([...errors, ...parsedMarkers.errors.map((item) => `構造図の括弧: ${item.type}`)]),
    root,
    elements: Object.freeze(elements.map((element) => Object.freeze({
      role: element.role,
      displayRole: STRUCTURE_DISPLAY_ROLE[element.role],
      text: normalizeStructureText(rawText(element.children)),
      trimmed: nodeText(element),
      hasUnit: element.children.some((child) => child.kind === 'unit'),
      connector: chipByElement.get(element) ?? '',
    }))),
    // 「文の要素」の下線表示に使う、括弧つきで句点も残した英文。
    markedSentence,
    patterns: Object.freeze(patternsForScope(elements, { root: true })),
    units: Object.freeze(units.map((unit, index) => Object.freeze({
      id: index,
      ...unit,
      note: unitNotes[unit.text] ?? '',
      connector: connectorByUnit.get(unit.node) ?? null,
      parts: Object.freeze(unit.node.children
        .filter((child) => child.kind === 'element')
        .map((element) => Object.freeze({
          role: element.role,
          text: nodeText(element),
          connector: chipByElement.get(element) ?? '',
        }))),
    }))),
    // 文全体・節の中の接続語（節を導く語を除く）。
    links: Object.freeze(links),
    connectorSpans: Object.freeze(connectorSpans),
    words: Object.freeze(words),
    marked,
    structureTokens: parsedMarkers.tokens,
    notes,
    rules: options.rules ?? null,
  })
}

// 前置詞句 {前| …} で囲み忘れた前置詞を探す（括弧のルールの検査）。
// 動詞の中の語（句動詞の out など）、接続語、関係詞節の先頭（in which）は前置詞句にしない。
const FIRST_ELEMENT_NOT_PHRASE = new Set(['関係', '関係,', '疑問詞節', 'what節'])

const DETERMINERS_BEFORE_NOUN = new Set([
  'the', 'a', 'an', 'its', 'this', 'that', 'their', 'our', 'his', 'her', 'my', 'your', 'these', 'those',
])

// 前置詞の形をしていても前置詞ではない語。
// about の後ろが数量なら「約」という副詞（by about a third・about 20 minutes）。
const APPROXIMATE_QUANTITY_WORDS = new Set([
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'fifteen', 'twenty', 'thirty', 'forty', 'fifty', 'hundred', 'thousand', 'million',
  'half', 'third', 'quarter', 'dozen',
])

function isApproximateQuantity(list, start) {
  const first = (list[start] ?? '').toLowerCase()
  if (/^\d/.test(first) || APPROXIMATE_QUANTITY_WORDS.has(first)) return true
  const second = (list[start + 1] ?? '').toLowerCase()
  return (first === 'a' || first === 'an') && (/^\d/.test(second) || APPROXIMATE_QUANTITY_WORDS.has(second))
}

function exemptPreposition(found, list, cursor, nextNode, options = {}) {
  const next = (list[cursor + 1] ?? '').toLowerCase()
  const previous = (list[cursor - 1] ?? '').toLowerCase()
  // as quickly as possible の1つ目の as、as well の as は副詞。
  if (found === 'as' && (/ly$/.test(next) || next === 'well')) return true
  // as powerful as fear is のように、後ろに as で始まる比較のまとまりがあるときの1つ目の as も副詞。
  if (found === 'as' && options.hasAsComparison) return true
  // the past・of the past の past は名詞。
  if (found === 'past' && DETERMINERS_BEFORE_NOUN.has(previous)) return true
  // 目的語が続かない語は前置詞ではない（its own past の past、once before の before など）。
  if (!next && !(nextNode?.kind === 'unit')) return true
  // by about a third の about は「約」という副詞で、後ろの数量にかかる。
  if (found === 'about' && isApproximateQuantity(list, cursor + 1)) return true
  // near miss（あと少しで事故になりかけたこと）の near は名詞の一部。
  if (found === 'near' && (next === 'miss' || next === 'misses')) return true
  // less by … than by … の than は、前置詞句どうしを並べる語。
  if ((found === 'than' || found === 'rather than') && !next) {
    return nextNode?.kind === 'unit' && nextNode.base === '前'
  }
  return false
}

export function unbracketedPrepositions(structure) {
  const issues = []
  // as … as の比較がある文かどうか（1つ目の as は前置詞ではなく副詞）。
  const hasAsComparison = (function findAsComparison(nodes) {
    for (const node of nodes) {
      if (node.kind === 'unit') {
        const first = (structureWords(rawText(node.children))[0] ?? '').toLowerCase()
        if (first === 'as' && (node.base === '前' || node.base === '副詞節')) return true
      }
      if (node.children && findAsComparison(node.children)) return true
    }
    return false
  })(structure.root)
  const visit = (nodes, unit) => {
    const firstElement = unit
      ? unit.children.find((child) => child.kind === 'element')
      : null
    for (const [index, node] of nodes.entries()) {
      if (node.kind === 'text') {
        const list = structureWords(node.text)
        let cursor = 0
        // 数量の句（more than ten thousand）の than、反復の句（year after year）の after は、決まった言い方の一部。
        if (['数量', '反復'].includes(unit?.base)) continue
        if (unit?.base === '前' && index === 0) {
          const lead = leadingPreposition(list)
          cursor = lead ? lead.split(' ').length : 0
        }
        while (cursor < list.length) {
          const found = leadingPreposition(list.slice(cursor))
          if (found && !exemptPreposition(found, list, cursor, nodes[index + 1], { hasAsComparison })) {
            issues.push({ word: found, text: normalizeStructureText(node.text) })
            cursor += found.split(' ').length
            continue
          }
          cursor += found ? found.split(' ').length : 1
        }
        continue
      }
      if (node.kind === 'element') {
        const single = structureWords(rawText(node.children)).length <= 1
        const skip = node.role === 'V' || node.role === '接' || single ||
          (unit && FIRST_ELEMENT_NOT_PHRASE.has(unit.base) && node === firstElement)
        if (skip) {
          for (const child of node.children) {
            if (child.kind === 'unit') visit([child], null)
          }
          continue
        }
        visit(node.children, null)
        continue
      }
      visit(node.children, node)
    }
  }
  visit(structure.root, null)
  return issues
}

// 語 start..end の範囲を、句読点を保ったまま台帳の原文から取り出す。
function textForWordRange(structure, start, end) {
  const pieces = []
  let collecting = false
  let done = false
  let wordIndex = 0
  const visit = (nodes) => {
    for (const node of nodes) {
      if (done) return
      if (node.kind !== 'text') {
        visit(node.children)
        continue
      }
      let cursor = 0
      for (const match of `${node.text}`.matchAll(WORD_PATTERN)) {
        const matchStart = match.index ?? 0
        const matchEnd = matchStart + match[0].length
        if (wordIndex === start) {
          collecting = true
          cursor = matchStart
        }
        if (collecting && wordIndex === end - 1) {
          pieces.push(node.text.slice(cursor, matchEnd))
          collecting = false
          done = true
          return
        }
        wordIndex++
      }
      if (collecting) pieces.push(node.text.slice(cursor))
    }
  }
  visit(structure.root)
  return normalizeStructureText(pieces.join(''))
}

function scopeDepthForWords(words) {
  if (!words.length) return 0
  let depth = 0
  const first = words[0].scopes
  while (
    depth < first.length &&
    words.every((word) => word.scopes[depth] === first[depth])
  ) depth++
  return depth
}

function partDescription(part, scopeInfo) {
  const name = ROLE_NAMES[part.role] ?? part.role
  if (scopeInfo && !scopeInfo.parts.length) {
    if (scopeInfo.base === '同格') {
      return `${part.text} は ${scopeInfo.antecedent} を言いかえる同格の語句で、${name}の一部`
    }
    return `${part.text} は文の途中に差し込まれた補足で、${name}の一部`
  }
  if (part.coversElement || !part.elementText) return `${part.text} は${name}`
  if (part.startsElement) return `${part.text} から${name}が始まり、${name}は「${part.elementText}」全体`
  return `${part.text} は${name}「${part.elementText}」の一部`
}

function describeParts(parts, scopeInfo) {
  // will also talk のように、間に修飾語をはさんだ動詞は一つの動詞Vとして述べる。
  const pieces = []
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index]
    if (
      part.role === 'V' &&
      parts[index + 1]?.role === 'M' &&
      parts[index + 2]?.role === 'V'
    ) {
      // cannot always be fully quantified のように、修飾語が二つ以上はさまっても一つの動詞Vとして述べる。
      const verbs = [part.text]
      const modifiers = []
      let cursor = index
      while (parts[cursor + 1]?.role === 'M' && parts[cursor + 2]?.role === 'V') {
        modifiers.push(parts[cursor + 1].text)
        verbs.push(parts[cursor + 2].text)
        cursor += 2
      }
      pieces.push(`${verbs.join(' … ')} が動詞V（間の ${modifiers.join(' と ')} は修飾語M）`)
      index = cursor
      continue
    }
    pieces.push(partDescription(part, scopeInfo))
  }
  return pieces.join('、')
}

// 語順訳のまとまり（連続する語 start..end）に、台帳の役割を割り当てる。
// まとまりが入る一番内側の節・句を場面として、その場面の直下の要素で区切る。
export function structureRolesForWordSpan(structure, start, end) {
  const words = structure.words.slice(start, end)
  if (!words.length) return null
  const depth = scopeDepthForWords(words)
  const scopeUnit = depth > 0 ? words[0].scopes[depth - 1] : null
  const parts = []
  for (const [offset, word] of words.entries()) {
    const element = word.elements[depth] ?? word.elements[depth - 1] ?? null
    const previous = parts.at(-1)
    if (previous && previous.element === element) {
      previous.words.push(word.word)
      previous.end = start + offset + 1
      continue
    }
    parts.push({
      element,
      role: element?.role ?? 'M',
      words: [word.word],
      start: start + offset,
      end: start + offset + 1,
    })
  }
  for (const part of parts) {
    part.text = textForWordRange(structure, part.start, part.end).replace(TRAILING_PUNCTUATION, '')
  }
  const scopeInfo = scopeUnit
    ? structure.units.find((unit) => unit.node === scopeUnit)
    : null
  const resolvedParts = parts.map((part) => {
    const elementWords = structure.words
      .map((word, index) => ({ word, index }))
      .filter(({ word }) => word.elements.includes(part.element))
    const elementText = part.element ? nodeText(part.element) : ''
    const covers = elementWords.length &&
      elementWords[0].index >= part.start &&
      elementWords.at(-1).index < part.end
    const startsElement = elementWords.length && elementWords[0].index === part.start
    return Object.freeze({
      role: part.role,
      displayRole: STRUCTURE_DISPLAY_ROLE[part.role],
      text: part.text || part.words.join(' '),
      elementText,
      coversElement: Boolean(covers),
      startsElement: Boolean(startsElement),
    })
  })
  const bareScope = scopeInfo && !scopeInfo.parts.length
  const prefix = scopeInfo && !bareScope ? `${scopeInfo.label}の中で、` : ''
  const described = describeParts(resolvedParts, scopeInfo)
  const continuations = []
  const relativeLead = scopeInfo &&
    ['関係', '関係,'].includes(scopeInfo.base) &&
    resolvedParts.length === 1 &&
    structure.units[scopeInfo.id].parts[0]?.text === resolvedParts[0].text
    ? (scopeInfo.antecedent === '前の内容'
      ? `${resolvedParts[0].text} は前の節の内容を受けます。`
      : `${resolvedParts[0].text} は先行詞 ${scopeInfo.antecedent} を受けます。`)
    : ''
  const connectorNotes = (structure.connectorSpans ?? [])
    .filter((span) => span.note && span.start >= start && span.end <= end)
    .map((span) => span.note)
  return Object.freeze({
    scope: scopeInfo?.label ?? '',
    scopeUnitId: scopeInfo?.id ?? null,
    parts: Object.freeze(resolvedParts),
    pattern: resolvedParts.map((part) => {
      if (bareScope) return `${roleCode(part.role)}（${scopeInfo.base === '同格' ? '同格' : '挿入'}）`
      if (!part.coversElement && part.elementText && !part.startsElement) return `${roleCode(part.role)}の一部`
      return roleCode(part.role)
    }).join('＋'),
    // 接続語だけのまとまりは、「接続語です」と重ねずに、つなぐ語の説明だけを出す。
    explanation: (
      connectorNotes.length && resolvedParts.length === 1 && resolvedParts[0].role === '接'
        ? [`${prefix}${connectorNotes.join(' ')}`, ...continuations]
        : [`${prefix}${described}です。`, relativeLead, ...connectorNotes, ...continuations]
    ).filter(Boolean).join(' '),
  })
}

export function roleCode(role) {
  return role === '接' ? '接続' : role
}

// 語順訳の意味フレーズ（英語の順に並ぶ）を台帳の語位置へ対応させる。
export function structureRolesForPhrases(structure, phrases = []) {
  let cursor = 0
  return phrases.map((phrase) => {
    const count = structureWords(phrase.spokenEn ?? phrase.en).length
    const roles = structureRolesForWordSpan(structure, cursor, cursor + count)
    cursor += count
    return roles
  })
}
