// 全363文へ適用するSVOCM役割境界の、機械可読な回帰例。
// ここにある12文だけを「対応済み」と数えるのではなく、全件監査の基準例として使う。
// displayEn / structureEn に補う (to) などは構造表示専用で、spokenEn には入れない。

const ROLE_GRAMMAR = Object.freeze({
  S: 'S（主語）として「だれが・何が」を示し、日本語では「〜は／〜が」と前から置きます。',
  V: 'V（動詞）として「どうする・どんな状態か」を示し、目的語・補語が後ろなら意味を保留します。',
  O: 'O（目的語）として「何を・だれを」を示し、日本語では原則「〜を」と置きます。',
  C: 'C（補語）として、主語または目的語が何か・どんな状態かを示します。',
  M: 'M（修飾語）として、時・場所・方法・程度・理由などを前から足します。',
  LINK: '節・並列・比較の関係を示す入口です。何と何を結ぶかはこの文の説明で確定します。',
})

const phrase = (
  en,
  role,
  ja,
  grammar = ROLE_GRAMMAR[role],
  structureEn = '',
  options = {},
) =>
  Object.freeze({
    en,
    spokenEn: en,
    displayEn: structureEn || en,
    structureEn,
    role,
    ja,
    grammar,
    ...(options.closureBinding
      ? { closureBinding: Object.freeze({ ...options.closureBinding }) }
      : {}),
    pattern: role,
    status: 'confirmed',
  })

const guide = (id, sentence, note, phrases) => Object.freeze({
  id,
  sentence,
  note,
  phrases: Object.freeze(phrases),
  status: 'confirmed',
  purpose: 'whole-corpus-regression-example',
})

const guides = [
  guide(
    'svocm-basic-motion',
    'She goes to school by bus every morning.',
    '役割境界を優先し、Sが→Vする→行き先M→手段M→時Mの順で追います。',
    [
      phrase('She', 'S', '彼女は'),
      phrase('goes', 'V', '行きます'),
      phrase('to school', 'M', '学校へ'),
      phrase('by bus', 'M', 'バスで'),
      phrase('every morning', 'M', '毎朝'),
    ],
  ),
  guide(
    'svocm-basic-svc',
    'Rina is a junior high school student.',
    'SとVを分け、be動詞で補語Cを保留します。',
    [
      phrase('Rina', 'S', 'リナは'),
      phrase('is', 'V', '〜です（内容は次へ）', 'be動詞Vは補語Cを後ろに待つため、「〜です」と仮置きします。'),
      phrase('a junior high school student', 'C', '一人の中学生'),
    ],
  ),
  guide(
    'svocm-svo-because',
    'She likes English because her teacher uses many pictures.',
    '主節も理由節もS→V→Oを役割ごとに分け、becauseは理由節の入口にします。',
    [
      phrase('She', 'S', '彼女は'),
      phrase('likes', 'V', '好きです'),
      phrase('English', 'O', '英語が', 'English は likes の対象Oです。日本語の「英語が好き」に合わせた格は説明で明示します。'),
      phrase('because', 'LINK', 'なぜなら', 'because は理由節の入口で、後ろの her teacher→uses→many pictures 全体を理由として結びます。'),
      phrase('her teacher', 'S', '先生が'),
      phrase('uses', 'V', '使います（対象は次へ）'),
      phrase(
        'many pictures',
        'O',
        'たくさんの絵を使うからです',
        'uses の対象Oを置き、because が導く理由節全体をここで完成します。',
        '',
        {
          closureBinding: {
            type: 'reason-clause',
            opener: 'because',
            governor: 'likes English',
            clause: 'her teacher uses many pictures',
          },
        },
      ),
    ],
  ),
  guide(
    'svocm-time-svo',
    'On Monday, she has English, music, and science classes.',
    '時M→S→V→並列Oの順で追います。',
    [
      phrase('On Monday', 'M', '月曜日に'),
      phrase('she', 'S', '彼女は'),
      phrase('has', 'V', '受けます', '授業予定の文脈なので has を「受けます」とし、対象Oを後ろへ保留します。'),
      phrase('English, music, and science classes', 'O', '英語・音楽・理科の授業を', '三教科は一つのO内で並列され、classes が全体の中心です。'),
    ],
  ),
  guide(
    'svocm-modal-verb',
    'After lunch, Rina cannot find her blue notebook.',
    'Sとは分けますが、助動詞cannotと本動詞findは一つのV内部として保ちます。',
    [
      phrase('After lunch', 'M', '昼食のあとに'),
      phrase('Rina', 'S', 'リナは'),
      phrase('cannot find', 'V', '見つけられません', 'cannot＋find はV内部の助動詞＋本動詞なので分断しません。'),
      phrase('her blue notebook', 'O', '彼女の青いノートを'),
    ],
  ),
  guide(
    'svocm-location-companion',
    'Her friend Ken looks under the desks with her.',
    'S→Vのあと、場所Mと同伴Mを順に足します。',
    [
      phrase('Her friend Ken', 'S', '友達のケンは'),
      phrase('looks', 'V', '探します'),
      phrase('under the desks', 'M', '机の下を', 'looks under ... が「〜の下を探す」となる場所Mです。'),
      phrase('with her', 'M', '彼女と一緒に'),
    ],
  ),
  guide(
    'svocm-discourse-time',
    'Then Ken sees the notebook near the classroom door.',
    '談話M→S→V→O→場所Mの順で追います。',
    [
      phrase('Then', 'M', 'それから'),
      phrase('Ken', 'S', 'ケンは'),
      phrase('sees', 'V', '見つけます'),
      phrase('the notebook', 'O', 'そのノートを'),
      phrase('near the classroom door', 'M', '教室のドアの近くで'),
    ],
  ),
  guide(
    'svocm-lexical-have',
    'Green Town Library has a special event on the first Saturday of every month.',
    '施設S→has V→催しO→開催日Mとし、存在構文への自然な言い換えは最後の自然訳に分けます。',
    [
      phrase('Green Town Library', 'S', 'グリーンタウン図書館は'),
      phrase('has', 'V', '開催します', '催しの文脈で has を「開催します」と前から取り、目的語を次へ待ちます。'),
      phrase('a special event', 'O', '特別な催しを'),
      phrase('on the first Saturday of every month', 'M', '毎月の第1土曜日に'),
    ],
  ),
  guide(
    'svocm-topic-svc',
    'This month, the topic is local history.',
    '時M→S→V→Cを分離します。',
    [
      phrase('This month', 'M', '今月は'),
      phrase('the topic', 'S', 'テーマは'),
      phrase('is', 'V', '〜です'),
      phrase('local history', 'C', '地域の歴史'),
    ],
  ),
  guide(
    'formal-object-shared-infinitive',
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.',
    'make O C、形式目的語it、共有to、内容節thatを役割境界のまま追います。',
    [
      phrase('This evidence', 'S', 'この証拠は'),
      phrase('makes', 'V', '〜にします', 'make O C の使役・変化を表すVです。'),
      phrase('it', 'O', 'それを', 'it は形式目的語Oです。文法説明は訳欄へ混ぜず、実質内容が後ろの不定詞列だとここで説明します。'),
      phrase('easier', 'C', 'より容易に', '形式目的語itの状態を示す目的格補語Cです。'),
      phrase('to improve', 'V', '改善すること（何をかは次へ）', 'easier の具体的内容を示す一つ目の不定詞動作です。対象Oが後ろに来るため、ここでは格を閉じません。'),
      phrase('a design', 'O', '設計を（改善することを）', 'to improve の対象Oを置き、「設計を改善することを」と一つ目の不定詞内容を完成します。'),
      phrase('or', 'LINK', 'または', 'to improve a design と (to) decide that ... を並列します。二つ目のtoは共有され、音声には足しません。'),
      phrase('decide', 'V', '判断すること（内容は次へ）', 'to improve と並列の二つ目の不定詞動作です。共通の to が省略され、構造表示だけ (to) を補います。', '(to) decide'),
      phrase('that', 'LINK', '次の内容を判断すること（中身は次へ）', 'that は関係詞ではなく、decide の目的語となる内容節の入口です。ここでは格を閉じず、節末で判断内容を完成します。'),
      phrase('a simpler solution', 'S', 'もっと単純な解決策が'),
      phrase('would work', 'V', '機能するだろうと'),
      phrase(
        'better',
        'M',
        'よりうまく（機能するだろう）',
        'better は would work だけを受け直し、decide まで日本語を重ねません。',
        '',
        {
          closureBinding: {
            type: 'content-clause',
            opener: 'that',
            governor: 'decide',
            clause: 'a simpler solution would work better',
          },
        },
      ),
    ],
  ),
  guide(
    'less-than-fused-relative',
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.',
    'less ... than、二つのby what、受動態、present A as Cを区別します。',
    [
      phrase('The integrity of public memory', 'S', '公共的記憶の健全さは'),
      phrase('is then shaped', 'V', 'そのとき形づくられます'),
      phrase('less', 'M', 'より少なく（比較は続く）', 'less は後ろの than と対応する比較前半です。'),
      phrase('by what', 'M', 'あるものによって', 'what は先行詞を含む関係詞で、what節全体が前置詞byの目的語です。'),
      phrase('is available', 'V', '利用可能な（あるものによって）'),
      phrase('than', 'LINK', '〜よりも', 'less と対応し、二つ目の比較基準を導きます。'),
      phrase('by what', 'M', 'あるものによって', '二つ目も先行詞を含むwhatで、後続節全体がbyの目的語です。'),
      phrase('is repeatedly presented', 'V', '繰り返し提示される（あるものによって）'),
      phrase('as relevant', 'C', '関連があるものとして', 'present A as C の補語Cであり、接続詞asや比較asではありません。'),
    ],
  ),
  guide(
    'prevent-from-fused-relative',
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.',
    '条件節、焦点even、prevent O from -ing、abilityを説明する不定詞、from whatを分けます。',
    [
      phrase('If', 'LINK', 'もし', '条件節の入口です。'),
      phrase('that practice', 'S', 'その実践が'),
      phrase('declines', 'V', '衰えれば'),
      phrase('even', 'M', '〜でさえ（対象は次へ）', '直後の主語perfect archivesを焦点化します。'),
      phrase('perfect archives', 'S', '完璧な記録保管所が'),
      phrase('will not prevent', 'V', '防げないでしょう', 'prevent O from -ing のVです。'),
      phrase('societies', 'O', '社会を', 'preventのOであり、losingの意味上の主語でもあります。'),
      phrase('from losing', 'M', '失うこと（対象は次へ）', 'prevent societies from -ing。losingの意味上の主語はsocietiesです。目的語が後ろに来るため、ここでは「を」を閉じません。'),
      phrase('their ability', 'O', '自分たちの能力を（失うことを。どんな能力かは次へ）', 'losing の対象Oを置き、ability の内容を示す後続不定詞を待ちます。'),
      phrase('to learn', 'V', '学ぶための（能力を）', 'abilityの内容を後ろから説明する不定詞です。'),
      phrase('from what', 'M', 'あるものから', 'whatは先行詞を含む関係詞で、what節全体がfromの目的語です。'),
      phrase('they', 'S', '社会が'),
      phrase('once', 'M', 'かつて', 'onceは条件の「いったん」でなく過去の時です。'),
      phrase('knew', 'V', 'かつて知っていたことから学ぶ能力を社会が失うのを、防げないでしょう'),
    ],
  ),
]

export const READING_PHRASE_EXPLANATIONS = Object.freeze(guides)

export const READING_PHRASE_EXPLANATIONS_BY_SENTENCE = Object.freeze(
  Object.fromEntries(guides.map((item) => [item.sentence, item])),
)

export function getReadingPhraseExplanation(sentence) {
  const english = typeof sentence === 'string' ? sentence : sentence?.en
  return READING_PHRASE_EXPLANATIONS_BY_SENTENCE[english] ?? null
}

// 全363文の本文別判断・特殊cue・比較・前置詞＋wh・並列scopeを台帳化済み。
// 真に未解決の判断が生じた時だけ、ここへ項目を追加する。
export const READING_PHRASE_OPEN_QUESTIONS = Object.freeze([])
