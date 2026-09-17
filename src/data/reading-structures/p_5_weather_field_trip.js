import { st } from './entry.js'

export default Object.freeze([
  st('[S Our class] [V will visit] [O the city zoo] [M {前| on Friday}].', {
    chunks: [
      ['Our class will visit the city zoo', '私たちのクラスは、市の動物園を訪れます'],
      ['on Friday', '金曜日に'],
    ],
    notes: {
      'Our class will visit the city zoo': 'will ＋ 動詞の原形 で、これからの予定を表します。',
      'on Friday': '曜日の前には on を置きます。',
    },
    rules: ['purpose-first', 'svoc-core', 'paragraph-map'],
  }),
  st('[S We] [V meet] [M {前| at school}] [M {前| at eight {前| in the morning}}].', {
    chunks: [
      ['We meet at school', '私たちは学校に集まります'],
      ['at eight in the morning', '朝の8時に'],
    ],
    notes: {
      'at eight in the morning': 'at ＋ 時刻 で「〜時に」。in the morning は「朝の・午前の」。',
    },
  }),
  st('[S Everyone] [V brings] [O a hat, a notebook, and some water].', {
    chunks: [
      ['Everyone brings', 'みんなが持ってきます（何をかは次へ）'],
      ['a hat, a notebook, and some water', '帽子とノート、そして水を'],
    ],
    notes: {
      'Everyone brings': 'everyone は単数として扱うので、動詞は brings です。',
      'a hat, a notebook, and some water': 'A, B, and C で三つを並べています。water は数えられないので some water です。',
    },
  }),
  st('[M First], [S a guide] [V shows] [O1 us] [O2 the new animal hospital].', {
    chunks: [
      ['First,', 'まず'],
      ['a guide shows us', 'ガイドが私たちに見せてくれます（何をかは次へ）'],
      ['the new animal hospital', '新しい動物病院を'],
    ],
    notes: {
      'a guide shows us': 'show ＋ 人 ＋ もの で「人にものを見せる」。',
    },
  }),
  st('[M Then] [S we] [V eat] [O lunch] [M {前| near the flower garden}].', {
    chunks: [
      ['Then', 'それから'],
      ['we eat lunch', '私たちは昼食を食べます'],
      ['near the flower garden', '花畑の近くで'],
    ],
    notes: {
      Then: 'Then は「それから」。First（まず）に続く順番を表します。',
    },
  }),
  st('[M {前| In the afternoon}], [S we] [V watch] [O the penguins] [接 and] [V draw] [O one animal].', {
    chunks: [
      ['In the afternoon,', '午後には'],
      ['we watch the penguins', '私たちはペンギンを見ます'],
      ['and draw one animal', 'そして動物を1匹かきます'],
    ],
    notes: {
      'and draw one animal': 'draw も we を主語にしています（we draw）。draw は「（絵を）かく」。',
    },
  }),
  st('[S The bus] [V leaves] [O the zoo] [M {前| at two thirty}].', {
    chunks: [
      ['The bus leaves the zoo', 'バスは動物園を出発します'],
      ['at two thirty', '2時30分に'],
    ],
    notes: {
      'The bus leaves the zoo': 'leave ＋ 場所 で「〜を出発する」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S it] [V rains]}], [S we] [V visit] [O the science museum] [M instead].', {
    chunks: [
      ['If it rains,', 'もし雨が降ったら'],
      ['we visit the science museum instead', '代わりに科学博物館を訪れます'],
    ],
    notes: {
      'If it rains,': 'if ＋ 主語 ＋ 動詞 で「もし〜なら」。天気を言うときの it で、rain は「雨が降る」。',
      'we visit the science museum instead': 'instead は「代わりに」。動物園の代わりに、という意味です。',
    },
  }),
  st('[S The museum] [V is] [M {前| next to the train station}].', {
    chunks: [
      ['The museum', 'その博物館は'],
      ['is next to the train station', '駅の隣にあります'],
    ],
    notes: {
      'is next to the train station': 'next to 〜 で「〜の隣に」。is ＋ 場所 で「〜にある」という第1文型です。',
    },
  }),
  st('[S Our teacher] [V puts] [O the final plan] [M {前| on the school website}] [M {前| on Thursday evening}].', {
    chunks: [
      ['Our teacher puts the final plan', '先生は、最後の予定を載せます（どこにかは次へ）'],
      ['on the school website', '学校のウェブサイトに'],
      ['on Thursday evening', '木曜日の夕方に'],
    ],
    notes: {
      'on the school website': 'put A on B で「AをBに載せる・置く」。on the school website は the final plan ではなく puts につながり、載せる場所を表します。',
    },
    rules: ['postmodifier', 'svoc-core', 'purpose-first'],
  }),
])
