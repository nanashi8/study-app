// 単語カードの代表義に入りきらない、その語のほかの意味。
//
// 大切な境界:
// - 見出し語のタプル（words*.js）が持つのは、その級で最初に出会う代表義だけ。
//   品詞が変わる意味も、同じ品詞でずっと上の級で習う意味も、ここへ置いて並べて見せる。
// - テストの答えには使わない。出題は今までどおり代表義の先頭だけを見る。
// - 級は、その意味を実際に習う級を書く。カードの級より上なら「この先の級で出てくる」と示す。
// - 由来がちがう語がたまたま同じつづりになっているだけのもの（well「上手に」と well「井戸」など）は、
//   ここへは置かず homograph-words.js の独立した見出し語にする。同じ語の意味の枝分かれだけをここに置く。
//   別の語の見出し語が持つほかの意味は、その見出し語の id（fan_2 など）で置く。
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
      pos: '形', level: '5', meaning: '健康な・元気な',
      example: Object.freeze({ en: 'I hope you get well soon.', ja: '早く元気になってね。' }),
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
      pos: '動', level: '4', meaning: 'うそをつく',
      example: Object.freeze({ en: 'She lied about her age.', ja: '彼女は年齢について嘘をついた。' }),
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
      pos: '副', level: '5', meaning: '左へ',
      example: Object.freeze({ en: 'Turn left at the bank.', ja: '銀行のところで左へ曲がって。' }),
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
  might: Object.freeze([
    Object.freeze({
      pos: '動',
      level: '3',
      meaning: '〜かもしれない（may の過去形）',
      example: Object.freeze({ en: 'It might rain this afternoon.', ja: '午後は雨が降るかもしれない。' }),
    }),
  ]),
  post: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '地位・持ち場',
      example: Object.freeze({ en: 'She left her post as manager last year.', ja: '彼女は昨年、支配人の職を離れた。' }),
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
  light: Object.freeze([
    Object.freeze({
      pos: '形', level: '5', meaning: '明るい・(色が)薄い',
      example: Object.freeze({ en: 'The room is light and warm.', ja: 'その部屋は明るくて暖かい。' }),
    }),
  ]),
  tip: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: 'チップ・心づけ',
      example: Object.freeze({ en: 'We left a tip on the table for the waiter.', ja: '私たちはウエイターのためにテーブルにチップを置いた。' }),
    }),
  ]),
  class: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '種類',
      example: Object.freeze({ en: 'Dolphins belong to the same class of animals as whales.', ja: 'イルカはクジラと同じ種類の動物に属する。' }),
    }),
    Object.freeze({
      pos: '名', level: '2', meaning: '階級',
      example: Object.freeze({ en: 'Her novel describes the life of the working class.', ja: '彼女の小説は労働者階級の暮らしを描いている。' }),
    }),
  ]),
  post_2: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '柱・支柱',
      example: Object.freeze({ en: 'The gate hangs on a wooden post.', ja: '門は木の支柱に取り付けられている。' }),
    }),
  ]),
  fan_2: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '扇ぐ・あおる',
      example: Object.freeze({ en: 'She fanned herself with a newspaper.', ja: '彼女は新聞で自分をあおいだ。' }),
    }),
  ]),
  tap_2: Object.freeze([
    Object.freeze({
      pos: '動', level: '2', meaning: '(資源・才能などを)利用する・活用する',
      example: Object.freeze({ en: 'We need to tap new sources of energy.', ja: '私たちは新しいエネルギー源を活用する必要がある。' }),
    }),
  ]),
})
