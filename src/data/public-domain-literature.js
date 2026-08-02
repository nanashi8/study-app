// 著作権保護期間が満了した原文を、短い場面ごとに原文→訳で味わう朗読教材。
//
// original は出典に照らした原文、speech は古文を端末音声で読みやすくするための
// 読み仮名、translation / guide は本アプリ独自の現代語訳・読解案内。
// 既存の長文・古典IDとは別名前空間にして、保存済み進捗との衝突を避ける。

import { LITERATURE_NARRATION_SEGMENTS } from './literature-narration-segments.js'

const scene = (original, translation, guide, speech = null) =>
  Object.freeze({ original, translation, guide, speech })

const source = (label, url, checkedOn) => Object.freeze({ label, url, checkedOn })

const englishRights = (authorYears, firstPublished) =>
  Object.freeze({
    status: 'パブリックドメイン',
    basis: `作者 ${authorYears}。初出 ${firstPublished}。日本の原則的な死後70年を満了し、Project Gutenbergで米国のパブリックドメイン表示も確認。`,
    translation: '和訳・場面解説は本アプリ独自。音声は端末の合成音声を使用。',
  })

const classicalRights = (period) =>
  Object.freeze({
    status: 'パブリックドメイン',
    basis: `${period}の作品で、作者の没後70年を大きく超えている原文を使用。`,
    translation: '現代語訳・読み仮名・場面解説は本アプリ独自。音声は端末の合成音声を使用。',
  })

const kanbunRights = (period) =>
  Object.freeze({
    status: 'パブリックドメイン',
    basis: `${period}の作品で、作者・編者の没後70年を大きく超えている原文を使用。`,
    translation: '書き下し文・現代語訳・場面解説は本アプリ独自。音声は端末の合成音声を使用。',
  })

export const LITERATURE_KIND_META = Object.freeze({
  english: {
    id: 'english',
    label: '英語名作',
    shortLabel: '英語',
    description: '英語 → 対応する日本語',
    emoji: '📘',
    color: '#2563eb',
  },
  classical: {
    id: 'classical',
    label: '日本古典',
    shortLabel: '古典',
    description: '古文 → 区切り現代語訳',
    emoji: '📜',
    color: '#b45309',
  },
  kanbun: {
    id: 'kanbun',
    label: '漢文名作',
    shortLabel: '漢文',
    description: '漢文（書き下し） → 区切り現代語訳',
    emoji: '🏮',
    color: '#be123c',
  },
})

const BASE_PUBLIC_DOMAIN_LITERATURE = Object.freeze([
  Object.freeze({
    id: 'lit_en_alice_rabbit_hole',
    kind: 'english',
    language: 'en-US',
    level: '英検3級〜準2級',
    title: "Alice's Adventures in Wonderland",
    titleJa: '不思議の国のアリス',
    author: 'Lewis Carroll',
    authorJa: 'ルイス・キャロル',
    authorYears: '1832–1898',
    excerpt: 'Chapter I: Down the Rabbit-Hole 冒頭',
    emoji: '🐇',
    blurb: '退屈な午後、時計を持つ白ウサギが日常の景色を一変させる場面。',
    focus: '長い一文の流れと、アリスの好奇心を追う',
    wordIds: [
      'bank',
      'conversation',
      'rabbit',
      'field',
      'remarkable',
      'curiosity',
      'pocket',
      'natural',
    ],
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1832–1898', '1865年'),
    source: source(
      'Project Gutenberg eBook #11',
      'https://www.gutenberg.org/ebooks/11',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        'Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do.',
        'アリスは、川岸でお姉さんのそばに座り、何もすることがないのに、だんだんうんざりしてきました。',
        'begin to は「し始める」。of sitting と of having が並び、退屈の理由を二つ重ねています。',
      ),
      scene(
        'Once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it.',
        '一度か二度、お姉さんが読んでいる本をのぞいてみましたが、その本には絵も会話もありませんでした。',
        'had peeped は、その時までに「ちらっとのぞいてみた」ことを表します。',
      ),
      scene(
        '“And what is the use of a book,” thought Alice, “without pictures or conversations?”',
        '「絵も会話もない本なんて、いったい何の役に立つの？」とアリスは思いました。',
        'What is the use of ...? は「…が何の役に立つのか」という不満をこめた問いです。',
      ),
      scene(
        'There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!”',
        'それだけなら、たいして不思議ではありません。ウサギが「たいへんだ、遅れちゃう！」と独り言を言っても、アリスはそれほど変だとは思いませんでした。',
        'nor did Alice think ... は否定を前に出した倒置。「アリスも…とは思わなかった」とつなぎます。',
      ),
      scene(
        'But when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet.',
        'けれども、そのウサギが本当にチョッキのポケットから時計を取り出し、時刻を見て、急いで行ってしまうと、アリスはぱっと立ち上がりました。',
        'took, looked, hurried と動作が連続し、started to her feet で場面が一気に動きます。',
      ),
      scene(
        'Burning with curiosity, she ran across the field after it, and was just in time to see it pop down a large rabbit-hole under the hedge.',
        '好奇心でいっぱいになったアリスは、ウサギを追って野原を走り、ちょうど生け垣の下の大きな穴へ飛び込むところを目にしました。',
        'Burning with curiosity は「好奇心に燃えて」。was just in time to は「ちょうど間に合って…した」です。',
      ),
      scene(
        'In another moment down went Alice after it, never once considering how in the world she was to get out again.',
        '次の瞬間、アリスもそのあとを追って穴の中へ。どうやって外へ戻るのかなど、一度も考えませんでした。',
        'down went Alice は語順を入れ替え、落下の勢いを先に聞かせる表現です。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_en_happy_prince_statue',
    kind: 'english',
    language: 'en-US',
    level: '英検準2級〜2級',
    title: 'The Happy Prince',
    titleJa: '幸福な王子',
    author: 'Oscar Wilde',
    authorJa: 'オスカー・ワイルド',
    authorYears: '1854–1900',
    excerpt: '物語冒頭・黄金の像',
    emoji: '👑',
    blurb: '町を見下ろす美しい王子の像を、人々がそれぞれの価値観で語る場面。',
    focus: '描写と会話から、見た目と本当の価値のずれを読む',
    wordIds: [
      'column',
      'statue',
      'prince',
      'admire',
      'reputation',
      'sensible',
      'practical',
      'dream',
    ],
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1854–1900', '1888年'),
    source: source(
      'Project Gutenberg eBook #902',
      'https://www.gutenberg.org/ebooks/902',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        'High above the city, on a tall column, stood the statue of the Happy Prince.',
        '町のはるか高いところ、背の高い柱の上に、幸福な王子の像が立っていました。',
        '場所を先に置いた倒置で、読者の視線を町から高い柱へ持ち上げています。',
      ),
      scene(
        'He was gilded all over with thin leaves of fine gold, for eyes he had two bright sapphires, and a large red ruby glowed on his sword-hilt.',
        '像の全身は薄い純金の葉でおおわれ、両目には明るく輝く二つのサファイア、剣の柄には大きな赤いルビーが光っていました。',
        '三つの装飾を順に並べ、王子がどれほど豪華に見えるかを映像のように描きます。',
      ),
      scene(
        'He was very much admired indeed.',
        '王子の像は、ほんとうに大勢の人からほめたたえられていました。',
        'was admired は受け身。「人々が像を称賛した」を像の側から描いています。',
      ),
      scene(
        '“He is as beautiful as a weathercock,” remarked one of the Town Councillors who wished to gain a reputation for having artistic tastes.',
        '「風見鶏と同じくらい美しい」と、芸術の趣味があると思われたがっている町会議員の一人が評しました。',
        'who wished ... は議員を説明し、ほめ言葉の裏にある見栄まで見せています。',
      ),
      scene(
        '“Only not quite so useful,” he added, fearing lest people should think him unpractical.',
        '「ただし、風見鶏ほど役には立たないがね」と彼は付け足しました。自分が現実離れした人間だと思われるのを恐れたのです。',
        'lest ... should は「…するといけないので」。発言よりも世間の評価を気にしています。',
      ),
      scene(
        '“Why can’t you be like the Happy Prince?” asked a sensible mother of her little boy who was crying for the moon.',
        '「どうして幸福な王子のようにできないの？」と、月が欲しいと泣く幼い息子に、分別のある母親が尋ねました。',
        'cry for the moon は、文字どおりの場面と「手に入らない物を望む」という響きを重ねます。',
      ),
      scene(
        '“The Happy Prince never dreams of crying for anything.”',
        '「幸福な王子は、何かを欲しがって泣こうなんて、夢にも思わないのよ。」',
        'never dreams of ... は「…など夢にも思わない」。母親は像の外見だけを見ています。',
      ),
      scene(
        '“I am glad there is some one in the world who is quite happy,” muttered a disappointed man as he gazed at the wonderful statue.',
        '「この世界に、心から幸せな者が一人でもいるのはうれしいことだ」と、失望した男が見事な像を眺めながらつぶやきました。',
        '読者はまだ王子の心を知りません。題名と外見だけで「幸福だ」と決める人々の見方が重なっていきます。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_en_gift_of_magi_opening',
    kind: 'english',
    language: 'en-US',
    level: '英検2級〜準1級',
    title: 'The Gift of the Magi',
    titleJa: '賢者の贈り物',
    author: 'O. Henry',
    authorJa: 'O・ヘンリー',
    authorYears: '1862–1910',
    excerpt: '物語冒頭・1ドル87セント',
    emoji: '🎁',
    blurb: 'クリスマス前日、デラが手元の小銭を数える印象的な導入。',
    focus: '短文の反復とユーモアから、貧しさと愛情を感じ取る',
    wordIds: [
      'dollar',
      'save',
      'vegetable',
      'cheek',
      'silent',
      'deal',
      'shabby',
      'moral',
      'sob',
      'gradually',
    ],
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1862–1910', '1905年'),
    source: source(
      'Project Gutenberg eBook #7256',
      'https://www.gutenberg.org/ebooks/7256',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        'One dollar and eighty-seven cents. That was all.',
        '1ドル87セント。それが、すべてでした。',
        '極端に短い二文で金額を刻み、デラの切迫した状況を最初に突きつけます。',
      ),
      scene(
        'And sixty cents of it was in pennies.',
        'しかも、そのうち60セントは、1セント硬貨でたまったものでした。',
        'And を文頭に置き、「そのうえ小銭ばかり」という苦しさを重ねています。',
      ),
      scene(
        'Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher until one’s cheeks burned with the silent imputation of parsimony that such close dealing implied.',
        '食料品店や八百屋や肉屋で、一度に1セント、2セントと値切って貯めた小銭です。そんな細かな値切りが「けちだ」と無言で責めているようで、頬が熱くなるほどでした。',
        '長い一文は「どう貯めたか」から「その時の恥ずかしさ」へ進みます。parsimony は行き過ぎた倹約です。',
      ),
      scene(
        'Three times Della counted it. One dollar and eighty-seven cents. And the next day would be Christmas.',
        'デラは三度、そのお金を数えました。1ドル87セント。そして翌日はクリスマスでした。',
        '金額の反復のあとに Christmas を置き、贈り物を買いたい気持ちとの落差を強めています。',
      ),
      scene(
        'There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it.',
        'できることといえば、みすぼらしい小さな長椅子に倒れ込み、声をあげて泣くことだけでした。だからデラは、そうしました。',
        'nothing to do but ... は「…するほかない」。So Della did it. の短さに語り手のユーモアがあります。',
      ),
      scene(
        'Which instigates the moral reflection that life is made up of sobs, sniffles, and smiles, with sniffles predominating.',
        'ここで、人生はむせび泣きと鼻をすする音と笑顔からできていて、その中では鼻をすする音がいちばん多い、という教訓めいた考えが浮かびます。',
        'sobs, sniffles, smiles の頭韻を生かした語り。深刻さの中へ、少しおかしみを差し込みます。',
      ),
      scene(
        'While the mistress of the home is gradually subsiding from the first stage to the second, take a look at the home.',
        '家の女主人が、激しく泣く第一段階から鼻をすする第二段階へ少しずつ落ち着くあいだに、その住まいを見てみましょう。',
        '語り手が読者へ直接呼びかけ、泣くデラから部屋の描写へカメラを切り替えます。',
      ),
      scene(
        'A furnished flat at $8 per week.',
        '家具付きで、週8ドルのアパートでした。',
        '動詞を省いた一文が、部屋の簡素さと生活の厳しさを端的に示します。',
        'A furnished flat at eight dollars per week.',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_ja_makura_seasons',
    kind: 'classical',
    language: 'ja-JP',
    level: '古典・基礎',
    title: '枕草子',
    titleJa: '第一段「春はあけぼの」',
    author: '清少納言',
    authorJa: '清少納言',
    authorYears: '10世紀末〜11世紀初頭',
    excerpt: '第一段・四季の美',
    emoji: '🌅',
    blurb: '春夏秋冬の「いちばん心ひかれる時」を、光・音・動きで描く名文。',
    focus: '四季ごとの時間帯と、をかし・あはれの違いを味わう',
    wordIds: [],
    kotenWordIds: ['k272', 'k002', 'k001', 'k090', 'k026'],
    grammarIds: ['kg_adjective', 'kg_perfect_tari', 'kg_conj_te'],
    rights: classicalRights('平安時代'),
    source: source(
      'Wikisource「枕草子 第一段」',
      'https://ja.wikisource.org/wiki/枕草子_(Wikisource)/第一段',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        '春はあけぼの。やうやう白くなりゆく山ぎは、少し明りて、紫だちたる雲の細くたなびきたる。',
        '春は明け方がよい。空がだんだん白くなり、山の稜線が少し明るくなって、紫がかった雲が細くたなびいている景色が趣深い。',
        '「やうやう」で、闇から光へゆっくり変わる時間そのものを描いています。',
        'はるはあけぼの。ようようしろくなりゆくやまぎわ、すこしあかりて、むらさきだちたるくものほそくたなびきたる。',
      ),
      scene(
        '夏は夜。月の頃はさらなり。闇もなほ、蛍の多く飛び違ひたる。また、ただ一つ二つなど、ほのかにうち光りて行くもをかし。雨など降るもをかし。',
        '夏は夜がよい。月の明るい頃はもちろん、暗い夜でも蛍がたくさん飛び交うのがよい。また、ほんの一匹、二匹がかすかに光って飛んでいくのも趣がある。雨が降る夜も趣深い。',
        '明るい月夜だけでなく、闇・少数の蛍・雨まで「をかし」と見つける観察の細かさが魅力です。',
        'なつはよる。つきのころはさらなり。やみもなお、ほたるのおおくとびちがいたる。また、ただひとつふたつなど、ほのかにうちひかりてゆくもおかし。あめなどふるもおかし。',
      ),
      scene(
        '秋は夕暮れ。夕日のさして、山の端いと近うなりたるに、烏の寝どころへ行くとて、三つ四つ、二つ三つなど、飛び急ぐさへあはれなり。',
        '秋は夕暮れがよい。夕日が差し、太陽が山の端へたいそう近づいた頃、烏がねぐらへ帰ろうとして、三羽四羽、二羽三羽と急いで飛ぶ姿まで、しみじみと心にしみる。',
        '「さへ」は「そのうえ…まで」。小さな烏の動きに、暮れていく一日の寂しさを重ねます。',
        'あきはゆうぐれ。ゆうひのさして、やまのはいとちこうなりたるに、からすのねどころへゆくとて、みつよつ、ふたつみつなど、とびいそぐさえあわれなり。',
      ),
      scene(
        'まいて雁などの列ねたるが、いと小さく見ゆるは、いとをかし。日入り果てて、風の音、虫の音など、はた言ふべきにあらず。',
        'まして、雁などが列を作って飛び、それがとても小さく見えるのは、たいそう趣深い。日がすっかり沈んだあとの風の音や虫の音などは、言うまでもなくすばらしい。',
        '視覚の「小さく見える」から、日没後の風と虫の音へ感覚を切り替えています。',
        'まいてかりなどのつらねたるが、いとちいさくみゆるは、いとおかし。ひいりはてて、かぜのおと、むしのねなど、はたいうべきにあらず。',
      ),
      scene(
        '冬はつとめて。雪の降りたるは言ふべきにもあらず。霜のいと白きも、またさらでも、いと寒きに、火など急ぎ熾して、炭もて渡るも、いとつきづきし。',
        '冬は早朝がよい。雪が降った朝は言うまでもない。霜が真っ白な朝も、そうでなくても、たいそう寒い中で急いで火をおこし、炭を運んでいく様子も、冬の朝によく似つかわしい。',
        '自然の美だけでなく、寒さの中で働く人の動きまで季節の景色に入れています。',
        'ふゆはつとめて。ゆきのふりたるはいうべきにもあらず。しものいとしろきも、またさらでも、いとさむきに、ひなどいそぎおこして、すみもてわたるも、いとつきづきし。',
      ),
      scene(
        '昼になりて、ぬるくゆるびもていけば、火桶の火も、白き灰がちになりて、わろし。',
        '昼になって寒さがゆるみ、暖かくなっていくと、火鉢の火も白い灰ばかりになって、見栄えがよくない。',
        '最後を「わろし」ときっぱり結び、早朝の張りつめた美しさとの対比を作ります。',
        'ひるになりて、ぬるくゆるびもていけば、ひおけのひも、しろきはいがちになりて、わろし。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_ja_tsurezure_ishimizu',
    kind: 'classical',
    language: 'ja-JP',
    level: '古典・標準',
    title: '徒然草',
    titleJa: '第五十二段「仁和寺にある法師」',
    author: '兼好法師',
    authorJa: '兼好法師',
    authorYears: '1283頃–1352頃',
    excerpt: '石清水参詣の失敗談',
    emoji: '⛩️',
    blurb: '念願の参詣を果たしたつもりで、肝心の本殿を見ずに帰った法師の話。',
    focus: '行動の順序と、最後の教訓「先達」の意味をつかむ',
    wordIds: [],
    kotenWordIds: ['k007', 'k171', 'k043', 'k106'],
    grammarIds: [
      'kg_neg_zu',
      'kg_past_keri',
      'kg_perfect_nu',
      'kg_kakari_koso',
      'kg_past_kemu',
    ],
    rights: classicalRights('鎌倉時代末〜南北朝時代'),
    source: source(
      'Wikisource「徒然草（國文大觀）」第五十二段',
      'https://ja.wikisource.org/wiki/徒然草_(國文大觀)',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        '仁和寺にある法師、年寄るまで石清水を拝まざりければ、心うく覚えて、ある時思ひ立ちて、ただ一人、徒歩より詣でけり。',
        '仁和寺にいた、ある法師は、年を取るまで石清水八幡宮へ参拝したことがなかったので、残念に思い、ある時決心して、たった一人で歩いて参詣しました。',
        '「拝まざりければ」は、打消「ず」＋過去「けり」＋理由の「ば」。参詣の動機を示します。',
        'にんなじにあるほうし、としよるまでいわしみずをおがまざりければ、こころうくおぼえて、あるときおもいたちて、ただひとり、かちよりもうでけり。',
      ),
      scene(
        '極楽寺・高良などを拝みて、かばかりと心得て帰りにけり。',
        '法師は、ふもとの極楽寺や高良神社などを拝み、「石清水八幡宮はこれだけなのだ」と思い込んで、帰ってしまいました。',
        '「かばかり」は「これほど・これだけ」。ここで早くも勘違いが起きています。',
        'ごくらくじ、こうらなどをおがみて、かばかりとこころえて、かえりにけり。',
      ),
      scene(
        'さて、かたへの人にあひて、「年ごろ思ひつること、果たし侍りぬ。聞きしにも過ぎて、尊くこそおはしけれ。」',
        'そして仲間に会い、「長年願っていたことを果たしました。うわさに聞いていた以上に、ほんとうに尊い所でしたよ」と話しました。',
        '「こそ…おはしけれ」は係り結び。「こそ」が強意となり、結びが已然形になります。',
        'さて、かたえのひとにあいて、としごろおもいつること、はたしはべりぬ。ききしにもすぎて、とうとくこそおわしけれ。',
      ),
      scene(
        '「そも、参りたる人ごとに山へ登りしは、何事かありけむ。ゆかしかりしかど、神へ参るこそ本意なれと思ひて、山までは見ず」とぞ言ひける。',
        '「それにしても、参拝した人がみな山へ登っていったのは、何があったのでしょう。知りたかったのですが、神様へ参ることこそ目的だと思って、山の上までは見ませんでした」と言いました。',
        '本殿はその山の上でした。「何事かありけむ」は、過去の理由を推量して「何があったのだろう」。',
        'そも、まいりたるひとごとにやまへのぼりしは、なにごとかありけん。ゆかしかりしかど、かみへまいるこそほいなれとおもいて、やままではみず、とぞいいける。',
      ),
      scene(
        '少しのことにも、先達はあらまほしきことなり。',
        'どんな小さなことにも、その道を知る案内役はいてほしいものです。',
        '失敗談を一文の教訓へ変える結び。「先達」は、経験があり人を導く人です。',
        'すこしのことにも、せんだつはあらまほしきことなり。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_ja_hojoki_flow',
    kind: 'classical',
    language: 'ja-JP',
    level: '古典・発展',
    title: '方丈記',
    titleJa: '冒頭「ゆく河の流れ」',
    author: '鴨長明',
    authorJa: '鴨長明',
    authorYears: '1155頃–1216',
    excerpt: '冒頭・無常のたとえ',
    emoji: '🌊',
    blurb: '流れ続ける川と消えては生まれる泡から、人と住まいの無常を考える冒頭。',
    focus: '比喩の対応を一つずつ確かめ、無常観を言葉で説明する',
    wordIds: [],
    kotenWordIds: ['k098', 'k099', 'k237', 'k089', 'k091'],
    grammarIds: [
      'kg_neg_zu',
      'kg_conj_te',
      'kg_comparison_gotoshi',
      'kg_assertion_nari',
      'kg_perfect_tari',
    ],
    rights: classicalRights('鎌倉時代・1212年成立'),
    source: source(
      'Wikisource「方丈記（國文大觀）」',
      'https://ja.wikisource.org/wiki/方丈記_(國文大觀)',
      '2026-07-29',
    ),
    scenes: Object.freeze([
      scene(
        'ゆく河の流れは絶えずして、しかももとの水にあらず。',
        '流れていく川の流れは絶えることがない。それなのに、そこを流れる水は、もとの同じ水ではない。',
        '変わらず続く「流れ」と、絶えず入れ替わる「水」を対比しています。',
        'ゆくかわのながれはたえずして、しかももとのみずにあらず。',
      ),
      scene(
        '淀みに浮かぶうたかたは、かつ消えかつ結びて、久しくとどまりたるためしなし。',
        '川の淀みに浮かぶ泡は、一方で消え、一方で生まれ、長く同じ姿のままとどまった例はない。',
        '「かつ…かつ…」は二つの動きが同時に進む表現。消滅と誕生を繰り返します。',
        'よどみにうかぶうたかたは、かつきえかつむすびて、ひさしくとどまりたるためしなし。',
      ),
      scene(
        '世の中にある人と栖と、またかくのごとし。',
        'この世に生きる人と、その人の住まいも、また川の水や泡と同じです。',
        'ここで比喩の答えが示されます。水や泡が「人と住まい」に対応します。',
        'よのなかにあるひととすみかと、またかくのごとし。',
      ),
      scene(
        '玉敷の都のうちに、棟を並べ、甍を争へる、高き、卑しき、人の住まひは、世々を経て尽きせぬものなれど、',
        '宝石を敷いたように美しい都には、棟を並べ、屋根の高さを競う、身分の高い人や低い人の住まいがある。それらは何代たっても尽きないように見えるけれど、',
        '華やかな都の家々を大きく描いてから、「けれど」と逆向きの結論へ進みます。',
        'たましきのみやこのうちに、むねをならべ、いらかをあらそえる、たかき、いやしき、ひとのすまいは、よよをへてつきせぬものなれど、',
      ),
      scene(
        'これをまことかと尋ぬれば、昔ありし家はまれなり。',
        'それが本当に変わらないのかと調べてみると、昔からそのまま残っている家は、めったにありません。',
        '見かけ上は続く都も、一軒ずつ確かめれば変化している。川の比喩が現実の町へ戻ります。',
        'これをまことかとたずぬれば、むかしありしいえはまれなり。',
      ),
      scene(
        '或は去年焼けて今年作れり。或は大家滅びて小家となる。',
        'ある家は去年焼けて、今年建て直されている。またある大きな家は滅び、小さな家になっている。',
        '抽象的な「無常」を、焼失・再建・縮小という具体的な変化で見せます。',
        'あるいはこぞやけてことしつくれり。あるいはおおいえほろびてこいえとなる。',
      ),
      scene(
        '住む人もこれに同じ。所も変はらず、人も多かれど、いにしへ見し人は、二三十人が中に、わづかに一人二人なり。',
        'そこに住む人も同じです。場所は変わらず、人も多くいるけれど、昔会った人は、二、三十人のうち、わずか一人か二人しかいません。',
        '建物だけでなく人も入れ替わると示し、冒頭の川の流れを人の命へ重ねます。',
        'すむひともこれにおなじ。ところもかわらず、ひともおおかれど、いにしえみしひとは、にさんじゅうにんがなかに、わずかにひとりふたりなり。',
      ),
      scene(
        '朝に死に、夕べに生まるるならひ、ただ水の泡にぞ似たりける。',
        '朝に死ぬ人がいれば、夕方に生まれる人がいるという世の常は、まさに水の泡に似ているのでした。',
        '最後に「人＝泡」の対応をもう一度示し、変化し続ける世界の見方を完成させます。',
        'あしたにしに、ゆうべにうまるるならい、ただみずのあわにぞにたりける。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_zh_lunyu_learning',
    kind: 'kanbun',
    language: 'ja-JP',
    level: '漢文・基礎',
    title: '論語',
    titleJa: '学びをめぐる五つの名句',
    author: '孔子と門人',
    authorJa: '孔子と門人',
    authorYears: '紀元前5世紀頃',
    excerpt: '「学而時習之」ほか',
    emoji: '🎓',
    blurb: '学ぶ喜び、友との対話、考えること、知らないと認める知恵を五つの名句で味わう。',
    focus: '反語や対句の形を耳でつかみ、孔子のいう「学び」を考える',
    wordIds: [],
    kotenWordIds: [],
    grammarIds: [],
    rights: kanbunRights('中国・先秦'),
    source: source(
      'Wikisource「論語」学而第一・爲政第二',
      'https://zh.wikisource.org/wiki/論語',
      '2026-08-02',
    ),
    scenes: Object.freeze([
      scene(
        '子曰：「學而時習之、不亦說乎？」',
        '孔子先生は言いました。「学んだことを時に応じて繰り返し身につけるのは、なんとうれしいことではないか。」',
        '「不亦…乎」は「なんと…ではないか」という反語。「說」はここでは「よろこぶ」という意味です。',
        '子曰く、「学びて時にこれを習う、また喜ばしからずや。」',
      ),
      scene(
        '有朋自遠方來、不亦樂乎？人不知而不慍、不亦君子乎？',
        '同じ学びを志す友が遠くから訪ねて来るのは、なんと楽しいことではないか。人が自分を理解しなくても腹を立てないのは、なんと君子らしいことではないか。',
        '「不亦…乎」を二度重ねます。友に理解される喜びのあと、自分が理解されなくても怒らない心へ進みます。',
        '朋あり遠方より来たる、また楽しからずや。人知らずしてうらみず、また君子ならずや。',
      ),
      scene(
        '子曰：「溫故而知新、可以爲師矣。」',
        '孔子先生は言いました。「以前に学んだことをよく確かめ、そこから新しい理解を得られるなら、人を教える師となることができる。」',
        '「故」は以前に学んだこと、「新」はそこから得る新しい理解。復習を、ただの暗記で終わらせない言葉です。',
        '子曰く、「故きをたずねて新しきを知れば、もって師となるべし。」',
      ),
      scene(
        '子曰：「學而不思則罔、思而不學則殆。」',
        '孔子先生は言いました。「学ぶだけで自分で考えなければ、物事の道理が見えない。考えるだけで学ばなければ、独りよがりになって危うい。」',
        '「学ぶ」と「考える」を対句にし、どちらか一方だけでは足りないと示します。',
        '子曰く、「学びて思わざれば、すなわちくらし。思いて学ばざれば、すなわちあやうし。」',
      ),
      scene(
        '知之爲知之、不知爲不知、是知也。',
        '知っていることは知っているとし、知らないことは知らないとする。それが本当の「知る」ということです。',
        '同じ「知」を重ね、知らないことを正直に認める態度まで知性に含めています。',
        'これを知るをこれを知るとなし、知らざるを知らずとなし、これ知るなり。',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_zh_mengzi_fifty_steps',
    kind: 'kanbun',
    language: 'ja-JP',
    level: '漢文・標準',
    title: '孟子',
    titleJa: '「五十歩百歩」',
    author: '孟子と門人',
    authorJa: '孟子と門人',
    authorYears: '紀元前4〜3世紀頃',
    excerpt: '梁惠王上・戦いのたとえ',
    emoji: '🏃',
    blurb: '五十歩逃げた兵が百歩逃げた兵を笑えるのか。王の政治を戦場のたとえで問い直す。',
    focus: '「五十歩百歩」のたとえと、孟子が王へ返した批判をつなげる',
    wordIds: [],
    kotenWordIds: [],
    grammarIds: [],
    rights: kanbunRights('中国・戦国時代'),
    source: source(
      'Wikisource「孟子／梁惠王上」',
      'https://zh.wikisource.org/wiki/孟子/梁惠王上',
      '2026-08-02',
    ),
    scenes: Object.freeze([
      scene(
        '孟子對曰：「王好戰、請以戰喻。」',
        '孟子は答えました。「王は戦いを好まれます。どうか、戦いを例にしてお話しさせてください。」',
        '「請ふ」は相手に許しを求める言い方。王の得意な戦いを使って説明を始めます。',
        '孟子、答えて曰く、「王、戦いを好む。請う、戦いをもってたとえん。」',
      ),
      scene(
        '塡然鼓之、兵刃既接、棄甲曳兵而走。',
        'どんどんと戦いの太鼓を鳴らし、武器と武器がぶつかると、兵士たちはよろいを捨て、武器を引きずって逃げました。',
        '「走」は古い中国語では「走る・逃げる」。戦闘が始まってすぐ逃げ出す様子を描きます。',
        'てんぜんとしてこれに鼓し、兵刃すでに接するや、甲を棄て、兵をひきて走る。',
      ),
      scene(
        '或百步而後止、或五十步而後止。',
        'ある兵士は百歩逃げてから止まり、別の兵士は五十歩逃げてから止まりました。',
        '「或」は「ある者は」。百歩と五十歩の違いだけを並べ、どちらも逃げた事実を聞き手に考えさせます。',
        'あるいは百歩にして後止まり、あるいは五十歩にして後止まる。',
      ),
      scene(
        '以五十步笑百步、則何如？',
        '五十歩逃げた者が、百歩逃げた者を笑ったなら、どうでしょうか。',
        '「何如」は「どうであるか」。孟子は結論を先に言わず、王自身に判断させます。',
        '五十歩をもって百歩を笑わば、すなわちいかん。',
      ),
      scene(
        '曰：「不可。直不百步耳、是亦走也。」',
        '王は言いました。「それはいけない。ただ百歩ではなかったというだけで、その者も逃げたのだ。」',
        '「直…耳」は「ただ…だけだ」。王は、距離が違っても行動は同じだと自分で答えます。',
        '曰く、「不可なり。ただ百歩ならざるのみ。これもまた走るなり。」',
      ),
      scene(
        '曰：「王如知此、則無望民之多於鄰國也。」',
        '孟子は言いました。「王がこのことをお分かりなら、民が隣国より多くなることを望んではなりません。」',
        '王の政治も隣国より少しましなだけで、本質は変わらないと、戦いのたとえを政治へ戻します。',
        '曰く、「王もしこれを知らば、すなわち民の隣国より多からんことを望むなかれ。」',
      ),
    ]),
  }),

  Object.freeze({
    id: 'lit_zh_hanfeizi_contradiction',
    kind: 'kanbun',
    language: 'ja-JP',
    level: '漢文・標準',
    title: '韓非子',
    titleJa: '「矛盾」',
    author: '韓非',
    authorJa: '韓非',
    authorYears: '紀元前280頃–233',
    excerpt: '難一・矛と楯の商人',
    emoji: '🛡️',
    blurb: 'どんな物も突き通す矛と、何ものにも突き通されない楯。二つの売り文句が正面衝突する。',
    focus: '商人の二つの主張を整理し、なぜ同時には成り立たないのか説明する',
    wordIds: [],
    kotenWordIds: [],
    grammarIds: [],
    rights: kanbunRights('中国・戦国時代'),
    source: source(
      'Wikisource「韓非子／難一」',
      'https://zh.wikisource.org/wiki/韓非子/難一',
      '2026-08-02',
    ),
    scenes: Object.freeze([
      scene(
        '楚人有鬻楯與矛者。',
        '楚の国の人に、楯と矛を売る者がいました。',
        '「鬻ぐ」は「売る」。「楯」は「盾」の異体字で、ここから短い問答が始まります。',
        '楚人に、楯と矛とをひさぐ者あり。',
      ),
      scene(
        '譽之曰：「吾楯之堅、物莫能陷也。」',
        'その人は楯をほめて言いました。「私の楯の堅さときたら、これを突き通せる物は何もない。」',
        '「莫能…」は「…できるものはない」。楯を例外のない最強の物として売り込みます。',
        'これを誉めて曰く、「わが楯の堅きこと、物としてよく通すものなきなり。」',
      ),
      scene(
        '又譽其矛曰：「吾矛之利、於物無不陷也。」',
        'また、その矛をほめて言いました。「私の矛の鋭さときたら、どんな物でも突き通さないことはない。」',
        '「無不…」は二重否定で「…しないものはない」。今度は矛にも例外がないと言います。',
        'またその矛を誉めて曰く、「わが矛の鋭きこと、物において通さざるなきなり。」',
      ),
      scene(
        '或曰：「以子之矛、陷子之楯、何如？」',
        'ある人が言いました。「あなたの矛で、あなたの楯を突いたら、どうなるのですか。」',
        '二つの「例外なし」を同じ場面でぶつける質問です。「何如」で相手に結論を求めます。',
        'あるひと曰く、「あなたの矛をもって、あなたの楯を通さば、いかん。」',
      ),
      scene(
        '其人弗能應也。',
        'その人は、答えることができませんでした。',
        '「弗能…」は「…することができない」。短い一文で商人の主張が崩れます。',
        'その人、こたうるあたわざるなり。',
      ),
      scene(
        '夫不可陷之楯與無不陷之矛、不可同世而立。',
        'そもそも、突き通すことのできない楯と、何でも突き通す矛とは、同時にこの世に成り立つことができません。',
        '物語の結論です。互いに両立しない主張を並べたことから、現代の「矛盾」という語が生まれました。',
        'それ通すべからざるの楯と、通さざるなきの矛とは、同じ世に立つべからず。',
      ),
    ]),
  }),
])

export const PUBLIC_DOMAIN_LITERATURE = Object.freeze(
  BASE_PUBLIC_DOMAIN_LITERATURE.map((work) =>
    Object.freeze({
      ...work,
      scenes: Object.freeze(
        work.scenes.map((item, sceneIndex) =>
          Object.freeze({
            ...item,
            narrationSegments:
              LITERATURE_NARRATION_SEGMENTS[work.id]?.[sceneIndex] ?? Object.freeze([]),
          }),
        ),
      ),
    }),
  ),
)

const WORKS_BY_ID = new Map(PUBLIC_DOMAIN_LITERATURE.map((work) => [work.id, work]))

export const getLiteratureWork = (id) => WORKS_BY_ID.get(id) ?? null

export const literatureByKind = (kind) =>
  PUBLIC_DOMAIN_LITERATURE.filter((work) => work.kind === kind)

export const literatureCompletionCount = (readingsDone, kind = null) => {
  const completed = new Set(Array.isArray(readingsDone) ? readingsDone : [])
  return PUBLIC_DOMAIN_LITERATURE.filter(
    (work) => (!kind || work.kind === kind) && completed.has(work.id),
  ).length
}

export const literatureWordCount = (work) =>
  (work?.scenes ?? [])
    .map((item) => item.original)
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
