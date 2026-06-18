// 単語データ（探索マップ＋足場ジェネレータ #59）— フロンティア由来。6000到達フィニッシュバッチ。
import { expandCompact } from './compact.js'

const RAW = [
  ['depiction', '名', '1', '描写・表現', 'a vivid depiction', '鮮やかな描写', 'depict(描く)+ -ion。', { syn: [{ w: 'portrayal', m: '描出' }, { w: 'representation', m: '表現' }], fam: [{ w: 'depict', m: '描く' }], field: '芸術' }],
  ['agonizing', '形', '1', '苦しい・苦悶の', 'an agonizing decision', '苦渋の決断', 'agonize(苦悩する)+ -ing。', { syn: [{ w: 'excruciating', m: '耐えがたい' }, { w: 'tormenting', m: '苦しめる' }], ant: [{ w: 'soothing', m: '心地よい' }], fam: [{ w: 'agony', m: '苦悶' }], field: '医学' }],
  ['contrite', '形', '1', '悔いた・悔恨した', 'a contrite apology', '悔恨に満ちた謝罪', 'ラテン contritus(打ち砕かれた)。', { syn: [{ w: 'remorseful', m: '後悔した' }, { w: 'repentant', m: '悔い改めた' }], ant: [{ w: 'unrepentant', m: '反省しない' }], fam: [{ w: 'contrition', m: '悔恨' }], field: '宗教' }],
  ['declining', '形', '1', '衰退する・減少する', 'a declining industry', '斜陽産業', 'decline(衰える)+ -ing。', { syn: [{ w: 'waning', m: '衰える' }, { w: 'dwindling', m: '減少する' }], ant: [{ w: 'thriving', m: '繁栄している' }], fam: [{ w: 'decline', m: '衰える' }], field: '経済' }],
  ['disclosure', '名', '1', '公開・開示・暴露', 'full disclosure', '全面開示', 'disclose(暴露する)+ -ure。', { syn: [{ w: 'revelation', m: '暴露' }, { w: 'exposure', m: '暴露' }], ant: [{ w: 'concealment', m: '隠蔽' }], fam: [{ w: 'disclose', m: '暴露する' }], field: '法律' }],
  ['outdated', '形', 'pre1', '時代遅れの・旧式の', 'outdated technology', '旧式の技術', 'out(超えて)+dated(日付の)。', { syn: [{ w: 'obsolete', m: '廃れた' }, { w: 'antiquated', m: '古めかしい' }], ant: [{ w: 'current', m: '最新の' }], fam: [{ w: 'date', m: '日付' }], field: '技術' }],
  ['perceptible', '形', '1', '知覚できる・感じられる', 'a perceptible change', '感じ取れる変化', 'perceive(知覚する)+ -ible。', { syn: [{ w: 'discernible', m: '識別できる' }, { w: 'noticeable', m: '目立つ' }], ant: [{ w: 'imperceptible', m: '感知できない' }], fam: [{ w: 'perceive', m: '知覚する' }], field: '一般' }],
  ['provocation', '名', '1', '挑発・誘発', 'without provocation', '挑発もないのに', 'provoke(挑発する)+ -ation。', { syn: [{ w: 'incitement', m: '扇動' }, { w: 'instigation', m: '教唆' }], ant: [{ w: 'pacification', m: '鎮静' }], fam: [{ w: 'provoke', m: '挑発する' }], field: '社会' }],
  ['restoration', '名', '1', '復元・返還・修復', 'art restoration', '美術品の修復', 'restore(回復する)+ -ation。', { syn: [{ w: 'renovation', m: '改修' }, { w: 'repair', m: '修理' }], ant: [{ w: 'destruction', m: '破壊' }], fam: [{ w: 'restore', m: '回復する' }], field: '芸術' }],
  ['ruined', '形', '1', '破滅した・荒廃した', 'a ruined castle', '荒廃した城', 'ruin(破滅させる)+ -ed。', { syn: [{ w: 'devastated', m: '荒廃した' }, { w: 'wrecked', m: '破壊された' }], ant: [{ w: 'intact', m: '無傷の' }], fam: [{ w: 'ruin', m: '破滅させる' }], field: '一般' }],
  ['spiritual', '形', 'pre1', '精神的な・霊的な', 'spiritual growth', '精神的成長', 'spirit(精神)+ -ual。', { syn: [{ w: 'sacred', m: '神聖な' }, { w: 'religious', m: '宗教的な' }], ant: [{ w: 'material', m: '物質的な' }], fam: [{ w: 'spirit', m: '精神' }], field: '宗教' }],
  ['treacherous', '形', '1', '危険な・裏切りの', 'treacherous waters', '危険な海域', 'treachery(不実)+ -ous。', { syn: [{ w: 'perilous', m: '危険な' }, { w: 'disloyal', m: '不忠の' }], ant: [{ w: 'safe', m: '安全な' }], fam: [{ w: 'treachery', m: '不実' }], field: '一般' }],
  ['trustworthy', '形', 'pre1', '信頼できる・当てになる', 'a trustworthy source', '信頼できる情報源', 'trust(信頼)+worthy(値する)。', { syn: [{ w: 'reliable', m: '頼りになる' }, { w: 'dependable', m: '当てになる' }], ant: [{ w: 'unreliable', m: '当てにならない' }], fam: [{ w: 'trust', m: '信頼' }], field: '心理' }],
  ['atone', '動', '1', '償う・あがなう', 'atone for the sin', '罪を償う', 'at one(一体になる)→和解する。', { syn: [{ w: 'redeem', m: 'あがなう' }, { w: 'compensate', m: '埋め合わせる' }], fam: [{ w: 'atonement', m: '償い' }], field: '宗教' }],
  ['bearable', '形', '1', '耐えられる・我慢できる', 'barely bearable', 'かろうじて耐えられる', 'bear(耐える)+ -able。', { syn: [{ w: 'tolerable', m: '耐えられる' }, { w: 'endurable', m: '我慢できる' }], ant: [{ w: 'unbearable', m: '耐えられない' }], fam: [{ w: 'bear', m: '耐える' }], field: '一般' }],
  ['carefree', '形', '1', '気楽な・のんきな', 'a carefree childhood', '屈託のない子供時代', 'care(心配)+free(ない)。', { syn: [{ w: 'lighthearted', m: '快活な' }, { w: 'untroubled', m: '平穏な' }], ant: [{ w: 'anxious', m: '不安な' }], fam: [{ w: 'care', m: '心配' }], field: '心理' }],
  ['compensation', '名', 'pre1', '補償・報酬', 'financial compensation', '金銭的補償', 'compensate(補償する)+ -ation。', { syn: [{ w: 'reparation', m: '賠償' }, { w: 'reimbursement', m: '払い戻し' }], ant: [{ w: 'penalty', m: '罰金' }], fam: [{ w: 'compensate', m: '補償する' }], field: '法律' }],
  ['ardently', '副', '1', '熱心に・熱烈に', 'ardently support', '熱烈に支持する', 'ardent(熱烈な)+ -ly。', { syn: [{ w: 'passionately', m: '情熱的に' }, { w: 'fervently', m: '熱烈に' }], ant: [{ w: 'indifferently', m: '無関心に' }], fam: [{ w: 'ardent', m: '熱烈な' }], field: '副詞' }],
  ['instigation', '名', '1', '教唆・扇動', 'at his instigation', '彼の扇動で', 'instigate(扇動する)+ -ion。', { syn: [{ w: 'incitement', m: '扇動' }, { w: 'provocation', m: '挑発' }], ant: [{ w: 'deterrence', m: '抑止' }], fam: [{ w: 'instigate', m: '扇動する' }], field: '社会' }],
]

export const WORDS_MORE102 = RAW.map(expandCompact)
