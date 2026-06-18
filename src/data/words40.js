// 単語データ（継続 / 6000語へ）— 語族つき動詞/抽象名詞/上級形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 動詞（語族つき）
  ['alienate', '動', '1', '疎遠にする・遠ざける', 'His rudeness alienated friends.', '彼の無礼は友人を遠ざけた。', 'ラテン alienus(他人の)→ alien と同系。', { syn: [{ w: 'estrange', m: '仲たがいさせる' }], ant: [{ w: 'unite', m: '結びつける' }], fam: [{ w: 'alienation', m: '疎外' }, { w: 'alien', m: '異質な・宇宙人' }], field: '心理' }],
  ['assimilate', '動', '1', '同化する・吸収する', 'Immigrants assimilate over time.', '移民は時とともに同化する。', 'ラテン ad+similis(似た)→ similar と同系。', { syn: [{ w: 'absorb', m: '吸収する' }, { w: 'integrate', m: '溶け込む' }], fam: [{ w: 'assimilation', m: '同化' }], field: '社会' }],
  ['commemorate', '動', '1', '記念する・追悼する', 'They commemorated the victory.', '彼らはその勝利を記念した。', 'ラテン com+memorare(思い出させる)→ memory と同系。', { syn: [{ w: 'celebrate', m: '祝う' }, { w: 'honor', m: 'たたえる' }], fam: [{ w: 'commemoration', m: '記念' }, { w: 'commemorative', m: '記念の' }], field: '社会' }],
  ['condense', '動', '1', '凝縮する・要約する', 'Steam condenses into water.', '蒸気は凝結して水になる。', 'ラテン com+densus(濃い)→ dense と同系。', { syn: [{ w: 'compress', m: '圧縮する' }], ant: [{ w: 'expand', m: '膨張させる' }], fam: [{ w: 'condensation', m: '凝結' }], field: '科学' }],
  ['dilute', '動', '1', '薄める・希釈する', 'Dilute the juice with water.', 'ジュースを水で薄めて。', 'ラテン di+luere(洗う)。', { syn: [{ w: 'water down', m: '薄める' }, { w: 'weaken', m: '弱める' }], ant: [{ w: 'concentrate', m: '濃縮する' }], fam: [{ w: 'dilution', m: '希釈' }], field: '科学' }],
  ['disseminate', '動', '1', '広める・流布する', 'They disseminate information online.', '彼らは情報をネットで広める。', 'ラテン dis+seminare(種をまく)→ seminar と同系。', { syn: [{ w: 'spread', m: '広める' }, { w: 'distribute', m: '配布する' }], fam: [{ w: 'dissemination', m: '普及' }], field: 'メディア' }],
  ['enumerate', '動', '1', '列挙する・数え上げる', 'He enumerated the reasons.', '彼は理由を列挙した。', 'ラテン e+numerare(数える)→ number と同系。', { syn: [{ w: 'list', m: '列挙する' }, { w: 'itemize', m: '項目化する' }], fam: [{ w: 'enumeration', m: '列挙' }], field: '動作・行為' }],
  ['evaporate', '動', 'pre1', '蒸発する・消え去る', 'Water evaporates in the heat.', '水は熱で蒸発する。', 'ラテン e+vapor(蒸気)。', { syn: [{ w: 'vaporize', m: '気化する' }], ant: [{ w: 'condense', m: '凝結する' }], fam: [{ w: 'evaporation', m: '蒸発' }], field: '科学' }],
  ['exemplify', '動', '1', '例証する・典型である', 'She exemplifies hard work.', '彼女は勤勉の手本だ。', 'ラテン exemplum(手本)→ example と同系。', { syn: [{ w: 'illustrate', m: '例示する' }, { w: 'embody', m: '体現する' }], fam: [{ w: 'exemplary', m: '模範的な' }, { w: 'example', m: '例' }], field: '動作・行為' }],
  ['expedite', '動', '1', '迅速に進める・促進する', 'We must expedite the process.', '手続きを迅速化せねば。', 'ラテン ex+pes(足)→足かせを外す。', { syn: [{ w: 'hasten', m: '急がせる' }, { w: 'accelerate', m: '加速する' }], ant: [{ w: 'delay', m: '遅らせる' }], fam: [{ w: 'expedition', m: '探検・遠征' }], field: '動作・行為' }],
  ['inundate', '動', '1', '殺到する・水浸しにする', 'They were inundated with requests.', '彼らは依頼で手いっぱいだった。', 'ラテン in+unda(波)。', { syn: [{ w: 'flood', m: '殺到する' }, { w: 'overwhelm', m: '圧倒する' }], fam: [{ w: 'inundation', m: '氾濫' }], field: '動作・行為' }],
  ['obliterate', '動', '1', '完全に消し去る・抹消する', 'The flood obliterated the village.', '洪水は村を跡形もなく消した。', 'ラテン ob+littera(文字)→文字を消す。', { syn: [{ w: 'destroy', m: '破壊する' }, { w: 'erase', m: '消去する' }], fam: [{ w: 'obliteration', m: '抹消' }], field: '動作・行為' }],
  ['reiterate', '動', '1', '繰り返し言う・反復する', 'She reiterated her point.', '彼女は要点を繰り返した。', 'ラテン re+iterare(繰り返す)。', { syn: [{ w: 'repeat', m: '繰り返す' }, { w: 'restate', m: '言い直す' }], fam: [{ w: 'reiteration', m: '反復' }], field: '動作・行為' }],
  ['resonate', '動', '1', '反響する・共鳴する・心に響く', 'Her words resonated with us.', '彼女の言葉は私たちの心に響いた。', 'ラテン re+sonare(鳴る)→ sound と同系。', { syn: [{ w: 'echo', m: '反響する' }, { w: 'strike a chord', m: '共感を呼ぶ' }], fam: [{ w: 'resonance', m: '共鳴' }, { w: 'resonant', m: '響き渡る' }], field: '音楽' }],
  ['saturate', '動', '1', '飽和させる・浸す', 'Rain saturated the soil.', '雨が土壌をびしょぬれにした。', 'ラテン satur(満ちた)→ satisfy と同系。', { syn: [{ w: 'soak', m: '浸す' }, { w: 'drench', m: 'ずぶぬれにする' }], fam: [{ w: 'saturation', m: '飽和' }], field: '科学' }],
  ['recuperate', '動', '1', '回復する・取り戻す', 'He recuperated after surgery.', '彼は手術後に回復した。', 'ラテン re+capere(取る)→ cept と同系。', { syn: [{ w: 'recover', m: '回復する' }, { w: 'heal', m: '治る' }], fam: [{ w: 'recuperation', m: '回復' }], field: '医学' }],
  // 抽象名詞
  ['descent', '名', 'pre1', '下降・降下・家系', 'The plane began its descent.', '飛行機は降下を始めた。', 'ラテン de+scandere(登る)→下る。', { syn: [{ w: 'fall', m: '下降' }, { w: 'lineage', m: '家系' }], ant: [{ w: 'ascent', m: '上昇' }], field: '一般' }],
  ['fortitude', '名', '1', '不屈の精神・勇気', 'She bore the pain with fortitude.', '彼女は不屈の精神で痛みに耐えた。', 'ラテン fortis(強い)→ force と同系。', { syn: [{ w: 'courage', m: '勇気' }, { w: 'resilience', m: '忍耐力' }], ant: [{ w: 'cowardice', m: '臆病' }], field: '心理' }],
  ['gratitude', '名', 'pre1', '感謝(の念)', 'He expressed his gratitude.', '彼は感謝の意を表した。', 'ラテン gratus(感謝する)→ grateful と同系。', { syn: [{ w: 'thankfulness', m: '感謝' }, { w: 'appreciation', m: '謝意' }], ant: [{ w: 'ingratitude', m: '恩知らず' }], field: '心理' }],
  ['ingenuity', '名', '1', '創意工夫・才知', 'They solved it with ingenuity.', '彼らは創意工夫で解決した。', 'ラテン ingenium(才能)→ engine と同系。', { syn: [{ w: 'creativity', m: '創造性' }, { w: 'inventiveness', m: '発明の才' }], fam: [{ w: 'ingenious', m: '巧妙な' }], field: '心理' }],
  ['longevity', '名', '1', '長寿・長持ち', 'a secret to longevity', '長寿の秘訣', 'ラテン longus(長い)+aevum(年齢)。', { syn: [{ w: 'long life', m: '長命' }], ant: [{ w: 'mortality', m: '死亡' }], field: '医学' }],
  ['nostalgia', '名', '1', '郷愁・懐かしさ', 'The song filled me with nostalgia.', 'その歌は私を郷愁で満たした。', 'ギリシャ nostos(帰郷)+algos(痛み)。', { syn: [{ w: 'longing', m: '思慕' }, { w: 'reminiscence', m: '追憶' }], fam: [{ w: 'nostalgic', m: '懐かしい' }], field: '心理' }],
  ['solitude', '名', '1', '孤独・ひとりでいること', 'She enjoys solitude.', '彼女は孤独を楽しむ。', 'ラテン solus(ひとりの)→ sole と同系。', { syn: [{ w: 'isolation', m: '孤立' }, { w: 'seclusion', m: '隠遁' }], ant: [{ w: 'company', m: '同伴' }], field: '心理' }],
  ['rationale', '名', '1', '論理的根拠・理由づけ', 'What is the rationale behind it?', 'その背後の根拠は何か？', 'ラテン ratio(理性)→ rational と同系。', { syn: [{ w: 'reasoning', m: '理由づけ' }, { w: 'justification', m: '正当化' }], field: '一般' }],
  ['serenity', '名', '1', '静けさ・平静', 'a place of great serenity', 'とても穏やかな場所', 'ラテン serenus(澄んだ)→ serene と同系。', { syn: [{ w: 'calm', m: '平穏' }], ant: [{ w: 'turmoil', m: '混乱' }], field: '心理' }],
  // 上級形容詞
  ['adept', '形', '1', '熟達した・上手な', 'She is adept at painting.', '彼女は絵が上手だ。', 'ラテン adeptus(達成した)。', { syn: [{ w: 'skilled', m: '熟練した' }, { w: 'proficient', m: '堪能な' }], ant: [{ w: 'inept', m: '不器用な' }], field: '性質・状態' }],
  ['benign', '形', '1', '良性の・優しい', 'The tumor was benign.', 'その腫瘍は良性だった。', 'ラテン benignus(親切な)→ bene(よく)。', { syn: [{ w: 'harmless', m: '無害な' }, { w: 'kind', m: '優しい' }], ant: [{ w: 'malignant', m: '悪性の' }], field: '医学' }],
  ['malignant', '形', '1', '悪性の・悪意のある', 'a malignant tumor', '悪性腫瘍', 'ラテン malignus(悪い性質の)→ malice と同系。', { syn: [{ w: 'harmful', m: '有害な' }, { w: 'cancerous', m: 'がん性の' }], ant: [{ w: 'benign', m: '良性の' }], field: '医学' }],
  ['copious', '形', '1', '大量の・豊富な', 'She took copious notes.', '彼女は大量のメモを取った。', 'ラテン copia(豊富)→ copy と同系。', { syn: [{ w: 'abundant', m: '豊富な' }, { w: 'plentiful', m: 'たくさんの' }], ant: [{ w: 'scarce', m: '乏しい' }], field: '性質・状態' }],
  ['dire', '形', '1', '悲惨な・差し迫った', 'They are in dire need of help.', '彼らは助けを切実に必要としている。', 'ラテン dirus(恐ろしい)。', { syn: [{ w: 'desperate', m: '絶望的な' }, { w: 'grave', m: '重大な' }], field: '性質・状態' }],
  ['elusive', '形', '1', 'とらえどころのない・つかみにくい', 'Success proved elusive.', '成功はなかなか手に入らなかった。', 'ラテン e+ludere(遊ぶ)→ illusion と同系。', { syn: [{ w: 'evasive', m: '逃げ口上の' }, { w: 'hard to grasp', m: '把握しにくい' }], fam: [{ w: 'elude', m: 'うまく逃れる' }], field: '性質・状態' }],
  ['erratic', '形', '1', '不規則な・気まぐれな', 'His behavior is erratic.', '彼の行動は気まぐれだ。', 'ラテン errare(さまよう)→ error と同系。', { syn: [{ w: 'irregular', m: '不規則な' }, { w: 'unpredictable', m: '予測不能な' }], ant: [{ w: 'steady', m: '安定した' }], field: '性質・状態' }],
  ['frugal', '形', '1', '質素な・倹約な', 'They lead a frugal life.', '彼らは質素な生活を送る。', 'ラテン frugalis(つましい)。', { syn: [{ w: 'thrifty', m: '倹約な' }, { w: 'economical', m: '節約的な' }], ant: [{ w: 'extravagant', m: '浪費する' }], field: '性質・状態' }],
  ['futile', '形', '1', '無駄な・無益な', 'Their efforts were futile.', '彼らの努力は無駄だった。', 'ラテン futilis(漏れやすい)。', { syn: [{ w: 'useless', m: '役に立たない' }, { w: 'pointless', m: '無意味な' }], ant: [{ w: 'fruitful', m: '実りある' }], fam: [{ w: 'futility', m: '無益' }], field: '性質・状態' }],
  ['innate', '形', '1', '生まれつきの・先天的な', 'She has an innate talent.', '彼女には生まれつきの才能がある。', 'ラテン in+nasci(生まれる)→ nature と同系。', { syn: [{ w: 'inborn', m: '生来の' }, { w: 'natural', m: '天性の' }], ant: [{ w: 'acquired', m: '後天的な' }], field: '性質・状態' }],
  ['lavish', '形', '1', '豪華な・気前のよい', 'a lavish party', '豪華なパーティー', '古フランス lavasse(豪雨)。', { syn: [{ w: 'extravagant', m: '贅沢な' }, { w: 'generous', m: '気前のよい' }], ant: [{ w: 'frugal', m: '質素な' }], field: '性質・状態' }],
  ['nimble', '形', '1', '機敏な・すばしこい', 'Her nimble fingers tied the knot.', '彼女は器用な指で結び目を作った。', '古英語 numol(つかみが速い)。', { syn: [{ w: 'agile', m: '敏捷な' }, { w: 'quick', m: '素早い' }], ant: [{ w: 'clumsy', m: '不器用な' }], field: '性質・状態' }],
  ['precarious', '形', '1', '不安定な・危うい', 'They were in a precarious position.', '彼らは危うい立場にいた。', 'ラテン precarius(懇願による)→ prayer と同系。', { syn: [{ w: 'unstable', m: '不安定な' }, { w: 'risky', m: '危険な' }], ant: [{ w: 'secure', m: '安定した' }], field: '性質・状態' }],
  ['prolific', '形', '1', '多作の・多産の', 'a prolific writer', '多作の作家', 'ラテン proles(子孫)+facere(作る)。', { syn: [{ w: 'fertile', m: '多産の' }], ant: [{ w: 'unproductive', m: '不毛な' }], field: '性質・状態' }],
  ['vibrant', '形', 'pre1', '活気のある・鮮やかな', 'a vibrant city', '活気あふれる都市', 'ラテン vibrare(震える)→ vibrate と同系。', { syn: [{ w: 'lively', m: '生き生きした' }, { w: 'vivid', m: '鮮やかな' }], ant: [{ w: 'dull', m: '活気のない' }], field: '性質・状態' }],
  ['voracious', '形', '1', '貪欲な・がつがつした', 'a voracious reader', '貪欲な読書家', 'ラテン vorare(むさぼる)→ devour と同系。', { syn: [{ w: 'greedy', m: '欲深い' }, { w: 'insatiable', m: '飽くなき' }], field: '性質・状態' }],
]

export const WORDS_MORE39 = RAW.map(expandCompact)
