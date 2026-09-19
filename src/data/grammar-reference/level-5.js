// 文法の参考書：英検5級（中1程度）。並びは学ぶ順。
import { referenceUnit } from './unit.js'

export const GRAMMAR_REFERENCE_5 = [
  referenceUnit({
    key: 'be',
    level: '5',
    topic: 'be動詞',
    title: 'be動詞（am / is / are）',
    lead: 'be動詞は「〜です」「〜にいる・ある」を表す。主語に合わせて am・is・are を選ぶのがいちばん大事なポイント。',
    forms: [
      ['ふつうの文', '主語 ＋ am / is / are ＋ 〜.', 'I am a student.', '私は学生です。'],
      ['否定文', '主語 ＋ am / is / are ＋ not ＋ 〜.', 'This is not my bag.', 'これは私のかばんではありません。'],
      ['疑問文', 'Am / Is / Are ＋ 主語 ＋ 〜?', 'Are you a teacher? — Yes, I am.', 'あなたは先生ですか。— はい、そうです。'],
    ],
    points: [
      {
        title: '主語で am・is・are が決まる',
        text: [
          'I には am、you と2人・2つ以上の主語には are、それ以外の1人・1つの主語（he・she・it・Ken・my dog など）には is を使う。',
          'Ken and Emi のように and で2人以上を並べた主語は、複数なので are になる。Emi and I（エミと私）も2人なので are。',
        ],
        table: [
          ['主語', 'be動詞', '例'],
          ['I', 'am', 'I am Ken.'],
          ['you（1人でも2人以上でも）', 'are', 'You are kind.'],
          ['he / she / it', 'is', 'She is my sister.'],
          ['Ken / my dog など1人・1つ', 'is', 'My dog is small.'],
          ['we / they', 'are', 'They are at home.'],
          ['Ken and Emi など2人・2つ以上', 'are', 'My parents are teachers.'],
        ],
        examples: [
          ['Emi and I are classmates.', 'エミと私は同級生です。'],
          ['Ken is ready for class.', 'ケンは授業の準備ができています。'],
        ],
      },
      {
        title: '「〜です」と「〜にいる・ある」',
        text: [
          'be動詞の後ろに名詞や様子を表す語（形容詞）を置くと「〜です」、場所を表す語句を置くと「〜にいる・〜にある」という意味になる。',
        ],
        examples: [
          ['She is kind.', '彼女は親切です。'],
          ['My father is a doctor.', '私の父は医者です。'],
          ['The cat is under the table.', 'ネコはテーブルの下にいます。'],
          ['Your book is on the desk.', 'あなたの本は机の上にあります。'],
        ],
      },
      {
        title: '否定文は not、疑問文は be動詞を前へ',
        text: [
          '否定文は be動詞のすぐ後ろに not を置く。疑問文は be動詞を主語の前に出し、最後に「?」を付ける。',
          '答えるときも be動詞を使う（Yes, I am. / No, it isn’t.）。答えの主語は代名詞（I・he・she・it・they など）にする。',
        ],
        table: [
          ['短縮形', 'もとの形'],
          ['I’m', 'I am'],
          ['you’re / we’re / they’re', 'you are / we are / they are'],
          ['he’s / she’s / it’s', 'he is / she is / it is'],
          ['isn’t', 'is not'],
          ['aren’t', 'are not'],
        ],
        examples: [
          ['They are not at home now.', '彼らは今、家にいません。'],
          ['Is this your pen? — Yes, it is.', 'これはあなたのペンですか。— はい、そうです。'],
          ['Are you busy now? — No, I’m not.', 'あなたは今忙しいですか。— いいえ、忙しくありません。'],
        ],
      },
    ],
    mistakes: [
      ['I am play tennis.', 'I play tennis.', 'play は一般動詞なので be動詞を重ねない。「テニスをしている」と言うなら I am playing tennis.'],
      ['My parents is teachers.', 'My parents are teachers.', 'parents（両親）は2人を表す複数なので are。'],
      ['Is you busy?', 'Are you busy?', 'you の be動詞は、1人に話しかけるときでも are。'],
    ],
    check: [
      'I → am、you と2人・2つ以上 → are、それ以外の1人・1つ → is。',
      'A and B のように2人・2つを並べた主語は are。',
      '否定文は be動詞＋not、疑問文は be動詞を主語の前へ。',
      '答えの文も be動詞で答える（Yes, I am. / No, it isn’t.）。',
    ],
  }),

  referenceUnit({
    key: 'verb',
    level: '5',
    topic: '一般動詞・3単現',
    title: '一般動詞と3人称単数のs',
    lead: 'play・like・go のように動作や気持ちを表す動詞を一般動詞という。今の文で主語が3人称単数（he・she・it など）のときは、動詞に s・es を付ける。',
    forms: [
      ['主語が I・you・複数', '主語 ＋ 動詞 ＋ 〜.', 'I play soccer after school.', '私は放課後にサッカーをします。'],
      ['主語が3人称単数', '主語 ＋ 動詞-s / -es ＋ 〜.', 'He plays tennis every day.', '彼は毎日テニスをします。'],
    ],
    points: [
      {
        title: '3人称単数とは',
        text: [
          '話し手（I）と聞き手（you）以外の、1人・1つの主語を3人称単数という。he・she・it のほか、Ken・my sister・the dog なども3人称単数。',
          'I・you・we・they や、Ken and Emi のような2人以上の主語には s を付けない。',
        ],
        examples: [
          ['My sister likes music.', '私の姉は音楽が好きです。'],
          ['I like music, too.', '私も音楽が好きです。'],
          ['Ken and Emi walk to school.', 'ケンとエミは歩いて学校へ行きます。'],
        ],
      },
      {
        title: 's・es の付け方',
        table: [
          ['動詞の終わり', '付け方', '例'],
          ['ふつう', 's', 'play → plays、like → likes'],
          ['s・x・ch・sh・o', 'es', 'watch → watches、go → goes、do → does'],
          ['子音字＋y', 'y を i に変えて es', 'study → studies、carry → carries'],
          ['母音字＋y', 's だけ', 'play → plays、buy → buys'],
          ['have（特別な形）', 'has', 'have → has'],
        ],
        examples: [
          ['My sister goes to school by bus.', '姉はバスで学校へ行きます。'],
          ['Emi studies English after dinner.', 'エミは夕食後に英語を勉強します。'],
          ['My father has a car.', '父は車を持っています。'],
        ],
      },
      {
        title: 'ふだんのことは現在形で',
        text: [
          'every day（毎日）、every Saturday（毎週土曜日）のようにくり返すことや、今の習慣・好みは現在形で表す。',
          'always（いつも）・usually（たいてい）・often（よく）・sometimes（ときどき）は、ふつう一般動詞の前に置く。be動詞の文では be動詞の後ろに置く（She is always kind.）。',
        ],
        examples: [
          ['My brother plays soccer every Saturday.', '兄は毎週土曜日にサッカーをします。'],
          ['He always gets up at six.', '彼はいつも6時に起きます。'],
          ['I sometimes cook dinner.', '私はときどき夕食を作ります。'],
        ],
      },
      {
        title: '動詞と後ろの語の決まった組み合わせ',
        text: [
          '動詞には、後ろの語との決まった組み合わせがある。日本語の「する」「とる」だけで動詞を決めない。',
        ],
        table: [
          ['英語', '意味'],
          ['do my homework', '宿題をする'],
          ['take a picture', '写真を撮る'],
          ['brush my teeth', '歯をみがく'],
          ['study English', '英語を勉強する'],
          ['play the piano', 'ピアノをひく'],
          ['watch TV', 'テレビを見る'],
        ],
        examples: [
          ['I do my homework after dinner.', '私は夕食後に宿題をします。'],
          ['Please take a picture of our class.', '私たちのクラスの写真を撮ってください。'],
          ['Tom brushes his teeth before bed.', 'トムは寝る前に歯をみがきます。'],
        ],
      },
    ],
    mistakes: [
      ['He play tennis every day.', 'He plays tennis every day.', '主語 He は3人称単数なので、今の文では plays。'],
      ['I plays soccer.', 'I play soccer.', '主語が I のときは s を付けない。'],
      ['Emi studys English.', 'Emi studies English.', '子音字＋y で終わる study は、y を i に変えて es。'],
      ['My father haves a car.', 'My father has a car.', 'have の3単現は has。'],
      ['Does he speaks English?', 'Does he speak English?', 'does を使う文では、3単現の s は does が受け持つので、動詞は原形。'],
    ],
    check: [
      '3人称単数＝I・you 以外の1人・1つ（he・she・it・Ken・my dog など）。',
      '今の文で主語が3人称単数なら、動詞に s・es（have は has）。',
      'study → studies、go → goes、watch → watches。',
      'do my homework・take a picture・brush my teeth は決まった組み合わせ。',
    ],
  }),

  referenceUnit({
    key: 'negq',
    level: '5',
    topic: '否定文・疑問文',
    title: '一般動詞の否定文・疑問文（do / does）',
    lead: '一般動詞の文を「〜しない」「〜しますか」にするときは do・does を使い、動詞は原形（s の付かない形）にする。',
    forms: [
      ['否定文', '主語 ＋ do / does ＋ not ＋ 動詞の原形 〜.', 'I do not like natto.', '私は納豆が好きではありません。'],
      ['疑問文', 'Do / Does ＋ 主語 ＋ 動詞の原形 〜?', 'Does she play the piano? — Yes, she does.', '彼女はピアノをひきますか。— はい、ひきます。'],
    ],
    points: [
      {
        title: 'do と does の使い分け',
        text: [
          '主語が I・you・複数なら do、3人称単数なら does を使う。does を使ったら、3単現の s は does が受け持つので、後ろの動詞は原形に戻す。',
        ],
        table: [
          ['主語', '否定文', '疑問文'],
          ['I / you / 複数', 'do not（don’t）＋原形', 'Do ＋主語＋原形 〜?'],
          ['3人称単数', 'does not（doesn’t）＋原形', 'Does ＋主語＋原形 〜?'],
        ],
        examples: [
          ['He does not like fish.', '彼は魚が好きではありません。'],
          ['We don’t play soccer on Mondays.', '私たちは月曜日にはサッカーをしません。'],
          ['Do your parents work on Saturdays?', 'あなたの両親は土曜日に働きますか。'],
        ],
      },
      {
        title: '答え方',
        text: [
          'Do 〜? には do で、Does 〜? には does で答える。答えの主語は代名詞（he・she・they など）に言いかえる。',
        ],
        examples: [
          ['Do you like cats? — Yes, I do.', 'あなたはネコが好きですか。— はい、好きです。'],
          ['Does Ken play tennis? — No, he doesn’t.', 'ケンはテニスをしますか。— いいえ、しません。'],
          ['Do your parents cook? — Yes, they do.', 'あなたの両親は料理をしますか。— はい、します。'],
        ],
      },
      {
        title: 'be動詞の文と区別する',
        text: [
          'am・is・are の文は be動詞＋not で否定し、be動詞を前に出して疑問文にする。一般動詞の文は do・does を使う。1つの文に be動詞と do・does を一緒に使わない。',
        ],
        table: [
          ['', 'be動詞の文', '一般動詞の文'],
          ['ふつうの文', 'She is busy.', 'She plays tennis.'],
          ['否定文', 'She is not busy.', 'She does not play tennis.'],
          ['疑問文', 'Is she busy?', 'Does she play tennis?'],
        ],
      },
    ],
    mistakes: [
      ['Does she plays the piano?', 'Does she play the piano?', 'Does の後ろの動詞は原形。'],
      ['He doesn’t likes fish.', 'He doesn’t like fish.', 'does not（doesn’t）の後ろも原形。'],
      ['Are you like cats?', 'Do you like cats?', 'like は一般動詞なので、疑問文は Do で始める。'],
      ['I not like natto.', 'I don’t like natto.', '一般動詞の否定文は do not（don’t）を使う。not だけでは否定文にならない。'],
    ],
    check: [
      '主語が3人称単数なら does、それ以外は do。',
      'do・does の後ろは必ず動詞の原形。',
      '答えは Yes, 主語 do / does. / No, 主語 don’t / doesn’t.',
      'be動詞の文と一般動詞の文をまぜない。',
    ],
  }),

  referenceUnit({
    key: 'plural',
    level: '5',
    topic: '名詞の複数形',
    title: '名詞の複数形',
    lead: '数えられる名詞が2つ（2人）以上のときは、名詞を複数形にする。多くは s を付けるが、es を付ける語や形が変わる語もある。',
    forms: [
      ['2つ以上', '2以上の数 / many / some ＋ 数えられる名詞の複数形', 'I have three boxes.', '私は箱を3つ持っています。'],
    ],
    points: [
      {
        title: '複数形の作り方',
        table: [
          ['名詞の終わり', '付け方', '例'],
          ['ふつう', 's', 'book → books、animal → animals'],
          ['s・x・ch・sh', 'es', 'bus → buses、box → boxes、watch → watches'],
          ['子音字＋y', 'y を i に変えて es', 'city → cities、baby → babies'],
          ['f・fe', 'f・fe を v に変えて es', 'leaf → leaves、knife → knives'],
          ['o（一部の語）', 'es', 'tomato → tomatoes、potato → potatoes'],
        ],
        examples: [
          ['There are many animals in the zoo.', '動物園にはたくさんの動物がいます。'],
          ['There are three big cities in this area.', 'この地域には大きな都市が3つあります。'],
          ['We need two knives.', '私たちはナイフが2本必要です。'],
        ],
      },
      {
        title: '形が変わる名詞・同じ形の名詞',
        table: [
          ['1人・1つ', '2人・2つ以上'],
          ['man（男性）', 'men'],
          ['woman（女性）', 'women'],
          ['child（子ども）', 'children'],
          ['foot（足）', 'feet'],
          ['tooth（歯）', 'teeth'],
          ['mouse（ネズミ）', 'mice'],
          ['fish（魚）', 'fish（同じ形）'],
          ['sheep（ヒツジ）', 'sheep（同じ形）'],
        ],
        examples: [
          ['I see three children over there.', 'あそこに子どもが3人見えます。', { over: 'over there で「あそこに」' }],
          ['Two mice are under the table.', 'テーブルの下にネズミが2匹います。'],
          ['There are many fish in the pond.', '池にはたくさんの魚がいます。'],
        ],
      },
      {
        title: '数えられない名詞',
        text: [
          'water（水）・milk（牛乳）・money（お金）・homework（宿題）のように、決まった形のない物や、ひとまとまりで考える物は数えられない名詞。a / an も複数形の s も付けない。',
          '量は a glass of 〜（コップ1杯の〜）、a cup of 〜（カップ1杯の〜）、a piece of 〜（1切れの〜）のように入れ物や形で数える。',
        ],
        examples: [
          ['I drink a glass of milk every morning.', '私は毎朝、牛乳をコップ1杯飲みます。'],
          ['I have a lot of homework today.', '今日は宿題がたくさんあります。'],
        ],
      },
      {
        title: '数をたずねる How many',
        text: [
          '数をたずねるときは How many ＋名詞の複数形 で始める。',
        ],
        examples: [
          ['How many pens do you have? — I have five.', 'あなたはペンを何本持っていますか。— 5本持っています。'],
        ],
      },
    ],
    mistakes: [
      ['I have three box.', 'I have three boxes.', '2つ以上なら複数形。x で終わる語は es。'],
      ['I have two childs.', 'I have two children.', 'child の複数形は children。'],
      ['I want a water.', 'I want some water.', 'water は数えられないので a を付けない。'],
    ],
    check: [
      '2つ以上 → 複数形（-s / -es）。',
      'y → ies（city → cities）、f・fe → ves（knife → knives）。',
      'man → men、child → children、mouse → mice、fish は同じ形。',
      'water・milk・money・homework は数えられない名詞。',
    ],
  }),

  referenceUnit({
    key: 'article',
    level: '5',
    topic: '冠詞',
    title: '冠詞（a / an / the）',
    lead: '名詞の前に置く a・an・the を冠詞という。「1つの・ある」は a / an、話に出た物やどれか決まっている物は the。',
    forms: [
      ['a', 'a ＋ 子音の音で始まる数えられる名詞（1つ）', 'I have a dog.', '私は犬を1匹飼っています。'],
      ['an', 'an ＋ 母音の音で始まる数えられる名詞（1つ）', 'I have an apple.', '私はリンゴを1つ持っています。'],
      ['the', 'the ＋ どれか決まっている名詞', 'The sun rises in the east.', '太陽は東から昇ります。'],
    ],
    points: [
      {
        title: 'a と an は「音」で選ぶ',
        text: [
          '次の語が母音（ア・イ・ウ・エ・オに近い音）で始まるときは an、それ以外は a を使う。つづりではなく音で決まる。',
          '名詞の前に形容詞があるときは、形容詞の最初の音で選ぶ（an old car、a new car）。',
        ],
        table: [
          ['a を使う', 'an を使う'],
          ['a book', 'an apple'],
          ['a cat', 'an egg'],
          ['a uniform（ユの音）', 'an hour（アの音）'],
          ['a new car', 'an old car'],
        ],
        examples: [
          ['My brother is an engineer.', '私の兄は技術者です。'],
          ['Ken wants to be an artist.', 'ケンは画家になりたいと思っています。'],
          ['She has an old camera.', '彼女は古いカメラを持っています。'],
        ],
      },
      {
        title: '「1つの」と職業には a / an',
        text: [
          '数えられる名詞を1つ・1人と言うときや、話に初めて出すときは a / an を付ける。I am a student. のように職業を言うときも a / an を付ける。',
        ],
        examples: [
          ['I am a student.', '私は学生です。'],
          ['She is an English teacher.', '彼女は英語の先生です。'],
        ],
      },
      {
        title: 'the を使うとき',
        text: [
          'もう話に出た物、その場でどれのことか分かる物、the sun（太陽）・the moon（月）のように1つしかない物には the を使う。楽器をひくと言うときも play the piano のように the を付ける。',
        ],
        examples: [
          ['I have a cat. The cat is white.', '私はネコを飼っています。そのネコは白いです。'],
          ['Please open the window.', '（その）窓を開けてください。'],
          ['She plays the guitar.', '彼女はギターをひきます。'],
        ],
      },
      {
        title: '冠詞を付けない決まった言い方',
        text: [
          'スポーツ（play soccer）、食事（have lunch）、教科（study math）、by ＋乗り物（by bus）、go to school（学校へ行く）などには冠詞を付けない。',
        ],
        examples: [
          ['We play soccer after school.', '私たちは放課後にサッカーをします。'],
          ['I go to school by bus.', '私はバスで学校へ行きます。'],
        ],
      },
    ],
    mistakes: [
      ['I have a apple.', 'I have an apple.', 'apple は母音の音で始まるので an。'],
      ['He is engineer.', 'He is an engineer.', '1人の職業を言うときは a / an を付ける。engineer は母音の音で始まるので an。'],
      ['I play the soccer.', 'I play soccer.', 'スポーツの名前には冠詞を付けない。'],
    ],
    check: [
      'a / an は次の語の「音」で選ぶ（an apple、an hour、a uniform）。',
      '1つの物・1人の職業を言うときは a / an。',
      '話に出た物・1つしかない物（the sun）・楽器（play the piano）は the。',
      'スポーツ・食事・by bus には冠詞を付けない。',
    ],
  }),

  referenceUnit({
    key: 'pronoun',
    level: '5',
    topic: '代名詞',
    title: '代名詞（I / my / me / mine）',
    lead: '人や物の名前の代わりに使う語を代名詞という。文の中での働き（主語・「〜の」・「〜を・〜に」・「〜のもの」）によって形が変わる。',
    forms: [
      ['主格（〜は）', 'I / he / she / we / they ＋ 動詞', 'He is a doctor.', '彼は医者です。'],
      ['所有格（〜の）', 'my / his / her / our / their ＋ 名詞', 'These are our pencils.', 'これらは私たちの鉛筆です。'],
      ['目的格（〜を・〜に）', '動詞・前置詞 ＋ me / him / her / us / them', 'This is Ken. I know him.', 'こちらはケンです。私は彼を知っています。'],
      ['所有代名詞（〜のもの）', 'mine / yours / his / hers / ours / theirs', 'This bag is mine.', 'このかばんは私のものです。'],
    ],
    points: [
      {
        title: '代名詞の変化',
        table: [
          ['', '〜は', '〜の', '〜を・〜に', '〜のもの'],
          ['私', 'I', 'my', 'me', 'mine'],
          ['あなた', 'you', 'your', 'you', 'yours'],
          ['彼', 'he', 'his', 'him', 'his'],
          ['彼女', 'she', 'her', 'her', 'hers'],
          ['それ', 'it', 'its', 'it', '―'],
          ['私たち', 'we', 'our', 'us', 'ours'],
          ['あなたたち', 'you', 'your', 'you', 'yours'],
          ['彼ら・それら', 'they', 'their', 'them', 'theirs'],
        ],
      },
      {
        title: '働きで形を選ぶ',
        text: [
          '主語には主格、名詞の前には所有格、動詞や前置詞（with・for など）の後ろには目的格を使う。名詞を言わずに「〜のもの」と言うときは所有代名詞にする。',
        ],
        examples: [
          ['Our teacher teaches us music.', '私たちの先生は私たちに音楽を教えます。'],
          ['Ken has a new notebook. His notebook is blue.', 'ケンは新しいノートを持っています。彼のノートは青いです。'],
          ['The teacher helped us after class today.', '今日、先生は放課後に私たちを手伝ってくれました。'],
          ['Can you come with me?', '私と一緒に来てくれますか。'],
        ],
      },
      {
        title: '持ち主を言う ’s と所有代名詞',
        text: [
          '人の名前には ’s を付けて「〜の」「〜のもの」を表す（Ken’s bag、It’s Ken’s.）。Whose 〜?（だれの〜）とたずねられたら、mine・yours・hers などで答えられる。',
        ],
        examples: [
          ['Whose pen is this? — It’s hers.', 'これはだれのペンですか。— 彼女のものです。'],
          ['That is Mary’s bike.', 'あれはメアリーの自転車です。'],
        ],
      },
      {
        title: 'its と it’s を区別する',
        text: [
          'its は「その・それの」（所有格）、it’s は it is を縮めた形（短縮形）。',
        ],
        examples: [
          ['I have a dog. Its name is Pochi.', '私は犬を飼っています。その名前はポチです。'],
          ['It’s very cute.', 'それはとてもかわいいです。'],
        ],
      },
    ],
    mistakes: [
      ['I know he.', 'I know him.', '動詞の後ろ（目的語）は目的格。'],
      ['This bag is my.', 'This bag is mine.', '名詞を後ろに置かずに「私のもの」と言うなら mine。'],
      ['Me name is Emi.', 'My name is Emi.', '名詞 name の前は所有格 my。'],
    ],
    check: [
      '主語 → 主格、名詞の前 → 所有格、動詞・前置詞の後ろ → 目的格。',
      '「〜のもの」は mine・yours・his・hers・ours・theirs。人の名前なら Ken’s。',
      'its（その）と it’s（it is）を区別する。',
    ],
  }),

  referenceUnit({
    key: 'demonstrative',
    level: '5',
    topic: '指示語',
    title: '指示語（this / that / these / those）',
    lead: '「これ・あれ」「この・あの」を表す語。近いか遠いか、1つか2つ以上かで使い分ける。',
    forms: [
      ['近く', 'this（1つ） / these（2つ以上）', 'This is my pencil.', 'これは私の鉛筆です。'],
      ['遠く', 'that（1つ） / those（2つ以上）', 'Those flowers are beautiful.', 'あの花はきれいです。'],
    ],
    points: [
      {
        title: '4つの使い分け',
        table: [
          ['', '1つ', '2つ以上'],
          ['近く', 'this（これ・この）', 'these（これら・これらの）'],
          ['遠く', 'that（あれ・あの）', 'those（あれら・あれらの）'],
        ],
        examples: [
          ['These are my books.', 'これらは私の本です。'],
          ['That is our school.', 'あれは私たちの学校です。'],
          ['Those flowers over there are beautiful.', 'あそこにあるあの花はきれいです。', { over: 'over there で「あそこに」' }],
        ],
      },
      {
        title: '名詞の前にも置ける',
        text: [
          'this bag（このかばん）のように名詞の前に置くこともできる。these・those の後ろの名詞は複数形にし、be動詞は are を使う。',
        ],
        examples: [
          ['Is this bag yours, Mika?', 'このかばんはあなたのものですか、ミカ。'],
          ['These apples are very sweet.', 'これらのリンゴはとても甘いです。'],
          ['Are these your notebooks?', 'これらはあなたのノートですか。'],
        ],
      },
      {
        title: '答えるときは it・they',
        text: [
          'Is this 〜? / Is that 〜? には it で、Are these 〜? / Are those 〜? には they で答える。',
        ],
        examples: [
          ['Is that your house? — Yes, it is.', 'あれはあなたの家ですか。— はい、そうです。'],
          ['Are these your shoes? — No, they aren’t.', 'これらはあなたのくつですか。— いいえ、ちがいます。'],
        ],
      },
      {
        title: '天気・時刻・曜日を言う it',
        text: [
          '天気・寒さ暑さ・時刻・曜日・日付を言うときは it を主語にする。この it は「それ」と訳さない。',
        ],
        examples: [
          ['It is sunny today.', '今日は晴れです。'],
          ['What time is it? — It’s seven.', '何時ですか。— 7時です。'],
          ['It’s Monday today.', '今日は月曜日です。'],
        ],
      },
    ],
    mistakes: [
      ['This are my books.', 'These are my books.', '2冊以上なら these と are。'],
      ['That flowers are beautiful.', 'Those flowers are beautiful.', '複数の名詞の前は those。'],
    ],
    check: [
      '近く → this / these、遠く → that / those。',
      'these・those の後ろは複数形と are。',
      'this・that には it、these・those には they で答える。',
      '天気・時刻・曜日は It is 〜. で言う。',
    ],
  }),

  referenceUnit({
    key: 'wh',
    level: '5',
    topic: '疑問詞',
    title: '疑問詞（what / who / when / where など）',
    lead: '「何」「だれ」「いつ」「どこ」のように、知りたい内容をたずねる語を疑問詞という。疑問詞は文の先頭に置き、Yes / No ではなく内容で答える。',
    forms: [
      ['be動詞の文', '疑問詞 ＋ be動詞 ＋ 主語 〜?', 'Who is that man? — He is my uncle.', 'あの男の人はだれですか。— 私のおじです。'],
      ['一般動詞の文', '疑問詞 ＋ do / does ＋ 主語 ＋ 動詞の原形 〜?', 'Where do you live? — I live in Osaka.', 'あなたはどこに住んでいますか。— 大阪に住んでいます。'],
    ],
    points: [
      {
        title: '疑問詞とたずねること',
        table: [
          ['疑問詞', 'たずねること', '例'],
          ['what', '何', 'What is this?'],
          ['who', 'だれ', 'Who is that girl?'],
          ['whose', 'だれの', 'Whose bag is this?'],
          ['which', 'どちら・どれ', 'Which do you like, tea or coffee?'],
          ['when', 'いつ', 'When is your birthday?'],
          ['where', 'どこ', 'Where do you practice soccer?'],
          ['why', 'なぜ', 'Why are you tired?'],
          ['how', 'どのように・どう', 'How do you go to school?'],
        ],
      },
      {
        title: 'what・how を使ったいろいろなたずね方',
        table: [
          ['言い方', 'たずねること'],
          ['What time 〜?', '時刻'],
          ['What day 〜?', '曜日'],
          ['What color 〜?', '色'],
          ['How many ＋複数形 〜?', '数'],
          ['How much 〜?', '値段・量'],
          ['How old 〜?', '年齢・古さ'],
          ['How tall 〜?', '背の高さ'],
        ],
        examples: [
          ['What time is it now? — It’s ten.', '今何時ですか。— 10時です。'],
          ['How many pens do you have?', 'あなたはペンを何本持っていますか。'],
          ['How much is this cap? — It’s 1,000 yen.', 'この帽子はいくらですか。— 1,000円です。'],
          ['How old is your sister? — She is twelve.', 'あなたのお姉さんは何歳ですか。— 12歳です。'],
        ],
      },
      {
        title: '答え方',
        text: [
          '疑問詞でたずねられたら Yes / No で答えず、たずねられた内容を答える。Why 〜? には Because 〜.（〜だからです）で答えることが多い。',
          'Which 〜, A or B? は2つのうちどちらかを選んでもらう聞き方。',
        ],
        examples: [
          ['When is your birthday? — It’s in May.', 'あなたの誕生日はいつですか。— 5月です。', { May: '5月' }],
          ['Why are you tired? — Because I ran a lot.', 'なぜ疲れているのですか。— たくさん走ったからです。'],
          ['Whose bag is this? — It’s Mary’s.', 'これはだれのかばんですか。— メアリーのです。'],
          ['Which do you like, tea or coffee? — I like tea.', '紅茶とコーヒーではどちらが好きですか。— 紅茶が好きです。'],
        ],
      },
      {
        title: '疑問詞が主語のとき',
        text: [
          'Who plays the piano?（だれがピアノをひきますか）のように疑問詞そのものが主語のときは、do・does を使わず、疑問詞のすぐ後ろに動詞を置く。3人称単数として扱うので、今の文では動詞に s を付ける。',
        ],
        examples: [
          ['Who plays the piano? — Emi does.', 'だれがピアノをひきますか。— エミです。'],
          ['Who cooks dinner in your family?', 'あなたの家族ではだれが夕食を作りますか。'],
        ],
      },
    ],
    mistakes: [
      ['Where you live?', 'Where do you live?', '疑問詞の後ろは疑問文の語順（do you live）。'],
      ['How many pen do you have?', 'How many pens do you have?', 'How many の後ろは複数形。'],
      ['Who play the piano?', 'Who plays the piano?', '疑問詞が主語の今の文は、3人称単数として動詞に s を付ける。'],
    ],
    check: [
      'what 何・who だれ・whose だれの・which どちら・when いつ・where どこ・why なぜ・how どのように。',
      'What time（時刻）、How many＋複数形（数）、How much（値段）、How old（年齢）。',
      '疑問詞の後ろは疑問文の語順。疑問詞が主語なら Who plays 〜?',
      'Yes / No ではなく、たずねられた内容で答える。',
    ],
  }),

  referenceUnit({
    key: 'prep',
    level: '5',
    topic: '前置詞',
    title: '前置詞（時・場所・方向・道具）',
    lead: '名詞の前に置いて、時・場所・方向・道具などの関係を表す語を前置詞という。日本語の「に」「で」だけで選ばず、何を表すかで決める。',
    forms: [
      ['形', '前置詞 ＋ 名詞（代名詞なら目的格）', 'I get up at seven.', '私は7時に起きます。'],
    ],
    points: [
      {
        title: '時を表す at・on・in',
        text: [
          '時刻には at、曜日・日付には on、月・季節・年には in を使う。「朝に」は in the morning だが、「月曜日の朝に」のように特定の日の朝・午後・晩には on を使う。',
        ],
        table: [
          ['前置詞', '使うもの', '例'],
          ['at', '時刻・時の一点', 'at seven、at noon、at night'],
          ['on', '曜日・日付・特定の日', 'on Sunday、on May 5、on Monday morning'],
          ['in', '月・季節・年、朝・午後・晩', 'in April、in summer、in the morning'],
        ],
        examples: [
          ['Our English lesson begins at nine.', '英語の授業は9時に始まります。'],
          ['We play soccer on Sundays.', '私たちは日曜日にサッカーをします。'],
          ['My birthday is in April.', '私の誕生日は4月です。'],
          ['The class starts on Monday morning.', '授業は月曜日の朝に始まります。'],
        ],
      },
      {
        title: '場所を表す前置詞',
        table: [
          ['前置詞', '意味', '例'],
          ['in', '〜の中に', 'in the box、in Japan'],
          ['on', '〜の上に（くっついて）', 'on the desk、on the wall'],
          ['under', '〜の下に', 'under the table'],
          ['near / by', '〜の近くに・そばに', 'near the station、by the window'],
          ['at', '〜で（地点）', 'at the station、at home'],
          ['in front of', '〜の前に', 'in front of the school'],
        ],
        examples: [
          ['The cat is under the table.', 'ネコはテーブルの下にいます。'],
          ['There is a picture on the wall.', '壁に絵がかかっています。'],
          ['My house is near the station.', '私の家は駅の近くです。'],
        ],
      },
      {
        title: '方向・道具・手段など',
        table: [
          ['前置詞', '意味', '例'],
          ['to', '〜へ（行き先）', 'go to school'],
          ['from', '〜から・〜出身', 'from Canada'],
          ['with', '〜と一緒に・〜を使って', 'with my friends、with a knife'],
          ['by', '〜で（交通手段）', 'by bus、by bike'],
          ['for', '〜のために・〜の間', 'for you、for two hours'],
          ['about', '〜について', 'about my family'],
        ],
        examples: [
          ['She goes to school by bus.', '彼女はバスで学校へ行きます。'],
          ['Cut the cake with a knife.', 'ナイフでケーキを切って。'],
          ['I am from Canada.', '私はカナダ出身です。'],
        ],
      },
      {
        title: '前置詞の後ろの代名詞は目的格',
        text: [
          '前置詞の後ろに代名詞を置くときは、with me・for him・to them のように目的格にする。',
        ],
        examples: [
          ['Please come with me.', '私と一緒に来てください。'],
          ['This is a present for you.', 'これはあなたへのプレゼントです。'],
        ],
      },
    ],
    mistakes: [
      ['I get up on seven.', 'I get up at seven.', '時刻には at。'],
      ['My birthday is on April.', 'My birthday is in April.', '月には in。日付まで言うなら on April 5。'],
      ['She goes to school with bus.', 'She goes to school by bus.', '交通手段は by ＋乗り物（冠詞を付けない）。'],
    ],
    check: [
      '時刻 at・曜日と日付 on・月と季節と年 in。',
      '特定の日の朝は on Monday morning。',
      '中 in・上（くっついて）on・下 under・近く near。',
      'to は行き先、by は交通手段、with は「一緒に」「〜を使って」。',
    ],
  }),

  referenceUnit({
    key: 'progressive',
    level: '5',
    topic: '現在進行形',
    title: '現在進行形（am / is / are ＋ 動詞ing）',
    lead: '「今〜しているところだ」と、ちょうど今行っている動作を表す。be動詞の後ろに動詞の ing 形を置く。',
    forms: [
      ['ふつうの文', '主語 ＋ am / is / are ＋ 動詞ing 〜.', 'He is watching TV now.', '彼は今テレビを見ています。'],
      ['否定文', '主語 ＋ am / is / are ＋ not ＋ 動詞ing 〜.', 'I am not sleeping.', '私は眠っていません。'],
      ['疑問文', 'Am / Is / Are ＋ 主語 ＋ 動詞ing 〜?', 'Is she studying now? — Yes, she is.', '彼女は今勉強していますか。— はい、しています。'],
    ],
    points: [
      {
        title: 'ing 形の作り方',
        table: [
          ['動詞の終わり', '作り方', '例'],
          ['ふつう', 'ing を付ける', 'play → playing、read → reading'],
          ['e で終わる', 'e を取って ing', 'make → making、write → writing、use → using'],
          ['短い母音＋子音字', '子音字を重ねて ing', 'run → running、swim → swimming、sit → sitting'],
          ['ie で終わる', 'ie を y に変えて ing', 'lie → lying'],
        ],
        examples: [
          ['My mother is making dinner now.', '母は今、夕食を作っています。'],
          ['They are running in the park.', '彼らは公園で走っています。'],
          ['The children are studying in the library.', '子どもたちは図書館で勉強しています。'],
        ],
      },
      {
        title: '現在形との違い',
        text: [
          '現在形（Ken plays tennis.）は「ふだんすること」、現在進行形（Ken is playing tennis now.）は「今している最中のこと」を表す。now・right now・Look!（ほら、見て）などが手がかりになる。',
        ],
        examples: [
          ['Ken plays tennis every day.', 'ケンは毎日テニスをします。'],
          ['Ken is playing tennis right now.', 'ケンはちょうど今テニスをしています。'],
          ['Look! The bird is singing.', 'ほら、鳥が鳴いています。'],
        ],
      },
      {
        title: '否定文・疑問文と答え方',
        text: [
          'be動詞の文と同じで、否定文は be動詞の後ろに not、疑問文は be動詞を主語の前に出す。答えも be動詞を使う。What are you doing? は「何をしているのですか」とたずねる言い方。',
        ],
        examples: [
          ['Is he sleeping now? — No, he isn’t.', '彼は今眠っていますか。— いいえ、眠っていません。'],
          ['What are you doing? — I’m reading a book.', 'あなたは何をしているのですか。— 本を読んでいます。'],
        ],
      },
      {
        title: '進行形にしない動詞',
        text: [
          'like（好きだ）・know（知っている）・want（ほしい）・have（持っている）のように状態を表す動詞は、ふつう進行形にしない。ただし have が「食べる」の意味なら進行形にできる（They are having lunch.）。',
        ],
        examples: [
          ['I know his name.', '私は彼の名前を知っています。'],
          ['They are having lunch now.', '彼らは今、昼食を食べています。'],
        ],
      },
    ],
    mistakes: [
      ['He watching TV now.', 'He is watching TV now.', 'ing 形だけでは進行形にならない。主語に合う be動詞が必要。'],
      ['She is makeing a cake.', 'She is making a cake.', 'e で終わる動詞は e を取って ing。'],
      ['I am knowing the answer.', 'I know the answer.', 'know は状態を表す動詞なので進行形にしない。'],
    ],
    check: [
      '現在進行形＝am / is / are ＋ 動詞ing。',
      'make → making、run → running、swim → swimming。',
      'now・right now・Look! は進行形の手がかり。',
      'like・know・want・have（持っている）は進行形にしない。',
    ],
  }),

  referenceUnit({
    key: 'can',
    level: '5',
    topic: '助動詞 can',
    title: '助動詞 can',
    lead: 'can は「〜できる」を表す。Can I 〜? で「〜してもいいですか」、Can you 〜? で「〜してくれますか」と頼むこともできる。can の後ろの動詞はいつも原形。',
    forms: [
      ['ふつうの文', '主語 ＋ can ＋ 動詞の原形 〜.', 'She can swim very well.', '彼女はとても上手に泳げます。'],
      ['否定文', '主語 ＋ cannot（can’t）＋ 動詞の原形 〜.', 'I cannot swim at all.', '私はまったく泳げません。'],
      ['疑問文', 'Can ＋ 主語 ＋ 動詞の原形 〜?', 'Can your sister ride a bike? — Yes, she can.', 'あなたのお姉さんは自転車に乗れますか。— はい、乗れます。'],
    ],
    points: [
      {
        title: 'can の後ろは動詞の原形',
        text: [
          '主語が3人称単数でも、can にも後ろの動詞にも s を付けない。can のすぐ後ろに to を置かない。',
        ],
        examples: [
          ['My dog can run fast.', '私の犬は速く走れます。'],
          ['My father can cook dinner tonight.', '父は今夜、夕食を作ることができます。'],
        ],
      },
      {
        title: '否定文と疑問文',
        text: [
          '否定文は cannot（短縮形は can’t）＋原形。疑問文は Can を主語の前に出す。答えも can を使う（Yes, I can. / No, I can’t.）。',
        ],
        examples: [
          ['I can’t play the guitar.', '私はギターがひけません。'],
          ['Can your brother swim fast? — No, he can’t.', 'あなたのお兄さんは速く泳げますか。— いいえ、泳げません。'],
        ],
      },
      {
        title: '許可を求める Can I 〜? と、頼む Can you 〜?',
        table: [
          ['言い方', '意味', '答え方の例'],
          ['Can I 〜?', '〜してもいいですか（許可を求める）', 'Sure.（いいですよ） / Of course.（もちろん）'],
          ['Can you 〜?', '〜してくれますか（頼む）', 'OK.（いいですよ） / Sure.（もちろん）'],
        ],
        examples: [
          ['Can I open the window? — Sure.', '窓を開けてもいいですか。— いいですよ。', { Sure: 'いいですよ・もちろん' }],
          ['Can you help me? — OK.', '手伝ってくれますか。— いいですよ。'],
        ],
      },
    ],
    mistakes: [
      ['She cans swim.', 'She can swim.', 'can には s を付けない。'],
      ['He can plays tennis.', 'He can play tennis.', 'can の後ろは原形。'],
      ['I can to swim.', 'I can swim.', 'can の後ろに to を置かない。'],
      ['I don’t can swim.', 'I cannot swim.', 'can の否定は cannot（can’t）。do を使わない。'],
    ],
    check: [
      'can ＋ 動詞の原形。主語が何でも形は変わらない。',
      '否定は cannot / can’t、疑問は Can ＋ 主語 ＋ 原形 〜?',
      'Can I 〜? は許可を求める、Can you 〜? は頼む。',
    ],
  }),

  referenceUnit({
    key: 'imperative',
    level: '5',
    topic: '命令文',
    title: '命令文（〜しなさい・〜しないで・〜しましょう）',
    lead: '相手に「〜しなさい」「〜しないで」と指示したり、「〜しましょう」と誘ったりする文。主語 you を書かず、動詞の原形で始める。',
    forms: [
      ['〜しなさい', '動詞の原形 〜.', 'Open the window, please.', '窓を開けてください。'],
      ['be動詞の命令文', 'Be ＋ 形容詞など 〜.', 'Be quiet, please.', '静かにしてください。'],
      ['〜しないで', 'Don’t ＋ 動詞の原形 〜.', 'Don’t touch this switch.', 'このスイッチにさわらないで。'],
      ['〜しましょう', 'Let’s ＋ 動詞の原形 〜.', 'Let’s play soccer.', 'サッカーをしましょう。'],
    ],
    points: [
      {
        title: '動詞の原形で始める',
        text: [
          '命令文は主語 you を書かず、一般動詞の原形で始める。be動詞の命令文は原形の Be で始める（Be quiet.）。',
        ],
        examples: [
          ['Wash your hands before dinner.', '夕食の前に手を洗いなさい。'],
          ['Be careful.', '気をつけて。'],
        ],
      },
      {
        title: 'please を付けるとていねいになる',
        text: [
          '文の最初か最後に please を付けると「〜してください」とていねいになる。最後に付けるときはコンマ（,）の後ろに置く。',
        ],
        examples: [
          ['Please sit down.', 'すわってください。'],
          ['Close the door, please.', 'ドアを閉めてください。'],
        ],
      },
      {
        title: 'Don’t・Never・Always',
        text: [
          'Don’t＋動詞の原形は「〜しないで」という一般的な禁止。Never＋動詞の原形は「決して〜するな」という強い禁止を表す。Always＋動詞の原形は「いつも必ず〜しなさい」という習慣的な指示。',
          '問題では日本語までよく読み、「しないで」なら Don’t、「決して〜するな」なら Never、「いつも必ず」なら Always を選ぶ。',
        ],
        examples: [
          ['Don’t touch the wet paint.', 'ぬれたペンキにさわらないで。', { paint: 'ペンキ' }],
          ['Never give up on your dream.', '夢を決してあきらめるな。'],
          ['Always wear your seat belt.', 'いつも必ずシートベルトを着けなさい。'],
        ],
      },
      {
        title: 'Let’s と Let’s not',
        text: [
          'Let’s＋動詞の原形は、話し手も含めて「〜しましょう」と誘う言い方。「〜するのはやめましょう」は Let’s not＋動詞の原形。答え方は Yes, let’s. / No, let’s not. など。',
          'Don’t は相手への禁止、Let’s not は話し手自身も含む提案なので、日本語の意味を確かめて選ぶ。',
        ],
        examples: [
          ['Let’s play tennis. — Yes, let’s.', 'テニスをしましょう。— ええ、そうしましょう。'],
          ['Let’s not forget our tickets.', 'チケットを忘れないようにしましょう。'],
          ['Let’s not waste time.', '時間をむだにするのはやめましょう。'],
        ],
      },
    ],
    rewrites: [
      ['Don’t run here.', 'You must not run here.', '「〜してはいけない」は must not（4級の助動詞）でも表せる。'],
    ],
    mistakes: [
      ['Never don’t give up.', 'Never give up.', 'Never 自体に否定の意味があるので don’t を重ねない。Never の直後は動詞の原形。'],
      ['Don’t be touch it.', 'Don’t touch it.', '一般動詞の命令文に be を入れない。'],
      ['Let’s playing soccer.', 'Let’s play soccer.', 'Let’s の後ろは動詞の原形。'],
      ['Are quiet.', 'Be quiet.', 'be動詞の命令文は原形の Be で始める。'],
    ],
    check: [
      '命令文は動詞の原形（be動詞なら Be）で始める。',
      'Don’t＋原形＝〜しないで、Never＋原形＝決して〜するな、Always＋原形＝いつも必ず〜しなさい。',
      'Let’s＋原形＝〜しましょう、Let’s not＋原形＝〜するのはやめましょう。',
      'please を付けるとていねいになる。',
    ],
  }),
]
