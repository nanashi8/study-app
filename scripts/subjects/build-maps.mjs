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
import {
  AZIMUTHAL_PROJECTION,
  JAPAN_PROJECTION,
  WORLD_HEIGHT,
  WORLD_PROJECTION,
  projectAzimuthal,
  projectJapanInset,
  projectJapanMain,
  projectWorldShifted,
} from '../../src/data/subjects/projection.js'

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
// 閉じた輪は pathOf、閉じない線（川）は linePathOf。map に直接渡すので、引数は1つにしておく。
const pathOf = (ring) => pathText(ring, false)
const linePathOf = (line) => pathText(line, true)

function pathText(ring, open) {
  const rounded = ring.map(([x, y]) => [Math.round(x * 10), Math.round(y * 10)])
  const parts = []
  for (let i = 1; i < rounded.length; i += 1) {
    const dx = rounded[i][0] - rounded[i - 1][0]
    const dy = rounded[i][1] - rounded[i - 1][1]
    if (!dx && !dy) continue
    const sy = fmt(dy / 10)
    parts.push(`${fmt(dx / 10)}${sy.startsWith('-') ? '' : ','}${sy}`)
  }
  if (parts.length < (open ? 1 : 2)) return ''
  return `M${fmt(rounded[0][0] / 10)},${fmt(rounded[0][1] / 10)}l${parts.join(' ')}${open ? '' : 'z'}`
}

const round1 = (value) => Math.round(value * 10) / 10

// ── 日本地図 ─────────────────────────────────────────────────────────

// 投影は src/data/subjects/projection.js（図の部品と共有）。南西諸島の囲みは左上の日本海の上に置き、縮尺は本図より小さい。
const K = JAPAN_PROJECTION.k
const MAIN = JAPAN_PROJECTION.main
const INSET = JAPAN_PROJECTION.inset
const JAPAN_TOL = 0.9
const JAPAN_MIN_AREA = 5

const projectMain = ([lon, lat]) => projectJapanMain(lon, lat)
const projectInset = ([lon, lat]) => projectJapanInset(lon, lat)
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

// 投影は src/data/subjects/projection.js。重心が西経25度より西にある形は、右側（東経335度の側）へ回す。
const CUT_LON = WORLD_PROJECTION.cutLon
const WORLD_WIDTH = WORLD_PROJECTION.width
const worldHeight = WORLD_HEIGHT
const projectWorld = ([lon, lat]) => projectWorldShifted(lon, lat)
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
const NAME_OVERRIDES = Object.freeze({ TWN: '台湾', USA: 'アメリカ合衆国', GBR: 'イギリス', KOR: '大韓民国', PRK: '北朝鮮', CHN: '中国', CYP: 'キプロス' })
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

// 世界の大河（Natural Earth の川の中心線）。figure.rivers に id を並べると地図に描く。
// names は Natural Earth の名前（上流・支流の区間も同じ川として描く）。
const RIVERS_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson'
const RIVERS = Object.freeze([
  { id: 'yangtze', label: '長江', names: ['Yangtze', 'Tongtian'] },
  { id: 'huanghe', label: '黄河', names: ['Huang', 'Yellow'] },
  { id: 'mekong', label: 'メコン川', names: ['Mekong'] },
  { id: 'ganges', label: 'ガンジス川', names: ['Ganges'] },
  { id: 'indus', label: 'インダス川', names: ['Indus'] },
  { id: 'tigris', label: 'ティグリス川', names: ['Tigris'] },
  { id: 'euphrates', label: 'ユーフラテス川', names: ['Euphrates'] },
  { id: 'ob', label: 'オビ川', names: ['Ob'] },
  { id: 'lena', label: 'レナ川', names: ['Lena'] },
  { id: 'rhine', label: 'ライン川', names: ['Rhine', 'Rhein'] },
  { id: 'danube', label: 'ドナウ川', names: ['Danube'] },
  { id: 'volga', label: 'ボルガ川', names: ['Volga'] },
  { id: 'nile', label: 'ナイル川', names: ['Nile', 'White Nile', 'Blue Nile', 'Victoria Nile', 'Albert Nile', 'Mountain Nile'] },
  { id: 'congo', label: 'コンゴ川', names: ['Congo'] },
  { id: 'niger', label: 'ニジェール川', names: ['Niger'] },
  { id: 'zambezi', label: 'ザンベジ川', names: ['Zambezi'] },
  { id: 'mississippi', label: 'ミシシッピ川', names: ['Mississippi', 'Missouri', 'Ohio'] },
  { id: 'colorado', label: 'コロラド川', names: ['Colorado'] },
  { id: 'amazon', label: 'アマゾン川', names: ['Amazonas', 'Marañón', 'Ucayali'] },
  { id: 'parana', label: 'パラナ川', names: ['Paraná'] },
  { id: 'murray', label: 'マーレー川', names: ['Murray', 'Darling'] },
])
const riversFile = path.join(folder, 'ne_50m_rivers.geojson')
if (!fs.existsSync(riversFile)) {
  const response = await fetch(RIVERS_URL, { signal: AbortSignal.timeout(120_000) })
  if (!response.ok) throw new Error(`川のデータを取れない：${response.status}`)
  fs.writeFileSync(riversFile, Buffer.from(await response.arrayBuffer()))
}
const riverFeatures = JSON.parse(fs.readFileSync(riversFile, 'utf8')).features
const worldRivers = RIVERS.map((river) => {
  const lines = riverFeatures
    .filter((feature) => river.names.includes(feature.properties.name_en ?? feature.properties.name) || river.names.includes(feature.properties.name))
    .flatMap((feature) => (feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.coordinates))
  if (!lines.length) throw new Error(`川が見つからない：${river.id}`)
  const d = lines
    .map((line) => simplify(line.map(([lon, lat]) => projectWorld([lon < CUT_LON ? lon + 360 : lon, lat])), WORLD_TOL * 0.6))
    .map(linePathOf)
    .filter(Boolean)
    .join('')
  return { id: river.id, label: river.label, d }
})

// 世界の大きな湖（Natural Earth の湖）。国の形は湖の上もぬっているので、どの世界地図にも水の色で重ねて描く。
const LAKES_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_lakes.geojson'
const LAKE_NAMES = Object.freeze([
  'Superior', 'Michigan', 'Huron', 'Erie', 'Ontario', 'Great Bear', 'Great Slave', 'Winnipeg',
  'Nyanza', 'Tanganyika', 'Malawi', 'Chad', 'Baikal', 'Balkhash', 'Ladoga', 'Onega', 'Titicaca',
  'Issyk-Kul', 'North Aral Sea', 'South Aral Sea',
])
const lakesFile = path.join(folder, 'ne_50m_lakes.geojson')
if (!fs.existsSync(lakesFile)) {
  const response = await fetch(LAKES_URL, { signal: AbortSignal.timeout(120_000) })
  if (!response.ok) throw new Error(`湖のデータを取れない：${response.status}`)
  fs.writeFileSync(lakesFile, Buffer.from(await response.arrayBuffer()))
}
const lakeFeatures = JSON.parse(fs.readFileSync(lakesFile, 'utf8')).features
const worldLakes = LAKE_NAMES.map((name) => {
  const features = lakeFeatures.filter((feature) => (feature.properties.name_en ?? feature.properties.name) === name && feature.properties.scalerank === 0)
  if (!features.length) throw new Error(`湖が見つからない：${name}`)
  const rings = features.flatMap((feature) => (feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates[0]] : feature.geometry.coordinates.map((poly) => poly[0])))
  const d = rings
    .map((ring) => {
      const [lon] = centroid(ring)
      return simplifyRing(ring.map(([x, y]) => projectWorld([lon < CUT_LON ? x + 360 : x, y])), WORLD_TOL * 0.6)
    })
    .filter((ring) => ring.length >= 4)
    .map(pathOf)
    .filter(Boolean)
    .join('')
  return { name, d }
})

// ── 東京を中心とした正距方位図法（中心からの距離と方位が正しい地図）──────────────────────
// 南極大陸も描く（地図の下の縁の近くに広がる）。北方領土は日本の形として描く。
const AZIMUTHAL_TOL = 0.45
const AZIMUTHAL_MIN_AREA = 2
const azimuthalCountries = []
for (const feature of world.features) {
  const props = feature.properties
  const code = MERGE_INTO[props.ADM0_A3] ?? props.ADM0_A3
  const polys = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates
  let rings = polys.map((poly) => poly[0])
  if (code === 'RUS') rings = rings.filter((ring) => !isNorthernTerritories(centroid(ring)))
  if (code === 'JPN') rings = [...rings, ...japan.territories.northern]
  const drawn = []
  for (const ring of rings) {
    const projected = ring.map(([lon, lat]) => projectAzimuthal(lon, lat))
    const simple = simplifyRing(projected, AZIMUTHAL_TOL)
    if (simple.length < 4 || area(simple) < AZIMUTHAL_MIN_AREA) continue
    drawn.push(simple)
  }
  if (!drawn.length) continue
  const existing = azimuthalCountries.find((item) => item.code === code)
  const d = drawn.map(pathOf).filter(Boolean).join('')
  if (existing) existing.d += d
  else azimuthalCountries.push({ code, state: STATE_OF[props.CONTINENT] ?? 'antarctica', d })
}
azimuthalCountries.sort((a, b) => a.code.localeCompare(b.code))

// ── 地球儀の図に使う陸の形（緯度・経度のまま。図の部品が見る向きに合わせて描く）──────────────
const GLOBE_TOL = 0.5
const GLOBE_MIN_AREA = 1.5
const globeLand = []
for (const feature of world.features) {
  const polys = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates
  for (const poly of polys) {
    const ring = poly[0]
    const simple = simplifyRing(ring, GLOBE_TOL)
    if (simple.length < 4 || area(simple) < GLOBE_MIN_AREA) continue
    globeLand.push(simple.map(([lon, lat]) => [Math.round(lon * 10) / 10, Math.round(lat * 10) / 10]))
  }
}

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
// 元データ：Natural Earth（県の形・日本の見方の国境・湖・世界の国の形・世界の大河と大きな湖。パブリックドメイン）。
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
  rivers: worldRivers,
  lakes: worldLakes,
})}

// 東京を中心とした正距方位図法。円の中心が東京、縁が地球の反対側。
export const AZIMUTHAL_MAP = ${JSON.stringify({
  radius: AZIMUTHAL_PROJECTION.radius,
  countries: azimuthalCountries,
})}

// 地球儀の図の陸の形（[経度, 緯度] の輪）。
export const GLOBE_LAND = ${JSON.stringify(globeLand)}
`
fs.writeFileSync(OUT, body)
console.log(`日本：${prefectures.length}都道府県・図 ${japanWidth}×${japanHeight}`)
console.log(`世界：${worldCountries.length}か国・地域・図 ${WORLD_WIDTH}×${worldHeight}`)
console.log(`正距方位図法：${azimuthalCountries.length}か国・地域、地球儀の陸：${globeLand.length}の輪`)
console.log(`→ ${path.relative(process.cwd(), OUT)}（${fs.statSync(OUT).size.toLocaleString()} バイト）`)
