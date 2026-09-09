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
      pos: '名',
      level: '4',
      meaning: '郵便・地位・投稿する',
      separateWord: true,
      note: 'ラテン語 positus(置かれたもの)から。街道に置かれた中継所が郵便に、置かれた持ち場が地位になった。柱の post(ラテン語 postis)とは別の語。',
      example: Object.freeze({ en: 'I sent the letter by post.', ja: '私はその手紙を郵便で送った。' }),
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
})
