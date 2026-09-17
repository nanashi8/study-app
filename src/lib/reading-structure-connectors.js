// 構造台帳から、節や文をつなぐ語（接続詞・関係詞・疑問詞など）の種類と見分け方を組み立てる。
// 生徒が迷いやすい「that が関係代名詞か、接続詞か、同格か」「about who は前置詞＋関係代名詞か」を、
// 台帳に書いた節の種類と、節の中の要素（欠けた語があるか）から説明する。

const WORD_PATTERN = /[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*(?:[-‐][A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*)*/g

function words(text = '') {
  return [...`${text}`.matchAll(WORD_PATTERN)].map((match) => match[0])
}

function rawText(node) {
  if (node.kind === 'text') return node.text
  return node.children.map(rawText).join('')
}

function plain(node) {
  return rawText(node)
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?)\]”’])/g, '$1')
    .trim()
    .replace(/[\s,;:—–-]+$/u, '')
    .replace(/^[\s,;:—–-]+/u, '')
    .replace(/[.!?]$/u, '')
    .trim()
}

function directElements(unitNode) {
  return unitNode.children.filter((child) => child.kind === 'element')
}

// 間に修飾語だけをはさんで続く動詞（may … turn out）を一つの動詞として書く。
function verbGroupText(elements, start = 0) {
  const index = elements.findIndex((element, position) => position >= start && element.role === 'V')
  if (index < 0) return ''
  const pieces = [plain(elements[index])]
  let cursor = index
  while (elements[cursor + 1]?.role === 'M' && elements[cursor + 2]?.role === 'V') {
    pieces.push(plain(elements[cursor + 2]))
    cursor += 2
  }
  return pieces.join(' … ')
}

function roleText(elements, roles) {
  const element = elements.find((item) => roles.includes(item.role))
  return element ? plain(element) : ''
}

const ROLE_IN_CLAUSE = Object.freeze({
  S: '主語S',
  O: '目的語O',
  O1: '間接目的語O1',
  O2: '直接目的語O2',
  C: '補語C',
  M: '修飾語M',
})

function capitalizeSentence(text) {
  const trimmed = text.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim().replace(/[,.;:]$/u, '')
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}.`
}

// 関係代名詞を先行詞に置きかえて、一つの文に戻す（主格・目的格・補語だけ）。
function restoreRelativeSentence(unitNode, antecedent) {
  const elements = directElements(unitNode)
  const [lead, ...rest] = elements
  if (!lead || !antecedent || antecedent === '前の内容') return ''
  const leadWords = words(plain(lead)).map((word) => word.toLowerCase())
  if (leadWords.length !== 1 || !['that', 'which', 'who', 'whom'].includes(leadWords[0])) return ''
  if (lead.role === 'S') return capitalizeSentence([antecedent, ...rest.map(rawText)].join(' '))
  if (!['O', 'C'].includes(lead.role)) return ''
  // ほかに目的語がある（不定詞の中の目的語が欠けるなど）ときは、戻す位置を決められないので出さない。
  if (rest.some((element) => ['O', 'O1', 'O2', '仮O', '真O'].includes(element.role))) return ''
  const lastVerb = rest.map((element) => element.role).lastIndexOf('V')
  if (lastVerb < 0) return ''
  const pieces = rest.map(rawText)
  pieces.splice(lastVerb + 1, 0, antecedent)
  return capitalizeSentence(pieces.join(' '))
}

// 目的格の関係代名詞が省略された節を、先行詞を目的語の位置に戻した一文にする。
function restoreOmittedRelative(unitNode, antecedent, gapVerb) {
  const clauseWords = words(rawText(unitNode))
  if (!clauseWords.length || !antecedent) return ''
  let insertAt = -1
  if (gapVerb) {
    const target = gapVerb.toLowerCase()
    insertAt = clauseWords.map((word) => word.toLowerCase()).lastIndexOf(target)
  } else {
    const elements = directElements(unitNode)
    if (elements.some((element) => ['O', 'O1', 'O2', '仮O', '真O'].includes(element.role))) return ''
    const lastVerbIndex = elements.map((element) => element.role).lastIndexOf('V')
    if (lastVerbIndex < 0) return ''
    insertAt = words(elements.slice(0, lastVerbIndex + 1).map(rawText).join(' ')).length - 1
  }
  if (insertAt < 0) return ''
  const restored = [...clauseWords.slice(0, insertAt + 1), antecedent, ...clauseWords.slice(insertAt + 1)]
  return capitalizeSentence(restored.join(' '))
}

const RELATIVE_PRONOUN_USE = Object.freeze({
  who: 'who は人を受ける',
  whom: 'whom は人を受ける',
  which: 'which は、もの・ことを受ける',
  that: 'that は人にも、もの・ことにも使える',
})

function relativeExplanation(unit) {
  const node = unit.node
  const elements = directElements(node)
  const lead = elements[0]
  const leadText = lead ? plain(lead) : ''
  const leadLower = leadText.toLowerCase()
  const antecedent = unit.antecedent
  const subject = roleText(elements.slice(1), ['S', '仮S'])
  const verb = verbGroupText(elements, 1)
  const nonRestrictive = unit.base === '関係,'

  if (antecedent === '前の内容') {
    return {
      word: leadText,
      chip: '関係代名詞',
      kind: '前の節の内容を受ける関係代名詞',
      explanation: `コンマの後ろの ${leadText} は、前の節の内容全体を受ける関係代名詞です。節の中で${ROLE_IN_CLAUSE[lead?.role] ?? '主語S'}になり、「そしてそのことが〜」と前から順に読みます。`,
    }
  }
  if (/^(?:where|when|why)$/.test(leadLower)) {
    const sense = {
      where: '「そこで」「その場面で」と場所や場面',
      when: '「そのときに」と時',
      why: '「その理由で」と理由',
    }[leadLower]
    return {
      word: leadText,
      chip: '関係副詞',
      kind: nonRestrictive ? '関係副詞（非制限用法）' : '関係副詞',
      explanation: `${leadText} は関係副詞です。直前の ${antecedent}（先行詞）を受けて、節の中で${sense}を表す修飾語Mになります。後ろは主語 ${subject} と動詞 ${verb} に必要な語がそろった文で、欠けた語がありません。欠けた語を補う関係代名詞 which とは、ここで見分けます。`,
    }
  }
  const prepositional = /^([a-z]+(?:\s+[a-z]+)*)\s+(which|whom)$/.exec(leadLower)
  if (prepositional) {
    const preposition = leadText.split(/\s+/).slice(0, -1).join(' ')
    const pronoun = leadText.split(/\s+/).at(-1)
    return {
      word: leadText,
      chip: '前置詞＋関係代名詞',
      kind: '前置詞＋関係代名詞',
      explanation: `${leadText} は「前置詞＋関係代名詞」です。${pronoun} が直前の ${antecedent}（先行詞）を受けて、「${preposition} ${antecedent}」の意味で節の中の修飾語Mになります。後ろは主語 ${subject} と動詞 ${verb} に必要な語がそろった文です。`,
    }
  }
  if (leadLower.startsWith('whose ')) {
    const noun = leadText.split(/\s+/).slice(1).join(' ')
    return {
      word: 'whose',
      chip: '関係代名詞',
      kind: '関係代名詞（所有格）',
      explanation: `whose は所有格の関係代名詞です。直前の ${antecedent}（先行詞）を受けて、whose ${noun} で「${antecedent} の ${noun}」を表します。後ろに冠詞のない名詞 ${noun} が続く点で見分けます。節の中では whose ${noun} が${ROLE_IN_CLAUSE[lead?.role] ?? '主語S'}です。`,
    }
  }
  const use = RELATIVE_PRONOUN_USE[leadLower] ?? `${leadText} は`
  const restored = restoreRelativeSentence(node, antecedent)
  const restoreText = restored ? `${leadText} を ${antecedent} に置きかえると、「${restored}」という一つの文に戻ります。` : ''
  const commaLead = nonRestrictive ? 'コンマの後ろの ' : ''
  const commaNote = nonRestrictive
    ? `コンマのある非制限用法なので、${antecedent} に情報を付け足すように、前から順に読みます。`
    : ''
  if (lead?.role === 'O') {
    return {
      word: leadText,
      chip: '関係代名詞',
      kind: nonRestrictive ? '関係代名詞（目的格・非制限用法）' : '関係代名詞（目的格）',
      explanation: `${commaLead}${use}関係代名詞（目的格）です。直前の ${antecedent}（先行詞）を受けて、節の中で ${verb} の目的語Oになります。後ろに主語 ${subject} と動詞 ${verb} が続くのに、${verb} の目的語がない形になっている点で見分けます。${restoreText}${commaNote}${nonRestrictive ? '' : '目的格の関係代名詞は省略されることもあります。'}`,
    }
  }
  if (lead?.role === 'C') {
    return {
      word: leadText,
      chip: '関係代名詞',
      kind: '関係代名詞（補語）',
      explanation: `${commaLead}${use}関係代名詞です。直前の ${antecedent}（先行詞）を受けて、節の中で ${verb} の補語Cになります。${restoreText}${commaNote}`,
    }
  }
  return {
    word: leadText,
    chip: '関係代名詞',
    kind: nonRestrictive ? '関係代名詞（主格・非制限用法）' : '関係代名詞（主格）',
    explanation: `${commaLead}${use}関係代名詞（主格）です。直前の ${antecedent}（先行詞）を受けて、節の中で主語Sになります。${leadText} のすぐ後ろに動詞 ${verb} が続き、主語が欠けた形になっている点で見分けます。${restoreText}${commaNote}`,
  }
}

function omittedRelativeExplanation(unit) {
  const elements = directElements(unit.node)
  const subject = roleText(elements, ['S', '仮S'])
  const verb = verbGroupText(elements)
  const antecedent = unit.antecedent
  if (unit.node.omittedKind === '関係副詞') {
    const way = /\bway$/i.test(antecedent)
      ? `${antecedent} の後ろに how は置かず、${antecedent} ＋主語＋動詞で「${subject} が ${verb} するやり方」と読みます。`
      : ''
    return {
      word: '',
      chip: '',
      kind: '関係副詞の働きをする語の省略',
      explanation: `${antecedent} のすぐ後ろに、主語 ${subject} と動詞 ${verb} が続いています。後ろの文に欠けた語はなく、関係副詞の働きをする語（that・in which など）が省略された形です。${way}`,
    }
  }
  const gapVerb = unit.node.gapVerb || verb
  const restored = restoreOmittedRelative(unit.node, antecedent, unit.node.gapVerb)
  const restoreText = restored ? `${antecedent} を ${gapVerb} の後ろに戻すと、「${restored}」という一つの文になります。` : ''
  return {
    word: '',
    chip: '',
    kind: '目的格の関係代名詞の省略',
    explanation: `${antecedent} のすぐ後ろに、主語 ${subject} と動詞 ${verb} が続いています。目的格の関係代名詞（that・which）が省略された形で、${gapVerb} の目的語が欠けています。${restoreText}`,
  }
}

const INTERROGATIVE_MEANINGS = Object.freeze({
  who: { S: 'だれが〜するのか', O: 'だれを〜するのか', default: 'だれが〜するのか' },
  whom: { default: 'だれを〜するのか' },
  what: { S: '何が〜するのか', O: '何を〜するのか', C: '何であるのか', default: '何を〜するのか' },
  which: { default: 'どれが（どれを）〜するのか' },
  why: { default: 'なぜ〜するのか' },
  where: { default: 'どこで〜するのか' },
  when: { default: 'いつ〜するのか' },
  whose: { default: 'だれのものが（を）〜するのか' },
})

function interrogativeExplanation(unit) {
  const elements = directElements(unit.node)
  const lead = elements[0]
  const leadText = lead ? plain(lead) : ''
  const leadWords = words(leadText).map((word) => word.toLowerCase())
  const wh = leadWords[0] ?? ''
  let meaning = INTERROGATIVE_MEANINGS[wh]?.[lead?.role] ?? INTERROGATIVE_MEANINGS[wh]?.default ?? ''
  if (wh === 'how') {
    if (leadWords.length === 1) meaning = 'どのように〜するのか'
    else if (/^(?:many|much)$/.test(leadWords[1] ?? '')) meaning = 'どれだけ〜なのか'
    else if (leadWords[1] === 'long') meaning = 'どれくらいの間〜なのか'
    else if (leadWords[1] === 'often') meaning = 'どれくらいの頻度で〜するのか'
    else meaning = 'どれほど〜なのか'
  }
  if (['which', 'what', 'whose'].includes(wh) && leadWords.length > 1) {
    const noun = leadText.split(/\s+/).slice(1).join(' ')
    meaning = {
      which: `どの ${noun} が（を）〜するのか`,
      what: `どんな ${noun} が（を）〜するのか`,
      whose: `だれの ${noun} が（を）〜するのか`,
    }[wh]
  }
  const subject = roleText(elements.slice(1), ['S', '仮S'])
  const verb = verbGroupText(elements, 1) || verbGroupText(elements)
  const order = lead?.role === 'S'
    ? `${leadText} が節の主語なので、すぐ後ろに動詞 ${verb} が続きます。`
    : `${leadText} の後ろは主語 ${subject}＋動詞 ${verb} の順で、疑問文の語順（助動詞や be動詞が主語の前に出る形）にはなりません。`
  return {
    word: leadText,
    chip: '疑問詞',
    kind: '疑問詞（間接疑問）',
    explanation: `${leadText} は疑問詞で、「${meaning}」という名詞のまとまり（間接疑問）を作ります。前に受ける名詞（先行詞）がないので、関係詞ではありません。${order}`,
  }
}

const SUBORDINATE_MEANINGS = Object.freeze({
  when: { 時: '〜するとき' },
  whenever: { 時: '〜するときはいつでも' },
  while: { 時: '〜する間に', 対比: '〜する一方で', 譲歩: '〜だけれども' },
  before: { 時: '〜する前に' },
  after: { 時: '〜したあとで' },
  until: { 時: '〜するまで' },
  till: { 時: '〜するまで' },
  since: { 時: '〜して以来', 理由: '〜なので' },
  once: { 時: 'いったん〜すると', 条件: 'いったん〜すると' },
  'as soon as': { 時: '〜するとすぐに' },
  because: { 理由: '〜なので' },
  as: { 理由: '〜なので', 様態: '〜するように', 時: '〜するとき', 比例: '〜するにつれて', 比較: '〜と同じくらい' },
  'now that': { 理由: '今や〜なので' },
  if: { 条件: 'もし〜なら' },
  unless: { 条件: '〜しない限り' },
  'as long as': { 条件: '〜する限り' },
  'in case': { 条件: '〜する場合に備えて' },
  'even if': { 譲歩: 'たとえ〜でも' },
  although: { 譲歩: '〜だけれども' },
  though: { 譲歩: '〜だけれども' },
  'even though': { 譲歩: '〜だけれども' },
  whereas: { 対比: '〜する一方で' },
  'so that': { 目的: '〜するために', 結果: 'その結果〜' },
  so: { 目的: '〜するために', 結果: 'その結果〜' },
  'in order that': { 目的: '〜するために' },
  than: { 比較: '〜よりも' },
  'even when': { 時: '〜するときでさえ', 譲歩: '〜するときでさえ' },
  'just as': { 様態: 'ちょうど〜するように', 比較: 'ちょうど〜するように' },
  'as if': { 様態: 'まるで〜かのように' },
  'as though': { 様態: 'まるで〜かのように' },
  'as far as': { 範囲: '〜する限りでは' },
  where: { 場所: '〜するところで' },
  wherever: { 場所: '〜するところならどこでも' },
})

const ADVERBIAL_KIND_NAMES = Object.freeze({
  時: '時', 理由: '理由', 条件: '条件', 譲歩: '譲歩', 対比: '対比', 目的: '目的', 結果: '結果',
  様態: '様態', 比較: '比較', 程度: '程度', 範囲: '範囲', 場所: '場所', 比例: '比例',
})

function adverbialExplanation(unit) {
  const elements = directElements(unit.node)
  const lead = elements[0]
  const leadText = lead ? plain(lead) : ''
  const leadLower = leadText.toLowerCase()
  const kind = ADVERBIAL_KIND_NAMES[unit.detail] ?? ''
  const subject = roleText(elements, ['S', '仮S'])
  const verb = verbGroupText(elements)
  const target = unit.containerVerb ? `動詞 ${unit.containerVerb} を修飾します` : '文の内容を修飾します'
  // however serious … のように、however＋形容詞が節の先頭に出る譲歩。
  if (lead?.role !== '接' && /^however\b/i.test(leadText)) {
    const adjective = leadText.split(/\s+/).slice(1).join(' ')
    return {
      word: 'however',
      chip: '複合関係副詞',
      kind: '複合関係副詞 however',
      explanation: `however は「どれほど〜でも」という譲歩の意味を作る語（複合関係副詞）です。however ＋ ${adjective} が節の先頭に出て、後ろに主語 ${subject} と動詞 ${verb} が続きます。「しかし」の意味の副詞ではありません。`,
    }
  }
  if (lead?.role !== '接') return null
  const meaning = SUBORDINATE_MEANINGS[leadLower]?.[unit.detail] ?? ''
  const head = meaning
    ? `${leadText} は「${meaning}」という${kind}を表す接続詞（従属接続詞）です。`
    : `${leadText} は${kind}を表す接続詞（従属接続詞）です。`
  if (!subject) {
    const next = elements[1]
    const nextText = next ? plain(next) : ''
    const form = next?.role === 'V'
      ? (/ing$/i.test(words(nextText).at(-1) ?? '') ? `-ing形の ${nextText}` : `過去分詞の ${nextText}`)
      : `${nextText}`
    return {
      word: leadText,
      chip: '接続詞',
      kind: `従属接続詞（${kind}）`,
      explanation: `${head}主語と be動詞が省かれ、${leadText} のすぐ後ろに ${form} が続いています。主節の主語と be動詞を補って読みます。このまとまりが${target}。`,
    }
  }
  if (leadLower === 'than') {
    return {
      word: leadText,
      chip: '接続詞',
      kind: '接続詞 than（比較）',
      explanation: `than は比べる相手を表す接続詞で、「〜よりも」と読みます。後ろに主語 ${subject} と動詞 ${verb} が続くので、節として ( ) でくくります。`,
    }
  }
  return {
    word: leadText,
    chip: '接続詞',
    kind: `従属接続詞（${kind}）`,
    explanation: `${head}後ろの主語 ${subject} と動詞 ${verb} をひとまとまりの副詞節にして、${target}。`,
  }
}

function nounClauseExplanation(unit) {
  const elements = directElements(unit.node)
  const lead = elements[0]
  const leadText = lead ? plain(lead) : ''
  const subject = roleText(elements, ['S', '仮S'])
  const verb = verbGroupText(elements)
  switch (unit.base) {
    case 'that節':
      return {
        word: leadText,
        chip: '接続詞',
        kind: '接続詞 that（名詞節）',
        explanation: `${leadText} は接続詞で、「〜ということ」という名詞のまとまり（名詞節）を作ります。後ろは主語 ${subject} と動詞 ${verb} に必要な語がそろった文で、欠けた語がありません。欠けた語を補う関係代名詞の that とは、ここで見分けます。前の名詞の中身を説明する同格の that でもありません。`,
      }
    case 'that省略':
      return {
        word: '',
        chip: '',
        kind: '接続詞 that の省略',
        explanation: `${unit.containerVerb ? `${unit.containerVerb} の後ろで、` : ''}接続詞 that が省略されています。主語 ${subject} と動詞 ${verb} から始まるまとまりが、「〜ということ」という名詞節です。`,
      }
    case '同格that': {
      const noun = unit.antecedent
      return {
        word: leadText,
        chip: '同格の that',
        kind: '同格の that（接続詞）',
        explanation: `${leadText} は同格の that（接続詞）です。直前の名詞 ${noun} の中身を「〜という ${noun}」と説明します。後ろは主語 ${subject} と動詞 ${verb} に必要な語がそろった文で、欠けた語がありません。欠けた語を補う関係代名詞の that とは、ここで見分けます。`,
      }
    }
    case 'whether節':
      return {
        word: leadText,
        chip: '接続詞',
        kind: '接続詞 whether（名詞節）',
        explanation: `${leadText} は接続詞で、「〜かどうか」という名詞のまとまり（名詞節）を作ります。後ろは主語 ${subject} と動詞 ${verb} に必要な語がそろった文です。`,
      }
    case 'if節':
      return {
        word: leadText,
        chip: '接続詞',
        kind: '接続詞 if（名詞節）',
        explanation: `この ${leadText} は「もし〜なら」の意味ではなく、「〜かどうか」という名詞のまとまり（名詞節）を作る接続詞です。${unit.containerVerb ? `${unit.containerVerb} の目的語になっている点で、` : ''}条件を表す if と見分けます。`,
      }
    case 'what節':
      return {
        word: leadText,
        chip: '関係代名詞 what',
        kind: '関係代名詞 what',
        explanation: `${leadText} は先行詞を中に含む関係代名詞で、「〜すること・〜するもの」という名詞のまとまりを作ります。前に先行詞がなく、節の中で${ROLE_IN_CLAUSE[lead?.role] ?? '主語S'}になっています。`,
      }
    case '強調':
      return {
        word: 'that',
        chip: '強調構文の that',
        kind: '強調構文の that',
        explanation: 'It is と that の間に強調したい語句をはさむ強調構文の that です。It is と that を取り除いても文が成り立つ点で見分けます。',
      }
    default:
      return null
  }
}

// 節の種類ごとの「つなぐ語」の説明。節でないまとまりは null。
export function describeUnitConnector(unit) {
  switch (unit.base) {
    case '関係':
    case '関係,':
      return relativeExplanation(unit)
    case '関係省略':
      return omittedRelativeExplanation(unit)
    case '疑問詞節':
      return interrogativeExplanation(unit)
    case '副詞節':
      return adverbialExplanation(unit)
    case 'that節':
    case 'that省略':
    case '同格that':
    case 'whether節':
    case 'if節':
    case 'what節':
    case '強調':
      return nounClauseExplanation(unit)
    default:
      return null
  }
}

const COORDINATE_CONJUNCTIONS = Object.freeze({
  and: { meaning: '', note: '' },
  but: { meaning: 'しかし', note: '前と反対の内容を続けます' },
  or: { meaning: 'または', note: 'どちらかを示します' },
  so: { meaning: 'だから', note: '前の内容の結果を続けます' },
  yet: { meaning: 'それでも', note: '前から予想されることと反対の内容を続けます' },
  nor: { meaning: '〜もまた…ない', note: '否定の内容を続けます' },
  for: { meaning: 'というのは', note: '理由を後から付け足します' },
})

const CONJUNCTIVE_ADVERBS = Object.freeze({
  however: '「しかし」と前と反対の内容',
  therefore: '「したがって」と前から導く結論',
  thus: '「このように」と前から導く結論',
  consequently: '「その結果」と前の内容の結果',
  hence: '「それゆえ」と前から導く結論',
  moreover: '「さらに」と前に加える内容',
  furthermore: '「さらに」と前に加える内容',
  nevertheless: '「それでも」と前と反対の内容',
  nonetheless: '「それでも」と前と反対の内容',
  instead: '「その代わりに」と前に代わる内容',
  otherwise: '「そうでなければ」と前と逆の場合',
  meanwhile: '「その一方で」と同時の別の内容',
})

// 接続語の要素 [接 …] と、文をつなぐ副詞 [M however] の説明。
// elements は同じ節（または文全体）の要素の並び、index はその中の位置。
export function describeLinkElement(element, elements, index) {
  const text = plain(element)
  const lower = text.toLowerCase()
  if (element.role === 'M') {
    const sense = CONJUNCTIVE_ADVERBS[lower]
    if (!sense) return null
    return {
      word: text,
      chip: '接続副詞',
      kind: '接続副詞',
      explanation: `${text} は接続副詞で、${sense}を示します。接続詞ではないので、これだけで節と節を文法的につなぐことはできず、前の文とはピリオドやセミコロンで区切ります。`,
    }
  }
  if (element.role !== '接') return null
  const coordinate = COORDINATE_CONJUNCTIONS[lower]
  if (!coordinate) return null
  if (lower === 'nor') {
    return {
      word: text,
      chip: '等位接続詞',
      kind: '等位接続詞 nor',
      explanation: `${text} は「〜もまた…ない」と否定の内容を続ける接続詞です。後ろは疑問文と同じ語順（倒置）になります。`,
    }
  }
  const next = elements.slice(index + 1).find((item) => item.role !== 'M')
  const previousSubject = [...elements.slice(0, index)].reverse().find((item) => ['S', '仮S'].includes(item.role))
  let joins = '前後の語句'
  let tip = ''
  // or の後ろが副詞節だけのときは、節どうしを並べている。
  const nextElement = elements[index + 1]
  const nextIsAdverbialClause = nextElement?.role === 'M' &&
    nextElement.children.some((child) => child.kind === 'unit' && child.base === '副詞節')
  if (nextIsAdverbialClause) {
    return {
      word: text,
      chip: '等位接続詞',
      kind: `等位接続詞 ${lower}`,
      explanation: `${text} は等位接続詞で、前後の副詞節を対等に${lower === 'and' ? '並べます' : `つなぎ、「${coordinate.meaning}」と${coordinate.note}`}。`,
    }
  }
  if (next && ['S', '仮S'].includes(next.role)) {
    joins = '前の節と後ろの節'
    tip = `後ろに主語 ${plain(next)} が続くので、節と節をつないでいると分かります。`
  } else if (next?.role === 'V') {
    joins = '前の述語と後ろの述語'
    tip = previousSubject
      ? `後ろにすぐ動詞 ${plain(next)} が続くので、主語 ${plain(previousSubject)} を共通にした述語どうしをつないでいると分かります。`
      : `後ろにすぐ動詞 ${plain(next)} が続くので、述語どうしをつないでいると分かります。`
  }
  const body = lower === 'and'
    ? `${joins}を対等に並べます。`
    : `${joins}を対等につなぎ、「${coordinate.meaning}」と${coordinate.note}。`
  return {
    word: text,
    chip: '等位接続詞',
    kind: `等位接続詞 ${lower}`,
    explanation: `${text} は等位接続詞で、${body}${tip}`,
  }
}

// 語順訳のまとまりに添える、一文の短い注記。
export function shortConnectorNote(info, unit = null) {
  if (!info) return ''
  const word = info.word
  const antecedent = unit?.antecedent ?? ''
  const kind = info.kind
  if (kind === '前の節の内容を受ける関係代名詞') return `${word} は前の節の内容を受ける関係代名詞です。`
  if (kind.startsWith('関係代名詞') || kind.startsWith('関係副詞（') || kind === '関係副詞') {
    return `${word} は${kind}で、先行詞 ${antecedent} を受けます。`
  }
  if (kind === '前置詞＋関係代名詞') return `${word} は前置詞＋関係代名詞で、先行詞 ${antecedent} を受けます。`
  if (kind === '目的格の関係代名詞の省略') return `${antecedent} の後ろで、目的格の関係代名詞が省略されています。`
  if (kind === '関係副詞の働きをする語の省略') return `${antecedent} の後ろで、関係副詞の働きをする語が省略されています。`
  if (kind === '疑問詞（間接疑問）') return `${word} は疑問詞で、間接疑問の名詞節を作ります。`
  if (kind === '複合関係副詞 however') return 'however は「どれほど〜でも」という譲歩を表します。'
  if (kind.startsWith('従属接続詞')) {
    const inner = /（(.+)）/u.exec(kind)?.[1] ?? ''
    return `${word} は${inner}を表す接続詞で、副詞節を作ります。`
  }
  if (kind === '接続詞 that（名詞節）') return `${word} は接続詞で、「〜ということ」という名詞節を作ります。`
  if (kind === '接続詞 that の省略') return '接続詞 that が省略されています。'
  if (kind === '同格の that（接続詞）') return `${word} は同格の that で、${antecedent} の中身を説明します。`
  if (kind === '接続詞 whether（名詞節）' || kind === '接続詞 if（名詞節）') {
    return `${word} は接続詞で、「〜かどうか」という名詞節を作ります。`
  }
  if (kind === '接続詞 than（比較）') return 'than は比べる相手を表す接続詞です。'
  if (kind === '関係代名詞 what') return 'what は先行詞を含む関係代名詞で、「〜すること」という名詞節を作ります。'
  if (kind === '強調構文の that') return 'It is と that で強調したい語句をはさむ強調構文です。'
  if (kind.startsWith('等位接続詞')) return `${word} は等位接続詞です。`
  if (kind === '接続副詞') return `${word} は接続副詞で、接続詞ではありません。`
  return ''
}
