// 写真の文字の読み取り（2026-11-03 に組み直した）。PaddleOCR のモデル2つ（検出・認識）を ONNX Runtime の wasm で直接動かし、
// 前後処理はここで書く。既製の SDK（@paddleocr/paddleocr-js）と OpenCV は使わない。
//
// 組み直した理由：SDK と OpenCV の上で動かしていたときは、文字の多い教科書のページで iPhone が落ちた（11-02 に2度直しても落ちた）。
// 中で何にどれだけ使うかをこちらで決められず、外から押さえ込むしかなかった。ここでは、メモリを使う所をすべてこちらで決めて上限を持つ
// （WebKit の本当の使用量の山：添付の教科書のページで 1,514MB → 約400MB）。
// - 検出は、写真を長い辺 DET_MAX_SIDE まで縮め、1回に計算する画素を DET_PIXELS までにする。超える写真は帯に分けて1本ずつ計算する。
//   計算の途中の領域は帯の大きさで決まり、写真が大きくても増えない。
// - 認識は1行ずつ。長い行は語の切れ目で REC_CHUNK 以下に分けて計算する。
// - 認識の出力は、字の位置ごとの「最も確かな1字」だけを受け取る（モデルの最後に TopK を足す。withTopOutput）。
// - 画像の処理は canvas（OffscreenCanvas）で行い、ほかの部品を読み込まない。
//
// 画面からは ocrWorker.js（別スレッド）がこれを呼ぶ。

export const DET_MAX_SIDE = 1600
export const DET_PIXELS = 1600 * 512
export const DET_STRIP = 512
export const DET_STRIP_OVERLAP = 128
export const DET_THRESH = 0.2
export const DET_BOX_THRESH = 0.4
export const DET_UNCLIP_RATIO = 1.4
export const DET_MIN_SIDE = 3
export const REC_HEIGHT = 48
export const REC_MIN_WIDTH = 320
export const REC_MAX_WIDTH = 3200
export const REC_CHUNK = 960

const DET_MEAN = [0.485, 0.456, 0.406]
const DET_STD = [0.229, 0.224, 0.225]

/** 認識モデルの設定（inference.yml）から字の一覧を取り出す。最後に空白を足す（PaddleOCR と同じ）。 */
export function parseCharDict(yamlText) {
  const lines = String(yamlText).split('\n')
  const start = lines.findIndex((line) => /^\s*character_dict:\s*$/.test(line))
  if (start < 0) throw new Error('character_dict not found')
  const chars = []
  for (const line of lines.slice(start + 1)) {
    const match = /^\s*-\s?(.*)$/.exec(line)
    if (!match) break
    chars.push(unquoteYaml(match[1]))
  }
  return [...chars, ' ']
}

function unquoteYaml(raw) {
  const value = raw.trimEnd()
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) return value.slice(1, -1).replace(/''/g, "'")
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) return JSON.parse(value)
  return value
}

/** tar（モデルの配布の形）から、名前が suffix で終わるファイルの中身を取り出す。 */
export function readTarEntry(buffer, suffix) {
  const bytes = new Uint8Array(buffer)
  const decoder = new TextDecoder()
  for (let at = 0; at + 512 <= bytes.length;) {
    const name = decoder.decode(bytes.subarray(at, at + 100)).replace(/\0.*$/s, '')
    if (!name) break
    const size = parseInt(decoder.decode(bytes.subarray(at + 124, at + 136)).replace(/\0.*$/s, '').trim() || '0', 8)
    const body = at + 512
    if (name.endsWith(suffix)) return bytes.slice(body, body + size)
    at = body + Math.ceil(size / 512) * 512
  }
  throw new Error(`${suffix} not found in model archive`)
}

/** 検出に渡す大きさ（32の倍数）。長い辺を DET_MAX_SIDE までに縮める。 */
export function detSize(width, height, maxSide = DET_MAX_SIDE) {
  const scale = Math.min(1, maxSide / Math.max(width, height))
  const round32 = (value) => Math.max(32, Math.round((value * scale) / 32) * 32)
  return { width: round32(width), height: round32(height) }
}

/** 検出の帯（高さ DET_STRIP、重ね DET_STRIP_OVERLAP）。core はその帯が受け持つ範囲（行の中心がここにあれば拾う）。 */
export function detStrips(height, strip = DET_STRIP, overlap = DET_STRIP_OVERLAP) {
  if (height <= strip) return [{ top: 0, height, coreTop: 0, coreBottom: height }]
  const step = strip - overlap
  const strips = []
  for (let top = 0; ; top += step) {
    const last = top + strip >= height
    const start = last ? height - strip : top
    strips.push({ top: start, height: strip })
    if (last) break
  }
  // 受け持ちは、隣の帯との重なりの真ん中で分ける（最後の帯は写真の下端にそろえるので、前の帯との重なりが広いことがある）。
  return strips.map((item, index) => ({
    ...item,
    coreTop: index === 0 ? 0 : (item.top + strips[index - 1].top + strips[index - 1].height) / 2,
    coreBottom: index === strips.length - 1 ? height : (strips[index + 1].top + item.top + item.height) / 2,
  }))
}

/** RGBA の画素を、検出モデルの入力（BGR・正規化・CHW）にする。 */
export function detInput(rgba, width, height, out = new Float32Array(3 * width * height)) {
  const plane = width * height
  for (let i = 0; i < plane; i += 1) {
    const p = i * 4
    out[i] = (rgba[p + 2] / 255 - DET_MEAN[0]) / DET_STD[0]
    out[i + plane] = (rgba[p + 1] / 255 - DET_MEAN[1]) / DET_STD[1]
    out[i + 2 * plane] = (rgba[p] / 255 - DET_MEAN[2]) / DET_STD[2]
  }
  return out
}

// 点の集まりの凸包（Andrew の方法）。
function convexHull(points) {
  const sorted = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  if (sorted.length < 3) return sorted
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const point of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) lower.pop()
    lower.push(point)
  }
  const upper = []
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const point = sorted[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) upper.pop()
    upper.push(point)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

/** 点を囲む面積最小の長方形 { cx, cy, w, h, angle }。w は横に近い向きの辺、angle はその向き（ラジアン、-π/4〜π/4）。 */
export function minAreaRect(points) {
  const hull = convexHull(points)
  let best = null
  const edges = hull.length < 2 ? [[1, 0]] : hull.map((point, i) => {
    const next = hull[(i + 1) % hull.length]
    return [next[0] - point[0], next[1] - point[1]]
  })
  for (const [ex, ey] of edges) {
    const length = Math.hypot(ex, ey)
    if (!length) continue
    const ux = ex / length
    const uy = ey / length
    let minU = Infinity; let maxU = -Infinity; let minV = Infinity; let maxV = -Infinity
    for (const [x, y] of hull) {
      const u = x * ux + y * uy
      const v = -x * uy + y * ux
      if (u < minU) minU = u
      if (u > maxU) maxU = u
      if (v < minV) minV = v
      if (v > maxV) maxV = v
    }
    const area = (maxU - minU) * (maxV - minV)
    if (!best || area < best.area) {
      const cu = (minU + maxU) / 2
      const cv = (minV + maxV) / 2
      best = { area, cx: cu * ux - cv * uy, cy: cu * uy + cv * ux, w: maxU - minU, h: maxV - minV, angle: Math.atan2(uy, ux) }
    }
  }
  if (!best) {
    const [x, y] = hull[0] ?? [0, 0]
    return { cx: x, cy: y, w: 0, h: 0, angle: 0 }
  }
  // 向きを -π/4〜π/4 にそろえる（90度回すと幅と高さが入れかわる）。
  let { angle, w, h } = best
  while (angle > Math.PI / 4) { angle -= Math.PI / 2; [w, h] = [h, w] }
  while (angle <= -Math.PI / 4) { angle += Math.PI / 2; [w, h] = [h, w] }
  return { cx: best.cx, cy: best.cy, w, h, angle }
}

/** 長方形の4つの角（左上・右上・右下・左下）。 */
export function rectCorners({ cx, cy, w, h, angle }) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([u, v]) => [cx + u * cos - v * sin, cy + u * sin + v * cos])
}

// 長方形の中の確からしさの平均（PaddleOCR の box_score_fast と同じく、箱の中の画素の平均）。
function rectScore(prob, width, height, rect) {
  const corners = rectCorners(rect)
  const xs = corners.map((point) => point[0])
  const ys = corners.map((point) => point[1])
  const minX = Math.max(0, Math.floor(Math.min(...xs)))
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...xs)))
  const minY = Math.max(0, Math.floor(Math.min(...ys)))
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...ys)))
  const cos = Math.cos(rect.angle)
  const sin = Math.sin(rect.angle)
  let sum = 0
  let count = 0
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - rect.cx
      const dy = y - rect.cy
      if (Math.abs(dx * cos + dy * sin) <= rect.w / 2 + 0.5 && Math.abs(-dx * sin + dy * cos) <= rect.h / 2 + 0.5) {
        sum += prob[y * width + x]
        count += 1
      }
    }
  }
  return count ? sum / count : 0
}

/**
 * 検出の出力（字らしさの地図 width×height）から行の長方形を取り出す。
 * 地図の座標のまま返す（{ rect, score }）。keep(rect) が false の行は捨てる（帯の受け持ちの外）。
 */
export function boxesFromProbMap(prob, width, height, {
  thresh = DET_THRESH, boxThresh = DET_BOX_THRESH, unclipRatio = DET_UNCLIP_RATIO, keep = () => true,
} = {}) {
  const labels = new Int32Array(width * height)
  const stack = new Int32Array(width * height)
  const boxes = []
  let label = 0
  for (let start = 0; start < labels.length; start += 1) {
    if (labels[start] || prob[start] <= thresh) continue
    label += 1
    labels[start] = label
    let top = 0
    stack[top++] = start
    // 行ごとの左端と右端だけを点にする（凸包はそれで決まる）。
    const rowMin = new Map()
    const rowMax = new Map()
    while (top) {
      const at = stack[--top]
      const x = at % width
      const y = (at - x) / width
      if (!(rowMin.get(y) <= x)) rowMin.set(y, x)
      if (!(rowMax.get(y) >= x)) rowMax.set(y, x)
      for (let dy = -1; dy <= 1; dy += 1) {
        const ny = y + dy
        if (ny < 0 || ny >= height) continue
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx
          if (nx < 0 || nx >= width) continue
          const next = ny * width + nx
          if (!labels[next] && prob[next] > thresh) {
            labels[next] = label
            stack[top++] = next
          }
        }
      }
    }
    const points = []
    for (const [y, x] of rowMin) {
      // 画素の四隅を点にする（輪郭は画素の外側をなぞる）。
      points.push([x, y], [x, y + 1], [rowMax.get(y) + 1, y], [rowMax.get(y) + 1, y + 1])
    }
    if (points.length < 4) continue
    const rect = minAreaRect(points)
    if (Math.min(rect.w, rect.h) < DET_MIN_SIDE) continue
    const score = rectScore(prob, width, height, rect)
    if (score < boxThresh) continue
    // 縮めて学習した字の領域を、元の大きさへ広げる（PaddleOCR の unclip。長方形なら四方へ同じだけ広げるのと同じ）。
    const distance = (rect.w * rect.h * unclipRatio) / (2 * (rect.w + rect.h))
    const grown = { ...rect, w: rect.w + 2 * distance, h: rect.h + 2 * distance }
    if (Math.min(grown.w, grown.h) < DET_MIN_SIDE + 2) continue
    if (!keep(grown)) continue
    boxes.push({ rect: grown, score })
  }
  return boxes
}

/** 行を上から下・左から右の順に並べる（PaddleOCR と同じく、左上の角で比べ、同じ高さの行は左から）。 */
export function sortLines(lines) {
  const sorted = lines.slice().sort((a, b) => a.poly[0][1] - b.poly[0][1] || a.poly[0][0] - b.poly[0][0])
  for (let i = 0; i < sorted.length - 1; i += 1) {
    for (let j = i; j >= 0; j -= 1) {
      const a = sorted[j]
      const b = sorted[j + 1]
      if (Math.abs(b.poly[0][1] - a.poly[0][1]) < 10 && b.poly[0][0] < a.poly[0][0]) {
        sorted[j] = b
        sorted[j + 1] = a
      } else break
    }
  }
  return sorted
}

/** 認識の入力の幅。PaddleOCR と同じく最低 REC_MIN_WIDTH、上限 REC_MAX_WIDTH。 */
export function recWidths(cropWidth, cropHeight) {
  const ratio = cropWidth / Math.max(1, cropHeight)
  const width = Math.min(REC_MAX_WIDTH, Math.max(REC_MIN_WIDTH, Math.trunc(REC_HEIGHT * ratio)))
  return { width, drawn: Math.max(1, Math.min(width, Math.ceil(REC_HEIGHT * ratio))) }
}

/** 認識の入力（BGR・正規化・CHW、右の余りは 0）。rgba は幅 stride・高さ REC_HEIGHT の画素で、列 from から count 列を使う。 */
export function recInput(rgba, stride, from, count, width, out = new Float32Array(3 * REC_HEIGHT * width)) {
  out.fill(0, 0, 3 * REC_HEIGHT * width)
  const plane = REC_HEIGHT * width
  for (let y = 0; y < REC_HEIGHT; y += 1) {
    for (let x = 0; x < count; x += 1) {
      const p = (y * stride + from + x) * 4
      const i = y * width + x
      out[i] = rgba[p + 2] / 127.5 - 1
      out[i + plane] = rgba[p + 1] / 127.5 - 1
      out[i + 2 * plane] = rgba[p] / 127.5 - 1
    }
  }
  return out
}

/**
 * 長い行を、字のない列（語の切れ目）で REC_CHUNK 以下の区切りに分ける。返り値 [{ from, count, gap }]。
 * gap は前の区切りとのあいだが空白の列だったか（英語なら語のあいだの空白）。
 * 認識の計算の途中の領域は行の幅に比例するので、長い行を1度に計算させない（2026-11-03、WebKit で長い行が約170MB を足していた）。
 */
export function splitLine(rgba, stride, drawn, chunk = REC_CHUNK) {
  if (drawn <= chunk) return [{ from: 0, count: drawn, gap: false }]
  // 列ごとの明るさの幅（最も明るい画素 − 最も暗い画素）。字のない列は小さい。
  const range = new Float32Array(drawn)
  for (let x = 0; x < drawn; x += 1) {
    let min = 255
    let max = 0
    for (let y = 0; y < REC_HEIGHT; y += 1) {
      const p = (y * stride + x) * 4
      const lum = 0.299 * rgba[p] + 0.587 * rgba[p + 1] + 0.114 * rgba[p + 2]
      if (lum < min) min = lum
      if (lum > max) max = lum
    }
    range[x] = max - min
  }
  const sortedRange = Array.from(range).sort((a, b) => a - b)
  const quiet = sortedRange[Math.floor(drawn * 0.05)] + 0.15 * (sortedRange[Math.floor(drawn * 0.95)] - sortedRange[Math.floor(drawn * 0.05)])
  const parts = []
  let from = 0
  let gapBefore = false
  while (drawn - from > chunk) {
    // 区切りの後ろ 4 割の中で、字のない列が最も長く続く所の真ん中で切る。なければ最も字の少ない列で切る。
    const low = from + Math.floor(chunk * 0.6)
    const high = from + chunk
    let best = -1
    let bestRun = 0
    let runStart = -1
    for (let x = low; x <= high; x += 1) {
      if (range[x] <= quiet) {
        if (runStart < 0) runStart = x
        const run = x - runStart + 1
        if (run > bestRun) {
          bestRun = run
          best = Math.floor((runStart + x) / 2)
        }
      } else runStart = -1
    }
    if (best < 0) {
      best = low
      for (let x = low; x <= high; x += 1) if (range[x] < range[best]) best = x
    }
    parts.push({ from, count: best - from, gap: gapBefore })
    gapBefore = bestRun >= REC_HEIGHT * 0.2
    from = best
  }
  parts.push({ from, count: drawn - from, gap: gapBefore })
  return parts
}

// 分けて読んだ区切りの文字をつなぐ。語の切れ目で分けたときは、両側が英字・数字なら空白を入れる（日本語には入れない）。
export function joinParts(parts) {
  let text = ''
  for (const part of parts) {
    if (!part.text) continue
    if (text && part.gap && /[\x21-\x7e]$/.test(text) && /^[\x21-\x7e]/.test(part.text)) text += ' '
    text += part.text
  }
  return text
}

/** 認識の出力（字の位置ごとの、最も確かな字の番号と確率）を文字にする（CTC：同じ字の続きと空白をまとめる）。 */
export function decodeTop(values, indices, chars) {
  let previous = -1
  let text = ''
  let sum = 0
  let count = 0
  for (let step = 0; step < indices.length; step += 1) {
    const best = Number(indices[step])
    if (best > 0 && best !== previous) {
      text += chars[best - 1] ?? ''
      sum += values[step]
      count += 1
    }
    previous = best
  }
  return { text, score: count ? sum / count : 0 }
}

// 認識モデルの出力は字の位置ごとに約1.8万字ぶんの確率で、1行で数 MB〜十数 MB の配列になる。毎行これを JavaScript へ写すと
// 回収が追いつかずに積み上がった（2026-11-02、WebKit で約850MB）。モデルの最後に「最も確かな1字（TopK、k=1）」の計算を
// 足し、その結果（字の位置ごとに番号と確率の2つ）だけを受け取る。大きな配列は ONNX Runtime の中で使い回される。
export const REC_TOP_VALUE = 'ocr_top_value'
export const REC_TOP_INDEX = 'ocr_top_index'

// protobuf の読み書き（ONNX のモデルは protobuf）。足す計算に要る分だけ。
function varint(value) {
  const bytes = []
  let rest = BigInt(value)
  do {
    let byte = Number(rest & 0x7fn)
    rest >>= 7n
    if (rest) byte |= 0x80
    bytes.push(byte)
  } while (rest)
  return bytes
}
const encoder = new TextEncoder()
const concat = (parts) => {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0))
  let at = 0
  for (const part of parts) {
    out.set(part, at)
    at += part.length
  }
  return out
}
const fieldVarint = (field, value) => Uint8Array.from([...varint((field << 3) | 0), ...varint(value)])
const fieldBytes = (field, bytes) => concat([Uint8Array.from([...varint((field << 3) | 2), ...varint(bytes.length)]), bytes])
const fieldString = (field, text) => fieldBytes(field, encoder.encode(text))

function readFields(bytes) {
  const fields = []
  let at = 0
  const readVarint = () => {
    let result = 0n
    let shift = 0n
    for (;;) {
      const byte = bytes[at++]
      result |= BigInt(byte & 0x7f) << shift
      if (!(byte & 0x80)) return result
      shift += 7n
    }
  }
  while (at < bytes.length) {
    const start = at
    const key = Number(readVarint())
    const field = key >> 3
    const wire = key & 7
    let value
    if (wire === 0) value = readVarint()
    else if (wire === 1) at += 8
    else if (wire === 5) at += 4
    else if (wire === 2) {
      const length = Number(readVarint())
      value = bytes.subarray(at, at + length)
      at += length
    } else throw new Error(`unsupported protobuf wire type ${wire}`)
    fields.push({ field, wire, value, raw: bytes.subarray(start, at) })
  }
  return fields
}

/** 認識モデル（.onnx のバイト列）の最後に TopK（k=1）を足したモデルを返す。足してあればそのまま返す。 */
export function withTopOutput(model) {
  const bytes = model instanceof Uint8Array ? model : new Uint8Array(model)
  const top = readFields(bytes)
  const graphField = top.find((item) => item.field === 7)
  if (!graphField) throw new Error('graph not found in model')
  const graph = readFields(graphField.value)
  const outputNames = graph.filter((item) => item.field === 12)
    .map((item) => new TextDecoder().decode(readFields(item.value).find((field) => field.field === 1).value))
  // 書き足し済み（公開版で配るモデル。scripts/ocr-models.mjs）なら、そのまま使う。
  if (outputNames.includes(REC_TOP_INDEX)) return bytes
  const outputName = outputNames[0]
  const kName = 'ocr_top_k'
  const node = concat([
    fieldString(1, outputName), fieldString(1, kName), fieldString(2, REC_TOP_VALUE), fieldString(2, REC_TOP_INDEX),
    fieldString(3, 'ocr_top'), fieldString(4, 'TopK'),
    fieldBytes(5, concat([fieldString(1, 'axis'), fieldVarint(3, 2), fieldVarint(20, 2)])),
  ])
  const k = concat([fieldVarint(1, 1), fieldVarint(2, 7), fieldString(8, kName), fieldBytes(9, Uint8Array.from([1, 0, 0, 0, 0, 0, 0, 0]))])
  const valueInfo = (name, elemType) => concat([fieldString(1, name), fieldBytes(2, fieldBytes(1, fieldVarint(1, elemType)))])
  const newGraph = concat([graphField.value, fieldBytes(1, node), fieldBytes(5, k), fieldBytes(12, valueInfo(REC_TOP_VALUE, 1)), fieldBytes(12, valueInfo(REC_TOP_INDEX, 7))])
  return concat(top.map((item) => (item === graphField ? fieldBytes(7, newGraph) : item.raw)))
}

/**
 * 読み取りエンジンを作る。
 *   ort          ONNX Runtime（onnxruntime-web/wasm か onnxruntime-node）
 *   detModel     検出モデル（.onnx のバイト列）
 *   recModel     認識モデル（.onnx のバイト列）
 *   chars        字の一覧（parseCharDict）
 *   createCanvas (width, height) => canvas（getContext('2d') が使えるもの）
 */
export async function createOcrPipeline({
  ort, detModel, recModel, chars, createCanvas, sessionOptions = {}, detMaxSide = DET_MAX_SIDE, detPixels = DET_PIXELS,
}) {
  const options = { executionProviders: ['wasm'], graphOptimizationLevel: 'all', logSeverityLevel: 3, ...sessionOptions }
  const det = await ort.InferenceSession.create(detModel, options)
  const rec = await ort.InferenceSession.create(withTopOutput(recModel), options)
  // 入出力の配列は使い回す（大きさが足りないときだけ作り直す）。
  const buffers = {}
  const buffer = (name, length) => {
    if (!buffers[name] || buffers[name].length < length) buffers[name] = new Float32Array(length)
    return buffers[name].subarray(0, length)
  }

  // canvas に描いた写真の、区画 { x, y, w, h } で字のある所を探す。座標は canvas のまま返す。keep(cx, cy) が false の行は捨てる。
  async function detectRegion(context, region, keep = () => true) {
    const pixels = context.getImageData(region.x, region.y, region.w, region.h).data
    const input = detInput(pixels, region.w, region.h, buffer('det', 3 * region.w * region.h))
    const feeds = { [det.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, region.h, region.w]) }
    const output = (await det.run(feeds))[det.outputNames[0]]
    const [mapHeight, mapWidth] = output.dims.slice(-2)
    const found = boxesFromProbMap(output.data, mapWidth, mapHeight, { keep: (rect) => keep(rect.cx + region.x, rect.cy + region.y) })
    output.dispose?.()
    return found.map((box) => ({ ...box, rect: { ...box.rect, cx: box.rect.cx + region.x, cy: box.rect.cy + region.y } }))
  }

  function drawScaled(source, size) {
    const canvas = createCanvas(size.width, size.height)
    const context = canvas.getContext('2d', { willReadFrequently: true })
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.drawImage(source, 0, 0, size.width, size.height)
    return { canvas, context }
  }

  const release = (canvas) => {
    canvas.width = 0
    canvas.height = 0
  }

  // 地図の座標（大きさ size）から写真の座標へ。
  const toSource = (rects, size, width, height) => {
    const sx = width / size.width
    const sy = height / size.height
    return rects.map(({ rect, score }) => {
      const poly = rectCorners(rect).map(([x, y]) => [
        Math.min(width, Math.max(0, Math.round(x * sx))),
        Math.min(height, Math.max(0, Math.round(y * sy))),
      ])
      return { poly, score, rect: { cx: rect.cx * sx, cy: rect.cy * sy, w: rect.w * sx, h: rect.h * sy, angle: rect.angle } }
    })
  }

  // 1回の検出で計算する画素は detPixels まで（計算の途中の領域はこれに比例する）。
  // 収まらない写真は、まず収まる大きさまで縮めて全体を見る（大きな字の行を拾い、横書きか縦書きかを見る）。次に元の細かさで帯に分けて
  // 見直す（小さな字の行を拾う）。帯は、横書きが主なら横の帯、縦書きが主なら縦の帯（列）にする（縦書きの列を横の帯で切らない）。
  // 帯の重なりより長い行（大きな見出し・帯を横切る行）は帯の境目で切れるので、縮めて見た結果から取り、中の切れた行（かけら）は捨てる。
  async function detect(source, width, height, onProgress) {
    const size = detSize(width, height, detMaxSide)
    if (size.width * size.height <= detPixels) {
      const { canvas, context } = drawScaled(source, size)
      const found = await detectRegion(context, { x: 0, y: 0, w: size.width, h: size.height })
      release(canvas)
      onProgress?.(1)
      return toSource(found, size, width, height)
    }
    const coarseSize = detSize(width, height, Math.floor(Math.max(size.width, size.height) * Math.sqrt(detPixels / (size.width * size.height))))
    const coarse = drawScaled(source, coarseSize)
    const overview = await detectRegion(coarse.context, { x: 0, y: 0, w: coarseSize.width, h: coarseSize.height })
    release(coarse.canvas)
    onProgress?.(0.25)
    // 縮めて見た行を、元の細かさの座標にする。
    const outline = toSource(overview, coarseSize, size.width, size.height).map(({ rect, score, poly }) => {
      const xs = poly.map((point) => point[0])
      const ys = poly.map((point) => point[1])
      return { rect, score, spanX: Math.max(...xs) - Math.min(...xs), spanY: Math.max(...ys) - Math.min(...ys) }
    })
    // 帯の向き：横の帯（y に沿って区切る）か縦の帯（x に沿って区切る）か。帯の重なりより長くて境目で切れてしまう行の面積が少ないほうにする。
    const plan = (columns) => {
      const across = columns ? size.height : size.width
      const thickness = Math.max(128, Math.floor(detPixels / across / 32) * 32)
      const overlap = Math.max(DET_STRIP_OVERLAP, Math.floor(thickness / 2 / 32) * 32)
      const long = outline.filter((box) => (columns ? box.spanX : box.spanY) > overlap - 16)
      return { columns, thickness, overlap, long, cost: long.reduce((sum, box) => sum + box.spanX * box.spanY, 0) }
    }
    const rowsPlan = plan(false)
    const columnsPlan = plan(true)
    const { columns, thickness, overlap, long } = columnsPlan.cost < rowsPlan.cost ? columnsPlan : rowsPlan
    const along = columns ? size.width : size.height
    const inside = (rect, cx, cy) => {
      const dx = cx - rect.cx
      const dy = cy - rect.cy
      const cos = Math.cos(rect.angle)
      const sin = Math.sin(rect.angle)
      return Math.abs(dx * cos + dy * sin) <= rect.w / 2 && Math.abs(-dx * sin + dy * cos) <= rect.h / 2
    }
    const { canvas, context } = drawScaled(source, size)
    const strips = detStrips(along, thickness, overlap)
    const fine = []
    for (const [index, strip] of strips.entries()) {
      const region = columns ? { x: strip.top, y: 0, w: strip.height, h: size.height } : { x: 0, y: strip.top, w: size.width, h: strip.height }
      const found = await detectRegion(context, region, (cx, cy) => {
        const at = columns ? cx : cy
        return at >= strip.coreTop && at < strip.coreBottom
      })
      for (const box of found) {
        const corners = rectCorners(box.rect).map((point) => (columns ? point[0] : point[1]))
        // 帯の境目にかかった行は、境目で切れている。
        const cut = (strip.top > 0 && Math.min(...corners) <= strip.top + 2) || (strip.top + strip.height < along && Math.max(...corners) >= strip.top + strip.height - 2)
        fine.push({ ...box, cut })
      }
      onProgress?.(0.25 + 0.75 * ((index + 1) / strips.length))
    }
    release(canvas)
    // 縮めて見た長い行のうち、中に帯の境目で切れた行があるものは本当に長い行なので、それを使い、中の切れた行を捨てる。
    // 中の行がどれも切れずに収まっているものは、縮めたために近い行どうしがくっついた塊なので、捨てて帯の結果を使う。
    // 大きな字のすぐそばの小さな行は、縮めると大きな字とくっつくが、帯では切れずに読めるので残す。
    const rects = []
    const dropped = new Set()
    for (const big of long) {
      const members = fine.filter((box) => inside(big.rect, box.rect.cx, box.rect.cy))
      if (members.length && !members.some((box) => box.cut)) continue
      rects.push({ rect: big.rect, score: big.score })
      for (const box of members) if (box.cut) dropped.add(box)
    }
    for (const box of fine) if (!dropped.has(box)) rects.push({ rect: box.rect, score: box.score })
    return toSource(rects, size, width, height)
  }

  const topNames = [REC_TOP_VALUE, REC_TOP_INDEX]
  async function runRec(feeds) {
    const outputs = await rec.run(feeds, topNames)
    return { values: outputs[REC_TOP_VALUE], indices: outputs[REC_TOP_INDEX] }
  }

  async function recognize(source, rect) {
    // 長方形を水平に起こして切り出す。縦に長い（縦書き）なら左へ90度回して横にする。
    const cropW = Math.max(1, Math.floor(rect.w))
    const cropH = Math.max(1, Math.floor(rect.h))
    const vertical = cropH / cropW >= 1.5
    const { width, drawn } = vertical ? recWidths(cropH, cropW) : recWidths(cropW, cropH)
    const line = createCanvas(drawn, REC_HEIGHT)
    const context = line.getContext('2d', { willReadFrequently: true })
    context.imageSmoothingEnabled = true
    context.imageSmoothingQuality = 'high'
    context.translate(drawn / 2, REC_HEIGHT / 2)
    if (vertical) {
      context.scale(drawn / cropH, REC_HEIGHT / cropW)
      context.rotate(-Math.PI / 2)
    } else {
      context.scale(drawn / cropW, REC_HEIGHT / cropH)
    }
    context.rotate(-rect.angle)
    context.translate(-rect.cx, -rect.cy)
    context.drawImage(source, 0, 0)
    const pixels = context.getImageData(0, 0, drawn, REC_HEIGHT).data
    line.width = 0
    line.height = 0
    const parts = []
    for (const part of splitLine(pixels, drawn, drawn)) {
      const partWidth = drawn === part.count ? width : Math.max(REC_MIN_WIDTH, part.count)
      const input = recInput(pixels, drawn, part.from, part.count, partWidth, buffer('rec', 3 * REC_HEIGHT * partWidth))
      const feeds = { [rec.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, REC_HEIGHT, partWidth]) }
      const { values, indices } = await runRec(feeds)
      parts.push({ ...decodeTop(values.data, indices.data, chars), gap: part.gap })
      values.dispose?.()
      indices.dispose?.()
    }
    const scored = parts.filter((part) => part.text)
    const result = { text: joinParts(parts), score: scored.length ? scored.reduce((sum, part) => sum + part.score, 0) / scored.length : 0 }
    return result
  }

  return {
    /**
     * 写真1枚を読む。source は canvas に描けるもの（ImageBitmap・canvas）。
     * 返り値 { items: [{ text, score, poly }] }（上から下の順）。
     */
    async read(source, { width = source.width, height = source.height, onProgress } = {}) {
      const boxes = sortLines(await detect(source, width, height, (fraction) => onProgress?.(0.2 * fraction)))
      const items = []
      for (const [index, box] of boxes.entries()) {
        const { text, score } = await recognize(source, box.rect)
        if (text.trim()) items.push({ text, score, poly: box.poly })
        onProgress?.(0.2 + 0.8 * ((index + 1) / boxes.length))
      }
      return { items }
    },
    async dispose() {
      await det.release?.()
      await rec.release?.()
    },
  }
}
