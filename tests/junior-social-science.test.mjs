// 中学の社会・理科（東京書籍の教科書の単元の順）の教材が、全単元そろっているかを確かめる。
// 依頼台帳 requests/2026-09-29-junior-social-science.json の条件 units-match-textbooks・learn-every-unit・
// practice-every-unit-levels・all-choices-explained・credits-page の確認。
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ALL_SUBJECT_QUESTIONS,
  ALL_SUBJECT_TERMS,
  ALL_SUBJECT_UNITS,
  PRACTICE_LEVEL_IDS,
  QUESTIONS_PER_LEVEL,
  SUBJECTS,
  subjectTerms,
  subjectUnits,
  termQuestion,
} from '../src/data/subjects/index.js'
import { JAPAN_MAP, WORLD_MAP } from '../src/data/subjects/maps.js'
import { CLIMATE_STATIONS } from '../src/data/subjects/climate.js'
import { CREDIT_IDS, CREDIT_SECTIONS } from '../src/data/credits.js'
import { SUBJECT_FIGURE_KINDS } from '../src/data/subjects/figureKinds.js'
import { APP_MENU_SECTIONS } from '../src/lib/appMenu.js'
import { limitQuizChoices } from '../src/lib/quizChoices.js'
import { tokenizeSubjectText } from '../src/lib/subjectText.js'
import { SUBJECT_READINGS } from '../src/data/subjects/readings.js'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const JOYO = new Set(require('joyo-kanji').kanji)

// 令和7年度用の教科書（新編 新しい社会 地理・歴史・公民、新編 新しい科学 1〜3）の単元の順と名前。
const TEXTBOOK_UNITS = Object.freeze({
  geography: [
    '世界の姿', '日本の姿', '人々の生活と環境', 'アジア州', 'ヨーロッパ州', 'アフリカ州', '北アメリカ州',
    '南アメリカ州', 'オセアニア州', '地域調査の手法', '日本の地域的特色', '九州地方', '中国・四国地方',
    '近畿地方', '中部地方', '関東地方', '東北地方', '北海道地方', '持続可能な地域の在り方',
  ],
  history: [
    '歴史をとらえる見方・考え方', '身近な地域の歴史', '世界の古代文明と宗教のおこり', '日本列島の誕生と大陸との交流',
    '古代国家の歩みと東アジア世界', '武士の政権の成立', 'ユーラシアの動きと武士の政治の展開',
    'ヨーロッパ人との出会いと全国統一', '江戸幕府の成立と対外政策の変化', '産業の発達と幕府政治の推移',
    '欧米における近代化の進展', '欧米の進出と日本の開国', '明治維新', '日清・日露戦争と近代産業',
    '第一次世界大戦と日本', '大正デモクラシーの時代', '世界恐慌と日本の中国侵略', '第二次世界大戦と日本',
    '戦後日本の出発', '冷戦と日本の発展', '新たな時代の日本と世界',
  ],
  civics: [
    '現代社会の特色と私たち', '私たちの生活と文化', '現代社会の見方や考え方', '人権と日本国憲法',
    '人権と共生社会', 'これからの人権保障', '現代の民主政治', '国の政治の仕組み', '地方自治と私たち',
    '消費生活と経済', '生産と労働', '市場経済の仕組みと金融', '財政と国民の福祉', 'これからの経済と社会',
    '国際社会の仕組み', 'さまざまな国際問題', 'これからの地球社会と日本', 'より良い社会を目指して',
  ],
  science1: [
    '生物の観察と分類のしかた', '植物の分類', '動物の分類', '身のまわりの物質とその性質', '気体の性質',
    '水溶液の性質', '物質の姿と状態変化', '光の世界', '音の世界', '力の世界', '火をふく大地', '動き続ける大地',
    '地層から読みとる大地の変化',
  ],
  science2: [
    '物質のなり立ち', '物質どうしの化学変化', '酸素がかかわる化学変化', '化学変化と物質の質量', '化学変化とその利用',
    '生物と細胞', '植物のからだのつくりとはたらき', '動物のからだのつくりとはたらき', '刺激と反応',
    '気象の観測', '雲のでき方と前線', '大気の動きと日本の天気', '静電気と電流', '電流の性質', '電流と磁界',
  ],
  science3: [
    '水溶液とイオン', '酸、アルカリとイオン', '化学変化と電池', '生物の成長と生殖', '遺伝の規則性と遺伝子',
    '生物の多様性と進化', '物体の運動', '力のはたらき方', 'エネルギーと仕事', '地球の運動と天体の動き',
    '月と金星の見え方', '宇宙の広がり', '自然のなかの生物', '自然環境の調査と保全', '科学技術と人間',
    '持続可能な社会のために',
  ],
})
const PREFIX = Object.freeze({ geography: 'geo', history: 'his', civics: 'civ', science1: 'sc1', science2: 'sc2', science3: 'sc3' })
const BOOK_SUBJECT = Object.freeze({ geography: 'social', history: 'social', civics: 'social', science1: 'science', science2: 'science', science3: 'science' })

// ── units-match-textbooks ──
test('社会3冊・理科3冊の全102単元が、教科書の単元の順と名前でそろっている', () => {
  let total = 0
  for (const [book, titles] of Object.entries(TEXTBOOK_UNITS)) {
    const units = subjectUnits(BOOK_SUBJECT[book], book)
    assert.deepEqual(units.map((unit) => unit.title), titles, `${book}: 単元の名前と順`)
    assert.deepEqual(
      units.map((unit) => unit.id),
      titles.map((_, index) => `${PREFIX[book]}-${String(index + 1).padStart(2, '0')}`),
      `${book}: 単元のID`,
    )
    total += units.length
  }
  assert.equal(total, 102)
  assert.equal(ALL_SUBJECT_UNITS.length, 102)
  assert.deepEqual(SUBJECTS.social.books.map((book) => book.id), ['geography', 'history', 'civics'])
  assert.deepEqual(SUBJECTS.science.books.map((book) => book.id), ['science1', 'science2', 'science3'])
})

// ── learn-every-unit ──
test('全単元に、めあて・要点（4つ以上）・重要語句（8つ以上）がある', () => {
  const failures = []
  for (const unit of ALL_SUBJECT_UNITS) {
    if (!unit.goal?.trim()) failures.push(`${unit.id}: めあてがない`)
    if (!unit.part?.trim() || !unit.chapter?.trim()) failures.push(`${unit.id}: 編・章がない`)
    if (unit.points.length < 4) failures.push(`${unit.id}: 要点が ${unit.points.length}`)
    for (const [index, point] of unit.points.entries()) {
      if (!point.heading?.trim() || !point.body?.trim()) failures.push(`${unit.id}: 要点${index + 1}の見出しか本文がない`)
      if (point.body.length < 60) failures.push(`${unit.id}: 要点${index + 1}の本文が短い（${point.body.length}字）`)
    }
    if (new Set(unit.points.map((point) => point.heading)).size !== unit.points.length) failures.push(`${unit.id}: 要点の見出しが重複`)
    if (unit.terms.length < 8) failures.push(`${unit.id}: 重要語句が ${unit.terms.length}`)
  }
  assert.deepEqual(failures, [])
})

test('重要語句は教科の中で重ならず、意味の文に語句そのものを書かない（語句テストの答えが見えない）', () => {
  const failures = []
  for (const subject of Object.keys(SUBJECTS)) {
    const seen = new Map()
    for (const term of subjectTerms(subject)) {
      if (!term.term?.trim() || !term.meaning?.trim()) failures.push(`${term.id}: 語句か意味がない`)
      if (term.meaning.includes(term.term)) failures.push(`${term.id}: 意味に「${term.term}」が入っている`)
      if (seen.has(term.term)) failures.push(`${term.id}: 「${term.term}」が ${seen.get(term.term)} と重複`)
      seen.set(term.term, term.id)
    }
  }
  assert.deepEqual(failures, [])
})

test('語句テストは、どの語句も答え1つと別の語句3つの4択になり、選択肢の説明はその語句の意味', () => {
  const failures = []
  for (const term of ALL_SUBJECT_TERMS) {
    const question = termQuestion(term)
    if (question.choices.length !== 4) failures.push(`${term.id}: 選択肢が ${question.choices.length}`)
    if (new Set(question.choices).size !== question.choices.length) failures.push(`${term.id}: 選択肢が重複`)
    if (question.choices.filter((choice) => choice === term.term).length !== 1) failures.push(`${term.id}: 答えが1つでない`)
    for (const choice of question.choices) {
      if (!question.notes[choice]?.trim()) failures.push(`${term.id}: 「${choice}」の説明がない`)
    }
    const shown = limitQuizChoices(question.choices, question.answer, { seed: question.id })
    if (shown.length !== 3 || !shown.includes(question.answer)) failures.push(`${term.id}: 出題が3択にならない`)
  }
  assert.deepEqual(failures, [])
})

// ── practice-every-unit-levels ──
test('全単元に、基礎・標準・入試の演習がそれぞれ決まった数ある', () => {
  const failures = []
  for (const unit of ALL_SUBJECT_UNITS) {
    for (const level of PRACTICE_LEVEL_IDS) {
      const count = unit.questions.filter((question) => question.level === level).length
      if (count !== QUESTIONS_PER_LEVEL[level]) failures.push(`${unit.id}: ${level} が ${count}問`)
    }
    if (unit.questions.some((question) => !PRACTICE_LEVEL_IDS.includes(question.level))) failures.push(`${unit.id}: 段階の値が不正`)
  }
  assert.deepEqual(failures, [])
  const perUnit = Object.values(QUESTIONS_PER_LEVEL).reduce((sum, count) => sum + count, 0)
  assert.equal(ALL_SUBJECT_QUESTIONS.length, 102 * perUnit)
})

// ── all-choices-explained ──
test('演習の全問に解説があり、選ぶ問題は4択すべてに説明、数を入れる問題は解き方、並べる問題は順の理由がある', () => {
  const failures = []
  for (const question of ALL_SUBJECT_QUESTIONS) {
    const at = question.id
    if (!question.text?.trim()) failures.push(`${at}: 問題文がない`)
    if (!question.explanation?.trim()) failures.push(`${at}: 解説がない`)
    if (question.kind === 'choice') {
      if (question.choices.length !== 4) failures.push(`${at}: 選択肢が ${question.choices.length}`)
      if (new Set(question.choices).size !== question.choices.length) failures.push(`${at}: 選択肢が重複`)
      if (question.answer !== question.choices[0]) failures.push(`${at}: 正解が先頭にない`)
      for (const choice of question.choices) {
        const note = question.notes[choice]
        if (!note?.trim()) failures.push(`${at}: 「${choice}」の説明がない`)
        else if (note.trim() === choice.trim()) failures.push(`${at}: 「${choice}」の説明が選択肢と同じ`)
      }
      const shown = limitQuizChoices(question.choices, question.answer, { seed: question.id })
      if (shown.length !== 3 || !shown.includes(question.answer)) failures.push(`${at}: 出題が3択にならない`)
    } else if (question.kind === 'number') {
      if (!Number.isFinite(question.answer)) failures.push(`${at}: 答えが数でない`)
      if (!question.steps.length) failures.push(`${at}: 解き方がない`)
      if (String(Math.abs(question.answer)).replace('.', '').length > 7) failures.push(`${at}: 数字キーで入らない桁数`)
    } else if (question.kind === 'order') {
      if (question.items.length < 3) failures.push(`${at}: 並べるものが ${question.items.length}`)
      if (new Set(question.items).size !== question.items.length) failures.push(`${at}: 並べるものが重複`)
      for (const item of question.items) if (!question.notes[item]?.trim()) failures.push(`${at}: 「${item}」の理由がない`)
    } else failures.push(`${at}: 問題の形 ${question.kind}`)
  }
  assert.deepEqual(failures, [])
})

// 並べた図（set）の中の図までたどる。
const withItems = (figure) => (figure ? [figure, ...(figure.type === 'set' ? figure.items.flatMap(withItems) : [])] : [])
const figuresOf = () => ALL_SUBJECT_UNITS.flatMap((unit) => [
  ...unit.points.flatMap((point) => withItems(point.figure).map((figure) => ({ at: `${unit.id}:${point.heading}`, figure }))),
  ...unit.questions.flatMap((question) => withItems(question.figure).map((figure) => ({ at: question.id, figure }))),
])

test('図の指定は描ける形で、地図の印は実在する県・国、雨温図は取った地点を指す', () => {
  const prefectures = new Set(JAPAN_MAP.prefectures.map((pref) => pref.code))
  const countries = new Set(WORLD_MAP.countries.map((country) => country.code))
  const failures = []
  for (const { at, figure } of figuresOf()) {
    if (figure.type === 'japanMap') {
      for (const code of Object.keys(figure.marks ?? {})) if (!prefectures.has(code)) failures.push(`${at}: 県 ${code}`)
    } else if (figure.type === 'worldMap') {
      for (const code of Object.keys(figure.marks ?? {})) if (!countries.has(code)) failures.push(`${at}: 国 ${code}`)
      for (const line of figure.lines ?? []) if (!(line in WORLD_MAP.lines)) failures.push(`${at}: 線 ${line}`)
      for (const river of figure.rivers ?? []) if (!WORLD_MAP.rivers.some((item) => item.id === river)) failures.push(`${at}: 川 ${river}`)
    } else if (figure.type === 'climate') {
      if (!CLIMATE_STATIONS[figure.station]) failures.push(`${at}: 地点 ${figure.station}`)
    } else if (figure.type === 'table') {
      if (!figure.columns?.length || !figure.rows?.length) failures.push(`${at}: 表が空`)
      for (const row of figure.rows ?? []) if (row.length !== figure.columns.length) failures.push(`${at}: 表の列の数`)
    } else if (figure.type === 'bars') {
      if (!figure.items?.length || figure.items.some(([, value]) => !Number.isFinite(value))) failures.push(`${at}: 棒グラフの値`)
    } else if (figure.type === 'lines') {
      if (!figure.series?.length || figure.series.some((series) => !series.points?.length)) failures.push(`${at}: 折れ線の値`)
    } else if (!SUBJECT_FIGURE_KINDS.includes(figure.type)) failures.push(`${at}: 図の種類 ${figure.type}`)
    // ほかの種類（図解・判断の手順・年表など）の中身は tests/junior-social-science-figures.test.mjs が確かめる。
  }
  assert.deepEqual(failures, [])
})

// ── credits-page ──
test('出典のページはメニューのいちばん下の区切りにあり、図に使った資料をすべて載せている', () => {
  const last = APP_MENU_SECTIONS.at(-1)
  assert.deepEqual(last.items.map((item) => item.screen), ['credits'])
  assert.equal(last.items[0].label, '出典')

  const needed = new Set(['tosho-social', 'tosho-science'])
  for (const { figure } of figuresOf()) {
    // 地図の形と、地球儀・世界全図の陸の形は Natural Earth から作る。
    if (['japanMap', 'worldMap', 'azimuthalMap', 'worldOverview'].includes(figure.type) || (figure.type === 'diagram' && figure.name === 'globe')) needed.add('natural-earth')
    if (figure.type === 'climate') needed.add(CLIMATE_STATIONS[figure.station]?.country === '日本' ? 'jma-normals-japan' : 'jma-normals-world')
    if (figure.source) needed.add(figure.source)
  }
  const missing = [...needed].filter((id) => !CREDIT_IDS.includes(id))
  assert.deepEqual(missing, [])
  for (const section of CREDIT_SECTIONS) {
    for (const item of section.items) {
      assert.ok(item.name?.trim() && item.use?.trim(), `${item.id}: 名前と使い道`)
    }
  }
})

// ── 読みがな ──
// 常用漢字にない字をふくむ語は、読みがなの辞書（readings.js）が当たるか、文の中に（よみ）を書く。
const stringsOf = (value, out = []) => {
  if (typeof value === 'string') out.push(value)
  else if (Array.isArray(value)) value.forEach((item) => stringsOf(item, out))
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => stringsOf(item, out))
  return out
}

test('常用漢字にない字をふくむ語には、どこでも読みがなが付く（辞書か、文の中の（よみ））', () => {
  const missing = new Map()
  for (const unit of ALL_SUBJECT_UNITS) {
    for (const text of stringsOf(unit)) {
      for (const segment of tokenizeSubjectText(text)) {
        if (segment.reading) continue
        for (const match of segment.text.matchAll(/[\p{Script=Han}々〆ヶ]+/gu)) {
          if (![...match[0]].some((char) => !'々〆ヶ'.includes(char) && !JOYO.has(char))) continue
          const after = segment.text.slice(match.index + match[0].length, match.index + match[0].length + 2)
          if (/^[(（][ぁ-ゖー・]/u.test(after)) continue
          missing.set(match[0], `${unit.id}: ${text.slice(0, 30)}`)
        }
      }
    }
  }
  assert.deepEqual([...missing].map(([run, at]) => `${run}（${at}）`), [])
  // 辞書の読みはひらがな（中国・朝鮮の地名・人名で教科書が現地の読みを示すものはカタカナ）で、語は重ならない。
  const words = SUBJECT_READINGS.map(([word]) => word)
  assert.equal(new Set(words).size, words.length)
  // 常用漢字だけでも読みにくい語（浄瑠璃など）は、辞書に入れて読みがなを付けてよい。
  // カタカナの読みの語は tests/junior-social-science-katakana-names.test.mjs が記録と照らし合わせる。
  for (const [word, reading] of SUBJECT_READINGS) assert.match(reading, /^([ぁ-ゖー]+|[ァ-ヺー]+)$/u, word)
})
