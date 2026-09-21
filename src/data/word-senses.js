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
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(数を)丸める・(round up で)集める',
      example: Object.freeze({ en: 'The teacher rounded up the children.', ja: '先生は子どもたちを集めた。' }),
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
  // 2026-09-21、関連語・熟語の見直しで、熟語や形で使う意味がカードに無かった語に足した。
  will: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '意志・遺言',
      example: Object.freeze({ en: 'She has a strong will to win.', ja: '彼女には勝とうという強い意志がある。' }),
    }),
  ]),
  spring: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '泉・ばね',
      example: Object.freeze({ en: 'There is a hot spring near the hotel.', ja: 'ホテルの近くに温泉がある。' }),
    }),
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '跳ねる・(〜から)生じる',
      example: Object.freeze({ en: 'Many problems spring from a lack of sleep.', ja: '多くの問題は睡眠不足から生じる。' }),
    }),
  ]),
  shoulder: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(責任などを)引き受ける・背負う',
      example: Object.freeze({ en: 'She shouldered the responsibility for the project.', ja: '彼女はその計画の責任を引き受けた。' }),
    }),
  ]),
  face: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '直面する・(〜の方を)向く',
      example: Object.freeze({ en: 'We face many problems every day.', ja: '私たちは毎日多くの問題に直面している。' }),
    }),
  ]),
  present: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '贈る・提示する・発表する',
      example: Object.freeze({ en: 'The mayor presented the winner with a medal.', ja: '市長は優勝者にメダルを贈った。' }),
    }),
    Object.freeze({
      pos: '形', level: '3', meaning: '出席している・現在の',
      example: Object.freeze({ en: 'All the students were present today.', ja: '今日は生徒全員が出席していた。' }),
    }),
  ]),
  set: Object.freeze([
    Object.freeze({
      pos: '動', level: '4', meaning: '置く・設定する・(日が)沈む',
      example: Object.freeze({ en: 'The sun sets in the west.', ja: '太陽は西に沈む。' }),
    }),
    Object.freeze({
      pos: '形', level: 'pre2', meaning: '決まった・準備ができた',
      example: Object.freeze({ en: 'We are all set for the trip.', ja: '私たちは旅行の準備がすっかりできている。' }),
    }),
  ]),
  subject: Object.freeze([
    Object.freeze({
      pos: '形', level: 'pre1', meaning: '(〜を)受けやすい・(〜に)左右される',
      example: Object.freeze({ en: 'The schedule is subject to change.', ja: '予定は変更されることがある。' }),
    }),
    Object.freeze({
      pos: '動', level: '1', meaning: '(〜に)さらす・従わせる',
      example: Object.freeze({ en: 'The metal was subjected to high heat.', ja: 'その金属は高熱にさらされた。' }),
    }),
  ]),
  major: Object.freeze([
    Object.freeze({
      pos: '動', level: '2', meaning: '(major in で)専攻する',
      example: Object.freeze({ en: 'She majored in economics at college.', ja: '彼女は大学で経済学を専攻した。' }),
    }),
  ]),
  tear: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '引き裂く・破る・裂ける',
      example: Object.freeze({ en: 'Be careful not to tear the paper.', ja: '紙を破らないように気をつけて。' }),
    }),
  ]),
  desert: Object.freeze([
    Object.freeze({
      pos: '動', level: '2', meaning: '見捨てる・(持ち場から)逃げ出す',
      example: Object.freeze({ en: 'The soldier deserted his post.', ja: 'その兵士は持ち場から逃げ出した。' }),
    }),
  ]),
  defect: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(国・組織を捨てて)寝返る・亡命する',
      example: Object.freeze({ en: 'The spy defected to the other side.', ja: 'そのスパイは敵側に寝返った。' }),
    }),
  ]),
  minute: Object.freeze([
    Object.freeze({
      pos: '形', level: 'pre1', meaning: '微小な・綿密な',
      example: Object.freeze({ en: 'She described the scene in minute detail.', ja: '彼女はその場面を細部まで詳しく説明した。' }),
    }),
  ]),
  counter_2: Object.freeze([
    Object.freeze({
      pos: '副', level: '1', meaning: '反対に・逆に',
      example: Object.freeze({ en: 'His actions run counter to his words.', ja: '彼の行動は言葉と反対だ。' }),
    }),
  ]),
  converse_2: Object.freeze([
    Object.freeze({
      pos: '名', level: '1', meaning: '逆・逆のこと',
      example: Object.freeze({ en: 'The converse is also true.', ja: 'その逆もまた正しい。' }),
    }),
  ]),
  can_2: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '缶詰にする',
      example: Object.freeze({ en: 'The tomatoes were canned last summer.', ja: 'そのトマトは去年の夏に缶詰にされた。' }),
    }),
  ]),
  // 2026-09-21、熟語・構文のつながりの全件を品詞の位置で洗い直し、熟語で使う品詞の意味がカードに無かった語に足した。
  narrow: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '狭める・(narrow down で)絞り込む',
      example: Object.freeze({ en: 'We narrowed the list down to three candidates.', ja: '私たちは候補を3人に絞り込んだ。' }),
    }),
  ]),
  long: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(long for で)切望する・あこがれる',
      example: Object.freeze({ en: 'She longed for a quiet life in the country.', ja: '彼女は田舎での静かな暮らしにあこがれた。' }),
    }),
  ]),
  slow: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '遅くする・(slow down で)速度を落とす',
      example: Object.freeze({ en: 'Please slow down near the school.', ja: '学校の近くでは速度を落としてください。' }),
    }),
  ]),
  bank: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '預金する・(bank on で)当てにする',
      example: Object.freeze({ en: 'You cannot bank on good weather in June.', ja: '6月は好天を当てにできない。' }),
    }),
  ]),
  amount: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '(amount to で)総計〜になる・結局〜に等しい',
      example: Object.freeze({ en: 'The cost amounted to 5,000 yen.', ja: '費用は総計5,000円になった。' }),
    }),
  ]),
  figure: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '考える・(figure out で)理解する・解決する',
      example: Object.freeze({ en: 'I finally figured out the answer.', ja: '私はついに答えが分かった。' }),
    }),
  ]),
  bottle: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: 'びんに詰める・(bottle up で)(感情を)抑え込む',
      example: Object.freeze({ en: 'Try not to bottle up your feelings.', ja: '気持ちを抑え込まないようにしなさい。' }),
    }),
  ]),
  verge: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(verge on で)〜に近い・ほとんど〜である',
      example: Object.freeze({ en: 'His confidence verged on arrogance.', ja: '彼の自信は傲慢に近かった。' }),
    }),
  ]),
  clear: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '片づける・取り除く・(空が)晴れる',
      example: Object.freeze({ en: 'Please clear the table after dinner.', ja: '夕食の後はテーブルを片づけてください。' }),
    }),
  ]),
  care: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '気にかける・(care for で)世話をする',
      example: Object.freeze({ en: 'I do not care what other people think.', ja: '他人がどう思おうと私は気にしない。' }),
    }),
  ]),
  scale: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: 'よじ登る・(scale back で)規模を縮小する',
      example: Object.freeze({ en: 'The company scaled back its plans.', ja: 'その会社は計画の規模を縮小した。' }),
    }),
  ]),
  part: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '別れる・分ける・(part with で)手放す',
      example: Object.freeze({ en: 'She did not want to part with her old books.', ja: '彼女は古い本を手放したくなかった。' }),
    }),
  ]),
  phase: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(phase in・phase out で)段階的に導入する・段階的に廃止する',
      example: Object.freeze({ en: 'The old system will be phased out next year.', ja: '古い制度は来年段階的に廃止される。' }),
    }),
  ]),
  dawn: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '夜が明ける・(dawn on で)(考えが)分かり始める',
      example: Object.freeze({ en: 'It suddenly dawned on me that I had lost my key.', ja: '鍵をなくしたことに突然気づいた。' }),
    }),
  ]),
  zero: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(zero in on で)狙いを絞る',
      example: Object.freeze({ en: 'The police zeroed in on the suspect.', ja: '警察は容疑者に狙いを絞った。' }),
    }),
  ]),
  map: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '地図を作る・(map out で)詳しく計画する',
      example: Object.freeze({ en: 'She mapped out her plans for the summer.', ja: '彼女は夏の計画を詳しく立てた。' }),
    }),
  ]),
  size: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(size up で)見定める・評価する',
      example: Object.freeze({ en: 'He quickly sized up the situation.', ja: '彼はすばやく状況を見定めた。' }),
    }),
  ]),
  shy: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(shy away from で)尻込みする・避ける',
      example: Object.freeze({ en: 'She never shies away from hard work.', ja: '彼女はきつい仕事から決して尻込みしない。' }),
    }),
  ]),
  single: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(single out で)選び出す',
      example: Object.freeze({ en: 'The teacher singled out Ken for praise.', ja: '先生は健を選び出してほめた。' }),
    }),
  ]),
  root: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '根づく・(root out で)根絶する',
      example: Object.freeze({ en: 'The government promised to root out corruption.', ja: '政府は汚職を根絶すると約束した。' }),
    }),
  ]),
  date: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre2', meaning: '日付を書く・(date back to で)〜にさかのぼる・デートする',
      example: Object.freeze({ en: 'This temple dates back to the 8th century.', ja: 'この寺は8世紀にさかのぼる。' }),
    }),
  ]),
  step: Object.freeze([
    Object.freeze({
      pos: '動', level: '3', meaning: '歩む・踏む・(step down で)辞任する',
      example: Object.freeze({ en: 'Be careful not to step on the flowers.', ja: '花を踏まないように気をつけて。' }),
    }),
  ]),
  beef: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(beef up で)強化する',
      example: Object.freeze({ en: 'The city beefed up security for the festival.', ja: '市は祭りに備えて警備を強化した。' }),
    }),
  ]),
  flesh: Object.freeze([
    Object.freeze({
      pos: '動', level: '1', meaning: '(flesh out で)肉付けする・具体化する',
      example: Object.freeze({ en: 'We need to flesh out the details of the plan.', ja: '私たちは計画の細部を具体化する必要がある。' }),
    }),
  ]),
  sum: Object.freeze([
    Object.freeze({
      pos: '動', level: 'pre1', meaning: '(sum up で)要約する・まとめる',
      example: Object.freeze({ en: 'Let me sum up the main points.', ja: '要点をまとめさせてください。' }),
    }),
  ]),
  good: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '善・利益・ためになること',
      example: Object.freeze({ en: 'The new park is for the good of the whole town.', ja: '新しい公園は町全体のためになる。' }),
    }),
  ]),
  move: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '動き・行動・引っ越し',
      example: Object.freeze({ en: 'That was a smart move.', ja: 'それは賢い行動だった。' }),
    }),
  ]),
  regard: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '点・関心・配慮・(regards で)よろしくというあいさつ',
      example: Object.freeze({ en: 'Please give my regards to your family.', ja: 'ご家族によろしくお伝えください。' }),
    }),
  ]),
  return: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '帰り・返却・見返り',
      example: Object.freeze({ en: 'We look forward to your return.', ja: 'あなたの帰りを楽しみにしています。' }),
    }),
  ]),
  search: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '捜索・検索',
      example: Object.freeze({ en: 'The search for the missing boy continued all night.', ja: '行方不明の少年の捜索は一晩中続いた。' }),
    }),
  ]),
  control: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '支配・制御・管理',
      example: Object.freeze({ en: 'The driver lost control of the car.', ja: '運転手は車を制御できなくなった。' }),
    }),
  ]),
  charge: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '料金・責任・告発',
      example: Object.freeze({ en: 'There is no charge for children.', ja: '子どもは料金がかからない。' }),
    }),
  ]),
  check: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '点検・小切手・(レストランの)勘定',
      example: Object.freeze({ en: 'Can I have the check, please?', ja: 'お勘定をお願いします。' }),
    }),
  ]),
  look: Object.freeze([
    Object.freeze({
      pos: '名', level: '4', meaning: '見ること・顔つき・外見',
      example: Object.freeze({ en: 'Let me have a look at your map.', ja: 'あなたの地図をちょっと見せて。' }),
    }),
  ]),
  need: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '必要・需要・困っていること',
      example: Object.freeze({ en: 'There is no need to hurry.', ja: '急ぐ必要はない。' }),
    }),
  ]),
  love: Object.freeze([
    Object.freeze({
      pos: '名', level: '5', meaning: '愛・恋愛・大好きなもの',
      example: Object.freeze({ en: 'Their love for each other never changed.', ja: '二人の互いへの愛は決して変わらなかった。' }),
    }),
  ]),
  help: Object.freeze([
    Object.freeze({
      pos: '名', level: '5', meaning: '助け・手伝い',
      example: Object.freeze({ en: 'Thank you for your help.', ja: '手伝ってくれてありがとう。' }),
    }),
  ]),
  break: Object.freeze([
    Object.freeze({
      pos: '名', level: '4', meaning: '休憩・中断',
      example: Object.freeze({ en: 'Let us take a short break.', ja: '少し休憩しましょう。' }),
    }),
  ]),
  say: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(have a say で)発言権',
      example: Object.freeze({ en: 'Students should have a say in school rules.', ja: '生徒も校則について発言権を持つべきだ。' }),
    }),
  ]),
  stand: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '立場・台・売店',
      example: Object.freeze({ en: 'She took a firm stand against the plan.', ja: '彼女はその計画にはっきり反対の立場をとった。' }),
    }),
  ]),
  turn: Object.freeze([
    Object.freeze({
      pos: '名', level: '4', meaning: '順番・曲がり角・転換',
      example: Object.freeze({ en: 'It is your turn to sing.', ja: '次はあなたが歌う番だ。' }),
    }),
  ]),
  visit: Object.freeze([
    Object.freeze({
      pos: '名', level: '4', meaning: '訪問・見物',
      example: Object.freeze({ en: 'This is my first visit to Kyoto.', ja: '京都に来るのはこれが初めてだ。' }),
    }),
  ]),
  contrary: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre1', meaning: '(the contrary で)反対・逆',
      example: Object.freeze({ en: 'Unless I hear to the contrary, I will come on Monday.', ja: '反対の知らせがなければ、月曜日に行きます。' }),
    }),
  ]),
  own: Object.freeze([
    Object.freeze({
      pos: '形', level: '4', meaning: '自分自身の・独自の',
      example: Object.freeze({ en: 'I want my own room.', ja: '私は自分の部屋がほしい。' }),
    }),
  ]),
  latter: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '(the latter で)後者',
      example: Object.freeze({ en: 'Of the two plans, I prefer the latter.', ja: '2つの案のうち、私は後者のほうがよい。' }),
    }),
  ]),
  touch: Object.freeze([
    Object.freeze({
      pos: '名', level: '3', meaning: '接触・手触り・連絡',
      example: Object.freeze({ en: 'Let us keep in touch.', ja: '連絡を取り合いましょう。' }),
    }),
  ]),
  best: Object.freeze([
    Object.freeze({
      pos: '名', level: '4', meaning: '最善・全力',
      example: Object.freeze({ en: 'I did my best in the race.', ja: '私はレースで全力を尽くした。' }),
    }),
  ]),
  living: Object.freeze([
    Object.freeze({
      pos: '名', level: 'pre2', meaning: '生計・暮らし',
      example: Object.freeze({ en: 'He makes a living as a writer.', ja: '彼は作家として生計を立てている。' }),
    }),
  ]),
  late: Object.freeze([
    Object.freeze({
      pos: '形', level: '5', meaning: '遅れた・遅い・故〜',
      example: Object.freeze({ en: 'I was late for school.', ja: '私は学校に遅れた。' }),
    }),
  ]),
  representative: Object.freeze([
    Object.freeze({
      pos: '形', level: 'pre1', meaning: '代表的な・典型的な',
      example: Object.freeze({ en: 'This dish is representative of Kyoto cooking.', ja: 'この料理は京料理を代表するものだ。' }),
    }),
  ]),
  home: Object.freeze([
    Object.freeze({
      pos: '副', level: '5', meaning: '家へ・家に・故郷へ',
      example: Object.freeze({ en: 'I went home early.', ja: '私は早く家に帰った。' }),
    }),
  ]),
})
