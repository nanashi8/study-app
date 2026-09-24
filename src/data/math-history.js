// ── 数学の歴史をたどって、基本から学び直すコース ─────────────────────────
// 1話＝1つの発見・発明。「困っていたこと → 発見の筋道 → 動かす図 → 今の使われ方 → テスト」で学ぶ。
// 並びは学ぶ順（算数の基本 → 中学の数学 → 高校の数学）。年代順の表示は year で並べ替える。
//
// 話（chapter）の形は src/data/math-history/basic-number.js の冒頭を参照。
// 史実を1件ずつ確かめた記録は docs/audits/math-history-facts.json（scripts/checks/math-history.mjs が突き合わせる）。
import { MATH_HISTORY_BASIC_NUMBER } from './math-history/basic-number.js'
import { MATH_HISTORY_BASIC_SHAPE } from './math-history/basic-shape.js'
import { MATH_HISTORY_BASIC_CHANGE } from './math-history/basic-change.js'
import { MATH_HISTORY_BASIC_DATA } from './math-history/basic-data.js'
import { MATH_HISTORY_JUNIOR } from './math-history/junior.js'
import { MATH_HISTORY_JUNIOR_MORE } from './math-history/junior-more.js'
import { MATH_HISTORY_SENIOR } from './math-history/senior.js'
import { MATH_HISTORY_SENIOR_CALCULUS } from './math-history/senior-calculus.js'

export const MATH_HISTORY_PARTS = Object.freeze([
  {
    id: 'basic',
    title: '算数の基本',
    short: '算数',
    emoji: '🔢',
    color: '#0ea5e9',
    summary: '数えることから、分数・図形・割合・グラフまで',
  },
  {
    id: 'junior',
    title: '中学の数学',
    short: '中学',
    emoji: '📐',
    color: '#10b981',
    summary: '負の数・方程式・関数・証明・三平方の定理・確率',
  },
  {
    id: 'senior',
    title: '高校の数学',
    short: '高校',
    emoji: '🧭',
    color: '#7c3aed',
    summary: '三角比・対数・複素数・数列・微分と積分・統計',
  },
])

// 小学校算数の内容（数と計算・図形・測定・変化と関係・データの活用）を33項目にまとめた一覧。
// どの項目も、その考えが生まれた話が1話以上ある（scripts/checks/math-history.mjs basics）。
export const MATH_BASICS = Object.freeze([
  { id: 'b-count', domain: '数と計算', title: '数の意味と数え方（1つずつ対応させる・まとまりで数える）' },
  { id: 'b-place', domain: '数と計算', title: '位取りの書き方と大きな数（万・億・兆）、0の意味' },
  { id: 'b-add', domain: '数と計算', title: 'たし算・ひき算（くり上がり・くり下がり・筆算）' },
  { id: 'b-soroban', domain: '数と計算', title: 'そろばん' },
  { id: 'b-multiply', domain: '数と計算', title: 'かけ算（九九・筆算）' },
  { id: 'b-divide', domain: '数と計算', title: 'わり算（あまり・筆算）' },
  { id: 'b-laws', domain: '数と計算', title: '計算のきまり（交換・結合・分配のきまり、計算の順序）' },
  { id: 'b-round', domain: '数と計算', title: '概数と四捨五入' },
  { id: 'b-decimal', domain: '数と計算', title: '小数のしくみと計算' },
  { id: 'b-fraction', domain: '数と計算', title: '分数の意味と大きさ' },
  { id: 'b-fraction-calc', domain: '数と計算', title: '分数の計算（約分・通分・たし算・ひき算・かけ算・わり算）' },
  { id: 'b-integer', domain: '数と計算', title: '整数の性質（偶数・奇数、約数・倍数、公約数・公倍数）' },
  { id: 'b-letters', domain: '数と計算', title: '□や文字を使った式' },
  { id: 'b-plane', domain: '図形', title: '平面図形（三角形・四角形・円・多角形、平行・垂直）' },
  { id: 'b-solid', domain: '図形', title: '立体図形（直方体・立方体・角柱・円柱・球、展開図）' },
  { id: 'b-position', domain: '図形', title: 'ものの位置の表し方（数の組で表す）' },
  { id: 'b-angle', domain: '図形', title: '角の大きさ（度）と、三角形・多角形の角の和' },
  { id: 'b-congruence', domain: '図形', title: '合同と対称（線対称・点対称）' },
  { id: 'b-scale', domain: '図形', title: '拡大図と縮図' },
  { id: 'b-area', domain: '図形', title: '面積（長方形・正方形・三角形・平行四辺形・ひし形・台形、およその面積）' },
  { id: 'b-circle', domain: '図形', title: '円周率と円の面積' },
  { id: 'b-volume', domain: '図形', title: '体積（直方体・立方体・角柱・円柱）' },
  { id: 'b-units', domain: '測定', title: '長さ・かさ・重さの単位と測定' },
  { id: 'b-time', domain: '測定', title: '時刻と時間' },
  { id: 'b-change', domain: '変化と関係', title: '伴って変わる二つの数量（表・式・グラフ）' },
  { id: 'b-per-unit', domain: '変化と関係', title: '単位量あたりの大きさと速さ' },
  { id: 'b-percent', domain: '変化と関係', title: '割合と百分率' },
  { id: 'b-ratio', domain: '変化と関係', title: '比' },
  { id: 'b-proportion', domain: '変化と関係', title: '比例と反比例' },
  { id: 'b-graphs', domain: 'データの活用', title: '表とグラフ（絵グラフ・棒グラフ・折れ線グラフ・円グラフ・帯グラフ）' },
  { id: 'b-mean', domain: 'データの活用', title: '平均' },
  { id: 'b-distribution', domain: 'データの活用', title: '代表値とデータの散らばり（中央値・最頻値・ドットプロット・度数分布・柱状グラフ）' },
  { id: 'b-cases', domain: 'データの活用', title: '起こり得る場合（並べ方・組み合わせ）' },
])

// 分野の色。数学マップの分野の色（MATH_UNITS の color）とそろえる。
export const MATH_HISTORY_THEME_COLORS = Object.freeze({
  数と計算: '#6366f1',
  数と式: '#6366f1',
  方程式: '#7c3aed',
  変化と関係: '#0ea5e9',
  関数: '#0ea5e9',
  図形: '#10b981',
  測定: '#0d9488',
  'データの活用': '#f59e0b',
  '確率・データ': '#f59e0b',
  三角比: '#ec4899',
  '微分・積分': '#0d9488',
  ベクトル: '#f43f5e',
  数列: '#06b6d4',
})

// 年代順の表示で使う時代の区切り（year がこの範囲に入る話をまとめる）。
export const MATH_HISTORY_ERAS = Object.freeze([
  { id: 'ancient', title: '紀元前', note: '数を記録し、土地をはかり、証明が生まれた時代', from: -Infinity, to: 0 },
  { id: 'classical', title: '1〜1400年', note: 'インド・中国・アラビアで計算と代数が育った時代', from: 0, to: 1400 },
  { id: 'early-modern', title: '1400〜1700年', note: '記号・対数・座標・確率・微分積分が生まれた時代', from: 1400, to: 1700 },
  { id: 'modern', title: '1700〜1900年', note: '関数・統計・複素数が広がった時代', from: 1700, to: 1900 },
  { id: 'contemporary', title: '1900年から', note: '統計と計算機の時代', from: 1900, to: Infinity },
])

// テストの問題ごとの結果を contentQuizResults に残すときの教材名。
export const MATH_HISTORY_QUIZ_DOMAIN = 'math-history'

export const MATH_HISTORY_CHAPTERS = Object.freeze([
  ...MATH_HISTORY_BASIC_NUMBER,
  ...MATH_HISTORY_BASIC_SHAPE,
  ...MATH_HISTORY_BASIC_CHANGE,
  ...MATH_HISTORY_BASIC_DATA,
  ...MATH_HISTORY_JUNIOR,
  ...MATH_HISTORY_JUNIOR_MORE,
  ...MATH_HISTORY_SENIOR,
  ...MATH_HISTORY_SENIOR_CALCULUS,
])

// テストの問題（話ごとの quiz を1列に並べ、どの話の問題かを持たせる）。
export const MATH_HISTORY_QUESTIONS = Object.freeze(
  MATH_HISTORY_CHAPTERS.flatMap((chapter) => chapter.quiz.map((question) => Object.freeze({
    ...question,
    chapterId: chapter.id,
  }))),
)

const CHAPTER_BY_ID = new Map(MATH_HISTORY_CHAPTERS.map((chapter) => [chapter.id, chapter]))
const QUESTION_BY_ID = new Map(MATH_HISTORY_QUESTIONS.map((question) => [question.id, question]))

export const mathHistoryChapter = (id) => CHAPTER_BY_ID.get(id) ?? null
export const mathHistoryQuestion = (id) => QUESTION_BY_ID.get(id) ?? null
export const mathHistoryPart = (id) => MATH_HISTORY_PARTS.find((part) => part.id === id) ?? null
export const mathHistoryThemeColor = (theme) => MATH_HISTORY_THEME_COLORS[theme] ?? '#6366f1'

/** 部ごとの話（学ぶ順）。 */
export const chaptersForPart = (partId) => MATH_HISTORY_CHAPTERS.filter((chapter) => chapter.part === partId)

/** 単元の中心の考えが生まれた話（数学マップの単元の導入から開く）。 */
export const chaptersForUnit = (unitId) => MATH_HISTORY_CHAPTERS.filter((chapter) => chapter.units.includes(unitId))

/** 算数の基本の項目を学べる話。 */
export const chaptersForBasic = (basicId) => MATH_HISTORY_CHAPTERS.filter((chapter) => chapter.basics.includes(basicId))

/** 話の通し番号（学ぶ順で1から）。 */
export const chapterNumber = (id) => MATH_HISTORY_CHAPTERS.findIndex((chapter) => chapter.id === id) + 1

/** 学ぶ順で前後の話。 */
export function chapterNeighbors(id) {
  const index = MATH_HISTORY_CHAPTERS.findIndex((chapter) => chapter.id === id)
  if (index < 0) return { previous: null, next: null }
  return {
    previous: MATH_HISTORY_CHAPTERS[index - 1] ?? null,
    next: MATH_HISTORY_CHAPTERS[index + 1] ?? null,
  }
}

/** 年代順（同じ年代なら学ぶ順）。 */
export function chaptersByYear() {
  return MATH_HISTORY_CHAPTERS
    .map((chapter, index) => ({ chapter, index }))
    .sort((a, b) => a.chapter.year - b.chapter.year || a.index - b.index)
    .map(({ chapter }) => chapter)
}

/** 年代の区切りごとの話（年代順）。話のない区切りは出さない。 */
export function chaptersByEra() {
  const ordered = chaptersByYear()
  return MATH_HISTORY_ERAS
    .map((era) => ({
      era,
      chapters: ordered.filter((chapter) => chapter.year >= era.from && chapter.year < era.to),
    }))
    .filter((group) => group.chapters.length > 0)
}

/** 話の集まりのテストの問題（話の並びの順）。 */
export const questionsForChapters = (chapterIds = []) => {
  const wanted = new Set(chapterIds)
  return MATH_HISTORY_QUESTIONS.filter((question) => wanted.has(question.chapterId))
}
