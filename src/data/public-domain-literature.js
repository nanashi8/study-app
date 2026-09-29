// 著作権保護期間が満了した原文を、全文で読み、分からない文を押して解説を開く名作教材。
// 朗読は、息継ぎする短い区切りごとに原文→訳で読み上げる。
//
// 英語は文ごとの構造台帳（literature-structures/）が本文・和訳・朗読の区切りの正本で、段落を場面にする。
// 古典・漢文は scenes（朗読の場面）と区切り（literature-narration-segments.js）を持ち、
// 文ごとの解説は literature-classics-notes.js にある。original は出典に照らした原文、speech は
// 端末音声で読みやすくするための読み、translation は本アプリ独自の現代語訳。
// 既存の長文・古典IDとは別名前空間にして、保存済み進捗との衝突を避ける。

import { LITERATURE_NARRATION_SEGMENTS } from './literature-narration-segments.js'
import { parseKanbunMarkedText } from '../lib/kanbun-marks.js'
import { englishLiteratureWordIds } from './literature-vocabulary.js'
import { tokenize } from '../lib/text.js'
import { LITERATURE_SENTENCE_STRUCTURES } from './literature-structures/index.js'

// marked は漢文の訓読文（送り仮名・返り点・句読点付き）、kakikudashi はその書き下し文（歴史的仮名遣い）。
// speech は端末音声で読ませるための読み。訓読文は返り点どおりに読むと必ず書き下し文になるように持つ。
const scene = (original, translation, guide, speech = null, marked = null, kakikudashi = null) =>
  Object.freeze({ original, translation, guide, speech, marked, kakikudashi })

const source = (label, url, checkedOn) => Object.freeze({ label, url, checkedOn })

// 漢文は朗読の区切りごとにも訓点付きで見せる。場面の訓読文を、区切りの白文と
// 同じ字数で切り分ける（送り仮名と返り点は親字と一緒に動く）ので、連結すれば必ず元の訓読文へ戻る。
const withKanbunMarks = (marked, segments) => {
  if (!marked || !segments.length) return segments
  const units = parseKanbunMarkedText(marked).units
  let cursor = 0
  return segments.map((segment) => {
    const length = [...segment.original].length
    const sliced = units.slice(cursor, cursor + length)
    cursor += length
    return { ...segment, marked: sliced.map((unit) => unit.sourceText).join('') }
  })
}

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
    id: 'lit_en_moby_dick_water_gazers',
    kind: 'english',
    language: 'en-US',
    level: '英検準1級〜1級',
    title: 'Moby-Dick; or, The Whale',
    titleJa: '白鯨',
    author: 'Herman Melville',
    authorJa: 'ハーマン・メルヴィル',
    authorYears: '1819–1891',
    excerpt: 'Chapter 1: Loomings・第1章全文',
    emoji: '🐋',
    blurb: '島の町マンハッタンで、人々がなぜか水辺へ集まる姿から、海が人を引きつける力を描く場面。',
    focus: '場所を先に出す倒置と反復を追い、人々の視線が海へ集まる理由を考える',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1819–1891', '1851年'),
    source: source(
      'Project Gutenberg eBook #2701',
      'https://www.gutenberg.org/ebooks/2701',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'chapter',
      label: '第1章全文',
      sourceUnit: 'Chapter 1: Loomings',
      complete: true,
      sourceWordCount: 2237,
      maxWordTarget: 5000,
      limitNote: '長編のため、5,000語以内で完結する第1章を全文収録',
      startMarker: 'Call me Ishmael. Some years ago — never mind how long precisely — having little ',
      endMarker: 'ions of the whale, and, mid most of them all, one grand hooded phantom, like a snow hill in the air.',
      sourceSha256: '63b5820f4cbf86855bcba35dd01f473264bee6ea2e3b639b12c05981f09094b2',
      checkedOn: '2026-08-27',
    }),
  }),

  Object.freeze({
    id: 'lit_en_pride_prejudice_netherfield',
    kind: 'english',
    language: 'en-GB',
    level: '英検準1級',
    title: 'Pride and Prejudice',
    titleJa: '高慢と偏見',
    author: 'Jane Austen',
    authorJa: 'ジェイン・オースティン',
    authorYears: '1775–1817',
    excerpt: 'Chapter 1・第1章全文',
    emoji: '🏡',
    blurb: '裕福な独身男性が近所へ来るという知らせをめぐり、ベネット夫妻の考え方の違いが会話に表れる冒頭。',
    focus: '皮肉な語りと会話の応酬から、語り手と夫妻それぞれの見方を区別する',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1775–1817', '1813年'),
    source: source(
      'Project Gutenberg eBook #1342',
      'https://www.gutenberg.org/ebooks/1342',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'chapter',
      label: '第1章全文',
      sourceUnit: 'Chapter I',
      complete: true,
      sourceWordCount: 853,
      maxWordTarget: 5000,
      limitNote: '長編のため、5,000語以内で完結する第1章を全文収録',
      startMarker: 'It is a truth universally acknowledged, that a single man in possession of a goo',
      endMarker: 'ervous. The business of her life was to get her daughters married: its solace was visiting and news.',
      sourceSha256: 'd856fe2e6f1c93d3a7f506efcfc643c2b12a7d9aaa61e5e9867d1494f47fd09f',
      checkedOn: '2026-08-27',
    }),
  }),

  Object.freeze({
    id: 'lit_en_tale_two_cities_times',
    kind: 'english',
    language: 'en-GB',
    level: '英検準1級〜1級',
    title: 'A Tale of Two Cities',
    titleJa: '二都物語',
    author: 'Charles Dickens',
    authorJa: 'チャールズ・ディケンズ',
    authorYears: '1812–1870',
    excerpt: 'Book the First, Chapter I・第1章全文',
    emoji: '⏳',
    blurb: '相反する言葉を繰り返し、革命前夜のイギリスとフランスが抱えた矛盾を大きく映し出す冒頭。',
    focus: '対照表現と反復のリズムをつかみ、「一つに決められない時代像」を読む',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1812–1870', '1859年'),
    source: source(
      'Project Gutenberg eBook #98',
      'https://www.gutenberg.org/ebooks/98',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'chapter',
      label: '第1章全文',
      sourceUnit: 'Book the First, Chapter I: The Period',
      complete: true,
      sourceWordCount: 1015,
      maxWordTarget: 5000,
      limitNote: '長編のため、5,000語以内で完結する第1章を全文収録',
      startMarker: 'It was the best of times, it was the worst of times, it was the age of wisdom, i',
      endMarker: 'l creatures — the creatures of this chronicle among the rest — along the roads that lay before them.',
      sourceSha256: '36c18eaad0a58a76426407cef9698deb40a3717204abb38ac61b4458e66403b1',
      checkedOn: '2026-08-27',
    }),
  }),

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
    excerpt: 'Chapter I: Down the Rabbit-Hole・第1章全文',
    emoji: '🐇',
    blurb: '退屈な午後、時計を持つ白ウサギが日常の景色を一変させる場面。',
    focus: '長い一文の流れと、アリスの好奇心を追う',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1832–1898', '1865年'),
    source: source(
      'Project Gutenberg eBook #11',
      'https://www.gutenberg.org/ebooks/11',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'chapter',
      label: '第1章全文',
      sourceUnit: 'Chapter I: Down the Rabbit-Hole',
      complete: true,
      sourceWordCount: 2162,
      maxWordTarget: 5000,
      limitNote: '長編のため、5,000語以内で完結する第1章を全文収録',
      startMarker: 'Alice was beginning to get very tired of sitting by her sister on the bank, and ',
      endMarker: 'stupid for life to go on in the common way. So she set to work, and very soon finished off the cake.',
      sourceSha256: 'd372af777f1f642fdfebfae6eee4aab8158ab8dc838eca2048bd65fa1583eb34',
      checkedOn: '2026-08-27',
    }),
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
    excerpt: 'The Happy Prince・短編全文',
    emoji: '👑',
    blurb: '町を見下ろす美しい王子の像を、人々がそれぞれの価値観で語る場面。',
    focus: '描写と会話から、見た目と本当の価値のずれを読む',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1854–1900', '1888年'),
    source: source(
      'Project Gutenberg eBook #902',
      'https://www.gutenberg.org/ebooks/902',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'story',
      label: '短編全文',
      sourceUnit: 'The Happy Prince',
      complete: true,
      sourceWordCount: 3499,
      maxWordTarget: 5000,
      limitNote: '短編集のうち、5,000語以内で完結する表題作を全文収録',
      startMarker: 'HIGH above the city, on a tall column, stood the statue of the Happy Prince. He ',
      endMarker: ' this little bird shall sing for evermore, and in my city of gold the Happy Prince shall praise me.”',
      sourceSha256: '6cb9a50e99700abb4a285fceb9cae02c17bd3064ee0c81491315ae0f6dd4a253',
      checkedOn: '2026-08-27',
    }),
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
    excerpt: 'The Gift of the Magi・短編全文',
    emoji: '🎁',
    blurb: 'クリスマス前日、デラが手元の小銭を数える印象的な導入。',
    focus: '短文の反復とユーモアから、貧しさと愛情を感じ取る',
    kotenWordIds: [],
    grammarIds: [],
    rights: englishRights('1862–1910', '1905年'),
    source: source(
      'Project Gutenberg eBook #7256',
      'https://www.gutenberg.org/ebooks/7256',
      '2026-08-27',
    ),
    coverage: Object.freeze({
      unitType: 'story',
      label: '短編全文',
      sourceUnit: 'The Gift of the Magi',
      complete: true,
      sourceWordCount: 2071,
      maxWordTarget: 5000,
      limitNote: '短編集のうち、5,000語以内で完結する表題作を全文収録',
      startMarker: 'One dollar and eighty-seven cents. That was all. And sixty cents of it was in pe',
      endMarker: ' who give and receive gifts, such as they are wisest. Everywhere they are wisest. They are the magi.',
      sourceSha256: '1912e0386e1ac11256d62ec17df9c0d6407e96a74891246b71bcd462ff5cb1a8',
      checkedOn: '2026-08-27',
    }),
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
    kotenWordIds: [
      'k272',
      'k060',
      'k055',
      'k185',
      'k186',
      'k002',
      'k001',
      'k235',
      'k090',
      'k145',
      'k026',
      'k244',
      'k249',
    ],
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
    kotenWordIds: [
      'k007',
      'k071',
      'k171',
      'k179',
      'k084',
      'k088',
      'k043',
      'k106',
      'k023',
      'k236',
      'k174',
    ],
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
        'さて、かたへの人にあひて、「年ごろ思ひつること、果たし侍りぬ。聞きしにも過ぎて、尊くこそおはしけれ。',
        'そして仲間に会い、こう話しました。「長年願っていたことを果たしました。うわさに聞いていた以上に、ほんとうに尊い所でしたよ。',
        '「こそ…おはしけれ」は係り結び。「こそ」が強意となり、結びが已然形になります。',
        'さて、かたえのひとにあいて、としごろおもいつること、はたしはべりぬ。ききしにもすぎて、とうとくこそおわしけれ。',
      ),
      scene(
        'そも、参りたる人ごとに山へ登りしは、何事かありけむ。ゆかしかりしかど、神へ参るこそ本意なれと思ひて、山までは見ず」とぞ言ひける。',
        'それにしても、参拝した人がみな山へ登っていったのは、何があったのでしょう。知りたかったのですが、神様へ参ることこそ目的だと思って、山の上までは見ませんでした」と言いました。',
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
    kotenWordIds: [
      'k098',
      'k099',
      'k300',
      'k035',
      'k233',
      'k089',
      'k091',
      'k237',
      'k297',
      'k246',
      'k234',
    ],
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
    kanbunVocabIds: [
      'kv001',
      'kv002',
      'kv007',
      'kv008',
      'kv009',
      'kv010',
      'kv017',
      'kv019',
      'kv032',
      'kv034',
      'kv035',
      'kv062',
      'kv071',
      'kv095',
    ],
    grammarIds: [],
    rights: kanbunRights('中国・先秦'),
    source: source(
      'Wikisource「論語」学而第一・爲政第二',
      'https://zh.wikisource.org/wiki/論語',
      '2026-08-02',
    ),
    scenes: Object.freeze([
      scene(
        '子曰：「學而時習之、不亦說乎？',
        '孔子先生は言いました。「学んだことを時に応じて繰り返し身につけるのは、なんとうれしいことではないか。',
        '「不亦…乎」は「なんと…ではないか」という反語。「說」はここでは「よろこぶ」という意味です。',
        '子曰く、「学びて時にこれを習う、また喜ばしからずや。',
        '子曰ハク：「學ビテ而時ニ習フ㆑之ヲ、不㆓亦タ說バシカラ㆒乎？',
        '子曰はく、「学びて時に之を習ふ、亦た説ばしからずや。',
      ),
      scene(
        '有朋自遠方來、不亦樂乎？人不知而不慍、不亦君子乎？」',
        '同じ学びを志す友が遠くから訪ねて来るのは、なんと楽しいことではないか。人が自分を理解しなくても腹を立てないのは、なんと君子らしいことではないか。」',
        '「不亦…乎」を二度重ねます。友に理解される喜びのあと、自分が理解されなくても怒らない心へ進みます。',
        '朋あり遠方より来たる、また楽しからずや。人知らずしてうらみず、また君子ならずや。」',
        '有リ㆑朋自リ㆓遠方㆒來タル、不㆓亦タ樂シカラ㆒乎？人不シテ㆑知ラ而不㆑慍ミ、不㆓亦タ君子ナラ㆒乎？」',
        '朋有り遠方より来たる、亦た楽しからずや。人知らずして慍みず、亦た君子ならずや。」',
      ),
      scene(
        '子曰：「溫故而知新、可以爲師矣。」',
        '孔子先生は言いました。「以前に学んだことをよく確かめ、そこから新しい理解を得られるなら、人を教える師となることができる。」',
        '「故」は以前に学んだこと、「新」はそこから得る新しい理解。復習を、ただの暗記で終わらせない言葉です。',
        '子曰く、「故きをたずねて新しきを知れば、もって師となるべし。」',
        '子曰ハク：「溫ネテ㆑故キヲ而知レバ㆑新シキヲ、可シ㆓以テ爲ル㆒㆑師ト矣。」',
        '子曰はく、「故きを温ねて新しきを知れば、以て師と為るべし。」',
      ),
      scene(
        '子曰：「學而不思則罔、思而不學則殆。」',
        '孔子先生は言いました。「学ぶだけで自分で考えなければ、物事の道理が見えない。考えるだけで学ばなければ、独りよがりになって危うい。」',
        '「学ぶ」と「考える」を対句にし、どちらか一方だけでは足りないと示します。',
        '子曰く、「学びて思わざれば、すなわちくらし。思いて学ばざれば、すなわちあやうし。」',
        '子曰ハク：「學ビテ而不レバ㆑思ハ則チ罔シ、思ヒテ而不レバ㆑學バ則チ殆フシ。」',
        '子曰はく、「学びて思はざれば則ち罔し、思ひて学ばざれば則ち殆ふし。」',
      ),
      scene(
        '知之爲知之、不知爲不知、是知也。',
        '知っていることは知っているとし、知らないことは知らないとする。それが本当の「知る」ということです。',
        '同じ「知」を重ね、知らないことを正直に認める態度まで知性に含めています。',
        'これを知るをこれを知るとなし、知らざるを知らずとなす、これ知るなり。',
        '知ルヲ㆑之ヲ爲シ㆑知ルト㆑之ヲ、不ルヲ㆑知ラ爲ス㆑不ト㆑知ラ、是レ知ル也。',
        '之を知るを之を知ると為し、知らざるを知らずと為す、是れ知るなり。',
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
    kanbunVocabIds: [
      'kv002',
      'kv007',
      'kv018',
      'kv019',
      'kv030',
      'kv034',
      'kv042',
      'kv061',
      'kv064',
      'kv073',
      'kv077',
      'kv095',
      'kv118',
    ],
    grammarIds: [],
    rights: kanbunRights('中国・戦国時代'),
    source: source(
      'Wikisource「孟子／梁惠王上」',
      'https://zh.wikisource.org/wiki/孟子/梁惠王上',
      '2026-08-02',
    ),
    scenes: Object.freeze([
      scene(
        '孟子對曰：「王好戰、請以戰喻。',
        '孟子は答えました。「王は戦いを好まれます。どうか、戦いを例にしてお話しさせてください。',
        '「請ふ」は相手に許しを求める言い方。王の得意な戦いを使って説明を始めます。',
        '孟子、答えて曰く、「王、戦いを好む。請う、戦いをもってたとえん。',
        '孟子對ヘテ曰ハク：「王好ム㆑戰ヒヲ、請フ以テ㆑戰ヒヲ喻ヘン。',
        '孟子対へて曰はく、「王戦ひを好む、請ふ戦ひを以て喩へん。',
      ),
      scene(
        '塡然鼓之、兵刃既接、棄甲曳兵而走。',
        'どんどんと戦いの太鼓を鳴らし、武器と武器がぶつかると、兵士たちはよろいを捨て、武器を引きずって逃げました。',
        '「走」は古い中国語では「走る・逃げる」。戦闘が始まってすぐ逃げ出す様子を描きます。',
        'てんぜんとしてこれに鼓し、兵刃すでに接するや、甲を棄て、兵をひきて走る。',
        '塡然トシテ鼓シ㆑之ニ、兵刃既ニ接スルヤ、棄テ㆑甲ヲ曳キテ㆑兵ヲ而走ル。',
        '填然として之に鼓し、兵刃既に接するや、甲を棄て兵を曳きて走る。',
      ),
      scene(
        '或百步而後止、或五十步而後止。',
        'ある兵士は百歩逃げてから止まり、別の兵士は五十歩逃げてから止まりました。',
        '「或」は「ある者は」。百歩と五十歩の違いだけを並べ、どちらも逃げた事実を聞き手に考えさせます。',
        'あるいは百歩にして後止まり、あるいは五十歩にして後止まる。',
        '或イハ百步ニシテ而後止マリ、或イハ五十步ニシテ而後止マル。',
        '或いは百歩にして後止まり、或いは五十歩にして後止まる。',
      ),
      scene(
        '以五十步笑百步、則何如？」',
        '五十歩逃げた者が、百歩逃げた者を笑ったなら、どうでしょうか。」',
        '「何如」は「どうであるか」。孟子は結論を先に言わず、王自身に判断させます。',
        '五十歩をもって百歩を笑わば、すなわちいかん。」',
        '以テ㆓五十步ヲ㆒笑ハバ㆓百步ヲ㆒、則チ何如？」',
        '五十歩を以て百歩を笑はば、則ち何如。」',
      ),
      scene(
        '曰：「不可。直不百步耳、是亦走也。」',
        '王は言いました。「それはいけない。ただ百歩ではなかったというだけで、その者も逃げたのだ。」',
        '「直…耳」は「ただ…だけだ」。王は、距離が違っても行動は同じだと自分で答えます。',
        '曰く、「不可なり。ただ百歩ならざるのみ。これもまた走るなり。」',
        '曰ハク：「不可ナリ。直ダ不ル㆓百步ナラ㆒耳、是レモ亦タ走ル也。」',
        '曰はく、「不可なり。直だ百歩ならざるのみ、是れも亦た走るなり。」',
      ),
      scene(
        '曰：「王如知此、則無望民之多於鄰國也。」',
        '孟子は言いました。「王がこのことをお分かりなら、民が隣国より多くなることを望んではなりません。」',
        '王の政治も隣国より少しましなだけで、本質は変わらないと、戦いのたとえを政治へ戻します。',
        '曰く、「王もしこれを知らば、すなわち民の隣国より多きを望むことなかれ。」',
        '曰ハク：「王如シ知ラバ㆑此ヲ、則チ無カレ㆑望ムコト㆔民之多キヲ㆓於鄰國ヨリ㆒也。」',
        '曰はく、「王如し此を知らば、則ち民の隣国より多きを望むこと無かれ。」',
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
    kanbunVocabIds: [
      'kv001',
      'kv002',
      'kv017',
      'kv018',
      'kv019',
      'kv020',
      'kv091',
      'kv097',
    ],
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
        '楚人ニ有リ㆘鬻グ㆓楯ト與ヲ㆒㆑矛者㆖。',
        '楚人に楯と矛とを鬻ぐ者有り。',
      ),
      scene(
        '譽之曰：「吾楯之堅、物莫能陷也。」',
        'その人は楯をほめて言いました。「私の楯の堅さときたら、これを突き通せる物は何もない。」',
        '「莫能…」は「…できるものはない」。楯を例外のない最強の物として売り込みます。',
        'これを誉めて曰く、「わが楯の堅きこと、物のよく通すものなきなり。」',
        '譽メテ㆑之ヲ曰ハク：「吾ガ楯之堅キコト、物ノ莫キ㆓能ク陷スモノ㆒也。」',
        '之を誉めて曰はく、「吾が楯の堅きこと、物の能く陥すもの莫きなり。」',
      ),
      scene(
        '又譽其矛曰：「吾矛之利、於物無不陷也。」',
        'また、その矛をほめて言いました。「私の矛の鋭さときたら、どんな物でも突き通さないことはない。」',
        '「無不…」は二重否定で「…しないものはない」。今度は矛にも例外がないと言います。',
        'またその矛を誉めて曰く、「わが矛のときこと、物において通さざるなきなり。」',
        '又譽メテ㆓其ノ矛ヲ㆒曰ハク：「吾ガ矛之利キコト、於イテ㆑物ニ無キ㆑不ル㆑陷サ也。」',
        '又其の矛を誉めて曰はく、「吾が矛の利きこと、物に於いて陥さざる無きなり。」',
      ),
      scene(
        '或曰：「以子之矛、陷子之楯、何如？」',
        'ある人が言いました。「あなたの矛で、あなたの楯を突いたら、どうなるのですか。」',
        '二つの「例外なし」を同じ場面でぶつける質問です。「何如」で相手に結論を求めます。',
        'あるひと曰く、「しの矛をもって、しの楯を通さば、いかん。」',
        '或ヒト曰ハク：「以テ㆓子之矛ヲ㆒、陷サバ㆓子之楯ヲ㆒、何如？」',
        '或ひと曰はく、「子の矛を以て、子の楯を陥さば、何如。」',
      ),
      scene(
        '其人弗能應也。',
        'その人は、答えることができませんでした。',
        '「弗能…」は「…することができない」。短い一文で商人の主張が崩れます。',
        'その人、こたうることあたわざるなり。',
        '其ノ人弗ル㆑能ハ㆑應フルコト也。',
        '其の人応ふること能はざるなり。',
      ),
      scene(
        '夫不可陷之楯與無不陷之矛、不可同世而立。',
        'そもそも、突き通すことのできない楯と、何でも突き通す矛とは、同時にこの世に成り立つことができません。',
        '物語の結論です。互いに両立しない主張を並べたことから、現代の「矛盾」という語が生まれました。',
        'それ通すべからざるの楯と、通さざるなきの矛とは、世を同じくして立つべからず。',
        '夫レ不ル㆑可カラ㆑陷ス之楯ト與ハ㆓無キ㆑不ル㆑陷サ之矛㆒、不㆑可カラ㆓同ジクシテ㆑世ヲ而立ツ㆒。',
        '夫れ陥すべからざるの楯と陥さざる無きの矛とは、世を同じくして立つべからず。',
      ),
    ]),
  }),
])

const LITERATURE_SELECTION_COVERAGE = Object.freeze({
  lit_ja_makura_seasons: Object.freeze({
    unitType: 'selection',
    label: '第一段全文',
    sourceUnit: '第一段',
    complete: true,
  }),
  lit_ja_tsurezure_ishimizu: Object.freeze({
    unitType: 'selection',
    label: '第五十二段全文',
    sourceUnit: '第五十二段',
    complete: true,
  }),
  lit_ja_hojoki_flow: Object.freeze({
    unitType: 'selection',
    label: '冒頭選文全文',
    sourceUnit: '冒頭「ゆく河の流れ」',
    complete: true,
  }),
  lit_zh_lunyu_learning: Object.freeze({
    unitType: 'selection',
    label: '五章句全文',
    sourceUnit: '学びをめぐる五つの章句',
    complete: true,
  }),
  lit_zh_mengzi_fifty_steps: Object.freeze({
    unitType: 'selection',
    label: '故事全文',
    sourceUnit: '「五十歩百歩」の故事',
    complete: true,
  }),
  lit_zh_hanfeizi_contradiction: Object.freeze({
    unitType: 'selection',
    label: '故事全文',
    sourceUnit: '「矛盾」の故事',
    complete: true,
  }),
})

// 英語名作は、一文ごとの構造台帳（literature-structures/）が本文の正本。原文の段落を1つの場面にし、
// 各文の語順訳のまとまり（英語と対応する日本語）をそのまま交互朗読の区切りにする。
function englishScenesFromLedger(entries) {
  const paragraphs = []
  for (const [index, entry] of entries.entries()) {
    if (index === 0 || entry.p) paragraphs.push([])
    paragraphs.at(-1).push(entry)
  }
  return paragraphs.map((list) => {
    const chunks = list.flatMap((entry) => entry.chunks ?? [])
    return Object.freeze({
      original: chunks.map((chunk) => chunk.en).join(' '),
      translation: list.map((entry) => entry.ja).join(''),
      guide: '',
      speech: null,
      marked: null,
      kakikudashi: null,
      narrationSegments: Object.freeze(chunks.map((chunk) => Object.freeze({
        original: chunk.en,
        translation: chunk.ja,
        speech: chunk.en,
      }))),
    })
  })
}

export const PUBLIC_DOMAIN_LITERATURE = Object.freeze(
  BASE_PUBLIC_DOMAIN_LITERATURE.map((work) => {
    const ledger = work.kind === 'english' ? LITERATURE_SENTENCE_STRUCTURES[work.id] : null
    const sourceScenes = ledger ? englishScenesFromLedger(ledger) : work.scenes ?? []
    const workWithSegments = {
      ...work,
      coverage: work.coverage ?? LITERATURE_SELECTION_COVERAGE[work.id],
      kanbunVocabIds: work.kanbunVocabIds ?? [],
      scenes: Object.freeze(
        sourceScenes.map((item, sceneIndex) => {
          const segments =
            item.narrationSegments ??
            LITERATURE_NARRATION_SEGMENTS[work.id]?.[sceneIndex] ??
            Object.freeze([])
          return Object.freeze({
            ...item,
            narrationSegments: Object.freeze(
              withKanbunMarks(item.marked, segments).map((segment) => Object.freeze({ ...segment })),
            ),
          })
        }),
      ),
    }
    return Object.freeze({
      ...workWithSegments,
      // 英語は手入力の「重要語」ではなく、本文の全出現語から解決した
      // 共通辞書IDをその作品のデッキとする。辞書外語は作品専用カードで扱う。
      wordIds: work.kind === 'english'
        ? Object.freeze(englishLiteratureWordIds(workWithSegments))
        : work.wordIds,
    })
  }),
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
    .flatMap((item) => tokenize(item.original))
    .filter((token) => token.word).length
