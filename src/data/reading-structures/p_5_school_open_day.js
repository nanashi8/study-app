import { st } from './entry.js'

export default Object.freeze([
  st('[S Our school] [V has] [O an open day] [M next Saturday].', {
    chunks: [
      ['Our school', '私たちの学校では'],
      ['has an open day', '学校公開日があります'],
      ['next Saturday', '次の土曜日に'],
    ],
    notes: {
      'has an open day': 'have はここでは「（行事が）ある」。open day は、学校を家族などに公開する日です。',
      'next Saturday': 'next Saturday（次の土曜日）の前には on を付けません。',
    },
    rules: ['purpose-first', 'paragraph-map', 'svoc-core'],
  }),
  st('[S Students] [V come] [M at nine] [M with a parent].', {
    chunks: [
      ['Students come', '生徒は来ます'],
      ['at nine', '9時に'],
      ['with a parent', '保護者と一緒に'],
    ],
    notes: {
      'at nine': 'at ＋ 時刻 で「〜時に」。',
      'with a parent': 'with は「〜と一緒に」。a parent は父か母のどちらか一人です。',
    },
  }),
  st('[M First], [S families] [V visit] [O classrooms] [接 and] [V watch] [O a science class].', {
    chunks: [
      ['First,', 'まず'],
      ['families', '家族は'],
      ['visit classrooms', '教室を訪れます'],
      ['and', 'そして'],
      ['watch a science class', '理科の授業を見ます'],
    ],
    notes: {
      'First,': 'First は「まず・最初に」。このあと At ten・After that・At one と、予定が時間の順に続きます。',
      'watch a science class': 'watch も families を主語にしています（families watch）。',
    },
  }),
  st('[M At ten], [S the music club] [V sings] [M in the school hall].', {
    chunks: [
      ['At ten,', '10時には'],
      ['the music club sings', '音楽部が歌います'],
      ['in the school hall', '学校のホールで'],
    ],
    notes: {
      'the music club sings': 'the music club は一つの部なので、動詞は三人称単数の sings です。',
    },
  }),
  st('[M After that], [S families] [V eat] [O lunch] [M in the garden].', {
    chunks: [
      ['After that,', 'そのあと'],
      ['families', '家族は'],
      ['eat lunch', '昼食を食べます'],
      ['in the garden', '庭で'],
    ],
    notes: {
      'After that,': 'that は、前の文の「10時に音楽部が歌うこと」を指します。',
    },
    rules: ['reference-chain', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[M Please] [V bring] [O your own drinks].', {
    chunks: [
      ['Please bring your own drinks', '自分の飲み物を持ってきてください'],
    ],
    notes: {
      'Please bring your own drinks': 'Please ＋ 動詞の原形 で「〜してください」。主語 you を省いた命令文です。your own は「自分自身の」。',
    },
    rules: ['purpose-first', 'svoc-core', 'noun-boundary'],
  }),
  st('[M At one], [S the sports club] [V meets] [M in the gym].', {
    chunks: [
      ['At one,', '1時には'],
      ['the sports club meets', '運動部が集まります'],
      ['in the gym', '体育館に'],
    ],
    notes: {
      'the sports club meets': 'meet はここでは「集まる」。the sports club は一つの部なので meets です。',
    },
  }),
  st('[S Students] [V wear] [O indoor shoes] [接 and] [V join] [O some games].', {
    chunks: [
      ['Students', '生徒は'],
      ['wear indoor shoes', '上履きを履きます'],
      ['and', 'そして'],
      ['join some games', 'いくつかのゲームに参加します'],
    ],
    notes: {
      'wear indoor shoes': 'wear は「身に着ける・履く」。indoor shoes は建物の中で履く靴（上履き）です。',
      'join some games': 'join は「〜に参加する」で、後ろに直接 some games を置きます。',
    },
  }),
  st('[M Please] [V ask] [O a teacher near the front door] [M {副詞節:条件| [接 if] [S you] [V have] [O any questions]}].', {
    chunks: [
      ['Please ask a teacher', '先生に尋ねてください'],
      ['near the front door', '正面玄関の近くにいる（先生に）'],
      ['if you have any questions', 'もし何か質問があれば'],
    ],
    notes: {
      'Please ask a teacher': 'Please ＋ 動詞の原形 で「〜してください」という命令文です。',
      'near the front door': 'near the front door は a teacher を後ろから説明して、「正面玄関の近くにいる先生」。',
      'if you have any questions': 'if ＋ 主語 ＋ 動詞 で「もし〜なら」。疑問文や if の文では、ふつう some ではなく any を使います。',
    },
    rules: ['postmodifier', 'logic-connectors', 'purpose-first'],
  }),
  st('[S The open day] [V will end] [M at three].', {
    chunks: [
      ['The open day will end', '学校公開日は終わります'],
      ['at three', '3時に'],
    ],
    notes: {
      'The open day will end': 'will ＋ 動詞の原形 で、これからの予定を表します。',
    },
  }),
])
