// 文法の参考書：級をまたいだ単元（系統）のページ。並びは grammar-strands.js の系統と同じ。
import { strandReference } from './strand.js'

export const GRAMMAR_STRAND_REFERENCES = [
  strandReference({
    id: 'sentence-basics',
    overview: [
      '英語の文は「主語＋動詞」から始まり、動詞の後ろに何を置くかで形（文型）が決まる。5級で be動詞と一般動詞の文を学び、4級で There is / are、3級で SVC・SVOO・SVOC へ広がる。',
      '2級では、長い目的語を後ろに回す形式目的語 it と、物や出来事を主語にする無生物主語を学び、英語らしい文の組み立て方を身につける。',
    ],
    steps: [
      ['5', 'be動詞', '「〜です」「〜にいる・ある」は be動詞。主語に合わせて am・is・are を選ぶ。', 'Emi and I are classmates.', 'エミと私は同級生です。'],
      ['5', '一般動詞・3単現', '動作・気持ちは一般動詞。今の文で主語が3人称単数なら動詞に s・es を付ける。', 'My sister goes to school by bus.', '姉はバスで学校へ行きます。'],
      ['4', 'There is/are', '「〜がある・いる」は There is / are。be動詞は後ろの名詞の数に合わせる。', 'There were two chairs in the room yesterday.', '昨日、部屋にはいすが2脚ありました。'],
      ['3', '文型(SVOO/SVOC)', '動詞の後ろに「人＋物」（SVOO）や「目的語＋補語」（SVOC）を置く形を学ぶ。', 'The news made me happy.', 'その知らせは私をうれしい気持ちにしました。'],
      ['2', '形式目的語', 'SVOC の目的語が長いときは it を置き、to 〜・that 〜 を後ろに回す。', 'I found it hard to believe his story.', '彼の話は信じがたいと思いました。'],
      ['2', '無生物主語', '原因になる物・出来事を主語にして、「〜のおかげで・〜のせいで」を表す。', 'The heavy rain prevented us from going out.', '激しい雨のせいで、私たちは外出できませんでした。'],
    ],
    links: [
      'be動詞の文と一般動詞の文をまぜない（×I am play tennis.）。否定文・疑問文の作り方もちがう。',
      'SVOO の「人＋物」と、SVOC の「目的語＝補語」は見分けが大切。give me a book は me≠a book、make me happy は me＝happy。',
      '形式主語の It is 〜 to …（3級）と、形式目的語の find it 〜 to …（2級）は同じ考え方で、長いまとまりを後ろに回す。',
    ],
  }),

  strandReference({
    id: 'negation-question',
    overview: [
      '否定文と疑問文は、5級の do / does から始まり、疑問詞、疑問詞＋to 不定詞（4級）、付加疑問（4〜3級）、間接疑問（3級〜準2級）へ広がる。',
      '2級の部分否定では、not all・not always のように「すべてが〜というわけではない」という、否定の範囲の読み取りを学ぶ。',
    ],
    steps: [
      ['5', '否定文・疑問文', '一般動詞の否定文・疑問文は do・does を使い、動詞を原形にする。', 'Does Ken play tennis? — No, he doesn’t.', 'ケンはテニスをしますか。— いいえ、しません。'],
      ['5', '疑問詞', 'what・who・when・where・why・how などで、具体的な内容をたずねる。', 'Where do you live? — I live in Osaka.', 'あなたはどこに住んでいますか。— 大阪に住んでいます。'],
      ['4', '疑問詞+不定詞', 'how to 〜・what to 〜 のように、疑問詞＋to＋原形 で1つのまとまりを作る。', 'Please tell me how to use this camera.', 'このカメラの使い方を教えてください。'],
      ['4', '付加疑問', '文の最後に短い疑問を付けて「〜ですよね」と確かめる。ふつうの文には否定の形を付ける。', 'You are from Canada, aren’t you?', 'あなたはカナダ出身ですよね。'],
      ['3', '付加疑問', '現在完了・助動詞・There is・I am の文にも付加疑問を付ける。', 'You have not seen this movie, have you?', 'あなたはこの映画を見ていないですよね。'],
      ['3', '間接疑問', '疑問詞で始まる疑問文を文の中に入れると「疑問詞＋主語＋動詞」の順になる。', 'I don’t know who he is.', '私は彼がだれなのか知りません。'],
      ['pre2', '間接疑問', '疑問詞のない疑問文を入れるときは whether / if（〜かどうか）を使う。', 'I wonder whether it will rain.', '雨が降るだろうか。'],
      ['2', '部分否定', 'not＋all / always / every は「すべて・いつも〜というわけではない」という部分否定。', 'Expensive products are not always better than cheap ones.', '高い製品がいつも安い製品よりよいとは限りません。'],
    ],
    links: [
      '疑問詞の疑問文（Where does she live?）を文の中に入れると、does が消えて where she lives になる。',
      '付加疑問の答え方は内容で決まる。否定の付加疑問でも、「ちがう」なら No。',
      'not all（全部が〜ではない＝一部は〜）と no（1つも〜ない）の区別は、長文の内容一致でもよく問われる。',
    ],
  }),

  strandReference({
    id: 'imperative-exclamation',
    overview: [
      '命令文と感嘆文は、どちらも「主語＋動詞」のふつうの語順ではない文。',
      '5級の命令文は主語 you を書かずに動詞の原形で始める。4級の感嘆文は What や How で始め、「なんて〜なのだろう」と気持ちを強く表す。',
    ],
    steps: [
      ['5', '命令文', '動詞の原形（be動詞なら Be）で始める。禁止は Don’t、強い禁止は Never、誘うときは Let’s。', 'Let’s not waste time.', '時間をむだにするのはやめましょう。'],
      ['4', '感嘆文', '名詞があるときは What (a)＋形容詞＋名詞、形容詞・副詞だけなら How＋形容詞・副詞。', 'What a beautiful view this is!', 'これはなんて美しい景色なのでしょう。'],
    ],
    links: [
      '命令文はふつう「.」、強く言うときは「!」で終わる。感嘆文は「!」で終わる。',
      '命令文の付加疑問は will you?、Let’s の文は shall we?（4級の付加疑問）。',
    ],
  }),

  strandReference({
    id: 'noun-article-quantity',
    overview: [
      '名詞は「数えられるか」と「どれのことか決まっているか」で形と前に付く語が変わる。5級で複数形と a / an / the を学ぶ。',
      '準2級では few・little・a number of などの数量表現、1級では each・both・all などの限定詞の語順と数の扱いまで広がる。',
    ],
    steps: [
      ['5', '名詞の複数形', '2つ以上なら複数形（-s / -es）。child → children のように形が変わる語もある。', 'I see three children over there.', 'あそこに子どもが3人見えます。', { over: 'over there で「あそこに」' }],
      ['5', '冠詞', 'a / an は次の語の音で選ぶ。話に出た物・1つしかない物には the。', 'My brother is an engineer.', '私の兄は技術者です。'],
      ['pre2', '数量表現', '数えられる名詞には few / a few、数えられない名詞には little / a little。a があれば「少しはある」。', 'I have a few friends, so I’m not lonely.', '友達が少しいるので、さびしくありません。'],
      ['1', '限定詞・数量', 'all the＋名詞 の語順、each・either は単数、both は複数として扱う。', 'Each of the alternatives has serious drawbacks.', 'どの代案にも深刻な欠点があります。'],
    ],
    links: [
      'water・information・advice は数えられない名詞なので、a / an も複数形の s も付けない。',
      'a number of＋複数名詞（多くの〜）は複数、the number of＋複数名詞（〜の数）は単数として扱う。',
    ],
  }),

  strandReference({
    id: 'pronoun',
    overview: [
      '代名詞は、5級で「働きによって形が変わる」（I・my・me・mine）ことと、this・that で物を指すことから始まる。',
      '4級では one（同じ種類の1つ）・another・something・myself などが加わる。準2級では the other・others・each other の使い分けと、再帰代名詞の決まった言い方まで広がる。',
    ],
    steps: [
      ['5', '代名詞', '主語には主格、名詞の前には所有格、動詞・前置詞の後ろには目的格、「〜のもの」は所有代名詞。', 'Our teacher teaches us music.', '私たちの先生は私たちに音楽を教えます。'],
      ['5', '指示語', '近くの物は this・these、遠くの物は that・those。these・those の後ろは複数形と are。', 'These apples are very sweet.', 'これらのリンゴはとても甘いです。'],
      ['4', '代名詞', 'it は「その物そのもの」、one は「同じ種類の別の1つ」。something・everyone は単数として扱う。', 'I lost my umbrella, so I bought a new one.', '傘をなくしたので、新しいのを買いました。'],
      ['pre2', '代名詞', '2つのうち残りは the other、ほかの人は others、残り全部は the others、お互いは each other。', 'Some students agreed, but others opposed the plan.', '賛成した生徒もいれば、その計画に反対した生徒もいました。'],
      ['pre2', '再帰代名詞', '主語と目的語が同じなら myself・himself などを使う。enjoy oneself・by oneself のような決まった言い方もある。', 'We enjoyed ourselves at the festival.', '私たちはお祭りで楽しく過ごしました。'],
    ],
    links: [
      'it と one：My bike is old. I want a new one. の one は、今の自転車そのものではない。',
      'another は「もう1つ（どれでもよい1つ）」、the other は「2つのうちの残りの1つ」。the があるかどうかは、残りが決まっているかで決まる。',
    ],
  }),

  strandReference({
    id: 'preposition',
    overview: [
      '前置詞は、名詞の前に置いて時・場所・方向・道具などの関係を表す。5級で at・on・in の基本を学び、3級では by と until、during と while のように、似た意味の区別へ進む。',
      '準2級では despite・because of のような前置詞と接続詞の区別、pay attention to のような決まった組み合わせを学ぶ。さらに上の級では、論説文でよく使う組み合わせ（cast doubt on など）が増える。',
    ],
    steps: [
      ['5', '前置詞', '時刻 at・曜日 on・月 in。場所は in（中）・on（くっついて上）・under（下）。', 'The class starts on Monday morning.', '授業は月曜日の朝に始まります。'],
      ['4', '前置詞', 'look for・wait for・listen to のように、動詞と組んで1つの意味を作る形を覚える。', 'They waited for the train in the rain.', '彼らは雨の中で電車を待ちました。'],
      ['3', '前置詞', 'by（〜までに）と until（〜までずっと）、during（前置詞）と while（接続詞）を区別する。', 'Ken must return the library book by next Monday.', 'ケンは次の月曜日までに図書館の本を返さなければなりません。'],
      ['pre2', '前置詞', 'despite・during の後ろは名詞。pay attention to・take 〜 into account などの組み合わせを使う。', 'Despite the heavy traffic, we arrived on time.', 'ひどい渋滞にもかかわらず、私たちは時間どおりに着きました。'],
      ['2', '前置詞', 'place a burden on・have an effect on のように、名詞・動詞と決まった前置詞の組みで覚える。', 'Music has a strong effect on our mood.', '音楽は私たちの気分に強い影響を与えます。'],
      ['pre1', '前置詞', 'cast doubt on・be attributable to など、論説文でよく使う組み合わせまで広げる。', 'The new report casts doubt on the original claim.', '新しい報告書は、もとの主張に疑問を投げかけています。'],
    ],
    links: [
      '前置詞の後ろは名詞（か動名詞）、接続詞の後ろは「主語＋動詞」。because of the rain / because it was raining。',
      '前置詞の意味は基本のイメージとつなげると整理しやすい（on＝接触・のしかかる、to＝向かう先、with＝相手・道具）。',
    ],
  }),

  strandReference({
    id: 'tense',
    overview: [
      '時制は「いつのことか」を動詞の形で表す。5級の現在進行形、4級の過去形・未来表現・過去進行形で、今・過去・未来と「〜している最中」の言い方がそろう。',
      '1級では、単純形・進行形・完了形が出来事をどう捉えるかという「相」のちがいと、未来完了進行形まで学ぶ（完了形は「完了形」の系統で学ぶ）。',
    ],
    steps: [
      ['5', '現在進行形', 'am / is / are＋動詞ing で「今〜しているところだ」。like・know は進行形にしない。', 'Ken is playing tennis right now.', 'ケンはちょうど今テニスをしています。'],
      ['4', '過去形', '規則動詞は -ed、不規則動詞は形が変わる。否定・疑問は did＋原形。', 'I went to Kyoto last week.', '私は先週京都へ行きました。'],
      ['4', '未来表現', 'will＋原形（予想・その場の意志）と be going to＋原形（予定）。', 'We are going to clean the park tomorrow.', '私たちは明日公園を掃除する予定です。'],
      ['4', '過去進行形', 'was / were＋動詞ing で「（過去のある時に）〜しているところだった」。', 'She was cooking when I came home.', '私が帰宅したとき、彼女は料理をしていました。'],
      ['1', '時制・相', '単純形＝事実、進行形＝進行中、完了形＝基準の時とのつながり。未来完了進行形も使う。', 'By June, she will have been serving on the board for ten years.', '6月で、彼女は10年間理事を務めていることになります。'],
    ],
    links: [
      '現在形（ふだんのこと）と現在進行形（今していること）、過去形（出来事）と過去進行形（途中の様子）を対にして区別する。',
      'when・if の中は、未来のことでも現在形（4級の接続詞）。',
    ],
  }),

  strandReference({
    id: 'modal',
    overview: [
      '助動詞は動詞の前に置いて意味を加え、後ろの動詞はいつも原形。5級の can、4級の must・have to・should・may から始まる。',
      '準2級の had better、2級の助動詞＋have done（過去への推量）と be supposed to、準1級・1級の推量の強さの使い分けへと進む。',
    ],
    steps: [
      ['5', '助動詞 can', 'can＋原形＝〜できる。Can I 〜? は許可、Can you 〜? は依頼。', 'Can your brother swim fast? — No, he can’t.', 'あなたのお兄さんは速く泳げますか。— いいえ、泳げません。'],
      ['4', '助動詞', 'must・have to（〜しなければならない）、must not（禁止）、don’t have to（必要がない）、should・may。', 'You don’t have to bring lunch tomorrow.', '明日はお弁当を持ってくる必要はありません。'],
      ['pre2', 'had better', 'had better＋原形 は「〜したほうがよい」という強い忠告。否定は had better not。', 'You had better not tell anyone the secret.', 'その秘密はだれにも言わないほうがいいですよ。'],
      ['2', '助動詞+have done', 'must have done（したにちがいない）、cannot have done（したはずがない）、should have done（すべきだったのに）。', 'He must have missed the train.', '彼は電車に乗り遅れたにちがいありません。'],
      ['2', '助動詞・義務', 'be supposed to（〜することになっている）、be allowed to、be required to、be able to。', 'Visitors are supposed to show their passes at the gate.', '訪問者は入口で通行証を見せることになっています。', { passes: '通行証（pass の複数形）' }],
      ['pre1', '助動詞', 'ought to have done（すべきだったのに）、need not have done（必要はなかったのに）、may well・might as well。', 'You need not have brought so much food.', 'そんなにたくさん食べ物を持ってくる必要はなかったのに。'],
      ['1', '助動詞・推量', 'must・may・cannot で確かさの度合いを調整し、書くときは suggest・tend to で言いすぎを避ける。', 'The findings suggest that the policy may reduce inequality.', 'その結果は、政策が不平等を減らす可能性を示しています。'],
    ],
    links: [
      'must not（〜してはいけない）と don’t have to（〜しなくてよい）は意味が逆のように見えるほどちがう。',
      '今のことへの推量は must be、過去のことへの推量は must have been のように、have＋過去分詞 で時を1つ前にずらす。',
    ],
  }),

  strandReference({
    id: 'comparison',
    overview: [
      '比較は4級の原級・比較級・最上級から始まり、3級で倍数・as 〜 as possible・one of the＋最上級、準2級・2級で the 比較級, the 比較級 や No other 〜 へ広がる。',
      '準1級・1級では、no more A than B（クジラ構文）・not so much A as B・all the more など、比較の形を使った論理の読み取りを学ぶ。',
    ],
    steps: [
      ['4', '比較', 'as＋原級＋as、比較級＋than、the＋最上級＋in / of。長い語は more / most。', 'This is the most interesting book of the three.', 'これは3冊の中でいちばんおもしろい本です。'],
      ['3', '比較応用', '倍数＋as 〜 as、as 〜 as possible、one of the＋最上級＋複数名詞。', 'Tokyo is one of the largest cities in the world.', '東京は世界で最も大きな都市の1つです。'],
      ['pre2', '比較応用', 'The＋比較級 〜, the＋比較級 …（〜するほど…）。比べるものをそろえる（that of 〜）。', 'The more you practice, the more confident you become.', '練習すればするほど、自信がつきます。'],
      ['2', '比較応用', 'No other＋単数名詞＋as 〜 as / 比較級 than で最上級の意味。the＋比較級＋of the two。', 'No other student is as tall as Tom.', 'トムほど背の高い生徒はほかにいません。'],
      ['pre1', '比較構文', 'no fewer than（〜も）、no more than（たった〜）、not so much A as B（AというよりB）。', 'She is not so much angry as disappointed.', '彼女は怒っているというよりむしろがっかりしています。'],
      ['pre1', 'クジラ構文', 'A is no more B than C is＝CがBでないのと同様、AもBではない。', 'A whale is no more a fish than a horse is.', 'クジラが魚でないのは、馬が魚でないのと同じです。'],
      ['1', '高度比較', 'all the＋比較級＋because（なおさら）、superior to（than ではなく to）。', 'The issue is all the more serious because children are affected.', '子どもたちが影響を受けているので、その問題はなおさら深刻です。'],
    ],
    links: [
      '最上級は「比較級＋than any other＋単数名詞」「No other 〜 as / 比較級 than」と言いかえられる。',
      'no more 〜 than は「〜ない」、no less 〜 than は「〜だ」と、打ち消しと肯定が入れかわる。',
    ],
  }),

  strandReference({
    id: 'infinitive',
    overview: [
      '不定詞（to＋動詞の原形）は、4級の3つの使い方（〜すること・〜するための・〜するために）から始まり、3級で It is 〜 to・want 人 to・too 〜 to と、to を付けない原形不定詞が加わる。',
      '準2級では for / of 人、too / enough、目的の in order to・so that を整理し、2級・準1級では完了不定詞（to have done）と be to 構文を学ぶ。',
    ],
    steps: [
      ['4', '不定詞', 'to＋原形 で「〜すること」「〜するための」「〜するために」。', 'I need something to drink.', '何か飲むものが必要です。'],
      ['3', '不定詞応用', 'It is 〜 (for 人) to …、want / tell / ask＋人＋to …、too 〜 to …。', 'It is not easy for me to understand English.', '私にとって英語を理解するのは簡単ではありません。'],
      ['3', '原形不定詞', 'make / let / help＋人＋原形（to を付けない）。', 'My mother let me go out.', '母は私が外出するのを許してくれました。'],
      ['pre2', 'it...to/for', 'kind・careless など人の性質を言う語では for ではなく of 人。', 'It was kind of you to carry my bag.', 'かばんを運んでくれて親切にどうも。'],
      ['pre2', 'too/enough', 'too 〜 (for 人) to …、〜 enough to …。主語が to の後ろの目的語なら it を重ねない。', 'The box was too heavy for me to carry.', 'その箱は重すぎて私には運べませんでした。'],
      ['pre2', '目的の表現', 'in order to / so as to＋原形、so that＋主語＋can 〜。否定は in order not to。', 'She whispered in order not to wake the baby.', '彼女は赤ちゃんを起こさないように小声で話しました。'],
      ['2', '完了不定詞', 'to have＋過去分詞 は、文の動詞より前のこと（seem to have done）。', 'He seems to have forgotten our appointment.', '彼は約束を忘れてしまったようです。'],
      ['2', 'be to構文', 'be to＋原形 で予定（〜することになっている）・義務（〜しなければならない）。', 'You are to finish this by noon.', 'あなたはこれを正午までに終えなければなりません。'],
      ['pre1', 'be to構文', '可能（not 〜 to be heard）・運命・意図（if S is to 〜）まで読み分ける。', 'If you are to succeed, you must set clear priorities.', '成功したいなら、はっきりした優先順位を決めなければなりません。'],
    ],
    links: [
      'so 〜 that … can’t＝too 〜 to …、so 〜 that … can＝〜 enough to … は入試の言いかえでよく問われる。',
      'make＋人＋原形（to なし）も、受け身にすると be made to＋原形 と to が入る。',
    ],
  }),

  strandReference({
    id: 'gerund',
    overview: [
      '動名詞（動詞ing＝〜すること）は、4級で enjoy・finish の後ろや前置詞の後ろに置く使い方を学ぶ。3級では、動詞ごとに後ろが不定詞か動名詞かが決まっていることを整理する。',
      '準2級・2級では、look forward to 〜ing・cannot help 〜ing・There is no 〜ing などの決まった言い方を身につける。',
    ],
    steps: [
      ['4', '動名詞', 'enjoy・finish・stop の後ろ、前置詞の後ろは動名詞。動名詞は主語にもなる。', 'Thank you for helping me.', '手伝ってくれてありがとう。'],
      ['3', '動詞と不定詞・動名詞', 'avoid・mind・give up は動名詞、decide・promise・learn は不定詞をとる。', 'We avoided visiting the museum on Sunday.', '私たちは日曜日に博物館へ行くのを避けました。'],
      ['pre2', '動名詞の慣用', 'look forward to・be used to の to は前置詞。feel like 〜ing、have difficulty 〜ing。', 'I look forward to seeing you again.', 'またお会いできるのを楽しみにしています。'],
      ['2', '動名詞の慣用', 'cannot help 〜ing、It is no use 〜ing、There is no 〜ing、on 〜ing、be worth 〜ing。', 'There is no denying that the policy needs revision.', 'その政策に見直しが必要なことは否定できません。'],
    ],
    links: [
      '不定詞は「これからすること」、動名詞は「していること・したこと」に目を向けることが多い（remember to 〜 / remember 〜ing）。',
      'to の後ろが原形か動名詞かは、to が不定詞か前置詞かで決まる。',
    ],
  }),

  strandReference({
    id: 'conjunction',
    overview: [
      '接続詞は、4級の and・but・when・if・because から始まり、3級で時・条件の中は未来でも現在形になることや so 〜 that を学ぶ。',
      '準2級では unless・as long as・相関接続詞・such 〜 that、2級では in case・now that・even though・接続副詞、準1級では譲歩の言い方まで広がる。',
    ],
    steps: [
      ['4', '接続詞', 'when（時）・if（条件）・because（理由）・though（逆のこと）。when・if の中は未来でも現在形。', 'Please call me when you arrive at the station.', '駅に着いたら電話してください。'],
      ['3', '接続詞', 'because（理由）と so（結果）、although と but を区別する。I’m sure that 〜 も使う。', 'Although it was raining, the game continued.', '雨が降っていたけれど、試合は続きました。'],
      ['3', 'so...that', 'so＋形容詞・副詞＋that＋文＝とても〜なので…。', 'The box was so heavy that I could not lift it.', 'その箱はとても重かったので、持ち上げられませんでした。'],
      ['pre2', '接続詞', 'unless（〜しない限り）・as long as・once・as soon as・since（〜なので）。', 'Unless you hurry, you’ll miss the bus.', '急がないとバスに乗り遅れますよ。'],
      ['pre2', '相関接続詞', 'both A and B・either A or B・neither A nor B・not only A but also B。', 'Not only Ken but also Emi joined the project.', 'ケンだけでなくエミもその計画に加わりました。'],
      ['pre2', 'so/such...that', '名詞をふくむときは such (a)＋形容詞＋名詞＋that。', 'It was such a hot day that we stayed inside.', 'とても暑い日だったので、私たちは中にいました。'],
      ['2', '接続詞', 'in case・now that・as far as・even though（事実）・even if（仮定）。', 'Take an umbrella in case it rains.', '雨が降るといけないから傘を持っていきなさい。'],
      ['2', '接続副詞', 'however・therefore・moreover は文と文の意味のつながりを示す。コンマだけで文をつながない。', 'The road was closed; therefore, we took another route.', '道路が閉鎖されていたので、私たちは別の道を通りました。'],
      ['pre1', '譲歩', 'however＋形容詞＋主語＋動詞（どんなに〜でも）、形容詞＋as＋主語＋動詞（〜だけれども）。', 'Tired as she was, she kept working.', '疲れてはいたけれど、彼女は働き続けました。'],
    ],
    links: [
      'although と but、because と so は1つの文で重ねない。',
      '接続詞（while・because・although）の後ろは主語＋動詞、前置詞（during・because of・despite）の後ろは名詞。',
    ],
  }),

  strandReference({
    id: 'used-to',
    overview: [
      '過去の習慣を表す言い方の系統。4級で used to＋原形（以前は〜した）を学び、準2級で would (often)（よく〜したものだ）との使い分けと、形の似た be used to＋動名詞（〜に慣れている）を区別する。',
    ],
    steps: [
      ['4', 'used to', 'used to＋原形＝以前は〜した・〜だった（今はちがう）。否定・疑問は didn’t use to。', 'There used to be a tree here.', '以前はここに木がありました。'],
      ['pre2', '過去の習慣', 'would (often)＋原形 は動作のくり返しだけ。過去の状態には used to を使う。', 'He would often swim in this river as a boy.', '彼は少年のころ、よくこの川で泳いだものでした。'],
      ['pre2', 'used to / be used to', 'be used to＋名詞・動名詞＝〜に慣れている、get used to＝〜に慣れる。', 'Mika is used to getting up early for practice.', 'ミカは練習のために早起きすることに慣れています。'],
    ],
    links: [
      'used to の to は不定詞（後ろは原形）、be used to の to は前置詞（後ろは名詞・動名詞）。',
      'be used to＋原形 は「〜するために使われる」という受動態で、また別の意味になる。',
    ],
  }),

  strandReference({
    id: 'perfect',
    overview: [
      '完了形は「基準の時」までのつながりを表す。3級の現在完了（継続・経験・完了）と現在完了進行形から始まる。',
      '準2級で過去完了（過去の基準より前）、2級で過去完了進行形・未来完了・完了形の受動態へ広がる。',
    ],
    steps: [
      ['3', '現在完了', 'have / has＋過去分詞 で継続（for・since）・経験（ever・never）・完了（just・already・yet）。', 'She has been to Australia twice.', '彼女はオーストラリアに2回行ったことがあります。'],
      ['3', '現在完了進行形', 'have / has been＋動詞ing で「今までずっと〜し続けている」。', 'I have been waiting for the bus for thirty minutes.', '私は30分間ずっとバスを待っています。'],
      ['pre2', '現在完了進行形', '活動の長さは have been doing、終わった量・結果は have done。know などの状態は現在完了。', 'I have read three chapters so far.', 'これまでに3章読みました。'],
      ['pre2', '過去完了', 'had＋過去分詞 で、過去の基準より前のこと・基準までの経験。', 'The train had left when I arrived.', '私が着いたとき、電車は出てしまっていました。'],
      ['2', '過去完了進行形', 'had been＋動詞ing で、過去の基準まで続いていた動作。', 'She had been waiting for an hour when I arrived.', '私が着いたとき、彼女は1時間待ち続けていました。'],
      ['2', '完了形応用', '未来完了 will have＋過去分詞、完了形の受動態 have been＋過去分詞。', 'By next year, I will have worked here for ten years.', '来年で、私はここで10年働いたことになります。'],
    ],
    links: [
      '基準の時が今なら have done、過去なら had done、未来なら will have done。',
      'yesterday・〜 ago のように過去のいつかを示す語には、現在完了ではなく過去形を使う。',
    ],
  }),

  strandReference({
    id: 'passive',
    overview: [
      '受動態（be動詞＋過去分詞）は3級で学ぶ。「〜される」側を主語にし、だれがしたかは by 〜 で表す。',
      '準2級以上では、完了形・進行形の受動態、to be done・being done、使役・知覚の受け身へと広がる（3級のページの「発展」と、使役・知覚の系統で学ぶ）。',
    ],
    steps: [
      ['3', '受動態', 'be動詞＋過去分詞。時は be動詞で表し、助動詞つきは「助動詞＋be＋過去分詞」。', 'The festival will be held next Sunday.', 'そのお祭りは次の日曜日に開かれます。'],
    ],
    links: [
      'be covered with・be made of / from・be known to・be interested in のように、by 以外の前置詞を使う受動態がある。',
      '「人に物を与える」の文は、物を主語にすると This watch was given to me のように前置詞が入る。',
    ],
  }),

  strandReference({
    id: 'participle',
    overview: [
      '分詞（現在分詞・過去分詞）は、3級で名詞を説明する使い方を学ぶ。準2級では SVC・SVOC の分詞と、分詞で文に意味を付け加える分詞構文が加わる。',
      '2級・準1級では、過去分詞で始まる分詞構文・Having done・独立分詞構文・付帯状況の with まで広がる。',
    ],
    steps: [
      ['3', '分詞', '「〜している」は現在分詞、「〜された」は過去分詞。1語なら名詞の前、2語以上なら後ろ。', 'The girl standing over there is my sister.', 'あそこに立っている女の子は私の姉です。', { over: 'over there で「あそこに」' }],
      ['pre2', '分詞', 'keep / leave / see＋目的語＋分詞（SVOC）、look surprised・come running（SVC）。', 'I saw two men carrying a piano.', '私は2人の男性がピアノを運んでいるのを見ました。'],
      ['pre2', '分詞構文', '接続詞と主語を消して分詞で始める。時・理由・同時の動作を表す。', 'Walking down the street, I met Tom.', '通りを歩いていると、トムに会いました。'],
      ['2', '分詞構文', '受け身は過去分詞で始め、先に終わったことは Having＋過去分詞、否定は Not＋分詞。', 'Seen from space, the earth looks blue.', '宇宙から見ると、地球は青く見えます。'],
      ['pre1', '独立分詞構文', '分詞の主語が文の主語とちがうときは、分詞の前に主語を置く（There being 〜 など）。', 'The weather being fine, we went hiking.', '天気がよかったので、私たちはハイキングに行きました。'],
      ['pre1', '分詞構文応用', 'Having been＋過去分詞、generally speaking・judging from などの決まった分詞構文。', 'Generally speaking, the new system works well.', '一般的に言えば、新しい仕組みはうまく働いています。'],
      ['pre1', '付帯状況', 'with＋名詞＋分詞＝〜を…した状態で。名詞が「する」側なら現在分詞、「される」側なら過去分詞。', 'He sat there with his eyes closed.', '彼は目を閉じてそこに座っていました。'],
    ],
    links: [
      'どの段でも、分詞の意味上の主語が「する」側か「される」側かで、現在分詞と過去分詞を選ぶ。',
      '人の気持ちは surprised・excited、物事の性質は surprising・exciting。',
    ],
  }),

  strandReference({
    id: 'relative',
    overview: [
      '関係詞は、名詞の後ろに説明の文をつなぐ。3級の関係代名詞 who・which・that（主格・目的格）から始まり、準2級で関係副詞・継続用法・what・前置詞＋関係代名詞が加わる。',
      '2級で whose・数量＋of which、準1級で連鎖関係詞・複合関係詞（whoever・whatever）、1級で the extent to which などの論説文の形まで広がる。',
    ],
    steps: [
      ['3', '関係代名詞', '人は who、物は which、どちらも that。後ろにすぐ動詞なら主格、主語＋動詞なら目的格（省略できる）。', 'I have a friend who lives in Canada.', '私にはカナダに住んでいる友達がいます。'],
      ['pre2', '関係副詞', '場所 where・時 when・理由 why・方法 how。後ろは欠けていない文。', 'This is the town where my grandfather was born.', 'これは祖父が生まれた町です。'],
      ['pre2', '関係代名詞(継続)', 'コンマ＋who / which で説明を付け足す。that は使えない。', 'My uncle, who lives in New York, is a doctor.', 'おじはニューヨークに住んでいて、医者をしています。', { New: 'New York で「ニューヨーク（地名）」', York: 'New York で「ニューヨーク（地名）」' }],
      ['pre2', '関係代名詞 what', 'what＝the thing(s) that（〜すること・もの）。前に先行詞を置かない。', 'Tell me what you want.', 'あなたがほしいものを教えてください。'],
      ['pre2', '前置詞+関係代名詞', '前置詞の後ろは which（物）・whom（人）。that は使えない。', 'This is the house in which he lives.', 'これは彼が住んでいる家です。'],
      ['2', '関係代名詞 what', 'What で始まる主語、A is to B what C is to D などの決まった言い方。', 'What we need now is a practical solution.', '私たちに今必要なのは、実際に役立つ解決策です。'],
      ['2', '関係代名詞 whose', 'whose＋名詞＝その〜が…する。人にも物にも使う。', 'She is a writer whose novels are read worldwide.', '彼女は小説が世界中で読まれている作家です。'],
      ['2', '関係代名詞応用', '先行詞, 数量＋of whom / which で、先行詞の一部に説明を付け足す。', 'He has two sons, both of whom are doctors.', '彼には息子が2人いて、2人とも医者です。'],
      ['pre1', '連鎖関係詞', 'who I think 〜 のように挿入があっても、取りのぞいた形で主格・目的格を決める。', 'The man who I thought was honest lied to me.', '正直だと思っていた男性は私にうそをつきました。'],
      ['pre1', '複合関係詞', 'whoever＝anyone who、however＋形容詞＝どんなに〜でも（no matter how）。', 'Whoever needs the data may download it.', 'そのデータが必要な人はだれでもダウンロードしてかまいません。'],
      ['pre1', 'whatever等', 'Whatever happens（何が起ころうとも）、whatever＋名詞（どんな〜でも）。', 'Whatever the result may be, we will publish the data.', '結果がどうであれ、私たちはそのデータを公表します。'],
      ['1', '関係詞応用', 'the extent to which、前の文全体を受ける , which、what little＋名詞。', 'The extent to which the data were manipulated remains unclear.', 'データがどの程度操作されたのかは、はっきりしないままです。'],
    ],
    links: [
      '後ろの文が欠けていれば関係代名詞、欠けていなければ関係副詞（または同格の that）。',
      'that が使えないのは、コンマの後ろ（継続用法）と前置詞の直後。',
    ],
  }),

  strandReference({
    id: 'subjunctive',
    overview: [
      '仮定法は、事実とちがうことを動詞の時を1つ前にずらして表す。3級・準2級の仮定法過去（If I were 〜, I would …）と I wish から始まる。',
      '2級で as if・It’s time・Without・仮定法過去完了、準1級・1級で if の省略による倒置・were to・仮定法現在（demand that＋原形）まで広がる。',
    ],
    steps: [
      ['3', '仮定法(基礎)', '今の事実とちがう仮定は If＋過去形, would / could＋原形。I wish＋過去形。', 'If I were a bird, I could fly.', 'もし私が鳥なら、飛べるのに。'],
      ['pre2', '仮定法(基礎)', '起こりうる条件（If＋現在形, will）と、事実とちがう仮定（If＋過去形, would）を区別する。', 'If I had time, I would help you.', '時間があれば手伝うのですが。'],
      ['2', '仮定法', 'I wish・as if・It’s time＋過去形、Without / But for（〜がなければ）、万一の should。', 'He acts as if he were the boss.', '彼はまるで上司であるかのようにふるまいます。'],
      ['2', '仮定法過去完了', '過去の事実とちがう仮定は If＋had＋過去分詞, would have＋過去分詞。', 'If I had known, I would have helped you.', '知っていたら、あなたを手伝ったのに。'],
      ['pre1', '仮定法応用', 'if を省いた倒置（Had I known / Were it not for）、were to、would rather、要求の that 節の原形。', 'Were it not for water, nothing could live.', '水がなければ、何も生きられないでしょう。'],
      ['1', '仮定法・語法', 'It is essential that＋原形、Were S to do、It is high time＋過去形、if need be。', 'It is high time the regulation was reconsidered.', 'もうその規制を見直すべき時です。'],
    ],
    links: [
      '今のことは過去形、過去のことは過去完了で表す。形は過去でも、意味は「事実ではない」。',
      'ふつうの条件の if（If it rains tomorrow, I will 〜）では、未来のことでも if の中は現在形。',
    ],
  }),

  strandReference({
    id: 'causative-perception',
    overview: [
      '使役動詞（make・have・let・get）は「人に〜させる・してもらう」、知覚動詞（see・hear・feel）は「人が〜するのを見る・聞く」を表す。準2級で基本の形を学び、2級で have / get の使い分けを確かめる。',
    ],
    steps: [
      ['pre2', '使役・知覚', 'make / have / let＋人＋原形、get＋人＋to＋原形、have＋物＋過去分詞、see＋人＋原形・動詞ing。', 'I heard someone call my name.', 'だれかが私の名前を呼ぶのが聞こえました。'],
      ['2', '使役', '人が「する」側なら原形（have him check it）、物が「される」側なら過去分詞（have it checked）。', 'I got my brother to repair my bicycle.', '私は兄に自転車を直してもらいました。'],
    ],
    links: [
      '3級の原形不定詞（make・let・help＋人＋原形）が、この系統の出発点。',
      '使役・知覚動詞を受け身にすると、be made to＋原形 のように to が入る。',
    ],
  }),

  strandReference({
    id: 'noun-clause',
    overview: [
      'that・whether・疑問詞・what で始まるまとまりは、文の中で名詞の働きをする（名詞節）。2級で that 節・whether 節の基本を学ぶ。',
      '準1級では、that・what・whether の見分け方と、名詞の中身を説明する同格の that を学ぶ。',
    ],
    steps: [
      ['2', '名詞節', 'that＝〜ということ、whether＝〜かどうか。主語の that 節は It is 〜 that … にすることが多い。', 'Whether the plan will succeed remains uncertain.', 'その計画がうまくいくかどうかは、はっきりしないままです。'],
      ['pre1', '名詞節', '後ろが完全な文なら that / whether、名詞が欠けていれば what。', 'What matters most is whether the evidence is reliable.', 'いちばん大切なのは、証拠が信頼できるかどうかです。'],
      ['pre1', '同格', 'fact・news・idea＋that＋完全な文 で、名詞の中身を説明する。', 'The news that the factory would close shocked the town.', '工場が閉鎖されるという知らせは町に衝撃を与えました。'],
    ],
    links: [
      '同格の that の後ろは欠けていない文、関係代名詞の that の後ろは主語か目的語が欠けている。',
      '3級・準2級の間接疑問（疑問詞＋主語＋動詞）も名詞節の一種。',
    ],
  }),

  strandReference({
    id: 'inversion-emphasis',
    overview: [
      '強調は、2級で do / does / did・the very・It is 〜 that …（強調構文）を学ぶ。倒置は So do I・Never have I 〜・Only then did 〜 から始まる。',
      '準1級・1級では、Hardly 〜 when・No sooner 〜 than・Not until・So＋形容詞＋be動詞＋主語 など、倒置と強調の形を読み分ける。',
    ],
    steps: [
      ['2', '倒置', 'So＋助動詞＋主語（〜もそうだ）、否定の語句を前に出すと「助動詞＋主語」。', 'Only then did I understand the truth.', 'そのとき初めて私は真実を理解しました。'],
      ['2', '強調', 'do / does / did＋原形、the very＋名詞、主語＋再帰代名詞。', 'I did see someone enter the room.', '私は確かにだれかが部屋に入るのを見ました。'],
      ['2', '強調構文', 'It is / was＋強める語句＋that …。It is と that を取ると文が成り立つ。', 'It was John that broke the window.', '窓を割ったのはジョンでした。'],
      ['pre1', '倒置', 'Little・Seldom・Under no circumstances、Hardly 〜 when・No sooner 〜 than。', 'No sooner had the speech ended than questions began.', '演説が終わるとすぐに質問が始まりました。'],
      ['pre1', '強調', 'It is not until 〜 that …（〜して初めて）、It is because 〜 that …。', 'It was not until noon that he woke up.', '彼は昼になってやっと目を覚ましました。'],
      ['1', '倒置・強調', 'Not until・Only when・On no account・So＋形容詞 を前に出すと主節が倒置する。', 'So absurd was the story that no one believed it.', 'その話はあまりにばかげていたので、だれも信じませんでした。'],
      ['1', '強調・倒置', 'What S V is 〜 で焦点を後ろに、It is 〜 that で焦点を前に置く。', 'What the committee needs is more evidence to revise the proposal.', '委員会に必要なのは、提案を修正するためのさらなる証拠です。'],
    ],
    links: [
      '否定の語句を前に出したら、一般動詞の文でも do / does / did を使って「助動詞＋主語＋原形」にする。',
      '強調構文 It is 〜 that と形式主語 It is 〜 that は、It is と that を取って文が成り立つかで見分ける。',
    ],
  }),

  strandReference({
    id: 'reported-speech',
    overview: [
      '話法は、人の言葉を伝える言い方。2級で直接話法から間接話法への書きかえ（時制・代名詞・時の語の変化）を学び、準1級で tell・warn・deny など伝える動詞の使い分けを確かめる。',
    ],
    steps: [
      ['2', '話法', '伝える動詞が過去なら中の時制を1つ前に。疑問文は ask if、命令文は tell＋人＋to。', 'He said that he was busy then.', '彼はそのとき忙しいと言いました。'],
      ['pre1', '話法', 'warn＋人＋not to、deny＋動名詞、be believed to have done。', 'The officer warned us not to enter the area.', '警察官は私たちにその地域に入らないよう警告しました。'],
    ],
    links: [
      'say は後ろに内容、tell は後ろにすぐ相手（tell me that 〜）。',
      'now → then、today → that day、tomorrow → the next day のように、時の語も伝える側に合わせる。',
    ],
  }),

  strandReference({
    id: 'ellipsis',
    overview: [
      '省略と代用は、くり返しを避けるための言い方。準1級で when・if の中の「主語＋be動詞」の省略（if necessary）を学ぶ。',
      '1級では、one・do so・that / those による代用と、並べる要素の形をそろえる書き方まで学ぶ。',
    ],
    steps: [
      ['pre1', '省略', 'when / if / though の後ろで「主語＋be動詞」が省かれる（if necessary、when in doubt）。', 'When in doubt, check the original source.', '迷ったら、もとの資料を確かめなさい。'],
      ['1', '省略・代用', 'one（名詞）・do so（動作）・that / those（比べる名詞）で代用する。', 'He promised to submit the report but failed to do so.', '彼はレポートを出すと約束しましたが、出せませんでした。'],
    ],
    links: [
      '省かれた「主語」は文の主語と同じ。補って読むと意味がつかめる。',
      '数えられない名詞（advice・information）は one で受けない。',
    ],
  }),

  strandReference({
    id: 'agreement',
    overview: [
      '主語と動詞の一致は、主語が長くなったときに大切になる。準1級で of 〜 や挿入句に惑わされず中心の名詞を見つけることを学び、1級で neither A nor B・many a・a number of など数の判断がまぎらわしい主語を整理する。',
    ],
    steps: [
      ['pre1', '一致', 'One of 〜・The quality of 〜 は中心の名詞に合わせて単数。時間・金額のまとまりも単数。', 'One of the workshops is planned for next month.', 'ワークショップの1つは来月に予定されています。'],
      ['1', '主語と動詞の一致', 'neither A nor B は B に合わせる。more than one・many a＋単数名詞は単数。', 'More than one applicant has withdrawn from the selection process.', '選考から辞退した応募者は1人ではありません。'],
    ],
    links: [
      '5級の「主語で am・is・are が決まる」「3人称単数の s」が、この系統の土台。',
      'a number of（多くの・複数）と the number of（〜の数・単数）は、準2級の数量表現でも学ぶ。',
    ],
  }),

  strandReference({
    id: 'advanced-usage',
    overview: [
      '1級の高度語法は、改まった接続表現（lest・provided・notwithstanding）、慣用表現（as it were・Suffice it to say）、語と語の結び付きを身につける系統。祈願文（May 〜!）もここで学ぶ。',
    ],
    steps: [
      ['1', '高度語法', 'lest＋(should)＋原形、provided that、notwithstanding＋名詞、shed light on など。', 'He is, as it were, a walking dictionary.', '彼はいわば歩く辞書です。'],
      ['1', '祈願文', 'May＋主語＋原形 〜!、Long live 〜!・Heaven forbid 〜 は原形のまま。', 'May all your efforts be rewarded!', 'あなたの努力がすべて報われますように。'],
    ],
    links: [
      'lest・Heaven forbid・It is essential that の後ろの原形は、仮定法現在の名残り。',
      '書くときは、名詞を重ねた言い方より動詞を使った簡潔な言い方を選ぶ（decide to revise）。',
    ],
  }),
]
