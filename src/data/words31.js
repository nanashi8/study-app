// 単語データ（継続 / 6000語へ）— 因果・付与・変換の動詞/抽象名詞/上級形容詞/接続副詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 因果・付与の動詞
  ['spur', '動', '1', '拍車をかける・駆り立てる・拍車(名)', 'Tax cuts spurred growth.', '減税は成長を促した。', '古英語 spura(馬の拍車)。', { syn: [{ w: 'stimulate', m: '刺激する' }, { w: 'prompt', m: '促す' }], ant: [{ w: 'hinder', m: '妨げる' }], field: '動作・行為' }],
  ['incite', '動', '1', '扇動する・あおる', 'He incited the crowd to riot.', '彼は群衆を暴動へ扇動した。', 'ラテン in+citare(呼び起こす)→ cite と同系。', { syn: [{ w: 'provoke', m: '挑発する' }, { w: 'stir up', m: 'あおる' }], field: '動作・行為' }],
  ['ignite', '動', '1', '点火する・燃え上がらせる', 'A spark ignited the gas.', '火花がガスに点火した。', 'ラテン ignis(火)→ ignition と同系。', { syn: [{ w: 'kindle', m: '火をつける' }, { w: 'spark', m: '引き起こす' }], ant: [{ w: 'extinguish', m: '消す' }], field: '動作・行為' }],
  ['spawn', '動', '1', '生み出す・産卵する', 'The hit spawned many sequels.', 'そのヒット作は多くの続編を生んだ。', '古フランス espandre(広げる)→ expand と同系。', { syn: [{ w: 'generate', m: '生み出す' }, { w: 'produce', m: '生む' }], field: '動作・行為' }],
  ['breed', '動', 'pre1', '繁殖させる・育てる・(品)種(名)', 'They breed horses on the farm.', '彼らは農場で馬を繁殖させる。', '古英語 brēdan(育てる)。', { syn: [{ w: 'raise', m: '育てる' }, { w: 'reproduce', m: '繁殖する' }], field: '動作・行為' }],
  ['necessitate', '動', '1', '必要とさせる・余儀なくさせる', 'The injury necessitated surgery.', 'そのけがは手術を必要とした。', 'ラテン necesse(必要な)→ necessary と同系。', { syn: [{ w: 'require', m: '必要とする' }, { w: 'demand', m: '要する' }], field: '動作・行為' }],
  ['warrant', '動', '1', '正当化する・保証する・令状(名)', 'The crime warrants punishment.', 'その罪は罰に値する。', '古北フランス warant(保証)→ guarantee と同系。', { syn: [{ w: 'justify', m: '正当化する' }, { w: 'deserve', m: '値する' }], field: '法律' }],
  ['entitle', '動', '1', '権利を与える・題をつける', 'The ticket entitles you to entry.', 'その券で入場できる。', 'en(〜にする)+title(資格・題)。', { syn: [{ w: 'authorize', m: '権限を与える' }], field: '法律' }],
  ['empower', '動', '1', '権限を与える・力をつける', 'Education empowers people.', '教育は人々に力を与える。', 'em(〜にする)+power(力)。', { syn: [{ w: 'enable', m: '可能にする' }, { w: 'authorize', m: '権限を与える' }], field: '動作・行為' }],
  ['equip', '動', 'pre1', '装備させる・備えさせる', 'They equipped the lab with tools.', '彼らは研究室に道具をそろえた。', '古フランス esquiper(船に装備する)。', { syn: [{ w: 'furnish', m: '備え付ける' }, { w: 'supply', m: '供給する' }], field: '動作・行為' }],
  ['bestow', '動', '1', '授ける・与える', 'They bestowed an award on her.', '彼らは彼女に賞を授けた。', 'be(完全に)+stow(置く)。', { syn: [{ w: 'grant', m: '与える' }, { w: 'confer', m: '授与する' }], field: '動作・行為' }],
  ['confer', '動', '1', '授与する・相談する', 'A degree was conferred on him.', '彼に学位が授与された。', 'ラテン com+ferre(運ぶ)→ fer と同源。', { syn: [{ w: 'grant', m: '授ける' }, { w: 'consult', m: '相談する' }], field: '動作・行為' }],
  ['grant', '動', 'pre1', '与える・認める・助成金(名)', 'They granted him permission.', '彼らは彼に許可を与えた。', '古フランス granter(同意する)。', { syn: [{ w: 'give', m: '与える' }, { w: 'award', m: '授与する' }], ant: [{ w: 'deny', m: '拒む' }], field: '動作・行為' }],
  // 変換・修正の動詞
  ['adjust', '動', 'pre2', '調整する・順応する', 'Adjust the volume, please.', '音量を調整して。', '後期ラテン語 adiuxtare（近くへ寄せる）から。juxta は「近くに」で、just（公正な）と同じ語根ではない。', { syn: [{ w: 'adapt', m: '適応する' }, { w: 'modify', m: '修正する' }], field: '動作・行為' }],
  ['revive', '動', '1', '生き返らせる・復活させる', 'They revived an old tradition.', '彼らは古い伝統を復活させた。', 'ラテン re+vivere(生きる)→ vivid と同系。', { syn: [{ w: 'restore', m: '回復させる' }, { w: 'renew', m: '一新する' }], field: '動作・行為' }],
  ['amend', '動', '1', '修正する・改正する', 'They amended the law.', '彼らは法律を改正した。', 'ラテン emendare(誤りを正す)→ mend と同系。', { syn: [{ w: 'revise', m: '改訂する' }, { w: 'correct', m: '正す' }], field: '法律' }],
  ['rectify', '動', '1', '是正する・正す', 'We must rectify the error.', '私たちはその誤りを正さねば。', 'ラテン rectus(正しい)+facere(する)→ correct と同系。', { syn: [{ w: 'correct', m: '直す' }, { w: 'fix', m: '修正する' }], field: '動作・行為' }],
  ['overhaul', '動', '1', '徹底的に見直す・分解修理する', 'They overhauled the engine.', '彼らはエンジンを分解修理した。', 'over(すっかり)+haul(引く)。', { syn: [{ w: 'revamp', m: '刷新する' }, { w: 'renovate', m: '改修する' }], field: '動作・行為' }],
  // 抽象名詞
  ['onset', '名', '1', '始まり・発症', 'the onset of winter', '冬の到来', 'on+set(始まる)。', { syn: [{ w: 'beginning', m: '始まり' }, { w: 'start', m: '開始' }], ant: [{ w: 'end', m: '終わり' }], field: '一般' }],
  ['culmination', '名', '1', '頂点・最高潮', 'It was the culmination of years of work.', 'それは長年の努力の集大成だった。', 'ラテン culmen(頂上)。', { syn: [{ w: 'climax', m: '最高潮' }, { w: 'peak', m: '頂点' }], field: '一般' }],
  ['climax', '名', 'pre1', '最高潮・クライマックス', 'The story reaches its climax here.', '物語はここで最高潮に達する。', 'ギリシャ klimax(はしご)。', { syn: [{ w: 'peak', m: '頂点' }, { w: 'culmination', m: '集大成' }], ant: [{ w: 'anticlimax', m: '尻すぼみ' }], field: '芸術' }],
  ['brink', '名', '1', '瀬戸際・縁', 'on the brink of war', '戦争の瀬戸際で', '中低ドイツ語 brink(縁)。', { syn: [{ w: 'verge', m: '間際' }, { w: 'edge', m: '縁' }], field: '一般' }],
  ['verge', '名', '1', '間際・縁', 'She was on the verge of tears.', '彼女は今にも泣きそうだった。', 'ラテン virga(小枝・棒)。', { syn: [{ w: 'brink', m: '瀬戸際' }, { w: 'edge', m: '縁' }], field: '一般' }],
  ['span', '名', 'pre1', '期間・幅・及ぶ(動)', 'a short span of time', '短い期間', '古英語 spann(手の幅)。', { syn: [{ w: 'period', m: '期間' }, { w: 'range', m: '範囲' }], field: '測定' }],
  ['duration', '名', 'pre1', '持続時間・期間', 'the duration of the film', '映画の上映時間', 'ラテン durare(続く)→ during と同源。', { syn: [{ w: 'period', m: '期間' }], field: '測定' }],
  ['inclination', '名', '1', '傾向・好み・傾斜', 'She has an inclination to help.', '彼女は人を助ける傾向がある。', 'ラテン in+clinare(傾く)→ incline と同源。', { syn: [{ w: 'tendency', m: '傾向' }, { w: 'preference', m: '好み' }], field: '心理' }],
  ['propensity', '名', '1', '傾向・性癖', 'a propensity for risk', 'リスクを好む性向', 'ラテン pro+pendere(傾く)→ pend と同系。', { syn: [{ w: 'tendency', m: '傾向' }, { w: 'inclination', m: '性向' }], field: '心理' }],
  ['aptitude', '名', '1', '素質・適性', 'She has an aptitude for math.', '彼女は数学の素質がある。', 'ラテン aptus(適した)→ apt と同系。', { syn: [{ w: 'talent', m: '才能' }, { w: 'ability', m: '能力' }], field: '心理' }],
  // 上級形容詞
  ['convoluted', '形', '1', '入り組んだ・難解な', 'The plot was convoluted.', '筋が入り組んでいた。', 'ラテン con+volvere(巻く)→ revolve と同系。', { syn: [{ w: 'complicated', m: 'ややこしい' }], ant: [{ w: 'straightforward', m: '分かりやすい' }], field: '性質・状態' }],
  ['straightforward', '形', 'pre1', '分かりやすい・率直な', 'The task is straightforward.', 'その作業は単純明快だ。', 'straight(まっすぐ)+forward(前へ)。', { syn: [{ w: 'simple', m: '簡単な' }, { w: 'clear', m: '明快な' }], ant: [{ w: 'complicated', m: '複雑な' }], field: '性質・状態' }],
  ['discreet', '形', '1', '思慮深い・控えめな', 'Please be discreet about this.', 'この件は内密にして。', 'ラテン discernere(見分ける)→ discern と同系。', { syn: [{ w: 'careful', m: '慎重な' }, { w: 'tactful', m: '如才ない' }], ant: [{ w: 'indiscreet', m: '軽率な' }], field: '性質・状態' }],
  ['overt', '形', '1', '公然の・明白な', 'There was overt hostility.', '公然たる敵意があった。', '古フランス overt(開かれた)→ overture と同系。', { syn: [{ w: 'open', m: '公然の' }, { w: 'obvious', m: '明白な' }], ant: [{ w: 'covert', m: '隠れた' }], field: '性質・状態' }],
  ['covert', '形', '1', '秘密の・隠れた', 'They ran a covert operation.', '彼らは秘密作戦を実行した。', '古フランス covert(覆われた)→ cover と同系。', { syn: [{ w: 'secret', m: '秘密の' }, { w: 'hidden', m: '隠れた' }], ant: [{ w: 'overt', m: '公然の' }], field: '性質・状態' }],
  ['latent', '形', '1', '潜在的な・隠れた', 'She has latent talent.', '彼女には潜在的な才能がある。', 'ラテン latere(隠れる)。', { syn: [{ w: 'hidden', m: '隠れた' }, { w: 'potential', m: '潜在的な' }], ant: [{ w: 'evident', m: '明白な' }], field: '性質・状態' }],
  ['dormant', '形', '1', '休眠中の・活動していない', 'The volcano is dormant.', 'その火山は休火山だ。', 'ラテン dormire(眠る)→ dormitory と同系。', { syn: [{ w: 'inactive', m: '不活発な' }, { w: 'sleeping', m: '眠っている' }], ant: [{ w: 'active', m: '活動的な' }], field: '性質・状態' }],
  ['potent', '形', '1', '強力な・効き目のある', 'It is a potent drug.', 'それは強力な薬だ。', 'ラテン potens(力のある)→ power と同系。', { syn: [{ w: 'powerful', m: '強力な' }, { w: 'strong', m: '強い' }], ant: [{ w: 'weak', m: '弱い' }], field: '性質・状態' }],
  ['robust', '形', '1', '頑健な・堅固な', 'The economy remains robust.', '経済は堅調を保っている。', 'ラテン robur(樫の木・力)。', { syn: [{ w: 'strong', m: '強い' }, { w: 'sturdy', m: '頑丈な' }], ant: [{ w: 'fragile', m: 'もろい' }], field: '性質・状態' }],
  ['brittle', '形', '1', 'もろい・壊れやすい', 'Old paper becomes brittle.', '古い紙はもろくなる。', '中英語 britel→ break と同系。', { syn: [{ w: 'fragile', m: '壊れやすい' }], ant: [{ w: 'flexible', m: 'しなやかな' }], field: '性質・状態' }],
  ['sturdy', '形', 'pre1', '頑丈な・たくましい', 'It is a sturdy table.', 'それは頑丈な机だ。', '古フランス estourdi(向こう見ずな)。', { syn: [{ w: 'strong', m: '丈夫な' }, { w: 'robust', m: '頑健な' }], ant: [{ w: 'flimsy', m: 'もろい' }], field: '性質・状態' }],
  ['flimsy', '形', '1', '薄っぺらな・もろい・説得力のない', 'It was a flimsy excuse.', 'それは見え透いた言い訳だった。', '由来不確か(18世紀)。', { syn: [{ w: 'weak', m: '弱い' }, { w: 'feeble', m: '貧弱な' }], ant: [{ w: 'sturdy', m: '頑丈な' }], field: '性質・状態' }],
  ['bleak', '形', '1', '暗い・荒涼とした・わびしい', 'The future looks bleak.', '将来は暗そうだ。', '古ノルド bleikr(青白い)→ bleach と同系。', { syn: [{ w: 'gloomy', m: '陰気な' }, { w: 'dismal', m: '陰うつな' }], ant: [{ w: 'bright', m: '明るい' }], field: '性質・状態' }],
  ['serene', '形', '1', '穏やかな・静かな', 'a serene lake at dawn', '夜明けの静かな湖', 'ラテン serenus(澄んだ)。', { syn: [{ w: 'calm', m: '穏やかな' }], ant: [{ w: 'turbulent', m: '荒れた' }], field: '性質・状態' }],
  // 接続副詞
  ['thereby', '副', '1', 'それによって', 'He saved money, thereby retiring early.', '彼は貯金し、それで早く引退した。', 'there(それ)+by(によって)。', { syn: [{ w: 'thus', m: 'こうして' }], field: '副詞' }],
  ['henceforth', '副', '1', '今後は', 'Henceforth, the rule applies.', '今後この規則が適用される。', 'hence(今から)+forth(先へ)。', { syn: [{ w: 'from now on', m: '今後' }], field: '副詞' }],
  ['hitherto', '副', '1', '今まで・これまで', 'a hitherto unknown fact', 'これまで知られていなかった事実', 'hither(ここまで)+to。', { syn: [{ w: 'until now', m: '今まで' }, { w: 'previously', m: '以前は' }], field: '副詞' }],
  ['notwithstanding', '前', '1', '〜にもかかわらず', 'Notwithstanding the rain, they played.', '雨にもかかわらず彼らは試合をした。', 'not+withstanding(逆らって立つ)。', { syn: [{ w: 'despite', m: '〜にもかかわらず' }, { w: 'in spite of', m: '〜をよそに' }], field: '機能語' }],
  ['albeit', '接', '1', '〜だけれども', 'It was useful, albeit expensive.', '高くついたが、役には立った。', 'all+be+it(たとえそうであっても)。', { syn: [{ w: 'although', m: '〜だが' }, { w: 'even though', m: 'たとえ〜でも' }], field: '機能語' }],
  ['conversely', '副', '1', '逆に・反対に', 'Conversely, prices may fall.', '逆に価格は下がるかもしれない。', 'converse(逆)+ -ly→ vers と同系。', { syn: [{ w: 'on the other hand', m: '他方' }], field: '副詞' }],
  ['invariably', '副', '1', '常に・決まって', 'He is invariably late.', '彼は決まって遅れる。', 'in(否定)+variable(変わる)+ -ly。', { syn: [{ w: 'always', m: 'いつも' }, { w: 'consistently', m: '一貫して' }], ant: [{ w: 'occasionally', m: '時々' }], field: '副詞' }],
  ['abruptly', '副', 'pre1', '突然・ぶっきらぼうに', 'The meeting ended abruptly.', '会議は突然終わった。', 'abrupt(突然の)+ -ly。', { syn: [{ w: 'suddenly', m: '突然' }], ant: [{ w: 'gradually', m: '徐々に' }], field: '副詞' }],
  ['drastically', '副', '1', '抜本的に・劇的に', 'Sales dropped drastically.', '売上が激減した。', 'drastic(思い切った)+ -ly。', { syn: [{ w: 'dramatically', m: '劇的に' }, { w: 'sharply', m: '急激に' }], field: '副詞' }],
]

export const WORDS_MORE30 = RAW.map(expandCompact)
