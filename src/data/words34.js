// 単語データ（継続 / 6000語へ）— 材料/道具/労働・思考の動詞/大きさ・時間の形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 材料・物質
  ['steel', '名', 'pre1', '鋼鉄', 'The bridge is made of steel.', 'その橋は鋼鉄製だ。', '古英語 stȳle「鋼」。', { syn: [{ w: 'iron', m: '鉄' }], field: '技術' }],
  ['bronze', '名', 'pre1', '青銅・ブロンズ', 'The statue is made of bronze.', 'その像は青銅製だ。', 'イタリア bronzo。', { field: '技術' }],
  ['aluminum', '名', 'pre1', 'アルミニウム', 'Cans are made of aluminum.', '缶はアルミ製だ。', 'ラテン alumen(ミョウバン)。', { field: '科学' }],
  ['rubber', '名', '3', 'ゴム・消しゴム', 'Tires are made of rubber.', 'タイヤはゴム製だ。', 'rub(こする)+ -er→こすって消す物。', { field: '科学' }],
  ['fiber', '名', 'pre1', '繊維・食物繊維', 'Cotton is a natural fiber.', '綿は天然繊維だ。', 'ラテン fibra(繊維)。', { syn: [{ w: 'thread', m: '糸' }], field: '科学' }],
  ['fabric', '名', 'pre1', '織物・生地・構造', 'The dress is made of soft fabric.', 'そのドレスは柔らかい生地だ。', 'ラテン fabrica(工房)→ fabricate と同系。', { syn: [{ w: 'cloth', m: '布' }, { w: 'material', m: '素材' }], field: '一般' }],
  ['wool', '名', '4', '羊毛・ウール', 'This sweater is made of wool.', 'このセーターはウール製だ。', '古英語 wull「羊毛」。', { field: '一般' }],
  ['silk', '名', '3', '絹・シルク', 'The scarf is pure silk.', 'そのスカーフは絹100%だ。', '古英語 sioloc(絹)。', { field: '一般' }],
  ['leather', '名', '3', '革・皮革', 'He bought leather shoes.', '彼は革靴を買った。', '古英語 lether「革」。', { field: '一般' }],
  ['marble', '名', 'pre1', '大理石・ビー玉', 'The floor is made of marble.', '床は大理石でできている。', 'ギリシャ marmaros(輝く石)。', { field: '建築' }],
  ['concrete', '名', 'pre1', 'コンクリート・具体的な(形)', 'The wall is solid concrete.', '壁は頑丈なコンクリートだ。', 'ラテン con+crescere(ともに育つ)→かたまる。', { ant: [{ w: 'abstract', m: '抽象的な' }], field: '建築' }],
  ['timber', '名', 'pre1', '木材・材木', 'The house is built of timber.', 'その家は木材で建てられている。', '古英語 timber(建材)。', { syn: [{ w: 'wood', m: '木材' }, { w: 'lumber', m: '材木' }], field: '農業' }],
  ['ore', '名', '1', '鉱石', 'They mine iron ore here.', 'ここでは鉄鉱石を採掘する。', '古英語 ār(銅)。', { field: '科学' }],
  // 道具
  ['hammer', '名', '3', 'ハンマー・金づち・打ちつける(動)', 'He hit the nail with a hammer.', '彼は金づちで釘を打った。', '古英語 hamor「金づち」。', { field: '技術' }],
  ['nail', '名', '3', '釘・つめ', 'Hammer the nail into the wood.', '釘を木に打ち込んで。', '古英語 nægl「つめ・釘」。', { field: '技術' }],
  ['screw', '名', 'pre1', 'ねじ・ねじで留める(動)', 'Tighten the screw.', 'ねじを締めて。', '古フランス escroue(雌ねじ)。', { field: '技術' }],
  ['drill', '名', 'pre1', 'ドリル・訓練・穴をあける(動)', 'Use a drill to make a hole.', '穴をあけるにはドリルを使って。', 'オランダ drillen(回す)。', { syn: [{ w: 'practice', m: '練習' }], field: '技術' }],
  ['saw', '名', 'pre1', 'のこぎり・のこぎりで切る(動)', 'He cut the board with a saw.', '彼はのこぎりで板を切った。', '古英語 sagu「のこぎり」。', { field: '技術' }],
  ['gear', '名', 'pre1', '歯車・道具・装備', 'The bike has six gears.', 'その自転車は6段変速だ。', '古ノルド gervi(装備)。', { syn: [{ w: 'equipment', m: '装備' }], field: '技術' }],
  ['lever', '名', '1', 'てこ・レバー', 'Pull the lever to start.', '始めるにはレバーを引いて。', 'ラテン levare(持ち上げる)→ levis(軽い)。', { field: '技術' }],
  ['valve', '名', '1', '弁・バルブ', 'The valve controls the flow.', '弁が流れを制御する。', 'ラテン valva(扉の片側)。', { field: '技術' }],
  ['pipe', '名', '3', '管・パイプ', 'Water flows through the pipe.', '水が管を通って流れる。', '俗ラテン pipa(笛)。', { syn: [{ w: 'tube', m: '管' }], field: '技術' }],
  ['wire', '名', '3', '針金・電線・電報', 'The fence is made of wire.', 'その柵は針金製だ。', '古英語 wīr「針金」。', { syn: [{ w: 'cable', m: 'ケーブル' }], field: '技術' }],
  // 労働・努力の動詞
  ['fulfill', '動', 'pre1', '果たす・満たす', 'She fulfilled her promise.', '彼女は約束を果たした。', 'ful(完全に)+fill(満たす)。', { syn: [{ w: 'accomplish', m: '成し遂げる' }, { w: 'satisfy', m: '満たす' }], field: '動作・行為' }],
  ['execute', '動', '1', '実行する・処刑する', 'They executed the plan well.', '彼らは計画をうまく実行した。', 'ラテン ex+sequi(やり遂げる)→ sequence と同系。', { syn: [{ w: 'carry out', m: '実行する' }, { w: 'perform', m: '遂行する' }], field: '動作・行為' }],
  ['endeavor', '動', '1', '努力する・試み(名)', 'They endeavored to improve.', '彼らは改善しようと努めた。', 'en+古フランス deveir(義務)→ debt と同系。', { syn: [{ w: 'strive', m: '励む' }, { w: 'attempt', m: '試みる' }], field: '動作・行為' }],
  ['toil', '動', '1', '骨折って働く・苦労(名)', 'They toiled in the fields.', '彼らは畑で汗水流して働いた。', '古フランス toiler(争う)。', { syn: [{ w: 'labor', m: '働く' }], ant: [{ w: 'rest', m: '休む' }], field: '動作・行為' }],
  ['exhaust', '動', 'pre1', '疲れ果てさせる・使い果たす・排気(名)', 'The long hike exhausted us.', '長いハイキングで私たちは疲れ果てた。', 'ラテン ex+haurire(くみ出す)。', { syn: [{ w: 'tire out', m: '疲れさせる' }, { w: 'deplete', m: '枯渇させる' }], field: '動作・行為' }],
  ['squander', '動', '1', '浪費する・無駄にする', 'He squandered his fortune.', '彼は財産を浪費した。', '由来不確か(16世紀)。', { syn: [{ w: 'waste', m: '無駄にする' }], ant: [{ w: 'save', m: '節約する' }], field: '動作・行為' }],
  ['wield', '動', '1', '(権力・道具を)振るう・行使する', 'They wield great power.', '彼らは大きな権力を握っている。', '古英語 wealdan(支配する)。', { syn: [{ w: 'exercise', m: '行使する' }, { w: 'handle', m: '扱う' }], field: '動作・行為' }],
  ['render', '動', '1', '〜にする・与える・表現する', 'The shock rendered her speechless.', '衝撃で彼女は言葉を失った。', 'ラテン reddere(返す)→ render。', { syn: [{ w: 'make', m: 'させる' }, { w: 'provide', m: '与える' }], field: '動作・行為' }],
  // 思考・判断の動詞
  ['surmise', '動', '1', '推測する・推量(名)', 'I surmise that he left early.', '彼は早く帰ったと推測する。', 'ラテン super+mittere(上に置く)→ miss と同系。', { syn: [{ w: 'guess', m: '推測する' }, { w: 'infer', m: '推論する' }], field: '動作・行為' }],
  ['gauge', '動', '1', '測る・判断する・計器(名)', 'It is hard to gauge his mood.', '彼の機嫌を測るのは難しい。', '古北フランス gauger(測る)。', { syn: [{ w: 'measure', m: '測る' }, { w: 'assess', m: '評価する' }], field: '動作・行為' }],
  ['evaluate', '動', '2', '評価する・査定する', 'Teachers evaluate students.', '教師は生徒を評価する。', 'ラテン ex+valere(価値がある)→ value と同系。', { syn: [{ w: 'assess', m: '評価する' }, { w: 'appraise', m: '査定する' }], field: '動作・行為' }],
  ['appraise', '動', '1', '評価する・鑑定する', 'An expert appraised the painting.', '専門家がその絵を鑑定した。', 'ラテン ad+pretium(値段)→ price と同系。', { syn: [{ w: 'evaluate', m: '評価する' }, { w: 'assess', m: '査定する' }], field: 'ビジネス' }],
  ['estimate', '動', '2', '見積もる・推定する・見積もり(名)', 'They estimated the cost.', '彼らは費用を見積もった。', 'ラテン aestimare(評価する)→ esteem と同系。', { syn: [{ w: 'calculate', m: '計算する' }, { w: 'gauge', m: '測る' }], field: '測定' }],
  ['postulate', '動', '1', '仮定する・要請する', 'He postulated a new theory.', '彼は新理論を提唱した。', 'ラテン postulare(要求する)。', { syn: [{ w: 'assume', m: '仮定する' }, { w: 'hypothesize', m: '仮説を立てる' }], field: '科学' }],
  // 大きさの形容詞
  ['colossal', '形', '1', '巨大な・とてつもない', 'It was a colossal mistake.', 'それはとてつもない誤りだった。', 'ギリシャ kolossos(巨像)→ Colosseum と同系。', { syn: [{ w: 'huge', m: '巨大な' }, { w: 'enormous', m: '巨大な' }], ant: [{ w: 'tiny', m: 'ごく小さい' }], field: '性質・状態' }],
  ['gigantic', '形', 'pre1', '巨大な', 'They built a gigantic tower.', '彼らは巨大な塔を建てた。', 'giant(巨人)+ -ic→ギリシャ gigas。', { syn: [{ w: 'huge', m: '巨大な' }, { w: 'massive', m: '大きな' }], ant: [{ w: 'minute', m: '微小な' }], field: '性質・状態' }],
  ['minute', '形', '1', '微小な・詳細な', 'There are minute differences.', 'ごくわずかな違いがある。', 'ラテン minutus(小さくされた)→ minor と同系。', { syn: [{ w: 'tiny', m: '極小の' }, { w: 'detailed', m: '詳細な' }], ant: [{ w: 'huge', m: '巨大な' }], field: '性質・状態' }],
  ['spacious', '形', 'pre1', '広々とした', 'The apartment is spacious.', 'そのアパートは広々している。', 'space(空間)+ -ious。', { syn: [{ w: 'roomy', m: '広い' }, { w: 'vast', m: '広大な' }], ant: [{ w: 'cramped', m: '狭苦しい' }], field: '性質・状態' }],
  ['cramped', '形', '1', '狭苦しい・窮屈な', 'We lived in a cramped room.', '私たちは窮屈な部屋に住んだ。', 'cramp(けいれん・締め金)+ -ed。', { syn: [{ w: 'crowded', m: '混んだ' }, { w: 'narrow', m: '狭い' }], ant: [{ w: 'spacious', m: '広々とした' }], field: '性質・状態' }],
  ['petite', '形', '1', '小柄な・きゃしゃな', 'She is petite and graceful.', '彼女は小柄で優雅だ。', 'フランス petit(小さい)→ petty と同系。', { syn: [{ w: 'small', m: '小さい' }, { w: 'tiny', m: '小柄な' }], ant: [{ w: 'tall', m: '背の高い' }], field: '性質・状態' }],
  ['bulky', '形', '1', 'かさばる・大きくて扱いにくい', 'The package is too bulky.', 'その荷物はかさばりすぎる。', 'bulk(かさ)+ -y。', { syn: [{ w: 'large', m: '大きい' }, { w: 'cumbersome', m: '扱いにくい' }], ant: [{ w: 'compact', m: '小型の' }], field: '性質・状態' }],
  ['slender', '形', 'pre1', 'ほっそりした・わずかな', 'She has a slender figure.', '彼女はほっそりした体型だ。', '古フランス esclendre(細い)。', { syn: [{ w: 'slim', m: '細い' }, { w: 'thin', m: 'やせた' }], ant: [{ w: 'stout', m: '太った' }], field: '性質・状態' }],
  // 時間の形容詞
  ['brief', '形', 'pre1', '短い・簡潔な', 'He gave a brief speech.', '彼は短い演説をした。', 'ラテン brevis(短い)→ abbreviate と同系。', { syn: [{ w: 'short', m: '短い' }, { w: 'concise', m: '簡潔な' }], ant: [{ w: 'lengthy', m: '長たらしい' }], field: '性質・状態' }],
  ['fleeting', '形', '1', 'つかの間の・はかない', 'a fleeting moment of joy', 'つかの間の喜び', 'fleet(速く過ぎる)+ -ing。', { syn: [{ w: 'brief', m: '短い' }, { w: 'transient', m: 'はかない' }], ant: [{ w: 'lasting', m: '永続する' }], field: '性質・状態' }],
  ['transient', '形', '1', '一時的な・はかない', 'Fame can be transient.', '名声ははかないこともある。', 'ラテン trans+ire(通り過ぎる)→ transit と同系。', { syn: [{ w: 'temporary', m: '一時的な' }, { w: 'fleeting', m: 'つかの間の' }], ant: [{ w: 'permanent', m: '永続的な' }], field: '性質・状態' }],
  ['perpetual', '形', '1', '永続する・絶え間ない', 'He lives in perpetual fear.', '彼は絶え間ない恐怖の中で暮らす。', 'ラテン perpetuus(連続した)。', { syn: [{ w: 'constant', m: '絶え間ない' }, { w: 'eternal', m: '永遠の' }], ant: [{ w: 'temporary', m: '一時的な' }], field: '性質・状態' }],
  ['eternal', '形', 'pre1', '永遠の・不滅の', 'They promised eternal love.', '彼らは永遠の愛を誓った。', 'ラテン aeternus(永遠の)。', { syn: [{ w: 'everlasting', m: '永続する' }, { w: 'endless', m: '果てしない' }], ant: [{ w: 'temporary', m: '一時的な' }], field: '性質・状態' }],
  ['permanent', '形', 'pre1', '永続的な・常設の', 'He found a permanent job.', '彼は定職を見つけた。', 'ラテン per+manere(とどまる)→ remain と同系。', { syn: [{ w: 'lasting', m: '永続する' }], ant: [{ w: 'temporary', m: '一時的な' }], field: '性質・状態' }],
  ['intermittent', '形', '1', '断続的な', 'There was intermittent rain.', '断続的な雨が降った。', 'ラテン inter+mittere(送る)→ miss と同系。', { syn: [{ w: 'sporadic', m: '散発的な' }, { w: 'occasional', m: '時折の' }], ant: [{ w: 'continuous', m: '連続的な' }], field: '性質・状態' }],
  ['sporadic', '形', '1', '散発的な・まばらな', 'There were sporadic protests.', '散発的な抗議があった。', 'ギリシャ sporas(散らばった)→ spore と同系。', { syn: [{ w: 'occasional', m: '時折の' }, { w: 'irregular', m: '不規則な' }], ant: [{ w: 'constant', m: '絶え間ない' }], field: '性質・状態' }],
]

export const WORDS_MORE33 = RAW.map(expandCompact)
