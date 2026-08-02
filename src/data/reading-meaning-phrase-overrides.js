// 意味フレーズを機械的なSVOCM境界より優先する、本文別の確定値。
// キーは実際に発音する連続した原文英語で、構造上の補いは displayEn だけに置く。

const item = (ja, grammar = '', options = {}) => Object.freeze({
  ja,
  grammar,
  ...options,
})

const sentence = (phrases) => Object.freeze(phrases)
const split = (...phrases) => Object.freeze({ split: Object.freeze(phrases) })

export const READING_MEANING_PHRASE_OVERRIDES = Object.freeze({
  'She goes to school by bus every morning.': sentence({
    'She goes': item(
      '彼女は行きます',
      'She がS、goes がVです。ただし、二語で「彼女は行きます」という自然な一息の意味になるため、一つのフレーズで読みます。',
    ),
  }),

  'Rina is a junior high school student.': sentence({
    'is a junior high school student': item(
      '一人の中学生です',
      'is と補語 a junior high school student を「一人の中学生です」という一つの述部として読みます。SVCの分析は内部注釈で確認します。',
    ),
  }),

  'Many families come early because the room is not very large.': sentence({
    'Many families come': item(
      '多くの家族が来ます',
      'Many families がS、come がVです。ここは「多くの家族が来ます」と一息で意味が完成します。',
    ),
    'is not very large': item(
      'あまり広くありません（からです）',
      'is not と補語 very large を分断せず、「あまり広くありません」と一つの状態として読みます。括弧内で because の理由関係を節末に受け直します。',
    ),
  }),

  'This evidence makes it easier to improve a design or decide that a simpler solution would work better.': sentence({
    'makes it easier': item(
      'それを簡単にします',
      'make O C のまとまりです。it は形式目的語O、easier は目的格補語Cで、英語が短い it を先に置き、実質内容の不定詞を後ろへ送る後重心を好むことを説明します。',
    ),
    'to improve a design': item(
      '設計を改善することを',
      'to improve と目的語 a design は「設計を改善すること」という一つの不定詞内容です。',
    ),
    'decide that': item(
      'that以下の内容を判断することを',
      'decide は前の to improve と並列で、二つ目の to が省略されています。that は関係詞ではなく、decide の目的語となる内容節の入口です。',
      { displayEn: '(to) decide that' },
    ),
    'a simpler solution would work': item(
      '単純な解決策が機能するだろう',
      'a simpler solution が内容節内のS、would work がVです。このS＋Vは「解決策が機能するだろう」と一息で読みます。',
    ),
  }),

  'The integrity of public memory is then shaped less by what is available than by what is repeatedly presented as relevant.': sentence({
    'is then shaped': item(
      'そのとき形づくられます',
      'be動詞・副詞 then・過去分詞 shaped は一つの受動態の述語として読みます。',
    ),
    'by what': item(
      'あるものによって',
      'by と先行詞を含む what を一息で読み、what節全体が by の目的語になることを確認します。',
    ),
    'is available': item(
      '利用可能な（あるものによって）',
      'what節内の述語です。括弧で先に読んだ by what へ受け直します。',
    ),
    'is repeatedly presented': item(
      '繰り返し提示される（あるものによって）',
      '受動態の述語を一息で読み、二つ目の by what へ受け直します。',
    ),
  }),

  'If that practice declines, even perfect archives will not prevent societies from losing their ability to learn from what they once knew.': sentence({
    'that practice declines': item(
      'その実践が衰えれば',
      'that practice が条件節内のS、declines がVです。短いS＋Vを一つの出来事として読みます。',
    ),
    'societies from losing their ability': item(
      '社会が自分たちの能力を失うのを',
      'prevent O from -ing の O は、from losing の意味上の主語です。societies を「社会を」と切り離さず、「社会が自分たちの能力を失うのを」という一つの内容で読みます。',
    ),
    'they once knew': item(
      '社会がかつて知っていた（ものから）',
      'they がS、once が時のM、knew がVです。三つを「社会がかつて知っていた」と一息で読み、括弧で from what の「ものから」を受け直します。',
    ),
  }),

  'The broader lesson is that innovation should be judged by the range of people who can use it, not only by the speed of its average transaction.': sentence({
    'not only by the speed of its average transaction': split(
      item(
        '〜だけでなく',
        'not only は、既出の広い評価基準と「平均速度だけ」という狭い基準を対照させる焦点表現です。',
        { en: 'not only', role: 'LINK' },
      ),
      item(
        '平均的な取引速度によって（だけではなく）',
        'by the speed of its average transaction は一つの評価基準です。括弧で not only の対照を受け直します。',
        { en: 'by the speed of its average transaction', role: 'M' },
      ),
    ),
  }),
})

export function readingMeaningPhraseOverridesFor(sentenceEnglish) {
  return READING_MEANING_PHRASE_OVERRIDES[sentenceEnglish] ?? null
}
