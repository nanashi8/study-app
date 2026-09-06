// 語の成り立ちの手動監査台帳。
//
// 語根カードは「語根＝意味」しか表せないため、
//  - いつ誰が造った語か（ideology は 1796年の造語、robot は戯曲から）
//  - 人名・神名・地名から来た語（sandwich, panic, magnet）
//  - 語根カードを作れない語（suffocation の faucēs は英語がこの1語族だけ）
// といった「語そのものの歴史」は、どのカードにも載せられなかった。
//
// ここはその1語ぶんの説明だけを、カードと同じ基準で公開する台帳。
// - note は Online Etymology Dictionary と Wiktionary の見出しで確認した事実だけを短く書く。
// - fingerprint は note を固定する SHA-256。1文字でも変えると品質GATEが落ちる。
// - 単語データの自由記述 etymology.note は引き続き学習者へ出さない。

export const ETYMOLOGY_WORD_NOTE_SCHEMA = 1

const story = (note, fingerprint) => Object.freeze({
  note,
  reviewedAt: '2026-09-06',
  reviewedBy: 'manual-etymology-audit',
  fingerprint,
})

export const ETYMOLOGY_WORD_NOTES = Object.freeze({
  ideology: story('1796年にフランスの哲学者ド・トラシーが idéologie「観念の学」として造った語。idea（観念）＋ -logy（学問）。', 'df181f058ad85a8f20ff4e909b76f1afa49842da06a55512638ac35558ba3a14'),
  suffocation: story('ラテン語 suffōcāre「窒息させる」から。sub-（下から）＋ faucēs（喉）で、喉を下から締めること。', '11de877d86315f424bc31049c42f04e7bd881ef2a7a969df18763b04f2df3ee6'),
  suffocate: story('ラテン語 suffōcāre「窒息させる」から。sub-（下から）＋ faucēs（喉）で、喉を下から締めること。', '371abd855f9b1767714881506e99a80c6b7db5de1db06cac97ea99e3b2bdd922'),
  money: story('ローマの女神ユノの異名 Monēta の神殿で硬貨が鋳造されたことから。', '256f8bfcf4b6b551c00f021ea47187c0a2d7869d76adf9549fb72bc2d8898649'),
  salary: story('ラテン語 salārium から。兵士が塩（sal）を買うために支給された手当が語源。', '2d0fd868ddbcbd2caa48b652e0cfa3150dba92246998cb1dc443833b6f0c752c'),
  candidate: story('ラテン語 candidātus「白い服を着た人」から。ローマで公職を志願する人は白いトガを着た。', '9835e231a04f222f543c119fc4f21092565790d39c4c7d862134a7b2da6c9474'),
  companion: story('ラテン語 com-（共に）＋ pānis（パン）から。パンを分け合う相手のこと。', '4d33a56fffc05e14e63831a957446741d1e8ca68e398534917ebb34ec24eb9a3'),
  muscle: story('ラテン語 mūsculus「小さなネズミ」から。動く筋肉の形をネズミに見立てた。', '33882d27adc090bba647201a9bdd30985f6a1275cd8e1ff9cbd8399f15e0f9b4'),
  vaccine: story('ラテン語 vacca「雌牛」から。牛痘を使った種痘に由来する。', '3a9adf78156c2687777169ae5b48b6cfba096a0968de3a1faa2a05f6b68f60dc'),
  sandwich: story('18世紀のサンドイッチ伯爵の名から。食事の間も卓を離れずに済むよう挟んで食べたと伝わる。', 'b7ba2f6a7275dd836874ab5d873492adc84d1e878225cd6aa0ac0dd5ab9b4fcf'),
  boycott: story('19世紀アイルランドの土地差配人 Charles Boycott の名から。地域ぐるみで取引を断たれた出来事による。', 'd3c683680b223b4ccd5ff7d94088fb5698fff46b41b73e0e365ba5504ee76cc5'),
  algorithm: story('9世紀の数学者アル・フワーリズミーの名から。ラテン語形 algorismus を経て今の綴りになった。', '150d4af2aea31752784c167fe106d320822b348753a372627d3faf3be1c7d8bd'),
  panic: story('ギリシャ神話の牧神パン（Pān）から。パンが引き起こすとされた突然の恐怖のこと。', 'aebcf1219695ebbd087a24e15db2443d51ccf515f1bacb73cb92f5a3bfa6b701'),
  volcano: story('ローマ神話の火の神ウルカヌス（Vulcānus）の名から。', 'd39da94bd310665fa957a60ffc4bf90db86746fb59a35bc6d6102c5973a15e04'),
  music: story('ギリシャ語 mousikē「ムーサ（Muse）の技」から。ムーサは文芸をつかさどる女神。', '6887090f701905b259df049ff10e1b6bf4cf63e0b2a99869b84d4833f2fb4052'),
  museum: story('ギリシャ語 Mouseion「ムーサの神殿」から。music と同じ女神の名にさかのぼる。', '896a7eba55e0335ac6b8f293efcf85bced18d5bc53d417459e5cbaabf6011673'),
  galaxy: story('ギリシャ語 gala「乳」から。天の川を「乳の輪」と呼んだことによる。', '1cefca923976c7db78aa8d0905debc3d176e77b90cace18af36f7485779f01fe'),
  magnet: story('小アジアの地名マグネシア（Magnēsia）から。この地で採れた石が鉄を引きつけた。', '9b0f89e0830a9d5701324d39f3fdbcfbd08b269fcf307d634edf8af3fdf1093a'),
  mentor: story('ホメロスの叙事詩でテレマコスを導いた老人メントール（Mentōr）の名から。', '7af95127226a6a71237e0ee0948572131ed6afe0407c08ed6ca26928fe493ea8'),
  martial: story('ローマ神話の軍神マルス（Mārs）から。', '319ff93c27ddfae91a49d44e2f0d1fb2ef71e73ba0d7b693176d5b984b572ff4'),
  disaster: story('ギリシャ語 dus-（悪い）＋ astēr（星）から。星回りが悪いこと。', '9a1a97f129066c915037f7e936e7b976b45e2ce45dba75116d291c92f10e4fbc'),
  tragedy: story('ギリシャ語 tragōidiā「山羊の歌」から。合唱隊や賞と山羊との結び付きが伝えられている。', 'a1b81fe6aa10a4fa7873e1f86b515368222aa06099f4805ce519db4bd156c115'),
  academy: story('プラトンが学園を開いたアテネの地アカデメイア（Akadēmeia）から。', 'fd436e167c099bff070ac3dca18558b2e8a2b45d967f5e162ba53ff8eb4d6fea'),
  laconic: story('ギリシャの地方ラコニア（Lakōnikos）から。スパルタ人が短く簡潔に話したことによる。', '565ad96c8c95c8de5c79f0681010c8965e3b8e12fdcf60f1782a6e7f1ca3fd39'),
  cynical: story('ギリシャ語 kynikos「犬のような」から。世俗を捨てた犬儒派の生き方を指した。', '7f3896e068f516b1808f2fabbb0cc15a93dee2945dd123a419c468e5d5719814'),
  stoic: story('アテネの彩色柱廊ストア（Stoa）から。そこで教えた学派の名になった。', '3ed12ab26030d306bcd228393dbcfc4ba4a19d4a8eeca8727f2ebaab6459553d'),
  sarcasm: story('ギリシャ語 sarkazein「肉を裂く」から。相手をえぐる物言いのこと。', 'f0d77e62ab51d625913bc87a1a4468c7af43ef1a2b2897395c70b6061dff1d39'),
  clue: story('古英語 cliewen「糸玉」から。迷宮を抜けるために転がした糸が「手がかり」になった。', '25185a775f99d3901409079332f22fd75f9d346b7dd9ced6890d48d3fc7ebce4'),
  nice: story('ラテン語 nescius「知らない」から。「愚かな」から「細かい」を経て「すてきな」へ意味が変わった。', '1d88c784f36ddf6ce0b4a28498d5df8616568c8cd47e23694053872a6ede5528'),
  calculate: story('ラテン語 calculus「計算に使う小石」から。', '8492c213865ca27e176829d01658bab6b8788dfb903086cd583450ce0a29b03c'),
  trivial: story('ラテン語 trivium「三叉路」から。誰もが通る場所の話題＝ありふれたこと。', 'e6f2f41faaed5b58a70b1003686367e4d32a304e4b0672f85c2586103a80a61f'),
  curfew: story('古フランス語 cuevrefeu「火を覆え」から。夜に火を消させる合図が外出を控える時刻になった。', 'f8745b434c600898c3d6287379c8e2d192245b1e657b722dd46e672bb93e83cc'),
  pencil: story('ラテン語 pēnicillus「小さな筆」から。もとは細い絵筆を指した。', 'a34ad9f94383edaceed58aea13841ad8c5a672495b22b5641a3b71c9221610f0'),
  plumber: story('ラテン語 plumbum「鉛」から。鉛管を扱う職人のこと。', '858e3d43030ccb778904bdfe31a007e8d7cbdf005d71fcc4eca1b1d78c5e271c'),
  bank: story('イタリア語 banca「両替商の台」から。台の上で金を扱ったことによる。', '51735a6891f9e0301102d88b240326357c1b9747026d7def745283074a123f56'),
  rival: story('ラテン語 rīvālis「同じ川（rīvus）を使う者」から。水をめぐって争う相手のこと。', 'f5f44a15be2e89f604e667b900774cfbb003781fd9beccba816203aa6c791500'),
  gossip: story('古英語 godsibb「名づけ親」から。親しい間柄の話し相手を経て「うわさ話」になった。', '11449887d8c1087bc1f50098ec6dc29c8310913be12d5dffb2817eea62e202f2'),
  enemy: story('ラテン語 inimīcus「友でない者」から。in-（〜でない）＋ amīcus（友）で、つづりは古フランス語を経て en- になった。', '3f3447a4f441a5e3e288e65bda36414bbed471f308326425e22a596dd3f48d12'),
  robot: story('チェコ語 robota「強制労働」から。1920年の戯曲『R.U.R.』で使われて広まった。', 'f7a37060510450067bae09af6b28da9b3d4058345048095287390b924bbc8404'),
})
