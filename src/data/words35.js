// 単語データ（継続 / 6000語へ）— 出来事・対立の名詞/対立・社会の動詞/態度・感情の形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 出来事・対立の名詞
  ['incident', '名', 'pre1', '出来事・事件', 'A strange incident occurred.', '奇妙な出来事が起きた。', 'ラテン in+cadere(降りかかる)→ accident と同系。', { syn: [{ w: 'event', m: '出来事' }], field: '一般' }],
  ['episode', '名', 'pre1', '挿話・(連続物の)1話', 'I missed the last episode.', '私は最終話を見逃した。', 'ギリシャ epeisodion(挿入部)。', { syn: [{ w: 'event', m: '出来事' }, { w: 'installment', m: '一回分' }], field: 'メディア' }],
  ['scenario', '名', 'pre1', '筋書き・想定状況', 'Consider the worst-case scenario.', '最悪の事態を想定して。', 'イタリア scenario(舞台背景)→ scene と同系。', { syn: [{ w: 'situation', m: '状況' }, { w: 'script', m: '台本' }], field: '一般' }],
  ['ordeal', '名', '1', '厳しい試練・苦難', 'The journey was an ordeal.', 'その旅は苦難だった。', '古英語 ordǣl(裁き・神判)。', { syn: [{ w: 'hardship', m: '苦難' }, { w: 'trial', m: '試練' }], field: '一般' }],
  ['commotion', '名', '1', '騒ぎ・動揺', 'There was a commotion outside.', '外で騒ぎが起きた。', 'ラテン com+motio(動き)→ motion と同系。', { syn: [{ w: 'uproar', m: '大騒ぎ' }], ant: [{ w: 'calm', m: '静けさ' }], field: '一般' }],
  ['uproar', '名', '1', '大騒ぎ・激しい抗議', 'The decision caused an uproar.', 'その決定は大騒ぎを引き起こした。', 'オランダ oproer(反乱)。', { syn: [{ w: 'commotion', m: '騒ぎ' }, { w: 'outcry', m: '抗議' }], field: '社会' }],
  ['riot', '名', '1', '暴動', 'A riot broke out in the city.', '都市で暴動が起きた。', '古フランス riote(口論)。', { syn: [{ w: 'revolt', m: '反乱' }, { w: 'uprising', m: '蜂起' }], field: '政治' }],
  ['feud', '名', '1', '確執・宿恨', 'The two families have a long feud.', '両家は長年の確執がある。', '古フランス faide(敵意)。', { syn: [{ w: 'conflict', m: '対立' }, { w: 'quarrel', m: '争い' }], ant: [{ w: 'peace', m: '和解' }], field: '社会' }],
  ['quarrel', '名', 'pre1', '口論・けんか・口論する(動)', 'They had a quarrel over money.', '彼らはお金のことで口論した。', 'ラテン queri(不平を言う)。', { syn: [{ w: 'argument', m: '口論' }, { w: 'dispute', m: '論争' }], ant: [{ w: 'reconciliation', m: '和解' }], field: '社会' }],
  ['clash', '名', 'pre1', '衝突・不一致・ぶつかる(動)', 'There was a clash of opinions.', '意見の衝突があった。', '擬音語(16世紀)。', { syn: [{ w: 'conflict', m: '衝突' }], field: '社会' }],
  ['truce', '名', '1', '休戦・停戦', 'They agreed to a truce.', '彼らは休戦に合意した。', '古英語 trēow(信義)→ true と同系。', { syn: [{ w: 'ceasefire', m: '停戦' }, { w: 'armistice', m: '休戦' }], ant: [{ w: 'war', m: '戦争' }], field: '軍事' }],
  ['compromise', '名', 'pre1', '妥協・歩み寄り・妥協する(動)', 'They reached a compromise.', '彼らは妥協に達した。', 'ラテン com+promittere(互いに約束する)→ promise と同系。', { syn: [{ w: 'agreement', m: '合意' }, { w: 'settlement', m: '和解' }], field: '社会' }],
  ['alliance', '名', '1', '同盟・連携', 'They formed an alliance.', '彼らは同盟を結んだ。', 'ally(同盟する)+ -ance。', { syn: [{ w: 'coalition', m: '連立' }, { w: 'partnership', m: '提携' }], ant: [{ w: 'rivalry', m: '対立' }], field: '政治' }],
  ['coalition', '名', '1', '連立・連合', 'A coalition government was formed.', '連立政権が成立した。', 'ラテン co+alescere(共に育つ)。', { syn: [{ w: 'alliance', m: '同盟' }, { w: 'union', m: '連合' }], field: '政治' }],
  // 対立・社会の動詞
  ['mediate', '動', '1', '仲裁する・調停する', 'The UN mediated the conflict.', '国連はその紛争を仲裁した。', 'ラテン medius(中間の)→ medium と同系。', { syn: [{ w: 'arbitrate', m: '裁定する' }, { w: 'intervene', m: '介入する' }], field: '政治' }],
  ['arbitrate', '動', '1', '仲裁する・裁定する', 'A judge arbitrated the dispute.', '裁判官が紛争を裁定した。', 'ラテン arbiter(裁定者)→ arbitrary と同系。', { syn: [{ w: 'mediate', m: '仲裁する' }, { w: 'judge', m: '裁く' }], field: '法律' }],
  ['collide', '動', '1', '衝突する・対立する', 'Two cars collided on the road.', '2台の車が道路で衝突した。', 'ラテン com+laedere(傷つける)。', { syn: [{ w: 'crash', m: 'ぶつかる' }, { w: 'clash', m: '衝突する' }], field: '動作・行為' }],
  ['merge', '動', 'pre1', '合併する・融合する', 'The two firms merged.', '2社は合併した。', 'ラテン mergere(沈める・浸す)。', { syn: [{ w: 'combine', m: '結合する' }, { w: 'unite', m: '統合する' }], ant: [{ w: 'split', m: '分裂する' }], field: 'ビジネス' }],
  ['disband', '動', '1', '解散する・解体する', 'The group disbanded last year.', 'その集団は昨年解散した。', 'dis(分離)+band(団)。', { syn: [{ w: 'dissolve', m: '解散する' }, { w: 'break up', m: '解散する' }], ant: [{ w: 'unite', m: '結成する' }], field: '社会' }],
  ['sever', '動', '1', '断ち切る・切断する', 'They severed all ties.', '彼らは一切の関係を絶った。', 'ラテン separare(分ける)→ separate と同系。', { syn: [{ w: 'cut off', m: '断つ' }, { w: 'break', m: '断絶する' }], ant: [{ w: 'join', m: 'つなぐ' }], field: '動作・行為' }],
  // 社会・協力の動詞
  ['accompany', '動', 'pre1', '同行する・伴奏する', 'She accompanied him to the door.', '彼女は彼を戸口まで送った。', 'ラテン ad+companio(仲間)→ company と同系。', { syn: [{ w: 'escort', m: '付き添う' }, { w: 'go with', m: '一緒に行く' }], field: '動作・行為' }],
  ['coordinate', '動', '1', '調整する・連携させる', 'She coordinates the project.', '彼女はその事業を調整する。', 'ラテン co+ordinare(整える)→ order と同系。', { syn: [{ w: 'organize', m: 'まとめる' }, { w: 'arrange', m: '手配する' }], field: '動作・行為' }],
  ['mingle', '動', '1', '混ざる・歓談する', 'Guests mingled at the party.', '客はパーティーで歓談した。', '古英語 mengan(混ぜる)→ among と同系。', { syn: [{ w: 'mix', m: '混ざる' }, { w: 'socialize', m: '交流する' }], field: '社会' }],
  ['interact', '動', 'pre1', '交流する・相互に作用する', 'Children interact through play.', '子供は遊びを通じて交流する。', 'inter(相互に)+act(作用する)。', { field: '社会' }],
  ['associate', '動', 'pre1', '関連づける・付き合う・仲間(名)', 'I associate this song with summer.', 'この歌は夏を連想させる。', 'ラテン ad+socius(仲間)→ social と同系。', { syn: [{ w: 'connect', m: '結びつける' }, { w: 'link', m: '関連づける' }], field: '社会' }],
  ['affiliate', '動', '1', '提携させる・加入させる・系列(名)', 'The clinic is affiliated with a hospital.', 'その診療所は病院と提携している。', 'ラテン ad+filius(息子)→子会社化。', { syn: [{ w: 'associate', m: '提携する' }], field: 'ビジネス' }],
  // 態度の形容詞
  ['exhaustive', '形', '1', '徹底的な・網羅的な', 'They did an exhaustive search.', '彼らは徹底的な調査をした。', 'exhaust(使い果たす)+ -ive。', { syn: [{ w: 'thorough', m: '徹底した' }, { w: 'comprehensive', m: '包括的な' }], ant: [{ w: 'cursory', m: 'ざっとした' }], field: '性質・状態' }],
  ['painstaking', '形', '1', '骨の折れる・入念な', 'It was painstaking work.', 'それは丹念を要する作業だった。', 'pains(苦労)+taking(取ること)。', { syn: [{ w: 'careful', m: '念入りな' }, { w: 'meticulous', m: '几帳面な' }], ant: [{ w: 'careless', m: '雑な' }], field: '性質・状態' }],
  ['diligent', '形', 'pre1', '勤勉な・熱心な', 'He is a diligent student.', '彼は勤勉な学生だ。', 'ラテン diligere(熱心に選ぶ)。', { syn: [{ w: 'hardworking', m: '勤勉な' }, { w: 'industrious', m: '勤勉な' }], ant: [{ w: 'lazy', m: '怠惰な' }], field: '性質・状態' }],
  ['conscientious', '形', '1', '良心的な・誠実な', 'a conscientious worker', '誠実な働き手', 'ラテン conscientia(良心)→ science と同系。', { syn: [{ w: 'diligent', m: '勤勉な' }, { w: 'thorough', m: '入念な' }], ant: [{ w: 'negligent', m: '怠慢な' }], field: '性質・状態' }],
  ['negligent', '形', '1', '怠慢な・不注意な', 'He was negligent in his duties.', '彼は職務怠慢だった。', 'ラテン neglegere(無視する)→ neglect と同系。', { syn: [{ w: 'careless', m: '不注意な' }], ant: [{ w: 'diligent', m: '勤勉な' }], field: '性質・状態' }],
  ['vigilant', '形', '1', '油断のない・警戒している', 'Stay vigilant against fraud.', '詐欺に警戒を怠るな。', 'ラテン vigil(目覚めている)→ vigil と同系。', { syn: [{ w: 'watchful', m: '用心深い' }, { w: 'alert', m: '油断のない' }], ant: [{ w: 'careless', m: '不注意な' }], field: '性質・状態' }],
  // 感情の形容詞
  ['jubilant', '形', '1', '歓喜にあふれた', 'The fans were jubilant.', 'ファンは歓喜にわいた。', 'ラテン jubilare(歓声を上げる)。', { syn: [{ w: 'joyful', m: '喜びに満ちた' }, { w: 'elated', m: '大喜びの' }], ant: [{ w: 'miserable', m: 'みじめな' }], field: '心理' }],
  ['ecstatic', '形', '1', '有頂天の・恍惚とした', 'She was ecstatic about the news.', '彼女はその知らせに有頂天だった。', 'ギリシャ ekstasis(我を忘れた状態)。', { syn: [{ w: 'thrilled', m: 'わくわくした' }, { w: 'overjoyed', m: '大喜びの' }], ant: [], field: '心理' }],
  ['elated', '形', '1', '大喜びの・意気揚々とした', 'He felt elated after winning.', '彼は勝って意気揚々だった。', 'ラテン e+latus(運ばれた)→持ち上げられた。', { syn: [{ w: 'joyful', m: '喜んだ' }, { w: 'jubilant', m: '歓喜の' }], ant: [{ w: 'dejected', m: '落胆した' }], field: '心理' }],
  ['despondent', '形', '1', '落胆した・意気消沈した', 'She grew despondent after the loss.', '彼女は喪失の後ふさぎ込んだ。', 'ラテン de+spondere(約束する)→希望を捨てる。', { syn: [{ w: 'dejected', m: '落ち込んだ' }, { w: 'gloomy', m: '陰気な' }], ant: [{ w: 'hopeful', m: '希望に満ちた' }], field: '心理' }],
  ['dejected', '形', '1', 'がっかりした・しょげた', 'He looked dejected and tired.', '彼は落胆して疲れて見えた。', 'ラテン de+jacere(投げる)→ ject と同系。', { syn: [{ w: 'downcast', m: 'うつむいた' }, { w: 'despondent', m: '意気消沈した' }], ant: [{ w: 'cheerful', m: '陽気な' }], field: '心理' }],
  ['melancholy', '形', '1', '憂うつな・物悲しい', 'a melancholy tune', 'もの悲しい調べ', 'ギリシャ melas(黒)+khole(胆汁)→黒胆汁。', { syn: [{ w: 'sad', m: '悲しい' }, { w: 'gloomy', m: '陰気な' }], ant: [{ w: 'cheerful', m: '陽気な' }], field: '心理' }],
  ['irate', '形', '1', '激怒した', 'An irate customer complained.', '激怒した客が苦情を言った。', 'ラテン ira(怒り)→ ire と同系。', { syn: [{ w: 'furious', m: '激怒した' }, { w: 'enraged', m: '怒り狂った' }], ant: [{ w: 'calm', m: '冷静な' }], field: '心理' }],
  ['indignant', '形', '1', '憤慨した・怒った', 'She was indignant at the insult.', '彼女はその侮辱に憤慨した。', 'ラテン in(否定)+dignus(値する)→ dignity と同系。', { syn: [{ w: 'outraged', m: '激怒した' }, { w: 'resentful', m: '憤った' }], field: '心理' }],
  ['placid', '形', '1', '穏やかな・落ち着いた', 'a placid lake', '穏やかな湖', 'ラテン placidus(静かな)→ please と同系。', { syn: [{ w: 'calm', m: '静かな' }, { w: 'serene', m: '穏やかな' }], ant: [{ w: 'turbulent', m: '荒れた' }], field: '性質・状態' }],
  ['tranquil', '形', '1', '静かな・平穏な', 'They sought a tranquil life.', '彼らは平穏な暮らしを求めた。', 'ラテン tranquillus(静かな)。', { syn: [{ w: 'calm', m: '穏やかな' }], ant: [{ w: 'agitated', m: '動揺した' }], field: '性質・状態' }],
  ['composed', '形', '1', '落ち着いた・冷静な', 'She stayed composed under pressure.', '彼女は重圧の下でも冷静だった。', 'compose(構成する・落ち着かせる)+ -ed→ pos と同系。', { syn: [{ w: 'calm', m: '冷静な' }, { w: 'collected', m: '落ち着いた' }], ant: [{ w: 'flustered', m: 'うろたえた' }], field: '心理' }],
]

export const WORDS_MORE34 = RAW.map(expandCompact)
