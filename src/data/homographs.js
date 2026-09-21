// 由来がちがうのに、たまたま同じつづりになった語の台帳。
//
// なぜ要るか:
// 単語カードは1見出し1枚なので、別語の意味を代表義の欄へ並べてしまいやすい。
// そうすると語源の説明が片方にしか当てはまらず、学習者は誤った由来を教わる。
// 実際に bank の意味欄へ「土手」を並べたまま「イタリア語 banca（両替商の台）」と
// だけ説明していて、土手が両替商の台に由来すると読める状態だった。
//
// 使い方:
// - 別語の意味は words*.js の meaning へ書かず、homograph-words.js に
//   独立した見出し語（id は「元の語の id_2」）として置く。
// - ここに載せた語は、代表義の欄に「別語側の意味」が現れていないかを
//   scripts/check-data.mjs が毎回確かめる。
// - まだカードに別語の意味を載せていない語も、先に登録しておく。
//   あとから足すときに混ぜてしまうのを止めるため。
//
// 何が「別語」かは語源の判断なので、機械では決められない。判断はここに固定し、
// 混入の検出だけを機械に任せる。同じ語の意味の枝分かれ（kind の「親切な／種類」、
// fine の「良い／罰金」、spring の「春／泉／ばね」など）はここへ入れない。
export const HOMOGRAPH_SEPARATE_SENSES = Object.freeze({
  // すでに homograph-words.js へ見出し語として分けてある語
  bank: Object.freeze(['土手', '堤']),
  pole: Object.freeze(['極']),
  race: Object.freeze(['人種', '民族']),
  stern: Object.freeze(['船尾']),
  swallow: Object.freeze(['ツバメ']),
  grave: Object.freeze(['重大', '厳粛']),
  quarry: Object.freeze(['獲物']),
  scale: Object.freeze(['うろこ']),
  sole: Object.freeze(['足の裏', '靴底']),
  stalk: Object.freeze(['忍び寄る', 'つけ回す']),
  post: Object.freeze(['柱', '支柱', '投稿']),
  ring: Object.freeze(['鳴る', '鳴らす']),
  stable: Object.freeze(['馬小屋', '厩舎']),
  scour: Object.freeze(['ごしごし洗う']),
  yen: Object.freeze(['強い願望', 'あこがれ']),
  well: Object.freeze(['井戸']),
  lie: Object.freeze(['横たわる']),
  left: Object.freeze(['残っている']),
  may: Object.freeze(['してよい', 'かもしれない']),
  row: Object.freeze(['口論', '騒ぎ', 'こぐ']),
  bark: Object.freeze(['樹皮']),
  last: Object.freeze(['続く', '長持ち']),
  fan: Object.freeze(['うちわ', '扇風機', '扇ぐ']),
  rest: Object.freeze(['残り']),
  bound: Object.freeze(['縛られた', '境界']),
  tense: Object.freeze(['時制']),
  flat: Object.freeze(['アパート']),
  file: Object.freeze(['やすり']),
  shed: Object.freeze(['脱ぎ捨てる']),
  tart: Object.freeze(['タルト']),
  tend: Object.freeze(['世話']),
  blow: Object.freeze(['打撃']),
  gum: Object.freeze(['歯茎']),
  hatch: Object.freeze(['昇降口']),
  loaf: Object.freeze(['のらくら']),
  mold: Object.freeze(['かび']),
  pawn: Object.freeze(['質草', '質に入れる']),
  pit: Object.freeze(['種']),
  slip: Object.freeze(['伝票']),
  spade: Object.freeze(['スペード']),
  tap: Object.freeze(['蛇口', '利用']),
  toll: Object.freeze(['鳴らす']),
  wax: Object.freeze(['満ちる']),
  raft: Object.freeze(['大量']),
  defer: Object.freeze(['従う']),
  pry: Object.freeze(['こじ開け', 'てこ']),
  march: Object.freeze(['行進']),
  mummy: Object.freeze(['ママ']),
  refrain: Object.freeze(['繰り返し']),
  lean: Object.freeze(['やせた']),
  flight: Object.freeze(['逃走']),
  light: Object.freeze(['軽い']),
  lighten: Object.freeze(['軽くする']),
  bit: Object.freeze(['ビット', '情報']),
  clip: Object.freeze(['留める']),
  tip: Object.freeze(['先端']),
  // 2026-09-21、関連語・熟語の見直しで見つかった語
  bear: Object.freeze(['耐える', '運ぶ', '産む']),
  tear: Object.freeze(['涙']),
  wind: Object.freeze(['巻く', '曲がりくねる']),
  wake: Object.freeze(['航跡']),
  counter: Object.freeze(['反論', '対抗']),
  host: Object.freeze(['大群', '多数']),
  found: Object.freeze(['設立', '創設']),
  peer: Object.freeze(['仲間', '同等の人', '同僚']),
  utter: Object.freeze(['全くの', '完全な']),
  converse: Object.freeze(['逆の']),
  sound: Object.freeze(['健全', '健康な']),
  rear: Object.freeze(['育てる', '飼育']),
  can: Object.freeze(['缶']),
  rock: Object.freeze(['揺らす', '揺れる']),
  mean: Object.freeze(['意地悪', '卑劣', 'けち']),
  like: Object.freeze(['のような', 'に似て']),
  count: Object.freeze(['伯爵']),
  box: Object.freeze(['ボクシング', '殴る']),
  bowl: Object.freeze(['転がす', '投球']),
  bow: Object.freeze(['弓', 'ちょう結び']),

  // まだカードに載せていないが、足すときは別語として分ける語
  fair: Object.freeze(['縁日', '品評会']),
  match: Object.freeze(['マッチ', 'マッチ棒']),
  mine: Object.freeze(['鉱山', '採掘']),
  lead: Object.freeze(['鉛']),
  seal: Object.freeze(['アザラシ']),
  temple: Object.freeze(['こめかみ']),
  saw: Object.freeze(['見た']),
})

// 同じつづりの別の語だが、見出し語にしないもの（2026-09-21、関連語・熟語の見直しで見つかった語）。
// 学習でまず出会わない古い語・まれな語なので、そこから来た形は元の語にもつながず
// （派生語の候補は docs/audits/word-forms-review.json に略号「同音」で見送る）、見出し語にしない理由をここに残す。
// tests/homograph-headwords.test.mjs が、「同音」で見送った候補のうち別の語の見出し語で決めていないものを、ここに書いてあるか確かめる。
export const HOMOGRAPH_NOT_HEADWORD = Object.freeze({
  angle: '「釣りをする」の angle（古英語 angul「釣り針」から）。学習でまず出会わない語で、そこから来た angler「釣り人」もまれ',
  arm: '「武器・武装させる」の arm（ラテン語 arma「武器」から）。見出し語 arms（兵器・武器）のまとまりに army・armed・armament・armor を集めてある',
  base: '「卑しい・下劣な」の base（後期ラテン語 bassus「低い」から）。学習でまず出会わない語で、baser はその比較級',
  card: '「（羊毛などを）すく」の card（ラテン語 carduus「アザミ」から）。学習でまず出会わない語で、carder もまれ',
  curry: '「（馬を）くしで手入れする」の curry（古フランス語 correier「整える」から）。学習でまず出会わない語で、currier もまれ',
  hawk: '「行商する」の hawk（中世低地ドイツ語 hōker「行商人」から来た hawker をもとに逆に作られた語）。学習でまず出会わない語で、hawker もまれ',
  list: '「望む・欲する」の list（古英語 lystan から）。今は使わない古い語で、そこから来た listless「元気のない」は語の成り立ちで説明している',
})
