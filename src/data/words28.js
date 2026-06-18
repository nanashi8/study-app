// 単語データ（継続 / 6000語へ）— 生物/化学/物理/地理/抽象名詞/程度の動詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 生物・医学
  ['bacteria', '名', 'pre1', '細菌・バクテリア', 'Bacteria can cause disease.', '細菌は病気を引き起こしうる。', 'ギリシャ bakterion(小さな杖)。', { syn: [{ w: 'germs', m: '病原菌' }, { w: 'microbes', m: '微生物' }], field: '医学' }],
  ['mammal', '名', 'pre1', '哺乳類', 'Whales are mammals.', 'クジラは哺乳類だ。', 'ラテン mamma(乳房)。', { field: '科学' }],
  ['reptile', '名', 'pre1', '爬虫類', 'Snakes are reptiles.', 'ヘビは爬虫類だ。', 'ラテン repere(這う)。', { field: '科学' }],
  ['predator', '名', 'pre1', '捕食者・肉食動物', 'Lions are top predators.', 'ライオンは頂点捕食者だ。', 'ラテン praedari(略奪する)→ prey と同系。', { ant: [{ w: 'prey', m: '獲物' }], field: '科学' }],
  ['prey', '名', 'pre1', '獲物・えじき', 'The hawk caught its prey.', 'タカは獲物を捕らえた。', 'ラテン praeda(戦利品)。', { ant: [{ w: 'predator', m: '捕食者' }], field: '科学' }],
  ['nutrient', '名', '1', '栄養素', 'Plants absorb nutrients.', '植物は栄養素を吸収する。', 'ラテン nutrire(養う)→ nutrition と同源。', { syn: [{ w: 'nourishment', m: '栄養' }], field: '医学' }],
  ['protein', '名', 'pre1', 'タンパク質', 'Meat is rich in protein.', '肉はタンパク質が豊富だ。', 'ギリシャ proteios(第一の)。', { field: '医学' }],
  ['hormone', '名', 'pre1', 'ホルモン', 'Hormones control growth.', 'ホルモンは成長を制御する。', 'ギリシャ horman(刺激する)。', { field: '医学' }],
  ['tissue', '名', 'pre1', '(生体)組織・ティッシュ', 'Muscle is a kind of tissue.', '筋肉は組織の一種だ。', '古フランス tissu(織られた)。', { field: '医学' }],
  ['skeleton', '名', 'pre1', '骨格・骸骨', 'The skeleton supports the body.', '骨格は体を支える。', 'ギリシャ skeletos(干からびた)。', { syn: [{ w: 'frame', m: '骨組み' }], field: '医学' }],
  ['parasite', '名', '1', '寄生虫・寄生者', 'The worm is a parasite.', 'その虫は寄生虫だ。', 'ギリシャ para(傍ら)+sitos(食物)。', { field: '医学' }],
  ['embryo', '名', '1', '胚・胎児', 'The embryo develops slowly.', '胚はゆっくり発達する。', 'ギリシャ en(中)+bryein(膨らむ)。', { field: '医学' }],
  // 化学・物理
  ['compound', '名', '1', '化合物・複合の(形)', 'Water is a compound.', '水は化合物だ。', 'ラテン com+ponere(置く)→ pos と同源。', { syn: [{ w: 'mixture', m: '混合物' }], ant: [{ w: 'element', m: '元素' }], field: '科学' }],
  ['acid', '名', 'pre1', '酸・酸性の(形)', 'Lemon juice is an acid.', 'レモン汁は酸だ。', 'ラテン acidus(酸っぱい)→ acute と同系。', { ant: [{ w: 'alkali', m: 'アルカリ' }], field: '科学' }],
  ['liquid', '名', '2', '液体・液体の(形)', 'Water is a liquid.', '水は液体だ。', 'ラテン liquidus(流れる)。', { syn: [{ w: 'fluid', m: '流体' }], ant: [{ w: 'solid', m: '固体' }], field: '科学' }],
  ['solid', '名', '2', '固体・固体の(形)・しっかりした', 'Ice is a solid.', '氷は固体だ。', 'ラテン solidus(堅い)→ solid と同源。', { ant: [{ w: 'liquid', m: '液体' }, { w: 'hollow', m: '中空の' }], field: '科学' }],
  ['momentum', '名', '1', '勢い・運動量', 'The team gained momentum.', 'チームは勢いを得た。', 'ラテン movere(動く)→ move と同源。', { syn: [{ w: 'drive', m: '推進力' }, { w: 'impetus', m: '推進力' }], field: '科学' }],
  ['voltage', '名', '1', '電圧', 'High voltage is dangerous.', '高電圧は危険だ。', '物理学者ボルタ(Volta)の名から。', { field: '科学' }],
  ['conductor', '名', 'pre1', '導体・指揮者・車掌', 'Copper is a good conductor.', '銅はよい導体だ。', 'ラテン com+ducere(導く)→ duct と同源。', { ant: [{ w: 'insulator', m: '絶縁体' }], field: '科学' }],
  ['catalyst', '名', '1', '触媒・促進要因', 'The event was a catalyst for change.', 'その出来事は変化の促進剤だった。', 'ギリシャ kata+lyein(解く)。', { syn: [{ w: 'trigger', m: '引き金' }], field: '科学' }],
  // 地理
  ['latitude', '名', '1', '緯度', 'Tokyo lies at 35 degrees latitude.', '東京は緯度35度にある。', 'ラテン latus(広い)。', { ant: [{ w: 'longitude', m: '経度' }], field: '地理' }],
  ['equator', '名', 'pre1', '赤道', 'It is hot near the equator.', '赤道付近は暑い。', 'ラテン aequare(等しくする)→ equal と同系。', { field: '地理' }],
  ['hemisphere', '名', '1', '半球', 'Japan is in the northern hemisphere.', '日本は北半球にある。', 'ギリシャ hemi(半)+sphaira(球)→ sphere と同系。', { field: '地理' }],
  ['tropical', '形', 'pre2', '熱帯の', 'They visited a tropical island.', '彼らは熱帯の島を訪れた。', 'ギリシャ tropikos(回帰線の)。', { ant: [{ w: 'polar', m: '極地の' }], field: '地理' }],
  ['altitude', '名', '1', '高度・標高', 'The plane gained altitude.', '飛行機は高度を上げた。', 'ラテン altus(高い)→ altar と同系。', { syn: [{ w: 'height', m: '高さ' }, { w: 'elevation', m: '標高' }], field: '地理' }],
  ['basin', '名', '1', '盆地・流域・洗面器', 'The river basin is fertile.', 'その川の流域は肥沃だ。', '後期ラテン bacca(水入れ)。', { field: '地理' }],
  ['plateau', '名', '1', '高原・台地・横ばい', 'They camped on a high plateau.', '彼らは高い台地で野営した。', 'フランス plat(平らな)→ plate と同系。', { syn: [{ w: 'highland', m: '高地' }], field: '地理' }],
  ['erosion', '名', '1', '浸食・侵食', 'Erosion wore away the cliff.', '浸食が崖を削った。', 'ラテン e+rodere(かじる)→ rodent と同系。', { field: '地理' }],
  // 抽象名詞
  ['prospect', '名', 'pre1', '見込み・展望', 'The prospects look bright.', '見通しは明るい。', 'ラテン pro+specere(前を見る)→ spect と同源。', { syn: [{ w: 'outlook', m: '見通し' }, { w: 'expectation', m: '予想' }], field: '一般' }],
  ['circumstance', '名', 'pre1', '状況・事情', 'Under the circumstances, we waited.', '状況を考え、私たちは待った。', 'ラテン circum(周り)+stare(立つ)→ circle と同系。', { syn: [{ w: 'situation', m: '状況' }, { w: 'condition', m: '事情' }], field: '一般' }],
  ['stance', '名', '1', '立場・姿勢', 'What is your stance on this?', 'これに対する立場は？', 'ラテン stare(立つ)→ stand と同系。', { syn: [{ w: 'position', m: '立場' }, { w: 'attitude', m: '態度' }], field: '一般' }],
  ['repercussion', '名', '1', '影響・反響', 'The decision had repercussions.', 'その決定は影響を及ぼした。', 'ラテン re+percutere(打ち返す)。', { syn: [{ w: 'consequence', m: '影響' }, { w: 'effect', m: '余波' }], field: '一般' }],
  // 程度・増減の動詞
  ['amplify', '動', '1', '増幅する・拡大する', 'The mic amplifies the sound.', 'マイクは音を増幅する。', 'ラテン amplus(広い)+facere(する)。', { syn: [{ w: 'magnify', m: '拡大する' }, { w: 'intensify', m: '強める' }], ant: [{ w: 'reduce', m: '減らす' }], field: '動作・行為' }],
  ['augment', '動', '1', '増やす・増大させる', 'They augmented their income.', '彼らは収入を増やした。', 'ラテン augere(増やす)→ author と同系。', { syn: [{ w: 'increase', m: '増やす' }, { w: 'boost', m: '高める' }], ant: [{ w: 'diminish', m: '減らす' }], field: '動作・行為' }],
  ['curb', '動', '1', '抑制する・抑える', 'They tried to curb spending.', '彼らは支出を抑えようとした。', '古フランス courbe(曲がった)→馬の手綱。', { syn: [{ w: 'restrain', m: '抑える' }, { w: 'limit', m: '制限する' }], ant: [{ w: 'encourage', m: '促す' }], field: '動作・行為' }],
  ['escalate', '動', '1', '段階的に拡大する・激化する', 'The conflict escalated.', '紛争は激化した。', 'escalator(エスカレーター)から逆生成。', { syn: [{ w: 'intensify', m: '激化する' }], ant: [{ w: 'de-escalate', m: '緩和する' }], field: '動作・行為' }],
  ['magnify', '動', 'pre1', '拡大する・誇張する', 'A lens magnifies objects.', 'レンズは物を拡大する。', 'ラテン magnus(大きい)+facere(する)。', { syn: [{ w: 'enlarge', m: '拡大する' }], ant: [{ w: 'reduce', m: '縮小する' }], field: '動作・行為' }],
  ['multiply', '動', '3', '増やす・掛ける・繁殖する', 'Bacteria multiply quickly.', '細菌はすぐに増える。', 'ラテン multus(多い)+plicare(折る)。', { syn: [{ w: 'increase', m: '増やす' }], ant: [{ w: 'divide', m: '割る' }], field: '測定' }],
  ['proliferate', '動', '1', '急増する・拡散する', 'Smartphones have proliferated.', 'スマホは急増した。', 'ラテン proles(子孫)+ferre(生む)。', { syn: [{ w: 'multiply', m: '増殖する' }, { w: 'spread', m: '広がる' }], field: '動作・行為' }],
  ['soar', '動', 'pre1', '急上昇する・舞い上がる', 'Prices soared last year.', '昨年、物価が急騰した。', '古フランス essorer(風にさらす)。', { syn: [{ w: 'rise', m: '上がる' }, { w: 'surge', m: '急増する' }], ant: [{ w: 'plummet', m: '急落する' }], field: '動作・行為' }],
  ['surge', '動', '1', '急増する・押し寄せる・急増(名)', 'Demand surged in summer.', '需要は夏に急増した。', 'ラテン surgere(立ち上がる)。', { syn: [{ w: 'soar', m: '急上昇する' }], ant: [{ w: 'plunge', m: '急落する' }], field: '動作・行為' }],
  ['plummet', '動', '1', '急落する・真っ逆さまに落ちる', 'Stock prices plummeted.', '株価が急落した。', 'ラテン plumbum(鉛)→おもり。', { syn: [{ w: 'plunge', m: '急落する' }, { w: 'drop', m: '落ちる' }], ant: [{ w: 'soar', m: '急騰する' }], field: '動作・行為' }],
  ['fluctuate', '動', '1', '変動する・上下する', 'Prices fluctuate daily.', '価格は日々変動する。', 'ラテン fluctus(波)→ flow と同系。', { syn: [], field: '動作・行為' }],
  ['stabilize', '動', '1', '安定させる', 'The economy began to stabilize.', '経済は安定し始めた。', 'ラテン stabilis(安定した)→ stable と同源。', { ant: [{ w: 'destabilize', m: '不安定にする' }], field: '動作・行為' }],
  // 程度の形容詞
  ['vital', '形', 'pre1', '極めて重要な・生命の', 'Water is vital for life.', '水は生命に不可欠だ。', 'ラテン vita(命)→ vivid と同系。', { syn: [{ w: 'essential', m: '不可欠な' }, { w: 'crucial', m: '極めて重要な' }], ant: [{ w: 'trivial', m: 'ささいな' }], field: '性質・状態' }],
  ['substantial', '形', 'pre1', 'かなりの・実質的な', 'They made substantial progress.', '彼らはかなりの進歩をとげた。', 'ラテン substantia(実体)→ substance と同系。', { syn: [{ w: 'considerable', m: 'かなりの' }, { w: 'significant', m: '相当な' }], ant: [{ w: 'minor', m: 'わずかな' }], field: '性質・状態' }],
  ['marginal', '形', '1', 'わずかな・周辺の', 'There was only a marginal change.', 'わずかな変化しかなかった。', 'ラテン margo(縁)→ margin と同源。', { syn: [{ w: 'slight', m: 'わずかな' }], ant: [{ w: 'central', m: '中心的な' }], field: '性質・状態' }],
  ['negligible', '形', '1', '取るに足らない・無視できる', 'The risk is negligible.', 'その危険は無視できるほど小さい。', 'ラテン neglegere(無視する)→ neglect と同系。', { syn: [{ w: 'insignificant', m: '取るに足りない' }], ant: [{ w: 'significant', m: '重要な' }], field: '性質・状態' }],
  ['harsh', '形', 'pre1', '厳しい・過酷な・耳障りな', 'The winter was harsh.', '冬は厳しかった。', '中低ドイツ語 harsch(粗い)。', { syn: [{ w: 'severe', m: '過酷な' }, { w: 'cruel', m: '残酷な' }], ant: [{ w: 'gentle', m: '穏やかな' }], field: '性質・状態' }],
  ['moderate', '形', 'pre1', '適度な・穏健な', 'He drinks in moderate amounts.', '彼は適量を飲む。', 'ラテン modus(尺度)→ mode と同系。', { syn: [{ w: 'mild', m: '穏やかな' }], ant: [{ w: 'extreme', m: '極端な' }], field: '性質・状態' }],
]

export const WORDS_MORE27 = RAW.map(expandCompact)
