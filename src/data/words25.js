// 単語データ（継続 / 6000語へ）— 分野別(歴史/宗教/軍事/音楽/交通/建築/農業/気象/料理/メディア)＋上級副詞。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 宗教・精神
  ['religion', '名', 'pre2', '宗教', 'They respect every religion.', '彼らはあらゆる宗教を尊重する。', 'ラテン religare(結びつける)。', { field: '宗教' }],
  ['worship', '名', 'pre1', '崇拝・礼拝する(動)', 'They gathered for worship.', '彼らは礼拝のために集まった。', '古英語 weorthscipe(価値ある状態)→ worth と同源。', { syn: [{ w: 'pray', m: '祈る' }], field: '宗教' }],
  ['holy', '形', 'pre1', '神聖な', 'It is a holy place.', 'そこは神聖な場所だ。', '古英語 hālig→ whole と同系。', { syn: [{ w: 'sacred', m: '神聖な' }, { w: 'divine', m: '神の' }], field: '宗教' }],
  ['ritual', '名', '1', '儀式・しきたり', 'The ceremony follows an old ritual.', 'その式典は古い儀式に従う。', 'ラテン ritus(儀礼)。', { syn: [{ w: 'ceremony', m: '儀式' }, { w: 'rite', m: '儀礼' }], field: '宗教' }],
  ['soul', '名', 'pre1', '魂・精神', 'Music touches the soul.', '音楽は魂に響く。', '古英語 sāwol「魂」。', { syn: [{ w: 'spirit', m: '精神' }], ant: [{ w: 'body', m: '肉体' }], field: '宗教' }],
  ['sin', '名', 'pre1', '罪・罪を犯す(動)', 'He confessed his sins.', '彼は自分の罪を告白した。', '古英語 synn「罪」。', { syn: [{ w: 'wrongdoing', m: '悪行' }], ant: [{ w: 'virtue', m: '美徳' }], field: '宗教' }],
  ['divine', '形', '1', '神の・神聖な', 'They believe in divine power.', '彼らは神の力を信じる。', 'ラテン divus(神)。', { syn: [{ w: 'holy', m: '神聖な' }, { w: 'sacred', m: '神聖な' }], field: '宗教' }],
  ['prophet', '名', '1', '預言者', 'The prophet warned the people.', '預言者は人々に警告した。', 'ギリシャ pro+phanai(前もって語る)。', { field: '宗教' }],
  // 軍事
  ['army', '名', '3', '軍隊・陸軍', 'He joined the army.', '彼は軍隊に入った。', 'ラテン armata(武装した)→ arm と同源。', { syn: [{ w: 'troops', m: '軍勢' }, { w: 'forces', m: '軍' }], field: '軍事' }],
  ['navy', '名', 'pre2', '海軍', 'Her brother is in the navy.', '彼女の兄は海軍にいる。', 'ラテン navis(船)→ naval と同源。', { field: '軍事' }],
  ['soldier', '名', '3', '兵士', 'The soldiers marched on.', '兵士たちは行進し続けた。', 'ラテン solidus(金貨)→給料をもらう兵。', { syn: [{ w: 'warrior', m: '戦士' }], field: '軍事' }],
  ['weapon', '名', 'pre2', '武器', 'They laid down their weapons.', '彼らは武器を捨てた。', '古英語 wǣpen「武器」。', { syn: [{ w: 'arms', m: '兵器' }], field: '軍事' }],
  ['troop', '名', 'pre1', '軍隊・部隊', 'Troops were sent to the border.', '部隊が国境へ送られた。', '古フランス trope(群れ)。', { syn: [{ w: 'unit', m: '部隊' }], field: '軍事' }],
  ['retreat', '動', 'pre1', '退却する・退却(名)', 'The army retreated north.', '軍は北へ退却した。', 'ラテン re+trahere(引く)→ tract と同源。', { syn: [{ w: 'withdraw', m: '撤退する' }], ant: [{ w: 'advance', m: '前進する' }], field: '軍事' }],
  ['surrender', '動', 'pre1', '降伏する・引き渡す', 'The soldiers surrendered.', '兵士たちは降伏した。', '古フランス sur+rendre(引き渡す)→ render と同系。', { syn: [{ w: 'give up', m: '降参する' }], ant: [{ w: 'resist', m: '抵抗する' }], field: '軍事' }],
  ['ally', '名', '1', '同盟国・味方', 'The two nations are allies.', '両国は同盟国だ。', 'ラテン ad+ligare(結ぶ)→ ligature と同系。', { ant: [{ w: 'enemy', m: '敵' }, { w: 'foe', m: '敵' }], field: '軍事' }],
  ['enemy', '名', '3', '敵', 'They defeated the enemy.', '彼らは敵を破った。', 'ラテン in(否定)+amicus(友)→ amity と同系。', { syn: [{ w: 'foe', m: '敵' }, { w: 'opponent', m: '相手' }], ant: [{ w: 'ally', m: '味方' }], field: '軍事' }],
  // 歴史・社会
  ['empire', '名', 'pre1', '帝国', 'The Roman empire was vast.', 'ローマ帝国は広大だった。', 'ラテン imperium(支配)→ emperor と同源。', { field: '歴史' }],
  ['dynasty', '名', '1', '王朝', 'The dynasty ruled for centuries.', 'その王朝は数世紀続いた。', 'ギリシャ dynasteia(支配)→ dynamic と同系。', { syn: [{ w: 'reign', m: '治世' }], field: '歴史' }],
  ['ancestor', '名', 'pre1', '祖先', 'Her ancestors came from Spain.', '彼女の先祖はスペイン出身だ。', 'ラテン ante+cedere(先に行く)→ cess と同源。', { ant: [{ w: 'descendant', m: '子孫' }], field: '歴史' }],
  ['slavery', '名', 'pre1', '奴隷制', 'They fought to end slavery.', '彼らは奴隷制廃止のため戦った。', 'slave(スラブ人→奴隷)+ -ry。', { ant: [], field: '歴史' }],
  ['civilization', '名', 'pre1', '文明', 'Ancient civilizations built cities.', '古代文明は都市を築いた。', 'ラテン civis(市民)→ civil と同源。', { field: '歴史' }],
  ['monument', '名', 'pre1', '記念碑・遺跡', 'They built a monument to him.', '彼らは彼の記念碑を建てた。', 'ラテン monere(思い出させる)→ monitor と同系。', { syn: [], field: '歴史' }],
  ['ruin', '名', 'pre1', '廃墟・破滅・台無しにする(動)', 'They explored ancient ruins.', '彼らは古代遺跡を探検した。', 'ラテン ruere(崩れ落ちる)。', { syn: [{ w: 'destroy', m: '破壊する' }, { w: 'wreck', m: '破壊する' }], field: '歴史' }],
  // 音楽
  ['harmony', '名', 'pre1', '調和・ハーモニー', 'They sang in harmony.', '彼らは調和して歌った。', 'ギリシャ harmonia(つなぎ合わせ)。', { syn: [{ w: 'agreement', m: '一致' }], ant: [{ w: 'discord', m: '不和' }], field: '音楽' }],
  ['orchestra', '名', 'pre1', 'オーケストラ・管弦楽団', 'The orchestra played beautifully.', '管弦楽団は見事に演奏した。', 'ギリシャ orkhestra(舞台前の場所)。', { field: '音楽' }],
  ['choir', '名', 'pre1', '聖歌隊・合唱団', 'She sings in the church choir.', '彼女は教会の聖歌隊で歌う。', 'ラテン chorus(合唱)→ chorus と同源。', { syn: [{ w: 'chorus', m: '合唱' }], field: '音楽' }],
  ['composer', '名', 'pre1', '作曲家', 'Mozart was a great composer.', 'モーツァルトは偉大な作曲家だった。', 'compose(作曲する)+ -er→ pos と同系。', { syn: [{ w: 'songwriter', m: '作曲者' }], field: '音楽' }],
  // 交通
  ['vehicle', '名', 'pre1', '乗り物・車両', 'No vehicles are allowed here.', 'ここは車両進入禁止だ。', 'ラテン vehere(運ぶ)。', { syn: [{ w: 'car', m: '車' }, { w: 'transport', m: '輸送機関' }], field: '交通' }],
  ['voyage', '名', 'pre1', '航海・船旅', 'They set out on a long voyage.', '彼らは長い航海に出た。', 'ラテン via(道)→ via と同源。', { syn: [{ w: 'journey', m: '旅' }, { w: 'trip', m: '旅行' }], field: '交通' }],
  ['route', '名', 'pre2', '経路・道筋', 'We took the fastest route.', '私たちは最短経路を取った。', 'ラテン rupta via(切り開かれた道)。', { syn: [{ w: 'path', m: '道' }, { w: 'way', m: '道' }], field: '交通' }],
  ['passenger', '名', '3', '乗客', 'The plane carried 200 passengers.', '飛行機は200人の乗客を運んだ。', 'フランス passager(通り過ぎる人)→ pass と同系。', { field: '交通' }],
  ['fuel', '名', 'pre2', '燃料・あおる(動)', 'The car ran out of fuel.', '車は燃料切れになった。', 'ラテン focus(炉)→ focus と同源。', { syn: [{ w: 'gas', m: 'ガソリン' }], field: '交通' }],
  // 建築
  ['foundation', '名', 'pre1', '基礎・土台・財団', 'The house has a strong foundation.', 'その家は土台が丈夫だ。', 'ラテン fundus(底)→ found と同源。', { syn: [{ w: 'base', m: '土台' }, { w: 'basis', m: '基礎' }], field: '建築' }],
  ['pillar', '名', 'pre1', '柱・支柱', 'Stone pillars support the roof.', '石の柱が屋根を支える。', 'ラテン pila(柱)。', { syn: [{ w: 'column', m: '円柱' }, { w: 'post', m: '支柱' }], field: '建築' }],
  ['tower', '名', '3', '塔・そびえ立つ(動)', 'The tower is 300 meters tall.', 'その塔は高さ300mだ。', 'ラテン turris(塔)。', { field: '建築' }],
  ['cathedral', '名', 'pre1', '大聖堂', 'They visited a Gothic cathedral.', '彼らはゴシック様式の大聖堂を訪れた。', 'ギリシャ kathedra(司教座)→ chair と同系。', { syn: [{ w: 'church', m: '教会' }], field: '建築' }],
  // 農業
  ['soil', '名', 'pre1', '土壌・土', 'Rich soil grows good crops.', '肥沃な土壌は良い作物を育てる。', '古フランス soil(地面)→ラテン solium。', { syn: [{ w: 'earth', m: '土' }, { w: 'ground', m: '地面' }], field: '農業' }],
  ['livestock', '名', '1', '家畜', 'The farm raises livestock.', 'その農場は家畜を飼育する。', 'live(生きた)+stock(蓄え)。', { syn: [{ w: 'cattle', m: '牛・家畜' }], field: '農業' }],
  ['pasture', '名', '1', '牧草地', 'Cows grazed in the pasture.', '牛が牧草地で草を食んだ。', 'ラテン pascere(食べさせる)。', { syn: [{ w: 'meadow', m: '草地' }, { w: 'field', m: '野原' }], field: '農業' }],
  ['irrigation', '名', '1', '灌漑(かんがい)', 'Irrigation brings water to fields.', '灌漑は畑に水をもたらす。', 'ラテン in+rigare(水をやる)。', { field: '農業' }],
  ['barn', '名', 'pre2', '納屋・畜舎', 'The hay is stored in the barn.', '干し草は納屋に保管される。', '古英語 bere+ærn(大麦の家)。', { syn: [{ w: 'shed', m: '小屋' }], field: '農業' }],
  // 気象
  ['humid', '形', 'pre1', '湿気の多い', 'Summers here are hot and humid.', 'ここの夏は暑くて湿気が多い。', 'ラテン humidus(湿った)。', { syn: [{ w: 'damp', m: '湿った' }, { w: 'moist', m: '湿った' }], ant: [{ w: 'dry', m: '乾いた' }], field: '気象' }],
  ['frost', '名', 'pre1', '霜・厳寒', 'Frost covered the grass.', '霜が草を覆った。', '古英語 frost→ freeze と同源。', { field: '気象' }],
  ['thunder', '名', 'pre2', '雷・雷鳴', 'We heard thunder in the distance.', '遠くで雷鳴が聞こえた。', '古英語 thunor→ Thor(雷神)。', { field: '気象' }],
  ['lightning', '名', 'pre2', '稲妻・電光', 'Lightning struck the tree.', '稲妻が木に落ちた。', 'lighten(光らせる)+ -ing。', { field: '気象' }],
  // 料理・食
  ['cuisine', '名', 'pre1', '料理・料理法', 'Italian cuisine is popular.', 'イタリア料理は人気だ。', 'フランス cuisine(台所)→ cook と同系。', { syn: [{ w: 'cooking', m: '料理' }, { w: 'food', m: '食べ物' }], field: '料理' }],
  ['spice', '名', 'pre2', '香辛料・スパイス', 'Add some spice to the curry.', 'カレーに香辛料を加えて。', 'ラテン species(種類・商品)→ species と同源。', { der: [{ w: 'spicy', m: '辛い' }], field: '料理' }],
  ['nutrition', '名', 'pre1', '栄養', 'Good nutrition keeps you healthy.', '良い栄養は健康を保つ。', 'ラテン nutrire(養う)→ nurse と同系。', { field: '医学' }],
  ['appetite', '名', 'pre1', '食欲・欲求', 'Exercise gives me an appetite.', '運動すると食欲がわく。', 'ラテン ad+petere(求める)→ compete と同系。', { syn: [{ w: 'hunger', m: '空腹' }, { w: 'desire', m: '欲求' }], field: '医学' }],
  // メディア
  ['broadcast', '動', 'pre1', '放送する・放送(名)', 'The game was broadcast live.', 'その試合は生放送された。', 'broad(広く)+cast(投げる)→広く投げる。', { syn: [{ w: 'air', m: '放送する' }, { w: 'transmit', m: '送信する' }], field: 'メディア' }],
  ['journalism', '名', '1', '報道・ジャーナリズム', 'She studies journalism.', '彼女は報道を学ぶ。', 'journal(日刊紙)+ -ism→ journey と同系。', { field: 'メディア' }],
  ['advertisement', '名', 'pre2', '広告', 'I saw the advertisement on TV.', '私はその広告をテレビで見た。', 'ラテン ad+vertere(向ける)→ vers と同源。', { syn: [{ w: 'ad', m: '広告' }, { w: 'commercial', m: 'CM' }], field: 'メディア' }],
  ['publish', '動', '2', '出版する・公表する', 'They published a new book.', '彼らは新刊を出版した。', 'ラテン publicare(公にする)→ public と同源。', { der: [{ w: 'publisher', m: '出版社' }], field: 'メディア' }],
  ['rumor', '名', 'pre1', 'うわさ', 'The rumor spread quickly.', 'そのうわさはすぐ広まった。', 'ラテン rumor(評判)。', { syn: [{ w: 'gossip', m: 'うわさ話' }], field: 'メディア' }],
  // 上級副詞
  ['namely', '副', 'pre1', 'すなわち・つまり', 'One student passed, namely Tom.', '一人合格した、すなわちトムだ。', 'name(名)+ -ly。', { syn: [{ w: 'specifically', m: '具体的には' }], field: '副詞' }],
  ['likewise', '副', 'pre1', '同様に', 'She left, and he did likewise.', '彼女は去り、彼も同様にした。', 'like(同様)+wise(やり方)。', { syn: [], field: '副詞' }],
  ['hence', '副', '1', 'それゆえに・今から', 'He was ill; hence he stayed home.', '彼は病気だった、それゆえ家にいた。', '中英語 hennes(ここから)。', { syn: [{ w: 'therefore', m: 'それゆえ' }, { w: 'thus', m: 'こうして' }], field: '副詞' }],
  ['nonetheless', '副', '1', 'それにもかかわらず', 'It was hard; nonetheless, she tried.', '難しかったが、それでも彼女は試みた。', 'none+the+less(それだけ少なくない)。', { syn: [{ w: 'nevertheless', m: 'それでも' }, { w: 'however', m: 'しかし' }], field: '副詞' }],
  ['accordingly', '副', '1', 'それに応じて・したがって', 'Plans changed; act accordingly.', '計画が変わった、それに応じて動け。', 'accord(一致)+ -ingly。', { syn: [{ w: 'therefore', m: 'したがって' }], field: '副詞' }],
  ['presumably', '副', 'pre1', 'おそらく・推定では', 'Presumably, he forgot.', 'おそらく彼は忘れたのだろう。', 'presume(推定する)+ -ably→ sume と同系。', { syn: [{ w: 'probably', m: 'たぶん' }, { w: 'likely', m: 'おそらく' }], field: '副詞' }],
  ['inevitably', '副', 'pre1', '必然的に・避けられず', 'Prices inevitably rose.', '物価は必然的に上がった。', 'inevitable(避けられない)+ -ly。', { syn: [{ w: 'unavoidably', m: '避けがたく' }], field: '副詞' }],
  ['ultimately', '副', 'pre1', '最終的に・結局', 'Ultimately, they agreed.', '最終的に、彼らは合意した。', 'ultimate(最終の)+ -ly。', { syn: [{ w: 'finally', m: '最後に' }, { w: 'eventually', m: '結局' }], field: '副詞' }],
  ['simultaneously', '副', '1', '同時に', 'They spoke simultaneously.', '彼らは同時に話した。', 'ラテン simul(同時に)→ similar と同系。', { syn: [{ w: 'at once', m: '一度に' }], field: '副詞' }],
  ['primarily', '副', 'pre1', '主に・第一に', 'The book is primarily for kids.', 'その本は主に子供向けだ。', 'primary(主要な)+ -ly→ prime と同系。', { syn: [{ w: 'mainly', m: '主に' }, { w: 'chiefly', m: '主として' }], field: '副詞' }],
]

export const WORDS_MORE24 = RAW.map(expandCompact)
