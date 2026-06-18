// 単語データ（探索マップ＋足場ジェネレータ #44）— フロンティア由来。意味はフロンティア値。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  ['bearer', '名', '1', '持参人・運ぶ人', 'the bearer of bad news', '悪い知らせの伝達者', 'bear(運ぶ)+ -er。', { syn: [{ w: 'carrier', m: '運搬人' }, { w: 'holder', m: '保有者' }], fam: [{ w: 'bear', m: '運ぶ' }], field: '一般' }],
  ['belligerent', '形', '1', '好戦的な・けんか腰の', 'a belligerent tone', 'けんか腰の口調', 'ラテン bellum(戦争)+gerere(行う)。', { syn: [{ w: 'aggressive', m: '攻撃的な' }, { w: 'hostile', m: '敵意のある' }], ant: [{ w: 'peaceable', m: '温和な' }], field: '軍事' }],
  ['belongings', '名', 'pre1', '所持品・持ち物', 'personal belongings', '身の回り品', 'belong(属する)+ -ings。', { syn: [{ w: 'possessions', m: '所有物' }, { w: 'effects', m: '所持品' }], fam: [{ w: 'belong', m: '属する' }], field: '一般' }],
  ['bonanza', '名', '1', '大もうけ・思わぬ幸運', 'a sales bonanza', '販売の大当たり', 'スペイン bonanza(穏やかな海・繁栄)。', { syn: [{ w: 'windfall', m: '思わぬ授かり物' }, { w: 'jackpot', m: '大当たり' }], ant: [{ w: 'loss', m: '損失' }], field: '経済' }],
  ['booming', '形', '1', '急成長の・とどろく', 'a booming industry', '急成長する産業', 'boom(急成長する)+ -ing。', { syn: [{ w: 'thriving', m: '繁栄している' }, { w: 'flourishing', m: '栄えている' }], ant: [{ w: 'declining', m: '衰退する' }], fam: [{ w: 'boom', m: '急成長する' }], field: 'ビジネス' }],
  ['breadth', '名', '1', '横幅・広さ・幅広さ', 'the breadth of knowledge', '知識の幅広さ', 'broad(広い)+ -th。', { syn: [{ w: 'width', m: '幅' }, { w: 'scope', m: '範囲' }], ant: [{ w: 'narrowness', m: '狭さ' }], fam: [{ w: 'broad', m: '広い' }], field: '測定' }],
  ['lethargy', '名', '1', '無気力・倦怠', 'a feeling of lethargy', '気だるさ', 'ギリシャ lethargia(忘却の眠り)。', { syn: [{ w: 'sluggishness', m: '不活発' }, { w: 'apathy', m: '無関心' }], ant: [{ w: 'vitality', m: '活力' }], fam: [{ w: 'lethargic', m: '無気力な' }], field: '医学' }],
  ['lamentable', '形', '1', '嘆かわしい・痛ましい', 'a lamentable mistake', '嘆かわしい誤り', 'lament(嘆く)+ -able。', { syn: [{ w: 'regrettable', m: '残念な' }, { w: 'deplorable', m: '嘆かわしい' }], ant: [{ w: 'admirable', m: '見事な' }], fam: [{ w: 'lament', m: '嘆く' }], field: '一般' }],
  ['lavishly', '副', '1', '豪華に・惜しみなく', 'lavishly decorated', '豪華に装飾された', 'lavish(豪華な)+ -ly。', { syn: [{ w: 'extravagantly', m: '贅沢に' }, { w: 'generously', m: '気前よく' }], ant: [{ w: 'sparingly', m: '控えめに' }], fam: [{ w: 'lavish', m: '豪華な' }], field: '副詞' }],
  ['lease', '名', 'pre1', '賃貸借・賃貸契約・賃借する', 'sign a lease', '賃貸契約を結ぶ', '古フランス lais(残すこと)→ relay と同系。', { syn: [{ w: 'rental', m: '賃貸' }, { w: 'tenancy', m: '賃借' }], fam: [{ w: 'leaseholder', m: '借地人' }], field: 'ビジネス' }],
  ['leisure', '名', 'pre1', '余暇・暇', 'leisure activities', '余暇活動', 'ラテン licere(許される)→ license と同系。', { syn: [{ w: 'relaxation', m: 'くつろぎ' }, { w: 'recreation', m: '娯楽' }], ant: [{ w: 'work', m: '仕事' }], fam: [{ w: 'leisurely', m: 'ゆったりした' }], field: '一般' }],
  ['lurid', '形', '1', 'どぎつい・けばけばしい', 'lurid details', '生々しい詳細', 'ラテン luridus(青ざめた)。', { syn: [{ w: 'sensational', m: '扇情的な' }, { w: 'gaudy', m: 'けばけばしい' }], ant: [{ w: 'subdued', m: '控えめな' }], field: 'メディア' }],
  ['mocking', '形', '1', 'あざける・ばかにした', 'a mocking smile', 'あざ笑うような笑み', 'mock(あざける)+ -ing。', { syn: [{ w: 'derisive', m: 'あざける' }, { w: 'scornful', m: '軽蔑的な' }], ant: [{ w: 'respectful', m: '敬意ある' }], fam: [{ w: 'mock', m: 'あざける' }], field: '社会' }],
  ['mansion', '名', 'pre1', '大邸宅・館', 'a country mansion', '田舎の大邸宅', 'ラテン mansio(滞在所)→ manor と同系。', { syn: [{ w: 'manor', m: '荘園屋敷' }, { w: 'residence', m: '邸宅' }], ant: [{ w: 'hut', m: '小屋' }], field: '建築' }],
  ['minion', '名', '1', '手下・子分', 'the boss and his minions', 'ボスとその手下', '古フランス mignon(かわいい者)。', { syn: [{ w: 'underling', m: '下働き' }, { w: 'henchman', m: '子分' }], ant: [{ w: 'boss', m: '親分' }], field: '社会' }],
  ['moody', '形', 'pre1', '気分屋の・不機嫌な', 'a moody teenager', '気分屋のティーンエイジャー', 'mood(気分)+ -y。', { syn: [{ w: 'temperamental', m: '気まぐれな' }, { w: 'sullen', m: '不機嫌な' }], ant: [{ w: 'even-tempered', m: '温厚な' }], fam: [{ w: 'mood', m: '気分' }], field: '心理' }],
  ['mop', '動', 'pre1', 'モップでふく・ぬぐう・モップ', 'mop the floor', '床をモップでふく', '中英語 mappe(ぞうきん)。', { syn: [{ w: 'wipe', m: 'ぬぐう' }, { w: 'swab', m: 'ふき取る' }], field: '一般' }],
  ['notably', '副', 'pre1', '著しく・とりわけ', 'notably absent', '目立って欠けて', 'notable(注目すべき)+ -ly。', { syn: [{ w: 'remarkably', m: '著しく' }, { w: 'particularly', m: '特に' }], ant: [{ w: 'insignificantly', m: 'わずかに' }], fam: [{ w: 'notable', m: '注目すべき' }], field: '副詞' }],
  ['narration', '名', '1', '語り・ナレーション', 'first-person narration', '一人称の語り', 'narrate(語る)+ -ion。', { syn: [{ w: 'storytelling', m: '物語ること' }, { w: 'recital', m: '朗読' }], fam: [{ w: 'narrate', m: '語る' }], field: '文学' }],
  ['nonchalant', '形', '1', '無頓着な・平然とした', 'a nonchalant shrug', '平然とした肩すくめ', 'フランス nonchaloir(気にかけない)。', { syn: [{ w: 'unconcerned', m: '無関心な' }, { w: 'casual', m: '何気ない' }], ant: [{ w: 'anxious', m: '心配な' }], field: '心理' }],
  ['nothingness', '名', '1', '虚無・無', 'a sense of nothingness', '虚無感', 'nothing(無)+ -ness。', { syn: [{ w: 'void', m: '空虚' }, { w: 'emptiness', m: '空虚' }], ant: [{ w: 'existence', m: '存在' }], field: '宗教' }],
  ['lamely', '副', '1', '不十分に・説得力なく', 'explained lamely', '苦しい言い訳をした', 'lame(不十分な)+ -ly。', { syn: [{ w: 'feebly', m: '弱々しく' }, { w: 'unconvincingly', m: '説得力なく' }], ant: [{ w: 'convincingly', m: '説得力をもって' }], fam: [{ w: 'lame', m: '不十分な' }], field: '副詞' }],
  ['mirth', '名', '1', '笑い騒ぎ・陽気', 'a source of mirth', '笑いの種', '古英語 myrgth(喜び)→ merry と同系。', { syn: [{ w: 'merriment', m: '陽気' }, { w: 'glee', m: '大喜び' }], ant: [{ w: 'sorrow', m: '悲しみ' }], field: '心理' }],
  ['largesse', '名', '1', '気前のよさ・施し', 'distribute largesse', '施しを配る', '古フランス largesse(気前のよさ)→ large と同系。', { syn: [{ w: 'generosity', m: '寛大さ' }, { w: 'munificence', m: '物惜しみしないこと' }], ant: [{ w: 'stinginess', m: 'けち' }], field: '社会' }],
  ['lull', '動', '1', '寝かしつける・なだめる・小休止', 'lull the baby to sleep', '赤ちゃんを寝かしつける', '中英語 lullen(あやす音)。', { syn: [{ w: 'soothe', m: 'なだめる' }, { w: 'calm', m: '落ち着かせる' }], ant: [{ w: 'agitate', m: 'かき立てる' }], field: '一般' }],
  ['brevity', '名', '1', '簡潔さ・短さ', 'for the sake of brevity', '簡潔にするため', 'ラテン brevis(短い)→ brief と同系。', { syn: [{ w: 'conciseness', m: '簡潔' }, { w: 'shortness', m: '短さ' }], ant: [{ w: 'verbosity', m: '冗長' }], fam: [{ w: 'brief', m: '簡潔な' }], field: '言語' }],
]

export const WORDS_MORE87 = RAW.map(expandCompact)
