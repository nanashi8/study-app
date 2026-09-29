// 社会の図に使う日本地図・世界地図を、SVG の path にして src/data/subjects/maps.js へ書き出す。
//
//   node scripts/materials/sources.mjs fetch natural-earth-japan --out <フォルダ>   … japan.json（県・北方領土・竹島・尖閣諸島・琵琶湖）
//   node scripts/subjects/build-maps.mjs <フォルダ>                                 … 世界の国（ne_50m_admin_0_countries）が無ければ取ってくる
//
// どちらも Natural Earth（パブリックドメイン）。日本は県ごと、世界は国ごとの形。
// 日本地図は、九州〜北海道の本図と、南西諸島（沖縄県・奄美）の囲みの2つの投影を持つ。
// 世界地図は太平洋を中央にした図（ミラー図法）。国の形ごとに、重心が西経25度より西なら右側（アメリカ側）へ回す。
import fs from 'node:fs'
import path from 'node:path'

const folder = process.argv[2]
if (!folder) {
  console.error('使い方：node scripts/subjects/build-maps.mjs <japan.json のあるフォルダ>')
  process.exit(1)
}
const OUT = path.resolve(import.meta.dirname, '../../src/data/subjects/maps.js')
const WORLD_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson'

// ── 共通：間引き・面積・相対座標の path ─────────────────────────────────

function simplify(points, tol) {
  if (points.length <= 2) return points
  const keep = new Uint8Array(points.length)
  keep[0] = 1
  keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [ax, ay] = points[a]
    const [bx, by] = points[b]
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy)
    let worst = -1
    let index = -1
    for (let i = a + 1; i < b; i += 1) {
      const [px, py] = points[i]
      const d = len < 1e-9 ? Math.hypot(px - ax, py - ay) : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len
      if (d > worst) {
        worst = d
        index = i
      }
    }
    if (worst > tol) {
      keep[index] = 1
      stack.push([a, index], [index, b])
    }
  }
  return points.filter((_, i) => keep[i])
}

// 閉じた輪は、始点からいちばん遠い点で2つに分けてから間引く（輪がつぶれないように）。
function simplifyRing(ring, tol) {
  const [x0, y0] = ring[0]
  let far = 1
  for (let i = 1; i < ring.length; i += 1) {
    if (Math.hypot(ring[i][0] - x0, ring[i][1] - y0) > Math.hypot(ring[far][0] - x0, ring[far][1] - y0)) far = i
  }
  return [...simplify(ring.slice(0, far + 1), tol), ...simplify(ring.slice(far), tol).slice(1)]
}

const area = (ring) => Math.abs(ring.reduce((sum, [x, y], i) => {
  const [nx, ny] = ring[(i + 1) % ring.length]
  return sum + x * ny - nx * y
}, 0)) / 2

const centroid = (points) => points.reduce(([sx, sy], [x, y]) => [sx + x / points.length, sy + y / points.length], [0, 0])

const fmt = (value) => String(Math.round(value * 10) / 10).replace(/^0\./, '.').replace(/^-0\./, '-.')

// 相対座標で短く書く（0.1 に丸めた点どうしの差なので、ずれがたまらない）。
function pathOf(ring) {
  const rounded = ring.map(([x, y]) => [Math.round(x * 10), Math.round(y * 10)])
  const parts = []
  for (let i = 1; i < rounded.length; i += 1) {
    const dx = rounded[i][0] - rounded[i - 1][0]
    const dy = rounded[i][1] - rounded[i - 1][1]
    if (!dx && !dy) continue
    const sy = fmt(dy / 10)
    parts.push(`${fmt(dx / 10)}${sy.startsWith('-') ? '' : ','}${sy}`)
  }
  if (parts.length < 2) return ''
  return `M${fmt(rounded[0][0] / 10)},${fmt(rounded[0][1] / 10)}l${parts.join(' ')}z`
}

const round1 = (value) => Math.round(value * 10) / 10

// ── 日本地図 ─────────────────────────────────────────────────────────

const K = Math.cos((38 * Math.PI) / 180)
const MAIN = { lon0: 128.5, lat1: 45.65, lat0: 30.0, scale: 38, ox: 22, oy: 8 }
// 南西諸島の囲み（左上の日本海の上に置く）。縮尺は本図より小さい。
const INSET = { lon0: 122.8, lon1: 131.5, lat0: 24.0, lat1: 29.6, scale: 30, ox: 14, oy: 14 }
const JAPAN_TOL = 0.9
const JAPAN_MIN_AREA = 5

const projectMain = ([lon, lat]) => [MAIN.ox + (lon - MAIN.lon0) * K * MAIN.scale, MAIN.oy + (MAIN.lat1 - lat) * MAIN.scale]
const projectInset = ([lon, lat]) => [INSET.ox + (lon - INSET.lon0) * K * INSET.scale, INSET.oy + (INSET.lat1 - lat) * INSET.scale]
const insetBox = {
  x: INSET.ox - 6,
  y: INSET.oy - 6,
  w: round1((INSET.lon1 - INSET.lon0) * K * INSET.scale + 12),
  h: round1((INSET.lat1 - INSET.lat0) * INSET.scale + 12),
}

function japanRings(rings) {
  const out = []
  for (const ring of rings) {
    const [lon, lat] = centroid(ring)
    let projected
    if (lat >= MAIN.lat0) projected = ring.map(projectMain)
    else if (lon >= INSET.lon0 && lon <= INSET.lon1 && lat >= INSET.lat0) projected = ring.map(projectInset)
    else continue // 小笠原など、どちらの図にも入らない島
    const simple = simplifyRing(projected, JAPAN_TOL)
    if (simple.length < 4 || area(simple) < JAPAN_MIN_AREA) continue
    out.push(simple)
  }
  return out
}

// 7地方区分（九州地方に沖縄県を含む）。
const REGION_OF = (code) => {
  const n = Number(code.slice(3))
  if (n === 1) return 'hokkaido'
  if (n <= 7) return 'tohoku'
  if (n <= 14) return 'kanto'
  if (n <= 23) return 'chubu'
  if (n <= 30) return 'kinki'
  if (n <= 39) return 'chugokuShikoku'
  return 'kyushu'
}

const japan = JSON.parse(fs.readFileSync(path.join(folder, 'japan.json'), 'utf8'))
const prefectures = japan.prefectures.map((pref) => {
  const rings = japanRings(pref.rings)
  const largest = rings.reduce((best, ring) => (area(ring) > area(best) ? ring : best), rings[0])
  const [cx, cy] = centroid(largest)
  return {
    code: pref.code,
    name: pref.name,
    region: REGION_OF(pref.code),
    d: rings.map(pathOf).filter(Boolean).join(''),
    x: round1(cx),
    y: round1(cy),
  }
})
const territoryPath = (rings) => japanRings(rings).map(pathOf).filter(Boolean).join('')
// 小さな島は間引くと消えるので、県と別に、消えない大きさで描く。
function islandMark(rings) {
  const [lon, lat] = centroid(rings.flat())
  const [x, y] = lat >= MAIN.lat0 ? projectMain([lon, lat]) : projectInset([lon, lat])
  return { x: round1(x), y: round1(y) }
}
const territories = {
  northern: territoryPath(japan.territories.northern),
  takeshima: islandMark(japan.territories.takeshima),
  senkaku: islandMark(japan.territories.senkaku),
}
const lakes = japan.lakes.map((lake) => ({ name: lake.name, d: japanRings(lake.rings).map(pathOf).join('') }))
const japanWidth = Math.ceil((149.1 - MAIN.lon0) * K * MAIN.scale + MAIN.ox + 6)
const japanHeight = Math.ceil((MAIN.lat1 - MAIN.lat0) * MAIN.scale + MAIN.oy + 6)

// ── 世界地図 ─────────────────────────────────────────────────────────

const worldFile = path.join(folder, 'ne_50m_admin_0_countries.geojson')
if (!fs.existsSync(worldFile)) {
  const response = await fetch(WORLD_URL, { signal: AbortSignal.timeout(120_000) })
  if (!response.ok) throw new Error(`世界の国のデータを取れない：${response.status}`)
  fs.writeFileSync(worldFile, Buffer.from(await response.arrayBuffer()))
}
const world = JSON.parse(fs.readFileSync(worldFile, 'utf8'))

const CUT_LON = -25 // これより西に重心がある形は、右側（東経335度の側）へ回す
const WEST = -25.5
const EAST = 349.5
const WORLD_WIDTH = 720
const LAT_TOP = 84
const LAT_BOTTOM = -57
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + (0.4 * lat * Math.PI) / 180))
const X_SCALE = WORLD_WIDTH / (EAST - WEST)
const Y_SCALE = X_SCALE * (180 / Math.PI)
const worldHeight = Math.ceil((miller(LAT_TOP) - miller(LAT_BOTTOM)) * Y_SCALE)
const projectWorld = ([lon, lat]) => [
  (lon - WEST) * X_SCALE,
  (miller(LAT_TOP) - miller(Math.max(LAT_BOTTOM, Math.min(LAT_TOP, lat)))) * Y_SCALE,
]
const WORLD_TOL = 0.55
const WORLD_MIN_AREA = 1.2

// 日本の学校の地図の州（ロシアはヨーロッパ州、トルコはアジア州）。
const STATE_OF = Object.freeze({
  Asia: 'asia',
  Europe: 'europe',
  Africa: 'africa',
  'North America': 'northAmerica',
  'South America': 'southAmerica',
  Oceania: 'oceania',
})
// 学校の地図の呼び方と、1つの国として描く地域。
const NAME_OVERRIDES = Object.freeze({ TWN: '台湾', USA: 'アメリカ合衆国', GBR: 'イギリス', KOR: '大韓民国', PRK: '北朝鮮', CHN: '中国' })
const MERGE_INTO = Object.freeze({ SOL: 'SOM', CYN: 'CYP' })
const isNorthernTerritories = ([lon, lat]) => lon > 145.3 && lon < 149.5 && lat > 43.2 && lat < 45.7

const countries = new Map()
for (const feature of world.features) {
  const props = feature.properties
  const state = STATE_OF[props.CONTINENT]
  if (!state) continue // 南極・海の島々（セーシェルなど）は描かない
  const code = MERGE_INTO[props.ADM0_A3] ?? props.ADM0_A3
  const polys = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates
  let rings = polys.map((poly) => poly[0])
  // 北方領土は日本の領土として、日本の形の側に描く。
  if (code === 'RUS') rings = rings.filter((ring) => !isNorthernTerritories(centroid(ring)))
  if (code === 'JPN') rings = [...rings, ...japan.territories.northern]
  const entry = countries.get(code) ?? {
    code,
    name: NAME_OVERRIDES[code] ?? props.NAME_JA,
    state,
    rings: [],
    label: [props.LABEL_X, props.LABEL_Y],
  }
  entry.rings.push(...rings)
  countries.set(code, entry)
}

const worldCountries = [...countries.values()].map((country) => {
  const drawn = []
  for (const ring of country.rings) {
    const [lon] = centroid(ring)
    const shifted = lon < CUT_LON ? ring.map(([x, y]) => [x + 360, y]) : ring
    const projected = shifted.map(projectWorld)
    const simple = simplifyRing(projected, WORLD_TOL)
    if (simple.length < 4 || area(simple) < WORLD_MIN_AREA) continue
    drawn.push(simple)
  }
  const [labelLon, labelLat] = country.label
  const [lx, ly] = projectWorld([labelLon < CUT_LON ? labelLon + 360 : labelLon, labelLat])
  return {
    code: country.code,
    name: country.name,
    state: country.state,
    d: drawn.map(pathOf).filter(Boolean).join(''),
    x: round1(lx),
    y: round1(ly),
  }
}).sort((a, b) => a.code.localeCompare(b.code))

// 緯線（赤道・北回帰線・南回帰線）と経線（本初子午線・日付変更線のもと＝180度）の位置。
const worldLines = {
  equator: round1(projectWorld([0, 0])[1]),
  tropicN: round1(projectWorld([0, 23.44])[1]),
  tropicS: round1(projectWorld([0, -23.44])[1]),
  primeMeridian: round1(projectWorld([0, 0])[0]),
  meridian180: round1(projectWorld([180, 0])[0]),
  meridian135: round1(projectWorld([135, 0])[0]),
}

const header = `// このファイルは scripts/subjects/build-maps.mjs が作る（手で直さない）。
// 元データ：Natural Earth（県の形・日本の見方の国境・湖・世界の国の形。パブリックドメイン）。
// 日本地図：九州〜北海道の本図と、南西諸島の囲み（inset）。県は7地方区分（region）つき。
// 世界地図：太平洋を中央にしたミラー図法。国は日本の学校の州（state）つき。x・y は国名・県名を置く点。
`
const body = `${header}
export const JAPAN_MAP = ${JSON.stringify({
  width: japanWidth,
  height: japanHeight,
  inset: insetBox,
  prefectures,
  territories,
  lakes,
})}

export const WORLD_MAP = ${JSON.stringify({
  width: WORLD_WIDTH,
  height: worldHeight,
  lines: worldLines,
  countries: worldCountries,
})}
`
fs.writeFileSync(OUT, body)
console.log(`日本：${prefectures.length}都道府県・図 ${japanWidth}×${japanHeight}`)
console.log(`世界：${worldCountries.length}か国・地域・図 ${WORLD_WIDTH}×${worldHeight}`)
console.log(`→ ${path.relative(process.cwd(), OUT)}（${fs.statSync(OUT).size.toLocaleString()} バイト）`)
