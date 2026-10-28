// 基礎長文：級ごとに、その級までの語彙で読める短めの長文で、長文読解の30ルールをすべて学ぶ教材。
//
// 1本の長文は、その級の長文問題によく出るテーマを1つ扱い、ルールを3つずつ学ぶ（1つの級は10本で30ルール）。
// 長文の形（level-*.js）
//   id・level・theme（BASIC_READING_THEMES の id）・kind（BASIC_READING_KINDS の id）・emoji・title・titleJa
//   names    … 本文の固有名詞（人名・地名など。級の検査から外す）
//   forms    … つづりが同じ別の見出し語に当たってしまう語の行き先（{ 本文の語: 見出し語の id }）
//   inferWords … 「知らない単語は、品詞・対比・例から意味を絞る」の問題で推測させる、級より上の語の id
//   phrases  … 本文に出る、その級までの熟語・構文の id
//   sentences … 本文の文（en・ja・paragraphStart）
//   lessons  … ルールの学習。rule（READING_RULES の id）・sentences（ルールを使う文の番号、0から）・
//              how（この本文での当てはめ方）・question・choices（[選択肢, その選択肢の説明]）・answer（正解の番号）

import { BASIC_READING_LEVEL_5 } from './level-5.js'
import { BASIC_READING_LEVEL_4 } from './level-4.js'
import { BASIC_READING_LEVEL_3 } from './level-3.js'
import { BASIC_READING_LEVEL_PRE2 } from './level-pre2.js'
import { BASIC_READING_LEVEL_2 } from './level-2.js'

export const BASIC_READING_QUIZ_DOMAIN = 'basic-reading'

export const BASIC_READING_LEVEL_IDS = Object.freeze(['5', '4', '3', 'pre2', '2'])

export const BASIC_READING_KINDS = Object.freeze({
  story: '物語',
  notice: '案内文',
  email: 'Eメール',
  letter: '手紙',
  explanation: '説明文',
  opinion: '論説文',
})

// 級ごとの本文の語数の目安。ルールを3つ学ぶのに要る長さ（段落が2つ以上）にし、級が上がるほど長くする。
export const BASIC_READING_LENGTH = Object.freeze({
  5: Object.freeze({ min: 60, max: 120 }),
  4: Object.freeze({ min: 90, max: 150 }),
  3: Object.freeze({ min: 120, max: 190 }),
  pre2: Object.freeze({ min: 140, max: 230 }),
  2: Object.freeze({ min: 170, max: 270 }),
})

// 級ごとの、長文問題によく出るテーマ。1本の長文が1テーマを扱い、一覧の全テーマを扱う。
export const BASIC_READING_THEMES = Object.freeze({
  5: Object.freeze([
    { id: 'family', label: '自己紹介と家族' },
    { id: 'school-day', label: '学校の一日' },
    { id: 'sports', label: 'スポーツの試合' },
    { id: 'free-time', label: '好きなこと・休みの過ごし方' },
    { id: 'food', label: '食べ物・料理' },
    { id: 'weekend-event', label: '週末の行事のお知らせ' },
    { id: 'animals', label: '動物' },
    { id: 'seasons', label: '季節と天気' },
    { id: 'shopping', label: '買い物・お店' },
    { id: 'friends', label: '友達への手紙・パーティー' },
  ]),
  4: Object.freeze([
    { id: 'school-festival', label: '学校行事のお知らせ' },
    { id: 'club', label: '部活動' },
    { id: 'family-trip', label: '家族旅行' },
    { id: 'friend-abroad', label: '外国の友達とのEメール' },
    { id: 'cooking', label: '料理と誕生日' },
    { id: 'library-event', label: '図書館・地域のイベント' },
    { id: 'music', label: '音楽と習いごと' },
    { id: 'helping', label: '家の手伝い・人の役に立つこと' },
    { id: 'dream-job', label: '仕事・将来の夢' },
    { id: 'zoo-nature', label: '動物園・自然' },
  ]),
  3: Object.freeze([
    { id: 'volunteer', label: 'ボランティアの募集' },
    { id: 'homestay', label: 'ホームステイ・留学' },
    { id: 'famous-person', label: '人物の伝記' },
    { id: 'festival', label: '外国の文化と祭り' },
    { id: 'animal-life', label: '動物のくらし' },
    { id: 'club-friendship', label: '部活動と友情' },
    { id: 'recycling', label: '環境・リサイクル' },
    { id: 'sport-history', label: 'スポーツの歴史' },
    { id: 'health', label: '健康と食事' },
    { id: 'technology', label: '技術とくらし' },
  ]),
  pre2: Object.freeze([
    { id: 'work-experience', label: '職場体験・学校の連絡' },
    { id: 'plastic', label: '環境問題' },
    { id: 'robots', label: '科学技術' },
    { id: 'sleep', label: '健康' },
    { id: 'tradition', label: '伝統文化' },
    { id: 'bees', label: '生き物と自然' },
    { id: 'food-culture', label: '食文化' },
    { id: 'tourism', label: '観光と地域' },
    { id: 'online-learning', label: '教育' },
    { id: 'community', label: '地域社会・ボランティア' },
  ]),
  2: Object.freeze([
    { id: 'energy', label: 'エネルギーと環境' },
    { id: 'medicine', label: '医療・健康' },
    { id: 'digital', label: '情報技術' },
    { id: 'education', label: '教育' },
    { id: 'aging', label: '高齢化と社会' },
    { id: 'workstyle', label: '働き方・ビジネス' },
    { id: 'history', label: '歴史' },
    { id: 'biology', label: '生物の研究' },
    { id: 'agriculture', label: '食と農業' },
    { id: 'city-transport', label: '都市と交通' },
  ]),
})

const BY_LEVEL = Object.freeze({
  5: BASIC_READING_LEVEL_5,
  4: BASIC_READING_LEVEL_4,
  3: BASIC_READING_LEVEL_3,
  pre2: BASIC_READING_LEVEL_PRE2,
  2: BASIC_READING_LEVEL_2,
})

export const BASIC_READING_PASSAGES = Object.freeze(
  BASIC_READING_LEVEL_IDS.flatMap((level) => BY_LEVEL[level]),
)

export const BASIC_READING_PASSAGES_BY_ID = Object.freeze(
  Object.fromEntries(BASIC_READING_PASSAGES.map((passage) => [passage.id, passage])),
)

export const getBasicReadingPassage = (id) => BASIC_READING_PASSAGES_BY_ID[id] ?? null

export const basicReadingPassagesForLevel = (level) => BY_LEVEL[level] ?? []

export const basicReadingThemeLabel = (passage) =>
  BASIC_READING_THEMES[passage?.level]?.find((theme) => theme.id === passage.theme)?.label ?? ''

/** ルールの問題1問の id（記録の鍵）。 */
export const basicReadingQuestionId = (passage, lesson) => `${passage.id}#${lesson.rule}`

/** 全長文のルールの問題（記録・進み具合の母数）。 */
export const BASIC_READING_QUESTIONS = Object.freeze(
  BASIC_READING_PASSAGES.flatMap((passage) => passage.lessons.map((lesson) => ({
    id: basicReadingQuestionId(passage, lesson),
    passageId: passage.id,
    rule: lesson.rule,
  }))),
)
