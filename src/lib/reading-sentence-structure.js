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

import { parseStructureMarkers } from './structure-markers.js'

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
  'to', '疑問詞to', '原形', '動名詞', 'ing限定', '現在分詞', '過去分詞', '分詞構文', '同格', '挿入',
])

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
  if (/^whose\b/.test(lead)) return 'whose'
  if (/^(?:[a-z]+\s+)+(?:which|whom)$/.test(lead)) return 'preposition'
  return 'pronoun'
}

export function structureUnitLabel(unit) {
  switch (unit.base) {
    case '関係': {
      const kind = relativeKind(unit)
      if (kind === 'adverb') return '関係副詞の節（形容詞節）'
      if (kind === 'preposition') return '前置詞＋関係代名詞の節（形容詞節）'
      if (kind === 'whose') return '関係代名詞 whose の節（形容詞節）'
      return '関係代名詞の節（形容詞節）'
    }
    case '関係,':
      return relativeKind(unit) === 'adverb'
        ? '非制限用法の関係副詞の節'
        : '非制限用法の関係代名詞の節'
    case '関係省略':
      return '関係詞が省略された節（形容詞節）'
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
      return `${ADVERBIAL_CLAUSE_KINDS[unit.detail]}を表す副詞節`
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
    default:
      return 'まとまり'
  }
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

// まとまりの直前にある前置詞（instead of のような2語以上の前置詞も含む）。
// 要素の中でまとまりの前に名詞があるとき（books about …）は前置詞ではないので返さない。
function prepositionBeforeUnit(container, unit) {
  const index = container.children.indexOf(unit)
  const before = normalizeStructureText(rawText(container.children.slice(0, Math.max(0, index))))
  const words = structureWords(before)
  if (!words.length) return ''
  // A, B, and C や A or B のように並んだ二つ目以降のまとまりは、一つ目と同じ前置詞を受ける。
  const previousIndex = container.children.slice(0, Math.max(0, index))
    .map((child, childIndex) => ({ child, childIndex }))
    .reverse()
    .find(({ child }) => child.kind === 'unit')?.childIndex ?? -1
  if (previousIndex >= 0) {
    const between = structureWords(rawText(container.children.slice(previousIndex + 1, index)))
    if (between.every((word) => /^(?:and|or|but|also|not|only)$/i.test(word))) {
      return prepositionBeforeUnit(container, container.children[previousIndex])
    }
  }
  const joined = words.join(' ').toLowerCase()
  const multi = /(?:^|\s)(instead of|because of|in spite of|as well as|according to|in addition to|rather than|such as|by means of|in terms of|apart from|out of)$/.exec(joined)
  if (multi) return words.slice(-multi[1].split(' ').length).join(' ')
  const last = words.at(-1).toLowerCase()
  const prepositions = new Set(['about', 'after', 'against', 'as', 'at', 'before', 'by', 'during', 'for', 'from', 'in', 'into', 'like', 'of', 'on', 'over', 'than', 'through', 'to', 'toward', 'towards', 'under', 'until', 'upon', 'with', 'within', 'without', 'beyond', 'despite', 'among', 'between', 'behind', 'besides', 'since', 'across', 'around', 'along', 'onto'])
  return prepositions.has(last) ? words.at(-1) : ''
}

function nounFunctionText(unit, container, scopeElements, scopeUnit) {
  const inside = scopeUnit ? `${structureUnitLabel(scopeUnit)}の中で、` : ''
  const verb = nearestVerb(scopeElements, container)
  const preposition = prepositionBeforeUnit(container, unit)
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

function unitFunctionText(unit, container, scopeElements, scopeUnit) {
  const inside = scopeUnit ? `${structureUnitLabel(scopeUnit)}の中で、` : ''
  const containerText = container ? nodeText(container) : ''
  const containerRole = container ? ROLE_NAMES[container.role] : ''
  const partOf = container && !['M', '接'].includes(container.role) && containerText !== unitText(unit)
    ? `（${containerRole}「${containerText}」の一部）`
    : ''
  // 形容詞を後ろから限定するまとまりは、すぐ前の語がその形容詞。
  const wordBefore = container
    ? structureWords(rawText(container.children.slice(0, Math.max(0, container.children.indexOf(unit))))).at(-1) ?? ''
    : ''
  const adjectiveBefore = wordBefore ? ` ${wordBefore} ` : ''
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
      if (container && /^(?:rather than|than|as|but|except)$/i.test(prepositionBeforeUnit(container, unit))) {
        return nounFunctionText(unit, container, scopeElements, scopeUnit)
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
          return `${inside}直前の形容詞${adjectiveBefore}の内容を後ろから限定します${partOf}。`
        }
        if (unit.adverbKind === '程度' && container && container.role !== 'M') {
          return `${inside}enough や too と組んで、どのくらいかという程度を表します${partOf}。`
        }
        return `${inside}${kind}を表し、修飾語Mとして働きます。`
      }
      if (unit.usage === '補語') {
        // depend on A to 〜 のように、前置詞の目的語 A が意味の上の主語になる形。
        if (container?.role === 'M') {
          const words = structureWords(rawText(container.children.slice(0, Math.max(0, container.children.indexOf(unit)))))
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
      return container ? nounFunctionText(unit, container, scopeElements, scopeUnit) : ''
    }
    default:
      return container ? nounFunctionText(unit, container, scopeElements, scopeUnit) : ''
  }
}

function unitText(unit) {
  return trimPhraseText(rawText(unit.children))
}

function unitMarker(unit) {
  return unitIsClause(unit) ? ['(', ')'] : ['<', '>']
}

function markedText(nodes) {
  return nodes.map((node) => {
    if (node.kind === 'text') return node.text
    if (node.kind === 'element') return markedText(node.children)
    const [open, close] = unitMarker(node)
    return ` ${open}${markedText(node.children).trim()}${close} `
  }).join('')
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
    collectWords(node.children, [...scopes, node], elements, output)
  }
}

function validateTree(nodes, errors, scopeUnit = null) {
  for (const node of nodes) {
    if (node.kind === 'text') {
      if (structureWords(node.text).length && !(scopeUnit && ['同格', '挿入'].includes(scopeUnit.base))) {
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
    if (child.kind === 'unit') validateUnit(child, errors)
  }
}

function validateUnit(unit, errors) {
  const elements = unit.children.filter((child) => child.kind === 'element')
  const bare = ['同格', '挿入'].includes(unit.base)
  if (!bare && !elements.length) {
    errors.push(`まとまり「${unitText(unit)}」の中に要素がありません`)
  }
  if (!bare && !elements.some((element) => element.role === 'V') && unit.base !== '強調') {
    errors.push(`まとまり「${unitText(unit)}」に動詞Vがありません`)
  }
  for (const child of unit.children) {
    if (child.kind === 'unit') errors.push(`まとまり「${unitText(child)}」は要素の中に置く必要があります`)
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

function collectUnits(nodes, scopeUnit, scopeElements, containerElement, output, depth) {
  for (const node of nodes) {
    if (node.kind === 'element') {
      collectUnits(node.children, scopeUnit, scopeElements, node, output, depth)
      continue
    }
    if (node.kind !== 'unit') continue
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
      functionText: unitFunctionText(node, containerElement, scopeElements, scopeUnit),
      parts: innerElements.map((element) => Object.freeze({
        role: element.role,
        text: nodeText(element),
      })),
      patterns: clause ? patternsForScope(innerElements) : [],
    })
    collectUnits(node.children, node, innerElements, null, output, depth + 1)
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

// 本文と台帳を照合して、画面表示に必要な情報をまとめる。
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
    if (!` ${before} `.includes(` ${target} `)) {
      errors.push(`「${unit.text}」が説明する ${unit.antecedent} が前にありません`)
    }
  }
  // 構造図は文末の句点を付けずに示す（本文の句点は上の英文で見える）。
  const marked = normalizeStructureText(markedText(root)).replace(/[.!?]$/u, '')
  const parsedMarkers = parseStructureMarkers(marked)
  const notes = options.notes ?? {}
  const unitNotes = options.unitNotes ?? {}
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
    }))),
    patterns: Object.freeze(patternsForScope(elements, { root: true })),
    units: Object.freeze(units.map((unit, index) => Object.freeze({
      id: index,
      ...unit,
      note: unitNotes[unit.text] ?? '',
    }))),
    words: Object.freeze(words),
    marked,
    structureTokens: parsedMarkers.tokens,
    notes,
    rules: options.rules ?? null,
  })
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
  return Object.freeze({
    scope: scopeInfo?.label ?? '',
    scopeUnitId: scopeInfo?.id ?? null,
    parts: Object.freeze(resolvedParts),
    pattern: resolvedParts.map((part) => {
      if (bareScope) return `${roleCode(part.role)}（${scopeInfo.base === '同格' ? '同格' : '挿入'}）`
      if (!part.coversElement && part.elementText && !part.startsElement) return `${roleCode(part.role)}の一部`
      return roleCode(part.role)
    }).join('＋'),
    explanation: [`${prefix}${described}です。`, relativeLead, ...continuations].filter(Boolean).join(' '),
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
