// 単語データ #94 — 英検1級の上級語彙⑭（A-Z補充8巡目）。難解・低頻度の正確な語のみ。
import { expandCompact } from './compact.js'

const RAW = [
  ['accretion', '名', '1', '(徐々の)増大・付着物', 'a slow accretion of power', '権力の漸進的増大', 'ラテン accrescere(増す)。', { syn: [{ w: 'accumulation', m: '蓄積' }, { w: 'buildup', m: '増大' }], ant: [{ w: 'erosion', m: '浸食' }], field: '科学' }],
  ['acquiesce', '動', '1', '(しぶしぶ)同意する・黙従する', 'acquiesce in the plan', '計画に黙って従う', 'ラテン acquiescere(休む)。', { syn: [{ w: 'comply', m: '応じる' }, { w: 'consent', m: '同意する' }], ant: [{ w: 'resist', m: '抵抗する' }], field: '社会' }],
  ['animus', '名', '1', '敵意・反感', 'a personal animus', '個人的な反感', 'ラテン animus(心・意気)。', { syn: [{ w: 'hostility', m: '敵意' }, { w: 'animosity', m: '反感' }], ant: [{ w: 'goodwill', m: '好意' }], field: '心理' }],
  ['arrogate', '動', '1', '(権利を)不当に横取りする', 'arrogate power to himself', '権力を不当に独占する', 'ラテン arrogare(横取りする)。', { syn: [{ w: 'usurp', m: '簒奪する' }, { w: 'seize', m: '奪う' }], ant: [{ w: 'relinquish', m: '譲り渡す' }], field: '政治' }],
  ['assiduous', '形', '1', '勤勉な・たゆまぬ', 'assiduous study', 'たゆまぬ勉学', 'ラテン assidere(そばに座る)。', { syn: [{ w: 'diligent', m: '勤勉な' }, { w: 'sedulous', m: '精勤の' }], ant: [{ w: 'lazy', m: '怠惰な' }], field: '心理' }],
  ['bellwether', '名', '1', '先導者・(動向の)指標', 'a bellwether of trends', '流行の指標', '鈴(bell)をつけた先導の雄羊(wether)から。', { syn: [{ w: 'indicator', m: '指標' }, { w: 'leader', m: '先導役' }], ant: [{ w: 'follower', m: '追随者' }], field: 'ビジネス' }],
  ['bombard', '動', '1', '砲撃する・浴びせかける', 'bombard him with questions', '彼に質問を浴びせる', 'フランス bombarde(石弓砲)。', { syn: [{ w: 'barrage', m: '集中攻撃する' }, { w: 'assail', m: '浴びせる' }], ant: [{ w: 'shield', m: '守る' }], field: '軍事' }],
  ['canny', '形', '1', '抜け目のない・慎重な', 'a canny investor', '抜け目のない投資家', '古英語 cunnan(知る)。', { syn: [{ w: 'shrewd', m: '鋭い' }, { w: 'astute', m: '機敏な' }], ant: [{ w: 'naive', m: '世間知らずの' }], field: '心理' }],
  ['gratuitous', '形', '1', '不必要な・いわれのない・無償の', 'gratuitous violence', '不必要な暴力', 'ラテン gratuitus(無償の)。', { syn: [{ w: 'unwarranted', m: '不当な' }, { w: 'needless', m: '無用な' }], ant: [{ w: 'justified', m: '正当な' }], field: '一般' }],
  ['inculcate', '動', '1', '(考えを)教え込む・植えつける', 'inculcate good habits', 'よい習慣を植えつける', 'ラテン inculcare(踏み込む)。', { syn: [{ w: 'instill', m: '吹き込む' }, { w: 'implant', m: '植えつける' }], ant: [{ w: 'eradicate', m: '根絶する' }], field: '教育' }],
  ['indomitable', '形', '1', '不屈の・負けん気の', 'an indomitable spirit', '不屈の精神', 'ラテン in+domitare(飼いならす)。', { syn: [{ w: 'unconquerable', m: '征服できない' }, { w: 'invincible', m: '無敵の' }], ant: [{ w: 'feeble', m: '弱々しい' }], field: '心理' }],
  ['lachrymose', '形', '1', '涙もろい・哀れを誘う', 'a lachrymose film', 'お涙頂戴の映画', 'ラテン lacrima(涙)。', { syn: [{ w: 'tearful', m: '涙ぐんだ' }, { w: 'maudlin', m: '感傷的な' }], ant: [{ w: 'cheerful', m: '陽気な' }], field: '心理' }],
  ['plaudits', '名', '1', '称賛・拍手喝采', 'win plaudits', '称賛を得る', 'ラテン plaudere(拍手する)。', { syn: [{ w: 'acclaim', m: '喝采' }, { w: 'praise', m: '称賛' }], ant: [{ w: 'censure', m: '非難' }], field: '社会' }],
  ['propitious', '形', '1', '好都合な・幸先のよい', 'a propitious moment', '好機', 'ラテン propitius(好意的な)。', { syn: [{ w: 'favorable', m: '好都合な' }, { w: 'auspicious', m: '縁起のよい' }], ant: [{ w: 'unfavorable', m: '不利な' }], field: '一般' }],
  ['recoup', '動', '1', '(損失を)取り戻す・埋め合わせる', 'recoup his losses', '損失を取り戻す', '古フランス recouper(切り戻す)。', { syn: [{ w: 'recover', m: '回復する' }, { w: 'regain', m: '取り戻す' }], ant: [{ w: 'forfeit', m: '失う' }], field: '経済' }],
  ['wizened', '形', '1', 'しなびた・しわだらけの', 'a wizened face', 'しわだらけの顔', '古英語 wisnian(しなびる)。', { syn: [{ w: 'shriveled', m: 'しなびた' }, { w: 'withered', m: '枯れた' }], ant: [{ w: 'plump', m: 'ふっくらした' }], field: '一般' }],
  ['zephyr', '名', '1', 'そよ風・西風', 'a gentle zephyr', '穏やかなそよ風', 'ギリシャ Zephyros(西風の神)。', { syn: [{ w: 'breeze', m: '微風' }, { w: 'draft', m: '気流' }], ant: [{ w: 'gale', m: '強風' }], field: '気象' }],
]

export const WORDS_MORE137 = RAW.map(expandCompact)
