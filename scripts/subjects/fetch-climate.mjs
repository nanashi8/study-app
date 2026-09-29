// 雨温図に使う月の平均気温・月降水量（平年値）を気象庁のページから取り、src/data/subjects/climate.js へ書き出す。
//   node scripts/subjects/fetch-climate.mjs
// 日本の地点：過去の気象データ検索（平年値）。世界の地点：世界の天候データツール（地点別平年値）。
// 数値は公共データ利用規約の数値データとして自由に使える。取った値は出典のページ（メニューの最後）に載せる資料に含まれる。
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve(import.meta.dirname, '../../src/data/subjects/climate.js')

// id は図の指定（figure.station）で使う名前。label は図に出す地点名。
const JAPAN_STATIONS = [
  { id: 'sapporo', label: '札幌', prec: 14, block: 47412 },
  { id: 'joetsu', label: '上越（高田）', prec: 54, block: 47612 },
  { id: 'tokyo', label: '東京', prec: 44, block: 47662 },
  { id: 'matsumoto', label: '松本', prec: 48, block: 47618 },
  { id: 'takamatsu', label: '高松', prec: 72, block: 47891 },
  { id: 'naha', label: '那覇', prec: 91, block: 47936 },
]
const WORLD_STATIONS = [
  { id: 'singapore', label: 'シンガポール', station: 48698 },
  { id: 'manaus', label: 'マナオス', station: 82331 },
  { id: 'bangkok', label: 'バンコク', station: 48455 },
  { id: 'darwin', label: 'ダーウィン', station: 94120 },
  { id: 'riyadh', label: 'リヤド', station: 40438 },
  { id: 'lisbon', label: 'リスボン', station: 8535 },
  { id: 'london', label: 'ロンドン', station: 3772 },
  { id: 'paris', label: 'パリ', station: 7149 },
  { id: 'newyork', label: 'ニューヨーク', station: 72503 },
  { id: 'buenosaires', label: 'ブエノスアイレス', station: 87585 },
  { id: 'sydney', label: 'シドニー', station: 94767 },
  { id: 'moscow', label: 'モスクワ', station: 27612 },
  { id: 'yakutsk', label: 'ヤクーツク', station: 24959 },
  { id: 'barrow', label: 'バロー', station: 70026 },
  { id: 'lhasa', label: 'ラサ', station: 55591 },
  { id: 'lapaz', label: 'ラパス', station: 85201 },
]

const text = (cell) => cell.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) })
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return response.text()
}

async function japanNormals({ prec, block }) {
  const html = await get(`https://www.data.jma.go.jp/stats/etrn/view/nml_sfc_ym.php?prec_no=${prec}&block_no=${block}&year=&month=&day=&view=`)
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
    .map(([, row]) => [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(([, cell]) => text(cell)))
    .filter((cells) => /^\d+月$/.test(cells[0] ?? ''))
  if (rows.length !== 12) throw new Error(`${block}: 12か月が読めない`)
  return { temp: rows.map((cells) => Number(cells[4])), rain: rows.map((cells) => Number(cells[3])) }
}

async function worldNormals({ station }) {
  const html = await get(`https://www.data.jma.go.jp/cpd/monitor/climatview/graph_mkhtml_nrm.php?n=${station}&m=1`)
  const flat = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ')
  const temp = []
  const rain = []
  for (let month = 1; month <= 12; month += 1) {
    const match = flat.match(new RegExp(` ${month}月 (-?[\\d.]+) (-?[\\d.]+) `))
    if (!match) throw new Error(`${station}: ${month}月が読めない`)
    temp.push(Number(match[1]))
    rain.push(Number(match[2]))
  }
  return { temp, rain }
}

const stations = {}
for (const station of JAPAN_STATIONS) {
  stations[station.id] = { label: station.label, country: '日本', ...(await japanNormals(station)) }
}
for (const station of WORLD_STATIONS) {
  stations[station.id] = { label: station.label, ...(await worldNormals(station)) }
}
for (const [id, station] of Object.entries(stations)) {
  if (!station.temp.every(Number.isFinite) || !station.rain.every(Number.isFinite)) throw new Error(`${id}: 数でない値がある`)
}

const body = `// このファイルは scripts/subjects/fetch-climate.mjs が作る（手で直さない）。
// 月の平均気温（℃）と月降水量（mm）の平年値（1991〜2020年）。気象庁の平年値（日本の地点）と世界の地点別平年値から。
// 雨温図の図は { type: 'climate', station: 'tokyo' } のように地点の id で指定する。
export const CLIMATE_STATIONS = ${JSON.stringify(stations, null, 2)}
`
fs.writeFileSync(OUT, body)
console.log(`${Object.keys(stations).length}地点 → ${path.relative(process.cwd(), OUT)}`)
for (const [id, station] of Object.entries(stations)) {
  const total = Math.round(station.rain.reduce((sum, value) => sum + value, 0))
  const mean = Math.round((station.temp.reduce((sum, value) => sum + value, 0) / 12) * 10) / 10
  console.log(`${id} ${station.label}: 年平均 ${mean}℃・年降水量 ${total}mm`)
}
