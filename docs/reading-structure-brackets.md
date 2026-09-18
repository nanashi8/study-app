# 一文の構文解説の括弧（ ( ) と < > ）の付け方

長文の一文構文解説で使う括弧は、利用者と例文を見ながら決めた次のルールに従う。
迷う型が出たら自分で決めず、本文の例文を示して利用者に確認し、決まった型をここへ足す。

## 基本

- **( ) は節**。主語と動詞を持つまとまり。関係詞節・名詞節（that／whether／if／疑問詞／what）・副詞節。
  接続詞・関係詞・疑問詞は ( ) の中に入れ、先行詞は外に置く。
- **< > は句**。主語と動詞を持たないまとまり。前置詞句・to不定詞・動名詞・分詞・同格の名詞句・挿入句。
- 節や句の中にある節・句も、**入れ子**でくくる。

```
Every serious argument <about the future <of a city>> is therefore <in the end>
an argument <about (who pays <for it> and when)>.

A pension (that is promised this year) will be paid
<out of the future wages <of workers (who are still <at school> today)>>.
```

## 決めた型

| 型 | 書き方 | 例 |
| --- | --- | --- |
| 前置詞＋節・動名詞 | 前置詞は節・句の括弧の外、前置詞句全体を < > | `<about (who pays for it and when)>` `<from <losing their ability>>` |
| 主語と be動詞を省いた接続詞＋-ing／形容詞 | ( ) | `(while encouraging digital innovation elsewhere)` `(when possible)` |
| 前置詞＋関係代名詞 | 節の ( ) だけ。中で < > にしない | `the environment (within which people decide)` |
| than・rather than ＋名詞 | < >。後ろに主語と動詞が続けば ( ) | `more <than an expensive digital service>` |
| for A to do（意味上の主語） | < > を2つに分ける | `difficult <for outsiders> <to challenge>` |
| as … as の1つ目の as、as well | 括らない（副詞） | `as quickly <as possible>` |
| 句動詞の副詞（turn out の out など） | 括らない（動詞Vの中） | `may later turn out <to be>` |

## 台帳の書き方

- 前置詞句は `{前| …}`。意味上の主語の for A は `{前:意味上の主語| for A}` と書き、すぐ後ろに to不定詞のまとまりを置く。
- 省略された関係詞は種類を書く。`{関係省略:目的格>先行詞| …}`、`{関係省略:目的格(動詞)>先行詞| …}`、`{関係省略:関係副詞>先行詞| …}`。
- 主語と be動詞を省いた副詞節は、動詞がなくてもよい（`{副詞節:時| [接 when] [C possible]}`）。

## 検査

- `tests/reading-sentence-structures.test.mjs`
  - 「利用者と例文で確認した括弧の付け方を保つ」…確認済みの9文の構造図を固定する。**この期待値は、利用者に例文を見せて確認するまで変えない。**
  - 「台帳の前置詞は、すべて前置詞句 {前| …} でくくる」…`unbracketedPrepositions` で囲み忘れを止める。
  - 「節のまとまりには、つなぐ語の種類と見分け方がある」…接続詞・関係詞の説明が空でないことを見る。
- 前置詞の形でも前置詞でない語（as well の as、the past の past、前置詞句を並べる than）は
  `src/lib/reading-sentence-structure.js` の `exemptPreposition` に理由つきで書く。

## 一文に戻すとき（つなぐ語の解説）

関係詞の解説では、先行詞を戻した一文も見せる。次の形は英語として不自然になるので出さない。

- 節の終わりに前置詞が残る形は、前置詞の後ろへ戻す（`the layer they depend on` → `They depend on the layer.`）。
- 否定や比較を受けて成り立つ `ever`、先行詞の `any / anyone / anything / anybody` は戻さない
  （× `A government has ever agreed on any line.` × `Anyone chose the smaller plate.`）。
- 「ひとたび〜すると」の once（`a species that is once lost`）は戻さない（`was once` の「かつて」は戻す）。
- 欠けた語が不定詞・動名詞の中にあるときは戻さない。
- 文頭で大文字だった先行詞は、文の途中へ戻すときに小文字にする（`Fertilizer` → `fertilizer`）。
- 受け身の関係節（`information that cannot be recovered`）は関係代名詞が主語S。目的語Oと書くと
  `関係代名詞の節「…」に主語Sがありません` で止まる。
- `a way that … cannot` のように欠けた語がない節は、関係代名詞ではなく関係副詞の働きをする that。
  先頭の要素は `[M that]` と書く。置きかえの語は先行詞で選ぶ（the day → when（on which）、the reason → why、
  the way → in which）。
- 前置詞が不定詞の終わりに残る形（`outcomes that a city is prepared to live with`）は、関係代名詞（前置詞の目的語）。
- 受け身で前置詞が残る形（`Land that has been built on`）は関係代名詞が主語S。`[V has been built on]` と書く。
- 関係詞が O・C・M になる節に主語Sがないと、台帳の検査で止まる（非制限用法も同じ）。
