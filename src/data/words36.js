// 単語データ（継続 / 6000語へ）— 伝達・抑圧の動詞/役割・規定の名詞/明瞭さ・評価の形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 伝達・抑圧の動詞
  ['mumble', '動', 'pre1', 'もぐもぐ言う・口ごもる', "Don't mumble; speak clearly.", '口ごもらず、はっきり話して。', '中英語 momelen(擬音)。', { syn: [{ w: 'mutter', m: 'つぶやく' }, { w: 'murmur', m: '小声で言う' }], ant: [{ w: 'enunciate', m: 'はっきり言う' }], field: '動作・行為' }],
  ['boast', '動', 'pre1', '自慢する・誇る', 'He boasts about his car.', '彼は自分の車を自慢する。', '中英語 bost(自慢)。', { syn: [{ w: 'brag', m: '自慢する' }, { w: 'show off', m: '見せびらかす' }], field: '動作・行為' }],
  ['brag', '動', 'pre1', '自慢する・吹聴する', 'She bragged about winning.', '彼女は勝ったことを吹聴した。', '由来不確か(14世紀)。', { syn: [{ w: 'boast', m: '自慢する' }], field: '動作・行為' }],
  ['vow', '動', 'pre1', '誓う・誓い(名)', 'They vowed to stay together.', '彼らは共にいると誓った。', 'ラテン votum(誓い)→ vote と同系。', { syn: [{ w: 'pledge', m: '誓約する' }, { w: 'swear', m: '誓う' }], field: '動作・行為' }],
  ['pledge', '動', 'pre1', '誓約する・固く約束する・誓約(名)', 'They pledged their support.', '彼らは支援を約束した。', '古フランス plege(保証)。', { syn: [{ w: 'promise', m: '約束する' }, { w: 'vow', m: '誓う' }], field: '動作・行為' }],
  ['confide', '動', '1', '打ち明ける・信頼して話す', 'She confided her fears to me.', '彼女は不安を私に打ち明けた。', 'ラテン con+fidere(信じる)→ confidence と同系。', { syn: [{ w: 'tell', m: '打ち明ける' }, { w: 'reveal', m: '明かす' }], field: '心理' }],
  ['divulge', '動', '1', '漏らす・暴露する', 'He refused to divulge the secret.', '彼は秘密を漏らすのを拒んだ。', 'ラテン di+vulgare(広める)→ vulgar と同系。', { syn: [{ w: 'disclose', m: '公表する' }, { w: 'reveal', m: '明かす' }], ant: [{ w: 'conceal', m: '隠す' }], field: '動作・行為' }],
  ['suppress', '動', '1', '抑圧する・抑える', 'He suppressed a laugh.', '彼は笑いをかみ殺した。', 'ラテン sub+premere(押す)→ press と同系。', { syn: [{ w: 'restrain', m: '抑える' }, { w: 'stifle', m: '抑制する' }], ant: [{ w: 'express', m: '表す' }], field: '動作・行為' }],
  ['repress', '動', '1', '抑圧する・(感情を)抑える', 'She repressed her anger.', '彼女は怒りを抑え込んだ。', 'ラテン re+premere(押す)→ press と同系。', { syn: [{ w: 'suppress', m: '抑える' }, { w: 'subdue', m: '鎮める' }], field: '心理' }],
  ['stifle', '動', '1', '抑える・窒息させる', 'The rules stifle creativity.', '規則は創造性を抑える。', '古フランス estouffer(窒息させる)。', { syn: [{ w: 'suppress', m: '抑圧する' }, { w: 'smother', m: '抑え込む' }], field: '動作・行為' }],
  ['quell', '動', '1', '鎮める・抑える', 'Police quelled the riot.', '警察は暴動を鎮圧した。', '古英語 cwellan(殺す)。', { syn: [{ w: 'suppress', m: '抑圧する' }, { w: 'subdue', m: '鎮圧する' }], field: '動作・行為' }],
  ['subdue', '動', '1', '征服する・鎮める・抑える', 'They subdued the rebellion.', '彼らは反乱を鎮圧した。', 'ラテン sub+ducere(下に導く)→ duct と同系。', { syn: [{ w: 'conquer', m: '征服する' }, { w: 'suppress', m: '抑える' }], field: '軍事' }],
  ['extinguish', '動', '1', '消す・絶やす', 'Firefighters extinguished the blaze.', '消防士が火を消した。', 'ラテン ex+stinguere(消す)→ distinguish と同系。', { syn: [{ w: 'put out', m: '消す' }, { w: 'quench', m: '消す' }], ant: [{ w: 'ignite', m: '点火する' }], field: '動作・行為' }],
  ['gossip', '動', 'pre1', 'うわさ話をする・うわさ(名)', 'They gossiped about neighbors.', '彼らは近所のうわさをした。', '古英語 godsibb(名づけ親→おしゃべり仲間)。', { syn: [{ w: 'chat', m: 'おしゃべりする' }], field: '社会' }],
  // 役割・人の名詞
  ['spokesman', '名', 'pre1', '代弁者・報道官', 'A spokesman made a statement.', '報道官が声明を出した。', 'spoke(speakの過去)+man。', { syn: [], field: 'メディア' }],
  ['envoy', '名', '1', '使節・特使', 'The envoy delivered the message.', '使節が伝言を届けた。', 'フランス envoyer(送る)。', { syn: [{ w: 'ambassador', m: '大使' }], field: '政治' }],
  ['ambassador', '名', 'pre1', '大使', 'She is the ambassador to France.', '彼女はフランス大使だ。', 'ラテン ambactus(従者)。', { syn: [{ w: 'envoy', m: '使節' }], field: '政治' }],
  ['tenant', '名', '1', '借家人・テナント', 'The tenant pays rent monthly.', '借家人は毎月家賃を払う。', 'ラテン tenere(保つ)→ tain と同系。', { ant: [{ w: 'landlord', m: '家主' }], field: '社会' }],
  ['landlord', '名', 'pre1', '家主・大家', 'The landlord raised the rent.', '大家は家賃を上げた。', 'land(土地)+lord(主)。', { ant: [{ w: 'tenant', m: '借家人' }], field: '社会' }],
  ['guardian', '名', 'pre1', '保護者・後見人', 'Her uncle is her legal guardian.', '彼女のおじは法的後見人だ。', '古フランス guarden(守る)→ guard と同系。', { syn: [{ w: 'protector', m: '守護者' }, { w: 'custodian', m: '管理者' }], field: '法律' }],
  ['apprentice', '名', '1', '見習い・徒弟', 'He works as an apprentice.', '彼は見習いとして働く。', 'ラテン apprehendere(つかむ・学ぶ)→ comprehend と同系。', { syn: [{ w: 'trainee', m: '研修生' }, { w: 'novice', m: '初心者' }], ant: [{ w: 'master', m: '親方' }], field: 'ビジネス' }],
  ['novice', '名', '1', '初心者・新参者', 'She is a novice at chess.', '彼女はチェスの初心者だ。', 'ラテン novus(新しい)→ novel と同系。', { syn: [{ w: 'beginner', m: '初心者' }, { w: 'rookie', m: '新人' }], ant: [{ w: 'expert', m: '熟練者' }], field: '一般' }],
  ['specialist', '名', 'pre1', '専門家', 'See a specialist for that.', 'それは専門医に診てもらって。', 'special(特別な)+ -ist。', { syn: [{ w: 'expert', m: '専門家' }, { w: 'authority', m: '権威' }], ant: [{ w: 'generalist', m: '万能型' }], field: '一般' }],
  // 規定・制度の名詞
  ['precedent', '名', '1', '前例・先例・判例', 'The ruling set a precedent.', 'その判決は前例をつくった。', 'ラテン prae+cedere(先に行く)→ cess と同系。', { syn: [{ w: 'example', m: '先例' }, { w: 'model', m: '手本' }], field: '法律' }],
  ['benchmark', '名', '1', '基準・指標', 'The test is a benchmark for skill.', 'その試験は技能の基準だ。', 'bench(測量基準台)+mark(印)。', { syn: [{ w: 'standard', m: '基準' }, { w: 'criterion', m: '尺度' }], field: 'ビジネス' }],
  ['prerequisite', '名', '1', '前提条件・必要条件', 'Math is a prerequisite for physics.', '数学は物理の前提科目だ。', 'pre(前に)+require(要する)→ require と同系。', { syn: [{ w: 'condition', m: '条件' }], field: '教育' }],
  ['provision', '名', '1', '供給・備え・条項', 'The contract has a special provision.', '契約には特別条項がある。', 'ラテン pro+videre(前もって見る)→ provide と同源。', { syn: [{ w: 'supply', m: '供給' }, { w: 'clause', m: '条項' }], field: '法律' }],
  ['stipulation', '名', '1', '規定・条件', 'They accepted the stipulation.', '彼らはその条件を受け入れた。', 'ラテン stipulari(約束する)。', { syn: [{ w: 'condition', m: '条件' }], field: '法律' }],
  ['loophole', '名', '1', '抜け穴・盲点', 'They exploited a tax loophole.', '彼らは税の抜け穴を利用した。', 'loop(輪・狭間)+hole(穴)。', { syn: [{ w: 'gap', m: '抜け穴' }], field: '法律' }],
  ['mandate', '名', '1', '権限・命令・任期', 'The government has a clear mandate.', '政府は明確な負託を得ている。', 'ラテン manus(手)+dare(与える)→手渡す。', { syn: [{ w: 'authority', m: '権限' }, { w: 'order', m: '命令' }], field: '政治' }],
  ['decree', '名', '1', '法令・布告・命じる(動)', 'The king issued a decree.', '王は布告を出した。', 'ラテン decretum(決定)。', { syn: [{ w: 'order', m: '命令' }, { w: 'edict', m: '勅令' }], field: '法律' }],
  ['ordinance', '名', '1', '条例・法令', 'A city ordinance bans noise.', '市の条例が騒音を禁じる。', 'ラテン ordinare(整える)→ order と同系。', { syn: [{ w: 'regulation', m: '規則' }, { w: 'law', m: '法' }], field: '法律' }],
  ['protocol', '名', '1', '儀礼・手順・規約', 'They followed strict protocol.', '彼らは厳格な手順に従った。', 'ギリシャ protos(最初)+kolla(のり)→巻物の最初の紙。', { syn: [{ w: 'procedure', m: '手順' }, { w: 'etiquette', m: '礼儀' }], field: '社会' }],
  // 明瞭さの形容詞
  ['terse', '形', '1', 'そっけない・簡潔な', 'He gave a terse reply.', '彼はそっけない返事をした。', 'ラテン tersus(磨かれた・滑らかな)。', { syn: [{ w: 'curt', m: 'ぶっきらぼうな' }, { w: 'brief', m: '簡潔な' }], ant: [{ w: 'wordy', m: '冗長な' }], field: '性質・状態' }],
  ['inarticulate', '形', '1', '口下手な・不明瞭な', 'He was inarticulate with nerves.', '彼は緊張で言葉が出なかった。', 'in(否定)+articulate(明瞭な)。', { syn: [{ w: 'tongue-tied', m: '口ごもる' }], ant: [{ w: 'eloquent', m: '雄弁な' }], field: '性質・状態' }],
  ['repetitive', '形', 'pre1', '繰り返しの多い・単調な', 'The work is repetitive.', 'その仕事は単調だ。', 'repeat(繰り返す)+ -itive。', { syn: [{ w: 'monotonous', m: '単調な' }], ant: [{ w: 'varied', m: '変化に富む' }], field: '性質・状態' }],
  // 評価の形容詞
  ['commendable', '形', '1', '称賛に値する・立派な', 'Her effort was commendable.', '彼女の努力は称賛に値した。', 'commend(ほめる)+ -able。', { syn: [{ w: 'praiseworthy', m: '称賛すべき' }, { w: 'admirable', m: '立派な' }], ant: [{ w: 'deplorable', m: 'ひどい' }], field: '性質・状態' }],
  ['deplorable', '形', '1', '嘆かわしい・ひどい', 'The conditions were deplorable.', 'その状況はひどいものだった。', 'ラテン de+plorare(泣く)。', { syn: [{ w: 'disgraceful', m: '恥ずべき' }, { w: 'terrible', m: 'ひどい' }], ant: [{ w: 'admirable', m: '立派な' }], field: '性質・状態' }],
  ['despicable', '形', '1', '卑劣な・見下げ果てた', 'It was a despicable act.', 'それは卑劣な行為だった。', 'ラテン de+specere(見下す)→ spect と同系。', { syn: [{ w: 'contemptible', m: '軽蔑すべき' }, { w: 'vile', m: '下劣な' }], ant: [{ w: 'admirable', m: '立派な' }], field: '性質・状態' }],
  ['admirable', '形', 'pre1', '称賛すべき・立派な', 'She showed admirable courage.', '彼女は立派な勇気を見せた。', 'admire(称賛する)+ -able。', { syn: [{ w: 'commendable', m: '称賛すべき' }, { w: 'praiseworthy', m: '見事な' }], ant: [{ w: 'deplorable', m: '嘆かわしい' }], field: '性質・状態' }],
  ['exemplary', '形', '1', '模範的な・典型的な', 'His behavior was exemplary.', '彼の行いは模範的だった。', 'ラテン exemplum(手本)→ example と同系。', { syn: [{ w: 'model', m: '模範的な' }, { w: 'ideal', m: '理想的な' }], field: '性質・状態' }],
  ['mediocre', '形', '1', '平凡な・二流の', 'The film was mediocre.', 'その映画は平凡だった。', 'ラテン medius(中間)+ocris(山)→中ほど。', { syn: [{ w: 'average', m: '平均的な' }, { w: 'ordinary', m: '並みの' }], ant: [{ w: 'excellent', m: '優れた' }], field: '性質・状態' }],
  ['impeccable', '形', '1', '非の打ちどころのない・完璧な', 'She has impeccable manners.', '彼女の作法は完璧だ。', 'ラテン in(否定)+peccare(罪を犯す)。', { syn: [{ w: 'flawless', m: '欠点のない' }, { w: 'perfect', m: '完璧な' }], ant: [{ w: 'flawed', m: '欠陥のある' }], field: '性質・状態' }],
  ['faulty', '形', 'pre1', '欠陥のある・不完全な', 'The faulty wiring caused a fire.', '欠陥のある配線が火災を起こした。', 'fault(欠点)+ -y。', { syn: [{ w: 'defective', m: '欠陥のある' }, { w: 'flawed', m: '不完全な' }], ant: [{ w: 'flawless', m: '完璧な' }], field: '性質・状態' }],
  ['superb', '形', 'pre1', '見事な・素晴らしい', 'The view was superb.', '眺めは見事だった。', 'ラテン superbus(誇り高い)→ super と同系。', { syn: [{ w: 'excellent', m: '優れた' }, { w: 'magnificent', m: '壮麗な' }], ant: [{ w: 'awful', m: 'ひどい' }], field: '性質・状態' }],
]

export const WORDS_MORE35 = RAW.map(expandCompact)
