// 単語データ（探索マップ＋足場ジェネレータ #35）— フロンティア由来。意味はフロンティア値。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  ['facade', '名', '1', '外観・うわべ・建物の正面', 'a stone facade', '石造りの正面', 'フランス facade(建物の前面)→ face と同系。', { syn: [{ w: 'front', m: '正面' }, { w: 'exterior', m: '外観' }], ant: [{ w: 'interior', m: '内部' }], field: '建築' }],
  ['feed', '動', 'pre1', '食べさせる・養う・供給する', 'feed the baby', '赤ちゃんに食べさせる', '古英語 fedan(養う)→ food と同系。', { syn: [{ w: 'nourish', m: '養う' }, { w: 'supply', m: '供給する' }], ant: [{ w: 'starve', m: '飢えさせる' }], fam: [{ w: 'food', m: '食物' }], field: '一般' }],
  ['hallucinate', '動', '1', '幻覚を見る', 'The fever made him hallucinate.', '高熱で彼は幻覚を見た。', 'ラテン hallucinari(心がさまよう)。', { syn: [{ w: 'imagine', m: '思い描く' }], fam: [{ w: 'hallucination', m: '幻覚' }], field: '医学' }],
  ['handler', '名', 'pre1', '取扱者・調教師・世話係', 'a baggage handler', '手荷物係', 'handle(扱う)+ -er', { fam: [{ w: 'handle', m: '扱う' }], syn: [{ w: 'manager', m: '管理者' }, { w: 'trainer', m: '調教師' }], field: 'ビジネス' }],
  ['hopefulness', '名', '3', '希望・楽観', 'a mood of hopefulness', '希望に満ちた雰囲気', 'hopeful(希望に満ちた)+ -ness', { fam: [{ w: 'hopeful', m: '希望に満ちた' }], syn: [{ w: 'optimism', m: '楽観主義' }], ant: [{ w: 'despair', m: '絶望' }], field: '心理' }],
  ['idealist', '名', '1', '理想主義者・夢想家', 'a hopeless idealist', '救いがたい理想家', 'ideal(理想)+ -ist。', { syn: [{ w: 'optimist', m: '楽観論者' }, { w: 'dreamer', m: '夢想家' }], ant: [{ w: 'realist', m: '現実主義者' }], fam: [{ w: 'ideal', m: '理想' }], field: '心理' }],
  ['incensed', '形', '1', '激怒した・憤慨した', 'incensed by the insult', '侮辱に激怒して', 'incense(激怒させる)+ -d。', { syn: [{ w: 'enraged', m: '激怒した' }, { w: 'outraged', m: '憤慨した' }], ant: [{ w: 'pleased', m: '満足した' }], fam: [{ w: 'incense', m: '激怒させる' }], field: '心理' }],
  ['input', '名', 'pre1', '入力・投入・意見', 'data input', 'データ入力', 'in(中へ)+put(置く)。', { syn: [{ w: 'contribution', m: '寄与' }, { w: 'data', m: 'データ' }], ant: [{ w: 'output', m: '出力' }], field: '技術' }],
  ['invalid', '形', 'pre1', '無効な・根拠のない', 'an invalid argument', '根拠のない議論', 'in(否定)+valid(有効な)。', { syn: [{ w: 'void', m: '無効の' }, { w: 'null', m: '無効の' }], ant: [{ w: 'valid', m: '有効な' }], fam: [{ w: 'invalidate', m: '無効にする' }], field: '法律' }],
  ['lag', '動', 'pre1', '遅れをとる・のろのろ進む・遅延', 'lag behind rivals', 'ライバルに後れをとる', '由来不確か(16世紀)。', { syn: [{ w: 'trail', m: '遅れる' }, { w: 'fall behind', m: '後れをとる' }], ant: [{ w: 'lead', m: '先行する' }], field: '一般' }],
  ['lewd', '形', '1', 'みだらな・わいせつな', 'lewd gestures', 'みだらな身ぶり', '古英語 læwede(俗人の→無教養な)。', { syn: [{ w: 'obscene', m: 'わいせつな' }, { w: 'indecent', m: '下品な' }], ant: [{ w: 'decent', m: '上品な' }], field: '社会' }],
  ['monitoring', '名', 'pre1', '監視・観測', 'remote monitoring', '遠隔監視', 'monitor(監視する)+ -ing。', { syn: [{ w: 'surveillance', m: '監視' }, { w: 'observation', m: '観察' }], fam: [{ w: 'monitor', m: '監視する' }], field: '技術' }],
  ['oblivious', '形', '1', '気づかない・忘れて', 'oblivious to the danger', '危険に気づかず', 'ラテン oblivisci(忘れる)。', { syn: [{ w: 'unaware', m: '気づかない' }, { w: 'heedless', m: '無頓着な' }], ant: [{ w: 'aware', m: '気づいて' }], fam: [{ w: 'oblivion', m: '忘却' }], field: '心理' }],
  ['obscenity', '名', '1', 'わいせつ・卑わいな言葉', 'shout obscenities', '卑わいな言葉を叫ぶ', 'obscene(わいせつな)+ -ity', { fam: [{ w: 'obscene', m: 'わいせつな' }], syn: [{ w: 'indecency', m: '下品さ' }, { w: 'vulgarity', m: '下劣さ' }], ant: [{ w: 'decency', m: '上品さ' }], field: '社会' }],
  ['obstructed', '形', 'pre1', '妨げられた・ふさがれた', 'an obstructed view', 'さえぎられた視界', 'obstruct(妨げる)+ -ed。', { syn: [{ w: 'blocked', m: 'ふさがれた' }, { w: 'hindered', m: '妨げられた' }], ant: [{ w: 'clear', m: '通った' }], fam: [{ w: 'obstruct', m: '妨げる' }], field: '一般' }],
  ['occupied', '形', 'pre1', '使用中の・占領された・忙しい', 'The seat is occupied.', 'その席は使用中だ。', 'occupy(占める)+ -ed。', { syn: [{ w: 'busy', m: '忙しい' }, { w: 'taken', m: 'ふさがった' }], ant: [{ w: 'vacant', m: '空いている' }], fam: [{ w: 'occupy', m: '占める' }], field: '一般' }],
  ['ornately', '副', '1', '華麗に・凝った装飾で', 'ornately carved', '凝った彫刻が施された', 'ornate(華麗な)+ -ly。', { syn: [{ w: 'elaborately', m: '念入りに' }, { w: 'lavishly', m: '豪華に' }], ant: [{ w: 'plainly', m: '簡素に' }], fam: [{ w: 'ornate', m: '華麗な' }], field: '副詞' }],
  ['oscillation', '名', '1', '振動・動揺', 'rapid oscillation', '急速な振動', 'oscillate(振動する)+ -ation', { fam: [{ w: 'oscillate', m: '振動する' }], syn: [{ w: 'vibration', m: '振動' }, { w: 'fluctuation', m: '変動' }], field: '科学' }],
  ['ostracism', '名', '1', '排斥・追放', 'social ostracism', '社会的排斥', 'ostracize(排斥する)+ -ism。', { syn: [{ w: 'exclusion', m: '排除' }, { w: 'banishment', m: '追放' }], ant: [{ w: 'acceptance', m: '受容' }], fam: [{ w: 'ostracize', m: '排斥する' }], field: '社会' }],
  ['outdate', '動', '1', '時代遅れにする・古くする', 'New models outdate the old.', '新型が旧型を時代遅れにする。', 'out(超えて)+date(日付)。', { syn: [{ w: 'antiquate', m: '時代遅れにする' }, { w: 'supersede', m: '取って代わる' }], ant: [{ w: 'modernize', m: '近代化する' }], fam: [{ w: 'outdated', m: '時代遅れの' }], field: '技術' }],
  ['overpowering', '形', 'pre1', '抗しがたい・圧倒的な', 'an overpowering smell', '強烈なにおい', 'overpower(圧倒する)+ -ing。', { syn: [{ w: 'overwhelming', m: '圧倒的な' }, { w: 'irresistible', m: '抗しがたい' }], ant: [{ w: 'faint', m: 'かすかな' }], fam: [{ w: 'overpower', m: '圧倒する' }], field: '性質・状態' }],
  ['overseer', '名', '1', '監督・管理者', 'a factory overseer', '工場の監督', 'oversee(監督する)+ -er', { fam: [{ w: 'oversee', m: '監督する' }], syn: [{ w: 'supervisor', m: '監督者' }, { w: 'foreman', m: '現場監督' }], ant: [{ w: 'worker', m: '労働者' }], field: 'ビジネス' }],
  ['overturn', '動', 'pre1', '覆す・転覆させる', 'overturn the verdict', '判決を覆す', 'over(ひっくり)+turn(回す)。', { syn: [{ w: 'reverse', m: '覆す' }, { w: 'topple', m: '転覆させる' }], ant: [{ w: 'uphold', m: '支持する' }], field: '法律' }],
  ['overweight', '形', 'pre1', '太りすぎの・重量超過の', 'an overweight suitcase', '重量オーバーのスーツケース', 'over(過度に)+weight(重さ)。', { syn: [{ w: 'obese', m: '肥満の' }, { w: 'heavy', m: '重い' }], ant: [{ w: 'underweight', m: '低体重の' }], field: '医学' }],
  ['owner', '名', 'pre1', '所有者・持ち主', 'the car owner', '車の持ち主', 'own(所有する)+ -er', { fam: [{ w: 'own', m: '所有する' }], syn: [{ w: 'proprietor', m: '経営者' }, { w: 'holder', m: '保有者' }], ant: [{ w: 'tenant', m: '借り手' }], field: '一般' }],
  ['oxidize', '動', 'pre1', '酸化する・さびさせる', 'Iron oxidizes in air.', '鉄は空気中で酸化する。', 'oxide(酸化物)+ -ize。', { syn: [{ w: 'rust', m: 'さびる' }, { w: 'corrode', m: '腐食する' }], ant: [{ w: 'reduce', m: '還元する' }], fam: [{ w: 'oxidation', m: '酸化' }], field: '科学' }],
  ['officially', '副', 'pre1', '公式に・正式に', 'officially announced', '正式に発表された', 'official(公式の)+ -ly', { fam: [{ w: 'official', m: '公式の' }], syn: [{ w: 'formally', m: '正式に' }], ant: [{ w: 'unofficially', m: '非公式に' }], field: '副詞' }],
  ['openly', '副', '5', '率直に・公然と', 'speak openly', '率直に話す', 'open(開いた)+ -ly', { fam: [{ w: 'open', m: '開いた' }], syn: [{ w: 'frankly', m: '率直に' }], ant: [{ w: 'secretly', m: 'ひそかに' }], field: '副詞' }],
  ['openness', '名', '5', '率直さ・開放性', 'a spirit of openness', '開放的な精神', 'open(開いた)+ -ness', { fam: [{ w: 'open', m: '開いた' }], syn: [{ w: 'frankness', m: '率直さ' }, { w: 'candor', m: '率直' }], ant: [{ w: 'secrecy', m: '秘密主義' }], field: '心理' }],
]

export const WORDS_MORE78 = RAW.map(expandCompact)
