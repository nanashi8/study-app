// 品詞がちがうだけで同じ語から来た形（decide・decision・decisive・decisively）の候補を、つづりの規則で拾う。
// 候補は機械で拾えるが、本当に同じ語の別の品詞の形として並べてよいかは人が決める（src/data/word-forms.js）。

// 品詞の略号。見出し語の pos と同じ。
const N = '名'
const V = '動'
const A = '形'
const R = '副'

// [元の語の語尾, 形を変えた語の語尾, 元の品詞, 形を変えた語の品詞]。語尾 '' は元の語にそのまま付ける。
const RULES = [
  // 形容詞 → 副詞
  ['', 'ly', A, R], ['y', 'ily', A, R], ['le', 'ly', A, R], ['ic', 'ically', A, R], ['ue', 'uly', A, R],
  ['ll', 'lly', A, R],
  // 形容詞 → 名詞
  ['', 'ness', A, N], ['y', 'iness', A, N], ['', 'ity', A, N], ['e', 'ity', A, N], ['ble', 'bility', A, N],
  ['ent', 'ence', A, N], ['ant', 'ance', A, N], ['ent', 'ency', A, N], ['ant', 'ancy', A, N],
  ['ous', 'osity', A, N], ['ious', 'iety', A, N], ['ate', 'acy', A, N], ['', 'dom', A, N], ['', 'th', A, N],
  ['e', 'th', A, N], ['', 'ism', A, N], ['ic', 'icism', A, N], ['', 'ty', A, N], ['', 'y', A, N],
  ['al', 'ity', A, N], ['', 'ion', A, N], ['', 'er', A, N],
  // 形容詞 → 動詞
  ['', 'en', A, V], ['e', 'en', A, V], ['', 'ize', A, V], ['e', 'ize', A, V], ['', 'ify', A, V],
  ['e', 'ify', A, V], ['y', 'ify', A, V], ['ent', 'ence', A, V],
  // 名詞 → 形容詞
  ['', 'al', N, A], ['e', 'al', N, A], ['y', 'al', N, A], ['', 'ial', N, A], ['y', 'ial', N, A],
  ['ce', 'cial', N, A], ['ce', 'tial', N, A], ['', 'ful', N, A], ['y', 'iful', N, A], ['', 'ous', N, A],
  ['e', 'ous', N, A], ['y', 'ous', N, A], ['y', 'ious', N, A], ['', 'y', N, A], ['e', 'y', N, A],
  ['', 'ic', N, A], ['y', 'ic', N, A], ['e', 'ic', N, A], ['', 'ical', N, A], ['y', 'ical', N, A],
  ['', 'ly', N, A], ['', 'ish', N, A], ['', 'en', N, A], ['', 'able', N, A], ['', 'ary', N, A],
  ['er', 'ry', N, A], ['', 'ive', N, A], ['', 'ing', N, A], ['ion', 'ious', N, A], ['ce', 'cious', N, A],
  ['', 'ed', N, A], ['e', 'ed', N, A], ['y', 'able', N, A], ['le', 'ular', N, A], ['', 'ate', N, A],
  ['e', 'ate', N, A], ['', 'ual', N, A], ['e', 'ual', N, A], ['e', 'ive', N, A],
  // 名詞 → 動詞
  ['', 'ize', N, V], ['y', 'ize', N, V], ['e', 'ize', N, V], ['', 'ify', N, V], ['', 'en', N, V],
  ['', 'e', N, V], ['', 'ate', N, V],
  // 名詞 → 副詞
  ['', 'ly', N, R], ['', 'ward', N, R], ['', 'wards', N, R],
  // 動詞 → 名詞
  ['', 'tion', V, N], ['e', 'ation', V, N], ['', 'ation', V, N], ['e', 'ion', V, N], ['', 'ion', V, N],
  ['', 'ment', V, N], ['e', 'ment', V, N], ['', 'ance', V, N], ['e', 'ance', V, N], ['', 'ence', V, N],
  ['e', 'ence', V, N], ['', 'al', V, N], ['e', 'al', V, N], ['y', 'ial', V, N], ['e', 'ure', V, N],
  ['', 'ure', V, N], ['', 'er', V, N], ['e', 'er', V, N], ['', 'or', V, N], ['e', 'or', V, N],
  ['', 'ant', V, N], ['e', 'ant', V, N], ['', 'ent', V, N], ['', 'ee', V, N], ['', 'ing', V, N],
  ['e', 'ing', V, N], ['', 'y', V, N], ['e', 'y', V, N], ['', 'age', V, N], ['e', 'age', V, N], ['y', 'iage', V, N],
  ['d', 'sion', V, N], ['de', 'sion', V, N], ['t', 'sion', V, N], ['it', 'ission', V, N],
  ['ibe', 'iption', V, N], ['eive', 'eption', V, N], ['eive', 'eipt', V, N], ['ume', 'umption', V, N],
  ['ain', 'anation', V, N], ['ain', 'ention', V, N], ['ain', 'enance', V, N], ['y', 'ication', V, N],
  ['ify', 'ification', V, N], ['ounce', 'unciation', V, N], ['ce', 'ction', V, N], ['e', 'ition', V, N],
  ['lve', 'lution', V, N], ['ert', 'ersion', V, N], ['e', 'ison', V, N], ['', 'ery', V, N],
  ['', 'ist', V, N], ['', 'ism', V, N], ['orb', 'orption', V, N], ['oy', 'uction', V, N],
  ['', 'ancy', V, N], ['', 'ency', V, N], ['nd', 'nt', V, N], ['yze', 'ysis', V, N], ['ay', 'ait', V, N],
  // 動詞 → 形容詞
  ['', 'ive', V, A], ['e', 'ive', V, A], ['', 'ative', V, A], ['e', 'ative', V, A], ['', 'able', V, A],
  ['e', 'able', V, A], ['y', 'iable', V, A], ['', 'ible', V, A], ['e', 'ible', V, A], ['', 'ful', V, A],
  ['', 'ent', V, A], ['e', 'ent', V, A], ['', 'ant', V, A], ['e', 'ant', V, A], ['', 'ing', V, A],
  ['e', 'ing', V, A], ['', 'ed', V, A], ['e', 'ed', V, A], ['y', 'ied', V, A], ['d', 'sive', V, A],
  ['de', 'sive', V, A], ['it', 'issive', V, A], ['ce', 'ctive', V, A], ['ibe', 'iptive', V, A],
  ['', 'ory', V, A], ['e', 'ory', V, A], ['', 'atory', V, A], ['e', 'atory', V, A], ['y', 'iant', V, A],
  ['', 'en', V, A], ['', 'ate', V, A], ['ail', 'alent', V, A],
  // 動詞 → 副詞
  ['', 'ingly', V, R], ['e', 'ingly', V, R], ['', 'edly', V, R], ['e', 'edly', V, R],
]

// 規則で書けない形の変わり方（deep→depth、choose→choice など）。どちらも見出し語にあるときだけ候補にする。
const IRREGULAR = [
  ['deep', 'depth'], ['long', 'length'], ['strong', 'strength'], ['high', 'height'], ['wide', 'width'],
  ['broad', 'breadth'], ['true', 'truth'], ['young', 'youth'], ['choose', 'choice'], ['succeed', 'success'],
  ['die', 'death'], ['die', 'dead'], ['dead', 'death'], ['live', 'life'], ['live', 'alive'], ['believe', 'belief'],
  ['prove', 'proof'], ['sell', 'sale'], ['speak', 'speech'], ['lose', 'loss'], ['lose', 'lost'], ['think', 'thought'],
  ['see', 'sight'], ['fly', 'flight'], ['grow', 'growth'], ['bear', 'birth'], ['hot', 'heat'], ['full', 'fill'],
  ['food', 'feed'], ['blood', 'bleed'], ['sing', 'song'], ['give', 'gift'], ['weigh', 'weight'],
  ['advise', 'advice'], ['bath', 'bathe'], ['breath', 'breathe'], ['cloth', 'clothe'], ['able', 'ability'],
  ['poor', 'poverty'], ['proud', 'pride'], ['wise', 'wisdom'], ['deceive', 'deceit'], ['destroy', 'destruction'],
  ['destroy', 'destructive'], ['clear', 'clarity'], ['clear', 'clarify'], ['simple', 'simplicity'],
  ['simple', 'simplify'], ['simple', 'simply'], ['anger', 'angry'], ['hunger', 'hungry'], ['obey', 'obedient'],
  ['obey', 'obedience'], ['please', 'pleasure'], ['please', 'pleasant'], ['repeat', 'repetition'],
  ['compete', 'competition'], ['compete', 'competitive'], ['oppose', 'opposite'], ['oppose', 'opposition'],
  ['satisfy', 'satisfaction'], ['satisfy', 'satisfactory'], ['good', 'well'], ['maintain', 'maintenance'],
  ['enter', 'entrance'], ['enter', 'entry'], ['pronounce', 'pronunciation'], ['absorb', 'absorption'],
  ['describe', 'description'], ['explain', 'explanation'], ['compare', 'comparative'], ['compare', 'comparable'],
  ['imagine', 'imagination'], ['imagine', 'imaginary'], ['imagine', 'imaginative'], ['vary', 'variety'],
  ['vary', 'various'], ['vary', 'variation'], ['vary', 'variable'], ['behave', 'behavior'], ['fly', 'flight'],
  ['heal', 'health'], ['health', 'healthy'], ['steal', 'stealth'], ['moist', 'moisture'], ['mix', 'mixture'],
  ['depart', 'departure'], ['press', 'pressure'], ['please', 'pleased'], ['free', 'freedom'], ['free', 'freely'],
  ['sure', 'surely'], ['strange', 'stranger'], ['hero', 'heroic'], ['heroic', 'heroine'], ['humble', 'humility'],
  ['fly', 'flying'], ['begin', 'beginning'], ['sit', 'seat'], ['lie', 'lay'], ['rise', 'raise'], ['fall', 'fell'],
  ['critic', 'criticize'], ['critic', 'critical'], ['critic', 'criticism'], ['analyze', 'analysis'],
  ['analyze', 'analytical'], ['emphasize', 'emphasis'], ['emphasize', 'emphatic'], ['sympathy', 'sympathize'],
  ['sympathy', 'sympathetic'], ['apology', 'apologize'], ['economy', 'economic'], ['economy', 'economical'],
  ['economy', 'economize'], ['history', 'historic'], ['history', 'historical'], ['science', 'scientific'],
  ['science', 'scientist'], ['energy', 'energetic'], ['drama', 'dramatic'], ['system', 'systematic'],
  ['problem', 'problematic'], ['symbol', 'symbolic'], ['type', 'typical'], ['method', 'methodical'],
  ['possible', 'possibility'], ['probable', 'probability'], ['responsible', 'responsibility'],
  ['intend', 'intention'], ['intend', 'intent'], ['attend', 'attention'], ['attend', 'attendance'],
  ['attend', 'attentive'], ['pretend', 'pretense'], ['defend', 'defense'], ['defend', 'defensive'],
  ['offend', 'offense'], ['offend', 'offensive'], ['respond', 'response'], ['respond', 'responsive'],
  ['expand', 'expansion'], ['expand', 'expansive'], ['suspend', 'suspension'], ['comprehend', 'comprehension'],
  ['comprehend', 'comprehensive'], ['apprehend', 'apprehension'], ['apprehend', 'apprehensive'],
  ['recognize', 'recognition'], ['acquire', 'acquisition'], ['require', 'requirement'], ['inquire', 'inquiry'],
  ['assume', 'assumption'], ['consume', 'consumption'], ['presume', 'presumption'], ['resume', 'resumption'],
  ['exceed', 'excess'], ['exceed', 'excessive'], ['proceed', 'process'], ['proceed', 'procedure'],
  ['succeed', 'successful'], ['succeed', 'succession'], ['succeed', 'successive'], ['fail', 'failure'],
  ['permit', 'permission'], ['admit', 'admission'], ['omit', 'omission'], ['submit', 'submission'],
  ['transmit', 'transmission'], ['emit', 'emission'], ['commit', 'commission'], ['commit', 'commitment'],
  ['receive', 'reception'], ['receive', 'receipt'], ['perceive', 'perception'], ['conceive', 'conception'],
  ['conceive', 'concept'], ['deceive', 'deception'], ['deceive', 'deceptive'], ['solve', 'solution'],
  ['resolve', 'resolution'], ['revolve', 'revolution'], ['evolve', 'evolution'], ['pursue', 'pursuit'],
  ['argue', 'argument'], ['true', 'truly'], ['due', 'duly'], ['whole', 'wholly'], ['day', 'daily'],
  ['gay', 'gaily'], ['shy', 'shyly'], ['dry', 'dryly'], ['public', 'publicly'], ['sign', 'signature'],
  ['nation', 'national'], ['nation', 'nationality'], ['courage', 'courageous'], ['encourage', 'courage'],
  ['origin', 'original'], ['origin', 'originate'], ['origin', 'originality'], ['person', 'personality'],
  ['person', 'personal'], ['person', 'personally'], ['product', 'produce'], ['product', 'productive'],
  ['production', 'produce'], ['able', 'enable'], ['large', 'enlarge'], ['rich', 'enrich'], ['sure', 'ensure'],
  ['danger', 'endanger'], ['courage', 'encourage'], ['power', 'empower'], ['able', 'ably'],
  ['glory', 'glorious'], ['glory', 'glorify'], ['mystery', 'mysterious'], ['victory', 'victorious'],
  ['industry', 'industrial'], ['industry', 'industrious'], ['memory', 'memorize'], ['memory', 'memorial'],
  ['colony', 'colonial'], ['deny', 'denial'], ['try', 'trial'], ['comply', 'compliance'], ['rely', 'reliance'],
  ['rely', 'reliable'], ['ally', 'alliance'], ['apply', 'application'], ['apply', 'applicant'],
  ['multiply', 'multiplication'], ['imply', 'implication'], ['supply', 'supplier'], ['deny', 'undeniable'],
  ['beauty', 'beautiful'], ['beauty', 'beautify'], ['pity', 'pitiful'], ['duty', 'dutiful'], ['plenty', 'plentiful'],
  ['mercy', 'merciful'], ['fancy', 'fanciful'], ['envy', 'envious'], ['curious', 'curiosity'], ['anxious', 'anxiety'],
  ['generous', 'generosity'], ['various', 'variety'], ['pious', 'piety'], ['explode', 'explosion'],
  ['explode', 'explosive'], ['decide', 'decision'], ['decide', 'decisive'], ['divide', 'division'],
  ['provide', 'provision'], ['collide', 'collision'], ['include', 'inclusion'], ['include', 'inclusive'],
  ['exclude', 'exclusion'], ['exclude', 'exclusive'], ['conclude', 'conclusion'], ['conclude', 'conclusive'],
  ['persuade', 'persuasion'], ['persuade', 'persuasive'], ['invade', 'invasion'], ['invade', 'invasive'],
  ['evade', 'evasion'], ['evade', 'evasive'], ['erode', 'erosion'], ['allude', 'allusion'], ['delude', 'delusion'],
  ['extend', 'extension'], ['extend', 'extensive'], ['extend', 'extent'], ['tend', 'tendency'],
  ['converse', 'conversation'], ['reduce', 'reduction'], ['produce', 'production'], ['introduce', 'introduction'],
  ['introduce', 'introductory'], ['deduce', 'deduction'], ['seduce', 'seduction'], ['induce', 'induction'],
  ['maintain', 'maintenance'], ['retain', 'retention'], ['detain', 'detention'], ['sustain', 'sustenance'],
  ['abstain', 'abstention'], ['contain', 'container'], ['proclaim', 'proclamation'], ['exclaim', 'exclamation'],
  ['claim', 'claimant'], ['acclaim', 'acclamation'], ['sustain', 'sustainable'], ['join', 'joint'],
  ['recite', 'recitation'], ['freeze', 'frozen'], ['hide', 'hidden'], ['break', 'broken'], ['fall', 'fallen'],
  ['grow', 'grown'], ['know', 'known'], ['speak', 'spoken'], ['write', 'written'], ['forget', 'forgotten'],
  ['steal', 'stolen'], ['bear', 'born'], ['shake', 'shaken'], ['tear', 'torn'], ['wear', 'worn'], ['swell', 'swollen'],
  ['sink', 'sunken'], ['drink', 'drunk'], ['bind', 'bound'], ['relieve', 'relief'], ['grateful', 'gratitude'],
  ['shame', 'ashamed'], ['awe', 'awful'], ['complain', 'complaint'], ['identical', 'identity'], ['identify', 'identity'],
  ['sleep', 'asleep'], ['wake', 'awake'], ['guide', 'guidance'], ['judge', 'judgment'], ['anger', 'angry'],
  ['respond', 'responsible'], ['respond', 'responsibility'], ['friendly', 'friendship'], ['scholarly', 'scholarship'],
  ['know', 'knowledge'], ['excite', 'excitement'], ['invite', 'invitation'], ['cite', 'citation'],
]

const POS_ORDER = [V, N, A, R]

const toKey = (text) => String(text ?? '').toLowerCase()

function doubled(base, suffix) {
  // begin→beginning、forget→forgettable のように、子音1字で終わる語は語尾の前で子音を重ねる形もある。
  if (!/^[aeiouy]/.test(suffix)) return []
  if (!/[^aeiou][aeiou][bdgklmnprt]$/.test(base)) return []
  return [base + base.at(-1) + suffix]
}

/**
 * 見出し語どうしの組を [語1のid, 語2のid] で返す（重複なし・つづり順）。
 * words は { id, word, pos } の並び。品詞が同じ組は拾わない。
 */
export function wordFormCandidatePairs(words) {
  const usable = words.filter((word) => /^[a-z]+$/.test(word.word) && POS_ORDER.includes(word.pos))
  const bySpelling = new Map()
  for (const word of usable) {
    const key = toKey(word.word)
    if (!bySpelling.has(key)) bySpelling.set(key, [])
    bySpelling.get(key).push(word)
  }
  const pairs = new Map()
  const add = (a, b) => {
    if (a.id === b.id) return
    const [x, y] = [a.id, b.id].sort()
    pairs.set(`${x}|${y}`, [x, y])
  }
  for (const word of usable) {
    const base = toKey(word.word)
    for (const [from, to, fromPos, toPos] of RULES) {
      if (word.pos !== fromPos || !base.endsWith(from)) continue
      const stem = from ? base.slice(0, -from.length) : base
      if (stem.length < 2) continue
      const spellings = [stem + to, ...(from ? [] : doubled(base, to))]
      for (const spelling of spellings) {
        for (const other of bySpelling.get(spelling) ?? []) {
          if (other.pos === toPos) add(word, other)
        }
      }
    }
    // en- / em- を前に付けて動詞にする形（able→enable、power→empower）。
    if (word.pos === A || word.pos === N) {
      for (const prefix of ['en', 'em']) {
        for (const other of bySpelling.get(prefix + base) ?? []) {
          if (other.pos === V) add(word, other)
        }
      }
    }
  }
  for (const [a, b] of IRREGULAR) {
    for (const x of bySpelling.get(a) ?? []) {
      for (const y of bySpelling.get(b) ?? []) {
        if (x.pos !== y.pos) add(x, y)
      }
    }
  }
  return [...pairs.values()].sort(([a1, b1], [a2, b2]) => a1.localeCompare(a2) || b1.localeCompare(b2))
}

// 辞書に見出しのない形を拾うときに使わない語尾。規則どおりの活用形（-ing・-ed）や、
// 人・物を表す語尾・よく使われない語を大量に生む語尾は、見出し語どうしのときだけ使う。
const EXTRA_SKIPPED_ENDINGS = new Set([
  'ing', 'ed', 'ied', 'er', 'or', 'ee', 'ingly', 'edly', 'ist', 'ism', 'y', 'age', 'ant', 'ent', 'en', 'e',
  'ate', 'ish', 'ary', 'ive', 'ery', 'ure',
])

/**
 * 辞書に見出しのない形の候補を { of: 見出し語のid, word: つづり, pos } で返す（重複なし）。
 * lexicon は実在する英単語のつづりの集まり（発音辞書の見出し）。不規則な形の品詞は形を変えた語の品詞がわからないので '?'。
 */
export function wordFormExtraCandidates(words, lexicon) {
  const usable = words.filter((word) => /^[a-z]+$/.test(word.word) && POS_ORDER.includes(word.pos))
  const headwords = new Set(words.map((word) => toKey(word.word)))
  const found = new Map()
  const add = (of, spelling, pos) => {
    if (headwords.has(spelling) || !lexicon.has(spelling)) return
    const key = `${of}|${spelling}`
    if (!found.has(key)) found.set(key, { of, word: spelling, pos })
  }
  for (const word of usable) {
    const base = toKey(word.word)
    for (const [from, to, fromPos, toPos] of RULES) {
      if (word.pos !== fromPos || !base.endsWith(from)) continue
      if (EXTRA_SKIPPED_ENDINGS.has(to) && !(to === 'ly' && fromPos === A)) continue
      const stem = from ? base.slice(0, -from.length) : base
      if (stem.length < 3) continue
      add(word.id, stem + to, toPos)
    }
  }
  const byKey = new Map(usable.map((word) => [toKey(word.word), word]))
  for (const [a, b] of IRREGULAR) {
    if (byKey.has(a) && !headwords.has(b)) add(byKey.get(a).id, b, '?')
    if (byKey.has(b) && !headwords.has(a)) add(byKey.get(b).id, a, '?')
  }
  return [...found.values()].sort((x, y) => x.of.localeCompare(y.of) || x.word.localeCompare(y.word))
}

// node scripts/word-form-candidates.mjs で、組をつないだまとまりを表示する（台帳を作るときの下書き）。
if (import.meta.url === `file://${process.argv[1]}`) {
  const { ALL_WORDS } = await import('../src/data/vocab.js')
  const pairs = wordFormCandidatePairs(ALL_WORDS)
  const parent = new Map()
  const find = (x) => {
    while (parent.get(x) !== x) x = parent.get(x)
    return x
  }
  for (const [a, b] of pairs) {
    for (const x of [a, b]) if (!parent.has(x)) parent.set(x, x)
    parent.set(find(a), find(b))
  }
  const groups = new Map()
  for (const x of parent.keys()) {
    const root = find(x)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(x)
  }
  console.log(JSON.stringify({ pairs: pairs.length, groups: groups.size }))
  const byId = new Map(ALL_WORDS.map((word) => [word.id, word]))
  for (const group of [...groups.values()].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(group.map((id) => `${id}(${byId.get(id).pos}:${byId.get(id).meaning})`).join(' / '))
  }
}
