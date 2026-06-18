// 単語データ #74 — 英検＋大学受験 ギャップ補充⑮（分野頻出動詞：科学/医学/法律/経済/IT/社会/環境）。
import { expandCompact } from './compact.js'

const RAW = [
  ['dwindle', '動', '1', '次第に減少する・縮小する', 'savings dwindle', '貯金が次第に減る', '古英語 dwinan(衰える)。', { syn: [{ w: 'diminish', m: '減少する' }, { w: 'shrink', m: '縮む' }], ant: [{ w: 'increase', m: '増加する' }], field: '一般' }],
  ['germinate', '動', '1', '発芽する・芽生えさせる', 'seeds germinate', '種が発芽する', 'ラテン germen(芽)→ germ と同系。', { syn: [{ w: 'sprout', m: '芽を出す' }, { w: 'bud', m: '芽吹く' }], ant: [{ w: 'wither', m: '枯れる' }], fam: [{ w: 'germination', m: '発芽' }], field: '農業' }],
  ['decompose', '動', '1', '分解する・腐敗する', 'leaves decompose', '葉が分解する', 'de(分離)+compose(構成する)。', { syn: [{ w: 'rot', m: '腐る' }, { w: 'disintegrate', m: '崩壊する' }], ant: [{ w: 'compose', m: '構成する' }], fam: [{ w: 'decomposition', m: '分解' }], field: '科学' }],
  ['pollinate', '動', '1', '受粉させる', 'bees pollinate flowers', 'ミツバチが花を受粉させる', 'ラテン pollen(粉)。', { syn: [{ w: 'fertilize', m: '受精させる' }], fam: [{ w: 'pollination', m: '受粉' }], field: '科学' }],
  ['incubate', '動', '1', '卵を抱く・培養する・(構想を)温める', 'incubate the eggs', '卵を抱卵する', 'ラテン incubare(上に横たわる)。', { syn: [{ w: 'hatch', m: 'かえす' }, { w: 'nurture', m: '育てる' }], fam: [{ w: 'incubation', m: 'ふ卵' }], field: '科学' }],
  ['mutate', '動', '1', '突然変異する・変化する', 'the virus mutates', 'ウイルスが変異する', 'ラテン mutare(変える)→ mutual と同系。', { syn: [{ w: 'transform', m: '変形する' }, { w: 'alter', m: '変える' }], fam: [{ w: 'mutation', m: '突然変異' }], field: '科学' }],
  ['secrete', '動', '1', '分泌する・隠す', 'glands secrete hormones', '腺がホルモンを分泌する', 'ラテン secernere(分け離す)。', { syn: [{ w: 'discharge', m: '放出する' }, { w: 'exude', m: 'にじみ出す' }], ant: [{ w: 'absorb', m: '吸収する' }], fam: [{ w: 'secretion', m: '分泌' }], field: '医学' }],
  ['clot', '動', '1', '凝固する・(血が)固まる・凝血', 'blood clots', '血が固まる', '古英語 clott(塊)。', { syn: [{ w: 'coagulate', m: '凝固する' }, { w: 'congeal', m: '固まる' }], ant: [{ w: 'dissolve', m: '溶ける' }], field: '医学' }],
  ['sprain', '動', '2', 'ねんざする・くじき', 'sprain an ankle', '足首をねんざする', '古フランス espraindre(締めつける)。', { syn: [{ w: 'twist', m: 'ひねる' }, { w: 'wrench', m: 'くじく' }], field: '医学' }],
  ['swell', '動', 'pre1', '腫れる・膨張する・増大する', 'the ankle swells', '足首が腫れる', '古英語 swellan(膨れる)。', { syn: [{ w: 'expand', m: '膨張する' }, { w: 'bulge', m: '膨らむ' }], ant: [{ w: 'shrink', m: '縮む' }], fam: [{ w: 'swelling', m: '腫れ' }], field: '医学' }],
  ['vomit', '動', '2', '吐く・嘔吐する', 'vomit after eating', '食後に吐く', 'ラテン vomere(吐く)。', { syn: [{ w: 'throw up', m: '吐く' }, { w: 'regurgitate', m: '吐き戻す' }], ant: [{ w: 'swallow', m: '飲み込む' }], field: '医学' }],
  ['sue', '動', 'pre1', '訴える・告訴する', 'sue for damages', '損害賠償を求めて訴える', 'ラテン sequi(従う)→ pursue と同系。', { syn: [{ w: 'prosecute', m: '起訴する' }, { w: 'litigate', m: '訴訟を起こす' }], ant: [{ w: 'defend', m: '弁護する' }], fam: [{ w: 'lawsuit', m: '訴訟' }], field: '法律' }],
  ['bail', '名', 'pre1', '保釈・保釈金・救い出す', 'released on bail', '保釈で釈放される', '古フランス baillier(預ける)。', { syn: [{ w: 'bond', m: '保証金' }, { w: 'security', m: '担保' }], field: '法律' }],
  ['sentence', '動', 'pre1', '判決を下す・刑を言い渡す・文・判決', 'sentence to prison', '懲役刑を言い渡す', 'ラテン sententia(意見)→ sentiment と同系。', { syn: [{ w: 'condemn', m: '宣告する' }, { w: 'convict', m: '有罪にする' }], ant: [{ w: 'acquit', m: '無罪にする' }], field: '法律' }],
  ['deduct', '動', 'pre1', '差し引く・控除する', 'deduct from the salary', '給料から差し引く', 'ラテン de+ducere(導く)→ deduce と同系。', { syn: [{ w: 'subtract', m: '引く' }, { w: 'withhold', m: '差し控える' }], ant: [{ w: 'add', m: '加える' }], fam: [{ w: 'deduction', m: '控除' }], field: '経済' }],
  ['upload', '動', '2', 'アップロードする・転送する', 'upload a file', 'ファイルをアップロードする', 'up(上へ)+load(積む)。', { syn: [{ w: 'transfer', m: '転送する' }, { w: 'post', m: '投稿する' }], ant: [{ w: 'download', m: 'ダウンロードする' }], field: '技術' }],
  ['browse', '動', '2', '拾い読みする・閲覧する・(草を)食べる', 'browse the web', 'ウェブを閲覧する', '古フランス brouster(若芽を食う)。', { syn: [{ w: 'skim', m: '拾い読みする' }, { w: 'surf', m: 'ネットサーフィンする' }], fam: [{ w: 'browser', m: 'ブラウザー' }], field: '技術' }],
  ['stream', '動', '2', '流れる・配信する・流れ', 'stream a movie', '映画を配信視聴する', '古英語 stream(流れ)。', { syn: [{ w: 'flow', m: '流れる' }, { w: 'broadcast', m: '配信する' }], field: '技術' }],
  ['scroll', '動', '2', 'スクロールする・巻物', 'scroll down the page', 'ページを下にスクロールする', '中英語 scrowle(巻物)。', { syn: [{ w: 'roll', m: '巻く' }], field: '技術' }],
  ['hack', '動', '2', '不正侵入する・たたき切る', 'hack the system', 'システムに侵入する', '古英語 haccian(切り刻む)。', { syn: [{ w: 'breach', m: '侵入する' }, { w: 'chop', m: 'たたき切る' }], fam: [{ w: 'hacker', m: 'ハッカー' }], field: '技術' }],
  ['debug', '動', '2', 'バグを取り除く・修正する', 'debug the program', 'プログラムのバグを取る', 'de(除去)+bug(虫・不具合)。', { syn: [{ w: 'fix', m: '修正する' }, { w: 'troubleshoot', m: '不具合を解消する' }], field: '技術' }],
  ['elect', '動', 'pre1', '選出する・選ぶ', 'elect a president', '大統領を選出する', 'ラテン eligere(選び出す)→ select と同系。', { syn: [{ w: 'choose', m: '選ぶ' }, { w: 'vote in', m: '選挙で選ぶ' }], ant: [{ w: 'oust', m: '追放する' }], fam: [{ w: 'election', m: '選挙' }], field: '政治' }],
  ['boycott', '動', '1', 'ボイコットする・不買運動をする・ボイコット', 'boycott the product', '製品を不買運動する', 'ボイコット大尉(C. Boycott)の名から。', { syn: [{ w: 'shun', m: '締め出す' }, { w: 'blacklist', m: '締め出す' }], ant: [{ w: 'patronize', m: 'ひいきにする' }], field: '社会' }],
  ['colonize', '動', '1', '植民地化する・入植する', 'colonize the region', '地域を植民地化する', 'colony(植民地)+ -ize。', { syn: [{ w: 'settle', m: '入植する' }, { w: 'occupy', m: '占領する' }], ant: [{ w: 'liberate', m: '解放する' }], fam: [{ w: 'colony', m: '植民地' }], field: '歴史' }],
  ['urbanize', '動', '1', '都市化する', 'rapidly urbanize', '急速に都市化する', 'urban(都市の)+ -ize。', { syn: [{ w: 'develop', m: '開発する' }], ant: [{ w: 'ruralize', m: '田園化する' }], fam: [{ w: 'urban', m: '都市の' }], field: '社会' }],
  ['deforest', '動', '1', '森林を伐採する・森林破壊する', 'deforest the area', '地域の森林を伐採する', 'de(除去)+forest(森林)。', { syn: [{ w: 'clear', m: '切り開く' }, { w: 'log', m: '伐採する' }], ant: [{ w: 'reforest', m: '再植林する' }], fam: [{ w: 'deforestation', m: '森林破壊' }], field: '環境' }],
  ['fertilize', '動', '1', '肥料をやる・受精させる', 'fertilize the soil', '土壌に肥料を施す', 'fertile(肥沃な)+ -ize。', { syn: [{ w: 'nourish', m: '養う' }, { w: 'enrich', m: '豊かにする' }], ant: [{ w: 'deplete', m: 'やせさせる' }], fam: [{ w: 'fertilizer', m: '肥料' }], field: '農業' }],
  ['graze', '動', '2', '草を食む・放牧する・かすめる', 'cattle graze', '牛が草を食む', '古英語 grasian(草を食う)→ grass と同系。', { syn: [{ w: 'feed', m: '食べる' }, { w: 'pasture', m: '放牧する' }], field: '農業' }],
  ['sow', '動', '2', '(種を)まく・植えつける', 'sow seeds', '種をまく', '古英語 sawan(まく)。', { syn: [{ w: 'plant', m: '植える' }, { w: 'scatter', m: 'まき散らす' }], ant: [{ w: 'reap', m: '刈り取る' }], field: '農業' }],
]

export const WORDS_MORE117 = RAW.map(expandCompact)
