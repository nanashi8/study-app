// 全567文へ適用する「意味・発音のまとまり」基準の機械可読な回帰例。
// SVOCMはフレーズ境界ではなく、各フレーズ内部の構造注釈として保持する。
// displayEn に補う (to) などは構造表示専用で、spokenEn には入れない。

const ROLE_GRAMMAR = Object.freeze({
  S: '名詞句として「だれが・何が」を示します。',
  V: '述語として「どうする・どんな状態か」を示します。',
  O: '動詞が向かう対象を含む述部として読みます。',
  C: '主語または目的語の内容・状態を含む述部として読みます。',
  M: '時・場所・方法・程度・理由などを表す意味のまとまりです。',
  LINK: '節・並列・比較の関係を示す意味のまとまりです。',
})

const phrase = (en, rawRoles, ja, grammar = '', options = {}) => {
  const roles = Object.freeze(Array.isArray(rawRoles) ? rawRoles : [rawRoles])
  return Object.freeze({
    en,
    spokenEn: en,
    displayEn: options.displayEn ?? en,
    structureEn: options.displayEn && options.displayEn !== en ? options.displayEn : '',
    role: roles[0],
    roles,
    ja,
    grammar: grammar || roles.map((role) => ROLE_GRAMMAR[role]).filter(Boolean).join(' '),
    pattern: roles.join('＋'),
    status: 'confirmed',
    ...(options.closureBinding
      ? { closureBinding: Object.freeze({ ...options.closureBinding }) }
      : {}),
  })
}

const guide = (id, sentence, note, phrases) => Object.freeze({
  id,
  sentence,
  note,
  phrases: Object.freeze(phrases),
  status: 'confirmed',
  purpose: 'whole-corpus-meaning-phrase-regression-example',
})

const guides = [
  guide(
    'meaning-basic-motion',
    'She goes to school by bus every morning.',
    '短いS＋Vは一息で読み、行き先・手段・時をそれぞれ意味のまとまりとして足します。',
    [
      phrase('She goes', ['S', 'V'], '彼女は行きます'),
      phrase('to school', 'M', '学校へ'),
      phrase('by bus', 'M', 'バスで'),
      phrase('every morning', 'M', '毎朝'),
    ],
  ),
  guide(
    'meaning-basic-svc',
    'Rina is a junior high school student.',
    '主語の名詞句と、be動詞＋補語で完成する述部に分けます。',
    [
      phrase('Rina', 'S', 'リナは'),
      phrase('is a junior high school student', ['V', 'C'], '一人の中学生です'),
    ],
  ),
  guide(
    'meaning-svo-because',
    'She likes English because her teacher uses many pictures.',
    'SVOを単語ごとに砕かず、名詞句と意味の完成する述部で読みます。',
    [
      phrase('She', 'S', '彼女は'),
      phrase('likes English', ['V', 'O'], '英語が好きです'),
      phrase('because', 'LINK', 'なぜなら'),
      phrase('her teacher', 'S', '先生が'),
      phrase('uses many pictures', ['V', 'O'], 'たくさんの絵を使うからです'),
    ],
  ),
  guide(
    'meaning-time-svo',
    'On Monday, she has English, music, and science classes.',
    '時、主語、V＋Oの述部という三つの意味単位で追います。',
    [
      phrase('On Monday', 'M', '月曜日に'),
      phrase('she', 'S', '彼女は'),
      phrase('has English, music, and science classes', ['V', 'O'], '英語・音楽・理科の授業を受けます'),
    ],
  ),
  guide(
    'meaning-modal-object',
    'After lunch, Rina cannot find her blue notebook.',
    '助動詞＋動詞＋目的語を、意味が完成する一つの述部として読みます。',
    [
      phrase('After lunch', 'M', '昼食のあとに'),
      phrase('Rina', 'S', 'リナは'),
      phrase('cannot find her blue notebook', ['V', 'O'], '彼女の青いノートを見つけられません'),
    ],
  ),
  guide(
    'meaning-location-companion',
    'Her friend Ken looks under the desks with her.',
    '短いS＋Vのあとに、場所と同伴のまとまりを順に足します。',
    [
      phrase('Her friend Ken looks', ['S', 'V'], '友達のケンは探します'),
      phrase('under the desks', 'M', '机の下を'),
      phrase('with her', 'M', '彼女と一緒に'),
    ],
  ),
  guide(
    'meaning-discourse-time',
    'Then Ken sees the notebook near the classroom door.',
    '談話のつなぎ、主語、V＋Oの述部、場所の順で読みます。',
    [
      phrase('Then', 'M', 'それから'),
      phrase('Ken', 'S', 'ケンは'),
      phrase('sees the notebook', ['V', 'O'], 'そのノートを見つけます'),
      phrase('near the classroom door', 'M', '教室のドアの近くで'),
    ],
  ),
  guide(
    'meaning-lexical-have',
    'Green Town Library has a special event on the first Saturday of every month.',
    '施設の名詞句、has＋目的語の述部、開催日のまとまりに分けます。',
    [
      phrase('Green Town Library', 'S', 'グリーンタウン図書館は'),
      phrase('has a special event', ['V', 'O'], '特別な催しを開催します'),
      phrase('on the first Saturday of every month', 'M', '毎月の第1土曜日に'),
    ],
  ),
  guide(
    'meaning-topic-svc',
    'This month, the topic is local history.',
    '時、主語、be動詞＋補語で完成する述部に分けます。',
    [
      phrase('This month', 'M', '今月は'),
      phrase('the topic', 'S', 'テーマは'),
      phrase('is local history', ['V', 'C'], '地域の歴史です'),
    ],
  ),
  guide(
    'formal-object-shared-infinitive',
    'This evidence makes it easier to improve a design or decide that a simpler solution would work better.',
    'make O C、形式目的語it、共有to、that内容節を、意味のまとまりを壊さず説明します。',
    [
      phrase('This evidence', 'S', 'この証拠は'),
      phrase(
        'makes it easier',
        ['V', 'O', 'C'],
        'それを簡単にします',
        'make O C のまとまりです。it は形式目的語Oで、英語が長い実質内容を後ろへ置く後重心を好むことを説明します。',
      ),
      phrase('to improve a design', ['V', 'O'], '設計を改善することを'),
      phrase('or', 'LINK', 'または'),
      phrase(
        'decide that',
        ['V', 'LINK'],
        'that以下の内容を判断することを',
        'decide は to improve と並列で二つ目のtoが省略されています。that は decide の目的語となる内容節の入口です。',
        { displayEn: '(to) decide that' },
      ),
      phrase('a simpler solution would work', ['S', 'V'], '単純な解決策が機能するだろう'),
      phrase('better', 'M', 'よりうまく（機能するだろう）'),
    ],
  ),
  guide(
    'less-than-fused-relative',
    'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.',
    '長い主語、受動態、less ... than、二つのby whatを、それぞれ発音できる意味単位で読みます。',
    [
      phrase('The integrity of public memory', 'S', '公共的記憶の健全さは'),
      phrase('is then shaped', 'V', 'そのとき形づくられます'),
      phrase('less', 'M', 'より少なく（比較は続く）'),
      phrase('by what', 'M', 'あるものによって'),
      phrase('is available', 'V', '利用可能な（あるものによって）'),
      phrase('than', 'LINK', '〜よりも'),
      phrase('by what', 'M', 'あるものによって'),
      phrase('is repeatedly presented', 'V', '繰り返し提示される（あるものによって）'),
      phrase('as relevant', 'C', '関連があるものとして'),
    ],
  ),
  guide(
    'prevent-from-fused-relative',
    'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.',
    '条件節、prevent O from -ing、abilityを説明する不定詞、from whatを意味単位で保ちます。',
    [
      phrase('If', 'LINK', 'もし'),
      phrase('that practice declines', ['S', 'V'], 'その実践が衰えれば'),
      phrase('even', 'M', '〜でさえ（対象は次へ）'),
      phrase('perfect archives', 'S', '完璧な記録保管所が'),
      phrase('will not prevent', 'V', '防げないでしょう'),
      phrase('societies from losing their ability', ['O', 'M'], '社会が自分たちの能力を失うのを'),
      phrase('to learn', 'V', '学ぶための（能力を）'),
      phrase('from what', 'M', 'あるものから'),
      phrase('they once knew', ['S', 'M', 'V'], '社会がかつて知っていた（ものから）'),
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

// 全567文の本文別判断は台帳化済み。真に未解決の意味境界が見つかった時だけ追加する。
export const READING_PHRASE_OPEN_QUESTIONS = Object.freeze([])
