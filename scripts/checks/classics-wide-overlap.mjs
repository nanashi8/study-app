// 古典・漢文の重複を、物差しを広げて全件で拾う（requests/2026-10-02-koten-level-merge.json の recheck-duplicates-wide）。
// scripts/checks/classics-level-overlap.mjs から呼ぶ（これだけでも node で動く）。
//
// 見出しがそっくり同じ項目（二重登録）は classics-level-overlap.mjs の②で0件と確かめてある。ここでは、見出しが違っても
// 同じ語かもしれない組を、次の物差しで拾う。
//   古典単語   … 見出しを「・」で分けた部分・現代仮名の読みの一致、漢字表記の一致、つづりの近い語（読みの差が2字以内で同じ訳語を
//                持つ）、意味の重なり（同じ訳語を2つ以上持つ）、見出しがもう一方を含み同じ訳語を持つ組
//   古典文法   … 題名の「」の中の語の一致　　古典常識 … 題名・キーワードの語の一致
//   短文解釈   … 本文の一致、出典の一致（練習文はまとめて「練習文」なので見ない）
//   漢語       … 読みの一致（字が違えば別の字。同じ字の旧字体・異体字があれば別の形として止める）
//   漢文法     … 題名の字の一致　　漢文常識 … 題名の語の一致　　返り点・訓読 … 訓読文・書き下し文・題名の一致
//   古典単語×漢語 … 古典単語の漢字表記と漢語の見出しの一致
// 拾った組は WIDE_PAIRS（2026-10-02 に1組ずつ本文を読んで決めた分け方）で次のどれかにする。
//   duplicate … 同じ語の二重登録（見つかれば失敗にする）
//   form      … 同じ語の別の形（古い形・くだけた形、その語を含む言い方で意味が同じもの）。別の見出しのまま、数と中身を報告する
//   different … 別の語（理由の印：similar 意味が近い／derived 派生・複合で意味や敬意が違う／homograph 同じつづり・読み／
//               kanji 同じ漢字を使う／role 同じ形の別の働き・識別の項目／reading 漢語の、読みが同じ別の字）
//   same      … 古典単語×漢語で、同じ字を同じ読み・意味で学ぶ組（古文と漢文の両方に出る語）
import { fileURLToPath } from 'node:url'
import { KOTEN_WORDS } from '../../src/data/koten.js'
import { KOTEN_GRAMMAR } from '../../src/data/koten-grammar.js'
import { KOTEN_CULTURE } from '../../src/data/koten-culture.js'
import { KOTEN_INTERPRETATIONS } from '../../src/data/koten-interpretations.js'
import { KANBUN_VOCAB } from '../../src/data/kanbun-vocab.js'
import { KANBUN_GRAMMAR } from '../../src/data/kanbun-grammar.js'
import { KANBUN_CULTURE } from '../../src/data/kanbun-culture.js'
import { KANBUN_KUNDOKU_EXERCISES } from '../../src/data/kanbun-kundoku.js'

const strip = (text) => String(text ?? '').replace(/[（(][^）)]*[）)]/gu, '').trim()
const parts = (text) => strip(text).split(/[・／/、,，]/u).map((part) => part.trim()).filter(Boolean)
const quoted = (text) => [...String(text ?? '').matchAll(/「([^」]+)」/gu)].map((match) => match[1])
const meaningKey = (meaning) => strip(meaning).replace(/[\s。、]/gu, '')

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

/** 同じ教材の中で、keysOf の値が1つでも同じになる組（物差しの名前つき）。 */
function sharedKeyPairs(items, measures) {
  const pairs = new Map()
  const add = (a, b, measure) => {
    const [first, second] = a.id < b.id ? [a, b] : [b, a]
    const key = `${first.id}|${second.id}`
    if (!pairs.has(key)) pairs.set(key, { key, a: first, b: second, measures: new Set() })
    pairs.get(key).measures.add(measure)
  }
  for (const [measure, test] of Object.entries(measures)) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (test(items[i], items[j])) add(items[i], items[j], measure)
      }
    }
  }
  return [...pairs.values()]
}

const overlaps = (a, b) => a.some((value) => b.includes(value))
const sharedMeanings = (a, b) => {
  const left = new Set(a.meanings.map(meaningKey))
  return [...new Set(b.meanings.map(meaningKey))].filter((meaning) => left.has(meaning))
}
const contains = (a, b) => {
  const [short, long] = strip(a.word).length <= strip(b.word).length ? [strip(a.word), strip(b.word)] : [strip(b.word), strip(a.word)]
  return short.length >= 2 && long.length > short.length && long.includes(short)
}

// 新字体と旧字体・異体字の組。漢語の見出しにどちらも出たら、同じ字の別の形として止める（2026-10-02 は0組）。
const VARIANT_CHARACTERS = [
  ['為', '爲'], ['与', '與'], ['数', '數'], ['学', '學'], ['国', '國'], ['帰', '歸'], ['悪', '惡'], ['独', '獨'],
  ['尽', '盡'], ['対', '對'], ['当', '當'], ['応', '應'], ['既', '旣'], ['礼', '禮'], ['徳', '德'], ['辞', '辭'],
  ['勧', '勸'], ['従', '從'], ['縦', '縱'], ['聴', '聽'], ['称', '稱'], ['郷', '鄕'], ['賤', '賎'], ['富', '冨'],
  ['亡', '亾'], ['肯', '肎'], ['爾', '尓'], ['恥', '耻'], ['宜', '冝'], ['尚', '尙'], ['仮', '假'], ['号', '號'],
]
const variantOf = new Map(VARIANT_CHARACTERS.flatMap(([a, b]) => [[a, b], [b, a]]))

/** 同じ教材の中の物差しと、教材をまたぐ物差し。 */
export const WIDE_SETS = [
  {
    id: 'kotenVocab', label: '古典単語', title: (word) => word.word,
    pairs: () => sharedKeyPairs(KOTEN_WORDS, {
      '読みの部分': (a, b) => overlaps([...parts(a.word), ...parts(a.kana)], [...parts(b.word), ...parts(b.kana)]),
      '漢字': (a, b) => overlaps(parts(a.kanji), parts(b.kanji)),
      'つづりが近い': (a, b) => {
        const left = strip(a.kana)
        const right = strip(b.kana)
        return left.length >= 3 && right.length >= 3 && sharedMeanings(a, b).length >= 1 && distance(left, right) <= 2
      },
      '訳語が2つ以上同じ': (a, b) => sharedMeanings(a, b).length >= 2,
      '見出しを含み訳語が同じ': (a, b) => contains(a, b) && sharedMeanings(a, b).length >= 1,
    }),
  },
  {
    id: 'kotenGrammar', label: '古典文法', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KOTEN_GRAMMAR, {
      '「」の中の語': (a, b) => overlaps(quoted(a.title).flatMap(parts), quoted(b.title).flatMap(parts)),
    }),
  },
  {
    id: 'kotenCulture', label: '古典常識', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KOTEN_CULTURE, {
      '題名・キーワード': (a, b) => overlaps([...parts(a.title), ...parts(a.keyword)], [...parts(b.title), ...parts(b.keyword)]),
    }),
  },
  {
    id: 'kotenInterpretation', label: '短文解釈', title: (item) => item.text,
    pairs: () => sharedKeyPairs(KOTEN_INTERPRETATIONS, {
      '本文': (a, b) => a.text === b.text,
      '出典': (a, b) => a.source !== '練習文' && a.source === b.source,
    }),
  },
  {
    id: 'kanbunVocab', label: '漢語', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KANBUN_VOCAB, {
      '読み': (a, b) => overlaps(parts(a.reading), parts(b.reading)),
      '旧字体・異体字': (a, b) => a.title.length === b.title.length && [...a.title].every((char, index) => char === b.title[index] || variantOf.get(char) === b.title[index]),
    }),
    // 読みが同じでも字が違う組は別の字（同じ読みの字は、使い分けの仲間に入れて学ぶ）。旧字体・異体字の組は WIDE_PAIRS で決める。
    rule: (pair) => (pair.measures.has('旧字体・異体字') ? undefined : { kind: 'different', why: 'reading', note: '読みが同じ別の字' }),
  },
  {
    id: 'kanbunGrammar', label: '漢文法', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KANBUN_GRAMMAR, {
      '題名の字': (a, b) => {
        const chars = (item) => [...quoted(item.title), ...parts(item.title)].flatMap(parts).filter((part) => /^\p{Script=Han}{1,3}$/u.test(part))
        return overlaps(chars(a), chars(b))
      },
    }),
  },
  {
    id: 'kanbunCulture', label: '漢文常識', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KANBUN_CULTURE, { '題名の語': (a, b) => overlaps(parts(a.title), parts(b.title)) }),
  },
  {
    id: 'kanbunKundoku', label: '返り点・訓読', title: (item) => item.title,
    pairs: () => sharedKeyPairs(KANBUN_KUNDOKU_EXERCISES, {
      '訓読文': (a, b) => a.marked === b.marked,
      '書き下し文': (a, b) => a.kakikudashi === b.kakikudashi,
      '題名': (a, b) => a.title === b.title,
    }),
  },
  {
    id: 'kotenVocabKanbunVocab', label: '古典単語 × 漢語', title: (item) => item.word ?? item.title,
    pairs: () => {
      const index = new Map()
      for (const item of KANBUN_VOCAB) for (const title of parts(item.title)) {
        if (!index.has(title)) index.set(title, [])
        index.get(title).push(item)
      }
      return KOTEN_WORDS.flatMap((word) => [...new Set(parts(word.kanji).flatMap((kanji) => index.get(kanji) ?? []))]
        .map((item) => ({ key: `${word.id}|${item.id}`, a: word, b: item, measures: new Set(['漢字表記と見出し']) })))
    },
  },
]

const f = (why) => ({ kind: 'form', why })
const d = (why, note) => ({ kind: 'different', why, ...(note ? { note } : {}) })
const s = (note) => ({ kind: 'same', note })

// 拾った組の分け方（2026-10-02 に1組ずつ本文を読んで決めた）。キーは「id|id」（古典単語×漢語は「古典単語の id|漢語の id」）。
export const WIDE_PAIRS = {
  // ── 古典単語：同じ語の別の形（6組） ──
  'k071|k073': f('「おもほゆ」は「おぼゆ」の古い形（意味は同じ。おぼゆ＝中学・おもほゆ＝難関）'),
  'k072|k527': f('「おもほす」は「おぼす」の古い形（意味は同じ。おぼす＝基礎・おもほす＝難関）'),
  'k081|k521': f('「たぶ」は「たまふ」のくだけた形（たまふ＝中学・たぶ＝難関）'),
  'k185|k372': f('「いへばさらなり」は「さらなり」に「言へば」を付けた言い方で、意味は同じ（さらなり＝中学・いへばさらなり＝難関）'),
  'k325|k368': f('「けしからず」は「けし」に打消を付けた言い方で、意味は「けし」と同じ（けしからず＝標準・けし＝難関）'),
  'k068|k429': f('「いかでか」は「いかで」に係助詞「か」が付いた言い方（いかで＝基礎・いかでか＝標準）'),
  // ── 古典単語：同じつづり・読みの別の語 ──
  'k024|k103': d('homograph', '形容詞「良し」と名詞「由」'),
  'k122|k454': d('homograph', '伝聞・推定の「なり」と断定の「なり」'),
  'k215|k597': d('homograph', '形容詞「著し」と名詞「験・徴」'),
  'k288|k472': d('homograph', '完了の助動詞「ぬ」と動詞「寝」'),
  'k289|k455': d('homograph', '完了・存続の「たり」と断定の「たり」'),
  'k292|k497': d('homograph', '使役・尊敬の助動詞「す」とサ変動詞「す（為）」'),
  'k547|k609': d('homograph', '副詞「疾く」と名詞「徳」'),
  // ── 古典単語：同じ漢字を使う別の語 ──
  'k004|k028': d('kanji', '「愛し」を「かなし」「うつくし」と読み分ける別の語'),
  'k026|k027': d('kanji', '「悪し」を「わろし」「あし」と読み分ける別の語'),
  'k028|k029': d('kanji'),
  'k035|k039': d('kanji'),
  'k037|k345': d('kanji'),
  'k039|k325': d('kanji'),
  'k047|k048': d('kanji'),
  'k136|k303': d('kanji', '「辛し」を「つらし」「からし」と読み分ける別の語'),
  'k159|k491': d('kanji'),
  'k164|k460': d('kanji'),
  'k192|k201': d('kanji'),
  'k246|k483': d('kanji'),
  'k415|k416': d('kanji', '「自ら」を「おのづから」「みづから」と読み分ける別の語'),
  'k437|k438': d('kanji', '「然」を「しか」「さ」と読み分ける別の語'),
  'k440|k441': d('kanji', '「然り」を「さり」「しかり」と読み分ける別の語'),
  'k598|k606': d('kanji'),
  // ── 古典単語：派生・複合でできた別の語（敬意の度合いや意味が違う） ──
  'k005|k007': d('derived', '「心憂し」は「心」と「憂し」の複合'),
  'k026|k387': d('derived', '「人わろし」は人目に体裁が悪い'),
  'k072|k266': d('derived', '「おぼしめす」は「おぼす」より敬意が高い'),
  'k081|k526': d('derived', '「たまはす」は「たまふ」より敬意が高い'),
  'k088|k261': d('derived', '「おはします」は「おはす」より敬意が高い'),
  'k171|k524': d('derived', '「まうでく」は「まうづ」に「来」が付いた語'),
  'k173|k256': d('derived', '「のたまはす」は「のたまふ」より敬意が高い'),
  'k174|k259': d('derived', '「まゐらす」は「まゐる」に「す」が付いた謙譲語'),
  'k234|k492': d('derived', '「うしろみる」は後見する'),
  'k260|k525': d('derived', '「いまそかり」は「います」に「あり」が付いてできたラ変動詞'),
  'k262|k268': d('derived', '「きこしめす」は「聞こす」に「めす」が付いた語'),
  'k264|k265': d('derived', '「うけたまはる」は「承る（お聞きする）」'),
  'k293|k452': d('derived', '「むず」は「むとす」がつまってできた別の助動詞'),
  'k417|k418': d('derived', '「いかが」は「いかにか」がつまってできた語'),
  // ── 古典単語：意味が近い別の語 ──
  'k006|k019': d('similar'), 'k006|k136': d('similar'), 'k006|k303': d('similar'), 'k007|k138': d('similar'),
  'k011|k204': d('similar'), 'k013|k021': d('similar'), 'k015|k136': d('similar'), 'k019|k224': d('similar'),
  'k021|k022': d('similar'), 'k021|k133': d('similar'), 'k021|k324': d('similar'), 'k022|k132': d('similar'),
  'k022|k133': d('similar'), 'k032|k227': d('similar'), 'k034|k227': d('similar'), 'k036|k324': d('similar'),
  'k037|k156': d('similar'), 'k037|k324': d('similar'), 'k043|k044': d('similar'), 'k044|k383': d('similar'),
  'k044|k386': d('similar'), 'k050|k144': d('similar'), 'k054|k393': d('similar'), 'k062|k187': d('similar'),
  'k068|k417': d('similar'), 'k068|k418': d('similar'), 'k069|k428': d('similar'), 'k088|k260': d('similar'),
  'k097|k539': d('similar'), 'k130|k131': d('similar'), 'k130|k328': d('similar'), 'k132|k324': d('similar'),
  'k135|k301': d('similar'), 'k139|k357': d('similar'), 'k142|k144': d('similar'),
  'k147|k148': d('similar', '「幼けなし」と「稚けなし」。意味はほぼ同じだが別の語'),
  'k156|k324': d('similar'), 'k172|k263': d('similar'), 'k201|k334': d('similar'), 'k204|k205': d('similar'),
  'k211|k226': d('similar'), 'k230|k344': d('similar'), 'k262|k267': d('similar'), 'k303|k324': d('similar'),
  'k331|k343': d('similar'), 'k348|k352': d('similar'),
  'k361|k362': d('similar', '「けざやかなり」は「さやかなり」より際立つさま'),
  'k374|k375': d('similar', '「心ばへ」（心が映え出たもの）と「心馳せ」（心を働かせること）'),
  'k406|k407': d('similar'), 'k406|k427': d('similar'),
  'k409|k410': d('similar', '「ここら」と「そこら」。意味はほぼ同じだが別の語'),
  'k417|k429': d('similar'), 'k004|k045': d('similar'), 'k028|k045': d('similar'), 'k031|k032': d('similar'),
  'k049|k389': d('similar'), 'k082|k259': d('similar'), 'k083|k086': d('similar'), 'k084|k085': d('similar'),
  'k088|k525': d('similar'), 'k103|k104': d('similar'), 'k111|k285': d('similar'), 'k208|k227': d('similar'),
  'k417|k428': d('similar'), 'k514|k516': d('similar'), 'k052|k325': d('similar', '「けやけし」は「けし」とは別の語'),
  // ── 古典文法：識別の項目と元の項目、同じ形の別の働き（どれも別の項目） ──
  'kg_identification_nu_ne|kg_perfect_nu': d('role'),
  'kg_assertion_tari|kg_perfect_tari': d('role'),
  'kg_id_tari|kg_perfect_tari': d('role'),
  'kg_assertion_tari|kg_id_tari': d('role'),
  'kg_conjecture_mu|kg_id_mu_imi': d('role', '助動詞「む」の項目と、その意味の見分け方の項目'),
  'kg_identification_ramu|kg_present_ramu': d('role'),
  'kg_assertion_nari|kg_hearsay_nari': d('role'),
  'kg_hearsay_nari|kg_identification_nari': d('role'),
  'kg_assertion_nari|kg_identification_nari': d('role'),
  'kg_identification_ru_re|kg_voice_raru': d('role'),
  'kg_id_raru_imi|kg_voice_raru': d('role', '助動詞「る・らる」の項目と、その4つの意味の見分け方の項目'),
  'kg_id_raru_imi|kg_identification_ru_re': d('role'),
  'kg_identification_namu|kg_kakari_renntai': d('role'),
  'kg_kakari_renntai|kg_kakari_ya_ka': d('role', '係り結びの決まりの項目と、係助詞「や・か」の疑問・反語の項目'),
  'kg_interjection|kg_kakari_renntai': d('role'),
  'kg_interjection|kg_kakari_ya_ka': d('role'),
  'kg_identification_baya|kg_wish_baya': d('role'),
  'kg_case_to|kg_quote_to': d('role'),
  'kg_conj_tomo|kg_quote_to': d('role'),
  'kg_case_to|kg_conj_tomo': d('role'),
  'kg_case_nite_shite|kg_conj_te': d('role'),
  'kg_conj_te|kg_id_shite': d('role'),
  'kg_case_nite_shite|kg_id_shite': d('role'),
  'kg_case_no_ga|kg_conj_ga_ni_wo': d('role'),
  'kg_case_no_ga|kg_id_ga': d('role'),
  'kg_conj_ga_ni_wo|kg_id_ga': d('role'),
  'kg_case_ni|kg_identification_ni': d('role'),
  'kg_case_ni|kg_conj_ga_ni_wo': d('role'),
  'kg_conj_ga_ni_wo|kg_identification_ni': d('role'),
  'kg_adv_shi_shimo|kg_identification_shi': d('role'),
  'kg_case_wo_he|kg_conj_ga_ni_wo': d('role'),
  'kg_case_wo_he|kg_interjection': d('role'),
  'kg_conj_ga_ni_wo|kg_interjection': d('role'),
  'kg_conj_de|kg_id_de': d('role'),
  // ── 漢文法：同じ字の別の働き ──
  'kgw009|kgw011': d('role', '「於」だけの置き字の項目と、「乎・于」を「於」と見比べる項目'),
  'kgw009|kgw061': d('role', '置き字「於」の働き全体と、比較の「於（…より）」'),
  'kgw011|kgw061': d('role'),
  'kgw052|kgw089': d('role', '疑問詞の「焉」と文末の置き字の「焉」'),
  'kgw068|kgw081': d('role', '比況の「如・若（ごとし）」と仮定の「若・如（もし）」'),
  // ── 古典単語 × 漢語：同じ字を同じ意味で学ぶ組と、読みや意味が違う組 ──
  'k061|kv134': s('やや（稍）'),
  'k089|kv112': s('あした（朝）'),
  'k098|kv114': s('いにしへ（古）'),
  'k104|kv035': s('ゆゑ（故）'),
  'k186|kv028': s('なほ（猶）'),
  'k186|kv029': s('なほ（尚）'),
  'k276|kv230': s('おほやけ（公）'),
  'k421|kv143': s('ほとほと・ほとんど（殆）'),
  'k437|kv156': s('しか・しかり（然）'),
  'k501|kv015': s('う（得）'),
  'k609|kv085': s('とく（徳）'),
  'k419|kv026': d('kanji', '古文の「むべ（なるほど）」と、漢文の再読文字「宜（よろしく…べし）」'),
  'k422|kv022': d('kanji', '古文の「はた（また・やはり）」と、漢文の再読文字「将（まさに…んとす）」'),
  'k438|kv156': d('kanji', '古文の「さ」と、漢文で「しかり」と読む「然」'),
  'k497|kv173': d('kanji', '古文のサ変動詞「す」と、漢文で「なす・なる・ため・たり」と読み分ける「為」'),
  'k551|kv115': d('kanji', '古文の「いま（もうすぐ・さらに）」と、漢文の「今（現在）」'),
  'k588|kv187': d('kanji', '古文の「つま（夫・妻）」と、漢文で「それ・かの」などと読む「夫」'),
}

/** 物差しを広げた重複の調べの結果。 */
export function surveyWideOverlap() {
  const sets = WIDE_SETS.map((set) => {
    const pairs = set.pairs().map((pair) => ({ ...pair, decision: WIDE_PAIRS[pair.key] ?? set.rule?.(pair) }))
    const label = (pair) => `${pair.key}（${set.title(pair.a)} × ${set.title(pair.b)}、${[...pair.measures].join('・')}）`
    const of = (kind) => pairs.filter((pair) => pair.decision?.kind === kind)
    return {
      id: set.id,
      label: set.label,
      candidates: pairs.length,
      duplicate: of('duplicate').map((pair) => `${label(pair)}：${pair.decision.why}`),
      form: of('form').map((pair) => ({ key: pair.key, a: set.title(pair.a), b: set.title(pair.b), aLevel: pair.a.level, bLevel: pair.b.level, why: pair.decision.why })),
      same: of('same').length,
      different: of('different').length,
      differentBy: of('different').reduce((counts, pair) => ({ ...counts, [pair.decision.why]: (counts[pair.decision.why] ?? 0) + 1 }), {}),
      unclassified: pairs.filter((pair) => !pair.decision).map(label),
      keys: pairs.map((pair) => pair.key),
    }
  })
  const keys = new Set(sets.flatMap((set) => set.keys))
  const stale = Object.keys(WIDE_PAIRS).filter((key) => !keys.has(key))
  const problems = [
    ...sets.flatMap((set) => set.duplicate.map((text) => `${set.label}: 同じ語の二重登録 ${text}`)),
    ...sets.flatMap((set) => set.unclassified.map((text) => `${set.label}: 分け方を決めていない組 ${text}`)),
    ...stale.map((key) => `WIDE_PAIRS: 候補にない組 ${key}（データが変わったら読み直す）`),
  ]
  return { sets: sets.map(({ keys: _keys, ...rest }) => rest), problems }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = surveyWideOverlap()
  console.log(JSON.stringify(result, null, 2))
  if (result.problems.length) process.exit(1)
}
