// 社会・理科の図表で詳しく説明できる項目の質の確認（依頼台帳 requests/2026-09-30-subject-figures-glossary.json の
// points-figure-review・points-figures-guides・latitude-longitude・climate-charts・figure-questions）。
// 2026-09-30 利用者「社会・理科を充実させなさい。図表を用いて詳しく解説できる項目の品質を向上させなさい。
// 緯度経度や冷帯の年間気温降水量のグラフの特徴と判断の仕方等。」
//   要点：全538件を1件ずつ読み、図表で詳しく説明できるものに図と「図の読み方」（何を表すか・どこを見るか・特徴・
//         判断の仕方）を付けた。付けないものは理由（noFigure）を書いた。判断の記録は docs/audits/junior-social-science-figures.json。
//   演習：図を見て考える問題に図を付け、答えたあとの解説に「図の読み取り方」（read）を出す。
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { ALL_SUBJECT_QUESTIONS, ALL_SUBJECT_UNITS, getSubjectUnit } from '../src/data/subjects/index.js'
import { CLIMATE_STATIONS } from '../src/data/subjects/climate.js'
import { JAPAN_MAP, WORLD_MAP } from '../src/data/subjects/maps.js'
import { SUBJECT_DIAGRAM_NAMES, SUBJECT_FIGURE_KINDS } from '../src/data/subjects/figureKinds.js'
import { clockOf, localHour } from '../src/data/subjects/figureMath.js'
import { WORLD_PROJECTION, worldLongitude } from '../src/data/subjects/projection.js'
import { figuresLedgerProblems } from '../scripts/checks/junior-social-science-figures.mjs'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const COUNTRY_CODES = new Set(WORLD_MAP.countries.map((country) => country.code))
const PREFECTURE_CODES = new Set([...JAPAN_MAP.prefectures.map((pref) => pref.code), 'northern'])

/** 図の中の図（set の items）までたどった、すべての図。 */
const flatFigures = (figure) => (figure ? [figure, ...(figure.type === 'set' ? figure.items.flatMap(flatFigures) : [])] : [])
const allPointFigures = () => ALL_SUBJECT_UNITS.flatMap((unit) => unit.points.flatMap((point, index) => flatFigures(point.figure).map((figure) => ({ unit, point, index, figure }))))
const guideText = (point) => (point.figure?.guide ?? []).join('')

/** 図のデータの誤り（種類・図解の名前・地点・国と県の記号・範囲・表の形）。 */
function figureProblems(figure, where) {
  const problems = []
  if (!SUBJECT_FIGURE_KINDS.includes(figure.type)) return [`${where}: 図の種類 ${figure.type} がない`]
  const lonOk = (lon) => Number.isFinite(lon) && lon >= -180 && lon <= 180
  const latOk = (lat) => Number.isFinite(lat) && lat >= -90 && lat <= 90
  if (figure.type === 'climate' && !CLIMATE_STATIONS[figure.station]) problems.push(`${where}: 雨温図の地点 ${figure.station} がない`)
  if (figure.type === 'diagram' && !SUBJECT_DIAGRAM_NAMES.includes(figure.name)) problems.push(`${where}: 図解 ${figure.name} がない`)
  if (figure.type === 'worldMap' || figure.type === 'japanMap') {
    const codes = figure.type === 'worldMap' ? COUNTRY_CODES : PREFECTURE_CODES
    for (const code of [...Object.keys(figure.marks ?? {}), ...Object.keys(figure.fills ?? {})]) {
      if (!codes.has(code)) problems.push(`${where}: 地図に ${code} がない`)
    }
    for (const river of figure.rivers ?? []) {
      if (figure.type !== 'worldMap' || !WORLD_MAP.rivers.some((item) => item.id === river)) problems.push(`${where}: 川 ${river} がない`)
    }
    if (figure.view) {
      const { lon, lat } = figure.view
      if (!lon?.every(lonOk) || !lat?.every(latOk) || lat[0] >= lat[1]) problems.push(`${where}: 切り出す範囲がおかしい`)
      // 世界地図は西経25.5度で切れている。その線をまたぐ範囲は、切れ目の向こう側が描かれない。
      if (figure.type === 'worldMap' && lon?.every(lonOk)) {
        const west = worldLongitude(lon[0])
        let east = worldLongitude(lon[1])
        if (east <= west) east += 360
        if (east > WORLD_PROJECTION.east) problems.push(`${where}: 切り出す範囲が地図の切れ目（西経25.5度）をまたいでいる`)
      }
    }
  }
  // 地図の点と文字は緯度・経度で置く（しくみの図の文字は x・y で置くので、ここでは調べない）。
  const isMap = ['worldMap', 'japanMap', 'azimuthalMap', 'worldOverview'].includes(figure.type)
  for (const point of isMap ? [...(Array.isArray(figure.points) ? figure.points : []), ...(Array.isArray(figure.labels) ? figure.labels : [])] : []) {
    if (!lonOk(point.lon) || !latOk(point.lat)) problems.push(`${where}: 緯度・経度がおかしい（${point.text ?? point.label}）`)
  }
  // 横棒グラフの名前は、名前の欄（labelWidth、既定92）に右寄せで入る。はみ出すと左が切れて読めない。
  // 幅は、文字の大きさ11の目安（全角11・半角6.2）で見積もる。
  if (figure.type === 'bars') {
    const room = (figure.labelWidth ?? 92) - 6
    for (const [label] of figure.items ?? []) {
      const width = [...String(label)].reduce((sum, char) => sum + (char.charCodeAt(0) < 0x7f ? 6.2 : 11), 0)
      if (width > room) problems.push(`${where}: 棒グラフの名前「${label}」が名前の欄に入りきらない`)
    }
  }
  for (const arrow of figure.arrows ?? []) {
    if (!arrow.path?.length || !arrow.path.every(([lon, lat]) => lonOk(lon) && latOk(lat))) problems.push(`${where}: 矢印の道すじがおかしい`)
  }
  if (figure.type === 'table') {
    if (!figure.columns?.length || !figure.rows?.length) problems.push(`${where}: 表が空`)
    for (const row of figure.rows ?? []) if (row.length !== figure.columns.length) problems.push(`${where}: 表の列の数が合わない（${row[0]}）`)
  }
  if (figure.type === 'set' && !(figure.items?.length >= 2)) problems.push(`${where}: 並べる図が2つ未満`)
  // しくみの図：箱は図の中に収まり、たがいに重ならない。矢印の両端の箱がある。
  if (figure.type === 'relation') {
    const width = figure.width ?? 300
    const ids = new Set()
    if (!(figure.height > 0) || !figure.nodes?.length) problems.push(`${where}: しくみの図が空`)
    for (const node of figure.nodes ?? []) {
      if (!node.id || ids.has(node.id)) problems.push(`${where}: しくみの図の箱の id がない・重なる（${node.id}）`)
      ids.add(node.id)
      if (!String(node.text ?? '').trim()) problems.push(`${where}: しくみの図の箱に文字がない（${node.id}）`)
      const inside = [node.x, node.y, node.w, node.h].every(Number.isFinite) && node.x - node.w / 2 >= 0 && node.x + node.w / 2 <= width && node.y - node.h / 2 >= 0 && node.y + node.h / 2 <= figure.height
      if (!inside) problems.push(`${where}: しくみの図の箱が図の外にはみ出す（${node.id}）`)
    }
    const nodes = figure.nodes ?? []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const [a, b] = [nodes[i], nodes[j]]
        if (Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2) problems.push(`${where}: しくみの図の箱が重なる（${a.id}・${b.id}）`)
      }
    }
    for (const edge of figure.edges ?? []) {
      if (!ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to) problems.push(`${where}: しくみの図の矢印の端の箱がない（${edge.from}→${edge.to}）`)
    }
  }
  // 帯グラフ：どの帯にも名前と0以上の値があり、割合（％）の帯は合計が100になる（四捨五入の差は1まで）。
  if (figure.type === 'ratio') {
    if (!figure.rows?.length) problems.push(`${where}: 帯グラフが空`)
    for (const row of figure.rows ?? []) {
      if (!row.label || !row.parts?.length || row.parts.some(([name, value]) => !name || !(value >= 0))) problems.push(`${where}: 帯グラフの帯がおかしい（${row.label}）`)
      const total = (row.parts ?? []).reduce((sum, [, value]) => sum + value, 0)
      if ((figure.unit ?? '％') === '％' && Math.abs(total - 100) > 1.05) problems.push(`${where}: 帯グラフの割合の合計が100にならない（${row.label}：${total}）`)
    }
  }
  // 時代の帯：行ごとに始まりが終わりより前で、帯・目もり・しるしがその行の範囲に入る。
  if (figure.type === 'periods') {
    if (!figure.rows?.length) problems.push(`${where}: 時代の帯が空`)
    for (const row of figure.rows ?? []) {
      const within = (value) => Number.isFinite(value) && value >= row.from && value <= row.to
      if (!(row.from < row.to) || !row.bands?.length) problems.push(`${where}: 時代の帯の範囲がおかしい（${row.label ?? row.from}）`)
      for (const band of row.bands ?? []) if (!(band.from < band.to) || !within(band.from) || !within(band.to) || !band.text) problems.push(`${where}: 時代の帯「${band.text}」の範囲がおかしい`)
      for (const mark of [...(row.ticks ?? []), ...(row.marks ?? [])]) if (!within(mark.at) || !mark.text) problems.push(`${where}: 時代の帯の目もり・しるし「${mark.text}」が範囲の外`)
    }
  }
  if (figure.type === 'decision' && (!(figure.steps?.length >= 2) || !figure.otherwise || figure.steps.some((step) => !step.ask || !step.yes))) problems.push(`${where}: 判断の手順が足りない`)
  if (figure.type === 'chain' && !(figure.items?.length >= 2)) problems.push(`${where}: 流れの項目が2つ未満`)
  if (figure.type === 'timeline' && (!figure.groups?.length || figure.groups.some((group) => !group.events?.length))) problems.push(`${where}: 年表が空`)
  if (figure.type === 'tree') {
    const nodeProblem = (node) => !node?.text?.trim() || (node.children !== undefined && (!Array.isArray(node.children) || !node.children.length || node.children.some(nodeProblem)))
    if (nodeProblem(figure.root) || !figure.root?.children?.length) problems.push(`${where}: しくみの図の枝がおかしい`)
  }
  return problems
}

test('全538の要点と全918問を、図表で説明できるか1件ずつ判断した記録と、今の中身が一致する', () => {
  assert.equal(ALL_SUBJECT_UNITS.reduce((sum, unit) => sum + unit.points.length, 0), 538)
  assert.equal(ALL_SUBJECT_QUESTIONS.length, 918)
  assert.deepEqual(figuresLedgerProblems(), [])
})

test('図表を付けた要点には図の読み方（何を表すか・どこを見るか・特徴・判断の仕方）が、付けない要点には理由がある', () => {
  const problems = []
  for (const unit of ALL_SUBJECT_UNITS) {
    unit.points.forEach((point, index) => {
      const where = `${unit.id}#${index + 1}（${point.heading}）`
      if (point.figure) {
        const guide = point.figure.guide ?? []
        if (guide.length < 2) problems.push(`${where}: 図の読み方が2つ未満`)
        if (guide.some((step) => step.length < 20)) problems.push(`${where}: 短すぎる読み方がある`)
        if (guide.join('').length < 100) problems.push(`${where}: 図の読み方が短い`)
        if (point.noFigure) problems.push(`${where}: 図があるのに、付けない理由も書いてある`)
      } else if (!(point.noFigure?.length >= 12)) {
        problems.push(`${where}: 図表を付けない理由がない`)
      }
    })
  }
  assert.deepEqual(problems, [])
})

test('図のデータ（種類・図解・雨温図の地点・国と県・緯度経度・表の形）に誤りがない', () => {
  const problems = []
  for (const { unit, index, figure } of allPointFigures()) problems.push(...figureProblems(figure, `${unit.id}#${index + 1}`))
  for (const question of ALL_SUBJECT_QUESTIONS) {
    for (const figure of flatFigures(question.figure)) problems.push(...figureProblems(figure, question.id))
  }
  assert.deepEqual(problems, [])
})

test('図の種類・図解の一覧と、図の部品が一致する', () => {
  const figureSource = read('src/components/SubjectFigure.jsx')
  const registry = figureSource.slice(figureSource.indexOf('const FIGURES = Object.freeze({'), figureSource.indexOf('export const SUBJECT_FIGURE_TYPES'))
  assert.deepEqual([...registry.matchAll(/^\s+(\w+): \w+,$/gm)].map((match) => match[1]), [...SUBJECT_FIGURE_KINDS])
  // 図解の一覧は SubjectDiagrams.jsx の SUBJECT_DIAGRAMS。分けたファイルの一覧（...MAP_READING_DIAGRAMS など）は、そのファイルの中を読む。
  const registryNames = (source, name) => {
    const start = source.indexOf(`export const ${name} = Object.freeze({`)
    assert.ok(start >= 0, `${name} が見つからない`)
    const body = source.slice(start, source.indexOf('})', start))
    return [...body.matchAll(/^\s+(?:(\w+): \w+|\.\.\.(\w+)),$/gm)].flatMap((match) => {
      if (match[1]) return [match[1]]
      const file = readdirSync('src/components').find((entry) => /^Subject\w*Diagrams\.jsx$/.test(entry) && read(`src/components/${entry}`).includes(`export const ${match[2]} = Object.freeze({`))
      assert.ok(file, `${match[2]} のファイルが見つからない`)
      return registryNames(read(`src/components/${file}`), match[2])
    })
  }
  assert.deepEqual(registryNames(read('src/components/SubjectDiagrams.jsx'), 'SUBJECT_DIAGRAMS'), [...SUBJECT_DIAGRAM_NAMES])
})

test('図を見て考える演習には図の読み取り方があり、問題文が図を指す演習はすべて図を持つ', () => {
  const problems = []
  for (const question of ALL_SUBJECT_QUESTIONS) {
    if (question.figure) {
      const steps = question.kind === 'number' ? question.steps : question.read
      if (!(steps?.length >= 2)) problems.push(`${question.id}: 図の読み取り方（解き方）が2つ未満`)
      if (question.kind !== 'number' && !(question.read?.length >= 2)) problems.push(`${question.id}: 図の読み取り方がない`)
    }
    if (/(次の|下の|右の|左の)(地図|図|グラフ|表|雨温図|年表|資料)|地図中|図中|グラフ中|表中/.test(question.text) && !question.figure) {
      problems.push(`${question.id}: 問題文が図を指しているのに図がない`)
    }
  }
  assert.deepEqual(problems, [])
})

test('緯度・経度：はかり方の図、緯線・経線をかいた地図、地球の反対側、時差を図と手順で示す', () => {
  const world = getSubjectUnit('geo-01')
  const latLong = world.points.find((point) => point.heading === '緯度と経度')
  const kinds = flatFigures(latLong.figure).map((figure) => (figure.type === 'diagram' ? figure.name : figure.type))
  assert.ok(kinds.includes('latitude') && kinds.includes('longitude'), '緯度・経度のはかり方の図')
  const grid = flatFigures(latLong.figure).find((figure) => figure.type === 'worldMap' && figure.grid)
  assert.ok(grid?.points?.length >= 2, '緯線・経線をかいた地図に地点を置く')
  for (const word of ['北緯', '南緯', '東経', '西経', '反対側']) assert.ok(guideText(latLong).includes(word), `緯度と経度の図の読み方に「${word}」`)
  // 東京の反対側：北緯と南緯を入れかえ、経度は180度から引く。
  const [tokyo, antipode] = grid.points
  assert.ok(Math.abs(tokyo.lat + antipode.lat) < 0.01 && Math.abs(Math.abs(antipode.lon) - (180 - tokyo.lon)) < 0.01, '反対側の地点の計算')

  const japan = getSubjectUnit('geo-02')
  const time = japan.points.find((point) => point.heading === '時差と標準時')
  const zone = flatFigures(time.figure).find((figure) => figure.type === 'diagram' && figure.name === 'timeZone')
  assert.ok(zone, '時差の図')
  for (const word of ['15度', '1時間', '日付変更線']) assert.ok(guideText(time).includes(word), `時差の図の読み方に「${word}」`)
  const zoneQuestions = ALL_SUBJECT_QUESTIONS.filter((question) => flatFigures(question.figure).some((figure) => figure.type === 'diagram' && figure.name === 'timeZone'))
  assert.ok(zoneQuestions.length >= 1, '時差を図で考える演習')
  // 図の都市の時刻と、問題の答えが同じ式で合う（東京10時 → ロンドン1時）。
  const london = clockOf(localHour(10, 135, 0))
  assert.deepEqual(london, { day: 0, text: '1時' })
})

// 世界の気候11区分と日本の6つの気候。どれも判断の目安の線（judge）つきの雨温図と、名前・判断の手がかりを書いた図の読み方を持つ。
const WORLD_CLIMATES = Object.freeze([
  ['熱帯雨林気候', 'singapore', ['18℃']],
  ['サバナ気候', 'bangkok', ['雨季', '乾季']],
  ['砂漠気候', 'riyadh', ['年降水量']],
  ['ステップ気候', 'ulaanbaatar', ['年降水量']],
  ['温暖湿潤気候', 'tokyo', ['−3℃']],
  ['西岸海洋性気候', 'london', ['偏西風']],
  ['地中海性気候', 'lisbon', ['夏']],
  ['冷帯', 'moscow', ['−3℃', '10℃']],
  ['ツンドラ気候', 'barrow', ['10℃']],
  ['氷雪気候', 'mirny', ['0℃']],
  ['高山気候', 'lapaz', ['標高']],
])
const JAPAN_CLIMATES = Object.freeze([
  ['北海道の気候', 'sapporo'],
  ['日本海側の気候', 'joetsu'],
  ['太平洋側の気候', 'tokyo'],
  ['中央高地の気候', 'matsumoto'],
  ['瀬戸内の気候', 'takamatsu'],
  ['南西諸島の気候', 'naha'],
])

test('雨温図：世界の気候11区分と日本の6つの気候に、判断の目安つきの雨温図と、特徴・判断の仕方がある', () => {
  const judged = allPointFigures().filter(({ figure }) => figure.type === 'climate' && figure.judge)
  const problems = []
  for (const [name, station, words] of [...WORLD_CLIMATES, ...JAPAN_CLIMATES.map(([name, station]) => [name, station, []])]) {
    const found = judged.filter(({ figure }) => figure.station === station).find(({ point }) => guideText(point).includes(name))
    if (!found) {
      problems.push(`${name}（${station}）: 判断の目安つきの雨温図と、名前を書いた図の読み方がない`)
      continue
    }
    for (const word of words) if (!guideText(found.point).includes(word)) problems.push(`${name}: 図の読み方に「${word}」がない`)
  }
  // 気候帯を見分ける手順の図（はい・いいえで進む）。
  const decisions = allPointFigures().filter(({ figure }) => figure.type === 'decision' && figure.steps.some((step) => step.ask.includes('18℃')))
  if (!decisions.length) problems.push('気候帯を見分ける手順の図がない')
  else {
    const text = decisions[0].figure.steps.map((step) => `${step.ask}${step.yes}`).join('') + decisions[0].figure.otherwise
    for (const word of ['10℃', '18℃', '−3℃', '年降水量', '寒帯', '乾燥帯', '熱帯', '温帯', '冷帯']) if (!text.includes(word)) problems.push(`気候帯を見分ける手順に「${word}」がない`)
  }
  // 雨温図を使う演習は、どれも図の読み取り方を持つ。
  for (const question of ALL_SUBJECT_QUESTIONS.filter((item) => flatFigures(item.figure).some((figure) => figure.type === 'climate'))) {
    if (!(question.read?.length >= 2)) problems.push(`${question.id}: 雨温図の読み取り方がない`)
  }
  assert.deepEqual(problems, [])
})
