// 読解100.xlsxを出発点に、断定しすぎる「公式」ではなく、
// 実際の本文で再現できる判断手順として再設計した長文読解ルール。
// origin: reference-reframed は引用内容を統合・言い換えたもの、
// added は長文全体の読み方・根拠確認のために追加したものを示す。

const freeze = (items) => Object.freeze(items)

const makeRule = (
  id,
  phase,
  level,
  title,
  short,
  signal,
  steps,
  exampleEn,
  exampleJa,
  caution,
  options = {},
) => Object.freeze({
  id,
  phase,
  level,
  title,
  short,
  signal,
  steps: freeze(steps),
  example: Object.freeze({ en: exampleEn, ja: exampleJa }),
  caution,
  origin: options.origin || 'reference-reframed',
  diagram: options.diagram ? Object.freeze(options.diagram) : null,
})

export const READING_RULE_PHASES = freeze([
  Object.freeze({ id: 'orient', step: 1, label: '見通す', icon: '🧭', color: '#0f766e', description: '題名・形式・段落から、何を探して読むか決める。' }),
  Object.freeze({ id: 'skeleton', step: 2, label: '骨組み', icon: '🦴', color: '#2563eb', description: '主節と文の中心をつかみ、長い修飾を整理する。' }),
  Object.freeze({ id: 'relation', step: 3, label: '関係づける', icon: '🔗', color: '#7c3aed', description: '節・準動詞・指示語が何につながるか確かめる。' }),
  Object.freeze({ id: 'logic', step: 4, label: '論理を追う', icon: '🪧', color: '#c2410c', description: '対比・因果・具体例を使って段落の流れを読む。' }),
  Object.freeze({ id: 'answer', step: 5, label: '根拠で答える', icon: '🎯', color: '#be123c', description: '設問の言い換えを見抜き、本文の根拠へ戻る。' }),
])

export const READING_RULE_LEVELS = Object.freeze({
  basic: Object.freeze({ label: '基礎', color: '#059669' }),
  standard: Object.freeze({ label: '標準', color: '#2563eb' }),
  advanced: Object.freeze({ label: '発展', color: '#7c3aed' }),
})

export const READING_RULES = freeze([
  makeRule(
    'purpose-first',
    'orient',
    'basic',
    '読む目的を一つ決める',
    '最初の一周では、すべてを訳そうとせず「誰が・何を・なぜ」を拾う。',
    '題名、導入文、設問の疑問詞',
    ['題名を日本語で短く言う', '各段落の主役と出来事を一語でメモする', '細部は設問で必要になったら戻る'],
    'A town tested a new map after heavy rain.',
    'ある町が大雨の後に新しい地図を試した。',
    '設問を先に見る方法が合わない人は、題名と第1段落だけで目的を決めてもよい。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['題名', '主役', '変化', '結論'] } },
  ),
  makeRule(
    'reading-mode',
    'orient',
    'basic',
    '速く読む所と精密に読む所を分ける',
    '背景説明は大意を取り、対比・結論・設問根拠では速度を落とす。',
    'however、therefore、設問と同じ内容、段落末',
    ['背景は主語と動詞を中心に進む', '論理語で減速する', '根拠候補に印を付ける'],
    'The first plan was cheap. However, it was not safe.',
    '最初の案は安かった。しかし、安全ではなかった。',
    '速読は読み飛ばしではない。主語・動詞・論理語は残す。',
    { origin: 'added', diagram: { type: 'speed', nodes: ['背景＝速め', '対比＝減速', '根拠＝精読'] } },
  ),
  makeRule(
    'paragraph-map',
    'orient',
    'standard',
    '段落を一言で地図にする',
    '各段落を「問題・調査・結果・限界」のような役割で要約する。',
    '段落冒頭、同じ話題語、段落末のまとめ',
    ['段落ごとに中心語を一つ選ぶ', '内容ではなく役割を付ける', '段落間を矢印でつなぐ'],
    'The survey found two problems. The team then changed the design.',
    '調査で二つの問題が見つかり、その後チームは設計を変えた。',
    '一文ずつ日本語にするだけでは段落の役割が見えない。要約は十数字でよい。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['問題', '調査', '改善', '評価'] } },
  ),
  makeRule(
    'genre-prediction',
    'orient',
    'standard',
    '文章の型から次を予測する',
    '物語・説明・意見文の型を使い、次に来そうな情報を待ち受ける。',
    '時系列、調査結果、賛否、提案',
    ['文種を仮決めする', '物語なら変化、説明なら仕組み、意見文なら根拠を探す', '外れたら予測を更新する'],
    'Supporters point to one benefit, while critics raise a different concern.',
    '支持者は利点を、批判者は別の懸念を示す。',
    '型は予測の道具であり、本文を型に無理に当てはめない。',
    { origin: 'added', diagram: { type: 'branch', nodes: ['物語→転機', '説明→仕組み', '意見→根拠'] } },
  ),
  makeRule(
    'finite-verb-check',
    'skeleton',
    'basic',
    '時制を持つ動詞を探す',
    '長い文では、まず主語に対応して時制を持つ動詞を探し、節の数を見積もる。',
    '現在形・過去形・助動詞＋動詞、接続詞、関係詞',
    ['動詞らしい語に印を付ける', '助動詞と動詞は一組にする', '接続詞・関係詞との対応を確認する'],
    'Students who use the guide can find safer routes.',
    'そのガイドを使う生徒は、より安全な道を見つけられる。',
    '動詞の個数だけで節数を機械的に決めない。分詞・不定詞・省略がある。',
    { diagram: { type: 'layers', nodes: ['Students can find', 'who use the guide'] } },
  ),
  makeRule(
    'main-clause-skeleton',
    'skeleton',
    'basic',
    '主節のS＋Vを先に確保する',
    'that節や関係節をいったん括弧に入れ、文全体を支える主語と動詞を残す。',
    '文頭の長い句、that、who、which、when',
    ['文頭から最初の名詞を主語候補にする', '修飾節を仮に括弧へ入れる', '残った主語と動詞で意味が通るか確かめる'],
    'The map that the students revised became easier to use.',
    '生徒たちが修正した地図は、使いやすくなった。',
    '主節だけで完全な情報になるとは限らない。骨組みを取った後で修飾を必ず戻す。',
    { diagram: { type: 'layers', nodes: ['The map became easier', 'that the students revised'] } },
  ),
  makeRule(
    'svoc-core',
    'skeleton',
    'basic',
    'S・V・O・Cで中心をつかむ',
    '誰が、どうする、何を、どんな状態に、の順に中心成分を置く。',
    '名詞＋動詞、be動詞、make・call・find',
    ['最初にSとVを決める', 'Vの後が対象Oか説明Cかを見る', '修飾語を最後に足す'],
    'The experiment made the rule clearer.',
    'その実験は、その規則をより明確にした。',
    'すべての語をSVOに押し込まない。前置詞句や副詞は中心成分の外に置く。',
    { diagram: { type: 'roles', nodes: ['S 実験', 'V した', 'O 規則を', 'C 明確に'] } },
  ),
  makeRule(
    'noun-boundary',
    'skeleton',
    'basic',
    '冠詞・所有格から名詞のかたまりを作る',
    'a・the・this・theirなどを入口に、中心名詞と前後の修飾をまとめる。',
    'a、an、the、this、these、my、their、数詞',
    ['入口語を見つける', '中心名詞まで進む', 'of句や後置修飾が続くか確かめる'],
    'the final plan for the school trip',
    'その学校遠足の最終計画',
    '冠詞がない名詞句も多い。冠詞は便利な入口であって必須条件ではない。',
    { diagram: { type: 'bracket', nodes: ['the', 'final', 'plan', 'for the trip'] } },
  ),
  makeRule(
    'parallel-shape',
    'skeleton',
    'standard',
    'and・orの左右を同じ形でそろえる',
    '等位接続詞の左右で、名詞・動詞・句・節の形を対応させる。',
    'and、or、but、both A and B、either A or B',
    ['接続詞に印を付ける', '右側の形を確認する', '左側で同じ文法上の形を探す'],
    'Students measured the route and checked the signs.',
    '生徒たちは道順を測り、標識を確認した。',
    '意味が対等でも表面の語数は同じとは限らない。文法上の役割でそろえる。',
    { diagram: { type: 'balance', nodes: ['measured the route', 'and', 'checked the signs'] } },
  ),
  makeRule(
    'insertion',
    'skeleton',
    'standard',
    '挿入を外してから戻す',
    'コンマ・ダッシュ・同格で挟まれた補足を外し、文の骨組みを先に読む。',
    'コンマ二つ、ダッシュ二つ、名詞＋言い換え',
    ['左右の区切りを確認する', '挟まれた部分を仮に外す', '骨組みの後に補足として戻す'],
    'The guide, a student project, is now used by visitors.',
    'そのガイドは、生徒の活動であり、今では旅行者に使われている。',
    'コンマは挿入以外にも列挙や節の区切りに使われる。両端が対応するかを見る。',
    { diagram: { type: 'layers', nodes: ['The guide is used', 'a student project'] } },
  ),
  makeRule(
    'punctuation-map',
    'skeleton',
    'standard',
    '句読法を意味の案内板にする',
    'コロン・セミコロン・ダッシュを、説明や並列の候補として読む。',
    '：、；、—、括弧',
    ['記号の前でいったん内容をまとめる', '後ろが説明・例・対比のどれか確かめる', '論理語も合わせて判断する'],
    'The result was clear: fewer messages improved focus.',
    '結果は明らかだった。メッセージが少ないほど集中が改善した。',
    '記号だけで論理関係を固定しない。前後の内容が最終判断を決める。',
    { diagram: { type: 'flow', nodes: ['主張', '：', '説明・具体化'] } },
  ),
  makeRule(
    'that-diagnosis',
    'relation',
    'standard',
    'thatの三つの役割を見分ける',
    'thatの後ろと直前を見て、名詞節・関係節・指示語のどれかを決める。',
    'that＋文、名詞＋that、that＋名詞',
    ['thatの後ろに主語と動詞がそろうか見る', '直前の名詞を説明しているか見る', 'that自体が「あの」と名詞を限定していないか見る'],
    'The students learned that translation requires imagination.',
    '生徒たちは、翻訳には想像力が必要だと学んだ。',
    '動詞の種類だけで名詞節と決めない。前後の文構造で確かめる。',
    { diagram: { type: 'branch', nodes: ['that＋完全な文→名詞節候補', '名詞＋that＋欠け→関係節候補', 'that＋名詞→指示'] } },
  ),
  makeRule(
    'wh-clause',
    'relation',
    'standard',
    '疑問詞節を一つの名詞として読む',
    'what・how・whyなどが文中で主語や目的語になっていれば、節全体をひとかたまりにする。',
    'what、how、why、where、whether＋主語＋動詞',
    ['疑問詞から節末までを囲む', '節の中を平叙文語順で読む', '文全体で主語・目的語・補語のどれかを確かめる'],
    'The survey showed what visitors needed.',
    'その調査は、旅行者が必要としているものを示した。',
    'how節がいつも名詞節とは限らない。方法を表す副詞的な用法も文全体で確認する。',
    { diagram: { type: 'bracket', nodes: ['showed', '[what visitors needed]'] } },
  ),
  makeRule(
    'relative-clause',
    'relation',
    'standard',
    '関係詞節を直前の名詞へ戻す',
    'who・which・that以下を、説明される名詞に矢印で戻す。',
    '名詞＋who・which・that・whose・where',
    ['関係詞直前の名詞を候補にする', '節内で欠けている役割を探す', '名詞＋説明の順に意味をつなぐ'],
    'The residents who tested the map found one problem.',
    'その地図を試した住民は、一つの問題を見つけた。',
    '先行詞は常に直前の一語とは限らず、名詞のかたまり全体になることがある。',
    { diagram: { type: 'backlink', nodes: ['the residents', '← who tested the map'] } },
  ),
  makeRule(
    'postmodifier',
    'relation',
    'basic',
    '名詞の後ろの説明を前へ戻す',
    '前置詞句・分詞・不定詞が名詞の後ろに続くとき、まず名詞を取り、後から説明を足す。',
    '名詞＋前置詞、名詞＋ing・ed、名詞＋to do',
    ['中心名詞を先に取る', '後ろのかたまりの終点を探す', '「どんな名詞か」として戻す'],
    'a route without dangerous steps',
    '危険な階段のない道順',
    '後ろの句が動詞を修飾する場合もある。どの語に意味が自然につながるか比べる。',
    { diagram: { type: 'backlink', nodes: ['a route', '← without dangerous steps'] } },
  ),
  makeRule(
    'infinitive-role',
    'relation',
    'standard',
    'to doの役割を前後で決める',
    '不定詞を「すること・するために・するための」のどれでつなぐか判断する。',
    'to＋動詞の原形',
    ['直前が名詞か動詞かを見る', '目的を表すなら「するために」を試す', '文全体で自然な役割を選ぶ'],
    'The class made a guide to help visitors.',
    'クラスは旅行者を助けるためにガイドを作った。',
    'toを見ただけで目的用法と決めない。名詞用法・形容詞用法や前置詞toもある。',
    { diagram: { type: 'branch', nodes: ['すること', 'するための', 'するために'] } },
  ),
  makeRule(
    'ing-ed-role',
    'relation',
    'standard',
    'ing・ed語尾を文中の働きで見分ける',
    '語尾だけで決めず、進行形・受け身・分詞・動名詞・過去形のどれかを周囲から見分ける。',
    'be＋ing、be＋過去分詞、名詞＋ing・ed、文頭のing、動詞の過去形',
    ['be・have・助動詞との組を確認する', '名詞を説明する位置か、名詞の位置かを見る', '残れば文のVとなる過去形か確かめる'],
    'Using the map, families found a safer route.',
    'その地図を使って、家族はより安全な道順を見つけた。',
    'morning・eveningのように、見た目がingでもこの分類に入らない名詞がある。語尾だけで判断しない。',
    {
      diagram: {
        type: 'branch',
        nodes: ['be＋ing→進行', 'be＋過去分詞→受け身', '名詞＋ing・ed→説明', 'ingが主語→動名詞', '文のV→過去形'],
      },
    },
  ),
  makeRule(
    'passive-active',
    'relation',
    'basic',
    '受け身を「誰が何をしたか」に戻す',
    'be＋過去分詞を見たら、動作を受けるものと、必要ならby以下の行為者を整理する。',
    'be動詞＋過去分詞、by＋行為者',
    ['主語が動作を受けると確認する', '動作を日本語の動詞に戻す', '行為者が省略された理由を考える'],
    'The map was tested by local families.',
    'その地図は地域の家族によって試された。',
    'be＋過去分詞に見えても状態を表す形容詞の場合がある。文脈で動作か状態かを確かめる。',
    { diagram: { type: 'roles', nodes: ['families', 'tested', 'the map'] } },
  ),
  makeRule(
    'comparison-pairs',
    'logic',
    'standard',
    '比較は比べる二者と基準をそろえる',
    '比較級・as・thanを見たら、何と何をどの点で比べているか書き出す。',
    'more、less、-er、than、as ... as、the more',
    ['比較される二者を決める', '比較する尺度を探す', '省略された共通部分を補う'],
    'The longer route was safer than the shorter one.',
    '長い道順は短い道順より安全だった。',
    'than以下に語が省略されることがある。表面の隣り合う語だけを比べない。',
    { diagram: { type: 'balance', nodes: ['長い道順', '安全性', '短い道順'] } },
  ),
  makeRule(
    'negation-scope',
    'logic',
    'standard',
    '否定がどこまでかかるか囲む',
    'not・never・little・withoutなどが、動詞・量・一部だけのどれを否定するか確かめる。',
    'not、never、no、few、little、hardly、without',
    ['否定語に印を付ける', '否定される中心を探す', '全部否定か部分否定か文脈で確かめる'],
    'Not every donated item finds a new owner.',
    '寄付された品すべてに新しい持ち主が見つかるわけではない。',
    'not everyを「一つもない」と読まない。not always・not necessarilyも部分否定になりやすい。',
    { diagram: { type: 'scope', nodes: ['not', '[every item finds ...]', '全部ではない'] } },
  ),
  makeRule(
    'logic-connectors',
    'logic',
    'basic',
    '論理語を関係の矢印に分類する',
    '追加・対比・因果・条件・言い換えのどれかを仮置きし、前後の関係を確かめる。',
    'also、however、because、therefore、if、unless、in other words',
    ['論理語を丸で囲む', '前の内容を短く言う', '後ろが追加・逆転・理由・結果・条件・説明のどれか決める'],
    'The route was short; however, it included many steps.',
    'その道順は短かった。しかし、階段が多かった。',
    '論理語の訳を文頭へ機械的に移さない。修飾する範囲と文の流れを確認する。',
    { diagram: { type: 'branch', nodes: ['＋追加', '↔対比', '→因果', '？条件', '＝言い換え'] } },
  ),
  makeRule(
    'contrast-concession',
    'logic',
    'standard',
    '対比では「予想」と「逆の事実」を取る',
    'however・although・whileの前後を比べ、筆者が重く置く側を判断する。',
    'however、but、although、even though、while、yet',
    ['前半から自然な予想を作る', '後半の逆転内容を取る', '段落の結論に近い側を確かめる'],
    'Although the tool was useful, it could not replace clear teaching.',
    'その道具は役立ったが、分かりやすい指導の代わりにはならなかった。',
    '対比の後半が常に筆者の結論とは限らない。後続文と段落末まで見る。',
    { diagram: { type: 'turn', nodes: ['予想', 'しかし', '実際・限定'] } },
  ),
  makeRule(
    'cause-result',
    'logic',
    'basic',
    '原因と結果の向きを確認する',
    'because・so・therefore・lead toを、原因→結果の一本の矢印にする。',
    'because、since、so、therefore、as a result、lead to、because of',
    ['原因のまとまりを短く囲む', '結果のまとまりを短く囲む', '矢印の向きが本文と一致するか確認する'],
    'Because the sign was hidden, walkers missed the turn.',
    '標識が隠れていたため、歩行者は曲がり角を見落とした。',
    'sinceやasには別の意味がある。因果が内容上成立するかを優先する。',
    { diagram: { type: 'flow', nodes: ['標識が隠れる', '→', '曲がり角を逃す'] } },
  ),
  makeRule(
    'example-restatement',
    'logic',
    'standard',
    '具体例を直前の抽象語へ戻す',
    'for exampleやsuch as以下を、何の例か一段上の表現につなぐ。',
    'for example、for instance、such as、in other words、that is',
    ['具体例の範囲を短く囲む', '直前の上位概念を探す', '例から主張を言い換えて確認する'],
    'The guide added landmarks, such as a red bridge and a stone tower.',
    'ガイドは、赤い橋や石の塔などの目印を加えた。',
    '例だけを覚えて主張を落とさない。設問では上位概念に言い換えられることが多い。',
    { diagram: { type: 'layers', nodes: ['landmarks 上位概念', 'red bridge / stone tower 具体例'] } },
  ),
  makeRule(
    'reference-chain',
    'answer',
    'basic',
    '指示語を同じ数・意味の語へ戻す',
    'it・they・this・suchが指す内容を、直前だけでなく意味のまとまりから探す。',
    'it、they、this、these、such、the former、the latter',
    ['単数・複数を合わせる', '候補を代入して意味を読む', 'this＋名詞なら前文全体も候補にする'],
    'The team changed the map. This improvement helped families.',
    'チームは地図を変えた。この改善は家族の役に立った。',
    '最も近い名詞が必ず先行内容とは限らない。数と意味の両方を合わせる。',
    { origin: 'added', diagram: { type: 'backlink', nodes: ['This improvement', '← changed the map'] } },
  ),
  makeRule(
    'unknown-word-context',
    'answer',
    'standard',
    '未知語は品詞・対比・例から絞る',
    '知らない語をすぐ辞書に頼らず、文中の役割と周辺の言い換えから意味の範囲を推測する。',
    '定義、同格、対比、具体例、接頭辞・接尾辞',
    ['まず未知語の品詞を決める', '前後の肯定・否定を取る', '例や言い換えから大まかな意味を置く'],
    'The material was durable; it remained useful for many years.',
    'その素材は丈夫で、何年も役立ち続けた。',
    '推測で十分なのは大意を取る場面。設問の鍵なら語彙欄や辞書で確認する。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['品詞', '周辺の論理', '仮の意味', '文脈確認'] } },
  ),
  makeRule(
    'author-stance',
    'answer',
    'advanced',
    '筆者の主張と他者の意見を分ける',
    'say・claim・may・shouldなどを手掛かりに、発言者と確信の強さを追う。',
    'supporters say、critics argue、may、must、should、the evidence suggests',
    ['誰の意見かラベルを付ける', '可能・提案・断定の強さを取る', '最終段落で筆者の立場を確認する'],
    'The evidence suggests that the policy may help, but it is not a complete solution.',
    '証拠は、その政策が役立つ可能性を示すが、完全な解決策ではない。',
    '本文にない強い断定へ言い換えない。mayとmust、someとallは区別する。',
    { origin: 'added', diagram: { type: 'scale', nodes: ['may 可能', 'suggest 示唆', 'should 提案', 'must 強い必要'] } },
  ),
  makeRule(
    'evidence-backtrack',
    'answer',
    'basic',
    '設問語を本文の言い換えへ戻す',
    '選択肢を先に信じず、設問の中心語と同じ意味の本文箇所を探す。',
    'why、according to、main idea、本文と異なる表現',
    ['設問の主語と動詞に線を引く', '同義語・言い換えを本文で探す', '根拠文と前後一文を読み直す'],
    'Question: Why was the route changed? Text: It included many unsafe steps.',
    '問：なぜ道順を変えたか。本文：危険な階段が多く含まれていた。',
    '同じ単語があるだけでは根拠にならない。主語・因果・否定まで一致させる。',
    { origin: 'added', diagram: { type: 'backlink', nodes: ['設問の言い換え', '←', '本文の根拠＋前後'] } },
  ),
  makeRule(
    'distractor-strength',
    'answer',
    'standard',
    '選択肢の強すぎる表現を点検する',
    '本文のsome・may・oftenが、選択肢でall・must・alwaysに変わっていないか比べる。',
    'all、only、always、never、must、completely',
    ['数量と頻度に丸を付ける', '本文の対応表現と強さを比べる', '一部一致でも言いすぎなら外す'],
    'Text: Some students improved. Choice: Every student improved.',
    '本文：一部の生徒が向上した。選択肢：全員が向上した。',
    '強い語がある選択肢が必ず誤りではない。本文が同じ強さで述べていれば正しい。',
    { origin: 'added', diagram: { type: 'scale', nodes: ['some', 'many', 'most', 'all'] } },
  ),
  makeRule(
    'repair-monitor',
    'answer',
    'basic',
    '意味が壊れたら一段戻って修復する',
    '読んだ意味が前後と矛盾したら、主語・否定・指示語・論理語の順に再点検する。',
    '話が急に反転する、主役が不明、因果が逆、結論が合わない',
    ['違和感のある文で止まる', '主語と否定を再確認する', '指示語と論理語を戻し、段落要約を更新する'],
    'If the conclusion conflicts with the result, check whether not was overlooked.',
    '結論が結果と食い違うなら、notを見落としていないか確認する。',
    '分からない一語で止まり続けない。段落の大意を保てるなら仮置きして先へ進む。',
    { origin: 'added', diagram: { type: 'loop', nodes: ['読む', '違和感', '4点確認', '要約を更新'] } },
  ),
])

export const READING_RULES_BY_ID = Object.freeze(
  Object.fromEntries(READING_RULES.map((rule) => [rule.id, rule])),
)

const BASE_RULE_IDS = freeze([
  'purpose-first',
  'paragraph-map',
  'main-clause-skeleton',
  'postmodifier',
  'logic-connectors',
  'evidence-backtrack',
])

const ING_ED_LEXICAL_EXCEPTIONS = new Set([
  'anything', 'bed', 'bring', 'during', 'evening', 'everything', 'hundred',
  'indeed', 'king', 'morning', 'need', 'nothing', 'red', 'something', 'speed',
  'spring', 'thing',
])

const hasIngEdCue = (text) => [...text.matchAll(/\b([a-z]+(?:ing|ed))\b/gi)]
  .map((match) => match[1].toLowerCase())
  .some((word) => word.length >= 6 && !ING_ED_LEXICAL_EXCEPTIONS.has(word))

const SENTENCE_TRIGGER_GROUPS = freeze([
  Object.freeze({ id: 'noun-boundary', test: (text) => /\b(?:a|an|the|this|that|these|those|my|our|your|his|her|their)\s+[a-z]/i.test(text) }),
  Object.freeze({ id: 'finite-verb-check', test: (text) => /\b(?:is|are|was|were|has|have|had|can|could|will|would|may|might|must|should)\b/i.test(text) || /\b\w+(?:ed|es)\b/i.test(text) }),
  Object.freeze({ id: 'parallel-shape', test: (text) => /\b(?:and|or|both|either|neither)\b/i.test(text) }),
  Object.freeze({ id: 'insertion', test: (text) => (text.match(/,/g) || []).length >= 2 || /—|--/.test(text) }),
  Object.freeze({ id: 'punctuation-map', test: (text) => /[:;—]/.test(text) }),
  Object.freeze({ id: 'that-diagnosis', test: (text) => /\bthat\b/i.test(text) }),
  Object.freeze({ id: 'wh-clause', test: (text) => /\b(?:what|how|why|whether|where)\b/i.test(text) }),
  Object.freeze({ id: 'relative-clause', test: (text) => /\b(?:who|which|whose|whom)\b/i.test(text) || /\b\w+\s+that\s+\w+/i.test(text) }),
  Object.freeze({ id: 'postmodifier', test: (text) => /\b\w+\s+(?:with|without|for|from|in|on|at|to)\b/i.test(text) }),
  Object.freeze({ id: 'infinitive-role', test: (text) => /\bto\s+[a-z]+\b/i.test(text) }),
  Object.freeze({ id: 'ing-ed-role', test: hasIngEdCue }),
  Object.freeze({ id: 'passive-active', test: (text) => /\b(?:is|are|was|were|be|been|being)\s+\w+ed\b/i.test(text) }),
  Object.freeze({ id: 'comparison-pairs', test: (text) => /\b(?:than|more|less|as\s+\w+\s+as)\b/i.test(text) }),
  Object.freeze({ id: 'negation-scope', test: (text) => /\b(?:not|never|no|few|little|hardly|without)\b/i.test(text) }),
  Object.freeze({ id: 'logic-connectors', test: (text) => /\b(?:also|however|but|because|so|therefore|instead|if|unless|in addition|as a result)\b/i.test(text) }),
  Object.freeze({ id: 'contrast-concession', test: (text) => /\b(?:however|but|although|though|while|yet)\b/i.test(text) }),
  Object.freeze({ id: 'cause-result', test: (text) => /\b(?:because|since|therefore|so|result|lead|led)\b/i.test(text) }),
  Object.freeze({ id: 'example-restatement', test: (text) => /\b(?:for example|for instance|such as|in other words|that is)\b/i.test(text) }),
  Object.freeze({ id: 'reference-chain', test: (text) => /\b(?:it|they|this|these|those|such)\b/i.test(text) }),
  Object.freeze({ id: 'unknown-word-context', test: (text) => /[:;]|\b(?:means?|called|known as|such as|while|however)\b/i.test(text) }),
  Object.freeze({ id: 'author-stance', test: (text) => /\b(?:say|says|said|argue|claim|suggest|believe|may|might|should|must)\b/i.test(text) }),
])

// 一般的な「動詞を探す」より、その文で誤読を左右する否定・対比・因果を先に出す。
const SENTENCE_RULE_PRIORITY = freeze([
  'negation-scope',
  'contrast-concession',
  'cause-result',
  'example-restatement',
  'logic-connectors',
  'comparison-pairs',
  'that-diagnosis',
  'wh-clause',
  'relative-clause',
  'passive-active',
  'infinitive-role',
  'ing-ed-role',
  'punctuation-map',
  'insertion',
  'parallel-shape',
  'author-stance',
  'unknown-word-context',
  'reference-chain',
  'postmodifier',
  'noun-boundary',
  'finite-verb-check',
])

const uniqueRules = (ids) => [...new Set(ids)]
  .map((id) => READING_RULES_BY_ID[id])
  .filter(Boolean)

export function readingRulesForSentence(sentence, limit = 3) {
  const text = sentence?.en || ''
  const matchedIds = new Set(SENTENCE_TRIGGER_GROUPS
    .filter((entry) => entry.test(text))
    .map((entry) => entry.id))
  const matched = SENTENCE_RULE_PRIORITY.filter((id) => matchedIds.has(id))

  const fallbacks = [
    'main-clause-skeleton',
    sentence?.paragraphStart ? 'paragraph-map' : 'svoc-core',
    'repair-monitor',
  ]

  return uniqueRules([...matched, ...fallbacks]).slice(0, limit)
}

const passageHas = (passage, pattern) => passage.sentences.some((sentence) => pattern.test(sentence.en))

export function readingRulesForPassage(passage, limit = 8) {
  const ids = [...BASE_RULE_IDS]

  if (passage.sentences.length <= 10) ids.push('repair-monitor')
  if (passageHas(passage, /\b(?:say|says|said|argue|claim|suggest|may|might|should|must)\b/i)) ids.push('author-stance')
  if (passage.sentences.length >= 28) ids.push('genre-prediction')
  if (passage.sentences.length >= 20) ids.push('reading-mode')
  if (passageHas(passage, /\b(?:however|but|although|while|yet)\b/i)) ids.push('contrast-concession')
  if (passageHas(passage, /\b(?:because|since|therefore|so|result|lead|led)\b/i)) ids.push('cause-result')
  if (passageHas(passage, /\b(?:than|more|less|as\s+\w+\s+as)\b/i)) ids.push('comparison-pairs')
  if (passageHas(passage, /\b(?:not|never|no|few|little|without)\b/i)) ids.push('negation-scope')
  if (passageHas(passage, /\b(?:who|which|whose|whom|that)\b/i)) ids.push('relative-clause')

  return uniqueRules(ids).slice(0, limit)
}

export function readingRuleForQuestion(question = '') {
  const text = question.toLowerCase()
  if (/^why\b|reason|cause/.test(text)) return READING_RULES_BY_ID['cause-result']
  if (/main|best title|author|suggest|conclusion|purpose/.test(text)) {
    return READING_RULES_BY_ID['author-stance']
  }
  if (/not true|incorrect|cannot be learned|except/.test(text)) {
    return READING_RULES_BY_ID['distractor-strength']
  }
  if (/refer|mean|closest/.test(text)) return READING_RULES_BY_ID['reference-chain']
  if (/compare|difference|more|less/.test(text)) return READING_RULES_BY_ID['comparison-pairs']
  return READING_RULES_BY_ID['evidence-backtrack']
}

export function readingRulesByPhase(phaseId) {
  return READING_RULES.filter((rule) => rule.phase === phaseId)
}

export function getReadingRulePhase(phaseId) {
  return READING_RULE_PHASES.find((phase) => phase.id === phaseId) || READING_RULE_PHASES[0]
}
