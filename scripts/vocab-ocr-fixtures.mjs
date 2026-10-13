#!/usr/bin/env node
// 「教科書から単語追加」の読み取り（src/lib/vocabOcr.js）を本物の読み取りエンジンで確かめる試料の画像を作る。
// 試料は tests/fixtures/vocab-ocr/samples.json（ページごとの行の並び）。各行は英語か日本語のどちらかの文で、
// 画像に描いた文字そのものが正解になる。描くのは Playwright の Chromium（macOS のヒラギノの字体）。
// 作った画像はリポジトリに入れて、テスト（tests/vocab-ocr-real-engine.test.mjs）はその画像を読む。
// 幅は 1240px にする。画面は長い辺が 1200〜2200px の写真を拡大・縮小せずに読むので、テストと画面が同じ大きさの画像を読む。
//
//   node scripts/vocab-ocr-fixtures.mjs        画像を作り直す
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const DIR = fileURLToPath(new URL('../tests/fixtures/vocab-ocr/', import.meta.url))
const { samples } = JSON.parse(readFileSync(`${DIR}samples.json`, 'utf8'))

const escapeHtml = (value) => value.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])

function pageHtml(sample) {
  const rows = sample.lines.map((line) => {
    const cells = line.cells ?? [line.text]
    if (cells.length === 1) return `<p>${escapeHtml(cells[0])}</p>`
    return `<p class="row">${cells.map((cell) => `<span>${escapeHtml(cell)}</span>`).join('')}</p>`
  }).join('')
  const style = sample.style ?? {}
  return `<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; background: ${style.background ?? '#fbfaf6'}; }
    .page { margin: 40px; width: ${style.width ?? 1160}px; font: ${style.size ?? 28}px/1.7 ${style.font ?? "'Hiragino Mincho ProN', serif"};
      color: ${style.color ?? '#222'}; transform: rotate(${style.rotate ?? 0}deg); filter: blur(${style.blur ?? 0}px); }
    p { margin: 0 0 0.35em; }
    .row span:first-child { display: inline-block; width: 12em; }
  </style><div class="page">${rows}</div>`
}

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1240, height: 400 }, deviceScaleFactor: 1 })
  for (const sample of samples) {
    await page.setContent(pageHtml(sample))
    await page.screenshot({ path: `${DIR}${sample.id}.png`, fullPage: true })
    console.log(`${sample.id}.png`)
  }
} finally {
  await browser.close()
}
writeFileSync(`${DIR}samples.json`, `${JSON.stringify({ samples }, null, 2)}\n`)
