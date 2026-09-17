import { st } from './entry.js'

export default Object.freeze([
  st('[S Summers {前| in our town}] [V are] [C hotter {前| than before}].', {
    chunks: [
      ['Summers in our town are hotter', '私たちの町の夏は、より暑いです（何よりかは次へ）'],
      ['than before', '以前より'],
    ],
    notes: {
      'Summers in our town are hotter': 'in our town は Summers を後ろから説明して「私たちの町の夏」。',
      'than before': 'hotter は hot の比較級で「より暑い」。than 〜 で「〜より」。',
    },
    rules: ['comparison-pairs', 'paragraph-map', 'main-clause-skeleton'],
  }),
  st('[M Last year], [S the school] [V put] [O new curtains] [M {前| in every classroom}].', {
    chunks: [
      ['Last year, the school put new curtains', '昨年、学校は新しいカーテンを取り付けました（どこにかは次へ）'],
      ['in every classroom', 'どの教室にも'],
    ],
    notes: {
      'Last year, the school put new curtains': 'put は過去形も put です。ここでは「取り付けた」。',
    },
  }),
  st('[S The curtains] [V stop] [O strong sunlight] [M {前| in the afternoon}].', {
    chunks: [
      ['The curtains stop strong sunlight', 'そのカーテンは、強い日ざしをさえぎります（いつかは次へ）'],
      ['in the afternoon', '午後に'],
    ],
    notes: {
      'The curtains stop strong sunlight': 'stop はここでは「さえぎる・入らないようにする」。',
    },
  }),
  st('[S Our class] [M also] [V keeps] [O green plants] [M {前| by the windows}].', {
    chunks: [
      ['Our class also keeps green plants', '私たちのクラスは、緑の植物も置いています（どこにかは次へ）'],
      ['by the windows', '窓のそばに'],
    ],
    notes: {
      'Our class also keeps green plants': 'keep はここでは「置いておく・育てておく」。also は「〜も」。',
    },
    rules: ['paragraph-map', 'main-clause-skeleton', 'svoc-core'],
  }),
  st('[S The plants] [V make] [O a cool wall {前| of leaves}].', {
    chunks: [
      ['The plants make a cool wall of leaves', 'その植物が、葉でできた涼しい壁を作ります'],
    ],
    notes: {
      'The plants make a cool wall of leaves': 'a wall of leaves で「葉でできた壁」。The plants は前の文の green plants です。',
    },
  }),
  st('[M Every morning], [S a teacher] [V checks] [O the temperature {前| in the gym}].', {
    chunks: [
      ['Every morning, a teacher checks the temperature', '毎朝、先生が気温を確かめます（どこのかは次へ）'],
      ['in the gym', '体育館の'],
    ],
    notes: {
      'in the gym': 'temperature は「気温・温度」。in the gym は the temperature を後ろから説明しています。',
    },
  }),
  st('[M {副詞節:条件| [接 If] [S the number] [V is] [M too] [C high]}], [S we] [V do not run] [M outside].', {
    chunks: [
      ['If the number is too high,', 'その数字が高すぎるときは'],
      ['we do not run outside', '私たちは外で走りません'],
    ],
    notes: {
      'If the number is too high,': 'the number は前の文の気温の数字です。too ＋ 形容詞 で「〜すぎる」。',
    },
  }),
  st('[M {前| On hot days}], [S we] [V study] [M {前| in the library}] [接 and] [V drink] [O a lot {前| of water}].', {
    chunks: [
      ['On hot days, we study in the library', '暑い日には、私たちは図書室で勉強し'],
      ['and drink a lot of water', '水をたくさん飲みます'],
    ],
    notes: {
      'and drink a lot of water': 'and の後ろの drink の主語も we です。a lot of 〜 で「たくさんの〜」。',
    },
    rules: ['paragraph-map', 'parallel-shape', 'main-clause-skeleton'],
  }),
  st('[S Students] [V carry] [O a bottle and a small towel] [M every day].', {
    chunks: [
      ['Students carry a bottle and a small towel', '生徒は水筒と小さなタオルを持ち歩きます'],
      ['every day', '毎日'],
    ],
    notes: {
      'Students carry a bottle and a small towel': 'carry は「持ち歩く」。bottle はここでは水筒です。',
    },
  }),
  st('[S Everyone] [V likes] [O the green wall] [M the most].', {
    chunks: [
      ['Everyone likes the green wall the most', 'みんなが、その緑の壁をいちばん気に入っています'],
    ],
    notes: {
      'Everyone likes the green wall the most': 'the most は「いちばん」。the green wall は第5文の「葉でできた壁」のことです。',
    },
  }),
])
