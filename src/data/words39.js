// 単語データ（継続 / 6000語へ）— 語族つき動詞/抽象名詞/上級形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 動詞（語族つき）
  ['denounce', '動', '1', '公然と非難する・告発する', 'Leaders denounced the attack.', '指導者たちはその攻撃を非難した。', 'ラテン de+nuntiare(知らせる)→ announce と同系。', { syn: [{ w: 'condemn', m: '非難する' }, { w: 'criticize', m: '批判する' }], ant: [{ w: 'praise', m: '称賛する' }], fam: [{ w: 'denunciation', m: '糾弾' }], field: '社会' }],
  ['divert', '動', '1', 'そらす・転換する・気晴らしさせる', 'They diverted the river.', '彼らは川の流れを変えた。', 'ラテン dis+vertere(回す)→ vers と同系。', { syn: [{ w: 'redirect', m: '向け直す' }, { w: 'distract', m: '気をそらす' }], fam: [{ w: 'diversion', m: '転換・気晴らし' }], field: '動作・行為' }],
  ['erupt', '動', 'pre1', '噴火する・勃発する', 'The volcano erupted suddenly.', '火山が突然噴火した。', 'ラテン e+rumpere(破る)→ rupture と同系。', { syn: [{ w: 'explode', m: '爆発する' }, { w: 'break out', m: '勃発する' }], fam: [{ w: 'eruption', m: '噴火・勃発' }], field: '地理' }],
  ['penetrate', '動', '1', '貫く・浸透する・見抜く', 'Light penetrated the clouds.', '光が雲を突き抜けた。', 'ラテン penetrare(中に入る)。', { syn: [{ w: 'pierce', m: '貫く' }, { w: 'enter', m: '入り込む' }], fam: [{ w: 'penetration', m: '浸透' }], field: '動作・行為' }],
  ['preclude', '動', '1', '不可能にする・妨げる', 'His age does not preclude success.', '彼の年齢は成功を妨げない。', 'ラテン prae+claudere(閉じる)→ close と同系。', { syn: [{ w: 'prevent', m: '妨げる' }, { w: 'rule out', m: '除外する' }], field: '動作・行為' }],
  ['prolong', '動', 'pre1', '延長する・長引かせる', "Don't prolong the meeting.", '会議を長引かせないで。', 'ラテン pro+longus(長い)→ long と同系。', { syn: [{ w: 'extend', m: '延ばす' }], ant: [], fam: [{ w: 'prolonged', m: '長引いた' }], field: '動作・行為' }],
  ['propel', '動', '1', '推進する・駆り立てる', 'Engines propel the ship.', 'エンジンが船を推進する。', 'ラテン pro+pellere(押す)→ pulse と同系。', { syn: [{ w: 'drive', m: '推し進める' }, { w: 'push', m: '押す' }], fam: [{ w: 'propulsion', m: '推進' }, { w: 'propeller', m: 'プロペラ' }], field: '技術' }],
  ['ratify', '動', '1', '批准する・正式に承認する', 'The treaty was ratified.', 'その条約は批准された。', 'ラテン ratus(確定した)+facere。', { syn: [{ w: 'approve', m: '承認する' }, { w: 'confirm', m: '確認する' }], ant: [{ w: 'reject', m: '拒否する' }], fam: [{ w: 'ratification', m: '批准' }], field: '政治' }],
  ['repel', '動', '1', '撃退する・はじく・不快にさせる', 'The coating repels water.', 'その塗装は水をはじく。', 'ラテン re+pellere(押す)→ pulse と同系。', { syn: [{ w: 'drive back', m: '撃退する' }, { w: 'ward off', m: '寄せつけない' }], ant: [{ w: 'attract', m: '引きつける' }], fam: [{ w: 'repellent', m: '虫よけ・はじく' }], field: '動作・行為' }],
  ['revoke', '動', '1', '取り消す・撤回する', 'They revoked his license.', '彼らは彼の免許を取り消した。', 'ラテン re+vocare(呼ぶ)→ voc と同系。', { syn: [{ w: 'cancel', m: '取り消す' }, { w: 'withdraw', m: '撤回する' }], ant: [{ w: 'grant', m: '与える' }], fam: [{ w: 'revocation', m: '取り消し' }], field: '法律' }],
  ['segregate', '動', '1', '分離する・隔離する', 'The system segregated the groups.', 'その制度は集団を分離した。', 'ラテン se+grex(群れ)→群れから分ける。', { syn: [{ w: 'separate', m: '分ける' }, { w: 'isolate', m: '隔離する' }], ant: [{ w: 'integrate', m: '統合する' }], fam: [{ w: 'segregation', m: '分離・人種隔離' }], field: '社会' }],
  ['transcend', '動', '1', '超越する・しのぐ', 'Great art transcends time.', '偉大な芸術は時代を超える。', 'ラテン trans+scandere(登る)→越えて登る。', { syn: [{ w: 'surpass', m: 'しのぐ' }, { w: 'exceed', m: '超える' }], fam: [{ w: 'transcendent', m: '超越した' }], field: '芸術' }],
  ['enroll', '動', 'pre1', '登録する・入学させる', 'She enrolled in the course.', '彼女はその講座に登録した。', 'en+roll(名簿)→名簿に載せる。', { syn: [{ w: 'register', m: '登録する' }, { w: 'sign up', m: '加入する' }], fam: [{ w: 'enrollment', m: '登録・入学' }], field: '教育' }],
  // 抽象名詞
  ['discrepancy', '名', '1', '食い違い・不一致', 'There is a discrepancy in the figures.', '数字に食い違いがある。', 'ラテン dis+crepare(音を立てる)→不協和。', { syn: [{ w: 'inconsistency', m: '矛盾' }], ant: [{ w: 'agreement', m: '一致' }], field: '一般' }],
  ['equilibrium', '名', '1', '均衡・平衡', 'The market reached equilibrium.', '市場は均衡に達した。', 'ラテン aequus(等しい)+libra(秤)。', { syn: [{ w: 'balance', m: '均衡' }, { w: 'stability', m: '安定' }], ant: [{ w: 'imbalance', m: '不均衡' }], field: '科学' }],
  ['epitome', '名', '1', '典型・縮図', 'She is the epitome of grace.', '彼女は優雅さの典型だ。', 'ギリシャ epi+temnein(切る)→要約。', { syn: [{ w: 'embodiment', m: '権化' }, { w: 'model', m: '典型' }], field: '一般' }],
  ['nuance', '名', '1', '微妙な差・ニュアンス', 'He missed the nuance of the word.', '彼はその語の微妙な意味を逃した。', 'フランス nuance(色合い)→ラテン nubes(雲)。', { syn: [{ w: 'subtlety', m: '微妙さ' }, { w: 'shade', m: '色合い' }], fam: [{ w: 'nuanced', m: '微妙な' }], field: '言語' }],
  ['paradigm', '名', '1', 'パラダイム・模範・枠組み', 'It marked a paradigm shift.', 'それはパラダイムの転換を示した。', 'ギリシャ para+deiknynai(示す)。', { syn: [{ w: 'model', m: '模範' }, { w: 'framework', m: '枠組み' }], field: '科学' }],
  ['trajectory', '名', '1', '軌道・軌跡', 'the trajectory of the ball', 'ボールの軌道', 'ラテン trans+jacere(投げる)→ ject と同系。', { syn: [{ w: 'path', m: '経路' }, { w: 'course', m: '進路' }], field: '科学' }],
  ['vicinity', '名', '1', '近所・付近', 'shops in the vicinity', '付近の店', 'ラテン vicinus(隣の)。', { syn: [{ w: 'neighborhood', m: '近所' }, { w: 'surroundings', m: '周辺' }], field: '地理' }],
  // 上級形容詞
  ['conducive', '形', '1', '〜の助けになる・つながる', 'Quiet is conducive to study.', '静けさは勉強に役立つ。', 'ラテン con+ducere(導く)→ duct と同系。', { syn: [{ w: 'helpful', m: '役立つ' }, { w: 'favorable', m: '好都合な' }], ant: [{ w: 'hindering', m: '妨げる' }], field: '性質・状態' }],
  ['detrimental', '形', '1', '有害な・不利な', 'Smoking is detrimental to health.', '喫煙は健康に有害だ。', 'ラテン de+terere(すり減らす)。', { syn: [{ w: 'harmful', m: '有害な' }, { w: 'damaging', m: '損なう' }], ant: [{ w: 'beneficial', m: '有益な' }], fam: [{ w: 'detriment', m: '損害' }], field: '性質・状態' }],
  ['inclusive', '形', 'pre1', '包括的な・すべてを含む', 'The price is inclusive of tax.', 'その価格は税込みだ。', 'include(含む)+ -ive。', { syn: [{ w: 'comprehensive', m: '包括的な' }], ant: [], fam: [{ w: 'inclusion', m: '包含' }, { w: 'include', m: '含む' }], field: '性質・状態' }],
  ['subsequent', '形', '1', 'その後の・続いて起こる', 'subsequent events', 'その後の出来事', 'ラテン sub+sequi(続く)→ sequence と同系。', { syn: [{ w: 'later', m: 'のちの' }], ant: [{ w: 'previous', m: '以前の' }], fam: [{ w: 'subsequently', m: 'その後' }], field: '性質・状態' }],
  ['ubiquitous', '形', '1', '至る所にある・遍在する', 'Smartphones are now ubiquitous.', '今やスマホは至る所にある。', 'ラテン ubique(どこにでも)。', { syn: [{ w: 'omnipresent', m: '遍在する' }, { w: 'widespread', m: '広く普及した' }], ant: [{ w: 'rare', m: 'まれな' }], field: '性質・状態' }],
  ['peripheral', '形', '1', '周辺の・末梢の・重要でない', 'a peripheral issue', '周辺的な問題', 'ギリシャ peri(周り)+pherein(運ぶ)。', { syn: [{ w: 'secondary', m: '二次的な' }, { w: 'marginal', m: '周辺の' }], ant: [{ w: 'central', m: '中心的な' }], field: '性質・状態' }],
  ['integral', '形', '1', '不可欠な・全体を成す', 'Trust is integral to teamwork.', '信頼はチームワークに不可欠だ。', 'ラテン integer(完全な)→ integrity と同系。', { syn: [{ w: 'essential', m: '不可欠な' }, { w: 'fundamental', m: '基本的な' }], ant: [{ w: 'peripheral', m: '周辺的な' }], field: '性質・状態' }],
]

export const WORDS_MORE38 = RAW.map(expandCompact)
