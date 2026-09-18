import { st } from './entry.js'

export default Object.freeze([
  st('[S Green Town Library] [V has] [O a special event] [M {前| on the first Saturday {前| of every month}}].', {
    chunks: [
      ['Green Town Library', 'グリーンタウン図書館は'],
      ['has a special event', '特別なイベントを開きます'],
      ['on the first Saturday of every month', '毎月の第一土曜日に'],
    ],
    notes: {
      'has a special event': 'has an event で「イベントを開く・イベントがある」。',
    },
  }),
  st("[S Children] [V can listen] [M {前| to stories}], [V make] [O small cards], [接 and] [V borrow] [O books {前| about the month's topic}].", {
    notes: {
      'make small cards': 'make も後ろの borrow も、前の can を共有する動詞です（can make / can borrow）。',
    },
  }),
  st('[M This month], [S the topic] [V is] [C local history].', {
    notes: {
      'This month': '前置詞を付けずに「いつ」を表す修飾語で、主語ではありません。',
    },
  }),
  st('[S Ms. Brown, {同格>Ms. Brown| one {前| of the librarians}},] [V will show] [O old pictures {前| of the town}].'),
  st('[S She] [V will] [M also] [V talk] [M {前| about the old station {関係>the old station| [S that] [V stood] [M {前| near the river}] [M fifty years ago]}}].', {
    chunks: [
      ['She', '彼女は'],
      ['will also talk', 'また話します'],
      ['about the old station', 'その古い駅について'],
      ['that stood', 'そしてその駅は建っていました'],
      ['near the river', '川の近くに'],
      ['fifty years ago', '50年前に'],
    ],
    notes: {
      'will also talk': 'also は will と talk の間に入り、「〜も話す」と話す内容を付け加えます。',
      'that stood': 'stand の過去形 stood は、ここでは「（建物が）建っていた」という意味です。',
    },
  }),
  st('[M {前| After the talk}], [S children] [V will work] [M {前| in small groups}] [M {to:副詞(目的)| [V to build] [O a paper model {前| of the station}]}].', {
    notes: {
      'After the talk': 'after ＋ 名詞で「〜のあとに」。後ろに主語と動詞がないので節ではありません。',
    },
  }),
  st('[S The library] [V will provide] [O {並列| paper | and glue}], [接 so] [S families] [V do not need] [O {to:名詞| [V to bring] [O craft materials]}].', {
    notes: {
      'do not need to bring craft materials': 'need to do の否定で「〜する必要はない」。',
    },
  }),
  st('[S Parents] [V may help], [接 but] [S each child] [V should write] [O a name] [M {前| on the model}] [接 and] [V take] [O it] [M home] [M {前| at noon}].', {
    chunks: [
      ['Parents may help', '保護者は手伝ってもかまいません'],
      ['but', 'しかし'],
      ['each child', '子どもは一人ずつ'],
      ['should write a name', '名前を書くことになっています'],
      ['on the model', '模型に'],
      ['and', 'そして'],
      ['take it home', 'その模型を持ち帰ることになっています'],
      ['at noon', '正午に'],
    ],
    notes: {
      'Parents may help': 'may はここでは「〜してもよい」という許可です。',
      'take it home': 'take ＋ もの ＋ home で「〜を家へ持ち帰る」。take は should を共有し、it は the model を指します。',
    },
    rules: ['contrast-concession', 'parallel-shape', 'main-clause-skeleton'],
  }),
  st('[S The event] [V starts] [M {前| at ten {前| in the morning}}] [接 and] [V ends] [M {前| before lunch}].', {
    chunks: [
      ['The event starts', 'イベントは始まります'],
      ['at ten in the morning', '午前10時に'],
      ['and', 'そして'],
      ['ends', '終わります'],
      ['before lunch', '昼食の前に'],
    ],
  }),
  st('[S People] [V do not have to pay], [接 but] [S they] [V should bring] [O a pencil].', {
    notes: {
      'People do not have to pay': 'do not have to は「〜する必要はない」。must not（〜してはいけない）とは意味が違います。',
    },
  }),
  st('[S Many families] [V come] [M early] [M {副詞節:理由| [接 because] [S the room] [V is not] [C very large]}].', {
    notes: {
      'is not very large': 'not very は「あまり〜ない」。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S it] [V becomes] [C full]}], [S the library] [V will put] [O a message] [M {前| on its website}].', {
    chunks: [
      ['If', 'もし'],
      ['it', 'その部屋が'],
      ['becomes full', '満員に（なったら）'],
      ['the library', '図書館は'],
      ['will put a message', 'お知らせを載せます'],
      ['on its website', '図書館のウェブサイトに'],
    ],
    notes: {
      it: 'it は前の文の the room を指します。',
      'becomes full': 'if の節の中では、未来のことでも現在形 becomes を使います。',
    },
  }),
  st('[S The event] [V is] [C popular] [M {副詞節:理由| [接 because] [S children] [V can learn] [M {前| about their town}] [M {前| in a fun way}]}].', {
    chunks: [
      ['The event', 'そのイベントは'],
      ['is popular', '人気があります'],
      ['because', 'なぜなら'],
      ['children can learn', '子どもたちは学べます'],
      ['about their town', '自分たちの町について'],
      ['in a fun way', '楽しい方法で（学べるからです）'],
    ],
  }),
])
