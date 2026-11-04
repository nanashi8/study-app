// 高校の社会「地理総合」「歴史総合」（依頼台帳 requests/2026-10-22-high-school-social.json）と、
// 「地理探究」「日本史探究」・地理総合と歴史総合の充実（requests/2026-11-04-high-school-social-tankyu.json）の確認。
// 単元は出版社の教科書の目次（二宮書店『地理総合』『歴史総合 近代から現代へ』『地理探究』の章・節、
// 山川出版社『詳説日本史』の部・章・節と現代日本の課題の探究、学習指導要領の大項目）の順にそろえ、
// 本文・図・問題はこのアプリで書く。全単元に、めあて・要点（図と図の読み方つき）・重要語句（解説つき）・
// 共通テストでの出方（exam）・基礎／標準／入試の演習がそろい、入試の段階は資料を読んで答える問題を2問以上含む。
// 数や台帳の食いちがいは tests/junior-social-science*.test.mjs（社会・理科の全教材共通）が確かめる。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'

import {
  HIGH_SCHOOL_BOOK_IDS,
  HIGH_SCHOOL_QUESTIONS_PER_LEVEL,
  PRACTICE_LEVEL_IDS,
  SUBJECTS,
  subjectQuestions,
  subjectTerms,
  subjectUnits,
  unitQuestions,
} from '../src/data/subjects/index.js'

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
  geoTankyu: [
    '地形', '気候と生態系', '世界各地の自然と生活', '日本の自然環境と防災',
    '地球環境問題', '農林水産業', '資源・エネルギー', '工業',
    '第3次産業', '交通・通信', '貿易・観光', '人口',
    '村落・都市', '生活文化と言語・宗教', '国家とその領域', '現代世界の地域区分',
    '中国', '朝鮮半島', '東南アジア', '南アジア',
    '西アジア・中央アジア', '北アフリカ・サブサハラアフリカ', 'ヨーロッパ', 'ロシア',
    'アングロアメリカ', 'ラテンアメリカ', 'オーストラリア', 'ニュージーランドと島嶼国',
    '現代日本に求められる国土像',
  ],
  jhsTankyu: [
    '文化の始まり', '農耕社会の成立', '古墳文化の展開', '飛鳥の朝廷',
    '律令国家への道', '平城京の時代', '律令国家の文化', '律令国家の変容',
    '摂関政治', '国風文化', '地方政治の展開と武士', '院政の始まり',
    '院政と平氏政権', '鎌倉幕府の成立', '武士の社会', 'モンゴル襲来と幕府の衰退',
    '鎌倉文化', '室町幕府の成立', '幕府の衰退と庶民の台頭', '室町文化',
    '戦国大名の登場', '織豊政権', '桃山文化', '幕藩体制の成立',
    '幕藩社会の構造', '幕政の安定', '経済の発展', '元禄文化',
    '幕政の改革', '宝暦・天明期の文化', '幕府の衰退と近代への道', '化政文化',
    '開国と幕末の動乱', '幕府の滅亡と新政府の発足', '明治維新と富国強兵', '立憲国家の成立',
    '日清・日露戦争と国際関係', '第一次世界大戦と日本', 'ワシントン体制', '近代産業の発展',
    '近代文化の発達', '市民生活の変容と大衆文化', '恐慌の時代', '軍部の台頭',
    '第二次世界大戦', '占領と改革', '冷戦の開始と講和', '55年体制',
    '経済復興から高度経済成長へ', '経済大国への道', '冷戦の終結と日本社会の変容', '現代日本の課題の探究',
  ],
})
const PREFIX = Object.freeze({ geoSogo: 'gso', hisSogo: 'hso', geoTankyu: 'gtk', jhsTankyu: 'jtk' })
const HIGH_BOOKS = Object.keys(HIGH_SCHOOL_UNITS)

// 要点・語句の最低の数。地理総合・歴史総合は充実させた6要点・14語句、探究の2冊は5要点・12語句。
// 地理探究は、教科書の節の項の数が5より多い単元（地形・農林水産業・工業・生活文化と言語・宗教）を、項の数まで要点にする。
const MIN_POINTS = Object.freeze({ geoSogo: 6, hisSogo: 6, geoTankyu: 5, jhsTankyu: 5 })
const MIN_POINTS_BY_UNIT = Object.freeze({ 'gtk-01': 7, 'gtk-06': 6, 'gtk-08': 6, 'gtk-14': 6 })
const MIN_TERMS = Object.freeze({ geoSogo: 14, hisSogo: 14, geoTankyu: 12, jhsTankyu: 12 })

test('高校の4冊が社会アプリの冊として登録され、冊のトップに共通テストの出題傾向がある', () => {
  assert.deepEqual(SUBJECTS.social.books.map((book) => book.id), ['geography', 'history', 'civics', ...HIGH_BOOKS])
  assert.deepEqual([...HIGH_SCHOOL_BOOK_IDS], HIGH_BOOKS)
  for (const bookId of HIGH_BOOKS) {
    const book = SUBJECTS.social.books.find((item) => item.id === bookId)
    assert.ok(book.examTrend?.length >= 4, `${bookId}: 出題傾向の項目`)
    for (const item of book.examTrend) assert.ok(item.heading?.trim() && item.body?.trim().length >= 40, `${bookId}: ${item.heading}`)
    // 出題傾向は学習に使う説明だけ（権利・作り方・出典の話は載せない）。
    const text = book.examTrend.map((item) => item.body).join('')
    assert.ok(!/(著作権|出典|作り方|免責)/.test(text), `${bookId}: 学習に関係ない説明がある`)
    assert.ok(text.includes('共通テスト'), `${bookId}: 共通テストの話がある`)
  }
  assert.deepEqual(SUBJECTS.social.books.find((item) => item.id === 'geoTankyu').examTrend.map((item) => item.heading), ['試験の形', '問われ方', '出題の柱', 'この冊の学び方'])
  assert.deepEqual(SUBJECTS.social.books.find((item) => item.id === 'jhsTankyu').examTrend.map((item) => item.heading), ['試験の形', '問われ方', '出題の柱', 'この冊の学び方'])
})

test('単元の並びと名前が、教科書の目次の順にそろっている', () => {
  for (const bookId of HIGH_BOOKS) {
    const titles = HIGH_SCHOOL_UNITS[bookId]
    const units = subjectUnits('social', bookId)
    assert.deepEqual(units.map((unit) => unit.title), titles, `${bookId}: 単元の名前と順`)
    assert.deepEqual(
      units.map((unit) => unit.id),
      titles.map((_, index) => `${PREFIX[bookId]}-${String(index + 1).padStart(2, '0')}`),
      `${bookId}: 単元のID`,
    )
  }
  assert.deepEqual(HIGH_BOOKS.map((bookId) => subjectUnits('social', bookId).length), [20, 38, 29, 52])
})

test('全単元に、めあて・共通テストでの出方・要点（図と図の読み方つき）・重要語句（解説つき）がある', () => {
  const failures = []
  for (const bookId of HIGH_BOOKS) {
    for (const unit of subjectUnits('social', bookId)) {
      if (!unit.goal?.trim()) failures.push(`${unit.id}: めあてがない`)
      if (!(unit.exam?.trim().length >= 30)) failures.push(`${unit.id}: 共通テストでの出方がない`)
      if (!unit.exam?.includes('共通テスト')) failures.push(`${unit.id}: 共通テストでの出方に「共通テスト」がない`)
      const needPoints = MIN_POINTS_BY_UNIT[unit.id] ?? MIN_POINTS[bookId]
      if (unit.points.length < needPoints) failures.push(`${unit.id}: 要点が ${unit.points.length}（${needPoints}以上）`)
      for (const [index, point] of unit.points.entries()) {
        if (!point.figure) failures.push(`${unit.id}#${index + 1}: 図がない（高校の教材は全要点に図表を付ける）`)
        const guide = point.figure?.guide ?? []
        if (guide.length < 2 || guide.join('').length < 100) failures.push(`${unit.id}#${index + 1}: 図の読み方が足りない`)
      }
      if (unit.terms.length < MIN_TERMS[bookId]) failures.push(`${unit.id}: 重要語句が ${unit.terms.length}（${MIN_TERMS[bookId]}以上）`)
      for (const term of unit.terms) if (!term.note) failures.push(`${term.id}: 解説がない`)
    }
  }
  assert.deepEqual(failures, [])
})

test('重要語句は、同じ冊の中で重ならない（中学の教材やほかの高校の冊と同じ語は、別の冊として持てる）', () => {
  const failures = []
  for (const bookId of HIGH_BOOKS) {
    const seen = new Map()
    for (const term of subjectTerms('social', bookId)) {
      if (seen.has(term.term)) failures.push(`${term.id}: 「${term.term}」が ${seen.get(term.term)} と重複`)
      seen.set(term.term, term.id)
    }
  }
  assert.deepEqual(failures, [])
})

test('演習は、入試の段階に資料（図・会話文・史料）を読んで答える問題を2問以上含み、データに作業用の欄（basis）を残さない', () => {
  const failures = []
  for (const bookId of HIGH_BOOKS) {
    for (const unit of subjectUnits('social', bookId)) {
      const exam = unitQuestions(unit.id, 'exam')
      const sourceBased = exam.filter((question) => question.figure || /生徒|史料/.test(question.text))
      if (sourceBased.length < 2) failures.push(`${unit.id}: 入試の段階の資料を読んで答える問題が ${sourceBased.length}`)
      for (const question of unit.questions.filter((item) => item.figure && item.kind !== 'number')) {
        if (!(question.read?.length >= 2)) failures.push(`${question.id}: 図の読み取り方がない`)
      }
    }
  }
  // 書いている間だけ問題に付ける作業用の欄 basis は、答えの台帳へ移したあと、データから消す。
  const dir = new URL('../src/data/subjects/', import.meta.url)
  for (const file of readdirSync(dir).filter((name) => /^(geoSogo|hisSogo|geoTankyu|jhsTankyu)\d*\.js$/.test(name))) {
    if (/^\s+basis:/m.test(readFileSync(new URL(file, dir), 'utf8'))) failures.push(`${file}: 作業用の basis が残っている`)
  }
  assert.deepEqual(failures, [])
})

test('高校の4冊は、全単元に基礎4・標準4・入試4の12問がある', () => {
  for (const bookId of HIGH_BOOKS) {
    for (const unit of subjectUnits('social', bookId)) {
      for (const level of PRACTICE_LEVEL_IDS) {
        assert.equal(unitQuestions(unit.id, level).length, HIGH_SCHOOL_QUESTIONS_PER_LEVEL[level], `${unit.id}: ${level}`)
      }
    }
    assert.equal(subjectQuestions('social', bookId).length, subjectUnits('social', bookId).length * 12, `${bookId}: 問題の数`)
  }
  assert.deepEqual(HIGH_BOOKS.map((bookId) => subjectQuestions('social', bookId).length), [240, 456, 348, 624])
})
