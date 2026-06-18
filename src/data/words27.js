// 単語データ（継続 / 6000語へ）— 環境/性格(感情)/学術名詞/上級動詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 環境
  ['sustainable', '形', 'pre1', '持続可能な', 'We need sustainable energy.', '私たちは持続可能なエネルギーが必要だ。', 'sustain(持続させる)+ -able。', { field: '環境' }],
  ['renewable', '形', 'pre1', '再生可能な', 'Solar power is renewable.', '太陽光は再生可能だ。', 'renew(再生する)+ -able。', { ant: [{ w: 'nonrenewable', m: '再生不能の' }], field: '環境' }],
  ['biodiversity', '名', '1', '生物多様性', 'Forests support biodiversity.', '森は生物多様性を支える。', 'bio(生命)+diversity(多様性)。', { field: '環境' }],
  ['greenhouse', '名', 'pre1', '温室', 'Greenhouse gases warm the earth.', '温室効果ガスは地球を暖める。', 'green(緑)+house(家)。', { field: '環境' }],
  ['wildlife', '名', 'pre1', '野生生物', 'They protect local wildlife.', '彼らは地域の野生生物を守る。', 'wild(野生)+life(生物)。', { syn: [{ w: 'fauna', m: '動物相' }], field: '環境' }],
  ['endangered', '形', 'pre1', '絶滅の危機にある', 'The panda is an endangered species.', 'パンダは絶滅危惧種だ。', 'en(〜にする)+danger(危険)+ -ed。', { ant: [{ w: 'thriving', m: '繁栄している' }], field: '環境' }],
  ['contamination', '名', '1', '汚染・混入', 'They tested for contamination.', '彼らは汚染を検査した。', 'ラテン com+tangere(触れる)→ contact と同系。', { syn: [{ w: 'pollution', m: '汚染' }], field: '環境' }],
  ['deforestation', '名', '1', '森林破壊', 'Deforestation harms the climate.', '森林破壊は気候に害を与える。', 'de(除去)+forest(森)+ -ation。', { field: '環境' }],
  ['solar', '形', 'pre1', '太陽の', 'They installed solar panels.', '彼らは太陽光パネルを設置した。', 'ラテン sol(太陽)。', { ant: [{ w: 'lunar', m: '月の' }], field: '環境' }],
  // 性格・感情
  ['arrogant', '形', 'pre1', '傲慢な・横柄な', 'His arrogant tone annoyed us.', '彼の傲慢な口調は私たちを苛立たせた。', 'ラテン ad+rogare(要求する)。', { syn: [{ w: 'proud', m: '高慢な' }], ant: [{ w: 'humble', m: '謙虚な' }], field: '心理' }],
  ['greedy', '形', 'pre1', '欲深い・貪欲な', "Don't be greedy.", '欲ばらないで。', '古英語 grǣdig「貪欲な」。', { syn: [{ w: 'selfish', m: '利己的な' }], ant: [{ w: 'generous', m: '寛大な' }], field: '心理' }],
  ['selfish', '形', '2', '利己的な・わがままな', 'It was a selfish decision.', 'それは身勝手な決断だった。', 'self(自己)+ -ish。', { ant: [{ w: 'generous', m: '寛大な' }, { w: 'selfless', m: '無私の' }], field: '心理' }],
  ['cheerful', '形', '3', '明るい・陽気な', 'She has a cheerful smile.', '彼女は明るい笑顔だ。', 'cheer(元気づける)+ -ful。', { syn: [{ w: 'merry', m: '陽気な' }, { w: 'lively', m: '活発な' }], ant: [{ w: 'gloomy', m: '陰気な' }], field: '心理' }],
  ['miserable', '形', 'pre1', 'みじめな・悲惨な', 'He felt miserable and alone.', '彼はみじめで孤独だった。', 'ラテン miser(哀れな)→ misery と同源。', { syn: [{ w: 'unhappy', m: '不幸な' }, { w: 'wretched', m: '惨めな' }], ant: [{ w: 'happy', m: '幸せな' }], field: '心理' }],
  ['envious', '形', 'pre1', 'うらやんで・ねたんで', 'He was envious of her talent.', '彼は彼女の才能をうらやんだ。', 'ラテン invidia(ねたみ)→ envy と同源。', { syn: [{ w: 'jealous', m: '嫉妬深い' }], field: '心理' }],
  ['sympathetic', '形', 'pre1', '同情的な・共感する', 'She gave me a sympathetic look.', '彼女は同情の目を向けた。', 'ギリシャ syn+pathos(共に感じる)→ pathetic と同系。', { syn: [{ w: 'understanding', m: '理解のある' }], ant: [{ w: 'indifferent', m: '無関心な' }], field: '心理' }],
  ['reckless', '形', 'pre1', '無謀な・向こう見ずな', 'Reckless driving is dangerous.', '無謀な運転は危険だ。', 'reck(気にする)+ -less。', { syn: [{ w: 'careless', m: '不注意な' }], ant: [{ w: 'cautious', m: '慎重な' }], field: '心理' }],
  ['timid', '形', 'pre1', '臆病な・気の小さい', 'The timid boy said nothing.', 'その臆病な少年は何も言わなかった。', 'ラテン timere(恐れる)。', { syn: [{ w: 'shy', m: '内気な' }], ant: [{ w: 'bold', m: '大胆な' }], field: '心理' }],
  ['confident', '形', '2', '自信のある・確信して', 'She felt confident before the test.', '彼女は試験前に自信を感じた。', 'ラテン com+fidere(信じる)→ faith と同系。', { syn: [{ w: 'assured', m: '自信のある' }], ant: [{ w: 'insecure', m: '不安な' }], field: '心理' }],
  ['passionate', '形', 'pre1', '情熱的な', 'He is passionate about music.', '彼は音楽に情熱的だ。', 'ラテン pati(苦しむ・感じる)→ passion と同源。', { syn: [{ w: 'enthusiastic', m: '熱心な' }], ant: [{ w: 'indifferent', m: '無関心な' }], field: '心理' }],
  ['cowardly', '形', 'pre1', '臆病な・卑怯な', 'It was a cowardly act.', 'それは卑怯な行為だった。', '古フランス coart(尻尾を巻く)→ tail と関連。', { syn: [{ w: 'timid', m: '臆病な' }], ant: [{ w: 'brave', m: '勇敢な' }], field: '心理' }],
  // 学術名詞
  ['criterion', '名', '1', '基準・尺度', 'Cost is the main criterion.', '費用が主な基準だ。', 'ギリシャ kriterion(判断基準)→ critic と同系。', { syn: [{ w: 'standard', m: '基準' }, { w: 'measure', m: '尺度' }], field: '科学' }],
  ['variable', '名', '1', '変数・変わりやすい(形)', 'There are many variables.', '多くの変数がある。', 'ラテン variare(変える)→ vary と同源。', { ant: [{ w: 'constant', m: '定数' }], field: '科学' }],
  ['spectrum', '名', '1', 'スペクトル・範囲', 'Opinions cover a wide spectrum.', '意見は幅広い範囲にわたる。', 'ラテン spectrum(像)→ spect と同源。', { syn: [{ w: 'range', m: '範囲' }], field: '科学' }],
  ['entity', '名', '1', '実体・存在物', 'A company is a legal entity.', '会社は法的存在だ。', 'ラテン esse(存在する)→ essence と同系。', { syn: [{ w: 'being', m: '存在' }, { w: 'unit', m: '単位' }], field: '科学' }],
  ['ideology', '名', '1', 'イデオロギー・思想', 'They share a political ideology.', '彼らは政治思想を共有する。', 'idea(観念)+logy(学)。', { field: '政治' }],
  ['norm', '名', '1', '規範・基準', 'It goes against social norms.', 'それは社会規範に反する。', 'ラテン norma(物差し)→ normal と同源。', { syn: [{ w: 'standard', m: '基準' }, { w: 'rule', m: '規則' }], field: '社会' }],
  // 上級動詞
  ['deduce', '動', '1', '推論する・演繹する', 'We can deduce the answer.', '私たちは答えを推論できる。', 'ラテン de+ducere(導く)→ duct と同源。', { syn: [{ w: 'infer', m: '推論する' }, { w: 'conclude', m: '結論づける' }], field: '動作・行為' }],
  ['deplete', '動', '1', '激減させる・枯渇させる', 'We are depleting natural resources.', '私たちは天然資源を枯渇させている。', 'ラテン de+plere(満たす)→の逆。', { syn: [{ w: 'exhaust', m: '使い果たす' }], ant: [{ w: 'replenish', m: '補充する' }], field: '動作・行為' }],
  ['discard', '動', 'pre1', '捨てる・処分する', 'Discard the old batteries.', '古い電池を捨てて。', 'dis(離れて)+card(カードを捨てる)。', { syn: [{ w: 'throw away', m: '捨てる' }, { w: 'dispose of', m: '処分する' }], ant: [{ w: 'keep', m: '取っておく' }], field: '動作・行為' }],
  ['disperse', '動', '1', '分散させる・散る', 'The crowd dispersed quickly.', '群衆はすぐに散った。', 'ラテン dis+spargere(まく)。', { syn: [{ w: 'scatter', m: '散らす' }], ant: [{ w: 'gather', m: '集める' }], field: '動作・行為' }],
  ['hamper', '動', '1', '妨げる・邪魔する', 'Rain hampered the rescue.', '雨が救助を妨げた。', '中英語 hamper(かごに入れる)。', { syn: [{ w: 'hinder', m: '妨げる' }, { w: 'impede', m: '妨害する' }], ant: [{ w: 'help', m: '助ける' }], field: '動作・行為' }],
  ['impair', '動', '1', '損なう・弱める', 'Lack of sleep impairs judgment.', '睡眠不足は判断力を損なう。', 'ラテン pejor(より悪い)。', { syn: [{ w: 'damage', m: '損なう' }, { w: 'weaken', m: '弱める' }], ant: [{ w: 'improve', m: '改善する' }], field: '動作・行為' }],
  ['incur', '動', '1', '(損失などを)招く・負う', 'They incurred heavy debts.', '彼らは多額の借金を負った。', 'ラテン in+currere(走る)→ current と同系。', { syn: [{ w: 'suffer', m: '被る' }], field: '経済' }],
  ['intensify', '動', '1', '強める・激化する', 'The storm intensified at night.', '嵐は夜に激しくなった。', 'intense(激しい)+ -ify→ tend と同系。', { syn: [{ w: 'strengthen', m: '強める' }, { w: 'increase', m: '増す' }], ant: [], field: '動作・行為' }],
  ['nurture', '動', '1', '育てる・育む', 'Good teachers nurture talent.', '良い教師は才能を育む。', 'ラテン nutrire(養う)→ nutrition と同系。', { syn: [{ w: 'foster', m: '育てる' }, { w: 'cultivate', m: '育成する' }], ant: [{ w: 'neglect', m: '怠る' }], field: '動作・行為' }],
  ['precede', '動', '1', '先行する・〜に先立つ', 'A short talk preceded the meal.', '短い講話が食事に先立った。', 'ラテン prae+cedere(行く)→ cess と同源。', { ant: [{ w: 'follow', m: '続く' }], field: '動作・行為' }],
  ['presume', '動', '1', '推定する・仮定する', 'I presume you agree.', '君は賛成だと思う。', 'ラテン prae+sumere(取る)→ assume と同系。', { syn: [{ w: 'assume', m: '仮定する' }, { w: 'suppose', m: '思う' }], field: '動作・行為' }],
  ['surpass', '動', '1', '上回る・しのぐ', 'Sales surpassed expectations.', '売上は予想を上回った。', 'フランス sur(超えて)+passer(過ぎる)→ pass と同系。', { syn: [{ w: 'exceed', m: '超える' }, { w: 'outdo', m: 'しのぐ' }], field: '動作・行為' }],
  ['trigger', '動', 'pre1', '引き起こす・引き金(名)', 'The news triggered panic.', 'その知らせは恐慌を引き起こした。', 'オランダ trekker(引くもの)。', { syn: [{ w: 'cause', m: '引き起こす' }, { w: 'set off', m: '誘発する' }], field: '動作・行為' }],
  ['withstand', '動', '1', '耐える・持ちこたえる', 'The bridge can withstand storms.', 'その橋は嵐に耐えられる。', 'with(逆らって)+stand(立つ)。', { syn: [{ w: 'endure', m: '耐える' }, { w: 'resist', m: '抵抗する' }], field: '動作・行為' }],
  ['uphold', '動', '1', '支持する・維持する', 'The court upheld the decision.', '裁判所はその判決を支持した。', 'up(上に)+hold(保つ)。', { syn: [{ w: 'support', m: '支持する' }, { w: 'maintain', m: '維持する' }], ant: [{ w: 'overturn', m: '覆す' }], field: '法律' }],
]

export const WORDS_MORE26 = RAW.map(expandCompact)
