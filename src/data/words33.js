// 単語データ（継続 / 6000語へ）— 抑制・誘導・追放の動詞/抽象名詞/外見・性格の形容詞/副詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 動詞（抑制・誘導・追放）
  ['oversee', '動', '1', '監督する・統括する', 'She oversees the whole project.', '彼女は事業全体を統括する。', 'over(上から)+see(見る)。', { syn: [{ w: 'supervise', m: '監督する' }, { w: 'manage', m: '管理する' }], field: '動作・行為' }],
  ['withhold', '動', '1', '差し控える・保留する', 'They withheld the information.', '彼らは情報を伏せた。', 'with(後ろへ)+hold(保つ)。', { syn: [{ w: 'hold back', m: '差し控える' }], ant: [{ w: 'release', m: '公開する' }], field: '動作・行為' }],
  ['refrain', '動', '1', '差し控える・慎む・繰り返し(名)', 'Please refrain from smoking.', '喫煙はご遠慮ください。', 'ラテン re+frenare(手綱で抑える)。', { syn: [{ w: 'abstain', m: '控える' }, { w: 'avoid', m: '避ける' }], ant: [{ w: 'indulge', m: 'ふける' }], field: '動作・行為' }],
  ['succumb', '動', '1', '屈する・(病に)倒れる', 'He succumbed to temptation.', '彼は誘惑に屈した。', 'ラテン sub+cumbere(横たわる)。', { syn: [{ w: 'yield', m: '屈する' }, { w: 'give in', m: '負ける' }], ant: [{ w: 'resist', m: '抵抗する' }], field: '動作・行為' }],
  ['heed', '動', '1', '心に留める・注意を払う', 'They did not heed the warning.', '彼らは警告に耳を貸さなかった。', '古英語 hēdan(世話する)。', { syn: [{ w: 'mind', m: '気をつける' }, { w: 'pay attention to', m: '注意する' }], ant: [{ w: 'ignore', m: '無視する' }], field: '動作・行為' }],
  ['dissuade', '動', '1', '思いとどまらせる', 'She dissuaded him from leaving.', '彼女は彼が去るのを思いとどまらせた。', 'ラテン dis+suadere(勧める)。', { syn: [{ w: 'discourage', m: '思いとどまらせる' }], ant: [{ w: 'persuade', m: '説得する' }], field: '動作・行為' }],
  ['lure', '動', '1', '誘い込む・おびき寄せる・誘惑(名)', 'Low prices lure shoppers.', '安値が買い物客を引き寄せる。', '古フランス loirre(おとり)。', { syn: [{ w: 'entice', m: '誘う' }, { w: 'tempt', m: '誘惑する' }], field: '動作・行為' }],
  ['entice', '動', '1', '誘惑する・そそのかす', 'Ads entice people to buy.', '広告は人々の購買を誘う。', '古フランス enticier(火をつける)。', { syn: [{ w: 'lure', m: '誘い込む' }, { w: 'tempt', m: '誘惑する' }], field: '動作・行為' }],
  ['expel', '動', '1', '追放する・退学させる', 'He was expelled from school.', '彼は退学になった。', 'ラテン ex+pellere(押す)→ propel と同系。', { syn: [{ w: 'banish', m: '追放する' }, { w: 'eject', m: '追い出す' }], ant: [{ w: 'admit', m: '入れる' }], field: '動作・行為' }],
  ['banish', '動', '1', '追放する・払いのける', 'The king banished the traitor.', '王は裏切り者を追放した。', '古フランス banir(追放する)→ ban と同系。', { syn: [{ w: 'exile', m: '国外追放する' }, { w: 'expel', m: '追い出す' }], field: '動作・行為' }],
  ['detain', '動', '1', '引き留める・拘留する', 'Police detained the suspect.', '警察は容疑者を拘留した。', 'ラテン de+tenere(保つ)→ tain と同源。', { syn: [{ w: 'hold', m: '拘束する' }, { w: 'delay', m: '引き留める' }], ant: [{ w: 'release', m: '釈放する' }], field: '法律' }],
  ['confine', '動', '1', '閉じ込める・限定する', 'He was confined to bed.', '彼は寝たきりだった。', 'ラテン con+finis(境界)→ finish と同系。', { syn: [{ w: 'restrict', m: '制限する' }, { w: 'imprison', m: '監禁する' }], ant: [{ w: 'free', m: '解放する' }], field: '動作・行為' }],
  ['liberate', '動', '1', '解放する・自由にする', 'The army liberated the city.', '軍はその都市を解放した。', 'ラテン liber(自由な)→ liberty と同源。', { syn: [{ w: 'free', m: '解放する' }, { w: 'release', m: '放つ' }], ant: [{ w: 'enslave', m: '奴隷にする' }], field: '政治' }],
  ['coax', '動', '1', 'なだめすかして〜させる', 'She coaxed the child to eat.', '彼女は子をなだめて食べさせた。', '古い英語 cokes(まぬけ)→おだてる。', { syn: [{ w: 'persuade', m: '説得する' }, { w: 'cajole', m: 'おだてる' }], field: '動作・行為' }],
  ['beckon', '動', '1', '手招きする・誘う', 'He beckoned me to come.', '彼は私に来るよう手招きした。', '古英語 bīecnan(合図する)→ beacon と同系。', { syn: [{ w: 'signal', m: '合図する' }, { w: 'wave', m: '手で招く' }], field: '動作・行為' }],
  // 抽象名詞
  ['scarcity', '名', '1', '不足・欠乏', 'There is a scarcity of water.', '水の不足がある。', 'scarce(乏しい)+ -ity。', { syn: [{ w: 'shortage', m: '不足' }, { w: 'lack', m: '欠乏' }], ant: [{ w: 'abundance', m: '豊富' }], field: '経済' }],
  ['abundance', '名', '1', '豊富・多量', 'an abundance of food', 'あり余る食料', 'ラテン abundare(あふれる)→ abundant と同源。', { syn: [{ w: 'plenty', m: 'たくさん' }], ant: [{ w: 'scarcity', m: '不足' }], field: '一般' }],
  ['excess', '名', '1', '過剰・超過', 'an excess of sugar', '過剰な砂糖', 'ラテン ex+cedere(越える)→ cess と同源。', { syn: [{ w: 'surplus', m: '余剰' }], ant: [{ w: 'shortage', m: '不足' }], field: '一般' }],
  ['magnitude', '名', '1', '大きさ・重大さ', 'the magnitude of the problem', '問題の大きさ', 'ラテン magnus(大きい)→ magnify と同系。', { syn: [{ w: 'size', m: '大きさ' }, { w: 'scale', m: '規模' }], field: '測定' }],
  ['intensity', '名', '1', '強さ・激しさ', 'the intensity of the light', '光の強さ', 'intense(激しい)+ -ity→ tend と同系。', { syn: [{ w: 'strength', m: '強さ' }, { w: 'force', m: '力' }], field: '測定' }],
  ['dignity', '名', '1', '尊厳・威厳', 'She faced it with dignity.', '彼女は威厳をもって立ち向かった。', 'ラテン dignus(価値ある)→ deign と同系。', { syn: [{ w: 'honor', m: '名誉' }], field: '社会' }],
  ['humility', '名', '1', '謙虚さ・謙遜', 'He accepted praise with humility.', '彼は謙虚に称賛を受けた。', 'ラテン humilis(低い)→ humble と同源。', { syn: [{ w: 'modesty', m: '謙遜' }], ant: [], field: '社会' }],
  ['courtesy', '名', 'pre1', '礼儀・親切', 'He showed great courtesy.', '彼はとても礼儀正しかった。', '古フランス corteis(宮廷の)→ court と同系。', { syn: [{ w: 'politeness', m: '礼儀正しさ' }, { w: 'manners', m: '作法' }], ant: [{ w: 'rudeness', m: '無礼' }], field: '社会' }],
  ['sincerity', '名', '1', '誠実さ・真心', 'I doubt his sincerity.', '私は彼の誠実さを疑う。', 'ラテン sincerus(純粋な)→ sincere と同源。', { syn: [], ant: [{ w: 'hypocrisy', m: '偽善' }], field: '社会' }],
  ['loyalty', '名', 'pre1', '忠誠・忠実', 'Loyalty to friends matters.', '友への忠誠は大切だ。', 'loyal(忠実な)+ -ty→ legal と同系。', { syn: [{ w: 'faithfulness', m: '忠実' }], ant: [{ w: 'betrayal', m: '裏切り' }], field: '社会' }],
  ['betrayal', '名', '1', '裏切り', 'It felt like a betrayal.', 'それは裏切りに感じられた。', 'betray(裏切る)+ -al。', { syn: [{ w: 'treachery', m: '不実' }], ant: [{ w: 'loyalty', m: '忠誠' }], field: '社会' }],
  ['hypocrisy', '名', '1', '偽善', 'They criticized his hypocrisy.', '彼らは彼の偽善を批判した。', 'ギリシャ hypokrisis(演技)。', { ant: [{ w: 'sincerity', m: '誠実' }], field: '社会' }],
  ['tolerance', '名', 'pre1', '寛容・耐性', 'They preach tolerance.', '彼らは寛容を説く。', 'ラテン tolerare(耐える)→ tolerate と同源。', { syn: [], ant: [{ w: 'intolerance', m: '不寛容' }], field: '社会' }],
  ['discrimination', '名', 'pre1', '差別・識別', 'They fight against discrimination.', '彼らは差別と闘う。', 'ラテン discriminare(区別する)→ discern と同系。', { syn: [{ w: 'prejudice', m: '偏見' }, { w: 'bias', m: '偏り' }], field: '社会' }],
  ['oppression', '名', '1', '抑圧・圧政', 'They suffered under oppression.', '彼らは圧政に苦しんだ。', 'ラテン ob+premere(押す)→ press と同系。', { syn: [{ w: 'tyranny', m: '専制' }], ant: [], field: '政治' }],
  ['sovereignty', '名', '1', '主権・統治権', 'The nation defended its sovereignty.', 'その国は主権を守った。', '古フランス soverain(最高の)→ super と同系。', { syn: [{ w: 'autonomy', m: '自治' }, { w: 'independence', m: '独立' }], field: '政治' }],
  // 外見の形容詞
  ['gorgeous', '形', 'pre1', 'とても美しい・華麗な', 'She wore a gorgeous dress.', '彼女は華麗なドレスを着ていた。', '古フランス gorgias(おしゃれな)。', { syn: [{ w: 'beautiful', m: '美しい' }, { w: 'stunning', m: '見事な' }], ant: [{ w: 'plain', m: '地味な' }], field: '性質・状態' }],
  ['elegant', '形', 'pre1', '上品な・優雅な', 'The room had elegant furniture.', '部屋には上品な家具があった。', 'ラテン elegans(選び抜かれた)→ elect と同系。', { syn: [{ w: 'graceful', m: '優雅な' }, { w: 'refined', m: '洗練された' }], ant: [{ w: 'clumsy', m: '不格好な' }], field: '性質・状態' }],
  ['graceful', '形', 'pre1', '優雅な・上品な', 'She is a graceful dancer.', '彼女は優雅な踊り手だ。', 'grace(優美)+ -ful→ grateful と同系。', { syn: [{ w: 'elegant', m: '上品な' }], ant: [{ w: 'awkward', m: 'ぎこちない' }], field: '性質・状態' }],
  ['shabby', '形', '1', 'みすぼらしい・ぼろぼろの', 'He wore a shabby coat.', '彼はみすぼらしいコートを着ていた。', '古英語 sceabb(かさぶた)→ scab と同系。', { syn: [{ w: 'worn', m: '使い古した' }, { w: 'ragged', m: 'ぼろの' }], ant: [{ w: 'smart', m: 'こぎれいな' }], field: '性質・状態' }],
  ['immaculate', '形', '1', '汚れのない・完璧な', 'The kitchen was immaculate.', '台所は塵ひとつなかった。', 'ラテン in(否定)+macula(しみ)。', { syn: [{ w: 'spotless', m: '無垢の' }, { w: 'pristine', m: '新品同様の' }], ant: [{ w: 'filthy', m: '汚れた' }], field: '性質・状態' }],
  ['pristine', '形', '1', '真新しい・手つかずの', 'The beach was pristine.', 'その浜辺は手つかずだった。', 'ラテン pristinus(以前の・原始の)。', { syn: [{ w: 'pure', m: '清浄な' }, { w: 'untouched', m: '手つかずの' }], ant: [{ w: 'polluted', m: '汚染された' }], field: '性質・状態' }],
  ['filthy', '形', 'pre1', '不潔な・汚らわしい', 'The streets were filthy.', '通りは汚れていた。', 'filth(汚物)+ -y→ foul と同系。', { syn: [{ w: 'dirty', m: '汚い' }, { w: 'grimy', m: '垢じみた' }], ant: [{ w: 'clean', m: '清潔な' }], field: '性質・状態' }],
  ['transparent', '形', 'pre1', '透明な・分かりやすい', 'The water is transparent.', '水は透き通っている。', 'ラテン trans+parere(現れる)。', { syn: [{ w: 'clear', m: '透明な' }, { w: 'see-through', m: '透けて見える' }], ant: [{ w: 'opaque', m: '不透明な' }], field: '性質・状態' }],
  ['opaque', '形', '1', '不透明な・不明瞭な', 'The glass is opaque.', 'そのガラスは不透明だ。', 'ラテン opacus(陰になった)。', { syn: [{ w: 'cloudy', m: '濁った' }], ant: [{ w: 'transparent', m: '透明な' }], field: '性質・状態' }],
  ['radiant', '形', '1', '輝く・晴れやかな', 'She had a radiant smile.', '彼女は晴れやかな笑顔だった。', 'ラテン radiare(光を放つ)→ radius と同系。', { syn: [{ w: 'glowing', m: '輝く' }, { w: 'bright', m: '明るい' }], ant: [{ w: 'dull', m: 'くすんだ' }], field: '性質・状態' }],
  // 性格の形容詞
  ['courteous', '形', 'pre1', '礼儀正しい・丁寧な', 'The staff were courteous.', '従業員は礼儀正しかった。', 'court(宮廷)+ -eous→ courtesy と同源。', { syn: [{ w: 'polite', m: '礼儀正しい' }, { w: 'gracious', m: '丁重な' }], ant: [{ w: 'rude', m: '無礼な' }], field: '性質・状態' }],
  ['gracious', '形', 'pre1', '丁重な・寛大な・優雅な', 'She was a gracious host.', '彼女は丁重なもてなし役だった。', 'ラテン gratia(好意)→ grace と同源。', { syn: [{ w: 'kind', m: '親切な' }, { w: 'courteous', m: '礼儀正しい' }], field: '性質・状態' }],
  ['malicious', '形', '1', '悪意のある・意地の悪い', 'It was a malicious rumor.', 'それは悪意あるうわさだった。', 'ラテン malus(悪い)→ malice と同源。', { syn: [{ w: 'spiteful', m: '意地悪な' }, { w: 'cruel', m: '残酷な' }], ant: [{ w: 'benevolent', m: '慈悲深い' }], field: '性質・状態' }],
  ['eccentric', '形', '1', '風変わりな・奇抜な', 'He is a bit eccentric.', '彼は少し変わっている。', 'ギリシャ ek(外)+kentron(中心)→中心を外れた。', { syn: [{ w: 'odd', m: '奇妙な' }, { w: 'unconventional', m: '型破りな' }], ant: [{ w: 'normal', m: '普通の' }], field: '性質・状態' }],
  // 副詞
  ['deliberately', '副', 'pre1', '故意に・慎重に', 'He deliberately ignored me.', '彼はわざと私を無視した。', 'deliberate(意図的な)+ -ly。', { syn: [{ w: 'intentionally', m: '意図的に' }, { w: 'on purpose', m: 'わざと' }], ant: [], field: '副詞' }],
  ['inadvertently', '副', '1', 'うっかり・不注意に', 'She inadvertently deleted the file.', '彼女はうっかりファイルを消した。', 'in(否定)+advert(注意を向ける)+ -ly。', { syn: [{ w: 'unintentionally', m: '無意識に' }], ant: [{ w: 'deliberately', m: '故意に' }], field: '副詞' }],
  ['scarcely', '副', 'pre1', 'ほとんど〜ない・かろうじて', 'I could scarcely hear him.', '彼の声はほとんど聞こえなかった。', 'scarce(乏しい)+ -ly。', { syn: [{ w: 'hardly', m: 'ほとんど〜ない' }, { w: 'barely', m: 'かろうじて' }], field: '副詞' }],
  ['solely', '副', 'pre1', 'もっぱら・単独で', 'She is solely responsible.', '責任は彼女一人にある。', 'sole(唯一の)+ -ly。', { syn: [{ w: 'only', m: 'だけ' }, { w: 'exclusively', m: '独占的に' }], field: '副詞' }],
  ['predominantly', '副', '1', '主に・大部分は', 'The town is predominantly rural.', 'その町は大部分が農村だ。', 'predominate(支配する)+ -ly。', { syn: [{ w: 'mainly', m: '主に' }, { w: 'mostly', m: 'たいてい' }], field: '副詞' }],
  ['overwhelmingly', '副', '1', '圧倒的に', 'They overwhelmingly approved it.', '彼らは圧倒的に賛成した。', 'overwhelm(圧倒する)+ -ingly。', { syn: [{ w: 'decisively', m: '決定的に' }], field: '副詞' }],
]

export const WORDS_MORE32 = RAW.map(expandCompact)
