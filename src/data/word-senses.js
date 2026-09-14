// 単語カードの代表義に入りきらない、その語のほかの意味。
//
// 大切な境界:
// - 見出し語のタプル（words*.js）が持つのは、その級で最初に出会う代表義だけ。
//   品詞が変わる意味も、同じ品詞でずっと上の級で習う意味も、ここへ置いて並べて見せる。
// - テストの答えには使わない。出題は今までどおり代表義の先頭だけを見る。
// - 級は、その意味を実際に習う級を書く。カードの級より上なら「この先の級で出てくる」と示す。
// - 由来がちがう語がたまたま同じつづりになっているだけなら separateWord: true を立て、
//   note にどう別なのかを書く。同じ語の意味の枝分かれと混ぜない
//   （well「上手に」と well「井戸」、lie「うそ」と lie「横たわる」、May「5月」と may「〜かもしれない」）。
export const WORD_SENSES = Object.freeze({
  please: Object.freeze([
    Object.freeze({
      pos: '動',
      level: 'pre1',
      meaning: '喜ばせる・満足させる',
      example: Object.freeze({ en: 'He aims to please.', ja: '彼は人を喜ばせようとする。' }),
    }),
  ]),
  right: Object.freeze([
    Object.freeze({
      pos: '副',
      level: '5',
      meaning: '右へ・ちょうど',
      example: Object.freeze({ en: 'The station is right there.', ja: '駅はちょうどそこだ。' }),
    }),
    Object.freeze({
      pos: '名',
      level: '3',
      meaning: '権利',
      example: Object.freeze({ en: 'Everyone has a right to learn.', ja: '誰にでも学ぶ権利がある。' }),
    }),
  ]),
  well: Object.freeze([
    Object.freeze({
      pos: '形',
      level: '5',
      meaning: '健康な・元気な',
      example: Object.freeze({ en: 'I hope you get well soon.', ja: '早く元気になってね。' }),
    }),
    Object.freeze({
      pos: '名',
      level: '3',
      meaning: '井戸',
      separateWord: true,
      note: '古英語 wella(泉)から。「上手に」の well(古英語 wel)とは別の語で、つづりが同じになっただけ。',
      example: Object.freeze({ en: 'They dug a deep well.', ja: '彼らは深い井戸を掘った。' }),
    }),
  ]),
  back: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '4',
      meaning: '背中・後ろ',
      example: Object.freeze({ en: 'My back hurts today.', ja: '今日は背中が痛い。' }),
    }),
    Object.freeze({
      pos: '動',
      level: 'pre1',
      meaning: '支持する',
      example: Object.freeze({ en: 'They backed the plan.', ja: '彼らはその計画を支持した。' }),
    }),
  ]),
  like: Object.freeze([
    Object.freeze({
      pos: '前',
      level: '4',
      meaning: '〜のような・〜に似て',
      example: Object.freeze({ en: 'She swims like a fish.', ja: '彼女は魚のように泳ぐ。' }),
    }),
  ]),
  just: Object.freeze([
    Object.freeze({
      pos: '形',
      level: 'pre1',
      meaning: '公正な・正当な',
      example: Object.freeze({ en: 'They built a just society.', ja: '彼らは公正な社会を築いた。' }),
    }),
  ]),
  matter: Object.freeze([
    Object.freeze({
      pos: '動',
      level: 'pre1',
      meaning: '重要である',
      example: Object.freeze({ en: 'Every vote matters.', ja: '一票一票が重要だ。' }),
    }),
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '物質',
      example: Object.freeze({ en: 'Water is matter in liquid form.', ja: '水は液体の物質だ。' }),
    }),
  ]),
  project: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: '計画・企画',
      example: Object.freeze({ en: 'They started a new project.', ja: '彼らは新しい計画を始めた。' }),
    }),
  ]),
  guard: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '4',
      meaning: '守る・見張る',
      example: Object.freeze({ en: 'Two dogs guard the house.', ja: '2匹の犬が家を守っている。' }),
    }),
  ]),
  kind: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '4',
      meaning: '種類',
      example: Object.freeze({ en: 'What kind of music do you like?', ja: 'どんな種類の音楽が好きですか。' }),
    }),
  ]),
  fine: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: '罰金',
      example: Object.freeze({ en: 'He paid a fine for parking there.', ja: '彼はそこに駐車した罰金を払った。' }),
    }),
  ]),
  sound: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '4',
      meaning: '〜に聞こえる・〜のようだ',
      example: Object.freeze({ en: 'That sounds interesting.', ja: 'それは面白そうですね。' }),
    }),
  ]),
  mind: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '4',
      meaning: '気にする・いやだと思う',
      example: Object.freeze({ en: 'Do you mind the noise?', ja: '騒音が気になりますか。' }),
    }),
  ]),
  lie: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '4',
      meaning: 'うそをつく',
      example: Object.freeze({ en: 'She lied about her age.', ja: '彼女は年齢について嘘をついた。' }),
    }),
    Object.freeze({
      pos: '動',
      level: '3',
      meaning: '横たわる・（物が）ある',
      separateWord: true,
      note: '古英語 licgan から。「うそをつく」の lie(古英語 lēogan)とは別の語で、活用も lie-lay-lain と変わる。',
      example: Object.freeze({ en: 'The book lies on the desk.', ja: '本が机の上にある。' }),
    }),
  ]),
  land: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '4',
      meaning: '陸地・土地',
      example: Object.freeze({ en: 'They finally saw land.', ja: '彼らはついに陸地を見た。' }),
    }),
  ]),
  watch: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '5',
      meaning: '腕時計・懐中時計',
      example: Object.freeze({ en: 'My watch has stopped.', ja: '私の腕時計が止まった。' }),
    }),
  ]),
  still: Object.freeze([
    Object.freeze({
      pos: '副',
      level: 'pre2',
      meaning: 'さらに・いっそう',
      example: Object.freeze({ en: 'This bag is still larger.', ja: 'このかばんはさらに大きい。' }),
    }),
  ]),
  round: Object.freeze([
    Object.freeze({
      pos: '副',
      level: 'pre2',
      meaning: 'ぐるりと・周りを',
      example: Object.freeze({ en: 'They looked round the room.', ja: '彼らは部屋をぐるりと見回した。' }),
    }),
  ]),
  left: Object.freeze([
    Object.freeze({
      pos: '副',
      level: '5',
      meaning: '左へ',
      example: Object.freeze({ en: 'Turn left at the bank.', ja: '銀行のところで左へ曲がって。' }),
    }),
    Object.freeze({
      pos: '形',
      level: '4',
      meaning: '残っている',
      separateWord: true,
      note: 'leave(去る・残す)の過去分詞が同じつづりになったもの。方向の left(古英語 lyft)とは別の語。',
      example: Object.freeze({ en: 'Only two tickets are left.', ja: '切符は2枚しか残っていない。' }),
    }),
  ]),
  content: Object.freeze([
    Object.freeze({
      pos: '形',
      level: 'pre1',
      meaning: '満足して',
      example: Object.freeze({ en: 'She is content with her life.', ja: '彼女は自分の生活に満足している。' }),
    }),
    Object.freeze({
      pos: '動',
      level: 'pre1',
      meaning: '満足させる',
      example: Object.freeze({ en: 'The gift contented the child.', ja: 'その贈り物は子どもを満足させた。' }),
    }),
  ]),
  private: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '兵卒・一兵卒',
      example: Object.freeze({ en: 'He served as a private.', ja: '彼は一兵卒として従軍した。' }),
    }),
  ]),
  insular: Object.freeze([
    Object.freeze({
      pos: '形',
      level: '1',
      meaning: '島の・島に囲まれた',
      example: Object.freeze({ en: 'The insular city lies in the bay.', ja: 'その島の町は湾の中にある。' }),
    }),
  ]),
  may: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '5',
      meaning: '〜してよい・〜かもしれない',
      separateWord: true,
      note: '古英語 magan(〜できる)から。月名の May(ローマ女神 Maia)とは別の語で、つづりが同じになっただけ。can・must と同じ助動詞の仲間。',
      example: Object.freeze({ en: 'May I use your pen?', ja: 'ペンを使ってもいいですか。' }),
    }),
  ]),
  might: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '3',
      meaning: '〜かもしれない（may の過去形）',
      example: Object.freeze({ en: 'It might rain this afternoon.', ja: '午後は雨が降るかもしれない。' }),
    }),
  ]),
  bank: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '4',
      meaning: '土手・堤',
      separateWord: true,
      note: '古ノルド語 banki(土手)から。銀行の bank はイタリア語 banca(両替商の台)を通って入った別の語で、意味のつながりはない。',
      example: Object.freeze({ en: 'They walked along the river bank.', ja: '彼らは川の土手を歩いた。' }),
    }),
  ]),
  pole: Object.freeze([
    Object.freeze({
      pos: '名',
      level: '3',
      meaning: '極・極地',
      separateWord: true,
      note: 'ギリシャ語 polos(回転の軸)から。棒の pole(ラテン語 palus=杭)とは別の語。',
      example: Object.freeze({ en: 'Penguins live near the South Pole.', ja: 'ペンギンは南極の近くにすむ。' }),
    }),
  ]),
  race: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: '人種・民族',
      separateWord: true,
      note: 'イタリア語 razza(血統)から。競走の race(古ノルド語 ras=突進)とは別の語。',
      example: Object.freeze({ en: 'People of every race joined the festival.', ja: 'あらゆる人種の人々が祭りに加わった。' }),
    }),
  ]),
  stern: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '船尾',
      separateWord: true,
      note: '古ノルド語 stjorn(舵取り)から。steer(かじを取る)と同じ仲間で、厳格な stern(古英語 styrne)とは別の語。',
      example: Object.freeze({ en: 'She stood at the stern of the ship.', ja: '彼女は船の船尾に立っていた。' }),
    }),
  ]),
  swallow: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: 'ツバメ',
      separateWord: true,
      note: '古英語 swealwe(ツバメ)から。飲み込む swallow(古英語 swelgan)とは別の語。',
      example: Object.freeze({ en: 'A swallow built a nest under the roof.', ja: 'ツバメが屋根の下に巣を作った。' }),
    }),
  ]),
  grave: Object.freeze([
    Object.freeze({
      pos: '形',
      level: 'pre2',
      meaning: '重大な・厳粛な',
      separateWord: true,
      note: 'ラテン語 gravis(重い)から。gravity(重力)と同じ仲間で、墓の grave(古英語 græf=掘った穴)とは別の語。',
      example: Object.freeze({ en: 'They faced a grave problem.', ja: '彼らは重大な問題に直面した。' }),
    }),
  ]),
  quarry: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '獲物・追われるもの',
      separateWord: true,
      note: '古フランス語 cuiriee(猟犬に与える獲物)から。採石場の quarry(ラテン語 quadrare=四角に切り出す)とは別の語。',
      example: Object.freeze({ en: 'The hawk spotted its quarry.', ja: 'タカは獲物を見つけた。' }),
    }),
  ]),
  scale: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: 'うろこ',
      separateWord: true,
      note: '「殻・薄い板」を表すゲルマン系の語から。規模の scale(ラテン語 scala=はしご)とは別の語。',
      example: Object.freeze({ en: 'Fish are covered with small scales.', ja: '魚は小さなうろこに覆われている。' }),
    }),
  ]),
  sole: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: '足の裏・靴底',
      separateWord: true,
      note: 'ラテン語 solea(サンダル)から。唯一の sole(ラテン語 solus=ひとりの)とは別の語。',
      example: Object.freeze({ en: 'The soles of his shoes were worn.', ja: '彼の靴の底はすり減っていた。' }),
    }),
  ]),
  stalk: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '2',
      meaning: '忍び寄る・つけ回す',
      separateWord: true,
      note: '古英語 bestealcian(こっそり歩く)から。steal(盗む)と同じ仲間で、茎の stalk(古英語 stalu=支柱)とは別の語。',
      example: Object.freeze({ en: 'The cat stalked the bird.', ja: '猫は鳥に忍び寄った。' }),
    }),
  ]),
  post: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '地位・持ち場',
      example: Object.freeze({ en: 'She left her post as manager last year.', ja: '彼女は昨年、支配人の職を離れた。' }),
    }),
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '柱・支柱',
      separateWord: true,
      note: 'ラテン語 postis(戸口の柱)から。郵便・地位の post(イタリア語 posta・posto、さらにラテン語 pōnere=置く から)とは別の語。',
      example: Object.freeze({ en: 'The gate hangs on a wooden post.', ja: '門は木の支柱に取り付けられている。' }),
    }),
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '(ネットに)投稿する・掲示する',
      separateWord: true,
      note: '柱の post から。柱に貼り紙を掲げる→掲示する→ネットに載せる→投稿する。郵便の post とは別の語。',
      example: Object.freeze({ en: 'She posted a photo of her dog online.', ja: '彼女は自分の犬の写真をネットに投稿した。' }),
    }),
  ]),
  ring: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '5',
      meaning: '鳴る・鳴らす',
      separateWord: true,
      note: '古英語 hringan(音を出す)から。指輪・輪の ring(古英語 hring)とは別の語。',
      example: Object.freeze({ en: 'The bell rings at eight.', ja: 'ベルは8時に鳴る。' }),
    }),
  ]),
  stable: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre2',
      meaning: '馬小屋・厩舎',
      separateWord: true,
      note: 'ラテン語 stabulum(家畜を立たせておく場所)から。安定した stable(ラテン語 stabilis)と同じ「立つ」の語根から出たが、別々に英語へ入った別の語。',
      example: Object.freeze({ en: 'The horses returned to the stable.', ja: '馬は厩舎へ戻った。' }),
    }),
  ]),
  scour: Object.freeze([
    Object.freeze({
      pos: '動',
      level: 'pre1',
      meaning: 'ごしごし洗う・磨く',
      separateWord: true,
      note: '後期ラテン語 excurare(きれいに洗う)から。捜し回る scour とは別の語で、つづりが同じになった。',
      example: Object.freeze({ en: 'He scoured the pot until it shone.', ja: '彼は鍋が光るまでごしごし洗った。' }),
    }),
  ]),
  yen: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '強い願望・あこがれ',
      separateWord: true,
      note: '中国語で阿片への渇望を指した語から。通貨の yen(日本語の「円」)とは別の語。',
      example: Object.freeze({ en: 'She had a yen for travel.', ja: '彼女は旅へのあこがれを抱いていた。' }),
    }),
  ]),
  row: Object.freeze([
    Object.freeze({
      pos: '名',
      level: 'pre1',
      meaning: '口論・騒ぎ',
      separateWord: true,
      note: '「列」の row(古英語 raw)とは別系統の語で、発音も /raʊ/ と異なる。',
      example: Object.freeze({ en: 'They had a row about money.', ja: '彼らはお金のことで口論した。' }),
    }),
  ]),
  even: Object.freeze([
    Object.freeze({
      pos: '形',
      level: 'pre2',
      meaning: '平らな・均一な',
      example: Object.freeze({ en: 'The table needs an even surface.', ja: 'そのテーブルには平らな面が必要だ。' }),
    }),
    Object.freeze({
      pos: '形',
      level: 'pre2',
      meaning: '偶数の・互角の',
      example: Object.freeze({ en: 'Two and four are even numbers.', ja: '2と4は偶数だ。' }),
    }),
  ]),
  air: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '放送する・（意見を）述べる',
      example: Object.freeze({ en: 'They aired the program last night.', ja: '彼らは昨夜その番組を放送した。' }),
    }),
  ]),
  sentence: Object.freeze([
    Object.freeze({
      pos: '動', level: '2', meaning: '判決を下す・刑を言い渡す',
      example: Object.freeze({ en: 'The court sentenced him to two years.', ja: '法廷は彼に2年の刑を言い渡した。' }),
    }),
  ]),
  sort: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '仕分ける・分類する',
      example: Object.freeze({ en: 'Please sort the mail by date.', ja: '郵便を日付で仕分けてください。' }),
    }),
  ]),
  list: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '列挙する・一覧にする',
      example: Object.freeze({ en: 'The report lists every change.', ja: 'その報告書はすべての変更を列挙している。' }),
    }),
  ]),
  snap: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: 'かみつこうとする・かみつくように言う',
      example: Object.freeze({ en: 'The dog snapped at my hand.', ja: 'その犬は私の手にかみつこうとした。' }),
    }),
    Object.freeze({
      pos: '形', level: 'pre1', meaning: 'とっさの・即座の',
      example: Object.freeze({ en: 'I had to make a snap decision.', ja: '私はとっさに決めなければならなかった。' }),
    }),
  ]),
  bark: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '樹皮',
      separateWord: true,
      note: '古ノルド語 börkr(木の皮)から。ほえる bark(古英語 beorcan)とは別の語で、つづりが同じになっただけ。',
      example: Object.freeze({ en: 'The bark of this tree is very rough.', ja: 'この木の樹皮はとてもざらざらしている。' }),
    }),
  ]),
  last: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '続く・長持ちする',
      separateWord: true,
      note: '古英語 lǣstan(あとに続く・持ちこたえる)から。最後の last(古英語 latost=最も遅い)とは別の語。',
      example: Object.freeze({ en: 'The meeting lasted two hours.', ja: '会議は2時間続いた。' }),
    }),
  ]),
  fan: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '扇風機・うちわ',
      separateWord: true,
      note: 'ラテン語 vannus(箕=もみ殻をあおいで飛ばす道具)から。熱心な愛好者の fan(fanatic=熱狂的な人 を短くした語)とは別の語。',
      example: Object.freeze({ en: 'Please turn on the fan.', ja: '扇風機をつけてください。' }),
    }),
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '扇ぐ・あおる',
      separateWord: true,
      note: 'うちわの fan と同じ語で、ラテン語 vannus(箕)から。熱心な愛好者の fan とは別の語。',
      example: Object.freeze({ en: 'She fanned herself with a newspaper.', ja: '彼女は新聞で自分をあおいだ。' }),
    }),
  ]),
  rest: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '残り・その他',
      separateWord: true,
      note: 'ラテン語 restāre(後に残る)からフランス語を経て入った語。休む rest(古英語 ræst)とは別の語。',
      example: Object.freeze({ en: 'I will eat the rest of the cake tomorrow.', ja: 'ケーキの残りは明日食べよう。' }),
    }),
  ]),
  bound: Object.freeze([
    Object.freeze({
      pos: '形', level: 'pre2', meaning: '縛られた・きっと〜する・〜する義務がある',
      separateWord: true,
      note: 'bind(縛る)の過去分詞から。〜行きの bound(古ノルド語 búinn=準備ができた)とは別の語。',
      example: Object.freeze({ en: 'It is bound to rain tomorrow.', ja: '明日はきっと雨が降る。' }),
    }),
  ]),
  tense: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '(文法の)時制',
      separateWord: true,
      note: '古フランス語 tens(時)、さらにラテン語 tempus(時)から。緊張した tense(ラテン語 tēnsus=張られた)とは別の語。',
      example: Object.freeze({ en: 'Use the past tense in this sentence.', ja: 'この文では過去時制を使いなさい。' }),
    }),
  ]),
  flat: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'アパート・(1世帯分の)住まい',
      separateWord: true,
      note: '古英語 flett(床・住まい)から来たとされる。平らな flat(古ノルド語 flatr)とは別の語。',
      example: Object.freeze({ en: 'They live in a small flat in London.', ja: '彼らはロンドンの小さなアパートに住んでいる。' }),
    }),
  ]),
  file: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: 'やすり',
      separateWord: true,
      note: '古英語 fēol(やすり)から。書類の file(ラテン語 fīlum=糸)とは別の語。',
      example: Object.freeze({ en: 'He smoothed the rough edge with a file.', ja: '彼はざらざらした縁をやすりでなめらかにした。' }),
    }),
  ]),
  shed: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '脱ぎ捨てる・(涙を)流す・(光を)当てる',
      separateWord: true,
      note: '古英語 scēadan(分ける・切り離す)から。小屋の shed(shade=日陰 の変化形とされる)とは別の語。',
      example: Object.freeze({ en: 'The snake sheds its skin every year.', ja: 'そのヘビは毎年皮を脱ぎ捨てる。' }),
    }),
  ]),
  tart: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'タルト(果物などをのせた焼き菓子)',
      separateWord: true,
      note: '古フランス語 tarte(焼き菓子)から。酸味のある tart(古英語 teart=鋭い)とは別の語。',
      example: Object.freeze({ en: 'We had apple tart for dessert.', ja: '私たちはデザートにアップルタルトを食べた。' }),
    }),
  ]),
  tend: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '世話をする・手入れする',
      separateWord: true,
      note: 'attend(付き添う・世話をする)の頭が落ちてできた語。〜しがちである tend と同じラテン語 tendere(伸ばす・向ける)にさかのぼるが、別々にできた別の語。',
      example: Object.freeze({ en: 'She tends her garden every morning.', ja: '彼女は毎朝庭の手入れをする。' }),
    }),
  ]),
  blow: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '打撃・(心の)ショック',
      separateWord: true,
      note: '中英語 blaw(打つこと)から。中世オランダ語 blouwen(打つ)と関係するとされる。吹く blow(古英語 blāwan)とは別の語。',
      example: Object.freeze({ en: 'Losing the final was a heavy blow to the team.', ja: '決勝で負けたことはチームにとって大きな打撃だった。' }),
    }),
  ]),
  gum: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '歯茎',
      separateWord: true,
      note: '古英語 gōma(口の中・あご)から。ガム・ゴムの gum(古フランス語 gomme=樹脂)とは別の語で、つづりが同じになっただけ。',
      example: Object.freeze({ en: 'My gums hurt when I brush my teeth too hard.', ja: '歯を強くみがきすぎると、歯茎が痛くなる。' }),
    }),
  ]),
  hatch: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(船・飛行機の)昇降口・ハッチ',
      separateWord: true,
      note: '古英語 hæc(半分の戸・格子戸)から。卵がかえる hatch(中英語 hacchen)とは別の語。',
      example: Object.freeze({ en: 'The sailor climbed down through the hatch.', ja: 'その船員は昇降口から下へ降りた。' }),
    }),
  ]),
  loaf: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: 'のらくらする・ぶらぶら過ごす',
      separateWord: true,
      note: '19世紀アメリカの loafer(なまけ者)から逆に作られた語。パンの loaf(古英語 hlāf)とは別の語。',
      example: Object.freeze({ en: 'He loafed around the house all weekend.', ja: '彼は週末ずっと家でのらくら過ごした。' }),
    }),
  ]),
  mold: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'かび',
      separateWord: true,
      note: '中英語 moulde(かびが生えた)から。型の mold(ラテン語 modulus=小さな尺度・型)とは別の語。',
      example: Object.freeze({ en: 'There was mold on the old bread.', ja: '古いパンにかびが生えていた。' }),
    }),
  ]),
  pawn: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '質に入れる・質草にする',
      separateWord: true,
      note: '古フランス語 pan(担保・質)から。チェスの歩や手先の pawn(古フランス語 peon=歩兵)とは別の語。',
      example: Object.freeze({ en: 'He had to pawn his watch to pay the rent.', ja: '彼は家賃を払うために腕時計を質に入れなければならなかった。' }),
    }),
  ]),
  pit: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(モモ・サクランボなどの)種',
      separateWord: true,
      note: 'オランダ語 pit(芯・種)から。穴の pit(古英語 pytt)とは別の語。',
      example: Object.freeze({ en: 'Be careful of the pits when you eat cherries.', ja: 'サクランボを食べるときは種に気をつけて。' }),
    }),
  ]),
  slip: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '伝票・細長い紙切れ',
      separateWord: true,
      note: '中世オランダ語 slippe(切れ端)から来たとされる。滑る slip(中世低地ドイツ語 slippen)とは別の語。',
      example: Object.freeze({ en: 'Please keep this slip until you pick up your bag.', ja: 'かばんを受け取るまで、この伝票を持っていてください。' }),
    }),
  ]),
  spade: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '(トランプの)スペード',
      separateWord: true,
      note: 'イタリア語 spada(剣)の複数形 spade から。すきの spade(古英語 spadu)とは別の語。',
      example: Object.freeze({ en: 'She drew the ace of spades.', ja: '彼女はスペードのエースを引いた。' }),
    }),
  ]),
  tap: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '蛇口',
      separateWord: true,
      note: '古英語 tæppa(栓)から。軽くたたく tap(古フランス語 taper)とは別の語。',
      example: Object.freeze({ en: 'Turn off the tap while you brush your teeth.', ja: '歯をみがいている間は蛇口を閉めなさい。' }),
    }),
    Object.freeze({
      pos: '動', level: '2', meaning: '(資源・才能などを)利用する・活用する',
      separateWord: true,
      note: '蛇口の tap(古英語 tæppa=栓)から。栓を開けて中身を取り出す→利用する。軽くたたく tap とは別の語。',
      example: Object.freeze({ en: 'We need to tap new sources of energy.', ja: '私たちは新しいエネルギー源を活用する必要がある。' }),
    }),
  ]),
  toll: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(鐘を)ゆっくり鳴らす',
      separateWord: true,
      note: '中英語 tollen(引く・誘う)から来たとされる。通行料の toll(古英語 toll)とは別の語。',
      example: Object.freeze({ en: 'The church bell tolled at noon.', ja: '正午に教会の鐘がゆっくりと鳴った。' }),
    }),
  ]),
  wax: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(月が)満ちる・大きくなる',
      separateWord: true,
      note: '古英語 weaxan(育つ・大きくなる)から。ろうの wax(古英語 weax)とは別の語。',
      example: Object.freeze({ en: 'The moon waxes and wanes every month.', ja: '月は毎月満ちたり欠けたりする。' }),
    }),
  ]),
  raft: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '大量・たくさん',
      separateWord: true,
      note: '中英語 raf(山・がらくた)から来た方言の語 raff の変化形とされる。いかだの raft(古ノルド語 raptr=丸太)とは別の語。',
      example: Object.freeze({ en: 'The company introduced a raft of new rules.', ja: 'その会社は新しい規則を大量に導入した。' }),
    }),
  ]),
  defer: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(意見・判断に)従う・敬意を表して譲る',
      separateWord: true,
      note: 'ラテン語 dēferre(ゆだねる・運び渡す)から。延期する defer(ラテン語 differre=先へ運ぶ)とは別の語。',
      example: Object.freeze({ en: 'I will defer to your judgment.', ja: 'あなたの判断に従います。' }),
    }),
  ]),
  pry: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: 'てこでこじ開ける',
      separateWord: true,
      note: 'てこを表す prize(古フランス語 prise=つかむこと)を複数形と取り違えて作られた語。詮索する pry(中英語 prien=のぞき込む)とは別の語。',
      example: Object.freeze({ en: 'He pried the lid off with a screwdriver.', ja: '彼はドライバーでふたをこじ開けた。' }),
    }),
  ]),
  march: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '行進する',
      separateWord: true,
      note: 'フランス語 marcher(歩く)から。月名の March(ラテン語 Mārtius=軍神マルスの)とは別の語。',
      example: Object.freeze({ en: 'The band marched down the main street.', ja: '楽隊が大通りを行進した。' }),
    }),
  ]),
  mummy: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'ママ・お母さん',
      separateWord: true,
      note: '子どもが母を呼ぶ mammy・mommy と同じ呼び方から来たイギリスの語。ミイラの mummy(アラビア語 mūmiyā から)とは別の語。',
      example: Object.freeze({ en: 'Mummy, can I have some juice?', ja: 'ママ、ジュースを飲んでもいい？' }),
    }),
  ]),
  refrain: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(歌・詩の)繰り返しの部分',
      separateWord: true,
      note: '古フランス語 refrain(繰り返し句)から。差し控える refrain(ラテン語 refrēnāre=手綱で抑える)とは別の語。',
      example: Object.freeze({ en: 'Everyone sang along with the refrain.', ja: 'みんなが繰り返しの部分で一緒に歌った。' }),
    }),
  ]),
  lean: Object.freeze([
    Object.freeze({
      pos: '形', level: 'pre2', meaning: 'やせた・(肉が)脂肪の少ない・むだのない',
      separateWord: true,
      note: '古英語 hlǣne(やせた)から。寄りかかる lean(古英語 hleonian)とは別の語。',
      example: Object.freeze({ en: 'He is tall and lean.', ja: '彼は背が高くやせている。' }),
    }),
  ]),
  flight: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '逃走・逃避',
      separateWord: true,
      note: 'flee(逃げる、古英語 flēon)の仲間の古い語から。飛行の flight(fly=飛ぶ の仲間)とは別の語で、つづりが同じになった。',
      example: Object.freeze({ en: 'The thief took flight when he saw the police.', ja: '泥棒は警察を見て逃げ出した。' }),
    }),
  ]),
  light: Object.freeze([
    Object.freeze({
      pos: '形', level: '5', meaning: '明るい・(色が)薄い',
      example: Object.freeze({ en: 'The room is light and warm.', ja: 'その部屋は明るくて暖かい。' }),
    }),
    Object.freeze({
      pos: '形', level: '5', meaning: '軽い',
      separateWord: true,
      note: '古英語 lēoht(重さが軽い)から。光の light(古英語 lēoht=光)とは語根がちがう別の語で、つづりが同じになっただけ。',
      example: Object.freeze({ en: 'This bag is very light.', ja: 'このかばんはとても軽い。' }),
    }),
  ]),
  bit: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(情報量の単位の)ビット',
      separateWord: true,
      note: 'binary digit(2進数の桁)を縮めて20世紀に作られた語。小片の bit とは別の語だが、「わずかな量」にかけて選ばれたとされる。',
      example: Object.freeze({ en: 'A byte is made up of eight bits.', ja: '1バイトは8ビットでできている。' }),
    }),
  ]),
  clip: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '(クリップで)留める・はさむ',
      separateWord: true,
      note: '古英語 clyppan(抱きしめる・しっかりつかむ)から。切り取る clip(古ノルド語 klippa)とは別の語で、紙をはさむクリップはこちら。',
      example: Object.freeze({ en: 'Clip these papers together.', ja: 'これらの書類をクリップで留めて。' }),
    }),
  ]),
  tip: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'チップ・心づけ',
      example: Object.freeze({ en: 'We left a tip on the table for the waiter.', ja: '私たちはウエイターのためにテーブルにチップを置いた。' }),
    }),
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '先端・先',
      separateWord: true,
      note: '中世オランダ語 tip(先端)から。助言・チップの tip(17世紀の隠語 tip=そっと手渡す から)とは別の語。',
      example: Object.freeze({ en: 'The tip of my pencil broke.', ja: '鉛筆の先が折れた。' }),
    }),
  ]),
  lighten: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '軽くする・(負担を)和らげる',
      separateWord: true,
      note: '「軽い」の light(古英語 lēoht=重さが軽い)に -en がついた語。明るくする lighten(「光」の light から)とは別の語。',
      example: Object.freeze({ en: 'Sharing the work will lighten your load.', ja: '仕事を分け合えば、あなたの負担は軽くなる。' }),
    }),
  ]),
})
