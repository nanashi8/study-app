import {
  BATTLE_STUDENTS,
  DEFAULT_BATTLE_STUDENT_ID,
  battleDailySceneById,
  battleStudentById,
  isRestorableBattleStudentId,
  normalizeBattleStudentId,
} from './battleCast.js'

export const MAX_AFTER_SCHOOL_BOND_POINTS = 999
export const MAX_AFTER_SCHOOL_BOND_VISITS = 999_999

export const INITIAL_UNLOCKED_BATTLE_STUDENT_IDS = Object.freeze([
  DEFAULT_BATTLE_STUDENT_ID,
])

export const LEGACY_UNLOCKED_BATTLE_STUDENT_IDS = Object.freeze(
  BATTLE_STUDENTS.map((student) => student.id),
)

export const AFTER_SCHOOL_BOND_LEVELS = Object.freeze([
  { level: 1, minPoints: 0, label: 'クラスメイト' },
  { level: 2, minPoints: 3, label: '気の合う仲間' },
  { level: 3, minPoints: 8, label: '信頼する友達' },
  { level: 4, minPoints: 15, label: '放課後の相棒' },
  { level: 5, minPoints: 24, label: 'かけがえのない仲間' },
])

const branch = (profile) => Object.freeze({
  time: '16:30',
  ...profile,
  skill: Object.freeze(profile.skill),
  item: Object.freeze(profile.item),
  choices: Object.freeze(profile.choices.map((choice) => Object.freeze(choice))),
})

// 既存の監査済み学校・街画像を舞台に、10人全員へ一つずつ固有の放課後分岐を持たせる。
// どの声掛けも失敗扱いにはせず、本人の性格に合う style だけ絆の伸びを大きくする。
export const AFTER_SCHOOL_BRANCHES = Object.freeze([
  branch({
    id: 'music-room-harmony', studentId: 'mio', sceneId: 'club',
    routeLabel: '音楽室に残る', location: '夕映えの音楽室', preferredStyleId: 'empathy',
    title: '声が揃わない日の一小節',
    situation: '合唱練習の録音を聞いたミオは、自分の声だけ浮いている気がして再生を止めました。',
    openingEmotionId: 'worried',
    opening: '「みんなの声を邪魔してないかな。もう少し小さく歌った方がいい？」',
    skill: { id: 'mio-harmony-care', name: 'ハーモニーケア', emoji: '🎼', kind: 'heal', every: 3, healPercent: 4, description: '3正解ごとにHPを4%回復' },
    item: { id: 'mio-tuning-charm', name: '音叉チャーム', emoji: '🎵', description: 'ミオとの放課後を思い出す記念品' },
    choices: [
      { id: 'mio-empathy', styleId: 'empathy', label: '「浮いて聞こえると不安になるよね」', reply: '「うん。不安って言えたら、音を消すより合わせ方を探したくなった」', emotionId: 'relieved' },
      { id: 'mio-idea', styleId: 'idea', label: '「一人ずつの録音を重ねて聞こう」', reply: '「どこでずれたか分かれば直せそう。みんなにも相談してみるね」', emotionId: 'focused' },
      { id: 'mio-together', styleId: 'together', label: '「その一小節を一緒に数えよう」', reply: '「隣で拍を取ってくれたら歌えそう。もう一度だけ録ってみる」', emotionId: 'gentle' },
    ],
  }),
  branch({
    id: 'art-room-layout', studentId: 'ren', sceneId: 'club',
    routeLabel: '美術室へ寄る', location: '文化祭準備の美術室', preferredStyleId: 'idea',
    title: '展示がまとまらない放課後',
    situation: '文化祭の展示案が増えすぎ、レンは全部を残そうとして配置を決められずにいます。',
    openingEmotionId: 'thinking',
    opening: '「どれも誰かが頑張った案だ。外すものを決めるのが一番難しい」',
    skill: { id: 'ren-sketch-break', name: '下書きブレイク', emoji: '✏️', kind: 'power', every: 4, bonusPercent: 12, description: '4正解ごとに追加ダメージ12%' },
    item: { id: 'ren-layout-card', name: '展示レイアウトカード', emoji: '🖼️', description: 'レンとの放課後を思い出す記念品' },
    choices: [
      { id: 'ren-empathy', styleId: 'empathy', label: '「誰かの案を外すのは苦しいよね」', reply: '「分かってくれるだけで助かる。雑に決めたくない理由を話せそうだ」', emotionId: 'relieved' },
      { id: 'ren-idea', styleId: 'idea', label: '「入口・中央・出口の三役に分けよう」', reply: '「役割で分ければ、捨てずに見せ方を変えられる。まず床へ並べてみる」', emotionId: 'focused' },
      { id: 'ren-together', styleId: 'together', label: '「作品カードを一緒に並べ直そう」', reply: '「一人で抱えて視野が狭くなってた。違う目で見てもらえると助かる」', emotionId: 'curious' },
    ],
  }),
  branch({
    id: 'library-one-line', studentId: 'haru', sceneId: 'library',
    routeLabel: '図書館へ行く', location: '夕日の大図書室', preferredStyleId: 'idea',
    title: '同じ英文を三度読んで',
    situation: 'ハルは長い英文の途中で主語を見失い、同じ段落を何度も読み直しています。',
    openingEmotionId: 'exhausted',
    opening: '「単語は分かるのに、文全体がつながらない。読み方から間違ってるのかな」',
    skill: { id: 'haru-foresight-guard', name: '先読みガード', emoji: '📘', kind: 'guard', reductionPercent: 30, description: '最初の反撃ダメージを30%軽減' },
    item: { id: 'haru-margin-bookmark', name: '余白のしおり', emoji: '🔖', description: 'ハルとの放課後を思い出す記念品' },
    choices: [
      { id: 'haru-empathy', styleId: 'empathy', label: '「分かる単語が多いほど焦るよね」', reply: '「そうなんだ。できるはずって思うほど苦しかった。少し呼吸を戻すよ」', emotionId: 'relieved' },
      { id: 'haru-idea', styleId: 'idea', label: '「主語と動詞だけ先に囲もう」', reply: '「骨組みからなら追えそうだ。修飾はあとで戻して読んでみる」', emotionId: 'focused' },
      { id: 'haru-together', styleId: 'together', label: '「一文ずつ交代で要点を言おう」', reply: '「自分の言葉にすれば迷った場所も見えるね。最初の文からお願い」', emotionId: 'curious' },
    ],
  }),
  branch({
    id: 'cafe-prototype', studentId: 'akari', sceneId: 'cafe',
    routeLabel: '駅前カフェへ', location: '駅前の作戦テーブル', preferredStyleId: 'together',
    title: '失敗した試作品の使い道',
    situation: 'アカリは科学部の試作品が想定どおり動かず、ノートへ大きく失敗と書きかけています。',
    openingEmotionId: 'sad',
    opening: '「動かなかったらゼロ点かな。でも、変な音がした理由だけは気になるんだ」',
    skill: { id: 'akari-retry-lab', name: 'リトライ実験', emoji: '🧪', kind: 'power', every: 4, bonusPercent: 14, description: '4正解ごとに追加ダメージ14%' },
    item: { id: 'akari-prototype-tag', name: '試作品タグ', emoji: '🏷️', description: 'アカリとの放課後を思い出す記念品' },
    choices: [
      { id: 'akari-empathy', styleId: 'empathy', label: '「動くと思っていた分、悔しいよね」', reply: '「うん、悔しかった！　それを認めたら次に調べたいことも見えてきた」', emotionId: 'relieved' },
      { id: 'akari-idea', styleId: 'idea', label: '「変な音がした瞬間を記録しよう」', reply: '「失敗じゃなくて観測結果だね。条件を一つずつ書き戻してみる」', emotionId: 'focused' },
      { id: 'akari-together', styleId: 'together', label: '「部室で安全にもう一度確かめよう」', reply: '「一人じゃないなら落ち着いて確認できる！　手順表から作ろう」', emotionId: 'delighted' },
    ],
  }),
  branch({
    id: 'shopping-street-pace', studentId: 'kaito', sceneId: 'snack',
    routeLabel: '商店街へ向かう', location: '夕方の商店街', preferredStyleId: 'empathy',
    title: '急ぎすぎた帰り道',
    situation: 'カイトは部活で後輩を急かしすぎたかもしれないと、買った軽食の袋を持ったまま考え込んでいます。',
    openingEmotionId: 'worried',
    opening: '「俺は早くできるけど、同じ速さをみんなに求めたら駄目だよな」',
    skill: { id: 'kaito-last-spurt', name: 'ラストスパート', emoji: '👟', kind: 'power', every: 4, bonusPercent: 16, description: '4正解ごとに追加ダメージ16%' },
    item: { id: 'kaito-pace-band', name: 'ペースバンド', emoji: '🎽', description: 'カイトとの放課後を思い出す記念品' },
    choices: [
      { id: 'kaito-empathy', styleId: 'empathy', label: '「引っぱりたいほど焦ることもあるよね」', reply: '「そうか、俺も焦ってたんだ。まずそこを後輩に話してみる」', emotionId: 'relieved' },
      { id: 'kaito-idea', styleId: 'idea', label: '「次は全員の目標ペースを聞こう」', reply: '「俺の基準だけじゃ駄目だな。一本ごとに確認する時間を入れるよ」', emotionId: 'focused' },
      { id: 'kaito-together', styleId: 'together', label: '「明日の練習メニューを一緒に直そう」', reply: '「助かる。速さだけじゃなく、続けられるメニューにしたい」', emotionId: 'determined' },
    ],
  }),
  branch({
    id: 'cafe-council-plan', studentId: 'rei', sceneId: 'cafe',
    routeLabel: '作戦会議をする', location: '駅前カフェの大テーブル', preferredStyleId: 'idea',
    title: '頼られる側の空白',
    situation: '生徒会の予定を整理したレイは、自分の作業だけ誰にも頼めず残していました。',
    openingEmotionId: 'exhausted',
    opening: '「分担表は完成した。でも私の欄だけ、まだ仕事が多いな」',
    skill: { id: 'rei-calm-command', name: '冷静指揮', emoji: '📋', kind: 'guard', reductionPercent: 35, description: '最初の反撃ダメージを35%軽減' },
    item: { id: 'rei-shared-planner', name: '共有プランナー', emoji: '🗓️', description: 'レイとの放課後を思い出す記念品' },
    choices: [
      { id: 'rei-empathy', styleId: 'empathy', label: '「頼られる人ほど頼みにくいよね」', reply: '「その通りかもしれない。弱みではなく、役割の相談だと思えば言えそうだ」', emotionId: 'relieved' },
      { id: 'rei-idea', styleId: 'idea', label: '「十五分単位で渡せる仕事を分けよう」', reply: '「小さく切れば頼む相手も選べる。表をもう一列増やしてみる」', emotionId: 'focused' },
      { id: 'rei-together', styleId: 'together', label: '「最初の一件は私が一緒に確認する」', reply: '「ありがとう。見本が一つあれば、次からは全員へ頼める」', emotionId: 'gentle' },
    ],
  }),
  branch({
    id: 'courtyard-words', studentId: 'nao', sceneId: 'everyday',
    routeLabel: '中庭へ寄る', location: '放課後の中庭ベンチ', preferredStyleId: 'empathy',
    title: '伝わらなかった一言',
    situation: '交流会の説明で冗談がうまく伝わらず、ナオは相手を困らせたかもしれないと気にしています。',
    openingEmotionId: 'embarrassed',
    opening: '「笑ってもらうつもりだったのに、言葉って相手で全然違うね」',
    skill: { id: 'nao-language-bridge', name: 'ことばの架け橋', emoji: '🌍', kind: 'heal', every: 3, healPercent: 5, description: '3正解ごとにHPを5%回復' },
    item: { id: 'nao-phrase-card', name: 'ことば交換カード', emoji: '💬', description: 'ナオとの放課後を思い出す記念品' },
    choices: [
      { id: 'nao-empathy', styleId: 'empathy', label: '「伝えたい気持ちほど空回りするよね」', reply: '「分かるって言ってくれると救われる。次は相手の反応を待って話すよ」', emotionId: 'relieved' },
      { id: 'nao-idea', styleId: 'idea', label: '「短い言葉と例で言い直してみよう」', reply: '「言い直すのは負けじゃないね。伝わる形を探すのも交流だ」', emotionId: 'curious' },
      { id: 'nao-together', styleId: 'together', label: '「次の説明を二人で練習しよう」', reply: '「相手役がいてくれたら試せる！　今度は急がず話してみる」', emotionId: 'playful' },
    ],
  }),
  branch({
    id: 'courtyard-kendo', studentId: 'tsubaki', sceneId: 'everyday',
    routeLabel: '校庭を回る', location: '部活終わりの校庭', preferredStyleId: 'together',
    title: '厳しく言いすぎたあと',
    situation: '後輩の安全を思って強い口調になったツバキは、謝ると指導がぶれるのではと迷っています。',
    openingEmotionId: 'worried',
    opening: '「危ない動きだった。だが、あの言い方で伝わったのは怖さだけかもしれない」',
    skill: { id: 'tsubaki-flash-guard', name: '一閃の守り', emoji: '⚔️', kind: 'guard', reductionPercent: 40, description: '最初の反撃ダメージを40%軽減' },
    item: { id: 'tsubaki-knot-charm', name: '稽古紐の結び守り', emoji: '🎗️', description: 'ツバキとの放課後を思い出す記念品' },
    choices: [
      { id: 'tsubaki-empathy', styleId: 'empathy', label: '「守りたかったから強くなったんだね」', reply: '「意図まで見てくれて感謝する。だからこそ、言葉も整えたい」', emotionId: 'relieved' },
      { id: 'tsubaki-idea', styleId: 'idea', label: '「危険だった点と期待を分けて伝えよう」', reply: '「叱責と助言を混ぜていたな。順番を決めれば誤解を減らせそうだ」', emotionId: 'focused' },
      { id: 'tsubaki-together', styleId: 'together', label: '「後輩への説明を一緒に考えよう」', reply: '「頼む。私だけではまた硬い言葉になる。伝わる形まで仕上げたい」', emotionId: 'gentle' },
    ],
  }),
  branch({
    id: 'arcade-debug', studentId: 'noa', sceneId: 'arcade',
    routeLabel: 'ゲームコーナーへ', location: '駅前ゲームコーナー', preferredStyleId: 'idea',
    title: '最後の一拍をデバッグ',
    situation: 'ノアはリズムゲームの同じ一拍で失敗し、反射神経のせいだと決めかけています。',
    openingEmotionId: 'focused',
    opening: '「入力は合ってるはず。でも毎回ここだけずれる。原因が見えないのが嫌だな」',
    skill: { id: 'noa-quick-patch', name: 'クイックパッチ', emoji: '💻', kind: 'power', every: 4, bonusPercent: 13, description: '4正解ごとに追加ダメージ13%' },
    item: { id: 'noa-debug-token', name: 'デバッグトークン', emoji: '🪙', description: 'ノアとの放課後を思い出す記念品' },
    choices: [
      { id: 'noa-empathy', styleId: 'empathy', label: '「原因が分からない失敗は悔しいよね」', reply: '「うん。できない自分より、分からない状態に焦ってたみたい」', emotionId: 'relieved' },
      { id: 'noa-idea', styleId: 'idea', label: '「最後の四拍だけ速度を落として見よう」', reply: '「切り分けだね。目線か指か、ずれる場所をログみたいに確かめる」', emotionId: 'curious' },
      { id: 'noa-together', styleId: 'together', label: '「隣で拍を数えて合図するよ」', reply: '「外からの合図と比べれば誤差が見える。次の一回、お願い」', emotionId: 'delighted' },
    ],
  }),
  branch({
    id: 'riverside-ending', studentId: 'yuu', sceneId: 'homeward',
    routeLabel: '川沿いを帰る', location: '夕暮れの帰宅路', preferredStyleId: 'empathy',
    title: '書けなかった結末',
    situation: '文芸部の締切が近いのに結末が書けず、ユウは途中までの文章まで価値がないように感じています。',
    openingEmotionId: 'sad',
    opening: '「最後まで書けないなら、ここまでの時間も無駄だったのかな」',
    skill: { id: 'yuu-story-breath', name: '物語の余白', emoji: '🖋️', kind: 'heal', every: 3, healPercent: 6, description: '3正解ごとにHPを6%回復' },
    item: { id: 'yuu-ending-note', name: '結末待ちのメモ', emoji: '📝', description: 'ユウとの放課後を思い出す記念品' },
    choices: [
      { id: 'yuu-empathy', styleId: 'empathy', label: '「大切に書いた分、終われないのが苦しいね」', reply: '「うん。書けない悔しさごと、ここまで大事にしてた証拠なのかも」', emotionId: 'relieved' },
      { id: 'yuu-idea', styleId: 'idea', label: '「結末を三行だけ仮置きしよう」', reply: '「完成じゃなく仮置きなら書けそう。そこから本当の終わりを探してみる」', emotionId: 'focused' },
      { id: 'yuu-together', styleId: 'together', label: '「登場人物の気持ちを一緒に整理しよう」', reply: '「誰が何を選ぶか話せば、物語がもう一度動き出すかもしれない」', emotionId: 'curious' },
    ],
  }),
])

const BRANCH_BY_ID = new Map(AFTER_SCHOOL_BRANCHES.map((item) => [item.id, item]))
const BRANCH_BY_STUDENT = new Map(AFTER_SCHOOL_BRANCHES.map((item) => [item.studentId, item]))
const SKILL_BY_ID = new Map(AFTER_SCHOOL_BRANCHES.map((item) => [item.skill.id, item.skill]))
const STYLE_IDS = new Set(['empathy', 'idea', 'together'])

const clampInteger = (value, max) => (
  Number.isSafeInteger(value) ? Math.max(0, Math.min(max, value)) : 0
)

export function normalizeUnlockedBattleStudentIds(value, { legacyFallback = false } = {}) {
  const source = Array.isArray(value)
    ? value
    : legacyFallback
      ? LEGACY_UNLOCKED_BATTLE_STUDENT_IDS
      : INITIAL_UNLOCKED_BATTLE_STUDENT_IDS
  const normalized = new Set([DEFAULT_BATTLE_STUDENT_ID])
  for (const studentId of source) {
    if (isRestorableBattleStudentId(studentId)) {
      normalized.add(normalizeBattleStudentId(studentId))
    }
  }
  return BATTLE_STUDENTS
    .filter((student) => normalized.has(student.id))
    .map((student) => student.id)
}

export function isValidUnlockedBattleStudentIds(value) {
  if (!Array.isArray(value) || value.length === 0) return false
  const normalized = normalizeUnlockedBattleStudentIds(value)
  return normalized.length === value.length
    && normalized.every((studentId, index) => studentId === value[index])
}

export function isBattleStudentUnlocked(unlockedStudentIds, studentId) {
  const normalizedId = normalizeBattleStudentId(studentId)
  return normalizeUnlockedBattleStudentIds(unlockedStudentIds).includes(normalizedId)
}

export function unlockedBattleStudents(unlockedStudentIds) {
  const ids = new Set(normalizeUnlockedBattleStudentIds(unlockedStudentIds))
  return BATTLE_STUDENTS.filter((student) => ids.has(student.id))
}

export function afterSchoolBranchById(id) {
  return BRANCH_BY_ID.get(id) ?? AFTER_SCHOOL_BRANCHES[0]
}

export function afterSchoolBranchForStudent(studentId) {
  return BRANCH_BY_STUDENT.get(normalizeBattleStudentId(studentId))
    ?? AFTER_SCHOOL_BRANCHES[0]
}

export function afterSchoolSkillById(id) {
  return SKILL_BY_ID.get(id) ?? null
}

export function afterSchoolBranchScene(branchOrId) {
  const profile = typeof branchOrId === 'string'
    ? afterSchoolBranchById(branchOrId)
    : branchOrId
  return battleDailySceneById(profile?.sceneId)
}

export function afterSchoolBranchOptions({ step = 0, currentStudentId, count = 3 } = {}) {
  const current = afterSchoolBranchForStudent(currentStudentId)
  const others = AFTER_SCHOOL_BRANCHES.filter((item) => item.id !== current.id)
  const safeStep = Number.isSafeInteger(step) && step >= 0 ? step : 0
  const safeCount = Math.max(1, Math.min(AFTER_SCHOOL_BRANCHES.length, Math.floor(count) || 3))
  const result = [current]
  for (let offset = 0; result.length < safeCount && offset < others.length; offset += 1) {
    result.push(others[(safeStep + offset) % others.length])
  }
  return result
}

export function normalizeAfterSchoolBonds(value) {
  const normalized = {}
  if (!value || typeof value !== 'object' || Array.isArray(value)) return normalized
  for (const [rawStudentId, entry] of Object.entries(value)) {
    if (!isRestorableBattleStudentId(rawStudentId)) continue
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
    const studentId = normalizeBattleStudentId(rawStudentId)
    const next = {
      points: clampInteger(entry.points, MAX_AFTER_SCHOOL_BOND_POINTS),
      visits: clampInteger(entry.visits, MAX_AFTER_SCHOOL_BOND_VISITS),
    }
    const previous = normalized[studentId]
    normalized[studentId] = previous
      ? { points: Math.max(previous.points, next.points), visits: Math.max(previous.visits, next.visits) }
      : next
  }
  return normalized
}

export function isValidAfterSchoolBonds(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.entries(value).every(([studentId, entry]) => (
    isRestorableBattleStudentId(studentId)
    && entry
    && typeof entry === 'object'
    && !Array.isArray(entry)
    && Number.isSafeInteger(entry.points)
    && entry.points >= 0
    && entry.points <= MAX_AFTER_SCHOOL_BOND_POINTS
    && Number.isSafeInteger(entry.visits)
    && entry.visits >= 0
    && entry.visits <= MAX_AFTER_SCHOOL_BOND_VISITS
  ))
}

export function afterSchoolBondLevel(points) {
  const safePoints = clampInteger(points, MAX_AFTER_SCHOOL_BOND_POINTS)
  return [...AFTER_SCHOOL_BOND_LEVELS]
    .reverse()
    .find((item) => safePoints >= item.minPoints)
    ?? AFTER_SCHOOL_BOND_LEVELS[0]
}

export function afterSchoolBondState(bonds, studentId) {
  const currentId = normalizeBattleStudentId(studentId)
  const normalized = normalizeAfterSchoolBonds(bonds)
  const entry = normalized[currentId] ?? { points: 0, visits: 0 }
  const level = afterSchoolBondLevel(entry.points)
  const nextLevel = AFTER_SCHOOL_BOND_LEVELS.find((item) => item.level > level.level) ?? null
  const levelStart = level.minPoints
  const levelEnd = nextLevel?.minPoints ?? levelStart
  return {
    student: battleStudentById(currentId),
    profile: afterSchoolBranchForStudent(currentId),
    points: entry.points,
    visits: entry.visits,
    level,
    nextLevel,
    progress: nextLevel
      ? Math.max(0, Math.min(1, (entry.points - levelStart) / (levelEnd - levelStart)))
      : 1,
    pointsToNext: nextLevel ? Math.max(0, nextLevel.minPoints - entry.points) : 0,
    skillUnlocked: level.level >= 2,
    itemUnlocked: level.level >= 3,
  }
}

export function afterSchoolBattleSkill(studentId, bonds) {
  const state = afterSchoolBondState(bonds, studentId)
  return state.skillUnlocked ? state.profile.skill : null
}

export function afterSchoolUnlockedSkills(bonds) {
  return BATTLE_STUDENTS
    .map((student) => afterSchoolBattleSkill(student.id, bonds))
    .filter(Boolean)
}

export function afterSchoolUnlockedItems(bonds) {
  return BATTLE_STUDENTS
    .map((student) => afterSchoolBondState(bonds, student.id))
    .filter((state) => state.itemUnlocked)
    .map((state) => state.profile.item)
}

export function resolveAfterSchoolReward({ bonds, branchId, choiceId } = {}) {
  const profile = BRANCH_BY_ID.get(branchId)
  const choice = profile?.choices.find((item) => item.id === choiceId)
  if (!profile || !choice || !STYLE_IDS.has(choice.styleId)) return null

  const current = afterSchoolBondState(bonds, profile.studentId)
  const styleMatched = choice.styleId === profile.preferredStyleId
  const bondPointsGained = styleMatched ? 2 : 1
  const nextPoints = clampInteger(
    current.points + bondPointsGained,
    MAX_AFTER_SCHOOL_BOND_POINTS,
  )
  const nextLevel = afterSchoolBondLevel(nextPoints)
  return {
    branchId: profile.id,
    choiceId: choice.id,
    studentId: profile.studentId,
    styleId: choice.styleId,
    styleMatched,
    bondPointsGained,
    previousLevel: current.level,
    nextLevel,
    nextBondEntry: {
      points: nextPoints,
      visits: clampInteger(current.visits + 1, MAX_AFTER_SCHOOL_BOND_VISITS),
    },
    unlockedSkill:
      current.level.level < 2 && nextLevel.level >= 2 ? profile.skill : null,
    unlockedItem:
      current.level.level < 3 && nextLevel.level >= 3 ? profile.item : null,
  }
}
