# えいごクエスト 📚

英検5級〜1級対応・スマホ最適の英語学習アプリ（GitHub Pages で公開できる静的サイト）。
Vite + React + Tailwind CSS で作られています。

## いまできること（v0.1）

- **単語モード（深く作り込み済み）**
  - 級選択（英検5級〜1級）／級ごとの進捗表示
  - 🔊 **語源つき暗記カード**（タップで発音・意味・例文・語源分解）
  - **3択＋「わからない」クイズ**（即時フィードバック）
  - **単語詳細** … 語源（接頭辞＋語根＋接尾辞）を「意味の式」で分解し、**この語源から増やせる単語**へジャンプ
  - **マイ単語リスト**に保存して、まとめて学習・クイズ
  - 簡易 **間隔反復（SRS）** で苦手語を自動で復習に出題
  - 収録：英検5級〜1級・大学受験対応の**約7900語**（5級〜準1級は公式目安の9割以上をカバー＝全面再レベリング済み、1級の上級語彙も約950語に拡充）。全語に**分野(field)タグ**つき、主要語に**語族**つき**全語に語源＋発音記号(IPA)**つき（IPAは CMU Pronouncing Dictionary から自動生成）
  - **CSV一括取り込み**：`npm run import file.csv` で数百〜数千語をまとめて追加可能（[import.sample.csv](import.sample.csv) 参照）
  - **単語をさがす**：英語/日本語で全語を検索、級フィルタつき（「単語」タブ右上の🔍）
- **長文モード**
  - 級別の長文を収録。**一文をタップ → 詳細ウィンドウ**が開く
  - 詳細では「単語ごとの発音・意味」「区切り直訳（スラッシュリーディング）」「きれいな和訳」
  - **まとめ**で出現語をまとめて学習・クイズ・マイ単語に保存。読了マーク付き
- **熟語・構文モード**
  - 熟語（句動詞）・構文（文型）を **3択＋わからない** と暗記カードで学習
  - 単語と同じ SRS・進捗を共有
- **文法モード**
  - **級ごと（5級〜1級、各428〜429問・計3000問）の文法問題を4択（空所補充）** で出題。全単元3問以上を収録し、級タブ→単元（be動詞・過去形・現在完了…）を選んで挑戦
  - 即時○×＋完成文（音声つき）＋解説＋**同じ形の例2文（和訳・音声つき）**。単語と同じ SRS・進捗を共有
- **学習診断テスト** … 単語・文法・語法/熟語・長文読解を5級〜1級まで横断する28問
  - 正答率、英検級の目安、分野別の強み・要復習、**アプリ内推定偏差値**を表示
  - 推定偏差値は級別難易度と4択の偶然正答率によるモデル値（全国模試の実測偏差値ではありません）
  - 診断履歴は端末・進捗コード・ログイン時のクラウド同期に保存
- **リスニング** … 単語を伏せて音声だけ再生 → 意味を3択（ゆっくり再生あり）
- **ディクテーション** … 英文音声を聞き、バラバラの単語ブロックを聞こえた順にタップして並べる（タイプ不要）→ 位置ごとに採点
- **発音チェック** … お手本TTS＋マイク（音声認識）で、認識文字列との一致度を0–100で表示
  - 音素・母音・アクセントを精密に測る採点ではありません
  - ⚠️ 音声認識は Chrome/Edge 等のみ。iPhone Safari など非対応環境では自己評価で進行
- **進捗コード** … バックエンド無しで進捗を「発行」し、別端末や次回に「読込」で再開（「記録」タブ）
- **きょうの語源** … 日替わりで語根を紹介。「パーツを足して意味を組み立てる語」と「由来の説明から広げる同語源語」を分け、語彙を芋づる式に増やせる
- 発音お手本の読み上げ（Web Speech API。全環境で動作）

## 開発

```bash
npm install      # 依存をインストール（初回のみ）
npm run dev      # 開発サーバ（http://localhost:5173）
npm run build    # 本番ビルド → dist/
npm run preview  # ビルド結果をローカル確認
npm run vocab    # 語彙カバレッジ・レポート（級/品詞/語根の充足、重複・欠落、増量ヒント）
npm run grammar  # 文法問題の級・単元カバレッジ
npm run etymology # 全語源を走査（意味の式/同語根/語族/由来単独の分類、改善候補）
npm run import f.csv  # CSVから単語を一括取り込み → src/data/words-imported.js を生成
```

## GitHub Pages へ公開

1. このフォルダを Git リポジトリにして GitHub に push する：
   ```bash
   git init
   git add -A
   git commit -m "init: えいごクエスト"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
   git push -u origin main
   ```
2. GitHub のリポジトリ → **Settings → Pages → Build and deployment → Source** を
   **「GitHub Actions」** に設定する。
3. `main` に push するたびに [.github/workflows/deploy.yml](.github/workflows/deploy.yml) が
   自動でビルド＆公開します。URL は `https://<ユーザー名>.github.io/<リポジトリ名>/`。

> `vite.config.js` の `base: './'` により、リポジトリ名に関係なくそのまま動きます（設定変更不要）。

## 単語データの増やし方

単語データは **1種類のコンパクト形式に統一**されています（[`src/data/words.js`](src/data/words.js)〜`words18.js`）。
1語＝1行の配列に**すべての情報を内包**し、末尾で `expandCompact` に通すだけです。

```js
//  [ word, pos, level, "意味（・区切り）", "英例文", "和訳", 語源, {syn,ant,der,usage}? ]
['predict', '動', '2', '予言する・予測する', 'Experts predict rain tomorrow.', '専門家は明日雨だと予測する。',
  { parts: [{ t: 'pre', kind: 'prefix', gloss: '前もって' },
            { t: 'dict', kind: 'root', gloss: '言う', root: 'dict' }],  // root を付けると語源マップに自動接続
    note: '前もって(pre)言う(dict)→「予言・予測する」。' },
  { der: [{ w: 'prediction', m: '予言' }, { w: 'predictable', m: '予測できる' }] }],  // 8番目=補助情報(任意)

// 語根リンク不要なら語源は文字列でよい。類義語/反対語/使い方も8番目に：
['huge', '形', '準2', '巨大な', 'A huge crowd gathered.', '巨大な群衆が集まった。', 'ラテン …',
  { syn: [{ w: 'enormous', m: '巨大な' }], ant: [{ w: 'tiny', m: 'ごく小さい' }] }],
```

- `pos`：`動/名/形/副/前/接/代`。`level`：`'5' '4' '3' 'pre2' '2' 'pre1' '1'`。`id` は word から自動生成。
- **語源(7番目)は必須**。文字列(由来) か オブジェクト(`parts`付き)。`kind`: `prefix/root/suffix/stem`。
  `parts[].root` が [`roots.js`](src/data/roots.js) のIDを指すと「語源でつながる単語」に自動で現れる。
- **発音記号(IPA)は書かない**。`npm run phonetics` が CMU辞書から自動生成し補完する。
- **補助情報(8番目・任意)** `{ syn, ant, der, usage, field }`（`syn`=類義語/`ant`=反対語/`der`=派生語、各 `{w:英単語, m:意味}`／`usage`=使い分け／`field`=分野(科学・医学・心理など)）。
  単語詳細に「使い方・使い分け／派生語／類義語・同義語／反対語」を表示（意味つき、辞書にある語はタップで詳細へ）。
  ※ 以前の `extras.js`（別マップ）は廃止し、各語のタプルに一本化した。
- **語族ルール（`npm run check` で強制）**：1エントリ＝1語族で数える。規則的・透明な派生語
  （prediction, quickly…）は `derivatives` に留め、**独立エントリにしない**。意味がずれる派生語
  （economical, industrious, considerate…）は**独立エントリ**にする。ゆえに **`derivatives` の項目が
  独立エントリと重複してはならない**（二重計上＝水増し防止。違反するとビルドが止まる）。

### 必須項目（データ契約）と検証 — 生成ミスを防ぐ仕組み

全単語は次を**必ず**備える必要があります（既存機能が全語で動くため）：

> `id, word, pos, level, meaning, meanings, example(en/ja), etymology, phonetic(IPA)`

- **発音記号(IPA)は手で書かなくてよい**：`npm run phonetics` が CMU Pronouncing Dictionary から
  全語のIPAを自動生成し [`src/data/phonetics.js`](src/data/phonetics.js) を作る（語に `phonetic` が無ければここから補完）。
- **検証ゲート**：`npm run check`（= `npm run build` の前に自動実行 `prebuild`）が上の必須項目を全件チェックし、
  1件でも欠けると**ビルドを止める**。語源やIPAを忘れた生成データは公開されません。
- 追加時の手順：**①データを足す → ② `npm run phonetics` → ③ `npm run check` → ④ `npm run build`**。
- カバレッジ確認は `npm run vocab`（級・品詞・語根のバランス、重複・欠落）。
- CSV一括取り込み：`npm run import file.csv`（`note` 列に簡潔な由来を入れること。空だと検証で弾かれる）。

## これから（ロードマップ）

要望されたモードは一通り実装済みです（単語・熟語・構文・長文・リスニング・ディクテーション・発音チェック）。
今後は主に **中身の充実と磨き込み**：

- 各データの増量（現在はサンプル中心。本番の英検語彙・長文へ）
- 音素ベースの発音評価、リスニングの文・会話問題化
- UI・アニメの調整

データ追加は単語 [`src/data/words.js`](src/data/words.js) / [`words2.js`](src/data/words2.js)、
長文 [`src/data/passages.js`](src/data/passages.js)、熟語・構文 [`src/data/phrases.js`](src/data/phrases.js) に
同じ形式で足すだけです。

## 技術メモ

- 状態管理：Zustand（`src/store/useStore.js`）。学習状態は localStorage に自動保存。
- 進捗コード：`src/lib/progressCode.js`（lz-string で圧縮 → `EQ1-...` 文字列）。
- ルーティングはURLを使わない画面ステート方式なので、GitHub Pages で更新しても404になりません。
