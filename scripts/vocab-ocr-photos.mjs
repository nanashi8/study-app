#!/usr/bin/env node
// 「教科書から単語追加」の読み取りを確かめる実際の写真（tests/fixtures/vocab-ocr/photos.json、Wikimedia Commons の28枚）を、
// node_modules/.cache/vocab-ocr-photos/ へ取り込む。写真はリポジトリに入れない。取り込んだ中身は sha256 で確かめ、
// 違えば止める（Commons の縮小版が作り直されたときは、表の url と sha256 を直す）。
//
//   node scripts/vocab-ocr-photos.mjs        取り込む（取り込み済みで中身が同じなら読み直さない）
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
export const PHOTO_CACHE = `${ROOT}node_modules/.cache/vocab-ocr-photos/`
export const PHOTOS = JSON.parse(readFileSync(`${ROOT}tests/fixtures/vocab-ocr/photos.json`, 'utf8')).photos

const USER_AGENT = 'study-app-ocr-test/1.0 (nanashi8@users.noreply.github.com)'
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

export const photoPath = (photo) => `${PHOTO_CACHE}${photo.id}.jpg`

export async function fetchPhotos() {
  mkdirSync(PHOTO_CACHE, { recursive: true })
  for (const photo of PHOTOS) {
    const path = photoPath(photo)
    if (existsSync(path) && sha256(readFileSync(path)) === photo.sha256) continue
    const response = await fetch(photo.url, { headers: { 'User-Agent': USER_AGENT } })
    if (!response.ok) throw new Error(`${photo.id}: ${photo.url} を取り込めない（${response.status}）`)
    const buffer = Buffer.from(await response.arrayBuffer())
    if (sha256(buffer) !== photo.sha256) throw new Error(`${photo.id}: 取り込んだ写真の中身が表の sha256 と違う`)
    writeFileSync(path, buffer)
  }
  return PHOTOS.map((photo) => ({ ...photo, path: photoPath(photo) }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const photos = await fetchPhotos()
  console.log(`${photos.length}枚を ${PHOTO_CACHE} に取り込んだ`)
}
