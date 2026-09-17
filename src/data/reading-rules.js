import { EXTENDED_PASSAGE_READING_APPROACHES } from './reading-extended-approaches.js'

// 断定しすぎる「公式」ではなく、実際の本文で再現できる判断手順としてまとめた長文読解ルール。
// origin: core は基本の判断手順、added は長文全体の読み方・根拠確認のためのものを示す。

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
  origin: options.origin || 'core',
  diagram: options.diagram ? Object.freeze(options.diagram) : null,
})

export const READING_RULE_PHASES = freeze([
  Object.freeze({ id: 'orient', step: 1, label: '全体を見通す', icon: '🧭', color: '#0f766e', description: '題名・文章の種類・テーマから、どこに注目して読むかを決める。' }),
  Object.freeze({ id: 'skeleton', step: 2, label: '骨組みをつかむ', icon: '🦴', color: '#2563eb', description: '主節の主語と動詞をつかみ、長い修飾を整理する。' }),
  Object.freeze({ id: 'relation', step: 3, label: '働きを見分ける', icon: '🔗', color: '#7c3aed', description: '節・不定詞・分詞が、文のどこにつながり、どう働くかを確かめる。' }),
  Object.freeze({ id: 'logic', step: 4, label: '論理を追う', icon: '🪧', color: '#c2410c', description: '対比・因果・具体例を手がかりに、段落の流れを読む。' }),
  Object.freeze({ id: 'answer', step: 5, label: '根拠で答える', icon: '🎯', color: '#be123c', description: '設問の言い換えを見抜き、本文の根拠に戻って答える。' }),
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
    '文章の種類に合わせて、注目する点を変える',
    '物語なら人物の気持ちの変化、案内文なら条件、説明文なら仕組み、論説文なら主張と根拠に注目する。',
    '題名、見出し、文章の形式、設問の問い方',
    ['題名と形式から、文章の種類の見当をつける', 'その種類に合う注目点を、二つか三つ決める', '読み進めて予想と違ったら、注目点を切り替える'],
    'A notice lists times, while an opinion essay weighs reasons.',
    '案内文は時刻を並べるが、意見文は理由を比べて検討する。',
    '注目点は一つに決めつけない。本文の展開や設問に合わせて、途中で変えてよい。',
    {
      origin: 'added',
      diagram: {
        type: 'branch',
        nodes: ['物語→人物・気持ちの変化', '案内文→条件・順序', '説明文→仕組み・因果', '論説文→主張・根拠'],
      },
    },
  ),
  makeRule(
    'reading-mode',
    'orient',
    'basic',
    '速く読むところと、じっくり読むところを分ける',
    '背景の説明は大まかにつかみ、対比・結論・設問の根拠になりそうなところではペースを落とす。',
    'however、therefore、設問と同じ内容、段落の最後',
    ['背景の説明は、主語と動詞を押さえて先へ進む', 'howeverなどの接続語が出てきたら、ペースを落とす', '設問の根拠になりそうな文に印を付ける'],
    'The first plan was cheap. However, it was not safe.',
    '最初の案は安上がりだった。しかし、安全ではなかった。',
    '速く読むことは、読み飛ばすことではない。主語・動詞・接続語は必ず押さえる。',
    { origin: 'added', diagram: { type: 'speed', nodes: ['背景：速く', '対比：ゆっくり', '根拠：じっくり'] } },
  ),
  makeRule(
    'paragraph-map',
    'orient',
    'standard',
    '段落ごとの役割を、一言でメモする',
    '各段落を「問題」「調査」「結果」「限界」のような役割の言葉で、一言にまとめる。',
    '段落の最初の文、くり返し出てくる語、段落の最後のまとめ',
    ['段落ごとに、中心になる語を一つ選ぶ', '内容の要約ではなく、役割の名前を付ける', '段落どうしを矢印でつなぎ、流れを見る'],
    'The survey found two problems. The team then changed the design.',
    '調査で二つの問題が見つかり、その後、チームは設計を変えた。',
    '一文ずつ訳すだけでは、段落の役割は見えてこない。メモは十数文字で足りる。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['問題', '調査', '結果', '限界'] } },
  ),
  makeRule(
    'genre-prediction',
    'orient',
    'standard',
    '文章の種類から、次に来る内容を予測する',
    '物語・説明文・論説文によくある流れを手がかりに、次に来そうな内容を予測しながら読む。',
    '時の流れを表す語、調査結果、賛成と反対、提案',
    ['最初の段落から、文章の種類の見当をつける', '物語なら変化、説明文なら仕組み、論説文なら根拠を探しながら読む', '予測が外れたら、新しい予測を立てて読み進める'],
    'Supporters point to one benefit, while critics raise a different concern.',
    '支持者はある利点を挙げ、批判者は別の懸念を示す。',
    '文章の種類は、予測の手がかりにすぎない。本文を無理に型へ当てはめない。',
    { origin: 'added', diagram: { type: 'branch', nodes: ['物語→変化', '説明文→仕組み', '論説文→根拠'] } },
  ),
  makeRule(
    'finite-verb-check',
    'skeleton',
    'basic',
    '文の動詞を見つけて、節の数をつかむ',
    '長い文では、主語と組になる動詞（現在形・過去形・助動詞＋動詞）を探し、節がいくつあるか見当をつける。',
    '現在形・過去形・助動詞＋動詞、接続詞、関係詞',
    ['動詞らしい語に印を付ける', '助動詞と動詞は、一組で一つと数える', '動詞が二つなら、その間をつなぐ接続詞か関係詞が一つあるか確かめる'],
    'Students who use the guide can find safer routes.',
    'そのガイドを使う生徒は、より安全なルートを見つけられる。',
    '動詞に見える語の数だけで、節の数を決めつけない。分詞や不定詞は節を作らず、接続詞や関係詞が省略されることもある。',
    { diagram: { type: 'layers', nodes: ['Students can find safer routes（主節）', 'who use the guide（関係詞節）'] } },
  ),
  makeRule(
    'main-clause-skeleton',
    'skeleton',
    'basic',
    '主節のSとVを先につかむ',
    'that節や関係詞節をいったんかっこに入れ、文全体の主語と動詞を見つける。',
    '文頭の長い句、that、who、which、when',
    ['前置詞句などを除き、最初に出てくる名詞を主語の候補にする', '修飾する節や句を、仮にかっこに入れる', '残った主語と動詞で、意味が通るか確かめる'],
    'The map that the students revised became easier to use.',
    '生徒たちが修正した地図は、使いやすくなった。',
    '主節だけで必要な情報がそろうとは限らない。骨組みをつかんだら、かっこに入れた部分を必ず戻して読む。',
    { diagram: { type: 'layers', nodes: ['The map became easier to use（主節）', 'that the students revised（関係詞節）'] } },
  ),
  makeRule(
    'svoc-core',
    'skeleton',
    'basic',
    'S・V・O・Cで文の中心をつかむ',
    '「誰が（S）」「どうする（V）」「何を（O）」「どんな状態に（C）」の順に、文の中心になる語を当てはめる。',
    '名詞＋動詞、be動詞、make・call・findなど',
    ['最初に、SとVを決める', 'Vの後ろが目的語（O）か補語（C）かを見分ける', '修飾語は、最後に付け足す'],
    'The experiment made the rule clearer.',
    'その実験は、規則をより明確にした。',
    'すべての語をS・V・O・Cに当てはめようとしない。前置詞句や副詞は、修飾語として外に置く。',
    { diagram: { type: 'roles', nodes: ['S：The experiment', 'V：made', 'O：the rule', 'C：clearer'] } },
  ),
  makeRule(
    'noun-boundary',
    'skeleton',
    'basic',
    '冠詞・所有格を目印に、名詞のかたまりをつかむ',
    'a・the・this・theirなどを目印にして、中心の名詞とその前後の修飾を、ひとまとまりにする。',
    'a、an、the、this、these、my、their、数詞',
    ['a・theなどの目印を見つける', 'かたまりの中心になる名詞まで読み進める', '後ろにof句などの修飾が続くか確かめる'],
    'the final plan for the school trip',
    '遠足の最終計画',
    '冠詞のない名詞のかたまりも多い。冠詞は便利な目印だが、いつもあるとは限らない。',
    { diagram: { type: 'bracket', nodes: ['the（目印）', 'final（前の修飾）', 'plan（中心の名詞）', 'for the school trip（後ろの修飾）'] } },
  ),
  makeRule(
    'parallel-shape',
    'skeleton',
    'standard',
    'and・orが結ぶものを、同じ形から見つける',
    'and・or・butの後ろの形を見て、名詞なら名詞、動詞なら動詞というように、前にある同じ形の相手を探す。',
    'and、or、but、both A and B、either A or B',
    ['and・orなどに印を付ける', '直後の語句が、名詞・動詞・句・節のどれか確かめる', '前にさかのぼって、同じ形の相手を探す'],
    'Students measured the route and checked the signs.',
    '生徒たちはルートの長さを測り、標識を確認した。',
    '結ばれる二つの語数は、同じとは限らない。語数ではなく、文法上の形と働きで相手を決める。',
    { diagram: { type: 'balance', nodes: ['measured the route', 'and', 'checked the signs'] } },
  ),
  makeRule(
    'insertion',
    'skeleton',
    'standard',
    '挿入をいったん外して、骨組みを読む',
    '二つのコンマやダッシュに挟まれた補足（同格など）をいったん外し、文の骨組みを先に読む。',
    '二つのコンマ、二つのダッシュ、名詞の直後の言い換え',
    ['補足の始まりと終わりの区切りを確かめる', '挟まれた部分を、仮に外して読む', '骨組みを読んだあとで、補足を戻す'],
    'The guide, a student project, is now used by visitors.',
    '生徒のプロジェクトとして作られたそのガイドは、今では観光客に使われている。',
    'コンマは挿入のほか、語句を並べるときや節を区切るときにも使う。前後の区切りが対になっているか確かめる。',
    { diagram: { type: 'layers', nodes: ['The guide is now used by visitors（骨組み）', 'a student project（補足）'] } },
  ),
  makeRule(
    'punctuation-map',
    'skeleton',
    'standard',
    'コロン・セミコロン・ダッシュを意味の手がかりにする',
    'コロン（:）やダッシュ（—）の後ろには説明や具体例が来やすく、セミコロン（;）は関係の深い二つの文をつなぐ。',
    'コロン（:）、セミコロン（;）、ダッシュ（—）、かっこ',
    ['記号の前で、いったん内容をまとめる', '記号の後ろが、説明・例・対比のどれか確かめる', '接続語があれば、それもあわせて判断する'],
    'The result was clear: fewer messages improved focus.',
    '結果ははっきりしていた。メッセージが減ると、集中力が高まったのだ。',
    '記号だけで前後の関係を決めつけない。最後は前後の内容で判断する。',
    { diagram: { type: 'flow', nodes: ['「:」の前：まとめ', '「:」の後ろ：説明・具体例'] } },
  ),
  makeRule(
    'that-diagnosis',
    'relation',
    'standard',
    'thatの働きを、前後の形で見分ける',
    'thatの直前と後ろの形を見て、名詞節・同格・関係詞節・指示語のどれなのかを見分ける。',
    'that＋文、名詞＋that、that＋名詞',
    ['thatの後ろに、主語と動詞のそろった完全な文があるか見る', '後ろの文に語の欠けがあれば、直前の名詞を説明する関係詞節と考える', 'that自体が「あの・その」の意味で、後ろの名詞にかかっていないか確かめる'],
    'The students learned that translation requires imagination.',
    '生徒たちは、翻訳には想像力が必要だと学んだ。',
    '名詞＋thatでも、後ろが完全な文なら関係詞節ではなく、同格（the fact that ...「…という事実」）のことがある。',
    {
      diagram: {
        type: 'branch',
        nodes: ['that＋完全な文→名詞節「〜ということ」', '名詞＋that＋完全な文→同格「〜という名詞」', '名詞＋that＋語の欠けた文→関係詞節', 'that＋名詞→指示語「あの・その」'],
      },
    },
  ),
  makeRule(
    'wh-clause',
    'relation',
    'standard',
    'what・howなどで始まる節を、一つの名詞として読む',
    'what・how・whyなどで始まる節が文の主語や目的語になっていたら、節全体をひとかたまりの名詞として扱う。',
    'what、how、why、where、whether＋主語＋動詞',
    ['what・howなどから節の終わりまでを［ ］で囲む', '節の中は「主語＋動詞」のふつうの語順で読む', 'その節が、文の主語・目的語・補語のどれか確かめる'],
    'The survey showed what visitors needed.',
    'その調査は、観光客が何を必要としているかを示した。',
    'where節は、「〜する所で」と副詞として働いたり、前の名詞を説明したりすることもある。節が名詞の位置にあるかを必ず確かめる。',
    { diagram: { type: 'bracket', nodes: ['showed', '［what visitors needed］（目的語）'] } },
  ),
  makeRule(
    'relative-clause',
    'relation',
    'standard',
    '関係詞節を、説明している名詞へつなぐ',
    'who・which・thatなどで始まる節を、それが説明している名詞（先行詞）へ矢印でつなぐ。',
    '名詞＋who・which・that・whose・where',
    ['関係詞の直前の名詞を、先行詞の候補にする', '節の中で欠けている語（主語・目的語など）を探す', '「名詞→その説明」の順に意味をつなぐ'],
    'The residents who tested the map found one problem.',
    'その地図を試した住民たちは、問題を一つ見つけた。',
    '先行詞は、直前の一語とは限らない。名詞のかたまり全体のこともあれば、間に前置詞句が入ることもある。',
    { diagram: { type: 'backlink', nodes: ['the residents（先行詞）', 'who tested the map'] } },
  ),
  makeRule(
    'postmodifier',
    'relation',
    'basic',
    '名詞を後ろから説明する語句をつかむ',
    '前置詞句・分詞・不定詞が名詞の後ろに続くときは、まず名詞をつかみ、あとから説明を足す。',
    '名詞＋前置詞、名詞＋-ing形・-ed形、名詞＋to不定詞',
    ['中心になる名詞を、先につかむ', '後ろに続く説明が、どこまでかを探す', '「どんな名詞か」の説明として、名詞につなげる'],
    'a route without dangerous steps',
    '危ない階段のないルート',
    '後ろの句が、名詞ではなく動詞を説明していることもある。どの語につなぐと意味が自然か比べる。',
    { diagram: { type: 'backlink', nodes: ['a route', 'without dangerous steps'] } },
  ),
  makeRule(
    'infinitive-role',
    'relation',
    'standard',
    'to不定詞の働きを、前後から見分ける',
    'to不定詞が「〜すること」「〜するための」「〜するために」のどれに当たるかを、前後の語から判断する。',
    'to＋動詞の原形',
    ['toの直前が名詞か動詞か、文がすでに完成しているかを見る', '「〜するために」と訳して、意味が通るか試す', '文全体で、最も自然な働きを選ぶ'],
    'The class made a guide to help visitors.',
    'クラスは、観光客を手助けするためにガイドを作った。',
    'toを見ただけで「〜するために」と決めない。「〜すること」「〜するための」のほか、look forward to -ingのような前置詞のtoもある。',
    { diagram: { type: 'branch', nodes: ['名詞的用法：〜すること', '形容詞的用法：〜するための', '副詞的用法：〜するために'] } },
  ),
  makeRule(
    'ing-ed-role',
    'relation',
    'standard',
    '-ing形・-ed形の働きを、文の中で見分ける',
    '語尾だけで決めず、進行形・受け身・分詞・分詞構文・動名詞・過去形のどれなのかを、前後の語から見分ける。',
    'be＋-ing、be＋過去分詞、名詞＋-ing・-ed、文頭の-ing、動詞の過去形',
    ['be・haveと組になっていれば、進行形・受け身・完了形と考える', '名詞を説明していれば分詞、主語や目的語なら動名詞と考える', '文頭からコンマまで続けば分詞構文、どれでもなければ過去形か確かめる'],
    'Using the map, families found a safer route.',
    'その地図を使って、家族たちはより安全なルートを見つけた。',
    'morning・evening・need・bedのように、つづりがingやedで終わるだけの語もある。語尾だけで判断しない。',
    {
      diagram: {
        type: 'branch',
        nodes: ['be＋-ing→進行形', 'be＋過去分詞→受け身', 'have＋過去分詞→完了形', '名詞＋-ing・-ed→名詞を説明する分詞', '主語・目的語の-ing→動名詞', '文頭の-ing＋コンマ→分詞構文', '文の動詞の位置の-ed→過去形'],
      },
    },
  ),
  makeRule(
    'passive-active',
    'relation',
    'basic',
    '受け身を、「誰が何をしたか」に言い換える',
    'be＋過去分詞を見たら、「何が〜されたか」と、by以下の「誰がしたか」を分けてつかむ。',
    'be動詞＋過去分詞、by＋動作をする人',
    ['主語が、動作を受ける側だと確かめる', 'by以下を主語にして、「誰が何をしたか」の文に言い換える', 'by以下がなければ、書かれていない理由を考える'],
    'The map was tested by local families.',
    'その地図は、地元の家族たちによって試された。',
    'be＋過去分詞に見えても、be interestedのように状態を表す形容詞のことがある。動作か状態かを文脈で確かめる。',
    { diagram: { type: 'rewrite', nodes: ['The map was tested by local families.', 'Local families tested the map.'] } },
  ),
  makeRule(
    'comparison-pairs',
    'logic',
    'standard',
    '何と何を、どの点で比べているかをつかむ',
    '比較級やthan、as ... asを見たら、比べている二つと、比べる点を書き出す。',
    'more、less、-er、than、as ... as、the＋比較級',
    ['何と何を比べているかを決める', '何の点で比べているかを探す', 'thanの後ろで省略された語句を補う'],
    'The longer route was safer than the shorter one.',
    '長いほうのルートは、短いほうのルートより安全だった。',
    'thanの後ろでは、前と同じ語句が省略されやすい。すぐ隣の語どうしを比べていると思い込まない。',
    { diagram: { type: 'balance', nodes: ['A：長いほうのルート', '比べる点：安全さ', 'B：短いほうのルート'] } },
  ),
  makeRule(
    'negation-scope',
    'logic',
    'standard',
    '否定がどこまでかかるかを見きわめる',
    'not・never・little・withoutなどが、文全体を打ち消すのか、一部だけを打ち消すのかを確かめる。',
    'not、never、no、few、little、hardly、without',
    ['否定語に印を付ける', '何が打ち消されているかを探す', '全体否定か部分否定かを確かめる'],
    'Not every donated item finds a new owner.',
    '寄付された品物のすべてに、新しい持ち主が見つかるわけではない。',
    'not everyは「すべてが〜というわけではない」という部分否定で、「一つもない」ではない。not always・not necessarilyも同じ部分否定になる。',
    { diagram: { type: 'scope', nodes: ['Not', '［every donated item finds a new owner］', '「すべてが〜わけではない」'] } },
  ),
  makeRule(
    'logic-connectors',
    'logic',
    'basic',
    '接続語から、前後の関係を見分ける',
    '接続語を見たら、追加・対比・因果・条件・言い換えのどれに当たるかを考え、前後の内容で確かめる。',
    'also、however、because、therefore、if、unless、in other words',
    ['接続語を丸で囲む', '前の内容を短くまとめる', '後ろが、追加・対比・因果・条件・言い換えのどれか決める'],
    'The route was short; however, it included many steps.',
    'そのルートは短かった。しかし、階段が多かった。',
    '接続語は文頭に来るとは限らず、文の途中にも置かれる。位置ではなく、前後のどの内容をつないでいるかで判断する。',
    { diagram: { type: 'branch', nodes: ['＋追加：also', '↔対比：however', '→因果：because・therefore', '？条件：if・unless', '＝言い換え：in other words'] } },
  ),
  makeRule(
    'contrast-concession',
    'logic',
    'standard',
    '逆接・譲歩では、筆者が重く見る側をつかむ',
    'however・although・whileの前後を比べ、筆者がどちらの内容を重く見ているかを判断する。',
    'however、but、although、even though、while、yet',
    ['前半から、「ふつうはこうなる」という予想を立てる', '後半で、その予想がどうくつがえるかをつかむ', '段落の結論とつながるのは、どちらの側か確かめる'],
    'Although the tool was useful, it could not replace clear teaching.',
    'その道具は役に立ったが、分かりやすい指導の代わりにはならなかった。',
    '後半がいつも筆者の結論とは限らない。続く文や段落の最後まで読んで確かめる。',
    { diagram: { type: 'turn', nodes: ['予想：役に立つ道具', 'しかし', '実際：指導の代わりにはならない'] } },
  ),
  makeRule(
    'cause-result',
    'logic',
    'basic',
    '原因と結果の向きを確かめる',
    'because・so・therefore・lead toを見たら、「原因→結果」の矢印で表す。',
    'because、since、so、therefore、as a result、lead to、because of',
    ['原因にあたる部分を短く囲む', '結果にあたる部分を短く囲む', 'becauseの後ろは原因、soの後ろは結果と、向きを確かめる'],
    'Because the sign was hidden, walkers missed the turn.',
    '標識が隠れていたため、歩行者は曲がり角を見落とした。',
    'sinceには「〜以来」、asには「〜するとき」「〜として」などの意味もある。内容の上で原因と結果になっているか確かめる。',
    { diagram: { type: 'flow', nodes: ['原因：標識が隠れていた', '結果：曲がり角を見落とした'] } },
  ),
  makeRule(
    'example-restatement',
    'logic',
    'standard',
    '具体例から、何の例かをさかのぼって探す',
    'for exampleやsuch asの後ろの具体例が、前に出てきたどの言葉の例なのかを確かめる。',
    'for example、for instance、such as、in other words、that is',
    ['具体例がどこまで続くかを囲む', '前にある、まとめの言葉（抽象的な言葉）を探す', '例をまとめの言葉に置き換えて、主張を確かめる'],
    'The guide added landmarks, such as a red bridge and a stone tower.',
    'ガイドには、赤い橋や石の塔といった目印が加えられた。',
    '例だけを覚えて、主張を読み落とさない。設問では、例がまとめの言葉に言い換えられていることが多い。',
    { diagram: { type: 'example', nodes: ['まとめの言葉：landmarks（目印）', '具体例：a red bridge・a stone tower'] } },
  ),
  makeRule(
    'reference-chain',
    'answer',
    'basic',
    '指示語が指す内容を、数と意味から探す',
    'it・they・this・suchが指す内容を、直前の語だけでなく、前の文の意味のまとまりからも探す。',
    'it、they、this、these、such、the former、the latter',
    ['単数か複数かを合わせる', '候補を当てはめて、意味が通るか読む', 'this＋名詞なら、前の文全体の内容も候補にする'],
    'The team changed the map. This improvement helped families.',
    'チームは地図を変えた。この改善は、家族たちの役に立った。',
    'いちばん近い名詞が、指している内容とは限らない。数と意味の両方が合うものを選ぶ。',
    { origin: 'added', diagram: { type: 'backlink', nodes: ['This improvement', 'changed the map（前の文）'] } },
  ),
  makeRule(
    'unknown-word-context',
    'answer',
    'standard',
    '知らない単語は、品詞・対比・例から意味を絞る',
    '知らない語に出会ったら、文の中での働きと前後の言い換えから、おおよその意味を推測する。',
    '定義、同格、対比、具体例、接頭辞・接尾辞',
    ['まず、知らない語の品詞を決める', '前後から、よい意味か悪い意味かをつかむ', '例や言い換えから、大まかな意味を当てはめる'],
    'The material was durable; it remained useful for many years.',
    'その素材は丈夫で、何年も使い続けられた。',
    '推測で済ませてよいのは、大意をつかむとき。設問の答えを左右する語なら、注や前後の文で意味を確かめる。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['品詞', 'よい意味か悪い意味か', '例・言い換え', '大まかな意味'] } },
  ),
  makeRule(
    'author-stance',
    'answer',
    'advanced',
    '筆者の主張と、ほかの人の意見を分ける',
    'say・claim・may・shouldなどを手がかりに、誰の意見か、どのくらい強く言っているかをつかむ。',
    'supporters say、critics argue、may、must、should、the evidence suggests',
    ['意見ごとに、誰の意見かを書き込む', 'may・should・mustなどから、言い方の強さを見る', '最後の段落で、筆者自身の立場を確かめる'],
    'The evidence suggests that the policy may help, but it is not a complete solution.',
    '証拠からは、その政策が役に立つかもしれないことがうかがえる。ただし、完全な解決策ではない。',
    '本文にない強い言い方に言い換えない。mayとmust、someとallは区別する。',
    { origin: 'added', diagram: { type: 'scale', nodes: ['may：かもしれない', 'should：すべきだ', 'must：しなければならない'] } },
  ),
  makeRule(
    'evidence-backtrack',
    'answer',
    'basic',
    '設問の言葉が、本文でどう言い換えられているかを探す',
    '選択肢を先に読んで決めつけず、設問の中心になる語と同じ意味を表す、本文の箇所を探す。',
    'why、according to、main idea、設問と本文で違う言い方',
    ['設問の主語と動詞に線を引く', '同じ意味の語や言い換えを、本文から探す', '根拠の文と、その前後の一文ずつを読み直す'],
    'Question: Why was the route changed? Text: It included many unsafe steps.',
    '設問：なぜルートは変更されたのか。本文：そのルートには危険な階段が多かった。',
    '同じ単語があるだけでは根拠にならない。主語・因果・否定まで一致しているか確かめる。',
    { origin: 'added', diagram: { type: 'flow', nodes: ['設問の中心語', '本文の言い換え', '根拠の文と前後'] } },
  ),
  makeRule(
    'distractor-strength',
    'answer',
    'standard',
    '選択肢の言いすぎを見抜く',
    '本文のsome・may・oftenが、選択肢でall・must・alwaysに強められていないかを比べる。',
    'all、only、always、never、must、completely',
    ['選択肢で、数や頻度を表す語に丸を付ける', '本文の対応する表現と、強さを比べる', '一部が合っていても、言いすぎなら選択肢から外す'],
    'Text: Some students improved. Choice: Every student improved.',
    '本文：一部の生徒が上達した。選択肢：どの生徒も上達した。',
    '強い語を含む選択肢が、必ず誤りとは限らない。本文が同じ強さで述べていれば正解になる。',
    { origin: 'added', diagram: { type: 'scale', nodes: ['some', 'many', 'most', 'all'] } },
  ),
  makeRule(
    'repair-monitor',
    'answer',
    'basic',
    '話が合わなくなったら、戻って読み直す',
    '読み取った内容が前後と食い違ったら、主語・否定・指示語・接続語の順に見直す。',
    '話が急にひっくり返る、誰の話か分からない、原因と結果が逆に思える、結論と合わない',
    ['おかしいと感じた文で立ち止まる', '主語と否定語を見直す', '指示語と接続語を確かめ、段落のまとめを直す'],
    'If the conclusion does not match the results, check whether you missed a "not."',
    '結論が結果と合わないときは、notを見落としていないか確かめよう。',
    '分からない一語で立ち止まり続けない。段落の大意がつかめていれば、意味を仮に決めて先へ進む。',
    { origin: 'added', diagram: { type: 'loop', nodes: ['読む', 'おかしいと感じる', '四つの点を見直す', 'まとめを直す'] } },
  ),
])

export const READING_RULES_BY_ID = Object.freeze(
  Object.fromEntries(READING_RULES.map((rule) => [rule.id, rule])),
)

const makePassageApproach = (title, summary, steps, ruleIds) => Object.freeze({
  title,
  summary,
  steps: freeze(steps),
  ruleIds: freeze(ruleIds),
})

// 同じ汎用六ルールを全長文へ配るのではなく、38本それぞれの文章形式、
// テーマの論じ方、設問焦点に合わせて「何を追うか」と中核ルールを定める。
export const PASSAGE_READING_APPROACHES = Object.freeze({
  p_5_lost_notebook: makePassageApproach(
    '人物・出来事・転機を時系列で追う',
    '身近な物語では、人物ごとの状況と行動を結びつけ、話が動いたきっかけを確かめる。',
    ['登場人物と、その人物に関わる物・場所を結びつける', 'first・then・afterを手がかりに、出来事を順に並べる', '結末から、人物がそう行動した理由を本文で確かめる'],
    ['genre-prediction', 'svoc-core', 'relative-clause', 'logic-connectors', 'reference-chain', 'evidence-backtrack'],
  ),
  p_4_library_event: makePassageApproach(
    '日時・場所・参加条件を表にして読む',
    '公共施設のお知らせでは、背景の説明よりも先に、参加に必要な日時・場所・条件を整理する。',
    ['日時と場所を組にして抜き出す', '催しの順序と参加条件を分けて書く', '要旨は、それぞれの情報に共通する目的から選ぶ'],
    ['purpose-first', 'noun-boundary', 'postmodifier', 'logic-connectors', 'evidence-backtrack', 'reference-chain'],
  ),
  p_3_school_garden: makePassageApproach(
    '課題・行動・変化を因果で結ぶ',
    '活動報告では、困り事に対して誰が何をし、その結果どう変わったかを段落ごとに追う。',
    ['最初の段落から、課題を一言でまとめる', '担い手ごとに、行動を分けて並べる', '結果と学んだことを、原因と矢印で結ぶ'],
    ['paragraph-map', 'main-clause-skeleton', 'ing-ed-role', 'cause-result', 'evidence-backtrack', 'repair-monitor'],
  ),
  p_pre2_museum_volunteers: makePassageApproach(
    '具体例を「誰にとってのどんな利点か」にまとめる',
    '活動を紹介する説明文では、仕事を並べて終わりにせず、その利点を受ける相手ごとにまとめ直す。',
    ['仕事の具体例と、担当する人を拾い出す', '利点を、受け取る相手ごとに分けて整理する', '例をまとめて、本文全体の要旨をつかむ'],
    ['paragraph-map', 'parallel-shape', 'relative-clause', 'example-restatement', 'evidence-backtrack', 'unknown-word-context'],
  ),
  p_pre2plus_repair_cafes: makePassageApproach(
    '仕組み・効果・限界を分けて整理する',
    '持続可能性を扱う説明文では、活動の仕組み、確かめられた効果、地域だけでは解決できない限界を混ぜずに読む。',
    ['活動の手順と担い手を整理する', '効果を、本文の具体例で確かめる', 'butの後ろの限界から、結論がどこまで言えるかを決める'],
    ['genre-prediction', 'finite-verb-check', 'passive-active', 'contrast-concession', 'author-stance', 'evidence-backtrack'],
  ),
  p_2_quiet_technology: makePassageApproach(
    '技術ごとに、働き・利点・懸念をそろえて比べる',
    '技術を扱う論説文では、便利さの例だけを拾わず、それぞれの技術が誰の役に立ち、どんな懸念や条件を伴うかを比べる。',
    ['具体例ごとに、その技術の働きを短く書く', '同じ技術の利点と懸念を、並べて書く', '最後の提案が、どのくらい強い言い方か確かめる'],
    ['reading-mode', 'punctuation-map', 'that-diagnosis', 'contrast-concession', 'author-stance', 'distractor-strength'],
  ),
  p_pre1_resilient_cities: makePassageApproach(
    '気候対策を効果・費用・公平性で比較する',
    '都市政策の論説文では、一つの対策を万能と考えず、地域の条件や負担の分け方まで含めて、条件つきの結論を読み取る。',
    ['対策ごとの効果と条件を並べる', '誰が利益を得て、誰が負担を負うかを追う', '比べる基準から、結論が成り立つ条件を確かめる'],
    ['paragraph-map', 'parallel-shape', 'wh-clause', 'comparison-pairs', 'author-stance', 'distractor-strength'],
  ),
  p_1_collective_memory: makePassageApproach(
    '抽象概念を制度・事例・反論で具体化する',
    '評論文では、中心となる概念の定義を先に押さえ、制度の例・異論・筆者の応答がその定義をどう深めるかを追う。',
    ['中心となる概念の言い換えを集める', 'ほかの人の見解と、筆者の応答を分ける', '最後の段落で、主張がどこまで言えるかをまとめ直す'],
    ['reading-mode', 'main-clause-skeleton', 'that-diagnosis', 'contrast-concession', 'author-stance', 'unknown-word-context'],
  ),
  p_5_school_open_day: makePassageApproach(
    '案内文から「時刻・場所・持ち物」を探し出す',
    '行事の案内文は、最初から全文を訳すより、設問が求める予定や持ち物を表のように整理して読む。',
    ['時刻と場所を一組にして、表にまとめる', '持ち物と、することを分けて書く', '設問の人物に必要な情報だけを、本文で確かめる'],
    ['purpose-first', 'noun-boundary', 'infinitive-role', 'logic-connectors', 'evidence-backtrack', 'repair-monitor'],
  ),
  p_4_bicycle_safety: makePassageApproach(
    '安全の指示と、その理由・結果を一組にする',
    '告知文では、命令や助言を覚えるだけでなく、なぜ必要なのか、守ると何が変わるのかと結びつけて読む。',
    ['指示の内容を、命令文の動詞から拾う', '指示ごとに、理由と結果を探す', '必要な情報を、設問の場面に当てはめる'],
    ['purpose-first', 'finite-verb-check', 'infinitive-role', 'cause-result', 'evidence-backtrack', 'reference-chain'],
  ),
  p_3_lunch_food_waste: makePassageApproach(
    '取り組みの前と後で、数値と行動を比べる',
    '課題の解決を扱う説明文では、取り組みの順序と比べる条件をそろえ、数字が示す変化を読み取る。',
    ['取り組む前の課題と、もとの数値を確かめる', '変えた行動を、順番に並べる', '同じ条件の数値を比べて、解決策を評価する'],
    ['paragraph-map', 'parallel-shape', 'passive-active', 'comparison-pairs', 'evidence-backtrack', 'distractor-strength'],
  ),
  p_pre2_later_school_start: makePassageApproach(
    '賛成の根拠・反対意見・筆者の結論を分ける',
    '教育制度の論説文では、利点だけでなく、反対する側が挙げる課題とそれへの応答も追い、筆者の結論を強めすぎずに読む。',
    ['提案に賛成する根拠を集める', '反対意見と、それへの応答を対にする', '最後の結論が、提案か断定かを確かめる'],
    ['genre-prediction', 'main-clause-skeleton', 'that-diagnosis', 'contrast-concession', 'author-stance', 'evidence-backtrack'],
  ),
  p_pre2plus_city_bird_count: makePassageApproach(
    '調査方法・得られるデータ・限界を区別する',
    '市民科学の記事では、参加人数の多さをそのまま信頼性と見なさず、数え方と偏りへの対策を読む。',
    ['誰が、何を、どう数えるかを整理する', 'データから言えることを確かめる', '限界と改善策から、データで言える範囲を決める'],
    ['paragraph-map', 'punctuation-map', 'passive-active', 'cause-result', 'unknown-word-context', 'distractor-strength'],
  ),
  p_2_online_health_claims: makePassageApproach(
    '情報源・証拠・因果の三点を順に疑う',
    '健康情報の記事では、結論をすぐに信じず、誰が述べたのか、どんな証拠があるのか、相関を因果と取り違えていないかを点検する。',
    ['発信した人と、もとの情報源を探す', '比べる条件と、足りない証拠を確かめる', 'mayをmustに強めた選択肢を外す'],
    ['reading-mode', 'finite-verb-check', 'wh-clause', 'cause-result', 'author-stance', 'distractor-strength'],
  ),
  p_pre1_cashless_inclusion: makePassageApproach(
    '便利さと排除を、利用者別に比較する',
    '金融技術の論説文では、平均的な効率だけでなく、利用しにくい人の具体例と制度上の条件を追う。',
    ['便利になる利用者と場面を整理する', '取り残される利用者と、その理由を結びつける', '便利さと公平さを両立させる条件を、結論から抜き出す'],
    ['genre-prediction', 'parallel-shape', 'relative-clause', 'contrast-concession', 'author-stance', 'reference-chain'],
  ),
  p_1_metric_fixation: makePassageApproach(
    '指標の目的・副作用・修正案を結びつけて読む',
    '評価指標の評論では、測りやすい数字と本来の目的を分け、具体例が示す副作用と制度設計を読む。',
    ['中心となる概念を、具体例に当てはめて理解する', '数字そのものを目標にしたときの副作用を追う', '反論を受けて出された修正案の限界を確かめる'],
    ['reading-mode', 'main-clause-skeleton', 'that-diagnosis', 'example-restatement', 'author-stance', 'unknown-word-context'],
  ),
  p_5_weather_field_trip: makePassageApproach(
    '天気による二つの予定を読み分ける',
    '予定が変わる場合の案内では、二つの予定を混ぜず、ifの条件・時刻・持ち物をそれぞれの予定に結びつける。',
    ['条件ごとの予定を、別々の列に書き分ける', '時刻と持ち物を、正しい列に書き込む', 'ifの条件から、実際にとる行動を選ぶ'],
    ['purpose-first', 'finite-verb-check', 'infinitive-role', 'logic-connectors', 'evidence-backtrack', 'repair-monitor'],
  ),
  p_4_emergency_map: makePassageApproach(
    '危険箇所・地図の改善・使う人を結ぶ',
    '防災の活動報告では、現地で見つけた問題が地図のどの改善につながり、誰を助けるかを追う。',
    ['危険箇所と、問題が起きた原因を拾う', '地図に加えた情報を、見つけた問題と結びつける', '改善が利用者にどう役立つか確かめる'],
    ['paragraph-map', 'svoc-core', 'postmodifier', 'cause-result', 'reference-chain', 'evidence-backtrack'],
  ),
  p_3_multilingual_town_guide: makePassageApproach(
    '調査・試作・利用者テストを重ねる改善の流れを追う',
    '地域づくりの活動報告では、作り手の意図だけでなく、旅行者の困り事がどの修正に生かされたかを読む。',
    ['活動を、調査・試作・テストに分けて整理する', '利用者の声と修正点を対にする', '最後に書かれた学びを、具体的な変更点と結びつける'],
    ['paragraph-map', 'parallel-shape', 'wh-clause', 'cause-result', 'reference-chain', 'evidence-backtrack'],
  ),
  p_pre2_phone_free_focus: makePassageApproach(
    '実験群・比較群・例外を混ぜずに読む',
    '学校での実験を扱う論説文では、比べる条件をそろえ、わずかな差を大げさに受け取らず、例外を受けて出された修正案まで追う。',
    ['二つのグループの条件をそろえる', '結果の差と、実験の限界を分ける', '例外を受けて、規則がどう変わったかを読む'],
    ['reading-mode', 'punctuation-map', 'passive-active', 'comparison-pairs', 'distractor-strength', 'author-stance'],
  ),
  p_pre2plus_clothing_second_life: makePassageApproach(
    '再利用案を、効果の測り方と限界まで読む',
    '衣料の廃棄を扱う説明文では、交換した数だけで成功と判断せず、実際に着られたか、処理しきれなかった衣料はないか、受け取る人の尊厳に配慮したかまで確かめる。',
    ['交換・修理・再利用の例を分類する', '成功を測る指標を確かめる', '地域の活動の限界と、企業の責任を分ける'],
    ['paragraph-map', 'finite-verb-check', 'relative-clause', 'contrast-concession', 'example-restatement', 'author-stance'],
  ),
  p_2_vertical_farming: makePassageApproach(
    '利点と制約を、地域条件ごとに比較する',
    '農業技術の論説文では、水や輸送の利点だけでなく、電力・作物・費用の条件で評価が変わる点を読む。',
    ['利点と制約を、同じ基準で並べる', '地域・電力・作物ごとの条件を書き添える', '「すべてを置き換えるわけではない」という筆者の提案を確かめる'],
    ['genre-prediction', 'parallel-shape', 'relative-clause', 'comparison-pairs', 'author-stance', 'distractor-strength'],
  ),
  p_pre1_dark_sky_policy: makePassageApproach(
    '環境・安全・経済の利害を立場ごとに整理する',
    '環境政策の論説文では、どちらか一方だけを正しいと決めつけず、利害関係者の反論と段階的な政策案を追う。',
    ['立場ごとの利益と懸念を分ける', '反論と、それに対する応答を結びつける', '段階的な政策の条件と、評価のしかたを確かめる'],
    ['reading-mode', 'insertion', 'wh-clause', 'contrast-concession', 'author-stance', 'evidence-backtrack'],
  ),
  p_1_choice_architecture: makePassageApproach(
    '行動への効果と、倫理的な条件を分けて読む',
    '行動科学の評論では、仕組みの効果だけでなく、透明性・断りやすさ・異議を唱える機会といった倫理的な条件まで読む。',
    ['抽象的な概念を、具体例で押さえる', '効果への反論と、倫理への反論を分ける', '許される介入の条件を、最後の段落で確かめる'],
    ['genre-prediction', 'punctuation-map', 'that-diagnosis', 'negation-scope', 'author-stance', 'unknown-word-context'],
  ),
  p_5_hot_summer_school: makePassageApproach(
    '暑さ対策の道具と、その働きを対にして読む',
    '身近な時事を扱う説明文では、取り入れた物や場所と、それが何の役に立つのかを一組にして確かめる。',
    ['取り入れた物と、その働きを対にする', '比較級とifの条件を、分けて読む', '最後の評価を、本文に書かれた工夫と結びつける'],
    ['purpose-first', 'svoc-core', 'infinitive-role', 'cause-result', 'evidence-backtrack', 'reference-chain'],
  ),
  p_4_school_solar_roof: makePassageApproach(
    '数値の上下を原因の候補と突き合わせる',
    '設備の説明文では、数値が動いた時期を、思い込みではなく本文が挙げる原因と結びつける。',
    ['設備の目的と、発電する量を分けて押さえる', '数値が下がった時期と原因を結ぶ', '限界を述べる段落で、主張の範囲を決める'],
    ['purpose-first', 'main-clause-skeleton', 'postmodifier', 'cause-result', 'reference-chain', 'repair-monitor'],
  ),
  p_3_ai_class_rules: makePassageApproach(
    '賛否と実験結果からルールの根拠をたどる',
    '新技術の報告文では、誰の意見か、何が確かめられたか、その結果どの規則ができたかを分けて読む。',
    ['賛成と心配の意見を、人ごとに分ける', '実験で分かったことだけを抜き出す', '規則の各項目を、実験結果と結びつける'],
    ['genre-prediction', 'noun-boundary', 'that-diagnosis', 'logic-connectors', 'evidence-backtrack', 'unknown-word-context'],
  ),
  p_pre2_crowded_town_tourism: makePassageApproach(
    '利点と負担を住民と来訪者で分けて読む',
    '地域の時事記事では、同じ変化が誰に利益をもたらし、誰に負担を残すのかを立場ごとに整理する。',
    ['歓迎した理由と困った理由を並べる', '調査の数値と対策を結びつける', '意見が分かれたままの点を、最後の段落で確かめる'],
    ['paragraph-map', 'insertion', 'relative-clause', 'comparison-pairs', 'author-stance', 'reference-chain'],
  ),
  p_pre2plus_rural_bus_future: makePassageApproach(
    '調査結果から設計へ進む流れを追う',
    '地域交通の説明文では、困り事を並べて終わりにせず、調査で分かった事実がどの仕組みを生んだかを追う。',
    ['原因が重なっている点を先にまとめる', '調査で分かった移動の特徴を抜き出す', '二つの試みを費用と課題で比べる'],
    ['genre-prediction', 'punctuation-map', 'wh-clause', 'cause-result', 'example-restatement', 'distractor-strength'],
  ),
  p_2_space_debris: makePassageApproach(
    '連鎖する因果と共有資源の問題を分ける',
    '科学の論説文では、技術的にできることと、誰も単独では解決できない仕組みの問題を混ぜずに読む。',
    ['衝突が次の衝突を生む流れを図にする', '提案ごとに効果と限界を書き分ける', '技術と政治のどちらの話かを見分ける'],
    ['reading-mode', 'parallel-shape', 'postmodifier', 'negation-scope', 'author-stance', 'evidence-backtrack'],
  ),
  p_pre1_ai_and_work: makePassageApproach(
    '職業ではなく作業の単位で変化を測る',
    '労働の論説文では、職業が消えるかどうかではなく、どの作業が置き換わり、利益が誰に届くかを追う。',
    ['職業と作業の違いを、先に押さえる', '歴史的な例と但し書きを対にする', '利益の分け方を決める要因を、最後の段落で確かめる'],
    ['paragraph-map', 'main-clause-skeleton', 'passive-active', 'contrast-concession', 'unknown-word-context', 'distractor-strength'],
  ),
  p_1_synthetic_media_trust: makePassageApproach(
    '対策ごとに効果・副作用・負担を並べる',
    '評論文では、対策を良し悪しで裁かず、それぞれが何を守り、何を新たに壊すのかを同じ表で比べる。',
    ['中心となる概念の定義と、その範囲を先に押さえる', '対策ごとに効果と副作用を対にする', '負担を負う側が誰かを最後に確かめる'],
    ['reading-mode', 'insertion', 'that-diagnosis', 'comparison-pairs', 'author-stance', 'repair-monitor'],
  ),
  p_pre2_pond_comeback: makePassageApproach(
    '原因の候補を一つずつ消して、本当の原因を絞り込む',
    '自然環境の報告文では、見た目の悪さと本当の原因を分け、記録が原因をどう絞ったかを追う。',
    ['調べた項目と結果を対にする', '除外された原因の根拠を確かめる', '対策が効いた証拠を、数値で確かめる'],
    ['purpose-first', 'main-clause-skeleton', 'that-diagnosis', 'cause-result', 'evidence-backtrack', 'reference-chain'],
  ),
  p_pre2_morning_market: makePassageApproach(
    '見えている良さと、見えない負担を並べて読む',
    '地域の産業を扱う説明文では、うまくいっている面と、誰かが負っている手間や費用を同じ表に並べる。',
    ['朝市が続いている理由を、買い手の側からつかむ', '決まりと点検の手順を順に並べる', '費用を誰が負っているかを、結論と結びつける'],
    ['paragraph-map', 'noun-boundary', 'that-diagnosis', 'cause-result', 'comparison-pairs', 'evidence-backtrack'],
  ),
  p_2_injury_free_practice: makePassageApproach(
    '体の要因と、申告しやすさの要因を分けて読む',
    '部活動を扱う報告文では、体に起きたことと、人が申告できるかどうかという別々の要因を混ぜずに追う。',
    ['記録から見えた要因を順に並べる', '仕組みの説明を、体に起きることと結びつける', '制度の変更と数値の変化を結ぶ'],
    ['paragraph-map', 'main-clause-skeleton', 'relative-clause', 'cause-result', 'author-stance', 'distractor-strength'],
  ),
  p_2_factory_museum: makePassageApproach(
    '二つの案を費用・収入・残るものの三点で比べる',
    '保存をめぐる論説文では、どちらが正しいかを急いで決めず、案ごとの費用と収入、そして残る価値を同じ枠で比べる。',
    ['最初の方針と反対の動きを分ける', '案ごとに費用と収入を対にする', '成果と残る課題を、最後の段落で確かめる'],
    ['genre-prediction', 'insertion', 'that-diagnosis', 'contrast-concession', 'author-stance', 'evidence-backtrack'],
  ),
  p_pre2_school_radio: makePassageApproach(
    '聞き手の指摘と、変えた点を一つずつ結ぶ',
    '校内活動の報告文では、指摘された弱点の一つ一つに、実際に変えた手順のどれが対応しているかを確かめる。',
    ['調べて分かった不満を、先に押さえる', '変更点を、指摘の一つ一つと結びつける', '新しい役割と、最後の主張を結びつける'],
    ['purpose-first', 'svoc-core', 'infinitive-role', 'logic-connectors', 'example-restatement', 'evidence-backtrack'],
  ),
  p_2_disaster_translators: makePassageApproach(
    '届いたことと、伝わったことを分けて読む',
    '防災を扱う論説文では、情報が届いた事実と、意味が伝わった事実を同じものとして扱わずに追う。',
    ['伝わらなかった原因を、言葉の面から探す', '対策を、導入した順に並べる', '残る限界と結論を結びつける'],
    ['reading-mode', 'noun-boundary', 'relative-clause', 'cause-result', 'negation-scope', 'author-stance'],
  ),
})

export function readingApproachForPassage(passage) {
  return PASSAGE_READING_APPROACHES[passage?.id] ||
    EXTENDED_PASSAGE_READING_APPROACHES[passage?.id] ||
    null
}

const FALLBACK_PASSAGE_RULE_IDS = freeze([
  'genre-prediction',
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

// 構造台帳がある文は、語の字面ではなく、その文に実際にある節・句・役割から選ぶ。
// 例: to school の to では「to doの役割」を出さず、that が接続詞なら関係詞のルールを出さない。
const PASSIVE_PARTICIPLE = /\b(?:am|is|are|was|were|be|been|being)\s+(?:\w+ly\s+|not\s+|also\s+|still\s+|often\s+|always\s+|never\s+|already\s+|now\s+)?(?:\w+ed|\w+en|made|built|taught|known|found|held|kept|told|given|shown|seen|done|brought|bought|thought|caught|sold|sent|spent|left|lost|paid|put|read|set|shut|cut|hurt|let|run|won|written|spoken|chosen|broken|taken|driven|drawn|grown|thrown|worn|torn|born|hidden|forgotten|understood|met|led|fed|heard|meant|felt|built|laid|said|struck|hung|spread|split|cast|cost|bound|wound|ground|sought|taught|dealt)\b/i

function structureElementsOf(nodes, output = []) {
  for (const node of nodes) {
    if (node.kind === 'element') output.push(node)
    if (node.children) structureElementsOf(node.children, output)
  }
  return output
}

function structureNodeText(node) {
  if (node.kind === 'text') return node.text
  return node.children.map(structureNodeText).join('')
}

function structureRuleIds(sentence, structure) {
  const text = sentence?.en || ''
  const lower = text.toLowerCase()
  const unitBases = new Set(structure.units.map((unit) => unit.base))
  const unitDetails = structure.units.map((unit) => `${unit.base}:${unit.detail}`)
  const elements = structureElementsOf(structure.root)
  const elementText = (element) => structureNodeText(element).replace(/\s+/g, ' ').trim()
  const links = elements.filter((element) => element.role === '接').map((element) => elementText(element).toLowerCase())
  const verbs = elements.filter((element) => element.role === 'V').map((element) => elementText(element).toLowerCase())
  const modifiers = elements.filter((element) => element.role === 'M').map(elementText)
  const has = (pattern) => pattern.test(lower)
  const ids = []
  if (has(/\b(?:not|never|no|nor|none|nothing|nobody|neither|few|little|hardly|seldom|rarely|without|cannot)\b|n't\b/)) ids.push('negation-scope')
  if (
    links.some((link) => /^(?:but|yet)$/.test(link)) ||
    unitDetails.some((detail) => /^副詞節:(?:譲歩|対比)$/.test(detail)) ||
    has(/\b(?:however|nevertheless|nonetheless|on the other hand|in contrast|by contrast|instead|whereas)\b/)
  ) ids.push('contrast-concession')
  if (
    unitDetails.some((detail) => /^副詞節:(?:理由|結果)$/.test(detail)) ||
    links.some((link) => /^(?:so|for)$/.test(link)) ||
    has(/\b(?:therefore|thus|consequently|as a result|because of|due to|lead to|leads to|led to|leading to|result in|results in|resulted in|cause|causes|caused)\b/)
  ) ids.push('cause-result')
  if (has(/\b(?:for example|for instance|such as|in other words|that is,)/)) ids.push('example-restatement')
  if (
    !ids.includes('contrast-concession') &&
    !ids.includes('cause-result') &&
    has(/\b(?:also|if|unless|in addition|moreover|furthermore|besides)\b/)
  ) ids.push('logic-connectors')
  if (has(/\bthan\b|\bas\s+(?:\w+\s+){1,3}as\b|\b(?:more|less|fewer)\b/)) ids.push('comparison-pairs')
  if (has(/\bthat\b/)) ids.push('that-diagnosis')
  if (['疑問詞節', 'whether節', 'if節', 'what節', '疑問詞to'].some((base) => unitBases.has(base))) ids.push('wh-clause')
  if (['関係', '関係,', '関係省略'].some((base) => unitBases.has(base))) ids.push('relative-clause')
  if (verbs.some((verb) => PASSIVE_PARTICIPLE.test(verb))) ids.push('passive-active')
  if (unitBases.has('to') || unitBases.has('疑問詞to')) ids.push('infinitive-role')
  if (['動名詞', '現在分詞', '過去分詞', '分詞構文'].some((base) => unitBases.has(base))) ids.push('ing-ed-role')
  if (/[:;—]/.test(text)) ids.push('punctuation-map')
  if (
    ['挿入', '同格', '関係,'].some((base) => unitBases.has(base)) ||
    modifiers.some((modifier) => text.includes(`, ${modifier.replace(/,$/, '')},`))
  ) ids.push('insertion')
  if (links.some((link) => /^(?:and|or|nor|both|either|neither)$/.test(link)) || has(/\b(?:and|or)\b/)) ids.push('parallel-shape')
  // 発言・主張の動詞が内容節を目的語に取るときと、may / might で確信の強さを示すときだけ。
  const reportsContent = structure.units.some((unit) =>
    ['that節', 'that省略', '疑問詞節', 'whether節', 'if節'].includes(unit.base) &&
    unit.containerRole === 'O' &&
    /\b(?:say|says|said|argue|argues|argued|claim|claims|claimed|suggest|suggests|suggested|believe|believes|believed|insist|insists|insisted|warn|warns|warned|doubt|doubts|doubted|admit|admits|admitted|report|reports|reported|point out|points out|pointed out)\b/.test(
      verbs.join(' '),
    ))
  if (reportsContent || verbs.some((verb) => /\b(?:may|might)\b/.test(verb))) ids.push('author-stance')
  if (['現在分詞', '過去分詞'].some((base) => unitBases.has(base)) || structure.units.some((unit) => unit.base === 'to' && unit.usage === '形容詞')) ids.push('postmodifier')
  if (structure.units.some((unit) => unit.clause)) ids.push('main-clause-skeleton')
  return ids
}

export function readingRulesForSentence(sentence, limit = 3, structure = null) {
  if (structure) {
    const matched = structureRuleIds(sentence, structure)
    const fallbacks = [
      'main-clause-skeleton',
      sentence?.paragraphStart ? 'paragraph-map' : 'svoc-core',
      'repair-monitor',
    ]
    return uniqueRules([...matched, ...fallbacks]).slice(0, limit)
  }
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

const passageHas = (passage, pattern) => (passage?.sentences || [])
  .some((sentence) => pattern.test(sentence.en))

export function readingRulesForPassage(passage, limit = 8) {
  const approach = readingApproachForPassage(passage)
  const ids = [...(approach?.ruleIds || FALLBACK_PASSAGE_RULE_IDS)]

  if (passage?.sentences?.length <= 10) ids.push('repair-monitor')
  if (passageHas(passage, /\b(?:say|says|said|argue|claim|suggest|may|might|should|must)\b/i)) ids.push('author-stance')
  if (passage?.sentences?.length >= 28) ids.push('genre-prediction')
  if (passage?.sentences?.length >= 20) ids.push('reading-mode')
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
