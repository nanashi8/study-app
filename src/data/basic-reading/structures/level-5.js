// 基礎長文・5級の構造台帳（本文の順に1文ずつ）。書き方は entry.js と長文の構造台帳を見る。
import { bs } from './entry.js'

export const BASIC_READING_STRUCTURES_5 = Object.freeze({
  br5_family: Object.freeze([
    bs('[独 Hello]. [S My name] [V is] [C Aya], [接 and] [S I] [V am] [C a junior high school student] [M {前| in Japan}].', {
      chunks: [
        ['Hello.', 'こんにちは。'],
        ['My name is Aya,', 'わたしの名前はアヤです'],
        ['and I am', 'そして、わたしは〜です'],
        ['a junior high school student', '中学生'],
        ['in Japan.', '日本の'],
      ],
      notes: {
        'Hello.': '動詞のないあいさつのことばで、文の骨組みの外に置かれる独立語です。',
      },
    }),
    bs('[S I] [V live] [M {前| in a small house}] [M {前| with my family}].', {
      chunks: [
        ['I live', 'わたしは住んでいます'],
        ['in a small house', '小さな家に'],
        ['with my family.', '家族といっしょに'],
      ],
    }),
    bs('[S My father] [V is] [C a teacher].', {
      chunks: [
        ['My father is', '父は〜です'],
        ['a teacher.', '先生'],
      ],
      notes: {
        'a teacher.': '主語 My father が何者かを説明する補語です（父＝先生）。',
      },
    }),
    bs('[S He] [V teaches] [O English] [M {前| at a high school}].', {
      chunks: [
        ['He teaches English', '父は英語を教えています'],
        ['at a high school.', '高校で'],
      ],
      notes: {
        'He teaches English': 'teaches の後ろの English が「何を」にあたる目的語です。',
      },
      rules: ['svoc-core'],
    }),
    bs('[S My mother] [V works] [M {前| at a flower shop}].', {
      chunks: [
        ['My mother works', '母は働いています'],
        ['at a flower shop.', '花屋で'],
      ],
    }),
    bs('[S I] [V have] [O one brother, {同格>one brother| Taku}].', {
      chunks: [
        ['I have one brother,', 'わたしには弟が一人います'],
        ['Taku.', 'タクです'],
      ],
      notes: {
        'Taku.': 'コンマのあとの Taku は、one brother を名前で言いかえています。',
      },
    }),
    bs('[S He] [V is] [C ten years old], [接 and] [S he] [V likes] [O trains] [M very much].', {
      chunks: [
        ['He is ten years old,', '弟は10歳です'],
        ['and he likes trains', 'そして、弟は電車が好きです'],
        ['very much.', 'とても'],
      ],
    }),
    bs('[S He] [V has] [O many toy trains] [M {前| in his room}].', {
      chunks: [
        ['He has many toy trains', '弟はたくさんのおもちゃの電車を持っています'],
        ['in his room.', '自分の部屋に'],
      ],
      notes: {
        'He has many toy trains': 'many を目印に読み進めると、中心の名詞は trains です。toy は「おもちゃの」と trains を説明しています。',
      },
      rules: ['noun-boundary'],
    }),
    bs('[M Every Sunday], [S {並列| he | and my father}] [V watch] [O trains] [M {前| in our town}].', {
      chunks: [
        ['Every Sunday,', '毎週日曜日'],
        ['he and my father', '弟と父は'],
        ['watch trains', '電車を見ます'],
        ['in our town.', 'わたしたちの町で'],
      ],
      notes: {
        'Every Sunday,': 'every のついた時の語句は、前置詞なしで「いつ」を表します。',
      },
    }),
    bs('[S We] [M also] [V have] [O a dog].', {
      chunks: [
        ['We also have a dog.', 'わたしたちは犬も飼っています'],
      ],
    }),
    bs('[S It] [V is] [C {並列| white | and very cute}], [接 and] [S its name] [V is] [C Shiro].', {
      chunks: [
        ['It is white', 'その犬は白いです'],
        ['and very cute,', 'そしてとてもかわいいです'],
        ['and its name is Shiro.', 'そして、その名前はシロです'],
      ],
      notes: {
        'It is white': 'It は前の文の a dog を指します。単数の a dog を当てはめると意味が通ります。',
      },
      rules: ['reference-chain'],
    }),
    bs('[S I] [V walk] [O it] [M every morning].', {
      chunks: [
        ['I walk it', 'わたしはその犬を散歩させます'],
        ['every morning.', '毎朝'],
      ],
      notes: {
        'I walk it': 'walk の後ろに動物が来ると「〜を散歩させる」という意味になります。',
      },
    }),
  ]),
  br5_school_day: Object.freeze([
    bs('[S Ken] [V is] [C a student {前| at Minami Junior High School}].', {
      chunks: [
        ['Ken is a student', 'ケンは生徒です'],
        ['at Minami Junior High School.', '南中学校の'],
      ],
    }),
    bs('[M {前| On Monday}], [S he] [V gets up] [M {前| at six}].', {
      chunks: [
        ['On Monday,', '月曜日'],
        ['he gets up', 'ケンは起きます'],
        ['at six.', '6時に'],
      ],
      notes: {
        'he gets up': 'get up で「起きる」。up は動詞といっしょに一つの動詞として読みます。',
      },
    }),
    bs('[S He] [V eats] [O bread] [接 and] [V drinks] [O milk], [接 and then] [S he] [V walks] [M {前| to school}] [M {前| with his friend}].', {
      chunks: [
        ['He eats bread', 'ケンはパンを食べます'],
        ['and drinks milk,', 'そして牛乳を飲みます'],
        ['and then he walks', 'それからケンは歩いて行きます'],
        ['to school', '学校へ'],
        ['with his friend.', '友達といっしょに'],
      ],
      notes: {
        'and then he walks': 'eats・drinks・walks の三つが主語と組になる動詞です。and then のあとから二つ目の節が始まります。',
      },
      rules: ['finite-verb-check'],
    }),
    bs('[S His first class] [V is] [C English].', {
      chunks: [
        ['His first class is', 'ケンの1時間目の授業は〜です'],
        ['English.', '英語'],
      ],
    }),
    bs('[S The students {前| in his class}] [V sing] [O English songs] [接 and] [V play] [O games].', {
      chunks: [
        ['The students in his class', 'ケンのクラスの生徒たちは'],
        ['sing English songs', '英語の歌を歌います'],
        ['and play games.', 'そしてゲームをします'],
      ],
    }),
    bs('[S The boy {関係>The boy| [S who] [V sits] [M {前| next to Ken}]}] [V is] [M {前| from Canada}].', {
      chunks: [
        ['The boy', 'その男の子は'],
        ['who sits next to Ken', 'ケンの隣に座っている'],
        ['is from Canada.', 'カナダ出身です'],
      ],
      notes: {
        'who sits next to Ken': 'who から Ken までを（ ）に入れると、The boy … is from Canada という骨組みが残ります。',
      },
      rules: ['main-clause-skeleton', 'relative-clause'],
    }),
    bs('[S His name] [V is] [C Mike], [接 and] [S he] [V helps] [O Ken] [M {前| with English}].', {
      chunks: [
        ['His name is Mike,', 'その子の名前はマイクです'],
        ['and he helps Ken', 'そして、その子はケンを手伝います'],
        ['with English.', '英語のことで'],
      ],
      notes: {
        'and he helps Ken': 'help A with B で「AのBを手伝う」。he は前の文の The boy を指します。',
      },
    }),
    bs('[M {前| After school}], [S {並列| Ken | and Mike}] [V play] [O soccer].', {
      chunks: [
        ['After school,', '放課後'],
        ['Ken and Mike play soccer.', 'ケンとマイクはサッカーをします'],
      ],
    }),
    bs('[S They] [V are] [C tired], [接 but] [S they] [V are] [C happy].', {
      chunks: [
        ['They are tired,', '二人は疲れています'],
        ['but they are happy.', 'しかし、二人は楽しそうです'],
      ],
    }),
    bs('[S Ken] [V is] [C very sleepy] [M {前| at night}], [接 so] [S he] [V goes] [M {前| to bed}] [M early].', {
      chunks: [
        ['Ken is very sleepy', 'ケンはとても眠いです'],
        ['at night,', '夜には'],
        ['so he goes to bed', 'だから、ケンは寝ます'],
        ['early.', '早く'],
      ],
      notes: {
        'so he goes to bed': 'so の後ろは、前の「とても眠い」の結果です。',
      },
      rules: ['logic-connectors', 'cause-result'],
    }),
  ]),
  br5_big_game: Object.freeze([
    bs('[S Mika] [V is] [M {前| on the basketball team {前| at her school}}].', {
      chunks: [
        ['Mika is', 'ミカは入っています'],
        ['on the basketball team', 'バスケットボールのチームに'],
        ['at her school.', '学校の'],
      ],
      notes: {
        'on the basketball team': 'be on the team で「チームに入っている・チームの一員だ」という意味です。',
      },
    }),
    bs('[S She] [V is not] [C tall], [接 but] [S she] [V runs] [M very fast].', {
      chunks: [
        ['She is not tall,', 'ミカは背が高くありません'],
        ['but she runs very fast.', 'しかし、とても速く走ります'],
      ],
      notes: {
        'but she runs very fast.': 'but の前で「背が低い」という予想を立て、後ろの「速く走る」でくつがえします。書き手が重く見るのは but の後ろです。',
      },
      rules: ['contrast-concession'],
    }),
    bs('[M Last Saturday], [S her team] [V had] [O a big game {前| with the Higashi team}].', {
      chunks: [
        ['Last Saturday,', '先週の土曜日'],
        ['her team had a big game', 'ミカのチームは大事な試合をしました'],
        ['with the Higashi team.', '東チームと'],
      ],
    }),
    bs('[S The Higashi team] [V was] [C very strong].', {
      chunks: [
        ['The Higashi team was', '東チームは〜でした'],
        ['very strong.', 'とても強い'],
      ],
    }),
    bs('[M {前| In the first half}], [S Mika] [V was] [C afraid {前| of the strong team}], [接 so] [S she] [V could not run] [M well].', {
      chunks: [
        ['In the first half,', '前半に'],
        ['Mika was afraid', 'ミカはこわがっていました'],
        ['of the strong team,', '強いチームを'],
        ['so she could not run well.', 'だから、うまく走れませんでした'],
      ],
      notes: {
        'so she could not run well.': 'so の前が原因（こわかった）、後ろが結果（うまく走れなかった）です。',
      },
      rules: ['cause-result'],
    }),
    bs('[M Then] [S her teacher] [V said], [O {引用| "[V Run] [M fast] [接 and] [V have] [O fun]!"}]', {
      chunks: [
        ['Then her teacher said,', 'そのとき先生が言いました'],
        ['"Run fast', '速く走って'],
        ['and have fun!"', 'そして楽しんで'],
      ],
      notes: {
        '"Run fast': '主語のない動詞の原形で始まる命令文です。have fun は「楽しむ」。',
      },
    }),
    bs('[M {前| In the second half}], [S Mika] [V ran] [M very fast] [接 and] [V got] [O many points].', {
      chunks: [
        ['In the second half,', '後半に'],
        ['Mika ran very fast', 'ミカはとても速く走りました'],
        ['and got many points.', 'そしてたくさん点を取りました'],
      ],
    }),
    bs('[S She] [V had] [O fun] [M {前| with her team}].', {
      chunks: [
        ['She had fun', 'ミカは楽しみました'],
        ['with her team.', 'チームのみんなといっしょに'],
      ],
    }),
    bs('[S The Higashi team] [V got] [O more points], [接 but] [S Mika] [V was not] [C sad].', {
      chunks: [
        ['The Higashi team got more points,', '東チームのほうが多く点を取りました'],
        ['but Mika was not sad.', 'しかし、ミカは悲しくありませんでした'],
      ],
      notes: {
        'but Mika was not sad.': '負けたのに悲しくない、と食い違うように感じたら、前の文（先生の言葉・後半の活躍）を読み直します。',
      },
      rules: ['repair-monitor'],
    }),
  ]),
  br5_mr_sato: Object.freeze([
    bs('[S Mr. Sato, {同格>Mr. Sato| our English teacher},] [V likes] [O many things].', {
      chunks: [
        ['Mr. Sato,', '佐藤先生は'],
        ['our English teacher,', 'わたしたちの英語の先生である'],
        ['likes many things.', 'たくさんのことが好きです'],
      ],
      notes: {
        'our English teacher,': '二つのコンマにはさまれた補足で、Mr. Sato を言いかえています。外すと Mr. Sato likes many things. が残ります。',
      },
      rules: ['insertion'],
    }),
    bs('[S He] [V plays] [O the guitar], [V sings] [O songs], [接 and] [V paints] [O flowers].', {
      chunks: [
        ['He plays the guitar,', '先生はギターをひきます'],
        ['sings songs,', '歌を歌います'],
        ['and paints flowers.', 'そして花の絵をかきます'],
      ],
      notes: {
        'and paints flowers.': 'and の後ろの paints は動詞です。前にさかのぼると、同じ動詞の plays と sings が並んでいます。',
      },
      rules: ['parallel-shape', 'example-restatement'],
    }),
    bs('[M Sometimes] [S he] [V sings] [O English songs] [M {前| in our class}].', {
      chunks: [
        ['Sometimes', 'ときどき'],
        ['he sings English songs', '先生は英語の歌を歌います'],
        ['in our class.', 'わたしたちの授業で'],
      ],
    }),
    bs('[S He] [M also] [V likes] [O sports].', {
      chunks: [
        ['He also likes sports.', '先生はスポーツも好きです'],
      ],
    }),
    bs('[M {前| In winter}], [S he] [V skis] [M {前| with his son, {同格>his son| Yuta}}].', {
      chunks: [
        ['In winter,', '冬には'],
        ['he skis', '先生はスキーをします'],
        ['with his son, Yuta.', '息子のユウタさんといっしょに'],
      ],
    }),
    bs('[M {前| In summer}], [S he] [V swims] [M {前| in the sea}] [M every Sunday].', {
      chunks: [
        ['In summer,', '夏には'],
        ['he swims in the sea', '先生は海で泳ぎます'],
        ['every Sunday.', '毎週日曜日に'],
      ],
    }),
    bs('[S Mr. Sato] [V says], [O {引用| "[S I] [V am] [C busy], [接 but] [S I] [V have] [O fun] [M every day]."}]', {
      chunks: [
        ['Mr. Sato says,', '佐藤先生は言います'],
        ['"I am busy,', 'わたしは忙しいです'],
        ['but I have fun every day."', 'しかし、毎日が楽しいです'],
      ],
    }),
    bs('[S All the students {前| in our class}] [V like] [O him] [M very much].', {
      chunks: [
        ['All the students in our class', 'わたしたちのクラスの生徒はみんな'],
        ['like him very much.', '先生が大好きです'],
      ],
    }),
  ]),
  br5_curry: Object.freeze([
    bs('[S Emi] [V likes] [O {成句| curry and rice}] [M very much].', {
      chunks: [
        ['Emi likes curry and rice', 'エミはカレーライスが好きです'],
        ['very much.', 'とても'],
      ],
      notes: {
        'Emi likes curry and rice': 'curry and rice は「カレーライス」という一つの料理の名前です。',
      },
    }),
    bs('[S Her mother] [V makes] [O good curry].', {
      chunks: [
        ['Her mother makes good curry.', 'エミのお母さんはおいしいカレーを作ります'],
      ],
    }),
    bs('[M Last Sunday], [S Emi] [V wanted] [O {to:名詞| [V to make] [O curry] [M {前| for her family}]}].', {
      chunks: [
        ['Last Sunday,', '先週の日曜日'],
        ['Emi wanted to make curry', 'エミはカレーを作りたいと思いました'],
        ['for her family.', '家族のために'],
      ],
      notes: {
        'Emi wanted to make curry': 'want to do で「〜したい」。to make は wanted の目的語（〜すること）です。',
      },
    }),
    bs('[S She] [V went] [M {前| to a store}] [M {to:副詞(目的)| [V to buy] [O {並列| some carrots | and potatoes}]}].', {
      chunks: [
        ['She went to a store', 'エミは店へ行きました'],
        ['to buy', '買うために'],
        ['some carrots and potatoes.', 'にんじんとじゃがいもを'],
      ],
      notes: {
        'to buy': 'She went to a store で文が完成しているので、to buy は「買うために」と目的を表します。',
      },
      rules: ['infinitive-role'],
    }),
    bs('[S She] [V washed] [O them] [接 and] [V made] [O curry] [M {前| with her mother}].', {
      chunks: [
        ['She washed them', 'エミはそれらを洗いました'],
        ['and made curry', 'そしてカレーを作りました'],
        ['with her mother.', 'お母さんといっしょに'],
      ],
      notes: {
        'She washed them': 'them は前の文の carrots and potatoes を指します。',
      },
    }),
    bs('[S The curry {前| on the table}] [V looked] [C very good].', {
      chunks: [
        ['The curry', 'そのカレーは'],
        ['on the table', 'テーブルの上の'],
        ['looked very good.', 'とてもおいしそうに見えました'],
      ],
      notes: {
        'on the table': 'The curry を後ろから「テーブルの上の」と説明しています。',
        'looked very good.': 'look＋形容詞で「〜に見える」。very good は主語の様子を表す補語です。',
      },
      rules: ['postmodifier'],
    }),
    bs('[S The cake {前| for the family}] [V was made] [M {前| by her sister}].', {
      chunks: [
        ['The cake for the family', '家族のためのケーキは'],
        ['was made', '作られました'],
        ['by her sister.', 'エミのお姉さんによって'],
      ],
      notes: {
        'was made': 'be＋過去分詞の受け身です。by 以下を主語にすると「お姉さんがケーキを作った」となります。',
      },
      rules: ['passive-active'],
    }),
    bs('[S Her father] [V said], [O {引用| "[S This curry] [V is] [C great], [独 Emi]!"}]', {
      chunks: [
        ['Her father said,', 'お父さんは言いました'],
        ['"This curry is great,', 'このカレーはすばらしい'],
        ['Emi!"', 'エミ'],
      ],
      notes: {
        'Emi!"': '呼びかけのことばで、文の骨組みの外に置かれる独立語です。',
      },
    }),
    bs('[S Emi] [V was] [C very happy].', {
      chunks: [
        ['Emi was very happy.', 'エミはとてもうれしく思いました'],
      ],
    }),
  ]),
  br5_picnic_day: Object.freeze([
    bs('[独 Picnic Day {前| at Green Park}]', {
      fragment: true,
      chunks: [
        ['Picnic Day', 'ピクニックの日'],
        ['at Green Park', 'グリーン公園の'],
      ],
      notes: {
        'Picnic Day': '動詞のない見出しです。お知らせの題名から、何の案内かをつかみます。',
      },
      rules: ['purpose-first'],
    }),
    bs('[V Come] [M {前| to Green Park}] [接 and] [V have] [O fun] [M {前| with your family}]!', {
      chunks: [
        ['Come to Green Park', 'グリーン公園に来てください'],
        ['and have fun', 'そして楽しんでください'],
        ['with your family!', '家族といっしょに'],
      ],
      notes: {
        'Come to Green Park': '主語のない動詞の原形で始まる命令文で、来てほしいと呼びかけています。',
      },
    }),
    bs('[独 Day]: [独 Sunday, May 12]', {
      fragment: true,
      chunks: [
        ['Day:', '日にち'],
        ['Sunday, May 12', '5月12日の日曜日'],
      ],
      marks: [[':', '「日にち」という項目名のあとに、その中身（5月12日の日曜日）を示します。']],
    }),
    bs('[独 Time]: [独 10:00 {前| to 15:00}]', {
      fragment: true,
      chunks: [
        ['Time:', '時間'],
        ['10:00 to 15:00', '10時から15時まで'],
      ],
      marks: [
        [':', '「時間」という項目名のあとに、その中身（10時から15時まで）を示します。'],
        [':', '時刻の「時」と「分」を区切る記号で、10:00 は10時ちょうどです。'],
        [':', '時刻の「時」と「分」を区切る記号で、15:00 は15時ちょうどです。'],
      ],
    }),
    bs('[独 Where]: [独 Green Park, {前| by Minami Junior High School}]', {
      fragment: true,
      chunks: [
        ['Where:', '場所'],
        ['Green Park,', 'グリーン公園'],
        ['by Minami Junior High School', '南中学校のそばの'],
      ],
      marks: [[':', '「場所」という項目名のあとに、その中身（南中学校のそばのグリーン公園）を示します。']],
    }),
    bs('[S You] [V can play] [O games], [V sing] [O songs], [接 and] [V eat] [O many kinds {前| of food}].', {
      chunks: [
        ['You can play games,', 'ゲームをすることができます'],
        ['sing songs,', '歌を歌うこと'],
        ['and eat many kinds of food.', 'そしていろいろな食べ物を食べること'],
      ],
      notes: {
        'You can play games,': 'can が play・sing・eat の三つの動詞にかかります。できることの紹介なので、大まかに読んで先へ進みます。',
      },
      rules: ['reading-mode', 'parallel-shape'],
    }),
    bs('[M Please] [V take] [O {並列| your own cup | and dish}] [M {前| to the park}].', {
      chunks: [
        ['Please take', '持ってきてください'],
        ['your own cup and dish', '自分のコップとお皿を'],
        ['to the park.', '公園へ'],
      ],
      notes: {
        'Please take': 'Please＋動詞の原形で、ていねいにお願いする命令文です。持ち物をたずねる設問の根拠になる文です。',
      },
      rules: ['evidence-backtrack'],
    }),
    bs('[S {並列| Water | and tea}] [V are] [C free].', {
      chunks: [
        ['Water and tea are free.', '水とお茶は無料です'],
      ],
    }),
    bs('[M {副詞節:条件| [接 If] [S it] [V rains]}], [S we] [V will have] [O Picnic Day] [M {前| on Sunday, May 19}].', {
      chunks: [
        ['If it rains,', 'もし雨が降ったら'],
        ['we will have Picnic Day', 'ピクニックの日を行います'],
        ['on Sunday, May 19.', '5月19日の日曜日に'],
      ],
      notes: {
        'If it rains,': '条件を表す if の節は、設問の根拠になりやすいので、ペースを落として読みます。',
      },
      rules: ['reading-mode'],
    }),
  ]),
  br5_penguins: Object.freeze([
    bs('[S Penguins] [V are] [C birds], [接 but] [S they] [V cannot go] [M up] [M {前| into the sky}].', {
      chunks: [
        ['Penguins are birds,', 'ペンギンは鳥です'],
        ['but they cannot go up', 'しかし、上がることはできません'],
        ['into the sky.', '空へ'],
      ],
    }),
    bs('[S They] [V can swim] [M very well].', {
      chunks: [
        ['They can swim very well.', 'ペンギンはとても上手に泳げます'],
      ],
    }),
    bs('[M There] [V are] [S many kinds {前| of penguins}].', {
      chunks: [
        ['There are many kinds', 'たくさんの種類がいます'],
        ['of penguins.', 'ペンギンの'],
      ],
      notes: {
        'There are many kinds': 'There is / are の文は、are の後ろの名詞が主語です。段落の最初の文で、この段落の役割（種類の説明）を示します。',
      },
      rules: ['paragraph-map'],
    }),
    bs('[S Some penguins] [V are] [C very big], [接 and] [S some] [V are] [C small].', {
      chunks: [
        ['Some penguins are very big,', 'とても大きいペンギンもいます'],
        ['and some are small.', 'そして小さいのもいます'],
      ],
      notes: {
        'and some are small.': 'Some … and some … で「〜もいれば、…もいる」。後ろの some は some penguins のことです。',
      },
    }),
    bs('[S The biggest penguins] [V are] [C as tall {前| as a young child}].', {
      chunks: [
        ['The biggest penguins', 'いちばん大きいペンギンは'],
        ['are as tall as a young child.', '小さな子どもと同じくらいの背の高さです'],
      ],
    }),
    bs('[S Penguins] [V eat] [O fish] [M {前| in the sea}].', {
      chunks: [
        ['Penguins eat fish', 'ペンギンは魚を食べます'],
        ['in the sea.', '海で'],
      ],
    }),
    bs('[S They] [M also] [V eat] [O shrimp, {同格>shrimp| small sea animals {前| with many legs}}].', {
      chunks: [
        ['They also eat shrimp,', 'ペンギンはシュリンプも食べます'],
        ['small sea animals', 'つまり小さな海の生き物で'],
        ['with many legs.', '足がたくさんある'],
      ],
      notes: {
        'small sea animals': 'コンマのあとが shrimp の言いかえです。知らない語は、この言いかえから意味を推測します。',
      },
      rules: ['unknown-word-context'],
    }),
    bs('[S Some penguins] [V can swim] [M as fast {前| as a car {前| in a town}}].', {
      chunks: [
        ['Some penguins can swim', '泳げるペンギンもいます'],
        ['as fast as a car', '車と同じくらい速く'],
        ['in a town.', '町の中を走る'],
      ],
      notes: {
        'as fast as a car': 'as … as で同じくらいを表します。比べているのはペンギンと車で、比べる点は速さです。',
      },
      rules: ['comparison-pairs'],
    }),
  ]),
  br5_winter: Object.freeze([
    bs('[V Do] [S you] [V like] [O {並列| summer | or winter}]?', {
      chunks: [
        ['Do you like', 'あなたは好きですか'],
        ['summer or winter?', '夏と冬のどちらが'],
      ],
    }),
    bs('[S Many students {前| in my class}] [V like] [O summer].', {
      chunks: [
        ['Many students in my class', 'わたしのクラスの多くの生徒は'],
        ['like summer.', '夏が好きです'],
      ],
    }),
    bs('[S They] [V say], [O {引用| "[S We] [V can swim] [M {前| in the sea}] [接 and] [V eat] [O ice cream]."}]', {
      chunks: [
        ['They say,', 'その生徒たちは言います'],
        ['"We can swim in the sea', 'わたしたちは海で泳げる'],
        ['and eat ice cream."', 'そしてアイスクリームも食べられる'],
      ],
      notes: {
        'They say,': 'They say で始まる部分は、ほかの人の意見です。筆者の意見と分けて読みます。',
      },
      rules: ['author-stance'],
    }),
    bs('[接 But] [S I] [V like] [O winter].', {
      chunks: [
        ['But I like winter.', 'でも、わたしは冬が好きです'],
      ],
      notes: {
        'But I like winter.': 'ほかの人の意見のあとの But から、筆者自身の違う意見が始まると予測できます。',
      },
      rules: ['genre-prediction', 'contrast-concession'],
    }),
    bs('[S I] [V think] [O {that省略| [S winter] [V is] [C wonderful]}].', {
      chunks: [
        ['I think', 'わたしは思います'],
        ['winter is wonderful.', '冬はすばらしいと'],
      ],
      notes: {
        'I think': 'I think は筆者自身の意見を表す合図です。後ろに that が省略されています。',
      },
      rules: ['author-stance'],
    }),
    bs('[S I] [V can ski] [M {前| with my family}], [接 and] [S I] [V can drink] [O hot tea] [M {前| in my warm room}].', {
      chunks: [
        ['I can ski', 'わたしはスキーができます'],
        ['with my family,', '家族といっしょに'],
        ['and I can drink hot tea', 'そして熱いお茶を飲めます'],
        ['in my warm room.', '暖かい部屋で'],
      ],
    }),
    bs('[S Snow] [V is] [C beautiful], [M too].', {
      chunks: [
        ['Snow is beautiful, too.', '雪も美しいです'],
      ],
    }),
    bs('[S Some {前| of my friends}] [V say] [O {that省略| [S winter] [V is] [C too cold]}].', {
      chunks: [
        ['Some of my friends say', 'わたしの友達の中には言う人もいます'],
        ['winter is too cold.', '冬は寒すぎると'],
      ],
      notes: {
        'Some of my friends say': 'Some of は「〜の中の何人か」。全員ではないので、選択肢で All などに強められていないかを比べます。',
      },
      rules: ['distractor-strength', 'author-stance'],
    }),
    bs('[S That] [V is] [C true], [接 but] [S {並列| a warm sweater | and gloves}] [V can help] [O you].', {
      chunks: [
        ['That is true,', 'それは本当です'],
        ['but a warm sweater and gloves', 'しかし、暖かいセーターと手ぶくろが'],
        ['can help you.', 'あなたを助けてくれます'],
      ],
      notes: {
        'That is true,': 'That は前の文の「冬は寒すぎる」という内容を指します。',
      },
    }),
    bs('[接 So] [S I] [V think] [O {that省略| [S winter] [V is] [C the best]}]!', {
      chunks: [
        ['So I think', 'だから、わたしは思います'],
        ['winter is the best!', '冬がいちばんだと'],
      ],
    }),
  ]),
  br5_big_sale: Object.freeze([
    bs('[S Our big sale] [V is] [M {前| from Friday} {前| to Sunday}]!', {
      chunks: [
        ['Our big sale is', 'わたしたちの大売り出しは'],
        ['from Friday to Sunday!', '金曜日から日曜日までです'],
      ],
    }),
    bs('[M There] [V are] [S three kinds {前| of things} {前| on sale}: {同格>three kinds of things| {並列| shoes, | bags, | and hats}}].', {
      chunks: [
        ['There are three kinds', '三つの種類があります'],
        ['of things on sale:', '売り出しの品物には'],
        ['shoes, bags, and hats.', 'くつ・かばん・ぼうしです'],
      ],
      marks: [[':', '前の「売り出しの品物は三種類」の中身（くつ・かばん・ぼうし）を具体的に挙げます。']],
      rules: ['punctuation-map'],
    }),
    bs('[M Not] [S all the shoes] [V are] [M {前| on sale}].', {
      chunks: [
        ['Not all the shoes', 'すべてのくつが〜というわけではありません'],
        ['are on sale.', '売り出しになっている'],
      ],
      notes: {
        'Not all the shoes': 'Not all は「すべてが〜というわけではない」という部分否定です。くつが一つも売り出しでないのではありません。',
      },
      rules: ['negation-scope'],
    }),
    bs('[S Only the shoes {前| for children}] [V are] [M {前| on sale}].', {
      chunks: [
        ['Only the shoes for children', '子ども用のくつだけが'],
        ['are on sale.', '売り出しになっています'],
      ],
    }),
    bs('[S All the bags] [V are] [C ten dollars].', {
      chunks: [
        ['All the bags are ten dollars.', 'かばんはどれも10ドルです'],
      ],
    }),
    bs('[V Do] [S you] [V need] [O help]?', {
      chunks: [
        ['Do you need help?', 'お手伝いが必要ですか'],
      ],
    }),
    bs('[S The girl {現在分詞>The girl| [V standing] [M {前| at the front door}]}] [V can help] [O you].', {
      chunks: [
        ['The girl', 'その女の子が'],
        ['standing at the front door', '正面のドアのところに立っている'],
        ['can help you.', 'あなたを手伝うことができます'],
      ],
      notes: {
        'standing at the front door': 'standing の前に be 動詞がないので進行形ではなく、The girl を後ろから説明する分詞です。',
      },
      rules: ['ing-ed-role', 'postmodifier'],
    }),
    bs('[S We] [V are] [C open] [M {前| from ten} {前| to eight}].', {
      chunks: [
        ['We are open', 'わたしたちの店は開いています'],
        ['from ten to eight.', '10時から8時まで'],
      ],
    }),
    bs('[V Come] [接 and] [V see] [O us]!', {
      chunks: [
        ['Come and see us!', 'ぜひお越しください'],
      ],
      notes: {
        'Come and see us!': 'come and see で「会いに来る・見に来る」。お店が来店を呼びかける決まった言い方です。',
      },
    }),
  ]),
  br5_card_for_lisa: Object.freeze([
    bs('[独 Dear Lisa],', {
      fragment: true,
      chunks: [
        ['Dear Lisa,', 'リサへ'],
      ],
      notes: {
        'Dear Lisa,': '手紙の書き出しのことばで、動詞のない呼びかけです。',
      },
      rules: ['purpose-first'],
    }),
    bs('[V Thank] [O you] [M {前| for the nice card}].', {
      chunks: [
        ['Thank you', 'ありがとう'],
        ['for the nice card.', 'すてきなカードを'],
      ],
      notes: {
        'for the nice card.': 'thank you for … で「〜をありがとう」。for の後ろがお礼の理由です。',
      },
    }),
    bs('[S I] [V know] [O {that節| [接 that] [S you] [V are] [C busy {前| with school}]}].', {
      chunks: [
        ['I know', 'わたしは知っています'],
        ['that you are busy', 'あなたが忙しいということを'],
        ['with school.', '学校で'],
      ],
      notes: {
        'that you are busy': 'that の後ろが主語と動詞のそろった文なので、「〜ということ」という名詞節で、know の目的語です。',
      },
      rules: ['that-diagnosis'],
    }),
    bs('[M Next Saturday], [S I] [V will have] [O a party] [M {前| at my house}].', {
      chunks: [
        ['Next Saturday,', '次の土曜日'],
        ['I will have a party', 'わたしはパーティーをします'],
        ['at my house.', 'わたしの家で'],
      ],
    }),
    bs('[M Please] [V come] [M {前| with the friend {関係>the friend| [S who] [V plays] [O the violin]}}].', {
      chunks: [
        ['Please come', '来てください'],
        ['with the friend', 'お友達といっしょに'],
        ['who plays the violin.', 'バイオリンをひく'],
      ],
      notes: {
        'who plays the violin.': 'who の直前の the friend が先行詞です。節の中で主語が欠けていて、その主語が the friend です。',
      },
      rules: ['relative-clause'],
    }),
    bs('[S My mother] [V will make] [O {並列| a big cake | and some sandwiches}].', {
      chunks: [
        ['My mother will make', '母は作ります'],
        ['a big cake and some sandwiches.', '大きなケーキとサンドイッチを'],
      ],
    }),
    bs('[S I] [V do not know] [O {what節| [O what] [S you] [V like]}], [接 so] [M please] [V tell] [O me].', {
      chunks: [
        ['I do not know', 'わたしは知りません'],
        ['what you like,', 'あなたが何を好きか'],
        ['so please tell me.', 'だから教えてください'],
      ],
      notes: {
        'what you like,': 'what から like までがひとかたまりの名詞で、know の目的語です。中は you like のふつうの語順です。',
      },
      rules: ['wh-clause'],
    }),
    bs('[V See] [O you] [M soon].', {
      chunks: [
        ['See you soon.', 'また近いうちに会いましょう'],
      ],
      notes: {
        'See you soon.': '手紙や会話の終わりのあいさつで、主語の I will を省いた決まった言い方です。',
      },
    }),
    bs('[独 Your friend, Yui]', {
      fragment: true,
      chunks: [
        ['Your friend, Yui', 'あなたの友達、ユイより'],
      ],
      notes: {
        'Your friend, Yui': '手紙の結びで、書いた人の名前を示します。動詞のない語句です。',
      },
    }),
  ]),
})
