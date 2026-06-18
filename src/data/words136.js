// 単語データ #92 — 英検1級の上級語彙⑫（A-Z補充6巡目）。難解・低頻度の正確な語のみ。
import { expandCompact } from './compact.js'

const RAW = [
  ['bilk', '動', '1', 'だまし取る・支払いを踏み倒す', 'bilk investors', '投資家からだまし取る', '由来不確か(17世紀)。', { syn: [{ w: 'swindle', m: 'だまし取る' }, { w: 'defraud', m: '詐取する' }], ant: [{ w: 'reimburse', m: '払い戻す' }], field: '社会' }],
  ['bombastic', '形', '1', '大げさな・大言壮語の', 'a bombastic speech', '仰々しい演説', 'bombast(美辞麗句)+ -ic。', { syn: [{ w: 'pompous', m: '尊大な' }, { w: 'grandiloquent', m: '大言壮語の' }], ant: [{ w: 'understated', m: '控えめな' }], field: '文学' }],
  ['cantankerous', '形', '1', '気難しい・けんか腰の', 'a cantankerous neighbor', '気難しい隣人', '由来不確か(18世紀)。', { syn: [{ w: 'irritable', m: '怒りっぽい' }, { w: 'quarrelsome', m: 'けんか好きの' }], ant: [{ w: 'amiable', m: '愛想のよい' }], field: '心理' }],
  ['commodious', '形', '1', '広々とした・ゆったりした', 'a commodious hall', '広々とした広間', 'ラテン commodus(便利な)。', { syn: [{ w: 'spacious', m: '広い' }, { w: 'roomy', m: 'ゆったりした' }], ant: [{ w: 'cramped', m: '窮屈な' }], field: '建築' }],
  ['complaisant', '形', '1', '愛想のよい・人に逆らわない', 'a complaisant smile', '愛想のいい笑み', 'フランス complaire(気に入る)。', { syn: [{ w: 'obliging', m: '親切な' }, { w: 'agreeable', m: '快く応じる' }], ant: [{ w: 'contrary', m: 'つむじ曲がりの' }], field: '心理' }],
  ['comport', '動', '1', '(自分を)ふるまう・一致する', 'comport himself well', '立派にふるまう', 'ラテン comportare(運ぶ)。', { syn: [{ w: 'behave', m: 'ふるまう' }, { w: 'conduct', m: '振る舞う' }], ant: [{ w: 'misbehave', m: '不品行をする' }], field: '社会' }],
  ['credulity', '名', '1', '軽信・だまされやすさ', 'strain credulity', '信じがたい', 'ラテン credere(信じる)。', { syn: [{ w: 'gullibility', m: 'だまされやすさ' }, { w: 'naivety', m: '純真さ' }], ant: [{ w: 'skepticism', m: '懐疑' }], field: '心理' }],
  ['demagoguery', '名', '1', '民衆扇動・煽動政治', 'cheap demagoguery', '安っぽい大衆扇動', 'demagogue(扇動家)+ -ery。', { syn: [{ w: 'agitation', m: '扇動' }, { w: 'rabblerousing', m: '大衆煽動' }], ant: [{ w: 'statesmanship', m: '政治的手腕' }], field: '政治' }],
  ['depredation', '名', '1', '略奪・荒廃', 'the depredations of war', '戦争の爪あと', 'ラテン depraedari(略奪する)。', { syn: [{ w: 'plunder', m: '略奪' }, { w: 'devastation', m: '破壊' }], ant: [{ w: 'preservation', m: '保護' }], field: '軍事' }],
  ['dissolution', '名', '1', '解散・解消・崩壊', 'the dissolution of parliament', '議会の解散', 'ラテン dissolvere(分解する)。', { syn: [{ w: 'disbandment', m: '解散' }, { w: 'breakup', m: '崩壊' }], ant: [{ w: 'formation', m: '結成' }], field: '政治' }],
  ['dross', '名', '1', 'かす・くず・不純物', 'separate gold from dross', '金とかすを分ける', '古英語 dros(おり)。', { syn: [{ w: 'refuse', m: 'くず' }, { w: 'waste', m: '廃物' }], ant: [{ w: 'treasure', m: '宝' }], field: '科学' }],
  ['enmesh', '動', '1', '巻き込む・絡め取る', 'enmeshed in debt', '借金に絡め取られて', 'en+mesh(網)。', { syn: [{ w: 'entangle', m: '巻き込む' }, { w: 'ensnare', m: 'わなにかける' }], ant: [{ w: 'extricate', m: '抜け出させる' }], field: '一般' }],
  ['epicurean', '形', '1', '快楽主義の・美食の', 'epicurean tastes', '美食の趣味', 'ギリシャの哲学者 Epicurus から。', { syn: [{ w: 'hedonistic', m: '快楽主義の' }, { w: 'sensual', m: '官能的な' }], ant: [{ w: 'ascetic', m: '禁欲的な' }], field: '料理' }],
  ['gradation', '名', '1', '段階的変化・階調', 'subtle gradations of color', '微妙な色の階調', 'ラテン gradus(段階)。', { syn: [{ w: 'progression', m: '漸進' }, { w: 'shade', m: '濃淡' }], ant: [{ w: 'uniformity', m: '均一' }], field: '芸術' }],
  ['harrow', '動', '1', '(心を)苦しめる・かき乱す', 'a harrowing tale', '痛ましい話', '古英語 hearge(まぐわ)。', { syn: [{ w: 'distress', m: '苦しめる' }, { w: 'torment', m: '責めさいなむ' }], ant: [{ w: 'soothe', m: '和らげる' }], field: '心理' }],
  ['histrionics', '名', '1', '芝居がかった言動・大げさな振る舞い', 'tiresome histrionics', 'うんざりする芝居がかった態度', 'ラテン histrio(役者)。', { syn: [{ w: 'theatrics', m: '芝居がかり' }, { w: 'dramatics', m: '誇張した演技' }], ant: [{ w: 'restraint', m: '抑制' }], field: '心理' }],
  ['incongruity', '名', '1', '不調和・不釣り合い', 'a glaring incongruity', '甚だしい不釣り合い', 'in+congruity(一致)。', { syn: [{ w: 'inconsistency', m: '矛盾' }, { w: 'mismatch', m: '不一致' }], ant: [{ w: 'harmony', m: '調和' }], field: '一般' }],
  ['parley', '名', '1', '(敵との)交渉・会談', 'hold a parley', '会談を開く', 'フランス parler(話す)。', { syn: [{ w: 'negotiation', m: '交渉' }, { w: 'discussion', m: '協議' }], ant: [{ w: 'standoff', m: 'にらみ合い' }], field: '政治' }],
  ['pomposity', '名', '1', '尊大さ・もったいぶり', 'insufferable pomposity', '我慢ならない尊大さ', 'ラテン pompa(行列)。', { syn: [{ w: 'arrogance', m: '傲慢' }, { w: 'grandiosity', m: '誇大さ' }], ant: [{ w: 'modesty', m: '謙虚' }], field: '心理' }],
  ['precipitate', '動', '1', '(事態を)早める・引き起こす・突然の', 'precipitate a crisis', '危機を招く', 'ラテン praeceps(まっさかさまの)。', { syn: [{ w: 'hasten', m: '早める' }, { w: 'trigger', m: '引き起こす' }], ant: [{ w: 'delay', m: '遅らせる' }], field: '一般' }],
  ['recidivist', '名', '1', '常習犯・再犯者', 'a hardened recidivist', '常習的な再犯者', 'ラテン recidivus(再発する)。', { syn: [{ w: 'reoffender', m: '再犯者' }, { w: 'repeatoffender', m: '常習犯' }], ant: [{ w: 'firsttimer', m: '初犯者' }], field: '法律' }],
  ['repudiation', '名', '1', '拒絶・否認', 'a repudiation of the treaty', '条約の破棄', 'ラテン repudiare(離縁する)。', { syn: [{ w: 'rejection', m: '拒絶' }, { w: 'denial', m: '否認' }], ant: [{ w: 'acceptance', m: '受諾' }], field: '法律' }],
  ['sycophantic', '形', '1', 'こびへつらう・追従的な', 'sycophantic praise', 'おべっかの称賛', 'ギリシャ sykophantes(密告者)。', { syn: [{ w: 'obsequious', m: '卑屈な' }, { w: 'fawning', m: 'こびる' }], ant: [{ w: 'candid', m: '率直な' }], field: '社会' }],
  ['vociferate', '動', '1', '大声で叫ぶ・わめく', 'vociferate complaints', '不満をわめき立てる', 'ラテン vox(声)+ferre(運ぶ)。', { syn: [{ w: 'shout', m: '叫ぶ' }, { w: 'clamor', m: '騒ぎ立てる' }], ant: [{ w: 'whisper', m: 'ささやく' }], field: '社会' }],
  ['zealotry', '名', '1', '狂信・熱狂的傾倒', 'religious zealotry', '宗教的狂信', 'zealot(狂信者)+ -ry。', { syn: [{ w: 'fanaticism', m: '狂信' }, { w: 'extremism', m: '過激主義' }], ant: [{ w: 'moderation', m: '穏健' }], field: '宗教' }],
  ['aggrieve', '動', '1', '苦しめる・(権利を)侵害する', 'the aggrieved party', '被害を受けた側', 'ラテン aggravare(重くする)。', { syn: [{ w: 'wrong', m: '不当に扱う' }, { w: 'distress', m: '苦しめる' }], ant: [{ w: 'console', m: '慰める' }], field: '法律' }],
  ['maladroit', '形', '1', '不器用な・気のきかない', 'a maladroit attempt', '下手な試み', 'フランス mal(悪く)+adroit(巧みな)。', { syn: [{ w: 'clumsy', m: '不器用な' }, { w: 'inept', m: '不適切な' }], ant: [{ w: 'adroit', m: '巧みな' }], field: '一般' }],
  ['pusillanimous', '形', '1', '臆病な・小心な', 'a pusillanimous retreat', '臆病な退却', 'ラテン pusillus(小さい)+animus(心)。', { syn: [{ w: 'cowardly', m: '臆病な' }, { w: 'fainthearted', m: '気の弱い' }], ant: [{ w: 'valiant', m: '勇敢な' }], field: '心理' }],
]

export const WORDS_MORE135 = RAW.map(expandCompact)
