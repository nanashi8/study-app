// 学習診断テストの固定問題。
//
// 4分野 × 英検5級〜1級の7段階 = 28問で、同じ問題を受け直したときにも
// 結果を比較できるよう固定している。difficulty は母集団の実測値ではなく、
// 級の並びを標準化したアプリ内推定用の尺度。

export const DIAGNOSTIC_VERSION = 1

export const DIAGNOSTIC_LEVELS = [
  { id: '5', label: '5級', sub: '中1程度', difficulty: -1.8, color: '#10b981' },
  { id: '4', label: '4級', sub: '中2程度', difficulty: -1.2, color: '#14b8a6' },
  { id: '3', label: '3級', sub: '中3程度', difficulty: -0.6, color: '#0ea5e9' },
  { id: 'pre2', label: '準2級', sub: '高1・高2程度', difficulty: 0, color: '#6366f1' },
  { id: '2', label: '2級', sub: '高校卒業程度', difficulty: 0.6, color: '#8b5cf6' },
  { id: 'pre1', label: '準1級', sub: '大学中級程度', difficulty: 1.2, color: '#d946ef' },
  { id: '1', label: '1級', sub: '大学上級程度', difficulty: 1.8, color: '#f43f5e' },
]

export const DIAGNOSTIC_SKILLS = [
  {
    id: 'vocab',
    label: '単語',
    shortLabel: '単語',
    emoji: '📖',
    color: '#6366f1',
    screen: 'vocabLevels',
    advice: '級別単語で、意味を即答できなかった語を復習しましょう。',
  },
  {
    id: 'grammar',
    label: '文法',
    shortLabel: '文法',
    emoji: '💡',
    color: '#f59e0b',
    screen: 'grammar',
    advice: '文法レッスンでルールを確認してから、単元クイズに進みましょう。',
  },
  {
    id: 'usage',
    label: '語法・熟語',
    shortLabel: '語法',
    emoji: '✨',
    color: '#8b5cf6',
    screen: 'phrases',
    advice: '熟語を一語ずつではなく、まとまりと例文で覚えましょう。',
  },
  {
    id: 'reading',
    label: '長文読解',
    shortLabel: '読解',
    emoji: '📚',
    color: '#10b981',
    screen: 'readingList',
    advice: '級別長文で、根拠になる一文を探してから答える練習をしましょう。',
  },
]

const LEVEL_BY_ID = Object.fromEntries(DIAGNOSTIC_LEVELS.map((level) => [level.id, level]))
const SKILL_DIFFICULTY_OFFSET = {
  vocab: 0,
  grammar: 0.05,
  usage: 0.1,
  reading: 0.15,
}

const q = ({ id, skill, level, ...question }) => ({
  id,
  skill,
  level,
  difficulty: LEVEL_BY_ID[level].difficulty + SKILL_DIFFICULTY_OFFSET[skill],
  ...question,
})

export const DIAGNOSTIC_QUESTIONS = [
  // ── 英検5級 ───────────────────────────────────────────────────────
  q({
    id: 'diag_v_5',
    skill: 'vocab',
    level: '5',
    prompt: '“always” の意味として最も近いものは？',
    choices: ['ときどき', 'いつも', 'まだ', 'すぐに'],
    answer: 'いつも',
  }),
  q({
    id: 'diag_g_5',
    skill: 'grammar',
    level: '5',
    prompt: 'She ___ tennis every Sunday.',
    choices: ['play', 'plays', 'played', 'playing'],
    answer: 'plays',
  }),
  q({
    id: 'diag_u_5',
    skill: 'usage',
    level: '5',
    prompt: 'I am looking for my key. の “look for” の意味は？',
    choices: ['〜を見る', '〜を探す', '〜に似ている', '〜の世話をする'],
    answer: '〜を探す',
  }),
  q({
    id: 'diag_r_5',
    skill: 'reading',
    level: '5',
    passage: 'Mika has a blue umbrella. It is raining today, so she takes it to school.',
    prompt: 'Why does Mika take her umbrella?',
    choices: ['It is new.', 'It is raining.', 'It is hot.', 'It is Sunday.'],
    answer: 'It is raining.',
  }),

  // ── 英検4級 ───────────────────────────────────────────────────────
  q({
    id: 'diag_v_4',
    skill: 'vocab',
    level: '4',
    prompt: '“invite” の意味として最も近いものは？',
    choices: ['訪問する', '紹介する', '招待する', '発明する'],
    answer: '招待する',
  }),
  q({
    id: 'diag_g_4',
    skill: 'grammar',
    level: '4',
    prompt: 'We ___ dinner when he called us.',
    choices: ['have', 'had', 'were having', 'are having'],
    answer: 'were having',
  }),
  q({
    id: 'diag_u_4',
    skill: 'usage',
    level: '4',
    prompt: 'Aya is interested ___ science.',
    choices: ['at', 'in', 'on', 'with'],
    answer: 'in',
  }),
  q({
    id: 'diag_r_4',
    skill: 'reading',
    level: '4',
    passage:
      'Tom wanted to ride his bicycle after lunch. He saw that one tire was flat, so he walked to the park instead.',
    prompt: 'How did Tom go to the park?',
    choices: ['By bicycle.', 'By bus.', 'On foot.', 'By train.'],
    answer: 'On foot.',
  }),

  // ── 英検3級 ───────────────────────────────────────────────────────
  q({
    id: 'diag_v_3',
    skill: 'vocab',
    level: '3',
    prompt: '“environment” の意味として最も近いものは？',
    choices: ['経験', '環境', '発明', '教育'],
    answer: '環境',
  }),
  q({
    id: 'diag_g_3',
    skill: 'grammar',
    level: '3',
    prompt: 'I have lived in this town ___ 2020.',
    choices: ['for', 'since', 'during', 'from'],
    answer: 'since',
  }),
  q({
    id: 'diag_u_3',
    skill: 'usage',
    level: '3',
    prompt: 'My aunt takes care of her old dog. の “take care of” の意味は？',
    choices: ['〜を連れて行く', '〜をこわがる', '〜の世話をする', '〜を呼び出す'],
    answer: '〜の世話をする',
  }),
  q({
    id: 'diag_r_3',
    skill: 'reading',
    level: '3',
    passage:
      'The science club planned to watch the stars on Friday. The sky became cloudy that evening, so the teacher moved the event to Saturday. The weather was clear then.',
    prompt: 'When did the club watch the stars?',
    choices: ['Thursday.', 'Friday.', 'Saturday.', 'Sunday.'],
    answer: 'Saturday.',
  }),

  // ── 英検準2級 ─────────────────────────────────────────────────────
  q({
    id: 'diag_v_pre2',
    skill: 'vocab',
    level: 'pre2',
    prompt: '“maintain” の意味として最も近いものは？',
    choices: ['維持する', '発見する', '比較する', '許可する'],
    answer: '維持する',
  }),
  q({
    id: 'diag_g_pre2',
    skill: 'grammar',
    level: 'pre2',
    prompt: 'The woman ___ by the window is my English teacher.',
    choices: ['stand', 'stood', 'standing', 'is stood'],
    answer: 'standing',
  }),
  q({
    id: 'diag_u_pre2',
    skill: 'usage',
    level: 'pre2',
    prompt: 'We had to put off the game because of the rain. の “put off” の意味は？',
    choices: ['中止する', '延期する', '再開する', '参加する'],
    answer: '延期する',
  }),
  q({
    id: 'diag_r_pre2',
    skill: 'reading',
    level: 'pre2',
    passage:
      'A local café stopped giving plastic straws automatically. Customers can still ask for one, but most now use the metal spoons provided with cold drinks. The owner says the café buys only one-third as many straws as before.',
    prompt: 'What was the main result of the café’s change?',
    choices: [
      'Cold drinks became cheaper.',
      'More customers asked for plastic straws.',
      'The café uses far fewer plastic straws.',
      'The café stopped selling cold drinks.',
    ],
    answer: 'The café uses far fewer plastic straws.',
  }),

  // ── 英検2級 ───────────────────────────────────────────────────────
  q({
    id: 'diag_v_2',
    skill: 'vocab',
    level: '2',
    prompt: '“inevitable” の意味として最も近いものは？',
    choices: ['予測できない', '避けられない', '説明しにくい', '信頼できる'],
    answer: '避けられない',
  }),
  q({
    id: 'diag_g_2',
    skill: 'grammar',
    level: '2',
    prompt: 'If I ___ more free time, I would learn Spanish.',
    choices: ['have', 'had', 'will have', 'have had'],
    answer: 'had',
  }),
  q({
    id: 'diag_u_2',
    skill: 'usage',
    level: '2',
    prompt: 'The team came up with a practical solution. の “come up with” の意味は？',
    choices: ['〜に追いつく', '〜を思いつく', '〜を取り替える', '〜を実行する'],
    answer: '〜を思いつく',
  }),
  q({
    id: 'diag_r_2',
    skill: 'reading',
    level: '2',
    passage:
      'Some companies introduced meeting-free mornings so employees could focus on demanding tasks. Productivity improved at first, but several teams later reported delays because urgent questions went unanswered. The most successful companies kept the quiet hours while creating a channel for truly urgent messages.',
    prompt: 'What did the most successful companies do?',
    choices: [
      'They ended all quiet hours.',
      'They held more morning meetings.',
      'They allowed a way to handle urgent questions.',
      'They asked employees to work at night.',
    ],
    answer: 'They allowed a way to handle urgent questions.',
  }),

  // ── 英検準1級 ─────────────────────────────────────────────────────
  q({
    id: 'diag_v_pre1',
    skill: 'vocab',
    level: 'pre1',
    prompt: '“meticulous” の意味として最も近いものは？',
    choices: ['細部まで注意深い', '極端に臆病な', 'すぐに飽きる', '一時的な'],
    answer: '細部まで注意深い',
  }),
  q({
    id: 'diag_g_pre1',
    skill: 'grammar',
    level: 'pre1',
    prompt: 'Hardly ___ the meeting started when the alarm rang.',
    choices: ['did', 'was', 'has', 'had'],
    answer: 'had',
  }),
  q({
    id: 'diag_u_pre1',
    skill: 'usage',
    level: 'pre1',
    prompt: 'Many people take clean water for granted. の “take A for granted” の意味は？',
    choices: [
      'Aを当然のものと思う',
      'Aを慎重に調べる',
      'Aを一時的に借りる',
      'Aを高く評価して褒める',
    ],
    answer: 'Aを当然のものと思う',
  }),
  q({
    id: 'diag_r_pre1',
    skill: 'reading',
    level: 'pre1',
    passage:
      'Urban trees can lower street temperatures, but planting them without long-term planning may produce disappointing results. Young trees need water and maintenance for years, and species that thrive today may struggle in a warmer future. Cities therefore gain more by funding continued care and choosing diverse species than by announcing ambitious planting totals alone.',
    prompt: 'What does the passage suggest cities should prioritize?',
    choices: [
      'Planting the largest possible number of one species.',
      'Replacing trees whenever temperatures rise.',
      'Ongoing care and a variety of suitable species.',
      'Publishing planting totals more frequently.',
    ],
    answer: 'Ongoing care and a variety of suitable species.',
  }),

  // ── 英検1級 ───────────────────────────────────────────────────────
  q({
    id: 'diag_v_1',
    skill: 'vocab',
    level: '1',
    prompt: '“ubiquitous” の意味として最も近いものは？',
    choices: ['時代遅れの', '厳しく制限された', '至る所にある', '誤解を招く'],
    answer: '至る所にある',
  }),
  q({
    id: 'diag_g_1',
    skill: 'grammar',
    level: '1',
    prompt: 'It is imperative that every applicant ___ the form by Friday.',
    choices: ['submits', 'submitted', 'submit', 'will submit'],
    answer: 'submit',
  }),
  q({
    id: 'diag_u_1',
    skill: 'usage',
    level: '1',
    prompt: 'Several regulations were introduced in the wake of the accident. の “in the wake of” の意味は？',
    choices: ['〜を防ぐ目的で', '〜の結果として', '〜とは対照的に', '〜より前に'],
    answer: '〜の結果として',
  }),
  q({
    id: 'diag_r_1',
    skill: 'reading',
    level: '1',
    passage:
      'When an indicator becomes the primary target of a policy, people often optimize their behavior for the number rather than for the underlying goal. A school judged solely by test scores may narrow its curriculum, while a hospital rewarded only for shorter stays may avoid complex patients. This does not make measurement useless; it means that indicators must remain open to revision and be interpreted alongside evidence they fail to capture.',
    prompt: 'Which statement best expresses the author’s view?',
    choices: [
      'Quantitative indicators should never influence policy.',
      'A single stable indicator is the fairest basis for rewards.',
      'Complex cases should be excluded from performance reviews.',
      'Indicators are useful only when their limits are continually considered.',
    ],
    answer: 'Indicators are useful only when their limits are continually considered.',
  }),
]

export const DIAGNOSTIC_QUESTION_COUNT = DIAGNOSTIC_QUESTIONS.length
