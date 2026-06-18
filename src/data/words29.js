// 単語データ（継続 / 6000語へ）— 芸術/文学/伝達・認知の動詞/社会文化/上級形容詞、補助情報＋分野つき。語族=1エントリ。
import { expandCompact } from './compact.js'

const RAW = [
  // 芸術・文学
  ['poem', '名', '3', '詩', 'She wrote a beautiful poem.', '彼女は美しい詩を書いた。', 'ギリシャ poiema(作られたもの)。', { syn: [{ w: 'verse', m: '韻文' }], der: [{ w: 'poetry', m: '詩(全体)' }], field: '芸術' }],
  ['novel', '名', '3', '小説・斬新な(形)', 'He is reading a novel.', '彼は小説を読んでいる。', 'ラテン novus(新しい)→ new と同系。', { syn: [{ w: 'fiction', m: '小説' }], field: '芸術' }],
  ['fiction', '名', 'pre1', '小説・フィクション・作り事', 'I prefer fiction to facts.', '私は事実より小説が好きだ。', 'ラテン fingere(形作る)→ figure と同系。', { ant: [{ w: 'nonfiction', m: 'ノンフィクション' }], field: '芸術' }],
  ['biography', '名', 'pre1', '伝記', 'I read a biography of Edison.', '私はエジソンの伝記を読んだ。', 'ギリシャ bio(生)+graphein(書く)→ graph と同源。', { ant: [{ w: 'autobiography', m: '自伝' }], field: '芸術' }],
  ['protagonist', '名', '1', '主人公', 'The protagonist is a young girl.', '主人公は若い少女だ。', 'ギリシャ protos(第一)+agonistes(役者)。', { syn: [{ w: 'hero', m: '主人公' }], ant: [{ w: 'antagonist', m: '敵役' }], field: '芸術' }],
  ['verse', '名', 'pre1', '韻文・詩・節', 'The song has three verses.', 'その歌には3つの節がある。', 'ラテン versus(畝・行)→ vers と同源。', { ant: [{ w: 'prose', m: '散文' }], field: '芸術' }],
  ['prose', '名', '1', '散文', 'The essay is written in prose.', 'その随筆は散文で書かれている。', 'ラテン prosa(まっすぐな話)。', { ant: [{ w: 'verse', m: '韻文' }], field: '芸術' }],
  ['portrait', '名', 'pre1', '肖像画・人物描写', 'She painted his portrait.', '彼女は彼の肖像画を描いた。', '古フランス portraire(描き出す)→ portray と同系。', { syn: [{ w: 'painting', m: '絵' }], field: '芸術' }],
  ['masterpiece', '名', 'pre1', '傑作', 'The painting is a masterpiece.', 'その絵は傑作だ。', 'master(名人)+piece(作品)。', { syn: [{ w: 'classic', m: '名作' }], field: '芸術' }],
  ['canvas', '名', 'pre1', 'キャンバス・画布', 'He painted on a large canvas.', '彼は大きなキャンバスに描いた。', 'ラテン cannabis(麻)。', { field: '芸術' }],
  // 伝達の動詞
  ['clarify', '動', 'pre1', '明確にする・はっきりさせる', 'Please clarify your point.', '要点を明確にして。', 'ラテン clarus(明るい)+facere(する)→ clear と同系。', { syn: [{ w: 'explain', m: '説明する' }], ant: [{ w: 'confuse', m: '混乱させる' }], field: '動作・行為' }],
  ['narrate', '動', '1', '語る・ナレーションする', 'She narrated the story.', '彼女はその物語を語った。', 'ラテン narrare(語る)→ narrative と同源。', { syn: [{ w: 'tell', m: '語る' }, { w: 'recount', m: '物語る' }], field: '動作・行為' }],
  ['recite', '動', 'pre1', '暗唱する・朗読する', 'He recited a poem.', '彼は詩を暗唱した。', 'ラテン re+citare(呼ぶ)→ cite と同系。', { syn: [{ w: 'read aloud', m: '朗読する' }], field: '動作・行為' }],
  ['exclaim', '動', 'pre1', '叫ぶ・声を上げる', '"Look!" she exclaimed.', '「見て！」と彼女は叫んだ。', 'ラテン ex+clamare(叫ぶ)→ claim と同系。', { syn: [{ w: 'cry out', m: '叫ぶ' }], field: '動作・行為' }],
  ['murmur', '動', 'pre1', 'つぶやく・ざわめく', 'He murmured a reply.', '彼は小声で返事をした。', 'ラテン murmurare(ざわめく・擬音)。', { syn: [{ w: 'mutter', m: 'つぶやく' }, { w: 'whisper', m: 'ささやく' }], field: '動作・行為' }],
  ['utter', '動', 'pre1', '口に出す・全くの(形)', 'She did not utter a word.', '彼女は一言も発しなかった。', '中オランダ語 uteren(外に出す)→ out と同系。', { syn: [{ w: 'say', m: '言う' }, { w: 'speak', m: '話す' }], der: [{ w: 'utterance', m: '発話' }], field: '動作・行為' }],
  ['proclaim', '動', '1', '宣言する・公布する', 'They proclaimed independence.', '彼らは独立を宣言した。', 'ラテン pro+clamare(叫ぶ)→ claim と同系。', { syn: [{ w: 'declare', m: '宣言する' }, { w: 'announce', m: '発表する' }], field: '動作・行為' }],
  // 認知の動詞
  ['ponder', '動', '1', '熟考する', 'She pondered the question.', '彼女はその問いを熟考した。', 'ラテン ponderare(重さを量る)→ pound と同系。', { syn: [{ w: 'consider', m: 'よく考える' }, { w: 'contemplate', m: '熟考する' }], field: '動作・行為' }],
  ['speculate', '動', '1', '推測する・投機する', 'They speculated about the cause.', '彼らは原因を推測した。', 'ラテン speculari(見張る)→ spect と同系。', { syn: [{ w: 'guess', m: '推測する' }, { w: 'theorize', m: '理論立てる' }], field: '動作・行為' }],
  ['recall', '動', '2', '思い出す・回収する', "I can't recall his name.", '彼の名前を思い出せない。', 're(再び)+call(呼ぶ)。', { syn: [{ w: 'remember', m: '覚えている' }, { w: 'recollect', m: '思い出す' }], ant: [{ w: 'forget', m: '忘れる' }], field: '動作・行為' }],
  ['reckon', '動', 'pre1', '思う・計算する・みなす', 'I reckon it will rain.', '雨になると思う。', '古英語 gerecenian(数える)。', { syn: [{ w: 'suppose', m: '思う' }, { w: 'calculate', m: '計算する' }], field: '動作・行為' }],
  ['foresee', '動', '1', '予見する・見越す', 'No one could foresee the result.', '誰も結果を予見できなかった。', 'fore(前もって)+see(見る)。', { syn: [{ w: 'predict', m: '予測する' }, { w: 'anticipate', m: '予期する' }], field: '動作・行為' }],
  ['envision', '動', '1', '思い描く・心に描く', 'She envisioned a better future.', '彼女はより良い未来を思い描いた。', 'en(中に)+vision(像)→ vis と同系。', { syn: [{ w: 'imagine', m: '想像する' }, { w: 'visualize', m: '視覚化する' }], field: '動作・行為' }],
  ['scrutinize', '動', '1', '精査する・じっくり調べる', 'They scrutinized the contract.', '彼らは契約を精査した。', 'ラテン scrutari(ぼろを調べる)。', { syn: [{ w: 'examine', m: '調べる' }, { w: 'inspect', m: '検査する' }], field: '動作・行為' }],
  ['deem', '動', '1', '〜とみなす・思う', 'They deemed it necessary.', '彼らはそれを必要とみなした。', '古英語 dēman(判断する)→ doom と同系。', { syn: [{ w: 'consider', m: 'みなす' }, { w: 'regard', m: 'みなす' }], field: '動作・行為' }],
  // 社会・文化
  ['etiquette', '名', '1', '礼儀作法・エチケット', 'Table etiquette matters here.', 'ここでは食事の作法が大切だ。', 'フランス étiquette(札・規則)→ ticket と同系。', { syn: [{ w: 'manners', m: '作法' }], field: '社会' }],
  ['hospitality', '名', 'pre1', 'もてなし・歓待', 'Thank you for your hospitality.', 'おもてなしをありがとう。', 'ラテン hospes(客・主人)→ host と同源。', { syn: [{ w: 'welcome', m: '歓待' }], field: '社会' }],
  ['descendant', '名', '1', '子孫', 'They are descendants of samurai.', '彼らは侍の子孫だ。', 'ラテン de+scandere(登る)→下る→ descend と同系。', { ant: [{ w: 'ancestor', m: '祖先' }], field: '社会' }],
  ['household', '名', 'pre1', '世帯・家庭', 'The household has four members.', 'その世帯は4人家族だ。', 'house(家)+hold(保つ)。', { syn: [{ w: 'family', m: '家族' }], field: '社会' }],
  ['tribe', '名', 'pre1', '部族', 'The tribe lives in the forest.', 'その部族は森に住む。', 'ラテン tribus(部族)→ tribe。', { field: '社会' }],
  ['ethnicity', '名', '1', '民族性・民族', 'The city has great ethnic diversity.', 'その都市は民族的多様性に富む。', 'ギリシャ ethnos(民族)。', { field: '社会' }],
  ['minority', '名', 'pre1', '少数派・少数民族', 'They protect minority rights.', '彼らは少数派の権利を守る。', 'ラテン minor(より小さい)→ minor と同源。', { ant: [{ w: 'majority', m: '多数派' }], field: '社会' }],
  ['immigrant', '名', 'pre1', '(入ってくる)移民', 'Many immigrants settled here.', '多くの移民がここに定住した。', 'ラテン in+migrare(移住する)→ migrate と同系。', { ant: [{ w: 'emigrant', m: '(出ていく)移民' }], field: '社会' }],
  // 上級形容詞
  ['widespread', '形', 'pre1', '広範囲の・広まった', 'The disease is widespread.', 'その病気は広く蔓延している。', 'wide(広く)+spread(広がった)。', { syn: [{ w: 'prevalent', m: '広く行き渡った' }, { w: 'common', m: '一般的な' }], ant: [{ w: 'rare', m: 'まれな' }], field: '性質・状態' }],
  ['rampant', '形', '1', '蔓延した・はびこる', 'Corruption was rampant.', '汚職が横行していた。', '古フランス ramper(這い上がる)→ ramp と同系。', { syn: [{ w: 'widespread', m: '広まった' }, { w: 'uncontrolled', m: '抑えられない' }], field: '性質・状態' }],
  ['sparse', '形', '1', 'まばらな・希薄な', 'The area has a sparse population.', 'その地域は人口がまばらだ。', 'ラテン spargere(まく)→ disperse と同系。', { syn: [{ w: 'scattered', m: '散在した' }], ant: [{ w: 'dense', m: '密集した' }], field: '性質・状態' }],
  ['deficient', '形', '1', '不足した・欠陥のある', 'The diet is deficient in iron.', 'その食事は鉄分が不足している。', 'ラテン de+facere(する)→ deficit と同系。', { syn: [{ w: 'lacking', m: '欠けた' }, { w: 'inadequate', m: '不十分な' }], ant: [{ w: 'sufficient', m: '十分な' }], field: '性質・状態' }],
  ['fashionable', '形', 'pre1', '流行の・おしゃれな', 'She wears fashionable clothes.', '彼女はおしゃれな服を着る。', 'fashion(流行)+ -able。', { syn: [{ w: 'stylish', m: 'しゃれた' }, { w: 'trendy', m: '流行の' }], ant: [{ w: 'old-fashioned', m: '時代遅れの' }], field: '性質・状態' }],
  // 上級動詞（社会・態度）
  ['deviate', '動', '1', '逸脱する・それる', "Don't deviate from the plan.", '計画から外れないで。', 'ラテン de+via(道)→ via と同系。', { syn: [{ w: 'stray', m: 'それる' }, { w: 'diverge', m: '分かれる' }], ant: [{ w: 'conform', m: '従う' }], field: '動作・行為' }],
  ['defy', '動', '1', '反抗する・無視する', 'He defied his parents.', '彼は両親に逆らった。', 'ラテン dis+fidere(信じる)→不信→ faith と同系。', { syn: [{ w: 'resist', m: '抵抗する' }, { w: 'disobey', m: '従わない' }], ant: [{ w: 'obey', m: '従う' }], field: '動作・行為' }],
  ['rebel', '動', '1', '反逆する・反抗する', 'The people rebelled against the king.', '民衆は王に反逆した。', 'ラテン re+bellum(戦争)→再び戦う。', { syn: [{ w: 'revolt', m: '反乱を起こす' }], field: '政治' }],
  ['persevere', '動', '1', '辛抱強く続ける・粘る', 'She persevered despite failure.', '彼女は失敗にもめげず粘った。', 'ラテン per+severus(厳しい)→ severe と同系。', { syn: [{ w: 'persist', m: 'やり通す' }, { w: 'endure', m: '耐える' }], ant: [{ w: 'quit', m: 'やめる' }], field: '動作・行為' }],
  ['indulge', '動', '1', 'ふける・甘やかす', 'He indulged in sweets.', '彼は甘い物をたらふく食べた。', 'ラテン indulgere(寛大である)。', { syn: [{ w: 'pamper', m: '甘やかす' }], field: '動作・行為' }],
]

export const WORDS_MORE28 = RAW.map(expandCompact)
