// 語源カードを増やすために追加した、英検・大学入試で効く古典語（ラテン語・ギリシャ語）の語根。
//
// - 語根の意味・由来は Online Etymology Dictionary と Wiktionary の見出しで確認した事実だけを短く書く。
// - 紐づく単語は綴りの自動推測ではなく、1語ずつ辞書で系統を確かめた明示リストにする。
// - LEARNING_ROOTS と違って形態素オートリンクの対象にはしない（誤検出を増やさないため）。

export const CLASSICAL_ROOTS = Object.freeze([
  Object.freeze({ id: 'ambul', form: 'ambul', meaning: '歩く', origin: 'ラテン語 ambulāre「歩く」', emoji: '🚶' }),
  Object.freeze({ id: 'anthrop', form: 'anthrop', meaning: '人間', origin: 'ギリシャ語 anthrōpos「人間」', emoji: '🧍' }),
  Object.freeze({ id: 'arch', form: 'arch / archi', meaning: '始まり・支配', origin: 'ギリシャ語 arkhē / arkhos「始まり・支配者」', emoji: '👑' }),
  Object.freeze({ id: 'cid', form: 'cid / cas', meaning: '落ちる・起こる', origin: 'ラテン語 cadere / cāsus「落ちる」', emoji: '🍂' }),
  Object.freeze({ id: 'civ', form: 'civ / cit', meaning: '市民', origin: 'ラテン語 cīvis「市民」', emoji: '🏙️' }),
  Object.freeze({ id: 'dem', form: 'dem', meaning: '民衆', origin: 'ギリシャ語 dēmos「人々」', emoji: '🧑‍🤝‍🧑' }),
  Object.freeze({ id: 'empt', form: 'empt / eem', meaning: '買う・取る', origin: 'ラテン語 emere「買う・取る」', emoji: '🧾' }),
  Object.freeze({ id: 'flict', form: 'flict', meaning: '打つ・ぶつかる', origin: 'ラテン語 flīgere「打つ」', emoji: '💥' }),
  Object.freeze({ id: 'fus', form: 'fus / fut', meaning: '注ぐ・溶かす', origin: 'ラテン語 fundere / fūsus「注ぐ」', emoji: '🫗' }),
  Object.freeze({ id: 'greg', form: 'greg', meaning: '群れ', origin: 'ラテン語 grex / gregis「群れ」', emoji: '🐑' }),
  Object.freeze({ id: 'her', form: 'her / hes', meaning: 'くっつく', origin: 'ラテン語 haerēre「くっつく」', emoji: '🧲' }),
  Object.freeze({ id: 'ide', form: 'ide / idea', meaning: '見えるもの・姿・観念', origin: 'ギリシャ語 idea「見えるもの・姿」', emoji: '💭' }),
  Object.freeze({ id: 'junct', form: 'junct / jug / join', meaning: 'つなぐ', origin: 'ラテン語 jungere「結ぶ」', emoji: '🔗' }),
  Object.freeze({ id: 'lex', form: 'leg / legis', meaning: '法', origin: 'ラテン語 lēx / lēgis「法」', emoji: '⚖️' }),
  Object.freeze({ id: 'lingu', form: 'lingu / langu', meaning: '舌・ことば', origin: 'ラテン語 lingua「舌・言語」', emoji: '👅' }),
  Object.freeze({ id: 'liter', form: 'liter', meaning: '文字', origin: 'ラテン語 littera「文字」', emoji: '🔤' }),
  Object.freeze({ id: 'log', form: 'log / logue / logy', meaning: 'ことば・理', origin: 'ギリシャ語 logos「ことば・理」', emoji: '📖' }),
  Object.freeze({ id: 'luc', form: 'luc / lumin', meaning: '光', origin: 'ラテン語 lūx / lūmen「光」', emoji: '💡' }),
  Object.freeze({ id: 'matr', form: 'matr / mater', meaning: '母・もと', origin: 'ラテン語 māter「母」', emoji: '🤱' }),
  Object.freeze({ id: 'mut', form: 'mut', meaning: '変える', origin: 'ラテン語 mūtāre「変える」', emoji: '🔁' }),
  Object.freeze({ id: 'nect', form: 'nect / nex', meaning: '結ぶ', origin: 'ラテン語 nectere「結ぶ」', emoji: '🪡' }),
  Object.freeze({ id: 'nutri', form: 'nutri / nour', meaning: '養う', origin: 'ラテン語 nūtrīre「養う」', emoji: '🍼' }),
  Object.freeze({ id: 'oper', form: 'oper', meaning: '仕事・働く', origin: 'ラテン語 opus / operārī「仕事・働く」', emoji: '🛠️' }),
  Object.freeze({ id: 'opt', form: 'opt', meaning: '選ぶ・願う', origin: 'ラテン語 optāre「選ぶ・願う」', emoji: '☑️' }),
  Object.freeze({ id: 'pati', form: 'pati / pass', meaning: '耐える・感じる', origin: 'ラテン語 patī / passus「苦しむ・耐える」', emoji: '😣' }),
  Object.freeze({ id: 'polis', form: 'poli / polit', meaning: '都市・国', origin: 'ギリシャ語 polis「都市国家」', emoji: '🏛️' }),
  Object.freeze({ id: 'pot', form: 'pot / poss', meaning: 'できる・力', origin: 'ラテン語 posse / potis「できる・力がある」', emoji: '💪' }),
  Object.freeze({ id: 'satis', form: 'satis / sat', meaning: '十分', origin: 'ラテン語 satis / satur「十分・満ちた」', emoji: '🍽️' }),
  Object.freeze({ id: 'scend', form: 'scend / scent', meaning: '登る', origin: 'ラテン語 scandere「登る」', emoji: '🧗' }),
  Object.freeze({ id: 'sen', form: 'sen', meaning: '年老いた', origin: 'ラテン語 senex「老いた」', emoji: '👴' }),
  Object.freeze({ id: 'solus', form: 'sol / sole', meaning: '一つ・単独', origin: 'ラテン語 sōlus「ただ一つの」', emoji: '🙋' }),
  Object.freeze({ id: 'soph', form: 'soph', meaning: '知恵・賢さ', origin: 'ギリシャ語 sophos / sophia「賢い・知恵」', emoji: '🦉' }),
  Object.freeze({ id: 'sper', form: 'sper', meaning: '望む', origin: 'ラテン語 spērāre「望む」', emoji: '🌈' }),
  Object.freeze({ id: 'sum', form: 'sum / sumpt', meaning: '取る・受け取る', origin: 'ラテン語 sūmere「取る」', emoji: '🫳' }),
  Object.freeze({ id: 'techn', form: 'techn', meaning: '技・わざ', origin: 'ギリシャ語 tekhnē「技術」', emoji: '🔧' }),
  Object.freeze({ id: 'trib', form: 'trib', meaning: '割り当てる・与える', origin: 'ラテン語 tribuere「分け与える」', emoji: '🎁' }),
  Object.freeze({ id: 'urb', form: 'urb', meaning: '都市', origin: 'ラテン語 urbs「都市」', emoji: '🌆' }),
  Object.freeze({ id: 'verb', form: 'verb', meaning: 'ことば', origin: 'ラテン語 verbum「ことば」', emoji: '🗨️' }),
  Object.freeze({ id: 'vict', form: 'vinc / vict', meaning: '勝つ・打ち負かす', origin: 'ラテン語 vincere「勝つ」', emoji: '🏆' }),
  Object.freeze({ id: 'vol', form: 'vol / volunt', meaning: '望む・意志', origin: 'ラテン語 velle / voluntās「望む・意志」', emoji: '🙌' }),
  Object.freeze({ id: 'vor', form: 'vor', meaning: '食う', origin: 'ラテン語 vorāre「むさぼり食う」', emoji: '🍖' }),
])

// 語根ごとの確認済み単語。ここに書いた語だけが語源カードへ載る。
export const CLASSICAL_ROOT_WORDS = Object.freeze({
  // ambul ＝ 歩く（ラテン語 ambulāre「歩く」）
  ambul: Object.freeze(['ambulance', 'amble']),
  // anthrop ＝ 人間（ギリシャ語 anthrōpos「人間」）
  anthrop: Object.freeze(['anthropology', 'misanthrope']),
  // arch / archi ＝ 始まり・支配（ギリシャ語 arkhē / arkhos「始まり・支配者」）
  arch: Object.freeze(['monarch', 'monarchy', 'architecture', 'hierarchy', 'hierarchical', 'archaic', 'archive', 'archaeology']),
  // cid / cas ＝ 落ちる・起こる（ラテン語 cadere / cāsus「落ちる」）
  cid: Object.freeze(['accident', 'accidental', 'accidentally', 'incident', 'coincide', 'occasion', 'occasional', 'occasionally', 'casual', 'casually', 'decay']),
  // civ / cit ＝ 市民（ラテン語 cīvis「市民」）
  civ: Object.freeze(['civil', 'civilian', 'civilization', 'civilize', 'civility', 'civic', 'city', 'citizen']),
  // dem ＝ 民衆（ギリシャ語 dēmos「人々」）
  dem: Object.freeze(['democracy', 'democratic', 'epidemic', 'pandemic', 'demographic', 'endemic']),
  // empt / eem ＝ 買う・取る（ラテン語 emere「買う・取る」）
  empt: Object.freeze(['exempt', 'exemption', 'redemption', 'redeem']),
  // flict ＝ 打つ・ぶつかる（ラテン語 flīgere「打つ」）
  flict: Object.freeze(['conflict', 'conflicting', 'inflict']),
  // fus / fut ＝ 注ぐ・溶かす（ラテン語 fundere / fūsus「注ぐ」）
  fus: Object.freeze(['confuse', 'confusing', 'confusion', 'refuse', 'refusal', 'diffuse', 'diffusion', 'effusive', 'profuse', 'fusion', 'fuse']),
  // greg ＝ 群れ（ラテン語 grex / gregis「群れ」）
  greg: Object.freeze(['gregarious', 'segregate', 'segregation', 'aggregate', 'egregious']),
  // her / hes ＝ くっつく（ラテン語 haerēre「くっつく」）
  her: Object.freeze(['adhere', 'coherent', 'coherence', 'cohesion', 'inherent', 'hesitate', 'hesitant', 'hesitation']),
  // ide / idea ＝ 見えるもの・姿・観念（ギリシャ語 idea「見えるもの・姿」）
  // identity / identify / identical はラテン語 idem「同じ」で別語源のため入れない。
  ide: Object.freeze(['idea', 'ideal', 'idealism', 'idealistic', 'ideology', 'ideological', 'idol']),
  // junct / jug / join ＝ つなぐ（ラテン語 jungere「結ぶ」）
  junct: Object.freeze(['join', 'joint', 'jointly', 'subjugate', 'juxtapose']),
  // leg / legis ＝ 法（ラテン語 lēx / lēgis「法」）
  lex: Object.freeze(['legal', 'illegal', 'legislate', 'legislation', 'legislative', 'legislature', 'legitimate', 'legitimacy', 'delegate', 'delegation', 'allege', 'alleged', 'allegation', 'legacy', 'loyal', 'loyalty']),
  // lingu / langu ＝ 舌・ことば（ラテン語 lingua「舌・言語」）
  lingu: Object.freeze(['language', 'linguistic', 'linguist', 'bilingual']),
  // liter ＝ 文字（ラテン語 littera「文字」）
  liter: Object.freeze(['literal', 'literally', 'literacy', 'illiteracy', 'literate', 'illiterate', 'literature', 'literary', 'obliterate']),
  // log / logue / logy ＝ ことば・理（ギリシャ語 logos「ことば・理」）
  log: Object.freeze(['logic', 'logical', 'illogical', 'dialogue', 'monologue', 'apology', 'apologize', 'analogy', 'analogous', 'ecology', 'technology', 'anthropology', 'ideology', 'methodology', 'sociology', 'psychology', 'archaeology', 'eulogy']),
  // luc / lumin ＝ 光（ラテン語 lūx / lūmen「光」）
  luc: Object.freeze(['lucid', 'elucidate', 'illuminate', 'illumination', 'illuminating']),
  // matr / mater ＝ 母・もと（ラテン語 māter「母」）
  matr: Object.freeze(['maternal', 'material']),
  // mut ＝ 変える（ラテン語 mūtāre「変える」）
  mut: Object.freeze(['mutual', 'mutation', 'mutate', 'commute', 'immutable']),
  // nect / nex ＝ 結ぶ（ラテン語 nectere「結ぶ」）
  nect: Object.freeze(['connect', 'connection', 'connectivity', 'disconnect']),
  // nutri / nour ＝ 養う（ラテン語 nūtrīre「養う」）
  nutri: Object.freeze(['nutrition', 'nutritious', 'nutrient', 'malnutrition', 'nourish', 'nourishment', 'nurture']),
  // oper ＝ 仕事・働く（ラテン語 opus / operārī「仕事・働く」）
  oper: Object.freeze(['operate', 'operation', 'operator', 'cooperate', 'cooperation', 'cooperative']),
  // opt ＝ 選ぶ・願う（ラテン語 optāre「選ぶ・願う」）
  opt: Object.freeze(['opt', 'option', 'optional', 'adopt']),
  // pati / pass ＝ 耐える・感じる（ラテン語 patī / passus「苦しむ・耐える」）
  pati: Object.freeze(['patient', 'patience', 'impatient', 'impatience', 'passion', 'passionate', 'passionately', 'compassion', 'compassionate', 'passive', 'passivity', 'compatible', 'incompatible', 'dispassionate', 'impassioned']),
  // poli / polit ＝ 都市・国（ギリシャ語 polis「都市国家」）
  polis: Object.freeze(['politics', 'political', 'policy', 'police', 'metropolitan', 'cosmopolitan']),
  // pot / poss ＝ できる・力（ラテン語 posse / potis「できる・力がある」）
  pot: Object.freeze(['potent', 'potential', 'possible', 'impossible', 'potentate']),
  // satis / sat ＝ 十分（ラテン語 satis / satur「十分・満ちた」）
  satis: Object.freeze(['satisfy', 'satisfaction', 'satisfied', 'satisfactory', 'dissatisfaction', 'dissatisfied', 'insatiable', 'saturate', 'saturation']),
  // scend / scent ＝ 登る（ラテン語 scandere「登る」）
  scend: Object.freeze(['ascend', 'ascent', 'descend', 'descent', 'descendant', 'transcend', 'transcendent', 'condescend']),
  // sen ＝ 年老いた（ラテン語 senex「老いた」）
  sen: Object.freeze(['senior', 'senator']),
  // sol / sole ＝ 一つ・単独（ラテン語 sōlus「ただ一つの」）
  solus: Object.freeze(['sole', 'solely', 'solitude', 'solitary', 'isolate', 'isolated', 'isolation', 'desolate']),
  // soph ＝ 知恵・賢さ（ギリシャ語 sophos / sophia「賢い・知恵」）
  soph: Object.freeze(['philosophy', 'sophisticated', 'sophistication']),
  // sper ＝ 望む（ラテン語 spērāre「望む」）
  sper: Object.freeze(['desperate', 'despair', 'prosper', 'prosperous']),
  // sum / sumpt ＝ 取る・受け取る（ラテン語 sūmere「取る」）
  sum: Object.freeze(['assume', 'assumption', 'consume', 'consumer', 'consumerism', 'consumption', 'resume', 'presume', 'presumably', 'presumption']),
  // techn ＝ 技・わざ（ギリシャ語 tekhnē「技術」）
  techn: Object.freeze(['technique', 'technical', 'technology', 'technician']),
  // trib ＝ 割り当てる・与える（ラテン語 tribuere「分け与える」）
  trib: Object.freeze(['contribute', 'contribution', 'contributor', 'distribute', 'distribution', 'attribute', 'retribution']),
  // urb ＝ 都市（ラテン語 urbs「都市」）
  urb: Object.freeze(['urban', 'urbanization', 'urbanize', 'suburb', 'suburban']),
  // verb ＝ ことば（ラテン語 verbum「ことば」）
  verb: Object.freeze(['verbal', 'proverb']),
  // vinc / vict ＝ 勝つ・打ち負かす（ラテン語 vincere「勝つ」）
  vict: Object.freeze(['convince', 'convinced', 'convincing', 'convincingly', 'unconvincing', 'conviction', 'convict', 'victory', 'victorious']),
  // vol / volunt ＝ 望む・意志（ラテン語 velle / voluntās「望む・意志」）
  vol: Object.freeze(['voluntary', 'volunteer', 'malevolent', 'benevolent', 'benevolence']),
  // vor ＝ 食う（ラテン語 vorāre「むさぼり食う」）
  vor: Object.freeze(['voracious', 'voracity', 'devour']),
})

