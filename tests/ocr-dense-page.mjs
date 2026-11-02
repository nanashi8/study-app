// 文字の詰まったページの試料を作る（tests/photo-ocr-dense-page.test.mjs）。教科書の写真はリポジトリに入れないので、同じ大きさ・行数・
// 行の長さのページを、このテストのために書いた英文から描く。1500×2000 に長い行が約40行（1行が約100字）で、落ちた写真と同じ形。
const SENTENCES = [
  'Every morning the small harbor town wakes up slowly while fishing boats return with their heavy nets and hungry birds circle above them.',
  'Students who walk along the river on their way to school often stop at the old bridge to watch the water moving under the bright sun.',
  'When the market opens, farmers carry fresh vegetables from nearby villages and arrange them carefully on long wooden tables for visitors.',
  'Many people believe that reading a little every day improves their vocabulary much faster than studying long lists of difficult words.',
  'After the storm had passed, volunteers from several neighborhoods gathered at the community center to repair damaged roofs and fences.',
  'The museum recently opened a new exhibition explaining how ancient travelers used stars and mountains to find their way across deserts.',
]
export const DENSE_PAGE_LINES = Array.from({ length: 40 }, (_, at) => {
  const words = SENTENCES.join(' ').split(' ')
  const start = (at * 17) % words.length
  const line = []
  for (let i = 0; line.join(' ').length < 95; i += 1) line.push(words[(start + i) % words.length])
  return line.join(' ')
})

/** ページを PNG に描いて返す。browser は Playwright のブラウザ。 */
export async function renderDensePage(browser) {
  const page = await browser.newPage({ viewport: { width: 1500, height: 2000 } })
  await page.setContent(`<!doctype html><body style="margin:0;background:#fbfaf6;color:#222;font:27px/46px Georgia,'Times New Roman',serif;padding:60px 80px">${
    DENSE_PAGE_LINES.map((line) => `<div style="white-space:nowrap">${line}</div>`).join('')}</body>`)
  const png = await page.screenshot({ type: 'png' })
  await page.close()
  return png
}

/** 読み取った文字の中に、ページの行が何行あるか（空白と記号は見ない）。 */
export function denseLinesFound(text) {
  const plain = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, '')
  const read = plain(text)
  return DENSE_PAGE_LINES.filter((line) => read.includes(plain(line)))
}
