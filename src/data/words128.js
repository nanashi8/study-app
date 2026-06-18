// 単語データ #84 — 英検1級の上級語彙④（J-M）。難解・低頻度の正確な語のみ。
import { expandCompact } from './compact.js'

const RAW = [
  ['jejune', '形', '1', '幼稚な・内容の乏しい', 'a jejune argument', '中身の薄い議論', 'ラテン jejunus(空腹の)。', { syn: [{ w: 'puerile', m: '子どもじみた' }, { w: 'insipid', m: '味気ない' }], ant: [{ w: 'mature', m: '成熟した' }], field: '一般' }],
  ['jingoism', '名', '1', '好戦的愛国主義・対外強硬論', 'wartime jingoism', '戦時の主戦論', '英国の俗謡 by jingo から。', { syn: [{ w: 'chauvinism', m: '排外主義' }, { w: 'nationalism', m: '国家主義' }], ant: [{ w: 'pacifism', m: '平和主義' }], field: '政治' }],
  ['jocular', '形', '1', 'おどけた・冗談好きの', 'a jocular tone', 'ふざけた口調', 'ラテン jocus(冗談)。', { syn: [{ w: 'jovial', m: '陽気な' }, { w: 'facetious', m: 'おどけた' }], ant: [{ w: 'solemn', m: 'まじめな' }], field: '心理' }],
  ['juggernaut', '名', '1', '圧倒的な力・止められない勢力', 'a corporate juggernaut', '巨大企業', 'ヒンディー Jagannath(神の名)。', { syn: [{ w: 'powerhouse', m: '強大な存在' }, { w: 'behemoth', m: '巨大組織' }], ant: [{ w: 'weakling', m: '弱小者' }], field: 'ビジネス' }],
  ['juncture', '名', '1', '(重要な)時点・接合点', 'at this juncture', 'この重大な時点で', 'ラテン jungere(つなぐ)。', { syn: [{ w: 'point', m: '時点' }, { w: 'moment', m: '局面' }], ant: [{ w: 'separation', m: '分離' }], field: '一般' }],
  ['junket', '名', '1', '(公費の)豪遊旅行・遊山', 'a political junket', '政治家の物見遊山', 'イタリア giuncata(かご入りチーズ)。', { syn: [{ w: 'excursion', m: '遠足' }, { w: 'outing', m: '行楽' }], ant: [{ w: 'chore', m: '雑用' }], field: '社会' }],
  ['kinetic', '形', '1', '運動の・活動的な', 'kinetic energy', '運動エネルギー', 'ギリシャ kinetikos(動く)。', { syn: [{ w: 'dynamic', m: '動的な' }, { w: 'active', m: '活発な' }], ant: [{ w: 'static', m: '静的な' }], field: '科学' }],
  ['labyrinthine', '形', '1', '迷路のような・複雑な', 'labyrinthine rules', '入り組んだ規則', 'ギリシャ labyrinthos(迷宮)。', { syn: [{ w: 'convoluted', m: '込み入った' }, { w: 'intricate', m: '複雑な' }], ant: [{ w: 'straightforward', m: '単純な' }], field: '一般' }],
  ['laconic', '形', '1', '言葉数の少ない・簡潔な', 'a laconic reply', '素っ気ない返事', 'ギリシャ Lakonikos(スパルタ風の)。', { syn: [{ w: 'terse', m: '簡潔な' }, { w: 'concise', m: '簡明な' }], ant: [{ w: 'verbose', m: '冗長な' }], field: '心理' }],
  ['lambaste', '動', '1', '厳しく非難する・酷評する', 'lambaste the referee', '審判を激しく非難する', 'スカンジナビア lam(打つ)+baste(たたく)。', { syn: [{ w: 'berate', m: '叱りつける' }, { w: 'censure', m: '糾弾する' }], ant: [{ w: 'praise', m: '称賛する' }], field: '社会' }],
  ['languid', '形', '1', 'けだるい・物憂い', 'a languid afternoon', 'けだるい午後', 'ラテン languere(衰える)。', { syn: [{ w: 'listless', m: '物憂げな' }, { w: 'lethargic', m: '気だるい' }], ant: [{ w: 'energetic', m: '精力的な' }], field: '心理' }],
  ['laudable', '形', '1', '称賛に値する・立派な', 'a laudable goal', '立派な目標', 'ラテン laudare(ほめる)。', { syn: [{ w: 'praiseworthy', m: '称賛すべき' }, { w: 'commendable', m: '感心な' }], ant: [{ w: 'deplorable', m: '嘆かわしい' }], field: '社会' }],
  ['levity', '名', '1', '軽率さ・不真面目', 'a moment of levity', 'ふざけた一瞬', 'ラテン levis(軽い)。', { syn: [{ w: 'frivolity', m: '軽薄さ' }, { w: 'flippancy', m: '軽率' }], ant: [{ w: 'gravity', m: '厳粛さ' }], field: '心理' }],
  ['licentious', '形', '1', '放縦な・みだらな', 'licentious behavior', 'みだらな行為', 'ラテン licere(許される)。', { syn: [{ w: 'dissolute', m: 'ふしだらな' }, { w: 'lewd', m: 'みだらな' }], ant: [{ w: 'chaste', m: '純潔な' }], field: '社会' }],
  ['lithe', '形', '1', 'しなやかな・柔軟な', 'a lithe dancer', 'しなやかな踊り手', '古英語 lithe(柔和な)。', { syn: [{ w: 'supple', m: 'しなやかな' }, { w: 'agile', m: '機敏な' }], ant: [{ w: 'stiff', m: '硬い' }], field: '一般' }],
  ['lugubrious', '形', '1', '陰気な・物悲しい', 'a lugubrious tone', '陰気な口調', 'ラテン lugere(嘆く)。', { syn: [{ w: 'mournful', m: '哀れな' }, { w: 'gloomy', m: '陰鬱な' }], ant: [{ w: 'cheerful', m: '陽気な' }], field: '心理' }],
  ['magnanimous', '形', '1', '度量の大きい・寛大な', 'a magnanimous gesture', '度量の大きいふるまい', 'ラテン magnus(大)+animus(心)。', { syn: [{ w: 'generous', m: '寛大な' }, { w: 'forgiving', m: '寛容な' }], ant: [{ w: 'vindictive', m: '執念深い' }], field: '心理' }],
  ['malady', '名', '1', '病・(社会の)弊害', 'a chronic malady', '慢性の病', 'ラテン male habitus(具合の悪い)。', { syn: [{ w: 'illness', m: '病気' }, { w: 'ailment', m: '疾患' }], ant: [{ w: 'health', m: '健康' }], field: '医学' }],
  ['malevolent', '形', '1', '悪意のある・敵意に満ちた', 'a malevolent stare', '悪意あるにらみ', 'ラテン male(悪く)+velle(望む)。', { syn: [{ w: 'malicious', m: '意地悪な' }, { w: 'spiteful', m: '悪意ある' }], ant: [{ w: 'benevolent', m: '慈悲深い' }], field: '心理' }],
  ['malleable', '形', '1', '順応性のある・(金属が)展性のある', 'a malleable mind', '影響されやすい心', 'ラテン malleus(つち)。', { syn: [{ w: 'pliable', m: '柔軟な' }, { w: 'adaptable', m: '順応性のある' }], ant: [{ w: 'rigid', m: '硬直した' }], field: '科学' }],
  ['maudlin', '形', '1', '涙もろい・感傷的な', 'maudlin sentimentality', 'お涙頂戴の感傷', '聖書の Mary Magdalene から。', { syn: [{ w: 'mawkish', m: '感傷的な' }, { w: 'sentimental', m: '涙もろい' }], ant: [{ w: 'unsentimental', m: '冷静な' }], field: '心理' }],
  ['mawkish', '形', '1', '感傷的すぎる・甘ったるい', 'mawkish verses', '感傷的な詩', '中英語 mawke(うじ虫)。', { syn: [{ w: 'maudlin', m: '涙もろい' }, { w: 'cloying', m: 'うんざりさせる' }], ant: [{ w: 'restrained', m: '抑制された' }], field: '文学' }],
  ['mendacious', '形', '1', 'うそをつく・虚偽の', 'a mendacious account', '虚偽の説明', 'ラテン mendax(うそつき)。', { syn: [{ w: 'untruthful', m: '不誠実な' }, { w: 'deceitful', m: '欺瞞的な' }], ant: [{ w: 'honest', m: '正直な' }], field: '心理' }],
  ['mercurial', '形', '1', '気まぐれな・変わりやすい', 'a mercurial temperament', '移り気な気性', 'ローマ神 Mercury(水銀)から。', { syn: [{ w: 'volatile', m: '不安定な' }, { w: 'capricious', m: '気まぐれな' }], ant: [{ w: 'stable', m: '安定した' }], field: '心理' }],
  ['mettle', '名', '1', '気概・根性', 'prove his mettle', '気概を示す', 'metal(金属)の異形。', { syn: [{ w: 'courage', m: '勇気' }, { w: 'fortitude', m: '不屈の精神' }], ant: [{ w: 'cowardice', m: '臆病' }], field: '心理' }],
  ['misanthrope', '名', '1', '人間嫌い・厭世家', 'a bitter misanthrope', '気難しい人間嫌い', 'ギリシャ misos(憎しみ)+anthropos(人)。', { syn: [{ w: 'cynic', m: '皮肉屋' }, { w: 'recluse', m: '世捨て人' }], ant: [{ w: 'philanthropist', m: '博愛家' }], field: '心理' }],
  ['mollify', '動', '1', 'なだめる・和らげる', 'mollify an angry customer', '怒った客をなだめる', 'ラテン mollis(柔らかい)+facere(する)。', { syn: [{ w: 'pacify', m: 'なだめる' }, { w: 'appease', m: '宥める' }], ant: [{ w: 'provoke', m: '怒らせる' }], field: '心理' }],
  ['mordant', '形', '1', '(風刺が)辛辣な・痛烈な', 'mordant wit', '辛辣な機知', 'ラテン mordere(かむ)。', { syn: [{ w: 'caustic', m: '辛辣な' }, { w: 'biting', m: '痛烈な' }], ant: [{ w: 'gentle', m: '穏やかな' }], field: '文学' }],
  ['moribund', '形', '1', '瀕死の・消滅しかけた', 'a moribund industry', '衰退産業', 'ラテン mori(死ぬ)。', { syn: [{ w: 'dying', m: '死にかけた' }, { w: 'declining', m: '衰退する' }], ant: [{ w: 'thriving', m: '繁栄する' }], field: 'ビジネス' }],
  ['myriad', '名', '1', '無数・無数の', 'a myriad of stars', '無数の星', 'ギリシャ myrias(1万)。', { syn: [{ w: 'multitude', m: '多数' }, { w: 'host', m: '大群' }], ant: [{ w: 'handful', m: 'ほんの少し' }], field: '一般' }],
]

export const WORDS_MORE127 = RAW.map(expandCompact)
