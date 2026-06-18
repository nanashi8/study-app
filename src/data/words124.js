// 単語データ #80 — 英検4級(中2)の不足補充②：人物・物語語など。
import { expandCompact } from './compact.js'

const RAW = [
  ['queen', '名', '4', '女王・王妃', 'the queen of England', 'イングランド女王', '古英語 cwen(女王)。', { field: '社会' }],
  ['somewhere', '副', '4', 'どこかに・どこかで', 'somewhere in town', '町のどこかで', 'some(ある)+where(場所)。', { field: '副詞' }],
  ['hall', '名', '4', '広間・会館・廊下', 'a concert hall', 'コンサートホール', '古英語 heall(大広間)。', { field: '建築' }],
  ['clerk', '名', '4', '店員・事務員', 'a bank clerk', '銀行員', 'ラテン clericus(聖職者)。', { field: 'ビジネス' }],
  ['elder', '名', '4', '年上の人・年長の', 'respect your elders', '年長者を敬う', '古英語 eldra(年上の)。', { field: '社会' }],
  ['female', '名', '4', '女性・雌・女性の', 'a female student', '女子学生', 'ラテン femella(若い女)。', { field: '社会' }],
  ['male', '名', '4', '男性・雄・男性の', 'a male nurse', '男性看護師', 'ラテン masculus(男の)。', { field: '社会' }],
  ['gentleman', '名', '4', '紳士・男の方', 'a kind gentleman', '親切な紳士', 'gentle(上品な)+man(人)。', { field: '社会' }],
  ['goddess', '名', '4', '女神', 'the goddess of love', '愛の女神', 'god(神)+ -ess。', { field: '宗教' }],
  ['hunter', '名', '4', '狩人・ハンター', 'a deer hunter', '鹿狩りの猟師', 'hunt(狩る)+ -er。', { field: '社会' }],
  ['knight', '名', '4', '騎士・ナイト', 'a brave knight', '勇敢な騎士', '古英語 cniht(若者・従者)。', { field: '歴史' }],
  ['lord', '名', '4', '主君・領主・卿', 'a powerful lord', '有力な領主', '古英語 hlaford(パンを守る人)。', { field: '歴史' }],
  ['mayor', '名', '4', '市長・町長', 'the city mayor', '市長', 'ラテン major(より大きい)。', { field: '政治' }],
  ['monster', '名', '4', '怪物・化け物', 'a scary monster', '恐ろしい怪物', 'ラテン monstrum(前兆)。', { field: '一般' }],
  ['pirate', '名', '4', '海賊', 'a fierce pirate', '凶暴な海賊', 'ギリシャ peirates(襲う者)。', { field: '歴史' }],
  ['thief', '名', '4', '泥棒・盗人', 'catch a thief', '泥棒を捕まえる', '古英語 theof(盗人)。', { field: '社会' }],
  ['vampire', '名', '4', '吸血鬼', 'a vampire story', '吸血鬼の話', 'セルビア語 vampir。', { field: '一般' }],
  ['witch', '名', '4', '魔女', 'a wicked witch', '邪悪な魔女', '古英語 wicce(魔女)。', { field: '一般' }],
]

export const WORDS_MORE123 = RAW.map(expandCompact)
