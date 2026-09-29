#!/usr/bin/env node
// 教材づくりに使える無償・商用可の素材を取り出す道具。候補と利用条件の台帳は docs/material-sources.json。
// 台帳で ready の候補は、ここに取り出し方（HANDLERS）を1つずつ持つ。
//
//   node scripts/materials/sources.mjs list
//     台帳の一覧（種類・状態・出典の表示の要否）を出す。
//   node scripts/materials/sources.mjs verify <id…|--all> [--stamp]
//     実際に取り出して確かめる。--stamp を付けると、確かめた日・件数・大きさ・sha256 を台帳の verified に書く。
//   node scripts/materials/sources.mjs fetch <id> [--out <フォルダ>] [--<項目> <値>…]
//     取り出して保存する。項目は取り出し方ごと（例：--q 火山、--id 45434）。既定の値は台帳の tool.options。
//
// 取り出した物は既定で OS の一時フォルダ（study-app-materials/<id>）に置き、リポジトリには入れない。
// 教材に使うときは、その素材の出どころと権利を、名作の rights・source と同じくデータに持ち、画面には出さない。
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const CATALOG_PATH = join(ROOT, 'docs', 'material-sources.json')
const USER_AGENT = 'study-app-materials/1.0 (educational content tool)'
const NATURAL_EARTH = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
// スミソニアンの API は api.data.gov の鍵が要る。誰でも使える公開のデモ用の値で試し、多く使うときは環境変数で自分の鍵を渡す。
const SMITHSONIAN_PUBLIC_DEMO = 'DEMO_KEY'

// ── 通信と共通の道具 ─────────────────────────────────────────────
async function get(url, { binary = false, tries = 3, headers = {} } = {}) {
  let last
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, ...headers },
        redirect: 'follow',
        signal: AbortSignal.timeout(120_000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status} ${url}`)
      return binary ? Buffer.from(await response.arrayBuffer()) : await response.text()
    } catch (error) {
      last = error
      if (attempt < tries) await new Promise((done) => setTimeout(done, 1500 * attempt))
    }
  }
  throw last
}
const getJson = async (url, options) => JSON.parse(await get(url, options))
const getBinary = (url, options) => get(url, { ...options, binary: true })
const jsonFile = (name, value) => ({ name, buffer: Buffer.from(`${JSON.stringify(value, null, 1)}\n`) })

function need(condition, message) {
  if (!condition) throw new Error(message)
}

const isImage = (buffer) => (
  (buffer[0] === 0xff && buffer[1] === 0xd8) // JPEG
  || buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) // PNG
  || buffer.subarray(0, 4).toString('ascii') === 'RIFF' // WebP
  || buffer.subarray(0, 3).toString('ascii') === 'GIF'
)
const isSvg = (buffer) => /<svg[\s>]/i.test(buffer.subarray(0, 4096).toString('utf8'))

// 経度・緯度の折れ線を、ずれが tolerance（度）以内になるまで間引く。
function simplify(points, tolerance) {
  if (points.length <= 2) return points
  const keep = new Uint8Array(points.length)
  keep[0] = 1
  keep[points.length - 1] = 1
  const stack = [[0, points.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [ax, ay] = points[a]
    const [bx, by] = points[b]
    const length = Math.hypot(bx - ax, by - ay)
    let worst = -1
    let index = -1
    for (let i = a + 1; i < b; i += 1) {
      const [px, py] = points[i]
      const distance = length < 1e-12
        ? Math.hypot(px - ax, py - ay)
        : Math.abs((by - ay) * px - (bx - ax) * py + bx * ay - by * ax) / length
      if (distance > worst) {
        worst = distance
        index = i
      }
    }
    if (worst > tolerance) {
      keep[index] = 1
      stack.push([a, index], [index, b])
    }
  }
  return points.filter((_, i) => keep[i])
}
// 閉じた輪は、始点からいちばん遠い点で2つに分けてから間引く（始点と終点が同じなので、そのままでは全部消える）。
function simplifyRing(ring, tolerance) {
  const [x0, y0] = ring[0]
  let far = 1
  for (let i = 1; i < ring.length; i += 1) {
    if (Math.hypot(ring[i][0] - x0, ring[i][1] - y0) > Math.hypot(ring[far][0] - x0, ring[far][1] - y0)) far = i
  }
  return [...simplify(ring.slice(0, far + 1), tolerance), ...simplify(ring.slice(far), tolerance).slice(1)]
}
const round4 = ([lon, lat]) => [Math.round(lon * 1e4) / 1e4, Math.round(lat * 1e4) / 1e4]
const outerRings = (geometry) => (geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates).map((polygon) => polygon[0])
const centroid = (points) => points.reduce(([sx, sy], [x, y]) => [sx + x / points.length, sy + y / points.length], [0, 0])
const cleanRings = (rings, tolerance) => rings
  .map((ring) => simplifyRing(ring, tolerance).map(round4))
  .filter((ring) => ring.length >= 4)

// ── 取り出し方（台帳の tool.id）────────────────────────────────────
// run(options) は { items: 件数, files: [{ name, buffer }], detail: 確かめた中身の説明 } を返す。
export const HANDLERS = {
  // Natural Earth（パブリックドメイン）：47都道府県の形、北方領土・竹島・尖閣諸島（日本の見方の国境から）、琵琶湖。
  'natural-earth-japan': {
    describe: '日本の都道府県・領土・湖の形（経度・緯度、間引き済み）',
    async run({ tolerance = 0.004 } = {}) {
      const admin1 = await getJson(`${NATURAL_EARTH}ne_10m_admin_1_states_provinces.geojson`)
      const prefectures = admin1.features
        .filter((feature) => feature.properties.adm0_a3 === 'JPN')
        .map((feature) => ({
          code: feature.properties.iso_3166_2,
          name: feature.properties.name_ja,
          rings: cleanRings(outerRings(feature.geometry), Number(tolerance)),
        }))
        .sort((a, b) => a.code.localeCompare(b.code))
      need(prefectures.length === 47, `都道府県が ${prefectures.length} 件（47 件のはず）`)
      const pov = await getJson(`${NATURAL_EARTH}ne_10m_admin_0_countries_jpn.geojson`)
      const japan = pov.features.find((feature) => (feature.properties.ADM0_A3 ?? feature.properties.adm0_a3) === 'JPN')
      const rings = outerRings(japan.geometry)
      const pick = (test) => cleanRings(rings.filter((ring) => test(centroid(ring))), Number(tolerance) / 4)
      const territories = {
        northern: pick(([lon, lat]) => lon > 145.45 && lon < 149.5 && lat > 43.2 && lat < 46),
        takeshima: pick(([lon, lat]) => Math.abs(lon - 131.87) < 0.1 && Math.abs(lat - 37.24) < 0.1),
        senkaku: pick(([lon, lat]) => lon > 123.3 && lon < 124.7 && lat > 25.6 && lat < 26.0),
      }
      const lakes = (await getJson(`${NATURAL_EARTH}ne_10m_lakes.geojson`)).features
        .filter((feature) => feature.properties.name === 'Biwa Ko')
        .map((feature) => ({ name: '琵琶湖', rings: cleanRings(outerRings(feature.geometry), Number(tolerance) / 2) }))
      need(lakes.length === 1, '琵琶湖が見つからない')
      const missing = Object.entries(territories).filter(([, list]) => !list.length).map(([name]) => name)
      const data = { source: 'Natural Earth 10m', license: 'パブリックドメイン', tolerance: Number(tolerance), prefectures, territories, lakes }
      return {
        items: prefectures.length,
        files: [jsonFile('japan.json', data)],
        detail: `都道府県 ${prefectures.length}、北方領土 ${territories.northern.length} 島・竹島 ${territories.takeshima.length}・尖閣諸島 ${territories.senkaku.length}（データに無い：${missing.join('・') || 'なし'}）、琵琶湖`,
      }
    },
  },
  // Natural Earth の川（パブリックドメイン）。日本の川は3本しか入っていない。
  'natural-earth-rivers': {
    describe: '日本の川の線（Natural Earth に入っている分）',
    async run() {
      const data = await getJson(`${NATURAL_EARTH}ne_10m_rivers_lake_centerlines.geojson`)
      // 北緯41.6度より北は東経139.3度より東（北海道）だけを日本とみなす。西の沿海州・中国東北部・朝鮮半島の川を除く。
      const inJapan = ([lon, lat]) => lat > 30 && lat < 45.7 && (lat <= 41.6 ? lon >= 129.4 && lon < 146 : lon >= 139.3 && lon < 149)
      const rivers = data.features
        .map((feature) => {
          const lines = feature.geometry.type === 'LineString' ? [feature.geometry.coordinates] : feature.geometry.coordinates
          const points = lines.flat()
          return { name: feature.properties.name, share: points.filter(inJapan).length / points.length, lines }
        })
        .filter((river) => river.share > 0.5)
        .map(({ name, lines }) => ({ name, lines: lines.map((line) => simplify(line, 0.002).map(round4)) }))
      need(rivers.some((river) => river.name === 'Tone'), '利根川が見つからない')
      return { items: rivers.length, files: [jsonFile('rivers.json', { source: 'Natural Earth 10m', license: 'パブリックドメイン', rivers })], detail: rivers.map((river) => river.name).join('・') }
    },
  },
  // NOAA の ETOPO1（全球の標高・水深。自由に使え、配ってよい）。ERDDAP から範囲を切り出す。
  'noaa-etopo': {
    describe: '標高（1分角＝約1.8km ごと）',
    async run({ south = 35.2, north = 35.5, west = 138.6, east = 138.9, stride = 1 } = {}) {
      const range = (a, b) => `%5B(${a}):${stride}:(${b})%5D`
      const url = `https://upwell.pfeg.noaa.gov/erddap/griddap/etopo180.json?altitude${range(south, north)}${range(west, east)}`
      const table = (await getJson(url)).table
      const rows = table.rows
      need(rows.length > 0, '標高が取れない')
      const top = rows.reduce((best, row) => (row[2] > best[2] ? row : best), rows[0])
      return { items: rows.length, files: [jsonFile('elevation.json', { source: 'NOAA ETOPO1', columns: table.columnNames, rows })], detail: `${rows.length} 点、最も高い点 ${top[2]}m（北緯 ${top[0]}・東経 ${top[1]}）` }
    },
  },
  // Wikidata（構造化データは CC0）。SPARQL で事実を取り出す。--query に .rq ファイルを渡せる。
  wikidata: {
    describe: '事実のデータ（長さ・高さ・年・座標など）',
    async run({ query } = {}) {
      // 既定：日本の長さ 200km 以上の川（長さは単位がまちまちなので、SI 単位＝メートルにそろえた値で比べる）。
      const sparql = query ? readFileSync(resolve(query), 'utf8') : `SELECT ?river ?riverLabel ?length WHERE {
  ?river wdt:P31 wd:Q4022; wdt:P17 wd:Q17; p:P2043/psn:P2043/wikibase:quantityAmount ?meters.
  FILTER(?meters >= 200000)
  BIND(ROUND(?meters / 1000) AS ?length)
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ja". }
} ORDER BY DESC(?meters)`
      const data = await getJson(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`, { headers: { Accept: 'application/sparql-results+json' } })
      const rows = data.results.bindings
      need(rows.length > 0, '結果が0件')
      const show = rows.slice(0, 3).map((row) => Object.values(row).map((cell) => cell.value).filter((value) => !value.startsWith('http')).reverse().join(' ')).join('、')
      return { items: rows.length, files: [jsonFile('wikidata.json', data)], detail: `${rows.length} 件（${show} …）` }
    },
  },
  // 統計ダッシュボード（公共データ利用規約：数値データは自由に使える）。47都道府県の値を1回で取る。
  'estat-dashboard': {
    describe: '統計の数値（都道府県別）',
    async run({ indicator = '0201010000000010000', time = '2020CY00' } = {}) {
      const regions = Array.from({ length: 47 }, (_, i) => `${String(i + 1).padStart(2, '0')}000`).join(',')
      const data = await getJson(`https://dashboard.e-stat.go.jp/api/1.0/Json/getData?IndicatorCode=${indicator}&RegionCode=${regions}&Time=${time}`)
      const values = [data.GET_STATS?.STATISTICAL_DATA?.DATA_INF?.DATA_OBJ ?? []].flat().map((item) => ({ region: item.VALUE['@regionCode'], time: item.VALUE['@time'], value: Number(item.VALUE.$) }))
      need(values.length === 47, `都道府県が ${values.length} 件（47 件のはず）`)
      return { items: values.length, files: [jsonFile('stats.json', { source: '統計ダッシュボード', indicator, time, values })], detail: `47都道府県（北海道 ${values[0].value.toLocaleString('ja-JP')}、東京都 ${values[12].value.toLocaleString('ja-JP')}）` }
    },
  },
  // 気象庁の平年値（公共データ利用規約：数値データは自由に使える）。地点の月ごとの降水量・気温。
  'jma-normals': {
    describe: '気候の平年値（月ごとの降水量・気温）',
    async run({ prec = 44, block = 47662 } = {}) {
      const html = await get(`https://www.data.jma.go.jp/stats/etrn/view/nml_sfc_ym.php?prec_no=${prec}&block_no=${block}&year=&month=&day=&view=`)
      const text = (cell) => cell.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim()
      const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
        .map(([, row]) => [...row.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(([, cell]) => text(cell)))
        .filter((cells) => /^(\d+月|年)$/.test(cells[0] ?? ''))
        .map((cells) => ({ month: cells[0], precipitation: Number(cells[3]), meanTemperature: Number(cells[4]), maxTemperature: Number(cells[5]), minTemperature: Number(cells[6]) }))
      const months = rows.filter((row) => row.month !== '年')
      need(months.length === 12 && months.every((row) => Number.isFinite(row.precipitation) && Number.isFinite(row.meanTemperature)), '12か月の平年値が読めない')
      const year = rows.find((row) => row.month === '年')
      return { items: months.length, files: [jsonFile('normals.json', { source: '気象庁 平年値', prec, block, months, year })], detail: `1月 ${months[0].meanTemperature}℃・8月 ${months[7].meanTemperature}℃、年降水量 ${year?.precipitation}mm` }
    },
  },
  // メトロポリタン美術館（パブリックドメインの作品の画像は CC0）。isPublicDomain を確かめてから取る。
  met: {
    describe: '美術作品の画像（パブリックドメインの作品だけ）',
    async run({ id = 45434 } = {}) {
      const item = await getJson(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
      need(item.isPublicDomain === true, `${id} はパブリックドメインではない`)
      need(item.primaryImageSmall, `${id} に画像がない`)
      const image = await getBinary(item.primaryImageSmall)
      need(isImage(image), '画像ではない')
      const meta = { id, title: item.title, artist: item.artistDisplayName, date: item.objectDate, isPublicDomain: item.isPublicDomain, url: item.objectURL }
      return { items: 1, files: [{ name: `met-${id}.jpg`, buffer: image }, jsonFile(`met-${id}.json`, meta)], detail: `${item.artistDisplayName}「${item.title}」（${item.objectDate}）isPublicDomain=true` }
    },
  },
  // シカゴ美術館（パブリックドメインの作品の画像は CC0。キャプションのお願いあり）。
  aic: {
    describe: '美術作品の画像（パブリックドメインの作品だけ）',
    async run({ id = 24645, width = 843 } = {}) {
      const { data } = await getJson(`https://api.artic.edu/api/v1/artworks/${id}?fields=id,title,artist_display,date_display,image_id,is_public_domain`, { headers: { 'AIC-User-Agent': USER_AGENT } })
      need(data.is_public_domain === true, `${id} はパブリックドメインではない`)
      const image = await getBinary(`https://www.artic.edu/iiif/2/${data.image_id}/full/${width},/0/default.jpg`, { headers: { 'AIC-User-Agent': USER_AGENT } })
      need(isImage(image), '画像ではない')
      return { items: 1, files: [{ name: `aic-${id}.jpg`, buffer: image }, jsonFile(`aic-${id}.json`, data)], detail: `「${data.title}」is_public_domain=true` }
    },
  },
  // クリーブランド美術館（CC0 の作品だけを検索して取る）。
  cma: {
    describe: '美術作品の画像（CC0 の作品だけ）',
    async run({ q = 'hokusai' } = {}) {
      const { data } = await getJson(`https://openaccess-api.clevelandart.org/api/artworks/?q=${encodeURIComponent(q)}&cc0=1&has_image=1&limit=1`)
      const item = data[0]
      need(item && item.share_license_status === 'CC0', 'CC0 の作品が見つからない')
      const image = await getBinary(item.images.web.url)
      need(isImage(image), '画像ではない')
      return { items: 1, files: [{ name: `cma-${item.id}.jpg`, buffer: image }, jsonFile(`cma-${item.id}.json`, { id: item.id, title: item.title, creators: item.creators?.map((c) => c.description), license: item.share_license_status, url: item.url })], detail: `「${item.title}」share_license_status=CC0` }
    },
  },
  // スミソニアン（Open Access は CC0）。metadata_usage.access が CC0 のものだけを取る。
  smithsonian: {
    describe: '博物標本・美術の画像（CC0 のものだけ）',
    async run({ q = 'quartz' } = {}) {
      const key = process.env.SMITHSONIAN_API_KEY || SMITHSONIAN_PUBLIC_DEMO
      const search = `${q} AND media_usage:"CC0"`
      const data = await getJson(`https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(search)}&rows=10&api_key=${key}`)
      const cc0Image = (candidate) => candidate.content?.descriptiveNonRepeating?.online_media?.media?.find((media) => media.type === 'Images' && media.usage?.access === 'CC0')
      const row = data.response.rows.find((candidate) => candidate.content?.descriptiveNonRepeating?.metadata_usage?.access === 'CC0' && cc0Image(candidate))
      need(row, 'CC0 で画像のある資料が見つからない')
      const media = cc0Image(row)
      const image = await getBinary(`${media.content}${media.content.includes('?') ? '&' : '?'}max=800`)
      need(isImage(image), '画像ではない')
      return { items: 1, files: [{ name: 'smithsonian.jpg', buffer: image }, jsonFile('smithsonian.json', { id: row.id, title: row.title, unit: row.unitCode, access: 'CC0' })], detail: `「${row.title}」（${row.unitCode}）metadata_usage.access=CC0` }
    },
  },
  // ウィキメディア・コモンズ（ファイルごとに権利が違う。パブリックドメイン・CC0 のファイルだけを取る）。
  commons: {
    describe: 'パブリックドメインの絵・図版（例：手描きの植物図譜）',
    async run({ file = 'Brassica napus - Köhler–s Medizinal-Pflanzen-169.jpg', width = 800 } = {}) {
      const data = await getJson(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(`File:${file}`)}&prop=imageinfo&iiprop=url%7Cextmetadata%7Csize&iiurlwidth=${width}&format=json`)
      const page = Object.values(data.query.pages)[0]
      need(page.imageinfo, `${file} が見つからない`)
      const info = page.imageinfo[0]
      const license = info.extmetadata?.LicenseShortName?.value ?? ''
      need(/public domain|^cc0|^pd/i.test(license), `${file} はパブリックドメインでも CC0 でもない（${license}）`)
      const image = await getBinary(info.thumburl ?? info.url)
      need(isImage(image), '画像ではない')
      return { items: 1, files: [{ name: 'commons.jpg', buffer: image }, jsonFile('commons.json', { file, license, page: info.descriptionurl })], detail: `${file}（${license}）` }
    },
  },
  // NASA の画像（米国政府の著作物。推薦に見える使い方・ロゴ・人物の商用利用は不可）。
  nasa: {
    describe: '天体・地球・宇宙の写真',
    async run({ q = 'full moon' } = {}) {
      const data = await getJson(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page_size=20`)
      const item = data.collection.items.find((candidate) => {
        const meta = candidate.data?.[0] ?? {}
        return !/©|copyright/i.test(`${meta.description ?? ''} ${meta.secondary_creator ?? ''} ${meta.photographer ?? ''}`)
      })
      need(item, '第三者の著作権の記載がない画像が見つからない')
      const meta = item.data[0]
      const assets = await getJson(item.href)
      const url = assets.find((asset) => /~small\.jpg$/i.test(asset)) ?? assets.find((asset) => /~medium\.jpg$/i.test(asset)) ?? assets.find((asset) => /\.jpg$/i.test(asset))
      const image = await getBinary(url.replace(/^http:/, 'https:'))
      need(isImage(image), '画像ではない')
      return { items: 1, files: [{ name: `${meta.nasa_id}.jpg`, buffer: image }, jsonFile(`${meta.nasa_id}.json`, { nasa_id: meta.nasa_id, title: meta.title, center: meta.center, date: meta.date_created })], detail: `「${meta.title}」（${meta.nasa_id}）` }
    },
  },
  // PhyloPic（生き物のシルエット。出典の要らない CC0・PDM のものだけを取る）。
  phylopic: {
    describe: '生き物のシルエット（SVG）',
    async run() {
      const first = await fetch('https://api.phylopic.org/images', { headers: { 'User-Agent': USER_AGENT }, redirect: 'manual', signal: AbortSignal.timeout(60_000) })
      const build = (first.headers.get('location') ?? '').match(/build=(\d+)/)?.[1] ?? (await first.json().catch(() => ({}))).build
      need(build, 'PhyloPic の build が分からない')
      const list = await getJson(`https://api.phylopic.org/images?build=${build}&filter_license_by=false&filter_license_nc=false&filter_license_sa=false&page=0&embed_items=true`)
      const item = list._embedded.items.find((candidate) => /publicdomain\/(zero|mark)/.test(candidate._links.license?.href ?? ''))
      need(item, 'CC0・PDM のシルエットが見つからない')
      const svg = await getBinary(item._links.vectorFile.href)
      need(isSvg(svg), 'SVG ではない')
      return { items: 1, files: [{ name: 'phylopic.svg', buffer: svg }, jsonFile('phylopic.json', { title: item._links.specificNode?.title ?? item._links.self?.title, license: item._links.license.href, build })], detail: `「${item._links.specificNode?.title ?? ''}」${item._links.license.href}` }
    },
  },
  // Openclipart（すべてパブリックドメインのクリップアート。SVG）。
  openclipart: {
    describe: 'クリップアート（SVG）',
    async run({ q = 'flask' } = {}) {
      const search = await get(`https://openclipart.org/search/?query=${encodeURIComponent(q)}`)
      const detail = search.match(/href="(\/detail\/\d+\/[^"]+)"/)?.[1]
      need(detail, 'クリップアートが見つからない')
      const page = await get(`https://openclipart.org${detail}`)
      // 詳しいページには、SVG の本体の URL が JSON の中に「\/」の形で書いてある。無ければ /download/<番号> を使う。
      const escaped = page.match(/https:\\\/\\\/openclipart\.org\\\/download\\\/\d+\\\/[^"\s]+?\.svg/)?.[0]
      const plain = page.match(/href="(\/download\/\d+)"/)?.[1]
      const download = escaped ? escaped.replaceAll('\\/', '/') : plain && `https://openclipart.org${plain}`
      need(download, 'SVG のダウンロード先が見つからない')
      const svg = await getBinary(download)
      need(isSvg(svg), 'SVG ではない')
      return { items: 1, files: [{ name: 'openclipart.svg', buffer: svg }], detail: `${detail}（${download}）` }
    },
  },
  // Openverse（CC の画像の検索。出典の要らない CC0・PDM だけに絞る）。
  openverse: {
    describe: '写真・絵の検索（CC0・パブリックドメインだけ）',
    async run({ q = 'volcano' } = {}) {
      const data = await getJson(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=5`)
      const item = data.results.find((result) => ['cc0', 'pdm'].includes(result.license))
      need(item, 'CC0・PDM の画像が見つからない')
      const image = await getBinary(item.thumbnail)
      need(isImage(image), '画像ではない')
      return { items: data.result_count, files: [{ name: 'openverse.jpg', buffer: image }, jsonFile('openverse.json', { title: item.title, license: item.license, source: item.source, url: item.foreign_landing_url })], detail: `CC0・PDM で ${data.result_count} 件（例「${item.title}」${item.license}）` }
    },
  },
  // npm の部品（字体・図の道具）。ライセンスが許すものであること、中身（LICENSE・字体のファイル）を確かめる。
  'npm-package': {
    describe: 'npm の部品（ライセンスと中身を確かめる）',
    async run({ name, expect = '' } = {}) {
      need(name, 'name がない')
      const meta = await getJson(`https://registry.npmjs.org/${name.replace('/', '%2F')}/latest`)
      need(['MIT', 'ISC', 'OFL-1.1', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause'].includes(meta.license), `${name} のライセンスが ${meta.license}`)
      const tarball = await getBinary(meta.dist.tarball)
      const dir = mkdtempSync(join(tmpdir(), 'npm-package-'))
      try {
        const file = join(dir, 'package.tgz')
        writeFileSync(file, tarball)
        const listing = spawnSync('tar', ['-tzf', file], { encoding: 'utf8' })
        need(listing.status === 0, 'tarball を開けない')
        const files = listing.stdout.split('\n').filter(Boolean)
        need(files.some((path) => /LICEN[CS]E/i.test(path)), 'LICENSE が入っていない')
        if (expect) need(files.some((path) => new RegExp(expect).test(path)), `${expect} のファイルが入っていない`)
        return { items: files.length, files: [{ name: `${name.replace('/', '__')}-${meta.version}.tgz`, buffer: tarball }], detail: `${name}@${meta.version}（${meta.license}、${files.length} ファイル）` }
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  },
  // 図の道具の部品を一時フォルダに入れ、実際に動かして確かめる（アプリの package.json は変えない）。
  'npm-run': {
    describe: '図の道具（入れて動かして確かめる）',
    async run({ packages = '', snippet = '' } = {}) {
      const code = SNIPPETS[snippet]
      need(code, `snippet ${snippet} が無い`)
      const dir = mkdtempSync(join(tmpdir(), 'npm-run-'))
      try {
        writeFileSync(join(dir, 'package.json'), '{"type":"module","private":true}\n')
        const install = spawnSync('npm', ['install', '--no-audit', '--no-fund', '--silent', ...String(packages).split(' ').filter(Boolean)], { cwd: dir, encoding: 'utf8' })
        need(install.status === 0, `npm install に失敗：${install.stderr}`)
        writeFileSync(join(dir, 'run.mjs'), code)
        const run = spawnSync(process.execPath, ['run.mjs'], { cwd: dir, encoding: 'utf8' })
        need(run.status === 0, `動かせない：${run.stderr}`)
        const output = run.stdout.trim()
        const installed = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).dependencies
        return { items: 1, files: [{ name: `${snippet}.txt`, buffer: Buffer.from(`${output}\n`) }], detail: `${Object.entries(installed ?? {}).map(([k, v]) => `${k}@${v}`).join('・')}：${output.slice(0, 120)}` }
      } finally {
        rmSync(dir, { recursive: true, force: true })
      }
    },
  },
  // KaTeX の化学式（mhchem。アプリにもう入っている KaTeX に同梱）。
  'katex-mhchem': {
    describe: '化学反応式（KaTeX の \\ce）',
    async run({ tex = '\\ce{2H2 + O2 -> 2H2O}' } = {}) {
      const katex = (await import(pathToFileURL(join(ROOT, 'node_modules/katex/dist/katex.mjs')).href)).default
      await import(pathToFileURL(join(ROOT, 'node_modules/katex/dist/contrib/mhchem.mjs')).href)
      const html = katex.renderToString(tex, { throwOnError: true, output: 'html' })
      // 矢印（関係の記号）と、下付きの数字（H₂ の 2）が描けていれば、化学式として読めている。
      need(/class="mrel/.test(html) && /class="vlist/.test(html), '化学式が描けない')
      return { items: 1, files: [{ name: 'mhchem.html', buffer: Buffer.from(html) }], detail: `${tex} → HTML ${html.length} 文字` }
    },
  },
  // Playwright（テストにもう入っている）で SVG を画像にする。図の見た目の確かめに使う。
  'playwright-render': {
    describe: '図を画像にして確かめる',
    async run() {
      const { chromium } = await import(pathToFileURL(join(ROOT, 'node_modules/playwright/index.mjs')).href)
      const browser = await chromium.launch()
      try {
        const page = await browser.newPage({ viewport: { width: 200, height: 120 }, deviceScaleFactor: 2 })
        await page.setContent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120"><rect width="200" height="120" fill="#f7f5f0"/><circle cx="100" cy="60" r="40" fill="#378ADD"/></svg>')
        const png = await page.screenshot({ type: 'png' })
        need(isImage(png), '画像にできない')
        return { items: 1, files: [{ name: 'render.png', buffer: png }], detail: `PNG ${png.length} バイト（400×240）` }
      } finally {
        await browser.close()
      }
    },
  },
}

// npm-run で動かす確かめ（どれも「部品が正しく動いた」ことが出力で分かるもの）。
const SNIPPETS = {
  // 2026-09-29 の月齢（新月からの日数）。0〜29.5 の範囲に入れば動いている。
  'moon-phase': `import * as Astronomy from 'astronomy-engine'
const date = new Date('2026-09-29T00:00:00Z')
const phase = Astronomy.MoonPhase(date)
const age = (phase / 360) * 29.530588
if (!(age >= 0 && age < 29.6)) process.exit(1)
console.log('月の位相角 ' + phase.toFixed(1) + '°、月齢 ' + age.toFixed(1))`,
  // 3×3 の格子で 1.5 の等高線を引き、閉じた線が1本できれば動いている。
  contour: `import { contours } from 'd3-contour'
import { geoPath, geoMercator } from 'd3-geo'
const values = [0, 0, 0, 0, 2, 0, 0, 0, 0]
const [line] = contours().size([3, 3]).thresholds([1])(values)
if (!line || line.coordinates.length !== 1) process.exit(1)
const d = geoPath(geoMercator())({ type: 'Point', coordinates: [139.7, 35.7] })
if (!d) process.exit(1)
console.log('等高線 ' + line.coordinates.length + ' 本、地図の投影 OK')`,
  // 東京駅が「東京都のおおまかな四角」の中、大阪が外と判定できれば動いている。
  'point-in-polygon': `import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
const tokyo = { type: 'Polygon', coordinates: [[[138.9, 35.5], [139.95, 35.5], [139.95, 35.9], [138.9, 35.9], [138.9, 35.5]]] }
const inside = booleanPointInPolygon([139.767, 35.681], tokyo)
const outside = booleanPointInPolygon([135.5, 34.7], tokyo)
if (!inside || outside) process.exit(1)
console.log('点が形の中か外かの判定 OK')`,
  // 手描き風の線（rough.js）が SVG の path として作れれば動いている。
  'rough-svg': `import rough from 'roughjs'
const generator = rough.generator()
const drawable = generator.rectangle(10, 10, 80, 40, { roughness: 1.5, seed: 7 })
const paths = generator.toPaths(drawable)
if (!paths.length || !paths[0].d.startsWith('M')) process.exit(1)
console.log('手描き風の四角 ' + paths.length + ' 本の線、最初の線 ' + paths[0].d.length + ' 文字')`,
}

// ── 台帳 ─────────────────────────────────────────────────────
export const readCatalog = () => JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
const writeCatalog = (catalog) => writeFileSync(CATALOG_PATH, `${JSON.stringify(catalog, null, 2)}\n`)

export async function runSource(source, overrides = {}) {
  const handler = HANDLERS[source.tool?.id]
  need(handler, `${source.id} の取り出し方（tool.id）が無い`)
  const result = await handler.run({ ...(source.tool.options ?? {}), ...overrides })
  const hash = createHash('sha256')
  for (const file of [...result.files].sort((a, b) => a.name.localeCompare(b.name))) hash.update(file.buffer)
  return { ...result, bytes: result.files.reduce((sum, file) => sum + file.buffer.length, 0), sha256: hash.digest('hex') }
}

const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })

async function main(argv) {
  const [command, ...rest] = argv
  const flags = {}
  const ids = []
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i].startsWith('--')) {
      const key = rest[i].slice(2)
      const next = rest[i + 1]
      if (next === undefined || next.startsWith('--')) flags[key] = true
      else {
        flags[key] = next
        i += 1
      }
    } else ids.push(rest[i])
  }
  const catalog = readCatalog()
  if (command === 'list' || !command) {
    for (const kind of catalog.kinds) {
      console.log(`■ ${kind.name}`)
      for (const source of catalog.sources.filter((item) => item.kind === kind.id)) {
        console.log(`  ${source.status.padEnd(10)} ${source.id}（${source.name}）出典の表示：${source.attribution}${source.verified ? `、確かめた日 ${source.verified.on}` : ''}`)
      }
    }
    return
  }
  if (command === 'verify') {
    const targets = flags.all ? catalog.sources.filter((source) => source.status === 'ready') : catalog.sources.filter((source) => ids.includes(source.id))
    need(targets.length, '確かめる候補がない（id か --all を渡す）')
    let failed = 0
    for (const source of targets) {
      try {
        const result = await runSource(source)
        console.log(`✔ ${source.id}：${result.detail}（${result.items} 件・${result.bytes.toLocaleString('ja-JP')} バイト）`)
        if (flags.stamp) source.verified = { on: today(), items: result.items, bytes: result.bytes, sha256: result.sha256, detail: result.detail }
      } catch (error) {
        failed += 1
        console.log(`✘ ${source.id}：${error.message}`)
      }
    }
    if (flags.stamp) writeCatalog(catalog)
    if (failed) process.exitCode = 1
    return
  }
  if (command === 'fetch') {
    const source = catalog.sources.find((item) => item.id === ids[0])
    need(source, `台帳に ${ids[0]} が無い`)
    need(source.status === 'ready', `${source.id} は ready ではない（${source.status}）。利用条件を確かめてから使う`)
    const { out, ...overrides } = flags
    const result = await runSource(source, overrides)
    const dir = resolve(out ?? join(tmpdir(), 'study-app-materials', source.id))
    mkdirSync(dir, { recursive: true })
    for (const file of result.files) writeFileSync(join(dir, file.name), file.buffer)
    console.log(`${result.detail}\n→ ${dir}（${result.files.map((file) => file.name).join('、')}）`)
    return
  }
  throw new Error(`知らない命令：${command}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
