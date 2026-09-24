// 単元別の並び替え・語法：英検5級（全12単元）。参考書の各ページで学ぶ形をそのまま問う。
import { unitFormats } from './build.js'

export const GRAMMAR_UNIT_FORMATS_5 = unitFormats('5', [
  {
    unit: 'gref_5_be',
    order: [
      ['2人を並べた主語は are', 'Emi and I are in the same class.', 'エミと私は同じクラスです。', 'A and B の形で2人を並べた主語は複数なので、be動詞は are を使う。are のあとに「どこにいるか」を表す in the same class を続ける。'],
      ['be動詞の否定文は not をすぐ後ろへ', 'My brother is not at home now.', '兄は今、家にいません。', 'be動詞の否定文は be動詞のすぐ後ろに not を置く。主語 My brother は1人なので is を選び、is not のあとに場所を表す at home を続ける。'],
      ['疑問文は be動詞を主語の前へ', 'Are your parents teachers, too?', 'あなたのご両親も先生ですか。', 'be動詞の疑問文は be動詞を主語の前に出す。主語 your parents は2人なので are で始め、文の終わりに too（〜も）を置く。'],
    ],
    usage: [
      ['出身は be動詞＋from', 'My parents ___ from Okinawa.', ['are', 'have', 'do', 'go'], 'are', '両親は沖縄の出身です。', '出身を言うときは be動詞＋from で「〜の出身だ」と表す。主語 My parents は2人なので are を使う。', [
        '出身は be動詞＋from で表す。主語 My parents は2人なので are になる。',
        'have from という結び付きはない。出身は be動詞＋from で表す。',
        'do は一般動詞の否定文・疑問文を作る語で、from とつないで出身を表すことはできない。',
        'go from 〜 は「〜から出発する」という動きを表し、今どこの出身かを言う文にはならない。',
      ]],
      ['遅れるは be動詞＋late for', 'My brother is always ___ for dinner.', ['late', 'slow', 'long', 'far'], 'late', '兄はいつも夕食に遅れます。', 'be late for 〜 で「〜に遅れる」という決まった結び付きになる。for のあとに遅れる相手（夕食・学校など）を置く。', [
        'be late for 〜 で「〜に遅れる」。for のあとに dinner を置いて「夕食に遅れる」となる。',
        'slow は動きののろさを表す語で、be slow for dinner とは言わない。「遅れる」は late。',
        'long は長さを表す語で、時間に間に合わないという意味にはならない。',
        'far は距離が遠いことを表す語で、時刻に遅れることは表せない。',
      ]],
      ['準備ができているは be動詞＋ready for', 'We are ___ for the school festival.', ['ready', 'busy', 'free', 'kind'], 'ready', '私たちは学園祭の準備ができています。', 'be ready for 〜 で「〜の準備ができている」という決まった結び付きになる。for のあとに備える行事を置く。', [
        'be ready for 〜 で「〜の準備ができている」。for のあとに the school festival を置く。',
        'busy は「忙しい」で、忙しさの中身を言うときは be busy with 〜 とする。for とは結び付かない。',
        'free は「ひまだ・自由だ」で、準備が整っていることは表せない。',
        'kind は「親切だ」という人がらを表す語で、行事の準備には使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_verb',
    order: [
      ['3人称単数の主語には動詞に s', 'My father washes his car every Sunday.', '父は毎週日曜日に車を洗います。', '主語 My father は3人称単数なので、現在の文では動詞に s・es を付ける。sh で終わる wash は es を付けて washes にする。'],
      ['子音＋y の動詞は y を i に変えて es', 'Emi studies English every evening.', 'エミは毎晩英語を勉強します。', '主語 Emi は3人称単数なので動詞に s・es を付ける。study のように〈子音＋y〉で終わる語は、y を i に変えて es を付け studies にする。'],
    ],
    usage: [],
  },
  {
    unit: 'gref_5_negq',
    order: [
      ['Does の疑問文では動詞は原形', 'Does your sister play the piano?', 'あなたのお姉さんはピアノをひきますか。', '主語が3人称単数の一般動詞の疑問文は Does で始める。Does が3人称単数を表すので、動詞は s の付かない原形 play にする。'],
      ['does not のあとも動詞は原形', 'My father does not drink coffee.', '父はコーヒーを飲みません。', '主語 My father は3人称単数なので否定文は does not を使う。does が3人称単数を表すので、動詞は原形 drink のままにする。'],
    ],
    usage: [
      ['まったく〜ないは not ... at all', 'I do not like natto ___ all.', ['at', 'in', 'on', 'for'], 'at', '私は納豆がまったく好きではありません。', '否定文の終わりに at all を置くと「まったく〜ない」と打ち消しを強める。not と at all は組にして覚える。', [
        'not 〜 at all で「まったく〜ない」。否定文の終わりに at all を置く。',
        'in all は「全部で」と合計を言う言い方で、打ち消しを強める働きはない。',
        'on all という結び付きはなく、否定を強める言い方にはならない。',
        'for all は「〜にもかかわらず」という別の意味になり、この文には合わない。',
      ]],
      ['起きるは get up', 'My sister does not ___ up early on Sundays.', ['get', 'take', 'make', 'give'], 'get', '姉は日曜日には早く起きません。', 'get up で「起きる」という決まった結び付きになる。up を伴って「寝ている状態から体を起こす」ことを表す。', [
        'get up で「起きる」。does not のあとなので原形 get のまま置く。',
        'take up は「（趣味などを）始める」で、朝に目を覚ます意味にはならない。',
        'make up は「作り上げる・仲直りする」で、起きるという意味にはならない。',
        'give up は「あきらめる」で、起きるという意味にはならない。',
      ]],
      ['シャワーを浴びるは take a shower', 'Do you ___ a shower in the morning?', ['take', 'do', 'make', 'play'], 'take', 'あなたは朝にシャワーを浴びますか。', 'take a shower で「シャワーを浴びる」という決まった結び付きになる。take は「（行動を）する」という意味でも使う。', [
        'take a shower で「シャワーを浴びる」。Do の疑問文なので原形 take を置く。',
        'do は do my homework のように「（課された事を）する」に使い、shower とは結び付かない。',
        'make a shower では「シャワーを作る」となり、浴びる意味にならない。',
        'play は遊びやスポーツ・楽器に使う語で、shower には使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_plural',
    order: [
      ['city → cities のつづりの変化', 'My uncle visits many cities every year.', 'おじは毎年たくさんの都市を訪れます。', 'many のあとの数えられる名詞は複数形にする。city は〈子音＋y〉で終わるので、y を i に変えて es を付け cities にする。'],
      ['形が変わる複数形 child → children', 'Three children are playing in the park.', '3人の子どもが公園で遊んでいます。', 'child の複数形は s を付けず children になる。主語が3人なので、be動詞も複数に合わせて are にする。'],
      ['How many のあとは複数形', 'How many pencils do you have?', 'あなたは鉛筆を何本持っていますか。', '数をたずねるときは How many のあとに数えられる名詞の複数形を置き、そのあとを do you have? の疑問文の語順にする。'],
    ],
    usage: [
      ['数えられる名詞の数は How many', 'How ___ eggs do we need for the cake?', ['many', 'much', 'long', 'old'], 'many', 'そのケーキには卵がいくつ必要ですか。', '数えられる名詞の数をたずねるときは How many を使い、後ろの名詞を複数形にする。', [
        'How many＋複数形で数をたずねる。egg は数えられる名詞なので many を使う。',
        'How much は数えられない物の量や値段をたずねる言い方で、卵の数には使わない。',
        'How long は長さや期間をたずねる言い方で、数をたずねる文にはならない。',
        'How old は年齢や古さをたずねる言い方で、数をたずねる文にはならない。',
      ]],
      ['液体は a glass of で数える', 'I drink a ___ of milk every morning.', ['glass', 'piece', 'sheet', 'pair'], 'glass', '私は毎朝コップ1杯の牛乳を飲みます。', 'milk は数えられない名詞なので、入れ物や単位を表す語を使って a glass of milk（コップ1杯の牛乳）のように数える。', [
        'a glass of 〜 で「コップ1杯の〜」。冷たい飲み物を数えるときに使う。',
        'a piece of 〜 は紙やケーキのように「1切れ・1枚」と切り分けられる物に使い、飲み物には使わない。',
        'a sheet of 〜 は紙のように薄く平らな物を数える言い方で、牛乳には使わない。',
        'a pair of 〜 は靴や手袋のように2つで1組の物に使う。',
      ]],
      ['2つで1組の物は a pair of', 'I need a ___ of shoes for the trip.', ['pair', 'glass', 'cup', 'piece'], 'pair', '私は旅行のために靴が1足必要です。', 'a pair of 〜 で「1組の〜」。靴・手袋・くつ下のように2つでひとそろいになる物を数えるときに使う。', [
        'a pair of shoes で「靴1足」。2つで1組になる物は pair で数える。',
        'a glass of 〜 は飲み物を数える言い方で、靴には使わない。',
        'a cup of 〜 は温かい飲み物を数える言い方で、靴には使わない。',
        'a piece of 〜 は切り分けた1切れを表す言い方で、2つで1組の靴には使わない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_article',
    order: [
      ['母音の音の前は an', 'My aunt is an English teacher.', 'おばは英語の先生です。', '職業を1人ぶん言うときは名詞の前に a・an を置く。English は母音の音で始まるので an を使い、an English teacher とする。'],
      ['話に出ている物には the', 'Please open the window in the classroom.', '教室の窓を開けてください。', 'どの窓かが場面から決まっているので the window とする。the は「あの・その」と相手にも分かっている物を指すときに付ける。'],
      ['楽器には the を付ける', 'My sister plays the guitar every evening.', '姉は毎晩ギターをひきます。', '楽器を演奏することを言うときは〈play the ＋楽器〉とする。スポーツをするときに冠詞を付けないのと使い分ける。'],
    ],
    usage: [
      ['楽器は play the ＋楽器', 'Emi can play ___ piano very well.', ['the', 'a', 'an', 'one'], 'the', 'エミはとても上手にピアノをひけます。', '楽器を演奏することを言うときは〈play the ＋楽器〉と the を付ける。', [
        '楽器を演奏するときは play the piano のように the を付ける決まりになっている。',
        'a piano は「1台のピアノ」という物の数を言うときの形で、演奏する意味の文には使わない。',
        'an は母音の音で始まる語の前に使う。piano は子音の音で始まるので an にはならない。',
        'one piano は「1台のピアノ」と台数を数える言い方で、演奏する意味にはならない。',
      ]],
      ['スポーツ名には冠詞を付けない', 'My brother plays ___ after school.', ['soccer', 'a soccer', 'the soccer', 'an soccer'], 'soccer', '兄は放課後にサッカーをします。', 'スポーツをすることを言うときは冠詞を付けず〈play ＋スポーツ名〉とする。play soccer のようにそのままの形で置く。', [
        'スポーツは play soccer のように冠詞を付けずに言う。',
        'a soccer とは言わない。soccer は1つ2つと数える名詞ではない。',
        'the soccer とすると「あのサッカー」と特定の物を指す形になり、競技をする意味にならない。',
        'an は母音の音の前に使う語で、soccer には付かない。',
      ]],
      ['hour は音が母音なので an', 'My father comes home in ___ hour.', ['an', 'a', 'some', 'any'], 'an', '父は1時間後に帰ってきます。', 'a と an はつづりではなく次の語の音で選ぶ。hour の h は読まず母音の音で始まるので an hour とする。', [
        'hour は h を読まず母音の音で始まるので、an を付けて an hour とする。',
        'a は子音の音で始まる語の前に使う。hour は母音の音で始まるので a にはならない。',
        'some は「いくらかの」とはっきりしない数量を表す語で、1時間後という言い方には使わない。',
        'any は疑問文・否定文で「いくらかの」を表す語で、in 〜 hour の形には入らない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_pronoun',
    order: [
      ['動詞の後ろの人は目的格', 'Our teacher teaches us music on Fridays.', '先生は金曜日に私たちに音楽を教えます。', 'teach＋人＋物の形で「人に物を教える」。動詞のすぐ後ろに置く「私たちに」は目的格 us にする。'],
      ['名詞の前は所有格', 'His notebook is on my desk.', '彼のノートは私の机の上にあります。', '名詞の前に置いて「〜の」を表すのは所有格。he は his、I は my になり、それぞれ後ろの名詞と組にして置く。'],
      ['〜のものは所有代名詞1語で言う', 'That blue bike is not mine.', 'あの青い自転車は私のものではありません。', '「私のもの」は所有代名詞 mine の1語で表し、後ろに名詞を置かない。所有格 my は名詞の前に置く点で異なる。'],
    ],
    usage: [
      ['前置詞の後ろは目的格', 'Please come to the park with ___.', ['me', 'I', 'my', 'mine'], 'me', '公園へ私と一緒に来てください。', '前置詞の後ろに置く代名詞は目的格にする。with me で「私と一緒に」となる。', [
        '前置詞 with の後ろなので目的格 me を置き、「私と一緒に」を表す。',
        'I は主語に使う形で、前置詞の後ろには置けない。',
        'my は名詞の前に置いて「私の」を表す形で、後ろに名詞がないこの文には入らない。',
        'mine は「私のもの」と物を指す語で、「私と一緒に」という意味にはならない。',
      ]],
      ['its は「その」、it’s は it is', 'I have a dog. ___ name is Pochi.', ['Its', 'It’s', 'It', 'Its’'], 'Its', '私は犬を飼っています。その名前はポチです。', 'its は「その」を表す所有格で、後ろに名詞を置く。it’s は it is を縮めた形なので、後ろに名詞だけを置く形にはならない。', [
        'its は「その」を表す所有格。後ろの名詞 name と組にして「その名前」となる。',
        'It’s は It is を縮めた形で、It is name is Pochi. という二重の文になってしまう。',
        'It は主語に使う形で、名詞 name の前に置いて「その」を表すことはできない。',
        'その形のつづりはない。所有格の its にアポストロフィは付けない。',
      ]],
      ['だれのものかは所有代名詞で答える', 'Is this your racket? No, it is ___.', ['his', 'him', 'he', 'he’s'], 'his', 'これはあなたのラケットですか。いいえ、それは彼のものです。', '「だれのものか」を答えるときは所有代名詞を使う。he の所有代名詞は his で、1語で「彼のもの」を表す。', [
        'his は「彼のもの」を表す所有代名詞で、it is のあとに1語で置ける。',
        'him は動詞や前置詞の後ろに置く目的格で、「彼のもの」という持ち主は表せない。',
        'he は主語に使う形で、it is のあとに置いて持ち主を表すことはできない。',
        'he’s は he is を縮めた形で、it is he is という二重の文になってしまう。',
      ]],
    ],
  },
  {
    unit: 'gref_5_demonstrative',
    order: [
      ['these の疑問文は are で始める', 'Are these your new shoes?', 'これらはあなたの新しい靴ですか。', 'these は「これらは」と近くの2つ以上を指すので、be動詞は are を使う。疑問文なので Are を主語 these の前に出す。'],
      ['遠くの2つ以上は those', 'Those birds are singing in the tree.', 'あの鳥たちは木で鳴いています。', '遠くにある2つ以上の物や生き物を指すときは those を使う。主語が複数なので be動詞も are にする。'],
    ],
    usage: [
      ['this の問いには it で答える', 'Is this your bag? Yes, ___ is.', ['it', 'this', 'they', 'those'], 'it', 'これはあなたのかばんですか。はい、そうです。', 'this・that でたずねられた物は、答えの文では it で受ける。these・those でたずねられたときは they で受ける。', [
        'this でたずねられた1つの物は、答えの文では it で受ける。',
        '答えの文では this をくり返さず、it に置きかえるのがふつうの言い方。',
        'they は2つ以上の物を受ける語で、1つのかばんを受けることはできない。',
        'those は遠くにある2つ以上の物を指す語で、答えの主語にはならない。',
      ]],
      ['天気を言う文の主語は it', '___ is sunny and warm today.', ['It', 'That', 'This', 'They'], 'It', '今日は晴れて暖かいです。', '天気・時刻・曜日を言うときは、特に何かを指さない it を主語に置く。', [
        '天気を言う文は it を主語に置く。この it は何かを指すのではなく、形をととのえる働きをする。',
        'That は離れた物を指す語で、天気を言う文の主語にはならない。',
        'This は近くの物を指す語で、天気を言う文の主語にはならない。',
        'They は2つ以上の物や人を指す語で、天気を言う文の主語にはならない。',
      ]],
      ['時刻をたずねる文の主語も it', 'What time is ___ in London now?', ['it', 'this', 'that', 'time'], 'it', 'ロンドンは今、何時ですか。', '時刻をたずねるときは、天気を言うときと同じ it を主語に置く。What time is it 〜? の形で覚える。', [
        '時刻をたずねる文は it を主語に置き、What time is it 〜? の形で覚える。',
        'this は近くの物を指す語で、時刻をたずねる文の主語にはならない。',
        'that は離れた物を指す語で、時刻をたずねる文の主語にはならない。',
        'What time is time 〜? となり、同じ内容をくり返す文になってしまう。',
      ]],
    ],
  },
  {
    unit: 'gref_5_wh',
    order: [
      ['Where のあとは疑問文の語順', 'Where do your grandparents live now?', 'あなたの祖父母は今どこに住んでいますか。', '疑問詞は文の先頭に置き、そのあとを do＋主語＋動詞の原形という疑問文の語順にする。'],
      ['疑問詞が主語のときは do を使わない', 'Who washes the dishes in your house?', 'あなたの家ではだれが皿を洗いますか。', 'who が主語のときは do・does を使わず、そのまま動詞を続ける。主語 who は3人称単数と同じ扱いなので動詞に es を付ける。'],
      ['時刻をたずねる What time', 'What time does the concert begin?', 'そのコンサートは何時に始まりますか。', '時刻をたずねるときは What time を文の先頭に置き、そのあとを does＋主語＋動詞の原形の語順にする。'],
    ],
    usage: [
      ['値段は How much', 'How ___ is this cap?', ['much', 'many', 'old', 'tall'], 'much', 'この帽子はいくらですか。', '値段をたずねるときは How much 〜? を使う。お金は数えられない名詞なので many ではなく much になる。', [
        'How much 〜? で値段をたずねる。お金は数えられない名詞なので much を使う。',
        'How many は数えられる名詞の数をたずねる言い方で、値段には使わない。',
        'How old は年齢や古さをたずねる言い方で、値段には使わない。',
        'How tall は身長や高さをたずねる言い方で、値段には使わない。',
      ]],
      ['年齢は How old', 'How ___ is your brother? He is twelve.', ['old', 'many', 'much', 'long'], 'old', 'あなたの弟は何歳ですか。12歳です。', '年齢をたずねるときは How old 〜? を使い、数字で答える。', [
        'How old 〜? で年齢をたずねる。答えは He is twelve. のように年齢の数字で返す。',
        'How many は数をたずねる言い方で、年齢をたずねる文にはならない。',
        'How much は値段や量をたずねる言い方で、年齢には使わない。',
        'How long は長さや期間をたずねる言い方で、年齢には使わない。',
      ]],
      ['Why には Because で答える', 'Why are you tired? ___ I ran a lot.', ['Because', 'So', 'But', 'And'], 'Because', 'なぜ疲れているのですか。たくさん走ったからです。', 'Why 〜? で理由をたずねられたら、Because 〜 で「〜だからです」と理由を答える。', [
        'Because 〜 で「〜だからです」と理由を答える。Why の問いに対する決まった答え方。',
        'So は「だから」と結果を続ける語で、理由そのものを答える言い方にはならない。',
        'But は「しかし」と反対の内容をつなぐ語で、理由を答える文にはならない。',
        'And は「そして」と内容を並べる語で、理由を答える文にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_prep',
    order: [
      ['時刻の前は at', 'My class starts at eight thirty.', '私の授業は8時30分に始まります。', '「何時に」と時刻を言うときは前置詞 at を使う。at のあとに時刻を表す語を続ける。'],
      ['曜日の前は on', 'We play tennis on Saturday mornings.', '私たちは土曜日の朝にテニスをします。', '曜日や日付を言うときは前置詞 on を使う。特定の曜日の朝は on Saturday mornings のように on で表す。'],
      ['道具は with', 'Please cut this cake with a knife.', 'このケーキをナイフで切ってください。', '「〜を使って」と道具を言うときは前置詞 with を使う。交通手段を表す by と使い分ける。'],
    ],
    usage: [
      ['月の前は in', 'Our school festival is ___ October.', ['in', 'on', 'at', 'to'], 'in', '私たちの学園祭は10月にあります。', '月・季節・年のように広がりのある期間には in を使う。日付なら on、時刻なら at になる。', [
        '月を言うときは in October のように in を使う。季節や年にも in を使う。',
        'on は曜日や日付など「その日」を指すときに使い、月全体には使わない。',
        'at は時刻など時の一点を指すときに使い、月全体には使わない。',
        'to は行き先を表す前置詞で、時を表す言い方にはならない。',
      ]],
      ['〜の近くには near', 'My house is ___ the station.', ['near', 'on', 'under', 'to'], 'near', '私の家は駅の近くにあります。', 'near は「〜の近くに」と場所が近いことを表す。上にくっついていれば on、下にあれば under を使う。', [
        'near は「〜の近くに」と、少し離れた近い場所を表す。',
        'on は「〜の上に（くっついて）」を表し、家が駅の上にのっていることになってしまう。',
        'under は「〜の下に」を表し、家が駅の下にあることになってしまう。',
        'to は行き先を表す前置詞で、be動詞のあとで場所を言う形にはならない。',
      ]],
    ],
  },
  {
    unit: 'gref_5_progressive',
    order: [
      ['run は n を重ねて running', 'The boys are running in the schoolyard.', '男の子たちは校庭で走っています。', '現在進行形は be動詞＋動詞ing。run のように〈短い母音＋子音〉で終わる語は、最後の文字を重ねて running にする。'],
      ['進行形の疑問文は be動詞を前へ', 'Is your mother making dinner now?', 'お母さんは今、夕食を作っていますか。', '現在進行形の疑問文は be動詞を主語の前に出す。make は e を取って making になる。'],
    ],
    usage: [
      ['Look! のあとは進行形', 'Look! A bird ___ on the roof.', ['is singing', 'sings', 'sing', 'sang'], 'is singing', '見て。鳥が屋根の上で鳴いています。', 'Look! は「今まさに起きていること」に目を向けさせる合図なので、動詞を is singing と現在進行形にする。', [
        'Look! は今その場で起きていることを指すので、be動詞＋ing の現在進行形にする。',
        'sings はふだんくり返すことを表す現在形で、今この瞬間の様子を表さない。',
        'sing は主語が3人称単数のときの現在形として使えず、今の様子も表せない。',
        'sang は過去形で、今まさに起きていることを表す Look! の文には合わない。',
      ]],
      ['know は進行形にしない', 'I ___ his phone number.', ['know', 'am knowing', 'knows', 'knowing'], 'know', '私は彼の電話番号を知っています。', 'know のように「状態」を表す動詞は、今のことでも進行形にせず現在形のまま使う。', [
        'know は状態を表す動詞なので、今のことでも現在形 know のまま使う。',
        'know は状態を表す動詞なので、am knowing という進行形にはしない。',
        'knows は主語が3人称単数のときの形で、主語 I には s を付けない。',
        'knowing だけでは文の動詞にならない。be動詞と組にしても know は進行形にしない。',
      ]],
      ['have は「食べる」なら進行形にできる', 'They ___ lunch in the cafeteria now.', ['are having', 'have', 'are knowing', 'having'], 'are having', '彼らは今、食堂で昼食を食べています。', 'have は「持っている」の意味では進行形にしないが、「食べる」の意味では動作なので are having と進行形にできる。', [
        '「昼食を食べている」は動作なので、be動詞＋having の進行形にできる。',
        'have だけでは now（今まさに）の場面に合わず、ふだんの習慣を表す形になる。',
        'know は状態を表す動詞なので進行形にできず、意味も「昼食を知っている」となり通じない。',
        'having だけでは文の動詞にならない。be動詞 are を前に置く必要がある。',
      ]],
    ],
  },
  {
    unit: 'gref_5_can',
    order: [
      ['can のあとは動詞の原形', 'My father can cook Chinese food well.', '父は中華料理を上手に作れます。', 'can のあとの動詞はいつも原形。主語が3人称単数でも can にも動詞にも s は付けない。'],
      ['否定は cannot＋原形', 'My little sister cannot ride a bike.', '妹は自転車に乗れません。', 'can の否定は cannot（can’t）で表し、そのあとも動詞の原形を置く。do not は使わない。'],
    ],
    usage: [
      ['許可を求める Can I 〜?', '___ I use your eraser? Sure.', ['Can', 'Do', 'Am', 'Is'], 'Can', 'あなたの消しゴムを使ってもいいですか。いいですよ。', 'Can I 〜? は「〜してもいいですか」と許可を求める言い方。Sure. などで答える。', [
        'Can I 〜? で「〜してもいいですか」と許可を求める。答えは Sure. や OK. でよい。',
        'Do I use 〜? は「私は〜を使いますか」と事実をたずねる文になり、許可を求める意味にならない。',
        'Am I use 〜? という形はない。be動詞と一般動詞を並べて使うことはできない。',
        'Is I 〜? という形はない。主語 I に is は使わない。',
      ]],
      ['手伝うは help＋人＋with', 'Can you ___ me with my homework?', ['help', 'take', 'give', 'make'], 'help', '宿題を手伝ってくれませんか。', 'help＋人＋with＋事がら で「人の〜を手伝う」という決まった結び付きになる。', [
        'help me with my homework で「私の宿題を手伝う」。help のあとに人、with のあとに手伝う中身を置く。',
        'take me with my homework という結び付きはなく、手伝う意味にならない。',
        'give は give me a hand（手を貸す）のように使い、give me with 〜 とはつなげない。',
        'make me with 〜 という結び付きはなく、手伝う意味にならない。',
      ]],
      ['can の否定は cannot の1語', 'I ___ speak Chinese at all.', ['cannot', 'am not', 'do not can', 'not can'], 'cannot', '私は中国語がまったく話せません。', 'can の否定は cannot（can’t）で表す。do not を重ねたり、not だけを置いたりしない。', [
        'cannot は can の否定で、そのあとに動詞の原形 speak を続ける。',
        'am not は be動詞の否定で、後ろに動詞の原形 speak を続けることはできない。',
        'can は助動詞なので do not とは重ねない。否定は cannot の1語にする。',
        'not だけを主語の後ろに置く形はない。can の否定は cannot にする。',
      ]],
    ],
  },
  {
    unit: 'gref_5_imperative',
    order: [
      ['be動詞の命令文は Be で始める', 'Be careful with those scissors.', 'そのはさみに気をつけて。', '命令文は動詞の原形で始める。be動詞の原形は be なので、文頭を大文字にして Be careful とする。'],
      ['Don’t＋原形で「〜しないで」', 'Please don’t open that window.', 'その窓を開けないでください。', '「〜しないで」は Don’t＋動詞の原形で表す。文頭に Please を置くとていねいな言い方になる。'],
      ['Let’s＋原形で「〜しましょう」', 'Let’s go to the library together.', '一緒に図書館へ行きましょう。', '「〜しましょう」と誘うときは Let’s＋動詞の原形。Let’s のあとにも原形をそのまま置く。'],
    ],
    usage: [
      ['決して〜するなは Never＋原形', '___ run in the school hallway.', ['Never', 'Not', 'No', 'Don’t be'], 'Never', '校舎のろうかでは決して走らないで。', 'Never＋動詞の原形で「決して〜するな」と強い禁止を表す。Don’t よりも強い言い方になる。', [
        'Never＋動詞の原形で「決して〜するな」。Don’t run よりも強い禁止になる。',
        'Not だけを文頭に置いて命令文を打ち消すことはできない。Don’t か Never を使う。',
        'No は名詞の前に置いて「〜がない」を表す語で、動詞の前に置いて禁止は表せない。',
        'Don’t be のあとには形容詞などを置く。動詞 run の前には Don’t だけを置く。',
      ]],
      ['やめましょうは Let’s not＋原形', 'Let’s ___ waste time.', ['not', 'don’t', 'no', 'not to'], 'not', '時間をむだにするのはやめましょう。', '「〜するのはやめましょう」は Let’s not＋動詞の原形で表す。Let’s don’t とは言わない。', [
        'Let’s not＋動詞の原形で「〜するのはやめましょう」を表す。',
        'Let’s don’t という形はふつう使わない。打ち消しは Let’s not にする。',
        'no は名詞の前に置く語で、Let’s のあとに置いて動詞を打ち消すことはできない。',
        'not to は「〜しないように」と別の働きをする形で、Let’s のあとには置かない。',
      ]],
      ['Be のあとは形容詞', 'Be ___ when you carry the hot soup.', ['careful', 'carefully', 'care', 'caring'], 'careful', '熱いスープを運ぶときは気をつけて。', 'be動詞の命令文 Be のあとには、様子を表す形容詞を置く。careful は「注意深い」という形容詞。', [
        'careful は「注意深い」という形容詞で、Be のあとに置いて「気をつけて」となる。',
        'carefully は「注意深く」と動作のしかたを表す副詞で、be動詞のあとには置かない。',
        'care は「世話・注意」という名詞や「気にする」という動詞で、Be careful の形には入らない。',
        'caring は「思いやりがある」という人がらを表す語で、熱い物を運ぶときの注意には合わない。',
      ]],
    ],
  },
])
