# 長文コンテンツ仕様書

新しい長文を作るとき、構造台帳を書くとき、表示の決まりに迷ったときに使う仕様。
作業の順番、台帳の書き方、表示と解説の決まり、判断の決め方、検査をまとめる。

土台は、長文の一文解説を作り始めたときの仕様 `docs/reading-phrase-explanation-method.md`（2026-08-02）。
意味フレーズ・語順訳・文法説明の決まりはそちらにあり、この仕様書はそれを今の作り（構造台帳）に当てはめ、
作る順番・台帳の書き方・括弧・迷ったときの決め方・検査を足したもの。

細かい決まりは次の文書にある。食い違いを見つけたら、どちらかを直してそろえる（古い文面を残さない）。

- 意味フレーズ・語順訳・文法説明（最初の仕様）：`docs/reading-phrase-explanation-method.md`
- 括弧 ( ) < > の決めた型の一覧と例文：`docs/reading-structure-brackets.md`
- 学習者に見せる文面の決まり：`docs/learner-facing-quality-contract.md`

## 1. 長文1本に揃えるもの

| もの | 置き場所 | 止める検査 |
| --- | --- | --- |
| 本文（英文）と自然訳 | `src/data/passages.js` ほか長文の種類ごとの `reading-*-passages.js`・`reading-extended-body-*.js` | 語数の帯 `READING_WORD_COUNT_TARGETS`（`scripts/check-data.mjs`） |
| 語順訳のブロック | `reading-*-translation-scenarios.js` | `tests/reading-translation-scenarios.test.mjs`、`src/lib/phrase-explanation-audit.js` |
| 5文型の正解表 | `reading-*-grammar-expectations.js` | 構造台帳の主節と照らす（`tests/reading-sentence-structures.test.mjs`） |
| 構造台帳（1文ずつ手で書く） | `src/data/reading-structures/<passageId>.js`、`index.js` に登録 | `tests/reading-sentence-structures.test.mjs` |
| 段落解説 | `src/data/reading-paragraph-guides.js` | 段落の数と4項目 |
| 読み方（5段階の手順） | `PASSAGE_READING_APPROACHES` | `extendedReadingAudit` |
| 設問・選択肢の訳と解説 | `reading-*-questions.js`・`reading-question-translations*.js`・`reading-choice-notes.js` | `tests/reading-question-translations.test.mjs` |
| タップした語の語義 | `src/data/passage-sense-glosses.js` | `tests/passage-sense-glosses.test.mjs` |
| 場面の束 | `src/data/scene-bundles.js` | `tests/scene-bundles.test.mjs` |

## 2. 作る順番

1. **本文と自然訳を書く。** 級別の長文は `READING_WORD_COUNT_TARGETS`（`src/data/reading-study.js`）の帯に収める
   （5級 70〜110語、4級 160〜180語、3級 260〜300語、準2級 300〜330語、準2級プラス 330〜350語、2級 360〜400語、
   準1級 510〜550語、1級 800〜850語）。
   語彙強化ロングリーディングは目標語数（1000・2000・3000・4000語）の ±1.5%、節の数は 5・6・8・10、
   各節は段落2つ以上で節の冒頭を段落の始まりにする（`src/lib/extendedReadingAudit.js`）。
   重点語は本文に出さない（`重点語に追加前から本文出現済み` で落ちる）。
2. **語順訳のブロックを作る。** `analyzeReadingSentence` の区切りに、日本語の意味単位を1対1で合わせる。
   解析器が読み違える文は、解析器を直さず英文を言い換える（既存の長文の指紋を壊さないため）。
   解析器の読み違えの型は、記憶メモ「reading-field-balanced」「reading-word-order-defects」にある。
3. **5文型の正解表を書く。** 表は解析器の推定を上書きするので、教育的に正しい文型を書く。
   場所の副詞はM、help・ask＋O＋to は SVOC、teach＋人＋that は SVOO。受け身で目的語がなければ SV。
4. **構造台帳を1文ずつ手で書く**（3章）。書いたら、構造図・つなぐ語の解説・一文に戻す例を全部読む。
5. **段落解説・読み方・設問**を本文と照らして書く。
6. **語義・場面の束**を足す。
7. **検査**（8章）を通し、固定値をそろえて push し、デプロイが成功するまで確かめる。

## 2.5 最初の仕様の決まりが、今の画面のどこで満たされているか

構造台帳のある文は、画面の構造・節と句の解説・語順訳を台帳から作る。最初の仕様の説明の決まりは、次の場所で満たす。
新しい決まりを足したら、この表も直す。

| 最初の仕様の決まり | 今の作り |
| --- | --- |
| 意味と発音のまとまりで区切る・8語まで・英語順の対応日本語・括弧の受け直し | 台帳の `chunks`（3章） |
| 関係詞は先行詞・節内の役割・節のあとに戻る動詞を説明する | つなぐ語の解説（先行詞・役割・見分け方・一文に戻す例・主語の中の節は戻る動詞） |
| 目的格の関係詞の省略は、先行詞と欠けた語を示す | つなぐ語の解説（`関係省略`。前置詞が残る形は前置詞の目的語） |
| 間接疑問は疑問詞の節内の役割と、節全体をとる動詞・前置詞を示す | つなぐ語の解説と、節・句の解説の「〜の目的語Oです」 |
| 不定詞は用法・かかる先・意味上の主語を持つ | 台帳の `to:用法`、`前:意味上の主語`、節・句の解説 |
| -ing は動名詞・分詞・分詞構文・省略された副詞節を区別する | 台帳の種類（`動名詞` `現在分詞` `分詞構文` `副詞節`）と節・句の解説 |
| 過去分詞の後置修飾は、省略された関係詞＋be動詞と受け身を説明する | 節・句の解説（`過去分詞`：that is・that are が省かれた受け身） |
| 比較は前項・後項・省略された述語を示す | つなぐ語の解説（than・as の節、共通の主語と動詞の省略） |
| 並列は左右の語句と、共有する主語・助動詞・to・前置詞を示す | 並列の縦そろえ表示（4.5章）。並ぶものを縦にそろえ、共有する主語・助動詞・to・前置詞は並びの手前に残る |
| 共有された (to)・(can) を構造の表示だけに補う | **補わない**（2026-09-18 利用者が決定）。縦そろえで共有する助動詞・to が並びの手前に残るので、共有が見える。この決まりは縦そろえで置きかえた |
| セミコロン・コロンを表示と説明に残す | 構造の表示には残る。説明は必要な文だけ台帳の `notes` に書く |

## 3. 構造台帳の書き方

1文につき `st(markup, { chunks, notes, unitNotes, rules })` を1つ、本文の順に並べる。

### 役割

`[R 語句]` の R は次のどれか。

| 役割 | 意味 |
| --- | --- |
| S V O O1 O2 C M | 主語・動詞・目的語・間接目的語・直接目的語・補語・修飾語 |
| 接 | 接続詞（and・but・because など節や語句をつなぐ語） |
| 仮S 真S 仮O 真O | 形式主語・形式目的語の it と、その中身 |

### まとまりの種類

`{種類| 中身}` で書く。先行詞が要る種類は `{種類>先行詞| …}`。

| 表示 | 種類 | 使う場面 |
| --- | --- | --- |
| ( ) 節 | `関係>先行詞` `関係,>先行詞`（前の内容を受けるときは `関係,>前の内容`） | 関係詞節（コンマつきは非制限用法） |
| | `関係省略:目的格>先行詞` `関係省略:目的格(動詞)>先行詞` `関係省略:関係副詞>先行詞` | 省略された関係詞。欠けた語が不定詞の中などにあるときは（動詞）で戻す位置を示す |
| | `that節` `that省略` `同格that>名詞` `疑問詞節` `whether節` `if節` `what節` | 名詞節 |
| | `副詞節:時` ほか（理由・条件・譲歩・対比・目的・結果・様態・比較・程度・範囲・場所・比例） | 副詞節。主語と be動詞を省いた形（while -ing・when possible）も副詞節 |
| | `強調` | It is 〜 that … |
| < > 句 | `前` | 前置詞句。**前置詞はすべてこれで囲む** |
| | `前:意味上の主語` | for A to do の for A（すぐ後ろに to のまとまりを置く） |
| | `to:名詞` `to:形容詞>名詞` `to:補語` `to:副詞(目的/結果/原因/根拠/程度/形容詞)` `疑問詞to` | to不定詞 |
| | `原形` `動名詞` `ing限定` `現在分詞>名詞` `過去分詞>名詞` `分詞構文:種類` `挿入` | 原形不定詞・動名詞・分詞など |
| | `数量` | more than・less than・fewer than＋数（`{数量| More than ten thousand}`） |
| | `反復` | year after year・from week to week（同じ名詞をくり返す決まった言い方） |
| 括らない | `同格>名詞` | 名詞の言いかえ。名詞そのものは括らず、中の句・節だけ括る |
| | `形容詞>名詞` | 名詞を後ろから説明する形容詞（full of …・least able to …） |
| | `並列` | and・or・but で並ぶ語句を `\|` で区切る（4.5章）。表示の改行だけに使い、括弧・役割は変えない |

### 書き方の決まり

- 名詞を説明する節・句は、その名詞の要素の中に置く（O が「the power that … each day」全体になる）。
- 助動詞と否定・副詞をはさむ動詞は分けて書く（`[V has] [M not yet] [V been explained]`）。
- 関係詞節の先頭の役割は、節の中で欠けている語で決める。
  - 主語が欠ける → `[S that]`。**受け身の節（that cannot be recovered、that has been built on）も主語**。
  - 目的語・補語が欠ける → `[O that]` `[C that]`。このとき節には必ず主語がある。
  - 前置詞の目的語が欠ける（depend on、live with）→ `[M that]` と書き、残った前置詞は `[M on]`。
  - 欠けた語がない（the way that …、a way that paper documents cannot）→ `[M that]`。関係副詞の働き。
- 句動詞の副詞（turn out の out）は動詞 V の中に入れる。
- 語順訳 `chunks` は本文をすき間なく順に覆う。1まとまり8語まで。英単語を日本語に入れない。
  区切り方は `docs/reading-phrase-explanation-method.md` に従う。
- `notes` はそのまとまりに固有のことだけ書く。つなぐ語の種類と見分け方は画面が自動で出すので、notes に重ねて書かない。

## 4. 表示の決まり（括弧）

決めた型の一覧と例文は `docs/reading-structure-brackets.md`。基本は次のとおり。

- ( ) は節、< > は句。節は入れ子にし、節の中の句も < > で括る。
- 句の中の句は入れ子にせず、切れ目ごとに閉じて並べる（`<about the future> <of a city>`）。
- 前置詞の目的語になる節・動名詞は前置詞と同じ < > に入れる（`<about (who pays …)>` `<from losing their ability>`）。
- 名詞を後ろから説明する節は、句を名詞のところで閉じてから ( ) だけで示す（`<about the old station> (that stood …)`）。
- 同格の名詞と、名詞を後ろから説明する形容詞は括らない（`Ms. Brown, one <of the librarians>,` `<than a harsh law> full <of loopholes>`）。
- 決まった言い方（year after year・from week to week・more than＋数）は全体を一つの < >。

## 4.5 表示の決まり（並列）

2026-09-18 利用者が図で決めた形。「文の要素」と構造図の両方で、and・or・but で並ぶものを改行して縦にそろえる。

```
The students measured the water level
             and
             recorded the temperature every week.

The prefecture now bans that action,
but
the official rule was too late.

Farmers <from nearby villages> bring vegetables,
                                     fruit
                                     and
                                     flowers
<in small trucks>.
```

- 接続詞（and・or・but・nor・yet・so・rather than など）は単独の行に置く。接続詞の直後のコンマはその行に入れる（and,）。
- 並ぶものは1つ目の先頭の位置にそろえる。手前の語句（共有する主語・助動詞・前置詞）は1つ目の行の左に残る。
- 文どうしの並列は左端から行を分ける。
- 並びの後ろに続く語句は、その行の始まり（左端、または外側の並ぶものの先頭）に戻して次の行に置く。
- 並ぶものごとに左に細い線を引き、画面の幅で折り返した行と次の並ぶものを見分けられるようにする。接続詞の行には線を引かない。
- 手前の語句の右に 12rem 以上の幅が残らない狭い画面では、並びを次の行の左端から置く。

並ぶものの範囲（`src/lib/reading-sentence-structure.js` の `parallel`、配置は `src/lib/structure-parallel-layout.js`）:

- 要素どうし（台帳の `[接 and]` など）は台帳から自動で決める。
  - 接続詞のあとに主語がある → 文どうし。主語と動詞が入れかわる形（and so does X）も文どうし。
  - 接続詞のあとに動詞がある → 述語どうし。1つ目は主語のあとの動詞から。共有する助動詞・to（can・had to・how to、語形が合うときの be・have）は手前に残し、本動詞にそろえる。
  - それ以外 → 接続詞のあとの要素と同じ役割の要素を前へ探し、そこから並べる。コンマで続く同じ役割の要素（by A, by B, and by C）も並ぶものに入れる。対になる前半の語（neither・both・not only・not）は1つ目に入れる。
  - 最後の並ぶもののあとに、コンマで区切って続く修飾語（, while …）は、並びに入れずに後ろへ出す。
- 要素の中で並ぶ語句は、台帳に `{並列| vegetables, | fruit | and flowers}` と `|` で区切って書く。
  1つ目は名詞のかたまりの頭から、2つ目以降は接続詞から始める。対になる前半の語（both・neither・not only）は1つ目に入れる。
  すべての並ぶものが共有する the・enough などの限定詞は並列の外（手前）に置く（`[O the {並列| brakes, | seats, | and lights}]`。2026-09-18 利用者が決定）。
  後ろで共有する名詞は最後の並ぶものに入れる（`{並列| both environmental | and social benefits}`）。
- 自動で決めきれない要素どうしの並列は、要素を並べて `|` で区切る。重なる自動の並列は使わない。
  `[S It] [V travels] [M {前| with the next heavy rain}] {並列| [M {前| into a ditch}], | [M then] [M {前| into a stream}], | [接 and] [M finally] [M {前| into water …}]}`
- 動詞の中の並び（is compressed, cropped, or recorded）は、後ろの修飾語が最後の動詞だけにかかるなら動詞を要素に分けて `[接 or]` で結び、全部にかかるなら動詞の中に `{並列| …}` を書く（修飾語は並びの後ろの行に出る）。
- 関係節・分詞・不定詞が並ぶもの全体を説明するとき（equipment, skill, and time that very few people possessed）は、`{並列| …}` を閉じてから置く。1つだけを説明するときは最後の並ぶものに入れる。
- 検査は `tests/reading-parallel-layout.test.mjs`。利用者の図の3つの形を固定し、全台帳で語を落とさずに組めるかを見る。要素の中の and・or・but・nor が並列の接続詞として書いてあるかも見る（並べないのは文頭の接続詞と、or not・sooner or later だけ）。共有する限定詞が並びの中に残っていないかも見る（2つ目以降が別の名詞のかたまりで、読んで決めた4文だけが例外）。

## 5. つなぐ語の解説の決まり

画面の「節・句とつなぐ語の解説」は台帳から自動で作る（`src/lib/reading-structure-connectors.js`）。
節には必ず種類と見分け方が付く（空だと検査で止まる）。関係詞の解説は先行詞を戻した一文も見せるが、
英語として不自然になる形は出さない。決まりは `docs/reading-structure-brackets.md` の「一文に戻すとき」。

書いたあと、表示される一文を全部読む。とくに次の形は台帳の書き誤りで壊れやすい。

- 前置詞が節の終わりに残る関係詞節
- 受け身の関係詞節
- the way that・the day that のような関係副詞の働きの that
- 文頭の名詞が先行詞になる文（大文字のまま戻っていないか）

## 6. 判断に迷ったとき

1. **文法で決まるものは自分で決める。** 文法的に成り立つ解釈が1つしかない形（前置詞の目的語がなくなる括り方、主語のない関係詞節など）は迷う型ではない。
2. **文法だけで決まらないものは、その場で聞かない。** 7章「確認待ちの型」に、本文の例文2〜3文・選べる形・推奨とその理由を足す。
3. **確認はまとめて1回で行う。** 確認待ちがたまったら、例文つきで一度に利用者に聞く。
4. **決まったら、同じ作業の中で次を全部やる。**
   - `docs/reading-structure-brackets.md` の決めた型の表に、日付つきで書く。
   - 台帳の書き方が増えたら、この仕様書の3章に足す。
   - 決まった例文を `tests/reading-sentence-structures.test.mjs` の `CONFIRMED_BRACKETS` に固定する（何を決めた例文かをコメントで書く）。
   - 表示が変わる文を全部読んで、崩れがないことを確かめる。
5. **確認済みの例文の期待値は、利用者に確認せずに書き換えない。**

## 7. 確認待ちの型

まだ決まっていない型。例文と選べる形を書いておき、作業の区切りで、たまった分をまとめて確認する。

1. **節・句の途中で並びが終わったあとの続き**（全台帳で27か所。多くは節の中で主語が並び、節の続きが左端に戻る形）
   - 例：school_garden#7 `affected the vegetables)>`、resilient_cities#1 `occur more frequently)`、collective_memory#19 `are made))`、shared_watershed#60 `all> <at the same time>`
   - 選べる形：(a) いまのまま、その行の始まり（左端）に戻す（利用者の図の決まりそのまま）
     (b) 節・句の中の並びなら、その節・句の開き括弧の位置にそろえて続ける
     ```
     The students began <to understand (how temperature,
                                            rain,
                                            and
                                            insects
                                       affected the vegetables)>
     ```
   - 推奨 (b)：続きが同じ節の中だと見え、左端の行が主節の続きと取り違えられにくい。決まったら配置の処理で節・句を1つの枠として組む。

### 決まった型（2026-09-18、並列の縦そろえで出た4件をまとめて確認）

| 型 | 決定 | 例 |
| --- | --- | --- |
| between A and B | A と B を縦にそろえる（ほかの並列と同じ見え方） | `<between ten` ／ `and` ／ `two>` |
| sooner or later・whether … or not の or not のような決まった言い方 | 1行のまま。並列にしない | `will sooner or later be resisted`、`whether it happens to be genuine or not` |
| 共有された助動詞・to（can listen …, make …, and borrow …） | (can) を補わない。can は並びの手前に残り、動詞がそろう | `Children can listen …,` ／ `make …,` ／ `and` ／ `borrow …` |
| 共有する the などの限定詞 | the は並びの手前に残し、名詞からそろえる（推奨の「the から」ではなく利用者が選んだ形） | `check the brakes,` ／ `seats,` ／ `and` ／ `lights` |

## 8. 検査と固定値

push の前に、クリーンな複製で次を全部通す。

1. `npm test` … 構造台帳・括弧の固定例文・前置詞の囲み忘れ・つなぐ語の説明・5文型の照合・学習者向け日本語の監査を含む。
2. `npm run audit:all-content` … 全教材監査台帳 `docs/audits/content-audit-ledger.json` を作り直す（忘れるとビルドで止まる）。
3. `npm run build` … `npm run check` と公開物の監査を含む。
4. push のあと、GitHub Pages へのデプロイが成功するまで確かめる。

固定値が動いたら、実測してそろえる。

- `tests/learner-japanese-audit.test.mjs` の5つの数（学習者向け・台帳ファイルの日本語の件数）。台帳や解析器の日本語を変えるたびに動く。
- 意味フレーズ数・複数役割数（`scripts/check-data.mjs`、`tests/phrase-explanation-audit.test.mjs`、`tests/reading-translation-scenarios.test.mjs`）。
- 語義の文数・語数（`tests/passage-sense-glosses.test.mjs`）、役割の下線数（`tests/reading-role-annotations.test.mjs`）。

別の作業と同じ台帳・解析器を触るときは、コミットの直前に fetch と rebase をする。
衝突しやすいのは `docs/audits/content-audit-ledger.json` と固定値のテストで、
監査台帳は上流を採って作り直し、固定値は実測し直す。
