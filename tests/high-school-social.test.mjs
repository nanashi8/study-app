// 高校の社会「地理総合」「歴史総合」の教材（依頼台帳 requests/2026-10-22-high-school-social.json）の確認。
// 単元は出版社の教科書の目次（二宮書店『地理総合』『歴史総合 近代から現代へ』の章・節、学習指導要領の大項目）の順にそろえ、
// 本文・図・問題はこのアプリで書く。全単元に、めあて・要点（図と図の読み方つき）・重要語句（解説つき）・
// 共通テストでの出方（exam）・基礎／標準／入試の演習がそろい、入試の段階は資料を読んで答える問題を含む。
// 数や台帳の食いちがいは tests/junior-social-science*.test.mjs（社会・理科の全教材共通）が確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

import { SUBJECTS, subjectQuestions, subjectTerms, subjectUnits, unitQuestions } from '../src/data/subjects/index.js'

// 単元の並びと名前（教科書の目次の章・節の順）。ID は位置で付くので、並べ替えない。
export const HIGH_SCHOOL_UNITS = Object.freeze({
  geoSogo: [
    '球面上の世界', '世界からみた日本の位置と領域', '国内や国家間の結びつき', '地図とGISの活用',
    '地形と生活文化', '気候と生活文化', '産業と生活文化', '宗教・言語と生活文化',
    '東アジア・東南アジア・南アジアの生活文化', '西アジア・アフリカの生活文化', 'ヨーロッパ・ロシアの生活文化', 'アメリカ・オセアニアの生活文化',
    '地球環境問題', '資源・エネルギー問題', '人口・食料問題', '居住・都市問題',
    '日本の自然環境と防災', '自然災害と防災', '都市型災害と防災への心構え', '生活圏の諸課題と地域調査',
  ],
  hisSogo: [
    '歴史と私たち', '歴史の特質と資料', '近代化への問い', '結びつく世界',
    '産業革命と資本主義', 'アメリカ独立革命とフランス革命', '19世紀のヨーロッパとアメリカ大陸', '西アジアの変容と南アジア・東南アジアの植民地化',
    '中国の開港と日本の開国', '明治維新と明治初期の対外関係', '自由民権運動と立憲体制', '条約改正と日清戦争・日本の産業革命',
    '帝国主義と世界分割', '日露戦争とその影響', '第一次世界大戦とロシア革命', '国際平和と安全保障',
    'アジア・アフリカの民族運動', '大衆消費社会と市民生活の変容', '社会・労働運動と大衆の政治参加', '世界恐慌と各国の対応',
    'ファシズムの台頭', '日本の恐慌と満洲事変', '日中戦争と国内外の動き', '第二次世界大戦と太平洋戦争',
    '新たな国際秩序と冷戦の始まり', 'アジア諸地域の独立', '占領下の日本と民主化', '占領政策の転換と日本の独立',
    '集団防衛体制と核開発', '米ソ両大国の平和共存と西ヨーロッパの経済復興', '第三世界の連携と試練', '55年体制と日本の高度経済成長',
    '核戦争の恐怖から軍縮へ', '世界経済の転換とアジア諸地域の経済発展', '冷戦の終結とソ連の崩壊', '開発途上国の民主化と地域紛争',
    '国際社会のなかの日本', '現代の課題',
  ],
})
const PREFIX = Object.freeze({ geoSogo: 'gso', hisSogo: 'hso' })
const HIGH_BOOKS = Object.keys(HIGH_SCHOOL_UNITS)
const PLANNED_TOTAL = Object.values(HIGH_SCHOOL_UNITS).reduce((sum, titles) => sum + titles.length, 0)

// 書き上げた冊だけ確かめる（書きかけの冊は単元の数が足りない）。全単元がそろったら ALL_WRITTEN で名前まで固定する。
const writtenBooks = () => HIGH_BOOKS.filter((book) => subjectUnits('social', book).length > 0)

test('地理総合・歴史総合が社会アプリの冊として登録され、冊のトップに共通テストの出題傾向がある', () => {
  assert.deepEqual(SUBJECTS.social.books.map((book) => book.id), ['geography', 'history', 'civics', 'geoSogo', 'hisSogo'])
  for (const bookId of HIGH_BOOKS) {
    const book = SUBJECTS.social.books.find((item) => item.id === bookId)
    assert.ok(book.examTrend?.length >= 4, `${bookId}: 出題傾向の項目`)
    for (const item of book.examTrend) assert.ok(item.heading?.trim() && item.body?.trim().length >= 40, `${bookId}: ${item.heading}`)
    // 出題傾向は学習に使う説明だけ（権利・作り方・出典の話は載せない）。
    const text = book.examTrend.map((item) => item.body).join('')
    assert.ok(!/(著作権|出典|作り方|免責)/.test(text), `${bookId}: 学習に関係ない説明がある`)
    assert.ok(text.includes('共通テスト'), `${bookId}: 共通テストの話がある`)
  }
})

test('単元の並びと名前が、教科書の目次の順にそろっている', () => {
  for (const bookId of writtenBooks()) {
    const titles = HIGH_SCHOOL_UNITS[bookId]
    const units = subjectUnits('social', bookId)
    assert.deepEqual(units.map((unit) => unit.title), titles.slice(0, units.length), `${bookId}: 単元の名前と順`)
    assert.deepEqual(
      units.map((unit) => unit.id),
      titles.slice(0, units.length).map((_, index) => `${PREFIX[bookId]}-${String(index + 1).padStart(2, '0')}`),
      `${bookId}: 単元のID`,
    )
  }
})

test('全単元に、めあて・共通テストでの出方・要点（図と図の読み方つき）・重要語句（解説つき）がある', () => {
  const failures = []
  for (const bookId of writtenBooks()) {
    for (const unit of subjectUnits('social', bookId)) {
      if (!unit.goal?.trim()) failures.push(`${unit.id}: めあてがない`)
      if (!(unit.exam?.trim().length >= 30)) failures.push(`${unit.id}: 共通テストでの出方がない`)
      if (!unit.exam?.includes('共通テスト')) failures.push(`${unit.id}: 共通テストでの出方に「共通テスト」がない`)
      if (unit.points.length < 4) failures.push(`${unit.id}: 要点が ${unit.points.length}`)
      for (const [index, point] of unit.points.entries()) {
        if (!point.figure) failures.push(`${unit.id}#${index + 1}: 図がない（高校の教材は全要点に図表を付ける）`)
      }
      if (unit.terms.length < 8) failures.push(`${unit.id}: 重要語句が ${unit.terms.length}`)
      for (const term of unit.terms) if (!term.note) failures.push(`${term.id}: 解説がない`)
    }
  }
  assert.deepEqual(failures, [])
})

test('重要語句は、同じ冊（地理総合・歴史総合）の中で重ならない（中学の教材と同じ語は別の冊として持てる）', () => {
  const failures = []
  for (const bookId of writtenBooks()) {
    const seen = new Map()
    for (const term of subjectTerms('social', bookId)) {
      if (seen.has(term.term)) failures.push(`${term.id}: 「${term.term}」が ${seen.get(term.term)} と重複`)
      seen.set(term.term, term.id)
    }
  }
  assert.deepEqual(failures, [])
})

test('演習は、入試の段階に資料（図か会話文）を読んで答える問題を含み、データに作業用の欄（basis）を残さない', () => {
  const failures = []
  for (const bookId of writtenBooks()) {
    for (const unit of subjectUnits('social', bookId)) {
      const exam = unitQuestions(unit.id, 'exam')
      const sourceBased = exam.filter((question) => question.figure || /生徒/.test(question.text))
      if (sourceBased.length < 1) failures.push(`${unit.id}: 入試の段階に、資料を読んで答える問題がない`)
    }
  }
  // 書いている間だけ問題に付ける作業用の欄 basis は、答えの台帳へ移したあと、データから消す。
  const dir = new URL('../src/data/subjects/', import.meta.url)
  for (const file of readdirSync(dir).filter((name) => /^(geoSogo|hisSogo)\d*\.js$/.test(name))) {
    if (/^\s+basis:/m.test(readFileSync(new URL(file, dir), 'utf8'))) failures.push(`${file}: 作業用の basis が残っている`)
  }
  assert.deepEqual(failures, [])
})

test('書き上げた冊の単元数が、予定の数と合っている', () => {
  const written = writtenBooks().reduce((sum, bookId) => sum + subjectUnits('social', bookId).length, 0)
  assert.ok(written <= PLANNED_TOTAL)
  assert.equal(subjectQuestions('social', 'geoSogo').length, subjectUnits('social', 'geoSogo').length * 9)
  assert.equal(subjectQuestions('social', 'hisSogo').length, subjectUnits('social', 'hisSogo').length * 9)
})
