// 単語データ（継続 / 6000語へ）— 語族つき動詞/抽象名詞/上級形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 動詞
  ['avert', '動', '1', '(危険を)回避する・(目を)そらす', 'They averted a crisis.', '彼らは危機を回避した。', 'ラテン a+vertere(回す)→ vers と同系。', { syn: [{ w: 'prevent', m: '防ぐ' }, { w: 'avoid', m: '避ける' }], field: '動作・行為' }],
  ['confound', '動', '1', '当惑させる・混同する', 'The results confounded experts.', 'その結果は専門家を当惑させた。', 'ラテン con+fundere(注ぐ)→ fuse と同系。', { syn: [{ w: 'confuse', m: '混乱させる' }, { w: 'baffle', m: '困らせる' }], field: '動作・行為' }],
  ['curtail', '動', '1', '切り詰める・削減する', 'They curtailed spending.', '彼らは支出を切り詰めた。', '古フランス courtault(短くした)→ short と同系。', { syn: [{ w: 'reduce', m: '減らす' }, { w: 'cut back', m: '削減する' }], ant: [{ w: 'extend', m: '延ばす' }], field: '動作・行為' }],
  ['decipher', '動', '1', '解読する・判読する', 'She deciphered the code.', '彼女は暗号を解読した。', 'de+cipher(暗号)。', { syn: [{ w: 'decode', m: '解読する' }, { w: 'interpret', m: '読み解く' }], ant: [{ w: 'encode', m: '暗号化する' }], field: '技術' }],
  ['delineate', '動', '1', '描く・明確に示す', 'The report delineates the plan.', '報告書は計画を明確に描く。', 'ラテン de+linea(線)→ line と同系。', { syn: [{ w: 'outline', m: '概説する' }, { w: 'describe', m: '描写する' }], fam: [{ w: 'delineation', m: '描写' }], field: '動作・行為' }],
  ['dispel', '動', '1', '(疑い・不安を)払いのける', 'He dispelled their doubts.', '彼は彼らの疑念を晴らした。', 'ラテン dis+pellere(押す)→ pulse と同系。', { syn: [{ w: 'drive away', m: '追い払う' }, { w: 'banish', m: '払いのける' }], field: '動作・行為' }],
  ['emulate', '動', '1', '見習う・手本にする', 'Students emulate their mentors.', '学生は師を手本にする。', 'ラテン aemulus(競う)。', { syn: [{ w: 'imitate', m: 'まねる' }, { w: 'model after', m: '手本にする' }], fam: [{ w: 'emulation', m: '模倣' }], field: '動作・行為' }],
  ['envisage', '動', '1', '思い描く・予想する', 'We envisage rapid growth.', '私たちは急成長を見込んでいる。', 'フランス en+visage(顔)→心に描く。', { syn: [{ w: 'envision', m: '思い描く' }, { w: 'foresee', m: '予見する' }], field: '動作・行為' }],
  ['harness', '動', '1', '(自然力を)利用する・制御する', 'They harness solar energy.', '彼らは太陽エネルギーを活用する。', '古フランス harneis(馬具)。', { syn: [{ w: 'utilize', m: '活用する' }, { w: 'exploit', m: '利用する' }], field: '技術' }],
  ['infringe', '動', '1', '侵害する・違反する', 'It infringes their rights.', 'それは彼らの権利を侵害する。', 'ラテン in+frangere(壊す)→ fraction と同系。', { syn: [{ w: 'violate', m: '侵害する' }, { w: 'breach', m: '違反する' }], fam: [{ w: 'infringement', m: '侵害' }], field: '法律' }],
  ['invoke', '動', '1', '(法・権利を)発動する・引き合いに出す', 'They invoked emergency powers.', '彼らは非常権限を発動した。', 'ラテン in+vocare(呼ぶ)→ voc と同系。', { syn: [{ w: 'call upon', m: '頼る' }, { w: 'cite', m: '引用する' }], fam: [{ w: 'invocation', m: '祈願・発動' }], field: '法律' }],
  ['procure', '動', '1', '入手する・調達する', 'They procured the supplies.', '彼らは物資を調達した。', 'ラテン pro+curare(世話する)→ cure と同系。', { syn: [{ w: 'obtain', m: '入手する' }, { w: 'acquire', m: '獲得する' }], fam: [{ w: 'procurement', m: '調達' }], field: 'ビジネス' }],
  ['retaliate', '動', '1', '報復する・仕返しする', 'They retaliated with sanctions.', '彼らは制裁で報復した。', 'ラテン re+talis(同様の)→同じものを返す。', { syn: [{ w: 'revenge', m: '復讐する' }, { w: 'strike back', m: '反撃する' }], fam: [{ w: 'retaliation', m: '報復' }], field: '軍事' }],
  ['revere', '動', '1', '崇敬する・あがめる', 'They revere their ancestors.', '彼らは祖先をあがめる。', 'ラテン re+vereri(畏れる)。', { syn: [{ w: 'worship', m: '崇拝する' }, { w: 'venerate', m: 'あがめる' }], ant: [{ w: 'despise', m: '軽蔑する' }], fam: [{ w: 'reverence', m: '崇敬' }, { w: 'reverent', m: '敬虔な' }], field: '宗教' }],
  ['shun', '動', '1', '避ける・遠ざける', 'They shunned him after the scandal.', 'スキャンダル後、人々は彼を避けた。', '古英語 scunian(避ける)。', { syn: [{ w: 'avoid', m: '避ける' }, { w: 'ostracize', m: '排斥する' }], ant: [{ w: 'embrace', m: '受け入れる' }], field: '社会' }],
  // 抽象名詞
  ['atrocity', '名', '1', '残虐行為・暴虐', 'They condemned the atrocities.', '彼らはその残虐行為を非難した。', 'ラテン atrox(残忍な)。', { syn: [{ w: 'cruelty', m: '残酷' }, { w: 'barbarity', m: '蛮行' }], fam: [{ w: 'atrocious', m: '極悪な' }], field: '軍事' }],
  ['audacity', '名', '1', '大胆さ・厚かましさ', 'He had the audacity to refuse.', '彼は厚かましくも拒否した。', 'ラテン audax(大胆な)→ audacious と同系。', { syn: [{ w: 'boldness', m: '大胆さ' }, { w: 'nerve', m: '図々しさ' }], ant: [{ w: 'timidity', m: '臆病' }], fam: [{ w: 'audacious', m: '大胆な' }], field: '心理' }],
  ['composure', '名', '1', '落ち着き・平静', 'She kept her composure.', '彼女は平静を保った。', 'compose(落ち着かせる)+ -ure。', { syn: [{ w: 'calm', m: '冷静' }, { w: 'poise', m: '沈着' }], ant: [{ w: 'panic', m: '動転' }], field: '心理' }],
  ['discord', '名', '1', '不和・不協和音', 'There was discord among them.', '彼らの間には不和があった。', 'ラテン dis+cor(心)→心が離れる。', { syn: [{ w: 'conflict', m: '対立' }, { w: 'strife', m: '争い' }], ant: [{ w: 'harmony', m: '調和' }], field: '社会' }],
  ['grievance', '名', '1', '不満・苦情', 'They aired their grievances.', '彼らは不満をぶちまけた。', '古フランス grever(重くする)→ grave と同系。', { syn: [{ w: 'gripe', m: '不平' }], field: 'ビジネス' }],
  ['notoriety', '名', '1', '悪名・知れ渡っていること', 'He gained notoriety overnight.', '彼は一夜で悪名を得た。', 'ラテン notus(知られた)→ note と同系。', { syn: [{ w: 'infamy', m: '汚名' }], ant: [], fam: [{ w: 'notorious', m: '悪名高い' }], field: '社会' }],
  ['predicament', '名', '1', '苦境・窮地', 'They were in a difficult predicament.', '彼らは難しい苦境にあった。', 'ラテン praedicamentum(状態)。', { syn: [{ w: 'plight', m: '苦境' }, { w: 'dilemma', m: '板挟み' }], field: '一般' }],
  ['proficiency', '名', '1', '熟達・堪能', 'language proficiency', '言語の熟達度', 'ラテン proficere(進歩する)→ profit と同系。', { syn: [{ w: 'skill', m: '技能' }], ant: [{ w: 'incompetence', m: '無能' }], fam: [{ w: 'proficient', m: '堪能な' }], field: '教育' }],
  ['rapport', '名', '1', '良好な関係・親密さ', 'She built rapport with clients.', '彼女は顧客と良い関係を築いた。', 'フランス rapporter(持ち帰る)。', { syn: [{ w: 'bond', m: '絆' }, { w: 'affinity', m: '親近感' }], field: '社会' }],
  ['sanctuary', '名', '1', '聖域・避難所・保護区', 'a wildlife sanctuary', '野生生物保護区', 'ラテン sanctus(神聖な)→ saint と同系。', { syn: [{ w: 'refuge', m: '避難所' }, { w: 'haven', m: '安息所' }], field: '環境' }],
  ['stigma', '名', '1', '汚名・烙印', 'the stigma of failure', '失敗の烙印', 'ギリシャ stigma(刺し傷の印)。', { syn: [{ w: 'shame', m: '恥' }, { w: 'disgrace', m: '不名誉' }], fam: [{ w: 'stigmatize', m: '汚名を着せる' }], field: '社会' }],
  // 上級形容詞
  ['arduous', '形', '1', '骨の折れる・困難な', 'an arduous journey', '困難な旅', 'ラテン arduus(険しい)。', { syn: [{ w: 'difficult', m: '困難な' }, { w: 'strenuous', m: '骨の折れる' }], ant: [{ w: 'easy', m: '容易な' }], field: '性質・状態' }],
  ['compelling', '形', '1', '説得力のある・引き込まれる', 'a compelling argument', '説得力のある論拠', 'compel(強いる)+ -ing。', { syn: [{ w: 'persuasive', m: '説得力のある' }], ant: [{ w: 'weak', m: '弱い' }], field: '性質・状態' }],
  ['fervent', '形', '1', '熱烈な・熱心な', 'a fervent supporter', '熱烈な支持者', 'ラテン fervere(沸騰する)→ fever と同系。', { syn: [{ w: 'passionate', m: '情熱的な' }, { w: 'ardent', m: '熱烈な' }], ant: [{ w: 'indifferent', m: '無関心な' }], fam: [{ w: 'fervor', m: '熱情' }], field: '性質・状態' }],
  ['haphazard', '形', '1', '行き当たりばったりの・無計画な', 'a haphazard approach', '無計画なやり方', 'hap(偶然)+hazard(運)。', { syn: [{ w: 'random', m: '無作為の' }, { w: 'disorganized', m: '雑然とした' }], ant: [{ w: 'systematic', m: '体系的な' }], field: '性質・状態' }],
  ['incessant', '形', '1', '絶え間ない・ひっきりなしの', 'incessant noise', '絶え間ない騒音', 'ラテン in(否定)+cessare(やむ)→ cease と同系。', { syn: [{ w: 'constant', m: '絶え間ない' }, { w: 'ceaseless', m: 'やむことのない' }], ant: [{ w: 'intermittent', m: '断続的な' }], field: '性質・状態' }],
  ['meager', '形', '1', '乏しい・わずかな', 'a meager income', 'わずかな収入', 'ラテン macer(やせた)。', { syn: [{ w: 'scanty', m: '乏しい' }, { w: 'paltry', m: 'ささいな' }], ant: [{ w: 'abundant', m: '豊富な' }], field: '性質・状態' }],
  ['obstinate', '形', '1', '頑固な・強情な', 'He was obstinate about it.', '彼はそれについて頑固だった。', 'ラテン ob+stare(立つ)→ stand と同系。', { syn: [{ w: 'stubborn', m: '頑固な' }, { w: 'inflexible', m: '融通のきかない' }], ant: [{ w: 'flexible', m: '柔軟な' }], fam: [{ w: 'obstinacy', m: '頑固さ' }], field: '性質・状態' }],
  ['ruthless', '形', '1', '無慈悲な・容赦ない', 'a ruthless dictator', '冷酷な独裁者', 'ruth(哀れみ)+ -less。', { syn: [{ w: 'merciless', m: '無慈悲な' }, { w: 'brutal', m: '残忍な' }], ant: [{ w: 'merciful', m: '慈悲深い' }], field: '性質・状態' }],
  ['wary', '形', '1', '用心深い・警戒する', 'Be wary of strangers.', '見知らぬ人には用心して。', '古英語 wær(用心深い)→ aware と同系。', { syn: [{ w: 'cautious', m: '慎重な' }, { w: 'vigilant', m: '警戒した' }], ant: [{ w: 'careless', m: '不注意な' }], field: '性質・状態' }],
]

export const WORDS_MORE40 = RAW.map(expandCompact)
