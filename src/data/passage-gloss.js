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
  for (const cand of lemmaCandidates(key)) {
    const w = getWord(toId(cand))
    if (w) return w
  }
  return null
}

// 語彙データに無い／引きにくい基本語・機能語の補助辞書（小文字の表層形がキー）。
// 「長文に出てくる語はすべて意味が出る」ことを保証するための最終フォールバック。
export const READER_GLOSS = {
  english: 'イングランドの・英語（の）',
  many: 'たくさんの・多くの',
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
  const direct = getWord(toId(key))
  const lemma = inline?.ja || direct ? null : lemmaWord(key)
  const word = (inline?.id && getWord(inline.id)) || direct || lemma
  const fb = READER_GLOSS[key]
  const ja = inline?.ja ?? word?.meaning ?? fb ?? null
  const id = inline?.id ?? word?.id ?? null
  return ja ? { ja, id } : null
}
