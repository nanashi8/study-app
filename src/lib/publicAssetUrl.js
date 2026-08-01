const EXTERNAL_ASSET_PATTERN = /^(?:data:|blob:|https?:)/i

function normalizedBaseUrl(baseUrl) {
  const value = String(baseUrl || '/')
  return value.endsWith('/') ? value : `${value}/`
}

// public/ 配下の画像を、GitHub Pages の /study-app/ 配下でも読めるURLへ変換する。
// すでに変換済みのURLへ再適用しても二重にbaseを付けない。
export function publicAssetUrl(
  assetPath,
  baseUrl = import.meta.env?.BASE_URL ?? '/',
) {
  if (!assetPath) return assetPath

  const path = String(assetPath)
  if (EXTERNAL_ASSET_PATTERN.test(path)) return path

  const base = normalizedBaseUrl(baseUrl)
  if (path.startsWith(base)) return path

  return `${base}${path.replace(/^(?:\.\/|\/)+/, '')}`
}
