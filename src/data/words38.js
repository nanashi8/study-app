// 単語データ（継続 / 6000語へ）— 語族つき動詞/人物・因果の名詞/判断の形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 動詞（語族つき）
  ['navigate', '動', 'pre1', '航行する・操縦する・うまく進む', 'They navigated by the stars.', '彼らは星を頼りに航行した。', 'ラテン navis(船)+agere(進める)。', { syn: [{ w: 'steer', m: '操縦する' }, { w: 'sail', m: '航海する' }], fam: [{ w: 'navigation', m: '航行' }, { w: 'navigator', m: '航海士' }, { w: 'navigable', m: '航行可能な' }], field: '交通' }],
  ['legislate', '動', '1', '立法する・法律を制定する', 'Congress will legislate on the issue.', '議会はその問題で立法する。', 'ラテン lex(法)+latio(運ぶこと)。', { syn: [{ w: 'enact', m: '制定する' }], fam: [{ w: 'legislation', m: '立法・法律' }, { w: 'legislator', m: '立法者' }, { w: 'legislative', m: '立法の' }, { w: 'legislature', m: '議会' }], field: '政治' }],
  ['regulate', '動', 'pre1', '規制する・調整する', 'Laws regulate trade.', '法律が貿易を規制する。', 'ラテン regula(規則)→ rule と同系。', { syn: [{ w: 'control', m: '管理する' }, { w: 'govern', m: '統制する' }], fam: [{ w: 'regulation', m: '規制' }, { w: 'regulator', m: '規制機関' }, { w: 'regulatory', m: '規制の' }], field: '法律' }],
  ['prosecute', '動', '1', '起訴する・遂行する', 'They will prosecute the offender.', '彼らは違反者を起訴する。', 'ラテン pro+sequi(追う)→ pursue と同系。', { syn: [{ w: 'charge', m: '告訴する' }], ant: [{ w: 'defend', m: '弁護する' }], fam: [{ w: 'prosecution', m: '起訴' }, { w: 'prosecutor', m: '検察官' }], field: '法律' }],
  ['persecute', '動', '1', '迫害する', 'They were persecuted for their faith.', '彼らは信仰のため迫害された。', 'ラテン per+sequi(追い回す)→ pursue と同系。', { syn: [{ w: 'torment', m: '苦しめる' }], fam: [{ w: 'persecution', m: '迫害' }], field: '社会' }],
  ['fabricate', '動', '1', 'でっち上げる・製造する', 'He fabricated an excuse.', '彼は言い訳をでっち上げた。', 'ラテン fabrica(工房)→ fabric と同系。', { syn: [{ w: 'invent', m: '捏造する' }, { w: 'manufacture', m: '製造する' }], fam: [{ w: 'fabrication', m: '捏造・製造' }, { w: 'fabric', m: '生地' }], field: '動作・行為' }],
  ['replicate', '動', '1', '複製する・再現する', 'They replicated the experiment.', '彼らはその実験を再現した。', 'ラテン replicare(折り返す)→ reply と同系。', { syn: [{ w: 'copy', m: '複製する' }, { w: 'reproduce', m: '再現する' }], fam: [{ w: 'replication', m: '複製' }, { w: 'replica', m: '複製品' }], field: '科学' }],
  ['vindicate', '動', '1', '潔白を証明する・正当性を示す', 'The evidence vindicated him.', '証拠が彼の潔白を証明した。', 'ラテン vindicare(主張する)。', { syn: [{ w: 'justify', m: '正当化する' }, { w: 'clear', m: '汚名を晴らす' }], fam: [{ w: 'vindication', m: '弁明' }], field: '法律' }],
  ['consolidate', '動', '1', '強化する・統合する', 'They consolidated their power.', '彼らは権力を強固にした。', 'ラテン con+solidus(固い)→ solid と同系。', { syn: [{ w: 'strengthen', m: '強化する' }, { w: 'merge', m: '統合する' }], fam: [{ w: 'consolidation', m: '統合' }], field: 'ビジネス' }],
  ['propagate', '動', '1', '広める・繁殖させる', 'They propagate plants from seeds.', '彼らは種から植物を増やす。', 'ラテン propagare(挿し木で増やす)。', { syn: [{ w: 'spread', m: '広める' }, { w: 'multiply', m: '繁殖させる' }], fam: [{ w: 'propagation', m: '繁殖・普及' }], field: '農業' }],
  // 人物・因果の名詞
  ['predecessor', '名', '1', '前任者・前身', 'She praised her predecessor.', '彼女は前任者を称えた。', 'ラテン prae+decedere(去る)→ cess と同系。', { ant: [{ w: 'successor', m: '後継者' }], field: '社会' }],
  ['successor', '名', '1', '後継者・継承者', 'He named his successor.', '彼は後継者を指名した。', 'ラテン succedere(続く)→ succeed と同系。', { ant: [{ w: 'predecessor', m: '前任者' }], field: '社会' }],
  ['bystander', '名', '1', '傍観者・居合わせた人', 'A bystander called for help.', '居合わせた人が助けを呼んだ。', 'by(そばに)+stander(立つ人)。', { syn: [{ w: 'onlooker', m: '見物人' }, { w: 'witness', m: '目撃者' }], field: '社会' }],
  ['culprit', '名', '1', '犯人・元凶', 'The police found the culprit.', '警察は犯人を見つけた。', '古フランス法律用語 culpable(有罪の)。', { syn: [{ w: 'offender', m: '犯人' }, { w: 'wrongdoer', m: '悪事を働く者' }], field: '法律' }],
  ['perpetrator', '名', '1', '加害者・犯人', 'The perpetrator fled the scene.', '加害者は現場から逃げた。', 'ラテン perpetrare(やり遂げる)。', { syn: [{ w: 'offender', m: '犯人' }, { w: 'culprit', m: '犯人' }], ant: [{ w: 'victim', m: '被害者' }], field: '法律' }],
  ['deterrent', '名', '1', '抑止力・歯止め', 'Fines act as a deterrent.', '罰金は抑止力となる。', 'deter(思いとどまらせる)+ -ent。', { syn: [{ w: 'discouragement', m: '抑止' }, { w: 'disincentive', m: '抑止要因' }], ant: [{ w: 'incentive', m: '誘因' }], field: '法律' }],
  ['precursor', '名', '1', '前兆・先駆け', 'It was a precursor to war.', 'それは戦争の前触れだった。', 'ラテン prae+currere(走る)→ current と同系。', { syn: [{ w: 'forerunner', m: '先駆者' }, { w: 'predecessor', m: '前身' }], field: '一般' }],
  ['aftermath', '名', '1', '余波・直後の影響', 'They rebuilt in the aftermath of the war.', '彼らは戦後の混乱の中で再建した。', 'after(後)+math(刈り取り)。', { syn: [{ w: 'consequence', m: '結果' }, { w: 'repercussion', m: '余波' }], field: '一般' }],
  ['backlash', '名', '1', '反発・反動', 'The policy caused a backlash.', 'その政策は反発を招いた。', 'back(後ろ)+lash(打つ)。', { syn: [{ w: 'reaction', m: '反応' }], field: '社会' }],
  ['inception', '名', '1', '始まり・発端', 'from its inception', '発足当初から', 'ラテン in+capere(取る)→ cept と同系。', { syn: [{ w: 'beginning', m: '始まり' }, { w: 'start', m: '開始' }], ant: [{ w: 'conclusion', m: '終了' }], field: '一般' }],
  ['influx', '名', '1', '流入・殺到', 'an influx of tourists', '観光客の流入', 'ラテン in+fluere(流れる)→ flux と同系。', { syn: [{ w: 'inflow', m: '流入' }], ant: [{ w: 'exodus', m: '流出' }], field: '社会' }],
  ['exodus', '名', '1', '大量流出・脱出', 'a mass exodus from the city', '都市からの大量流出', 'ギリシャ ex(外へ)+hodos(道)。', { syn: [{ w: 'departure', m: '退去' }, { w: 'migration', m: '移住' }], ant: [{ w: 'influx', m: '流入' }], field: '社会' }],
  // 判断・性質の形容詞
  ['impending', '形', '1', '差し迫った', 'an impending disaster', '差し迫った災害', 'ラテン im+pendere(垂れ下がる)→ pend と同系。', { syn: [{ w: 'imminent', m: '切迫した' }, { w: 'looming', m: '迫りくる' }], field: '性質・状態' }],
  ['daunting', '形', '1', 'ひるませる・気の遠くなる', 'It was a daunting task.', 'それは気の遠くなる仕事だった。', '古フランス danter(屈服させる)→ daunt。', { syn: [{ w: 'intimidating', m: '威圧的な' }, { w: 'overwhelming', m: '圧倒的な' }], ant: [{ w: 'easy', m: '容易な' }], field: '性質・状態' }],
  ['credible', '形', 'pre1', '信用できる・もっともらしい', 'She gave a credible account.', '彼女は信用できる説明をした。', 'ラテン credere(信じる)→ credit と同系。', { syn: [{ w: 'believable', m: '信じられる' }, { w: 'plausible', m: 'もっともらしい' }], ant: [{ w: 'incredible', m: '信じがたい' }], fam: [{ w: 'credibility', m: '信頼性' }, { w: 'credit', m: '信用' }], field: '性質・状態' }],
  ['skeptical', '形', '1', '懐疑的な・疑い深い', 'He is skeptical of the claim.', '彼はその主張に懐疑的だ。', 'ギリシャ skeptikos(熟考する)。', { syn: [{ w: 'doubtful', m: '疑わしい' }, { w: 'dubious', m: '半信半疑の' }], ant: [{ w: 'convinced', m: '確信した' }], fam: [{ w: 'skepticism', m: '懐疑' }, { w: 'skeptic', m: '懐疑論者' }], field: '心理' }],
  ['gullible', '形', '1', 'だまされやすい・お人よしの', "Don't be so gullible.", 'そうだまされやすくならないで。', 'gull(だます)+ -ible。', { syn: [{ w: 'naive', m: '世間知らずの' }, { w: 'credulous', m: '信じやすい' }], ant: [{ w: 'skeptical', m: '懐疑的な' }], field: '性質・状態' }],
  ['cynical', '形', '1', '皮肉な・人を信じない', 'She has a cynical view of politics.', '彼女は政治に冷めた見方をする。', 'ギリシャ kynikos(犬のような)→犬儒派。', { syn: [{ w: 'pessimistic', m: '悲観的な' }, { w: 'distrustful', m: '不信の' }], ant: [{ w: 'optimistic', m: '楽観的な' }], fam: [{ w: 'cynicism', m: '皮肉' }, { w: 'cynic', m: '皮肉屋' }], field: '心理' }],
  ['blunt', '形', '1', '率直な・(刃が)鈍い', 'He was blunt about his opinion.', '彼は意見をずけずけ言った。', '中英語 blunt(鈍い)。', { syn: [{ w: 'frank', m: '率直な' }, { w: 'direct', m: '直接的な' }], ant: [{ w: 'sharp', m: '鋭い' }], field: '性質・状態' }],
]

export const WORDS_MORE37 = RAW.map(expandCompact)
