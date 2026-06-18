// 単語データ（探索マップ＋足場ジェネレータ #31）— フロンティア由来。意味はフロンティア値。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  ['pass', '動', 'pre1', '通る・可決する・合格する・手渡す', 'pass the exam', '試験に合格する', 'ラテン passus(歩み)→ pace と同系。', { syn: [{ w: 'approve', m: '可決する' }, { w: 'go by', m: '通り過ぎる' }], ant: [{ w: 'fail', m: '落第する' }], fam: [{ w: 'passable', m: '通行可能な' }], field: '一般' }],
  ['passable', '形', 'pre1', '通行可能な・まずまずの', 'a passable road', '通行可能な道', 'pass(通る)+ -able。', { syn: [{ w: 'navigable', m: '航行可能な' }, { w: 'adequate', m: 'まあまあの' }], ant: [{ w: 'impassable', m: '通行不能の' }], fam: [{ w: 'pass', m: '通る' }], field: '交通' }],
  ['silence', '名', 'pre1', '沈黙・静寂', 'an awkward silence', '気まずい沈黙', 'ラテン silere(黙る)。', { syn: [{ w: 'quiet', m: '静けさ' }, { w: 'hush', m: '静寂' }], ant: [{ w: 'noise', m: '騒音' }], fam: [{ w: 'silent', m: '静かな' }], field: '一般' }],
  ['stillness', '名', '4', '静止・静けさ', 'the stillness of dawn', '夜明けの静けさ', 'still(静かな)+ -ness', { fam: [{ w: 'still', m: '静かな' }], syn: [{ w: 'calm', m: '平穏' }], ant: [{ w: 'movement', m: '動き' }], field: '一般' }],
  ['adaptability', '名', 'pre1', '適応性・順応性', 'the adaptability of the species', '種の適応性', 'adaptable(適応できる)+ -ity。', { syn: [{ w: 'flexibility', m: '柔軟性' }, { w: 'versatility', m: '多才' }], ant: [{ w: 'rigidity', m: '硬直性' }], fam: [{ w: 'adapt', m: '適応する' }], field: '科学' }],
  ['brawn', '名', '1', '筋力・腕力', 'brains over brawn', '腕力より知力', '古フランス braon(肉の塊)。', { syn: [{ w: 'muscle', m: '筋肉' }, { w: 'strength', m: '力' }], ant: [{ w: 'brains', m: '知力' }], fam: [{ w: 'brawny', m: '筋骨たくましい' }], field: '医学' }],
  ['broadening', '名', 'pre1', '拡張・広がり', 'the broadening of horizons', '視野の拡大', 'broaden(広げる)+ -ing。', { syn: [{ w: 'widening', m: '拡張' }, { w: 'expansion', m: '拡大' }], ant: [{ w: 'narrowing', m: '狭まり' }], fam: [{ w: 'broaden', m: '広げる' }], field: '一般' }],
  ['burly', '形', '1', 'がっしりした・大柄な', 'a burly bodyguard', 'がっしりしたボディーガード', '中英語 borlich(立派な)。', { syn: [{ w: 'brawny', m: '筋骨たくましい' }, { w: 'stocky', m: 'ずんぐりした' }], ant: [{ w: 'slender', m: 'ほっそりした' }], field: '医学' }],
  ['denounced', '形', 'pre1', '糾弾された・公然と非難された', 'a denounced regime', '糾弾された政権', 'denounce(糾弾する)+ -d。', { syn: [{ w: 'condemned', m: '非難された' }, { w: 'criticized', m: '批判された' }], ant: [{ w: 'praised', m: '称賛された' }], fam: [{ w: 'denounce', m: '糾弾する' }], field: '社会' }],
  ['din', '名', '1', '騒音・やかましい音', 'the din of the city', '都会の喧騒', '古英語 dyne(音)。', { syn: [{ w: 'racket', m: '騒ぎ' }, { w: 'clamor', m: '騒音' }], ant: [], field: '一般' }],
  ['elasticity', '名', 'pre1', '弾力性・伸縮性', 'the elasticity of rubber', 'ゴムの弾力性', 'elastic(弾力のある)+ -ity。', { syn: [{ w: 'flexibility', m: '柔軟性' }, { w: 'springiness', m: '弾力' }], ant: [{ w: 'rigidity', m: '硬直性' }], fam: [{ w: 'elastic', m: '弾力のある' }], field: '科学' }],
  ['federation', '名', 'pre1', '連邦・連盟', 'a sports federation', 'スポーツ連盟', 'ラテン foedus(同盟)。', { syn: [{ w: 'union', m: '連合' }, { w: 'alliance', m: '同盟' }], fam: [{ w: 'federal', m: '連邦の' }], field: '政治' }],
  ['flattering', '形', 'pre1', 'お世辞の・引き立てる', 'a flattering portrait', '実物以上によく描かれた肖像', 'flatter(おだてる)+ -ing。', { syn: [{ w: 'complimentary', m: '称賛の' }, { w: 'becoming', m: '似合う' }], ant: [{ w: 'unflattering', m: '引き立てない' }], fam: [{ w: 'flatter', m: 'おだてる' }], field: '社会' }],
  ['gnaw', '動', '1', 'かじる・苦しめる', 'The dog gnawed the bone.', '犬は骨をかじった。', '古英語 gnagan(かじる)。', { syn: [{ w: 'nibble', m: '少しずつかじる' }, { w: 'chew', m: 'かむ' }], field: '一般' }],
  ['illusion', '名', 'pre1', '錯覚・幻想', 'an optical illusion', '目の錯覚', 'ラテン illudere(あざむく)→ delude と同系。', { syn: [{ w: 'delusion', m: '思い違い' }, { w: 'mirage', m: '蜃気楼' }], ant: [{ w: 'reality', m: '現実' }], fam: [{ w: 'illusory', m: '幻想の' }], field: '心理' }],
  ['immobile', '形', 'pre1', '動かない・固定された', 'remain immobile', '微動だにしない', 'im(否定)+mobile(可動の)。', { syn: [{ w: 'motionless', m: '動かない' }, { w: 'static', m: '静止した' }], ant: [{ w: 'mobile', m: '可動の' }], fam: [{ w: 'immobility', m: '不動' }], field: '一般' }],
  ['inland', '形', 'pre1', '内陸の・内地の', 'an inland city', '内陸都市', 'in(中)+land(土地)。', { syn: [{ w: 'interior', m: '内陸の' }, { w: 'landlocked', m: '内陸の' }], ant: [{ w: 'coastal', m: '沿岸の' }], field: '地理' }],
  ['kit', '名', 'pre1', '道具一式・キット', 'a first-aid kit', '救急箱', '中世オランダ kitte(おけ)。', { syn: [{ w: 'set', m: '一式' }, { w: 'gear', m: '装備' }], field: '一般' }],
  ['mankind', '名', 'pre1', '人類・人間', 'the future of mankind', '人類の未来', 'man(人)+kind(種類)。', { syn: [{ w: 'humanity', m: '人類' }, { w: 'humankind', m: '人類' }], field: '社会' }],
  ['momentary', '形', 'pre1', '瞬間的な・つかの間の', 'a momentary lapse', 'つかの間の不注意', 'moment(瞬間)+ -ary。', { syn: [{ w: 'brief', m: '短い' }, { w: 'fleeting', m: 'はかない' }], ant: [{ w: 'permanent', m: '永続的な' }], fam: [{ w: 'moment', m: '瞬間' }], field: '一般' }],
  ['munch', '動', 'pre1', 'もぐもぐ食べる・むしゃむしゃ食べる', 'munch on chips', 'ポテチをむしゃむしゃ食べる', '擬音語(14世紀)。', { syn: [{ w: 'chew', m: 'かむ' }, { w: 'nibble', m: '少しずつかじる' }], field: '一般' }],
  ['municipality', '名', 'pre1', '自治体・市町村', 'the local municipality', '地方自治体', 'municipal(市の)+ -ity', { fam: [{ w: 'municipal', m: '市の' }], syn: [{ w: 'township', m: '区' }, { w: 'borough', m: '自治区' }], field: '政治' }],
  ['national', '形', 'pre1', '国の・全国的な・国民', 'national security', '国家安全保障', 'nation(国)+ -al。', { syn: [{ w: 'nationwide', m: '全国的な' }, { w: 'state', m: '国家の' }], ant: [{ w: 'local', m: '地方の' }], fam: [{ w: 'nation', m: '国家' }], field: '政治' }],
  ['nomad', '名', '1', '遊牧民・放浪者', 'desert nomads', '砂漠の遊牧民', 'ギリシャ nomas(放牧する人)。', { syn: [{ w: 'wanderer', m: '放浪者' }, { w: 'drifter', m: '流れ者' }], ant: [{ w: 'settler', m: '定住者' }], fam: [{ w: 'nomadic', m: '遊牧の' }], field: '社会' }],
  ['nomadic', '形', 'pre1', '遊牧の・放浪の', 'a nomadic lifestyle', '遊牧の暮らし', 'nomad(遊牧民)+ -ic。', { syn: [{ w: 'wandering', m: '放浪の' }, { w: 'migratory', m: '移動性の' }], ant: [{ w: 'settled', m: '定住の' }], fam: [{ w: 'nomad', m: '遊牧民' }], field: '社会' }],
  ['nomination', '名', '1', '指名・推薦・ノミネート', 'an Oscar nomination', 'オスカー候補', 'nominate(指名する)+ -ation', { fam: [{ w: 'nominate', m: '指名する' }], syn: [{ w: 'appointment', m: '任命' }, { w: 'selection', m: '選定' }], field: '政治' }],
  ['nonfiction', '名', 'pre1', 'ノンフィクション・実話', 'a work of nonfiction', 'ノンフィクション作品', 'non(否定)+fiction(虚構)。', { syn: [{ w: 'factual writing', m: '事実に基づく文章' }], ant: [{ w: 'fiction', m: '小説' }], fam: [{ w: 'fiction', m: '虚構' }], field: '文学' }],
]

export const WORDS_MORE74 = RAW.map(expandCompact)
