// 社会・理科の図（svg）の文字を、画面に描いたまま確かめる関数。Playwright の page.evaluate に渡して使う。
// tests/junior-social-science-figure-layout.test.mjs と、図を作るときの道具（リポジトリの外）が同じ判定を使う。
//   page.evaluate(inspectSubjectFigures, [図をふくむ要素の選択子, 場所の名前, 文字の大きさの下限px])
// 図（いちばん外の svg）ごとに、次の誤りを文で返す（空なら誤りなし）。
//   ・見えている文字（text）どうしの重なり（字の見える部分で比べる。ふちどり用に同じ位置に重ねた文字は1つに数える）
//   ・地図のラベルの上の読みがなと、ほかの文字の白いふちどり（1.5px）とのかかり（ラベル自身の読みがなは数えない）
//   ・地図の地名や読みがなが、ほかの点の印（丸・四角・三角・記号の丸）にかかること
//   ・文字が svg の枠の外へ1.5pxより大きくはみ出すこと
//   ・文字の大きさが下限（既定8px）より小さいこと（地図のラベルの上の小さな読みがなは、のぞく）
//   ・文字が、あとからかいた図形（箱・帯・印など）の下にかくれること
// 比べるのは字の枠（行の高さ）ではなく、字の見える部分。アプリの字体では、字の枠は基準線の上1.04字・下0.34字あり、
// 漢字の見える部分は上0.88字・下0.12字なので、枠の上を12%、下を16%けずって比べる（2026-09-30 に測った）。
// 文字の始まりの全角の「（」の左半分と、終わりの「）」の右半分も空いているので、けずって比べる。
export const inspectSubjectFigures = ([selector, label, minPx = 8]) => {
  const found = []
  const scope = document.querySelector(selector)
  if (!scope) return [`${label}: 画面が見つからない`]
  const figureName = (svg) => {
    const figure = svg.closest('[data-subject-figure]')
    const caption = figure?.querySelector('figcaption, [data-subject-figure-caption]')?.textContent?.trim()
    return caption || figure?.getAttribute('data-subject-figure') || 'の図'
  }
  for (const svg of scope.querySelectorAll('svg')) {
    if (svg.parentElement.closest('svg')) continue
    const frame = svg.getBoundingClientRect()
    if (frame.width < 40 || frame.height < 40) continue
    const texts = []
    for (const element of svg.querySelectorAll('text')) {
      const text = (element.textContent ?? '').trim()
      if (!text) continue
      const style = getComputedStyle(element)
      if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) continue
      const box = element.getBoundingClientRect()
      if (!box.width || !box.height) continue
      // 全角のかっこは、外側の半字が空いている（「（」は左、「）」は右）。
      const em = box.height / 1.38
      const left = box.left + (/^[（「『【〔]/.test(text) ? em * 0.5 : 0)
      const right = box.right - (/[）」』】〕]$/.test(text) ? em * 0.5 : 0)
      const rect = { left, right, top: box.top + box.height * 0.12, bottom: box.bottom - box.height * 0.16, width: right - left, height: box.height * 0.72 }
      // ふちどり用に同じ文字を同じ位置に重ねたものは1つに数える。
      if (texts.some((other) => other.text === text && Math.abs(other.rect.left - rect.left) < 1.5 && Math.abs(other.rect.top - rect.top) < 1.5)) continue
      const ruby = Boolean(element.closest('[data-subject-ruby]'))
      // 文字の大きさ（画面のpx）。図の縮みと回転をふくめて測る。地図のラベルの上の小さな読みがなは、のぞく。
      const ctm = element.getScreenCTM()
      const px = parseFloat(style.fontSize) * (ctm ? Math.hypot(ctm.a, ctm.b) : 1)
      texts.push({ text, rect, px, halo: element.closest('[data-subject-halo]'), ruby, point: element.closest('[data-subject-map-point]') })
    }
    // 文字が、あとからかいた図形（箱・帯・印など）の下にかくれていないか。文字の真ん中にいちばん上にある要素を調べる
    // （SVG の文字は字の枠で当たりを取るので、文字が見えていれば、いちばん上はその文字になる）。
    // 透明な図形や、塗りのない線、半透明の図形は、下の文字が見えるので数えない。
    svg.scrollIntoView({ block: 'center' })
    for (const element of svg.querySelectorAll('text')) {
      const text = (element.textContent ?? '').trim()
      if (!text || element.getAttribute('fill') === 'none') continue
      const box = element.getBoundingClientRect()
      if (!box.width || !box.height) continue
      // 文字の左から右へ5か所を調べる（真ん中だけでは、はしがかくれていても見のがす）。斜めの字は枠が字より広いので、
      // 枠の両はしは調べない。
      const italic = getComputedStyle(element).fontStyle === 'italic'
      const hidden = (italic ? [0.2, 0.35, 0.5, 0.65, 0.8] : [0.06, 0.25, 0.5, 0.75, 0.94]).some((at) => {
        const hit = document.elementFromPoint(box.left + box.width * at, box.top + box.height / 2)
        if (!hit || hit === element || hit.tagName.toLowerCase() === 'text' || !svg.contains(hit)) return false
        const style = getComputedStyle(hit)
        const fill = style.fill
        const transparent = fill === 'none' || /rgba\([^)]*,\s*0(\.\d+)?\)/.test(fill) || Number(style.opacity) < 1 || Number(style.fillOpacity) < 1
        return !transparent
      })
      if (hidden) found.push(`${label}「${figureName(svg)}」: 「${text.slice(0, 14)}」が図形の下にかくれる`)
    }
    // 地図の点の印（丸・四角・三角・記号の丸）。地名がほかの点の印にかかると読めない。
    const markers = [...svg.querySelectorAll('[data-subject-map-point]')].map((point) => ({ point, rect: point.firstElementChild.getBoundingClientRect() }))
    const name = figureName(svg)
    for (const { text, rect, point } of texts) {
      for (const marker of markers) {
        if (marker.point === point) continue
        const x = Math.min(rect.right, marker.rect.right) - Math.max(rect.left, marker.rect.left)
        const y = Math.min(rect.bottom, marker.rect.bottom) - Math.max(rect.top, marker.rect.top)
        if (x > 1 && y > 1) found.push(`${label}「${name}」: 「${text.slice(0, 14)}」がほかの点の印にかかる（${Math.round(x)}×${Math.round(y)}px）`)
      }
    }
    for (const { text, px, ruby } of texts) {
      if (!ruby && px < minPx - 0.05) found.push(`${label}「${name}」: 「${text.slice(0, 14)}」の文字が${Math.round(px * 10) / 10}px（${minPx}px未満）`)
    }
    for (const { text, rect } of texts) {
      const out = Math.max(frame.left - rect.left, rect.right - frame.right, frame.top - rect.top, rect.bottom - frame.bottom)
      if (out > 1.5) found.push(`${label}「${name}」: 「${text.slice(0, 14)}」が図の外に${Math.round(out)}px はみ出す`)
    }
    for (let i = 0; i < texts.length; i += 1) {
      for (let j = i + 1; j < texts.length; j += 1) {
        // ラベルと、そのラベル自身の読みがな。
        if (texts[i].halo && texts[i].halo === texts[j].halo && texts[i].ruby !== texts[j].ruby) continue
        const a = texts[i].rect
        const b = texts[j].rect
        const x = Math.min(a.right, b.right) - Math.max(a.left, b.left)
        const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
        // 読みがなは字が小さく、ほかのラベルの白いふちどり（字の見える部分の外1.5px）に少しかかっただけで欠けて読めなくなる
        // （2026-09-30、牧ノ原の「まきのはら」が焼津港のふちどりで「まぞのはら」に見えた）。読みがなは、ふちどりの幅まで離す。
        if ((texts[i].ruby || texts[j].ruby) && x > -1.5 && y > -1.5) {
          found.push(`${label}「${name}」: 読みがな「${(texts[i].ruby ? texts[i] : texts[j]).text}」が「${(texts[i].ruby ? texts[j] : texts[i]).text.slice(0, 14)}」のふちどりにかかる`)
          continue
        }
        if (x <= 1.5 || y <= 1.5) continue
        const smaller = Math.min(a.width * a.height, b.width * b.height)
        if (x * y < smaller * 0.12) continue
        found.push(`${label}「${name}」: 「${texts[i].text.slice(0, 14)}」と「${texts[j].text.slice(0, 14)}」が重なる（${Math.round(x)}×${Math.round(y)}px）`)
      }
    }
  }
  return found
}
