// 単語データ（探索マップ＋足場ジェネレータ #32）— フロンティア由来。意味はフロンティア値。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  ['rigidity', '名', '1', '硬直性・厳格さ', 'the rigidity of the rules', '規則の厳格さ', 'rigid(硬い)+ -ity', { fam: [{ w: 'rigid', m: '硬い' }], syn: [{ w: 'stiffness', m: '硬さ' }, { w: 'inflexibility', m: '融通のきかなさ' }], ant: [{ w: 'flexibility', m: '柔軟性' }], field: '性質・状態' }],
  ['chew', '動', 'pre1', 'かむ・かみ砕く', 'Our puppy likes to chew my old shoes.', 'うちの子犬は私の古い靴をかむのが好きだ。', '古英語 ceowan(かむ)。', { syn: [{ w: 'munch', m: 'もぐもぐ食べる' }, { w: 'gnaw', m: 'かじる' }], ant: [{ w: 'swallow', m: '飲み込む' }], field: '一般' }],
  ['racket', '名', 'pre1', 'ラケット', 'She bought a new tennis racket.', '彼女は新しいテニスラケットを買った。', 'おそらく擬音語(16世紀)。', { syn: [{ w: 'din', m: '騒音' }, { w: 'clamor', m: '喧噪' }], ant: [{ w: 'silence', m: '静寂' }], field: '一般' }],
  ['becoming', '形', 'pre1', '似合う・ふさわしい', 'a becoming dress', '似合うドレス', 'become(似合う)+ -ing。', { syn: [{ w: 'flattering', m: '引き立てる' }, { w: 'suitable', m: '適した' }], ant: [{ w: 'unbecoming', m: '似合わない' }], fam: [{ w: 'become', m: '似合う' }], field: '一般' }],
  ['borough', '名', '1', '自治区・行政区', 'a London borough', 'ロンドンの行政区', '古英語 burg(城塞・町)。', { syn: [{ w: 'district', m: '地区' }, { w: 'township', m: '区' }], field: '政治' }],
  ['brains', '名', 'pre1', '知力・頭脳', 'use your brains', '頭を使う', 'brain(脳)の複数。', { syn: [{ w: 'intellect', m: '知性' }, { w: 'wits', m: '知恵' }], ant: [{ w: 'brawn', m: '腕力' }], fam: [{ w: 'brain', m: '脳' }], field: '一般' }],
  ['clamor', '名', '1', '騒音・抗議の叫び', 'a clamor for change', '変革を求める声', 'ラテン clamare(叫ぶ)→ claim と同系。', { syn: [{ w: 'uproar', m: '騒動' }, { w: 'outcry', m: '抗議の叫び' }], ant: [{ w: 'silence', m: '静寂' }], fam: [{ w: 'clamorous', m: '騒々しい' }], field: '社会' }],
  ['coastal', '形', 'pre1', '沿岸の・海岸の', 'The typhoon brought strong winds to coastal areas last night.', '台風は昨夜、沿岸地域に強風をもたらした。', 'coast(海岸)+ -al。', { syn: [{ w: 'seaside', m: '海辺の' }, { w: 'maritime', m: '沿海の' }], ant: [{ w: 'inland', m: '内陸の' }], fam: [{ w: 'coast', m: '海岸' }], field: '地理' }],
  ['drifter', '名', '1', '流れ者・放浪者', 'a lonely drifter', '孤独な放浪者', 'drift(漂う)+ -er', { fam: [{ w: 'drift', m: '漂う' }], syn: [{ w: 'wanderer', m: '放浪者' }, { w: 'vagrant', m: '浮浪者' }], ant: [{ w: 'settler', m: '定住者' }], field: '社会' }],
  ['elastic', '形', 'pre1', '弾力のある・伸縮自在の', 'These pants have an elastic waist, so they are very comfortable.', 'このズボンはウエストが伸縮自在なので、とてもはき心地がよい。', 'ギリシャ elastikos(押し戻す)。', { syn: [{ w: 'stretchy', m: '伸びる' }, { w: 'flexible', m: '柔軟な' }], ant: [{ w: 'rigid', m: '硬い' }], fam: [{ w: 'elasticity', m: '弾力性' }], field: '科学' }],
  ['federal', '形', 'pre1', '連邦の・連邦政府の', 'The United States has a federal government and fifty state governments.', 'アメリカ合衆国には連邦政府と50の州政府がある。', 'ラテン foedus(同盟)→ federation と同系。', { syn: [{ w: 'national', m: '国家の' }], ant: [{ w: 'state', m: '州の' }], fam: [{ w: 'federation', m: '連邦' }], field: '政治' }],
  ['humankind', '名', 'pre1', '人類', 'Clean water is one of the most important resources for humankind.', 'きれいな水は、人類にとって最も重要な資源の一つだ。', 'human(人間)+kind(種類)。', { syn: [{ w: 'mankind', m: '人類' }, { w: 'humanity', m: '人類' }], field: '社会' }],
  ['hush', '名', 'pre1', '静寂・沈黙・静かにさせる', 'a sudden hush', '突然の静けさ', '擬音語(16世紀)。', { syn: [{ w: 'silence', m: '沈黙' }, { w: 'stillness', m: '静けさ' }], ant: [{ w: 'din', m: '騒音' }], field: '一般' }],
  ['illusory', '形', '1', '幻想の・実体のない', 'illusory hopes', 'はかない望み', 'illusion(錯覚)+ -ory。', { syn: [{ w: 'imaginary', m: '想像上の' }, { w: 'deceptive', m: '見せかけの' }], ant: [{ w: 'real', m: '実在の' }], fam: [{ w: 'illusion', m: '錯覚' }], field: '心理' }],
  ['interior', '名', 'pre1', '内部・内陸・室内の', 'The interior of the old church was cool and dark.', 'その古い教会の内部は涼しくて暗かった。', 'ラテン interior(内側の)。', { syn: [{ w: 'inside', m: '内側' }, { w: 'inland', m: '内陸' }], ant: [{ w: 'exterior', m: '外部' }], field: '一般' }],
  ['landlocked', '形', '1', '内陸の・陸に囲まれた', 'a landlocked country', '内陸国', 'land(陸)+locked(閉ざされた)。', { syn: [{ w: 'inland', m: '内陸の' }], ant: [{ w: 'coastal', m: '沿岸の' }], field: '地理' }],
  ['mirage', '名', '1', '蜃気楼・幻影', 'a desert mirage', '砂漠の蜃気楼', 'フランス mirer(映す)→ mirror と同系。', { syn: [{ w: 'illusion', m: '幻影' }, { w: 'hallucination', m: '幻覚' }], ant: [{ w: 'reality', m: '現実' }], field: '科学' }],
  ['motionless', '形', '2', '動かない・静止した', 'The cat sat motionless, watching the bird outside the window.', '猫は窓の外の鳥を見つめながら、じっと動かずに座っていた。', 'motion(動き)+ -less', { fam: [{ w: 'motion', m: '動き' }], syn: [{ w: 'still', m: '静止した' }, { w: 'immobile', m: '動かない' }], ant: [{ w: 'moving', m: '動いている' }], field: '一般' }],
  ['nation', '名', 'pre1', '国家・国民', 'The whole nation watched the final game on TV.', '国民全体がテレビで決勝戦を見た。', 'ラテン natio(生まれ・民族)→ native と同系。', { syn: [{ w: 'country', m: '国' }, { w: 'state', m: '国家' }], fam: [{ w: 'national', m: '国の' }], field: '政治' }],
  ['nationwide', '形', 'pre1', '全国的な・全国規模の', 'a nationwide survey', '全国調査', 'nation(国)+wide(広い)。', { syn: [{ w: 'national', m: '全国の' }, { w: 'countrywide', m: '全国的な' }], ant: [{ w: 'local', m: '地方の' }], fam: [{ w: 'nation', m: '国家' }], field: '社会' }],
  ['nonlinear', '形', '1', '非線形の・直線的でない', 'a nonlinear narrative', '時系列でない語り', 'non(否定)+linear(線形の)。', { ant: [{ w: 'linear', m: '線形の' }], fam: [{ w: 'line', m: '線' }], field: '科学' }],
  ['nonreligious', '形', '1', '非宗教の・世俗の', 'a nonreligious ceremony', '非宗教的な式典', 'non(否定)+religious(宗教の)。', { syn: [{ w: 'secular', m: '世俗の' }], ant: [{ w: 'religious', m: '宗教の' }], fam: [{ w: 'religion', m: '宗教' }], field: '宗教' }],
  ['nonrenewable', '形', '1', '再生不能の・枯渇性の', 'nonrenewable resources', '枯渇性資源', 'non(否定)+renewable(再生可能な)。', { ant: [{ w: 'renewable', m: '再生可能な' }], fam: [{ w: 'renew', m: '更新する' }], field: '環境' }],
  ['nostalgic', '形', 'pre1', '懐かしい・郷愁を誘う', 'Looking at old class photos always makes Dad feel nostalgic.', '古いクラス写真を見ると、父はいつも懐かしい気持ちになる。', 'ギリシャ nostos(帰郷)+algos(痛み)。', { syn: [{ w: 'wistful', m: '物思わしげな' }, { w: 'sentimental', m: '感傷的な' }], ant: [{ w: 'forward-looking', m: '前向きの' }], fam: [{ w: 'nostalgia', m: '郷愁' }], field: '心理' }],
]

export const WORDS_MORE75 = RAW.map(expandCompact)
