// つづりが似た語は、語源がつながっているのか（requests/2026-09-26-lookalike-origins.json）。
// 「humiliate と human は同じ語源？」のような、つづりが似た語についての疑問に答える台帳。人が1語ずつ読んで決めた。
//
// つながりの種類（kind）:
//   same      … 同じ語源（同じ語・同じ語根から来た）
//   distant   … 遠い親戚（元の語はちがうが、さかのぼると同じ古い語根につながる）
//   unrelated … 別の語源（つづりが似ているのは偶然か、あとから似せたもの）
//   unclear   … つながりがはっきりしない（説が分かれる・元の語が分かっていない・2つの語が混ざってできた）
//
// 1) ROOT_LOOKALIKES … 語根カードの似た語（src/data/lookalike-root-cards.js）。
//    語根カード（接頭辞・接尾辞のカードを除く）の3文字以上の形で始まる見出し語と、接頭辞のすぐあとにその形が続く
//    見出し語（Monday・post office のような語も小文字にして比べる）のうち、カードの語にもその語の形のまとまりにも入っていない語（scripts/checks/lookalike-origins.mjs が拾う）。
//    カードごとに [kind, '語 語 …', 説明] を並べる。kind はカードの語根とのつながり。同じ由来の語は1つのまとまりにする。
//    似て見える部分が接頭辞（ギリシャ語 para-・ラテン語 de- など）の語は、4番目に 'affix' と書いて1つにまとめてよい
//    （まとまりの語どうしは接頭辞だけが同じなので、互いのつながりは決めない）。
//    同じカードのまとまりどうしは、カードの語根を通して決まるものだけを出す。どちらもカードの語根とつながれば
//    遠い親戚（どちらも same なら同じ語源）、一方だけつながれば別の語源。どちらもつながらない組・はっきりしない組は、
//    つながりを確かめて ROOT_LOOKALIKE_LINKS に [語, 語, kind, 説明] で書いたものだけを出す（語はそれぞれのまとまりの語）。
// 2) CONFUSABLE_ORIGINS … つづり注意（spelling-confusables.js）の組ごとの [kind, 説明]（src/data/lookalike-confusables.js）。
//    キーは2語の id（辞書にない語はつづり）を並べ替えて | でつないだもの。
//
// 説明の書き方: 言語名は略さない（ラテン語・古英語）。元の語と意味を添え、どうつながるか・なぜつながらないかを書く。
export { ROOT_LOOKALIKES, ROOT_LOOKALIKE_LINKS } from './lookalike-root-cards.js'
export { CONFUSABLE_ORIGINS } from './lookalike-confusables.js'

export const LOOKALIKE_KINDS = Object.freeze({
  same: '同じ語源',
  distant: '遠い親戚',
  unclear: 'はっきりしない',
  unrelated: '別の語源',
})
