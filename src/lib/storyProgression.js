// 物語IDは保存済みアルバムとの互換性のため維持し、内容だけを龍脈修復の正史へ更新する。
export const AFTER_SCHOOL_STORY_ARCS = Object.freeze([
  {
    id: 'after-school-rumor', number: 1,
    title: '当たり前だった英語の消失', shortTitle: '英語が消えた朝',
    summary: '街の表示やニュースから英語が消え、ほとんどの人がその存在ごと忘れる。',
    investigation: '日常の中に残った不自然な空白を記録する。',
    discovery: '空白は偶然ではなく、英語だけが記憶から抜け落ちた痕跡だった。',
    nextLead: '同じ違和感を覚えている生徒が他にもいる。',
  },
  {
    id: 'first-investigation-friend', number: 2,
    title: '記憶を保った生徒たち', shortTitle: '記憶を持つ仲間',
    summary: '主人公以外にも英語を学ぶ生徒が見つかり、調査ノートを共有する。',
    investigation: 'それぞれが覚えている単語と、忘れた場面を比べる。',
    discovery: '学び方や日常の経験によって、残っている記憶の範囲が違っていた。',
    nextLead: '先生たちにも、担当分野にだけかすかな既視感が残っている。',
  },
  {
    id: 'teacher-anomaly', number: 3,
    title: '先生たちに残った専門の違和感', shortTitle: '先生のかすかな記憶',
    summary: '英語自体は思い出せない先生たちが、専門用語の欠落に違和感を訴える。',
    investigation: '先生の専門知識と生徒の英語記憶を同じノートに重ねる。',
    discovery: '先生の説明が文脈となり、生徒が単語を正しく復元できた。',
    nextLead: '先生は対戦相手ではなく、龍脈解読を支える協力者になる。',
  },
  {
    id: 'mana-secret', number: 4,
    title: '日常に生じる小さな歪み', shortTitle: '日常の歪み',
    summary: '授業、通学、食堂、部活、ニュースなどに英語のない違和感が日々現れる。',
    investigation: 'その日に見つかった単語や言い回しを10問の暗号として解く。',
    discovery: '小さな歪みの修復記録が増えるたびに、主要龍脈のノイズが弱まる。',
    nextLead: '歪みの向きを地図へ重ねると、学校が中心にあると分かる。',
  },
  {
    id: 'multiple-teachers', number: 5,
    title: '学校を中心にした五芒星', shortTitle: '五芒星の龍脈図',
    summary: '図書館、駅前、中央公園、神社、競技場を頂点とする五芒星が浮かび上がる。',
    investigation: '学校に集めた先生と生徒の記録を、街の五地点と結び付ける。',
    discovery: '五地点は英検5級から2級までの記憶層に対応し、それぞれ200断片を必要とする。',
    nextLead: '最初の頂点、図書館の5級記憶層を調べる。',
  },
  {
    id: 'school-anomalies', number: 6,
    title: '図書館・5級の記憶層', shortTitle: '図書館の解読',
    summary: '如月先生と、書名・索引・基礎語彙から消えた英語を読む。',
    investigation: '忘れられた単語100語と熟語・構文100題を、古文書のように解読する。',
    discovery: '基礎の記憶が戻り、本の索引に英語の見出しが再び現れ始めた。',
    nextLead: '人と言葉が行き交っていた駅前に、次の欠落がある。',
  },
  {
    id: 'town-anomalies', number: 7,
    title: '駅前・4級の記憶層', shortTitle: '駅前の解読',
    summary: 'エレナ先生と、案内表示や交流の言い回しを復元する。',
    investigation: '交通・地理・コミュニケーションの単語100語と熟語・構文100題を解く。',
    discovery: '駅の表示に英語の役割が戻り、言葉を交わしていた記憶が町に蘇り始めた。',
    nextLead: '中央公園の植物名と観察記録に、さらなる欠落がある。',
  },
  {
    id: 'mana-springs', number: 8,
    title: '中央公園・3級の記憶層', shortTitle: '中央公園の解読',
    summary: '森先生と、生き物・環境・心の状態を表す英語を観察する。',
    investigation: '自然と生命の単語100語と熟語・構文100題を、観察記録から復元する。',
    discovery: '公園の案内と科学記録に英語が戻り、龍脈の脈動が穏やかになる。',
    nextLead: '神社の古い記録に、過去の龍脈修復と思われる文が残る。',
  },
  {
    id: 'dragon-veins', number: 9,
    title: '神社・準2級の記憶層', shortTitle: '神社の解読',
    summary: '榊先生と、歴史・継承・宗教の文脈に紛れ込んだ英語を解く。',
    investigation: '古い奉納文の単語100語と熟語・構文100題を、歴史的背景から読み解く。',
    discovery: '過去にも言葉の記憶を守る仕組みがあり、今回の暴走がその断絶で起きたと分かる。',
    nextLead: '最後の主要頂点は、身体と記録の言葉が集まる競技場だ。',
  },
  {
    id: 'administrator-battles', number: 10,
    title: '競技場・2級の記憶層', shortTitle: '競技場の解読',
    summary: '風早先生と、競技・測定・心理の高度な英語を再構成する。',
    investigation: '記録表と戦術ノートの単語100語と熟語・構文100題を復元する。',
    discovery: '五芒星の最後の頂点が安定し、五本の龍脈が学校で一つにつながる。',
    nextLead: '五地点の単語と熟語・構文をすべて取り戻せば、世界の記憶が元に戻る。',
  },
  {
    id: 'restore-everyday-life', number: 11,
    title: '五地点の記憶を取り戻し、1級EXTRAへ', shortTitle: '記憶の復帰',
    summary: '五地点の記憶を取り戻すと、英語が日常に戻り、学校の記憶庫に1級EXTRAが開く。',
    investigation: '先生と生徒が各地の200断片を確かめ、龍脈へ正しい英語を紡ぎ込む。',
    discovery: '街の人々に英語の記憶が戻り、表示や会話がまた当たり前の日常に溶け込む。',
    nextLead: '日常の小さな歪みはこれからも起こる。そのたびに、みんなで言葉を確かめればいい。',
  },
])

const STORY_ARC_BY_ID = new Map(AFTER_SCHOOL_STORY_ARCS.map((arc) => [arc.id, arc]))

export function afterSchoolStoryArcForStep(step = 0) {
  const safeStep = Number.isSafeInteger(step) && step >= 0 ? step : 0
  return AFTER_SCHOOL_STORY_ARCS[Math.min(safeStep, AFTER_SCHOOL_STORY_ARCS.length - 1)]
}

export function afterSchoolStoryArcById(id) {
  return STORY_ARC_BY_ID.get(id) ?? AFTER_SCHOOL_STORY_ARCS[0]
}

export function afterSchoolNextStoryArc(step = 0) {
  const safeStep = Number.isSafeInteger(step) && step >= 0 ? step : 0
  return AFTER_SCHOOL_STORY_ARCS[safeStep + 1] ?? null
}
