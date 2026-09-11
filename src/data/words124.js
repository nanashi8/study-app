// 単語データ #80 — 英検4級(中2)の不足補充②：人物・物語語など。
import { expandCompact } from './compact.js'

const RAW = [
  ['queen', '名', '4', '女王・王妃', 'The queen waved to the people.', '女王は人々に手を振った。', '古英語 cwen(女王)。', { field: '社会' }],
  ['somewhere', '副', '4', 'どこかに・どこかで', 'I left my umbrella somewhere in the school.', '私は学校のどこかに傘を置き忘れた。', 'some(ある)+where(場所)。', { field: '副詞' }],
  ['hall', '名', '4', '広間・会館・廊下', 'The graduation ceremony was held in the school hall.', '卒業式は学校のホールで行われた。', '古英語 heall(大広間)。', { field: '建築' }],
  ['clerk', '名', '4', '店員・事務員', 'The clerk helped me find a new jacket.', '店員が新しい上着を探すのを手伝ってくれた。', 'ラテン clericus(聖職者)。', { field: 'ビジネス' }],
  ['elder', '名', '4', '年上の人・年長の', 'In Japan, we use polite words with our elders.', '日本では年上の人に丁寧な言葉を使う。', '古英語 eldra(年上の)。', { field: '社会' }],
  ['female', '名', '4', '女性・雌・女性の', 'The female lays her eggs in the sand.', '雌は砂の中に卵を産む。', 'ラテン femella(若い女)。', { field: '社会' }],
  ['male', '名', '4', '男性・雄・男性の', 'The male of this bird has a red head.', 'この鳥の雄は頭が赤い。', 'ラテン masculus(男の)。', { field: '社会' }],
  ['gentleman', '名', '4', '紳士・男の方', 'A kind gentleman gave his seat to my grandmother.', '親切な紳士が祖母に席を譲ってくれた。', 'gentle(上品な)+man(人)。', { field: '社会' }],
  ['goddess', '名', '4', '女神', 'the goddess of love', '愛の女神', 'god(神)+ -ess。', { field: '宗教' }],
  ['hunter', '名', '4', '狩人・ハンター', 'The hunter walked quietly through the forest.', '狩人は森の中を静かに歩いた。', 'hunt(狩る)+ -er。', { field: '社会' }],
  ['knight', '名', '4', '騎士・ナイト', 'The brave knight saved the princess.', '勇敢な騎士が王女を救った。', '古英語 cniht(若者・従者)。', { field: '歴史' }],
  ['lord', '名', '4', '主君・領主・卿', 'The lord of the castle ruled the whole area.', '城の領主がその地域全体を治めていた。', '古英語 hlaford(パンを守る人)。', { field: '歴史' }],
  ['mayor', '名', '4', '市長・町長', 'The mayor gave a speech at the festival.', '市長が祭りでスピーチをした。', 'ラテン major(より大きい)。', { field: '政治' }],
  ['monster', '名', '4', '怪物・化け物', 'The movie is about a big monster in the sea.', 'その映画は海にすむ大きな怪物の話だ。', 'ラテン monstrum(前兆)。', { field: '一般' }],
  ['pirate', '名', '4', '海賊', 'The pirates hid their treasure on the island.', '海賊たちは島に宝を隠した。', 'ギリシャ peirates(襲う者)。', { field: '歴史' }],
  ['thief', '名', '4', '泥棒・盗人', 'The police caught the thief near the station.', '警察は駅の近くで泥棒を捕まえた。', '古英語 theof(盗人)。', { field: '社会' }],
  ['vampire', '名', '4', '吸血鬼', 'My brother dressed up as a vampire for Halloween.', '兄はハロウィーンで吸血鬼の仮装をした。', 'セルビア語 vampir。', { field: '一般' }],
  ['witch', '名', '4', '魔女', 'In the story, a witch lives deep in the forest.', 'その物語では、魔女が森の奥に住んでいる。', '古英語 wicce(魔女)。', { field: '一般' }],
]

export const WORDS_MORE123 = RAW.map(expandCompact)
