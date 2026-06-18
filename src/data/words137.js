// 単語データ #93 — 英検1級の上級語彙⑬（A-Z補充7巡目）。難解・低頻度の正確な語のみ。
import { expandCompact } from './compact.js'

const RAW = [
  ['acrimonious', '形', '1', 'とげとげしい・辛辣な', 'an acrimonious divorce', 'もめにもめた離婚', 'ラテン acrimonia(鋭さ)。', { syn: [{ w: 'bitter', m: '険悪な' }, { w: 'rancorous', m: '恨みのこもった' }], ant: [{ w: 'amicable', m: '友好的な' }], field: '社会' }],
  ['amenable', '形', '1', '従順な・受け入れる用意のある', 'amenable to change', '変化を受け入れる', 'ラテン minari(脅す)→導く。', { syn: [{ w: 'agreeable', m: '快く応じる' }, { w: 'compliant', m: '従順な' }], ant: [{ w: 'resistant', m: '抵抗する' }], field: '心理' }],
  ['apprehension', '名', '1', '不安・懸念・逮捕', 'a sense of apprehension', '不安感', 'ラテン apprehendere(つかむ)。', { syn: [{ w: 'anxiety', m: '心配' }, { w: 'dread', m: '恐れ' }], ant: [{ w: 'confidence', m: '自信' }], field: '心理' }],
  ['askance', '副', '1', '横目で・疑わしげに', 'look askance at', '〜を疑いの目で見る', '由来不確か(16世紀)。', { syn: [{ w: 'suspiciously', m: '疑わしげに' }, { w: 'sidewise', m: '横目で' }], ant: [{ w: 'directly', m: 'まっすぐに' }], field: '一般' }],
  ['bedlam', '名', '1', '大騒ぎ・混乱', 'the room was bedlam', '部屋は大混乱だった', 'ロンドンの精神病院 Bethlehem から。', { syn: [{ w: 'chaos', m: '混沌' }, { w: 'pandemonium', m: '大混乱' }], ant: [{ w: 'order', m: '秩序' }], field: '一般' }],
  ['blandishment', '名', '1', '甘言・おだて', 'resist his blandishments', '彼の甘言に乗らない', 'ラテン blandiri(おだてる)。', { syn: [{ w: 'flattery', m: 'おべっか' }, { w: 'cajolery', m: '言いくるめ' }], ant: [{ w: 'criticism', m: '批判' }], field: '社会' }],
  ['debonair', '形', '1', '物腰の優雅な・愛想のよい', 'a debonair gentleman', '優雅な紳士', '古フランス de bon aire(育ちのよい)。', { syn: [{ w: 'suave', m: '物腰柔らかな' }, { w: 'urbane', m: '洗練された' }], ant: [{ w: 'awkward', m: 'ぎこちない' }], field: '社会' }],
  ['ebullience', '名', '1', '熱狂・あふれる元気', 'youthful ebullience', '若者のあふれる元気', 'ラテン ebullire(沸き立つ)。', { syn: [{ w: 'exuberance', m: '活気' }, { w: 'vivacity', m: '快活さ' }], ant: [{ w: 'gloom', m: '陰鬱' }], field: '心理' }],
  ['incontrovertible', '形', '1', '反論の余地のない・明白な', 'incontrovertible proof', '動かぬ証拠', 'in+controvert(反論する)。', { syn: [{ w: 'indisputable', m: '争えない' }, { w: 'irrefutable', m: '論破できない' }], ant: [{ w: 'debatable', m: '議論の余地ある' }], field: '一般' }],
  ['insouciance', '名', '1', '無頓着・のんき', 'youthful insouciance', '若者ののんきさ', 'フランス insouciant(気にしない)。', { syn: [{ w: 'nonchalance', m: '無関心' }, { w: 'unconcern', m: '無頓着' }], ant: [{ w: 'anxiety', m: '不安' }], field: '心理' }],
  ['malfeasance', '名', '1', '不正行為・違法行為', 'official malfeasance', '公職者の不正', 'フランス malfaisance(悪事)。', { syn: [{ w: 'misconduct', m: '不正行為' }, { w: 'wrongdoing', m: '悪事' }], ant: [{ w: 'integrity', m: '誠実' }], field: '法律' }],
  ['nettlesome', '形', '1', '厄介な・いらだたせる', 'a nettlesome problem', '厄介な問題', 'nettle(いらだたせる)+some。', { syn: [{ w: 'troublesome', m: '厄介な' }, { w: 'irritating', m: 'いらだたしい' }], ant: [{ w: 'soothing', m: '心地よい' }], field: '一般' }],
  ['profligacy', '名', '1', '放蕩・浪費', 'financial profligacy', '財政の浪費', 'ラテン profligare(打ち倒す)。', { syn: [{ w: 'extravagance', m: '浪費' }, { w: 'dissipation', m: '放蕩' }], ant: [{ w: 'thrift', m: '倹約' }], field: '経済' }],
  ['recalcitrance', '名', '1', '反抗・強情', 'persistent recalcitrance', '執拗な反抗', 'ラテン re+calcitrare(蹴る)。', { syn: [{ w: 'defiance', m: '反抗' }, { w: 'obstinacy', m: '強情' }], ant: [{ w: 'compliance', m: '従順' }], field: '心理' }],
  ['reticence', '名', '1', '寡黙・控えめ', 'his habitual reticence', '彼の常の寡黙さ', 'ラテン reticere(黙っている)。', { syn: [{ w: 'reserve', m: '無口' }, { w: 'taciturnity', m: '寡黙' }], ant: [{ w: 'garrulity', m: '多弁' }], field: '心理' }],
  ['sanctimony', '名', '1', '聖人ぶり・偽善', 'unbearable sanctimony', '我慢ならない偽善', 'ラテン sanctus(神聖な)。', { syn: [{ w: 'selfrighteousness', m: '独善' }, { w: 'hypocrisy', m: '偽善' }], ant: [{ w: 'sincerity', m: '誠実' }], field: '宗教' }],
  ['seditious', '形', '1', '扇動的な・反逆の', 'seditious pamphlets', '扇動的な小冊子', 'ラテン seditio(反乱)。', { syn: [{ w: 'rebellious', m: '反抗的な' }, { w: 'subversive', m: '破壊的な' }], ant: [{ w: 'loyal', m: '忠実な' }], field: '政治' }],
  ['virulence', '名', '1', '毒性・(敵意の)激しさ', 'the virulence of the attack', '攻撃の激しさ', 'ラテン virus(毒)。', { syn: [{ w: 'toxicity', m: '毒性' }, { w: 'malignancy', m: '悪意' }], ant: [{ w: 'harmlessness', m: '無害さ' }], field: '医学' }],
  ['voracity', '名', '1', '貪欲・食欲旺盛', 'read with voracity', 'むさぼるように読む', 'ラテン vorare(むさぼる)。', { syn: [{ w: 'greed', m: '貪欲' }, { w: 'rapacity', m: '強欲' }], ant: [{ w: 'moderation', m: '節度' }], field: '心理' }],
]

export const WORDS_MORE136 = RAW.map(expandCompact)
