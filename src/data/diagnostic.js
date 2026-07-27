// 学習診断テストの尺度・基準問題・短文読解バンク。
//
// 実際の受験セットは lib/diagnosticQuestions.js が既存の単語・文法・熟語データと
// 読解バンクから毎回生成する。difficulty は母集団の実測値ではなく、級の並びを
// 標準化したアプリ内推定用の尺度。

export const DIAGNOSTIC_VERSION = 2

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

export function diagnosticDifficulty(levelId, skillId) {
  const level = LEVEL_BY_ID[levelId]
  if (!level) throw new Error(`不明な診断レベルです: ${levelId}`)
  return level.difficulty + (SKILL_DIFFICULTY_OFFSET[skillId] ?? 0)
}

const q = ({ id, skill, level, ...question }) => ({
  id,
  skill,
  level,
  difficulty: diagnosticDifficulty(level, skill),
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

// 読解は通常の級別長文を丸ごと7本読むと診断が長くなりすぎるため、
// 診断専用の短文を各級3種類用意する。連続3回は同じ本文を出さない。
export const DIAGNOSTIC_READING_BANK = [
  ...DIAGNOSTIC_QUESTIONS.filter((item) => item.skill === 'reading'),

  q({
    id: 'diag_r_5_b',
    skill: 'reading',
    level: '5',
    passage:
      'Yuta’s music class starts at nine. He leaves home at eight and takes a bus. He gets to school at eight forty.',
    prompt: 'What time does Yuta get to school?',
    choices: ['At eight.', 'At eight forty.', 'At nine.', 'At nine forty.'],
    answer: 'At eight forty.',
  }),
  q({
    id: 'diag_r_5_c',
    skill: 'reading',
    level: '5',
    passage:
      'Emma has a cat and a dog. She feeds the cat before school. After dinner, she walks the dog with her father.',
    prompt: 'What does Emma do after dinner?',
    choices: ['She feeds the cat.', 'She goes to school.', 'She walks the dog.', 'She reads with her father.'],
    answer: 'She walks the dog.',
  }),

  q({
    id: 'diag_r_4_b',
    skill: 'reading',
    level: '4',
    passage:
      'Kei planned a picnic for Saturday. The weather report said it would rain, so he changed it to Sunday and emailed his friends. Sunday was sunny.',
    prompt: 'Why did Kei change the picnic day?',
    choices: ['His friends were busy.', 'Saturday was expected to be rainy.', 'The park was closed on Sunday.', 'He forgot to buy food.'],
    answer: 'Saturday was expected to be rainy.',
  }),
  q({
    id: 'diag_r_4_c',
    skill: 'reading',
    level: '4',
    passage:
      'The town library closes at six on weekdays and at five on weekends. Aya arrived at four thirty on Saturday to return three books.',
    prompt: 'How much time did Aya have before the library closed?',
    choices: ['Thirty minutes.', 'One hour.', 'One and a half hours.', 'Two hours.'],
    answer: 'Thirty minutes.',
  }),

  q({
    id: 'diag_r_3_b',
    skill: 'reading',
    level: '3',
    passage:
      'Students made posters for their school festival, but the printer stopped working. They shared the event online instead, and more visitors came than they had expected.',
    prompt: 'How did the students advertise the festival after the problem?',
    choices: ['They repaired the printer.', 'They shared it online.', 'They called every visitor.', 'They canceled the posters.'],
    answer: 'They shared it online.',
  }),
  q({
    id: 'diag_r_3_c',
    skill: 'reading',
    level: '3',
    passage:
      'Sam wanted to use less water. He began taking shorter showers and turning off the tap while brushing his teeth. A month later, the water meter showed a clear decrease.',
    prompt: 'What showed that Sam’s actions worked?',
    choices: ['His showers became warmer.', 'He bought a new toothbrush.', 'The water meter reading decreased.', 'A month had passed.'],
    answer: 'The water meter reading decreased.',
  }),

  q({
    id: 'diag_r_pre2_b',
    skill: 'reading',
    level: 'pre2',
    passage:
      'A city bike-sharing program became popular, but downtown stations were often empty in the morning. The operator began moving bicycles from residential areas to downtown before sunrise. Complaints soon decreased.',
    prompt: 'How did the operator address the shortage?',
    choices: ['It bought cars for commuters.', 'It closed residential stations.', 'It moved bicycles before the morning rush.', 'It raised the price downtown.'],
    answer: 'It moved bicycles before the morning rush.',
  }),
  q({
    id: 'diag_r_pre2_c',
    skill: 'reading',
    level: 'pre2',
    passage:
      'In a study, one group kept their phones on their desks while another left them in a different room. The second group solved more difficult problems, although some members said they felt uneasy without their phones.',
    prompt: 'What did the study suggest?',
    choices: ['Phones can distract people even when unused.', 'Difficult problems require phone apps.', 'Feeling relaxed always improves scores.', 'People work best with phones on their desks.'],
    answer: 'Phones can distract people even when unused.',
  }),

  q({
    id: 'diag_r_2_b',
    skill: 'reading',
    level: '2',
    passage:
      'After a company adopted remote work, experienced staff remained productive, but new employees received less informal advice. The company then paired each newcomer with a mentor for a weekly online conversation. New employees began completing tasks more confidently.',
    prompt: 'Why did the company introduce weekly mentoring?',
    choices: ['To reduce the number of new employees.', 'To replace all formal training.', 'To restore guidance that remote work had reduced.', 'To measure how long online meetings lasted.'],
    answer: 'To restore guidance that remote work had reduced.',
  }),
  q({
    id: 'diag_r_2_c',
    skill: 'reading',
    level: '2',
    passage:
      'At a repair café, volunteers do not simply fix broken appliances for visitors. They explain each step and let the owners use the tools. Many visitors later report that they try simple repairs themselves instead of immediately throwing products away.',
    prompt: 'What is an important benefit of the repair café’s approach?',
    choices: ['Visitors learn skills that may reduce waste.', 'Volunteers can sell more new appliances.', 'Repairs are completed without any tools.', 'Owners no longer need to attend the café.'],
    answer: 'Visitors learn skills that may reduce waste.',
  }),

  q({
    id: 'diag_r_pre1_b',
    skill: 'reading',
    level: 'pre1',
    passage:
      'Citizen-science projects can collect observations across areas that professional researchers rarely visit. However, volunteers may identify species differently. Successful projects provide short training tasks and compare uncertain reports with expert-reviewed photographs.',
    prompt: 'How do successful projects improve the reliability of volunteer data?',
    choices: ['They accept reports only from professionals.', 'They limit observations to familiar locations.', 'They combine training with expert checks.', 'They ask volunteers to study every species.'],
    answer: 'They combine training with expert checks.',
  }),
  q({
    id: 'diag_r_pre1_c',
    skill: 'reading',
    level: 'pre1',
    passage:
      'Digitizing museum collections makes rare objects visible to people worldwide, but an image alone may hide an object’s uncertain origin or cultural role. Curators therefore increasingly publish records that include gaps, disputes, and the communities connected to each object.',
    prompt: 'Why do curators publish detailed records with digital images?',
    choices: ['To make every historical claim appear certain.', 'To provide context that an image cannot show by itself.', 'To prevent communities from discussing objects.', 'To replace physical collections completely.'],
    answer: 'To provide context that an image cannot show by itself.',
  }),

  q({
    id: 'diag_r_1_b',
    skill: 'reading',
    level: '1',
    passage:
      'Predictions about human behavior can alter the behavior they seek to forecast. A warning of a shortage may prompt consumers to buy extra supplies, thereby producing the shortage. Conversely, a credible warning can encourage conservation and prevent it. Social forecasts must therefore account for their own influence.',
    prompt: 'What central difficulty of social forecasting does the passage identify?',
    choices: ['Forecasts can change the outcome being predicted.', 'Consumers never respond to credible warnings.', 'Shortages occur only when data are unavailable.', 'Conservation makes forecasting unnecessary.'],
    answer: 'Forecasts can change the outcome being predicted.',
  }),
  q({
    id: 'diag_r_1_c',
    skill: 'reading',
    level: '1',
    passage:
      'Researchers are often rewarded more for novel findings than for attempts to reproduce earlier work. Registered reports address this imbalance by evaluating a study’s question and method before its results are known. Publication is then less dependent on whether the outcome appears surprising.',
    prompt: 'Why can registered reports support more reliable research?',
    choices: ['They guarantee that every hypothesis is correct.', 'They value the study design before the result is known.', 'They prevent researchers from repeating earlier work.', 'They publish only results that appear surprising.'],
    answer: 'They value the study design before the result is known.',
  }),
]
