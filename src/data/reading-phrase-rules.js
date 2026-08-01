// 全363文で再利用する、英語順フレーズ訳の機械可読な方法台帳。
// confirmed は、本文別監査・回帰監査まで通した現行基準を表す。

const rule = ({ id, status = 'confirmed', appliesTo, example, decision, caution = '' }) =>
  Object.freeze({ id, status, appliesTo, example, decision, caution })

export const READING_PHRASE_RULES = Object.freeze([
  rule({
    id: 'pronounceable-role-unit',
    appliesTo: '全英文',
    example: 'She / goes / to school',
    decision: '発音できる短さを保ちながら、S・V・O・C・M・接続という異なる役割の境界で分ける。',
    caution: '同じ役割の内部では、助動詞＋本動詞、前置詞＋名詞など、意味を作る結び付きを壊さない。',
  }),
  rule({
    id: 'subject-verb-role-boundary',
    appliesTo: '主語Sと述語Vを持つ全ての節',
    example: 'She / goes = 彼女は / 行きます',
    decision: 'Sは「だれが・何が」、Vは「どうする・どんな状態」と役割別に置く。S＋Vを一律に一フレーズへ結合しない。',
  }),
  rule({
    id: 'copular-s-v-c-boundary',
    appliesTo: 'be動詞・連結動詞のSVC',
    example: 'Rina / is / a junior high school student',
    decision: 'S、be動詞V、補語Cを分け、Vでは「状態・内容は次へ」と保留し、Cで意味を完成する。',
  }),
  rule({
    id: 'object-and-complement-boundary',
    appliesTo: 'SVO・SVOC・SVOO',
    example: 'The committee / revised / the proposal',
    decision: 'V、O、Cを役割別にし、前から Vする→Oを→Cに の順で積み上げる。',
  }),
  rule({
    id: 'clause-entry-and-inner-roles',
    appliesTo: 'because/if/when/that等が導く節',
    example: 'because / her teacher / uses / many pictures',
    decision: '節の入口を接続として示し、節内でもS・V・O・C・Mを分ける。接続語ごとに理由・条件・時・内容を説明する。',
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
    example: 'makes / it / easier / to improve ...',
    decision: 'V・O・Cを混ぜず、itの訳は「それを」、形式目的語と後重心の説明は文法欄へ分ける。普通の代名詞itへ一般化しない。',
  }),
  rule({
    id: 'shared-infinitive-marker',
    appliesTo: 'to V1 or V2 のようなto共有',
    example: 'or / (to) decide / that',
    decision: '二つ目のtoは構造表示だけ括弧で補い、spokenEnには追加しない。並列する二つの不定詞内容とthat内容節を別々に説明する。',
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
    example: 'core <= 5 words; M/LINK <= 7 words',
    decision: '高校生が一息で読める上限として、S/V/O/Cは5語、M/接続は7語以内を全件監査する。',
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
