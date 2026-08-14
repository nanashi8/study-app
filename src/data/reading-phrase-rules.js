// 全567文で再利用する、英語順の意味・発音フレーズの機械可読な方法台帳。
// confirmed は、本文別監査・回帰監査まで通した現行基準を表す。

const rule = ({ id, status = 'confirmed', appliesTo, example, decision, caution = '' }) =>
  Object.freeze({ id, status, appliesTo, example, decision, caution })

export const READING_PHRASE_RULES = Object.freeze([
  rule({
    id: 'pronounceable-role-unit',
    appliesTo: '全英文',
    example: 'She goes / to school',
    decision: '発音でき、単独で意味を受け取れるまとまりをフレーズ境界にする。SVOCMはフレーズを切る命令ではなく、まとまり内部の構造注釈にする。',
    caution: '一語ずつ、または文法ラベルが変わるたびに機械的に分断しない。助動詞＋本動詞、前置詞＋名詞、短いS＋V、V＋O/Cなどの結び付きを保つ。',
  }),
  rule({
    id: 'subject-verb-role-boundary',
    appliesTo: '主語Sと述語Vを持つ全ての節',
    example: 'She goes = 彼女は行きます; a simpler solution would work = 単純な解決策が機能するだろう',
    decision: '短いS＋Vが一息で一つの出来事を表すときは結合する。長い主語や、後ろにO/Cを取る複雑な述部では、名詞句と述部など意味のよい境界で分ける。',
    caution: 'S＋Vを常に結合する規則でも、常に分ける規則でもない。発音と意味の完成度で本文別に判断する。',
  }),
  rule({
    id: 'copular-s-v-c-boundary',
    appliesTo: 'be動詞・連結動詞のSVC',
    example: 'Rina / is a junior high school student',
    decision: 'be動詞だけを孤立させず、補語Cと合わせて「一人の中学生です」のように意味が完成する述部にする。SVCの役割はフレーズ内に併記する。',
  }),
  rule({
    id: 'object-and-complement-boundary',
    appliesTo: 'SVO・SVOC・SVOO',
    example: 'makes it easier = それを簡単にします; revise the proposal = 提案を修正します',
    decision: '短いV＋O、V＋C、V＋O＋Cは、自然な日本語の述部として一つにする。役割順は内部のSVOCMラベルで示し、対応する日本語を不自然な未完成形へ砕かない。',
  }),
  rule({
    id: 'clause-entry-and-inner-roles',
    appliesTo: 'because/if/when/that等が導く節',
    example: 'because / her teacher / uses many pictures; But when / the Rabbit actually took a watch',
    decision: '節の入口を必要に応じて独立させ、節内は名詞句・述部・短い節など意味のよいまとまりで読む。接続語ごとに理由・条件・時・内容を説明する。',
  }),
  rule({
    id: 'connector-closure-back-reference',
    appliesTo: 'when/while/if/because等を先に訳し、後続フレーズで節の関係を完成すると分かりやすい箇所',
    example: 'But when / the Rabbit actually took a watch = しかし、その時 / ウサギが本当に時計を取り出した（時）',
    decision: '接続の意味を入口で示し、関係が完成する後続フレーズでは必要な語だけを日本語の括弧で受け直す。日本語音声は括弧内も読み、括弧記号そのものは読まない。',
    caution: 'つながりが既に明白な箇所へ機械的に重ねず、英語順で係り先を見失う箇所に限る。',
  }),
  rule({
    id: 'preposition-plus-fused-relative',
    appliesTo: '前置詞＋先行詞を含むwhat',
    example: 'by what / is available; from what / they / once / knew',
    decision: '前置詞＋whatを一単位にし、what節全体が前置詞の目的語であることと、whatが「〜するもの・こと」を含むことを説明する。',
  }),
  rule({
    id: 'preposition-with-object',
    appliesTo: '前置詞＋名詞・代名詞、または前置詞＋wh節',
    example: 'to school / by bus / about which / on whether',
    decision: '同じM内部の前置詞＋名詞は一単位にする。役割境界で前置詞だけを出す場合は、後続の動名詞句・間接疑問全体が目的語だと項目別に明示する。',
  }),
  rule({
    id: 'formal-object-and-end-weight',
    appliesTo: 'make/find/think等の形式目的語it＋C＋長い実質内容',
    example: 'makes it easier / to improve a design',
    decision: 'make O C は「それを簡単にします」という一つの述部で読み、内部にV・O・Cを併記する。itが形式目的語で、長い実質内容を後ろへ送る後重心は説明欄で扱う。普通の代名詞itへ一般化しない。',
  }),
  rule({
    id: 'shared-infinitive-marker',
    appliesTo: 'to V1 or V2 のようなto共有',
    example: 'or / (to) decide that',
    decision: 'decide that を一つの意味フレーズにし、二つ目のtoは構造表示だけ括弧で補う。spokenEnには追加せず、thatがdecideの内容節を導くことを説明する。',
  }),
  rule({
    id: 'back-reference-for-distant-modifier',
    appliesTo: '後置修飾・離れた補語・英語順では未完成になる日本語',
    example: 'of evidence / 証拠の（不足です）',
    decision: '英語を並べ替えず、日本語の括弧で既出の係り先・動詞・補語を短く受け直す。',
  }),
  rule({
    id: 'separate-review-dimensions',
    appliesTo: '区切り・訳・説明・音声・自然訳の確認状態',
    example: 'segmentation / forward-ja / grammar / spoken-source / natural-ja',
    decision: '各確認軸を混同せず、未解決だけをreview-neededにする。本文監査済みの項目を一律確認待ちにも、一律偽confirmedにもしない。',
  }),
  rule({
    id: 'word-limits-by-role',
    appliesTo: '全フレーズ',
    example: 'learner meaning phrase <= 8 words',
    decision: '役割数ではなく一息で理解できるかを優先し、学習者向け意味フレーズは原則8語以内で全件監査する。短くても未完成なら結合し、長くても固定表現を壊す分割はしない。',
  }),
  rule({
    id: 'auxiliary-through-main-verb',
    appliesTo: '助動詞・準助動詞＋本動詞から成る一つのV',
    example: 'cannot find / had to choose / might be left out',
    decision: '一つの述語Vの助動詞と本動詞は結合する。倒置でSを挟む場合や、be＋主格補語の不定詞、別節のV→Vは分断誤りに数えない。',
  }),
  rule({
    id: 'adverb-inside-verb-group',
    appliesTo: '助動詞と本動詞の間に、文全体の論理接続を担う therefore / consequently が入る6述語',
    example: 'have therefore begun; must therefore examine/evaluate; must consequently include; may consequently punish; should therefore be',
    decision: '三語の短い助動詞＋副詞＋本動詞は、述語全体の外側役割をVとして一単位にする。therefore / consequently の論理関係は項目別説明で明示する。',
    caution: 'have begun等の助動詞＋本動詞を分断せず、原文音声も一息で保つための限定判断である。異なる外側役割を一般に混ぜる規則ではなく、語数上限を超える場合は文別に再検討する。is then shaped / is repeatedly presented も同じ基準で一つのVとする。',
  }),
  rule({
    id: 'contextual-special-grammar-cues',
    appliesTo: '関係詞・間接疑問・不定詞・比較・否定焦点・省略・as等',
    example: 'that / why / to judge / than / even / as C',
    decision: '語面辞書ではなく、先行詞・支配語・節内役割・比較相手・否定作用域をこの文に即して短く説明する。',
  }),
  rule({
    id: 'coordination-by-scope',
    appliesTo: 'and/or/but/yet/norによる並列',
    example: 'O and O; V and V; clause, and S V; to V or (to) V',
    decision: '接続詞の直前・直後のroleだけでは決めない。左右のhead、共通の支配語・主語・助動詞・to、その階層で有限動詞が完了しているかを確認し、複合主語・並列述語・並列目的語・並列埋込み内容・独立節を文ごとに確定する。',
  }),
])

export const READING_PHRASE_RULES_BY_ID = Object.freeze(
  Object.fromEntries(READING_PHRASE_RULES.map((item) => [item.id, item])),
)
