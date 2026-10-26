import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { auditLearnerJapanese, jsxTextLineJoins } from '../scripts/audit-learner-japanese.mjs'

const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8')

const SHARED_RESULT_ENTRIES = [
  '../src/screens/VocabStudy.jsx',
  '../src/screens/VocabQuiz.jsx',
  '../src/screens/PhraseStudy.jsx',
  '../src/screens/PhraseQuiz.jsx',
  '../src/screens/ListeningQuiz.jsx',
  '../src/screens/DictationPlay.jsx',
  '../src/screens/GrammarQuiz.jsx',
]

const DEDICATED_RESULT_SURFACES = [
  ['../src/screens/MathSolve.jsx', /if \(finished\)/],
  ['../src/screens/WritingPlay.jsx', /if \(finished && completedResult\)/],
  ['../src/screens/WritingGrammarReview.jsx', /if \(finished\)/],
  ['../src/screens/Diagnostic.jsx', /phase === 'result'/],
  ['../src/screens/KotenStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenInterpretationQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenGrammarStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenGrammarQuiz.jsx', /if \(done\)/],
  ['../src/screens/KotenCultureStudy.jsx', /if \(done\)/],
  ['../src/screens/KotenCultureQuiz.jsx', /if \(done\)/],
  ['../src/screens/KanbunStudy.jsx', /if \(done\)/],
  ['../src/screens/KanbunQuiz.jsx', /if \(done\)/],
  ['../src/screens/KanbunKundokuQuiz.jsx', /if \(done\)/],
]

const RESULT_COPY_FORBIDDEN = /最新が[「『]|今回の間隔アップ|長期定着(?:へ|への)到達|復習の段階|復習段階|定着段階|記憶段階|よく覚えた段階|覚えている見込み|忘れやすさの予測|復習しない場合の予測|覚え具合|復習期限|期限前の語|今日が期限|次の期限|語が期限|優先度/u

test('学習者向け日本語は画面・部品・自動生成文を全件監査する', async () => {
  const result = await auditLearnerJapanese()

  // 2026-09-26、つづりが似た語の語源（src/data/lookalike-*.js・src/lib/lookalikeOrigins.js・
  // src/components/LookalikeOrigins.jsx）を足して 5ファイル増えた。
  // 2026-09-27、ログイン画面（src/screens/Login.jsx）とログイン・保存の表示を外して 1ファイル減った。
  // 2026-09-28、画面下部の枠（読み上げ・出題・単語帳の登録先）で6ファイル増えた（src/components/StudyMix.jsx・
  // src/components/WordBookSlot.jsx・src/lib/cardSpeechPanel.js・src/lib/studyDock.js・src/lib/studyMix.js・src/lib/wordBookSlot.js）。
  // 2026-09-28、形は似ているが元の語がちがう語のまとまり（src/data/lookalike-forms.js・src/lib/lookalikeForms.js）で
  // 2ファイル増えた（画面の文言を持つのは src/lib/lookalikeForms.js）。
  // 2026-09-29、数学の入試演習で画面・部品・lib が7ファイル（src/screens/MathExam.jsx・MathExamUnit.jsx・
  // MathExamSolve.jsx・src/components/MathAnswerPad.jsx・MathExamFigure.jsx・src/lib/mathExam.js・mathExamLog.js）、
  // 問題データが11ファイル（src/data/math-exam.js と src/data/math-exam/ の10ファイル）増えた。
  // 2026-09-29、名作に親しむを全文表示にして、画面・部品・lib が3ファイル増えた（src/components/LiteratureFullText.jsx・
  // LiteratureSentenceSheet.jsx・src/lib/literature-sentence-analysis.js・punctuation-notes.js の4つを足し、
  // src/components/LiteratureSceneNavigator.jsx を外した）。ソース全体は、文ごとの台帳（literature-sentences.js・
  // literature-classics-notes.js・literature-structures/ の8ファイル）を足し、英語名作の古い全文の場面ファイル・
  // 訳の修正台帳（src/data/literature-full-text/ の12ファイル）を外して、差し引き1ファイル増えた。
  // 2026-09-30、中学の社会・理科で画面・部品・lib が10ファイル（src/screens/SubjectHome.jsx・SubjectUnit.jsx・
  // SubjectStudy.jsx・SubjectQuiz.jsx・SubjectPractice.jsx・Credits.jsx・src/components/SubjectFigure.jsx・
  // SubjectText.jsx・src/lib/subjectPractice.js・subjectText.js）、単元と出典のデータが12ファイル
  // （src/data/subjects/ の11ファイルと src/data/credits.js）増えた。
  // 2026-09-30、自作カード（テンプレート・教科・カテゴリー・CSV）で画面・部品・lib が9ファイル増えた（src/lib/customCards.js・
  // customLibrary.js・customEntryForm.js・customCardsCsv.js・src/components/CustomCardForm.jsx・CustomCardItems.jsx・
  // CustomCardsEntry.jsx・src/screens/CustomCardStudy.jsx・CustomCardQuiz.jsx）。
  // 2026-09-30、自作カードの編集（選んだカードの移動・統合・削除）で2ファイル増えた（src/lib/customCardsEdit.js・
  // src/components/CustomCardEdit.jsx）。
  // 2026-09-30、社会・理科の要点と演習の図で、図を描く部品が8ファイル（src/components/SubjectDiagrams.jsx・
  // SubjectScienceDiagrams.jsx・SubjectGeographyDiagrams.jsx・SubjectHistoryDiagrams.jsx・SubjectCivicsDiagrams.jsx・
  // SubjectMapReadingDiagrams.jsx・SubjectMapFigures.jsx・SubjectClimateFigure.jsx）、図のデータと計算が3ファイル
  // （src/data/subjects/figureKinds.js・figureMath.js・projection.js）増えた。語句の解説の書き直しで、読みの辞書
  // （src/data/subjects/readings.js）に印旛沼・滝沢馬琴・原敬の3語（語と読みで6表記）を足した。
  // 同じ日、全102単元を読み直して、読み方が特別な地名・人名・用語の77語を読みの辞書に足し（語と読みで154表記）、
  // カタカナで読む6語の読みをカタカナにし、出典の1件（国勢調査）と直した文で、教材の日本語が 232966 から 233134 になった。
  // 2026-10-01、疑問詞・関係詞の語の「文の中での働き」で、働きのデータ（src/data/word-grammar-roles.js）と
  // 働きの欄の部品（src/components/GrammarRoles.jsx）の2ファイルが増え、画面の文言が7表記（重複なし5）、
  // 教材の日本語が 233134 から 233340 になった（requests/2026-10-01-wh-word-grammar-roles.json）。
  // 2026-10-01、社会・理科の図表の充実で、図を描く部品が6ファイル（src/components/SubjectFigureKinds.jsx・
  // SubjectScienceParts.jsx・SubjectBiologyDiagrams.jsx・SubjectChemistryDiagrams.jsx・SubjectPhysicsDiagrams.jsx・
  // SubjectEarthDiagrams.jsx）と、図を押して大きく見る部品が1ファイル（src/components/SubjectFigureZoom.jsx）増えた。
  // 足した図・図の読み方・出典と、読みがなの辞書の5語（高句麗・百済・長宗我部・象潟・泉北）で、学習者画面の日本語が
  // 17565 から 18346 に、ソース全体が 233340 から 235558 になった（requests/2026-10-01-subject-figure-enrich.json）。
  // 2026-10-02、辞書の検索で、ほかの意味で当たった語の行に当たった意味の見出し（「ほかの意味」「文の中での働き」）を
  // 出したので、学習者画面の日本語が 18346 から 18348 に、ソース全体が 235558 から 235560 になった（重複なしは変わらない。
  // requests/2026-10-02-dictionary-search-other-senses.json）。
  // 2026-10-02、「語の成り立ち」の見出しが2回続けて出ないよう、部品（EtymologyBlock）の本文の箱の見出しを外したので、
  // 学習者画面の日本語が 18348 から 18347 に、ソース全体が 235560 から 235559 になった（重複なしは変わらない。
  // requests/2026-10-02-etymology-heading-once.json）。
  // 2026-10-02、古典単語・古典文法の重要度とコースから最難関をなくして難関に統合したので、最難関の段の名前
  // （古典単語と古典文法で「最難関大学」「最難関」を2つずつ）と最難関コースの名前・短い名前・説明の7表記が消え、
  // ソース全体が 235559 から 235552 になった（学習者画面の日本語は、古典単語のトップの説明の言い換えだけなので変わらない。
  // requests/2026-10-02-koten-level-merge.json）。
  // 2026-10-07、学習の記録の保存先を IndexedDB にし、保存できなかったときの知らせを出したので、保存の部品
  // （src/lib/appStorage.js）・知らせ（src/components/SaveFailureNotice.jsx）・読み戻しを待つ部品
  // （src/components/StoreReady.jsx）の3ファイルが増え、知らせの見出しと続け方の5表記（重複なし4）で、学習者画面の日本語が
  // 18347 から 18352 に、ソース全体が 235552 から 235557 になった（requests/2026-10-07-study-save-quota.json）。
  // 2026-10-08、英単語の解説の文に出る英単語をリンクにして意味を添えたので、解説の部品（src/components/ExplainedText.jsx）と
  // 文の分け方（src/lib/explanationWords.js。言語名・助詞などの見分けに日本語を持つ）の2ファイルが学習者画面に、
  // 添える意味の台帳（src/data/explanation-words.js）がソース全体に増えた。学習者画面の日本語が 18352 から 18376
  // （重複なし 13713 から 13722）に、ソース全体が 235557 から 237094 になった（requests/2026-10-08-explanation-word-links.json）。
  // 2026-10-09、熟語の級の上書き（src/data/phrase-levels-override.js）と中学の基本熟語155件（src/data/phrases-junior-core.js）の
  // 2ファイルが増え、ソース全体が 829 から 831 ファイル・237094 から 237116 になった（requests/2026-10-09-reference-list-level-caps.json）。
  // 2026-10-09、長文の単語まとめの単語の一覧を共通のスワイプ一覧にし、詳細の案内・空のときの文の6表記（重複なし3）で、
  // 学習者画面の日本語が 18376 から 18382 に、ソース全体が 237116 から 237122 になった（requests/2026-10-09-reading-summary-swipe.json）。
  // 2026-10-09、読解の準備を本文に合わせ、準備の読解ルールを読解画面から作る部品（src/lib/readingPrepRules.js）が学習者画面に、
  // 本文に出る熟語を足す台帳（src/data/reading-prep-phrase-additions.js）がソース全体に増えた。読解ルールの段の見出し・
  // 重点語ケースの入口と一覧・あらすじの書き直し・13語のほかの意味などで、学習者画面の日本語が 18382 から 18405
  // （重複なし 13725 から 13736）に、ソース全体が 831 から 833 ファイル・237122 から 237197 になった
  // （requests/2026-10-09-reading-prep-alignment.json）。
  // 2026-10-13、教科書から単語追加の読み取りで日本語も読み、実在しない英単語を出さないようにした。英語の単語表を読む部品
  // （src/lib/englishWordList.js）が増え、確かめられなかった文字の欄・不確かの印・読み違いを直した印・日本語の行の
  // 読み直しの知らせ・出典の1件（英単語の確かめ）などで、学習者画面の日本語が 18405 から 18417（重複なし 13736 から 13747）に、
  // ソース全体が 833 から 834 ファイル・237197 から 237212 になった（requests/2026-10-13-camera-ocr-japanese.json）。
  // 2026-10-14、教科書から単語追加の読み取りを、写真の下ごしらえ（src/lib/ocrImage.js）・2つのエンジンで読んでまとめる手順
  // （src/lib/ocrEngine.js）・文脈で読み分ける部品（src/lib/ocrContext.js）に分けたので、学習者画面とソース全体のファイルが3つずつ
  // 増えた（日本語の表記の数は、日本語の行の読み直しの知らせを外して変わらない。requests/2026-10-13-camera-ocr-japanese.json）。
  // 2026-10-14、教科書から単語追加の読み取りエンジンを Tesseract から PaddleOCR に置きかえ、モデルの表（src/lib/ocrModels.js）が
  // 増えた。Tesseract の進み具合の知らせ（エンジンの起動・準備など）をまとめて、学習者画面の日本語が 18421 から 18418（重複なし
  // 13747 から 13745）に、ソース全体が 838 から 839 ファイルになった。出典ページにモデルの1件（写真の文字の読み取り）を足して、ソース全体の
  // 日本語は 237223 のまま（requests/2026-10-14-camera-ocr-hard-photos.json）。
  // 2026-10-16、自作カードの Excel 入出力の漏れを直したので（CSV のカテゴリーの設定の列・上限5,000件・切り捨ての知らせ・
  // 区切りと括弧の書き方・テンプレート変更の置き換え、一覧の100枚ずつの表示、学習の記録のファイル保存と読み込み）、
  // 学習者画面の日本語が 18418 から 18445（重複なし 13745 から 13769）に、ソース全体の日本語が 237223 から 237250 になった
  // （requests/2026-10-16-custom-cards-excel-io-audit.json）。
  // 2026-10-18、本物の Excel で確かめた結果に合わせ、Excel の「CSV」（Shift_JIS）で保存したファイルの知らせ・
  // 列の書き方の2項目（保存の形・数字や日付に見える欄）・知らせの見出しの言い換えで、学習者画面の日本語が 18445 から 18450
  // （重複なし 13769 から 13774）に、ソース全体の日本語が 237250 から 237255 になった（同じ依頼台帳）。
  // 2026-10-20、どこからも読み込まれていなかった部品3つ（BattleOpponentStandingActor・BattleStageBackdrop・HeroPortrait）と
  // src/lib のモジュール3つ（etymologyCompanions・etymologyMeaning・reading-phrase-review）を消したので、学習者画面が 359 から 353、
  // ソース全体が 839 から 833 ファイルになり、学習者画面の日本語が 18450 から 18359（重複なし 13774 から 13687）に、
  // ソース全体の日本語が 237255 から 237164 になった（画面には出ていなかった文字列。requests/2026-10-20-remove-unused-files.json）。
  // 2026-10-21、熟語・構文の詳細シートを部品（components/PhraseDetailSheet.jsx）に切り出し、単語の熟語・構文カードに級と「説明」を足したので、
  // 学習者画面が 353 から 354、ソース全体が 833 から 834 ファイルになり、学習者画面の日本語が 18359 から 18358（重複なし 13687 から 13688）に、
  // ソース全体の日本語が 237164 から 237163 になった（requests/2026-10-21-word-phrase-cards.json）。
  // 2026-10-22、数学を手で計算せずに方針を選んで解く形にした。画面・部品・lib は、穴埋めと数字キーの部品
  // （src/components/MathFillIn.jsx・MathAnswerPad.jsx）を外し、方針の段の部品（src/components/MathExamApproach.jsx・
  // src/lib/mathExamApproach.js）を足して 354 のまま。ソース全体は、方針の段のデータ（src/data/math-exam-approach.js と
  // その9ファイル・src/data/math-guided-approach.js とその5ファイル）を足し、穴埋め・3択の説明の台帳
  // （src/data/math-fill-notes.js・math-choice-notes.js）を外して 834 から 848 ファイルになった。学習者画面の日本語は
  // 解答欄・目安時間・答え方の決まりの文を消し、誘導問題の「わからない」を共通の部品にして 18358 から 18343（重複なし 13688 から 13685）に、ソース全体の日本語は
  // 方針の段・考え方・手がかり・選択肢の説明を足して 237163 から 244924 になった（requests/2026-10-22-math-no-hand-calc.json）。
  // 2026-10-22、自作カードの「写真から作る」で、画面（src/components/CustomCardPhoto.jsx）・教科書から単語追加と共通の写真を読む部品
  // （src/components/PhotoOcrPicker.jsx）・候補の作り方（src/lib/customCardsPhoto.js）の3ファイルが増え、学習者画面が 354 から 357、
  // ソース全体が 848 から 851 ファイルになった（requests/2026-10-22-custom-cards-photo-ocr.json）。
  // 2026-10-24、続き表示のボタンを共通の部品（src/components/LoadMoreButton.jsx）にし、下までスクロールしたら押さなくても
  // 続きを足すようにしたので、学習者画面が 357 から 358 ファイルになった（requests/2026-10-24-load-more-on-scroll.json）。
  // 2026-10-25、数学の歴史のテストの画面を外して 358 から 357 ファイルになった
  // （requests/2026-10-25-math-history-remove-quiz.json）。
  // 2026-10-26、単語カードの級の印を共通の部品（src/components/WordLevelBadge.jsx）にして語源カードにも出したので、
  // 357 から 358 ファイルになった（requests/2026-10-26-etymology-word-levels.json）。
  // 2026-10-26、品詞バッジを似た語のカードでも使うため共通の部品（src/components/PosBadge.jsx）に分けて、358 から 359 ファイルになった
  // （requests/2026-10-26-lookalike-word-cards.json）。
  assert.equal(result.learnerFiles, 359)
  // 2026-10-14、リスニングの本文の話者名に人物（女性・男性・男の子・女の子）を添える台帳（src/data/listening-speaker-roles.js）と
  // 話者名の部品が増え、学習者画面の日本語が 18417 から 18421 に、ソース全体が 834 から 835 ファイル・237212 から 237223 になった
  // （接尾辞カード -al を2枚に分けた見出し・意味・由来の3件をふくむ。requests/2026-10-14-content-observations-fix.json）。
  // 2026-10-22、単語の熟語・構文カードの「説明」の文字を外したので、学習者画面の日本語が 18343 から 18342 に、
  // ソース全体の日本語が 244924 から 244923 になった（requests/2026-10-22-word-phrase-card-layout.json）。
  // 同じ日、自作カードの「写真から作る」の画面の文（入口・候補の理由の知らせ・登録の知らせ・テンプレートごとの分け方の案内）で、
  // 学習者画面の日本語が 18342 から 18467（重複なし 13685 から 13770）に、ソース全体の日本語が 244923 から 245048 になった
  // （写真を読む部品は教科書から単語追加から移したので、移した文は数が変わらない。requests/2026-10-22-custom-cards-photo-ocr.json）。
  // 2026-10-23、自作カードの品詞・級・分野に「ー」を足した。級の表示の文字（級ー）と選択欄で学習者画面の日本語が 18469 から 18472（重複なし 13772 から 13774）
  // ソース全体の日本語は 6 増える（requests/2026-10-23-custom-card-unset-attrs.json）。
  // 2026-10-22、社会アプリに高校の地理総合・歴史総合を足した。冊の切り替えと出題傾向の画面の文で学習者画面の日本語が 18467 から 18469
  //（重複なし 13770 から 13772）に、教材のファイル（src/data/subjects の geoSogo・hisSogo 計16本）でソース全体が 851 から 867 ファイル・
  // 日本語が 245048 から 258252 になった（requests/2026-10-22-high-school-social.json）。
  // 2026-10-25、数学の歴史のテストの画面と、目次・話のテストの入口・間違えた問題のやり直しの文を外して、
  // 学習者画面の日本語が 18472 から 18430（重複なし 13774 から 13756）になった（requests/2026-10-25-math-history-remove-quiz.json）。
  // 2026-10-25、数学の誘導問題と入試演習を方針の3択から計算の経過の穴埋めにした。方針の段の部品（MathExamApproach.jsx・
  // mathExamApproach.js）を外し、穴埋めの部品（src/components/MathWork.jsx・src/lib/mathWork.js）を足したのでファイル数は変わらず、
  // 学習者画面の日本語が 18430 から 18426（重複なし 13756 から 13752）になった（requests/2026-10-25-math-work-fill.json）。
  assert.equal(result.learnerJapaneseEntries, 18426)
  // 2026-10-26、語源カード詳細と語根の一覧の単語の行に級の印（badgeFor）を足し、2画面の行の属性の並びが同じ文になったので、
  // 重複なしが 13752 から 13751 になった（見える文は変わらない。requests/2026-10-26-etymology-word-levels.json）。
  // 2026-10-26、似た語の行の「ほか◯語」を、語のカードの下のボタン「ほか◯語も見る」にした。文の数は同じで、
  // 重複なしが 13751 から 13752 になった（requests/2026-10-26-lookalike-word-cards.json）。
  assert.equal(result.learnerUniqueJapaneseEntries, 13752)
  // 2026-10-24、続き表示の共通の部品（src/components/LoadMoreButton.jsx）でソース全体が 867 から 868 ファイルになった
  // （requests/2026-10-24-load-more-on-scroll.json）。
  // 2026-10-25、数学の歴史のテストの画面と計算しない問いの検査を外して 868 から 867 ファイルになった。
  // 2026-10-26、単語カードの級の印の共通の部品（src/components/WordLevelBadge.jsx）で 867 から 868 ファイルになった。
  // 2026-10-26、品詞バッジの共通の部品（src/components/PosBadge.jsx）で 868 から 869 ファイルになった。
  assert.equal(result.sourceFiles, 869)
  // 2026-10-23、カタカナ語の台帳（src/data/loanword-hints.js）を全見出し語 8,929語で読み直して 1,550 語から約 2,950 語に増やし、
  // 注意書きの日本語でソース全体の日本語が 258252 から 260042 になった（学習者画面の日本語は変わらない。requests/2026-10-23-loanword-katakana-expand.json）。
  // 自作カードの「ー」の6文は、あとから足したのでソース全体は 260042 から 260048。
  // 2026-10-25、数学の歴史のテスト252問（問い・選択肢・解説・選択肢の説明・考え方）を外して 260048 から 257937 になった。
  // 2026-10-25、数学の方針の段のデータ（16ファイル）を経過の穴埋めのデータ（src/data/math-guided-work.js とその5ファイル・
  // src/data/math-exam-work.js とその9ファイル）に置きかえ、ファイル数は 867 のまま、日本語が 257937 から 251704 になった
  // （requests/2026-10-25-math-work-fill.json）。
  assert.equal(result.sourceJapaneseEntries, 251704)
  assert.equal(result.issues.length, 0)
})

test('JSXの地の文を改行でつなぐ所は、つなぎ目の前後が日本語のときだけ止める', () => {
  const source = [
    'export const Joined = () => (',
    '  <p>',
    '    この問題数は、すべての暗記・テストに使われます。',
    '    今の番号より少なくしても、記録は残ります。',
    '  </p>',
    ')',
    'export const Split = ({ count }) => (',
    '  <p>',
    "    {'この問題数は、すべての暗記・テストに使われます。'}",
    "    {`今の${count}問より少なくしても、記録は残ります。`}",
    '    全{count}語',
    '    <strong>強調</strong>',
    '    あとの文です。',
    '  </p>',
    ')',
    'export const English = () => (',
    '  <p>',
    '    English sentences',
    '    may wrap freely.',
    '  </p>',
    ')',
    'export const Mixed = () => (',
    '  <p>',
    '    級別は各4問の結果です。',
    '    1マスだけで決めない。',
    '  </p>',
    ')',
  ].join('\n')

  assert.deepEqual(jsxTextLineJoins(source), [
    { line: 3, before: 'この問題数は、すべての暗記・テストに使われます。', after: '今の番号より少なくしても、記録は残ります。' },
    { line: 24, before: '級別は各4問の結果です。', after: '1マスだけで決めない。' },
  ])
})

test('結果画面へ至る全21経路は、回答と次の行動を直接示す日本語だけを使う', () => {
  assert.equal(SHARED_RESULT_ENTRIES.length, 7)
  assert.equal(DEDICATED_RESULT_SURFACES.length, 14)
  assert.equal(SHARED_RESULT_ENTRIES.length + DEDICATED_RESULT_SURFACES.length, 21)

  const sharedSources = SHARED_RESULT_ENTRIES.map((relative) => {
    const source = read(relative)
    assert.match(source, /navigate\('sessionResult'/, `${relative} must reach the shared result`)
    return source
  })
  const dedicatedSources = DEDICATED_RESULT_SURFACES.map(([relative, marker]) => {
    const source = read(relative)
    assert.match(source, marker, `${relative} must retain its result branch`)
    return source
  })
  const resultImplementations = [
    read('../src/screens/SessionResult.jsx'),
    read('../src/components/StudyCompletionReport.jsx'),
    ...dedicatedSources,
  ]

  assert.doesNotMatch(
    [...sharedSources, ...resultImplementations].join('\n'),
    RESULT_COPY_FORBIDDEN,
  )
})
