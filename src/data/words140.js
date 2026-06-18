// 単語データ #96 — 英検1級の上級語彙⑯（A-Z補充10巡目・1000到達）。難解・低頻度の正確な語のみ。
import { expandCompact } from './compact.js'

const RAW = [
  ['abdicate', '動', '1', '(王位・責任を)放棄する・退位する', 'abdicate the throne', '退位する', 'ラテン ab+dicare(宣言する)。', { syn: [{ w: 'renounce', m: '放棄する' }, { w: 'resign', m: '辞する' }], ant: [{ w: 'assume', m: '引き受ける' }], field: '政治' }],
  ['aberrant', '形', '1', '常軌を逸した・異常な', 'aberrant behavior', '異常な行動', 'ラテン aberrare(さまよい出る)。', { syn: [{ w: 'deviant', m: '逸脱した' }, { w: 'abnormal', m: '異常な' }], ant: [{ w: 'normal', m: '正常な' }], field: '心理' }],
  ['amalgamate', '動', '1', '合併する・融合させる', 'amalgamate the firms', '会社を合併する', 'ラテン amalgama(合金)。', { syn: [{ w: 'merge', m: '合併する' }, { w: 'combine', m: '結合する' }], ant: [{ w: 'separate', m: '分離する' }], field: 'ビジネス' }],
  ['apostate', '名', '1', '背教者・変節者', 'denounced as an apostate', '背教者として糾弾される', 'ギリシャ apostates(離反者)。', { syn: [{ w: 'defector', m: '離反者' }, { w: 'renegade', m: '裏切り者' }], ant: [{ w: 'loyalist', m: '忠臣' }], field: '宗教' }],
  ['archetype', '名', '1', '原型・典型', 'the archetype of a hero', '英雄の原型', 'ギリシャ archetypon(原型)。', { syn: [{ w: 'prototype', m: '原型' }, { w: 'model', m: '典型' }], ant: [{ w: 'copy', m: '複製' }], field: '一般' }],
  ['beget', '動', '1', '生じさせる・(子を)もうける', 'violence begets violence', '暴力は暴力を生む', '古英語 begietan(得る)。', { syn: [{ w: 'generate', m: '生む' }, { w: 'produce', m: '引き起こす' }], ant: [{ w: 'prevent', m: '防ぐ' }], field: '一般' }],
  ['belabor', '動', '1', 'くどくど述べる・打ちのめす', 'belabor the point', 'その点をくどくど述べる', 'be+labor(骨折る)。', { syn: [{ w: 'overemphasize', m: '強調しすぎる' }, { w: 'dwell on', m: 'こだわる' }], ant: [{ w: 'summarize', m: '要約する' }], field: '一般' }],
  ['commiserate', '動', '1', '同情する・哀れむ', 'commiserate with him', '彼に同情する', 'ラテン com+miserari(哀れむ)。', { syn: [{ w: 'sympathize', m: '同情する' }, { w: 'console', m: '慰める' }], ant: [{ w: 'gloat', m: 'ほくそ笑む' }], field: '心理' }],
  ['concomitant', '形', '1', '付随する・同時に起こる', 'concomitant risks', '付随するリスク', 'ラテン com+comitari(伴う)。', { syn: [{ w: 'accompanying', m: '付随する' }, { w: 'attendant', m: '伴う' }], ant: [{ w: 'unrelated', m: '無関係な' }], field: '一般' }],
  ['confluence', '名', '1', '合流・(物事の)集まり', 'a confluence of factors', '要因の重なり', 'ラテン con+fluere(流れる)。', { syn: [{ w: 'convergence', m: '収束' }, { w: 'junction', m: '合流点' }], ant: [{ w: 'divergence', m: '分岐' }], field: '一般' }],
  ['dally', '動', '1', 'ぐずぐずする・もてあそぶ', 'dally over the decision', '決断をぐずぐず引き延ばす', '古フランス dalier(おしゃべりする)。', { syn: [{ w: 'dawdle', m: 'のろのろする' }, { w: 'linger', m: '長居する' }], ant: [{ w: 'hasten', m: '急ぐ' }], field: '一般' }],
  ['exacting', '形', '1', '厳しい・骨の折れる', 'an exacting task', '骨の折れる仕事', 'exact(要求する)+ing。', { syn: [{ w: 'demanding', m: '要求の厳しい' }, { w: 'rigorous', m: '厳格な' }], ant: [{ w: 'lenient', m: '寛大な' }], field: '一般' }],
  ['imbue', '動', '1', '(感情・思想を)吹き込む・染み込ませる', 'imbue them with hope', '彼らに希望を吹き込む', 'ラテン imbuere(湿らせる)。', { syn: [{ w: 'instill', m: '植えつける' }, { w: 'infuse', m: '注ぎ込む' }], ant: [{ w: 'drain', m: '抜き取る' }], field: '一般' }],
  ['ingratiate', '動', '1', '取り入る・機嫌をとる', 'ingratiate himself with the boss', '上司に取り入る', 'ラテン in+gratia(好意)。', { syn: [{ w: 'flatter', m: 'こびる' }, { w: 'curry favor', m: '取り入る' }], ant: [{ w: 'alienate', m: '遠ざける' }], field: '社会' }],
  ['palatial', '形', '1', '宮殿のような・壮麗な', 'a palatial mansion', '宮殿のような大邸宅', 'ラテン palatium(宮殿)。', { syn: [{ w: 'grand', m: '壮大な' }, { w: 'opulent', m: '豪華な' }], ant: [{ w: 'humble', m: '質素な' }], field: '建築' }],
  ['recapitulate', '動', '1', '要約する・繰り返して述べる', 'recapitulate the argument', '論点を要約する', 'ラテン re+capitulum(章)。', { syn: [{ w: 'summarize', m: '要約する' }, { w: 'recap', m: '要点を繰り返す' }], ant: [{ w: 'elaborate', m: '詳述する' }], field: '一般' }],
  ['scintilla', '名', '1', 'ごくわずか・微塵', 'not a scintilla of doubt', '一片の疑いもない', 'ラテン scintilla(火花)。', { syn: [{ w: 'trace', m: '微量' }, { w: 'iota', m: 'ほんの少し' }], ant: [{ w: 'abundance', m: '大量' }], field: '一般' }],
]

export const WORDS_MORE139 = RAW.map(expandCompact)
