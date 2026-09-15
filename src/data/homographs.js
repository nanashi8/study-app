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
  row: Object.freeze(['口論', '騒ぎ']),
  bark: Object.freeze(['樹皮']),
  last: Object.freeze(['続く', '長持ち']),
  fan: Object.freeze(['うちわ', '扇風機', '扇ぐ']),
  rest: Object.freeze(['残り']),
  bound: Object.freeze(['縛られた']),
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

  // まだカードに載せていないが、足すときは別語として分ける語
  fair: Object.freeze(['縁日', '品評会']),
  match: Object.freeze(['マッチ', 'マッチ棒']),
  tear: Object.freeze(['涙']),
  mine: Object.freeze(['鉱山', '採掘']),
  lead: Object.freeze(['鉛']),
  sound: Object.freeze(['健全', '健康な']),
  seal: Object.freeze(['アザラシ']),
  host: Object.freeze(['大群', '多数']),
  temple: Object.freeze(['こめかみ']),
  saw: Object.freeze(['見た']),
})
