// 長文（passages）に出てくる単語の語義を必ず引けるようにするためのリゾルバ。
//
// 解決の優先順位：
//   1. 文ごとのインライン語義 sentence.gloss[key]（id付きのことも）
//   2. 語彙データ（src/data/vocab.js）に表層形そのままで一致
//   3. 原形化（複数形・-ed/-ing 等を落とす）して語彙データに一致
//   4. 補助辞書 READER_GLOSS（機能語や語彙データに無い基本語）
//
// 返り値 { ja, id }：ja=日本語の意味、id=語彙データの単語ID（あればマイ単語に追加できる）。

import { getWord } from './vocab.js'

const toId = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

// 表層形の意味を保ったまま、共通辞書の原形IDへ結び付ける不規則変化。
// 単なる語尾削除では誤る形だけを明示し、本文タップ時の語義も文脈に合わせる。
export const PASSAGE_IRREGULAR_FORMS = {
  began: { lemma: 'begin', ja: '始めた・始まった' },
  became: { lemma: 'become', ja: '〜になった' },
  begun: { lemma: 'begin', ja: '始めた・始まった（beginの過去分詞）' },
  broken: { lemma: 'break', ja: '壊れた・壊された' },
  built: { lemma: 'build', ja: '建てた・作られた' },
  children: { lemma: 'child', ja: '子どもたち' },
  chose: { lemma: 'choose', ja: '選んだ' },
  chosen: { lemma: 'choose', ja: '選ばれた・選んだ（chooseの過去分詞）' },
  fallen: { lemma: 'fall', ja: '落ちた・減少した（fallの過去分詞）' },
  forgot: { lemma: 'forget', ja: '忘れた' },
  gave: { lemma: 'give', ja: '与えた' },
  grew: { lemma: 'grow', ja: '育った・強くなった' },
  grown: { lemma: 'grow', ja: '育てた・育った（growの過去分詞）' },
  knew: { lemma: 'know', ja: '知っていた' },
  left: { lemma: 'leave', ja: '去った・残された' },
  made: { lemma: 'make', ja: '作った・〜させた' },
  known: { lemma: 'know', ja: '知られている（knowの過去分詞）' },
  kept: { lemma: 'keep', ja: '保った・保たれた' },
  paid: { lemma: 'pay', ja: '支払った・資金を出された' },
  brought: { lemma: 'bring', ja: '持ってきた' },
  felt: { lemma: 'feel', ja: '感じた' },
  said: { lemma: 'say', ja: '言った' },
  seen: { lemma: 'see', ja: '見られた・見た（seeの過去分詞）' },
  sent: { lemma: 'send', ja: '送った・送られた' },
  sold: { lemma: 'sell', ja: '売った・売られた' },
  shown: { lemma: 'show', ja: '示された・見せられた' },
  shelves: { lemma: 'shelf', ja: '棚（複数）' },
  stood: { lemma: 'stand', ja: '立っていた・位置していた' },
  taught: { lemma: 'teach', ja: '教えた' },
  told: { lemma: 'tell', ja: '伝えられた・伝えた' },
  took: { lemma: 'take', ja: '取った・時間がかかった' },
  thought: { lemma: 'think', ja: '考えた・思った' },
  thrown: { lemma: 'throw', ja: '捨てられた・投げられた' },
  understood: { lemma: 'understand', ja: '理解した' },
  wore: { lemma: 'wear', ja: '着た・身につけた' },
  lit: { lemma: 'light', ja: '照らされた・明るい状態の' },
  worn: { lemma: 'wear', ja: 'すり減った・使い古された' },
}

// 透明な派生語は「語族=1辞書項目」の方針に従い、既存の基本語へ接続する。
// ja は本文中の品詞・意味に合わせ、保存先だけを共通の辞書IDにする。
export const PASSAGE_FORM_ALIASES = {
  "o'clock": { id: 'clock', ja: '〜時' },
  "person's": { id: 'person', ja: 'その人の・個人の' },
  answerable: { id: 'answerable', ja: '説明責任を負う・責任がある' },
  chosen: { id: 'choose', ja: '選ばれた・選んだ' },
  cannot: { id: 'can', ja: '〜できない' },
  diagnostic: { id: 'diagnose', ja: '診断用の・問題発見のための' },
  deepen: { id: 'deep', ja: '深める・悪化させる' },
  definition: { id: 'define', ja: '定義' },
  definitions: { id: 'define', ja: '定義（複数）' },
  description: { id: 'describe', ja: '説明・記述' },
  discussion: { id: 'discuss', ja: '議論・話し合い' },
  distortion: { id: 'distort', ja: '歪曲・ゆがみ' },
  distortions: { id: 'distort', ja: '歪曲・ゆがみ（複数）' },
  environmental: { id: 'environment', ja: '環境の・環境保護の' },
  environmentally: { id: 'environment', ja: '環境面で・環境に関して' },
  farmland: { id: 'farm', ja: '農地' },
  farther: { id: 'far', ja: 'さらに遠くへ・より遠い' },
  further: { id: 'far', ja: 'さらに・それ以上の' },
  historical: { id: 'history', ja: '歴史の・歴史上の' },
  historian: { id: 'history', ja: '歴史家' },
  historians: { id: 'history', ja: '歴史家たち' },
  institutional: { id: 'institution', ja: '制度上の・組織の' },
  inaccessible: { id: 'access', ja: '利用できない・近づけない' },
  interference: { id: 'interfere', ja: '干渉・妨害' },
  interpretation: { id: 'interpret', ja: '解釈' },
  interpretations: { id: 'interpret', ja: '解釈（複数）' },
  irresponsibility: { id: 'responsibility', ja: '無責任・責任を果たさないこと' },
  itself: { id: 'self', ja: 'それ自体' },
  investment: { id: 'invest', ja: '投資' },
  investments: { id: 'invest', ja: '投資（複数）' },
  permanence: { id: 'permanent', ja: '永続性' },
  possibility: { id: 'possible', ja: '可能性' },
  political: { id: 'politics', ja: '政治の・政治的な' },
  politician: { id: 'politics', ja: '政治家' },
  politicians: { id: 'politics', ja: '政治家たち' },
  preparation: { id: 'prepare', ja: '準備' },
  promotion: { id: 'promote', ja: '昇進・促進' },
  proof: { id: 'prove', ja: '証拠・証明' },
  punishment: { id: 'punish', ja: '処罰・罰' },
  quantification: { id: 'quantify', ja: '数量化' },
  quantified: { id: 'quantify', ja: '数量化された' },
  ranking: { id: 'rank', ja: '順位付け' },
  rankings: { id: 'rank', ja: '順位付け（複数）' },
  reflection: { id: 'reflect', ja: '熟考・省察' },
  relation: { id: 'relate', ja: '関係' },
  relations: { id: 'relate', ja: '関係（複数）' },
  responsibly: { id: 'responsible', ja: '責任を持って' },
  readers: { id: 'read', ja: '読み手・読者たち' },
  recordings: { id: 'record', ja: '録音・記録（複数）' },
  repeatedly: { id: 'repeat', ja: '繰り返し' },
  researcher: { id: 'research', ja: '研究者' },
  researchers: { id: 'research', ja: '研究者たち' },
  searchable: { id: 'search', ja: '検索可能な' },
  simplified: { id: 'simple', ja: '単純化された' },
  storage: { id: 'store', ja: '保管・保存' },
  suggestions: { id: 'suggest', ja: '提案・示唆（複数）' },
  subtly: { id: 'subtle', ja: '微妙に・目立たない形で' },
  teenage: { id: 'teenager', ja: '10代の' },
  third: { id: 'three', ja: '第三の・3番目の' },
  transportation: { id: 'transport', ja: '交通・輸送' },
  colorful: { id: 'color', ja: '色鮮やかな' },
  unused: { id: 'use', ja: '使われていない' },
  unsolved: { id: 'solve', ja: '未解決の' },
  leafy: { id: 'leaf', ja: '葉の多い・葉物の' },
  seasonal: { id: 'season', ja: '季節の・季節的な' },
  visibility: { id: 'visible', ja: '見えやすさ・視認性' },
  behavioral: { id: 'behavior', ja: '行動の・行動科学の' },
  assistance: { id: 'assist', ja: '援助・支援' },
  cancellation: { id: 'cancel', ja: '解約・取り消し' },
  renewal: { id: 'renew', ja: '更新・継続' },
  defenders: { id: 'defend', ja: '支持者・擁護する人々' },
  unavoidable: { id: 'avoid', ja: '避けられない' },
  inevitability: { id: 'inevitable', ja: '不可避であること' },
  irrelevant: { id: 'relevant', ja: '無関係な' },
  exploitable: { id: 'exploit', ja: '悪用可能な' },
  restate: { id: 'state', ja: '言い直す・改めて述べる' },
  intrusive: { id: 'intrude', ja: '干渉の強い・立ち入りすぎる' },
  manipulation: { id: 'manipulate', ja: '操作・巧みに誘導すること' },
  defensible: { id: 'defend', ja: '正当化できる・擁護できる' },
  unsafe: { id: 'safe', ja: '安全でない・危険な' },
  unavailable: { id: 'available', ja: '利用できない・入手できない' },
  unexpected: { id: 'expect', ja: '予期しない・思いがけない' },
  unnecessary: { id: 'necessary', ja: '不必要な' },
  necessarily: { id: 'necessary', ja: '必ずしも・必要上' },
  unreliable: { id: 'reliable', ja: '信頼できない' },
  unreadable: { id: 'read', ja: '読めない' },
  usable: { id: 'use', ja: '使用できる' },
  user: { id: 'use', ja: '利用者' },
  users: { id: 'use', ja: '利用者たち' },
  heavily: { id: 'heavy', ja: '大きく・重く' },
  meaningful: { id: 'meaning', ja: '意味のある・実質的な' },
  redefine: { id: 'define', ja: '再定義する' },
  statistical: { id: 'statistical', ja: '統計上の・統計的な' },
}

// 原形の候補を緩く生成（最初に語彙データと一致したものを採用）。
// -s/-d を先に試すことで uses/used を us と誤認しない。子音重複や y 変化も扱う。
export function lemmaCandidates(k) {
  const candidates = []
  const add = (...values) => {
    for (const value of values) {
      if (value && value !== k && !candidates.includes(value)) candidates.push(value)
    }
  }
  const undouble = (stem) =>
    stem.length > 2 && stem.at(-1) === stem.at(-2) ? stem.slice(0, -1) : stem

  if (k.endsWith('ies')) add(k.slice(0, -3) + 'y')
  if (k.endsWith('ied')) add(k.slice(0, -3) + 'y')
  if (k.endsWith('ier')) add(k.slice(0, -3) + 'y')
  if (k.endsWith('iest')) add(k.slice(0, -4) + 'y')

  // 三単現・複数形。uses→use を classes→class より先に安全に試す。
  if (k.endsWith('s') && !k.endsWith('ss')) add(k.slice(0, -1))
  if (k.endsWith('es')) add(k.slice(0, -2))

  if (k.endsWith('ing')) {
    const stem = k.slice(0, -3)
    add(undouble(stem), stem + 'e', stem)
  }
  if (k.endsWith('ed')) {
    const stem = k.slice(0, -2)
    add(k.slice(0, -1), undouble(stem), stem, stem + 'e')
  }
  if (k.endsWith('ly')) add(k.slice(0, -2))
  if (k.endsWith('er')) {
    const stem = k.slice(0, -2)
    add(undouble(stem), stem, stem + 'e')
  }
  if (k.endsWith('est')) {
    const stem = k.slice(0, -3)
    add(undouble(stem), stem, stem + 'e')
  }
  return candidates
}

function lemmaWord(key) {
  const irregular = PASSAGE_IRREGULAR_FORMS[key]
  if (irregular) {
    const word = getWord(toId(irregular.lemma))
    if (word) return word
  }
  for (const cand of lemmaCandidates(key)) {
    const w = getWord(toId(cand))
    if (w) return w
  }
  return null
}

// 語彙データに無い／引きにくい基本語・機能語の補助辞書（小文字の表層形がキー）。
// 「長文に出てくる語はすべて意味が出る」ことを保証するための最終フォールバック。
export const READER_GLOSS = {
  rina: 'リナ（人名）',
  ken: 'ケン（人名）',
  // 冠詞・代名詞
  a: '（不定冠詞）ひとつの',
  an: '（不定冠詞）ひとつの',
  the: '（定冠詞）その',
  i: '私は',
  you: 'あなた（たち）は',
  he: '彼は',
  she: '彼女は',
  it: 'それは・それを',
  we: '私たちは',
  they: '彼ら・それらは',
  me: '私を・私に',
  him: '彼を・彼に',
  her: '彼女の・彼女を',
  us: '私たちを・私たちに',
  them: '彼ら・それらを',
  my: '私の',
  your: 'あなたの',
  his: '彼の',
  its: 'その',
  our: '私たちの',
  their: '彼らの・それらの',
  this: 'これ・この',
  that: 'あれ・その・〜ということ',
  these: 'これら（の）',
  those: 'それら（の）',
  // be動詞・助動詞
  am: '〜である（be動詞）',
  is: '〜である（be動詞）',
  are: '〜である（be動詞）',
  was: '〜だった（be動詞の過去）',
  were: '〜だった（be動詞の過去）',
  be: '〜である・いる',
  been: '〜であった（beの過去分詞）',
  do: '〜する',
  does: '〜する（3人称単数）',
  did: '〜した',
  will: '〜だろう・〜するつもり',
  would: '〜だろう（willの過去）',
  can: '〜できる',
  could: '〜できた・〜かもしれない',
  may: '〜してもよい・〜かもしれない',
  might: '〜かもしれない',
  must: '〜しなければならない',
  should: '〜すべきだ',
  // 前置詞・接続詞・副詞など
  and: '〜と・そして',
  or: 'または',
  but: 'しかし',
  so: 'だから・とても',
  because: '〜だから',
  if: 'もし〜なら',
  when: '〜のとき・いつ',
  while: '〜の間',
  to: '〜へ・〜すること',
  of: '〜の',
  in: '〜の中に',
  on: '〜の上に・〜に（曜日など）',
  at: '〜で・〜に（時刻・場所）',
  for: '〜のために・〜の間',
  with: '〜と一緒に・〜で',
  from: '〜から',
  by: '〜によって・〜のそばに',
  about: '〜について',
  as: '〜として・〜のように',
  not: '〜でない',
  no: 'いいえ・ひとつも〜ない',
  yes: 'はい',
  very: 'とても',
  too: '〜もまた・〜すぎる',
  also: '〜もまた',
  here: 'ここに',
  there: 'そこに・（there is で）〜がある',
  now: '今',
  then: 'それから・その時',
  always: 'いつも',
  often: 'よく・しばしば',
  sometimes: 'ときどき',
  every: 'すべての・毎〜',
  all: 'すべての',
  some: 'いくつかの',
  any: '（疑問・否定で）いくらか・何も',
  what: '何・何の',
  who: '誰',
  which: 'どちら（の）',
  how: 'どのように・どれくらい',
  why: 'なぜ',
  where: 'どこに',
}

/**
 * 長文中の単語キー（小文字の表層形）から語義を解決する。
 * @param {string} key 小文字の表層形（text.js の normalizeToken 済み）
 * @param {object} [sentenceGloss] その文の gloss（{ key: {ja, id} }）
 * @returns {{ja: string, id: (string|null)}|null}
 */
export function resolvePassageWord(key, sentenceGloss) {
  if (!key) return null
  const inline = sentenceGloss?.[key]
  // インラインに ja があればそれを優先（id も使う）
  const direct = inline?.proper ? null : getWord(toId(key))
  const alias = PASSAGE_FORM_ALIASES[key]
  const aliasWord = alias && getWord(alias.id)
  const lemma = inline?.ja || direct || aliasWord ? null : lemmaWord(key)
  const word = (inline?.id && getWord(inline.id)) || direct || aliasWord || lemma
  const irregular = PASSAGE_IRREGULAR_FORMS[key]
  const fb = READER_GLOSS[key]
  const ja =
    inline?.ja ??
    direct?.meaning ??
    irregular?.ja ??
    (aliasWord ? alias.ja : null) ??
    word?.meaning ??
    fb ??
    null
  const id = inline?.proper ? null : (inline?.id ?? word?.id ?? null)
  return ja ? { ja, id } : null
}
