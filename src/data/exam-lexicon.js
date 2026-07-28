// 高校の予習・大学入試・英検で扱う現代語／学術語の補充。
// 既存の見出し語 ID は一切変更せず、新しい見出し語だけを追加する。
// 各語に「よく使う形」を付け、単なる和訳一覧ではなく語法まで確認できるようにする。
import { expandCompact } from './compact.js'

// [word, pos, level, meaning, example.en, example.ja, etymology.note, field, usage, phonetic?]
const RAW_EXAM_WORDS = [
  // ── 論理・学術の基本語 ──
  ['concurrent', '形', 'pre1', '同時に起こる・併存する', 'The two projects have concurrent deadlines.', 'その2つの計画は締め切りが重なっている。', 'ラテン語 con-(共に)＋currere(走る)。「共に走る」から同時の意。', '一般', 'concurrent with ...「…と同時の」、concurrent events「同時発生する出来事」。'],
  ['define', '動', 'pre2', '定義する・明確にする', 'Please define the term in your own words.', 'その用語を自分の言葉で定義してください。', 'ラテン語 de-(完全に)＋finire(境界を定める)。意味の境界を決める。', '言語', 'define A as B「AをBと定義する」。名詞は definition。'],
  ['discrete', '形', 'pre1', '個別の・不連続の', 'The survey treats age as a discrete variable.', 'その調査は年齢を離散変数として扱う。', 'ラテン語 discernere(分ける)に由来し、「分離した」が原義。', '学問', 'discrete units「個別の単位」。discreet「慎重な」と綴り・意味を区別する。'],
  ['domestic', '形', '2', '国内の・家庭内の', 'Domestic demand remained strong this year.', '今年は国内需要が堅調だった。', 'ラテン語 domus(家)から。「家の内側」が家庭・国内へ広がった。', '社会', 'domestic market「国内市場」、domestic violence「家庭内暴力」。反対は foreign / international。'],
  ['incidence', '名', 'pre1', '発生率・発生', 'The incidence of the disease has declined.', 'その病気の発生率は低下した。', 'ラテン語 incidere(上に落ちる、起こる)から。', '医学', 'the incidence of ...「…の発生率」。個々の出来事 incident と区別する。'],
  ['maximize', '動', '2', '最大化する・最大限に生かす', 'The design maximizes the use of natural light.', 'その設計は自然光を最大限に活用する。', 'maximum(最大)＋-ize(〜化する)。', '一般', 'maximize efficiency / benefits「効率／利益を最大化する」。反対は minimize。'],
  ['minimize', '動', '2', '最小化する・軽視する', 'We must minimize the risk of injury.', 'けがの危険を最小限にしなければならない。', 'minimum(最小)＋-ize(〜化する)。', '一般', 'minimize risk / damage「危険／被害を最小限にする」。minimize the importance は「重要性を軽く扱う」。'],
  ['synthesize', '動', 'pre1', '統合する・合成する', 'Good essays synthesize ideas from several sources.', '良い論文は複数の資料の考えを統合する。', 'ギリシャ語 syn-(共に)＋tithenai(置く)。複数を一つに組み立てる。', '学問', 'synthesize A and B「AとBを統合する」。名詞は synthesis。'],
  ['underlie', '動', 'pre1', '〜の根底にある', 'Trust underlies every successful partnership.', '信頼はあらゆる成功する協力関係の根底にある。', 'under(下に)＋lie(横たわる)。表面の下で土台になる。', '一般', 'A underlies B「AがBの根底にある」。過去形は underlay、過去分詞は underlain。'],
  ['abstraction', '名', 'pre1', '抽象概念・抽象化', 'Justice is an abstraction until it is put into practice.', '正義は実践されるまでは抽象概念である。', 'ラテン語 ab-(離して)＋trahere(引く)。具体物から性質を引き出す。', '学問', 'a level of abstraction「抽象度」。形容詞 abstract と対にして覚える。'],
  ['acceleration', '名', '2', '加速・加速度', 'The acceleration of climate change concerns scientists.', '気候変動の加速を科学者は懸念している。', 'ラテン語 ad-(〜へ)＋celer(速い)から。', '科学', 'rapid acceleration「急速な加速」、acceleration due to gravity「重力加速度」。'],
  ['accreditation', '名', 'pre1', '認定・資格認証', 'The program received international accreditation.', 'その課程は国際的な認定を受けた。', 'ラテン語 ad-(〜へ)＋credere(信じる)。信用を公式に与える。', '教育', 'receive / gain accreditation「認定を受ける」。動詞は accredit。'],
  ['accumulation', '名', '2', '蓄積・集積', 'The accumulation of plastic waste harms marine life.', 'プラスチックごみの蓄積が海洋生物を害する。', 'ラテン語 ad-(〜へ)＋cumulus(積み重ね)から。', '環境', 'the accumulation of evidence / wealth「証拠／富の蓄積」。'],
  ['aggregate', '名', 'pre1', '総計・集合体', 'The figures are reported as an aggregate.', 'その数値は総計として報告される。', 'ラテン語 ad-(〜へ)＋grex(群れ)。群れに集めること。', '学問', 'in aggregate「総計で」。動詞「集計する」、形容詞「総計の」にもなる。'],
  ['annotation', '名', '2', '注釈・注記', 'Add a short annotation to each source.', '各資料に短い注釈を付けなさい。', 'ラテン語 ad-(〜へ)＋notare(印を付ける)。', '言語', 'annotate a text「文章に注釈を付ける」。note より分析的・説明的。'],
  ['asymmetric', '形', 'pre1', '非対称の・不均衡な', 'The two countries have an asymmetric relationship.', 'その2国は非対称な関係にある。', 'a-(〜でない)＋symmetric(対称の)。', '学問', 'asymmetric information「情報の非対称性」。反対は symmetric。'],
  ['baseline', '名', '2', '基準値・出発点', 'Researchers compared the results with the baseline.', '研究者は結果を基準値と比較した。', 'base(基礎)＋line(線)。比較の起点となる線。', '測定', 'establish a baseline「基準値を設定する」、baseline data「基準データ」。'],
  ['causation', '名', 'pre1', '因果関係・原因作用', 'Correlation does not necessarily prove causation.', '相関関係が必ずしも因果関係を証明するわけではない。', 'cause(原因)＋-ation(作用・状態)。', '学問', 'correlation and causation「相関と因果」。cause は原因、causation は因果の仕組み。'],
  ['comparatively', '副', '2', '比較的・比べてみると', 'The second method is comparatively simple.', '2番目の方法は比較的単純だ。', 'compare(比較する)から派生。', '様子・程度', 'comparatively small「比較的小さい」。relatively とほぼ同義だが、比較対象を意識しやすい。'],
  ['correspondingly', '副', 'pre1', 'それに応じて・同様に', 'Costs rose, and prices increased correspondingly.', '費用が上がり、それに応じて価格も上昇した。', 'correspond(対応する)＋-ingly。', '一般', 'A changes, and B changes correspondingly「Aが変わり、Bもそれに応じて変わる」。'],
  ['crucially', '副', '2', '決定的に・何より重要なことに', 'Crucially, the data came from independent sources.', '決定的に重要なのは、そのデータが独立した資料から得られたことだ。', 'crucial(極めて重要な)＋-ly。', '一般', '文頭の Crucially, ... は論述で「重要なことに」。very importantly より簡潔。'],
  ['relatively', '副', '2', '比較的・相対的に', 'The treatment is relatively inexpensive.', 'その治療は比較的安価だ。', 'relative(比較上の、相対的な)＋-ly。', '様子・程度', 'relatively easy / low「比較的容易な／低い」。何との比較かを文脈で明確にする。'],
  ['methodology', '名', 'pre1', '方法論・研究方法体系', 'The paper explains its methodology in detail.', 'その論文は研究方法を詳しく説明している。', 'ギリシャ語 methodos(方法)＋-logy(学問)。', '学問', 'research methodology「研究方法論」。個別の手順 method と、体系 methodology を区別する。'],
  ['parameter', '名', 'pre1', '変数・制約条件・媒介変数', 'We changed one parameter at a time.', '私たちは一度に一つのパラメーターだけを変えた。', 'ギリシャ語 para-(そばに)＋metron(測るもの)。', '測定', 'set / change a parameter「条件を設定／変更する」。複数形は parameters。'],
  ['proposition', '名', 'pre1', '命題・提案', 'The evidence supports the central proposition.', 'その証拠は中心的な命題を裏付ける。', 'ラテン語 pro-(前に)＋ponere(置く)。検討のため前に出すもの。', '学問', 'test a proposition「命題を検証する」。proposal より論理上の主張を表しやすい。'],
  ['quantitative', '形', 'pre1', '量的な・数量に基づく', 'The study combines quantitative and qualitative data.', 'その研究は量的データと質的データを組み合わせている。', 'quantity(量)＋-ative。', '学問', 'quantitative analysis / data「量的分析／データ」。qualitative と対にして覚える。'],
  ['qualitative', '形', 'pre1', '質的な・性質に基づく', 'Interviews provided qualitative evidence.', '聞き取り調査は質的な証拠をもたらした。', 'quality(性質)＋-ative。', '学問', 'qualitative research「質的研究」。数値中心の quantitative と対照。'],
  ['reliability', '名', '2', '信頼性・一貫性', 'We tested the reliability of the measurement.', '私たちはその測定の信頼性を検証した。', 'rely(頼る)＋-able＋-ity。頼ることができる性質。', '測定', 'high reliability「高い信頼性」。測定の一貫性を指し、validity「妥当性」と区別する。'],
  ['sensitivity', '名', '2', '感度・敏感さ・配慮', 'The sensor has high sensitivity to light.', 'そのセンサーは光に対する感度が高い。', 'sense(感じる)から派生。', '測定', 'sensitivity to ...「…への感度／配慮」。文脈により機器、人、社会問題の敏感さを表す。'],
  ['theorem', '名', 'pre1', '定理', 'The students applied the theorem to the problem.', '生徒たちはその問題に定理を適用した。', 'ギリシャ語 theorema(考察されたもの)から。', '数学', 'prove / apply a theorem「定理を証明する／適用する」。仮説 hypothesis と区別する。'],
  ['validity', '名', 'pre1', '妥当性・有効性', 'The researchers questioned the validity of the conclusion.', '研究者たちはその結論の妥当性に疑問を呈した。', 'valid(根拠のある、有効な)＋-ity。', '学問', 'the validity of an argument / test「議論／検査の妥当性」。reliability は再現性。'],

  // ── 情報・デジタル社会 ──
  ['misinformation', '名', '2', '誤情報', 'Misinformation can spread rapidly online.', '誤情報はオンラインで急速に広がり得る。', 'mis-(誤って)＋information(情報)。意図の有無を問わない誤った情報。', '情報', 'spread / correct misinformation「誤情報を広める／訂正する」。故意の disinformation と区別する。'],
  ['disinformation', '名', 'pre1', '偽情報・意図的な誤情報', 'The campaign was designed to counter disinformation.', 'その運動は偽情報に対抗するために計画された。', 'dis-(反対・否定)＋information。人を欺く目的で流す情報。', '情報', 'combat disinformation「偽情報と闘う」。単なる誤り misinformation より意図性が強い。'],
  ['dataset', '名', '2', 'データセット・一まとまりのデータ', 'The dataset contains ten years of weather records.', 'そのデータセットには10年分の気象記録が含まれる。', 'data(データ)＋set(一組)。', '情報', 'collect / analyze a dataset「データセットを収集／分析する」。英語では data set と2語表記もある。'],
  ['cybersecurity', '名', '2', 'サイバーセキュリティ・情報安全', 'Cybersecurity training helps prevent data theft.', '情報安全の研修はデータ窃取の防止に役立つ。', 'cyber-(コンピュータ空間の)＋security(安全)。', '技術', 'cybersecurity measures / threat「安全対策／脅威」。不可算名詞として使うのが普通。', '/ˌsaɪbərsɪˈkjʊrəti/'],
  ['configuration', '名', 'pre1', '構成・設定', 'Check the network configuration before restarting.', '再起動する前にネットワーク設定を確認しなさい。', 'ラテン語 con-(共に)＋figurare(形作る)。要素を一つの形に組む。', '技術', 'system configuration「システム構成」、configuration settings「構成設定」。'],
  ['connectivity', '名', '2', '接続性・つながり', 'Reliable connectivity is essential for remote learning.', '安定した接続性は遠隔学習に不可欠だ。', 'connect(つなぐ)＋-ivity(性質)。', '技術', 'internet / network connectivity「インターネット／ネットワーク接続性」。'],
  ['immersive', '形', 'pre1', '没入感のある・没入型の', 'The museum offers an immersive learning experience.', 'その博物館は没入型の学習体験を提供する。', 'immerse(浸す、没頭させる)＋-ive。', '技術', 'immersive experience / technology「没入型体験／技術」。人には immersed を使う。', '/ɪˈmɜːrsɪv/'],
  ['nanotechnology', '名', 'pre1', 'ナノテクノロジー・超微細技術', 'Nanotechnology may improve targeted drug delivery.', 'ナノ技術は標的型の薬物送達を改善する可能性がある。', 'nano-(10億分の1)＋technology(技術)。', '技術', 'applications of nanotechnology「ナノ技術の応用」。通常は不可算名詞。'],
  ['robotics', '名', '2', 'ロボット工学', 'She studies robotics and artificial intelligence.', '彼女はロボット工学と人工知能を学んでいる。', 'robot＋-ics(学問分野)。', '技術', 'a robotics laboratory「ロボット工学研究室」。学問名なので単数扱いが普通。'],
  ['wearable', '形', '2', '身に着けられる・ウェアラブルの', 'Wearable devices can monitor heart rate.', 'ウェアラブル機器は心拍数を測定できる。', 'wear(身に着ける)＋-able(可能な)。', '技術', 'wearable device / technology「装着型機器／技術」。名詞で a wearable ともいう。'],

  // ── 環境・持続可能性 ──
  ['biodegradable', '形', '2', '生分解性の', 'The company replaced plastic with biodegradable packaging.', 'その会社はプラスチックを生分解性包装に替えた。', 'bio-(生命)＋degrade(分解する)＋-able。生物の働きで分解できる。', '環境', 'biodegradable materials / waste「生分解性素材／廃棄物」。compostable と同一とは限らない。'],
  ['biosphere', '名', 'pre1', '生物圏', 'Human activity is changing the biosphere.', '人間活動が生物圏を変化させている。', 'bio-(生命)＋sphere(圏)。生命が存在する地球の領域。', '環境', 'the Earth’s biosphere「地球の生物圏」。atmosphere、hydrosphere と関連づける。'],
  ['carbon-neutral', '形', '2', 'カーボンニュートラルな・実質炭素排出ゼロの', 'The city aims to become carbon-neutral by 2050.', 'その都市は2050年までの実質炭素排出ゼロを目指す。', 'carbon(炭素)＋neutral(差し引きゼロの)。', '環境', 'become / achieve carbon-neutral status「実質排出ゼロになる／達成する」。carbon-free と同義ではない。', '/ˌkɑːrbən ˈnuːtrəl/'],
  ['circularity', '名', 'pre1', '循環性・循環型であること', 'Product design can improve material circularity.', '製品設計は素材の循環性を高められる。', 'circular(循環する)＋-ity。', '環境', 'material circularity「素材の循環性」、circular economy「循環型経済」と共に使う。', '/ˌsɜːrkjəˈlærəti/'],
  ['compostable', '形', 'pre1', '堆肥化できる', 'These cups are compostable under industrial conditions.', 'これらのカップは産業的条件下で堆肥化できる。', 'compost(堆肥にする)＋-able。', '環境', 'compostable packaging「堆肥化可能な包装」。biodegradable より処理条件を明示することが多い。', '/kəmˈpoʊstəbl/'],
  ['consumerism', '名', 'pre1', '消費主義・消費者中心主義', 'The documentary questions modern consumerism.', 'そのドキュメンタリーは現代の消費主義を問い直す。', 'consumer(消費者)＋-ism(主義・傾向)。', '社会', 'criticize / encourage consumerism「消費主義を批判／助長する」。文脈により消費者保護運動も指す。'],
  ['decarbonization', '名', 'pre1', '脱炭素化', 'Decarbonization requires changes in energy and transport.', '脱炭素化にはエネルギーと交通の変革が必要だ。', 'de-(取り除く)＋carbon(炭素)＋-ization(〜化)。', '環境', 'industrial decarbonization「産業の脱炭素化」。動詞は decarbonize。', '/diːˌkɑːrbənaɪˈzeɪʃən/'],
  ['degradation', '名', 'pre1', '劣化・悪化・分解', 'Soil degradation threatens food production.', '土壌劣化は食料生産を脅かす。', 'ラテン語 de-(下へ)＋gradus(段階)。段階を下げること。', '環境', 'environmental / soil degradation「環境／土壌の劣化」。動詞は degrade。'],
  ['desertification', '名', 'pre1', '砂漠化', 'Overgrazing can accelerate desertification.', '過放牧は砂漠化を加速させることがある。', 'desert(砂漠)＋-ification(〜化)。', '環境', 'combat / prevent desertification「砂漠化に対処する／防ぐ」。', '/dɪˌzɜːrtəfɪˈkeɪʃən/'],
  ['disposable', '形', '2', '使い捨ての・処分できる', 'Many cafes are reducing disposable cups.', '多くのカフェが使い捨てカップを減らしている。', 'dispose(処分する)＋-able。', '環境', 'disposable products / income「使い捨て製品／可処分所得」。文脈で意味が大きく変わる。'],
  ['emissions', '名', '2', '排出物・排出量', 'Transport accounts for a large share of carbon emissions.', '交通は炭素排出量の大きな割合を占める。', 'emit(放出する)＋-s。環境文脈では複数形が一般的。', '環境', 'reduce greenhouse-gas emissions「温室効果ガス排出量を削減する」。'],
  ['geothermal', '形', 'pre1', '地熱の', 'The region has significant geothermal resources.', 'その地域には豊富な地熱資源がある。', 'geo-(地球)＋thermal(熱の)。', '環境', 'geothermal energy / power「地熱エネルギー／発電」。'],
  ['hydroelectric', '形', 'pre1', '水力発電の', 'The dam supplies hydroelectric power to nearby towns.', 'そのダムは近隣の町に水力電力を供給する。', 'hydro-(水)＋electric(電気の)。', '環境', 'hydroelectric power / plant「水力発電／水力発電所」。'],
  ['microplastic', '名', '2', 'マイクロプラスチック・微小プラスチック片', 'Microplastics have been found in rivers and oceans.', 'マイクロプラスチックは河川や海洋で見つかっている。', 'micro-(小さい)＋plastic。通常5ミリ未満の微小な樹脂片。', '環境', 'microplastic pollution / particles「微小プラスチック汚染／粒子」。複数形 microplastics が多い。', '/ˌmaɪkroʊˈplæstɪk/'],
  ['mitigation', '名', 'pre1', '緩和・軽減策', 'Climate mitigation must be combined with adaptation.', '気候変動の緩和策は適応策と組み合わせなければならない。', 'ラテン語 mitigare(和らげる)から。', '環境', 'risk / climate mitigation「危険／気候変動の緩和」。mitigation of ... ともいう。'],
  ['minimalism', '名', 'pre1', '最小限主義・ミニマリズム', 'Minimalism can reduce unnecessary consumption.', '最小限主義は不要な消費を減らし得る。', 'minimal(最小限の)＋-ism(主義・様式)。', '社会', 'digital / architectural minimalism「デジタル／建築のミニマリズム」。'],
  ['overconsumption', '名', 'pre1', '過剰消費', 'Overconsumption places pressure on natural resources.', '過剰消費は天然資源に負担をかける。', 'over-(過度に)＋consumption(消費)。', '環境', 'reduce overconsumption「過剰消費を減らす」。通常は不可算名詞。', '/ˌoʊvərkənˈsʌmpʃən/'],
  ['photovoltaic', '形', '1', '太陽光発電の・光起電性の', 'Photovoltaic panels convert sunlight into electricity.', '太陽光発電パネルは日光を電気に変える。', 'photo-(光)＋voltaic(電気の)。光を直接電気に変える。', '科学', 'photovoltaic cell / panel「太陽電池／太陽光パネル」。solar thermal と区別する。', '/ˌfoʊtoʊvɒlˈteɪɪk/'],

  // ── 社会・経済・国際 ──
  ['abolition', '名', 'pre1', '廃止・撤廃', 'The movement called for the abolition of the law.', 'その運動は法律の廃止を求めた。', 'ラテン語 abolere(消滅させる)から。', '社会', 'the abolition of slavery / a rule「奴隷制／規則の廃止」。動詞は abolish。'],
  ['activist', '名', '2', '活動家', 'The activist spoke at the climate conference.', 'その活動家は気候会議で演説した。', 'active(積極的な)＋-ist(人)。社会変革のため行動する人。', '社会', 'a human-rights / environmental activist「人権／環境活動家」。'],
  ['affluence', '名', 'pre1', '豊かさ・富裕', 'Material affluence does not always bring happiness.', '物質的な豊かさが必ずしも幸福をもたらすとは限らない。', 'ラテン語 ad-(〜へ)＋fluere(流れる)。富が流れ込む状態。', '経済', 'growing / material affluence「増大する／物質的な豊かさ」。形容詞 affluent。'],
  ['anthropology', '名', 'pre1', '人類学', 'Anthropology examines human cultures and societies.', '人類学は人間の文化と社会を研究する。', 'ギリシャ語 anthropos(人間)＋-logy(学問)。', '学問', 'cultural / social anthropology「文化／社会人類学」。'],
  ['artifact', '名', '2', '人工物・遺物', 'The museum displayed artifacts from the ancient city.', '博物館は古代都市の遺物を展示した。', 'ラテン語 arte(技術で)＋factum(作られたもの)。', '歴史', 'a cultural / archaeological artifact「文化的／考古学的遺物」。データの人為的な乱れも指す。'],
  ['austerity', '名', '1', '緊縮政策・厳格さ', 'The government introduced austerity measures after the crisis.', '政府は危機後に緊縮策を導入した。', 'ギリシャ語 austeros(厳しい)から。', '経済', 'austerity measures / policy「緊縮策／政策」。個人の質素さにも使う。'],
  ['authoritarian', '形', 'pre1', '権威主義的な・独裁的な', 'The report describes a shift toward authoritarian rule.', 'その報告書は権威主義的統治への移行を述べている。', 'authority(権威)＋-arian(〜主義の)。', '政治', 'authoritarian government / regime「権威主義政府／体制」。名詞でも「権威主義者」。'],
  ['bilateral', '形', 'pre1', '二国間の・双方の', 'The two nations signed a bilateral agreement.', '両国は二国間協定に署名した。', 'bi-(二つ)＋lateral(側面の)。二つの側に関わる。', '政治', 'bilateral talks / trade「二国間協議／貿易」。multilateral「多国間の」と対照。'],
  ['cohesion', '名', 'pre1', '結束・まとまり', 'Shared goals can strengthen social cohesion.', '共通の目標は社会的結束を強め得る。', 'ラテン語 cohaerere(くっつく)から。', '社会', 'social / group cohesion「社会／集団の結束」。coherence は論理的一貫性。'],
  ['colonialism', '名', 'pre1', '植民地主義', 'The novel explores the legacy of colonialism.', 'その小説は植民地主義の遺産を探究している。', 'colony(植民地)＋-ism(主義・制度)。', '歴史', 'the legacy / impact of colonialism「植民地主義の遺産／影響」。'],
  ['constituency', '名', 'pre1', '選挙区・支持基盤', 'She represents a rural constituency.', '彼女は農村部の選挙区を代表している。', 'constituent(構成員・有権者)＋-cy。', '政治', 'a parliamentary constituency「議会選挙区」、a key constituency「主要支持層」。'],
  ['dependency', '名', '2', '依存・従属', 'Energy dependency can create economic risks.', 'エネルギー依存は経済的危険を生むことがある。', 'depend(頼る)＋-ency(状態)。', '社会', 'dependency on ...「…への依存」。dependence も同義だが、dependency は制度・関係にも多い。'],
  ['demographic', '形', 'pre1', '人口統計上の・特定層の', 'The country is undergoing major demographic change.', 'その国では大きな人口構成の変化が進んでいる。', 'ギリシャ語 demos(人々)＋-graphic(記述する)から。', '社会', 'demographic change / data「人口構成の変化／人口統計データ」。名詞で demographic「特定の層」にもなる。'],
  ['efficacy', '名', '1', '有効性・効き目', 'The trial measured the efficacy of the treatment.', 'その試験は治療の有効性を測定した。', 'ラテン語 efficere(成し遂げる)から。', '医学', 'the efficacy of a treatment / policy「治療／政策の有効性」。effectiveness より専門的。'],
  ['feasibility', '名', 'pre1', '実現可能性', 'The team studied the feasibility of the proposal.', 'チームはその提案の実現可能性を調査した。', 'feasible(実行可能な)＋-ity。', 'ビジネス', 'a feasibility study「実現可能性調査」、assess feasibility「実現性を評価する」。'],
  ['feudalism', '名', 'pre1', '封建制度・封建主義', 'Feudalism shaped medieval European society.', '封建制度は中世ヨーロッパ社会を形作った。', 'feudal(封建の)＋-ism(制度)。', '歴史', 'the decline of feudalism「封建制度の衰退」。'],
  ['fragmentation', '名', 'pre1', '分断・断片化', 'Political fragmentation made agreement difficult.', '政治的分断により合意が難しくなった。', 'fragment(断片)＋-ation。全体が小片に分かれること。', '社会', 'market / social fragmentation「市場／社会の分断」。'],
  ['GDP', '名', '2', '国内総生産', 'GDP grew by two percent last year.', '昨年、国内総生産は2パーセント増加した。', 'gross domestic product の頭字語。国内で生産された付加価値の総額。', '経済', 'GDP growth / per capita GDP「GDP成長率／一人当たりGDP」。通常は無冠詞で使う。', '/ˌdʒiː diː ˈpiː/'],
  ['globalization', '名', '2', 'グローバル化・世界規模化', 'Globalization has transformed supply chains.', 'グローバル化は供給網を変えた。', 'global(世界規模の)＋-ization(〜化)。', '社会', 'economic / cultural globalization「経済／文化のグローバル化」。動詞は globalize。'],
  ['humanitarian', '形', 'pre1', '人道的な・人道支援の', 'The organization delivered humanitarian aid.', 'その団体は人道支援を届けた。', 'humanity(人類・人間愛)＋-arian。', '社会', 'humanitarian aid / crisis「人道支援／人道危機」。名詞で「人道主義者」にもなる。'],
  ['imperialism', '名', 'pre1', '帝国主義', 'The course examines imperialism in the nineteenth century.', 'その講座は19世紀の帝国主義を考察する。', 'imperial(帝国の)＋-ism(主義)。', '歴史', 'the expansion / legacy of imperialism「帝国主義の拡大／遺産」。'],
  ['indigenous', '形', 'pre1', '先住の・固有の', 'The policy protects indigenous languages.', 'その政策は先住民の言語を保護する。', 'ラテン語 indigena(その土地に生まれた者)から。', '社会', 'indigenous peoples / species「先住民族／在来種」。人々を指すときは peoples とすることが多い。'],
  ['inclusivity', '名', 'pre1', '包摂性・誰も排除しない性質', 'The new guidelines promote inclusivity in the classroom.', '新しい指針は教室での包摂性を促進する。', 'inclusive(包み込む)＋-ity。', '社会', 'promote / improve inclusivity「包摂性を促進／改善する」。diversity を生かせる環境まで含意する。', '/ˌɪnkluːˈsɪvəti/'],
  ['investment', '名', '2', '投資・投入', 'Public investment improved local transport.', '公共投資が地域交通を改善した。', 'invest(資金・力を投じる)＋-ment。', '経済', 'investment in education / infrastructure「教育／インフラへの投資」。invest A in B の形。'],
  ['judiciary', '名', 'pre1', '司法部・裁判官組織', 'An independent judiciary protects the rule of law.', '独立した司法は法の支配を守る。', 'ラテン語 judicare(裁く)から。', '法律', 'an independent judiciary「独立した司法」。形容詞 judicial、名詞 judge と区別する。'],
  ['liquidity', '名', '1', '流動性・換金性', 'The bank must maintain sufficient liquidity.', '銀行は十分な流動性を維持しなければならない。', 'liquid(液体の、流動的な)＋-ity。資産を現金化しやすい性質。', '経済', 'market / financial liquidity「市場／金融の流動性」。'],
  ['logistics', '名', '2', '物流・運営計画', 'Efficient logistics reduced delivery times.', '効率的な物流により配送時間が短くなった。', 'フランス語 logistique(軍の補給計画)から。', 'ビジネス', 'logistics network / costs「物流網／物流費」。形は複数でも通常単数扱い。'],
  ['malnutrition', '名', 'pre1', '栄養不良', 'The program aims to reduce child malnutrition.', 'その計画は子どもの栄養不良を減らすことを目指す。', 'mal-(悪い)＋nutrition(栄養)。不足にも過剰にも使える。', '医学', 'suffer from malnutrition「栄養不良に苦しむ」。通常は不可算名詞。'],
  ['monopoly', '名', 'pre1', '独占・独占企業', 'The company was accused of creating a monopoly.', 'その会社は独占を作ったとして非難された。', 'ギリシャ語 mono-(一つ)＋polein(売る)。一者だけが売る状態。', '経済', 'have / hold a monopoly on ...「…を独占する」。形容詞 monopolistic。'],
  ['morality', '名', 'pre1', '道徳性・道徳体系', 'The novel raises questions about law and morality.', 'その小説は法と道徳について問題を提起する。', 'moral(道徳上の)＋-ity(性質・体系)。', '社会', 'public / personal morality「社会的／個人的道徳」。ethics は原則や学問体系を指しやすい。'],
  ['nationalism', '名', 'pre1', '国家主義・民族主義', 'Nationalism influenced politics across the region.', '国家主義は地域全体の政治に影響を与えた。', 'nation(国家・民族)＋-alism(主義)。', '政治', 'the rise of nationalism「国家主義の台頭」。patriotism「愛国心」と同一ではない。'],
  ['polarization', '名', 'pre1', '二極化・分断', 'Social media may intensify political polarization.', 'SNSは政治的分断を強める可能性がある。', 'polarize(両極に分ける)＋-ation。', '社会', 'political / social polarization「政治的／社会的二極化」。'],
  ['psychology', '名', '2', '心理学・心理', 'She studies the psychology of decision-making.', '彼女は意思決定の心理を研究している。', 'ギリシャ語 psyche(心)＋-logy(学問)。', '学問', 'social / cognitive psychology「社会／認知心理学」、the psychology of ...「…の心理」。'],
  ['sector', '名', '2', '部門・産業分野', 'The service sector employs many young people.', 'サービス部門は多くの若者を雇用している。', 'ラテン語 secare(切る)から。全体を切り分けた一区分。', '経済', 'public / private sector「公共／民間部門」、technology sector「技術産業」。'],
  ['stakeholder', '名', '2', '利害関係者', 'All stakeholders were invited to the meeting.', 'すべての利害関係者が会議に招かれた。', 'stake(利害・持ち分)＋holder(持つ人)。', 'ビジネス', 'key / local stakeholders「主要／地域の利害関係者」。shareholder「株主」より範囲が広い。'],
  ['theology', '名', '1', '神学', 'She studied theology and religious history.', '彼女は神学と宗教史を学んだ。', 'ギリシャ語 theos(神)＋-logy(学問)。', '宗教', 'Christian / systematic theology「キリスト教／組織神学」。'],
  ['transparency', '名', '2', '透明性・分かりやすさ', 'Greater transparency can increase public trust.', '透明性を高めることは国民の信頼を増し得る。', 'transparent(透けて見える)＋-cy。情報や過程が見えること。', '社会', 'promote / ensure transparency「透明性を促す／確保する」。'],
  ['urbanization', '名', '2', '都市化', 'Rapid urbanization has increased housing demand.', '急速な都市化が住宅需要を増加させた。', 'urban(都市の)＋-ization(〜化)。', '地理', 'rapid urbanization「急速な都市化」。動詞は urbanize。'],
  ['accessibility', '名', '2', '利用しやすさ・アクセス可能性', 'Captions improve the accessibility of online lessons.', '字幕はオンライン授業の利用しやすさを高める。', 'accessible(到達・利用できる)＋-ity。', '社会', 'improve accessibility / accessibility for ...「利用しやすさを改善する／…にとっての利用可能性」。'],

  // ── 医学・生命科学 ──
  ['chromosome', '名', 'pre1', '染色体', 'Humans normally have twenty-three pairs of chromosomes.', '人間は通常23対の染色体を持つ。', 'ギリシャ語 chroma(色)＋soma(体)。染色されて見える構造。', '科学', 'a pair of chromosomes「一対の染色体」。gene は染色体上の遺伝情報単位。'],
  ['cognitive', '形', '2', '認知の・思考に関する', 'Sleep affects cognitive performance.', '睡眠は認知能力に影響する。', 'ラテン語 cognoscere(知る)から。', '心理', 'cognitive ability / bias「認知能力／認知バイアス」。名詞 cognition。'],
  ['conductivity', '名', 'pre1', '伝導性・導電率', 'Copper has high electrical conductivity.', '銅は高い導電率を持つ。', 'conduct(導く)＋-ivity(性質)。', '科学', 'electrical / thermal conductivity「電気／熱伝導率」。'],
  ['convection', '名', 'pre1', '対流', 'Convection transfers heat through moving fluids.', '対流は動く流体を通して熱を移動させる。', 'ラテン語 con-(共に)＋vehere(運ぶ)。物質の移動で熱を運ぶ。', '科学', 'convection current「対流」、convection oven「対流式オーブン」。'],
  ['diffusion', '名', 'pre1', '拡散・普及', 'Diffusion moves particles from high to low concentration.', '拡散は粒子を高濃度側から低濃度側へ移動させる。', 'ラテン語 dis-(広く)＋fundere(注ぐ)。広く流れ出ること。', '科学', 'the diffusion of gases / ideas「気体／考えの拡散・普及」。'],
  ['enzyme', '名', '2', '酵素', 'This enzyme helps break down protein.', 'この酵素はタンパク質の分解を助ける。', 'ギリシャ語 en(中に)＋zyme(酵母)。', '科学', 'digestive enzyme「消化酵素」、enzyme activity「酵素活性」。'],
  ['genetic', '形', '2', '遺伝の・遺伝子の', 'Both genetic and environmental factors affect health.', '遺伝的要因と環境要因の両方が健康に影響する。', 'gene(遺伝子)から派生。', '科学', 'genetic information / factor「遺伝情報／遺伝要因」。hereditary は形質が受け継がれる点を強調。'],
  ['genome', '名', 'pre1', 'ゲノム・全遺伝情報', 'Scientists compared the genomes of several species.', '科学者は複数種のゲノムを比較した。', 'gene＋-ome(全体)。「遺伝子の全体」。', '科学', 'the human genome「ヒトゲノム」、genome sequencing「ゲノム配列解析」。'],
  ['isotope', '名', 'pre1', '同位体', 'Carbon-14 is a radioactive isotope.', '炭素14は放射性同位体である。', 'ギリシャ語 iso-(同じ)＋topos(場所)。周期表で同じ位置を占める。', '科学', 'radioactive / stable isotope「放射性／安定同位体」。'],
  ['mutation', '名', '2', '突然変異・変化', 'A mutation altered the function of the gene.', '突然変異がその遺伝子の機能を変えた。', 'ラテン語 mutare(変える)から。', '科学', 'genetic mutation「遺伝子変異」、undergo a mutation「変異を起こす」。'],
  ['neuron', '名', '2', '神経細胞・ニューロン', 'Each neuron communicates through electrical signals.', '各神経細胞は電気信号を通じて情報を伝える。', 'ギリシャ語 neuron(神経)から。', '医学', 'sensory / motor neuron「感覚／運動ニューロン」。'],
  ['neurodiversity', '名', 'pre1', '神経多様性', 'Neurodiversity recognizes natural variation in human brains.', '神経多様性は人間の脳の自然な違いを認める考え方だ。', 'neuro-(神経の)＋diversity(多様性)。', '社会', 'a neurodiversity perspective「神経多様性の観点」。人を欠陥として扱わない文脈で使う。', '/ˌnʊroʊdaɪˈvɜːrsəti/'],
  ['pathogen', '名', '2', '病原体', 'The immune system identifies and attacks pathogens.', '免疫系は病原体を見分けて攻撃する。', 'ギリシャ語 pathos(病気)＋-gen(生むもの)。', '医学', 'airborne / foodborne pathogen「空気／食品媒介の病原体」。virus や bacterium を含む上位語。'],
  ['respiration', '名', '2', '呼吸・細胞呼吸', 'Cellular respiration releases energy from glucose.', '細胞呼吸はブドウ糖からエネルギーを放出する。', 'ラテン語 re-(再び)＋spirare(息をする)。', '科学', 'cellular / aerobic respiration「細胞／好気呼吸」。breathing より生物学的な過程を表す。'],
  ['telemedicine', '名', 'pre1', '遠隔医療', 'Telemedicine can improve access to rural health care.', '遠隔医療は農村部の医療利用を改善し得る。', 'tele-(遠く)＋medicine(医療)。', '医学', 'use / expand telemedicine「遠隔医療を利用／拡大する」。通常は不可算名詞。', '/ˌtelɪˈmedɪsɪn/'],
  ['wavelength', '名', '2', '波長', 'Red light has a longer wavelength than blue light.', '赤い光は青い光より波長が長い。', 'wave(波)＋length(長さ)。一つの波の周期の空間的な長さ。', '科学', 'a short / long wavelength「短い／長い波長」。'],

  // ── 教育・言語・論述 ──
  ['admittedly', '副', 'pre1', '確かに・認めるところでは', 'Admittedly, the plan will require more time.', '確かに、その計画にはさらに時間が必要だ。', 'admit(認める)＋-edly。反対意見の一部を先に認める働き。', '言語', '文頭の Admittedly, ... は譲歩を示し、その後に but / however が続きやすい。'],
  ['apprenticeship', '名', '2', '見習い期間・徒弟訓練', 'He completed an apprenticeship as an electrician.', '彼は電気技師の見習い訓練を修了した。', 'apprentice(見習い)＋-ship(状態・制度)。', '教育', 'complete / offer an apprenticeship「見習い訓練を修了／提供する」。'],
  ['arguably', '副', 'pre1', '議論の余地はあるが・おそらく', 'This is arguably the most important discovery of the decade.', 'これはおそらくこの10年で最も重要な発見だ。', 'argue(論じる)＋-ably。根拠を示せば主張できるという含み。', '言語', 'arguably the best / most ...「おそらく最も…」。断定を和らげる学術表現。'],
  ['authenticity', '名', 'pre1', '真正性・本物らしさ', 'Experts questioned the authenticity of the document.', '専門家はその文書の真正性に疑問を呈した。', 'authentic(本物の)＋-ity。', '一般', 'verify / question authenticity「真正性を確認／疑問視する」。'],
  ['compatibility', '名', '2', '互換性・相性', 'Check the software compatibility before installation.', 'インストール前にソフトウェアの互換性を確認しなさい。', 'compatible(両立できる)＋-ity。', '技術', 'compatibility with ...「…との互換性」。人や考えの相性にも使う。'],
  ['counterargument', '名', '2', '反論・反対論', 'A strong essay addresses the main counterargument.', '優れた論文は主要な反論にも対処する。', 'counter-(反対の)＋argument(論拠・主張)。', '言語', 'present / address a counterargument「反論を提示／検討する」。単なる否定でなく根拠を伴う。', '/ˌkaʊntərˈɑːrɡjəmənt/'],
  ['credential', '名', 'pre1', '資格証明・経歴', 'Applicants must provide a recognized teaching credential.', '応募者は公認の教員資格を提示しなければならない。', 'ラテン語 credere(信じる)から。信頼できることを証明するもの。', '教育', 'academic / professional credentials「学歴／職業資格」。複数形 credentials が多い。'],
  ['entrepreneurship', '名', '2', '起業家精神・起業活動', 'The course encourages entrepreneurship among students.', 'その講座は生徒の起業活動を促す。', 'entrepreneur(起業家)＋-ship(活動・資質)。', 'ビジネス', 'promote / support entrepreneurship「起業活動を促進／支援する」。', '/ˌɑːntrəprəˈnɜːrʃɪp/'],
  ['ethics', '名', '2', '倫理・倫理学', 'The debate raises questions about medical ethics.', 'その議論は医療倫理に関する問題を提起する。', 'ギリシャ語 ethos(習慣・性格)から。', '学問', 'business / research ethics「企業／研究倫理」。学問名・原則の集合として通常単数扱い。'],
  ['internship', '名', '2', '実習・インターンシップ', 'She gained practical experience through an internship.', '彼女はインターンシップを通じて実務経験を得た。', 'intern(実習生)＋-ship(期間・身分)。', '教育', 'do / complete an internship「実習をする／修了する」、an internship at a company。'],
  ['interdisciplinary', '形', 'pre1', '学際的な・複数分野にまたがる', 'The project takes an interdisciplinary approach.', 'その計画は学際的な手法を取る。', 'inter-(間の)＋disciplinary(学問分野の)。', '学問', 'interdisciplinary research / approach「学際研究／学際的手法」。', '/ˌɪntərˈdɪsəpləneri/'],
  ['pedagogy', '名', '1', '教授法・教育学', 'The program combines technology with sound pedagogy.', 'その課程は技術と確かな教授法を組み合わせている。', 'ギリシャ語 pais(子ども)＋agogos(導く者)。', '教育', 'language / digital pedagogy「言語／デジタル教授法」。教育の理論・方法を指す。'],
  ['rhetoric', '名', 'pre1', '修辞・説得的言説・美辞麗句', 'The speech used powerful rhetoric but offered few details.', 'その演説は力強い言辞を用いたが、具体策はほとんど示さなかった。', 'ギリシャ語 rhetor(演説家)から。', '言語', 'political rhetoric「政治的言説」、rhetorical device「修辞技法」。文脈により空疎な美辞の含み。'],
  ['satire', '名', 'pre1', '風刺・風刺作品', 'The novel uses satire to criticize social inequality.', 'その小説は社会的不平等を批判するために風刺を用いる。', 'ラテン語 satura(混ぜ物、諷刺詩)から。', '文学', 'political satire「政治風刺」、a work of satire「風刺作品」。'],
  ['symbolism', '名', 'pre1', '象徴性・象徴主義', 'Water has rich symbolism in the poem.', 'その詩では水が豊かな象徴性を持つ。', 'symbol(象徴)＋-ism(体系・傾向)。', '文学', 'religious / visual symbolism「宗教的／視覚的象徴性」。'],
  ['thesis', '名', '2', '論旨・学位論文', 'Each paragraph should support the central thesis.', '各段落は中心的な論旨を支えるべきだ。', 'ギリシャ語 thesis(置かれた命題)から。', '言語', 'thesis statement「論旨文」、write a thesis「学位論文を書く」。複数形は theses。'],

  // ── 使い分け学習で必要な基礎見出し語の補充 ──
  ['number', '名', '5', '数・番号', 'The number of visitors increased this year.', '今年、訪問者の数が増えた。', 'ラテン語 numerus(数)から。', '時間・数量', 'the number of＋複数名詞＋単数動詞「…の数」。a number of＋複数名詞＋複数動詞「多くの…」。'],
  ['lately', '副', '3', '最近・近ごろ', 'I have been very busy lately.', '私は最近とても忙しい。', 'late(遅い)＋-ly から発達したが、現在は「最近」の意味。', '時間・数量', '現在完了とよく使う。late「遅く」と意味を混同しない。'],
  ['rob', '動', '2', '強奪する・奪う', 'The thieves robbed the traveler of his money.', '泥棒たちは旅行者から金を奪った。', '古フランス語 rober(奪う)から。', '法律', 'rob 人 of 物「人から物を奪う」。steal 物 from 人とは目的語が逆。'],
  ['steal', '動', '3', '盗む・こっそり取る', 'Someone stole my bicycle from the station.', '誰かが駅から私の自転車を盗んだ。', '古英語 stelan(ひそかに取る)から。', '法律', 'steal 物 from 人／場所「物を人／場所から盗む」。rob は人・場所を目的語にする。'],
  ['historic', '形', '2', '歴史的に重要な', 'The leaders reached a historic agreement.', '指導者たちは歴史的に重要な合意に達した。', 'history(歴史)＋-ic。歴史に残るほど重要なこと。', '歴史', 'a historic event / decision「歴史的出来事／決定」。historical は「歴史に関する」。'],
  ['historical', '形', '2', '歴史の・過去に関する', 'The museum preserves historical documents.', 'その博物館は歴史資料を保存している。', 'history(歴史)＋-ical。歴史という分野・過去に関係する。', '歴史', 'historical evidence / research「歴史的証拠／歴史研究」。重要性を示す historic と区別する。'],
  ['personnel', '名', 'pre1', '職員・人事部', 'All personnel must attend the safety training.', '全職員が安全研修に参加しなければならない。', 'フランス語 personnel(職員全体)から。', 'ビジネス', 'military / medical personnel「軍／医療職員」。集合名詞で、personal「個人の」と綴りを区別。'],
  ['insure', '動', 'pre1', '保険を掛ける', 'The owner insured the building against fire.', '所有者はその建物に火災保険を掛けた。', 'ensure と同系で「安全にする」から保険の意味へ専門化。', '経済', 'insure A against B「AにBへの保険を掛ける」。一般に「確実にする」は ensure。'],
  ['request', '動', '2', '要請する・依頼する', 'The committee requested that the report be revised.', '委員会は報告書を修正するよう求めた。', 'ラテン語 re-(再び)＋quaerere(求める)。正式に求める。', '言語', 'request that S (should) do / request A from B。×request 人 to do は格式ある標準用法では避け、ask 人 to do が自然。'],
]

export const EXAM_WORDS = RAW_EXAM_WORDS.map(
  ([word, pos, level, meaning, en, ja, etymology, field, usage, phonetic]) => {
    const entry = expandCompact([
      word,
      pos,
      level,
      meaning,
      en,
      ja,
      etymology,
      { field, usage },
    ])
    return phonetic ? { ...entry, phonetic } : entry
  },
)

export const EXAM_WORD_IDS = new Set(EXAM_WORDS.map((word) => word.id))

// 類義語の「どれを選ぶか」を、見出し語から参照できる比較ガイドとして保持する。
// choices.term は見出し語と一致させ、検索・全件検証・詳細表示で同じ正本を使う。
export const EXAM_USAGE_GUIDES = [
  {
    id: 'say-tell-speak-talk',
    title: 'say / tell / speak / talk',
    wordIds: ['say', 'tell', 'speak', 'talk'],
    summary: 'say は内容、tell は相手、speak は言語・一方向の発話、talk は会話を中心にする。',
    choices: [
      { term: 'say', rule: 'say＋内容 / say to＋人', example: 'She said that she was ready.', ja: '彼女は準備ができたと言った。' },
      { term: 'tell', rule: 'tell＋人＋内容', example: 'She told me the truth.', ja: '彼女は私に真実を話した。' },
      { term: 'speak', rule: 'speak＋言語 / speak to＋人', example: 'He speaks Spanish fluently.', ja: '彼はスペイン語を流暢に話す。' },
      { term: 'talk', rule: 'talk with/to＋人 about＋話題', example: 'We talked about the plan.', ja: '私たちは計画について話し合った。' },
    ],
    preferred: { avoid: 'say me / talk the truth', use: 'tell me / tell the truth', reason: '相手を直接目的語に取るときは tell を使う。' },
  },
  {
    id: 'see-look-watch',
    title: 'see / look / watch',
    wordIds: ['see', 'look', 'watch'],
    summary: 'see は目に入る、look は意識して視線を向ける、watch は動きをしばらく見る。',
    choices: [
      { term: 'see', rule: '自然に見える・会う', example: 'I can see the mountains from here.', ja: 'ここから山が見える。' },
      { term: 'look', rule: 'look at＋対象', example: 'Look at the graph carefully.', ja: 'グラフを注意深く見なさい。' },
      { term: 'watch', rule: '動くもの・変化を見続ける', example: 'We watched the game online.', ja: '私たちはオンラインで試合を観戦した。' },
    ],
  },
  {
    id: 'hear-listen',
    title: 'hear / listen',
    wordIds: ['hear', 'listen'],
    summary: 'hear は自然に耳に入る、listen は意識して耳を傾ける。',
    choices: [
      { term: 'hear', rule: 'hear＋音 / hear that節', example: 'I heard a strange noise.', ja: '奇妙な音が聞こえた。' },
      { term: 'listen', rule: 'listen to＋対象', example: 'Listen to the instructions carefully.', ja: '指示を注意して聞きなさい。' },
    ],
    preferred: { avoid: 'listen music', use: 'listen to music', reason: 'listen の対象には前置詞 to が必要。' },
  },
  {
    id: 'lend-borrow',
    title: 'lend / borrow',
    wordIds: ['lend', 'borrow'],
    summary: 'lend は貸す側、borrow は借りる側から表す。',
    choices: [
      { term: 'lend', rule: 'lend＋人＋物 / lend＋物＋to＋人', example: 'Could you lend me your pen?', ja: 'ペンを貸してくれますか。' },
      { term: 'borrow', rule: 'borrow＋物＋from＋人', example: 'I borrowed a book from the library.', ja: '図書館から本を借りた。' },
    ],
  },
  {
    id: 'teach-learn',
    title: 'teach / learn',
    wordIds: ['teach', 'learn'],
    summary: 'teach は教える側、learn は知識・技能を身につける側。',
    choices: [
      { term: 'teach', rule: 'teach＋人＋内容', example: 'She taught us how to code.', ja: '彼女は私たちにコーディングの仕方を教えた。' },
      { term: 'learn', rule: 'learn＋内容 / learn from＋人・経験', example: 'We learn from our mistakes.', ja: '私たちは失敗から学ぶ。' },
    ],
  },
  {
    id: 'bring-take',
    title: 'bring / take',
    wordIds: ['bring', 'take'],
    summary: 'bring は話し手・基準点へ持って来る、take はそこから別の場所へ持って行く。',
    choices: [
      { term: 'bring', rule: 'こちらへ持って来る', example: 'Please bring your textbook tomorrow.', ja: '明日教科書を持って来てください。' },
      { term: 'take', rule: 'あちらへ持って行く', example: 'Take this letter to the office.', ja: 'この手紙を事務室へ持って行きなさい。' },
    ],
  },
  {
    id: 'arrive-reach',
    title: 'arrive / reach',
    wordIds: ['arrive', 'reach'],
    summary: 'arrive は自動詞で前置詞が必要、reach は他動詞で場所を直接取る。',
    choices: [
      { term: 'arrive', rule: 'arrive at＋小場所 / in＋都市・国', example: 'We arrived at the station at noon.', ja: '私たちは正午に駅へ着いた。' },
      { term: 'reach', rule: 'reach＋場所（前置詞なし）', example: 'We reached the station at noon.', ja: '私たちは正午に駅へ着いた。' },
    ],
    preferred: { avoid: 'reach to the station', use: 'reach the station', reason: 'reach は他動詞なので to を置かない。' },
  },
  {
    id: 'attend-join-participate',
    title: 'attend / join / participate',
    wordIds: ['attend', 'join', 'participate'],
    summary: 'attend は会・学校に出席、join は集団に加わる、participate は活動に参加する。',
    choices: [
      { term: 'attend', rule: 'attend＋会・学校（前置詞なし）', example: 'She attended the conference.', ja: '彼女は会議に出席した。' },
      { term: 'join', rule: 'join＋人・団体 / join in＋活動', example: 'He joined the science club.', ja: '彼は科学部に入った。' },
      { term: 'participate', rule: 'participate in＋活動', example: 'They participated in the survey.', ja: '彼らは調査に参加した。' },
    ],
  },
  {
    id: 'affect-effect',
    title: 'affect / effect',
    wordIds: ['affect', 'effect'],
    summary: 'affect は主に動詞「影響する」、effect は主に名詞「影響・結果」。',
    choices: [
      { term: 'affect', rule: 'affect＋対象', example: 'Lack of sleep affects memory.', ja: '睡眠不足は記憶に影響する。' },
      { term: 'effect', rule: 'have an effect on＋対象', example: 'Sleep has an effect on memory.', ja: '睡眠は記憶に影響を与える。' },
    ],
  },
  {
    id: 'advice-advise',
    title: 'advice / advise',
    wordIds: ['advice', 'advise'],
    summary: 'advice は不可算名詞、advise は動詞。',
    choices: [
      { term: 'advice', rule: 'a piece of advice / advice on＋話題', example: 'She gave me useful advice.', ja: '彼女は私に役立つ助言をくれた。' },
      { term: 'advise', rule: 'advise＋人＋to do', example: 'She advised me to wait.', ja: '彼女は私に待つよう助言した。' },
    ],
    preferred: { avoid: 'an advice / advices', use: 'a piece of advice / some advice', reason: 'advice は不可算名詞。' },
  },
  {
    id: 'accept-agree',
    title: 'accept / agree',
    wordIds: ['accept', 'agree'],
    summary: 'accept は提案・事実を受け入れる、agree は人・意見に賛成する。',
    choices: [
      { term: 'accept', rule: 'accept＋提案・事実・招待', example: 'They accepted the proposal.', ja: '彼らはその提案を受け入れた。' },
      { term: 'agree', rule: 'agree with＋人・意見 / agree to＋提案', example: 'I agree with your point.', ja: '私はあなたの意見に賛成だ。' },
    ],
  },
  {
    id: 'allow-permit',
    title: 'allow / permit',
    wordIds: ['allow', 'permit'],
    summary: 'どちらも許可だが、permit の方が格式的。allow/permit＋人＋to do の形を取る。',
    choices: [
      { term: 'allow', rule: '日常的な許可・可能にする', example: 'The app allows users to save words.', ja: 'そのアプリでは利用者が単語を保存できる。' },
      { term: 'permit', rule: '規則・公的な許可', example: 'The rules do not permit smoking.', ja: '規則は喫煙を認めていない。' },
    ],
    preferred: { avoid: 'allow to do（目的語なし）', use: 'allow people to do / allow doing', reason: 'to do の意味上の主語を置くか、動名詞にする。' },
  },
  {
    id: 'almost-most',
    title: 'almost / most',
    wordIds: ['almost', 'most'],
    summary: 'almost は副詞「ほとんど」、most は限定詞・代名詞「大部分の」。',
    choices: [
      { term: 'almost', rule: 'almost all / almost every / almost finished', example: 'Almost all students agreed.', ja: 'ほぼ全員の生徒が賛成した。' },
      { term: 'most', rule: 'most＋名詞 / most of＋限定された名詞', example: 'Most students agreed.', ja: '大部分の生徒が賛成した。' },
    ],
    preferred: { avoid: 'almost students', use: 'almost all students / most students', reason: 'almost は名詞を直接限定しない。' },
  },
  {
    id: 'among-between',
    title: 'among / between',
    wordIds: ['among', 'between'],
    summary: 'between は個別に識別できるものの関係、among は集団の中を表す。',
    choices: [
      { term: 'between', rule: '2者、または個別に区別する複数者', example: 'The agreement was made between the three countries.', ja: 'その協定は3か国間で結ばれた。' },
      { term: 'among', rule: '一まとまりの集団の中', example: 'The idea spread among young people.', ja: 'その考えは若者の間に広がった。' },
    ],
  },
  {
    id: 'amount-number',
    title: 'amount / number',
    wordIds: ['amount', 'number'],
    summary: 'amount は不可算名詞の量、number は可算名詞の数。',
    choices: [
      { term: 'amount', rule: 'the amount of＋不可算名詞', example: 'We reduced the amount of waste.', ja: '私たちはごみの量を減らした。' },
      { term: 'number', rule: 'the number of＋複数可算名詞', example: 'The number of visitors increased.', ja: '訪問者数が増えた。' },
    ],
  },
  {
    id: 'another-other',
    title: 'another / other / the other',
    wordIds: ['another', 'other'],
    summary: 'another は「もう一つ・別の一つ」、other は「ほかの」、the other は二つのうち残り一つ。',
    choices: [
      { term: 'another', rule: 'another＋単数可算名詞', example: 'May I have another chance?', ja: 'もう一度機会をもらえますか。' },
      { term: 'other', rule: 'other＋複数名詞・不可算名詞', example: 'We need other sources of energy.', ja: '私たちにはほかのエネルギー源が必要だ。' },
      { term: 'the other', rule: '二つのうち残る一方', example: 'One is red, and the other is blue.', ja: '一方は赤で、もう一方は青だ。' },
    ],
  },
  {
    id: 'because-despite',
    title: 'because / because of / although / despite',
    wordIds: ['because', 'despite'],
    summary: '接続詞の後ろは文、前置詞の後ろは名詞・動名詞を置く。',
    choices: [
      { term: 'because', rule: 'because＋主語＋動詞 / because of＋名詞', example: 'We stayed home because it rained.', ja: '雨が降ったので家にいた。' },
      { term: 'despite', rule: 'despite＋名詞・動名詞', example: 'We went out despite the rain.', ja: '雨にもかかわらず外出した。' },
    ],
    preferred: { avoid: 'despite it rained', use: 'although it rained / despite the rain', reason: 'despite は前置詞なので文を直接続けない。' },
  },
  {
    id: 'during-while',
    title: 'during / while',
    wordIds: ['during'],
    summary: 'during は前置詞で名詞を、while は接続詞で主語＋動詞を続ける。',
    choices: [
      { term: 'during', rule: 'during＋名詞', example: 'No one spoke during the meeting.', ja: '会議中は誰も話さなかった。' },
      { term: 'while', rule: 'while＋主語＋動詞', example: 'No one spoke while the chair was explaining.', ja: '議長が説明している間、誰も話さなかった。' },
    ],
  },
  {
    id: 'each-every',
    title: 'each / every',
    wordIds: ['each', 'every'],
    summary: 'each は一つ一つを個別に、every は集団の全構成員をまとめて捉える。',
    choices: [
      { term: 'each', rule: 'each＋単数名詞 / each of＋複数名詞', example: 'Each student received a card.', ja: '各生徒がカードを受け取った。' },
      { term: 'every', rule: 'every＋単数名詞', example: 'Every student must register.', ja: 'すべての生徒が登録しなければならない。' },
    ],
  },
  {
    id: 'few-little',
    title: 'few / a few / little / a little',
    wordIds: ['few', 'little'],
    summary: 'few は可算、little は不可算。a がないと「ほとんどない」、a があると「少しはある」。',
    choices: [
      { term: 'few', rule: 'few / a few＋複数可算名詞', example: 'A few students asked questions.', ja: '数人の生徒が質問した。' },
      { term: 'little', rule: 'little / a little＋不可算名詞', example: 'We have a little time left.', ja: '少し時間が残っている。' },
    ],
  },
  {
    id: 'hard-hardly',
    title: 'hard / hardly',
    wordIds: ['hard', 'hardly'],
    summary: 'hard は「一生懸命に・難しい」、hardly は「ほとんど〜ない」。',
    choices: [
      { term: 'hard', rule: 'work hard / a hard problem', example: 'She worked hard for the exam.', ja: '彼女は試験のため懸命に勉強した。' },
      { term: 'hardly', rule: 'hardly＋動詞（準否定）', example: 'I could hardly hear him.', ja: '彼の声がほとんど聞こえなかった。' },
    ],
    preferred: { avoid: 'work hardly', use: 'work hard', reason: 'hardly は「ほとんど〜ない」で、hard の副詞形ではない。' },
  },
  {
    id: 'high-tall',
    title: 'high / tall',
    wordIds: ['high', 'tall'],
    summary: 'high は位置・水準が高い、tall は人や縦長の物の高さがある。',
    choices: [
      { term: 'high', rule: 'high mountain / price / level', example: 'The mountain is 3,000 meters high.', ja: 'その山は高さ3,000メートルだ。' },
      { term: 'tall', rule: 'tall person / building / tree', example: 'A tall tree stood by the gate.', ja: '門のそばに高い木が立っていた。' },
    ],
  },
  {
    id: 'house-home',
    title: 'house / home',
    wordIds: ['house', 'home'],
    summary: 'house は建物、home は生活の場・帰属感を含む「家」。',
    choices: [
      { term: 'house', rule: '建物としての住宅', example: 'They bought an old house.', ja: '彼らは古い家屋を買った。' },
      { term: 'home', rule: '暮らす場所・故郷', example: 'I felt at home in the new town.', ja: '新しい町でくつろいだ気持ちになった。' },
    ],
    preferred: { avoid: 'go to home', use: 'go home', reason: 'home を方向の副詞として使うとき to は不要。' },
  },
  {
    id: 'job-work',
    title: 'job / work',
    wordIds: ['job', 'work'],
    summary: 'job は一つの職・仕事で可算、work は労働・作業全般で通常不可算。',
    choices: [
      { term: 'job', rule: 'a job / three jobs', example: 'She found a part-time job.', ja: '彼女はアルバイトを見つけた。' },
      { term: 'work', rule: 'work to do / at work', example: 'I have a lot of work to do.', ja: '私にはするべき仕事がたくさんある。' },
    ],
    preferred: { avoid: 'many works（仕事の意味）', use: 'a lot of work', reason: '作業・仕事の work は通常不可算。works は作品・工場など別義。' },
  },
  {
    id: 'late-lately',
    title: 'late / lately',
    wordIds: ['late', 'lately'],
    summary: 'late は「遅く・遅れた」、lately は「最近」。',
    choices: [
      { term: 'late', rule: 'arrive late / be late for', example: 'The train arrived late.', ja: '電車は遅れて到着した。' },
      { term: 'lately', rule: '最近（現在完了と好相性）', example: 'Have you seen her lately?', ja: '最近彼女に会いましたか。' },
    ],
  },
  {
    id: 'like-as',
    title: 'like / as',
    wordIds: ['like', 'as'],
    summary: 'like は「〜のように」という比較、as は「〜として」という役割を表す。',
    choices: [
      { term: 'like', rule: 'like＋名詞「〜のように」', example: 'He works like a machine.', ja: '彼は機械のように働く。' },
      { term: 'as', rule: 'as＋名詞「〜として」', example: 'He works as an engineer.', ja: '彼は技師として働く。' },
    ],
  },
  {
    id: 'remember-remind',
    title: 'remember / remind',
    wordIds: ['remember', 'remind'],
    summary: 'remember は自分が覚えている、remind は人に思い出させる。',
    choices: [
      { term: 'remember', rule: 'remember to do / doing', example: 'Remember to lock the door.', ja: '忘れずにドアに鍵をかけなさい。' },
      { term: 'remind', rule: 'remind＋人＋of / to do / that節', example: 'Please remind me to call her.', ja: '彼女に電話するよう私に念を押してください。' },
    ],
  },
  {
    id: 'rise-raise',
    title: 'rise / raise',
    wordIds: ['rise', 'raise'],
    summary: 'rise は自動詞「上がる」、raise は他動詞「〜を上げる」。',
    choices: [
      { term: 'rise', rule: '主語自身が上がる（rise-rose-risen）', example: 'Sea levels are rising.', ja: '海面が上昇している。' },
      { term: 'raise', rule: 'raise＋目的語（raise-raised-raised）', example: 'The bank raised interest rates.', ja: '銀行は金利を引き上げた。' },
    ],
  },
  {
    id: 'rob-steal',
    title: 'rob / steal',
    wordIds: ['rob', 'steal'],
    summary: 'rob は被害者・場所を、steal は盗む物を目的語にする。',
    choices: [
      { term: 'rob', rule: 'rob＋人・場所＋of＋物', example: 'They robbed the bank of cash.', ja: '彼らは銀行から現金を奪った。' },
      { term: 'steal', rule: 'steal＋物＋from＋人・場所', example: 'They stole cash from the bank.', ja: '彼らは銀行から現金を盗んだ。' },
    ],
  },
  {
    id: 'sensitive-sensible',
    title: 'sensitive / sensible',
    wordIds: ['sensitive', 'sensible'],
    summary: 'sensitive は敏感な、sensible は分別のある・実用的な。',
    choices: [
      { term: 'sensitive', rule: 'sensitive to＋刺激・問題', example: 'Children are sensitive to tone of voice.', ja: '子どもは声の調子に敏感だ。' },
      { term: 'sensible', rule: 'sensible decision / advice', example: 'That is a sensible solution.', ja: 'それは賢明な解決策だ。' },
    ],
  },
  {
    id: 'economic-economical',
    title: 'economic / economical',
    wordIds: ['economic', 'economical'],
    summary: 'economic は経済に関する、economical は無駄がなく節約になる。',
    choices: [
      { term: 'economic', rule: 'economic growth / policy', example: 'The region faces economic challenges.', ja: 'その地域は経済的課題に直面している。' },
      { term: 'economical', rule: 'economical car / method', example: 'This heater is economical to run.', ja: 'この暖房器具は運転費が安い。' },
    ],
  },
  {
    id: 'historic-historical',
    title: 'historic / historical',
    wordIds: ['historic', 'historical'],
    summary: 'historic は歴史に残るほど重要、historical は歴史・過去に関係する。',
    choices: [
      { term: 'historic', rule: 'historic event / agreement', example: 'The court issued a historic ruling.', ja: '裁判所は歴史的に重要な判決を出した。' },
      { term: 'historical', rule: 'historical record / research', example: 'The claim lacks historical evidence.', ja: 'その主張には歴史的証拠がない。' },
    ],
  },
  {
    id: 'imply-infer',
    title: 'imply / infer',
    wordIds: ['imply', 'infer'],
    summary: '話し手・証拠がほのめかすのが imply、聞き手・読み手が推論するのが infer。',
    choices: [
      { term: 'imply', rule: '発信側が間接的に示す', example: 'Her tone implied that she disagreed.', ja: '彼女の口調は反対であることをほのめかした。' },
      { term: 'infer', rule: '受信側が証拠から結論する', example: 'We inferred that she disagreed.', ja: '私たちは彼女が反対だと推論した。' },
    ],
  },
  {
    id: 'complement-compliment',
    title: 'complement / compliment',
    wordIds: ['complement', 'compliment'],
    summary: 'complement は補完するもの、compliment は褒め言葉。',
    choices: [
      { term: 'complement', rule: 'complement＋対象 / a complement to', example: 'The sauce complements the fish.', ja: 'そのソースは魚料理を引き立てる。' },
      { term: 'compliment', rule: 'pay/give a compliment / compliment＋人', example: 'She complimented him on his speech.', ja: '彼女は彼の演説を褒めた。' },
    ],
  },
  {
    id: 'principal-principle',
    title: 'principal / principle',
    wordIds: ['principal', 'principle'],
    summary: 'principal は主要な・校長、principle は原理・信条。',
    choices: [
      { term: 'principal', rule: 'principal reason / school principal', example: 'Cost is the principal concern.', ja: '費用が主要な懸念だ。' },
      { term: 'principle', rule: 'basic principle / in principle', example: 'The policy violates a basic principle.', ja: 'その政策は基本原則に反する。' },
    ],
  },
  {
    id: 'personal-personnel',
    title: 'personal / personnel',
    wordIds: ['personal', 'personnel'],
    summary: 'personal は個人の、personnel は組織の職員全体。',
    choices: [
      { term: 'personal', rule: 'personal opinion / information', example: 'Do not share personal information.', ja: '個人情報を共有してはいけない。' },
      { term: 'personnel', rule: 'medical / military personnel', example: 'Emergency personnel arrived quickly.', ja: '救急隊員がすぐ到着した。' },
    ],
  },
  {
    id: 'assure-ensure-insure',
    title: 'assure / ensure / insure',
    wordIds: ['assure', 'ensure', 'insure'],
    summary: 'assure は人を安心させる、ensure は結果を確実にする、insure は保険を掛ける。',
    choices: [
      { term: 'assure', rule: 'assure＋人＋that節', example: 'She assured me that the data was safe.', ja: '彼女はデータは安全だと私を安心させた。' },
      { term: 'ensure', rule: 'ensure＋結果 / that節', example: 'Backups ensure that the data is safe.', ja: 'バックアップによってデータの安全が確保される。' },
      { term: 'insure', rule: 'insure＋物＋against＋危険', example: 'They insured the house against fire.', ja: '彼らは家に火災保険を掛けた。' },
    ],
  },
  {
    id: 'lay-lie',
    title: 'lay / lie',
    wordIds: ['lay', 'lie'],
    summary: 'lay は他動詞「〜を置く」、lie は自動詞「横たわる」。活用も異なる。',
    choices: [
      { term: 'lay', rule: 'lay-laid-laid＋目的語', example: 'Lay the book on the desk.', ja: '本を机の上に置きなさい。' },
      { term: 'lie', rule: 'lie-lay-lain（目的語なし）', example: 'The book lay on the desk.', ja: '本は机の上に置かれていた。' },
    ],
  },
  {
    id: 'adapt-adopt',
    title: 'adapt / adopt',
    wordIds: ['adapt', 'adopt'],
    summary: 'adapt は適応・改変する、adopt は考え・制度などを採用する。',
    choices: [
      { term: 'adapt', rule: 'adapt to＋環境 / adapt A for B', example: 'Animals adapt to environmental change.', ja: '動物は環境変化に適応する。' },
      { term: 'adopt', rule: 'adopt a policy / approach', example: 'The school adopted a new policy.', ja: '学校は新方針を採用した。' },
    ],
  },
  {
    id: 'preposition-traps',
    title: 'access / discuss / explain',
    wordIds: ['access', 'discuss', 'explain'],
    summary: '日本語から余分な前置詞を足しやすい他動詞に注意する。',
    choices: [
      { term: 'access', rule: 'access＋情報・場所', example: 'Students can access the database.', ja: '生徒はデータベースにアクセスできる。' },
      { term: 'discuss', rule: 'discuss＋話題', example: 'We discussed the problem.', ja: '私たちはその問題について話し合った。' },
      { term: 'explain', rule: 'explain＋内容＋to＋人', example: 'Please explain the rule to me.', ja: 'その規則を私に説明してください。' },
    ],
    preferred: { avoid: 'access to the database（動詞） / discuss about / explain me', use: 'access the database / discuss the issue / explain it to me', reason: '各動詞の目的語の取り方をそのまま覚える。' },
  },
  {
    id: 'suggest-recommend-request',
    title: 'suggest / recommend / request',
    wordIds: ['suggest', 'recommend', 'request'],
    summary: '提案・要請の後ろでは動名詞または that＋主語＋動詞原形を使う。',
    choices: [
      { term: 'suggest', rule: 'suggest doing / suggest that S do', example: 'She suggested taking a break.', ja: '彼女は休憩することを提案した。' },
      { term: 'recommend', rule: 'recommend doing / recommend that S do', example: 'I recommend checking the source.', ja: '出典を確認することを勧める。' },
      { term: 'request', rule: 'request that S do / request＋名詞', example: 'They requested that the form be revised.', ja: '彼らは書式の修正を要請した。' },
    ],
    preferred: { avoid: 'suggest to do / recommend to do', use: 'suggest doing / recommend doing', reason: 'suggest と recommend は「提案内容」を動名詞で取る。' },
  },
  {
    id: 'prevent-enable',
    title: 'prevent / enable',
    wordIds: ['prevent', 'enable'],
    summary: 'prevent は「妨げる」、enable は「可能にする」で、後ろの形が異なる。',
    choices: [
      { term: 'prevent', rule: 'prevent＋人・物＋from doing', example: 'The rule prevents data from being misused.', ja: 'その規則はデータの悪用を防ぐ。' },
      { term: 'enable', rule: 'enable＋人・物＋to do', example: 'The tool enables students to review words.', ja: 'その道具で生徒は単語を復習できる。' },
    ],
  },
  {
    id: 'gerund-verbs',
    title: 'consider / avoid / prefer',
    wordIds: ['consider', 'avoid', 'prefer'],
    summary: 'consider と avoid の後ろは動名詞。prefer は比較の形も重要。',
    choices: [
      { term: 'consider', rule: 'consider doing', example: 'Consider using a different source.', ja: '別の資料を使うことを検討しなさい。' },
      { term: 'avoid', rule: 'avoid doing', example: 'Avoid making unsupported claims.', ja: '根拠のない主張をするのは避けなさい。' },
      { term: 'prefer', rule: 'prefer A to B / prefer doing to doing', example: 'I prefer reading to watching videos.', ja: '私は動画を見るより読む方が好きだ。' },
    ],
  },
]

export const USAGE_GUIDES_BY_WORD = EXAM_USAGE_GUIDES.reduce((byWord, guide) => {
  for (const wordId of guide.wordIds) {
    byWord[wordId] = [...(byWord[wordId] ?? []), guide]
  }
  return byWord
}, {})
