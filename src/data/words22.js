// 単語データ（統一フォーマット＋分野field）。[word,pos,level,"意味","英例文","和訳",語源,{syn,ant,der,usage,field}]
import { expandCompact } from './compact.js'

const RAW = [
  ["tooth","名","4","歯","Brush your teeth.","歯をみがいて。","古英語 tōth「歯」。",{"der":[{"w":"teeth","m":"歯(複数)"}],"field":"医学"}],
  ["neck","名","4","首","The giraffe has a long neck.","キリンは首が長い。","古英語 hnecca「首」。",{"field":"一般"}],
  ["heart","名","3","心臓・心","My heart was beating fast.","心臓が速く打っていた。","古英語 heorte「心臓」。",{"field":"一般"}],
  ["skin","名","3","肌・皮","Babies have soft skin.","赤ちゃんの肌は柔らかい。","古ノルド skinn「皮」。",{"field":"医学"}],
  ["throat","名","3","のど","I have a sore throat.","のどが痛い。","古英語 throte「のど」。",{"field":"医学"}],
  ["son","名","5","息子","They have two sons.","彼らには息子が2人いる。","古英語 sunu「息子」。",{"ant":[{"w":"daughter","m":"娘"}],"field":"家族・人"}],
  ["daughter","名","5","娘","Their daughter is a doctor.","彼らの娘は医者だ。","古英語 dohtor「娘」。",{"ant":[{"w":"son","m":"息子"}],"field":"家族・人"}],
  ["aunt","名","4","おば","My aunt is very funny.","私のおばはとても面白い。","ラテン amita(父方のおば)。",{"ant":[{"w":"uncle","m":"おじ"}],"field":"家族・人"}],
  ["salt","名","4","塩","Add a little salt.","塩を少し加えて。","古英語 sealt「塩」。",{"field":"食・生活"}],
  ["leaf","名","4","葉","A leaf fell from the tree.","木から葉が一枚落ちた。","古英語 lēaf「葉」。",{"der":[{"w":"leaves","m":"葉(複数)"}],"field":"自然"}],
  ["stone","名","4","石","He threw a stone.","彼は石を投げた。","古英語 stān「石」。",{"syn":[{"w":"rock","m":"岩"}],"field":"一般"}],
  ["cow","名","5","牛・雌牛","Cows give us milk.","牛は私たちに牛乳をくれる。","古英語 cū「雌牛」。",{"field":"一般"}],
  ["pig","名","5","ブタ","Pigs are clever animals.","ブタは賢い動物だ。","古英語 picga「子豚」。",{"field":"一般"}],
  ["sheep","名","4","ヒツジ","The farmer keeps sheep.","農夫はヒツジを飼っている。","古英語 scēap「ヒツジ」。",{"field":"一般"}],
  ["lion","名","4","ライオン","The lion is the king of beasts.","ライオンは百獣の王だ。","ギリシャ leon「ライオン」。",{"field":"一般"}],
  ["elephant","名","4","ゾウ","Elephants are very large.","ゾウはとても大きい。","ギリシャ elephas「象牙・ゾウ」。",{"field":"一般"}],
  ["monkey","名","4","サル","Monkeys like bananas.","サルはバナナが好きだ。","由来不確か(16世紀)。",{"field":"一般"}],
  ["snake","名","4","ヘビ","A snake slid into the grass.","ヘビが草むらに滑り込んだ。","古英語 snaca「ヘビ」。",{"field":"一般"}],
  ["wall","名","4","壁","There is a clock on the wall.","壁に時計がある。","ラテン vallum(土塁)。",{"field":"一般"}],
  ["floor","名","4","床・階","The toy is on the floor.","おもちゃが床にある。","古英語 flōr「床」。",{"field":"一般"}],
  ["glass","名","4","ガラス・コップ","Pour water into the glass.","コップに水を注いで。","古英語 glæs「ガラス」。",{"field":"一般"}],
  ["plate","名","4","皿","Put the cake on a plate.","ケーキを皿にのせて。","ギリシャ platys(平らな)→ plain と同系。",{"field":"一般"}],
  ["knife","名","4","ナイフ・包丁","Cut it with a knife.","ナイフで切って。","古英語 cnīf「ナイフ」。",{"der":[{"w":"knives","m":"ナイフ(複数)"}],"field":"一般"}],
  ["bottle","名","4","びん・ボトル","A bottle of water, please.","水を1本ください。","ラテン buttis(樽)。",{"field":"一般"}],
  ["dictionary","名","4","辞書","Look it up in a dictionary.","辞書で調べて。","ラテン dictio(言うこと)→ dict と同系。",{"field":"教育"}],
  ["shirt","名","4","シャツ","He wore a white shirt.","彼は白いシャツを着ていた。","古英語 scyrte「短い衣」→ short と同系。",{"field":"食・生活"}],
  ["coat","名","4","コート・上着","Put on your coat.","コートを着て。","古フランス cote(上着)。",{"field":"一般"}],
  ["shoe","名","5","靴","Tie your shoes.","靴のひもを結んで。","古英語 scōh「靴」。",{"field":"食・生活"}],
  ["evening","名","5","夕方・晩","Good evening!","こんばんは！","古英語 ǣfnung「夕暮れ」。",{"ant":[{"w":"morning","m":"朝"}],"field":"一般"}],
  ["night","名","5","夜","It gets cold at night.","夜は寒くなる。","古英語 niht「夜」。",{"ant":[{"w":"day","m":"昼・日"}],"field":"一般"}],
  ["autumn","名","4","秋","Leaves turn red in autumn.","秋に葉が赤くなる。","ラテン autumnus「秋」。",{"syn":[{"w":"fall","m":"秋(米)"}],"ant":[{"w":"spring","m":"春"}],"field":"一般"}],
]

export const WORDS_MORE21 = RAW.map(expandCompact)
