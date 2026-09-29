// 社会の地図の投影。scripts/subjects/build-maps.mjs（地図の形を作る道具）と図の部品が同じ式を使う。
// 数値を変えるときは、build-maps.mjs で maps.js を作り直す。

// 世界地図：太平洋を中央にしたミラー図法。西経25.5度〜東経349.5度（＝西経10.5度）を横720に描く。
// 西経25度より西の地点は、東経（360度を足した値）として右側に置く。
export const WORLD_PROJECTION = Object.freeze({
  west: -25.5,
  east: 349.5,
  cutLon: -25,
  width: 720,
  latTop: 84,
  latBottom: -57,
})

const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + (0.4 * lat * Math.PI) / 180))
const WORLD_X_SCALE = WORLD_PROJECTION.width / (WORLD_PROJECTION.east - WORLD_PROJECTION.west)
const WORLD_Y_SCALE = WORLD_X_SCALE * (180 / Math.PI)

export const WORLD_HEIGHT = Math.ceil((miller(WORLD_PROJECTION.latTop) - miller(WORLD_PROJECTION.latBottom)) * WORLD_Y_SCALE)

/** 経度（西経は負の数）を、世界地図の横の位置で使う経度（-25〜335度）に直す。 */
export const worldLongitude = (lon) => (lon < WORLD_PROJECTION.cutLon ? lon + 360 : lon)

/** 横の位置の経度（-25〜335度に直した値）と緯度から、世界地図の上の位置 [x, y]。地図の形を作る道具が使う。 */
export function projectWorldShifted(shiftedLon, lat) {
  const clamped = Math.max(WORLD_PROJECTION.latBottom, Math.min(WORLD_PROJECTION.latTop, lat))
  return [
    (shiftedLon - WORLD_PROJECTION.west) * WORLD_X_SCALE,
    (miller(WORLD_PROJECTION.latTop) - miller(clamped)) * WORLD_Y_SCALE,
  ]
}

/** 世界地図の上の位置 [x, y]。lon は -180〜180（西経は負）、lat は -90〜90（南緯は負）。 */
export const projectWorld = (lon, lat) => projectWorldShifted(worldLongitude(lon), lat)

// 日本地図：九州〜北海道の本図と、南西諸島（沖縄県・奄美）の囲みの2つ。どちらも北緯38度で横を縮めた正距円筒図法。
export const JAPAN_PROJECTION = Object.freeze({
  k: Math.cos((38 * Math.PI) / 180),
  main: Object.freeze({ lon0: 128.5, lat1: 45.65, lat0: 30.0, scale: 38, ox: 22, oy: 8 }),
  inset: Object.freeze({ lon0: 122.8, lon1: 131.5, lat0: 24.0, lat1: 29.6, scale: 30, ox: 14, oy: 14 }),
})

/** 日本地図の本図の上の位置 [x, y]。 */
export function projectJapanMain(lon, lat) {
  const { k, main } = JAPAN_PROJECTION
  return [main.ox + (lon - main.lon0) * k * main.scale, main.oy + (main.lat1 - lat) * main.scale]
}

/** 日本地図の南西諸島の囲みの上の位置 [x, y]。 */
export function projectJapanInset(lon, lat) {
  const { k, inset } = JAPAN_PROJECTION
  return [inset.ox + (lon - inset.lon0) * k * inset.scale, inset.oy + (inset.lat1 - lat) * inset.scale]
}

/** 日本地図の上の位置。北緯30度より南で南西諸島の囲みに入る地点は囲みの中に置く。 */
export function projectJapan(lon, lat) {
  const { inset, main } = JAPAN_PROJECTION
  if (lat < main.lat0 && lon >= inset.lon0 && lon <= inset.lon1 && lat >= inset.lat0) return projectJapanInset(lon, lat)
  return projectJapanMain(lon, lat)
}

// 中心からの距離と方位が正しい地図（正距方位図法）。東京を中心に、地球の反対側（約2万km）を半径 radius の円の縁に描く。
// 上が北（中心から北極の向き）。中心から引いた直線は最短の経路で、その向きが中心から見た方位になる。
export const AZIMUTHAL_PROJECTION = Object.freeze({
  center: Object.freeze({ lat: 35.68, lon: 139.69, name: '東京' }),
  radius: 150,
  // 地球の半周（km）。地球を半径6371kmの球として、反対側の地点までの距離。
  halfCircumferenceKm: Math.round(Math.PI * 6371),
})

const toRad = (degree) => (degree * Math.PI) / 180

/** 中心から地点までの角度（ラジアン、0〜π）と、中心から見た方位（北から時計回りの度）。 */
export function azimuthalPolar(lon, lat, center = AZIMUTHAL_PROJECTION.center) {
  const phi = toRad(lat)
  const lam = toRad(lon)
  const phi0 = toRad(center.lat)
  const lam0 = toRad(center.lon)
  const cosc = Math.max(-1, Math.min(1, Math.sin(phi0) * Math.sin(phi) + Math.cos(phi0) * Math.cos(phi) * Math.cos(lam - lam0)))
  const c = Math.acos(cosc)
  const east = Math.cos(phi) * Math.sin(lam - lam0)
  const north = Math.cos(phi0) * Math.sin(phi) - Math.sin(phi0) * Math.cos(phi) * Math.cos(lam - lam0)
  const bearing = ((Math.atan2(east, north) * 180) / Math.PI + 360) % 360
  return { c, bearing }
}

/** 正距方位図法の図の上の位置 [x, y]（円の中心が (radius, radius)）。 */
export function projectAzimuthal(lon, lat, { center = AZIMUTHAL_PROJECTION.center, radius = AZIMUTHAL_PROJECTION.radius } = {}) {
  const { c, bearing } = azimuthalPolar(lon, lat, center)
  const r = (c / Math.PI) * radius
  return [radius + r * Math.sin(toRad(bearing)), radius - r * Math.cos(toRad(bearing))]
}

/** 中心から地点までの距離（km）。 */
export const azimuthalDistanceKm = (lon, lat, center = AZIMUTHAL_PROJECTION.center) => (azimuthalPolar(lon, lat, center).c / Math.PI) * AZIMUTHAL_PROJECTION.halfCircumferenceKm
